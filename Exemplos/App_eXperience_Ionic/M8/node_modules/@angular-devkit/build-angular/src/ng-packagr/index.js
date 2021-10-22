"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const architect_1 = require("@angular-devkit/architect");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
async function initialize(options, root) {
    const packager = (await Promise.resolve().then(() => __importStar(require('ng-packagr')))).ngPackagr();
    packager.forProject(path_1.resolve(root, options.project));
    if (options.tsConfig) {
        packager.withTsConfig(path_1.resolve(root, options.tsConfig));
    }
    return packager;
}
/**
 * @experimental Direct usage of this function is considered experimental.
 */
function execute(options, context) {
    return rxjs_1.from(initialize(options, context.workspaceRoot)).pipe(operators_1.switchMap((packager) => (options.watch ? packager.watch() : packager.build())), operators_1.mapTo({ success: true }), operators_1.catchError((err) => rxjs_1.of({ success: false, error: err.message })));
}
exports.execute = execute;
exports.default = architect_1.createBuilder(execute);
