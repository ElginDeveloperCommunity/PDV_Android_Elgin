import * as tslib_1 from "tslib";
import { Component, ContentChild, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { NavController } from '../../providers/nav-controller';
import { IonTabBar } from '../proxies';
import { IonRouterOutlet } from './ion-router-outlet';
let IonTabs = class IonTabs {
    constructor(navCtrl) {
        this.navCtrl = navCtrl;
        this.ionTabsWillChange = new EventEmitter();
        this.ionTabsDidChange = new EventEmitter();
    }
    /**
     * @internal
     */
    onPageSelected(detail) {
        const stackId = detail.enteringView.stackId;
        if (detail.tabSwitch && stackId !== undefined) {
            if (this.tabBar) {
                this.tabBar.selectedTab = stackId;
            }
            this.ionTabsWillChange.emit({ tab: stackId });
            this.ionTabsDidChange.emit({ tab: stackId });
        }
    }
    /**
     * When a tab button is clicked, there are several scenarios:
     * 1. If the selected tab is currently active (the tab button has been clicked
     *    again), then it should go to the root view for that tab.
     *
     *   a. Get the saved root view from the router outlet. If the saved root view
     *      matches the tabRootUrl, set the route view to this view including the
     *      navigation extras.
     *   b. If the saved root view from the router outlet does
     *      not match, navigate to the tabRootUrl. No navigation extras are
     *      included.
     *
     * 2. If the current tab tab is not currently selected, get the last route
     *    view from the router outlet.
     *
     *   a. If the last route view exists, navigate to that view including any
     *      navigation extras
     *   b. If the last route view doesn't exist, then navigate
     *      to the default tabRootUrl
     */
    select(tab) {
        const alreadySelected = this.outlet.getActiveStackId() === tab;
        const tabRootUrl = `${this.outlet.tabsPrefix}/${tab}`;
        if (alreadySelected) {
            const activeStackId = this.outlet.getActiveStackId();
            const activeView = this.outlet.getLastRouteView(activeStackId);
            // If on root tab, do not navigate to root tab again
            if (activeView.url === tabRootUrl) {
                return;
            }
            const rootView = this.outlet.getRootView(tab);
            const navigationExtras = rootView && tabRootUrl === rootView.url && rootView.savedExtras;
            return this.navCtrl.navigateRoot(tabRootUrl, Object.assign({}, (navigationExtras), { animated: true, animationDirection: 'back' }));
        }
        else {
            const lastRoute = this.outlet.getLastRouteView(tab);
            /**
             * If there is a lastRoute, goto that, otherwise goto the fallback url of the
             * selected tab
             */
            const url = lastRoute && lastRoute.url || tabRootUrl;
            const navigationExtras = lastRoute && lastRoute.savedExtras;
            return this.navCtrl.navigateRoot(url, Object.assign({}, (navigationExtras), { animated: true, animationDirection: 'back' }));
        }
    }
    getSelected() {
        return this.outlet.getActiveStackId();
    }
};
IonTabs.ctorParameters = () => [
    { type: NavController }
];
tslib_1.__decorate([
    ViewChild('outlet', { read: IonRouterOutlet, static: false })
], IonTabs.prototype, "outlet", void 0);
tslib_1.__decorate([
    ContentChild(IonTabBar, { static: false })
], IonTabs.prototype, "tabBar", void 0);
tslib_1.__decorate([
    Output()
], IonTabs.prototype, "ionTabsWillChange", void 0);
tslib_1.__decorate([
    Output()
], IonTabs.prototype, "ionTabsDidChange", void 0);
tslib_1.__decorate([
    HostListener('ionTabButtonClick', ['$event.detail.tab'])
], IonTabs.prototype, "select", null);
IonTabs = tslib_1.__decorate([
    Component({
        selector: 'ion-tabs',
        template: `
    <ng-content select="[slot=top]"></ng-content>
    <div class="tabs-inner">
      <ion-router-outlet #outlet tabs="true" (stackEvents)="onPageSelected($event)"></ion-router-outlet>
    </div>
    <ng-content></ng-content>`,
        styles: [`
    :host {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      flex-direction: column;

      width: 100%;
      height: 100%;

      contain: layout size style;
      z-index: $z-index-page-container;
    }
    .tabs-inner {
      position: relative;

      flex: 1;

      contain: layout size style;
    }`]
    })
], IonTabs);
export { IonTabs };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uLXRhYnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi9pb24tdGFicy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMvRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXZDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQXFDdEQsSUFBYSxPQUFPLEdBQXBCLE1BQWEsT0FBTztJQVFsQixZQUNVLE9BQXNCO1FBQXRCLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFKdEIsc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFDeEQscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7SUFJN0QsQ0FBQztJQUVMOztPQUVHO0lBQ0gsY0FBYyxDQUFDLE1BQWtCO1FBQy9CLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDO1FBQzVDLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQzdDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7YUFDbkM7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BbUJHO0lBRUgsTUFBTSxDQUFDLEdBQVc7UUFDaEIsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEdBQUcsQ0FBQztRQUMvRCxNQUFNLFVBQVUsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3RELElBQUksZUFBZSxFQUFFO1lBQ25CLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUNyRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRS9ELG9EQUFvRDtZQUNwRCxJQUFJLFVBQVUsQ0FBQyxHQUFHLEtBQUssVUFBVSxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUU5QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QyxNQUFNLGdCQUFnQixHQUFHLFFBQVEsSUFBSSxVQUFVLEtBQUssUUFBUSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDO1lBQ3pGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxvQkFDdEMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUNyQixRQUFRLEVBQUUsSUFBSSxFQUNkLGtCQUFrQixFQUFFLE1BQU0sSUFDMUIsQ0FBQztTQUNKO2FBQU07WUFDTCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BEOzs7ZUFHRztZQUNILE1BQU0sR0FBRyxHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQztZQUNyRCxNQUFNLGdCQUFnQixHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsV0FBVyxDQUFDO1lBRTVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxvQkFDL0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUNyQixRQUFRLEVBQUUsSUFBSSxFQUNkLGtCQUFrQixFQUFFLE1BQU0sSUFDMUIsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0NBQ0YsQ0FBQTs7WUEzRW9CLGFBQWE7O0FBUCtCO0lBQTlELFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQzt1Q0FBeUI7QUFDM0M7SUFBM0MsWUFBWSxDQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQzt1Q0FBK0I7QUFFaEU7SUFBVCxNQUFNLEVBQUU7a0RBQXlEO0FBQ3hEO0lBQVQsTUFBTSxFQUFFO2lEQUF3RDtBQXlDakU7SUFEQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3FDQWlDeEQ7QUEvRVUsT0FBTztJQWxDbkIsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFVBQVU7UUFDcEIsUUFBUSxFQUFFOzs7Ozs4QkFLa0I7aUJBQ25COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXVCTDtLQUVMLENBQUM7R0FDVyxPQUFPLENBb0ZuQjtTQXBGWSxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBPdXRwdXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBOYXZDb250cm9sbGVyIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL25hdi1jb250cm9sbGVyJztcbmltcG9ydCB7IElvblRhYkJhciB9IGZyb20gJy4uL3Byb3hpZXMnO1xuXG5pbXBvcnQgeyBJb25Sb3V0ZXJPdXRsZXQgfSBmcm9tICcuL2lvbi1yb3V0ZXItb3V0bGV0JztcbmltcG9ydCB7IFN0YWNrRXZlbnQgfSBmcm9tICcuL3N0YWNrLXV0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnaW9uLXRhYnMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltzbG90PXRvcF1cIj48L25nLWNvbnRlbnQ+XG4gICAgPGRpdiBjbGFzcz1cInRhYnMtaW5uZXJcIj5cbiAgICAgIDxpb24tcm91dGVyLW91dGxldCAjb3V0bGV0IHRhYnM9XCJ0cnVlXCIgKHN0YWNrRXZlbnRzKT1cIm9uUGFnZVNlbGVjdGVkKCRldmVudClcIj48L2lvbi1yb3V0ZXItb3V0bGV0PlxuICAgIDwvZGl2PlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxuICBzdHlsZXM6IFtgXG4gICAgOmhvc3Qge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogMDtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICByaWdodDogMDtcbiAgICAgIGJvdHRvbTogMDtcblxuICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG5cbiAgICAgIGNvbnRhaW46IGxheW91dCBzaXplIHN0eWxlO1xuICAgICAgei1pbmRleDogJHotaW5kZXgtcGFnZS1jb250YWluZXI7XG4gICAgfVxuICAgIC50YWJzLWlubmVyIHtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAgICAgZmxleDogMTtcblxuICAgICAgY29udGFpbjogbGF5b3V0IHNpemUgc3R5bGU7XG4gICAgfWBcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBJb25UYWJzIHtcblxuICBAVmlld0NoaWxkKCdvdXRsZXQnLCB7IHJlYWQ6IElvblJvdXRlck91dGxldCwgc3RhdGljOiBmYWxzZSB9KSBvdXRsZXQ6IElvblJvdXRlck91dGxldDtcbiAgQENvbnRlbnRDaGlsZChJb25UYWJCYXIsIHsgc3RhdGljOiBmYWxzZSB9KSB0YWJCYXI6IElvblRhYkJhciB8IHVuZGVmaW5lZDtcblxuICBAT3V0cHV0KCkgaW9uVGFic1dpbGxDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHsgdGFiOiBzdHJpbmcgfT4oKTtcbiAgQE91dHB1dCgpIGlvblRhYnNEaWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHsgdGFiOiBzdHJpbmcgfT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5hdkN0cmw6IE5hdkNvbnRyb2xsZXIsXG4gICkgeyB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgb25QYWdlU2VsZWN0ZWQoZGV0YWlsOiBTdGFja0V2ZW50KSB7XG4gICAgY29uc3Qgc3RhY2tJZCA9IGRldGFpbC5lbnRlcmluZ1ZpZXcuc3RhY2tJZDtcbiAgICBpZiAoZGV0YWlsLnRhYlN3aXRjaCAmJiBzdGFja0lkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0aGlzLnRhYkJhcikge1xuICAgICAgICB0aGlzLnRhYkJhci5zZWxlY3RlZFRhYiA9IHN0YWNrSWQ7XG4gICAgICB9XG4gICAgICB0aGlzLmlvblRhYnNXaWxsQ2hhbmdlLmVtaXQoeyB0YWI6IHN0YWNrSWQgfSk7XG4gICAgICB0aGlzLmlvblRhYnNEaWRDaGFuZ2UuZW1pdCh7IHRhYjogc3RhY2tJZCB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBhIHRhYiBidXR0b24gaXMgY2xpY2tlZCwgdGhlcmUgYXJlIHNldmVyYWwgc2NlbmFyaW9zOlxuICAgKiAxLiBJZiB0aGUgc2VsZWN0ZWQgdGFiIGlzIGN1cnJlbnRseSBhY3RpdmUgKHRoZSB0YWIgYnV0dG9uIGhhcyBiZWVuIGNsaWNrZWRcbiAgICogICAgYWdhaW4pLCB0aGVuIGl0IHNob3VsZCBnbyB0byB0aGUgcm9vdCB2aWV3IGZvciB0aGF0IHRhYi5cbiAgICpcbiAgICogICBhLiBHZXQgdGhlIHNhdmVkIHJvb3QgdmlldyBmcm9tIHRoZSByb3V0ZXIgb3V0bGV0LiBJZiB0aGUgc2F2ZWQgcm9vdCB2aWV3XG4gICAqICAgICAgbWF0Y2hlcyB0aGUgdGFiUm9vdFVybCwgc2V0IHRoZSByb3V0ZSB2aWV3IHRvIHRoaXMgdmlldyBpbmNsdWRpbmcgdGhlXG4gICAqICAgICAgbmF2aWdhdGlvbiBleHRyYXMuXG4gICAqICAgYi4gSWYgdGhlIHNhdmVkIHJvb3QgdmlldyBmcm9tIHRoZSByb3V0ZXIgb3V0bGV0IGRvZXNcbiAgICogICAgICBub3QgbWF0Y2gsIG5hdmlnYXRlIHRvIHRoZSB0YWJSb290VXJsLiBObyBuYXZpZ2F0aW9uIGV4dHJhcyBhcmVcbiAgICogICAgICBpbmNsdWRlZC5cbiAgICpcbiAgICogMi4gSWYgdGhlIGN1cnJlbnQgdGFiIHRhYiBpcyBub3QgY3VycmVudGx5IHNlbGVjdGVkLCBnZXQgdGhlIGxhc3Qgcm91dGVcbiAgICogICAgdmlldyBmcm9tIHRoZSByb3V0ZXIgb3V0bGV0LlxuICAgKlxuICAgKiAgIGEuIElmIHRoZSBsYXN0IHJvdXRlIHZpZXcgZXhpc3RzLCBuYXZpZ2F0ZSB0byB0aGF0IHZpZXcgaW5jbHVkaW5nIGFueVxuICAgKiAgICAgIG5hdmlnYXRpb24gZXh0cmFzXG4gICAqICAgYi4gSWYgdGhlIGxhc3Qgcm91dGUgdmlldyBkb2Vzbid0IGV4aXN0LCB0aGVuIG5hdmlnYXRlXG4gICAqICAgICAgdG8gdGhlIGRlZmF1bHQgdGFiUm9vdFVybFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignaW9uVGFiQnV0dG9uQ2xpY2snLCBbJyRldmVudC5kZXRhaWwudGFiJ10pXG4gIHNlbGVjdCh0YWI6IHN0cmluZykge1xuICAgIGNvbnN0IGFscmVhZHlTZWxlY3RlZCA9IHRoaXMub3V0bGV0LmdldEFjdGl2ZVN0YWNrSWQoKSA9PT0gdGFiO1xuICAgIGNvbnN0IHRhYlJvb3RVcmwgPSBgJHt0aGlzLm91dGxldC50YWJzUHJlZml4fS8ke3RhYn1gO1xuICAgIGlmIChhbHJlYWR5U2VsZWN0ZWQpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZVN0YWNrSWQgPSB0aGlzLm91dGxldC5nZXRBY3RpdmVTdGFja0lkKCk7XG4gICAgICBjb25zdCBhY3RpdmVWaWV3ID0gdGhpcy5vdXRsZXQuZ2V0TGFzdFJvdXRlVmlldyhhY3RpdmVTdGFja0lkKTtcblxuICAgICAgLy8gSWYgb24gcm9vdCB0YWIsIGRvIG5vdCBuYXZpZ2F0ZSB0byByb290IHRhYiBhZ2FpblxuICAgICAgaWYgKGFjdGl2ZVZpZXcudXJsID09PSB0YWJSb290VXJsKSB7IHJldHVybjsgfVxuXG4gICAgICBjb25zdCByb290VmlldyA9IHRoaXMub3V0bGV0LmdldFJvb3RWaWV3KHRhYik7XG4gICAgICBjb25zdCBuYXZpZ2F0aW9uRXh0cmFzID0gcm9vdFZpZXcgJiYgdGFiUm9vdFVybCA9PT0gcm9vdFZpZXcudXJsICYmIHJvb3RWaWV3LnNhdmVkRXh0cmFzO1xuICAgICAgcmV0dXJuIHRoaXMubmF2Q3RybC5uYXZpZ2F0ZVJvb3QodGFiUm9vdFVybCwge1xuICAgICAgICAuLi4obmF2aWdhdGlvbkV4dHJhcyksXG4gICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICBhbmltYXRpb25EaXJlY3Rpb246ICdiYWNrJyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsYXN0Um91dGUgPSB0aGlzLm91dGxldC5nZXRMYXN0Um91dGVWaWV3KHRhYik7XG4gICAgICAvKipcbiAgICAgICAqIElmIHRoZXJlIGlzIGEgbGFzdFJvdXRlLCBnb3RvIHRoYXQsIG90aGVyd2lzZSBnb3RvIHRoZSBmYWxsYmFjayB1cmwgb2YgdGhlXG4gICAgICAgKiBzZWxlY3RlZCB0YWJcbiAgICAgICAqL1xuICAgICAgY29uc3QgdXJsID0gbGFzdFJvdXRlICYmIGxhc3RSb3V0ZS51cmwgfHwgdGFiUm9vdFVybDtcbiAgICAgIGNvbnN0IG5hdmlnYXRpb25FeHRyYXMgPSBsYXN0Um91dGUgJiYgbGFzdFJvdXRlLnNhdmVkRXh0cmFzO1xuXG4gICAgICByZXR1cm4gdGhpcy5uYXZDdHJsLm5hdmlnYXRlUm9vdCh1cmwsIHtcbiAgICAgICAgLi4uKG5hdmlnYXRpb25FeHRyYXMpLFxuICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgYW5pbWF0aW9uRGlyZWN0aW9uOiAnYmFjaycsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRTZWxlY3RlZCgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLm91dGxldC5nZXRBY3RpdmVTdGFja0lkKCk7XG4gIH1cbn1cbiJdfQ==