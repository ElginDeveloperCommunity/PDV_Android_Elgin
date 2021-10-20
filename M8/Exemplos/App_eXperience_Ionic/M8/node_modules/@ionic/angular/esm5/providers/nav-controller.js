import * as tslib_1 from "tslib";
import { Location } from '@angular/common';
import { Injectable, Optional } from '@angular/core';
import { NavigationExtras, NavigationStart, Router, UrlSerializer, UrlTree } from '@angular/router';
import { Platform } from './platform';
import * as i0 from "@angular/core";
import * as i1 from "./platform";
import * as i2 from "@angular/common";
import * as i3 from "@angular/router";
var NavController = /** @class */ (function () {
    function NavController(platform, location, serializer, router) {
        var _this = this;
        this.location = location;
        this.serializer = serializer;
        this.router = router;
        this.direction = DEFAULT_DIRECTION;
        this.animated = DEFAULT_ANIMATED;
        this.guessDirection = 'forward';
        this.lastNavId = -1;
        // Subscribe to router events to detect direction
        if (router) {
            router.events.subscribe(function (ev) {
                if (ev instanceof NavigationStart) {
                    var id = (ev.restoredState) ? ev.restoredState.navigationId : ev.id;
                    _this.guessDirection = id < _this.lastNavId ? 'back' : 'forward';
                    _this.guessAnimation = !ev.restoredState ? _this.guessDirection : undefined;
                    _this.lastNavId = _this.guessDirection === 'forward' ? ev.id : id;
                }
            });
        }
        // Subscribe to backButton events
        platform.backButton.subscribeWithPriority(0, function (processNextHandler) {
            _this.pop();
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
    NavController.prototype.navigateForward = function (url, options) {
        if (options === void 0) { options = {}; }
        this.setDirection('forward', options.animated, options.animationDirection, options.animation);
        return this.navigate(url, options);
    };
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
    NavController.prototype.navigateBack = function (url, options) {
        if (options === void 0) { options = {}; }
        this.setDirection('back', options.animated, options.animationDirection, options.animation);
        return this.navigate(url, options);
    };
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
    NavController.prototype.navigateRoot = function (url, options) {
        if (options === void 0) { options = {}; }
        this.setDirection('root', options.animated, options.animationDirection, options.animation);
        return this.navigate(url, options);
    };
    /**
     * Same as [Location](https://angular.io/api/common/Location)'s back() method.
     * It will use the standard `window.history.back()` under the hood, but featuring a `back` animation
     * by default.
     */
    NavController.prototype.back = function (options) {
        if (options === void 0) { options = { animated: true, animationDirection: 'back' }; }
        this.setDirection('back', options.animated, options.animationDirection, options.animation);
        return this.location.back();
    };
    /**
     * This methods goes back in the context of Ionic's stack navigation.
     *
     * It recursively finds the top active `ion-router-outlet` and calls `pop()`.
     * This is the recommended way to go back when you are using `ion-router-outlet`.
     */
    NavController.prototype.pop = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var outlet;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        outlet = this.topOutlet;
                        _a.label = 1;
                    case 1:
                        if (!outlet) return [3 /*break*/, 3];
                        return [4 /*yield*/, outlet.pop()];
                    case 2:
                        if (_a.sent()) {
                            return [3 /*break*/, 3];
                        }
                        else {
                            outlet = outlet.parentOutlet;
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This methods specifies the direction of the next navigation performed by the Angular router.
     *
     * `setDirection()` does not trigger any transition, it just sets some flags to be consumed by `ion-router-outlet`.
     *
     * It's recommended to use `navigateForward()`, `navigateBack()` and `navigateRoot()` instead of `setDirection()`.
     */
    NavController.prototype.setDirection = function (direction, animated, animationDirection, animationBuilder) {
        this.direction = direction;
        this.animated = getAnimation(direction, animated, animationDirection);
        this.animationBuilder = animationBuilder;
    };
    /**
     * @internal
     */
    NavController.prototype.setTopOutlet = function (outlet) {
        this.topOutlet = outlet;
    };
    /**
     * @internal
     */
    NavController.prototype.consumeTransition = function () {
        var direction = 'root';
        var animation;
        var animationBuilder = this.animationBuilder;
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
            direction: direction,
            animation: animation,
            animationBuilder: animationBuilder
        };
    };
    NavController.prototype.navigate = function (url, options) {
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
            var urlTree = this.serializer.parse(url.toString());
            if (options.queryParams !== undefined) {
                urlTree.queryParams = tslib_1.__assign({}, options.queryParams);
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
    };
    NavController.ctorParameters = function () { return [
        { type: Platform },
        { type: Location },
        { type: UrlSerializer },
        { type: Router, decorators: [{ type: Optional }] }
    ]; };
    NavController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function NavController_Factory() { return new NavController(i0.ɵɵinject(i1.Platform), i0.ɵɵinject(i2.Location), i0.ɵɵinject(i3.UrlSerializer), i0.ɵɵinject(i3.Router, 8)); }, token: NavController, providedIn: "root" });
    NavController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root',
        }),
        tslib_1.__param(3, Optional())
    ], NavController);
    return NavController;
}());
export { NavController };
var getAnimation = function (direction, animated, animationDirection) {
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
var ɵ0 = getAnimation;
var DEFAULT_DIRECTION = 'auto';
var DEFAULT_ANIMATED = undefined;
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbInByb3ZpZGVycy9uYXYtY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUtwRyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sWUFBWSxDQUFDOzs7OztBQWF0QztJQVVFLHVCQUNFLFFBQWtCLEVBQ1YsUUFBa0IsRUFDbEIsVUFBeUIsRUFDYixNQUFlO1FBSnJDLGlCQXVCQztRQXJCUyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQWU7UUFDYixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBWDdCLGNBQVMsR0FBeUMsaUJBQWlCLENBQUM7UUFDcEUsYUFBUSxHQUFrQixnQkFBZ0IsQ0FBQztRQUUzQyxtQkFBYyxHQUFvQixTQUFTLENBQUM7UUFFNUMsY0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBUXJCLGlEQUFpRDtRQUNqRCxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsRUFBRTtnQkFDeEIsSUFBSSxFQUFFLFlBQVksZUFBZSxFQUFFO29CQUNqQyxJQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ3RFLEtBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxHQUFHLEtB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Q3BELE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyxDQUFDOztBQUVGLElBQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDO0FBQ2pDLElBQU0sZ0JBQWdCLEdBQUcsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5hdmlnYXRpb25FeHRyYXMsIE5hdmlnYXRpb25TdGFydCwgUm91dGVyLCBVcmxTZXJpYWxpemVyLCBVcmxUcmVlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEFuaW1hdGlvbkJ1aWxkZXIsIE5hdkRpcmVjdGlvbiwgUm91dGVyRGlyZWN0aW9uIH0gZnJvbSAnQGlvbmljL2NvcmUnO1xuXG5pbXBvcnQgeyBJb25Sb3V0ZXJPdXRsZXQgfSBmcm9tICcuLi9kaXJlY3RpdmVzL25hdmlnYXRpb24vaW9uLXJvdXRlci1vdXRsZXQnO1xuXG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJy4vcGxhdGZvcm0nO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGlvbk9wdGlvbnMge1xuICBhbmltYXRlZD86IGJvb2xlYW47XG4gIGFuaW1hdGlvbj86IEFuaW1hdGlvbkJ1aWxkZXI7XG4gIGFuaW1hdGlvbkRpcmVjdGlvbj86ICdmb3J3YXJkJyB8ICdiYWNrJztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOYXZpZ2F0aW9uT3B0aW9ucyBleHRlbmRzIE5hdmlnYXRpb25FeHRyYXMsIEFuaW1hdGlvbk9wdGlvbnMge31cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIE5hdkNvbnRyb2xsZXIge1xuXG4gIHByaXZhdGUgdG9wT3V0bGV0PzogSW9uUm91dGVyT3V0bGV0O1xuICBwcml2YXRlIGRpcmVjdGlvbjogJ2ZvcndhcmQnIHwgJ2JhY2snIHwgJ3Jvb3QnIHwgJ2F1dG8nID0gREVGQVVMVF9ESVJFQ1RJT047XG4gIHByaXZhdGUgYW5pbWF0ZWQ/OiBOYXZEaXJlY3Rpb24gPSBERUZBVUxUX0FOSU1BVEVEO1xuICBwcml2YXRlIGFuaW1hdGlvbkJ1aWxkZXI/OiBBbmltYXRpb25CdWlsZGVyO1xuICBwcml2YXRlIGd1ZXNzRGlyZWN0aW9uOiBSb3V0ZXJEaXJlY3Rpb24gPSAnZm9yd2FyZCc7XG4gIHByaXZhdGUgZ3Vlc3NBbmltYXRpb24/OiBOYXZEaXJlY3Rpb247XG4gIHByaXZhdGUgbGFzdE5hdklkID0gLTE7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uLFxuICAgIHByaXZhdGUgc2VyaWFsaXplcjogVXJsU2VyaWFsaXplcixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIHJvdXRlcj86IFJvdXRlcixcbiAgKSB7XG4gICAgLy8gU3Vic2NyaWJlIHRvIHJvdXRlciBldmVudHMgdG8gZGV0ZWN0IGRpcmVjdGlvblxuICAgIGlmIChyb3V0ZXIpIHtcbiAgICAgIHJvdXRlci5ldmVudHMuc3Vic2NyaWJlKGV2ID0+IHtcbiAgICAgICAgaWYgKGV2IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICAgICAgY29uc3QgaWQgPSAoZXYucmVzdG9yZWRTdGF0ZSkgPyBldi5yZXN0b3JlZFN0YXRlLm5hdmlnYXRpb25JZCA6IGV2LmlkO1xuICAgICAgICAgIHRoaXMuZ3Vlc3NEaXJlY3Rpb24gPSBpZCA8IHRoaXMubGFzdE5hdklkID8gJ2JhY2snIDogJ2ZvcndhcmQnO1xuICAgICAgICAgIHRoaXMuZ3Vlc3NBbmltYXRpb24gPSAhZXYucmVzdG9yZWRTdGF0ZSA/IHRoaXMuZ3Vlc3NEaXJlY3Rpb24gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgdGhpcy5sYXN0TmF2SWQgPSB0aGlzLmd1ZXNzRGlyZWN0aW9uID09PSAnZm9yd2FyZCcgPyBldi5pZCA6IGlkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTdWJzY3JpYmUgdG8gYmFja0J1dHRvbiBldmVudHNcbiAgICBwbGF0Zm9ybS5iYWNrQnV0dG9uLnN1YnNjcmliZVdpdGhQcmlvcml0eSgwLCBwcm9jZXNzTmV4dEhhbmRsZXIgPT4ge1xuICAgICAgdGhpcy5wb3AoKTtcbiAgICAgIHByb2Nlc3NOZXh0SGFuZGxlcigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHVzZXMgQW5ndWxhcidzIFtSb3V0ZXJdKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvcm91dGVyL1JvdXRlcikgdW5kZXIgdGhlIGhvb2QsXG4gICAqIGl0J3MgZXF1aXZhbGVudCB0byBjYWxsaW5nIGB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKClgLCBidXQgaXQncyBleHBsaWNpdCBhYm91dCB0aGUgKipkaXJlY3Rpb24qKiBvZiB0aGUgdHJhbnNpdGlvbi5cbiAgICpcbiAgICogR29pbmcgKipmb3J3YXJkKiogbWVhbnMgdGhhdCBhIG5ldyBwYWdlIGlzIGdvaW5nIHRvIGJlIHB1c2hlZCB0byB0aGUgc3RhY2sgb2YgdGhlIG91dGxldCAoaW9uLXJvdXRlci1vdXRsZXQpLFxuICAgKiBhbmQgdGhhdCBpdCB3aWxsIHNob3cgYSBcImZvcndhcmRcIiBhbmltYXRpb24gYnkgZGVmYXVsdC5cbiAgICpcbiAgICogTmF2aWdhdGluZyBmb3J3YXJkIGNhbiBhbHNvIGJlIHRyaWdnZXJlZCBpbiBhIGRlY2xhcmF0aXZlIG1hbm5lciBieSB1c2luZyB0aGUgYFtyb3V0ZXJEaXJlY3Rpb25dYCBkaXJlY3RpdmU6XG4gICAqXG4gICAqIGBgYGh0bWxcbiAgICogPGEgcm91dGVyTGluaz1cIi9wYXRoL3RvL3BhZ2VcIiByb3V0ZXJEaXJlY3Rpb249XCJmb3J3YXJkXCI+TGluazwvYT5cbiAgICogYGBgXG4gICAqL1xuICBuYXZpZ2F0ZUZvcndhcmQodXJsOiBzdHJpbmcgfCBVcmxUcmVlIHwgYW55W10sIG9wdGlvbnM6IE5hdmlnYXRpb25PcHRpb25zID0ge30pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0aGlzLnNldERpcmVjdGlvbignZm9yd2FyZCcsIG9wdGlvbnMuYW5pbWF0ZWQsIG9wdGlvbnMuYW5pbWF0aW9uRGlyZWN0aW9uLCBvcHRpb25zLmFuaW1hdGlvbik7XG4gICAgcmV0dXJuIHRoaXMubmF2aWdhdGUodXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB1c2VzIEFuZ3VsYXIncyBbUm91dGVyXShodHRwczovL2FuZ3VsYXIuaW8vYXBpL3JvdXRlci9Sb3V0ZXIpIHVuZGVyIHRoZSBob29kLFxuICAgKiBpdCdzIGVxdWl2YWxlbnQgdG8gY2FsbGluZzpcbiAgICpcbiAgICogYGBgdHNcbiAgICogdGhpcy5uYXZDb250cm9sbGVyLnNldERpcmVjdGlvbignYmFjaycpO1xuICAgKiB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHBhdGgpO1xuICAgKiBgYGBcbiAgICpcbiAgICogR29pbmcgKipiYWNrKiogbWVhbnMgdGhhdCBhbGwgdGhlIHBhZ2VzIGluIHRoZSBzdGFjayB1bnRpbCB0aGUgbmF2aWdhdGVkIHBhZ2UgaXMgZm91bmQgd2lsbCBiZSBwb3BwZWQsXG4gICAqIGFuZCB0aGF0IGl0IHdpbGwgc2hvdyBhIFwiYmFja1wiIGFuaW1hdGlvbiBieSBkZWZhdWx0LlxuICAgKlxuICAgKiBOYXZpZ2F0aW5nIGJhY2sgY2FuIGFsc28gYmUgdHJpZ2dlcmVkIGluIGEgZGVjbGFyYXRpdmUgbWFubmVyIGJ5IHVzaW5nIHRoZSBgW3JvdXRlckRpcmVjdGlvbl1gIGRpcmVjdGl2ZTpcbiAgICpcbiAgICogYGBgaHRtbFxuICAgKiA8YSByb3V0ZXJMaW5rPVwiL3BhdGgvdG8vcGFnZVwiIHJvdXRlckRpcmVjdGlvbj1cImJhY2tcIj5MaW5rPC9hPlxuICAgKiBgYGBcbiAgICovXG4gIG5hdmlnYXRlQmFjayh1cmw6IHN0cmluZyB8IFVybFRyZWUgfCBhbnlbXSwgb3B0aW9uczogTmF2aWdhdGlvbk9wdGlvbnMgPSB7fSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRoaXMuc2V0RGlyZWN0aW9uKCdiYWNrJywgb3B0aW9ucy5hbmltYXRlZCwgb3B0aW9ucy5hbmltYXRpb25EaXJlY3Rpb24sIG9wdGlvbnMuYW5pbWF0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5uYXZpZ2F0ZSh1cmwsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHVzZXMgQW5ndWxhcidzIFtSb3V0ZXJdKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvcm91dGVyL1JvdXRlcikgdW5kZXIgdGhlIGhvb2QsXG4gICAqIGl0J3MgZXF1aXZhbGVudCB0byBjYWxsaW5nOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiB0aGlzLm5hdkNvbnRyb2xsZXIuc2V0RGlyZWN0aW9uKCdyb290Jyk7XG4gICAqIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwocGF0aCk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBHb2luZyAqKnJvb3QqKiBtZWFucyB0aGF0IGFsbCBleGlzdGluZyBwYWdlcyBpbiB0aGUgc3RhY2sgd2lsbCBiZSByZW1vdmVkLFxuICAgKiBhbmQgdGhlIG5hdmlnYXRlZCBwYWdlIHdpbGwgYmVjb21lIHRoZSBzaW5nbGUgcGFnZSBpbiB0aGUgc3RhY2suXG4gICAqXG4gICAqIE5hdmlnYXRpbmcgcm9vdCBjYW4gYWxzbyBiZSB0cmlnZ2VyZWQgaW4gYSBkZWNsYXJhdGl2ZSBtYW5uZXIgYnkgdXNpbmcgdGhlIGBbcm91dGVyRGlyZWN0aW9uXWAgZGlyZWN0aXZlOlxuICAgKlxuICAgKiBgYGBodG1sXG4gICAqIDxhIHJvdXRlckxpbms9XCIvcGF0aC90by9wYWdlXCIgcm91dGVyRGlyZWN0aW9uPVwicm9vdFwiPkxpbms8L2E+XG4gICAqIGBgYFxuICAgKi9cbiAgbmF2aWdhdGVSb290KHVybDogc3RyaW5nIHwgVXJsVHJlZSB8IGFueVtdLCBvcHRpb25zOiBOYXZpZ2F0aW9uT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdGhpcy5zZXREaXJlY3Rpb24oJ3Jvb3QnLCBvcHRpb25zLmFuaW1hdGVkLCBvcHRpb25zLmFuaW1hdGlvbkRpcmVjdGlvbiwgb3B0aW9ucy5hbmltYXRpb24pO1xuICAgIHJldHVybiB0aGlzLm5hdmlnYXRlKHVybCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2FtZSBhcyBbTG9jYXRpb25dKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvY29tbW9uL0xvY2F0aW9uKSdzIGJhY2soKSBtZXRob2QuXG4gICAqIEl0IHdpbGwgdXNlIHRoZSBzdGFuZGFyZCBgd2luZG93Lmhpc3RvcnkuYmFjaygpYCB1bmRlciB0aGUgaG9vZCwgYnV0IGZlYXR1cmluZyBhIGBiYWNrYCBhbmltYXRpb25cbiAgICogYnkgZGVmYXVsdC5cbiAgICovXG4gIGJhY2sob3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucyA9IHsgYW5pbWF0ZWQ6IHRydWUsIGFuaW1hdGlvbkRpcmVjdGlvbjogJ2JhY2snIH0pIHtcbiAgICB0aGlzLnNldERpcmVjdGlvbignYmFjaycsIG9wdGlvbnMuYW5pbWF0ZWQsIG9wdGlvbnMuYW5pbWF0aW9uRGlyZWN0aW9uLCBvcHRpb25zLmFuaW1hdGlvbik7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRpb24uYmFjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kcyBnb2VzIGJhY2sgaW4gdGhlIGNvbnRleHQgb2YgSW9uaWMncyBzdGFjayBuYXZpZ2F0aW9uLlxuICAgKlxuICAgKiBJdCByZWN1cnNpdmVseSBmaW5kcyB0aGUgdG9wIGFjdGl2ZSBgaW9uLXJvdXRlci1vdXRsZXRgIGFuZCBjYWxscyBgcG9wKClgLlxuICAgKiBUaGlzIGlzIHRoZSByZWNvbW1lbmRlZCB3YXkgdG8gZ28gYmFjayB3aGVuIHlvdSBhcmUgdXNpbmcgYGlvbi1yb3V0ZXItb3V0bGV0YC5cbiAgICovXG4gIGFzeW5jIHBvcCgpIHtcbiAgICBsZXQgb3V0bGV0ID0gdGhpcy50b3BPdXRsZXQ7XG5cbiAgICB3aGlsZSAob3V0bGV0KSB7XG4gICAgICBpZiAoYXdhaXQgb3V0bGV0LnBvcCgpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0bGV0ID0gb3V0bGV0LnBhcmVudE91dGxldDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2RzIHNwZWNpZmllcyB0aGUgZGlyZWN0aW9uIG9mIHRoZSBuZXh0IG5hdmlnYXRpb24gcGVyZm9ybWVkIGJ5IHRoZSBBbmd1bGFyIHJvdXRlci5cbiAgICpcbiAgICogYHNldERpcmVjdGlvbigpYCBkb2VzIG5vdCB0cmlnZ2VyIGFueSB0cmFuc2l0aW9uLCBpdCBqdXN0IHNldHMgc29tZSBmbGFncyB0byBiZSBjb25zdW1lZCBieSBgaW9uLXJvdXRlci1vdXRsZXRgLlxuICAgKlxuICAgKiBJdCdzIHJlY29tbWVuZGVkIHRvIHVzZSBgbmF2aWdhdGVGb3J3YXJkKClgLCBgbmF2aWdhdGVCYWNrKClgIGFuZCBgbmF2aWdhdGVSb290KClgIGluc3RlYWQgb2YgYHNldERpcmVjdGlvbigpYC5cbiAgICovXG4gIHNldERpcmVjdGlvbihkaXJlY3Rpb246IFJvdXRlckRpcmVjdGlvbiwgYW5pbWF0ZWQ/OiBib29sZWFuLCBhbmltYXRpb25EaXJlY3Rpb24/OiAnZm9yd2FyZCcgfCAnYmFjaycsIGFuaW1hdGlvbkJ1aWxkZXI/OiBBbmltYXRpb25CdWlsZGVyKSB7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgdGhpcy5hbmltYXRlZCA9IGdldEFuaW1hdGlvbihkaXJlY3Rpb24sIGFuaW1hdGVkLCBhbmltYXRpb25EaXJlY3Rpb24pO1xuICAgIHRoaXMuYW5pbWF0aW9uQnVpbGRlciA9IGFuaW1hdGlvbkJ1aWxkZXI7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBzZXRUb3BPdXRsZXQob3V0bGV0OiBJb25Sb3V0ZXJPdXRsZXQpIHtcbiAgICB0aGlzLnRvcE91dGxldCA9IG91dGxldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGNvbnN1bWVUcmFuc2l0aW9uKCkge1xuICAgIGxldCBkaXJlY3Rpb246IFJvdXRlckRpcmVjdGlvbiA9ICdyb290JztcbiAgICBsZXQgYW5pbWF0aW9uOiBOYXZEaXJlY3Rpb24gfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgYW5pbWF0aW9uQnVpbGRlciA9IHRoaXMuYW5pbWF0aW9uQnVpbGRlcjtcblxuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gJ2F1dG8nKSB7XG4gICAgICBkaXJlY3Rpb24gPSB0aGlzLmd1ZXNzRGlyZWN0aW9uO1xuICAgICAgYW5pbWF0aW9uID0gdGhpcy5ndWVzc0FuaW1hdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgYW5pbWF0aW9uID0gdGhpcy5hbmltYXRlZDtcbiAgICAgIGRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uO1xuICAgIH1cbiAgICB0aGlzLmRpcmVjdGlvbiA9IERFRkFVTFRfRElSRUNUSU9OO1xuICAgIHRoaXMuYW5pbWF0ZWQgPSBERUZBVUxUX0FOSU1BVEVEO1xuICAgIHRoaXMuYW5pbWF0aW9uQnVpbGRlciA9IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiB7XG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBhbmltYXRpb24sXG4gICAgICBhbmltYXRpb25CdWlsZGVyXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbmF2aWdhdGUodXJsOiBzdHJpbmcgfCBVcmxUcmVlIHwgYW55W10sIG9wdGlvbnM6IE5hdmlnYXRpb25PcHRpb25zKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodXJsKSkge1xuICAgICAgcmV0dXJuIHRoaXMucm91dGVyIS5uYXZpZ2F0ZSh1cmwsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogbmF2aWdhdGVCeVVybCBpZ25vcmVzIGFueSBwcm9wZXJ0aWVzIHRoYXRcbiAgICAgICAqIHdvdWxkIGNoYW5nZSB0aGUgdXJsLCBzbyB0aGluZ3MgbGlrZSBxdWVyeVBhcmFtc1xuICAgICAgICogd291bGQgYmUgaWdub3JlZCB1bmxlc3Mgd2UgY3JlYXRlIGEgdXJsIHRyZWVcbiAgICAgICAqIE1vcmUgSW5mbzogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTg3OThcbiAgICAgICAqL1xuICAgICAgY29uc3QgdXJsVHJlZSA9IHRoaXMuc2VyaWFsaXplci5wYXJzZSh1cmwudG9TdHJpbmcoKSk7XG5cbiAgICAgIGlmIChvcHRpb25zLnF1ZXJ5UGFyYW1zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdXJsVHJlZS5xdWVyeVBhcmFtcyA9IHsgLi4ub3B0aW9ucy5xdWVyeVBhcmFtcyB9O1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5mcmFnbWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHVybFRyZWUuZnJhZ21lbnQgPSBvcHRpb25zLmZyYWdtZW50O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIGBuYXZpZ2F0ZUJ5VXJsYCB3aWxsIHN0aWxsIGFwcGx5IGBOYXZpZ2F0aW9uRXh0cmFzYCBwcm9wZXJ0aWVzXG4gICAgICAgKiB0aGF0IGRvIG5vdCBtb2RpZnkgdGhlIHVybCwgc3VjaCBhcyBgcmVwbGFjZVVybGAgd2hpY2ggaXMgd2h5XG4gICAgICAgKiBgb3B0aW9uc2AgaXMgcGFzc2VkIGluIGhlcmUuXG4gICAgICAgKi9cbiAgICAgIHJldHVybiB0aGlzLnJvdXRlciEubmF2aWdhdGVCeVVybCh1cmxUcmVlLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZ2V0QW5pbWF0aW9uID0gKGRpcmVjdGlvbjogUm91dGVyRGlyZWN0aW9uLCBhbmltYXRlZDogYm9vbGVhbiB8IHVuZGVmaW5lZCwgYW5pbWF0aW9uRGlyZWN0aW9uOiAnZm9yd2FyZCcgfCAnYmFjaycgfCB1bmRlZmluZWQpOiBOYXZEaXJlY3Rpb24gfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoYW5pbWF0ZWQgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoYW5pbWF0aW9uRGlyZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gYW5pbWF0aW9uRGlyZWN0aW9uO1xuICB9XG4gIGlmIChkaXJlY3Rpb24gPT09ICdmb3J3YXJkJyB8fCBkaXJlY3Rpb24gPT09ICdiYWNrJykge1xuICAgIHJldHVybiBkaXJlY3Rpb247XG4gIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncm9vdCcgJiYgYW5pbWF0ZWQgPT09IHRydWUpIHtcbiAgICByZXR1cm4gJ2ZvcndhcmQnO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5jb25zdCBERUZBVUxUX0RJUkVDVElPTiA9ICdhdXRvJztcbmNvbnN0IERFRkFVTFRfQU5JTUFURUQgPSB1bmRlZmluZWQ7XG4iXX0=