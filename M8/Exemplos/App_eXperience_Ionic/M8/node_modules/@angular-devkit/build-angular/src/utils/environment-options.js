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
exports.maxWorkers = exports.profilingEnabled = exports.persistentBuildCacheEnabled = exports.cachingBasePath = exports.cachingDisabled = exports.allowMinify = exports.shouldBeautify = exports.allowMangle = void 0;
const path = __importStar(require("path"));
function isDisabled(variable) {
    return variable === '0' || variable.toLowerCase() === 'false';
}
function isEnabled(variable) {
    return variable === '1' || variable.toLowerCase() === 'true';
}
function isPresent(variable) {
    return typeof variable === 'string' && variable !== '';
}
// Optimization and mangling
const debugOptimizeVariable = process.env['NG_BUILD_DEBUG_OPTIMIZE'];
const debugOptimize = (() => {
    if (!isPresent(debugOptimizeVariable) || isDisabled(debugOptimizeVariable)) {
        return {
            mangle: true,
            minify: true,
            beautify: false,
        };
    }
    const debugValue = {
        mangle: false,
        minify: false,
        beautify: true,
    };
    if (isEnabled(debugOptimizeVariable)) {
        return debugValue;
    }
    for (const part of debugOptimizeVariable.split(',')) {
        switch (part.trim().toLowerCase()) {
            case 'mangle':
                debugValue.mangle = true;
                break;
            case 'minify':
                debugValue.minify = true;
                break;
            case 'beautify':
                debugValue.beautify = true;
                break;
        }
    }
    return debugValue;
})();
const mangleVariable = process.env['NG_BUILD_MANGLE'];
exports.allowMangle = isPresent(mangleVariable)
    ? !isDisabled(mangleVariable)
    : debugOptimize.mangle;
exports.shouldBeautify = debugOptimize.beautify;
exports.allowMinify = debugOptimize.minify;
// Build cache
const cacheVariable = process.env['NG_BUILD_CACHE'];
exports.cachingDisabled = isPresent(cacheVariable) && isDisabled(cacheVariable);
exports.cachingBasePath = (() => {
    if (exports.cachingDisabled || !isPresent(cacheVariable) || isEnabled(cacheVariable)) {
        return null;
    }
    if (!path.isAbsolute(cacheVariable)) {
        throw new Error('NG_BUILD_CACHE path value must be absolute.');
    }
    return cacheVariable;
})();
// Persistent build cache
const persistentBuildCacheVariable = process.env['NG_PERSISTENT_BUILD_CACHE'];
exports.persistentBuildCacheEnabled = !exports.cachingDisabled &&
    isPresent(persistentBuildCacheVariable) &&
    isEnabled(persistentBuildCacheVariable);
// Build profiling
const profilingVariable = process.env['NG_BUILD_PROFILING'];
exports.profilingEnabled = isPresent(profilingVariable) && isEnabled(profilingVariable);
/**
 * Some environments, like CircleCI which use Docker report a number of CPUs by the host and not the count of available.
 * This cause `Error: Call retries were exceeded` errors when trying to use them.
 *
 * @see https://github.com/nodejs/node/issues/28762
 * @see https://github.com/webpack-contrib/terser-webpack-plugin/issues/143
 * @see https://ithub.com/angular/angular-cli/issues/16860#issuecomment-588828079
 *
 */
const maxWorkersVariable = process.env['NG_BUILD_MAX_WORKERS'];
exports.maxWorkers = isPresent(maxWorkersVariable) ? +maxWorkersVariable : 4;
