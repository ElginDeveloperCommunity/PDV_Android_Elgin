import * as tslib_1 from "tslib";
import { LocationStrategy } from '@angular/common';
import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavController } from '../../providers/nav-controller';
let RouterLinkDelegate = class RouterLinkDelegate {
    constructor(locationStrategy, navCtrl, elementRef, router, routerLink) {
        this.locationStrategy = locationStrategy;
        this.navCtrl = navCtrl;
        this.elementRef = elementRef;
        this.router = router;
        this.routerLink = routerLink;
        this.routerDirection = 'forward';
    }
    ngOnInit() {
        this.updateTargetUrlAndHref();
    }
    ngOnChanges() {
        this.updateTargetUrlAndHref();
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    updateTargetUrlAndHref() {
        if (this.routerLink) {
            const href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
            this.elementRef.nativeElement.href = href;
        }
    }
    /**
     * @internal
     */
    onClick(ev) {
        this.navCtrl.setDirection(this.routerDirection, undefined, undefined, this.routerAnimation);
        ev.preventDefault();
    }
};
RouterLinkDelegate.ctorParameters = () => [
    { type: LocationStrategy },
    { type: NavController },
    { type: ElementRef },
    { type: Router },
    { type: RouterLink, decorators: [{ type: Optional }] }
];
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
export { RouterLinkDelegate };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLWxpbmstZGVsZWdhdGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi9yb3V0ZXItbGluay1kZWxlZ2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSXJELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQU0vRCxJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFrQjtJQU83QixZQUNVLGdCQUFrQyxFQUNsQyxPQUFzQixFQUN0QixVQUFzQixFQUN0QixNQUFjLEVBQ0YsVUFBdUI7UUFKbkMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFlO1FBQ3RCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNGLGVBQVUsR0FBVixVQUFVLENBQWE7UUFSN0Msb0JBQWUsR0FBb0IsU0FBUyxDQUFDO0lBU3pDLENBQUM7SUFFTCxRQUFRO1FBQ04sSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQUVPLHNCQUFzQjtRQUM1QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN6RyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQzNDO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBRUgsT0FBTyxDQUFDLEVBQVc7UUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM1RixFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdEIsQ0FBQztDQUNGLENBQUE7O1lBcEM2QixnQkFBZ0I7WUFDekIsYUFBYTtZQUNWLFVBQVU7WUFDZCxNQUFNO1lBQ1csVUFBVSx1QkFBMUMsUUFBUTs7QUE0Qlg7SUFEQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7aURBSWpDO0FBM0NVLGtCQUFrQjtJQUo5QixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsY0FBYztRQUN4QixNQUFNLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxpQkFBaUIsQ0FBQztLQUMvQyxDQUFDO0lBYUcsbUJBQUEsUUFBUSxFQUFFLENBQUE7R0FaRixrQkFBa0IsQ0E0QzlCO1NBNUNZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvY2F0aW9uU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIsIFJvdXRlckxpbmsgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQW5pbWF0aW9uQnVpbGRlciwgUm91dGVyRGlyZWN0aW9uIH0gZnJvbSAnQGlvbmljL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE5hdkNvbnRyb2xsZXIgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvbmF2LWNvbnRyb2xsZXInO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcm91dGVyTGlua10nLFxuICBpbnB1dHM6IFsncm91dGVyRGlyZWN0aW9uJywgJ3JvdXRlckFuaW1hdGlvbiddXG59KVxuZXhwb3J0IGNsYXNzIFJvdXRlckxpbmtEZWxlZ2F0ZSB7XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb24/OiBTdWJzY3JpcHRpb247XG5cbiAgcm91dGVyRGlyZWN0aW9uOiBSb3V0ZXJEaXJlY3Rpb24gPSAnZm9yd2FyZCc7XG4gIHJvdXRlckFuaW1hdGlvbj86IEFuaW1hdGlvbkJ1aWxkZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBsb2NhdGlvblN0cmF0ZWd5OiBMb2NhdGlvblN0cmF0ZWd5LFxuICAgIHByaXZhdGUgbmF2Q3RybDogTmF2Q29udHJvbGxlcixcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIHJvdXRlckxpbms/OiBSb3V0ZXJMaW5rLFxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMudXBkYXRlVGFyZ2V0VXJsQW5kSHJlZigpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKTogYW55IHtcbiAgICB0aGlzLnVwZGF0ZVRhcmdldFVybEFuZEhyZWYoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IGFueSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlVGFyZ2V0VXJsQW5kSHJlZigpIHtcbiAgICBpZiAodGhpcy5yb3V0ZXJMaW5rKSB7XG4gICAgICBjb25zdCBocmVmID0gdGhpcy5sb2NhdGlvblN0cmF0ZWd5LnByZXBhcmVFeHRlcm5hbFVybCh0aGlzLnJvdXRlci5zZXJpYWxpemVVcmwodGhpcy5yb3V0ZXJMaW5rLnVybFRyZWUpKTtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmhyZWYgPSBocmVmO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgb25DbGljayhldjogVUlFdmVudCkge1xuICAgIHRoaXMubmF2Q3RybC5zZXREaXJlY3Rpb24odGhpcy5yb3V0ZXJEaXJlY3Rpb24sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzLnJvdXRlckFuaW1hdGlvbik7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgfVxufVxuIl19