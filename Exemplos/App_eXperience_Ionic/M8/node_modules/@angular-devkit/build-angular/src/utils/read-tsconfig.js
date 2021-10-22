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
exports.readTsconfig = void 0;
const path = __importStar(require("path"));
/**
 * Reads and parses a given TsConfig file.
 *
 * @param tsconfigPath - An absolute or relative path from 'workspaceRoot' of the tsconfig file.
 * @param workspaceRoot - workspaceRoot root location when provided
 * it will resolve 'tsconfigPath' from this path.
 */
function readTsconfig(tsconfigPath, workspaceRoot) {
    const tsConfigFullPath = workspaceRoot ? path.resolve(workspaceRoot, tsconfigPath) : tsconfigPath;
    // We use 'ng' instead of 'ts' here because 'ts' is not aware of 'angularCompilerOptions'
    // and will not merged them if they are at un upper level tsconfig file when using `extends`.
    const ng = require('@angular/compiler-cli');
    const configResult = ng.readConfiguration(tsConfigFullPath);
    if (configResult.errors && configResult.errors.length) {
        throw new Error(ng.formatDiagnostics(configResult.errors));
    }
    return configResult;
}
exports.readTsconfig = readTsconfig;
