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
        define("@angular/compiler/testing/src/pipe_resolver_mock", ["require", "exports", "tslib", "@angular/compiler"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MockPipeResolver = void 0;
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var MockPipeResolver = /** @class */ (function (_super) {
        tslib_1.__extends(MockPipeResolver, _super);
        function MockPipeResolver(refector) {
            var _this = _super.call(this, refector) || this;
            _this._pipes = new Map();
            return _this;
        }
        /**
         * Overrides the {@link Pipe} for a pipe.
         */
        MockPipeResolver.prototype.setPipe = function (type, metadata) {
            this._pipes.set(type, metadata);
        };
        /**
         * Returns the {@link Pipe} for a pipe:
         * - Set the {@link Pipe} to the overridden view when it exists or fallback to the
         * default
         * `PipeResolver`, see `setPipe`.
         */
        MockPipeResolver.prototype.resolve = function (type, throwIfNotFound) {
            if (throwIfNotFound === void 0) { throwIfNotFound = true; }
            var metadata = this._pipes.get(type);
            if (!metadata) {
                metadata = _super.prototype.resolve.call(this, type, throwIfNotFound);
            }
            return metadata;
        };
        return MockPipeResolver;
    }(compiler_1.PipeResolver));
    exports.MockPipeResolver = MockPipeResolver;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9yZXNvbHZlcl9tb2NrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdGluZy9zcmMvcGlwZV9yZXNvbHZlcl9tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCw4Q0FBdUU7SUFFdkU7UUFBc0MsNENBQVk7UUFHaEQsMEJBQVksUUFBMEI7WUFBdEMsWUFDRSxrQkFBTSxRQUFRLENBQUMsU0FDaEI7WUFKTyxZQUFNLEdBQUcsSUFBSSxHQUFHLEVBQXdCLENBQUM7O1FBSWpELENBQUM7UUFFRDs7V0FFRztRQUNILGtDQUFPLEdBQVAsVUFBUSxJQUFlLEVBQUUsUUFBbUI7WUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRDs7Ozs7V0FLRztRQUNNLGtDQUFPLEdBQWhCLFVBQWlCLElBQWUsRUFBRSxlQUFzQjtZQUF0QixnQ0FBQSxFQUFBLHNCQUFzQjtZQUN0RCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNiLFFBQVEsR0FBRyxpQkFBTSxPQUFPLFlBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBRSxDQUFDO2FBQ2xEO1lBQ0QsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQztRQUNILHVCQUFDO0lBQUQsQ0FBQyxBQTNCRCxDQUFzQyx1QkFBWSxHQTJCakQ7SUEzQlksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcGlsZVJlZmxlY3RvciwgY29yZSwgUGlwZVJlc29sdmVyfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbmV4cG9ydCBjbGFzcyBNb2NrUGlwZVJlc29sdmVyIGV4dGVuZHMgUGlwZVJlc29sdmVyIHtcbiAgcHJpdmF0ZSBfcGlwZXMgPSBuZXcgTWFwPGNvcmUuVHlwZSwgY29yZS5QaXBlPigpO1xuXG4gIGNvbnN0cnVjdG9yKHJlZmVjdG9yOiBDb21waWxlUmVmbGVjdG9yKSB7XG4gICAgc3VwZXIocmVmZWN0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUge0BsaW5rIFBpcGV9IGZvciBhIHBpcGUuXG4gICAqL1xuICBzZXRQaXBlKHR5cGU6IGNvcmUuVHlwZSwgbWV0YWRhdGE6IGNvcmUuUGlwZSk6IHZvaWQge1xuICAgIHRoaXMuX3BpcGVzLnNldCh0eXBlLCBtZXRhZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUge0BsaW5rIFBpcGV9IGZvciBhIHBpcGU6XG4gICAqIC0gU2V0IHRoZSB7QGxpbmsgUGlwZX0gdG8gdGhlIG92ZXJyaWRkZW4gdmlldyB3aGVuIGl0IGV4aXN0cyBvciBmYWxsYmFjayB0byB0aGVcbiAgICogZGVmYXVsdFxuICAgKiBgUGlwZVJlc29sdmVyYCwgc2VlIGBzZXRQaXBlYC5cbiAgICovXG4gIG92ZXJyaWRlIHJlc29sdmUodHlwZTogY29yZS5UeXBlLCB0aHJvd0lmTm90Rm91bmQgPSB0cnVlKTogY29yZS5QaXBlIHtcbiAgICBsZXQgbWV0YWRhdGEgPSB0aGlzLl9waXBlcy5nZXQodHlwZSk7XG4gICAgaWYgKCFtZXRhZGF0YSkge1xuICAgICAgbWV0YWRhdGEgPSBzdXBlci5yZXNvbHZlKHR5cGUsIHRocm93SWZOb3RGb3VuZCkhO1xuICAgIH1cbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH1cbn1cbiJdfQ==