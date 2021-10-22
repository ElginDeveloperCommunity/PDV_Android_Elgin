import * as tslib_1 from "tslib";
import { Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor, setIonicClasses } from './value-accessor';
var BooleanValueAccessor = /** @class */ (function (_super) {
    tslib_1.__extends(BooleanValueAccessor, _super);
    function BooleanValueAccessor(injector, el) {
        return _super.call(this, injector, el) || this;
    }
    BooleanValueAccessor_1 = BooleanValueAccessor;
    BooleanValueAccessor.prototype.writeValue = function (value) {
        this.el.nativeElement.checked = this.lastValue = value == null ? false : value;
        setIonicClasses(this.el);
    };
    BooleanValueAccessor.prototype._handleIonChange = function (el) {
        this.handleChangeEvent(el, el.checked);
    };
    var BooleanValueAccessor_1;
    BooleanValueAccessor.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef }
    ]; };
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
    return BooleanValueAccessor;
}(ValueAccessor));
export { BooleanValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vbGVhbi12YWx1ZS1hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9jb250cm9sLXZhbHVlLWFjY2Vzc29ycy9ib29sZWFuLXZhbHVlLWFjY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFhbEU7SUFBMEMsZ0RBQWE7SUFFckQsOEJBQVksUUFBa0IsRUFBRSxFQUFjO2VBQzVDLGtCQUFNLFFBQVEsRUFBRSxFQUFFLENBQUM7SUFDckIsQ0FBQzs2QkFKVSxvQkFBb0I7SUFNL0IseUNBQVUsR0FBVixVQUFXLEtBQVU7UUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDL0UsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBR0QsK0NBQWdCLEdBQWhCLFVBQWlCLEVBQU87UUFDdEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsQ0FBQzs7O2dCQVpxQixRQUFRO2dCQUFNLFVBQVU7O0lBVTlDO1FBREMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dFQUc1QztJQWRVLG9CQUFvQjtRQVhoQyxTQUFTLENBQUM7WUFDVCxpREFBaUQ7WUFDakQsUUFBUSxFQUFFLHlCQUF5QjtZQUNuQyxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLHNCQUFvQjtvQkFDakMsS0FBSyxFQUFFLElBQUk7aUJBQ1o7YUFDRjtTQUNGLENBQUM7T0FDVyxvQkFBb0IsQ0FlaEM7SUFBRCwyQkFBQztDQUFBLEFBZkQsQ0FBMEMsYUFBYSxHQWV0RDtTQWZZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IFZhbHVlQWNjZXNzb3IsIHNldElvbmljQ2xhc3NlcyB9IGZyb20gJy4vdmFsdWUtYWNjZXNzb3InO1xuXG5ARGlyZWN0aXZlKHtcbiAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvciAqL1xuICBzZWxlY3RvcjogJ2lvbi1jaGVja2JveCxpb24tdG9nZ2xlJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogQm9vbGVhblZhbHVlQWNjZXNzb3IsXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBCb29sZWFuVmFsdWVBY2Nlc3NvciBleHRlbmRzIFZhbHVlQWNjZXNzb3Ige1xuXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgZWw6IEVsZW1lbnRSZWYpIHtcbiAgICBzdXBlcihpbmplY3RvciwgZWwpO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoZWNrZWQgPSB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlID09IG51bGwgPyBmYWxzZSA6IHZhbHVlO1xuICAgIHNldElvbmljQ2xhc3Nlcyh0aGlzLmVsKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2lvbkNoYW5nZScsIFsnJGV2ZW50LnRhcmdldCddKVxuICBfaGFuZGxlSW9uQ2hhbmdlKGVsOiBhbnkpIHtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZUV2ZW50KGVsLCBlbC5jaGVja2VkKTtcbiAgfVxufVxuIl19