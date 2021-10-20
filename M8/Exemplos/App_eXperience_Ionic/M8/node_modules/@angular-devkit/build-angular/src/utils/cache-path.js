"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCachePath = void 0;
const find_cache_dir_1 = __importDefault(require("find-cache-dir"));
const os_1 = require("os");
const path_1 = require("path");
const environment_options_1 = require("./environment-options");
function findCachePath(name) {
    if (environment_options_1.cachingBasePath) {
        return path_1.resolve(environment_options_1.cachingBasePath, name);
    }
    return find_cache_dir_1.default({ name }) || os_1.tmpdir();
}
exports.findCachePath = findCachePath;
