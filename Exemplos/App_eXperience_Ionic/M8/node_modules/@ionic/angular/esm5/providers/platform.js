import * as tslib_1 from "tslib";
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { getPlatforms, isPlatform } from '@ionic/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
var Platform = /** @class */ (function () {
    function Platform(doc, zone) {
        var _this = this;
        this.doc = doc;
        /**
         * @hidden
         */
        this.backButton = new Subject();
        /**
         * The keyboardDidShow event emits when the
         * on-screen keyboard is presented.
         */
        this.keyboardDidShow = new Subject();
        /**
         * The keyboardDidHide event emits when the
         * on-screen keyboard is hidden.
         */
        this.keyboardDidHide = new Subject();
        /**
         * The pause event emits when the native platform puts the application
         * into the background, typically when the user switches to a different
         * application. This event would emit when a Cordova app is put into
         * the background, however, it would not fire on a standard web browser.
         */
        this.pause = new Subject();
        /**
         * The resume event emits when the native platform pulls the application
         * out from the background. This event would emit when a Cordova app comes
         * out from the background, however, it would not fire on a standard web browser.
         */
        this.resume = new Subject();
        /**
         * The resize event emits when the browser window has changed dimensions. This
         * could be from a browser window being physically resized, or from a device
         * changing orientation.
         */
        this.resize = new Subject();
        zone.run(function () {
            _this.win = doc.defaultView;
            _this.backButton.subscribeWithPriority = function (priority, callback) {
                return this.subscribe(function (ev) {
                    return ev.register(priority, function (processNextHandler) { return zone.run(function () { return callback(processNextHandler); }); });
                });
            };
            proxyEvent(_this.pause, doc, 'pause');
            proxyEvent(_this.resume, doc, 'resume');
            proxyEvent(_this.backButton, doc, 'ionBackButton');
            proxyEvent(_this.resize, _this.win, 'resize');
            proxyEvent(_this.keyboardDidShow, _this.win, 'ionKeyboardDidShow');
            proxyEvent(_this.keyboardDidHide, _this.win, 'ionKeyboardDidHide');
            var readyResolve;
            _this._readyPromise = new Promise(function (res) { readyResolve = res; });
            if (_this.win && _this.win['cordova']) {
                doc.addEventListener('deviceready', function () {
                    readyResolve('cordova');
                }, { once: true });
            }
            else {
                readyResolve('dom');
            }
        });
    }
    /**
     * @returns returns true/false based on platform.
     * @description
     * Depending on the platform the user is on, `is(platformName)` will
     * return `true` or `false`. Note that the same app can return `true`
     * for more than one platform name. For example, an app running from
     * an iPad would return `true` for the platform names: `mobile`,
     * `ios`, `ipad`, and `tablet`. Additionally, if the app was running
     * from Cordova then `cordova` would be true, and if it was running
     * from a web browser on the iPad then `mobileweb` would be `true`.
     *
     * ```
     * import { Platform } from 'ionic-angular';
     *
     * @Component({...})
     * export MyPage {
     *   constructor(public platform: Platform) {
     *     if (this.platform.is('ios')) {
     *       // This will only print when on iOS
     *       console.log('I am an iOS device!');
     *     }
     *   }
     * }
     * ```
     *
     * | Platform Name   | Description                        |
     * |-----------------|------------------------------------|
     * | android         | on a device running Android.       |
     * | capacitor       | on a device running Capacitor.     |
     * | cordova         | on a device running Cordova.       |
     * | ios             | on a device running iOS.           |
     * | ipad            | on an iPad device.                 |
     * | iphone          | on an iPhone device.               |
     * | phablet         | on a phablet device.               |
     * | tablet          | on a tablet device.                |
     * | electron        | in Electron on a desktop device.   |
     * | pwa             | as a PWA app.                      |
     * | mobile          | on a mobile device.                |
     * | mobileweb       | on a mobile device in a browser.   |
     * | desktop         | on a desktop device.               |
     * | hybrid          | is a cordova or capacitor app.     |
     *
     */
    Platform.prototype.is = function (platformName) {
        return isPlatform(this.win, platformName);
    };
    /**
     * @returns the array of platforms
     * @description
     * Depending on what device you are on, `platforms` can return multiple values.
     * Each possible value is a hierarchy of platforms. For example, on an iPhone,
     * it would return `mobile`, `ios`, and `iphone`.
     *
     * ```
     * import { Platform } from 'ionic-angular';
     *
     * @Component({...})
     * export MyPage {
     *   constructor(public platform: Platform) {
     *     // This will print an array of the current platforms
     *     console.log(this.platform.platforms());
     *   }
     * }
     * ```
     */
    Platform.prototype.platforms = function () {
        return getPlatforms(this.win);
    };
    /**
     * Returns a promise when the platform is ready and native functionality
     * can be called. If the app is running from within a web browser, then
     * the promise will resolve when the DOM is ready. When the app is running
     * from an application engine such as Cordova, then the promise will
     * resolve when Cordova triggers the `deviceready` event.
     *
     * The resolved value is the `readySource`, which states which platform
     * ready was used. For example, when Cordova is ready, the resolved ready
     * source is `cordova`. The default ready source value will be `dom`. The
     * `readySource` is useful if different logic should run depending on the
     * platform the app is running from. For example, only Cordova can execute
     * the status bar plugin, so the web should not run status bar plugin logic.
     *
     * ```
     * import { Component } from '@angular/core';
     * import { Platform } from 'ionic-angular';
     *
     * @Component({...})
     * export MyApp {
     *   constructor(public platform: Platform) {
     *     this.platform.ready().then((readySource) => {
     *       console.log('Platform ready from', readySource);
     *       // Platform now ready, execute any required native code
     *     });
     *   }
     * }
     * ```
     */
    Platform.prototype.ready = function () {
        return this._readyPromise;
    };
    Object.defineProperty(Platform.prototype, "isRTL", {
        /**
         * Returns if this app is using right-to-left language direction or not.
         * We recommend the app's `index.html` file already has the correct `dir`
         * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
         * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
         */
        get: function () {
            return this.doc.dir === 'rtl';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the query string parameter
     */
    Platform.prototype.getQueryParam = function (key) {
        return readQueryParam(this.win.location.href, key);
    };
    /**
     * Returns `true` if the app is in landscape mode.
     */
    Platform.prototype.isLandscape = function () {
        return !this.isPortrait();
    };
    /**
     * Returns `true` if the app is in portrait mode.
     */
    Platform.prototype.isPortrait = function () {
        return this.win.matchMedia && this.win.matchMedia('(orientation: portrait)').matches;
    };
    Platform.prototype.testUserAgent = function (expression) {
        var nav = this.win.navigator;
        return !!(nav && nav.userAgent && nav.userAgent.indexOf(expression) >= 0);
    };
    /**
     * Get the current url.
     */
    Platform.prototype.url = function () {
        return this.win.location.href;
    };
    /**
     * Gets the width of the platform's viewport using `window.innerWidth`.
     */
    Platform.prototype.width = function () {
        return this.win.innerWidth;
    };
    /**
     * Gets the height of the platform's viewport using `window.innerHeight`.
     */
    Platform.prototype.height = function () {
        return this.win.innerHeight;
    };
    Platform.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: NgZone }
    ]; };
    Platform.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function Platform_Factory() { return new Platform(i0.ɵɵinject(i1.DOCUMENT), i0.ɵɵinject(i0.NgZone)); }, token: Platform, providedIn: "root" });
    Platform = tslib_1.__decorate([
        Injectable({
            providedIn: 'root',
        }),
        tslib_1.__param(0, Inject(DOCUMENT))
    ], Platform);
    return Platform;
}());
export { Platform };
var readQueryParam = function (url, key) {
    key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
    var results = regex.exec(url);
    return results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : null;
};
var ɵ0 = readQueryParam;
var proxyEvent = function (emitter, el, eventName) {
    if (el) {
        el.addEventListener(eventName, function (ev) {
            // ?? cordova might emit "null" events
            emitter.next(ev != null ? ev.detail : undefined);
        });
    }
};
var ɵ1 = proxyEvent;
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbInByb3ZpZGVycy9wbGF0Zm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRCxPQUFPLEVBQXlELFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDOUcsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7OztBQVM3QztJQTRDRSxrQkFBc0MsR0FBUSxFQUFFLElBQVk7UUFBNUQsaUJBMEJDO1FBMUJxQyxRQUFHLEdBQUgsR0FBRyxDQUFLO1FBdkM5Qzs7V0FFRztRQUNILGVBQVUsR0FBc0IsSUFBSSxPQUFPLEVBQWdDLENBQUM7UUFFNUU7OztXQUdHO1FBQ0gsb0JBQWUsR0FBRyxJQUFJLE9BQU8sRUFBOEIsQ0FBQztRQUU1RDs7O1dBR0c7UUFDSCxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFdEM7Ozs7O1dBS0c7UUFDSCxVQUFLLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUU1Qjs7OztXQUlHO1FBQ0gsV0FBTSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFN0I7Ozs7V0FJRztRQUNILFdBQU0sR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRzNCLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDUCxLQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7WUFDM0IsS0FBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsR0FBRyxVQUFTLFFBQVEsRUFBRSxRQUFRO2dCQUNqRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQSxFQUFFO29CQUN0QixPQUFPLEVBQUUsQ0FBQyxRQUFRLENB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T0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDN0UsQ0FBQyxDQUFDOztBQUVGLElBQU0sVUFBVSxHQUFHLFVBQUksT0FBbUIsRUFBRSxFQUFlLEVBQUUsU0FBaUI7SUFDNUUsSUFBSyxFQUFVLEVBQUU7UUFDZixFQUFFLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUMsRUFBNEI7WUFDMUQsc0NBQXNDO1lBQ3RDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUUsRUFBVSxDQUFDLE1BQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUM7S0FDSjtBQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYWNrQnV0dG9uRXZlbnREZXRhaWwsIEtleWJvYXJkRXZlbnREZXRhaWwsIFBsYXRmb3JtcywgZ2V0UGxhdGZvcm1zLCBpc1BsYXRmb3JtIH0gZnJvbSAnQGlvbmljL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFja0J1dHRvbkVtaXR0ZXIgZXh0ZW5kcyBTdWJqZWN0PEJhY2tCdXR0b25FdmVudERldGFpbD4ge1xuICBzdWJzY3JpYmVXaXRoUHJpb3JpdHkocHJpb3JpdHk6IG51bWJlciwgY2FsbGJhY2s6IChwcm9jZXNzTmV4dEhhbmRsZXI6ICgpID0+IHZvaWQpID0+IFByb21pc2U8YW55PiB8IHZvaWQpOiBTdWJzY3JpcHRpb247XG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBQbGF0Zm9ybSB7XG5cbiAgcHJpdmF0ZSBfcmVhZHlQcm9taXNlOiBQcm9taXNlPHN0cmluZz47XG4gIHByaXZhdGUgd2luOiBhbnk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGJhY2tCdXR0b246IEJhY2tCdXR0b25FbWl0dGVyID0gbmV3IFN1YmplY3Q8QmFja0J1dHRvbkV2ZW50RGV0YWlsPigpIGFzIGFueTtcblxuICAvKipcbiAgICogVGhlIGtleWJvYXJkRGlkU2hvdyBldmVudCBlbWl0cyB3aGVuIHRoZVxuICAgKiBvbi1zY3JlZW4ga2V5Ym9hcmQgaXMgcHJlc2VudGVkLlxuICAgKi9cbiAga2V5Ym9hcmREaWRTaG93ID0gbmV3IFN1YmplY3Q8S2V5Ym9hcmRFdmVudERldGFpbD4oKSBhcyBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBrZXlib2FyZERpZEhpZGUgZXZlbnQgZW1pdHMgd2hlbiB0aGVcbiAgICogb24tc2NyZWVuIGtleWJvYXJkIGlzIGhpZGRlbi5cbiAgICovXG4gIGtleWJvYXJkRGlkSGlkZSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXVzZSBldmVudCBlbWl0cyB3aGVuIHRoZSBuYXRpdmUgcGxhdGZvcm0gcHV0cyB0aGUgYXBwbGljYXRpb25cbiAgICogaW50byB0aGUgYmFja2dyb3VuZCwgdHlwaWNhbGx5IHdoZW4gdGhlIHVzZXIgc3dpdGNoZXMgdG8gYSBkaWZmZXJlbnRcbiAgICogYXBwbGljYXRpb24uIFRoaXMgZXZlbnQgd291bGQgZW1pdCB3aGVuIGEgQ29yZG92YSBhcHAgaXMgcHV0IGludG9cbiAgICogdGhlIGJhY2tncm91bmQsIGhvd2V2ZXIsIGl0IHdvdWxkIG5vdCBmaXJlIG9uIGEgc3RhbmRhcmQgd2ViIGJyb3dzZXIuXG4gICAqL1xuICBwYXVzZSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSByZXN1bWUgZXZlbnQgZW1pdHMgd2hlbiB0aGUgbmF0aXZlIHBsYXRmb3JtIHB1bGxzIHRoZSBhcHBsaWNhdGlvblxuICAgKiBvdXQgZnJvbSB0aGUgYmFja2dyb3VuZC4gVGhpcyBldmVudCB3b3VsZCBlbWl0IHdoZW4gYSBDb3Jkb3ZhIGFwcCBjb21lc1xuICAgKiBvdXQgZnJvbSB0aGUgYmFja2dyb3VuZCwgaG93ZXZlciwgaXQgd291bGQgbm90IGZpcmUgb24gYSBzdGFuZGFyZCB3ZWIgYnJvd3Nlci5cbiAgICovXG4gIHJlc3VtZSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSByZXNpemUgZXZlbnQgZW1pdHMgd2hlbiB0aGUgYnJvd3NlciB3aW5kb3cgaGFzIGNoYW5nZWQgZGltZW5zaW9ucy4gVGhpc1xuICAgKiBjb3VsZCBiZSBmcm9tIGEgYnJvd3NlciB3aW5kb3cgYmVpbmcgcGh5c2ljYWxseSByZXNpemVkLCBvciBmcm9tIGEgZGV2aWNlXG4gICAqIGNoYW5naW5nIG9yaWVudGF0aW9uLlxuICAgKi9cbiAgcmVzaXplID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvYzogYW55LCB6b25lOiBOZ1pvbmUpIHtcbiAgICB6b25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLndpbiA9IGRvYy5kZWZhdWx0VmlldztcbiAgICAgIHRoaXMuYmFja0J1dHRvbi5zdWJzY3JpYmVXaXRoUHJpb3JpdHkgPSBmdW5jdGlvbihwcmlvcml0eSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlKGV2ID0+IHtcbiAgICAgICAgICByZXR1cm4gZXYucmVnaXN0ZXIocHJpb3JpdHksIHByb2Nlc3NOZXh0SGFuZGxlciA9PiB6b25lLnJ1bigoKSA9PiBjYWxsYmFjayhwcm9jZXNzTmV4dEhhbmRsZXIpKSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgcHJveHlFdmVudCh0aGlzLnBhdXNlLCBkb2MsICdwYXVzZScpO1xuICAgICAgcHJveHlFdmVudCh0aGlzLnJlc3VtZSwgZG9jLCAncmVzdW1lJyk7XG4gICAgICBwcm94eUV2ZW50KHRoaXMuYmFja0J1dHRvbiwgZG9jLCAnaW9uQmFja0J1dHRvbicpO1xuICAgICAgcHJveHlFdmVudCh0aGlzLnJlc2l6ZSwgdGhpcy53aW4sICdyZXNpemUnKTtcbiAgICAgIHByb3h5RXZlbnQodGhpcy5rZXlib2FyZERpZFNob3csIHRoaXMud2luLCAnaW9uS2V5Ym9hcmREaWRTaG93Jyk7XG4gICAgICBwcm94eUV2ZW50KHRoaXMua2V5Ym9hcmREaWRIaWRlLCB0aGlzLndpbiwgJ2lvbktleWJvYXJkRGlkSGlkZScpO1xuXG4gICAgICBsZXQgcmVhZHlSZXNvbHZlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbiAgICAgIHRoaXMuX3JlYWR5UHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlcyA9PiB7IHJlYWR5UmVzb2x2ZSA9IHJlczsgfSk7XG4gICAgICBpZiAodGhpcy53aW4gJiYgdGhpcy53aW5bJ2NvcmRvdmEnXSkge1xuICAgICAgICBkb2MuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlcmVhZHknLCAoKSA9PiB7XG4gICAgICAgICAgcmVhZHlSZXNvbHZlKCdjb3Jkb3ZhJyk7XG4gICAgICAgIH0sIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlYWR5UmVzb2x2ZSEoJ2RvbScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHJldHVybnMgdHJ1ZS9mYWxzZSBiYXNlZCBvbiBwbGF0Zm9ybS5cbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIERlcGVuZGluZyBvbiB0aGUgcGxhdGZvcm0gdGhlIHVzZXIgaXMgb24sIGBpcyhwbGF0Zm9ybU5hbWUpYCB3aWxsXG4gICAqIHJldHVybiBgdHJ1ZWAgb3IgYGZhbHNlYC4gTm90ZSB0aGF0IHRoZSBzYW1lIGFwcCBjYW4gcmV0dXJuIGB0cnVlYFxuICAgKiBmb3IgbW9yZSB0aGFuIG9uZSBwbGF0Zm9ybSBuYW1lLiBGb3IgZXhhbXBsZSwgYW4gYXBwIHJ1bm5pbmcgZnJvbVxuICAgKiBhbiBpUGFkIHdvdWxkIHJldHVybiBgdHJ1ZWAgZm9yIHRoZSBwbGF0Zm9ybSBuYW1lczogYG1vYmlsZWAsXG4gICAqIGBpb3NgLCBgaXBhZGAsIGFuZCBgdGFibGV0YC4gQWRkaXRpb25hbGx5LCBpZiB0aGUgYXBwIHdhcyBydW5uaW5nXG4gICAqIGZyb20gQ29yZG92YSB0aGVuIGBjb3Jkb3ZhYCB3b3VsZCBiZSB0cnVlLCBhbmQgaWYgaXQgd2FzIHJ1bm5pbmdcbiAgICogZnJvbSBhIHdlYiBicm93c2VyIG9uIHRoZSBpUGFkIHRoZW4gYG1vYmlsZXdlYmAgd291bGQgYmUgYHRydWVgLlxuICAgKlxuICAgKiBgYGBcbiAgICogaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICdpb25pYy1hbmd1bGFyJztcbiAgICpcbiAgICogQENvbXBvbmVudCh7Li4ufSlcbiAgICogZXhwb3J0IE15UGFnZSB7XG4gICAqICAgY29uc3RydWN0b3IocHVibGljIHBsYXRmb3JtOiBQbGF0Zm9ybSkge1xuICAgKiAgICAgaWYgKHRoaXMucGxhdGZvcm0uaXMoJ2lvcycpKSB7XG4gICAqICAgICAgIC8vIFRoaXMgd2lsbCBvbmx5IHByaW50IHdoZW4gb24gaU9TXG4gICAqICAgICAgIGNvbnNvbGUubG9nKCdJIGFtIGFuIGlPUyBkZXZpY2UhJyk7XG4gICAqICAgICB9XG4gICAqICAgfVxuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiB8IFBsYXRmb3JtIE5hbWUgICB8IERlc2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgKiB8LS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfFxuICAgKiB8IGFuZHJvaWQgICAgICAgICB8IG9uIGEgZGV2aWNlIHJ1bm5pbmcgQW5kcm9pZC4gICAgICAgfFxuICAgKiB8IGNhcGFjaXRvciAgICAgICB8IG9uIGEgZGV2aWNlIHJ1bm5pbmcgQ2FwYWNpdG9yLiAgICAgfFxuICAgKiB8IGNvcmRvdmEgICAgICAgICB8IG9uIGEgZGV2aWNlIHJ1bm5pbmcgQ29yZG92YS4gICAgICAgfFxuICAgKiB8IGlvcyAgICAgICAgICAgICB8IG9uIGEgZGV2aWNlIHJ1bm5pbmcgaU9TLiAgICAgICAgICAgfFxuICAgKiB8IGlwYWQgICAgICAgICAgICB8IG9uIGFuIGlQYWQgZGV2aWNlLiAgICAgICAgICAgICAgICAgfFxuICAgKiB8IGlwaG9uZSAgICAgICAgICB8IG9uIGFuIGlQaG9uZSBkZXZpY2UuICAgICAgICAgICAgICAgfFxuICAgKiB8IHBoYWJsZXQgICAgICAgICB8IG9uIGEgcGhhYmxldCBkZXZpY2UuICAgICAgICAgICAgICAgfFxuICAgKiB8IHRhYmxldCAgICAgICAgICB8IG9uIGEgdGFibGV0IGRldmljZS4gICAgICAgICAgICAgICAgfFxuICAgKiB8IGVsZWN0cm9uICAgICAgICB8IGluIEVsZWN0cm9uIG9uIGEgZGVza3RvcCBkZXZpY2UuICAgfFxuICAgKiB8IHB3YSAgICAgICAgICAgICB8IGFzIGEgUFdBIGFwcC4gICAgICAgICAgICAgICAgICAgICAgfFxuICAgKiB8IG1vYmlsZSAgICAgICAgICB8IG9uIGEgbW9iaWxlIGRldmljZS4gICAgICAgICAgICAgICAgfFxuICAgKiB8IG1vYmlsZXdlYiAgICAgICB8IG9uIGEgbW9iaWxlIGRldmljZSBpbiBhIGJyb3dzZXIuICAgfFxuICAgKiB8IGRlc2t0b3AgICAgICAgICB8IG9uIGEgZGVza3RvcCBkZXZpY2UuICAgICAgICAgICAgICAgfFxuICAgKiB8IGh5YnJpZCAgICAgICAgICB8IGlzIGEgY29yZG92YSBvciBjYXBhY2l0b3IgYXBwLiAgICAgfFxuICAgKlxuICAgKi9cbiAgaXMocGxhdGZvcm1OYW1lOiBQbGF0Zm9ybXMpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNQbGF0Zm9ybSh0aGlzLndpbiwgcGxhdGZvcm1OYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB0aGUgYXJyYXkgb2YgcGxhdGZvcm1zXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBEZXBlbmRpbmcgb24gd2hhdCBkZXZpY2UgeW91IGFyZSBvbiwgYHBsYXRmb3Jtc2AgY2FuIHJldHVybiBtdWx0aXBsZSB2YWx1ZXMuXG4gICAqIEVhY2ggcG9zc2libGUgdmFsdWUgaXMgYSBoaWVyYXJjaHkgb2YgcGxhdGZvcm1zLiBGb3IgZXhhbXBsZSwgb24gYW4gaVBob25lLFxuICAgKiBpdCB3b3VsZCByZXR1cm4gYG1vYmlsZWAsIGBpb3NgLCBhbmQgYGlwaG9uZWAuXG4gICAqXG4gICAqIGBgYFxuICAgKiBpbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ2lvbmljLWFuZ3VsYXInO1xuICAgKlxuICAgKiBAQ29tcG9uZW50KHsuLi59KVxuICAgKiBleHBvcnQgTXlQYWdlIHtcbiAgICogICBjb25zdHJ1Y3RvcihwdWJsaWMgcGxhdGZvcm06IFBsYXRmb3JtKSB7XG4gICAqICAgICAvLyBUaGlzIHdpbGwgcHJpbnQgYW4gYXJyYXkgb2YgdGhlIGN1cnJlbnQgcGxhdGZvcm1zXG4gICAqICAgICBjb25zb2xlLmxvZyh0aGlzLnBsYXRmb3JtLnBsYXRmb3JtcygpKTtcbiAgICogICB9XG4gICAqIH1cbiAgICogYGBgXG4gICAqL1xuICBwbGF0Zm9ybXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBnZXRQbGF0Zm9ybXModGhpcy53aW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHdoZW4gdGhlIHBsYXRmb3JtIGlzIHJlYWR5IGFuZCBuYXRpdmUgZnVuY3Rpb25hbGl0eVxuICAgKiBjYW4gYmUgY2FsbGVkLiBJZiB0aGUgYXBwIGlzIHJ1bm5pbmcgZnJvbSB3aXRoaW4gYSB3ZWIgYnJvd3NlciwgdGhlblxuICAgKiB0aGUgcHJvbWlzZSB3aWxsIHJlc29sdmUgd2hlbiB0aGUgRE9NIGlzIHJlYWR5LiBXaGVuIHRoZSBhcHAgaXMgcnVubmluZ1xuICAgKiBmcm9tIGFuIGFwcGxpY2F0aW9uIGVuZ2luZSBzdWNoIGFzIENvcmRvdmEsIHRoZW4gdGhlIHByb21pc2Ugd2lsbFxuICAgKiByZXNvbHZlIHdoZW4gQ29yZG92YSB0cmlnZ2VycyB0aGUgYGRldmljZXJlYWR5YCBldmVudC5cbiAgICpcbiAgICogVGhlIHJlc29sdmVkIHZhbHVlIGlzIHRoZSBgcmVhZHlTb3VyY2VgLCB3aGljaCBzdGF0ZXMgd2hpY2ggcGxhdGZvcm1cbiAgICogcmVhZHkgd2FzIHVzZWQuIEZvciBleGFtcGxlLCB3aGVuIENvcmRvdmEgaXMgcmVhZHksIHRoZSByZXNvbHZlZCByZWFkeVxuICAgKiBzb3VyY2UgaXMgYGNvcmRvdmFgLiBUaGUgZGVmYXVsdCByZWFkeSBzb3VyY2UgdmFsdWUgd2lsbCBiZSBgZG9tYC4gVGhlXG4gICAqIGByZWFkeVNvdXJjZWAgaXMgdXNlZnVsIGlmIGRpZmZlcmVudCBsb2dpYyBzaG91bGQgcnVuIGRlcGVuZGluZyBvbiB0aGVcbiAgICogcGxhdGZvcm0gdGhlIGFwcCBpcyBydW5uaW5nIGZyb20uIEZvciBleGFtcGxlLCBvbmx5IENvcmRvdmEgY2FuIGV4ZWN1dGVcbiAgICogdGhlIHN0YXR1cyBiYXIgcGx1Z2luLCBzbyB0aGUgd2ViIHNob3VsZCBub3QgcnVuIHN0YXR1cyBiYXIgcGx1Z2luIGxvZ2ljLlxuICAgKlxuICAgKiBgYGBcbiAgICogaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAqIGltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnaW9uaWMtYW5ndWxhcic7XG4gICAqXG4gICAqIEBDb21wb25lbnQoey4uLn0pXG4gICAqIGV4cG9ydCBNeUFwcCB7XG4gICAqICAgY29uc3RydWN0b3IocHVibGljIHBsYXRmb3JtOiBQbGF0Zm9ybSkge1xuICAgKiAgICAgdGhpcy5wbGF0Zm9ybS5yZWFkeSgpLnRoZW4oKHJlYWR5U291cmNlKSA9PiB7XG4gICAqICAgICAgIGNvbnNvbGUubG9nKCdQbGF0Zm9ybSByZWFkeSBmcm9tJywgcmVhZHlTb3VyY2UpO1xuICAgKiAgICAgICAvLyBQbGF0Zm9ybSBub3cgcmVhZHksIGV4ZWN1dGUgYW55IHJlcXVpcmVkIG5hdGl2ZSBjb2RlXG4gICAqICAgICB9KTtcbiAgICogICB9XG4gICAqIH1cbiAgICogYGBgXG4gICAqL1xuICByZWFkeSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLl9yZWFkeVByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBpZiB0aGlzIGFwcCBpcyB1c2luZyByaWdodC10by1sZWZ0IGxhbmd1YWdlIGRpcmVjdGlvbiBvciBub3QuXG4gICAqIFdlIHJlY29tbWVuZCB0aGUgYXBwJ3MgYGluZGV4Lmh0bWxgIGZpbGUgYWxyZWFkeSBoYXMgdGhlIGNvcnJlY3QgYGRpcmBcbiAgICogYXR0cmlidXRlIHZhbHVlIHNldCwgc3VjaCBhcyBgPGh0bWwgZGlyPVwibHRyXCI+YCBvciBgPGh0bWwgZGlyPVwicnRsXCI+YC5cbiAgICogW1czQzogU3RydWN0dXJhbCBtYXJrdXAgYW5kIHJpZ2h0LXRvLWxlZnQgdGV4dCBpbiBIVE1MXShodHRwOi8vd3d3LnczLm9yZy9JbnRlcm5hdGlvbmFsL3F1ZXN0aW9ucy9xYS1odG1sLWRpcilcbiAgICovXG4gIGdldCBpc1JUTCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kb2MuZGlyID09PSAncnRsJztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHF1ZXJ5IHN0cmluZyBwYXJhbWV0ZXJcbiAgICovXG4gIGdldFF1ZXJ5UGFyYW0oa2V5OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gcmVhZFF1ZXJ5UGFyYW0odGhpcy53aW4ubG9jYXRpb24uaHJlZiwga2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXBwIGlzIGluIGxhbmRzY2FwZSBtb2RlLlxuICAgKi9cbiAgaXNMYW5kc2NhcGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlzUG9ydHJhaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXBwIGlzIGluIHBvcnRyYWl0IG1vZGUuXG4gICAqL1xuICBpc1BvcnRyYWl0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLndpbi5tYXRjaE1lZGlhICYmIHRoaXMud2luLm1hdGNoTWVkaWEoJyhvcmllbnRhdGlvbjogcG9ydHJhaXQpJykubWF0Y2hlcztcbiAgfVxuXG4gIHRlc3RVc2VyQWdlbnQoZXhwcmVzc2lvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbmF2ID0gdGhpcy53aW4ubmF2aWdhdG9yO1xuICAgIHJldHVybiAhIShuYXYgJiYgbmF2LnVzZXJBZ2VudCAmJiBuYXYudXNlckFnZW50LmluZGV4T2YoZXhwcmVzc2lvbikgPj0gMCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IHVybC5cbiAgICovXG4gIHVybCgpIHtcbiAgICByZXR1cm4gdGhpcy53aW4ubG9jYXRpb24uaHJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB3aWR0aCBvZiB0aGUgcGxhdGZvcm0ncyB2aWV3cG9ydCB1c2luZyBgd2luZG93LmlubmVyV2lkdGhgLlxuICAgKi9cbiAgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMud2luLmlubmVyV2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaGVpZ2h0IG9mIHRoZSBwbGF0Zm9ybSdzIHZpZXdwb3J0IHVzaW5nIGB3aW5kb3cuaW5uZXJIZWlnaHRgLlxuICAgKi9cbiAgaGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMud2luLmlubmVySGVpZ2h0O1xuICB9XG59XG5cbmNvbnN0IHJlYWRRdWVyeVBhcmFtID0gKHVybDogc3RyaW5nLCBrZXk6IHN0cmluZykgPT4ge1xuICBrZXkgPSBrZXkucmVwbGFjZSgvW1xcW10vLCAnXFxcXFsnKS5yZXBsYWNlKC9bXFxdXS8sICdcXFxcXScpO1xuICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoJ1tcXFxcPyZdJyArIGtleSArICc9KFteJiNdKiknKTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcbiAgcmV0dXJuIHJlc3VsdHMgPyBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgJyAnKSkgOiBudWxsO1xufTtcblxuY29uc3QgcHJveHlFdmVudCA9IDxUPihlbWl0dGVyOiBTdWJqZWN0PFQ+LCBlbDogRXZlbnRUYXJnZXQsIGV2ZW50TmFtZTogc3RyaW5nKSA9PiB7XG4gIGlmICgoZWwgYXMgYW55KSkge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZXY6IEV2ZW50IHwgdW5kZWZpbmVkIHwgbnVsbCkgPT4ge1xuICAgICAgLy8gPz8gY29yZG92YSBtaWdodCBlbWl0IFwibnVsbFwiIGV2ZW50c1xuICAgICAgZW1pdHRlci5uZXh0KGV2ICE9IG51bGwgPyAoZXYgYXMgYW55KS5kZXRhaWwgYXMgVCA6IHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH1cbn07XG4iXX0=