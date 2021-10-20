(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/entry_point_finder/targeted_entry_point_finder", ["require", "exports", "tslib", "@angular/compiler-cli/ngcc/src/packages/build_marker", "@angular/compiler-cli/ngcc/src/packages/entry_point", "@angular/compiler-cli/ngcc/src/entry_point_finder/tracing_entry_point_finder"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TargetedEntryPointFinder = void 0;
    var tslib_1 = require("tslib");
    var build_marker_1 = require("@angular/compiler-cli/ngcc/src/packages/build_marker");
    var entry_point_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point");
    var tracing_entry_point_finder_1 = require("@angular/compiler-cli/ngcc/src/entry_point_finder/tracing_entry_point_finder");
    /**
     * An EntryPointFinder that starts from a target entry-point and only finds
     * entry-points that are dependencies of the target.
     *
     * This is faster than searching the entire file-system for all the entry-points,
     * and is used primarily by the CLI integration.
     */
    var TargetedEntryPointFinder = /** @class */ (function (_super) {
        tslib_1.__extends(TargetedEntryPointFinder, _super);
        function TargetedEntryPointFinder(fs, config, logger, resolver, basePath, pathMappings, targetPath) {
            var _this = _super.call(this, fs, config, logger, resolver, basePath, pathMappings) || this;
            _this.targetPath = targetPath;
            return _this;
        }
        /**
         * Search for Angular entry-points that can be reached from the entry-point specified by the given
         * `targetPath`.
         */
        TargetedEntryPointFinder.prototype.findEntryPoints = function () {
            var _this = this;
            var entryPoints = _super.prototype.findEntryPoints.call(this);
            var invalidTarget = entryPoints.invalidEntryPoints.find(function (i) { return i.entryPoint.path === _this.targetPath; });
            if (invalidTarget !== undefined) {
                throw new Error("The target entry-point \"" + invalidTarget.entryPoint.name + "\" has missing dependencies:\n" +
                    invalidTarget.missingDependencies.map(function (dep) { return " - " + dep + "\n"; }).join(''));
            }
            return entryPoints;
        };
        /**
         * Determine whether the entry-point at the given `targetPath` needs to be processed.
         *
         * @param propertiesToConsider the package.json properties that should be considered for
         *     processing.
         * @param compileAllFormats true if all formats need to be processed, or false if it is enough for
         *     one of the formats covered by the `propertiesToConsider` is processed.
         */
        TargetedEntryPointFinder.prototype.targetNeedsProcessingOrCleaning = function (propertiesToConsider, compileAllFormats) {
            var e_1, _a;
            var entryPointWithDeps = this.getEntryPointWithDeps(this.targetPath);
            if (entryPointWithDeps === null) {
                return false;
            }
            try {
                for (var propertiesToConsider_1 = tslib_1.__values(propertiesToConsider), propertiesToConsider_1_1 = propertiesToConsider_1.next(); !propertiesToConsider_1_1.done; propertiesToConsider_1_1 = propertiesToConsider_1.next()) {
                    var property = propertiesToConsider_1_1.value;
                    if (entryPointWithDeps.entryPoint.packageJson[property]) {
                        // Here is a property that should be processed.
                        if (!build_marker_1.hasBeenProcessed(entryPointWithDeps.entryPoint.packageJson, property)) {
                            return true;
                        }
                        if (!compileAllFormats) {
                            // This property has been processed, and we only need one.
                            return false;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (propertiesToConsider_1_1 && !propertiesToConsider_1_1.done && (_a = propertiesToConsider_1.return)) _a.call(propertiesToConsider_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // All `propertiesToConsider` that appear in this entry-point have been processed.
            // In other words, there were no properties that need processing.
            return false;
        };
        /**
         * Return an array containing the `targetPath` from which to start the trace.
         */
        TargetedEntryPointFinder.prototype.getInitialEntryPointPaths = function () {
            return [this.targetPath];
        };
        /**
         * For the given `entryPointPath`, compute, or retrieve, the entry-point information, including
         * paths to other entry-points that this entry-point depends upon.
         *
         * @param entryPointPath the path to the entry-point whose information and dependencies are to be
         *     retrieved or computed.
         *
         * @returns the entry-point and its dependencies or `null` if the entry-point is not compiled by
         *     Angular or cannot be determined.
         */
        TargetedEntryPointFinder.prototype.getEntryPointWithDeps = function (entryPointPath) {
            var packagePath = this.computePackagePath(entryPointPath);
            var entryPoint = entry_point_1.getEntryPointInfo(this.fs, this.config, this.logger, packagePath, entryPointPath);
            if (!entry_point_1.isEntryPoint(entryPoint) || !entryPoint.compiledByAngular) {
                return null;
            }
            return this.resolver.getEntryPointWithDependencies(entryPoint);
        };
        /**
         * Compute the path to the package that contains the given entry-point.
         *
         * In this entry-point finder it is not trivial to find the containing package, since it is
         * possible that this entry-point is not directly below the directory containing the package.
         * Moreover, the import path could be affected by path-mapping.
         *
         * @param entryPointPath the path to the entry-point, whose package path we want to compute.
         */
        TargetedEntryPointFinder.prototype.computePackagePath = function (entryPointPath) {
            var e_2, _a;
            // First try the main basePath, to avoid having to compute the other basePaths from the paths
            // mappings, which can be computationally intensive.
            if (this.isPathContainedBy(this.basePath, entryPointPath)) {
                var packagePath = this.computePackagePathFromContainingPath(entryPointPath, this.basePath);
                if (packagePath !== null) {
                    return packagePath;
                }
            }
            try {
                // The main `basePath` didn't work out so now we try the `basePaths` computed from the paths
                // mappings in `tsconfig.json`.
                for (var _b = tslib_1.__values(this.getBasePaths()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var basePath = _c.value;
                    if (this.isPathContainedBy(basePath, entryPointPath)) {
                        var packagePath = this.computePackagePathFromContainingPath(entryPointPath, basePath);
                        if (packagePath !== null) {
                            return packagePath;
                        }
                        // If we got here then we couldn't find a `packagePath` for the current `basePath`.
                        // Since `basePath`s are guaranteed not to be a sub-directory of each other then no other
                        // `basePath` will match either.
                        break;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // Finally, if we couldn't find a `packagePath` using `basePaths` then try to find the nearest
            // `node_modules` that contains the `entryPointPath`, if there is one, and use it as a
            // `basePath`.
            return this.computePackagePathFromNearestNodeModules(entryPointPath);
        };
        /**
         * Compute whether the `test` path is contained within the `base` path.
         *
         * Note that this doesn't use a simple `startsWith()` since that would result in a false positive
         * for `test` paths such as `a/b/c-x` when the `base` path is `a/b/c`.
         *
         * Since `fs.relative()` can be quite expensive we check the fast possibilities first.
         */
        TargetedEntryPointFinder.prototype.isPathContainedBy = function (base, test) {
            return test === base ||
                (test.startsWith(base) && !this.fs.relative(base, test).startsWith('..'));
        };
        /**
         * Search down to the `entryPointPath` from the `containingPath` for the first `package.json` that
         * we come to. This is the path to the entry-point's containing package. For example if
         * `containingPath` is `/a/b/c` and `entryPointPath` is `/a/b/c/d/e` and there exists
         * `/a/b/c/d/package.json` and `/a/b/c/d/e/package.json`, then we will return `/a/b/c/d`.
         *
         * To account for nested `node_modules` we actually start the search at the last `node_modules` in
         * the `entryPointPath` that is below the `containingPath`. E.g. if `containingPath` is `/a/b/c`
         * and `entryPointPath` is `/a/b/c/d/node_modules/x/y/z`, we start the search at
         * `/a/b/c/d/node_modules`.
         */
        TargetedEntryPointFinder.prototype.computePackagePathFromContainingPath = function (entryPointPath, containingPath) {
            var e_3, _a;
            var packagePath = containingPath;
            var segments = this.splitPath(this.fs.relative(containingPath, entryPointPath));
            var nodeModulesIndex = segments.lastIndexOf('node_modules');
            // If there are no `node_modules` in the relative path between the `basePath` and the
            // `entryPointPath` then just try the `basePath` as the `packagePath`.
            // (This can be the case with path-mapped entry-points.)
            if (nodeModulesIndex === -1) {
                if (this.fs.exists(this.fs.join(packagePath, 'package.json'))) {
                    return packagePath;
                }
            }
            // Start the search at the deepest nested `node_modules` folder that is below the `basePath`
            // but above the `entryPointPath`, if there are any.
            while (nodeModulesIndex >= 0) {
                packagePath = this.fs.join(packagePath, segments.shift());
                nodeModulesIndex--;
            }
            try {
                // Note that we start at the folder below the current candidate `packagePath` because the
                // initial candidate `packagePath` is either a `node_modules` folder or the `basePath` with
                // no `package.json`.
                for (var segments_1 = tslib_1.__values(segments), segments_1_1 = segments_1.next(); !segments_1_1.done; segments_1_1 = segments_1.next()) {
                    var segment = segments_1_1.value;
                    packagePath = this.fs.join(packagePath, segment);
                    if (this.fs.exists(this.fs.join(packagePath, 'package.json'))) {
                        return packagePath;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (segments_1_1 && !segments_1_1.done && (_a = segments_1.return)) _a.call(segments_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return null;
        };
        /**
         * Search up the directory tree from the `entryPointPath` looking for a `node_modules` directory
         * that we can use as a potential starting point for computing the package path.
         */
        TargetedEntryPointFinder.prototype.computePackagePathFromNearestNodeModules = function (entryPointPath) {
            var packagePath = entryPointPath;
            var scopedPackagePath = packagePath;
            var containerPath = this.fs.dirname(packagePath);
            while (!this.fs.isRoot(containerPath) && !containerPath.endsWith('node_modules')) {
                scopedPackagePath = packagePath;
                packagePath = containerPath;
                containerPath = this.fs.dirname(containerPath);
            }
            if (this.fs.exists(this.fs.join(packagePath, 'package.json'))) {
                // The directory directly below `node_modules` is a package - use it
                return packagePath;
            }
            else if (this.fs.basename(packagePath).startsWith('@') &&
                this.fs.exists(this.fs.join(scopedPackagePath, 'package.json'))) {
                // The directory directly below the `node_modules` is a scope and the directory directly
                // below that is a scoped package - use it
                return scopedPackagePath;
            }
            else {
                // If we get here then none of the `basePaths` contained the `entryPointPath` and the
                // `entryPointPath` contains no `node_modules` that contains a package or a scoped
                // package. All we can do is assume that this entry-point is a primary entry-point to a
                // package.
                return entryPointPath;
            }
        };
        /**
         * Split the given `path` into path segments using an FS independent algorithm.
         */
        TargetedEntryPointFinder.prototype.splitPath = function (path) {
            var segments = [];
            var container = this.fs.dirname(path);
            while (path !== container) {
                segments.unshift(this.fs.basename(path));
                path = container;
                container = this.fs.dirname(container);
            }
            return segments;
        };
        return TargetedEntryPointFinder;
    }(tracing_entry_point_finder_1.TracingEntryPointFinder));
    exports.TargetedEntryPointFinder = TargetedEntryPointFinder;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0ZWRfZW50cnlfcG9pbnRfZmluZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL2VudHJ5X3BvaW50X2ZpbmRlci90YXJnZXRlZF9lbnRyeV9wb2ludF9maW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVdBLHFGQUEwRDtJQUUxRCxtRkFBZ0c7SUFHaEcsMkhBQXFFO0lBRXJFOzs7Ozs7T0FNRztJQUNIO1FBQThDLG9EQUF1QjtRQUNuRSxrQ0FDSSxFQUFzQixFQUFFLE1BQXlCLEVBQUUsTUFBYyxFQUNqRSxRQUE0QixFQUFFLFFBQXdCLEVBQUUsWUFBb0MsRUFDcEYsVUFBMEI7WUFIdEMsWUFJRSxrQkFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxTQUM1RDtZQUZXLGdCQUFVLEdBQVYsVUFBVSxDQUFnQjs7UUFFdEMsQ0FBQztRQUVEOzs7V0FHRztRQUNNLGtEQUFlLEdBQXhCO1lBQUEsaUJBV0M7WUFWQyxJQUFNLFdBQVcsR0FBRyxpQkFBTSxlQUFlLFdBQUUsQ0FBQztZQUU1QyxJQUFNLGFBQWEsR0FDZixXQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssS0FBSSxDQUFDLFVBQVUsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO1lBQ3BGLElBQUksYUFBYSxLQUFLLFNBQVMsRUFBRTtnQkFDL0IsTUFBTSxJQUFJLEtBQUssQ0FDWCw4QkFBMkIsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLG1DQUErQjtvQkFDdkYsYUFBYSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLFFBQU0sR0FBRyxPQUFJLEVBQWIs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Z2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBQYXRoU2VnbWVudCwgUmVhZG9ubHlGaWxlU3lzdGVtfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9sb2dnaW5nJztcbmltcG9ydCB7RW50cnlQb2ludFdpdGhEZXBlbmRlbmNpZXN9IGZyb20gJy4uL2RlcGVuZGVuY2llcy9kZXBlbmRlbmN5X2hvc3QnO1xuaW1wb3J0IHtEZXBlbmRlbmN5UmVzb2x2ZXIsIFNvcnRlZEVudHJ5UG9pbnRzSW5mb30gZnJvbSAnLi4vZGVwZW5kZW5jaWVzL2RlcGVuZGVuY3lfcmVzb2x2ZXInO1xuaW1wb3J0IHtoYXNCZWVuUHJvY2Vzc2VkfSBmcm9tICcuLi9wYWNrYWdlcy9idWlsZF9tYXJrZXInO1xuaW1wb3J0IHtOZ2NjQ29uZmlndXJhdGlvbn0gZnJvbSAnLi4vcGFja2FnZXMvY29uZmlndXJhdGlvbic7XG5pbXBvcnQge0VudHJ5UG9pbnRKc29uUHJvcGVydHksIGdldEVudHJ5UG9pbnRJbmZvLCBpc0VudHJ5UG9pbnR9IGZyb20gJy4uL3BhY2thZ2VzL2VudHJ5X3BvaW50JztcbmltcG9ydCB7UGF0aE1hcHBpbmdzfSBmcm9tICcuLi9wYXRoX21hcHBpbmdzJztcblxuaW1wb3J0IHtUcmFjaW5nRW50cnlQb2ludEZpbmRlcn0gZnJvbSAnLi90cmFjaW5nX2VudHJ5X3BvaW50X2ZpbmRlcic7XG5cbi8qKlxuICogQW4gRW50cnlQb2ludEZpbmRlciB0aGF0IHN0YXJ0cyBmcm9tIGEgdGFyZ2V0IGVudHJ5LXBvaW50IGFuZCBvbmx5IGZpbmRzXG4gKiBlbnRyeS1wb2ludHMgdGhhdCBhcmUgZGVwZW5kZW5jaWVzIG9mIHRoZSB0YXJnZXQuXG4gKlxuICogVGhpcyBpcyBmYXN0ZXIgdGhhbiBzZWFyY2hpbmcgdGhlIGVudGlyZSBmaWxlLXN5c3RlbSBmb3IgYWxsIHRoZSBlbnRyeS1wb2ludHMsXG4gKiBhbmQgaXMgdXNlZCBwcmltYXJpbHkgYnkgdGhlIENMSSBpbnRlZ3JhdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIFRhcmdldGVkRW50cnlQb2ludEZpbmRlciBleHRlbmRzIFRyYWNpbmdFbnRyeVBvaW50RmluZGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBmczogUmVhZG9ubHlGaWxlU3lzdGVtLCBjb25maWc6IE5nY2NDb25maWd1cmF0aW9uLCBsb2dnZXI6IExvZ2dlcixcbiAgICAgIHJlc29sdmVyOiBEZXBlbmRlbmN5UmVzb2x2ZXIsIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgcGF0aE1hcHBpbmdzOiBQYXRoTWFwcGluZ3N8dW5kZWZpbmVkLFxuICAgICAgcHJpdmF0ZSB0YXJnZXRQYXRoOiBBYnNvbHV0ZUZzUGF0aCkge1xuICAgIHN1cGVyKGZzLCBjb25maWcsIGxvZ2dlciwgcmVzb2x2ZXIsIGJhc2VQYXRoLCBwYXRoTWFwcGluZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaCBmb3IgQW5ndWxhciBlbnRyeS1wb2ludHMgdGhhdCBjYW4gYmUgcmVhY2hlZCBmcm9tIHRoZSBlbnRyeS1wb2ludCBzcGVjaWZpZWQgYnkgdGhlIGdpdmVuXG4gICAqIGB0YXJnZXRQYXRoYC5cbiAgICovXG4gIG92ZXJyaWRlIGZpbmRFbnRyeVBvaW50cygpOiBTb3J0ZWRFbnRyeVBvaW50c0luZm8ge1xuICAgIGNvbnN0IGVudHJ5UG9pbnRzID0gc3VwZXIuZmluZEVudHJ5UG9pbnRzKCk7XG5cbiAgICBjb25zdCBpbnZhbGlkVGFyZ2V0ID1cbiAgICAgICAgZW50cnlQb2ludHMuaW52YWxpZEVudHJ5UG9pbnRzLmZpbmQoaSA9PiBpLmVudHJ5UG9pbnQucGF0aCA9PT0gdGhpcy50YXJnZXRQYXRoKTtcbiAgICBpZiAoaW52YWxpZFRhcmdldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFRoZSB0YXJnZXQgZW50cnktcG9pbnQgXCIke2ludmFsaWRUYXJnZXQuZW50cnlQb2ludC5uYW1lfVwiIGhhcyBtaXNzaW5nIGRlcGVuZGVuY2llczpcXG5gICtcbiAgICAgICAgICBpbnZhbGlkVGFyZ2V0Lm1pc3NpbmdEZXBlbmRlbmNpZXMubWFwKGRlcCA9PiBgIC0gJHtkZXB9XFxuYCkuam9pbignJykpO1xuICAgIH1cbiAgICByZXR1cm4gZW50cnlQb2ludHM7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGVudHJ5LXBvaW50IGF0IHRoZSBnaXZlbiBgdGFyZ2V0UGF0aGAgbmVlZHMgdG8gYmUgcHJvY2Vzc2VkLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcGVydGllc1RvQ29uc2lkZXIgdGhlIHBhY2thZ2UuanNvbiBwcm9wZXJ0aWVzIHRoYXQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgZm9yXG4gICAqICAgICBwcm9jZXNzaW5nLlxuICAgKiBAcGFyYW0gY29tcGlsZUFsbEZvcm1hdHMgdHJ1ZSBpZiBhbGwgZm9ybWF0cyBuZWVkIHRvIGJlIHByb2Nlc3NlZCwgb3IgZmFsc2UgaWYgaXQgaXMgZW5vdWdoIGZvclxuICAgKiAgICAgb25lIG9mIHRoZSBmb3JtYXRzIGNvdmVyZWQgYnkgdGhlIGBwcm9wZXJ0aWVzVG9Db25zaWRlcmAgaXMgcHJvY2Vzc2VkLlxuICAgKi9cbiAgdGFyZ2V0TmVlZHNQcm9jZXNzaW5nT3JDbGVhbmluZyhcbiAgICAgIHByb3BlcnRpZXNUb0NvbnNpZGVyOiBFbnRyeVBvaW50SnNvblByb3BlcnR5W10sIGNvbXBpbGVBbGxGb3JtYXRzOiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZW50cnlQb2ludFdpdGhEZXBzID0gdGhpcy5nZXRFbnRyeVBvaW50V2l0aERlcHModGhpcy50YXJnZXRQYXRoKTtcbiAgICBpZiAoZW50cnlQb2ludFdpdGhEZXBzID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wZXJ0aWVzVG9Db25zaWRlcikge1xuICAgICAgaWYgKGVudHJ5UG9pbnRXaXRoRGVwcy5lbnRyeVBvaW50LnBhY2thZ2VKc29uW3Byb3BlcnR5XSkge1xuICAgICAgICAvLyBIZXJlIGlzIGEgcHJvcGVydHkgdGhhdCBzaG91bGQgYmUgcHJvY2Vzc2VkLlxuICAgICAgICBpZiAoIWhhc0JlZW5Qcm9jZXNzZWQoZW50cnlQb2ludFdpdGhEZXBzLmVudHJ5UG9pbnQucGFja2FnZUpzb24sIHByb3BlcnR5KSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY29tcGlsZUFsbEZvcm1hdHMpIHtcbiAgICAgICAgICAvLyBUaGlzIHByb3BlcnR5IGhhcyBiZWVuIHByb2Nlc3NlZCwgYW5kIHdlIG9ubHkgbmVlZCBvbmUuXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFsbCBgcHJvcGVydGllc1RvQ29uc2lkZXJgIHRoYXQgYXBwZWFyIGluIHRoaXMgZW50cnktcG9pbnQgaGF2ZSBiZWVuIHByb2Nlc3NlZC5cbiAgICAvLyBJbiBvdGhlciB3b3JkcywgdGhlcmUgd2VyZSBubyBwcm9wZXJ0aWVzIHRoYXQgbmVlZCBwcm9jZXNzaW5nLlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgYHRhcmdldFBhdGhgIGZyb20gd2hpY2ggdG8gc3RhcnQgdGhlIHRyYWNlLlxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGdldEluaXRpYWxFbnRyeVBvaW50UGF0aHMoKTogQWJzb2x1dGVGc1BhdGhbXSB7XG4gICAgcmV0dXJuIFt0aGlzLnRhcmdldFBhdGhdO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciB0aGUgZ2l2ZW4gYGVudHJ5UG9pbnRQYXRoYCwgY29tcHV0ZSwgb3IgcmV0cmlldmUsIHRoZSBlbnRyeS1wb2ludCBpbmZvcm1hdGlvbiwgaW5jbHVkaW5nXG4gICAqIHBhdGhzIHRvIG90aGVyIGVudHJ5LXBvaW50cyB0aGF0IHRoaXMgZW50cnktcG9pbnQgZGVwZW5kcyB1cG9uLlxuICAgKlxuICAgKiBAcGFyYW0gZW50cnlQb2ludFBhdGggdGhlIHBhdGggdG8gdGhlIGVudHJ5LXBvaW50IHdob3NlIGluZm9ybWF0aW9uIGFuZCBkZXBlbmRlbmNpZXMgYXJlIHRvIGJlXG4gICAqICAgICByZXRyaWV2ZWQgb3IgY29tcHV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBlbnRyeS1wb2ludCBhbmQgaXRzIGRlcGVuZGVuY2llcyBvciBgbnVsbGAgaWYgdGhlIGVudHJ5LXBvaW50IGlzIG5vdCBjb21waWxlZCBieVxuICAgKiAgICAgQW5ndWxhciBvciBjYW5ub3QgYmUgZGV0ZXJtaW5lZC5cbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXRFbnRyeVBvaW50V2l0aERlcHMoZW50cnlQb2ludFBhdGg6IEFic29sdXRlRnNQYXRoKTpcbiAgICAgIEVudHJ5UG9pbnRXaXRoRGVwZW5kZW5jaWVzfG51bGwge1xuICAgIGNvbnN0IHBhY2thZ2VQYXRoID0gdGhpcy5jb21wdXRlUGFja2FnZVBhdGgoZW50cnlQb2ludFBhdGgpO1xuICAgIGNvbnN0IGVudHJ5UG9pbnQgPVxuICAgICAgICBnZXRFbnRyeVBvaW50SW5mbyh0aGlzLmZzLCB0aGlzLmNvbmZpZywgdGhpcy5sb2dnZXIsIHBhY2thZ2VQYXRoLCBlbnRyeVBvaW50UGF0aCk7XG4gICAgaWYgKCFpc0VudHJ5UG9pbnQoZW50cnlQb2ludCkgfHwgIWVudHJ5UG9pbnQuY29tcGlsZWRCeUFuZ3VsYXIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlci5nZXRFbnRyeVBvaW50V2l0aERlcGVuZGVuY2llcyhlbnRyeVBvaW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlIHRoZSBwYXRoIHRvIHRoZSBwYWNrYWdlIHRoYXQgY29udGFpbnMgdGhlIGdpdmVuIGVudHJ5LXBvaW50LlxuICAgKlxuICAgKiBJbiB0aGlzIGVudHJ5LXBvaW50IGZpbmRlciBpdCBpcyBub3QgdHJpdmlhbCB0byBmaW5kIHRoZSBjb250YWluaW5nIHBhY2thZ2UsIHNpbmNlIGl0IGlzXG4gICAqIHBvc3NpYmxlIHRoYXQgdGhpcyBlbnRyeS1wb2ludCBpcyBub3QgZGlyZWN0bHkgYmVsb3cgdGhlIGRpcmVjdG9yeSBjb250YWluaW5nIHRoZSBwYWNrYWdlLlxuICAgKiBNb3Jlb3ZlciwgdGhlIGltcG9ydCBwYXRoIGNvdWxkIGJlIGFmZmVjdGVkIGJ5IHBhdGgtbWFwcGluZy5cbiAgICpcbiAgICogQHBhcmFtIGVudHJ5UG9pbnRQYXRoIHRoZSBwYXRoIHRvIHRoZSBlbnRyeS1wb2ludCwgd2hvc2UgcGFja2FnZSBwYXRoIHdlIHdhbnQgdG8gY29tcHV0ZS5cbiAgICovXG4gIHByaXZhdGUgY29tcHV0ZVBhY2thZ2VQYXRoKGVudHJ5UG9pbnRQYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IEFic29sdXRlRnNQYXRoIHtcbiAgICAvLyBGaXJzdCB0cnkgdGhlIG1haW4gYmFzZVBhdGgsIHRvIGF2b2lkIGhhdmluZyB0byBjb21wdXRlIHRoZSBvdGhlciBiYXNlUGF0aHMgZnJvbSB0aGUgcGF0aHNcbiAgICAvLyBtYXBwaW5ncywgd2hpY2ggY2FuIGJlIGNvbXB1dGF0aW9uYWxseSBpbnRlbnNpdmUuXG4gICAgaWYgKHRoaXMuaXNQYXRoQ29udGFpbmVkQnkodGhpcy5iYXNlUGF0aCwgZW50cnlQb2ludFBhdGgpKSB7XG4gICAgICBjb25zdCBwYWNrYWdlUGF0aCA9IHRoaXMuY29tcHV0ZVBhY2thZ2VQYXRoRnJvbUNvbnRhaW5pbmdQYXRoKGVudHJ5UG9pbnRQYXRoLCB0aGlzLmJhc2VQYXRoKTtcbiAgICAgIGlmIChwYWNrYWdlUGF0aCAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gcGFja2FnZVBhdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhlIG1haW4gYGJhc2VQYXRoYCBkaWRuJ3Qgd29yayBvdXQgc28gbm93IHdlIHRyeSB0aGUgYGJhc2VQYXRoc2AgY29tcHV0ZWQgZnJvbSB0aGUgcGF0aHNcbiAgICAvLyBtYXBwaW5ncyBpbiBgdHNjb25maWcuanNvbmAuXG4gICAgZm9yIChjb25zdCBiYXNlUGF0aCBvZiB0aGlzLmdldEJhc2VQYXRocygpKSB7XG4gICAgICBpZiAodGhpcy5pc1BhdGhDb250YWluZWRCeShiYXNlUGF0aCwgZW50cnlQb2ludFBhdGgpKSB7XG4gICAgICAgIGNvbnN0IHBhY2thZ2VQYXRoID0gdGhpcy5jb21wdXRlUGFja2FnZVBhdGhGcm9tQ29udGFpbmluZ1BhdGgoZW50cnlQb2ludFBhdGgsIGJhc2VQYXRoKTtcbiAgICAgICAgaWYgKHBhY2thZ2VQYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHBhY2thZ2VQYXRoO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIGdvdCBoZXJlIHRoZW4gd2UgY291bGRuJ3QgZmluZCBhIGBwYWNrYWdlUGF0aGAgZm9yIHRoZSBjdXJyZW50IGBiYXNlUGF0aGAuXG4gICAgICAgIC8vIFNpbmNlIGBiYXNlUGF0aGBzIGFyZSBndWFyYW50ZWVkIG5vdCB0byBiZSBhIHN1Yi1kaXJlY3Rvcnkgb2YgZWFjaCBvdGhlciB0aGVuIG5vIG90aGVyXG4gICAgICAgIC8vIGBiYXNlUGF0aGAgd2lsbCBtYXRjaCBlaXRoZXIuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEZpbmFsbHksIGlmIHdlIGNvdWxkbid0IGZpbmQgYSBgcGFja2FnZVBhdGhgIHVzaW5nIGBiYXNlUGF0aHNgIHRoZW4gdHJ5IHRvIGZpbmQgdGhlIG5lYXJlc3RcbiAgICAvLyBgbm9kZV9tb2R1bGVzYCB0aGF0IGNvbnRhaW5zIHRoZSBgZW50cnlQb2ludFBhdGhgLCBpZiB0aGVyZSBpcyBvbmUsIGFuZCB1c2UgaXQgYXMgYVxuICAgIC8vIGBiYXNlUGF0aGAuXG4gICAgcmV0dXJuIHRoaXMuY29tcHV0ZVBhY2thZ2VQYXRoRnJvbU5lYXJlc3ROb2RlTW9kdWxlcyhlbnRyeVBvaW50UGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZSB3aGV0aGVyIHRoZSBgdGVzdGAgcGF0aCBpcyBjb250YWluZWQgd2l0aGluIHRoZSBgYmFzZWAgcGF0aC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgZG9lc24ndCB1c2UgYSBzaW1wbGUgYHN0YXJ0c1dpdGgoKWAgc2luY2UgdGhhdCB3b3VsZCByZXN1bHQgaW4gYSBmYWxzZSBwb3NpdGl2ZVxuICAgKiBmb3IgYHRlc3RgIHBhdGhzIHN1Y2ggYXMgYGEvYi9jLXhgIHdoZW4gdGhlIGBiYXNlYCBwYXRoIGlzIGBhL2IvY2AuXG4gICAqXG4gICAqIFNpbmNlIGBmcy5yZWxhdGl2ZSgpYCBjYW4gYmUgcXVpdGUgZXhwZW5zaXZlIHdlIGNoZWNrIHRoZSBmYXN0IHBvc3NpYmlsaXRpZXMgZmlyc3QuXG4gICAqL1xuICBwcml2YXRlIGlzUGF0aENvbnRhaW5lZEJ5KGJhc2U6IEFic29sdXRlRnNQYXRoLCB0ZXN0OiBBYnNvbHV0ZUZzUGF0aCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0ZXN0ID09PSBiYXNlIHx8XG4gICAgICAgICh0ZXN0LnN0YXJ0c1dpdGgoYmFzZSkgJiYgIXRoaXMuZnMucmVsYXRpdmUoYmFzZSwgdGVzdCkuc3RhcnRzV2l0aCgnLi4nKSk7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoIGRvd24gdG8gdGhlIGBlbnRyeVBvaW50UGF0aGAgZnJvbSB0aGUgYGNvbnRhaW5pbmdQYXRoYCBmb3IgdGhlIGZpcnN0IGBwYWNrYWdlLmpzb25gIHRoYXRcbiAgICogd2UgY29tZSB0by4gVGhpcyBpcyB0aGUgcGF0aCB0byB0aGUgZW50cnktcG9pbnQncyBjb250YWluaW5nIHBhY2thZ2UuIEZvciBleGFtcGxlIGlmXG4gICAqIGBjb250YWluaW5nUGF0aGAgaXMgYC9hL2IvY2AgYW5kIGBlbnRyeVBvaW50UGF0aGAgaXMgYC9hL2IvYy9kL2VgIGFuZCB0aGVyZSBleGlzdHNcbiAgICogYC9hL2IvYy9kL3BhY2thZ2UuanNvbmAgYW5kIGAvYS9iL2MvZC9lL3BhY2thZ2UuanNvbmAsIHRoZW4gd2Ugd2lsbCByZXR1cm4gYC9hL2IvYy9kYC5cbiAgICpcbiAgICogVG8gYWNjb3VudCBmb3IgbmVzdGVkIGBub2RlX21vZHVsZXNgIHdlIGFjdHVhbGx5IHN0YXJ0IHRoZSBzZWFyY2ggYXQgdGhlIGxhc3QgYG5vZGVfbW9kdWxlc2AgaW5cbiAgICogdGhlIGBlbnRyeVBvaW50UGF0aGAgdGhhdCBpcyBiZWxvdyB0aGUgYGNvbnRhaW5pbmdQYXRoYC4gRS5nLiBpZiBgY29udGFpbmluZ1BhdGhgIGlzIGAvYS9iL2NgXG4gICAqIGFuZCBgZW50cnlQb2ludFBhdGhgIGlzIGAvYS9iL2MvZC9ub2RlX21vZHVsZXMveC95L3pgLCB3ZSBzdGFydCB0aGUgc2VhcmNoIGF0XG4gICAqIGAvYS9iL2MvZC9ub2RlX21vZHVsZXNgLlxuICAgKi9cbiAgcHJpdmF0ZSBjb21wdXRlUGFja2FnZVBhdGhGcm9tQ29udGFpbmluZ1BhdGgoXG4gICAgICBlbnRyeVBvaW50UGF0aDogQWJzb2x1dGVGc1BhdGgsIGNvbnRhaW5pbmdQYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IEFic29sdXRlRnNQYXRofG51bGwge1xuICAgIGxldCBwYWNrYWdlUGF0aCA9IGNvbnRhaW5pbmdQYXRoO1xuICAgIGNvbnN0IHNlZ21lbnRzID0gdGhpcy5zcGxpdFBhdGgodGhpcy5mcy5yZWxhdGl2ZShjb250YWluaW5nUGF0aCwgZW50cnlQb2ludFBhdGgpKTtcbiAgICBsZXQgbm9kZU1vZHVsZXNJbmRleCA9IHNlZ21lbnRzLmxhc3RJbmRleE9mKCdub2RlX21vZHVsZXMnIGFzIFBhdGhTZWdtZW50KTtcblxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBgbm9kZV9tb2R1bGVzYCBpbiB0aGUgcmVsYXRpdmUgcGF0aCBiZXR3ZWVuIHRoZSBgYmFzZVBhdGhgIGFuZCB0aGVcbiAgICAvLyBgZW50cnlQb2ludFBhdGhgIHRoZW4ganVzdCB0cnkgdGhlIGBiYXNlUGF0aGAgYXMgdGhlIGBwYWNrYWdlUGF0aGAuXG4gICAgLy8gKFRoaXMgY2FuIGJlIHRoZSBjYXNlIHdpdGggcGF0aC1tYXBwZWQgZW50cnktcG9pbnRzLilcbiAgICBpZiAobm9kZU1vZHVsZXNJbmRleCA9PT0gLTEpIHtcbiAgICAgIGlmICh0aGlzLmZzLmV4aXN0cyh0aGlzLmZzLmpvaW4ocGFja2FnZVBhdGgsICdwYWNrYWdlLmpzb24nKSkpIHtcbiAgICAgICAgcmV0dXJuIHBhY2thZ2VQYXRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0YXJ0IHRoZSBzZWFyY2ggYXQgdGhlIGRlZXBlc3QgbmVzdGVkIGBub2RlX21vZHVsZXNgIGZvbGRlciB0aGF0IGlzIGJlbG93IHRoZSBgYmFzZVBhdGhgXG4gICAgLy8gYnV0IGFib3ZlIHRoZSBgZW50cnlQb2ludFBhdGhgLCBpZiB0aGVyZSBhcmUgYW55LlxuICAgIHdoaWxlIChub2RlTW9kdWxlc0luZGV4ID49IDApIHtcbiAgICAgIHBhY2thZ2VQYXRoID0gdGhpcy5mcy5qb2luKHBhY2thZ2VQYXRoLCBzZWdtZW50cy5zaGlmdCgpISk7XG4gICAgICBub2RlTW9kdWxlc0luZGV4LS07XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHdlIHN0YXJ0IGF0IHRoZSBmb2xkZXIgYmVsb3cgdGhlIGN1cnJlbnQgY2FuZGlkYXRlIGBwYWNrYWdlUGF0aGAgYmVjYXVzZSB0aGVcbiAgICAvLyBpbml0aWFsIGNhbmRpZGF0ZSBgcGFja2FnZVBhdGhgIGlzIGVpdGhlciBhIGBub2RlX21vZHVsZXNgIGZvbGRlciBvciB0aGUgYGJhc2VQYXRoYCB3aXRoXG4gICAgLy8gbm8gYHBhY2thZ2UuanNvbmAuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHNlZ21lbnRzKSB7XG4gICAgICBwYWNrYWdlUGF0aCA9IHRoaXMuZnMuam9pbihwYWNrYWdlUGF0aCwgc2VnbWVudCk7XG4gICAgICBpZiAodGhpcy5mcy5leGlzdHModGhpcy5mcy5qb2luKHBhY2thZ2VQYXRoLCAncGFja2FnZS5qc29uJykpKSB7XG4gICAgICAgIHJldHVybiBwYWNrYWdlUGF0aDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoIHVwIHRoZSBkaXJlY3RvcnkgdHJlZSBmcm9tIHRoZSBgZW50cnlQb2ludFBhdGhgIGxvb2tpbmcgZm9yIGEgYG5vZGVfbW9kdWxlc2AgZGlyZWN0b3J5XG4gICAqIHRoYXQgd2UgY2FuIHVzZSBhcyBhIHBvdGVudGlhbCBzdGFydGluZyBwb2ludCBmb3IgY29tcHV0aW5nIHRoZSBwYWNrYWdlIHBhdGguXG4gICAqL1xuICBwcml2YXRlIGNvbXB1dGVQYWNrYWdlUGF0aEZyb21OZWFyZXN0Tm9kZU1vZHVsZXMoZW50cnlQb2ludFBhdGg6IEFic29sdXRlRnNQYXRoKTogQWJzb2x1dGVGc1BhdGgge1xuICAgIGxldCBwYWNrYWdlUGF0aCA9IGVudHJ5UG9pbnRQYXRoO1xuICAgIGxldCBzY29wZWRQYWNrYWdlUGF0aCA9IHBhY2thZ2VQYXRoO1xuICAgIGxldCBjb250YWluZXJQYXRoID0gdGhpcy5mcy5kaXJuYW1lKHBhY2thZ2VQYXRoKTtcbiAgICB3aGlsZSAoIXRoaXMuZnMuaXNSb290KGNvbnRhaW5lclBhdGgpICYmICFjb250YWluZXJQYXRoLmVuZHNXaXRoKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgc2NvcGVkUGFja2FnZVBhdGggPSBwYWNrYWdlUGF0aDtcbiAgICAgIHBhY2thZ2VQYXRoID0gY29udGFpbmVyUGF0aDtcbiAgICAgIGNvbnRhaW5lclBhdGggPSB0aGlzLmZzLmRpcm5hbWUoY29udGFpbmVyUGF0aCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZnMuZXhpc3RzKHRoaXMuZnMuam9pbihwYWNrYWdlUGF0aCwgJ3BhY2thZ2UuanNvbicpKSkge1xuICAgICAgLy8gVGhlIGRpcmVjdG9yeSBkaXJlY3RseSBiZWxvdyBgbm9kZV9tb2R1bGVzYCBpcyBhIHBhY2thZ2UgLSB1c2UgaXRcbiAgICAgIHJldHVybiBwYWNrYWdlUGF0aDtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0aGlzLmZzLmJhc2VuYW1lKHBhY2thZ2VQYXRoKS5zdGFydHNXaXRoKCdAJykgJiZcbiAgICAgICAgdGhpcy5mcy5leGlzdHModGhpcy5mcy5qb2luKHNjb3BlZFBhY2thZ2VQYXRoLCAncGFja2FnZS5qc29uJykpKSB7XG4gICAgICAvLyBUaGUgZGlyZWN0b3J5IGRpcmVjdGx5IGJlbG93IHRoZSBgbm9kZV9tb2R1bGVzYCBpcyBhIHNjb3BlIGFuZCB0aGUgZGlyZWN0b3J5IGRpcmVjdGx5XG4gICAgICAvLyBiZWxvdyB0aGF0IGlzIGEgc2NvcGVkIHBhY2thZ2UgLSB1c2UgaXRcbiAgICAgIHJldHVybiBzY29wZWRQYWNrYWdlUGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgd2UgZ2V0IGhlcmUgdGhlbiBub25lIG9mIHRoZSBgYmFzZVBhdGhzYCBjb250YWluZWQgdGhlIGBlbnRyeVBvaW50UGF0aGAgYW5kIHRoZVxuICAgICAgLy8gYGVudHJ5UG9pbnRQYXRoYCBjb250YWlucyBubyBgbm9kZV9tb2R1bGVzYCB0aGF0IGNvbnRhaW5zIGEgcGFja2FnZSBvciBhIHNjb3BlZFxuICAgICAgLy8gcGFja2FnZS4gQWxsIHdlIGNhbiBkbyBpcyBhc3N1bWUgdGhhdCB0aGlzIGVudHJ5LXBvaW50IGlzIGEgcHJpbWFyeSBlbnRyeS1wb2ludCB0byBhXG4gICAgICAvLyBwYWNrYWdlLlxuICAgICAgcmV0dXJuIGVudHJ5UG9pbnRQYXRoO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTcGxpdCB0aGUgZ2l2ZW4gYHBhdGhgIGludG8gcGF0aCBzZWdtZW50cyB1c2luZyBhbiBGUyBpbmRlcGVuZGVudCBhbGdvcml0aG0uXG4gICAqL1xuICBwcml2YXRlIHNwbGl0UGF0aChwYXRoOiBQYXRoU2VnbWVudHxBYnNvbHV0ZUZzUGF0aCkge1xuICAgIGNvbnN0IHNlZ21lbnRzID0gW107XG4gICAgbGV0IGNvbnRhaW5lciA9IHRoaXMuZnMuZGlybmFtZShwYXRoKTtcbiAgICB3aGlsZSAocGF0aCAhPT0gY29udGFpbmVyKSB7XG4gICAgICBzZWdtZW50cy51bnNoaWZ0KHRoaXMuZnMuYmFzZW5hbWUocGF0aCkpO1xuICAgICAgcGF0aCA9IGNvbnRhaW5lcjtcbiAgICAgIGNvbnRhaW5lciA9IHRoaXMuZnMuZGlybmFtZShjb250YWluZXIpO1xuICAgIH1cbiAgICByZXR1cm4gc2VnbWVudHM7XG4gIH1cbn1cbiJdfQ==