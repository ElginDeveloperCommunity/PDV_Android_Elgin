import { AfterViewInit, ElementRef, Injector, OnDestroy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare class ValueAccessor implements ControlValueAccessor, AfterViewInit, OnDestroy {
    protected injector: Injector;
    protected el: ElementRef;
    private onChange;
    private onTouched;
    protected lastValue: any;
    private statusChanges?;
    constructor(injector: Injector, el: ElementRef);
    writeValue(value: any): void;
    handleChangeEvent(el: HTMLElement, value: any): void;
    _handleBlurEvent(el: any): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
}
export declare const setIonicClasses: (element: ElementRef<any>) => void;
