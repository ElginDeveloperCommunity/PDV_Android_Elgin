(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/type_parameter_emitter", ["require", "exports", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/typecheck/src/type_emitter"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeParameterEmitter = void 0;
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var type_emitter_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/type_emitter");
    /**
     * See `TypeEmitter` for more information on the emitting process.
     */
    var TypeParameterEmitter = /** @class */ (function () {
        function TypeParameterEmitter(typeParameters, reflector) {
            this.typeParameters = typeParameters;
            this.reflector = reflector;
        }
        /**
         * Determines whether the type parameters can be emitted. If this returns true, then a call to
         * `emit` is known to succeed. Vice versa, if false is returned then `emit` should not be
         * called, as it would fail.
         */
        TypeParameterEmitter.prototype.canEmit = function () {
            var _this = this;
            if (this.typeParameters === undefined) {
                return true;
            }
            return this.typeParameters.every(function (typeParam) {
                return _this.canEmitType(typeParam.constraint) && _this.canEmitType(typeParam.default);
            });
        };
        TypeParameterEmitter.prototype.canEmitType = function (type) {
            var _this = this;
            if (type === undefined) {
                return true;
            }
            return type_emitter_1.canEmitType(type, function (typeReference) { return _this.resolveTypeReference(typeReference); });
        };
        /**
         * Emits the type parameters using the provided emitter function for `Reference`s.
         */
        TypeParameterEmitter.prototype.emit = function (emitReference) {
            var _this = this;
            if (this.typeParameters === undefined) {
                return undefined;
            }
            var emitter = new type_emitter_1.TypeEmitter(function (type) { return _this.resolveTypeReference(type); }, emitReference);
            return this.typeParameters.map(function (typeParam) {
                var constraint = typeParam.constraint !== undefined ? emitter.emitType(typeParam.constraint) : undefined;
                var defaultType = typeParam.default !== undefined ? emitter.emitType(typeParam.default) : undefined;
                return ts.updateTypeParameterDeclaration(
                /* node */ typeParam, 
                /* name */ typeParam.name, 
                /* constraint */ constraint, 
                /* defaultType */ defaultType);
            });
        };
        TypeParameterEmitter.prototype.resolveTypeReference = function (type) {
            var target = ts.isIdentifier(type.typeName) ? type.typeName : type.typeName.right;
            var declaration = this.reflector.getDeclarationOfIdentifier(target);
            // If no declaration could be resolved or does not have a `ts.Declaration`, the type cannot be
            // resolved.
            if (declaration === null || declaration.node === null) {
                return null;
            }
            // If the declaration corresponds with a local type parameter, the type reference can be used
            // as is.
            if (this.isLocalTypeParameter(declaration.node)) {
                return type;
            }
            var owningModule = null;
            if (declaration.viaModule !== null) {
                owningModule = {
                    specifier: declaration.viaModule,
                    resolutionContext: type.getSourceFile().fileName,
                };
            }
            // If no owning module is known, the reference needs to be exported to be able to emit an import
            // statement for it. If the declaration is not exported, null is returned to prevent emit.
            if (owningModule === null && !this.isStaticallyExported(declaration.node)) {
                return null;
            }
            return new imports_1.Reference(declaration.node, owningModule);
        };
        TypeParameterEmitter.prototype.isStaticallyExported = function (decl) {
            return reflection_1.isNamedClassDeclaration(decl) && this.reflector.isStaticallyExported(decl);
        };
        TypeParameterEmitter.prototype.isLocalTypeParameter = function (decl) {
            // Checking for local type parameters only occurs during resolution of type parameters, so it is
            // guaranteed that type parameters are present.
            return this.typeParameters.some(function (param) { return param === decl; });
        };
        return TypeParameterEmitter;
    }());
    exports.TypeParameterEmitter = TypeParameterEmitter;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZV9wYXJhbWV0ZXJfZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHlwZWNoZWNrL3NyYy90eXBlX3BhcmFtZXRlcl9lbWl0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILCtCQUFpQztJQUVqQyxtRUFBc0Q7SUFDdEQseUVBQTBGO0lBRTFGLDJGQUErRTtJQUcvRTs7T0FFRztJQUNIO1FBQ0UsOEJBQ1ksY0FBbUUsRUFDbkUsU0FBeUI7WUFEekIsbUJBQWMsR0FBZCxjQUFjLENBQXFEO1lBQ25FLGNBQVMsR0FBVCxTQUFTLENBQWdCO1FBQUcsQ0FBQztRQUV6Qzs7OztXQUlHO1FBQ0gsc0NBQU8sR0FBUDtZQUFBLGlCQVFDO1lBUEMsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRTtnQkFDckMsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsVUFBQSxTQUFTO2dCQUN4QyxPQUFPLEtBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZGLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVPLDBDQUFXLEdBQW5CLFVBQW9CLElBQTJCO1lBQS9DLGlCQU1DO1lBTEMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO2dCQUN0QixPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsT0FBTywwQkFBVyxDQUFDLElBQUksRUFBRSxVQUFBLGFBQWEsSUFBSSxPQUFBLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsRUFBeEMsQ0FBd0MsQ0FBQyxDQUFDO1FBQ3RGLENBQUM7UUFFRDs7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QUFLLEtBQUssSUFBSSxFQUFkLENBQWMsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFDSCwyQkFBQztJQUFELENBQUMsQUE5RkQsSUE4RkM7SUE5Rlksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtPd25pbmdNb2R1bGUsIFJlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge0RlY2xhcmF0aW9uTm9kZSwgaXNOYW1lZENsYXNzRGVjbGFyYXRpb24sIFJlZmxlY3Rpb25Ib3N0fSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcblxuaW1wb3J0IHtjYW5FbWl0VHlwZSwgUmVzb2x2ZWRUeXBlUmVmZXJlbmNlLCBUeXBlRW1pdHRlcn0gZnJvbSAnLi90eXBlX2VtaXR0ZXInO1xuXG5cbi8qKlxuICogU2VlIGBUeXBlRW1pdHRlcmAgZm9yIG1vcmUgaW5mb3JtYXRpb24gb24gdGhlIGVtaXR0aW5nIHByb2Nlc3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBUeXBlUGFyYW1ldGVyRW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSB0eXBlUGFyYW1ldGVyczogdHMuTm9kZUFycmF5PHRzLlR5cGVQYXJhbWV0ZXJEZWNsYXJhdGlvbj58dW5kZWZpbmVkLFxuICAgICAgcHJpdmF0ZSByZWZsZWN0b3I6IFJlZmxlY3Rpb25Ib3N0KSB7fVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHR5cGUgcGFyYW1ldGVycyBjYW4gYmUgZW1pdHRlZC4gSWYgdGhpcyByZXR1cm5zIHRydWUsIHRoZW4gYSBjYWxsIHRvXG4gICAqIGBlbWl0YCBpcyBrbm93biB0byBzdWNjZWVkLiBWaWNlIHZlcnNhLCBpZiBmYWxzZSBpcyByZXR1cm5lZCB0aGVuIGBlbWl0YCBzaG91bGQgbm90IGJlXG4gICAqIGNhbGxlZCwgYXMgaXQgd291bGQgZmFpbC5cbiAgICovXG4gIGNhbkVtaXQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMudHlwZVBhcmFtZXRlcnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudHlwZVBhcmFtZXRlcnMuZXZlcnkodHlwZVBhcmFtID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNhbkVtaXRUeXBlKHR5cGVQYXJhbS5jb25zdHJhaW50KSAmJiB0aGlzLmNhbkVtaXRUeXBlKHR5cGVQYXJhbS5kZWZhdWx0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY2FuRW1pdFR5cGUodHlwZTogdHMuVHlwZU5vZGV8dW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbkVtaXRUeXBlKHR5cGUsIHR5cGVSZWZlcmVuY2UgPT4gdGhpcy5yZXNvbHZlVHlwZVJlZmVyZW5jZSh0eXBlUmVmZXJlbmNlKSk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIHR5cGUgcGFyYW1ldGVycyB1c2luZyB0aGUgcHJvdmlkZWQgZW1pdHRlciBmdW5jdGlvbiBmb3IgYFJlZmVyZW5jZWBzLlxuICAgKi9cbiAgZW1pdChlbWl0UmVmZXJlbmNlOiAocmVmOiBSZWZlcmVuY2UpID0+IHRzLlR5cGVOb2RlKTogdHMuVHlwZVBhcmFtZXRlckRlY2xhcmF0aW9uW118dW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy50eXBlUGFyYW1ldGVycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGVtaXR0ZXIgPSBuZXcgVHlwZUVtaXR0ZXIodHlwZSA9PiB0aGlzLnJlc29sdmVUeXBlUmVmZXJlbmNlKHR5cGUpLCBlbWl0UmVmZXJlbmNlKTtcblxuICAgIHJldHVybiB0aGlzLnR5cGVQYXJhbWV0ZXJzLm1hcCh0eXBlUGFyYW0gPT4ge1xuICAgICAgY29uc3QgY29uc3RyYWludCA9XG4gICAgICAgICAgdHlwZVBhcmFtLmNvbnN0cmFpbnQgIT09IHVuZGVmaW5lZCA/IGVtaXR0ZXIuZW1pdFR5cGUodHlwZVBhcmFtLmNvbnN0cmFpbnQpIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3QgZGVmYXVsdFR5cGUgPVxuICAgICAgICAgIHR5cGVQYXJhbS5kZWZhdWx0ICE9PSB1bmRlZmluZWQgPyBlbWl0dGVyLmVtaXRUeXBlKHR5cGVQYXJhbS5kZWZhdWx0KSA6IHVuZGVmaW5lZDtcblxuICAgICAgcmV0dXJuIHRzLnVwZGF0ZVR5cGVQYXJhbWV0ZXJEZWNsYXJhdGlvbihcbiAgICAgICAgICAvKiBub2RlICovIHR5cGVQYXJhbSxcbiAgICAgICAgICAvKiBuYW1lICovIHR5cGVQYXJhbS5uYW1lLFxuICAgICAgICAgIC8qIGNvbnN0cmFpbnQgKi8gY29uc3RyYWludCxcbiAgICAgICAgICAvKiBkZWZhdWx0VHlwZSAqLyBkZWZhdWx0VHlwZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVUeXBlUmVmZXJlbmNlKHR5cGU6IHRzLlR5cGVSZWZlcmVuY2VOb2RlKTogUmVzb2x2ZWRUeXBlUmVmZXJlbmNlIHtcbiAgICBjb25zdCB0YXJnZXQgPSB0cy5pc0lkZW50aWZpZXIodHlwZS50eXBlTmFtZSkgPyB0eXBlLnR5cGVOYW1lIDogdHlwZS50eXBlTmFtZS5yaWdodDtcbiAgICBjb25zdCBkZWNsYXJhdGlvbiA9IHRoaXMucmVmbGVjdG9yLmdldERlY2xhcmF0aW9uT2ZJZGVudGlmaWVyKHRhcmdldCk7XG5cbiAgICAvLyBJZiBubyBkZWNsYXJhdGlvbiBjb3VsZCBiZSByZXNvbHZlZCBvciBkb2VzIG5vdCBoYXZlIGEgYHRzLkRlY2xhcmF0aW9uYCwgdGhlIHR5cGUgY2Fubm90IGJlXG4gICAgLy8gcmVzb2x2ZWQuXG4gICAgaWYgKGRlY2xhcmF0aW9uID09PSBudWxsIHx8IGRlY2xhcmF0aW9uLm5vZGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBkZWNsYXJhdGlvbiBjb3JyZXNwb25kcyB3aXRoIGEgbG9jYWwgdHlwZSBwYXJhbWV0ZXIsIHRoZSB0eXBlIHJlZmVyZW5jZSBjYW4gYmUgdXNlZFxuICAgIC8vIGFzIGlzLlxuICAgIGlmICh0aGlzLmlzTG9jYWxUeXBlUGFyYW1ldGVyKGRlY2xhcmF0aW9uLm5vZGUpKSB7XG4gICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG5cbiAgICBsZXQgb3duaW5nTW9kdWxlOiBPd25pbmdNb2R1bGV8bnVsbCA9IG51bGw7XG4gICAgaWYgKGRlY2xhcmF0aW9uLnZpYU1vZHVsZSAhPT0gbnVsbCkge1xuICAgICAgb3duaW5nTW9kdWxlID0ge1xuICAgICAgICBzcGVjaWZpZXI6IGRlY2xhcmF0aW9uLnZpYU1vZHVsZSxcbiAgICAgICAgcmVzb2x1dGlvbkNvbnRleHQ6IHR5cGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBubyBvd25pbmcgbW9kdWxlIGlzIGtub3duLCB0aGUgcmVmZXJlbmNlIG5lZWRzIHRvIGJlIGV4cG9ydGVkIHRvIGJlIGFibGUgdG8gZW1pdCBhbiBpbXBvcnRcbiAgICAvLyBzdGF0ZW1lbnQgZm9yIGl0LiBJZiB0aGUgZGVjbGFyYXRpb24gaXMgbm90IGV4cG9ydGVkLCBudWxsIGlzIHJldHVybmVkIHRvIHByZXZlbnQgZW1pdC5cbiAgICBpZiAob3duaW5nTW9kdWxlID09PSBudWxsICYmICF0aGlzLmlzU3RhdGljYWxseUV4cG9ydGVkKGRlY2xhcmF0aW9uLm5vZGUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlZmVyZW5jZShkZWNsYXJhdGlvbi5ub2RlLCBvd25pbmdNb2R1bGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1N0YXRpY2FsbHlFeHBvcnRlZChkZWNsOiBEZWNsYXJhdGlvbk5vZGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNOYW1lZENsYXNzRGVjbGFyYXRpb24oZGVjbCkgJiYgdGhpcy5yZWZsZWN0b3IuaXNTdGF0aWNhbGx5RXhwb3J0ZWQoZGVjbCk7XG4gIH1cblxuICBwcml2YXRlIGlzTG9jYWxUeXBlUGFyYW1ldGVyKGRlY2w6IERlY2xhcmF0aW9uTm9kZSk6IGJvb2xlYW4ge1xuICAgIC8vIENoZWNraW5nIGZvciBsb2NhbCB0eXBlIHBhcmFtZXRlcnMgb25seSBvY2N1cnMgZHVyaW5nIHJlc29sdXRpb24gb2YgdHlwZSBwYXJhbWV0ZXJzLCBzbyBpdCBpc1xuICAgIC8vIGd1YXJhbnRlZWQgdGhhdCB0eXBlIHBhcmFtZXRlcnMgYXJlIHByZXNlbnQuXG4gICAgcmV0dXJuIHRoaXMudHlwZVBhcmFtZXRlcnMhLnNvbWUocGFyYW0gPT4gcGFyYW0gPT09IGRlY2wpO1xuICB9XG59XG4iXX0=