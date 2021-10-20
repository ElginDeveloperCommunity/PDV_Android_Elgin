/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler/testing/src/ng_module_resolver_mock", ["require", "exports", "tslib", "@angular/compiler"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MockNgModuleResolver = void 0;
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var MockNgModuleResolver = /** @class */ (function (_super) {
        tslib_1.__extends(MockNgModuleResolver, _super);
        function MockNgModuleResolver(reflector) {
            var _this = _super.call(this, reflector) || this;
            _this._ngModules = new Map();
            return _this;
        }
        /**
         * Overrides the {@link NgModule} for a module.
         */
        MockNgModuleResolver.prototype.setNgModule = function (type, metadata) {
            this._ngModules.set(type, metadata);
        };
        /**
         * Returns the {@link NgModule} for a module:
         * - Set the {@link NgModule} to the overridden view when it exists or fallback to the
         * default
         * `NgModuleResolver`, see `setNgModule`.
         */
        MockNgModuleResolver.prototype.resolve = function (type, throwIfNotFound) {
            if (throwIfNotFound === void 0) { throwIfNotFound = true; }
            return this._ngModules.get(type) || _super.prototype.resolve.call(this, type, throwIfNotFound);
        };
        return MockNgModuleResolver;
    }(compiler_1.NgModuleResolver));
    exports.MockNgModuleResolver = MockNgModuleResolver;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3Jlc29sdmVyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0aW5nL3NyYy9uZ19tb2R1bGVfcmVzb2x2ZXJfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsOENBQTJFO0lBRTNFO1FBQTBDLGdEQUFnQjtRQUd4RCw4QkFBWSxTQUEyQjtZQUF2QyxZQUNFLGtCQUFNLFNBQVMsQ0FBQyxTQUNqQjtZQUpPLGdCQUFVLEdBQUcsSUFBSSxHQUFHLEVBQTRCLENBQUM7O1FBSXpELENBQUM7UUFFRDs7V0FFRztRQUNILDBDQUFXLEdBQVgsVUFBWSxJQUFlLEVBQUUsUUFBdUI7WUFDbEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFFRDs7Ozs7V0FLRztRQUNNLHNDQUFPLEdBQWhCLFVBQWlCLElBQWUsRUFBRSxlQUFzQjtZQUF0QixnQ0FBQSxFQUFBLHNCQUFzQjtZQUN0RCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFNLE9BQU8sWUFBQyxJQUFJLEVBQUUsZUFBZSxDQUFFLENBQUM7UUFDNUUsQ0FBQztRQUNILDJCQUFDO0lBQUQsQ0FBQyxBQXZCRCxDQUEwQywyQkFBZ0IsR0F1QnpEO0lBdkJZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBpbGVSZWZsZWN0b3IsIGNvcmUsIE5nTW9kdWxlUmVzb2x2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuZXhwb3J0IGNsYXNzIE1vY2tOZ01vZHVsZVJlc29sdmVyIGV4dGVuZHMgTmdNb2R1bGVSZXNvbHZlciB7XG4gIHByaXZhdGUgX25nTW9kdWxlcyA9IG5ldyBNYXA8Y29yZS5UeXBlLCBjb3JlLk5nTW9kdWxlPigpO1xuXG4gIGNvbnN0cnVjdG9yKHJlZmxlY3RvcjogQ29tcGlsZVJlZmxlY3Rvcikge1xuICAgIHN1cGVyKHJlZmxlY3Rvcik7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIHRoZSB7QGxpbmsgTmdNb2R1bGV9IGZvciBhIG1vZHVsZS5cbiAgICovXG4gIHNldE5nTW9kdWxlKHR5cGU6IGNvcmUuVHlwZSwgbWV0YWRhdGE6IGNvcmUuTmdNb2R1bGUpOiB2b2lkIHtcbiAgICB0aGlzLl9uZ01vZHVsZXMuc2V0KHR5cGUsIG1ldGFkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB7QGxpbmsgTmdNb2R1bGV9IGZvciBhIG1vZHVsZTpcbiAgICogLSBTZXQgdGhlIHtAbGluayBOZ01vZHVsZX0gdG8gdGhlIG92ZXJyaWRkZW4gdmlldyB3aGVuIGl0IGV4aXN0cyBvciBmYWxsYmFjayB0byB0aGVcbiAgICogZGVmYXVsdFxuICAgKiBgTmdNb2R1bGVSZXNvbHZlcmAsIHNlZSBgc2V0TmdNb2R1bGVgLlxuICAgKi9cbiAgb3ZlcnJpZGUgcmVzb2x2ZSh0eXBlOiBjb3JlLlR5cGUsIHRocm93SWZOb3RGb3VuZCA9IHRydWUpOiBjb3JlLk5nTW9kdWxlIHtcbiAgICByZXR1cm4gdGhpcy5fbmdNb2R1bGVzLmdldCh0eXBlKSB8fCBzdXBlci5yZXNvbHZlKHR5cGUsIHRocm93SWZOb3RGb3VuZCkhO1xuICB9XG59XG4iXX0=