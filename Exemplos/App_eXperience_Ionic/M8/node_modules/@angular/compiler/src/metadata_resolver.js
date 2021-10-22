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
        define("@angular/compiler/src/metadata_resolver", ["require", "exports", "tslib", "@angular/compiler/src/aot/static_symbol", "@angular/compiler/src/aot/util", "@angular/compiler/src/assertions", "@angular/compiler/src/compile_metadata", "@angular/compiler/src/core", "@angular/compiler/src/directive_resolver", "@angular/compiler/src/identifiers", "@angular/compiler/src/lifecycle_reflector", "@angular/compiler/src/selector", "@angular/compiler/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CompileMetadataResolver = exports.getMissingNgModuleMetadataErrorData = exports.ERROR_COMPONENT_TYPE = void 0;
    var tslib_1 = require("tslib");
    var static_symbol_1 = require("@angular/compiler/src/aot/static_symbol");
    var util_1 = require("@angular/compiler/src/aot/util");
    var assertions_1 = require("@angular/compiler/src/assertions");
    var cpl = require("@angular/compiler/src/compile_metadata");
    var core_1 = require("@angular/compiler/src/core");
    var directive_resolver_1 = require("@angular/compiler/src/directive_resolver");
    var identifiers_1 = require("@angular/compiler/src/identifiers");
    var lifecycle_reflector_1 = require("@angular/compiler/src/lifecycle_reflector");
    var selector_1 = require("@angular/compiler/src/selector");
    var util_2 = require("@angular/compiler/src/util");
    exports.ERROR_COMPONENT_TYPE = 'ngComponentType';
    var MISSING_NG_MODULE_METADATA_ERROR_DATA = 'ngMissingNgModuleMetadataErrorData';
    function getMissingNgModuleMetadataErrorData(error) {
        var _a;
        return (_a = error[MISSING_NG_MODULE_METADATA_ERROR_DATA]) !== null && _a !== void 0 ? _a : null;
    }
    exports.getMissingNgModuleMetadataErrorData = getMissingNgModuleMetadataErrorData;
    // Design notes:
    // - don't lazily create metadata:
    //   For some metadata, we need to do async work sometimes,
    //   so the user has to kick off this loading.
    //   But we want to report errors even when the async work is
    //   not required to check that the user would have been able
    //   to wait correctly.
    var CompileMetadataResolver = /** @class */ (function () {
        function CompileMetadataResolver(_config, _htmlParser, _ngModuleResolver, _directiveResolver, _pipeResolver, _summaryResolver, _schemaRegistry, _directiveNormalizer, _console, _staticSymbolCache, _reflector, _errorCollector) {
            this._config = _config;
            this._htmlParser = _htmlParser;
            this._ngModuleResolver = _ngModuleResolver;
            this._directiveResolver = _directiveResolver;
            this._pipeResolver = _pipeResolver;
            this._summaryResolver = _summaryResolver;
            this._schemaRegistry = _schemaRegistry;
            this._directiveNormalizer = _directiveNormalizer;
            this._console = _console;
            this._staticSymbolCache = _staticSymbolCache;
            this._reflector = _reflector;
            this._errorCollector = _errorCollector;
            this._nonNormalizedDirectiveCache = new Map();
            this._directiveCache = new Map();
            this._summaryCache = new Map();
            this._pipeCache = new Map();
            this._ngModuleCache = new Map();
            this._ngModuleOfTypes = new Map();
            this._shallowModuleCache = new Map();
        }
        CompileMetadataResolver.prototype.getReflector = function () {
            return this._reflector;
        };
        CompileMetadataResolver.prototype.clearCacheFor = function (type) {
            var dirMeta = this._directiveCache.get(type);
            this._directiveCache.delete(type);
            this._nonNormalizedDirectiveCache.delete(type);
            this._summaryCache.delete(type);
            this._pipeCache.delete(type);
            this._ngModuleOfTypes.delete(type);
            // Clear all of the NgModule as they contain transitive information!
            this._ngModuleCache.clear();
            if (dirMeta) {
                this._directiveNormalizer.clearCacheFor(dirMeta);
            }
        };
        CompileMetadataResolver.prototype.clearCache = function () {
            this._directiveCache.clear();
            this._nonNormalizedDirectiveCache.clear();
            this._summaryCache.clear();
            this._pipeCache.clear();
            this._ngModuleCache.clear();
            this._ngModuleOfTypes.clear();
            this._directiveNormalizer.clearCache();
        };
        CompileMetadataResolver.prototype._createProxyClass = function (baseType, name) {
            var delegate = null;
            var proxyClass = function () {
                if (!delegate) {
                    throw new Error("Illegal state: Class " + name + " for type " + util_2.stringify(baseType) + " is not compiled yet!");
                }
                return delegate.apply(this, arguments);
            };
            proxyClass.setDelegate = function (d) {
                delegate = d;
                proxyClass.prototype = d.prototype;
            };
            // Make stringify work correctly
            proxyClass.overriddenName = name;
            return proxyClass;
        };
        CompileMetadataResolver.prototype.getGeneratedClass = function (dirType, name) {
            if (dirType instanceof static_symbol_1.StaticSymbol) {
                return this._staticSymbolCache.get(util_1.ngfactoryFilePath(dirType.filePath), name);
            }
            else {
                return this._createProxyClass(dirType, name);
            }
        };
        CompileMetadataResolver.prototype.getComponentViewClass = function (dirType) {
            return this.getGeneratedClass(dirType, cpl.viewClassName(dirType, 0));
        };
        CompileMetadataResolver.prototype.getHostComponentViewClass = function (dirType) {
            return this.getGeneratedClass(dirType, cpl.hostViewClassName(dirType));
        };
        CompileMetadataResolver.prototype.getHostComponentType = function (dirType) {
            var name = cpl.identifierName({ reference: dirType }) + "_Host";
            if (dirType instanceof static_symbol_1.StaticSymbol) {
                return this._staticSymbolCache.get(dirType.filePath, name);
            }
            return this._createProxyClass(dirType, name);
        };
        CompileMetadataResolver.prototype.getRendererType = function (dirType) {
            if (dirType instanceof static_symbol_1.StaticSymbol) {
                return this._staticSymbolCache.get(util_1.ngfactoryFilePath(dirType.filePath), cpl.rendererTypeName(dirType));
            }
            else {
                // returning an object as proxy,
                // that we fill later during runtime compilation.
                return {};
            }
        };
        CompileMetadataResolver.prototype.getComponentFactory = function (selector, dirType, inputs, outputs) {
            if (dirType instanceof static_symbol_1.StaticSymbol) {
                return this._staticSymbolCache.get(util_1.ngfactoryFilePath(dirType.filePath), cpl.componentFactoryName(dirType));
            }
            else {
                var hostView = this.getHostComponentViewClass(dirType);
                // Note: ngContentSelectors will be filled later once the template is
                // loaded.
                var createComponentFactory = this._reflector.resolveExternalReference(identifiers_1.Identifiers.createComponentFactory);
                return createComponentFactory(selector, dirType, hostView, inputs, outputs, []);
            }
        };
        CompileMetadataResolver.prototype.initComponentFactory = function (factory, ngContentSelectors) {
            var _a;
            if (!(factory instanceof static_symbol_1.StaticSymbol)) {
                (_a = factory.ngContentSelectors).push.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(ngContentSelectors)));
            }
        };
        CompileMetadataResolver.prototype._loadSummary = function (type, kind) {
            var typeSummary = this._summaryCache.get(type);
            if (!typeSummary) {
                var summary = this._summaryResolver.resolveSummary(type);
                typeSummary = summary ? summary.type : null;
                this._summaryCache.set(type, typeSummary || null);
            }
            return typeSummary && typeSummary.summaryKind === kind ? typeSummary : null;
        };
        CompileMetadataResolver.prototype.getHostComponentMetadata = function (compMeta, hostViewType) {
            var hostType = this.getHostComponentType(compMeta.type.reference);
            if (!hostViewType) {
                hostViewType = this.getHostComponentViewClass(hostType);
            }
            // Note: ! is ok here as this method should only be called with normalized directive
            // metadata, which always fills in the selector.
            var template = selector_1.CssSelector.parse(compMeta.selector)[0].getMatchingElementTemplate();
            var templateUrl = '';
            var htmlAst = this._htmlParser.parse(template, templateUrl);
            return cpl.CompileDirectiveMetadata.create({
                isHost: true,
                type: { reference: hostType, diDeps: [], lifecycleHooks: [] },
                template: new cpl.CompileTemplateMetadata({
                    encapsulation: core_1.ViewEncapsulation.None,
                    template: template,
                    templateUrl: templateUrl,
                    htmlAst: htmlAst,
                    styles: [],
                    styleUrls: [],
                    ngContentSelectors: [],
                    animations: [],
                    isInline: true,
                    externalStylesheets: [],
                    interpolation: null,
                    preserveWhitespaces: false,
                }),
                exportAs: null,
                changeDetection: core_1.ChangeDetectionStrategy.Default,
                inputs: [],
                outputs: [],
                host: {},
                isComponent: true,
                selector: '*',
                providers: [],
                viewProviders: [],
                queries: [],
                guards: {},
                viewQueries: [],
                componentViewType: hostViewType,
                rendererType: { id: '__Host__', encapsulation: core_1.ViewEncapsulation.None, styles: [], data: {} },
                entryComponents: [],
                componentFactory: null
            });
        };
        CompileMetadataResolver.prototype.loadDirectiveMetadata = function (ngModuleType, directiveType, isSync) {
            var _this = this;
            if (this._directiveCache.has(directiveType)) {
                return null;
            }
            directiveType = util_2.resolveForwardRef(directiveType);
            var _a = this.getNonNormalizedDirectiveMetadata(directiveType), annotation = _a.annotation, metadata = _a.metadata;
            var createDirectiveMetadata = function (templateMetadata) {
                var normalizedDirMeta = new cpl.CompileDirectiveMetadata({
                    isHost: false,
                    type: metadata.type,
                    isComponent: metadata.isComponent,
                    selector: metadata.selector,
                    exportAs: metadata.exportAs,
                    changeDetection: metadata.changeDetection,
                    inputs: metadata.inputs,
                    outputs: metadata.outputs,
                    hostListeners: metadata.hostListeners,
                    hostProperties: metadata.hostProperties,
                    hostAttributes: metadata.hostAttributes,
                    providers: metadata.providers,
                    viewProviders: metadata.viewProviders,
                    queries: metadata.queries,
                    guards: metadata.guards,
                    viewQueries: metadata.viewQueries,
                    entryComponents: metadata.entryComponents,
                    componentViewType: metadata.componentViewType,
                    rendererType: metadata.rendererType,
                    componentFactory: metadata.componentFactory,
                    template: templateMetadata
                });
                if (templateMetadata) {
                    _this.initComponentFactory(metadata.componentFactory, templateMetadata.ngContentSelectors);
                }
                _this._directiveCache.set(directiveType, normalizedDirMeta);
                _this._summaryCache.set(directiveType, normalizedDirMeta.toSummary());
                return null;
            };
            if (metadata.isComponent) {
                var template = metadata.template;
                var templateMeta = this._directiveNormalizer.normalizeTemplate({
                    ngModuleType: ngModuleType,
                    componentType: directiveType,
                    moduleUrl: this._reflector.componentModuleUrl(directiveType, annotation),
                    encapsulation: template.encapsulation,
                    template: template.template,
                    templateUrl: template.templateUrl,
                    styles: template.styles,
                    styleUrls: template.styleUrls,
                    animations: template.animations,
                    interpolation: template.interpolation,
                    preserveWhitespaces: template.preserveWhitespaces
                });
                if (util_2.isPromise(templateMeta) && isSync) {
                    this._reportError(componentStillLoadingError(directiveType), directiveType);
                    return null;
                }
                return util_2.SyncAsync.then(templateMeta, createDirectiveMetadata);
            }
            else {
                // directive
                createDirectiveMetadata(null);
                return null;
            }
        };
        CompileMetadataResolver.prototype.getNonNormalizedDirectiveMetadata = function (directiveType) {
            var _this = this;
            directiveType = util_2.resolveForwardRef(directiveType);
            if (!directiveType) {
                return null;
            }
            var cacheEntry = this._nonNormalizedDirectiveCache.get(directiveType);
            if (cacheEntry) {
                return cacheEntry;
            }
            var dirMeta = this._directiveResolver.resolve(directiveType, false);
            if (!dirMeta) {
                return null;
            }
            var nonNormalizedTemplateMetadata = undefined;
            if (core_1.createComponent.isTypeOf(dirMeta)) {
                // component
                var compMeta = dirMeta;
                assertions_1.assertArrayOfStrings('styles', compMeta.styles);
                assertions_1.assertArrayOfStrings('styleUrls', compMeta.styleUrls);
                assertions_1.assertInterpolationSymbols('interpolation', compMeta.interpolation);
                var animations = compMeta.animations;
                nonNormalizedTemplateMetadata = new cpl.CompileTemplateMetadata({
                    encapsulation: util_2.noUndefined(compMeta.encapsulation),
                    template: util_2.noUndefined(compMeta.template),
                    templateUrl: util_2.noUndefined(compMeta.templateUrl),
                    htmlAst: null,
                    styles: compMeta.styles || [],
                    styleUrls: compMeta.styleUrls || [],
                    animations: animations || [],
                    interpolation: util_2.noUndefined(compMeta.interpolation),
                    isInline: !!compMeta.template,
                    externalStylesheets: [],
                    ngContentSelectors: [],
                    preserveWhitespaces: util_2.noUndefined(dirMeta.preserveWhitespaces),
                });
            }
            var changeDetectionStrategy = null;
            var viewProviders = [];
            var entryComponentMetadata = [];
            var selector = dirMeta.selector;
            if (core_1.createComponent.isTypeOf(dirMeta)) {
                // Component
                var compMeta = dirMeta;
                changeDetectionStrategy = compMeta.changeDetection;
                if (compMeta.viewProviders) {
                    viewProviders = this._getProvidersMetadata(compMeta.viewProviders, entryComponentMetadata, "viewProviders for \"" + stringifyType(directiveType) + "\"", [], directiveType);
                }
                if (compMeta.entryComponents) {
                    entryComponentMetadata = flattenAndDedupeArray(compMeta.entryComponents)
                        .map(function (type) { return _this._getEntryComponentMetadata(type); })
                        .concat(entryComponentMetadata);
                }
                if (!selector) {
                    selector = this._schemaRegistry.getDefaultComponentElementName();
                }
            }
            else {
                // Directive
                if (!selector) {
                    selector = null;
                }
            }
            var providers = [];
            if (dirMeta.providers != null) {
                providers = this._getProvidersMetadata(dirMeta.providers, entryComponentMetadata, "providers for \"" + stringifyType(directiveType) + "\"", [], directiveType);
            }
            var queries = [];
            var viewQueries = [];
            if (dirMeta.queries != null) {
                queries = this._getQueriesMetadata(dirMeta.queries, false, directiveType);
                viewQueries = this._getQueriesMetadata(dirMeta.queries, true, directiveType);
            }
            var metadata = cpl.CompileDirectiveMetadata.create({
                isHost: false,
                selector: selector,
                exportAs: util_2.noUndefined(dirMeta.exportAs),
                isComponent: !!nonNormalizedTemplateMetadata,
                type: this._getTypeMetadata(directiveType),
                template: nonNormalizedTemplateMetadata,
                changeDetection: changeDetectionStrategy,
                inputs: dirMeta.inputs || [],
                outputs: dirMeta.outputs || [],
                host: dirMeta.host || {},
                providers: providers || [],
                viewProviders: viewProviders || [],
                queries: queries || [],
                guards: dirMeta.guards || {},
                viewQueries: viewQueries || [],
                entryComponents: entryComponentMetadata,
                componentViewType: nonNormalizedTemplateMetadata ? this.getComponentViewClass(directiveType) :
                    null,
                rendererType: nonNormalizedTemplateMetadata ? this.getRendererType(directiveType) : null,
                componentFactory: null
            });
            if (nonNormalizedTemplateMetadata) {
                metadata.componentFactory =
                    this.getComponentFactory(selector, directiveType, metadata.inputs, metadata.outputs);
            }
            cacheEntry = { metadata: metadata, annotation: dirMeta };
            this._nonNormalizedDirectiveCache.set(directiveType, cacheEntry);
            return cacheEntry;
        };
        /**
         * Gets the metadata for the given directive.
         * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
         */
        CompileMetadataResolver.prototype.getDirectiveMetadata = function (directiveType) {
            var dirMeta = this._directiveCache.get(directiveType);
            if (!dirMeta) {
                this._reportError(util_2.syntaxError("Illegal state: getDirectiveMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Directive " + stringifyType(directiveType) + "."), directiveType);
            }
            return dirMeta;
        };
        CompileMetadataResolver.prototype.getDirectiveSummary = function (dirType) {
            var dirSummary = this._loadSummary(dirType, cpl.CompileSummaryKind.Directive);
            if (!dirSummary) {
                this._reportError(util_2.syntaxError("Illegal state: Could not load the summary for directive " + stringifyType(dirType) + "."), dirType);
            }
            return dirSummary;
        };
        CompileMetadataResolver.prototype.isDirective = function (type) {
            return !!this._loadSummary(type, cpl.CompileSummaryKind.Directive) ||
                this._directiveResolver.isDirective(type);
        };
        CompileMetadataResolver.prototype.isAbstractDirective = function (type) {
            var summary = this._loadSummary(type, cpl.CompileSummaryKind.Directive);
            if (summary && !summary.isComponent) {
                return !summary.selector;
            }
            var meta = this._directiveResolver.resolve(type, false);
            if (meta && !core_1.createComponent.isTypeOf(meta)) {
                return !meta.selector;
            }
            return false;
        };
        CompileMetadataResolver.prototype.isPipe = function (type) {
            return !!this._loadSummary(type, cpl.CompileSummaryKind.Pipe) ||
                this._pipeResolver.isPipe(type);
        };
        CompileMetadataResolver.prototype.isNgModule = function (type) {
            return !!this._loadSummary(type, cpl.CompileSummaryKind.NgModule) ||
                this._ngModuleResolver.isNgModule(type);
        };
        CompileMetadataResolver.prototype.getNgModuleSummary = function (moduleType, alreadyCollecting) {
            if (alreadyCollecting === void 0) { alreadyCollecting = null; }
            var moduleSummary = this._loadSummary(moduleType, cpl.CompileSummaryKind.NgModule);
            if (!moduleSummary) {
                var moduleMeta = this.getNgModuleMetadata(moduleType, false, alreadyCollecting);
                moduleSummary = moduleMeta ? moduleMeta.toSummary() : null;
                if (moduleSummary) {
                    this._summaryCache.set(moduleType, moduleSummary);
                }
            }
            return moduleSummary;
        };
        /**
         * Loads the declared directives and pipes of an NgModule.
         */
        CompileMetadataResolver.prototype.loadNgModuleDirectiveAndPipeMetadata = function (moduleType, isSync, throwIfNotFound) {
            var _this = this;
            if (throwIfNotFound === void 0) { throwIfNotFound = true; }
            var ngModule = this.getNgModuleMetadata(moduleType, throwIfNotFound);
            var loading = [];
            if (ngModule) {
                ngModule.declaredDirectives.forEach(function (id) {
                    var promise = _this.loadDirectiveMetadata(moduleType, id.reference, isSync);
                    if (promise) {
                        loading.push(promise);
                    }
                });
                ngModule.declaredPipes.forEach(function (id) { return _this._loadPipeMetadata(id.reference); });
            }
            return Promise.all(loading);
        };
        CompileMetadataResolver.prototype.getShallowModuleMetadata = function (moduleType) {
            var compileMeta = this._shallowModuleCache.get(moduleType);
            if (compileMeta) {
                return compileMeta;
            }
            var ngModuleMeta = directive_resolver_1.findLast(this._reflector.shallowAnnotations(moduleType), core_1.createNgModule.isTypeOf);
            compileMeta = {
                type: this._getTypeMetadata(moduleType),
                rawExports: ngModuleMeta.exports,
                rawImports: ngModuleMeta.imports,
                rawProviders: ngModuleMeta.providers,
            };
            this._shallowModuleCache.set(moduleType, compileMeta);
            return compileMeta;
        };
        CompileMetadataResolver.prototype.getNgModuleMetadata = function (moduleType, throwIfNotFound, alreadyCollecting) {
            var _this = this;
            if (throwIfNotFound === void 0) { throwIfNotFound = true; }
            if (alreadyCollecting === void 0) { alreadyCollecting = null; }
            moduleType = util_2.resolveForwardRef(moduleType);
            var compileMeta = this._ngModuleCache.get(moduleType);
            if (compileMeta) {
                return compileMeta;
            }
            var meta = this._ngModuleResolver.resolve(moduleType, throwIfNotFound);
            if (!meta) {
                return null;
            }
            var declaredDirectives = [];
            var exportedNonModuleIdentifiers = [];
            var declaredPipes = [];
            var importedModules = [];
            var exportedModules = [];
            var providers = [];
            var entryComponents = [];
            var bootstrapComponents = [];
            var schemas = [];
            if (meta.imports) {
                flattenAndDedupeArray(meta.imports).forEach(function (importedType) {
                    var importedModuleType = undefined;
                    if (isValidType(importedType)) {
                        importedModuleType = importedType;
                    }
                    else if (importedType && importedType.ngModule) {
                        var moduleWithProviders = importedType;
                        importedModuleType = moduleWithProviders.ngModule;
                        if (moduleWithProviders.providers) {
                            providers.push.apply(providers, tslib_1.__spreadArray([], tslib_1.__read(_this._getProvidersMetadata(moduleWithProviders.providers, entryComponents, "provider for the NgModule '" + stringifyType(importedModuleType) + "'", [], importedType))));
                        }
                    }
                    if (importedModuleType) {
                        if (_this._checkSelfImport(moduleType, importedModuleType))
                            return;
                        if (!alreadyCollecting)
                            alreadyCollecting = new Set();
                        if (alreadyCollecting.has(importedModuleType)) {
                            _this._reportError(util_2.syntaxError(_this._getTypeDescriptor(importedModuleType) + " '" + stringifyType(importedType) + "' is imported recursively by the module '" + stringifyType(moduleType) + "'."), moduleType);
                            return;
                        }
                        alreadyCollecting.add(importedModuleType);
                        var importedModuleSummary = _this.getNgModuleSummary(importedModuleType, alreadyCollecting);
                        alreadyCollecting.delete(importedModuleType);
                        if (!importedModuleSummary) {
                            var err = util_2.syntaxError("Unexpected " + _this._getTypeDescriptor(importedType) + " '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'. Please add a @NgModule annotation.");
                            // If possible, record additional context for this error to enable more useful
                            // diagnostics on the compiler side.
                            if (importedType instanceof static_symbol_1.StaticSymbol) {
                                err[MISSING_NG_MODULE_METADATA_ERROR_DATA] = {
                                    fileName: importedType.filePath,
                                    className: importedType.name,
                                };
                            }
                            _this._reportError(err, moduleType);
                            return;
                        }
                        importedModules.push(importedModuleSummary);
                    }
                    else {
                        _this._reportError(util_2.syntaxError("Unexpected value '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                        return;
                    }
                });
            }
            if (meta.exports) {
                flattenAndDedupeArray(meta.exports).forEach(function (exportedType) {
                    if (!isValidType(exportedType)) {
                        _this._reportError(util_2.syntaxError("Unexpected value '" + stringifyType(exportedType) + "' exported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                        return;
                    }
                    if (!alreadyCollecting)
                        alreadyCollecting = new Set();
                    if (alreadyCollecting.has(exportedType)) {
                        _this._reportError(util_2.syntaxError(_this._getTypeDescriptor(exportedType) + " '" + util_2.stringify(exportedType) + "' is exported recursively by the module '" + stringifyType(moduleType) + "'"), moduleType);
                        return;
                    }
                    alreadyCollecting.add(exportedType);
                    var exportedModuleSummary = _this.getNgModuleSummary(exportedType, alreadyCollecting);
                    alreadyCollecting.delete(exportedType);
                    if (exportedModuleSummary) {
                        exportedModules.push(exportedModuleSummary);
                    }
                    else {
                        exportedNonModuleIdentifiers.push(_this._getIdentifierMetadata(exportedType));
                    }
                });
            }
            // Note: This will be modified later, so we rely on
            // getting a new instance every time!
            var transitiveModule = this._getTransitiveNgModuleMetadata(importedModules, exportedModules);
            if (meta.declarations) {
                flattenAndDedupeArray(meta.declarations).forEach(function (declaredType) {
                    if (!isValidType(declaredType)) {
                        _this._reportError(util_2.syntaxError("Unexpected value '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'"), moduleType);
                        return;
                    }
                    var declaredIdentifier = _this._getIdentifierMetadata(declaredType);
                    if (_this.isDirective(declaredType)) {
                        if (_this.isAbstractDirective(declaredType)) {
                            _this._reportError(util_2.syntaxError("Directive " + stringifyType(declaredType) + " has no selector, please add it!"), declaredType);
                        }
                        transitiveModule.addDirective(declaredIdentifier);
                        declaredDirectives.push(declaredIdentifier);
                        _this._addTypeToModule(declaredType, moduleType);
                    }
                    else if (_this.isPipe(declaredType)) {
                        transitiveModule.addPipe(declaredIdentifier);
                        transitiveModule.pipes.push(declaredIdentifier);
                        declaredPipes.push(declaredIdentifier);
                        _this._addTypeToModule(declaredType, moduleType);
                    }
                    else {
                        _this._reportError(util_2.syntaxError("Unexpected " + _this._getTypeDescriptor(declaredType) + " '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'. Please add a @Pipe/@Directive/@Component annotation."), moduleType);
                        return;
                    }
                });
            }
            var exportedDirectives = [];
            var exportedPipes = [];
            exportedNonModuleIdentifiers.forEach(function (exportedId) {
                if (transitiveModule.directivesSet.has(exportedId.reference)) {
                    exportedDirectives.push(exportedId);
                    transitiveModule.addExportedDirective(exportedId);
                }
                else if (transitiveModule.pipesSet.has(exportedId.reference)) {
                    exportedPipes.push(exportedId);
                    transitiveModule.addExportedPipe(exportedId);
                }
                else {
                    _this._reportError(util_2.syntaxError("Can't export " + _this._getTypeDescriptor(exportedId.reference) + " " + stringifyType(exportedId.reference) + " from " + stringifyType(moduleType) + " as it was neither declared nor imported!"), moduleType);
                    return;
                }
            });
            // The providers of the module have to go last
            // so that they overwrite any other provider we already added.
            if (meta.providers) {
                providers.push.apply(providers, tslib_1.__spreadArray([], tslib_1.__read(this._getProvidersMetadata(meta.providers, entryComponents, "provider for the NgModule '" + stringifyType(moduleType) + "'", [], moduleType))));
            }
            if (meta.entryComponents) {
                entryComponents.push.apply(entryComponents, tslib_1.__spreadArray([], tslib_1.__read(flattenAndDedupeArray(meta.entryComponents)
                    .map(function (type) { return _this._getEntryComponentMetadata(type); }))));
            }
            if (meta.bootstrap) {
                flattenAndDedupeArray(meta.bootstrap).forEach(function (type) {
                    if (!isValidType(type)) {
                        _this._reportError(util_2.syntaxError("Unexpected value '" + stringifyType(type) + "' used in the bootstrap property of module '" + stringifyType(moduleType) + "'"), moduleType);
                        return;
                    }
                    bootstrapComponents.push(_this._getIdentifierMetadata(type));
                });
            }
            entryComponents.push.apply(entryComponents, tslib_1.__spreadArray([], tslib_1.__read(bootstrapComponents.map(function (type) { return _this._getEntryComponentMetadata(type.reference); }))));
            if (meta.schemas) {
                schemas.push.apply(schemas, tslib_1.__spreadArray([], tslib_1.__read(flattenAndDedupeArray(meta.schemas))));
            }
            compileMeta = new cpl.CompileNgModuleMetadata({
                type: this._getTypeMetadata(moduleType),
                providers: providers,
                entryComponents: entryComponents,
                bootstrapComponents: bootstrapComponents,
                schemas: schemas,
                declaredDirectives: declaredDirectives,
                exportedDirectives: exportedDirectives,
                declaredPipes: declaredPipes,
                exportedPipes: exportedPipes,
                importedModules: importedModules,
                exportedModules: exportedModules,
                transitiveModule: transitiveModule,
                id: meta.id || null,
            });
            entryComponents.forEach(function (id) { return transitiveModule.addEntryComponent(id); });
            providers.forEach(function (provider) { return transitiveModule.addProvider(provider, compileMeta.type); });
            transitiveModule.addModule(compileMeta.type);
            this._ngModuleCache.set(moduleType, compileMeta);
            return compileMeta;
        };
        CompileMetadataResolver.prototype._checkSelfImport = function (moduleType, importedModuleType) {
            if (moduleType === importedModuleType) {
                this._reportError(util_2.syntaxError("'" + stringifyType(moduleType) + "' module can't import itself"), moduleType);
                return true;
            }
            return false;
        };
        CompileMetadataResolver.prototype._getTypeDescriptor = function (type) {
            if (isValidType(type)) {
                if (this.isDirective(type)) {
                    return 'directive';
                }
                if (this.isPipe(type)) {
                    return 'pipe';
                }
                if (this.isNgModule(type)) {
                    return 'module';
                }
            }
            if (type.provide) {
                return 'provider';
            }
            return 'value';
        };
        CompileMetadataResolver.prototype._addTypeToModule = function (type, moduleType) {
            var oldModule = this._ngModuleOfTypes.get(type);
            if (oldModule && oldModule !== moduleType) {
                this._reportError(util_2.syntaxError("Type " + stringifyType(type) + " is part of the declarations of 2 modules: " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + "! " +
                    ("Please consider moving " + stringifyType(type) + " to a higher module that imports " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ". ") +
                    ("You can also create a new NgModule that exports and includes " + stringifyType(type) + " then import that NgModule in " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ".")), moduleType);
                return;
            }
            this._ngModuleOfTypes.set(type, moduleType);
        };
        CompileMetadataResolver.prototype._getTransitiveNgModuleMetadata = function (importedModules, exportedModules) {
            // collect `providers` / `entryComponents` from all imported and all exported modules
            var result = new cpl.TransitiveCompileNgModuleMetadata();
            var modulesByToken = new Map();
            importedModules.concat(exportedModules).forEach(function (modSummary) {
                modSummary.modules.forEach(function (mod) { return result.addModule(mod); });
                modSummary.entryComponents.forEach(function (comp) { return result.addEntryComponent(comp); });
                var addedTokens = new Set();
                modSummary.providers.forEach(function (entry) {
                    var tokenRef = cpl.tokenReference(entry.provider.token);
                    var prevModules = modulesByToken.get(tokenRef);
                    if (!prevModules) {
                        prevModules = new Set();
                        modulesByToken.set(tokenRef, prevModules);
                    }
                    var moduleRef = entry.module.reference;
                    // Note: the providers of one module may still contain multiple providers
                    // per token (e.g. for multi providers), and we need to preserve these.
                    if (addedTokens.has(tokenRef) || !prevModules.has(moduleRef)) {
                        prevModules.add(moduleRef);
                        addedTokens.add(tokenRef);
                        result.addProvider(entry.provider, entry.module);
                    }
                });
            });
            exportedModules.forEach(function (modSummary) {
                modSummary.exportedDirectives.forEach(function (id) { return result.addExportedDirective(id); });
                modSummary.exportedPipes.forEach(function (id) { return result.addExportedPipe(id); });
            });
            importedModules.forEach(function (modSummary) {
                modSummary.exportedDirectives.forEach(function (id) { return result.addDirective(id); });
                modSummary.exportedPipes.forEach(function (id) { return result.addPipe(id); });
            });
            return result;
        };
        CompileMetadataResolver.prototype._getIdentifierMetadata = function (type) {
            type = util_2.resolveForwardRef(type);
            return { reference: type };
        };
        CompileMetadataResolver.prototype.isInjectable = function (type) {
            var annotations = this._reflector.tryAnnotations(type);
            return annotations.some(function (ann) { return core_1.createInjectable.isTypeOf(ann); });
        };
        CompileMetadataResolver.prototype.getInjectableSummary = function (type) {
            return {
                summaryKind: cpl.CompileSummaryKind.Injectable,
                type: this._getTypeMetadata(type, null, false)
            };
        };
        CompileMetadataResolver.prototype.getInjectableMetadata = function (type, dependencies, throwOnUnknownDeps) {
            if (dependencies === void 0) { dependencies = null; }
            if (throwOnUnknownDeps === void 0) { throwOnUnknownDeps = true; }
            var typeSummary = this._loadSummary(type, cpl.CompileSummaryKind.Injectable);
            var typeMetadata = typeSummary ?
                typeSummary.type :
                this._getTypeMetadata(type, dependencies, throwOnUnknownDeps);
            var annotations = this._reflector.annotations(type).filter(function (ann) { return core_1.createInjectable.isTypeOf(ann); });
            if (annotations.length === 0) {
                return null;
            }
            var meta = annotations[annotations.length - 1];
            return {
                symbol: type,
                type: typeMetadata,
                providedIn: meta.providedIn,
                useValue: meta.useValue,
                useClass: meta.useClass,
                useExisting: meta.useExisting,
                useFactory: meta.useFactory,
                deps: meta.deps,
            };
        };
        CompileMetadataResolver.prototype._getTypeMetadata = function (type, dependencies, throwOnUnknownDeps) {
            if (dependencies === void 0) { dependencies = null; }
            if (throwOnUnknownDeps === void 0) { throwOnUnknownDeps = true; }
            var identifier = this._getIdentifierMetadata(type);
            return {
                reference: identifier.reference,
                diDeps: this._getDependenciesMetadata(identifier.reference, dependencies, throwOnUnknownDeps),
                lifecycleHooks: lifecycle_reflector_1.getAllLifecycleHooks(this._reflector, identifier.reference),
            };
        };
        CompileMetadataResolver.prototype._getFactoryMetadata = function (factory, dependencies) {
            if (dependencies === void 0) { dependencies = null; }
            factory = util_2.resolveForwardRef(factory);
            return { reference: factory, diDeps: this._getDependenciesMetadata(factory, dependencies) };
        };
        /**
         * Gets the metadata for the given pipe.
         * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
         */
        CompileMetadataResolver.prototype.getPipeMetadata = function (pipeType) {
            var pipeMeta = this._pipeCache.get(pipeType);
            if (!pipeMeta) {
                this._reportError(util_2.syntaxError("Illegal state: getPipeMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Pipe " + stringifyType(pipeType) + "."), pipeType);
            }
            return pipeMeta || null;
        };
        CompileMetadataResolver.prototype.getPipeSummary = function (pipeType) {
            var pipeSummary = this._loadSummary(pipeType, cpl.CompileSummaryKind.Pipe);
            if (!pipeSummary) {
                this._reportError(util_2.syntaxError("Illegal state: Could not load the summary for pipe " + stringifyType(pipeType) + "."), pipeType);
            }
            return pipeSummary;
        };
        CompileMetadataResolver.prototype.getOrLoadPipeMetadata = function (pipeType) {
            var pipeMeta = this._pipeCache.get(pipeType);
            if (!pipeMeta) {
                pipeMeta = this._loadPipeMetadata(pipeType);
            }
            return pipeMeta;
        };
        CompileMetadataResolver.prototype._loadPipeMetadata = function (pipeType) {
            pipeType = util_2.resolveForwardRef(pipeType);
            var pipeAnnotation = this._pipeResolver.resolve(pipeType);
            var pipeMeta = new cpl.CompilePipeMetadata({
                type: this._getTypeMetadata(pipeType),
                name: pipeAnnotation.name,
                pure: !!pipeAnnotation.pure
            });
            this._pipeCache.set(pipeType, pipeMeta);
            this._summaryCache.set(pipeType, pipeMeta.toSummary());
            return pipeMeta;
        };
        CompileMetadataResolver.prototype._getDependenciesMetadata = function (typeOrFunc, dependencies, throwOnUnknownDeps) {
            var _this = this;
            if (throwOnUnknownDeps === void 0) { throwOnUnknownDeps = true; }
            var hasUnknownDeps = false;
            var params = dependencies || this._reflector.parameters(typeOrFunc) || [];
            var dependenciesMetadata = params.map(function (param) {
                var isAttribute = false;
                var isHost = false;
                var isSelf = false;
                var isSkipSelf = false;
                var isOptional = false;
                var token = null;
                if (Array.isArray(param)) {
                    param.forEach(function (paramEntry) {
                        if (core_1.createHost.isTypeOf(paramEntry)) {
                            isHost = true;
                        }
                        else if (core_1.createSelf.isTypeOf(paramEntry)) {
                            isSelf = true;
                        }
                        else if (core_1.createSkipSelf.isTypeOf(paramEntry)) {
                            isSkipSelf = true;
                        }
                        else if (core_1.createOptional.isTypeOf(paramEntry)) {
                            isOptional = true;
                        }
                        else if (core_1.createAttribute.isTypeOf(paramEntry)) {
                            isAttribute = true;
                            token = paramEntry.attributeName;
                        }
                        else if (core_1.createInject.isTypeOf(paramEntry)) {
                            token = paramEntry.token;
                        }
                        else if (core_1.createInjectionToken.isTypeOf(paramEntry) ||
                            paramEntry instanceof static_symbol_1.StaticSymbol) {
                            token = paramEntry;
                        }
                        else if (isValidType(paramEntry) && token == null) {
                            token = paramEntry;
                        }
                    });
                }
                else {
                    token = param;
                }
                if (token == null) {
                    hasUnknownDeps = true;
                    return {};
                }
                return {
                    isAttribute: isAttribute,
                    isHost: isHost,
                    isSelf: isSelf,
                    isSkipSelf: isSkipSelf,
                    isOptional: isOptional,
                    token: _this._getTokenMetadata(token)
                };
            });
            if (hasUnknownDeps) {
                var depsTokens = dependenciesMetadata.map(function (dep) { return dep.token ? stringifyType(dep.token) : '?'; }).join(', ');
                var message = "Can't resolve all parameters for " + stringifyType(typeOrFunc) + ": (" + depsTokens + ").";
                if (throwOnUnknownDeps || this._config.strictInjectionParameters) {
                    this._reportError(util_2.syntaxError(message), typeOrFunc);
                }
            }
            return dependenciesMetadata;
        };
        CompileMetadataResolver.prototype._getTokenMetadata = function (token) {
            token = util_2.resolveForwardRef(token);
            var compileToken;
            if (typeof token === 'string') {
                compileToken = { value: token };
            }
            else {
                compileToken = { identifier: { reference: token } };
            }
            return compileToken;
        };
        CompileMetadataResolver.prototype._getProvidersMetadata = function (providers, targetEntryComponents, debugInfo, compileProviders, type) {
            var _this = this;
            if (compileProviders === void 0) { compileProviders = []; }
            providers.forEach(function (provider, providerIdx) {
                if (Array.isArray(provider)) {
                    _this._getProvidersMetadata(provider, targetEntryComponents, debugInfo, compileProviders);
                }
                else {
                    provider = util_2.resolveForwardRef(provider);
                    var providerMeta = undefined;
                    if (provider && typeof provider === 'object' && provider.hasOwnProperty('provide')) {
                        _this._validateProvider(provider);
                        providerMeta = new cpl.ProviderMeta(provider.provide, provider);
                    }
                    else if (isValidType(provider)) {
                        providerMeta = new cpl.ProviderMeta(provider, { useClass: provider });
                    }
                    else if (provider === void 0) {
                        _this._reportError(util_2.syntaxError("Encountered undefined provider! Usually this means you have a circular dependencies. This might be caused by using 'barrel' index.ts files."));
                        return;
                    }
                    else {
                        var providersInfo = providers
                            .reduce(function (soFar, seenProvider, seenProviderIdx) {
                            if (seenProviderIdx < providerIdx) {
                                soFar.push("" + stringifyType(seenProvider));
                            }
                            else if (seenProviderIdx == providerIdx) {
                                soFar.push("?" + stringifyType(seenProvider) + "?");
                            }
                            else if (seenProviderIdx == providerIdx + 1) {
                                soFar.push('...');
                            }
                            return soFar;
                        }, [])
                            .join(', ');
                        _this._reportError(util_2.syntaxError("Invalid " + (debugInfo ?
                            debugInfo :
                            'provider') + " - only instances of Provider and Type are allowed, got: [" + providersInfo + "]"), type);
                        return;
                    }
                    if (providerMeta.token ===
                        _this._reflector.resolveExternalReference(identifiers_1.Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS)) {
                        targetEntryComponents.push.apply(targetEntryComponents, tslib_1.__spreadArray([], tslib_1.__read(_this._getEntryComponentsFromProvider(providerMeta, type))));
                    }
                    else {
                        compileProviders.push(_this.getProviderMetadata(providerMeta));
                    }
                }
            });
            return compileProviders;
        };
        CompileMetadataResolver.prototype._validateProvider = function (provider) {
            if (provider.hasOwnProperty('useClass') && provider.useClass == null) {
                this._reportError(util_2.syntaxError("Invalid provider for " + stringifyType(provider.provide) + ". useClass cannot be " + provider.useClass + ".\n           Usually it happens when:\n           1. There's a circular dependency (might be caused by using index.ts (barrel) files).\n           2. Class was used before it was declared. Use forwardRef in this case."));
            }
        };
        CompileMetadataResolver.prototype._getEntryComponentsFromProvider = function (provider, type) {
            var _this = this;
            var components = [];
            var collectedIdentifiers = [];
            if (provider.useFactory || provider.useExisting || provider.useClass) {
                this._reportError(util_2.syntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports useValue!"), type);
                return [];
            }
            if (!provider.multi) {
                this._reportError(util_2.syntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports 'multi = true'!"), type);
                return [];
            }
            extractIdentifiers(provider.useValue, collectedIdentifiers);
            collectedIdentifiers.forEach(function (identifier) {
                var entry = _this._getEntryComponentMetadata(identifier.reference, false);
                if (entry) {
                    components.push(entry);
                }
            });
            return components;
        };
        CompileMetadataResolver.prototype._getEntryComponentMetadata = function (dirType, throwIfNotFound) {
            if (throwIfNotFound === void 0) { throwIfNotFound = true; }
            var dirMeta = this.getNonNormalizedDirectiveMetadata(dirType);
            if (dirMeta && dirMeta.metadata.isComponent) {
                return { componentType: dirType, componentFactory: dirMeta.metadata.componentFactory };
            }
            var dirSummary = this._loadSummary(dirType, cpl.CompileSummaryKind.Directive);
            if (dirSummary && dirSummary.isComponent) {
                return { componentType: dirType, componentFactory: dirSummary.componentFactory };
            }
            if (throwIfNotFound) {
                throw util_2.syntaxError(dirType.name + " cannot be used as an entry component.");
            }
            return null;
        };
        CompileMetadataResolver.prototype._getInjectableTypeMetadata = function (type, dependencies) {
            if (dependencies === void 0) { dependencies = null; }
            var typeSummary = this._loadSummary(type, cpl.CompileSummaryKind.Injectable);
            if (typeSummary) {
                return typeSummary.type;
            }
            return this._getTypeMetadata(type, dependencies);
        };
        CompileMetadataResolver.prototype.getProviderMetadata = function (provider) {
            var compileDeps = undefined;
            var compileTypeMetadata = null;
            var compileFactoryMetadata = null;
            var token = this._getTokenMetadata(provider.token);
            if (provider.useClass) {
                compileTypeMetadata =
                    this._getInjectableTypeMetadata(provider.useClass, provider.dependencies);
                compileDeps = compileTypeMetadata.diDeps;
                if (provider.token === provider.useClass) {
                    // use the compileTypeMetadata as it contains information about lifecycleHooks...
                    token = { identifier: compileTypeMetadata };
                }
            }
            else if (provider.useFactory) {
                compileFactoryMetadata = this._getFactoryMetadata(provider.useFactory, provider.dependencies);
                compileDeps = compileFactoryMetadata.diDeps;
            }
            return {
                token: token,
                useClass: compileTypeMetadata,
                useValue: provider.useValue,
                useFactory: compileFactoryMetadata,
                useExisting: provider.useExisting ? this._getTokenMetadata(provider.useExisting) : undefined,
                deps: compileDeps,
                multi: provider.multi
            };
        };
        CompileMetadataResolver.prototype._getQueriesMetadata = function (queries, isViewQuery, directiveType) {
            var _this = this;
            var res = [];
            Object.keys(queries).forEach(function (propertyName) {
                var query = queries[propertyName];
                if (query.isViewQuery === isViewQuery) {
                    res.push(_this._getQueryMetadata(query, propertyName, directiveType));
                }
            });
            return res;
        };
        CompileMetadataResolver.prototype._queryVarBindings = function (selector) {
            return selector.split(/\s*,\s*/);
        };
        CompileMetadataResolver.prototype._getQueryMetadata = function (q, propertyName, typeOrFunc) {
            var _this = this;
            var selectors;
            if (typeof q.selector === 'string') {
                selectors =
                    this._queryVarBindings(q.selector).map(function (varName) { return _this._getTokenMetadata(varName); });
            }
            else {
                if (!q.selector) {
                    this._reportError(util_2.syntaxError("Can't construct a query for the property \"" + propertyName + "\" of \"" + stringifyType(typeOrFunc) + "\" since the query selector wasn't defined."), typeOrFunc);
                    selectors = [];
                }
                else {
                    selectors = [this._getTokenMetadata(q.selector)];
                }
            }
            return {
                selectors: selectors,
                first: q.first,
                descendants: q.descendants,
                emitDistinctChangesOnly: q.emitDistinctChangesOnly,
                propertyName: propertyName,
                read: q.read ? this._getTokenMetadata(q.read) : null,
                static: q.static
            };
        };
        CompileMetadataResolver.prototype._reportError = function (error, type, otherType) {
            if (this._errorCollector) {
                this._errorCollector(error, type);
                if (otherType) {
                    this._errorCollector(error, otherType);
                }
            }
            else {
                throw error;
            }
        };
        return CompileMetadataResolver;
    }());
    exports.CompileMetadataResolver = CompileMetadataResolver;
    function flattenArray(tree, out) {
        if (out === void 0) { out = []; }
        if (tree) {
            for (var i = 0; i < tree.length; i++) {
                var item = util_2.resolveForwardRef(tree[i]);
                if (Array.isArray(item)) {
                    flattenArray(item, out);
                }
                else {
                    out.push(item);
                }
            }
        }
        return out;
    }
    function dedupeArray(array) {
        if (array) {
            return Array.from(new Set(array));
        }
        return [];
    }
    function flattenAndDedupeArray(tree) {
        return dedupeArray(flattenArray(tree));
    }
    function isValidType(value) {
        return (value instanceof static_symbol_1.StaticSymbol) || (value instanceof core_1.Type);
    }
    function extractIdentifiers(value, targetIdentifiers) {
        util_2.visitValue(value, new _CompileValueConverter(), targetIdentifiers);
    }
    var _CompileValueConverter = /** @class */ (function (_super) {
        tslib_1.__extends(_CompileValueConverter, _super);
        function _CompileValueConverter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        _CompileValueConverter.prototype.visitOther = function (value, targetIdentifiers) {
            targetIdentifiers.push({ reference: value });
        };
        return _CompileValueConverter;
    }(util_2.ValueTransformer));
    function stringifyType(type) {
        if (type instanceof static_symbol_1.StaticSymbol) {
            return type.name + " in " + type.filePath;
        }
        else {
            return util_2.stringify(type);
        }
    }
    /**
     * Indicates that a component is still being loaded in a synchronous compile.
     */
    function componentStillLoadingError(compType) {
        var error = Error("Can't compile synchronously as " + util_2.stringify(compType) + " is still being loaded!");
        error[exports.ERROR_COMPONENT_TYPE] = compType;
        return error;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvbWV0YWRhdGFfcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUVILHlFQUFvRTtJQUNwRSx1REFBNkM7SUFDN0MsK0RBQThFO0lBQzlFLDREQUEwQztJQUcxQyxtREFBZ1U7SUFFaFUsK0VBQWlFO0lBQ2pFLGlFQUEwQztJQUMxQyxpRkFBMkQ7SUFLM0QsMkRBQXVDO0lBRXZDLG1EQUEySTtJQUk5SCxRQUFBLG9CQUFvQixHQUFHLGlCQUFpQixDQUFDO0lBRXRELElBQU0scUNBQXFDLEdBQUcsb0NBQW9DLENBQUM7SUFPbkYsU0FBZ0IsbUNBQW1DLENBQUMsS0FBVTs7UUFFNUQsT0FBTyxNQUFBLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxtQ0FBSSxJQUFJLENBQUM7SUFDOUQsQ0FBQztJQUhELGtGQUdDO0lBRUQsZ0JBQWdCO0lBQ2hCLGtDQUFrQztJQUNsQywyREFBMkQ7SUFDM0QsOENBQThDO0lBQzlDLDZEQUE2RDtJQUM3RCw2REFBNkQ7SUFDN0QsdUJBQXVCO0lBQ3ZCO1FBVUUsaUNBQ1ksT0FBdUIsRUFBVSxXQUF1QixFQUN4RCxpQkFBbUMsRUFBVSxrQkFBcUMsRUFDbEYsYUFBMkIsRUFBVSxnQkFBc0MsRUFDM0UsZUFBc0MsRUFDdEMsb0JBQXlDLEVBQVUsUUFBaUIsRUFDcEUsa0JBQXFDLEVBQVUsVUFBNEIsRUFDM0UsZUFBZ0M7WUFOaEMsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7WUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtZQUN4RCxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1lBQVUsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtZQUNsRixrQkFBYSxHQUFiLGFBQWEsQ0FBYztZQUFVLHFCQUFnQixHQUFoQixnQkFB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QztRQUM3QyxDQUFDO1FBQ0gsNkJBQUM7SUFBRCxDQUFDLEFBSkQsQ0FBcUMsdUJBQWdCLEdBSXBEO0lBRUQsU0FBUyxhQUFhLENBQUMsSUFBUztRQUM5QixJQUFJLElBQUksWUFBWSw0QkFBWSxFQUFFO1lBQ2hDLE9BQVUsSUFBSSxDQUFDLElBQUksWUFBTyxJQUFJLENBQUMsUUFBVSxDQUFDO1NBQzNDO2FBQU07WUFDTCxPQUFPLGdCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLDBCQUEwQixDQUFDLFFBQWM7UUFDaEQsSUFBTSxLQUFLLEdBQ1AsS0FBSyxDQUFDLG9DQUFrQyxnQkFBUyxDQUFDLFFBQVEsQ0FBQyw0QkFBeUIsQ0FBQyxDQUFDO1FBQ3pGLEtBQWEsQ0FBQyw0QkFBb0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQztRQUNoRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtTdGF0aWNTeW1ib2wsIFN0YXRpY1N5bWJvbENhY2hlfSBmcm9tICcuL2FvdC9zdGF0aWNfc3ltYm9sJztcbmltcG9ydCB7bmdmYWN0b3J5RmlsZVBhdGh9IGZyb20gJy4vYW90L3V0aWwnO1xuaW1wb3J0IHthc3NlcnRBcnJheU9mU3RyaW5ncywgYXNzZXJ0SW50ZXJwb2xhdGlvblN5bWJvbHN9IGZyb20gJy4vYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjcGwgZnJvbSAnLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCB7Q29tcGlsZVJlZmxlY3Rvcn0gZnJvbSAnLi9jb21waWxlX3JlZmxlY3Rvcic7XG5pbXBvcnQge0NvbXBpbGVyQ29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIGNyZWF0ZUF0dHJpYnV0ZSwgY3JlYXRlQ29tcG9uZW50LCBjcmVhdGVIb3N0LCBjcmVhdGVJbmplY3QsIGNyZWF0ZUluamVjdGFibGUsIGNyZWF0ZUluamVjdGlvblRva2VuLCBjcmVhdGVOZ01vZHVsZSwgY3JlYXRlT3B0aW9uYWwsIGNyZWF0ZVNlbGYsIGNyZWF0ZVNraXBTZWxmLCBEaXJlY3RpdmUsIEluamVjdGFibGUsIE1vZHVsZVdpdGhQcm92aWRlcnMsIFByb3ZpZGVyLCBRdWVyeSwgU2NoZW1hTWV0YWRhdGEsIFR5cGUsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICcuL2NvcmUnO1xuaW1wb3J0IHtEaXJlY3RpdmVOb3JtYWxpemVyfSBmcm9tICcuL2RpcmVjdGl2ZV9ub3JtYWxpemVyJztcbmltcG9ydCB7RGlyZWN0aXZlUmVzb2x2ZXIsIGZpbmRMYXN0fSBmcm9tICcuL2RpcmVjdGl2ZV9yZXNvbHZlcic7XG5pbXBvcnQge0lkZW50aWZpZXJzfSBmcm9tICcuL2lkZW50aWZpZXJzJztcbmltcG9ydCB7Z2V0QWxsTGlmZWN5Y2xlSG9va3N9IGZyb20gJy4vbGlmZWN5Y2xlX3JlZmxlY3Rvcic7XG5pbXBvcnQge0h0bWxQYXJzZXJ9IGZyb20gJy4vbWxfcGFyc2VyL2h0bWxfcGFyc2VyJztcbmltcG9ydCB7TmdNb2R1bGVSZXNvbHZlcn0gZnJvbSAnLi9uZ19tb2R1bGVfcmVzb2x2ZXInO1xuaW1wb3J0IHtQaXBlUmVzb2x2ZXJ9IGZyb20gJy4vcGlwZV9yZXNvbHZlcic7XG5pbXBvcnQge0VsZW1lbnRTY2hlbWFSZWdpc3RyeX0gZnJvbSAnLi9zY2hlbWEvZWxlbWVudF9zY2hlbWFfcmVnaXN0cnknO1xuaW1wb3J0IHtDc3NTZWxlY3Rvcn0gZnJvbSAnLi9zZWxlY3Rvcic7XG5pbXBvcnQge1N1bW1hcnlSZXNvbHZlcn0gZnJvbSAnLi9zdW1tYXJ5X3Jlc29sdmVyJztcbmltcG9ydCB7Q29uc29sZSwgaXNQcm9taXNlLCBub1VuZGVmaW5lZCwgcmVzb2x2ZUZvcndhcmRSZWYsIHN0cmluZ2lmeSwgU3luY0FzeW5jLCBzeW50YXhFcnJvciwgVmFsdWVUcmFuc2Zvcm1lciwgdmlzaXRWYWx1ZX0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IHR5cGUgRXJyb3JDb2xsZWN0b3IgPSAoZXJyb3I6IGFueSwgdHlwZT86IGFueSkgPT4gdm9pZDtcblxuZXhwb3J0IGNvbnN0IEVSUk9SX0NPTVBPTkVOVF9UWVBFID0gJ25nQ29tcG9uZW50VHlwZSc7XG5cbmNvbnN0IE1JU1NJTkdfTkdfTU9EVUxFX01FVEFEQVRBX0VSUk9SX0RBVEEgPSAnbmdNaXNzaW5nTmdNb2R1bGVNZXRhZGF0YUVycm9yRGF0YSc7XG5leHBvcnQgaW50ZXJmYWNlIE1pc3NpbmdOZ01vZHVsZU1ldGFkYXRhRXJyb3JEYXRhIHtcbiAgZmlsZU5hbWU6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1pc3NpbmdOZ01vZHVsZU1ldGFkYXRhRXJyb3JEYXRhKGVycm9yOiBhbnkpOiBNaXNzaW5nTmdNb2R1bGVNZXRhZGF0YUVycm9yRGF0YXxcbiAgICBudWxsIHtcbiAgcmV0dXJuIGVycm9yW01JU1NJTkdfTkdfTU9EVUxFX01FVEFEQVRBX0VSUk9SX0RBVEFdID8/IG51bGw7XG59XG5cbi8vIERlc2lnbiBub3Rlczpcbi8vIC0gZG9uJ3QgbGF6aWx5IGNyZWF0ZSBtZXRhZGF0YTpcbi8vICAgRm9yIHNvbWUgbWV0YWRhdGEsIHdlIG5lZWQgdG8gZG8gYXN5bmMgd29yayBzb21ldGltZXMsXG4vLyAgIHNvIHRoZSB1c2VyIGhhcyB0byBraWNrIG9mZiB0aGlzIGxvYWRpbmcuXG4vLyAgIEJ1dCB3ZSB3YW50IHRvIHJlcG9ydCBlcnJvcnMgZXZlbiB3aGVuIHRoZSBhc3luYyB3b3JrIGlzXG4vLyAgIG5vdCByZXF1aXJlZCB0byBjaGVjayB0aGF0IHRoZSB1c2VyIHdvdWxkIGhhdmUgYmVlbiBhYmxlXG4vLyAgIHRvIHdhaXQgY29ycmVjdGx5LlxuZXhwb3J0IGNsYXNzIENvbXBpbGVNZXRhZGF0YVJlc29sdmVyIHtcbiAgcHJpdmF0ZSBfbm9uTm9ybWFsaXplZERpcmVjdGl2ZUNhY2hlID1cbiAgICAgIG5ldyBNYXA8VHlwZSwge2Fubm90YXRpb246IERpcmVjdGl2ZSwgbWV0YWRhdGE6IGNwbC5Db21waWxlRGlyZWN0aXZlTWV0YWRhdGF9PigpO1xuICBwcml2YXRlIF9kaXJlY3RpdmVDYWNoZSA9IG5ldyBNYXA8VHlwZSwgY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YT4oKTtcbiAgcHJpdmF0ZSBfc3VtbWFyeUNhY2hlID0gbmV3IE1hcDxUeXBlLCBjcGwuQ29tcGlsZVR5cGVTdW1tYXJ5fG51bGw+KCk7XG4gIHByaXZhdGUgX3BpcGVDYWNoZSA9IG5ldyBNYXA8VHlwZSwgY3BsLkNvbXBpbGVQaXBlTWV0YWRhdGE+KCk7XG4gIHByaXZhdGUgX25nTW9kdWxlQ2FjaGUgPSBuZXcgTWFwPFR5cGUsIGNwbC5Db21waWxlTmdNb2R1bGVNZXRhZGF0YT4oKTtcbiAgcHJpdmF0ZSBfbmdNb2R1bGVPZlR5cGVzID0gbmV3IE1hcDxUeXBlLCBUeXBlPigpO1xuICBwcml2YXRlIF9zaGFsbG93TW9kdWxlQ2FjaGUgPSBuZXcgTWFwPFR5cGUsIGNwbC5Db21waWxlU2hhbGxvd01vZHVsZU1ldGFkYXRhPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfY29uZmlnOiBDb21waWxlckNvbmZpZywgcHJpdmF0ZSBfaHRtbFBhcnNlcjogSHRtbFBhcnNlcixcbiAgICAgIHByaXZhdGUgX25nTW9kdWxlUmVzb2x2ZXI6IE5nTW9kdWxlUmVzb2x2ZXIsIHByaXZhdGUgX2RpcmVjdGl2ZVJlc29sdmVyOiBEaXJlY3RpdmVSZXNvbHZlcixcbiAgICAgIHByaXZhdGUgX3BpcGVSZXNvbHZlcjogUGlwZVJlc29sdmVyLCBwcml2YXRlIF9zdW1tYXJ5UmVzb2x2ZXI6IFN1bW1hcnlSZXNvbHZlcjxhbnk+LFxuICAgICAgcHJpdmF0ZSBfc2NoZW1hUmVnaXN0cnk6IEVsZW1lbnRTY2hlbWFSZWdpc3RyeSxcbiAgICAgIHByaXZhdGUgX2RpcmVjdGl2ZU5vcm1hbGl6ZXI6IERpcmVjdGl2ZU5vcm1hbGl6ZXIsIHByaXZhdGUgX2NvbnNvbGU6IENvbnNvbGUsXG4gICAgICBwcml2YXRlIF9zdGF0aWNTeW1ib2xDYWNoZTogU3RhdGljU3ltYm9sQ2FjaGUsIHByaXZhdGUgX3JlZmxlY3RvcjogQ29tcGlsZVJlZmxlY3RvcixcbiAgICAgIHByaXZhdGUgX2Vycm9yQ29sbGVjdG9yPzogRXJyb3JDb2xsZWN0b3IpIHt9XG5cbiAgZ2V0UmVmbGVjdG9yKCk6IENvbXBpbGVSZWZsZWN0b3Ige1xuICAgIHJldHVybiB0aGlzLl9yZWZsZWN0b3I7XG4gIH1cblxuICBjbGVhckNhY2hlRm9yKHR5cGU6IFR5cGUpIHtcbiAgICBjb25zdCBkaXJNZXRhID0gdGhpcy5fZGlyZWN0aXZlQ2FjaGUuZ2V0KHR5cGUpO1xuICAgIHRoaXMuX2RpcmVjdGl2ZUNhY2hlLmRlbGV0ZSh0eXBlKTtcbiAgICB0aGlzLl9ub25Ob3JtYWxpemVkRGlyZWN0aXZlQ2FjaGUuZGVsZXRlKHR5cGUpO1xuICAgIHRoaXMuX3N1bW1hcnlDYWNoZS5kZWxldGUodHlwZSk7XG4gICAgdGhpcy5fcGlwZUNhY2hlLmRlbGV0ZSh0eXBlKTtcbiAgICB0aGlzLl9uZ01vZHVsZU9mVHlwZXMuZGVsZXRlKHR5cGUpO1xuICAgIC8vIENsZWFyIGFsbCBvZiB0aGUgTmdNb2R1bGUgYXMgdGhleSBjb250YWluIHRyYW5zaXRpdmUgaW5mb3JtYXRpb24hXG4gICAgdGhpcy5fbmdNb2R1bGVDYWNoZS5jbGVhcigpO1xuICAgIGlmIChkaXJNZXRhKSB7XG4gICAgICB0aGlzLl9kaXJlY3RpdmVOb3JtYWxpemVyLmNsZWFyQ2FjaGVGb3IoZGlyTWV0YSk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJDYWNoZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9kaXJlY3RpdmVDYWNoZS5jbGVhcigpO1xuICAgIHRoaXMuX25vbk5vcm1hbGl6ZWREaXJlY3RpdmVDYWNoZS5jbGVhcigpO1xuICAgIHRoaXMuX3N1bW1hcnlDYWNoZS5jbGVhcigpO1xuICAgIHRoaXMuX3BpcGVDYWNoZS5jbGVhcigpO1xuICAgIHRoaXMuX25nTW9kdWxlQ2FjaGUuY2xlYXIoKTtcbiAgICB0aGlzLl9uZ01vZHVsZU9mVHlwZXMuY2xlYXIoKTtcbiAgICB0aGlzLl9kaXJlY3RpdmVOb3JtYWxpemVyLmNsZWFyQ2FjaGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVByb3h5Q2xhc3MoYmFzZVR5cGU6IGFueSwgbmFtZTogc3RyaW5nKTogY3BsLlByb3h5Q2xhc3Mge1xuICAgIGxldCBkZWxlZ2F0ZTogYW55ID0gbnVsbDtcbiAgICBjb25zdCBwcm94eUNsYXNzOiBjcGwuUHJveHlDbGFzcyA9IDxhbnk+ZnVuY3Rpb24odGhpczogdW5rbm93bikge1xuICAgICAgaWYgKCFkZWxlZ2F0ZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgSWxsZWdhbCBzdGF0ZTogQ2xhc3MgJHtuYW1lfSBmb3IgdHlwZSAke3N0cmluZ2lmeShiYXNlVHlwZSl9IGlzIG5vdCBjb21waWxlZCB5ZXQhYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIHByb3h5Q2xhc3Muc2V0RGVsZWdhdGUgPSAoZCkgPT4ge1xuICAgICAgZGVsZWdhdGUgPSBkO1xuICAgICAgKDxhbnk+cHJveHlDbGFzcykucHJvdG90eXBlID0gZC5wcm90b3R5cGU7XG4gICAgfTtcbiAgICAvLyBNYWtlIHN0cmluZ2lmeSB3b3JrIGNvcnJlY3RseVxuICAgICg8YW55PnByb3h5Q2xhc3MpLm92ZXJyaWRkZW5OYW1lID0gbmFtZTtcbiAgICByZXR1cm4gcHJveHlDbGFzcztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0R2VuZXJhdGVkQ2xhc3MoZGlyVHlwZTogYW55LCBuYW1lOiBzdHJpbmcpOiBTdGF0aWNTeW1ib2x8Y3BsLlByb3h5Q2xhc3Mge1xuICAgIGlmIChkaXJUeXBlIGluc3RhbmNlb2YgU3RhdGljU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RhdGljU3ltYm9sQ2FjaGUuZ2V0KG5nZmFjdG9yeUZpbGVQYXRoKGRpclR5cGUuZmlsZVBhdGgpLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZVByb3h5Q2xhc3MoZGlyVHlwZSwgbmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRDb21wb25lbnRWaWV3Q2xhc3MoZGlyVHlwZTogYW55KTogU3RhdGljU3ltYm9sfGNwbC5Qcm94eUNsYXNzIHtcbiAgICByZXR1cm4gdGhpcy5nZXRHZW5lcmF0ZWRDbGFzcyhkaXJUeXBlLCBjcGwudmlld0NsYXNzTmFtZShkaXJUeXBlLCAwKSk7XG4gIH1cblxuICBnZXRIb3N0Q29tcG9uZW50Vmlld0NsYXNzKGRpclR5cGU6IGFueSk6IFN0YXRpY1N5bWJvbHxjcGwuUHJveHlDbGFzcyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0R2VuZXJhdGVkQ2xhc3MoZGlyVHlwZSwgY3BsLmhvc3RWaWV3Q2xhc3NOYW1lKGRpclR5cGUpKTtcbiAgfVxuXG4gIGdldEhvc3RDb21wb25lbnRUeXBlKGRpclR5cGU6IGFueSk6IFN0YXRpY1N5bWJvbHxjcGwuUHJveHlDbGFzcyB7XG4gICAgY29uc3QgbmFtZSA9IGAke2NwbC5pZGVudGlmaWVyTmFtZSh7cmVmZXJlbmNlOiBkaXJUeXBlfSl9X0hvc3RgO1xuICAgIGlmIChkaXJUeXBlIGluc3RhbmNlb2YgU3RhdGljU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RhdGljU3ltYm9sQ2FjaGUuZ2V0KGRpclR5cGUuZmlsZVBhdGgsIG5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVQcm94eUNsYXNzKGRpclR5cGUsIG5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZW5kZXJlclR5cGUoZGlyVHlwZTogYW55KTogU3RhdGljU3ltYm9sfG9iamVjdCB7XG4gICAgaWYgKGRpclR5cGUgaW5zdGFuY2VvZiBTdGF0aWNTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGF0aWNTeW1ib2xDYWNoZS5nZXQoXG4gICAgICAgICAgbmdmYWN0b3J5RmlsZVBhdGgoZGlyVHlwZS5maWxlUGF0aCksIGNwbC5yZW5kZXJlclR5cGVOYW1lKGRpclR5cGUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcmV0dXJuaW5nIGFuIG9iamVjdCBhcyBwcm94eSxcbiAgICAgIC8vIHRoYXQgd2UgZmlsbCBsYXRlciBkdXJpbmcgcnVudGltZSBjb21waWxhdGlvbi5cbiAgICAgIHJldHVybiA8YW55Pnt9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q29tcG9uZW50RmFjdG9yeShcbiAgICAgIHNlbGVjdG9yOiBzdHJpbmcsIGRpclR5cGU6IGFueSwgaW5wdXRzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfXxudWxsLFxuICAgICAgb3V0cHV0czoge1trZXk6IHN0cmluZ106IHN0cmluZ30pOiBTdGF0aWNTeW1ib2x8b2JqZWN0IHtcbiAgICBpZiAoZGlyVHlwZSBpbnN0YW5jZW9mIFN0YXRpY1N5bWJvbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0YXRpY1N5bWJvbENhY2hlLmdldChcbiAgICAgICAgICBuZ2ZhY3RvcnlGaWxlUGF0aChkaXJUeXBlLmZpbGVQYXRoKSwgY3BsLmNvbXBvbmVudEZhY3RvcnlOYW1lKGRpclR5cGUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaG9zdFZpZXcgPSB0aGlzLmdldEhvc3RDb21wb25lbnRWaWV3Q2xhc3MoZGlyVHlwZSk7XG4gICAgICAvLyBOb3RlOiBuZ0NvbnRlbnRTZWxlY3RvcnMgd2lsbCBiZSBmaWxsZWQgbGF0ZXIgb25jZSB0aGUgdGVtcGxhdGUgaXNcbiAgICAgIC8vIGxvYWRlZC5cbiAgICAgIGNvbnN0IGNyZWF0ZUNvbXBvbmVudEZhY3RvcnkgPVxuICAgICAgICAgIHRoaXMuX3JlZmxlY3Rvci5yZXNvbHZlRXh0ZXJuYWxSZWZlcmVuY2UoSWRlbnRpZmllcnMuY3JlYXRlQ29tcG9uZW50RmFjdG9yeSk7XG4gICAgICByZXR1cm4gY3JlYXRlQ29tcG9uZW50RmFjdG9yeShzZWxlY3RvciwgZGlyVHlwZSwgPGFueT5ob3N0VmlldywgaW5wdXRzLCBvdXRwdXRzLCBbXSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0Q29tcG9uZW50RmFjdG9yeShmYWN0b3J5OiBTdGF0aWNTeW1ib2x8b2JqZWN0LCBuZ0NvbnRlbnRTZWxlY3RvcnM6IHN0cmluZ1tdKSB7XG4gICAgaWYgKCEoZmFjdG9yeSBpbnN0YW5jZW9mIFN0YXRpY1N5bWJvbCkpIHtcbiAgICAgIChmYWN0b3J5IGFzIGFueSkubmdDb250ZW50U2VsZWN0b3JzLnB1c2goLi4ubmdDb250ZW50U2VsZWN0b3JzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9sb2FkU3VtbWFyeSh0eXBlOiBhbnksIGtpbmQ6IGNwbC5Db21waWxlU3VtbWFyeUtpbmQpOiBjcGwuQ29tcGlsZVR5cGVTdW1tYXJ5fG51bGwge1xuICAgIGxldCB0eXBlU3VtbWFyeSA9IHRoaXMuX3N1bW1hcnlDYWNoZS5nZXQodHlwZSk7XG4gICAgaWYgKCF0eXBlU3VtbWFyeSkge1xuICAgICAgY29uc3Qgc3VtbWFyeSA9IHRoaXMuX3N1bW1hcnlSZXNvbHZlci5yZXNvbHZlU3VtbWFyeSh0eXBlKTtcbiAgICAgIHR5cGVTdW1tYXJ5ID0gc3VtbWFyeSA/IHN1bW1hcnkudHlwZSA6IG51bGw7XG4gICAgICB0aGlzLl9zdW1tYXJ5Q2FjaGUuc2V0KHR5cGUsIHR5cGVTdW1tYXJ5IHx8IG51bGwpO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZVN1bW1hcnkgJiYgdHlwZVN1bW1hcnkuc3VtbWFyeUtpbmQgPT09IGtpbmQgPyB0eXBlU3VtbWFyeSA6IG51bGw7XG4gIH1cblxuICBnZXRIb3N0Q29tcG9uZW50TWV0YWRhdGEoXG4gICAgICBjb21wTWV0YTogY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgIGhvc3RWaWV3VHlwZT86IFN0YXRpY1N5bWJvbHxjcGwuUHJveHlDbGFzcyk6IGNwbC5Db21waWxlRGlyZWN0aXZlTWV0YWRhdGEge1xuICAgIGNvbnN0IGhvc3RUeXBlID0gdGhpcy5nZXRIb3N0Q29tcG9uZW50VHlwZShjb21wTWV0YS50eXBlLnJlZmVyZW5jZSk7XG4gICAgaWYgKCFob3N0Vmlld1R5cGUpIHtcbiAgICAgIGhvc3RWaWV3VHlwZSA9IHRoaXMuZ2V0SG9zdENvbXBvbmVudFZpZXdDbGFzcyhob3N0VHlwZSk7XG4gICAgfVxuICAgIC8vIE5vdGU6ICEgaXMgb2sgaGVyZSBhcyB0aGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSBjYWxsZWQgd2l0aCBub3JtYWxpemVkIGRpcmVjdGl2ZVxuICAgIC8vIG1ldGFkYXRhLCB3aGljaCBhbHdheXMgZmlsbHMgaW4gdGhlIHNlbGVjdG9yLlxuICAgIGNvbnN0IHRlbXBsYXRlID0gQ3NzU2VsZWN0b3IucGFyc2UoY29tcE1ldGEuc2VsZWN0b3IhKVswXS5nZXRNYXRjaGluZ0VsZW1lbnRUZW1wbGF0ZSgpO1xuICAgIGNvbnN0IHRlbXBsYXRlVXJsID0gJyc7XG4gICAgY29uc3QgaHRtbEFzdCA9IHRoaXMuX2h0bWxQYXJzZXIucGFyc2UodGVtcGxhdGUsIHRlbXBsYXRlVXJsKTtcbiAgICByZXR1cm4gY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YS5jcmVhdGUoe1xuICAgICAgaXNIb3N0OiB0cnVlLFxuICAgICAgdHlwZToge3JlZmVyZW5jZTogaG9zdFR5cGUsIGRpRGVwczogW10sIGxpZmVjeWNsZUhvb2tzOiBbXX0sXG4gICAgICB0ZW1wbGF0ZTogbmV3IGNwbC5Db21waWxlVGVtcGxhdGVNZXRhZGF0YSh7XG4gICAgICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgICAgIHRlbXBsYXRlLFxuICAgICAgICB0ZW1wbGF0ZVVybCxcbiAgICAgICAgaHRtbEFzdCxcbiAgICAgICAgc3R5bGVzOiBbXSxcbiAgICAgICAgc3R5bGVVcmxzOiBbXSxcbiAgICAgICAgbmdDb250ZW50U2VsZWN0b3JzOiBbXSxcbiAgICAgICAgYW5pbWF0aW9uczogW10sXG4gICAgICAgIGlzSW5saW5lOiB0cnVlLFxuICAgICAgICBleHRlcm5hbFN0eWxlc2hlZXRzOiBbXSxcbiAgICAgICAgaW50ZXJwb2xhdGlvbjogbnVsbCxcbiAgICAgICAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gICAgICB9KSxcbiAgICAgIGV4cG9ydEFzOiBudWxsLFxuICAgICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICAgICAgaW5wdXRzOiBbXSxcbiAgICAgIG91dHB1dHM6IFtdLFxuICAgICAgaG9zdDoge30sXG4gICAgICBpc0NvbXBvbmVudDogdHJ1ZSxcbiAgICAgIHNlbGVjdG9yOiAnKicsXG4gICAgICBwcm92aWRlcnM6IFtdLFxuICAgICAgdmlld1Byb3ZpZGVyczogW10sXG4gICAgICBxdWVyaWVzOiBbXSxcbiAgICAgIGd1YXJkczoge30sXG4gICAgICB2aWV3UXVlcmllczogW10sXG4gICAgICBjb21wb25lbnRWaWV3VHlwZTogaG9zdFZpZXdUeXBlLFxuICAgICAgcmVuZGVyZXJUeXBlOiB7aWQ6ICdfX0hvc3RfXycsIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsIHN0eWxlczogW10sIGRhdGE6IHt9fSBhc1xuICAgICAgICAgIG9iamVjdCxcbiAgICAgIGVudHJ5Q29tcG9uZW50czogW10sXG4gICAgICBjb21wb25lbnRGYWN0b3J5OiBudWxsXG4gICAgfSk7XG4gIH1cblxuICBsb2FkRGlyZWN0aXZlTWV0YWRhdGEobmdNb2R1bGVUeXBlOiBhbnksIGRpcmVjdGl2ZVR5cGU6IGFueSwgaXNTeW5jOiBib29sZWFuKTogU3luY0FzeW5jPG51bGw+IHtcbiAgICBpZiAodGhpcy5fZGlyZWN0aXZlQ2FjaGUuaGFzKGRpcmVjdGl2ZVR5cGUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZGlyZWN0aXZlVHlwZSA9IHJlc29sdmVGb3J3YXJkUmVmKGRpcmVjdGl2ZVR5cGUpO1xuICAgIGNvbnN0IHthbm5vdGF0aW9uLCBtZXRhZGF0YX0gPSB0aGlzLmdldE5vbk5vcm1hbGl6ZWREaXJlY3RpdmVNZXRhZGF0YShkaXJlY3RpdmVUeXBlKSE7XG5cbiAgICBjb25zdCBjcmVhdGVEaXJlY3RpdmVNZXRhZGF0YSA9ICh0ZW1wbGF0ZU1ldGFkYXRhOiBjcGwuQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGF8bnVsbCkgPT4ge1xuICAgICAgY29uc3Qgbm9ybWFsaXplZERpck1ldGEgPSBuZXcgY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSh7XG4gICAgICAgIGlzSG9zdDogZmFsc2UsXG4gICAgICAgIHR5cGU6IG1ldGFkYXRhLnR5cGUsXG4gICAgICAgIGlzQ29tcG9uZW50OiBtZXRhZGF0YS5pc0NvbXBvbmVudCxcbiAgICAgICAgc2VsZWN0b3I6IG1ldGFkYXRhLnNlbGVjdG9yLFxuICAgICAgICBleHBvcnRBczogbWV0YWRhdGEuZXhwb3J0QXMsXG4gICAgICAgIGNoYW5nZURldGVjdGlvbjogbWV0YWRhdGEuY2hhbmdlRGV0ZWN0aW9uLFxuICAgICAgICBpbnB1dHM6IG1ldGFkYXRhLmlucHV0cyxcbiAgICAgICAgb3V0cHV0czogbWV0YWRhdGEub3V0cHV0cyxcbiAgICAgICAgaG9zdExpc3RlbmVyczogbWV0YWRhdGEuaG9zdExpc3RlbmVycyxcbiAgICAgICAgaG9zdFByb3BlcnRpZXM6IG1ldGFkYXRhLmhvc3RQcm9wZXJ0aWVzLFxuICAgICAgICBob3N0QXR0cmlidXRlczogbWV0YWRhdGEuaG9zdEF0dHJpYnV0ZXMsXG4gICAgICAgIHByb3ZpZGVyczogbWV0YWRhdGEucHJvdmlkZXJzLFxuICAgICAgICB2aWV3UHJvdmlkZXJzOiBtZXRhZGF0YS52aWV3UHJvdmlkZXJzLFxuICAgICAgICBxdWVyaWVzOiBtZXRhZGF0YS5xdWVyaWVzLFxuICAgICAgICBndWFyZHM6IG1ldGFkYXRhLmd1YXJkcyxcbiAgICAgICAgdmlld1F1ZXJpZXM6IG1ldGFkYXRhLnZpZXdRdWVyaWVzLFxuICAgICAgICBlbnRyeUNvbXBvbmVudHM6IG1ldGFkYXRhLmVudHJ5Q29tcG9uZW50cyxcbiAgICAgICAgY29tcG9uZW50Vmlld1R5cGU6IG1ldGFkYXRhLmNvbXBvbmVudFZpZXdUeXBlLFxuICAgICAgICByZW5kZXJlclR5cGU6IG1ldGFkYXRhLnJlbmRlcmVyVHlwZSxcbiAgICAgICAgY29tcG9uZW50RmFjdG9yeTogbWV0YWRhdGEuY29tcG9uZW50RmFjdG9yeSxcbiAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlTWV0YWRhdGFcbiAgICAgIH0pO1xuICAgICAgaWYgKHRlbXBsYXRlTWV0YWRhdGEpIHtcbiAgICAgICAgdGhpcy5pbml0Q29tcG9uZW50RmFjdG9yeShtZXRhZGF0YS5jb21wb25lbnRGYWN0b3J5ISwgdGVtcGxhdGVNZXRhZGF0YS5uZ0NvbnRlbnRTZWxlY3RvcnMpO1xuICAgICAgfVxuICAgICAgdGhpcy5fZGlyZWN0aXZlQ2FjaGUuc2V0KGRpcmVjdGl2ZVR5cGUsIG5vcm1hbGl6ZWREaXJNZXRhKTtcbiAgICAgIHRoaXMuX3N1bW1hcnlDYWNoZS5zZXQoZGlyZWN0aXZlVHlwZSwgbm9ybWFsaXplZERpck1ldGEudG9TdW1tYXJ5KCkpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIGlmIChtZXRhZGF0YS5pc0NvbXBvbmVudCkge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBtZXRhZGF0YS50ZW1wbGF0ZSAhO1xuICAgICAgY29uc3QgdGVtcGxhdGVNZXRhID0gdGhpcy5fZGlyZWN0aXZlTm9ybWFsaXplci5ub3JtYWxpemVUZW1wbGF0ZSh7XG4gICAgICAgIG5nTW9kdWxlVHlwZSxcbiAgICAgICAgY29tcG9uZW50VHlwZTogZGlyZWN0aXZlVHlwZSxcbiAgICAgICAgbW9kdWxlVXJsOiB0aGlzLl9yZWZsZWN0b3IuY29tcG9uZW50TW9kdWxlVXJsKGRpcmVjdGl2ZVR5cGUsIGFubm90YXRpb24pLFxuICAgICAgICBlbmNhcHN1bGF0aW9uOiB0ZW1wbGF0ZS5lbmNhcHN1bGF0aW9uLFxuICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGUudGVtcGxhdGUsXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZS50ZW1wbGF0ZVVybCxcbiAgICAgICAgc3R5bGVzOiB0ZW1wbGF0ZS5zdHlsZXMsXG4gICAgICAgIHN0eWxlVXJsczogdGVtcGxhdGUuc3R5bGVVcmxzLFxuICAgICAgICBhbmltYXRpb25zOiB0ZW1wbGF0ZS5hbmltYXRpb25zLFxuICAgICAgICBpbnRlcnBvbGF0aW9uOiB0ZW1wbGF0ZS5pbnRlcnBvbGF0aW9uLFxuICAgICAgICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiB0ZW1wbGF0ZS5wcmVzZXJ2ZVdoaXRlc3BhY2VzXG4gICAgICB9KTtcbiAgICAgIGlmIChpc1Byb21pc2UodGVtcGxhdGVNZXRhKSAmJiBpc1N5bmMpIHtcbiAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoY29tcG9uZW50U3RpbGxMb2FkaW5nRXJyb3IoZGlyZWN0aXZlVHlwZSksIGRpcmVjdGl2ZVR5cGUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBTeW5jQXN5bmMudGhlbih0ZW1wbGF0ZU1ldGEsIGNyZWF0ZURpcmVjdGl2ZU1ldGFkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZGlyZWN0aXZlXG4gICAgICBjcmVhdGVEaXJlY3RpdmVNZXRhZGF0YShudWxsKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldE5vbk5vcm1hbGl6ZWREaXJlY3RpdmVNZXRhZGF0YShkaXJlY3RpdmVUeXBlOiBhbnkpOlxuICAgICAge2Fubm90YXRpb246IERpcmVjdGl2ZSwgbWV0YWRhdGE6IGNwbC5Db21waWxlRGlyZWN0aXZlTWV0YWRhdGF9fG51bGwge1xuICAgIGRpcmVjdGl2ZVR5cGUgPSByZXNvbHZlRm9yd2FyZFJlZihkaXJlY3RpdmVUeXBlKTtcbiAgICBpZiAoIWRpcmVjdGl2ZVR5cGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgY2FjaGVFbnRyeSA9IHRoaXMuX25vbk5vcm1hbGl6ZWREaXJlY3RpdmVDYWNoZS5nZXQoZGlyZWN0aXZlVHlwZSk7XG4gICAgaWYgKGNhY2hlRW50cnkpIHtcbiAgICAgIHJldHVybiBjYWNoZUVudHJ5O1xuICAgIH1cbiAgICBjb25zdCBkaXJNZXRhID0gdGhpcy5fZGlyZWN0aXZlUmVzb2x2ZXIucmVzb2x2ZShkaXJlY3RpdmVUeXBlLCBmYWxzZSk7XG4gICAgaWYgKCFkaXJNZXRhKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbGV0IG5vbk5vcm1hbGl6ZWRUZW1wbGF0ZU1ldGFkYXRhOiBjcGwuQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEgPSB1bmRlZmluZWQhO1xuXG4gICAgaWYgKGNyZWF0ZUNvbXBvbmVudC5pc1R5cGVPZihkaXJNZXRhKSkge1xuICAgICAgLy8gY29tcG9uZW50XG4gICAgICBjb25zdCBjb21wTWV0YSA9IGRpck1ldGEgYXMgQ29tcG9uZW50O1xuICAgICAgYXNzZXJ0QXJyYXlPZlN0cmluZ3MoJ3N0eWxlcycsIGNvbXBNZXRhLnN0eWxlcyk7XG4gICAgICBhc3NlcnRBcnJheU9mU3RyaW5ncygnc3R5bGVVcmxzJywgY29tcE1ldGEuc3R5bGVVcmxzKTtcbiAgICAgIGFzc2VydEludGVycG9sYXRpb25TeW1ib2xzKCdpbnRlcnBvbGF0aW9uJywgY29tcE1ldGEuaW50ZXJwb2xhdGlvbik7XG5cbiAgICAgIGNvbnN0IGFuaW1hdGlvbnMgPSBjb21wTWV0YS5hbmltYXRpb25zO1xuXG4gICAgICBub25Ob3JtYWxpemVkVGVtcGxhdGVNZXRhZGF0YSA9IG5ldyBjcGwuQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEoe1xuICAgICAgICBlbmNhcHN1bGF0aW9uOiBub1VuZGVmaW5lZChjb21wTWV0YS5lbmNhcHN1bGF0aW9uKSxcbiAgICAgICAgdGVtcGxhdGU6IG5vVW5kZWZpbmVkKGNvbXBNZXRhLnRlbXBsYXRlKSxcbiAgICAgICAgdGVtcGxhdGVVcmw6IG5vVW5kZWZpbmVkKGNvbXBNZXRhLnRlbXBsYXRlVXJsKSxcbiAgICAgICAgaHRtbEFzdDogbnVsbCxcbiAgICAgICAgc3R5bGVzOiBjb21wTWV0YS5zdHlsZXMgfHwgW10sXG4gICAgICAgIHN0eWxlVXJsczogY29tcE1ldGEuc3R5bGVVcmxzIHx8IFtdLFxuICAgICAgICBhbmltYXRpb25zOiBhbmltYXRpb25zIHx8IFtdLFxuICAgICAgICBpbnRlcnBvbGF0aW9uOiBub1VuZGVmaW5lZChjb21wTWV0YS5pbnRlcnBvbGF0aW9uKSxcbiAgICAgICAgaXNJbmxpbmU6ICEhY29tcE1ldGEudGVtcGxhdGUsXG4gICAgICAgIGV4dGVybmFsU3R5bGVzaGVldHM6IFtdLFxuICAgICAgICBuZ0NvbnRlbnRTZWxlY3RvcnM6IFtdLFxuICAgICAgICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBub1VuZGVmaW5lZChkaXJNZXRhLnByZXNlcnZlV2hpdGVzcGFjZXMpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IGNoYW5nZURldGVjdGlvblN0cmF0ZWd5OiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSA9IG51bGwhO1xuICAgIGxldCB2aWV3UHJvdmlkZXJzOiBjcGwuQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXSA9IFtdO1xuICAgIGxldCBlbnRyeUNvbXBvbmVudE1ldGFkYXRhOiBjcGwuQ29tcGlsZUVudHJ5Q29tcG9uZW50TWV0YWRhdGFbXSA9IFtdO1xuICAgIGxldCBzZWxlY3RvciA9IGRpck1ldGEuc2VsZWN0b3I7XG5cbiAgICBpZiAoY3JlYXRlQ29tcG9uZW50LmlzVHlwZU9mKGRpck1ldGEpKSB7XG4gICAgICAvLyBDb21wb25lbnRcbiAgICAgIGNvbnN0IGNvbXBNZXRhID0gZGlyTWV0YSBhcyBDb21wb25lbnQ7XG4gICAgICBjaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSA9IGNvbXBNZXRhLmNoYW5nZURldGVjdGlvbiE7XG4gICAgICBpZiAoY29tcE1ldGEudmlld1Byb3ZpZGVycykge1xuICAgICAgICB2aWV3UHJvdmlkZXJzID0gdGhpcy5fZ2V0UHJvdmlkZXJzTWV0YWRhdGEoXG4gICAgICAgICAgICBjb21wTWV0YS52aWV3UHJvdmlkZXJzLCBlbnRyeUNvbXBvbmVudE1ldGFkYXRhLFxuICAgICAgICAgICAgYHZpZXdQcm92aWRlcnMgZm9yIFwiJHtzdHJpbmdpZnlUeXBlKGRpcmVjdGl2ZVR5cGUpfVwiYCwgW10sIGRpcmVjdGl2ZVR5cGUpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbXBNZXRhLmVudHJ5Q29tcG9uZW50cykge1xuICAgICAgICBlbnRyeUNvbXBvbmVudE1ldGFkYXRhID0gZmxhdHRlbkFuZERlZHVwZUFycmF5KGNvbXBNZXRhLmVudHJ5Q29tcG9uZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCh0eXBlKSA9PiB0aGlzLl9nZXRFbnRyeUNvbXBvbmVudE1ldGFkYXRhKHR5cGUpISlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KGVudHJ5Q29tcG9uZW50TWV0YWRhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgICBzZWxlY3RvciA9IHRoaXMuX3NjaGVtYVJlZ2lzdHJ5LmdldERlZmF1bHRDb21wb25lbnRFbGVtZW50TmFtZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEaXJlY3RpdmVcbiAgICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgICAgc2VsZWN0b3IgPSBudWxsITtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcHJvdmlkZXJzOiBjcGwuQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXSA9IFtdO1xuICAgIGlmIChkaXJNZXRhLnByb3ZpZGVycyAhPSBudWxsKSB7XG4gICAgICBwcm92aWRlcnMgPSB0aGlzLl9nZXRQcm92aWRlcnNNZXRhZGF0YShcbiAgICAgICAgICBkaXJNZXRhLnByb3ZpZGVycywgZW50cnlDb21wb25lbnRNZXRhZGF0YSxcbiAgICAgICAgICBgcHJvdmlkZXJzIGZvciBcIiR7c3RyaW5naWZ5VHlwZShkaXJlY3RpdmVUeXBlKX1cImAsIFtdLCBkaXJlY3RpdmVUeXBlKTtcbiAgICB9XG4gICAgbGV0IHF1ZXJpZXM6IGNwbC5Db21waWxlUXVlcnlNZXRhZGF0YVtdID0gW107XG4gICAgbGV0IHZpZXdRdWVyaWVzOiBjcGwuQ29tcGlsZVF1ZXJ5TWV0YWRhdGFbXSA9IFtdO1xuICAgIGlmIChkaXJNZXRhLnF1ZXJpZXMgIT0gbnVsbCkge1xuICAgICAgcXVlcmllcyA9IHRoaXMuX2dldFF1ZXJpZXNNZXRhZGF0YShkaXJNZXRhLnF1ZXJpZXMsIGZhbHNlLCBkaXJlY3RpdmVUeXBlKTtcbiAgICAgIHZpZXdRdWVyaWVzID0gdGhpcy5fZ2V0UXVlcmllc01ldGFkYXRhKGRpck1ldGEucXVlcmllcywgdHJ1ZSwgZGlyZWN0aXZlVHlwZSk7XG4gICAgfVxuXG4gICAgY29uc3QgbWV0YWRhdGEgPSBjcGwuQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLmNyZWF0ZSh7XG4gICAgICBpc0hvc3Q6IGZhbHNlLFxuICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgICAgZXhwb3J0QXM6IG5vVW5kZWZpbmVkKGRpck1ldGEuZXhwb3J0QXMpLFxuICAgICAgaXNDb21wb25lbnQ6ICEhbm9uTm9ybWFsaXplZFRlbXBsYXRlTWV0YWRhdGEsXG4gICAgICB0eXBlOiB0aGlzLl9nZXRUeXBlTWV0YWRhdGEoZGlyZWN0aXZlVHlwZSksXG4gICAgICB0ZW1wbGF0ZTogbm9uTm9ybWFsaXplZFRlbXBsYXRlTWV0YWRhdGEsXG4gICAgICBjaGFuZ2VEZXRlY3Rpb246IGNoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgICAgaW5wdXRzOiBkaXJNZXRhLmlucHV0cyB8fCBbXSxcbiAgICAgIG91dHB1dHM6IGRpck1ldGEub3V0cHV0cyB8fCBbXSxcbiAgICAgIGhvc3Q6IGRpck1ldGEuaG9zdCB8fCB7fSxcbiAgICAgIHByb3ZpZGVyczogcHJvdmlkZXJzIHx8IFtdLFxuICAgICAgdmlld1Byb3ZpZGVyczogdmlld1Byb3ZpZGVycyB8fCBbXSxcbiAgICAgIHF1ZXJpZXM6IHF1ZXJpZXMgfHwgW10sXG4gICAgICBndWFyZHM6IGRpck1ldGEuZ3VhcmRzIHx8IHt9LFxuICAgICAgdmlld1F1ZXJpZXM6IHZpZXdRdWVyaWVzIHx8IFtdLFxuICAgICAgZW50cnlDb21wb25lbnRzOiBlbnRyeUNvbXBvbmVudE1ldGFkYXRhLFxuICAgICAgY29tcG9uZW50Vmlld1R5cGU6IG5vbk5vcm1hbGl6ZWRUZW1wbGF0ZU1ldGFkYXRhID8gdGhpcy5nZXRDb21wb25lbnRWaWV3Q2xhc3MoZGlyZWN0aXZlVHlwZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgIHJlbmRlcmVyVHlwZTogbm9uTm9ybWFsaXplZFRlbXBsYXRlTWV0YWRhdGEgPyB0aGlzLmdldFJlbmRlcmVyVHlwZShkaXJlY3RpdmVUeXBlKSA6IG51bGwsXG4gICAgICBjb21wb25lbnRGYWN0b3J5OiBudWxsXG4gICAgfSk7XG4gICAgaWYgKG5vbk5vcm1hbGl6ZWRUZW1wbGF0ZU1ldGFkYXRhKSB7XG4gICAgICBtZXRhZGF0YS5jb21wb25lbnRGYWN0b3J5ID1cbiAgICAgICAgICB0aGlzLmdldENvbXBvbmVudEZhY3Rvcnkoc2VsZWN0b3IsIGRpcmVjdGl2ZVR5cGUsIG1ldGFkYXRhLmlucHV0cywgbWV0YWRhdGEub3V0cHV0cyk7XG4gICAgfVxuICAgIGNhY2hlRW50cnkgPSB7bWV0YWRhdGEsIGFubm90YXRpb246IGRpck1ldGF9O1xuICAgIHRoaXMuX25vbk5vcm1hbGl6ZWREaXJlY3RpdmVDYWNoZS5zZXQoZGlyZWN0aXZlVHlwZSwgY2FjaGVFbnRyeSk7XG4gICAgcmV0dXJuIGNhY2hlRW50cnk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbWV0YWRhdGEgZm9yIHRoZSBnaXZlbiBkaXJlY3RpdmUuXG4gICAqIFRoaXMgYXNzdW1lcyBgbG9hZE5nTW9kdWxlRGlyZWN0aXZlQW5kUGlwZU1ldGFkYXRhYCBoYXMgYmVlbiBjYWxsZWQgZmlyc3QuXG4gICAqL1xuICBnZXREaXJlY3RpdmVNZXRhZGF0YShkaXJlY3RpdmVUeXBlOiBhbnkpOiBjcGwuQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhIHtcbiAgICBjb25zdCBkaXJNZXRhID0gdGhpcy5fZGlyZWN0aXZlQ2FjaGUuZ2V0KGRpcmVjdGl2ZVR5cGUpITtcbiAgICBpZiAoIWRpck1ldGEpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgIHN5bnRheEVycm9yKFxuICAgICAgICAgICAgICBgSWxsZWdhbCBzdGF0ZTogZ2V0RGlyZWN0aXZlTWV0YWRhdGEgY2FuIG9ubHkgYmUgY2FsbGVkIGFmdGVyIGxvYWROZ01vZHVsZURpcmVjdGl2ZUFuZFBpcGVNZXRhZGF0YSBmb3IgYSBtb2R1bGUgdGhhdCBkZWNsYXJlcyBpdC4gRGlyZWN0aXZlICR7XG4gICAgICAgICAgICAgICAgICBzdHJpbmdpZnlUeXBlKGRpcmVjdGl2ZVR5cGUpfS5gKSxcbiAgICAgICAgICBkaXJlY3RpdmVUeXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpck1ldGE7XG4gIH1cblxuICBnZXREaXJlY3RpdmVTdW1tYXJ5KGRpclR5cGU6IGFueSk6IGNwbC5Db21waWxlRGlyZWN0aXZlU3VtbWFyeSB7XG4gICAgY29uc3QgZGlyU3VtbWFyeSA9XG4gICAgICAgIDxjcGwuQ29tcGlsZURpcmVjdGl2ZVN1bW1hcnk+dGhpcy5fbG9hZFN1bW1hcnkoZGlyVHlwZSwgY3BsLkNvbXBpbGVTdW1tYXJ5S2luZC5EaXJlY3RpdmUpO1xuICAgIGlmICghZGlyU3VtbWFyeSkge1xuICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgc3ludGF4RXJyb3IoXG4gICAgICAgICAgICAgIGBJbGxlZ2FsIHN0YXRlOiBDb3VsZCBub3QgbG9hZCB0aGUgc3VtbWFyeSBmb3IgZGlyZWN0aXZlICR7c3RyaW5naWZ5VHlwZShkaXJUeXBlKX0uYCksXG4gICAgICAgICAgZGlyVHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBkaXJTdW1tYXJ5O1xuICB9XG5cbiAgaXNEaXJlY3RpdmUodHlwZTogYW55KSB7XG4gICAgcmV0dXJuICEhdGhpcy5fbG9hZFN1bW1hcnkodHlwZSwgY3BsLkNvbXBpbGVTdW1tYXJ5S2luZC5EaXJlY3RpdmUpIHx8XG4gICAgICAgIHRoaXMuX2RpcmVjdGl2ZVJlc29sdmVyLmlzRGlyZWN0aXZlKHR5cGUpO1xuICB9XG5cbiAgaXNBYnN0cmFjdERpcmVjdGl2ZSh0eXBlOiBhbnkpOiBib29sZWFuIHtcbiAgICBjb25zdCBzdW1tYXJ5ID1cbiAgICAgICAgdGhpcy5fbG9hZFN1bW1hcnkodHlwZSwgY3BsLkNvbXBpbGVTdW1tYXJ5S2luZC5EaXJlY3RpdmUpIGFzIGNwbC5Db21waWxlRGlyZWN0aXZlU3VtbWFyeTtcbiAgICBpZiAoc3VtbWFyeSAmJiAhc3VtbWFyeS5pc0NvbXBvbmVudCkge1xuICAgICAgcmV0dXJuICFzdW1tYXJ5LnNlbGVjdG9yO1xuICAgIH1cblxuICAgIGNvbnN0IG1ldGEgPSB0aGlzLl9kaXJlY3RpdmVSZXNvbHZlci5yZXNvbHZlKHR5cGUsIGZhbHNlKTtcbiAgICBpZiAobWV0YSAmJiAhY3JlYXRlQ29tcG9uZW50LmlzVHlwZU9mKG1ldGEpKSB7XG4gICAgICByZXR1cm4gIW1ldGEuc2VsZWN0b3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNQaXBlKHR5cGU6IGFueSkge1xuICAgIHJldHVybiAhIXRoaXMuX2xvYWRTdW1tYXJ5KHR5cGUsIGNwbC5Db21waWxlU3VtbWFyeUtpbmQuUGlwZSkgfHxcbiAgICAgICAgdGhpcy5fcGlwZVJlc29sdmVyLmlzUGlwZSh0eXBlKTtcbiAgfVxuXG4gIGlzTmdNb2R1bGUodHlwZTogYW55KSB7XG4gICAgcmV0dXJuICEhdGhpcy5fbG9hZFN1bW1hcnkodHlwZSwgY3BsLkNvbXBpbGVTdW1tYXJ5S2luZC5OZ01vZHVsZSkgfHxcbiAgICAgICAgdGhpcy5fbmdNb2R1bGVSZXNvbHZlci5pc05nTW9kdWxlKHR5cGUpO1xuICB9XG5cbiAgZ2V0TmdNb2R1bGVTdW1tYXJ5KG1vZHVsZVR5cGU6IGFueSwgYWxyZWFkeUNvbGxlY3Rpbmc6IFNldDxhbnk+fG51bGwgPSBudWxsKTpcbiAgICAgIGNwbC5Db21waWxlTmdNb2R1bGVTdW1tYXJ5fG51bGwge1xuICAgIGxldCBtb2R1bGVTdW1tYXJ5OiBjcGwuQ29tcGlsZU5nTW9kdWxlU3VtbWFyeXxudWxsID1cbiAgICAgICAgPGNwbC5Db21waWxlTmdNb2R1bGVTdW1tYXJ5PnRoaXMuX2xvYWRTdW1tYXJ5KG1vZHVsZVR5cGUsIGNwbC5Db21waWxlU3VtbWFyeUtpbmQuTmdNb2R1bGUpO1xuICAgIGlmICghbW9kdWxlU3VtbWFyeSkge1xuICAgICAgY29uc3QgbW9kdWxlTWV0YSA9IHRoaXMuZ2V0TmdNb2R1bGVNZXRhZGF0YShtb2R1bGVUeXBlLCBmYWxzZSwgYWxyZWFkeUNvbGxlY3RpbmcpO1xuICAgICAgbW9kdWxlU3VtbWFyeSA9IG1vZHVsZU1ldGEgPyBtb2R1bGVNZXRhLnRvU3VtbWFyeSgpIDogbnVsbDtcbiAgICAgIGlmIChtb2R1bGVTdW1tYXJ5KSB7XG4gICAgICAgIHRoaXMuX3N1bW1hcnlDYWNoZS5zZXQobW9kdWxlVHlwZSwgbW9kdWxlU3VtbWFyeSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb2R1bGVTdW1tYXJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBkZWNsYXJlZCBkaXJlY3RpdmVzIGFuZCBwaXBlcyBvZiBhbiBOZ01vZHVsZS5cbiAgICovXG4gIGxvYWROZ01vZHVsZURpcmVjdGl2ZUFuZFBpcGVNZXRhZGF0YShtb2R1bGVUeXBlOiBhbnksIGlzU3luYzogYm9vbGVhbiwgdGhyb3dJZk5vdEZvdW5kID0gdHJ1ZSk6XG4gICAgICBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IG5nTW9kdWxlID0gdGhpcy5nZXROZ01vZHVsZU1ldGFkYXRhKG1vZHVsZVR5cGUsIHRocm93SWZOb3RGb3VuZCk7XG4gICAgY29uc3QgbG9hZGluZzogUHJvbWlzZTxhbnk+W10gPSBbXTtcbiAgICBpZiAobmdNb2R1bGUpIHtcbiAgICAgIG5nTW9kdWxlLmRlY2xhcmVkRGlyZWN0aXZlcy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9taXNlID0gdGhpcy5sb2FkRGlyZWN0aXZlTWV0YWRhdGEobW9kdWxlVHlwZSwgaWQucmVmZXJlbmNlLCBpc1N5bmMpO1xuICAgICAgICBpZiAocHJvbWlzZSkge1xuICAgICAgICAgIGxvYWRpbmcucHVzaChwcm9taXNlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBuZ01vZHVsZS5kZWNsYXJlZFBpcGVzLmZvckVhY2goKGlkKSA9PiB0aGlzLl9sb2FkUGlwZU1ldGFkYXRhKGlkLnJlZmVyZW5jZSkpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwobG9hZGluZyk7XG4gIH1cblxuICBnZXRTaGFsbG93TW9kdWxlTWV0YWRhdGEobW9kdWxlVHlwZTogYW55KTogY3BsLkNvbXBpbGVTaGFsbG93TW9kdWxlTWV0YWRhdGF8bnVsbCB7XG4gICAgbGV0IGNvbXBpbGVNZXRhID0gdGhpcy5fc2hhbGxvd01vZHVsZUNhY2hlLmdldChtb2R1bGVUeXBlKTtcbiAgICBpZiAoY29tcGlsZU1ldGEpIHtcbiAgICAgIHJldHVybiBjb21waWxlTWV0YTtcbiAgICB9XG5cbiAgICBjb25zdCBuZ01vZHVsZU1ldGEgPVxuICAgICAgICBmaW5kTGFzdCh0aGlzLl9yZWZsZWN0b3Iuc2hhbGxvd0Fubm90YXRpb25zKG1vZHVsZVR5cGUpLCBjcmVhdGVOZ01vZHVsZS5pc1R5cGVPZik7XG5cbiAgICBjb21waWxlTWV0YSA9IHtcbiAgICAgIHR5cGU6IHRoaXMuX2dldFR5cGVNZXRhZGF0YShtb2R1bGVUeXBlKSxcbiAgICAgIHJhd0V4cG9ydHM6IG5nTW9kdWxlTWV0YS5leHBvcnRzLFxuICAgICAgcmF3SW1wb3J0czogbmdNb2R1bGVNZXRhLmltcG9ydHMsXG4gICAgICByYXdQcm92aWRlcnM6IG5nTW9kdWxlTWV0YS5wcm92aWRlcnMsXG4gICAgfTtcblxuICAgIHRoaXMuX3NoYWxsb3dNb2R1bGVDYWNoZS5zZXQobW9kdWxlVHlwZSwgY29tcGlsZU1ldGEpO1xuICAgIHJldHVybiBjb21waWxlTWV0YTtcbiAgfVxuXG4gIGdldE5nTW9kdWxlTWV0YWRhdGEoXG4gICAgICBtb2R1bGVUeXBlOiBhbnksIHRocm93SWZOb3RGb3VuZCA9IHRydWUsXG4gICAgICBhbHJlYWR5Q29sbGVjdGluZzogU2V0PGFueT58bnVsbCA9IG51bGwpOiBjcGwuQ29tcGlsZU5nTW9kdWxlTWV0YWRhdGF8bnVsbCB7XG4gICAgbW9kdWxlVHlwZSA9IHJlc29sdmVGb3J3YXJkUmVmKG1vZHVsZVR5cGUpO1xuICAgIGxldCBjb21waWxlTWV0YSA9IHRoaXMuX25nTW9kdWxlQ2FjaGUuZ2V0KG1vZHVsZVR5cGUpO1xuICAgIGlmIChjb21waWxlTWV0YSkge1xuICAgICAgcmV0dXJuIGNvbXBpbGVNZXRhO1xuICAgIH1cbiAgICBjb25zdCBtZXRhID0gdGhpcy5fbmdNb2R1bGVSZXNvbHZlci5yZXNvbHZlKG1vZHVsZVR5cGUsIHRocm93SWZOb3RGb3VuZCk7XG4gICAgaWYgKCFtZXRhKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGVjbGFyZWREaXJlY3RpdmVzOiBjcGwuQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdID0gW107XG4gICAgY29uc3QgZXhwb3J0ZWROb25Nb2R1bGVJZGVudGlmaWVyczogY3BsLkNvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGFbXSA9IFtdO1xuICAgIGNvbnN0IGRlY2xhcmVkUGlwZXM6IGNwbC5Db21waWxlSWRlbnRpZmllck1ldGFkYXRhW10gPSBbXTtcbiAgICBjb25zdCBpbXBvcnRlZE1vZHVsZXM6IGNwbC5Db21waWxlTmdNb2R1bGVTdW1tYXJ5W10gPSBbXTtcbiAgICBjb25zdCBleHBvcnRlZE1vZHVsZXM6IGNwbC5Db21waWxlTmdNb2R1bGVTdW1tYXJ5W10gPSBbXTtcbiAgICBjb25zdCBwcm92aWRlcnM6IGNwbC5Db21waWxlUHJvdmlkZXJNZXRhZGF0YVtdID0gW107XG4gICAgY29uc3QgZW50cnlDb21wb25lbnRzOiBjcGwuQ29tcGlsZUVudHJ5Q29tcG9uZW50TWV0YWRhdGFbXSA9IFtdO1xuICAgIGNvbnN0IGJvb3RzdHJhcENvbXBvbmVudHM6IGNwbC5Db21waWxlSWRlbnRpZmllck1ldGFkYXRhW10gPSBbXTtcbiAgICBjb25zdCBzY2hlbWFzOiBTY2hlbWFNZXRhZGF0YVtdID0gW107XG5cbiAgICBpZiAobWV0YS5pbXBvcnRzKSB7XG4gICAgICBmbGF0dGVuQW5kRGVkdXBlQXJyYXkobWV0YS5pbXBvcnRzKS5mb3JFYWNoKChpbXBvcnRlZFR5cGUpID0+IHtcbiAgICAgICAgbGV0IGltcG9ydGVkTW9kdWxlVHlwZTogVHlwZSA9IHVuZGVmaW5lZCE7XG4gICAgICAgIGlmIChpc1ZhbGlkVHlwZShpbXBvcnRlZFR5cGUpKSB7XG4gICAgICAgICAgaW1wb3J0ZWRNb2R1bGVUeXBlID0gaW1wb3J0ZWRUeXBlO1xuICAgICAgICB9IGVsc2UgaWYgKGltcG9ydGVkVHlwZSAmJiBpbXBvcnRlZFR5cGUubmdNb2R1bGUpIHtcbiAgICAgICAgICBjb25zdCBtb2R1bGVXaXRoUHJvdmlkZXJzOiBNb2R1bGVXaXRoUHJvdmlkZXJzID0gaW1wb3J0ZWRUeXBlO1xuICAgICAgICAgIGltcG9ydGVkTW9kdWxlVHlwZSA9IG1vZHVsZVdpdGhQcm92aWRlcnMubmdNb2R1bGU7XG4gICAgICAgICAgaWYgKG1vZHVsZVdpdGhQcm92aWRlcnMucHJvdmlkZXJzKSB7XG4gICAgICAgICAgICBwcm92aWRlcnMucHVzaCguLi50aGlzLl9nZXRQcm92aWRlcnNNZXRhZGF0YShcbiAgICAgICAgICAgICAgICBtb2R1bGVXaXRoUHJvdmlkZXJzLnByb3ZpZGVycywgZW50cnlDb21wb25lbnRzLFxuICAgICAgICAgICAgICAgIGBwcm92aWRlciBmb3IgdGhlIE5nTW9kdWxlICcke3N0cmluZ2lmeVR5cGUoaW1wb3J0ZWRNb2R1bGVUeXBlKX0nYCwgW10sXG4gICAgICAgICAgICAgICAgaW1wb3J0ZWRUeXBlKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltcG9ydGVkTW9kdWxlVHlwZSkge1xuICAgICAgICAgIGlmICh0aGlzLl9jaGVja1NlbGZJbXBvcnQobW9kdWxlVHlwZSwgaW1wb3J0ZWRNb2R1bGVUeXBlKSkgcmV0dXJuO1xuICAgICAgICAgIGlmICghYWxyZWFkeUNvbGxlY3RpbmcpIGFscmVhZHlDb2xsZWN0aW5nID0gbmV3IFNldCgpO1xuICAgICAgICAgIGlmIChhbHJlYWR5Q29sbGVjdGluZy5oYXMoaW1wb3J0ZWRNb2R1bGVUeXBlKSkge1xuICAgICAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgICAgICAgc3ludGF4RXJyb3IoYCR7dGhpcy5fZ2V0VHlwZURlc2NyaXB0b3IoaW1wb3J0ZWRNb2R1bGVUeXBlKX0gJyR7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ2lmeVR5cGUoaW1wb3J0ZWRUeXBlKX0nIGlzIGltcG9ydGVkIHJlY3Vyc2l2ZWx5IGJ5IHRoZSBtb2R1bGUgJyR7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ2lmeVR5cGUobW9kdWxlVHlwZSl9Jy5gKSxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYWxyZWFkeUNvbGxlY3RpbmcuYWRkKGltcG9ydGVkTW9kdWxlVHlwZSk7XG4gICAgICAgICAgY29uc3QgaW1wb3J0ZWRNb2R1bGVTdW1tYXJ5ID1cbiAgICAgICAgICAgICAgdGhpcy5nZXROZ01vZHVsZVN1bW1hcnkoaW1wb3J0ZWRNb2R1bGVUeXBlLCBhbHJlYWR5Q29sbGVjdGluZyk7XG4gICAgICAgICAgYWxyZWFkeUNvbGxlY3RpbmcuZGVsZXRlKGltcG9ydGVkTW9kdWxlVHlwZSk7XG4gICAgICAgICAgaWYgKCFpbXBvcnRlZE1vZHVsZVN1bW1hcnkpIHtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IHN5bnRheEVycm9yKGBVbmV4cGVjdGVkICR7dGhpcy5fZ2V0VHlwZURlc2NyaXB0b3IoaW1wb3J0ZWRUeXBlKX0gJyR7XG4gICAgICAgICAgICAgICAgc3RyaW5naWZ5VHlwZShpbXBvcnRlZFR5cGUpfScgaW1wb3J0ZWQgYnkgdGhlIG1vZHVsZSAnJHtcbiAgICAgICAgICAgICAgICBzdHJpbmdpZnlUeXBlKG1vZHVsZVR5cGUpfScuIFBsZWFzZSBhZGQgYSBATmdNb2R1bGUgYW5ub3RhdGlvbi5gKTtcbiAgICAgICAgICAgIC8vIElmIHBvc3NpYmxlLCByZWNvcmQgYWRkaXRpb25hbCBjb250ZXh0IGZvciB0aGlzIGVycm9yIHRvIGVuYWJsZSBtb3JlIHVzZWZ1bFxuICAgICAgICAgICAgLy8gZGlhZ25vc3RpY3Mgb24gdGhlIGNvbXBpbGVyIHNpZGUuXG4gICAgICAgICAgICBpZiAoaW1wb3J0ZWRUeXBlIGluc3RhbmNlb2YgU3RhdGljU3ltYm9sKSB7XG4gICAgICAgICAgICAgIChlcnIgYXMgYW55KVtNSVNTSU5HX05HX01PRFVMRV9NRVRBREFUQV9FUlJPUl9EQVRBXSA9IHtcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogaW1wb3J0ZWRUeXBlLmZpbGVQYXRoLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogaW1wb3J0ZWRUeXBlLm5hbWUsXG4gICAgICAgICAgICAgIH0gYXMgTWlzc2luZ05nTW9kdWxlTWV0YWRhdGFFcnJvckRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihlcnIsIG1vZHVsZVR5cGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbXBvcnRlZE1vZHVsZXMucHVzaChpbXBvcnRlZE1vZHVsZVN1bW1hcnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBVbmV4cGVjdGVkIHZhbHVlICcke3N0cmluZ2lmeVR5cGUoaW1wb3J0ZWRUeXBlKX0nIGltcG9ydGVkIGJ5IHRoZSBtb2R1bGUgJyR7XG4gICAgICAgICAgICAgICAgICAgICAgc3RyaW5naWZ5VHlwZShtb2R1bGVUeXBlKX0nYCksXG4gICAgICAgICAgICAgIG1vZHVsZVR5cGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG1ldGEuZXhwb3J0cykge1xuICAgICAgZmxhdHRlbkFuZERlZHVwZUFycmF5KG1ldGEuZXhwb3J0cykuZm9yRWFjaCgoZXhwb3J0ZWRUeXBlKSA9PiB7XG4gICAgICAgIGlmICghaXNWYWxpZFR5cGUoZXhwb3J0ZWRUeXBlKSkge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBVbmV4cGVjdGVkIHZhbHVlICcke3N0cmluZ2lmeVR5cGUoZXhwb3J0ZWRUeXBlKX0nIGV4cG9ydGVkIGJ5IHRoZSBtb2R1bGUgJyR7XG4gICAgICAgICAgICAgICAgICAgICAgc3RyaW5naWZ5VHlwZShtb2R1bGVUeXBlKX0nYCksXG4gICAgICAgICAgICAgIG1vZHVsZVR5cGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWFscmVhZHlDb2xsZWN0aW5nKSBhbHJlYWR5Q29sbGVjdGluZyA9IG5ldyBTZXQoKTtcbiAgICAgICAgaWYgKGFscmVhZHlDb2xsZWN0aW5nLmhhcyhleHBvcnRlZFR5cGUpKSB7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgICAgIHN5bnRheEVycm9yKGAke3RoaXMuX2dldFR5cGVEZXNjcmlwdG9yKGV4cG9ydGVkVHlwZSl9ICcke1xuICAgICAgICAgICAgICAgICAgc3RyaW5naWZ5KGV4cG9ydGVkVHlwZSl9JyBpcyBleHBvcnRlZCByZWN1cnNpdmVseSBieSB0aGUgbW9kdWxlICcke1xuICAgICAgICAgICAgICAgICAgc3RyaW5naWZ5VHlwZShtb2R1bGVUeXBlKX0nYCksXG4gICAgICAgICAgICAgIG1vZHVsZVR5cGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhbHJlYWR5Q29sbGVjdGluZy5hZGQoZXhwb3J0ZWRUeXBlKTtcbiAgICAgICAgY29uc3QgZXhwb3J0ZWRNb2R1bGVTdW1tYXJ5ID0gdGhpcy5nZXROZ01vZHVsZVN1bW1hcnkoZXhwb3J0ZWRUeXBlLCBhbHJlYWR5Q29sbGVjdGluZyk7XG4gICAgICAgIGFscmVhZHlDb2xsZWN0aW5nLmRlbGV0ZShleHBvcnRlZFR5cGUpO1xuICAgICAgICBpZiAoZXhwb3J0ZWRNb2R1bGVTdW1tYXJ5KSB7XG4gICAgICAgICAgZXhwb3J0ZWRNb2R1bGVzLnB1c2goZXhwb3J0ZWRNb2R1bGVTdW1tYXJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHBvcnRlZE5vbk1vZHVsZUlkZW50aWZpZXJzLnB1c2godGhpcy5fZ2V0SWRlbnRpZmllck1ldGFkYXRhKGV4cG9ydGVkVHlwZSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBOb3RlOiBUaGlzIHdpbGwgYmUgbW9kaWZpZWQgbGF0ZXIsIHNvIHdlIHJlbHkgb25cbiAgICAvLyBnZXR0aW5nIGEgbmV3IGluc3RhbmNlIGV2ZXJ5IHRpbWUhXG4gICAgY29uc3QgdHJhbnNpdGl2ZU1vZHVsZSA9IHRoaXMuX2dldFRyYW5zaXRpdmVOZ01vZHVsZU1ldGFkYXRhKGltcG9ydGVkTW9kdWxlcywgZXhwb3J0ZWRNb2R1bGVzKTtcbiAgICBpZiAobWV0YS5kZWNsYXJhdGlvbnMpIHtcbiAgICAgIGZsYXR0ZW5BbmREZWR1cGVBcnJheShtZXRhLmRlY2xhcmF0aW9ucykuZm9yRWFjaCgoZGVjbGFyZWRUeXBlKSA9PiB7XG4gICAgICAgIGlmICghaXNWYWxpZFR5cGUoZGVjbGFyZWRUeXBlKSkge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBVbmV4cGVjdGVkIHZhbHVlICcke3N0cmluZ2lmeVR5cGUoZGVjbGFyZWRUeXBlKX0nIGRlY2xhcmVkIGJ5IHRoZSBtb2R1bGUgJyR7XG4gICAgICAgICAgICAgICAgICAgICAgc3RyaW5naWZ5VHlwZShtb2R1bGVUeXBlKX0nYCksXG4gICAgICAgICAgICAgIG1vZHVsZVR5cGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWNsYXJlZElkZW50aWZpZXIgPSB0aGlzLl9nZXRJZGVudGlmaWVyTWV0YWRhdGEoZGVjbGFyZWRUeXBlKTtcbiAgICAgICAgaWYgKHRoaXMuaXNEaXJlY3RpdmUoZGVjbGFyZWRUeXBlKSkge1xuICAgICAgICAgIGlmICh0aGlzLmlzQWJzdHJhY3REaXJlY3RpdmUoZGVjbGFyZWRUeXBlKSkge1xuICAgICAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgICAgICAgc3ludGF4RXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBEaXJlY3RpdmUgJHtzdHJpbmdpZnlUeXBlKGRlY2xhcmVkVHlwZSl9IGhhcyBubyBzZWxlY3RvciwgcGxlYXNlIGFkZCBpdCFgKSxcbiAgICAgICAgICAgICAgICBkZWNsYXJlZFR5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0cmFuc2l0aXZlTW9kdWxlLmFkZERpcmVjdGl2ZShkZWNsYXJlZElkZW50aWZpZXIpO1xuICAgICAgICAgIGRlY2xhcmVkRGlyZWN0aXZlcy5wdXNoKGRlY2xhcmVkSWRlbnRpZmllcik7XG4gICAgICAgICAgdGhpcy5fYWRkVHlwZVRvTW9kdWxlKGRlY2xhcmVkVHlwZSwgbW9kdWxlVHlwZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1BpcGUoZGVjbGFyZWRUeXBlKSkge1xuICAgICAgICAgIHRyYW5zaXRpdmVNb2R1bGUuYWRkUGlwZShkZWNsYXJlZElkZW50aWZpZXIpO1xuICAgICAgICAgIHRyYW5zaXRpdmVNb2R1bGUucGlwZXMucHVzaChkZWNsYXJlZElkZW50aWZpZXIpO1xuICAgICAgICAgIGRlY2xhcmVkUGlwZXMucHVzaChkZWNsYXJlZElkZW50aWZpZXIpO1xuICAgICAgICAgIHRoaXMuX2FkZFR5cGVUb01vZHVsZShkZWNsYXJlZFR5cGUsIG1vZHVsZVR5cGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgICBzeW50YXhFcnJvcihgVW5leHBlY3RlZCAke3RoaXMuX2dldFR5cGVEZXNjcmlwdG9yKGRlY2xhcmVkVHlwZSl9ICcke1xuICAgICAgICAgICAgICAgICAgc3RyaW5naWZ5VHlwZShkZWNsYXJlZFR5cGUpfScgZGVjbGFyZWQgYnkgdGhlIG1vZHVsZSAnJHtcbiAgICAgICAgICAgICAgICAgIHN0cmluZ2lmeVR5cGUoXG4gICAgICAgICAgICAgICAgICAgICAgbW9kdWxlVHlwZSl9Jy4gUGxlYXNlIGFkZCBhIEBQaXBlL0BEaXJlY3RpdmUvQENvbXBvbmVudCBhbm5vdGF0aW9uLmApLFxuICAgICAgICAgICAgICBtb2R1bGVUeXBlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGV4cG9ydGVkRGlyZWN0aXZlczogY3BsLkNvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGFbXSA9IFtdO1xuICAgIGNvbnN0IGV4cG9ydGVkUGlwZXM6IGNwbC5Db21waWxlSWRlbnRpZmllck1ldGFkYXRhW10gPSBbXTtcbiAgICBleHBvcnRlZE5vbk1vZHVsZUlkZW50aWZpZXJzLmZvckVhY2goKGV4cG9ydGVkSWQpID0+IHtcbiAgICAgIGlmICh0cmFuc2l0aXZlTW9kdWxlLmRpcmVjdGl2ZXNTZXQuaGFzKGV4cG9ydGVkSWQucmVmZXJlbmNlKSkge1xuICAgICAgICBleHBvcnRlZERpcmVjdGl2ZXMucHVzaChleHBvcnRlZElkKTtcbiAgICAgICAgdHJhbnNpdGl2ZU1vZHVsZS5hZGRFeHBvcnRlZERpcmVjdGl2ZShleHBvcnRlZElkKTtcbiAgICAgIH0gZWxzZSBpZiAodHJhbnNpdGl2ZU1vZHVsZS5waXBlc1NldC5oYXMoZXhwb3J0ZWRJZC5yZWZlcmVuY2UpKSB7XG4gICAgICAgIGV4cG9ydGVkUGlwZXMucHVzaChleHBvcnRlZElkKTtcbiAgICAgICAgdHJhbnNpdGl2ZU1vZHVsZS5hZGRFeHBvcnRlZFBpcGUoZXhwb3J0ZWRJZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICAgIHN5bnRheEVycm9yKGBDYW4ndCBleHBvcnQgJHt0aGlzLl9nZXRUeXBlRGVzY3JpcHRvcihleHBvcnRlZElkLnJlZmVyZW5jZSl9ICR7XG4gICAgICAgICAgICAgICAgc3RyaW5naWZ5VHlwZShleHBvcnRlZElkLnJlZmVyZW5jZSl9IGZyb20gJHtcbiAgICAgICAgICAgICAgICBzdHJpbmdpZnlUeXBlKG1vZHVsZVR5cGUpfSBhcyBpdCB3YXMgbmVpdGhlciBkZWNsYXJlZCBub3IgaW1wb3J0ZWQhYCksXG4gICAgICAgICAgICBtb2R1bGVUeXBlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVGhlIHByb3ZpZGVycyBvZiB0aGUgbW9kdWxlIGhhdmUgdG8gZ28gbGFzdFxuICAgIC8vIHNvIHRoYXQgdGhleSBvdmVyd3JpdGUgYW55IG90aGVyIHByb3ZpZGVyIHdlIGFscmVhZHkgYWRkZWQuXG4gICAgaWYgKG1ldGEucHJvdmlkZXJzKSB7XG4gICAgICBwcm92aWRlcnMucHVzaCguLi50aGlzLl9nZXRQcm92aWRlcnNNZXRhZGF0YShcbiAgICAgICAgICBtZXRhLnByb3ZpZGVycywgZW50cnlDb21wb25lbnRzLFxuICAgICAgICAgIGBwcm92aWRlciBmb3IgdGhlIE5nTW9kdWxlICcke3N0cmluZ2lmeVR5cGUobW9kdWxlVHlwZSl9J2AsIFtdLCBtb2R1bGVUeXBlKSk7XG4gICAgfVxuXG4gICAgaWYgKG1ldGEuZW50cnlDb21wb25lbnRzKSB7XG4gICAgICBlbnRyeUNvbXBvbmVudHMucHVzaCguLi5mbGF0dGVuQW5kRGVkdXBlQXJyYXkobWV0YS5lbnRyeUNvbXBvbmVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCh0eXBlID0+IHRoaXMuX2dldEVudHJ5Q29tcG9uZW50TWV0YWRhdGEodHlwZSkhKSk7XG4gICAgfVxuXG4gICAgaWYgKG1ldGEuYm9vdHN0cmFwKSB7XG4gICAgICBmbGF0dGVuQW5kRGVkdXBlQXJyYXkobWV0YS5ib290c3RyYXApLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgIGlmICghaXNWYWxpZFR5cGUodHlwZSkpIHtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICAgICAgc3ludGF4RXJyb3IoYFVuZXhwZWN0ZWQgdmFsdWUgJyR7XG4gICAgICAgICAgICAgICAgICBzdHJpbmdpZnlUeXBlKHR5cGUpfScgdXNlZCBpbiB0aGUgYm9vdHN0cmFwIHByb3BlcnR5IG9mIG1vZHVsZSAnJHtcbiAgICAgICAgICAgICAgICAgIHN0cmluZ2lmeVR5cGUobW9kdWxlVHlwZSl9J2ApLFxuICAgICAgICAgICAgICBtb2R1bGVUeXBlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYm9vdHN0cmFwQ29tcG9uZW50cy5wdXNoKHRoaXMuX2dldElkZW50aWZpZXJNZXRhZGF0YSh0eXBlKSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBlbnRyeUNvbXBvbmVudHMucHVzaChcbiAgICAgICAgLi4uYm9vdHN0cmFwQ29tcG9uZW50cy5tYXAodHlwZSA9PiB0aGlzLl9nZXRFbnRyeUNvbXBvbmVudE1ldGFkYXRhKHR5cGUucmVmZXJlbmNlKSEpKTtcblxuICAgIGlmIChtZXRhLnNjaGVtYXMpIHtcbiAgICAgIHNjaGVtYXMucHVzaCguLi5mbGF0dGVuQW5kRGVkdXBlQXJyYXkobWV0YS5zY2hlbWFzKSk7XG4gICAgfVxuXG4gICAgY29tcGlsZU1ldGEgPSBuZXcgY3BsLkNvbXBpbGVOZ01vZHVsZU1ldGFkYXRhKHtcbiAgICAgIHR5cGU6IHRoaXMuX2dldFR5cGVNZXRhZGF0YShtb2R1bGVUeXBlKSxcbiAgICAgIHByb3ZpZGVycyxcbiAgICAgIGVudHJ5Q29tcG9uZW50cyxcbiAgICAgIGJvb3RzdHJhcENvbXBvbmVudHMsXG4gICAgICBzY2hlbWFzLFxuICAgICAgZGVjbGFyZWREaXJlY3RpdmVzLFxuICAgICAgZXhwb3J0ZWREaXJlY3RpdmVzLFxuICAgICAgZGVjbGFyZWRQaXBlcyxcbiAgICAgIGV4cG9ydGVkUGlwZXMsXG4gICAgICBpbXBvcnRlZE1vZHVsZXMsXG4gICAgICBleHBvcnRlZE1vZHVsZXMsXG4gICAgICB0cmFuc2l0aXZlTW9kdWxlLFxuICAgICAgaWQ6IG1ldGEuaWQgfHwgbnVsbCxcbiAgICB9KTtcblxuICAgIGVudHJ5Q29tcG9uZW50cy5mb3JFYWNoKChpZCkgPT4gdHJhbnNpdGl2ZU1vZHVsZS5hZGRFbnRyeUNvbXBvbmVudChpZCkpO1xuICAgIHByb3ZpZGVycy5mb3JFYWNoKChwcm92aWRlcikgPT4gdHJhbnNpdGl2ZU1vZHVsZS5hZGRQcm92aWRlcihwcm92aWRlciwgY29tcGlsZU1ldGEhLnR5cGUpKTtcbiAgICB0cmFuc2l0aXZlTW9kdWxlLmFkZE1vZHVsZShjb21waWxlTWV0YS50eXBlKTtcbiAgICB0aGlzLl9uZ01vZHVsZUNhY2hlLnNldChtb2R1bGVUeXBlLCBjb21waWxlTWV0YSk7XG4gICAgcmV0dXJuIGNvbXBpbGVNZXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tTZWxmSW1wb3J0KG1vZHVsZVR5cGU6IFR5cGUsIGltcG9ydGVkTW9kdWxlVHlwZTogVHlwZSk6IGJvb2xlYW4ge1xuICAgIGlmIChtb2R1bGVUeXBlID09PSBpbXBvcnRlZE1vZHVsZVR5cGUpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgIHN5bnRheEVycm9yKGAnJHtzdHJpbmdpZnlUeXBlKG1vZHVsZVR5cGUpfScgbW9kdWxlIGNhbid0IGltcG9ydCBpdHNlbGZgKSwgbW9kdWxlVHlwZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0VHlwZURlc2NyaXB0b3IodHlwZTogVHlwZSk6IHN0cmluZyB7XG4gICAgaWYgKGlzVmFsaWRUeXBlKHR5cGUpKSB7XG4gICAgICBpZiAodGhpcy5pc0RpcmVjdGl2ZSh0eXBlKSkge1xuICAgICAgICByZXR1cm4gJ2RpcmVjdGl2ZSc7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmlzUGlwZSh0eXBlKSkge1xuICAgICAgICByZXR1cm4gJ3BpcGUnO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pc05nTW9kdWxlKHR5cGUpKSB7XG4gICAgICAgIHJldHVybiAnbW9kdWxlJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoKHR5cGUgYXMgYW55KS5wcm92aWRlKSB7XG4gICAgICByZXR1cm4gJ3Byb3ZpZGVyJztcbiAgICB9XG5cbiAgICByZXR1cm4gJ3ZhbHVlJztcbiAgfVxuXG5cbiAgcHJpdmF0ZSBfYWRkVHlwZVRvTW9kdWxlKHR5cGU6IFR5cGUsIG1vZHVsZVR5cGU6IFR5cGUpIHtcbiAgICBjb25zdCBvbGRNb2R1bGUgPSB0aGlzLl9uZ01vZHVsZU9mVHlwZXMuZ2V0KHR5cGUpO1xuICAgIGlmIChvbGRNb2R1bGUgJiYgb2xkTW9kdWxlICE9PSBtb2R1bGVUeXBlKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICBzeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgYFR5cGUgJHtzdHJpbmdpZnlUeXBlKHR5cGUpfSBpcyBwYXJ0IG9mIHRoZSBkZWNsYXJhdGlvbnMgb2YgMiBtb2R1bGVzOiAke1xuICAgICAgICAgICAgICAgICAgc3RyaW5naWZ5VHlwZShvbGRNb2R1bGUpfSBhbmQgJHtzdHJpbmdpZnlUeXBlKG1vZHVsZVR5cGUpfSEgYCArXG4gICAgICAgICAgICAgIGBQbGVhc2UgY29uc2lkZXIgbW92aW5nICR7c3RyaW5naWZ5VHlwZSh0eXBlKX0gdG8gYSBoaWdoZXIgbW9kdWxlIHRoYXQgaW1wb3J0cyAke1xuICAgICAgICAgICAgICAgICAgc3RyaW5naWZ5VHlwZShvbGRNb2R1bGUpfSBhbmQgJHtzdHJpbmdpZnlUeXBlKG1vZHVsZVR5cGUpfS4gYCArXG4gICAgICAgICAgICAgIGBZb3UgY2FuIGFsc28gY3JlYXRlIGEgbmV3IE5nTW9kdWxlIHRoYXQgZXhwb3J0cyBhbmQgaW5jbHVkZXMgJHtcbiAgICAgICAgICAgICAgICAgIHN0cmluZ2lmeVR5cGUodHlwZSl9IHRoZW4gaW1wb3J0IHRoYXQgTmdNb2R1bGUgaW4gJHtcbiAgICAgICAgICAgICAgICAgIHN0cmluZ2lmeVR5cGUob2xkTW9kdWxlKX0gYW5kICR7c3RyaW5naWZ5VHlwZShtb2R1bGVUeXBlKX0uYCksXG4gICAgICAgICAgbW9kdWxlVHlwZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX25nTW9kdWxlT2ZUeXBlcy5zZXQodHlwZSwgbW9kdWxlVHlwZSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRUcmFuc2l0aXZlTmdNb2R1bGVNZXRhZGF0YShcbiAgICAgIGltcG9ydGVkTW9kdWxlczogY3BsLkNvbXBpbGVOZ01vZHVsZVN1bW1hcnlbXSxcbiAgICAgIGV4cG9ydGVkTW9kdWxlczogY3BsLkNvbXBpbGVOZ01vZHVsZVN1bW1hcnlbXSk6IGNwbC5UcmFuc2l0aXZlQ29tcGlsZU5nTW9kdWxlTWV0YWRhdGEge1xuICAgIC8vIGNvbGxlY3QgYHByb3ZpZGVyc2AgLyBgZW50cnlDb21wb25lbnRzYCBmcm9tIGFsbCBpbXBvcnRlZCBhbmQgYWxsIGV4cG9ydGVkIG1vZHVsZXNcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgY3BsLlRyYW5zaXRpdmVDb21waWxlTmdNb2R1bGVNZXRhZGF0YSgpO1xuICAgIGNvbnN0IG1vZHVsZXNCeVRva2VuID0gbmV3IE1hcDxhbnksIFNldDxhbnk+PigpO1xuICAgIGltcG9ydGVkTW9kdWxlcy5jb25jYXQoZXhwb3J0ZWRNb2R1bGVzKS5mb3JFYWNoKChtb2RTdW1tYXJ5KSA9PiB7XG4gICAgICBtb2RTdW1tYXJ5Lm1vZHVsZXMuZm9yRWFjaCgobW9kKSA9PiByZXN1bHQuYWRkTW9kdWxlKG1vZCkpO1xuICAgICAgbW9kU3VtbWFyeS5lbnRyeUNvbXBvbmVudHMuZm9yRWFjaCgoY29tcCkgPT4gcmVzdWx0LmFkZEVudHJ5Q29tcG9uZW50KGNvbXApKTtcbiAgICAgIGNvbnN0IGFkZGVkVG9rZW5zID0gbmV3IFNldDxhbnk+KCk7XG4gICAgICBtb2RTdW1tYXJ5LnByb3ZpZGVycy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgICBjb25zdCB0b2tlblJlZiA9IGNwbC50b2tlblJlZmVyZW5jZShlbnRyeS5wcm92aWRlci50b2tlbik7XG4gICAgICAgIGxldCBwcmV2TW9kdWxlcyA9IG1vZHVsZXNCeVRva2VuLmdldCh0b2tlblJlZik7XG4gICAgICAgIGlmICghcHJldk1vZHVsZXMpIHtcbiAgICAgICAgICBwcmV2TW9kdWxlcyA9IG5ldyBTZXQ8YW55PigpO1xuICAgICAgICAgIG1vZHVsZXNCeVRva2VuLnNldCh0b2tlblJlZiwgcHJldk1vZHVsZXMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1vZHVsZVJlZiA9IGVudHJ5Lm1vZHVsZS5yZWZlcmVuY2U7XG4gICAgICAgIC8vIE5vdGU6IHRoZSBwcm92aWRlcnMgb2Ygb25lIG1vZHVsZSBtYXkgc3RpbGwgY29udGFpbiBtdWx0aXBsZSBwcm92aWRlcnNcbiAgICAgICAgLy8gcGVyIHRva2VuIChlLmcuIGZvciBtdWx0aSBwcm92aWRlcnMpLCBhbmQgd2UgbmVlZCB0byBwcmVzZXJ2ZSB0aGVzZS5cbiAgICAgICAgaWYgKGFkZGVkVG9rZW5zLmhhcyh0b2tlblJlZikgfHwgIXByZXZNb2R1bGVzLmhhcyhtb2R1bGVSZWYpKSB7XG4gICAgICAgICAgcHJldk1vZHVsZXMuYWRkKG1vZHVsZVJlZik7XG4gICAgICAgICAgYWRkZWRUb2tlbnMuYWRkKHRva2VuUmVmKTtcbiAgICAgICAgICByZXN1bHQuYWRkUHJvdmlkZXIoZW50cnkucHJvdmlkZXIsIGVudHJ5Lm1vZHVsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGV4cG9ydGVkTW9kdWxlcy5mb3JFYWNoKChtb2RTdW1tYXJ5KSA9PiB7XG4gICAgICBtb2RTdW1tYXJ5LmV4cG9ydGVkRGlyZWN0aXZlcy5mb3JFYWNoKChpZCkgPT4gcmVzdWx0LmFkZEV4cG9ydGVkRGlyZWN0aXZlKGlkKSk7XG4gICAgICBtb2RTdW1tYXJ5LmV4cG9ydGVkUGlwZXMuZm9yRWFjaCgoaWQpID0+IHJlc3VsdC5hZGRFeHBvcnRlZFBpcGUoaWQpKTtcbiAgICB9KTtcbiAgICBpbXBvcnRlZE1vZHVsZXMuZm9yRWFjaCgobW9kU3VtbWFyeSkgPT4ge1xuICAgICAgbW9kU3VtbWFyeS5leHBvcnRlZERpcmVjdGl2ZXMuZm9yRWFjaCgoaWQpID0+IHJlc3VsdC5hZGREaXJlY3RpdmUoaWQpKTtcbiAgICAgIG1vZFN1bW1hcnkuZXhwb3J0ZWRQaXBlcy5mb3JFYWNoKChpZCkgPT4gcmVzdWx0LmFkZFBpcGUoaWQpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0SWRlbnRpZmllck1ldGFkYXRhKHR5cGU6IFR5cGUpOiBjcGwuQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSB7XG4gICAgdHlwZSA9IHJlc29sdmVGb3J3YXJkUmVmKHR5cGUpO1xuICAgIHJldHVybiB7cmVmZXJlbmNlOiB0eXBlfTtcbiAgfVxuXG4gIGlzSW5qZWN0YWJsZSh0eXBlOiBhbnkpOiBib29sZWFuIHtcbiAgICBjb25zdCBhbm5vdGF0aW9ucyA9IHRoaXMuX3JlZmxlY3Rvci50cnlBbm5vdGF0aW9ucyh0eXBlKTtcbiAgICByZXR1cm4gYW5ub3RhdGlvbnMuc29tZShhbm4gPT4gY3JlYXRlSW5qZWN0YWJsZS5pc1R5cGVPZihhbm4pKTtcbiAgfVxuXG4gIGdldEluamVjdGFibGVTdW1tYXJ5KHR5cGU6IGFueSk6IGNwbC5Db21waWxlVHlwZVN1bW1hcnkge1xuICAgIHJldHVybiB7XG4gICAgICBzdW1tYXJ5S2luZDogY3BsLkNvbXBpbGVTdW1tYXJ5S2luZC5JbmplY3RhYmxlLFxuICAgICAgdHlwZTogdGhpcy5fZ2V0VHlwZU1ldGFkYXRhKHR5cGUsIG51bGwsIGZhbHNlKVxuICAgIH07XG4gIH1cblxuICBnZXRJbmplY3RhYmxlTWV0YWRhdGEoXG4gICAgICB0eXBlOiBhbnksIGRlcGVuZGVuY2llczogYW55W118bnVsbCA9IG51bGwsXG4gICAgICB0aHJvd09uVW5rbm93bkRlcHM6IGJvb2xlYW4gPSB0cnVlKTogY3BsLkNvbXBpbGVJbmplY3RhYmxlTWV0YWRhdGF8bnVsbCB7XG4gICAgY29uc3QgdHlwZVN1bW1hcnkgPSB0aGlzLl9sb2FkU3VtbWFyeSh0eXBlLCBjcGwuQ29tcGlsZVN1bW1hcnlLaW5kLkluamVjdGFibGUpO1xuICAgIGNvbnN0IHR5cGVNZXRhZGF0YSA9IHR5cGVTdW1tYXJ5ID9cbiAgICAgICAgdHlwZVN1bW1hcnkudHlwZSA6XG4gICAgICAgIHRoaXMuX2dldFR5cGVNZXRhZGF0YSh0eXBlLCBkZXBlbmRlbmNpZXMsIHRocm93T25Vbmtub3duRGVwcyk7XG5cbiAgICBjb25zdCBhbm5vdGF0aW9uczogSW5qZWN0YWJsZVtdID1cbiAgICAgICAgdGhpcy5fcmVmbGVjdG9yLmFubm90YXRpb25zKHR5cGUpLmZpbHRlcihhbm4gPT4gY3JlYXRlSW5qZWN0YWJsZS5pc1R5cGVPZihhbm4pKTtcblxuICAgIGlmIChhbm5vdGF0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG1ldGEgPSBhbm5vdGF0aW9uc1thbm5vdGF0aW9ucy5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4ge1xuICAgICAgc3ltYm9sOiB0eXBlLFxuICAgICAgdHlwZTogdHlwZU1ldGFkYXRhLFxuICAgICAgcHJvdmlkZWRJbjogbWV0YS5wcm92aWRlZEluLFxuICAgICAgdXNlVmFsdWU6IG1ldGEudXNlVmFsdWUsXG4gICAgICB1c2VDbGFzczogbWV0YS51c2VDbGFzcyxcbiAgICAgIHVzZUV4aXN0aW5nOiBtZXRhLnVzZUV4aXN0aW5nLFxuICAgICAgdXNlRmFjdG9yeTogbWV0YS51c2VGYWN0b3J5LFxuICAgICAgZGVwczogbWV0YS5kZXBzLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9nZXRUeXBlTWV0YWRhdGEodHlwZTogVHlwZSwgZGVwZW5kZW5jaWVzOiBhbnlbXXxudWxsID0gbnVsbCwgdGhyb3dPblVua25vd25EZXBzID0gdHJ1ZSk6XG4gICAgICBjcGwuQ29tcGlsZVR5cGVNZXRhZGF0YSB7XG4gICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMuX2dldElkZW50aWZpZXJNZXRhZGF0YSh0eXBlKTtcbiAgICByZXR1cm4ge1xuICAgICAgcmVmZXJlbmNlOiBpZGVudGlmaWVyLnJlZmVyZW5jZSxcbiAgICAgIGRpRGVwczogdGhpcy5fZ2V0RGVwZW5kZW5jaWVzTWV0YWRhdGEoaWRlbnRpZmllci5yZWZlcmVuY2UsIGRlcGVuZGVuY2llcywgdGhyb3dPblVua25vd25EZXBzKSxcbiAgICAgIGxpZmVjeWNsZUhvb2tzOiBnZXRBbGxMaWZlY3ljbGVIb29rcyh0aGlzLl9yZWZsZWN0b3IsIGlkZW50aWZpZXIucmVmZXJlbmNlKSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0RmFjdG9yeU1ldGFkYXRhKGZhY3Rvcnk6IEZ1bmN0aW9uLCBkZXBlbmRlbmNpZXM6IGFueVtdfG51bGwgPSBudWxsKTpcbiAgICAgIGNwbC5Db21waWxlRmFjdG9yeU1ldGFkYXRhIHtcbiAgICBmYWN0b3J5ID0gcmVzb2x2ZUZvcndhcmRSZWYoZmFjdG9yeSk7XG4gICAgcmV0dXJuIHtyZWZlcmVuY2U6IGZhY3RvcnksIGRpRGVwczogdGhpcy5fZ2V0RGVwZW5kZW5jaWVzTWV0YWRhdGEoZmFjdG9yeSwgZGVwZW5kZW5jaWVzKX07XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbWV0YWRhdGEgZm9yIHRoZSBnaXZlbiBwaXBlLlxuICAgKiBUaGlzIGFzc3VtZXMgYGxvYWROZ01vZHVsZURpcmVjdGl2ZUFuZFBpcGVNZXRhZGF0YWAgaGFzIGJlZW4gY2FsbGVkIGZpcnN0LlxuICAgKi9cbiAgZ2V0UGlwZU1ldGFkYXRhKHBpcGVUeXBlOiBhbnkpOiBjcGwuQ29tcGlsZVBpcGVNZXRhZGF0YXxudWxsIHtcbiAgICBjb25zdCBwaXBlTWV0YSA9IHRoaXMuX3BpcGVDYWNoZS5nZXQocGlwZVR5cGUpO1xuICAgIGlmICghcGlwZU1ldGEpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgIHN5bnRheEVycm9yKFxuICAgICAgICAgICAgICBgSWxsZWdhbCBzdGF0ZTogZ2V0UGlwZU1ldGFkYXRhIGNhbiBvbmx5IGJlIGNhbGxlZCBhZnRlciBsb2FkTmdNb2R1bGVEaXJlY3RpdmVBbmRQaXBlTWV0YWRhdGEgZm9yIGEgbW9kdWxlIHRoYXQgZGVjbGFyZXMgaXQuIFBpcGUgJHtcbiAgICAgICAgICAgICAgICAgIHN0cmluZ2lmeVR5cGUocGlwZVR5cGUpfS5gKSxcbiAgICAgICAgICBwaXBlVHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBwaXBlTWV0YSB8fCBudWxsO1xuICB9XG5cbiAgZ2V0UGlwZVN1bW1hcnkocGlwZVR5cGU6IGFueSk6IGNwbC5Db21waWxlUGlwZVN1bW1hcnkge1xuICAgIGNvbnN0IHBpcGVTdW1tYXJ5ID1cbiAgICAgICAgPGNwbC5Db21waWxlUGlwZVN1bW1hcnk+dGhpcy5fbG9hZFN1bW1hcnkocGlwZVR5cGUsIGNwbC5Db21waWxlU3VtbWFyeUtpbmQuUGlwZSk7XG4gICAgaWYgKCFwaXBlU3VtbWFyeSkge1xuICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgc3ludGF4RXJyb3IoXG4gICAgICAgICAgICAgIGBJbGxlZ2FsIHN0YXRlOiBDb3VsZCBub3QgbG9hZCB0aGUgc3VtbWFyeSBmb3IgcGlwZSAke3N0cmluZ2lmeVR5cGUocGlwZVR5cGUpfS5gKSxcbiAgICAgICAgICBwaXBlVHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBwaXBlU3VtbWFyeTtcbiAgfVxuXG4gIGdldE9yTG9hZFBpcGVNZXRhZGF0YShwaXBlVHlwZTogYW55KTogY3BsLkNvbXBpbGVQaXBlTWV0YWRhdGEge1xuICAgIGxldCBwaXBlTWV0YSA9IHRoaXMuX3BpcGVDYWNoZS5nZXQocGlwZVR5cGUpO1xuICAgIGlmICghcGlwZU1ldGEpIHtcbiAgICAgIHBpcGVNZXRhID0gdGhpcy5fbG9hZFBpcGVNZXRhZGF0YShwaXBlVHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBwaXBlTWV0YTtcbiAgfVxuXG4gIHByaXZhdGUgX2xvYWRQaXBlTWV0YWRhdGEocGlwZVR5cGU6IGFueSk6IGNwbC5Db21waWxlUGlwZU1ldGFkYXRhIHtcbiAgICBwaXBlVHlwZSA9IHJlc29sdmVGb3J3YXJkUmVmKHBpcGVUeXBlKTtcbiAgICBjb25zdCBwaXBlQW5ub3RhdGlvbiA9IHRoaXMuX3BpcGVSZXNvbHZlci5yZXNvbHZlKHBpcGVUeXBlKSE7XG5cbiAgICBjb25zdCBwaXBlTWV0YSA9IG5ldyBjcGwuQ29tcGlsZVBpcGVNZXRhZGF0YSh7XG4gICAgICB0eXBlOiB0aGlzLl9nZXRUeXBlTWV0YWRhdGEocGlwZVR5cGUpLFxuICAgICAgbmFtZTogcGlwZUFubm90YXRpb24ubmFtZSxcbiAgICAgIHB1cmU6ICEhcGlwZUFubm90YXRpb24ucHVyZVxuICAgIH0pO1xuICAgIHRoaXMuX3BpcGVDYWNoZS5zZXQocGlwZVR5cGUsIHBpcGVNZXRhKTtcbiAgICB0aGlzLl9zdW1tYXJ5Q2FjaGUuc2V0KHBpcGVUeXBlLCBwaXBlTWV0YS50b1N1bW1hcnkoKSk7XG4gICAgcmV0dXJuIHBpcGVNZXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0RGVwZW5kZW5jaWVzTWV0YWRhdGEoXG4gICAgICB0eXBlT3JGdW5jOiBUeXBlfEZ1bmN0aW9uLCBkZXBlbmRlbmNpZXM6IGFueVtdfG51bGwsXG4gICAgICB0aHJvd09uVW5rbm93bkRlcHMgPSB0cnVlKTogY3BsLkNvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YVtdIHtcbiAgICBsZXQgaGFzVW5rbm93bkRlcHMgPSBmYWxzZTtcbiAgICBjb25zdCBwYXJhbXMgPSBkZXBlbmRlbmNpZXMgfHwgdGhpcy5fcmVmbGVjdG9yLnBhcmFtZXRlcnModHlwZU9yRnVuYykgfHwgW107XG5cbiAgICBjb25zdCBkZXBlbmRlbmNpZXNNZXRhZGF0YTogY3BsLkNvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YVtdID0gcGFyYW1zLm1hcCgocGFyYW0pID0+IHtcbiAgICAgIGxldCBpc0F0dHJpYnV0ZSA9IGZhbHNlO1xuICAgICAgbGV0IGlzSG9zdCA9IGZhbHNlO1xuICAgICAgbGV0IGlzU2VsZiA9IGZhbHNlO1xuICAgICAgbGV0IGlzU2tpcFNlbGYgPSBmYWxzZTtcbiAgICAgIGxldCBpc09wdGlvbmFsID0gZmFsc2U7XG4gICAgICBsZXQgdG9rZW46IGFueSA9IG51bGw7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJhbSkpIHtcbiAgICAgICAgcGFyYW0uZm9yRWFjaCgocGFyYW1FbnRyeTogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKGNyZWF0ZUhvc3QuaXNUeXBlT2YocGFyYW1FbnRyeSkpIHtcbiAgICAgICAgICAgIGlzSG9zdCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChjcmVhdGVTZWxmLmlzVHlwZU9mKHBhcmFtRW50cnkpKSB7XG4gICAgICAgICAgICBpc1NlbGYgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3JlYXRlU2tpcFNlbGYuaXNUeXBlT2YocGFyYW1FbnRyeSkpIHtcbiAgICAgICAgICAgIGlzU2tpcFNlbGYgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3JlYXRlT3B0aW9uYWwuaXNUeXBlT2YocGFyYW1FbnRyeSkpIHtcbiAgICAgICAgICAgIGlzT3B0aW9uYWwgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3JlYXRlQXR0cmlidXRlLmlzVHlwZU9mKHBhcmFtRW50cnkpKSB7XG4gICAgICAgICAgICBpc0F0dHJpYnV0ZSA9IHRydWU7XG4gICAgICAgICAgICB0b2tlbiA9IChwYXJhbUVudHJ5IGFzIGFueSkuYXR0cmlidXRlTmFtZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNyZWF0ZUluamVjdC5pc1R5cGVPZihwYXJhbUVudHJ5KSkge1xuICAgICAgICAgICAgdG9rZW4gPSAocGFyYW1FbnRyeSBhcyBhbnkpLnRva2VuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgIGNyZWF0ZUluamVjdGlvblRva2VuLmlzVHlwZU9mKHBhcmFtRW50cnkpIHx8XG4gICAgICAgICAgICAgIChwYXJhbUVudHJ5IGFzIGFueSkgaW5zdGFuY2VvZiBTdGF0aWNTeW1ib2wpIHtcbiAgICAgICAgICAgIHRva2VuID0gcGFyYW1FbnRyeTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzVmFsaWRUeXBlKHBhcmFtRW50cnkpICYmIHRva2VuID09IG51bGwpIHtcbiAgICAgICAgICAgIHRva2VuID0gcGFyYW1FbnRyeTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9rZW4gPSBwYXJhbTtcbiAgICAgIH1cbiAgICAgIGlmICh0b2tlbiA9PSBudWxsKSB7XG4gICAgICAgIGhhc1Vua25vd25EZXBzID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc0F0dHJpYnV0ZSxcbiAgICAgICAgaXNIb3N0LFxuICAgICAgICBpc1NlbGYsXG4gICAgICAgIGlzU2tpcFNlbGYsXG4gICAgICAgIGlzT3B0aW9uYWwsXG4gICAgICAgIHRva2VuOiB0aGlzLl9nZXRUb2tlbk1ldGFkYXRhKHRva2VuKVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGlmIChoYXNVbmtub3duRGVwcykge1xuICAgICAgY29uc3QgZGVwc1Rva2VucyA9XG4gICAgICAgICAgZGVwZW5kZW5jaWVzTWV0YWRhdGEubWFwKChkZXApID0+IGRlcC50b2tlbiA/IHN0cmluZ2lmeVR5cGUoZGVwLnRva2VuKSA6ICc/Jykuam9pbignLCAnKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPVxuICAgICAgICAgIGBDYW4ndCByZXNvbHZlIGFsbCBwYXJhbWV0ZXJzIGZvciAke3N0cmluZ2lmeVR5cGUodHlwZU9yRnVuYyl9OiAoJHtkZXBzVG9rZW5zfSkuYDtcbiAgICAgIGlmICh0aHJvd09uVW5rbm93bkRlcHMgfHwgdGhpcy5fY29uZmlnLnN0cmljdEluamVjdGlvblBhcmFtZXRlcnMpIHtcbiAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3Ioc3ludGF4RXJyb3IobWVzc2FnZSksIHR5cGVPckZ1bmMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZXBlbmRlbmNpZXNNZXRhZGF0YTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFRva2VuTWV0YWRhdGEodG9rZW46IGFueSk6IGNwbC5Db21waWxlVG9rZW5NZXRhZGF0YSB7XG4gICAgdG9rZW4gPSByZXNvbHZlRm9yd2FyZFJlZih0b2tlbik7XG4gICAgbGV0IGNvbXBpbGVUb2tlbjogY3BsLkNvbXBpbGVUb2tlbk1ldGFkYXRhO1xuICAgIGlmICh0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb21waWxlVG9rZW4gPSB7dmFsdWU6IHRva2VufTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGlsZVRva2VuID0ge2lkZW50aWZpZXI6IHtyZWZlcmVuY2U6IHRva2VufX07XG4gICAgfVxuICAgIHJldHVybiBjb21waWxlVG9rZW47XG4gIH1cblxuICBwcml2YXRlIF9nZXRQcm92aWRlcnNNZXRhZGF0YShcbiAgICAgIHByb3ZpZGVyczogUHJvdmlkZXJbXSwgdGFyZ2V0RW50cnlDb21wb25lbnRzOiBjcGwuQ29tcGlsZUVudHJ5Q29tcG9uZW50TWV0YWRhdGFbXSxcbiAgICAgIGRlYnVnSW5mbz86IHN0cmluZywgY29tcGlsZVByb3ZpZGVyczogY3BsLkNvbXBpbGVQcm92aWRlck1ldGFkYXRhW10gPSBbXSxcbiAgICAgIHR5cGU/OiBhbnkpOiBjcGwuQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXSB7XG4gICAgcHJvdmlkZXJzLmZvckVhY2goKHByb3ZpZGVyOiBhbnksIHByb3ZpZGVySWR4OiBudW1iZXIpID0+IHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3ZpZGVyKSkge1xuICAgICAgICB0aGlzLl9nZXRQcm92aWRlcnNNZXRhZGF0YShwcm92aWRlciwgdGFyZ2V0RW50cnlDb21wb25lbnRzLCBkZWJ1Z0luZm8sIGNvbXBpbGVQcm92aWRlcnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvdmlkZXIgPSByZXNvbHZlRm9yd2FyZFJlZihwcm92aWRlcik7XG4gICAgICAgIGxldCBwcm92aWRlck1ldGE6IGNwbC5Qcm92aWRlck1ldGEgPSB1bmRlZmluZWQhO1xuICAgICAgICBpZiAocHJvdmlkZXIgJiYgdHlwZW9mIHByb3ZpZGVyID09PSAnb2JqZWN0JyAmJiBwcm92aWRlci5oYXNPd25Qcm9wZXJ0eSgncHJvdmlkZScpKSB7XG4gICAgICAgICAgdGhpcy5fdmFsaWRhdGVQcm92aWRlcihwcm92aWRlcik7XG4gICAgICAgICAgcHJvdmlkZXJNZXRhID0gbmV3IGNwbC5Qcm92aWRlck1ldGEocHJvdmlkZXIucHJvdmlkZSwgcHJvdmlkZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzVmFsaWRUeXBlKHByb3ZpZGVyKSkge1xuICAgICAgICAgIHByb3ZpZGVyTWV0YSA9IG5ldyBjcGwuUHJvdmlkZXJNZXRhKHByb3ZpZGVyLCB7dXNlQ2xhc3M6IHByb3ZpZGVyfSk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvdmlkZXIgPT09IHZvaWQgMCkge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKHN5bnRheEVycm9yKFxuICAgICAgICAgICAgICBgRW5jb3VudGVyZWQgdW5kZWZpbmVkIHByb3ZpZGVyISBVc3VhbGx5IHRoaXMgbWVhbnMgeW91IGhhdmUgYSBjaXJjdWxhciBkZXBlbmRlbmNpZXMuIFRoaXMgbWlnaHQgYmUgY2F1c2VkIGJ5IHVzaW5nICdiYXJyZWwnIGluZGV4LnRzIGZpbGVzLmApKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcHJvdmlkZXJzSW5mbyA9XG4gICAgICAgICAgICAgIHByb3ZpZGVyc1xuICAgICAgICAgICAgICAgICAgLnJlZHVjZShcbiAgICAgICAgICAgICAgICAgICAgICAoc29GYXI6IHN0cmluZ1tdLCBzZWVuUHJvdmlkZXI6IGFueSwgc2VlblByb3ZpZGVySWR4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWVuUHJvdmlkZXJJZHggPCBwcm92aWRlcklkeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzb0Zhci5wdXNoKGAke3N0cmluZ2lmeVR5cGUoc2VlblByb3ZpZGVyKX1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VlblByb3ZpZGVySWR4ID09IHByb3ZpZGVySWR4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNvRmFyLnB1c2goYD8ke3N0cmluZ2lmeVR5cGUoc2VlblByb3ZpZGVyKX0/YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlZW5Qcm92aWRlcklkeCA9PSBwcm92aWRlcklkeCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc29GYXIucHVzaCgnLi4uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc29GYXI7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBbXSlcbiAgICAgICAgICAgICAgICAgIC5qb2luKCcsICcpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgICBzeW50YXhFcnJvcihgSW52YWxpZCAke1xuICAgICAgICAgICAgICAgICAgZGVidWdJbmZvID9cbiAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z0luZm8gOlxuICAgICAgICAgICAgICAgICAgICAgICdwcm92aWRlcid9IC0gb25seSBpbnN0YW5jZXMgb2YgUHJvdmlkZXIgYW5kIFR5cGUgYXJlIGFsbG93ZWQsIGdvdDogWyR7XG4gICAgICAgICAgICAgICAgICBwcm92aWRlcnNJbmZvfV1gKSxcbiAgICAgICAgICAgICAgdHlwZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm92aWRlck1ldGEudG9rZW4gPT09XG4gICAgICAgICAgICB0aGlzLl9yZWZsZWN0b3IucmVzb2x2ZUV4dGVybmFsUmVmZXJlbmNlKElkZW50aWZpZXJzLkFOQUxZWkVfRk9SX0VOVFJZX0NPTVBPTkVOVFMpKSB7XG4gICAgICAgICAgdGFyZ2V0RW50cnlDb21wb25lbnRzLnB1c2goLi4udGhpcy5fZ2V0RW50cnlDb21wb25lbnRzRnJvbVByb3ZpZGVyKHByb3ZpZGVyTWV0YSwgdHlwZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbXBpbGVQcm92aWRlcnMucHVzaCh0aGlzLmdldFByb3ZpZGVyTWV0YWRhdGEocHJvdmlkZXJNZXRhKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY29tcGlsZVByb3ZpZGVycztcbiAgfVxuXG4gIHByaXZhdGUgX3ZhbGlkYXRlUHJvdmlkZXIocHJvdmlkZXI6IGFueSk6IHZvaWQge1xuICAgIGlmIChwcm92aWRlci5oYXNPd25Qcm9wZXJ0eSgndXNlQ2xhc3MnKSAmJiBwcm92aWRlci51c2VDbGFzcyA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihzeW50YXhFcnJvcihgSW52YWxpZCBwcm92aWRlciBmb3IgJHtcbiAgICAgICAgICBzdHJpbmdpZnlUeXBlKHByb3ZpZGVyLnByb3ZpZGUpfS4gdXNlQ2xhc3MgY2Fubm90IGJlICR7cHJvdmlkZXIudXNlQ2xhc3N9LlxuICAgICAgICAgICBVc3VhbGx5IGl0IGhhcHBlbnMgd2hlbjpcbiAgICAgICAgICAgMS4gVGhlcmUncyBhIGNpcmN1bGFyIGRlcGVuZGVuY3kgKG1pZ2h0IGJlIGNhdXNlZCBieSB1c2luZyBpbmRleC50cyAoYmFycmVsKSBmaWxlcykuXG4gICAgICAgICAgIDIuIENsYXNzIHdhcyB1c2VkIGJlZm9yZSBpdCB3YXMgZGVjbGFyZWQuIFVzZSBmb3J3YXJkUmVmIGluIHRoaXMgY2FzZS5gKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0RW50cnlDb21wb25lbnRzRnJvbVByb3ZpZGVyKHByb3ZpZGVyOiBjcGwuUHJvdmlkZXJNZXRhLCB0eXBlPzogYW55KTpcbiAgICAgIGNwbC5Db21waWxlRW50cnlDb21wb25lbnRNZXRhZGF0YVtdIHtcbiAgICBjb25zdCBjb21wb25lbnRzOiBjcGwuQ29tcGlsZUVudHJ5Q29tcG9uZW50TWV0YWRhdGFbXSA9IFtdO1xuICAgIGNvbnN0IGNvbGxlY3RlZElkZW50aWZpZXJzOiBjcGwuQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YVtdID0gW107XG5cbiAgICBpZiAocHJvdmlkZXIudXNlRmFjdG9yeSB8fCBwcm92aWRlci51c2VFeGlzdGluZyB8fCBwcm92aWRlci51c2VDbGFzcykge1xuICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgc3ludGF4RXJyb3IoYFRoZSBBTkFMWVpFX0ZPUl9FTlRSWV9DT01QT05FTlRTIHRva2VuIG9ubHkgc3VwcG9ydHMgdXNlVmFsdWUhYCksIHR5cGUpO1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmICghcHJvdmlkZXIubXVsdGkpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgIHN5bnRheEVycm9yKGBUaGUgQU5BTFlaRV9GT1JfRU5UUllfQ09NUE9ORU5UUyB0b2tlbiBvbmx5IHN1cHBvcnRzICdtdWx0aSA9IHRydWUnIWApLFxuICAgICAgICAgIHR5cGUpO1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGV4dHJhY3RJZGVudGlmaWVycyhwcm92aWRlci51c2VWYWx1ZSwgY29sbGVjdGVkSWRlbnRpZmllcnMpO1xuICAgIGNvbGxlY3RlZElkZW50aWZpZXJzLmZvckVhY2goKGlkZW50aWZpZXIpID0+IHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fZ2V0RW50cnlDb21wb25lbnRNZXRhZGF0YShpZGVudGlmaWVyLnJlZmVyZW5jZSwgZmFsc2UpO1xuICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgIGNvbXBvbmVudHMucHVzaChlbnRyeSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gIH1cblxuICBwcml2YXRlIF9nZXRFbnRyeUNvbXBvbmVudE1ldGFkYXRhKGRpclR5cGU6IGFueSwgdGhyb3dJZk5vdEZvdW5kID0gdHJ1ZSk6XG4gICAgICBjcGwuQ29tcGlsZUVudHJ5Q29tcG9uZW50TWV0YWRhdGF8bnVsbCB7XG4gICAgY29uc3QgZGlyTWV0YSA9IHRoaXMuZ2V0Tm9uTm9ybWFsaXplZERpcmVjdGl2ZU1ldGFkYXRhKGRpclR5cGUpO1xuICAgIGlmIChkaXJNZXRhICYmIGRpck1ldGEubWV0YWRhdGEuaXNDb21wb25lbnQpIHtcbiAgICAgIHJldHVybiB7Y29tcG9uZW50VHlwZTogZGlyVHlwZSwgY29tcG9uZW50RmFjdG9yeTogZGlyTWV0YS5tZXRhZGF0YS5jb21wb25lbnRGYWN0b3J5IX07XG4gICAgfVxuICAgIGNvbnN0IGRpclN1bW1hcnkgPVxuICAgICAgICA8Y3BsLkNvbXBpbGVEaXJlY3RpdmVTdW1tYXJ5PnRoaXMuX2xvYWRTdW1tYXJ5KGRpclR5cGUsIGNwbC5Db21waWxlU3VtbWFyeUtpbmQuRGlyZWN0aXZlKTtcbiAgICBpZiAoZGlyU3VtbWFyeSAmJiBkaXJTdW1tYXJ5LmlzQ29tcG9uZW50KSB7XG4gICAgICByZXR1cm4ge2NvbXBvbmVudFR5cGU6IGRpclR5cGUsIGNvbXBvbmVudEZhY3Rvcnk6IGRpclN1bW1hcnkuY29tcG9uZW50RmFjdG9yeSF9O1xuICAgIH1cbiAgICBpZiAodGhyb3dJZk5vdEZvdW5kKSB7XG4gICAgICB0aHJvdyBzeW50YXhFcnJvcihgJHtkaXJUeXBlLm5hbWV9IGNhbm5vdCBiZSB1c2VkIGFzIGFuIGVudHJ5IGNvbXBvbmVudC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIF9nZXRJbmplY3RhYmxlVHlwZU1ldGFkYXRhKHR5cGU6IFR5cGUsIGRlcGVuZGVuY2llczogYW55W118bnVsbCA9IG51bGwpOlxuICAgICAgY3BsLkNvbXBpbGVUeXBlTWV0YWRhdGEge1xuICAgIGNvbnN0IHR5cGVTdW1tYXJ5ID0gdGhpcy5fbG9hZFN1bW1hcnkodHlwZSwgY3BsLkNvbXBpbGVTdW1tYXJ5S2luZC5JbmplY3RhYmxlKTtcbiAgICBpZiAodHlwZVN1bW1hcnkpIHtcbiAgICAgIHJldHVybiB0eXBlU3VtbWFyeS50eXBlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZ2V0VHlwZU1ldGFkYXRhKHR5cGUsIGRlcGVuZGVuY2llcyk7XG4gIH1cblxuICBnZXRQcm92aWRlck1ldGFkYXRhKHByb3ZpZGVyOiBjcGwuUHJvdmlkZXJNZXRhKTogY3BsLkNvbXBpbGVQcm92aWRlck1ldGFkYXRhIHtcbiAgICBsZXQgY29tcGlsZURlcHM6IGNwbC5Db21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGFbXSA9IHVuZGVmaW5lZCE7XG4gICAgbGV0IGNvbXBpbGVUeXBlTWV0YWRhdGE6IGNwbC5Db21waWxlVHlwZU1ldGFkYXRhID0gbnVsbCE7XG4gICAgbGV0IGNvbXBpbGVGYWN0b3J5TWV0YWRhdGE6IGNwbC5Db21waWxlRmFjdG9yeU1ldGFkYXRhID0gbnVsbCE7XG4gICAgbGV0IHRva2VuOiBjcGwuQ29tcGlsZVRva2VuTWV0YWRhdGEgPSB0aGlzLl9nZXRUb2tlbk1ldGFkYXRhKHByb3ZpZGVyLnRva2VuKTtcblxuICAgIGlmIChwcm92aWRlci51c2VDbGFzcykge1xuICAgICAgY29tcGlsZVR5cGVNZXRhZGF0YSA9XG4gICAgICAgICAgdGhpcy5fZ2V0SW5qZWN0YWJsZVR5cGVNZXRhZGF0YShwcm92aWRlci51c2VDbGFzcywgcHJvdmlkZXIuZGVwZW5kZW5jaWVzKTtcbiAgICAgIGNvbXBpbGVEZXBzID0gY29tcGlsZVR5cGVNZXRhZGF0YS5kaURlcHM7XG4gICAgICBpZiAocHJvdmlkZXIudG9rZW4gPT09IHByb3ZpZGVyLnVzZUNsYXNzKSB7XG4gICAgICAgIC8vIHVzZSB0aGUgY29tcGlsZVR5cGVNZXRhZGF0YSBhcyBpdCBjb250YWlucyBpbmZvcm1hdGlvbiBhYm91dCBsaWZlY3ljbGVIb29rcy4uLlxuICAgICAgICB0b2tlbiA9IHtpZGVudGlmaWVyOiBjb21waWxlVHlwZU1ldGFkYXRhfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHByb3ZpZGVyLnVzZUZhY3RvcnkpIHtcbiAgICAgIGNvbXBpbGVGYWN0b3J5TWV0YWRhdGEgPSB0aGlzLl9nZXRGYWN0b3J5TWV0YWRhdGEocHJvdmlkZXIudXNlRmFjdG9yeSwgcHJvdmlkZXIuZGVwZW5kZW5jaWVzKTtcbiAgICAgIGNvbXBpbGVEZXBzID0gY29tcGlsZUZhY3RvcnlNZXRhZGF0YS5kaURlcHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRva2VuOiB0b2tlbixcbiAgICAgIHVzZUNsYXNzOiBjb21waWxlVHlwZU1ldGFkYXRhLFxuICAgICAgdXNlVmFsdWU6IHByb3ZpZGVyLnVzZVZhbHVlLFxuICAgICAgdXNlRmFjdG9yeTogY29tcGlsZUZhY3RvcnlNZXRhZGF0YSxcbiAgICAgIHVzZUV4aXN0aW5nOiBwcm92aWRlci51c2VFeGlzdGluZyA/IHRoaXMuX2dldFRva2VuTWV0YWRhdGEocHJvdmlkZXIudXNlRXhpc3RpbmcpIDogdW5kZWZpbmVkLFxuICAgICAgZGVwczogY29tcGlsZURlcHMsXG4gICAgICBtdWx0aTogcHJvdmlkZXIubXVsdGlcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UXVlcmllc01ldGFkYXRhKFxuICAgICAgcXVlcmllczoge1trZXk6IHN0cmluZ106IFF1ZXJ5fSwgaXNWaWV3UXVlcnk6IGJvb2xlYW4sXG4gICAgICBkaXJlY3RpdmVUeXBlOiBUeXBlKTogY3BsLkNvbXBpbGVRdWVyeU1ldGFkYXRhW10ge1xuICAgIGNvbnN0IHJlczogY3BsLkNvbXBpbGVRdWVyeU1ldGFkYXRhW10gPSBbXTtcblxuICAgIE9iamVjdC5rZXlzKHF1ZXJpZXMpLmZvckVhY2goKHByb3BlcnR5TmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBxdWVyeSA9IHF1ZXJpZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgIGlmIChxdWVyeS5pc1ZpZXdRdWVyeSA9PT0gaXNWaWV3UXVlcnkpIHtcbiAgICAgICAgcmVzLnB1c2godGhpcy5fZ2V0UXVlcnlNZXRhZGF0YShxdWVyeSwgcHJvcGVydHlOYW1lLCBkaXJlY3RpdmVUeXBlKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgcHJpdmF0ZSBfcXVlcnlWYXJCaW5kaW5ncyhzZWxlY3RvcjogYW55KTogc3RyaW5nW10ge1xuICAgIHJldHVybiBzZWxlY3Rvci5zcGxpdCgvXFxzKixcXHMqLyk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRRdWVyeU1ldGFkYXRhKHE6IFF1ZXJ5LCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgdHlwZU9yRnVuYzogVHlwZXxGdW5jdGlvbik6XG4gICAgICBjcGwuQ29tcGlsZVF1ZXJ5TWV0YWRhdGEge1xuICAgIGxldCBzZWxlY3RvcnM6IGNwbC5Db21waWxlVG9rZW5NZXRhZGF0YVtdO1xuICAgIGlmICh0eXBlb2YgcS5zZWxlY3RvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHNlbGVjdG9ycyA9XG4gICAgICAgICAgdGhpcy5fcXVlcnlWYXJCaW5kaW5ncyhxLnNlbGVjdG9yKS5tYXAodmFyTmFtZSA9PiB0aGlzLl9nZXRUb2tlbk1ldGFkYXRhKHZhck5hbWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFxLnNlbGVjdG9yKSB7XG4gICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgc3ludGF4RXJyb3IoYENhbid0IGNvbnN0cnVjdCBhIHF1ZXJ5IGZvciB0aGUgcHJvcGVydHkgXCIke3Byb3BlcnR5TmFtZX1cIiBvZiBcIiR7XG4gICAgICAgICAgICAgICAgc3RyaW5naWZ5VHlwZSh0eXBlT3JGdW5jKX1cIiBzaW5jZSB0aGUgcXVlcnkgc2VsZWN0b3Igd2Fzbid0IGRlZmluZWQuYCksXG4gICAgICAgICAgICB0eXBlT3JGdW5jKTtcbiAgICAgICAgc2VsZWN0b3JzID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxlY3RvcnMgPSBbdGhpcy5fZ2V0VG9rZW5NZXRhZGF0YShxLnNlbGVjdG9yKV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNlbGVjdG9ycyxcbiAgICAgIGZpcnN0OiBxLmZpcnN0LFxuICAgICAgZGVzY2VuZGFudHM6IHEuZGVzY2VuZGFudHMsXG4gICAgICBlbWl0RGlzdGluY3RDaGFuZ2VzT25seTogcS5lbWl0RGlzdGluY3RDaGFuZ2VzT25seSxcbiAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgIHJlYWQ6IHEucmVhZCA/IHRoaXMuX2dldFRva2VuTWV0YWRhdGEocS5yZWFkKSA6IG51bGwhLFxuICAgICAgc3RhdGljOiBxLnN0YXRpY1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9yZXBvcnRFcnJvcihlcnJvcjogYW55LCB0eXBlPzogYW55LCBvdGhlclR5cGU/OiBhbnkpIHtcbiAgICBpZiAodGhpcy5fZXJyb3JDb2xsZWN0b3IpIHtcbiAgICAgIHRoaXMuX2Vycm9yQ29sbGVjdG9yKGVycm9yLCB0eXBlKTtcbiAgICAgIGlmIChvdGhlclR5cGUpIHtcbiAgICAgICAgdGhpcy5fZXJyb3JDb2xsZWN0b3IoZXJyb3IsIG90aGVyVHlwZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmbGF0dGVuQXJyYXkodHJlZTogYW55W10sIG91dDogQXJyYXk8YW55PiA9IFtdKTogQXJyYXk8YW55PiB7XG4gIGlmICh0cmVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtID0gcmVzb2x2ZUZvcndhcmRSZWYodHJlZVtpXSk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICBmbGF0dGVuQXJyYXkoaXRlbSwgb3V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dC5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBkZWR1cGVBcnJheShhcnJheTogYW55W10pOiBBcnJheTxhbnk+IHtcbiAgaWYgKGFycmF5KSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChhcnJheSkpO1xuICB9XG4gIHJldHVybiBbXTtcbn1cblxuZnVuY3Rpb24gZmxhdHRlbkFuZERlZHVwZUFycmF5KHRyZWU6IGFueVtdKTogQXJyYXk8YW55PiB7XG4gIHJldHVybiBkZWR1cGVBcnJheShmbGF0dGVuQXJyYXkodHJlZSkpO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkVHlwZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAodmFsdWUgaW5zdGFuY2VvZiBTdGF0aWNTeW1ib2wpIHx8ICh2YWx1ZSBpbnN0YW5jZW9mIFR5cGUpO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0SWRlbnRpZmllcnModmFsdWU6IGFueSwgdGFyZ2V0SWRlbnRpZmllcnM6IGNwbC5Db21waWxlSWRlbnRpZmllck1ldGFkYXRhW10pIHtcbiAgdmlzaXRWYWx1ZSh2YWx1ZSwgbmV3IF9Db21waWxlVmFsdWVDb252ZXJ0ZXIoKSwgdGFyZ2V0SWRlbnRpZmllcnMpO1xufVxuXG5jbGFzcyBfQ29tcGlsZVZhbHVlQ29udmVydGVyIGV4dGVuZHMgVmFsdWVUcmFuc2Zvcm1lciB7XG4gIG92ZXJyaWRlIHZpc2l0T3RoZXIodmFsdWU6IGFueSwgdGFyZ2V0SWRlbnRpZmllcnM6IGNwbC5Db21waWxlSWRlbnRpZmllck1ldGFkYXRhW10pOiBhbnkge1xuICAgIHRhcmdldElkZW50aWZpZXJzLnB1c2goe3JlZmVyZW5jZTogdmFsdWV9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlUeXBlKHR5cGU6IGFueSk6IHN0cmluZyB7XG4gIGlmICh0eXBlIGluc3RhbmNlb2YgU3RhdGljU3ltYm9sKSB7XG4gICAgcmV0dXJuIGAke3R5cGUubmFtZX0gaW4gJHt0eXBlLmZpbGVQYXRofWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cmluZ2lmeSh0eXBlKTtcbiAgfVxufVxuXG4vKipcbiAqIEluZGljYXRlcyB0aGF0IGEgY29tcG9uZW50IGlzIHN0aWxsIGJlaW5nIGxvYWRlZCBpbiBhIHN5bmNocm9ub3VzIGNvbXBpbGUuXG4gKi9cbmZ1bmN0aW9uIGNvbXBvbmVudFN0aWxsTG9hZGluZ0Vycm9yKGNvbXBUeXBlOiBUeXBlKSB7XG4gIGNvbnN0IGVycm9yID1cbiAgICAgIEVycm9yKGBDYW4ndCBjb21waWxlIHN5bmNocm9ub3VzbHkgYXMgJHtzdHJpbmdpZnkoY29tcFR5cGUpfSBpcyBzdGlsbCBiZWluZyBsb2FkZWQhYCk7XG4gIChlcnJvciBhcyBhbnkpW0VSUk9SX0NPTVBPTkVOVF9UWVBFXSA9IGNvbXBUeXBlO1xuICByZXR1cm4gZXJyb3I7XG59XG4iXX0=