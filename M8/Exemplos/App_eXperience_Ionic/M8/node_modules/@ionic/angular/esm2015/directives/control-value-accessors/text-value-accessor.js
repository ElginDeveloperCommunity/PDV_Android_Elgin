import * as tslib_1 from "tslib";
var TextValueAccessor_1;
import { Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from './value-accessor';
let TextValueAccessor = TextValueAccessor_1 = class TextValueAccessor extends ValueAccessor {
    constructor(injector, el) {
        super(injector, el);
    }
    _handleInputEvent(el) {
        this.handleChangeEvent(el, el.value);
    }
};
TextValueAccessor.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef }
];
tslib_1.__decorate([
    HostListener('ionChange', ['$event.target'])
], TextValueAccessor.prototype, "_handleInputEvent", null);
TextValueAccessor = TextValueAccessor_1 = tslib_1.__decorate([
    Directive({
        /* tslint:disable-next-line:directive-selector */
        selector: 'ion-input:not([type=number]),ion-textarea,ion-searchbar',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: TextValueAccessor_1,
                multi: true
            }
        ]
    })
], TextValueAccessor);
export { TextValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC12YWx1ZS1hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9jb250cm9sLXZhbHVlLWFjY2Vzc29ycy90ZXh0LXZhbHVlLWFjY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFhakQsSUFBYSxpQkFBaUIseUJBQTlCLE1BQWEsaUJBQWtCLFNBQVEsYUFBYTtJQUVsRCxZQUFZLFFBQWtCLEVBQUUsRUFBYztRQUM1QyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFHRCxpQkFBaUIsQ0FBQyxFQUFPO1FBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Q0FDRixDQUFBOztZQVJ1QixRQUFRO1lBQU0sVUFBVTs7QUFLOUM7SUFEQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7MERBRzVDO0FBVFUsaUJBQWlCO0lBWDdCLFNBQVMsQ0FBQztRQUNULGlEQUFpRDtRQUNqRCxRQUFRLEVBQUUseURBQXlEO1FBQ25FLFNBQVMsRUFBRTtZQUNUO2dCQUNFLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxtQkFBaUI7Z0JBQzlCLEtBQUssRUFBRSxJQUFJO2FBQ1o7U0FDRjtLQUNGLENBQUM7R0FDVyxpQkFBaUIsQ0FVN0I7U0FWWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnLi92YWx1ZS1hY2Nlc3Nvcic7XG5cbkBEaXJlY3RpdmUoe1xuICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yICovXG4gIHNlbGVjdG9yOiAnaW9uLWlucHV0Om5vdChbdHlwZT1udW1iZXJdKSxpb24tdGV4dGFyZWEsaW9uLXNlYXJjaGJhcicsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IFRleHRWYWx1ZUFjY2Vzc29yLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgVGV4dFZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBWYWx1ZUFjY2Vzc29yIHtcblxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIGVsOiBFbGVtZW50UmVmKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IsIGVsKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2lvbkNoYW5nZScsIFsnJGV2ZW50LnRhcmdldCddKVxuICBfaGFuZGxlSW5wdXRFdmVudChlbDogYW55KSB7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2VFdmVudChlbCwgZWwudmFsdWUpO1xuICB9XG59XG4iXX0=