import * as tslib_1 from "tslib";
import { Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from './value-accessor';
var RadioValueAccessor = /** @class */ (function (_super) {
    tslib_1.__extends(RadioValueAccessor, _super);
    function RadioValueAccessor(injector, el) {
        return _super.call(this, injector, el) || this;
    }
    RadioValueAccessor_1 = RadioValueAccessor;
    RadioValueAccessor.prototype._handleIonSelect = function (el) {
        this.handleChangeEvent(el, el.checked);
    };
    var RadioValueAccessor_1;
    RadioValueAccessor.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef }
    ]; };
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
    return RadioValueAccessor;
}(ValueAccessor));
export { RadioValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8tdmFsdWUtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvY29udHJvbC12YWx1ZS1hY2Nlc3NvcnMvcmFkaW8tdmFsdWUtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBYWpEO0lBQXdDLDhDQUFhO0lBRW5ELDRCQUFZLFFBQWtCLEVBQUUsRUFBYztlQUM1QyxrQkFBTSxRQUFRLEVBQUUsRUFBRSxDQUFDO0lBQ3JCLENBQUM7MkJBSlUsa0JBQWtCO0lBTzdCLDZDQUFnQixHQUFoQixVQUFpQixFQUFPO1FBQ3RCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7OztnQkFQcUIsUUFBUTtnQkFBTSxVQUFVOztJQUs5QztRQURDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQzs4REFHNUM7SUFUVSxrQkFBa0I7UUFYOUIsU0FBUyxDQUFDO1lBQ1QsaURBQWlEO1lBQ2pELFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixXQUFXLEVBQUUsb0JBQWtCO29CQUMvQixLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQztPQUNXLGtCQUFrQixDQVU5QjtJQUFELHlCQUFDO0NBQUEsQUFWRCxDQUF3QyxhQUFhLEdBVXBEO1NBVlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgVmFsdWVBY2Nlc3NvciB9IGZyb20gJy4vdmFsdWUtYWNjZXNzb3InO1xuXG5ARGlyZWN0aXZlKHtcbiAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvciAqL1xuICBzZWxlY3RvcjogJ2lvbi1yYWRpbycsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IFJhZGlvVmFsdWVBY2Nlc3NvcixcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFJhZGlvVmFsdWVBY2Nlc3NvciBleHRlbmRzIFZhbHVlQWNjZXNzb3Ige1xuXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgZWw6IEVsZW1lbnRSZWYpIHtcbiAgICBzdXBlcihpbmplY3RvciwgZWwpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignaW9uU2VsZWN0JywgWyckZXZlbnQudGFyZ2V0J10pXG4gIF9oYW5kbGVJb25TZWxlY3QoZWw6IGFueSkge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlRXZlbnQoZWwsIGVsLmNoZWNrZWQpO1xuICB9XG59XG4iXX0=