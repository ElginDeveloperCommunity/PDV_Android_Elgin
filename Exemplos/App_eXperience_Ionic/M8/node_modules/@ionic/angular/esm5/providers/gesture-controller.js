import * as tslib_1 from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { createGesture } from '@ionic/core';
import * as i0 from "@angular/core";
var GestureController = /** @class */ (function () {
    function GestureController(zone) {
        this.zone = zone;
    }
    /**
     * Create a new gesture
     */
    GestureController.prototype.create = function (opts, runInsideAngularZone) {
        var _this = this;
        if (runInsideAngularZone === void 0) { runInsideAngularZone = false; }
        if (runInsideAngularZone) {
            Object.getOwnPropertyNames(opts).forEach(function (key) {
                if (typeof opts[key] === 'function') {
                    var fn_1 = opts[key];
                    opts[key] = function () {
                        var props = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            props[_i] = arguments[_i];
                        }
                        return _this.zone.run(function () { return fn_1.apply(void 0, tslib_1.__spread(props)); });
                    };
                }
            });
        }
        return createGesture(opts);
    };
    GestureController.ctorParameters = function () { return [
        { type: NgZone }
    ]; };
    GestureController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function GestureController_Factory() { return new GestureController(i0.ɵɵinject(i0.NgZone)); }, token: GestureController, providedIn: "root" });
    GestureController = tslib_1.__decorate([
        Injectable({
            providedIn: 'root',
        })
    ], GestureController);
    return GestureController;
}());
export { GestureController };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VzdHVyZS1jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJwcm92aWRlcnMvZ2VzdHVyZS1jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQTBCLGFBQWEsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFLcEU7SUFDRSwyQkFBb0IsSUFBWTtRQUFaLFNBQUksR0FBSixJQUFJLENBQVE7SUFBRyxDQUFDO0lBQ3BDOztPQUVHO0lBQ0gsa0NBQU0sR0FBTixVQUFPLElBQW1CLEVBQUUsb0JBQTRCO1FBQXhELGlCQVdDO1FBWDJCLHFDQUFBLEVBQUEsNEJBQTRCO1FBQ3RELElBQUksb0JBQW9CLEVBQUU7WUFDeEIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUc7Z0JBQzFDLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssVUFBVSxFQUFFO29CQUNuQyxJQUFNLElBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRzt3QkFBQyxlQUFROzZCQUFSLFVBQVEsRUFBUixxQkFBUSxFQUFSLElBQVE7NEJBQVIsMEJBQVE7O3dCQUFLLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBTSxPQUFBLElBQUUsZ0NBQUksS0FBSyxJQUFYLENBQVksQ0FBQztvQkFBakMsQ0FBaUMsQ0FBQztpQkFDN0Q7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQzs7Z0JBZnlCLE1BQU07OztJQURyQixpQkFBaUI7UUFIN0IsVUFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQztPQUNXLGlCQUFpQixDQWlCN0I7NEJBdkJEO0NBdUJDLEFBakJELElBaUJDO1NBakJZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR2VzdHVyZSwgR2VzdHVyZUNvbmZpZywgY3JlYXRlR2VzdHVyZSB9IGZyb20gJ0Bpb25pYy9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEdlc3R1cmVDb250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHt9XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgZ2VzdHVyZVxuICAgKi9cbiAgY3JlYXRlKG9wdHM6IEdlc3R1cmVDb25maWcsIHJ1bkluc2lkZUFuZ3VsYXJab25lID0gZmFsc2UpOiBHZXN0dXJlIHtcbiAgICBpZiAocnVuSW5zaWRlQW5ndWxhclpvbmUpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9wdHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRzW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjb25zdCBmbiA9IG9wdHNba2V5XTtcbiAgICAgICAgICBvcHRzW2tleV0gPSAoLi4ucHJvcHMpID0+IHRoaXMuem9uZS5ydW4oKCkgPT4gZm4oLi4ucHJvcHMpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZUdlc3R1cmUob3B0cyk7XG4gIH1cbn1cbiJdfQ==