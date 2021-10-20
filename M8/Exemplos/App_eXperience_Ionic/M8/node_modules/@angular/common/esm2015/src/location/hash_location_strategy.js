/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { APP_BASE_HREF, LocationStrategy } from './location_strategy';
import { PlatformLocation } from './platform_location';
import { joinWithSlash, normalizeQueryParams } from './util';
/**
 * @description
 * A {@link LocationStrategy} used to configure the {@link Location} service to
 * represent its state in the
 * [hash fragment](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax)
 * of the browser's URL.
 *
 * For instance, if you call `location.go('/foo')`, the browser's URL will become
 * `example.com#/foo`.
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example common/location/ts/hash_location_component.ts region='LocationComponent'}
 *
 * @publicApi
 */
export class HashLocationStrategy extends LocationStrategy {
    constructor(_platformLocation, _baseHref) {
        super();
        this._platformLocation = _platformLocation;
        this._baseHref = '';
        this._removeListenerFns = [];
        if (_baseHref != null) {
            this._baseHref = _baseHref;
        }
    }
    ngOnDestroy() {
        while (this._removeListenerFns.length) {
            this._removeListenerFns.pop()();
        }
    }
    onPopState(fn) {
        this._removeListenerFns.push(this._platformLocation.onPopState(fn), this._platformLocation.onHashChange(fn));
    }
    getBaseHref() {
        return this._baseHref;
    }
    path(includeHash = false) {
        // the hash value is always prefixed with a `#`
        // and if it is empty then it will stay empty
        let path = this._platformLocation.hash;
        if (path == null)
            path = '#';
        return path.length > 0 ? path.substring(1) : path;
    }
    prepareExternalUrl(internal) {
        const url = joinWithSlash(this._baseHref, internal);
        return url.length > 0 ? ('#' + url) : url;
    }
    pushState(state, title, path, queryParams) {
        let url = this.prepareExternalUrl(path + normalizeQueryParams(queryParams));
        if (url.length == 0) {
            url = this._platformLocation.pathname;
        }
        this._platformLocation.pushState(state, title, url);
    }
    replaceState(state, title, path, queryParams) {
        let url = this.prepareExternalUrl(path + normalizeQueryParams(queryParams));
        if (url.length == 0) {
            url = this._platformLocation.pathname;
        }
        this._platformLocation.replaceState(state, title, url);
    }
    forward() {
        this._platformLocation.forward();
    }
    back() {
        this._platformLocation.back();
    }
    historyGo(relativePosition = 0) {
        var _a, _b;
        (_b = (_a = this._platformLocation).historyGo) === null || _b === void 0 ? void 0 : _b.call(_a, relativePosition);
    }
}
HashLocationStrategy.decorators = [
    { type: Injectable }
];
HashLocationStrategy.ctorParameters = () => [
    { type: PlatformLocation },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [APP_BASE_HREF,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaF9sb2NhdGlvbl9zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvbG9jYXRpb24vaGFzaF9sb2NhdGlvbl9zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBYSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFdEUsT0FBTyxFQUFDLGFBQWEsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BFLE9BQU8sRUFBeUIsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUM3RSxPQUFPLEVBQUMsYUFBYSxFQUFFLG9CQUFvQixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBSTNEOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUVILE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxnQkFBZ0I7SUFJeEQsWUFDWSxpQkFBbUMsRUFDUixTQUFrQjtRQUN2RCxLQUFLLEVBQUUsQ0FBQztRQUZFLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFKdkMsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUN2Qix1QkFBa0IsR0FBbUIsRUFBRSxDQUFDO1FBTTlDLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtZQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztTQUM1QjtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUcsRUFBRSxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUVRLFVBQVUsQ0FBQyxFQUEwQjtRQUM1QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUN4QixJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRVEsV0FBVztRQUNsQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUVRLElBQUksQ0FBQyxjQUF1QixLQUFLO1FBQ3hDLCtDQUErQztRQUMvQyw2Q0FBNkM7UUFDN0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztRQUN2QyxJQUFJLElBQUksSUFBSSxJQUFJO1lBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUU3QixPQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDcEQsQ0FBQztJQUVRLGtCQUFrQixDQUFDLFFBQWdCO1FBQzFDLE1BQU0sR0FBRyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDNUMsQ0FBQztJQUVRLFNBQVMsQ0FBQyxLQUFVLEVBQUUsS0FBYSxFQUFFLElBQVksRUFBRSxXQUFtQjtRQUM3RSxJQUFJLEdBQUcsR0FBZ0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksR0FBRyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDbkIsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7U0FDdkM7UUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVRLFlBQVksQ0FBQyxLQUFVLEVBQUUsS0FBYSxFQUFFLElBQVksRUFBRSxXQUFtQjtRQUNoRixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDNUUsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNuQixHQUFHLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQztTQUN2QztRQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRVEsT0FBTztRQUNkLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRVEsSUFBSTtRQUNYLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRVEsU0FBUyxDQUFDLG1CQUEyQixDQUFDOztRQUM3QyxNQUFBLE1BQUEsSUFBSSxDQUFDLGlCQUFpQixFQUFDLFNBQVMsbURBQUcsZ0JBQWdCLENBQUMsQ0FBQztJQUN2RCxDQUFDOzs7WUFyRUYsVUFBVTs7O1lBdkJxQixnQkFBZ0I7eUNBOEJ6QyxRQUFRLFlBQUksTUFBTSxTQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIE9uRGVzdHJveSwgT3B0aW9uYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0FQUF9CQVNFX0hSRUYsIExvY2F0aW9uU3RyYXRlZ3l9IGZyb20gJy4vbG9jYXRpb25fc3RyYXRlZ3knO1xuaW1wb3J0IHtMb2NhdGlvbkNoYW5nZUxpc3RlbmVyLCBQbGF0Zm9ybUxvY2F0aW9ufSBmcm9tICcuL3BsYXRmb3JtX2xvY2F0aW9uJztcbmltcG9ydCB7am9pbldpdGhTbGFzaCwgbm9ybWFsaXplUXVlcnlQYXJhbXN9IGZyb20gJy4vdXRpbCc7XG5cblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSB7QGxpbmsgTG9jYXRpb25TdHJhdGVneX0gdXNlZCB0byBjb25maWd1cmUgdGhlIHtAbGluayBMb2NhdGlvbn0gc2VydmljZSB0b1xuICogcmVwcmVzZW50IGl0cyBzdGF0ZSBpbiB0aGVcbiAqIFtoYXNoIGZyYWdtZW50XShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Vbmlmb3JtX1Jlc291cmNlX0xvY2F0b3IjU3ludGF4KVxuICogb2YgdGhlIGJyb3dzZXIncyBVUkwuXG4gKlxuICogRm9yIGluc3RhbmNlLCBpZiB5b3UgY2FsbCBgbG9jYXRpb24uZ28oJy9mb28nKWAsIHRoZSBicm93c2VyJ3MgVVJMIHdpbGwgYmVjb21lXG4gKiBgZXhhbXBsZS5jb20jL2Zvb2AuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIHtAZXhhbXBsZSBjb21tb24vbG9jYXRpb24vdHMvaGFzaF9sb2NhdGlvbl9jb21wb25lbnQudHMgcmVnaW9uPSdMb2NhdGlvbkNvbXBvbmVudCd9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSGFzaExvY2F0aW9uU3RyYXRlZ3kgZXh0ZW5kcyBMb2NhdGlvblN0cmF0ZWd5IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfYmFzZUhyZWY6IHN0cmluZyA9ICcnO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lckZuczogKCgpID0+IHZvaWQpW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX3BsYXRmb3JtTG9jYXRpb246IFBsYXRmb3JtTG9jYXRpb24sXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFQUF9CQVNFX0hSRUYpIF9iYXNlSHJlZj86IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gICAgaWYgKF9iYXNlSHJlZiAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9iYXNlSHJlZiA9IF9iYXNlSHJlZjtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5fcmVtb3ZlTGlzdGVuZXJGbnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lckZucy5wb3AoKSEoKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBvblBvcFN0YXRlKGZuOiBMb2NhdGlvbkNoYW5nZUxpc3RlbmVyKTogdm9pZCB7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXJGbnMucHVzaChcbiAgICAgICAgdGhpcy5fcGxhdGZvcm1Mb2NhdGlvbi5vblBvcFN0YXRlKGZuKSwgdGhpcy5fcGxhdGZvcm1Mb2NhdGlvbi5vbkhhc2hDaGFuZ2UoZm4pKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGdldEJhc2VIcmVmKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2Jhc2VIcmVmO1xuICB9XG5cbiAgb3ZlcnJpZGUgcGF0aChpbmNsdWRlSGFzaDogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICAvLyB0aGUgaGFzaCB2YWx1ZSBpcyBhbHdheXMgcHJlZml4ZWQgd2l0aCBhIGAjYFxuICAgIC8vIGFuZCBpZiBpdCBpcyBlbXB0eSB0aGVuIGl0IHdpbGwgc3RheSBlbXB0eVxuICAgIGxldCBwYXRoID0gdGhpcy5fcGxhdGZvcm1Mb2NhdGlvbi5oYXNoO1xuICAgIGlmIChwYXRoID09IG51bGwpIHBhdGggPSAnIyc7XG5cbiAgICByZXR1cm4gcGF0aC5sZW5ndGggPiAwID8gcGF0aC5zdWJzdHJpbmcoMSkgOiBwYXRoO1xuICB9XG5cbiAgb3ZlcnJpZGUgcHJlcGFyZUV4dGVybmFsVXJsKGludGVybmFsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHVybCA9IGpvaW5XaXRoU2xhc2godGhpcy5fYmFzZUhyZWYsIGludGVybmFsKTtcbiAgICByZXR1cm4gdXJsLmxlbmd0aCA+IDAgPyAoJyMnICsgdXJsKSA6IHVybDtcbiAgfVxuXG4gIG92ZXJyaWRlIHB1c2hTdGF0ZShzdGF0ZTogYW55LCB0aXRsZTogc3RyaW5nLCBwYXRoOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBzdHJpbmcpIHtcbiAgICBsZXQgdXJsOiBzdHJpbmd8bnVsbCA9IHRoaXMucHJlcGFyZUV4dGVybmFsVXJsKHBhdGggKyBub3JtYWxpemVRdWVyeVBhcmFtcyhxdWVyeVBhcmFtcykpO1xuICAgIGlmICh1cmwubGVuZ3RoID09IDApIHtcbiAgICAgIHVybCA9IHRoaXMuX3BsYXRmb3JtTG9jYXRpb24ucGF0aG5hbWU7XG4gICAgfVxuICAgIHRoaXMuX3BsYXRmb3JtTG9jYXRpb24ucHVzaFN0YXRlKHN0YXRlLCB0aXRsZSwgdXJsKTtcbiAgfVxuXG4gIG92ZXJyaWRlIHJlcGxhY2VTdGF0ZShzdGF0ZTogYW55LCB0aXRsZTogc3RyaW5nLCBwYXRoOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBzdHJpbmcpIHtcbiAgICBsZXQgdXJsID0gdGhpcy5wcmVwYXJlRXh0ZXJuYWxVcmwocGF0aCArIG5vcm1hbGl6ZVF1ZXJ5UGFyYW1zKHF1ZXJ5UGFyYW1zKSk7XG4gICAgaWYgKHVybC5sZW5ndGggPT0gMCkge1xuICAgICAgdXJsID0gdGhpcy5fcGxhdGZvcm1Mb2NhdGlvbi5wYXRobmFtZTtcbiAgICB9XG4gICAgdGhpcy5fcGxhdGZvcm1Mb2NhdGlvbi5yZXBsYWNlU3RhdGUoc3RhdGUsIHRpdGxlLCB1cmwpO1xuICB9XG5cbiAgb3ZlcnJpZGUgZm9yd2FyZCgpOiB2b2lkIHtcbiAgICB0aGlzLl9wbGF0Zm9ybUxvY2F0aW9uLmZvcndhcmQoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGJhY2soKTogdm9pZCB7XG4gICAgdGhpcy5fcGxhdGZvcm1Mb2NhdGlvbi5iYWNrKCk7XG4gIH1cblxuICBvdmVycmlkZSBoaXN0b3J5R28ocmVsYXRpdmVQb3NpdGlvbjogbnVtYmVyID0gMCk6IHZvaWQge1xuICAgIHRoaXMuX3BsYXRmb3JtTG9jYXRpb24uaGlzdG9yeUdvPy4ocmVsYXRpdmVQb3NpdGlvbik7XG4gIH1cbn1cbiJdfQ==