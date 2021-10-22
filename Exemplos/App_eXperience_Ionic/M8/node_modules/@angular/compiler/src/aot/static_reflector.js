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
        define("@angular/compiler/src/aot/static_reflector", ["require", "exports", "tslib", "@angular/compiler/src/compile_metadata", "@angular/compiler/src/core", "@angular/compiler/src/util", "@angular/compiler/src/aot/formatted_error", "@angular/compiler/src/aot/static_symbol"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StaticReflector = void 0;
    var tslib_1 = require("tslib");
    var compile_metadata_1 = require("@angular/compiler/src/compile_metadata");
    var core_1 = require("@angular/compiler/src/core");
    var util_1 = require("@angular/compiler/src/util");
    var formatted_error_1 = require("@angular/compiler/src/aot/formatted_error");
    var static_symbol_1 = require("@angular/compiler/src/aot/static_symbol");
    var ANGULAR_CORE = '@angular/core';
    var ANGULAR_ROUTER = '@angular/router';
    var HIDDEN_KEY = /^\$.*\$$/;
    var IGNORE = {
        __symbolic: 'ignore'
    };
    var USE_VALUE = 'useValue';
    var PROVIDE = 'provide';
    var REFERENCE_SET = new Set([USE_VALUE, 'useFactory', 'data', 'id', 'loadChildren']);
    var TYPEGUARD_POSTFIX = 'TypeGuard';
    var USE_IF = 'UseIf';
    function shouldIgnore(value) {
        return value && value.__symbolic == 'ignore';
    }
    /**
     * A static reflector implements enough of the Reflector API that is necessary to compile
     * templates statically.
     */
    var StaticReflector = /** @class */ (function () {
        function StaticReflector(summaryResolver, symbolResolver, knownMetadataClasses, knownMetadataFunctions, errorRecorder) {
            var _this = this;
            if (knownMetadataClasses === void 0) { knownMetadataClasses = []; }
            if (knownMetadataFunctions === void 0) { knownMetadataFunctions = []; }
            this.summaryResolver = summaryResolver;
            this.symbolResolver = symbolResolver;
            this.errorRecorder = errorRecorder;
            this.annotationCache = new Map();
            this.shallowAnnotationCache = new Map();
            this.propertyCache = new Map();
            this.parameterCache = new Map();
            this.methodCache = new Map();
            this.staticCache = new Map();
            this.conversionMap = new Map();
            this.resolvedExternalReferences = new Map();
            this.annotationForParentClassWithSummaryKind = new Map();
            this.initializeConversionMap();
            knownMetadataClasses.forEach(function (kc) { return _this._registerDecoratorOrConstructor(_this.getStaticSymbol(kc.filePath, kc.name), kc.ctor); });
            knownMetadataFunctions.forEach(function (kf) { return _this._registerFunction(_this.getStaticSymbol(kf.filePath, kf.name), kf.fn); });
            this.annotationForParentClassWithSummaryKind.set(compile_metadata_1.CompileSummaryKind.Directive, [core_1.createDirective, core_1.createComponent]);
            this.annotationForParentClassWithSummaryKind.set(compile_metadata_1.CompileSummaryKind.Pipe, [core_1.createPipe]);
            this.annotationForParentClassWithSummaryKind.set(compile_metadata_1.CompileSummaryKind.NgModule, [core_1.createNgModule]);
            this.annotationForParentClassWithSummaryKind.set(compile_metadata_1.CompileSummaryKind.Injectable, [core_1.createInjectable, core_1.createPipe, core_1.createDirective, core_1.createComponent, core_1.createNgModule]);
        }
        StaticReflector.prototype.componentModuleUrl = function (typeOrFunc) {
            var staticSymbol = this.findSymbolDeclaration(typeOrFunc);
            return this.symbolResolver.getResourcePath(staticSymbol);
        };
        /**
         * Invalidate the specified `symbols` on program change.
         * @param symbols
         */
        StaticReflector.prototype.invalidateSymbols = function (symbols) {
            var e_1, _a;
            try {
                for (var symbols_1 = tslib_1.__values(symbols), symbols_1_1 = symbols_1.next(); !symbols_1_1.done; symbols_1_1 = symbols_1.next()) {
                    var symbol = symbols_1_1.value;
                    this.annotationCache.delete(symbol);
                    this.shallowAnnotationCache.delete(symbol);
                    this.propertyCache.delete(symbol);
                    this.parameterCache.delete(symbol);
                    this.methodCache.delete(symbol);
                    this.staticCache.delete(symbol);
                    this.conversionMap.delete(symbol);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (symbols_1_1 && !symbols_1_1.done && (_a = symbols_1.return)) _a.call(symbols_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        StaticReflector.prototype.resolveExternalReference = function (ref, containingFile) {
            var key = undefined;
            if (!containingFile) {
                key = ref.moduleName + ":" + ref.name;
                var declarationSymbol_1 = this.resolvedExternalReferences.get(key);
                if (declarationSymbol_1)
                    return declarationSymbol_1;
            }
            var refSymbol = this.symbolResolver.getSymbolByModule(ref.moduleName, ref.name, containingFile);
            var declarationSymbol = this.findSymbolDeclaration(refSymbol);
            if (!containingFile) {
                this.symbolResolver.recordModuleNameForFileName(refSymbol.filePath, ref.moduleName);
                this.symbolResolver.recordImportAs(declarationSymbol, refSymbol);
            }
            if (key) {
                this.resolvedExternalReferences.set(key, declarationSymbol);
            }
            return declarationSymbol;
        };
        StaticReflector.prototype.findDeclaration = function (moduleUrl, name, containingFile) {
            return this.findSymbolDeclaration(this.symbolResolver.getSymbolByModule(moduleUrl, name, containingFile));
        };
        StaticReflector.prototype.tryFindDeclaration = function (moduleUrl, name, containingFile) {
            var _this = this;
            return this.symbolResolver.ignoreErrorsFor(function () { return _this.findDeclaration(moduleUrl, name, containingFile); });
        };
        StaticReflector.prototype.findSymbolDeclaration = function (symbol) {
            var resolvedSymbol = this.symbolResolver.resolveSymbol(symbol);
            if (resolvedSymbol) {
                var resolvedMetadata = resolvedSymbol.metadata;
                if (resolvedMetadata && resolvedMetadata.__symbolic === 'resolved') {
                    resolvedMetadata = resolvedMetadata.symbol;
                }
                if (resolvedMetadata instanceof static_symbol_1.StaticSymbol) {
                    return this.findSymbolDeclaration(resolvedSymbol.metadata);
                }
            }
            return symbol;
        };
        StaticReflector.prototype.tryAnnotations = function (type) {
            var originalRecorder = this.errorRecorder;
            this.errorRecorder = function (error, fileName) { };
            try {
                return this.annotations(type);
            }
            finally {
                this.errorRecorder = originalRecorder;
            }
        };
        StaticReflector.prototype.annotations = function (type) {
            var _this = this;
            return this._annotations(type, function (type, decorators) { return _this.simplify(type, decorators); }, this.annotationCache);
        };
        StaticReflector.prototype.shallowAnnotations = function (type) {
            var _this = this;
            return this._annotations(type, function (type, decorators) { return _this.simplify(type, decorators, true); }, this.shallowAnnotationCache);
        };
        StaticReflector.prototype._annotations = function (type, simplify, annotationCache) {
            var annotations = annotationCache.get(type);
            if (!annotations) {
                annotations = [];
                var classMetadata = this.getTypeMetadata(type);
                var parentType = this.findParentType(type, classMetadata);
                if (parentType) {
                    var parentAnnotations = this.annotations(parentType);
                    annotations.push.apply(annotations, tslib_1.__spreadArray([], tslib_1.__read(parentAnnotations)));
                }
                var ownAnnotations_1 = [];
                if (classMetadata['decorators']) {
                    ownAnnotations_1 = simplify(type, classMetadata['decorators']);
                    if (ownAnnotations_1) {
                        annotations.push.apply(annotations, tslib_1.__spreadArray([], tslib_1.__read(ownAnnotations_1)));
                    }
                }
                if (parentType && !this.summaryResolver.isLibraryFile(type.filePath) &&
                    this.summaryResolver.isLibraryFile(parentType.filePath)) {
                    var summary = this.summaryResolver.resolveSummary(parentType);
                    if (summary && summary.type) {
                        var requiredAnnotationTypes = this.annotationForParentClassWithSummaryKind.get(summary.type.summaryKind);
                        var typeHasRequiredAnnotation = requiredAnnotationTypes.some(function (requiredType) { return ownAnnotations_1.some(function (ann) { return requiredType.isTypeOf(ann); }); });
                        if (!typeHasRequiredAnnotation) {
                            this.reportError(formatMetadataError(metadataError("Class " + type.name + " in " + type.filePath + " extends from a " + compile_metadata_1.CompileSummaryKind[summary.type.summaryKind] + " in another compilation unit without duplicating the decorator", 
                            /* summary */ undefined, "Please add a " + requiredAnnotationTypes.map(function (type) { return type.ngMetadataName; })
                                .join(' or ') + " decorator to the class"), type), type);
                        }
                    }
                }
                annotationCache.set(type, annotations.filter(function (ann) { return !!ann; }));
            }
            return annotations;
        };
        StaticReflector.prototype.propMetadata = function (type) {
            var _this = this;
            var propMetadata = this.propertyCache.get(type);
            if (!propMetadata) {
                var classMetadata = this.getTypeMetadata(type);
                propMetadata = {};
                var parentType = this.findParentType(type, classMetadata);
                if (parentType) {
                    var parentPropMetadata_1 = this.propMetadata(parentType);
                    Object.keys(parentPropMetadata_1).forEach(function (parentProp) {
                        propMetadata[parentProp] = parentPropMetadata_1[parentProp];
                    });
                }
                var members_1 = classMetadata['members'] || {};
                Object.keys(members_1).forEach(function (propName) {
                    var propData = members_1[propName];
                    var prop = propData
                        .find(function (a) { return a['__symbolic'] == 'property' || a['__symbolic'] == 'method'; });
                    var decorators = [];
                    // hasOwnProperty() is used here to make sure we do not look up methods
                    // on `Object.prototype`.
                    if (propMetadata === null || propMetadata === void 0 ? void 0 : propMetadata.hasOwnProperty(propName)) {
                        decorators.push.apply(decorators, tslib_1.__spreadArray([], tslib_1.__read(propMetadata[propName])));
                    }
                    propMetadata[propName] = decorators;
                    if (prop && prop['decorators']) {
                        decorators.push.apply(decorators, tslib_1.__spreadArray([], tslib_1.__read(_this.simplify(type, prop['decorators']))));
                    }
                });
                this.propertyCache.set(type, propMetadata);
            }
            return propMetadata;
        };
        StaticReflector.prototype.parameters = function (type) {
            var _this = this;
            if (!(type instanceof static_symbol_1.StaticSymbol)) {
                this.reportError(new Error("parameters received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
                return [];
            }
            try {
                var parameters_1 = this.parameterCache.get(type);
                if (!parameters_1) {
                    var classMetadata = this.getTypeMetadata(type);
                    var parentType = this.findParentType(type, classMetadata);
                    var members = classMetadata ? classMetadata['members'] : null;
                    var ctorData = members ? members['__ctor__'] : null;
                    if (ctorData) {
                        var ctor = ctorData.find(function (a) { return a['__symbolic'] == 'constructor'; });
                        var rawParameterTypes = ctor['parameters'] || [];
                        var parameterDecorators_1 = this.simplify(type, ctor['parameterDecorators'] || []);
                        parameters_1 = [];
                        rawParameterTypes.forEach(function (rawParamType, index) {
                            var nestedResult = [];
                            var paramType = _this.trySimplify(type, rawParamType);
                            if (paramType)
                                nestedResult.push(paramType);
                            var decorators = parameterDecorators_1 ? parameterDecorators_1[index] : null;
                            if (decorators) {
                                nestedResult.push.apply(nestedResult, tslib_1.__spreadArray([], tslib_1.__read(decorators)));
                            }
                            parameters_1.push(nestedResult);
                        });
                    }
                    else if (parentType) {
                        parameters_1 = this.parameters(parentType);
                    }
                    if (!parameters_1) {
                        parameters_1 = [];
                    }
                    this.parameterCache.set(type, parameters_1);
                }
                return parameters_1;
            }
            catch (e) {
                console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
                throw e;
            }
        };
        StaticReflector.prototype._methodNames = function (type) {
            var methodNames = this.methodCache.get(type);
            if (!methodNames) {
                var classMetadata = this.getTypeMetadata(type);
                methodNames = {};
                var parentType = this.findParentType(type, classMetadata);
                if (parentType) {
                    var parentMethodNames_1 = this._methodNames(parentType);
                    Object.keys(parentMethodNames_1).forEach(function (parentProp) {
                        methodNames[parentProp] = parentMethodNames_1[parentProp];
                    });
                }
                var members_2 = classMetadata['members'] || {};
                Object.keys(members_2).forEach(function (propName) {
                    var propData = members_2[propName];
                    var isMethod = propData.some(function (a) { return a['__symbolic'] == 'method'; });
                    methodNames[propName] = methodNames[propName] || isMethod;
                });
                this.methodCache.set(type, methodNames);
            }
            return methodNames;
        };
        StaticReflector.prototype._staticMembers = function (type) {
            var staticMembers = this.staticCache.get(type);
            if (!staticMembers) {
                var classMetadata = this.getTypeMetadata(type);
                var staticMemberData = classMetadata['statics'] || {};
                staticMembers = Object.keys(staticMemberData);
                this.staticCache.set(type, staticMembers);
            }
            return staticMembers;
        };
        StaticReflector.prototype.findParentType = function (type, classMetadata) {
            var parentType = this.trySimplify(type, classMetadata['extends']);
            if (parentType instanceof static_symbol_1.StaticSymbol) {
                return parentType;
            }
        };
        StaticReflector.prototype.hasLifecycleHook = function (type, lcProperty) {
            if (!(type instanceof static_symbol_1.StaticSymbol)) {
                this.reportError(new Error("hasLifecycleHook received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
            }
            try {
                return !!this._methodNames(type)[lcProperty];
            }
            catch (e) {
                console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
                throw e;
            }
        };
        StaticReflector.prototype.guards = function (type) {
            var e_2, _a;
            if (!(type instanceof static_symbol_1.StaticSymbol)) {
                this.reportError(new Error("guards received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
                return {};
            }
            var staticMembers = this._staticMembers(type);
            var result = {};
            try {
                for (var staticMembers_1 = tslib_1.__values(staticMembers), staticMembers_1_1 = staticMembers_1.next(); !staticMembers_1_1.done; staticMembers_1_1 = staticMembers_1.next()) {
                    var name_1 = staticMembers_1_1.value;
                    if (name_1.endsWith(TYPEGUARD_POSTFIX)) {
                        var property = name_1.substr(0, name_1.length - TYPEGUARD_POSTFIX.length);
                        var value = void 0;
                        if (property.endsWith(USE_IF)) {
                            property = name_1.substr(0, property.length - USE_IF.length);
                            value = USE_IF;
                        }
                        else {
                            value = this.getStaticSymbol(type.filePath, type.name, [name_1]);
                        }
                        result[property] = value;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (staticMembers_1_1 && !staticMembers_1_1.done && (_a = staticMembers_1.return)) _a.call(staticMembers_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return result;
        };
        StaticReflector.prototype._registerDecoratorOrConstructor = function (type, ctor) {
            this.conversionMap.set(type, function (context, args) { return new (ctor.bind.apply(ctor, tslib_1.__spreadArray([void 0], tslib_1.__read(args))))(); });
        };
        StaticReflector.prototype._registerFunction = function (type, fn) {
            this.conversionMap.set(type, function (context, args) { return fn.apply(undefined, args); });
        };
        StaticReflector.prototype.initializeConversionMap = function () {
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Injectable'), core_1.createInjectable);
            this.injectionToken = this.findDeclaration(ANGULAR_CORE, 'InjectionToken');
            this.opaqueToken = this.findDeclaration(ANGULAR_CORE, 'OpaqueToken');
            this.ROUTES = this.tryFindDeclaration(ANGULAR_ROUTER, 'ROUTES');
            this.ANALYZE_FOR_ENTRY_COMPONENTS =
                this.findDeclaration(ANGULAR_CORE, 'ANALYZE_FOR_ENTRY_COMPONENTS');
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), core_1.createHost);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), core_1.createSelf);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), core_1.createSkipSelf);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Inject'), core_1.createInject);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), core_1.createOptional);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Attribute'), core_1.createAttribute);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChild'), core_1.createContentChild);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChildren'), core_1.createContentChildren);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChild'), core_1.createViewChild);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChildren'), core_1.createViewChildren);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Input'), core_1.createInput);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Output'), core_1.createOutput);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Pipe'), core_1.createPipe);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostBinding'), core_1.createHostBinding);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostListener'), core_1.createHostListener);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Directive'), core_1.createDirective);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Component'), core_1.createComponent);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'NgModule'), core_1.createNgModule);
            // Note: Some metadata classes can be used directly with Provider.deps.
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), core_1.createHost);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), core_1.createSelf);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), core_1.createSkipSelf);
            this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), core_1.createOptional);
        };
        /**
         * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
         * All types passed to the StaticResolver should be pseudo-types returned by this method.
         *
         * @param declarationFile the absolute path of the file where the symbol is declared
         * @param name the name of the type.
         */
        StaticReflector.prototype.getStaticSymbol = function (declarationFile, name, members) {
            return this.symbolResolver.getStaticSymbol(declarationFile, name, members);
        };
        /**
         * Simplify but discard any errors
         */
        StaticReflector.prototype.trySimplify = function (context, value) {
            var originalRecorder = this.errorRecorder;
            this.errorRecorder = function (error, fileName) { };
            var result = this.simplify(context, value);
            this.errorRecorder = originalRecorder;
            return result;
        };
        /** @internal */
        StaticReflector.prototype.simplify = function (context, value, lazy) {
            if (lazy === void 0) { lazy = false; }
            var self = this;
            var scope = BindingScope.empty;
            var calling = new Map();
            var rootContext = context;
            function simplifyInContext(context, value, depth, references) {
                function resolveReferenceValue(staticSymbol) {
                    var resolvedSymbol = self.symbolResolver.resolveSymbol(staticSymbol);
                    return resolvedSymbol ? resolvedSymbol.metadata : null;
                }
                function simplifyEagerly(value) {
                    return simplifyInContext(context, value, depth, 0);
                }
                function simplifyLazily(value) {
                    return simplifyInContext(context, value, depth, references + 1);
                }
                function simplifyNested(nestedContext, value) {
                    if (nestedContext === context) {
                        // If the context hasn't changed let the exception propagate unmodified.
                        return simplifyInContext(nestedContext, value, depth + 1, references);
                    }
                    try {
                        return simplifyInContext(nestedContext, value, depth + 1, references);
                    }
                    catch (e) {
                        if (isMetadataError(e)) {
                            // Propagate the message text up but add a message to the chain that explains how we got
                            // here.
                            // e.chain implies e.symbol
                            var summaryMsg = e.chain ? 'references \'' + e.symbol.name + '\'' : errorSummary(e);
                            var summary = "'" + nestedContext.name + "' " + summaryMsg;
                            var chain = { message: summary, position: e.position, next: e.chain };
                            // TODO(chuckj): retrieve the position information indirectly from the collectors node
                            // map if the metadata is from a .ts file.
                            self.error({
                                message: e.message,
                                advise: e.advise,
                                context: e.context,
                                chain: chain,
                                symbol: nestedContext
                            }, context);
                        }
                        else {
                            // It is probably an internal error.
                            throw e;
                        }
                    }
                }
                function simplifyCall(functionSymbol, targetFunction, args, targetExpression) {
                    if (targetFunction && targetFunction['__symbolic'] == 'function') {
                        if (calling.get(functionSymbol)) {
                            self.error({
                                message: 'Recursion is not supported',
                                summary: "called '" + functionSymbol.name + "' recursively",
                                value: targetFunction
                            }, functionSymbol);
                        }
                        try {
                            var value_1 = targetFunction['value'];
                            if (value_1 && (depth != 0 || value_1.__symbolic != 'error')) {
                                var parameters = targetFunction['parameters'];
                                var defaults = targetFunction.defaults;
                                args = args.map(function (arg) { return simplifyNested(context, arg); })
                                    .map(function (arg) { return shouldIgnore(arg) ? undefined : arg; });
                                if (defaults && defaults.length > args.length) {
                                    args.push.apply(args, tslib_1.__spreadArray([], tslib_1.__read(defaults.slice(args.length).map(function (value) { return simplify(value); }))));
                                }
                                calling.set(functionSymbol, true);
                                var functionScope = BindingScope.build();
                                for (var i = 0; i < parameters.length; i++) {
                                    functionScope.define(parameters[i], args[i]);
                                }
                                var oldScope = scope;
                                var result_1;
                                try {
                                    scope = functionScope.done();
                                    result_1 = simplifyNested(functionSymbol, value_1);
                                }
                                finally {
                                    scope = oldScope;
                                }
                                return result_1;
                            }
                        }
                        finally {
                            calling.delete(functionSymbol);
                        }
                    }
                    if (depth === 0) {
                        // If depth is 0 we are evaluating the top level expression that is describing element
                        // decorator. In this case, it is a decorator we don't understand, such as a custom
                        // non-angular decorator, and we should just ignore it.
                        return IGNORE;
                    }
                    var position = undefined;
                    if (targetExpression && targetExpression.__symbolic == 'resolved') {
                        var line = targetExpression.line;
                        var character = targetExpression.character;
                        var fileName = targetExpression.fileName;
                        if (fileName != null && line != null && character != null) {
                            position = { fileName: fileName, line: line, column: character };
                        }
                    }
                    self.error({
                        message: FUNCTION_CALL_NOT_SUPPORTED,
                        context: functionSymbol,
                        value: targetFunction,
                        position: position
                    }, context);
                }
                function simplify(expression) {
                    var e_3, _a, e_4, _b;
                    if (isPrimitive(expression)) {
                        return expression;
                    }
                    if (Array.isArray(expression)) {
                        var result_2 = [];
                        try {
                            for (var _c = tslib_1.__values(expression), _d = _c.next(); !_d.done; _d = _c.next()) {
                                var item = _d.value;
                                // Check for a spread expression
                                if (item && item.__symbolic === 'spread') {
                                    // We call with references as 0 because we require the actual value and cannot
                                    // tolerate a reference here.
                                    var spreadArray = simplifyEagerly(item.expression);
                                    if (Array.isArray(spreadArray)) {
                                        try {
                                            for (var spreadArray_1 = (e_4 = void 0, tslib_1.__values(spreadArray)), spreadArray_1_1 = spreadArray_1.next(); !spreadArray_1_1.done; spreadArray_1_1 = spreadArray_1.next()) {
                                                var spreadItem = spreadArray_1_1.value;
                                                result_2.push(spreadItem);
                                            }
                                        }
                                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                        finally {
                                            try {
                                                if (spreadArray_1_1 && !spreadArray_1_1.done && (_b = spreadArray_1.return)) _b.call(spreadArray_1);
                                            }
                                            finally { if (e_4) throw e_4.error; }
                                        }
                                        continue;
                                    }
                                }
                                var value_2 = simplify(item);
                                if (shouldIgnore(value_2)) {
                                    continue;
                                }
                                result_2.push(value_2);
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        return result_2;
                    }
                    if (expression instanceof static_symbol_1.StaticSymbol) {
                        // Stop simplification at builtin symbols or if we are in a reference context and
                        // the symbol doesn't have members.
                        if (expression === self.injectionToken || self.conversionMap.has(expression) ||
                            (references > 0 && !expression.members.length)) {
                            return expression;
                        }
                        else {
                            var staticSymbol = expression;
                            var declarationValue = resolveReferenceValue(staticSymbol);
                            if (declarationValue != null) {
                                return simplifyNested(staticSymbol, declarationValue);
                            }
                            else {
                                return staticSymbol;
                            }
                        }
                    }
                    if (expression) {
                        if (expression['__symbolic']) {
                            var staticSymbol = void 0;
                            switch (expression['__symbolic']) {
                                case 'binop':
                                    var left = simplify(expression['left']);
                                    if (shouldIgnore(left))
                                        return left;
                                    var right = simplify(expression['right']);
                                    if (shouldIgnore(right))
                                        return right;
                                    switch (expression['operator']) {
                                        case '&&':
                                            return left && right;
                                        case '||':
                                            return left || right;
                                        case '|':
                                            return left | right;
                                        case '^':
                                            return left ^ right;
                                        case '&':
                                            return left & right;
                                        case '==':
                                            return left == right;
                                        case '!=':
                                            return left != right;
                                        case '===':
                                            return left === right;
                                        case '!==':
                                            return left !== right;
                                        case '<':
                                            return left < right;
                                        case '>':
                                            return left > right;
                                        case '<=':
                                            return left <= right;
                                        case '>=':
                                            return left >= right;
                                        case '<<':
                                            return left << right;
                                        case '>>':
                                            return left >> right;
                                        case '+':
                                            return left + right;
                                        case '-':
                                            return left - right;
                                        case '*':
                                            return left * right;
                                        case '/':
                                            return left / right;
                                        case '%':
                                            return left % right;
                                        case '??':
                                            return left !== null && left !== void 0 ? left : right;
                                    }
                                    return null;
                                case 'if':
                                    var condition = simplify(expression['condition']);
                                    return condition ? simplify(expression['thenExpression']) :
                                        simplify(expression['elseExpression']);
                                case 'pre':
                                    var operand = simplify(expression['operand']);
                                    if (shouldIgnore(operand))
                                        return operand;
                                    switch (expression['operator']) {
                                        case '+':
                                            return operand;
                                        case '-':
                                            return -operand;
                                        case '!':
                                            return !operand;
                                        case '~':
                                            return ~operand;
                                    }
                                    return null;
                                case 'index':
                                    var indexTarget = simplifyEagerly(expression['expression']);
                                    var index = simplifyEagerly(expression['index']);
                                    if (indexTarget && isPrimitive(index))
                                        return indexTarget[index];
                                    return null;
                                case 'select':
                                    var member = expression['member'];
                                    var selectContext = context;
                                    var selectTarget = simplify(expression['expression']);
                                    if (selectTarget instanceof static_symbol_1.StaticSymbol) {
                                        var members = selectTarget.members.concat(member);
                                        selectContext =
                                            self.getStaticSymbol(selectTarget.filePath, selectTarget.name, members);
                                        var declarationValue = resolveReferenceValue(selectContext);
                                        if (declarationValue != null) {
                                            return simplifyNested(selectContext, declarationValue);
                                        }
                                        else {
                                            return selectContext;
                                        }
                                    }
                                    if (selectTarget && isPrimitive(member))
                                        return simplifyNested(selectContext, selectTarget[member]);
                                    return null;
                                case 'reference':
                                    // Note: This only has to deal with variable references, as symbol references have
                                    // been converted into 'resolved'
                                    // in the StaticSymbolResolver.
                                    var name_2 = expression['name'];
                                    var localValue = scope.resolve(name_2);
                                    if (localValue != BindingScope.missing) {
                                        return localValue;
                                    }
                                    break;
                                case 'resolved':
                                    try {
                                        return simplify(expression.symbol);
                                    }
                                    catch (e) {
                                        // If an error is reported evaluating the symbol record the position of the
                                        // reference in the error so it can
                                        // be reported in the error message generated from the exception.
                                        if (isMetadataError(e) && expression.fileName != null &&
                                            expression.line != null && expression.character != null) {
                                            e.position = {
                                                fileName: expression.fileName,
                                                line: expression.line,
                                                column: expression.character
                                            };
                                        }
                                        throw e;
                                    }
                                case 'class':
                                    return context;
                                case 'function':
                                    return context;
                                case 'new':
                                case 'call':
                                    // Determine if the function is a built-in conversion
                                    staticSymbol = simplifyInContext(context, expression['expression'], depth + 1, /* references */ 0);
                                    if (staticSymbol instanceof static_symbol_1.StaticSymbol) {
                                        if (staticSymbol === self.injectionToken || staticSymbol === self.opaqueToken) {
                                            // if somebody calls new InjectionToken, don't create an InjectionToken,
                                            // but rather return the symbol to which the InjectionToken is assigned to.
                                            // OpaqueToken is supported too as it is required by the language service to
                                            // support v4 and prior versions of Angular.
                                            return context;
                                        }
                                        var argExpressions = expression['arguments'] || [];
                                        var converter = self.conversionMap.get(staticSymbol);
                                        if (converter) {
                                            var args = argExpressions.map(function (arg) { return simplifyNested(context, arg); })
                                                .map(function (arg) { return shouldIgnore(arg) ? undefined : arg; });
                                            return converter(context, args);
                                        }
                                        else {
                                            // Determine if the function is one we can simplify.
                                            var targetFunction = resolveReferenceValue(staticSymbol);
                                            return simplifyCall(staticSymbol, targetFunction, argExpressions, expression['expression']);
                                        }
                                    }
                                    return IGNORE;
                                case 'error':
                                    var message = expression.message;
                                    if (expression['line'] != null) {
                                        self.error({
                                            message: message,
                                            context: expression.context,
                                            value: expression,
                                            position: {
                                                fileName: expression['fileName'],
                                                line: expression['line'],
                                                column: expression['character']
                                            }
                                        }, context);
                                    }
                                    else {
                                        self.error({ message: message, context: expression.context }, context);
                                    }
                                    return IGNORE;
                                case 'ignore':
                                    return expression;
                            }
                            return null;
                        }
                        return mapStringMap(expression, function (value, name) {
                            if (REFERENCE_SET.has(name)) {
                                if (name === USE_VALUE && PROVIDE in expression) {
                                    // If this is a provider expression, check for special tokens that need the value
                                    // during analysis.
                                    var provide = simplify(expression.provide);
                                    if (provide === self.ROUTES || provide == self.ANALYZE_FOR_ENTRY_COMPONENTS) {
                                        return simplify(value);
                                    }
                                }
                                return simplifyLazily(value);
                            }
                            return simplify(value);
                        });
                    }
                    return IGNORE;
                }
                return simplify(value);
            }
            var result;
            try {
                result = simplifyInContext(context, value, 0, lazy ? 1 : 0);
            }
            catch (e) {
                if (this.errorRecorder) {
                    this.reportError(e, context);
                }
                else {
                    throw formatMetadataError(e, context);
                }
            }
            if (shouldIgnore(result)) {
                return undefined;
            }
            return result;
        };
        StaticReflector.prototype.getTypeMetadata = function (type) {
            var resolvedSymbol = this.symbolResolver.resolveSymbol(type);
            return resolvedSymbol && resolvedSymbol.metadata ? resolvedSymbol.metadata :
                { __symbolic: 'class' };
        };
        StaticReflector.prototype.reportError = function (error, context, path) {
            if (this.errorRecorder) {
                this.errorRecorder(formatMetadataError(error, context), (context && context.filePath) || path);
            }
            else {
                throw error;
            }
        };
        StaticReflector.prototype.error = function (_a, reportingContext) {
            var message = _a.message, summary = _a.summary, advise = _a.advise, position = _a.position, context = _a.context, value = _a.value, symbol = _a.symbol, chain = _a.chain;
            this.reportError(metadataError(message, summary, advise, position, symbol, context, chain), reportingContext);
        };
        return StaticReflector;
    }());
    exports.StaticReflector = StaticReflector;
    var METADATA_ERROR = 'ngMetadataError';
    function metadataError(message, summary, advise, position, symbol, context, chain) {
        var error = util_1.syntaxError(message);
        error[METADATA_ERROR] = true;
        if (advise)
            error.advise = advise;
        if (position)
            error.position = position;
        if (summary)
            error.summary = summary;
        if (context)
            error.context = context;
        if (chain)
            error.chain = chain;
        if (symbol)
            error.symbol = symbol;
        return error;
    }
    function isMetadataError(error) {
        return !!error[METADATA_ERROR];
    }
    var REFERENCE_TO_NONEXPORTED_CLASS = 'Reference to non-exported class';
    var VARIABLE_NOT_INITIALIZED = 'Variable not initialized';
    var DESTRUCTURE_NOT_SUPPORTED = 'Destructuring not supported';
    var COULD_NOT_RESOLVE_TYPE = 'Could not resolve type';
    var FUNCTION_CALL_NOT_SUPPORTED = 'Function call not supported';
    var REFERENCE_TO_LOCAL_SYMBOL = 'Reference to a local symbol';
    var LAMBDA_NOT_SUPPORTED = 'Lambda not supported';
    function expandedMessage(message, context) {
        switch (message) {
            case REFERENCE_TO_NONEXPORTED_CLASS:
                if (context && context.className) {
                    return "References to a non-exported class are not supported in decorators but " + context.className + " was referenced.";
                }
                break;
            case VARIABLE_NOT_INITIALIZED:
                return 'Only initialized variables and constants can be referenced in decorators because the value of this variable is needed by the template compiler';
            case DESTRUCTURE_NOT_SUPPORTED:
                return 'Referencing an exported destructured variable or constant is not supported in decorators and this value is needed by the template compiler';
            case COULD_NOT_RESOLVE_TYPE:
                if (context && context.typeName) {
                    return "Could not resolve type " + context.typeName;
                }
                break;
            case FUNCTION_CALL_NOT_SUPPORTED:
                if (context && context.name) {
                    return "Function calls are not supported in decorators but '" + context.name + "' was called";
                }
                return 'Function calls are not supported in decorators';
            case REFERENCE_TO_LOCAL_SYMBOL:
                if (context && context.name) {
                    return "Reference to a local (non-exported) symbols are not supported in decorators but '" + context.name + "' was referenced";
                }
                break;
            case LAMBDA_NOT_SUPPORTED:
                return "Function expressions are not supported in decorators";
        }
        return message;
    }
    function messageAdvise(message, context) {
        switch (message) {
            case REFERENCE_TO_NONEXPORTED_CLASS:
                if (context && context.className) {
                    return "Consider exporting '" + context.className + "'";
                }
                break;
            case DESTRUCTURE_NOT_SUPPORTED:
                return 'Consider simplifying to avoid destructuring';
            case REFERENCE_TO_LOCAL_SYMBOL:
                if (context && context.name) {
                    return "Consider exporting '" + context.name + "'";
                }
                break;
            case LAMBDA_NOT_SUPPORTED:
                return "Consider changing the function expression into an exported function";
        }
        return undefined;
    }
    function errorSummary(error) {
        if (error.summary) {
            return error.summary;
        }
        switch (error.message) {
            case REFERENCE_TO_NONEXPORTED_CLASS:
                if (error.context && error.context.className) {
                    return "references non-exported class " + error.context.className;
                }
                break;
            case VARIABLE_NOT_INITIALIZED:
                return 'is not initialized';
            case DESTRUCTURE_NOT_SUPPORTED:
                return 'is a destructured variable';
            case COULD_NOT_RESOLVE_TYPE:
                return 'could not be resolved';
            case FUNCTION_CALL_NOT_SUPPORTED:
                if (error.context && error.context.name) {
                    return "calls '" + error.context.name + "'";
                }
                return "calls a function";
            case REFERENCE_TO_LOCAL_SYMBOL:
                if (error.context && error.context.name) {
                    return "references local variable " + error.context.name;
                }
                return "references a local variable";
        }
        return 'contains the error';
    }
    function mapStringMap(input, transform) {
        if (!input)
            return {};
        var result = {};
        Object.keys(input).forEach(function (key) {
            var value = transform(input[key], key);
            if (!shouldIgnore(value)) {
                if (HIDDEN_KEY.test(key)) {
                    Object.defineProperty(result, key, { enumerable: false, configurable: true, value: value });
                }
                else {
                    result[key] = value;
                }
            }
        });
        return result;
    }
    function isPrimitive(o) {
        return o === null || (typeof o !== 'function' && typeof o !== 'object');
    }
    var BindingScope = /** @class */ (function () {
        function BindingScope() {
        }
        BindingScope.build = function () {
            var current = new Map();
            return {
                define: function (name, value) {
                    current.set(name, value);
                    return this;
                },
                done: function () {
                    return current.size > 0 ? new PopulatedScope(current) : BindingScope.empty;
                }
            };
        };
        BindingScope.missing = {};
        BindingScope.empty = { resolve: function (name) { return BindingScope.missing; } };
        return BindingScope;
    }());
    var PopulatedScope = /** @class */ (function (_super) {
        tslib_1.__extends(PopulatedScope, _super);
        function PopulatedScope(bindings) {
            var _this = _super.call(this) || this;
            _this.bindings = bindings;
            return _this;
        }
        PopulatedScope.prototype.resolve = function (name) {
            return this.bindings.has(name) ? this.bindings.get(name) : BindingScope.missing;
        };
        return PopulatedScope;
    }(BindingScope));
    function formatMetadataMessageChain(chain, advise) {
        var expanded = expandedMessage(chain.message, chain.context);
        var nesting = chain.symbol ? " in '" + chain.symbol.name + "'" : '';
        var message = "" + expanded + nesting;
        var position = chain.position;
        var next = chain.next ?
            formatMetadataMessageChain(chain.next, advise) :
            advise ? { message: advise } : undefined;
        return { message: message, position: position, next: next ? [next] : undefined };
    }
    function formatMetadataError(e, context) {
        if (isMetadataError(e)) {
            // Produce a formatted version of the and leaving enough information in the original error
            // to recover the formatting information to eventually produce a diagnostic error message.
            var position = e.position;
            var chain = {
                message: "Error during template compile of '" + context.name + "'",
                position: position,
                next: { message: e.message, next: e.chain, context: e.context, symbol: e.symbol }
            };
            var advise = e.advise || messageAdvise(e.message, e.context);
            return formatted_error_1.formattedError(formatMetadataMessageChain(chain, advise));
        }
        return e;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3JlZmxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hb3Qvc3RhdGljX3JlZmxlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsMkVBQXVEO0lBRXZELG1EQUFpVztJQUdqVyxtREFBb0M7SUFFcEMsNkVBQXdFO0lBQ3hFLHlFQUE2QztJQUc3QyxJQUFNLFlBQVksR0FBRyxlQUFlLENBQUM7SUFDckMsSUFBTSxjQUFjLEdBQUcsaUJBQWlCLENBQUM7SUFFekMsSUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBRTlCLElBQU0sTUFBTSxHQUFHO1FBQ2IsVUFBVSxFQUFFLFFBQVE7S0FDckIsQ0FBQztJQUVGLElBQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQztJQUM3QixJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7SUFDMUIsSUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUN2RixJQUFNLGlCQUFpQixHQUFHLFdBQVcsQ0FBQztJQUN0QyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7SUFFdkIsU0FBUyxZQUFZLENBQUMsS0FBVTtRQUM5QixPQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0g7UUFvQkUseUJBQ1ksZUFBOEMsRUFDOUMsY0FBb0MsRUFDNUMsb0JBQXdFLEVBQ3hFLHNCQUF3RSxFQUNoRSxhQUF1RDtZQUxuRSxpQkFtQkM7WUFoQkcscUNBQUEsRUFBQSx5QkFBd0U7WUFDeEUsdUNBQUEsRUFBQSwyQkFBd0U7WUFIaEUsb0JBQWUsR0FBZixlQUFlLENBQStCO1lBQzlDLG1CQUFj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QyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0QsT0FBTyxnQ0FBYyxDQUFDLDBCQUEwQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2xFO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcGlsZVN1bW1hcnlLaW5kfSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCB7Q29tcGlsZVJlZmxlY3Rvcn0gZnJvbSAnLi4vY29tcGlsZV9yZWZsZWN0b3InO1xuaW1wb3J0IHtjcmVhdGVBdHRyaWJ1dGUsIGNyZWF0ZUNvbXBvbmVudCwgY3JlYXRlQ29udGVudENoaWxkLCBjcmVhdGVDb250ZW50Q2hpbGRyZW4sIGNyZWF0ZURpcmVjdGl2ZSwgY3JlYXRlSG9zdCwgY3JlYXRlSG9zdEJpbmRpbmcsIGNyZWF0ZUhvc3RMaXN0ZW5lciwgY3JlYXRlSW5qZWN0LCBjcmVhdGVJbmplY3RhYmxlLCBjcmVhdGVJbnB1dCwgY3JlYXRlTmdNb2R1bGUsIGNyZWF0ZU9wdGlvbmFsLCBjcmVhdGVPdXRwdXQsIGNyZWF0ZVBpcGUsIGNyZWF0ZVNlbGYsIGNyZWF0ZVNraXBTZWxmLCBjcmVhdGVWaWV3Q2hpbGQsIGNyZWF0ZVZpZXdDaGlsZHJlbiwgTWV0YWRhdGFGYWN0b3J5fSBmcm9tICcuLi9jb3JlJztcbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtTdW1tYXJ5UmVzb2x2ZXJ9IGZyb20gJy4uL3N1bW1hcnlfcmVzb2x2ZXInO1xuaW1wb3J0IHtzeW50YXhFcnJvcn0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7Zm9ybWF0dGVkRXJyb3IsIEZvcm1hdHRlZE1lc3NhZ2VDaGFpbn0gZnJvbSAnLi9mb3JtYXR0ZWRfZXJyb3InO1xuaW1wb3J0IHtTdGF0aWNTeW1ib2x9IGZyb20gJy4vc3RhdGljX3N5bWJvbCc7XG5pbXBvcnQge1N0YXRpY1N5bWJvbFJlc29sdmVyfSBmcm9tICcuL3N0YXRpY19zeW1ib2xfcmVzb2x2ZXInO1xuXG5jb25zdCBBTkdVTEFSX0NPUkUgPSAnQGFuZ3VsYXIvY29yZSc7XG5jb25zdCBBTkdVTEFSX1JPVVRFUiA9ICdAYW5ndWxhci9yb3V0ZXInO1xuXG5jb25zdCBISURERU5fS0VZID0gL15cXCQuKlxcJCQvO1xuXG5jb25zdCBJR05PUkUgPSB7XG4gIF9fc3ltYm9saWM6ICdpZ25vcmUnXG59O1xuXG5jb25zdCBVU0VfVkFMVUUgPSAndXNlVmFsdWUnO1xuY29uc3QgUFJPVklERSA9ICdwcm92aWRlJztcbmNvbnN0IFJFRkVSRU5DRV9TRVQgPSBuZXcgU2V0KFtVU0VfVkFMVUUsICd1c2VGYWN0b3J5JywgJ2RhdGEnLCAnaWQnLCAnbG9hZENoaWxkcmVuJ10pO1xuY29uc3QgVFlQRUdVQVJEX1BPU1RGSVggPSAnVHlwZUd1YXJkJztcbmNvbnN0IFVTRV9JRiA9ICdVc2VJZic7XG5cbmZ1bmN0aW9uIHNob3VsZElnbm9yZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS5fX3N5bWJvbGljID09ICdpZ25vcmUnO1xufVxuXG4vKipcbiAqIEEgc3RhdGljIHJlZmxlY3RvciBpbXBsZW1lbnRzIGVub3VnaCBvZiB0aGUgUmVmbGVjdG9yIEFQSSB0aGF0IGlzIG5lY2Vzc2FyeSB0byBjb21waWxlXG4gKiB0ZW1wbGF0ZXMgc3RhdGljYWxseS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRpY1JlZmxlY3RvciBpbXBsZW1lbnRzIENvbXBpbGVSZWZsZWN0b3Ige1xuICBwcml2YXRlIGFubm90YXRpb25DYWNoZSA9IG5ldyBNYXA8U3RhdGljU3ltYm9sLCBhbnlbXT4oKTtcbiAgcHJpdmF0ZSBzaGFsbG93QW5ub3RhdGlvbkNhY2hlID0gbmV3IE1hcDxTdGF0aWNTeW1ib2wsIGFueVtdPigpO1xuICBwcml2YXRlIHByb3BlcnR5Q2FjaGUgPSBuZXcgTWFwPFN0YXRpY1N5bWJvbCwge1trZXk6IHN0cmluZ106IGFueVtdfT4oKTtcbiAgcHJpdmF0ZSBwYXJhbWV0ZXJDYWNoZSA9IG5ldyBNYXA8U3RhdGljU3ltYm9sLCBhbnlbXT4oKTtcbiAgcHJpdmF0ZSBtZXRob2RDYWNoZSA9IG5ldyBNYXA8U3RhdGljU3ltYm9sLCB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0+KCk7XG4gIHByaXZhdGUgc3RhdGljQ2FjaGUgPSBuZXcgTWFwPFN0YXRpY1N5bWJvbCwgc3RyaW5nW10+KCk7XG4gIHByaXZhdGUgY29udmVyc2lvbk1hcCA9IG5ldyBNYXA8U3RhdGljU3ltYm9sLCAoY29udGV4dDogU3RhdGljU3ltYm9sLCBhcmdzOiBhbnlbXSkgPT4gYW55PigpO1xuICBwcml2YXRlIHJlc29sdmVkRXh0ZXJuYWxSZWZlcmVuY2VzID0gbmV3IE1hcDxzdHJpbmcsIFN0YXRpY1N5bWJvbD4oKTtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgaW5qZWN0aW9uVG9rZW4hOiBTdGF0aWNTeW1ib2w7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIG9wYXF1ZVRva2VuITogU3RhdGljU3ltYm9sO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgUk9VVEVTITogU3RhdGljU3ltYm9sO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBBTkFMWVpFX0ZPUl9FTlRSWV9DT01QT05FTlRTITogU3RhdGljU3ltYm9sO1xuICBwcml2YXRlIGFubm90YXRpb25Gb3JQYXJlbnRDbGFzc1dpdGhTdW1tYXJ5S2luZCA9XG4gICAgICBuZXcgTWFwPENvbXBpbGVTdW1tYXJ5S2luZCwgTWV0YWRhdGFGYWN0b3J5PGFueT5bXT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgc3VtbWFyeVJlc29sdmVyOiBTdW1tYXJ5UmVzb2x2ZXI8U3RhdGljU3ltYm9sPixcbiAgICAgIHByaXZhdGUgc3ltYm9sUmVzb2x2ZXI6IFN0YXRpY1N5bWJvbFJlc29sdmVyLFxuICAgICAga25vd25NZXRhZGF0YUNsYXNzZXM6IHtuYW1lOiBzdHJpbmcsIGZpbGVQYXRoOiBzdHJpbmcsIGN0b3I6IGFueX1bXSA9IFtdLFxuICAgICAga25vd25NZXRhZGF0YUZ1bmN0aW9uczoge25hbWU6IHN0cmluZywgZmlsZVBhdGg6IHN0cmluZywgZm46IGFueX1bXSA9IFtdLFxuICAgICAgcHJpdmF0ZSBlcnJvclJlY29yZGVyPzogKGVycm9yOiBhbnksIGZpbGVOYW1lPzogc3RyaW5nKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5pbml0aWFsaXplQ29udmVyc2lvbk1hcCgpO1xuICAgIGtub3duTWV0YWRhdGFDbGFzc2VzLmZvckVhY2goXG4gICAgICAgIChrYykgPT4gdGhpcy5fcmVnaXN0ZXJEZWNvcmF0b3JPckNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgdGhpcy5nZXRTdGF0aWNTeW1ib2woa2MuZmlsZVBhdGgsIGtjLm5hbWUpLCBrYy5jdG9yKSk7XG4gICAga25vd25NZXRhZGF0YUZ1bmN0aW9ucy5mb3JFYWNoKFxuICAgICAgICAoa2YpID0+IHRoaXMuX3JlZ2lzdGVyRnVuY3Rpb24odGhpcy5nZXRTdGF0aWNTeW1ib2woa2YuZmlsZVBhdGgsIGtmLm5hbWUpLCBrZi5mbikpO1xuICAgIHRoaXMuYW5ub3RhdGlvbkZvclBhcmVudENsYXNzV2l0aFN1bW1hcnlLaW5kLnNldChcbiAgICAgICAgQ29tcGlsZVN1bW1hcnlLaW5kLkRpcmVjdGl2ZSwgW2NyZWF0ZURpcmVjdGl2ZSwgY3JlYXRlQ29tcG9uZW50XSk7XG4gICAgdGhpcy5hbm5vdGF0aW9uRm9yUGFyZW50Q2xhc3NXaXRoU3VtbWFyeUtpbmQuc2V0KENvbXBpbGVTdW1tYXJ5S2luZC5QaXBlLCBbY3JlYXRlUGlwZV0pO1xuICAgIHRoaXMuYW5ub3RhdGlvbkZvclBhcmVudENsYXNzV2l0aFN1bW1hcnlLaW5kLnNldChDb21waWxlU3VtbWFyeUtpbmQuTmdNb2R1bGUsIFtjcmVhdGVOZ01vZHVsZV0pO1xuICAgIHRoaXMuYW5ub3RhdGlvbkZvclBhcmVudENsYXNzV2l0aFN1bW1hcnlLaW5kLnNldChcbiAgICAgICAgQ29tcGlsZVN1bW1hcnlLaW5kLkluamVjdGFibGUsXG4gICAgICAgIFtjcmVhdGVJbmplY3RhYmxlLCBjcmVhdGVQaXBlLCBjcmVhdGVEaXJlY3RpdmUsIGNyZWF0ZUNvbXBvbmVudCwgY3JlYXRlTmdNb2R1bGVdKTtcbiAgfVxuXG4gIGNvbXBvbmVudE1vZHVsZVVybCh0eXBlT3JGdW5jOiBTdGF0aWNTeW1ib2wpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YXRpY1N5bWJvbCA9IHRoaXMuZmluZFN5bWJvbERlY2xhcmF0aW9uKHR5cGVPckZ1bmMpO1xuICAgIHJldHVybiB0aGlzLnN5bWJvbFJlc29sdmVyLmdldFJlc291cmNlUGF0aChzdGF0aWNTeW1ib2wpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludmFsaWRhdGUgdGhlIHNwZWNpZmllZCBgc3ltYm9sc2Agb24gcHJvZ3JhbSBjaGFuZ2UuXG4gICAqIEBwYXJhbSBzeW1ib2xzXG4gICAqL1xuICBpbnZhbGlkYXRlU3ltYm9scyhzeW1ib2xzOiBTdGF0aWNTeW1ib2xbXSkge1xuICAgIGZvciAoY29uc3Qgc3ltYm9sIG9mIHN5bWJvbHMpIHtcbiAgICAgIHRoaXMuYW5ub3RhdGlvbkNhY2hlLmRlbGV0ZShzeW1ib2wpO1xuICAgICAgdGhpcy5zaGFsbG93QW5ub3RhdGlvbkNhY2hlLmRlbGV0ZShzeW1ib2wpO1xuICAgICAgdGhpcy5wcm9wZXJ0eUNhY2hlLmRlbGV0ZShzeW1ib2wpO1xuICAgICAgdGhpcy5wYXJhbWV0ZXJDYWNoZS5kZWxldGUoc3ltYm9sKTtcbiAgICAgIHRoaXMubWV0aG9kQ2FjaGUuZGVsZXRlKHN5bWJvbCk7XG4gICAgICB0aGlzLnN0YXRpY0NhY2hlLmRlbGV0ZShzeW1ib2wpO1xuICAgICAgdGhpcy5jb252ZXJzaW9uTWFwLmRlbGV0ZShzeW1ib2wpO1xuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVFeHRlcm5hbFJlZmVyZW5jZShyZWY6IG8uRXh0ZXJuYWxSZWZlcmVuY2UsIGNvbnRhaW5pbmdGaWxlPzogc3RyaW5nKTogU3RhdGljU3ltYm9sIHtcbiAgICBsZXQga2V5OiBzdHJpbmd8dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGlmICghY29udGFpbmluZ0ZpbGUpIHtcbiAgICAgIGtleSA9IGAke3JlZi5tb2R1bGVOYW1lfToke3JlZi5uYW1lfWA7XG4gICAgICBjb25zdCBkZWNsYXJhdGlvblN5bWJvbCA9IHRoaXMucmVzb2x2ZWRFeHRlcm5hbFJlZmVyZW5jZXMuZ2V0KGtleSk7XG4gICAgICBpZiAoZGVjbGFyYXRpb25TeW1ib2wpIHJldHVybiBkZWNsYXJhdGlvblN5bWJvbDtcbiAgICB9XG4gICAgY29uc3QgcmVmU3ltYm9sID1cbiAgICAgICAgdGhpcy5zeW1ib2xSZXNvbHZlci5nZXRTeW1ib2xCeU1vZHVsZShyZWYubW9kdWxlTmFtZSEsIHJlZi5uYW1lISwgY29udGFpbmluZ0ZpbGUpO1xuICAgIGNvbnN0IGRlY2xhcmF0aW9uU3ltYm9sID0gdGhpcy5maW5kU3ltYm9sRGVjbGFyYXRpb24ocmVmU3ltYm9sKTtcbiAgICBpZiAoIWNvbnRhaW5pbmdGaWxlKSB7XG4gICAgICB0aGlzLnN5bWJvbFJlc29sdmVyLnJlY29yZE1vZHVsZU5hbWVGb3JGaWxlTmFtZShyZWZTeW1ib2wuZmlsZVBhdGgsIHJlZi5tb2R1bGVOYW1lISk7XG4gICAgICB0aGlzLnN5bWJvbFJlc29sdmVyLnJlY29yZEltcG9ydEFzKGRlY2xhcmF0aW9uU3ltYm9sLCByZWZTeW1ib2wpO1xuICAgIH1cbiAgICBpZiAoa2V5KSB7XG4gICAgICB0aGlzLnJlc29sdmVkRXh0ZXJuYWxSZWZlcmVuY2VzLnNldChrZXksIGRlY2xhcmF0aW9uU3ltYm9sKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlY2xhcmF0aW9uU3ltYm9sO1xuICB9XG5cbiAgZmluZERlY2xhcmF0aW9uKG1vZHVsZVVybDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGNvbnRhaW5pbmdGaWxlPzogc3RyaW5nKTogU3RhdGljU3ltYm9sIHtcbiAgICByZXR1cm4gdGhpcy5maW5kU3ltYm9sRGVjbGFyYXRpb24oXG4gICAgICAgIHRoaXMuc3ltYm9sUmVzb2x2ZXIuZ2V0U3ltYm9sQnlNb2R1bGUobW9kdWxlVXJsLCBuYW1lLCBjb250YWluaW5nRmlsZSkpO1xuICB9XG5cbiAgdHJ5RmluZERlY2xhcmF0aW9uKG1vZHVsZVVybDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGNvbnRhaW5pbmdGaWxlPzogc3RyaW5nKTogU3RhdGljU3ltYm9sIHtcbiAgICByZXR1cm4gdGhpcy5zeW1ib2xSZXNvbHZlci5pZ25vcmVFcnJvcnNGb3IoXG4gICAgICAgICgpID0+IHRoaXMuZmluZERlY2xhcmF0aW9uKG1vZHVsZVVybCwgbmFtZSwgY29udGFpbmluZ0ZpbGUpKTtcbiAgfVxuXG4gIGZpbmRTeW1ib2xEZWNsYXJhdGlvbihzeW1ib2w6IFN0YXRpY1N5bWJvbCk6IFN0YXRpY1N5bWJvbCB7XG4gICAgY29uc3QgcmVzb2x2ZWRTeW1ib2wgPSB0aGlzLnN5bWJvbFJlc29sdmVyLnJlc29sdmVTeW1ib2woc3ltYm9sKTtcbiAgICBpZiAocmVzb2x2ZWRTeW1ib2wpIHtcbiAgICAgIGxldCByZXNvbHZlZE1ldGFkYXRhID0gcmVzb2x2ZWRTeW1ib2wubWV0YWRhdGE7XG4gICAgICBpZiAocmVzb2x2ZWRNZXRhZGF0YSAmJiByZXNvbHZlZE1ldGFkYXRhLl9fc3ltYm9saWMgPT09ICdyZXNvbHZlZCcpIHtcbiAgICAgICAgcmVzb2x2ZWRNZXRhZGF0YSA9IHJlc29sdmVkTWV0YWRhdGEuc3ltYm9sO1xuICAgICAgfVxuICAgICAgaWYgKHJlc29sdmVkTWV0YWRhdGEgaW5zdGFuY2VvZiBTdGF0aWNTeW1ib2wpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFN5bWJvbERlY2xhcmF0aW9uKHJlc29sdmVkU3ltYm9sLm1ldGFkYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN5bWJvbDtcbiAgfVxuXG4gIHB1YmxpYyB0cnlBbm5vdGF0aW9ucyh0eXBlOiBTdGF0aWNTeW1ib2wpOiBhbnlbXSB7XG4gICAgY29uc3Qgb3JpZ2luYWxSZWNvcmRlciA9IHRoaXMuZXJyb3JSZWNvcmRlcjtcbiAgICB0aGlzLmVycm9yUmVjb3JkZXIgPSAoZXJyb3I6IGFueSwgZmlsZU5hbWU/OiBzdHJpbmcpID0+IHt9O1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5hbm5vdGF0aW9ucyh0eXBlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5lcnJvclJlY29yZGVyID0gb3JpZ2luYWxSZWNvcmRlcjtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYW5ub3RhdGlvbnModHlwZTogU3RhdGljU3ltYm9sKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLl9hbm5vdGF0aW9ucyhcbiAgICAgICAgdHlwZSwgKHR5cGU6IFN0YXRpY1N5bWJvbCwgZGVjb3JhdG9yczogYW55KSA9PiB0aGlzLnNpbXBsaWZ5KHR5cGUsIGRlY29yYXRvcnMpLFxuICAgICAgICB0aGlzLmFubm90YXRpb25DYWNoZSk7XG4gIH1cblxuICBwdWJsaWMgc2hhbGxvd0Fubm90YXRpb25zKHR5cGU6IFN0YXRpY1N5bWJvbCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5fYW5ub3RhdGlvbnMoXG4gICAgICAgIHR5cGUsICh0eXBlOiBTdGF0aWNTeW1ib2wsIGRlY29yYXRvcnM6IGFueSkgPT4gdGhpcy5zaW1wbGlmeSh0eXBlLCBkZWNvcmF0b3JzLCB0cnVlKSxcbiAgICAgICAgdGhpcy5zaGFsbG93QW5ub3RhdGlvbkNhY2hlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fubm90YXRpb25zKFxuICAgICAgdHlwZTogU3RhdGljU3ltYm9sLCBzaW1wbGlmeTogKHR5cGU6IFN0YXRpY1N5bWJvbCwgZGVjb3JhdG9yczogYW55KSA9PiBhbnksXG4gICAgICBhbm5vdGF0aW9uQ2FjaGU6IE1hcDxTdGF0aWNTeW1ib2wsIGFueVtdPik6IGFueVtdIHtcbiAgICBsZXQgYW5ub3RhdGlvbnMgPSBhbm5vdGF0aW9uQ2FjaGUuZ2V0KHR5cGUpO1xuICAgIGlmICghYW5ub3RhdGlvbnMpIHtcbiAgICAgIGFubm90YXRpb25zID0gW107XG4gICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gdGhpcy5nZXRUeXBlTWV0YWRhdGEodHlwZSk7XG4gICAgICBjb25zdCBwYXJlbnRUeXBlID0gdGhpcy5maW5kUGFyZW50VHlwZSh0eXBlLCBjbGFzc01ldGFkYXRhKTtcbiAgICAgIGlmIChwYXJlbnRUeXBlKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudEFubm90YXRpb25zID0gdGhpcy5hbm5vdGF0aW9ucyhwYXJlbnRUeXBlKTtcbiAgICAgICAgYW5ub3RhdGlvbnMucHVzaCguLi5wYXJlbnRBbm5vdGF0aW9ucyk7XG4gICAgICB9XG4gICAgICBsZXQgb3duQW5ub3RhdGlvbnM6IGFueVtdID0gW107XG4gICAgICBpZiAoY2xhc3NNZXRhZGF0YVsnZGVjb3JhdG9ycyddKSB7XG4gICAgICAgIG93bkFubm90YXRpb25zID0gc2ltcGxpZnkodHlwZSwgY2xhc3NNZXRhZGF0YVsnZGVjb3JhdG9ycyddKTtcbiAgICAgICAgaWYgKG93bkFubm90YXRpb25zKSB7XG4gICAgICAgICAgYW5ub3RhdGlvbnMucHVzaCguLi5vd25Bbm5vdGF0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwYXJlbnRUeXBlICYmICF0aGlzLnN1bW1hcnlSZXNvbHZlci5pc0xpYnJhcnlGaWxlKHR5cGUuZmlsZVBhdGgpICYmXG4gICAgICAgICAgdGhpcy5zdW1tYXJ5UmVzb2x2ZXIuaXNMaWJyYXJ5RmlsZShwYXJlbnRUeXBlLmZpbGVQYXRoKSkge1xuICAgICAgICBjb25zdCBzdW1tYXJ5ID0gdGhpcy5zdW1tYXJ5UmVzb2x2ZXIucmVzb2x2ZVN1bW1hcnkocGFyZW50VHlwZSk7XG4gICAgICAgIGlmIChzdW1tYXJ5ICYmIHN1bW1hcnkudHlwZSkge1xuICAgICAgICAgIGNvbnN0IHJlcXVpcmVkQW5ub3RhdGlvblR5cGVzID1cbiAgICAgICAgICAgICAgdGhpcy5hbm5vdGF0aW9uRm9yUGFyZW50Q2xhc3NXaXRoU3VtbWFyeUtpbmQuZ2V0KHN1bW1hcnkudHlwZS5zdW1tYXJ5S2luZCEpITtcbiAgICAgICAgICBjb25zdCB0eXBlSGFzUmVxdWlyZWRBbm5vdGF0aW9uID0gcmVxdWlyZWRBbm5vdGF0aW9uVHlwZXMuc29tZShcbiAgICAgICAgICAgICAgKHJlcXVpcmVkVHlwZSkgPT4gb3duQW5ub3RhdGlvbnMuc29tZShhbm4gPT4gcmVxdWlyZWRUeXBlLmlzVHlwZU9mKGFubikpKTtcbiAgICAgICAgICBpZiAoIXR5cGVIYXNSZXF1aXJlZEFubm90YXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMucmVwb3J0RXJyb3IoXG4gICAgICAgICAgICAgICAgZm9ybWF0TWV0YWRhdGFFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGFFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGBDbGFzcyAke3R5cGUubmFtZX0gaW4gJHt0eXBlLmZpbGVQYXRofSBleHRlbmRzIGZyb20gYSAke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbXBpbGVTdW1tYXJ5S2luZFtzdW1tYXJ5LnR5cGUuc3VtbWFyeUtpbmQhXG4gICAgICAgICAgICBdfSBpbiBhbm90aGVyIGNvbXBpbGF0aW9uIHVuaXQgd2l0aG91dCBkdXBsaWNhdGluZyB0aGUgZGVjb3JhdG9yYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIHN1bW1hcnkgKi8gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgYFBsZWFzZSBhZGQgYSAke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkQW5ub3RhdGlvblR5cGVzLm1hcCgodHlwZSkgPT4gdHlwZS5uZ01ldGFkYXRhTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oJyBvciAnKX0gZGVjb3JhdG9yIHRvIHRoZSBjbGFzc2ApLFxuICAgICAgICAgICAgICAgICAgICB0eXBlKSxcbiAgICAgICAgICAgICAgICB0eXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGFubm90YXRpb25DYWNoZS5zZXQodHlwZSwgYW5ub3RhdGlvbnMuZmlsdGVyKGFubiA9PiAhIWFubikpO1xuICAgIH1cbiAgICByZXR1cm4gYW5ub3RhdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgcHJvcE1ldGFkYXRhKHR5cGU6IFN0YXRpY1N5bWJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnlbXX0ge1xuICAgIGxldCBwcm9wTWV0YWRhdGEgPSB0aGlzLnByb3BlcnR5Q2FjaGUuZ2V0KHR5cGUpO1xuICAgIGlmICghcHJvcE1ldGFkYXRhKSB7XG4gICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gdGhpcy5nZXRUeXBlTWV0YWRhdGEodHlwZSk7XG4gICAgICBwcm9wTWV0YWRhdGEgPSB7fTtcbiAgICAgIGNvbnN0IHBhcmVudFR5cGUgPSB0aGlzLmZpbmRQYXJlbnRUeXBlKHR5cGUsIGNsYXNzTWV0YWRhdGEpO1xuICAgICAgaWYgKHBhcmVudFR5cGUpIHtcbiAgICAgICAgY29uc3QgcGFyZW50UHJvcE1ldGFkYXRhID0gdGhpcy5wcm9wTWV0YWRhdGEocGFyZW50VHlwZSk7XG4gICAgICAgIE9iamVjdC5rZXlzKHBhcmVudFByb3BNZXRhZGF0YSkuZm9yRWFjaCgocGFyZW50UHJvcCkgPT4ge1xuICAgICAgICAgIHByb3BNZXRhZGF0YSFbcGFyZW50UHJvcF0gPSBwYXJlbnRQcm9wTWV0YWRhdGFbcGFyZW50UHJvcF07XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtZW1iZXJzID0gY2xhc3NNZXRhZGF0YVsnbWVtYmVycyddIHx8IHt9O1xuICAgICAgT2JqZWN0LmtleXMobWVtYmVycykuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcERhdGEgPSBtZW1iZXJzW3Byb3BOYW1lXTtcbiAgICAgICAgY29uc3QgcHJvcCA9ICg8YW55W10+cHJvcERhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoYSA9PiBhWydfX3N5bWJvbGljJ10gPT0gJ3Byb3BlcnR5JyB8fCBhWydfX3N5bWJvbGljJ10gPT0gJ21ldGhvZCcpO1xuICAgICAgICBjb25zdCBkZWNvcmF0b3JzOiBhbnlbXSA9IFtdO1xuICAgICAgICAvLyBoYXNPd25Qcm9wZXJ0eSgpIGlzIHVzZWQgaGVyZSB0byBtYWtlIHN1cmUgd2UgZG8gbm90IGxvb2sgdXAgbWV0aG9kc1xuICAgICAgICAvLyBvbiBgT2JqZWN0LnByb3RvdHlwZWAuXG4gICAgICAgIGlmIChwcm9wTWV0YWRhdGE/Lmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICAgIGRlY29yYXRvcnMucHVzaCguLi5wcm9wTWV0YWRhdGEhW3Byb3BOYW1lXSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvcE1ldGFkYXRhIVtwcm9wTmFtZV0gPSBkZWNvcmF0b3JzO1xuICAgICAgICBpZiAocHJvcCAmJiBwcm9wWydkZWNvcmF0b3JzJ10pIHtcbiAgICAgICAgICBkZWNvcmF0b3JzLnB1c2goLi4udGhpcy5zaW1wbGlmeSh0eXBlLCBwcm9wWydkZWNvcmF0b3JzJ10pKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnByb3BlcnR5Q2FjaGUuc2V0KHR5cGUsIHByb3BNZXRhZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9wTWV0YWRhdGE7XG4gIH1cblxuICBwdWJsaWMgcGFyYW1ldGVycyh0eXBlOiBTdGF0aWNTeW1ib2wpOiBhbnlbXSB7XG4gICAgaWYgKCEodHlwZSBpbnN0YW5jZW9mIFN0YXRpY1N5bWJvbCkpIHtcbiAgICAgIHRoaXMucmVwb3J0RXJyb3IoXG4gICAgICAgICAgbmV3IEVycm9yKGBwYXJhbWV0ZXJzIHJlY2VpdmVkICR7SlNPTi5zdHJpbmdpZnkodHlwZSl9IHdoaWNoIGlzIG5vdCBhIFN0YXRpY1N5bWJvbGApLFxuICAgICAgICAgIHR5cGUpO1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgbGV0IHBhcmFtZXRlcnMgPSB0aGlzLnBhcmFtZXRlckNhY2hlLmdldCh0eXBlKTtcbiAgICAgIGlmICghcGFyYW1ldGVycykge1xuICAgICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gdGhpcy5nZXRUeXBlTWV0YWRhdGEodHlwZSk7XG4gICAgICAgIGNvbnN0IHBhcmVudFR5cGUgPSB0aGlzLmZpbmRQYXJlbnRUeXBlKHR5cGUsIGNsYXNzTWV0YWRhdGEpO1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gY2xhc3NNZXRhZGF0YSA/IGNsYXNzTWV0YWRhdGFbJ21lbWJlcnMnXSA6IG51bGw7XG4gICAgICAgIGNvbnN0IGN0b3JEYXRhID0gbWVtYmVycyA/IG1lbWJlcnNbJ19fY3Rvcl9fJ10gOiBudWxsO1xuICAgICAgICBpZiAoY3RvckRhdGEpIHtcbiAgICAgICAgICBjb25zdCBjdG9yID0gKDxhbnlbXT5jdG9yRGF0YSkuZmluZChhID0+IGFbJ19fc3ltYm9saWMnXSA9PSAnY29uc3RydWN0b3InKTtcbiAgICAgICAgICBjb25zdCByYXdQYXJhbWV0ZXJUeXBlcyA9IDxhbnlbXT5jdG9yWydwYXJhbWV0ZXJzJ10gfHwgW107XG4gICAgICAgICAgY29uc3QgcGFyYW1ldGVyRGVjb3JhdG9ycyA9IDxhbnlbXT50aGlzLnNpbXBsaWZ5KHR5cGUsIGN0b3JbJ3BhcmFtZXRlckRlY29yYXRvcnMnXSB8fCBbXSk7XG4gICAgICAgICAgcGFyYW1ldGVycyA9IFtdO1xuICAgICAgICAgIHJhd1BhcmFtZXRlclR5cGVzLmZvckVhY2goKHJhd1BhcmFtVHlwZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5lc3RlZFJlc3VsdDogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtVHlwZSA9IHRoaXMudHJ5U2ltcGxpZnkodHlwZSwgcmF3UGFyYW1UeXBlKTtcbiAgICAgICAgICAgIGlmIChwYXJhbVR5cGUpIG5lc3RlZFJlc3VsdC5wdXNoKHBhcmFtVHlwZSk7XG4gICAgICAgICAgICBjb25zdCBkZWNvcmF0b3JzID0gcGFyYW1ldGVyRGVjb3JhdG9ycyA/IHBhcmFtZXRlckRlY29yYXRvcnNbaW5kZXhdIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChkZWNvcmF0b3JzKSB7XG4gICAgICAgICAgICAgIG5lc3RlZFJlc3VsdC5wdXNoKC4uLmRlY29yYXRvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyYW1ldGVycyEucHVzaChuZXN0ZWRSZXN1bHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmVudFR5cGUpIHtcbiAgICAgICAgICBwYXJhbWV0ZXJzID0gdGhpcy5wYXJhbWV0ZXJzKHBhcmVudFR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGFyYW1ldGVycykge1xuICAgICAgICAgIHBhcmFtZXRlcnMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcmFtZXRlckNhY2hlLnNldCh0eXBlLCBwYXJhbWV0ZXJzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJhbWV0ZXJzO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCBvbiB0eXBlICR7SlNPTi5zdHJpbmdpZnkodHlwZSl9IHdpdGggZXJyb3IgJHtlfWApO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9tZXRob2ROYW1lcyh0eXBlOiBhbnkpOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0ge1xuICAgIGxldCBtZXRob2ROYW1lcyA9IHRoaXMubWV0aG9kQ2FjaGUuZ2V0KHR5cGUpO1xuICAgIGlmICghbWV0aG9kTmFtZXMpIHtcbiAgICAgIGNvbnN0IGNsYXNzTWV0YWRhdGEgPSB0aGlzLmdldFR5cGVNZXRhZGF0YSh0eXBlKTtcbiAgICAgIG1ldGhvZE5hbWVzID0ge307XG4gICAgICBjb25zdCBwYXJlbnRUeXBlID0gdGhpcy5maW5kUGFyZW50VHlwZSh0eXBlLCBjbGFzc01ldGFkYXRhKTtcbiAgICAgIGlmIChwYXJlbnRUeXBlKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudE1ldGhvZE5hbWVzID0gdGhpcy5fbWV0aG9kTmFtZXMocGFyZW50VHlwZSk7XG4gICAgICAgIE9iamVjdC5rZXlzKHBhcmVudE1ldGhvZE5hbWVzKS5mb3JFYWNoKChwYXJlbnRQcm9wKSA9PiB7XG4gICAgICAgICAgbWV0aG9kTmFtZXMhW3BhcmVudFByb3BdID0gcGFyZW50TWV0aG9kTmFtZXNbcGFyZW50UHJvcF07XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtZW1iZXJzID0gY2xhc3NNZXRhZGF0YVsnbWVtYmVycyddIHx8IHt9O1xuICAgICAgT2JqZWN0LmtleXMobWVtYmVycykuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcERhdGEgPSBtZW1iZXJzW3Byb3BOYW1lXTtcbiAgICAgICAgY29uc3QgaXNNZXRob2QgPSAoPGFueVtdPnByb3BEYXRhKS5zb21lKGEgPT4gYVsnX19zeW1ib2xpYyddID09ICdtZXRob2QnKTtcbiAgICAgICAgbWV0aG9kTmFtZXMhW3Byb3BOYW1lXSA9IG1ldGhvZE5hbWVzIVtwcm9wTmFtZV0gfHwgaXNNZXRob2Q7XG4gICAgICB9KTtcbiAgICAgIHRoaXMubWV0aG9kQ2FjaGUuc2V0KHR5cGUsIG1ldGhvZE5hbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZE5hbWVzO1xuICB9XG5cbiAgcHJpdmF0ZSBfc3RhdGljTWVtYmVycyh0eXBlOiBTdGF0aWNTeW1ib2wpOiBzdHJpbmdbXSB7XG4gICAgbGV0IHN0YXRpY01lbWJlcnMgPSB0aGlzLnN0YXRpY0NhY2hlLmdldCh0eXBlKTtcbiAgICBpZiAoIXN0YXRpY01lbWJlcnMpIHtcbiAgICAgIGNvbnN0IGNsYXNzTWV0YWRhdGEgPSB0aGlzLmdldFR5cGVNZXRhZGF0YSh0eXBlKTtcbiAgICAgIGNvbnN0IHN0YXRpY01lbWJlckRhdGEgPSBjbGFzc01ldGFkYXRhWydzdGF0aWNzJ10gfHwge307XG4gICAgICBzdGF0aWNNZW1iZXJzID0gT2JqZWN0LmtleXMoc3RhdGljTWVtYmVyRGF0YSk7XG4gICAgICB0aGlzLnN0YXRpY0NhY2hlLnNldCh0eXBlLCBzdGF0aWNNZW1iZXJzKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRpY01lbWJlcnM7XG4gIH1cblxuXG4gIHByaXZhdGUgZmluZFBhcmVudFR5cGUodHlwZTogU3RhdGljU3ltYm9sLCBjbGFzc01ldGFkYXRhOiBhbnkpOiBTdGF0aWNTeW1ib2x8dW5kZWZpbmVkIHtcbiAgICBjb25zdCBwYXJlbnRUeXBlID0gdGhpcy50cnlTaW1wbGlmeSh0eXBlLCBjbGFzc01ldGFkYXRhWydleHRlbmRzJ10pO1xuICAgIGlmIChwYXJlbnRUeXBlIGluc3RhbmNlb2YgU3RhdGljU3ltYm9sKSB7XG4gICAgICByZXR1cm4gcGFyZW50VHlwZTtcbiAgICB9XG4gIH1cblxuICBoYXNMaWZlY3ljbGVIb29rKHR5cGU6IGFueSwgbGNQcm9wZXJ0eTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKCEodHlwZSBpbnN0YW5jZW9mIFN0YXRpY1N5bWJvbCkpIHtcbiAgICAgIHRoaXMucmVwb3J0RXJyb3IoXG4gICAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgICAgICBgaGFzTGlmZWN5Y2xlSG9vayByZWNlaXZlZCAke0pTT04uc3RyaW5naWZ5KHR5cGUpfSB3aGljaCBpcyBub3QgYSBTdGF0aWNTeW1ib2xgKSxcbiAgICAgICAgICB0eXBlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAhIXRoaXMuX21ldGhvZE5hbWVzKHR5cGUpW2xjUHJvcGVydHldO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCBvbiB0eXBlICR7SlNPTi5zdHJpbmdpZnkodHlwZSl9IHdpdGggZXJyb3IgJHtlfWApO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cblxuICBndWFyZHModHlwZTogYW55KToge1trZXk6IHN0cmluZ106IFN0YXRpY1N5bWJvbH0ge1xuICAgIGlmICghKHR5cGUgaW5zdGFuY2VvZiBTdGF0aWNTeW1ib2wpKSB7XG4gICAgICB0aGlzLnJlcG9ydEVycm9yKFxuICAgICAgICAgIG5ldyBFcnJvcihgZ3VhcmRzIHJlY2VpdmVkICR7SlNPTi5zdHJpbmdpZnkodHlwZSl9IHdoaWNoIGlzIG5vdCBhIFN0YXRpY1N5bWJvbGApLCB0eXBlKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3Qgc3RhdGljTWVtYmVycyA9IHRoaXMuX3N0YXRpY01lbWJlcnModHlwZSk7XG4gICAgY29uc3QgcmVzdWx0OiB7W2tleTogc3RyaW5nXTogU3RhdGljU3ltYm9sfSA9IHt9O1xuICAgIGZvciAobGV0IG5hbWUgb2Ygc3RhdGljTWVtYmVycykge1xuICAgICAgaWYgKG5hbWUuZW5kc1dpdGgoVFlQRUdVQVJEX1BPU1RGSVgpKSB7XG4gICAgICAgIGxldCBwcm9wZXJ0eSA9IG5hbWUuc3Vic3RyKDAsIG5hbWUubGVuZ3RoIC0gVFlQRUdVQVJEX1BPU1RGSVgubGVuZ3RoKTtcbiAgICAgICAgbGV0IHZhbHVlOiBhbnk7XG4gICAgICAgIGlmIChwcm9wZXJ0eS5lbmRzV2l0aChVU0VfSUYpKSB7XG4gICAgICAgICAgcHJvcGVydHkgPSBuYW1lLnN1YnN0cigwLCBwcm9wZXJ0eS5sZW5ndGggLSBVU0VfSUYubGVuZ3RoKTtcbiAgICAgICAgICB2YWx1ZSA9IFVTRV9JRjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0U3RhdGljU3ltYm9sKHR5cGUuZmlsZVBhdGgsIHR5cGUubmFtZSwgW25hbWVdKTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIF9yZWdpc3RlckRlY29yYXRvck9yQ29uc3RydWN0b3IodHlwZTogU3RhdGljU3ltYm9sLCBjdG9yOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnZlcnNpb25NYXAuc2V0KHR5cGUsIChjb250ZXh0OiBTdGF0aWNTeW1ib2wsIGFyZ3M6IGFueVtdKSA9PiBuZXcgY3RvciguLi5hcmdzKSk7XG4gIH1cblxuICBwcml2YXRlIF9yZWdpc3RlckZ1bmN0aW9uKHR5cGU6IFN0YXRpY1N5bWJvbCwgZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuY29udmVyc2lvbk1hcC5zZXQodHlwZSwgKGNvbnRleHQ6IFN0YXRpY1N5bWJvbCwgYXJnczogYW55W10pID0+IGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJncykpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplQ29udmVyc2lvbk1hcCgpOiB2b2lkIHtcbiAgICB0aGlzLl9yZWdpc3RlckRlY29yYXRvck9yQ29uc3RydWN0b3IoXG4gICAgICAgIHRoaXMuZmluZERlY2xhcmF0aW9uKEFOR1VMQVJfQ09SRSwgJ0luamVjdGFibGUnKSwgY3JlYXRlSW5qZWN0YWJsZSk7XG4gICAgdGhpcy5pbmplY3Rpb25Ub2tlbiA9IHRoaXMuZmluZERlY2xhcmF0aW9uKEFOR1VMQVJfQ09SRSwgJ0luamVjdGlvblRva2VuJyk7XG4gICAgdGhpcy5vcGFxdWVUb2tlbiA9IHRoaXMuZmluZERlY2xhcmF0aW9uKEFOR1VMQVJfQ09SRSwgJ09wYXF1ZVRva2VuJyk7XG4gICAgdGhpcy5ST1VURVMgPSB0aGlzLnRyeUZpbmREZWNsYXJhdGlvbihBTkdVTEFSX1JPVVRFUiwgJ1JPVVRFUycpO1xuICAgIHRoaXMuQU5BTFlaRV9GT1JfRU5UUllfQ09NUE9ORU5UUyA9XG4gICAgICAgIHRoaXMuZmluZERlY2xhcmF0aW9uKEFOR1VMQVJfQ09SRSwgJ0FOQUxZWkVfRk9SX0VOVFJZX0NPTVBPTkVOVFMnKTtcblxuICAgIHRoaXMuX3JlZ2lzdGVyRGVjb3JhdG9yT3JDb25zdHJ1Y3Rvcih0aGlzLmZpbmREZWNsYXJhdGlvbihBTkdVTEFSX0NPUkUsICdIb3N0JyksIGNyZWF0ZUhvc3QpO1xuICAgIHRoaXMuX3JlZ2lzdGVyRGVjb3JhdG9yT3JDb25zdHJ1Y3Rvcih0aGlzLmZpbmREZWNsYXJhdGlvbihBTkdVTEFSX0NPUkUsICdTZWxmJyksIGNyZWF0ZVNlbGYpO1xuICAgIHRoaXMuX3JlZ2lzdGVyRGVjb3JhdG9yT3JDb25zdHJ1Y3RvcihcbiAgICAgICAgdGhpcy5maW5kRGVjbGFyYXRpb24oQU5HVUxBUl9DT1JFLCAnU2tpcFNlbGYnKSwgY3JlYXRlU2tpcFNlbGYpO1xuICAgIHRoaXMuX3JlZ2lzdGVyRGVjb3JhdG9yT3JDb25zdHJ1Y3RvcihcbiAgICAgICAgdGhpcy5maW5kRGVjbGFyYXRpb24oQU5HVUxBUl9DT1JFLCAnSW5qZWN0JyksIGNyZWF0ZUluamVjdCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJEZWNvcmF0b3JPckNvbnN0cnVjdG9yKFxuICAgICAgICB0aGlzLmZpbmREZWNsYXJhdGlvbihBTkdVTEFSX0NPUkUsICdPcHRpb25hbCcpLCBjcmVhdGVPcHRpb25hbCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJEZWNvcmF0b3JPckNvbnN0cnVjdG9yKFxuICAgICAgICB0aGlzLmZpbmREZWNsYXJhdGlvbihBTkdVTEFSX0NPUkUsICdBdHRyaWJ1dGUnKSwgY3JlYXRlQXR0cmlidXRlKTtcbiAgICB0aGlzLl9yZWdpc3RlckRlY29yYXRvck9yQ29uc3RydWN0b3IoXG4gICAgICAgIHRoaXMuZmluZERlY2xhcmF0aW9uKEFOR1VMQVJfQ09SRSwgJ0NvbnRlbnRDaGlsZCcpLCBjcmVhdGVDb250ZW50Q2hpbGQpO1xuICAgIHRoaXMuX3JlZ2lzdGVyRGVjb3JhdG9yT3JDb25zdHJ1Y3RvcihcbiAgICAgICAgdGhpcy5maW5kRGVjbGFyYXRpb24oQU5HVUxBUl9DT1JFLCAnQ29udGVudENoaWxkcmVuJyksIGNyZWF0ZUNvbnRlbnRDaGlsZHJlbik7XG4gICAgdGhpcy5fcmVnaXN0ZXJEZWNvcmF0b3JPckNvbnN0cnVjdG9yKFxuICAgICAgICB0aGlzLmZpbmREZWNsYXJhdGlvbihBTkdVTEFSX0NPUkUsICdWaWV3Q2hpbGQnKSwgY3JlYXRlVmlld0NoaWxkKTtcbiAgICB0aGlzLl9yZWdpc3RlckRlY29yYXRvck9yQ29uc3RydWN0b3IoXG4gICAgICAgIHRoaXMuZmluZERlY2xhcmF0aW9uKEFOR1VMQVJfQ09SRSwgJ1ZpZXdDaGlsZHJlbicpLCBjcmVhdGVWaWV3Q2hpbGRyZW4pO1xuICAgIHRoaXMuX3JlZ2lzdGVyRGVjb3JhdG9yT3JDb25zdHJ1Y3Rvcih0aGlzLmZpbmREZWNsYXJhdGlvbihBTkdVTEFSX0NPUkUsICdJbnB1dCcpLCBjcmVhdGVJbnB1dCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJEZWNvcmF0b3JPckNvbnN0cnVjdG9yKFxuICAgICAgICB0aGlzLmZpbmREZWNsYXJhdGlvbihBTkdVTEFSX0NPUkUsICdPdXRwdXQnKSwgY3JlYXRlT3V0cHV0KTtcbiAgICB0aGlzLl9yZWdpc3RlckRlY29yYXRvck9yQ29uc3RydWN0b3IodGhpcy5maW5kRGVjbGFyYXRpb24oQU5HVUxBUl9DT1JFLCAnUGlwZScpLCBjcmVhdGVQaXBlKTtcbiAgICB0aGlzLl9yZWdpc3RlckRlY29yYXRvck9yQ29uc3RydWN0b3IoXG4gICAgICAgIHRoaXMuZmluZERlY2xhcmF0aW9uKEFOR1VMQVJfQ09SRSwgJ0hvc3RCaW5kaW5nJyksIGNyZWF0ZUhvc3RCaW5kaW5nKTtcbiAgICB0aGlzLl9yZWdpc3RlckRlY29yYXRvck9yQ29uc3RydWN0b3IoXG4gICAgICAgIHRoaXMuZmluZERlY2xhcmF0aW9uKEFOR1VMQVJfQ09SRSwgJ0hvc3RMaXN0ZW5lcicpLCBjcmVhdGVIb3N0TGlzdGVuZXIpO1xuICAgIHRoaXMuX3JlZ2lzdGVyRGVjb3JhdG9yT3JDb25zdHJ1Y3RvcihcbiAgICAgICAgdGhpcy5maW5kRGVjbGFyYXRpb24oQU5HVUxBUl9DT1JFLCAnRGlyZWN0aXZlJyksIGNyZWF0ZURpcmVjdGl2ZSk7XG4gICAgdGhpcy5fcmVnaXN0ZXJEZWNvcmF0b3JPckNvbnN0cnVjdG9yKFxuICAgICAgICB0aGlzLmZpbmREZWNsYXJhdGlvbihBTkdVTEFSX0NPUkUsICdDb21wb25lbnQnKSwgY3JlYXRlQ29tcG9uZW50KTtcbiAgICB0aGlzLl9yZWdpc3RlckRlY29yYXRvck9yQ29uc3RydWN0b3IoXG4gICAgICAgIHRoaXMuZmluZERlY2xhcmF0aW9uKEFOR1VMQVJfQ09SRSwgJ05nTW9kdWxlJyksIGNyZWF0ZU5nTW9kdWxlKTtcblxuICAgIC8vIE5vdGU6IFNvbWUgbWV0YWRhdGEgY2xhc3NlcyBjYW4gYmUgdXNlZCBkaXJlY3RseSB3aXRoIFByb3ZpZGVyLmRlcHMuXG4gICAgdGhpcy5fcmVnaXN0ZXJEZWNvcmF0b3JPckNvbnN0cnVjdG9yKHRoaXMuZmluZERlY2xhcmF0aW9uKEFOR1VMQVJfQ09SRSwgJ0hvc3QnKSwgY3JlYXRlSG9zdCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJEZWNvcmF0b3JPckNvbnN0cnVjdG9yKHRoaXMuZmluZERlY2xhcmF0aW9uKEFOR1VMQVJfQ09SRSwgJ1NlbGYnKSwgY3JlYXRlU2VsZik7XG4gICAgdGhpcy5fcmVnaXN0ZXJEZWNvcmF0b3JPckNvbnN0cnVjdG9yKFxuICAgICAgICB0aGlzLmZpbmREZWNsYXJhdGlvbihBTkdVTEFSX0NPUkUsICdTa2lwU2VsZicpLCBjcmVhdGVTa2lwU2VsZik7XG4gICAgdGhpcy5fcmVnaXN0ZXJEZWNvcmF0b3JPckNvbnN0cnVjdG9yKFxuICAgICAgICB0aGlzLmZpbmREZWNsYXJhdGlvbihBTkdVTEFSX0NPUkUsICdPcHRpb25hbCcpLCBjcmVhdGVPcHRpb25hbCk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0U3RhdGljU3ltYm9sIHByb2R1Y2VzIGEgVHlwZSB3aG9zZSBtZXRhZGF0YSBpcyBrbm93biBidXQgd2hvc2UgaW1wbGVtZW50YXRpb24gaXMgbm90IGxvYWRlZC5cbiAgICogQWxsIHR5cGVzIHBhc3NlZCB0byB0aGUgU3RhdGljUmVzb2x2ZXIgc2hvdWxkIGJlIHBzZXVkby10eXBlcyByZXR1cm5lZCBieSB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIGRlY2xhcmF0aW9uRmlsZSB0aGUgYWJzb2x1dGUgcGF0aCBvZiB0aGUgZmlsZSB3aGVyZSB0aGUgc3ltYm9sIGlzIGRlY2xhcmVkXG4gICAqIEBwYXJhbSBuYW1lIHRoZSBuYW1lIG9mIHRoZSB0eXBlLlxuICAgKi9cbiAgZ2V0U3RhdGljU3ltYm9sKGRlY2xhcmF0aW9uRmlsZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIG1lbWJlcnM/OiBzdHJpbmdbXSk6IFN0YXRpY1N5bWJvbCB7XG4gICAgcmV0dXJuIHRoaXMuc3ltYm9sUmVzb2x2ZXIuZ2V0U3RhdGljU3ltYm9sKGRlY2xhcmF0aW9uRmlsZSwgbmFtZSwgbWVtYmVycyk7XG4gIH1cblxuICAvKipcbiAgICogU2ltcGxpZnkgYnV0IGRpc2NhcmQgYW55IGVycm9yc1xuICAgKi9cbiAgcHJpdmF0ZSB0cnlTaW1wbGlmeShjb250ZXh0OiBTdGF0aWNTeW1ib2wsIHZhbHVlOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IG9yaWdpbmFsUmVjb3JkZXIgPSB0aGlzLmVycm9yUmVjb3JkZXI7XG4gICAgdGhpcy5lcnJvclJlY29yZGVyID0gKGVycm9yOiBhbnksIGZpbGVOYW1lPzogc3RyaW5nKSA9PiB7fTtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnNpbXBsaWZ5KGNvbnRleHQsIHZhbHVlKTtcbiAgICB0aGlzLmVycm9yUmVjb3JkZXIgPSBvcmlnaW5hbFJlY29yZGVyO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBzaW1wbGlmeShjb250ZXh0OiBTdGF0aWNTeW1ib2wsIHZhbHVlOiBhbnksIGxhenk6IGJvb2xlYW4gPSBmYWxzZSk6IGFueSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgbGV0IHNjb3BlID0gQmluZGluZ1Njb3BlLmVtcHR5O1xuICAgIGNvbnN0IGNhbGxpbmcgPSBuZXcgTWFwPFN0YXRpY1N5bWJvbCwgYm9vbGVhbj4oKTtcbiAgICBjb25zdCByb290Q29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICBmdW5jdGlvbiBzaW1wbGlmeUluQ29udGV4dChcbiAgICAgICAgY29udGV4dDogU3RhdGljU3ltYm9sLCB2YWx1ZTogYW55LCBkZXB0aDogbnVtYmVyLCByZWZlcmVuY2VzOiBudW1iZXIpOiBhbnkge1xuICAgICAgZnVuY3Rpb24gcmVzb2x2ZVJlZmVyZW5jZVZhbHVlKHN0YXRpY1N5bWJvbDogU3RhdGljU3ltYm9sKTogYW55IHtcbiAgICAgICAgY29uc3QgcmVzb2x2ZWRTeW1ib2wgPSBzZWxmLnN5bWJvbFJlc29sdmVyLnJlc29sdmVTeW1ib2woc3RhdGljU3ltYm9sKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkU3ltYm9sID8gcmVzb2x2ZWRTeW1ib2wubWV0YWRhdGEgOiBudWxsO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaW1wbGlmeUVhZ2VybHkodmFsdWU6IGFueSk6IGFueSB7XG4gICAgICAgIHJldHVybiBzaW1wbGlmeUluQ29udGV4dChjb250ZXh0LCB2YWx1ZSwgZGVwdGgsIDApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaW1wbGlmeUxhemlseSh2YWx1ZTogYW55KTogYW55IHtcbiAgICAgICAgcmV0dXJuIHNpbXBsaWZ5SW5Db250ZXh0KGNvbnRleHQsIHZhbHVlLCBkZXB0aCwgcmVmZXJlbmNlcyArIDEpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaW1wbGlmeU5lc3RlZChuZXN0ZWRDb250ZXh0OiBTdGF0aWNTeW1ib2wsIHZhbHVlOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAobmVzdGVkQ29udGV4dCA9PT0gY29udGV4dCkge1xuICAgICAgICAgIC8vIElmIHRoZSBjb250ZXh0IGhhc24ndCBjaGFuZ2VkIGxldCB0aGUgZXhjZXB0aW9uIHByb3BhZ2F0ZSB1bm1vZGlmaWVkLlxuICAgICAgICAgIHJldHVybiBzaW1wbGlmeUluQ29udGV4dChuZXN0ZWRDb250ZXh0LCB2YWx1ZSwgZGVwdGggKyAxLCByZWZlcmVuY2VzKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBzaW1wbGlmeUluQ29udGV4dChuZXN0ZWRDb250ZXh0LCB2YWx1ZSwgZGVwdGggKyAxLCByZWZlcmVuY2VzKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChpc01ldGFkYXRhRXJyb3IoZSkpIHtcbiAgICAgICAgICAgIC8vIFByb3BhZ2F0ZSB0aGUgbWVzc2FnZSB0ZXh0IHVwIGJ1dCBhZGQgYSBtZXNzYWdlIHRvIHRoZSBjaGFpbiB0aGF0IGV4cGxhaW5zIGhvdyB3ZSBnb3RcbiAgICAgICAgICAgIC8vIGhlcmUuXG4gICAgICAgICAgICAvLyBlLmNoYWluIGltcGxpZXMgZS5zeW1ib2xcbiAgICAgICAgICAgIGNvbnN0IHN1bW1hcnlNc2cgPSBlLmNoYWluID8gJ3JlZmVyZW5jZXMgXFwnJyArIGUuc3ltYm9sIS5uYW1lICsgJ1xcJycgOiBlcnJvclN1bW1hcnkoZSk7XG4gICAgICAgICAgICBjb25zdCBzdW1tYXJ5ID0gYCcke25lc3RlZENvbnRleHQubmFtZX0nICR7c3VtbWFyeU1zZ31gO1xuICAgICAgICAgICAgY29uc3QgY2hhaW4gPSB7bWVzc2FnZTogc3VtbWFyeSwgcG9zaXRpb246IGUucG9zaXRpb24sIG5leHQ6IGUuY2hhaW59O1xuICAgICAgICAgICAgLy8gVE9ETyhjaHVja2opOiByZXRyaWV2ZSB0aGUgcG9zaXRpb24gaW5mb3JtYXRpb24gaW5kaXJlY3RseSBmcm9tIHRoZSBjb2xsZWN0b3JzIG5vZGVcbiAgICAgICAgICAgIC8vIG1hcCBpZiB0aGUgbWV0YWRhdGEgaXMgZnJvbSBhIC50cyBmaWxlLlxuICAgICAgICAgICAgc2VsZi5lcnJvcihcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICBhZHZpc2U6IGUuYWR2aXNlLFxuICAgICAgICAgICAgICAgICAgY29udGV4dDogZS5jb250ZXh0LFxuICAgICAgICAgICAgICAgICAgY2hhaW4sXG4gICAgICAgICAgICAgICAgICBzeW1ib2w6IG5lc3RlZENvbnRleHRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnRleHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJdCBpcyBwcm9iYWJseSBhbiBpbnRlcm5hbCBlcnJvci5cbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNpbXBsaWZ5Q2FsbChcbiAgICAgICAgICBmdW5jdGlvblN5bWJvbDogU3RhdGljU3ltYm9sLCB0YXJnZXRGdW5jdGlvbjogYW55LCBhcmdzOiBhbnlbXSwgdGFyZ2V0RXhwcmVzc2lvbjogYW55KSB7XG4gICAgICAgIGlmICh0YXJnZXRGdW5jdGlvbiAmJiB0YXJnZXRGdW5jdGlvblsnX19zeW1ib2xpYyddID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAoY2FsbGluZy5nZXQoZnVuY3Rpb25TeW1ib2wpKSB7XG4gICAgICAgICAgICBzZWxmLmVycm9yKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdSZWN1cnNpb24gaXMgbm90IHN1cHBvcnRlZCcsXG4gICAgICAgICAgICAgICAgICBzdW1tYXJ5OiBgY2FsbGVkICcke2Z1bmN0aW9uU3ltYm9sLm5hbWV9JyByZWN1cnNpdmVseWAsXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogdGFyZ2V0RnVuY3Rpb25cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uU3ltYm9sKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGFyZ2V0RnVuY3Rpb25bJ3ZhbHVlJ107XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgKGRlcHRoICE9IDAgfHwgdmFsdWUuX19zeW1ib2xpYyAhPSAnZXJyb3InKSkge1xuICAgICAgICAgICAgICBjb25zdCBwYXJhbWV0ZXJzOiBzdHJpbmdbXSA9IHRhcmdldEZ1bmN0aW9uWydwYXJhbWV0ZXJzJ107XG4gICAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRzOiBhbnlbXSA9IHRhcmdldEZ1bmN0aW9uLmRlZmF1bHRzO1xuICAgICAgICAgICAgICBhcmdzID0gYXJncy5tYXAoYXJnID0+IHNpbXBsaWZ5TmVzdGVkKGNvbnRleHQsIGFyZykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChhcmcgPT4gc2hvdWxkSWdub3JlKGFyZykgPyB1bmRlZmluZWQgOiBhcmcpO1xuICAgICAgICAgICAgICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHMubGVuZ3RoID4gYXJncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goLi4uZGVmYXVsdHMuc2xpY2UoYXJncy5sZW5ndGgpLm1hcCgodmFsdWU6IGFueSkgPT4gc2ltcGxpZnkodmFsdWUpKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY2FsbGluZy5zZXQoZnVuY3Rpb25TeW1ib2wsIHRydWUpO1xuICAgICAgICAgICAgICBjb25zdCBmdW5jdGlvblNjb3BlID0gQmluZGluZ1Njb3BlLmJ1aWxkKCk7XG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1ldGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uU2NvcGUuZGVmaW5lKHBhcmFtZXRlcnNbaV0sIGFyZ3NbaV0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnN0IG9sZFNjb3BlID0gc2NvcGU7XG4gICAgICAgICAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzY29wZSA9IGZ1bmN0aW9uU2NvcGUuZG9uZSgpO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNpbXBsaWZ5TmVzdGVkKGZ1bmN0aW9uU3ltYm9sLCB2YWx1ZSk7XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgc2NvcGUgPSBvbGRTY29wZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBjYWxsaW5nLmRlbGV0ZShmdW5jdGlvblN5bWJvbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlcHRoID09PSAwKSB7XG4gICAgICAgICAgLy8gSWYgZGVwdGggaXMgMCB3ZSBhcmUgZXZhbHVhdGluZyB0aGUgdG9wIGxldmVsIGV4cHJlc3Npb24gdGhhdCBpcyBkZXNjcmliaW5nIGVsZW1lbnRcbiAgICAgICAgICAvLyBkZWNvcmF0b3IuIEluIHRoaXMgY2FzZSwgaXQgaXMgYSBkZWNvcmF0b3Igd2UgZG9uJ3QgdW5kZXJzdGFuZCwgc3VjaCBhcyBhIGN1c3RvbVxuICAgICAgICAgIC8vIG5vbi1hbmd1bGFyIGRlY29yYXRvciwgYW5kIHdlIHNob3VsZCBqdXN0IGlnbm9yZSBpdC5cbiAgICAgICAgICByZXR1cm4gSUdOT1JFO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwb3NpdGlvbjogUG9zaXRpb258dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodGFyZ2V0RXhwcmVzc2lvbiAmJiB0YXJnZXRFeHByZXNzaW9uLl9fc3ltYm9saWMgPT0gJ3Jlc29sdmVkJykge1xuICAgICAgICAgIGNvbnN0IGxpbmUgPSB0YXJnZXRFeHByZXNzaW9uLmxpbmU7XG4gICAgICAgICAgY29uc3QgY2hhcmFjdGVyID0gdGFyZ2V0RXhwcmVzc2lvbi5jaGFyYWN0ZXI7XG4gICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSB0YXJnZXRFeHByZXNzaW9uLmZpbGVOYW1lO1xuICAgICAgICAgIGlmIChmaWxlTmFtZSAhPSBudWxsICYmIGxpbmUgIT0gbnVsbCAmJiBjaGFyYWN0ZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcG9zaXRpb24gPSB7ZmlsZU5hbWUsIGxpbmUsIGNvbHVtbjogY2hhcmFjdGVyfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5lcnJvcihcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogRlVOQ1RJT05fQ0FMTF9OT1RfU1VQUE9SVEVELFxuICAgICAgICAgICAgICBjb250ZXh0OiBmdW5jdGlvblN5bWJvbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHRhcmdldEZ1bmN0aW9uLFxuICAgICAgICAgICAgICBwb3NpdGlvblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRleHQpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaW1wbGlmeShleHByZXNzaW9uOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoaXNQcmltaXRpdmUoZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShleHByZXNzaW9uKSkge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdDogYW55W10gPSBbXTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgKDxhbnk+ZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBhIHNwcmVhZCBleHByZXNzaW9uXG4gICAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLl9fc3ltYm9saWMgPT09ICdzcHJlYWQnKSB7XG4gICAgICAgICAgICAgIC8vIFdlIGNhbGwgd2l0aCByZWZlcmVuY2VzIGFzIDAgYmVjYXVzZSB3ZSByZXF1aXJlIHRoZSBhY3R1YWwgdmFsdWUgYW5kIGNhbm5vdFxuICAgICAgICAgICAgICAvLyB0b2xlcmF0ZSBhIHJlZmVyZW5jZSBoZXJlLlxuICAgICAgICAgICAgICBjb25zdCBzcHJlYWRBcnJheSA9IHNpbXBsaWZ5RWFnZXJseShpdGVtLmV4cHJlc3Npb24pO1xuICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzcHJlYWRBcnJheSkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHNwcmVhZEl0ZW0gb2Ygc3ByZWFkQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHNwcmVhZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzaW1wbGlmeShpdGVtKTtcbiAgICAgICAgICAgIGlmIChzaG91bGRJZ25vcmUodmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgU3RhdGljU3ltYm9sKSB7XG4gICAgICAgICAgLy8gU3RvcCBzaW1wbGlmaWNhdGlvbiBhdCBidWlsdGluIHN5bWJvbHMgb3IgaWYgd2UgYXJlIGluIGEgcmVmZXJlbmNlIGNvbnRleHQgYW5kXG4gICAgICAgICAgLy8gdGhlIHN5bWJvbCBkb2Vzbid0IGhhdmUgbWVtYmVycy5cbiAgICAgICAgICBpZiAoZXhwcmVzc2lvbiA9PT0gc2VsZi5pbmplY3Rpb25Ub2tlbiB8fCBzZWxmLmNvbnZlcnNpb25NYXAuaGFzKGV4cHJlc3Npb24pIHx8XG4gICAgICAgICAgICAgIChyZWZlcmVuY2VzID4gMCAmJiAhZXhwcmVzc2lvbi5tZW1iZXJzLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aWNTeW1ib2wgPSBleHByZXNzaW9uO1xuICAgICAgICAgICAgY29uc3QgZGVjbGFyYXRpb25WYWx1ZSA9IHJlc29sdmVSZWZlcmVuY2VWYWx1ZShzdGF0aWNTeW1ib2wpO1xuICAgICAgICAgICAgaWYgKGRlY2xhcmF0aW9uVmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4gc2ltcGxpZnlOZXN0ZWQoc3RhdGljU3ltYm9sLCBkZWNsYXJhdGlvblZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdGF0aWNTeW1ib2w7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChleHByZXNzaW9uKSB7XG4gICAgICAgICAgaWYgKGV4cHJlc3Npb25bJ19fc3ltYm9saWMnXSkge1xuICAgICAgICAgICAgbGV0IHN0YXRpY1N5bWJvbDogU3RhdGljU3ltYm9sO1xuICAgICAgICAgICAgc3dpdGNoIChleHByZXNzaW9uWydfX3N5bWJvbGljJ10pIHtcbiAgICAgICAgICAgICAgY2FzZSAnYmlub3AnOlxuICAgICAgICAgICAgICAgIGxldCBsZWZ0ID0gc2ltcGxpZnkoZXhwcmVzc2lvblsnbGVmdCddKTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkSWdub3JlKGxlZnQpKSByZXR1cm4gbGVmdDtcbiAgICAgICAgICAgICAgICBsZXQgcmlnaHQgPSBzaW1wbGlmeShleHByZXNzaW9uWydyaWdodCddKTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkSWdub3JlKHJpZ2h0KSkgcmV0dXJuIHJpZ2h0O1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZXhwcmVzc2lvblsnb3BlcmF0b3InXSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnJiYnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAmJiByaWdodDtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3x8JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgfHwgcmlnaHQ7XG4gICAgICAgICAgICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgfCByaWdodDtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCBeIHJpZ2h0O1xuICAgICAgICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICYgcmlnaHQ7XG4gICAgICAgICAgICAgICAgICBjYXNlICc9PSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID09IHJpZ2h0O1xuICAgICAgICAgICAgICAgICAgY2FzZSAnIT0nOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAhPSByaWdodDtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJz09PSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID09PSByaWdodDtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJyE9PSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICE9PSByaWdodDtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJzwnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCA8IHJpZ2h0O1xuICAgICAgICAgICAgICAgICAgY2FzZSAnPic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID4gcmlnaHQ7XG4gICAgICAgICAgICAgICAgICBjYXNlICc8PSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0IDw9IHJpZ2h0O1xuICAgICAgICAgICAgICAgICAgY2FzZSAnPj0nOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCA+PSByaWdodDtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJzw8JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPDwgcmlnaHQ7XG4gICAgICAgICAgICAgICAgICBjYXNlICc+Pic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID4+IHJpZ2h0O1xuICAgICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gICAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAqIHJpZ2h0O1xuICAgICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gICAgICAgICAgICAgICAgICBjYXNlICclJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJz8/JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPz8gcmlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICBjYXNlICdpZic6XG4gICAgICAgICAgICAgICAgbGV0IGNvbmRpdGlvbiA9IHNpbXBsaWZ5KGV4cHJlc3Npb25bJ2NvbmRpdGlvbiddKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZGl0aW9uID8gc2ltcGxpZnkoZXhwcmVzc2lvblsndGhlbkV4cHJlc3Npb24nXSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW1wbGlmeShleHByZXNzaW9uWydlbHNlRXhwcmVzc2lvbiddKTtcbiAgICAgICAgICAgICAgY2FzZSAncHJlJzpcbiAgICAgICAgICAgICAgICBsZXQgb3BlcmFuZCA9IHNpbXBsaWZ5KGV4cHJlc3Npb25bJ29wZXJhbmQnXSk7XG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZElnbm9yZShvcGVyYW5kKSkgcmV0dXJuIG9wZXJhbmQ7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChleHByZXNzaW9uWydvcGVyYXRvciddKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wZXJhbmQ7XG4gICAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC1vcGVyYW5kO1xuICAgICAgICAgICAgICAgICAgY2FzZSAnISc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhb3BlcmFuZDtcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gfm9wZXJhbmQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICBjYXNlICdpbmRleCc6XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4VGFyZ2V0ID0gc2ltcGxpZnlFYWdlcmx5KGV4cHJlc3Npb25bJ2V4cHJlc3Npb24nXSk7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gc2ltcGxpZnlFYWdlcmx5KGV4cHJlc3Npb25bJ2luZGV4J10pO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleFRhcmdldCAmJiBpc1ByaW1pdGl2ZShpbmRleCkpIHJldHVybiBpbmRleFRhcmdldFtpbmRleF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgICAgICAgICAgY29uc3QgbWVtYmVyID0gZXhwcmVzc2lvblsnbWVtYmVyJ107XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdENvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RUYXJnZXQgPSBzaW1wbGlmeShleHByZXNzaW9uWydleHByZXNzaW9uJ10pO1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RUYXJnZXQgaW5zdGFuY2VvZiBTdGF0aWNTeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG1lbWJlcnMgPSBzZWxlY3RUYXJnZXQubWVtYmVycy5jb25jYXQobWVtYmVyKTtcbiAgICAgICAgICAgICAgICAgIHNlbGVjdENvbnRleHQgPVxuICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2V0U3RhdGljU3ltYm9sKHNlbGVjdFRhcmdldC5maWxlUGF0aCwgc2VsZWN0VGFyZ2V0Lm5hbWUsIG1lbWJlcnMpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgZGVjbGFyYXRpb25WYWx1ZSA9IHJlc29sdmVSZWZlcmVuY2VWYWx1ZShzZWxlY3RDb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgIGlmIChkZWNsYXJhdGlvblZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNpbXBsaWZ5TmVzdGVkKHNlbGVjdENvbnRleHQsIGRlY2xhcmF0aW9uVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdENvbnRleHQ7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RUYXJnZXQgJiYgaXNQcmltaXRpdmUobWVtYmVyKSlcbiAgICAgICAgICAgICAgICAgIHJldHVybiBzaW1wbGlmeU5lc3RlZChzZWxlY3RDb250ZXh0LCBzZWxlY3RUYXJnZXRbbWVtYmVyXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgIGNhc2UgJ3JlZmVyZW5jZSc6XG4gICAgICAgICAgICAgICAgLy8gTm90ZTogVGhpcyBvbmx5IGhhcyB0byBkZWFsIHdpdGggdmFyaWFibGUgcmVmZXJlbmNlcywgYXMgc3ltYm9sIHJlZmVyZW5jZXMgaGF2ZVxuICAgICAgICAgICAgICAgIC8vIGJlZW4gY29udmVydGVkIGludG8gJ3Jlc29sdmVkJ1xuICAgICAgICAgICAgICAgIC8vIGluIHRoZSBTdGF0aWNTeW1ib2xSZXNvbHZlci5cbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSBleHByZXNzaW9uWyduYW1lJ107XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWxWYWx1ZSA9IHNjb3BlLnJlc29sdmUobmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsVmFsdWUgIT0gQmluZGluZ1Njb3BlLm1pc3NpbmcpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAncmVzb2x2ZWQnOlxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gc2ltcGxpZnkoZXhwcmVzc2lvbi5zeW1ib2wpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgIC8vIElmIGFuIGVycm9yIGlzIHJlcG9ydGVkIGV2YWx1YXRpbmcgdGhlIHN5bWJvbCByZWNvcmQgdGhlIHBvc2l0aW9uIG9mIHRoZVxuICAgICAgICAgICAgICAgICAgLy8gcmVmZXJlbmNlIGluIHRoZSBlcnJvciBzbyBpdCBjYW5cbiAgICAgICAgICAgICAgICAgIC8vIGJlIHJlcG9ydGVkIGluIHRoZSBlcnJvciBtZXNzYWdlIGdlbmVyYXRlZCBmcm9tIHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgICAgICAgICBpZiAoaXNNZXRhZGF0YUVycm9yKGUpICYmIGV4cHJlc3Npb24uZmlsZU5hbWUgIT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24ubGluZSAhPSBudWxsICYmIGV4cHJlc3Npb24uY2hhcmFjdGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogZXhwcmVzc2lvbi5maWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5lOiBleHByZXNzaW9uLmxpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBleHByZXNzaW9uLmNoYXJhY3RlclxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNhc2UgJ2NsYXNzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgICAgICAgICAgICBjYXNlICduZXcnOlxuICAgICAgICAgICAgICBjYXNlICdjYWxsJzpcbiAgICAgICAgICAgICAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIGZ1bmN0aW9uIGlzIGEgYnVpbHQtaW4gY29udmVyc2lvblxuICAgICAgICAgICAgICAgIHN0YXRpY1N5bWJvbCA9IHNpbXBsaWZ5SW5Db250ZXh0KFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LCBleHByZXNzaW9uWydleHByZXNzaW9uJ10sIGRlcHRoICsgMSwgLyogcmVmZXJlbmNlcyAqLyAwKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGljU3ltYm9sIGluc3RhbmNlb2YgU3RhdGljU3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoc3RhdGljU3ltYm9sID09PSBzZWxmLmluamVjdGlvblRva2VuIHx8IHN0YXRpY1N5bWJvbCA9PT0gc2VsZi5vcGFxdWVUb2tlbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBzb21lYm9keSBjYWxscyBuZXcgSW5qZWN0aW9uVG9rZW4sIGRvbid0IGNyZWF0ZSBhbiBJbmplY3Rpb25Ub2tlbixcbiAgICAgICAgICAgICAgICAgICAgLy8gYnV0IHJhdGhlciByZXR1cm4gdGhlIHN5bWJvbCB0byB3aGljaCB0aGUgSW5qZWN0aW9uVG9rZW4gaXMgYXNzaWduZWQgdG8uXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gT3BhcXVlVG9rZW4gaXMgc3VwcG9ydGVkIHRvbyBhcyBpdCBpcyByZXF1aXJlZCBieSB0aGUgbGFuZ3VhZ2Ugc2VydmljZSB0b1xuICAgICAgICAgICAgICAgICAgICAvLyBzdXBwb3J0IHY0IGFuZCBwcmlvciB2ZXJzaW9ucyBvZiBBbmd1bGFyLlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZ0V4cHJlc3Npb25zOiBhbnlbXSA9IGV4cHJlc3Npb25bJ2FyZ3VtZW50cyddIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgbGV0IGNvbnZlcnRlciA9IHNlbGYuY29udmVyc2lvbk1hcC5nZXQoc3RhdGljU3ltYm9sKTtcbiAgICAgICAgICAgICAgICAgIGlmIChjb252ZXJ0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJncyA9IGFyZ0V4cHJlc3Npb25zLm1hcChhcmcgPT4gc2ltcGxpZnlOZXN0ZWQoY29udGV4dCwgYXJnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGFyZyA9PiBzaG91bGRJZ25vcmUoYXJnKSA/IHVuZGVmaW5lZCA6IGFyZyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb252ZXJ0ZXIoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIGZ1bmN0aW9uIGlzIG9uZSB3ZSBjYW4gc2ltcGxpZnkuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldEZ1bmN0aW9uID0gcmVzb2x2ZVJlZmVyZW5jZVZhbHVlKHN0YXRpY1N5bWJvbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzaW1wbGlmeUNhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0aWNTeW1ib2wsIHRhcmdldEZ1bmN0aW9uLCBhcmdFeHByZXNzaW9ucywgZXhwcmVzc2lvblsnZXhwcmVzc2lvbiddKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIElHTk9SRTtcbiAgICAgICAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gZXhwcmVzc2lvbi5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIGlmIChleHByZXNzaW9uWydsaW5lJ10gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgc2VsZi5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogZXhwcmVzc2lvbi5jb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogZXhwcmVzc2lvblsnZmlsZU5hbWUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogZXhwcmVzc2lvblsnbGluZSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGV4cHJlc3Npb25bJ2NoYXJhY3RlciddXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc2VsZi5lcnJvcih7bWVzc2FnZSwgY29udGV4dDogZXhwcmVzc2lvbi5jb250ZXh0fSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBJR05PUkU7XG4gICAgICAgICAgICAgIGNhc2UgJ2lnbm9yZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG1hcFN0cmluZ01hcChleHByZXNzaW9uLCAodmFsdWUsIG5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChSRUZFUkVOQ0VfU0VULmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gVVNFX1ZBTFVFICYmIFBST1ZJREUgaW4gZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBwcm92aWRlciBleHByZXNzaW9uLCBjaGVjayBmb3Igc3BlY2lhbCB0b2tlbnMgdGhhdCBuZWVkIHRoZSB2YWx1ZVxuICAgICAgICAgICAgICAgIC8vIGR1cmluZyBhbmFseXNpcy5cbiAgICAgICAgICAgICAgICBjb25zdCBwcm92aWRlID0gc2ltcGxpZnkoZXhwcmVzc2lvbi5wcm92aWRlKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvdmlkZSA9PT0gc2VsZi5ST1VURVMgfHwgcHJvdmlkZSA9PSBzZWxmLkFOQUxZWkVfRk9SX0VOVFJZX0NPTVBPTkVOVFMpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBzaW1wbGlmeSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBzaW1wbGlmeUxhemlseSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2ltcGxpZnkodmFsdWUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJR05PUkU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzaW1wbGlmeSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdDogYW55O1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBzaW1wbGlmeUluQ29udGV4dChjb250ZXh0LCB2YWx1ZSwgMCwgbGF6eSA/IDEgOiAwKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAodGhpcy5lcnJvclJlY29yZGVyKSB7XG4gICAgICAgIHRoaXMucmVwb3J0RXJyb3IoZSwgY29udGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBmb3JtYXRNZXRhZGF0YUVycm9yKGUsIGNvbnRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2hvdWxkSWdub3JlKHJlc3VsdCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGdldFR5cGVNZXRhZGF0YSh0eXBlOiBTdGF0aWNTeW1ib2wpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgY29uc3QgcmVzb2x2ZWRTeW1ib2wgPSB0aGlzLnN5bWJvbFJlc29sdmVyLnJlc29sdmVTeW1ib2wodHlwZSk7XG4gICAgcmV0dXJuIHJlc29sdmVkU3ltYm9sICYmIHJlc29sdmVkU3ltYm9sLm1ldGFkYXRhID8gcmVzb2x2ZWRTeW1ib2wubWV0YWRhdGEgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtfX3N5bWJvbGljOiAnY2xhc3MnfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVwb3J0RXJyb3IoZXJyb3I6IEVycm9yLCBjb250ZXh0OiBTdGF0aWNTeW1ib2wsIHBhdGg/OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5lcnJvclJlY29yZGVyKSB7XG4gICAgICB0aGlzLmVycm9yUmVjb3JkZXIoXG4gICAgICAgICAgZm9ybWF0TWV0YWRhdGFFcnJvcihlcnJvciwgY29udGV4dCksIChjb250ZXh0ICYmIGNvbnRleHQuZmlsZVBhdGgpIHx8IHBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVycm9yKFxuICAgICAge21lc3NhZ2UsIHN1bW1hcnksIGFkdmlzZSwgcG9zaXRpb24sIGNvbnRleHQsIHZhbHVlLCBzeW1ib2wsIGNoYWlufToge1xuICAgICAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgICAgIHN1bW1hcnk/OiBzdHJpbmcsXG4gICAgICAgIGFkdmlzZT86IHN0cmluZyxcbiAgICAgICAgcG9zaXRpb24/OiBQb3NpdGlvbixcbiAgICAgICAgY29udGV4dD86IGFueSxcbiAgICAgICAgdmFsdWU/OiBhbnksXG4gICAgICAgIHN5bWJvbD86IFN0YXRpY1N5bWJvbCxcbiAgICAgICAgY2hhaW4/OiBNZXRhZGF0YU1lc3NhZ2VDaGFpblxuICAgICAgfSxcbiAgICAgIHJlcG9ydGluZ0NvbnRleHQ6IFN0YXRpY1N5bWJvbCkge1xuICAgIHRoaXMucmVwb3J0RXJyb3IoXG4gICAgICAgIG1ldGFkYXRhRXJyb3IobWVzc2FnZSwgc3VtbWFyeSwgYWR2aXNlLCBwb3NpdGlvbiwgc3ltYm9sLCBjb250ZXh0LCBjaGFpbiksXG4gICAgICAgIHJlcG9ydGluZ0NvbnRleHQpO1xuICB9XG59XG5cbmludGVyZmFjZSBQb3NpdGlvbiB7XG4gIGZpbGVOYW1lOiBzdHJpbmc7XG4gIGxpbmU6IG51bWJlcjtcbiAgY29sdW1uOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBNZXRhZGF0YU1lc3NhZ2VDaGFpbiB7XG4gIG1lc3NhZ2U6IHN0cmluZztcbiAgc3VtbWFyeT86IHN0cmluZztcbiAgcG9zaXRpb24/OiBQb3NpdGlvbjtcbiAgY29udGV4dD86IGFueTtcbiAgc3ltYm9sPzogU3RhdGljU3ltYm9sO1xuICBuZXh0PzogTWV0YWRhdGFNZXNzYWdlQ2hhaW47XG59XG5cbnR5cGUgTWV0YWRhdGFFcnJvciA9IEVycm9yJntcbiAgcG9zaXRpb24/OiBQb3NpdGlvbjtcbiAgYWR2aXNlPzogc3RyaW5nO1xuICBzdW1tYXJ5Pzogc3RyaW5nO1xuICBjb250ZXh0PzogYW55O1xuICBzeW1ib2w/OiBTdGF0aWNTeW1ib2w7XG4gIGNoYWluPzogTWV0YWRhdGFNZXNzYWdlQ2hhaW47XG59O1xuXG5jb25zdCBNRVRBREFUQV9FUlJPUiA9ICduZ01ldGFkYXRhRXJyb3InO1xuXG5mdW5jdGlvbiBtZXRhZGF0YUVycm9yKFxuICAgIG1lc3NhZ2U6IHN0cmluZywgc3VtbWFyeT86IHN0cmluZywgYWR2aXNlPzogc3RyaW5nLCBwb3NpdGlvbj86IFBvc2l0aW9uLCBzeW1ib2w/OiBTdGF0aWNTeW1ib2wsXG4gICAgY29udGV4dD86IGFueSwgY2hhaW4/OiBNZXRhZGF0YU1lc3NhZ2VDaGFpbik6IE1ldGFkYXRhRXJyb3Ige1xuICBjb25zdCBlcnJvciA9IHN5bnRheEVycm9yKG1lc3NhZ2UpIGFzIE1ldGFkYXRhRXJyb3I7XG4gIChlcnJvciBhcyBhbnkpW01FVEFEQVRBX0VSUk9SXSA9IHRydWU7XG4gIGlmIChhZHZpc2UpIGVycm9yLmFkdmlzZSA9IGFkdmlzZTtcbiAgaWYgKHBvc2l0aW9uKSBlcnJvci5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICBpZiAoc3VtbWFyeSkgZXJyb3Iuc3VtbWFyeSA9IHN1bW1hcnk7XG4gIGlmIChjb250ZXh0KSBlcnJvci5jb250ZXh0ID0gY29udGV4dDtcbiAgaWYgKGNoYWluKSBlcnJvci5jaGFpbiA9IGNoYWluO1xuICBpZiAoc3ltYm9sKSBlcnJvci5zeW1ib2wgPSBzeW1ib2w7XG4gIHJldHVybiBlcnJvcjtcbn1cblxuZnVuY3Rpb24gaXNNZXRhZGF0YUVycm9yKGVycm9yOiBFcnJvcik6IGVycm9yIGlzIE1ldGFkYXRhRXJyb3Ige1xuICByZXR1cm4gISEoZXJyb3IgYXMgYW55KVtNRVRBREFUQV9FUlJPUl07XG59XG5cbmNvbnN0IFJFRkVSRU5DRV9UT19OT05FWFBPUlRFRF9DTEFTUyA9ICdSZWZlcmVuY2UgdG8gbm9uLWV4cG9ydGVkIGNsYXNzJztcbmNvbnN0IFZBUklBQkxFX05PVF9JTklUSUFMSVpFRCA9ICdWYXJpYWJsZSBub3QgaW5pdGlhbGl6ZWQnO1xuY29uc3QgREVTVFJVQ1RVUkVfTk9UX1NVUFBPUlRFRCA9ICdEZXN0cnVjdHVyaW5nIG5vdCBzdXBwb3J0ZWQnO1xuY29uc3QgQ09VTERfTk9UX1JFU09MVkVfVFlQRSA9ICdDb3VsZCBub3QgcmVzb2x2ZSB0eXBlJztcbmNvbnN0IEZVTkNUSU9OX0NBTExfTk9UX1NVUFBPUlRFRCA9ICdGdW5jdGlvbiBjYWxsIG5vdCBzdXBwb3J0ZWQnO1xuY29uc3QgUkVGRVJFTkNFX1RPX0xPQ0FMX1NZTUJPTCA9ICdSZWZlcmVuY2UgdG8gYSBsb2NhbCBzeW1ib2wnO1xuY29uc3QgTEFNQkRBX05PVF9TVVBQT1JURUQgPSAnTGFtYmRhIG5vdCBzdXBwb3J0ZWQnO1xuXG5mdW5jdGlvbiBleHBhbmRlZE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nLCBjb250ZXh0OiBhbnkpOiBzdHJpbmcge1xuICBzd2l0Y2ggKG1lc3NhZ2UpIHtcbiAgICBjYXNlIFJFRkVSRU5DRV9UT19OT05FWFBPUlRFRF9DTEFTUzpcbiAgICAgIGlmIChjb250ZXh0ICYmIGNvbnRleHQuY2xhc3NOYW1lKSB7XG4gICAgICAgIHJldHVybiBgUmVmZXJlbmNlcyB0byBhIG5vbi1leHBvcnRlZCBjbGFzcyBhcmUgbm90IHN1cHBvcnRlZCBpbiBkZWNvcmF0b3JzIGJ1dCAke1xuICAgICAgICAgICAgY29udGV4dC5jbGFzc05hbWV9IHdhcyByZWZlcmVuY2VkLmA7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFZBUklBQkxFX05PVF9JTklUSUFMSVpFRDpcbiAgICAgIHJldHVybiAnT25seSBpbml0aWFsaXplZCB2YXJpYWJsZXMgYW5kIGNvbnN0YW50cyBjYW4gYmUgcmVmZXJlbmNlZCBpbiBkZWNvcmF0b3JzIGJlY2F1c2UgdGhlIHZhbHVlIG9mIHRoaXMgdmFyaWFibGUgaXMgbmVlZGVkIGJ5IHRoZSB0ZW1wbGF0ZSBjb21waWxlcic7XG4gICAgY2FzZSBERVNUUlVDVFVSRV9OT1RfU1VQUE9SVEVEOlxuICAgICAgcmV0dXJuICdSZWZlcmVuY2luZyBhbiBleHBvcnRlZCBkZXN0cnVjdHVyZWQgdmFyaWFibGUgb3IgY29uc3RhbnQgaXMgbm90IHN1cHBvcnRlZCBpbiBkZWNvcmF0b3JzIGFuZCB0aGlzIHZhbHVlIGlzIG5lZWRlZCBieSB0aGUgdGVtcGxhdGUgY29tcGlsZXInO1xuICAgIGNhc2UgQ09VTERfTk9UX1JFU09MVkVfVFlQRTpcbiAgICAgIGlmIChjb250ZXh0ICYmIGNvbnRleHQudHlwZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGBDb3VsZCBub3QgcmVzb2x2ZSB0eXBlICR7Y29udGV4dC50eXBlTmFtZX1gO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBGVU5DVElPTl9DQUxMX05PVF9TVVBQT1JURUQ6XG4gICAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0Lm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGBGdW5jdGlvbiBjYWxscyBhcmUgbm90IHN1cHBvcnRlZCBpbiBkZWNvcmF0b3JzIGJ1dCAnJHtjb250ZXh0Lm5hbWV9JyB3YXMgY2FsbGVkYDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAnRnVuY3Rpb24gY2FsbHMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gZGVjb3JhdG9ycyc7XG4gICAgY2FzZSBSRUZFUkVOQ0VfVE9fTE9DQUxfU1lNQk9MOlxuICAgICAgaWYgKGNvbnRleHQgJiYgY29udGV4dC5uYW1lKSB7XG4gICAgICAgIHJldHVybiBgUmVmZXJlbmNlIHRvIGEgbG9jYWwgKG5vbi1leHBvcnRlZCkgc3ltYm9scyBhcmUgbm90IHN1cHBvcnRlZCBpbiBkZWNvcmF0b3JzIGJ1dCAnJHtcbiAgICAgICAgICAgIGNvbnRleHQubmFtZX0nIHdhcyByZWZlcmVuY2VkYDtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgTEFNQkRBX05PVF9TVVBQT1JURUQ6XG4gICAgICByZXR1cm4gYEZ1bmN0aW9uIGV4cHJlc3Npb25zIGFyZSBub3Qgc3VwcG9ydGVkIGluIGRlY29yYXRvcnNgO1xuICB9XG4gIHJldHVybiBtZXNzYWdlO1xufVxuXG5mdW5jdGlvbiBtZXNzYWdlQWR2aXNlKG1lc3NhZ2U6IHN0cmluZywgY29udGV4dDogYW55KTogc3RyaW5nfHVuZGVmaW5lZCB7XG4gIHN3aXRjaCAobWVzc2FnZSkge1xuICAgIGNhc2UgUkVGRVJFTkNFX1RPX05PTkVYUE9SVEVEX0NMQVNTOlxuICAgICAgaWYgKGNvbnRleHQgJiYgY29udGV4dC5jbGFzc05hbWUpIHtcbiAgICAgICAgcmV0dXJuIGBDb25zaWRlciBleHBvcnRpbmcgJyR7Y29udGV4dC5jbGFzc05hbWV9J2A7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIERFU1RSVUNUVVJFX05PVF9TVVBQT1JURUQ6XG4gICAgICByZXR1cm4gJ0NvbnNpZGVyIHNpbXBsaWZ5aW5nIHRvIGF2b2lkIGRlc3RydWN0dXJpbmcnO1xuICAgIGNhc2UgUkVGRVJFTkNFX1RPX0xPQ0FMX1NZTUJPTDpcbiAgICAgIGlmIChjb250ZXh0ICYmIGNvbnRleHQubmFtZSkge1xuICAgICAgICByZXR1cm4gYENvbnNpZGVyIGV4cG9ydGluZyAnJHtjb250ZXh0Lm5hbWV9J2A7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIExBTUJEQV9OT1RfU1VQUE9SVEVEOlxuICAgICAgcmV0dXJuIGBDb25zaWRlciBjaGFuZ2luZyB0aGUgZnVuY3Rpb24gZXhwcmVzc2lvbiBpbnRvIGFuIGV4cG9ydGVkIGZ1bmN0aW9uYDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBlcnJvclN1bW1hcnkoZXJyb3I6IE1ldGFkYXRhRXJyb3IpOiBzdHJpbmcge1xuICBpZiAoZXJyb3Iuc3VtbWFyeSkge1xuICAgIHJldHVybiBlcnJvci5zdW1tYXJ5O1xuICB9XG4gIHN3aXRjaCAoZXJyb3IubWVzc2FnZSkge1xuICAgIGNhc2UgUkVGRVJFTkNFX1RPX05PTkVYUE9SVEVEX0NMQVNTOlxuICAgICAgaWYgKGVycm9yLmNvbnRleHQgJiYgZXJyb3IuY29udGV4dC5jbGFzc05hbWUpIHtcbiAgICAgICAgcmV0dXJuIGByZWZlcmVuY2VzIG5vbi1leHBvcnRlZCBjbGFzcyAke2Vycm9yLmNvbnRleHQuY2xhc3NOYW1lfWA7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFZBUklBQkxFX05PVF9JTklUSUFMSVpFRDpcbiAgICAgIHJldHVybiAnaXMgbm90IGluaXRpYWxpemVkJztcbiAgICBjYXNlIERFU1RSVUNUVVJFX05PVF9TVVBQT1JURUQ6XG4gICAgICByZXR1cm4gJ2lzIGEgZGVzdHJ1Y3R1cmVkIHZhcmlhYmxlJztcbiAgICBjYXNlIENPVUxEX05PVF9SRVNPTFZFX1RZUEU6XG4gICAgICByZXR1cm4gJ2NvdWxkIG5vdCBiZSByZXNvbHZlZCc7XG4gICAgY2FzZSBGVU5DVElPTl9DQUxMX05PVF9TVVBQT1JURUQ6XG4gICAgICBpZiAoZXJyb3IuY29udGV4dCAmJiBlcnJvci5jb250ZXh0Lm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGBjYWxscyAnJHtlcnJvci5jb250ZXh0Lm5hbWV9J2A7XG4gICAgICB9XG4gICAgICByZXR1cm4gYGNhbGxzIGEgZnVuY3Rpb25gO1xuICAgIGNhc2UgUkVGRVJFTkNFX1RPX0xPQ0FMX1NZTUJPTDpcbiAgICAgIGlmIChlcnJvci5jb250ZXh0ICYmIGVycm9yLmNvbnRleHQubmFtZSkge1xuICAgICAgICByZXR1cm4gYHJlZmVyZW5jZXMgbG9jYWwgdmFyaWFibGUgJHtlcnJvci5jb250ZXh0Lm5hbWV9YDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBgcmVmZXJlbmNlcyBhIGxvY2FsIHZhcmlhYmxlYDtcbiAgfVxuICByZXR1cm4gJ2NvbnRhaW5zIHRoZSBlcnJvcic7XG59XG5cbmZ1bmN0aW9uIG1hcFN0cmluZ01hcChpbnB1dDoge1trZXk6IHN0cmluZ106IGFueX0sIHRyYW5zZm9ybTogKHZhbHVlOiBhbnksIGtleTogc3RyaW5nKSA9PiBhbnkpOlxuICAgIHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgaWYgKCFpbnB1dCkgcmV0dXJuIHt9O1xuICBjb25zdCByZXN1bHQ6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge307XG4gIE9iamVjdC5rZXlzKGlucHV0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRyYW5zZm9ybShpbnB1dFtrZXldLCBrZXkpO1xuICAgIGlmICghc2hvdWxkSWdub3JlKHZhbHVlKSkge1xuICAgICAgaWYgKEhJRERFTl9LRVkudGVzdChrZXkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwge2VudW1lcmFibGU6IGZhbHNlLCBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZX0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShvOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIG8gPT09IG51bGwgfHwgKHR5cGVvZiBvICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvICE9PSAnb2JqZWN0Jyk7XG59XG5cbmludGVyZmFjZSBCaW5kaW5nU2NvcGVCdWlsZGVyIHtcbiAgZGVmaW5lKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IEJpbmRpbmdTY29wZUJ1aWxkZXI7XG4gIGRvbmUoKTogQmluZGluZ1Njb3BlO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBCaW5kaW5nU2NvcGUge1xuICBhYnN0cmFjdCByZXNvbHZlKG5hbWU6IHN0cmluZyk6IGFueTtcbiAgcHVibGljIHN0YXRpYyBtaXNzaW5nID0ge307XG4gIHB1YmxpYyBzdGF0aWMgZW1wdHk6IEJpbmRpbmdTY29wZSA9IHtyZXNvbHZlOiBuYW1lID0+IEJpbmRpbmdTY29wZS5taXNzaW5nfTtcblxuICBwdWJsaWMgc3RhdGljIGJ1aWxkKCk6IEJpbmRpbmdTY29wZUJ1aWxkZXIge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICAgIHJldHVybiB7XG4gICAgICBkZWZpbmU6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGN1cnJlbnQuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuICAgICAgZG9uZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50LnNpemUgPiAwID8gbmV3IFBvcHVsYXRlZFNjb3BlKGN1cnJlbnQpIDogQmluZGluZ1Njb3BlLmVtcHR5O1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuY2xhc3MgUG9wdWxhdGVkU2NvcGUgZXh0ZW5kcyBCaW5kaW5nU2NvcGUge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJpbmRpbmdzOiBNYXA8c3RyaW5nLCBhbnk+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIHJlc29sdmUobmFtZTogc3RyaW5nKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5iaW5kaW5ncy5oYXMobmFtZSkgPyB0aGlzLmJpbmRpbmdzLmdldChuYW1lKSA6IEJpbmRpbmdTY29wZS5taXNzaW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1ldGFkYXRhTWVzc2FnZUNoYWluKFxuICAgIGNoYWluOiBNZXRhZGF0YU1lc3NhZ2VDaGFpbiwgYWR2aXNlOiBzdHJpbmd8dW5kZWZpbmVkKTogRm9ybWF0dGVkTWVzc2FnZUNoYWluIHtcbiAgY29uc3QgZXhwYW5kZWQgPSBleHBhbmRlZE1lc3NhZ2UoY2hhaW4ubWVzc2FnZSwgY2hhaW4uY29udGV4dCk7XG4gIGNvbnN0IG5lc3RpbmcgPSBjaGFpbi5zeW1ib2wgPyBgIGluICcke2NoYWluLnN5bWJvbC5uYW1lfSdgIDogJyc7XG4gIGNvbnN0IG1lc3NhZ2UgPSBgJHtleHBhbmRlZH0ke25lc3Rpbmd9YDtcbiAgY29uc3QgcG9zaXRpb24gPSBjaGFpbi5wb3NpdGlvbjtcbiAgY29uc3QgbmV4dDogRm9ybWF0dGVkTWVzc2FnZUNoYWlufHVuZGVmaW5lZCA9IGNoYWluLm5leHQgP1xuICAgICAgZm9ybWF0TWV0YWRhdGFNZXNzYWdlQ2hhaW4oY2hhaW4ubmV4dCwgYWR2aXNlKSA6XG4gICAgICBhZHZpc2UgPyB7bWVzc2FnZTogYWR2aXNlfSA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIHttZXNzYWdlLCBwb3NpdGlvbiwgbmV4dDogbmV4dCA/IFtuZXh0XSA6IHVuZGVmaW5lZH07XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1ldGFkYXRhRXJyb3IoZTogRXJyb3IsIGNvbnRleHQ6IFN0YXRpY1N5bWJvbCk6IEVycm9yIHtcbiAgaWYgKGlzTWV0YWRhdGFFcnJvcihlKSkge1xuICAgIC8vIFByb2R1Y2UgYSBmb3JtYXR0ZWQgdmVyc2lvbiBvZiB0aGUgYW5kIGxlYXZpbmcgZW5vdWdoIGluZm9ybWF0aW9uIGluIHRoZSBvcmlnaW5hbCBlcnJvclxuICAgIC8vIHRvIHJlY292ZXIgdGhlIGZvcm1hdHRpbmcgaW5mb3JtYXRpb24gdG8gZXZlbnR1YWxseSBwcm9kdWNlIGEgZGlhZ25vc3RpYyBlcnJvciBtZXNzYWdlLlxuICAgIGNvbnN0IHBvc2l0aW9uID0gZS5wb3NpdGlvbjtcbiAgICBjb25zdCBjaGFpbjogTWV0YWRhdGFNZXNzYWdlQ2hhaW4gPSB7XG4gICAgICBtZXNzYWdlOiBgRXJyb3IgZHVyaW5nIHRlbXBsYXRlIGNvbXBpbGUgb2YgJyR7Y29udGV4dC5uYW1lfSdgLFxuICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgbmV4dDoge21lc3NhZ2U6IGUubWVzc2FnZSwgbmV4dDogZS5jaGFpbiwgY29udGV4dDogZS5jb250ZXh0LCBzeW1ib2w6IGUuc3ltYm9sfVxuICAgIH07XG4gICAgY29uc3QgYWR2aXNlID0gZS5hZHZpc2UgfHwgbWVzc2FnZUFkdmlzZShlLm1lc3NhZ2UsIGUuY29udGV4dCk7XG4gICAgcmV0dXJuIGZvcm1hdHRlZEVycm9yKGZvcm1hdE1ldGFkYXRhTWVzc2FnZUNoYWluKGNoYWluLCBhZHZpc2UpKTtcbiAgfVxuICByZXR1cm4gZTtcbn1cbiJdfQ==