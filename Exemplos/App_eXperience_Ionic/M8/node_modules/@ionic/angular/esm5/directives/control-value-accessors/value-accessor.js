import * as tslib_1 from "tslib";
import { HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { raf } from '../../util/util';
var ValueAccessor = /** @class */ (function () {
    function ValueAccessor(injector, el) {
        this.injector = injector;
        this.el = el;
        this.onChange = function () { };
        this.onTouched = function () { };
    }
    ValueAccessor.prototype.writeValue = function (value) {
        /**
         * TODO for Ionic 6:
         * Change `value == null ? '' : value;`
         * to `value`. This was a fix for IE9, but IE9
         * is no longer supported; however, this change
         * is potentially a breaking change
         */
        this.el.nativeElement.value = this.lastValue = value == null ? '' : value;
        setIonicClasses(this.el);
    };
    ValueAccessor.prototype.handleChangeEvent = function (el, value) {
        if (el === this.el.nativeElement) {
            if (value !== this.lastValue) {
                this.lastValue = value;
                this.onChange(value);
            }
            setIonicClasses(this.el);
        }
    };
    ValueAccessor.prototype._handleBlurEvent = function (el) {
        if (el === this.el.nativeElement) {
            this.onTouched();
            setIonicClasses(this.el);
        }
    };
    ValueAccessor.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    ValueAccessor.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    ValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this.el.nativeElement.disabled = isDisabled;
    };
    ValueAccessor.prototype.ngOnDestroy = function () {
        if (this.statusChanges) {
            this.statusChanges.unsubscribe();
        }
    };
    ValueAccessor.prototype.ngAfterViewInit = function () {
        var _this = this;
        var ngControl;
        try {
            ngControl = this.injector.get(NgControl);
        }
        catch ( /* No FormControl or ngModel binding */_a) { /* No FormControl or ngModel binding */ }
        if (!ngControl) {
            return;
        }
        // Listen for changes in validity, disabled, or pending states
        if (ngControl.statusChanges) {
            this.statusChanges = ngControl.statusChanges.subscribe(function () { return setIonicClasses(_this.el); });
        }
        /**
         * TODO Remove this in favor of https://github.com/angular/angular/issues/10887
         * whenever it is implemented. Currently, Ionic's form status classes
         * do not react to changes when developers manually call
         * Angular form control methods such as markAsTouched.
         * This results in Ionic's form status classes being out
         * of sync with the ng form status classes.
         * This patches the methods to manually sync
         * the classes until this feature is implemented in Angular.
         */
        var formControl = ngControl.control;
        if (formControl) {
            var methodsToPatch = ['markAsTouched', 'markAllAsTouched', 'markAsUntouched', 'markAsDirty', 'markAsPristine'];
            methodsToPatch.forEach(function (method) {
                if (formControl[method]) {
                    var oldFn_1 = formControl[method].bind(formControl);
                    formControl[method] = function () {
                        var params = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            params[_i] = arguments[_i];
                        }
                        oldFn_1.apply(void 0, tslib_1.__spread(params));
                        setIonicClasses(_this.el);
                    };
                }
            });
        }
    };
    tslib_1.__decorate([
        HostListener('ionBlur', ['$event.target'])
    ], ValueAccessor.prototype, "_handleBlurEvent", null);
    return ValueAccessor;
}());
export { ValueAccessor };
export var setIonicClasses = function (element) {
    raf(function () {
        var input = element.nativeElement;
        var classes = getClasses(input);
        setClasses(input, classes);
        var item = input.closest('ion-item');
        if (item) {
            setClasses(item, classes);
        }
    });
};
var getClasses = function (element) {
    var classList = element.classList;
    var classes = [];
    for (var i = 0; i < classList.length; i++) {
        var item = classList.item(i);
        if (item !== null && startsWith(item, 'ng-')) {
            classes.push("ion-" + item.substr(3));
        }
    }
    return classes;
};
var ɵ0 = getClasses;
var setClasses = function (element, classes) {
    var classList = element.classList;
    [
        'ion-valid',
        'ion-invalid',
        'ion-touched',
        'ion-untouched',
        'ion-dirty',
        'ion-pristine'
    ].forEach(function (c) { return classList.remove(c); });
    classes.forEach(function (c) { return classList.add(c); });
};
var ɵ1 = setClasses;
var startsWith = function (input, search) {
    return input.substr(0, search.length) === search;
};
var ɵ2 = startsWith;
export { ɵ0, ɵ1, ɵ2 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWUtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvY29udHJvbC12YWx1ZS1hY2Nlc3NvcnMvdmFsdWUtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBNkIsWUFBWSxFQUE2QixNQUFNLGVBQWUsQ0FBQztBQUNuRyxPQUFPLEVBQXdCLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR2pFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0QztJQU9FLHVCQUFzQixRQUFrQixFQUFZLEVBQWM7UUFBNUMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFZLE9BQUUsR0FBRixFQUFFLENBQVk7UUFMMUQsYUFBUSxHQUF5QixjQUFXLENBQUMsQ0FBQztRQUM5QyxjQUFTLEdBQWUsY0FBVyxDQUFDLENBQUM7SUFJd0IsQ0FBQztJQUV0RSxrQ0FBVSxHQUFWLFVBQVcsS0FBVTtRQUNuQjs7Ozs7O1dBTUc7UUFDSCxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMxRSxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCx5Q0FBaUIsR0FBakIsVUFBa0IsRUFBZSxFQUFFLEtBQVU7UUFDM0MsSUFBSSxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUU7WUFDaEMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7WUFDRCxlQUFl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QUFNLFVBQVUsR0FBRyxVQUFDLEtBQWEsRUFBRSxNQUFjO0lBQy9DLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLE1BQU0sQ0FBQztBQUNuRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIEluamVjdG9yLCBPbkRlc3Ryb3ksIFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgcmFmIH0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcblxuZXhwb3J0IGNsYXNzIFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHsvKiovfTtcbiAgcHJpdmF0ZSBvblRvdWNoZWQ6ICgpID0+IHZvaWQgPSAoKSA9PiB7LyoqL307XG4gIHByb3RlY3RlZCBsYXN0VmFsdWU6IGFueTtcbiAgcHJpdmF0ZSBzdGF0dXNDaGFuZ2VzPzogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsIHByb3RlY3RlZCBlbDogRWxlbWVudFJlZikge31cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICAvKipcbiAgICAgKiBUT0RPIGZvciBJb25pYyA2OlxuICAgICAqIENoYW5nZSBgdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7YFxuICAgICAqIHRvIGB2YWx1ZWAuIFRoaXMgd2FzIGEgZml4IGZvciBJRTksIGJ1dCBJRTlcbiAgICAgKiBpcyBubyBsb25nZXIgc3VwcG9ydGVkOyBob3dldmVyLCB0aGlzIGNoYW5nZVxuICAgICAqIGlzIHBvdGVudGlhbGx5IGEgYnJlYWtpbmcgY2hhbmdlXG4gICAgICovXG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gdGhpcy5sYXN0VmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbiAgICBzZXRJb25pY0NsYXNzZXModGhpcy5lbCk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2VFdmVudChlbDogSFRNTEVsZW1lbnQsIHZhbHVlOiBhbnkpIHtcbiAgICBpZiAoZWwgPT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCkge1xuICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLmxhc3RWYWx1ZSkge1xuICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHNldElvbmljQ2xhc3Nlcyh0aGlzLmVsKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdpb25CbHVyJywgWyckZXZlbnQudGFyZ2V0J10pXG4gIF9oYW5kbGVCbHVyRXZlbnQoZWw6IGFueSkge1xuICAgIGlmIChlbCA9PT0gdGhpcy5lbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgICAgc2V0SW9uaWNDbGFzc2VzKHRoaXMuZWwpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnN0YXR1c0NoYW5nZXMpIHtcbiAgICAgIHRoaXMuc3RhdHVzQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBsZXQgbmdDb250cm9sO1xuICAgIHRyeSB7XG4gICAgICBuZ0NvbnRyb2wgPSB0aGlzLmluamVjdG9yLmdldDxOZ0NvbnRyb2w+KE5nQ29udHJvbCBhcyBUeXBlPE5nQ29udHJvbD4pO1xuICAgIH0gY2F0Y2ggeyAvKiBObyBGb3JtQ29udHJvbCBvciBuZ01vZGVsIGJpbmRpbmcgKi8gfVxuXG4gICAgaWYgKCFuZ0NvbnRyb2wpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBMaXN0ZW4gZm9yIGNoYW5nZXMgaW4gdmFsaWRpdHksIGRpc2FibGVkLCBvciBwZW5kaW5nIHN0YXRlc1xuICAgIGlmIChuZ0NvbnRyb2wuc3RhdHVzQ2hhbmdlcykge1xuICAgICAgdGhpcy5zdGF0dXNDaGFuZ2VzID0gbmdDb250cm9sLnN0YXR1c0NoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHNldElvbmljQ2xhc3Nlcyh0aGlzLmVsKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVE9ETyBSZW1vdmUgdGhpcyBpbiBmYXZvciBvZiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xMDg4N1xuICAgICAqIHdoZW5ldmVyIGl0IGlzIGltcGxlbWVudGVkLiBDdXJyZW50bHksIElvbmljJ3MgZm9ybSBzdGF0dXMgY2xhc3Nlc1xuICAgICAqIGRvIG5vdCByZWFjdCB0byBjaGFuZ2VzIHdoZW4gZGV2ZWxvcGVycyBtYW51YWxseSBjYWxsXG4gICAgICogQW5ndWxhciBmb3JtIGNvbnRyb2wgbWV0aG9kcyBzdWNoIGFzIG1hcmtBc1RvdWNoZWQuXG4gICAgICogVGhpcyByZXN1bHRzIGluIElvbmljJ3MgZm9ybSBzdGF0dXMgY2xhc3NlcyBiZWluZyBvdXRcbiAgICAgKiBvZiBzeW5jIHdpdGggdGhlIG5nIGZvcm0gc3RhdHVzIGNsYXNzZXMuXG4gICAgICogVGhpcyBwYXRjaGVzIHRoZSBtZXRob2RzIHRvIG1hbnVhbGx5IHN5bmNcbiAgICAgKiB0aGUgY2xhc3NlcyB1bnRpbCB0aGlzIGZlYXR1cmUgaXMgaW1wbGVtZW50ZWQgaW4gQW5ndWxhci5cbiAgICAgKi9cbiAgICBjb25zdCBmb3JtQ29udHJvbCA9IG5nQ29udHJvbC5jb250cm9sO1xuICAgIGlmIChmb3JtQ29udHJvbCkge1xuICAgICAgY29uc3QgbWV0aG9kc1RvUGF0Y2ggPSBbJ21hcmtBc1RvdWNoZWQnLCAnbWFya0FsbEFzVG91Y2hlZCcsICdtYXJrQXNVbnRvdWNoZWQnLCAnbWFya0FzRGlydHknLCAnbWFya0FzUHJpc3RpbmUnXTtcbiAgICAgIG1ldGhvZHNUb1BhdGNoLmZvckVhY2gobWV0aG9kID0+IHtcbiAgICAgICBpZiAoZm9ybUNvbnRyb2xbbWV0aG9kXSkge1xuICAgICAgICAgY29uc3Qgb2xkRm4gPSBmb3JtQ29udHJvbFttZXRob2RdLmJpbmQoZm9ybUNvbnRyb2wpO1xuICAgICAgICAgZm9ybUNvbnRyb2xbbWV0aG9kXSA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgICAgICAgb2xkRm4oLi4ucGFyYW1zKTtcbiAgICAgICAgICAgc2V0SW9uaWNDbGFzc2VzKHRoaXMuZWwpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2V0SW9uaWNDbGFzc2VzID0gKGVsZW1lbnQ6IEVsZW1lbnRSZWYpID0+IHtcbiAgcmFmKCgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBjbGFzc2VzID0gZ2V0Q2xhc3NlcyhpbnB1dCk7XG4gICAgc2V0Q2xhc3NlcyhpbnB1dCwgY2xhc3Nlcyk7XG5cbiAgICBjb25zdCBpdGVtID0gaW5wdXQuY2xvc2VzdCgnaW9uLWl0ZW0nKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgc2V0Q2xhc3NlcyhpdGVtLCBjbGFzc2VzKTtcbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3QgZ2V0Q2xhc3NlcyA9IChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4ge1xuICBjb25zdCBjbGFzc0xpc3QgPSBlbGVtZW50LmNsYXNzTGlzdDtcbiAgY29uc3QgY2xhc3NlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGl0ZW0gPSBjbGFzc0xpc3QuaXRlbShpKTtcbiAgICBpZiAoaXRlbSAhPT0gbnVsbCAmJiBzdGFydHNXaXRoKGl0ZW0sICduZy0nKSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKGBpb24tJHtpdGVtLnN1YnN0cigzKX1gKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNsYXNzZXM7XG59O1xuXG5jb25zdCBzZXRDbGFzc2VzID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBjbGFzc2VzOiBzdHJpbmdbXSkgPT4ge1xuICBjb25zdCBjbGFzc0xpc3QgPSBlbGVtZW50LmNsYXNzTGlzdDtcbiAgW1xuICAgICdpb24tdmFsaWQnLFxuICAgICdpb24taW52YWxpZCcsXG4gICAgJ2lvbi10b3VjaGVkJyxcbiAgICAnaW9uLXVudG91Y2hlZCcsXG4gICAgJ2lvbi1kaXJ0eScsXG4gICAgJ2lvbi1wcmlzdGluZSdcbiAgXS5mb3JFYWNoKGMgPT4gY2xhc3NMaXN0LnJlbW92ZShjKSk7XG5cbiAgY2xhc3Nlcy5mb3JFYWNoKGMgPT4gY2xhc3NMaXN0LmFkZChjKSk7XG59O1xuXG5jb25zdCBzdGFydHNXaXRoID0gKGlucHV0OiBzdHJpbmcsIHNlYXJjaDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBpbnB1dC5zdWJzdHIoMCwgc2VhcmNoLmxlbmd0aCkgPT09IHNlYXJjaDtcbn07XG4iXX0=