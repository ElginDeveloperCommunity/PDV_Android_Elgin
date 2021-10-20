(self["webpackChunkM8"] = self["webpackChunkM8"] || []).push([["src_app_tef_tef_module_ts"],{

/***/ 2305:
/*!*******************************************!*\
  !*** ./src/app/tef/tef-routing.module.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TefPageRoutingModule": () => (/* binding */ TefPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 9895);
/* harmony import */ var _tef_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tef.page */ 7942);




const routes = [
    {
        path: '',
        component: _tef_page__WEBPACK_IMPORTED_MODULE_0__.TefPage
    }
];
let TefPageRoutingModule = class TefPageRoutingModule {
};
TefPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    })
], TefPageRoutingModule);



/***/ }),

/***/ 5803:
/*!***********************************!*\
  !*** ./src/app/tef/tef.module.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TefPageModule": () => (/* binding */ TefPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 8583);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 3679);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 476);
/* harmony import */ var _tef_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tef-routing.module */ 2305);
/* harmony import */ var _tef_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tef.page */ 7942);







let TefPageModule = class TefPageModule {
};
TefPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _tef_routing_module__WEBPACK_IMPORTED_MODULE_0__.TefPageRoutingModule
        ],
        declarations: [_tef_page__WEBPACK_IMPORTED_MODULE_1__.TefPage]
    })
], TefPageModule);



/***/ }),

/***/ 7942:
/*!*********************************!*\
  !*** ./src/app/tef/tef.page.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TefPage": () => (/* binding */ TefPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _raw_loader_tef_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !raw-loader!./tef.page.html */ 1172);
/* harmony import */ var _tef_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tef.page.scss */ 8706);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! capacitor-elgin-m8 */ 4534);





let TefPage = class TefPage {
    constructor() {
        this.tefSelected = "paygo";
        this.green = "#38e121";
        this.black = "black";
        this.value = "2000";
        this.installmentsNumber = "1";
        this.ip = "";
        this.paymentMethod = "Crédito";
        this.installmentMethod = "Loja";
        this.ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
        this.isPaygoSelected = true;
        this.isMSitefSelected = false;
        this.mSitefBorder = this.black;
        this.paygoBorder = this.green;
        //paymentMethods
        this.creditBorder = this.green;
        this.debitBorder = this.black;
        this.allBorder = this.black;
        //installmentMethods
        this.storeBorder = this.green;
        this.admBorder = this.black;
        this.avistaBorder = this.black;
    }
    ngOnInit() {
    }
    selectMSitef() {
        alert("M-Sitef não foi válidado!");
        //this.mSitefBorder = this.green;
        //this.paygoBorder = this.black;
        //this.isMSitefSelected = true;
        //this.isPaygoSelected = false;
        //if(this.avistaBorder == this.green){
        //this.avistaBorder = this.black;
        //this.storeBorder = this.green;
        //} 
    }
    selectPaygo() {
        this.mSitefBorder = this.black;
        this.paygoBorder = this.green;
        this.isMSitefSelected = false;
        this.isPaygoSelected = true;
    }
    //paymentMethods
    selectCredit() {
        this.paymentMethod = "Crédito";
        this.creditBorder = this.green;
        this.debitBorder = this.black;
        this.allBorder = this.black;
    }
    selectDebit() {
        this.paymentMethod = "Débit";
        this.creditBorder = this.black;
        this.debitBorder = this.green;
        this.allBorder = this.black;
    }
    selectAll() {
        this.paymentMethod = "Todos";
        this.creditBorder = this.black;
        this.debitBorder = this.black;
        this.allBorder = this.green;
    }
    //installmentMethods
    selectStore() {
        this.installmentMethod = "Loja";
        this.storeBorder = this.green;
        this.admBorder = this.black;
        this.avistaBorder = this.black;
    }
    selectAdm() {
        this.installmentMethod = "Adm";
        this.storeBorder = this.black;
        this.admBorder = this.green;
        this.avistaBorder = this.black;
    }
    selectAVista() {
        this.installmentMethod = "AVista";
        this.storeBorder = this.black;
        this.admBorder = this.black;
        this.avistaBorder = this.green;
    }
    sendTransaction() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__.m8Plugin.sendPaygoParams({
                action: "SALE",
                valor: "2000",
                parcelas: 1,
                formaPagamento: this.paymentMethod,
                tipoParcelamento: this.installmentMethod
            })
                .then(sucessResult => alert(sucessResult["via_cliente"]), failureResult => alert(failureResult));
        });
    }
    cancelTransaction() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            yield capacitor_elgin_m8__WEBPACK_IMPORTED_MODULE_2__.m8Plugin.sendPaygoParams({
                action: "CANCEL",
                valor: this.value,
                parcelas: parseInt(this.installmentsNumber),
                formaPagamento: this.paymentMethod,
                tipoParcelamento: this.installmentMethod
            })
                .then(sucessResult => alert(sucessResult["via_cliente"]), failureResult => alert(failureResult));
        });
    }
};
TefPage.ctorParameters = () => [];
TefPage = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Component)({
        selector: 'app-tef',
        template: _raw_loader_tef_page_html__WEBPACK_IMPORTED_MODULE_0__.default,
        styles: [_tef_page_scss__WEBPACK_IMPORTED_MODULE_1__.default]
    })
], TefPage);



/***/ }),

/***/ 8706:
/*!***********************************!*\
  !*** ./src/app/tef/tef.page.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".pageTitle {\n  margin: 10px 0px 15px 0px;\n}\n\n.mainLogo {\n  height: 50px;\n  position: fixed;\n  right: 30px;\n  top: 0px;\n}\n\nh1 {\n  font-size: small;\n}\n\nion-row {\n  height: 35px;\n}\n\n.customBox {\n  display: flexbox;\n  border-radius: 15px;\n  border-style: solid;\n  border-color: black;\n  margin-top: 2px;\n  height: 50px;\n  width: 120px;\n  text-align: center;\n}\n\n.customBox2 {\n  display: flexbox;\n  border-radius: 15px;\n  border-style: solid;\n  border-color: black;\n  margin-top: 2px;\n  height: 50px;\n  width: 100px;\n  text-align: center;\n}\n\n.box {\n  display: flexbox;\n  border-radius: 15px;\n  border-style: solid;\n  border-color: black;\n  margin-top: 2px;\n  height: 400px;\n}\n\n.menuButton {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n  height: 100%;\n  width: 100%;\n  background-color: transparent;\n}\n\nimg {\n  height: 30px;\n  margin-top: 0px;\n}\n\nspan {\n  display: inline-block;\n  vertical-align: middle;\n  line-height: normal;\n  font-size: larger;\n}\n\n.footer {\n  position: fixed;\n  bottom: 0;\n  right: 0;\n  margin-right: 100px;\n  font-weight: bold;\n  font-size: large;\n  color: #7F7F7F;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlZi5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSx5QkFBQTtBQUNKOztBQUVBO0VBQ0ksWUFBQTtFQUNBLGVBQUE7RUFDQSxXQUFBO0VBQ0EsUUFBQTtBQUNKOztBQUVBO0VBQ0ksZ0JBQUE7QUFDSjs7QUFFQTtFQUNJLFlBQUE7QUFDSjs7QUFFQTtFQUNJLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7QUFDSjs7QUFFQTtFQUNJLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7QUFDSjs7QUFDQTtFQUNJLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7QUFFSjs7QUFDQTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLDZCQUFBO0FBRUo7O0FBQ0E7RUFDSSxZQUFBO0VBQ0EsZUFBQTtBQUVKOztBQUVBO0VBQ0kscUJBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsaUJBQUE7QUFDSjs7QUFFQTtFQUNJLGVBQUE7RUFDQSxTQUFBO0VBQ0EsUUFBQTtFQUNBLG1CQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUFDSiIsImZpbGUiOiJ0ZWYucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnBhZ2VUaXRsZXtcclxuICAgIG1hcmdpbjogMTBweCAwMHB4IDE1cHggMDBweDtcclxufVxyXG5cclxuLm1haW5Mb2dve1xyXG4gICAgaGVpZ2h0OiA1MHB4O1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgcmlnaHQ6IDMwcHg7XHJcbiAgICB0b3A6IDBweDtcclxufVxyXG5cclxuaDF7XHJcbiAgICBmb250LXNpemU6IHNtYWxsO1xyXG59XHJcblxyXG5pb24tcm93e1xyXG4gICAgaGVpZ2h0OiAzNXB4O1xyXG59XHJcblxyXG4uY3VzdG9tQm94e1xyXG4gICAgZGlzcGxheTogZmxleGJveDsgIFxyXG4gICAgYm9yZGVyLXJhZGl1czogMTVweDtcclxuICAgIGJvcmRlci1zdHlsZTogc29saWQ7XHJcbiAgICBib3JkZXItY29sb3I6IGJsYWNrO1xyXG4gICAgbWFyZ2luLXRvcDogMnB4O1xyXG4gICAgaGVpZ2h0OiA1MHB4O1xyXG4gICAgd2lkdGg6IDEyMHB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcblxyXG4uY3VzdG9tQm94MntcclxuICAgIGRpc3BsYXk6IGZsZXhib3g7ICBcclxuICAgIGJvcmRlci1yYWRpdXM6IDE1cHg7XHJcbiAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xyXG4gICAgYm9yZGVyLWNvbG9yOiBibGFjaztcclxuICAgIG1hcmdpbi10b3A6IDJweDtcclxuICAgIGhlaWdodDogNTBweDtcclxuICAgIHdpZHRoOiAxMDBweDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG4uYm94e1xyXG4gICAgZGlzcGxheTogZmxleGJveDsgIFxyXG4gICAgYm9yZGVyLXJhZGl1czogMTVweDtcclxuICAgIGJvcmRlci1zdHlsZTogc29saWQ7XHJcbiAgICBib3JkZXItY29sb3I6IGJsYWNrO1xyXG4gICAgbWFyZ2luLXRvcDogMnB4O1xyXG4gICAgaGVpZ2h0OiA0MDBweDtcclxufVxyXG5cclxuLm1lbnVCdXR0b257XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG59XHJcblxyXG5pbWd7XHJcbiAgICBoZWlnaHQ6IDMwcHg7XHJcbiAgICBtYXJnaW4tdG9wOiAwcHg7XHJcbiAgICBcclxufVxyXG5cclxuc3BhbiB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xyXG4gIH1cclxuXHJcbi5mb290ZXJ7XHJcbiAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICByaWdodDogMDtcclxuICAgIG1hcmdpbi1yaWdodDogMTAwcHg7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGZvbnQtc2l6ZTogbGFyZ2U7XHJcbiAgICBjb2xvcjogIzdGN0Y3RlxyXG59XHJcblxyXG4iXX0= */");

/***/ }),

/***/ 1172:
/*!*************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/tef/tef.page.html ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-content color=\"light\">\n  <ion-grid >\n    \n    <h1 class=\"pageTitle\" style=\"font-size: large;\">TEF</h1>\n    <img class=\"mainLogo\" src=\"/assets/elginlogo.png\">\n     \n    \n    <div style=\"display: flex; flex-direction: row;\">\n      \n      <div style=\"width: 50%;  \">\n        <div style=\"display: flex; flex-direction: row; margin-bottom: 0px; margin-top: 0px; \">\n\n          <div class=\"customBox\" [style.border-color]=\"mSitefBorder\"  >\n            <button (click)=\"selectMSitef()\" style=\"background-color: transparent; width: 100%; height: 100%;\">\n              <span>M-SITEF</span>\n            </button>\n          </div>\n\n          <div class=\"customBox\" style=\"margin-left: 10px;\" [style.border-color]=\"paygoBorder\">\n            <button (click)=\"selectPaygo()\" style=\"background-color: transparent; width: 100%; height: 100%; \">\n              <span>PAYGO</span>\n            </button>\n          </div>\n        </div>\n        \n        <div>\n          <ion-row>\n            <ion-col>\n              <h1>VALOR</h1>\n            </ion-col>\n\n            <ion-col>\n              <ion-item style=\"margin: 5px 0px 0px 0px; --background: transparent; --border-color: black\">\n                <ion-input style=\"align-self: flex-end;\" type=\"text\" [(ngModel)]=\"value\" ></ion-input>\n              </ion-item>\n            </ion-col>\n          </ion-row>\n\n        </div>\n\n        <div>\n          <ion-row>\n            <ion-col>\n              <h1>N° PARCELAS</h1>\n            </ion-col>\n\n            <ion-col>\n              <ion-item style=\"margin: 5px 0px 0px 0px; --background: transparent; --border-color: black\">\n                <ion-input style=\"align-self: flex-end;\" type=\"text\" [(ngModel)]=\"installmentsNumber\" ></ion-input>\n              </ion-item>\n            </ion-col>\n          </ion-row>\n        </div>\n\n        <div>\n          <ion-row>\n            <ion-col>\n              <h1>IP</h1>\n            </ion-col>\n\n            <ion-col>\n              <ion-item  style=\"margin: 5px 0px 0px 0px; --background: transparent; --border-color: black\">\n                <ion-input placeholder=\"192.168.0.31\"  [disabled]=\"!isMSitefSelected\" style=\"align-self: flex-end;\" type=\"text\" [(ngModel)]=\"ip\" ></ion-input>\n              </ion-item>\n            </ion-col>\n          </ion-row>\n        </div>\n       \n        <h1 style=\"margin-bottom: 5px;\">FORMAS DE PAGAMENTO:</h1>\n\n        <div style=\"display: flex;  \">\n          <div class=\"customBox2\" [style.border-color]=\"creditBorder\">\n            <button  (click)=\"selectCredit()\" class=\"menuButton\" type=\"button\">\n              <img src=\"assets/card.png\">\n              crédito\n            </button>\n          </div>\n\n          <div class=\"customBox2\" [style.border-color]=\"debitBorder\">\n            <button  (click)=\"selectDebit()\" class=\"menuButton\" type=\"button\">\n              <img src=\"assets/card.png\">\n              débito\n            </button>\n          </div>\n\n          <div class=\"customBox2\" [style.border-color]=\"allBorder\">\n            <button  (click)=\"selectAll()\" class=\"menuButton\" type=\"button\">\n              <img src=\"assets/voucher.png\">\n              todos\n            </button>\n          </div>\n        </div>\n\n        <h1 style=\"margin-top: 5px; margin-bottom: 5px; \">TIPOS DE PARCELAMENTO:</h1>\n\n        <div style=\"display: flex; margin-bottom: 5px; \">\n          <div class=\"customBox2\" [style.border-color]=\"storeBorder\">\n            <button  (click)=\"selectStore()\" class=\"menuButton\" type=\"button\">\n              <img src=\"assets/store.png\">\n              loja\n            </button>\n          </div>\n\n          <div class=\"customBox2\" [style.border-color]=\"admBorder\" >\n            <button  (click)=\"selectAdm()\" class=\"menuButton\" type=\"button\">\n              <img src=\"assets/adm.png\">\n              adm\n            </button>\n          </div>\n\n          <div class=\"customBox2\" [style.border-color]=\"avistaBorder\" *ngIf=\"isPaygoSelected\">\n            <button  (click)=\"selectAVista()\" class=\"menuButton\" type=\"button\">\n              <img src=\"assets/card.png\">\n              a vista\n            </button>\n          </div>\n        </div>\n\n        <ion-row>\n          <ion-col>\n            <ion-button (click)=\"sendTransaction()\" size=\"small\" expand=\"full\" color=\"primary\" mode=\"ios\">ENVIAR TRANSAÇÃO</ion-button>\n          </ion-col>\n          \n          <ion-col>\n            <ion-button (click)=\"cancelTransaction()\" size=\"small\" expand=\"full\" color=\"primary\" mode=\"ios\">CANCELAR TRANSAÇÃO</ion-button>\n          </ion-col>\n        </ion-row>\n\n        <ion-row>\n          <ion-col>\n            <ion-button (click)=\"openDrawer()\" expand=\"full\" size=\"small\" color=\"primary\" mode=\"ios\">CONFIGURAÇÃO</ion-button>\n          </ion-col>\n        </ion-row>\n          \n       \n      </div>\n      \n      <div class=\"box\" style=\"width: 50%;\">\n\n      </div>\n\n    </div>\n   \n    \n    <h1 class=\"footer\">Ionic 1.0.0</h1>\n\n  </ion-grid>\n</ion-content>");

/***/ })

}]);
//# sourceMappingURL=src_app_tef_tef_module_ts.js.map