(self["webpackChunkM8"] = self["webpackChunkM8"] || []).push([["main"],{

/***/ 8255:
/*!*******************************************************!*\
  !*** ./$_lazy_route_resources/ lazy namespace object ***!
  \*******************************************************/
/***/ ((module) => {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(() => {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = () => ([]);
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 8255;
module.exports = webpackEmptyAsyncContext;

/***/ }),

/***/ 8437:
/*!*****************************************************!*\
  !*** ../capacitor-elgin-m8/dist/esm/definitions.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ 4534:
/*!***********************************************!*\
  !*** ../capacitor-elgin-m8/dist/esm/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "m8Plugin": () => (/* binding */ m8Plugin)
/* harmony export */ });
/* harmony import */ var _capacitor_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @capacitor/core */ 883);
/* harmony import */ var _definitions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./definitions */ 8437);

const m8Plugin = (0,_capacitor_core__WEBPACK_IMPORTED_MODULE_0__.registerPlugin)('m8Plugin', {
    web: () => __webpack_require__.e(/*! import() */ "capacitor-elgin-m8_dist_esm_web_js").then(__webpack_require__.bind(__webpack_require__, /*! ./web */ 8929)).then(m => new m.m8PluginWeb()),
});




/***/ }),

/***/ 158:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppRoutingModule": () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 9895);



const routes = [
    {
        path: 'home',
        loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_home_home_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./home/home.module */ 3467)).then(m => m.HomePageModule)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'printer',
        loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_printer_printer_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./printer/printer.module */ 5957)).then(m => m.PrinterPageModule)
    },
    {
        path: 'printer-text-tab',
        loadChildren: () => Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./printer-text-tab/printer-text-tab.module */ 1633)).then(m => m.PrinterTextTabPageModule)
    },
    {
        path: 'printer-codbar-tab',
        loadChildren: () => Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./printer-codbar-tab/printer-codbar-tab.module */ 3412)).then(m => m.PrinterCodbarTabPageModule)
    },
    {
        path: 'printer-image-tab',
        loadChildren: () => Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./printer-image-tab/printer-image-tab.module */ 8814)).then(m => m.PrinterImageTabPageModule)
    },
    {
        path: 'tef',
        loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_tef_tef_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./tef/tef.module */ 5803)).then(m => m.TefPageModule)
    },
    {
        path: 'codbar',
        loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_codbar_codbar_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./codbar/codbar.module */ 7832)).then(m => m.CodbarPageModule)
    },
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.NgModule)({
        imports: [
            _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule.forRoot(routes, { preloadingStrategy: _angular_router__WEBPACK_IMPORTED_MODULE_2__.PreloadAllModules })
        ],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule]
    })
], AppRoutingModule);



/***/ }),

/***/ 5041:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppComponent": () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _raw_loader_app_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !raw-loader!./app.component.html */ 1106);
/* harmony import */ var _app_component_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component.scss */ 3069);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7716);




let AppComponent = class AppComponent {
    constructor() { }
};
AppComponent.ctorParameters = () => [];
AppComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
        selector: 'app-root',
        template: _raw_loader_app_component_html__WEBPACK_IMPORTED_MODULE_0__.default,
        styles: [_app_component_scss__WEBPACK_IMPORTED_MODULE_1__.default]
    })
], AppComponent);



/***/ }),

/***/ 6747:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppModule": () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser */ 9075);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 9895);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ionic/angular */ 476);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.component */ 5041);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app-routing.module */ 158);
/* harmony import */ var _printer_text_tab_printer_text_tab_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./printer-text-tab/printer-text-tab.module */ 1633);
/* harmony import */ var _printer_codbar_tab_printer_codbar_tab_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./printer-codbar-tab/printer-codbar-tab.module */ 3412);
/* harmony import */ var _printer_image_tab_printer_image_tab_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./printer-image-tab/printer-image-tab.module */ 8814);










let AppModule = class AppModule {
};
AppModule = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.NgModule)({
        declarations: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent],
        entryComponents: [],
        imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__.BrowserModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonicModule.forRoot(), _app_routing_module__WEBPACK_IMPORTED_MODULE_1__.AppRoutingModule, _printer_text_tab_printer_text_tab_module__WEBPACK_IMPORTED_MODULE_2__.PrinterTextTabPageModule, _printer_codbar_tab_printer_codbar_tab_module__WEBPACK_IMPORTED_MODULE_3__.PrinterCodbarTabPageModule, _printer_image_tab_printer_image_tab_module__WEBPACK_IMPORTED_MODULE_4__.PrinterImageTabPageModule],
        providers: [{ provide: _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouteReuseStrategy, useClass: _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonicRouteStrategy }],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent],
    })
], AppModule);



/***/ }),

/***/ 5801:
/*!*************************************************************************!*\
  !*** ./src/app/printer-codbar-tab/printer-codbar-tab-routing.module.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterCodbarTabPageRoutingModule": () => (/* binding */ PrinterCodbarTabPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 9895);
/* harmony import */ var _printer_codbar_tab_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./printer-codbar-tab.page */ 1257);




const routes = [
    {
        path: '',
        component: _printer_codbar_tab_page__WEBPACK_IMPORTED_MODULE_0__.PrinterCodbarTabPage
    }
];
let PrinterCodbarTabPageRoutingModule = class PrinterCodbarTabPageRoutingModule {
};
PrinterCodbarTabPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    })
], PrinterCodbarTabPageRoutingModule);



/***/ }),

/***/ 3412:
/*!*****************************************************************!*\
  !*** ./src/app/printer-codbar-tab/printer-codbar-tab.module.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterCodbarTabPageModule": () => (/* binding */ PrinterCodbarTabPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 8583);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 3679);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 476);
/* harmony import */ var _printer_codbar_tab_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./printer-codbar-tab-routing.module */ 5801);
/* harmony import */ var _printer_codbar_tab_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./printer-codbar-tab.page */ 1257);







let PrinterCodbarTabPageModule = class PrinterCodbarTabPageModule {
};
PrinterCodbarTabPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _printer_codbar_tab_routing_module__WEBPACK_IMPORTED_MODULE_0__.PrinterCodbarTabPageRoutingModule
        ],
        declarations: [_printer_codbar_tab_page__WEBPACK_IMPORTED_MODULE_1__.PrinterCodbarTabPage]
    })
], PrinterCodbarTabPageModule);



/***/ }),

/***/ 1257:
/*!***************************************************************!*\
  !*** ./src/app/printer-codbar-tab/printer-codbar-tab.page.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterCodbarTabPage": () => (/* binding */ PrinterCodbarTabPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _raw_loader_printer_codbar_tab_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !raw-loader!./printer-codbar-tab.page.html */ 7774);
/* harmony import */ var _printer_codbar_tab_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./printer-codbar-tab.page.scss */ 5676);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! capacitor-elgin-m8 */ 4534);





let PrinterCodbarTabPage = class PrinterCodbarTabPage {
    constructor() {
        this.code = "40170725";
        this.barcodeType = "EAN 8";
        this.alignment = "Centralizado";
        this.width = 6;
        this.height = 120;
        this.cutPaper = false;
        this.isQrCodeNotSelected = true;
    }
    ngOnInit() {
    }
    codebarTypeListChange(event) {
        this.barcodeType = event.detail['value'];
        this.isQrCodeNotSelected = true;
        if (this.barcodeType == "EAN 8")
            this.code = "40170725";
        else if (this.barcodeType == "EAN 13")
            this.code = "0123456789012";
        else if (this.barcodeType == "QR CODE") {
            this.code = "ELGIN DEVELOPERS COMMUNITY";
            this.isQrCodeNotSelected = false;
        }
        else if (this.barcodeType == "UPC-A")
            this.code = "123601057072";
        else if (this.barcodeType == "UPC-E")
            this.code = "1234567";
        else if (this.barcodeType == "CODE 39")
            this.code = "*ABC123*";
        else if (this.barcodeType == "ITF")
            this.code = "05012345678900";
        else if (this.barcodeType == "CODE BAR")
            this.code = "A3419500A";
        else if (this.barcodeType == "CODE 93")
            this.code = "ABC123456789";
        else if (this.barcodeType == "CODE 128")
            this.code = "{C1233";
    }
    alinhamentoRadioChange(event) {
        this.alignment = event.detail['value'];
    }
    widthListChange(event) {
        this.width = parseInt(event.detail['value']);
    }
    heightListChange(event) {
        this.height = parseInt(event.detail['value']);
    }
    printBarcode() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            if (this.code == "")
                alert("Campo de texto vazio!");
            else {
                yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__.m8Plugin.printBarcode({
                    barCodeType: this.barcodeType,
                    code: this.code,
                    height: this.height,
                    width: this.width,
                    alignment: this.alignment,
                    cutPaper: this.cutPaper
                })
                    .then(sucessResponse => { console.log(sucessResponse["response"]); }, failureResponse => { console.log(failureResponse); });
            }
        });
    }
};
PrinterCodbarTabPage.ctorParameters = () => [];
PrinterCodbarTabPage = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Component)({
        selector: 'app-printer-codbar-tab',
        template: _raw_loader_printer_codbar_tab_page_html__WEBPACK_IMPORTED_MODULE_0__.default,
        styles: [_printer_codbar_tab_page_scss__WEBPACK_IMPORTED_MODULE_1__.default]
    })
], PrinterCodbarTabPage);



/***/ }),

/***/ 9293:
/*!***********************************************************************!*\
  !*** ./src/app/printer-image-tab/printer-image-tab-routing.module.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterImageTabPageRoutingModule": () => (/* binding */ PrinterImageTabPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 9895);
/* harmony import */ var _printer_image_tab_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./printer-image-tab.page */ 827);




const routes = [
    {
        path: '',
        component: _printer_image_tab_page__WEBPACK_IMPORTED_MODULE_0__.PrinterImageTabPage
    }
];
let PrinterImageTabPageRoutingModule = class PrinterImageTabPageRoutingModule {
};
PrinterImageTabPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    })
], PrinterImageTabPageRoutingModule);



/***/ }),

/***/ 8814:
/*!***************************************************************!*\
  !*** ./src/app/printer-image-tab/printer-image-tab.module.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterImageTabPageModule": () => (/* binding */ PrinterImageTabPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 8583);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 3679);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 476);
/* harmony import */ var _printer_image_tab_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./printer-image-tab-routing.module */ 9293);
/* harmony import */ var _printer_image_tab_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./printer-image-tab.page */ 827);







let PrinterImageTabPageModule = class PrinterImageTabPageModule {
};
PrinterImageTabPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _printer_image_tab_routing_module__WEBPACK_IMPORTED_MODULE_0__.PrinterImageTabPageRoutingModule
        ],
        declarations: [_printer_image_tab_page__WEBPACK_IMPORTED_MODULE_1__.PrinterImageTabPage]
    })
], PrinterImageTabPageModule);



/***/ }),

/***/ 827:
/*!*************************************************************!*\
  !*** ./src/app/printer-image-tab/printer-image-tab.page.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterImageTabPage": () => (/* binding */ PrinterImageTabPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _raw_loader_printer_image_tab_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !raw-loader!./printer-image-tab.page.html */ 8054);
/* harmony import */ var _printer_image_tab_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./printer-image-tab.page.scss */ 7244);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! capacitor-elgin-m8 */ 4534);





let PrinterImageTabPage = class PrinterImageTabPage {
    constructor() {
        this.picToView = "/assets/elginlogo.png";
        this.cutPaper = false;
    }
    ngOnInit() {
    }
    ngOnDestroy() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__.m8Plugin.resetDefaultImage();
        });
    }
    chooseImage() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__.m8Plugin.chooseImage().then(sucess => { this.picToView = "data:image/png;base64," + sucess["imageAsBase64"]; }, error => alert(error));
        });
    }
    printSelectedImage() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__.m8Plugin.printImage({
                cutPaper: this.cutPaper
            })
                .then(sucessResult => { console.log(sucessResult["response"]); }, failureResult => { console.log("error"); });
        });
    }
};
PrinterImageTabPage.ctorParameters = () => [];
PrinterImageTabPage = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Component)({
        selector: 'app-printer-image-tab',
        template: _raw_loader_printer_image_tab_page_html__WEBPACK_IMPORTED_MODULE_0__.default,
        styles: [_printer_image_tab_page_scss__WEBPACK_IMPORTED_MODULE_1__.default]
    })
], PrinterImageTabPage);



/***/ }),

/***/ 3925:
/*!*********************************************************************!*\
  !*** ./src/app/printer-text-tab/printer-text-tab-routing.module.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterTextTabPageRoutingModule": () => (/* binding */ PrinterTextTabPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 9895);
/* harmony import */ var _printer_text_tab_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./printer-text-tab.page */ 5297);




const routes = [
    {
        path: '',
        component: _printer_text_tab_page__WEBPACK_IMPORTED_MODULE_0__.PrinterTextTabPage
    }
];
let PrinterTextTabPageRoutingModule = class PrinterTextTabPageRoutingModule {
};
PrinterTextTabPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    })
], PrinterTextTabPageRoutingModule);



/***/ }),

/***/ 1633:
/*!*************************************************************!*\
  !*** ./src/app/printer-text-tab/printer-text-tab.module.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterTextTabPageModule": () => (/* binding */ PrinterTextTabPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 8583);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 3679);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 476);
/* harmony import */ var _printer_text_tab_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./printer-text-tab-routing.module */ 3925);
/* harmony import */ var _printer_text_tab_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./printer-text-tab.page */ 5297);







let PrinterTextTabPageModule = class PrinterTextTabPageModule {
};
PrinterTextTabPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _printer_text_tab_routing_module__WEBPACK_IMPORTED_MODULE_0__.PrinterTextTabPageRoutingModule
        ],
        declarations: [_printer_text_tab_page__WEBPACK_IMPORTED_MODULE_1__.PrinterTextTabPage]
    })
], PrinterTextTabPageModule);



/***/ }),

/***/ 5297:
/*!***********************************************************!*\
  !*** ./src/app/printer-text-tab/printer-text-tab.page.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrinterTextTabPage": () => (/* binding */ PrinterTextTabPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _raw_loader_printer_text_tab_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !raw-loader!./printer-text-tab.page.html */ 5126);
/* harmony import */ var _printer_text_tab_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./printer-text-tab.page.scss */ 2766);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! capacitor-elgin-m8 */ 4534);





let PrinterTextTabPage = class PrinterTextTabPage {
    constructor() {
        this.message = "ELGIN DEVELOPER COMMUNITY";
        this.alignment = "Centralizado";
        this.font = "FONT A";
        this.fontSize = 17;
        this.isBold = false;
        this.isUnderline = false;
        this.cutPaper = true;
        this.xmlSatPath = "../../assets/Xmlsat.xml";
        this.xmlNfcePath = "../../assets/xmlnfce.xml";
    }
    ngOnInit() {
        this.saveReadXmlSatTextToString("file//" + this.xmlSatPath);
        this.saveReadXmlNfceTextToString("file//" + this.xmlNfcePath);
    }
    alinhamentoRadioChange(event) {
        this.alignment = event.detail['value'];
    }
    fontListChange(event) {
        this.font = event.detail['value'];
    }
    fontsizeListChange(event) {
        this.fontSize = parseInt(event.detail['value']);
    }
    printText() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            if (this.message == "")
                alert("Campo de texto vazio!");
            else {
                yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__.m8Plugin.printText({
                    message: this.message,
                    alignment: this.alignment,
                    font: this.font,
                    fontSize: this.fontSize,
                    isBold: this.isBold,
                    isUnderline: this.isUnderline,
                    cutPaper: this.cutPaper
                })
                    .then(sucessResponse => { console.log(sucessResponse["response"]); }, failureResponse => { console.log(failureResponse); });
            }
        });
    }
    printXmlSAT() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__.m8Plugin.printXmlSat({
                xmlSAT: this.xmlSat,
                cutPaper: this.cutPaper
            })
                .then(sucessResponse => { console.log(sucessResponse["response"]); }, failureResponse => { console.log(failureResponse); });
        });
    }
    printXmlNFCE() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__.m8Plugin.printXmlNFCe({
                xmlNFCe: this.xmlNfce,
                cutPaper: this.cutPaper
            })
                .then(sucessResponse => { console.log(sucessResponse["response"]); }, failureResponse => { console.log(failureResponse); });
        });
    }
    saveReadXmlSatTextToString(xmlSatPath) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            yield fetch(xmlSatPath)
                .then(response => response.text())
                .then(text => { this.xmlSat = text; });
        });
    }
    saveReadXmlNfceTextToString(xmlNfcePath) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            yield fetch(xmlNfcePath)
                .then(response => response.text())
                .then(text => { this.xmlNfce = text; });
        });
    }
};
PrinterTextTabPage.ctorParameters = () => [];
PrinterTextTabPage = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Component)({
        selector: 'app-printer-text-tab',
        template: _raw_loader_printer_text_tab_page_html__WEBPACK_IMPORTED_MODULE_0__.default,
        styles: [_printer_text_tab_page_scss__WEBPACK_IMPORTED_MODULE_1__.default]
    })
], PrinterTextTabPage);



/***/ }),

/***/ 2340:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "environment": () => (/* binding */ environment)
/* harmony export */ });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ 4431:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ 4608);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 6747);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 2340);




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
(0,_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_3__.platformBrowserDynamic)().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule)
    .catch(err => console.log(err));


/***/ }),

/***/ 863:
/*!******************************************************************************************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/ lazy ^\.\/.*\.entry\.js$ include: \.entry\.js$ exclude: \.system\.entry\.js$ namespace object ***!
  \******************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./ion-action-sheet.entry.js": [
		7321,
		"common",
		"node_modules_ionic_core_dist_esm_ion-action-sheet_entry_js"
	],
	"./ion-alert.entry.js": [
		6108,
		"common",
		"node_modules_ionic_core_dist_esm_ion-alert_entry_js"
	],
	"./ion-app_8.entry.js": [
		1489,
		"common",
		"node_modules_ionic_core_dist_esm_ion-app_8_entry_js"
	],
	"./ion-avatar_3.entry.js": [
		305,
		"common",
		"node_modules_ionic_core_dist_esm_ion-avatar_3_entry_js"
	],
	"./ion-back-button.entry.js": [
		5830,
		"common",
		"node_modules_ionic_core_dist_esm_ion-back-button_entry_js"
	],
	"./ion-backdrop.entry.js": [
		7757,
		"node_modules_ionic_core_dist_esm_ion-backdrop_entry_js"
	],
	"./ion-button_2.entry.js": [
		392,
		"common",
		"node_modules_ionic_core_dist_esm_ion-button_2_entry_js"
	],
	"./ion-card_5.entry.js": [
		6911,
		"common",
		"node_modules_ionic_core_dist_esm_ion-card_5_entry_js"
	],
	"./ion-checkbox.entry.js": [
		937,
		"common",
		"node_modules_ionic_core_dist_esm_ion-checkbox_entry_js"
	],
	"./ion-chip.entry.js": [
		8695,
		"common",
		"node_modules_ionic_core_dist_esm_ion-chip_entry_js"
	],
	"./ion-col_3.entry.js": [
		6034,
		"node_modules_ionic_core_dist_esm_ion-col_3_entry_js"
	],
	"./ion-datetime_3.entry.js": [
		8837,
		"common",
		"node_modules_ionic_core_dist_esm_ion-datetime_3_entry_js"
	],
	"./ion-fab_3.entry.js": [
		4195,
		"common",
		"node_modules_ionic_core_dist_esm_ion-fab_3_entry_js"
	],
	"./ion-img.entry.js": [
		1709,
		"node_modules_ionic_core_dist_esm_ion-img_entry_js"
	],
	"./ion-infinite-scroll_2.entry.js": [
		5931,
		"node_modules_ionic_core_dist_esm_ion-infinite-scroll_2_entry_js"
	],
	"./ion-input.entry.js": [
		4513,
		"common",
		"node_modules_ionic_core_dist_esm_ion-input_entry_js"
	],
	"./ion-item-option_3.entry.js": [
		8056,
		"common",
		"node_modules_ionic_core_dist_esm_ion-item-option_3_entry_js"
	],
	"./ion-item_8.entry.js": [
		862,
		"common",
		"node_modules_ionic_core_dist_esm_ion-item_8_entry_js"
	],
	"./ion-loading.entry.js": [
		7509,
		"common",
		"node_modules_ionic_core_dist_esm_ion-loading_entry_js"
	],
	"./ion-menu_3.entry.js": [
		6272,
		"common",
		"node_modules_ionic_core_dist_esm_ion-menu_3_entry_js"
	],
	"./ion-modal.entry.js": [
		1855,
		"common",
		"node_modules_ionic_core_dist_esm_ion-modal_entry_js"
	],
	"./ion-nav_2.entry.js": [
		8708,
		"common",
		"node_modules_ionic_core_dist_esm_ion-nav_2_entry_js"
	],
	"./ion-popover.entry.js": [
		3527,
		"common",
		"node_modules_ionic_core_dist_esm_ion-popover_entry_js"
	],
	"./ion-progress-bar.entry.js": [
		4694,
		"common",
		"node_modules_ionic_core_dist_esm_ion-progress-bar_entry_js"
	],
	"./ion-radio_2.entry.js": [
		9222,
		"common",
		"node_modules_ionic_core_dist_esm_ion-radio_2_entry_js"
	],
	"./ion-range.entry.js": [
		5277,
		"common",
		"node_modules_ionic_core_dist_esm_ion-range_entry_js"
	],
	"./ion-refresher_2.entry.js": [
		9921,
		"common",
		"node_modules_ionic_core_dist_esm_ion-refresher_2_entry_js"
	],
	"./ion-reorder_2.entry.js": [
		3122,
		"common",
		"node_modules_ionic_core_dist_esm_ion-reorder_2_entry_js"
	],
	"./ion-ripple-effect.entry.js": [
		1602,
		"node_modules_ionic_core_dist_esm_ion-ripple-effect_entry_js"
	],
	"./ion-route_4.entry.js": [
		5174,
		"common",
		"node_modules_ionic_core_dist_esm_ion-route_4_entry_js"
	],
	"./ion-searchbar.entry.js": [
		7895,
		"common",
		"node_modules_ionic_core_dist_esm_ion-searchbar_entry_js"
	],
	"./ion-segment_2.entry.js": [
		6164,
		"common",
		"node_modules_ionic_core_dist_esm_ion-segment_2_entry_js"
	],
	"./ion-select_3.entry.js": [
		592,
		"common",
		"node_modules_ionic_core_dist_esm_ion-select_3_entry_js"
	],
	"./ion-slide_2.entry.js": [
		7162,
		"node_modules_ionic_core_dist_esm_ion-slide_2_entry_js"
	],
	"./ion-spinner.entry.js": [
		1374,
		"common",
		"node_modules_ionic_core_dist_esm_ion-spinner_entry_js"
	],
	"./ion-split-pane.entry.js": [
		7896,
		"node_modules_ionic_core_dist_esm_ion-split-pane_entry_js"
	],
	"./ion-tab-bar_2.entry.js": [
		5043,
		"common",
		"node_modules_ionic_core_dist_esm_ion-tab-bar_2_entry_js"
	],
	"./ion-tab_2.entry.js": [
		7802,
		"common",
		"node_modules_ionic_core_dist_esm_ion-tab_2_entry_js"
	],
	"./ion-text.entry.js": [
		9072,
		"common",
		"node_modules_ionic_core_dist_esm_ion-text_entry_js"
	],
	"./ion-textarea.entry.js": [
		2191,
		"common",
		"node_modules_ionic_core_dist_esm_ion-textarea_entry_js"
	],
	"./ion-toast.entry.js": [
		801,
		"common",
		"node_modules_ionic_core_dist_esm_ion-toast_entry_js"
	],
	"./ion-toggle.entry.js": [
		7110,
		"common",
		"node_modules_ionic_core_dist_esm_ion-toggle_entry_js"
	],
	"./ion-virtual-scroll.entry.js": [
		431,
		"node_modules_ionic_core_dist_esm_ion-virtual-scroll_entry_js"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = 863;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 3069:
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ 5676:
/*!*****************************************************************!*\
  !*** ./src/app/printer-codbar-tab/printer-codbar-tab.page.scss ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("ion-content {\n  --ion-background-color:\t#f3f5f7;\n  /* --ion-background-color:\t#FF0000; */\n}\n\nh4 {\n  font-size: small;\n}\n\nion-item {\n  --border-color: var(--ion-color-black);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW50ZXItY29kYmFyLXRhYi5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFFSSwrQkFBQTtFQUNELHFDQUFBO0FBQUg7O0FBR0E7RUFDSSxnQkFBQTtBQUFKOztBQUtBO0VBQ0Usc0NBQUE7QUFGRiIsImZpbGUiOiJwcmludGVyLWNvZGJhci10YWIucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiaW9uLWNvbnRlbnR7XHJcblxyXG4gICAgLS1pb24tYmFja2dyb3VuZC1jb2xvcjpcdCNmM2Y1Zjc7IFxyXG4gICAvKiAtLWlvbi1iYWNrZ3JvdW5kLWNvbG9yOlx0I0ZGMDAwMDsgKi9cclxufVxyXG5cclxuaDR7XHJcbiAgICBmb250LXNpemU6IHNtYWxsO1xyXG59XHJcblxyXG5cclxuXHJcbmlvbi1pdGVtIHtcclxuICAtLWJvcmRlci1jb2xvcjogdmFyKC0taW9uLWNvbG9yLWJsYWNrKTtcclxufSJdfQ== */");

/***/ }),

/***/ 7244:
/*!***************************************************************!*\
  !*** ./src/app/printer-image-tab/printer-image-tab.page.scss ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("ion-content {\n  --ion-background-color:\t#f3f5f7;\n  /* --ion-background-color:\t#FF0000; */\n}\n\n.map {\n  width: 100%;\n  height: 150px;\n  margin-top: 10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW50ZXItaW1hZ2UtdGFiLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUVJLCtCQUFBO0VBQ0QscUNBQUE7QUFBSDs7QUFHQTtFQUNJLFdBQUE7RUFDQSxhQUFBO0VBQ0EsZ0JBQUE7QUFBSiIsImZpbGUiOiJwcmludGVyLWltYWdlLXRhYi5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJpb24tY29udGVudHtcclxuXHJcbiAgICAtLWlvbi1iYWNrZ3JvdW5kLWNvbG9yOlx0I2YzZjVmNzsgXHJcbiAgIC8qIC0taW9uLWJhY2tncm91bmQtY29sb3I6XHQjRkYwMDAwOyAqL1xyXG59XHJcblxyXG4ubWFwe1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDE1MHB4O1xyXG4gICAgbWFyZ2luLXRvcDogMTBweDtcclxufVxyXG4iXX0= */");

/***/ }),

/***/ 2766:
/*!*************************************************************!*\
  !*** ./src/app/printer-text-tab/printer-text-tab.page.scss ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("ion-content {\n  --ion-background-color:\t#f3f5f7;\n  /* --ion-background-color:\t#FF0000; */\n}\n\nh4 {\n  font-size: small;\n}\n\nion-item {\n  --border-color: var(--ion-color-black);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW50ZXItdGV4dC10YWIucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBRUksK0JBQUE7RUFDRCxxQ0FBQTtBQUFIOztBQUdBO0VBQ0ksZ0JBQUE7QUFBSjs7QUFLQTtFQUNFLHNDQUFBO0FBRkYiLCJmaWxlIjoicHJpbnRlci10ZXh0LXRhYi5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJpb24tY29udGVudHtcclxuXHJcbiAgICAtLWlvbi1iYWNrZ3JvdW5kLWNvbG9yOlx0I2YzZjVmNzsgXHJcbiAgIC8qIC0taW9uLWJhY2tncm91bmQtY29sb3I6XHQjRkYwMDAwOyAqL1xyXG59XHJcblxyXG5oNHtcclxuICAgIGZvbnQtc2l6ZTogc21hbGw7XHJcbn1cclxuXHJcblxyXG5cclxuaW9uLWl0ZW0ge1xyXG4gIC0tYm9yZGVyLWNvbG9yOiB2YXIoLS1pb24tY29sb3ItYmxhY2spO1xyXG59Il19 */");

/***/ }),

/***/ 1106:
/*!**************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-app>\n  <ion-router-outlet></ion-router-outlet>\n</ion-app>\n");

/***/ }),

/***/ 7774:
/*!*******************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/printer-codbar-tab/printer-codbar-tab.page.html ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-content>\n  <ion-grid>\n\n    <div style=\"text-align: start; margin: 0px 0px 0px 0px;\">\n      <h4 style=\"text-align: center; margin: 0px 0px 0px 0px; font-size: medium;\">IMPRESSÃO DE CÓDIGO DE BARRAS</h4>\n\n      <ion-item style=\"margin: 5px 0px 0px 0px;\">\n        <h2>CÓDIGO: </h2>\n        <ion-input style=\"align-self: flex-end;\" type=\"text\" [(ngModel)]=\"code\" id=\"mensagem\"></ion-input>\n      </ion-item>\n    </div>\n\n    <div style=\"display: flex; justify-content: space-between; margin: 0px 0px 0px 0px;\">\n      <div style=\"display: flex; margin-left: 10px;\">\n        <h3>TIPO DE CÓDIGO DE BARRAS:</h3>\n      </div>\n\n      <div>\n        <ion-list>\n          <ion-select mode=\"ios\" value=\"EAN 8\" (ionChange)=\"codebarTypeListChange($event);\" cancelText=\"Cancelar\" interface=\"popover\">\n            <ion-select-option value=\"EAN 8\">EAN 8</ion-select-option>\n            <ion-select-option value=\"EAN 13\">EAN 13</ion-select-option>\n            <ion-select-option value=\"QR CODE\">QR CODE</ion-select-option>\n            <ion-select-option value=\"UPC-A\">UPC-A</ion-select-option>\n            <ion-select-option value=\"UPC-E\">UPC-E</ion-select-option>\n            <ion-select-option value=\"CODE 39\">CODE 39</ion-select-option>\n            <ion-select-option value=\"ITF\">ITF</ion-select-option>\n            <ion-select-option value=\"CODE BAR\">CODE BAR</ion-select-option>\n            <ion-select-option value=\"CODE 93\">CODE 93</ion-select-option>\n            <ion-select-option value=\"CODE 128\">CODE 128</ion-select-option>\n          </ion-select>\n        </ion-list>\n      </div>\n\n    </div>\n\n    <h2 style=\"margin: 0px 0px 1px 10px;\">ALINHAMENTO</h2>\n\n    <ion-radio-group (ionChange)=\"alinhamentoRadioChange($event)\" style=\"margin: 0px 0px 0px 0px;\" allow-empty-selection=\"false\" name=\"radio-group\" (ionChange)=\"radioGroupChange($event)\" value = \"Centralizado\"> \n      <div style=\"display: flex; justify-content: space-around; align-items: center;\">\n        <div>\n          <ion-radio class=\"radio\" value=\"Esquerda\"></ion-radio>\n          <ion-label style=\"margin-left: 5px;\">Esquerda</ion-label>\n        </div>\n\n        <div>\n          <ion-radio class=\"radio\" value=\"Centralizado\"></ion-radio>\n          <ion-label style=\"margin-left: 5px;\" class=\"label-right\">Centralizado</ion-label>\n        </div>\n\n        <div>\n          <ion-radio class=\"radio\" value=\"Direita\"></ion-radio>\n          <ion-label style=\"margin-left: 5px;\" class=\"label-right\">Direita</ion-label>\n        </div>\n      </div>\n    </ion-radio-group>\n\n    <h3 style=\"margin: 5px 0px 0px 10px;\">ESTILIZAÇÃO</h3>\n\n    <div style=\"display: flex; justify-content: space-between; margin: 0px 0px 0px 10px;\">\n      <div>\n        <h3>WIDTH:</h3>\n      </div>\n\n      <div>\n        <ion-list>\n          <ion-select mode=\"ios\" value=\"6\" (ionChange)=\"widthListChange($event);\" cancelText=\"Cancelar\" interface=\"popover\">\n            <ion-select-option value=\"1\">1</ion-select-option>\n            <ion-select-option value=\"2\">2</ion-select-option>\n            <ion-select-option value=\"3\">3</ion-select-option>\n            <ion-select-option value=\"4\">4</ion-select-option>\n            <ion-select-option value=\"5\">5</ion-select-option>\n            <ion-select-option value=\"6\">6</ion-select-option>\n          </ion-select>\n        </ion-list>\n      </div>\n\n      <div *ngIf=\"isQrCodeNotSelected\">\n        <h3>HEIGHT:</h3>\n      </div>\n\n      <div *ngIf=\"isQrCodeNotSelected\">\n        <ion-list>\n          <ion-select mode=\"ios\" value=\"120\" (ionChange)=\"heightListChange($event);\" cancelText=\"Cancelar\" interface=\"popover\">\n            <ion-select-option value=\"20\">20</ion-select-option>\n            <ion-select-option value=\"60\">60</ion-select-option>\n            <ion-select-option value=\"120\">120</ion-select-option>\n            <ion-select-option value=\"200\">200</ion-select-option>\n          </ion-select>\n        </ion-list>\n      </div>\n\n      <div style=\"display: flex; align-self: center;\"> \n        <ion-checkbox [(ngModel)]=\"cutPaper\" ></ion-checkbox>\n        <ion-label style=\"margin-left: 5px;\" >CUT PAPER</ion-label>\n      </div>\n\n    </div>\n\n    <ion-button color=\"primary\" (click)=\"printBarcode()\" expand=\"full\" mode=\"android\" >IMPRIMIR CÓDIGO DE BARRAS</ion-button>\n    \n  </ion-grid>\n</ion-content>");

/***/ }),

/***/ 8054:
/*!*****************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/printer-image-tab/printer-image-tab.page.html ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-content>\n  <ion-grid>\n    <h4 style=\"text-align: center; margin: 0px 0px 0px 0px; font-size: medium;\">IMPRESSÃO DE CÓDIGO DE BARRAS</h4>\n    <h4 style=\"text-align: center; margin-top: 10px; font-size: large; \">PRÉ-VISUALIZAÇÃO</h4>\n    <img [src]=\"picToView\" style=\"display: flexbox;  justify-content: center; text-align: end;\"  (click)=\"changeView()\" />\n    <h3 style=\"margin: 5px 0px 0px 10px;\">ESTILIZAÇÃO:</h3>\n    <div style=\"margin-left: 15px;\"> \n      <ion-checkbox [(ngModel)]=\"cutPaper\" ></ion-checkbox>\n      <ion-label style=\"margin-left: 5px;\" >CUT PAPER</ion-label>\n    </div>\n    <div style=\"display: flex; margin-top: 5px; flex-direction: row;  justify-content: space-around; align-items: center;\">\n      <div style=\"width: 40%;\"> \n        <ion-button (click)=\"chooseImage()\" color=\"primary\"  expand=\"full\" mode=\"android\" >SELECIONAR</ion-button>\n      </div>\n      <div style=\"width: 40%; \">\n        <ion-button (click)=\"printSelectedImage()\" color=\"primary\"  expand=\"full\" mode=\"android\" >IMPRIMIR</ion-button>\n      </div>\n    </div>\n  </ion-grid>\n</ion-content>");

/***/ }),

/***/ 5126:
/*!***************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/printer-text-tab/printer-text-tab.page.html ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-content >\n \n  <ion-grid>\n\n   \n    <div style=\"text-align: start; margin: 0px 0px 0px 0px;\">\n      <h4 style=\"text-align: center; margin: 0px 0px 0px 0px; font-size: medium;\">IMPRESSÃO DE TEXTO</h4>\n    \n      <ion-item style=\"margin: 5px 0px 0px 0px;\">\n        <h2>MENSAGEM: </h2>\n        <ion-input style=\"align-self: flex-end;\" type=\"text\" [(ngModel)]=\"message\" id=\"mensagem\"></ion-input>\n      </ion-item>\n\n      <h2 style=\"margin: 5px 0px 1px 10px;\">ALINHAMENTO</h2>\n      \n\n      <ion-radio-group style=\"margin: 0px 0px 0px 0px;\" allow-empty-selection=\"false\" name=\"radio-group\" (ionChange)=\"alinhamentoRadioChange($event)\" value = \"Centralizado\"> \n        <div style=\"display: flex; justify-content: space-around; align-items: center;\">\n          <div>\n            <ion-radio class=\"radio\" value=\"Esquerda\"></ion-radio>\n            <ion-label style=\"margin-left: 5px;\">ESQUERDA</ion-label>\n          </div>\n\n          <div>\n            <ion-radio class=\"radio\" value=\"Centralizado\"></ion-radio>\n            <ion-label style=\"margin-left: 5px;\" class=\"label-right\">CENTRALIZADO</ion-label>\n          </div>\n\n          <div>\n            <ion-radio class=\"radio\" value=\"Direita\"></ion-radio>\n            <ion-label style=\"margin-left: 5px;\" class=\"label-right\">DIREITA</ion-label>\n          </div>\n        </div>\n      </ion-radio-group>\n\n      <h3 style=\"margin: 5px 0px 0px 10px;\">ESTILIZAÇÃO:</h3>\n\n      <div style=\"display: flex; justify-content: space-between; margin: 0px 0px 0px 10px;\">\n        <div>\n          <h3>FONT FAMILY:</h3>\n        </div>\n\n        <div>\n          <ion-list>\n            <ion-select mode=\"ios\" value=\"FONT A\" (ionChange)=\"fontListChange($event);\" cancelText=\"Cancelar\" interface=\"popover\">\n              <ion-select-option value=\"FONT A\">Fonte A</ion-select-option>\n              <ion-select-option value=\"FONT B\">Fonte B</ion-select-option>\n            </ion-select>\n          </ion-list>\n        </div>\n\n        <div>\n          <h3>FONT SIZE:</h3>\n        </div>\n\n        <div>\n          <ion-list>\n            <ion-select mode=\"ios\" value=\"17\" (ionChange)=\"fontsizeListChange($event);\" cancelText=\"Cancelar\" interface=\"popover\">\n              <ion-select-option value=\"17\">17</ion-select-option>\n              <ion-select-option value=\"34\">34</ion-select-option>\n              <ion-select-option value=\"51\">51</ion-select-option>\n              <ion-select-option value=\"68\">68</ion-select-option>\n            </ion-select>\n          </ion-list>\n        </div>\n\n      </div>\n\n      <div style=\"display: flex; justify-content: space-between;  margin: 0px 0px 0px 10px;\">\n        \n        <div>\n          <ion-checkbox [(ngModel)]=\"isBold\"  checked=\"false\"></ion-checkbox>\n          <ion-label style=\"margin-left: 5px;\" >NEGRITO</ion-label>\n        </div>\n\n        <div>\n          <ion-checkbox [(ngModel)]=\"isUnderline\" checked=\"false\"></ion-checkbox>\n          <ion-label style=\"margin-left: 5px;\">SUBLINHADO</ion-label>\n        </div>\n\n        <div>\n          <ion-checkbox [(ngModel)]=\"cutPaper\" ></ion-checkbox>\n          <ion-label style=\"margin-left: 5px;\" >CUT PAPER</ion-label>\n        </div>\n\n      </div>\n\n      <div>\n        <ion-button (click)=\"printText()\" color=\"primary\"  expand=\"full\" mode=\"android\" >IMPRIMIR TEXTO</ion-button>\n      </div>\n      \n      <div style=\"display: flex; flex-direction: row;\">\n        <div style=\"width: 50%;\"> \n          <ion-button (click)=\"printXmlNFCE()\" color=\"primary\"  expand=\"full\" mode=\"android\" >NFCE</ion-button>\n        </div>\n        <div style=\"width: 50%;\">\n          <ion-button (click)=\"printXmlSAT()\" color=\"primary\"  expand=\"full\" mode=\"android\" >SAT</ion-button>\n        </div>\n      </div>\n\n    </div>\n  </ion-grid>\n</ion-content>");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4431)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map