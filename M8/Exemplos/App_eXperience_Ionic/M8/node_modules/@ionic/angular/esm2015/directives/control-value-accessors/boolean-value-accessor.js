import * as tslib_1 from "tslib";
var BooleanValueAccessor_1;
import { Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor, setIonicClasses } from './value-accessor';
let BooleanValueAccessor = BooleanValueAccessor_1 = class BooleanValueAccessor extends ValueAccessor {
    constructor(injector, el) {
        super(injector, el);
    }
    writeValue(value) {
        this.el.nativeElement.checked = this.lastValue = value == null ? false : value;
        setIonicClasses(this.el);
    }
    _handleIonChange(el) {
        this.handleChangeEvent(el, el.checked);
    }
};
BooleanValueAccessor.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef }
];
tslib_1.__decorate([
    HostListener('ionChange', ['$event.target'])
], BooleanValueAccessor.prototype, "_handleIonChange", null);
BooleanValueAccessor = BooleanValueAccessor_1 = tslib_1.__decorate([
    Directive({
        /* tslint:disable-next-line:directive-selector */
        selector: 'ion-checkbox,ion-toggle',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: BooleanValueAccessor_1,
                multi: true
            }
        ]
    })
], BooleanValueAccessor);
export { BooleanValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vbGVhbi12YWx1ZS1hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9jb250cm9sLXZhbHVlLWFjY2Vzc29ycy9ib29sZWFuLXZhbHVlLWFjY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBYWxFLElBQWEsb0JBQW9CLDRCQUFqQyxNQUFhLG9CQUFxQixTQUFRLGFBQWE7SUFFckQsWUFBWSxRQUFrQixFQUFFLEVBQWM7UUFDNUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQVU7UUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDL0UsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBR0QsZ0JBQWdCLENBQUMsRUFBTztRQUN0QixJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxDQUFDO0NBQ0YsQ0FBQTs7WUFidUIsUUFBUTtZQUFNLFVBQVU7O0FBVTlDO0lBREMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDOzREQUc1QztBQWRVLG9CQUFvQjtJQVhoQyxTQUFTLENBQUM7UUFDVCxpREFBaUQ7UUFDakQsUUFBUSxFQUFFLHlCQUF5QjtRQUNuQyxTQUFTLEVBQUU7WUFDVDtnQkFDRSxPQUFPLEVBQUUsaUJBQWlCO2dCQUMxQixXQUFXLEVBQUUsc0JBQW9CO2dCQUNqQyxLQUFLLEVBQUUsSUFBSTthQUNaO1NBQ0Y7S0FDRixDQUFDO0dBQ1csb0JBQW9CLENBZWhDO1NBZlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgVmFsdWVBY2Nlc3Nvciwgc2V0SW9uaWNDbGFzc2VzIH0gZnJvbSAnLi92YWx1ZS1hY2Nlc3Nvcic7XG5cbkBEaXJlY3RpdmUoe1xuICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yICovXG4gIHNlbGVjdG9yOiAnaW9uLWNoZWNrYm94LGlvbi10b2dnbGUnLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBCb29sZWFuVmFsdWVBY2Nlc3NvcixcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEJvb2xlYW5WYWx1ZUFjY2Vzc29yIGV4dGVuZHMgVmFsdWVBY2Nlc3NvciB7XG5cbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBlbDogRWxlbWVudFJlZikge1xuICAgIHN1cGVyKGluamVjdG9yLCBlbCk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hlY2tlZCA9IHRoaXMubGFzdFZhbHVlID0gdmFsdWUgPT0gbnVsbCA/IGZhbHNlIDogdmFsdWU7XG4gICAgc2V0SW9uaWNDbGFzc2VzKHRoaXMuZWwpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignaW9uQ2hhbmdlJywgWyckZXZlbnQudGFyZ2V0J10pXG4gIF9oYW5kbGVJb25DaGFuZ2UoZWw6IGFueSkge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlRXZlbnQoZWwsIGVsLmNoZWNrZWQpO1xuICB9XG59XG4iXX0=