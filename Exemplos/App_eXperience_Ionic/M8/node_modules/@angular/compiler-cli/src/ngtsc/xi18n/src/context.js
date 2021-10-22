/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/xi18n/src/context", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MveGkxOG4vc3JjL2NvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW50ZXJwb2xhdGlvbkNvbmZpZ30gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG4vKipcbiAqIENhcHR1cmVzIHRlbXBsYXRlIGluZm9ybWF0aW9uIGludGVuZGVkIGZvciBleHRyYWN0aW9uIG9mIGkxOG4gbWVzc2FnZXMgZnJvbSBhIHRlbXBsYXRlLlxuICpcbiAqIFRoaXMgaW50ZXJmYWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgVmlldyBFbmdpbmUgY29tcGlsZXIncyBgTWVzc2FnZUJ1bmRsZWAgY2xhc3MsIHdoaWNoIGlzIHVzZWRcbiAqIHRvIGltcGxlbWVudCB4aTE4biBmb3IgVkUuIER1ZSB0byB0aGUgZGVwZW5kZW5jeSBncmFwaCBvZiBuZ3RzYywgYW4gaW50ZXJmYWNlIGlzIG5lZWRlZCBhcyBpdFxuICogY2FuJ3QgZGVwZW5kIGRpcmVjdGx5IG9uIGBNZXNzYWdlQnVuZGxlYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBYaTE4bkNvbnRleHQge1xuICAvKipcbiAgICogQ2FwdHVyZSBpMThuIG1lc3NhZ2VzIGZyb20gdGhlIHRlbXBsYXRlLlxuICAgKlxuICAgKiBJbiBgTWVzc2FnZUJ1bmRsZWAgaXRzZWxmLCB0aGlzIHJldHVybnMgYW55IGBQYXJzZUVycm9yYHMgZnJvbSB0aGUgdGVtcGxhdGUuIEluIHRoaXMgaW50ZXJmYWNlLFxuICAgKiB0aGUgcmV0dXJuIHR5cGUgaXMgZGVjbGFyZWQgYXMgYHZvaWRgIGZvciBzaW1wbGljaXR5LCBzaW5jZSBhbnkgcGFyc2UgZXJyb3JzIHdvdWxkIGJlIHJlcG9ydGVkXG4gICAqIGFzIGRpYWdub3N0aWNzIGFueXdheS5cbiAgICovXG4gIHVwZGF0ZUZyb21UZW1wbGF0ZShodG1sOiBzdHJpbmcsIHVybDogc3RyaW5nLCBpbnRlcnBvbGF0aW9uQ29uZmlnOiBJbnRlcnBvbGF0aW9uQ29uZmlnKTogdm9pZDtcbn1cbiJdfQ==