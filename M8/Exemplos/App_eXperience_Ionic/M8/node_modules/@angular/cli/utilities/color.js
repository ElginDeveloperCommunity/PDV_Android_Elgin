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
exports.colors = exports.removeColor = void 0;
const ansiColors = __importStar(require("ansi-colors"));
const tty_1 = require("tty");
const supportsColor = process.stdout instanceof tty_1.WriteStream && process.stdout.getColorDepth() > 1;
function removeColor(text) {
    // This has been created because when colors.enabled is false unstyle doesn't work
    // see: https://github.com/doowb/ansi-colors/blob/a4794363369d7b4d1872d248fc43a12761640d8e/index.js#L38
    return text.replace(ansiColors.ansiRegex, '');
}
exports.removeColor = removeColor;
// Create a separate instance to prevent unintended global changes to the color configuration
// Create function is not defined in the typings. See: https://github.com/doowb/ansi-colors/pull/44
const colors = ansiColors.create();
exports.colors = colors;
colors.enabled = supportsColor;
