/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector } from '../di/injector';
import { INJECTOR } from '../di/injector_token';
import { InjectFlags } from '../di/interface/injector';
import { createInjectorWithoutInjectorInstances } from '../di/r3_injector';
import { ComponentFactoryResolver as viewEngine_ComponentFactoryResolver } from '../linker/component_factory_resolver';
import { NgModuleFactory as viewEngine_NgModuleFactory, NgModuleRef as viewEngine_NgModuleRef } from '../linker/ng_module_factory';
import { registerNgModuleType } from '../linker/ng_module_factory_registration';
import { assertDefined } from '../util/assert';
import { stringify } from '../util/stringify';
import { ComponentFactoryResolver } from './component_ref';
import { getNgLocaleIdDef, getNgModuleDef } from './definition';
import { setLocaleId } from './i18n/i18n_locale_id';
import { maybeUnwrapFn } from './util/misc_utils';
export class NgModuleRef extends viewEngine_NgModuleRef {
    constructor(ngModuleType, _parent) {
        super();
        this._parent = _parent;
        // tslint:disable-next-line:require-internal-with-underscore
        this._bootstrapComponents = [];
        this.injector = this;
        this.destroyCbs = [];
        // When bootstrapping a module we have a dependency graph that looks like this:
        // ApplicationRef -> ComponentFactoryResolver -> NgModuleRef. The problem is that if the
        // module being resolved tries to inject the ComponentFactoryResolver, it'll create a
        // circular dependency which will result in a runtime error, because the injector doesn't
        // exist yet. We work around the issue by creating the ComponentFactoryResolver ourselves
        // and providing it, rather than letting the injector resolve it.
        this.componentFactoryResolver = new ComponentFactoryResolver(this);
        const ngModuleDef = getNgModuleDef(ngModuleType);
        ngDevMode &&
            assertDefined(ngModuleDef, `NgModule '${stringify(ngModuleType)}' is not a subtype of 'NgModuleType'.`);
        const ngLocaleIdDef = getNgLocaleIdDef(ngModuleType);
        ngLocaleIdDef && setLocaleId(ngLocaleIdDef);
        this._bootstrapComponents = maybeUnwrapFn(ngModuleDef.bootstrap);
        this._r3Injector = createInjectorWithoutInjectorInstances(ngModuleType, _parent, [
            { provide: viewEngine_NgModuleRef, useValue: this }, {
                provide: viewEngine_ComponentFactoryResolver,
                useValue: this.componentFactoryResolver
            }
        ], stringify(ngModuleType));
        // We need to resolve the injector types separately from the injector creation, because
        // the module might be trying to use this ref in its contructor for DI which will cause a
        // circular error that will eventually error out, because the injector isn't created yet.
        this._r3Injector._resolveInjectorDefTypes();
        this.instance = this.get(ngModuleType);
    }
    get(token, notFoundValue = Injector.THROW_IF_NOT_FOUND, injectFlags = InjectFlags.Default) {
        if (token === Injector || token === viewEngine_NgModuleRef || token === INJECTOR) {
            return this;
        }
        return this._r3Injector.get(token, notFoundValue, injectFlags);
    }
    destroy() {
        ngDevMode && assertDefined(this.destroyCbs, 'NgModule already destroyed');
        const injector = this._r3Injector;
        !injector.destroyed && injector.destroy();
        this.destroyCbs.forEach(fn => fn());
        this.destroyCbs = null;
    }
    onDestroy(callback) {
        ngDevMode && assertDefined(this.destroyCbs, 'NgModule already destroyed');
        this.destroyCbs.push(callback);
    }
}
export class NgModuleFactory extends viewEngine_NgModuleFactory {
    constructor(moduleType) {
        super();
        this.moduleType = moduleType;
        const ngModuleDef = getNgModuleDef(moduleType);
        if (ngModuleDef !== null) {
            // Register the NgModule with Angular's module registry. The location (and hence timing) of
            // this call is critical to ensure this works correctly (modules get registered when expected)
            // without bloating bundles (modules are registered when otherwise not referenced).
            //
            // In View Engine, registration occurs in the .ngfactory.js file as a side effect. This has
            // several practical consequences:
            //
            // - If an .ngfactory file is not imported from, the module won't be registered (and can be
            //   tree shaken).
            // - If an .ngfactory file is imported from, the module will be registered even if an instance
            //   is not actually created (via `create` below).
            // - Since an .ngfactory file in View Engine references the .ngfactory files of the NgModule's
            //   imports,
            //
            // In Ivy, things are a bit different. .ngfactory files still exist for compatibility, but are
            // not a required API to use - there are other ways to obtain an NgModuleFactory for a given
            // NgModule. Thus, relying on a side effect in the .ngfactory file is not sufficient. Instead,
            // the side effect of registration is added here, in the constructor of NgModuleFactory,
            // ensuring no matter how a factory is created, the module is registered correctly.
            //
            // An alternative would be to include the registration side effect inline following the actual
            // NgModule definition. This also has the correct timing, but breaks tree-shaking - modules
            // will be registered and retained even if they're otherwise never referenced.
            registerNgModuleType(moduleType);
        }
    }
    create(parentInjector) {
        return new NgModuleRef(this.moduleType, parentInjector);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3JlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvbmdfbW9kdWxlX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsc0NBQXNDLEVBQWEsTUFBTSxtQkFBbUIsQ0FBQztBQUVyRixPQUFPLEVBQUMsd0JBQXdCLElBQUksbUNBQW1DLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUNySCxPQUFPLEVBQXNCLGVBQWUsSUFBSSwwQkFBMEIsRUFBRSxXQUFXLElBQUksc0JBQXNCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUN0SixPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQ0FBMEMsQ0FBQztBQUU5RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRTVDLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDOUQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2xELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVoRCxNQUFNLE9BQU8sV0FBZSxTQUFRLHNCQUF5QjtJQWtCM0QsWUFBWSxZQUFxQixFQUFTLE9BQXNCO1FBQzlELEtBQUssRUFBRSxDQUFDO1FBRGdDLFlBQU8sR0FBUCxPQUFPLENB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RixFQUFFO1lBQ0YsMkZBQTJGO1lBQzNGLGtDQUFrQztZQUNsQyxFQUFFO1lBQ0YsMkZBQTJGO1lBQzNGLGtCQUFrQjtZQUNsQiw4RkFBOEY7WUFDOUYsa0RBQWtEO1lBQ2xELDhGQUE4RjtZQUM5RixhQUFhO1lBQ2IsRUFBRTtZQUNGLDhGQUE4RjtZQUM5Riw0RkFBNEY7WUFDNUYsOEZBQThGO1lBQzlGLHdGQUF3RjtZQUN4RixtRkFBbUY7WUFDbkYsRUFBRTtZQUNGLDhGQUE4RjtZQUM5RiwyRkFBMkY7WUFDM0YsOEVBQThFO1lBQzlFLG9CQUFvQixDQUFDLFVBQTBCLENBQUMsQ0FBQztTQUNsRDtJQUNILENBQUM7SUFFUSxNQUFNLENBQUMsY0FBNkI7UUFDM0MsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzFELENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdG9yfSBmcm9tICcuLi9kaS9pbmplY3Rvcic7XG5pbXBvcnQge0lOSkVDVE9SfSBmcm9tICcuLi9kaS9pbmplY3Rvcl90b2tlbic7XG5pbXBvcnQge0luamVjdEZsYWdzfSBmcm9tICcuLi9kaS9pbnRlcmZhY2UvaW5qZWN0b3InO1xuaW1wb3J0IHtjcmVhdGVJbmplY3RvcldpdGhvdXRJbmplY3Rvckluc3RhbmNlcywgUjNJbmplY3Rvcn0gZnJvbSAnLi4vZGkvcjNfaW5qZWN0b3InO1xuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi9pbnRlcmZhY2UvdHlwZSc7XG5pbXBvcnQge0NvbXBvbmVudEZhY3RvcnlSZXNvbHZlciBhcyB2aWV3RW5naW5lX0NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcn0gZnJvbSAnLi4vbGlua2VyL2NvbXBvbmVudF9mYWN0b3J5X3Jlc29sdmVyJztcbmltcG9ydCB7SW50ZXJuYWxOZ01vZHVsZVJlZiwgTmdNb2R1bGVGYWN0b3J5IGFzIHZpZXdFbmdpbmVfTmdNb2R1bGVGYWN0b3J5LCBOZ01vZHVsZVJlZiBhcyB2aWV3RW5naW5lX05nTW9kdWxlUmVmfSBmcm9tICcuLi9saW5rZXIvbmdfbW9kdWxlX2ZhY3RvcnknO1xuaW1wb3J0IHtyZWdpc3Rlck5nTW9kdWxlVHlwZX0gZnJvbSAnLi4vbGlua2VyL25nX21vZHVsZV9mYWN0b3J5X3JlZ2lzdHJhdGlvbic7XG5pbXBvcnQge05nTW9kdWxlVHlwZX0gZnJvbSAnLi4vbWV0YWRhdGEvbmdfbW9kdWxlX2RlZic7XG5pbXBvcnQge2Fzc2VydERlZmluZWR9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7c3RyaW5naWZ5fSBmcm9tICcuLi91dGlsL3N0cmluZ2lmeSc7XG5cbmltcG9ydCB7Q29tcG9uZW50RmFjdG9yeVJlc29sdmVyfSBmcm9tICcuL2NvbXBvbmVudF9yZWYnO1xuaW1wb3J0IHtnZXROZ0xvY2FsZUlkRGVmLCBnZXROZ01vZHVsZURlZn0gZnJvbSAnLi9kZWZpbml0aW9uJztcbmltcG9ydCB7c2V0TG9jYWxlSWR9IGZyb20gJy4vaTE4bi9pMThuX2xvY2FsZV9pZCc7XG5pbXBvcnQge21heWJlVW53cmFwRm59IGZyb20gJy4vdXRpbC9taXNjX3V0aWxzJztcblxuZXhwb3J0IGNsYXNzIE5nTW9kdWxlUmVmPFQ+IGV4dGVuZHMgdmlld0VuZ2luZV9OZ01vZHVsZVJlZjxUPiBpbXBsZW1lbnRzIEludGVybmFsTmdNb2R1bGVSZWY8VD4ge1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgX2Jvb3RzdHJhcENvbXBvbmVudHM6IFR5cGU8YW55PltdID0gW107XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpyZXF1aXJlLWludGVybmFsLXdpdGgtdW5kZXJzY29yZVxuICBfcjNJbmplY3RvcjogUjNJbmplY3RvcjtcbiAgb3ZlcnJpZGUgaW5qZWN0b3I6IEluamVjdG9yID0gdGhpcztcbiAgb3ZlcnJpZGUgaW5zdGFuY2U6IFQ7XG4gIGRlc3Ryb3lDYnM6ICgoKSA9PiB2b2lkKVtdfG51bGwgPSBbXTtcblxuICAvLyBXaGVuIGJvb3RzdHJhcHBpbmcgYSBtb2R1bGUgd2UgaGF2ZSBhIGRlcGVuZGVuY3kgZ3JhcGggdGhhdCBsb29rcyBsaWtlIHRoaXM6XG4gIC8vIEFwcGxpY2F0aW9uUmVmIC0+IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciAtPiBOZ01vZHVsZVJlZi4gVGhlIHByb2JsZW0gaXMgdGhhdCBpZiB0aGVcbiAgLy8gbW9kdWxlIGJlaW5nIHJlc29sdmVkIHRyaWVzIHRvIGluamVjdCB0aGUgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBpdCdsbCBjcmVhdGUgYVxuICAvLyBjaXJjdWxhciBkZXBlbmRlbmN5IHdoaWNoIHdpbGwgcmVzdWx0IGluIGEgcnVudGltZSBlcnJvciwgYmVjYXVzZSB0aGUgaW5qZWN0b3IgZG9lc24ndFxuICAvLyBleGlzdCB5ZXQuIFdlIHdvcmsgYXJvdW5kIHRoZSBpc3N1ZSBieSBjcmVhdGluZyB0aGUgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyIG91cnNlbHZlc1xuICAvLyBhbmQgcHJvdmlkaW5nIGl0LCByYXRoZXIgdGhhbiBsZXR0aW5nIHRoZSBpbmplY3RvciByZXNvbHZlIGl0LlxuICBvdmVycmlkZSByZWFkb25seSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciA9XG4gICAgICBuZXcgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKHRoaXMpO1xuXG4gIGNvbnN0cnVjdG9yKG5nTW9kdWxlVHlwZTogVHlwZTxUPiwgcHVibGljIF9wYXJlbnQ6IEluamVjdG9yfG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IG5nTW9kdWxlRGVmID0gZ2V0TmdNb2R1bGVEZWYobmdNb2R1bGVUeXBlKTtcbiAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgYXNzZXJ0RGVmaW5lZChcbiAgICAgICAgICAgIG5nTW9kdWxlRGVmLFxuICAgICAgICAgICAgYE5nTW9kdWxlICcke3N0cmluZ2lmeShuZ01vZHVsZVR5cGUpfScgaXMgbm90IGEgc3VidHlwZSBvZiAnTmdNb2R1bGVUeXBlJy5gKTtcblxuICAgIGNvbnN0IG5nTG9jYWxlSWREZWYgPSBnZXROZ0xvY2FsZUlkRGVmKG5nTW9kdWxlVHlwZSk7XG4gICAgbmdMb2NhbGVJZERlZiAmJiBzZXRMb2NhbGVJZChuZ0xvY2FsZUlkRGVmKTtcbiAgICB0aGlzLl9ib290c3RyYXBDb21wb25lbnRzID0gbWF5YmVVbndyYXBGbihuZ01vZHVsZURlZiEuYm9vdHN0cmFwKTtcbiAgICB0aGlzLl9yM0luamVjdG9yID0gY3JlYXRlSW5qZWN0b3JXaXRob3V0SW5qZWN0b3JJbnN0YW5jZXMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBuZ01vZHVsZVR5cGUsIF9wYXJlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwcm92aWRlOiB2aWV3RW5naW5lX05nTW9kdWxlUmVmLCB1c2VWYWx1ZTogdGhpc30sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiB2aWV3RW5naW5lX0NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VWYWx1ZTogdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ2lmeShuZ01vZHVsZVR5cGUpKSBhcyBSM0luamVjdG9yO1xuXG4gICAgLy8gV2UgbmVlZCB0byByZXNvbHZlIHRoZSBpbmplY3RvciB0eXBlcyBzZXBhcmF0ZWx5IGZyb20gdGhlIGluamVjdG9yIGNyZWF0aW9uLCBiZWNhdXNlXG4gICAgLy8gdGhlIG1vZHVsZSBtaWdodCBiZSB0cnlpbmcgdG8gdXNlIHRoaXMgcmVmIGluIGl0cyBjb250cnVjdG9yIGZvciBESSB3aGljaCB3aWxsIGNhdXNlIGFcbiAgICAvLyBjaXJjdWxhciBlcnJvciB0aGF0IHdpbGwgZXZlbnR1YWxseSBlcnJvciBvdXQsIGJlY2F1c2UgdGhlIGluamVjdG9yIGlzbid0IGNyZWF0ZWQgeWV0LlxuICAgIHRoaXMuX3IzSW5qZWN0b3IuX3Jlc29sdmVJbmplY3RvckRlZlR5cGVzKCk7XG4gICAgdGhpcy5pbnN0YW5jZSA9IHRoaXMuZ2V0KG5nTW9kdWxlVHlwZSk7XG4gIH1cblxuICBnZXQodG9rZW46IGFueSwgbm90Rm91bmRWYWx1ZTogYW55ID0gSW5qZWN0b3IuVEhST1dfSUZfTk9UX0ZPVU5ELFxuICAgICAgaW5qZWN0RmxhZ3M6IEluamVjdEZsYWdzID0gSW5qZWN0RmxhZ3MuRGVmYXVsdCk6IGFueSB7XG4gICAgaWYgKHRva2VuID09PSBJbmplY3RvciB8fCB0b2tlbiA9PT0gdmlld0VuZ2luZV9OZ01vZHVsZVJlZiB8fCB0b2tlbiA9PT0gSU5KRUNUT1IpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcjNJbmplY3Rvci5nZXQodG9rZW4sIG5vdEZvdW5kVmFsdWUsIGluamVjdEZsYWdzKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQodGhpcy5kZXN0cm95Q2JzLCAnTmdNb2R1bGUgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICBjb25zdCBpbmplY3RvciA9IHRoaXMuX3IzSW5qZWN0b3I7XG4gICAgIWluamVjdG9yLmRlc3Ryb3llZCAmJiBpbmplY3Rvci5kZXN0cm95KCk7XG4gICAgdGhpcy5kZXN0cm95Q2JzIS5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICAgIHRoaXMuZGVzdHJveUNicyA9IG51bGw7XG4gIH1cbiAgb3ZlcnJpZGUgb25EZXN0cm95KGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQodGhpcy5kZXN0cm95Q2JzLCAnTmdNb2R1bGUgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICB0aGlzLmRlc3Ryb3lDYnMhLnB1c2goY2FsbGJhY2spO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOZ01vZHVsZUZhY3Rvcnk8VD4gZXh0ZW5kcyB2aWV3RW5naW5lX05nTW9kdWxlRmFjdG9yeTxUPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtb2R1bGVUeXBlOiBUeXBlPFQ+KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IG5nTW9kdWxlRGVmID0gZ2V0TmdNb2R1bGVEZWYobW9kdWxlVHlwZSk7XG4gICAgaWYgKG5nTW9kdWxlRGVmICE9PSBudWxsKSB7XG4gICAgICAvLyBSZWdpc3RlciB0aGUgTmdNb2R1bGUgd2l0aCBBbmd1bGFyJ3MgbW9kdWxlIHJlZ2lzdHJ5LiBUaGUgbG9jYXRpb24gKGFuZCBoZW5jZSB0aW1pbmcpIG9mXG4gICAgICAvLyB0aGlzIGNhbGwgaXMgY3JpdGljYWwgdG8gZW5zdXJlIHRoaXMgd29ya3MgY29ycmVjdGx5IChtb2R1bGVzIGdldCByZWdpc3RlcmVkIHdoZW4gZXhwZWN0ZWQpXG4gICAgICAvLyB3aXRob3V0IGJsb2F0aW5nIGJ1bmRsZXMgKG1vZHVsZXMgYXJlIHJlZ2lzdGVyZWQgd2hlbiBvdGhlcndpc2Ugbm90IHJlZmVyZW5jZWQpLlxuICAgICAgLy9cbiAgICAgIC8vIEluIFZpZXcgRW5naW5lLCByZWdpc3RyYXRpb24gb2NjdXJzIGluIHRoZSAubmdmYWN0b3J5LmpzIGZpbGUgYXMgYSBzaWRlIGVmZmVjdC4gVGhpcyBoYXNcbiAgICAgIC8vIHNldmVyYWwgcHJhY3RpY2FsIGNvbnNlcXVlbmNlczpcbiAgICAgIC8vXG4gICAgICAvLyAtIElmIGFuIC5uZ2ZhY3RvcnkgZmlsZSBpcyBub3QgaW1wb3J0ZWQgZnJvbSwgdGhlIG1vZHVsZSB3b24ndCBiZSByZWdpc3RlcmVkIChhbmQgY2FuIGJlXG4gICAgICAvLyAgIHRyZWUgc2hha2VuKS5cbiAgICAgIC8vIC0gSWYgYW4gLm5nZmFjdG9yeSBmaWxlIGlzIGltcG9ydGVkIGZyb20sIHRoZSBtb2R1bGUgd2lsbCBiZSByZWdpc3RlcmVkIGV2ZW4gaWYgYW4gaW5zdGFuY2VcbiAgICAgIC8vICAgaXMgbm90IGFjdHVhbGx5IGNyZWF0ZWQgKHZpYSBgY3JlYXRlYCBiZWxvdykuXG4gICAgICAvLyAtIFNpbmNlIGFuIC5uZ2ZhY3RvcnkgZmlsZSBpbiBWaWV3IEVuZ2luZSByZWZlcmVuY2VzIHRoZSAubmdmYWN0b3J5IGZpbGVzIG9mIHRoZSBOZ01vZHVsZSdzXG4gICAgICAvLyAgIGltcG9ydHMsXG4gICAgICAvL1xuICAgICAgLy8gSW4gSXZ5LCB0aGluZ3MgYXJlIGEgYml0IGRpZmZlcmVudC4gLm5nZmFjdG9yeSBmaWxlcyBzdGlsbCBleGlzdCBmb3IgY29tcGF0aWJpbGl0eSwgYnV0IGFyZVxuICAgICAgLy8gbm90IGEgcmVxdWlyZWQgQVBJIHRvIHVzZSAtIHRoZXJlIGFyZSBvdGhlciB3YXlzIHRvIG9idGFpbiBhbiBOZ01vZHVsZUZhY3RvcnkgZm9yIGEgZ2l2ZW5cbiAgICAgIC8vIE5nTW9kdWxlLiBUaHVzLCByZWx5aW5nIG9uIGEgc2lkZSBlZmZlY3QgaW4gdGhlIC5uZ2ZhY3RvcnkgZmlsZSBpcyBub3Qgc3VmZmljaWVudC4gSW5zdGVhZCxcbiAgICAgIC8vIHRoZSBzaWRlIGVmZmVjdCBvZiByZWdpc3RyYXRpb24gaXMgYWRkZWQgaGVyZSwgaW4gdGhlIGNvbnN0cnVjdG9yIG9mIE5nTW9kdWxlRmFjdG9yeSxcbiAgICAgIC8vIGVuc3VyaW5nIG5vIG1hdHRlciBob3cgYSBmYWN0b3J5IGlzIGNyZWF0ZWQsIHRoZSBtb2R1bGUgaXMgcmVnaXN0ZXJlZCBjb3JyZWN0bHkuXG4gICAgICAvL1xuICAgICAgLy8gQW4gYWx0ZXJuYXRpdmUgd291bGQgYmUgdG8gaW5jbHVkZSB0aGUgcmVnaXN0cmF0aW9uIHNpZGUgZWZmZWN0IGlubGluZSBmb2xsb3dpbmcgdGhlIGFjdHVhbFxuICAgICAgLy8gTmdNb2R1bGUgZGVmaW5pdGlvbi4gVGhpcyBhbHNvIGhhcyB0aGUgY29ycmVjdCB0aW1pbmcsIGJ1dCBicmVha3MgdHJlZS1zaGFraW5nIC0gbW9kdWxlc1xuICAgICAgLy8gd2lsbCBiZSByZWdpc3RlcmVkIGFuZCByZXRhaW5lZCBldmVuIGlmIHRoZXkncmUgb3RoZXJ3aXNlIG5ldmVyIHJlZmVyZW5jZWQuXG4gICAgICByZWdpc3Rlck5nTW9kdWxlVHlwZShtb2R1bGVUeXBlIGFzIE5nTW9kdWxlVHlwZSk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgY3JlYXRlKHBhcmVudEluamVjdG9yOiBJbmplY3RvcnxudWxsKTogdmlld0VuZ2luZV9OZ01vZHVsZVJlZjxUPiB7XG4gICAgcmV0dXJuIG5ldyBOZ01vZHVsZVJlZih0aGlzLm1vZHVsZVR5cGUsIHBhcmVudEluamVjdG9yKTtcbiAgfVxufVxuIl19