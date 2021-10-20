(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/dependencies/dts_dependency_host", ["require", "exports", "tslib", "@angular/compiler-cli/ngcc/src/dependencies/esm_dependency_host", "@angular/compiler-cli/ngcc/src/dependencies/module_resolver"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DtsDependencyHost = void 0;
    var tslib_1 = require("tslib");
    var esm_dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/esm_dependency_host");
    var module_resolver_1 = require("@angular/compiler-cli/ngcc/src/dependencies/module_resolver");
    /**
     * Helper functions for computing dependencies via typings files.
     */
    var DtsDependencyHost = /** @class */ (function (_super) {
        tslib_1.__extends(DtsDependencyHost, _super);
        function DtsDependencyHost(fs, pathMappings) {
            return _super.call(this, fs, new module_resolver_1.ModuleResolver(fs, pathMappings, ['', '.d.ts', '/index.d.ts', '.js', '/index.js']), false) || this;
        }
        /**
         * Attempts to process the `importPath` directly and also inside `@types/...`.
         */
        DtsDependencyHost.prototype.processImport = function (importPath, file, dependencies, missing, deepImports, alreadySeen) {
            return _super.prototype.processImport.call(this, importPath, file, dependencies, missing, deepImports, alreadySeen) ||
                _super.prototype.processImport.call(this, "@types/" + importPath, file, dependencies, missing, deepImports, alreadySeen);
        };
        return DtsDependencyHost;
    }(esm_dependency_host_1.EsmDependencyHost));
    exports.DtsDependencyHost = DtsDependencyHost;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHRzX2RlcGVuZGVuY3lfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9kZXBlbmRlbmNpZXMvZHRzX2RlcGVuZGVuY3lfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBU0EsdUdBQXdEO0lBQ3hELCtGQUFpRDtJQUVqRDs7T0FFRztJQUNIO1FBQXVDLDZDQUFpQjtRQUN0RCwyQkFBWSxFQUFzQixFQUFFLFlBQTJCO21CQUM3RCxrQkFDSSxFQUFFLEVBQUUsSUFBSSxnQ0FBYyxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsRUFDMUYsS0FBSyxDQUFDO1FBQ1osQ0FBQztRQUVEOztXQUVHO1FBQ2dCLHlDQUFhLEdBQWhDLFVBQ0ksVUFBa0IsRUFBRSxJQUFvQixFQUFFLFlBQWlDLEVBQzNFLE9BQW9CLEVBQUUsV0FBd0IsRUFBRSxXQUFnQztZQUNsRixPQUFPLGlCQUFNLGFBQWEsWUFBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQztnQkFDekYsaUJBQU0sYUFBYSxZQUNmLFlBQVUsVUFBWSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN6RixDQUFDO1FBQ0gsd0JBQUM7SUFBRCxDQUFDLEFBakJELENBQXVDLHVDQUFpQixHQWlCdkQ7SUFqQlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBSZWFkb25seUZpbGVTeXN0ZW19IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge1BhdGhNYXBwaW5nc30gZnJvbSAnLi4vcGF0aF9tYXBwaW5ncyc7XG5pbXBvcnQge0VzbURlcGVuZGVuY3lIb3N0fSBmcm9tICcuL2VzbV9kZXBlbmRlbmN5X2hvc3QnO1xuaW1wb3J0IHtNb2R1bGVSZXNvbHZlcn0gZnJvbSAnLi9tb2R1bGVfcmVzb2x2ZXInO1xuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbnMgZm9yIGNvbXB1dGluZyBkZXBlbmRlbmNpZXMgdmlhIHR5cGluZ3MgZmlsZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBEdHNEZXBlbmRlbmN5SG9zdCBleHRlbmRzIEVzbURlcGVuZGVuY3lIb3N0IHtcbiAgY29uc3RydWN0b3IoZnM6IFJlYWRvbmx5RmlsZVN5c3RlbSwgcGF0aE1hcHBpbmdzPzogUGF0aE1hcHBpbmdzKSB7XG4gICAgc3VwZXIoXG4gICAgICAgIGZzLCBuZXcgTW9kdWxlUmVzb2x2ZXIoZnMsIHBhdGhNYXBwaW5ncywgWycnLCAnLmQudHMnLCAnL2luZGV4LmQudHMnLCAnLmpzJywgJy9pbmRleC5qcyddKSxcbiAgICAgICAgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHByb2Nlc3MgdGhlIGBpbXBvcnRQYXRoYCBkaXJlY3RseSBhbmQgYWxzbyBpbnNpZGUgYEB0eXBlcy8uLi5gLlxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHByb2Nlc3NJbXBvcnQoXG4gICAgICBpbXBvcnRQYXRoOiBzdHJpbmcsIGZpbGU6IEFic29sdXRlRnNQYXRoLCBkZXBlbmRlbmNpZXM6IFNldDxBYnNvbHV0ZUZzUGF0aD4sXG4gICAgICBtaXNzaW5nOiBTZXQ8c3RyaW5nPiwgZGVlcEltcG9ydHM6IFNldDxzdHJpbmc+LCBhbHJlYWR5U2VlbjogU2V0PEFic29sdXRlRnNQYXRoPik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzdXBlci5wcm9jZXNzSW1wb3J0KGltcG9ydFBhdGgsIGZpbGUsIGRlcGVuZGVuY2llcywgbWlzc2luZywgZGVlcEltcG9ydHMsIGFscmVhZHlTZWVuKSB8fFxuICAgICAgICBzdXBlci5wcm9jZXNzSW1wb3J0KFxuICAgICAgICAgICAgYEB0eXBlcy8ke2ltcG9ydFBhdGh9YCwgZmlsZSwgZGVwZW5kZW5jaWVzLCBtaXNzaW5nLCBkZWVwSW1wb3J0cywgYWxyZWFkeVNlZW4pO1xuICB9XG59XG4iXX0=