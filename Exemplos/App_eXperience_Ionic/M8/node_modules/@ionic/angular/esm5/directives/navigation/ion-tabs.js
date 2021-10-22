import * as tslib_1 from "tslib";
import { Component, ContentChild, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { NavController } from '../../providers/nav-controller';
import { IonTabBar } from '../proxies';
import { IonRouterOutlet } from './ion-router-outlet';
var IonTabs = /** @class */ (function () {
    function IonTabs(navCtrl) {
        this.navCtrl = navCtrl;
        this.ionTabsWillChange = new EventEmitter();
        this.ionTabsDidChange = new EventEmitter();
    }
    /**
     * @internal
     */
    IonTabs.prototype.onPageSelected = function (detail) {
        var stackId = detail.enteringView.stackId;
        if (detail.tabSwitch && stackId !== undefined) {
            if (this.tabBar) {
                this.tabBar.selectedTab = stackId;
            }
            this.ionTabsWillChange.emit({ tab: stackId });
            this.ionTabsDidChange.emit({ tab: stackId });
        }
    };
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
    IonTabs.prototype.select = function (tab) {
        var alreadySelected = this.outlet.getActiveStackId() === tab;
        var tabRootUrl = this.outlet.tabsPrefix + "/" + tab;
        if (alreadySelected) {
            var activeStackId = this.outlet.getActiveStackId();
            var activeView = this.outlet.getLastRouteView(activeStackId);
            // If on root tab, do not navigate to root tab again
            if (activeView.url === tabRootUrl) {
                return;
            }
            var rootView = this.outlet.getRootView(tab);
            var navigationExtras = rootView && tabRootUrl === rootView.url && rootView.savedExtras;
            return this.navCtrl.navigateRoot(tabRootUrl, tslib_1.__assign({}, (navigationExtras), { animated: true, animationDirection: 'back' }));
        }
        else {
            var lastRoute = this.outlet.getLastRouteView(tab);
            /**
             * If there is a lastRoute, goto that, otherwise goto the fallback url of the
             * selected tab
             */
            var url = lastRoute && lastRoute.url || tabRootUrl;
            var navigationExtras = lastRoute && lastRoute.savedExtras;
            return this.navCtrl.navigateRoot(url, tslib_1.__assign({}, (navigationExtras), { animated: true, animationDirection: 'back' }));
        }
    };
    IonTabs.prototype.getSelected = function () {
        return this.outlet.getActiveStackId();
    };
    IonTabs.ctorParameters = function () { return [
        { type: NavController }
    ]; };
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
            template: "\n    <ng-content select=\"[slot=top]\"></ng-content>\n    <div class=\"tabs-inner\">\n      <ion-router-outlet #outlet tabs=\"true\" (stackEvents)=\"onPageSelected($event)\"></ion-router-outlet>\n    </div>\n    <ng-content></ng-content>",
            styles: ["\n    :host {\n      display: flex;\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n\n      flex-direction: column;\n\n      width: 100%;\n      height: 100%;\n\n      contain: layout size style;\n      z-index: $z-index-page-container;\n    }\n    .tabs-inner {\n      position: relative;\n\n      flex: 1;\n\n      contain: layout size style;\n    }"]
        })
    ], IonTabs);
    return IonTabs;
}());
export { IonTabs };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uLXRhYnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi9pb24tdGFicy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMvRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXZDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQXFDdEQ7SUFRRSxpQkFDVSxPQUFzQjtRQUF0QixZQUFPLEdBQVAsT0FBTyxDQUFlO1FBSnRCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBQ3hELHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO0lBSTdELENBQUM7SUFFTDs7T0FFRztJQUNILGdDQUFjLEdBQWQsVUFBZSxNQUFrQjtRQUMvQixJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztRQUM1QyxJQUFJLE1BQU0sQ0FBQyxTQUFTLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUM3QyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1CRztJQUVILHdCQUFNLEdBQU4sVUFBTyxHQUFXO1FBQ2hCLElBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxHQUFHLENBQUM7UUFDL0QsSUFBTSxVQUFVLEdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLFNBQUksR0FBSyxDQUFDO1FBQ3RELElBQUksZUFBZSxFQUFFO1lBQ25CLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUNyRCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRS9ELG9EQUFvRDtZQUNwRCxJQUFJLFVBQVUsQ0FBQyxHQUFHLEtBQUssVUFBVSxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUU5QyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QyxJQUFNLGdCQUFnQixHQUFHLFFBQVEsSUFBSSxVQUFVLEtBQUssUUFBUSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDO1lBQ3pGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSx1QkFDdEMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUNyQixRQUFRLEVBQUUsSUFBSSxFQUNkLGtCQUFrQixFQUFFLE1BQU0sSUFDMUIsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BEOzs7ZUFHRztZQUNILElBQU0sR0FBRyxHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQztZQUNyRCxJQUFNLGdCQUFnQixHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsV0FBVyxDQUFDO1lBRTVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyx1QkFDL0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUNyQixRQUFRLEVBQUUsSUFBSSxFQUNkLGtCQUFrQixFQUFFLE1BQU0sSUFDMUIsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELDZCQUFXLEdBQVg7UUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUN4QyxDQUFDOztnQkExRWtCLGFBQWE7O0lBUCtCO1FBQTlELFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQzsyQ0FBeUI7SUFDM0M7UUFBM0MsWUFBWSxDQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQzsyQ0FBK0I7SUFFaEU7UUFBVCxNQUFNLEVBQUU7c0RBQXlEO0lBQ3hEO1FBQVQsTUFBTSxFQUFFO3FEQUF3RDtJQXlDakU7UUFEQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3lDQWlDeEQ7SUEvRVUsT0FBTztRQWxDbkIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLGdQQUtrQjtxQkFDbkIsK1lBdUJMO1NBRUwsQ0FBQztPQUNXLE9BQU8sQ0FvRm5CO0lBQUQsY0FBQztDQUFBLEFBcEZELElBb0ZDO1NBcEZZLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIE91dHB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE5hdkNvbnRyb2xsZXIgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvbmF2LWNvbnRyb2xsZXInO1xuaW1wb3J0IHsgSW9uVGFiQmFyIH0gZnJvbSAnLi4vcHJveGllcyc7XG5cbmltcG9ydCB7IElvblJvdXRlck91dGxldCB9IGZyb20gJy4vaW9uLXJvdXRlci1vdXRsZXQnO1xuaW1wb3J0IHsgU3RhY2tFdmVudCB9IGZyb20gJy4vc3RhY2stdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdpb24tdGFicycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW3Nsb3Q9dG9wXVwiPjwvbmctY29udGVudD5cbiAgICA8ZGl2IGNsYXNzPVwidGFicy1pbm5lclwiPlxuICAgICAgPGlvbi1yb3V0ZXItb3V0bGV0ICNvdXRsZXQgdGFicz1cInRydWVcIiAoc3RhY2tFdmVudHMpPVwib25QYWdlU2VsZWN0ZWQoJGV2ZW50KVwiPjwvaW9uLXJvdXRlci1vdXRsZXQ+XG4gICAgPC9kaXY+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmAsXG4gIHN0eWxlczogW2BcbiAgICA6aG9zdCB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiAwO1xuICAgICAgbGVmdDogMDtcbiAgICAgIHJpZ2h0OiAwO1xuICAgICAgYm90dG9tOiAwO1xuXG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMTAwJTtcblxuICAgICAgY29udGFpbjogbGF5b3V0IHNpemUgc3R5bGU7XG4gICAgICB6LWluZGV4OiAkei1pbmRleC1wYWdlLWNvbnRhaW5lcjtcbiAgICB9XG4gICAgLnRhYnMtaW5uZXIge1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgICBmbGV4OiAxO1xuXG4gICAgICBjb250YWluOiBsYXlvdXQgc2l6ZSBzdHlsZTtcbiAgICB9YFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIElvblRhYnMge1xuXG4gIEBWaWV3Q2hpbGQoJ291dGxldCcsIHsgcmVhZDogSW9uUm91dGVyT3V0bGV0LCBzdGF0aWM6IGZhbHNlIH0pIG91dGxldDogSW9uUm91dGVyT3V0bGV0O1xuICBAQ29udGVudENoaWxkKElvblRhYkJhciwgeyBzdGF0aWM6IGZhbHNlIH0pIHRhYkJhcjogSW9uVGFiQmFyIHwgdW5kZWZpbmVkO1xuXG4gIEBPdXRwdXQoKSBpb25UYWJzV2lsbENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8eyB0YWI6IHN0cmluZyB9PigpO1xuICBAT3V0cHV0KCkgaW9uVGFic0RpZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8eyB0YWI6IHN0cmluZyB9PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbmF2Q3RybDogTmF2Q29udHJvbGxlcixcbiAgKSB7IH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBvblBhZ2VTZWxlY3RlZChkZXRhaWw6IFN0YWNrRXZlbnQpIHtcbiAgICBjb25zdCBzdGFja0lkID0gZGV0YWlsLmVudGVyaW5nVmlldy5zdGFja0lkO1xuICAgIGlmIChkZXRhaWwudGFiU3dpdGNoICYmIHN0YWNrSWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHRoaXMudGFiQmFyKSB7XG4gICAgICAgIHRoaXMudGFiQmFyLnNlbGVjdGVkVGFiID0gc3RhY2tJZDtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW9uVGFic1dpbGxDaGFuZ2UuZW1pdCh7IHRhYjogc3RhY2tJZCB9KTtcbiAgICAgIHRoaXMuaW9uVGFic0RpZENoYW5nZS5lbWl0KHsgdGFiOiBzdGFja0lkIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIGEgdGFiIGJ1dHRvbiBpcyBjbGlja2VkLCB0aGVyZSBhcmUgc2V2ZXJhbCBzY2VuYXJpb3M6XG4gICAqIDEuIElmIHRoZSBzZWxlY3RlZCB0YWIgaXMgY3VycmVudGx5IGFjdGl2ZSAodGhlIHRhYiBidXR0b24gaGFzIGJlZW4gY2xpY2tlZFxuICAgKiAgICBhZ2FpbiksIHRoZW4gaXQgc2hvdWxkIGdvIHRvIHRoZSByb290IHZpZXcgZm9yIHRoYXQgdGFiLlxuICAgKlxuICAgKiAgIGEuIEdldCB0aGUgc2F2ZWQgcm9vdCB2aWV3IGZyb20gdGhlIHJvdXRlciBvdXRsZXQuIElmIHRoZSBzYXZlZCByb290IHZpZXdcbiAgICogICAgICBtYXRjaGVzIHRoZSB0YWJSb290VXJsLCBzZXQgdGhlIHJvdXRlIHZpZXcgdG8gdGhpcyB2aWV3IGluY2x1ZGluZyB0aGVcbiAgICogICAgICBuYXZpZ2F0aW9uIGV4dHJhcy5cbiAgICogICBiLiBJZiB0aGUgc2F2ZWQgcm9vdCB2aWV3IGZyb20gdGhlIHJvdXRlciBvdXRsZXQgZG9lc1xuICAgKiAgICAgIG5vdCBtYXRjaCwgbmF2aWdhdGUgdG8gdGhlIHRhYlJvb3RVcmwuIE5vIG5hdmlnYXRpb24gZXh0cmFzIGFyZVxuICAgKiAgICAgIGluY2x1ZGVkLlxuICAgKlxuICAgKiAyLiBJZiB0aGUgY3VycmVudCB0YWIgdGFiIGlzIG5vdCBjdXJyZW50bHkgc2VsZWN0ZWQsIGdldCB0aGUgbGFzdCByb3V0ZVxuICAgKiAgICB2aWV3IGZyb20gdGhlIHJvdXRlciBvdXRsZXQuXG4gICAqXG4gICAqICAgYS4gSWYgdGhlIGxhc3Qgcm91dGUgdmlldyBleGlzdHMsIG5hdmlnYXRlIHRvIHRoYXQgdmlldyBpbmNsdWRpbmcgYW55XG4gICAqICAgICAgbmF2aWdhdGlvbiBleHRyYXNcbiAgICogICBiLiBJZiB0aGUgbGFzdCByb3V0ZSB2aWV3IGRvZXNuJ3QgZXhpc3QsIHRoZW4gbmF2aWdhdGVcbiAgICogICAgICB0byB0aGUgZGVmYXVsdCB0YWJSb290VXJsXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdpb25UYWJCdXR0b25DbGljaycsIFsnJGV2ZW50LmRldGFpbC50YWInXSlcbiAgc2VsZWN0KHRhYjogc3RyaW5nKSB7XG4gICAgY29uc3QgYWxyZWFkeVNlbGVjdGVkID0gdGhpcy5vdXRsZXQuZ2V0QWN0aXZlU3RhY2tJZCgpID09PSB0YWI7XG4gICAgY29uc3QgdGFiUm9vdFVybCA9IGAke3RoaXMub3V0bGV0LnRhYnNQcmVmaXh9LyR7dGFifWA7XG4gICAgaWYgKGFscmVhZHlTZWxlY3RlZCkge1xuICAgICAgY29uc3QgYWN0aXZlU3RhY2tJZCA9IHRoaXMub3V0bGV0LmdldEFjdGl2ZVN0YWNrSWQoKTtcbiAgICAgIGNvbnN0IGFjdGl2ZVZpZXcgPSB0aGlzLm91dGxldC5nZXRMYXN0Um91dGVWaWV3KGFjdGl2ZVN0YWNrSWQpO1xuXG4gICAgICAvLyBJZiBvbiByb290IHRhYiwgZG8gbm90IG5hdmlnYXRlIHRvIHJvb3QgdGFiIGFnYWluXG4gICAgICBpZiAoYWN0aXZlVmlldy51cmwgPT09IHRhYlJvb3RVcmwpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGNvbnN0IHJvb3RWaWV3ID0gdGhpcy5vdXRsZXQuZ2V0Um9vdFZpZXcodGFiKTtcbiAgICAgIGNvbnN0IG5hdmlnYXRpb25FeHRyYXMgPSByb290VmlldyAmJiB0YWJSb290VXJsID09PSByb290Vmlldy51cmwgJiYgcm9vdFZpZXcuc2F2ZWRFeHRyYXM7XG4gICAgICByZXR1cm4gdGhpcy5uYXZDdHJsLm5hdmlnYXRlUm9vdCh0YWJSb290VXJsLCB7XG4gICAgICAgIC4uLihuYXZpZ2F0aW9uRXh0cmFzKSxcbiAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgIGFuaW1hdGlvbkRpcmVjdGlvbjogJ2JhY2snLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxhc3RSb3V0ZSA9IHRoaXMub3V0bGV0LmdldExhc3RSb3V0ZVZpZXcodGFiKTtcbiAgICAgIC8qKlxuICAgICAgICogSWYgdGhlcmUgaXMgYSBsYXN0Um91dGUsIGdvdG8gdGhhdCwgb3RoZXJ3aXNlIGdvdG8gdGhlIGZhbGxiYWNrIHVybCBvZiB0aGVcbiAgICAgICAqIHNlbGVjdGVkIHRhYlxuICAgICAgICovXG4gICAgICBjb25zdCB1cmwgPSBsYXN0Um91dGUgJiYgbGFzdFJvdXRlLnVybCB8fCB0YWJSb290VXJsO1xuICAgICAgY29uc3QgbmF2aWdhdGlvbkV4dHJhcyA9IGxhc3RSb3V0ZSAmJiBsYXN0Um91dGUuc2F2ZWRFeHRyYXM7XG5cbiAgICAgIHJldHVybiB0aGlzLm5hdkN0cmwubmF2aWdhdGVSb290KHVybCwge1xuICAgICAgICAuLi4obmF2aWdhdGlvbkV4dHJhcyksXG4gICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICBhbmltYXRpb25EaXJlY3Rpb246ICdiYWNrJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFNlbGVjdGVkKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMub3V0bGV0LmdldEFjdGl2ZVN0YWNrSWQoKTtcbiAgfVxufVxuIl19