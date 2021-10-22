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
        define("@angular/compiler/src/render3/r3_factory", ["require", "exports", "@angular/compiler/src/output/output_ast", "@angular/compiler/src/render3/r3_identifiers", "@angular/compiler/src/render3/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isExpressionFactoryMetadata = exports.isDelegatedFactoryMetadata = exports.createFactoryType = exports.compileFactoryFunction = exports.FactoryTarget = exports.R3FactoryDelegateType = void 0;
    var o = require("@angular/compiler/src/output/output_ast");
    var r3_identifiers_1 = require("@angular/compiler/src/render3/r3_identifiers");
    var util_1 = require("@angular/compiler/src/render3/util");
    var R3FactoryDelegateType;
    (function (R3FactoryDelegateType) {
        R3FactoryDelegateType[R3FactoryDelegateType["Class"] = 0] = "Class";
        R3FactoryDelegateType[R3FactoryDelegateType["Function"] = 1] = "Function";
    })(R3FactoryDelegateType = exports.R3FactoryDelegateType || (exports.R3FactoryDelegateType = {}));
    var FactoryTarget;
    (function (FactoryTarget) {
        FactoryTarget[FactoryTarget["Directive"] = 0] = "Directive";
        FactoryTarget[FactoryTarget["Component"] = 1] = "Component";
        FactoryTarget[FactoryTarget["Injectable"] = 2] = "Injectable";
        FactoryTarget[FactoryTarget["Pipe"] = 3] = "Pipe";
        FactoryTarget[FactoryTarget["NgModule"] = 4] = "NgModule";
    })(FactoryTarget = exports.FactoryTarget || (exports.FactoryTarget = {}));
    /**
     * Construct a factory function expression for the given `R3FactoryMetadata`.
     */
    function compileFactoryFunction(meta) {
        var t = o.variable('t');
        var baseFactoryVar = null;
        // The type to instantiate via constructor invocation. If there is no delegated factory, meaning
        // this type is always created by constructor invocation, then this is the type-to-create
        // parameter provided by the user (t) if specified, or the current type if not. If there is a
        // delegated factory (which is used to create the current type) then this is only the type-to-
        // create parameter (t).
        var typeForCtor = !isDelegatedFactoryMetadata(meta) ?
            new o.BinaryOperatorExpr(o.BinaryOperator.Or, t, meta.internalType) :
            t;
        var ctorExpr = null;
        if (meta.deps !== null) {
            // There is a constructor (either explicitly or implicitly defined).
            if (meta.deps !== 'invalid') {
                ctorExpr = new o.InstantiateExpr(typeForCtor, injectDependencies(meta.deps, meta.target));
            }
        }
        else {
            // There is no constructor, use the base class' factory to construct typeForCtor.
            baseFactoryVar = o.variable("\u0275" + meta.name + "_BaseFactory");
            ctorExpr = baseFactoryVar.callFn([typeForCtor]);
        }
        var body = [];
        var retExpr = null;
        function makeConditionalFactory(nonCtorExpr) {
            var r = o.variable('r');
            body.push(r.set(o.NULL_EXPR).toDeclStmt());
            var ctorStmt = ctorExpr !== null ? r.set(ctorExpr).toStmt() :
                o.importExpr(r3_identifiers_1.Identifiers.invalidFactory).callFn([]).toStmt();
            body.push(o.ifStmt(t, [ctorStmt], [r.set(nonCtorExpr).toStmt()]));
            return r;
        }
        if (isDelegatedFactoryMetadata(meta)) {
            // This type is created with a delegated factory. If a type parameter is not specified, call
            // the factory instead.
            var delegateArgs = injectDependencies(meta.delegateDeps, meta.target);
            // Either call `new delegate(...)` or `delegate(...)` depending on meta.delegateType.
            var factoryExpr = new (meta.delegateType === R3FactoryDelegateType.Class ?
                o.InstantiateExpr :
                o.InvokeFunctionExpr)(meta.delegate, delegateArgs);
            retExpr = makeConditionalFactory(factoryExpr);
        }
        else if (isExpressionFactoryMetadata(meta)) {
            // TODO(alxhub): decide whether to lower the value here or in the caller
            retExpr = makeConditionalFactory(meta.expression);
        }
        else {
            retExpr = ctorExpr;
        }
        if (retExpr === null) {
            // The expression cannot be formed so render an `ɵɵinvalidFactory()` call.
            body.push(o.importExpr(r3_identifiers_1.Identifiers.invalidFactory).callFn([]).toStmt());
        }
        else if (baseFactoryVar !== null) {
            // This factory uses a base factory, so call `ɵɵgetInheritedFactory()` to compute it.
            var getInheritedFactoryCall = o.importExpr(r3_identifiers_1.Identifiers.getInheritedFactory).callFn([meta.internalType]);
            // Memoize the base factoryFn: `baseFactory || (baseFactory = ɵɵgetInheritedFactory(...))`
            var baseFactory = new o.BinaryOperatorExpr(o.BinaryOperator.Or, baseFactoryVar, baseFactoryVar.set(getInheritedFactoryCall));
            body.push(new o.ReturnStatement(baseFactory.callFn([typeForCtor])));
        }
        else {
            // This is straightforward factory, just return it.
            body.push(new o.ReturnStatement(retExpr));
        }
        var factoryFn = o.fn([new o.FnParam('t', o.DYNAMIC_TYPE)], body, o.INFERRED_TYPE, undefined, meta.name + "_Factory");
        if (baseFactoryVar !== null) {
            // There is a base factory variable so wrap its declaration along with the factory function into
            // an IIFE.
            factoryFn = o.fn([], [
                new o.DeclareVarStmt(baseFactoryVar.name), new o.ReturnStatement(factoryFn)
            ]).callFn([], /* sourceSpan */ undefined, /* pure */ true);
        }
        return {
            expression: factoryFn,
            statements: [],
            type: createFactoryType(meta),
        };
    }
    exports.compileFactoryFunction = compileFactoryFunction;
    function createFactoryType(meta) {
        var ctorDepsType = meta.deps !== null && meta.deps !== 'invalid' ? createCtorDepsType(meta.deps) : o.NONE_TYPE;
        return o.expressionType(o.importExpr(r3_identifiers_1.Identifiers.FactoryDeclaration, [util_1.typeWithParameters(meta.type.type, meta.typeArgumentCount), ctorDepsType]));
    }
    exports.createFactoryType = createFactoryType;
    function injectDependencies(deps, target) {
        return deps.map(function (dep, index) { return compileInjectDependency(dep, target, index); });
    }
    function compileInjectDependency(dep, target, index) {
        // Interpret the dependency according to its resolved type.
        if (dep.token === null) {
            return o.importExpr(r3_identifiers_1.Identifiers.invalidFactoryDep).callFn([o.literal(index)]);
        }
        else if (dep.attributeNameType === null) {
            // Build up the injection flags according to the metadata.
            var flags = 0 /* Default */ | (dep.self ? 2 /* Self */ : 0) |
                (dep.skipSelf ? 4 /* SkipSelf */ : 0) | (dep.host ? 1 /* Host */ : 0) |
                (dep.optional ? 8 /* Optional */ : 0) |
                (target === FactoryTarget.Pipe ? 16 /* ForPipe */ : 0);
            // If this dependency is optional or otherwise has non-default flags, then additional
            // parameters describing how to inject the dependency must be passed to the inject function
            // that's being used.
            var flagsParam = (flags !== 0 /* Default */ || dep.optional) ? o.literal(flags) : null;
            // Build up the arguments to the injectFn call.
            var injectArgs = [dep.token];
            if (flagsParam) {
                injectArgs.push(flagsParam);
            }
            var injectFn = getInjectFn(target);
            return o.importExpr(injectFn).callFn(injectArgs);
        }
        else {
            // The `dep.attributeTypeName` value is defined, which indicates that this is an `@Attribute()`
            // type dependency. For the generated JS we still want to use the `dep.token` value in case the
            // name given for the attribute is not a string literal. For example given `@Attribute(foo())`,
            // we want to generate `ɵɵinjectAttribute(foo())`.
            //
            // The `dep.attributeTypeName` is only actually used (in `createCtorDepType()`) to generate
            // typings.
            return o.importExpr(r3_identifiers_1.Identifiers.injectAttribute).callFn([dep.token]);
        }
    }
    function createCtorDepsType(deps) {
        var hasTypes = false;
        var attributeTypes = deps.map(function (dep) {
            var type = createCtorDepType(dep);
            if (type !== null) {
                hasTypes = true;
                return type;
            }
            else {
                return o.literal(null);
            }
        });
        if (hasTypes) {
            return o.expressionType(o.literalArr(attributeTypes));
        }
        else {
            return o.NONE_TYPE;
        }
    }
    function createCtorDepType(dep) {
        var entries = [];
        if (dep.attributeNameType !== null) {
            entries.push({ key: 'attribute', value: dep.attributeNameType, quoted: false });
        }
        if (dep.optional) {
            entries.push({ key: 'optional', value: o.literal(true), quoted: false });
        }
        if (dep.host) {
            entries.push({ key: 'host', value: o.literal(true), quoted: false });
        }
        if (dep.self) {
            entries.push({ key: 'self', value: o.literal(true), quoted: false });
        }
        if (dep.skipSelf) {
            entries.push({ key: 'skipSelf', value: o.literal(true), quoted: false });
        }
        return entries.length > 0 ? o.literalMap(entries) : null;
    }
    function isDelegatedFactoryMetadata(meta) {
        return meta.delegateType !== undefined;
    }
    exports.isDelegatedFactoryMetadata = isDelegatedFactoryMetadata;
    function isExpressionFactoryMetadata(meta) {
        return meta.expression !== undefined;
    }
    exports.isExpressionFactoryMetadata = isExpressionFactoryMetadata;
    function getInjectFn(target) {
        switch (target) {
            case FactoryTarget.Component:
            case FactoryTarget.Directive:
            case FactoryTarget.Pipe:
                return r3_identifiers_1.Identifiers.directiveInject;
            case FactoryTarget.NgModule:
            case FactoryTarget.Injectable:
            default:
                return r3_identifiers_1.Identifiers.inject;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3IzX2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBS0gsMkRBQTBDO0lBQzFDLCtFQUE0RDtJQUc1RCwyREFBNkU7SUErQzdFLElBQVkscUJBR1g7SUFIRCxXQUFZLHFCQUFxQjtRQUMvQixtRUFBUyxDQUFBO1FBQ1QseUVBQVksQ0FBQTtJQUNkLENBQUMsRUFIVyxxQkFBcUIsR0FBckIsNkJBQXFCLEtBQXJCLDZCQUFxQixRQUdoQztJQWVELElBQVksYUFNWDtJQU5ELFdBQVksYUFBYTtRQUN2QiwyREFBYSxDQUFBO1FBQ2IsMkRBQWEsQ0FBQTtRQUNiLDZEQUFjLENBQUE7UUFDZCxpREFBUSxDQUFBO1FBQ1IseURBQVksQ0FBQTtJQUNkLENBQUMsRUFOVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQU14QjtJQXFDRDs7T0FFRztJQUNILFNBQWdCLHNCQUFzQixDQUFDLElBQXVCO1FBQzVELElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxjQUFjLEdBQXVCLElBQUksQ0FBQztRQUU5QyxnR0FBZ0c7UUFDaEcseUZBQXlGO1FBQ3pGLDZGQUE2RjtRQUM3Riw4RkFBOEY7UUFDOUYsd0JBQXdCO1FBQ3hCLElBQU0sV0FBVyxHQUFHLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDckUsQ0FBQyxDQUFDO1FBRU4sSUFBSSxRQUFRLEdBQXNCLElBQUksQ0FB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QUssYUFBYSxDQUFDLFNBQVMsQ0FBQztZQUM3QixLQUFLLGFBQWEsQ0FBQyxTQUFTLENBQUM7WUFDN0IsS0FBSyxhQUFhLENBQUMsSUFBSTtnQkFDckIsT0FBTyw0QkFBRSxDQUFDLGVBQWUsQ0FBQztZQUM1QixLQUFLLGFBQWEsQ0FBQyxRQUFRLENBQUM7WUFDNUIsS0FBSyxhQUFhLENBQUMsVUFBVSxDQUFDO1lBQzlCO2dCQUNFLE9BQU8sNEJBQUUsQ0FBQyxNQUFNLENBQUM7U0FDcEI7SUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7U3RhdGljU3ltYm9sfSBmcm9tICcuLi9hb3Qvc3RhdGljX3N5bWJvbCc7XG5pbXBvcnQge0NvbXBpbGVUeXBlTWV0YWRhdGEsIHRva2VuUmVmZXJlbmNlfSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCB7SW5qZWN0RmxhZ3N9IGZyb20gJy4uL2NvcmUnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge0lkZW50aWZpZXJzIGFzIFIzfSBmcm9tICcuLi9yZW5kZXIzL3IzX2lkZW50aWZpZXJzJztcbmltcG9ydCB7T3V0cHV0Q29udGV4dH0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7UjNDb21waWxlZEV4cHJlc3Npb24sIFIzUmVmZXJlbmNlLCB0eXBlV2l0aFBhcmFtZXRlcnN9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge3Vuc3VwcG9ydGVkfSBmcm9tICcuL3ZpZXcvdXRpbCc7XG5cblxuXG4vKipcbiAqIE1ldGFkYXRhIHJlcXVpcmVkIGJ5IHRoZSBmYWN0b3J5IGdlbmVyYXRvciB0byBnZW5lcmF0ZSBhIGBmYWN0b3J5YCBmdW5jdGlvbiBmb3IgYSB0eXBlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFIzQ29uc3RydWN0b3JGYWN0b3J5TWV0YWRhdGEge1xuICAvKipcbiAgICogU3RyaW5nIG5hbWUgb2YgdGhlIHR5cGUgYmVpbmcgZ2VuZXJhdGVkICh1c2VkIHRvIG5hbWUgdGhlIGZhY3RvcnkgZnVuY3Rpb24pLlxuICAgKi9cbiAgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgaW50ZXJmYWNlIHR5cGUgYmVpbmcgY29uc3RydWN0ZWQuXG4gICAqL1xuICB0eXBlOiBSM1JlZmVyZW5jZTtcblxuICAvKipcbiAgICogQW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGNvbnN0cnVjdG9yIHR5cGUsIGludGVuZGVkIGZvciB1c2Ugd2l0aGluIGEgY2xhc3MgZGVmaW5pdGlvblxuICAgKiBpdHNlbGYuXG4gICAqXG4gICAqIFRoaXMgY2FuIGRpZmZlciBmcm9tIHRoZSBvdXRlciBgdHlwZWAgaWYgdGhlIGNsYXNzIGlzIGJlaW5nIGNvbXBpbGVkIGJ5IG5nY2MgYW5kIGlzIGluc2lkZVxuICAgKiBhbiBJSUZFIHN0cnVjdHVyZSB0aGF0IHVzZXMgYSBkaWZmZXJlbnQgbmFtZSBpbnRlcm5hbGx5LlxuICAgKi9cbiAgaW50ZXJuYWxUeXBlOiBvLkV4cHJlc3Npb247XG5cbiAgLyoqIE51bWJlciBvZiBhcmd1bWVudHMgZm9yIHRoZSBgdHlwZWAuICovXG4gIHR5cGVBcmd1bWVudENvdW50OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciBgZm5PckNsYXNzYCBpcyBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIG9yIGEgdXNlci1kZWZpbmVkIGZhY3RvcnksIGl0XG4gICAqIG1heSBoYXZlIDAgb3IgbW9yZSBwYXJhbWV0ZXJzLCB3aGljaCB3aWxsIGJlIGluamVjdGVkIGFjY29yZGluZyB0byB0aGUgYFIzRGVwZW5kZW5jeU1ldGFkYXRhYFxuICAgKiBmb3IgdGhvc2UgcGFyYW1ldGVycy4gSWYgdGhpcyBpcyBgbnVsbGAsIHRoZW4gdGhlIHR5cGUncyBjb25zdHJ1Y3RvciBpcyBub25leGlzdGVudCBhbmQgd2lsbFxuICAgKiBiZSBpbmhlcml0ZWQgZnJvbSBgZm5PckNsYXNzYCB3aGljaCBpcyBpbnRlcnByZXRlZCBhcyB0aGUgY3VycmVudCB0eXBlLiBJZiB0aGlzIGlzIGAnaW52YWxpZCdgLFxuICAgKiB0aGVuIG9uZSBvciBtb3JlIG9mIHRoZSBwYXJhbWV0ZXJzIHdhc24ndCByZXNvbHZhYmxlIGFuZCBhbnkgYXR0ZW1wdCB0byB1c2UgdGhlc2UgZGVwcyB3aWxsXG4gICAqIHJlc3VsdCBpbiBhIHJ1bnRpbWUgZXJyb3IuXG4gICAqL1xuICBkZXBzOiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdfCdpbnZhbGlkJ3xudWxsO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIHRoZSB0YXJnZXQgYmVpbmcgY3JlYXRlZCBieSB0aGUgZmFjdG9yeS5cbiAgICovXG4gIHRhcmdldDogRmFjdG9yeVRhcmdldDtcbn1cblxuZXhwb3J0IGVudW0gUjNGYWN0b3J5RGVsZWdhdGVUeXBlIHtcbiAgQ2xhc3MgPSAwLFxuICBGdW5jdGlvbiA9IDEsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUjNEZWxlZ2F0ZWRGbk9yQ2xhc3NNZXRhZGF0YSBleHRlbmRzIFIzQ29uc3RydWN0b3JGYWN0b3J5TWV0YWRhdGEge1xuICBkZWxlZ2F0ZTogby5FeHByZXNzaW9uO1xuICBkZWxlZ2F0ZVR5cGU6IFIzRmFjdG9yeURlbGVnYXRlVHlwZTtcbiAgZGVsZWdhdGVEZXBzOiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFIzRXhwcmVzc2lvbkZhY3RvcnlNZXRhZGF0YSBleHRlbmRzIFIzQ29uc3RydWN0b3JGYWN0b3J5TWV0YWRhdGEge1xuICBleHByZXNzaW9uOiBvLkV4cHJlc3Npb247XG59XG5cbmV4cG9ydCB0eXBlIFIzRmFjdG9yeU1ldGFkYXRhID1cbiAgICBSM0NvbnN0cnVjdG9yRmFjdG9yeU1ldGFkYXRhfFIzRGVsZWdhdGVkRm5PckNsYXNzTWV0YWRhdGF8UjNFeHByZXNzaW9uRmFjdG9yeU1ldGFkYXRhO1xuXG5leHBvcnQgZW51bSBGYWN0b3J5VGFyZ2V0IHtcbiAgRGlyZWN0aXZlID0gMCxcbiAgQ29tcG9uZW50ID0gMSxcbiAgSW5qZWN0YWJsZSA9IDIsXG4gIFBpcGUgPSAzLFxuICBOZ01vZHVsZSA9IDQsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUjNEZXBlbmRlbmN5TWV0YWRhdGEge1xuICAvKipcbiAgICogQW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIHRva2VuIG9yIHZhbHVlIHRvIGJlIGluamVjdGVkLlxuICAgKiBPciBgbnVsbGAgaWYgdGhlIGRlcGVuZGVuY3kgY291bGQgbm90IGJlIHJlc29sdmVkIC0gbWFraW5nIGl0IGludmFsaWQuXG4gICAqL1xuICB0b2tlbjogby5FeHByZXNzaW9ufG51bGw7XG5cbiAgLyoqXG4gICAqIElmIGFuIEBBdHRyaWJ1dGUgZGVjb3JhdG9yIGlzIHByZXNlbnQsIHRoaXMgaXMgdGhlIGxpdGVyYWwgdHlwZSBvZiB0aGUgYXR0cmlidXRlIG5hbWUsIG9yXG4gICAqIHRoZSB1bmtub3duIHR5cGUgaWYgbm8gbGl0ZXJhbCB0eXBlIGlzIGF2YWlsYWJsZSAoZS5nLiB0aGUgYXR0cmlidXRlIG5hbWUgaXMgYW4gZXhwcmVzc2lvbikuXG4gICAqIE90aGVyd2lzZSBpdCBpcyBudWxsO1xuICAgKi9cbiAgYXR0cmlidXRlTmFtZVR5cGU6IG8uRXhwcmVzc2lvbnxudWxsO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkZXBlbmRlbmN5IGhhcyBhbiBASG9zdCBxdWFsaWZpZXIuXG4gICAqL1xuICBob3N0OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkZXBlbmRlbmN5IGhhcyBhbiBAT3B0aW9uYWwgcXVhbGlmaWVyLlxuICAgKi9cbiAgb3B0aW9uYWw6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRlcGVuZGVuY3kgaGFzIGFuIEBTZWxmIHF1YWxpZmllci5cbiAgICovXG4gIHNlbGY6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRlcGVuZGVuY3kgaGFzIGFuIEBTa2lwU2VsZiBxdWFsaWZpZXIuXG4gICAqL1xuICBza2lwU2VsZjogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3QgYSBmYWN0b3J5IGZ1bmN0aW9uIGV4cHJlc3Npb24gZm9yIHRoZSBnaXZlbiBgUjNGYWN0b3J5TWV0YWRhdGFgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUZhY3RvcnlGdW5jdGlvbihtZXRhOiBSM0ZhY3RvcnlNZXRhZGF0YSk6IFIzQ29tcGlsZWRFeHByZXNzaW9uIHtcbiAgY29uc3QgdCA9IG8udmFyaWFibGUoJ3QnKTtcbiAgbGV0IGJhc2VGYWN0b3J5VmFyOiBvLlJlYWRWYXJFeHByfG51bGwgPSBudWxsO1xuXG4gIC8vIFRoZSB0eXBlIHRvIGluc3RhbnRpYXRlIHZpYSBjb25zdHJ1Y3RvciBpbnZvY2F0aW9uLiBJZiB0aGVyZSBpcyBubyBkZWxlZ2F0ZWQgZmFjdG9yeSwgbWVhbmluZ1xuICAvLyB0aGlzIHR5cGUgaXMgYWx3YXlzIGNyZWF0ZWQgYnkgY29uc3RydWN0b3IgaW52b2NhdGlvbiwgdGhlbiB0aGlzIGlzIHRoZSB0eXBlLXRvLWNyZWF0ZVxuICAvLyBwYXJhbWV0ZXIgcHJvdmlkZWQgYnkgdGhlIHVzZXIgKHQpIGlmIHNwZWNpZmllZCwgb3IgdGhlIGN1cnJlbnQgdHlwZSBpZiBub3QuIElmIHRoZXJlIGlzIGFcbiAgLy8gZGVsZWdhdGVkIGZhY3RvcnkgKHdoaWNoIGlzIHVzZWQgdG8gY3JlYXRlIHRoZSBjdXJyZW50IHR5cGUpIHRoZW4gdGhpcyBpcyBvbmx5IHRoZSB0eXBlLXRvLVxuICAvLyBjcmVhdGUgcGFyYW1ldGVyICh0KS5cbiAgY29uc3QgdHlwZUZvckN0b3IgPSAhaXNEZWxlZ2F0ZWRGYWN0b3J5TWV0YWRhdGEobWV0YSkgP1xuICAgICAgbmV3IG8uQmluYXJ5T3BlcmF0b3JFeHByKG8uQmluYXJ5T3BlcmF0b3IuT3IsIHQsIG1ldGEuaW50ZXJuYWxUeXBlKSA6XG4gICAgICB0O1xuXG4gIGxldCBjdG9yRXhwcjogby5FeHByZXNzaW9ufG51bGwgPSBudWxsO1xuICBpZiAobWV0YS5kZXBzICE9PSBudWxsKSB7XG4gICAgLy8gVGhlcmUgaXMgYSBjb25zdHJ1Y3RvciAoZWl0aGVyIGV4cGxpY2l0bHkgb3IgaW1wbGljaXRseSBkZWZpbmVkKS5cbiAgICBpZiAobWV0YS5kZXBzICE9PSAnaW52YWxpZCcpIHtcbiAgICAgIGN0b3JFeHByID0gbmV3IG8uSW5zdGFudGlhdGVFeHByKHR5cGVGb3JDdG9yLCBpbmplY3REZXBlbmRlbmNpZXMobWV0YS5kZXBzLCBtZXRhLnRhcmdldCkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBUaGVyZSBpcyBubyBjb25zdHJ1Y3RvciwgdXNlIHRoZSBiYXNlIGNsYXNzJyBmYWN0b3J5IHRvIGNvbnN0cnVjdCB0eXBlRm9yQ3Rvci5cbiAgICBiYXNlRmFjdG9yeVZhciA9IG8udmFyaWFibGUoYMm1JHttZXRhLm5hbWV9X0Jhc2VGYWN0b3J5YCk7XG4gICAgY3RvckV4cHIgPSBiYXNlRmFjdG9yeVZhci5jYWxsRm4oW3R5cGVGb3JDdG9yXSk7XG4gIH1cblxuICBjb25zdCBib2R5OiBvLlN0YXRlbWVudFtdID0gW107XG4gIGxldCByZXRFeHByOiBvLkV4cHJlc3Npb258bnVsbCA9IG51bGw7XG5cbiAgZnVuY3Rpb24gbWFrZUNvbmRpdGlvbmFsRmFjdG9yeShub25DdG9yRXhwcjogby5FeHByZXNzaW9uKTogby5SZWFkVmFyRXhwciB7XG4gICAgY29uc3QgciA9IG8udmFyaWFibGUoJ3InKTtcbiAgICBib2R5LnB1c2goci5zZXQoby5OVUxMX0VYUFIpLnRvRGVjbFN0bXQoKSk7XG4gICAgY29uc3QgY3RvclN0bXQgPSBjdG9yRXhwciAhPT0gbnVsbCA/IHIuc2V0KGN0b3JFeHByKS50b1N0bXQoKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uaW1wb3J0RXhwcihSMy5pbnZhbGlkRmFjdG9yeSkuY2FsbEZuKFtdKS50b1N0bXQoKTtcbiAgICBib2R5LnB1c2goby5pZlN0bXQodCwgW2N0b3JTdG10XSwgW3Iuc2V0KG5vbkN0b3JFeHByKS50b1N0bXQoKV0pKTtcbiAgICByZXR1cm4gcjtcbiAgfVxuXG4gIGlmIChpc0RlbGVnYXRlZEZhY3RvcnlNZXRhZGF0YShtZXRhKSkge1xuICAgIC8vIFRoaXMgdHlwZSBpcyBjcmVhdGVkIHdpdGggYSBkZWxlZ2F0ZWQgZmFjdG9yeS4gSWYgYSB0eXBlIHBhcmFtZXRlciBpcyBub3Qgc3BlY2lmaWVkLCBjYWxsXG4gICAgLy8gdGhlIGZhY3RvcnkgaW5zdGVhZC5cbiAgICBjb25zdCBkZWxlZ2F0ZUFyZ3MgPSBpbmplY3REZXBlbmRlbmNpZXMobWV0YS5kZWxlZ2F0ZURlcHMsIG1ldGEudGFyZ2V0KTtcbiAgICAvLyBFaXRoZXIgY2FsbCBgbmV3IGRlbGVnYXRlKC4uLilgIG9yIGBkZWxlZ2F0ZSguLi4pYCBkZXBlbmRpbmcgb24gbWV0YS5kZWxlZ2F0ZVR5cGUuXG4gICAgY29uc3QgZmFjdG9yeUV4cHIgPSBuZXcgKFxuICAgICAgICBtZXRhLmRlbGVnYXRlVHlwZSA9PT0gUjNGYWN0b3J5RGVsZWdhdGVUeXBlLkNsYXNzID9cbiAgICAgICAgICAgIG8uSW5zdGFudGlhdGVFeHByIDpcbiAgICAgICAgICAgIG8uSW52b2tlRnVuY3Rpb25FeHByKShtZXRhLmRlbGVnYXRlLCBkZWxlZ2F0ZUFyZ3MpO1xuICAgIHJldEV4cHIgPSBtYWtlQ29uZGl0aW9uYWxGYWN0b3J5KGZhY3RvcnlFeHByKTtcbiAgfSBlbHNlIGlmIChpc0V4cHJlc3Npb25GYWN0b3J5TWV0YWRhdGEobWV0YSkpIHtcbiAgICAvLyBUT0RPKGFseGh1Yik6IGRlY2lkZSB3aGV0aGVyIHRvIGxvd2VyIHRoZSB2YWx1ZSBoZXJlIG9yIGluIHRoZSBjYWxsZXJcbiAgICByZXRFeHByID0gbWFrZUNvbmRpdGlvbmFsRmFjdG9yeShtZXRhLmV4cHJlc3Npb24pO1xuICB9IGVsc2Uge1xuICAgIHJldEV4cHIgPSBjdG9yRXhwcjtcbiAgfVxuXG5cbiAgaWYgKHJldEV4cHIgPT09IG51bGwpIHtcbiAgICAvLyBUaGUgZXhwcmVzc2lvbiBjYW5ub3QgYmUgZm9ybWVkIHNvIHJlbmRlciBhbiBgybXJtWludmFsaWRGYWN0b3J5KClgIGNhbGwuXG4gICAgYm9keS5wdXNoKG8uaW1wb3J0RXhwcihSMy5pbnZhbGlkRmFjdG9yeSkuY2FsbEZuKFtdKS50b1N0bXQoKSk7XG4gIH0gZWxzZSBpZiAoYmFzZUZhY3RvcnlWYXIgIT09IG51bGwpIHtcbiAgICAvLyBUaGlzIGZhY3RvcnkgdXNlcyBhIGJhc2UgZmFjdG9yeSwgc28gY2FsbCBgybXJtWdldEluaGVyaXRlZEZhY3RvcnkoKWAgdG8gY29tcHV0ZSBpdC5cbiAgICBjb25zdCBnZXRJbmhlcml0ZWRGYWN0b3J5Q2FsbCA9XG4gICAgICAgIG8uaW1wb3J0RXhwcihSMy5nZXRJbmhlcml0ZWRGYWN0b3J5KS5jYWxsRm4oW21ldGEuaW50ZXJuYWxUeXBlXSk7XG4gICAgLy8gTWVtb2l6ZSB0aGUgYmFzZSBmYWN0b3J5Rm46IGBiYXNlRmFjdG9yeSB8fCAoYmFzZUZhY3RvcnkgPSDJtcm1Z2V0SW5oZXJpdGVkRmFjdG9yeSguLi4pKWBcbiAgICBjb25zdCBiYXNlRmFjdG9yeSA9IG5ldyBvLkJpbmFyeU9wZXJhdG9yRXhwcihcbiAgICAgICAgby5CaW5hcnlPcGVyYXRvci5PciwgYmFzZUZhY3RvcnlWYXIsIGJhc2VGYWN0b3J5VmFyLnNldChnZXRJbmhlcml0ZWRGYWN0b3J5Q2FsbCkpO1xuICAgIGJvZHkucHVzaChuZXcgby5SZXR1cm5TdGF0ZW1lbnQoYmFzZUZhY3RvcnkuY2FsbEZuKFt0eXBlRm9yQ3Rvcl0pKSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gVGhpcyBpcyBzdHJhaWdodGZvcndhcmQgZmFjdG9yeSwganVzdCByZXR1cm4gaXQuXG4gICAgYm9keS5wdXNoKG5ldyBvLlJldHVyblN0YXRlbWVudChyZXRFeHByKSk7XG4gIH1cblxuICBsZXQgZmFjdG9yeUZuOiBvLkV4cHJlc3Npb24gPSBvLmZuKFxuICAgICAgW25ldyBvLkZuUGFyYW0oJ3QnLCBvLkRZTkFNSUNfVFlQRSldLCBib2R5LCBvLklORkVSUkVEX1RZUEUsIHVuZGVmaW5lZCxcbiAgICAgIGAke21ldGEubmFtZX1fRmFjdG9yeWApO1xuXG4gIGlmIChiYXNlRmFjdG9yeVZhciAhPT0gbnVsbCkge1xuICAgIC8vIFRoZXJlIGlzIGEgYmFzZSBmYWN0b3J5IHZhcmlhYmxlIHNvIHdyYXAgaXRzIGRlY2xhcmF0aW9uIGFsb25nIHdpdGggdGhlIGZhY3RvcnkgZnVuY3Rpb24gaW50b1xuICAgIC8vIGFuIElJRkUuXG4gICAgZmFjdG9yeUZuID0gby5mbihbXSwgW1xuICAgICAgICAgICAgICAgICAgIG5ldyBvLkRlY2xhcmVWYXJTdG10KGJhc2VGYWN0b3J5VmFyLm5hbWUhKSwgbmV3IG8uUmV0dXJuU3RhdGVtZW50KGZhY3RvcnlGbilcbiAgICAgICAgICAgICAgICAgXSkuY2FsbEZuKFtdLCAvKiBzb3VyY2VTcGFuICovIHVuZGVmaW5lZCwgLyogcHVyZSAqLyB0cnVlKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZXhwcmVzc2lvbjogZmFjdG9yeUZuLFxuICAgIHN0YXRlbWVudHM6IFtdLFxuICAgIHR5cGU6IGNyZWF0ZUZhY3RvcnlUeXBlKG1ldGEpLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRmFjdG9yeVR5cGUobWV0YTogUjNGYWN0b3J5TWV0YWRhdGEpIHtcbiAgY29uc3QgY3RvckRlcHNUeXBlID1cbiAgICAgIG1ldGEuZGVwcyAhPT0gbnVsbCAmJiBtZXRhLmRlcHMgIT09ICdpbnZhbGlkJyA/IGNyZWF0ZUN0b3JEZXBzVHlwZShtZXRhLmRlcHMpIDogby5OT05FX1RZUEU7XG4gIHJldHVybiBvLmV4cHJlc3Npb25UeXBlKG8uaW1wb3J0RXhwcihcbiAgICAgIFIzLkZhY3RvcnlEZWNsYXJhdGlvbixcbiAgICAgIFt0eXBlV2l0aFBhcmFtZXRlcnMobWV0YS50eXBlLnR5cGUsIG1ldGEudHlwZUFyZ3VtZW50Q291bnQpLCBjdG9yRGVwc1R5cGVdKSk7XG59XG5cbmZ1bmN0aW9uIGluamVjdERlcGVuZGVuY2llcyhkZXBzOiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdLCB0YXJnZXQ6IEZhY3RvcnlUYXJnZXQpOiBvLkV4cHJlc3Npb25bXSB7XG4gIHJldHVybiBkZXBzLm1hcCgoZGVwLCBpbmRleCkgPT4gY29tcGlsZUluamVjdERlcGVuZGVuY3koZGVwLCB0YXJnZXQsIGluZGV4KSk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVJbmplY3REZXBlbmRlbmN5KFxuICAgIGRlcDogUjNEZXBlbmRlbmN5TWV0YWRhdGEsIHRhcmdldDogRmFjdG9yeVRhcmdldCwgaW5kZXg6IG51bWJlcik6IG8uRXhwcmVzc2lvbiB7XG4gIC8vIEludGVycHJldCB0aGUgZGVwZW5kZW5jeSBhY2NvcmRpbmcgdG8gaXRzIHJlc29sdmVkIHR5cGUuXG4gIGlmIChkZXAudG9rZW4gPT09IG51bGwpIHtcbiAgICByZXR1cm4gby5pbXBvcnRFeHByKFIzLmludmFsaWRGYWN0b3J5RGVwKS5jYWxsRm4oW28ubGl0ZXJhbChpbmRleCldKTtcbiAgfSBlbHNlIGlmIChkZXAuYXR0cmlidXRlTmFtZVR5cGUgPT09IG51bGwpIHtcbiAgICAvLyBCdWlsZCB1cCB0aGUgaW5qZWN0aW9uIGZsYWdzIGFjY29yZGluZyB0byB0aGUgbWV0YWRhdGEuXG4gICAgY29uc3QgZmxhZ3MgPSBJbmplY3RGbGFncy5EZWZhdWx0IHwgKGRlcC5zZWxmID8gSW5qZWN0RmxhZ3MuU2VsZiA6IDApIHxcbiAgICAgICAgKGRlcC5za2lwU2VsZiA/IEluamVjdEZsYWdzLlNraXBTZWxmIDogMCkgfCAoZGVwLmhvc3QgPyBJbmplY3RGbGFncy5Ib3N0IDogMCkgfFxuICAgICAgICAoZGVwLm9wdGlvbmFsID8gSW5qZWN0RmxhZ3MuT3B0aW9uYWwgOiAwKSB8XG4gICAgICAgICh0YXJnZXQgPT09IEZhY3RvcnlUYXJnZXQuUGlwZSA/IEluamVjdEZsYWdzLkZvclBpcGUgOiAwKTtcblxuICAgIC8vIElmIHRoaXMgZGVwZW5kZW5jeSBpcyBvcHRpb25hbCBvciBvdGhlcndpc2UgaGFzIG5vbi1kZWZhdWx0IGZsYWdzLCB0aGVuIGFkZGl0aW9uYWxcbiAgICAvLyBwYXJhbWV0ZXJzIGRlc2NyaWJpbmcgaG93IHRvIGluamVjdCB0aGUgZGVwZW5kZW5jeSBtdXN0IGJlIHBhc3NlZCB0byB0aGUgaW5qZWN0IGZ1bmN0aW9uXG4gICAgLy8gdGhhdCdzIGJlaW5nIHVzZWQuXG4gICAgbGV0IGZsYWdzUGFyYW06IG8uTGl0ZXJhbEV4cHJ8bnVsbCA9XG4gICAgICAgIChmbGFncyAhPT0gSW5qZWN0RmxhZ3MuRGVmYXVsdCB8fCBkZXAub3B0aW9uYWwpID8gby5saXRlcmFsKGZsYWdzKSA6IG51bGw7XG5cbiAgICAvLyBCdWlsZCB1cCB0aGUgYXJndW1lbnRzIHRvIHRoZSBpbmplY3RGbiBjYWxsLlxuICAgIGNvbnN0IGluamVjdEFyZ3MgPSBbZGVwLnRva2VuXTtcbiAgICBpZiAoZmxhZ3NQYXJhbSkge1xuICAgICAgaW5qZWN0QXJncy5wdXNoKGZsYWdzUGFyYW0pO1xuICAgIH1cbiAgICBjb25zdCBpbmplY3RGbiA9IGdldEluamVjdEZuKHRhcmdldCk7XG4gICAgcmV0dXJuIG8uaW1wb3J0RXhwcihpbmplY3RGbikuY2FsbEZuKGluamVjdEFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIC8vIFRoZSBgZGVwLmF0dHJpYnV0ZVR5cGVOYW1lYCB2YWx1ZSBpcyBkZWZpbmVkLCB3aGljaCBpbmRpY2F0ZXMgdGhhdCB0aGlzIGlzIGFuIGBAQXR0cmlidXRlKClgXG4gICAgLy8gdHlwZSBkZXBlbmRlbmN5LiBGb3IgdGhlIGdlbmVyYXRlZCBKUyB3ZSBzdGlsbCB3YW50IHRvIHVzZSB0aGUgYGRlcC50b2tlbmAgdmFsdWUgaW4gY2FzZSB0aGVcbiAgICAvLyBuYW1lIGdpdmVuIGZvciB0aGUgYXR0cmlidXRlIGlzIG5vdCBhIHN0cmluZyBsaXRlcmFsLiBGb3IgZXhhbXBsZSBnaXZlbiBgQEF0dHJpYnV0ZShmb28oKSlgLFxuICAgIC8vIHdlIHdhbnQgdG8gZ2VuZXJhdGUgYMm1ybVpbmplY3RBdHRyaWJ1dGUoZm9vKCkpYC5cbiAgICAvL1xuICAgIC8vIFRoZSBgZGVwLmF0dHJpYnV0ZVR5cGVOYW1lYCBpcyBvbmx5IGFjdHVhbGx5IHVzZWQgKGluIGBjcmVhdGVDdG9yRGVwVHlwZSgpYCkgdG8gZ2VuZXJhdGVcbiAgICAvLyB0eXBpbmdzLlxuICAgIHJldHVybiBvLmltcG9ydEV4cHIoUjMuaW5qZWN0QXR0cmlidXRlKS5jYWxsRm4oW2RlcC50b2tlbl0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUN0b3JEZXBzVHlwZShkZXBzOiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdKTogby5UeXBlIHtcbiAgbGV0IGhhc1R5cGVzID0gZmFsc2U7XG4gIGNvbnN0IGF0dHJpYnV0ZVR5cGVzID0gZGVwcy5tYXAoZGVwID0+IHtcbiAgICBjb25zdCB0eXBlID0gY3JlYXRlQ3RvckRlcFR5cGUoZGVwKTtcbiAgICBpZiAodHlwZSAhPT0gbnVsbCkge1xuICAgICAgaGFzVHlwZXMgPSB0cnVlO1xuICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvLmxpdGVyYWwobnVsbCk7XG4gICAgfVxuICB9KTtcblxuICBpZiAoaGFzVHlwZXMpIHtcbiAgICByZXR1cm4gby5leHByZXNzaW9uVHlwZShvLmxpdGVyYWxBcnIoYXR0cmlidXRlVHlwZXMpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gby5OT05FX1RZUEU7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ3RvckRlcFR5cGUoZGVwOiBSM0RlcGVuZGVuY3lNZXRhZGF0YSk6IG8uTGl0ZXJhbE1hcEV4cHJ8bnVsbCB7XG4gIGNvbnN0IGVudHJpZXM6IHtrZXk6IHN0cmluZywgcXVvdGVkOiBib29sZWFuLCB2YWx1ZTogby5FeHByZXNzaW9ufVtdID0gW107XG5cbiAgaWYgKGRlcC5hdHRyaWJ1dGVOYW1lVHlwZSAhPT0gbnVsbCkge1xuICAgIGVudHJpZXMucHVzaCh7a2V5OiAnYXR0cmlidXRlJywgdmFsdWU6IGRlcC5hdHRyaWJ1dGVOYW1lVHlwZSwgcXVvdGVkOiBmYWxzZX0pO1xuICB9XG4gIGlmIChkZXAub3B0aW9uYWwpIHtcbiAgICBlbnRyaWVzLnB1c2goe2tleTogJ29wdGlvbmFsJywgdmFsdWU6IG8ubGl0ZXJhbCh0cnVlKSwgcXVvdGVkOiBmYWxzZX0pO1xuICB9XG4gIGlmIChkZXAuaG9zdCkge1xuICAgIGVudHJpZXMucHVzaCh7a2V5OiAnaG9zdCcsIHZhbHVlOiBvLmxpdGVyYWwodHJ1ZSksIHF1b3RlZDogZmFsc2V9KTtcbiAgfVxuICBpZiAoZGVwLnNlbGYpIHtcbiAgICBlbnRyaWVzLnB1c2goe2tleTogJ3NlbGYnLCB2YWx1ZTogby5saXRlcmFsKHRydWUpLCBxdW90ZWQ6IGZhbHNlfSk7XG4gIH1cbiAgaWYgKGRlcC5za2lwU2VsZikge1xuICAgIGVudHJpZXMucHVzaCh7a2V5OiAnc2tpcFNlbGYnLCB2YWx1ZTogby5saXRlcmFsKHRydWUpLCBxdW90ZWQ6IGZhbHNlfSk7XG4gIH1cblxuICByZXR1cm4gZW50cmllcy5sZW5ndGggPiAwID8gby5saXRlcmFsTWFwKGVudHJpZXMpIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVsZWdhdGVkRmFjdG9yeU1ldGFkYXRhKG1ldGE6IFIzRmFjdG9yeU1ldGFkYXRhKTpcbiAgICBtZXRhIGlzIFIzRGVsZWdhdGVkRm5PckNsYXNzTWV0YWRhdGEge1xuICByZXR1cm4gKG1ldGEgYXMgYW55KS5kZWxlZ2F0ZVR5cGUgIT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXhwcmVzc2lvbkZhY3RvcnlNZXRhZGF0YShtZXRhOiBSM0ZhY3RvcnlNZXRhZGF0YSk6XG4gICAgbWV0YSBpcyBSM0V4cHJlc3Npb25GYWN0b3J5TWV0YWRhdGEge1xuICByZXR1cm4gKG1ldGEgYXMgYW55KS5leHByZXNzaW9uICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGdldEluamVjdEZuKHRhcmdldDogRmFjdG9yeVRhcmdldCk6IG8uRXh0ZXJuYWxSZWZlcmVuY2Uge1xuICBzd2l0Y2ggKHRhcmdldCkge1xuICAgIGNhc2UgRmFjdG9yeVRhcmdldC5Db21wb25lbnQ6XG4gICAgY2FzZSBGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZTpcbiAgICBjYXNlIEZhY3RvcnlUYXJnZXQuUGlwZTpcbiAgICAgIHJldHVybiBSMy5kaXJlY3RpdmVJbmplY3Q7XG4gICAgY2FzZSBGYWN0b3J5VGFyZ2V0Lk5nTW9kdWxlOlxuICAgIGNhc2UgRmFjdG9yeVRhcmdldC5JbmplY3RhYmxlOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gUjMuaW5qZWN0O1xuICB9XG59XG4iXX0=