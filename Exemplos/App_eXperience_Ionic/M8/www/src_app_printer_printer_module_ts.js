(self["webpackChunkM8"] = self["webpackChunkM8"] || []).push([["src_app_printer_printer_module_ts"],{

/***/ 5052:
/*!***************************************************!*\
  !*** ./src/app/printer/printer-routing.module.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterPageRoutingModule": () => (/* binding */ PrinterPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 9895);
/* harmony import */ var _printer_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./printer.page */ 8272);




const routes = [
    {
        path: '',
        component: _printer_page__WEBPACK_IMPORTED_MODULE_0__.PrinterPage
    }
];
let PrinterPageRoutingModule = class PrinterPageRoutingModule {
};
PrinterPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    })
], PrinterPageRoutingModule);



/***/ }),

/***/ 5957:
/*!*******************************************!*\
  !*** ./src/app/printer/printer.module.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterPageModule": () => (/* binding */ PrinterPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 8583);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 3679);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 476);
/* harmony import */ var _printer_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./printer-routing.module */ 5052);
/* harmony import */ var _printer_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./printer.page */ 8272);







let PrinterPageModule = class PrinterPageModule {
};
PrinterPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _printer_routing_module__WEBPACK_IMPORTED_MODULE_0__.PrinterPageRoutingModule
        ],
        declarations: [_printer_page__WEBPACK_IMPORTED_MODULE_1__.PrinterPage]
    })
], PrinterPageModule);



/***/ }),

/***/ 8272:
/*!*****************************************!*\
  !*** ./src/app/printer/printer.page.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterPage": () => (/* binding */ PrinterPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _raw_loader_printer_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !raw-loader!./printer.page.html */ 2172);
/* harmony import */ var _printer_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./printer.page.scss */ 2401);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _printer_codbar_tab_printer_codbar_tab_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../printer-codbar-tab/printer-codbar-tab.page */ 1257);
/* harmony import */ var _printer_text_tab_printer_text_tab_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../printer-text-tab/printer-text-tab.page */ 5297);
/* harmony import */ var _printer_image_tab_printer_image_tab_page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../printer-image-tab/printer-image-tab.page */ 827);
/* harmony import */ var capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! capacitor-elgin-m8 */ 4534);





//import { TestPage } from '../test/test.page';



let PrinterPage = class PrinterPage {
    constructor() {
        this.rootPage = _printer_text_tab_printer_text_tab_page__WEBPACK_IMPORTED_MODULE_3__.PrinterTextTabPage;
        this.Ip = "192.168.0.19:9100";
        this.printerMethod = "Interna";
        this.regexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\:\d{1,5}$/;
        this.isExternalSelectable = false;
    }
    ngOnInit() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_5__.m8Plugin.printerInternalImpStart().then(sucessResult => { console.log(sucessResult["response"]); }, failureResult => { alert("Erro ao inicilizar a impressora" + failureResult); });
        });
    }
    goToPrinterTextTab() {
        this.rootPage = _printer_text_tab_printer_text_tab_page__WEBPACK_IMPORTED_MODULE_3__.PrinterTextTabPage;
    }
    goToPrinterCodbarTab() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__awaiter)(this, void 0, void 0, function* () {
            this.rootPage = _printer_codbar_tab_printer_codbar_tab_page__WEBPACK_IMPORTED_MODULE_2__.PrinterCodbarTabPage;
            var result;
        });
    }
    goToPrinterImageTab() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__awaiter)(this, void 0, void 0, function* () {
            this.rootPage = _printer_image_tab_printer_image_tab_page__WEBPACK_IMPORTED_MODULE_4__.PrinterImageTabPage;
        });
    }
    debug() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_5__.m8Plugin.chooseImage();
        });
    }
    onIpInserted() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__awaiter)(this, void 0, void 0, function* () {
            var regexTest;
            regexTest = this.regexp.test(this.Ip);
            if (regexTest == true) {
                this.isExternalSelectable = false;
            }
            else {
                this.isExternalSelectable = true;
                this.printerMethod = "Interna";
                alert("Insira um IP válido para habilitar a seleção de impressão por Impressora Externa!");
            }
        });
    }
    onIpChanged() {
        var regexTest;
        regexTest = this.regexp.test(this.Ip);
        if (regexTest == true)
            this.isExternalSelectable = false;
        else {
            this.isExternalSelectable = true;
        }
    }
    radioGroupChange(event) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__awaiter)(this, void 0, void 0, function* () {
            if (event.detail['value'] == 'Externa') {
                yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_5__.m8Plugin.printerExternalImpStart({
                    Ip: this.Ip
                }).then(sucessResult => { console.log(sucessResult["response"]); }, failureResult => { alert("Erro ao inicilizar a impressora Externa" + failureResult); });
            }
            else {
                yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_5__.m8Plugin.printerInternalImpStart().then(sucessResult => { console.log(sucessResult["response"]); }, failureResult => { alert("Erro ao inicilizar a impressora" + failureResult); });
            }
        });
    }
    printerStatus() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_5__.m8Plugin.printerStatus()
                .then(Response => alert(Response["response"]));
        });
    }
    drawerStatus() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_5__.m8Plugin.drawerStatus()
                .then(Response => alert(Response["response"]));
        });
    }
    openDrawer() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_5__.m8Plugin.openDrawer()
                .then(Response => console.log(Response["response"]));
        });
    }
};
PrinterPage.ctorParameters = () => [];
PrinterPage = (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_7__.Component)({
        selector: 'app-printer',
        template: _raw_loader_printer_page_html__WEBPACK_IMPORTED_MODULE_0__.default,
        styles: [_printer_page_scss__WEBPACK_IMPORTED_MODULE_1__.default]
    })
], PrinterPage);



/***/ }),

/***/ 2401:
/*!*******************************************!*\
  !*** ./src/app/printer/printer.page.scss ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".pageTitle {\n  margin: 10px 0px 15px 0px;\n}\n\n.mainLogo {\n  height: 50px;\n  position: fixed;\n  right: 30px;\n  top: 0px;\n}\n\nh1 {\n  font-size: larger;\n}\n\nion-button {\n  width: 150px;\n  height: 40px;\n  border-radius: 15px;\n  font-size: x-small;\n}\n\n.box {\n  display: flex;\n  border-radius: 15px;\n  border-style: solid;\n  border-color: black;\n  margin-top: 2px;\n}\n\n.bigBox {\n  display: flex;\n  width: 600px;\n  justify-content: center;\n  align-items: center;\n  height: 350px;\n  margin-left: 10px;\n  border-radius: 15px;\n  border-style: solid;\n  border-color: black;\n  margin-top: 5px;\n}\n\n.smallBox {\n  display: flex;\n  width: 570px;\n  height: 345px;\n}\n\n.contentSqueeze {\n  margin: 10px 10px 10px 10px;\n  padding: 10px 10px 10px 10px;\n}\n\nimg {\n  height: 30px;\n  margin-top: 5px;\n}\n\nh4 {\n  color: black;\n  font-weight: bold;\n  font-size: x-small;\n}\n\n.menuButton {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n  height: 75px;\n  width: 150px;\n  background-color: transparent;\n}\n\n.menuButtonSide {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  height: 40px;\n  width: 150px;\n  background-color: transparent;\n}\n\n.footer {\n  position: fixed;\n  bottom: 0;\n  right: 0;\n  margin-right: 100px;\n  font-weight: bold;\n  font-size: large;\n  color: #7F7F7F;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW50ZXIucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0kseUJBQUE7QUFDSjs7QUFFQTtFQUNJLFlBQUE7RUFDQSxlQUFBO0VBQ0EsV0FBQTtFQUNBLFFBQUE7QUFDSjs7QUFFQTtFQUNJLGlCQUFBO0FBQ0o7O0FBRUE7RUFDSSxZQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7QUFDSjs7QUFFQTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0FBQ0o7O0FBRUE7RUFDSSxhQUFBO0VBQ0EsWUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0FBQ0o7O0FBQ0E7RUFDSSxhQUFBO0VBRUEsWUFBQTtFQUNBLGFBQUE7QUFDSjs7QUFFQTtFQUNJLDJCQUFBO0VBQ0EsNEJBQUE7QUFDSjs7QUFFQTtFQUNJLFlBQUE7RUFDQSxlQUFBO0FBQ0o7O0FBRUE7RUFDSSxZQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtBQUNKOztBQUVBO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0EsNkJBQUE7QUFDSjs7QUFFQTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSw2QkFBQTtBQUNKOztBQUVBO0VBQ0ksZUFBQTtFQUNBLFNBQUE7RUFDQSxRQUFBO0VBQ0EsbUJBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQUNKIiwiZmlsZSI6InByaW50ZXIucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnBhZ2VUaXRsZXtcclxuICAgIG1hcmdpbjogMTBweCAwMHB4IDE1cHggMDBweDtcclxufVxyXG5cclxuLm1haW5Mb2dve1xyXG4gICAgaGVpZ2h0OiA1MHB4O1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgcmlnaHQ6IDMwcHg7XHJcbiAgICB0b3A6IDBweDtcclxufVxyXG5cclxuaDF7XHJcbiAgICBmb250LXNpemU6IGxhcmdlcjtcclxufVxyXG5cclxuaW9uLWJ1dHRvbntcclxuICAgIHdpZHRoOiAxNTBweDtcclxuICAgIGhlaWdodDogNDBweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE1cHg7XHJcbiAgICBmb250LXNpemU6IHgtc21hbGw7XHJcbn1cclxuXHJcbi5ib3h7XHJcbiAgICBkaXNwbGF5OiBmbGV4OyAgXHJcbiAgICBib3JkZXItcmFkaXVzOiAxNXB4O1xyXG4gICAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcclxuICAgIGJvcmRlci1jb2xvcjogYmxhY2s7XHJcbiAgICBtYXJnaW4tdG9wOiAycHg7XHJcbn1cclxuXHJcbi5iaWdCb3h7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgd2lkdGg6IDYwMHB4O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgaGVpZ2h0OiAzNTBweDtcclxuICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTVweDtcclxuICAgIGJvcmRlci1zdHlsZTogc29saWQ7XHJcbiAgICBib3JkZXItY29sb3I6IGJsYWNrO1xyXG4gICAgbWFyZ2luLXRvcDogNXB4O1xyXG59XHJcbi5zbWFsbEJveHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBcclxuICAgIHdpZHRoOiA1NzBweDtcclxuICAgIGhlaWdodDogMzQ1cHg7XHJcbn1cclxuXHJcbi5jb250ZW50U3F1ZWV6ZXtcclxuICAgIG1hcmdpbjogMTBweCAxMHB4IDEwcHggMTBweDtcclxuICAgIHBhZGRpbmc6IDEwcHggMTBweCAxMHB4IDEwcHg7XHJcbn1cclxuXHJcbmltZ3tcclxuICAgIGhlaWdodDogMzBweDtcclxuICAgIG1hcmdpbi10b3A6IDVweDtcclxufVxyXG5cclxuaDR7XHJcbiAgICBjb2xvcjogYmxhY2s7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGZvbnQtc2l6ZTogeC1zbWFsbDtcclxufVxyXG5cclxuLm1lbnVCdXR0b257XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBoZWlnaHQ6IDc1cHg7XHJcbiAgICB3aWR0aDogMTUwcHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxufVxyXG5cclxuLm1lbnVCdXR0b25TaWRle1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgaGVpZ2h0OiA0MHB4O1xyXG4gICAgd2lkdGg6IDE1MHB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbn1cclxuXHJcbi5mb290ZXJ7XHJcbiAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIG1hcmdpbi1yaWdodDogMTAwcHg7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XHJcbiAgICBjb2xvcjogIzdGN0Y3RlxyXG59XHJcblxyXG4iXX0= */");

/***/ }),

/***/ 2172:
/*!*********************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/printer/printer.page.html ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-content color=\"light\">\n  <ion-grid>\n    \n        <h1 class=\"pageTitle\">IMPRESSORA</h1>\n        <img class=\"mainLogo\" src=\"/assets/elginlogo.png\">\n     \n\n    <div style=\"display: flex; width: min-content;\">\n     \n      <div>\n        <div class=\"box\">\n          <button (click)=\"goToPrinterTextTab()\" class=\"menuButton\" type=\"button\">\n            <img style=\"text-align: center;\" src=\"assets/printertext.png\">\n            <h4>IMPRESSÃO DE TEXTO</h4>\n          </button>\n        </div>\n\n        <div class=\"box\">\n          <button (click)=\"goToPrinterCodbarTab()\" class=\"menuButton\" type=\"button\">\n            <img style=\"text-align: center;\" src=\"assets/printerbarcode.png\">\n            <h4>IMPRESSÃO DE CÓDIGO DE BARRAS</h4>\n          </button>\n        </div>\n\n        <div class=\"box\">\n          <button (click)=\"goToPrinterImageTab()\" class=\"menuButton\" type=\"button\">\n            <img style=\"text-align: center;\" src=\"assets/printerimage.png\">\n            <h4>IMPRESSÃO DE IMAGEM</h4>\n          </button>\n        </div>\n\n        <div class=\"box\">\n          <button (click)=\"printerStatus()\" class=\"menuButtonSide\" type=\"button\">\n            <img style=\"text-align: center;\" src=\"assets/status.png\">\n            <h4 style=\"margin-left: 2px;\">STATUS IMPRESSORA</h4>\n          </button>\n        </div>\n        <div class=\"box\">\n          <button (click)=\"drawerStatus()\" class=\"menuButtonSide\" type=\"button\">\n            <img style=\"text-align: center;\" src=\"assets/status.png\">\n            <h4 style=\"margin-left: 2px;\">STATUS GAVETA</h4>\n          </button>\n        </div>\n        \n        <ion-button (click)=\"openDrawer()\" color=\"primary\" mode=\"ios\">ABRIR GAVETA</ion-button>\n\n      </div>\n      \n      <div style=\"display: flex; flex-direction: column;\">\n        <div style=\"margin-top: 0px; margin-left: 10px;  \">\n          <ion-radio-group allow-empty-selection=\"false\" [(ngModel)]=\"printerMethod\"   (ionChange)=\"radioGroupChange($event)\" value=\"Interna\"> \n            <div style=\"display: flex; justify-content: space-around; align-items: center;\">\n              <div>\n                <ion-radio class=\"radio\"  value=\"Interna\"></ion-radio>\n                <ion-label style=\"margin-left: 5px;\">Impressora Interna</ion-label>\n              </div>\n\n              <div>\n                <ion-radio [disabled]=\"isExternalSelectable\" class=\"radio\" value=\"Externa\"></ion-radio>\n                <ion-label style=\"margin-left: 5px;\" class=\"label-right\">Impressora Externa</ion-label>\n              </div>\n\n              <div class=\"box\">\n                <ion-input type=\"text\"  (ionChange)=\"onIpChanged()\" (ionBlur)=\"onIpInserted()\" [(ngModel)]=\"Ip\" ></ion-input>\n              </div>\n\n\n            </div>\n          </ion-radio-group>\n        </div>\n\n      \n        <div class=\"bigBox\">\n        \n          <div class=\"smallBox\">\n            <ion-content class=\"contentSqueeze\">\n              <ion-nav [root]=\"rootPage\">\n              \n              </ion-nav>\n            </ion-content>\n          </div>\n           \n         \n        </div>\n\n      </div>\n    </div>\n    \n\n    <h1 class=\"footer\">Ionic 1.0.0</h1>\n\n  </ion-grid>\n</ion-content>");

/***/ })

}]);
//# sourceMappingURL=src_app_printer_printer_module_ts.js.map