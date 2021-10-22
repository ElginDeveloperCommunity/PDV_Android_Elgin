import * as tslib_1 from "tslib";
import { bindLifecycleEvents } from '../../providers/angular-delegate';
import { computeStackId, destroyView, getUrl, insertView, isTabSwitch, toSegments } from './stack-utils';
export class StackController {
    constructor(tabsPrefix, containerEl, router, navCtrl, zone, location) {
        this.containerEl = containerEl;
        this.router = router;
        this.navCtrl = navCtrl;
        this.zone = zone;
        this.location = location;
        this.views = [];
        this.skipTransition = false;
        this.nextId = 0;
        this.tabsPrefix = tabsPrefix !== undefined ? toSegments(tabsPrefix) : undefined;
    }
    createView(ref, activatedRoute) {
        const url = getUrl(this.router, activatedRoute);
        const element = (ref && ref.location && ref.location.nativeElement);
        const unlistenEvents = bindLifecycleEvents(this.zone, ref.instance, element);
        return {
            id: this.nextId++,
            stackId: computeStackId(this.tabsPrefix, url),
            unlistenEvents,
            element,
            ref,
            url,
        };
    }
    getExistingView(activatedRoute) {
        const activatedUrlKey = getUrl(this.router, activatedRoute);
        const view = this.views.find(vw => vw.url === activatedUrlKey);
        if (view) {
            view.ref.changeDetectorRef.reattach();
        }
        return view;
    }
    setActive(enteringView) {
        const consumeResult = this.navCtrl.consumeTransition();
        let { direction, animation, animationBuilder } = consumeResult;
        const leavingView = this.activeView;
        const tabSwitch = isTabSwitch(enteringView, leavingView);
        if (tabSwitch) {
            direction = 'back';
            animation = undefined;
        }
        const viewsSnapshot = this.views.slice();
        let currentNavigation;
        const router = this.router;
        // Angular >= 7.2.0
        if (router.getCurrentNavigation) {
            currentNavigation = router.getCurrentNavigation();
            // Angular < 7.2.0
        }
        else if (router.navigations &&
            router.navigations.value) {
            currentNavigation = router.navigations.value;
        }
        /**
         * If the navigation action
         * sets `replaceUrl: true`
         * then we need to make sure
         * we remove the last item
         * from our views stack
         */
        if (currentNavigation &&
            currentNavigation.extras &&
            currentNavigation.extras.replaceUrl) {
            if (this.views.length > 0) {
                this.views.splice(-1, 1);
            }
        }
        const reused = this.views.includes(enteringView);
        const views = this.insertView(enteringView, direction);
        // Trigger change detection before transition starts
        // This will call ngOnInit() the first time too, just after the view
        // was attached to the dom, but BEFORE the transition starts
        if (!reused) {
            enteringView.ref.changeDetectorRef.detectChanges();
        }
        /**
         * If we are going back from a page that
         * was presented using a custom animation
         * we should default to using that
         * unless the developer explicitly
         * provided another animation.
         */
        const customAnimation = enteringView.animationBuilder;
        if (animationBuilder === undefined &&
            direction === 'back' &&
            !tabSwitch &&
            customAnimation !== undefined) {
            animationBuilder = customAnimation;
        }
        /**
         * Save any custom animation so that navigating
         * back will use this custom animation by default.
         */
        if (leavingView) {
            leavingView.animationBuilder = animationBuilder;
        }
        // Wait until previous transitions finish
        return this.zone.runOutsideAngular(() => {
            return this.wait(() => {
                // disconnect leaving page from change detection to
                // reduce jank during the page transition
                if (leavingView) {
                    leavingView.ref.changeDetectorRef.detach();
                }
                // In case the enteringView is the same as the leavingPage we need to reattach()
                enteringView.ref.changeDetectorRef.reattach();
                return this.transition(enteringView, leavingView, animation, this.canGoBack(1), false, animationBuilder)
                    .then(() => cleanupAsync(enteringView, views, viewsSnapshot, this.location))
                    .then(() => ({
                    enteringView,
                    direction,
                    animation,
                    tabSwitch
                }));
            });
        });
    }
    canGoBack(deep, stackId = this.getActiveStackId()) {
        return this.getStack(stackId).length > deep;
    }
    pop(deep, stackId = this.getActiveStackId()) {
        return this.zone.run(() => {
            const views = this.getStack(stackId);
            if (views.length <= deep) {
                return Promise.resolve(false);
            }
            const view = views[views.length - deep - 1];
            let url = view.url;
            const viewSavedData = view.savedData;
            if (viewSavedData) {
                const primaryOutlet = viewSavedData.get('primary');
                if (primaryOutlet &&
                    primaryOutlet.route &&
                    primaryOutlet.route._routerState &&
                    primaryOutlet.route._routerState.snapshot &&
                    primaryOutlet.route._routerState.snapshot.url) {
                    url = primaryOutlet.route._routerState.snapshot.url;
                }
            }
            const { animationBuilder } = this.navCtrl.consumeTransition();
            return this.navCtrl.navigateBack(url, Object.assign({}, view.savedExtras, { animation: animationBuilder })).then(() => true);
        });
    }
    startBackTransition() {
        const leavingView = this.activeView;
        if (leavingView) {
            const views = this.getStack(leavingView.stackId);
            const enteringView = views[views.length - 2];
            const customAnimation = enteringView.animationBuilder;
            return this.wait(() => {
                return this.transition(enteringView, // entering view
                leavingView, // leaving view
                'back', this.canGoBack(2), true, customAnimation);
            });
        }
        return Promise.resolve();
    }
    endBackTransition(shouldComplete) {
        if (shouldComplete) {
            this.skipTransition = true;
            this.pop(1);
        }
        else if (this.activeView) {
            cleanup(this.activeView, this.views, this.views, this.location);
        }
    }
    getLastUrl(stackId) {
        const views = this.getStack(stackId);
        return views.length > 0 ? views[views.length - 1] : undefined;
    }
    /**
     * @internal
     */
    getRootUrl(stackId) {
        const views = this.getStack(stackId);
        return views.length > 0 ? views[0] : undefined;
    }
    getActiveStackId() {
        return this.activeView ? this.activeView.stackId : undefined;
    }
    hasRunningTask() {
        return this.runningTask !== undefined;
    }
    destroy() {
        this.containerEl = undefined;
        this.views.forEach(destroyView);
        this.activeView = undefined;
        this.views = [];
    }
    getStack(stackId) {
        return this.views.filter(v => v.stackId === stackId);
    }
    insertView(enteringView, direction) {
        this.activeView = enteringView;
        this.views = insertView(this.views, enteringView, direction);
        return this.views.slice();
    }
    transition(enteringView, leavingView, direction, showGoBack, progressAnimation, animationBuilder) {
        if (this.skipTransition) {
            this.skipTransition = false;
            return Promise.resolve(false);
        }
        if (leavingView === enteringView) {
            return Promise.resolve(false);
        }
        const enteringEl = enteringView ? enteringView.element : undefined;
        const leavingEl = leavingView ? leavingView.element : undefined;
        const containerEl = this.containerEl;
        if (enteringEl && enteringEl !== leavingEl) {
            enteringEl.classList.add('ion-page');
            enteringEl.classList.add('ion-page-invisible');
            if (enteringEl.parentElement !== containerEl) {
                containerEl.appendChild(enteringEl);
            }
            if (containerEl.commit) {
                return containerEl.commit(enteringEl, leavingEl, {
                    deepWait: true,
                    duration: direction === undefined ? 0 : undefined,
                    direction,
                    showGoBack,
                    progressAnimation,
                    animationBuilder
                });
            }
        }
        return Promise.resolve(false);
    }
    wait(task) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.runningTask !== undefined) {
                yield this.runningTask;
                this.runningTask = undefined;
            }
            const promise = this.runningTask = task();
            promise.finally(() => this.runningTask = undefined);
            return promise;
        });
    }
}
const cleanupAsync = (activeRoute, views, viewsSnapshot, location) => {
    if (typeof requestAnimationFrame === 'function') {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                cleanup(activeRoute, views, viewsSnapshot, location);
                resolve();
            });
        });
    }
    return Promise.resolve();
};
const ɵ0 = cleanupAsync;
const cleanup = (activeRoute, views, viewsSnapshot, location) => {
    viewsSnapshot
        .filter(view => !views.includes(view))
        .forEach(destroyView);
    views.forEach(view => {
        /**
         * In the event that a user navigated multiple
         * times in rapid succession, we want to make sure
         * we don't pre-emptively detach a view while
         * it is in mid-transition.
         *
         * In this instance we also do not care about query
         * params or fragments as it will be the same view regardless
         */
        const locationWithoutParams = location.path().split('?')[0];
        const locationWithoutFragment = locationWithoutParams.split('#')[0];
        if (view !== activeRoute && view.url !== locationWithoutFragment) {
            const element = view.element;
            element.setAttribute('aria-hidden', 'true');
            element.classList.add('ion-page-hidden');
            view.ref.changeDetectorRef.detach();
        }
    });
};
const ɵ1 = cleanup;
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2stY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9uYXZpZ2F0aW9uL3N0YWNrLWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUtBLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBR3ZFLE9BQU8sRUFBeUIsY0FBYyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEksTUFBTSxPQUFPLGVBQWU7SUFTMUIsWUFDRSxVQUE4QixFQUN0QixXQUF1QyxFQUN2QyxNQUFjLEVBQ2QsT0FBc0IsRUFDdEIsSUFBWSxFQUNaLFFBQWtCO1FBSmxCLGdCQUFXLEdBQVgsV0FBVyxDQUE0QjtRQUN2QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUN0QixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQWJwQixVQUFLLEdBQWdCLEVBQUUsQ0FBQztRQUV4QixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUd2QixXQUFNLEdBQUcsQ0FBQyxDQUFDO1FBVWpCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDbEYsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFzQixFQUFFLGNBQThCO1FBQy9ELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQWdCLENBQUM7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QUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztLQUNKO0lBQ0QsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDM0IsQ0FBQyxDQUFDOztBQUVGLE1BQU0sT0FBTyxHQUFHLENBQUMsV0FBc0IsRUFBRSxLQUFrQixFQUFFLGFBQTBCLEVBQUUsUUFBa0IsRUFBRSxFQUFFO0lBQzdHLGFBQWE7U0FDVixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRXhCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkI7Ozs7Ozs7O1dBUUc7UUFDSCxNQUFNLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsTUFBTSx1QkFBdUIsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEUsSUFBSSxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssdUJBQXVCLEVBQUU7WUFDaEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUM3QixPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1QyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDckM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENvbXBvbmVudFJlZiwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEFuaW1hdGlvbkJ1aWxkZXIsIFJvdXRlckRpcmVjdGlvbiB9IGZyb20gJ0Bpb25pYy9jb3JlJztcblxuaW1wb3J0IHsgYmluZExpZmVjeWNsZUV2ZW50cyB9IGZyb20gJy4uLy4uL3Byb3ZpZGVycy9hbmd1bGFyLWRlbGVnYXRlJztcbmltcG9ydCB7IE5hdkNvbnRyb2xsZXIgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvbmF2LWNvbnRyb2xsZXInO1xuXG5pbXBvcnQgeyBSb3V0ZVZpZXcsIFN0YWNrRXZlbnQsIGNvbXB1dGVTdGFja0lkLCBkZXN0cm95VmlldywgZ2V0VXJsLCBpbnNlcnRWaWV3LCBpc1RhYlN3aXRjaCwgdG9TZWdtZW50cyB9IGZyb20gJy4vc3RhY2stdXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgU3RhY2tDb250cm9sbGVyIHtcblxuICBwcml2YXRlIHZpZXdzOiBSb3V0ZVZpZXdbXSA9IFtdO1xuICBwcml2YXRlIHJ1bm5pbmdUYXNrPzogUHJvbWlzZTxhbnk+O1xuICBwcml2YXRlIHNraXBUcmFuc2l0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdGFic1ByZWZpeDogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgYWN0aXZlVmlldzogUm91dGVWaWV3IHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIG5leHRJZCA9IDA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdGFic1ByZWZpeDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIHByaXZhdGUgY29udGFpbmVyRWw6IEhUTUxJb25Sb3V0ZXJPdXRsZXRFbGVtZW50LFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBuYXZDdHJsOiBOYXZDb250cm9sbGVyLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uXG4gICkge1xuICAgIHRoaXMudGFic1ByZWZpeCA9IHRhYnNQcmVmaXggIT09IHVuZGVmaW5lZCA/IHRvU2VnbWVudHModGFic1ByZWZpeCkgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBjcmVhdGVWaWV3KHJlZjogQ29tcG9uZW50UmVmPGFueT4sIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSk6IFJvdXRlVmlldyB7XG4gICAgY29uc3QgdXJsID0gZ2V0VXJsKHRoaXMucm91dGVyLCBhY3RpdmF0ZWRSb3V0ZSk7XG4gICAgY29uc3QgZWxlbWVudCA9IChyZWYgJiYgcmVmLmxvY2F0aW9uICYmIHJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCB1bmxpc3RlbkV2ZW50cyA9IGJpbmRMaWZlY3ljbGVFdmVudHModGhpcy56b25lLCByZWYuaW5zdGFuY2UsIGVsZW1lbnQpO1xuICAgIHJldHVybiB7XG4gICAgICBpZDogdGhpcy5uZXh0SWQrKyxcbiAgICAgIHN0YWNrSWQ6IGNvbXB1dGVTdGFja0lkKHRoaXMudGFic1ByZWZpeCwgdXJsKSxcbiAgICAgIHVubGlzdGVuRXZlbnRzLFxuICAgICAgZWxlbWVudCxcbiAgICAgIHJlZixcbiAgICAgIHVybCxcbiAgICB9O1xuICB9XG5cbiAgZ2V0RXhpc3RpbmdWaWV3KGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSk6IFJvdXRlVmlldyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgYWN0aXZhdGVkVXJsS2V5ID0gZ2V0VXJsKHRoaXMucm91dGVyLCBhY3RpdmF0ZWRSb3V0ZSk7XG4gICAgY29uc3QgdmlldyA9IHRoaXMudmlld3MuZmluZCh2dyA9PiB2dy51cmwgPT09IGFjdGl2YXRlZFVybEtleSk7XG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIHZpZXcucmVmLmNoYW5nZURldGVjdG9yUmVmLnJlYXR0YWNoKCk7XG4gICAgfVxuICAgIHJldHVybiB2aWV3O1xuICB9XG5cbiAgc2V0QWN0aXZlKGVudGVyaW5nVmlldzogUm91dGVWaWV3KTogUHJvbWlzZTxTdGFja0V2ZW50PiB7XG4gICAgY29uc3QgY29uc3VtZVJlc3VsdCA9IHRoaXMubmF2Q3RybC5jb25zdW1lVHJhbnNpdGlvbigpO1xuICAgIGxldCB7IGRpcmVjdGlvbiwgYW5pbWF0aW9uLCBhbmltYXRpb25CdWlsZGVyIH0gPSBjb25zdW1lUmVzdWx0O1xuICAgIGNvbnN0IGxlYXZpbmdWaWV3ID0gdGhpcy5hY3RpdmVWaWV3O1xuICAgIGNvbnN0IHRhYlN3aXRjaCA9IGlzVGFiU3dpdGNoKGVudGVyaW5nVmlldywgbGVhdmluZ1ZpZXcpO1xuICAgIGlmICh0YWJTd2l0Y2gpIHtcbiAgICAgIGRpcmVjdGlvbiA9ICdiYWNrJztcbiAgICAgIGFuaW1hdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCB2aWV3c1NuYXBzaG90ID0gdGhpcy52aWV3cy5zbGljZSgpO1xuXG4gICAgbGV0IGN1cnJlbnROYXZpZ2F0aW9uO1xuXG4gICAgY29uc3Qgcm91dGVyID0gKHRoaXMucm91dGVyIGFzIGFueSk7XG5cbiAgICAvLyBBbmd1bGFyID49IDcuMi4wXG4gICAgaWYgKHJvdXRlci5nZXRDdXJyZW50TmF2aWdhdGlvbikge1xuICAgICAgY3VycmVudE5hdmlnYXRpb24gPSByb3V0ZXIuZ2V0Q3VycmVudE5hdmlnYXRpb24oKTtcblxuICAgICAgLy8gQW5ndWxhciA8IDcuMi4wXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHJvdXRlci5uYXZpZ2F0aW9ucyAmJlxuICAgICAgcm91dGVyLm5hdmlnYXRpb25zLnZhbHVlXG4gICAgKSB7XG4gICAgICBjdXJyZW50TmF2aWdhdGlvbiA9IHJvdXRlci5uYXZpZ2F0aW9ucy52YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgbmF2aWdhdGlvbiBhY3Rpb25cbiAgICAgKiBzZXRzIGByZXBsYWNlVXJsOiB0cnVlYFxuICAgICAqIHRoZW4gd2UgbmVlZCB0byBtYWtlIHN1cmVcbiAgICAgKiB3ZSByZW1vdmUgdGhlIGxhc3QgaXRlbVxuICAgICAqIGZyb20gb3VyIHZpZXdzIHN0YWNrXG4gICAgICovXG4gICAgaWYgKFxuICAgICAgY3VycmVudE5hdmlnYXRpb24gJiZcbiAgICAgIGN1cnJlbnROYXZpZ2F0aW9uLmV4dHJhcyAmJlxuICAgICAgY3VycmVudE5hdmlnYXRpb24uZXh0cmFzLnJlcGxhY2VVcmxcbiAgICApIHtcbiAgICAgIGlmICh0aGlzLnZpZXdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy52aWV3cy5zcGxpY2UoLTEsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJldXNlZCA9IHRoaXMudmlld3MuaW5jbHVkZXMoZW50ZXJpbmdWaWV3KTtcbiAgICBjb25zdCB2aWV3cyA9IHRoaXMuaW5zZXJ0VmlldyhlbnRlcmluZ1ZpZXcsIGRpcmVjdGlvbik7XG5cbiAgICAvLyBUcmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24gYmVmb3JlIHRyYW5zaXRpb24gc3RhcnRzXG4gICAgLy8gVGhpcyB3aWxsIGNhbGwgbmdPbkluaXQoKSB0aGUgZmlyc3QgdGltZSB0b28sIGp1c3QgYWZ0ZXIgdGhlIHZpZXdcbiAgICAvLyB3YXMgYXR0YWNoZWQgdG8gdGhlIGRvbSwgYnV0IEJFRk9SRSB0aGUgdHJhbnNpdGlvbiBzdGFydHNcbiAgICBpZiAoIXJldXNlZCkge1xuICAgICAgZW50ZXJpbmdWaWV3LnJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgd2UgYXJlIGdvaW5nIGJhY2sgZnJvbSBhIHBhZ2UgdGhhdFxuICAgICAqIHdhcyBwcmVzZW50ZWQgdXNpbmcgYSBjdXN0b20gYW5pbWF0aW9uXG4gICAgICogd2Ugc2hvdWxkIGRlZmF1bHQgdG8gdXNpbmcgdGhhdFxuICAgICAqIHVubGVzcyB0aGUgZGV2ZWxvcGVyIGV4cGxpY2l0bHlcbiAgICAgKiBwcm92aWRlZCBhbm90aGVyIGFuaW1hdGlvbi5cbiAgICAgKi9cbiAgICBjb25zdCBjdXN0b21BbmltYXRpb24gPSBlbnRlcmluZ1ZpZXcuYW5pbWF0aW9uQnVpbGRlcjtcbiAgICBpZiAoXG4gICAgICBhbmltYXRpb25CdWlsZGVyID09PSB1bmRlZmluZWQgJiZcbiAgICAgIGRpcmVjdGlvbiA9PT0gJ2JhY2snICYmXG4gICAgICAhdGFiU3dpdGNoICYmXG4gICAgICBjdXN0b21BbmltYXRpb24gIT09IHVuZGVmaW5lZFxuICAgICkge1xuICAgICAgYW5pbWF0aW9uQnVpbGRlciA9IGN1c3RvbUFuaW1hdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTYXZlIGFueSBjdXN0b20gYW5pbWF0aW9uIHNvIHRoYXQgbmF2aWdhdGluZ1xuICAgICAqIGJhY2sgd2lsbCB1c2UgdGhpcyBjdXN0b20gYW5pbWF0aW9uIGJ5IGRlZmF1bHQuXG4gICAgICovXG4gICAgaWYgKGxlYXZpbmdWaWV3KSB7XG4gICAgICBsZWF2aW5nVmlldy5hbmltYXRpb25CdWlsZGVyID0gYW5pbWF0aW9uQnVpbGRlcjtcbiAgICB9XG5cbiAgICAvLyBXYWl0IHVudGlsIHByZXZpb3VzIHRyYW5zaXRpb25zIGZpbmlzaFxuICAgIHJldHVybiB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMud2FpdCgoKSA9PiB7XG4gICAgICAgIC8vIGRpc2Nvbm5lY3QgbGVhdmluZyBwYWdlIGZyb20gY2hhbmdlIGRldGVjdGlvbiB0b1xuICAgICAgICAvLyByZWR1Y2UgamFuayBkdXJpbmcgdGhlIHBhZ2UgdHJhbnNpdGlvblxuICAgICAgICBpZiAobGVhdmluZ1ZpZXcpIHtcbiAgICAgICAgICBsZWF2aW5nVmlldy5yZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW4gY2FzZSB0aGUgZW50ZXJpbmdWaWV3IGlzIHRoZSBzYW1lIGFzIHRoZSBsZWF2aW5nUGFnZSB3ZSBuZWVkIHRvIHJlYXR0YWNoKClcbiAgICAgICAgZW50ZXJpbmdWaWV3LnJlZi5jaGFuZ2VEZXRlY3RvclJlZi5yZWF0dGFjaCgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb24oZW50ZXJpbmdWaWV3LCBsZWF2aW5nVmlldywgYW5pbWF0aW9uLCB0aGlzLmNhbkdvQmFjaygxKSwgZmFsc2UsIGFuaW1hdGlvbkJ1aWxkZXIpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gY2xlYW51cEFzeW5jKGVudGVyaW5nVmlldywgdmlld3MsIHZpZXdzU25hcHNob3QsIHRoaXMubG9jYXRpb24pKVxuICAgICAgICAgIC50aGVuKCgpID0+ICh7XG4gICAgICAgICAgICBlbnRlcmluZ1ZpZXcsXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICBhbmltYXRpb24sXG4gICAgICAgICAgICB0YWJTd2l0Y2hcbiAgICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNhbkdvQmFjayhkZWVwOiBudW1iZXIsIHN0YWNrSWQgPSB0aGlzLmdldEFjdGl2ZVN0YWNrSWQoKSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldFN0YWNrKHN0YWNrSWQpLmxlbmd0aCA+IGRlZXA7XG4gIH1cblxuICBwb3AoZGVlcDogbnVtYmVyLCBzdGFja0lkID0gdGhpcy5nZXRBY3RpdmVTdGFja0lkKCkpIHtcbiAgICByZXR1cm4gdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMuZ2V0U3RhY2soc3RhY2tJZCk7XG4gICAgICBpZiAodmlld3MubGVuZ3RoIDw9IGRlZXApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gICAgICB9XG4gICAgICBjb25zdCB2aWV3ID0gdmlld3Nbdmlld3MubGVuZ3RoIC0gZGVlcCAtIDFdO1xuICAgICAgbGV0IHVybCA9IHZpZXcudXJsO1xuXG4gICAgICBjb25zdCB2aWV3U2F2ZWREYXRhID0gdmlldy5zYXZlZERhdGE7XG4gICAgICBpZiAodmlld1NhdmVkRGF0YSkge1xuICAgICAgICBjb25zdCBwcmltYXJ5T3V0bGV0ID0gdmlld1NhdmVkRGF0YS5nZXQoJ3ByaW1hcnknKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHByaW1hcnlPdXRsZXQgJiZcbiAgICAgICAgICBwcmltYXJ5T3V0bGV0LnJvdXRlICYmXG4gICAgICAgICAgcHJpbWFyeU91dGxldC5yb3V0ZS5fcm91dGVyU3RhdGUgJiZcbiAgICAgICAgICBwcmltYXJ5T3V0bGV0LnJvdXRlLl9yb3V0ZXJTdGF0ZS5zbmFwc2hvdCAmJlxuICAgICAgICAgIHByaW1hcnlPdXRsZXQucm91dGUuX3JvdXRlclN0YXRlLnNuYXBzaG90LnVybFxuICAgICAgICApIHtcbiAgICAgICAgICB1cmwgPSBwcmltYXJ5T3V0bGV0LnJvdXRlLl9yb3V0ZXJTdGF0ZS5zbmFwc2hvdC51cmw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgYW5pbWF0aW9uQnVpbGRlciB9ID0gdGhpcy5uYXZDdHJsLmNvbnN1bWVUcmFuc2l0aW9uKCk7XG4gICAgICByZXR1cm4gdGhpcy5uYXZDdHJsLm5hdmlnYXRlQmFjayh1cmwsIHsgLi4udmlldy5zYXZlZEV4dHJhcywgYW5pbWF0aW9uOiBhbmltYXRpb25CdWlsZGVyIH0pLnRoZW4oKCkgPT4gdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzdGFydEJhY2tUcmFuc2l0aW9uKCkge1xuICAgIGNvbnN0IGxlYXZpbmdWaWV3ID0gdGhpcy5hY3RpdmVWaWV3O1xuICAgIGlmIChsZWF2aW5nVmlldykge1xuICAgICAgY29uc3Qgdmlld3MgPSB0aGlzLmdldFN0YWNrKGxlYXZpbmdWaWV3LnN0YWNrSWQpO1xuICAgICAgY29uc3QgZW50ZXJpbmdWaWV3ID0gdmlld3Nbdmlld3MubGVuZ3RoIC0gMl07XG4gICAgICBjb25zdCBjdXN0b21BbmltYXRpb24gPSBlbnRlcmluZ1ZpZXcuYW5pbWF0aW9uQnVpbGRlcjtcblxuICAgICAgcmV0dXJuIHRoaXMud2FpdCgoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb24oXG4gICAgICAgICAgZW50ZXJpbmdWaWV3LCAvLyBlbnRlcmluZyB2aWV3XG4gICAgICAgICAgbGVhdmluZ1ZpZXcsIC8vIGxlYXZpbmcgdmlld1xuICAgICAgICAgICdiYWNrJyxcbiAgICAgICAgICB0aGlzLmNhbkdvQmFjaygyKSxcbiAgICAgICAgICB0cnVlLFxuICAgICAgICAgIGN1c3RvbUFuaW1hdGlvblxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIGVuZEJhY2tUcmFuc2l0aW9uKHNob3VsZENvbXBsZXRlOiBib29sZWFuKSB7XG4gICAgaWYgKHNob3VsZENvbXBsZXRlKSB7XG4gICAgICB0aGlzLnNraXBUcmFuc2l0aW9uID0gdHJ1ZTtcbiAgICAgIHRoaXMucG9wKDEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hY3RpdmVWaWV3KSB7XG4gICAgICBjbGVhbnVwKHRoaXMuYWN0aXZlVmlldywgdGhpcy52aWV3cywgdGhpcy52aWV3cywgdGhpcy5sb2NhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgZ2V0TGFzdFVybChzdGFja0lkPzogc3RyaW5nKSB7XG4gICAgY29uc3Qgdmlld3MgPSB0aGlzLmdldFN0YWNrKHN0YWNrSWQpO1xuICAgIHJldHVybiB2aWV3cy5sZW5ndGggPiAwID8gdmlld3Nbdmlld3MubGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBnZXRSb290VXJsKHN0YWNrSWQ/OiBzdHJpbmcpIHtcbiAgICBjb25zdCB2aWV3cyA9IHRoaXMuZ2V0U3RhY2soc3RhY2tJZCk7XG4gICAgcmV0dXJuIHZpZXdzLmxlbmd0aCA+IDAgPyB2aWV3c1swXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldEFjdGl2ZVN0YWNrSWQoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVWaWV3ID8gdGhpcy5hY3RpdmVWaWV3LnN0YWNrSWQgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBoYXNSdW5uaW5nVGFzaygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5ydW5uaW5nVGFzayAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNvbnRhaW5lckVsID0gdW5kZWZpbmVkITtcbiAgICB0aGlzLnZpZXdzLmZvckVhY2goZGVzdHJveVZpZXcpO1xuICAgIHRoaXMuYWN0aXZlVmlldyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnZpZXdzID0gW107XG4gIH1cblxuICBwcml2YXRlIGdldFN0YWNrKHN0YWNrSWQ6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB0aGlzLnZpZXdzLmZpbHRlcih2ID0+IHYuc3RhY2tJZCA9PT0gc3RhY2tJZCk7XG4gIH1cblxuICBwcml2YXRlIGluc2VydFZpZXcoZW50ZXJpbmdWaWV3OiBSb3V0ZVZpZXcsIGRpcmVjdGlvbjogUm91dGVyRGlyZWN0aW9uKSB7XG4gICAgdGhpcy5hY3RpdmVWaWV3ID0gZW50ZXJpbmdWaWV3O1xuICAgIHRoaXMudmlld3MgPSBpbnNlcnRWaWV3KHRoaXMudmlld3MsIGVudGVyaW5nVmlldywgZGlyZWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy52aWV3cy5zbGljZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2l0aW9uKFxuICAgIGVudGVyaW5nVmlldzogUm91dGVWaWV3IHwgdW5kZWZpbmVkLFxuICAgIGxlYXZpbmdWaWV3OiBSb3V0ZVZpZXcgfCB1bmRlZmluZWQsXG4gICAgZGlyZWN0aW9uOiAnZm9yd2FyZCcgfCAnYmFjaycgfCB1bmRlZmluZWQsXG4gICAgc2hvd0dvQmFjazogYm9vbGVhbixcbiAgICBwcm9ncmVzc0FuaW1hdGlvbjogYm9vbGVhbixcbiAgICBhbmltYXRpb25CdWlsZGVyPzogQW5pbWF0aW9uQnVpbGRlclxuICApIHtcbiAgICBpZiAodGhpcy5za2lwVHJhbnNpdGlvbikge1xuICAgICAgdGhpcy5za2lwVHJhbnNpdGlvbiA9IGZhbHNlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gICAgfVxuICAgIGlmIChsZWF2aW5nVmlldyA9PT0gZW50ZXJpbmdWaWV3KSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbiAgICB9XG4gICAgY29uc3QgZW50ZXJpbmdFbCA9IGVudGVyaW5nVmlldyA/IGVudGVyaW5nVmlldy5lbGVtZW50IDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IGxlYXZpbmdFbCA9IGxlYXZpbmdWaWV3ID8gbGVhdmluZ1ZpZXcuZWxlbWVudCA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBjb250YWluZXJFbCA9IHRoaXMuY29udGFpbmVyRWw7XG4gICAgaWYgKGVudGVyaW5nRWwgJiYgZW50ZXJpbmdFbCAhPT0gbGVhdmluZ0VsKSB7XG4gICAgICBlbnRlcmluZ0VsLmNsYXNzTGlzdC5hZGQoJ2lvbi1wYWdlJyk7XG4gICAgICBlbnRlcmluZ0VsLmNsYXNzTGlzdC5hZGQoJ2lvbi1wYWdlLWludmlzaWJsZScpO1xuICAgICAgaWYgKGVudGVyaW5nRWwucGFyZW50RWxlbWVudCAhPT0gY29udGFpbmVyRWwpIHtcbiAgICAgICAgY29udGFpbmVyRWwuYXBwZW5kQ2hpbGQoZW50ZXJpbmdFbCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgoY29udGFpbmVyRWwgYXMgYW55KS5jb21taXQpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lckVsLmNvbW1pdChlbnRlcmluZ0VsLCBsZWF2aW5nRWwsIHtcbiAgICAgICAgICBkZWVwV2FpdDogdHJ1ZSxcbiAgICAgICAgICBkdXJhdGlvbjogZGlyZWN0aW9uID09PSB1bmRlZmluZWQgPyAwIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICBzaG93R29CYWNrLFxuICAgICAgICAgIHByb2dyZXNzQW5pbWF0aW9uLFxuICAgICAgICAgIGFuaW1hdGlvbkJ1aWxkZXJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB3YWl0PFQ+KHRhc2s6ICgpID0+IFByb21pc2U8VD4pOiBQcm9taXNlPFQ+IHtcbiAgICBpZiAodGhpcy5ydW5uaW5nVGFzayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhd2FpdCB0aGlzLnJ1bm5pbmdUYXNrO1xuICAgICAgdGhpcy5ydW5uaW5nVGFzayA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgcHJvbWlzZSA9IHRoaXMucnVubmluZ1Rhc2sgPSB0YXNrKCk7XG4gICAgcHJvbWlzZS5maW5hbGx5KCgpID0+IHRoaXMucnVubmluZ1Rhc2sgPSB1bmRlZmluZWQpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59XG5cbmNvbnN0IGNsZWFudXBBc3luYyA9IChhY3RpdmVSb3V0ZTogUm91dGVWaWV3LCB2aWV3czogUm91dGVWaWV3W10sIHZpZXdzU25hcHNob3Q6IFJvdXRlVmlld1tdLCBsb2NhdGlvbjogTG9jYXRpb24pID0+IHtcbiAgaWYgKHR5cGVvZiAocmVxdWVzdEFuaW1hdGlvbkZyYW1lIGFzIGFueSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PihyZXNvbHZlID0+IHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGNsZWFudXAoYWN0aXZlUm91dGUsIHZpZXdzLCB2aWV3c1NuYXBzaG90LCBsb2NhdGlvbik7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbn07XG5cbmNvbnN0IGNsZWFudXAgPSAoYWN0aXZlUm91dGU6IFJvdXRlVmlldywgdmlld3M6IFJvdXRlVmlld1tdLCB2aWV3c1NuYXBzaG90OiBSb3V0ZVZpZXdbXSwgbG9jYXRpb246IExvY2F0aW9uKSA9PiB7XG4gIHZpZXdzU25hcHNob3RcbiAgICAuZmlsdGVyKHZpZXcgPT4gIXZpZXdzLmluY2x1ZGVzKHZpZXcpKVxuICAgIC5mb3JFYWNoKGRlc3Ryb3lWaWV3KTtcblxuICB2aWV3cy5mb3JFYWNoKHZpZXcgPT4ge1xuICAgIC8qKlxuICAgICAqIEluIHRoZSBldmVudCB0aGF0IGEgdXNlciBuYXZpZ2F0ZWQgbXVsdGlwbGVcbiAgICAgKiB0aW1lcyBpbiByYXBpZCBzdWNjZXNzaW9uLCB3ZSB3YW50IHRvIG1ha2Ugc3VyZVxuICAgICAqIHdlIGRvbid0IHByZS1lbXB0aXZlbHkgZGV0YWNoIGEgdmlldyB3aGlsZVxuICAgICAqIGl0IGlzIGluIG1pZC10cmFuc2l0aW9uLlxuICAgICAqXG4gICAgICogSW4gdGhpcyBpbnN0YW5jZSB3ZSBhbHNvIGRvIG5vdCBjYXJlIGFib3V0IHF1ZXJ5XG4gICAgICogcGFyYW1zIG9yIGZyYWdtZW50cyBhcyBpdCB3aWxsIGJlIHRoZSBzYW1lIHZpZXcgcmVnYXJkbGVzc1xuICAgICAqL1xuICAgIGNvbnN0IGxvY2F0aW9uV2l0aG91dFBhcmFtcyA9IGxvY2F0aW9uLnBhdGgoKS5zcGxpdCgnPycpWzBdO1xuICAgIGNvbnN0IGxvY2F0aW9uV2l0aG91dEZyYWdtZW50ID0gbG9jYXRpb25XaXRob3V0UGFyYW1zLnNwbGl0KCcjJylbMF07XG5cbiAgICBpZiAodmlldyAhPT0gYWN0aXZlUm91dGUgJiYgdmlldy51cmwgIT09IGxvY2F0aW9uV2l0aG91dEZyYWdtZW50KSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdmlldy5lbGVtZW50O1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaW9uLXBhZ2UtaGlkZGVuJyk7XG4gICAgICB2aWV3LnJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRhY2goKTtcbiAgICB9XG4gIH0pO1xufTtcbiJdfQ==