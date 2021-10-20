import * as tslib_1 from "tslib";
import { Location } from '@angular/common';
import { Injectable, Optional } from '@angular/core';
import { NavigationExtras, NavigationStart, Router, UrlSerializer, UrlTree } from '@angular/router';
import { Platform } from './platform';
import * as i0 from "@angular/core";
import * as i1 from "./platform";
import * as i2 from "@angular/common";
import * as i3 from "@angular/router";
let NavController = class NavController {
    constructor(platform, location, serializer, router) {
        this.location = location;
        this.serializer = serializer;
        this.router = router;
        this.direction = DEFAULT_DIRECTION;
        this.animated = DEFAULT_ANIMATED;
        this.guessDirection = 'forward';
        this.lastNavId = -1;
        // Subscribe to router events to detect direction
        if (router) {
            router.events.subscribe(ev => {
                if (ev instanceof NavigationStart) {
                    const id = (ev.restoredState) ? ev.restoredState.navigationId : ev.id;
                    this.guessDirection = id < this.lastNavId ? 'back' : 'forward';
                    this.guessAnimation = !ev.restoredState ? this.guessDirection : undefined;
                    this.lastNavId = this.guessDirection === 'forward' ? ev.id : id;
                }
            });
        }
        // Subscribe to backButton events
        platform.backButton.subscribeWithPriority(0, processNextHandler => {
            this.pop();
            processNextHandler();
        });
    }
    /**
     * This method uses Angular's [Router](https://angular.io/api/router/Router) under the hood,
     * it's equivalent to calling `this.router.navigateByUrl()`, but it's explicit about the **direction** of the transition.
     *
     * Going **forward** means that a new page is going to be pushed to the stack of the outlet (ion-router-outlet),
     * and that it will show a "forward" animation by default.
     *
     * Navigating forward can also be triggered in a declarative manner by using the `[routerDirection]` directive:
     *
     * ```html
     * <a routerLink="/path/to/page" routerDirection="forward">Link</a>
     * ```
     */
    navigateForward(url, options = {}) {
        this.setDirection('forward', options.animated, options.animationDirection, options.animation);
        return this.navigate(url, options);
    }
    /**
     * This method uses Angular's [Router](https://angular.io/api/router/Router) under the hood,
     * it's equivalent to calling:
     *
     * ```ts
     * this.navController.setDirection('back');
     * this.router.navigateByUrl(path);
     * ```
     *
     * Going **back** means that all the pages in the stack until the navigated page is found will be popped,
     * and that it will show a "back" animation by default.
     *
     * Navigating back can also be triggered in a declarative manner by using the `[routerDirection]` directive:
     *
     * ```html
     * <a routerLink="/path/to/page" routerDirection="back">Link</a>
     * ```
     */
    navigateBack(url, options = {}) {
        this.setDirection('back', options.animated, options.animationDirection, options.animation);
        return this.navigate(url, options);
    }
    /**
     * This method uses Angular's [Router](https://angular.io/api/router/Router) under the hood,
     * it's equivalent to calling:
     *
     * ```ts
     * this.navController.setDirection('root');
     * this.router.navigateByUrl(path);
     * ```
     *
     * Going **root** means that all existing pages in the stack will be removed,
     * and the navigated page will become the single page in the stack.
     *
     * Navigating root can also be triggered in a declarative manner by using the `[routerDirection]` directive:
     *
     * ```html
     * <a routerLink="/path/to/page" routerDirection="root">Link</a>
     * ```
     */
    navigateRoot(url, options = {}) {
        this.setDirection('root', options.animated, options.animationDirection, options.animation);
        return this.navigate(url, options);
    }
    /**
     * Same as [Location](https://angular.io/api/common/Location)'s back() method.
     * It will use the standard `window.history.back()` under the hood, but featuring a `back` animation
     * by default.
     */
    back(options = { animated: true, animationDirection: 'back' }) {
        this.setDirection('back', options.animated, options.animationDirection, options.animation);
        return this.location.back();
    }
    /**
     * This methods goes back in the context of Ionic's stack navigation.
     *
     * It recursively finds the top active `ion-router-outlet` and calls `pop()`.
     * This is the recommended way to go back when you are using `ion-router-outlet`.
     */
    pop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let outlet = this.topOutlet;
            while (outlet) {
                if (yield outlet.pop()) {
                    break;
                }
                else {
                    outlet = outlet.parentOutlet;
                }
            }
        });
    }
    /**
     * This methods specifies the direction of the next navigation performed by the Angular router.
     *
     * `setDirection()` does not trigger any transition, it just sets some flags to be consumed by `ion-router-outlet`.
     *
     * It's recommended to use `navigateForward()`, `navigateBack()` and `navigateRoot()` instead of `setDirection()`.
     */
    setDirection(direction, animated, animationDirection, animationBuilder) {
        this.direction = direction;
        this.animated = getAnimation(direction, animated, animationDirection);
        this.animationBuilder = animationBuilder;
    }
    /**
     * @internal
     */
    setTopOutlet(outlet) {
        this.topOutlet = outlet;
    }
    /**
     * @internal
     */
    consumeTransition() {
        let direction = 'root';
        let animation;
        const animationBuilder = this.animationBuilder;
        if (this.direction === 'auto') {
            direction = this.guessDirection;
            animation = this.guessAnimation;
        }
        else {
            animation = this.animated;
            direction = this.direction;
        }
        this.direction = DEFAULT_DIRECTION;
        this.animated = DEFAULT_ANIMATED;
        this.animationBuilder = undefined;
        return {
            direction,
            animation,
            animationBuilder
        };
    }
    navigate(url, options) {
        if (Array.isArray(url)) {
            return this.router.navigate(url, options);
        }
        else {
            /**
             * navigateByUrl ignores any properties that
             * would change the url, so things like queryParams
             * would be ignored unless we create a url tree
             * More Info: https://github.com/angular/angular/issues/18798
             */
            const urlTree = this.serializer.parse(url.toString());
            if (options.queryParams !== undefined) {
                urlTree.queryParams = Object.assign({}, options.queryParams);
            }
            if (options.fragment !== undefined) {
                urlTree.fragment = options.fragment;
            }
            /**
             * `navigateByUrl` will still apply `NavigationExtras` properties
             * that do not modify the url, such as `replaceUrl` which is why
             * `options` is passed in here.
             */
            return this.router.navigateByUrl(urlTree, options);
        }
    }
};
NavController.ctorParameters = () => [
    { type: Platform },
    { type: Location },
    { type: UrlSerializer },
    { type: Router, decorators: [{ type: Optional }] }
];
NavController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function NavController_Factory() { return new NavController(i0.ɵɵinject(i1.Platform), i0.ɵɵinject(i2.Location), i0.ɵɵinject(i3.UrlSerializer), i0.ɵɵinject(i3.Router, 8)); }, token: NavController, providedIn: "root" });
NavController = tslib_1.__decorate([
    Injectable({
        providedIn: 'root',
    }),
    tslib_1.__param(3, Optional())
], NavController);
export { NavController };
const getAnimation = (direction, animated, animationDirection) => {
    if (animated === false) {
        return undefined;
    }
    if (animationDirection !== undefined) {
        return animationDirection;
    }
    if (direction === 'forward' || direction === 'back') {
        return direction;
    }
    else if (direction === 'root' && animated === true) {
        return 'forward';
    }
    return undefined;
};
const ɵ0 = getAnimation;
const DEFAULT_DIRECTION = 'auto';
const DEFAULT_ANIMATED = undefined;
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbInByb3ZpZGVycy9uYXYtY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUtwRyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sWUFBWSxDQUFDOzs7OztBQWF0QyxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0lBVXhCLFlBQ0UsUUFBa0IsRUFDVixRQUFrQixFQUNsQixVQUF5QixFQUNiLE1BQWU7UUFGM0IsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixlQUFVLEdBQVYsVUFBVSxDQUFlO1FBQ2IsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQVg3QixjQUFTLEdBQXlDLGlCQUFpQixDQUFDO1FBQ3BFLGFBQVEsR0FBa0IsZ0JBQWdCLENBQUM7UUFFM0MsbUJBQWMsR0FBb0IsU0FBUyxDQUFDO1FBRTVDLGNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQVFyQixpREFBaUQ7UUFDakQsSUFBSSxNQUFNLEVBQUU7WUFDVixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxFQUFFLFlBQVksZUFBZSxFQUFFO29CQUNqQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ3RFLElBQUksQ0FBQyxjQUFj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ZXNDb250ZW50IjpbImltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uRXh0cmFzLCBOYXZpZ2F0aW9uU3RhcnQsIFJvdXRlciwgVXJsU2VyaWFsaXplciwgVXJsVHJlZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBBbmltYXRpb25CdWlsZGVyLCBOYXZEaXJlY3Rpb24sIFJvdXRlckRpcmVjdGlvbiB9IGZyb20gJ0Bpb25pYy9jb3JlJztcblxuaW1wb3J0IHsgSW9uUm91dGVyT3V0bGV0IH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9uYXZpZ2F0aW9uL2lvbi1yb3V0ZXItb3V0bGV0JztcblxuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICcuL3BsYXRmb3JtJztcblxuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25PcHRpb25zIHtcbiAgYW5pbWF0ZWQ/OiBib29sZWFuO1xuICBhbmltYXRpb24/OiBBbmltYXRpb25CdWlsZGVyO1xuICBhbmltYXRpb25EaXJlY3Rpb24/OiAnZm9yd2FyZCcgfCAnYmFjayc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmF2aWdhdGlvbk9wdGlvbnMgZXh0ZW5kcyBOYXZpZ2F0aW9uRXh0cmFzLCBBbmltYXRpb25PcHRpb25zIHt9XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBOYXZDb250cm9sbGVyIHtcblxuICBwcml2YXRlIHRvcE91dGxldD86IElvblJvdXRlck91dGxldDtcbiAgcHJpdmF0ZSBkaXJlY3Rpb246ICdmb3J3YXJkJyB8ICdiYWNrJyB8ICdyb290JyB8ICdhdXRvJyA9IERFRkFVTFRfRElSRUNUSU9OO1xuICBwcml2YXRlIGFuaW1hdGVkPzogTmF2RGlyZWN0aW9uID0gREVGQVVMVF9BTklNQVRFRDtcbiAgcHJpdmF0ZSBhbmltYXRpb25CdWlsZGVyPzogQW5pbWF0aW9uQnVpbGRlcjtcbiAgcHJpdmF0ZSBndWVzc0RpcmVjdGlvbjogUm91dGVyRGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xuICBwcml2YXRlIGd1ZXNzQW5pbWF0aW9uPzogTmF2RGlyZWN0aW9uO1xuICBwcml2YXRlIGxhc3ROYXZJZCA9IC0xO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbixcbiAgICBwcml2YXRlIHNlcmlhbGl6ZXI6IFVybFNlcmlhbGl6ZXIsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSByb3V0ZXI/OiBSb3V0ZXIsXG4gICkge1xuICAgIC8vIFN1YnNjcmliZSB0byByb3V0ZXIgZXZlbnRzIHRvIGRldGVjdCBkaXJlY3Rpb25cbiAgICBpZiAocm91dGVyKSB7XG4gICAgICByb3V0ZXIuZXZlbnRzLnN1YnNjcmliZShldiA9PiB7XG4gICAgICAgIGlmIChldiBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCkge1xuICAgICAgICAgIGNvbnN0IGlkID0gKGV2LnJlc3RvcmVkU3RhdGUpID8gZXYucmVzdG9yZWRTdGF0ZS5uYXZpZ2F0aW9uSWQgOiBldi5pZDtcbiAgICAgICAgICB0aGlzLmd1ZXNzRGlyZWN0aW9uID0gaWQgPCB0aGlzLmxhc3ROYXZJZCA/ICdiYWNrJyA6ICdmb3J3YXJkJztcbiAgICAgICAgICB0aGlzLmd1ZXNzQW5pbWF0aW9uID0gIWV2LnJlc3RvcmVkU3RhdGUgPyB0aGlzLmd1ZXNzRGlyZWN0aW9uIDogdW5kZWZpbmVkO1xuICAgICAgICAgIHRoaXMubGFzdE5hdklkID0gdGhpcy5ndWVzc0RpcmVjdGlvbiA9PT0gJ2ZvcndhcmQnID8gZXYuaWQgOiBpZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU3Vic2NyaWJlIHRvIGJhY2tCdXR0b24gZXZlbnRzXG4gICAgcGxhdGZvcm0uYmFja0J1dHRvbi5zdWJzY3JpYmVXaXRoUHJpb3JpdHkoMCwgcHJvY2Vzc05leHRIYW5kbGVyID0+IHtcbiAgICAgIHRoaXMucG9wKCk7XG4gICAgICBwcm9jZXNzTmV4dEhhbmRsZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB1c2VzIEFuZ3VsYXIncyBbUm91dGVyXShodHRwczovL2FuZ3VsYXIuaW8vYXBpL3JvdXRlci9Sb3V0ZXIpIHVuZGVyIHRoZSBob29kLFxuICAgKiBpdCdzIGVxdWl2YWxlbnQgdG8gY2FsbGluZyBgdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybCgpYCwgYnV0IGl0J3MgZXhwbGljaXQgYWJvdXQgdGhlICoqZGlyZWN0aW9uKiogb2YgdGhlIHRyYW5zaXRpb24uXG4gICAqXG4gICAqIEdvaW5nICoqZm9yd2FyZCoqIG1lYW5zIHRoYXQgYSBuZXcgcGFnZSBpcyBnb2luZyB0byBiZSBwdXNoZWQgdG8gdGhlIHN0YWNrIG9mIHRoZSBvdXRsZXQgKGlvbi1yb3V0ZXItb3V0bGV0KSxcbiAgICogYW5kIHRoYXQgaXQgd2lsbCBzaG93IGEgXCJmb3J3YXJkXCIgYW5pbWF0aW9uIGJ5IGRlZmF1bHQuXG4gICAqXG4gICAqIE5hdmlnYXRpbmcgZm9yd2FyZCBjYW4gYWxzbyBiZSB0cmlnZ2VyZWQgaW4gYSBkZWNsYXJhdGl2ZSBtYW5uZXIgYnkgdXNpbmcgdGhlIGBbcm91dGVyRGlyZWN0aW9uXWAgZGlyZWN0aXZlOlxuICAgKlxuICAgKiBgYGBodG1sXG4gICAqIDxhIHJvdXRlckxpbms9XCIvcGF0aC90by9wYWdlXCIgcm91dGVyRGlyZWN0aW9uPVwiZm9yd2FyZFwiPkxpbms8L2E+XG4gICAqIGBgYFxuICAgKi9cbiAgbmF2aWdhdGVGb3J3YXJkKHVybDogc3RyaW5nIHwgVXJsVHJlZSB8IGFueVtdLCBvcHRpb25zOiBOYXZpZ2F0aW9uT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdGhpcy5zZXREaXJlY3Rpb24oJ2ZvcndhcmQnLCBvcHRpb25zLmFuaW1hdGVkLCBvcHRpb25zLmFuaW1hdGlvbkRpcmVjdGlvbiwgb3B0aW9ucy5hbmltYXRpb24pO1xuICAgIHJldHVybiB0aGlzLm5hdmlnYXRlKHVybCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdXNlcyBBbmd1bGFyJ3MgW1JvdXRlcl0oaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9yb3V0ZXIvUm91dGVyKSB1bmRlciB0aGUgaG9vZCxcbiAgICogaXQncyBlcXVpdmFsZW50IHRvIGNhbGxpbmc6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIHRoaXMubmF2Q29udHJvbGxlci5zZXREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICogdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybChwYXRoKTtcbiAgICogYGBgXG4gICAqXG4gICAqIEdvaW5nICoqYmFjayoqIG1lYW5zIHRoYXQgYWxsIHRoZSBwYWdlcyBpbiB0aGUgc3RhY2sgdW50aWwgdGhlIG5hdmlnYXRlZCBwYWdlIGlzIGZvdW5kIHdpbGwgYmUgcG9wcGVkLFxuICAgKiBhbmQgdGhhdCBpdCB3aWxsIHNob3cgYSBcImJhY2tcIiBhbmltYXRpb24gYnkgZGVmYXVsdC5cbiAgICpcbiAgICogTmF2aWdhdGluZyBiYWNrIGNhbiBhbHNvIGJlIHRyaWdnZXJlZCBpbiBhIGRlY2xhcmF0aXZlIG1hbm5lciBieSB1c2luZyB0aGUgYFtyb3V0ZXJEaXJlY3Rpb25dYCBkaXJlY3RpdmU6XG4gICAqXG4gICAqIGBgYGh0bWxcbiAgICogPGEgcm91dGVyTGluaz1cIi9wYXRoL3RvL3BhZ2VcIiByb3V0ZXJEaXJlY3Rpb249XCJiYWNrXCI+TGluazwvYT5cbiAgICogYGBgXG4gICAqL1xuICBuYXZpZ2F0ZUJhY2sodXJsOiBzdHJpbmcgfCBVcmxUcmVlIHwgYW55W10sIG9wdGlvbnM6IE5hdmlnYXRpb25PcHRpb25zID0ge30pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0aGlzLnNldERpcmVjdGlvbignYmFjaycsIG9wdGlvbnMuYW5pbWF0ZWQsIG9wdGlvbnMuYW5pbWF0aW9uRGlyZWN0aW9uLCBvcHRpb25zLmFuaW1hdGlvbik7XG4gICAgcmV0dXJuIHRoaXMubmF2aWdhdGUodXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB1c2VzIEFuZ3VsYXIncyBbUm91dGVyXShodHRwczovL2FuZ3VsYXIuaW8vYXBpL3JvdXRlci9Sb3V0ZXIpIHVuZGVyIHRoZSBob29kLFxuICAgKiBpdCdzIGVxdWl2YWxlbnQgdG8gY2FsbGluZzpcbiAgICpcbiAgICogYGBgdHNcbiAgICogdGhpcy5uYXZDb250cm9sbGVyLnNldERpcmVjdGlvbigncm9vdCcpO1xuICAgKiB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHBhdGgpO1xuICAgKiBgYGBcbiAgICpcbiAgICogR29pbmcgKipyb290KiogbWVhbnMgdGhhdCBhbGwgZXhpc3RpbmcgcGFnZXMgaW4gdGhlIHN0YWNrIHdpbGwgYmUgcmVtb3ZlZCxcbiAgICogYW5kIHRoZSBuYXZpZ2F0ZWQgcGFnZSB3aWxsIGJlY29tZSB0aGUgc2luZ2xlIHBhZ2UgaW4gdGhlIHN0YWNrLlxuICAgKlxuICAgKiBOYXZpZ2F0aW5nIHJvb3QgY2FuIGFsc28gYmUgdHJpZ2dlcmVkIGluIGEgZGVjbGFyYXRpdmUgbWFubmVyIGJ5IHVzaW5nIHRoZSBgW3JvdXRlckRpcmVjdGlvbl1gIGRpcmVjdGl2ZTpcbiAgICpcbiAgICogYGBgaHRtbFxuICAgKiA8YSByb3V0ZXJMaW5rPVwiL3BhdGgvdG8vcGFnZVwiIHJvdXRlckRpcmVjdGlvbj1cInJvb3RcIj5MaW5rPC9hPlxuICAgKiBgYGBcbiAgICovXG4gIG5hdmlnYXRlUm9vdCh1cmw6IHN0cmluZyB8IFVybFRyZWUgfCBhbnlbXSwgb3B0aW9uczogTmF2aWdhdGlvbk9wdGlvbnMgPSB7fSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRoaXMuc2V0RGlyZWN0aW9uKCdyb290Jywgb3B0aW9ucy5hbmltYXRlZCwgb3B0aW9ucy5hbmltYXRpb25EaXJlY3Rpb24sIG9wdGlvbnMuYW5pbWF0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5uYXZpZ2F0ZSh1cmwsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhbWUgYXMgW0xvY2F0aW9uXShodHRwczovL2FuZ3VsYXIuaW8vYXBpL2NvbW1vbi9Mb2NhdGlvbikncyBiYWNrKCkgbWV0aG9kLlxuICAgKiBJdCB3aWxsIHVzZSB0aGUgc3RhbmRhcmQgYHdpbmRvdy5oaXN0b3J5LmJhY2soKWAgdW5kZXIgdGhlIGhvb2QsIGJ1dCBmZWF0dXJpbmcgYSBgYmFja2AgYW5pbWF0aW9uXG4gICAqIGJ5IGRlZmF1bHQuXG4gICAqL1xuICBiYWNrKG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMgPSB7IGFuaW1hdGVkOiB0cnVlLCBhbmltYXRpb25EaXJlY3Rpb246ICdiYWNrJyB9KSB7XG4gICAgdGhpcy5zZXREaXJlY3Rpb24oJ2JhY2snLCBvcHRpb25zLmFuaW1hdGVkLCBvcHRpb25zLmFuaW1hdGlvbkRpcmVjdGlvbiwgb3B0aW9ucy5hbmltYXRpb24pO1xuICAgIHJldHVybiB0aGlzLmxvY2F0aW9uLmJhY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZHMgZ29lcyBiYWNrIGluIHRoZSBjb250ZXh0IG9mIElvbmljJ3Mgc3RhY2sgbmF2aWdhdGlvbi5cbiAgICpcbiAgICogSXQgcmVjdXJzaXZlbHkgZmluZHMgdGhlIHRvcCBhY3RpdmUgYGlvbi1yb3V0ZXItb3V0bGV0YCBhbmQgY2FsbHMgYHBvcCgpYC5cbiAgICogVGhpcyBpcyB0aGUgcmVjb21tZW5kZWQgd2F5IHRvIGdvIGJhY2sgd2hlbiB5b3UgYXJlIHVzaW5nIGBpb24tcm91dGVyLW91dGxldGAuXG4gICAqL1xuICBhc3luYyBwb3AoKSB7XG4gICAgbGV0IG91dGxldCA9IHRoaXMudG9wT3V0bGV0O1xuXG4gICAgd2hpbGUgKG91dGxldCkge1xuICAgICAgaWYgKGF3YWl0IG91dGxldC5wb3AoKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dGxldCA9IG91dGxldC5wYXJlbnRPdXRsZXQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kcyBzcGVjaWZpZXMgdGhlIGRpcmVjdGlvbiBvZiB0aGUgbmV4dCBuYXZpZ2F0aW9uIHBlcmZvcm1lZCBieSB0aGUgQW5ndWxhciByb3V0ZXIuXG4gICAqXG4gICAqIGBzZXREaXJlY3Rpb24oKWAgZG9lcyBub3QgdHJpZ2dlciBhbnkgdHJhbnNpdGlvbiwgaXQganVzdCBzZXRzIHNvbWUgZmxhZ3MgdG8gYmUgY29uc3VtZWQgYnkgYGlvbi1yb3V0ZXItb3V0bGV0YC5cbiAgICpcbiAgICogSXQncyByZWNvbW1lbmRlZCB0byB1c2UgYG5hdmlnYXRlRm9yd2FyZCgpYCwgYG5hdmlnYXRlQmFjaygpYCBhbmQgYG5hdmlnYXRlUm9vdCgpYCBpbnN0ZWFkIG9mIGBzZXREaXJlY3Rpb24oKWAuXG4gICAqL1xuICBzZXREaXJlY3Rpb24oZGlyZWN0aW9uOiBSb3V0ZXJEaXJlY3Rpb24sIGFuaW1hdGVkPzogYm9vbGVhbiwgYW5pbWF0aW9uRGlyZWN0aW9uPzogJ2ZvcndhcmQnIHwgJ2JhY2snLCBhbmltYXRpb25CdWlsZGVyPzogQW5pbWF0aW9uQnVpbGRlcikge1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHRoaXMuYW5pbWF0ZWQgPSBnZXRBbmltYXRpb24oZGlyZWN0aW9uLCBhbmltYXRlZCwgYW5pbWF0aW9uRGlyZWN0aW9uKTtcbiAgICB0aGlzLmFuaW1hdGlvbkJ1aWxkZXIgPSBhbmltYXRpb25CdWlsZGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgc2V0VG9wT3V0bGV0KG91dGxldDogSW9uUm91dGVyT3V0bGV0KSB7XG4gICAgdGhpcy50b3BPdXRsZXQgPSBvdXRsZXQ7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBjb25zdW1lVHJhbnNpdGlvbigpIHtcbiAgICBsZXQgZGlyZWN0aW9uOiBSb3V0ZXJEaXJlY3Rpb24gPSAncm9vdCc7XG4gICAgbGV0IGFuaW1hdGlvbjogTmF2RGlyZWN0aW9uIHwgdW5kZWZpbmVkO1xuICAgIGNvbnN0IGFuaW1hdGlvbkJ1aWxkZXIgPSB0aGlzLmFuaW1hdGlvbkJ1aWxkZXI7XG5cbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdhdXRvJykge1xuICAgICAgZGlyZWN0aW9uID0gdGhpcy5ndWVzc0RpcmVjdGlvbjtcbiAgICAgIGFuaW1hdGlvbiA9IHRoaXMuZ3Vlc3NBbmltYXRpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIGFuaW1hdGlvbiA9IHRoaXMuYW5pbWF0ZWQ7XG4gICAgICBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbjtcbiAgICB9XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBERUZBVUxUX0RJUkVDVElPTjtcbiAgICB0aGlzLmFuaW1hdGVkID0gREVGQVVMVF9BTklNQVRFRDtcbiAgICB0aGlzLmFuaW1hdGlvbkJ1aWxkZXIgPSB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGlyZWN0aW9uLFxuICAgICAgYW5pbWF0aW9uLFxuICAgICAgYW5pbWF0aW9uQnVpbGRlclxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIG5hdmlnYXRlKHVybDogc3RyaW5nIHwgVXJsVHJlZSB8IGFueVtdLCBvcHRpb25zOiBOYXZpZ2F0aW9uT3B0aW9ucykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHVybCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnJvdXRlciEubmF2aWdhdGUodXJsLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuXG4gICAgICAvKipcbiAgICAgICAqIG5hdmlnYXRlQnlVcmwgaWdub3JlcyBhbnkgcHJvcGVydGllcyB0aGF0XG4gICAgICAgKiB3b3VsZCBjaGFuZ2UgdGhlIHVybCwgc28gdGhpbmdzIGxpa2UgcXVlcnlQYXJhbXNcbiAgICAgICAqIHdvdWxkIGJlIGlnbm9yZWQgdW5sZXNzIHdlIGNyZWF0ZSBhIHVybCB0cmVlXG4gICAgICAgKiBNb3JlIEluZm86IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE4Nzk4XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHVybFRyZWUgPSB0aGlzLnNlcmlhbGl6ZXIucGFyc2UodXJsLnRvU3RyaW5nKCkpO1xuXG4gICAgICBpZiAob3B0aW9ucy5xdWVyeVBhcmFtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHVybFRyZWUucXVlcnlQYXJhbXMgPSB7IC4uLm9wdGlvbnMucXVlcnlQYXJhbXMgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuZnJhZ21lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB1cmxUcmVlLmZyYWdtZW50ID0gb3B0aW9ucy5mcmFnbWVudDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBgbmF2aWdhdGVCeVVybGAgd2lsbCBzdGlsbCBhcHBseSBgTmF2aWdhdGlvbkV4dHJhc2AgcHJvcGVydGllc1xuICAgICAgICogdGhhdCBkbyBub3QgbW9kaWZ5IHRoZSB1cmwsIHN1Y2ggYXMgYHJlcGxhY2VVcmxgIHdoaWNoIGlzIHdoeVxuICAgICAgICogYG9wdGlvbnNgIGlzIHBhc3NlZCBpbiBoZXJlLlxuICAgICAgICovXG4gICAgICByZXR1cm4gdGhpcy5yb3V0ZXIhLm5hdmlnYXRlQnlVcmwodXJsVHJlZSwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGdldEFuaW1hdGlvbiA9IChkaXJlY3Rpb246IFJvdXRlckRpcmVjdGlvbiwgYW5pbWF0ZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQsIGFuaW1hdGlvbkRpcmVjdGlvbjogJ2ZvcndhcmQnIHwgJ2JhY2snIHwgdW5kZWZpbmVkKTogTmF2RGlyZWN0aW9uIHwgdW5kZWZpbmVkID0+IHtcbiAgaWYgKGFuaW1hdGVkID09PSBmYWxzZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKGFuaW1hdGlvbkRpcmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGFuaW1hdGlvbkRpcmVjdGlvbjtcbiAgfVxuICBpZiAoZGlyZWN0aW9uID09PSAnZm9yd2FyZCcgfHwgZGlyZWN0aW9uID09PSAnYmFjaycpIHtcbiAgICByZXR1cm4gZGlyZWN0aW9uO1xuICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3Jvb3QnICYmIGFuaW1hdGVkID09PSB0cnVlKSB7XG4gICAgcmV0dXJuICdmb3J3YXJkJztcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuY29uc3QgREVGQVVMVF9ESVJFQ1RJT04gPSAnYXV0byc7XG5jb25zdCBERUZBVUxUX0FOSU1BVEVEID0gdW5kZWZpbmVkO1xuIl19