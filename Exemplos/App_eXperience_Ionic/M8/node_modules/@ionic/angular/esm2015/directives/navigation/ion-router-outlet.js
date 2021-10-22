import * as tslib_1 from "tslib";
import { Location } from '@angular/common';
import { Attribute, ComponentFactoryResolver, ComponentRef, Directive, ElementRef, EventEmitter, Injector, NgZone, OnDestroy, OnInit, Optional, Output, SkipSelf, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts, OutletContext, PRIMARY_OUTLET, Router } from '@angular/router';
import { componentOnReady } from '@ionic/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Config } from '../../providers/config';
import { NavController } from '../../providers/nav-controller';
import { StackController } from './stack-controller';
import { getUrl } from './stack-utils';
let IonRouterOutlet = class IonRouterOutlet {
    constructor(parentContexts, location, resolver, name, tabs, config, navCtrl, commonLocation, elementRef, router, zone, activatedRoute, parentOutlet) {
        this.parentContexts = parentContexts;
        this.location = location;
        this.resolver = resolver;
        this.config = config;
        this.navCtrl = navCtrl;
        this.parentOutlet = parentOutlet;
        this.activated = null;
        this.activatedView = null;
        this._activatedRoute = null;
        // Maintain map of activated route proxies for each component instance
        this.proxyMap = new WeakMap();
        // Keep the latest activated route in a subject for the proxy routes to switch map to
        this.currentActivatedRoute$ = new BehaviorSubject(null);
        this.stackEvents = new EventEmitter();
        this.activateEvents = new EventEmitter();
        this.deactivateEvents = new EventEmitter();
        this.nativeEl = elementRef.nativeElement;
        this.name = name || PRIMARY_OUTLET;
        this.tabsPrefix = tabs === 'true' ? getUrl(router, activatedRoute) : undefined;
        this.stackCtrl = new StackController(this.tabsPrefix, this.nativeEl, router, navCtrl, zone, commonLocation);
        parentContexts.onChildOutletCreated(this.name, this);
    }
    set animation(animation) {
        this.nativeEl.animation = animation;
    }
    set animated(animated) {
        this.nativeEl.animated = animated;
    }
    set swipeGesture(swipe) {
        this._swipeGesture = swipe;
        this.nativeEl.swipeHandler = swipe ? {
            canStart: () => this.stackCtrl.canGoBack(1) && !this.stackCtrl.hasRunningTask(),
            onStart: () => this.stackCtrl.startBackTransition(),
            onEnd: shouldContinue => this.stackCtrl.endBackTransition(shouldContinue)
        } : undefined;
    }
    ngOnDestroy() {
        this.stackCtrl.destroy();
    }
    getContext() {
        return this.parentContexts.getContext(this.name);
    }
    ngOnInit() {
        if (!this.activated) {
            // If the outlet was not instantiated at the time the route got activated we need to populate
            // the outlet when it is initialized (ie inside a NgIf)
            const context = this.getContext();
            if (context && context.route) {
                this.activateWith(context.route, context.resolver || null);
            }
        }
        new Promise(resolve => componentOnReady(this.nativeEl, resolve)).then(() => {
            if (this._swipeGesture === undefined) {
                this.swipeGesture = this.config.getBoolean('swipeBackEnabled', this.nativeEl.mode === 'ios');
            }
        });
    }
    get isActivated() {
        return !!this.activated;
    }
    get component() {
        if (!this.activated) {
            throw new Error('Outlet is not activated');
        }
        return this.activated.instance;
    }
    get activatedRoute() {
        if (!this.activated) {
            throw new Error('Outlet is not activated');
        }
        return this._activatedRoute;
    }
    get activatedRouteData() {
        if (this._activatedRoute) {
            return this._activatedRoute.snapshot.data;
        }
        return {};
    }
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    detach() {
        throw new Error('incompatible reuse strategy');
    }
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    attach(_ref, _activatedRoute) {
        throw new Error('incompatible reuse strategy');
    }
    deactivate() {
        if (this.activated) {
            if (this.activatedView) {
                const context = this.getContext();
                this.activatedView.savedData = new Map(context.children['contexts']);
                /**
                 * Angular v11.2.10 introduced a change
                 * where this route context is cleared out when
                 * a router-outlet is deactivated, However,
                 * we need this route information in order to
                 * return a user back to the correct tab when
                 * leaving and then going back to the tab context.
                 */
                const primaryOutlet = this.activatedView.savedData.get('primary');
                if (primaryOutlet && context.route) {
                    primaryOutlet.route = Object.assign({}, context.route);
                }
                /**
                 * Ensure we are saving the NavigationExtras
                 * data otherwise it will be lost
                 */
                this.activatedView.savedExtras = {};
                if (context.route) {
                    const contextSnapshot = context.route.snapshot;
                    this.activatedView.savedExtras.queryParams = contextSnapshot.queryParams;
                    this.activatedView.savedExtras.fragment = contextSnapshot.fragment;
                }
            }
            const c = this.component;
            this.activatedView = null;
            this.activated = null;
            this._activatedRoute = null;
            this.deactivateEvents.emit(c);
        }
    }
    activateWith(activatedRoute, resolver) {
        if (this.isActivated) {
            throw new Error('Cannot activate an already activated outlet');
        }
        this._activatedRoute = activatedRoute;
        let cmpRef;
        let enteringView = this.stackCtrl.getExistingView(activatedRoute);
        if (enteringView) {
            cmpRef = this.activated = enteringView.ref;
            const saved = enteringView.savedData;
            if (saved) {
                // self-restore
                const context = this.getContext();
                context.children['contexts'] = saved;
            }
            // Updated activated route proxy for this component
            this.updateActivatedRouteProxy(cmpRef.instance, activatedRoute);
        }
        else {
            const snapshot = activatedRoute._futureSnapshot;
            const component = snapshot.routeConfig.component;
            resolver = resolver || this.resolver;
            const factory = resolver.resolveComponentFactory(component);
            const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
            // We create an activated route proxy object that will maintain future updates for this component
            // over its lifecycle in the stack.
            const component$ = new BehaviorSubject(null);
            const activatedRouteProxy = this.createActivatedRouteProxy(component$, activatedRoute);
            const injector = new OutletInjector(activatedRouteProxy, childContexts, this.location.injector);
            cmpRef = this.activated = this.location.createComponent(factory, this.location.length, injector);
            // Once the component is created we can push it to our local subject supplied to the proxy
            component$.next(cmpRef.instance);
            // Calling `markForCheck` to make sure we will run the change detection when the
            // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
            enteringView = this.stackCtrl.createView(this.activated, activatedRoute);
            // Store references to the proxy by component
            this.proxyMap.set(cmpRef.instance, activatedRouteProxy);
            this.currentActivatedRoute$.next({ component: cmpRef.instance, activatedRoute });
        }
        this.activatedView = enteringView;
        this.stackCtrl.setActive(enteringView).then(data => {
            this.navCtrl.setTopOutlet(this);
            this.activateEvents.emit(cmpRef.instance);
            this.stackEvents.emit(data);
        });
    }
    /**
     * Returns `true` if there are pages in the stack to go back.
     */
    canGoBack(deep = 1, stackId) {
        return this.stackCtrl.canGoBack(deep, stackId);
    }
    /**
     * Resolves to `true` if it the outlet was able to sucessfully pop the last N pages.
     */
    pop(deep = 1, stackId) {
        return this.stackCtrl.pop(deep, stackId);
    }
    /**
     * Returns the URL of the active page of each stack.
     */
    getLastUrl(stackId) {
        const active = this.stackCtrl.getLastUrl(stackId);
        return active ? active.url : undefined;
    }
    /**
     * Returns the RouteView of the active page of each stack.
     * @internal
     */
    getLastRouteView(stackId) {
        return this.stackCtrl.getLastUrl(stackId);
    }
    /**
     * Returns the root view in the tab stack.
     * @internal
     */
    getRootView(stackId) {
        return this.stackCtrl.getRootUrl(stackId);
    }
    /**
     * Returns the active stack ID. In the context of ion-tabs, it means the active tab.
     */
    getActiveStackId() {
        return this.stackCtrl.getActiveStackId();
    }
    /**
     * Since the activated route can change over the life time of a component in an ion router outlet, we create
     * a proxy so that we can update the values over time as a user navigates back to components already in the stack.
     */
    createActivatedRouteProxy(component$, activatedRoute) {
        const proxy = new ActivatedRoute();
        proxy._futureSnapshot = activatedRoute._futureSnapshot;
        proxy._routerState = activatedRoute._routerState;
        proxy.snapshot = activatedRoute.snapshot;
        proxy.outlet = activatedRoute.outlet;
        proxy.component = activatedRoute.component;
        // Setup wrappers for the observables so consumers don't have to worry about switching to new observables as the state updates
        proxy._paramMap = this.proxyObservable(component$, 'paramMap');
        proxy._queryParamMap = this.proxyObservable(component$, 'queryParamMap');
        proxy.url = this.proxyObservable(component$, 'url');
        proxy.params = this.proxyObservable(component$, 'params');
        proxy.queryParams = this.proxyObservable(component$, 'queryParams');
        proxy.fragment = this.proxyObservable(component$, 'fragment');
        proxy.data = this.proxyObservable(component$, 'data');
        return proxy;
    }
    /**
     * Create a wrapped observable that will switch to the latest activated route matched by the given component
     */
    proxyObservable(component$, path) {
        return component$.pipe(
        // First wait until the component instance is pushed
        filter(component => !!component), switchMap(component => this.currentActivatedRoute$.pipe(filter(current => current !== null && current.component === component), switchMap(current => current && current.activatedRoute[path]), distinctUntilChanged())));
    }
    /**
     * Updates the activated route proxy for the given component to the new incoming router state
     */
    updateActivatedRouteProxy(component, activatedRoute) {
        const proxy = this.proxyMap.get(component);
        if (!proxy) {
            throw new Error(`Could not find activated route proxy for view`);
        }
        proxy._futureSnapshot = activatedRoute._futureSnapshot;
        proxy._routerState = activatedRoute._routerState;
        proxy.snapshot = activatedRoute.snapshot;
        proxy.outlet = activatedRoute.outlet;
        proxy.component = activatedRoute.component;
        this.currentActivatedRoute$.next({ component, activatedRoute });
    }
};
IonRouterOutlet.ctorParameters = () => [
    { type: ChildrenOutletContexts },
    { type: ViewContainerRef },
    { type: ComponentFactoryResolver },
    { type: String, decorators: [{ type: Attribute, args: ['name',] }] },
    { type: String, decorators: [{ type: Optional }, { type: Attribute, args: ['tabs',] }] },
    { type: Config },
    { type: NavController },
    { type: Location },
    { type: ElementRef },
    { type: Router },
    { type: NgZone },
    { type: ActivatedRoute },
    { type: IonRouterOutlet, decorators: [{ type: SkipSelf }, { type: Optional }] }
];
tslib_1.__decorate([
    Output()
], IonRouterOutlet.prototype, "stackEvents", void 0);
tslib_1.__decorate([
    Output('activate')
], IonRouterOutlet.prototype, "activateEvents", void 0);
tslib_1.__decorate([
    Output('deactivate')
], IonRouterOutlet.prototype, "deactivateEvents", void 0);
IonRouterOutlet = tslib_1.__decorate([
    Directive({
        selector: 'ion-router-outlet',
        exportAs: 'outlet',
        inputs: ['animated', 'animation', 'swipeGesture']
    }),
    tslib_1.__param(3, Attribute('name')),
    tslib_1.__param(4, Optional()), tslib_1.__param(4, Attribute('tabs')),
    tslib_1.__param(12, SkipSelf()), tslib_1.__param(12, Optional())
], IonRouterOutlet);
export { IonRouterOutlet };
class OutletInjector {
    constructor(route, childContexts, parent) {
        this.route = route;
        this.childContexts = childContexts;
        this.parent = parent;
    }
    get(token, notFoundValue) {
        if (token === ActivatedRoute) {
            return this.route;
        }
        if (token === ChildrenOutletContexts) {
            return this.childContexts;
        }
        // tslint:disable-next-line
        return this.parent.get(token, notFoundValue);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uLXJvdXRlci1vdXRsZXQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi9pb24tcm91dGVyLW91dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsd0JBQXdCLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxTSxPQUFPLEVBQUUsY0FBYyxFQUFFLHNCQUFzQixFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEgsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxlQUFlLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUd6RSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRS9ELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQWEsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBT2xELElBQWEsZUFBZSxHQUE1QixNQUFhLGVBQWU7SUF5QzFCLFlBQ1UsY0FBc0MsRUFDdEMsUUFBMEIsRUFDMUIsUUFBa0MsRUFDdkIsSUFBWSxFQUNBLElBQVksRUFDbkMsTUFBYyxFQUNkLE9BQXNCLEVB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QUFLLEtBQUssY0FBYyxFQUFFO1lBQzVCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNuQjtRQUVELElBQUksS0FBSyxLQUFLLHNCQUFzQixFQUFFO1lBQ3BDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztTQUMzQjtRQUVELDJCQUEyQjtRQUMzQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBdHRyaWJ1dGUsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgQ29tcG9uZW50UmVmLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5qZWN0b3IsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBPdXRwdXQsIFNraXBTZWxmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgQ2hpbGRyZW5PdXRsZXRDb250ZXh0cywgT3V0bGV0Q29udGV4dCwgUFJJTUFSWV9PVVRMRVQsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBjb21wb25lbnRPblJlYWR5IH0gZnJvbSAnQGlvbmljL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgZmlsdGVyLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEFuaW1hdGlvbkJ1aWxkZXIgfSBmcm9tICcuLi8uLi8nO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL2NvbmZpZyc7XG5pbXBvcnQgeyBOYXZDb250cm9sbGVyIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL25hdi1jb250cm9sbGVyJztcblxuaW1wb3J0IHsgU3RhY2tDb250cm9sbGVyIH0gZnJvbSAnLi9zdGFjay1jb250cm9sbGVyJztcbmltcG9ydCB7IFJvdXRlVmlldywgZ2V0VXJsIH0gZnJvbSAnLi9zdGFjay11dGlscyc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lvbi1yb3V0ZXItb3V0bGV0JyxcbiAgZXhwb3J0QXM6ICdvdXRsZXQnLFxuICBpbnB1dHM6IFsnYW5pbWF0ZWQnLCAnYW5pbWF0aW9uJywgJ3N3aXBlR2VzdHVyZSddXG59KVxuZXhwb3J0IGNsYXNzIElvblJvdXRlck91dGxldCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgbmF0aXZlRWw6IEhUTUxJb25Sb3V0ZXJPdXRsZXRFbGVtZW50O1xuXG4gIHByaXZhdGUgYWN0aXZhdGVkOiBDb21wb25lbnRSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuICBhY3RpdmF0ZWRWaWV3OiBSb3V0ZVZpZXcgfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIF9hY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfc3dpcGVHZXN0dXJlPzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBuYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgc3RhY2tDdHJsOiBTdGFja0NvbnRyb2xsZXI7XG5cbiAgLy8gTWFpbnRhaW4gbWFwIG9mIGFjdGl2YXRlZCByb3V0ZSBwcm94aWVzIGZvciBlYWNoIGNvbXBvbmVudCBpbnN0YW5jZVxuICBwcml2YXRlIHByb3h5TWFwID0gbmV3IFdlYWtNYXA8YW55LCBBY3RpdmF0ZWRSb3V0ZT4oKTtcblxuICAvLyBLZWVwIHRoZSBsYXRlc3QgYWN0aXZhdGVkIHJvdXRlIGluIGEgc3ViamVjdCBmb3IgdGhlIHByb3h5IHJvdXRlcyB0byBzd2l0Y2ggbWFwIHRvXG4gIHByaXZhdGUgY3VycmVudEFjdGl2YXRlZFJvdXRlJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8eyBjb21wb25lbnQ6IGFueTsgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlIH0gfCBudWxsPihudWxsKTtcblxuICB0YWJzUHJlZml4OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgQE91dHB1dCgpIHN0YWNrRXZlbnRzID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ2FjdGl2YXRlJykgYWN0aXZhdGVFdmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnZGVhY3RpdmF0ZScpIGRlYWN0aXZhdGVFdmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBzZXQgYW5pbWF0aW9uKGFuaW1hdGlvbjogQW5pbWF0aW9uQnVpbGRlcikge1xuICAgIHRoaXMubmF0aXZlRWwuYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xuICB9XG5cbiAgc2V0IGFuaW1hdGVkKGFuaW1hdGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5uYXRpdmVFbC5hbmltYXRlZCA9IGFuaW1hdGVkO1xuICB9XG5cbiAgc2V0IHN3aXBlR2VzdHVyZShzd2lwZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3N3aXBlR2VzdHVyZSA9IHN3aXBlO1xuXG4gICAgdGhpcy5uYXRpdmVFbC5zd2lwZUhhbmRsZXIgPSBzd2lwZSA/IHtcbiAgICAgIGNhblN0YXJ0OiAoKSA9PiB0aGlzLnN0YWNrQ3RybC5jYW5Hb0JhY2soMSkgJiYgIXRoaXMuc3RhY2tDdHJsLmhhc1J1bm5pbmdUYXNrKCksXG4gICAgICBvblN0YXJ0OiAoKSA9PiB0aGlzLnN0YWNrQ3RybC5zdGFydEJhY2tUcmFuc2l0aW9uKCksXG4gICAgICBvbkVuZDogc2hvdWxkQ29udGludWUgPT4gdGhpcy5zdGFja0N0cmwuZW5kQmFja1RyYW5zaXRpb24oc2hvdWxkQ29udGludWUpXG4gICAgfSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGFyZW50Q29udGV4dHM6IENoaWxkcmVuT3V0bGV0Q29udGV4dHMsXG4gICAgcHJpdmF0ZSBsb2NhdGlvbjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgQEF0dHJpYnV0ZSgnbmFtZScpIG5hbWU6IHN0cmluZyxcbiAgICBAT3B0aW9uYWwoKSBAQXR0cmlidXRlKCd0YWJzJykgdGFiczogc3RyaW5nLFxuICAgIHByaXZhdGUgY29uZmlnOiBDb25maWcsXG4gICAgcHJpdmF0ZSBuYXZDdHJsOiBOYXZDb250cm9sbGVyLFxuICAgIGNvbW1vbkxvY2F0aW9uOiBMb2NhdGlvbixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHJvdXRlcjogUm91dGVyLFxuICAgIHpvbmU6IE5nWm9uZSxcbiAgICBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgQFNraXBTZWxmKCkgQE9wdGlvbmFsKCkgcmVhZG9ubHkgcGFyZW50T3V0bGV0PzogSW9uUm91dGVyT3V0bGV0XG4gICkge1xuICAgIHRoaXMubmF0aXZlRWwgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5uYW1lID0gbmFtZSB8fCBQUklNQVJZX09VVExFVDtcbiAgICB0aGlzLnRhYnNQcmVmaXggPSB0YWJzID09PSAndHJ1ZScgPyBnZXRVcmwocm91dGVyLCBhY3RpdmF0ZWRSb3V0ZSkgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5zdGFja0N0cmwgPSBuZXcgU3RhY2tDb250cm9sbGVyKHRoaXMudGFic1ByZWZpeCwgdGhpcy5uYXRpdmVFbCwgcm91dGVyLCBuYXZDdHJsLCB6b25lLCBjb21tb25Mb2NhdGlvbik7XG4gICAgcGFyZW50Q29udGV4dHMub25DaGlsZE91dGxldENyZWF0ZWQodGhpcy5uYW1lLCB0aGlzIGFzIGFueSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN0YWNrQ3RybC5kZXN0cm95KCk7XG4gIH1cblxuICBnZXRDb250ZXh0KCk6IE91dGxldENvbnRleHQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnRDb250ZXh0cy5nZXRDb250ZXh0KHRoaXMubmFtZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZhdGVkKSB7XG4gICAgICAvLyBJZiB0aGUgb3V0bGV0IHdhcyBub3QgaW5zdGFudGlhdGVkIGF0IHRoZSB0aW1lIHRoZSByb3V0ZSBnb3QgYWN0aXZhdGVkIHdlIG5lZWQgdG8gcG9wdWxhdGVcbiAgICAgIC8vIHRoZSBvdXRsZXQgd2hlbiBpdCBpcyBpbml0aWFsaXplZCAoaWUgaW5zaWRlIGEgTmdJZilcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmdldENvbnRleHQoKTtcbiAgICAgIGlmIChjb250ZXh0ICYmIGNvbnRleHQucm91dGUpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZVdpdGgoY29udGV4dC5yb3V0ZSwgY29udGV4dC5yZXNvbHZlciB8fCBudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuZXcgUHJvbWlzZShyZXNvbHZlID0+IGNvbXBvbmVudE9uUmVhZHkodGhpcy5uYXRpdmVFbCwgcmVzb2x2ZSkpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3N3aXBlR2VzdHVyZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuc3dpcGVHZXN0dXJlID0gdGhpcy5jb25maWcuZ2V0Qm9vbGVhbignc3dpcGVCYWNrRW5hYmxlZCcsICh0aGlzLm5hdGl2ZUVsIGFzIGFueSkubW9kZSA9PT0gJ2lvcycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGlzQWN0aXZhdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuYWN0aXZhdGVkO1xuICB9XG5cbiAgZ2V0IGNvbXBvbmVudCgpOiBvYmplY3Qge1xuICAgIGlmICghdGhpcy5hY3RpdmF0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT3V0bGV0IGlzIG5vdCBhY3RpdmF0ZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZhdGVkLmluc3RhbmNlO1xuICB9XG5cbiAgZ2V0IGFjdGl2YXRlZFJvdXRlKCk6IEFjdGl2YXRlZFJvdXRlIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZhdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ091dGxldCBpcyBub3QgYWN0aXZhdGVkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hY3RpdmF0ZWRSb3V0ZSBhcyBBY3RpdmF0ZWRSb3V0ZTtcbiAgfVxuXG4gIGdldCBhY3RpdmF0ZWRSb3V0ZURhdGEoKTogYW55IHtcbiAgICBpZiAodGhpcy5fYWN0aXZhdGVkUm91dGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hY3RpdmF0ZWRSb3V0ZS5zbmFwc2hvdC5kYXRhO1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGBSb3V0ZVJldXNlU3RyYXRlZ3lgIGluc3RydWN0cyB0byBkZXRhY2ggdGhlIHN1YnRyZWVcbiAgICovXG4gIGRldGFjaCgpOiBDb21wb25lbnRSZWY8YW55PiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbmNvbXBhdGlibGUgcmV1c2Ugc3RyYXRlZ3knKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgYFJvdXRlUmV1c2VTdHJhdGVneWAgaW5zdHJ1Y3RzIHRvIHJlLWF0dGFjaCBhIHByZXZpb3VzbHkgZGV0YWNoZWQgc3VidHJlZVxuICAgKi9cbiAgYXR0YWNoKF9yZWY6IENvbXBvbmVudFJlZjxhbnk+LCBfYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbmNvbXBhdGlibGUgcmV1c2Ugc3RyYXRlZ3knKTtcbiAgfVxuXG4gIGRlYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZhdGVkKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmF0ZWRWaWV3KSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmdldENvbnRleHQoKSE7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVkVmlldy5zYXZlZERhdGEgPSBuZXcgTWFwKGNvbnRleHQuY2hpbGRyZW5bJ2NvbnRleHRzJ10pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbmd1bGFyIHYxMS4yLjEwIGludHJvZHVjZWQgYSBjaGFuZ2VcbiAgICAgICAgICogd2hlcmUgdGhpcyByb3V0ZSBjb250ZXh0IGlzIGNsZWFyZWQgb3V0IHdoZW5cbiAgICAgICAgICogYSByb3V0ZXItb3V0bGV0IGlzIGRlYWN0aXZhdGVkLCBIb3dldmVyLFxuICAgICAgICAgKiB3ZSBuZWVkIHRoaXMgcm91dGUgaW5mb3JtYXRpb24gaW4gb3JkZXIgdG9cbiAgICAgICAgICogcmV0dXJuIGEgdXNlciBiYWNrIHRvIHRoZSBjb3JyZWN0IHRhYiB3aGVuXG4gICAgICAgICAqIGxlYXZpbmcgYW5kIHRoZW4gZ29pbmcgYmFjayB0byB0aGUgdGFiIGNvbnRleHQuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBwcmltYXJ5T3V0bGV0ID0gdGhpcy5hY3RpdmF0ZWRWaWV3LnNhdmVkRGF0YS5nZXQoJ3ByaW1hcnknKTtcbiAgICAgICAgaWYgKHByaW1hcnlPdXRsZXQgJiYgY29udGV4dC5yb3V0ZSkge1xuICAgICAgICAgIHByaW1hcnlPdXRsZXQucm91dGUgPSB7IC4uLmNvbnRleHQucm91dGUgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbnN1cmUgd2UgYXJlIHNhdmluZyB0aGUgTmF2aWdhdGlvbkV4dHJhc1xuICAgICAgICAgKiBkYXRhIG90aGVyd2lzZSBpdCB3aWxsIGJlIGxvc3RcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYWN0aXZhdGVkVmlldy5zYXZlZEV4dHJhcyA9IHt9O1xuICAgICAgICBpZiAoY29udGV4dC5yb3V0ZSkge1xuICAgICAgICAgIGNvbnN0IGNvbnRleHRTbmFwc2hvdCA9IGNvbnRleHQucm91dGUuc25hcHNob3Q7XG5cbiAgICAgICAgICB0aGlzLmFjdGl2YXRlZFZpZXcuc2F2ZWRFeHRyYXMucXVlcnlQYXJhbXMgPSBjb250ZXh0U25hcHNob3QucXVlcnlQYXJhbXM7XG4gICAgICAgICAgdGhpcy5hY3RpdmF0ZWRWaWV3LnNhdmVkRXh0cmFzLmZyYWdtZW50ID0gY29udGV4dFNuYXBzaG90LmZyYWdtZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBjID0gdGhpcy5jb21wb25lbnQ7XG4gICAgICB0aGlzLmFjdGl2YXRlZFZpZXcgPSBudWxsO1xuICAgICAgdGhpcy5hY3RpdmF0ZWQgPSBudWxsO1xuICAgICAgdGhpcy5fYWN0aXZhdGVkUm91dGUgPSBudWxsO1xuICAgICAgdGhpcy5kZWFjdGl2YXRlRXZlbnRzLmVtaXQoYyk7XG4gICAgfVxuICB9XG5cbiAgYWN0aXZhdGVXaXRoKGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5pc0FjdGl2YXRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWN0aXZhdGUgYW4gYWxyZWFkeSBhY3RpdmF0ZWQgb3V0bGV0Jyk7XG4gICAgfVxuICAgIHRoaXMuX2FjdGl2YXRlZFJvdXRlID0gYWN0aXZhdGVkUm91dGU7XG5cbiAgICBsZXQgY21wUmVmOiBhbnk7XG4gICAgbGV0IGVudGVyaW5nVmlldyA9IHRoaXMuc3RhY2tDdHJsLmdldEV4aXN0aW5nVmlldyhhY3RpdmF0ZWRSb3V0ZSk7XG4gICAgaWYgKGVudGVyaW5nVmlldykge1xuICAgICAgY21wUmVmID0gdGhpcy5hY3RpdmF0ZWQgPSBlbnRlcmluZ1ZpZXcucmVmO1xuICAgICAgY29uc3Qgc2F2ZWQgPSBlbnRlcmluZ1ZpZXcuc2F2ZWREYXRhO1xuICAgICAgaWYgKHNhdmVkKSB7XG4gICAgICAgIC8vIHNlbGYtcmVzdG9yZVxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5nZXRDb250ZXh0KCkhO1xuICAgICAgICBjb250ZXh0LmNoaWxkcmVuWydjb250ZXh0cyddID0gc2F2ZWQ7XG4gICAgICB9XG4gICAgICAvLyBVcGRhdGVkIGFjdGl2YXRlZCByb3V0ZSBwcm94eSBmb3IgdGhpcyBjb21wb25lbnRcbiAgICAgIHRoaXMudXBkYXRlQWN0aXZhdGVkUm91dGVQcm94eShjbXBSZWYuaW5zdGFuY2UsIGFjdGl2YXRlZFJvdXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc25hcHNob3QgPSAoYWN0aXZhdGVkUm91dGUgYXMgYW55KS5fZnV0dXJlU25hcHNob3Q7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBzbmFwc2hvdC5yb3V0ZUNvbmZpZyEuY29tcG9uZW50IGFzIGFueTtcbiAgICAgIHJlc29sdmVyID0gcmVzb2x2ZXIgfHwgdGhpcy5yZXNvbHZlcjtcblxuICAgICAgY29uc3QgZmFjdG9yeSA9IHJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KGNvbXBvbmVudCk7XG4gICAgICBjb25zdCBjaGlsZENvbnRleHRzID0gdGhpcy5wYXJlbnRDb250ZXh0cy5nZXRPckNyZWF0ZUNvbnRleHQodGhpcy5uYW1lKS5jaGlsZHJlbjtcblxuICAgICAgLy8gV2UgY3JlYXRlIGFuIGFjdGl2YXRlZCByb3V0ZSBwcm94eSBvYmplY3QgdGhhdCB3aWxsIG1haW50YWluIGZ1dHVyZSB1cGRhdGVzIGZvciB0aGlzIGNvbXBvbmVudFxuICAgICAgLy8gb3ZlciBpdHMgbGlmZWN5Y2xlIGluIHRoZSBzdGFjay5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4obnVsbCk7XG4gICAgICBjb25zdCBhY3RpdmF0ZWRSb3V0ZVByb3h5ID0gdGhpcy5jcmVhdGVBY3RpdmF0ZWRSb3V0ZVByb3h5KGNvbXBvbmVudCQsIGFjdGl2YXRlZFJvdXRlKTtcblxuICAgICAgY29uc3QgaW5qZWN0b3IgPSBuZXcgT3V0bGV0SW5qZWN0b3IoYWN0aXZhdGVkUm91dGVQcm94eSwgY2hpbGRDb250ZXh0cywgdGhpcy5sb2NhdGlvbi5pbmplY3Rvcik7XG4gICAgICBjbXBSZWYgPSB0aGlzLmFjdGl2YXRlZCA9IHRoaXMubG9jYXRpb24uY3JlYXRlQ29tcG9uZW50KGZhY3RvcnksIHRoaXMubG9jYXRpb24ubGVuZ3RoLCBpbmplY3Rvcik7XG5cbiAgICAgIC8vIE9uY2UgdGhlIGNvbXBvbmVudCBpcyBjcmVhdGVkIHdlIGNhbiBwdXNoIGl0IHRvIG91ciBsb2NhbCBzdWJqZWN0IHN1cHBsaWVkIHRvIHRoZSBwcm94eVxuICAgICAgY29tcG9uZW50JC5uZXh0KGNtcFJlZi5pbnN0YW5jZSk7XG5cbiAgICAgIC8vIENhbGxpbmcgYG1hcmtGb3JDaGVja2AgdG8gbWFrZSBzdXJlIHdlIHdpbGwgcnVuIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIHdoZW4gdGhlXG4gICAgICAvLyBgUm91dGVyT3V0bGV0YCBpcyBpbnNpZGUgYSBgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoYCBjb21wb25lbnQuXG4gICAgICBlbnRlcmluZ1ZpZXcgPSB0aGlzLnN0YWNrQ3RybC5jcmVhdGVWaWV3KHRoaXMuYWN0aXZhdGVkLCBhY3RpdmF0ZWRSb3V0ZSk7XG5cbiAgICAgIC8vIFN0b3JlIHJlZmVyZW5jZXMgdG8gdGhlIHByb3h5IGJ5IGNvbXBvbmVudFxuICAgICAgdGhpcy5wcm94eU1hcC5zZXQoY21wUmVmLmluc3RhbmNlLCBhY3RpdmF0ZWRSb3V0ZVByb3h5KTtcbiAgICAgIHRoaXMuY3VycmVudEFjdGl2YXRlZFJvdXRlJC5uZXh0KHsgY29tcG9uZW50OiBjbXBSZWYuaW5zdGFuY2UsIGFjdGl2YXRlZFJvdXRlIH0pO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aXZhdGVkVmlldyA9IGVudGVyaW5nVmlldztcbiAgICB0aGlzLnN0YWNrQ3RybC5zZXRBY3RpdmUoZW50ZXJpbmdWaWV3KS50aGVuKGRhdGEgPT4ge1xuICAgICAgdGhpcy5uYXZDdHJsLnNldFRvcE91dGxldCh0aGlzKTtcbiAgICAgIHRoaXMuYWN0aXZhdGVFdmVudHMuZW1pdChjbXBSZWYuaW5zdGFuY2UpO1xuICAgICAgdGhpcy5zdGFja0V2ZW50cy5lbWl0KGRhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoZXJlIGFyZSBwYWdlcyBpbiB0aGUgc3RhY2sgdG8gZ28gYmFjay5cbiAgICovXG4gIGNhbkdvQmFjayhkZWVwID0gMSwgc3RhY2tJZD86IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YWNrQ3RybC5jYW5Hb0JhY2soZGVlcCwgc3RhY2tJZCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZXMgdG8gYHRydWVgIGlmIGl0IHRoZSBvdXRsZXQgd2FzIGFibGUgdG8gc3VjZXNzZnVsbHkgcG9wIHRoZSBsYXN0IE4gcGFnZXMuXG4gICAqL1xuICBwb3AoZGVlcCA9IDEsIHN0YWNrSWQ/OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5zdGFja0N0cmwucG9wKGRlZXAsIHN0YWNrSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIFVSTCBvZiB0aGUgYWN0aXZlIHBhZ2Ugb2YgZWFjaCBzdGFjay5cbiAgICovXG4gIGdldExhc3RVcmwoc3RhY2tJZD86IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy5zdGFja0N0cmwuZ2V0TGFzdFVybChzdGFja0lkKTtcbiAgICByZXR1cm4gYWN0aXZlID8gYWN0aXZlLnVybCA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBSb3V0ZVZpZXcgb2YgdGhlIGFjdGl2ZSBwYWdlIG9mIGVhY2ggc3RhY2suXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZ2V0TGFzdFJvdXRlVmlldyhzdGFja0lkPzogc3RyaW5nKTogUm91dGVWaWV3IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5zdGFja0N0cmwuZ2V0TGFzdFVybChzdGFja0lkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByb290IHZpZXcgaW4gdGhlIHRhYiBzdGFjay5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBnZXRSb290VmlldyhzdGFja0lkPzogc3RyaW5nKTogUm91dGVWaWV3IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5zdGFja0N0cmwuZ2V0Um9vdFVybChzdGFja0lkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhY3RpdmUgc3RhY2sgSUQuIEluIHRoZSBjb250ZXh0IG9mIGlvbi10YWJzLCBpdCBtZWFucyB0aGUgYWN0aXZlIHRhYi5cbiAgICovXG4gIGdldEFjdGl2ZVN0YWNrSWQoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5zdGFja0N0cmwuZ2V0QWN0aXZlU3RhY2tJZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNpbmNlIHRoZSBhY3RpdmF0ZWQgcm91dGUgY2FuIGNoYW5nZSBvdmVyIHRoZSBsaWZlIHRpbWUgb2YgYSBjb21wb25lbnQgaW4gYW4gaW9uIHJvdXRlciBvdXRsZXQsIHdlIGNyZWF0ZVxuICAgKiBhIHByb3h5IHNvIHRoYXQgd2UgY2FuIHVwZGF0ZSB0aGUgdmFsdWVzIG92ZXIgdGltZSBhcyBhIHVzZXIgbmF2aWdhdGVzIGJhY2sgdG8gY29tcG9uZW50cyBhbHJlYWR5IGluIHRoZSBzdGFjay5cbiAgICovXG4gIHByaXZhdGUgY3JlYXRlQWN0aXZhdGVkUm91dGVQcm94eShjb21wb25lbnQkOiBPYnNlcnZhYmxlPGFueT4sIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSk6IEFjdGl2YXRlZFJvdXRlIHtcbiAgICBjb25zdCBwcm94eTogYW55ID0gbmV3IEFjdGl2YXRlZFJvdXRlKCk7XG5cbiAgICBwcm94eS5fZnV0dXJlU25hcHNob3QgPSAoYWN0aXZhdGVkUm91dGUgYXMgYW55KS5fZnV0dXJlU25hcHNob3Q7XG4gICAgcHJveHkuX3JvdXRlclN0YXRlID0gKGFjdGl2YXRlZFJvdXRlIGFzIGFueSkuX3JvdXRlclN0YXRlO1xuICAgIHByb3h5LnNuYXBzaG90ID0gYWN0aXZhdGVkUm91dGUuc25hcHNob3Q7XG4gICAgcHJveHkub3V0bGV0ID0gYWN0aXZhdGVkUm91dGUub3V0bGV0O1xuICAgIHByb3h5LmNvbXBvbmVudCA9IGFjdGl2YXRlZFJvdXRlLmNvbXBvbmVudDtcblxuICAgIC8vIFNldHVwIHdyYXBwZXJzIGZvciB0aGUgb2JzZXJ2YWJsZXMgc28gY29uc3VtZXJzIGRvbid0IGhhdmUgdG8gd29ycnkgYWJvdXQgc3dpdGNoaW5nIHRvIG5ldyBvYnNlcnZhYmxlcyBhcyB0aGUgc3RhdGUgdXBkYXRlc1xuICAgIChwcm94eSBhcyBhbnkpLl9wYXJhbU1hcCA9IHRoaXMucHJveHlPYnNlcnZhYmxlKGNvbXBvbmVudCQsICdwYXJhbU1hcCcpO1xuICAgIChwcm94eSBhcyBhbnkpLl9xdWVyeVBhcmFtTWFwID0gdGhpcy5wcm94eU9ic2VydmFibGUoY29tcG9uZW50JCwgJ3F1ZXJ5UGFyYW1NYXAnKTtcbiAgICBwcm94eS51cmwgPSB0aGlzLnByb3h5T2JzZXJ2YWJsZShjb21wb25lbnQkLCAndXJsJyk7XG4gICAgcHJveHkucGFyYW1zID0gdGhpcy5wcm94eU9ic2VydmFibGUoY29tcG9uZW50JCwgJ3BhcmFtcycpO1xuICAgIHByb3h5LnF1ZXJ5UGFyYW1zID0gdGhpcy5wcm94eU9ic2VydmFibGUoY29tcG9uZW50JCwgJ3F1ZXJ5UGFyYW1zJyk7XG4gICAgcHJveHkuZnJhZ21lbnQgPSB0aGlzLnByb3h5T2JzZXJ2YWJsZShjb21wb25lbnQkLCAnZnJhZ21lbnQnKTtcbiAgICBwcm94eS5kYXRhID0gdGhpcy5wcm94eU9ic2VydmFibGUoY29tcG9uZW50JCwgJ2RhdGEnKTtcblxuICAgIHJldHVybiBwcm94eSBhcyBBY3RpdmF0ZWRSb3V0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSB3cmFwcGVkIG9ic2VydmFibGUgdGhhdCB3aWxsIHN3aXRjaCB0byB0aGUgbGF0ZXN0IGFjdGl2YXRlZCByb3V0ZSBtYXRjaGVkIGJ5IHRoZSBnaXZlbiBjb21wb25lbnRcbiAgICovXG4gIHByaXZhdGUgcHJveHlPYnNlcnZhYmxlKGNvbXBvbmVudCQ6IE9ic2VydmFibGU8YW55PiwgcGF0aDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gY29tcG9uZW50JC5waXBlKFxuICAgICAgLy8gRmlyc3Qgd2FpdCB1bnRpbCB0aGUgY29tcG9uZW50IGluc3RhbmNlIGlzIHB1c2hlZFxuICAgICAgZmlsdGVyKGNvbXBvbmVudCA9PiAhIWNvbXBvbmVudCksXG4gICAgICBzd2l0Y2hNYXAoY29tcG9uZW50ID0+XG4gICAgICAgIHRoaXMuY3VycmVudEFjdGl2YXRlZFJvdXRlJC5waXBlKFxuICAgICAgICAgIGZpbHRlcihjdXJyZW50ID0+IGN1cnJlbnQgIT09IG51bGwgJiYgY3VycmVudC5jb21wb25lbnQgPT09IGNvbXBvbmVudCksXG4gICAgICAgICAgc3dpdGNoTWFwKGN1cnJlbnQgPT4gY3VycmVudCAmJiAoY3VycmVudC5hY3RpdmF0ZWRSb3V0ZSBhcyBhbnkpW3BhdGhdKSxcbiAgICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGFjdGl2YXRlZCByb3V0ZSBwcm94eSBmb3IgdGhlIGdpdmVuIGNvbXBvbmVudCB0byB0aGUgbmV3IGluY29taW5nIHJvdXRlciBzdGF0ZVxuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVBY3RpdmF0ZWRSb3V0ZVByb3h5KGNvbXBvbmVudDogYW55LCBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUpOiB2b2lkIHtcbiAgICBjb25zdCBwcm94eSA9IHRoaXMucHJveHlNYXAuZ2V0KGNvbXBvbmVudCk7XG4gICAgaWYgKCFwcm94eSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY3RpdmF0ZWQgcm91dGUgcHJveHkgZm9yIHZpZXdgKTtcbiAgICB9XG5cbiAgICAocHJveHkgYXMgYW55KS5fZnV0dXJlU25hcHNob3QgPSAoYWN0aXZhdGVkUm91dGUgYXMgYW55KS5fZnV0dXJlU25hcHNob3Q7XG4gICAgKHByb3h5IGFzIGFueSkuX3JvdXRlclN0YXRlID0gKGFjdGl2YXRlZFJvdXRlIGFzIGFueSkuX3JvdXRlclN0YXRlO1xuICAgIHByb3h5LnNuYXBzaG90ID0gYWN0aXZhdGVkUm91dGUuc25hcHNob3Q7XG4gICAgcHJveHkub3V0bGV0ID0gYWN0aXZhdGVkUm91dGUub3V0bGV0O1xuICAgIHByb3h5LmNvbXBvbmVudCA9IGFjdGl2YXRlZFJvdXRlLmNvbXBvbmVudDtcblxuICAgIHRoaXMuY3VycmVudEFjdGl2YXRlZFJvdXRlJC5uZXh0KHsgY29tcG9uZW50LCBhY3RpdmF0ZWRSb3V0ZSB9KTtcbiAgfVxufVxuXG5jbGFzcyBPdXRsZXRJbmplY3RvciBpbXBsZW1lbnRzIEluamVjdG9yIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgcHJpdmF0ZSBjaGlsZENvbnRleHRzOiBDaGlsZHJlbk91dGxldENvbnRleHRzLFxuICAgIHByaXZhdGUgcGFyZW50OiBJbmplY3RvclxuICApIHsgfVxuXG4gIGdldCh0b2tlbjogYW55LCBub3RGb3VuZFZhbHVlPzogYW55KTogYW55IHtcbiAgICBpZiAodG9rZW4gPT09IEFjdGl2YXRlZFJvdXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy5yb3V0ZTtcbiAgICB9XG5cbiAgICBpZiAodG9rZW4gPT09IENoaWxkcmVuT3V0bGV0Q29udGV4dHMpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkQ29udGV4dHM7XG4gICAgfVxuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmdldCh0b2tlbiwgbm90Rm91bmRWYWx1ZSk7XG4gIH1cbn1cbiJdfQ==