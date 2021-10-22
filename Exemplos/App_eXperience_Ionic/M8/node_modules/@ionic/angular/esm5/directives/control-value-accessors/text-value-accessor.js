import * as tslib_1 from "tslib";
import { Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from './value-accessor';
var TextValueAccessor = /** @class */ (function (_super) {
    tslib_1.__extends(TextValueAccessor, _super);
    function TextValueAccessor(injector, el) {
        return _super.call(this, injector, el) || this;
    }
    TextValueAccessor_1 = TextValueAccessor;
    TextValueAccessor.prototype._handleInputEvent = function (el) {
        this.handleChangeEvent(el, el.value);
    };
    var TextValueAccessor_1;
    TextValueAccessor.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef }
    ]; };
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
    return TextValueAccessor;
}(ValueAccessor));
export { TextValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC12YWx1ZS1hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9jb250cm9sLXZhbHVlLWFjY2Vzc29ycy90ZXh0LXZhbHVlLWFjY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQWFqRDtJQUF1Qyw2Q0FBYTtJQUVsRCwyQkFBWSxRQUFrQixFQUFFLEVBQWM7ZUFDNUMsa0JBQU0sUUFBUSxFQUFFLEVBQUUsQ0FBQztJQUNyQixDQUFDOzBCQUpVLGlCQUFpQjtJQU81Qiw2Q0FBaUIsR0FBakIsVUFBa0IsRUFBTztRQUN2QixJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QyxDQUFDOzs7Z0JBUHFCLFFBQVE7Z0JBQU0sVUFBVTs7SUFLOUM7UUFEQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7OERBRzVDO0lBVFUsaUJBQWlCO1FBWDdCLFNBQVMsQ0FBQztZQUNULGlEQUFpRDtZQUNqRCxRQUFRLEVBQUUseURBQXlEO1lBQ25FLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixXQUFXLEVBQUUsbUJBQWlCO29CQUM5QixLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQztPQUNXLGlCQUFpQixDQVU3QjtJQUFELHdCQUFDO0NBQUEsQUFWRCxDQUF1QyxhQUFhLEdBVW5EO1NBVlksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgVmFsdWVBY2Nlc3NvciB9IGZyb20gJy4vdmFsdWUtYWNjZXNzb3InO1xuXG5ARGlyZWN0aXZlKHtcbiAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvciAqL1xuICBzZWxlY3RvcjogJ2lvbi1pbnB1dDpub3QoW3R5cGU9bnVtYmVyXSksaW9uLXRleHRhcmVhLGlvbi1zZWFyY2hiYXInLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBUZXh0VmFsdWVBY2Nlc3NvcixcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFRleHRWYWx1ZUFjY2Vzc29yIGV4dGVuZHMgVmFsdWVBY2Nlc3NvciB7XG5cbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBlbDogRWxlbWVudFJlZikge1xuICAgIHN1cGVyKGluamVjdG9yLCBlbCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdpb25DaGFuZ2UnLCBbJyRldmVudC50YXJnZXQnXSlcbiAgX2hhbmRsZUlucHV0RXZlbnQoZWw6IGFueSkge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlRXZlbnQoZWwsIGVsLnZhbHVlKTtcbiAgfVxufVxuIl19