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
        define("@angular/compiler-cli/src/ngtsc/transform", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/transform/src/api", "@angular/compiler-cli/src/ngtsc/transform/src/alias", "@angular/compiler-cli/src/ngtsc/transform/src/compilation", "@angular/compiler-cli/src/ngtsc/transform/src/declaration", "@angular/compiler-cli/src/ngtsc/transform/src/trait", "@angular/compiler-cli/src/ngtsc/transform/src/transform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ivyTransformFactory = exports.TraitState = exports.Trait = exports.IvyDeclarationDtsTransform = exports.DtsTransformRegistry = exports.declarationTransformFactory = exports.TraitCompiler = exports.aliasTransformFactory = void 0;
    var tslib_1 = require("tslib");
    tslib_1.__exportStar(require("@angular/compiler-cli/src/ngtsc/transform/src/api"), exports);
    var alias_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/alias");
    Object.defineProperty(exports, "aliasTransformFactory", { enumerable: true, get: function () { return alias_1.aliasTransformFactory; } });
    var compilation_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/compilation");
    Object.defineProperty(exports, "TraitCompiler", { enumerable: true, get: function () { return compilation_1.TraitCompiler; } });
    var declaration_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/declaration");
    Object.defineProperty(exports, "declarationTransformFactory", { enumerable: true, get: function () { return declaration_1.declarationTransformFactory; } });
    Object.defineProperty(exports, "DtsTransformRegistry", { enumerable: true, get: function () { return declaration_1.DtsTransformRegistry; } });
    Object.defineProperty(exports, "IvyDeclarationDtsTransform", { enumerable: true, get: function () { return declaration_1.IvyDeclarationDtsTransform; } });
    var trait_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/trait");
    Object.defineProperty(exports, "Trait", { enumerable: true, get: function () { return trait_1.Trait; } });
    Object.defineProperty(exports, "TraitState", { enumerable: true, get: function () { return trait_1.TraitState; } });
    var transform_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/transform");
    Object.defineProperty(exports, "ivyTransformFactory", { enumerable: true, get: function () { return transform_1.ivyTransformFactory; } });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3RyYW5zZm9ybS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsNEZBQTBCO0lBQzFCLDZFQUFrRDtJQUExQyw4R0FBQSxxQkFBcUIsT0FBQTtJQUM3Qix5RkFBNkQ7SUFBeEMsNEdBQUEsYUFBYSxPQUFBO0lBQ2xDLHlGQUFnSDtJQUF4RywwSEFBQSwyQkFBMkIsT0FBQTtJQUFFLG1IQUFBLG9CQUFvQixPQUFBO0lBQUUseUhBQUEsMEJBQTBCLE9BQUE7SUFDckYsNkVBQXdHO0lBQXRDLDhGQUFBLEtBQUssT0FBQTtJQUFFLG1HQUFBLFVBQVUsT0FBQTtJQUNuRixxRkFBb0Q7SUFBNUMsZ0hBQUEsbUJBQW1CLE9BQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9zcmMvYXBpJztcbmV4cG9ydCB7YWxpYXNUcmFuc2Zvcm1GYWN0b3J5fSBmcm9tICcuL3NyYy9hbGlhcyc7XG5leHBvcnQge0NsYXNzUmVjb3JkLCBUcmFpdENvbXBpbGVyfSBmcm9tICcuL3NyYy9jb21waWxhdGlvbic7XG5leHBvcnQge2RlY2xhcmF0aW9uVHJhbnNmb3JtRmFjdG9yeSwgRHRzVHJhbnNmb3JtUmVnaXN0cnksIEl2eURlY2xhcmF0aW9uRHRzVHJhbnNmb3JtfSBmcm9tICcuL3NyYy9kZWNsYXJhdGlvbic7XG5leHBvcnQge0FuYWx5emVkVHJhaXQsIFBlbmRpbmdUcmFpdCwgUmVzb2x2ZWRUcmFpdCwgU2tpcHBlZFRyYWl0LCBUcmFpdCwgVHJhaXRTdGF0ZX0gZnJvbSAnLi9zcmMvdHJhaXQnO1xuZXhwb3J0IHtpdnlUcmFuc2Zvcm1GYWN0b3J5fSBmcm9tICcuL3NyYy90cmFuc2Zvcm0nO1xuIl19