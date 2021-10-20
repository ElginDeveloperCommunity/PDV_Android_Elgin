(self["webpackChunkM8"] = self["webpackChunkM8"] || []).push([["src_app_home_home_module_ts"],{

/***/ 2003:
/*!*********************************************!*\
  !*** ./src/app/home/home-routing.module.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HomePageRoutingModule": () => (/* binding */ HomePageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 9895);
/* harmony import */ var _home_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.page */ 2267);




const routes = [
    {
        path: '',
        component: _home_page__WEBPACK_IMPORTED_MODULE_0__.HomePage,
    }
];
let HomePageRoutingModule = class HomePageRoutingModule {
};
HomePageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    })
], HomePageRoutingModule);



/***/ }),

/***/ 3467:
/*!*************************************!*\
  !*** ./src/app/home/home.module.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HomePageModule": () => (/* binding */ HomePageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 8583);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 476);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 3679);
/* harmony import */ var _home_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.page */ 2267);
/* harmony import */ var _home_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./home-routing.module */ 2003);







let HomePageModule = class HomePageModule {
};
HomePageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _home_routing_module__WEBPACK_IMPORTED_MODULE_1__.HomePageRoutingModule
        ],
        declarations: [_home_page__WEBPACK_IMPORTED_MODULE_0__.HomePage]
    })
], HomePageModule);



/***/ }),

/***/ 2267:
/*!***********************************!*\
  !*** ./src/app/home/home.page.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HomePage": () => (/* binding */ HomePage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _raw_loader_home_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !raw-loader!./home.page.html */ 9764);
/* harmony import */ var _home_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./home.page.scss */ 2610);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 476);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 9895);






//import { TestPage } from '../test/test.page';
let HomePage = class HomePage {
    constructor(router, alertController) {
        this.router = router;
        this.alertController = alertController;
    }
    ngOnInit() {
    }
    goToPrinter() {
        this.router.navigate(['printer']);
    }
    goToTef() {
        this.router.navigate(['tef']);
    }
    goToCodbar() {
        this.router.navigate(['codbar']);
    }
    presentAlert(msg) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, void 0, function* () {
            const alert = yield this.alertController.create({
                header: 'Retorno',
                message: msg,
                buttons: ['OK'],
            });
            yield alert.present();
        });
    }
};
HomePage.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__.Router },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.AlertController }
];
HomePage.propDecorators = {
    nav: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_5__.ViewChild, args: ['myNav',] }]
};
HomePage = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.Component)({
        selector: 'app-home',
        template: _raw_loader_home_page_html__WEBPACK_IMPORTED_MODULE_0__.default,
        styles: [_home_page_scss__WEBPACK_IMPORTED_MODULE_1__.default]
    })
], HomePage);



/***/ }),

/***/ 2610:
/*!*************************************!*\
  !*** ./src/app/home/home.page.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".MainLogo {\n  width: 490px;\n  height: 139px;\n}\n\n.box {\n  border-radius: 15px;\n  border-style: solid;\n  border-color: black;\n}\n\nbutton img {\n  padding-top: 10px;\n}\n\nh4 {\n  color: black;\n  font-weight: bold;\n  font-size: large;\n}\n\n.menuButton {\n  height: 120px;\n  width: 200px;\n  background-color: transparent;\n  align-items: flex-end;\n}\n\n.footer {\n  position: fixed;\n  bottom: 0;\n  right: 0;\n  margin-right: 100px;\n  font-weight: bold;\n  font-size: large;\n  color: #7F7F7F;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsWUFBQTtFQUNBLGFBQUE7QUFDRjs7QUFDQTtFQUNFLG1CQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtBQUVGOztBQUFBO0VBQ0UsaUJBQUE7QUFHRjs7QUFEQTtFQUNFLFlBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0FBSUY7O0FBRkE7RUFDRSxhQUFBO0VBQ0EsWUFBQTtFQUNBLDZCQUFBO0VBQ0EscUJBQUE7QUFLRjs7QUFGQTtFQUNFLGVBQUE7RUFDQSxTQUFBO0VBQ0EsUUFBQTtFQUNBLG1CQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUFLRiIsImZpbGUiOiJob21lLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5NYWluTG9nb3tcbiAgd2lkdGg6IDQ5MHB4O1xuICBoZWlnaHQ6IDEzOXB4O1xufVxuLmJveHtcbiAgYm9yZGVyLXJhZGl1czogMTVweDtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgYm9yZGVyLWNvbG9yOiBibGFjaztcbn1cbmJ1dHRvbiBpbWd7XG4gIHBhZGRpbmctdG9wOiAxMHB4O1xufVxuaDR7XG4gIGNvbG9yOiBibGFjaztcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc2l6ZTogbGFyZ2U7XG59XG4ubWVudUJ1dHRvbntcbiAgaGVpZ2h0OiAxMjBweDtcbiAgd2lkdGg6IDIwMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xufVxuXG4uZm9vdGVyIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICBib3R0b206IDA7XG4gIHJpZ2h0OiAwO1xuICBtYXJnaW4tcmlnaHQ6IDEwMHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zaXplOiBsYXJnZTtcbiAgY29sb3I6ICM3RjdGN0Zcbn0iXX0= */");

/***/ }),

/***/ 9764:
/*!***************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/home/home.page.html ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-content color=\"light\">\n  <ion-grid>\n    <ion-row >\n      <ion-col style=\"text-align: center;\">\n        <img class=\"MainLogo\" src=\"/assets/elginlogo.png\">\n      </ion-col>\n    </ion-row>\n\n    <ion-row  class=\"ion-justify-content-center\">\n      <ion-row>\n        <ion-col>\n          <div class=\"box\">\n            <button (click)=\"goToPrinter()\" class=\"menuButton\" type=\"button\">\n              <img style=\"text-align: center;\" src=\"assets/printer.png\">\n              <h4>IMPRESSORA</h4>\n            </button>\n          </div>\n        </ion-col>\n      </ion-row>\n      \n      <ion-row>\n        <ion-col>\n          <div class=\"box\">\n            <button (click)=\"goToCodbar()\" class=\"menuButton\" type=\"button\">\n              <img style=\"text-align: center;\" src=\"assets/barcode.png\">\n              <h4>CÓDIGO DE BARRAS</h4>\n            </button>\n          </div>\n        </ion-col>\n      </ion-row>\n    </ion-row>\n    \n    <ion-row  class=\"ion-justify-content-center\">\n      <ion-row>\n        <ion-col>\n          <div class=\"box\">\n            <button (click)=\"goToTef()\" class=\"menuButton\" type=\"button\">\n              <img style=\"text-align: center;\" src=\"assets/msitef.png\">\n              <h4>TEF</h4>\n            </button>\n          </div>\n        </ion-col>\n      </ion-row>\n      \n      <ion-row>\n        <ion-col>\n          <div class=\"box\">\n            <button (click)=\"changeNav()\" class=\"menuButton\" type=\"button\">\n              <img style=\"text-align: center;\" src=\"assets/sat.png\">\n              <h4>SAT</h4>\n            </button>\n          </div>\n        </ion-col>\n      </ion-row>\n    </ion-row>\n    \n   \n    \n\n    <h1 class=\"footer\">Ionic 1.0.0</h1>\n  </ion-grid>\n</ion-content>");

/***/ })

}]);
//# sourceMappingURL=src_app_home_home_module_ts.js.map