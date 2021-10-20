/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter } from '@angular/core';
import { removeListItem } from './directives/shared';
import { composeAsyncValidators, composeValidators, toObservable } from './validators';
/**
 * Reports that a FormControl is valid, meaning that no errors exist in the input value.
 *
 * @see `status`
 */
export const VALID = 'VALID';
/**
 * Reports that a FormControl is invalid, meaning that an error exists in the input value.
 *
 * @see `status`
 */
export const INVALID = 'INVALID';
/**
 * Reports that a FormControl is pending, meaning that that async validation is occurring and
 * errors are not yet available for the input value.
 *
 * @see `markAsPending`
 * @see `status`
 */
export const PENDING = 'PENDING';
/**
 * Reports that a FormControl is disabled, meaning that the control is exempt from ancestor
 * calculations of validity or value.
 *
 * @see `markAsDisabled`
 * @see `status`
 */
export const DISABLED = 'DISABLED';
function _find(control, path, delimiter) {
    if (path == null)
        return null;
    if (!Array.isArray(path)) {
        path = path.split(delimiter);
    }
    if (Array.isArray(path) && path.length === 0)
        return null;
    // Not using Array.reduce here due to a Chrome 80 bug
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
    let controlToFind = control;
    path.forEach((name) => {
        if (controlToFind instanceof FormGroup) {
            controlToFind = controlToFind.controls.hasOwnProperty(name) ?
                controlToFind.controls[name] :
                null;
        }
        else if (controlToFind instanceof FormArray) {
            controlToFind = controlToFind.at(name) || null;
        }
        else {
            controlToFind = null;
        }
    });
    return controlToFind;
}
/**
 * Gets validators from either an options object or given validators.
 */
function pickValidators(validatorOrOpts) {
    return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators : validatorOrOpts) || null;
}
/**
 * Creates validator function by combining provided validators.
 */
function coerceToValidator(validator) {
    return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
/**
 * Gets async validators from either an options object or given validators.
 */
function pickAsyncValidators(asyncValidator, validatorOrOpts) {
    return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator) || null;
}
/**
 * Creates async validator function by combining provided async validators.
 */
function coerceToAsyncValidator(asyncValidator) {
    return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) :
        asyncValidator || null;
}
function isOptionsObj(validatorOrOpts) {
    return validatorOrOpts != null && !Array.isArray(validatorOrOpts) &&
        typeof validatorOrOpts === 'object';
}
/**
 * This is the base class for `FormControl`, `FormGroup`, and `FormArray`.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 *
 * @see [Forms Guide](/guide/forms)
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 * @see [Dynamic Forms Guide](/guide/dynamic-form)
 *
 * @publicApi
 */
export class AbstractControl {
    /**
     * Initialize the AbstractControl instance.
     *
     * @param validators The function or array of functions that is used to determine the validity of
     *     this control synchronously.
     * @param asyncValidators The function or array of functions that is used to determine validity of
     *     this control asynchronously.
     */
    constructor(validators, asyncValidators) {
        /**
         * Indicates that a control has its own pending asynchronous validation in progress.
         *
         * @internal
         */
        this._hasOwnPendingAsyncValidator = false;
        /** @internal */
        this._onCollectionChange = () => { };
        this._parent = null;
        /**
         * A control is `pristine` if the user has not yet changed
         * the value in the UI.
         *
         * @returns True if the user has not yet changed the value in the UI; compare `dirty`.
         * Programmatic changes to a control's value do not mark it dirty.
         */
        this.pristine = true;
        /**
         * True if the control is marked as `touched`.
         *
         * A control is marked `touched` once the user has triggered
         * a `blur` event on it.
         */
        this.touched = false;
        /** @internal */
        this._onDisabledChange = [];
        this._rawValidators = validators;
        this._rawAsyncValidators = asyncValidators;
        this._composedValidatorFn = coerceToValidator(this._rawValidators);
        this._composedAsyncValidatorFn = coerceToAsyncValidator(this._rawAsyncValidators);
    }
    /**
     * The function that is used to determine the validity of this control synchronously.
     */
    get validator() {
        return this._composedValidatorFn;
    }
    set validator(validatorFn) {
        this._rawValidators = this._composedValidatorFn = validatorFn;
    }
    /**
     * The function that is used to determine the validity of this control asynchronously.
     */
    get asyncValidator() {
        return this._composedAsyncValidatorFn;
    }
    set asyncValidator(asyncValidatorFn) {
        this._rawAsyncValidators = this._composedAsyncValidatorFn = asyncValidatorFn;
    }
    /**
     * The parent control.
     */
    get parent() {
        return this._parent;
    }
    /**
     * A control is `valid` when its `status` is `VALID`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if the control has passed all of its validation tests,
     * false otherwise.
     */
    get valid() {
        return this.status === VALID;
    }
    /**
     * A control is `invalid` when its `status` is `INVALID`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if this control has failed one or more of its validation checks,
     * false otherwise.
     */
    get invalid() {
        return this.status === INVALID;
    }
    /**
     * A control is `pending` when its `status` is `PENDING`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if this control is in the process of conducting a validation check,
     * false otherwise.
     */
    get pending() {
        return this.status == PENDING;
    }
    /**
     * A control is `disabled` when its `status` is `DISABLED`.
     *
     * Disabled controls are exempt from validation checks and
     * are not included in the aggregate value of their ancestor
     * controls.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if the control is disabled, false otherwise.
     */
    get disabled() {
        return this.status === DISABLED;
    }
    /**
     * A control is `enabled` as long as its `status` is not `DISABLED`.
     *
     * @returns True if the control has any status other than 'DISABLED',
     * false if the status is 'DISABLED'.
     *
     * @see {@link AbstractControl.status}
     *
     */
    get enabled() {
        return this.status !== DISABLED;
    }
    /**
     * A control is `dirty` if the user has changed the value
     * in the UI.
     *
     * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
     * Programmatic changes to a control's value do not mark it dirty.
     */
    get dirty() {
        return !this.pristine;
    }
    /**
     * True if the control has not been marked as touched
     *
     * A control is `untouched` if the user has not yet triggered
     * a `blur` event on it.
     */
    get untouched() {
        return !this.touched;
    }
    /**
     * Reports the update strategy of the `AbstractControl` (meaning
     * the event on which the control updates itself).
     * Possible values: `'change'` | `'blur'` | `'submit'`
     * Default value: `'change'`
     */
    get updateOn() {
        return this._updateOn ? this._updateOn : (this.parent ? this.parent.updateOn : 'change');
    }
    /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this overwrites any existing sync validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    setValidators(newValidator) {
        this._rawValidators = newValidator;
        this._composedValidatorFn = coerceToValidator(newValidator);
    }
    /**
     * Sets the async validators that are active on this control. Calling this
     * overwrites any existing async validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    setAsyncValidators(newValidator) {
        this._rawAsyncValidators = newValidator;
        this._composedAsyncValidatorFn = coerceToAsyncValidator(newValidator);
    }
    /**
     * Empties out the sync validator list.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    clearValidators() {
        this.validator = null;
    }
    /**
     * Empties out the async validator list.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    clearAsyncValidators() {
        this.asyncValidator = null;
    }
    /**
     * Marks the control as `touched`. A control is touched by focus and
     * blur events that do not change the value.
     *
     * @see `markAsUntouched()`
     * @see `markAsDirty()`
     * @see `markAsPristine()`
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsTouched(opts = {}) {
        this.touched = true;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsTouched(opts);
        }
    }
    /**
     * Marks the control and all its descendant controls as `touched`.
     * @see `markAsTouched()`
     */
    markAllAsTouched() {
        this.markAsTouched({ onlySelf: true });
        this._forEachChild((control) => control.markAllAsTouched());
    }
    /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, also marks all children as `untouched`
     * and recalculates the `touched` status of all parent controls.
     *
     * @see `markAsTouched()`
     * @see `markAsDirty()`
     * @see `markAsPristine()`
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after the marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsUntouched(opts = {}) {
        this.touched = false;
        this._pendingTouched = false;
        this._forEachChild((control) => {
            control.markAsUntouched({ onlySelf: true });
        });
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    }
    /**
     * Marks the control as `dirty`. A control becomes dirty when
     * the control's value is changed through the UI; compare `markAsTouched`.
     *
     * @see `markAsTouched()`
     * @see `markAsUntouched()`
     * @see `markAsPristine()`
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsDirty(opts = {}) {
        this.pristine = false;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsDirty(opts);
        }
    }
    /**
     * Marks the control as `pristine`.
     *
     * If the control has any children, marks all children as `pristine`,
     * and recalculates the `pristine` status of all parent
     * controls.
     *
     * @see `markAsTouched()`
     * @see `markAsUntouched()`
     * @see `markAsDirty()`
     *
     * @param opts Configuration options that determine how the control emits events after
     * marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsPristine(opts = {}) {
        this.pristine = true;
        this._pendingDirty = false;
        this._forEachChild((control) => {
            control.markAsPristine({ onlySelf: true });
        });
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    }
    /**
     * Marks the control as `pending`.
     *
     * A control is pending while the control performs async validation.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configuration options that determine how the control propagates changes and
     * emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), the `statusChanges`
     * observable emits an event with the latest status the control is marked pending.
     * When false, no events are emitted.
     *
     */
    markAsPending(opts = {}) {
        this.status = PENDING;
        if (opts.emitEvent !== false) {
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsPending(opts);
        }
    }
    /**
     * Disables the control. This means the control is exempt from validation checks and
     * excluded from the aggregate value of any parent. Its status is `DISABLED`.
     *
     * If the control has children, all children are also disabled.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configuration options that determine how the control propagates
     * changes and emits events after the control is disabled.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is disabled.
     * When false, no events are emitted.
     */
    disable(opts = {}) {
        // If parent has been marked artificially dirty we don't want to re-calculate the
        // parent's dirtiness based on the children.
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        this.status = DISABLED;
        this.errors = null;
        this._forEachChild((control) => {
            control.disable(Object.assign(Object.assign({}, opts), { onlySelf: true }));
        });
        this._updateValue();
        if (opts.emitEvent !== false) {
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        this._updateAncestors(Object.assign(Object.assign({}, opts), { skipPristineCheck }));
        this._onDisabledChange.forEach((changeFn) => changeFn(true));
    }
    /**
     * Enables the control. This means the control is included in validation checks and
     * the aggregate value of its parent. Its status recalculates based on its value and
     * its validators.
     *
     * By default, if the control has children, all children are enabled.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configure options that control how the control propagates changes and
     * emits events when marked as untouched
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is enabled.
     * When false, no events are emitted.
     */
    enable(opts = {}) {
        // If parent has been marked artificially dirty we don't want to re-calculate the
        // parent's dirtiness based on the children.
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        this.status = VALID;
        this._forEachChild((control) => {
            control.enable(Object.assign(Object.assign({}, opts), { onlySelf: true }));
        });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
        this._updateAncestors(Object.assign(Object.assign({}, opts), { skipPristineCheck }));
        this._onDisabledChange.forEach((changeFn) => changeFn(false));
    }
    _updateAncestors(opts) {
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
            if (!opts.skipPristineCheck) {
                this._parent._updatePristine();
            }
            this._parent._updateTouched();
        }
    }
    /**
     * @param parent Sets the parent of the control
     */
    setParent(parent) {
        this._parent = parent;
    }
    /**
     * Recalculates the value and validation status of the control.
     *
     * By default, it also updates the value and validity of its ancestors.
     *
     * @param opts Configuration options determine how the control propagates changes and emits events
     * after updates and validity checks are applied.
     * * `onlySelf`: When true, only update this control. When false or not supplied,
     * update all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is updated.
     * When false, no events are emitted.
     */
    updateValueAndValidity(opts = {}) {
        this._setInitialStatus();
        this._updateValue();
        if (this.enabled) {
            this._cancelExistingSubscription();
            this.errors = this._runValidator();
            this.status = this._calculateStatus();
            if (this.status === VALID || this.status === PENDING) {
                this._runAsyncValidator(opts.emitEvent);
            }
        }
        if (opts.emitEvent !== false) {
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
        }
    }
    /** @internal */
    _updateTreeValidity(opts = { emitEvent: true }) {
        this._forEachChild((ctrl) => ctrl._updateTreeValidity(opts));
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
    }
    _setInitialStatus() {
        this.status = this._allControlsDisabled() ? DISABLED : VALID;
    }
    _runValidator() {
        return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(emitEvent) {
        if (this.asyncValidator) {
            this.status = PENDING;
            this._hasOwnPendingAsyncValidator = true;
            const obs = toObservable(this.asyncValidator(this));
            this._asyncValidationSubscription = obs.subscribe((errors) => {
                this._hasOwnPendingAsyncValidator = false;
                // This will trigger the recalculation of the validation status, which depends on
                // the state of the asynchronous validation (whether it is in progress or not). So, it is
                // necessary that we have updated the `_hasOwnPendingAsyncValidator` boolean flag first.
                this.setErrors(errors, { emitEvent });
            });
        }
    }
    _cancelExistingSubscription() {
        if (this._asyncValidationSubscription) {
            this._asyncValidationSubscription.unsubscribe();
            this._hasOwnPendingAsyncValidator = false;
        }
    }
    /**
     * Sets errors on a form control when running validations manually, rather than automatically.
     *
     * Calling `setErrors` also updates the validity of the parent control.
     *
     * @usageNotes
     *
     * ### Manually set the errors for a control
     *
     * ```
     * const login = new FormControl('someLogin');
     * login.setErrors({
     *   notUnique: true
     * });
     *
     * expect(login.valid).toEqual(false);
     * expect(login.errors).toEqual({ notUnique: true });
     *
     * login.setValue('someOtherLogin');
     *
     * expect(login.valid).toEqual(true);
     * ```
     */
    setErrors(errors, opts = {}) {
        this.errors = errors;
        this._updateControlsErrors(opts.emitEvent !== false);
    }
    /**
     * Retrieves a child control given the control's name or path.
     *
     * @param path A dot-delimited string or array of string/number values that define the path to the
     * control.
     *
     * @usageNotes
     * ### Retrieve a nested control
     *
     * For example, to get a `name` control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name']);`
     *
     * ### Retrieve a control in a FormArray
     *
     * When accessing an element inside a FormArray, you can use an element index.
     * For example, to get a `price` control from the first element in an `items` array you can use:
     *
     * * `this.form.get('items.0.price');`
     *
     * -OR-
     *
     * * `this.form.get(['items', 0, 'price']);`
     */
    get(path) {
        return _find(this, path, '.');
    }
    /**
     * @description
     * Reports error data for the control with the given path.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * @returns error data for that particular error. If the control or error is not present,
     * null is returned.
     */
    getError(errorCode, path) {
        const control = path ? this.get(path) : this;
        return control && control.errors ? control.errors[errorCode] : null;
    }
    /**
     * @description
     * Reports whether the control with the given path has the error specified.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * If no path is given, this method checks for the error on the current control.
     *
     * @returns whether the given error is present in the control at the given path.
     *
     * If the control is not present, false is returned.
     */
    hasError(errorCode, path) {
        return !!this.getError(errorCode, path);
    }
    /**
     * Retrieves the top-level ancestor of this control.
     */
    get root() {
        let x = this;
        while (x._parent) {
            x = x._parent;
        }
        return x;
    }
    /** @internal */
    _updateControlsErrors(emitEvent) {
        this.status = this._calculateStatus();
        if (emitEvent) {
            this.statusChanges.emit(this.status);
        }
        if (this._parent) {
            this._parent._updateControlsErrors(emitEvent);
        }
    }
    /** @internal */
    _initObservables() {
        this.valueChanges = new EventEmitter();
        this.statusChanges = new EventEmitter();
    }
    _calculateStatus() {
        if (this._allControlsDisabled())
            return DISABLED;
        if (this.errors)
            return INVALID;
        if (this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(PENDING))
            return PENDING;
        if (this._anyControlsHaveStatus(INVALID))
            return INVALID;
        return VALID;
    }
    /** @internal */
    _anyControlsHaveStatus(status) {
        return this._anyControls((control) => control.status === status);
    }
    /** @internal */
    _anyControlsDirty() {
        return this._anyControls((control) => control.dirty);
    }
    /** @internal */
    _anyControlsTouched() {
        return this._anyControls((control) => control.touched);
    }
    /** @internal */
    _updatePristine(opts = {}) {
        this.pristine = !this._anyControlsDirty();
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    }
    /** @internal */
    _updateTouched(opts = {}) {
        this.touched = this._anyControlsTouched();
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    }
    /** @internal */
    _isBoxedValue(formState) {
        return typeof formState === 'object' && formState !== null &&
            Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
    }
    /** @internal */
    _registerOnCollectionChange(fn) {
        this._onCollectionChange = fn;
    }
    /** @internal */
    _setUpdateStrategy(opts) {
        if (isOptionsObj(opts) && opts.updateOn != null) {
            this._updateOn = opts.updateOn;
        }
    }
    /**
     * Check to see if parent has been marked artificially dirty.
     *
     * @internal
     */
    _parentMarkedDirty(onlySelf) {
        const parentDirty = this._parent && this._parent.dirty;
        return !onlySelf && !!parentDirty && !this._parent._anyControlsDirty();
    }
}
/**
 * Tracks the value and validation status of an individual form control.
 *
 * This is one of the three fundamental building blocks of Angular forms, along with
 * `FormGroup` and `FormArray`. It extends the `AbstractControl` class that
 * implements most of the base functionality for accessing the value, validation status,
 * user interactions and events. See [usage examples below](#usage-notes).
 *
 * @see `AbstractControl`
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see [Usage Notes](#usage-notes)
 *
 * @usageNotes
 *
 * ### Initializing Form Controls
 *
 * Instantiate a `FormControl`, with an initial value.
 *
 * ```ts
 * const control = new FormControl('some value');
 * console.log(control.value);     // 'some value'
 *```
 *
 * The following example initializes the control with a form state object. The `value`
 * and `disabled` keys are required in this case.
 *
 * ```ts
 * const control = new FormControl({ value: 'n/a', disabled: true });
 * console.log(control.value);     // 'n/a'
 * console.log(control.status);    // 'DISABLED'
 * ```
 *
 * The following example initializes the control with a sync validator.
 *
 * ```ts
 * const control = new FormControl('', Validators.required);
 * console.log(control.value);      // ''
 * console.log(control.status);     // 'INVALID'
 * ```
 *
 * The following example initializes the control using an options object.
 *
 * ```ts
 * const control = new FormControl('', {
 *    validators: Validators.required,
 *    asyncValidators: myAsyncValidator
 * });
 * ```
 *
 * ### Configure the control to update on a blur event
 *
 * Set the `updateOn` option to `'blur'` to update on the blur `event`.
 *
 * ```ts
 * const control = new FormControl('', { updateOn: 'blur' });
 * ```
 *
 * ### Configure the control to update on a submit event
 *
 * Set the `updateOn` option to `'submit'` to update on a submit `event`.
 *
 * ```ts
 * const control = new FormControl('', { updateOn: 'submit' });
 * ```
 *
 * ### Reset the control back to an initial value
 *
 * You reset to a specific form state by passing through a standalone
 * value or a form state object that contains both a value and a disabled state
 * (these are the only two properties that cannot be calculated).
 *
 * ```ts
 * const control = new FormControl('Nancy');
 *
 * console.log(control.value); // 'Nancy'
 *
 * control.reset('Drew');
 *
 * console.log(control.value); // 'Drew'
 * ```
 *
 * ### Reset the control back to an initial value and disabled
 *
 * ```
 * const control = new FormControl('Nancy');
 *
 * console.log(control.value); // 'Nancy'
 * console.log(control.status); // 'VALID'
 *
 * control.reset({ value: 'Drew', disabled: true });
 *
 * console.log(control.value); // 'Drew'
 * console.log(control.status); // 'DISABLED'
 * ```
 *
 * @publicApi
 */
export class FormControl extends AbstractControl {
    /**
     * Creates a new `FormControl` instance.
     *
     * @param formState Initializes the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(formState = null, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        /** @internal */
        this._onChange = [];
        this._applyFormState(formState);
        this._setUpdateStrategy(validatorOrOpts);
        this._initObservables();
        this.updateValueAndValidity({
            onlySelf: true,
            // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
            // `VALID` or `INVALID`.
            // The status should be broadcasted via the `statusChanges` observable, so we set `emitEvent`
            // to `true` to allow that during the control creation process.
            emitEvent: !!this.asyncValidator
        });
    }
    /**
     * Sets a new value for the form control.
     *
     * @param value The new value for the control.
     * @param options Configuration options that determine how the control propagates changes
     * and emits events when the value changes.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * * `emitModelToViewChange`: When true or not supplied  (the default), each change triggers an
     * `onChange` event to
     * update the view.
     * * `emitViewToModelChange`: When true or not supplied (the default), each change triggers an
     * `ngModelChange`
     * event to update the model.
     *
     */
    setValue(value, options = {}) {
        this.value = this._pendingValue = value;
        if (this._onChange.length && options.emitModelToViewChange !== false) {
            this._onChange.forEach((changeFn) => changeFn(this.value, options.emitViewToModelChange !== false));
        }
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of a control.
     *
     * This function is functionally the same as {@link FormControl#setValue setValue} at this level.
     * It exists for symmetry with {@link FormGroup#patchValue patchValue} on `FormGroups` and
     * `FormArrays`, where it does behave differently.
     *
     * @see `setValue` for options
     */
    patchValue(value, options = {}) {
        this.setValue(value, options);
    }
    /**
     * Resets the form control, marking it `pristine` and `untouched`, and setting
     * the value to null.
     *
     * @param formState Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     *
     */
    reset(formState = null, options = {}) {
        this._applyFormState(formState);
        this.markAsPristine(options);
        this.markAsUntouched(options);
        this.setValue(this.value, options);
        this._pendingChange = false;
    }
    /**
     * @internal
     */
    _updateValue() { }
    /**
     * @internal
     */
    _anyControls(condition) {
        return false;
    }
    /**
     * @internal
     */
    _allControlsDisabled() {
        return this.disabled;
    }
    /**
     * Register a listener for change events.
     *
     * @param fn The method that is called when the value changes
     */
    registerOnChange(fn) {
        this._onChange.push(fn);
    }
    /**
     * Internal function to unregister a change events listener.
     * @internal
     */
    _unregisterOnChange(fn) {
        removeListItem(this._onChange, fn);
    }
    /**
     * Register a listener for disabled events.
     *
     * @param fn The method that is called when the disabled status changes.
     */
    registerOnDisabledChange(fn) {
        this._onDisabledChange.push(fn);
    }
    /**
     * Internal function to unregister a disabled event listener.
     * @internal
     */
    _unregisterOnDisabledChange(fn) {
        removeListItem(this._onDisabledChange, fn);
    }
    /**
     * @internal
     */
    _forEachChild(cb) { }
    /** @internal */
    _syncPendingControls() {
        if (this.updateOn === 'submit') {
            if (this._pendingDirty)
                this.markAsDirty();
            if (this._pendingTouched)
                this.markAsTouched();
            if (this._pendingChange) {
                this.setValue(this._pendingValue, { onlySelf: true, emitModelToViewChange: false });
                return true;
            }
        }
        return false;
    }
    _applyFormState(formState) {
        if (this._isBoxedValue(formState)) {
            this.value = this._pendingValue = formState.value;
            formState.disabled ? this.disable({ onlySelf: true, emitEvent: false }) :
                this.enable({ onlySelf: true, emitEvent: false });
        }
        else {
            this.value = this._pendingValue = formState;
        }
    }
}
/**
 * Tracks the value and validity state of a group of `FormControl` instances.
 *
 * A `FormGroup` aggregates the values of each child `FormControl` into one object,
 * with each control name as the key.  It calculates its status by reducing the status values
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the three fundamental building blocks used to define forms in Angular,
 * along with `FormControl` and `FormArray`.
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child registers the name for the control.
 *
 * @usageNotes
 *
 * ### Create a form group with 2 controls
 *
 * ```
 * const form = new FormGroup({
 *   first: new FormControl('Nancy', Validators.minLength(2)),
 *   last: new FormControl('Drew'),
 * });
 *
 * console.log(form.value);   // {first: 'Nancy', last; 'Drew'}
 * console.log(form.status);  // 'VALID'
 * ```
 *
 * ### Create a form group with a group-level validator
 *
 * You include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('', Validators.minLength(2)),
 *   passwordConfirm: new FormControl('', Validators.minLength(2)),
 * }, passwordMatchValidator);
 *
 *
 * function passwordMatchValidator(g: FormGroup) {
 *    return g.get('password').value === g.get('passwordConfirm').value
 *       ? null : {'mismatch': true};
 * }
 * ```
 *
 * Like `FormControl` instances, you choose to pass in
 * validators and async validators as part of an options object.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, { validators: passwordMatchValidator, asyncValidators: otherValidator });
 * ```
 *
 * ### Set the updateOn property for all controls in a form group
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormGroup({
 *   one: new FormControl()
 * }, { updateOn: 'blur' });
 * ```
 *
 * @publicApi
 */
export class FormGroup extends AbstractControl {
    /**
     * Creates a new `FormGroup` instance.
     *
     * @param controls A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({
            onlySelf: true,
            // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
            // `VALID` or `INVALID`. The status should be broadcasted via the `statusChanges` observable,
            // so we set `emitEvent` to `true` to allow that during the control creation process.
            emitEvent: !!this.asyncValidator
        });
    }
    /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update the value or validity of the control.
     * Use {@link FormGroup#addControl addControl} instead.
     *
     * @param name The control name to register in the collection
     * @param control Provides the control for the given name
     */
    registerControl(name, control) {
        if (this.controls[name])
            return this.controls[name];
        this.controls[name] = control;
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
        return control;
    }
    /**
     * Add a control to this group.
     *
     * If a control with a given name already exists, it would *not* be replaced with a new one.
     * If you want to replace an existing control, use the {@link FormGroup#setControl setControl}
     * method instead. This method also updates the value and validity of the control.
     *
     * @param name The control name to add to the collection
     * @param control Provides the control for the given name
     * @param options Specifies whether this FormGroup instance should emit events after a new
     *     control is added.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * added. When false, no events are emitted.
     */
    addControl(name, control, options = {}) {
        this.registerControl(name, control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    /**
     * Remove a control from this group.
     *
     * This method also updates the value and validity of the control.
     *
     * @param name The control name to remove from the collection
     * @param options Specifies whether this FormGroup instance should emit events after a
     *     control is removed.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * removed. When false, no events are emitted.
     */
    removeControl(name, options = {}) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
        delete (this.controls[name]);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    /**
     * Replace an existing control.
     *
     * If a control with a given name does not exist in this `FormGroup`, it will be added.
     *
     * @param name The control name to replace in the collection
     * @param control Provides the control for the given name
     * @param options Specifies whether this FormGroup instance should emit events after an
     *     existing control is replaced.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * replaced with a new one. When false, no events are emitted.
     */
    setControl(name, control, options = {}) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
        delete (this.controls[name]);
        if (control)
            this.registerControl(name, control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    /**
     * Check whether there is an enabled control with the given name in the group.
     *
     * Reports false for disabled controls. If you'd like to check for existence in the group
     * only, use {@link AbstractControl#get get} instead.
     *
     * @param controlName The control name to check for existence in the collection
     *
     * @returns false for disabled controls, true otherwise.
     */
    contains(controlName) {
        return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
    }
    /**
     * Sets the value of the `FormGroup`. It accepts an object that matches
     * the structure of the group, with control names as keys.
     *
     * @usageNotes
     * ### Set the complete value for the form group
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl(),
     *   last: new FormControl()
     * });
     *
     * console.log(form.value);   // {first: null, last: null}
     *
     * form.setValue({first: 'Nancy', last: 'Drew'});
     * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
     * ```
     *
     * @throws When strict checks fail, such as setting the value of a control
     * that doesn't exist or if you exclude a value of a control that does exist.
     *
     * @param value The new value for the control that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     */
    setValue(value, options = {}) {
        this._checkAllValuesPresent(value);
        Object.keys(value).forEach(name => {
            this._throwIfControlMissing(name);
            this.controls[name].setValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of the `FormGroup`. It accepts an object with control
     * names as keys, and does its best to match the values to the correct controls
     * in the group.
     *
     * It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     * @usageNotes
     * ### Patch the value for a form group
     *
     * ```
     * const form = new FormGroup({
     *    first: new FormControl(),
     *    last: new FormControl()
     * });
     * console.log(form.value);   // {first: null, last: null}
     *
     * form.patchValue({first: 'Nancy'});
     * console.log(form.value);   // {first: 'Nancy', last: null}
     * ```
     *
     * @param value The object that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes and
     * emits events after the value is patched.
     * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
     * true.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control value
     * is updated. When false, no events are emitted. The configuration options are passed to
     * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
     */
    patchValue(value, options = {}) {
        // Even though the `value` argument type doesn't allow `null` and `undefined` values, the
        // `patchValue` can be called recursively and inner data structures might have these values, so
        // we just ignore such cases when a field containing FormGroup instance receives `null` or
        // `undefined` as a value.
        if (value == null /* both `null` and `undefined` */)
            return;
        Object.keys(value).forEach(name => {
            if (this.controls[name]) {
                this.controls[name].patchValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
     * the value of all descendants to null.
     *
     * You reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * is a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * @param value Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events when the group is reset.
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * @usageNotes
     *
     * ### Reset the form group values
     *
     * ```ts
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * console.log(form.value);  // {first: 'first name', last: 'last name'}
     *
     * form.reset({ first: 'name', last: 'last name' });
     *
     * console.log(form.value);  // {first: 'name', last: 'last name'}
     * ```
     *
     * ### Reset the form group values and disabled status
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * form.reset({
     *   first: {value: 'name', disabled: true},
     *   last: 'last'
     * });
     *
     * console.log(form.value);  // {last: 'last'}
     * console.log(form.get('first').status);  // 'DISABLED'
     * ```
     */
    reset(value = {}, options = {}) {
        this._forEachChild((control, name) => {
            control.reset(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this._updatePristine(options);
        this._updateTouched(options);
        this.updateValueAndValidity(options);
    }
    /**
     * The aggregate value of the `FormGroup`, including any disabled controls.
     *
     * Retrieves all values regardless of disabled status.
     * The `value` property is the best way to get the value of the group, because
     * it excludes disabled controls in the `FormGroup`.
     */
    getRawValue() {
        return this._reduceChildren({}, (acc, control, name) => {
            acc[name] = control instanceof FormControl ? control.value : control.getRawValue();
            return acc;
        });
    }
    /** @internal */
    _syncPendingControls() {
        let subtreeUpdated = this._reduceChildren(false, (updated, child) => {
            return child._syncPendingControls() ? true : updated;
        });
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    }
    /** @internal */
    _throwIfControlMissing(name) {
        if (!Object.keys(this.controls).length) {
            throw new Error(`
        There are no form controls registered with this group yet. If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
        }
        if (!this.controls[name]) {
            throw new Error(`Cannot find form control with name: ${name}.`);
        }
    }
    /** @internal */
    _forEachChild(cb) {
        Object.keys(this.controls).forEach(key => {
            // The list of controls can change (for ex. controls might be removed) while the loop
            // is running (as a result of invoking Forms API in `valueChanges` subscription), so we
            // have to null check before invoking the callback.
            const control = this.controls[key];
            control && cb(control, key);
        });
    }
    /** @internal */
    _setUpControls() {
        this._forEachChild((control) => {
            control.setParent(this);
            control._registerOnCollectionChange(this._onCollectionChange);
        });
    }
    /** @internal */
    _updateValue() {
        this.value = this._reduceValue();
    }
    /** @internal */
    _anyControls(condition) {
        for (const controlName of Object.keys(this.controls)) {
            const control = this.controls[controlName];
            if (this.contains(controlName) && condition(control)) {
                return true;
            }
        }
        return false;
    }
    /** @internal */
    _reduceValue() {
        return this._reduceChildren({}, (acc, control, name) => {
            if (control.enabled || this.disabled) {
                acc[name] = control.value;
            }
            return acc;
        });
    }
    /** @internal */
    _reduceChildren(initValue, fn) {
        let res = initValue;
        this._forEachChild((control, name) => {
            res = fn(res, control, name);
        });
        return res;
    }
    /** @internal */
    _allControlsDisabled() {
        for (const controlName of Object.keys(this.controls)) {
            if (this.controls[controlName].enabled) {
                return false;
            }
        }
        return Object.keys(this.controls).length > 0 || this.disabled;
    }
    /** @internal */
    _checkAllValuesPresent(value) {
        this._forEachChild((control, name) => {
            if (value[name] === undefined) {
                throw new Error(`Must supply a value for form control with name: '${name}'.`);
            }
        });
    }
}
/**
 * Tracks the value and validity state of an array of `FormControl`,
 * `FormGroup` or `FormArray` instances.
 *
 * A `FormArray` aggregates the values of each child `FormControl` into an array.
 * It calculates its status by reducing the status values of its children. For example, if one of
 * the controls in a `FormArray` is invalid, the entire array becomes invalid.
 *
 * `FormArray` is one of the three fundamental building blocks used to define forms in Angular,
 * along with `FormControl` and `FormGroup`.
 *
 * @usageNotes
 *
 * ### Create an array of form controls
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy', Validators.minLength(2)),
 *   new FormControl('Drew'),
 * ]);
 *
 * console.log(arr.value);   // ['Nancy', 'Drew']
 * console.log(arr.status);  // 'VALID'
 * ```
 *
 * ### Create a form array with array-level validators
 *
 * You include array-level validators and async validators. These come in handy
 * when you want to perform validation that considers the value of more than one child
 * control.
 *
 * The two types of validators are passed in separately as the second and third arg
 * respectively, or together as part of an options object.
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy'),
 *   new FormControl('Drew')
 * ], {validators: myValidator, asyncValidators: myAsyncValidator});
 * ```
 *
 * ### Set the updateOn property for all controls in a form array
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * array level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const arr = new FormArray([
 *    new FormControl()
 * ], {updateOn: 'blur'});
 * ```
 *
 * ### Adding or removing controls from a form array
 *
 * To change the controls in the array, use the `push`, `insert`, `removeAt` or `clear` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that result in strange and unexpected behavior such
 * as broken change detection.
 *
 * @publicApi
 */
export class FormArray extends AbstractControl {
    /**
     * Creates a new `FormArray` instance.
     *
     * @param controls An array of child controls. Each child control is given an index
     * where it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({
            onlySelf: true,
            // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
            // `VALID` or `INVALID`.
            // The status should be broadcasted via the `statusChanges` observable, so we set `emitEvent`
            // to `true` to allow that during the control creation process.
            emitEvent: !!this.asyncValidator
        });
    }
    /**
     * Get the `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to retrieve the control
     */
    at(index) {
        return this.controls[index];
    }
    /**
     * Insert a new `AbstractControl` at the end of the array.
     *
     * @param control Form control to be inserted
     * @param options Specifies whether this FormArray instance should emit events after a new
     *     control is added.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * inserted. When false, no events are emitted.
     */
    push(control, options = {}) {
        this.controls.push(control);
        this._registerControl(control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    /**
     * Insert a new `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to insert the control
     * @param control Form control to be inserted
     * @param options Specifies whether this FormArray instance should emit events after a new
     *     control is inserted.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * inserted. When false, no events are emitted.
     */
    insert(index, control, options = {}) {
        this.controls.splice(index, 0, control);
        this._registerControl(control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
    }
    /**
     * Remove the control at the given `index` in the array.
     *
     * @param index Index in the array to remove the control
     * @param options Specifies whether this FormArray instance should emit events after a
     *     control is removed.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * removed. When false, no events are emitted.
     */
    removeAt(index, options = {}) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(() => { });
        this.controls.splice(index, 1);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
    }
    /**
     * Replace an existing control.
     *
     * @param index Index in the array to replace the control
     * @param control The `AbstractControl` control to replace the existing control
     * @param options Specifies whether this FormArray instance should emit events after an
     *     existing control is replaced with a new one.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * replaced with a new one. When false, no events are emitted.
     */
    setControl(index, control, options = {}) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(() => { });
        this.controls.splice(index, 1);
        if (control) {
            this.controls.splice(index, 0, control);
            this._registerControl(control);
        }
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    /**
     * Length of the control array.
     */
    get length() {
        return this.controls.length;
    }
    /**
     * Sets the value of the `FormArray`. It accepts an array that matches
     * the structure of the control.
     *
     * This method performs strict checks, and throws an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
     * @usageNotes
     * ### Set the values for the controls in the form array
     *
     * ```
     * const arr = new FormArray([
     *   new FormControl(),
     *   new FormControl()
     * ]);
     * console.log(arr.value);   // [null, null]
     *
     * arr.setValue(['Nancy', 'Drew']);
     * console.log(arr.value);   // ['Nancy', 'Drew']
     * ```
     *
     * @param value Array of values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    setValue(value, options = {}) {
        this._checkAllValuesPresent(value);
        value.forEach((newValue, index) => {
            this._throwIfControlMissing(index);
            this.at(index).setValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of the `FormArray`. It accepts an array that matches the
     * structure of the control, and does its best to match the values to the correct
     * controls in the group.
     *
     * It accepts both super-sets and sub-sets of the array without throwing an error.
     *
     * @usageNotes
     * ### Patch the values for controls in a form array
     *
     * ```
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * console.log(arr.value);   // [null, null]
     *
     * arr.patchValue(['Nancy']);
     * console.log(arr.value);   // ['Nancy', null]
     * ```
     *
     * @param value Array of latest values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control value
     * is updated. When false, no events are emitted. The configuration options are passed to
     * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
     */
    patchValue(value, options = {}) {
        // Even though the `value` argument type doesn't allow `null` and `undefined` values, the
        // `patchValue` can be called recursively and inner data structures might have these values, so
        // we just ignore such cases when a field containing FormArray instance receives `null` or
        // `undefined` as a value.
        if (value == null /* both `null` and `undefined` */)
            return;
        value.forEach((newValue, index) => {
            if (this.at(index)) {
                this.at(index).patchValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Resets the `FormArray` and all descendants are marked `pristine` and `untouched`, and the
     * value of all descendants to null or null maps.
     *
     * You reset to a specific form state by passing in an array of states
     * that matches the structure of the control. The state is a standalone value
     * or a form state object with both a value and a disabled status.
     *
     * @usageNotes
     * ### Reset the values in a form array
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * arr.reset(['name', 'last name']);
     *
     * console.log(arr.value);  // ['name', 'last name']
     * ```
     *
     * ### Reset the values in a form array and the disabled status for the first control
     *
     * ```
     * arr.reset([
     *   {value: 'name', disabled: true},
     *   'last'
     * ]);
     *
     * console.log(arr.value);  // ['last']
     * console.log(arr.at(0).status);  // 'DISABLED'
     * ```
     *
     * @param value Array of values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    reset(value = [], options = {}) {
        this._forEachChild((control, index) => {
            control.reset(value[index], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this._updatePristine(options);
        this._updateTouched(options);
        this.updateValueAndValidity(options);
    }
    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * Reports all values regardless of disabled status.
     * For enabled controls only, the `value` property is the best way to get the value of the array.
     */
    getRawValue() {
        return this.controls.map((control) => {
            return control instanceof FormControl ? control.value : control.getRawValue();
        });
    }
    /**
     * Remove all controls in the `FormArray`.
     *
     * @param options Specifies whether this FormArray instance should emit events after all
     *     controls are removed.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when all controls
     * in this FormArray instance are removed. When false, no events are emitted.
     *
     * @usageNotes
     * ### Remove all elements from a FormArray
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * console.log(arr.length);  // 2
     *
     * arr.clear();
     * console.log(arr.length);  // 0
     * ```
     *
     * It's a simpler and more efficient alternative to removing all elements one by one:
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     *
     * while (arr.length) {
     *    arr.removeAt(0);
     * }
     * ```
     */
    clear(options = {}) {
        if (this.controls.length < 1)
            return;
        this._forEachChild((control) => control._registerOnCollectionChange(() => { }));
        this.controls.splice(0);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
    }
    /** @internal */
    _syncPendingControls() {
        let subtreeUpdated = this.controls.reduce((updated, child) => {
            return child._syncPendingControls() ? true : updated;
        }, false);
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    }
    /** @internal */
    _throwIfControlMissing(index) {
        if (!this.controls.length) {
            throw new Error(`
        There are no form controls registered with this array yet. If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
        }
        if (!this.at(index)) {
            throw new Error(`Cannot find form control at index ${index}`);
        }
    }
    /** @internal */
    _forEachChild(cb) {
        this.controls.forEach((control, index) => {
            cb(control, index);
        });
    }
    /** @internal */
    _updateValue() {
        this.value =
            this.controls.filter((control) => control.enabled || this.disabled)
                .map((control) => control.value);
    }
    /** @internal */
    _anyControls(condition) {
        return this.controls.some((control) => control.enabled && condition(control));
    }
    /** @internal */
    _setUpControls() {
        this._forEachChild((control) => this._registerControl(control));
    }
    /** @internal */
    _checkAllValuesPresent(value) {
        this._forEachChild((control, i) => {
            if (value[i] === undefined) {
                throw new Error(`Must supply a value for form control at index: ${i}.`);
            }
        });
    }
    /** @internal */
    _allControlsDisabled() {
        for (const control of this.controls) {
            if (control.enabled)
                return false;
        }
        return this.controls.length > 0 || this.disabled;
    }
    _registerControl(control) {
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFbkQsT0FBTyxFQUFDLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUVyRjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUU3Qjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUVqQzs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRWpDOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUM7QUFFbkMsU0FBUyxLQUFLLENBQUMsT0FBd0IsRUFBRSxJQUFpQyxFQUFFLFNBQWlCO0lBQzNGLElBQUksSUFBSSxJQUFJLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQztJQUU5QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN4QixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM5QjtJQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUUxRCxxREFBcUQ7SUFDckQsZ0VBQWdFO0lBQ2hFLElBQUksYUFBYSxHQUF5QixPQUFPLENBQUM7SUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQW1C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LGdCQUFnQixDQUFDLE9BQXdCO1FBQy9DLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge3JlbW92ZUxpc3RJdGVtfSBmcm9tICcuL2RpcmVjdGl2ZXMvc2hhcmVkJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm59IGZyb20gJy4vZGlyZWN0aXZlcy92YWxpZGF0b3JzJztcbmltcG9ydCB7Y29tcG9zZUFzeW5jVmFsaWRhdG9ycywgY29tcG9zZVZhbGlkYXRvcnMsIHRvT2JzZXJ2YWJsZX0gZnJvbSAnLi92YWxpZGF0b3JzJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBGb3JtQ29udHJvbCBpcyB2YWxpZCwgbWVhbmluZyB0aGF0IG5vIGVycm9ycyBleGlzdCBpbiB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgVkFMSUQgPSAnVkFMSUQnO1xuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIGludmFsaWQsIG1lYW5pbmcgdGhhdCBhbiBlcnJvciBleGlzdHMgaW4gdGhlIGlucHV0IHZhbHVlLlxuICpcbiAqIEBzZWUgYHN0YXR1c2BcbiAqL1xuZXhwb3J0IGNvbnN0IElOVkFMSUQgPSAnSU5WQUxJRCc7XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgRm9ybUNvbnRyb2wgaXMgcGVuZGluZywgbWVhbmluZyB0aGF0IHRoYXQgYXN5bmMgdmFsaWRhdGlvbiBpcyBvY2N1cnJpbmcgYW5kXG4gKiBlcnJvcnMgYXJlIG5vdCB5ZXQgYXZhaWxhYmxlIGZvciB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSBgbWFya0FzUGVuZGluZ2BcbiAqIEBzZWUgYHN0YXR1c2BcbiAqL1xuZXhwb3J0IGNvbnN0IFBFTkRJTkcgPSAnUEVORElORyc7XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgRm9ybUNvbnRyb2wgaXMgZGlzYWJsZWQsIG1lYW5pbmcgdGhhdCB0aGUgY29udHJvbCBpcyBleGVtcHQgZnJvbSBhbmNlc3RvclxuICogY2FsY3VsYXRpb25zIG9mIHZhbGlkaXR5IG9yIHZhbHVlLlxuICpcbiAqIEBzZWUgYG1hcmtBc0Rpc2FibGVkYFxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgRElTQUJMRUQgPSAnRElTQUJMRUQnO1xuXG5mdW5jdGlvbiBfZmluZChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIHBhdGg6IEFycmF5PHN0cmluZ3xudW1iZXI+fHN0cmluZywgZGVsaW1pdGVyOiBzdHJpbmcpIHtcbiAgaWYgKHBhdGggPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHBhdGgpKSB7XG4gICAgcGF0aCA9IHBhdGguc3BsaXQoZGVsaW1pdGVyKTtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShwYXRoKSAmJiBwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgLy8gTm90IHVzaW5nIEFycmF5LnJlZHVjZSBoZXJlIGR1ZSB0byBhIENocm9tZSA4MCBidWdcbiAgLy8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MTA0OTk4MlxuICBsZXQgY29udHJvbFRvRmluZDogQWJzdHJhY3RDb250cm9sfG51bGwgPSBjb250cm9sO1xuICBwYXRoLmZvckVhY2goKG5hbWU6IHN0cmluZ3xudW1iZXIpID0+IHtcbiAgICBpZiAoY29udHJvbFRvRmluZCBpbnN0YW5jZW9mIEZvcm1Hcm91cCkge1xuICAgICAgY29udHJvbFRvRmluZCA9IGNvbnRyb2xUb0ZpbmQuY29udHJvbHMuaGFzT3duUHJvcGVydHkobmFtZSBhcyBzdHJpbmcpID9cbiAgICAgICAgICBjb250cm9sVG9GaW5kLmNvbnRyb2xzW25hbWVdIDpcbiAgICAgICAgICBudWxsO1xuICAgIH0gZWxzZSBpZiAoY29udHJvbFRvRmluZCBpbnN0YW5jZW9mIEZvcm1BcnJheSkge1xuICAgICAgY29udHJvbFRvRmluZCA9IGNvbnRyb2xUb0ZpbmQuYXQoPG51bWJlcj5uYW1lKSB8fCBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250cm9sVG9GaW5kID0gbnVsbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gY29udHJvbFRvRmluZDtcbn1cblxuLyoqXG4gKiBHZXRzIHZhbGlkYXRvcnMgZnJvbSBlaXRoZXIgYW4gb3B0aW9ucyBvYmplY3Qgb3IgZ2l2ZW4gdmFsaWRhdG9ycy5cbiAqL1xuZnVuY3Rpb24gcGlja1ZhbGlkYXRvcnModmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCk6IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118bnVsbCB7XG4gIHJldHVybiAoaXNPcHRpb25zT2JqKHZhbGlkYXRvck9yT3B0cykgPyB2YWxpZGF0b3JPck9wdHMudmFsaWRhdG9ycyA6IHZhbGlkYXRvck9yT3B0cykgfHwgbnVsbDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHZhbGlkYXRvciBmdW5jdGlvbiBieSBjb21iaW5pbmcgcHJvdmlkZWQgdmFsaWRhdG9ycy5cbiAqL1xuZnVuY3Rpb24gY29lcmNlVG9WYWxpZGF0b3IodmFsaWRhdG9yOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwpOiBWYWxpZGF0b3JGbnxudWxsIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsaWRhdG9yKSA/IGNvbXBvc2VWYWxpZGF0b3JzKHZhbGlkYXRvcikgOiB2YWxpZGF0b3IgfHwgbnVsbDtcbn1cblxuLyoqXG4gKiBHZXRzIGFzeW5jIHZhbGlkYXRvcnMgZnJvbSBlaXRoZXIgYW4gb3B0aW9ucyBvYmplY3Qgb3IgZ2l2ZW4gdmFsaWRhdG9ycy5cbiAqL1xuZnVuY3Rpb24gcGlja0FzeW5jVmFsaWRhdG9ycyhcbiAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwsXG4gICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwpOiBBc3luY1ZhbGlkYXRvckZufFxuICAgIEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsIHtcbiAgcmV0dXJuIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSA/IHZhbGlkYXRvck9yT3B0cy5hc3luY1ZhbGlkYXRvcnMgOiBhc3luY1ZhbGlkYXRvcikgfHwgbnVsbDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbiBieSBjb21iaW5pbmcgcHJvdmlkZWQgYXN5bmMgdmFsaWRhdG9ycy5cbiAqL1xuZnVuY3Rpb24gY29lcmNlVG9Bc3luY1ZhbGlkYXRvcihhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsKTogQXN5bmNWYWxpZGF0b3JGbnxudWxsIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXN5bmNWYWxpZGF0b3IpID8gY29tcG9zZUFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luY1ZhbGlkYXRvciB8fCBudWxsO1xufVxuXG5leHBvcnQgdHlwZSBGb3JtSG9va3MgPSAnY2hhbmdlJ3wnYmx1cid8J3N1Ym1pdCc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBvcHRpb25zIHByb3ZpZGVkIHRvIGFuIGBBYnN0cmFjdENvbnRyb2xgLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgbGlzdCBvZiB2YWxpZGF0b3JzIGFwcGxpZWQgdG8gYSBjb250cm9sLlxuICAgKi9cbiAgdmFsaWRhdG9ycz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118bnVsbDtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgbGlzdCBvZiBhc3luYyB2YWxpZGF0b3JzIGFwcGxpZWQgdG8gY29udHJvbC5cbiAgICovXG4gIGFzeW5jVmFsaWRhdG9ycz86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGw7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGV2ZW50IG5hbWUgZm9yIGNvbnRyb2wgdG8gdXBkYXRlIHVwb24uXG4gICAqL1xuICB1cGRhdGVPbj86ICdjaGFuZ2UnfCdibHVyJ3wnc3VibWl0Jztcbn1cblxuXG5mdW5jdGlvbiBpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfFxuICAgICAgICAgICAgICAgICAgICAgIG51bGwpOiB2YWxpZGF0b3JPck9wdHMgaXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB7XG4gIHJldHVybiB2YWxpZGF0b3JPck9wdHMgIT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheSh2YWxpZGF0b3JPck9wdHMpICYmXG4gICAgICB0eXBlb2YgdmFsaWRhdG9yT3JPcHRzID09PSAnb2JqZWN0Jztcbn1cblxuXG4vKipcbiAqIFRoaXMgaXMgdGhlIGJhc2UgY2xhc3MgZm9yIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLCBhbmQgYEZvcm1BcnJheWAuXG4gKlxuICogSXQgcHJvdmlkZXMgc29tZSBvZiB0aGUgc2hhcmVkIGJlaGF2aW9yIHRoYXQgYWxsIGNvbnRyb2xzIGFuZCBncm91cHMgb2YgY29udHJvbHMgaGF2ZSwgbGlrZVxuICogcnVubmluZyB2YWxpZGF0b3JzLCBjYWxjdWxhdGluZyBzdGF0dXMsIGFuZCByZXNldHRpbmcgc3RhdGUuIEl0IGFsc28gZGVmaW5lcyB0aGUgcHJvcGVydGllc1xuICogdGhhdCBhcmUgc2hhcmVkIGJldHdlZW4gYWxsIHN1Yi1jbGFzc2VzLCBsaWtlIGB2YWx1ZWAsIGB2YWxpZGAsIGFuZCBgZGlydHlgLiBJdCBzaG91bGRuJ3QgYmVcbiAqIGluc3RhbnRpYXRlZCBkaXJlY3RseS5cbiAqXG4gKiBAc2VlIFtGb3JtcyBHdWlkZV0oL2d1aWRlL2Zvcm1zKVxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKC9ndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUgW0R5bmFtaWMgRm9ybXMgR3VpZGVdKC9ndWlkZS9keW5hbWljLWZvcm0pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RDb250cm9sIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgX3BlbmRpbmdEaXJ0eSE6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB0aGF0IGEgY29udHJvbCBoYXMgaXRzIG93biBwZW5kaW5nIGFzeW5jaHJvbm91cyB2YWxpZGF0aW9uIGluIHByb2dyZXNzLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSBmYWxzZTtcblxuICAvKiogQGludGVybmFsICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBfcGVuZGluZ1RvdWNoZWQhOiBib29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uQ29sbGVjdGlvbkNoYW5nZSA9ICgpID0+IHt9O1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIF91cGRhdGVPbiE6IEZvcm1Ib29rcztcblxuICBwcml2YXRlIF9wYXJlbnQ6IEZvcm1Hcm91cHxGb3JtQXJyYXl8bnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbjogYW55O1xuXG4gIC8qKlxuICAgKiBDb250YWlucyB0aGUgcmVzdWx0IG9mIG1lcmdpbmcgc3luY2hyb25vdXMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvblxuICAgKiAoY29tYmluZWQgdXNpbmcgYFZhbGlkYXRvcnMuY29tcG9zZWApLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByaXZhdGUgX2NvbXBvc2VkVmFsaWRhdG9yRm46IFZhbGlkYXRvckZufG51bGw7XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIHRoZSByZXN1bHQgb2YgbWVyZ2luZyBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvblxuICAgKiAoY29tYmluZWQgdXNpbmcgYFZhbGlkYXRvcnMuY29tcG9zZUFzeW5jYCkuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuOiBBc3luY1ZhbGlkYXRvckZufG51bGw7XG5cbiAgLyoqXG4gICAqIFN5bmNocm9ub3VzIHZhbGlkYXRvcnMgYXMgdGhleSB3ZXJlIHByb3ZpZGVkOlxuICAgKiAgLSBpbiBgQWJzdHJhY3RDb250cm9sYCBjb25zdHJ1Y3RvclxuICAgKiAgLSBhcyBhbiBhcmd1bWVudCB3aGlsZSBjYWxsaW5nIGBzZXRWYWxpZGF0b3JzYCBmdW5jdGlvblxuICAgKiAgLSB3aGlsZSBjYWxsaW5nIHRoZSBzZXR0ZXIgb24gdGhlIGB2YWxpZGF0b3JgIGZpZWxkIChlLmcuIGBjb250cm9sLnZhbGlkYXRvciA9IHZhbGlkYXRvckZuYClcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9yYXdWYWxpZGF0b3JzOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGw7XG5cbiAgLyoqXG4gICAqIEFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGFzIHRoZXkgd2VyZSBwcm92aWRlZDpcbiAgICogIC0gaW4gYEFic3RyYWN0Q29udHJvbGAgY29uc3RydWN0b3JcbiAgICogIC0gYXMgYW4gYXJndW1lbnQgd2hpbGUgY2FsbGluZyBgc2V0QXN5bmNWYWxpZGF0b3JzYCBmdW5jdGlvblxuICAgKiAgLSB3aGlsZSBjYWxsaW5nIHRoZSBzZXR0ZXIgb24gdGhlIGBhc3luY1ZhbGlkYXRvcmAgZmllbGQgKGUuZy4gYGNvbnRyb2wuYXN5bmNWYWxpZGF0b3IgPVxuICAgKiBhc3luY1ZhbGlkYXRvckZuYClcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9yYXdBc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiAqIEZvciBhIGBGb3JtQ29udHJvbGAsIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgKiAqIEZvciBhbiBlbmFibGVkIGBGb3JtR3JvdXBgLCB0aGUgdmFsdWVzIG9mIGVuYWJsZWQgY29udHJvbHMgYXMgYW4gb2JqZWN0XG4gICAqIHdpdGggYSBrZXktdmFsdWUgcGFpciBmb3IgZWFjaCBtZW1iZXIgb2YgdGhlIGdyb3VwLlxuICAgKiAqIEZvciBhIGRpc2FibGVkIGBGb3JtR3JvdXBgLCB0aGUgdmFsdWVzIG9mIGFsbCBjb250cm9scyBhcyBhbiBvYmplY3RcbiAgICogd2l0aCBhIGtleS12YWx1ZSBwYWlyIGZvciBlYWNoIG1lbWJlciBvZiB0aGUgZ3JvdXAuXG4gICAqICogRm9yIGEgYEZvcm1BcnJheWAsIHRoZSB2YWx1ZXMgb2YgZW5hYmxlZCBjb250cm9scyBhcyBhbiBhcnJheS5cbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZTogYW55O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBBYnN0cmFjdENvbnRyb2wgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgdmFsaWRpdHkgb2ZcbiAgICogICAgIHRoaXMgY29udHJvbCBzeW5jaHJvbm91c2x5LlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB2YWxpZGl0eSBvZlxuICAgKiAgICAgdGhpcyBjb250cm9sIGFzeW5jaHJvbm91c2x5LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpIHtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gdmFsaWRhdG9ycztcbiAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSBhc3luY1ZhbGlkYXRvcnM7XG4gICAgdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IGNvZXJjZVRvVmFsaWRhdG9yKHRoaXMuX3Jhd1ZhbGlkYXRvcnMpO1xuICAgIHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiA9IGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IodGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgdmFsaWRpdHkgb2YgdGhpcyBjb250cm9sIHN5bmNocm9ub3VzbHkuXG4gICAqL1xuICBnZXQgdmFsaWRhdG9yKCk6IFZhbGlkYXRvckZufG51bGwge1xuICAgIHJldHVybiB0aGlzLl9jb21wb3NlZFZhbGlkYXRvckZuO1xuICB9XG4gIHNldCB2YWxpZGF0b3IodmFsaWRhdG9yRm46IFZhbGlkYXRvckZufG51bGwpIHtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IHZhbGlkYXRvckZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWxpZGl0eSBvZiB0aGlzIGNvbnRyb2wgYXN5bmNocm9ub3VzbHkuXG4gICAqL1xuICBnZXQgYXN5bmNWYWxpZGF0b3IoKTogQXN5bmNWYWxpZGF0b3JGbnxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuO1xuICB9XG4gIHNldCBhc3luY1ZhbGlkYXRvcihhc3luY1ZhbGlkYXRvckZuOiBBc3luY1ZhbGlkYXRvckZufG51bGwpIHtcbiAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm4gPSBhc3luY1ZhbGlkYXRvckZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJlbnQgY29udHJvbC5cbiAgICovXG4gIGdldCBwYXJlbnQoKTogRm9ybUdyb3VwfEZvcm1BcnJheXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbC4gVGhlcmUgYXJlIGZvdXIgcG9zc2libGVcbiAgICogdmFsaWRhdGlvbiBzdGF0dXMgdmFsdWVzOlxuICAgKlxuICAgKiAqICoqVkFMSUQqKjogVGhpcyBjb250cm9sIGhhcyBwYXNzZWQgYWxsIHZhbGlkYXRpb24gY2hlY2tzLlxuICAgKiAqICoqSU5WQUxJRCoqOiBUaGlzIGNvbnRyb2wgaGFzIGZhaWxlZCBhdCBsZWFzdCBvbmUgdmFsaWRhdGlvbiBjaGVjay5cbiAgICogKiAqKlBFTkRJTkcqKjogVGhpcyBjb250cm9sIGlzIGluIHRoZSBtaWRzdCBvZiBjb25kdWN0aW5nIGEgdmFsaWRhdGlvbiBjaGVjay5cbiAgICogKiAqKkRJU0FCTEVEKio6IFRoaXMgY29udHJvbCBpcyBleGVtcHQgZnJvbSB2YWxpZGF0aW9uIGNoZWNrcy5cbiAgICpcbiAgICogVGhlc2Ugc3RhdHVzIHZhbHVlcyBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlLCBzbyBhIGNvbnRyb2wgY2Fubm90IGJlXG4gICAqIGJvdGggdmFsaWQgQU5EIGludmFsaWQgb3IgaW52YWxpZCBBTkQgZGlzYWJsZWQuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHVibGljIHJlYWRvbmx5IHN0YXR1cyE6IHN0cmluZztcblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGB2YWxpZGAgd2hlbiBpdHMgYHN0YXR1c2AgaXMgYFZBTElEYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgcGFzc2VkIGFsbCBvZiBpdHMgdmFsaWRhdGlvbiB0ZXN0cyxcbiAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IHZhbGlkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gVkFMSUQ7XG4gIH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBpbnZhbGlkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgSU5WQUxJRGAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBjb250cm9sIGhhcyBmYWlsZWQgb25lIG9yIG1vcmUgb2YgaXRzIHZhbGlkYXRpb24gY2hlY2tzLFxuICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgaW52YWxpZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IElOVkFMSUQ7XG4gIH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBwZW5kaW5nYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgUEVORElOR2AuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBjb250cm9sIGlzIGluIHRoZSBwcm9jZXNzIG9mIGNvbmR1Y3RpbmcgYSB2YWxpZGF0aW9uIGNoZWNrLFxuICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgcGVuZGluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT0gUEVORElORztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGRpc2FibGVkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgRElTQUJMRURgLlxuICAgKlxuICAgKiBEaXNhYmxlZCBjb250cm9scyBhcmUgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIGFyZSBub3QgaW5jbHVkZWQgaW4gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGVpciBhbmNlc3RvclxuICAgKiBjb250cm9scy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBpcyBkaXNhYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gRElTQUJMRUQ7XG4gIH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBlbmFibGVkYCBhcyBsb25nIGFzIGl0cyBgc3RhdHVzYCBpcyBub3QgYERJU0FCTEVEYC5cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgYW55IHN0YXR1cyBvdGhlciB0aGFuICdESVNBQkxFRCcsXG4gICAqIGZhbHNlIGlmIHRoZSBzdGF0dXMgaXMgJ0RJU0FCTEVEJy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICovXG4gIGdldCBlbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyAhPT0gRElTQUJMRUQ7XG4gIH1cblxuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgYW55IGVycm9ycyBnZW5lcmF0ZWQgYnkgZmFpbGluZyB2YWxpZGF0aW9uLFxuICAgKiBvciBudWxsIGlmIHRoZXJlIGFyZSBubyBlcnJvcnMuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHVibGljIHJlYWRvbmx5IGVycm9ycyE6IFZhbGlkYXRpb25FcnJvcnN8bnVsbDtcblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBwcmlzdGluZWAgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgY2hhbmdlZFxuICAgKiB0aGUgdmFsdWUgaW4gdGhlIFVJLlxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IGNoYW5nZWQgdGhlIHZhbHVlIGluIHRoZSBVSTsgY29tcGFyZSBgZGlydHlgLlxuICAgKiBQcm9ncmFtbWF0aWMgY2hhbmdlcyB0byBhIGNvbnRyb2wncyB2YWx1ZSBkbyBub3QgbWFyayBpdCBkaXJ0eS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwcmlzdGluZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgZGlydHlgIGlmIHRoZSB1c2VyIGhhcyBjaGFuZ2VkIHRoZSB2YWx1ZVxuICAgKiBpbiB0aGUgVUkuXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIHZhbHVlIG9mIHRoaXMgY29udHJvbCBpbiB0aGUgVUk7IGNvbXBhcmUgYHByaXN0aW5lYC5cbiAgICogUHJvZ3JhbW1hdGljIGNoYW5nZXMgdG8gYSBjb250cm9sJ3MgdmFsdWUgZG8gbm90IG1hcmsgaXQgZGlydHkuXG4gICAqL1xuICBnZXQgZGlydHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnByaXN0aW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIGNvbnRyb2wgaXMgbWFya2VkIGFzIGB0b3VjaGVkYC5cbiAgICpcbiAgICogQSBjb250cm9sIGlzIG1hcmtlZCBgdG91Y2hlZGAgb25jZSB0aGUgdXNlciBoYXMgdHJpZ2dlcmVkXG4gICAqIGEgYGJsdXJgIGV2ZW50IG9uIGl0LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRvdWNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgbm90IGJlZW4gbWFya2VkIGFzIHRvdWNoZWRcbiAgICpcbiAgICogQSBjb250cm9sIGlzIGB1bnRvdWNoZWRgIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IHRyaWdnZXJlZFxuICAgKiBhIGBibHVyYCBldmVudCBvbiBpdC5cbiAgICovXG4gIGdldCB1bnRvdWNoZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnRvdWNoZWQ7XG4gIH1cblxuICAvKipcbiAgICogQSBtdWx0aWNhc3Rpbmcgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGV2ZW50IGV2ZXJ5IHRpbWUgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sIGNoYW5nZXMsIGluXG4gICAqIHRoZSBVSSBvciBwcm9ncmFtbWF0aWNhbGx5LiBJdCBhbHNvIGVtaXRzIGFuIGV2ZW50IGVhY2ggdGltZSB5b3UgY2FsbCBlbmFibGUoKSBvciBkaXNhYmxlKClcbiAgICogd2l0aG91dCBwYXNzaW5nIGFsb25nIHtlbWl0RXZlbnQ6IGZhbHNlfSBhcyBhIGZ1bmN0aW9uIGFyZ3VtZW50LlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZUNoYW5nZXMhOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgLyoqXG4gICAqIEEgbXVsdGljYXN0aW5nIG9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBldmVudCBldmVyeSB0aW1lIHRoZSB2YWxpZGF0aW9uIGBzdGF0dXNgIG9mIHRoZSBjb250cm9sXG4gICAqIHJlY2FsY3VsYXRlcy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwdWJsaWMgcmVhZG9ubHkgc3RhdHVzQ2hhbmdlcyE6IE9ic2VydmFibGU8YW55PjtcblxuICAvKipcbiAgICogUmVwb3J0cyB0aGUgdXBkYXRlIHN0cmF0ZWd5IG9mIHRoZSBgQWJzdHJhY3RDb250cm9sYCAobWVhbmluZ1xuICAgKiB0aGUgZXZlbnQgb24gd2hpY2ggdGhlIGNvbnRyb2wgdXBkYXRlcyBpdHNlbGYpLlxuICAgKiBQb3NzaWJsZSB2YWx1ZXM6IGAnY2hhbmdlJ2AgfCBgJ2JsdXInYCB8IGAnc3VibWl0J2BcbiAgICogRGVmYXVsdCB2YWx1ZTogYCdjaGFuZ2UnYFxuICAgKi9cbiAgZ2V0IHVwZGF0ZU9uKCk6IEZvcm1Ib29rcyB7XG4gICAgcmV0dXJuIHRoaXMuX3VwZGF0ZU9uID8gdGhpcy5fdXBkYXRlT24gOiAodGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC51cGRhdGVPbiA6ICdjaGFuZ2UnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHRoYXQgYXJlIGFjdGl2ZSBvbiB0aGlzIGNvbnRyb2wuICBDYWxsaW5nXG4gICAqIHRoaXMgb3ZlcndyaXRlcyBhbnkgZXhpc3Rpbmcgc3luYyB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqL1xuICBzZXRWYWxpZGF0b3JzKG5ld1ZhbGlkYXRvcjogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsKTogdm9pZCB7XG4gICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IG5ld1ZhbGlkYXRvcjtcbiAgICB0aGlzLl9jb21wb3NlZFZhbGlkYXRvckZuID0gY29lcmNlVG9WYWxpZGF0b3IobmV3VmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBhc3luYyB2YWxpZGF0b3JzIHRoYXQgYXJlIGFjdGl2ZSBvbiB0aGlzIGNvbnRyb2wuIENhbGxpbmcgdGhpc1xuICAgKiBvdmVyd3JpdGVzIGFueSBleGlzdGluZyBhc3luYyB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqL1xuICBzZXRBc3luY1ZhbGlkYXRvcnMobmV3VmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogdm9pZCB7XG4gICAgdGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzID0gbmV3VmFsaWRhdG9yO1xuICAgIHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiA9IGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IobmV3VmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbXB0aWVzIG91dCB0aGUgc3luYyB2YWxpZGF0b3IgbGlzdC5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKi9cbiAgY2xlYXJWYWxpZGF0b3JzKCk6IHZvaWQge1xuICAgIHRoaXMudmFsaWRhdG9yID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbXB0aWVzIG91dCB0aGUgYXN5bmMgdmFsaWRhdG9yIGxpc3QuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICovXG4gIGNsZWFyQXN5bmNWYWxpZGF0b3JzKCk6IHZvaWQge1xuICAgIHRoaXMuYXN5bmNWYWxpZGF0b3IgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGB0b3VjaGVkYC4gQSBjb250cm9sIGlzIHRvdWNoZWQgYnkgZm9jdXMgYW5kXG4gICAqIGJsdXIgZXZlbnRzIHRoYXQgZG8gbm90IGNoYW5nZSB0aGUgdmFsdWUuXG4gICAqXG4gICAqIEBzZWUgYG1hcmtBc1VudG91Y2hlZCgpYFxuICAgKiBAc2VlIGBtYXJrQXNEaXJ0eSgpYFxuICAgKiBAc2VlIGBtYXJrQXNQcmlzdGluZSgpYFxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICovXG4gIG1hcmtBc1RvdWNoZWQob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHt0b3VjaGVkOiBib29sZWFufSkudG91Y2hlZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzVG91Y2hlZChvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYW5kIGFsbCBpdHMgZGVzY2VuZGFudCBjb250cm9scyBhcyBgdG91Y2hlZGAuXG4gICAqIEBzZWUgYG1hcmtBc1RvdWNoZWQoKWBcbiAgICovXG4gIG1hcmtBbGxBc1RvdWNoZWQoKTogdm9pZCB7XG4gICAgdGhpcy5tYXJrQXNUb3VjaGVkKHtvbmx5U2VsZjogdHJ1ZX0pO1xuXG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wubWFya0FsbEFzVG91Y2hlZCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgdW50b3VjaGVkYC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaGFzIGFueSBjaGlsZHJlbiwgYWxzbyBtYXJrcyBhbGwgY2hpbGRyZW4gYXMgYHVudG91Y2hlZGBcbiAgICogYW5kIHJlY2FsY3VsYXRlcyB0aGUgYHRvdWNoZWRgIHN0YXR1cyBvZiBhbGwgcGFyZW50IGNvbnRyb2xzLlxuICAgKlxuICAgKiBAc2VlIGBtYXJrQXNUb3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc0RpcnR5KClgXG4gICAqIEBzZWUgYG1hcmtBc1ByaXN0aW5lKClgXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICovXG4gIG1hcmtBc1VudG91Y2hlZChvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3RvdWNoZWQ6IGJvb2xlYW59KS50b3VjaGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcGVuZGluZ1RvdWNoZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLm1hcmtBc1VudG91Y2hlZCh7b25seVNlbGY6IHRydWV9KTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlVG91Y2hlZChvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYGRpcnR5YC4gQSBjb250cm9sIGJlY29tZXMgZGlydHkgd2hlblxuICAgKiB0aGUgY29udHJvbCdzIHZhbHVlIGlzIGNoYW5nZWQgdGhyb3VnaCB0aGUgVUk7IGNvbXBhcmUgYG1hcmtBc1RvdWNoZWRgLlxuICAgKlxuICAgKiBAc2VlIGBtYXJrQXNUb3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc1VudG91Y2hlZCgpYFxuICAgKiBAc2VlIGBtYXJrQXNQcmlzdGluZSgpYFxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICovXG4gIG1hcmtBc0RpcnR5KG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7cHJpc3RpbmU6IGJvb2xlYW59KS5wcmlzdGluZSA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Lm1hcmtBc0RpcnR5KG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgcHJpc3RpbmVgLlxuICAgKlxuICAgKiBJZiB0aGUgY29udHJvbCBoYXMgYW55IGNoaWxkcmVuLCBtYXJrcyBhbGwgY2hpbGRyZW4gYXMgYHByaXN0aW5lYCxcbiAgICogYW5kIHJlY2FsY3VsYXRlcyB0aGUgYHByaXN0aW5lYCBzdGF0dXMgb2YgYWxsIHBhcmVudFxuICAgKiBjb250cm9scy5cbiAgICpcbiAgICogQHNlZSBgbWFya0FzVG91Y2hlZCgpYFxuICAgKiBAc2VlIGBtYXJrQXNVbnRvdWNoZWQoKWBcbiAgICogQHNlZSBgbWFya0FzRGlydHkoKWBcbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBlbWl0cyBldmVudHMgYWZ0ZXJcbiAgICogbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzUHJpc3RpbmUob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHtwcmlzdGluZTogYm9vbGVhbn0pLnByaXN0aW5lID0gdHJ1ZTtcbiAgICB0aGlzLl9wZW5kaW5nRGlydHkgPSBmYWxzZTtcblxuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLm1hcmtBc1ByaXN0aW5lKHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZShvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHBlbmRpbmdgLlxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgcGVuZGluZyB3aGlsZSB0aGUgY29udHJvbCBwZXJmb3JtcyBhc3luYyB2YWxpZGF0aW9uLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYHN0YXR1c0NoYW5nZXNgXG4gICAqIG9ic2VydmFibGUgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyB0aGUgY29udHJvbCBpcyBtYXJrZWQgcGVuZGluZy5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKlxuICAgKi9cbiAgbWFya0FzUGVuZGluZyhvcHRzOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3N0YXR1czogc3RyaW5nfSkuc3RhdHVzID0gUEVORElORztcblxuICAgIGlmIChvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcbiAgICAgICh0aGlzLnN0YXR1c0NoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPGFueT4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNQZW5kaW5nKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlcyB0aGUgY29udHJvbC4gVGhpcyBtZWFucyB0aGUgY29udHJvbCBpcyBleGVtcHQgZnJvbSB2YWxpZGF0aW9uIGNoZWNrcyBhbmRcbiAgICogZXhjbHVkZWQgZnJvbSB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIGFueSBwYXJlbnQuIEl0cyBzdGF0dXMgaXMgYERJU0FCTEVEYC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaGFzIGNoaWxkcmVuLCBhbGwgY2hpbGRyZW4gYXJlIGFsc28gZGlzYWJsZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlc1xuICAgKiBjaGFuZ2VzIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBkaXNhYmxlKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAvLyBJZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eSB3ZSBkb24ndCB3YW50IHRvIHJlLWNhbGN1bGF0ZSB0aGVcbiAgICAvLyBwYXJlbnQncyBkaXJ0aW5lc3MgYmFzZWQgb24gdGhlIGNoaWxkcmVuLlxuICAgIGNvbnN0IHNraXBQcmlzdGluZUNoZWNrID0gdGhpcy5fcGFyZW50TWFya2VkRGlydHkob3B0cy5vbmx5U2VsZik7XG5cbiAgICAodGhpcyBhcyB7c3RhdHVzOiBzdHJpbmd9KS5zdGF0dXMgPSBESVNBQkxFRDtcbiAgICAodGhpcyBhcyB7ZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbH0pLmVycm9ycyA9IG51bGw7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnRyb2wuZGlzYWJsZSh7Li4ub3B0cywgb25seVNlbGY6IHRydWV9KTtcbiAgICB9KTtcbiAgICB0aGlzLl91cGRhdGVWYWx1ZSgpO1xuXG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgKHRoaXMudmFsdWVDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxhbnk+KS5lbWl0KHRoaXMudmFsdWUpO1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8c3RyaW5nPikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlQW5jZXN0b3JzKHsuLi5vcHRzLCBza2lwUHJpc3RpbmVDaGVja30pO1xuICAgIHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UuZm9yRWFjaCgoY2hhbmdlRm4pID0+IGNoYW5nZUZuKHRydWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmFibGVzIHRoZSBjb250cm9sLiBUaGlzIG1lYW5zIHRoZSBjb250cm9sIGlzIGluY2x1ZGVkIGluIHZhbGlkYXRpb24gY2hlY2tzIGFuZFxuICAgKiB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIGl0cyBwYXJlbnQuIEl0cyBzdGF0dXMgcmVjYWxjdWxhdGVzIGJhc2VkIG9uIGl0cyB2YWx1ZSBhbmRcbiAgICogaXRzIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIGlmIHRoZSBjb250cm9sIGhhcyBjaGlsZHJlbiwgYWxsIGNoaWxkcmVuIGFyZSBlbmFibGVkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmUgb3B0aW9ucyB0aGF0IGNvbnRyb2wgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIHdoZW4gbWFya2VkIGFzIHVudG91Y2hlZFxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyBlbmFibGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBlbmFibGUob3B0czoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIC8vIElmIHBhcmVudCBoYXMgYmVlbiBtYXJrZWQgYXJ0aWZpY2lhbGx5IGRpcnR5IHdlIGRvbid0IHdhbnQgdG8gcmUtY2FsY3VsYXRlIHRoZVxuICAgIC8vIHBhcmVudCdzIGRpcnRpbmVzcyBiYXNlZCBvbiB0aGUgY2hpbGRyZW4uXG4gICAgY29uc3Qgc2tpcFByaXN0aW5lQ2hlY2sgPSB0aGlzLl9wYXJlbnRNYXJrZWREaXJ0eShvcHRzLm9ubHlTZWxmKTtcblxuICAgICh0aGlzIGFzIHtzdGF0dXM6IHN0cmluZ30pLnN0YXR1cyA9IFZBTElEO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLmVuYWJsZSh7Li4ub3B0cywgb25seVNlbGY6IHRydWV9KTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50fSk7XG5cbiAgICB0aGlzLl91cGRhdGVBbmNlc3RvcnMoey4uLm9wdHMsIHNraXBQcmlzdGluZUNoZWNrfSk7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5mb3JFYWNoKChjaGFuZ2VGbikgPT4gY2hhbmdlRm4oZmFsc2UpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZUFuY2VzdG9ycyhcbiAgICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW4sIHNraXBQcmlzdGluZUNoZWNrPzogYm9vbGVhbn0pIHtcbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzKTtcbiAgICAgIGlmICghb3B0cy5za2lwUHJpc3RpbmVDaGVjaykge1xuICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHBhcmVudCBTZXRzIHRoZSBwYXJlbnQgb2YgdGhlIGNvbnRyb2xcbiAgICovXG4gIHNldFBhcmVudChwYXJlbnQ6IEZvcm1Hcm91cHxGb3JtQXJyYXkpOiB2b2lkIHtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wuIEFic3RyYWN0IG1ldGhvZCAoaW1wbGVtZW50ZWQgaW4gc3ViLWNsYXNzZXMpLlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0VmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBBYnN0cmFjdCBtZXRob2QgKGltcGxlbWVudGVkIGluIHN1Yi1jbGFzc2VzKS5cbiAgICovXG4gIGFic3RyYWN0IHBhdGNoVmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgY29udHJvbC4gQWJzdHJhY3QgbWV0aG9kIChpbXBsZW1lbnRlZCBpbiBzdWItY2xhc3NlcykuXG4gICAqL1xuICBhYnN0cmFjdCByZXNldCh2YWx1ZT86IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlY2FsY3VsYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkYXRpb24gc3RhdHVzIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBpdCBhbHNvIHVwZGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBvZiBpdHMgYW5jZXN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kIGVtaXRzIGV2ZW50c1xuICAgKiBhZnRlciB1cGRhdGVzIGFuZCB2YWxpZGl0eSBjaGVja3MgYXJlIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBvbmx5IHVwZGF0ZSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiB1cGRhdGUgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0czoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuX3NldEluaXRpYWxTdGF0dXMoKTtcbiAgICB0aGlzLl91cGRhdGVWYWx1ZSgpO1xuXG4gICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5fY2FuY2VsRXhpc3RpbmdTdWJzY3JpcHRpb24oKTtcbiAgICAgICh0aGlzIGFzIHtlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsfSkuZXJyb3JzID0gdGhpcy5fcnVuVmFsaWRhdG9yKCk7XG4gICAgICAodGhpcyBhcyB7c3RhdHVzOiBzdHJpbmd9KS5zdGF0dXMgPSB0aGlzLl9jYWxjdWxhdGVTdGF0dXMoKTtcblxuICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBWQUxJRCB8fCB0aGlzLnN0YXR1cyA9PT0gUEVORElORykge1xuICAgICAgICB0aGlzLl9ydW5Bc3luY1ZhbGlkYXRvcihvcHRzLmVtaXRFdmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgKHRoaXMudmFsdWVDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxhbnk+KS5lbWl0KHRoaXMudmFsdWUpO1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8c3RyaW5nPikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlVHJlZVZhbGlkaXR5KG9wdHM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHtlbWl0RXZlbnQ6IHRydWV9KSB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjdHJsOiBBYnN0cmFjdENvbnRyb2wpID0+IGN0cmwuX3VwZGF0ZVRyZWVWYWxpZGl0eShvcHRzKSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRzLmVtaXRFdmVudH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0SW5pdGlhbFN0YXR1cygpIHtcbiAgICAodGhpcyBhcyB7c3RhdHVzOiBzdHJpbmd9KS5zdGF0dXMgPSB0aGlzLl9hbGxDb250cm9sc0Rpc2FibGVkKCkgPyBESVNBQkxFRCA6IFZBTElEO1xuICB9XG5cbiAgcHJpdmF0ZSBfcnVuVmFsaWRhdG9yKCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdG9yID8gdGhpcy52YWxpZGF0b3IodGhpcykgOiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfcnVuQXN5bmNWYWxpZGF0b3IoZW1pdEV2ZW50PzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLmFzeW5jVmFsaWRhdG9yKSB7XG4gICAgICAodGhpcyBhcyB7c3RhdHVzOiBzdHJpbmd9KS5zdGF0dXMgPSBQRU5ESU5HO1xuICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG9icyA9IHRvT2JzZXJ2YWJsZSh0aGlzLmFzeW5jVmFsaWRhdG9yKHRoaXMpKTtcbiAgICAgIHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbiA9IG9icy5zdWJzY3JpYmUoKGVycm9yczogVmFsaWRhdGlvbkVycm9yc3xudWxsKSA9PiB7XG4gICAgICAgIHRoaXMuX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvciA9IGZhbHNlO1xuICAgICAgICAvLyBUaGlzIHdpbGwgdHJpZ2dlciB0aGUgcmVjYWxjdWxhdGlvbiBvZiB0aGUgdmFsaWRhdGlvbiBzdGF0dXMsIHdoaWNoIGRlcGVuZHMgb25cbiAgICAgICAgLy8gdGhlIHN0YXRlIG9mIHRoZSBhc3luY2hyb25vdXMgdmFsaWRhdGlvbiAod2hldGhlciBpdCBpcyBpbiBwcm9ncmVzcyBvciBub3QpLiBTbywgaXQgaXNcbiAgICAgICAgLy8gbmVjZXNzYXJ5IHRoYXQgd2UgaGF2ZSB1cGRhdGVkIHRoZSBgX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvcmAgYm9vbGVhbiBmbGFnIGZpcnN0LlxuICAgICAgICB0aGlzLnNldEVycm9ycyhlcnJvcnMsIHtlbWl0RXZlbnR9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NhbmNlbEV4aXN0aW5nU3Vic2NyaXB0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9hc3luY1ZhbGlkYXRpb25TdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZXJyb3JzIG9uIGEgZm9ybSBjb250cm9sIHdoZW4gcnVubmluZyB2YWxpZGF0aW9ucyBtYW51YWxseSwgcmF0aGVyIHRoYW4gYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogQ2FsbGluZyBgc2V0RXJyb3JzYCBhbHNvIHVwZGF0ZXMgdGhlIHZhbGlkaXR5IG9mIHRoZSBwYXJlbnQgY29udHJvbC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIE1hbnVhbGx5IHNldCB0aGUgZXJyb3JzIGZvciBhIGNvbnRyb2xcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGxvZ2luID0gbmV3IEZvcm1Db250cm9sKCdzb21lTG9naW4nKTtcbiAgICogbG9naW4uc2V0RXJyb3JzKHtcbiAgICogICBub3RVbmlxdWU6IHRydWVcbiAgICogfSk7XG4gICAqXG4gICAqIGV4cGVjdChsb2dpbi52YWxpZCkudG9FcXVhbChmYWxzZSk7XG4gICAqIGV4cGVjdChsb2dpbi5lcnJvcnMpLnRvRXF1YWwoeyBub3RVbmlxdWU6IHRydWUgfSk7XG4gICAqXG4gICAqIGxvZ2luLnNldFZhbHVlKCdzb21lT3RoZXJMb2dpbicpO1xuICAgKlxuICAgKiBleHBlY3QobG9naW4udmFsaWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAqIGBgYFxuICAgKi9cbiAgc2V0RXJyb3JzKGVycm9yczogVmFsaWRhdGlvbkVycm9yc3xudWxsLCBvcHRzOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHtlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsfSkuZXJyb3JzID0gZXJyb3JzO1xuICAgIHRoaXMuX3VwZGF0ZUNvbnRyb2xzRXJyb3JzKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGEgY2hpbGQgY29udHJvbCBnaXZlbiB0aGUgY29udHJvbCdzIG5hbWUgb3IgcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIHBhdGggQSBkb3QtZGVsaW1pdGVkIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmcvbnVtYmVyIHZhbHVlcyB0aGF0IGRlZmluZSB0aGUgcGF0aCB0byB0aGVcbiAgICogY29udHJvbC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFJldHJpZXZlIGEgbmVzdGVkIGNvbnRyb2xcbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRvIGdldCBhIGBuYW1lYCBjb250cm9sIG5lc3RlZCB3aXRoaW4gYSBgcGVyc29uYCBzdWItZ3JvdXA6XG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoJ3BlcnNvbi5uYW1lJyk7YFxuICAgKlxuICAgKiAtT1ItXG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoWydwZXJzb24nLCAnbmFtZSddKTtgXG4gICAqXG4gICAqICMjIyBSZXRyaWV2ZSBhIGNvbnRyb2wgaW4gYSBGb3JtQXJyYXlcbiAgICpcbiAgICogV2hlbiBhY2Nlc3NpbmcgYW4gZWxlbWVudCBpbnNpZGUgYSBGb3JtQXJyYXksIHlvdSBjYW4gdXNlIGFuIGVsZW1lbnQgaW5kZXguXG4gICAqIEZvciBleGFtcGxlLCB0byBnZXQgYSBgcHJpY2VgIGNvbnRyb2wgZnJvbSB0aGUgZmlyc3QgZWxlbWVudCBpbiBhbiBgaXRlbXNgIGFycmF5IHlvdSBjYW4gdXNlOlxuICAgKlxuICAgKiAqIGB0aGlzLmZvcm0uZ2V0KCdpdGVtcy4wLnByaWNlJyk7YFxuICAgKlxuICAgKiAtT1ItXG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoWydpdGVtcycsIDAsICdwcmljZSddKTtgXG4gICAqL1xuICBnZXQocGF0aDogQXJyYXk8c3RyaW5nfG51bWJlcj58c3RyaW5nKTogQWJzdHJhY3RDb250cm9sfG51bGwge1xuICAgIHJldHVybiBfZmluZCh0aGlzLCBwYXRoLCAnLicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIGVycm9yIGRhdGEgZm9yIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGguXG4gICAqXG4gICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGNvZGUgb2YgdGhlIGVycm9yIHRvIGNoZWNrXG4gICAqIEBwYXJhbSBwYXRoIEEgbGlzdCBvZiBjb250cm9sIG5hbWVzIHRoYXQgZGVzaWduYXRlcyBob3cgdG8gbW92ZSBmcm9tIHRoZSBjdXJyZW50IGNvbnRyb2xcbiAgICogdG8gdGhlIGNvbnRyb2wgdGhhdCBzaG91bGQgYmUgcXVlcmllZCBmb3IgZXJyb3JzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiBGb3IgZXhhbXBsZSwgZm9yIHRoZSBmb2xsb3dpbmcgYEZvcm1Hcm91cGA6XG4gICAqXG4gICAqIGBgYFxuICAgKiBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgYWRkcmVzczogbmV3IEZvcm1Hcm91cCh7IHN0cmVldDogbmV3IEZvcm1Db250cm9sKCkgfSlcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgJ3N0cmVldCcgY29udHJvbCBmcm9tIHRoZSByb290IGZvcm0gd291bGQgYmUgJ2FkZHJlc3MnIC0+ICdzdHJlZXQnLlxuICAgKlxuICAgKiBJdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhpcyBtZXRob2QgaW4gb25lIG9mIHR3byBmb3JtYXRzOlxuICAgKlxuICAgKiAxLiBBbiBhcnJheSBvZiBzdHJpbmcgY29udHJvbCBuYW1lcywgZS5nLiBgWydhZGRyZXNzJywgJ3N0cmVldCddYFxuICAgKiAxLiBBIHBlcmlvZC1kZWxpbWl0ZWQgbGlzdCBvZiBjb250cm9sIG5hbWVzIGluIG9uZSBzdHJpbmcsIGUuZy4gYCdhZGRyZXNzLnN0cmVldCdgXG4gICAqXG4gICAqIEByZXR1cm5zIGVycm9yIGRhdGEgZm9yIHRoYXQgcGFydGljdWxhciBlcnJvci4gSWYgdGhlIGNvbnRyb2wgb3IgZXJyb3IgaXMgbm90IHByZXNlbnQsXG4gICAqIG51bGwgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBnZXRFcnJvcihlcnJvckNvZGU6IHN0cmluZywgcGF0aD86IEFycmF5PHN0cmluZ3xudW1iZXI+fHN0cmluZyk6IGFueSB7XG4gICAgY29uc3QgY29udHJvbCA9IHBhdGggPyB0aGlzLmdldChwYXRoKSA6IHRoaXM7XG4gICAgcmV0dXJuIGNvbnRyb2wgJiYgY29udHJvbC5lcnJvcnMgPyBjb250cm9sLmVycm9yc1tlcnJvckNvZGVdIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGggaGFzIHRoZSBlcnJvciBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGNvZGUgb2YgdGhlIGVycm9yIHRvIGNoZWNrXG4gICAqIEBwYXJhbSBwYXRoIEEgbGlzdCBvZiBjb250cm9sIG5hbWVzIHRoYXQgZGVzaWduYXRlcyBob3cgdG8gbW92ZSBmcm9tIHRoZSBjdXJyZW50IGNvbnRyb2xcbiAgICogdG8gdGhlIGNvbnRyb2wgdGhhdCBzaG91bGQgYmUgcXVlcmllZCBmb3IgZXJyb3JzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiBGb3IgZXhhbXBsZSwgZm9yIHRoZSBmb2xsb3dpbmcgYEZvcm1Hcm91cGA6XG4gICAqXG4gICAqIGBgYFxuICAgKiBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgYWRkcmVzczogbmV3IEZvcm1Hcm91cCh7IHN0cmVldDogbmV3IEZvcm1Db250cm9sKCkgfSlcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgJ3N0cmVldCcgY29udHJvbCBmcm9tIHRoZSByb290IGZvcm0gd291bGQgYmUgJ2FkZHJlc3MnIC0+ICdzdHJlZXQnLlxuICAgKlxuICAgKiBJdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhpcyBtZXRob2QgaW4gb25lIG9mIHR3byBmb3JtYXRzOlxuICAgKlxuICAgKiAxLiBBbiBhcnJheSBvZiBzdHJpbmcgY29udHJvbCBuYW1lcywgZS5nLiBgWydhZGRyZXNzJywgJ3N0cmVldCddYFxuICAgKiAxLiBBIHBlcmlvZC1kZWxpbWl0ZWQgbGlzdCBvZiBjb250cm9sIG5hbWVzIGluIG9uZSBzdHJpbmcsIGUuZy4gYCdhZGRyZXNzLnN0cmVldCdgXG4gICAqXG4gICAqIElmIG5vIHBhdGggaXMgZ2l2ZW4sIHRoaXMgbWV0aG9kIGNoZWNrcyBmb3IgdGhlIGVycm9yIG9uIHRoZSBjdXJyZW50IGNvbnRyb2wuXG4gICAqXG4gICAqIEByZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVycm9yIGlzIHByZXNlbnQgaW4gdGhlIGNvbnRyb2wgYXQgdGhlIGdpdmVuIHBhdGguXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBmYWxzZSBpcyByZXR1cm5lZC5cbiAgICovXG4gIGhhc0Vycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogQXJyYXk8c3RyaW5nfG51bWJlcj58c3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5nZXRFcnJvcihlcnJvckNvZGUsIHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgdG9wLWxldmVsIGFuY2VzdG9yIG9mIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGdldCByb290KCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgbGV0IHg6IEFic3RyYWN0Q29udHJvbCA9IHRoaXM7XG5cbiAgICB3aGlsZSAoeC5fcGFyZW50KSB7XG4gICAgICB4ID0geC5fcGFyZW50O1xuICAgIH1cblxuICAgIHJldHVybiB4O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlQ29udHJvbHNFcnJvcnMoZW1pdEV2ZW50OiBib29sZWFuKTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3N0YXR1czogc3RyaW5nfSkuc3RhdHVzID0gdGhpcy5fY2FsY3VsYXRlU3RhdHVzKCk7XG5cbiAgICBpZiAoZW1pdEV2ZW50KSB7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxzdHJpbmc+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZUNvbnRyb2xzRXJyb3JzKGVtaXRFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5pdE9ic2VydmFibGVzKCkge1xuICAgICh0aGlzIGFzIHt2YWx1ZUNoYW5nZXM6IE9ic2VydmFibGU8YW55Pn0pLnZhbHVlQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAodGhpcyBhcyB7c3RhdHVzQ2hhbmdlczogT2JzZXJ2YWJsZTxhbnk+fSkuc3RhdHVzQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlU3RhdHVzKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuX2FsbENvbnRyb2xzRGlzYWJsZWQoKSkgcmV0dXJuIERJU0FCTEVEO1xuICAgIGlmICh0aGlzLmVycm9ycykgcmV0dXJuIElOVkFMSUQ7XG4gICAgaWYgKHRoaXMuX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvciB8fCB0aGlzLl9hbnlDb250cm9sc0hhdmVTdGF0dXMoUEVORElORykpIHJldHVybiBQRU5ESU5HO1xuICAgIGlmICh0aGlzLl9hbnlDb250cm9sc0hhdmVTdGF0dXMoSU5WQUxJRCkpIHJldHVybiBJTlZBTElEO1xuICAgIHJldHVybiBWQUxJRDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX3VwZGF0ZVZhbHVlKCk6IHZvaWQ7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfZm9yRWFjaENoaWxkKGNiOiBGdW5jdGlvbik6IHZvaWQ7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfYW55Q29udHJvbHMoY29uZGl0aW9uOiBGdW5jdGlvbik6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfYWxsQ29udHJvbHNEaXNhYmxlZCgpOiBib29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX3N5bmNQZW5kaW5nQ29udHJvbHMoKTogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9sc0hhdmVTdGF0dXMoc3RhdHVzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5zdGF0dXMgPT09IHN0YXR1cyk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9sc0RpcnR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hbnlDb250cm9scygoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBjb250cm9sLmRpcnR5KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzVG91Y2hlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC50b3VjaGVkKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZVByaXN0aW5lKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7cHJpc3RpbmU6IGJvb2xlYW59KS5wcmlzdGluZSA9ICF0aGlzLl9hbnlDb250cm9sc0RpcnR5KCk7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZVRvdWNoZWQob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHt0b3VjaGVkOiBib29sZWFufSkudG91Y2hlZCA9IHRoaXMuX2FueUNvbnRyb2xzVG91Y2hlZCgpO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uRGlzYWJsZWRDaGFuZ2U6IEZ1bmN0aW9uW10gPSBbXTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9pc0JveGVkVmFsdWUoZm9ybVN0YXRlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHlwZW9mIGZvcm1TdGF0ZSA9PT0gJ29iamVjdCcgJiYgZm9ybVN0YXRlICE9PSBudWxsICYmXG4gICAgICAgIE9iamVjdC5rZXlzKGZvcm1TdGF0ZSkubGVuZ3RoID09PSAyICYmICd2YWx1ZScgaW4gZm9ybVN0YXRlICYmICdkaXNhYmxlZCcgaW4gZm9ybVN0YXRlO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldFVwZGF0ZVN0cmF0ZWd5KG9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCk6IHZvaWQge1xuICAgIGlmIChpc09wdGlvbnNPYmoob3B0cykgJiYgb3B0cy51cGRhdGVPbiAhPSBudWxsKSB7XG4gICAgICB0aGlzLl91cGRhdGVPbiA9IG9wdHMudXBkYXRlT24hO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgcGFyZW50IGhhcyBiZWVuIG1hcmtlZCBhcnRpZmljaWFsbHkgZGlydHkuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfcGFyZW50TWFya2VkRGlydHkob25seVNlbGY/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGFyZW50RGlydHkgPSB0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50LmRpcnR5O1xuICAgIHJldHVybiAhb25seVNlbGYgJiYgISFwYXJlbnREaXJ0eSAmJiAhdGhpcy5fcGFyZW50IS5fYW55Q29udHJvbHNEaXJ0eSgpO1xuICB9XG59XG5cbi8qKlxuICogVHJhY2tzIHRoZSB2YWx1ZSBhbmQgdmFsaWRhdGlvbiBzdGF0dXMgb2YgYW4gaW5kaXZpZHVhbCBmb3JtIGNvbnRyb2wuXG4gKlxuICogVGhpcyBpcyBvbmUgb2YgdGhlIHRocmVlIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrcyBvZiBBbmd1bGFyIGZvcm1zLCBhbG9uZyB3aXRoXG4gKiBgRm9ybUdyb3VwYCBhbmQgYEZvcm1BcnJheWAuIEl0IGV4dGVuZHMgdGhlIGBBYnN0cmFjdENvbnRyb2xgIGNsYXNzIHRoYXRcbiAqIGltcGxlbWVudHMgbW9zdCBvZiB0aGUgYmFzZSBmdW5jdGlvbmFsaXR5IGZvciBhY2Nlc3NpbmcgdGhlIHZhbHVlLCB2YWxpZGF0aW9uIHN0YXR1cyxcbiAqIHVzZXIgaW50ZXJhY3Rpb25zIGFuZCBldmVudHMuIFNlZSBbdXNhZ2UgZXhhbXBsZXMgYmVsb3ddKCN1c2FnZS1ub3RlcykuXG4gKlxuICogQHNlZSBgQWJzdHJhY3RDb250cm9sYFxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBbVXNhZ2UgTm90ZXNdKCN1c2FnZS1ub3RlcylcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBJbml0aWFsaXppbmcgRm9ybSBDb250cm9sc1xuICpcbiAqIEluc3RhbnRpYXRlIGEgYEZvcm1Db250cm9sYCwgd2l0aCBhbiBpbml0aWFsIHZhbHVlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCdzb21lIHZhbHVlJyk7XG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgICAgIC8vICdzb21lIHZhbHVlJ1xuICpgYGBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW5pdGlhbGl6ZXMgdGhlIGNvbnRyb2wgd2l0aCBhIGZvcm0gc3RhdGUgb2JqZWN0LiBUaGUgYHZhbHVlYFxuICogYW5kIGBkaXNhYmxlZGAga2V5cyBhcmUgcmVxdWlyZWQgaW4gdGhpcyBjYXNlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKHsgdmFsdWU6ICduL2EnLCBkaXNhYmxlZDogdHJ1ZSB9KTtcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAgICAgLy8gJ24vYSdcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wuc3RhdHVzKTsgICAgLy8gJ0RJU0FCTEVEJ1xuICogYGBgXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYSBzeW5jIHZhbGlkYXRvci5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5yZXF1aXJlZCk7XG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgICAgICAvLyAnJ1xuICogY29uc29sZS5sb2coY29udHJvbC5zdGF0dXMpOyAgICAgLy8gJ0lOVkFMSUQnXG4gKiBgYGBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW5pdGlhbGl6ZXMgdGhlIGNvbnRyb2wgdXNpbmcgYW4gb3B0aW9ucyBvYmplY3QuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIHtcbiAqICAgIHZhbGlkYXRvcnM6IFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gKiAgICBhc3luY1ZhbGlkYXRvcnM6IG15QXN5bmNWYWxpZGF0b3JcbiAqIH0pO1xuICogYGBgXG4gKlxuICogIyMjIENvbmZpZ3VyZSB0aGUgY29udHJvbCB0byB1cGRhdGUgb24gYSBibHVyIGV2ZW50XG4gKlxuICogU2V0IHRoZSBgdXBkYXRlT25gIG9wdGlvbiB0byBgJ2JsdXInYCB0byB1cGRhdGUgb24gdGhlIGJsdXIgYGV2ZW50YC5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywgeyB1cGRhdGVPbjogJ2JsdXInIH0pO1xuICogYGBgXG4gKlxuICogIyMjIENvbmZpZ3VyZSB0aGUgY29udHJvbCB0byB1cGRhdGUgb24gYSBzdWJtaXQgZXZlbnRcbiAqXG4gKiBTZXQgdGhlIGB1cGRhdGVPbmAgb3B0aW9uIHRvIGAnc3VibWl0J2AgdG8gdXBkYXRlIG9uIGEgc3VibWl0IGBldmVudGAuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIHsgdXBkYXRlT246ICdzdWJtaXQnIH0pO1xuICogYGBgXG4gKlxuICogIyMjIFJlc2V0IHRoZSBjb250cm9sIGJhY2sgdG8gYW4gaW5pdGlhbCB2YWx1ZVxuICpcbiAqIFlvdSByZXNldCB0byBhIHNwZWNpZmljIGZvcm0gc3RhdGUgYnkgcGFzc2luZyB0aHJvdWdoIGEgc3RhbmRhbG9uZVxuICogdmFsdWUgb3IgYSBmb3JtIHN0YXRlIG9iamVjdCB0aGF0IGNvbnRhaW5zIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZCBzdGF0ZVxuICogKHRoZXNlIGFyZSB0aGUgb25seSB0d28gcHJvcGVydGllcyB0aGF0IGNhbm5vdCBiZSBjYWxjdWxhdGVkKS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnTmFuY3knKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgLy8gJ05hbmN5J1xuICpcbiAqIGNvbnRyb2wucmVzZXQoJ0RyZXcnKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgLy8gJ0RyZXcnXG4gKiBgYGBcbiAqXG4gKiAjIyMgUmVzZXQgdGhlIGNvbnRyb2wgYmFjayB0byBhbiBpbml0aWFsIHZhbHVlIGFuZCBkaXNhYmxlZFxuICpcbiAqIGBgYFxuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnTmFuY3knKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgLy8gJ05hbmN5J1xuICogY29uc29sZS5sb2coY29udHJvbC5zdGF0dXMpOyAvLyAnVkFMSUQnXG4gKlxuICogY29udHJvbC5yZXNldCh7IHZhbHVlOiAnRHJldycsIGRpc2FibGVkOiB0cnVlIH0pO1xuICpcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAvLyAnRHJldydcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wuc3RhdHVzKTsgLy8gJ0RJU0FCTEVEJ1xuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgRm9ybUNvbnRyb2wgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2wge1xuICAvKiogQGludGVybmFsICovXG4gIF9vbkNoYW5nZTogRnVuY3Rpb25bXSA9IFtdO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdWYWx1ZTogYW55O1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdDaGFuZ2U6IGFueTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgRm9ybUNvbnRyb2xgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gZm9ybVN0YXRlIEluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSxcbiAgICogb3IgYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdmFsaWRhdGlvbiBmdW5jdGlvbnNcbiAgICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZm9ybVN0YXRlOiBhbnkgPSBudWxsLFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpIHtcbiAgICBzdXBlcihwaWNrVmFsaWRhdG9ycyh2YWxpZGF0b3JPck9wdHMpLCBwaWNrQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpKTtcbiAgICB0aGlzLl9hcHBseUZvcm1TdGF0ZShmb3JtU3RhdGUpO1xuICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KHZhbGlkYXRvck9yT3B0cyk7XG4gICAgdGhpcy5faW5pdE9ic2VydmFibGVzKCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtcbiAgICAgIG9ubHlTZWxmOiB0cnVlLFxuICAgICAgLy8gSWYgYGFzeW5jVmFsaWRhdG9yYCBpcyBwcmVzZW50LCBpdCB3aWxsIHRyaWdnZXIgY29udHJvbCBzdGF0dXMgY2hhbmdlIGZyb20gYFBFTkRJTkdgIHRvXG4gICAgICAvLyBgVkFMSURgIG9yIGBJTlZBTElEYC5cbiAgICAgIC8vIFRoZSBzdGF0dXMgc2hvdWxkIGJlIGJyb2FkY2FzdGVkIHZpYSB0aGUgYHN0YXR1c0NoYW5nZXNgIG9ic2VydmFibGUsIHNvIHdlIHNldCBgZW1pdEV2ZW50YFxuICAgICAgLy8gdG8gYHRydWVgIHRvIGFsbG93IHRoYXQgZHVyaW5nIHRoZSBjb250cm9sIGNyZWF0aW9uIHByb2Nlc3MuXG4gICAgICBlbWl0RXZlbnQ6ICEhdGhpcy5hc3luY1ZhbGlkYXRvclxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBuZXcgdmFsdWUgZm9yIHRoZSBmb3JtIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgY29udHJvbC5cbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogKiBgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlYDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAgKHRoZSBkZWZhdWx0KSwgZWFjaCBjaGFuZ2UgdHJpZ2dlcnMgYW5cbiAgICogYG9uQ2hhbmdlYCBldmVudCB0b1xuICAgKiB1cGRhdGUgdGhlIHZpZXcuXG4gICAqICogYGVtaXRWaWV3VG9Nb2RlbENoYW5nZWA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgZWFjaCBjaGFuZ2UgdHJpZ2dlcnMgYW5cbiAgICogYG5nTW9kZWxDaGFuZ2VgXG4gICAqIGV2ZW50IHRvIHVwZGF0ZSB0aGUgbW9kZWwuXG4gICAqXG4gICAqL1xuICBvdmVycmlkZSBzZXRWYWx1ZSh2YWx1ZTogYW55LCBvcHRpb25zOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuLFxuICAgIGVtaXRFdmVudD86IGJvb2xlYW4sXG4gICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlPzogYm9vbGVhbixcbiAgICBlbWl0Vmlld1RvTW9kZWxDaGFuZ2U/OiBib29sZWFuXG4gIH0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHt2YWx1ZTogYW55fSkudmFsdWUgPSB0aGlzLl9wZW5kaW5nVmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5fb25DaGFuZ2UubGVuZ3RoICYmIG9wdGlvbnMuZW1pdE1vZGVsVG9WaWV3Q2hhbmdlICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5fb25DaGFuZ2UuZm9yRWFjaChcbiAgICAgICAgICAoY2hhbmdlRm4pID0+IGNoYW5nZUZuKHRoaXMudmFsdWUsIG9wdGlvbnMuZW1pdFZpZXdUb01vZGVsQ2hhbmdlICE9PSBmYWxzZSkpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUGF0Y2hlcyB0aGUgdmFsdWUgb2YgYSBjb250cm9sLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGZ1bmN0aW9uYWxseSB0aGUgc2FtZSBhcyB7QGxpbmsgRm9ybUNvbnRyb2wjc2V0VmFsdWUgc2V0VmFsdWV9IGF0IHRoaXMgbGV2ZWwuXG4gICAqIEl0IGV4aXN0cyBmb3Igc3ltbWV0cnkgd2l0aCB7QGxpbmsgRm9ybUdyb3VwI3BhdGNoVmFsdWUgcGF0Y2hWYWx1ZX0gb24gYEZvcm1Hcm91cHNgIGFuZFxuICAgKiBgRm9ybUFycmF5c2AsIHdoZXJlIGl0IGRvZXMgYmVoYXZlIGRpZmZlcmVudGx5LlxuICAgKlxuICAgKiBAc2VlIGBzZXRWYWx1ZWAgZm9yIG9wdGlvbnNcbiAgICovXG4gIG92ZXJyaWRlIHBhdGNoVmFsdWUodmFsdWU6IGFueSwgb3B0aW9uczoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbixcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuLFxuICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZT86IGJvb2xlYW4sXG4gICAgZW1pdFZpZXdUb01vZGVsQ2hhbmdlPzogYm9vbGVhblxuICB9ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLnNldFZhbHVlKHZhbHVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGZvcm0gY29udHJvbCwgbWFya2luZyBpdCBgcHJpc3RpbmVgIGFuZCBgdW50b3VjaGVkYCwgYW5kIHNldHRpbmdcbiAgICogdGhlIHZhbHVlIHRvIG51bGwuXG4gICAqXG4gICAqIEBwYXJhbSBmb3JtU3RhdGUgUmVzZXRzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSxcbiAgICogb3IgYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHJlc2V0LlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqXG4gICAqL1xuICBvdmVycmlkZSByZXNldChmb3JtU3RhdGU6IGFueSA9IG51bGwsIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOlxuICAgICAgdm9pZCB7XG4gICAgdGhpcy5fYXBwbHlGb3JtU3RhdGUoZm9ybVN0YXRlKTtcbiAgICB0aGlzLm1hcmtBc1ByaXN0aW5lKG9wdGlvbnMpO1xuICAgIHRoaXMubWFya0FzVW50b3VjaGVkKG9wdGlvbnMpO1xuICAgIHRoaXMuc2V0VmFsdWUodGhpcy52YWx1ZSwgb3B0aW9ucyk7XG4gICAgdGhpcy5fcGVuZGluZ0NoYW5nZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgb3ZlcnJpZGUgX3VwZGF0ZVZhbHVlKCkge31cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBvdmVycmlkZSBfYW55Q29udHJvbHMoY29uZGl0aW9uOiBGdW5jdGlvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG92ZXJyaWRlIF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIGNoYW5nZSBldmVudHMuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXNcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UucHVzaChmbik7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJuYWwgZnVuY3Rpb24gdG8gdW5yZWdpc3RlciBhIGNoYW5nZSBldmVudHMgbGlzdGVuZXIuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX3VucmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICByZW1vdmVMaXN0SXRlbSh0aGlzLl9vbkNoYW5nZSwgZm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIGRpc2FibGVkIGV2ZW50cy5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBtZXRob2QgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgZGlzYWJsZWQgc3RhdHVzIGNoYW5nZXMuXG4gICAqL1xuICByZWdpc3Rlck9uRGlzYWJsZWRDaGFuZ2UoZm46IChpc0Rpc2FibGVkOiBib29sZWFuKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5wdXNoKGZuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBmdW5jdGlvbiB0byB1bnJlZ2lzdGVyIGEgZGlzYWJsZWQgZXZlbnQgbGlzdGVuZXIuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX3VucmVnaXN0ZXJPbkRpc2FibGVkQ2hhbmdlKGZuOiAoaXNEaXNhYmxlZDogYm9vbGVhbikgPT4gdm9pZCk6IHZvaWQge1xuICAgIHJlbW92ZUxpc3RJdGVtKHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UsIGZuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG92ZXJyaWRlIF9mb3JFYWNoQ2hpbGQoY2I6IEZ1bmN0aW9uKTogdm9pZCB7fVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX3N5bmNQZW5kaW5nQ29udHJvbHMoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMudXBkYXRlT24gPT09ICdzdWJtaXQnKSB7XG4gICAgICBpZiAodGhpcy5fcGVuZGluZ0RpcnR5KSB0aGlzLm1hcmtBc0RpcnR5KCk7XG4gICAgICBpZiAodGhpcy5fcGVuZGluZ1RvdWNoZWQpIHRoaXMubWFya0FzVG91Y2hlZCgpO1xuICAgICAgaWYgKHRoaXMuX3BlbmRpbmdDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLl9wZW5kaW5nVmFsdWUsIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZX0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlGb3JtU3RhdGUoZm9ybVN0YXRlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5faXNCb3hlZFZhbHVlKGZvcm1TdGF0ZSkpIHtcbiAgICAgICh0aGlzIGFzIHt2YWx1ZTogYW55fSkudmFsdWUgPSB0aGlzLl9wZW5kaW5nVmFsdWUgPSBmb3JtU3RhdGUudmFsdWU7XG4gICAgICBmb3JtU3RhdGUuZGlzYWJsZWQgPyB0aGlzLmRpc2FibGUoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IGZhbHNlfSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmFibGUoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICh0aGlzIGFzIHt2YWx1ZTogYW55fSkudmFsdWUgPSB0aGlzLl9wZW5kaW5nVmFsdWUgPSBmb3JtU3RhdGU7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVHJhY2tzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgc3RhdGUgb2YgYSBncm91cCBvZiBgRm9ybUNvbnRyb2xgIGluc3RhbmNlcy5cbiAqXG4gKiBBIGBGb3JtR3JvdXBgIGFnZ3JlZ2F0ZXMgdGhlIHZhbHVlcyBvZiBlYWNoIGNoaWxkIGBGb3JtQ29udHJvbGAgaW50byBvbmUgb2JqZWN0LFxuICogd2l0aCBlYWNoIGNvbnRyb2wgbmFtZSBhcyB0aGUga2V5LiAgSXQgY2FsY3VsYXRlcyBpdHMgc3RhdHVzIGJ5IHJlZHVjaW5nIHRoZSBzdGF0dXMgdmFsdWVzXG4gKiBvZiBpdHMgY2hpbGRyZW4uIEZvciBleGFtcGxlLCBpZiBvbmUgb2YgdGhlIGNvbnRyb2xzIGluIGEgZ3JvdXAgaXMgaW52YWxpZCwgdGhlIGVudGlyZVxuICogZ3JvdXAgYmVjb21lcyBpbnZhbGlkLlxuICpcbiAqIGBGb3JtR3JvdXBgIGlzIG9uZSBvZiB0aGUgdGhyZWUgZnVuZGFtZW50YWwgYnVpbGRpbmcgYmxvY2tzIHVzZWQgdG8gZGVmaW5lIGZvcm1zIGluIEFuZ3VsYXIsXG4gKiBhbG9uZyB3aXRoIGBGb3JtQ29udHJvbGAgYW5kIGBGb3JtQXJyYXlgLlxuICpcbiAqIFdoZW4gaW5zdGFudGlhdGluZyBhIGBGb3JtR3JvdXBgLCBwYXNzIGluIGEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scyBhcyB0aGUgZmlyc3RcbiAqIGFyZ3VtZW50LiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIHJlZ2lzdGVycyB0aGUgbmFtZSBmb3IgdGhlIGNvbnRyb2wuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQ3JlYXRlIGEgZm9ybSBncm91cCB3aXRoIDIgY29udHJvbHNcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgnTmFuY3knLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgnRHJldycpLFxuICogfSk7XG4gKlxuICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiAnTmFuY3knLCBsYXN0OyAnRHJldyd9XG4gKiBjb25zb2xlLmxvZyhmb3JtLnN0YXR1cyk7ICAvLyAnVkFMSUQnXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ3JlYXRlIGEgZm9ybSBncm91cCB3aXRoIGEgZ3JvdXAtbGV2ZWwgdmFsaWRhdG9yXG4gKlxuICogWW91IGluY2x1ZGUgZ3JvdXAtbGV2ZWwgdmFsaWRhdG9ycyBhcyB0aGUgc2Vjb25kIGFyZywgb3IgZ3JvdXAtbGV2ZWwgYXN5bmNcbiAqIHZhbGlkYXRvcnMgYXMgdGhlIHRoaXJkIGFyZy4gVGhlc2UgY29tZSBpbiBoYW5keSB3aGVuIHlvdSB3YW50IHRvIHBlcmZvcm0gdmFsaWRhdGlvblxuICogdGhhdCBjb25zaWRlcnMgdGhlIHZhbHVlIG9mIG1vcmUgdGhhbiBvbmUgY2hpbGQgY29udHJvbC5cbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgcGFzc3dvcmQ6IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMikpLFxuICogICBwYXNzd29yZENvbmZpcm06IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMikpLFxuICogfSwgcGFzc3dvcmRNYXRjaFZhbGlkYXRvcik7XG4gKlxuICpcbiAqIGZ1bmN0aW9uIHBhc3N3b3JkTWF0Y2hWYWxpZGF0b3IoZzogRm9ybUdyb3VwKSB7XG4gKiAgICByZXR1cm4gZy5nZXQoJ3Bhc3N3b3JkJykudmFsdWUgPT09IGcuZ2V0KCdwYXNzd29yZENvbmZpcm0nKS52YWx1ZVxuICogICAgICAgPyBudWxsIDogeydtaXNtYXRjaCc6IHRydWV9O1xuICogfVxuICogYGBgXG4gKlxuICogTGlrZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlcywgeW91IGNob29zZSB0byBwYXNzIGluXG4gKiB2YWxpZGF0b3JzIGFuZCBhc3luYyB2YWxpZGF0b3JzIGFzIHBhcnQgb2YgYW4gb3B0aW9ucyBvYmplY3QuXG4gKlxuICogYGBgXG4gKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIHBhc3N3b3JkOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gKiAgIHBhc3N3b3JkQ29uZmlybTogbmV3IEZvcm1Db250cm9sKCcnKVxuICogfSwgeyB2YWxpZGF0b3JzOiBwYXNzd29yZE1hdGNoVmFsaWRhdG9yLCBhc3luY1ZhbGlkYXRvcnM6IG90aGVyVmFsaWRhdG9yIH0pO1xuICogYGBgXG4gKlxuICogIyMjIFNldCB0aGUgdXBkYXRlT24gcHJvcGVydHkgZm9yIGFsbCBjb250cm9scyBpbiBhIGZvcm0gZ3JvdXBcbiAqXG4gKiBUaGUgb3B0aW9ucyBvYmplY3QgaXMgdXNlZCB0byBzZXQgYSBkZWZhdWx0IHZhbHVlIGZvciBlYWNoIGNoaWxkXG4gKiBjb250cm9sJ3MgYHVwZGF0ZU9uYCBwcm9wZXJ0eS4gSWYgeW91IHNldCBgdXBkYXRlT25gIHRvIGAnYmx1cidgIGF0IHRoZVxuICogZ3JvdXAgbGV2ZWwsIGFsbCBjaGlsZCBjb250cm9scyBkZWZhdWx0IHRvICdibHVyJywgdW5sZXNzIHRoZSBjaGlsZFxuICogaGFzIGV4cGxpY2l0bHkgc3BlY2lmaWVkIGEgZGlmZmVyZW50IGB1cGRhdGVPbmAgdmFsdWUuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGMgPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgb25lOiBuZXcgRm9ybUNvbnRyb2woKVxuICogfSwgeyB1cGRhdGVPbjogJ2JsdXInIH0pO1xuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgRm9ybUdyb3VwIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9scyBBIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29udHJvbHMuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgaXMgdGhlIG5hbWVcbiAgICogdW5kZXIgd2hpY2ggaXQgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICogc3VjaCBmdW5jdGlvbnMsIG9yIGFuIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWlucyB2YWxpZGF0aW9uIGZ1bmN0aW9uc1xuICAgKiBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgY29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9LFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpIHtcbiAgICBzdXBlcihwaWNrVmFsaWRhdG9ycyh2YWxpZGF0b3JPck9wdHMpLCBwaWNrQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpKTtcbiAgICB0aGlzLl9pbml0T2JzZXJ2YWJsZXMoKTtcbiAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSh2YWxpZGF0b3JPck9wdHMpO1xuICAgIHRoaXMuX3NldFVwQ29udHJvbHMoKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe1xuICAgICAgb25seVNlbGY6IHRydWUsXG4gICAgICAvLyBJZiBgYXN5bmNWYWxpZGF0b3JgIGlzIHByZXNlbnQsIGl0IHdpbGwgdHJpZ2dlciBjb250cm9sIHN0YXR1cyBjaGFuZ2UgZnJvbSBgUEVORElOR2AgdG9cbiAgICAgIC8vIGBWQUxJRGAgb3IgYElOVkFMSURgLiBUaGUgc3RhdHVzIHNob3VsZCBiZSBicm9hZGNhc3RlZCB2aWEgdGhlIGBzdGF0dXNDaGFuZ2VzYCBvYnNlcnZhYmxlLFxuICAgICAgLy8gc28gd2Ugc2V0IGBlbWl0RXZlbnRgIHRvIGB0cnVlYCB0byBhbGxvdyB0aGF0IGR1cmluZyB0aGUgY29udHJvbCBjcmVhdGlvbiBwcm9jZXNzLlxuICAgICAgZW1pdEV2ZW50OiAhIXRoaXMuYXN5bmNWYWxpZGF0b3JcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjb250cm9sIHdpdGggdGhlIGdyb3VwJ3MgbGlzdCBvZiBjb250cm9scy5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgZG9lcyBub3QgdXBkYXRlIHRoZSB2YWx1ZSBvciB2YWxpZGl0eSBvZiB0aGUgY29udHJvbC5cbiAgICogVXNlIHtAbGluayBGb3JtR3JvdXAjYWRkQ29udHJvbCBhZGRDb250cm9sfSBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIHJlZ2lzdGVyIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBjb250cm9sIFByb3ZpZGVzIHRoZSBjb250cm9sIGZvciB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cbiAgcmVnaXN0ZXJDb250cm9sKG5hbWU6IHN0cmluZywgY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSkgcmV0dXJuIHRoaXMuY29udHJvbHNbbmFtZV07XG4gICAgdGhpcy5jb250cm9sc1tuYW1lXSA9IGNvbnRyb2w7XG4gICAgY29udHJvbC5zZXRQYXJlbnQodGhpcyk7XG4gICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICByZXR1cm4gY29udHJvbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjb250cm9sIHRvIHRoaXMgZ3JvdXAuXG4gICAqXG4gICAqIElmIGEgY29udHJvbCB3aXRoIGEgZ2l2ZW4gbmFtZSBhbHJlYWR5IGV4aXN0cywgaXQgd291bGQgKm5vdCogYmUgcmVwbGFjZWQgd2l0aCBhIG5ldyBvbmUuXG4gICAqIElmIHlvdSB3YW50IHRvIHJlcGxhY2UgYW4gZXhpc3RpbmcgY29udHJvbCwgdXNlIHRoZSB7QGxpbmsgRm9ybUdyb3VwI3NldENvbnRyb2wgc2V0Q29udHJvbH1cbiAgICogbWV0aG9kIGluc3RlYWQuIFRoaXMgbWV0aG9kIGFsc28gdXBkYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIGFkZCB0byB0aGUgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gY29udHJvbCBQcm92aWRlcyB0aGUgY29udHJvbCBmb3IgdGhlIGdpdmVuIG5hbWVcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtR3JvdXAgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGEgbmV3XG4gICAqICAgICBjb250cm9sIGlzIGFkZGVkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiBhZGRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgYWRkQ29udHJvbChuYW1lOiBzdHJpbmcsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgb3B0aW9uczoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLnJlZ2lzdGVyQ29udHJvbChuYW1lLCBjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjb250cm9sIGZyb20gdGhpcyBncm91cC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWxzbyB1cGRhdGVzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gcmVtb3ZlIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtR3JvdXAgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFcbiAgICogICAgIGNvbnRyb2wgaXMgcmVtb3ZlZC5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICogcmVtb3ZlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgcmVtb3ZlQ29udHJvbChuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udHJvbHNbbmFtZV0pIHRoaXMuY29udHJvbHNbbmFtZV0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICBkZWxldGUgKHRoaXMuY29udHJvbHNbbmFtZV0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYW4gZXhpc3RpbmcgY29udHJvbC5cbiAgICpcbiAgICogSWYgYSBjb250cm9sIHdpdGggYSBnaXZlbiBuYW1lIGRvZXMgbm90IGV4aXN0IGluIHRoaXMgYEZvcm1Hcm91cGAsIGl0IHdpbGwgYmUgYWRkZWQuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gcmVwbGFjZSBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gY29udHJvbCBQcm92aWRlcyB0aGUgY29udHJvbCBmb3IgdGhlIGdpdmVuIG5hbWVcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtR3JvdXAgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFuXG4gICAqICAgICBleGlzdGluZyBjb250cm9sIGlzIHJlcGxhY2VkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiByZXBsYWNlZCB3aXRoIGEgbmV3IG9uZS4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgc2V0Q29udHJvbChuYW1lOiBzdHJpbmcsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgb3B0aW9uczoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSkgdGhpcy5jb250cm9sc1tuYW1lXS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgIGRlbGV0ZSAodGhpcy5jb250cm9sc1tuYW1lXSk7XG4gICAgaWYgKGNvbnRyb2wpIHRoaXMucmVnaXN0ZXJDb250cm9sKG5hbWUsIGNvbnRyb2wpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlcmUgaXMgYW4gZW5hYmxlZCBjb250cm9sIHdpdGggdGhlIGdpdmVuIG5hbWUgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBSZXBvcnRzIGZhbHNlIGZvciBkaXNhYmxlZCBjb250cm9scy4gSWYgeW91J2QgbGlrZSB0byBjaGVjayBmb3IgZXhpc3RlbmNlIGluIHRoZSBncm91cFxuICAgKiBvbmx5LCB1c2Uge0BsaW5rIEFic3RyYWN0Q29udHJvbCNnZXQgZ2V0fSBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbE5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byBjaGVjayBmb3IgZXhpc3RlbmNlIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqXG4gICAqIEByZXR1cm5zIGZhbHNlIGZvciBkaXNhYmxlZCBjb250cm9scywgdHJ1ZSBvdGhlcndpc2UuXG4gICAqL1xuICBjb250YWlucyhjb250cm9sTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHMuaGFzT3duUHJvcGVydHkoY29udHJvbE5hbWUpICYmIHRoaXMuY29udHJvbHNbY29udHJvbE5hbWVdLmVuYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBGb3JtR3JvdXBgLiBJdCBhY2NlcHRzIGFuIG9iamVjdCB0aGF0IG1hdGNoZXNcbiAgICogdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAsIHdpdGggY29udHJvbCBuYW1lcyBhcyBrZXlzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgU2V0IHRoZSBjb21wbGV0ZSB2YWx1ZSBmb3IgdGhlIGZvcm0gZ3JvdXBcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKClcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogbnVsbCwgbGFzdDogbnVsbH1cbiAgICpcbiAgICogZm9ybS5zZXRWYWx1ZSh7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q6ICdEcmV3J30pO1xuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q6ICdEcmV3J31cbiAgICogYGBgXG4gICAqXG4gICAqIEB0aHJvd3MgV2hlbiBzdHJpY3QgY2hlY2tzIGZhaWwsIHN1Y2ggYXMgc2V0dGluZyB0aGUgdmFsdWUgb2YgYSBjb250cm9sXG4gICAqIHRoYXQgZG9lc24ndCBleGlzdCBvciBpZiB5b3UgZXhjbHVkZSBhIHZhbHVlIG9mIGEgY29udHJvbCB0aGF0IGRvZXMgZXhpc3QuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgY29udHJvbCB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICpcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgb3ZlcnJpZGUgc2V0VmFsdWUoXG4gICAgICB2YWx1ZToge1trZXk6IHN0cmluZ106IGFueX0sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja0FsbFZhbHVlc1ByZXNlbnQodmFsdWUpO1xuICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgdGhpcy5fdGhyb3dJZkNvbnRyb2xNaXNzaW5nKG5hbWUpO1xuICAgICAgdGhpcy5jb250cm9sc1tuYW1lXS5zZXRWYWx1ZSh2YWx1ZVtuYW1lXSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybUdyb3VwYC4gSXQgYWNjZXB0cyBhbiBvYmplY3Qgd2l0aCBjb250cm9sXG4gICAqIG5hbWVzIGFzIGtleXMsIGFuZCBkb2VzIGl0cyBiZXN0IHRvIG1hdGNoIHRoZSB2YWx1ZXMgdG8gdGhlIGNvcnJlY3QgY29udHJvbHNcbiAgICogaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBJdCBhY2NlcHRzIGJvdGggc3VwZXItc2V0cyBhbmQgc3ViLXNldHMgb2YgdGhlIGdyb3VwIHdpdGhvdXQgdGhyb3dpbmcgYW4gZXJyb3IuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBQYXRjaCB0aGUgdmFsdWUgZm9yIGEgZm9ybSBncm91cFxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIH0pO1xuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6IG51bGwsIGxhc3Q6IG51bGx9XG4gICAqXG4gICAqIGZvcm0ucGF0Y2hWYWx1ZSh7Zmlyc3Q6ICdOYW5jeSd9KTtcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiAnTmFuY3knLCBsYXN0OiBudWxsfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBvYmplY3QgdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBpcyBwYXRjaGVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogdHJ1ZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWVcbiAgICogaXMgdXBkYXRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG9cbiAgICogdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqL1xuICBvdmVycmlkZSBwYXRjaFZhbHVlKFxuICAgICAgdmFsdWU6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgLy8gRXZlbiB0aG91Z2ggdGhlIGB2YWx1ZWAgYXJndW1lbnQgdHlwZSBkb2Vzbid0IGFsbG93IGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLCB0aGVcbiAgICAvLyBgcGF0Y2hWYWx1ZWAgY2FuIGJlIGNhbGxlZCByZWN1cnNpdmVseSBhbmQgaW5uZXIgZGF0YSBzdHJ1Y3R1cmVzIG1pZ2h0IGhhdmUgdGhlc2UgdmFsdWVzLCBzb1xuICAgIC8vIHdlIGp1c3QgaWdub3JlIHN1Y2ggY2FzZXMgd2hlbiBhIGZpZWxkIGNvbnRhaW5pbmcgRm9ybUdyb3VwIGluc3RhbmNlIHJlY2VpdmVzIGBudWxsYCBvclxuICAgIC8vIGB1bmRlZmluZWRgIGFzIGEgdmFsdWUuXG4gICAgaWYgKHZhbHVlID09IG51bGwgLyogYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgICovKSByZXR1cm47XG5cbiAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzW25hbWVdKSB7XG4gICAgICAgIHRoaXMuY29udHJvbHNbbmFtZV0ucGF0Y2hWYWx1ZSh2YWx1ZVtuYW1lXSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYEZvcm1Hcm91cGAsIG1hcmtzIGFsbCBkZXNjZW5kYW50cyBgcHJpc3RpbmVgIGFuZCBgdW50b3VjaGVkYCBhbmQgc2V0c1xuICAgKiB0aGUgdmFsdWUgb2YgYWxsIGRlc2NlbmRhbnRzIHRvIG51bGwuXG4gICAqXG4gICAqIFlvdSByZXNldCB0byBhIHNwZWNpZmljIGZvcm0gc3RhdGUgYnkgcGFzc2luZyBpbiBhIG1hcCBvZiBzdGF0ZXNcbiAgICogdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgeW91ciBmb3JtLCB3aXRoIGNvbnRyb2wgbmFtZXMgYXMga2V5cy4gVGhlIHN0YXRlXG4gICAqIGlzIGEgc3RhbmRhbG9uZSB2YWx1ZSBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHdpdGggYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkXG4gICAqIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFJlc2V0cyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgdmFsdWUsXG4gICAqIG9yIGFuIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIHdoZW4gdGhlIGdyb3VwIGlzIHJlc2V0LlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyByZXNldC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBSZXNldCB0aGUgZm9ybSBncm91cCB2YWx1ZXNcbiAgICpcbiAgICogYGBgdHNcbiAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woJ2ZpcnN0IG5hbWUnKSxcbiAgICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ2xhc3QgbmFtZScpXG4gICAqIH0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ2ZpcnN0IG5hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cbiAgICpcbiAgICogZm9ybS5yZXNldCh7IGZpcnN0OiAnbmFtZScsIGxhc3Q6ICdsYXN0IG5hbWUnIH0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ25hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cbiAgICogYGBgXG4gICAqXG4gICAqICMjIyBSZXNldCB0aGUgZm9ybSBncm91cCB2YWx1ZXMgYW5kIGRpc2FibGVkIHN0YXR1c1xuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woJ2ZpcnN0IG5hbWUnKSxcbiAgICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ2xhc3QgbmFtZScpXG4gICAqIH0pO1xuICAgKlxuICAgKiBmb3JtLnJlc2V0KHtcbiAgICogICBmaXJzdDoge3ZhbHVlOiAnbmFtZScsIGRpc2FibGVkOiB0cnVlfSxcbiAgICogICBsYXN0OiAnbGFzdCdcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgLy8ge2xhc3Q6ICdsYXN0J31cbiAgICogY29uc29sZS5sb2coZm9ybS5nZXQoJ2ZpcnN0Jykuc3RhdHVzKTsgIC8vICdESVNBQkxFRCdcbiAgICogYGBgXG4gICAqL1xuICBvdmVycmlkZSByZXNldCh2YWx1ZTogYW55ID0ge30sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb250cm9sLnJlc2V0KHZhbHVlW25hbWVdLCB7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB9KTtcbiAgICB0aGlzLl91cGRhdGVQcmlzdGluZShvcHRpb25zKTtcbiAgICB0aGlzLl91cGRhdGVUb3VjaGVkKG9wdGlvbnMpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZSBgRm9ybUdyb3VwYCwgaW5jbHVkaW5nIGFueSBkaXNhYmxlZCBjb250cm9scy5cbiAgICpcbiAgICogUmV0cmlldmVzIGFsbCB2YWx1ZXMgcmVnYXJkbGVzcyBvZiBkaXNhYmxlZCBzdGF0dXMuXG4gICAqIFRoZSBgdmFsdWVgIHByb3BlcnR5IGlzIHRoZSBiZXN0IHdheSB0byBnZXQgdGhlIHZhbHVlIG9mIHRoZSBncm91cCwgYmVjYXVzZVxuICAgKiBpdCBleGNsdWRlcyBkaXNhYmxlZCBjb250cm9scyBpbiB0aGUgYEZvcm1Hcm91cGAuXG4gICAqL1xuICBnZXRSYXdWYWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9yZWR1Y2VDaGlsZHJlbihcbiAgICAgICAge30sIChhY2M6IHtbazogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSwgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBhY2NbbmFtZV0gPSBjb250cm9sIGluc3RhbmNlb2YgRm9ybUNvbnRyb2wgPyBjb250cm9sLnZhbHVlIDogKDxhbnk+Y29udHJvbCkuZ2V0UmF3VmFsdWUoKTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX3N5bmNQZW5kaW5nQ29udHJvbHMoKTogYm9vbGVhbiB7XG4gICAgbGV0IHN1YnRyZWVVcGRhdGVkID0gdGhpcy5fcmVkdWNlQ2hpbGRyZW4oZmFsc2UsICh1cGRhdGVkOiBib29sZWFuLCBjaGlsZDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICByZXR1cm4gY2hpbGQuX3N5bmNQZW5kaW5nQ29udHJvbHMoKSA/IHRydWUgOiB1cGRhdGVkO1xuICAgIH0pO1xuICAgIGlmIChzdWJ0cmVlVXBkYXRlZCkgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIHJldHVybiBzdWJ0cmVlVXBkYXRlZDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Rocm93SWZDb250cm9sTWlzc2luZyhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuY29udHJvbHMpLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgICAgVGhlcmUgYXJlIG5vIGZvcm0gY29udHJvbHMgcmVnaXN0ZXJlZCB3aXRoIHRoaXMgZ3JvdXAgeWV0LiBJZiB5b3UncmUgdXNpbmcgbmdNb2RlbCxcbiAgICAgICAgeW91IG1heSB3YW50IHRvIGNoZWNrIG5leHQgdGljayAoZS5nLiB1c2Ugc2V0VGltZW91dCkuXG4gICAgICBgKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNvbnRyb2xzW25hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIGZvcm0gY29udHJvbCB3aXRoIG5hbWU6ICR7bmFtZX0uYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfZm9yRWFjaENoaWxkKGNiOiAodjogYW55LCBrOiBzdHJpbmcpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAvLyBUaGUgbGlzdCBvZiBjb250cm9scyBjYW4gY2hhbmdlIChmb3IgZXguIGNvbnRyb2xzIG1pZ2h0IGJlIHJlbW92ZWQpIHdoaWxlIHRoZSBsb29wXG4gICAgICAvLyBpcyBydW5uaW5nIChhcyBhIHJlc3VsdCBvZiBpbnZva2luZyBGb3JtcyBBUEkgaW4gYHZhbHVlQ2hhbmdlc2Agc3Vic2NyaXB0aW9uKSwgc28gd2VcbiAgICAgIC8vIGhhdmUgdG8gbnVsbCBjaGVjayBiZWZvcmUgaW52b2tpbmcgdGhlIGNhbGxiYWNrLlxuICAgICAgY29uc3QgY29udHJvbCA9IHRoaXMuY29udHJvbHNba2V5XTtcbiAgICAgIGNvbnRyb2wgJiYgY2IoY29udHJvbCwga2V5KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldFVwQ29udHJvbHMoKTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnRyb2wuc2V0UGFyZW50KHRoaXMpO1xuICAgICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX3VwZGF0ZVZhbHVlKCk6IHZvaWQge1xuICAgICh0aGlzIGFzIHt2YWx1ZTogYW55fSkudmFsdWUgPSB0aGlzLl9yZWR1Y2VWYWx1ZSgpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfYW55Q29udHJvbHMoY29uZGl0aW9uOiBGdW5jdGlvbik6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY29udHJvbE5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5jb250cm9scykpIHtcbiAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2xzW2NvbnRyb2xOYW1lXTtcbiAgICAgIGlmICh0aGlzLmNvbnRhaW5zKGNvbnRyb2xOYW1lKSAmJiBjb25kaXRpb24oY29udHJvbCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZHVjZVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWR1Y2VDaGlsZHJlbihcbiAgICAgICAge30sIChhY2M6IHtbazogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSwgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBpZiAoY29udHJvbC5lbmFibGVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGFjY1tuYW1lXSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVkdWNlQ2hpbGRyZW4oaW5pdFZhbHVlOiBhbnksIGZuOiBGdW5jdGlvbikge1xuICAgIGxldCByZXMgPSBpbml0VmFsdWU7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgcmVzID0gZm4ocmVzLCBjb250cm9sLCBuYW1lKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfYWxsQ29udHJvbHNEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNvbnRyb2xOYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuY29udHJvbHMpKSB7XG4gICAgICBpZiAodGhpcy5jb250cm9sc1tjb250cm9sTmFtZV0uZW5hYmxlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5sZW5ndGggPiAwIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jaGVja0FsbFZhbHVlc1ByZXNlbnQodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICh2YWx1ZVtuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTXVzdCBzdXBwbHkgYSB2YWx1ZSBmb3IgZm9ybSBjb250cm9sIHdpdGggbmFtZTogJyR7bmFtZX0nLmApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVHJhY2tzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgc3RhdGUgb2YgYW4gYXJyYXkgb2YgYEZvcm1Db250cm9sYCxcbiAqIGBGb3JtR3JvdXBgIG9yIGBGb3JtQXJyYXlgIGluc3RhbmNlcy5cbiAqXG4gKiBBIGBGb3JtQXJyYXlgIGFnZ3JlZ2F0ZXMgdGhlIHZhbHVlcyBvZiBlYWNoIGNoaWxkIGBGb3JtQ29udHJvbGAgaW50byBhbiBhcnJheS5cbiAqIEl0IGNhbGN1bGF0ZXMgaXRzIHN0YXR1cyBieSByZWR1Y2luZyB0aGUgc3RhdHVzIHZhbHVlcyBvZiBpdHMgY2hpbGRyZW4uIEZvciBleGFtcGxlLCBpZiBvbmUgb2ZcbiAqIHRoZSBjb250cm9scyBpbiBhIGBGb3JtQXJyYXlgIGlzIGludmFsaWQsIHRoZSBlbnRpcmUgYXJyYXkgYmVjb21lcyBpbnZhbGlkLlxuICpcbiAqIGBGb3JtQXJyYXlgIGlzIG9uZSBvZiB0aGUgdGhyZWUgZnVuZGFtZW50YWwgYnVpbGRpbmcgYmxvY2tzIHVzZWQgdG8gZGVmaW5lIGZvcm1zIGluIEFuZ3VsYXIsXG4gKiBhbG9uZyB3aXRoIGBGb3JtQ29udHJvbGAgYW5kIGBGb3JtR3JvdXBgLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENyZWF0ZSBhbiBhcnJheSBvZiBmb3JtIGNvbnRyb2xzXG4gKlxuICogYGBgXG4gKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAqICAgbmV3IEZvcm1Db250cm9sKCdOYW5jeScsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqICAgbmV3IEZvcm1Db250cm9sKCdEcmV3JyksXG4gKiBdKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFsnTmFuY3knLCAnRHJldyddXG4gKiBjb25zb2xlLmxvZyhhcnIuc3RhdHVzKTsgIC8vICdWQUxJRCdcbiAqIGBgYFxuICpcbiAqICMjIyBDcmVhdGUgYSBmb3JtIGFycmF5IHdpdGggYXJyYXktbGV2ZWwgdmFsaWRhdG9yc1xuICpcbiAqIFlvdSBpbmNsdWRlIGFycmF5LWxldmVsIHZhbGlkYXRvcnMgYW5kIGFzeW5jIHZhbGlkYXRvcnMuIFRoZXNlIGNvbWUgaW4gaGFuZHlcbiAqIHdoZW4geW91IHdhbnQgdG8gcGVyZm9ybSB2YWxpZGF0aW9uIHRoYXQgY29uc2lkZXJzIHRoZSB2YWx1ZSBvZiBtb3JlIHRoYW4gb25lIGNoaWxkXG4gKiBjb250cm9sLlxuICpcbiAqIFRoZSB0d28gdHlwZXMgb2YgdmFsaWRhdG9ycyBhcmUgcGFzc2VkIGluIHNlcGFyYXRlbHkgYXMgdGhlIHNlY29uZCBhbmQgdGhpcmQgYXJnXG4gKiByZXNwZWN0aXZlbHksIG9yIHRvZ2V0aGVyIGFzIHBhcnQgb2YgYW4gb3B0aW9ucyBvYmplY3QuXG4gKlxuICogYGBgXG4gKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAqICAgbmV3IEZvcm1Db250cm9sKCdOYW5jeScpLFxuICogICBuZXcgRm9ybUNvbnRyb2woJ0RyZXcnKVxuICogXSwge3ZhbGlkYXRvcnM6IG15VmFsaWRhdG9yLCBhc3luY1ZhbGlkYXRvcnM6IG15QXN5bmNWYWxpZGF0b3J9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBTZXQgdGhlIHVwZGF0ZU9uIHByb3BlcnR5IGZvciBhbGwgY29udHJvbHMgaW4gYSBmb3JtIGFycmF5XG4gKlxuICogVGhlIG9wdGlvbnMgb2JqZWN0IGlzIHVzZWQgdG8gc2V0IGEgZGVmYXVsdCB2YWx1ZSBmb3IgZWFjaCBjaGlsZFxuICogY29udHJvbCdzIGB1cGRhdGVPbmAgcHJvcGVydHkuIElmIHlvdSBzZXQgYHVwZGF0ZU9uYCB0byBgJ2JsdXInYCBhdCB0aGVcbiAqIGFycmF5IGxldmVsLCBhbGwgY2hpbGQgY29udHJvbHMgZGVmYXVsdCB0byAnYmx1cicsIHVubGVzcyB0aGUgY2hpbGRcbiAqIGhhcyBleHBsaWNpdGx5IHNwZWNpZmllZCBhIGRpZmZlcmVudCBgdXBkYXRlT25gIHZhbHVlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gKiBdLCB7dXBkYXRlT246ICdibHVyJ30pO1xuICogYGBgXG4gKlxuICogIyMjIEFkZGluZyBvciByZW1vdmluZyBjb250cm9scyBmcm9tIGEgZm9ybSBhcnJheVxuICpcbiAqIFRvIGNoYW5nZSB0aGUgY29udHJvbHMgaW4gdGhlIGFycmF5LCB1c2UgdGhlIGBwdXNoYCwgYGluc2VydGAsIGByZW1vdmVBdGAgb3IgYGNsZWFyYCBtZXRob2RzXG4gKiBpbiBgRm9ybUFycmF5YCBpdHNlbGYuIFRoZXNlIG1ldGhvZHMgZW5zdXJlIHRoZSBjb250cm9scyBhcmUgcHJvcGVybHkgdHJhY2tlZCBpbiB0aGVcbiAqIGZvcm0ncyBoaWVyYXJjaHkuIERvIG5vdCBtb2RpZnkgdGhlIGFycmF5IG9mIGBBYnN0cmFjdENvbnRyb2xgcyB1c2VkIHRvIGluc3RhbnRpYXRlXG4gKiB0aGUgYEZvcm1BcnJheWAgZGlyZWN0bHksIGFzIHRoYXQgcmVzdWx0IGluIHN0cmFuZ2UgYW5kIHVuZXhwZWN0ZWQgYmVoYXZpb3Igc3VjaFxuICogYXMgYnJva2VuIGNoYW5nZSBkZXRlY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgRm9ybUFycmF5IGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1BcnJheWAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9scyBBbiBhcnJheSBvZiBjaGlsZCBjb250cm9scy4gRWFjaCBjaGlsZCBjb250cm9sIGlzIGdpdmVuIGFuIGluZGV4XG4gICAqIHdoZXJlIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdmFsaWRhdGlvbiBmdW5jdGlvbnNcbiAgICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGNvbnRyb2xzOiBBYnN0cmFjdENvbnRyb2xbXSxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKSB7XG4gICAgc3VwZXIocGlja1ZhbGlkYXRvcnModmFsaWRhdG9yT3JPcHRzKSwgcGlja0FzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvciwgdmFsaWRhdG9yT3JPcHRzKSk7XG4gICAgdGhpcy5faW5pdE9ic2VydmFibGVzKCk7XG4gICAgdGhpcy5fc2V0VXBkYXRlU3RyYXRlZ3kodmFsaWRhdG9yT3JPcHRzKTtcbiAgICB0aGlzLl9zZXRVcENvbnRyb2xzKCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtcbiAgICAgIG9ubHlTZWxmOiB0cnVlLFxuICAgICAgLy8gSWYgYGFzeW5jVmFsaWRhdG9yYCBpcyBwcmVzZW50LCBpdCB3aWxsIHRyaWdnZXIgY29udHJvbCBzdGF0dXMgY2hhbmdlIGZyb20gYFBFTkRJTkdgIHRvXG4gICAgICAvLyBgVkFMSURgIG9yIGBJTlZBTElEYC5cbiAgICAgIC8vIFRoZSBzdGF0dXMgc2hvdWxkIGJlIGJyb2FkY2FzdGVkIHZpYSB0aGUgYHN0YXR1c0NoYW5nZXNgIG9ic2VydmFibGUsIHNvIHdlIHNldCBgZW1pdEV2ZW50YFxuICAgICAgLy8gdG8gYHRydWVgIHRvIGFsbG93IHRoYXQgZHVyaW5nIHRoZSBjb250cm9sIGNyZWF0aW9uIHByb2Nlc3MuXG4gICAgICBlbWl0RXZlbnQ6ICEhdGhpcy5hc3luY1ZhbGlkYXRvclxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYEFic3RyYWN0Q29udHJvbGAgYXQgdGhlIGdpdmVuIGBpbmRleGAgaW4gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJldHJpZXZlIHRoZSBjb250cm9sXG4gICAqL1xuICBhdChpbmRleDogbnVtYmVyKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sc1tpbmRleF07XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IGEgbmV3IGBBYnN0cmFjdENvbnRyb2xgIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbCBGb3JtIGNvbnRyb2wgdG8gYmUgaW5zZXJ0ZWRcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGEgbmV3XG4gICAqICAgICBjb250cm9sIGlzIGFkZGVkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiBpbnNlcnRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgcHVzaChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG9wdGlvbnM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5jb250cm9scy5wdXNoKGNvbnRyb2wpO1xuICAgIHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYSBuZXcgYEFic3RyYWN0Q29udHJvbGAgYXQgdGhlIGdpdmVuIGBpbmRleGAgaW4gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIGluc2VydCB0aGUgY29udHJvbFxuICAgKiBAcGFyYW0gY29udHJvbCBGb3JtIGNvbnRyb2wgdG8gYmUgaW5zZXJ0ZWRcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGEgbmV3XG4gICAqICAgICBjb250cm9sIGlzIGluc2VydGVkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiBpbnNlcnRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgaW5zZXJ0KGluZGV4OiBudW1iZXIsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgb3B0aW9uczoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRyb2xzLnNwbGljZShpbmRleCwgMCwgY29udHJvbCk7XG5cbiAgICB0aGlzLl9yZWdpc3RlckNvbnRyb2woY29udHJvbCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBjb250cm9sIGF0IHRoZSBnaXZlbiBgaW5kZXhgIGluIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4IEluZGV4IGluIHRoZSBhcnJheSB0byByZW1vdmUgdGhlIGNvbnRyb2xcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFcbiAgICogICAgIGNvbnRyb2wgaXMgcmVtb3ZlZC5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICogcmVtb3ZlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgcmVtb3ZlQXQoaW5kZXg6IG51bWJlciwgb3B0aW9uczoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tpbmRleF0pIHRoaXMuY29udHJvbHNbaW5kZXhdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgdGhpcy5jb250cm9scy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYW4gZXhpc3RpbmcgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4IEluZGV4IGluIHRoZSBhcnJheSB0byByZXBsYWNlIHRoZSBjb250cm9sXG4gICAqIEBwYXJhbSBjb250cm9sIFRoZSBgQWJzdHJhY3RDb250cm9sYCBjb250cm9sIHRvIHJlcGxhY2UgdGhlIGV4aXN0aW5nIGNvbnRyb2xcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFuXG4gICAqICAgICBleGlzdGluZyBjb250cm9sIGlzIHJlcGxhY2VkIHdpdGggYSBuZXcgb25lLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiByZXBsYWNlZCB3aXRoIGEgbmV3IG9uZS4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgc2V0Q29udHJvbChpbmRleDogbnVtYmVyLCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG9wdGlvbnM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udHJvbHNbaW5kZXhdKSB0aGlzLmNvbnRyb2xzW2luZGV4XS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIGlmIChjb250cm9sKSB7XG4gICAgICB0aGlzLmNvbnRyb2xzLnNwbGljZShpbmRleCwgMCwgY29udHJvbCk7XG4gICAgICB0aGlzLl9yZWdpc3RlckNvbnRyb2woY29udHJvbCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogTGVuZ3RoIG9mIHRoZSBjb250cm9sIGFycmF5LlxuICAgKi9cbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1BcnJheWAuIEl0IGFjY2VwdHMgYW4gYXJyYXkgdGhhdCBtYXRjaGVzXG4gICAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHBlcmZvcm1zIHN0cmljdCBjaGVja3MsIGFuZCB0aHJvd3MgYW4gZXJyb3IgaWYgeW91IHRyeVxuICAgKiB0byBzZXQgdGhlIHZhbHVlIG9mIGEgY29udHJvbCB0aGF0IGRvZXNuJ3QgZXhpc3Qgb3IgaWYgeW91IGV4Y2x1ZGUgdGhlXG4gICAqIHZhbHVlIG9mIGEgY29udHJvbC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFNldCB0aGUgdmFsdWVzIGZvciB0aGUgY29udHJvbHMgaW4gdGhlIGZvcm0gYXJyYXlcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgIG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIF0pO1xuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFtudWxsLCBudWxsXVxuICAgKlxuICAgKiBhcnIuc2V0VmFsdWUoWydOYW5jeScsICdEcmV3J10pO1xuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFsnTmFuY3knLCAnRHJldyddXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgY29udHJvbHNcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHRcbiAgICogaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgb3ZlcnJpZGUgc2V0VmFsdWUodmFsdWU6IGFueVtdLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tBbGxWYWx1ZXNQcmVzZW50KHZhbHVlKTtcbiAgICB2YWx1ZS5mb3JFYWNoKChuZXdWYWx1ZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICB0aGlzLl90aHJvd0lmQ29udHJvbE1pc3NpbmcoaW5kZXgpO1xuICAgICAgdGhpcy5hdChpbmRleCkuc2V0VmFsdWUobmV3VmFsdWUsIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1BcnJheWAuIEl0IGFjY2VwdHMgYW4gYXJyYXkgdGhhdCBtYXRjaGVzIHRoZVxuICAgKiBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wsIGFuZCBkb2VzIGl0cyBiZXN0IHRvIG1hdGNoIHRoZSB2YWx1ZXMgdG8gdGhlIGNvcnJlY3RcbiAgICogY29udHJvbHMgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBJdCBhY2NlcHRzIGJvdGggc3VwZXItc2V0cyBhbmQgc3ViLXNldHMgb2YgdGhlIGFycmF5IHdpdGhvdXQgdGhyb3dpbmcgYW4gZXJyb3IuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBQYXRjaCB0aGUgdmFsdWVzIGZvciBjb250cm9scyBpbiBhIGZvcm0gYXJyYXlcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gW251bGwsIG51bGxdXG4gICAqXG4gICAqIGFyci5wYXRjaFZhbHVlKFsnTmFuY3knXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gWydOYW5jeScsIG51bGxdXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgbGF0ZXN0IHZhbHVlcyBmb3IgdGhlIGNvbnRyb2xzXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyZSBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlc1xuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0XG4gICAqIGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZVxuICAgKiBpcyB1cGRhdGVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0b1xuICAgKiB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5IHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICovXG4gIG92ZXJyaWRlIHBhdGNoVmFsdWUodmFsdWU6IGFueVtdLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgLy8gRXZlbiB0aG91Z2ggdGhlIGB2YWx1ZWAgYXJndW1lbnQgdHlwZSBkb2Vzbid0IGFsbG93IGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLCB0aGVcbiAgICAvLyBgcGF0Y2hWYWx1ZWAgY2FuIGJlIGNhbGxlZCByZWN1cnNpdmVseSBhbmQgaW5uZXIgZGF0YSBzdHJ1Y3R1cmVzIG1pZ2h0IGhhdmUgdGhlc2UgdmFsdWVzLCBzb1xuICAgIC8vIHdlIGp1c3QgaWdub3JlIHN1Y2ggY2FzZXMgd2hlbiBhIGZpZWxkIGNvbnRhaW5pbmcgRm9ybUFycmF5IGluc3RhbmNlIHJlY2VpdmVzIGBudWxsYCBvclxuICAgIC8vIGB1bmRlZmluZWRgIGFzIGEgdmFsdWUuXG4gICAgaWYgKHZhbHVlID09IG51bGwgLyogYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgICovKSByZXR1cm47XG5cbiAgICB2YWx1ZS5mb3JFYWNoKChuZXdWYWx1ZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAodGhpcy5hdChpbmRleCkpIHtcbiAgICAgICAgdGhpcy5hdChpbmRleCkucGF0Y2hWYWx1ZShuZXdWYWx1ZSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYEZvcm1BcnJheWAgYW5kIGFsbCBkZXNjZW5kYW50cyBhcmUgbWFya2VkIGBwcmlzdGluZWAgYW5kIGB1bnRvdWNoZWRgLCBhbmQgdGhlXG4gICAqIHZhbHVlIG9mIGFsbCBkZXNjZW5kYW50cyB0byBudWxsIG9yIG51bGwgbWFwcy5cbiAgICpcbiAgICogWW91IHJlc2V0IHRvIGEgc3BlY2lmaWMgZm9ybSBzdGF0ZSBieSBwYXNzaW5nIGluIGFuIGFycmF5IG9mIHN0YXRlc1xuICAgKiB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgY29udHJvbC4gVGhlIHN0YXRlIGlzIGEgc3RhbmRhbG9uZSB2YWx1ZVxuICAgKiBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHdpdGggYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkIHN0YXR1cy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFJlc2V0IHRoZSB2YWx1ZXMgaW4gYSBmb3JtIGFycmF5XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqIGFyci5yZXNldChbJ25hbWUnLCAnbGFzdCBuYW1lJ10pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgLy8gWyduYW1lJywgJ2xhc3QgbmFtZSddXG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIHZhbHVlcyBpbiBhIGZvcm0gYXJyYXkgYW5kIHRoZSBkaXNhYmxlZCBzdGF0dXMgZm9yIHRoZSBmaXJzdCBjb250cm9sXG4gICAqXG4gICAqIGBgYFxuICAgKiBhcnIucmVzZXQoW1xuICAgKiAgIHt2YWx1ZTogJ25hbWUnLCBkaXNhYmxlZDogdHJ1ZX0sXG4gICAqICAgJ2xhc3QnXG4gICAqIF0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgLy8gWydsYXN0J11cbiAgICogY29uc29sZS5sb2coYXJyLmF0KDApLnN0YXR1cyk7ICAvLyAnRElTQUJMRUQnXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgY29udHJvbHNcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHRcbiAgICogaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHJlc2V0LlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICovXG4gIG92ZXJyaWRlIHJlc2V0KHZhbHVlOiBhbnkgPSBbXSwgb3B0aW9uczoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBjb250cm9sLnJlc2V0KHZhbHVlW2luZGV4XSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG4gICAgdGhpcy5fdXBkYXRlUHJpc3RpbmUob3B0aW9ucyk7XG4gICAgdGhpcy5fdXBkYXRlVG91Y2hlZChvcHRpb25zKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGUgYXJyYXksIGluY2x1ZGluZyBhbnkgZGlzYWJsZWQgY29udHJvbHMuXG4gICAqXG4gICAqIFJlcG9ydHMgYWxsIHZhbHVlcyByZWdhcmRsZXNzIG9mIGRpc2FibGVkIHN0YXR1cy5cbiAgICogRm9yIGVuYWJsZWQgY29udHJvbHMgb25seSwgdGhlIGB2YWx1ZWAgcHJvcGVydHkgaXMgdGhlIGJlc3Qgd2F5IHRvIGdldCB0aGUgdmFsdWUgb2YgdGhlIGFycmF5LlxuICAgKi9cbiAgZ2V0UmF3VmFsdWUoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLm1hcCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICByZXR1cm4gY29udHJvbCBpbnN0YW5jZW9mIEZvcm1Db250cm9sID8gY29udHJvbC52YWx1ZSA6ICg8YW55PmNvbnRyb2wpLmdldFJhd1ZhbHVlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBjb250cm9scyBpbiB0aGUgYEZvcm1BcnJheWAuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmllcyB3aGV0aGVyIHRoaXMgRm9ybUFycmF5IGluc3RhbmNlIHNob3VsZCBlbWl0IGV2ZW50cyBhZnRlciBhbGxcbiAgICogICAgIGNvbnRyb2xzIGFyZSByZW1vdmVkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiBhbGwgY29udHJvbHNcbiAgICogaW4gdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2UgYXJlIHJlbW92ZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFJlbW92ZSBhbGwgZWxlbWVudHMgZnJvbSBhIEZvcm1BcnJheVxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAgICogICAgbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIF0pO1xuICAgKiBjb25zb2xlLmxvZyhhcnIubGVuZ3RoKTsgIC8vIDJcbiAgICpcbiAgICogYXJyLmNsZWFyKCk7XG4gICAqIGNvbnNvbGUubG9nKGFyci5sZW5ndGgpOyAgLy8gMFxuICAgKiBgYGBcbiAgICpcbiAgICogSXQncyBhIHNpbXBsZXIgYW5kIG1vcmUgZWZmaWNpZW50IGFsdGVybmF0aXZlIHRvIHJlbW92aW5nIGFsbCBlbGVtZW50cyBvbmUgYnkgb25lOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAgICogICAgbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIF0pO1xuICAgKlxuICAgKiB3aGlsZSAoYXJyLmxlbmd0aCkge1xuICAgKiAgICBhcnIucmVtb3ZlQXQoMCk7XG4gICAqIH1cbiAgICogYGBgXG4gICAqL1xuICBjbGVhcihvcHRpb25zOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzLmxlbmd0aCA8IDEpIHJldHVybjtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pKTtcbiAgICB0aGlzLmNvbnRyb2xzLnNwbGljZSgwKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX3N5bmNQZW5kaW5nQ29udHJvbHMoKTogYm9vbGVhbiB7XG4gICAgbGV0IHN1YnRyZWVVcGRhdGVkID0gdGhpcy5jb250cm9scy5yZWR1Y2UoKHVwZGF0ZWQ6IGJvb2xlYW4sIGNoaWxkOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIHJldHVybiBjaGlsZC5fc3luY1BlbmRpbmdDb250cm9scygpID8gdHJ1ZSA6IHVwZGF0ZWQ7XG4gICAgfSwgZmFsc2UpO1xuICAgIGlmIChzdWJ0cmVlVXBkYXRlZCkgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIHJldHVybiBzdWJ0cmVlVXBkYXRlZDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Rocm93SWZDb250cm9sTWlzc2luZyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNvbnRyb2xzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgICAgVGhlcmUgYXJlIG5vIGZvcm0gY29udHJvbHMgcmVnaXN0ZXJlZCB3aXRoIHRoaXMgYXJyYXkgeWV0LiBJZiB5b3UncmUgdXNpbmcgbmdNb2RlbCxcbiAgICAgICAgeW91IG1heSB3YW50IHRvIGNoZWNrIG5leHQgdGljayAoZS5nLiB1c2Ugc2V0VGltZW91dCkuXG4gICAgICBgKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmF0KGluZGV4KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBmb3JtIGNvbnRyb2wgYXQgaW5kZXggJHtpbmRleH1gKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF9mb3JFYWNoQ2hpbGQoY2I6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5jb250cm9scy5mb3JFYWNoKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGNiKGNvbnRyb2wsIGluZGV4KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX3VwZGF0ZVZhbHVlKCk6IHZvaWQge1xuICAgICh0aGlzIGFzIHt2YWx1ZTogYW55fSkudmFsdWUgPVxuICAgICAgICB0aGlzLmNvbnRyb2xzLmZpbHRlcigoY29udHJvbCkgPT4gY29udHJvbC5lbmFibGVkIHx8IHRoaXMuZGlzYWJsZWQpXG4gICAgICAgICAgICAubWFwKChjb250cm9sKSA9PiBjb250cm9sLnZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogRnVuY3Rpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9scy5zb21lKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wuZW5hYmxlZCAmJiBjb25kaXRpb24oY29udHJvbCkpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc2V0VXBDb250cm9scygpOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gdGhpcy5fcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NoZWNrQWxsVmFsdWVzUHJlc2VudCh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGk6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKHZhbHVlW2ldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdXN0IHN1cHBseSBhIHZhbHVlIGZvciBmb3JtIGNvbnRyb2wgYXQgaW5kZXg6ICR7aX0uYCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY29udHJvbCBvZiB0aGlzLmNvbnRyb2xzKSB7XG4gICAgICBpZiAoY29udHJvbC5lbmFibGVkKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLmxlbmd0aCA+IDAgfHwgdGhpcy5kaXNhYmxlZDtcbiAgfVxuXG4gIHByaXZhdGUgX3JlZ2lzdGVyQ29udHJvbChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICBjb250cm9sLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSh0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UpO1xuICB9XG59XG4iXX0=