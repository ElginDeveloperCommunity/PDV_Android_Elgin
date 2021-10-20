import * as tslib_1 from "tslib";
var RadioValueAccessor_1;
import { Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from './value-accessor';
let RadioValueAccessor = RadioValueAccessor_1 = class RadioValueAccessor extends ValueAccessor {
    constructor(injector, el) {
        super(injector, el);
    }
    _handleIonSelect(el) {
        this.handleChangeEvent(el, el.checked);
    }
};
RadioValueAccessor.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef }
];
tslib_1.__decorate([
    HostListener('ionSelect', ['$event.target'])
], RadioValueAccessor.prototype, "_handleIonSelect", null);
RadioValueAccessor = RadioValueAccessor_1 = tslib_1.__decorate([
    Directive({
        /* tslint:disable-next-line:directive-selector */
        selector: 'ion-radio',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: RadioValueAccessor_1,
                multi: true
            }
        ]
    })
], RadioValueAccessor);
export { RadioValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8tdmFsdWUtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvY29udHJvbC12YWx1ZS1hY2Nlc3NvcnMvcmFkaW8tdmFsdWUtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQWFqRCxJQUFhLGtCQUFrQiwwQkFBL0IsTUFBYSxrQkFBbUIsU0FBUSxhQUFhO0lBRW5ELFlBQVksUUFBa0IsRUFBRSxFQUFjO1FBQzVDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUdELGdCQUFnQixDQUFDLEVBQU87UUFDdEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNGLENBQUE7O1lBUnVCLFFBQVE7WUFBTSxVQUFVOztBQUs5QztJQURDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQzswREFHNUM7QUFUVSxrQkFBa0I7SUFYOUIsU0FBUyxDQUFDO1FBQ1QsaURBQWlEO1FBQ2pELFFBQVEsRUFBRSxXQUFXO1FBQ3JCLFNBQVMsRUFBRTtZQUNUO2dCQUNFLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxvQkFBa0I7Z0JBQy9CLEtBQUssRUFBRSxJQUFJO2FBQ1o7U0FDRjtLQUNGLENBQUM7R0FDVyxrQkFBa0IsQ0FVOUI7U0FWWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnLi92YWx1ZS1hY2Nlc3Nvcic7XG5cbkBEaXJlY3RpdmUoe1xuICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yICovXG4gIHNlbGVjdG9yOiAnaW9uLXJhZGlvJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogUmFkaW9WYWx1ZUFjY2Vzc29yLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgUmFkaW9WYWx1ZUFjY2Vzc29yIGV4dGVuZHMgVmFsdWVBY2Nlc3NvciB7XG5cbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBlbDogRWxlbWVudFJlZikge1xuICAgIHN1cGVyKGluamVjdG9yLCBlbCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdpb25TZWxlY3QnLCBbJyRldmVudC50YXJnZXQnXSlcbiAgX2hhbmRsZUlvblNlbGVjdChlbDogYW55KSB7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2VFdmVudChlbCwgZWwuY2hlY2tlZCk7XG4gIH1cbn1cbiJdfQ==