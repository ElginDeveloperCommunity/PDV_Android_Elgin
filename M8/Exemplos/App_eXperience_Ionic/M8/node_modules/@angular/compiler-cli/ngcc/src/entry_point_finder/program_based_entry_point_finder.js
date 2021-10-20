(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/entry_point_finder/program_based_entry_point_finder", ["require", "exports", "tslib", "@angular/compiler-cli/ngcc/src/dependencies/dependency_host", "@angular/compiler-cli/ngcc/src/dependencies/esm_dependency_host", "@angular/compiler-cli/ngcc/src/dependencies/module_resolver", "@angular/compiler-cli/ngcc/src/path_mappings", "@angular/compiler-cli/ngcc/src/entry_point_finder/tracing_entry_point_finder", "@angular/compiler-cli/ngcc/src/entry_point_finder/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProgramBasedEntryPointFinder = void 0;
    var tslib_1 = require("tslib");
    var dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/dependency_host");
    var esm_dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/esm_dependency_host");
    var module_resolver_1 = require("@angular/compiler-cli/ngcc/src/dependencies/module_resolver");
    var path_mappings_1 = require("@angular/compiler-cli/ngcc/src/path_mappings");
    var tracing_entry_point_finder_1 = require("@angular/compiler-cli/ngcc/src/entry_point_finder/tracing_entry_point_finder");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/entry_point_finder/utils");
    /**
     * An EntryPointFinder that starts from the files in the program defined by the given tsconfig.json
     * and only returns entry-points that are dependencies of these files.
     *
     * This is faster than searching the entire file-system for all the entry-points,
     * and is used primarily by the CLI integration.
     */
    var ProgramBasedEntryPointFinder = /** @class */ (function (_super) {
        tslib_1.__extends(ProgramBasedEntryPointFinder, _super);
        function ProgramBasedEntryPointFinder(fs, config, logger, resolver, entryPointCollector, entryPointManifest, basePath, tsConfig, projectPath) {
            var _this = _super.call(this, fs, config, logger, resolver, basePath, path_mappings_1.getPathMappingsFromTsConfig(fs, tsConfig, projectPath)) || this;
            _this.entryPointCollector = entryPointCollector;
            _this.entryPointManifest = entryPointManifest;
            _this.tsConfig = tsConfig;
            _this.entryPointsWithDependencies = null;
            return _this;
        }
        /**
         * Return an array containing the external import paths that were extracted from the source-files
         * of the program defined by the tsconfig.json.
         */
        ProgramBasedEntryPointFinder.prototype.getInitialEntryPointPaths = function () {
            var _this = this;
            var moduleResolver = new module_resolver_1.ModuleResolver(this.fs, this.pathMappings, ['', '.ts', '/index.ts']);
            var host = new esm_dependency_host_1.EsmDependencyHost(this.fs, moduleResolver);
            var dependencies = dependency_host_1.createDependencyInfo();
            var rootFiles = this.tsConfig.rootNames.map(function (rootName) { return _this.fs.resolve(rootName); });
            this.logger.debug("Using the program from " + this.tsConfig.project + " to seed the entry-point finding.");
            this.logger.debug("Collecting dependencies from the following files:" + rootFiles.map(function (file) { return "\n- " + file; }));
            host.collectDependenciesInFiles(rootFiles, dependencies);
            return Array.from(dependencies.dependencies);
        };
        /**
         * For the given `entryPointPath`, compute, or retrieve, the entry-point information, including
         * paths to other entry-points that this entry-point depends upon.
         *
         * In this entry-point finder, we use the `EntryPointManifest` to avoid computing each
         * entry-point's dependencies in the case that this had been done previously.
         *
         * @param entryPointPath the path to the entry-point whose information and dependencies are to be
         *     retrieved or computed.
         *
         * @returns the entry-point and its dependencies or `null` if the entry-point is not compiled by
         *     Angular or cannot be determined.
         */
        ProgramBasedEntryPointFinder.prototype.getEntryPointWithDeps = function (entryPointPath) {
            var entryPoints = this.findOrLoadEntryPoints();
            if (!entryPoints.has(entryPointPath)) {
                return null;
            }
            var entryPointWithDeps = entryPoints.get(entryPointPath);
            if (!entryPointWithDeps.entryPoint.compiledByAngular) {
                return null;
            }
            return entryPointWithDeps;
        };
        /**
         * Walk the base paths looking for entry-points or load this information from an entry-point
         * manifest, if available.
         */
        ProgramBasedEntryPointFinder.prototype.findOrLoadEntryPoints = function () {
            var e_1, _a, e_2, _b;
            if (this.entryPointsWithDependencies === null) {
                var entryPointsWithDependencies = this.entryPointsWithDependencies =
                    new Map();
                try {
                    for (var _c = tslib_1.__values(this.getBasePaths()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var basePath = _d.value;
                        var entryPoints = this.entryPointManifest.readEntryPointsUsingManifest(basePath) ||
                            this.walkBasePathForPackages(basePath);
                        try {
                            for (var entryPoints_1 = (e_2 = void 0, tslib_1.__values(entryPoints)), entryPoints_1_1 = entryPoints_1.next(); !entryPoints_1_1.done; entryPoints_1_1 = entryPoints_1.next()) {
                                var e = entryPoints_1_1.value;
                                entryPointsWithDependencies.set(e.entryPoint.path, e);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (entryPoints_1_1 && !entryPoints_1_1.done && (_b = entryPoints_1.return)) _b.call(entryPoints_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return this.entryPointsWithDependencies;
        };
        /**
         * Search the `basePath` for possible Angular packages and entry-points.
         *
         * @param basePath The path at which to start the search.
         * @returns an array of `EntryPoint`s that were found within `basePath`.
         */
        ProgramBasedEntryPointFinder.prototype.walkBasePathForPackages = function (basePath) {
            var _this = this;
            this.logger.debug("No manifest found for " + basePath + " so walking the directories for entry-points.");
            var entryPoints = utils_1.trackDuration(function () { return _this.entryPointCollector.walkDirectoryForPackages(basePath); }, function (duration) { return _this.logger.debug("Walking " + basePath + " for entry-points took " + duration + "s."); });
            this.entryPointManifest.writeEntryPointManifest(basePath, entryPoints);
            return entryPoints;
        };
        return ProgramBasedEntryPointFinder;
    }(tracing_entry_point_finder_1.TracingEntryPointFinder));
    exports.ProgramBasedEntryPointFinder = ProgramBasedEntryPointFinder;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3JhbV9iYXNlZF9lbnRyeV9wb2ludF9maW5kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvZW50cnlfcG9pbnRfZmluZGVyL3Byb2dyYW1fYmFzZWRfZW50cnlfcG9pbnRfZmluZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFXQSwrRkFBaUc7SUFFakcsdUdBQXNFO0lBQ3RFLCtGQUErRDtJQUcvRCw4RUFBNkQ7SUFHN0QsMkhBQXFFO0lBQ3JFLGlGQUFzQztJQUV0Qzs7Ozs7O09BTUc7SUFDSDtRQUFrRCx3REFBdUI7UUFHdkUsc0NBQ0ksRUFBc0IsRUFBRSxNQUF5QixFQUFFLE1BQWMsRUFDakUsUUFBNEIsRUFBVSxtQkFBd0MsRUFDdEUsa0JBQXNDLEVBQUUsUUFBd0IsRUFDaEUsUUFBNkIsRUFBRSxXQUEyQjtZQUp0RSxZQUtFLGtCQUNJLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQ3RDLDJDQUEyQixDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUMsU0FDNUQ7WUFOeUMseUJBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtZQUN0RSx3QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1lBQ3RDLGNBQVEsR0FBUixRQUFRLENBQXFCO1lBTmpDLGlDQUEyQixHQUF5RCxJQUFJLENBQUM7O1FBVWpHLENBQUM7UUFFRDs7O1dBR0c7UUFDZ0IsZ0VBQXlCLEdBQTVDO1lBQUEsaUJBV0M7WUFWQyxJQUFNLGNBQWMsR0FBRyxJQUFJLGdDQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hHLElBQU0sSUFBSSxHQUFHLElBQUksdUNB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QUM5RixJQUFJLENBQUMsa0JBQWtCLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZFLE9BQU8sV0FBVyxDQUFDO1FBQ3JCLENBQUM7UUFDSCxtQ0FBQztJQUFELENBQUMsQUExRkQsQ0FBa0Qsb0RBQXVCLEdBMEZ4RTtJQTFGWSxvRUFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIFJlYWRvbmx5RmlsZVN5c3RlbX0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvbG9nZ2luZyc7XG5pbXBvcnQge1BhcnNlZENvbmZpZ3VyYXRpb259IGZyb20gJy4uLy4uLy4uL3NyYy9wZXJmb3JtX2NvbXBpbGUnO1xuXG5pbXBvcnQge2NyZWF0ZURlcGVuZGVuY3lJbmZvLCBFbnRyeVBvaW50V2l0aERlcGVuZGVuY2llc30gZnJvbSAnLi4vZGVwZW5kZW5jaWVzL2RlcGVuZGVuY3lfaG9zdCc7XG5pbXBvcnQge0RlcGVuZGVuY3lSZXNvbHZlcn0gZnJvbSAnLi4vZGVwZW5kZW5jaWVzL2RlcGVuZGVuY3lfcmVzb2x2ZXInO1xuaW1wb3J0IHtFc21EZXBlbmRlbmN5SG9zdH0gZnJvbSAnLi4vZGVwZW5kZW5jaWVzL2VzbV9kZXBlbmRlbmN5X2hvc3QnO1xuaW1wb3J0IHtNb2R1bGVSZXNvbHZlcn0gZnJvbSAnLi4vZGVwZW5kZW5jaWVzL21vZHVsZV9yZXNvbHZlcic7XG5pbXBvcnQge05nY2NDb25maWd1cmF0aW9ufSBmcm9tICcuLi9wYWNrYWdlcy9jb25maWd1cmF0aW9uJztcbmltcG9ydCB7RW50cnlQb2ludE1hbmlmZXN0fSBmcm9tICcuLi9wYWNrYWdlcy9lbnRyeV9wb2ludF9tYW5pZmVzdCc7XG5pbXBvcnQge2dldFBhdGhNYXBwaW5nc0Zyb21Uc0NvbmZpZ30gZnJvbSAnLi4vcGF0aF9tYXBwaW5ncyc7XG5cbmltcG9ydCB7RW50cnlQb2ludENvbGxlY3Rvcn0gZnJvbSAnLi9lbnRyeV9wb2ludF9jb2xsZWN0b3InO1xuaW1wb3J0IHtUcmFjaW5nRW50cnlQb2ludEZpbmRlcn0gZnJvbSAnLi90cmFjaW5nX2VudHJ5X3BvaW50X2ZpbmRlcic7XG5pbXBvcnQge3RyYWNrRHVyYXRpb259IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIEFuIEVudHJ5UG9pbnRGaW5kZXIgdGhhdCBzdGFydHMgZnJvbSB0aGUgZmlsZXMgaW4gdGhlIHByb2dyYW0gZGVmaW5lZCBieSB0aGUgZ2l2ZW4gdHNjb25maWcuanNvblxuICogYW5kIG9ubHkgcmV0dXJucyBlbnRyeS1wb2ludHMgdGhhdCBhcmUgZGVwZW5kZW5jaWVzIG9mIHRoZXNlIGZpbGVzLlxuICpcbiAqIFRoaXMgaXMgZmFzdGVyIHRoYW4gc2VhcmNoaW5nIHRoZSBlbnRpcmUgZmlsZS1zeXN0ZW0gZm9yIGFsbCB0aGUgZW50cnktcG9pbnRzLFxuICogYW5kIGlzIHVzZWQgcHJpbWFyaWx5IGJ5IHRoZSBDTEkgaW50ZWdyYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBQcm9ncmFtQmFzZWRFbnRyeVBvaW50RmluZGVyIGV4dGVuZHMgVHJhY2luZ0VudHJ5UG9pbnRGaW5kZXIge1xuICBwcml2YXRlIGVudHJ5UG9pbnRzV2l0aERlcGVuZGVuY2llczogTWFwPEFic29sdXRlRnNQYXRoLCBFbnRyeVBvaW50V2l0aERlcGVuZGVuY2llcz58bnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBmczogUmVhZG9ubHlGaWxlU3lzdGVtLCBjb25maWc6IE5nY2NDb25maWd1cmF0aW9uLCBsb2dnZXI6IExvZ2dlcixcbiAgICAgIHJlc29sdmVyOiBEZXBlbmRlbmN5UmVzb2x2ZXIsIHByaXZhdGUgZW50cnlQb2ludENvbGxlY3RvcjogRW50cnlQb2ludENvbGxlY3RvcixcbiAgICAgIHByaXZhdGUgZW50cnlQb2ludE1hbmlmZXN0OiBFbnRyeVBvaW50TWFuaWZlc3QsIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICAgIHByaXZhdGUgdHNDb25maWc6IFBhcnNlZENvbmZpZ3VyYXRpb24sIHByb2plY3RQYXRoOiBBYnNvbHV0ZUZzUGF0aCkge1xuICAgIHN1cGVyKFxuICAgICAgICBmcywgY29uZmlnLCBsb2dnZXIsIHJlc29sdmVyLCBiYXNlUGF0aCxcbiAgICAgICAgZ2V0UGF0aE1hcHBpbmdzRnJvbVRzQ29uZmlnKGZzLCB0c0NvbmZpZywgcHJvamVjdFBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgZXh0ZXJuYWwgaW1wb3J0IHBhdGhzIHRoYXQgd2VyZSBleHRyYWN0ZWQgZnJvbSB0aGUgc291cmNlLWZpbGVzXG4gICAqIG9mIHRoZSBwcm9ncmFtIGRlZmluZWQgYnkgdGhlIHRzY29uZmlnLmpzb24uXG4gICAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZ2V0SW5pdGlhbEVudHJ5UG9pbnRQYXRocygpOiBBYnNvbHV0ZUZzUGF0aFtdIHtcbiAgICBjb25zdCBtb2R1bGVSZXNvbHZlciA9IG5ldyBNb2R1bGVSZXNvbHZlcih0aGlzLmZzLCB0aGlzLnBhdGhNYXBwaW5ncywgWycnLCAnLnRzJywgJy9pbmRleC50cyddKTtcbiAgICBjb25zdCBob3N0ID0gbmV3IEVzbURlcGVuZGVuY3lIb3N0KHRoaXMuZnMsIG1vZHVsZVJlc29sdmVyKTtcbiAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBjcmVhdGVEZXBlbmRlbmN5SW5mbygpO1xuICAgIGNvbnN0IHJvb3RGaWxlcyA9IHRoaXMudHNDb25maWcucm9vdE5hbWVzLm1hcChyb290TmFtZSA9PiB0aGlzLmZzLnJlc29sdmUocm9vdE5hbWUpKTtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcbiAgICAgICAgYFVzaW5nIHRoZSBwcm9ncmFtIGZyb20gJHt0aGlzLnRzQ29uZmlnLnByb2plY3R9IHRvIHNlZWQgdGhlIGVudHJ5LXBvaW50IGZpbmRpbmcuYCk7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoXG4gICAgICAgIGBDb2xsZWN0aW5nIGRlcGVuZGVuY2llcyBmcm9tIHRoZSBmb2xsb3dpbmcgZmlsZXM6YCArIHJvb3RGaWxlcy5tYXAoZmlsZSA9PiBgXFxuLSAke2ZpbGV9YCkpO1xuICAgIGhvc3QuY29sbGVjdERlcGVuZGVuY2llc0luRmlsZXMocm9vdEZpbGVzLCBkZXBlbmRlbmNpZXMpO1xuICAgIHJldHVybiBBcnJheS5mcm9tKGRlcGVuZGVuY2llcy5kZXBlbmRlbmNpZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciB0aGUgZ2l2ZW4gYGVudHJ5UG9pbnRQYXRoYCwgY29tcHV0ZSwgb3IgcmV0cmlldmUsIHRoZSBlbnRyeS1wb2ludCBpbmZvcm1hdGlvbiwgaW5jbHVkaW5nXG4gICAqIHBhdGhzIHRvIG90aGVyIGVudHJ5LXBvaW50cyB0aGF0IHRoaXMgZW50cnktcG9pbnQgZGVwZW5kcyB1cG9uLlxuICAgKlxuICAgKiBJbiB0aGlzIGVudHJ5LXBvaW50IGZpbmRlciwgd2UgdXNlIHRoZSBgRW50cnlQb2ludE1hbmlmZXN0YCB0byBhdm9pZCBjb21wdXRpbmcgZWFjaFxuICAgKiBlbnRyeS1wb2ludCdzIGRlcGVuZGVuY2llcyBpbiB0aGUgY2FzZSB0aGF0IHRoaXMgaGFkIGJlZW4gZG9uZSBwcmV2aW91c2x5LlxuICAgKlxuICAgKiBAcGFyYW0gZW50cnlQb2ludFBhdGggdGhlIHBhdGggdG8gdGhlIGVudHJ5LXBvaW50IHdob3NlIGluZm9ybWF0aW9uIGFuZCBkZXBlbmRlbmNpZXMgYXJlIHRvIGJlXG4gICAqICAgICByZXRyaWV2ZWQgb3IgY29tcHV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBlbnRyeS1wb2ludCBhbmQgaXRzIGRlcGVuZGVuY2llcyBvciBgbnVsbGAgaWYgdGhlIGVudHJ5LXBvaW50IGlzIG5vdCBjb21waWxlZCBieVxuICAgKiAgICAgQW5ndWxhciBvciBjYW5ub3QgYmUgZGV0ZXJtaW5lZC5cbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXRFbnRyeVBvaW50V2l0aERlcHMoZW50cnlQb2ludFBhdGg6IEFic29sdXRlRnNQYXRoKTpcbiAgICAgIEVudHJ5UG9pbnRXaXRoRGVwZW5kZW5jaWVzfG51bGwge1xuICAgIGNvbnN0IGVudHJ5UG9pbnRzID0gdGhpcy5maW5kT3JMb2FkRW50cnlQb2ludHMoKTtcbiAgICBpZiAoIWVudHJ5UG9pbnRzLmhhcyhlbnRyeVBvaW50UGF0aCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBlbnRyeVBvaW50V2l0aERlcHMgPSBlbnRyeVBvaW50cy5nZXQoZW50cnlQb2ludFBhdGgpITtcbiAgICBpZiAoIWVudHJ5UG9pbnRXaXRoRGVwcy5lbnRyeVBvaW50LmNvbXBpbGVkQnlBbmd1bGFyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5UG9pbnRXaXRoRGVwcztcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWxrIHRoZSBiYXNlIHBhdGhzIGxvb2tpbmcgZm9yIGVudHJ5LXBvaW50cyBvciBsb2FkIHRoaXMgaW5mb3JtYXRpb24gZnJvbSBhbiBlbnRyeS1wb2ludFxuICAgKiBtYW5pZmVzdCwgaWYgYXZhaWxhYmxlLlxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kT3JMb2FkRW50cnlQb2ludHMoKTogTWFwPEFic29sdXRlRnNQYXRoLCBFbnRyeVBvaW50V2l0aERlcGVuZGVuY2llcz4ge1xuICAgIGlmICh0aGlzLmVudHJ5UG9pbnRzV2l0aERlcGVuZGVuY2llcyA9PT0gbnVsbCkge1xuICAgICAgY29uc3QgZW50cnlQb2ludHNXaXRoRGVwZW5kZW5jaWVzID0gdGhpcy5lbnRyeVBvaW50c1dpdGhEZXBlbmRlbmNpZXMgPVxuICAgICAgICAgIG5ldyBNYXA8QWJzb2x1dGVGc1BhdGgsIEVudHJ5UG9pbnRXaXRoRGVwZW5kZW5jaWVzPigpO1xuICAgICAgZm9yIChjb25zdCBiYXNlUGF0aCBvZiB0aGlzLmdldEJhc2VQYXRocygpKSB7XG4gICAgICAgIGNvbnN0IGVudHJ5UG9pbnRzID0gdGhpcy5lbnRyeVBvaW50TWFuaWZlc3QucmVhZEVudHJ5UG9pbnRzVXNpbmdNYW5pZmVzdChiYXNlUGF0aCkgfHxcbiAgICAgICAgICAgIHRoaXMud2Fsa0Jhc2VQYXRoRm9yUGFja2FnZXMoYmFzZVBhdGgpO1xuICAgICAgICBmb3IgKGNvbnN0IGUgb2YgZW50cnlQb2ludHMpIHtcbiAgICAgICAgICBlbnRyeVBvaW50c1dpdGhEZXBlbmRlbmNpZXMuc2V0KGUuZW50cnlQb2ludC5wYXRoLCBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbnRyeVBvaW50c1dpdGhEZXBlbmRlbmNpZXM7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoIHRoZSBgYmFzZVBhdGhgIGZvciBwb3NzaWJsZSBBbmd1bGFyIHBhY2thZ2VzIGFuZCBlbnRyeS1wb2ludHMuXG4gICAqXG4gICAqIEBwYXJhbSBiYXNlUGF0aCBUaGUgcGF0aCBhdCB3aGljaCB0byBzdGFydCB0aGUgc2VhcmNoLlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiBgRW50cnlQb2ludGBzIHRoYXQgd2VyZSBmb3VuZCB3aXRoaW4gYGJhc2VQYXRoYC5cbiAgICovXG4gIHdhbGtCYXNlUGF0aEZvclBhY2thZ2VzKGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IEVudHJ5UG9pbnRXaXRoRGVwZW5kZW5jaWVzW10ge1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKFxuICAgICAgICBgTm8gbWFuaWZlc3QgZm91bmQgZm9yICR7YmFzZVBhdGh9IHNvIHdhbGtpbmcgdGhlIGRpcmVjdG9yaWVzIGZvciBlbnRyeS1wb2ludHMuYCk7XG4gICAgY29uc3QgZW50cnlQb2ludHMgPSB0cmFja0R1cmF0aW9uKFxuICAgICAgICAoKSA9PiB0aGlzLmVudHJ5UG9pbnRDb2xsZWN0b3Iud2Fsa0RpcmVjdG9yeUZvclBhY2thZ2VzKGJhc2VQYXRoKSxcbiAgICAgICAgZHVyYXRpb24gPT4gdGhpcy5sb2dnZXIuZGVidWcoYFdhbGtpbmcgJHtiYXNlUGF0aH0gZm9yIGVudHJ5LXBvaW50cyB0b29rICR7ZHVyYXRpb259cy5gKSk7XG4gICAgdGhpcy5lbnRyeVBvaW50TWFuaWZlc3Qud3JpdGVFbnRyeVBvaW50TWFuaWZlc3QoYmFzZVBhdGgsIGVudHJ5UG9pbnRzKTtcbiAgICByZXR1cm4gZW50cnlQb2ludHM7XG4gIH1cbn1cbiJdfQ==