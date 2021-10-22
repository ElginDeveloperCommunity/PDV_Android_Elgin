import * as tslib_1 from "tslib";
import { LocationStrategy } from '@angular/common';
import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavController } from '../../providers/nav-controller';
var RouterLinkDelegate = /** @class */ (function () {
    function RouterLinkDelegate(locationStrategy, navCtrl, elementRef, router, routerLink) {
        this.locationStrategy = locationStrategy;
        this.navCtrl = navCtrl;
        this.elementRef = elementRef;
        this.router = router;
        this.routerLink = routerLink;
        this.routerDirection = 'forward';
    }
    RouterLinkDelegate.prototype.ngOnInit = function () {
        this.updateTargetUrlAndHref();
    };
    RouterLinkDelegate.prototype.ngOnChanges = function () {
        this.updateTargetUrlAndHref();
    };
    RouterLinkDelegate.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    RouterLinkDelegate.prototype.updateTargetUrlAndHref = function () {
        if (this.routerLink) {
            var href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
            this.elementRef.nativeElement.href = href;
        }
    };
    /**
     * @internal
     */
    RouterLinkDelegate.prototype.onClick = function (ev) {
        this.navCtrl.setDirection(this.routerDirection, undefined, undefined, this.routerAnimation);
        ev.preventDefault();
    };
    RouterLinkDelegate.ctorParameters = function () { return [
        { type: LocationStrategy },
        { type: NavController },
        { type: ElementRef },
        { type: Router },
        { type: RouterLink, decorators: [{ type: Optional }] }
    ]; };
    tslib_1.__decorate([
        HostListener('click', ['$event'])
    ], RouterLinkDelegate.prototype, "onClick", null);
    RouterLinkDelegate = tslib_1.__decorate([
        Directive({
            selector: '[routerLink]',
            inputs: ['routerDirection', 'routerAnimation']
        }),
        tslib_1.__param(4, Optional())
    ], RouterLinkDelegate);
    return RouterLinkDelegate;
}());
export { RouterLinkDelegate };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLWxpbmstZGVsZWdhdGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi9yb3V0ZXItbGluay1kZWxlZ2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSXJELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQU0vRDtJQU9FLDRCQUNVLGdCQUFrQyxFQUNsQyxPQUFzQixFQUN0QixVQUFzQixFQUN0QixNQUFjLEVBQ0YsVUFBdUI7UUFKbkMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFlO1FBQ3RCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNGLGVBQVUsR0FBVixVQUFVLENBQWE7UUFSN0Msb0JBQWUsR0FBb0IsU0FBUyxDQUFDO0lBU3pDLENBQUM7SUFFTCxxQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELHdDQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsd0NBQVcsR0FBWDtRQUNFLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQUVPLG1EQUFzQixHQUE5QjtRQUNFLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3pHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDM0M7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFFSCxvQ0FBTyxHQUFQLFVBQVEsRUFBVztRQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzVGLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN0QixDQUFDOztnQkFuQzJCLGdCQUFnQjtnQkFDekIsYUFBYTtnQkFDVixVQUFVO2dCQUNkLE1BQU07Z0JBQ1csVUFBVSx1QkFBMUMsUUFBUTs7SUE0Qlg7UUFEQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7cURBSWpDO0lBM0NVLGtCQUFrQjtRQUo5QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsY0FBYztZQUN4QixNQUFNLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxpQkFBaUIsQ0FBQztTQUMvQyxDQUFDO1FBYUcsbUJBQUEsUUFBUSxFQUFFLENBQUE7T0FaRixrQkFBa0IsQ0E0QzlCO0lBQUQseUJBQUM7Q0FBQSxBQTVDRCxJQTRDQztTQTVDWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2NhdGlvblN0cmF0ZWd5IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyLCBSb3V0ZXJMaW5rIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEFuaW1hdGlvbkJ1aWxkZXIsIFJvdXRlckRpcmVjdGlvbiB9IGZyb20gJ0Bpb25pYy9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBOYXZDb250cm9sbGVyIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL25hdi1jb250cm9sbGVyJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3JvdXRlckxpbmtdJyxcbiAgaW5wdXRzOiBbJ3JvdXRlckRpcmVjdGlvbicsICdyb3V0ZXJBbmltYXRpb24nXVxufSlcbmV4cG9ydCBjbGFzcyBSb3V0ZXJMaW5rRGVsZWdhdGUge1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uPzogU3Vic2NyaXB0aW9uO1xuXG4gIHJvdXRlckRpcmVjdGlvbjogUm91dGVyRGlyZWN0aW9uID0gJ2ZvcndhcmQnO1xuICByb3V0ZXJBbmltYXRpb24/OiBBbmltYXRpb25CdWlsZGVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbG9jYXRpb25TdHJhdGVneTogTG9jYXRpb25TdHJhdGVneSxcbiAgICBwcml2YXRlIG5hdkN0cmw6IE5hdkNvbnRyb2xsZXIsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSByb3V0ZXJMaW5rPzogUm91dGVyTGluayxcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnVwZGF0ZVRhcmdldFVybEFuZEhyZWYoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCk6IGFueSB7XG4gICAgdGhpcy51cGRhdGVUYXJnZXRVcmxBbmRIcmVmKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiBhbnkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVRhcmdldFVybEFuZEhyZWYoKSB7XG4gICAgaWYgKHRoaXMucm91dGVyTGluaykge1xuICAgICAgY29uc3QgaHJlZiA9IHRoaXMubG9jYXRpb25TdHJhdGVneS5wcmVwYXJlRXh0ZXJuYWxVcmwodGhpcy5yb3V0ZXIuc2VyaWFsaXplVXJsKHRoaXMucm91dGVyTGluay51cmxUcmVlKSk7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ocmVmID0gaHJlZjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uQ2xpY2soZXY6IFVJRXZlbnQpIHtcbiAgICB0aGlzLm5hdkN0cmwuc2V0RGlyZWN0aW9uKHRoaXMucm91dGVyRGlyZWN0aW9uLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcy5yb3V0ZXJBbmltYXRpb24pO1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbn1cbiJdfQ==