(self["webpackChunkM8"] = self["webpackChunkM8"] || []).push([["src_app_codbar_codbar_module_ts"],{

/***/ 9745:
/*!***************************************************************************!*\
  !*** ./node_modules/hide-keyboard/__ivy_ngcc__/fesm2015/hide-keyboard.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HideKeyboardDirective": () => (/* binding */ HideKeyboardDirective),
/* harmony export */   "HideKeyboardModule": () => (/* binding */ HideKeyboardModule)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7716);



class HideKeyboardDirective {
    constructor(el) {
        this.el = el;
        this.focusTimeout = 500;
        this.readonly = true;
        this.setReadOnly(this.readonly);
        setTimeout(() => {
            this.el.nativeElement.focus();
        }, this.focusTimeout);
    }
    onFocus() {
        this.readonly = true;
        this.setReadOnly(this.readonly);
        if (!this.readonly) {
            this.setReadOnly(!this.readonly);
        }
        setTimeout(() => {
            this.readonly = false;
            this.setReadOnly(this.readonly);
        }, 100);
    }
    ;
    onClick(input) {
        this.readonly = true;
        this.setReadOnly(this.readonly);
        setTimeout(() => {
            this.readonly = false;
            this.setReadOnly(this.readonly);
            this.el.nativeElement.focus();
        }, this.focusTimeout);
    }
    setReadOnly(value) {
        this.el.nativeElement.readOnly = value;
        if (this.el.nativeElement.children && this.el.nativeElement.children.length > 0) {
            this.el.nativeElement.children[0].readOnly = value;
            if (this.el.nativeElement.children.length > 1) {
                this.el.nativeElement.children[1].readOnly = value;
            }
        }
        ;
    }
    ;
}
HideKeyboardDirective.ɵfac = function HideKeyboardDirective_Factory(t) { return new (t || HideKeyboardDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef)); };
HideKeyboardDirective.ɵdir = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({ type: HideKeyboardDirective, selectors: [["", "hideKeyboard", ""]], hostBindings: function HideKeyboardDirective_HostBindings(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("focus", function HideKeyboardDirective_focus_HostBindingHandler() { return ctx.onFocus(); })("click", function HideKeyboardDirective_click_HostBindingHandler($event) { return ctx.onClick($event.target); });
    } } });
HideKeyboardDirective.ctorParameters = () => [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }
];
HideKeyboardDirective.propDecorators = {
    onFocus: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.HostListener, args: ['focus',] }],
    onClick: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.HostListener, args: ['click', ['$event.target'],] }]
};
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](HideKeyboardDirective, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
        args: [{
                selector: '[hideKeyboard]'
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef }]; }, { onFocus: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.HostListener,
            args: ['focus']
        }], onClick: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.HostListener,
            args: ['click', ['$event.target']]
        }] }); })();

class HideKeyboardModule {
    static forRoot() {
        return {
            ngModule: HideKeyboardModule,
            providers: []
        };
    }
}
HideKeyboardModule.ɵfac = function HideKeyboardModule_Factory(t) { return new (t || HideKeyboardModule)(); };
HideKeyboardModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: HideKeyboardModule });
HideKeyboardModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({});
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](HideKeyboardModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgModule,
        args: [{
                declarations: [HideKeyboardDirective],
                exports: [HideKeyboardDirective]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](HideKeyboardModule, { declarations: [HideKeyboardDirective], exports: [HideKeyboardDirective] }); })();

/*
 * Public API Surface of hide-keyboard
 */

/**
 * Generated bundle index. Do not edit.
 */



//# sourceMappingURL=hide-keyboard.js.map

/***/ }),

/***/ 105:
/*!*************************************************!*\
  !*** ./src/app/codbar/codbar-routing.module.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodbarPageRoutingModule": () => (/* binding */ CodbarPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 9895);
/* harmony import */ var _codbar_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./codbar.page */ 1557);




const routes = [
    {
        path: '',
        component: _codbar_page__WEBPACK_IMPORTED_MODULE_0__.CodbarPage
    }
];
let CodbarPageRoutingModule = class CodbarPageRoutingModule {
};
CodbarPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    })
], CodbarPageRoutingModule);



/***/ }),

/***/ 7832:
/*!*****************************************!*\
  !*** ./src/app/codbar/codbar.module.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodbarPageModule": () => (/* binding */ CodbarPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 8583);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 3679);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ionic/angular */ 476);
/* harmony import */ var _codbar_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./codbar-routing.module */ 105);
/* harmony import */ var _codbar_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./codbar.page */ 1557);
/* harmony import */ var hide_keyboard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! hide-keyboard */ 9745);








let CodbarPageModule = class CodbarPageModule {
};
CodbarPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            hide_keyboard__WEBPACK_IMPORTED_MODULE_6__.HideKeyboardModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonicModule,
            _codbar_routing_module__WEBPACK_IMPORTED_MODULE_0__.CodbarPageRoutingModule
        ],
        declarations: [_codbar_page__WEBPACK_IMPORTED_MODULE_1__.CodbarPage]
    })
], CodbarPageModule);



/***/ }),

/***/ 1557:
/*!***************************************!*\
  !*** ./src/app/codbar/codbar.page.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodbarPage": () => (/* binding */ CodbarPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _raw_loader_codbar_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !raw-loader!./codbar.page.html */ 86);
/* harmony import */ var _codbar_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./codbar.page.scss */ 8061);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7716);




let CodbarPage = class CodbarPage {
    constructor() {
        this.actualField = 1;
        this.codbarFields = ["", "", "", "", "", "", "", "", "", ""];
        this.fieldRead = [false, false, false, false, false, false, false, false, false, false];
    }
    ngOnInit() {
    }
    onCodbarInserted1() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            this.fieldRead[0] = true;
            yield this.codbarInput2.setFocus();
            this.actualField++;
        });
    }
    onCodbarInserted2() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            this.fieldRead[1] = true;
            yield this.codbarInput3.setFocus();
            this.actualField++;
        });
    }
    onCodbarInserted3() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            this.fieldRead[2] = true;
            yield this.codbarInput4.setFocus();
            this.actualField++;
        });
    }
    onCodbarInserted4() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            this.fieldRead[3] = true;
            yield this.codbarInput5.setFocus();
            this.actualField++;
        });
    }
    onCodbarInserted5() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            this.fieldRead[4] = true;
            yield this.codbarInput6.setFocus();
            this.actualField++;
        });
    }
    onCodbarInserted6() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            this.fieldRead[5] = true;
            yield this.codbarInput7.setFocus();
            this.actualField++;
        });
    }
    onCodbarInserted7() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            this.fieldRead[6] = true;
            yield this.codbarInput8.setFocus();
            this.actualField++;
        });
    }
    onCodbarInserted8() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            this.fieldRead[7] = true;
            yield this.codbarInput9.setFocus();
            this.actualField++;
        });
    }
    onCodbarInserted9() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            this.fieldRead[8] = true;
            yield this.codbarInput10.setFocus();
            this.actualField++;
        });
    }
    onCodbarInserted10() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            this.fieldRead[9] = true;
            this.actualField = 1;
        });
    }
    initiateReading() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            if (this.actualField == 1)
                this.codbarInput1.setFocus();
            else if (this.actualField == 2)
                this.codbarInput2.setFocus();
            else if (this.actualField == 3)
                this.codbarInput3.setFocus();
            else if (this.actualField == 4)
                this.codbarInput4.setFocus();
            else if (this.actualField == 5)
                this.codbarInput5.setFocus();
            else if (this.actualField == 6)
                this.codbarInput6.setFocus();
            else if (this.actualField == 7)
                this.codbarInput7.setFocus();
            else if (this.actualField == 8)
                this.codbarInput8.setFocus();
            else if (this.actualField == 9)
                this.codbarInput9.setFocus();
            else if (this.actualField == 10)
                this.codbarInput10.setFocus();
        });
    }
    clearAllFields() {
        var i;
        for (i = 0; i < 10; i++) {
            this.codbarFields[i] = "";
        }
    }
};
CodbarPage.ctorParameters = () => [];
CodbarPage.propDecorators = {
    codbarInput1: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__.ViewChild, args: ['codbarInput1', { static: false },] }],
    codbarInput2: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__.ViewChild, args: ['codbarInput2', { static: false },] }],
    codbarInput3: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__.ViewChild, args: ['codbarInput3', { static: false },] }],
    codbarInput4: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__.ViewChild, args: ['codbarInput4', { static: false },] }],
    codbarInput5: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__.ViewChild, args: ['codbarInput5', { static: false },] }],
    codbarInput6: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__.ViewChild, args: ['codbarInput6', { static: false },] }],
    codbarInput7: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__.ViewChild, args: ['codbarInput7', { static: false },] }],
    codbarInput8: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__.ViewChild, args: ['codbarInput8', { static: false },] }],
    codbarInput9: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__.ViewChild, args: ['codbarInput9', { static: false },] }],
    codbarInput10: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__.ViewChild, args: ['codbarInput10', { static: false },] }]
};
CodbarPage = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
        selector: 'app-codbar',
        template: _raw_loader_codbar_page_html__WEBPACK_IMPORTED_MODULE_0__.default,
        styles: [_codbar_page_scss__WEBPACK_IMPORTED_MODULE_1__.default]
    })
], CodbarPage);



/***/ }),

/***/ 8061:
/*!*****************************************!*\
  !*** ./src/app/codbar/codbar.page.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".pageTitle {\n  margin: 10px 0px 15px 0px;\n}\n\n.mainLogo {\n  height: 50px;\n  position: fixed;\n  right: 30px;\n  top: 0px;\n}\n\nh1 {\n  font-size: small;\n}\n\nion-row {\n  height: 35px;\n}\n\n.bar {\n  height: 30px;\n  display: flex;\n  width: 30px;\n}\n\n.inputDiv {\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  margin-top: 5px;\n}\n\n.entriesBox {\n  border-radius: 15px;\n  border-style: solid;\n  border-color: black;\n  height: 360px;\n  width: 75%;\n}\n\n.footer {\n  position: fixed;\n  bottom: 0;\n  right: 0;\n  margin-right: 100px;\n  font-weight: bold;\n  font-size: large;\n  color: #7F7F7F;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvZGJhci5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSx5QkFBQTtBQUNKOztBQUVBO0VBQ0ksWUFBQTtFQUNBLGVBQUE7RUFDQSxXQUFBO0VBQ0EsUUFBQTtBQUNKOztBQUVBO0VBQ0ksZ0JBQUE7QUFDSjs7QUFFQTtFQUNJLFlBQUE7QUFDSjs7QUFFQTtFQUNJLFlBQUE7RUFDQSxhQUFBO0VBQ0EsV0FBQTtBQUNKOztBQUlBO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsV0FBQTtFQUNBLGVBQUE7QUFESjs7QUFJQTtFQUNJLG1CQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxVQUFBO0FBREo7O0FBSUE7RUFDSSxlQUFBO0VBQ0EsU0FBQTtFQUNBLFFBQUE7RUFDQSxtQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0FBREoiLCJmaWxlIjoiY29kYmFyLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5wYWdlVGl0bGV7XHJcbiAgICBtYXJnaW46IDEwcHggMDBweCAxNXB4IDAwcHg7XHJcbn1cclxuXHJcbi5tYWluTG9nb3tcclxuICAgIGhlaWdodDogNTBweDtcclxuICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgIHJpZ2h0OiAzMHB4O1xyXG4gICAgdG9wOiAwcHg7XHJcbn1cclxuXHJcbmgxe1xyXG4gICAgZm9udC1zaXplOiBzbWFsbDtcclxufVxyXG5cclxuaW9uLXJvd3tcclxuICAgIGhlaWdodDogMzVweDtcclxufVxyXG5cclxuLmJhcntcclxuICAgIGhlaWdodDogMzBweDtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICB3aWR0aDogMzBweDtcclxufVxyXG5cclxuXHJcblxyXG4uaW5wdXREaXZ7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgbWFyZ2luLXRvcDogNXB4O1xyXG59XHJcblxyXG4uZW50cmllc0JveHtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE1cHg7XHJcbiAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xyXG4gICAgYm9yZGVyLWNvbG9yOiBibGFjaztcclxuICAgIGhlaWdodDogMzYwcHg7XHJcbiAgICB3aWR0aDogNzUlO1xyXG59XHJcblxyXG4uZm9vdGVye1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDEwMHB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBmb250LXNpemU6IGxhcmdlO1xyXG4gICAgY29sb3I6ICM3RjdGN0ZcclxufVxyXG5cclxuIl19 */");

/***/ }),

/***/ 86:
/*!*******************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/codbar/codbar.page.html ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-content color=\"light\">\n  <ion-grid >\n    \n    <h1 class=\"pageTitle\" style=\"font-size: large;\">CÓDIGO DE BARRAS</h1>\n    <img class=\"mainLogo\" src=\"/assets/elginlogo.png\">\n\n    <div class=\"inputDiv\" >\n      <div class=\"entriesBox\">\n\n        <div style=\"display: flex; width: 100%; align-items: center;  flex-direction: row; margin-top: 10px;\">\n          <img  style=\"margin-left: 5px; \" class=\"bar\" src=\"/assets/bar.png\">\n          <div style=\"border-radius: 15px; border-style: solid; width: 250px; height: 30px;  margin-left: 15px; \"> \n              <ion-input #codbarInput1 hideKeyboard  [(ngModel)]=\"codbarFields[0]\" debounce=\"100\"  style=\"margin-left: 40px;\"   (ionChange)=\"onCodbarInserted1()\" style=\"align-self: flex-end; height: 30px; font-size: large;\" type=\"text\" ></ion-input>\n          </div>\n          <div *ngIf=\"fieldRead[0]\" style=\"display: flex; flex-direction: row; margin-left: 30px; \">\n            Leitura realizada com sucesso.\n          </div>\n\n        </div>\n\n        <div class=\"inputDiv\">\n          <img style=\"margin-left: 5px;\" class=\"bar\" src=\"/assets/bar.png\">\n          <div style=\"border-radius: 15px; border-style: solid; width: 250px; height: 30px;  margin-left: 15px; \"> \n              <ion-input #codbarInput2 hideKeyboard [(ngModel)]=\"codbarFields[1]\" debounce=\"100\"  style=\"margin-left: 40px;\"   (ionChange)=\"onCodbarInserted2()\" style=\"align-self: flex-end; height: 30px; font-size: large;\" type=\"text\" ></ion-input>\n          </div>\n          <div *ngIf=\"fieldRead[1]\" style=\"display: flex; flex-direction: row; margin-left: 30px; \">\n            Leitura realizada com sucesso.\n          </div>\n\n        </div>\n\n        <div class=\"inputDiv\">\n          <img style=\"margin-left: 5px;\" class=\"bar\" src=\"/assets/bar.png\">\n          <div style=\"border-radius: 15px; border-style: solid; width: 250px; height: 30px;  margin-left: 15px; \"> \n              <ion-input #codbarInput3 hideKeyboard [(ngModel)]=\"codbarFields[2]\" debounce=\"100\"  style=\"margin-left: 40px;\"   (ionChange)=\"onCodbarInserted3()\" style=\"align-self: flex-end; height: 30px; font-size: large;\" type=\"text\" ></ion-input>\n          </div>\n          <div *ngIf=\"fieldRead[2]\" style=\"display: flex; flex-direction: row; margin-left: 30px; \">\n            Leitura realizada com sucesso.\n          </div>\n\n        </div>\n\n        <div class=\"inputDiv\">\n          <img style=\"margin-left: 5px;\" class=\"bar\" src=\"/assets/bar.png\">\n          <div style=\"border-radius: 15px; border-style: solid; width: 250px; height: 30px;  margin-left: 15px; \"> \n              <ion-input #codbarInput4 hideKeyboard [(ngModel)]=\"codbarFields[3]\" debounce=\"100\"  style=\"margin-left: 40px;\"   (ionChange)=\"onCodbarInserted4()\" style=\"align-self: flex-end; height: 30px; font-size: large;\" type=\"text\" ></ion-input>\n          </div>\n          <div *ngIf=\"fieldRead[3]\" style=\"display: flex; flex-direction: row; margin-left: 30px; \">\n            Leitura realizada com sucesso.\n          </div>\n\n        </div>\n\n        <div class=\"inputDiv\">\n          <img style=\"margin-left: 5px;\" class=\"bar\" src=\"/assets/bar.png\">\n          <div style=\"border-radius: 15px; border-style: solid; width: 250px; height: 30px;  margin-left: 15px; \"> \n              <ion-input #codbarInput5 hideKeyboard [(ngModel)]=\"codbarFields[4]\" debounce=\"100\"  style=\"margin-left: 40px;\"   (ionChange)=\"onCodbarInserted5()\" style=\"align-self: flex-end; height: 30px; font-size: large;\" type=\"text\" ></ion-input>\n          </div>\n          <div *ngIf=\"fieldRead[4]\" style=\"display: flex; flex-direction: row; margin-left: 30px; \">\n            Leitura realizada com sucesso.\n          </div>\n\n        </div>\n\n        <div class=\"inputDiv\">\n          <img style=\"margin-left: 5px;\" class=\"bar\" src=\"/assets/bar.png\">\n          <div style=\"border-radius: 15px; border-style: solid; width: 250px; height: 30px;  margin-left: 15px; \"> \n              <ion-input #codbarInput6 hideKeyboard [(ngModel)]=\"codbarFields[5]\" debounce=\"100\"  style=\"margin-left: 40px;\"   (ionChange)=\"onCodbarInserted6()\" style=\"align-self: flex-end; height: 30px; font-size: large;\" type=\"text\" ></ion-input>\n          </div>\n          <div *ngIf=\"fieldRead[5]\" style=\"display: flex; flex-direction: row; margin-left: 30px; \">\n            Leitura realizada com sucesso.\n          </div>\n\n        </div>\n\n        <div class=\"inputDiv\">\n          <img style=\"margin-left: 5px;\" class=\"bar\" src=\"/assets/bar.png\">\n          <div style=\"border-radius: 15px; border-style: solid; width: 250px; height: 30px;  margin-left: 15px; \"> \n              <ion-input #codbarInput7 hideKeyboard [(ngModel)]=\"codbarFields[6]\" debounce=\"100\" style=\"margin-left: 40px;\"   (ionChange)=\"onCodbarInserted7()\" style=\"align-self: flex-end; height: 30px; font-size: large;\" type=\"text\" ></ion-input>\n          </div>\n          <div *ngIf=\"fieldRead[6]\" style=\"display: flex; flex-direction: row; margin-left: 30px; \">\n            Leitura realizada com sucesso.\n          </div>\n\n        </div>\n\n        <div class=\"inputDiv\">\n          <img style=\"margin-left: 5px;\" class=\"bar\" src=\"/assets/bar.png\">\n          <div style=\"border-radius: 15px; border-style: solid; width: 250px; height: 30px;  margin-left: 15px; \"> \n              <ion-input #codbarInput8 hideKeyboard [(ngModel)]=\"codbarFields[7]\" debounce=\"100\"  style=\"margin-left: 40px;\"   (ionChange)=\"onCodbarInserted8()\" style=\"align-self: flex-end; height: 30px; font-size: large;\" type=\"text\" ></ion-input>\n          </div>\n          <div *ngIf=\"fieldRead[7]\" style=\"display: flex; flex-direction: row; margin-left: 30px; \">\n            Leitura realizada com sucesso.\n          </div>\n\n        </div>\n\n        <div class=\"inputDiv\">\n          <img style=\"margin-left: 5px;\" class=\"bar\" src=\"/assets/bar.png\">\n          <div style=\"border-radius: 15px; border-style: solid; width: 250px; height: 30px;  margin-left: 15px; \"> \n              <ion-input #codbarInput9 hideKeyboard [(ngModel)]=\"codbarFields[8]\" debounce=\"100\"  style=\"margin-left: 40px;\"   (ionChange)=\"onCodbarInserted9()\" style=\"align-self: flex-end; height: 30px; font-size: large;\" type=\"text\" ></ion-input>\n          </div>\n          <div *ngIf=\"fieldRead[8]\" style=\"display: flex; flex-direction: row; margin-left: 30px; \">\n            Leitura realizada com sucesso.\n          </div>\n\n        </div>\n\n        <div class=\"inputDiv\">\n          <img style=\"margin-left: 5px;\" class=\"bar\" src=\"/assets/bar.png\">\n          <div style=\"border-radius: 15px; border-style: solid; width: 250px; height: 30px;  margin-left: 15px; \"> \n              <ion-input #codbarInput10 hideKeyboard [(ngModel)]=\"codbarFields[9]\" debounce=\"100\"  style=\"margin-left: 40px;\"   (ionChange)=\"onCodbarInserted10()\" style=\"align-self: flex-end; height: 30px; font-size: large;\" type=\"text\" ></ion-input>\n          </div>\n          <div *ngIf=\"fieldRead[9]\" style=\"display: flex; flex-direction: row; margin-left: 30px; \">\n            Leitura realizada com sucesso.\n          </div>\n\n        </div>\n       \n\n      </div>\n\n      <div style=\" flex-direction: column; border-radius: 20px;  width: 25%;\">\n        <h2 style=\"text-align: center; margin: 0px 0px 5px 0px;\">QR CODE</h2>\n        <div style=\"display: flex; justify-content: center;\">\n          <img style=\"width: 120px; height: 120px; text-align: center;\" src=\"/assets/qrcode.png\">\n        </div>\n\n        <h2 style=\"text-align: center; margin: 0px 0px 5px 0px;\">EAN 13</h2>\n        <div style=\"display: flex; justify-content: center;\">\n          <img style=\"width: 200px; height: 120px; text-align: center;\" src=\"/assets/ean13.png\">\n        </div>\n      </div>\n\n      \n\n    </div>\n    \n    <div style=\"width: 100%; flex-direction: row; display: flex;\">\n      <ion-button style=\"width: 50%;\" (click)=\"initiateReading()\"  size=\"mediun\" color=\"primary\" mode=\"ios\">INICIAR LEITURA</ion-button>\n      <ion-button style=\"width: 50%;\" (click)=\"clearAllFields()\"  size=\"medium\" color=\"primary\" mode=\"ios\">LIMPAR CAMPOS</ion-button>\n    </div>\n   \n   \n    \n    <h1 class=\"footer\">Ionic 1.0.0</h1>\n\n  </ion-grid>\n</ion-content>");

/***/ })

}]);
//# sourceMappingURL=src_app_codbar_codbar_module_ts.js.map