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
exports.copyFile = void 0;
const fs = __importStar(require("fs"));
// Workaround Node.js issue prior to 10.16 with copyFile on macOS
// https://github.com/angular/angular-cli/issues/15544 & https://github.com/nodejs/node/pull/27241
let copyFileWorkaround = false;
if (process.platform === 'darwin') {
    const version = process.versions.node.split('.').map((part) => Number(part));
    if (version[0] < 10 || version[0] === 11 || (version[0] === 10 && version[1] < 16)) {
        copyFileWorkaround = true;
    }
}
function copyFile(src, dest) {
    if (copyFileWorkaround) {
        try {
            fs.unlinkSync(dest);
        }
        catch { }
    }
    fs.copyFileSync(src, dest, fs.constants.COPYFILE_FICLONE);
}
exports.copyFile = copyFile;
