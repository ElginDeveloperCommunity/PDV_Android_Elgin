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
        define("@angular/compiler-cli/src/ngtsc/annotations/src/ng_module", ["require", "exports", "tslib", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/incremental/semantic_graph", "@angular/compiler-cli/src/ngtsc/perf", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/transform", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/annotations/src/diagnostics", "@angular/compiler-cli/src/ngtsc/annotations/src/factory", "@angular/compiler-cli/src/ngtsc/annotations/src/metadata", "@angular/compiler-cli/src/ngtsc/annotations/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NgModuleDecoratorHandler = exports.NgModuleSymbol = void 0;
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var semantic_graph_1 = require("@angular/compiler-cli/src/ngtsc/incremental/semantic_graph");
    var perf_1 = require("@angular/compiler-cli/src/ngtsc/perf");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var transform_1 = require("@angular/compiler-cli/src/ngtsc/transform");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var diagnostics_2 = require("@angular/compiler-cli/src/ngtsc/annotations/src/diagnostics");
    var factory_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/factory");
    var metadata_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/metadata");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/util");
    /**
     * Represents an Angular NgModule.
     */
    var NgModuleSymbol = /** @class */ (function (_super) {
        tslib_1.__extends(NgModuleSymbol, _super);
        function NgModuleSymbol() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.remotelyScopedComponents = [];
            return _this;
        }
        NgModuleSymbol.prototype.isPublicApiAffected = function (previousSymbol) {
            if (!(previousSymbol instanceof NgModuleSymbol)) {
                return true;
            }
            // NgModules don't have a public API that could affect emit of Angular decorated classes.
            return false;
        };
        NgModuleSymbol.prototype.isEmitAffected = function (previousSymbol) {
            var e_1, _a;
            if (!(previousSymbol instanceof NgModuleSymbol)) {
                return true;
            }
            // compare our remotelyScopedComponents to the previous symbol
            if (previousSymbol.remotelyScopedComponents.length !== this.remotelyScopedComponents.length) {
                return true;
            }
            var _loop_1 = function (currEntry) {
                var prevEntry = previousSymbol.remotelyScopedComponents.find(function (prevEntry) {
                    return semantic_graph_1.isSymbolEqual(prevEntry.component, currEntry.component);
                });
                if (prevEntry === undefined) {
                    return { value: true };
                }
                if (!semantic_graph_1.isArrayEqual(currEntry.usedDirectives, prevEntry.usedDirectives, semantic_graph_1.isReferenceEqual)) {
                    return { value: true };
                }
                if (!semantic_graph_1.isArrayEqual(currEntry.usedPipes, prevEntry.usedPipes, semantic_graph_1.isReferenceEqual)) {
                    return { value: true };
                }
            };
            try {
                for (var _b = tslib_1.__values(this.remotelyScopedComponents), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var currEntry = _c.value;
                    var state_1 = _loop_1(currEntry);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return false;
        };
        NgModuleSymbol.prototype.isTypeCheckApiAffected = function (previousSymbol) {
            if (!(previousSymbol instanceof NgModuleSymbol)) {
                return true;
            }
            return false;
        };
        NgModuleSymbol.prototype.addRemotelyScopedComponent = function (component, usedDirectives, usedPipes) {
            this.remotelyScopedComponents.push({ component: component, usedDirectives: usedDirectives, usedPipes: usedPipes });
        };
        return NgModuleSymbol;
    }(semantic_graph_1.SemanticSymbol));
    exports.NgModuleSymbol = NgModuleSymbol;
    /**
     * Compiles @NgModule annotations to ngModuleDef fields.
     */
    var NgModuleDecoratorHandler = /** @class */ (function () {
        function NgModuleDecoratorHandler(reflector, evaluator, metaReader, metaRegistry, scopeRegistry, referencesRegistry, isCore, routeAnalyzer, refEmitter, factoryTracker, annotateForClosureCompiler, injectableRegistry, perf, localeId) {
            this.reflector = reflector;
            this.evaluator = evaluator;
            this.metaReader = metaReader;
            this.metaRegistry = metaRegistry;
            this.scopeRegistry = scopeRegistry;
            this.referencesRegistry = referencesRegistry;
            this.isCore = isCore;
            this.routeAnalyzer = routeAnalyzer;
            this.refEmitter = refEmitter;
            this.factoryTracker = factoryTracker;
            this.annotateForClosureCompiler = annotateForClosureCompiler;
            this.injectableRegistry = injectableRegistry;
            this.perf = perf;
            this.localeId = localeId;
            this.precedence = transform_1.HandlerPrecedence.PRIMARY;
            this.name = NgModuleDecoratorHandler.name;
        }
        NgModuleDecoratorHandler.prototype.detect = function (node, decorators) {
            if (!decorators) {
                return undefined;
            }
            var decorator = util_1.findAngularDecorator(decorators, 'NgModule', this.isCore);
            if (decorator !== undefined) {
                return {
                    trigger: decorator.node,
                    decorator: decorator,
                    metadata: decorator,
                };
            }
            else {
                return undefined;
            }
        };
        NgModuleDecoratorHandler.prototype.analyze = function (node, decorator) {
            var e_2, _a, _b, e_3, _c;
            var _this = this;
            this.perf.eventCount(perf_1.PerfEvent.AnalyzeNgModule);
            var name = node.name.text;
            if (decorator.args === null || decorator.args.length > 1) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, reflection_1.Decorator.nodeForError(decorator), "Incorrect number of arguments to @NgModule decorator");
            }
            // @NgModule can be invoked without arguments. In case it is, pretend as if a blank object
            // literal was specified. This simplifies the code below.
            var meta = decorator.args.length === 1 ? util_1.unwrapExpression(decorator.args[0]) :
                ts.createObjectLiteral([]);
            if (!ts.isObjectLiteralExpression(meta)) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARG_NOT_LITERAL, meta, '@NgModule argument must be an object literal');
            }
            var ngModule = reflection_1.reflectObjectLiteral(meta);
            if (ngModule.has('jit')) {
                // The only allowed value is true, so there's no need to expand further.
                return {};
            }
            var moduleResolvers = util_1.combineResolvers([
                function (ref) { return _this._extractModuleFromModuleWithProvidersFn(ref.node); },
                util_1.forwardRefResolver,
            ]);
            var diagnostics = [];
            // Extract the module declarations, imports, and exports.
            var declarationRefs = [];
            var rawDeclarations = null;
            if (ngModule.has('declarations')) {
                rawDeclarations = ngModule.get('declarations');
                var declarationMeta = this.evaluator.evaluate(rawDeclarations, util_1.forwardRefResolver);
                declarationRefs =
                    this.resolveTypeList(rawDeclarations, declarationMeta, name, 'declarations');
                try {
                    // Look through the declarations to make sure they're all a part of the current compilation.
                    for (var declarationRefs_1 = tslib_1.__values(declarationRefs), declarationRefs_1_1 = declarationRefs_1.next(); !declarationRefs_1_1.done; declarationRefs_1_1 = declarationRefs_1.next()) {
                        var ref = declarationRefs_1_1.value;
                        if (ref.node.getSourceFile().isDeclarationFile) {
                            var errorNode = ref.getOriginForDiagnostics(rawDeclarations);
                            diagnostics.push(diagnostics_1.makeDiagnostic(diagnostics_1.ErrorCode.NGMODULE_INVALID_DECLARATION, errorNode, "Cannot declare '" + ref.node.name
                                .text + "' in an NgModule as it's not a part of the current compilation.", [diagnostics_1.makeRelatedInformation(ref.node.name, "'" + ref.node.name.text + "' is declared here.")]));
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (declarationRefs_1_1 && !declarationRefs_1_1.done && (_a = declarationRefs_1.return)) _a.call(declarationRefs_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (diagnostics.length > 0) {
                return { diagnostics: diagnostics };
            }
            var importRefs = [];
            var rawImports = null;
            if (ngModule.has('imports')) {
                rawImports = ngModule.get('imports');
                var importsMeta = this.evaluator.evaluate(rawImports, moduleResolvers);
                importRefs = this.resolveTypeList(rawImports, importsMeta, name, 'imports');
            }
            var exportRefs = [];
            var rawExports = null;
            if (ngModule.has('exports')) {
                rawExports = ngModule.get('exports');
                var exportsMeta = this.evaluator.evaluate(rawExports, moduleResolvers);
                exportRefs = this.resolveTypeList(rawExports, exportsMeta, name, 'exports');
                (_b = this.referencesRegistry).add.apply(_b, tslib_1.__spreadArray([node], tslib_1.__read(exportRefs)));
            }
            var bootstrapRefs = [];
            if (ngModule.has('bootstrap')) {
                var expr = ngModule.get('bootstrap');
                var bootstrapMeta = this.evaluator.evaluate(expr, util_1.forwardRefResolver);
                bootstrapRefs = this.resolveTypeList(expr, bootstrapMeta, name, 'bootstrap');
            }
            var schemas = [];
            if (ngModule.has('schemas')) {
                var rawExpr = ngModule.get('schemas');
                var result = this.evaluator.evaluate(rawExpr);
                if (!Array.isArray(result)) {
                    throw diagnostics_2.createValueHasWrongTypeError(rawExpr, result, "NgModule.schemas must be an array");
                }
                try {
                    for (var result_1 = tslib_1.__values(result), result_1_1 = result_1.next(); !result_1_1.done; result_1_1 = result_1.next()) {
                        var schemaRef = result_1_1.value;
                        if (!(schemaRef instanceof imports_1.Reference)) {
                            throw diagnostics_2.createValueHasWrongTypeError(rawExpr, result, 'NgModule.schemas must be an array of schemas');
                        }
                        var id_1 = schemaRef.getIdentityIn(schemaRef.node.getSourceFile());
                        if (id_1 === null || schemaRef.ownedByModuleGuess !== '@angular/core') {
                            throw diagnostics_2.createValueHasWrongTypeError(rawExpr, result, 'NgModule.schemas must be an array of schemas');
                        }
                        // Since `id` is the `ts.Identifer` within the schema ref's declaration file, it's safe to
                        // use `id.text` here to figure out which schema is in use. Even if the actual reference was
                        // renamed when the user imported it, these names will match.
                        switch (id_1.text) {
                            case 'CUSTOM_ELEMENTS_SCHEMA':
                                schemas.push(compiler_1.CUSTOM_ELEMENTS_SCHEMA);
                                break;
                            case 'NO_ERRORS_SCHEMA':
                                schemas.push(compiler_1.NO_ERRORS_SCHEMA);
                                break;
                            default:
                                throw diagnostics_2.createValueHasWrongTypeError(rawExpr, schemaRef, "'" + schemaRef.debugName + "' is not a valid NgModule schema");
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (result_1_1 && !result_1_1.done && (_c = result_1.return)) _c.call(result_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            var id = ngModule.has('id') ? new compiler_1.WrappedNodeExpr(ngModule.get('id')) : null;
            var valueContext = node.getSourceFile();
            var typeContext = valueContext;
            var typeNode = this.reflector.getDtsDeclaration(node);
            if (typeNode !== null) {
                typeContext = typeNode.getSourceFile();
            }
            var bootstrap = bootstrapRefs.map(function (bootstrap) { return _this._toR3Reference(bootstrap, valueContext, typeContext); });
            var declarations = declarationRefs.map(function (decl) { return _this._toR3Reference(decl, valueContext, typeContext); });
            var imports = importRefs.map(function (imp) { return _this._toR3Reference(imp, valueContext, typeContext); });
            var exports = exportRefs.map(function (exp) { return _this._toR3Reference(exp, valueContext, typeContext); });
            var isForwardReference = function (ref) {
                return util_1.isExpressionForwardReference(ref.value, node.name, valueContext);
            };
            var containsForwardDecls = bootstrap.some(isForwardReference) ||
                declarations.some(isForwardReference) || imports.some(isForwardReference) ||
                exports.some(isForwardReference);
            var type = util_1.wrapTypeReference(this.reflector, node);
            var internalType = new compiler_1.WrappedNodeExpr(this.reflector.getInternalNameOfClass(node));
            var adjacentType = new compiler_1.WrappedNodeExpr(this.reflector.getAdjacentNameOfClass(node));
            var ngModuleMetadata = {
                type: type,
                internalType: internalType,
                adjacentType: adjacentType,
                bootstrap: bootstrap,
                declarations: declarations,
                exports: exports,
                imports: imports,
                containsForwardDecls: containsForwardDecls,
                id: id,
                emitInline: false,
                // TODO: to be implemented as a part of FW-1004.
                schemas: [],
            };
            var rawProviders = ngModule.has('providers') ? ngModule.get('providers') : null;
            var wrapperProviders = rawProviders !== null ?
                new compiler_1.WrappedNodeExpr(this.annotateForClosureCompiler ? util_1.wrapFunctionExpressionsInParens(rawProviders) :
                    rawProviders) :
                null;
            // At this point, only add the module's imports as the injectors' imports. Any exported modules
            // are added during `resolve`, as we need scope information to be able to filter out directives
            // and pipes from the module exports.
            var injectorImports = [];
            if (ngModule.has('imports')) {
                injectorImports.push(new compiler_1.WrappedNodeExpr(ngModule.get('imports')));
            }
            if (this.routeAnalyzer !== null) {
                this.routeAnalyzer.add(node.getSourceFile(), name, rawImports, rawExports, rawProviders);
            }
            var injectorMetadata = {
                name: name,
                type: type,
                internalType: internalType,
                providers: wrapperProviders,
                imports: injectorImports,
            };
            var factoryMetadata = {
                name: name,
                type: type,
                internalType: internalType,
                typeArgumentCount: 0,
                deps: util_1.getValidConstructorDependencies(node, this.reflector, this.isCore),
                target: compiler_1.FactoryTarget.NgModule,
            };
            return {
                analysis: {
                    id: id,
                    schemas: schemas,
                    mod: ngModuleMetadata,
                    inj: injectorMetadata,
                    fac: factoryMetadata,
                    declarations: declarationRefs,
                    rawDeclarations: rawDeclarations,
                    imports: importRefs,
                    exports: exportRefs,
                    providers: rawProviders,
                    providersRequiringFactory: rawProviders ?
                        util_1.resolveProvidersRequiringFactory(rawProviders, this.reflector, this.evaluator) :
                        null,
                    classMetadata: metadata_1.extractClassMetadata(node, this.reflector, this.isCore, this.annotateForClosureCompiler),
                    factorySymbolName: node.name.text,
                },
            };
        };
        NgModuleDecoratorHandler.prototype.symbol = function (node) {
            return new NgModuleSymbol(node);
        };
        NgModuleDecoratorHandler.prototype.register = function (node, analysis) {
            // Register this module's information with the LocalModuleScopeRegistry. This ensures that
            // during the compile() phase, the module's metadata is available for selector scope
            // computation.
            this.metaRegistry.registerNgModuleMetadata({
                ref: new imports_1.Reference(node),
                schemas: analysis.schemas,
                declarations: analysis.declarations,
                imports: analysis.imports,
                exports: analysis.exports,
                rawDeclarations: analysis.rawDeclarations,
            });
            if (this.factoryTracker !== null) {
                this.factoryTracker.track(node.getSourceFile(), {
                    name: analysis.factorySymbolName,
                    hasId: analysis.id !== null,
                });
            }
            this.injectableRegistry.registerInjectable(node);
        };
        NgModuleDecoratorHandler.prototype.resolve = function (node, analysis) {
            var e_4, _a, e_5, _b;
            var scope = this.scopeRegistry.getScopeOfModule(node);
            var diagnostics = [];
            var scopeDiagnostics = this.scopeRegistry.getDiagnosticsOfModule(node);
            if (scopeDiagnostics !== null) {
                diagnostics.push.apply(diagnostics, tslib_1.__spreadArray([], tslib_1.__read(scopeDiagnostics)));
            }
            if (analysis.providersRequiringFactory !== null) {
                var providerDiagnostics = diagnostics_2.getProviderDiagnostics(analysis.providersRequiringFactory, analysis.providers, this.injectableRegistry);
                diagnostics.push.apply(diagnostics, tslib_1.__spreadArray([], tslib_1.__read(providerDiagnostics)));
            }
            var data = {
                injectorImports: [],
            };
            if (scope !== null && !scope.compilation.isPoisoned) {
                // Using the scope information, extend the injector's imports using the modules that are
                // specified as module exports.
                var context = typescript_1.getSourceFile(node);
                try {
                    for (var _c = tslib_1.__values(analysis.exports), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var exportRef = _d.value;
                        if (isNgModule(exportRef.node, scope.compilation)) {
                            data.injectorImports.push(this.refEmitter.emit(exportRef, context).expression);
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                try {
                    for (var _e = tslib_1.__values(analysis.declarations), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var decl = _f.value;
                        var metadata = this.metaReader.getDirectiveMetadata(decl);
                        if (metadata !== null && metadata.selector === null) {
                            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DIRECTIVE_MISSING_SELECTOR, decl.node, "Directive " + decl.node.name.text + " has no selector, please add it!");
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
            if (diagnostics.length > 0) {
                return { diagnostics: diagnostics };
            }
            if (scope === null || scope.compilation.isPoisoned || scope.exported.isPoisoned ||
                scope.reexports === null) {
                return { data: data };
            }
            else {
                return {
                    data: data,
                    reexports: scope.reexports,
                };
            }
        };
        NgModuleDecoratorHandler.prototype.compileFull = function (node, _a, _b) {
            var inj = _a.inj, mod = _a.mod, fac = _a.fac, classMetadata = _a.classMetadata, declarations = _a.declarations;
            var injectorImports = _b.injectorImports;
            var factoryFn = factory_1.compileNgFactoryDefField(fac);
            var ngInjectorDef = compiler_1.compileInjector(this.mergeInjectorImports(inj, injectorImports));
            var ngModuleDef = compiler_1.compileNgModule(mod);
            var statements = ngModuleDef.statements;
            var metadata = classMetadata !== null ? compiler_1.compileClassMetadata(classMetadata) : null;
            this.insertMetadataStatement(statements, metadata);
            this.appendRemoteScopingStatements(statements, node, declarations);
            return this.compileNgModule(factoryFn, ngInjectorDef, ngModuleDef);
        };
        NgModuleDecoratorHandler.prototype.compilePartial = function (node, _a, _b) {
            var inj = _a.inj, fac = _a.fac, mod = _a.mod, classMetadata = _a.classMetadata;
            var injectorImports = _b.injectorImports;
            var factoryFn = factory_1.compileDeclareFactory(fac);
            var injectorDef = compiler_1.compileDeclareInjectorFromMetadata(this.mergeInjectorImports(inj, injectorImports));
            var ngModuleDef = compiler_1.compileDeclareNgModuleFromMetadata(mod);
            var metadata = classMetadata !== null ? compiler_1.compileDeclareClassMetadata(classMetadata) : null;
            this.insertMetadataStatement(ngModuleDef.statements, metadata);
            // NOTE: no remote scoping required as this is banned in partial compilation.
            return this.compileNgModule(factoryFn, injectorDef, ngModuleDef);
        };
        /**
         *  Merge the injector imports (which are 'exports' that were later found to be NgModules)
         *  computed during resolution with the ones from analysis.
         */
        NgModuleDecoratorHandler.prototype.mergeInjectorImports = function (inj, injectorImports) {
            return tslib_1.__assign(tslib_1.__assign({}, inj), { imports: tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(inj.imports)), tslib_1.__read(injectorImports)) });
        };
        /**
         * Add class metadata statements, if provided, to the `ngModuleStatements`.
         */
        NgModuleDecoratorHandler.prototype.insertMetadataStatement = function (ngModuleStatements, metadata) {
            if (metadata !== null) {
                ngModuleStatements.unshift(metadata.toStmt());
            }
        };
        /**
         * Add remote scoping statements, as needed, to the `ngModuleStatements`.
         */
        NgModuleDecoratorHandler.prototype.appendRemoteScopingStatements = function (ngModuleStatements, node, declarations) {
            var e_6, _a;
            var _this = this;
            var context = typescript_1.getSourceFile(node);
            try {
                for (var declarations_1 = tslib_1.__values(declarations), declarations_1_1 = declarations_1.next(); !declarations_1_1.done; declarations_1_1 = declarations_1.next()) {
                    var decl = declarations_1_1.value;
                    var remoteScope = this.scopeRegistry.getRemoteScope(decl.node);
                    if (remoteScope !== null) {
                        var directives = remoteScope.directives.map(function (directive) { return _this.refEmitter.emit(directive, context).expression; });
                        var pipes = remoteScope.pipes.map(function (pipe) { return _this.refEmitter.emit(pipe, context).expression; });
                        var directiveArray = new compiler_1.LiteralArrayExpr(directives);
                        var pipesArray = new compiler_1.LiteralArrayExpr(pipes);
                        var declExpr = this.refEmitter.emit(decl, context).expression;
                        var setComponentScope = new compiler_1.ExternalExpr(compiler_1.R3Identifiers.setComponentScope);
                        var callExpr = new compiler_1.InvokeFunctionExpr(setComponentScope, [declExpr, directiveArray, pipesArray]);
                        ngModuleStatements.push(callExpr.toStmt());
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (declarations_1_1 && !declarations_1_1.done && (_a = declarations_1.return)) _a.call(declarations_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
        };
        NgModuleDecoratorHandler.prototype.compileNgModule = function (factoryFn, injectorDef, ngModuleDef) {
            var res = [
                factoryFn,
                {
                    name: 'ɵmod',
                    initializer: ngModuleDef.expression,
                    statements: ngModuleDef.statements,
                    type: ngModuleDef.type,
                },
                {
                    name: 'ɵinj',
                    initializer: injectorDef.expression,
                    statements: injectorDef.statements,
                    type: injectorDef.type,
                },
            ];
            if (this.localeId) {
                // QUESTION: can this stuff be removed?
                res.push({
                    name: 'ɵloc',
                    initializer: new compiler_1.LiteralExpr(this.localeId),
                    statements: [],
                    type: compiler_1.STRING_TYPE
                });
            }
            return res;
        };
        NgModuleDecoratorHandler.prototype._toR3Reference = function (valueRef, valueContext, typeContext) {
            if (valueRef.hasOwningModuleGuess) {
                return util_1.toR3Reference(valueRef, valueRef, valueContext, valueContext, this.refEmitter);
            }
            else {
                var typeRef = valueRef;
                var typeNode = this.reflector.getDtsDeclaration(typeRef.node);
                if (typeNode !== null && reflection_1.isNamedClassDeclaration(typeNode)) {
                    typeRef = new imports_1.Reference(typeNode);
                }
                return util_1.toR3Reference(valueRef, typeRef, valueContext, typeContext, this.refEmitter);
            }
        };
        /**
         * Given a `FunctionDeclaration`, `MethodDeclaration` or `FunctionExpression`, check if it is
         * typed as a `ModuleWithProviders` and return an expression referencing the module if available.
         */
        NgModuleDecoratorHandler.prototype._extractModuleFromModuleWithProvidersFn = function (node) {
            var type = node.type || null;
            return type &&
                (this._reflectModuleFromTypeParam(type, node) || this._reflectModuleFromLiteralType(type));
        };
        /**
         * Retrieve an `NgModule` identifier (T) from the specified `type`, if it is of the form:
         * `ModuleWithProviders<T>`
         * @param type The type to reflect on.
         * @returns the identifier of the NgModule type if found, or null otherwise.
         */
        NgModuleDecoratorHandler.prototype._reflectModuleFromTypeParam = function (type, node) {
            // Examine the type of the function to see if it's a ModuleWithProviders reference.
            if (!ts.isTypeReferenceNode(type)) {
                return null;
            }
            var typeName = type &&
                (ts.isIdentifier(type.typeName) && type.typeName ||
                    ts.isQualifiedName(type.typeName) && type.typeName.right) ||
                null;
            if (typeName === null) {
                return null;
            }
            // Look at the type itself to see where it comes from.
            var id = this.reflector.getImportOfIdentifier(typeName);
            // If it's not named ModuleWithProviders, bail.
            if (id === null || id.name !== 'ModuleWithProviders') {
                return null;
            }
            // If it's not from @angular/core, bail.
            if (!this.isCore && id.from !== '@angular/core') {
                return null;
            }
            // If there's no type parameter specified, bail.
            if (type.typeArguments === undefined || type.typeArguments.length !== 1) {
                var parent_1 = ts.isMethodDeclaration(node) && ts.isClassDeclaration(node.parent) ? node.parent : null;
                var symbolName = (parent_1 && parent_1.name ? parent_1.name.getText() + '.' : '') +
                    (node.name ? node.name.getText() : 'anonymous');
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.NGMODULE_MODULE_WITH_PROVIDERS_MISSING_GENERIC, type, symbolName + " returns a ModuleWithProviders type without a generic type argument. " +
                    "Please add a generic type argument to the ModuleWithProviders type. If this " +
                    "occurrence is in library code you don't control, please contact the library authors.");
            }
            var arg = type.typeArguments[0];
            return reflection_1.typeNodeToValueExpr(arg);
        };
        /**
         * Retrieve an `NgModule` identifier (T) from the specified `type`, if it is of the form:
         * `A|B|{ngModule: T}|C`.
         * @param type The type to reflect on.
         * @returns the identifier of the NgModule type if found, or null otherwise.
         */
        NgModuleDecoratorHandler.prototype._reflectModuleFromLiteralType = function (type) {
            var e_7, _a, e_8, _b;
            if (!ts.isIntersectionTypeNode(type)) {
                return null;
            }
            try {
                for (var _c = tslib_1.__values(type.types), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var t = _d.value;
                    if (ts.isTypeLiteralNode(t)) {
                        try {
                            for (var _e = (e_8 = void 0, tslib_1.__values(t.members)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var m = _f.value;
                                var ngModuleType = ts.isPropertySignature(m) && ts.isIdentifier(m.name) &&
                                    m.name.text === 'ngModule' && m.type ||
                                    null;
                                var ngModuleExpression = ngModuleType && reflection_1.typeNodeToValueExpr(ngModuleType);
                                if (ngModuleExpression) {
                                    return ngModuleExpression;
                                }
                            }
                        }
                        catch (e_8_1) { e_8 = { error: e_8_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_8) throw e_8.error; }
                        }
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_7) throw e_7.error; }
            }
            return null;
        };
        // Verify that a "Declaration" reference is a `ClassDeclaration` reference.
        NgModuleDecoratorHandler.prototype.isClassDeclarationReference = function (ref) {
            return this.reflector.isClass(ref.node);
        };
        /**
         * Compute a list of `Reference`s from a resolved metadata value.
         */
        NgModuleDecoratorHandler.prototype.resolveTypeList = function (expr, resolvedList, className, arrayName) {
            var _this = this;
            var refList = [];
            if (!Array.isArray(resolvedList)) {
                throw diagnostics_2.createValueHasWrongTypeError(expr, resolvedList, "Expected array when reading the NgModule." + arrayName + " of " + className);
            }
            resolvedList.forEach(function (entry, idx) {
                // Unwrap ModuleWithProviders for modules that are locally declared (and thus static
                // resolution was able to descend into the function and return an object literal, a Map).
                if (entry instanceof Map && entry.has('ngModule')) {
                    entry = entry.get('ngModule');
                }
                if (Array.isArray(entry)) {
                    // Recurse into nested arrays.
                    refList.push.apply(refList, tslib_1.__spreadArray([], tslib_1.__read(_this.resolveTypeList(expr, entry, className, arrayName))));
                }
                else if (entry instanceof imports_1.Reference) {
                    if (!_this.isClassDeclarationReference(entry)) {
                        throw diagnostics_2.createValueHasWrongTypeError(entry.node, entry, "Value at position " + idx + " in the NgModule." + arrayName + " of " + className + " is not a class");
                    }
                    refList.push(entry);
                }
                else {
                    // TODO(alxhub): Produce a better diagnostic here - the array index may be an inner array.
                    throw diagnostics_2.createValueHasWrongTypeError(expr, entry, "Value at position " + idx + " in the NgModule." + arrayName + " of " + className + " is not a reference");
                }
            });
            return refList;
        };
        return NgModuleDecoratorHandler;
    }());
    exports.NgModuleDecoratorHandler = NgModuleDecoratorHandler;
    function isNgModule(node, compilation) {
        return !compilation.directives.some(function (directive) { return directive.ref.node === node; }) &&
            !compilation.pipes.some(function (pipe) { return pipe.ref.node === node; });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9hbm5vdGF0aW9ucy9zcmMvbmdfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCw4Q0FBOGdCO0lBQzlnQiwrQkFBaUM7SUFFakMsMkVBQTBHO0lBQzFHLG1FQUEwRDtJQUMxRCw2RkFBa0k7SUFHbEksNkRBQW1EO0lBQ25ELHlFQUFpSjtJQUlqSix1RUFBZ0k7SUFDaEksa0ZBQXdEO0lBRXhELDJGQUFtRjtJQUNuRixtRkFBMEU7SUFDMUUscUZBQWdEO0lBRWhELDZFQUF3UTtJQXNCeFE7O09BRUc7SUFDSDtRQUFvQywwQ0FBYztRQUFsRDtZQUFBLHFFQWtFQztZQWpFUyw4QkFBd0IsR0FJMUIsRUFBRSxDQUFDOztRQTZEWCxDQUFDO1FBM0RVLDRDQUFtQixHQUE1QixVQUE2QixjQUE4QjtZQUN6RCxJQUFJLENBQUMsQ0FBQyxjQUFjLFlBQVksY0FBYyxDQUFDLEVBQUU7Z0JBQy9DLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCx5RkFBeUY7WUFDekYsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRVEsdUNBQWMsR0FBdkIsVUFBd0IsY0FBOEI7O1lBQ3BELElBQUksQ0FBQyxDQUFDLGNBQWMsWUFBWSxjQUFjLENBQUMsRUFBRTtnQkFDL0MsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELDhEQUE4RDtZQUM5RCxJQUFJLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRTtnQkFDM0YsT0FBTyxJQUFJLENBQUM7YUFDYjtvQ0FFVSxTQUFTO2dCQUNsQixJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFVBQUEsU0FB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QUM7SUFDOUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvbXBpbGVDbGFzc01ldGFkYXRhLCBjb21waWxlRGVjbGFyZUNsYXNzTWV0YWRhdGEsIGNvbXBpbGVEZWNsYXJlSW5qZWN0b3JGcm9tTWV0YWRhdGEsIGNvbXBpbGVEZWNsYXJlTmdNb2R1bGVGcm9tTWV0YWRhdGEsIGNvbXBpbGVJbmplY3RvciwgY29tcGlsZU5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BLCBFeHByZXNzaW9uLCBFeHRlcm5hbEV4cHIsIEZhY3RvcnlUYXJnZXQsIElkZW50aWZpZXJzIGFzIFIzLCBJbnZva2VGdW5jdGlvbkV4cHIsIExpdGVyYWxBcnJheUV4cHIsIExpdGVyYWxFeHByLCBOT19FUlJPUlNfU0NIRU1BLCBSM0NsYXNzTWV0YWRhdGEsIFIzQ29tcGlsZWRFeHByZXNzaW9uLCBSM0ZhY3RvcnlNZXRhZGF0YSwgUjNJZGVudGlmaWVycywgUjNJbmplY3Rvck1ldGFkYXRhLCBSM05nTW9kdWxlTWV0YWRhdGEsIFIzUmVmZXJlbmNlLCBTY2hlbWFNZXRhZGF0YSwgU3RhdGVtZW50LCBTVFJJTkdfVFlQRSwgV3JhcHBlZE5vZGVFeHByfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtFcnJvckNvZGUsIEZhdGFsRGlhZ25vc3RpY0Vycm9yLCBtYWtlRGlhZ25vc3RpYywgbWFrZVJlbGF0ZWRJbmZvcm1hdGlvbn0gZnJvbSAnLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtSZWZlcmVuY2UsIFJlZmVyZW5jZUVtaXR0ZXJ9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuaW1wb3J0IHtpc0FycmF5RXF1YWwsIGlzUmVmZXJlbmNlRXF1YWwsIGlzU3ltYm9sRXF1YWwsIFNlbWFudGljUmVmZXJlbmNlLCBTZW1hbnRpY1N5bWJvbH0gZnJvbSAnLi4vLi4vaW5jcmVtZW50YWwvc2VtYW50aWNfZ3JhcGgnO1xuaW1wb3J0IHtJbmplY3RhYmxlQ2xhc3NSZWdpc3RyeSwgTWV0YWRhdGFSZWFkZXIsIE1ldGFkYXRhUmVnaXN0cnl9IGZyb20gJy4uLy4uL21ldGFkYXRhJztcbmltcG9ydCB7UGFydGlhbEV2YWx1YXRvciwgUmVzb2x2ZWRWYWx1ZX0gZnJvbSAnLi4vLi4vcGFydGlhbF9ldmFsdWF0b3InO1xuaW1wb3J0IHtQZXJmRXZlbnQsIFBlcmZSZWNvcmRlcn0gZnJvbSAnLi4vLi4vcGVyZic7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb24sIERlY29yYXRvciwgaXNOYW1lZENsYXNzRGVjbGFyYXRpb24sIFJlZmxlY3Rpb25Ib3N0LCByZWZsZWN0T2JqZWN0TGl0ZXJhbCwgdHlwZU5vZGVUb1ZhbHVlRXhwcn0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge05nTW9kdWxlUm91dGVBbmFseXplcn0gZnJvbSAnLi4vLi4vcm91dGluZyc7XG5pbXBvcnQge0xvY2FsTW9kdWxlU2NvcGVSZWdpc3RyeSwgU2NvcGVEYXRhfSBmcm9tICcuLi8uLi9zY29wZSc7XG5pbXBvcnQge0ZhY3RvcnlUcmFja2VyfSBmcm9tICcuLi8uLi9zaGltcy9hcGknO1xuaW1wb3J0IHtBbmFseXNpc091dHB1dCwgQ29tcGlsZVJlc3VsdCwgRGVjb3JhdG9ySGFuZGxlciwgRGV0ZWN0UmVzdWx0LCBIYW5kbGVyUHJlY2VkZW5jZSwgUmVzb2x2ZVJlc3VsdH0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7Z2V0U291cmNlRmlsZX0gZnJvbSAnLi4vLi4vdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Y3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvciwgZ2V0UHJvdmlkZXJEaWFnbm9zdGljc30gZnJvbSAnLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge2NvbXBpbGVEZWNsYXJlRmFjdG9yeSwgY29tcGlsZU5nRmFjdG9yeURlZkZpZWxkfSBmcm9tICcuL2ZhY3RvcnknO1xuaW1wb3J0IHtleHRyYWN0Q2xhc3NNZXRhZGF0YX0gZnJvbSAnLi9tZXRhZGF0YSc7XG5pbXBvcnQge1JlZmVyZW5jZXNSZWdpc3RyeX0gZnJvbSAnLi9yZWZlcmVuY2VzX3JlZ2lzdHJ5JztcbmltcG9ydCB7Y29tYmluZVJlc29sdmVycywgZmluZEFuZ3VsYXJEZWNvcmF0b3IsIGZvcndhcmRSZWZSZXNvbHZlciwgZ2V0VmFsaWRDb25zdHJ1Y3RvckRlcGVuZGVuY2llcywgaXNFeHByZXNzaW9uRm9yd2FyZFJlZmVyZW5jZSwgcmVzb2x2ZVByb3ZpZGVyc1JlcXVpcmluZ0ZhY3RvcnksIHRvUjNSZWZlcmVuY2UsIHVud3JhcEV4cHJlc3Npb24sIHdyYXBGdW5jdGlvbkV4cHJlc3Npb25zSW5QYXJlbnMsIHdyYXBUeXBlUmVmZXJlbmNlfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE5nTW9kdWxlQW5hbHlzaXMge1xuICBtb2Q6IFIzTmdNb2R1bGVNZXRhZGF0YTtcbiAgaW5qOiBSM0luamVjdG9yTWV0YWRhdGE7XG4gIGZhYzogUjNGYWN0b3J5TWV0YWRhdGE7XG4gIGNsYXNzTWV0YWRhdGE6IFIzQ2xhc3NNZXRhZGF0YXxudWxsO1xuICBkZWNsYXJhdGlvbnM6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPltdO1xuICByYXdEZWNsYXJhdGlvbnM6IHRzLkV4cHJlc3Npb258bnVsbDtcbiAgc2NoZW1hczogU2NoZW1hTWV0YWRhdGFbXTtcbiAgaW1wb3J0czogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+W107XG4gIGV4cG9ydHM6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPltdO1xuICBpZDogRXhwcmVzc2lvbnxudWxsO1xuICBmYWN0b3J5U3ltYm9sTmFtZTogc3RyaW5nO1xuICBwcm92aWRlcnNSZXF1aXJpbmdGYWN0b3J5OiBTZXQ8UmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+PnxudWxsO1xuICBwcm92aWRlcnM6IHRzLkV4cHJlc3Npb258bnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZ01vZHVsZVJlc29sdXRpb24ge1xuICBpbmplY3RvckltcG9ydHM6IEV4cHJlc3Npb25bXTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIEFuZ3VsYXIgTmdNb2R1bGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ01vZHVsZVN5bWJvbCBleHRlbmRzIFNlbWFudGljU3ltYm9sIHtcbiAgcHJpdmF0ZSByZW1vdGVseVNjb3BlZENvbXBvbmVudHM6IHtcbiAgICBjb21wb25lbnQ6IFNlbWFudGljU3ltYm9sLFxuICAgIHVzZWREaXJlY3RpdmVzOiBTZW1hbnRpY1JlZmVyZW5jZVtdLFxuICAgIHVzZWRQaXBlczogU2VtYW50aWNSZWZlcmVuY2VbXVxuICB9W10gPSBbXTtcblxuICBvdmVycmlkZSBpc1B1YmxpY0FwaUFmZmVjdGVkKHByZXZpb3VzU3ltYm9sOiBTZW1hbnRpY1N5bWJvbCk6IGJvb2xlYW4ge1xuICAgIGlmICghKHByZXZpb3VzU3ltYm9sIGluc3RhbmNlb2YgTmdNb2R1bGVTeW1ib2wpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBOZ01vZHVsZXMgZG9uJ3QgaGF2ZSBhIHB1YmxpYyBBUEkgdGhhdCBjb3VsZCBhZmZlY3QgZW1pdCBvZiBBbmd1bGFyIGRlY29yYXRlZCBjbGFzc2VzLlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzRW1pdEFmZmVjdGVkKHByZXZpb3VzU3ltYm9sOiBTZW1hbnRpY1N5bWJvbCk6IGJvb2xlYW4ge1xuICAgIGlmICghKHByZXZpb3VzU3ltYm9sIGluc3RhbmNlb2YgTmdNb2R1bGVTeW1ib2wpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjb21wYXJlIG91ciByZW1vdGVseVNjb3BlZENvbXBvbmVudHMgdG8gdGhlIHByZXZpb3VzIHN5bWJvbFxuICAgIGlmIChwcmV2aW91c1N5bWJvbC5yZW1vdGVseVNjb3BlZENvbXBvbmVudHMubGVuZ3RoICE9PSB0aGlzLnJlbW90ZWx5U2NvcGVkQ29tcG9uZW50cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY3VyckVudHJ5IG9mIHRoaXMucmVtb3RlbHlTY29wZWRDb21wb25lbnRzKSB7XG4gICAgICBjb25zdCBwcmV2RW50cnkgPSBwcmV2aW91c1N5bWJvbC5yZW1vdGVseVNjb3BlZENvbXBvbmVudHMuZmluZChwcmV2RW50cnkgPT4ge1xuICAgICAgICByZXR1cm4gaXNTeW1ib2xFcXVhbChwcmV2RW50cnkuY29tcG9uZW50LCBjdXJyRW50cnkuY29tcG9uZW50KTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocHJldkVudHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTm8gcHJldmlvdXMgZW50cnkgd2FzIGZvdW5kLCB3aGljaCBtZWFucyB0aGF0IHRoaXMgY29tcG9uZW50IGJlY2FtZSByZW1vdGVseSBzY29wZWQgYW5kXG4gICAgICAgIC8vIGhlbmNlIHRoaXMgTmdNb2R1bGUgbmVlZHMgdG8gYmUgcmUtZW1pdHRlZC5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNBcnJheUVxdWFsKGN1cnJFbnRyeS51c2VkRGlyZWN0aXZlcywgcHJldkVudHJ5LnVzZWREaXJlY3RpdmVzLCBpc1JlZmVyZW5jZUVxdWFsKSkge1xuICAgICAgICAvLyBUaGUgbGlzdCBvZiB1c2VkIGRpcmVjdGl2ZXMgb3IgdGhlaXIgb3JkZXIgaGFzIGNoYW5nZWQuIFNpbmNlIHRoaXMgTmdNb2R1bGUgZW1pdHNcbiAgICAgICAgLy8gcmVmZXJlbmNlcyB0byB0aGUgbGlzdCBvZiB1c2VkIGRpcmVjdGl2ZXMsIGl0IHNob3VsZCBiZSByZS1lbWl0dGVkIHRvIHVwZGF0ZSB0aGlzIGxpc3QuXG4gICAgICAgIC8vIE5vdGU6IHRoZSBOZ01vZHVsZSBkb2VzIG5vdCBoYXZlIHRvIGJlIHJlLWVtaXR0ZWQgd2hlbiBhbnkgb2YgdGhlIGRpcmVjdGl2ZXMgaGFzIGhhZFxuICAgICAgICAvLyB0aGVpciBwdWJsaWMgQVBJIGNoYW5nZWQsIGFzIHRoZSBOZ01vZHVsZSBvbmx5IGVtaXRzIGEgcmVmZXJlbmNlIHRvIHRoZSBzeW1ib2wgYnkgaXRzXG4gICAgICAgIC8vIG5hbWUuIFRoZXJlZm9yZSwgdGVzdGluZyBmb3Igc3ltYm9sIGVxdWFsaXR5IGlzIHN1ZmZpY2llbnQuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzQXJyYXlFcXVhbChjdXJyRW50cnkudXNlZFBpcGVzLCBwcmV2RW50cnkudXNlZFBpcGVzLCBpc1JlZmVyZW5jZUVxdWFsKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNUeXBlQ2hlY2tBcGlBZmZlY3RlZChwcmV2aW91c1N5bWJvbDogU2VtYW50aWNTeW1ib2wpOiBib29sZWFuIHtcbiAgICBpZiAoIShwcmV2aW91c1N5bWJvbCBpbnN0YW5jZW9mIE5nTW9kdWxlU3ltYm9sKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWRkUmVtb3RlbHlTY29wZWRDb21wb25lbnQoXG4gICAgICBjb21wb25lbnQ6IFNlbWFudGljU3ltYm9sLCB1c2VkRGlyZWN0aXZlczogU2VtYW50aWNSZWZlcmVuY2VbXSxcbiAgICAgIHVzZWRQaXBlczogU2VtYW50aWNSZWZlcmVuY2VbXSk6IHZvaWQge1xuICAgIHRoaXMucmVtb3RlbHlTY29wZWRDb21wb25lbnRzLnB1c2goe2NvbXBvbmVudCwgdXNlZERpcmVjdGl2ZXMsIHVzZWRQaXBlc30pO1xuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZXMgQE5nTW9kdWxlIGFubm90YXRpb25zIHRvIG5nTW9kdWxlRGVmIGZpZWxkcy5cbiAqL1xuZXhwb3J0IGNsYXNzIE5nTW9kdWxlRGVjb3JhdG9ySGFuZGxlciBpbXBsZW1lbnRzXG4gICAgRGVjb3JhdG9ySGFuZGxlcjxEZWNvcmF0b3IsIE5nTW9kdWxlQW5hbHlzaXMsIE5nTW9kdWxlU3ltYm9sLCBOZ01vZHVsZVJlc29sdXRpb24+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJlZmxlY3RvcjogUmVmbGVjdGlvbkhvc3QsIHByaXZhdGUgZXZhbHVhdG9yOiBQYXJ0aWFsRXZhbHVhdG9yLFxuICAgICAgcHJpdmF0ZSBtZXRhUmVhZGVyOiBNZXRhZGF0YVJlYWRlciwgcHJpdmF0ZSBtZXRhUmVnaXN0cnk6IE1ldGFkYXRhUmVnaXN0cnksXG4gICAgICBwcml2YXRlIHNjb3BlUmVnaXN0cnk6IExvY2FsTW9kdWxlU2NvcGVSZWdpc3RyeSxcbiAgICAgIHByaXZhdGUgcmVmZXJlbmNlc1JlZ2lzdHJ5OiBSZWZlcmVuY2VzUmVnaXN0cnksIHByaXZhdGUgaXNDb3JlOiBib29sZWFuLFxuICAgICAgcHJpdmF0ZSByb3V0ZUFuYWx5emVyOiBOZ01vZHVsZVJvdXRlQW5hbHl6ZXJ8bnVsbCwgcHJpdmF0ZSByZWZFbWl0dGVyOiBSZWZlcmVuY2VFbWl0dGVyLFxuICAgICAgcHJpdmF0ZSBmYWN0b3J5VHJhY2tlcjogRmFjdG9yeVRyYWNrZXJ8bnVsbCwgcHJpdmF0ZSBhbm5vdGF0ZUZvckNsb3N1cmVDb21waWxlcjogYm9vbGVhbixcbiAgICAgIHByaXZhdGUgaW5qZWN0YWJsZVJlZ2lzdHJ5OiBJbmplY3RhYmxlQ2xhc3NSZWdpc3RyeSwgcHJpdmF0ZSBwZXJmOiBQZXJmUmVjb3JkZXIsXG4gICAgICBwcml2YXRlIGxvY2FsZUlkPzogc3RyaW5nKSB7fVxuXG4gIHJlYWRvbmx5IHByZWNlZGVuY2UgPSBIYW5kbGVyUHJlY2VkZW5jZS5QUklNQVJZO1xuICByZWFkb25seSBuYW1lID0gTmdNb2R1bGVEZWNvcmF0b3JIYW5kbGVyLm5hbWU7XG5cbiAgZGV0ZWN0KG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGRlY29yYXRvcnM6IERlY29yYXRvcltdfG51bGwpOiBEZXRlY3RSZXN1bHQ8RGVjb3JhdG9yPnx1bmRlZmluZWQge1xuICAgIGlmICghZGVjb3JhdG9ycykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgZGVjb3JhdG9yID0gZmluZEFuZ3VsYXJEZWNvcmF0b3IoZGVjb3JhdG9ycywgJ05nTW9kdWxlJywgdGhpcy5pc0NvcmUpO1xuICAgIGlmIChkZWNvcmF0b3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJpZ2dlcjogZGVjb3JhdG9yLm5vZGUsXG4gICAgICAgIGRlY29yYXRvcjogZGVjb3JhdG9yLFxuICAgICAgICBtZXRhZGF0YTogZGVjb3JhdG9yLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBhbmFseXplKG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGRlY29yYXRvcjogUmVhZG9ubHk8RGVjb3JhdG9yPik6XG4gICAgICBBbmFseXNpc091dHB1dDxOZ01vZHVsZUFuYWx5c2lzPiB7XG4gICAgdGhpcy5wZXJmLmV2ZW50Q291bnQoUGVyZkV2ZW50LkFuYWx5emVOZ01vZHVsZSk7XG5cbiAgICBjb25zdCBuYW1lID0gbm9kZS5uYW1lLnRleHQ7XG4gICAgaWYgKGRlY29yYXRvci5hcmdzID09PSBudWxsIHx8IGRlY29yYXRvci5hcmdzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX0FSSVRZX1dST05HLCBEZWNvcmF0b3Iubm9kZUZvckVycm9yKGRlY29yYXRvciksXG4gICAgICAgICAgYEluY29ycmVjdCBudW1iZXIgb2YgYXJndW1lbnRzIHRvIEBOZ01vZHVsZSBkZWNvcmF0b3JgKTtcbiAgICB9XG5cbiAgICAvLyBATmdNb2R1bGUgY2FuIGJlIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMuIEluIGNhc2UgaXQgaXMsIHByZXRlbmQgYXMgaWYgYSBibGFuayBvYmplY3RcbiAgICAvLyBsaXRlcmFsIHdhcyBzcGVjaWZpZWQuIFRoaXMgc2ltcGxpZmllcyB0aGUgY29kZSBiZWxvdy5cbiAgICBjb25zdCBtZXRhID0gZGVjb3JhdG9yLmFyZ3MubGVuZ3RoID09PSAxID8gdW53cmFwRXhwcmVzc2lvbihkZWNvcmF0b3IuYXJnc1swXSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cy5jcmVhdGVPYmplY3RMaXRlcmFsKFtdKTtcblxuICAgIGlmICghdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihtZXRhKSkge1xuICAgICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICAgIEVycm9yQ29kZS5ERUNPUkFUT1JfQVJHX05PVF9MSVRFUkFMLCBtZXRhLFxuICAgICAgICAgICdATmdNb2R1bGUgYXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QgbGl0ZXJhbCcpO1xuICAgIH1cbiAgICBjb25zdCBuZ01vZHVsZSA9IHJlZmxlY3RPYmplY3RMaXRlcmFsKG1ldGEpO1xuXG4gICAgaWYgKG5nTW9kdWxlLmhhcygnaml0JykpIHtcbiAgICAgIC8vIFRoZSBvbmx5IGFsbG93ZWQgdmFsdWUgaXMgdHJ1ZSwgc28gdGhlcmUncyBubyBuZWVkIHRvIGV4cGFuZCBmdXJ0aGVyLlxuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGNvbnN0IG1vZHVsZVJlc29sdmVycyA9IGNvbWJpbmVSZXNvbHZlcnMoW1xuICAgICAgcmVmID0+IHRoaXMuX2V4dHJhY3RNb2R1bGVGcm9tTW9kdWxlV2l0aFByb3ZpZGVyc0ZuKHJlZi5ub2RlKSxcbiAgICAgIGZvcndhcmRSZWZSZXNvbHZlcixcbiAgICBdKTtcblxuICAgIGNvbnN0IGRpYWdub3N0aWNzOiB0cy5EaWFnbm9zdGljW10gPSBbXTtcblxuICAgIC8vIEV4dHJhY3QgdGhlIG1vZHVsZSBkZWNsYXJhdGlvbnMsIGltcG9ydHMsIGFuZCBleHBvcnRzLlxuICAgIGxldCBkZWNsYXJhdGlvblJlZnM6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPltdID0gW107XG4gICAgbGV0IHJhd0RlY2xhcmF0aW9uczogdHMuRXhwcmVzc2lvbnxudWxsID0gbnVsbDtcbiAgICBpZiAobmdNb2R1bGUuaGFzKCdkZWNsYXJhdGlvbnMnKSkge1xuICAgICAgcmF3RGVjbGFyYXRpb25zID0gbmdNb2R1bGUuZ2V0KCdkZWNsYXJhdGlvbnMnKSE7XG4gICAgICBjb25zdCBkZWNsYXJhdGlvbk1ldGEgPSB0aGlzLmV2YWx1YXRvci5ldmFsdWF0ZShyYXdEZWNsYXJhdGlvbnMsIGZvcndhcmRSZWZSZXNvbHZlcik7XG4gICAgICBkZWNsYXJhdGlvblJlZnMgPVxuICAgICAgICAgIHRoaXMucmVzb2x2ZVR5cGVMaXN0KHJhd0RlY2xhcmF0aW9ucywgZGVjbGFyYXRpb25NZXRhLCBuYW1lLCAnZGVjbGFyYXRpb25zJyk7XG5cbiAgICAgIC8vIExvb2sgdGhyb3VnaCB0aGUgZGVjbGFyYXRpb25zIHRvIG1ha2Ugc3VyZSB0aGV5J3JlIGFsbCBhIHBhcnQgb2YgdGhlIGN1cnJlbnQgY29tcGlsYXRpb24uXG4gICAgICBmb3IgKGNvbnN0IHJlZiBvZiBkZWNsYXJhdGlvblJlZnMpIHtcbiAgICAgICAgaWYgKHJlZi5ub2RlLmdldFNvdXJjZUZpbGUoKS5pc0RlY2xhcmF0aW9uRmlsZSkge1xuICAgICAgICAgIGNvbnN0IGVycm9yTm9kZTogdHMuRXhwcmVzc2lvbiA9IHJlZi5nZXRPcmlnaW5Gb3JEaWFnbm9zdGljcyhyYXdEZWNsYXJhdGlvbnMpO1xuXG4gICAgICAgICAgZGlhZ25vc3RpY3MucHVzaChtYWtlRGlhZ25vc3RpYyhcbiAgICAgICAgICAgICAgRXJyb3JDb2RlLk5HTU9EVUxFX0lOVkFMSURfREVDTEFSQVRJT04sIGVycm9yTm9kZSxcbiAgICAgICAgICAgICAgYENhbm5vdCBkZWNsYXJlICcke1xuICAgICAgICAgICAgICAgICAgcmVmLm5vZGUubmFtZVxuICAgICAgICAgICAgICAgICAgICAgIC50ZXh0fScgaW4gYW4gTmdNb2R1bGUgYXMgaXQncyBub3QgYSBwYXJ0IG9mIHRoZSBjdXJyZW50IGNvbXBpbGF0aW9uLmAsXG4gICAgICAgICAgICAgIFttYWtlUmVsYXRlZEluZm9ybWF0aW9uKFxuICAgICAgICAgICAgICAgICAgcmVmLm5vZGUubmFtZSwgYCcke3JlZi5ub2RlLm5hbWUudGV4dH0nIGlzIGRlY2xhcmVkIGhlcmUuYCldKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGlhZ25vc3RpY3MubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHtkaWFnbm9zdGljc307XG4gICAgfVxuXG4gICAgbGV0IGltcG9ydFJlZnM6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPltdID0gW107XG4gICAgbGV0IHJhd0ltcG9ydHM6IHRzLkV4cHJlc3Npb258bnVsbCA9IG51bGw7XG4gICAgaWYgKG5nTW9kdWxlLmhhcygnaW1wb3J0cycpKSB7XG4gICAgICByYXdJbXBvcnRzID0gbmdNb2R1bGUuZ2V0KCdpbXBvcnRzJykhO1xuICAgICAgY29uc3QgaW1wb3J0c01ldGEgPSB0aGlzLmV2YWx1YXRvci5ldmFsdWF0ZShyYXdJbXBvcnRzLCBtb2R1bGVSZXNvbHZlcnMpO1xuICAgICAgaW1wb3J0UmVmcyA9IHRoaXMucmVzb2x2ZVR5cGVMaXN0KHJhd0ltcG9ydHMsIGltcG9ydHNNZXRhLCBuYW1lLCAnaW1wb3J0cycpO1xuICAgIH1cbiAgICBsZXQgZXhwb3J0UmVmczogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+W10gPSBbXTtcbiAgICBsZXQgcmF3RXhwb3J0czogdHMuRXhwcmVzc2lvbnxudWxsID0gbnVsbDtcbiAgICBpZiAobmdNb2R1bGUuaGFzKCdleHBvcnRzJykpIHtcbiAgICAgIHJhd0V4cG9ydHMgPSBuZ01vZHVsZS5nZXQoJ2V4cG9ydHMnKSE7XG4gICAgICBjb25zdCBleHBvcnRzTWV0YSA9IHRoaXMuZXZhbHVhdG9yLmV2YWx1YXRlKHJhd0V4cG9ydHMsIG1vZHVsZVJlc29sdmVycyk7XG4gICAgICBleHBvcnRSZWZzID0gdGhpcy5yZXNvbHZlVHlwZUxpc3QocmF3RXhwb3J0cywgZXhwb3J0c01ldGEsIG5hbWUsICdleHBvcnRzJyk7XG4gICAgICB0aGlzLnJlZmVyZW5jZXNSZWdpc3RyeS5hZGQobm9kZSwgLi4uZXhwb3J0UmVmcyk7XG4gICAgfVxuICAgIGxldCBib290c3RyYXBSZWZzOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj5bXSA9IFtdO1xuICAgIGlmIChuZ01vZHVsZS5oYXMoJ2Jvb3RzdHJhcCcpKSB7XG4gICAgICBjb25zdCBleHByID0gbmdNb2R1bGUuZ2V0KCdib290c3RyYXAnKSE7XG4gICAgICBjb25zdCBib290c3RyYXBNZXRhID0gdGhpcy5ldmFsdWF0b3IuZXZhbHVhdGUoZXhwciwgZm9yd2FyZFJlZlJlc29sdmVyKTtcbiAgICAgIGJvb3RzdHJhcFJlZnMgPSB0aGlzLnJlc29sdmVUeXBlTGlzdChleHByLCBib290c3RyYXBNZXRhLCBuYW1lLCAnYm9vdHN0cmFwJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2NoZW1hczogU2NoZW1hTWV0YWRhdGFbXSA9IFtdO1xuICAgIGlmIChuZ01vZHVsZS5oYXMoJ3NjaGVtYXMnKSkge1xuICAgICAgY29uc3QgcmF3RXhwciA9IG5nTW9kdWxlLmdldCgnc2NoZW1hcycpITtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXZhbHVhdG9yLmV2YWx1YXRlKHJhd0V4cHIpO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvcihyYXdFeHByLCByZXN1bHQsIGBOZ01vZHVsZS5zY2hlbWFzIG11c3QgYmUgYW4gYXJyYXlgKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBzY2hlbWFSZWYgb2YgcmVzdWx0KSB7XG4gICAgICAgIGlmICghKHNjaGVtYVJlZiBpbnN0YW5jZW9mIFJlZmVyZW5jZSkpIHtcbiAgICAgICAgICB0aHJvdyBjcmVhdGVWYWx1ZUhhc1dyb25nVHlwZUVycm9yKFxuICAgICAgICAgICAgICByYXdFeHByLCByZXN1bHQsICdOZ01vZHVsZS5zY2hlbWFzIG11c3QgYmUgYW4gYXJyYXkgb2Ygc2NoZW1hcycpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlkID0gc2NoZW1hUmVmLmdldElkZW50aXR5SW4oc2NoZW1hUmVmLm5vZGUuZ2V0U291cmNlRmlsZSgpKTtcbiAgICAgICAgaWYgKGlkID09PSBudWxsIHx8IHNjaGVtYVJlZi5vd25lZEJ5TW9kdWxlR3Vlc3MgIT09ICdAYW5ndWxhci9jb3JlJykge1xuICAgICAgICAgIHRocm93IGNyZWF0ZVZhbHVlSGFzV3JvbmdUeXBlRXJyb3IoXG4gICAgICAgICAgICAgIHJhd0V4cHIsIHJlc3VsdCwgJ05nTW9kdWxlLnNjaGVtYXMgbXVzdCBiZSBhbiBhcnJheSBvZiBzY2hlbWFzJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2luY2UgYGlkYCBpcyB0aGUgYHRzLklkZW50aWZlcmAgd2l0aGluIHRoZSBzY2hlbWEgcmVmJ3MgZGVjbGFyYXRpb24gZmlsZSwgaXQncyBzYWZlIHRvXG4gICAgICAgIC8vIHVzZSBgaWQudGV4dGAgaGVyZSB0byBmaWd1cmUgb3V0IHdoaWNoIHNjaGVtYSBpcyBpbiB1c2UuIEV2ZW4gaWYgdGhlIGFjdHVhbCByZWZlcmVuY2Ugd2FzXG4gICAgICAgIC8vIHJlbmFtZWQgd2hlbiB0aGUgdXNlciBpbXBvcnRlZCBpdCwgdGhlc2UgbmFtZXMgd2lsbCBtYXRjaC5cbiAgICAgICAgc3dpdGNoIChpZC50ZXh0KSB7XG4gICAgICAgICAgY2FzZSAnQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSc6XG4gICAgICAgICAgICBzY2hlbWFzLnB1c2goQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdOT19FUlJPUlNfU0NIRU1BJzpcbiAgICAgICAgICAgIHNjaGVtYXMucHVzaChOT19FUlJPUlNfU0NIRU1BKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBjcmVhdGVWYWx1ZUhhc1dyb25nVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgIHJhd0V4cHIsIHNjaGVtYVJlZiwgYCcke3NjaGVtYVJlZi5kZWJ1Z05hbWV9JyBpcyBub3QgYSB2YWxpZCBOZ01vZHVsZSBzY2hlbWFgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlkOiBFeHByZXNzaW9ufG51bGwgPVxuICAgICAgICBuZ01vZHVsZS5oYXMoJ2lkJykgPyBuZXcgV3JhcHBlZE5vZGVFeHByKG5nTW9kdWxlLmdldCgnaWQnKSEpIDogbnVsbDtcbiAgICBjb25zdCB2YWx1ZUNvbnRleHQgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcblxuICAgIGxldCB0eXBlQ29udGV4dCA9IHZhbHVlQ29udGV4dDtcbiAgICBjb25zdCB0eXBlTm9kZSA9IHRoaXMucmVmbGVjdG9yLmdldER0c0RlY2xhcmF0aW9uKG5vZGUpO1xuICAgIGlmICh0eXBlTm9kZSAhPT0gbnVsbCkge1xuICAgICAgdHlwZUNvbnRleHQgPSB0eXBlTm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgYm9vdHN0cmFwID1cbiAgICAgICAgYm9vdHN0cmFwUmVmcy5tYXAoYm9vdHN0cmFwID0+IHRoaXMuX3RvUjNSZWZlcmVuY2UoYm9vdHN0cmFwLCB2YWx1ZUNvbnRleHQsIHR5cGVDb250ZXh0KSk7XG4gICAgY29uc3QgZGVjbGFyYXRpb25zID1cbiAgICAgICAgZGVjbGFyYXRpb25SZWZzLm1hcChkZWNsID0+IHRoaXMuX3RvUjNSZWZlcmVuY2UoZGVjbCwgdmFsdWVDb250ZXh0LCB0eXBlQ29udGV4dCkpO1xuICAgIGNvbnN0IGltcG9ydHMgPSBpbXBvcnRSZWZzLm1hcChpbXAgPT4gdGhpcy5fdG9SM1JlZmVyZW5jZShpbXAsIHZhbHVlQ29udGV4dCwgdHlwZUNvbnRleHQpKTtcbiAgICBjb25zdCBleHBvcnRzID0gZXhwb3J0UmVmcy5tYXAoZXhwID0+IHRoaXMuX3RvUjNSZWZlcmVuY2UoZXhwLCB2YWx1ZUNvbnRleHQsIHR5cGVDb250ZXh0KSk7XG5cbiAgICBjb25zdCBpc0ZvcndhcmRSZWZlcmVuY2UgPSAocmVmOiBSM1JlZmVyZW5jZSkgPT5cbiAgICAgICAgaXNFeHByZXNzaW9uRm9yd2FyZFJlZmVyZW5jZShyZWYudmFsdWUsIG5vZGUubmFtZSEsIHZhbHVlQ29udGV4dCk7XG4gICAgY29uc3QgY29udGFpbnNGb3J3YXJkRGVjbHMgPSBib290c3RyYXAuc29tZShpc0ZvcndhcmRSZWZlcmVuY2UpIHx8XG4gICAgICAgIGRlY2xhcmF0aW9ucy5zb21lKGlzRm9yd2FyZFJlZmVyZW5jZSkgfHwgaW1wb3J0cy5zb21lKGlzRm9yd2FyZFJlZmVyZW5jZSkgfHxcbiAgICAgICAgZXhwb3J0cy5zb21lKGlzRm9yd2FyZFJlZmVyZW5jZSk7XG5cbiAgICBjb25zdCB0eXBlID0gd3JhcFR5cGVSZWZlcmVuY2UodGhpcy5yZWZsZWN0b3IsIG5vZGUpO1xuICAgIGNvbnN0IGludGVybmFsVHlwZSA9IG5ldyBXcmFwcGVkTm9kZUV4cHIodGhpcy5yZWZsZWN0b3IuZ2V0SW50ZXJuYWxOYW1lT2ZDbGFzcyhub2RlKSk7XG4gICAgY29uc3QgYWRqYWNlbnRUeXBlID0gbmV3IFdyYXBwZWROb2RlRXhwcih0aGlzLnJlZmxlY3Rvci5nZXRBZGphY2VudE5hbWVPZkNsYXNzKG5vZGUpKTtcblxuICAgIGNvbnN0IG5nTW9kdWxlTWV0YWRhdGE6IFIzTmdNb2R1bGVNZXRhZGF0YSA9IHtcbiAgICAgIHR5cGUsXG4gICAgICBpbnRlcm5hbFR5cGUsXG4gICAgICBhZGphY2VudFR5cGUsXG4gICAgICBib290c3RyYXAsXG4gICAgICBkZWNsYXJhdGlvbnMsXG4gICAgICBleHBvcnRzLFxuICAgICAgaW1wb3J0cyxcbiAgICAgIGNvbnRhaW5zRm9yd2FyZERlY2xzLFxuICAgICAgaWQsXG4gICAgICBlbWl0SW5saW5lOiBmYWxzZSxcbiAgICAgIC8vIFRPRE86IHRvIGJlIGltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBGVy0xMDA0LlxuICAgICAgc2NoZW1hczogW10sXG4gICAgfTtcblxuICAgIGNvbnN0IHJhd1Byb3ZpZGVycyA9IG5nTW9kdWxlLmhhcygncHJvdmlkZXJzJykgPyBuZ01vZHVsZS5nZXQoJ3Byb3ZpZGVycycpISA6IG51bGw7XG4gICAgY29uc3Qgd3JhcHBlclByb3ZpZGVycyA9IHJhd1Byb3ZpZGVycyAhPT0gbnVsbCA/XG4gICAgICAgIG5ldyBXcmFwcGVkTm9kZUV4cHIoXG4gICAgICAgICAgICB0aGlzLmFubm90YXRlRm9yQ2xvc3VyZUNvbXBpbGVyID8gd3JhcEZ1bmN0aW9uRXhwcmVzc2lvbnNJblBhcmVucyhyYXdQcm92aWRlcnMpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXdQcm92aWRlcnMpIDpcbiAgICAgICAgbnVsbDtcblxuICAgIC8vIEF0IHRoaXMgcG9pbnQsIG9ubHkgYWRkIHRoZSBtb2R1bGUncyBpbXBvcnRzIGFzIHRoZSBpbmplY3RvcnMnIGltcG9ydHMuIEFueSBleHBvcnRlZCBtb2R1bGVzXG4gICAgLy8gYXJlIGFkZGVkIGR1cmluZyBgcmVzb2x2ZWAsIGFzIHdlIG5lZWQgc2NvcGUgaW5mb3JtYXRpb24gdG8gYmUgYWJsZSB0byBmaWx0ZXIgb3V0IGRpcmVjdGl2ZXNcbiAgICAvLyBhbmQgcGlwZXMgZnJvbSB0aGUgbW9kdWxlIGV4cG9ydHMuXG4gICAgY29uc3QgaW5qZWN0b3JJbXBvcnRzOiBXcmFwcGVkTm9kZUV4cHI8dHMuRXhwcmVzc2lvbj5bXSA9IFtdO1xuICAgIGlmIChuZ01vZHVsZS5oYXMoJ2ltcG9ydHMnKSkge1xuICAgICAgaW5qZWN0b3JJbXBvcnRzLnB1c2gobmV3IFdyYXBwZWROb2RlRXhwcihuZ01vZHVsZS5nZXQoJ2ltcG9ydHMnKSEpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yb3V0ZUFuYWx5emVyICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnJvdXRlQW5hbHl6ZXIuYWRkKG5vZGUuZ2V0U291cmNlRmlsZSgpLCBuYW1lLCByYXdJbXBvcnRzLCByYXdFeHBvcnRzLCByYXdQcm92aWRlcnMpO1xuICAgIH1cblxuICAgIGNvbnN0IGluamVjdG9yTWV0YWRhdGE6IFIzSW5qZWN0b3JNZXRhZGF0YSA9IHtcbiAgICAgIG5hbWUsXG4gICAgICB0eXBlLFxuICAgICAgaW50ZXJuYWxUeXBlLFxuICAgICAgcHJvdmlkZXJzOiB3cmFwcGVyUHJvdmlkZXJzLFxuICAgICAgaW1wb3J0czogaW5qZWN0b3JJbXBvcnRzLFxuICAgIH07XG5cbiAgICBjb25zdCBmYWN0b3J5TWV0YWRhdGE6IFIzRmFjdG9yeU1ldGFkYXRhID0ge1xuICAgICAgbmFtZSxcbiAgICAgIHR5cGUsXG4gICAgICBpbnRlcm5hbFR5cGUsXG4gICAgICB0eXBlQXJndW1lbnRDb3VudDogMCxcbiAgICAgIGRlcHM6IGdldFZhbGlkQ29uc3RydWN0b3JEZXBlbmRlbmNpZXMobm9kZSwgdGhpcy5yZWZsZWN0b3IsIHRoaXMuaXNDb3JlKSxcbiAgICAgIHRhcmdldDogRmFjdG9yeVRhcmdldC5OZ01vZHVsZSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFuYWx5c2lzOiB7XG4gICAgICAgIGlkLFxuICAgICAgICBzY2hlbWFzLFxuICAgICAgICBtb2Q6IG5nTW9kdWxlTWV0YWRhdGEsXG4gICAgICAgIGluajogaW5qZWN0b3JNZXRhZGF0YSxcbiAgICAgICAgZmFjOiBmYWN0b3J5TWV0YWRhdGEsXG4gICAgICAgIGRlY2xhcmF0aW9uczogZGVjbGFyYXRpb25SZWZzLFxuICAgICAgICByYXdEZWNsYXJhdGlvbnMsXG4gICAgICAgIGltcG9ydHM6IGltcG9ydFJlZnMsXG4gICAgICAgIGV4cG9ydHM6IGV4cG9ydFJlZnMsXG4gICAgICAgIHByb3ZpZGVyczogcmF3UHJvdmlkZXJzLFxuICAgICAgICBwcm92aWRlcnNSZXF1aXJpbmdGYWN0b3J5OiByYXdQcm92aWRlcnMgP1xuICAgICAgICAgICAgcmVzb2x2ZVByb3ZpZGVyc1JlcXVpcmluZ0ZhY3RvcnkocmF3UHJvdmlkZXJzLCB0aGlzLnJlZmxlY3RvciwgdGhpcy5ldmFsdWF0b3IpIDpcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgIGNsYXNzTWV0YWRhdGE6IGV4dHJhY3RDbGFzc01ldGFkYXRhKFxuICAgICAgICAgICAgbm9kZSwgdGhpcy5yZWZsZWN0b3IsIHRoaXMuaXNDb3JlLCB0aGlzLmFubm90YXRlRm9yQ2xvc3VyZUNvbXBpbGVyKSxcbiAgICAgICAgZmFjdG9yeVN5bWJvbE5hbWU6IG5vZGUubmFtZS50ZXh0LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgc3ltYm9sKG5vZGU6IENsYXNzRGVjbGFyYXRpb24pOiBOZ01vZHVsZVN5bWJvbCB7XG4gICAgcmV0dXJuIG5ldyBOZ01vZHVsZVN5bWJvbChub2RlKTtcbiAgfVxuXG4gIHJlZ2lzdGVyKG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGFuYWx5c2lzOiBOZ01vZHVsZUFuYWx5c2lzKTogdm9pZCB7XG4gICAgLy8gUmVnaXN0ZXIgdGhpcyBtb2R1bGUncyBpbmZvcm1hdGlvbiB3aXRoIHRoZSBMb2NhbE1vZHVsZVNjb3BlUmVnaXN0cnkuIFRoaXMgZW5zdXJlcyB0aGF0XG4gICAgLy8gZHVyaW5nIHRoZSBjb21waWxlKCkgcGhhc2UsIHRoZSBtb2R1bGUncyBtZXRhZGF0YSBpcyBhdmFpbGFibGUgZm9yIHNlbGVjdG9yIHNjb3BlXG4gICAgLy8gY29tcHV0YXRpb24uXG4gICAgdGhpcy5tZXRhUmVnaXN0cnkucmVnaXN0ZXJOZ01vZHVsZU1ldGFkYXRhKHtcbiAgICAgIHJlZjogbmV3IFJlZmVyZW5jZShub2RlKSxcbiAgICAgIHNjaGVtYXM6IGFuYWx5c2lzLnNjaGVtYXMsXG4gICAgICBkZWNsYXJhdGlvbnM6IGFuYWx5c2lzLmRlY2xhcmF0aW9ucyxcbiAgICAgIGltcG9ydHM6IGFuYWx5c2lzLmltcG9ydHMsXG4gICAgICBleHBvcnRzOiBhbmFseXNpcy5leHBvcnRzLFxuICAgICAgcmF3RGVjbGFyYXRpb25zOiBhbmFseXNpcy5yYXdEZWNsYXJhdGlvbnMsXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5mYWN0b3J5VHJhY2tlciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5mYWN0b3J5VHJhY2tlci50cmFjayhub2RlLmdldFNvdXJjZUZpbGUoKSwge1xuICAgICAgICBuYW1lOiBhbmFseXNpcy5mYWN0b3J5U3ltYm9sTmFtZSxcbiAgICAgICAgaGFzSWQ6IGFuYWx5c2lzLmlkICE9PSBudWxsLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5pbmplY3RhYmxlUmVnaXN0cnkucmVnaXN0ZXJJbmplY3RhYmxlKG5vZGUpO1xuICB9XG5cbiAgcmVzb2x2ZShub2RlOiBDbGFzc0RlY2xhcmF0aW9uLCBhbmFseXNpczogUmVhZG9ubHk8TmdNb2R1bGVBbmFseXNpcz4pOlxuICAgICAgUmVzb2x2ZVJlc3VsdDxOZ01vZHVsZVJlc29sdXRpb24+IHtcbiAgICBjb25zdCBzY29wZSA9IHRoaXMuc2NvcGVSZWdpc3RyeS5nZXRTY29wZU9mTW9kdWxlKG5vZGUpO1xuICAgIGNvbnN0IGRpYWdub3N0aWNzOiB0cy5EaWFnbm9zdGljW10gPSBbXTtcblxuICAgIGNvbnN0IHNjb3BlRGlhZ25vc3RpY3MgPSB0aGlzLnNjb3BlUmVnaXN0cnkuZ2V0RGlhZ25vc3RpY3NPZk1vZHVsZShub2RlKTtcbiAgICBpZiAoc2NvcGVEaWFnbm9zdGljcyAhPT0gbnVsbCkge1xuICAgICAgZGlhZ25vc3RpY3MucHVzaCguLi5zY29wZURpYWdub3N0aWNzKTtcbiAgICB9XG5cbiAgICBpZiAoYW5hbHlzaXMucHJvdmlkZXJzUmVxdWlyaW5nRmFjdG9yeSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgcHJvdmlkZXJEaWFnbm9zdGljcyA9IGdldFByb3ZpZGVyRGlhZ25vc3RpY3MoXG4gICAgICAgICAgYW5hbHlzaXMucHJvdmlkZXJzUmVxdWlyaW5nRmFjdG9yeSwgYW5hbHlzaXMucHJvdmlkZXJzISwgdGhpcy5pbmplY3RhYmxlUmVnaXN0cnkpO1xuICAgICAgZGlhZ25vc3RpY3MucHVzaCguLi5wcm92aWRlckRpYWdub3N0aWNzKTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhOiBOZ01vZHVsZVJlc29sdXRpb24gPSB7XG4gICAgICBpbmplY3RvckltcG9ydHM6IFtdLFxuICAgIH07XG5cbiAgICBpZiAoc2NvcGUgIT09IG51bGwgJiYgIXNjb3BlLmNvbXBpbGF0aW9uLmlzUG9pc29uZWQpIHtcbiAgICAgIC8vIFVzaW5nIHRoZSBzY29wZSBpbmZvcm1hdGlvbiwgZXh0ZW5kIHRoZSBpbmplY3RvcidzIGltcG9ydHMgdXNpbmcgdGhlIG1vZHVsZXMgdGhhdCBhcmVcbiAgICAgIC8vIHNwZWNpZmllZCBhcyBtb2R1bGUgZXhwb3J0cy5cbiAgICAgIGNvbnN0IGNvbnRleHQgPSBnZXRTb3VyY2VGaWxlKG5vZGUpO1xuICAgICAgZm9yIChjb25zdCBleHBvcnRSZWYgb2YgYW5hbHlzaXMuZXhwb3J0cykge1xuICAgICAgICBpZiAoaXNOZ01vZHVsZShleHBvcnRSZWYubm9kZSwgc2NvcGUuY29tcGlsYXRpb24pKSB7XG4gICAgICAgICAgZGF0YS5pbmplY3RvckltcG9ydHMucHVzaCh0aGlzLnJlZkVtaXR0ZXIuZW1pdChleHBvcnRSZWYsIGNvbnRleHQpLmV4cHJlc3Npb24pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgZGVjbCBvZiBhbmFseXNpcy5kZWNsYXJhdGlvbnMpIHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLm1ldGFSZWFkZXIuZ2V0RGlyZWN0aXZlTWV0YWRhdGEoZGVjbCk7XG5cbiAgICAgICAgaWYgKG1ldGFkYXRhICE9PSBudWxsICYmIG1ldGFkYXRhLnNlbGVjdG9yID09PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICAgICAgICBFcnJvckNvZGUuRElSRUNUSVZFX01JU1NJTkdfU0VMRUNUT1IsIGRlY2wubm9kZSxcbiAgICAgICAgICAgICAgYERpcmVjdGl2ZSAke2RlY2wubm9kZS5uYW1lLnRleHR9IGhhcyBubyBzZWxlY3RvciwgcGxlYXNlIGFkZCBpdCFgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkaWFnbm9zdGljcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4ge2RpYWdub3N0aWNzfTtcbiAgICB9XG5cbiAgICBpZiAoc2NvcGUgPT09IG51bGwgfHwgc2NvcGUuY29tcGlsYXRpb24uaXNQb2lzb25lZCB8fCBzY29wZS5leHBvcnRlZC5pc1BvaXNvbmVkIHx8XG4gICAgICAgIHNjb3BlLnJlZXhwb3J0cyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHtkYXRhfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgcmVleHBvcnRzOiBzY29wZS5yZWV4cG9ydHMsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGNvbXBpbGVGdWxsKFxuICAgICAgbm9kZTogQ2xhc3NEZWNsYXJhdGlvbixcbiAgICAgIHtpbmosIG1vZCwgZmFjLCBjbGFzc01ldGFkYXRhLCBkZWNsYXJhdGlvbnN9OiBSZWFkb25seTxOZ01vZHVsZUFuYWx5c2lzPixcbiAgICAgIHtpbmplY3RvckltcG9ydHN9OiBSZWFkb25seTxOZ01vZHVsZVJlc29sdXRpb24+KTogQ29tcGlsZVJlc3VsdFtdIHtcbiAgICBjb25zdCBmYWN0b3J5Rm4gPSBjb21waWxlTmdGYWN0b3J5RGVmRmllbGQoZmFjKTtcbiAgICBjb25zdCBuZ0luamVjdG9yRGVmID0gY29tcGlsZUluamVjdG9yKHRoaXMubWVyZ2VJbmplY3RvckltcG9ydHMoaW5qLCBpbmplY3RvckltcG9ydHMpKTtcbiAgICBjb25zdCBuZ01vZHVsZURlZiA9IGNvbXBpbGVOZ01vZHVsZShtb2QpO1xuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBuZ01vZHVsZURlZi5zdGF0ZW1lbnRzO1xuICAgIGNvbnN0IG1ldGFkYXRhID0gY2xhc3NNZXRhZGF0YSAhPT0gbnVsbCA/IGNvbXBpbGVDbGFzc01ldGFkYXRhKGNsYXNzTWV0YWRhdGEpIDogbnVsbDtcbiAgICB0aGlzLmluc2VydE1ldGFkYXRhU3RhdGVtZW50KHN0YXRlbWVudHMsIG1ldGFkYXRhKTtcbiAgICB0aGlzLmFwcGVuZFJlbW90ZVNjb3BpbmdTdGF0ZW1lbnRzKHN0YXRlbWVudHMsIG5vZGUsIGRlY2xhcmF0aW9ucyk7XG5cbiAgICByZXR1cm4gdGhpcy5jb21waWxlTmdNb2R1bGUoZmFjdG9yeUZuLCBuZ0luamVjdG9yRGVmLCBuZ01vZHVsZURlZik7XG4gIH1cblxuICBjb21waWxlUGFydGlhbChcbiAgICAgIG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIHtpbmosIGZhYywgbW9kLCBjbGFzc01ldGFkYXRhfTogUmVhZG9ubHk8TmdNb2R1bGVBbmFseXNpcz4sXG4gICAgICB7aW5qZWN0b3JJbXBvcnRzfTogUmVhZG9ubHk8TmdNb2R1bGVSZXNvbHV0aW9uPik6IENvbXBpbGVSZXN1bHRbXSB7XG4gICAgY29uc3QgZmFjdG9yeUZuID0gY29tcGlsZURlY2xhcmVGYWN0b3J5KGZhYyk7XG4gICAgY29uc3QgaW5qZWN0b3JEZWYgPVxuICAgICAgICBjb21waWxlRGVjbGFyZUluamVjdG9yRnJvbU1ldGFkYXRhKHRoaXMubWVyZ2VJbmplY3RvckltcG9ydHMoaW5qLCBpbmplY3RvckltcG9ydHMpKTtcbiAgICBjb25zdCBuZ01vZHVsZURlZiA9IGNvbXBpbGVEZWNsYXJlTmdNb2R1bGVGcm9tTWV0YWRhdGEobW9kKTtcbiAgICBjb25zdCBtZXRhZGF0YSA9IGNsYXNzTWV0YWRhdGEgIT09IG51bGwgPyBjb21waWxlRGVjbGFyZUNsYXNzTWV0YWRhdGEoY2xhc3NNZXRhZGF0YSkgOiBudWxsO1xuICAgIHRoaXMuaW5zZXJ0TWV0YWRhdGFTdGF0ZW1lbnQobmdNb2R1bGVEZWYuc3RhdGVtZW50cywgbWV0YWRhdGEpO1xuICAgIC8vIE5PVEU6IG5vIHJlbW90ZSBzY29waW5nIHJlcXVpcmVkIGFzIHRoaXMgaXMgYmFubmVkIGluIHBhcnRpYWwgY29tcGlsYXRpb24uXG4gICAgcmV0dXJuIHRoaXMuY29tcGlsZU5nTW9kdWxlKGZhY3RvcnlGbiwgaW5qZWN0b3JEZWYsIG5nTW9kdWxlRGVmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgTWVyZ2UgdGhlIGluamVjdG9yIGltcG9ydHMgKHdoaWNoIGFyZSAnZXhwb3J0cycgdGhhdCB3ZXJlIGxhdGVyIGZvdW5kIHRvIGJlIE5nTW9kdWxlcylcbiAgICogIGNvbXB1dGVkIGR1cmluZyByZXNvbHV0aW9uIHdpdGggdGhlIG9uZXMgZnJvbSBhbmFseXNpcy5cbiAgICovXG4gIHByaXZhdGUgbWVyZ2VJbmplY3RvckltcG9ydHMoaW5qOiBSM0luamVjdG9yTWV0YWRhdGEsIGluamVjdG9ySW1wb3J0czogRXhwcmVzc2lvbltdKTpcbiAgICAgIFIzSW5qZWN0b3JNZXRhZGF0YSB7XG4gICAgcmV0dXJuIHsuLi5pbmosIGltcG9ydHM6IFsuLi5pbmouaW1wb3J0cywgLi4uaW5qZWN0b3JJbXBvcnRzXX07XG4gIH1cblxuICAvKipcbiAgICogQWRkIGNsYXNzIG1ldGFkYXRhIHN0YXRlbWVudHMsIGlmIHByb3ZpZGVkLCB0byB0aGUgYG5nTW9kdWxlU3RhdGVtZW50c2AuXG4gICAqL1xuICBwcml2YXRlIGluc2VydE1ldGFkYXRhU3RhdGVtZW50KG5nTW9kdWxlU3RhdGVtZW50czogU3RhdGVtZW50W10sIG1ldGFkYXRhOiBFeHByZXNzaW9ufG51bGwpOlxuICAgICAgdm9pZCB7XG4gICAgaWYgKG1ldGFkYXRhICE9PSBudWxsKSB7XG4gICAgICBuZ01vZHVsZVN0YXRlbWVudHMudW5zaGlmdChtZXRhZGF0YS50b1N0bXQoKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCByZW1vdGUgc2NvcGluZyBzdGF0ZW1lbnRzLCBhcyBuZWVkZWQsIHRvIHRoZSBgbmdNb2R1bGVTdGF0ZW1lbnRzYC5cbiAgICovXG4gIHByaXZhdGUgYXBwZW5kUmVtb3RlU2NvcGluZ1N0YXRlbWVudHMoXG4gICAgICBuZ01vZHVsZVN0YXRlbWVudHM6IFN0YXRlbWVudFtdLCBub2RlOiBDbGFzc0RlY2xhcmF0aW9uLFxuICAgICAgZGVjbGFyYXRpb25zOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj5bXSk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRleHQgPSBnZXRTb3VyY2VGaWxlKG5vZGUpO1xuICAgIGZvciAoY29uc3QgZGVjbCBvZiBkZWNsYXJhdGlvbnMpIHtcbiAgICAgIGNvbnN0IHJlbW90ZVNjb3BlID0gdGhpcy5zY29wZVJlZ2lzdHJ5LmdldFJlbW90ZVNjb3BlKGRlY2wubm9kZSk7XG4gICAgICBpZiAocmVtb3RlU2NvcGUgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgZGlyZWN0aXZlcyA9IHJlbW90ZVNjb3BlLmRpcmVjdGl2ZXMubWFwKFxuICAgICAgICAgICAgZGlyZWN0aXZlID0+IHRoaXMucmVmRW1pdHRlci5lbWl0KGRpcmVjdGl2ZSwgY29udGV4dCkuZXhwcmVzc2lvbik7XG4gICAgICAgIGNvbnN0IHBpcGVzID0gcmVtb3RlU2NvcGUucGlwZXMubWFwKHBpcGUgPT4gdGhpcy5yZWZFbWl0dGVyLmVtaXQocGlwZSwgY29udGV4dCkuZXhwcmVzc2lvbik7XG4gICAgICAgIGNvbnN0IGRpcmVjdGl2ZUFycmF5ID0gbmV3IExpdGVyYWxBcnJheUV4cHIoZGlyZWN0aXZlcyk7XG4gICAgICAgIGNvbnN0IHBpcGVzQXJyYXkgPSBuZXcgTGl0ZXJhbEFycmF5RXhwcihwaXBlcyk7XG4gICAgICAgIGNvbnN0IGRlY2xFeHByID0gdGhpcy5yZWZFbWl0dGVyLmVtaXQoZGVjbCwgY29udGV4dCkuZXhwcmVzc2lvbjtcbiAgICAgICAgY29uc3Qgc2V0Q29tcG9uZW50U2NvcGUgPSBuZXcgRXh0ZXJuYWxFeHByKFIzSWRlbnRpZmllcnMuc2V0Q29tcG9uZW50U2NvcGUpO1xuICAgICAgICBjb25zdCBjYWxsRXhwciA9XG4gICAgICAgICAgICBuZXcgSW52b2tlRnVuY3Rpb25FeHByKHNldENvbXBvbmVudFNjb3BlLCBbZGVjbEV4cHIsIGRpcmVjdGl2ZUFycmF5LCBwaXBlc0FycmF5XSk7XG5cbiAgICAgICAgbmdNb2R1bGVTdGF0ZW1lbnRzLnB1c2goY2FsbEV4cHIudG9TdG10KCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29tcGlsZU5nTW9kdWxlKFxuICAgICAgZmFjdG9yeUZuOiBDb21waWxlUmVzdWx0LCBpbmplY3RvckRlZjogUjNDb21waWxlZEV4cHJlc3Npb24sXG4gICAgICBuZ01vZHVsZURlZjogUjNDb21waWxlZEV4cHJlc3Npb24pOiBDb21waWxlUmVzdWx0W10ge1xuICAgIGNvbnN0IHJlczogQ29tcGlsZVJlc3VsdFtdID0gW1xuICAgICAgZmFjdG9yeUZuLFxuICAgICAge1xuICAgICAgICBuYW1lOiAnybVtb2QnLFxuICAgICAgICBpbml0aWFsaXplcjogbmdNb2R1bGVEZWYuZXhwcmVzc2lvbixcbiAgICAgICAgc3RhdGVtZW50czogbmdNb2R1bGVEZWYuc3RhdGVtZW50cyxcbiAgICAgICAgdHlwZTogbmdNb2R1bGVEZWYudHlwZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICfJtWluaicsXG4gICAgICAgIGluaXRpYWxpemVyOiBpbmplY3RvckRlZi5leHByZXNzaW9uLFxuICAgICAgICBzdGF0ZW1lbnRzOiBpbmplY3RvckRlZi5zdGF0ZW1lbnRzLFxuICAgICAgICB0eXBlOiBpbmplY3RvckRlZi50eXBlLFxuICAgICAgfSxcbiAgICBdO1xuXG4gICAgaWYgKHRoaXMubG9jYWxlSWQpIHtcbiAgICAgIC8vIFFVRVNUSU9OOiBjYW4gdGhpcyBzdHVmZiBiZSByZW1vdmVkP1xuICAgICAgcmVzLnB1c2goe1xuICAgICAgICBuYW1lOiAnybVsb2MnLFxuICAgICAgICBpbml0aWFsaXplcjogbmV3IExpdGVyYWxFeHByKHRoaXMubG9jYWxlSWQpLFxuICAgICAgICBzdGF0ZW1lbnRzOiBbXSxcbiAgICAgICAgdHlwZTogU1RSSU5HX1RZUEVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBwcml2YXRlIF90b1IzUmVmZXJlbmNlKFxuICAgICAgdmFsdWVSZWY6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPiwgdmFsdWVDb250ZXh0OiB0cy5Tb3VyY2VGaWxlLFxuICAgICAgdHlwZUNvbnRleHQ6IHRzLlNvdXJjZUZpbGUpOiBSM1JlZmVyZW5jZSB7XG4gICAgaWYgKHZhbHVlUmVmLmhhc093bmluZ01vZHVsZUd1ZXNzKSB7XG4gICAgICByZXR1cm4gdG9SM1JlZmVyZW5jZSh2YWx1ZVJlZiwgdmFsdWVSZWYsIHZhbHVlQ29udGV4dCwgdmFsdWVDb250ZXh0LCB0aGlzLnJlZkVtaXR0ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdHlwZVJlZiA9IHZhbHVlUmVmO1xuICAgICAgbGV0IHR5cGVOb2RlID0gdGhpcy5yZWZsZWN0b3IuZ2V0RHRzRGVjbGFyYXRpb24odHlwZVJlZi5ub2RlKTtcbiAgICAgIGlmICh0eXBlTm9kZSAhPT0gbnVsbCAmJiBpc05hbWVkQ2xhc3NEZWNsYXJhdGlvbih0eXBlTm9kZSkpIHtcbiAgICAgICAgdHlwZVJlZiA9IG5ldyBSZWZlcmVuY2UodHlwZU5vZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRvUjNSZWZlcmVuY2UodmFsdWVSZWYsIHR5cGVSZWYsIHZhbHVlQ29udGV4dCwgdHlwZUNvbnRleHQsIHRoaXMucmVmRW1pdHRlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIGEgYEZ1bmN0aW9uRGVjbGFyYXRpb25gLCBgTWV0aG9kRGVjbGFyYXRpb25gIG9yIGBGdW5jdGlvbkV4cHJlc3Npb25gLCBjaGVjayBpZiBpdCBpc1xuICAgKiB0eXBlZCBhcyBhIGBNb2R1bGVXaXRoUHJvdmlkZXJzYCBhbmQgcmV0dXJuIGFuIGV4cHJlc3Npb24gcmVmZXJlbmNpbmcgdGhlIG1vZHVsZSBpZiBhdmFpbGFibGUuXG4gICAqL1xuICBwcml2YXRlIF9leHRyYWN0TW9kdWxlRnJvbU1vZHVsZVdpdGhQcm92aWRlcnNGbihub2RlOiB0cy5GdW5jdGlvbkRlY2xhcmF0aW9ufFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cy5NZXRob2REZWNsYXJhdGlvbnxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHMuRnVuY3Rpb25FeHByZXNzaW9uKTogdHMuRXhwcmVzc2lvbnxudWxsIHtcbiAgICBjb25zdCB0eXBlID0gbm9kZS50eXBlIHx8IG51bGw7XG4gICAgcmV0dXJuIHR5cGUgJiZcbiAgICAgICAgKHRoaXMuX3JlZmxlY3RNb2R1bGVGcm9tVHlwZVBhcmFtKHR5cGUsIG5vZGUpIHx8IHRoaXMuX3JlZmxlY3RNb2R1bGVGcm9tTGl0ZXJhbFR5cGUodHlwZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFuIGBOZ01vZHVsZWAgaWRlbnRpZmllciAoVCkgZnJvbSB0aGUgc3BlY2lmaWVkIGB0eXBlYCwgaWYgaXQgaXMgb2YgdGhlIGZvcm06XG4gICAqIGBNb2R1bGVXaXRoUHJvdmlkZXJzPFQ+YFxuICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSB0byByZWZsZWN0IG9uLlxuICAgKiBAcmV0dXJucyB0aGUgaWRlbnRpZmllciBvZiB0aGUgTmdNb2R1bGUgdHlwZSBpZiBmb3VuZCwgb3IgbnVsbCBvdGhlcndpc2UuXG4gICAqL1xuICBwcml2YXRlIF9yZWZsZWN0TW9kdWxlRnJvbVR5cGVQYXJhbShcbiAgICAgIHR5cGU6IHRzLlR5cGVOb2RlLFxuICAgICAgbm9kZTogdHMuRnVuY3Rpb25EZWNsYXJhdGlvbnx0cy5NZXRob2REZWNsYXJhdGlvbnx0cy5GdW5jdGlvbkV4cHJlc3Npb24pOiB0cy5FeHByZXNzaW9ufG51bGwge1xuICAgIC8vIEV4YW1pbmUgdGhlIHR5cGUgb2YgdGhlIGZ1bmN0aW9uIHRvIHNlZSBpZiBpdCdzIGEgTW9kdWxlV2l0aFByb3ZpZGVycyByZWZlcmVuY2UuXG4gICAgaWYgKCF0cy5pc1R5cGVSZWZlcmVuY2VOb2RlKHR5cGUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB0eXBlTmFtZSA9IHR5cGUgJiZcbiAgICAgICAgICAgICh0cy5pc0lkZW50aWZpZXIodHlwZS50eXBlTmFtZSkgJiYgdHlwZS50eXBlTmFtZSB8fFxuICAgICAgICAgICAgIHRzLmlzUXVhbGlmaWVkTmFtZSh0eXBlLnR5cGVOYW1lKSAmJiB0eXBlLnR5cGVOYW1lLnJpZ2h0KSB8fFxuICAgICAgICBudWxsO1xuICAgIGlmICh0eXBlTmFtZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gTG9vayBhdCB0aGUgdHlwZSBpdHNlbGYgdG8gc2VlIHdoZXJlIGl0IGNvbWVzIGZyb20uXG4gICAgY29uc3QgaWQgPSB0aGlzLnJlZmxlY3Rvci5nZXRJbXBvcnRPZklkZW50aWZpZXIodHlwZU5hbWUpO1xuXG4gICAgLy8gSWYgaXQncyBub3QgbmFtZWQgTW9kdWxlV2l0aFByb3ZpZGVycywgYmFpbC5cbiAgICBpZiAoaWQgPT09IG51bGwgfHwgaWQubmFtZSAhPT0gJ01vZHVsZVdpdGhQcm92aWRlcnMnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBJZiBpdCdzIG5vdCBmcm9tIEBhbmd1bGFyL2NvcmUsIGJhaWwuXG4gICAgaWYgKCF0aGlzLmlzQ29yZSAmJiBpZC5mcm9tICE9PSAnQGFuZ3VsYXIvY29yZScpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlJ3Mgbm8gdHlwZSBwYXJhbWV0ZXIgc3BlY2lmaWVkLCBiYWlsLlxuICAgIGlmICh0eXBlLnR5cGVBcmd1bWVudHMgPT09IHVuZGVmaW5lZCB8fCB0eXBlLnR5cGVBcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICBjb25zdCBwYXJlbnQgPVxuICAgICAgICAgIHRzLmlzTWV0aG9kRGVjbGFyYXRpb24obm9kZSkgJiYgdHMuaXNDbGFzc0RlY2xhcmF0aW9uKG5vZGUucGFyZW50KSA/IG5vZGUucGFyZW50IDogbnVsbDtcbiAgICAgIGNvbnN0IHN5bWJvbE5hbWUgPSAocGFyZW50ICYmIHBhcmVudC5uYW1lID8gcGFyZW50Lm5hbWUuZ2V0VGV4dCgpICsgJy4nIDogJycpICtcbiAgICAgICAgICAobm9kZS5uYW1lID8gbm9kZS5uYW1lLmdldFRleHQoKSA6ICdhbm9ueW1vdXMnKTtcbiAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICBFcnJvckNvZGUuTkdNT0RVTEVfTU9EVUxFX1dJVEhfUFJPVklERVJTX01JU1NJTkdfR0VORVJJQywgdHlwZSxcbiAgICAgICAgICBgJHtzeW1ib2xOYW1lfSByZXR1cm5zIGEgTW9kdWxlV2l0aFByb3ZpZGVycyB0eXBlIHdpdGhvdXQgYSBnZW5lcmljIHR5cGUgYXJndW1lbnQuIGAgK1xuICAgICAgICAgICAgICBgUGxlYXNlIGFkZCBhIGdlbmVyaWMgdHlwZSBhcmd1bWVudCB0byB0aGUgTW9kdWxlV2l0aFByb3ZpZGVycyB0eXBlLiBJZiB0aGlzIGAgK1xuICAgICAgICAgICAgICBgb2NjdXJyZW5jZSBpcyBpbiBsaWJyYXJ5IGNvZGUgeW91IGRvbid0IGNvbnRyb2wsIHBsZWFzZSBjb250YWN0IHRoZSBsaWJyYXJ5IGF1dGhvcnMuYCk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJnID0gdHlwZS50eXBlQXJndW1lbnRzWzBdO1xuXG4gICAgcmV0dXJuIHR5cGVOb2RlVG9WYWx1ZUV4cHIoYXJnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbiBgTmdNb2R1bGVgIGlkZW50aWZpZXIgKFQpIGZyb20gdGhlIHNwZWNpZmllZCBgdHlwZWAsIGlmIGl0IGlzIG9mIHRoZSBmb3JtOlxuICAgKiBgQXxCfHtuZ01vZHVsZTogVH18Q2AuXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIHRvIHJlZmxlY3Qgb24uXG4gICAqIEByZXR1cm5zIHRoZSBpZGVudGlmaWVyIG9mIHRoZSBOZ01vZHVsZSB0eXBlIGlmIGZvdW5kLCBvciBudWxsIG90aGVyd2lzZS5cbiAgICovXG4gIHByaXZhdGUgX3JlZmxlY3RNb2R1bGVGcm9tTGl0ZXJhbFR5cGUodHlwZTogdHMuVHlwZU5vZGUpOiB0cy5FeHByZXNzaW9ufG51bGwge1xuICAgIGlmICghdHMuaXNJbnRlcnNlY3Rpb25UeXBlTm9kZSh0eXBlKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZvciAoY29uc3QgdCBvZiB0eXBlLnR5cGVzKSB7XG4gICAgICBpZiAodHMuaXNUeXBlTGl0ZXJhbE5vZGUodCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHQubWVtYmVycykge1xuICAgICAgICAgIGNvbnN0IG5nTW9kdWxlVHlwZSA9IHRzLmlzUHJvcGVydHlTaWduYXR1cmUobSkgJiYgdHMuaXNJZGVudGlmaWVyKG0ubmFtZSkgJiZcbiAgICAgICAgICAgICAgICAgIG0ubmFtZS50ZXh0ID09PSAnbmdNb2R1bGUnICYmIG0udHlwZSB8fFxuICAgICAgICAgICAgICBudWxsO1xuICAgICAgICAgIGNvbnN0IG5nTW9kdWxlRXhwcmVzc2lvbiA9IG5nTW9kdWxlVHlwZSAmJiB0eXBlTm9kZVRvVmFsdWVFeHByKG5nTW9kdWxlVHlwZSk7XG4gICAgICAgICAgaWYgKG5nTW9kdWxlRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIG5nTW9kdWxlRXhwcmVzc2lvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBWZXJpZnkgdGhhdCBhIFwiRGVjbGFyYXRpb25cIiByZWZlcmVuY2UgaXMgYSBgQ2xhc3NEZWNsYXJhdGlvbmAgcmVmZXJlbmNlLlxuICBwcml2YXRlIGlzQ2xhc3NEZWNsYXJhdGlvblJlZmVyZW5jZShyZWY6IFJlZmVyZW5jZSk6IHJlZiBpcyBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj4ge1xuICAgIHJldHVybiB0aGlzLnJlZmxlY3Rvci5pc0NsYXNzKHJlZi5ub2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlIGEgbGlzdCBvZiBgUmVmZXJlbmNlYHMgZnJvbSBhIHJlc29sdmVkIG1ldGFkYXRhIHZhbHVlLlxuICAgKi9cbiAgcHJpdmF0ZSByZXNvbHZlVHlwZUxpc3QoXG4gICAgICBleHByOiB0cy5Ob2RlLCByZXNvbHZlZExpc3Q6IFJlc29sdmVkVmFsdWUsIGNsYXNzTmFtZTogc3RyaW5nLFxuICAgICAgYXJyYXlOYW1lOiBzdHJpbmcpOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj5bXSB7XG4gICAgY29uc3QgcmVmTGlzdDogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+W10gPSBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVzb2x2ZWRMaXN0KSkge1xuICAgICAgdGhyb3cgY3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvcihcbiAgICAgICAgICBleHByLCByZXNvbHZlZExpc3QsXG4gICAgICAgICAgYEV4cGVjdGVkIGFycmF5IHdoZW4gcmVhZGluZyB0aGUgTmdNb2R1bGUuJHthcnJheU5hbWV9IG9mICR7Y2xhc3NOYW1lfWApO1xuICAgIH1cblxuICAgIHJlc29sdmVkTGlzdC5mb3JFYWNoKChlbnRyeSwgaWR4KSA9PiB7XG4gICAgICAvLyBVbndyYXAgTW9kdWxlV2l0aFByb3ZpZGVycyBmb3IgbW9kdWxlcyB0aGF0IGFyZSBsb2NhbGx5IGRlY2xhcmVkIChhbmQgdGh1cyBzdGF0aWNcbiAgICAgIC8vIHJlc29sdXRpb24gd2FzIGFibGUgdG8gZGVzY2VuZCBpbnRvIHRoZSBmdW5jdGlvbiBhbmQgcmV0dXJuIGFuIG9iamVjdCBsaXRlcmFsLCBhIE1hcCkuXG4gICAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBNYXAgJiYgZW50cnkuaGFzKCduZ01vZHVsZScpKSB7XG4gICAgICAgIGVudHJ5ID0gZW50cnkuZ2V0KCduZ01vZHVsZScpITtcbiAgICAgIH1cblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZW50cnkpKSB7XG4gICAgICAgIC8vIFJlY3Vyc2UgaW50byBuZXN0ZWQgYXJyYXlzLlxuICAgICAgICByZWZMaXN0LnB1c2goLi4udGhpcy5yZXNvbHZlVHlwZUxpc3QoZXhwciwgZW50cnksIGNsYXNzTmFtZSwgYXJyYXlOYW1lKSk7XG4gICAgICB9IGVsc2UgaWYgKGVudHJ5IGluc3RhbmNlb2YgUmVmZXJlbmNlKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0NsYXNzRGVjbGFyYXRpb25SZWZlcmVuY2UoZW50cnkpKSB7XG4gICAgICAgICAgdGhyb3cgY3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvcihcbiAgICAgICAgICAgICAgZW50cnkubm9kZSwgZW50cnksXG4gICAgICAgICAgICAgIGBWYWx1ZSBhdCBwb3NpdGlvbiAke2lkeH0gaW4gdGhlIE5nTW9kdWxlLiR7YXJyYXlOYW1lfSBvZiAke1xuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lfSBpcyBub3QgYSBjbGFzc2ApO1xuICAgICAgICB9XG4gICAgICAgIHJlZkxpc3QucHVzaChlbnRyeSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPKGFseGh1Yik6IFByb2R1Y2UgYSBiZXR0ZXIgZGlhZ25vc3RpYyBoZXJlIC0gdGhlIGFycmF5IGluZGV4IG1heSBiZSBhbiBpbm5lciBhcnJheS5cbiAgICAgICAgdGhyb3cgY3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvcihcbiAgICAgICAgICAgIGV4cHIsIGVudHJ5LFxuICAgICAgICAgICAgYFZhbHVlIGF0IHBvc2l0aW9uICR7aWR4fSBpbiB0aGUgTmdNb2R1bGUuJHthcnJheU5hbWV9IG9mICR7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lfSBpcyBub3QgYSByZWZlcmVuY2VgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZWZMaXN0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzTmdNb2R1bGUobm9kZTogQ2xhc3NEZWNsYXJhdGlvbiwgY29tcGlsYXRpb246IFNjb3BlRGF0YSk6IGJvb2xlYW4ge1xuICByZXR1cm4gIWNvbXBpbGF0aW9uLmRpcmVjdGl2ZXMuc29tZShkaXJlY3RpdmUgPT4gZGlyZWN0aXZlLnJlZi5ub2RlID09PSBub2RlKSAmJlxuICAgICAgIWNvbXBpbGF0aW9uLnBpcGVzLnNvbWUocGlwZSA9PiBwaXBlLnJlZi5ub2RlID09PSBub2RlKTtcbn1cbiJdfQ==