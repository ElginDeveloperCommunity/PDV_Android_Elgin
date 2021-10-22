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
var IonRouterOutlet = /** @class */ (function () {
    function IonRouterOutlet(parentContexts, location, resolver, name, tabs, config, navCtrl, commonLocation, elementRef, router, zone, activatedRoute, parentOutlet) {
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
    Object.defineProperty(IonRouterOutlet.prototype, "animation", {
        set: function (animation) {
            this.nativeEl.animation = animation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonRouterOutlet.prototype, "animated", {
        set: function (animated) {
            this.nativeEl.animated = animated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonRouterOutlet.prototype, "swipeGesture", {
        set: function (swipe) {
            var _this = this;
            this._swipeGesture = swipe;
            this.nativeEl.swipeHandler = swipe ? {
                canStart: function () { return _this.stackCtrl.canGoBack(1) && !_this.stackCtrl.hasRunningTask(); },
                onStart: function () { return _this.stackCtrl.startBackTransition(); },
                onEnd: function (shouldContinue) { return _this.stackCtrl.endBackTransition(shouldContinue); }
            } : undefined;
        },
        enumerable: true,
        configurable: true
    });
    IonRouterOutlet.prototype.ngOnDestroy = function () {
        this.stackCtrl.destroy();
    };
    IonRouterOutlet.prototype.getContext = function () {
        return this.parentContexts.getContext(this.name);
    };
    IonRouterOutlet.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.activated) {
            // If the outlet was not instantiated at the time the route got activated we need to populate
            // the outlet when it is initialized (ie inside a NgIf)
            var context = this.getContext();
            if (context && context.route) {
                this.activateWith(context.route, context.resolver || null);
            }
        }
        new Promise(function (resolve) { return componentOnReady(_this.nativeEl, resolve); }).then(function () {
            if (_this._swipeGesture === undefined) {
                _this.swipeGesture = _this.config.getBoolean('swipeBackEnabled', _this.nativeEl.mode === 'ios');
            }
        });
    };
    Object.defineProperty(IonRouterOutlet.prototype, "isActivated", {
        get: function () {
            return !!this.activated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonRouterOutlet.prototype, "component", {
        get: function () {
            if (!this.activated) {
                throw new Error('Outlet is not activated');
            }
            return this.activated.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonRouterOutlet.prototype, "activatedRoute", {
        get: function () {
            if (!this.activated) {
                throw new Error('Outlet is not activated');
            }
            return this._activatedRoute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonRouterOutlet.prototype, "activatedRouteData", {
        get: function () {
            if (this._activatedRoute) {
                return this._activatedRoute.snapshot.data;
            }
            return {};
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    IonRouterOutlet.prototype.detach = function () {
        throw new Error('incompatible reuse strategy');
    };
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    IonRouterOutlet.prototype.attach = function (_ref, _activatedRoute) {
        throw new Error('incompatible reuse strategy');
    };
    IonRouterOutlet.prototype.deactivate = function () {
        if (this.activated) {
            if (this.activatedView) {
                var context = this.getContext();
                this.activatedView.savedData = new Map(context.children['contexts']);
                /**
                 * Angular v11.2.10 introduced a change
                 * where this route context is cleared out when
                 * a router-outlet is deactivated, However,
                 * we need this route information in order to
                 * return a user back to the correct tab when
                 * leaving and then going back to the tab context.
                 */
                var primaryOutlet = this.activatedView.savedData.get('primary');
                if (primaryOutlet && context.route) {
                    primaryOutlet.route = tslib_1.__assign({}, context.route);
                }
                /**
                 * Ensure we are saving the NavigationExtras
                 * data otherwise it will be lost
                 */
                this.activatedView.savedExtras = {};
                if (context.route) {
                    var contextSnapshot = context.route.snapshot;
                    this.activatedView.savedExtras.queryParams = contextSnapshot.queryParams;
                    this.activatedView.savedExtras.fragment = contextSnapshot.fragment;
                }
            }
            var c = this.component;
            this.activatedView = null;
            this.activated = null;
            this._activatedRoute = null;
            this.deactivateEvents.emit(c);
        }
    };
    IonRouterOutlet.prototype.activateWith = function (activatedRoute, resolver) {
        var _this = this;
        if (this.isActivated) {
            throw new Error('Cannot activate an already activated outlet');
        }
        this._activatedRoute = activatedRoute;
        var cmpRef;
        var enteringView = this.stackCtrl.getExistingView(activatedRoute);
        if (enteringView) {
            cmpRef = this.activated = enteringView.ref;
            var saved = enteringView.savedData;
            if (saved) {
                // self-restore
                var context = this.getContext();
                context.children['contexts'] = saved;
            }
            // Updated activated route proxy for this component
            this.updateActivatedRouteProxy(cmpRef.instance, activatedRoute);
        }
        else {
            var snapshot = activatedRoute._futureSnapshot;
            var component = snapshot.routeConfig.component;
            resolver = resolver || this.resolver;
            var factory = resolver.resolveComponentFactory(component);
            var childContexts = this.parentContexts.getOrCreateContext(this.name).children;
            // We create an activated route proxy object that will maintain future updates for this component
            // over its lifecycle in the stack.
            var component$ = new BehaviorSubject(null);
            var activatedRouteProxy = this.createActivatedRouteProxy(component$, activatedRoute);
            var injector = new OutletInjector(activatedRouteProxy, childContexts, this.location.injector);
            cmpRef = this.activated = this.location.createComponent(factory, this.location.length, injector);
            // Once the component is created we can push it to our local subject supplied to the proxy
            component$.next(cmpRef.instance);
            // Calling `markForCheck` to make sure we will run the change detection when the
            // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
            enteringView = this.stackCtrl.createView(this.activated, activatedRoute);
            // Store references to the proxy by component
            this.proxyMap.set(cmpRef.instance, activatedRouteProxy);
            this.currentActivatedRoute$.next({ component: cmpRef.instance, activatedRoute: activatedRoute });
        }
        this.activatedView = enteringView;
        this.stackCtrl.setActive(enteringView).then(function (data) {
            _this.navCtrl.setTopOutlet(_this);
            _this.activateEvents.emit(cmpRef.instance);
            _this.stackEvents.emit(data);
        });
    };
    /**
     * Returns `true` if there are pages in the stack to go back.
     */
    IonRouterOutlet.prototype.canGoBack = function (deep, stackId) {
        if (deep === void 0) { deep = 1; }
        return this.stackCtrl.canGoBack(deep, stackId);
    };
    /**
     * Resolves to `true` if it the outlet was able to sucessfully pop the last N pages.
     */
    IonRouterOutlet.prototype.pop = function (deep, stackId) {
        if (deep === void 0) { deep = 1; }
        return this.stackCtrl.pop(deep, stackId);
    };
    /**
     * Returns the URL of the active page of each stack.
     */
    IonRouterOutlet.prototype.getLastUrl = function (stackId) {
        var active = this.stackCtrl.getLastUrl(stackId);
        return active ? active.url : undefined;
    };
    /**
     * Returns the RouteView of the active page of each stack.
     * @internal
     */
    IonRouterOutlet.prototype.getLastRouteView = function (stackId) {
        return this.stackCtrl.getLastUrl(stackId);
    };
    /**
     * Returns the root view in the tab stack.
     * @internal
     */
    IonRouterOutlet.prototype.getRootView = function (stackId) {
        return this.stackCtrl.getRootUrl(stackId);
    };
    /**
     * Returns the active stack ID. In the context of ion-tabs, it means the active tab.
     */
    IonRouterOutlet.prototype.getActiveStackId = function () {
        return this.stackCtrl.getActiveStackId();
    };
    /**
     * Since the activated route can change over the life time of a component in an ion router outlet, we create
     * a proxy so that we can update the values over time as a user navigates back to components already in the stack.
     */
    IonRouterOutlet.prototype.createActivatedRouteProxy = function (component$, activatedRoute) {
        var proxy = new ActivatedRoute();
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
    };
    /**
     * Create a wrapped observable that will switch to the latest activated route matched by the given component
     */
    IonRouterOutlet.prototype.proxyObservable = function (component$, path) {
        var _this = this;
        return component$.pipe(
        // First wait until the component instance is pushed
        filter(function (component) { return !!component; }), switchMap(function (component) {
            return _this.currentActivatedRoute$.pipe(filter(function (current) { return current !== null && current.component === component; }), switchMap(function (current) { return current && current.activatedRoute[path]; }), distinctUntilChanged());
        }));
    };
    /**
     * Updates the activated route proxy for the given component to the new incoming router state
     */
    IonRouterOutlet.prototype.updateActivatedRouteProxy = function (component, activatedRoute) {
        var proxy = this.proxyMap.get(component);
        if (!proxy) {
            throw new Error("Could not find activated route proxy for view");
        }
        proxy._futureSnapshot = activatedRoute._futureSnapshot;
        proxy._routerState = activatedRoute._routerState;
        proxy.snapshot = activatedRoute.snapshot;
        proxy.outlet = activatedRoute.outlet;
        proxy.component = activatedRoute.component;
        this.currentActivatedRoute$.next({ component: component, activatedRoute: activatedRoute });
    };
    IonRouterOutlet.ctorParameters = function () { return [
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
    ]; };
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
    return IonRouterOutlet;
}());
export { IonRouterOutlet };
var OutletInjector = /** @class */ (function () {
    function OutletInjector(route, childContexts, parent) {
        this.route = route;
        this.childContexts = childContexts;
        this.parent = parent;
    }
    OutletInjector.prototype.get = function (token, notFoundValue) {
        if (token === ActivatedRoute) {
            return this.route;
        }
        if (token === ChildrenOutletContexts) {
            return this.childContexts;
        }
        // tslint:disable-next-line
        return this.parent.get(token, notFoundValue);
    };
    return OutletInjector;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uLXJvdXRlci1vdXRsZXQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi9pb24tcm91dGVyLW91dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsd0JBQXdCLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxTSxPQUFPLEVBQUUsY0FBYyxFQUFFLHNCQUFzQixFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEgsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxlQUFlLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUd6RSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRS9ELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQWEsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBT2xEO0lBeUNFLHlCQUNVLGNBQXNDLEVBQ3RDLFFBQTBCLEVBQzFCLFFBQWtDLEVBQ3ZCLElBQVksRUFDQSxJQUFZLEVBQ25DLE1BQWMsRUFDZCxPQUFzQixFQUM5QixjQUF3QixFQUN4QixVQUFzQixFQUN0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QixtQkFBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLG1CQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQVE3QixvQkFBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLG9CQUFBLFFBQVEsRUFBRSxDQUFBO09BdERkLGVBQWUsQ0FvVTNCO0lBQUQsc0JBQUM7Q0FBQSxBQXBVRCxJQW9VQztTQXBVWSxlQUFlO0FBc1U1QjtJQUNFLHdCQUNVLEtBQXFCLEVBQ3JCLGFBQXFDLEVBQ3JDLE1BQWdCO1FBRmhCLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLGtCQUFhLEdBQWIsYUFBYSxDQUF3QjtRQUNyQyxXQUFNLEdBQU4sTUFBTSxDQUFVO0lBQ3RCLENBQUM7SUFFTCw0QkFBRyxHQUFILFVBQUksS0FBVSxFQUFFLGFBQW1CO1FBQ2pDLElBQUksS0FBSyxLQUFLLGNBQWMsRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDbkI7UUFFRCxJQUFJLEtBQUssS0FBSyxzQkFBc0IsRUFBRTtZQUNwQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7U0FDM0I7UUFFRCwyQkFBMkI7UUFDM0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQW5CRCxJQW1CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEF0dHJpYnV0ZSwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBDb21wb25lbnRSZWYsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3RvciwgTmdab25lLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3B0aW9uYWwsIE91dHB1dCwgU2tpcFNlbGYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBDaGlsZHJlbk91dGxldENvbnRleHRzLCBPdXRsZXRDb250ZXh0LCBQUklNQVJZX09VVExFVCwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IGNvbXBvbmVudE9uUmVhZHkgfSBmcm9tICdAaW9uaWMvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBmaWx0ZXIsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQW5pbWF0aW9uQnVpbGRlciB9IGZyb20gJy4uLy4uLyc7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvY29uZmlnJztcbmltcG9ydCB7IE5hdkNvbnRyb2xsZXIgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvbmF2LWNvbnRyb2xsZXInO1xuXG5pbXBvcnQgeyBTdGFja0NvbnRyb2xsZXIgfSBmcm9tICcuL3N0YWNrLWNvbnRyb2xsZXInO1xuaW1wb3J0IHsgUm91dGVWaWV3LCBnZXRVcmwgfSBmcm9tICcuL3N0YWNrLXV0aWxzJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW9uLXJvdXRlci1vdXRsZXQnLFxuICBleHBvcnRBczogJ291dGxldCcsXG4gIGlucHV0czogWydhbmltYXRlZCcsICdhbmltYXRpb24nLCAnc3dpcGVHZXN0dXJlJ11cbn0pXG5leHBvcnQgY2xhc3MgSW9uUm91dGVyT3V0bGV0IGltcGxlbWVudHMgT25EZXN0cm95LCBPbkluaXQge1xuICBuYXRpdmVFbDogSFRNTElvblJvdXRlck91dGxldEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBhY3RpdmF0ZWQ6IENvbXBvbmVudFJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG4gIGFjdGl2YXRlZFZpZXc6IFJvdXRlVmlldyB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgX2FjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9zd2lwZUdlc3R1cmU/OiBib29sZWFuO1xuICBwcml2YXRlIG5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBzdGFja0N0cmw6IFN0YWNrQ29udHJvbGxlcjtcblxuICAvLyBNYWludGFpbiBtYXAgb2YgYWN0aXZhdGVkIHJvdXRlIHByb3hpZXMgZm9yIGVhY2ggY29tcG9uZW50IGluc3RhbmNlXG4gIHByaXZhdGUgcHJveHlNYXAgPSBuZXcgV2Vha01hcDxhbnksIEFjdGl2YXRlZFJvdXRlPigpO1xuXG4gIC8vIEtlZXAgdGhlIGxhdGVzdCBhY3RpdmF0ZWQgcm91dGUgaW4gYSBzdWJqZWN0IGZvciB0aGUgcHJveHkgcm91dGVzIHRvIHN3aXRjaCBtYXAgdG9cbiAgcHJpdmF0ZSBjdXJyZW50QWN0aXZhdGVkUm91dGUkID0gbmV3IEJlaGF2aW9yU3ViamVjdDx7IGNvbXBvbmVudDogYW55OyBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUgfSB8IG51bGw+KG51bGwpO1xuXG4gIHRhYnNQcmVmaXg6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICBAT3V0cHV0KCkgc3RhY2tFdmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnYWN0aXZhdGUnKSBhY3RpdmF0ZUV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdkZWFjdGl2YXRlJykgZGVhY3RpdmF0ZUV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHNldCBhbmltYXRpb24oYW5pbWF0aW9uOiBBbmltYXRpb25CdWlsZGVyKSB7XG4gICAgdGhpcy5uYXRpdmVFbC5hbmltYXRpb24gPSBhbmltYXRpb247XG4gIH1cblxuICBzZXQgYW5pbWF0ZWQoYW5pbWF0ZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLm5hdGl2ZUVsLmFuaW1hdGVkID0gYW5pbWF0ZWQ7XG4gIH1cblxuICBzZXQgc3dpcGVHZXN0dXJlKHN3aXBlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc3dpcGVHZXN0dXJlID0gc3dpcGU7XG5cbiAgICB0aGlzLm5hdGl2ZUVsLnN3aXBlSGFuZGxlciA9IHN3aXBlID8ge1xuICAgICAgY2FuU3RhcnQ6ICgpID0+IHRoaXMuc3RhY2tDdHJsLmNhbkdvQmFjaygxKSAmJiAhdGhpcy5zdGFja0N0cmwuaGFzUnVubmluZ1Rhc2soKSxcbiAgICAgIG9uU3RhcnQ6ICgpID0+IHRoaXMuc3RhY2tDdHJsLnN0YXJ0QmFja1RyYW5zaXRpb24oKSxcbiAgICAgIG9uRW5kOiBzaG91bGRDb250aW51ZSA9PiB0aGlzLnN0YWNrQ3RybC5lbmRCYWNrVHJhbnNpdGlvbihzaG91bGRDb250aW51ZSlcbiAgICB9IDogdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwYXJlbnRDb250ZXh0czogQ2hpbGRyZW5PdXRsZXRDb250ZXh0cyxcbiAgICBwcml2YXRlIGxvY2F0aW9uOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBAQXR0cmlidXRlKCduYW1lJykgbmFtZTogc3RyaW5nLFxuICAgIEBPcHRpb25hbCgpIEBBdHRyaWJ1dGUoJ3RhYnMnKSB0YWJzOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBjb25maWc6IENvbmZpZyxcbiAgICBwcml2YXRlIG5hdkN0cmw6IE5hdkNvbnRyb2xsZXIsXG4gICAgY29tbW9uTG9jYXRpb246IExvY2F0aW9uLFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcm91dGVyOiBSb3V0ZXIsXG4gICAgem9uZTogTmdab25lLFxuICAgIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBAU2tpcFNlbGYoKSBAT3B0aW9uYWwoKSByZWFkb25seSBwYXJlbnRPdXRsZXQ/OiBJb25Sb3V0ZXJPdXRsZXRcbiAgKSB7XG4gICAgdGhpcy5uYXRpdmVFbCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lIHx8IFBSSU1BUllfT1VUTEVUO1xuICAgIHRoaXMudGFic1ByZWZpeCA9IHRhYnMgPT09ICd0cnVlJyA/IGdldFVybChyb3V0ZXIsIGFjdGl2YXRlZFJvdXRlKSA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLnN0YWNrQ3RybCA9IG5ldyBTdGFja0NvbnRyb2xsZXIodGhpcy50YWJzUHJlZml4LCB0aGlzLm5hdGl2ZUVsLCByb3V0ZXIsIG5hdkN0cmwsIHpvbmUsIGNvbW1vbkxvY2F0aW9uKTtcbiAgICBwYXJlbnRDb250ZXh0cy5vbkNoaWxkT3V0bGV0Q3JlYXRlZCh0aGlzLm5hbWUsIHRoaXMgYXMgYW55KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3RhY2tDdHJsLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKTogT3V0bGV0Q29udGV4dCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnBhcmVudENvbnRleHRzLmdldENvbnRleHQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5hY3RpdmF0ZWQpIHtcbiAgICAgIC8vIElmIHRoZSBvdXRsZXQgd2FzIG5vdCBpbnN0YW50aWF0ZWQgYXQgdGhlIHRpbWUgdGhlIHJvdXRlIGdvdCBhY3RpdmF0ZWQgd2UgbmVlZCB0byBwb3B1bGF0ZVxuICAgICAgLy8gdGhlIG91dGxldCB3aGVuIGl0IGlzIGluaXRpYWxpemVkIChpZSBpbnNpZGUgYSBOZ0lmKVxuICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuICAgICAgaWYgKGNvbnRleHQgJiYgY29udGV4dC5yb3V0ZSkge1xuICAgICAgICB0aGlzLmFjdGl2YXRlV2l0aChjb250ZXh0LnJvdXRlLCBjb250ZXh0LnJlc29sdmVyIHx8IG51bGwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gY29tcG9uZW50T25SZWFkeSh0aGlzLm5hdGl2ZUVsLCByZXNvbHZlKSkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fc3dpcGVHZXN0dXJlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5zd2lwZUdlc3R1cmUgPSB0aGlzLmNvbmZpZy5nZXRCb29sZWFuKCdzd2lwZUJhY2tFbmFibGVkJywgKHRoaXMubmF0aXZlRWwgYXMgYW55KS5tb2RlID09PSAnaW9zJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXQgaXNBY3RpdmF0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5hY3RpdmF0ZWQ7XG4gIH1cblxuICBnZXQgY29tcG9uZW50KCk6IG9iamVjdCB7XG4gICAgaWYgKCF0aGlzLmFjdGl2YXRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXRsZXQgaXMgbm90IGFjdGl2YXRlZCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hY3RpdmF0ZWQuaW5zdGFuY2U7XG4gIH1cblxuICBnZXQgYWN0aXZhdGVkUm91dGUoKTogQWN0aXZhdGVkUm91dGUge1xuICAgIGlmICghdGhpcy5hY3RpdmF0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT3V0bGV0IGlzIG5vdCBhY3RpdmF0ZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZFJvdXRlIGFzIEFjdGl2YXRlZFJvdXRlO1xuICB9XG5cbiAgZ2V0IGFjdGl2YXRlZFJvdXRlRGF0YSgpOiBhbnkge1xuICAgIGlmICh0aGlzLl9hY3RpdmF0ZWRSb3V0ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZFJvdXRlLnNuYXBzaG90LmRhdGE7XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgYFJvdXRlUmV1c2VTdHJhdGVneWAgaW5zdHJ1Y3RzIHRvIGRldGFjaCB0aGUgc3VidHJlZVxuICAgKi9cbiAgZGV0YWNoKCk6IENvbXBvbmVudFJlZjxhbnk+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2luY29tcGF0aWJsZSByZXVzZSBzdHJhdGVneScpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBgUm91dGVSZXVzZVN0cmF0ZWd5YCBpbnN0cnVjdHMgdG8gcmUtYXR0YWNoIGEgcHJldmlvdXNseSBkZXRhY2hlZCBzdWJ0cmVlXG4gICAqL1xuICBhdHRhY2goX3JlZjogQ29tcG9uZW50UmVmPGFueT4sIF9hY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2luY29tcGF0aWJsZSByZXVzZSBzdHJhdGVneScpO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hY3RpdmF0ZWQpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2YXRlZFZpZXcpIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMuZ2V0Q29udGV4dCgpITtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRWaWV3LnNhdmVkRGF0YSA9IG5ldyBNYXAoY29udGV4dC5jaGlsZHJlblsnY29udGV4dHMnXSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuZ3VsYXIgdjExLjIuMTAgaW50cm9kdWNlZCBhIGNoYW5nZVxuICAgICAgICAgKiB3aGVyZSB0aGlzIHJvdXRlIGNvbnRleHQgaXMgY2xlYXJlZCBvdXQgd2hlblxuICAgICAgICAgKiBhIHJvdXRlci1vdXRsZXQgaXMgZGVhY3RpdmF0ZWQsIEhvd2V2ZXIsXG4gICAgICAgICAqIHdlIG5lZWQgdGhpcyByb3V0ZSBpbmZvcm1hdGlvbiBpbiBvcmRlciB0b1xuICAgICAgICAgKiByZXR1cm4gYSB1c2VyIGJhY2sgdG8gdGhlIGNvcnJlY3QgdGFiIHdoZW5cbiAgICAgICAgICogbGVhdmluZyBhbmQgdGhlbiBnb2luZyBiYWNrIHRvIHRoZSB0YWIgY29udGV4dC5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHByaW1hcnlPdXRsZXQgPSB0aGlzLmFjdGl2YXRlZFZpZXcuc2F2ZWREYXRhLmdldCgncHJpbWFyeScpO1xuICAgICAgICBpZiAocHJpbWFyeU91dGxldCAmJiBjb250ZXh0LnJvdXRlKSB7XG4gICAgICAgICAgcHJpbWFyeU91dGxldC5yb3V0ZSA9IHsgLi4uY29udGV4dC5yb3V0ZSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVuc3VyZSB3ZSBhcmUgc2F2aW5nIHRoZSBOYXZpZ2F0aW9uRXh0cmFzXG4gICAgICAgICAqIGRhdGEgb3RoZXJ3aXNlIGl0IHdpbGwgYmUgbG9zdFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRWaWV3LnNhdmVkRXh0cmFzID0ge307XG4gICAgICAgIGlmIChjb250ZXh0LnJvdXRlKSB7XG4gICAgICAgICAgY29uc3QgY29udGV4dFNuYXBzaG90ID0gY29udGV4dC5yb3V0ZS5zbmFwc2hvdDtcblxuICAgICAgICAgIHRoaXMuYWN0aXZhdGVkVmlldy5zYXZlZEV4dHJhcy5xdWVyeVBhcmFtcyA9IGNvbnRleHRTbmFwc2hvdC5xdWVyeVBhcmFtcztcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlZFZpZXcuc2F2ZWRFeHRyYXMuZnJhZ21lbnQgPSBjb250ZXh0U25hcHNob3QuZnJhZ21lbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IGMgPSB0aGlzLmNvbXBvbmVudDtcbiAgICAgIHRoaXMuYWN0aXZhdGVkVmlldyA9IG51bGw7XG4gICAgICB0aGlzLmFjdGl2YXRlZCA9IG51bGw7XG4gICAgICB0aGlzLl9hY3RpdmF0ZWRSb3V0ZSA9IG51bGw7XG4gICAgICB0aGlzLmRlYWN0aXZhdGVFdmVudHMuZW1pdChjKTtcbiAgICB9XG4gIH1cblxuICBhY3RpdmF0ZVdpdGgoYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlLCByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyIHwgbnVsbCkge1xuICAgIGlmICh0aGlzLmlzQWN0aXZhdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhY3RpdmF0ZSBhbiBhbHJlYWR5IGFjdGl2YXRlZCBvdXRsZXQnKTtcbiAgICB9XG4gICAgdGhpcy5fYWN0aXZhdGVkUm91dGUgPSBhY3RpdmF0ZWRSb3V0ZTtcblxuICAgIGxldCBjbXBSZWY6IGFueTtcbiAgICBsZXQgZW50ZXJpbmdWaWV3ID0gdGhpcy5zdGFja0N0cmwuZ2V0RXhpc3RpbmdWaWV3KGFjdGl2YXRlZFJvdXRlKTtcbiAgICBpZiAoZW50ZXJpbmdWaWV3KSB7XG4gICAgICBjbXBSZWYgPSB0aGlzLmFjdGl2YXRlZCA9IGVudGVyaW5nVmlldy5yZWY7XG4gICAgICBjb25zdCBzYXZlZCA9IGVudGVyaW5nVmlldy5zYXZlZERhdGE7XG4gICAgICBpZiAoc2F2ZWQpIHtcbiAgICAgICAgLy8gc2VsZi1yZXN0b3JlXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmdldENvbnRleHQoKSE7XG4gICAgICAgIGNvbnRleHQuY2hpbGRyZW5bJ2NvbnRleHRzJ10gPSBzYXZlZDtcbiAgICAgIH1cbiAgICAgIC8vIFVwZGF0ZWQgYWN0aXZhdGVkIHJvdXRlIHByb3h5IGZvciB0aGlzIGNvbXBvbmVudFxuICAgICAgdGhpcy51cGRhdGVBY3RpdmF0ZWRSb3V0ZVByb3h5KGNtcFJlZi5pbnN0YW5jZSwgYWN0aXZhdGVkUm91dGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzbmFwc2hvdCA9IChhY3RpdmF0ZWRSb3V0ZSBhcyBhbnkpLl9mdXR1cmVTbmFwc2hvdDtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHNuYXBzaG90LnJvdXRlQ29uZmlnIS5jb21wb25lbnQgYXMgYW55O1xuICAgICAgcmVzb2x2ZXIgPSByZXNvbHZlciB8fCB0aGlzLnJlc29sdmVyO1xuXG4gICAgICBjb25zdCBmYWN0b3J5ID0gcmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50KTtcbiAgICAgIGNvbnN0IGNoaWxkQ29udGV4dHMgPSB0aGlzLnBhcmVudENvbnRleHRzLmdldE9yQ3JlYXRlQ29udGV4dCh0aGlzLm5hbWUpLmNoaWxkcmVuO1xuXG4gICAgICAvLyBXZSBjcmVhdGUgYW4gYWN0aXZhdGVkIHJvdXRlIHByb3h5IG9iamVjdCB0aGF0IHdpbGwgbWFpbnRhaW4gZnV0dXJlIHVwZGF0ZXMgZm9yIHRoaXMgY29tcG9uZW50XG4gICAgICAvLyBvdmVyIGl0cyBsaWZlY3ljbGUgaW4gdGhlIHN0YWNrLlxuICAgICAgY29uc3QgY29tcG9uZW50JCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcbiAgICAgIGNvbnN0IGFjdGl2YXRlZFJvdXRlUHJveHkgPSB0aGlzLmNyZWF0ZUFjdGl2YXRlZFJvdXRlUHJveHkoY29tcG9uZW50JCwgYWN0aXZhdGVkUm91dGUpO1xuXG4gICAgICBjb25zdCBpbmplY3RvciA9IG5ldyBPdXRsZXRJbmplY3RvcihhY3RpdmF0ZWRSb3V0ZVByb3h5LCBjaGlsZENvbnRleHRzLCB0aGlzLmxvY2F0aW9uLmluamVjdG9yKTtcbiAgICAgIGNtcFJlZiA9IHRoaXMuYWN0aXZhdGVkID0gdGhpcy5sb2NhdGlvbi5jcmVhdGVDb21wb25lbnQoZmFjdG9yeSwgdGhpcy5sb2NhdGlvbi5sZW5ndGgsIGluamVjdG9yKTtcblxuICAgICAgLy8gT25jZSB0aGUgY29tcG9uZW50IGlzIGNyZWF0ZWQgd2UgY2FuIHB1c2ggaXQgdG8gb3VyIGxvY2FsIHN1YmplY3Qgc3VwcGxpZWQgdG8gdGhlIHByb3h5XG4gICAgICBjb21wb25lbnQkLm5leHQoY21wUmVmLmluc3RhbmNlKTtcblxuICAgICAgLy8gQ2FsbGluZyBgbWFya0ZvckNoZWNrYCB0byBtYWtlIHN1cmUgd2Ugd2lsbCBydW4gdGhlIGNoYW5nZSBkZXRlY3Rpb24gd2hlbiB0aGVcbiAgICAgIC8vIGBSb3V0ZXJPdXRsZXRgIGlzIGluc2lkZSBhIGBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hgIGNvbXBvbmVudC5cbiAgICAgIGVudGVyaW5nVmlldyA9IHRoaXMuc3RhY2tDdHJsLmNyZWF0ZVZpZXcodGhpcy5hY3RpdmF0ZWQsIGFjdGl2YXRlZFJvdXRlKTtcblxuICAgICAgLy8gU3RvcmUgcmVmZXJlbmNlcyB0byB0aGUgcHJveHkgYnkgY29tcG9uZW50XG4gICAgICB0aGlzLnByb3h5TWFwLnNldChjbXBSZWYuaW5zdGFuY2UsIGFjdGl2YXRlZFJvdXRlUHJveHkpO1xuICAgICAgdGhpcy5jdXJyZW50QWN0aXZhdGVkUm91dGUkLm5leHQoeyBjb21wb25lbnQ6IGNtcFJlZi5pbnN0YW5jZSwgYWN0aXZhdGVkUm91dGUgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5hY3RpdmF0ZWRWaWV3ID0gZW50ZXJpbmdWaWV3O1xuICAgIHRoaXMuc3RhY2tDdHJsLnNldEFjdGl2ZShlbnRlcmluZ1ZpZXcpLnRoZW4oZGF0YSA9PiB7XG4gICAgICB0aGlzLm5hdkN0cmwuc2V0VG9wT3V0bGV0KHRoaXMpO1xuICAgICAgdGhpcy5hY3RpdmF0ZUV2ZW50cy5lbWl0KGNtcFJlZi5pbnN0YW5jZSk7XG4gICAgICB0aGlzLnN0YWNrRXZlbnRzLmVtaXQoZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlcmUgYXJlIHBhZ2VzIGluIHRoZSBzdGFjayB0byBnbyBiYWNrLlxuICAgKi9cbiAgY2FuR29CYWNrKGRlZXAgPSAxLCBzdGFja0lkPzogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhY2tDdHJsLmNhbkdvQmFjayhkZWVwLCBzdGFja0lkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlcyB0byBgdHJ1ZWAgaWYgaXQgdGhlIG91dGxldCB3YXMgYWJsZSB0byBzdWNlc3NmdWxseSBwb3AgdGhlIGxhc3QgTiBwYWdlcy5cbiAgICovXG4gIHBvcChkZWVwID0gMSwgc3RhY2tJZD86IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLnN0YWNrQ3RybC5wb3AoZGVlcCwgc3RhY2tJZCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgVVJMIG9mIHRoZSBhY3RpdmUgcGFnZSBvZiBlYWNoIHN0YWNrLlxuICAgKi9cbiAgZ2V0TGFzdFVybChzdGFja0lkPzogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBhY3RpdmUgPSB0aGlzLnN0YWNrQ3RybC5nZXRMYXN0VXJsKHN0YWNrSWQpO1xuICAgIHJldHVybiBhY3RpdmUgPyBhY3RpdmUudXJsIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIFJvdXRlVmlldyBvZiB0aGUgYWN0aXZlIHBhZ2Ugb2YgZWFjaCBzdGFjay5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBnZXRMYXN0Um91dGVWaWV3KHN0YWNrSWQ/OiBzdHJpbmcpOiBSb3V0ZVZpZXcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnN0YWNrQ3RybC5nZXRMYXN0VXJsKHN0YWNrSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3QgdmlldyBpbiB0aGUgdGFiIHN0YWNrLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGdldFJvb3RWaWV3KHN0YWNrSWQ/OiBzdHJpbmcpOiBSb3V0ZVZpZXcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnN0YWNrQ3RybC5nZXRSb290VXJsKHN0YWNrSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFjdGl2ZSBzdGFjayBJRC4gSW4gdGhlIGNvbnRleHQgb2YgaW9uLXRhYnMsIGl0IG1lYW5zIHRoZSBhY3RpdmUgdGFiLlxuICAgKi9cbiAgZ2V0QWN0aXZlU3RhY2tJZCgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnN0YWNrQ3RybC5nZXRBY3RpdmVTdGFja0lkKCk7XG4gIH1cblxuICAvKipcbiAgICogU2luY2UgdGhlIGFjdGl2YXRlZCByb3V0ZSBjYW4gY2hhbmdlIG92ZXIgdGhlIGxpZmUgdGltZSBvZiBhIGNvbXBvbmVudCBpbiBhbiBpb24gcm91dGVyIG91dGxldCwgd2UgY3JlYXRlXG4gICAqIGEgcHJveHkgc28gdGhhdCB3ZSBjYW4gdXBkYXRlIHRoZSB2YWx1ZXMgb3ZlciB0aW1lIGFzIGEgdXNlciBuYXZpZ2F0ZXMgYmFjayB0byBjb21wb25lbnRzIGFscmVhZHkgaW4gdGhlIHN0YWNrLlxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVBY3RpdmF0ZWRSb3V0ZVByb3h5KGNvbXBvbmVudCQ6IE9ic2VydmFibGU8YW55PiwgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlKTogQWN0aXZhdGVkUm91dGUge1xuICAgIGNvbnN0IHByb3h5OiBhbnkgPSBuZXcgQWN0aXZhdGVkUm91dGUoKTtcblxuICAgIHByb3h5Ll9mdXR1cmVTbmFwc2hvdCA9IChhY3RpdmF0ZWRSb3V0ZSBhcyBhbnkpLl9mdXR1cmVTbmFwc2hvdDtcbiAgICBwcm94eS5fcm91dGVyU3RhdGUgPSAoYWN0aXZhdGVkUm91dGUgYXMgYW55KS5fcm91dGVyU3RhdGU7XG4gICAgcHJveHkuc25hcHNob3QgPSBhY3RpdmF0ZWRSb3V0ZS5zbmFwc2hvdDtcbiAgICBwcm94eS5vdXRsZXQgPSBhY3RpdmF0ZWRSb3V0ZS5vdXRsZXQ7XG4gICAgcHJveHkuY29tcG9uZW50ID0gYWN0aXZhdGVkUm91dGUuY29tcG9uZW50O1xuXG4gICAgLy8gU2V0dXAgd3JhcHBlcnMgZm9yIHRoZSBvYnNlcnZhYmxlcyBzbyBjb25zdW1lcnMgZG9uJ3QgaGF2ZSB0byB3b3JyeSBhYm91dCBzd2l0Y2hpbmcgdG8gbmV3IG9ic2VydmFibGVzIGFzIHRoZSBzdGF0ZSB1cGRhdGVzXG4gICAgKHByb3h5IGFzIGFueSkuX3BhcmFtTWFwID0gdGhpcy5wcm94eU9ic2VydmFibGUoY29tcG9uZW50JCwgJ3BhcmFtTWFwJyk7XG4gICAgKHByb3h5IGFzIGFueSkuX3F1ZXJ5UGFyYW1NYXAgPSB0aGlzLnByb3h5T2JzZXJ2YWJsZShjb21wb25lbnQkLCAncXVlcnlQYXJhbU1hcCcpO1xuICAgIHByb3h5LnVybCA9IHRoaXMucHJveHlPYnNlcnZhYmxlKGNvbXBvbmVudCQsICd1cmwnKTtcbiAgICBwcm94eS5wYXJhbXMgPSB0aGlzLnByb3h5T2JzZXJ2YWJsZShjb21wb25lbnQkLCAncGFyYW1zJyk7XG4gICAgcHJveHkucXVlcnlQYXJhbXMgPSB0aGlzLnByb3h5T2JzZXJ2YWJsZShjb21wb25lbnQkLCAncXVlcnlQYXJhbXMnKTtcbiAgICBwcm94eS5mcmFnbWVudCA9IHRoaXMucHJveHlPYnNlcnZhYmxlKGNvbXBvbmVudCQsICdmcmFnbWVudCcpO1xuICAgIHByb3h5LmRhdGEgPSB0aGlzLnByb3h5T2JzZXJ2YWJsZShjb21wb25lbnQkLCAnZGF0YScpO1xuXG4gICAgcmV0dXJuIHByb3h5IGFzIEFjdGl2YXRlZFJvdXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHdyYXBwZWQgb2JzZXJ2YWJsZSB0aGF0IHdpbGwgc3dpdGNoIHRvIHRoZSBsYXRlc3QgYWN0aXZhdGVkIHJvdXRlIG1hdGNoZWQgYnkgdGhlIGdpdmVuIGNvbXBvbmVudFxuICAgKi9cbiAgcHJpdmF0ZSBwcm94eU9ic2VydmFibGUoY29tcG9uZW50JDogT2JzZXJ2YWJsZTxhbnk+LCBwYXRoOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBjb21wb25lbnQkLnBpcGUoXG4gICAgICAvLyBGaXJzdCB3YWl0IHVudGlsIHRoZSBjb21wb25lbnQgaW5zdGFuY2UgaXMgcHVzaGVkXG4gICAgICBmaWx0ZXIoY29tcG9uZW50ID0+ICEhY29tcG9uZW50KSxcbiAgICAgIHN3aXRjaE1hcChjb21wb25lbnQgPT5cbiAgICAgICAgdGhpcy5jdXJyZW50QWN0aXZhdGVkUm91dGUkLnBpcGUoXG4gICAgICAgICAgZmlsdGVyKGN1cnJlbnQgPT4gY3VycmVudCAhPT0gbnVsbCAmJiBjdXJyZW50LmNvbXBvbmVudCA9PT0gY29tcG9uZW50KSxcbiAgICAgICAgICBzd2l0Y2hNYXAoY3VycmVudCA9PiBjdXJyZW50ICYmIChjdXJyZW50LmFjdGl2YXRlZFJvdXRlIGFzIGFueSlbcGF0aF0pLFxuICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYWN0aXZhdGVkIHJvdXRlIHByb3h5IGZvciB0aGUgZ2l2ZW4gY29tcG9uZW50IHRvIHRoZSBuZXcgaW5jb21pbmcgcm91dGVyIHN0YXRlXG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZUFjdGl2YXRlZFJvdXRlUHJveHkoY29tcG9uZW50OiBhbnksIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSk6IHZvaWQge1xuICAgIGNvbnN0IHByb3h5ID0gdGhpcy5wcm94eU1hcC5nZXQoY29tcG9uZW50KTtcbiAgICBpZiAoIXByb3h5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFjdGl2YXRlZCByb3V0ZSBwcm94eSBmb3Igdmlld2ApO1xuICAgIH1cblxuICAgIChwcm94eSBhcyBhbnkpLl9mdXR1cmVTbmFwc2hvdCA9IChhY3RpdmF0ZWRSb3V0ZSBhcyBhbnkpLl9mdXR1cmVTbmFwc2hvdDtcbiAgICAocHJveHkgYXMgYW55KS5fcm91dGVyU3RhdGUgPSAoYWN0aXZhdGVkUm91dGUgYXMgYW55KS5fcm91dGVyU3RhdGU7XG4gICAgcHJveHkuc25hcHNob3QgPSBhY3RpdmF0ZWRSb3V0ZS5zbmFwc2hvdDtcbiAgICBwcm94eS5vdXRsZXQgPSBhY3RpdmF0ZWRSb3V0ZS5vdXRsZXQ7XG4gICAgcHJveHkuY29tcG9uZW50ID0gYWN0aXZhdGVkUm91dGUuY29tcG9uZW50O1xuXG4gICAgdGhpcy5jdXJyZW50QWN0aXZhdGVkUm91dGUkLm5leHQoeyBjb21wb25lbnQsIGFjdGl2YXRlZFJvdXRlIH0pO1xuICB9XG59XG5cbmNsYXNzIE91dGxldEluamVjdG9yIGltcGxlbWVudHMgSW5qZWN0b3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBwcml2YXRlIGNoaWxkQ29udGV4dHM6IENoaWxkcmVuT3V0bGV0Q29udGV4dHMsXG4gICAgcHJpdmF0ZSBwYXJlbnQ6IEluamVjdG9yXG4gICkgeyB9XG5cbiAgZ2V0KHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU/OiBhbnkpOiBhbnkge1xuICAgIGlmICh0b2tlbiA9PT0gQWN0aXZhdGVkUm91dGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJvdXRlO1xuICAgIH1cblxuICAgIGlmICh0b2tlbiA9PT0gQ2hpbGRyZW5PdXRsZXRDb250ZXh0cykge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRDb250ZXh0cztcbiAgICB9XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0KHRva2VuLCBub3RGb3VuZFZhbHVlKTtcbiAgfVxufVxuIl19