import * as tslib_1 from "tslib";
import { Directive, HostListener, Optional } from '@angular/core';
import { Config } from '../../providers/config';
import { NavController } from '../../providers/nav-controller';
import { IonRouterOutlet } from './ion-router-outlet';
var IonBackButtonDelegate = /** @class */ (function () {
    function IonBackButtonDelegate(routerOutlet, navCtrl, config) {
        this.routerOutlet = routerOutlet;
        this.navCtrl = navCtrl;
        this.config = config;
    }
    /**
     * @internal
     */
    IonBackButtonDelegate.prototype.onClick = function (ev) {
        var defaultHref = this.defaultHref || this.config.get('backButtonDefaultHref');
        if (this.routerOutlet && this.routerOutlet.canGoBack()) {
            this.navCtrl.setDirection('back', undefined, undefined, this.routerAnimation);
            this.routerOutlet.pop();
            ev.preventDefault();
        }
        else if (defaultHref != null) {
            this.navCtrl.navigateBack(defaultHref, { animation: this.routerAnimation });
            ev.preventDefault();
        }
    };
    IonBackButtonDelegate.ctorParameters = function () { return [
        { type: IonRouterOutlet, decorators: [{ type: Optional }] },
        { type: NavController },
        { type: Config }
    ]; };
    tslib_1.__decorate([
        HostListener('click', ['$event'])
    ], IonBackButtonDelegate.prototype, "onClick", null);
    IonBackButtonDelegate = tslib_1.__decorate([
        Directive({
            selector: 'ion-back-button',
            inputs: ['defaultHref', 'routerAnimation'],
        }),
        tslib_1.__param(0, Optional())
    ], IonBackButtonDelegate);
    return IonBackButtonDelegate;
}());
export { IonBackButtonDelegate };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uLWJhY2stYnV0dG9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJkaXJlY3RpdmVzL25hdmlnYXRpb24vaW9uLWJhY2stYnV0dG9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHbEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUUvRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFNdEQ7SUFLRSwrQkFDc0IsWUFBNkIsRUFDekMsT0FBc0IsRUFDdEIsTUFBYztRQUZGLGlCQUFZLEdBQVosWUFBWSxDQUFpQjtRQUN6QyxZQUFPLEdBQVAsT0FBTyxDQUFlO1FBQ3RCLFdBQU0sR0FBTixNQUFNLENBQVE7SUFDckIsQ0FBQztJQUVKOztPQUVHO0lBRUgsdUNBQU8sR0FBUCxVQUFRLEVBQVM7UUFDZixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFFakYsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzlFLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDeEIsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3JCO2FBQU0sSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO1lBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztZQUM1RSxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDOztnQkFwQm1DLGVBQWUsdUJBQWhELFFBQVE7Z0JBQ1EsYUFBYTtnQkFDZCxNQUFNOztJQU94QjtRQURDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3REFZakM7SUExQlUscUJBQXFCO1FBSmpDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsTUFBTSxFQUFFLENBQUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDO1NBQzNDLENBQUM7UUFPRyxtQkFBQSxRQUFRLEVBQUUsQ0FBQTtPQU5GLHFCQUFxQixDQTJCakM7SUFBRCw0QkFBQztDQUFBLEFBM0JELElBMkJDO1NBM0JZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSG9zdExpc3RlbmVyLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQW5pbWF0aW9uQnVpbGRlciB9IGZyb20gJ0Bpb25pYy9jb3JlJztcblxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL2NvbmZpZyc7XG5pbXBvcnQgeyBOYXZDb250cm9sbGVyIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL25hdi1jb250cm9sbGVyJztcblxuaW1wb3J0IHsgSW9uUm91dGVyT3V0bGV0IH0gZnJvbSAnLi9pb24tcm91dGVyLW91dGxldCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lvbi1iYWNrLWJ1dHRvbicsXG4gIGlucHV0czogWydkZWZhdWx0SHJlZicsICdyb3V0ZXJBbmltYXRpb24nXSxcbn0pXG5leHBvcnQgY2xhc3MgSW9uQmFja0J1dHRvbkRlbGVnYXRlIHtcblxuICBkZWZhdWx0SHJlZjogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbDtcbiAgcm91dGVyQW5pbWF0aW9uPzogQW5pbWF0aW9uQnVpbGRlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIHJvdXRlck91dGxldDogSW9uUm91dGVyT3V0bGV0LFxuICAgIHByaXZhdGUgbmF2Q3RybDogTmF2Q29udHJvbGxlcixcbiAgICBwcml2YXRlIGNvbmZpZzogQ29uZmlnXG4gICkge31cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uQ2xpY2soZXY6IEV2ZW50KSB7XG4gICAgY29uc3QgZGVmYXVsdEhyZWYgPSB0aGlzLmRlZmF1bHRIcmVmIHx8IHRoaXMuY29uZmlnLmdldCgnYmFja0J1dHRvbkRlZmF1bHRIcmVmJyk7XG5cbiAgICBpZiAodGhpcy5yb3V0ZXJPdXRsZXQgJiYgdGhpcy5yb3V0ZXJPdXRsZXQuY2FuR29CYWNrKCkpIHtcbiAgICAgIHRoaXMubmF2Q3RybC5zZXREaXJlY3Rpb24oJ2JhY2snLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcy5yb3V0ZXJBbmltYXRpb24pO1xuICAgICAgdGhpcy5yb3V0ZXJPdXRsZXQucG9wKCk7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gZWxzZSBpZiAoZGVmYXVsdEhyZWYgIT0gbnVsbCkge1xuICAgICAgdGhpcy5uYXZDdHJsLm5hdmlnYXRlQmFjayhkZWZhdWx0SHJlZiwgeyBhbmltYXRpb246IHRoaXMucm91dGVyQW5pbWF0aW9uIH0pO1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==