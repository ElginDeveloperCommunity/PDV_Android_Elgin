import * as tslib_1 from "tslib";
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { getPlatforms, isPlatform } from '@ionic/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
let Platform = class Platform {
    constructor(doc, zone) {
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
        zone.run(() => {
            this.win = doc.defaultView;
            this.backButton.subscribeWithPriority = function (priority, callback) {
                return this.subscribe(ev => {
                    return ev.register(priority, processNextHandler => zone.run(() => callback(processNextHandler)));
                });
            };
            proxyEvent(this.pause, doc, 'pause');
            proxyEvent(this.resume, doc, 'resume');
            proxyEvent(this.backButton, doc, 'ionBackButton');
            proxyEvent(this.resize, this.win, 'resize');
            proxyEvent(this.keyboardDidShow, this.win, 'ionKeyboardDidShow');
            proxyEvent(this.keyboardDidHide, this.win, 'ionKeyboardDidHide');
            let readyResolve;
            this._readyPromise = new Promise(res => { readyResolve = res; });
            if (this.win && this.win['cordova']) {
                doc.addEventListener('deviceready', () => {
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
    is(platformName) {
        return isPlatform(this.win, platformName);
    }
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
    platforms() {
        return getPlatforms(this.win);
    }
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
    ready() {
        return this._readyPromise;
    }
    /**
     * Returns if this app is using right-to-left language direction or not.
     * We recommend the app's `index.html` file already has the correct `dir`
     * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
     * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
     */
    get isRTL() {
        return this.doc.dir === 'rtl';
    }
    /**
     * Get the query string parameter
     */
    getQueryParam(key) {
        return readQueryParam(this.win.location.href, key);
    }
    /**
     * Returns `true` if the app is in landscape mode.
     */
    isLandscape() {
        return !this.isPortrait();
    }
    /**
     * Returns `true` if the app is in portrait mode.
     */
    isPortrait() {
        return this.win.matchMedia && this.win.matchMedia('(orientation: portrait)').matches;
    }
    testUserAgent(expression) {
        const nav = this.win.navigator;
        return !!(nav && nav.userAgent && nav.userAgent.indexOf(expression) >= 0);
    }
    /**
     * Get the current url.
     */
    url() {
        return this.win.location.href;
    }
    /**
     * Gets the width of the platform's viewport using `window.innerWidth`.
     */
    width() {
        return this.win.innerWidth;
    }
    /**
     * Gets the height of the platform's viewport using `window.innerHeight`.
     */
    height() {
        return this.win.innerHeight;
    }
};
Platform.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: NgZone }
];
Platform.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function Platform_Factory() { return new Platform(i0.ɵɵinject(i1.DOCUMENT), i0.ɵɵinject(i0.NgZone)); }, token: Platform, providedIn: "root" });
Platform = tslib_1.__decorate([
    Injectable({
        providedIn: 'root',
    }),
    tslib_1.__param(0, Inject(DOCUMENT))
], Platform);
export { Platform };
const readQueryParam = (url, key) => {
    key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
    const results = regex.exec(url);
    return results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : null;
};
const ɵ0 = readQueryParam;
const proxyEvent = (emitter, el, eventName) => {
    if (el) {
        el.addEventListener(eventName, (ev) => {
            // ?? cordova might emit "null" events
            emitter.next(ev != null ? ev.detail : undefined);
        });
    }
};
const ɵ1 = proxyEvent;
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbInByb3ZpZGVycy9wbGF0Zm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRCxPQUFPLEVBQXlELFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDOUcsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7OztBQVM3QyxJQUFhLFFBQVEsR0FBckIsTUFBYSxRQUFRO0lBNENuQixZQUFzQyxHQUFRLEVBQUUsSUFBWTtRQUF0QixRQUFHLEdBQUgsR0FBRyxDQUFLO1FBdkM5Qzs7V0FFRztRQUNILGVBQVUsR0FBc0IsSUFBSSxPQUFPLEVBQWdDLENBQUM7UUFFNUU7OztXQUdHO1FBQ0gsb0JBQWUsR0FBRyxJQUFJLE9BQU8sRUFBOEIsQ0FBQztRQUU1RDs7O1dBR0c7UUFDSCxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFdEM7Ozs7O1dBS0c7UUFDSCxVQUFLLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUU1Qjs7OztXQUlHO1FBQ0gsV0FBTSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFN0I7Ozs7V0FJRztRQUNILFdBQU0sR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRzNCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO1lBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLEdBQUcsVUFBUyxRQUFRLEVBQUUsUUFBUTtnQkFDakUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO29C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QUM7QUFDN0UsQ0FBQyxDQUFDOztBQUVGLE1BQU0sVUFBVSxHQUFHLENBQUksT0FBbUIsRUFBRSxFQUFlLEVBQUUsU0FBaUIsRUFBRSxFQUFFO0lBQ2hGLElBQUssRUFBVSxFQUFFO1FBQ2YsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQTRCLEVBQUUsRUFBRTtZQUM5RCxzQ0FBc0M7WUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBRSxFQUFVLENBQUMsTUFBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhY2tCdXR0b25FdmVudERldGFpbCwgS2V5Ym9hcmRFdmVudERldGFpbCwgUGxhdGZvcm1zLCBnZXRQbGF0Zm9ybXMsIGlzUGxhdGZvcm0gfSBmcm9tICdAaW9uaWMvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGludGVyZmFjZSBCYWNrQnV0dG9uRW1pdHRlciBleHRlbmRzIFN1YmplY3Q8QmFja0J1dHRvbkV2ZW50RGV0YWlsPiB7XG4gIHN1YnNjcmliZVdpdGhQcmlvcml0eShwcmlvcml0eTogbnVtYmVyLCBjYWxsYmFjazogKHByb2Nlc3NOZXh0SGFuZGxlcjogKCkgPT4gdm9pZCkgPT4gUHJvbWlzZTxhbnk+IHwgdm9pZCk6IFN1YnNjcmlwdGlvbjtcbn1cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFBsYXRmb3JtIHtcblxuICBwcml2YXRlIF9yZWFkeVByb21pc2U6IFByb21pc2U8c3RyaW5nPjtcbiAgcHJpdmF0ZSB3aW46IGFueTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgYmFja0J1dHRvbjogQmFja0J1dHRvbkVtaXR0ZXIgPSBuZXcgU3ViamVjdDxCYWNrQnV0dG9uRXZlbnREZXRhaWw+KCkgYXMgYW55O1xuXG4gIC8qKlxuICAgKiBUaGUga2V5Ym9hcmREaWRTaG93IGV2ZW50IGVtaXRzIHdoZW4gdGhlXG4gICAqIG9uLXNjcmVlbiBrZXlib2FyZCBpcyBwcmVzZW50ZWQuXG4gICAqL1xuICBrZXlib2FyZERpZFNob3cgPSBuZXcgU3ViamVjdDxLZXlib2FyZEV2ZW50RGV0YWlsPigpIGFzIGFueTtcblxuICAvKipcbiAgICogVGhlIGtleWJvYXJkRGlkSGlkZSBldmVudCBlbWl0cyB3aGVuIHRoZVxuICAgKiBvbi1zY3JlZW4ga2V5Ym9hcmQgaXMgaGlkZGVuLlxuICAgKi9cbiAga2V5Ym9hcmREaWRIaWRlID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVGhlIHBhdXNlIGV2ZW50IGVtaXRzIHdoZW4gdGhlIG5hdGl2ZSBwbGF0Zm9ybSBwdXRzIHRoZSBhcHBsaWNhdGlvblxuICAgKiBpbnRvIHRoZSBiYWNrZ3JvdW5kLCB0eXBpY2FsbHkgd2hlbiB0aGUgdXNlciBzd2l0Y2hlcyB0byBhIGRpZmZlcmVudFxuICAgKiBhcHBsaWNhdGlvbi4gVGhpcyBldmVudCB3b3VsZCBlbWl0IHdoZW4gYSBDb3Jkb3ZhIGFwcCBpcyBwdXQgaW50b1xuICAgKiB0aGUgYmFja2dyb3VuZCwgaG93ZXZlciwgaXQgd291bGQgbm90IGZpcmUgb24gYSBzdGFuZGFyZCB3ZWIgYnJvd3Nlci5cbiAgICovXG4gIHBhdXNlID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVGhlIHJlc3VtZSBldmVudCBlbWl0cyB3aGVuIHRoZSBuYXRpdmUgcGxhdGZvcm0gcHVsbHMgdGhlIGFwcGxpY2F0aW9uXG4gICAqIG91dCBmcm9tIHRoZSBiYWNrZ3JvdW5kLiBUaGlzIGV2ZW50IHdvdWxkIGVtaXQgd2hlbiBhIENvcmRvdmEgYXBwIGNvbWVzXG4gICAqIG91dCBmcm9tIHRoZSBiYWNrZ3JvdW5kLCBob3dldmVyLCBpdCB3b3VsZCBub3QgZmlyZSBvbiBhIHN0YW5kYXJkIHdlYiBicm93c2VyLlxuICAgKi9cbiAgcmVzdW1lID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVGhlIHJlc2l6ZSBldmVudCBlbWl0cyB3aGVuIHRoZSBicm93c2VyIHdpbmRvdyBoYXMgY2hhbmdlZCBkaW1lbnNpb25zLiBUaGlzXG4gICAqIGNvdWxkIGJlIGZyb20gYSBicm93c2VyIHdpbmRvdyBiZWluZyBwaHlzaWNhbGx5IHJlc2l6ZWQsIG9yIGZyb20gYSBkZXZpY2VcbiAgICogY2hhbmdpbmcgb3JpZW50YXRpb24uXG4gICAqL1xuICByZXNpemUgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jOiBhbnksIHpvbmU6IE5nWm9uZSkge1xuICAgIHpvbmUucnVuKCgpID0+IHtcbiAgICAgIHRoaXMud2luID0gZG9jLmRlZmF1bHRWaWV3O1xuICAgICAgdGhpcy5iYWNrQnV0dG9uLnN1YnNjcmliZVdpdGhQcmlvcml0eSA9IGZ1bmN0aW9uKHByaW9yaXR5LCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmUoZXYgPT4ge1xuICAgICAgICAgIHJldHVybiBldi5yZWdpc3Rlcihwcmlvcml0eSwgcHJvY2Vzc05leHRIYW5kbGVyID0+IHpvbmUucnVuKCgpID0+IGNhbGxiYWNrKHByb2Nlc3NOZXh0SGFuZGxlcikpKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBwcm94eUV2ZW50KHRoaXMucGF1c2UsIGRvYywgJ3BhdXNlJyk7XG4gICAgICBwcm94eUV2ZW50KHRoaXMucmVzdW1lLCBkb2MsICdyZXN1bWUnKTtcbiAgICAgIHByb3h5RXZlbnQodGhpcy5iYWNrQnV0dG9uLCBkb2MsICdpb25CYWNrQnV0dG9uJyk7XG4gICAgICBwcm94eUV2ZW50KHRoaXMucmVzaXplLCB0aGlzLndpbiwgJ3Jlc2l6ZScpO1xuICAgICAgcHJveHlFdmVudCh0aGlzLmtleWJvYXJkRGlkU2hvdywgdGhpcy53aW4sICdpb25LZXlib2FyZERpZFNob3cnKTtcbiAgICAgIHByb3h5RXZlbnQodGhpcy5rZXlib2FyZERpZEhpZGUsIHRoaXMud2luLCAnaW9uS2V5Ym9hcmREaWRIaWRlJyk7XG5cbiAgICAgIGxldCByZWFkeVJlc29sdmU6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkO1xuICAgICAgdGhpcy5fcmVhZHlQcm9taXNlID0gbmV3IFByb21pc2UocmVzID0+IHsgcmVhZHlSZXNvbHZlID0gcmVzOyB9KTtcbiAgICAgIGlmICh0aGlzLndpbiAmJiB0aGlzLndpblsnY29yZG92YSddKSB7XG4gICAgICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsICgpID0+IHtcbiAgICAgICAgICByZWFkeVJlc29sdmUoJ2NvcmRvdmEnKTtcbiAgICAgICAgfSwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVhZHlSZXNvbHZlISgnZG9tJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgcmV0dXJucyB0cnVlL2ZhbHNlIGJhc2VkIG9uIHBsYXRmb3JtLlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRGVwZW5kaW5nIG9uIHRoZSBwbGF0Zm9ybSB0aGUgdXNlciBpcyBvbiwgYGlzKHBsYXRmb3JtTmFtZSlgIHdpbGxcbiAgICogcmV0dXJuIGB0cnVlYCBvciBgZmFsc2VgLiBOb3RlIHRoYXQgdGhlIHNhbWUgYXBwIGNhbiByZXR1cm4gYHRydWVgXG4gICAqIGZvciBtb3JlIHRoYW4gb25lIHBsYXRmb3JtIG5hbWUuIEZvciBleGFtcGxlLCBhbiBhcHAgcnVubmluZyBmcm9tXG4gICAqIGFuIGlQYWQgd291bGQgcmV0dXJuIGB0cnVlYCBmb3IgdGhlIHBsYXRmb3JtIG5hbWVzOiBgbW9iaWxlYCxcbiAgICogYGlvc2AsIGBpcGFkYCwgYW5kIGB0YWJsZXRgLiBBZGRpdGlvbmFsbHksIGlmIHRoZSBhcHAgd2FzIHJ1bm5pbmdcbiAgICogZnJvbSBDb3Jkb3ZhIHRoZW4gYGNvcmRvdmFgIHdvdWxkIGJlIHRydWUsIGFuZCBpZiBpdCB3YXMgcnVubmluZ1xuICAgKiBmcm9tIGEgd2ViIGJyb3dzZXIgb24gdGhlIGlQYWQgdGhlbiBgbW9iaWxld2ViYCB3b3VsZCBiZSBgdHJ1ZWAuXG4gICAqXG4gICAqIGBgYFxuICAgKiBpbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ2lvbmljLWFuZ3VsYXInO1xuICAgKlxuICAgKiBAQ29tcG9uZW50KHsuLi59KVxuICAgKiBleHBvcnQgTXlQYWdlIHtcbiAgICogICBjb25zdHJ1Y3RvcihwdWJsaWMgcGxhdGZvcm06IFBsYXRmb3JtKSB7XG4gICAqICAgICBpZiAodGhpcy5wbGF0Zm9ybS5pcygnaW9zJykpIHtcbiAgICogICAgICAgLy8gVGhpcyB3aWxsIG9ubHkgcHJpbnQgd2hlbiBvbiBpT1NcbiAgICogICAgICAgY29uc29sZS5sb2coJ0kgYW0gYW4gaU9TIGRldmljZSEnKTtcbiAgICogICAgIH1cbiAgICogICB9XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIHwgUGxhdGZvcm0gTmFtZSAgIHwgRGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAqIHwtLS0tLS0tLS0tLS0tLS0tLXwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18XG4gICAqIHwgYW5kcm9pZCAgICAgICAgIHwgb24gYSBkZXZpY2UgcnVubmluZyBBbmRyb2lkLiAgICAgICB8XG4gICAqIHwgY2FwYWNpdG9yICAgICAgIHwgb24gYSBkZXZpY2UgcnVubmluZyBDYXBhY2l0b3IuICAgICB8XG4gICAqIHwgY29yZG92YSAgICAgICAgIHwgb24gYSBkZXZpY2UgcnVubmluZyBDb3Jkb3ZhLiAgICAgICB8XG4gICAqIHwgaW9zICAgICAgICAgICAgIHwgb24gYSBkZXZpY2UgcnVubmluZyBpT1MuICAgICAgICAgICB8XG4gICAqIHwgaXBhZCAgICAgICAgICAgIHwgb24gYW4gaVBhZCBkZXZpY2UuICAgICAgICAgICAgICAgICB8XG4gICAqIHwgaXBob25lICAgICAgICAgIHwgb24gYW4gaVBob25lIGRldmljZS4gICAgICAgICAgICAgICB8XG4gICAqIHwgcGhhYmxldCAgICAgICAgIHwgb24gYSBwaGFibGV0IGRldmljZS4gICAgICAgICAgICAgICB8XG4gICAqIHwgdGFibGV0ICAgICAgICAgIHwgb24gYSB0YWJsZXQgZGV2aWNlLiAgICAgICAgICAgICAgICB8XG4gICAqIHwgZWxlY3Ryb24gICAgICAgIHwgaW4gRWxlY3Ryb24gb24gYSBkZXNrdG9wIGRldmljZS4gICB8XG4gICAqIHwgcHdhICAgICAgICAgICAgIHwgYXMgYSBQV0EgYXBwLiAgICAgICAgICAgICAgICAgICAgICB8XG4gICAqIHwgbW9iaWxlICAgICAgICAgIHwgb24gYSBtb2JpbGUgZGV2aWNlLiAgICAgICAgICAgICAgICB8XG4gICAqIHwgbW9iaWxld2ViICAgICAgIHwgb24gYSBtb2JpbGUgZGV2aWNlIGluIGEgYnJvd3Nlci4gICB8XG4gICAqIHwgZGVza3RvcCAgICAgICAgIHwgb24gYSBkZXNrdG9wIGRldmljZS4gICAgICAgICAgICAgICB8XG4gICAqIHwgaHlicmlkICAgICAgICAgIHwgaXMgYSBjb3Jkb3ZhIG9yIGNhcGFjaXRvciBhcHAuICAgICB8XG4gICAqXG4gICAqL1xuICBpcyhwbGF0Zm9ybU5hbWU6IFBsYXRmb3Jtcyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc1BsYXRmb3JtKHRoaXMud2luLCBwbGF0Zm9ybU5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHRoZSBhcnJheSBvZiBwbGF0Zm9ybXNcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIERlcGVuZGluZyBvbiB3aGF0IGRldmljZSB5b3UgYXJlIG9uLCBgcGxhdGZvcm1zYCBjYW4gcmV0dXJuIG11bHRpcGxlIHZhbHVlcy5cbiAgICogRWFjaCBwb3NzaWJsZSB2YWx1ZSBpcyBhIGhpZXJhcmNoeSBvZiBwbGF0Zm9ybXMuIEZvciBleGFtcGxlLCBvbiBhbiBpUGhvbmUsXG4gICAqIGl0IHdvdWxkIHJldHVybiBgbW9iaWxlYCwgYGlvc2AsIGFuZCBgaXBob25lYC5cbiAgICpcbiAgICogYGBgXG4gICAqIGltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnaW9uaWMtYW5ndWxhcic7XG4gICAqXG4gICAqIEBDb21wb25lbnQoey4uLn0pXG4gICAqIGV4cG9ydCBNeVBhZ2Uge1xuICAgKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwbGF0Zm9ybTogUGxhdGZvcm0pIHtcbiAgICogICAgIC8vIFRoaXMgd2lsbCBwcmludCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBwbGF0Zm9ybXNcbiAgICogICAgIGNvbnNvbGUubG9nKHRoaXMucGxhdGZvcm0ucGxhdGZvcm1zKCkpO1xuICAgKiAgIH1cbiAgICogfVxuICAgKiBgYGBcbiAgICovXG4gIHBsYXRmb3JtcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIGdldFBsYXRmb3Jtcyh0aGlzLndpbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2Ugd2hlbiB0aGUgcGxhdGZvcm0gaXMgcmVhZHkgYW5kIG5hdGl2ZSBmdW5jdGlvbmFsaXR5XG4gICAqIGNhbiBiZSBjYWxsZWQuIElmIHRoZSBhcHAgaXMgcnVubmluZyBmcm9tIHdpdGhpbiBhIHdlYiBicm93c2VyLCB0aGVuXG4gICAqIHRoZSBwcm9taXNlIHdpbGwgcmVzb2x2ZSB3aGVuIHRoZSBET00gaXMgcmVhZHkuIFdoZW4gdGhlIGFwcCBpcyBydW5uaW5nXG4gICAqIGZyb20gYW4gYXBwbGljYXRpb24gZW5naW5lIHN1Y2ggYXMgQ29yZG92YSwgdGhlbiB0aGUgcHJvbWlzZSB3aWxsXG4gICAqIHJlc29sdmUgd2hlbiBDb3Jkb3ZhIHRyaWdnZXJzIHRoZSBgZGV2aWNlcmVhZHlgIGV2ZW50LlxuICAgKlxuICAgKiBUaGUgcmVzb2x2ZWQgdmFsdWUgaXMgdGhlIGByZWFkeVNvdXJjZWAsIHdoaWNoIHN0YXRlcyB3aGljaCBwbGF0Zm9ybVxuICAgKiByZWFkeSB3YXMgdXNlZC4gRm9yIGV4YW1wbGUsIHdoZW4gQ29yZG92YSBpcyByZWFkeSwgdGhlIHJlc29sdmVkIHJlYWR5XG4gICAqIHNvdXJjZSBpcyBgY29yZG92YWAuIFRoZSBkZWZhdWx0IHJlYWR5IHNvdXJjZSB2YWx1ZSB3aWxsIGJlIGBkb21gLiBUaGVcbiAgICogYHJlYWR5U291cmNlYCBpcyB1c2VmdWwgaWYgZGlmZmVyZW50IGxvZ2ljIHNob3VsZCBydW4gZGVwZW5kaW5nIG9uIHRoZVxuICAgKiBwbGF0Zm9ybSB0aGUgYXBwIGlzIHJ1bm5pbmcgZnJvbS4gRm9yIGV4YW1wbGUsIG9ubHkgQ29yZG92YSBjYW4gZXhlY3V0ZVxuICAgKiB0aGUgc3RhdHVzIGJhciBwbHVnaW4sIHNvIHRoZSB3ZWIgc2hvdWxkIG5vdCBydW4gc3RhdHVzIGJhciBwbHVnaW4gbG9naWMuXG4gICAqXG4gICAqIGBgYFxuICAgKiBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICogaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICdpb25pYy1hbmd1bGFyJztcbiAgICpcbiAgICogQENvbXBvbmVudCh7Li4ufSlcbiAgICogZXhwb3J0IE15QXBwIHtcbiAgICogICBjb25zdHJ1Y3RvcihwdWJsaWMgcGxhdGZvcm06IFBsYXRmb3JtKSB7XG4gICAqICAgICB0aGlzLnBsYXRmb3JtLnJlYWR5KCkudGhlbigocmVhZHlTb3VyY2UpID0+IHtcbiAgICogICAgICAgY29uc29sZS5sb2coJ1BsYXRmb3JtIHJlYWR5IGZyb20nLCByZWFkeVNvdXJjZSk7XG4gICAqICAgICAgIC8vIFBsYXRmb3JtIG5vdyByZWFkeSwgZXhlY3V0ZSBhbnkgcmVxdWlyZWQgbmF0aXZlIGNvZGVcbiAgICogICAgIH0pO1xuICAgKiAgIH1cbiAgICogfVxuICAgKiBgYGBcbiAgICovXG4gIHJlYWR5KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWR5UHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGlmIHRoaXMgYXBwIGlzIHVzaW5nIHJpZ2h0LXRvLWxlZnQgbGFuZ3VhZ2UgZGlyZWN0aW9uIG9yIG5vdC5cbiAgICogV2UgcmVjb21tZW5kIHRoZSBhcHAncyBgaW5kZXguaHRtbGAgZmlsZSBhbHJlYWR5IGhhcyB0aGUgY29ycmVjdCBgZGlyYFxuICAgKiBhdHRyaWJ1dGUgdmFsdWUgc2V0LCBzdWNoIGFzIGA8aHRtbCBkaXI9XCJsdHJcIj5gIG9yIGA8aHRtbCBkaXI9XCJydGxcIj5gLlxuICAgKiBbVzNDOiBTdHJ1Y3R1cmFsIG1hcmt1cCBhbmQgcmlnaHQtdG8tbGVmdCB0ZXh0IGluIEhUTUxdKGh0dHA6Ly93d3cudzMub3JnL0ludGVybmF0aW9uYWwvcXVlc3Rpb25zL3FhLWh0bWwtZGlyKVxuICAgKi9cbiAgZ2V0IGlzUlRMKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRvYy5kaXIgPT09ICdydGwnO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcXVlcnkgc3RyaW5nIHBhcmFtZXRlclxuICAgKi9cbiAgZ2V0UXVlcnlQYXJhbShrZXk6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiByZWFkUXVlcnlQYXJhbSh0aGlzLndpbi5sb2NhdGlvbi5ocmVmLCBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBhcHAgaXMgaW4gbGFuZHNjYXBlIG1vZGUuXG4gICAqL1xuICBpc0xhbmRzY2FwZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuaXNQb3J0cmFpdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBhcHAgaXMgaW4gcG9ydHJhaXQgbW9kZS5cbiAgICovXG4gIGlzUG9ydHJhaXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMud2luLm1hdGNoTWVkaWEgJiYgdGhpcy53aW4ubWF0Y2hNZWRpYSgnKG9yaWVudGF0aW9uOiBwb3J0cmFpdCknKS5tYXRjaGVzO1xuICB9XG5cbiAgdGVzdFVzZXJBZ2VudChleHByZXNzaW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBuYXYgPSB0aGlzLndpbi5uYXZpZ2F0b3I7XG4gICAgcmV0dXJuICEhKG5hdiAmJiBuYXYudXNlckFnZW50ICYmIG5hdi51c2VyQWdlbnQuaW5kZXhPZihleHByZXNzaW9uKSA+PSAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgdXJsLlxuICAgKi9cbiAgdXJsKCkge1xuICAgIHJldHVybiB0aGlzLndpbi5sb2NhdGlvbi5ocmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHdpZHRoIG9mIHRoZSBwbGF0Zm9ybSdzIHZpZXdwb3J0IHVzaW5nIGB3aW5kb3cuaW5uZXJXaWR0aGAuXG4gICAqL1xuICB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy53aW4uaW5uZXJXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBoZWlnaHQgb2YgdGhlIHBsYXRmb3JtJ3Mgdmlld3BvcnQgdXNpbmcgYHdpbmRvdy5pbm5lckhlaWdodGAuXG4gICAqL1xuICBoZWlnaHQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53aW4uaW5uZXJIZWlnaHQ7XG4gIH1cbn1cblxuY29uc3QgcmVhZFF1ZXJ5UGFyYW0gPSAodXJsOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PiB7XG4gIGtleSA9IGtleS5yZXBsYWNlKC9bXFxbXS8sICdcXFxcWycpLnJlcGxhY2UoL1tcXF1dLywgJ1xcXFxdJyk7XG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cCgnW1xcXFw/Jl0nICsga2V5ICsgJz0oW14mI10qKScpO1xuICBjb25zdCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xuICByZXR1cm4gcmVzdWx0cyA/IGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzFdLnJlcGxhY2UoL1xcKy9nLCAnICcpKSA6IG51bGw7XG59O1xuXG5jb25zdCBwcm94eUV2ZW50ID0gPFQ+KGVtaXR0ZXI6IFN1YmplY3Q8VD4sIGVsOiBFdmVudFRhcmdldCwgZXZlbnROYW1lOiBzdHJpbmcpID0+IHtcbiAgaWYgKChlbCBhcyBhbnkpKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChldjogRXZlbnQgfCB1bmRlZmluZWQgfCBudWxsKSA9PiB7XG4gICAgICAvLyA/PyBjb3Jkb3ZhIG1pZ2h0IGVtaXQgXCJudWxsXCIgZXZlbnRzXG4gICAgICBlbWl0dGVyLm5leHQoZXYgIT0gbnVsbCA/IChldiBhcyBhbnkpLmRldGFpbCBhcyBUIDogdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxufTtcbiJdfQ==