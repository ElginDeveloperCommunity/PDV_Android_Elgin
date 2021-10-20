(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/packages/entry_point_manifest", ["require", "exports", "tslib", "crypto", "@angular/compiler-cli/ngcc/src/packages/build_marker", "@angular/compiler-cli/ngcc/src/packages/entry_point"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvalidatingEntryPointManifest = exports.EntryPointManifest = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var crypto_1 = require("crypto");
    var build_marker_1 = require("@angular/compiler-cli/ngcc/src/packages/build_marker");
    var entry_point_1 = require("@angular/compiler-cli/ngcc/src/packages/entry_point");
    /**
     * Manages reading and writing a manifest file that contains a list of all the entry-points that
     * were found below a given basePath.
     *
     * This is a super-set of the entry-points that are actually processed for a given run of ngcc,
     * since some may already be processed, or excluded if they do not have the required format.
     */
    var EntryPointManifest = /** @class */ (function () {
        function EntryPointManifest(fs, config, logger) {
            this.fs = fs;
            this.config = config;
            this.logger = logger;
        }
        /**
         * Try to get the entry-point info from a manifest file for the given `basePath` if it exists and
         * is not out of date.
         *
         * Reasons for the manifest to be out of date are:
         *
         * * the file does not exist
         * * the ngcc version has changed
         * * the package lock-file (i.e. yarn.lock or package-lock.json) has changed
         * * the project configuration has changed
         * * one or more entry-points in the manifest are not valid
         *
         * @param basePath The path that would contain the entry-points and the manifest file.
         * @returns an array of entry-point information for all entry-points found below the given
         * `basePath` or `null` if the manifest was out of date.
         */
        EntryPointManifest.prototype.readEntryPointsUsingManifest = function (basePath) {
            var e_1, _a;
            try {
                if (this.fs.basename(basePath) !== 'node_modules') {
                    return null;
                }
                var manifestPath = this.getEntryPointManifestPath(basePath);
                if (!this.fs.exists(manifestPath)) {
                    return null;
                }
                var computedLockFileHash = this.computeLockFileHash(basePath);
                if (computedLockFileHash === null) {
                    return null;
                }
                var _b = JSON.parse(this.fs.readFile(manifestPath)), ngccVersion = _b.ngccVersion, configFileHash = _b.configFileHash, lockFileHash = _b.lockFileHash, entryPointPaths = _b.entryPointPaths;
                if (ngccVersion !== build_marker_1.NGCC_VERSION || configFileHash !== this.config.hash ||
                    lockFileHash !== computedLockFileHash) {
                    return null;
                }
                this.logger.debug("Entry-point manifest found for " + basePath + " so loading entry-point information directly.");
                var startTime = Date.now();
                var entryPoints = [];
                try {
                    for (var entryPointPaths_1 = tslib_1.__values(entryPointPaths), entryPointPaths_1_1 = entryPointPaths_1.next(); !entryPointPaths_1_1.done; entryPointPaths_1_1 = entryPointPaths_1.next()) {
                        var _c = tslib_1.__read(entryPointPaths_1_1.value, 5), packagePath = _c[0], entryPointPath = _c[1], _d = _c[2], dependencyPaths = _d === void 0 ? [] : _d, _e = _c[3], missingPaths = _e === void 0 ? [] : _e, _f = _c[4], deepImportPaths = _f === void 0 ? [] : _f;
                        var result = entry_point_1.getEntryPointInfo(this.fs, this.config, this.logger, this.fs.resolve(basePath, packagePath), this.fs.resolve(basePath, entryPointPath));
                        if (!entry_point_1.isEntryPoint(result)) {
                            throw new Error("The entry-point manifest at " + manifestPath + " contained an invalid pair of package paths: [" + packagePath + ", " + entryPointPath + "]");
                        }
                        else {
                            entryPoints.push({
                                entryPoint: result,
                                depInfo: {
                                    dependencies: new Set(dependencyPaths),
                                    missing: new Set(missingPaths),
                                    deepImports: new Set(deepImportPaths),
                                }
                            });
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (entryPointPaths_1_1 && !entryPointPaths_1_1.done && (_a = entryPointPaths_1.return)) _a.call(entryPointPaths_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                var duration = Math.round((Date.now() - startTime) / 100) / 10;
                this.logger.debug("Reading entry-points using the manifest entries took " + duration + "s.");
                return entryPoints;
            }
            catch (e) {
                this.logger.warn("Unable to read the entry-point manifest for " + basePath + ":\n", e.stack || e.toString());
                return null;
            }
        };
        /**
         * Write a manifest file at the given `basePath`.
         *
         * The manifest includes the current ngcc version and hashes of the package lock-file and current
         * project config. These will be used to check whether the manifest file is out of date. See
         * `readEntryPointsUsingManifest()`.
         *
         * @param basePath The path where the manifest file is to be written.
         * @param entryPoints A collection of entry-points to record in the manifest.
         */
        EntryPointManifest.prototype.writeEntryPointManifest = function (basePath, entryPoints) {
            var _this = this;
            if (this.fs.basename(basePath) !== 'node_modules') {
                return;
            }
            var lockFileHash = this.computeLockFileHash(basePath);
            if (lockFileHash === null) {
                return;
            }
            var manifest = {
                ngccVersion: build_marker_1.NGCC_VERSION,
                configFileHash: this.config.hash,
                lockFileHash: lockFileHash,
                entryPointPaths: entryPoints.map(function (e) {
                    var entryPointPaths = [
                        _this.fs.relative(basePath, e.entryPoint.packagePath),
                        _this.fs.relative(basePath, e.entryPoint.path),
                    ];
                    // Only add depInfo arrays if needed.
                    if (e.depInfo.dependencies.size > 0) {
                        entryPointPaths[2] = Array.from(e.depInfo.dependencies);
                    }
                    else if (e.depInfo.missing.size > 0 || e.depInfo.deepImports.size > 0) {
                        entryPointPaths[2] = [];
                    }
                    if (e.depInfo.missing.size > 0) {
                        entryPointPaths[3] = Array.from(e.depInfo.missing);
                    }
                    else if (e.depInfo.deepImports.size > 0) {
                        entryPointPaths[3] = [];
                    }
                    if (e.depInfo.deepImports.size > 0) {
                        entryPointPaths[4] = Array.from(e.depInfo.deepImports);
                    }
                    return entryPointPaths;
                }),
            };
            this.fs.writeFile(this.getEntryPointManifestPath(basePath), JSON.stringify(manifest));
        };
        EntryPointManifest.prototype.getEntryPointManifestPath = function (basePath) {
            return this.fs.resolve(basePath, '__ngcc_entry_points__.json');
        };
        EntryPointManifest.prototype.computeLockFileHash = function (basePath) {
            var e_2, _a;
            var directory = this.fs.dirname(basePath);
            try {
                for (var _b = tslib_1.__values(['yarn.lock', 'package-lock.json']), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var lockFileName = _c.value;
                    var lockFilePath = this.fs.resolve(directory, lockFileName);
                    if (this.fs.exists(lockFilePath)) {
                        var lockFileContents = this.fs.readFile(lockFilePath);
                        return crypto_1.createHash(this.config.hashAlgorithm).update(lockFileContents).digest('hex');
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
            return null;
        };
        return EntryPointManifest;
    }());
    exports.EntryPointManifest = EntryPointManifest;
    /**
     * A specialized implementation of the `EntryPointManifest` that can be used to invalidate the
     * current manifest file.
     *
     * It always returns `null` from the `readEntryPointsUsingManifest()` method, which forces a new
     * manifest to be created, which will overwrite the current file when `writeEntryPointManifest()`
     * is called.
     */
    var InvalidatingEntryPointManifest = /** @class */ (function (_super) {
        tslib_1.__extends(InvalidatingEntryPointManifest, _super);
        function InvalidatingEntryPointManifest() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        InvalidatingEntryPointManifest.prototype.readEntryPointsUsingManifest = function (_basePath) {
            return null;
        };
        return InvalidatingEntryPointManifest;
    }(EntryPointManifest));
    exports.InvalidatingEntryPointManifest = InvalidatingEntryPointManifest;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlfcG9pbnRfbWFuaWZlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvcGFja2FnZXMvZW50cnlfcG9pbnRfbWFuaWZlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILGlDQUFrQztJQU1sQyxxRkFBNEM7SUFFNUMsbUZBQTJGO0lBRTNGOzs7Ozs7T0FNRztJQUNIO1FBQ0UsNEJBQW9CLEVBQWMsRUFBVSxNQUF5QixFQUFVLE1BQWM7WUFBekUsT0FBRSxHQUFGLEVBQUUsQ0FBWTtZQUFVLFdBQU0sR0FBTixNQUFNLENBQW1CO1lBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFHLENBQUM7UUFFakc7Ozs7Ozs7Ozs7Ozs7OztXQWVHO1FBQ0gseURBQTRCLEdBQTVCLFVBQTZCLFFBQXdCOztZQUNuRCxJQUFJO2dCQUNGLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssY0FBYyxFQUFFO29CQUNqRCxPQUFPLElBQUksQ0FBQztpQkFDYjtnQkFFRCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzlELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtvQkFDakMsT0FBTyxJQUFJLENBQUM7aUJBQ2I7Z0JBRUQsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hFLElBQUksb0JBQW9CLEtBQUssSUFBSSxFQUFFO29CQUNqQyxPQUFPLElBQUksQ0FBQztpQkFDYjtnQkFFSyxJQUFBLEtBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxZQUFZ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QUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDckY7aUJBQ0Y7Ozs7Ozs7OztZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNILHlCQUFDO0lBQUQsQ0FBQyxBQTlJRCxJQThJQztJQTlJWSxnREFBa0I7SUFnSi9COzs7Ozs7O09BT0c7SUFDSDtRQUFvRCwwREFBa0I7UUFBdEU7O1FBS0EsQ0FBQztRQUpVLHFFQUE0QixHQUFyQyxVQUFzQyxTQUF5QjtZQUU3RCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDSCxxQ0FBQztJQUFELENBQUMsQUFMRCxDQUFvRCxrQkFBa0IsR0FLckU7SUFMWSx3RUFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Y3JlYXRlSGFzaH0gZnJvbSAnY3J5cHRvJztcblxuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgRmlsZVN5c3RlbSwgUGF0aFNlZ21lbnR9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2xvZ2dpbmcnO1xuaW1wb3J0IHtFbnRyeVBvaW50V2l0aERlcGVuZGVuY2llc30gZnJvbSAnLi4vZGVwZW5kZW5jaWVzL2RlcGVuZGVuY3lfaG9zdCc7XG5cbmltcG9ydCB7TkdDQ19WRVJTSU9OfSBmcm9tICcuL2J1aWxkX21hcmtlcic7XG5pbXBvcnQge05nY2NDb25maWd1cmF0aW9ufSBmcm9tICcuL2NvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHtnZXRFbnRyeVBvaW50SW5mbywgaXNFbnRyeVBvaW50LCBQYWNrYWdlSnNvbkZvcm1hdFByb3BlcnRpZXN9IGZyb20gJy4vZW50cnlfcG9pbnQnO1xuXG4vKipcbiAqIE1hbmFnZXMgcmVhZGluZyBhbmQgd3JpdGluZyBhIG1hbmlmZXN0IGZpbGUgdGhhdCBjb250YWlucyBhIGxpc3Qgb2YgYWxsIHRoZSBlbnRyeS1wb2ludHMgdGhhdFxuICogd2VyZSBmb3VuZCBiZWxvdyBhIGdpdmVuIGJhc2VQYXRoLlxuICpcbiAqIFRoaXMgaXMgYSBzdXBlci1zZXQgb2YgdGhlIGVudHJ5LXBvaW50cyB0aGF0IGFyZSBhY3R1YWxseSBwcm9jZXNzZWQgZm9yIGEgZ2l2ZW4gcnVuIG9mIG5nY2MsXG4gKiBzaW5jZSBzb21lIG1heSBhbHJlYWR5IGJlIHByb2Nlc3NlZCwgb3IgZXhjbHVkZWQgaWYgdGhleSBkbyBub3QgaGF2ZSB0aGUgcmVxdWlyZWQgZm9ybWF0LlxuICovXG5leHBvcnQgY2xhc3MgRW50cnlQb2ludE1hbmlmZXN0IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmczogRmlsZVN5c3RlbSwgcHJpdmF0ZSBjb25maWc6IE5nY2NDb25maWd1cmF0aW9uLCBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyKSB7fVxuXG4gIC8qKlxuICAgKiBUcnkgdG8gZ2V0IHRoZSBlbnRyeS1wb2ludCBpbmZvIGZyb20gYSBtYW5pZmVzdCBmaWxlIGZvciB0aGUgZ2l2ZW4gYGJhc2VQYXRoYCBpZiBpdCBleGlzdHMgYW5kXG4gICAqIGlzIG5vdCBvdXQgb2YgZGF0ZS5cbiAgICpcbiAgICogUmVhc29ucyBmb3IgdGhlIG1hbmlmZXN0IHRvIGJlIG91dCBvZiBkYXRlIGFyZTpcbiAgICpcbiAgICogKiB0aGUgZmlsZSBkb2VzIG5vdCBleGlzdFxuICAgKiAqIHRoZSBuZ2NjIHZlcnNpb24gaGFzIGNoYW5nZWRcbiAgICogKiB0aGUgcGFja2FnZSBsb2NrLWZpbGUgKGkuZS4geWFybi5sb2NrIG9yIHBhY2thZ2UtbG9jay5qc29uKSBoYXMgY2hhbmdlZFxuICAgKiAqIHRoZSBwcm9qZWN0IGNvbmZpZ3VyYXRpb24gaGFzIGNoYW5nZWRcbiAgICogKiBvbmUgb3IgbW9yZSBlbnRyeS1wb2ludHMgaW4gdGhlIG1hbmlmZXN0IGFyZSBub3QgdmFsaWRcbiAgICpcbiAgICogQHBhcmFtIGJhc2VQYXRoIFRoZSBwYXRoIHRoYXQgd291bGQgY29udGFpbiB0aGUgZW50cnktcG9pbnRzIGFuZCB0aGUgbWFuaWZlc3QgZmlsZS5cbiAgICogQHJldHVybnMgYW4gYXJyYXkgb2YgZW50cnktcG9pbnQgaW5mb3JtYXRpb24gZm9yIGFsbCBlbnRyeS1wb2ludHMgZm91bmQgYmVsb3cgdGhlIGdpdmVuXG4gICAqIGBiYXNlUGF0aGAgb3IgYG51bGxgIGlmIHRoZSBtYW5pZmVzdCB3YXMgb3V0IG9mIGRhdGUuXG4gICAqL1xuICByZWFkRW50cnlQb2ludHNVc2luZ01hbmlmZXN0KGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IEVudHJ5UG9pbnRXaXRoRGVwZW5kZW5jaWVzW118bnVsbCB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0aGlzLmZzLmJhc2VuYW1lKGJhc2VQYXRoKSAhPT0gJ25vZGVfbW9kdWxlcycpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1hbmlmZXN0UGF0aCA9IHRoaXMuZ2V0RW50cnlQb2ludE1hbmlmZXN0UGF0aChiYXNlUGF0aCk7XG4gICAgICBpZiAoIXRoaXMuZnMuZXhpc3RzKG1hbmlmZXN0UGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbXB1dGVkTG9ja0ZpbGVIYXNoID0gdGhpcy5jb21wdXRlTG9ja0ZpbGVIYXNoKGJhc2VQYXRoKTtcbiAgICAgIGlmIChjb21wdXRlZExvY2tGaWxlSGFzaCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3Qge25nY2NWZXJzaW9uLCBjb25maWdGaWxlSGFzaCwgbG9ja0ZpbGVIYXNoLCBlbnRyeVBvaW50UGF0aHN9ID1cbiAgICAgICAgICBKU09OLnBhcnNlKHRoaXMuZnMucmVhZEZpbGUobWFuaWZlc3RQYXRoKSkgYXMgRW50cnlQb2ludE1hbmlmZXN0RmlsZTtcbiAgICAgIGlmIChuZ2NjVmVyc2lvbiAhPT0gTkdDQ19WRVJTSU9OIHx8IGNvbmZpZ0ZpbGVIYXNoICE9PSB0aGlzLmNvbmZpZy5oYXNoIHx8XG4gICAgICAgICAgbG9ja0ZpbGVIYXNoICE9PSBjb21wdXRlZExvY2tGaWxlSGFzaCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYEVudHJ5LXBvaW50IG1hbmlmZXN0IGZvdW5kIGZvciAke1xuICAgICAgICAgIGJhc2VQYXRofSBzbyBsb2FkaW5nIGVudHJ5LXBvaW50IGluZm9ybWF0aW9uIGRpcmVjdGx5LmApO1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgY29uc3QgZW50cnlQb2ludHM6IEVudHJ5UG9pbnRXaXRoRGVwZW5kZW5jaWVzW10gPSBbXTtcbiAgICAgIGZvciAoY29uc3RcbiAgICAgICAgICAgICAgIFtwYWNrYWdlUGF0aCwgZW50cnlQb2ludFBhdGgsIGRlcGVuZGVuY3lQYXRocyA9IFtdLCBtaXNzaW5nUGF0aHMgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXBJbXBvcnRQYXRocyA9IFtdXSBvZiBlbnRyeVBvaW50UGF0aHMpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0RW50cnlQb2ludEluZm8oXG4gICAgICAgICAgICB0aGlzLmZzLCB0aGlzLmNvbmZpZywgdGhpcy5sb2dnZXIsIHRoaXMuZnMucmVzb2x2ZShiYXNlUGF0aCwgcGFja2FnZVBhdGgpLFxuICAgICAgICAgICAgdGhpcy5mcy5yZXNvbHZlKGJhc2VQYXRoLCBlbnRyeVBvaW50UGF0aCkpO1xuICAgICAgICBpZiAoIWlzRW50cnlQb2ludChyZXN1bHQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZW50cnktcG9pbnQgbWFuaWZlc3QgYXQgJHtcbiAgICAgICAgICAgICAgbWFuaWZlc3RQYXRofSBjb250YWluZWQgYW4gaW52YWxpZCBwYWlyIG9mIHBhY2thZ2UgcGF0aHM6IFske3BhY2thZ2VQYXRofSwgJHtcbiAgICAgICAgICAgICAgZW50cnlQb2ludFBhdGh9XWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudHJ5UG9pbnRzLnB1c2goe1xuICAgICAgICAgICAgZW50cnlQb2ludDogcmVzdWx0LFxuICAgICAgICAgICAgZGVwSW5mbzoge1xuICAgICAgICAgICAgICBkZXBlbmRlbmNpZXM6IG5ldyBTZXQoZGVwZW5kZW5jeVBhdGhzKSxcbiAgICAgICAgICAgICAgbWlzc2luZzogbmV3IFNldChtaXNzaW5nUGF0aHMpLFxuICAgICAgICAgICAgICBkZWVwSW1wb3J0czogbmV3IFNldChkZWVwSW1wb3J0UGF0aHMpLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBkdXJhdGlvbiA9IE1hdGgucm91bmQoKERhdGUubm93KCkgLSBzdGFydFRpbWUpIC8gMTAwKSAvIDEwO1xuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYFJlYWRpbmcgZW50cnktcG9pbnRzIHVzaW5nIHRoZSBtYW5pZmVzdCBlbnRyaWVzIHRvb2sgJHtkdXJhdGlvbn1zLmApO1xuICAgICAgcmV0dXJuIGVudHJ5UG9pbnRzO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMubG9nZ2VyLndhcm4oXG4gICAgICAgICAgYFVuYWJsZSB0byByZWFkIHRoZSBlbnRyeS1wb2ludCBtYW5pZmVzdCBmb3IgJHtiYXNlUGF0aH06XFxuYCwgZS5zdGFjayB8fCBlLnRvU3RyaW5nKCkpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIGEgbWFuaWZlc3QgZmlsZSBhdCB0aGUgZ2l2ZW4gYGJhc2VQYXRoYC5cbiAgICpcbiAgICogVGhlIG1hbmlmZXN0IGluY2x1ZGVzIHRoZSBjdXJyZW50IG5nY2MgdmVyc2lvbiBhbmQgaGFzaGVzIG9mIHRoZSBwYWNrYWdlIGxvY2stZmlsZSBhbmQgY3VycmVudFxuICAgKiBwcm9qZWN0IGNvbmZpZy4gVGhlc2Ugd2lsbCBiZSB1c2VkIHRvIGNoZWNrIHdoZXRoZXIgdGhlIG1hbmlmZXN0IGZpbGUgaXMgb3V0IG9mIGRhdGUuIFNlZVxuICAgKiBgcmVhZEVudHJ5UG9pbnRzVXNpbmdNYW5pZmVzdCgpYC5cbiAgICpcbiAgICogQHBhcmFtIGJhc2VQYXRoIFRoZSBwYXRoIHdoZXJlIHRoZSBtYW5pZmVzdCBmaWxlIGlzIHRvIGJlIHdyaXR0ZW4uXG4gICAqIEBwYXJhbSBlbnRyeVBvaW50cyBBIGNvbGxlY3Rpb24gb2YgZW50cnktcG9pbnRzIHRvIHJlY29yZCBpbiB0aGUgbWFuaWZlc3QuXG4gICAqL1xuICB3cml0ZUVudHJ5UG9pbnRNYW5pZmVzdChiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsIGVudHJ5UG9pbnRzOiBFbnRyeVBvaW50V2l0aERlcGVuZGVuY2llc1tdKTpcbiAgICAgIHZvaWQge1xuICAgIGlmICh0aGlzLmZzLmJhc2VuYW1lKGJhc2VQYXRoKSAhPT0gJ25vZGVfbW9kdWxlcycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsb2NrRmlsZUhhc2ggPSB0aGlzLmNvbXB1dGVMb2NrRmlsZUhhc2goYmFzZVBhdGgpO1xuICAgIGlmIChsb2NrRmlsZUhhc2ggPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWFuaWZlc3Q6IEVudHJ5UG9pbnRNYW5pZmVzdEZpbGUgPSB7XG4gICAgICBuZ2NjVmVyc2lvbjogTkdDQ19WRVJTSU9OLFxuICAgICAgY29uZmlnRmlsZUhhc2g6IHRoaXMuY29uZmlnLmhhc2gsXG4gICAgICBsb2NrRmlsZUhhc2g6IGxvY2tGaWxlSGFzaCxcbiAgICAgIGVudHJ5UG9pbnRQYXRoczogZW50cnlQb2ludHMubWFwKGUgPT4ge1xuICAgICAgICBjb25zdCBlbnRyeVBvaW50UGF0aHM6IEVudHJ5UG9pbnRQYXRocyA9IFtcbiAgICAgICAgICB0aGlzLmZzLnJlbGF0aXZlKGJhc2VQYXRoLCBlLmVudHJ5UG9pbnQucGFja2FnZVBhdGgpLFxuICAgICAgICAgIHRoaXMuZnMucmVsYXRpdmUoYmFzZVBhdGgsIGUuZW50cnlQb2ludC5wYXRoKSxcbiAgICAgICAgXTtcbiAgICAgICAgLy8gT25seSBhZGQgZGVwSW5mbyBhcnJheXMgaWYgbmVlZGVkLlxuICAgICAgICBpZiAoZS5kZXBJbmZvLmRlcGVuZGVuY2llcy5zaXplID4gMCkge1xuICAgICAgICAgIGVudHJ5UG9pbnRQYXRoc1syXSA9IEFycmF5LmZyb20oZS5kZXBJbmZvLmRlcGVuZGVuY2llcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZS5kZXBJbmZvLm1pc3Npbmcuc2l6ZSA+IDAgfHwgZS5kZXBJbmZvLmRlZXBJbXBvcnRzLnNpemUgPiAwKSB7XG4gICAgICAgICAgZW50cnlQb2ludFBhdGhzWzJdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUuZGVwSW5mby5taXNzaW5nLnNpemUgPiAwKSB7XG4gICAgICAgICAgZW50cnlQb2ludFBhdGhzWzNdID0gQXJyYXkuZnJvbShlLmRlcEluZm8ubWlzc2luZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZS5kZXBJbmZvLmRlZXBJbXBvcnRzLnNpemUgPiAwKSB7XG4gICAgICAgICAgZW50cnlQb2ludFBhdGhzWzNdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUuZGVwSW5mby5kZWVwSW1wb3J0cy5zaXplID4gMCkge1xuICAgICAgICAgIGVudHJ5UG9pbnRQYXRoc1s0XSA9IEFycmF5LmZyb20oZS5kZXBJbmZvLmRlZXBJbXBvcnRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW50cnlQb2ludFBhdGhzO1xuICAgICAgfSksXG4gICAgfTtcbiAgICB0aGlzLmZzLndyaXRlRmlsZSh0aGlzLmdldEVudHJ5UG9pbnRNYW5pZmVzdFBhdGgoYmFzZVBhdGgpLCBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFbnRyeVBvaW50TWFuaWZlc3RQYXRoKGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCkge1xuICAgIHJldHVybiB0aGlzLmZzLnJlc29sdmUoYmFzZVBhdGgsICdfX25nY2NfZW50cnlfcG9pbnRzX18uanNvbicpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21wdXRlTG9ja0ZpbGVIYXNoKGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCk6IHN0cmluZ3xudWxsIHtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSB0aGlzLmZzLmRpcm5hbWUoYmFzZVBhdGgpO1xuICAgIGZvciAoY29uc3QgbG9ja0ZpbGVOYW1lIG9mIFsneWFybi5sb2NrJywgJ3BhY2thZ2UtbG9jay5qc29uJ10pIHtcbiAgICAgIGNvbnN0IGxvY2tGaWxlUGF0aCA9IHRoaXMuZnMucmVzb2x2ZShkaXJlY3RvcnksIGxvY2tGaWxlTmFtZSk7XG4gICAgICBpZiAodGhpcy5mcy5leGlzdHMobG9ja0ZpbGVQYXRoKSkge1xuICAgICAgICBjb25zdCBsb2NrRmlsZUNvbnRlbnRzID0gdGhpcy5mcy5yZWFkRmlsZShsb2NrRmlsZVBhdGgpO1xuICAgICAgICByZXR1cm4gY3JlYXRlSGFzaCh0aGlzLmNvbmZpZy5oYXNoQWxnb3JpdGhtKS51cGRhdGUobG9ja0ZpbGVDb250ZW50cykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgRW50cnlQb2ludE1hbmlmZXN0YCB0aGF0IGNhbiBiZSB1c2VkIHRvIGludmFsaWRhdGUgdGhlXG4gKiBjdXJyZW50IG1hbmlmZXN0IGZpbGUuXG4gKlxuICogSXQgYWx3YXlzIHJldHVybnMgYG51bGxgIGZyb20gdGhlIGByZWFkRW50cnlQb2ludHNVc2luZ01hbmlmZXN0KClgIG1ldGhvZCwgd2hpY2ggZm9yY2VzIGEgbmV3XG4gKiBtYW5pZmVzdCB0byBiZSBjcmVhdGVkLCB3aGljaCB3aWxsIG92ZXJ3cml0ZSB0aGUgY3VycmVudCBmaWxlIHdoZW4gYHdyaXRlRW50cnlQb2ludE1hbmlmZXN0KClgXG4gKiBpcyBjYWxsZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnZhbGlkYXRpbmdFbnRyeVBvaW50TWFuaWZlc3QgZXh0ZW5kcyBFbnRyeVBvaW50TWFuaWZlc3Qge1xuICBvdmVycmlkZSByZWFkRW50cnlQb2ludHNVc2luZ01hbmlmZXN0KF9iYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgpOlxuICAgICAgRW50cnlQb2ludFdpdGhEZXBlbmRlbmNpZXNbXXxudWxsIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBFbnRyeVBvaW50UGF0aHMgPSBbXG4gIHN0cmluZyxcbiAgc3RyaW5nLFxuICBBcnJheTxBYnNvbHV0ZUZzUGF0aD4/LFxuICBBcnJheTxBYnNvbHV0ZUZzUGF0aHxQYXRoU2VnbWVudD4/LFxuICBBcnJheTxBYnNvbHV0ZUZzUGF0aD4/LFxuXTtcblxuLyoqXG4gKiBUaGUgSlNPTiBmb3JtYXQgb2YgdGhlIG1hbmlmZXN0IGZpbGUgdGhhdCBpcyB3cml0dGVuIHRvIGRpc2suXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50cnlQb2ludE1hbmlmZXN0RmlsZSB7XG4gIG5nY2NWZXJzaW9uOiBzdHJpbmc7XG4gIGNvbmZpZ0ZpbGVIYXNoOiBzdHJpbmc7XG4gIGxvY2tGaWxlSGFzaDogc3RyaW5nO1xuICBlbnRyeVBvaW50UGF0aHM6IEVudHJ5UG9pbnRQYXRoc1tdO1xufVxuXG5cbi8qKiBUaGUgSlNPTiBmb3JtYXQgb2YgdGhlIGVudHJ5cG9pbnQgcHJvcGVydGllcy4gKi9cbmV4cG9ydCB0eXBlIE5ld0VudHJ5UG9pbnRQcm9wZXJ0aWVzTWFwID0ge1xuICBbUHJvcGVydHkgaW4gUGFja2FnZUpzb25Gb3JtYXRQcm9wZXJ0aWVzIGFzIGAke1Byb3BlcnR5fV9pdnlfbmdjY2BdPzogc3RyaW5nO1xufTtcbiJdfQ==