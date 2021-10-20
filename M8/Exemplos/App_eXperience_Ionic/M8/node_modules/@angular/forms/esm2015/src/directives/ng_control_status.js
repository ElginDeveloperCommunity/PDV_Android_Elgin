/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Optional, Self } from '@angular/core';
import { ControlContainer } from './control_container';
import { NgControl } from './ng_control';
export class AbstractControlStatus {
    constructor(cd) {
        this._cd = cd;
    }
    is(status) {
        var _a, _b, _c;
        // Currently with ViewEngine (in AOT mode) it's not possible to use private methods in host
        // bindings.
        // TODO: once ViewEngine is removed, this function should be refactored:
        //  - make the `is` method `protected`, so it's not accessible publicly
        //  - move the `submitted` status logic to the `NgControlStatusGroup` class
        //    and make it `private` or `protected` too.
        if (status === 'submitted') {
            // We check for the `submitted` field from `NgForm` and `FormGroupDirective` classes, but
            // we avoid instanceof checks to prevent non-tree-shakable references to those types.
            return !!((_a = this._cd) === null || _a === void 0 ? void 0 : _a.submitted);
        }
        return !!((_c = (_b = this._cd) === null || _b === void 0 ? void 0 : _b.control) === null || _c === void 0 ? void 0 : _c[status]);
    }
}
export const ngControlStatusHost = {
    '[class.ng-untouched]': 'is("untouched")',
    '[class.ng-touched]': 'is("touched")',
    '[class.ng-pristine]': 'is("pristine")',
    '[class.ng-dirty]': 'is("dirty")',
    '[class.ng-valid]': 'is("valid")',
    '[class.ng-invalid]': 'is("invalid")',
    '[class.ng-pending]': 'is("pending")',
};
export const ngGroupStatusHost = {
    '[class.ng-untouched]': 'is("untouched")',
    '[class.ng-touched]': 'is("touched")',
    '[class.ng-pristine]': 'is("pristine")',
    '[class.ng-dirty]': 'is("dirty")',
    '[class.ng-valid]': 'is("valid")',
    '[class.ng-invalid]': 'is("invalid")',
    '[class.ng-pending]': 'is("pending")',
    '[class.ng-submitted]': 'is("submitted")',
};
/**
 * @description
 * Directive automatically applied to Angular form controls that sets CSS classes
 * based on control status.
 *
 * @usageNotes
 *
 * ### CSS classes applied
 *
 * The following classes are applied as the properties become true:
 *
 * * ng-valid
 * * ng-invalid
 * * ng-pending
 * * ng-pristine
 * * ng-dirty
 * * ng-untouched
 * * ng-touched
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export class NgControlStatus extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
}
NgControlStatus.decorators = [
    { type: Directive, args: [{ selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost },] }
];
NgControlStatus.ctorParameters = () => [
    { type: NgControl, decorators: [{ type: Self }] }
];
/**
 * @description
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc). On groups, this includes the additional
 * class ng-submitted.
 *
 * @see `NgControlStatus`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export class NgControlStatusGroup extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
}
NgControlStatusGroup.decorators = [
    { type: Directive, args: [{
                selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                host: ngGroupStatusHost
            },] }
];
NgControlStatusGroup.ctorParameters = () => [
    { type: ControlContainer, decorators: [{ type: Optional }, { type: Self }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHeEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUt2QyxNQUFNLE9BQU8scUJBQXFCO0lBR2hDLFlBQVksRUFBaUM7UUFDM0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELEVBQUUsQ0FBQyxNQUF3Qjs7UUFDekIsMkZBQTJGO1FBQzNGLFlBQVk7UUFDWix3RUFBd0U7UUFDeEUsdUVBQXVFO1FBQ3ZFLDJFQUEyRTtRQUMzRSwrQ0FBK0M7UUFDL0MsSUFBSSxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQzFCLHlGQUF5RjtZQUN6RixxRkFBcUY7WUFDckYsT0FBTyxDQUFDLENBQUMsQ0FBQSxNQUFDLElBQUksQ0FBQyxHQUE4QywwQ0FBRSxTQUFTLENBQUEsQ0FBQztTQUMxRTtRQUNELE9BQU8sQ0FBQyxDQUFDLENBQUEsTUFBQSxNQUFBLElBQUksQ0FBQyxHQUFHLDBDQUFFLE9BQU8sMENBQUcsTUFBTSxDQUFDLENBQUEsQ0FBQztJQUN2QyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRztJQUNqQyxzQkFBc0IsRUFBRSxpQkFBaUI7SUFDekMsb0JBQW9CLEVBQUUsZUFBZTtJQUNyQyxxQkFBcUIsRUFBRSxnQkFBZ0I7SUFDdkMsa0JBQWtCLEVBQUUsYUFBYTtJQUNqQyxrQkFBa0IsRUFBRSxhQUFhO0lBQ2pDLG9CQUFvQixFQUFFLGVBQWU7SUFDckMsb0JBQW9CLEVBQUUsZUFBZTtDQUN0QyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUc7SUFDL0Isc0JBQXNCLEVBQUUsaUJBQWlCO0lBQ3pDLG9CQUFvQixFQUFFLGVBQWU7SUFDckMscUJBQXFCLEVBQUUsZ0JBQWdCO0lBQ3ZDLGtCQUFrQixFQUFFLGFBQWE7SUFDakMsa0JBQWtCLEVBQUUsYUFBYTtJQUNqQyxvQkFBb0IsRUFBRSxlQUFlO0lBQ3JDLG9CQUFvQixFQUFFLGVBQWU7SUFDckMsc0JBQXNCLEVBQUUsaUJBQWlCO0NBQzFDLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUVILE1BQU0sT0FBTyxlQUFnQixTQUFRLHFCQUFxQjtJQUN4RCxZQUFvQixFQUFhO1FBQy9CLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNaLENBQUM7OztZQUpGLFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSwyQ0FBMkMsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUM7OztZQXhFckYsU0FBUyx1QkEwRUYsSUFBSTs7QUFLbkI7Ozs7Ozs7Ozs7O0dBV0c7QUFNSCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEscUJBQXFCO0lBQzdELFlBQWdDLEVBQW9CO1FBQ2xELEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNaLENBQUM7OztZQVJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQ0osMEZBQTBGO2dCQUM5RixJQUFJLEVBQUUsaUJBQWlCO2FBQ3hCOzs7WUFoR08sZ0JBQWdCLHVCQWtHVCxRQUFRLFlBQUksSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgT3B0aW9uYWwsIFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbERpcmVjdGl2ZX0gZnJvbSAnLi9hYnN0cmFjdF9jb250cm9sX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJy4vbmdfY29udHJvbCc7XG5cbnR5cGUgQW55Q29udHJvbFN0YXR1cyA9XG4gICAgJ3VudG91Y2hlZCd8J3RvdWNoZWQnfCdwcmlzdGluZSd8J2RpcnR5J3wndmFsaWQnfCdpbnZhbGlkJ3wncGVuZGluZyd8J3N1Ym1pdHRlZCc7XG5cbmV4cG9ydCBjbGFzcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICBwcml2YXRlIF9jZDogQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlfG51bGw7XG5cbiAgY29uc3RydWN0b3IoY2Q6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZXxudWxsKSB7XG4gICAgdGhpcy5fY2QgPSBjZDtcbiAgfVxuXG4gIGlzKHN0YXR1czogQW55Q29udHJvbFN0YXR1cyk6IGJvb2xlYW4ge1xuICAgIC8vIEN1cnJlbnRseSB3aXRoIFZpZXdFbmdpbmUgKGluIEFPVCBtb2RlKSBpdCdzIG5vdCBwb3NzaWJsZSB0byB1c2UgcHJpdmF0ZSBtZXRob2RzIGluIGhvc3RcbiAgICAvLyBiaW5kaW5ncy5cbiAgICAvLyBUT0RPOiBvbmNlIFZpZXdFbmdpbmUgaXMgcmVtb3ZlZCwgdGhpcyBmdW5jdGlvbiBzaG91bGQgYmUgcmVmYWN0b3JlZDpcbiAgICAvLyAgLSBtYWtlIHRoZSBgaXNgIG1ldGhvZCBgcHJvdGVjdGVkYCwgc28gaXQncyBub3QgYWNjZXNzaWJsZSBwdWJsaWNseVxuICAgIC8vICAtIG1vdmUgdGhlIGBzdWJtaXR0ZWRgIHN0YXR1cyBsb2dpYyB0byB0aGUgYE5nQ29udHJvbFN0YXR1c0dyb3VwYCBjbGFzc1xuICAgIC8vICAgIGFuZCBtYWtlIGl0IGBwcml2YXRlYCBvciBgcHJvdGVjdGVkYCB0b28uXG4gICAgaWYgKHN0YXR1cyA9PT0gJ3N1Ym1pdHRlZCcpIHtcbiAgICAgIC8vIFdlIGNoZWNrIGZvciB0aGUgYHN1Ym1pdHRlZGAgZmllbGQgZnJvbSBgTmdGb3JtYCBhbmQgYEZvcm1Hcm91cERpcmVjdGl2ZWAgY2xhc3NlcywgYnV0XG4gICAgICAvLyB3ZSBhdm9pZCBpbnN0YW5jZW9mIGNoZWNrcyB0byBwcmV2ZW50IG5vbi10cmVlLXNoYWthYmxlIHJlZmVyZW5jZXMgdG8gdGhvc2UgdHlwZXMuXG4gICAgICByZXR1cm4gISEodGhpcy5fY2QgYXMgdW5rbm93biBhcyB7c3VibWl0dGVkOiBib29sZWFufSB8IG51bGwpPy5zdWJtaXR0ZWQ7XG4gICAgfVxuICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy5bc3RhdHVzXTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgbmdDb250cm9sU3RhdHVzSG9zdCA9IHtcbiAgJ1tjbGFzcy5uZy11bnRvdWNoZWRdJzogJ2lzKFwidW50b3VjaGVkXCIpJyxcbiAgJ1tjbGFzcy5uZy10b3VjaGVkXSc6ICdpcyhcInRvdWNoZWRcIiknLFxuICAnW2NsYXNzLm5nLXByaXN0aW5lXSc6ICdpcyhcInByaXN0aW5lXCIpJyxcbiAgJ1tjbGFzcy5uZy1kaXJ0eV0nOiAnaXMoXCJkaXJ0eVwiKScsXG4gICdbY2xhc3MubmctdmFsaWRdJzogJ2lzKFwidmFsaWRcIiknLFxuICAnW2NsYXNzLm5nLWludmFsaWRdJzogJ2lzKFwiaW52YWxpZFwiKScsXG4gICdbY2xhc3MubmctcGVuZGluZ10nOiAnaXMoXCJwZW5kaW5nXCIpJyxcbn07XG5cbmV4cG9ydCBjb25zdCBuZ0dyb3VwU3RhdHVzSG9zdCA9IHtcbiAgJ1tjbGFzcy5uZy11bnRvdWNoZWRdJzogJ2lzKFwidW50b3VjaGVkXCIpJyxcbiAgJ1tjbGFzcy5uZy10b3VjaGVkXSc6ICdpcyhcInRvdWNoZWRcIiknLFxuICAnW2NsYXNzLm5nLXByaXN0aW5lXSc6ICdpcyhcInByaXN0aW5lXCIpJyxcbiAgJ1tjbGFzcy5uZy1kaXJ0eV0nOiAnaXMoXCJkaXJ0eVwiKScsXG4gICdbY2xhc3MubmctdmFsaWRdJzogJ2lzKFwidmFsaWRcIiknLFxuICAnW2NsYXNzLm5nLWludmFsaWRdJzogJ2lzKFwiaW52YWxpZFwiKScsXG4gICdbY2xhc3MubmctcGVuZGluZ10nOiAnaXMoXCJwZW5kaW5nXCIpJyxcbiAgJ1tjbGFzcy5uZy1zdWJtaXR0ZWRdJzogJ2lzKFwic3VibWl0dGVkXCIpJyxcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEaXJlY3RpdmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIEFuZ3VsYXIgZm9ybSBjb250cm9scyB0aGF0IHNldHMgQ1NTIGNsYXNzZXNcbiAqIGJhc2VkIG9uIGNvbnRyb2wgc3RhdHVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENTUyBjbGFzc2VzIGFwcGxpZWRcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGNsYXNzZXMgYXJlIGFwcGxpZWQgYXMgdGhlIHByb3BlcnRpZXMgYmVjb21lIHRydWU6XG4gKlxuICogKiBuZy12YWxpZFxuICogKiBuZy1pbnZhbGlkXG4gKiAqIG5nLXBlbmRpbmdcbiAqICogbmctcHJpc3RpbmVcbiAqICogbmctZGlydHlcbiAqICogbmctdW50b3VjaGVkXG4gKiAqIG5nLXRvdWNoZWRcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2Zvcm1Db250cm9sTmFtZV0sW25nTW9kZWxdLFtmb3JtQ29udHJvbF0nLCBob3N0OiBuZ0NvbnRyb2xTdGF0dXNIb3N0fSlcbmV4cG9ydCBjbGFzcyBOZ0NvbnRyb2xTdGF0dXMgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICBjb25zdHJ1Y3RvcihAU2VsZigpIGNkOiBOZ0NvbnRyb2wpIHtcbiAgICBzdXBlcihjZCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIERpcmVjdGl2ZSBhdXRvbWF0aWNhbGx5IGFwcGxpZWQgdG8gQW5ndWxhciBmb3JtIGdyb3VwcyB0aGF0IHNldHMgQ1NTIGNsYXNzZXNcbiAqIGJhc2VkIG9uIGNvbnRyb2wgc3RhdHVzICh2YWxpZC9pbnZhbGlkL2RpcnR5L2V0YykuIE9uIGdyb3VwcywgdGhpcyBpbmNsdWRlcyB0aGUgYWRkaXRpb25hbFxuICogY2xhc3Mgbmctc3VibWl0dGVkLlxuICpcbiAqIEBzZWUgYE5nQ29udHJvbFN0YXR1c2BcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdbZm9ybUdyb3VwTmFtZV0sW2Zvcm1BcnJheU5hbWVdLFtuZ01vZGVsR3JvdXBdLFtmb3JtR3JvdXBdLGZvcm06bm90KFtuZ05vRm9ybV0pLFtuZ0Zvcm1dJyxcbiAgaG9zdDogbmdHcm91cFN0YXR1c0hvc3Rcbn0pXG5leHBvcnQgY2xhc3MgTmdDb250cm9sU3RhdHVzR3JvdXAgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBAU2VsZigpIGNkOiBDb250cm9sQ29udGFpbmVyKSB7XG4gICAgc3VwZXIoY2QpO1xuICB9XG59XG4iXX0=