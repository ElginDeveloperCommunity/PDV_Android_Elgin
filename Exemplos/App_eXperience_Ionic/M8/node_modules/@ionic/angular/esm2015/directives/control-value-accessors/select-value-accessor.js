import * as tslib_1 from "tslib";
var SelectValueAccessor_1;
import { Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from './value-accessor';
let SelectValueAccessor = SelectValueAccessor_1 = class SelectValueAccessor extends ValueAccessor {
    constructor(injector, el) {
        super(injector, el);
    }
    _handleChangeEvent(el) {
        this.handleChangeEvent(el, el.value);
    }
};
SelectValueAccessor.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef }
];
tslib_1.__decorate([
    HostListener('ionChange', ['$event.target'])
], SelectValueAccessor.prototype, "_handleChangeEvent", null);
SelectValueAccessor = SelectValueAccessor_1 = tslib_1.__decorate([
    Directive({
        /* tslint:disable-next-line:directive-selector */
        selector: 'ion-range, ion-select, ion-radio-group, ion-segment, ion-datetime',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: SelectValueAccessor_1,
                multi: true
            }
        ]
    })
], SelectValueAccessor);
export { SelectValueAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXZhbHVlLWFjY2Vzc29yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJkaXJlY3RpdmVzL2NvbnRyb2wtdmFsdWUtYWNjZXNzb3JzL3NlbGVjdC12YWx1ZS1hY2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBYWpELElBQWEsbUJBQW1CLDJCQUFoQyxNQUFhLG1CQUFvQixTQUFRLGFBQWE7SUFFcEQsWUFBWSxRQUFrQixFQUFFLEVBQWM7UUFDNUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBR0Qsa0JBQWtCLENBQUMsRUFBTztRQUN4QixJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0YsQ0FBQTs7WUFSdUIsUUFBUTtZQUFNLFVBQVU7O0FBSzlDO0lBREMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDOzZEQUc1QztBQVRVLG1CQUFtQjtJQVgvQixTQUFTLENBQUM7UUFDVCxpREFBaUQ7UUFDakQsUUFBUSxFQUFFLG1FQUFtRTtRQUM3RSxTQUFTLEVBQUU7WUFDVDtnQkFDRSxPQUFPLEVBQUUsaUJBQWlCO2dCQUMxQixXQUFXLEVBQUUscUJBQW1CO2dCQUNoQyxLQUFLLEVBQUUsSUFBSTthQUNaO1NBQ0Y7S0FDRixDQUFDO0dBQ1csbUJBQW1CLENBVS9CO1NBVlksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgVmFsdWVBY2Nlc3NvciB9IGZyb20gJy4vdmFsdWUtYWNjZXNzb3InO1xuXG5ARGlyZWN0aXZlKHtcbiAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvciAqL1xuICBzZWxlY3RvcjogJ2lvbi1yYW5nZSwgaW9uLXNlbGVjdCwgaW9uLXJhZGlvLWdyb3VwLCBpb24tc2VnbWVudCwgaW9uLWRhdGV0aW1lJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogU2VsZWN0VmFsdWVBY2Nlc3NvcixcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdFZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBWYWx1ZUFjY2Vzc29yIHtcblxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIGVsOiBFbGVtZW50UmVmKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IsIGVsKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2lvbkNoYW5nZScsIFsnJGV2ZW50LnRhcmdldCddKVxuICBfaGFuZGxlQ2hhbmdlRXZlbnQoZWw6IGFueSkge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlRXZlbnQoZWwsIGVsLnZhbHVlKTtcbiAgfVxufVxuIl19