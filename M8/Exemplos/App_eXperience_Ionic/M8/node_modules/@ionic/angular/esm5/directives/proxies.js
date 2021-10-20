import * as tslib_1 from "tslib";
/* eslint-disable */
/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from "@angular/core";
import { ProxyCmp, proxyOutputs } from "./proxies-utils";
var IonApp = /** @class */ (function () {
    function IonApp(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonApp.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonApp = tslib_1.__decorate([
        Component({ selector: "ion-app", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
    ], IonApp);
    return IonApp;
}());
export { IonApp };
var IonAvatar = /** @class */ (function () {
    function IonAvatar(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonAvatar.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonAvatar = tslib_1.__decorate([
        Component({ selector: "ion-avatar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
    ], IonAvatar);
    return IonAvatar;
}());
export { IonAvatar };
var IonBackButton = /** @class */ (function () {
    function IonBackButton(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonBackButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonBackButton = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "defaultHref", "disabled", "icon", "mode", "routerAnimation", "text", "type"] }),
        Component({ selector: "ion-back-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "defaultHref", "disabled", "icon", "mode", "routerAnimation", "text", "type"] })
    ], IonBackButton);
    return IonBackButton;
}());
export { IonBackButton };
var IonBackdrop = /** @class */ (function () {
    function IonBackdrop(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionBackdropTap"]);
    }
    IonBackdrop.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonBackdrop = tslib_1.__decorate([
        ProxyCmp({ inputs: ["stopPropagation", "tappable", "visible"] }),
        Component({ selector: "ion-backdrop", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["stopPropagation", "tappable", "visible"] })
    ], IonBackdrop);
    return IonBackdrop;
}());
export { IonBackdrop };
var IonBadge = /** @class */ (function () {
    function IonBadge(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonBadge.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonBadge = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "mode"] }),
        Component({ selector: "ion-badge", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
    ], IonBadge);
    return IonBadge;
}());
export { IonBadge };
var IonButton = /** @class */ (function () {
    function IonButton(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionFocus", "ionBlur"]);
    }
    IonButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonButton = tslib_1.__decorate([
        ProxyCmp({ inputs: ["buttonType", "color", "disabled", "download", "expand", "fill", "href", "mode", "rel", "routerAnimation", "routerDirection", "shape", "size", "strong", "target", "type"] }),
        Component({ selector: "ion-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["buttonType", "color", "disabled", "download", "expand", "fill", "href", "mode", "rel", "routerAnimation", "routerDirection", "shape", "size", "strong", "target", "type"] })
    ], IonButton);
    return IonButton;
}());
export { IonButton };
var IonButtons = /** @class */ (function () {
    function IonButtons(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonButtons.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonButtons = tslib_1.__decorate([
        ProxyCmp({ inputs: ["collapse"] }),
        Component({ selector: "ion-buttons", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["collapse"] })
    ], IonButtons);
    return IonButtons;
}());
export { IonButtons };
var IonCard = /** @class */ (function () {
    function IonCard(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonCard.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonCard = tslib_1.__decorate([
        ProxyCmp({ inputs: ["button", "color", "disabled", "download", "href", "mode", "rel", "routerAnimation", "routerDirection", "target", "type"] }),
        Component({ selector: "ion-card", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["button", "color", "disabled", "download", "href", "mode", "rel", "routerAnimation", "routerDirection", "target", "type"] })
    ], IonCard);
    return IonCard;
}());
export { IonCard };
var IonCardContent = /** @class */ (function () {
    function IonCardContent(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonCardContent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonCardContent = tslib_1.__decorate([
        ProxyCmp({ inputs: ["mode"] }),
        Component({ selector: "ion-card-content", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["mode"] })
    ], IonCardContent);
    return IonCardContent;
}());
export { IonCardContent };
var IonCardHeader = /** @class */ (function () {
    function IonCardHeader(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonCardHeader.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonCardHeader = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "mode", "translucent"] }),
        Component({ selector: "ion-card-header", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode", "translucent"] })
    ], IonCardHeader);
    return IonCardHeader;
}());
export { IonCardHeader };
var IonCardSubtitle = /** @class */ (function () {
    function IonCardSubtitle(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonCardSubtitle.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonCardSubtitle = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "mode"] }),
        Component({ selector: "ion-card-subtitle", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
    ], IonCardSubtitle);
    return IonCardSubtitle;
}());
export { IonCardSubtitle };
var IonCardTitle = /** @class */ (function () {
    function IonCardTitle(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonCardTitle.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonCardTitle = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "mode"] }),
        Component({ selector: "ion-card-title", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
    ], IonCardTitle);
    return IonCardTitle;
}());
export { IonCardTitle };
var IonCheckbox = /** @class */ (function () {
    function IonCheckbox(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange", "ionFocus", "ionBlur"]);
    }
    IonCheckbox.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonCheckbox = tslib_1.__decorate([
        ProxyCmp({ inputs: ["checked", "color", "disabled", "indeterminate", "mode", "name", "value"] }),
        Component({ selector: "ion-checkbox", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["checked", "color", "disabled", "indeterminate", "mode", "name", "value"] })
    ], IonCheckbox);
    return IonCheckbox;
}());
export { IonCheckbox };
var IonChip = /** @class */ (function () {
    function IonChip(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonChip.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonChip = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "disabled", "mode", "outline"] }),
        Component({ selector: "ion-chip", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "disabled", "mode", "outline"] })
    ], IonChip);
    return IonChip;
}());
export { IonChip };
var IonCol = /** @class */ (function () {
    function IonCol(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonCol.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonCol = tslib_1.__decorate([
        ProxyCmp({ inputs: ["offset", "offsetLg", "offsetMd", "offsetSm", "offsetXl", "offsetXs", "pull", "pullLg", "pullMd", "pullSm", "pullXl", "pullXs", "push", "pushLg", "pushMd", "pushSm", "pushXl", "pushXs", "size", "sizeLg", "sizeMd", "sizeSm", "sizeXl", "sizeXs"] }),
        Component({ selector: "ion-col", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["offset", "offsetLg", "offsetMd", "offsetSm", "offsetXl", "offsetXs", "pull", "pullLg", "pullMd", "pullSm", "pullXl", "pullXs", "push", "pushLg", "pushMd", "pushSm", "pushXl", "pushXs", "size", "sizeLg", "sizeMd", "sizeSm", "sizeXl", "sizeXs"] })
    ], IonCol);
    return IonCol;
}());
export { IonCol };
var IonContent = /** @class */ (function () {
    function IonContent(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionScrollStart", "ionScroll", "ionScrollEnd"]);
    }
    IonContent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonContent = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "forceOverscroll", "fullscreen", "scrollEvents", "scrollX", "scrollY"], "methods": ["getScrollElement", "scrollToTop", "scrollToBottom", "scrollByPoint", "scrollToPoint"] }),
        Component({ selector: "ion-content", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "forceOverscroll", "fullscreen", "scrollEvents", "scrollX", "scrollY"] })
    ], IonContent);
    return IonContent;
}());
export { IonContent };
var IonDatetime = /** @class */ (function () {
    function IonDatetime(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionCancel", "ionChange", "ionFocus", "ionBlur"]);
    }
    IonDatetime.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonDatetime = tslib_1.__decorate([
        ProxyCmp({ inputs: ["cancelText", "dayNames", "dayShortNames", "dayValues", "disabled", "displayFormat", "displayTimezone", "doneText", "hourValues", "max", "min", "minuteValues", "mode", "monthNames", "monthShortNames", "monthValues", "name", "pickerFormat", "pickerOptions", "placeholder", "readonly", "value", "yearValues"], "methods": ["open"] }),
        Component({ selector: "ion-datetime", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["cancelText", "dayNames", "dayShortNames", "dayValues", "disabled", "displayFormat", "displayTimezone", "doneText", "hourValues", "max", "min", "minuteValues", "mode", "monthNames", "monthShortNames", "monthValues", "name", "pickerFormat", "pickerOptions", "placeholder", "readonly", "value", "yearValues"] })
    ], IonDatetime);
    return IonDatetime;
}());
export { IonDatetime };
var IonFab = /** @class */ (function () {
    function IonFab(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonFab.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonFab = tslib_1.__decorate([
        ProxyCmp({ inputs: ["activated", "edge", "horizontal", "vertical"], "methods": ["close"] }),
        Component({ selector: "ion-fab", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["activated", "edge", "horizontal", "vertical"] })
    ], IonFab);
    return IonFab;
}());
export { IonFab };
var IonFabButton = /** @class */ (function () {
    function IonFabButton(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionFocus", "ionBlur"]);
    }
    IonFabButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonFabButton = tslib_1.__decorate([
        ProxyCmp({ inputs: ["activated", "closeIcon", "color", "disabled", "download", "href", "mode", "rel", "routerAnimation", "routerDirection", "show", "size", "target", "translucent", "type"] }),
        Component({ selector: "ion-fab-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["activated", "closeIcon", "color", "disabled", "download", "href", "mode", "rel", "routerAnimation", "routerDirection", "show", "size", "target", "translucent", "type"] })
    ], IonFabButton);
    return IonFabButton;
}());
export { IonFabButton };
var IonFabList = /** @class */ (function () {
    function IonFabList(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonFabList.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonFabList = tslib_1.__decorate([
        ProxyCmp({ inputs: ["activated", "side"] }),
        Component({ selector: "ion-fab-list", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["activated", "side"] })
    ], IonFabList);
    return IonFabList;
}());
export { IonFabList };
var IonFooter = /** @class */ (function () {
    function IonFooter(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonFooter.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonFooter = tslib_1.__decorate([
        ProxyCmp({ inputs: ["mode", "translucent"] }),
        Component({ selector: "ion-footer", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["mode", "translucent"] })
    ], IonFooter);
    return IonFooter;
}());
export { IonFooter };
var IonGrid = /** @class */ (function () {
    function IonGrid(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonGrid.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonGrid = tslib_1.__decorate([
        ProxyCmp({ inputs: ["fixed"] }),
        Component({ selector: "ion-grid", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["fixed"] })
    ], IonGrid);
    return IonGrid;
}());
export { IonGrid };
var IonHeader = /** @class */ (function () {
    function IonHeader(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonHeader.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonHeader = tslib_1.__decorate([
        ProxyCmp({ inputs: ["collapse", "mode", "translucent"] }),
        Component({ selector: "ion-header", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["collapse", "mode", "translucent"] })
    ], IonHeader);
    return IonHeader;
}());
export { IonHeader };
var IonIcon = /** @class */ (function () {
    function IonIcon(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonIcon.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonIcon = tslib_1.__decorate([
        ProxyCmp({ inputs: ["ariaHidden", "ariaLabel", "color", "flipRtl", "icon", "ios", "lazy", "md", "mode", "name", "sanitize", "size", "src"] }),
        Component({ selector: "ion-icon", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["ariaHidden", "ariaLabel", "color", "flipRtl", "icon", "ios", "lazy", "md", "mode", "name", "sanitize", "size", "src"] })
    ], IonIcon);
    return IonIcon;
}());
export { IonIcon };
var IonImg = /** @class */ (function () {
    function IonImg(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionImgWillLoad", "ionImgDidLoad", "ionError"]);
    }
    IonImg.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonImg = tslib_1.__decorate([
        ProxyCmp({ inputs: ["alt", "src"] }),
        Component({ selector: "ion-img", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["alt", "src"] })
    ], IonImg);
    return IonImg;
}());
export { IonImg };
var IonInfiniteScroll = /** @class */ (function () {
    function IonInfiniteScroll(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionInfinite"]);
    }
    IonInfiniteScroll.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonInfiniteScroll = tslib_1.__decorate([
        ProxyCmp({ inputs: ["disabled", "position", "threshold"], "methods": ["complete"] }),
        Component({ selector: "ion-infinite-scroll", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled", "position", "threshold"] })
    ], IonInfiniteScroll);
    return IonInfiniteScroll;
}());
export { IonInfiniteScroll };
var IonInfiniteScrollContent = /** @class */ (function () {
    function IonInfiniteScrollContent(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonInfiniteScrollContent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonInfiniteScrollContent = tslib_1.__decorate([
        ProxyCmp({ inputs: ["loadingSpinner", "loadingText"] }),
        Component({ selector: "ion-infinite-scroll-content", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["loadingSpinner", "loadingText"] })
    ], IonInfiniteScrollContent);
    return IonInfiniteScrollContent;
}());
export { IonInfiniteScrollContent };
var IonInput = /** @class */ (function () {
    function IonInput(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionInput", "ionChange", "ionBlur", "ionFocus"]);
    }
    IonInput.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonInput = tslib_1.__decorate([
        ProxyCmp({ inputs: ["accept", "autocapitalize", "autocomplete", "autocorrect", "autofocus", "clearInput", "clearOnEdit", "color", "debounce", "disabled", "enterkeyhint", "inputmode", "max", "maxlength", "min", "minlength", "mode", "multiple", "name", "pattern", "placeholder", "readonly", "required", "size", "spellcheck", "step", "type", "value"], "methods": ["setFocus", "getInputElement"] }),
        Component({ selector: "ion-input", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["accept", "autocapitalize", "autocomplete", "autocorrect", "autofocus", "clearInput", "clearOnEdit", "color", "debounce", "disabled", "enterkeyhint", "inputmode", "max", "maxlength", "min", "minlength", "mode", "multiple", "name", "pattern", "placeholder", "readonly", "required", "size", "spellcheck", "step", "type", "value"] })
    ], IonInput);
    return IonInput;
}());
export { IonInput };
var IonItem = /** @class */ (function () {
    function IonItem(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonItem.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonItem = tslib_1.__decorate([
        ProxyCmp({ inputs: ["button", "color", "detail", "detailIcon", "disabled", "download", "href", "lines", "mode", "rel", "routerAnimation", "routerDirection", "target", "type"] }),
        Component({ selector: "ion-item", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["button", "color", "detail", "detailIcon", "disabled", "download", "href", "lines", "mode", "rel", "routerAnimation", "routerDirection", "target", "type"] })
    ], IonItem);
    return IonItem;
}());
export { IonItem };
var IonItemDivider = /** @class */ (function () {
    function IonItemDivider(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonItemDivider.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonItemDivider = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "mode", "sticky"] }),
        Component({ selector: "ion-item-divider", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode", "sticky"] })
    ], IonItemDivider);
    return IonItemDivider;
}());
export { IonItemDivider };
var IonItemGroup = /** @class */ (function () {
    function IonItemGroup(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonItemGroup.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonItemGroup = tslib_1.__decorate([
        Component({ selector: "ion-item-group", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
    ], IonItemGroup);
    return IonItemGroup;
}());
export { IonItemGroup };
var IonItemOption = /** @class */ (function () {
    function IonItemOption(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonItemOption.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonItemOption = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "disabled", "download", "expandable", "href", "mode", "rel", "target", "type"] }),
        Component({ selector: "ion-item-option", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "disabled", "download", "expandable", "href", "mode", "rel", "target", "type"] })
    ], IonItemOption);
    return IonItemOption;
}());
export { IonItemOption };
var IonItemOptions = /** @class */ (function () {
    function IonItemOptions(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionSwipe"]);
    }
    IonItemOptions.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonItemOptions = tslib_1.__decorate([
        ProxyCmp({ inputs: ["side"] }),
        Component({ selector: "ion-item-options", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["side"] })
    ], IonItemOptions);
    return IonItemOptions;
}());
export { IonItemOptions };
var IonItemSliding = /** @class */ (function () {
    function IonItemSliding(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionDrag"]);
    }
    IonItemSliding.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonItemSliding = tslib_1.__decorate([
        ProxyCmp({ inputs: ["disabled"], "methods": ["getOpenAmount", "getSlidingRatio", "open", "close", "closeOpened"] }),
        Component({ selector: "ion-item-sliding", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled"] })
    ], IonItemSliding);
    return IonItemSliding;
}());
export { IonItemSliding };
var IonLabel = /** @class */ (function () {
    function IonLabel(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonLabel.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonLabel = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "mode", "position"] }),
        Component({ selector: "ion-label", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode", "position"] })
    ], IonLabel);
    return IonLabel;
}());
export { IonLabel };
var IonList = /** @class */ (function () {
    function IonList(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonList.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonList = tslib_1.__decorate([
        ProxyCmp({ inputs: ["inset", "lines", "mode"], "methods": ["closeSlidingItems"] }),
        Component({ selector: "ion-list", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["inset", "lines", "mode"] })
    ], IonList);
    return IonList;
}());
export { IonList };
var IonListHeader = /** @class */ (function () {
    function IonListHeader(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonListHeader.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonListHeader = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "lines", "mode"] }),
        Component({ selector: "ion-list-header", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "lines", "mode"] })
    ], IonListHeader);
    return IonListHeader;
}());
export { IonListHeader };
var IonMenu = /** @class */ (function () {
    function IonMenu(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionWillOpen", "ionWillClose", "ionDidOpen", "ionDidClose"]);
    }
    IonMenu.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonMenu = tslib_1.__decorate([
        ProxyCmp({ inputs: ["contentId", "disabled", "maxEdgeStart", "menuId", "side", "swipeGesture", "type"], "methods": ["isOpen", "isActive", "open", "close", "toggle", "setOpen"] }),
        Component({ selector: "ion-menu", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["contentId", "disabled", "maxEdgeStart", "menuId", "side", "swipeGesture", "type"] })
    ], IonMenu);
    return IonMenu;
}());
export { IonMenu };
var IonMenuButton = /** @class */ (function () {
    function IonMenuButton(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonMenuButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonMenuButton = tslib_1.__decorate([
        ProxyCmp({ inputs: ["autoHide", "color", "disabled", "menu", "mode", "type"] }),
        Component({ selector: "ion-menu-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["autoHide", "color", "disabled", "menu", "mode", "type"] })
    ], IonMenuButton);
    return IonMenuButton;
}());
export { IonMenuButton };
var IonMenuToggle = /** @class */ (function () {
    function IonMenuToggle(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonMenuToggle.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonMenuToggle = tslib_1.__decorate([
        ProxyCmp({ inputs: ["autoHide", "menu"] }),
        Component({ selector: "ion-menu-toggle", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["autoHide", "menu"] })
    ], IonMenuToggle);
    return IonMenuToggle;
}());
export { IonMenuToggle };
var IonNav = /** @class */ (function () {
    function IonNav(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionNavWillChange", "ionNavDidChange"]);
    }
    IonNav.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonNav = tslib_1.__decorate([
        ProxyCmp({ inputs: ["animated", "animation", "root", "rootParams", "swipeGesture"], "methods": ["push", "insert", "insertPages", "pop", "popTo", "popToRoot", "removeIndex", "setRoot", "setPages", "getActive", "getByIndex", "canGoBack", "getPrevious"] }),
        Component({ selector: "ion-nav", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["animated", "animation", "root", "rootParams", "swipeGesture"] })
    ], IonNav);
    return IonNav;
}());
export { IonNav };
var IonNavLink = /** @class */ (function () {
    function IonNavLink(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonNavLink.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonNavLink = tslib_1.__decorate([
        ProxyCmp({ inputs: ["component", "componentProps", "routerAnimation", "routerDirection"] }),
        Component({ selector: "ion-nav-link", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["component", "componentProps", "routerAnimation", "routerDirection"] })
    ], IonNavLink);
    return IonNavLink;
}());
export { IonNavLink };
var IonNote = /** @class */ (function () {
    function IonNote(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonNote.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonNote = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "mode"] }),
        Component({ selector: "ion-note", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
    ], IonNote);
    return IonNote;
}());
export { IonNote };
var IonProgressBar = /** @class */ (function () {
    function IonProgressBar(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonProgressBar.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonProgressBar = tslib_1.__decorate([
        ProxyCmp({ inputs: ["buffer", "color", "mode", "reversed", "type", "value"] }),
        Component({ selector: "ion-progress-bar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["buffer", "color", "mode", "reversed", "type", "value"] })
    ], IonProgressBar);
    return IonProgressBar;
}());
export { IonProgressBar };
var IonRadio = /** @class */ (function () {
    function IonRadio(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionFocus", "ionBlur"]);
    }
    IonRadio.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonRadio = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "disabled", "mode", "name", "value"] }),
        Component({ selector: "ion-radio", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "disabled", "mode", "name", "value"] })
    ], IonRadio);
    return IonRadio;
}());
export { IonRadio };
var IonRadioGroup = /** @class */ (function () {
    function IonRadioGroup(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange"]);
    }
    IonRadioGroup.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonRadioGroup = tslib_1.__decorate([
        ProxyCmp({ inputs: ["allowEmptySelection", "name", "value"] }),
        Component({ selector: "ion-radio-group", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["allowEmptySelection", "name", "value"] })
    ], IonRadioGroup);
    return IonRadioGroup;
}());
export { IonRadioGroup };
var IonRange = /** @class */ (function () {
    function IonRange(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange", "ionFocus", "ionBlur"]);
    }
    IonRange.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonRange = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "debounce", "disabled", "dualKnobs", "max", "min", "mode", "name", "pin", "snaps", "step", "ticks", "value"] }),
        Component({ selector: "ion-range", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "debounce", "disabled", "dualKnobs", "max", "min", "mode", "name", "pin", "snaps", "step", "ticks", "value"] })
    ], IonRange);
    return IonRange;
}());
export { IonRange };
var IonRefresher = /** @class */ (function () {
    function IonRefresher(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionRefresh", "ionPull", "ionStart"]);
    }
    IonRefresher.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonRefresher = tslib_1.__decorate([
        ProxyCmp({ inputs: ["closeDuration", "disabled", "pullFactor", "pullMax", "pullMin", "snapbackDuration"], "methods": ["complete", "cancel", "getProgress"] }),
        Component({ selector: "ion-refresher", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["closeDuration", "disabled", "pullFactor", "pullMax", "pullMin", "snapbackDuration"] })
    ], IonRefresher);
    return IonRefresher;
}());
export { IonRefresher };
var IonRefresherContent = /** @class */ (function () {
    function IonRefresherContent(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonRefresherContent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonRefresherContent = tslib_1.__decorate([
        ProxyCmp({ inputs: ["pullingIcon", "pullingText", "refreshingSpinner", "refreshingText"] }),
        Component({ selector: "ion-refresher-content", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["pullingIcon", "pullingText", "refreshingSpinner", "refreshingText"] })
    ], IonRefresherContent);
    return IonRefresherContent;
}());
export { IonRefresherContent };
var IonReorder = /** @class */ (function () {
    function IonReorder(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonReorder.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonReorder = tslib_1.__decorate([
        Component({ selector: "ion-reorder", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
    ], IonReorder);
    return IonReorder;
}());
export { IonReorder };
var IonReorderGroup = /** @class */ (function () {
    function IonReorderGroup(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionItemReorder"]);
    }
    IonReorderGroup.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonReorderGroup = tslib_1.__decorate([
        ProxyCmp({ inputs: ["disabled"], "methods": ["complete"] }),
        Component({ selector: "ion-reorder-group", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled"] })
    ], IonReorderGroup);
    return IonReorderGroup;
}());
export { IonReorderGroup };
var IonRippleEffect = /** @class */ (function () {
    function IonRippleEffect(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonRippleEffect.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonRippleEffect = tslib_1.__decorate([
        ProxyCmp({ inputs: ["type"], "methods": ["addRipple"] }),
        Component({ selector: "ion-ripple-effect", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["type"] })
    ], IonRippleEffect);
    return IonRippleEffect;
}());
export { IonRippleEffect };
var IonRow = /** @class */ (function () {
    function IonRow(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonRow.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonRow = tslib_1.__decorate([
        Component({ selector: "ion-row", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
    ], IonRow);
    return IonRow;
}());
export { IonRow };
var IonSearchbar = /** @class */ (function () {
    function IonSearchbar(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionInput", "ionChange", "ionCancel", "ionClear", "ionBlur", "ionFocus"]);
    }
    IonSearchbar.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonSearchbar = tslib_1.__decorate([
        ProxyCmp({ inputs: ["animated", "autocomplete", "autocorrect", "cancelButtonIcon", "cancelButtonText", "clearIcon", "color", "debounce", "disabled", "enterkeyhint", "inputmode", "mode", "placeholder", "searchIcon", "showCancelButton", "showClearButton", "spellcheck", "type", "value"], "methods": ["setFocus", "getInputElement"] }),
        Component({ selector: "ion-searchbar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["animated", "autocomplete", "autocorrect", "cancelButtonIcon", "cancelButtonText", "clearIcon", "color", "debounce", "disabled", "enterkeyhint", "inputmode", "mode", "placeholder", "searchIcon", "showCancelButton", "showClearButton", "spellcheck", "type", "value"] })
    ], IonSearchbar);
    return IonSearchbar;
}());
export { IonSearchbar };
var IonSegment = /** @class */ (function () {
    function IonSegment(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange"]);
    }
    IonSegment.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonSegment = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "disabled", "mode", "scrollable", "swipeGesture", "value"] }),
        Component({ selector: "ion-segment", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "disabled", "mode", "scrollable", "swipeGesture", "value"] })
    ], IonSegment);
    return IonSegment;
}());
export { IonSegment };
var IonSegmentButton = /** @class */ (function () {
    function IonSegmentButton(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonSegmentButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonSegmentButton = tslib_1.__decorate([
        ProxyCmp({ inputs: ["disabled", "layout", "mode", "type", "value"] }),
        Component({ selector: "ion-segment-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled", "layout", "mode", "type", "value"] })
    ], IonSegmentButton);
    return IonSegmentButton;
}());
export { IonSegmentButton };
var IonSelect = /** @class */ (function () {
    function IonSelect(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange", "ionCancel", "ionFocus", "ionBlur"]);
    }
    IonSelect.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonSelect = tslib_1.__decorate([
        ProxyCmp({ inputs: ["cancelText", "compareWith", "disabled", "interface", "interfaceOptions", "mode", "multiple", "name", "okText", "placeholder", "selectedText", "value"], "methods": ["open"] }),
        Component({ selector: "ion-select", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["cancelText", "compareWith", "disabled", "interface", "interfaceOptions", "mode", "multiple", "name", "okText", "placeholder", "selectedText", "value"] })
    ], IonSelect);
    return IonSelect;
}());
export { IonSelect };
var IonSelectOption = /** @class */ (function () {
    function IonSelectOption(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonSelectOption.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonSelectOption = tslib_1.__decorate([
        ProxyCmp({ inputs: ["disabled", "value"] }),
        Component({ selector: "ion-select-option", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled", "value"] })
    ], IonSelectOption);
    return IonSelectOption;
}());
export { IonSelectOption };
var IonSkeletonText = /** @class */ (function () {
    function IonSkeletonText(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonSkeletonText.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonSkeletonText = tslib_1.__decorate([
        ProxyCmp({ inputs: ["animated"] }),
        Component({ selector: "ion-skeleton-text", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["animated"] })
    ], IonSkeletonText);
    return IonSkeletonText;
}());
export { IonSkeletonText };
var IonSlide = /** @class */ (function () {
    function IonSlide(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonSlide.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonSlide = tslib_1.__decorate([
        Component({ selector: "ion-slide", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
    ], IonSlide);
    return IonSlide;
}());
export { IonSlide };
var IonSlides = /** @class */ (function () {
    function IonSlides(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionSlidesDidLoad", "ionSlideTap", "ionSlideDoubleTap", "ionSlideWillChange", "ionSlideDidChange", "ionSlideNextStart", "ionSlidePrevStart", "ionSlideNextEnd", "ionSlidePrevEnd", "ionSlideTransitionStart", "ionSlideTransitionEnd", "ionSlideDrag", "ionSlideReachStart", "ionSlideReachEnd", "ionSlideTouchStart", "ionSlideTouchEnd"]);
    }
    IonSlides.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonSlides = tslib_1.__decorate([
        ProxyCmp({ inputs: ["mode", "options", "pager", "scrollbar"], "methods": ["update", "updateAutoHeight", "slideTo", "slideNext", "slidePrev", "getActiveIndex", "getPreviousIndex", "length", "isEnd", "isBeginning", "startAutoplay", "stopAutoplay", "lockSwipeToNext", "lockSwipeToPrev", "lockSwipes", "getSwiper"] }),
        Component({ selector: "ion-slides", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["mode", "options", "pager", "scrollbar"] })
    ], IonSlides);
    return IonSlides;
}());
export { IonSlides };
var IonSpinner = /** @class */ (function () {
    function IonSpinner(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonSpinner.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonSpinner = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "duration", "name", "paused"] }),
        Component({ selector: "ion-spinner", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "duration", "name", "paused"] })
    ], IonSpinner);
    return IonSpinner;
}());
export { IonSpinner };
var IonSplitPane = /** @class */ (function () {
    function IonSplitPane(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionSplitPaneVisible"]);
    }
    IonSplitPane.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonSplitPane = tslib_1.__decorate([
        ProxyCmp({ inputs: ["contentId", "disabled", "when"] }),
        Component({ selector: "ion-split-pane", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["contentId", "disabled", "when"] })
    ], IonSplitPane);
    return IonSplitPane;
}());
export { IonSplitPane };
var IonTabBar = /** @class */ (function () {
    function IonTabBar(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonTabBar.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonTabBar = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "mode", "selectedTab", "translucent"] }),
        Component({ selector: "ion-tab-bar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode", "selectedTab", "translucent"] })
    ], IonTabBar);
    return IonTabBar;
}());
export { IonTabBar };
var IonTabButton = /** @class */ (function () {
    function IonTabButton(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonTabButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonTabButton = tslib_1.__decorate([
        ProxyCmp({ inputs: ["disabled", "download", "href", "layout", "mode", "rel", "selected", "tab", "target"] }),
        Component({ selector: "ion-tab-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled", "download", "href", "layout", "mode", "rel", "selected", "tab", "target"] })
    ], IonTabButton);
    return IonTabButton;
}());
export { IonTabButton };
var IonText = /** @class */ (function () {
    function IonText(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonText.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonText = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "mode"] }),
        Component({ selector: "ion-text", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
    ], IonText);
    return IonText;
}());
export { IonText };
var IonTextarea = /** @class */ (function () {
    function IonTextarea(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange", "ionInput", "ionBlur", "ionFocus"]);
    }
    IonTextarea.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonTextarea = tslib_1.__decorate([
        ProxyCmp({ inputs: ["autoGrow", "autocapitalize", "autofocus", "clearOnEdit", "color", "cols", "debounce", "disabled", "enterkeyhint", "inputmode", "maxlength", "minlength", "mode", "name", "placeholder", "readonly", "required", "rows", "spellcheck", "value", "wrap"], "methods": ["setFocus", "getInputElement"] }),
        Component({ selector: "ion-textarea", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["autoGrow", "autocapitalize", "autofocus", "clearOnEdit", "color", "cols", "debounce", "disabled", "enterkeyhint", "inputmode", "maxlength", "minlength", "mode", "name", "placeholder", "readonly", "required", "rows", "spellcheck", "value", "wrap"] })
    ], IonTextarea);
    return IonTextarea;
}());
export { IonTextarea };
var IonThumbnail = /** @class */ (function () {
    function IonThumbnail(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonThumbnail.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonThumbnail = tslib_1.__decorate([
        Component({ selector: "ion-thumbnail", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
    ], IonThumbnail);
    return IonThumbnail;
}());
export { IonThumbnail };
var IonTitle = /** @class */ (function () {
    function IonTitle(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonTitle.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonTitle = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "size"] }),
        Component({ selector: "ion-title", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "size"] })
    ], IonTitle);
    return IonTitle;
}());
export { IonTitle };
var IonToggle = /** @class */ (function () {
    function IonToggle(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange", "ionFocus", "ionBlur"]);
    }
    IonToggle.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonToggle = tslib_1.__decorate([
        ProxyCmp({ inputs: ["checked", "color", "disabled", "mode", "name", "value"] }),
        Component({ selector: "ion-toggle", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["checked", "color", "disabled", "mode", "name", "value"] })
    ], IonToggle);
    return IonToggle;
}());
export { IonToggle };
var IonToolbar = /** @class */ (function () {
    function IonToolbar(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
    IonToolbar.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    IonToolbar = tslib_1.__decorate([
        ProxyCmp({ inputs: ["color", "mode"] }),
        Component({ selector: "ion-toolbar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
    ], IonToolbar);
    return IonToolbar;
}());
export { IonToolbar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveGllcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9wcm94aWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7QUFDcEIsb0JBQW9CO0FBQ3BCLDhDQUE4QztBQUM5QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hILE9BQU8sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFLekQ7SUFFRSxnQkFBWSxDQUFvQixFQUFFLENBQWEsRUFBWSxDQUFTO1FBQVQsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUNsRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDWCxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUM7SUFDNUIsQ0FBQzs7Z0JBSGMsaUJBQWlCO2dCQUFLLFVBQVU7Z0JBQWUsTUFBTTs7SUFGekQsTUFBTTtRQURsQixTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLDJCQUEyQixFQUFFLENBQUM7T0FDOUcsTUFBTSxDQU1sQjtJQUFELGFBQUM7Q0FBQSxBQU5ELElBTUM7U0FOWSxNQUFNO0FBVW5CO0lBRUUsbUJBQVksQ0FBb0IsRUFBRSxDQUFhLEVBQVksQ0FBUztRQUFULE1BQUMsR0FBRCxDQUFDLENBQVE7UUFDbEUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ1gsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7O2dCQUhjLGlCQUFpQjtnQkFBSyxVQUFVO2dCQUFlLE1BQU07O0lBRnpELFNBQVM7UUFEckIsU0FBUyxDQUFDLEVBQUUsUUFBUSxF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RSwyQkFBMkIsRUFBRSxNQUFNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUM7T0FDcEwsU0FBUyxDQVVyQjtJQUFELGdCQUFDO0NBQUEsQUFWRCxJQVVDO1NBVlksU0FBUztBQWV0QjtJQUVFLG9CQUFZLENBQW9CLEVBQUUsQ0FBYSxFQUFZLENBQVM7UUFBVCxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQ2xFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNYLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQztJQUM1QixDQUFDOztnQkFIYyxpQkFBaUI7Z0JBQUssVUFBVTtnQkFBZSxNQUFNOztJQUZ6RCxVQUFVO1FBRnRCLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3ZDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUM7T0FDN0ksVUFBVSxDQU10QjtJQUFELGlCQUFDO0NBQUEsQUFORCxJQU1DO1NBTlksVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlICovXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuLyogYXV0by1nZW5lcmF0ZWQgYW5ndWxhciBkaXJlY3RpdmUgcHJveGllcyAqL1xuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgTmdab25lIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFByb3h5Q21wLCBwcm94eU91dHB1dHMgfSBmcm9tIFwiLi9wcm94aWVzLXV0aWxzXCI7XG5pbXBvcnQgeyBDb21wb25lbnRzIH0gZnJvbSBcIkBpb25pYy9jb3JlXCI7XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uQXBwIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25BcHAge1xufVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1hcHBcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiB9KVxuZXhwb3J0IGNsYXNzIElvbkFwcCB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uQXZhdGFyIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25BdmF0YXIge1xufVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1hdmF0YXJcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiB9KVxuZXhwb3J0IGNsYXNzIElvbkF2YXRhciB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uQmFja0J1dHRvbiBleHRlbmRzIENvbXBvbmVudHMuSW9uQmFja0J1dHRvbiB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwiZGVmYXVsdEhyZWZcIiwgXCJkaXNhYmxlZFwiLCBcImljb25cIiwgXCJtb2RlXCIsIFwicm91dGVyQW5pbWF0aW9uXCIsIFwidGV4dFwiLCBcInR5cGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tYmFjay1idXR0b25cIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcImRlZmF1bHRIcmVmXCIsIFwiZGlzYWJsZWRcIiwgXCJpY29uXCIsIFwibW9kZVwiLCBcInJvdXRlckFuaW1hdGlvblwiLCBcInRleHRcIiwgXCJ0eXBlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uQmFja0J1dHRvbiB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uQmFja2Ryb3AgZXh0ZW5kcyBDb21wb25lbnRzLklvbkJhY2tkcm9wIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wic3RvcFByb3BhZ2F0aW9uXCIsIFwidGFwcGFibGVcIiwgXCJ2aXNpYmxlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWJhY2tkcm9wXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wic3RvcFByb3BhZ2F0aW9uXCIsIFwidGFwcGFibGVcIiwgXCJ2aXNpYmxlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uQmFja2Ryb3Age1xuICBpb25CYWNrZHJvcFRhcCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25CYWNrZHJvcFRhcFwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25CYWRnZSBleHRlbmRzIENvbXBvbmVudHMuSW9uQmFkZ2Uge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tYmFkZ2VcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25CYWRnZSB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25CdXR0b24ge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJidXR0b25UeXBlXCIsIFwiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcImRvd25sb2FkXCIsIFwiZXhwYW5kXCIsIFwiZmlsbFwiLCBcImhyZWZcIiwgXCJtb2RlXCIsIFwicmVsXCIsIFwicm91dGVyQW5pbWF0aW9uXCIsIFwicm91dGVyRGlyZWN0aW9uXCIsIFwic2hhcGVcIiwgXCJzaXplXCIsIFwic3Ryb25nXCIsIFwidGFyZ2V0XCIsIFwidHlwZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1idXR0b25cIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJidXR0b25UeXBlXCIsIFwiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcImRvd25sb2FkXCIsIFwiZXhwYW5kXCIsIFwiZmlsbFwiLCBcImhyZWZcIiwgXCJtb2RlXCIsIFwicmVsXCIsIFwicm91dGVyQW5pbWF0aW9uXCIsIFwicm91dGVyRGlyZWN0aW9uXCIsIFwic2hhcGVcIiwgXCJzaXplXCIsIFwic3Ryb25nXCIsIFwidGFyZ2V0XCIsIFwidHlwZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkJ1dHRvbiB7XG4gIGlvbkZvY3VzITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uQmx1ciE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25Gb2N1c1wiLCBcImlvbkJsdXJcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uQnV0dG9ucyBleHRlbmRzIENvbXBvbmVudHMuSW9uQnV0dG9ucyB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbGxhcHNlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWJ1dHRvbnNcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xsYXBzZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkJ1dHRvbnMge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkNhcmQgZXh0ZW5kcyBDb21wb25lbnRzLklvbkNhcmQge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJidXR0b25cIiwgXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwiZG93bmxvYWRcIiwgXCJocmVmXCIsIFwibW9kZVwiLCBcInJlbFwiLCBcInJvdXRlckFuaW1hdGlvblwiLCBcInJvdXRlckRpcmVjdGlvblwiLCBcInRhcmdldFwiLCBcInR5cGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tY2FyZFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImJ1dHRvblwiLCBcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJkb3dubG9hZFwiLCBcImhyZWZcIiwgXCJtb2RlXCIsIFwicmVsXCIsIFwicm91dGVyQW5pbWF0aW9uXCIsIFwicm91dGVyRGlyZWN0aW9uXCIsIFwidGFyZ2V0XCIsIFwidHlwZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkNhcmQge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkNhcmRDb250ZW50IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25DYXJkQ29udGVudCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcIm1vZGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tY2FyZC1jb250ZW50XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wibW9kZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkNhcmRDb250ZW50IHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25DYXJkSGVhZGVyIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25DYXJkSGVhZGVyIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCIsIFwidHJhbnNsdWNlbnRcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tY2FyZC1oZWFkZXJcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIiwgXCJ0cmFuc2x1Y2VudFwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkNhcmRIZWFkZXIge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkNhcmRTdWJ0aXRsZSBleHRlbmRzIENvbXBvbmVudHMuSW9uQ2FyZFN1YnRpdGxlIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWNhcmQtc3VidGl0bGVcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25DYXJkU3VidGl0bGUge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkNhcmRUaXRsZSBleHRlbmRzIENvbXBvbmVudHMuSW9uQ2FyZFRpdGxlIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWNhcmQtdGl0bGVcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25DYXJkVGl0bGUge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkNoZWNrYm94IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25DaGVja2JveCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNoZWNrZWRcIiwgXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwiaW5kZXRlcm1pbmF0ZVwiLCBcIm1vZGVcIiwgXCJuYW1lXCIsIFwidmFsdWVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tY2hlY2tib3hcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjaGVja2VkXCIsIFwiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcImluZGV0ZXJtaW5hdGVcIiwgXCJtb2RlXCIsIFwibmFtZVwiLCBcInZhbHVlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uQ2hlY2tib3gge1xuICBpb25DaGFuZ2UhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25Gb2N1cyE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkJsdXIhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uQ2hhbmdlXCIsIFwiaW9uRm9jdXNcIiwgXCJpb25CbHVyXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkNoaXAgZXh0ZW5kcyBDb21wb25lbnRzLklvbkNoaXAge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwibW9kZVwiLCBcIm91dGxpbmVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tY2hpcFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJtb2RlXCIsIFwib3V0bGluZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkNoaXAge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkNvbCBleHRlbmRzIENvbXBvbmVudHMuSW9uQ29sIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wib2Zmc2V0XCIsIFwib2Zmc2V0TGdcIiwgXCJvZmZzZXRNZFwiLCBcIm9mZnNldFNtXCIsIFwib2Zmc2V0WGxcIiwgXCJvZmZzZXRYc1wiLCBcInB1bGxcIiwgXCJwdWxsTGdcIiwgXCJwdWxsTWRcIiwgXCJwdWxsU21cIiwgXCJwdWxsWGxcIiwgXCJwdWxsWHNcIiwgXCJwdXNoXCIsIFwicHVzaExnXCIsIFwicHVzaE1kXCIsIFwicHVzaFNtXCIsIFwicHVzaFhsXCIsIFwicHVzaFhzXCIsIFwic2l6ZVwiLCBcInNpemVMZ1wiLCBcInNpemVNZFwiLCBcInNpemVTbVwiLCBcInNpemVYbFwiLCBcInNpemVYc1wiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1jb2xcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJvZmZzZXRcIiwgXCJvZmZzZXRMZ1wiLCBcIm9mZnNldE1kXCIsIFwib2Zmc2V0U21cIiwgXCJvZmZzZXRYbFwiLCBcIm9mZnNldFhzXCIsIFwicHVsbFwiLCBcInB1bGxMZ1wiLCBcInB1bGxNZFwiLCBcInB1bGxTbVwiLCBcInB1bGxYbFwiLCBcInB1bGxYc1wiLCBcInB1c2hcIiwgXCJwdXNoTGdcIiwgXCJwdXNoTWRcIiwgXCJwdXNoU21cIiwgXCJwdXNoWGxcIiwgXCJwdXNoWHNcIiwgXCJzaXplXCIsIFwic2l6ZUxnXCIsIFwic2l6ZU1kXCIsIFwic2l6ZVNtXCIsIFwic2l6ZVhsXCIsIFwic2l6ZVhzXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uQ29sIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25Db250ZW50IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25Db250ZW50IHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJmb3JjZU92ZXJzY3JvbGxcIiwgXCJmdWxsc2NyZWVuXCIsIFwic2Nyb2xsRXZlbnRzXCIsIFwic2Nyb2xsWFwiLCBcInNjcm9sbFlcIl0sIFwibWV0aG9kc1wiOiBbXCJnZXRTY3JvbGxFbGVtZW50XCIsIFwic2Nyb2xsVG9Ub3BcIiwgXCJzY3JvbGxUb0JvdHRvbVwiLCBcInNjcm9sbEJ5UG9pbnRcIiwgXCJzY3JvbGxUb1BvaW50XCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWNvbnRlbnRcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcImZvcmNlT3ZlcnNjcm9sbFwiLCBcImZ1bGxzY3JlZW5cIiwgXCJzY3JvbGxFdmVudHNcIiwgXCJzY3JvbGxYXCIsIFwic2Nyb2xsWVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkNvbnRlbnQge1xuICBpb25TY3JvbGxTdGFydCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblNjcm9sbCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblNjcm9sbEVuZCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25TY3JvbGxTdGFydFwiLCBcImlvblNjcm9sbFwiLCBcImlvblNjcm9sbEVuZFwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25EYXRldGltZSBleHRlbmRzIENvbXBvbmVudHMuSW9uRGF0ZXRpbWUge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjYW5jZWxUZXh0XCIsIFwiZGF5TmFtZXNcIiwgXCJkYXlTaG9ydE5hbWVzXCIsIFwiZGF5VmFsdWVzXCIsIFwiZGlzYWJsZWRcIiwgXCJkaXNwbGF5Rm9ybWF0XCIsIFwiZGlzcGxheVRpbWV6b25lXCIsIFwiZG9uZVRleHRcIiwgXCJob3VyVmFsdWVzXCIsIFwibWF4XCIsIFwibWluXCIsIFwibWludXRlVmFsdWVzXCIsIFwibW9kZVwiLCBcIm1vbnRoTmFtZXNcIiwgXCJtb250aFNob3J0TmFtZXNcIiwgXCJtb250aFZhbHVlc1wiLCBcIm5hbWVcIiwgXCJwaWNrZXJGb3JtYXRcIiwgXCJwaWNrZXJPcHRpb25zXCIsIFwicGxhY2Vob2xkZXJcIiwgXCJyZWFkb25seVwiLCBcInZhbHVlXCIsIFwieWVhclZhbHVlc1wiXSwgXCJtZXRob2RzXCI6IFtcIm9wZW5cIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tZGF0ZXRpbWVcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjYW5jZWxUZXh0XCIsIFwiZGF5TmFtZXNcIiwgXCJkYXlTaG9ydE5hbWVzXCIsIFwiZGF5VmFsdWVzXCIsIFwiZGlzYWJsZWRcIiwgXCJkaXNwbGF5Rm9ybWF0XCIsIFwiZGlzcGxheVRpbWV6b25lXCIsIFwiZG9uZVRleHRcIiwgXCJob3VyVmFsdWVzXCIsIFwibWF4XCIsIFwibWluXCIsIFwibWludXRlVmFsdWVzXCIsIFwibW9kZVwiLCBcIm1vbnRoTmFtZXNcIiwgXCJtb250aFNob3J0TmFtZXNcIiwgXCJtb250aFZhbHVlc1wiLCBcIm5hbWVcIiwgXCJwaWNrZXJGb3JtYXRcIiwgXCJwaWNrZXJPcHRpb25zXCIsIFwicGxhY2Vob2xkZXJcIiwgXCJyZWFkb25seVwiLCBcInZhbHVlXCIsIFwieWVhclZhbHVlc1wiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkRhdGV0aW1lIHtcbiAgaW9uQ2FuY2VsITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uQ2hhbmdlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uRm9jdXMhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25CbHVyITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbkNhbmNlbFwiLCBcImlvbkNoYW5nZVwiLCBcImlvbkZvY3VzXCIsIFwiaW9uQmx1clwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25GYWIgZXh0ZW5kcyBDb21wb25lbnRzLklvbkZhYiB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImFjdGl2YXRlZFwiLCBcImVkZ2VcIiwgXCJob3Jpem9udGFsXCIsIFwidmVydGljYWxcIl0sIFwibWV0aG9kc1wiOiBbXCJjbG9zZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1mYWJcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJhY3RpdmF0ZWRcIiwgXCJlZGdlXCIsIFwiaG9yaXpvbnRhbFwiLCBcInZlcnRpY2FsXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uRmFiIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25GYWJCdXR0b24gZXh0ZW5kcyBDb21wb25lbnRzLklvbkZhYkJ1dHRvbiB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImFjdGl2YXRlZFwiLCBcImNsb3NlSWNvblwiLCBcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJkb3dubG9hZFwiLCBcImhyZWZcIiwgXCJtb2RlXCIsIFwicmVsXCIsIFwicm91dGVyQW5pbWF0aW9uXCIsIFwicm91dGVyRGlyZWN0aW9uXCIsIFwic2hvd1wiLCBcInNpemVcIiwgXCJ0YXJnZXRcIiwgXCJ0cmFuc2x1Y2VudFwiLCBcInR5cGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tZmFiLWJ1dHRvblwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImFjdGl2YXRlZFwiLCBcImNsb3NlSWNvblwiLCBcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJkb3dubG9hZFwiLCBcImhyZWZcIiwgXCJtb2RlXCIsIFwicmVsXCIsIFwicm91dGVyQW5pbWF0aW9uXCIsIFwicm91dGVyRGlyZWN0aW9uXCIsIFwic2hvd1wiLCBcInNpemVcIiwgXCJ0YXJnZXRcIiwgXCJ0cmFuc2x1Y2VudFwiLCBcInR5cGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25GYWJCdXR0b24ge1xuICBpb25Gb2N1cyE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkJsdXIhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uRm9jdXNcIiwgXCJpb25CbHVyXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkZhYkxpc3QgZXh0ZW5kcyBDb21wb25lbnRzLklvbkZhYkxpc3Qge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJhY3RpdmF0ZWRcIiwgXCJzaWRlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWZhYi1saXN0XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYWN0aXZhdGVkXCIsIFwic2lkZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkZhYkxpc3Qge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkZvb3RlciBleHRlbmRzIENvbXBvbmVudHMuSW9uRm9vdGVyIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wibW9kZVwiLCBcInRyYW5zbHVjZW50XCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWZvb3RlclwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcIm1vZGVcIiwgXCJ0cmFuc2x1Y2VudFwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkZvb3RlciB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uR3JpZCBleHRlbmRzIENvbXBvbmVudHMuSW9uR3JpZCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImZpeGVkXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWdyaWRcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJmaXhlZFwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkdyaWQge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkhlYWRlciBleHRlbmRzIENvbXBvbmVudHMuSW9uSGVhZGVyIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sbGFwc2VcIiwgXCJtb2RlXCIsIFwidHJhbnNsdWNlbnRcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24taGVhZGVyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sbGFwc2VcIiwgXCJtb2RlXCIsIFwidHJhbnNsdWNlbnRcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25IZWFkZXIge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkljb24gZXh0ZW5kcyBDb21wb25lbnRzLklvbkljb24ge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJhcmlhSGlkZGVuXCIsIFwiYXJpYUxhYmVsXCIsIFwiY29sb3JcIiwgXCJmbGlwUnRsXCIsIFwiaWNvblwiLCBcImlvc1wiLCBcImxhenlcIiwgXCJtZFwiLCBcIm1vZGVcIiwgXCJuYW1lXCIsIFwic2FuaXRpemVcIiwgXCJzaXplXCIsIFwic3JjXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWljb25cIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJhcmlhSGlkZGVuXCIsIFwiYXJpYUxhYmVsXCIsIFwiY29sb3JcIiwgXCJmbGlwUnRsXCIsIFwiaWNvblwiLCBcImlvc1wiLCBcImxhenlcIiwgXCJtZFwiLCBcIm1vZGVcIiwgXCJuYW1lXCIsIFwic2FuaXRpemVcIiwgXCJzaXplXCIsIFwic3JjXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uSWNvbiB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uSW1nIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25JbWcge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJhbHRcIiwgXCJzcmNcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24taW1nXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYWx0XCIsIFwic3JjXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uSW1nIHtcbiAgaW9uSW1nV2lsbExvYWQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25JbWdEaWRMb2FkITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uRXJyb3IhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uSW1nV2lsbExvYWRcIiwgXCJpb25JbWdEaWRMb2FkXCIsIFwiaW9uRXJyb3JcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uSW5maW5pdGVTY3JvbGwgZXh0ZW5kcyBDb21wb25lbnRzLklvbkluZmluaXRlU2Nyb2xsIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiZGlzYWJsZWRcIiwgXCJwb3NpdGlvblwiLCBcInRocmVzaG9sZFwiXSwgXCJtZXRob2RzXCI6IFtcImNvbXBsZXRlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWluZmluaXRlLXNjcm9sbFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImRpc2FibGVkXCIsIFwicG9zaXRpb25cIiwgXCJ0aHJlc2hvbGRcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25JbmZpbml0ZVNjcm9sbCB7XG4gIGlvbkluZmluaXRlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbkluZmluaXRlXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkluZmluaXRlU2Nyb2xsQ29udGVudCBleHRlbmRzIENvbXBvbmVudHMuSW9uSW5maW5pdGVTY3JvbGxDb250ZW50IHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wibG9hZGluZ1NwaW5uZXJcIiwgXCJsb2FkaW5nVGV4dFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1pbmZpbml0ZS1zY3JvbGwtY29udGVudFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImxvYWRpbmdTcGlubmVyXCIsIFwibG9hZGluZ1RleHRcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25JbmZpbml0ZVNjcm9sbENvbnRlbnQge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbklucHV0IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25JbnB1dCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImFjY2VwdFwiLCBcImF1dG9jYXBpdGFsaXplXCIsIFwiYXV0b2NvbXBsZXRlXCIsIFwiYXV0b2NvcnJlY3RcIiwgXCJhdXRvZm9jdXNcIiwgXCJjbGVhcklucHV0XCIsIFwiY2xlYXJPbkVkaXRcIiwgXCJjb2xvclwiLCBcImRlYm91bmNlXCIsIFwiZGlzYWJsZWRcIiwgXCJlbnRlcmtleWhpbnRcIiwgXCJpbnB1dG1vZGVcIiwgXCJtYXhcIiwgXCJtYXhsZW5ndGhcIiwgXCJtaW5cIiwgXCJtaW5sZW5ndGhcIiwgXCJtb2RlXCIsIFwibXVsdGlwbGVcIiwgXCJuYW1lXCIsIFwicGF0dGVyblwiLCBcInBsYWNlaG9sZGVyXCIsIFwicmVhZG9ubHlcIiwgXCJyZXF1aXJlZFwiLCBcInNpemVcIiwgXCJzcGVsbGNoZWNrXCIsIFwic3RlcFwiLCBcInR5cGVcIiwgXCJ2YWx1ZVwiXSwgXCJtZXRob2RzXCI6IFtcInNldEZvY3VzXCIsIFwiZ2V0SW5wdXRFbGVtZW50XCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWlucHV0XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYWNjZXB0XCIsIFwiYXV0b2NhcGl0YWxpemVcIiwgXCJhdXRvY29tcGxldGVcIiwgXCJhdXRvY29ycmVjdFwiLCBcImF1dG9mb2N1c1wiLCBcImNsZWFySW5wdXRcIiwgXCJjbGVhck9uRWRpdFwiLCBcImNvbG9yXCIsIFwiZGVib3VuY2VcIiwgXCJkaXNhYmxlZFwiLCBcImVudGVya2V5aGludFwiLCBcImlucHV0bW9kZVwiLCBcIm1heFwiLCBcIm1heGxlbmd0aFwiLCBcIm1pblwiLCBcIm1pbmxlbmd0aFwiLCBcIm1vZGVcIiwgXCJtdWx0aXBsZVwiLCBcIm5hbWVcIiwgXCJwYXR0ZXJuXCIsIFwicGxhY2Vob2xkZXJcIiwgXCJyZWFkb25seVwiLCBcInJlcXVpcmVkXCIsIFwic2l6ZVwiLCBcInNwZWxsY2hlY2tcIiwgXCJzdGVwXCIsIFwidHlwZVwiLCBcInZhbHVlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uSW5wdXQge1xuICBpb25JbnB1dCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkNoYW5nZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkJsdXIhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25Gb2N1cyE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25JbnB1dFwiLCBcImlvbkNoYW5nZVwiLCBcImlvbkJsdXJcIiwgXCJpb25Gb2N1c1wiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25JdGVtIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25JdGVtIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYnV0dG9uXCIsIFwiY29sb3JcIiwgXCJkZXRhaWxcIiwgXCJkZXRhaWxJY29uXCIsIFwiZGlzYWJsZWRcIiwgXCJkb3dubG9hZFwiLCBcImhyZWZcIiwgXCJsaW5lc1wiLCBcIm1vZGVcIiwgXCJyZWxcIiwgXCJyb3V0ZXJBbmltYXRpb25cIiwgXCJyb3V0ZXJEaXJlY3Rpb25cIiwgXCJ0YXJnZXRcIiwgXCJ0eXBlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWl0ZW1cIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJidXR0b25cIiwgXCJjb2xvclwiLCBcImRldGFpbFwiLCBcImRldGFpbEljb25cIiwgXCJkaXNhYmxlZFwiLCBcImRvd25sb2FkXCIsIFwiaHJlZlwiLCBcImxpbmVzXCIsIFwibW9kZVwiLCBcInJlbFwiLCBcInJvdXRlckFuaW1hdGlvblwiLCBcInJvdXRlckRpcmVjdGlvblwiLCBcInRhcmdldFwiLCBcInR5cGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25JdGVtIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25JdGVtRGl2aWRlciBleHRlbmRzIENvbXBvbmVudHMuSW9uSXRlbURpdmlkZXIge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIiwgXCJzdGlja3lcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24taXRlbS1kaXZpZGVyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCIsIFwic3RpY2t5XCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uSXRlbURpdmlkZXIge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkl0ZW1Hcm91cCBleHRlbmRzIENvbXBvbmVudHMuSW9uSXRlbUdyb3VwIHtcbn1cbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24taXRlbS1ncm91cFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiIH0pXG5leHBvcnQgY2xhc3MgSW9uSXRlbUdyb3VwIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25JdGVtT3B0aW9uIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25JdGVtT3B0aW9uIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcImRvd25sb2FkXCIsIFwiZXhwYW5kYWJsZVwiLCBcImhyZWZcIiwgXCJtb2RlXCIsIFwicmVsXCIsIFwidGFyZ2V0XCIsIFwidHlwZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1pdGVtLW9wdGlvblwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJkb3dubG9hZFwiLCBcImV4cGFuZGFibGVcIiwgXCJocmVmXCIsIFwibW9kZVwiLCBcInJlbFwiLCBcInRhcmdldFwiLCBcInR5cGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25JdGVtT3B0aW9uIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25JdGVtT3B0aW9ucyBleHRlbmRzIENvbXBvbmVudHMuSW9uSXRlbU9wdGlvbnMge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJzaWRlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWl0ZW0tb3B0aW9uc1wiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcInNpZGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25JdGVtT3B0aW9ucyB7XG4gIGlvblN3aXBlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvblN3aXBlXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkl0ZW1TbGlkaW5nIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25JdGVtU2xpZGluZyB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImRpc2FibGVkXCJdLCBcIm1ldGhvZHNcIjogW1wiZ2V0T3BlbkFtb3VudFwiLCBcImdldFNsaWRpbmdSYXRpb1wiLCBcIm9wZW5cIiwgXCJjbG9zZVwiLCBcImNsb3NlT3BlbmVkXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWl0ZW0tc2xpZGluZ1wiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImRpc2FibGVkXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uSXRlbVNsaWRpbmcge1xuICBpb25EcmFnITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbkRyYWdcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uTGFiZWwgZXh0ZW5kcyBDb21wb25lbnRzLklvbkxhYmVsIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCIsIFwicG9zaXRpb25cIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tbGFiZWxcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIiwgXCJwb3NpdGlvblwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkxhYmVsIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25MaXN0IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25MaXN0IHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiaW5zZXRcIiwgXCJsaW5lc1wiLCBcIm1vZGVcIl0sIFwibWV0aG9kc1wiOiBbXCJjbG9zZVNsaWRpbmdJdGVtc1wiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1saXN0XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiaW5zZXRcIiwgXCJsaW5lc1wiLCBcIm1vZGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25MaXN0IHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25MaXN0SGVhZGVyIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25MaXN0SGVhZGVyIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJsaW5lc1wiLCBcIm1vZGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tbGlzdC1oZWFkZXJcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcImxpbmVzXCIsIFwibW9kZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkxpc3RIZWFkZXIge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbk1lbnUgZXh0ZW5kcyBDb21wb25lbnRzLklvbk1lbnUge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb250ZW50SWRcIiwgXCJkaXNhYmxlZFwiLCBcIm1heEVkZ2VTdGFydFwiLCBcIm1lbnVJZFwiLCBcInNpZGVcIiwgXCJzd2lwZUdlc3R1cmVcIiwgXCJ0eXBlXCJdLCBcIm1ldGhvZHNcIjogW1wiaXNPcGVuXCIsIFwiaXNBY3RpdmVcIiwgXCJvcGVuXCIsIFwiY2xvc2VcIiwgXCJ0b2dnbGVcIiwgXCJzZXRPcGVuXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLW1lbnVcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb250ZW50SWRcIiwgXCJkaXNhYmxlZFwiLCBcIm1heEVkZ2VTdGFydFwiLCBcIm1lbnVJZFwiLCBcInNpZGVcIiwgXCJzd2lwZUdlc3R1cmVcIiwgXCJ0eXBlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uTWVudSB7XG4gIGlvbldpbGxPcGVuITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uV2lsbENsb3NlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uRGlkT3BlbiE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkRpZENsb3NlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbldpbGxPcGVuXCIsIFwiaW9uV2lsbENsb3NlXCIsIFwiaW9uRGlkT3BlblwiLCBcImlvbkRpZENsb3NlXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbk1lbnVCdXR0b24gZXh0ZW5kcyBDb21wb25lbnRzLklvbk1lbnVCdXR0b24ge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJhdXRvSGlkZVwiLCBcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJtZW51XCIsIFwibW9kZVwiLCBcInR5cGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tbWVudS1idXR0b25cIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJhdXRvSGlkZVwiLCBcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJtZW51XCIsIFwibW9kZVwiLCBcInR5cGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25NZW51QnV0dG9uIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25NZW51VG9nZ2xlIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25NZW51VG9nZ2xlIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYXV0b0hpZGVcIiwgXCJtZW51XCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLW1lbnUtdG9nZ2xlXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYXV0b0hpZGVcIiwgXCJtZW51XCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uTWVudVRvZ2dsZSB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uTmF2IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25OYXYge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJhbmltYXRlZFwiLCBcImFuaW1hdGlvblwiLCBcInJvb3RcIiwgXCJyb290UGFyYW1zXCIsIFwic3dpcGVHZXN0dXJlXCJdLCBcIm1ldGhvZHNcIjogW1wicHVzaFwiLCBcImluc2VydFwiLCBcImluc2VydFBhZ2VzXCIsIFwicG9wXCIsIFwicG9wVG9cIiwgXCJwb3BUb1Jvb3RcIiwgXCJyZW1vdmVJbmRleFwiLCBcInNldFJvb3RcIiwgXCJzZXRQYWdlc1wiLCBcImdldEFjdGl2ZVwiLCBcImdldEJ5SW5kZXhcIiwgXCJjYW5Hb0JhY2tcIiwgXCJnZXRQcmV2aW91c1wiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1uYXZcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJhbmltYXRlZFwiLCBcImFuaW1hdGlvblwiLCBcInJvb3RcIiwgXCJyb290UGFyYW1zXCIsIFwic3dpcGVHZXN0dXJlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uTmF2IHtcbiAgaW9uTmF2V2lsbENoYW5nZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbk5hdkRpZENoYW5nZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25OYXZXaWxsQ2hhbmdlXCIsIFwiaW9uTmF2RGlkQ2hhbmdlXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbk5hdkxpbmsgZXh0ZW5kcyBDb21wb25lbnRzLklvbk5hdkxpbmsge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb21wb25lbnRcIiwgXCJjb21wb25lbnRQcm9wc1wiLCBcInJvdXRlckFuaW1hdGlvblwiLCBcInJvdXRlckRpcmVjdGlvblwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1uYXYtbGlua1wiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImNvbXBvbmVudFwiLCBcImNvbXBvbmVudFByb3BzXCIsIFwicm91dGVyQW5pbWF0aW9uXCIsIFwicm91dGVyRGlyZWN0aW9uXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uTmF2TGluayB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uTm90ZSBleHRlbmRzIENvbXBvbmVudHMuSW9uTm90ZSB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwibW9kZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1ub3RlXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uTm90ZSB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uUHJvZ3Jlc3NCYXIgZXh0ZW5kcyBDb21wb25lbnRzLklvblByb2dyZXNzQmFyIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYnVmZmVyXCIsIFwiY29sb3JcIiwgXCJtb2RlXCIsIFwicmV2ZXJzZWRcIiwgXCJ0eXBlXCIsIFwidmFsdWVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tcHJvZ3Jlc3MtYmFyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYnVmZmVyXCIsIFwiY29sb3JcIiwgXCJtb2RlXCIsIFwicmV2ZXJzZWRcIiwgXCJ0eXBlXCIsIFwidmFsdWVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25Qcm9ncmVzc0JhciB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uUmFkaW8gZXh0ZW5kcyBDb21wb25lbnRzLklvblJhZGlvIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcIm1vZGVcIiwgXCJuYW1lXCIsIFwidmFsdWVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tcmFkaW9cIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwibW9kZVwiLCBcIm5hbWVcIiwgXCJ2YWx1ZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblJhZGlvIHtcbiAgaW9uRm9jdXMhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25CbHVyITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbkZvY3VzXCIsIFwiaW9uQmx1clwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25SYWRpb0dyb3VwIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25SYWRpb0dyb3VwIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYWxsb3dFbXB0eVNlbGVjdGlvblwiLCBcIm5hbWVcIiwgXCJ2YWx1ZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1yYWRpby1ncm91cFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImFsbG93RW1wdHlTZWxlY3Rpb25cIiwgXCJuYW1lXCIsIFwidmFsdWVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25SYWRpb0dyb3VwIHtcbiAgaW9uQ2hhbmdlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbkNoYW5nZVwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25SYW5nZSBleHRlbmRzIENvbXBvbmVudHMuSW9uUmFuZ2Uge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xvclwiLCBcImRlYm91bmNlXCIsIFwiZGlzYWJsZWRcIiwgXCJkdWFsS25vYnNcIiwgXCJtYXhcIiwgXCJtaW5cIiwgXCJtb2RlXCIsIFwibmFtZVwiLCBcInBpblwiLCBcInNuYXBzXCIsIFwic3RlcFwiLCBcInRpY2tzXCIsIFwidmFsdWVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tcmFuZ2VcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcImRlYm91bmNlXCIsIFwiZGlzYWJsZWRcIiwgXCJkdWFsS25vYnNcIiwgXCJtYXhcIiwgXCJtaW5cIiwgXCJtb2RlXCIsIFwibmFtZVwiLCBcInBpblwiLCBcInNuYXBzXCIsIFwic3RlcFwiLCBcInRpY2tzXCIsIFwidmFsdWVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25SYW5nZSB7XG4gIGlvbkNoYW5nZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkZvY3VzITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uQmx1ciE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25DaGFuZ2VcIiwgXCJpb25Gb2N1c1wiLCBcImlvbkJsdXJcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uUmVmcmVzaGVyIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25SZWZyZXNoZXIge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjbG9zZUR1cmF0aW9uXCIsIFwiZGlzYWJsZWRcIiwgXCJwdWxsRmFjdG9yXCIsIFwicHVsbE1heFwiLCBcInB1bGxNaW5cIiwgXCJzbmFwYmFja0R1cmF0aW9uXCJdLCBcIm1ldGhvZHNcIjogW1wiY29tcGxldGVcIiwgXCJjYW5jZWxcIiwgXCJnZXRQcm9ncmVzc1wiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1yZWZyZXNoZXJcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjbG9zZUR1cmF0aW9uXCIsIFwiZGlzYWJsZWRcIiwgXCJwdWxsRmFjdG9yXCIsIFwicHVsbE1heFwiLCBcInB1bGxNaW5cIiwgXCJzbmFwYmFja0R1cmF0aW9uXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uUmVmcmVzaGVyIHtcbiAgaW9uUmVmcmVzaCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblB1bGwhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25TdGFydCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25SZWZyZXNoXCIsIFwiaW9uUHVsbFwiLCBcImlvblN0YXJ0XCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblJlZnJlc2hlckNvbnRlbnQgZXh0ZW5kcyBDb21wb25lbnRzLklvblJlZnJlc2hlckNvbnRlbnQge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJwdWxsaW5nSWNvblwiLCBcInB1bGxpbmdUZXh0XCIsIFwicmVmcmVzaGluZ1NwaW5uZXJcIiwgXCJyZWZyZXNoaW5nVGV4dFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1yZWZyZXNoZXItY29udGVudFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcInB1bGxpbmdJY29uXCIsIFwicHVsbGluZ1RleHRcIiwgXCJyZWZyZXNoaW5nU3Bpbm5lclwiLCBcInJlZnJlc2hpbmdUZXh0XCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uUmVmcmVzaGVyQ29udGVudCB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uUmVvcmRlciBleHRlbmRzIENvbXBvbmVudHMuSW9uUmVvcmRlciB7XG59XG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXJlb3JkZXJcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiB9KVxuZXhwb3J0IGNsYXNzIElvblJlb3JkZXIge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblJlb3JkZXJHcm91cCBleHRlbmRzIENvbXBvbmVudHMuSW9uUmVvcmRlckdyb3VwIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiZGlzYWJsZWRcIl0sIFwibWV0aG9kc1wiOiBbXCJjb21wbGV0ZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1yZW9yZGVyLWdyb3VwXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiZGlzYWJsZWRcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25SZW9yZGVyR3JvdXAge1xuICBpb25JdGVtUmVvcmRlciE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25JdGVtUmVvcmRlclwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25SaXBwbGVFZmZlY3QgZXh0ZW5kcyBDb21wb25lbnRzLklvblJpcHBsZUVmZmVjdCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcInR5cGVcIl0sIFwibWV0aG9kc1wiOiBbXCJhZGRSaXBwbGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tcmlwcGxlLWVmZmVjdFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcInR5cGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25SaXBwbGVFZmZlY3Qge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblJvdyBleHRlbmRzIENvbXBvbmVudHMuSW9uUm93IHtcbn1cbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tcm93XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIgfSlcbmV4cG9ydCBjbGFzcyBJb25Sb3cge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblNlYXJjaGJhciBleHRlbmRzIENvbXBvbmVudHMuSW9uU2VhcmNoYmFyIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYW5pbWF0ZWRcIiwgXCJhdXRvY29tcGxldGVcIiwgXCJhdXRvY29ycmVjdFwiLCBcImNhbmNlbEJ1dHRvbkljb25cIiwgXCJjYW5jZWxCdXR0b25UZXh0XCIsIFwiY2xlYXJJY29uXCIsIFwiY29sb3JcIiwgXCJkZWJvdW5jZVwiLCBcImRpc2FibGVkXCIsIFwiZW50ZXJrZXloaW50XCIsIFwiaW5wdXRtb2RlXCIsIFwibW9kZVwiLCBcInBsYWNlaG9sZGVyXCIsIFwic2VhcmNoSWNvblwiLCBcInNob3dDYW5jZWxCdXR0b25cIiwgXCJzaG93Q2xlYXJCdXR0b25cIiwgXCJzcGVsbGNoZWNrXCIsIFwidHlwZVwiLCBcInZhbHVlXCJdLCBcIm1ldGhvZHNcIjogW1wic2V0Rm9jdXNcIiwgXCJnZXRJbnB1dEVsZW1lbnRcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tc2VhcmNoYmFyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYW5pbWF0ZWRcIiwgXCJhdXRvY29tcGxldGVcIiwgXCJhdXRvY29ycmVjdFwiLCBcImNhbmNlbEJ1dHRvbkljb25cIiwgXCJjYW5jZWxCdXR0b25UZXh0XCIsIFwiY2xlYXJJY29uXCIsIFwiY29sb3JcIiwgXCJkZWJvdW5jZVwiLCBcImRpc2FibGVkXCIsIFwiZW50ZXJrZXloaW50XCIsIFwiaW5wdXRtb2RlXCIsIFwibW9kZVwiLCBcInBsYWNlaG9sZGVyXCIsIFwic2VhcmNoSWNvblwiLCBcInNob3dDYW5jZWxCdXR0b25cIiwgXCJzaG93Q2xlYXJCdXR0b25cIiwgXCJzcGVsbGNoZWNrXCIsIFwidHlwZVwiLCBcInZhbHVlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uU2VhcmNoYmFyIHtcbiAgaW9uSW5wdXQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25DaGFuZ2UhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25DYW5jZWwhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25DbGVhciE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkJsdXIhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25Gb2N1cyE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25JbnB1dFwiLCBcImlvbkNoYW5nZVwiLCBcImlvbkNhbmNlbFwiLCBcImlvbkNsZWFyXCIsIFwiaW9uQmx1clwiLCBcImlvbkZvY3VzXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblNlZ21lbnQgZXh0ZW5kcyBDb21wb25lbnRzLklvblNlZ21lbnQge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwibW9kZVwiLCBcInNjcm9sbGFibGVcIiwgXCJzd2lwZUdlc3R1cmVcIiwgXCJ2YWx1ZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1zZWdtZW50XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcIm1vZGVcIiwgXCJzY3JvbGxhYmxlXCIsIFwic3dpcGVHZXN0dXJlXCIsIFwidmFsdWVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25TZWdtZW50IHtcbiAgaW9uQ2hhbmdlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbkNoYW5nZVwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25TZWdtZW50QnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25TZWdtZW50QnV0dG9uIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiZGlzYWJsZWRcIiwgXCJsYXlvdXRcIiwgXCJtb2RlXCIsIFwidHlwZVwiLCBcInZhbHVlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXNlZ21lbnQtYnV0dG9uXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiZGlzYWJsZWRcIiwgXCJsYXlvdXRcIiwgXCJtb2RlXCIsIFwidHlwZVwiLCBcInZhbHVlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uU2VnbWVudEJ1dHRvbiB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uU2VsZWN0IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25TZWxlY3Qge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjYW5jZWxUZXh0XCIsIFwiY29tcGFyZVdpdGhcIiwgXCJkaXNhYmxlZFwiLCBcImludGVyZmFjZVwiLCBcImludGVyZmFjZU9wdGlvbnNcIiwgXCJtb2RlXCIsIFwibXVsdGlwbGVcIiwgXCJuYW1lXCIsIFwib2tUZXh0XCIsIFwicGxhY2Vob2xkZXJcIiwgXCJzZWxlY3RlZFRleHRcIiwgXCJ2YWx1ZVwiXSwgXCJtZXRob2RzXCI6IFtcIm9wZW5cIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tc2VsZWN0XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY2FuY2VsVGV4dFwiLCBcImNvbXBhcmVXaXRoXCIsIFwiZGlzYWJsZWRcIiwgXCJpbnRlcmZhY2VcIiwgXCJpbnRlcmZhY2VPcHRpb25zXCIsIFwibW9kZVwiLCBcIm11bHRpcGxlXCIsIFwibmFtZVwiLCBcIm9rVGV4dFwiLCBcInBsYWNlaG9sZGVyXCIsIFwic2VsZWN0ZWRUZXh0XCIsIFwidmFsdWVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25TZWxlY3Qge1xuICBpb25DaGFuZ2UhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25DYW5jZWwhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25Gb2N1cyE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkJsdXIhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uQ2hhbmdlXCIsIFwiaW9uQ2FuY2VsXCIsIFwiaW9uRm9jdXNcIiwgXCJpb25CbHVyXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblNlbGVjdE9wdGlvbiBleHRlbmRzIENvbXBvbmVudHMuSW9uU2VsZWN0T3B0aW9uIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiZGlzYWJsZWRcIiwgXCJ2YWx1ZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1zZWxlY3Qtb3B0aW9uXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiZGlzYWJsZWRcIiwgXCJ2YWx1ZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblNlbGVjdE9wdGlvbiB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uU2tlbGV0b25UZXh0IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25Ta2VsZXRvblRleHQge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJhbmltYXRlZFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1za2VsZXRvbi10ZXh0XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYW5pbWF0ZWRcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25Ta2VsZXRvblRleHQge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblNsaWRlIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25TbGlkZSB7XG59XG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXNsaWRlXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIgfSlcbmV4cG9ydCBjbGFzcyBJb25TbGlkZSB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uU2xpZGVzIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25TbGlkZXMge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJtb2RlXCIsIFwib3B0aW9uc1wiLCBcInBhZ2VyXCIsIFwic2Nyb2xsYmFyXCJdLCBcIm1ldGhvZHNcIjogW1widXBkYXRlXCIsIFwidXBkYXRlQXV0b0hlaWdodFwiLCBcInNsaWRlVG9cIiwgXCJzbGlkZU5leHRcIiwgXCJzbGlkZVByZXZcIiwgXCJnZXRBY3RpdmVJbmRleFwiLCBcImdldFByZXZpb3VzSW5kZXhcIiwgXCJsZW5ndGhcIiwgXCJpc0VuZFwiLCBcImlzQmVnaW5uaW5nXCIsIFwic3RhcnRBdXRvcGxheVwiLCBcInN0b3BBdXRvcGxheVwiLCBcImxvY2tTd2lwZVRvTmV4dFwiLCBcImxvY2tTd2lwZVRvUHJldlwiLCBcImxvY2tTd2lwZXNcIiwgXCJnZXRTd2lwZXJcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tc2xpZGVzXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wibW9kZVwiLCBcIm9wdGlvbnNcIiwgXCJwYWdlclwiLCBcInNjcm9sbGJhclwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblNsaWRlcyB7XG4gIGlvblNsaWRlc0RpZExvYWQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25TbGlkZVRhcCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblNsaWRlRG91YmxlVGFwITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVXaWxsQ2hhbmdlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVEaWRDaGFuZ2UhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25TbGlkZU5leHRTdGFydCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblNsaWRlUHJldlN0YXJ0ITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVOZXh0RW5kITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVQcmV2RW5kITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVUcmFuc2l0aW9uU3RhcnQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25TbGlkZVRyYW5zaXRpb25FbmQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25TbGlkZURyYWchOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25TbGlkZVJlYWNoU3RhcnQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25TbGlkZVJlYWNoRW5kITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVUb3VjaFN0YXJ0ITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVUb3VjaEVuZCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25TbGlkZXNEaWRMb2FkXCIsIFwiaW9uU2xpZGVUYXBcIiwgXCJpb25TbGlkZURvdWJsZVRhcFwiLCBcImlvblNsaWRlV2lsbENoYW5nZVwiLCBcImlvblNsaWRlRGlkQ2hhbmdlXCIsIFwiaW9uU2xpZGVOZXh0U3RhcnRcIiwgXCJpb25TbGlkZVByZXZTdGFydFwiLCBcImlvblNsaWRlTmV4dEVuZFwiLCBcImlvblNsaWRlUHJldkVuZFwiLCBcImlvblNsaWRlVHJhbnNpdGlvblN0YXJ0XCIsIFwiaW9uU2xpZGVUcmFuc2l0aW9uRW5kXCIsIFwiaW9uU2xpZGVEcmFnXCIsIFwiaW9uU2xpZGVSZWFjaFN0YXJ0XCIsIFwiaW9uU2xpZGVSZWFjaEVuZFwiLCBcImlvblNsaWRlVG91Y2hTdGFydFwiLCBcImlvblNsaWRlVG91Y2hFbmRcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uU3Bpbm5lciBleHRlbmRzIENvbXBvbmVudHMuSW9uU3Bpbm5lciB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwiZHVyYXRpb25cIiwgXCJuYW1lXCIsIFwicGF1c2VkXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXNwaW5uZXJcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcImR1cmF0aW9uXCIsIFwibmFtZVwiLCBcInBhdXNlZFwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblNwaW5uZXIge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblNwbGl0UGFuZSBleHRlbmRzIENvbXBvbmVudHMuSW9uU3BsaXRQYW5lIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29udGVudElkXCIsIFwiZGlzYWJsZWRcIiwgXCJ3aGVuXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXNwbGl0LXBhbmVcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb250ZW50SWRcIiwgXCJkaXNhYmxlZFwiLCBcIndoZW5cIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25TcGxpdFBhbmUge1xuICBpb25TcGxpdFBhbmVWaXNpYmxlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvblNwbGl0UGFuZVZpc2libGVcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uVGFiQmFyIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25UYWJCYXIge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIiwgXCJzZWxlY3RlZFRhYlwiLCBcInRyYW5zbHVjZW50XCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXRhYi1iYXJcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIiwgXCJzZWxlY3RlZFRhYlwiLCBcInRyYW5zbHVjZW50XCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uVGFiQmFyIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25UYWJCdXR0b24gZXh0ZW5kcyBDb21wb25lbnRzLklvblRhYkJ1dHRvbiB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImRpc2FibGVkXCIsIFwiZG93bmxvYWRcIiwgXCJocmVmXCIsIFwibGF5b3V0XCIsIFwibW9kZVwiLCBcInJlbFwiLCBcInNlbGVjdGVkXCIsIFwidGFiXCIsIFwidGFyZ2V0XCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXRhYi1idXR0b25cIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJkaXNhYmxlZFwiLCBcImRvd25sb2FkXCIsIFwiaHJlZlwiLCBcImxheW91dFwiLCBcIm1vZGVcIiwgXCJyZWxcIiwgXCJzZWxlY3RlZFwiLCBcInRhYlwiLCBcInRhcmdldFwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblRhYkJ1dHRvbiB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uVGV4dCBleHRlbmRzIENvbXBvbmVudHMuSW9uVGV4dCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwibW9kZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi10ZXh0XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uVGV4dCB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uVGV4dGFyZWEgZXh0ZW5kcyBDb21wb25lbnRzLklvblRleHRhcmVhIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYXV0b0dyb3dcIiwgXCJhdXRvY2FwaXRhbGl6ZVwiLCBcImF1dG9mb2N1c1wiLCBcImNsZWFyT25FZGl0XCIsIFwiY29sb3JcIiwgXCJjb2xzXCIsIFwiZGVib3VuY2VcIiwgXCJkaXNhYmxlZFwiLCBcImVudGVya2V5aGludFwiLCBcImlucHV0bW9kZVwiLCBcIm1heGxlbmd0aFwiLCBcIm1pbmxlbmd0aFwiLCBcIm1vZGVcIiwgXCJuYW1lXCIsIFwicGxhY2Vob2xkZXJcIiwgXCJyZWFkb25seVwiLCBcInJlcXVpcmVkXCIsIFwicm93c1wiLCBcInNwZWxsY2hlY2tcIiwgXCJ2YWx1ZVwiLCBcIndyYXBcIl0sIFwibWV0aG9kc1wiOiBbXCJzZXRGb2N1c1wiLCBcImdldElucHV0RWxlbWVudFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi10ZXh0YXJlYVwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImF1dG9Hcm93XCIsIFwiYXV0b2NhcGl0YWxpemVcIiwgXCJhdXRvZm9jdXNcIiwgXCJjbGVhck9uRWRpdFwiLCBcImNvbG9yXCIsIFwiY29sc1wiLCBcImRlYm91bmNlXCIsIFwiZGlzYWJsZWRcIiwgXCJlbnRlcmtleWhpbnRcIiwgXCJpbnB1dG1vZGVcIiwgXCJtYXhsZW5ndGhcIiwgXCJtaW5sZW5ndGhcIiwgXCJtb2RlXCIsIFwibmFtZVwiLCBcInBsYWNlaG9sZGVyXCIsIFwicmVhZG9ubHlcIiwgXCJyZXF1aXJlZFwiLCBcInJvd3NcIiwgXCJzcGVsbGNoZWNrXCIsIFwidmFsdWVcIiwgXCJ3cmFwXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uVGV4dGFyZWEge1xuICBpb25DaGFuZ2UhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25JbnB1dCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkJsdXIhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25Gb2N1cyE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25DaGFuZ2VcIiwgXCJpb25JbnB1dFwiLCBcImlvbkJsdXJcIiwgXCJpb25Gb2N1c1wiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25UaHVtYm5haWwgZXh0ZW5kcyBDb21wb25lbnRzLklvblRodW1ibmFpbCB7XG59XG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXRodW1ibmFpbFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiIH0pXG5leHBvcnQgY2xhc3MgSW9uVGh1bWJuYWlsIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25UaXRsZSBleHRlbmRzIENvbXBvbmVudHMuSW9uVGl0bGUge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xvclwiLCBcInNpemVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tdGl0bGVcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcInNpemVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25UaXRsZSB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uVG9nZ2xlIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25Ub2dnbGUge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjaGVja2VkXCIsIFwiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcIm1vZGVcIiwgXCJuYW1lXCIsIFwidmFsdWVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tdG9nZ2xlXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY2hlY2tlZFwiLCBcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJtb2RlXCIsIFwibmFtZVwiLCBcInZhbHVlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uVG9nZ2xlIHtcbiAgaW9uQ2hhbmdlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uRm9jdXMhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25CbHVyITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbkNoYW5nZVwiLCBcImlvbkZvY3VzXCIsIFwiaW9uQmx1clwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25Ub29sYmFyIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25Ub29sYmFyIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXRvb2xiYXJcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25Ub29sYmFyIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbiJdfQ==