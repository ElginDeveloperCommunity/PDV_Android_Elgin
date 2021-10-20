(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/packages/ngcc_compiler_host", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/ngcc/src/analysis/util", "@angular/compiler-cli/ngcc/src/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NgccDtsCompilerHost = exports.NgccSourcesCompilerHost = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var util_1 = require("@angular/compiler-cli/ngcc/src/analysis/util");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    /**
     * Represents a compiler host that resolves a module import as a JavaScript source file if
     * available, instead of the .d.ts typings file that would have been resolved by TypeScript. This
     * is necessary for packages that have their typings in the same directory as the sources, which
     * would otherwise let TypeScript prefer the .d.ts file instead of the JavaScript source file.
     */
    var NgccSourcesCompilerHost = /** @class */ (function (_super) {
        tslib_1.__extends(NgccSourcesCompilerHost, _super);
        function NgccSourcesCompilerHost(fs, options, cache, moduleResolutionCache, packagePath) {
            var _this = _super.call(this, fs, options) || this;
            _this.cache = cache;
            _this.moduleResolutionCache = moduleResolutionCache;
            _this.packagePath = packagePath;
            return _this;
        }
        NgccSourcesCompilerHost.prototype.getSourceFile = function (fileName, languageVersion) {
            return this.cache.getCachedSourceFile(fileName, languageVersion);
        };
        NgccSourcesCompilerHost.prototype.resolveModuleNames = function (moduleNames, containingFile, reusedNames, redirectedReference) {
            var _this = this;
            return moduleNames.map(function (moduleName) {
                var resolvedModule = ts.resolveModuleName(moduleName, containingFile, _this.options, _this, _this.moduleResolutionCache, redirectedReference).resolvedModule;
                // If the module request originated from a relative import in a JavaScript source file,
                // TypeScript may have resolved the module to its .d.ts declaration file if the .js source
                // file was in the same directory. This is undesirable, as we need to have the actual
                // JavaScript being present in the program. This logic recognizes this scenario and rewrites
                // the resolved .d.ts declaration file to its .js counterpart, if it exists.
                if ((resolvedModule === null || resolvedModule === void 0 ? void 0 : resolvedModule.extension) === ts.Extension.Dts && containingFile.endsWith('.js') &&
                    utils_1.isRelativePath(moduleName)) {
                    var jsFile = resolvedModule.resolvedFileName.replace(/\.d\.ts$/, '.js');
                    if (_this.fileExists(jsFile)) {
                        return tslib_1.__assign(tslib_1.__assign({}, resolvedModule), { resolvedFileName: jsFile, extension: ts.Extension.Js });
                    }
                }
                // Prevent loading JavaScript source files outside of the package root, which would happen for
                // packages that don't have .d.ts files. As ngcc should only operate on the .js files
                // contained within the package, any files outside the package are simply discarded. This does
                // result in a partial program with error diagnostics, however ngcc won't gather diagnostics
                // for the program it creates so these diagnostics won't be reported.
                if ((resolvedModule === null || resolvedModule === void 0 ? void 0 : resolvedModule.extension) === ts.Extension.Js &&
                    !util_1.isWithinPackage(_this.packagePath, _this.fs.resolve(resolvedModule.resolvedFileName))) {
                    return undefined;
                }
                return resolvedModule;
            });
        };
        return NgccSourcesCompilerHost;
    }(file_system_1.NgtscCompilerHost));
    exports.NgccSourcesCompilerHost = NgccSourcesCompilerHost;
    /**
     * A compiler host implementation that is used for the typings program. It leverages the entry-point
     * cache for source files and module resolution, as these results can be reused across the sources
     * program.
     */
    var NgccDtsCompilerHost = /** @class */ (function (_super) {
        tslib_1.__extends(NgccDtsCompilerHost, _super);
        function NgccDtsCompilerHost(fs, options, cache, moduleResolutionCache) {
            var _this = _super.call(this, fs, options) || this;
            _this.cache = cache;
            _this.moduleResolutionCache = moduleResolutionCache;
            return _this;
        }
        NgccDtsCompilerHost.prototype.getSourceFile = function (fileName, languageVersion) {
            return this.cache.getCachedSourceFile(fileName, languageVersion);
        };
        NgccDtsCompilerHost.prototype.resolveModuleNames = function (moduleNames, containingFile, reusedNames, redirectedReference) {
            var _this = this;
            return moduleNames.map(function (moduleName) {
                var resolvedModule = ts.resolveModuleName(moduleName, containingFile, _this.options, _this, _this.moduleResolutionCache, redirectedReference).resolvedModule;
                return resolvedModule;
            });
        };
        return NgccDtsCompilerHost;
    }(file_system_1.NgtscCompilerHost));
    exports.NgccDtsCompilerHost = NgccDtsCompilerHost;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdjY19jb21waWxlcl9ob3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL3BhY2thZ2VzL25nY2NfY29tcGlsZXJfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsK0JBQWlDO0lBRWpDLDJFQUE2RjtJQUM3RixxRUFBaUQ7SUFDakQsOERBQXdDO0lBR3hDOzs7OztPQUtHO0lBQ0g7UUFBNkMsbURBQWlCO1FBQzVELGlDQUNJLEVBQWMsRUFBRSxPQUEyQixFQUFVLEtBQTBCLEVBQ3ZFLHFCQUErQyxFQUM3QyxXQUEyQjtZQUh6QyxZQUlFLGtCQUFNLEVBQUUsRUFBRSxPQUFPLENBQUMsU0FDbkI7WUFKd0QsV0FBSyxHQUFMLEtBQUssQ0FBcUI7WUFDdkUsMkJBQXFCLEdBQXJCLHFCQUFxQixDQUEwQjtZQUM3QyxpQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7O1FBRXpDLENBQUM7UUFFUSwrQ0FBYSxHQUF0QixVQUF1QixRQUFnQixFQUFFLGVBQWdDO1lBRXZFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUVELG9EQUFrQixHQUFsQixVQUNJLFdBQXFCLEVBQUUsY0FBc0IsRUFBRSxXQUFzQixFQUNyRSxtQkFBaUQ7WUFGckQsaUJBaUNDO1lBOUJDLE9BQU8sV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFVBQVU7Z0JBQ3hCLElBQUEsY0FBYyxHQUFJLEVBQUUsQ0FBQyxpQkFBaUIsQ0FDekMsVUFBVSxFQUFFLGNBQWMsRUFBRSxLQUFJLENBQUMsT0FBTyxFQUFFLEtBQUksRUFBRSxLQUFJLENBQUMscUJBQXFCLEVBQzFFLG1CQUFtQixDQUFDLGVBRkgsQ0FFSTtnQkFFekIsdUZBQXVGO2dCQUN2RiwwRkFBMEY7Z0JBQzFGLHFGQUFxRjtnQkFDckYsNEZBQTRGO2dCQUM1Riw0RUFBNEU7Z0JBQzVFLElBQUksQ0FBQSxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUsU0FBUyxNQUFLLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO29CQUNoRixzQkFBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUM5QixJQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDMUUsSUFBSSxLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO3dCQUMzQiw2Q0FBVyxjQUFjLEtBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBRTtxQkFDbEY7aUJBQ0Y7Z0JBRUQsOEZBQThGO2dCQUM5RixxRkFBcUY7Z0JBQ3JGLDhGQUE4RjtnQkFDOUYsNEZBQTRGO2dCQUM1RixxRUFBcUU7Z0JBQ3JFLElBQUksQ0FBQSxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUsU0FBUyxNQUFLLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDN0MsQ0FBQyxzQkFBZSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRTtvQkFDeEYsT0FBTyxTQUFTLENBQUM7aUJBQ2xCO2dCQUVELE9BQU8sY0FBYyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNILDhCQUFDO0lBQUQsQ0FBQyxBQS9DRCxDQUE2QywrQkFBaUIsR0ErQzdEO0lBL0NZLDBEQUF1QjtJQWlEcEM7Ozs7T0FJRztJQUNIO1FBQXlDLCtDQUFpQjtRQUN4RCw2QkFDSSxFQUFjLEVBQUUsT0FBMkIsRUFBVSxLQUEwQixFQUN2RSxxQkFBK0M7WUFGM0QsWUFHRSxrQkFBTSxFQUFFLEVBQUUsT0FBTyxDQUFDLFNBQ25CO1lBSHdELFdBQUssR0FBTCxLQUFLLENBQXFCO1lBQ3ZFLDJCQUFxQixHQUFyQixxQkFBcUIsQ0FBMEI7O1FBRTNELENBQUM7UUFFUSwyQ0FBYSxHQUF0QixVQUF1QixRQUFnQixFQUFFLGVBQWdDO1lBRXZFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUVELGdEQUFrQixHQUFsQixVQUNJLFdBQXFCLEVBQUUsY0FBc0IsRUFBRSxXQUFzQixFQUNyRSxtQkFBaUQ7WUFGckQsaUJBU0M7WUFOQyxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQSxVQUFVO2dCQUN4QixJQUFBLGNBQWMsR0FBSSxFQUFFLENBQUMsaUJBQWlCLENBQ3pDLFVBQVUsRUFBRSxjQUFjLEVBQUUsS0FBSSxDQUFDLE9BQU8sRUFBRSxLQUFJLEVBQUUsS0FBSSxDQUFDLHFCQUFxQixFQUMxRSxtQkFBbUIsQ0FBQyxlQUZILENBRUk7Z0JBQ3pCLE9BQU8sY0FBYyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNILDBCQUFDO0lBQUQsQ0FBQyxBQXRCRCxDQUF5QywrQkFBaUIsR0FzQnpEO0lBdEJZLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW0sIE5ndHNjQ29tcGlsZXJIb3N0fSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtpc1dpdGhpblBhY2thZ2V9IGZyb20gJy4uL2FuYWx5c2lzL3V0aWwnO1xuaW1wb3J0IHtpc1JlbGF0aXZlUGF0aH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtFbnRyeVBvaW50RmlsZUNhY2hlfSBmcm9tICcuL3NvdXJjZV9maWxlX2NhY2hlJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgY29tcGlsZXIgaG9zdCB0aGF0IHJlc29sdmVzIGEgbW9kdWxlIGltcG9ydCBhcyBhIEphdmFTY3JpcHQgc291cmNlIGZpbGUgaWZcbiAqIGF2YWlsYWJsZSwgaW5zdGVhZCBvZiB0aGUgLmQudHMgdHlwaW5ncyBmaWxlIHRoYXQgd291bGQgaGF2ZSBiZWVuIHJlc29sdmVkIGJ5IFR5cGVTY3JpcHQuIFRoaXNcbiAqIGlzIG5lY2Vzc2FyeSBmb3IgcGFja2FnZXMgdGhhdCBoYXZlIHRoZWlyIHR5cGluZ3MgaW4gdGhlIHNhbWUgZGlyZWN0b3J5IGFzIHRoZSBzb3VyY2VzLCB3aGljaFxuICogd291bGQgb3RoZXJ3aXNlIGxldCBUeXBlU2NyaXB0IHByZWZlciB0aGUgLmQudHMgZmlsZSBpbnN0ZWFkIG9mIHRoZSBKYXZhU2NyaXB0IHNvdXJjZSBmaWxlLlxuICovXG5leHBvcnQgY2xhc3MgTmdjY1NvdXJjZXNDb21waWxlckhvc3QgZXh0ZW5kcyBOZ3RzY0NvbXBpbGVySG9zdCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZnM6IEZpbGVTeXN0ZW0sIG9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucywgcHJpdmF0ZSBjYWNoZTogRW50cnlQb2ludEZpbGVDYWNoZSxcbiAgICAgIHByaXZhdGUgbW9kdWxlUmVzb2x1dGlvbkNhY2hlOiB0cy5Nb2R1bGVSZXNvbHV0aW9uQ2FjaGUsXG4gICAgICBwcm90ZWN0ZWQgcGFja2FnZVBhdGg6IEFic29sdXRlRnNQYXRoKSB7XG4gICAgc3VwZXIoZnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0U291cmNlRmlsZShmaWxlTmFtZTogc3RyaW5nLCBsYW5ndWFnZVZlcnNpb246IHRzLlNjcmlwdFRhcmdldCk6IHRzLlNvdXJjZUZpbGVcbiAgICAgIHx1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldENhY2hlZFNvdXJjZUZpbGUoZmlsZU5hbWUsIGxhbmd1YWdlVmVyc2lvbik7XG4gIH1cblxuICByZXNvbHZlTW9kdWxlTmFtZXMoXG4gICAgICBtb2R1bGVOYW1lczogc3RyaW5nW10sIGNvbnRhaW5pbmdGaWxlOiBzdHJpbmcsIHJldXNlZE5hbWVzPzogc3RyaW5nW10sXG4gICAgICByZWRpcmVjdGVkUmVmZXJlbmNlPzogdHMuUmVzb2x2ZWRQcm9qZWN0UmVmZXJlbmNlKTogQXJyYXk8dHMuUmVzb2x2ZWRNb2R1bGV8dW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIG1vZHVsZU5hbWVzLm1hcChtb2R1bGVOYW1lID0+IHtcbiAgICAgIGNvbnN0IHtyZXNvbHZlZE1vZHVsZX0gPSB0cy5yZXNvbHZlTW9kdWxlTmFtZShcbiAgICAgICAgICBtb2R1bGVOYW1lLCBjb250YWluaW5nRmlsZSwgdGhpcy5vcHRpb25zLCB0aGlzLCB0aGlzLm1vZHVsZVJlc29sdXRpb25DYWNoZSxcbiAgICAgICAgICByZWRpcmVjdGVkUmVmZXJlbmNlKTtcblxuICAgICAgLy8gSWYgdGhlIG1vZHVsZSByZXF1ZXN0IG9yaWdpbmF0ZWQgZnJvbSBhIHJlbGF0aXZlIGltcG9ydCBpbiBhIEphdmFTY3JpcHQgc291cmNlIGZpbGUsXG4gICAgICAvLyBUeXBlU2NyaXB0IG1heSBoYXZlIHJlc29sdmVkIHRoZSBtb2R1bGUgdG8gaXRzIC5kLnRzIGRlY2xhcmF0aW9uIGZpbGUgaWYgdGhlIC5qcyBzb3VyY2VcbiAgICAgIC8vIGZpbGUgd2FzIGluIHRoZSBzYW1lIGRpcmVjdG9yeS4gVGhpcyBpcyB1bmRlc2lyYWJsZSwgYXMgd2UgbmVlZCB0byBoYXZlIHRoZSBhY3R1YWxcbiAgICAgIC8vIEphdmFTY3JpcHQgYmVpbmcgcHJlc2VudCBpbiB0aGUgcHJvZ3JhbS4gVGhpcyBsb2dpYyByZWNvZ25pemVzIHRoaXMgc2NlbmFyaW8gYW5kIHJld3JpdGVzXG4gICAgICAvLyB0aGUgcmVzb2x2ZWQgLmQudHMgZGVjbGFyYXRpb24gZmlsZSB0byBpdHMgLmpzIGNvdW50ZXJwYXJ0LCBpZiBpdCBleGlzdHMuXG4gICAgICBpZiAocmVzb2x2ZWRNb2R1bGU/LmV4dGVuc2lvbiA9PT0gdHMuRXh0ZW5zaW9uLkR0cyAmJiBjb250YWluaW5nRmlsZS5lbmRzV2l0aCgnLmpzJykgJiZcbiAgICAgICAgICBpc1JlbGF0aXZlUGF0aChtb2R1bGVOYW1lKSkge1xuICAgICAgICBjb25zdCBqc0ZpbGUgPSByZXNvbHZlZE1vZHVsZS5yZXNvbHZlZEZpbGVOYW1lLnJlcGxhY2UoL1xcLmRcXC50cyQvLCAnLmpzJyk7XG4gICAgICAgIGlmICh0aGlzLmZpbGVFeGlzdHMoanNGaWxlKSkge1xuICAgICAgICAgIHJldHVybiB7Li4ucmVzb2x2ZWRNb2R1bGUsIHJlc29sdmVkRmlsZU5hbWU6IGpzRmlsZSwgZXh0ZW5zaW9uOiB0cy5FeHRlbnNpb24uSnN9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXZlbnQgbG9hZGluZyBKYXZhU2NyaXB0IHNvdXJjZSBmaWxlcyBvdXRzaWRlIG9mIHRoZSBwYWNrYWdlIHJvb3QsIHdoaWNoIHdvdWxkIGhhcHBlbiBmb3JcbiAgICAgIC8vIHBhY2thZ2VzIHRoYXQgZG9uJ3QgaGF2ZSAuZC50cyBmaWxlcy4gQXMgbmdjYyBzaG91bGQgb25seSBvcGVyYXRlIG9uIHRoZSAuanMgZmlsZXNcbiAgICAgIC8vIGNvbnRhaW5lZCB3aXRoaW4gdGhlIHBhY2thZ2UsIGFueSBmaWxlcyBvdXRzaWRlIHRoZSBwYWNrYWdlIGFyZSBzaW1wbHkgZGlzY2FyZGVkLiBUaGlzIGRvZXNcbiAgICAgIC8vIHJlc3VsdCBpbiBhIHBhcnRpYWwgcHJvZ3JhbSB3aXRoIGVycm9yIGRpYWdub3N0aWNzLCBob3dldmVyIG5nY2Mgd29uJ3QgZ2F0aGVyIGRpYWdub3N0aWNzXG4gICAgICAvLyBmb3IgdGhlIHByb2dyYW0gaXQgY3JlYXRlcyBzbyB0aGVzZSBkaWFnbm9zdGljcyB3b24ndCBiZSByZXBvcnRlZC5cbiAgICAgIGlmIChyZXNvbHZlZE1vZHVsZT8uZXh0ZW5zaW9uID09PSB0cy5FeHRlbnNpb24uSnMgJiZcbiAgICAgICAgICAhaXNXaXRoaW5QYWNrYWdlKHRoaXMucGFja2FnZVBhdGgsIHRoaXMuZnMucmVzb2x2ZShyZXNvbHZlZE1vZHVsZS5yZXNvbHZlZEZpbGVOYW1lKSkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc29sdmVkTW9kdWxlO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQSBjb21waWxlciBob3N0IGltcGxlbWVudGF0aW9uIHRoYXQgaXMgdXNlZCBmb3IgdGhlIHR5cGluZ3MgcHJvZ3JhbS4gSXQgbGV2ZXJhZ2VzIHRoZSBlbnRyeS1wb2ludFxuICogY2FjaGUgZm9yIHNvdXJjZSBmaWxlcyBhbmQgbW9kdWxlIHJlc29sdXRpb24sIGFzIHRoZXNlIHJlc3VsdHMgY2FuIGJlIHJldXNlZCBhY3Jvc3MgdGhlIHNvdXJjZXNcbiAqIHByb2dyYW0uXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ2NjRHRzQ29tcGlsZXJIb3N0IGV4dGVuZHMgTmd0c2NDb21waWxlckhvc3Qge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIGZzOiBGaWxlU3lzdGVtLCBvcHRpb25zOiB0cy5Db21waWxlck9wdGlvbnMsIHByaXZhdGUgY2FjaGU6IEVudHJ5UG9pbnRGaWxlQ2FjaGUsXG4gICAgICBwcml2YXRlIG1vZHVsZVJlc29sdXRpb25DYWNoZTogdHMuTW9kdWxlUmVzb2x1dGlvbkNhY2hlKSB7XG4gICAgc3VwZXIoZnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0U291cmNlRmlsZShmaWxlTmFtZTogc3RyaW5nLCBsYW5ndWFnZVZlcnNpb246IHRzLlNjcmlwdFRhcmdldCk6IHRzLlNvdXJjZUZpbGVcbiAgICAgIHx1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldENhY2hlZFNvdXJjZUZpbGUoZmlsZU5hbWUsIGxhbmd1YWdlVmVyc2lvbik7XG4gIH1cblxuICByZXNvbHZlTW9kdWxlTmFtZXMoXG4gICAgICBtb2R1bGVOYW1lczogc3RyaW5nW10sIGNvbnRhaW5pbmdGaWxlOiBzdHJpbmcsIHJldXNlZE5hbWVzPzogc3RyaW5nW10sXG4gICAgICByZWRpcmVjdGVkUmVmZXJlbmNlPzogdHMuUmVzb2x2ZWRQcm9qZWN0UmVmZXJlbmNlKTogQXJyYXk8dHMuUmVzb2x2ZWRNb2R1bGV8dW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIG1vZHVsZU5hbWVzLm1hcChtb2R1bGVOYW1lID0+IHtcbiAgICAgIGNvbnN0IHtyZXNvbHZlZE1vZHVsZX0gPSB0cy5yZXNvbHZlTW9kdWxlTmFtZShcbiAgICAgICAgICBtb2R1bGVOYW1lLCBjb250YWluaW5nRmlsZSwgdGhpcy5vcHRpb25zLCB0aGlzLCB0aGlzLm1vZHVsZVJlc29sdXRpb25DYWNoZSxcbiAgICAgICAgICByZWRpcmVjdGVkUmVmZXJlbmNlKTtcbiAgICAgIHJldHVybiByZXNvbHZlZE1vZHVsZTtcbiAgICB9KTtcbiAgfVxufVxuIl19