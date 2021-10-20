/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, forwardRef, Inject, Input, Optional, Output, Self } from '@angular/core';
import { FormControl, FormGroup } from '../../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { ControlContainer } from '../control_container';
import { ReactiveErrors } from '../reactive_errors';
import { cleanUpControl, cleanUpFormContainer, cleanUpValidators, removeListItem, setUpControl, setUpFormContainer, setUpValidators, syncPendingControls } from '../shared';
export const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormGroupDirective)
};
/**
 * @description
 *
 * Binds an existing `FormGroup` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `AbstractControl`
 *
 * @usageNotes
 * ### Register Form Group
 *
 * The following example registers a `FormGroup` with first name and last name controls,
 * and listens for the *ngSubmit* event when the button is clicked.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export class FormGroupDirective extends ControlContainer {
    constructor(validators, asyncValidators) {
        super();
        this.validators = validators;
        this.asyncValidators = asyncValidators;
        /**
         * @description
         * Reports whether the form submission has been triggered.
         */
        this.submitted = false;
        /**
         * Callback that should be invoked when controls in FormGroup or FormArray collection change
         * (added or removed). This callback triggers corresponding DOM updates.
         */
        this._onCollectionChange = () => this._updateDomValue();
        /**
         * @description
         * Tracks the list of added `FormControlName` instances
         */
        this.directives = [];
        /**
         * @description
         * Tracks the `FormGroup` bound to this directive.
         */
        this.form = null;
        /**
         * @description
         * Emits an event when the form submission has been triggered.
         */
        this.ngSubmit = new EventEmitter();
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        this._checkFormPresent();
        if (changes.hasOwnProperty('form')) {
            this._updateValidators();
            this._updateDomValue();
            this._updateRegistrations();
            this._oldForm = this.form;
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this.form) {
            cleanUpValidators(this.form, this);
            // Currently the `onCollectionChange` callback is rewritten each time the
            // `_registerOnCollectionChange` function is invoked. The implication is that cleanup should
            // happen *only* when the `onCollectionChange` callback was set by this directive instance.
            // Otherwise it might cause overriding a callback of some other directive instances. We should
            // consider updating this logic later to make it similar to how `onChange` callbacks are
            // handled, see https://github.com/angular/angular/issues/39732 for additional info.
            if (this.form._onCollectionChange === this._onCollectionChange) {
                this.form._registerOnCollectionChange(() => { });
            }
        }
    }
    /**
     * @description
     * Returns this directive's instance.
     */
    get formDirective() {
        return this;
    }
    /**
     * @description
     * Returns the `FormGroup` bound to this directive.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it always an empty array.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `FormControlName` directive instance.
     */
    addControl(dir) {
        const ctrl = this.form.get(dir.path);
        setUpControl(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
        return ctrl;
    }
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `FormControlName` directive
     *
     * @param dir The `FormControlName` directive instance.
     */
    getControl(dir) {
        return this.form.get(dir.path);
    }
    /**
     * @description
     * Removes the `FormControlName` instance from the internal list of directives
     *
     * @param dir The `FormControlName` directive instance.
     */
    removeControl(dir) {
        cleanUpControl(dir.control || null, dir, /* validateControlPresenceOnChange */ false);
        removeListItem(this.directives, dir);
    }
    /**
     * Adds a new `FormGroupName` directive instance to the form.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    addFormGroup(dir) {
        this._setUpFormContainer(dir);
    }
    /**
     * Performs the necessary cleanup when a `FormGroupName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    removeFormGroup(dir) {
        this._cleanUpFormContainer(dir);
    }
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
     *
     * @param dir The `FormGroupName` directive instance.
     */
    getFormGroup(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Performs the necessary setup when a `FormArrayName` directive instance is added to the view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    addFormArray(dir) {
        this._setUpFormContainer(dir);
    }
    /**
     * Performs the necessary cleanup when a `FormArrayName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    removeFormArray(dir) {
        this._cleanUpFormContainer(dir);
    }
    /**
     * @description
     * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    getFormArray(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Sets the new value for the provided `FormControlName` directive.
     *
     * @param dir The `FormControlName` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir, value) {
        const ctrl = this.form.get(dir.path);
        ctrl.setValue(value);
    }
    /**
     * @description
     * Method called with the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event) {
        this.submitted = true;
        syncPendingControls(this.form, this.directives);
        this.ngSubmit.emit($event);
        return false;
    }
    /**
     * @description
     * Method called when the "reset" event is triggered on the form.
     */
    onReset() {
        this.resetForm();
    }
    /**
     * @description
     * Resets the form to an initial value and resets its submitted status.
     *
     * @param value The new value for the form.
     */
    resetForm(value = undefined) {
        this.form.reset(value);
        this.submitted = false;
    }
    /** @internal */
    _updateDomValue() {
        this.directives.forEach(dir => {
            const oldCtrl = dir.control;
            const newCtrl = this.form.get(dir.path);
            if (oldCtrl !== newCtrl) {
                // Note: the value of the `dir.control` may not be defined, for example when it's a first
                // `FormControl` that is added to a `FormGroup` instance (via `addControl` call).
                cleanUpControl(oldCtrl || null, dir);
                // Check whether new control at the same location inside the corresponding `FormGroup` is an
                // instance of `FormControl` and perform control setup only if that's the case.
                // Note: we don't need to clear the list of directives (`this.directives`) here, it would be
                // taken care of in the `removeControl` method invoked when corresponding `formControlName`
                // directive instance is being removed (invoked from `FormControlName.ngOnDestroy`).
                if (newCtrl instanceof FormControl) {
                    setUpControl(newCtrl, dir);
                    dir.control = newCtrl;
                }
            }
        });
        this.form._updateTreeValidity({ emitEvent: false });
    }
    _setUpFormContainer(dir) {
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        // NOTE: this operation looks unnecessary in case no new validators were added in
        // `setUpFormContainer` call. Consider updating this code to match the logic in
        // `_cleanUpFormContainer` function.
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    _cleanUpFormContainer(dir) {
        if (this.form) {
            const ctrl = this.form.get(dir.path);
            if (ctrl) {
                const isControlUpdated = cleanUpFormContainer(ctrl, dir);
                if (isControlUpdated) {
                    // Run validity check only in case a control was updated (i.e. view validators were
                    // removed) as removing view validators might cause validity to change.
                    ctrl.updateValueAndValidity({ emitEvent: false });
                }
            }
        }
    }
    _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange);
        if (this._oldForm) {
            this._oldForm._registerOnCollectionChange(() => { });
        }
    }
    _updateValidators() {
        setUpValidators(this.form, this);
        if (this._oldForm) {
            cleanUpValidators(this._oldForm, this);
        }
    }
    _checkFormPresent() {
        if (!this.form && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            ReactiveErrors.missingFormException();
        }
    }
}
FormGroupDirective.decorators = [
    { type: Directive, args: [{
                selector: '[formGroup]',
                providers: [formDirectiveProvider],
                host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                exportAs: 'ngForm'
            },] }
];
FormGroupDirective.ctorParameters = () => [
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] }] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] }] }
];
FormGroupDirective.propDecorators = {
    form: [{ type: Input, args: ['formGroup',] }],
    ngSubmit: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUF3QixRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFFOUksT0FBTyxFQUFZLFdBQVcsRUFBRSxTQUFTLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDOUQsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXRELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsY0FBYyxFQUFFLG9CQUFvQixFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFDLE1BQU0sV0FBVyxDQUFDO0FBTTFLLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFRO0lBQ3hDLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztDQUNsRCxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJHO0FBT0gsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGdCQUFnQjtJQXFDdEQsWUFDdUQsVUFBcUMsRUFDL0IsZUFDbEI7UUFDekMsS0FBSyxFQUFFLENBQUM7UUFINkMsZUFBVSxHQUFWLFVBQVUsQ0FB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QyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO1lBQ2pFLGNBQWMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQzs7O1lBdFRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsU0FBUyxFQUFFLENBQUMscUJBQXFCLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxFQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFDO2dCQUM5RCxRQUFRLEVBQUUsUUFBUTthQUNuQjs7O3dDQXVDTSxRQUFRLFlBQUksSUFBSSxZQUFJLE1BQU0sU0FBQyxhQUFhO3dDQUN4QyxRQUFRLFlBQUksSUFBSSxZQUFJLE1BQU0sU0FBQyxtQkFBbUI7OzttQkFWbEQsS0FBSyxTQUFDLFdBQVc7dUJBTWpCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBPdXRwdXQsIFNlbGYsIFNpbXBsZUNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Zvcm1BcnJheSwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cH0gZnJvbSAnLi4vLi4vbW9kZWwnO1xuaW1wb3J0IHtOR19BU1lOQ19WQUxJREFUT1JTLCBOR19WQUxJREFUT1JTfSBmcm9tICcuLi8uLi92YWxpZGF0b3JzJztcbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtGb3JtfSBmcm9tICcuLi9mb3JtX2ludGVyZmFjZSc7XG5pbXBvcnQge1JlYWN0aXZlRXJyb3JzfSBmcm9tICcuLi9yZWFjdGl2ZV9lcnJvcnMnO1xuaW1wb3J0IHtjbGVhblVwQ29udHJvbCwgY2xlYW5VcEZvcm1Db250YWluZXIsIGNsZWFuVXBWYWxpZGF0b3JzLCByZW1vdmVMaXN0SXRlbSwgc2V0VXBDb250cm9sLCBzZXRVcEZvcm1Db250YWluZXIsIHNldFVwVmFsaWRhdG9ycywgc3luY1BlbmRpbmdDb250cm9sc30gZnJvbSAnLi4vc2hhcmVkJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5pbXBvcnQge0Zvcm1Db250cm9sTmFtZX0gZnJvbSAnLi9mb3JtX2NvbnRyb2xfbmFtZSc7XG5pbXBvcnQge0Zvcm1BcnJheU5hbWUsIEZvcm1Hcm91cE5hbWV9IGZyb20gJy4vZm9ybV9ncm91cF9uYW1lJztcblxuZXhwb3J0IGNvbnN0IGZvcm1EaXJlY3RpdmVQcm92aWRlcjogYW55ID0ge1xuICBwcm92aWRlOiBDb250cm9sQ29udGFpbmVyLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBGb3JtR3JvdXBEaXJlY3RpdmUpXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEJpbmRzIGFuIGV4aXN0aW5nIGBGb3JtR3JvdXBgIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgYWNjZXB0cyBhbiBleGlzdGluZyBgRm9ybUdyb3VwYCBpbnN0YW5jZS4gSXQgd2lsbCB0aGVuIHVzZSB0aGlzXG4gKiBgRm9ybUdyb3VwYCBpbnN0YW5jZSB0byBtYXRjaCBhbnkgY2hpbGQgYEZvcm1Db250cm9sYCwgYEZvcm1Hcm91cGAsXG4gKiBhbmQgYEZvcm1BcnJheWAgaW5zdGFuY2VzIHRvIGNoaWxkIGBGb3JtQ29udHJvbE5hbWVgLCBgRm9ybUdyb3VwTmFtZWAsXG4gKiBhbmQgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZXMuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBgQWJzdHJhY3RDb250cm9sYFxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiAjIyMgUmVnaXN0ZXIgRm9ybSBHcm91cFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSByZWdpc3RlcnMgYSBgRm9ybUdyb3VwYCB3aXRoIGZpcnN0IG5hbWUgYW5kIGxhc3QgbmFtZSBjb250cm9scyxcbiAqIGFuZCBsaXN0ZW5zIGZvciB0aGUgKm5nU3VibWl0KiBldmVudCB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlRm9ybUdyb3VwL3NpbXBsZV9mb3JtX2dyb3VwX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tmb3JtR3JvdXBdJyxcbiAgcHJvdmlkZXJzOiBbZm9ybURpcmVjdGl2ZVByb3ZpZGVyXSxcbiAgaG9zdDogeycoc3VibWl0KSc6ICdvblN1Ym1pdCgkZXZlbnQpJywgJyhyZXNldCknOiAnb25SZXNldCgpJ30sXG4gIGV4cG9ydEFzOiAnbmdGb3JtJ1xufSlcbmV4cG9ydCBjbGFzcyBGb3JtR3JvdXBEaXJlY3RpdmUgZXh0ZW5kcyBDb250cm9sQ29udGFpbmVyIGltcGxlbWVudHMgRm9ybSwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlcG9ydHMgd2hldGhlciB0aGUgZm9ybSBzdWJtaXNzaW9uIGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdWJtaXR0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIGFuIG9sZCBmb3JtIGdyb3VwIGlucHV0IHZhbHVlLCB3aGljaCBpcyBuZWVkZWQgdG8gY2xlYW51cCBvbGQgaW5zdGFuY2UgaW4gY2FzZSBpdFxuICAgKiB3YXMgcmVwbGFjZWQgd2l0aCBhIG5ldyBvbmUuXG4gICAqL1xuICBwcml2YXRlIF9vbGRGb3JtOiBGb3JtR3JvdXB8dW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0aGF0IHNob3VsZCBiZSBpbnZva2VkIHdoZW4gY29udHJvbHMgaW4gRm9ybUdyb3VwIG9yIEZvcm1BcnJheSBjb2xsZWN0aW9uIGNoYW5nZVxuICAgKiAoYWRkZWQgb3IgcmVtb3ZlZCkuIFRoaXMgY2FsbGJhY2sgdHJpZ2dlcnMgY29ycmVzcG9uZGluZyBET00gdXBkYXRlcy5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX29uQ29sbGVjdGlvbkNoYW5nZSA9ICgpID0+IHRoaXMuX3VwZGF0ZURvbVZhbHVlKCk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIGxpc3Qgb2YgYWRkZWQgYEZvcm1Db250cm9sTmFtZWAgaW5zdGFuY2VzXG4gICAqL1xuICBkaXJlY3RpdmVzOiBGb3JtQ29udHJvbE5hbWVbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBgRm9ybUdyb3VwYCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIEBJbnB1dCgnZm9ybUdyb3VwJykgZm9ybTogRm9ybUdyb3VwID0gbnVsbCE7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBFbWl0cyBhbiBldmVudCB3aGVuIHRoZSBmb3JtIHN1Ym1pc3Npb24gaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICAgKi9cbiAgQE91dHB1dCgpIG5nU3VibWl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHByaXZhdGUgdmFsaWRhdG9yczogKFZhbGlkYXRvcnxWYWxpZGF0b3JGbilbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19BU1lOQ19WQUxJREFUT1JTKSBwcml2YXRlIGFzeW5jVmFsaWRhdG9yczpcbiAgICAgICAgICAoQXN5bmNWYWxpZGF0b3J8QXN5bmNWYWxpZGF0b3JGbilbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICB0aGlzLl9zZXRBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrRm9ybVByZXNlbnQoKTtcbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZm9ybScpKSB7XG4gICAgICB0aGlzLl91cGRhdGVWYWxpZGF0b3JzKCk7XG4gICAgICB0aGlzLl91cGRhdGVEb21WYWx1ZSgpO1xuICAgICAgdGhpcy5fdXBkYXRlUmVnaXN0cmF0aW9ucygpO1xuICAgICAgdGhpcy5fb2xkRm9ybSA9IHRoaXMuZm9ybTtcbiAgICB9XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmZvcm0pIHtcbiAgICAgIGNsZWFuVXBWYWxpZGF0b3JzKHRoaXMuZm9ybSwgdGhpcyk7XG5cbiAgICAgIC8vIEN1cnJlbnRseSB0aGUgYG9uQ29sbGVjdGlvbkNoYW5nZWAgY2FsbGJhY2sgaXMgcmV3cml0dGVuIGVhY2ggdGltZSB0aGVcbiAgICAgIC8vIGBfcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2VgIGZ1bmN0aW9uIGlzIGludm9rZWQuIFRoZSBpbXBsaWNhdGlvbiBpcyB0aGF0IGNsZWFudXAgc2hvdWxkXG4gICAgICAvLyBoYXBwZW4gKm9ubHkqIHdoZW4gdGhlIGBvbkNvbGxlY3Rpb25DaGFuZ2VgIGNhbGxiYWNrIHdhcyBzZXQgYnkgdGhpcyBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAgICAvLyBPdGhlcndpc2UgaXQgbWlnaHQgY2F1c2Ugb3ZlcnJpZGluZyBhIGNhbGxiYWNrIG9mIHNvbWUgb3RoZXIgZGlyZWN0aXZlIGluc3RhbmNlcy4gV2Ugc2hvdWxkXG4gICAgICAvLyBjb25zaWRlciB1cGRhdGluZyB0aGlzIGxvZ2ljIGxhdGVyIHRvIG1ha2UgaXQgc2ltaWxhciB0byBob3cgYG9uQ2hhbmdlYCBjYWxsYmFja3MgYXJlXG4gICAgICAvLyBoYW5kbGVkLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMzk3MzIgZm9yIGFkZGl0aW9uYWwgaW5mby5cbiAgICAgIGlmICh0aGlzLmZvcm0uX29uQ29sbGVjdGlvbkNoYW5nZSA9PT0gdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuZm9ybS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyB0aGlzIGRpcmVjdGl2ZSdzIGluc3RhbmNlLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IGZvcm1EaXJlY3RpdmUoKTogRm9ybSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgdGhlIGBGb3JtR3JvdXBgIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IGNvbnRyb2woKTogRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGlzIGdyb3VwLiBCZWNhdXNlIHRoaXMgZGlyZWN0aXZlXG4gICAqIGFsd2F5cyBsaXZlcyBhdCB0aGUgdG9wIGxldmVsIG9mIGEgZm9ybSwgaXQgYWx3YXlzIGFuIGVtcHR5IGFycmF5LlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IHBhdGgoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRoYXQgc2V0cyB1cCB0aGUgY29udHJvbCBkaXJlY3RpdmUgaW4gdGhpcyBncm91cCwgcmUtY2FsY3VsYXRlcyBpdHMgdmFsdWVcbiAgICogYW5kIHZhbGlkaXR5LCBhbmQgYWRkcyB0aGUgaW5zdGFuY2UgdG8gdGhlIGludGVybmFsIGxpc3Qgb2YgZGlyZWN0aXZlcy5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgYWRkQ29udHJvbChkaXI6IEZvcm1Db250cm9sTmFtZSk6IEZvcm1Db250cm9sIHtcbiAgICBjb25zdCBjdHJsOiBhbnkgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICBzZXRVcENvbnRyb2woY3RybCwgZGlyKTtcbiAgICBjdHJsLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgICB0aGlzLmRpcmVjdGl2ZXMucHVzaChkaXIpO1xuICAgIHJldHVybiBjdHJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgZnJvbSB0aGUgcHJvdmlkZWQgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGdldENvbnRyb2woZGlyOiBGb3JtQ29udHJvbE5hbWUpOiBGb3JtQ29udHJvbCB7XG4gICAgcmV0dXJuIDxGb3JtQ29udHJvbD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVtb3ZlcyB0aGUgYEZvcm1Db250cm9sTmFtZWAgaW5zdGFuY2UgZnJvbSB0aGUgaW50ZXJuYWwgbGlzdCBvZiBkaXJlY3RpdmVzXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIHJlbW92ZUNvbnRyb2woZGlyOiBGb3JtQ29udHJvbE5hbWUpOiB2b2lkIHtcbiAgICBjbGVhblVwQ29udHJvbChkaXIuY29udHJvbCB8fCBudWxsLCBkaXIsIC8qIHZhbGlkYXRlQ29udHJvbFByZXNlbmNlT25DaGFuZ2UgKi8gZmFsc2UpO1xuICAgIHJlbW92ZUxpc3RJdGVtKHRoaXMuZGlyZWN0aXZlcywgZGlyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbmV3IGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UgdG8gdGhlIGZvcm0uXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBhZGRGb3JtR3JvdXAoZGlyOiBGb3JtR3JvdXBOYW1lKTogdm9pZCB7XG4gICAgdGhpcy5fc2V0VXBGb3JtQ29udGFpbmVyKGRpcik7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgdGhlIG5lY2Vzc2FyeSBjbGVhbnVwIHdoZW4gYSBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlIGlzIHJlbW92ZWQgZnJvbSB0aGVcbiAgICogdmlldy5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIHJlbW92ZUZvcm1Hcm91cChkaXI6IEZvcm1Hcm91cE5hbWUpOiB2b2lkIHtcbiAgICB0aGlzLl9jbGVhblVwRm9ybUNvbnRhaW5lcihkaXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtR3JvdXBgIGZvciBhIHByb3ZpZGVkIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2VcbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGdldEZvcm1Hcm91cChkaXI6IEZvcm1Hcm91cE5hbWUpOiBGb3JtR3JvdXAge1xuICAgIHJldHVybiA8Rm9ybUdyb3VwPnRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIHRoZSBuZWNlc3Nhcnkgc2V0dXAgd2hlbiBhIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UgaXMgYWRkZWQgdG8gdGhlIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBhZGRGb3JtQXJyYXkoZGlyOiBGb3JtQXJyYXlOYW1lKTogdm9pZCB7XG4gICAgdGhpcy5fc2V0VXBGb3JtQ29udGFpbmVyKGRpcik7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgdGhlIG5lY2Vzc2FyeSBjbGVhbnVwIHdoZW4gYSBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlIGlzIHJlbW92ZWQgZnJvbSB0aGVcbiAgICogdmlldy5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIHJlbW92ZUZvcm1BcnJheShkaXI6IEZvcm1BcnJheU5hbWUpOiB2b2lkIHtcbiAgICB0aGlzLl9jbGVhblVwRm9ybUNvbnRhaW5lcihkaXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtQXJyYXlgIGZvciBhIHByb3ZpZGVkIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRGb3JtQXJyYXkoZGlyOiBGb3JtQXJyYXlOYW1lKTogRm9ybUFycmF5IHtcbiAgICByZXR1cm4gPEZvcm1BcnJheT50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBuZXcgdmFsdWUgZm9yIHRoZSBwcm92aWRlZCBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBkaXJlY3RpdmUncyBjb250cm9sLlxuICAgKi9cbiAgdXBkYXRlTW9kZWwoZGlyOiBGb3JtQ29udHJvbE5hbWUsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBjdHJswqAgPSA8Rm9ybUNvbnRyb2w+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgY3RybC5zZXRWYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCBjYWxsZWQgd2l0aCB0aGUgXCJzdWJtaXRcIiBldmVudCBpcyB0cmlnZ2VyZWQgb24gdGhlIGZvcm0uXG4gICAqIFRyaWdnZXJzIHRoZSBgbmdTdWJtaXRgIGVtaXR0ZXIgdG8gZW1pdCB0aGUgXCJzdWJtaXRcIiBldmVudCBhcyBpdHMgcGF5bG9hZC5cbiAgICpcbiAgICogQHBhcmFtICRldmVudCBUaGUgXCJzdWJtaXRcIiBldmVudCBvYmplY3RcbiAgICovXG4gIG9uU3VibWl0KCRldmVudDogRXZlbnQpOiBib29sZWFuIHtcbiAgICAodGhpcyBhcyB7c3VibWl0dGVkOiBib29sZWFufSkuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICBzeW5jUGVuZGluZ0NvbnRyb2xzKHRoaXMuZm9ybSwgdGhpcy5kaXJlY3RpdmVzKTtcbiAgICB0aGlzLm5nU3VibWl0LmVtaXQoJGV2ZW50KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgXCJyZXNldFwiIGV2ZW50IGlzIHRyaWdnZXJlZCBvbiB0aGUgZm9ybS5cbiAgICovXG4gIG9uUmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5yZXNldEZvcm0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVzZXRzIHRoZSBmb3JtIHRvIGFuIGluaXRpYWwgdmFsdWUgYW5kIHJlc2V0cyBpdHMgc3VibWl0dGVkIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBmb3JtLlxuICAgKi9cbiAgcmVzZXRGb3JtKHZhbHVlOiBhbnkgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICB0aGlzLmZvcm0ucmVzZXQodmFsdWUpO1xuICAgICh0aGlzIGFzIHtzdWJtaXR0ZWQ6IGJvb2xlYW59KS5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlRG9tVmFsdWUoKSB7XG4gICAgdGhpcy5kaXJlY3RpdmVzLmZvckVhY2goZGlyID0+IHtcbiAgICAgIGNvbnN0IG9sZEN0cmwgPSBkaXIuY29udHJvbDtcbiAgICAgIGNvbnN0IG5ld0N0cmwgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICAgIGlmIChvbGRDdHJsICE9PSBuZXdDdHJsKSB7XG4gICAgICAgIC8vIE5vdGU6IHRoZSB2YWx1ZSBvZiB0aGUgYGRpci5jb250cm9sYCBtYXkgbm90IGJlIGRlZmluZWQsIGZvciBleGFtcGxlIHdoZW4gaXQncyBhIGZpcnN0XG4gICAgICAgIC8vIGBGb3JtQ29udHJvbGAgdGhhdCBpcyBhZGRlZCB0byBhIGBGb3JtR3JvdXBgIGluc3RhbmNlICh2aWEgYGFkZENvbnRyb2xgIGNhbGwpLlxuICAgICAgICBjbGVhblVwQ29udHJvbChvbGRDdHJsIHx8IG51bGwsIGRpcik7XG5cbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBuZXcgY29udHJvbCBhdCB0aGUgc2FtZSBsb2NhdGlvbiBpbnNpZGUgdGhlIGNvcnJlc3BvbmRpbmcgYEZvcm1Hcm91cGAgaXMgYW5cbiAgICAgICAgLy8gaW5zdGFuY2Ugb2YgYEZvcm1Db250cm9sYCBhbmQgcGVyZm9ybSBjb250cm9sIHNldHVwIG9ubHkgaWYgdGhhdCdzIHRoZSBjYXNlLlxuICAgICAgICAvLyBOb3RlOiB3ZSBkb24ndCBuZWVkIHRvIGNsZWFyIHRoZSBsaXN0IG9mIGRpcmVjdGl2ZXMgKGB0aGlzLmRpcmVjdGl2ZXNgKSBoZXJlLCBpdCB3b3VsZCBiZVxuICAgICAgICAvLyB0YWtlbiBjYXJlIG9mIGluIHRoZSBgcmVtb3ZlQ29udHJvbGAgbWV0aG9kIGludm9rZWQgd2hlbiBjb3JyZXNwb25kaW5nIGBmb3JtQ29udHJvbE5hbWVgXG4gICAgICAgIC8vIGRpcmVjdGl2ZSBpbnN0YW5jZSBpcyBiZWluZyByZW1vdmVkIChpbnZva2VkIGZyb20gYEZvcm1Db250cm9sTmFtZS5uZ09uRGVzdHJveWApLlxuICAgICAgICBpZiAobmV3Q3RybCBpbnN0YW5jZW9mIEZvcm1Db250cm9sKSB7XG4gICAgICAgICAgc2V0VXBDb250cm9sKG5ld0N0cmwsIGRpcik7XG4gICAgICAgICAgKGRpciBhcyB7Y29udHJvbDogRm9ybUNvbnRyb2x9KS5jb250cm9sID0gbmV3Q3RybDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5mb3JtLl91cGRhdGVUcmVlVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFVwRm9ybUNvbnRhaW5lcihkaXI6IEZvcm1BcnJheU5hbWV8Rm9ybUdyb3VwTmFtZSk6IHZvaWQge1xuICAgIGNvbnN0IGN0cmw6IGFueSA9IHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgIHNldFVwRm9ybUNvbnRhaW5lcihjdHJsLCBkaXIpO1xuICAgIC8vIE5PVEU6IHRoaXMgb3BlcmF0aW9uIGxvb2tzIHVubmVjZXNzYXJ5IGluIGNhc2Ugbm8gbmV3IHZhbGlkYXRvcnMgd2VyZSBhZGRlZCBpblxuICAgIC8vIGBzZXRVcEZvcm1Db250YWluZXJgIGNhbGwuIENvbnNpZGVyIHVwZGF0aW5nIHRoaXMgY29kZSB0byBtYXRjaCB0aGUgbG9naWMgaW5cbiAgICAvLyBgX2NsZWFuVXBGb3JtQ29udGFpbmVyYCBmdW5jdGlvbi5cbiAgICBjdHJsLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NsZWFuVXBGb3JtQ29udGFpbmVyKGRpcjogRm9ybUFycmF5TmFtZXxGb3JtR3JvdXBOYW1lKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZm9ybSkge1xuICAgICAgY29uc3QgY3RybDogYW55ID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICBpZiAoY3RybCkge1xuICAgICAgICBjb25zdCBpc0NvbnRyb2xVcGRhdGVkID0gY2xlYW5VcEZvcm1Db250YWluZXIoY3RybCwgZGlyKTtcbiAgICAgICAgaWYgKGlzQ29udHJvbFVwZGF0ZWQpIHtcbiAgICAgICAgICAvLyBSdW4gdmFsaWRpdHkgY2hlY2sgb25seSBpbiBjYXNlIGEgY29udHJvbCB3YXMgdXBkYXRlZCAoaS5lLiB2aWV3IHZhbGlkYXRvcnMgd2VyZVxuICAgICAgICAgIC8vIHJlbW92ZWQpIGFzIHJlbW92aW5nIHZpZXcgdmFsaWRhdG9ycyBtaWdodCBjYXVzZSB2YWxpZGl0eSB0byBjaGFuZ2UuXG4gICAgICAgICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVSZWdpc3RyYXRpb25zKCkge1xuICAgIHRoaXMuZm9ybS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICBpZiAodGhpcy5fb2xkRm9ybSkge1xuICAgICAgdGhpcy5fb2xkRm9ybS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVZhbGlkYXRvcnMoKSB7XG4gICAgc2V0VXBWYWxpZGF0b3JzKHRoaXMuZm9ybSwgdGhpcyk7XG4gICAgaWYgKHRoaXMuX29sZEZvcm0pIHtcbiAgICAgIGNsZWFuVXBWYWxpZGF0b3JzKHRoaXMuX29sZEZvcm0sIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrRm9ybVByZXNlbnQoKSB7XG4gICAgaWYgKCF0aGlzLmZvcm0gJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIFJlYWN0aXZlRXJyb3JzLm1pc3NpbmdGb3JtRXhjZXB0aW9uKCk7XG4gICAgfVxuICB9XG59XG4iXX0=