import * as tslib_1 from "tslib";
import { HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { raf } from '../../util/util';
export class ValueAccessor {
    constructor(injector, el) {
        this.injector = injector;
        this.el = el;
        this.onChange = () => { };
        this.onTouched = () => { };
    }
    writeValue(value) {
        /**
         * TODO for Ionic 6:
         * Change `value == null ? '' : value;`
         * to `value`. This was a fix for IE9, but IE9
         * is no longer supported; however, this change
         * is potentially a breaking change
         */
        this.el.nativeElement.value = this.lastValue = value == null ? '' : value;
        setIonicClasses(this.el);
    }
    handleChangeEvent(el, value) {
        if (el === this.el.nativeElement) {
            if (value !== this.lastValue) {
                this.lastValue = value;
                this.onChange(value);
            }
            setIonicClasses(this.el);
        }
    }
    _handleBlurEvent(el) {
        if (el === this.el.nativeElement) {
            this.onTouched();
            setIonicClasses(this.el);
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.el.nativeElement.disabled = isDisabled;
    }
    ngOnDestroy() {
        if (this.statusChanges) {
            this.statusChanges.unsubscribe();
        }
    }
    ngAfterViewInit() {
        let ngControl;
        try {
            ngControl = this.injector.get(NgControl);
        }
        catch ( /* No FormControl or ngModel binding */_a) { /* No FormControl or ngModel binding */ }
        if (!ngControl) {
            return;
        }
        // Listen for changes in validity, disabled, or pending states
        if (ngControl.statusChanges) {
            this.statusChanges = ngControl.statusChanges.subscribe(() => setIonicClasses(this.el));
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
        const formControl = ngControl.control;
        if (formControl) {
            const methodsToPatch = ['markAsTouched', 'markAllAsTouched', 'markAsUntouched', 'markAsDirty', 'markAsPristine'];
            methodsToPatch.forEach(method => {
                if (formControl[method]) {
                    const oldFn = formControl[method].bind(formControl);
                    formControl[method] = (...params) => {
                        oldFn(...params);
                        setIonicClasses(this.el);
                    };
                }
            });
        }
    }
}
tslib_1.__decorate([
    HostListener('ionBlur', ['$event.target'])
], ValueAccessor.prototype, "_handleBlurEvent", null);
export const setIonicClasses = (element) => {
    raf(() => {
        const input = element.nativeElement;
        const classes = getClasses(input);
        setClasses(input, classes);
        const item = input.closest('ion-item');
        if (item) {
            setClasses(item, classes);
        }
    });
};
const getClasses = (element) => {
    const classList = element.classList;
    const classes = [];
    for (let i = 0; i < classList.length; i++) {
        const item = classList.item(i);
        if (item !== null && startsWith(item, 'ng-')) {
            classes.push(`ion-${item.substr(3)}`);
        }
    }
    return classes;
};
const ɵ0 = getClasses;
const setClasses = (element, classes) => {
    const classList = element.classList;
    [
        'ion-valid',
        'ion-invalid',
        'ion-touched',
        'ion-untouched',
        'ion-dirty',
        'ion-pristine'
    ].forEach(c => classList.remove(c));
    classes.forEach(c => classList.add(c));
};
const ɵ1 = setClasses;
const startsWith = (input, search) => {
    return input.substr(0, search.length) === search;
};
const ɵ2 = startsWith;
export { ɵ0, ɵ1, ɵ2 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWUtYWNjZXNzb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvY29udHJvbC12YWx1ZS1hY2Nlc3NvcnMvdmFsdWUtYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBNkIsWUFBWSxFQUE2QixNQUFNLGVBQWUsQ0FBQztBQUNuRyxPQUFPLEVBQXdCLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR2pFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0QyxNQUFNLE9BQU8sYUFBYTtJQU94QixZQUFzQixRQUFrQixFQUFZLEVBQWM7UUFBNUMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFZLE9BQUUsR0FBRixFQUFFLENBQVk7UUFMMUQsYUFBUSxHQUF5QixHQUFHLEVBQUUsR0FBTSxDQUFDLENBQUM7UUFDOUMsY0FBUyxHQUFlLEdBQUcsRUFBRSxHQUFNLENBQUMsQ0FBQztJQUl3QixDQUFDO0lBRXRFLFVBQVUsQ0FBQyxLQUFVO1FBQ25COzs7Ozs7V0FNRztRQUNILElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzFFLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQWUsRUFBRSxLQUFVO1FBQzNDLElBQUksRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFO1lBQ2hDLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FB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QUFDLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssTUFBTSxDQUFDO0FBQ25ELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5qZWN0b3IsIE9uRGVzdHJveSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyByYWYgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgY2xhc3MgVmFsdWVBY2Nlc3NvciBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIHByaXZhdGUgb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4gey8qKi99O1xuICBwcml2YXRlIG9uVG91Y2hlZDogKCkgPT4gdm9pZCA9ICgpID0+IHsvKiovfTtcbiAgcHJvdGVjdGVkIGxhc3RWYWx1ZTogYW55O1xuICBwcml2YXRlIHN0YXR1c0NoYW5nZXM/OiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvciwgcHJvdGVjdGVkIGVsOiBFbGVtZW50UmVmKSB7fVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgIC8qKlxuICAgICAqIFRPRE8gZm9yIElvbmljIDY6XG4gICAgICogQ2hhbmdlIGB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtgXG4gICAgICogdG8gYHZhbHVlYC4gVGhpcyB3YXMgYSBmaXggZm9yIElFOSwgYnV0IElFOVxuICAgICAqIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQ7IGhvd2V2ZXIsIHRoaXMgY2hhbmdlXG4gICAgICogaXMgcG90ZW50aWFsbHkgYSBicmVha2luZyBjaGFuZ2VcbiAgICAgKi9cbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlO1xuICAgIHNldElvbmljQ2xhc3Nlcyh0aGlzLmVsKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZUV2ZW50KGVsOiBIVE1MRWxlbWVudCwgdmFsdWU6IGFueSkge1xuICAgIGlmIChlbCA9PT0gdGhpcy5lbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBpZiAodmFsdWUgIT09IHRoaXMubGFzdFZhbHVlKSB7XG4gICAgICAgIHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICAgICAgfVxuICAgICAgc2V0SW9uaWNDbGFzc2VzKHRoaXMuZWwpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2lvbkJsdXInLCBbJyRldmVudC50YXJnZXQnXSlcbiAgX2hhbmRsZUJsdXJFdmVudChlbDogYW55KSB7XG4gICAgaWYgKGVsID09PSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gICAgICBzZXRJb25pY0NsYXNzZXModGhpcy5lbCk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzQ2hhbmdlcykge1xuICAgICAgdGhpcy5zdGF0dXNDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGxldCBuZ0NvbnRyb2w7XG4gICAgdHJ5IHtcbiAgICAgIG5nQ29udHJvbCA9IHRoaXMuaW5qZWN0b3IuZ2V0PE5nQ29udHJvbD4oTmdDb250cm9sIGFzIFR5cGU8TmdDb250cm9sPik7XG4gICAgfSBjYXRjaCB7IC8qIE5vIEZvcm1Db250cm9sIG9yIG5nTW9kZWwgYmluZGluZyAqLyB9XG5cbiAgICBpZiAoIW5nQ29udHJvbCkgeyByZXR1cm47IH1cblxuICAgIC8vIExpc3RlbiBmb3IgY2hhbmdlcyBpbiB2YWxpZGl0eSwgZGlzYWJsZWQsIG9yIHBlbmRpbmcgc3RhdGVzXG4gICAgaWYgKG5nQ29udHJvbC5zdGF0dXNDaGFuZ2VzKSB7XG4gICAgICB0aGlzLnN0YXR1c0NoYW5nZXMgPSBuZ0NvbnRyb2wuc3RhdHVzQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gc2V0SW9uaWNDbGFzc2VzKHRoaXMuZWwpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUT0RPIFJlbW92ZSB0aGlzIGluIGZhdm9yIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzEwODg3XG4gICAgICogd2hlbmV2ZXIgaXQgaXMgaW1wbGVtZW50ZWQuIEN1cnJlbnRseSwgSW9uaWMncyBmb3JtIHN0YXR1cyBjbGFzc2VzXG4gICAgICogZG8gbm90IHJlYWN0IHRvIGNoYW5nZXMgd2hlbiBkZXZlbG9wZXJzIG1hbnVhbGx5IGNhbGxcbiAgICAgKiBBbmd1bGFyIGZvcm0gY29udHJvbCBtZXRob2RzIHN1Y2ggYXMgbWFya0FzVG91Y2hlZC5cbiAgICAgKiBUaGlzIHJlc3VsdHMgaW4gSW9uaWMncyBmb3JtIHN0YXR1cyBjbGFzc2VzIGJlaW5nIG91dFxuICAgICAqIG9mIHN5bmMgd2l0aCB0aGUgbmcgZm9ybSBzdGF0dXMgY2xhc3Nlcy5cbiAgICAgKiBUaGlzIHBhdGNoZXMgdGhlIG1ldGhvZHMgdG8gbWFudWFsbHkgc3luY1xuICAgICAqIHRoZSBjbGFzc2VzIHVudGlsIHRoaXMgZmVhdHVyZSBpcyBpbXBsZW1lbnRlZCBpbiBBbmd1bGFyLlxuICAgICAqL1xuICAgIGNvbnN0IGZvcm1Db250cm9sID0gbmdDb250cm9sLmNvbnRyb2w7XG4gICAgaWYgKGZvcm1Db250cm9sKSB7XG4gICAgICBjb25zdCBtZXRob2RzVG9QYXRjaCA9IFsnbWFya0FzVG91Y2hlZCcsICdtYXJrQWxsQXNUb3VjaGVkJywgJ21hcmtBc1VudG91Y2hlZCcsICdtYXJrQXNEaXJ0eScsICdtYXJrQXNQcmlzdGluZSddO1xuICAgICAgbWV0aG9kc1RvUGF0Y2guZm9yRWFjaChtZXRob2QgPT4ge1xuICAgICAgIGlmIChmb3JtQ29udHJvbFttZXRob2RdKSB7XG4gICAgICAgICBjb25zdCBvbGRGbiA9IGZvcm1Db250cm9sW21ldGhvZF0uYmluZChmb3JtQ29udHJvbCk7XG4gICAgICAgICBmb3JtQ29udHJvbFttZXRob2RdID0gKC4uLnBhcmFtcykgPT4ge1xuICAgICAgICAgICBvbGRGbiguLi5wYXJhbXMpO1xuICAgICAgICAgICBzZXRJb25pY0NsYXNzZXModGhpcy5lbCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBzZXRJb25pY0NsYXNzZXMgPSAoZWxlbWVudDogRWxlbWVudFJlZikgPT4ge1xuICByYWYoKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IGNsYXNzZXMgPSBnZXRDbGFzc2VzKGlucHV0KTtcbiAgICBzZXRDbGFzc2VzKGlucHV0LCBjbGFzc2VzKTtcblxuICAgIGNvbnN0IGl0ZW0gPSBpbnB1dC5jbG9zZXN0KCdpb24taXRlbScpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICBzZXRDbGFzc2VzKGl0ZW0sIGNsYXNzZXMpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5jb25zdCBnZXRDbGFzc2VzID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gIGNvbnN0IGNsYXNzTGlzdCA9IGVsZW1lbnQuY2xhc3NMaXN0O1xuICBjb25zdCBjbGFzc2VzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3NMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgaXRlbSA9IGNsYXNzTGlzdC5pdGVtKGkpO1xuICAgIGlmIChpdGVtICE9PSBudWxsICYmIHN0YXJ0c1dpdGgoaXRlbSwgJ25nLScpKSB7XG4gICAgICBjbGFzc2VzLnB1c2goYGlvbi0ke2l0ZW0uc3Vic3RyKDMpfWApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY2xhc3Nlcztcbn07XG5cbmNvbnN0IHNldENsYXNzZXMgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQsIGNsYXNzZXM6IHN0cmluZ1tdKSA9PiB7XG4gIGNvbnN0IGNsYXNzTGlzdCA9IGVsZW1lbnQuY2xhc3NMaXN0O1xuICBbXG4gICAgJ2lvbi12YWxpZCcsXG4gICAgJ2lvbi1pbnZhbGlkJyxcbiAgICAnaW9uLXRvdWNoZWQnLFxuICAgICdpb24tdW50b3VjaGVkJyxcbiAgICAnaW9uLWRpcnR5JyxcbiAgICAnaW9uLXByaXN0aW5lJ1xuICBdLmZvckVhY2goYyA9PiBjbGFzc0xpc3QucmVtb3ZlKGMpKTtcblxuICBjbGFzc2VzLmZvckVhY2goYyA9PiBjbGFzc0xpc3QuYWRkKGMpKTtcbn07XG5cbmNvbnN0IHN0YXJ0c1dpdGggPSAoaW5wdXQ6IHN0cmluZywgc2VhcmNoOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIGlucHV0LnN1YnN0cigwLCBzZWFyY2gubGVuZ3RoKSA9PT0gc2VhcmNoO1xufTtcbiJdfQ==