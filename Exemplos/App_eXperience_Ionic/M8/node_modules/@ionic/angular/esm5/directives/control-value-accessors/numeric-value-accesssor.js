import * as tslib_1 from "tslib";
import { Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from './value-accessor';
var NumericValueAccessor = /** @class */ (function (_super) {
    tslib_1.__extends(NumericValueAccessor, _super);
    function NumericValueAccessor(injector, el) {
        return _super.call(this, injector, el) || this;
    }
    NumericValueAccessor_1 = NumericValueAccessor;
    NumericValueAccessor.prototype._handleIonChange = function (el) {
        this.handleChangeEvent(el, el.value);
    };
    NumericValueAccessor.prototype.registerOnChange = function (fn) {
        _super.prototype.registerOnChange.call(this, function (value) {
            fn(value === '' ? null : parseFloat(value));
        });
    };
    var NumericValueAccessor_1;
    NumericValueAccessor.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef }
    ]; };
    tslib_1.__decorate([
        HostListener('ionChange', ['$event.target'])
    ], NumericValueAccessor.prototype, "_handleIonChange", null);
    NumericValueAccessor = NumericValueAccessor_1 = tslib_1.__decorate([
        Directive({
            /* tslint:disable-next-line:directive-selector */
            selector: 'ion-input[type=number]',
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: NumericValueAccessor_1,
                    multi: true
                }
            ]
        })
    ], NumericValueAccessor);
    return NumericValueAccessor;
}(ValueAccessor));
export { NumericValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtZXJpYy12YWx1ZS1hY2Nlc3Nzb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvY29udHJvbC12YWx1ZS1hY2Nlc3NvcnMvbnVtZXJpYy12YWx1ZS1hY2Nlc3Nzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBYWpEO0lBQTBDLGdEQUFhO0lBRXJELDhCQUFZLFFBQWtCLEVBQUUsRUFBYztlQUM1QyxrQkFBTSxRQUFRLEVBQUUsRUFBRSxDQUFDO0lBQ3JCLENBQUM7NkJBSlUsb0JBQW9CO0lBTy9CLCtDQUFnQixHQUFoQixVQUFpQixFQUFPO1FBQ3RCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCwrQ0FBZ0IsR0FBaEIsVUFBaUIsRUFBOEI7UUFDN0MsaUJBQU0sZ0JBQWdCLFlBQUMsVUFBQSxLQUFLO1lBQzFCLEVBQUUsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O2dCQWJxQixRQUFRO2dCQUFNLFVBQVU7O0lBSzlDO1FBREMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dFQUc1QztJQVRVLG9CQUFvQjtRQVhoQyxTQUFTLENBQUM7WUFDVCxpREFBaUQ7WUFDakQsUUFBUSxFQUFFLHdCQUF3QjtZQUNsQyxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLHNCQUFvQjtvQkFDakMsS0FBSyxFQUFFLElBQUk7aUJBQ1o7YUFDRjtTQUNGLENBQUM7T0FDVyxvQkFBb0IsQ0FnQmhDO0lBQUQsMkJBQUM7Q0FBQSxBQWhCRCxDQUEwQyxhQUFhLEdBZ0J0RDtTQWhCWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnLi92YWx1ZS1hY2Nlc3Nvcic7XG5cbkBEaXJlY3RpdmUoe1xuICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yICovXG4gIHNlbGVjdG9yOiAnaW9uLWlucHV0W3R5cGU9bnVtYmVyXScsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IE51bWVyaWNWYWx1ZUFjY2Vzc29yLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTnVtZXJpY1ZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBWYWx1ZUFjY2Vzc29yIHtcblxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIGVsOiBFbGVtZW50UmVmKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IsIGVsKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2lvbkNoYW5nZScsIFsnJGV2ZW50LnRhcmdldCddKVxuICBfaGFuZGxlSW9uQ2hhbmdlKGVsOiBhbnkpIHtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZUV2ZW50KGVsLCBlbC52YWx1ZSk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogbnVtYmVyIHwgbnVsbCkgPT4gdm9pZCkge1xuICAgIHN1cGVyLnJlZ2lzdGVyT25DaGFuZ2UodmFsdWUgPT4ge1xuICAgICAgZm4odmFsdWUgPT09ICcnID8gbnVsbCA6IHBhcnNlRmxvYXQodmFsdWUpKTtcbiAgICB9KTtcbiAgfVxufVxuIl19