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
        define("@angular/compiler-cli/src/ngtsc/annotations/src/directive", ["require", "exports", "tslib", "@angular/compiler", "@angular/compiler/src/core", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/incremental/semantic_graph", "@angular/compiler-cli/src/ngtsc/metadata", "@angular/compiler-cli/src/ngtsc/metadata/src/util", "@angular/compiler-cli/src/ngtsc/partial_evaluator", "@angular/compiler-cli/src/ngtsc/perf", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/transform", "@angular/compiler-cli/src/ngtsc/annotations/src/diagnostics", "@angular/compiler-cli/src/ngtsc/annotations/src/factory", "@angular/compiler-cli/src/ngtsc/annotations/src/metadata", "@angular/compiler-cli/src/ngtsc/annotations/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extractHostBindings = exports.queriesFromFields = exports.parseFieldArrayValue = exports.extractQueriesFromDecorator = exports.extractQueryMetadata = exports.extractDirectiveMetadata = exports.DirectiveDecoratorHandler = exports.DirectiveSymbol = void 0;
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var core_1 = require("@angular/compiler/src/core");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var semantic_graph_1 = require("@angular/compiler-cli/src/ngtsc/incremental/semantic_graph");
    var metadata_1 = require("@angular/compiler-cli/src/ngtsc/metadata");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/metadata/src/util");
    var partial_evaluator_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator");
    var perf_1 = require("@angular/compiler-cli/src/ngtsc/perf");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var transform_1 = require("@angular/compiler-cli/src/ngtsc/transform");
    var diagnostics_2 = require("@angular/compiler-cli/src/ngtsc/annotations/src/diagnostics");
    var factory_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/factory");
    var metadata_2 = require("@angular/compiler-cli/src/ngtsc/annotations/src/metadata");
    var util_2 = require("@angular/compiler-cli/src/ngtsc/annotations/src/util");
    var EMPTY_OBJECT = {};
    var FIELD_DECORATORS = [
        'Input', 'Output', 'ViewChild', 'ViewChildren', 'ContentChild', 'ContentChildren', 'HostBinding',
        'HostListener'
    ];
    var LIFECYCLE_HOOKS = new Set([
        'ngOnChanges', 'ngOnInit', 'ngOnDestroy', 'ngDoCheck', 'ngAfterViewInit', 'ngAfterViewChecked',
        'ngAfterContentInit', 'ngAfterContentChecked'
    ]);
    /**
     * Represents an Angular directive. Components are represented by `ComponentSymbol`, which inherits
     * from this symbol.
     */
    var DirectiveSymbol = /** @class */ (function (_super) {
        tslib_1.__extends(DirectiveSymbol, _super);
        function DirectiveSymbol(decl, selector, inputs, outputs, exportAs, typeCheckMeta, typeParameters) {
            var _this = _super.call(this, decl) || this;
            _this.selector = selector;
            _this.inputs = inputs;
            _this.outputs = outputs;
            _this.exportAs = exportAs;
            _this.typeCheckMeta = typeCheckMeta;
            _this.typeParameters = typeParameters;
            _this.baseClass = null;
            return _this;
        }
        DirectiveSymbol.prototype.isPublicApiAffected = function (previousSymbol) {
            // Note: since components and directives have exactly the same items contributing to their
            // public API, it is okay for a directive to change into a component and vice versa without
            // the API being affected.
            if (!(previousSymbol instanceof DirectiveSymbol)) {
                return true;
            }
            // Directives and components have a public API of:
            //  1. Their selector.
            //  2. The binding names of their inputs and outputs; a change in ordering is also considered
            //     to be a change in public API.
            //  3. The list of exportAs names and its ordering.
            return this.selector !== previousSymbol.selector ||
                !semantic_graph_1.isArrayEqual(this.inputs.propertyNames, previousSymbol.inputs.propertyNames) ||
                !semantic_graph_1.isArrayEqual(this.outputs.propertyNames, previousSymbol.outputs.propertyNames) ||
                !semantic_graph_1.isArrayEqual(this.exportAs, previousSymbol.exportAs);
        };
        DirectiveSymbol.prototype.isTypeCheckApiAffected = function (previousSymbol) {
            // If the public API of the directive has changed, then so has its type-check API.
            if (this.isPublicApiAffected(previousSymbol)) {
                return true;
            }
            if (!(previousSymbol instanceof DirectiveSymbol)) {
                return true;
            }
            // The type-check block also depends on the class property names, as writes property bindings
            // directly into the backing fields.
            if (!semantic_graph_1.isArrayEqual(Array.from(this.inputs), Array.from(previousSymbol.inputs), isInputMappingEqual) ||
                !semantic_graph_1.isArrayEqual(Array.from(this.outputs), Array.from(previousSymbol.outputs), isInputMappingEqual)) {
                return true;
            }
            // The type parameters of a directive are emitted into the type constructors in the type-check
            // block of a component, so if the type parameters are not considered equal then consider the
            // type-check API of this directive to be affected.
            if (!semantic_graph_1.areTypeParametersEqual(this.typeParameters, previousSymbol.typeParameters)) {
                return true;
            }
            // The type-check metadata is used during TCB code generation, so any changes should invalidate
            // prior type-check files.
            if (!isTypeCheckMetaEqual(this.typeCheckMeta, previousSymbol.typeCheckMeta)) {
                return true;
            }
            // Changing the base class of a directive means that its inputs/outputs etc may have changed,
            // so the type-check block of components that use this directive needs to be regenerated.
            if (!isBaseClassEqual(this.baseClass, previousSymbol.baseClass)) {
                return true;
            }
            return false;
        };
        return DirectiveSymbol;
    }(semantic_graph_1.SemanticSymbol));
    exports.DirectiveSymbol = DirectiveSymbol;
    function isInputMappingEqual(current, previous) {
        return current[0] === previous[0] && current[1] === previous[1];
    }
    function isTypeCheckMetaEqual(current, previous) {
        if (current.hasNgTemplateContextGuard !== previous.hasNgTemplateContextGuard) {
            return false;
        }
        if (current.isGeneric !== previous.isGeneric) {
            // Note: changes in the number of type parameters is also considered in `areTypeParametersEqual`
            // so this check is technically not needed; it is done anyway for completeness in terms of
            // whether the `DirectiveTypeCheckMeta` struct itself compares equal or not.
            return false;
        }
        if (!semantic_graph_1.isArrayEqual(current.ngTemplateGuards, previous.ngTemplateGuards, isTemplateGuardEqual)) {
            return false;
        }
        if (!semantic_graph_1.isSetEqual(current.coercedInputFields, previous.coercedInputFields)) {
            return false;
        }
        if (!semantic_graph_1.isSetEqual(current.restrictedInputFields, previous.restrictedInputFields)) {
            return false;
        }
        if (!semantic_graph_1.isSetEqual(current.stringLiteralInputFields, previous.stringLiteralInputFields)) {
            return false;
        }
        if (!semantic_graph_1.isSetEqual(current.undeclaredInputFields, previous.undeclaredInputFields)) {
            return false;
        }
        return true;
    }
    function isTemplateGuardEqual(current, previous) {
        return current.inputName === previous.inputName && current.type === previous.type;
    }
    function isBaseClassEqual(current, previous) {
        if (current === null || previous === null) {
            return current === previous;
        }
        return semantic_graph_1.isSymbolEqual(current, previous);
    }
    var DirectiveDecoratorHandler = /** @class */ (function () {
        function DirectiveDecoratorHandler(reflector, evaluator, metaRegistry, scopeRegistry, metaReader, injectableRegistry, isCore, semanticDepGraphUpdater, annotateForClosureCompiler, compileUndecoratedClassesWithAngularFeatures, perf) {
            this.reflector = reflector;
            this.evaluator = evaluator;
            this.metaRegistry = metaRegistry;
            this.scopeRegistry = scopeRegistry;
            this.metaReader = metaReader;
            this.injectableRegistry = injectableRegistry;
            this.isCore = isCore;
            this.semanticDepGraphUpdater = semanticDepGraphUpdater;
            this.annotateForClosureCompiler = annotateForClosureCompiler;
            this.compileUndecoratedClassesWithAngularFeatures = compileUndecoratedClassesWithAngularFeatures;
            this.perf = perf;
            this.precedence = transform_1.HandlerPrecedence.PRIMARY;
            this.name = DirectiveDecoratorHandler.name;
        }
        DirectiveDecoratorHandler.prototype.detect = function (node, decorators) {
            // If a class is undecorated but uses Angular features, we detect it as an
            // abstract directive. This is an unsupported pattern as of v10, but we want
            // to still detect these patterns so that we can report diagnostics, or compile
            // them for backwards compatibility in ngcc.
            if (!decorators) {
                var angularField = this.findClassFieldWithAngularFeatures(node);
                return angularField ? { trigger: angularField.node, decorator: null, metadata: null } :
                    undefined;
            }
            else {
                var decorator = util_2.findAngularDecorator(decorators, 'Directive', this.isCore);
                return decorator ? { trigger: decorator.node, decorator: decorator, metadata: decorator } : undefined;
            }
        };
        DirectiveDecoratorHandler.prototype.analyze = function (node, decorator, flags) {
            if (flags === void 0) { flags = transform_1.HandlerFlags.NONE; }
            // Skip processing of the class declaration if compilation of undecorated classes
            // with Angular features is disabled. Previously in ngtsc, such classes have always
            // been processed, but we want to enforce a consistent decorator mental model.
            // See: https://v9.angular.io/guide/migration-undecorated-classes.
            if (this.compileUndecoratedClassesWithAngularFeatures === false && decorator === null) {
                return { diagnostics: [diagnostics_2.getUndecoratedClassWithAngularFeaturesDiagnostic(node)] };
            }
            this.perf.eventCount(perf_1.PerfEvent.AnalyzeDirective);
            var directiveResult = extractDirectiveMetadata(node, decorator, this.reflector, this.evaluator, this.isCore, flags, this.annotateForClosureCompiler);
            if (directiveResult === undefined) {
                return {};
            }
            var analysis = directiveResult.metadata;
            var providersRequiringFactory = null;
            if (directiveResult !== undefined && directiveResult.decorator.has('providers')) {
                providersRequiringFactory = util_2.resolveProvidersRequiringFactory(directiveResult.decorator.get('providers'), this.reflector, this.evaluator);
            }
            return {
                analysis: {
                    inputs: directiveResult.inputs,
                    outputs: directiveResult.outputs,
                    meta: analysis,
                    classMetadata: metadata_2.extractClassMetadata(node, this.reflector, this.isCore, this.annotateForClosureCompiler),
                    baseClass: util_2.readBaseClass(node, this.reflector, this.evaluator),
                    typeCheckMeta: util_1.extractDirectiveTypeCheckMeta(node, directiveResult.inputs, this.reflector),
                    providersRequiringFactory: providersRequiringFactory,
                    isPoisoned: false,
                    isStructural: directiveResult.isStructural,
                }
            };
        };
        DirectiveDecoratorHandler.prototype.symbol = function (node, analysis) {
            var typeParameters = semantic_graph_1.extractSemanticTypeParameters(node);
            return new DirectiveSymbol(node, analysis.meta.selector, analysis.inputs, analysis.outputs, analysis.meta.exportAs, analysis.typeCheckMeta, typeParameters);
        };
        DirectiveDecoratorHandler.prototype.register = function (node, analysis) {
            // Register this directive's information with the `MetadataRegistry`. This ensures that
            // the information about the directive is available during the compile() phase.
            var ref = new imports_1.Reference(node);
            this.metaRegistry.registerDirectiveMetadata(tslib_1.__assign(tslib_1.__assign({ type: metadata_1.MetaType.Directive, ref: ref, name: node.name.text, selector: analysis.meta.selector, exportAs: analysis.meta.exportAs, inputs: analysis.inputs, outputs: analysis.outputs, queries: analysis.meta.queries.map(function (query) { return query.propertyName; }), isComponent: false, baseClass: analysis.baseClass }, analysis.typeCheckMeta), { isPoisoned: analysis.isPoisoned, isStructural: analysis.isStructural }));
            this.injectableRegistry.registerInjectable(node);
        };
        DirectiveDecoratorHandler.prototype.resolve = function (node, analysis, symbol) {
            if (this.semanticDepGraphUpdater !== null && analysis.baseClass instanceof imports_1.Reference) {
                symbol.baseClass = this.semanticDepGraphUpdater.getSymbol(analysis.baseClass.node);
            }
            var diagnostics = [];
            if (analysis.providersRequiringFactory !== null &&
                analysis.meta.providers instanceof compiler_1.WrappedNodeExpr) {
                var providerDiagnostics = diagnostics_2.getProviderDiagnostics(analysis.providersRequiringFactory, analysis.meta.providers.node, this.injectableRegistry);
                diagnostics.push.apply(diagnostics, tslib_1.__spreadArray([], tslib_1.__read(providerDiagnostics)));
            }
            var directiveDiagnostics = diagnostics_2.getDirectiveDiagnostics(node, this.metaReader, this.evaluator, this.reflector, this.scopeRegistry, 'Directive');
            if (directiveDiagnostics !== null) {
                diagnostics.push.apply(diagnostics, tslib_1.__spreadArray([], tslib_1.__read(directiveDiagnostics)));
            }
            return { diagnostics: diagnostics.length > 0 ? diagnostics : undefined };
        };
        DirectiveDecoratorHandler.prototype.compileFull = function (node, analysis, resolution, pool) {
            var fac = factory_1.compileNgFactoryDefField(util_2.toFactoryMetadata(analysis.meta, compiler_1.FactoryTarget.Directive));
            var def = compiler_1.compileDirectiveFromMetadata(analysis.meta, pool, compiler_1.makeBindingParser());
            var classMetadata = analysis.classMetadata !== null ?
                compiler_1.compileClassMetadata(analysis.classMetadata).toStmt() :
                null;
            return util_2.compileResults(fac, def, classMetadata, 'ɵdir');
        };
        DirectiveDecoratorHandler.prototype.compilePartial = function (node, analysis, resolution) {
            var fac = factory_1.compileDeclareFactory(util_2.toFactoryMetadata(analysis.meta, compiler_1.FactoryTarget.Directive));
            var def = compiler_1.compileDeclareDirectiveFromMetadata(analysis.meta);
            var classMetadata = analysis.classMetadata !== null ?
                compiler_1.compileDeclareClassMetadata(analysis.classMetadata).toStmt() :
                null;
            return util_2.compileResults(fac, def, classMetadata, 'ɵdir');
        };
        /**
         * Checks if a given class uses Angular features and returns the TypeScript node
         * that indicated the usage. Classes are considered using Angular features if they
         * contain class members that are either decorated with a known Angular decorator,
         * or if they correspond to a known Angular lifecycle hook.
         */
        DirectiveDecoratorHandler.prototype.findClassFieldWithAngularFeatures = function (node) {
            var _this = this;
            return this.reflector.getMembersOfClass(node).find(function (member) {
                if (!member.isStatic && member.kind === reflection_1.ClassMemberKind.Method &&
                    LIFECYCLE_HOOKS.has(member.name)) {
                    return true;
                }
                if (member.decorators) {
                    return member.decorators.some(function (decorator) { return FIELD_DECORATORS.some(function (decoratorName) { return util_2.isAngularDecorator(decorator, decoratorName, _this.isCore); }); });
                }
                return false;
            });
        };
        return DirectiveDecoratorHandler;
    }());
    exports.DirectiveDecoratorHandler = DirectiveDecoratorHandler;
    /**
     * Helper function to extract metadata from a `Directive` or `Component`. `Directive`s without a
     * selector are allowed to be used for abstract base classes. These abstract directives should not
     * appear in the declarations of an `NgModule` and additional verification is done when processing
     * the module.
     */
    function extractDirectiveMetadata(clazz, decorator, reflector, evaluator, isCore, flags, annotateForClosureCompiler, defaultSelector) {
        if (defaultSelector === void 0) { defaultSelector = null; }
        var directive;
        if (decorator === null || decorator.args === null || decorator.args.length === 0) {
            directive = new Map();
        }
        else if (decorator.args.length !== 1) {
            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, reflection_1.Decorator.nodeForError(decorator), "Incorrect number of arguments to @" + decorator.name + " decorator");
        }
        else {
            var meta = util_2.unwrapExpression(decorator.args[0]);
            if (!ts.isObjectLiteralExpression(meta)) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARG_NOT_LITERAL, meta, "@" + decorator.name + " argument must be an object literal");
            }
            directive = reflection_1.reflectObjectLiteral(meta);
        }
        if (directive.has('jit')) {
            // The only allowed value is true, so there's no need to expand further.
            return undefined;
        }
        var members = reflector.getMembersOfClass(clazz);
        // Precompute a list of ts.ClassElements that have decorators. This includes things like @Input,
        // @Output, @HostBinding, etc.
        var decoratedElements = members.filter(function (member) { return !member.isStatic && member.decorators !== null; });
        var coreModule = isCore ? undefined : '@angular/core';
        // Construct the map of inputs both from the @Directive/@Component
        // decorator, and the decorated
        // fields.
        var inputsFromMeta = parseFieldToPropertyMapping(directive, 'inputs', evaluator);
        var inputsFromFields = parseDecoratedFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'Input', coreModule), evaluator, resolveInput);
        // And outputs.
        var outputsFromMeta = parseFieldToPropertyMapping(directive, 'outputs', evaluator);
        var outputsFromFields = parseDecoratedFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'Output', coreModule), evaluator, resolveOutput);
        // Construct the list of queries.
        var contentChildFromFields = queriesFromFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'ContentChild', coreModule), reflector, evaluator);
        var contentChildrenFromFields = queriesFromFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'ContentChildren', coreModule), reflector, evaluator);
        var queries = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(contentChildFromFields)), tslib_1.__read(contentChildrenFromFields));
        // Construct the list of view queries.
        var viewChildFromFields = queriesFromFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'ViewChild', coreModule), reflector, evaluator);
        var viewChildrenFromFields = queriesFromFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'ViewChildren', coreModule), reflector, evaluator);
        var viewQueries = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(viewChildFromFields)), tslib_1.__read(viewChildrenFromFields));
        if (directive.has('queries')) {
            var queriesFromDecorator = extractQueriesFromDecorator(directive.get('queries'), reflector, evaluator, isCore);
            queries.push.apply(queries, tslib_1.__spreadArray([], tslib_1.__read(queriesFromDecorator.content)));
            viewQueries.push.apply(viewQueries, tslib_1.__spreadArray([], tslib_1.__read(queriesFromDecorator.view)));
        }
        // Parse the selector.
        var selector = defaultSelector;
        if (directive.has('selector')) {
            var expr = directive.get('selector');
            var resolved = evaluator.evaluate(expr);
            if (typeof resolved !== 'string') {
                throw diagnostics_2.createValueHasWrongTypeError(expr, resolved, "selector must be a string");
            }
            // use default selector in case selector is an empty string
            selector = resolved === '' ? defaultSelector : resolved;
            if (!selector) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DIRECTIVE_MISSING_SELECTOR, expr, "Directive " + clazz.name.text + " has no selector, please add it!");
            }
        }
        var host = extractHostBindings(decoratedElements, evaluator, coreModule, directive);
        var providers = directive.has('providers') ?
            new compiler_1.WrappedNodeExpr(annotateForClosureCompiler ?
                util_2.wrapFunctionExpressionsInParens(directive.get('providers')) :
                directive.get('providers')) :
            null;
        // Determine if `ngOnChanges` is a lifecycle hook defined on the component.
        var usesOnChanges = members.some(function (member) { return !member.isStatic && member.kind === reflection_1.ClassMemberKind.Method &&
            member.name === 'ngOnChanges'; });
        // Parse exportAs.
        var exportAs = null;
        if (directive.has('exportAs')) {
            var expr = directive.get('exportAs');
            var resolved = evaluator.evaluate(expr);
            if (typeof resolved !== 'string') {
                throw diagnostics_2.createValueHasWrongTypeError(expr, resolved, "exportAs must be a string");
            }
            exportAs = resolved.split(',').map(function (part) { return part.trim(); });
        }
        var rawCtorDeps = util_2.getConstructorDependencies(clazz, reflector, isCore);
        // Non-abstract directives (those with a selector) require valid constructor dependencies, whereas
        // abstract directives are allowed to have invalid dependencies, given that a subclass may call
        // the constructor explicitly.
        var ctorDeps = selector !== null ? util_2.validateConstructorDependencies(clazz, rawCtorDeps) :
            util_2.unwrapConstructorDependencies(rawCtorDeps);
        // Structural directives must have a `TemplateRef` dependency.
        var isStructural = ctorDeps !== null && ctorDeps !== 'invalid' &&
            ctorDeps.some(function (dep) { return (dep.token instanceof compiler_1.ExternalExpr) &&
                dep.token.value.moduleName === '@angular/core' &&
                dep.token.value.name === 'TemplateRef'; });
        // Detect if the component inherits from another class
        var usesInheritance = reflector.hasBaseClass(clazz);
        var type = util_2.wrapTypeReference(reflector, clazz);
        var internalType = new compiler_1.WrappedNodeExpr(reflector.getInternalNameOfClass(clazz));
        var inputs = metadata_1.ClassPropertyMapping.fromMappedObject(tslib_1.__assign(tslib_1.__assign({}, inputsFromMeta), inputsFromFields));
        var outputs = metadata_1.ClassPropertyMapping.fromMappedObject(tslib_1.__assign(tslib_1.__assign({}, outputsFromMeta), outputsFromFields));
        var metadata = {
            name: clazz.name.text,
            deps: ctorDeps,
            host: host,
            lifecycle: {
                usesOnChanges: usesOnChanges,
            },
            inputs: inputs.toJointMappedObject(),
            outputs: outputs.toDirectMappedObject(),
            queries: queries,
            viewQueries: viewQueries,
            selector: selector,
            fullInheritance: !!(flags & transform_1.HandlerFlags.FULL_INHERITANCE),
            type: type,
            internalType: internalType,
            typeArgumentCount: reflector.getGenericArityOfClass(clazz) || 0,
            typeSourceSpan: util_2.createSourceSpan(clazz.name),
            usesInheritance: usesInheritance,
            exportAs: exportAs,
            providers: providers
        };
        return {
            decorator: directive,
            metadata: metadata,
            inputs: inputs,
            outputs: outputs,
            isStructural: isStructural,
        };
    }
    exports.extractDirectiveMetadata = extractDirectiveMetadata;
    function extractQueryMetadata(exprNode, name, args, propertyName, reflector, evaluator) {
        var _a;
        if (args.length === 0) {
            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, exprNode, "@" + name + " must have arguments");
        }
        var first = name === 'ViewChild' || name === 'ContentChild';
        var node = (_a = util_2.tryUnwrapForwardRef(args[0], reflector)) !== null && _a !== void 0 ? _a : args[0];
        var arg = evaluator.evaluate(node);
        /** Whether or not this query should collect only static results (see view/api.ts)  */
        var isStatic = false;
        // Extract the predicate
        var predicate = null;
        if (arg instanceof imports_1.Reference || arg instanceof partial_evaluator_1.DynamicValue) {
            // References and predicates that could not be evaluated statically are emitted as is.
            predicate = new compiler_1.WrappedNodeExpr(node);
        }
        else if (typeof arg === 'string') {
            predicate = [arg];
        }
        else if (isStringArrayOrDie(arg, "@" + name + " predicate", node)) {
            predicate = arg;
        }
        else {
            throw diagnostics_2.createValueHasWrongTypeError(node, arg, "@" + name + " predicate cannot be interpreted");
        }
        // Extract the read and descendants options.
        var read = null;
        // The default value for descendants is true for every decorator except @ContentChildren.
        var descendants = name !== 'ContentChildren';
        var emitDistinctChangesOnly = core_1.emitDistinctChangesOnlyDefaultValue;
        if (args.length === 2) {
            var optionsExpr = util_2.unwrapExpression(args[1]);
            if (!ts.isObjectLiteralExpression(optionsExpr)) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARG_NOT_LITERAL, optionsExpr, "@" + name + " options must be an object literal");
            }
            var options = reflection_1.reflectObjectLiteral(optionsExpr);
            if (options.has('read')) {
                read = new compiler_1.WrappedNodeExpr(options.get('read'));
            }
            if (options.has('descendants')) {
                var descendantsExpr = options.get('descendants');
                var descendantsValue = evaluator.evaluate(descendantsExpr);
                if (typeof descendantsValue !== 'boolean') {
                    throw diagnostics_2.createValueHasWrongTypeError(descendantsExpr, descendantsValue, "@" + name + " options.descendants must be a boolean");
                }
                descendants = descendantsValue;
            }
            if (options.has('emitDistinctChangesOnly')) {
                var emitDistinctChangesOnlyExpr = options.get('emitDistinctChangesOnly');
                var emitDistinctChangesOnlyValue = evaluator.evaluate(emitDistinctChangesOnlyExpr);
                if (typeof emitDistinctChangesOnlyValue !== 'boolean') {
                    throw diagnostics_2.createValueHasWrongTypeError(emitDistinctChangesOnlyExpr, emitDistinctChangesOnlyValue, "@" + name + " options.emitDistinctChangesOnly must be a boolean");
                }
                emitDistinctChangesOnly = emitDistinctChangesOnlyValue;
            }
            if (options.has('static')) {
                var staticValue = evaluator.evaluate(options.get('static'));
                if (typeof staticValue !== 'boolean') {
                    throw diagnostics_2.createValueHasWrongTypeError(node, staticValue, "@" + name + " options.static must be a boolean");
                }
                isStatic = staticValue;
            }
        }
        else if (args.length > 2) {
            // Too many arguments.
            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, node, "@" + name + " has too many arguments");
        }
        return {
            propertyName: propertyName,
            predicate: predicate,
            first: first,
            descendants: descendants,
            read: read,
            static: isStatic,
            emitDistinctChangesOnly: emitDistinctChangesOnly,
        };
    }
    exports.extractQueryMetadata = extractQueryMetadata;
    function extractQueriesFromDecorator(queryData, reflector, evaluator, isCore) {
        var content = [], view = [];
        if (!ts.isObjectLiteralExpression(queryData)) {
            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.VALUE_HAS_WRONG_TYPE, queryData, 'Decorator queries metadata must be an object literal');
        }
        reflection_1.reflectObjectLiteral(queryData).forEach(function (queryExpr, propertyName) {
            queryExpr = util_2.unwrapExpression(queryExpr);
            if (!ts.isNewExpression(queryExpr)) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.VALUE_HAS_WRONG_TYPE, queryData, 'Decorator query metadata must be an instance of a query type');
            }
            var queryType = ts.isPropertyAccessExpression(queryExpr.expression) ?
                queryExpr.expression.name :
                queryExpr.expression;
            if (!ts.isIdentifier(queryType)) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.VALUE_HAS_WRONG_TYPE, queryData, 'Decorator query metadata must be an instance of a query type');
            }
            var type = reflector.getImportOfIdentifier(queryType);
            if (type === null || (!isCore && type.from !== '@angular/core') ||
                !QUERY_TYPES.has(type.name)) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.VALUE_HAS_WRONG_TYPE, queryData, 'Decorator query metadata must be an instance of a query type');
            }
            var query = extractQueryMetadata(queryExpr, type.name, queryExpr.arguments || [], propertyName, reflector, evaluator);
            if (type.name.startsWith('Content')) {
                content.push(query);
            }
            else {
                view.push(query);
            }
        });
        return { content: content, view: view };
    }
    exports.extractQueriesFromDecorator = extractQueriesFromDecorator;
    function isStringArrayOrDie(value, name, node) {
        if (!Array.isArray(value)) {
            return false;
        }
        for (var i = 0; i < value.length; i++) {
            if (typeof value[i] !== 'string') {
                throw diagnostics_2.createValueHasWrongTypeError(node, value[i], "Failed to resolve " + name + " at position " + i + " to a string");
            }
        }
        return true;
    }
    function parseFieldArrayValue(directive, field, evaluator) {
        if (!directive.has(field)) {
            return null;
        }
        // Resolve the field of interest from the directive metadata to a string[].
        var expression = directive.get(field);
        var value = evaluator.evaluate(expression);
        if (!isStringArrayOrDie(value, field, expression)) {
            throw diagnostics_2.createValueHasWrongTypeError(expression, value, "Failed to resolve @Directive." + field + " to a string array");
        }
        return value;
    }
    exports.parseFieldArrayValue = parseFieldArrayValue;
    /**
     * Interpret property mapping fields on the decorator (e.g. inputs or outputs) and return the
     * correctly shaped metadata object.
     */
    function parseFieldToPropertyMapping(directive, field, evaluator) {
        var metaValues = parseFieldArrayValue(directive, field, evaluator);
        if (!metaValues) {
            return EMPTY_OBJECT;
        }
        return metaValues.reduce(function (results, value) {
            // Either the value is 'field' or 'field: property'. In the first case, `property` will
            // be undefined, in which case the field name should also be used as the property name.
            var _a = tslib_1.__read(value.split(':', 2).map(function (str) { return str.trim(); }), 2), field = _a[0], property = _a[1];
            results[field] = property || field;
            return results;
        }, {});
    }
    /**
     * Parse property decorators (e.g. `Input` or `Output`) and return the correctly shaped metadata
     * object.
     */
    function parseDecoratedFields(fields, evaluator, mapValueResolver) {
        return fields.reduce(function (results, field) {
            var fieldName = field.member.name;
            field.decorators.forEach(function (decorator) {
                // The decorator either doesn't have an argument (@Input()) in which case the property
                // name is used, or it has one argument (@Output('named')).
                if (decorator.args == null || decorator.args.length === 0) {
                    results[fieldName] = fieldName;
                }
                else if (decorator.args.length === 1) {
                    var property = evaluator.evaluate(decorator.args[0]);
                    if (typeof property !== 'string') {
                        throw diagnostics_2.createValueHasWrongTypeError(reflection_1.Decorator.nodeForError(decorator), property, "@" + decorator.name + " decorator argument must resolve to a string");
                    }
                    results[fieldName] = mapValueResolver(property, fieldName);
                }
                else {
                    // Too many arguments.
                    throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, reflection_1.Decorator.nodeForError(decorator), "@" + decorator.name + " can have at most one argument, got " + decorator.args.length + " argument(s)");
                }
            });
            return results;
        }, {});
    }
    function resolveInput(publicName, internalName) {
        return [publicName, internalName];
    }
    function resolveOutput(publicName, internalName) {
        return publicName;
    }
    function queriesFromFields(fields, reflector, evaluator) {
        return fields.map(function (_a) {
            var member = _a.member, decorators = _a.decorators;
            var decorator = decorators[0];
            var node = member.node || reflection_1.Decorator.nodeForError(decorator);
            // Throw in case of `@Input() @ContentChild('foo') foo: any`, which is not supported in Ivy
            if (member.decorators.some(function (v) { return v.name === 'Input'; })) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_COLLISION, node, 'Cannot combine @Input decorators with query decorators');
            }
            if (decorators.length !== 1) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_COLLISION, node, 'Cannot have multiple query decorators on the same class member');
            }
            else if (!isPropertyTypeMember(member)) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_UNEXPECTED, node, 'Query decorator must go on a property-type member');
            }
            return extractQueryMetadata(node, decorator.name, decorator.args || [], member.name, reflector, evaluator);
        });
    }
    exports.queriesFromFields = queriesFromFields;
    function isPropertyTypeMember(member) {
        return member.kind === reflection_1.ClassMemberKind.Getter || member.kind === reflection_1.ClassMemberKind.Setter ||
            member.kind === reflection_1.ClassMemberKind.Property;
    }
    function evaluateHostExpressionBindings(hostExpr, evaluator) {
        var hostMetaMap = evaluator.evaluate(hostExpr);
        if (!(hostMetaMap instanceof Map)) {
            throw diagnostics_2.createValueHasWrongTypeError(hostExpr, hostMetaMap, "Decorator host metadata must be an object");
        }
        var hostMetadata = {};
        hostMetaMap.forEach(function (value, key) {
            // Resolve Enum references to their declared value.
            if (value instanceof partial_evaluator_1.EnumValue) {
                value = value.resolved;
            }
            if (typeof key !== 'string') {
                throw diagnostics_2.createValueHasWrongTypeError(hostExpr, key, "Decorator host metadata must be a string -> string object, but found unparseable key");
            }
            if (typeof value == 'string') {
                hostMetadata[key] = value;
            }
            else if (value instanceof partial_evaluator_1.DynamicValue) {
                hostMetadata[key] = new compiler_1.WrappedNodeExpr(value.node);
            }
            else {
                throw diagnostics_2.createValueHasWrongTypeError(hostExpr, value, "Decorator host metadata must be a string -> string object, but found unparseable value");
            }
        });
        var bindings = compiler_1.parseHostBindings(hostMetadata);
        var errors = compiler_1.verifyHostBindings(bindings, util_2.createSourceSpan(hostExpr));
        if (errors.length > 0) {
            throw new diagnostics_1.FatalDiagnosticError(
            // TODO: provide more granular diagnostic and output specific host expression that
            // triggered an error instead of the whole host object.
            diagnostics_1.ErrorCode.HOST_BINDING_PARSE_ERROR, hostExpr, errors.map(function (error) { return error.msg; }).join('\n'));
        }
        return bindings;
    }
    function extractHostBindings(members, evaluator, coreModule, metadata) {
        var bindings;
        if (metadata && metadata.has('host')) {
            bindings = evaluateHostExpressionBindings(metadata.get('host'), evaluator);
        }
        else {
            bindings = compiler_1.parseHostBindings({});
        }
        reflection_1.filterToMembersWithDecorator(members, 'HostBinding', coreModule)
            .forEach(function (_a) {
            var member = _a.member, decorators = _a.decorators;
            decorators.forEach(function (decorator) {
                var hostPropertyName = member.name;
                if (decorator.args !== null && decorator.args.length > 0) {
                    if (decorator.args.length !== 1) {
                        throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, reflection_1.Decorator.nodeForError(decorator), "@HostBinding can have at most one argument, got " + decorator.args.length + " argument(s)");
                    }
                    var resolved = evaluator.evaluate(decorator.args[0]);
                    if (typeof resolved !== 'string') {
                        throw diagnostics_2.createValueHasWrongTypeError(reflection_1.Decorator.nodeForError(decorator), resolved, "@HostBinding's argument must be a string");
                    }
                    hostPropertyName = resolved;
                }
                // Since this is a decorator, we know that the value is a class member. Always access it
                // through `this` so that further down the line it can't be confused for a literal value
                // (e.g. if there's a property called `true`). There is no size penalty, because all
                // values (except literals) are converted to `ctx.propName` eventually.
                bindings.properties[hostPropertyName] = compiler_1.getSafePropertyAccessString('this', member.name);
            });
        });
        reflection_1.filterToMembersWithDecorator(members, 'HostListener', coreModule)
            .forEach(function (_a) {
            var member = _a.member, decorators = _a.decorators;
            decorators.forEach(function (decorator) {
                var eventName = member.name;
                var args = [];
                if (decorator.args !== null && decorator.args.length > 0) {
                    if (decorator.args.length > 2) {
                        throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, decorator.args[2], "@HostListener can have at most two arguments");
                    }
                    var resolved = evaluator.evaluate(decorator.args[0]);
                    if (typeof resolved !== 'string') {
                        throw diagnostics_2.createValueHasWrongTypeError(decorator.args[0], resolved, "@HostListener's event name argument must be a string");
                    }
                    eventName = resolved;
                    if (decorator.args.length === 2) {
                        var expression = decorator.args[1];
                        var resolvedArgs = evaluator.evaluate(decorator.args[1]);
                        if (!isStringArrayOrDie(resolvedArgs, '@HostListener.args', expression)) {
                            throw diagnostics_2.createValueHasWrongTypeError(decorator.args[1], resolvedArgs, "@HostListener's second argument must be a string array");
                        }
                        args = resolvedArgs;
                    }
                }
                bindings.listeners[eventName] = member.name + "(" + args.join(',') + ")";
            });
        });
        return bindings;
    }
    exports.extractHostBindings = extractHostBindings;
    var QUERY_TYPES = new Set([
        'ContentChild',
        'ContentChildren',
        'ViewChild',
        'ViewChildren',
    ]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9hbm5vdGF0aW9ucy9zcmMvZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCw4Q0FBMmE7SUFDM2EsbURBQStFO0lBQy9FLCtCQUFpQztJQUVqQywyRUFBa0U7SUFDbEUsbUVBQXdDO0lBQ3hDLDZGQUFnTjtJQUNoTixxRUFBNE07SUFDNU0sMEVBQXNFO0lBQ3RFLHVGQUFrRjtJQUNsRiw2REFBbUQ7SUFDbkQseUVBQStKO0lBRS9KLHVFQUE4STtJQUU5SSwyRkFBOEo7SUFDOUosbUZBQTBFO0lBQzFFLHFGQUFnRDtJQUNoRCw2RUFBNlY7SUFFN1YsSUFBTSxZQUFZLEdBQTRCLEVBQUUsQ0FBQztJQUNqRCxJQUFNLGdCQUFnQixHQUFHO1FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsYUFBYTtRQUNoRyxjQUFjO0tBQ2YsQ0FBQztJQUNGLElBQU0sZUFBZSxHQUFHLElBQUksR0FBRyxDQUFDO1FBQzlCLGFBQWEsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxvQkFBb0I7UUFDOUYsb0JBQW9CLEVBQUUsdUJBQXVCO0tBQzlDLENBQUMsQ0FBQztJQWNIOzs7T0FHRztJQUNIO1FBQXFDLDJDQUFjO1FBR2pELHlCQUNJLElBQXNCLEVBQWtCLFFBQXFCLEVBQzdDLE1BQTRCLEVBQWtCLE9BQTZCLEVBQzNFLFFBQXVCLEVBQ3ZCLGFBQXFDLEVBQ3JDLGNBQTRDO1lBTGhFLFlBTUUsa0JBQU0sSUFBSSxDQUFDLFNBQ1o7WUFOMkMsY0FBUSxHQUFSLFFBQVEsQ0FBYTtZQUM3QyxZQUFNLEdBQU4sTUFBTSxDQUFzQjtZQUFrQixhQUFPLEdBQVAsT0FBTyxDQUFzQjtZQUMzRSxjQUFRLEdBQVIsUUFBUSxDQUFlO1lBQ3ZCLG1CQUFhLEdBQWIsYUFBYSxDQUF3QjtZQUNyQyxvQkFBYyxHQUFkLGNBQWMsQ0FBOEI7WUFQaEUsZUFBUyxHQUF3QixJQUFJLENBQUM7O1FBU3RDLENBQUM7UUFFUSw2Q0FBbUIsR0FBNUIsVUFBNkIsY0FBOEI7WUFDekQsMEZBQTBGO1lBQzFGLDJGQUEyRjtZQUMzRiwwQkFBMEI7WUFDMUIsSUFBSSxDQUFDLENBQUMsY0FBYyxZQUFZLGVBQWUsQ0FBQyxFQUFFO2dCQUNoRCxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsa0RBQWtEO1lBQ2xELHNCQUFzQjtZQUN0Qiw2RkFBNkY7WUFDN0Ysb0NBQW9DO1lBQ3BDLG1EQUFtRDtZQUNuRCxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssY0FBYyxDQUFDLFFBQVE7Z0JBQzVDLENBQUMsNkJBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQztnQkFDN0UsQ0FBQyw2QkFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO2dCQUMvRSxDQUFDLDZCQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVRLGdEQUFzQixHQUEvQixVQUFnQyxjQUE4QjtZQUM1RCxrRkFBa0Y7WUFDbEYsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLEVBQUU7Z0JBQzVDLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFJLENBQUMsQ0FBQyxjQUFjLFlBQVksZUFBZSxDQUFDLEVBQUU7Z0JBQ2hELE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCw2RkFBNkY7WUFDN0Ysb0NBQW9DO1lBQ3BDLElBQUksQ0FBQyw2QkFBWSxDQUNULEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLG1CQUFtQixDQUFDO2dCQUNwRixDQUFDLDZCQUFZLENBQ1QsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsbUJBQW1CLENBQUMsRUFBRTtnQkFDMUYsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELDhGQUE4RjtZQUM5Riw2RkFBNkY7WUFDN0YsbURBQW1EO1lBQ25ELElBQUksQ0FBQyx1Q0FBc0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDL0UsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELCtGQUErRjtZQUMvRiwwQkFBMEI7WUFDMUIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsY0FBYyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUMzRSxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsNkZBQTZGO1lBQzdGLHlGQUF5RjtZQUN6RixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQy9ELE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDSCxzQkFBQztJQUFELENBQUMsQUF2RUQsQ0FBcUMsK0JBQWMsR0F1RWxEO0lBdkVZLDBDQUFlO0lBeUU1QixTQUFTLG1CQUFtQixDQUN4QixPQUFpRCxFQUNqRCxRQUFrRDtRQUNwRCxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsU0FBUyxvQkFBb0IsQ0FDekIsT0FBK0IsRUFBRSxRQUFnQztRQUNuRSxJQUFJLE9BQU8sQ0FBQyx5QkFBeUIsS0FBSyxRQUFRLENBQUMseUJBQXlCLEVBQUU7WUFDNUUsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxRQUFRLENBQUMsU0FBUyxFQUFFO1lBQzVDLGdHQUFnRztZQUNoRywwRkFBMEY7WUFDMUYsNEVBQTRFO1lBQzVFLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLENBQUMsNkJBQVksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixFQUFFLG9CQUFvQixDQUFDLEVBQUU7WUFDNUYsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksQ0FBQywyQkFBVSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsa0JBQWtCLENBQUMsRUFBRTtZQUN4RSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBSSxDQUFDLDJCQUFVLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO1lBQzlFLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLENBQUMsMkJBQVUsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsUUFBUSxDQUFDLHdCQUF3QixDQUFDLEVBQUU7WUFDcEYsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksQ0FBQywyQkFBVSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxRQUFRLENBQUMscUJBQXFCLENBQUMsRUFBRTtZQUM5RSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsU0FBUyxvQkFBb0IsQ0FBQyxPQUEwQixFQUFFLFFBQTJCO1FBQ25GLE9BQU8sT0FBTyxDQUFDLFNBQVMsS0FBSyxRQUFRLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQztJQUNwRixDQUFDO0lBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxPQUE0QixFQUFFLFFBQTZCO1FBQ25GLElBQUksT0FBTyxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1lBQ3pDLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQztTQUM3QjtRQUVELE9BQU8sOEJBQWEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVEO1FBRUUsbUNBQ1ksU0FBeUIsRUFBVSxTQUEyQixFQUM5RCxZQUE4QixFQUFVLGFBQXVDLEVBQy9FLFVBQTBCLEVBQVUsa0JBQTJDLEVBQy9FLE1BQWUsRUFBVSx1QkFBcUQsRUFDOUUsMEJBQW1DLEVBQ25DLDRDQUFxRCxFQUFVLElBQWtCO1lBTGpGLGNBQVMsR0FBVCxTQUFTLENBQWdCO1lBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7WUFDOUQsaUJBQVksR0FBWixZQUFZLENBQWtCO1lBQVUsa0JBQWEsR0FBYixhQUFhLENBQTBCO1lBQy9FLGVBQVUsR0FBVixVQUFVLENBQWdCO1lBQVUsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUF5QjtZQUMvRSxXQUFNLEdBQU4sTUFBTSxDQUFTO1lBQVUsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUE4QjtZQUM5RSwrQkFBMEIsR0FBMUIsMEJBQTBCLENBQVM7WUFDbkMsaURBQTRDLEdBQTVDLDRDQUE0QyxDQUFTO1lBQVUsU0FBSSxHQUFKLElBQUksQ0FBYztZQUVwRixlQUFVLEdBQUcsNkJBQWlCLENBQUMsT0FBTyxDQUFDO1lBQ3ZDLFNBQUksR0FBRyx5QkFBeUIsQ0FBQyxJQUFJLENBQUM7UUFIaUQsQ0FBQztRQUtqRywwQ0FBTSxHQUFOLFVBQU8sSUFBc0IsRUFBRSxVQUE0QjtZQUV6RCwwRUFBMEU7WUFDMUUsNEVBQTRFO1lBQzVFLCtFQUErRTtZQUMvRSw0Q0FBNEM7WUFDNUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDZixJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsaUNBQWlDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xFLE9BQU8sWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7b0JBQy9ELFNBQVMsQ0FBQzthQUNqQztpQkFBTTtnQkFDTCxJQUFNLFNBQVMsR0FBRywyQkFBb0IsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0UsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxXQUFBLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7YUFDMUY7UUFDSCxDQUFDO1FBRUQsMkNBQU8sR0FBUCxVQUFRLElBQXNCLEVBQUUsU0FBbUMsRUFBRSxLQUF5QjtZQUF6QixzQkFBQSxFQUFBLFFBQVEsd0JBQVksQ0FBQyxJQUFJO1lBRTVGLGlGQUFpRjtZQUNqRixtRkFBbUY7WUFDbkYsOEVBQThFO1lBQzlFLGtFQUFrRTtZQUNsRSxJQUFJLElBQUksQ0FBQyw0Q0FBNEMsS0FBSyxLQUFLLElBQUksU0FBUyxLQUFLLElBQUksRUFBRTtnQkFDckYsT0FBTyxFQUFDLFdBQVcsRUFBRSxDQUFDLDhEQUFnRCxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQzthQUNoRjtZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUVqRCxJQUFNLGVBQWUsR0FBRyx3QkFBd0IsQ0FDNUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQ25FLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3JDLElBQUksZUFBZSxLQUFLLFNBQVMsRUFBRTtnQkFDakMsT0FBTyxFQUFFLENBQUM7YUFDWDtZQUNELElBQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUM7WUFFMUMsSUFBSSx5QkFBeUIsR0FBMEMsSUFBSSxDQUFDO1lBQzVFLElBQUksZUFBZSxLQUFLLFNBQVMsSUFBSSxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDL0UseUJBQXlCLEdBQUcsdUNBQWdDLENBQ3hELGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBRSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ2xGO1lBRUQsT0FBTztnQkFDTCxRQUFRLEVBQUU7b0JBQ1IsTUFBTSxFQUFFLGVBQWUsQ0FBQyxNQUFNO29CQUM5QixPQUFPLEVBQUUsZUFBZSxDQUFDLE9BQU87b0JBQ2hDLElBQUksRUFBRSxRQUFRO29CQUNkLGFBQWEsRUFBRSwrQkFBb0IsQ0FDL0IsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsMEJBQTBCLENBQUM7b0JBQ3ZFLFNBQVMsRUFBRSxvQkFBYSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQzlELGFBQWEsRUFBRSxvQ0FBNkIsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO29CQUMxRix5QkFBeUIsMkJBQUE7b0JBQ3pCLFVBQVUsRUFBRSxLQUFLO29CQUNqQixZQUFZLEVBQUUsZUFBZSxDQUFDLFlBQVk7aUJBQzNDO2FBQ0YsQ0FBQztRQUNKLENBQUM7UUFFRCwwQ0FBTSxHQUFOLFVBQU8sSUFBc0IsRUFBRSxRQUF3QztZQUNyRSxJQUFNLGNBQWMsR0FBRyw4Q0FBNkIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUzRCxPQUFPLElBQUksZUFBZSxDQUN0QixJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUN2RixRQUFRLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFRCw0Q0FBUSxHQUFSLFVBQVMsSUFBc0IsRUFBRSxRQUF3QztZQUN2RSx1RkFBdUY7WUFDdkYsK0VBQStFO1lBQy9FLElBQU0sR0FBRyxHQUFHLElBQUksbUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLHlCQUF5QixxQ0FDekMsSUFBSSxFQUFFLG1CQUFRLENBQUMsU0FBUyxFQUN4QixHQUFHLEtBQUEsRUFDSCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQ3BCLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFDaEMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUNoQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFDdkIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPLEVBQ3pCLE9BQU8sRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsWUFBWSxFQUFsQixDQUFrQixDQUFDLEVBQy9ELFdBQVcsRUFBRSxLQUFLLEVBQ2xCLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUyxJQUMxQixRQUFRLENBQUMsYUFBYSxLQUN6QixVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVUsRUFDL0IsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZLElBQ25DLENBQUM7WUFFSCxJQUFJLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVELDJDQUFPLEdBQVAsVUFBUSxJQUFzQixFQUFFLFFBQThCLEVBQUUsTUFBdUI7WUFFckYsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEtBQUssSUFBSSxJQUFJLFFBQVEsQ0FBQyxTQUFTLFlBQVksbUJBQVMsRUFBRTtnQkFDcEYsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEY7WUFFRCxJQUFNLFdBQVcsR0FBb0IsRUFBRSxDQUFDO1lBQ3hDLElBQUksUUFBUSxDQUFDLHlCQUF5QixLQUFLLElBQUk7Z0JBQzNDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxZQUFZLDBCQUFlLEVBQUU7Z0JBQ3RELElBQU0sbUJBQW1CLEdBQUcsb0NBQXNCLENBQzlDLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVUsQ0FBQyxJQUFJLEVBQ2pFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUM3QixXQUFXLENBQUMsSUFBSSxPQUFoQixXQUFXLDJDQUFTLG1CQUFtQixJQUFFO2FBQzFDO1lBRUQsSUFBTSxvQkFBb0IsR0FBRyxxQ0FBdUIsQ0FDaEQsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDNUYsSUFBSSxvQkFBb0IsS0FBSyxJQUFJLEVBQUU7Z0JBQ2pDLFdBQVcsQ0FBQyxJQUFJLE9BQWhCLFdBQVcsMkNBQVMsb0JBQW9CLElBQUU7YUFDM0M7WUFFRCxPQUFPLEVBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBQyxDQUFDO1FBQ3pFLENBQUM7UUFFRCwrQ0FBVyxHQUFYLFVBQ0ksSUFBc0IsRUFBRSxRQUF3QyxFQUNoRSxVQUE2QixFQUFFLElBQWtCO1lBQ25ELElBQU0sR0FBRyxHQUFHLGtDQUF3QixDQUFDLHdCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsd0JBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2hHLElBQU0sR0FBRyxHQUFHLHVDQUE0QixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLDRCQUFpQixFQUFFLENBQUMsQ0FBQztZQUNuRixJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUNuRCwrQkFBb0IsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxDQUFDO1lBQ1QsT0FBTyxxQkFBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFFRCxrREFBYyxHQUFkLFVBQ0ksSUFBc0IsRUFBRSxRQUF3QyxFQUNoRSxVQUE2QjtZQUMvQixJQUFNLEdBQUcsR0FBRywrQkFBcUIsQ0FBQyx3QkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLHdCQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM3RixJQUFNLEdBQUcsR0FBRyw4Q0FBbUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0QsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsQ0FBQztnQkFDbkQsc0NBQTJCLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQzlELElBQUksQ0FBQztZQUNULE9BQU8scUJBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSyxxRUFBaUMsR0FBekMsVUFBMEMsSUFBc0I7WUFBaEUsaUJBYUM7WUFaQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtnQkFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyw0QkFBZSxDQUFDLE1BQU07b0JBQzFELGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNwQyxPQUFPLElBQUksQ0FBQztpQkFDYjtnQkFDRCxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUU7b0JBQ3JCLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ3pCLFVBQUEsU0FBUyxJQUFJLE9BQUEsZ0JBQWdCLENBQUMsSUFBSSxDQUM5QixVQUFBLGFBQWEsSUFBSSxPQUFBLHlCQUFrQixDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUF6RCxDQUF5RCxDQUFDLEVBRGxFLENBQ2tFLENBQUMsQ0FBQztpQkFDdEY7Z0JBQ0QsT0FBTyxLQUFLLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDSCxnQ0FBQztJQUFELENBQUMsQUF4S0QsSUF3S0M7SUF4S1ksOERBQXlCO0lBMEt0Qzs7Ozs7T0FLRztJQUNILFNBQWdCLHdCQUF3QixDQUNwQyxLQUF1QixFQUFFLFNBQW1DLEVBQUUsU0FBeUIsRUFDdkYsU0FBMkIsRUFBRSxNQUFlLEVBQUUsS0FBbUIsRUFDakUsMEJBQW1DLEVBQUUsZUFBbUM7UUFBbkMsZ0NBQUEsRUFBQSxzQkFBbUM7UUFPMUUsSUFBSSxTQUFxQyxDQUFDO1FBQzFDLElBQUksU0FBUyxLQUFLLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDaEYsU0FBUyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO1NBQzlDO2FBQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdEMsTUFBTSxJQUFJLGtDQUFvQixDQUMxQix1QkFBUyxDQUFDLHFCQUFxQixFQUFFLHNCQUFTLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUNsRSx1Q0FBcUMsU0FBUyxDQUFDLElBQUksZUFBWSxDQUFDLENBQUM7U0FDdEU7YUFBTTtZQUNMLElBQU0sSUFBSSxHQUFHLHVCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2QyxNQUFNLElBQUksa0NBQW9CLENBQzFCLHVCQUFTLENBQUMseUJBQXlCLEVBQUUsSUFBSSxFQUN6QyxNQUFJLFNBQVMsQ0FBQyxJQUFJLHdDQUFxQyxDQUFDLENBQUM7YUFDOUQ7WUFDRCxTQUFTLEdBQUcsaUNBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEIsd0VBQXdFO1lBQ3hFLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRW5ELGdHQUFnRztRQUNoRyw4QkFBOEI7UUFDOUIsSUFBTSxpQkFBaUIsR0FDbkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLElBQUksRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDO1FBRTdFLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUM7UUFFeEQsa0VBQWtFO1FBQ2xFLCtCQUErQjtRQUMvQixVQUFVO1FBQ1YsSUFBTSxjQUFjLEdBQUcsMkJBQTJCLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNuRixJQUFNLGdCQUFnQixHQUFHLG9CQUFvQixDQUN6Qyx5Q0FBNEIsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLEVBQUUsU0FBUyxFQUMvRSxZQUFZLENBQUMsQ0FBQztRQUVsQixlQUFlO1FBQ2YsSUFBTSxlQUFlLEdBQUcsMkJBQTJCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRixJQUFNLGlCQUFpQixHQUNuQixvQkFBb0IsQ0FDaEIseUNBQTRCLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxFQUFFLFNBQVMsRUFDaEYsYUFBYSxDQUE4QixDQUFDO1FBQ3BELGlDQUFpQztRQUNqQyxJQUFNLHNCQUFzQixHQUFHLGlCQUFpQixDQUM1Qyx5Q0FBNEIsQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsVUFBVSxDQUFDLEVBQUUsU0FBUyxFQUN0RixTQUFTLENBQUMsQ0FBQztRQUNmLElBQU0seUJBQXlCLEdBQUcsaUJBQWlCLENBQy9DLHlDQUE0QixDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxFQUFFLFNBQVMsRUFDekYsU0FBUyxDQUFDLENBQUM7UUFFZixJQUFNLE9BQU8sa0VBQU8sc0JBQXNCLG1CQUFLLHlCQUF5QixFQUFDLENBQUM7UUFFMUUsc0NBQXNDO1FBQ3RDLElBQU0sbUJBQW1CLEdBQUcsaUJBQWlCLENBQ3pDLHlDQUE0QixDQUFDLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsRUFBRSxTQUFTLEVBQ25GLFNBQVMsQ0FBQyxDQUFDO1FBQ2YsSUFBTSxzQkFBc0IsR0FBRyxpQkFBaUIsQ0FDNUMseUNBQTRCLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQyxFQUFFLFNBQVMsRUFDdEYsU0FBUyxDQUFDLENBQUM7UUFDZixJQUFNLFdBQVcsa0VBQU8sbUJBQW1CLG1CQUFLLHNCQUFzQixFQUFDLENBQUM7UUFFeEUsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzVCLElBQU0sb0JBQW9CLEdBQ3RCLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN6RixPQUFPLENBQUMsSUFBSSxPQUFaLE9BQU8sMkNBQVMsb0JBQW9CLENBQUMsT0FBTyxJQUFFO1lBQzlDLFdBQVcsQ0FBQyxJQUFJLE9BQWhCLFdBQVcsMkNBQVMsb0JBQW9CLENBQUMsSUFBSSxJQUFFO1NBQ2hEO1FBRUQsc0JBQXNCO1FBQ3RCLElBQUksUUFBUSxHQUFHLGVBQWUsQ0FBQztRQUMvQixJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDN0IsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUUsQ0FBQztZQUN4QyxJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO2dCQUNoQyxNQUFNLDBDQUE0QixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsMkJBQTJCLENBQUMsQ0FBQzthQUNqRjtZQUNELDJEQUEyRDtZQUMzRCxRQUFRLEdBQUcsUUFBUSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFDeEQsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDYixNQUFNLElBQUksa0NBQW9CLENBQzFCLHVCQUFTLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxFQUMxQyxlQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxxQ0FBa0MsQ0FBQyxDQUFDO2FBQ3JFO1NBQ0Y7UUFFRCxJQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXRGLElBQU0sU0FBUyxHQUFvQixTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDM0QsSUFBSSwwQkFBZSxDQUNmLDBCQUEwQixDQUFDLENBQUM7Z0JBQ3hCLHNDQUErQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBRSxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUM7UUFFVCwyRUFBMkU7UUFDM0UsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FDOUIsVUFBQSxNQUFNLElBQUksT0FBQSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyw0QkFBZSxDQUFDLE1BQU07WUFDaEUsTUFBTSxDQUFDLElBQUksS0FBSyxhQUFhLEVBRHZCLENBQ3VCLENBQUMsQ0FBQztRQUV2QyxrQkFBa0I7UUFDbEIsSUFBSSxRQUFRLEdBQWtCLElBQUksQ0FBQztRQUNuQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDN0IsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUUsQ0FBQztZQUN4QyxJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO2dCQUNoQyxNQUFNLDBDQUE0QixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsMkJBQTJCLENBQUMsQ0FBQzthQUNqRjtZQUNELFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQU0sV0FBVyxHQUFHLGlDQUEwQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFekUsa0dBQWtHO1FBQ2xHLCtGQUErRjtRQUMvRiw4QkFBOEI7UUFDOUIsSUFBTSxRQUFRLEdBQUcsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsc0NBQStCLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDckQsb0NBQTZCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFaEYsOERBQThEO1FBQzlELElBQU0sWUFBWSxHQUFHLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVM7WUFDNUQsUUFBUSxDQUFDLElBQUksQ0FDVCxVQUFBLEdBQUcsSUFBSSxPQUFBLENBQUMsR0FBRyxDQUFDLEtBQUssWUFBWSx1QkFBWSxDQUFDO2dCQUN0QyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssZUFBZTtnQkFDOUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFGbkMsQ0FFbUMsQ0FBQyxDQUFDO1FBRXBELHNEQUFzRDtRQUN0RCxJQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELElBQU0sSUFBSSxHQUFHLHdCQUFpQixDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRCxJQUFNLFlBQVksR0FBRyxJQUFJLDBCQUFlLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFbEYsSUFBTSxNQUFNLEdBQUcsK0JBQW9CLENBQUMsZ0JBQWdCLHVDQUFLLGNBQWMsR0FBSyxnQkFBZ0IsRUFBRSxDQUFDO1FBQy9GLElBQU0sT0FBTyxHQUFHLCtCQUFvQixDQUFDLGdCQUFnQix1Q0FBSyxlQUFlLEdBQUssaUJBQWlCLEVBQUUsQ0FBQztRQUVsRyxJQUFNLFFBQVEsR0FBd0I7WUFDcEMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSTtZQUNyQixJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksTUFBQTtZQUNKLFNBQVMsRUFBRTtnQkFDVCxhQUFhLGVBQUE7YUFDZDtZQUNELE1BQU0sRUFBRSxNQUFNLENBQUMsbUJBQW1CLEVBQUU7WUFDcEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRTtZQUN2QyxPQUFPLFNBQUE7WUFDUCxXQUFXLGFBQUE7WUFDWCxRQUFRLFVBQUE7WUFDUixlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLHdCQUFZLENBQUMsZ0JBQWdCLENBQUM7WUFDMUQsSUFBSSxNQUFBO1lBQ0osWUFBWSxjQUFBO1lBQ1osaUJBQWlCLEVBQUUsU0FBUyxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDL0QsY0FBYyxFQUFFLHVCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDNUMsZUFBZSxpQkFBQTtZQUNmLFFBQVEsVUFBQTtZQUNSLFNBQVMsV0FBQTtTQUNWLENBQUM7UUFDRixPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsUUFBUSxVQUFBO1lBQ1IsTUFBTSxRQUFBO1lBQ04sT0FBTyxTQUFBO1lBQ1AsWUFBWSxjQUFBO1NBQ2IsQ0FBQztJQUNKLENBQUM7SUE5S0QsNERBOEtDO0lBRUQsU0FBZ0Isb0JBQW9CLENBQ2hDLFFBQWlCLEVBQUUsSUFBWSxFQUFFLElBQWtDLEVBQUUsWUFBb0IsRUFDekYsU0FBeUIsRUFBRSxTQUEyQjs7UUFDeEQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNyQixNQUFNLElBQUksa0NBQW9CLENBQzFCLHVCQUFTLENBQUMscUJBQXFCLEVBQUUsUUFBUSxFQUFFLE1BQUksSUFBSSx5QkFBc0IsQ0FBQyxDQUFDO1NBQ2hGO1FBQ0QsSUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLEtBQUssY0FBYyxDQUFDO1FBQzlELElBQU0sSUFBSSxHQUFHLE1BQUEsMEJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxtQ0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxzRkFBc0Y7UUFDdEYsSUFBSSxRQUFRLEdBQVksS0FBSyxDQUFDO1FBRTlCLHdCQUF3QjtRQUN4QixJQUFJLFNBQVMsR0FBNkIsSUFBSSxDQUFDO1FBQy9DLElBQUksR0FBRyxZQUFZLG1CQUFTLElBQUksR0FBRyxZQUFZLGdDQUFZLEVBQUU7WUFDM0Qsc0ZBQXNGO1lBQ3RGLFNBQVMsR0FBRyxJQUFJLDBCQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkM7YUFBTSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUNsQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQjthQUFNLElBQUksa0JBQWtCLENBQUMsR0FBRyxFQUFFLE1BQUksSUFBSSxlQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDOUQsU0FBUyxHQUFHLEdBQUcsQ0FBQztTQUNqQjthQUFNO1lBQ0wsTUFBTSwwQ0FBNEIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQUksSUFBSSxxQ0FBa0MsQ0FBQyxDQUFDO1NBQzNGO1FBRUQsNENBQTRDO1FBQzVDLElBQUksSUFBSSxHQUFvQixJQUFJLENBQUM7UUFDakMseUZBQXlGO1FBQ3pGLElBQUksV0FBVyxHQUFZLElBQUksS0FBSyxpQkFBaUIsQ0FBQztRQUN0RCxJQUFJLHVCQUF1QixHQUFZLDBDQUFtQyxDQUFDO1FBQzNFLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDckIsSUFBTSxXQUFXLEdBQUcsdUJBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDOUMsTUFBTSxJQUFJLGtDQUFvQixDQUMxQix1QkFBUyxDQUFDLHlCQUF5QixFQUFFLFdBQVcsRUFDaEQsTUFBSSxJQUFJLHVDQUFvQyxDQUFDLENBQUM7YUFDbkQ7WUFDRCxJQUFNLE9BQU8sR0FBRyxpQ0FBb0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRCxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3ZCLElBQUksR0FBRyxJQUFJLDBCQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDO2FBQ2xEO1lBRUQsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUM5QixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBRSxDQUFDO2dCQUNwRCxJQUFNLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQzdELElBQUksT0FBTyxnQkFBZ0IsS0FBSyxTQUFTLEVBQUU7b0JBQ3pDLE1BQU0sMENBQTRCLENBQzlCLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFJLElBQUksMkNBQXdDLENBQUMsQ0FBQztpQkFDMUY7Z0JBQ0QsV0FBVyxHQUFHLGdCQUFnQixDQUFDO2FBQ2hDO1lBRUQsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLEVBQUU7Z0JBQzFDLElBQU0sMkJBQTJCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBRSxDQUFDO2dCQUM1RSxJQUFNLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsMkJBQTJCLENBQUMsQ0FBQztnQkFDckYsSUFBSSxPQUFPLDRCQUE0QixLQUFLLFNBQVMsRUFBRTtvQkFDckQsTUFBTSwwQ0FBNEIsQ0FDOUIsMkJBQTJCLEVBQUUsNEJBQTRCLEVBQ3pELE1BQUksSUFBSSx1REFBb0QsQ0FBQyxDQUFDO2lCQUNuRTtnQkFDRCx1QkFBdUIsR0FBRyw0QkFBNEIsQ0FBQzthQUN4RDtZQUVELElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDekIsSUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBRSxDQUFDLENBQUM7Z0JBQy9ELElBQUksT0FBTyxXQUFXLEtBQUssU0FBUyxFQUFFO29CQUNwQyxNQUFNLDBDQUE0QixDQUM5QixJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQUksSUFBSSxzQ0FBbUMsQ0FBQyxDQUFDO2lCQUNyRTtnQkFDRCxRQUFRLEdBQUcsV0FBVyxDQUFDO2FBQ3hCO1NBRUY7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLHNCQUFzQjtZQUN0QixNQUFNLElBQUksa0NBQW9CLENBQzFCLHVCQUFTLENBQUMscUJBQXFCLEVBQUUsSUFBSSxFQUFFLE1BQUksSUFBSSw0QkFBeUIsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsT0FBTztZQUNMLFlBQVksY0FBQTtZQUNaLFNBQVMsV0FBQTtZQUNULEtBQUssT0FBQTtZQUNMLFdBQVcsYUFBQTtZQUNYLElBQUksTUFBQTtZQUNKLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLHVCQUF1Qix5QkFBQTtTQUN4QixDQUFDO0lBQ0osQ0FBQztJQXpGRCxvREF5RkM7SUFFRCxTQUFnQiwyQkFBMkIsQ0FDdkMsU0FBd0IsRUFBRSxTQUF5QixFQUFFLFNBQTJCLEVBQ2hGLE1BQWU7UUFJakIsSUFBTSxPQUFPLEdBQXNCLEVBQUUsRUFBRSxJQUFJLEdBQXNCLEVBQUUsQ0FBQztRQUNwRSxJQUFJLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzVDLE1BQU0sSUFBSSxrQ0FBb0IsQ0FDMUIsdUJBQVMsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLEVBQ3pDLHNEQUFzRCxDQUFDLENBQUM7U0FDN0Q7UUFDRCxpQ0FBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFTLEVBQUUsWUFBWTtZQUM5RCxTQUFTLEdBQUcsdUJBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ2xDLE1BQU0sSUFBSSxrQ0FBb0IsQ0FDMUIsdUJBQVMsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLEVBQ3pDLDhEQUE4RCxDQUFDLENBQUM7YUFDckU7WUFDRCxJQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsMEJBQTBCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25FLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNCLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDekIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQy9CLE1BQU0sSUFBSSxrQ0FBb0IsQ0FDMUIsdUJBQVMsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLEVBQ3pDLDhEQUE4RCxDQUFDLENBQUM7YUFDckU7WUFDRCxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEQsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxlQUFlLENBQUM7Z0JBQzNELENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQy9CLE1BQU0sSUFBSSxrQ0FBb0IsQ0FDMUIsdUJBQVMsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLEVBQ3pDLDhEQUE4RCxDQUFDLENBQUM7YUFDckU7WUFFRCxJQUFNLEtBQUssR0FBRyxvQkFBb0IsQ0FDOUIsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLFNBQVMsSUFBSSxFQUFFLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN6RixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3JCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbEI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sRUFBQyxPQUFPLFNBQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDO0lBQ3pCLENBQUM7SUE1Q0Qsa0VBNENDO0lBRUQsU0FBUyxrQkFBa0IsQ0FBQyxLQUFVLEVBQUUsSUFBWSxFQUFFLElBQW1CO1FBQ3ZFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDaEMsTUFBTSwwQ0FBNEIsQ0FDOUIsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSx1QkFBcUIsSUFBSSxxQkFBZ0IsQ0FBQyxpQkFBYyxDQUFDLENBQUM7YUFDL0U7U0FDRjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFNBQWdCLG9CQUFvQixDQUNoQyxTQUFxQyxFQUFFLEtBQWEsRUFBRSxTQUEyQjtRQUVuRixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsMkVBQTJFO1FBQzNFLElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFFLENBQUM7UUFDekMsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRTtZQUNqRCxNQUFNLDBDQUE0QixDQUM5QixVQUFVLEVBQUUsS0FBSyxFQUFFLGtDQUFnQyxLQUFLLHVCQUFvQixDQUFDLENBQUM7U0FDbkY7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFoQkQsb0RBZ0JDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUywyQkFBMkIsQ0FDaEMsU0FBcUMsRUFBRSxLQUFhLEVBQ3BELFNBQTJCO1FBQzdCLElBQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE9BQU8sWUFBWSxDQUFDO1NBQ3JCO1FBRUQsT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUs7WUFDdEMsdUZBQXVGO1lBQ3ZGLHVGQUF1RjtZQUNqRixJQUFBLEtBQUEsZUFBb0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFWLENBQVUsQ0FBQyxJQUFBLEVBQTdELEtBQUssUUFBQSxFQUFFLFFBQVEsUUFBOEMsQ0FBQztZQUNyRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQztZQUNuQyxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDLEVBQUUsRUFBK0IsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLG9CQUFvQixDQUN6QixNQUF3RCxFQUFFLFNBQTJCLEVBQ3JGLGdCQUM2QjtRQUMvQixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSztZQUNsQyxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNwQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFNBQVM7Z0JBQ2hDLHNGQUFzRjtnQkFDdEYsMkRBQTJEO2dCQUMzRCxJQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtvQkFDekQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztpQkFDaEM7cUJBQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0JBQ3RDLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTt3QkFDaEMsTUFBTSwwQ0FBNEIsQ0FDOUIsc0JBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUMzQyxNQUFJLFNBQVMsQ0FBQyxJQUFJLGlEQUE4QyxDQUFDLENBQUM7cUJBQ3ZFO29CQUNELE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQzVEO3FCQUFNO29CQUNMLHNCQUFzQjtvQkFDdEIsTUFBTSxJQUFJLGtDQUFvQixDQUMxQix1QkFBUyxDQUFDLHFCQUFxQixFQUFFLHNCQUFTLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUNsRSxNQUFJLFNBQVMsQ0FBQyxJQUFJLDRDQUNkLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxpQkFBYyxDQUFDLENBQUM7aUJBQzlDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDLEVBQUUsRUFBa0QsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxTQUFTLFlBQVksQ0FBQyxVQUFrQixFQUFFLFlBQW9CO1FBQzVELE9BQU8sQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELFNBQVMsYUFBYSxDQUFDLFVBQWtCLEVBQUUsWUFBb0I7UUFDN0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELFNBQWdCLGlCQUFpQixDQUM3QixNQUF3RCxFQUFFLFNBQXlCLEVBQ25GLFNBQTJCO1FBQzdCLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQW9CO2dCQUFuQixNQUFNLFlBQUEsRUFBRSxVQUFVLGdCQUFBO1lBQ3BDLElBQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxJQUFJLHNCQUFTLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTlELDJGQUEyRjtZQUMzRixJQUFJLE1BQU0sQ0FBQyxVQUFXLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQWxCLENBQWtCLENBQUMsRUFBRTtnQkFDcEQsTUFBTSxJQUFJLGtDQUFvQixDQUMxQix1QkFBUyxDQUFDLG1CQUFtQixFQUFFLElBQUksRUFDbkMsd0RBQXdELENBQUMsQ0FBQzthQUMvRDtZQUNELElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzNCLE1BQU0sSUFBSSxrQ0FBb0IsQ0FDMUIsdUJBQVMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLEVBQ25DLGdFQUFnRSxDQUFDLENBQUM7YUFDdkU7aUJBQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN4QyxNQUFNLElBQUksa0NBQW9CLENBQzFCLHVCQUFTLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxFQUNwQyxtREFBbUQsQ0FBQyxDQUFDO2FBQzFEO1lBQ0QsT0FBTyxvQkFBb0IsQ0FDdkIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDckYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBekJELDhDQXlCQztJQUVELFNBQVMsb0JBQW9CLENBQUMsTUFBbUI7UUFDL0MsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLDRCQUFlLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssNEJBQWUsQ0FBQyxNQUFNO1lBQ25GLE1BQU0sQ0FBQyxJQUFJLEtBQUssNEJBQWUsQ0FBQyxRQUFRLENBQUM7SUFDL0MsQ0FBQztJQU1ELFNBQVMsOEJBQThCLENBQ25DLFFBQXVCLEVBQUUsU0FBMkI7UUFDdEQsSUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsQ0FBQyxXQUFXLFlBQVksR0FBRyxDQUFDLEVBQUU7WUFDakMsTUFBTSwwQ0FBNEIsQ0FDOUIsUUFBUSxFQUFFLFdBQVcsRUFBRSwyQ0FBMkMsQ0FBQyxDQUFDO1NBQ3pFO1FBQ0QsSUFBTSxZQUFZLEdBQWlDLEVBQUUsQ0FBQztRQUN0RCxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLEdBQUc7WUFDN0IsbURBQW1EO1lBQ25ELElBQUksS0FBSyxZQUFZLDZCQUFTLEVBQUU7Z0JBQzlCLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO2FBQ3hCO1lBRUQsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7Z0JBQzNCLE1BQU0sMENBQTRCLENBQzlCLFFBQVEsRUFBRSxHQUFHLEVBQ2Isc0ZBQXNGLENBQUMsQ0FBQzthQUM3RjtZQUVELElBQUksT0FBTyxLQUFLLElBQUksUUFBUSxFQUFFO2dCQUM1QixZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2FBQzNCO2lCQUFNLElBQUksS0FBSyxZQUFZLGdDQUFZLEVBQUU7Z0JBQ3hDLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLDBCQUFlLENBQUMsS0FBSyxDQUFDLElBQXFCLENBQUMsQ0FBQzthQUN0RTtpQkFBTTtnQkFDTCxNQUFNLDBDQUE0QixDQUM5QixRQUFRLEVBQUUsS0FBSyxFQUNmLHdGQUF3RixDQUFDLENBQUM7YUFDL0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQU0sUUFBUSxHQUFHLDRCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWpELElBQU0sTUFBTSxHQUFHLDZCQUFrQixDQUFDLFFBQVEsRUFBRSx1QkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckIsTUFBTSxJQUFJLGtDQUFvQjtZQUMxQixrRkFBa0Y7WUFDbEYsdURBQXVEO1lBQ3ZELHVCQUFTLENBQUMsd0JBQXdCLEVBQUUsUUFBUSxFQUM1QyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBaUIsSUFBSyxPQUFBLEtBQUssQ0FBQyxHQUFHLEVBQVQsQ0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDOUQ7UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRUQsU0FBZ0IsbUJBQW1CLENBQy9CLE9BQXNCLEVBQUUsU0FBMkIsRUFBRSxVQUE0QixFQUNqRixRQUFxQztRQUN2QyxJQUFJLFFBQTRCLENBQUM7UUFDakMsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNwQyxRQUFRLEdBQUcsOEJBQThCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUM3RTthQUFNO1lBQ0wsUUFBUSxHQUFHLDRCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQseUNBQTRCLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUM7YUFDM0QsT0FBTyxDQUFDLFVBQUMsRUFBb0I7Z0JBQW5CLE1BQU0sWUFBQSxFQUFFLFVBQVUsZ0JBQUE7WUFDM0IsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFNBQVM7Z0JBQzFCLElBQUksZ0JBQWdCLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDM0MsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3hELElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixNQUFNLElBQUksa0NBQW9CLENBQzFCLHVCQUFTLENBQUMscUJBQXFCLEVBQUUsc0JBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQ2xFLHFEQUNJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxpQkFBYyxDQUFDLENBQUM7cUJBQzlDO29CQUVELElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTt3QkFDaEMsTUFBTSwwQ0FBNEIsQ0FDOUIsc0JBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUMzQywwQ0FBMEMsQ0FBQyxDQUFDO3FCQUNqRDtvQkFFRCxnQkFBZ0IsR0FBRyxRQUFRLENBQUM7aUJBQzdCO2dCQUVELHdGQUF3RjtnQkFDeEYsd0ZBQXdGO2dCQUN4RixvRkFBb0Y7Z0JBQ3BGLHVFQUF1RTtnQkFDdkUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLHNDQUEyQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0YsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVQLHlDQUE0QixDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsVUFBVSxDQUFDO2FBQzVELE9BQU8sQ0FBQyxVQUFDLEVBQW9CO2dCQUFuQixNQUFNLFlBQUEsRUFBRSxVQUFVLGdCQUFBO1lBQzNCLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxTQUFTO2dCQUMxQixJQUFJLFNBQVMsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNwQyxJQUFJLElBQUksR0FBYSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUN4RCxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDN0IsTUFBTSxJQUFJLGtDQUFvQixDQUMxQix1QkFBUyxDQUFDLHFCQUFxQixFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ2xELDhDQUE4QyxDQUFDLENBQUM7cUJBQ3JEO29CQUVELElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTt3QkFDaEMsTUFBTSwwQ0FBNEIsQ0FDOUIsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQzNCLHNEQUFzRCxDQUFDLENBQUM7cUJBQzdEO29CQUVELFNBQVMsR0FBRyxRQUFRLENBQUM7b0JBRXJCLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUMvQixJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNyQyxJQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDM0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxVQUFVLENBQUMsRUFBRTs0QkFDdkUsTUFBTSwwQ0FBNEIsQ0FDOUIsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLEVBQy9CLHdEQUF3RCxDQUFDLENBQUM7eUJBQy9EO3dCQUNELElBQUksR0FBRyxZQUFZLENBQUM7cUJBQ3JCO2lCQUNGO2dCQUVELFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQU0sTUFBTSxDQUFDLElBQUksU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFHLENBQUM7WUFDdEUsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUE3RUQsa0RBNkVDO0lBRUQsSUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUM7UUFDMUIsY0FBYztRQUNkLGlCQUFpQjtRQUNqQixXQUFXO1FBQ1gsY0FBYztLQUNmLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvbXBpbGVDbGFzc01ldGFkYXRhLCBjb21waWxlRGVjbGFyZUNsYXNzTWV0YWRhdGEsIGNvbXBpbGVEZWNsYXJlRGlyZWN0aXZlRnJvbU1ldGFkYXRhLCBjb21waWxlRGlyZWN0aXZlRnJvbU1ldGFkYXRhLCBDb25zdGFudFBvb2wsIEV4cHJlc3Npb24sIEV4dGVybmFsRXhwciwgRmFjdG9yeVRhcmdldCwgZ2V0U2FmZVByb3BlcnR5QWNjZXNzU3RyaW5nLCBtYWtlQmluZGluZ1BhcnNlciwgUGFyc2VkSG9zdEJpbmRpbmdzLCBQYXJzZUVycm9yLCBwYXJzZUhvc3RCaW5kaW5ncywgUjNDbGFzc01ldGFkYXRhLCBSM0RpcmVjdGl2ZU1ldGFkYXRhLCBSM0ZhY3RvcnlNZXRhZGF0YSwgUjNRdWVyeU1ldGFkYXRhLCBTdGF0ZW1lbnQsIHZlcmlmeUhvc3RCaW5kaW5ncywgV3JhcHBlZE5vZGVFeHByfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge2VtaXREaXN0aW5jdENoYW5nZXNPbmx5RGVmYXVsdFZhbHVlfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvY29yZSc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtFcnJvckNvZGUsIEZhdGFsRGlhZ25vc3RpY0Vycm9yfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge2FyZVR5cGVQYXJhbWV0ZXJzRXF1YWwsIGV4dHJhY3RTZW1hbnRpY1R5cGVQYXJhbWV0ZXJzLCBpc0FycmF5RXF1YWwsIGlzU2V0RXF1YWwsIGlzU3ltYm9sRXF1YWwsIFNlbWFudGljRGVwR3JhcGhVcGRhdGVyLCBTZW1hbnRpY1N5bWJvbCwgU2VtYW50aWNUeXBlUGFyYW1ldGVyfSBmcm9tICcuLi8uLi9pbmNyZW1lbnRhbC9zZW1hbnRpY19ncmFwaCc7XG5pbXBvcnQge0JpbmRpbmdQcm9wZXJ0eU5hbWUsIENsYXNzUHJvcGVydHlNYXBwaW5nLCBDbGFzc1Byb3BlcnR5TmFtZSwgRGlyZWN0aXZlVHlwZUNoZWNrTWV0YSwgSW5qZWN0YWJsZUNsYXNzUmVnaXN0cnksIE1ldGFkYXRhUmVhZGVyLCBNZXRhZGF0YVJlZ2lzdHJ5LCBNZXRhVHlwZSwgVGVtcGxhdGVHdWFyZE1ldGF9IGZyb20gJy4uLy4uL21ldGFkYXRhJztcbmltcG9ydCB7ZXh0cmFjdERpcmVjdGl2ZVR5cGVDaGVja01ldGF9IGZyb20gJy4uLy4uL21ldGFkYXRhL3NyYy91dGlsJztcbmltcG9ydCB7RHluYW1pY1ZhbHVlLCBFbnVtVmFsdWUsIFBhcnRpYWxFdmFsdWF0b3J9IGZyb20gJy4uLy4uL3BhcnRpYWxfZXZhbHVhdG9yJztcbmltcG9ydCB7UGVyZkV2ZW50LCBQZXJmUmVjb3JkZXJ9IGZyb20gJy4uLy4uL3BlcmYnO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9uLCBDbGFzc01lbWJlciwgQ2xhc3NNZW1iZXJLaW5kLCBEZWNvcmF0b3IsIGZpbHRlclRvTWVtYmVyc1dpdGhEZWNvcmF0b3IsIFJlZmxlY3Rpb25Ib3N0LCByZWZsZWN0T2JqZWN0TGl0ZXJhbH0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge0xvY2FsTW9kdWxlU2NvcGVSZWdpc3RyeX0gZnJvbSAnLi4vLi4vc2NvcGUnO1xuaW1wb3J0IHtBbmFseXNpc091dHB1dCwgQ29tcGlsZVJlc3VsdCwgRGVjb3JhdG9ySGFuZGxlciwgRGV0ZWN0UmVzdWx0LCBIYW5kbGVyRmxhZ3MsIEhhbmRsZXJQcmVjZWRlbmNlLCBSZXNvbHZlUmVzdWx0fSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuXG5pbXBvcnQge2NyZWF0ZVZhbHVlSGFzV3JvbmdUeXBlRXJyb3IsIGdldERpcmVjdGl2ZURpYWdub3N0aWNzLCBnZXRQcm92aWRlckRpYWdub3N0aWNzLCBnZXRVbmRlY29yYXRlZENsYXNzV2l0aEFuZ3VsYXJGZWF0dXJlc0RpYWdub3N0aWN9IGZyb20gJy4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtjb21waWxlRGVjbGFyZUZhY3RvcnksIGNvbXBpbGVOZ0ZhY3RvcnlEZWZGaWVsZH0gZnJvbSAnLi9mYWN0b3J5JztcbmltcG9ydCB7ZXh0cmFjdENsYXNzTWV0YWRhdGF9IGZyb20gJy4vbWV0YWRhdGEnO1xuaW1wb3J0IHtjb21waWxlUmVzdWx0cywgY3JlYXRlU291cmNlU3BhbiwgZmluZEFuZ3VsYXJEZWNvcmF0b3IsIGdldENvbnN0cnVjdG9yRGVwZW5kZW5jaWVzLCBpc0FuZ3VsYXJEZWNvcmF0b3IsIHJlYWRCYXNlQ2xhc3MsIHJlc29sdmVQcm92aWRlcnNSZXF1aXJpbmdGYWN0b3J5LCB0b0ZhY3RvcnlNZXRhZGF0YSwgdHJ5VW53cmFwRm9yd2FyZFJlZiwgdW53cmFwQ29uc3RydWN0b3JEZXBlbmRlbmNpZXMsIHVud3JhcEV4cHJlc3Npb24sIHZhbGlkYXRlQ29uc3RydWN0b3JEZXBlbmRlbmNpZXMsIHdyYXBGdW5jdGlvbkV4cHJlc3Npb25zSW5QYXJlbnMsIHdyYXBUeXBlUmVmZXJlbmNlfSBmcm9tICcuL3V0aWwnO1xuXG5jb25zdCBFTVBUWV9PQkpFQ1Q6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5jb25zdCBGSUVMRF9ERUNPUkFUT1JTID0gW1xuICAnSW5wdXQnLCAnT3V0cHV0JywgJ1ZpZXdDaGlsZCcsICdWaWV3Q2hpbGRyZW4nLCAnQ29udGVudENoaWxkJywgJ0NvbnRlbnRDaGlsZHJlbicsICdIb3N0QmluZGluZycsXG4gICdIb3N0TGlzdGVuZXInXG5dO1xuY29uc3QgTElGRUNZQ0xFX0hPT0tTID0gbmV3IFNldChbXG4gICduZ09uQ2hhbmdlcycsICduZ09uSW5pdCcsICduZ09uRGVzdHJveScsICduZ0RvQ2hlY2snLCAnbmdBZnRlclZpZXdJbml0JywgJ25nQWZ0ZXJWaWV3Q2hlY2tlZCcsXG4gICduZ0FmdGVyQ29udGVudEluaXQnLCAnbmdBZnRlckNvbnRlbnRDaGVja2VkJ1xuXSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGlyZWN0aXZlSGFuZGxlckRhdGEge1xuICBiYXNlQ2xhc3M6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPnwnZHluYW1pYyd8bnVsbDtcbiAgdHlwZUNoZWNrTWV0YTogRGlyZWN0aXZlVHlwZUNoZWNrTWV0YTtcbiAgbWV0YTogUjNEaXJlY3RpdmVNZXRhZGF0YTtcbiAgY2xhc3NNZXRhZGF0YTogUjNDbGFzc01ldGFkYXRhfG51bGw7XG4gIHByb3ZpZGVyc1JlcXVpcmluZ0ZhY3Rvcnk6IFNldDxSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj4+fG51bGw7XG4gIGlucHV0czogQ2xhc3NQcm9wZXJ0eU1hcHBpbmc7XG4gIG91dHB1dHM6IENsYXNzUHJvcGVydHlNYXBwaW5nO1xuICBpc1BvaXNvbmVkOiBib29sZWFuO1xuICBpc1N0cnVjdHVyYWw6IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBBbmd1bGFyIGRpcmVjdGl2ZS4gQ29tcG9uZW50cyBhcmUgcmVwcmVzZW50ZWQgYnkgYENvbXBvbmVudFN5bWJvbGAsIHdoaWNoIGluaGVyaXRzXG4gKiBmcm9tIHRoaXMgc3ltYm9sLlxuICovXG5leHBvcnQgY2xhc3MgRGlyZWN0aXZlU3ltYm9sIGV4dGVuZHMgU2VtYW50aWNTeW1ib2wge1xuICBiYXNlQ2xhc3M6IFNlbWFudGljU3ltYm9sfG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZGVjbDogQ2xhc3NEZWNsYXJhdGlvbiwgcHVibGljIHJlYWRvbmx5IHNlbGVjdG9yOiBzdHJpbmd8bnVsbCxcbiAgICAgIHB1YmxpYyByZWFkb25seSBpbnB1dHM6IENsYXNzUHJvcGVydHlNYXBwaW5nLCBwdWJsaWMgcmVhZG9ubHkgb3V0cHV0czogQ2xhc3NQcm9wZXJ0eU1hcHBpbmcsXG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZXhwb3J0QXM6IHN0cmluZ1tdfG51bGwsXG4gICAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZUNoZWNrTWV0YTogRGlyZWN0aXZlVHlwZUNoZWNrTWV0YSxcbiAgICAgIHB1YmxpYyByZWFkb25seSB0eXBlUGFyYW1ldGVyczogU2VtYW50aWNUeXBlUGFyYW1ldGVyW118bnVsbCkge1xuICAgIHN1cGVyKGRlY2wpO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNQdWJsaWNBcGlBZmZlY3RlZChwcmV2aW91c1N5bWJvbDogU2VtYW50aWNTeW1ib2wpOiBib29sZWFuIHtcbiAgICAvLyBOb3RlOiBzaW5jZSBjb21wb25lbnRzIGFuZCBkaXJlY3RpdmVzIGhhdmUgZXhhY3RseSB0aGUgc2FtZSBpdGVtcyBjb250cmlidXRpbmcgdG8gdGhlaXJcbiAgICAvLyBwdWJsaWMgQVBJLCBpdCBpcyBva2F5IGZvciBhIGRpcmVjdGl2ZSB0byBjaGFuZ2UgaW50byBhIGNvbXBvbmVudCBhbmQgdmljZSB2ZXJzYSB3aXRob3V0XG4gICAgLy8gdGhlIEFQSSBiZWluZyBhZmZlY3RlZC5cbiAgICBpZiAoIShwcmV2aW91c1N5bWJvbCBpbnN0YW5jZW9mIERpcmVjdGl2ZVN5bWJvbCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIERpcmVjdGl2ZXMgYW5kIGNvbXBvbmVudHMgaGF2ZSBhIHB1YmxpYyBBUEkgb2Y6XG4gICAgLy8gIDEuIFRoZWlyIHNlbGVjdG9yLlxuICAgIC8vICAyLiBUaGUgYmluZGluZyBuYW1lcyBvZiB0aGVpciBpbnB1dHMgYW5kIG91dHB1dHM7IGEgY2hhbmdlIGluIG9yZGVyaW5nIGlzIGFsc28gY29uc2lkZXJlZFxuICAgIC8vICAgICB0byBiZSBhIGNoYW5nZSBpbiBwdWJsaWMgQVBJLlxuICAgIC8vICAzLiBUaGUgbGlzdCBvZiBleHBvcnRBcyBuYW1lcyBhbmQgaXRzIG9yZGVyaW5nLlxuICAgIHJldHVybiB0aGlzLnNlbGVjdG9yICE9PSBwcmV2aW91c1N5bWJvbC5zZWxlY3RvciB8fFxuICAgICAgICAhaXNBcnJheUVxdWFsKHRoaXMuaW5wdXRzLnByb3BlcnR5TmFtZXMsIHByZXZpb3VzU3ltYm9sLmlucHV0cy5wcm9wZXJ0eU5hbWVzKSB8fFxuICAgICAgICAhaXNBcnJheUVxdWFsKHRoaXMub3V0cHV0cy5wcm9wZXJ0eU5hbWVzLCBwcmV2aW91c1N5bWJvbC5vdXRwdXRzLnByb3BlcnR5TmFtZXMpIHx8XG4gICAgICAgICFpc0FycmF5RXF1YWwodGhpcy5leHBvcnRBcywgcHJldmlvdXNTeW1ib2wuZXhwb3J0QXMpO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNUeXBlQ2hlY2tBcGlBZmZlY3RlZChwcmV2aW91c1N5bWJvbDogU2VtYW50aWNTeW1ib2wpOiBib29sZWFuIHtcbiAgICAvLyBJZiB0aGUgcHVibGljIEFQSSBvZiB0aGUgZGlyZWN0aXZlIGhhcyBjaGFuZ2VkLCB0aGVuIHNvIGhhcyBpdHMgdHlwZS1jaGVjayBBUEkuXG4gICAgaWYgKHRoaXMuaXNQdWJsaWNBcGlBZmZlY3RlZChwcmV2aW91c1N5bWJvbCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICghKHByZXZpb3VzU3ltYm9sIGluc3RhbmNlb2YgRGlyZWN0aXZlU3ltYm9sKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gVGhlIHR5cGUtY2hlY2sgYmxvY2sgYWxzbyBkZXBlbmRzIG9uIHRoZSBjbGFzcyBwcm9wZXJ0eSBuYW1lcywgYXMgd3JpdGVzIHByb3BlcnR5IGJpbmRpbmdzXG4gICAgLy8gZGlyZWN0bHkgaW50byB0aGUgYmFja2luZyBmaWVsZHMuXG4gICAgaWYgKCFpc0FycmF5RXF1YWwoXG4gICAgICAgICAgICBBcnJheS5mcm9tKHRoaXMuaW5wdXRzKSwgQXJyYXkuZnJvbShwcmV2aW91c1N5bWJvbC5pbnB1dHMpLCBpc0lucHV0TWFwcGluZ0VxdWFsKSB8fFxuICAgICAgICAhaXNBcnJheUVxdWFsKFxuICAgICAgICAgICAgQXJyYXkuZnJvbSh0aGlzLm91dHB1dHMpLCBBcnJheS5mcm9tKHByZXZpb3VzU3ltYm9sLm91dHB1dHMpLCBpc0lucHV0TWFwcGluZ0VxdWFsKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gVGhlIHR5cGUgcGFyYW1ldGVycyBvZiBhIGRpcmVjdGl2ZSBhcmUgZW1pdHRlZCBpbnRvIHRoZSB0eXBlIGNvbnN0cnVjdG9ycyBpbiB0aGUgdHlwZS1jaGVja1xuICAgIC8vIGJsb2NrIG9mIGEgY29tcG9uZW50LCBzbyBpZiB0aGUgdHlwZSBwYXJhbWV0ZXJzIGFyZSBub3QgY29uc2lkZXJlZCBlcXVhbCB0aGVuIGNvbnNpZGVyIHRoZVxuICAgIC8vIHR5cGUtY2hlY2sgQVBJIG9mIHRoaXMgZGlyZWN0aXZlIHRvIGJlIGFmZmVjdGVkLlxuICAgIGlmICghYXJlVHlwZVBhcmFtZXRlcnNFcXVhbCh0aGlzLnR5cGVQYXJhbWV0ZXJzLCBwcmV2aW91c1N5bWJvbC50eXBlUGFyYW1ldGVycykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIFRoZSB0eXBlLWNoZWNrIG1ldGFkYXRhIGlzIHVzZWQgZHVyaW5nIFRDQiBjb2RlIGdlbmVyYXRpb24sIHNvIGFueSBjaGFuZ2VzIHNob3VsZCBpbnZhbGlkYXRlXG4gICAgLy8gcHJpb3IgdHlwZS1jaGVjayBmaWxlcy5cbiAgICBpZiAoIWlzVHlwZUNoZWNrTWV0YUVxdWFsKHRoaXMudHlwZUNoZWNrTWV0YSwgcHJldmlvdXNTeW1ib2wudHlwZUNoZWNrTWV0YSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIENoYW5naW5nIHRoZSBiYXNlIGNsYXNzIG9mIGEgZGlyZWN0aXZlIG1lYW5zIHRoYXQgaXRzIGlucHV0cy9vdXRwdXRzIGV0YyBtYXkgaGF2ZSBjaGFuZ2VkLFxuICAgIC8vIHNvIHRoZSB0eXBlLWNoZWNrIGJsb2NrIG9mIGNvbXBvbmVudHMgdGhhdCB1c2UgdGhpcyBkaXJlY3RpdmUgbmVlZHMgdG8gYmUgcmVnZW5lcmF0ZWQuXG4gICAgaWYgKCFpc0Jhc2VDbGFzc0VxdWFsKHRoaXMuYmFzZUNsYXNzLCBwcmV2aW91c1N5bWJvbC5iYXNlQ2xhc3MpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNJbnB1dE1hcHBpbmdFcXVhbChcbiAgICBjdXJyZW50OiBbQ2xhc3NQcm9wZXJ0eU5hbWUsIEJpbmRpbmdQcm9wZXJ0eU5hbWVdLFxuICAgIHByZXZpb3VzOiBbQ2xhc3NQcm9wZXJ0eU5hbWUsIEJpbmRpbmdQcm9wZXJ0eU5hbWVdKTogYm9vbGVhbiB7XG4gIHJldHVybiBjdXJyZW50WzBdID09PSBwcmV2aW91c1swXSAmJiBjdXJyZW50WzFdID09PSBwcmV2aW91c1sxXTtcbn1cblxuZnVuY3Rpb24gaXNUeXBlQ2hlY2tNZXRhRXF1YWwoXG4gICAgY3VycmVudDogRGlyZWN0aXZlVHlwZUNoZWNrTWV0YSwgcHJldmlvdXM6IERpcmVjdGl2ZVR5cGVDaGVja01ldGEpOiBib29sZWFuIHtcbiAgaWYgKGN1cnJlbnQuaGFzTmdUZW1wbGF0ZUNvbnRleHRHdWFyZCAhPT0gcHJldmlvdXMuaGFzTmdUZW1wbGF0ZUNvbnRleHRHdWFyZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoY3VycmVudC5pc0dlbmVyaWMgIT09IHByZXZpb3VzLmlzR2VuZXJpYykge1xuICAgIC8vIE5vdGU6IGNoYW5nZXMgaW4gdGhlIG51bWJlciBvZiB0eXBlIHBhcmFtZXRlcnMgaXMgYWxzbyBjb25zaWRlcmVkIGluIGBhcmVUeXBlUGFyYW1ldGVyc0VxdWFsYFxuICAgIC8vIHNvIHRoaXMgY2hlY2sgaXMgdGVjaG5pY2FsbHkgbm90IG5lZWRlZDsgaXQgaXMgZG9uZSBhbnl3YXkgZm9yIGNvbXBsZXRlbmVzcyBpbiB0ZXJtcyBvZlxuICAgIC8vIHdoZXRoZXIgdGhlIGBEaXJlY3RpdmVUeXBlQ2hlY2tNZXRhYCBzdHJ1Y3QgaXRzZWxmIGNvbXBhcmVzIGVxdWFsIG9yIG5vdC5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCFpc0FycmF5RXF1YWwoY3VycmVudC5uZ1RlbXBsYXRlR3VhcmRzLCBwcmV2aW91cy5uZ1RlbXBsYXRlR3VhcmRzLCBpc1RlbXBsYXRlR3VhcmRFcXVhbCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCFpc1NldEVxdWFsKGN1cnJlbnQuY29lcmNlZElucHV0RmllbGRzLCBwcmV2aW91cy5jb2VyY2VkSW5wdXRGaWVsZHMpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICghaXNTZXRFcXVhbChjdXJyZW50LnJlc3RyaWN0ZWRJbnB1dEZpZWxkcywgcHJldmlvdXMucmVzdHJpY3RlZElucHV0RmllbGRzKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIWlzU2V0RXF1YWwoY3VycmVudC5zdHJpbmdMaXRlcmFsSW5wdXRGaWVsZHMsIHByZXZpb3VzLnN0cmluZ0xpdGVyYWxJbnB1dEZpZWxkcykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCFpc1NldEVxdWFsKGN1cnJlbnQudW5kZWNsYXJlZElucHV0RmllbGRzLCBwcmV2aW91cy51bmRlY2xhcmVkSW5wdXRGaWVsZHMpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc1RlbXBsYXRlR3VhcmRFcXVhbChjdXJyZW50OiBUZW1wbGF0ZUd1YXJkTWV0YSwgcHJldmlvdXM6IFRlbXBsYXRlR3VhcmRNZXRhKTogYm9vbGVhbiB7XG4gIHJldHVybiBjdXJyZW50LmlucHV0TmFtZSA9PT0gcHJldmlvdXMuaW5wdXROYW1lICYmIGN1cnJlbnQudHlwZSA9PT0gcHJldmlvdXMudHlwZTtcbn1cblxuZnVuY3Rpb24gaXNCYXNlQ2xhc3NFcXVhbChjdXJyZW50OiBTZW1hbnRpY1N5bWJvbHxudWxsLCBwcmV2aW91czogU2VtYW50aWNTeW1ib2x8bnVsbCk6IGJvb2xlYW4ge1xuICBpZiAoY3VycmVudCA9PT0gbnVsbCB8fCBwcmV2aW91cyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBjdXJyZW50ID09PSBwcmV2aW91cztcbiAgfVxuXG4gIHJldHVybiBpc1N5bWJvbEVxdWFsKGN1cnJlbnQsIHByZXZpb3VzKTtcbn1cblxuZXhwb3J0IGNsYXNzIERpcmVjdGl2ZURlY29yYXRvckhhbmRsZXIgaW1wbGVtZW50c1xuICAgIERlY29yYXRvckhhbmRsZXI8RGVjb3JhdG9yfG51bGwsIERpcmVjdGl2ZUhhbmRsZXJEYXRhLCBEaXJlY3RpdmVTeW1ib2wsIHVua25vd24+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJlZmxlY3RvcjogUmVmbGVjdGlvbkhvc3QsIHByaXZhdGUgZXZhbHVhdG9yOiBQYXJ0aWFsRXZhbHVhdG9yLFxuICAgICAgcHJpdmF0ZSBtZXRhUmVnaXN0cnk6IE1ldGFkYXRhUmVnaXN0cnksIHByaXZhdGUgc2NvcGVSZWdpc3RyeTogTG9jYWxNb2R1bGVTY29wZVJlZ2lzdHJ5LFxuICAgICAgcHJpdmF0ZSBtZXRhUmVhZGVyOiBNZXRhZGF0YVJlYWRlciwgcHJpdmF0ZSBpbmplY3RhYmxlUmVnaXN0cnk6IEluamVjdGFibGVDbGFzc1JlZ2lzdHJ5LFxuICAgICAgcHJpdmF0ZSBpc0NvcmU6IGJvb2xlYW4sIHByaXZhdGUgc2VtYW50aWNEZXBHcmFwaFVwZGF0ZXI6IFNlbWFudGljRGVwR3JhcGhVcGRhdGVyfG51bGwsXG4gICAgICBwcml2YXRlIGFubm90YXRlRm9yQ2xvc3VyZUNvbXBpbGVyOiBib29sZWFuLFxuICAgICAgcHJpdmF0ZSBjb21waWxlVW5kZWNvcmF0ZWRDbGFzc2VzV2l0aEFuZ3VsYXJGZWF0dXJlczogYm9vbGVhbiwgcHJpdmF0ZSBwZXJmOiBQZXJmUmVjb3JkZXIpIHt9XG5cbiAgcmVhZG9ubHkgcHJlY2VkZW5jZSA9IEhhbmRsZXJQcmVjZWRlbmNlLlBSSU1BUlk7XG4gIHJlYWRvbmx5IG5hbWUgPSBEaXJlY3RpdmVEZWNvcmF0b3JIYW5kbGVyLm5hbWU7XG5cbiAgZGV0ZWN0KG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGRlY29yYXRvcnM6IERlY29yYXRvcltdfG51bGwpOlxuICAgICAgRGV0ZWN0UmVzdWx0PERlY29yYXRvcnxudWxsPnx1bmRlZmluZWQge1xuICAgIC8vIElmIGEgY2xhc3MgaXMgdW5kZWNvcmF0ZWQgYnV0IHVzZXMgQW5ndWxhciBmZWF0dXJlcywgd2UgZGV0ZWN0IGl0IGFzIGFuXG4gICAgLy8gYWJzdHJhY3QgZGlyZWN0aXZlLiBUaGlzIGlzIGFuIHVuc3VwcG9ydGVkIHBhdHRlcm4gYXMgb2YgdjEwLCBidXQgd2Ugd2FudFxuICAgIC8vIHRvIHN0aWxsIGRldGVjdCB0aGVzZSBwYXR0ZXJucyBzbyB0aGF0IHdlIGNhbiByZXBvcnQgZGlhZ25vc3RpY3MsIG9yIGNvbXBpbGVcbiAgICAvLyB0aGVtIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBpbiBuZ2NjLlxuICAgIGlmICghZGVjb3JhdG9ycykge1xuICAgICAgY29uc3QgYW5ndWxhckZpZWxkID0gdGhpcy5maW5kQ2xhc3NGaWVsZFdpdGhBbmd1bGFyRmVhdHVyZXMobm9kZSk7XG4gICAgICByZXR1cm4gYW5ndWxhckZpZWxkID8ge3RyaWdnZXI6IGFuZ3VsYXJGaWVsZC5ub2RlLCBkZWNvcmF0b3I6IG51bGwsIG1ldGFkYXRhOiBudWxsfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkZWNvcmF0b3IgPSBmaW5kQW5ndWxhckRlY29yYXRvcihkZWNvcmF0b3JzLCAnRGlyZWN0aXZlJywgdGhpcy5pc0NvcmUpO1xuICAgICAgcmV0dXJuIGRlY29yYXRvciA/IHt0cmlnZ2VyOiBkZWNvcmF0b3Iubm9kZSwgZGVjb3JhdG9yLCBtZXRhZGF0YTogZGVjb3JhdG9yfSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBhbmFseXplKG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGRlY29yYXRvcjogUmVhZG9ubHk8RGVjb3JhdG9yfG51bGw+LCBmbGFncyA9IEhhbmRsZXJGbGFncy5OT05FKTpcbiAgICAgIEFuYWx5c2lzT3V0cHV0PERpcmVjdGl2ZUhhbmRsZXJEYXRhPiB7XG4gICAgLy8gU2tpcCBwcm9jZXNzaW5nIG9mIHRoZSBjbGFzcyBkZWNsYXJhdGlvbiBpZiBjb21waWxhdGlvbiBvZiB1bmRlY29yYXRlZCBjbGFzc2VzXG4gICAgLy8gd2l0aCBBbmd1bGFyIGZlYXR1cmVzIGlzIGRpc2FibGVkLiBQcmV2aW91c2x5IGluIG5ndHNjLCBzdWNoIGNsYXNzZXMgaGF2ZSBhbHdheXNcbiAgICAvLyBiZWVuIHByb2Nlc3NlZCwgYnV0IHdlIHdhbnQgdG8gZW5mb3JjZSBhIGNvbnNpc3RlbnQgZGVjb3JhdG9yIG1lbnRhbCBtb2RlbC5cbiAgICAvLyBTZWU6IGh0dHBzOi8vdjkuYW5ndWxhci5pby9ndWlkZS9taWdyYXRpb24tdW5kZWNvcmF0ZWQtY2xhc3Nlcy5cbiAgICBpZiAodGhpcy5jb21waWxlVW5kZWNvcmF0ZWRDbGFzc2VzV2l0aEFuZ3VsYXJGZWF0dXJlcyA9PT0gZmFsc2UgJiYgZGVjb3JhdG9yID09PSBudWxsKSB7XG4gICAgICByZXR1cm4ge2RpYWdub3N0aWNzOiBbZ2V0VW5kZWNvcmF0ZWRDbGFzc1dpdGhBbmd1bGFyRmVhdHVyZXNEaWFnbm9zdGljKG5vZGUpXX07XG4gICAgfVxuXG4gICAgdGhpcy5wZXJmLmV2ZW50Q291bnQoUGVyZkV2ZW50LkFuYWx5emVEaXJlY3RpdmUpO1xuXG4gICAgY29uc3QgZGlyZWN0aXZlUmVzdWx0ID0gZXh0cmFjdERpcmVjdGl2ZU1ldGFkYXRhKFxuICAgICAgICBub2RlLCBkZWNvcmF0b3IsIHRoaXMucmVmbGVjdG9yLCB0aGlzLmV2YWx1YXRvciwgdGhpcy5pc0NvcmUsIGZsYWdzLFxuICAgICAgICB0aGlzLmFubm90YXRlRm9yQ2xvc3VyZUNvbXBpbGVyKTtcbiAgICBpZiAoZGlyZWN0aXZlUmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3QgYW5hbHlzaXMgPSBkaXJlY3RpdmVSZXN1bHQubWV0YWRhdGE7XG5cbiAgICBsZXQgcHJvdmlkZXJzUmVxdWlyaW5nRmFjdG9yeTogU2V0PFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPj58bnVsbCA9IG51bGw7XG4gICAgaWYgKGRpcmVjdGl2ZVJlc3VsdCAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdGl2ZVJlc3VsdC5kZWNvcmF0b3IuaGFzKCdwcm92aWRlcnMnKSkge1xuICAgICAgcHJvdmlkZXJzUmVxdWlyaW5nRmFjdG9yeSA9IHJlc29sdmVQcm92aWRlcnNSZXF1aXJpbmdGYWN0b3J5KFxuICAgICAgICAgIGRpcmVjdGl2ZVJlc3VsdC5kZWNvcmF0b3IuZ2V0KCdwcm92aWRlcnMnKSEsIHRoaXMucmVmbGVjdG9yLCB0aGlzLmV2YWx1YXRvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFuYWx5c2lzOiB7XG4gICAgICAgIGlucHV0czogZGlyZWN0aXZlUmVzdWx0LmlucHV0cyxcbiAgICAgICAgb3V0cHV0czogZGlyZWN0aXZlUmVzdWx0Lm91dHB1dHMsXG4gICAgICAgIG1ldGE6IGFuYWx5c2lzLFxuICAgICAgICBjbGFzc01ldGFkYXRhOiBleHRyYWN0Q2xhc3NNZXRhZGF0YShcbiAgICAgICAgICAgIG5vZGUsIHRoaXMucmVmbGVjdG9yLCB0aGlzLmlzQ29yZSwgdGhpcy5hbm5vdGF0ZUZvckNsb3N1cmVDb21waWxlciksXG4gICAgICAgIGJhc2VDbGFzczogcmVhZEJhc2VDbGFzcyhub2RlLCB0aGlzLnJlZmxlY3RvciwgdGhpcy5ldmFsdWF0b3IpLFxuICAgICAgICB0eXBlQ2hlY2tNZXRhOiBleHRyYWN0RGlyZWN0aXZlVHlwZUNoZWNrTWV0YShub2RlLCBkaXJlY3RpdmVSZXN1bHQuaW5wdXRzLCB0aGlzLnJlZmxlY3RvciksXG4gICAgICAgIHByb3ZpZGVyc1JlcXVpcmluZ0ZhY3RvcnksXG4gICAgICAgIGlzUG9pc29uZWQ6IGZhbHNlLFxuICAgICAgICBpc1N0cnVjdHVyYWw6IGRpcmVjdGl2ZVJlc3VsdC5pc1N0cnVjdHVyYWwsXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHN5bWJvbChub2RlOiBDbGFzc0RlY2xhcmF0aW9uLCBhbmFseXNpczogUmVhZG9ubHk8RGlyZWN0aXZlSGFuZGxlckRhdGE+KTogRGlyZWN0aXZlU3ltYm9sIHtcbiAgICBjb25zdCB0eXBlUGFyYW1ldGVycyA9IGV4dHJhY3RTZW1hbnRpY1R5cGVQYXJhbWV0ZXJzKG5vZGUpO1xuXG4gICAgcmV0dXJuIG5ldyBEaXJlY3RpdmVTeW1ib2woXG4gICAgICAgIG5vZGUsIGFuYWx5c2lzLm1ldGEuc2VsZWN0b3IsIGFuYWx5c2lzLmlucHV0cywgYW5hbHlzaXMub3V0cHV0cywgYW5hbHlzaXMubWV0YS5leHBvcnRBcyxcbiAgICAgICAgYW5hbHlzaXMudHlwZUNoZWNrTWV0YSwgdHlwZVBhcmFtZXRlcnMpO1xuICB9XG5cbiAgcmVnaXN0ZXIobm9kZTogQ2xhc3NEZWNsYXJhdGlvbiwgYW5hbHlzaXM6IFJlYWRvbmx5PERpcmVjdGl2ZUhhbmRsZXJEYXRhPik6IHZvaWQge1xuICAgIC8vIFJlZ2lzdGVyIHRoaXMgZGlyZWN0aXZlJ3MgaW5mb3JtYXRpb24gd2l0aCB0aGUgYE1ldGFkYXRhUmVnaXN0cnlgLiBUaGlzIGVuc3VyZXMgdGhhdFxuICAgIC8vIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZGlyZWN0aXZlIGlzIGF2YWlsYWJsZSBkdXJpbmcgdGhlIGNvbXBpbGUoKSBwaGFzZS5cbiAgICBjb25zdCByZWYgPSBuZXcgUmVmZXJlbmNlKG5vZGUpO1xuICAgIHRoaXMubWV0YVJlZ2lzdHJ5LnJlZ2lzdGVyRGlyZWN0aXZlTWV0YWRhdGEoe1xuICAgICAgdHlwZTogTWV0YVR5cGUuRGlyZWN0aXZlLFxuICAgICAgcmVmLFxuICAgICAgbmFtZTogbm9kZS5uYW1lLnRleHQsXG4gICAgICBzZWxlY3RvcjogYW5hbHlzaXMubWV0YS5zZWxlY3RvcixcbiAgICAgIGV4cG9ydEFzOiBhbmFseXNpcy5tZXRhLmV4cG9ydEFzLFxuICAgICAgaW5wdXRzOiBhbmFseXNpcy5pbnB1dHMsXG4gICAgICBvdXRwdXRzOiBhbmFseXNpcy5vdXRwdXRzLFxuICAgICAgcXVlcmllczogYW5hbHlzaXMubWV0YS5xdWVyaWVzLm1hcChxdWVyeSA9PiBxdWVyeS5wcm9wZXJ0eU5hbWUpLFxuICAgICAgaXNDb21wb25lbnQ6IGZhbHNlLFxuICAgICAgYmFzZUNsYXNzOiBhbmFseXNpcy5iYXNlQ2xhc3MsXG4gICAgICAuLi5hbmFseXNpcy50eXBlQ2hlY2tNZXRhLFxuICAgICAgaXNQb2lzb25lZDogYW5hbHlzaXMuaXNQb2lzb25lZCxcbiAgICAgIGlzU3RydWN0dXJhbDogYW5hbHlzaXMuaXNTdHJ1Y3R1cmFsLFxuICAgIH0pO1xuXG4gICAgdGhpcy5pbmplY3RhYmxlUmVnaXN0cnkucmVnaXN0ZXJJbmplY3RhYmxlKG5vZGUpO1xuICB9XG5cbiAgcmVzb2x2ZShub2RlOiBDbGFzc0RlY2xhcmF0aW9uLCBhbmFseXNpczogRGlyZWN0aXZlSGFuZGxlckRhdGEsIHN5bWJvbDogRGlyZWN0aXZlU3ltYm9sKTpcbiAgICAgIFJlc29sdmVSZXN1bHQ8dW5rbm93bj4ge1xuICAgIGlmICh0aGlzLnNlbWFudGljRGVwR3JhcGhVcGRhdGVyICE9PSBudWxsICYmIGFuYWx5c2lzLmJhc2VDbGFzcyBpbnN0YW5jZW9mIFJlZmVyZW5jZSkge1xuICAgICAgc3ltYm9sLmJhc2VDbGFzcyA9IHRoaXMuc2VtYW50aWNEZXBHcmFwaFVwZGF0ZXIuZ2V0U3ltYm9sKGFuYWx5c2lzLmJhc2VDbGFzcy5ub2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkaWFnbm9zdGljczogdHMuRGlhZ25vc3RpY1tdID0gW107XG4gICAgaWYgKGFuYWx5c2lzLnByb3ZpZGVyc1JlcXVpcmluZ0ZhY3RvcnkgIT09IG51bGwgJiZcbiAgICAgICAgYW5hbHlzaXMubWV0YS5wcm92aWRlcnMgaW5zdGFuY2VvZiBXcmFwcGVkTm9kZUV4cHIpIHtcbiAgICAgIGNvbnN0IHByb3ZpZGVyRGlhZ25vc3RpY3MgPSBnZXRQcm92aWRlckRpYWdub3N0aWNzKFxuICAgICAgICAgIGFuYWx5c2lzLnByb3ZpZGVyc1JlcXVpcmluZ0ZhY3RvcnksIGFuYWx5c2lzLm1ldGEucHJvdmlkZXJzIS5ub2RlLFxuICAgICAgICAgIHRoaXMuaW5qZWN0YWJsZVJlZ2lzdHJ5KTtcbiAgICAgIGRpYWdub3N0aWNzLnB1c2goLi4ucHJvdmlkZXJEaWFnbm9zdGljcyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGlyZWN0aXZlRGlhZ25vc3RpY3MgPSBnZXREaXJlY3RpdmVEaWFnbm9zdGljcyhcbiAgICAgICAgbm9kZSwgdGhpcy5tZXRhUmVhZGVyLCB0aGlzLmV2YWx1YXRvciwgdGhpcy5yZWZsZWN0b3IsIHRoaXMuc2NvcGVSZWdpc3RyeSwgJ0RpcmVjdGl2ZScpO1xuICAgIGlmIChkaXJlY3RpdmVEaWFnbm9zdGljcyAhPT0gbnVsbCkge1xuICAgICAgZGlhZ25vc3RpY3MucHVzaCguLi5kaXJlY3RpdmVEaWFnbm9zdGljcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtkaWFnbm9zdGljczogZGlhZ25vc3RpY3MubGVuZ3RoID4gMCA/IGRpYWdub3N0aWNzIDogdW5kZWZpbmVkfTtcbiAgfVxuXG4gIGNvbXBpbGVGdWxsKFxuICAgICAgbm9kZTogQ2xhc3NEZWNsYXJhdGlvbiwgYW5hbHlzaXM6IFJlYWRvbmx5PERpcmVjdGl2ZUhhbmRsZXJEYXRhPixcbiAgICAgIHJlc29sdXRpb246IFJlYWRvbmx5PHVua25vd24+LCBwb29sOiBDb25zdGFudFBvb2wpOiBDb21waWxlUmVzdWx0W10ge1xuICAgIGNvbnN0IGZhYyA9IGNvbXBpbGVOZ0ZhY3RvcnlEZWZGaWVsZCh0b0ZhY3RvcnlNZXRhZGF0YShhbmFseXNpcy5tZXRhLCBGYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZSkpO1xuICAgIGNvbnN0IGRlZiA9IGNvbXBpbGVEaXJlY3RpdmVGcm9tTWV0YWRhdGEoYW5hbHlzaXMubWV0YSwgcG9vbCwgbWFrZUJpbmRpbmdQYXJzZXIoKSk7XG4gICAgY29uc3QgY2xhc3NNZXRhZGF0YSA9IGFuYWx5c2lzLmNsYXNzTWV0YWRhdGEgIT09IG51bGwgP1xuICAgICAgICBjb21waWxlQ2xhc3NNZXRhZGF0YShhbmFseXNpcy5jbGFzc01ldGFkYXRhKS50b1N0bXQoKSA6XG4gICAgICAgIG51bGw7XG4gICAgcmV0dXJuIGNvbXBpbGVSZXN1bHRzKGZhYywgZGVmLCBjbGFzc01ldGFkYXRhLCAnybVkaXInKTtcbiAgfVxuXG4gIGNvbXBpbGVQYXJ0aWFsKFxuICAgICAgbm9kZTogQ2xhc3NEZWNsYXJhdGlvbiwgYW5hbHlzaXM6IFJlYWRvbmx5PERpcmVjdGl2ZUhhbmRsZXJEYXRhPixcbiAgICAgIHJlc29sdXRpb246IFJlYWRvbmx5PHVua25vd24+KTogQ29tcGlsZVJlc3VsdFtdIHtcbiAgICBjb25zdCBmYWMgPSBjb21waWxlRGVjbGFyZUZhY3RvcnkodG9GYWN0b3J5TWV0YWRhdGEoYW5hbHlzaXMubWV0YSwgRmFjdG9yeVRhcmdldC5EaXJlY3RpdmUpKTtcbiAgICBjb25zdCBkZWYgPSBjb21waWxlRGVjbGFyZURpcmVjdGl2ZUZyb21NZXRhZGF0YShhbmFseXNpcy5tZXRhKTtcbiAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gYW5hbHlzaXMuY2xhc3NNZXRhZGF0YSAhPT0gbnVsbCA/XG4gICAgICAgIGNvbXBpbGVEZWNsYXJlQ2xhc3NNZXRhZGF0YShhbmFseXNpcy5jbGFzc01ldGFkYXRhKS50b1N0bXQoKSA6XG4gICAgICAgIG51bGw7XG4gICAgcmV0dXJuIGNvbXBpbGVSZXN1bHRzKGZhYywgZGVmLCBjbGFzc01ldGFkYXRhLCAnybVkaXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBnaXZlbiBjbGFzcyB1c2VzIEFuZ3VsYXIgZmVhdHVyZXMgYW5kIHJldHVybnMgdGhlIFR5cGVTY3JpcHQgbm9kZVxuICAgKiB0aGF0IGluZGljYXRlZCB0aGUgdXNhZ2UuIENsYXNzZXMgYXJlIGNvbnNpZGVyZWQgdXNpbmcgQW5ndWxhciBmZWF0dXJlcyBpZiB0aGV5XG4gICAqIGNvbnRhaW4gY2xhc3MgbWVtYmVycyB0aGF0IGFyZSBlaXRoZXIgZGVjb3JhdGVkIHdpdGggYSBrbm93biBBbmd1bGFyIGRlY29yYXRvcixcbiAgICogb3IgaWYgdGhleSBjb3JyZXNwb25kIHRvIGEga25vd24gQW5ndWxhciBsaWZlY3ljbGUgaG9vay5cbiAgICovXG4gIHByaXZhdGUgZmluZENsYXNzRmllbGRXaXRoQW5ndWxhckZlYXR1cmVzKG5vZGU6IENsYXNzRGVjbGFyYXRpb24pOiBDbGFzc01lbWJlcnx1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnJlZmxlY3Rvci5nZXRNZW1iZXJzT2ZDbGFzcyhub2RlKS5maW5kKG1lbWJlciA9PiB7XG4gICAgICBpZiAoIW1lbWJlci5pc1N0YXRpYyAmJiBtZW1iZXIua2luZCA9PT0gQ2xhc3NNZW1iZXJLaW5kLk1ldGhvZCAmJlxuICAgICAgICAgIExJRkVDWUNMRV9IT09LUy5oYXMobWVtYmVyLm5hbWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKG1lbWJlci5kZWNvcmF0b3JzKSB7XG4gICAgICAgIHJldHVybiBtZW1iZXIuZGVjb3JhdG9ycy5zb21lKFxuICAgICAgICAgICAgZGVjb3JhdG9yID0+IEZJRUxEX0RFQ09SQVRPUlMuc29tZShcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3JOYW1lID0+IGlzQW5ndWxhckRlY29yYXRvcihkZWNvcmF0b3IsIGRlY29yYXRvck5hbWUsIHRoaXMuaXNDb3JlKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGV4dHJhY3QgbWV0YWRhdGEgZnJvbSBhIGBEaXJlY3RpdmVgIG9yIGBDb21wb25lbnRgLiBgRGlyZWN0aXZlYHMgd2l0aG91dCBhXG4gKiBzZWxlY3RvciBhcmUgYWxsb3dlZCB0byBiZSB1c2VkIGZvciBhYnN0cmFjdCBiYXNlIGNsYXNzZXMuIFRoZXNlIGFic3RyYWN0IGRpcmVjdGl2ZXMgc2hvdWxkIG5vdFxuICogYXBwZWFyIGluIHRoZSBkZWNsYXJhdGlvbnMgb2YgYW4gYE5nTW9kdWxlYCBhbmQgYWRkaXRpb25hbCB2ZXJpZmljYXRpb24gaXMgZG9uZSB3aGVuIHByb2Nlc3NpbmdcbiAqIHRoZSBtb2R1bGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0RGlyZWN0aXZlTWV0YWRhdGEoXG4gICAgY2xheno6IENsYXNzRGVjbGFyYXRpb24sIGRlY29yYXRvcjogUmVhZG9ubHk8RGVjb3JhdG9yfG51bGw+LCByZWZsZWN0b3I6IFJlZmxlY3Rpb25Ib3N0LFxuICAgIGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvciwgaXNDb3JlOiBib29sZWFuLCBmbGFnczogSGFuZGxlckZsYWdzLFxuICAgIGFubm90YXRlRm9yQ2xvc3VyZUNvbXBpbGVyOiBib29sZWFuLCBkZWZhdWx0U2VsZWN0b3I6IHN0cmluZ3xudWxsID0gbnVsbCk6IHtcbiAgZGVjb3JhdG9yOiBNYXA8c3RyaW5nLCB0cy5FeHByZXNzaW9uPixcbiAgbWV0YWRhdGE6IFIzRGlyZWN0aXZlTWV0YWRhdGEsXG4gIGlucHV0czogQ2xhc3NQcm9wZXJ0eU1hcHBpbmcsXG4gIG91dHB1dHM6IENsYXNzUHJvcGVydHlNYXBwaW5nLFxuICBpc1N0cnVjdHVyYWw6IGJvb2xlYW47XG59fHVuZGVmaW5lZCB7XG4gIGxldCBkaXJlY3RpdmU6IE1hcDxzdHJpbmcsIHRzLkV4cHJlc3Npb24+O1xuICBpZiAoZGVjb3JhdG9yID09PSBudWxsIHx8IGRlY29yYXRvci5hcmdzID09PSBudWxsIHx8IGRlY29yYXRvci5hcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgIGRpcmVjdGl2ZSA9IG5ldyBNYXA8c3RyaW5nLCB0cy5FeHByZXNzaW9uPigpO1xuICB9IGVsc2UgaWYgKGRlY29yYXRvci5hcmdzLmxlbmd0aCAhPT0gMSkge1xuICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgRXJyb3JDb2RlLkRFQ09SQVRPUl9BUklUWV9XUk9ORywgRGVjb3JhdG9yLm5vZGVGb3JFcnJvcihkZWNvcmF0b3IpLFxuICAgICAgICBgSW5jb3JyZWN0IG51bWJlciBvZiBhcmd1bWVudHMgdG8gQCR7ZGVjb3JhdG9yLm5hbWV9IGRlY29yYXRvcmApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG1ldGEgPSB1bndyYXBFeHByZXNzaW9uKGRlY29yYXRvci5hcmdzWzBdKTtcbiAgICBpZiAoIXRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24obWV0YSkpIHtcbiAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX0FSR19OT1RfTElURVJBTCwgbWV0YSxcbiAgICAgICAgICBgQCR7ZGVjb3JhdG9yLm5hbWV9IGFyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0IGxpdGVyYWxgKTtcbiAgICB9XG4gICAgZGlyZWN0aXZlID0gcmVmbGVjdE9iamVjdExpdGVyYWwobWV0YSk7XG4gIH1cblxuICBpZiAoZGlyZWN0aXZlLmhhcygnaml0JykpIHtcbiAgICAvLyBUaGUgb25seSBhbGxvd2VkIHZhbHVlIGlzIHRydWUsIHNvIHRoZXJlJ3Mgbm8gbmVlZCB0byBleHBhbmQgZnVydGhlci5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgbWVtYmVycyA9IHJlZmxlY3Rvci5nZXRNZW1iZXJzT2ZDbGFzcyhjbGF6eik7XG5cbiAgLy8gUHJlY29tcHV0ZSBhIGxpc3Qgb2YgdHMuQ2xhc3NFbGVtZW50cyB0aGF0IGhhdmUgZGVjb3JhdG9ycy4gVGhpcyBpbmNsdWRlcyB0aGluZ3MgbGlrZSBASW5wdXQsXG4gIC8vIEBPdXRwdXQsIEBIb3N0QmluZGluZywgZXRjLlxuICBjb25zdCBkZWNvcmF0ZWRFbGVtZW50cyA9XG4gICAgICBtZW1iZXJzLmZpbHRlcihtZW1iZXIgPT4gIW1lbWJlci5pc1N0YXRpYyAmJiBtZW1iZXIuZGVjb3JhdG9ycyAhPT0gbnVsbCk7XG5cbiAgY29uc3QgY29yZU1vZHVsZSA9IGlzQ29yZSA/IHVuZGVmaW5lZCA6ICdAYW5ndWxhci9jb3JlJztcblxuICAvLyBDb25zdHJ1Y3QgdGhlIG1hcCBvZiBpbnB1dHMgYm90aCBmcm9tIHRoZSBARGlyZWN0aXZlL0BDb21wb25lbnRcbiAgLy8gZGVjb3JhdG9yLCBhbmQgdGhlIGRlY29yYXRlZFxuICAvLyBmaWVsZHMuXG4gIGNvbnN0IGlucHV0c0Zyb21NZXRhID0gcGFyc2VGaWVsZFRvUHJvcGVydHlNYXBwaW5nKGRpcmVjdGl2ZSwgJ2lucHV0cycsIGV2YWx1YXRvcik7XG4gIGNvbnN0IGlucHV0c0Zyb21GaWVsZHMgPSBwYXJzZURlY29yYXRlZEZpZWxkcyhcbiAgICAgIGZpbHRlclRvTWVtYmVyc1dpdGhEZWNvcmF0b3IoZGVjb3JhdGVkRWxlbWVudHMsICdJbnB1dCcsIGNvcmVNb2R1bGUpLCBldmFsdWF0b3IsXG4gICAgICByZXNvbHZlSW5wdXQpO1xuXG4gIC8vIEFuZCBvdXRwdXRzLlxuICBjb25zdCBvdXRwdXRzRnJvbU1ldGEgPSBwYXJzZUZpZWxkVG9Qcm9wZXJ0eU1hcHBpbmcoZGlyZWN0aXZlLCAnb3V0cHV0cycsIGV2YWx1YXRvcik7XG4gIGNvbnN0IG91dHB1dHNGcm9tRmllbGRzID1cbiAgICAgIHBhcnNlRGVjb3JhdGVkRmllbGRzKFxuICAgICAgICAgIGZpbHRlclRvTWVtYmVyc1dpdGhEZWNvcmF0b3IoZGVjb3JhdGVkRWxlbWVudHMsICdPdXRwdXQnLCBjb3JlTW9kdWxlKSwgZXZhbHVhdG9yLFxuICAgICAgICAgIHJlc29sdmVPdXRwdXQpIGFzIHtbZmllbGQ6IHN0cmluZ106IHN0cmluZ307XG4gIC8vIENvbnN0cnVjdCB0aGUgbGlzdCBvZiBxdWVyaWVzLlxuICBjb25zdCBjb250ZW50Q2hpbGRGcm9tRmllbGRzID0gcXVlcmllc0Zyb21GaWVsZHMoXG4gICAgICBmaWx0ZXJUb01lbWJlcnNXaXRoRGVjb3JhdG9yKGRlY29yYXRlZEVsZW1lbnRzLCAnQ29udGVudENoaWxkJywgY29yZU1vZHVsZSksIHJlZmxlY3RvcixcbiAgICAgIGV2YWx1YXRvcik7XG4gIGNvbnN0IGNvbnRlbnRDaGlsZHJlbkZyb21GaWVsZHMgPSBxdWVyaWVzRnJvbUZpZWxkcyhcbiAgICAgIGZpbHRlclRvTWVtYmVyc1dpdGhEZWNvcmF0b3IoZGVjb3JhdGVkRWxlbWVudHMsICdDb250ZW50Q2hpbGRyZW4nLCBjb3JlTW9kdWxlKSwgcmVmbGVjdG9yLFxuICAgICAgZXZhbHVhdG9yKTtcblxuICBjb25zdCBxdWVyaWVzID0gWy4uLmNvbnRlbnRDaGlsZEZyb21GaWVsZHMsIC4uLmNvbnRlbnRDaGlsZHJlbkZyb21GaWVsZHNdO1xuXG4gIC8vIENvbnN0cnVjdCB0aGUgbGlzdCBvZiB2aWV3IHF1ZXJpZXMuXG4gIGNvbnN0IHZpZXdDaGlsZEZyb21GaWVsZHMgPSBxdWVyaWVzRnJvbUZpZWxkcyhcbiAgICAgIGZpbHRlclRvTWVtYmVyc1dpdGhEZWNvcmF0b3IoZGVjb3JhdGVkRWxlbWVudHMsICdWaWV3Q2hpbGQnLCBjb3JlTW9kdWxlKSwgcmVmbGVjdG9yLFxuICAgICAgZXZhbHVhdG9yKTtcbiAgY29uc3Qgdmlld0NoaWxkcmVuRnJvbUZpZWxkcyA9IHF1ZXJpZXNGcm9tRmllbGRzKFxuICAgICAgZmlsdGVyVG9NZW1iZXJzV2l0aERlY29yYXRvcihkZWNvcmF0ZWRFbGVtZW50cywgJ1ZpZXdDaGlsZHJlbicsIGNvcmVNb2R1bGUpLCByZWZsZWN0b3IsXG4gICAgICBldmFsdWF0b3IpO1xuICBjb25zdCB2aWV3UXVlcmllcyA9IFsuLi52aWV3Q2hpbGRGcm9tRmllbGRzLCAuLi52aWV3Q2hpbGRyZW5Gcm9tRmllbGRzXTtcblxuICBpZiAoZGlyZWN0aXZlLmhhcygncXVlcmllcycpKSB7XG4gICAgY29uc3QgcXVlcmllc0Zyb21EZWNvcmF0b3IgPVxuICAgICAgICBleHRyYWN0UXVlcmllc0Zyb21EZWNvcmF0b3IoZGlyZWN0aXZlLmdldCgncXVlcmllcycpISwgcmVmbGVjdG9yLCBldmFsdWF0b3IsIGlzQ29yZSk7XG4gICAgcXVlcmllcy5wdXNoKC4uLnF1ZXJpZXNGcm9tRGVjb3JhdG9yLmNvbnRlbnQpO1xuICAgIHZpZXdRdWVyaWVzLnB1c2goLi4ucXVlcmllc0Zyb21EZWNvcmF0b3Iudmlldyk7XG4gIH1cblxuICAvLyBQYXJzZSB0aGUgc2VsZWN0b3IuXG4gIGxldCBzZWxlY3RvciA9IGRlZmF1bHRTZWxlY3RvcjtcbiAgaWYgKGRpcmVjdGl2ZS5oYXMoJ3NlbGVjdG9yJykpIHtcbiAgICBjb25zdCBleHByID0gZGlyZWN0aXZlLmdldCgnc2VsZWN0b3InKSE7XG4gICAgY29uc3QgcmVzb2x2ZWQgPSBldmFsdWF0b3IuZXZhbHVhdGUoZXhwcik7XG4gICAgaWYgKHR5cGVvZiByZXNvbHZlZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IGNyZWF0ZVZhbHVlSGFzV3JvbmdUeXBlRXJyb3IoZXhwciwgcmVzb2x2ZWQsIGBzZWxlY3RvciBtdXN0IGJlIGEgc3RyaW5nYCk7XG4gICAgfVxuICAgIC8vIHVzZSBkZWZhdWx0IHNlbGVjdG9yIGluIGNhc2Ugc2VsZWN0b3IgaXMgYW4gZW1wdHkgc3RyaW5nXG4gICAgc2VsZWN0b3IgPSByZXNvbHZlZCA9PT0gJycgPyBkZWZhdWx0U2VsZWN0b3IgOiByZXNvbHZlZDtcbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgICAgRXJyb3JDb2RlLkRJUkVDVElWRV9NSVNTSU5HX1NFTEVDVE9SLCBleHByLFxuICAgICAgICAgIGBEaXJlY3RpdmUgJHtjbGF6ei5uYW1lLnRleHR9IGhhcyBubyBzZWxlY3RvciwgcGxlYXNlIGFkZCBpdCFgKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBob3N0ID0gZXh0cmFjdEhvc3RCaW5kaW5ncyhkZWNvcmF0ZWRFbGVtZW50cywgZXZhbHVhdG9yLCBjb3JlTW9kdWxlLCBkaXJlY3RpdmUpO1xuXG4gIGNvbnN0IHByb3ZpZGVyczogRXhwcmVzc2lvbnxudWxsID0gZGlyZWN0aXZlLmhhcygncHJvdmlkZXJzJykgP1xuICAgICAgbmV3IFdyYXBwZWROb2RlRXhwcihcbiAgICAgICAgICBhbm5vdGF0ZUZvckNsb3N1cmVDb21waWxlciA/XG4gICAgICAgICAgICAgIHdyYXBGdW5jdGlvbkV4cHJlc3Npb25zSW5QYXJlbnMoZGlyZWN0aXZlLmdldCgncHJvdmlkZXJzJykhKSA6XG4gICAgICAgICAgICAgIGRpcmVjdGl2ZS5nZXQoJ3Byb3ZpZGVycycpISkgOlxuICAgICAgbnVsbDtcblxuICAvLyBEZXRlcm1pbmUgaWYgYG5nT25DaGFuZ2VzYCBpcyBhIGxpZmVjeWNsZSBob29rIGRlZmluZWQgb24gdGhlIGNvbXBvbmVudC5cbiAgY29uc3QgdXNlc09uQ2hhbmdlcyA9IG1lbWJlcnMuc29tZShcbiAgICAgIG1lbWJlciA9PiAhbWVtYmVyLmlzU3RhdGljICYmIG1lbWJlci5raW5kID09PSBDbGFzc01lbWJlcktpbmQuTWV0aG9kICYmXG4gICAgICAgICAgbWVtYmVyLm5hbWUgPT09ICduZ09uQ2hhbmdlcycpO1xuXG4gIC8vIFBhcnNlIGV4cG9ydEFzLlxuICBsZXQgZXhwb3J0QXM6IHN0cmluZ1tdfG51bGwgPSBudWxsO1xuICBpZiAoZGlyZWN0aXZlLmhhcygnZXhwb3J0QXMnKSkge1xuICAgIGNvbnN0IGV4cHIgPSBkaXJlY3RpdmUuZ2V0KCdleHBvcnRBcycpITtcbiAgICBjb25zdCByZXNvbHZlZCA9IGV2YWx1YXRvci5ldmFsdWF0ZShleHByKTtcbiAgICBpZiAodHlwZW9mIHJlc29sdmVkICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgY3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvcihleHByLCByZXNvbHZlZCwgYGV4cG9ydEFzIG11c3QgYmUgYSBzdHJpbmdgKTtcbiAgICB9XG4gICAgZXhwb3J0QXMgPSByZXNvbHZlZC5zcGxpdCgnLCcpLm1hcChwYXJ0ID0+IHBhcnQudHJpbSgpKTtcbiAgfVxuXG4gIGNvbnN0IHJhd0N0b3JEZXBzID0gZ2V0Q29uc3RydWN0b3JEZXBlbmRlbmNpZXMoY2xhenosIHJlZmxlY3RvciwgaXNDb3JlKTtcblxuICAvLyBOb24tYWJzdHJhY3QgZGlyZWN0aXZlcyAodGhvc2Ugd2l0aCBhIHNlbGVjdG9yKSByZXF1aXJlIHZhbGlkIGNvbnN0cnVjdG9yIGRlcGVuZGVuY2llcywgd2hlcmVhc1xuICAvLyBhYnN0cmFjdCBkaXJlY3RpdmVzIGFyZSBhbGxvd2VkIHRvIGhhdmUgaW52YWxpZCBkZXBlbmRlbmNpZXMsIGdpdmVuIHRoYXQgYSBzdWJjbGFzcyBtYXkgY2FsbFxuICAvLyB0aGUgY29uc3RydWN0b3IgZXhwbGljaXRseS5cbiAgY29uc3QgY3RvckRlcHMgPSBzZWxlY3RvciAhPT0gbnVsbCA/IHZhbGlkYXRlQ29uc3RydWN0b3JEZXBlbmRlbmNpZXMoY2xhenosIHJhd0N0b3JEZXBzKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bndyYXBDb25zdHJ1Y3RvckRlcGVuZGVuY2llcyhyYXdDdG9yRGVwcyk7XG5cbiAgLy8gU3RydWN0dXJhbCBkaXJlY3RpdmVzIG11c3QgaGF2ZSBhIGBUZW1wbGF0ZVJlZmAgZGVwZW5kZW5jeS5cbiAgY29uc3QgaXNTdHJ1Y3R1cmFsID0gY3RvckRlcHMgIT09IG51bGwgJiYgY3RvckRlcHMgIT09ICdpbnZhbGlkJyAmJlxuICAgICAgY3RvckRlcHMuc29tZShcbiAgICAgICAgICBkZXAgPT4gKGRlcC50b2tlbiBpbnN0YW5jZW9mIEV4dGVybmFsRXhwcikgJiZcbiAgICAgICAgICAgICAgZGVwLnRva2VuLnZhbHVlLm1vZHVsZU5hbWUgPT09ICdAYW5ndWxhci9jb3JlJyAmJlxuICAgICAgICAgICAgICBkZXAudG9rZW4udmFsdWUubmFtZSA9PT0gJ1RlbXBsYXRlUmVmJyk7XG5cbiAgLy8gRGV0ZWN0IGlmIHRoZSBjb21wb25lbnQgaW5oZXJpdHMgZnJvbSBhbm90aGVyIGNsYXNzXG4gIGNvbnN0IHVzZXNJbmhlcml0YW5jZSA9IHJlZmxlY3Rvci5oYXNCYXNlQ2xhc3MoY2xhenopO1xuICBjb25zdCB0eXBlID0gd3JhcFR5cGVSZWZlcmVuY2UocmVmbGVjdG9yLCBjbGF6eik7XG4gIGNvbnN0IGludGVybmFsVHlwZSA9IG5ldyBXcmFwcGVkTm9kZUV4cHIocmVmbGVjdG9yLmdldEludGVybmFsTmFtZU9mQ2xhc3MoY2xhenopKTtcblxuICBjb25zdCBpbnB1dHMgPSBDbGFzc1Byb3BlcnR5TWFwcGluZy5mcm9tTWFwcGVkT2JqZWN0KHsuLi5pbnB1dHNGcm9tTWV0YSwgLi4uaW5wdXRzRnJvbUZpZWxkc30pO1xuICBjb25zdCBvdXRwdXRzID0gQ2xhc3NQcm9wZXJ0eU1hcHBpbmcuZnJvbU1hcHBlZE9iamVjdCh7Li4ub3V0cHV0c0Zyb21NZXRhLCAuLi5vdXRwdXRzRnJvbUZpZWxkc30pO1xuXG4gIGNvbnN0IG1ldGFkYXRhOiBSM0RpcmVjdGl2ZU1ldGFkYXRhID0ge1xuICAgIG5hbWU6IGNsYXp6Lm5hbWUudGV4dCxcbiAgICBkZXBzOiBjdG9yRGVwcyxcbiAgICBob3N0LFxuICAgIGxpZmVjeWNsZToge1xuICAgICAgdXNlc09uQ2hhbmdlcyxcbiAgICB9LFxuICAgIGlucHV0czogaW5wdXRzLnRvSm9pbnRNYXBwZWRPYmplY3QoKSxcbiAgICBvdXRwdXRzOiBvdXRwdXRzLnRvRGlyZWN0TWFwcGVkT2JqZWN0KCksXG4gICAgcXVlcmllcyxcbiAgICB2aWV3UXVlcmllcyxcbiAgICBzZWxlY3RvcixcbiAgICBmdWxsSW5oZXJpdGFuY2U6ICEhKGZsYWdzICYgSGFuZGxlckZsYWdzLkZVTExfSU5IRVJJVEFOQ0UpLFxuICAgIHR5cGUsXG4gICAgaW50ZXJuYWxUeXBlLFxuICAgIHR5cGVBcmd1bWVudENvdW50OiByZWZsZWN0b3IuZ2V0R2VuZXJpY0FyaXR5T2ZDbGFzcyhjbGF6eikgfHwgMCxcbiAgICB0eXBlU291cmNlU3BhbjogY3JlYXRlU291cmNlU3BhbihjbGF6ei5uYW1lKSxcbiAgICB1c2VzSW5oZXJpdGFuY2UsXG4gICAgZXhwb3J0QXMsXG4gICAgcHJvdmlkZXJzXG4gIH07XG4gIHJldHVybiB7XG4gICAgZGVjb3JhdG9yOiBkaXJlY3RpdmUsXG4gICAgbWV0YWRhdGEsXG4gICAgaW5wdXRzLFxuICAgIG91dHB1dHMsXG4gICAgaXNTdHJ1Y3R1cmFsLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFF1ZXJ5TWV0YWRhdGEoXG4gICAgZXhwck5vZGU6IHRzLk5vZGUsIG5hbWU6IHN0cmluZywgYXJnczogUmVhZG9ubHlBcnJheTx0cy5FeHByZXNzaW9uPiwgcHJvcGVydHlOYW1lOiBzdHJpbmcsXG4gICAgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCwgZXZhbHVhdG9yOiBQYXJ0aWFsRXZhbHVhdG9yKTogUjNRdWVyeU1ldGFkYXRhIHtcbiAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX0FSSVRZX1dST05HLCBleHByTm9kZSwgYEAke25hbWV9IG11c3QgaGF2ZSBhcmd1bWVudHNgKTtcbiAgfVxuICBjb25zdCBmaXJzdCA9IG5hbWUgPT09ICdWaWV3Q2hpbGQnIHx8IG5hbWUgPT09ICdDb250ZW50Q2hpbGQnO1xuICBjb25zdCBub2RlID0gdHJ5VW53cmFwRm9yd2FyZFJlZihhcmdzWzBdLCByZWZsZWN0b3IpID8/IGFyZ3NbMF07XG4gIGNvbnN0IGFyZyA9IGV2YWx1YXRvci5ldmFsdWF0ZShub2RlKTtcblxuICAvKiogV2hldGhlciBvciBub3QgdGhpcyBxdWVyeSBzaG91bGQgY29sbGVjdCBvbmx5IHN0YXRpYyByZXN1bHRzIChzZWUgdmlldy9hcGkudHMpICAqL1xuICBsZXQgaXNTdGF0aWM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvLyBFeHRyYWN0IHRoZSBwcmVkaWNhdGVcbiAgbGV0IHByZWRpY2F0ZTogRXhwcmVzc2lvbnxzdHJpbmdbXXxudWxsID0gbnVsbDtcbiAgaWYgKGFyZyBpbnN0YW5jZW9mIFJlZmVyZW5jZSB8fCBhcmcgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICAvLyBSZWZlcmVuY2VzIGFuZCBwcmVkaWNhdGVzIHRoYXQgY291bGQgbm90IGJlIGV2YWx1YXRlZCBzdGF0aWNhbGx5IGFyZSBlbWl0dGVkIGFzIGlzLlxuICAgIHByZWRpY2F0ZSA9IG5ldyBXcmFwcGVkTm9kZUV4cHIobm9kZSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycpIHtcbiAgICBwcmVkaWNhdGUgPSBbYXJnXTtcbiAgfSBlbHNlIGlmIChpc1N0cmluZ0FycmF5T3JEaWUoYXJnLCBgQCR7bmFtZX0gcHJlZGljYXRlYCwgbm9kZSkpIHtcbiAgICBwcmVkaWNhdGUgPSBhcmc7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgY3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvcihub2RlLCBhcmcsIGBAJHtuYW1lfSBwcmVkaWNhdGUgY2Fubm90IGJlIGludGVycHJldGVkYCk7XG4gIH1cblxuICAvLyBFeHRyYWN0IHRoZSByZWFkIGFuZCBkZXNjZW5kYW50cyBvcHRpb25zLlxuICBsZXQgcmVhZDogRXhwcmVzc2lvbnxudWxsID0gbnVsbDtcbiAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIGRlc2NlbmRhbnRzIGlzIHRydWUgZm9yIGV2ZXJ5IGRlY29yYXRvciBleGNlcHQgQENvbnRlbnRDaGlsZHJlbi5cbiAgbGV0IGRlc2NlbmRhbnRzOiBib29sZWFuID0gbmFtZSAhPT0gJ0NvbnRlbnRDaGlsZHJlbic7XG4gIGxldCBlbWl0RGlzdGluY3RDaGFuZ2VzT25seTogYm9vbGVhbiA9IGVtaXREaXN0aW5jdENoYW5nZXNPbmx5RGVmYXVsdFZhbHVlO1xuICBpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICBjb25zdCBvcHRpb25zRXhwciA9IHVud3JhcEV4cHJlc3Npb24oYXJnc1sxXSk7XG4gICAgaWYgKCF0cy5pc09iamVjdExpdGVyYWxFeHByZXNzaW9uKG9wdGlvbnNFeHByKSkge1xuICAgICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICAgIEVycm9yQ29kZS5ERUNPUkFUT1JfQVJHX05PVF9MSVRFUkFMLCBvcHRpb25zRXhwcixcbiAgICAgICAgICBgQCR7bmFtZX0gb3B0aW9ucyBtdXN0IGJlIGFuIG9iamVjdCBsaXRlcmFsYCk7XG4gICAgfVxuICAgIGNvbnN0IG9wdGlvbnMgPSByZWZsZWN0T2JqZWN0TGl0ZXJhbChvcHRpb25zRXhwcik7XG4gICAgaWYgKG9wdGlvbnMuaGFzKCdyZWFkJykpIHtcbiAgICAgIHJlYWQgPSBuZXcgV3JhcHBlZE5vZGVFeHByKG9wdGlvbnMuZ2V0KCdyZWFkJykhKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5oYXMoJ2Rlc2NlbmRhbnRzJykpIHtcbiAgICAgIGNvbnN0IGRlc2NlbmRhbnRzRXhwciA9IG9wdGlvbnMuZ2V0KCdkZXNjZW5kYW50cycpITtcbiAgICAgIGNvbnN0IGRlc2NlbmRhbnRzVmFsdWUgPSBldmFsdWF0b3IuZXZhbHVhdGUoZGVzY2VuZGFudHNFeHByKTtcbiAgICAgIGlmICh0eXBlb2YgZGVzY2VuZGFudHNWYWx1ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IGNyZWF0ZVZhbHVlSGFzV3JvbmdUeXBlRXJyb3IoXG4gICAgICAgICAgICBkZXNjZW5kYW50c0V4cHIsIGRlc2NlbmRhbnRzVmFsdWUsIGBAJHtuYW1lfSBvcHRpb25zLmRlc2NlbmRhbnRzIG11c3QgYmUgYSBib29sZWFuYCk7XG4gICAgICB9XG4gICAgICBkZXNjZW5kYW50cyA9IGRlc2NlbmRhbnRzVmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuaGFzKCdlbWl0RGlzdGluY3RDaGFuZ2VzT25seScpKSB7XG4gICAgICBjb25zdCBlbWl0RGlzdGluY3RDaGFuZ2VzT25seUV4cHIgPSBvcHRpb25zLmdldCgnZW1pdERpc3RpbmN0Q2hhbmdlc09ubHknKSE7XG4gICAgICBjb25zdCBlbWl0RGlzdGluY3RDaGFuZ2VzT25seVZhbHVlID0gZXZhbHVhdG9yLmV2YWx1YXRlKGVtaXREaXN0aW5jdENoYW5nZXNPbmx5RXhwcik7XG4gICAgICBpZiAodHlwZW9mIGVtaXREaXN0aW5jdENoYW5nZXNPbmx5VmFsdWUgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBjcmVhdGVWYWx1ZUhhc1dyb25nVHlwZUVycm9yKFxuICAgICAgICAgICAgZW1pdERpc3RpbmN0Q2hhbmdlc09ubHlFeHByLCBlbWl0RGlzdGluY3RDaGFuZ2VzT25seVZhbHVlLFxuICAgICAgICAgICAgYEAke25hbWV9IG9wdGlvbnMuZW1pdERpc3RpbmN0Q2hhbmdlc09ubHkgbXVzdCBiZSBhIGJvb2xlYW5gKTtcbiAgICAgIH1cbiAgICAgIGVtaXREaXN0aW5jdENoYW5nZXNPbmx5ID0gZW1pdERpc3RpbmN0Q2hhbmdlc09ubHlWYWx1ZTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5oYXMoJ3N0YXRpYycpKSB7XG4gICAgICBjb25zdCBzdGF0aWNWYWx1ZSA9IGV2YWx1YXRvci5ldmFsdWF0ZShvcHRpb25zLmdldCgnc3RhdGljJykhKTtcbiAgICAgIGlmICh0eXBlb2Ygc3RhdGljVmFsdWUgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBjcmVhdGVWYWx1ZUhhc1dyb25nVHlwZUVycm9yKFxuICAgICAgICAgICAgbm9kZSwgc3RhdGljVmFsdWUsIGBAJHtuYW1lfSBvcHRpb25zLnN0YXRpYyBtdXN0IGJlIGEgYm9vbGVhbmApO1xuICAgICAgfVxuICAgICAgaXNTdGF0aWMgPSBzdGF0aWNWYWx1ZTtcbiAgICB9XG5cbiAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA+IDIpIHtcbiAgICAvLyBUb28gbWFueSBhcmd1bWVudHMuXG4gICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX0FSSVRZX1dST05HLCBub2RlLCBgQCR7bmFtZX0gaGFzIHRvbyBtYW55IGFyZ3VtZW50c2ApO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwcm9wZXJ0eU5hbWUsXG4gICAgcHJlZGljYXRlLFxuICAgIGZpcnN0LFxuICAgIGRlc2NlbmRhbnRzLFxuICAgIHJlYWQsXG4gICAgc3RhdGljOiBpc1N0YXRpYyxcbiAgICBlbWl0RGlzdGluY3RDaGFuZ2VzT25seSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RRdWVyaWVzRnJvbURlY29yYXRvcihcbiAgICBxdWVyeURhdGE6IHRzLkV4cHJlc3Npb24sIHJlZmxlY3RvcjogUmVmbGVjdGlvbkhvc3QsIGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvcixcbiAgICBpc0NvcmU6IGJvb2xlYW4pOiB7XG4gIGNvbnRlbnQ6IFIzUXVlcnlNZXRhZGF0YVtdLFxuICB2aWV3OiBSM1F1ZXJ5TWV0YWRhdGFbXSxcbn0ge1xuICBjb25zdCBjb250ZW50OiBSM1F1ZXJ5TWV0YWRhdGFbXSA9IFtdLCB2aWV3OiBSM1F1ZXJ5TWV0YWRhdGFbXSA9IFtdO1xuICBpZiAoIXRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24ocXVlcnlEYXRhKSkge1xuICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgRXJyb3JDb2RlLlZBTFVFX0hBU19XUk9OR19UWVBFLCBxdWVyeURhdGEsXG4gICAgICAgICdEZWNvcmF0b3IgcXVlcmllcyBtZXRhZGF0YSBtdXN0IGJlIGFuIG9iamVjdCBsaXRlcmFsJyk7XG4gIH1cbiAgcmVmbGVjdE9iamVjdExpdGVyYWwocXVlcnlEYXRhKS5mb3JFYWNoKChxdWVyeUV4cHIsIHByb3BlcnR5TmFtZSkgPT4ge1xuICAgIHF1ZXJ5RXhwciA9IHVud3JhcEV4cHJlc3Npb24ocXVlcnlFeHByKTtcbiAgICBpZiAoIXRzLmlzTmV3RXhwcmVzc2lvbihxdWVyeUV4cHIpKSB7XG4gICAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgICAgRXJyb3JDb2RlLlZBTFVFX0hBU19XUk9OR19UWVBFLCBxdWVyeURhdGEsXG4gICAgICAgICAgJ0RlY29yYXRvciBxdWVyeSBtZXRhZGF0YSBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIGEgcXVlcnkgdHlwZScpO1xuICAgIH1cbiAgICBjb25zdCBxdWVyeVR5cGUgPSB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihxdWVyeUV4cHIuZXhwcmVzc2lvbikgP1xuICAgICAgICBxdWVyeUV4cHIuZXhwcmVzc2lvbi5uYW1lIDpcbiAgICAgICAgcXVlcnlFeHByLmV4cHJlc3Npb247XG4gICAgaWYgKCF0cy5pc0lkZW50aWZpZXIocXVlcnlUeXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICAgIEVycm9yQ29kZS5WQUxVRV9IQVNfV1JPTkdfVFlQRSwgcXVlcnlEYXRhLFxuICAgICAgICAgICdEZWNvcmF0b3IgcXVlcnkgbWV0YWRhdGEgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBhIHF1ZXJ5IHR5cGUnKTtcbiAgICB9XG4gICAgY29uc3QgdHlwZSA9IHJlZmxlY3Rvci5nZXRJbXBvcnRPZklkZW50aWZpZXIocXVlcnlUeXBlKTtcbiAgICBpZiAodHlwZSA9PT0gbnVsbCB8fCAoIWlzQ29yZSAmJiB0eXBlLmZyb20gIT09ICdAYW5ndWxhci9jb3JlJykgfHxcbiAgICAgICAgIVFVRVJZX1RZUEVTLmhhcyh0eXBlLm5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgICAgRXJyb3JDb2RlLlZBTFVFX0hBU19XUk9OR19UWVBFLCBxdWVyeURhdGEsXG4gICAgICAgICAgJ0RlY29yYXRvciBxdWVyeSBtZXRhZGF0YSBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIGEgcXVlcnkgdHlwZScpO1xuICAgIH1cblxuICAgIGNvbnN0IHF1ZXJ5ID0gZXh0cmFjdFF1ZXJ5TWV0YWRhdGEoXG4gICAgICAgIHF1ZXJ5RXhwciwgdHlwZS5uYW1lLCBxdWVyeUV4cHIuYXJndW1lbnRzIHx8IFtdLCBwcm9wZXJ0eU5hbWUsIHJlZmxlY3RvciwgZXZhbHVhdG9yKTtcbiAgICBpZiAodHlwZS5uYW1lLnN0YXJ0c1dpdGgoJ0NvbnRlbnQnKSkge1xuICAgICAgY29udGVudC5wdXNoKHF1ZXJ5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlldy5wdXNoKHF1ZXJ5KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge2NvbnRlbnQsIHZpZXd9O1xufVxuXG5mdW5jdGlvbiBpc1N0cmluZ0FycmF5T3JEaWUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nLCBub2RlOiB0cy5FeHByZXNzaW9uKTogdmFsdWUgaXMgc3RyaW5nW10ge1xuICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0eXBlb2YgdmFsdWVbaV0gIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBjcmVhdGVWYWx1ZUhhc1dyb25nVHlwZUVycm9yKFxuICAgICAgICAgIG5vZGUsIHZhbHVlW2ldLCBgRmFpbGVkIHRvIHJlc29sdmUgJHtuYW1lfSBhdCBwb3NpdGlvbiAke2l9IHRvIGEgc3RyaW5nYCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VGaWVsZEFycmF5VmFsdWUoXG4gICAgZGlyZWN0aXZlOiBNYXA8c3RyaW5nLCB0cy5FeHByZXNzaW9uPiwgZmllbGQ6IHN0cmluZywgZXZhbHVhdG9yOiBQYXJ0aWFsRXZhbHVhdG9yKTogbnVsbHxcbiAgICBzdHJpbmdbXSB7XG4gIGlmICghZGlyZWN0aXZlLmhhcyhmaWVsZCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFJlc29sdmUgdGhlIGZpZWxkIG9mIGludGVyZXN0IGZyb20gdGhlIGRpcmVjdGl2ZSBtZXRhZGF0YSB0byBhIHN0cmluZ1tdLlxuICBjb25zdCBleHByZXNzaW9uID0gZGlyZWN0aXZlLmdldChmaWVsZCkhO1xuICBjb25zdCB2YWx1ZSA9IGV2YWx1YXRvci5ldmFsdWF0ZShleHByZXNzaW9uKTtcbiAgaWYgKCFpc1N0cmluZ0FycmF5T3JEaWUodmFsdWUsIGZpZWxkLCBleHByZXNzaW9uKSkge1xuICAgIHRocm93IGNyZWF0ZVZhbHVlSGFzV3JvbmdUeXBlRXJyb3IoXG4gICAgICAgIGV4cHJlc3Npb24sIHZhbHVlLCBgRmFpbGVkIHRvIHJlc29sdmUgQERpcmVjdGl2ZS4ke2ZpZWxkfSB0byBhIHN0cmluZyBhcnJheWApO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIEludGVycHJldCBwcm9wZXJ0eSBtYXBwaW5nIGZpZWxkcyBvbiB0aGUgZGVjb3JhdG9yIChlLmcuIGlucHV0cyBvciBvdXRwdXRzKSBhbmQgcmV0dXJuIHRoZVxuICogY29ycmVjdGx5IHNoYXBlZCBtZXRhZGF0YSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlRmllbGRUb1Byb3BlcnR5TWFwcGluZyhcbiAgICBkaXJlY3RpdmU6IE1hcDxzdHJpbmcsIHRzLkV4cHJlc3Npb24+LCBmaWVsZDogc3RyaW5nLFxuICAgIGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvcik6IHtbZmllbGQ6IHN0cmluZ106IHN0cmluZ30ge1xuICBjb25zdCBtZXRhVmFsdWVzID0gcGFyc2VGaWVsZEFycmF5VmFsdWUoZGlyZWN0aXZlLCBmaWVsZCwgZXZhbHVhdG9yKTtcbiAgaWYgKCFtZXRhVmFsdWVzKSB7XG4gICAgcmV0dXJuIEVNUFRZX09CSkVDVDtcbiAgfVxuXG4gIHJldHVybiBtZXRhVmFsdWVzLnJlZHVjZSgocmVzdWx0cywgdmFsdWUpID0+IHtcbiAgICAvLyBFaXRoZXIgdGhlIHZhbHVlIGlzICdmaWVsZCcgb3IgJ2ZpZWxkOiBwcm9wZXJ0eScuIEluIHRoZSBmaXJzdCBjYXNlLCBgcHJvcGVydHlgIHdpbGxcbiAgICAvLyBiZSB1bmRlZmluZWQsIGluIHdoaWNoIGNhc2UgdGhlIGZpZWxkIG5hbWUgc2hvdWxkIGFsc28gYmUgdXNlZCBhcyB0aGUgcHJvcGVydHkgbmFtZS5cbiAgICBjb25zdCBbZmllbGQsIHByb3BlcnR5XSA9IHZhbHVlLnNwbGl0KCc6JywgMikubWFwKHN0ciA9PiBzdHIudHJpbSgpKTtcbiAgICByZXN1bHRzW2ZpZWxkXSA9IHByb3BlcnR5IHx8IGZpZWxkO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9LCB7fSBhcyB7W2ZpZWxkOiBzdHJpbmddOiBzdHJpbmd9KTtcbn1cblxuLyoqXG4gKiBQYXJzZSBwcm9wZXJ0eSBkZWNvcmF0b3JzIChlLmcuIGBJbnB1dGAgb3IgYE91dHB1dGApIGFuZCByZXR1cm4gdGhlIGNvcnJlY3RseSBzaGFwZWQgbWV0YWRhdGFcbiAqIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gcGFyc2VEZWNvcmF0ZWRGaWVsZHMoXG4gICAgZmllbGRzOiB7bWVtYmVyOiBDbGFzc01lbWJlciwgZGVjb3JhdG9yczogRGVjb3JhdG9yW119W10sIGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvcixcbiAgICBtYXBWYWx1ZVJlc29sdmVyOiAocHVibGljTmFtZTogc3RyaW5nLCBpbnRlcm5hbE5hbWU6IHN0cmluZykgPT5cbiAgICAgICAgc3RyaW5nIHwgW3N0cmluZywgc3RyaW5nXSk6IHtbZmllbGQ6IHN0cmluZ106IHN0cmluZ3xbc3RyaW5nLCBzdHJpbmddfSB7XG4gIHJldHVybiBmaWVsZHMucmVkdWNlKChyZXN1bHRzLCBmaWVsZCkgPT4ge1xuICAgIGNvbnN0IGZpZWxkTmFtZSA9IGZpZWxkLm1lbWJlci5uYW1lO1xuICAgIGZpZWxkLmRlY29yYXRvcnMuZm9yRWFjaChkZWNvcmF0b3IgPT4ge1xuICAgICAgLy8gVGhlIGRlY29yYXRvciBlaXRoZXIgZG9lc24ndCBoYXZlIGFuIGFyZ3VtZW50IChASW5wdXQoKSkgaW4gd2hpY2ggY2FzZSB0aGUgcHJvcGVydHlcbiAgICAgIC8vIG5hbWUgaXMgdXNlZCwgb3IgaXQgaGFzIG9uZSBhcmd1bWVudCAoQE91dHB1dCgnbmFtZWQnKSkuXG4gICAgICBpZiAoZGVjb3JhdG9yLmFyZ3MgPT0gbnVsbCB8fCBkZWNvcmF0b3IuYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmVzdWx0c1tmaWVsZE5hbWVdID0gZmllbGROYW1lO1xuICAgICAgfSBlbHNlIGlmIChkZWNvcmF0b3IuYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29uc3QgcHJvcGVydHkgPSBldmFsdWF0b3IuZXZhbHVhdGUoZGVjb3JhdG9yLmFyZ3NbMF0pO1xuICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IGNyZWF0ZVZhbHVlSGFzV3JvbmdUeXBlRXJyb3IoXG4gICAgICAgICAgICAgIERlY29yYXRvci5ub2RlRm9yRXJyb3IoZGVjb3JhdG9yKSwgcHJvcGVydHksXG4gICAgICAgICAgICAgIGBAJHtkZWNvcmF0b3IubmFtZX0gZGVjb3JhdG9yIGFyZ3VtZW50IG11c3QgcmVzb2x2ZSB0byBhIHN0cmluZ2ApO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHNbZmllbGROYW1lXSA9IG1hcFZhbHVlUmVzb2x2ZXIocHJvcGVydHksIGZpZWxkTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUb28gbWFueSBhcmd1bWVudHMuXG4gICAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICAgIEVycm9yQ29kZS5ERUNPUkFUT1JfQVJJVFlfV1JPTkcsIERlY29yYXRvci5ub2RlRm9yRXJyb3IoZGVjb3JhdG9yKSxcbiAgICAgICAgICAgIGBAJHtkZWNvcmF0b3IubmFtZX0gY2FuIGhhdmUgYXQgbW9zdCBvbmUgYXJndW1lbnQsIGdvdCAke1xuICAgICAgICAgICAgICAgIGRlY29yYXRvci5hcmdzLmxlbmd0aH0gYXJndW1lbnQocylgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfSwge30gYXMge1tmaWVsZDogc3RyaW5nXTogc3RyaW5nIHwgW3N0cmluZywgc3RyaW5nXX0pO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlSW5wdXQocHVibGljTmFtZTogc3RyaW5nLCBpbnRlcm5hbE5hbWU6IHN0cmluZyk6IFtzdHJpbmcsIHN0cmluZ10ge1xuICByZXR1cm4gW3B1YmxpY05hbWUsIGludGVybmFsTmFtZV07XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVPdXRwdXQocHVibGljTmFtZTogc3RyaW5nLCBpbnRlcm5hbE5hbWU6IHN0cmluZykge1xuICByZXR1cm4gcHVibGljTmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHF1ZXJpZXNGcm9tRmllbGRzKFxuICAgIGZpZWxkczoge21lbWJlcjogQ2xhc3NNZW1iZXIsIGRlY29yYXRvcnM6IERlY29yYXRvcltdfVtdLCByZWZsZWN0b3I6IFJlZmxlY3Rpb25Ib3N0LFxuICAgIGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvcik6IFIzUXVlcnlNZXRhZGF0YVtdIHtcbiAgcmV0dXJuIGZpZWxkcy5tYXAoKHttZW1iZXIsIGRlY29yYXRvcnN9KSA9PiB7XG4gICAgY29uc3QgZGVjb3JhdG9yID0gZGVjb3JhdG9yc1swXTtcbiAgICBjb25zdCBub2RlID0gbWVtYmVyLm5vZGUgfHwgRGVjb3JhdG9yLm5vZGVGb3JFcnJvcihkZWNvcmF0b3IpO1xuXG4gICAgLy8gVGhyb3cgaW4gY2FzZSBvZiBgQElucHV0KCkgQENvbnRlbnRDaGlsZCgnZm9vJykgZm9vOiBhbnlgLCB3aGljaCBpcyBub3Qgc3VwcG9ydGVkIGluIEl2eVxuICAgIGlmIChtZW1iZXIuZGVjb3JhdG9ycyEuc29tZSh2ID0+IHYubmFtZSA9PT0gJ0lucHV0JykpIHtcbiAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX0NPTExJU0lPTiwgbm9kZSxcbiAgICAgICAgICAnQ2Fubm90IGNvbWJpbmUgQElucHV0IGRlY29yYXRvcnMgd2l0aCBxdWVyeSBkZWNvcmF0b3JzJyk7XG4gICAgfVxuICAgIGlmIChkZWNvcmF0b3JzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICAgIEVycm9yQ29kZS5ERUNPUkFUT1JfQ09MTElTSU9OLCBub2RlLFxuICAgICAgICAgICdDYW5ub3QgaGF2ZSBtdWx0aXBsZSBxdWVyeSBkZWNvcmF0b3JzIG9uIHRoZSBzYW1lIGNsYXNzIG1lbWJlcicpO1xuICAgIH0gZWxzZSBpZiAoIWlzUHJvcGVydHlUeXBlTWVtYmVyKG1lbWJlcikpIHtcbiAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX1VORVhQRUNURUQsIG5vZGUsXG4gICAgICAgICAgJ1F1ZXJ5IGRlY29yYXRvciBtdXN0IGdvIG9uIGEgcHJvcGVydHktdHlwZSBtZW1iZXInKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4dHJhY3RRdWVyeU1ldGFkYXRhKFxuICAgICAgICBub2RlLCBkZWNvcmF0b3IubmFtZSwgZGVjb3JhdG9yLmFyZ3MgfHwgW10sIG1lbWJlci5uYW1lLCByZWZsZWN0b3IsIGV2YWx1YXRvcik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpc1Byb3BlcnR5VHlwZU1lbWJlcihtZW1iZXI6IENsYXNzTWVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBtZW1iZXIua2luZCA9PT0gQ2xhc3NNZW1iZXJLaW5kLkdldHRlciB8fCBtZW1iZXIua2luZCA9PT0gQ2xhc3NNZW1iZXJLaW5kLlNldHRlciB8fFxuICAgICAgbWVtYmVyLmtpbmQgPT09IENsYXNzTWVtYmVyS2luZC5Qcm9wZXJ0eTtcbn1cblxudHlwZSBTdHJpbmdNYXA8VD4gPSB7XG4gIFtrZXk6IHN0cmluZ106IFQ7XG59O1xuXG5mdW5jdGlvbiBldmFsdWF0ZUhvc3RFeHByZXNzaW9uQmluZGluZ3MoXG4gICAgaG9zdEV4cHI6IHRzLkV4cHJlc3Npb24sIGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvcik6IFBhcnNlZEhvc3RCaW5kaW5ncyB7XG4gIGNvbnN0IGhvc3RNZXRhTWFwID0gZXZhbHVhdG9yLmV2YWx1YXRlKGhvc3RFeHByKTtcbiAgaWYgKCEoaG9zdE1ldGFNYXAgaW5zdGFuY2VvZiBNYXApKSB7XG4gICAgdGhyb3cgY3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvcihcbiAgICAgICAgaG9zdEV4cHIsIGhvc3RNZXRhTWFwLCBgRGVjb3JhdG9yIGhvc3QgbWV0YWRhdGEgbXVzdCBiZSBhbiBvYmplY3RgKTtcbiAgfVxuICBjb25zdCBob3N0TWV0YWRhdGE6IFN0cmluZ01hcDxzdHJpbmd8RXhwcmVzc2lvbj4gPSB7fTtcbiAgaG9zdE1ldGFNYXAuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgIC8vIFJlc29sdmUgRW51bSByZWZlcmVuY2VzIHRvIHRoZWlyIGRlY2xhcmVkIHZhbHVlLlxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVudW1WYWx1ZSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXNvbHZlZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IGNyZWF0ZVZhbHVlSGFzV3JvbmdUeXBlRXJyb3IoXG4gICAgICAgICAgaG9zdEV4cHIsIGtleSxcbiAgICAgICAgICBgRGVjb3JhdG9yIGhvc3QgbWV0YWRhdGEgbXVzdCBiZSBhIHN0cmluZyAtPiBzdHJpbmcgb2JqZWN0LCBidXQgZm91bmQgdW5wYXJzZWFibGUga2V5YCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgICAgaG9zdE1ldGFkYXRhW2tleV0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICBob3N0TWV0YWRhdGFba2V5XSA9IG5ldyBXcmFwcGVkTm9kZUV4cHIodmFsdWUubm9kZSBhcyB0cy5FeHByZXNzaW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgY3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvcihcbiAgICAgICAgICBob3N0RXhwciwgdmFsdWUsXG4gICAgICAgICAgYERlY29yYXRvciBob3N0IG1ldGFkYXRhIG11c3QgYmUgYSBzdHJpbmcgLT4gc3RyaW5nIG9iamVjdCwgYnV0IGZvdW5kIHVucGFyc2VhYmxlIHZhbHVlYCk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBiaW5kaW5ncyA9IHBhcnNlSG9zdEJpbmRpbmdzKGhvc3RNZXRhZGF0YSk7XG5cbiAgY29uc3QgZXJyb3JzID0gdmVyaWZ5SG9zdEJpbmRpbmdzKGJpbmRpbmdzLCBjcmVhdGVTb3VyY2VTcGFuKGhvc3RFeHByKSk7XG4gIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgLy8gVE9ETzogcHJvdmlkZSBtb3JlIGdyYW51bGFyIGRpYWdub3N0aWMgYW5kIG91dHB1dCBzcGVjaWZpYyBob3N0IGV4cHJlc3Npb24gdGhhdFxuICAgICAgICAvLyB0cmlnZ2VyZWQgYW4gZXJyb3IgaW5zdGVhZCBvZiB0aGUgd2hvbGUgaG9zdCBvYmplY3QuXG4gICAgICAgIEVycm9yQ29kZS5IT1NUX0JJTkRJTkdfUEFSU0VfRVJST1IsIGhvc3RFeHByLFxuICAgICAgICBlcnJvcnMubWFwKChlcnJvcjogUGFyc2VFcnJvcikgPT4gZXJyb3IubXNnKS5qb2luKCdcXG4nKSk7XG4gIH1cblxuICByZXR1cm4gYmluZGluZ3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0SG9zdEJpbmRpbmdzKFxuICAgIG1lbWJlcnM6IENsYXNzTWVtYmVyW10sIGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvciwgY29yZU1vZHVsZTogc3RyaW5nfHVuZGVmaW5lZCxcbiAgICBtZXRhZGF0YT86IE1hcDxzdHJpbmcsIHRzLkV4cHJlc3Npb24+KTogUGFyc2VkSG9zdEJpbmRpbmdzIHtcbiAgbGV0IGJpbmRpbmdzOiBQYXJzZWRIb3N0QmluZGluZ3M7XG4gIGlmIChtZXRhZGF0YSAmJiBtZXRhZGF0YS5oYXMoJ2hvc3QnKSkge1xuICAgIGJpbmRpbmdzID0gZXZhbHVhdGVIb3N0RXhwcmVzc2lvbkJpbmRpbmdzKG1ldGFkYXRhLmdldCgnaG9zdCcpISwgZXZhbHVhdG9yKTtcbiAgfSBlbHNlIHtcbiAgICBiaW5kaW5ncyA9IHBhcnNlSG9zdEJpbmRpbmdzKHt9KTtcbiAgfVxuXG4gIGZpbHRlclRvTWVtYmVyc1dpdGhEZWNvcmF0b3IobWVtYmVycywgJ0hvc3RCaW5kaW5nJywgY29yZU1vZHVsZSlcbiAgICAgIC5mb3JFYWNoKCh7bWVtYmVyLCBkZWNvcmF0b3JzfSkgPT4ge1xuICAgICAgICBkZWNvcmF0b3JzLmZvckVhY2goZGVjb3JhdG9yID0+IHtcbiAgICAgICAgICBsZXQgaG9zdFByb3BlcnR5TmFtZTogc3RyaW5nID0gbWVtYmVyLm5hbWU7XG4gICAgICAgICAgaWYgKGRlY29yYXRvci5hcmdzICE9PSBudWxsICYmIGRlY29yYXRvci5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChkZWNvcmF0b3IuYXJncy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICAgICAgICAgICAgRXJyb3JDb2RlLkRFQ09SQVRPUl9BUklUWV9XUk9ORywgRGVjb3JhdG9yLm5vZGVGb3JFcnJvcihkZWNvcmF0b3IpLFxuICAgICAgICAgICAgICAgICAgYEBIb3N0QmluZGluZyBjYW4gaGF2ZSBhdCBtb3N0IG9uZSBhcmd1bWVudCwgZ290ICR7XG4gICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdG9yLmFyZ3MubGVuZ3RofSBhcmd1bWVudChzKWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXNvbHZlZCA9IGV2YWx1YXRvci5ldmFsdWF0ZShkZWNvcmF0b3IuYXJnc1swXSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc29sdmVkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICB0aHJvdyBjcmVhdGVWYWx1ZUhhc1dyb25nVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgICAgRGVjb3JhdG9yLm5vZGVGb3JFcnJvcihkZWNvcmF0b3IpLCByZXNvbHZlZCxcbiAgICAgICAgICAgICAgICAgIGBASG9zdEJpbmRpbmcncyBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhvc3RQcm9wZXJ0eU5hbWUgPSByZXNvbHZlZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBTaW5jZSB0aGlzIGlzIGEgZGVjb3JhdG9yLCB3ZSBrbm93IHRoYXQgdGhlIHZhbHVlIGlzIGEgY2xhc3MgbWVtYmVyLiBBbHdheXMgYWNjZXNzIGl0XG4gICAgICAgICAgLy8gdGhyb3VnaCBgdGhpc2Agc28gdGhhdCBmdXJ0aGVyIGRvd24gdGhlIGxpbmUgaXQgY2FuJ3QgYmUgY29uZnVzZWQgZm9yIGEgbGl0ZXJhbCB2YWx1ZVxuICAgICAgICAgIC8vIChlLmcuIGlmIHRoZXJlJ3MgYSBwcm9wZXJ0eSBjYWxsZWQgYHRydWVgKS4gVGhlcmUgaXMgbm8gc2l6ZSBwZW5hbHR5LCBiZWNhdXNlIGFsbFxuICAgICAgICAgIC8vIHZhbHVlcyAoZXhjZXB0IGxpdGVyYWxzKSBhcmUgY29udmVydGVkIHRvIGBjdHgucHJvcE5hbWVgIGV2ZW50dWFsbHkuXG4gICAgICAgICAgYmluZGluZ3MucHJvcGVydGllc1tob3N0UHJvcGVydHlOYW1lXSA9IGdldFNhZmVQcm9wZXJ0eUFjY2Vzc1N0cmluZygndGhpcycsIG1lbWJlci5uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICBmaWx0ZXJUb01lbWJlcnNXaXRoRGVjb3JhdG9yKG1lbWJlcnMsICdIb3N0TGlzdGVuZXInLCBjb3JlTW9kdWxlKVxuICAgICAgLmZvckVhY2goKHttZW1iZXIsIGRlY29yYXRvcnN9KSA9PiB7XG4gICAgICAgIGRlY29yYXRvcnMuZm9yRWFjaChkZWNvcmF0b3IgPT4ge1xuICAgICAgICAgIGxldCBldmVudE5hbWU6IHN0cmluZyA9IG1lbWJlci5uYW1lO1xuICAgICAgICAgIGxldCBhcmdzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgIGlmIChkZWNvcmF0b3IuYXJncyAhPT0gbnVsbCAmJiBkZWNvcmF0b3IuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoZGVjb3JhdG9yLmFyZ3MubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgICAgICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX0FSSVRZX1dST05HLCBkZWNvcmF0b3IuYXJnc1syXSxcbiAgICAgICAgICAgICAgICAgIGBASG9zdExpc3RlbmVyIGNhbiBoYXZlIGF0IG1vc3QgdHdvIGFyZ3VtZW50c2ApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXNvbHZlZCA9IGV2YWx1YXRvci5ldmFsdWF0ZShkZWNvcmF0b3IuYXJnc1swXSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc29sdmVkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICB0aHJvdyBjcmVhdGVWYWx1ZUhhc1dyb25nVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgICAgZGVjb3JhdG9yLmFyZ3NbMF0sIHJlc29sdmVkLFxuICAgICAgICAgICAgICAgICAgYEBIb3N0TGlzdGVuZXIncyBldmVudCBuYW1lIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmdgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXZlbnROYW1lID0gcmVzb2x2ZWQ7XG5cbiAgICAgICAgICAgIGlmIChkZWNvcmF0b3IuYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IGRlY29yYXRvci5hcmdzWzFdO1xuICAgICAgICAgICAgICBjb25zdCByZXNvbHZlZEFyZ3MgPSBldmFsdWF0b3IuZXZhbHVhdGUoZGVjb3JhdG9yLmFyZ3NbMV0pO1xuICAgICAgICAgICAgICBpZiAoIWlzU3RyaW5nQXJyYXlPckRpZShyZXNvbHZlZEFyZ3MsICdASG9zdExpc3RlbmVyLmFyZ3MnLCBleHByZXNzaW9uKSkge1xuICAgICAgICAgICAgICAgIHRocm93IGNyZWF0ZVZhbHVlSGFzV3JvbmdUeXBlRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGRlY29yYXRvci5hcmdzWzFdLCByZXNvbHZlZEFyZ3MsXG4gICAgICAgICAgICAgICAgICAgIGBASG9zdExpc3RlbmVyJ3Mgc2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcgYXJyYXlgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhcmdzID0gcmVzb2x2ZWRBcmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGJpbmRpbmdzLmxpc3RlbmVyc1tldmVudE5hbWVdID0gYCR7bWVtYmVyLm5hbWV9KCR7YXJncy5qb2luKCcsJyl9KWA7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIHJldHVybiBiaW5kaW5ncztcbn1cblxuY29uc3QgUVVFUllfVFlQRVMgPSBuZXcgU2V0KFtcbiAgJ0NvbnRlbnRDaGlsZCcsXG4gICdDb250ZW50Q2hpbGRyZW4nLFxuICAnVmlld0NoaWxkJyxcbiAgJ1ZpZXdDaGlsZHJlbicsXG5dKTtcbiJdfQ==