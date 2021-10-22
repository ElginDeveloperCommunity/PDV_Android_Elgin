(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler/testing/src/directive_resolver_mock", ["require", "exports", "tslib", "@angular/compiler"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MockDirectiveResolver = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var compiler_1 = require("@angular/compiler");
    /**
     * An implementation of {@link DirectiveResolver} that allows overriding
     * various properties of directives.
     */
    var MockDirectiveResolver = /** @class */ (function (_super) {
        tslib_1.__extends(MockDirectiveResolver, _super);
        function MockDirectiveResolver(reflector) {
            var _this = _super.call(this, reflector) || this;
            _this._directives = new Map();
            return _this;
        }
        MockDirectiveResolver.prototype.resolve = function (type, throwIfNotFound) {
            if (throwIfNotFound === void 0) { throwIfNotFound = true; }
            return this._directives.get(type) || _super.prototype.resolve.call(this, type, throwIfNotFound);
        };
        /**
         * Overrides the {@link core.Directive} for a directive.
         */
        MockDirectiveResolver.prototype.setDirective = function (type, metadata) {
            this._directives.set(type, metadata);
        };
        return MockDirectiveResolver;
    }(compiler_1.DirectiveResolver));
    exports.MockDirectiveResolver = MockDirectiveResolver;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3Jlc29sdmVyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0aW5nL3NyYy9kaXJlY3RpdmVfcmVzb2x2ZXJfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQTRFO0lBRTVFOzs7T0FHRztJQUNIO1FBQTJDLGlEQUFpQjtRQUcxRCwrQkFBWSxTQUEyQjtZQUF2QyxZQUNFLGtCQUFNLFNBQVMsQ0FBQyxTQUNqQjtZQUpPLGlCQUFXLEdBQUcsSUFBSSxHQUFHLEVBQTZCLENBQUM7O1FBSTNELENBQUM7UUFLUSx1Q0FBTyxHQUFoQixVQUFpQixJQUFlLEVBQUUsZUFBc0I7WUFBdEIsZ0NBQUEsRUFBQSxzQkFBc0I7WUFDdEQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBTSxPQUFPLFlBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzVFLENBQUM7UUFFRDs7V0FFRztRQUNILDRDQUFZLEdBQVosVUFBYSxJQUFlLEVBQUUsUUFBd0I7WUFDcEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFDSCw0QkFBQztJQUFELENBQUMsQUFwQkQsQ0FBMkMsNEJBQWlCLEdBb0IzRDtJQXBCWSxzREFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Q29tcGlsZVJlZmxlY3RvciwgY29yZSwgRGlyZWN0aXZlUmVzb2x2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuLyoqXG4gKiBBbiBpbXBsZW1lbnRhdGlvbiBvZiB7QGxpbmsgRGlyZWN0aXZlUmVzb2x2ZXJ9IHRoYXQgYWxsb3dzIG92ZXJyaWRpbmdcbiAqIHZhcmlvdXMgcHJvcGVydGllcyBvZiBkaXJlY3RpdmVzLlxuICovXG5leHBvcnQgY2xhc3MgTW9ja0RpcmVjdGl2ZVJlc29sdmVyIGV4dGVuZHMgRGlyZWN0aXZlUmVzb2x2ZXIge1xuICBwcml2YXRlIF9kaXJlY3RpdmVzID0gbmV3IE1hcDxjb3JlLlR5cGUsIGNvcmUuRGlyZWN0aXZlPigpO1xuXG4gIGNvbnN0cnVjdG9yKHJlZmxlY3RvcjogQ29tcGlsZVJlZmxlY3Rvcikge1xuICAgIHN1cGVyKHJlZmxlY3Rvcik7XG4gIH1cblxuICBvdmVycmlkZSByZXNvbHZlKHR5cGU6IGNvcmUuVHlwZSk6IGNvcmUuRGlyZWN0aXZlO1xuICBvdmVycmlkZSByZXNvbHZlKHR5cGU6IGNvcmUuVHlwZSwgdGhyb3dJZk5vdEZvdW5kOiB0cnVlKTogY29yZS5EaXJlY3RpdmU7XG4gIG92ZXJyaWRlIHJlc29sdmUodHlwZTogY29yZS5UeXBlLCB0aHJvd0lmTm90Rm91bmQ6IGJvb2xlYW4pOiBjb3JlLkRpcmVjdGl2ZXxudWxsO1xuICBvdmVycmlkZSByZXNvbHZlKHR5cGU6IGNvcmUuVHlwZSwgdGhyb3dJZk5vdEZvdW5kID0gdHJ1ZSk6IGNvcmUuRGlyZWN0aXZlfG51bGwge1xuICAgIHJldHVybiB0aGlzLl9kaXJlY3RpdmVzLmdldCh0eXBlKSB8fCBzdXBlci5yZXNvbHZlKHR5cGUsIHRocm93SWZOb3RGb3VuZCk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIHRoZSB7QGxpbmsgY29yZS5EaXJlY3RpdmV9IGZvciBhIGRpcmVjdGl2ZS5cbiAgICovXG4gIHNldERpcmVjdGl2ZSh0eXBlOiBjb3JlLlR5cGUsIG1ldGFkYXRhOiBjb3JlLkRpcmVjdGl2ZSk6IHZvaWQge1xuICAgIHRoaXMuX2RpcmVjdGl2ZXMuc2V0KHR5cGUsIG1ldGFkYXRhKTtcbiAgfVxufVxuIl19