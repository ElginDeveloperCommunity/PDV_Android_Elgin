(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/dependencies/umd_dependency_host", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/ngcc/src/host/umd_host", "@angular/compiler-cli/ngcc/src/dependencies/commonjs_dependency_host", "@angular/compiler-cli/ngcc/src/dependencies/dependency_host"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UmdDependencyHost = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ts = require("typescript");
    var umd_host_1 = require("@angular/compiler-cli/ngcc/src/host/umd_host");
    var commonjs_dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/commonjs_dependency_host");
    var dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/dependency_host");
    /**
     * Helper functions for computing dependencies.
     */
    var UmdDependencyHost = /** @class */ (function (_super) {
        tslib_1.__extends(UmdDependencyHost, _super);
        function UmdDependencyHost() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UmdDependencyHost.prototype.canSkipFile = function (fileContents) {
            return !commonjs_dependency_host_1.hasRequireCalls(fileContents);
        };
        UmdDependencyHost.prototype.extractImports = function (file, fileContents) {
            // Parse the source into a TypeScript AST and then walk it looking for imports and re-exports.
            var sf = ts.createSourceFile(file, fileContents, ts.ScriptTarget.ES2015, false, ts.ScriptKind.JS);
            if (sf.statements.length !== 1) {
                return new Set();
            }
            var umdModule = umd_host_1.parseStatementForUmdModule(sf.statements[0]);
            var umdImports = umdModule && umd_host_1.getImportsOfUmdModule(umdModule);
            if (umdImports === null) {
                return new Set();
            }
            return new Set(umdImports.map(function (i) { return i.path; }));
        };
        return UmdDependencyHost;
    }(dependency_host_1.DependencyHostBase));
    exports.UmdDependencyHost = UmdDependencyHost;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW1kX2RlcGVuZGVuY3lfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9kZXBlbmRlbmNpZXMvdW1kX2RlcGVuZGVuY3lfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsK0JBQWlDO0lBR2pDLHlFQUFtRjtJQUVuRixpSEFBMkQ7SUFDM0QsK0ZBQXFEO0lBRXJEOztPQUVHO0lBQ0g7UUFBdUMsNkNBQWtCO1FBQXpEOztRQXNCQSxDQUFDO1FBckJvQix1Q0FBVyxHQUE5QixVQUErQixZQUFvQjtZQUNqRCxPQUFPLENBQUMsMENBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBRWtCLDBDQUFjLEdBQWpDLFVBQWtDLElBQW9CLEVBQUUsWUFBb0I7WUFDMUUsOEZBQThGO1lBQzlGLElBQU0sRUFBRSxHQUNKLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRTdGLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUM5QixPQUFPLElBQUksR0FBRyxFQUFFLENBQUM7YUFDbEI7WUFFRCxJQUFNLFNBQVMsR0FBRyxxQ0FBMEIsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0QsSUFBTSxVQUFVLEdBQUcsU0FBUyxJQUFJLGdDQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2pFLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtnQkFDdkIsT0FBTyxJQUFJLEdBQUcsRUFBRSxDQUFDO2FBQ2xCO1lBRUQsT0FBTyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDSCx3QkFBQztJQUFELENBQUMsQUF0QkQsQ0FBdUMsb0NBQWtCLEdBc0J4RDtJQXRCWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0Fic29sdXRlRnNQYXRofSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtnZXRJbXBvcnRzT2ZVbWRNb2R1bGUsIHBhcnNlU3RhdGVtZW50Rm9yVW1kTW9kdWxlfSBmcm9tICcuLi9ob3N0L3VtZF9ob3N0JztcblxuaW1wb3J0IHtoYXNSZXF1aXJlQ2FsbHN9IGZyb20gJy4vY29tbW9uanNfZGVwZW5kZW5jeV9ob3N0JztcbmltcG9ydCB7RGVwZW5kZW5jeUhvc3RCYXNlfSBmcm9tICcuL2RlcGVuZGVuY3lfaG9zdCc7XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9ucyBmb3IgY29tcHV0aW5nIGRlcGVuZGVuY2llcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFVtZERlcGVuZGVuY3lIb3N0IGV4dGVuZHMgRGVwZW5kZW5jeUhvc3RCYXNlIHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGNhblNraXBGaWxlKGZpbGVDb250ZW50czogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICFoYXNSZXF1aXJlQ2FsbHMoZmlsZUNvbnRlbnRzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBleHRyYWN0SW1wb3J0cyhmaWxlOiBBYnNvbHV0ZUZzUGF0aCwgZmlsZUNvbnRlbnRzOiBzdHJpbmcpOiBTZXQ8c3RyaW5nPiB7XG4gICAgLy8gUGFyc2UgdGhlIHNvdXJjZSBpbnRvIGEgVHlwZVNjcmlwdCBBU1QgYW5kIHRoZW4gd2FsayBpdCBsb29raW5nIGZvciBpbXBvcnRzIGFuZCByZS1leHBvcnRzLlxuICAgIGNvbnN0IHNmID1cbiAgICAgICAgdHMuY3JlYXRlU291cmNlRmlsZShmaWxlLCBmaWxlQ29udGVudHMsIHRzLlNjcmlwdFRhcmdldC5FUzIwMTUsIGZhbHNlLCB0cy5TY3JpcHRLaW5kLkpTKTtcblxuICAgIGlmIChzZi5zdGF0ZW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgcmV0dXJuIG5ldyBTZXQoKTtcbiAgICB9XG5cbiAgICBjb25zdCB1bWRNb2R1bGUgPSBwYXJzZVN0YXRlbWVudEZvclVtZE1vZHVsZShzZi5zdGF0ZW1lbnRzWzBdKTtcbiAgICBjb25zdCB1bWRJbXBvcnRzID0gdW1kTW9kdWxlICYmIGdldEltcG9ydHNPZlVtZE1vZHVsZSh1bWRNb2R1bGUpO1xuICAgIGlmICh1bWRJbXBvcnRzID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFNldCgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU2V0KHVtZEltcG9ydHMubWFwKGkgPT4gaS5wYXRoKSk7XG4gIH1cbn1cbiJdfQ==