/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ApplicationInitStatus, Component, InjectFlags, Injector, NgModule, NgZone, Optional, SkipSelf, ɵclearOverrides as clearOverrides, ɵgetInjectableDef as getInjectableDef, ɵINJECTOR_SCOPE as INJECTOR_SCOPE, ɵivyEnabled as ivyEnabled, ɵoverrideComponentView as overrideComponentView, ɵoverrideProvider as overrideProvider, ɵstringify as stringify } from '@angular/core';
import { ComponentFixture } from './component_fixture';
import { _getTestBedRender3, TestBedRender3 } from './r3_test_bed';
import { ComponentFixtureAutoDetect, ComponentFixtureNoNgZone, TEARDOWN_TESTING_MODULE_ON_DESTROY_DEFAULT, TestComponentRenderer } from './test_bed_common';
import { TestingCompilerFactory } from './test_compiler';
let _nextRootElementId = 0;
/**
 * @description
 * Configures and initializes environment for unit testing and provides methods for
 * creating components and services in unit tests.
 *
 * `TestBed` is the primary api for writing unit tests for Angular applications and libraries.
 *
 * Note: Use `TestBed` in tests. It will be set to either `TestBedViewEngine` or `TestBedRender3`
 * according to the compiler used.
 */
export class TestBedViewEngine {
    constructor() {
        this._instantiated = false;
        this._compiler = null;
        this._moduleRef = null;
        this._moduleFactory = null;
        this._pendingModuleFactory = null;
        this._compilerOptions = [];
        this._moduleOverrides = [];
        this._componentOverrides = [];
        this._directiveOverrides = [];
        this._pipeOverrides = [];
        this._providers = [];
        this._declarations = [];
        this._imports = [];
        this._schemas = [];
        this._activeFixtures = [];
        this._testEnvAotSummaries = () => [];
        this._aotSummaries = [];
        this._templateOverrides = [];
        this._isRoot = true;
        this._rootProviderOverrides = [];
        this.platform = null;
        this.ngModule = null;
    }
    /**
     * Initialize the environment for testing with a compiler factory, a PlatformRef, and an
     * angular module. These are common to every test in the suite.
     *
     * This may only be called once, to set up the common providers for the current test
     * suite on the current platform. If you absolutely need to change the providers,
     * first use `resetTestEnvironment`.
     *
     * Test modules and platforms for individual platforms are available from
     * '@angular/<platform_name>/testing'.
     */
    static initTestEnvironment(ngModule, platform, summariesOrOptions) {
        const testBed = _getTestBedViewEngine();
        testBed.initTestEnvironment(ngModule, platform, summariesOrOptions);
        return testBed;
    }
    /**
     * Reset the providers for the test injector.
     */
    static resetTestEnvironment() {
        _getTestBedViewEngine().resetTestEnvironment();
    }
    static resetTestingModule() {
        _getTestBedViewEngine().resetTestingModule();
        return TestBedViewEngine;
    }
    /**
     * Allows overriding default compiler providers and settings
     * which are defined in test_injector.js
     */
    static configureCompiler(config) {
        _getTestBedViewEngine().configureCompiler(config);
        return TestBedViewEngine;
    }
    /**
     * Allows overriding default providers, directives, pipes, modules of the test injector,
     * which are defined in test_injector.js
     */
    static configureTestingModule(moduleDef) {
        _getTestBedViewEngine().configureTestingModule(moduleDef);
        return TestBedViewEngine;
    }
    /**
     * Compile components with a `templateUrl` for the test's NgModule.
     * It is necessary to call this function
     * as fetching urls is asynchronous.
     */
    static compileComponents() {
        return getTestBed().compileComponents();
    }
    static overrideModule(ngModule, override) {
        _getTestBedViewEngine().overrideModule(ngModule, override);
        return TestBedViewEngine;
    }
    static overrideComponent(component, override) {
        _getTestBedViewEngine().overrideComponent(component, override);
        return TestBedViewEngine;
    }
    static overrideDirective(directive, override) {
        _getTestBedViewEngine().overrideDirective(directive, override);
        return TestBedViewEngine;
    }
    static overridePipe(pipe, override) {
        _getTestBedViewEngine().overridePipe(pipe, override);
        return TestBedViewEngine;
    }
    static overrideTemplate(component, template) {
        _getTestBedViewEngine().overrideComponent(component, { set: { template, templateUrl: null } });
        return TestBedViewEngine;
    }
    /**
     * Overrides the template of the given component, compiling the template
     * in the context of the TestingModule.
     *
     * Note: This works for JIT and AOTed components as well.
     */
    static overrideTemplateUsingTestingModule(component, template) {
        _getTestBedViewEngine().overrideTemplateUsingTestingModule(component, template);
        return TestBedViewEngine;
    }
    static overrideProvider(token, provider) {
        _getTestBedViewEngine().overrideProvider(token, provider);
        return TestBedViewEngine;
    }
    static inject(token, notFoundValue, flags) {
        return _getTestBedViewEngine().inject(token, notFoundValue, flags);
    }
    /** @deprecated from v9.0.0 use TestBed.inject */
    static get(token, notFoundValue = Injector.THROW_IF_NOT_FOUND, flags = InjectFlags.Default) {
        return _getTestBedViewEngine().inject(token, notFoundValue, flags);
    }
    static createComponent(component) {
        return _getTestBedViewEngine().createComponent(component);
    }
    static shouldTearDownTestingModule() {
        return _getTestBedViewEngine().shouldTearDownTestingModule();
    }
    static tearDownTestingModule() {
        _getTestBedViewEngine().tearDownTestingModule();
    }
    /**
     * Initialize the environment for testing with a compiler factory, a PlatformRef, and an
     * angular module. These are common to every test in the suite.
     *
     * This may only be called once, to set up the common providers for the current test
     * suite on the current platform. If you absolutely need to change the providers,
     * first use `resetTestEnvironment`.
     *
     * Test modules and platforms for individual platforms are available from
     * '@angular/<platform_name>/testing'.
     */
    initTestEnvironment(ngModule, platform, summariesOrOptions) {
        if (this.platform || this.ngModule) {
            throw new Error('Cannot set base providers because it has already been called');
        }
        this.platform = platform;
        this.ngModule = ngModule;
        if (typeof summariesOrOptions === 'function') {
            this._testEnvAotSummaries = summariesOrOptions;
            TestBedViewEngine._environmentTeardownOptions = undefined;
        }
        else {
            this._testEnvAotSummaries = (summariesOrOptions === null || summariesOrOptions === void 0 ? void 0 : summariesOrOptions.aotSummaries) || (() => []);
            TestBedViewEngine._environmentTeardownOptions = summariesOrOptions === null || summariesOrOptions === void 0 ? void 0 : summariesOrOptions.teardown;
        }
    }
    /**
     * Reset the providers for the test injector.
     */
    resetTestEnvironment() {
        this.resetTestingModule();
        this.platform = null;
        this.ngModule = null;
        this._testEnvAotSummaries = () => [];
        TestBedViewEngine._environmentTeardownOptions = undefined;
    }
    resetTestingModule() {
        clearOverrides();
        this._aotSummaries = [];
        this._templateOverrides = [];
        this._compiler = null;
        this._moduleOverrides = [];
        this._componentOverrides = [];
        this._directiveOverrides = [];
        this._pipeOverrides = [];
        this._isRoot = true;
        this._rootProviderOverrides = [];
        this._moduleFactory = null;
        this._pendingModuleFactory = null;
        this._compilerOptions = [];
        this._providers = [];
        this._declarations = [];
        this._imports = [];
        this._schemas = [];
        // We have to chain a couple of try/finally blocks, because each step can
        // throw errors and we don't want it to interrupt the next step and we also
        // want an error to be thrown at the end.
        try {
            this.destroyActiveFixtures();
        }
        finally {
            try {
                if (this.shouldTearDownTestingModule()) {
                    this.tearDownTestingModule();
                }
            }
            finally {
                this._moduleRef = null;
                this._instanceTeardownOptions = undefined;
                this._instantiated = false;
            }
        }
    }
    configureCompiler(config) {
        this._assertNotInstantiated('TestBed.configureCompiler', 'configure the compiler');
        this._compilerOptions.push(config);
    }
    configureTestingModule(moduleDef) {
        this._assertNotInstantiated('TestBed.configureTestingModule', 'configure the test module');
        if (moduleDef.providers) {
            this._providers.push(...moduleDef.providers);
        }
        if (moduleDef.declarations) {
            this._declarations.push(...moduleDef.declarations);
        }
        if (moduleDef.imports) {
            this._imports.push(...moduleDef.imports);
        }
        if (moduleDef.schemas) {
            this._schemas.push(...moduleDef.schemas);
        }
        if (moduleDef.aotSummaries) {
            this._aotSummaries.push(moduleDef.aotSummaries);
        }
        // Always re-assign the teardown options, even if they're undefined.
        // This ensures that we don't carry the options between tests.
        this._instanceTeardownOptions = moduleDef.teardown;
    }
    compileComponents() {
        if (this._moduleFactory || this._instantiated) {
            return Promise.resolve(null);
        }
        const moduleType = this._createCompilerAndModule();
        this._pendingModuleFactory = moduleType;
        return this._compiler.compileModuleAndAllComponentsAsync(moduleType).then(result => {
            // If the module mismatches by the time the promise resolves, it means that the module has
            // already been destroyed and a new compilation has started. If that's the case, avoid
            // overwriting the module factory, because it can cause downstream errors.
            if (this._pendingModuleFactory === moduleType) {
                this._moduleFactory = result.ngModuleFactory;
                this._pendingModuleFactory = null;
            }
        });
    }
    _initIfNeeded() {
        if (this._instantiated) {
            return;
        }
        if (!this._moduleFactory) {
            try {
                const moduleType = this._createCompilerAndModule();
                this._moduleFactory =
                    this._compiler.compileModuleAndAllComponentsSync(moduleType).ngModuleFactory;
            }
            catch (e) {
                const errorCompType = this._compiler.getComponentFromError(e);
                if (errorCompType) {
                    throw new Error(`This test module uses the component ${stringify(errorCompType)} which is using a "templateUrl" or "styleUrls", but they were never compiled. ` +
                        `Please call "TestBed.compileComponents" before your test.`);
                }
                else {
                    throw e;
                }
            }
        }
        for (const { component, templateOf } of this._templateOverrides) {
            const compFactory = this._compiler.getComponentFactory(templateOf);
            overrideComponentView(component, compFactory);
        }
        const ngZone = new NgZone({ enableLongStackTrace: true, shouldCoalesceEventChangeDetection: false });
        const providers = [{ provide: NgZone, useValue: ngZone }];
        const ngZoneInjector = Injector.create({
            providers: providers,
            parent: this.platform.injector,
            name: this._moduleFactory.moduleType.name
        });
        this._moduleRef = this._moduleFactory.create(ngZoneInjector);
        // ApplicationInitStatus.runInitializers() is marked @internal to core. So casting to any
        // before accessing it.
        this._moduleRef.injector.get(ApplicationInitStatus).runInitializers();
        this._instantiated = true;
    }
    _createCompilerAndModule() {
        const providers = this._providers.concat([{ provide: TestBed, useValue: this }]);
        const declarations = [...this._declarations, ...this._templateOverrides.map(entry => entry.templateOf)];
        const rootScopeImports = [];
        const rootProviderOverrides = this._rootProviderOverrides;
        if (this._isRoot) {
            class RootScopeModule {
            }
            RootScopeModule.decorators = [
                { type: NgModule, args: [{
                            providers: [
                                ...rootProviderOverrides,
                            ],
                            jit: true,
                        },] }
            ];
            rootScopeImports.push(RootScopeModule);
        }
        providers.push({ provide: INJECTOR_SCOPE, useValue: this._isRoot ? 'root' : null });
        const imports = [rootScopeImports, this.ngModule, this._imports];
        const schemas = this._schemas;
        class DynamicTestModule {
        }
        DynamicTestModule.decorators = [
            { type: NgModule, args: [{ providers, declarations, imports, schemas, jit: true },] }
        ];
        const compilerFactory = this.platform.injector.get(TestingCompilerFactory);
        this._compiler = compilerFactory.createTestingCompiler(this._compilerOptions);
        for (const summary of [this._testEnvAotSummaries, ...this._aotSummaries]) {
            this._compiler.loadAotSummaries(summary);
        }
        this._moduleOverrides.forEach((entry) => this._compiler.overrideModule(entry[0], entry[1]));
        this._componentOverrides.forEach((entry) => this._compiler.overrideComponent(entry[0], entry[1]));
        this._directiveOverrides.forEach((entry) => this._compiler.overrideDirective(entry[0], entry[1]));
        this._pipeOverrides.forEach((entry) => this._compiler.overridePipe(entry[0], entry[1]));
        return DynamicTestModule;
    }
    _assertNotInstantiated(methodName, methodDescription) {
        if (this._instantiated) {
            throw new Error(`Cannot ${methodDescription} when the test module has already been instantiated. ` +
                `Make sure you are not using \`inject\` before \`${methodName}\`.`);
        }
    }
    inject(token, notFoundValue, flags) {
        this._initIfNeeded();
        if (token === TestBed) {
            return this;
        }
        // Tests can inject things from the ng module and from the compiler,
        // but the ng module can't inject things from the compiler and vice versa.
        const UNDEFINED = {};
        const result = this._moduleRef.injector.get(token, UNDEFINED, flags);
        return result === UNDEFINED ? this._compiler.injector.get(token, notFoundValue, flags) :
            result;
    }
    /** @deprecated from v9.0.0 use TestBed.inject */
    get(token, notFoundValue = Injector.THROW_IF_NOT_FOUND, flags = InjectFlags.Default) {
        return this.inject(token, notFoundValue, flags);
    }
    execute(tokens, fn, context) {
        this._initIfNeeded();
        const params = tokens.map(t => this.inject(t));
        return fn.apply(context, params);
    }
    overrideModule(ngModule, override) {
        this._assertNotInstantiated('overrideModule', 'override module metadata');
        this._moduleOverrides.push([ngModule, override]);
    }
    overrideComponent(component, override) {
        this._assertNotInstantiated('overrideComponent', 'override component metadata');
        this._componentOverrides.push([component, override]);
    }
    overrideDirective(directive, override) {
        this._assertNotInstantiated('overrideDirective', 'override directive metadata');
        this._directiveOverrides.push([directive, override]);
    }
    overridePipe(pipe, override) {
        this._assertNotInstantiated('overridePipe', 'override pipe metadata');
        this._pipeOverrides.push([pipe, override]);
    }
    overrideProvider(token, provider) {
        this._assertNotInstantiated('overrideProvider', 'override provider');
        this.overrideProviderImpl(token, provider);
    }
    overrideProviderImpl(token, provider, deprecated = false) {
        let def = null;
        if (typeof token !== 'string' && (def = getInjectableDef(token)) && def.providedIn === 'root') {
            if (provider.useFactory) {
                this._rootProviderOverrides.push({ provide: token, useFactory: provider.useFactory, deps: provider.deps || [] });
            }
            else {
                this._rootProviderOverrides.push({ provide: token, useValue: provider.useValue });
            }
        }
        let flags = 0;
        let value;
        if (provider.useFactory) {
            flags |= 1024 /* TypeFactoryProvider */;
            value = provider.useFactory;
        }
        else {
            flags |= 256 /* TypeValueProvider */;
            value = provider.useValue;
        }
        const deps = (provider.deps || []).map((dep) => {
            let depFlags = 0 /* None */;
            let depToken;
            if (Array.isArray(dep)) {
                dep.forEach((entry) => {
                    if (entry instanceof Optional) {
                        depFlags |= 2 /* Optional */;
                    }
                    else if (entry instanceof SkipSelf) {
                        depFlags |= 1 /* SkipSelf */;
                    }
                    else {
                        depToken = entry;
                    }
                });
            }
            else {
                depToken = dep;
            }
            return [depFlags, depToken];
        });
        overrideProvider({ token, flags, deps, value, deprecatedBehavior: deprecated });
    }
    overrideTemplateUsingTestingModule(component, template) {
        this._assertNotInstantiated('overrideTemplateUsingTestingModule', 'override template');
        class OverrideComponent {
        }
        OverrideComponent.decorators = [
            { type: Component, args: [{ selector: 'empty', template, jit: true },] }
        ];
        this._templateOverrides.push({ component, templateOf: OverrideComponent });
    }
    createComponent(component) {
        this._initIfNeeded();
        const componentFactory = this._compiler.getComponentFactory(component);
        if (!componentFactory) {
            throw new Error(`Cannot create the component ${stringify(component)} as it was not imported into the testing module!`);
        }
        // TODO: Don't cast as `InjectionToken<boolean>`, declared type is boolean[]
        const noNgZone = this.inject(ComponentFixtureNoNgZone, false);
        // TODO: Don't cast as `InjectionToken<boolean>`, declared type is boolean[]
        const autoDetect = this.inject(ComponentFixtureAutoDetect, false);
        const ngZone = noNgZone ? null : this.inject(NgZone, null);
        const testComponentRenderer = this.inject(TestComponentRenderer);
        const rootElId = `root${_nextRootElementId++}`;
        testComponentRenderer.insertRootElement(rootElId);
        const initComponent = () => {
            const componentRef = componentFactory.create(Injector.NULL, [], `#${rootElId}`, this._moduleRef);
            return new ComponentFixture(componentRef, ngZone, autoDetect);
        };
        const fixture = !ngZone ? initComponent() : ngZone.run(initComponent);
        this._activeFixtures.push(fixture);
        return fixture;
    }
    destroyActiveFixtures() {
        let errorCount = 0;
        this._activeFixtures.forEach((fixture) => {
            try {
                fixture.destroy();
            }
            catch (e) {
                errorCount++;
                console.error('Error during cleanup of component', {
                    component: fixture.componentInstance,
                    stacktrace: e,
                });
            }
        });
        this._activeFixtures = [];
        if (errorCount > 0 && this.shouldRethrowTeardownErrors()) {
            throw Error(`${errorCount} ${(errorCount === 1 ? 'component' : 'components')} ` +
                `threw errors during cleanup`);
        }
    }
    shouldRethrowTeardownErrors() {
        var _a, _b;
        const instanceOptions = this._instanceTeardownOptions;
        const environmentOptions = TestBedViewEngine._environmentTeardownOptions;
        // If the new teardown behavior hasn't been configured, preserve the old behavior.
        if (!instanceOptions && !environmentOptions) {
            return false;
        }
        // Otherwise use the configured behavior or default to rethrowing.
        return (_b = (_a = instanceOptions === null || instanceOptions === void 0 ? void 0 : instanceOptions.rethrowErrors) !== null && _a !== void 0 ? _a : environmentOptions === null || environmentOptions === void 0 ? void 0 : environmentOptions.rethrowErrors) !== null && _b !== void 0 ? _b : true;
    }
    shouldTearDownTestingModule() {
        var _a, _b, _c, _d;
        return (_d = (_b = (_a = this._instanceTeardownOptions) === null || _a === void 0 ? void 0 : _a.destroyAfterEach) !== null && _b !== void 0 ? _b : (_c = TestBedViewEngine._environmentTeardownOptions) === null || _c === void 0 ? void 0 : _c.destroyAfterEach) !== null && _d !== void 0 ? _d : TEARDOWN_TESTING_MODULE_ON_DESTROY_DEFAULT;
    }
    tearDownTestingModule() {
        var _a, _b, _c, _d, _e;
        // If the module ref has already been destroyed, we won't be able to get a test renderer.
        if (this._moduleRef === null) {
            return;
        }
        // Resolve the renderer ahead of time, because we want to remove the root elements as the very
        // last step, but the injector will be destroyed as a part of the module ref destruction.
        const testRenderer = this.inject(TestComponentRenderer);
        try {
            this._moduleRef.destroy();
        }
        catch (e) {
            if ((_d = (_b = (_a = this._instanceTeardownOptions) === null || _a === void 0 ? void 0 : _a.rethrowErrors) !== null && _b !== void 0 ? _b : (_c = TestBedViewEngine._environmentTeardownOptions) === null || _c === void 0 ? void 0 : _c.rethrowErrors) !== null && _d !== void 0 ? _d : true) {
                throw e;
            }
            else {
                console.error('Error during cleanup of a testing module', {
                    component: this._moduleRef.instance,
                    stacktrace: e,
                });
            }
        }
        finally {
            (_e = testRenderer === null || testRenderer === void 0 ? void 0 : testRenderer.removeAllRootElements) === null || _e === void 0 ? void 0 : _e.call(testRenderer);
        }
    }
}
/**
 * @description
 * Configures and initializes environment for unit testing and provides methods for
 * creating components and services in unit tests.
 *
 * `TestBed` is the primary api for writing unit tests for Angular applications and libraries.
 *
 * Note: Use `TestBed` in tests. It will be set to either `TestBedViewEngine` or `TestBedRender3`
 * according to the compiler used.
 *
 * @publicApi
 */
export const TestBed = ivyEnabled ? TestBedRender3 : TestBedViewEngine;
/**
 * Returns a singleton of the applicable `TestBed`.
 *
 * It will be either an instance of `TestBedViewEngine` or `TestBedRender3`.
 *
 * @publicApi
 */
export const getTestBed = ivyEnabled ? _getTestBedRender3 : _getTestBedViewEngine;
let testBed;
function _getTestBedViewEngine() {
    return testBed = testBed || new TestBedViewEngine();
}
/**
 * Allows injecting dependencies in `beforeEach()` and `it()`.
 *
 * Example:
 *
 * ```
 * beforeEach(inject([Dependency, AClass], (dep, object) => {
 *   // some code that uses `dep` and `object`
 *   // ...
 * }));
 *
 * it('...', inject([AClass], (object) => {
 *   object.doSomething();
 *   expect(...);
 * })
 * ```
 *
 * @publicApi
 */
export function inject(tokens, fn) {
    const testBed = getTestBed();
    // Not using an arrow function to preserve context passed from call site
    return function () {
        return testBed.execute(tokens, fn, this);
    };
}
/**
 * @publicApi
 */
export class InjectSetupWrapper {
    constructor(_moduleDef) {
        this._moduleDef = _moduleDef;
    }
    _addModule() {
        const moduleDef = this._moduleDef();
        if (moduleDef) {
            getTestBed().configureTestingModule(moduleDef);
        }
    }
    inject(tokens, fn) {
        const self = this;
        // Not using an arrow function to preserve context passed from call site
        return function () {
            self._addModule();
            return inject(tokens, fn).call(this);
        };
    }
}
export function withModule(moduleDef, fn) {
    if (fn) {
        // Not using an arrow function to preserve context passed from call site
        return function () {
            const testBed = getTestBed();
            if (moduleDef) {
                testBed.configureTestingModule(moduleDef);
            }
            return fn.apply(this);
        };
    }
    return new InjectSetupWrapper(() => moduleDef);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9iZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Rpbmcvc3JjL3Rlc3RfYmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBbUIsU0FBUyxFQUFhLFdBQVcsRUFBa0IsUUFBUSxFQUFFLFFBQVEsRUFBZ0MsTUFBTSxFQUFFLFFBQVEsRUFBOEQsUUFBUSxFQUF3QixlQUFlLElBQUksY0FBYyxFQUF5QixpQkFBaUIsSUFBSSxnQkFBZ0IsRUFBRSxlQUFlLElBQUksY0FBYyxFQUFFLFdBQVcsSUFBSSxVQUFVLEVBQTJCLHNCQUFzQixJQUFJLHFCQUFxQixFQUFFLGlCQUFpQixJQUFJLGdCQUFnQixFQUFFLFVBQVUsSUFBSSxTQUFTLEVBQTBCLE1BQU0sZUFBZSxDQUFDO0FBRTFsQixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUVyRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsY0FBYyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBQywwQkFBMEIsRUFBRSx3QkFBd0IsRUFBeUIsMENBQTBDLEVBQWlCLHFCQUFxQixFQUE2QyxNQUFNLG1CQUFtQixDQUFDO0FBQzVPLE9BQU8sRUFBa0Isc0JBQXNCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUd4RSxJQUFJLGtCQUFrQixHQUFHLENBQUMsQ0FBQztBQTBFM0I7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxPQUFPLGlCQUFpQjtJQUE5QjtRQWdLVSxrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUUvQixjQUFTLEdBQW9CLElBQUssQ0FBQztRQUNuQyxlQUFVLEdBQTBCLElBQUksQ0FBQztRQUN6QyxtQkFBYyxHQUE4QixJQUFJLENBQUM7UUFDakQsMEJBQXFCLEdBQXVCLElBQUksQ0FBQztRQUVqRCxxQkFBZ0IsR0FBc0Is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QUFFLENBQUM7WUFDN0IsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsT0FBTyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzNDO1lBQ0QsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQztLQUNIO0lBQ0QsT0FBTyxJQUFJLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBcHBsaWNhdGlvbkluaXRTdGF0dXMsIENvbXBpbGVyT3B0aW9ucywgQ29tcG9uZW50LCBEaXJlY3RpdmUsIEluamVjdEZsYWdzLCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0b3IsIE5nTW9kdWxlLCBOZ01vZHVsZUZhY3RvcnksIE5nTW9kdWxlUmVmLCBOZ1pvbmUsIE9wdGlvbmFsLCBQaXBlLCBQbGF0Zm9ybVJlZiwgUHJvdmlkZXIsIFByb3ZpZGVyVG9rZW4sIFNjaGVtYU1ldGFkYXRhLCBTa2lwU2VsZiwgU3RhdGljUHJvdmlkZXIsIFR5cGUsIMm1Y2xlYXJPdmVycmlkZXMgYXMgY2xlYXJPdmVycmlkZXMsIMm1RGVwRmxhZ3MgYXMgRGVwRmxhZ3MsIMm1Z2V0SW5qZWN0YWJsZURlZiBhcyBnZXRJbmplY3RhYmxlRGVmLCDJtUlOSkVDVE9SX1NDT1BFIGFzIElOSkVDVE9SX1NDT1BFLCDJtWl2eUVuYWJsZWQgYXMgaXZ5RW5hYmxlZCwgybVOb2RlRmxhZ3MgYXMgTm9kZUZsYWdzLCDJtW92ZXJyaWRlQ29tcG9uZW50VmlldyBhcyBvdmVycmlkZUNvbXBvbmVudFZpZXcsIMm1b3ZlcnJpZGVQcm92aWRlciBhcyBvdmVycmlkZVByb3ZpZGVyLCDJtXN0cmluZ2lmeSBhcyBzdHJpbmdpZnksIMm1ybVJbmplY3RhYmxlRGVjbGFyYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0NvbXBvbmVudEZpeHR1cmV9IGZyb20gJy4vY29tcG9uZW50X2ZpeHR1cmUnO1xuaW1wb3J0IHtNZXRhZGF0YU92ZXJyaWRlfSBmcm9tICcuL21ldGFkYXRhX292ZXJyaWRlJztcbmltcG9ydCB7X2dldFRlc3RCZWRSZW5kZXIzLCBUZXN0QmVkUmVuZGVyM30gZnJvbSAnLi9yM190ZXN0X2JlZCc7XG5pbXBvcnQge0NvbXBvbmVudEZpeHR1cmVBdXRvRGV0ZWN0LCBDb21wb25lbnRGaXh0dXJlTm9OZ1pvbmUsIE1vZHVsZVRlYXJkb3duT3B0aW9ucywgVEVBUkRPV05fVEVTVElOR19NT0RVTEVfT05fREVTVFJPWV9ERUZBVUxULCBUZXN0QmVkU3RhdGljLCBUZXN0Q29tcG9uZW50UmVuZGVyZXIsIFRlc3RFbnZpcm9ubWVudE9wdGlvbnMsIFRlc3RNb2R1bGVNZXRhZGF0YX0gZnJvbSAnLi90ZXN0X2JlZF9jb21tb24nO1xuaW1wb3J0IHtUZXN0aW5nQ29tcGlsZXIsIFRlc3RpbmdDb21waWxlckZhY3Rvcnl9IGZyb20gJy4vdGVzdF9jb21waWxlcic7XG5cblxubGV0IF9uZXh0Um9vdEVsZW1lbnRJZCA9IDA7XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRlc3RCZWQge1xuICBwbGF0Zm9ybTogUGxhdGZvcm1SZWY7XG5cbiAgbmdNb2R1bGU6IFR5cGU8YW55PnxUeXBlPGFueT5bXTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgZW52aXJvbm1lbnQgZm9yIHRlc3Rpbmcgd2l0aCBhIGNvbXBpbGVyIGZhY3RvcnksIGEgUGxhdGZvcm1SZWYsIGFuZCBhblxuICAgKiBhbmd1bGFyIG1vZHVsZS4gVGhlc2UgYXJlIGNvbW1vbiB0byBldmVyeSB0ZXN0IGluIHRoZSBzdWl0ZS5cbiAgICpcbiAgICogVGhpcyBtYXkgb25seSBiZSBjYWxsZWQgb25jZSwgdG8gc2V0IHVwIHRoZSBjb21tb24gcHJvdmlkZXJzIGZvciB0aGUgY3VycmVudCB0ZXN0XG4gICAqIHN1aXRlIG9uIHRoZSBjdXJyZW50IHBsYXRmb3JtLiBJZiB5b3UgYWJzb2x1dGVseSBuZWVkIHRvIGNoYW5nZSB0aGUgcHJvdmlkZXJzLFxuICAgKiBmaXJzdCB1c2UgYHJlc2V0VGVzdEVudmlyb25tZW50YC5cbiAgICpcbiAgICogVGVzdCBtb2R1bGVzIGFuZCBwbGF0Zm9ybXMgZm9yIGluZGl2aWR1YWwgcGxhdGZvcm1zIGFyZSBhdmFpbGFibGUgZnJvbVxuICAgKiAnQGFuZ3VsYXIvPHBsYXRmb3JtX25hbWU+L3Rlc3RpbmcnLlxuICAgKi9cbiAgaW5pdFRlc3RFbnZpcm9ubWVudChcbiAgICAgIG5nTW9kdWxlOiBUeXBlPGFueT58VHlwZTxhbnk+W10sIHBsYXRmb3JtOiBQbGF0Zm9ybVJlZixcbiAgICAgIG9wdGlvbnM/OiBUZXN0RW52aXJvbm1lbnRPcHRpb25zKTogdm9pZDtcbiAgaW5pdFRlc3RFbnZpcm9ubWVudChcbiAgICAgIG5nTW9kdWxlOiBUeXBlPGFueT58VHlwZTxhbnk+W10sIHBsYXRmb3JtOiBQbGF0Zm9ybVJlZiwgYW90U3VtbWFyaWVzPzogKCkgPT4gYW55W10pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgcHJvdmlkZXJzIGZvciB0aGUgdGVzdCBpbmplY3Rvci5cbiAgICovXG4gIHJlc2V0VGVzdEVudmlyb25tZW50KCk6IHZvaWQ7XG5cbiAgcmVzZXRUZXN0aW5nTW9kdWxlKCk6IHZvaWQ7XG5cbiAgY29uZmlndXJlQ29tcGlsZXIoY29uZmlnOiB7cHJvdmlkZXJzPzogYW55W10sIHVzZUppdD86IGJvb2xlYW59KTogdm9pZDtcblxuICBjb25maWd1cmVUZXN0aW5nTW9kdWxlKG1vZHVsZURlZjogVGVzdE1vZHVsZU1ldGFkYXRhKTogdm9pZDtcblxuICBjb21waWxlQ29tcG9uZW50cygpOiBQcm9taXNlPGFueT47XG5cbiAgaW5qZWN0PFQ+KHRva2VuOiBQcm92aWRlclRva2VuPFQ+LCBub3RGb3VuZFZhbHVlPzogVCwgZmxhZ3M/OiBJbmplY3RGbGFncyk6IFQ7XG4gIGluamVjdDxUPih0b2tlbjogUHJvdmlkZXJUb2tlbjxUPiwgbm90Rm91bmRWYWx1ZTogbnVsbCwgZmxhZ3M/OiBJbmplY3RGbGFncyk6IFR8bnVsbDtcblxuICAvKiogQGRlcHJlY2F0ZWQgZnJvbSB2OS4wLjAgdXNlIFRlc3RCZWQuaW5qZWN0ICovXG4gIGdldDxUPih0b2tlbjogUHJvdmlkZXJUb2tlbjxUPiwgbm90Rm91bmRWYWx1ZT86IFQsIGZsYWdzPzogSW5qZWN0RmxhZ3MpOiBhbnk7XG4gIC8qKiBAZGVwcmVjYXRlZCBmcm9tIHY5LjAuMCB1c2UgVGVzdEJlZC5pbmplY3QgKi9cbiAgZ2V0KHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU/OiBhbnkpOiBhbnk7XG5cbiAgZXhlY3V0ZSh0b2tlbnM6IGFueVtdLCBmbjogRnVuY3Rpb24sIGNvbnRleHQ/OiBhbnkpOiBhbnk7XG5cbiAgb3ZlcnJpZGVNb2R1bGUobmdNb2R1bGU6IFR5cGU8YW55Piwgb3ZlcnJpZGU6IE1ldGFkYXRhT3ZlcnJpZGU8TmdNb2R1bGU+KTogdm9pZDtcblxuICBvdmVycmlkZUNvbXBvbmVudChjb21wb25lbnQ6IFR5cGU8YW55Piwgb3ZlcnJpZGU6IE1ldGFkYXRhT3ZlcnJpZGU8Q29tcG9uZW50Pik6IHZvaWQ7XG5cbiAgb3ZlcnJpZGVEaXJlY3RpdmUoZGlyZWN0aXZlOiBUeXBlPGFueT4sIG92ZXJyaWRlOiBNZXRhZGF0YU92ZXJyaWRlPERpcmVjdGl2ZT4pOiB2b2lkO1xuXG4gIG92ZXJyaWRlUGlwZShwaXBlOiBUeXBlPGFueT4sIG92ZXJyaWRlOiBNZXRhZGF0YU92ZXJyaWRlPFBpcGU+KTogdm9pZDtcblxuICAvKipcbiAgICogT3ZlcndyaXRlcyBhbGwgcHJvdmlkZXJzIGZvciB0aGUgZ2l2ZW4gdG9rZW4gd2l0aCB0aGUgZ2l2ZW4gcHJvdmlkZXIgZGVmaW5pdGlvbi5cbiAgICovXG4gIG92ZXJyaWRlUHJvdmlkZXIodG9rZW46IGFueSwgcHJvdmlkZXI6IHtcbiAgICB1c2VGYWN0b3J5OiBGdW5jdGlvbixcbiAgICBkZXBzOiBhbnlbXSxcbiAgfSk6IHZvaWQ7XG4gIG92ZXJyaWRlUHJvdmlkZXIodG9rZW46IGFueSwgcHJvdmlkZXI6IHt1c2VWYWx1ZTogYW55O30pOiB2b2lkO1xuICBvdmVycmlkZVByb3ZpZGVyKHRva2VuOiBhbnksIHByb3ZpZGVyOiB7dXNlRmFjdG9yeT86IEZ1bmN0aW9uLCB1c2VWYWx1ZT86IGFueSwgZGVwcz86IGFueVtdfSk6XG4gICAgICB2b2lkO1xuXG4gIG92ZXJyaWRlVGVtcGxhdGVVc2luZ1Rlc3RpbmdNb2R1bGUoY29tcG9uZW50OiBUeXBlPGFueT4sIHRlbXBsYXRlOiBzdHJpbmcpOiB2b2lkO1xuXG4gIGNyZWF0ZUNvbXBvbmVudDxUPihjb21wb25lbnQ6IFR5cGU8VD4pOiBDb21wb25lbnRGaXh0dXJlPFQ+O1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQ29uZmlndXJlcyBhbmQgaW5pdGlhbGl6ZXMgZW52aXJvbm1lbnQgZm9yIHVuaXQgdGVzdGluZyBhbmQgcHJvdmlkZXMgbWV0aG9kcyBmb3JcbiAqIGNyZWF0aW5nIGNvbXBvbmVudHMgYW5kIHNlcnZpY2VzIGluIHVuaXQgdGVzdHMuXG4gKlxuICogYFRlc3RCZWRgIGlzIHRoZSBwcmltYXJ5IGFwaSBmb3Igd3JpdGluZyB1bml0IHRlc3RzIGZvciBBbmd1bGFyIGFwcGxpY2F0aW9ucyBhbmQgbGlicmFyaWVzLlxuICpcbiAqIE5vdGU6IFVzZSBgVGVzdEJlZGAgaW4gdGVzdHMuIEl0IHdpbGwgYmUgc2V0IHRvIGVpdGhlciBgVGVzdEJlZFZpZXdFbmdpbmVgIG9yIGBUZXN0QmVkUmVuZGVyM2BcbiAqIGFjY29yZGluZyB0byB0aGUgY29tcGlsZXIgdXNlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRlc3RCZWRWaWV3RW5naW5lIGltcGxlbWVudHMgVGVzdEJlZCB7XG4gIC8qKlxuICAgKiBUZWFyZG93biBvcHRpb25zIHRoYXQgaGF2ZSBiZWVuIGNvbmZpZ3VyZWQgYXQgdGhlIGVudmlyb25tZW50IGxldmVsLlxuICAgKiBVc2VkIGFzIGEgZmFsbGJhY2sgaWYgbm8gaW5zdGFuY2UtbGV2ZWwgb3B0aW9ucyBoYXZlIGJlZW4gcHJvdmlkZWQuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBfZW52aXJvbm1lbnRUZWFyZG93bk9wdGlvbnM6IE1vZHVsZVRlYXJkb3duT3B0aW9uc3x1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFRlYXJkb3duIG9wdGlvbnMgdGhhdCBoYXZlIGJlZW4gY29uZmlndXJlZCBhdCB0aGUgYFRlc3RCZWRgIGluc3RhbmNlIGxldmVsLlxuICAgKiBUaGVzZSBvcHRpb25zIHRha2UgcHJlY2VkZW5jZSBvdmVyIHRoZSBlbnZpcm9uZW1udC1sZXZlbCBvbmVzLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5zdGFuY2VUZWFyZG93bk9wdGlvbnM6IE1vZHVsZVRlYXJkb3duT3B0aW9uc3x1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGVudmlyb25tZW50IGZvciB0ZXN0aW5nIHdpdGggYSBjb21waWxlciBmYWN0b3J5LCBhIFBsYXRmb3JtUmVmLCBhbmQgYW5cbiAgICogYW5ndWxhciBtb2R1bGUuIFRoZXNlIGFyZSBjb21tb24gdG8gZXZlcnkgdGVzdCBpbiB0aGUgc3VpdGUuXG4gICAqXG4gICAqIFRoaXMgbWF5IG9ubHkgYmUgY2FsbGVkIG9uY2UsIHRvIHNldCB1cCB0aGUgY29tbW9uIHByb3ZpZGVycyBmb3IgdGhlIGN1cnJlbnQgdGVzdFxuICAgKiBzdWl0ZSBvbiB0aGUgY3VycmVudCBwbGF0Zm9ybS4gSWYgeW91IGFic29sdXRlbHkgbmVlZCB0byBjaGFuZ2UgdGhlIHByb3ZpZGVycyxcbiAgICogZmlyc3QgdXNlIGByZXNldFRlc3RFbnZpcm9ubWVudGAuXG4gICAqXG4gICAqIFRlc3QgbW9kdWxlcyBhbmQgcGxhdGZvcm1zIGZvciBpbmRpdmlkdWFsIHBsYXRmb3JtcyBhcmUgYXZhaWxhYmxlIGZyb21cbiAgICogJ0Bhbmd1bGFyLzxwbGF0Zm9ybV9uYW1lPi90ZXN0aW5nJy5cbiAgICovXG4gIHN0YXRpYyBpbml0VGVzdEVudmlyb25tZW50KFxuICAgICAgbmdNb2R1bGU6IFR5cGU8YW55PnxUeXBlPGFueT5bXSwgcGxhdGZvcm06IFBsYXRmb3JtUmVmLFxuICAgICAgc3VtbWFyaWVzT3JPcHRpb25zPzogVGVzdEVudmlyb25tZW50T3B0aW9uc3woKCkgPT4gYW55W10pKTogVGVzdEJlZFZpZXdFbmdpbmUge1xuICAgIGNvbnN0IHRlc3RCZWQgPSBfZ2V0VGVzdEJlZFZpZXdFbmdpbmUoKTtcbiAgICB0ZXN0QmVkLmluaXRUZXN0RW52aXJvbm1lbnQobmdNb2R1bGUsIHBsYXRmb3JtLCBzdW1tYXJpZXNPck9wdGlvbnMpO1xuICAgIHJldHVybiB0ZXN0QmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBwcm92aWRlcnMgZm9yIHRoZSB0ZXN0IGluamVjdG9yLlxuICAgKi9cbiAgc3RhdGljIHJlc2V0VGVzdEVudmlyb25tZW50KCk6IHZvaWQge1xuICAgIF9nZXRUZXN0QmVkVmlld0VuZ2luZSgpLnJlc2V0VGVzdEVudmlyb25tZW50KCk7XG4gIH1cblxuICBzdGF0aWMgcmVzZXRUZXN0aW5nTW9kdWxlKCk6IFRlc3RCZWRTdGF0aWMge1xuICAgIF9nZXRUZXN0QmVkVmlld0VuZ2luZSgpLnJlc2V0VGVzdGluZ01vZHVsZSgpO1xuICAgIHJldHVybiBUZXN0QmVkVmlld0VuZ2luZSBhcyBhbnkgYXMgVGVzdEJlZFN0YXRpYztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3Mgb3ZlcnJpZGluZyBkZWZhdWx0IGNvbXBpbGVyIHByb3ZpZGVycyBhbmQgc2V0dGluZ3NcbiAgICogd2hpY2ggYXJlIGRlZmluZWQgaW4gdGVzdF9pbmplY3Rvci5qc1xuICAgKi9cbiAgc3RhdGljIGNvbmZpZ3VyZUNvbXBpbGVyKGNvbmZpZzoge3Byb3ZpZGVycz86IGFueVtdOyB1c2VKaXQ/OiBib29sZWFuO30pOiBUZXN0QmVkU3RhdGljIHtcbiAgICBfZ2V0VGVzdEJlZFZpZXdFbmdpbmUoKS5jb25maWd1cmVDb21waWxlcihjb25maWcpO1xuICAgIHJldHVybiBUZXN0QmVkVmlld0VuZ2luZSBhcyBhbnkgYXMgVGVzdEJlZFN0YXRpYztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3Mgb3ZlcnJpZGluZyBkZWZhdWx0IHByb3ZpZGVycywgZGlyZWN0aXZlcywgcGlwZXMsIG1vZHVsZXMgb2YgdGhlIHRlc3QgaW5qZWN0b3IsXG4gICAqIHdoaWNoIGFyZSBkZWZpbmVkIGluIHRlc3RfaW5qZWN0b3IuanNcbiAgICovXG4gIHN0YXRpYyBjb25maWd1cmVUZXN0aW5nTW9kdWxlKG1vZHVsZURlZjogVGVzdE1vZHVsZU1ldGFkYXRhKTogVGVzdEJlZFN0YXRpYyB7XG4gICAgX2dldFRlc3RCZWRWaWV3RW5naW5lKCkuY29uZmlndXJlVGVzdGluZ01vZHVsZShtb2R1bGVEZWYpO1xuICAgIHJldHVybiBUZXN0QmVkVmlld0VuZ2luZSBhcyBhbnkgYXMgVGVzdEJlZFN0YXRpYztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21waWxlIGNvbXBvbmVudHMgd2l0aCBhIGB0ZW1wbGF0ZVVybGAgZm9yIHRoZSB0ZXN0J3MgTmdNb2R1bGUuXG4gICAqIEl0IGlzIG5lY2Vzc2FyeSB0byBjYWxsIHRoaXMgZnVuY3Rpb25cbiAgICogYXMgZmV0Y2hpbmcgdXJscyBpcyBhc3luY2hyb25vdXMuXG4gICAqL1xuICBzdGF0aWMgY29tcGlsZUNvbXBvbmVudHMoKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gZ2V0VGVzdEJlZCgpLmNvbXBpbGVDb21wb25lbnRzKCk7XG4gIH1cblxuICBzdGF0aWMgb3ZlcnJpZGVNb2R1bGUobmdNb2R1bGU6IFR5cGU8YW55Piwgb3ZlcnJpZGU6IE1ldGFkYXRhT3ZlcnJpZGU8TmdNb2R1bGU+KTogVGVzdEJlZFN0YXRpYyB7XG4gICAgX2dldFRlc3RCZWRWaWV3RW5naW5lKCkub3ZlcnJpZGVNb2R1bGUobmdNb2R1bGUsIG92ZXJyaWRlKTtcbiAgICByZXR1cm4gVGVzdEJlZFZpZXdFbmdpbmUgYXMgYW55IGFzIFRlc3RCZWRTdGF0aWM7XG4gIH1cblxuICBzdGF0aWMgb3ZlcnJpZGVDb21wb25lbnQoY29tcG9uZW50OiBUeXBlPGFueT4sIG92ZXJyaWRlOiBNZXRhZGF0YU92ZXJyaWRlPENvbXBvbmVudD4pOlxuICAgICAgVGVzdEJlZFN0YXRpYyB7XG4gICAgX2dldFRlc3RCZWRWaWV3RW5naW5lKCkub3ZlcnJpZGVDb21wb25lbnQoY29tcG9uZW50LCBvdmVycmlkZSk7XG4gICAgcmV0dXJuIFRlc3RCZWRWaWV3RW5naW5lIGFzIGFueSBhcyBUZXN0QmVkU3RhdGljO1xuICB9XG5cbiAgc3RhdGljIG92ZXJyaWRlRGlyZWN0aXZlKGRpcmVjdGl2ZTogVHlwZTxhbnk+LCBvdmVycmlkZTogTWV0YWRhdGFPdmVycmlkZTxEaXJlY3RpdmU+KTpcbiAgICAgIFRlc3RCZWRTdGF0aWMge1xuICAgIF9nZXRUZXN0QmVkVmlld0VuZ2luZSgpLm92ZXJyaWRlRGlyZWN0aXZlKGRpcmVjdGl2ZSwgb3ZlcnJpZGUpO1xuICAgIHJldHVybiBUZXN0QmVkVmlld0VuZ2luZSBhcyBhbnkgYXMgVGVzdEJlZFN0YXRpYztcbiAgfVxuXG4gIHN0YXRpYyBvdmVycmlkZVBpcGUocGlwZTogVHlwZTxhbnk+LCBvdmVycmlkZTogTWV0YWRhdGFPdmVycmlkZTxQaXBlPik6IFRlc3RCZWRTdGF0aWMge1xuICAgIF9nZXRUZXN0QmVkVmlld0VuZ2luZSgpLm92ZXJyaWRlUGlwZShwaXBlLCBvdmVycmlkZSk7XG4gICAgcmV0dXJuIFRlc3RCZWRWaWV3RW5naW5lIGFzIGFueSBhcyBUZXN0QmVkU3RhdGljO1xuICB9XG5cbiAgc3RhdGljIG92ZXJyaWRlVGVtcGxhdGUoY29tcG9uZW50OiBUeXBlPGFueT4sIHRlbXBsYXRlOiBzdHJpbmcpOiBUZXN0QmVkU3RhdGljIHtcbiAgICBfZ2V0VGVzdEJlZFZpZXdFbmdpbmUoKS5vdmVycmlkZUNvbXBvbmVudChjb21wb25lbnQsIHtzZXQ6IHt0ZW1wbGF0ZSwgdGVtcGxhdGVVcmw6IG51bGwhfX0pO1xuICAgIHJldHVybiBUZXN0QmVkVmlld0VuZ2luZSBhcyBhbnkgYXMgVGVzdEJlZFN0YXRpYztcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgdGhlIHRlbXBsYXRlIG9mIHRoZSBnaXZlbiBjb21wb25lbnQsIGNvbXBpbGluZyB0aGUgdGVtcGxhdGVcbiAgICogaW4gdGhlIGNvbnRleHQgb2YgdGhlIFRlc3RpbmdNb2R1bGUuXG4gICAqXG4gICAqIE5vdGU6IFRoaXMgd29ya3MgZm9yIEpJVCBhbmQgQU9UZWQgY29tcG9uZW50cyBhcyB3ZWxsLlxuICAgKi9cbiAgc3RhdGljIG92ZXJyaWRlVGVtcGxhdGVVc2luZ1Rlc3RpbmdNb2R1bGUoY29tcG9uZW50OiBUeXBlPGFueT4sIHRlbXBsYXRlOiBzdHJpbmcpOiBUZXN0QmVkU3RhdGljIHtcbiAgICBfZ2V0VGVzdEJlZFZpZXdFbmdpbmUoKS5vdmVycmlkZVRlbXBsYXRlVXNpbmdUZXN0aW5nTW9kdWxlKGNvbXBvbmVudCwgdGVtcGxhdGUpO1xuICAgIHJldHVybiBUZXN0QmVkVmlld0VuZ2luZSBhcyBhbnkgYXMgVGVzdEJlZFN0YXRpYztcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVyd3JpdGVzIGFsbCBwcm92aWRlcnMgZm9yIHRoZSBnaXZlbiB0b2tlbiB3aXRoIHRoZSBnaXZlbiBwcm92aWRlciBkZWZpbml0aW9uLlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIHdvcmtzIGZvciBKSVQgYW5kIEFPVGVkIGNvbXBvbmVudHMgYXMgd2VsbC5cbiAgICovXG4gIHN0YXRpYyBvdmVycmlkZVByb3ZpZGVyKHRva2VuOiBhbnksIHByb3ZpZGVyOiB7XG4gICAgdXNlRmFjdG9yeTogRnVuY3Rpb24sXG4gICAgZGVwczogYW55W10sXG4gIH0pOiBUZXN0QmVkU3RhdGljO1xuICBzdGF0aWMgb3ZlcnJpZGVQcm92aWRlcih0b2tlbjogYW55LCBwcm92aWRlcjoge3VzZVZhbHVlOiBhbnk7fSk6IFRlc3RCZWRTdGF0aWM7XG4gIHN0YXRpYyBvdmVycmlkZVByb3ZpZGVyKHRva2VuOiBhbnksIHByb3ZpZGVyOiB7XG4gICAgdXNlRmFjdG9yeT86IEZ1bmN0aW9uLFxuICAgIHVzZVZhbHVlPzogYW55LFxuICAgIGRlcHM/OiBhbnlbXSxcbiAgfSk6IFRlc3RCZWRTdGF0aWMge1xuICAgIF9nZXRUZXN0QmVkVmlld0VuZ2luZSgpLm92ZXJyaWRlUHJvdmlkZXIodG9rZW4sIHByb3ZpZGVyIGFzIGFueSk7XG4gICAgcmV0dXJuIFRlc3RCZWRWaWV3RW5naW5lIGFzIGFueSBhcyBUZXN0QmVkU3RhdGljO1xuICB9XG5cbiAgc3RhdGljIGluamVjdDxUPih0b2tlbjogUHJvdmlkZXJUb2tlbjxUPiwgbm90Rm91bmRWYWx1ZT86IFQsIGZsYWdzPzogSW5qZWN0RmxhZ3MpOiBUO1xuICBzdGF0aWMgaW5qZWN0PFQ+KHRva2VuOiBQcm92aWRlclRva2VuPFQ+LCBub3RGb3VuZFZhbHVlOiBudWxsLCBmbGFncz86IEluamVjdEZsYWdzKTogVHxudWxsO1xuICBzdGF0aWMgaW5qZWN0PFQ+KHRva2VuOiBQcm92aWRlclRva2VuPFQ+LCBub3RGb3VuZFZhbHVlPzogVHxudWxsLCBmbGFncz86IEluamVjdEZsYWdzKTogVHxudWxsIHtcbiAgICByZXR1cm4gX2dldFRlc3RCZWRWaWV3RW5naW5lKCkuaW5qZWN0KHRva2VuLCBub3RGb3VuZFZhbHVlLCBmbGFncyk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgZnJvbSB2OS4wLjAgdXNlIFRlc3RCZWQuaW5qZWN0ICovXG4gIHN0YXRpYyBnZXQ8VD4odG9rZW46IFByb3ZpZGVyVG9rZW48VD4sIG5vdEZvdW5kVmFsdWU/OiBULCBmbGFncz86IEluamVjdEZsYWdzKTogYW55O1xuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgZnJvbSB2OS4wLjAgdXNlIFRlc3RCZWQuaW5qZWN0XG4gICAqIEBzdXBwcmVzcyB7ZHVwbGljYXRlfVxuICAgKi9cbiAgc3RhdGljIGdldCh0b2tlbjogYW55LCBub3RGb3VuZFZhbHVlPzogYW55KTogYW55O1xuICAvKiogQGRlcHJlY2F0ZWQgZnJvbSB2OS4wLjAgdXNlIFRlc3RCZWQuaW5qZWN0ICovXG4gIHN0YXRpYyBnZXQoXG4gICAgICB0b2tlbjogYW55LCBub3RGb3VuZFZhbHVlOiBhbnkgPSBJbmplY3Rvci5USFJPV19JRl9OT1RfRk9VTkQsXG4gICAgICBmbGFnczogSW5qZWN0RmxhZ3MgPSBJbmplY3RGbGFncy5EZWZhdWx0KTogYW55IHtcbiAgICByZXR1cm4gX2dldFRlc3RCZWRWaWV3RW5naW5lKCkuaW5qZWN0KHRva2VuLCBub3RGb3VuZFZhbHVlLCBmbGFncyk7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlQ29tcG9uZW50PFQ+KGNvbXBvbmVudDogVHlwZTxUPik6IENvbXBvbmVudEZpeHR1cmU8VD4ge1xuICAgIHJldHVybiBfZ2V0VGVzdEJlZFZpZXdFbmdpbmUoKS5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50KTtcbiAgfVxuXG4gIHN0YXRpYyBzaG91bGRUZWFyRG93blRlc3RpbmdNb2R1bGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIF9nZXRUZXN0QmVkVmlld0VuZ2luZSgpLnNob3VsZFRlYXJEb3duVGVzdGluZ01vZHVsZSgpO1xuICB9XG5cbiAgc3RhdGljIHRlYXJEb3duVGVzdGluZ01vZHVsZSgpOiB2b2lkIHtcbiAgICBfZ2V0VGVzdEJlZFZpZXdFbmdpbmUoKS50ZWFyRG93blRlc3RpbmdNb2R1bGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luc3RhbnRpYXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2NvbXBpbGVyOiBUZXN0aW5nQ29tcGlsZXIgPSBudWxsITtcbiAgcHJpdmF0ZSBfbW9kdWxlUmVmOiBOZ01vZHVsZVJlZjxhbnk+fG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9tb2R1bGVGYWN0b3J5OiBOZ01vZHVsZUZhY3Rvcnk8YW55PnxudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfcGVuZGluZ01vZHVsZUZhY3Rvcnk6IFR5cGU8dW5rbm93bj58bnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfY29tcGlsZXJPcHRpb25zOiBDb21waWxlck9wdGlvbnNbXSA9IFtdO1xuXG4gIHByaXZhdGUgX21vZHVsZU92ZXJyaWRlczogW1R5cGU8YW55PiwgTWV0YWRhdGFPdmVycmlkZTxOZ01vZHVsZT5dW10gPSBbXTtcbiAgcHJpdmF0ZSBfY29tcG9uZW50T3ZlcnJpZGVzOiBbVHlwZTxhbnk+LCBNZXRhZGF0YU92ZXJyaWRlPENvbXBvbmVudD5dW10gPSBbXTtcbiAgcHJpdmF0ZSBfZGlyZWN0aXZlT3ZlcnJpZGVzOiBbVHlwZTxhbnk+LCBNZXRhZGF0YU92ZXJyaWRlPERpcmVjdGl2ZT5dW10gPSBbXTtcbiAgcHJpdmF0ZSBfcGlwZU92ZXJyaWRlczogW1R5cGU8YW55PiwgTWV0YWRhdGFPdmVycmlkZTxQaXBlPl1bXSA9IFtdO1xuXG4gIHByaXZhdGUgX3Byb3ZpZGVyczogUHJvdmlkZXJbXSA9IFtdO1xuICBwcml2YXRlIF9kZWNsYXJhdGlvbnM6IEFycmF5PFR5cGU8YW55PnxhbnlbXXxhbnk+ID0gW107XG4gIHByaXZhdGUgX2ltcG9ydHM6IEFycmF5PFR5cGU8YW55PnxhbnlbXXxhbnk+ID0gW107XG4gIHByaXZhdGUgX3NjaGVtYXM6IEFycmF5PFNjaGVtYU1ldGFkYXRhfGFueVtdPiA9IFtdO1xuICBwcml2YXRlIF9hY3RpdmVGaXh0dXJlczogQ29tcG9uZW50Rml4dHVyZTxhbnk+W10gPSBbXTtcblxuICBwcml2YXRlIF90ZXN0RW52QW90U3VtbWFyaWVzOiAoKSA9PiBhbnlbXSA9ICgpID0+IFtdO1xuICBwcml2YXRlIF9hb3RTdW1tYXJpZXM6IEFycmF5PCgpID0+IGFueVtdPiA9IFtdO1xuICBwcml2YXRlIF90ZW1wbGF0ZU92ZXJyaWRlczogQXJyYXk8e2NvbXBvbmVudDogVHlwZTxhbnk+LCB0ZW1wbGF0ZU9mOiBUeXBlPGFueT59PiA9IFtdO1xuXG4gIHByaXZhdGUgX2lzUm9vdDogYm9vbGVhbiA9IHRydWU7XG4gIHByaXZhdGUgX3Jvb3RQcm92aWRlck92ZXJyaWRlczogUHJvdmlkZXJbXSA9IFtdO1xuXG4gIHBsYXRmb3JtOiBQbGF0Zm9ybVJlZiA9IG51bGwhO1xuXG4gIG5nTW9kdWxlOiBUeXBlPGFueT58VHlwZTxhbnk+W10gPSBudWxsITtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgZW52aXJvbm1lbnQgZm9yIHRlc3Rpbmcgd2l0aCBhIGNvbXBpbGVyIGZhY3RvcnksIGEgUGxhdGZvcm1SZWYsIGFuZCBhblxuICAgKiBhbmd1bGFyIG1vZHVsZS4gVGhlc2UgYXJlIGNvbW1vbiB0byBldmVyeSB0ZXN0IGluIHRoZSBzdWl0ZS5cbiAgICpcbiAgICogVGhpcyBtYXkgb25seSBiZSBjYWxsZWQgb25jZSwgdG8gc2V0IHVwIHRoZSBjb21tb24gcHJvdmlkZXJzIGZvciB0aGUgY3VycmVudCB0ZXN0XG4gICAqIHN1aXRlIG9uIHRoZSBjdXJyZW50IHBsYXRmb3JtLiBJZiB5b3UgYWJzb2x1dGVseSBuZWVkIHRvIGNoYW5nZSB0aGUgcHJvdmlkZXJzLFxuICAgKiBmaXJzdCB1c2UgYHJlc2V0VGVzdEVudmlyb25tZW50YC5cbiAgICpcbiAgICogVGVzdCBtb2R1bGVzIGFuZCBwbGF0Zm9ybXMgZm9yIGluZGl2aWR1YWwgcGxhdGZvcm1zIGFyZSBhdmFpbGFibGUgZnJvbVxuICAgKiAnQGFuZ3VsYXIvPHBsYXRmb3JtX25hbWU+L3Rlc3RpbmcnLlxuICAgKi9cbiAgaW5pdFRlc3RFbnZpcm9ubWVudChcbiAgICAgIG5nTW9kdWxlOiBUeXBlPGFueT58VHlwZTxhbnk+W10sIHBsYXRmb3JtOiBQbGF0Zm9ybVJlZixcbiAgICAgIHN1bW1hcmllc09yT3B0aW9ucz86IFRlc3RFbnZpcm9ubWVudE9wdGlvbnN8KCgpID0+IGFueVtdKSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBsYXRmb3JtIHx8IHRoaXMubmdNb2R1bGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNldCBiYXNlIHByb3ZpZGVycyBiZWNhdXNlIGl0IGhhcyBhbHJlYWR5IGJlZW4gY2FsbGVkJyk7XG4gICAgfVxuICAgIHRoaXMucGxhdGZvcm0gPSBwbGF0Zm9ybTtcbiAgICB0aGlzLm5nTW9kdWxlID0gbmdNb2R1bGU7XG4gICAgaWYgKHR5cGVvZiBzdW1tYXJpZXNPck9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuX3Rlc3RFbnZBb3RTdW1tYXJpZXMgPSBzdW1tYXJpZXNPck9wdGlvbnM7XG4gICAgICBUZXN0QmVkVmlld0VuZ2luZS5fZW52aXJvbm1lbnRUZWFyZG93bk9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Rlc3RFbnZBb3RTdW1tYXJpZXMgPSAoc3VtbWFyaWVzT3JPcHRpb25zPy5hb3RTdW1tYXJpZXMpIHx8ICgoKSA9PiBbXSk7XG4gICAgICBUZXN0QmVkVmlld0VuZ2luZS5fZW52aXJvbm1lbnRUZWFyZG93bk9wdGlvbnMgPSBzdW1tYXJpZXNPck9wdGlvbnM/LnRlYXJkb3duO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgcHJvdmlkZXJzIGZvciB0aGUgdGVzdCBpbmplY3Rvci5cbiAgICovXG4gIHJlc2V0VGVzdEVudmlyb25tZW50KCk6IHZvaWQge1xuICAgIHRoaXMucmVzZXRUZXN0aW5nTW9kdWxlKCk7XG4gICAgdGhpcy5wbGF0Zm9ybSA9IG51bGwhO1xuICAgIHRoaXMubmdNb2R1bGUgPSBudWxsITtcbiAgICB0aGlzLl90ZXN0RW52QW90U3VtbWFyaWVzID0gKCkgPT4gW107XG4gICAgVGVzdEJlZFZpZXdFbmdpbmUuX2Vudmlyb25tZW50VGVhcmRvd25PcHRpb25zID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmVzZXRUZXN0aW5nTW9kdWxlKCk6IHZvaWQge1xuICAgIGNsZWFyT3ZlcnJpZGVzKCk7XG4gICAgdGhpcy5fYW90U3VtbWFyaWVzID0gW107XG4gICAgdGhpcy5fdGVtcGxhdGVPdmVycmlkZXMgPSBbXTtcbiAgICB0aGlzLl9jb21waWxlciA9IG51bGwhO1xuICAgIHRoaXMuX21vZHVsZU92ZXJyaWRlcyA9IFtdO1xuICAgIHRoaXMuX2NvbXBvbmVudE92ZXJyaWRlcyA9IFtdO1xuICAgIHRoaXMuX2RpcmVjdGl2ZU92ZXJyaWRlcyA9IFtdO1xuICAgIHRoaXMuX3BpcGVPdmVycmlkZXMgPSBbXTtcblxuICAgIHRoaXMuX2lzUm9vdCA9IHRydWU7XG4gICAgdGhpcy5fcm9vdFByb3ZpZGVyT3ZlcnJpZGVzID0gW107XG5cbiAgICB0aGlzLl9tb2R1bGVGYWN0b3J5ID0gbnVsbDtcbiAgICB0aGlzLl9wZW5kaW5nTW9kdWxlRmFjdG9yeSA9IG51bGw7XG4gICAgdGhpcy5fY29tcGlsZXJPcHRpb25zID0gW107XG4gICAgdGhpcy5fcHJvdmlkZXJzID0gW107XG4gICAgdGhpcy5fZGVjbGFyYXRpb25zID0gW107XG4gICAgdGhpcy5faW1wb3J0cyA9IFtdO1xuICAgIHRoaXMuX3NjaGVtYXMgPSBbXTtcblxuICAgIC8vIFdlIGhhdmUgdG8gY2hhaW4gYSBjb3VwbGUgb2YgdHJ5L2ZpbmFsbHkgYmxvY2tzLCBiZWNhdXNlIGVhY2ggc3RlcCBjYW5cbiAgICAvLyB0aHJvdyBlcnJvcnMgYW5kIHdlIGRvbid0IHdhbnQgaXQgdG8gaW50ZXJydXB0IHRoZSBuZXh0IHN0ZXAgYW5kIHdlIGFsc29cbiAgICAvLyB3YW50IGFuIGVycm9yIHRvIGJlIHRocm93biBhdCB0aGUgZW5kLlxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRlc3Ryb3lBY3RpdmVGaXh0dXJlcygpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodGhpcy5zaG91bGRUZWFyRG93blRlc3RpbmdNb2R1bGUoKSkge1xuICAgICAgICAgIHRoaXMudGVhckRvd25UZXN0aW5nTW9kdWxlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuX21vZHVsZVJlZiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2luc3RhbmNlVGVhcmRvd25PcHRpb25zID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9pbnN0YW50aWF0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25maWd1cmVDb21waWxlcihjb25maWc6IHtwcm92aWRlcnM/OiBhbnlbXSwgdXNlSml0PzogYm9vbGVhbn0pOiB2b2lkIHtcbiAgICB0aGlzLl9hc3NlcnROb3RJbnN0YW50aWF0ZWQoJ1Rlc3RCZWQuY29uZmlndXJlQ29tcGlsZXInLCAnY29uZmlndXJlIHRoZSBjb21waWxlcicpO1xuICAgIHRoaXMuX2NvbXBpbGVyT3B0aW9ucy5wdXNoKGNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmVUZXN0aW5nTW9kdWxlKG1vZHVsZURlZjogVGVzdE1vZHVsZU1ldGFkYXRhKTogdm9pZCB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90SW5zdGFudGlhdGVkKCdUZXN0QmVkLmNvbmZpZ3VyZVRlc3RpbmdNb2R1bGUnLCAnY29uZmlndXJlIHRoZSB0ZXN0IG1vZHVsZScpO1xuICAgIGlmIChtb2R1bGVEZWYucHJvdmlkZXJzKSB7XG4gICAgICB0aGlzLl9wcm92aWRlcnMucHVzaCguLi5tb2R1bGVEZWYucHJvdmlkZXJzKTtcbiAgICB9XG4gICAgaWYgKG1vZHVsZURlZi5kZWNsYXJhdGlvbnMpIHtcbiAgICAgIHRoaXMuX2RlY2xhcmF0aW9ucy5wdXNoKC4uLm1vZHVsZURlZi5kZWNsYXJhdGlvbnMpO1xuICAgIH1cbiAgICBpZiAobW9kdWxlRGVmLmltcG9ydHMpIHtcbiAgICAgIHRoaXMuX2ltcG9ydHMucHVzaCguLi5tb2R1bGVEZWYuaW1wb3J0cyk7XG4gICAgfVxuICAgIGlmIChtb2R1bGVEZWYuc2NoZW1hcykge1xuICAgICAgdGhpcy5fc2NoZW1hcy5wdXNoKC4uLm1vZHVsZURlZi5zY2hlbWFzKTtcbiAgICB9XG4gICAgaWYgKG1vZHVsZURlZi5hb3RTdW1tYXJpZXMpIHtcbiAgICAgIHRoaXMuX2FvdFN1bW1hcmllcy5wdXNoKG1vZHVsZURlZi5hb3RTdW1tYXJpZXMpO1xuICAgIH1cbiAgICAvLyBBbHdheXMgcmUtYXNzaWduIHRoZSB0ZWFyZG93biBvcHRpb25zLCBldmVuIGlmIHRoZXkncmUgdW5kZWZpbmVkLlxuICAgIC8vIFRoaXMgZW5zdXJlcyB0aGF0IHdlIGRvbid0IGNhcnJ5IHRoZSBvcHRpb25zIGJldHdlZW4gdGVzdHMuXG4gICAgdGhpcy5faW5zdGFuY2VUZWFyZG93bk9wdGlvbnMgPSBtb2R1bGVEZWYudGVhcmRvd247XG4gIH1cblxuICBjb21waWxlQ29tcG9uZW50cygpOiBQcm9taXNlPGFueT4ge1xuICAgIGlmICh0aGlzLl9tb2R1bGVGYWN0b3J5IHx8IHRoaXMuX2luc3RhbnRpYXRlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB9XG5cbiAgICBjb25zdCBtb2R1bGVUeXBlID0gdGhpcy5fY3JlYXRlQ29tcGlsZXJBbmRNb2R1bGUoKTtcbiAgICB0aGlzLl9wZW5kaW5nTW9kdWxlRmFjdG9yeSA9IG1vZHVsZVR5cGU7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVyLmNvbXBpbGVNb2R1bGVBbmRBbGxDb21wb25lbnRzQXN5bmMobW9kdWxlVHlwZSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgLy8gSWYgdGhlIG1vZHVsZSBtaXNtYXRjaGVzIGJ5IHRoZSB0aW1lIHRoZSBwcm9taXNlIHJlc29sdmVzLCBpdCBtZWFucyB0aGF0IHRoZSBtb2R1bGUgaGFzXG4gICAgICAvLyBhbHJlYWR5IGJlZW4gZGVzdHJveWVkIGFuZCBhIG5ldyBjb21waWxhdGlvbiBoYXMgc3RhcnRlZC4gSWYgdGhhdCdzIHRoZSBjYXNlLCBhdm9pZFxuICAgICAgLy8gb3ZlcndyaXRpbmcgdGhlIG1vZHVsZSBmYWN0b3J5LCBiZWNhdXNlIGl0IGNhbiBjYXVzZSBkb3duc3RyZWFtIGVycm9ycy5cbiAgICAgIGlmICh0aGlzLl9wZW5kaW5nTW9kdWxlRmFjdG9yeSA9PT0gbW9kdWxlVHlwZSkge1xuICAgICAgICB0aGlzLl9tb2R1bGVGYWN0b3J5ID0gcmVzdWx0Lm5nTW9kdWxlRmFjdG9yeTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ01vZHVsZUZhY3RvcnkgPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdElmTmVlZGVkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pbnN0YW50aWF0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9tb2R1bGVGYWN0b3J5KSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBtb2R1bGVUeXBlID0gdGhpcy5fY3JlYXRlQ29tcGlsZXJBbmRNb2R1bGUoKTtcbiAgICAgICAgdGhpcy5fbW9kdWxlRmFjdG9yeSA9XG4gICAgICAgICAgICB0aGlzLl9jb21waWxlci5jb21waWxlTW9kdWxlQW5kQWxsQ29tcG9uZW50c1N5bmMobW9kdWxlVHlwZSkubmdNb2R1bGVGYWN0b3J5O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zdCBlcnJvckNvbXBUeXBlID0gdGhpcy5fY29tcGlsZXIuZ2V0Q29tcG9uZW50RnJvbUVycm9yKGUpO1xuICAgICAgICBpZiAoZXJyb3JDb21wVHlwZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYFRoaXMgdGVzdCBtb2R1bGUgdXNlcyB0aGUgY29tcG9uZW50ICR7XG4gICAgICAgICAgICAgICAgICBzdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgICAgICAgZXJyb3JDb21wVHlwZSl9IHdoaWNoIGlzIHVzaW5nIGEgXCJ0ZW1wbGF0ZVVybFwiIG9yIFwic3R5bGVVcmxzXCIsIGJ1dCB0aGV5IHdlcmUgbmV2ZXIgY29tcGlsZWQuIGAgK1xuICAgICAgICAgICAgICBgUGxlYXNlIGNhbGwgXCJUZXN0QmVkLmNvbXBpbGVDb21wb25lbnRzXCIgYmVmb3JlIHlvdXIgdGVzdC5gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3Qge2NvbXBvbmVudCwgdGVtcGxhdGVPZn0gb2YgdGhpcy5fdGVtcGxhdGVPdmVycmlkZXMpIHtcbiAgICAgIGNvbnN0IGNvbXBGYWN0b3J5ID0gdGhpcy5fY29tcGlsZXIuZ2V0Q29tcG9uZW50RmFjdG9yeSh0ZW1wbGF0ZU9mKTtcbiAgICAgIG92ZXJyaWRlQ29tcG9uZW50Vmlldyhjb21wb25lbnQsIGNvbXBGYWN0b3J5KTtcbiAgICB9XG5cbiAgICBjb25zdCBuZ1pvbmUgPVxuICAgICAgICBuZXcgTmdab25lKHtlbmFibGVMb25nU3RhY2tUcmFjZTogdHJ1ZSwgc2hvdWxkQ29hbGVzY2VFdmVudENoYW5nZURldGVjdGlvbjogZmFsc2V9KTtcbiAgICBjb25zdCBwcm92aWRlcnM6IFN0YXRpY1Byb3ZpZGVyW10gPSBbe3Byb3ZpZGU6IE5nWm9uZSwgdXNlVmFsdWU6IG5nWm9uZX1dO1xuICAgIGNvbnN0IG5nWm9uZUluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHByb3ZpZGVyczogcHJvdmlkZXJzLFxuICAgICAgcGFyZW50OiB0aGlzLnBsYXRmb3JtLmluamVjdG9yLFxuICAgICAgbmFtZTogdGhpcy5fbW9kdWxlRmFjdG9yeS5tb2R1bGVUeXBlLm5hbWVcbiAgICB9KTtcbiAgICB0aGlzLl9tb2R1bGVSZWYgPSB0aGlzLl9tb2R1bGVGYWN0b3J5LmNyZWF0ZShuZ1pvbmVJbmplY3Rvcik7XG4gICAgLy8gQXBwbGljYXRpb25Jbml0U3RhdHVzLnJ1bkluaXRpYWxpemVycygpIGlzIG1hcmtlZCBAaW50ZXJuYWwgdG8gY29yZS4gU28gY2FzdGluZyB0byBhbnlcbiAgICAvLyBiZWZvcmUgYWNjZXNzaW5nIGl0LlxuICAgICh0aGlzLl9tb2R1bGVSZWYuaW5qZWN0b3IuZ2V0KEFwcGxpY2F0aW9uSW5pdFN0YXR1cykgYXMgYW55KS5ydW5Jbml0aWFsaXplcnMoKTtcbiAgICB0aGlzLl9pbnN0YW50aWF0ZWQgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlQ29tcGlsZXJBbmRNb2R1bGUoKTogVHlwZTxhbnk+IHtcbiAgICBjb25zdCBwcm92aWRlcnMgPSB0aGlzLl9wcm92aWRlcnMuY29uY2F0KFt7cHJvdmlkZTogVGVzdEJlZCwgdXNlVmFsdWU6IHRoaXN9XSk7XG4gICAgY29uc3QgZGVjbGFyYXRpb25zID1cbiAgICAgICAgWy4uLnRoaXMuX2RlY2xhcmF0aW9ucywgLi4udGhpcy5fdGVtcGxhdGVPdmVycmlkZXMubWFwKGVudHJ5ID0+IGVudHJ5LnRlbXBsYXRlT2YpXTtcblxuICAgIGNvbnN0IHJvb3RTY29wZUltcG9ydHMgPSBbXTtcbiAgICBjb25zdCByb290UHJvdmlkZXJPdmVycmlkZXMgPSB0aGlzLl9yb290UHJvdmlkZXJPdmVycmlkZXM7XG4gICAgaWYgKHRoaXMuX2lzUm9vdCkge1xuICAgICAgQE5nTW9kdWxlKHtcbiAgICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgICAgLi4ucm9vdFByb3ZpZGVyT3ZlcnJpZGVzLFxuICAgICAgICBdLFxuICAgICAgICBqaXQ6IHRydWUsXG4gICAgICB9KVxuICAgICAgY2xhc3MgUm9vdFNjb3BlTW9kdWxlIHtcbiAgICAgIH1cbiAgICAgIHJvb3RTY29wZUltcG9ydHMucHVzaChSb290U2NvcGVNb2R1bGUpO1xuICAgIH1cbiAgICBwcm92aWRlcnMucHVzaCh7cHJvdmlkZTogSU5KRUNUT1JfU0NPUEUsIHVzZVZhbHVlOiB0aGlzLl9pc1Jvb3QgPyAncm9vdCcgOiBudWxsfSk7XG5cbiAgICBjb25zdCBpbXBvcnRzID0gW3Jvb3RTY29wZUltcG9ydHMsIHRoaXMubmdNb2R1bGUsIHRoaXMuX2ltcG9ydHNdO1xuICAgIGNvbnN0IHNjaGVtYXMgPSB0aGlzLl9zY2hlbWFzO1xuXG4gICAgQE5nTW9kdWxlKHtwcm92aWRlcnMsIGRlY2xhcmF0aW9ucywgaW1wb3J0cywgc2NoZW1hcywgaml0OiB0cnVlfSlcbiAgICBjbGFzcyBEeW5hbWljVGVzdE1vZHVsZSB7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcGlsZXJGYWN0b3J5ID0gdGhpcy5wbGF0Zm9ybS5pbmplY3Rvci5nZXQoVGVzdGluZ0NvbXBpbGVyRmFjdG9yeSk7XG4gICAgdGhpcy5fY29tcGlsZXIgPSBjb21waWxlckZhY3RvcnkuY3JlYXRlVGVzdGluZ0NvbXBpbGVyKHRoaXMuX2NvbXBpbGVyT3B0aW9ucyk7XG4gICAgZm9yIChjb25zdCBzdW1tYXJ5IG9mIFt0aGlzLl90ZXN0RW52QW90U3VtbWFyaWVzLCAuLi50aGlzLl9hb3RTdW1tYXJpZXNdKSB7XG4gICAgICB0aGlzLl9jb21waWxlci5sb2FkQW90U3VtbWFyaWVzKHN1bW1hcnkpO1xuICAgIH1cbiAgICB0aGlzLl9tb2R1bGVPdmVycmlkZXMuZm9yRWFjaCgoZW50cnkpID0+IHRoaXMuX2NvbXBpbGVyLm92ZXJyaWRlTW9kdWxlKGVudHJ5WzBdLCBlbnRyeVsxXSkpO1xuICAgIHRoaXMuX2NvbXBvbmVudE92ZXJyaWRlcy5mb3JFYWNoKFxuICAgICAgICAoZW50cnkpID0+IHRoaXMuX2NvbXBpbGVyLm92ZXJyaWRlQ29tcG9uZW50KGVudHJ5WzBdLCBlbnRyeVsxXSkpO1xuICAgIHRoaXMuX2RpcmVjdGl2ZU92ZXJyaWRlcy5mb3JFYWNoKFxuICAgICAgICAoZW50cnkpID0+IHRoaXMuX2NvbXBpbGVyLm92ZXJyaWRlRGlyZWN0aXZlKGVudHJ5WzBdLCBlbnRyeVsxXSkpO1xuICAgIHRoaXMuX3BpcGVPdmVycmlkZXMuZm9yRWFjaCgoZW50cnkpID0+IHRoaXMuX2NvbXBpbGVyLm92ZXJyaWRlUGlwZShlbnRyeVswXSwgZW50cnlbMV0pKTtcbiAgICByZXR1cm4gRHluYW1pY1Rlc3RNb2R1bGU7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnROb3RJbnN0YW50aWF0ZWQobWV0aG9kTmFtZTogc3RyaW5nLCBtZXRob2REZXNjcmlwdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX2luc3RhbnRpYXRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBDYW5ub3QgJHttZXRob2REZXNjcmlwdGlvbn0gd2hlbiB0aGUgdGVzdCBtb2R1bGUgaGFzIGFscmVhZHkgYmVlbiBpbnN0YW50aWF0ZWQuIGAgK1xuICAgICAgICAgIGBNYWtlIHN1cmUgeW91IGFyZSBub3QgdXNpbmcgXFxgaW5qZWN0XFxgIGJlZm9yZSBcXGAke21ldGhvZE5hbWV9XFxgLmApO1xuICAgIH1cbiAgfVxuXG4gIGluamVjdDxUPih0b2tlbjogUHJvdmlkZXJUb2tlbjxUPiwgbm90Rm91bmRWYWx1ZT86IFQsIGZsYWdzPzogSW5qZWN0RmxhZ3MpOiBUO1xuICBpbmplY3Q8VD4odG9rZW46IFByb3ZpZGVyVG9rZW48VD4sIG5vdEZvdW5kVmFsdWU6IG51bGwsIGZsYWdzPzogSW5qZWN0RmxhZ3MpOiBUfG51bGw7XG4gIGluamVjdDxUPih0b2tlbjogUHJvdmlkZXJUb2tlbjxUPiwgbm90Rm91bmRWYWx1ZT86IFR8bnVsbCwgZmxhZ3M/OiBJbmplY3RGbGFncyk6IFR8bnVsbCB7XG4gICAgdGhpcy5faW5pdElmTmVlZGVkKCk7XG4gICAgaWYgKHRva2VuIGFzIHVua25vd24gPT09IFRlc3RCZWQpIHtcbiAgICAgIHJldHVybiB0aGlzIGFzIGFueTtcbiAgICB9XG4gICAgLy8gVGVzdHMgY2FuIGluamVjdCB0aGluZ3MgZnJvbSB0aGUgbmcgbW9kdWxlIGFuZCBmcm9tIHRoZSBjb21waWxlcixcbiAgICAvLyBidXQgdGhlIG5nIG1vZHVsZSBjYW4ndCBpbmplY3QgdGhpbmdzIGZyb20gdGhlIGNvbXBpbGVyIGFuZCB2aWNlIHZlcnNhLlxuICAgIGNvbnN0IFVOREVGSU5FRCA9IHt9O1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX21vZHVsZVJlZiEuaW5qZWN0b3IuZ2V0KHRva2VuLCBVTkRFRklORUQsIGZsYWdzKTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBVTkRFRklORUQgPyB0aGlzLl9jb21waWxlci5pbmplY3Rvci5nZXQodG9rZW4sIG5vdEZvdW5kVmFsdWUsIGZsYWdzKSBhcyBhbnkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBmcm9tIHY5LjAuMCB1c2UgVGVzdEJlZC5pbmplY3QgKi9cbiAgZ2V0PFQ+KHRva2VuOiBQcm92aWRlclRva2VuPFQ+LCBub3RGb3VuZFZhbHVlPzogVCwgZmxhZ3M/OiBJbmplY3RGbGFncyk6IGFueTtcbiAgLyoqIEBkZXByZWNhdGVkIGZyb20gdjkuMC4wIHVzZSBUZXN0QmVkLmluamVjdCAqL1xuICBnZXQodG9rZW46IGFueSwgbm90Rm91bmRWYWx1ZT86IGFueSk6IGFueTtcbiAgLyoqIEBkZXByZWNhdGVkIGZyb20gdjkuMC4wIHVzZSBUZXN0QmVkLmluamVjdCAqL1xuICBnZXQodG9rZW46IGFueSwgbm90Rm91bmRWYWx1ZTogYW55ID0gSW5qZWN0b3IuVEhST1dfSUZfTk9UX0ZPVU5ELFxuICAgICAgZmxhZ3M6IEluamVjdEZsYWdzID0gSW5qZWN0RmxhZ3MuRGVmYXVsdCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuaW5qZWN0KHRva2VuLCBub3RGb3VuZFZhbHVlLCBmbGFncyk7XG4gIH1cblxuICBleGVjdXRlKHRva2VuczogYW55W10sIGZuOiBGdW5jdGlvbiwgY29udGV4dD86IGFueSk6IGFueSB7XG4gICAgdGhpcy5faW5pdElmTmVlZGVkKCk7XG4gICAgY29uc3QgcGFyYW1zID0gdG9rZW5zLm1hcCh0ID0+IHRoaXMuaW5qZWN0KHQpKTtcbiAgICByZXR1cm4gZm4uYXBwbHkoY29udGV4dCwgcGFyYW1zKTtcbiAgfVxuXG4gIG92ZXJyaWRlTW9kdWxlKG5nTW9kdWxlOiBUeXBlPGFueT4sIG92ZXJyaWRlOiBNZXRhZGF0YU92ZXJyaWRlPE5nTW9kdWxlPik6IHZvaWQge1xuICAgIHRoaXMuX2Fzc2VydE5vdEluc3RhbnRpYXRlZCgnb3ZlcnJpZGVNb2R1bGUnLCAnb3ZlcnJpZGUgbW9kdWxlIG1ldGFkYXRhJyk7XG4gICAgdGhpcy5fbW9kdWxlT3ZlcnJpZGVzLnB1c2goW25nTW9kdWxlLCBvdmVycmlkZV0pO1xuICB9XG5cbiAgb3ZlcnJpZGVDb21wb25lbnQoY29tcG9uZW50OiBUeXBlPGFueT4sIG92ZXJyaWRlOiBNZXRhZGF0YU92ZXJyaWRlPENvbXBvbmVudD4pOiB2b2lkIHtcbiAgICB0aGlzLl9hc3NlcnROb3RJbnN0YW50aWF0ZWQoJ292ZXJyaWRlQ29tcG9uZW50JywgJ292ZXJyaWRlIGNvbXBvbmVudCBtZXRhZGF0YScpO1xuICAgIHRoaXMuX2NvbXBvbmVudE92ZXJyaWRlcy5wdXNoKFtjb21wb25lbnQsIG92ZXJyaWRlXSk7XG4gIH1cblxuICBvdmVycmlkZURpcmVjdGl2ZShkaXJlY3RpdmU6IFR5cGU8YW55Piwgb3ZlcnJpZGU6IE1ldGFkYXRhT3ZlcnJpZGU8RGlyZWN0aXZlPik6IHZvaWQge1xuICAgIHRoaXMuX2Fzc2VydE5vdEluc3RhbnRpYXRlZCgnb3ZlcnJpZGVEaXJlY3RpdmUnLCAnb3ZlcnJpZGUgZGlyZWN0aXZlIG1ldGFkYXRhJyk7XG4gICAgdGhpcy5fZGlyZWN0aXZlT3ZlcnJpZGVzLnB1c2goW2RpcmVjdGl2ZSwgb3ZlcnJpZGVdKTtcbiAgfVxuXG4gIG92ZXJyaWRlUGlwZShwaXBlOiBUeXBlPGFueT4sIG92ZXJyaWRlOiBNZXRhZGF0YU92ZXJyaWRlPFBpcGU+KTogdm9pZCB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90SW5zdGFudGlhdGVkKCdvdmVycmlkZVBpcGUnLCAnb3ZlcnJpZGUgcGlwZSBtZXRhZGF0YScpO1xuICAgIHRoaXMuX3BpcGVPdmVycmlkZXMucHVzaChbcGlwZSwgb3ZlcnJpZGVdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVyd3JpdGVzIGFsbCBwcm92aWRlcnMgZm9yIHRoZSBnaXZlbiB0b2tlbiB3aXRoIHRoZSBnaXZlbiBwcm92aWRlciBkZWZpbml0aW9uLlxuICAgKi9cbiAgb3ZlcnJpZGVQcm92aWRlcih0b2tlbjogYW55LCBwcm92aWRlcjoge1xuICAgIHVzZUZhY3Rvcnk6IEZ1bmN0aW9uLFxuICAgIGRlcHM6IGFueVtdLFxuICB9KTogdm9pZDtcbiAgb3ZlcnJpZGVQcm92aWRlcih0b2tlbjogYW55LCBwcm92aWRlcjoge3VzZVZhbHVlOiBhbnk7fSk6IHZvaWQ7XG4gIG92ZXJyaWRlUHJvdmlkZXIodG9rZW46IGFueSwgcHJvdmlkZXI6IHt1c2VGYWN0b3J5PzogRnVuY3Rpb24sIHVzZVZhbHVlPzogYW55LCBkZXBzPzogYW55W119KTpcbiAgICAgIHZvaWQge1xuICAgIHRoaXMuX2Fzc2VydE5vdEluc3RhbnRpYXRlZCgnb3ZlcnJpZGVQcm92aWRlcicsICdvdmVycmlkZSBwcm92aWRlcicpO1xuICAgIHRoaXMub3ZlcnJpZGVQcm92aWRlckltcGwodG9rZW4sIHByb3ZpZGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgb3ZlcnJpZGVQcm92aWRlckltcGwoXG4gICAgICB0b2tlbjogYW55LCBwcm92aWRlcjoge1xuICAgICAgICB1c2VGYWN0b3J5PzogRnVuY3Rpb24sXG4gICAgICAgIHVzZVZhbHVlPzogYW55LFxuICAgICAgICBkZXBzPzogYW55W10sXG4gICAgICB9LFxuICAgICAgZGVwcmVjYXRlZCA9IGZhbHNlKTogdm9pZCB7XG4gICAgbGV0IGRlZjogybXJtUluamVjdGFibGVEZWNsYXJhdGlvbjxhbnk+fG51bGwgPSBudWxsO1xuICAgIGlmICh0eXBlb2YgdG9rZW4gIT09ICdzdHJpbmcnICYmIChkZWYgPSBnZXRJbmplY3RhYmxlRGVmKHRva2VuKSkgJiYgZGVmLnByb3ZpZGVkSW4gPT09ICdyb290Jykge1xuICAgICAgaWYgKHByb3ZpZGVyLnVzZUZhY3RvcnkpIHtcbiAgICAgICAgdGhpcy5fcm9vdFByb3ZpZGVyT3ZlcnJpZGVzLnB1c2goXG4gICAgICAgICAgICB7cHJvdmlkZTogdG9rZW4sIHVzZUZhY3Rvcnk6IHByb3ZpZGVyLnVzZUZhY3RvcnksIGRlcHM6IHByb3ZpZGVyLmRlcHMgfHwgW119KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Jvb3RQcm92aWRlck92ZXJyaWRlcy5wdXNoKHtwcm92aWRlOiB0b2tlbiwgdXNlVmFsdWU6IHByb3ZpZGVyLnVzZVZhbHVlfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBmbGFnczogTm9kZUZsYWdzID0gMDtcbiAgICBsZXQgdmFsdWU6IGFueTtcbiAgICBpZiAocHJvdmlkZXIudXNlRmFjdG9yeSkge1xuICAgICAgZmxhZ3MgfD0gTm9kZUZsYWdzLlR5cGVGYWN0b3J5UHJvdmlkZXI7XG4gICAgICB2YWx1ZSA9IHByb3ZpZGVyLnVzZUZhY3Rvcnk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZsYWdzIHw9IE5vZGVGbGFncy5UeXBlVmFsdWVQcm92aWRlcjtcbiAgICAgIHZhbHVlID0gcHJvdmlkZXIudXNlVmFsdWU7XG4gICAgfVxuICAgIGNvbnN0IGRlcHMgPSAocHJvdmlkZXIuZGVwcyB8fCBbXSkubWFwKChkZXApID0+IHtcbiAgICAgIGxldCBkZXBGbGFnczogRGVwRmxhZ3MgPSBEZXBGbGFncy5Ob25lO1xuICAgICAgbGV0IGRlcFRva2VuOiBhbnk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShkZXApKSB7XG4gICAgICAgIGRlcC5mb3JFYWNoKChlbnRyeTogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKGVudHJ5IGluc3RhbmNlb2YgT3B0aW9uYWwpIHtcbiAgICAgICAgICAgIGRlcEZsYWdzIHw9IERlcEZsYWdzLk9wdGlvbmFsO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZW50cnkgaW5zdGFuY2VvZiBTa2lwU2VsZikge1xuICAgICAgICAgICAgZGVwRmxhZ3MgfD0gRGVwRmxhZ3MuU2tpcFNlbGY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlcFRva2VuID0gZW50cnk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlcFRva2VuID0gZGVwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtkZXBGbGFncywgZGVwVG9rZW5dO1xuICAgIH0pO1xuICAgIG92ZXJyaWRlUHJvdmlkZXIoe3Rva2VuLCBmbGFncywgZGVwcywgdmFsdWUsIGRlcHJlY2F0ZWRCZWhhdmlvcjogZGVwcmVjYXRlZH0pO1xuICB9XG5cbiAgb3ZlcnJpZGVUZW1wbGF0ZVVzaW5nVGVzdGluZ01vZHVsZShjb21wb25lbnQ6IFR5cGU8YW55PiwgdGVtcGxhdGU6IHN0cmluZykge1xuICAgIHRoaXMuX2Fzc2VydE5vdEluc3RhbnRpYXRlZCgnb3ZlcnJpZGVUZW1wbGF0ZVVzaW5nVGVzdGluZ01vZHVsZScsICdvdmVycmlkZSB0ZW1wbGF0ZScpO1xuXG4gICAgQENvbXBvbmVudCh7c2VsZWN0b3I6ICdlbXB0eScsIHRlbXBsYXRlLCBqaXQ6IHRydWV9KVxuICAgIGNsYXNzIE92ZXJyaWRlQ29tcG9uZW50IHtcbiAgICB9XG5cbiAgICB0aGlzLl90ZW1wbGF0ZU92ZXJyaWRlcy5wdXNoKHtjb21wb25lbnQsIHRlbXBsYXRlT2Y6IE92ZXJyaWRlQ29tcG9uZW50fSk7XG4gIH1cblxuICBjcmVhdGVDb21wb25lbnQ8VD4oY29tcG9uZW50OiBUeXBlPFQ+KTogQ29tcG9uZW50Rml4dHVyZTxUPiB7XG4gICAgdGhpcy5faW5pdElmTmVlZGVkKCk7XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuX2NvbXBpbGVyLmdldENvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50KTtcblxuICAgIGlmICghY29tcG9uZW50RmFjdG9yeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgY3JlYXRlIHRoZSBjb21wb25lbnQgJHtcbiAgICAgICAgICBzdHJpbmdpZnkoY29tcG9uZW50KX0gYXMgaXQgd2FzIG5vdCBpbXBvcnRlZCBpbnRvIHRoZSB0ZXN0aW5nIG1vZHVsZSFgKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBEb24ndCBjYXN0IGFzIGBJbmplY3Rpb25Ub2tlbjxib29sZWFuPmAsIGRlY2xhcmVkIHR5cGUgaXMgYm9vbGVhbltdXG4gICAgY29uc3Qgbm9OZ1pvbmUgPSB0aGlzLmluamVjdChDb21wb25lbnRGaXh0dXJlTm9OZ1pvbmUgYXMgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4sIGZhbHNlKTtcbiAgICAvLyBUT0RPOiBEb24ndCBjYXN0IGFzIGBJbmplY3Rpb25Ub2tlbjxib29sZWFuPmAsIGRlY2xhcmVkIHR5cGUgaXMgYm9vbGVhbltdXG4gICAgY29uc3QgYXV0b0RldGVjdDogYm9vbGVhbiA9XG4gICAgICAgIHRoaXMuaW5qZWN0KENvbXBvbmVudEZpeHR1cmVBdXRvRGV0ZWN0IGFzIEluamVjdGlvblRva2VuPGJvb2xlYW4+LCBmYWxzZSk7XG4gICAgY29uc3Qgbmdab25lOiBOZ1pvbmV8bnVsbCA9IG5vTmdab25lID8gbnVsbCA6IHRoaXMuaW5qZWN0KE5nWm9uZSwgbnVsbCk7XG4gICAgY29uc3QgdGVzdENvbXBvbmVudFJlbmRlcmVyOiBUZXN0Q29tcG9uZW50UmVuZGVyZXIgPSB0aGlzLmluamVjdChUZXN0Q29tcG9uZW50UmVuZGVyZXIpO1xuICAgIGNvbnN0IHJvb3RFbElkID0gYHJvb3Qke19uZXh0Um9vdEVsZW1lbnRJZCsrfWA7XG4gICAgdGVzdENvbXBvbmVudFJlbmRlcmVyLmluc2VydFJvb3RFbGVtZW50KHJvb3RFbElkKTtcblxuICAgIGNvbnN0IGluaXRDb21wb25lbnQgPSAoKSA9PiB7XG4gICAgICBjb25zdCBjb21wb25lbnRSZWYgPVxuICAgICAgICAgIGNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKEluamVjdG9yLk5VTEwsIFtdLCBgIyR7cm9vdEVsSWR9YCwgdGhpcy5fbW9kdWxlUmVmISk7XG4gICAgICByZXR1cm4gbmV3IENvbXBvbmVudEZpeHR1cmU8VD4oY29tcG9uZW50UmVmLCBuZ1pvbmUsIGF1dG9EZXRlY3QpO1xuICAgIH07XG5cbiAgICBjb25zdCBmaXh0dXJlID0gIW5nWm9uZSA/IGluaXRDb21wb25lbnQoKSA6IG5nWm9uZS5ydW4oaW5pdENvbXBvbmVudCk7XG4gICAgdGhpcy5fYWN0aXZlRml4dHVyZXMucHVzaChmaXh0dXJlKTtcbiAgICByZXR1cm4gZml4dHVyZTtcbiAgfVxuXG4gIHByaXZhdGUgZGVzdHJveUFjdGl2ZUZpeHR1cmVzKCk6IHZvaWQge1xuICAgIGxldCBlcnJvckNvdW50ID0gMDtcbiAgICB0aGlzLl9hY3RpdmVGaXh0dXJlcy5mb3JFYWNoKChmaXh0dXJlKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBmaXh0dXJlLmRlc3Ryb3koKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JDb3VudCsrO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkdXJpbmcgY2xlYW51cCBvZiBjb21wb25lbnQnLCB7XG4gICAgICAgICAgY29tcG9uZW50OiBmaXh0dXJlLmNvbXBvbmVudEluc3RhbmNlLFxuICAgICAgICAgIHN0YWNrdHJhY2U6IGUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX2FjdGl2ZUZpeHR1cmVzID0gW107XG5cbiAgICBpZiAoZXJyb3JDb3VudCA+IDAgJiYgdGhpcy5zaG91bGRSZXRocm93VGVhcmRvd25FcnJvcnMoKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgYCR7ZXJyb3JDb3VudH0gJHsoZXJyb3JDb3VudCA9PT0gMSA/ICdjb21wb25lbnQnIDogJ2NvbXBvbmVudHMnKX0gYCArXG4gICAgICAgICAgYHRocmV3IGVycm9ycyBkdXJpbmcgY2xlYW51cGApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2hvdWxkUmV0aHJvd1RlYXJkb3duRXJyb3JzKCkge1xuICAgIGNvbnN0IGluc3RhbmNlT3B0aW9ucyA9IHRoaXMuX2luc3RhbmNlVGVhcmRvd25PcHRpb25zO1xuICAgIGNvbnN0IGVudmlyb25tZW50T3B0aW9ucyA9IFRlc3RCZWRWaWV3RW5naW5lLl9lbnZpcm9ubWVudFRlYXJkb3duT3B0aW9ucztcblxuICAgIC8vIElmIHRoZSBuZXcgdGVhcmRvd24gYmVoYXZpb3IgaGFzbid0IGJlZW4gY29uZmlndXJlZCwgcHJlc2VydmUgdGhlIG9sZCBiZWhhdmlvci5cbiAgICBpZiAoIWluc3RhbmNlT3B0aW9ucyAmJiAhZW52aXJvbm1lbnRPcHRpb25zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlIHVzZSB0aGUgY29uZmlndXJlZCBiZWhhdmlvciBvciBkZWZhdWx0IHRvIHJldGhyb3dpbmcuXG4gICAgcmV0dXJuIGluc3RhbmNlT3B0aW9ucz8ucmV0aHJvd0Vycm9ycyA/PyBlbnZpcm9ubWVudE9wdGlvbnM/LnJldGhyb3dFcnJvcnMgPz8gdHJ1ZTtcbiAgfVxuXG4gIHNob3VsZFRlYXJEb3duVGVzdGluZ01vZHVsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW5zdGFuY2VUZWFyZG93bk9wdGlvbnM/LmRlc3Ryb3lBZnRlckVhY2ggPz9cbiAgICAgICAgVGVzdEJlZFZpZXdFbmdpbmUuX2Vudmlyb25tZW50VGVhcmRvd25PcHRpb25zPy5kZXN0cm95QWZ0ZXJFYWNoID8/XG4gICAgICAgIFRFQVJET1dOX1RFU1RJTkdfTU9EVUxFX09OX0RFU1RST1lfREVGQVVMVDtcbiAgfVxuXG4gIHRlYXJEb3duVGVzdGluZ01vZHVsZSgpIHtcbiAgICAvLyBJZiB0aGUgbW9kdWxlIHJlZiBoYXMgYWxyZWFkeSBiZWVuIGRlc3Ryb3llZCwgd2Ugd29uJ3QgYmUgYWJsZSB0byBnZXQgYSB0ZXN0IHJlbmRlcmVyLlxuICAgIGlmICh0aGlzLl9tb2R1bGVSZWYgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZXNvbHZlIHRoZSByZW5kZXJlciBhaGVhZCBvZiB0aW1lLCBiZWNhdXNlIHdlIHdhbnQgdG8gcmVtb3ZlIHRoZSByb290IGVsZW1lbnRzIGFzIHRoZSB2ZXJ5XG4gICAgLy8gbGFzdCBzdGVwLCBidXQgdGhlIGluamVjdG9yIHdpbGwgYmUgZGVzdHJveWVkIGFzIGEgcGFydCBvZiB0aGUgbW9kdWxlIHJlZiBkZXN0cnVjdGlvbi5cbiAgICBjb25zdCB0ZXN0UmVuZGVyZXIgPSB0aGlzLmluamVjdChUZXN0Q29tcG9uZW50UmVuZGVyZXIpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9tb2R1bGVSZWYuZGVzdHJveSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmICh0aGlzLl9pbnN0YW5jZVRlYXJkb3duT3B0aW9ucz8ucmV0aHJvd0Vycm9ycyA/P1xuICAgICAgICAgIFRlc3RCZWRWaWV3RW5naW5lLl9lbnZpcm9ubWVudFRlYXJkb3duT3B0aW9ucz8ucmV0aHJvd0Vycm9ycyA/PyB0cnVlKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkdXJpbmcgY2xlYW51cCBvZiBhIHRlc3RpbmcgbW9kdWxlJywge1xuICAgICAgICAgIGNvbXBvbmVudDogdGhpcy5fbW9kdWxlUmVmLmluc3RhbmNlLFxuICAgICAgICAgIHN0YWNrdHJhY2U6IGUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0ZXN0UmVuZGVyZXI/LnJlbW92ZUFsbFJvb3RFbGVtZW50cz8uKCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDb25maWd1cmVzIGFuZCBpbml0aWFsaXplcyBlbnZpcm9ubWVudCBmb3IgdW5pdCB0ZXN0aW5nIGFuZCBwcm92aWRlcyBtZXRob2RzIGZvclxuICogY3JlYXRpbmcgY29tcG9uZW50cyBhbmQgc2VydmljZXMgaW4gdW5pdCB0ZXN0cy5cbiAqXG4gKiBgVGVzdEJlZGAgaXMgdGhlIHByaW1hcnkgYXBpIGZvciB3cml0aW5nIHVuaXQgdGVzdHMgZm9yIEFuZ3VsYXIgYXBwbGljYXRpb25zIGFuZCBsaWJyYXJpZXMuXG4gKlxuICogTm90ZTogVXNlIGBUZXN0QmVkYCBpbiB0ZXN0cy4gSXQgd2lsbCBiZSBzZXQgdG8gZWl0aGVyIGBUZXN0QmVkVmlld0VuZ2luZWAgb3IgYFRlc3RCZWRSZW5kZXIzYFxuICogYWNjb3JkaW5nIHRvIHRoZSBjb21waWxlciB1c2VkLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IFRlc3RCZWQ6IFRlc3RCZWRTdGF0aWMgPVxuICAgIGl2eUVuYWJsZWQgPyBUZXN0QmVkUmVuZGVyMyBhcyBhbnkgYXMgVGVzdEJlZFN0YXRpYyA6IFRlc3RCZWRWaWV3RW5naW5lIGFzIGFueSBhcyBUZXN0QmVkU3RhdGljO1xuXG4vKipcbiAqIFJldHVybnMgYSBzaW5nbGV0b24gb2YgdGhlIGFwcGxpY2FibGUgYFRlc3RCZWRgLlxuICpcbiAqIEl0IHdpbGwgYmUgZWl0aGVyIGFuIGluc3RhbmNlIG9mIGBUZXN0QmVkVmlld0VuZ2luZWAgb3IgYFRlc3RCZWRSZW5kZXIzYC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRUZXN0QmVkOiAoKSA9PiBUZXN0QmVkID0gaXZ5RW5hYmxlZCA/IF9nZXRUZXN0QmVkUmVuZGVyMyA6IF9nZXRUZXN0QmVkVmlld0VuZ2luZTtcblxubGV0IHRlc3RCZWQ6IFRlc3RCZWRWaWV3RW5naW5lO1xuXG5mdW5jdGlvbiBfZ2V0VGVzdEJlZFZpZXdFbmdpbmUoKTogVGVzdEJlZFZpZXdFbmdpbmUge1xuICByZXR1cm4gdGVzdEJlZCA9IHRlc3RCZWQgfHwgbmV3IFRlc3RCZWRWaWV3RW5naW5lKCk7XG59XG5cbi8qKlxuICogQWxsb3dzIGluamVjdGluZyBkZXBlbmRlbmNpZXMgaW4gYGJlZm9yZUVhY2goKWAgYW5kIGBpdCgpYC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYFxuICogYmVmb3JlRWFjaChpbmplY3QoW0RlcGVuZGVuY3ksIEFDbGFzc10sIChkZXAsIG9iamVjdCkgPT4ge1xuICogICAvLyBzb21lIGNvZGUgdGhhdCB1c2VzIGBkZXBgIGFuZCBgb2JqZWN0YFxuICogICAvLyAuLi5cbiAqIH0pKTtcbiAqXG4gKiBpdCgnLi4uJywgaW5qZWN0KFtBQ2xhc3NdLCAob2JqZWN0KSA9PiB7XG4gKiAgIG9iamVjdC5kb1NvbWV0aGluZygpO1xuICogICBleHBlY3QoLi4uKTtcbiAqIH0pXG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3QodG9rZW5zOiBhbnlbXSwgZm46IEZ1bmN0aW9uKTogKCkgPT4gYW55IHtcbiAgY29uc3QgdGVzdEJlZCA9IGdldFRlc3RCZWQoKTtcbiAgLy8gTm90IHVzaW5nIGFuIGFycm93IGZ1bmN0aW9uIHRvIHByZXNlcnZlIGNvbnRleHQgcGFzc2VkIGZyb20gY2FsbCBzaXRlXG4gIHJldHVybiBmdW5jdGlvbih0aGlzOiB1bmtub3duKSB7XG4gICAgcmV0dXJuIHRlc3RCZWQuZXhlY3V0ZSh0b2tlbnMsIGZuLCB0aGlzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBJbmplY3RTZXR1cFdyYXBwZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tb2R1bGVEZWY6ICgpID0+IFRlc3RNb2R1bGVNZXRhZGF0YSkge31cblxuICBwcml2YXRlIF9hZGRNb2R1bGUoKSB7XG4gICAgY29uc3QgbW9kdWxlRGVmID0gdGhpcy5fbW9kdWxlRGVmKCk7XG4gICAgaWYgKG1vZHVsZURlZikge1xuICAgICAgZ2V0VGVzdEJlZCgpLmNvbmZpZ3VyZVRlc3RpbmdNb2R1bGUobW9kdWxlRGVmKTtcbiAgICB9XG4gIH1cblxuICBpbmplY3QodG9rZW5zOiBhbnlbXSwgZm46IEZ1bmN0aW9uKTogKCkgPT4gYW55IHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAvLyBOb3QgdXNpbmcgYW4gYXJyb3cgZnVuY3Rpb24gdG8gcHJlc2VydmUgY29udGV4dCBwYXNzZWQgZnJvbSBjYWxsIHNpdGVcbiAgICByZXR1cm4gZnVuY3Rpb24odGhpczogdW5rbm93bikge1xuICAgICAgc2VsZi5fYWRkTW9kdWxlKCk7XG4gICAgICByZXR1cm4gaW5qZWN0KHRva2VucywgZm4pLmNhbGwodGhpcyk7XG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhNb2R1bGUobW9kdWxlRGVmOiBUZXN0TW9kdWxlTWV0YWRhdGEpOiBJbmplY3RTZXR1cFdyYXBwZXI7XG5leHBvcnQgZnVuY3Rpb24gd2l0aE1vZHVsZShtb2R1bGVEZWY6IFRlc3RNb2R1bGVNZXRhZGF0YSwgZm46IEZ1bmN0aW9uKTogKCkgPT4gYW55O1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhNb2R1bGUobW9kdWxlRGVmOiBUZXN0TW9kdWxlTWV0YWRhdGEsIGZuPzogRnVuY3Rpb258bnVsbCk6ICgoKSA9PiBhbnkpfFxuICAgIEluamVjdFNldHVwV3JhcHBlciB7XG4gIGlmIChmbikge1xuICAgIC8vIE5vdCB1c2luZyBhbiBhcnJvdyBmdW5jdGlvbiB0byBwcmVzZXJ2ZSBjb250ZXh0IHBhc3NlZCBmcm9tIGNhbGwgc2l0ZVxuICAgIHJldHVybiBmdW5jdGlvbih0aGlzOiB1bmtub3duKSB7XG4gICAgICBjb25zdCB0ZXN0QmVkID0gZ2V0VGVzdEJlZCgpO1xuICAgICAgaWYgKG1vZHVsZURlZikge1xuICAgICAgICB0ZXN0QmVkLmNvbmZpZ3VyZVRlc3RpbmdNb2R1bGUobW9kdWxlRGVmKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBuZXcgSW5qZWN0U2V0dXBXcmFwcGVyKCgpID0+IG1vZHVsZURlZik7XG59XG4iXX0=