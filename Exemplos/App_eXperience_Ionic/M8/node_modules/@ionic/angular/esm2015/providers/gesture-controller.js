import * as tslib_1 from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { createGesture } from '@ionic/core';
import * as i0 from "@angular/core";
let GestureController = class GestureController {
    constructor(zone) {
        this.zone = zone;
    }
    /**
     * Create a new gesture
     */
    create(opts, runInsideAngularZone = false) {
        if (runInsideAngularZone) {
            Object.getOwnPropertyNames(opts).forEach(key => {
                if (typeof opts[key] === 'function') {
                    const fn = opts[key];
                    opts[key] = (...props) => this.zone.run(() => fn(...props));
                }
            });
        }
        return createGesture(opts);
    }
};
GestureController.ctorParameters = () => [
    { type: NgZone }
];
GestureController.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function GestureController_Factory() { return new GestureController(i0.ɵɵinject(i0.NgZone)); }, token: GestureController, providedIn: "root" });
GestureController = tslib_1.__decorate([
    Injectable({
        providedIn: 'root',
    })
], GestureController);
export { GestureController };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VzdHVyZS1jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJwcm92aWRlcnMvZ2VzdHVyZS1jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQTBCLGFBQWEsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFLcEUsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBaUI7SUFDNUIsWUFBb0IsSUFBWTtRQUFaLFNBQUksR0FBSixJQUFJLENBQVE7SUFBRyxDQUFDO0lBQ3BDOztPQUVHO0lBQ0gsTUFBTSxDQUFDLElBQW1CLEVBQUUsb0JBQW9CLEdBQUcsS0FBSztRQUN0RCxJQUFJLG9CQUFvQixFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzdDLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssVUFBVSxFQUFFO29CQUNuQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUM3RDtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0NBQ0YsQ0FBQTs7WUFoQjJCLE1BQU07OztBQURyQixpQkFBaUI7SUFIN0IsVUFBVSxDQUFDO1FBQ1YsVUFBVSxFQUFFLE1BQU07S0FDbkIsQ0FBQztHQUNXLGlCQUFpQixDQWlCN0I7U0FqQlksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHZXN0dXJlLCBHZXN0dXJlQ29uZmlnLCBjcmVhdGVHZXN0dXJlIH0gZnJvbSAnQGlvbmljL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgR2VzdHVyZUNvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHpvbmU6IE5nWm9uZSkge31cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBnZXN0dXJlXG4gICAqL1xuICBjcmVhdGUob3B0czogR2VzdHVyZUNvbmZpZywgcnVuSW5zaWRlQW5ndWxhclpvbmUgPSBmYWxzZSk6IEdlc3R1cmUge1xuICAgIGlmIChydW5JbnNpZGVBbmd1bGFyWm9uZSkge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob3B0cykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIG9wdHNba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNvbnN0IGZuID0gb3B0c1trZXldO1xuICAgICAgICAgIG9wdHNba2V5XSA9ICguLi5wcm9wcykgPT4gdGhpcy56b25lLnJ1bigoKSA9PiBmbiguLi5wcm9wcykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlR2VzdHVyZShvcHRzKTtcbiAgfVxufVxuIl19