(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/writing/new_entry_point_file_writer", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/ngcc/src/writing/in_place_file_writer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NewEntryPointFileWriter = exports.NGCC_PROPERTY_EXTENSION = exports.NGCC_DIRECTORY = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var in_place_file_writer_1 = require("@angular/compiler-cli/ngcc/src/writing/in_place_file_writer");
    exports.NGCC_DIRECTORY = '__ivy_ngcc__';
    exports.NGCC_PROPERTY_EXTENSION = '_ivy_ngcc';
    /**
     * This FileWriter creates a copy of the original entry-point, then writes the transformed
     * files onto the files in this copy, and finally updates the package.json with a new
     * entry-point format property that points to this new entry-point.
     *
     * If there are transformed typings files in this bundle, they are updated in-place (see the
     * `InPlaceFileWriter`).
     */
    var NewEntryPointFileWriter = /** @class */ (function (_super) {
        tslib_1.__extends(NewEntryPointFileWriter, _super);
        function NewEntryPointFileWriter(fs, logger, errorOnFailedEntryPoint, pkgJsonUpdater) {
            var _this = _super.call(this, fs, logger, errorOnFailedEntryPoint) || this;
            _this.pkgJsonUpdater = pkgJsonUpdater;
            return _this;
        }
        NewEntryPointFileWriter.prototype.writeBundle = function (bundle, transformedFiles, formatProperties) {
            var _this = this;
            // The new folder is at the root of the overall package
            var entryPoint = bundle.entryPoint;
            var ngccFolder = this.fs.join(entryPoint.packagePath, exports.NGCC_DIRECTORY);
            this.copyBundle(bundle, entryPoint.packagePath, ngccFolder, transformedFiles);
            transformedFiles.forEach(function (file) { return _this.writeFile(file, entryPoint.packagePath, ngccFolder); });
            this.updatePackageJson(entryPoint, formatProperties, ngccFolder);
        };
        NewEntryPointFileWriter.prototype.revertBundle = function (entryPoint, transformedFilePaths, formatProperties) {
            // IMPLEMENTATION NOTE:
            //
            // The changes made by `copyBundle()` are not reverted here. The non-transformed copied files
            // are identical to the original ones and they will be overwritten when re-processing the
            // entry-point anyway.
            //
            // This way, we avoid the overhead of having to inform the master process about all source files
            // being copied in `copyBundle()`.
            var e_1, _a;
            try {
                // Revert the transformed files.
                for (var transformedFilePaths_1 = tslib_1.__values(transformedFilePaths), transformedFilePaths_1_1 = transformedFilePaths_1.next(); !transformedFilePaths_1_1.done; transformedFilePaths_1_1 = transformedFilePaths_1.next()) {
                    var filePath = transformedFilePaths_1_1.value;
                    this.revertFile(filePath, entryPoint.packagePath);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (transformedFilePaths_1_1 && !transformedFilePaths_1_1.done && (_a = transformedFilePaths_1.return)) _a.call(transformedFilePaths_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // Revert any changes to `package.json`.
            this.revertPackageJson(entryPoint, formatProperties);
        };
        NewEntryPointFileWriter.prototype.copyBundle = function (bundle, packagePath, ngccFolder, transformedFiles) {
            var _this = this;
            var doNotCopy = new Set(transformedFiles.map(function (f) { return f.path; }));
            bundle.src.program.getSourceFiles().forEach(function (sourceFile) {
                var originalPath = file_system_1.absoluteFromSourceFile(sourceFile);
                if (doNotCopy.has(originalPath)) {
                    return;
                }
                var relativePath = _this.fs.relative(packagePath, originalPath);
                var isInsidePackage = file_system_1.isLocalRelativePath(relativePath);
                if (!sourceFile.isDeclarationFile && isInsidePackage) {
                    var newPath = _this.fs.resolve(ngccFolder, relativePath);
                    _this.fs.ensureDir(_this.fs.dirname(newPath));
                    _this.fs.copyFile(originalPath, newPath);
                    _this.copyAndUpdateSourceMap(originalPath, newPath);
                }
            });
        };
        /**
         * If a source file has an associated source-map, then copy this, while updating its sourceRoot
         * accordingly.
         *
         * For now don't try to parse the source for inline source-maps or external source-map links,
         * since that is more complex and will slow ngcc down.
         * Instead just check for a source-map file residing next to the source file, which is by far
         * the most common case.
         *
         * @param originalSrcPath absolute path to the original source file being copied.
         * @param newSrcPath absolute path to where the source will be written.
         */
        NewEntryPointFileWriter.prototype.copyAndUpdateSourceMap = function (originalSrcPath, newSrcPath) {
            var _a;
            var sourceMapPath = (originalSrcPath + '.map');
            if (this.fs.exists(sourceMapPath)) {
                try {
                    var sourceMap = JSON.parse(this.fs.readFile(sourceMapPath));
                    var newSourceMapPath = (newSrcPath + '.map');
                    var relativePath = this.fs.relative(this.fs.dirname(newSourceMapPath), this.fs.dirname(sourceMapPath));
                    sourceMap.sourceRoot = this.fs.join(relativePath, sourceMap.sourceRoot || '.');
                    this.fs.ensureDir(this.fs.dirname(newSourceMapPath));
                    this.fs.writeFile(newSourceMapPath, JSON.stringify(sourceMap));
                }
                catch (e) {
                    this.logger.warn("Failed to process source-map at " + sourceMapPath);
                    this.logger.warn((_a = e.message) !== null && _a !== void 0 ? _a : e);
                }
            }
        };
        NewEntryPointFileWriter.prototype.writeFile = function (file, packagePath, ngccFolder) {
            if (typescript_1.isDtsPath(file.path.replace(/\.map$/, ''))) {
                // This is either `.d.ts` or `.d.ts.map` file
                _super.prototype.writeFileAndBackup.call(this, file);
            }
            else {
                var relativePath = this.fs.relative(packagePath, file.path);
                var newFilePath = this.fs.resolve(ngccFolder, relativePath);
                this.fs.ensureDir(this.fs.dirname(newFilePath));
                this.fs.writeFile(newFilePath, file.contents);
            }
        };
        NewEntryPointFileWriter.prototype.revertFile = function (filePath, packagePath) {
            if (typescript_1.isDtsPath(filePath.replace(/\.map$/, ''))) {
                // This is either `.d.ts` or `.d.ts.map` file
                _super.prototype.revertFileAndBackup.call(this, filePath);
            }
            else if (this.fs.exists(filePath)) {
                var relativePath = this.fs.relative(packagePath, filePath);
                var newFilePath = this.fs.resolve(packagePath, exports.NGCC_DIRECTORY, relativePath);
                this.fs.removeFile(newFilePath);
            }
        };
        NewEntryPointFileWriter.prototype.updatePackageJson = function (entryPoint, formatProperties, ngccFolder) {
            var e_2, _a;
            if (formatProperties.length === 0) {
                // No format properties need updating.
                return;
            }
            var packageJson = entryPoint.packageJson;
            var packageJsonPath = this.fs.join(entryPoint.path, 'package.json');
            // All format properties point to the same format-path.
            var oldFormatProp = formatProperties[0];
            var oldFormatPath = packageJson[oldFormatProp];
            var oldAbsFormatPath = this.fs.resolve(entryPoint.path, oldFormatPath);
            var newAbsFormatPath = this.fs.resolve(ngccFolder, this.fs.relative(entryPoint.packagePath, oldAbsFormatPath));
            var newFormatPath = this.fs.relative(entryPoint.path, newAbsFormatPath);
            // Update all properties in `package.json` (both in memory and on disk).
            var update = this.pkgJsonUpdater.createUpdate();
            try {
                for (var formatProperties_1 = tslib_1.__values(formatProperties), formatProperties_1_1 = formatProperties_1.next(); !formatProperties_1_1.done; formatProperties_1_1 = formatProperties_1.next()) {
                    var formatProperty = formatProperties_1_1.value;
                    if (packageJson[formatProperty] !== oldFormatPath) {
                        throw new Error("Unable to update '" + packageJsonPath + "': Format properties " +
                            ("(" + formatProperties.join(', ') + ") map to more than one format-path."));
                    }
                    update.addChange(["" + formatProperty + exports.NGCC_PROPERTY_EXTENSION], newFormatPath, { before: formatProperty });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (formatProperties_1_1 && !formatProperties_1_1.done && (_a = formatProperties_1.return)) _a.call(formatProperties_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            update.writeChanges(packageJsonPath, packageJson);
        };
        NewEntryPointFileWriter.prototype.revertPackageJson = function (entryPoint, formatProperties) {
            var e_3, _a;
            if (formatProperties.length === 0) {
                // No format properties need reverting.
                return;
            }
            var packageJson = entryPoint.packageJson;
            var packageJsonPath = this.fs.join(entryPoint.path, 'package.json');
            // Revert all properties in `package.json` (both in memory and on disk).
            // Since `updatePackageJson()` only adds properties, it is safe to just remove them (if they
            // exist).
            var update = this.pkgJsonUpdater.createUpdate();
            try {
                for (var formatProperties_2 = tslib_1.__values(formatProperties), formatProperties_2_1 = formatProperties_2.next(); !formatProperties_2_1.done; formatProperties_2_1 = formatProperties_2.next()) {
                    var formatProperty = formatProperties_2_1.value;
                    update.addChange(["" + formatProperty + exports.NGCC_PROPERTY_EXTENSION], undefined);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (formatProperties_2_1 && !formatProperties_2_1.done && (_a = formatProperties_2.return)) _a.call(formatProperties_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            update.writeChanges(packageJsonPath, packageJson);
        };
        return NewEntryPointFileWriter;
    }(in_place_file_writer_1.InPlaceFileWriter));
    exports.NewEntryPointFileWriter = NewEntryPointFileWriter;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3X2VudHJ5X3BvaW50X2ZpbGVfd3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL3dyaXRpbmcvbmV3X2VudHJ5X3BvaW50X2ZpbGVfd3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFDQTs7Ozs7O09BTUc7SUFDSCwyRUFBdUg7SUFFdkgsa0ZBQWlFO0lBS2pFLG9HQUF5RDtJQUc1QyxRQUFBLGNBQWMsR0FBRyxjQUFjLENBQUM7SUFDaEMsUUFBQSx1QkFBdUIsR0FBRyxXQUFXLENBQUM7SUFFbkQ7Ozs7Ozs7T0FPRztJQUNIO1FBQTZDLG1EQUFpQjtRQUM1RCxpQ0FDSSxFQUFjLEVBQUUsTUFBYyxFQUFFLHVCQUFnQyxFQUN4RCxjQUFrQztZQUY5QyxZQUdFLGtCQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsdUJBQXVCLENBQUMsU0FDM0M7WUFGVyxvQkFBYyxHQUFkLGNBQWMsQ0FBb0I7O1FBRTlDLENBQUM7UUFFUSw2Q0FBVyxHQUFwQixVQUNJLE1BQXdCLEVBQUUsZ0JBQStCLEVBQ3pELGdCQUEwQztZQUY5QyxpQkFTQztZQU5DLHVEQUF1RDtZQUN2RCxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3JDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsc0JBQWMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDOUUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLFdBQVcsRUFBRSxVQUFV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QixVQUE0QixVQUFzQixFQUFFLGdCQUEwQzs7WUFDNUYsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNqQyx1Q0FBdUM7Z0JBQ3ZDLE9BQU87YUFDUjtZQUVELElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUM7WUFDM0MsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUV0RSx3RUFBd0U7WUFDeEUsNEZBQTRGO1lBQzVGLFVBQVU7WUFDVixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDOztnQkFFbEQsS0FBNkIsSUFBQSxxQkFBQSxpQkFBQSxnQkFBZ0IsQ0FBQSxrREFBQSxnRkFBRTtvQkFBMUMsSUFBTSxjQUFjLDZCQUFBO29CQUN2QixNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBRyxjQUFjLEdBQUcsK0JBQXlCLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztpQkFDOUU7Ozs7Ozs7OztZQUVELE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFDSCw4QkFBQztJQUFELENBQUMsQUEzS0QsQ0FBNkMsd0NBQWlCLEdBMks3RDtJQTNLWSwwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHthYnNvbHV0ZUZyb21Tb3VyY2VGaWxlLCBBYnNvbHV0ZUZzUGF0aCwgRmlsZVN5c3RlbSwgaXNMb2NhbFJlbGF0aXZlUGF0aH0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvbG9nZ2luZyc7XG5pbXBvcnQge2lzRHRzUGF0aH0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3V0aWwvc3JjL3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtFbnRyeVBvaW50LCBFbnRyeVBvaW50SnNvblByb3BlcnR5fSBmcm9tICcuLi9wYWNrYWdlcy9lbnRyeV9wb2ludCc7XG5pbXBvcnQge0VudHJ5UG9pbnRCdW5kbGV9IGZyb20gJy4uL3BhY2thZ2VzL2VudHJ5X3BvaW50X2J1bmRsZSc7XG5pbXBvcnQge0ZpbGVUb1dyaXRlfSBmcm9tICcuLi9yZW5kZXJpbmcvdXRpbHMnO1xuXG5pbXBvcnQge0luUGxhY2VGaWxlV3JpdGVyfSBmcm9tICcuL2luX3BsYWNlX2ZpbGVfd3JpdGVyJztcbmltcG9ydCB7UGFja2FnZUpzb25VcGRhdGVyfSBmcm9tICcuL3BhY2thZ2VfanNvbl91cGRhdGVyJztcblxuZXhwb3J0IGNvbnN0IE5HQ0NfRElSRUNUT1JZID0gJ19faXZ5X25nY2NfXyc7XG5leHBvcnQgY29uc3QgTkdDQ19QUk9QRVJUWV9FWFRFTlNJT04gPSAnX2l2eV9uZ2NjJztcblxuLyoqXG4gKiBUaGlzIEZpbGVXcml0ZXIgY3JlYXRlcyBhIGNvcHkgb2YgdGhlIG9yaWdpbmFsIGVudHJ5LXBvaW50LCB0aGVuIHdyaXRlcyB0aGUgdHJhbnNmb3JtZWRcbiAqIGZpbGVzIG9udG8gdGhlIGZpbGVzIGluIHRoaXMgY29weSwgYW5kIGZpbmFsbHkgdXBkYXRlcyB0aGUgcGFja2FnZS5qc29uIHdpdGggYSBuZXdcbiAqIGVudHJ5LXBvaW50IGZvcm1hdCBwcm9wZXJ0eSB0aGF0IHBvaW50cyB0byB0aGlzIG5ldyBlbnRyeS1wb2ludC5cbiAqXG4gKiBJZiB0aGVyZSBhcmUgdHJhbnNmb3JtZWQgdHlwaW5ncyBmaWxlcyBpbiB0aGlzIGJ1bmRsZSwgdGhleSBhcmUgdXBkYXRlZCBpbi1wbGFjZSAoc2VlIHRoZVxuICogYEluUGxhY2VGaWxlV3JpdGVyYCkuXG4gKi9cbmV4cG9ydCBjbGFzcyBOZXdFbnRyeVBvaW50RmlsZVdyaXRlciBleHRlbmRzIEluUGxhY2VGaWxlV3JpdGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBmczogRmlsZVN5c3RlbSwgbG9nZ2VyOiBMb2dnZXIsIGVycm9yT25GYWlsZWRFbnRyeVBvaW50OiBib29sZWFuLFxuICAgICAgcHJpdmF0ZSBwa2dKc29uVXBkYXRlcjogUGFja2FnZUpzb25VcGRhdGVyKSB7XG4gICAgc3VwZXIoZnMsIGxvZ2dlciwgZXJyb3JPbkZhaWxlZEVudHJ5UG9pbnQpO1xuICB9XG5cbiAgb3ZlcnJpZGUgd3JpdGVCdW5kbGUoXG4gICAgICBidW5kbGU6IEVudHJ5UG9pbnRCdW5kbGUsIHRyYW5zZm9ybWVkRmlsZXM6IEZpbGVUb1dyaXRlW10sXG4gICAgICBmb3JtYXRQcm9wZXJ0aWVzOiBFbnRyeVBvaW50SnNvblByb3BlcnR5W10pIHtcbiAgICAvLyBUaGUgbmV3IGZvbGRlciBpcyBhdCB0aGUgcm9vdCBvZiB0aGUgb3ZlcmFsbCBwYWNrYWdlXG4gICAgY29uc3QgZW50cnlQb2ludCA9IGJ1bmRsZS5lbnRyeVBvaW50O1xuICAgIGNvbnN0IG5nY2NGb2xkZXIgPSB0aGlzLmZzLmpvaW4oZW50cnlQb2ludC5wYWNrYWdlUGF0aCwgTkdDQ19ESVJFQ1RPUlkpO1xuICAgIHRoaXMuY29weUJ1bmRsZShidW5kbGUsIGVudHJ5UG9pbnQucGFja2FnZVBhdGgsIG5nY2NGb2xkZXIsIHRyYW5zZm9ybWVkRmlsZXMpO1xuICAgIHRyYW5zZm9ybWVkRmlsZXMuZm9yRWFjaChmaWxlID0+IHRoaXMud3JpdGVGaWxlKGZpbGUsIGVudHJ5UG9pbnQucGFja2FnZVBhdGgsIG5nY2NGb2xkZXIpKTtcbiAgICB0aGlzLnVwZGF0ZVBhY2thZ2VKc29uKGVudHJ5UG9pbnQsIGZvcm1hdFByb3BlcnRpZXMsIG5nY2NGb2xkZXIpO1xuICB9XG5cbiAgb3ZlcnJpZGUgcmV2ZXJ0QnVuZGxlKFxuICAgICAgZW50cnlQb2ludDogRW50cnlQb2ludCwgdHJhbnNmb3JtZWRGaWxlUGF0aHM6IEFic29sdXRlRnNQYXRoW10sXG4gICAgICBmb3JtYXRQcm9wZXJ0aWVzOiBFbnRyeVBvaW50SnNvblByb3BlcnR5W10pOiB2b2lkIHtcbiAgICAvLyBJTVBMRU1FTlRBVElPTiBOT1RFOlxuICAgIC8vXG4gICAgLy8gVGhlIGNoYW5nZXMgbWFkZSBieSBgY29weUJ1bmRsZSgpYCBhcmUgbm90IHJldmVydGVkIGhlcmUuIFRoZSBub24tdHJhbnNmb3JtZWQgY29waWVkIGZpbGVzXG4gICAgLy8gYXJlIGlkZW50aWNhbCB0byB0aGUgb3JpZ2luYWwgb25lcyBhbmQgdGhleSB3aWxsIGJlIG92ZXJ3cml0dGVuIHdoZW4gcmUtcHJvY2Vzc2luZyB0aGVcbiAgICAvLyBlbnRyeS1wb2ludCBhbnl3YXkuXG4gICAgLy9cbiAgICAvLyBUaGlzIHdheSwgd2UgYXZvaWQgdGhlIG92ZXJoZWFkIG9mIGhhdmluZyB0byBpbmZvcm0gdGhlIG1hc3RlciBwcm9jZXNzIGFib3V0IGFsbCBzb3VyY2UgZmlsZXNcbiAgICAvLyBiZWluZyBjb3BpZWQgaW4gYGNvcHlCdW5kbGUoKWAuXG5cbiAgICAvLyBSZXZlcnQgdGhlIHRyYW5zZm9ybWVkIGZpbGVzLlxuICAgIGZvciAoY29uc3QgZmlsZVBhdGggb2YgdHJhbnNmb3JtZWRGaWxlUGF0aHMpIHtcbiAgICAgIHRoaXMucmV2ZXJ0RmlsZShmaWxlUGF0aCwgZW50cnlQb2ludC5wYWNrYWdlUGF0aCk7XG4gICAgfVxuXG4gICAgLy8gUmV2ZXJ0IGFueSBjaGFuZ2VzIHRvIGBwYWNrYWdlLmpzb25gLlxuICAgIHRoaXMucmV2ZXJ0UGFja2FnZUpzb24oZW50cnlQb2ludCwgZm9ybWF0UHJvcGVydGllcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29weUJ1bmRsZShcbiAgICAgIGJ1bmRsZTogRW50cnlQb2ludEJ1bmRsZSwgcGFja2FnZVBhdGg6IEFic29sdXRlRnNQYXRoLCBuZ2NjRm9sZGVyOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICAgIHRyYW5zZm9ybWVkRmlsZXM6IEZpbGVUb1dyaXRlW10pIHtcbiAgICBjb25zdCBkb05vdENvcHkgPSBuZXcgU2V0KHRyYW5zZm9ybWVkRmlsZXMubWFwKGYgPT4gZi5wYXRoKSk7XG4gICAgYnVuZGxlLnNyYy5wcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkuZm9yRWFjaChzb3VyY2VGaWxlID0+IHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsUGF0aCA9IGFic29sdXRlRnJvbVNvdXJjZUZpbGUoc291cmNlRmlsZSk7XG4gICAgICBpZiAoZG9Ob3RDb3B5LmhhcyhvcmlnaW5hbFBhdGgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHRoaXMuZnMucmVsYXRpdmUocGFja2FnZVBhdGgsIG9yaWdpbmFsUGF0aCk7XG4gICAgICBjb25zdCBpc0luc2lkZVBhY2thZ2UgPSBpc0xvY2FsUmVsYXRpdmVQYXRoKHJlbGF0aXZlUGF0aCk7XG4gICAgICBpZiAoIXNvdXJjZUZpbGUuaXNEZWNsYXJhdGlvbkZpbGUgJiYgaXNJbnNpZGVQYWNrYWdlKSB7XG4gICAgICAgIGNvbnN0IG5ld1BhdGggPSB0aGlzLmZzLnJlc29sdmUobmdjY0ZvbGRlciwgcmVsYXRpdmVQYXRoKTtcbiAgICAgICAgdGhpcy5mcy5lbnN1cmVEaXIodGhpcy5mcy5kaXJuYW1lKG5ld1BhdGgpKTtcbiAgICAgICAgdGhpcy5mcy5jb3B5RmlsZShvcmlnaW5hbFBhdGgsIG5ld1BhdGgpO1xuICAgICAgICB0aGlzLmNvcHlBbmRVcGRhdGVTb3VyY2VNYXAob3JpZ2luYWxQYXRoLCBuZXdQYXRoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBhIHNvdXJjZSBmaWxlIGhhcyBhbiBhc3NvY2lhdGVkIHNvdXJjZS1tYXAsIHRoZW4gY29weSB0aGlzLCB3aGlsZSB1cGRhdGluZyBpdHMgc291cmNlUm9vdFxuICAgKiBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogRm9yIG5vdyBkb24ndCB0cnkgdG8gcGFyc2UgdGhlIHNvdXJjZSBmb3IgaW5saW5lIHNvdXJjZS1tYXBzIG9yIGV4dGVybmFsIHNvdXJjZS1tYXAgbGlua3MsXG4gICAqIHNpbmNlIHRoYXQgaXMgbW9yZSBjb21wbGV4IGFuZCB3aWxsIHNsb3cgbmdjYyBkb3duLlxuICAgKiBJbnN0ZWFkIGp1c3QgY2hlY2sgZm9yIGEgc291cmNlLW1hcCBmaWxlIHJlc2lkaW5nIG5leHQgdG8gdGhlIHNvdXJjZSBmaWxlLCB3aGljaCBpcyBieSBmYXJcbiAgICogdGhlIG1vc3QgY29tbW9uIGNhc2UuXG4gICAqXG4gICAqIEBwYXJhbSBvcmlnaW5hbFNyY1BhdGggYWJzb2x1dGUgcGF0aCB0byB0aGUgb3JpZ2luYWwgc291cmNlIGZpbGUgYmVpbmcgY29waWVkLlxuICAgKiBAcGFyYW0gbmV3U3JjUGF0aCBhYnNvbHV0ZSBwYXRoIHRvIHdoZXJlIHRoZSBzb3VyY2Ugd2lsbCBiZSB3cml0dGVuLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNvcHlBbmRVcGRhdGVTb3VyY2VNYXAob3JpZ2luYWxTcmNQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgbmV3U3JjUGF0aDogQWJzb2x1dGVGc1BhdGgpOlxuICAgICAgdm9pZCB7XG4gICAgY29uc3Qgc291cmNlTWFwUGF0aCA9IChvcmlnaW5hbFNyY1BhdGggKyAnLm1hcCcpIGFzIEFic29sdXRlRnNQYXRoO1xuICAgIGlmICh0aGlzLmZzLmV4aXN0cyhzb3VyY2VNYXBQYXRoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc291cmNlTWFwID1cbiAgICAgICAgICAgIEpTT04ucGFyc2UodGhpcy5mcy5yZWFkRmlsZShzb3VyY2VNYXBQYXRoKSkgYXMge3NvdXJjZVJvb3Q6IHN0cmluZywgW2tleTogc3RyaW5nXTogYW55fTtcbiAgICAgICAgY29uc3QgbmV3U291cmNlTWFwUGF0aCA9IChuZXdTcmNQYXRoICsgJy5tYXAnKSBhcyBBYnNvbHV0ZUZzUGF0aDtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID1cbiAgICAgICAgICAgIHRoaXMuZnMucmVsYXRpdmUodGhpcy5mcy5kaXJuYW1lKG5ld1NvdXJjZU1hcFBhdGgpLCB0aGlzLmZzLmRpcm5hbWUoc291cmNlTWFwUGF0aCkpO1xuICAgICAgICBzb3VyY2VNYXAuc291cmNlUm9vdCA9IHRoaXMuZnMuam9pbihyZWxhdGl2ZVBhdGgsIHNvdXJjZU1hcC5zb3VyY2VSb290IHx8ICcuJyk7XG4gICAgICAgIHRoaXMuZnMuZW5zdXJlRGlyKHRoaXMuZnMuZGlybmFtZShuZXdTb3VyY2VNYXBQYXRoKSk7XG4gICAgICAgIHRoaXMuZnMud3JpdGVGaWxlKG5ld1NvdXJjZU1hcFBhdGgsIEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci53YXJuKGBGYWlsZWQgdG8gcHJvY2VzcyBzb3VyY2UtbWFwIGF0ICR7c291cmNlTWFwUGF0aH1gKTtcbiAgICAgICAgdGhpcy5sb2dnZXIud2FybihlLm1lc3NhZ2UgPz8gZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHdyaXRlRmlsZShmaWxlOiBGaWxlVG9Xcml0ZSwgcGFja2FnZVBhdGg6IEFic29sdXRlRnNQYXRoLCBuZ2NjRm9sZGVyOiBBYnNvbHV0ZUZzUGF0aCk6XG4gICAgICB2b2lkIHtcbiAgICBpZiAoaXNEdHNQYXRoKGZpbGUucGF0aC5yZXBsYWNlKC9cXC5tYXAkLywgJycpKSkge1xuICAgICAgLy8gVGhpcyBpcyBlaXRoZXIgYC5kLnRzYCBvciBgLmQudHMubWFwYCBmaWxlXG4gICAgICBzdXBlci53cml0ZUZpbGVBbmRCYWNrdXAoZmlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHRoaXMuZnMucmVsYXRpdmUocGFja2FnZVBhdGgsIGZpbGUucGF0aCk7XG4gICAgICBjb25zdCBuZXdGaWxlUGF0aCA9IHRoaXMuZnMucmVzb2x2ZShuZ2NjRm9sZGVyLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgdGhpcy5mcy5lbnN1cmVEaXIodGhpcy5mcy5kaXJuYW1lKG5ld0ZpbGVQYXRoKSk7XG4gICAgICB0aGlzLmZzLndyaXRlRmlsZShuZXdGaWxlUGF0aCwgZmlsZS5jb250ZW50cyk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHJldmVydEZpbGUoZmlsZVBhdGg6IEFic29sdXRlRnNQYXRoLCBwYWNrYWdlUGF0aDogQWJzb2x1dGVGc1BhdGgpOiB2b2lkIHtcbiAgICBpZiAoaXNEdHNQYXRoKGZpbGVQYXRoLnJlcGxhY2UoL1xcLm1hcCQvLCAnJykpKSB7XG4gICAgICAvLyBUaGlzIGlzIGVpdGhlciBgLmQudHNgIG9yIGAuZC50cy5tYXBgIGZpbGVcbiAgICAgIHN1cGVyLnJldmVydEZpbGVBbmRCYWNrdXAoZmlsZVBhdGgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mcy5leGlzdHMoZmlsZVBhdGgpKSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSB0aGlzLmZzLnJlbGF0aXZlKHBhY2thZ2VQYXRoLCBmaWxlUGF0aCk7XG4gICAgICBjb25zdCBuZXdGaWxlUGF0aCA9IHRoaXMuZnMucmVzb2x2ZShwYWNrYWdlUGF0aCwgTkdDQ19ESVJFQ1RPUlksIHJlbGF0aXZlUGF0aCk7XG4gICAgICB0aGlzLmZzLnJlbW92ZUZpbGUobmV3RmlsZVBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVQYWNrYWdlSnNvbihcbiAgICAgIGVudHJ5UG9pbnQ6IEVudHJ5UG9pbnQsIGZvcm1hdFByb3BlcnRpZXM6IEVudHJ5UG9pbnRKc29uUHJvcGVydHlbXSxcbiAgICAgIG5nY2NGb2xkZXI6IEFic29sdXRlRnNQYXRoKSB7XG4gICAgaWYgKGZvcm1hdFByb3BlcnRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBObyBmb3JtYXQgcHJvcGVydGllcyBuZWVkIHVwZGF0aW5nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gZW50cnlQb2ludC5wYWNrYWdlSnNvbjtcbiAgICBjb25zdCBwYWNrYWdlSnNvblBhdGggPSB0aGlzLmZzLmpvaW4oZW50cnlQb2ludC5wYXRoLCAncGFja2FnZS5qc29uJyk7XG5cbiAgICAvLyBBbGwgZm9ybWF0IHByb3BlcnRpZXMgcG9pbnQgdG8gdGhlIHNhbWUgZm9ybWF0LXBhdGguXG4gICAgY29uc3Qgb2xkRm9ybWF0UHJvcCA9IGZvcm1hdFByb3BlcnRpZXNbMF0hO1xuICAgIGNvbnN0IG9sZEZvcm1hdFBhdGggPSBwYWNrYWdlSnNvbltvbGRGb3JtYXRQcm9wXSE7XG4gICAgY29uc3Qgb2xkQWJzRm9ybWF0UGF0aCA9IHRoaXMuZnMucmVzb2x2ZShlbnRyeVBvaW50LnBhdGgsIG9sZEZvcm1hdFBhdGgpO1xuICAgIGNvbnN0IG5ld0Fic0Zvcm1hdFBhdGggPVxuICAgICAgICB0aGlzLmZzLnJlc29sdmUobmdjY0ZvbGRlciwgdGhpcy5mcy5yZWxhdGl2ZShlbnRyeVBvaW50LnBhY2thZ2VQYXRoLCBvbGRBYnNGb3JtYXRQYXRoKSk7XG4gICAgY29uc3QgbmV3Rm9ybWF0UGF0aCA9IHRoaXMuZnMucmVsYXRpdmUoZW50cnlQb2ludC5wYXRoLCBuZXdBYnNGb3JtYXRQYXRoKTtcblxuICAgIC8vIFVwZGF0ZSBhbGwgcHJvcGVydGllcyBpbiBgcGFja2FnZS5qc29uYCAoYm90aCBpbiBtZW1vcnkgYW5kIG9uIGRpc2spLlxuICAgIGNvbnN0IHVwZGF0ZSA9IHRoaXMucGtnSnNvblVwZGF0ZXIuY3JlYXRlVXBkYXRlKCk7XG5cbiAgICBmb3IgKGNvbnN0IGZvcm1hdFByb3BlcnR5IG9mIGZvcm1hdFByb3BlcnRpZXMpIHtcbiAgICAgIGlmIChwYWNrYWdlSnNvbltmb3JtYXRQcm9wZXJ0eV0gIT09IG9sZEZvcm1hdFBhdGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYFVuYWJsZSB0byB1cGRhdGUgJyR7cGFja2FnZUpzb25QYXRofSc6IEZvcm1hdCBwcm9wZXJ0aWVzIGAgK1xuICAgICAgICAgICAgYCgke2Zvcm1hdFByb3BlcnRpZXMuam9pbignLCAnKX0pIG1hcCB0byBtb3JlIHRoYW4gb25lIGZvcm1hdC1wYXRoLmApO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGUuYWRkQ2hhbmdlKFxuICAgICAgICAgIFtgJHtmb3JtYXRQcm9wZXJ0eX0ke05HQ0NfUFJPUEVSVFlfRVhURU5TSU9OfWBdLCBuZXdGb3JtYXRQYXRoLCB7YmVmb3JlOiBmb3JtYXRQcm9wZXJ0eX0pO1xuICAgIH1cblxuICAgIHVwZGF0ZS53cml0ZUNoYW5nZXMocGFja2FnZUpzb25QYXRoLCBwYWNrYWdlSnNvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmV2ZXJ0UGFja2FnZUpzb24oZW50cnlQb2ludDogRW50cnlQb2ludCwgZm9ybWF0UHJvcGVydGllczogRW50cnlQb2ludEpzb25Qcm9wZXJ0eVtdKSB7XG4gICAgaWYgKGZvcm1hdFByb3BlcnRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBObyBmb3JtYXQgcHJvcGVydGllcyBuZWVkIHJldmVydGluZy5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYWNrYWdlSnNvbiA9IGVudHJ5UG9pbnQucGFja2FnZUpzb247XG4gICAgY29uc3QgcGFja2FnZUpzb25QYXRoID0gdGhpcy5mcy5qb2luKGVudHJ5UG9pbnQucGF0aCwgJ3BhY2thZ2UuanNvbicpO1xuXG4gICAgLy8gUmV2ZXJ0IGFsbCBwcm9wZXJ0aWVzIGluIGBwYWNrYWdlLmpzb25gIChib3RoIGluIG1lbW9yeSBhbmQgb24gZGlzaykuXG4gICAgLy8gU2luY2UgYHVwZGF0ZVBhY2thZ2VKc29uKClgIG9ubHkgYWRkcyBwcm9wZXJ0aWVzLCBpdCBpcyBzYWZlIHRvIGp1c3QgcmVtb3ZlIHRoZW0gKGlmIHRoZXlcbiAgICAvLyBleGlzdCkuXG4gICAgY29uc3QgdXBkYXRlID0gdGhpcy5wa2dKc29uVXBkYXRlci5jcmVhdGVVcGRhdGUoKTtcblxuICAgIGZvciAoY29uc3QgZm9ybWF0UHJvcGVydHkgb2YgZm9ybWF0UHJvcGVydGllcykge1xuICAgICAgdXBkYXRlLmFkZENoYW5nZShbYCR7Zm9ybWF0UHJvcGVydHl9JHtOR0NDX1BST1BFUlRZX0VYVEVOU0lPTn1gXSwgdW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICB1cGRhdGUud3JpdGVDaGFuZ2VzKHBhY2thZ2VKc29uUGF0aCwgcGFja2FnZUpzb24pO1xuICB9XG59XG4iXX0=