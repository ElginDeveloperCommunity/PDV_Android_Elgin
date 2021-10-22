import * as tslib_1 from "tslib";
/* eslint-disable */
/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from "@angular/core";
import { ProxyCmp, proxyOutputs } from "./proxies-utils";
let IonApp = class IonApp {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonApp.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonApp = tslib_1.__decorate([
    Component({ selector: "ion-app", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
], IonApp);
export { IonApp };
let IonAvatar = class IonAvatar {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonAvatar.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonAvatar = tslib_1.__decorate([
    Component({ selector: "ion-avatar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
], IonAvatar);
export { IonAvatar };
let IonBackButton = class IonBackButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonBackButton.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonBackButton = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "defaultHref", "disabled", "icon", "mode", "routerAnimation", "text", "type"] }),
    Component({ selector: "ion-back-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "defaultHref", "disabled", "icon", "mode", "routerAnimation", "text", "type"] })
], IonBackButton);
export { IonBackButton };
let IonBackdrop = class IonBackdrop {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionBackdropTap"]);
    }
};
IonBackdrop.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonBackdrop = tslib_1.__decorate([
    ProxyCmp({ inputs: ["stopPropagation", "tappable", "visible"] }),
    Component({ selector: "ion-backdrop", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["stopPropagation", "tappable", "visible"] })
], IonBackdrop);
export { IonBackdrop };
let IonBadge = class IonBadge {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonBadge.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonBadge = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "mode"] }),
    Component({ selector: "ion-badge", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
], IonBadge);
export { IonBadge };
let IonButton = class IonButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionFocus", "ionBlur"]);
    }
};
IonButton.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonButton = tslib_1.__decorate([
    ProxyCmp({ inputs: ["buttonType", "color", "disabled", "download", "expand", "fill", "href", "mode", "rel", "routerAnimation", "routerDirection", "shape", "size", "strong", "target", "type"] }),
    Component({ selector: "ion-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["buttonType", "color", "disabled", "download", "expand", "fill", "href", "mode", "rel", "routerAnimation", "routerDirection", "shape", "size", "strong", "target", "type"] })
], IonButton);
export { IonButton };
let IonButtons = class IonButtons {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonButtons.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonButtons = tslib_1.__decorate([
    ProxyCmp({ inputs: ["collapse"] }),
    Component({ selector: "ion-buttons", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["collapse"] })
], IonButtons);
export { IonButtons };
let IonCard = class IonCard {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCard.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonCard = tslib_1.__decorate([
    ProxyCmp({ inputs: ["button", "color", "disabled", "download", "href", "mode", "rel", "routerAnimation", "routerDirection", "target", "type"] }),
    Component({ selector: "ion-card", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["button", "color", "disabled", "download", "href", "mode", "rel", "routerAnimation", "routerDirection", "target", "type"] })
], IonCard);
export { IonCard };
let IonCardContent = class IonCardContent {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCardContent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonCardContent = tslib_1.__decorate([
    ProxyCmp({ inputs: ["mode"] }),
    Component({ selector: "ion-card-content", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["mode"] })
], IonCardContent);
export { IonCardContent };
let IonCardHeader = class IonCardHeader {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCardHeader.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonCardHeader = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "mode", "translucent"] }),
    Component({ selector: "ion-card-header", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode", "translucent"] })
], IonCardHeader);
export { IonCardHeader };
let IonCardSubtitle = class IonCardSubtitle {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCardSubtitle.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonCardSubtitle = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "mode"] }),
    Component({ selector: "ion-card-subtitle", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
], IonCardSubtitle);
export { IonCardSubtitle };
let IonCardTitle = class IonCardTitle {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCardTitle.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonCardTitle = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "mode"] }),
    Component({ selector: "ion-card-title", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
], IonCardTitle);
export { IonCardTitle };
let IonCheckbox = class IonCheckbox {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange", "ionFocus", "ionBlur"]);
    }
};
IonCheckbox.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonCheckbox = tslib_1.__decorate([
    ProxyCmp({ inputs: ["checked", "color", "disabled", "indeterminate", "mode", "name", "value"] }),
    Component({ selector: "ion-checkbox", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["checked", "color", "disabled", "indeterminate", "mode", "name", "value"] })
], IonCheckbox);
export { IonCheckbox };
let IonChip = class IonChip {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonChip.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonChip = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "disabled", "mode", "outline"] }),
    Component({ selector: "ion-chip", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "disabled", "mode", "outline"] })
], IonChip);
export { IonChip };
let IonCol = class IonCol {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCol.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonCol = tslib_1.__decorate([
    ProxyCmp({ inputs: ["offset", "offsetLg", "offsetMd", "offsetSm", "offsetXl", "offsetXs", "pull", "pullLg", "pullMd", "pullSm", "pullXl", "pullXs", "push", "pushLg", "pushMd", "pushSm", "pushXl", "pushXs", "size", "sizeLg", "sizeMd", "sizeSm", "sizeXl", "sizeXs"] }),
    Component({ selector: "ion-col", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["offset", "offsetLg", "offsetMd", "offsetSm", "offsetXl", "offsetXs", "pull", "pullLg", "pullMd", "pullSm", "pullXl", "pullXs", "push", "pushLg", "pushMd", "pushSm", "pushXl", "pushXs", "size", "sizeLg", "sizeMd", "sizeSm", "sizeXl", "sizeXs"] })
], IonCol);
export { IonCol };
let IonContent = class IonContent {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionScrollStart", "ionScroll", "ionScrollEnd"]);
    }
};
IonContent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonContent = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "forceOverscroll", "fullscreen", "scrollEvents", "scrollX", "scrollY"], "methods": ["getScrollElement", "scrollToTop", "scrollToBottom", "scrollByPoint", "scrollToPoint"] }),
    Component({ selector: "ion-content", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "forceOverscroll", "fullscreen", "scrollEvents", "scrollX", "scrollY"] })
], IonContent);
export { IonContent };
let IonDatetime = class IonDatetime {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionCancel", "ionChange", "ionFocus", "ionBlur"]);
    }
};
IonDatetime.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonDatetime = tslib_1.__decorate([
    ProxyCmp({ inputs: ["cancelText", "dayNames", "dayShortNames", "dayValues", "disabled", "displayFormat", "displayTimezone", "doneText", "hourValues", "max", "min", "minuteValues", "mode", "monthNames", "monthShortNames", "monthValues", "name", "pickerFormat", "pickerOptions", "placeholder", "readonly", "value", "yearValues"], "methods": ["open"] }),
    Component({ selector: "ion-datetime", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["cancelText", "dayNames", "dayShortNames", "dayValues", "disabled", "displayFormat", "displayTimezone", "doneText", "hourValues", "max", "min", "minuteValues", "mode", "monthNames", "monthShortNames", "monthValues", "name", "pickerFormat", "pickerOptions", "placeholder", "readonly", "value", "yearValues"] })
], IonDatetime);
export { IonDatetime };
let IonFab = class IonFab {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonFab.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonFab = tslib_1.__decorate([
    ProxyCmp({ inputs: ["activated", "edge", "horizontal", "vertical"], "methods": ["close"] }),
    Component({ selector: "ion-fab", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["activated", "edge", "horizontal", "vertical"] })
], IonFab);
export { IonFab };
let IonFabButton = class IonFabButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionFocus", "ionBlur"]);
    }
};
IonFabButton.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonFabButton = tslib_1.__decorate([
    ProxyCmp({ inputs: ["activated", "closeIcon", "color", "disabled", "download", "href", "mode", "rel", "routerAnimation", "routerDirection", "show", "size", "target", "translucent", "type"] }),
    Component({ selector: "ion-fab-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["activated", "closeIcon", "color", "disabled", "download", "href", "mode", "rel", "routerAnimation", "routerDirection", "show", "size", "target", "translucent", "type"] })
], IonFabButton);
export { IonFabButton };
let IonFabList = class IonFabList {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonFabList.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonFabList = tslib_1.__decorate([
    ProxyCmp({ inputs: ["activated", "side"] }),
    Component({ selector: "ion-fab-list", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["activated", "side"] })
], IonFabList);
export { IonFabList };
let IonFooter = class IonFooter {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonFooter.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonFooter = tslib_1.__decorate([
    ProxyCmp({ inputs: ["mode", "translucent"] }),
    Component({ selector: "ion-footer", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["mode", "translucent"] })
], IonFooter);
export { IonFooter };
let IonGrid = class IonGrid {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonGrid.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonGrid = tslib_1.__decorate([
    ProxyCmp({ inputs: ["fixed"] }),
    Component({ selector: "ion-grid", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["fixed"] })
], IonGrid);
export { IonGrid };
let IonHeader = class IonHeader {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonHeader.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonHeader = tslib_1.__decorate([
    ProxyCmp({ inputs: ["collapse", "mode", "translucent"] }),
    Component({ selector: "ion-header", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["collapse", "mode", "translucent"] })
], IonHeader);
export { IonHeader };
let IonIcon = class IonIcon {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonIcon.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonIcon = tslib_1.__decorate([
    ProxyCmp({ inputs: ["ariaHidden", "ariaLabel", "color", "flipRtl", "icon", "ios", "lazy", "md", "mode", "name", "sanitize", "size", "src"] }),
    Component({ selector: "ion-icon", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["ariaHidden", "ariaLabel", "color", "flipRtl", "icon", "ios", "lazy", "md", "mode", "name", "sanitize", "size", "src"] })
], IonIcon);
export { IonIcon };
let IonImg = class IonImg {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionImgWillLoad", "ionImgDidLoad", "ionError"]);
    }
};
IonImg.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonImg = tslib_1.__decorate([
    ProxyCmp({ inputs: ["alt", "src"] }),
    Component({ selector: "ion-img", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["alt", "src"] })
], IonImg);
export { IonImg };
let IonInfiniteScroll = class IonInfiniteScroll {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionInfinite"]);
    }
};
IonInfiniteScroll.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonInfiniteScroll = tslib_1.__decorate([
    ProxyCmp({ inputs: ["disabled", "position", "threshold"], "methods": ["complete"] }),
    Component({ selector: "ion-infinite-scroll", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled", "position", "threshold"] })
], IonInfiniteScroll);
export { IonInfiniteScroll };
let IonInfiniteScrollContent = class IonInfiniteScrollContent {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonInfiniteScrollContent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonInfiniteScrollContent = tslib_1.__decorate([
    ProxyCmp({ inputs: ["loadingSpinner", "loadingText"] }),
    Component({ selector: "ion-infinite-scroll-content", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["loadingSpinner", "loadingText"] })
], IonInfiniteScrollContent);
export { IonInfiniteScrollContent };
let IonInput = class IonInput {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionInput", "ionChange", "ionBlur", "ionFocus"]);
    }
};
IonInput.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonInput = tslib_1.__decorate([
    ProxyCmp({ inputs: ["accept", "autocapitalize", "autocomplete", "autocorrect", "autofocus", "clearInput", "clearOnEdit", "color", "debounce", "disabled", "enterkeyhint", "inputmode", "max", "maxlength", "min", "minlength", "mode", "multiple", "name", "pattern", "placeholder", "readonly", "required", "size", "spellcheck", "step", "type", "value"], "methods": ["setFocus", "getInputElement"] }),
    Component({ selector: "ion-input", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["accept", "autocapitalize", "autocomplete", "autocorrect", "autofocus", "clearInput", "clearOnEdit", "color", "debounce", "disabled", "enterkeyhint", "inputmode", "max", "maxlength", "min", "minlength", "mode", "multiple", "name", "pattern", "placeholder", "readonly", "required", "size", "spellcheck", "step", "type", "value"] })
], IonInput);
export { IonInput };
let IonItem = class IonItem {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonItem.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonItem = tslib_1.__decorate([
    ProxyCmp({ inputs: ["button", "color", "detail", "detailIcon", "disabled", "download", "href", "lines", "mode", "rel", "routerAnimation", "routerDirection", "target", "type"] }),
    Component({ selector: "ion-item", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["button", "color", "detail", "detailIcon", "disabled", "download", "href", "lines", "mode", "rel", "routerAnimation", "routerDirection", "target", "type"] })
], IonItem);
export { IonItem };
let IonItemDivider = class IonItemDivider {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonItemDivider.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonItemDivider = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "mode", "sticky"] }),
    Component({ selector: "ion-item-divider", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode", "sticky"] })
], IonItemDivider);
export { IonItemDivider };
let IonItemGroup = class IonItemGroup {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonItemGroup.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonItemGroup = tslib_1.__decorate([
    Component({ selector: "ion-item-group", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
], IonItemGroup);
export { IonItemGroup };
let IonItemOption = class IonItemOption {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonItemOption.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonItemOption = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "disabled", "download", "expandable", "href", "mode", "rel", "target", "type"] }),
    Component({ selector: "ion-item-option", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "disabled", "download", "expandable", "href", "mode", "rel", "target", "type"] })
], IonItemOption);
export { IonItemOption };
let IonItemOptions = class IonItemOptions {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionSwipe"]);
    }
};
IonItemOptions.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonItemOptions = tslib_1.__decorate([
    ProxyCmp({ inputs: ["side"] }),
    Component({ selector: "ion-item-options", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["side"] })
], IonItemOptions);
export { IonItemOptions };
let IonItemSliding = class IonItemSliding {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionDrag"]);
    }
};
IonItemSliding.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonItemSliding = tslib_1.__decorate([
    ProxyCmp({ inputs: ["disabled"], "methods": ["getOpenAmount", "getSlidingRatio", "open", "close", "closeOpened"] }),
    Component({ selector: "ion-item-sliding", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled"] })
], IonItemSliding);
export { IonItemSliding };
let IonLabel = class IonLabel {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonLabel.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonLabel = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "mode", "position"] }),
    Component({ selector: "ion-label", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode", "position"] })
], IonLabel);
export { IonLabel };
let IonList = class IonList {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonList.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonList = tslib_1.__decorate([
    ProxyCmp({ inputs: ["inset", "lines", "mode"], "methods": ["closeSlidingItems"] }),
    Component({ selector: "ion-list", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["inset", "lines", "mode"] })
], IonList);
export { IonList };
let IonListHeader = class IonListHeader {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonListHeader.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonListHeader = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "lines", "mode"] }),
    Component({ selector: "ion-list-header", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "lines", "mode"] })
], IonListHeader);
export { IonListHeader };
let IonMenu = class IonMenu {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionWillOpen", "ionWillClose", "ionDidOpen", "ionDidClose"]);
    }
};
IonMenu.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonMenu = tslib_1.__decorate([
    ProxyCmp({ inputs: ["contentId", "disabled", "maxEdgeStart", "menuId", "side", "swipeGesture", "type"], "methods": ["isOpen", "isActive", "open", "close", "toggle", "setOpen"] }),
    Component({ selector: "ion-menu", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["contentId", "disabled", "maxEdgeStart", "menuId", "side", "swipeGesture", "type"] })
], IonMenu);
export { IonMenu };
let IonMenuButton = class IonMenuButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonMenuButton.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonMenuButton = tslib_1.__decorate([
    ProxyCmp({ inputs: ["autoHide", "color", "disabled", "menu", "mode", "type"] }),
    Component({ selector: "ion-menu-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["autoHide", "color", "disabled", "menu", "mode", "type"] })
], IonMenuButton);
export { IonMenuButton };
let IonMenuToggle = class IonMenuToggle {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonMenuToggle.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonMenuToggle = tslib_1.__decorate([
    ProxyCmp({ inputs: ["autoHide", "menu"] }),
    Component({ selector: "ion-menu-toggle", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["autoHide", "menu"] })
], IonMenuToggle);
export { IonMenuToggle };
let IonNav = class IonNav {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionNavWillChange", "ionNavDidChange"]);
    }
};
IonNav.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonNav = tslib_1.__decorate([
    ProxyCmp({ inputs: ["animated", "animation", "root", "rootParams", "swipeGesture"], "methods": ["push", "insert", "insertPages", "pop", "popTo", "popToRoot", "removeIndex", "setRoot", "setPages", "getActive", "getByIndex", "canGoBack", "getPrevious"] }),
    Component({ selector: "ion-nav", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["animated", "animation", "root", "rootParams", "swipeGesture"] })
], IonNav);
export { IonNav };
let IonNavLink = class IonNavLink {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonNavLink.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonNavLink = tslib_1.__decorate([
    ProxyCmp({ inputs: ["component", "componentProps", "routerAnimation", "routerDirection"] }),
    Component({ selector: "ion-nav-link", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["component", "componentProps", "routerAnimation", "routerDirection"] })
], IonNavLink);
export { IonNavLink };
let IonNote = class IonNote {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonNote.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonNote = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "mode"] }),
    Component({ selector: "ion-note", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
], IonNote);
export { IonNote };
let IonProgressBar = class IonProgressBar {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonProgressBar.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonProgressBar = tslib_1.__decorate([
    ProxyCmp({ inputs: ["buffer", "color", "mode", "reversed", "type", "value"] }),
    Component({ selector: "ion-progress-bar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["buffer", "color", "mode", "reversed", "type", "value"] })
], IonProgressBar);
export { IonProgressBar };
let IonRadio = class IonRadio {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionFocus", "ionBlur"]);
    }
};
IonRadio.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonRadio = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "disabled", "mode", "name", "value"] }),
    Component({ selector: "ion-radio", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "disabled", "mode", "name", "value"] })
], IonRadio);
export { IonRadio };
let IonRadioGroup = class IonRadioGroup {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange"]);
    }
};
IonRadioGroup.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonRadioGroup = tslib_1.__decorate([
    ProxyCmp({ inputs: ["allowEmptySelection", "name", "value"] }),
    Component({ selector: "ion-radio-group", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["allowEmptySelection", "name", "value"] })
], IonRadioGroup);
export { IonRadioGroup };
let IonRange = class IonRange {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange", "ionFocus", "ionBlur"]);
    }
};
IonRange.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonRange = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "debounce", "disabled", "dualKnobs", "max", "min", "mode", "name", "pin", "snaps", "step", "ticks", "value"] }),
    Component({ selector: "ion-range", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "debounce", "disabled", "dualKnobs", "max", "min", "mode", "name", "pin", "snaps", "step", "ticks", "value"] })
], IonRange);
export { IonRange };
let IonRefresher = class IonRefresher {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionRefresh", "ionPull", "ionStart"]);
    }
};
IonRefresher.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonRefresher = tslib_1.__decorate([
    ProxyCmp({ inputs: ["closeDuration", "disabled", "pullFactor", "pullMax", "pullMin", "snapbackDuration"], "methods": ["complete", "cancel", "getProgress"] }),
    Component({ selector: "ion-refresher", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["closeDuration", "disabled", "pullFactor", "pullMax", "pullMin", "snapbackDuration"] })
], IonRefresher);
export { IonRefresher };
let IonRefresherContent = class IonRefresherContent {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonRefresherContent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonRefresherContent = tslib_1.__decorate([
    ProxyCmp({ inputs: ["pullingIcon", "pullingText", "refreshingSpinner", "refreshingText"] }),
    Component({ selector: "ion-refresher-content", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["pullingIcon", "pullingText", "refreshingSpinner", "refreshingText"] })
], IonRefresherContent);
export { IonRefresherContent };
let IonReorder = class IonReorder {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonReorder.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonReorder = tslib_1.__decorate([
    Component({ selector: "ion-reorder", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
], IonReorder);
export { IonReorder };
let IonReorderGroup = class IonReorderGroup {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionItemReorder"]);
    }
};
IonReorderGroup.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonReorderGroup = tslib_1.__decorate([
    ProxyCmp({ inputs: ["disabled"], "methods": ["complete"] }),
    Component({ selector: "ion-reorder-group", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled"] })
], IonReorderGroup);
export { IonReorderGroup };
let IonRippleEffect = class IonRippleEffect {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonRippleEffect.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonRippleEffect = tslib_1.__decorate([
    ProxyCmp({ inputs: ["type"], "methods": ["addRipple"] }),
    Component({ selector: "ion-ripple-effect", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["type"] })
], IonRippleEffect);
export { IonRippleEffect };
let IonRow = class IonRow {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonRow.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonRow = tslib_1.__decorate([
    Component({ selector: "ion-row", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
], IonRow);
export { IonRow };
let IonSearchbar = class IonSearchbar {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionInput", "ionChange", "ionCancel", "ionClear", "ionBlur", "ionFocus"]);
    }
};
IonSearchbar.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonSearchbar = tslib_1.__decorate([
    ProxyCmp({ inputs: ["animated", "autocomplete", "autocorrect", "cancelButtonIcon", "cancelButtonText", "clearIcon", "color", "debounce", "disabled", "enterkeyhint", "inputmode", "mode", "placeholder", "searchIcon", "showCancelButton", "showClearButton", "spellcheck", "type", "value"], "methods": ["setFocus", "getInputElement"] }),
    Component({ selector: "ion-searchbar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["animated", "autocomplete", "autocorrect", "cancelButtonIcon", "cancelButtonText", "clearIcon", "color", "debounce", "disabled", "enterkeyhint", "inputmode", "mode", "placeholder", "searchIcon", "showCancelButton", "showClearButton", "spellcheck", "type", "value"] })
], IonSearchbar);
export { IonSearchbar };
let IonSegment = class IonSegment {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange"]);
    }
};
IonSegment.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonSegment = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "disabled", "mode", "scrollable", "swipeGesture", "value"] }),
    Component({ selector: "ion-segment", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "disabled", "mode", "scrollable", "swipeGesture", "value"] })
], IonSegment);
export { IonSegment };
let IonSegmentButton = class IonSegmentButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSegmentButton.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonSegmentButton = tslib_1.__decorate([
    ProxyCmp({ inputs: ["disabled", "layout", "mode", "type", "value"] }),
    Component({ selector: "ion-segment-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled", "layout", "mode", "type", "value"] })
], IonSegmentButton);
export { IonSegmentButton };
let IonSelect = class IonSelect {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange", "ionCancel", "ionFocus", "ionBlur"]);
    }
};
IonSelect.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonSelect = tslib_1.__decorate([
    ProxyCmp({ inputs: ["cancelText", "compareWith", "disabled", "interface", "interfaceOptions", "mode", "multiple", "name", "okText", "placeholder", "selectedText", "value"], "methods": ["open"] }),
    Component({ selector: "ion-select", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["cancelText", "compareWith", "disabled", "interface", "interfaceOptions", "mode", "multiple", "name", "okText", "placeholder", "selectedText", "value"] })
], IonSelect);
export { IonSelect };
let IonSelectOption = class IonSelectOption {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSelectOption.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonSelectOption = tslib_1.__decorate([
    ProxyCmp({ inputs: ["disabled", "value"] }),
    Component({ selector: "ion-select-option", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled", "value"] })
], IonSelectOption);
export { IonSelectOption };
let IonSkeletonText = class IonSkeletonText {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSkeletonText.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonSkeletonText = tslib_1.__decorate([
    ProxyCmp({ inputs: ["animated"] }),
    Component({ selector: "ion-skeleton-text", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["animated"] })
], IonSkeletonText);
export { IonSkeletonText };
let IonSlide = class IonSlide {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSlide.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonSlide = tslib_1.__decorate([
    Component({ selector: "ion-slide", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
], IonSlide);
export { IonSlide };
let IonSlides = class IonSlides {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionSlidesDidLoad", "ionSlideTap", "ionSlideDoubleTap", "ionSlideWillChange", "ionSlideDidChange", "ionSlideNextStart", "ionSlidePrevStart", "ionSlideNextEnd", "ionSlidePrevEnd", "ionSlideTransitionStart", "ionSlideTransitionEnd", "ionSlideDrag", "ionSlideReachStart", "ionSlideReachEnd", "ionSlideTouchStart", "ionSlideTouchEnd"]);
    }
};
IonSlides.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonSlides = tslib_1.__decorate([
    ProxyCmp({ inputs: ["mode", "options", "pager", "scrollbar"], "methods": ["update", "updateAutoHeight", "slideTo", "slideNext", "slidePrev", "getActiveIndex", "getPreviousIndex", "length", "isEnd", "isBeginning", "startAutoplay", "stopAutoplay", "lockSwipeToNext", "lockSwipeToPrev", "lockSwipes", "getSwiper"] }),
    Component({ selector: "ion-slides", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["mode", "options", "pager", "scrollbar"] })
], IonSlides);
export { IonSlides };
let IonSpinner = class IonSpinner {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSpinner.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonSpinner = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "duration", "name", "paused"] }),
    Component({ selector: "ion-spinner", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "duration", "name", "paused"] })
], IonSpinner);
export { IonSpinner };
let IonSplitPane = class IonSplitPane {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionSplitPaneVisible"]);
    }
};
IonSplitPane.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonSplitPane = tslib_1.__decorate([
    ProxyCmp({ inputs: ["contentId", "disabled", "when"] }),
    Component({ selector: "ion-split-pane", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["contentId", "disabled", "when"] })
], IonSplitPane);
export { IonSplitPane };
let IonTabBar = class IonTabBar {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonTabBar.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonTabBar = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "mode", "selectedTab", "translucent"] }),
    Component({ selector: "ion-tab-bar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode", "selectedTab", "translucent"] })
], IonTabBar);
export { IonTabBar };
let IonTabButton = class IonTabButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonTabButton.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonTabButton = tslib_1.__decorate([
    ProxyCmp({ inputs: ["disabled", "download", "href", "layout", "mode", "rel", "selected", "tab", "target"] }),
    Component({ selector: "ion-tab-button", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled", "download", "href", "layout", "mode", "rel", "selected", "tab", "target"] })
], IonTabButton);
export { IonTabButton };
let IonText = class IonText {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonText.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonText = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "mode"] }),
    Component({ selector: "ion-text", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
], IonText);
export { IonText };
let IonTextarea = class IonTextarea {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange", "ionInput", "ionBlur", "ionFocus"]);
    }
};
IonTextarea.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonTextarea = tslib_1.__decorate([
    ProxyCmp({ inputs: ["autoGrow", "autocapitalize", "autofocus", "clearOnEdit", "color", "cols", "debounce", "disabled", "enterkeyhint", "inputmode", "maxlength", "minlength", "mode", "name", "placeholder", "readonly", "required", "rows", "spellcheck", "value", "wrap"], "methods": ["setFocus", "getInputElement"] }),
    Component({ selector: "ion-textarea", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["autoGrow", "autocapitalize", "autofocus", "clearOnEdit", "color", "cols", "debounce", "disabled", "enterkeyhint", "inputmode", "maxlength", "minlength", "mode", "name", "placeholder", "readonly", "required", "rows", "spellcheck", "value", "wrap"] })
], IonTextarea);
export { IonTextarea };
let IonThumbnail = class IonThumbnail {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonThumbnail.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonThumbnail = tslib_1.__decorate([
    Component({ selector: "ion-thumbnail", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>" })
], IonThumbnail);
export { IonThumbnail };
let IonTitle = class IonTitle {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonTitle.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonTitle = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "size"] }),
    Component({ selector: "ion-title", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "size"] })
], IonTitle);
export { IonTitle };
let IonToggle = class IonToggle {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["ionChange", "ionFocus", "ionBlur"]);
    }
};
IonToggle.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonToggle = tslib_1.__decorate([
    ProxyCmp({ inputs: ["checked", "color", "disabled", "mode", "name", "value"] }),
    Component({ selector: "ion-toggle", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["checked", "color", "disabled", "mode", "name", "value"] })
], IonToggle);
export { IonToggle };
let IonToolbar = class IonToolbar {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonToolbar.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgZone }
];
IonToolbar = tslib_1.__decorate([
    ProxyCmp({ inputs: ["color", "mode"] }),
    Component({ selector: "ion-toolbar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["color", "mode"] })
], IonToolbar);
export { IonToolbar };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveGllcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bpb25pYy9hbmd1bGFyLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9wcm94aWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7QUFDcEIsb0JBQW9CO0FBQ3BCLDhDQUE4QztBQUM5QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hILE9BQU8sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFLekQsSUFBYSxNQUFNLEdBQW5CLE1BQWEsTUFBTTtJQUVqQixZQUFZLENBQW9CLEVBQUUsQ0FBYSxFQUFZLENBQVM7UUFBVCxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQ2xFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNYLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQztJQUM1QixDQUFDO0NBQ0YsQ0FBQTs7WUFKZ0IsaUJBQWlCO1lBQUssVUFBVTtZQUFlLE1BQU07O0FBRnpELE1BQU07SUFEbEIsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSwyQkFBMkIsRUFBRSxDQUFDO0dBQzlHLE1BQU0sQ0FNbEI7U0FOWSxNQUFNO0FBVW5CLElBQWEsU0FBUyxHQUF0QixNQUFhLFNBQVM7SUFFcEIsWUFBWSxDQUFvQixFQUFFLENBQWEsRUFBWSxDQUFTO1FBQVQsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUNsRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDWCxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUM7SUFDNUIsQ0FBQztDQUNGLENBQUE7O1lBSmdCLGlCQUFpQjtZQUFLLFVBQVU7WUFBZSxN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QUMsQ0FBQyxhQUFhLENBQUM7SUFDNUIsQ0FBQztDQUNGLENBQUE7O1lBSmdCLGlCQUFpQjtZQUFLLFVBQVU7WUFBZSxNQUFNOztBQUZ6RCxVQUFVO0lBRnRCLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ3ZDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUM7R0FDN0ksVUFBVSxDQU10QjtTQU5ZLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuLyogdHNsaW50OmRpc2FibGUgKi9cbi8qIGF1dG8tZ2VuZXJhdGVkIGFuZ3VsYXIgZGlyZWN0aXZlIHByb3hpZXMgKi9cbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE5nWm9uZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBQcm94eUNtcCwgcHJveHlPdXRwdXRzIH0gZnJvbSBcIi4vcHJveGllcy11dGlsc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50cyB9IGZyb20gXCJAaW9uaWMvY29yZVwiO1xuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkFwcCBleHRlbmRzIENvbXBvbmVudHMuSW9uQXBwIHtcbn1cbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tYXBwXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIgfSlcbmV4cG9ydCBjbGFzcyBJb25BcHAge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkF2YXRhciBleHRlbmRzIENvbXBvbmVudHMuSW9uQXZhdGFyIHtcbn1cbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tYXZhdGFyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIgfSlcbmV4cG9ydCBjbGFzcyBJb25BdmF0YXIge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkJhY2tCdXR0b24gZXh0ZW5kcyBDb21wb25lbnRzLklvbkJhY2tCdXR0b24ge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xvclwiLCBcImRlZmF1bHRIcmVmXCIsIFwiZGlzYWJsZWRcIiwgXCJpY29uXCIsIFwibW9kZVwiLCBcInJvdXRlckFuaW1hdGlvblwiLCBcInRleHRcIiwgXCJ0eXBlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWJhY2stYnV0dG9uXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJkZWZhdWx0SHJlZlwiLCBcImRpc2FibGVkXCIsIFwiaWNvblwiLCBcIm1vZGVcIiwgXCJyb3V0ZXJBbmltYXRpb25cIiwgXCJ0ZXh0XCIsIFwidHlwZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkJhY2tCdXR0b24ge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkJhY2tkcm9wIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25CYWNrZHJvcCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcInN0b3BQcm9wYWdhdGlvblwiLCBcInRhcHBhYmxlXCIsIFwidmlzaWJsZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1iYWNrZHJvcFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcInN0b3BQcm9wYWdhdGlvblwiLCBcInRhcHBhYmxlXCIsIFwidmlzaWJsZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkJhY2tkcm9wIHtcbiAgaW9uQmFja2Ryb3BUYXAhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uQmFja2Ryb3BUYXBcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uQmFkZ2UgZXh0ZW5kcyBDb21wb25lbnRzLklvbkJhZGdlIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWJhZGdlXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uQmFkZ2Uge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkJ1dHRvbiBleHRlbmRzIENvbXBvbmVudHMuSW9uQnV0dG9uIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYnV0dG9uVHlwZVwiLCBcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJkb3dubG9hZFwiLCBcImV4cGFuZFwiLCBcImZpbGxcIiwgXCJocmVmXCIsIFwibW9kZVwiLCBcInJlbFwiLCBcInJvdXRlckFuaW1hdGlvblwiLCBcInJvdXRlckRpcmVjdGlvblwiLCBcInNoYXBlXCIsIFwic2l6ZVwiLCBcInN0cm9uZ1wiLCBcInRhcmdldFwiLCBcInR5cGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tYnV0dG9uXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYnV0dG9uVHlwZVwiLCBcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJkb3dubG9hZFwiLCBcImV4cGFuZFwiLCBcImZpbGxcIiwgXCJocmVmXCIsIFwibW9kZVwiLCBcInJlbFwiLCBcInJvdXRlckFuaW1hdGlvblwiLCBcInJvdXRlckRpcmVjdGlvblwiLCBcInNoYXBlXCIsIFwic2l6ZVwiLCBcInN0cm9uZ1wiLCBcInRhcmdldFwiLCBcInR5cGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25CdXR0b24ge1xuICBpb25Gb2N1cyE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkJsdXIhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uRm9jdXNcIiwgXCJpb25CbHVyXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkJ1dHRvbnMgZXh0ZW5kcyBDb21wb25lbnRzLklvbkJ1dHRvbnMge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xsYXBzZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1idXR0b25zXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sbGFwc2VcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25CdXR0b25zIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25DYXJkIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25DYXJkIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYnV0dG9uXCIsIFwiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcImRvd25sb2FkXCIsIFwiaHJlZlwiLCBcIm1vZGVcIiwgXCJyZWxcIiwgXCJyb3V0ZXJBbmltYXRpb25cIiwgXCJyb3V0ZXJEaXJlY3Rpb25cIiwgXCJ0YXJnZXRcIiwgXCJ0eXBlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWNhcmRcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJidXR0b25cIiwgXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwiZG93bmxvYWRcIiwgXCJocmVmXCIsIFwibW9kZVwiLCBcInJlbFwiLCBcInJvdXRlckFuaW1hdGlvblwiLCBcInJvdXRlckRpcmVjdGlvblwiLCBcInRhcmdldFwiLCBcInR5cGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25DYXJkIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25DYXJkQ29udGVudCBleHRlbmRzIENvbXBvbmVudHMuSW9uQ2FyZENvbnRlbnQge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJtb2RlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWNhcmQtY29udGVudFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcIm1vZGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25DYXJkQ29udGVudCB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uQ2FyZEhlYWRlciBleHRlbmRzIENvbXBvbmVudHMuSW9uQ2FyZEhlYWRlciB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwibW9kZVwiLCBcInRyYW5zbHVjZW50XCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWNhcmQtaGVhZGVyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCIsIFwidHJhbnNsdWNlbnRcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25DYXJkSGVhZGVyIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25DYXJkU3VidGl0bGUgZXh0ZW5kcyBDb21wb25lbnRzLklvbkNhcmRTdWJ0aXRsZSB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwibW9kZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1jYXJkLXN1YnRpdGxlXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uQ2FyZFN1YnRpdGxlIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25DYXJkVGl0bGUgZXh0ZW5kcyBDb21wb25lbnRzLklvbkNhcmRUaXRsZSB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwibW9kZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1jYXJkLXRpdGxlXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uQ2FyZFRpdGxlIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25DaGVja2JveCBleHRlbmRzIENvbXBvbmVudHMuSW9uQ2hlY2tib3gge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjaGVja2VkXCIsIFwiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcImluZGV0ZXJtaW5hdGVcIiwgXCJtb2RlXCIsIFwibmFtZVwiLCBcInZhbHVlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWNoZWNrYm94XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY2hlY2tlZFwiLCBcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJpbmRldGVybWluYXRlXCIsIFwibW9kZVwiLCBcIm5hbWVcIiwgXCJ2YWx1ZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkNoZWNrYm94IHtcbiAgaW9uQ2hhbmdlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uRm9jdXMhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25CbHVyITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbkNoYW5nZVwiLCBcImlvbkZvY3VzXCIsIFwiaW9uQmx1clwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25DaGlwIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25DaGlwIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcIm1vZGVcIiwgXCJvdXRsaW5lXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWNoaXBcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwibW9kZVwiLCBcIm91dGxpbmVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25DaGlwIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25Db2wgZXh0ZW5kcyBDb21wb25lbnRzLklvbkNvbCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcIm9mZnNldFwiLCBcIm9mZnNldExnXCIsIFwib2Zmc2V0TWRcIiwgXCJvZmZzZXRTbVwiLCBcIm9mZnNldFhsXCIsIFwib2Zmc2V0WHNcIiwgXCJwdWxsXCIsIFwicHVsbExnXCIsIFwicHVsbE1kXCIsIFwicHVsbFNtXCIsIFwicHVsbFhsXCIsIFwicHVsbFhzXCIsIFwicHVzaFwiLCBcInB1c2hMZ1wiLCBcInB1c2hNZFwiLCBcInB1c2hTbVwiLCBcInB1c2hYbFwiLCBcInB1c2hYc1wiLCBcInNpemVcIiwgXCJzaXplTGdcIiwgXCJzaXplTWRcIiwgXCJzaXplU21cIiwgXCJzaXplWGxcIiwgXCJzaXplWHNcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tY29sXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wib2Zmc2V0XCIsIFwib2Zmc2V0TGdcIiwgXCJvZmZzZXRNZFwiLCBcIm9mZnNldFNtXCIsIFwib2Zmc2V0WGxcIiwgXCJvZmZzZXRYc1wiLCBcInB1bGxcIiwgXCJwdWxsTGdcIiwgXCJwdWxsTWRcIiwgXCJwdWxsU21cIiwgXCJwdWxsWGxcIiwgXCJwdWxsWHNcIiwgXCJwdXNoXCIsIFwicHVzaExnXCIsIFwicHVzaE1kXCIsIFwicHVzaFNtXCIsIFwicHVzaFhsXCIsIFwicHVzaFhzXCIsIFwic2l6ZVwiLCBcInNpemVMZ1wiLCBcInNpemVNZFwiLCBcInNpemVTbVwiLCBcInNpemVYbFwiLCBcInNpemVYc1wiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkNvbCB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uQ29udGVudCBleHRlbmRzIENvbXBvbmVudHMuSW9uQ29udGVudCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwiZm9yY2VPdmVyc2Nyb2xsXCIsIFwiZnVsbHNjcmVlblwiLCBcInNjcm9sbEV2ZW50c1wiLCBcInNjcm9sbFhcIiwgXCJzY3JvbGxZXCJdLCBcIm1ldGhvZHNcIjogW1wiZ2V0U2Nyb2xsRWxlbWVudFwiLCBcInNjcm9sbFRvVG9wXCIsIFwic2Nyb2xsVG9Cb3R0b21cIiwgXCJzY3JvbGxCeVBvaW50XCIsIFwic2Nyb2xsVG9Qb2ludFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1jb250ZW50XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJmb3JjZU92ZXJzY3JvbGxcIiwgXCJmdWxsc2NyZWVuXCIsIFwic2Nyb2xsRXZlbnRzXCIsIFwic2Nyb2xsWFwiLCBcInNjcm9sbFlcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25Db250ZW50IHtcbiAgaW9uU2Nyb2xsU3RhcnQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25TY3JvbGwhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25TY3JvbGxFbmQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uU2Nyb2xsU3RhcnRcIiwgXCJpb25TY3JvbGxcIiwgXCJpb25TY3JvbGxFbmRcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uRGF0ZXRpbWUgZXh0ZW5kcyBDb21wb25lbnRzLklvbkRhdGV0aW1lIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY2FuY2VsVGV4dFwiLCBcImRheU5hbWVzXCIsIFwiZGF5U2hvcnROYW1lc1wiLCBcImRheVZhbHVlc1wiLCBcImRpc2FibGVkXCIsIFwiZGlzcGxheUZvcm1hdFwiLCBcImRpc3BsYXlUaW1lem9uZVwiLCBcImRvbmVUZXh0XCIsIFwiaG91clZhbHVlc1wiLCBcIm1heFwiLCBcIm1pblwiLCBcIm1pbnV0ZVZhbHVlc1wiLCBcIm1vZGVcIiwgXCJtb250aE5hbWVzXCIsIFwibW9udGhTaG9ydE5hbWVzXCIsIFwibW9udGhWYWx1ZXNcIiwgXCJuYW1lXCIsIFwicGlja2VyRm9ybWF0XCIsIFwicGlja2VyT3B0aW9uc1wiLCBcInBsYWNlaG9sZGVyXCIsIFwicmVhZG9ubHlcIiwgXCJ2YWx1ZVwiLCBcInllYXJWYWx1ZXNcIl0sIFwibWV0aG9kc1wiOiBbXCJvcGVuXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWRhdGV0aW1lXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY2FuY2VsVGV4dFwiLCBcImRheU5hbWVzXCIsIFwiZGF5U2hvcnROYW1lc1wiLCBcImRheVZhbHVlc1wiLCBcImRpc2FibGVkXCIsIFwiZGlzcGxheUZvcm1hdFwiLCBcImRpc3BsYXlUaW1lem9uZVwiLCBcImRvbmVUZXh0XCIsIFwiaG91clZhbHVlc1wiLCBcIm1heFwiLCBcIm1pblwiLCBcIm1pbnV0ZVZhbHVlc1wiLCBcIm1vZGVcIiwgXCJtb250aE5hbWVzXCIsIFwibW9udGhTaG9ydE5hbWVzXCIsIFwibW9udGhWYWx1ZXNcIiwgXCJuYW1lXCIsIFwicGlja2VyRm9ybWF0XCIsIFwicGlja2VyT3B0aW9uc1wiLCBcInBsYWNlaG9sZGVyXCIsIFwicmVhZG9ubHlcIiwgXCJ2YWx1ZVwiLCBcInllYXJWYWx1ZXNcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25EYXRldGltZSB7XG4gIGlvbkNhbmNlbCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkNoYW5nZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkZvY3VzITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uQmx1ciE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25DYW5jZWxcIiwgXCJpb25DaGFuZ2VcIiwgXCJpb25Gb2N1c1wiLCBcImlvbkJsdXJcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uRmFiIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25GYWIge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJhY3RpdmF0ZWRcIiwgXCJlZGdlXCIsIFwiaG9yaXpvbnRhbFwiLCBcInZlcnRpY2FsXCJdLCBcIm1ldGhvZHNcIjogW1wiY2xvc2VcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tZmFiXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYWN0aXZhdGVkXCIsIFwiZWRnZVwiLCBcImhvcml6b250YWxcIiwgXCJ2ZXJ0aWNhbFwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkZhYiB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uRmFiQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25GYWJCdXR0b24ge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJhY3RpdmF0ZWRcIiwgXCJjbG9zZUljb25cIiwgXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwiZG93bmxvYWRcIiwgXCJocmVmXCIsIFwibW9kZVwiLCBcInJlbFwiLCBcInJvdXRlckFuaW1hdGlvblwiLCBcInJvdXRlckRpcmVjdGlvblwiLCBcInNob3dcIiwgXCJzaXplXCIsIFwidGFyZ2V0XCIsIFwidHJhbnNsdWNlbnRcIiwgXCJ0eXBlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWZhYi1idXR0b25cIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJhY3RpdmF0ZWRcIiwgXCJjbG9zZUljb25cIiwgXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwiZG93bmxvYWRcIiwgXCJocmVmXCIsIFwibW9kZVwiLCBcInJlbFwiLCBcInJvdXRlckFuaW1hdGlvblwiLCBcInJvdXRlckRpcmVjdGlvblwiLCBcInNob3dcIiwgXCJzaXplXCIsIFwidGFyZ2V0XCIsIFwidHJhbnNsdWNlbnRcIiwgXCJ0eXBlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uRmFiQnV0dG9uIHtcbiAgaW9uRm9jdXMhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25CbHVyITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbkZvY3VzXCIsIFwiaW9uQmx1clwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25GYWJMaXN0IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25GYWJMaXN0IHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYWN0aXZhdGVkXCIsIFwic2lkZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1mYWItbGlzdFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImFjdGl2YXRlZFwiLCBcInNpZGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25GYWJMaXN0IHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25Gb290ZXIgZXh0ZW5kcyBDb21wb25lbnRzLklvbkZvb3RlciB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcIm1vZGVcIiwgXCJ0cmFuc2x1Y2VudFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1mb290ZXJcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJtb2RlXCIsIFwidHJhbnNsdWNlbnRcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25Gb290ZXIge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkdyaWQgZXh0ZW5kcyBDb21wb25lbnRzLklvbkdyaWQge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJmaXhlZFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1ncmlkXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiZml4ZWRcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25HcmlkIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25IZWFkZXIgZXh0ZW5kcyBDb21wb25lbnRzLklvbkhlYWRlciB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbGxhcHNlXCIsIFwibW9kZVwiLCBcInRyYW5zbHVjZW50XCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWhlYWRlclwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImNvbGxhcHNlXCIsIFwibW9kZVwiLCBcInRyYW5zbHVjZW50XCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uSGVhZGVyIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25JY29uIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25JY29uIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYXJpYUhpZGRlblwiLCBcImFyaWFMYWJlbFwiLCBcImNvbG9yXCIsIFwiZmxpcFJ0bFwiLCBcImljb25cIiwgXCJpb3NcIiwgXCJsYXp5XCIsIFwibWRcIiwgXCJtb2RlXCIsIFwibmFtZVwiLCBcInNhbml0aXplXCIsIFwic2l6ZVwiLCBcInNyY1wiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1pY29uXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYXJpYUhpZGRlblwiLCBcImFyaWFMYWJlbFwiLCBcImNvbG9yXCIsIFwiZmxpcFJ0bFwiLCBcImljb25cIiwgXCJpb3NcIiwgXCJsYXp5XCIsIFwibWRcIiwgXCJtb2RlXCIsIFwibmFtZVwiLCBcInNhbml0aXplXCIsIFwic2l6ZVwiLCBcInNyY1wiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkljb24ge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkltZyBleHRlbmRzIENvbXBvbmVudHMuSW9uSW1nIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYWx0XCIsIFwic3JjXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWltZ1wiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImFsdFwiLCBcInNyY1wiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkltZyB7XG4gIGlvbkltZ1dpbGxMb2FkITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uSW1nRGlkTG9hZCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkVycm9yITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbkltZ1dpbGxMb2FkXCIsIFwiaW9uSW1nRGlkTG9hZFwiLCBcImlvbkVycm9yXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkluZmluaXRlU2Nyb2xsIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25JbmZpbml0ZVNjcm9sbCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImRpc2FibGVkXCIsIFwicG9zaXRpb25cIiwgXCJ0aHJlc2hvbGRcIl0sIFwibWV0aG9kc1wiOiBbXCJjb21wbGV0ZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1pbmZpbml0ZS1zY3JvbGxcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJkaXNhYmxlZFwiLCBcInBvc2l0aW9uXCIsIFwidGhyZXNob2xkXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uSW5maW5pdGVTY3JvbGwge1xuICBpb25JbmZpbml0ZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25JbmZpbml0ZVwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25JbmZpbml0ZVNjcm9sbENvbnRlbnQgZXh0ZW5kcyBDb21wb25lbnRzLklvbkluZmluaXRlU2Nyb2xsQ29udGVudCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImxvYWRpbmdTcGlubmVyXCIsIFwibG9hZGluZ1RleHRcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24taW5maW5pdGUtc2Nyb2xsLWNvbnRlbnRcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJsb2FkaW5nU3Bpbm5lclwiLCBcImxvYWRpbmdUZXh0XCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uSW5maW5pdGVTY3JvbGxDb250ZW50IHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25JbnB1dCBleHRlbmRzIENvbXBvbmVudHMuSW9uSW5wdXQge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJhY2NlcHRcIiwgXCJhdXRvY2FwaXRhbGl6ZVwiLCBcImF1dG9jb21wbGV0ZVwiLCBcImF1dG9jb3JyZWN0XCIsIFwiYXV0b2ZvY3VzXCIsIFwiY2xlYXJJbnB1dFwiLCBcImNsZWFyT25FZGl0XCIsIFwiY29sb3JcIiwgXCJkZWJvdW5jZVwiLCBcImRpc2FibGVkXCIsIFwiZW50ZXJrZXloaW50XCIsIFwiaW5wdXRtb2RlXCIsIFwibWF4XCIsIFwibWF4bGVuZ3RoXCIsIFwibWluXCIsIFwibWlubGVuZ3RoXCIsIFwibW9kZVwiLCBcIm11bHRpcGxlXCIsIFwibmFtZVwiLCBcInBhdHRlcm5cIiwgXCJwbGFjZWhvbGRlclwiLCBcInJlYWRvbmx5XCIsIFwicmVxdWlyZWRcIiwgXCJzaXplXCIsIFwic3BlbGxjaGVja1wiLCBcInN0ZXBcIiwgXCJ0eXBlXCIsIFwidmFsdWVcIl0sIFwibWV0aG9kc1wiOiBbXCJzZXRGb2N1c1wiLCBcImdldElucHV0RWxlbWVudFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1pbnB1dFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImFjY2VwdFwiLCBcImF1dG9jYXBpdGFsaXplXCIsIFwiYXV0b2NvbXBsZXRlXCIsIFwiYXV0b2NvcnJlY3RcIiwgXCJhdXRvZm9jdXNcIiwgXCJjbGVhcklucHV0XCIsIFwiY2xlYXJPbkVkaXRcIiwgXCJjb2xvclwiLCBcImRlYm91bmNlXCIsIFwiZGlzYWJsZWRcIiwgXCJlbnRlcmtleWhpbnRcIiwgXCJpbnB1dG1vZGVcIiwgXCJtYXhcIiwgXCJtYXhsZW5ndGhcIiwgXCJtaW5cIiwgXCJtaW5sZW5ndGhcIiwgXCJtb2RlXCIsIFwibXVsdGlwbGVcIiwgXCJuYW1lXCIsIFwicGF0dGVyblwiLCBcInBsYWNlaG9sZGVyXCIsIFwicmVhZG9ubHlcIiwgXCJyZXF1aXJlZFwiLCBcInNpemVcIiwgXCJzcGVsbGNoZWNrXCIsIFwic3RlcFwiLCBcInR5cGVcIiwgXCJ2YWx1ZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbklucHV0IHtcbiAgaW9uSW5wdXQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25DaGFuZ2UhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25CbHVyITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uRm9jdXMhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uSW5wdXRcIiwgXCJpb25DaGFuZ2VcIiwgXCJpb25CbHVyXCIsIFwiaW9uRm9jdXNcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uSXRlbSBleHRlbmRzIENvbXBvbmVudHMuSW9uSXRlbSB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImJ1dHRvblwiLCBcImNvbG9yXCIsIFwiZGV0YWlsXCIsIFwiZGV0YWlsSWNvblwiLCBcImRpc2FibGVkXCIsIFwiZG93bmxvYWRcIiwgXCJocmVmXCIsIFwibGluZXNcIiwgXCJtb2RlXCIsIFwicmVsXCIsIFwicm91dGVyQW5pbWF0aW9uXCIsIFwicm91dGVyRGlyZWN0aW9uXCIsIFwidGFyZ2V0XCIsIFwidHlwZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1pdGVtXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYnV0dG9uXCIsIFwiY29sb3JcIiwgXCJkZXRhaWxcIiwgXCJkZXRhaWxJY29uXCIsIFwiZGlzYWJsZWRcIiwgXCJkb3dubG9hZFwiLCBcImhyZWZcIiwgXCJsaW5lc1wiLCBcIm1vZGVcIiwgXCJyZWxcIiwgXCJyb3V0ZXJBbmltYXRpb25cIiwgXCJyb3V0ZXJEaXJlY3Rpb25cIiwgXCJ0YXJnZXRcIiwgXCJ0eXBlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uSXRlbSB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uSXRlbURpdmlkZXIgZXh0ZW5kcyBDb21wb25lbnRzLklvbkl0ZW1EaXZpZGVyIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCIsIFwic3RpY2t5XCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWl0ZW0tZGl2aWRlclwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImNvbG9yXCIsIFwibW9kZVwiLCBcInN0aWNreVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkl0ZW1EaXZpZGVyIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25JdGVtR3JvdXAgZXh0ZW5kcyBDb21wb25lbnRzLklvbkl0ZW1Hcm91cCB7XG59XG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWl0ZW0tZ3JvdXBcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiB9KVxuZXhwb3J0IGNsYXNzIElvbkl0ZW1Hcm91cCB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uSXRlbU9wdGlvbiBleHRlbmRzIENvbXBvbmVudHMuSW9uSXRlbU9wdGlvbiB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJkb3dubG9hZFwiLCBcImV4cGFuZGFibGVcIiwgXCJocmVmXCIsIFwibW9kZVwiLCBcInJlbFwiLCBcInRhcmdldFwiLCBcInR5cGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24taXRlbS1vcHRpb25cIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwiZG93bmxvYWRcIiwgXCJleHBhbmRhYmxlXCIsIFwiaHJlZlwiLCBcIm1vZGVcIiwgXCJyZWxcIiwgXCJ0YXJnZXRcIiwgXCJ0eXBlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uSXRlbU9wdGlvbiB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uSXRlbU9wdGlvbnMgZXh0ZW5kcyBDb21wb25lbnRzLklvbkl0ZW1PcHRpb25zIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wic2lkZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1pdGVtLW9wdGlvbnNcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJzaWRlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uSXRlbU9wdGlvbnMge1xuICBpb25Td2lwZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25Td2lwZVwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25JdGVtU2xpZGluZyBleHRlbmRzIENvbXBvbmVudHMuSW9uSXRlbVNsaWRpbmcge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJkaXNhYmxlZFwiXSwgXCJtZXRob2RzXCI6IFtcImdldE9wZW5BbW91bnRcIiwgXCJnZXRTbGlkaW5nUmF0aW9cIiwgXCJvcGVuXCIsIFwiY2xvc2VcIiwgXCJjbG9zZU9wZW5lZFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1pdGVtLXNsaWRpbmdcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJkaXNhYmxlZFwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbkl0ZW1TbGlkaW5nIHtcbiAgaW9uRHJhZyE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25EcmFnXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbkxhYmVsIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25MYWJlbCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwibW9kZVwiLCBcInBvc2l0aW9uXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWxhYmVsXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCIsIFwicG9zaXRpb25cIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25MYWJlbCB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uTGlzdCBleHRlbmRzIENvbXBvbmVudHMuSW9uTGlzdCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImluc2V0XCIsIFwibGluZXNcIiwgXCJtb2RlXCJdLCBcIm1ldGhvZHNcIjogW1wiY2xvc2VTbGlkaW5nSXRlbXNcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tbGlzdFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImluc2V0XCIsIFwibGluZXNcIiwgXCJtb2RlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uTGlzdCB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uTGlzdEhlYWRlciBleHRlbmRzIENvbXBvbmVudHMuSW9uTGlzdEhlYWRlciB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwibGluZXNcIiwgXCJtb2RlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLWxpc3QtaGVhZGVyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJsaW5lc1wiLCBcIm1vZGVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25MaXN0SGVhZGVyIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25NZW51IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25NZW51IHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29udGVudElkXCIsIFwiZGlzYWJsZWRcIiwgXCJtYXhFZGdlU3RhcnRcIiwgXCJtZW51SWRcIiwgXCJzaWRlXCIsIFwic3dpcGVHZXN0dXJlXCIsIFwidHlwZVwiXSwgXCJtZXRob2RzXCI6IFtcImlzT3BlblwiLCBcImlzQWN0aXZlXCIsIFwib3BlblwiLCBcImNsb3NlXCIsIFwidG9nZ2xlXCIsIFwic2V0T3BlblwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1tZW51XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29udGVudElkXCIsIFwiZGlzYWJsZWRcIiwgXCJtYXhFZGdlU3RhcnRcIiwgXCJtZW51SWRcIiwgXCJzaWRlXCIsIFwic3dpcGVHZXN0dXJlXCIsIFwidHlwZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbk1lbnUge1xuICBpb25XaWxsT3BlbiE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbldpbGxDbG9zZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkRpZE9wZW4hOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25EaWRDbG9zZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25XaWxsT3BlblwiLCBcImlvbldpbGxDbG9zZVwiLCBcImlvbkRpZE9wZW5cIiwgXCJpb25EaWRDbG9zZVwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25NZW51QnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25NZW51QnV0dG9uIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYXV0b0hpZGVcIiwgXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwibWVudVwiLCBcIm1vZGVcIiwgXCJ0eXBlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLW1lbnUtYnV0dG9uXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYXV0b0hpZGVcIiwgXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwibWVudVwiLCBcIm1vZGVcIiwgXCJ0eXBlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uTWVudUJ1dHRvbiB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uTWVudVRvZ2dsZSBleHRlbmRzIENvbXBvbmVudHMuSW9uTWVudVRvZ2dsZSB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImF1dG9IaWRlXCIsIFwibWVudVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1tZW51LXRvZ2dsZVwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImF1dG9IaWRlXCIsIFwibWVudVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbk1lbnVUb2dnbGUge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbk5hdiBleHRlbmRzIENvbXBvbmVudHMuSW9uTmF2IHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYW5pbWF0ZWRcIiwgXCJhbmltYXRpb25cIiwgXCJyb290XCIsIFwicm9vdFBhcmFtc1wiLCBcInN3aXBlR2VzdHVyZVwiXSwgXCJtZXRob2RzXCI6IFtcInB1c2hcIiwgXCJpbnNlcnRcIiwgXCJpbnNlcnRQYWdlc1wiLCBcInBvcFwiLCBcInBvcFRvXCIsIFwicG9wVG9Sb290XCIsIFwicmVtb3ZlSW5kZXhcIiwgXCJzZXRSb290XCIsIFwic2V0UGFnZXNcIiwgXCJnZXRBY3RpdmVcIiwgXCJnZXRCeUluZGV4XCIsIFwiY2FuR29CYWNrXCIsIFwiZ2V0UHJldmlvdXNcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tbmF2XCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiYW5pbWF0ZWRcIiwgXCJhbmltYXRpb25cIiwgXCJyb290XCIsIFwicm9vdFBhcmFtc1wiLCBcInN3aXBlR2VzdHVyZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbk5hdiB7XG4gIGlvbk5hdldpbGxDaGFuZ2UhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25OYXZEaWRDaGFuZ2UhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uTmF2V2lsbENoYW5nZVwiLCBcImlvbk5hdkRpZENoYW5nZVwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25OYXZMaW5rIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25OYXZMaW5rIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29tcG9uZW50XCIsIFwiY29tcG9uZW50UHJvcHNcIiwgXCJyb3V0ZXJBbmltYXRpb25cIiwgXCJyb3V0ZXJEaXJlY3Rpb25cIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tbmF2LWxpbmtcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJjb21wb25lbnRcIiwgXCJjb21wb25lbnRQcm9wc1wiLCBcInJvdXRlckFuaW1hdGlvblwiLCBcInJvdXRlckRpcmVjdGlvblwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbk5hdkxpbmsge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvbk5vdGUgZXh0ZW5kcyBDb21wb25lbnRzLklvbk5vdGUge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tbm90ZVwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImNvbG9yXCIsIFwibW9kZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvbk5vdGUge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblByb2dyZXNzQmFyIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25Qcm9ncmVzc0JhciB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImJ1ZmZlclwiLCBcImNvbG9yXCIsIFwibW9kZVwiLCBcInJldmVyc2VkXCIsIFwidHlwZVwiLCBcInZhbHVlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXByb2dyZXNzLWJhclwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImJ1ZmZlclwiLCBcImNvbG9yXCIsIFwibW9kZVwiLCBcInJldmVyc2VkXCIsIFwidHlwZVwiLCBcInZhbHVlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uUHJvZ3Jlc3NCYXIge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblJhZGlvIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25SYWRpbyB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJtb2RlXCIsIFwibmFtZVwiLCBcInZhbHVlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXJhZGlvXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcIm1vZGVcIiwgXCJuYW1lXCIsIFwidmFsdWVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25SYWRpbyB7XG4gIGlvbkZvY3VzITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uQmx1ciE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25Gb2N1c1wiLCBcImlvbkJsdXJcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uUmFkaW9Hcm91cCBleHRlbmRzIENvbXBvbmVudHMuSW9uUmFkaW9Hcm91cCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImFsbG93RW1wdHlTZWxlY3Rpb25cIiwgXCJuYW1lXCIsIFwidmFsdWVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tcmFkaW8tZ3JvdXBcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJhbGxvd0VtcHR5U2VsZWN0aW9uXCIsIFwibmFtZVwiLCBcInZhbHVlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uUmFkaW9Hcm91cCB7XG4gIGlvbkNoYW5nZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25DaGFuZ2VcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uUmFuZ2UgZXh0ZW5kcyBDb21wb25lbnRzLklvblJhbmdlIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJkZWJvdW5jZVwiLCBcImRpc2FibGVkXCIsIFwiZHVhbEtub2JzXCIsIFwibWF4XCIsIFwibWluXCIsIFwibW9kZVwiLCBcIm5hbWVcIiwgXCJwaW5cIiwgXCJzbmFwc1wiLCBcInN0ZXBcIiwgXCJ0aWNrc1wiLCBcInZhbHVlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXJhbmdlXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJkZWJvdW5jZVwiLCBcImRpc2FibGVkXCIsIFwiZHVhbEtub2JzXCIsIFwibWF4XCIsIFwibWluXCIsIFwibW9kZVwiLCBcIm5hbWVcIiwgXCJwaW5cIiwgXCJzbmFwc1wiLCBcInN0ZXBcIiwgXCJ0aWNrc1wiLCBcInZhbHVlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uUmFuZ2Uge1xuICBpb25DaGFuZ2UhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25Gb2N1cyE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkJsdXIhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uQ2hhbmdlXCIsIFwiaW9uRm9jdXNcIiwgXCJpb25CbHVyXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblJlZnJlc2hlciBleHRlbmRzIENvbXBvbmVudHMuSW9uUmVmcmVzaGVyIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY2xvc2VEdXJhdGlvblwiLCBcImRpc2FibGVkXCIsIFwicHVsbEZhY3RvclwiLCBcInB1bGxNYXhcIiwgXCJwdWxsTWluXCIsIFwic25hcGJhY2tEdXJhdGlvblwiXSwgXCJtZXRob2RzXCI6IFtcImNvbXBsZXRlXCIsIFwiY2FuY2VsXCIsIFwiZ2V0UHJvZ3Jlc3NcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tcmVmcmVzaGVyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY2xvc2VEdXJhdGlvblwiLCBcImRpc2FibGVkXCIsIFwicHVsbEZhY3RvclwiLCBcInB1bGxNYXhcIiwgXCJwdWxsTWluXCIsIFwic25hcGJhY2tEdXJhdGlvblwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblJlZnJlc2hlciB7XG4gIGlvblJlZnJlc2ghOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25QdWxsITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU3RhcnQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uUmVmcmVzaFwiLCBcImlvblB1bGxcIiwgXCJpb25TdGFydFwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25SZWZyZXNoZXJDb250ZW50IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25SZWZyZXNoZXJDb250ZW50IHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wicHVsbGluZ0ljb25cIiwgXCJwdWxsaW5nVGV4dFwiLCBcInJlZnJlc2hpbmdTcGlubmVyXCIsIFwicmVmcmVzaGluZ1RleHRcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tcmVmcmVzaGVyLWNvbnRlbnRcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJwdWxsaW5nSWNvblwiLCBcInB1bGxpbmdUZXh0XCIsIFwicmVmcmVzaGluZ1NwaW5uZXJcIiwgXCJyZWZyZXNoaW5nVGV4dFwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblJlZnJlc2hlckNvbnRlbnQge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblJlb3JkZXIgZXh0ZW5kcyBDb21wb25lbnRzLklvblJlb3JkZXIge1xufVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1yZW9yZGVyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIgfSlcbmV4cG9ydCBjbGFzcyBJb25SZW9yZGVyIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25SZW9yZGVyR3JvdXAgZXh0ZW5kcyBDb21wb25lbnRzLklvblJlb3JkZXJHcm91cCB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImRpc2FibGVkXCJdLCBcIm1ldGhvZHNcIjogW1wiY29tcGxldGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tcmVvcmRlci1ncm91cFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImRpc2FibGVkXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uUmVvcmRlckdyb3VwIHtcbiAgaW9uSXRlbVJlb3JkZXIhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uSXRlbVJlb3JkZXJcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uUmlwcGxlRWZmZWN0IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25SaXBwbGVFZmZlY3Qge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJ0eXBlXCJdLCBcIm1ldGhvZHNcIjogW1wiYWRkUmlwcGxlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXJpcHBsZS1lZmZlY3RcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJ0eXBlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uUmlwcGxlRWZmZWN0IHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25Sb3cgZXh0ZW5kcyBDb21wb25lbnRzLklvblJvdyB7XG59XG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXJvd1wiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiIH0pXG5leHBvcnQgY2xhc3MgSW9uUm93IHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25TZWFyY2hiYXIgZXh0ZW5kcyBDb21wb25lbnRzLklvblNlYXJjaGJhciB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImFuaW1hdGVkXCIsIFwiYXV0b2NvbXBsZXRlXCIsIFwiYXV0b2NvcnJlY3RcIiwgXCJjYW5jZWxCdXR0b25JY29uXCIsIFwiY2FuY2VsQnV0dG9uVGV4dFwiLCBcImNsZWFySWNvblwiLCBcImNvbG9yXCIsIFwiZGVib3VuY2VcIiwgXCJkaXNhYmxlZFwiLCBcImVudGVya2V5aGludFwiLCBcImlucHV0bW9kZVwiLCBcIm1vZGVcIiwgXCJwbGFjZWhvbGRlclwiLCBcInNlYXJjaEljb25cIiwgXCJzaG93Q2FuY2VsQnV0dG9uXCIsIFwic2hvd0NsZWFyQnV0dG9uXCIsIFwic3BlbGxjaGVja1wiLCBcInR5cGVcIiwgXCJ2YWx1ZVwiXSwgXCJtZXRob2RzXCI6IFtcInNldEZvY3VzXCIsIFwiZ2V0SW5wdXRFbGVtZW50XCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXNlYXJjaGJhclwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImFuaW1hdGVkXCIsIFwiYXV0b2NvbXBsZXRlXCIsIFwiYXV0b2NvcnJlY3RcIiwgXCJjYW5jZWxCdXR0b25JY29uXCIsIFwiY2FuY2VsQnV0dG9uVGV4dFwiLCBcImNsZWFySWNvblwiLCBcImNvbG9yXCIsIFwiZGVib3VuY2VcIiwgXCJkaXNhYmxlZFwiLCBcImVudGVya2V5aGludFwiLCBcImlucHV0bW9kZVwiLCBcIm1vZGVcIiwgXCJwbGFjZWhvbGRlclwiLCBcInNlYXJjaEljb25cIiwgXCJzaG93Q2FuY2VsQnV0dG9uXCIsIFwic2hvd0NsZWFyQnV0dG9uXCIsIFwic3BlbGxjaGVja1wiLCBcInR5cGVcIiwgXCJ2YWx1ZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblNlYXJjaGJhciB7XG4gIGlvbklucHV0ITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uQ2hhbmdlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uQ2FuY2VsITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uQ2xlYXIhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25CbHVyITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uRm9jdXMhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uSW5wdXRcIiwgXCJpb25DaGFuZ2VcIiwgXCJpb25DYW5jZWxcIiwgXCJpb25DbGVhclwiLCBcImlvbkJsdXJcIiwgXCJpb25Gb2N1c1wiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25TZWdtZW50IGV4dGVuZHMgQ29tcG9uZW50cy5Jb25TZWdtZW50IHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJkaXNhYmxlZFwiLCBcIm1vZGVcIiwgXCJzY3JvbGxhYmxlXCIsIFwic3dpcGVHZXN0dXJlXCIsIFwidmFsdWVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tc2VnbWVudFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJtb2RlXCIsIFwic2Nyb2xsYWJsZVwiLCBcInN3aXBlR2VzdHVyZVwiLCBcInZhbHVlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uU2VnbWVudCB7XG4gIGlvbkNoYW5nZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25DaGFuZ2VcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uU2VnbWVudEJ1dHRvbiBleHRlbmRzIENvbXBvbmVudHMuSW9uU2VnbWVudEJ1dHRvbiB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImRpc2FibGVkXCIsIFwibGF5b3V0XCIsIFwibW9kZVwiLCBcInR5cGVcIiwgXCJ2YWx1ZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1zZWdtZW50LWJ1dHRvblwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImRpc2FibGVkXCIsIFwibGF5b3V0XCIsIFwibW9kZVwiLCBcInR5cGVcIiwgXCJ2YWx1ZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblNlZ21lbnRCdXR0b24ge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblNlbGVjdCBleHRlbmRzIENvbXBvbmVudHMuSW9uU2VsZWN0IHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY2FuY2VsVGV4dFwiLCBcImNvbXBhcmVXaXRoXCIsIFwiZGlzYWJsZWRcIiwgXCJpbnRlcmZhY2VcIiwgXCJpbnRlcmZhY2VPcHRpb25zXCIsIFwibW9kZVwiLCBcIm11bHRpcGxlXCIsIFwibmFtZVwiLCBcIm9rVGV4dFwiLCBcInBsYWNlaG9sZGVyXCIsIFwic2VsZWN0ZWRUZXh0XCIsIFwidmFsdWVcIl0sIFwibWV0aG9kc1wiOiBbXCJvcGVuXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXNlbGVjdFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImNhbmNlbFRleHRcIiwgXCJjb21wYXJlV2l0aFwiLCBcImRpc2FibGVkXCIsIFwiaW50ZXJmYWNlXCIsIFwiaW50ZXJmYWNlT3B0aW9uc1wiLCBcIm1vZGVcIiwgXCJtdWx0aXBsZVwiLCBcIm5hbWVcIiwgXCJva1RleHRcIiwgXCJwbGFjZWhvbGRlclwiLCBcInNlbGVjdGVkVGV4dFwiLCBcInZhbHVlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uU2VsZWN0IHtcbiAgaW9uQ2hhbmdlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uQ2FuY2VsITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uRm9jdXMhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25CbHVyITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gICAgcHJveHlPdXRwdXRzKHRoaXMsIHRoaXMuZWwsIFtcImlvbkNoYW5nZVwiLCBcImlvbkNhbmNlbFwiLCBcImlvbkZvY3VzXCIsIFwiaW9uQmx1clwiXSk7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25TZWxlY3RPcHRpb24gZXh0ZW5kcyBDb21wb25lbnRzLklvblNlbGVjdE9wdGlvbiB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImRpc2FibGVkXCIsIFwidmFsdWVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tc2VsZWN0LW9wdGlvblwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImRpc2FibGVkXCIsIFwidmFsdWVcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25TZWxlY3RPcHRpb24ge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblNrZWxldG9uVGV4dCBleHRlbmRzIENvbXBvbmVudHMuSW9uU2tlbGV0b25UZXh0IHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiYW5pbWF0ZWRcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tc2tlbGV0b24tdGV4dFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImFuaW1hdGVkXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uU2tlbGV0b25UZXh0IHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25TbGlkZSBleHRlbmRzIENvbXBvbmVudHMuSW9uU2xpZGUge1xufVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1zbGlkZVwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiIH0pXG5leHBvcnQgY2xhc3MgSW9uU2xpZGUge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblNsaWRlcyBleHRlbmRzIENvbXBvbmVudHMuSW9uU2xpZGVzIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wibW9kZVwiLCBcIm9wdGlvbnNcIiwgXCJwYWdlclwiLCBcInNjcm9sbGJhclwiXSwgXCJtZXRob2RzXCI6IFtcInVwZGF0ZVwiLCBcInVwZGF0ZUF1dG9IZWlnaHRcIiwgXCJzbGlkZVRvXCIsIFwic2xpZGVOZXh0XCIsIFwic2xpZGVQcmV2XCIsIFwiZ2V0QWN0aXZlSW5kZXhcIiwgXCJnZXRQcmV2aW91c0luZGV4XCIsIFwibGVuZ3RoXCIsIFwiaXNFbmRcIiwgXCJpc0JlZ2lubmluZ1wiLCBcInN0YXJ0QXV0b3BsYXlcIiwgXCJzdG9wQXV0b3BsYXlcIiwgXCJsb2NrU3dpcGVUb05leHRcIiwgXCJsb2NrU3dpcGVUb1ByZXZcIiwgXCJsb2NrU3dpcGVzXCIsIFwiZ2V0U3dpcGVyXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXNsaWRlc1wiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcIm1vZGVcIiwgXCJvcHRpb25zXCIsIFwicGFnZXJcIiwgXCJzY3JvbGxiYXJcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25TbGlkZXMge1xuICBpb25TbGlkZXNEaWRMb2FkITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVUYXAhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25TbGlkZURvdWJsZVRhcCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblNsaWRlV2lsbENoYW5nZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblNsaWRlRGlkQ2hhbmdlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVOZXh0U3RhcnQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25TbGlkZVByZXZTdGFydCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblNsaWRlTmV4dEVuZCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblNsaWRlUHJldkVuZCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblNsaWRlVHJhbnNpdGlvblN0YXJ0ITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVUcmFuc2l0aW9uRW5kITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVEcmFnITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVSZWFjaFN0YXJ0ITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uU2xpZGVSZWFjaEVuZCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblNsaWRlVG91Y2hTdGFydCE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvblNsaWRlVG91Y2hFbmQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uU2xpZGVzRGlkTG9hZFwiLCBcImlvblNsaWRlVGFwXCIsIFwiaW9uU2xpZGVEb3VibGVUYXBcIiwgXCJpb25TbGlkZVdpbGxDaGFuZ2VcIiwgXCJpb25TbGlkZURpZENoYW5nZVwiLCBcImlvblNsaWRlTmV4dFN0YXJ0XCIsIFwiaW9uU2xpZGVQcmV2U3RhcnRcIiwgXCJpb25TbGlkZU5leHRFbmRcIiwgXCJpb25TbGlkZVByZXZFbmRcIiwgXCJpb25TbGlkZVRyYW5zaXRpb25TdGFydFwiLCBcImlvblNsaWRlVHJhbnNpdGlvbkVuZFwiLCBcImlvblNsaWRlRHJhZ1wiLCBcImlvblNsaWRlUmVhY2hTdGFydFwiLCBcImlvblNsaWRlUmVhY2hFbmRcIiwgXCJpb25TbGlkZVRvdWNoU3RhcnRcIiwgXCJpb25TbGlkZVRvdWNoRW5kXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblNwaW5uZXIgZXh0ZW5kcyBDb21wb25lbnRzLklvblNwaW5uZXIge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xvclwiLCBcImR1cmF0aW9uXCIsIFwibmFtZVwiLCBcInBhdXNlZFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1zcGlubmVyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJkdXJhdGlvblwiLCBcIm5hbWVcIiwgXCJwYXVzZWRcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25TcGlubmVyIHtcbiAgcHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoYzogQ2hhbmdlRGV0ZWN0b3JSZWYsIHI6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6OiBOZ1pvbmUpIHtcbiAgICBjLmRldGFjaCgpO1xuICAgIHRoaXMuZWwgPSByLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBJb25TcGxpdFBhbmUgZXh0ZW5kcyBDb21wb25lbnRzLklvblNwbGl0UGFuZSB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbnRlbnRJZFwiLCBcImRpc2FibGVkXCIsIFwid2hlblwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi1zcGxpdC1wYW5lXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29udGVudElkXCIsIFwiZGlzYWJsZWRcIiwgXCJ3aGVuXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uU3BsaXRQYW5lIHtcbiAgaW9uU3BsaXRQYW5lVmlzaWJsZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25TcGxpdFBhbmVWaXNpYmxlXCJdKTtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblRhYkJhciBleHRlbmRzIENvbXBvbmVudHMuSW9uVGFiQmFyIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCIsIFwic2VsZWN0ZWRUYWJcIiwgXCJ0cmFuc2x1Y2VudFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi10YWItYmFyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCIsIFwic2VsZWN0ZWRUYWJcIiwgXCJ0cmFuc2x1Y2VudFwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblRhYkJhciB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uVGFiQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25UYWJCdXR0b24ge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJkaXNhYmxlZFwiLCBcImRvd25sb2FkXCIsIFwiaHJlZlwiLCBcImxheW91dFwiLCBcIm1vZGVcIiwgXCJyZWxcIiwgXCJzZWxlY3RlZFwiLCBcInRhYlwiLCBcInRhcmdldFwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi10YWItYnV0dG9uXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiZGlzYWJsZWRcIiwgXCJkb3dubG9hZFwiLCBcImhyZWZcIiwgXCJsYXlvdXRcIiwgXCJtb2RlXCIsIFwicmVsXCIsIFwic2VsZWN0ZWRcIiwgXCJ0YWJcIiwgXCJ0YXJnZXRcIl0gfSlcbmV4cG9ydCBjbGFzcyBJb25UYWJCdXR0b24ge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblRleHQgZXh0ZW5kcyBDb21wb25lbnRzLklvblRleHQge1xufVxuQFByb3h5Q21wKHsgaW5wdXRzOiBbXCJjb2xvclwiLCBcIm1vZGVcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tdGV4dFwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImNvbG9yXCIsIFwibW9kZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblRleHQge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblRleHRhcmVhIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25UZXh0YXJlYSB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImF1dG9Hcm93XCIsIFwiYXV0b2NhcGl0YWxpemVcIiwgXCJhdXRvZm9jdXNcIiwgXCJjbGVhck9uRWRpdFwiLCBcImNvbG9yXCIsIFwiY29sc1wiLCBcImRlYm91bmNlXCIsIFwiZGlzYWJsZWRcIiwgXCJlbnRlcmtleWhpbnRcIiwgXCJpbnB1dG1vZGVcIiwgXCJtYXhsZW5ndGhcIiwgXCJtaW5sZW5ndGhcIiwgXCJtb2RlXCIsIFwibmFtZVwiLCBcInBsYWNlaG9sZGVyXCIsIFwicmVhZG9ubHlcIiwgXCJyZXF1aXJlZFwiLCBcInJvd3NcIiwgXCJzcGVsbGNoZWNrXCIsIFwidmFsdWVcIiwgXCJ3cmFwXCJdLCBcIm1ldGhvZHNcIjogW1wic2V0Rm9jdXNcIiwgXCJnZXRJbnB1dEVsZW1lbnRcIl0gfSlcbkBDb21wb25lbnQoeyBzZWxlY3RvcjogXCJpb24tdGV4dGFyZWFcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiwgaW5wdXRzOiBbXCJhdXRvR3Jvd1wiLCBcImF1dG9jYXBpdGFsaXplXCIsIFwiYXV0b2ZvY3VzXCIsIFwiY2xlYXJPbkVkaXRcIiwgXCJjb2xvclwiLCBcImNvbHNcIiwgXCJkZWJvdW5jZVwiLCBcImRpc2FibGVkXCIsIFwiZW50ZXJrZXloaW50XCIsIFwiaW5wdXRtb2RlXCIsIFwibWF4bGVuZ3RoXCIsIFwibWlubGVuZ3RoXCIsIFwibW9kZVwiLCBcIm5hbWVcIiwgXCJwbGFjZWhvbGRlclwiLCBcInJlYWRvbmx5XCIsIFwicmVxdWlyZWRcIiwgXCJyb3dzXCIsIFwic3BlbGxjaGVja1wiLCBcInZhbHVlXCIsIFwid3JhcFwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblRleHRhcmVhIHtcbiAgaW9uQ2hhbmdlITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uSW5wdXQhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBpb25CbHVyITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uRm9jdXMhOiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+O1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgICBwcm94eU91dHB1dHModGhpcywgdGhpcy5lbCwgW1wiaW9uQ2hhbmdlXCIsIFwiaW9uSW5wdXRcIiwgXCJpb25CbHVyXCIsIFwiaW9uRm9jdXNcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uVGh1bWJuYWlsIGV4dGVuZHMgQ29tcG9uZW50cy5Jb25UaHVtYm5haWwge1xufVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi10aHVtYm5haWxcIiwgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIHRlbXBsYXRlOiBcIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cIiB9KVxuZXhwb3J0IGNsYXNzIElvblRodW1ibmFpbCB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uVGl0bGUgZXh0ZW5kcyBDb21wb25lbnRzLklvblRpdGxlIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY29sb3JcIiwgXCJzaXplXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXRpdGxlXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJzaXplXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uVGl0bGUge1xuICBwcm90ZWN0ZWQgZWw6IEhUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihjOiBDaGFuZ2VEZXRlY3RvclJlZiwgcjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHo6IE5nWm9uZSkge1xuICAgIGMuZGV0YWNoKCk7XG4gICAgdGhpcy5lbCA9IHIubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIElvblRvZ2dsZSBleHRlbmRzIENvbXBvbmVudHMuSW9uVG9nZ2xlIHtcbn1cbkBQcm94eUNtcCh7IGlucHV0czogW1wiY2hlY2tlZFwiLCBcImNvbG9yXCIsIFwiZGlzYWJsZWRcIiwgXCJtb2RlXCIsIFwibmFtZVwiLCBcInZhbHVlXCJdIH0pXG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6IFwiaW9uLXRvZ2dsZVwiLCBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgdGVtcGxhdGU6IFwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlwiLCBpbnB1dHM6IFtcImNoZWNrZWRcIiwgXCJjb2xvclwiLCBcImRpc2FibGVkXCIsIFwibW9kZVwiLCBcIm5hbWVcIiwgXCJ2YWx1ZVwiXSB9KVxuZXhwb3J0IGNsYXNzIElvblRvZ2dsZSB7XG4gIGlvbkNoYW5nZSE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIGlvbkZvY3VzITogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PjtcbiAgaW9uQmx1ciE6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD47XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICAgIHByb3h5T3V0cHV0cyh0aGlzLCB0aGlzLmVsLCBbXCJpb25DaGFuZ2VcIiwgXCJpb25Gb2N1c1wiLCBcImlvbkJsdXJcIl0pO1xuICB9XG59XG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSW9uVG9vbGJhciBleHRlbmRzIENvbXBvbmVudHMuSW9uVG9vbGJhciB7XG59XG5AUHJveHlDbXAoeyBpbnB1dHM6IFtcImNvbG9yXCIsIFwibW9kZVwiXSB9KVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiBcImlvbi10b29sYmFyXCIsIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCB0ZW1wbGF0ZTogXCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XCIsIGlucHV0czogW1wiY29sb3JcIiwgXCJtb2RlXCJdIH0pXG5leHBvcnQgY2xhc3MgSW9uVG9vbGJhciB7XG4gIHByb3RlY3RlZCBlbDogSFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKGM6IENoYW5nZURldGVjdG9yUmVmLCByOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgejogTmdab25lKSB7XG4gICAgYy5kZXRhY2goKTtcbiAgICB0aGlzLmVsID0gci5uYXRpdmVFbGVtZW50O1xuICB9XG59XG4iXX0=