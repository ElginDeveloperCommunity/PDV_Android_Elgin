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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildBrowserFeatures = void 0;
const browserslist_1 = __importDefault(require("browserslist"));
const caniuse_lite_1 = require("caniuse-lite");
const ts = __importStar(require("typescript"));
class BuildBrowserFeatures {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.supportedBrowsers = browserslist_1.default(undefined, { path: this.projectRoot });
    }
    /**
     * True, when one or more browsers requires ES5
     * support and the script target is ES2015 or greater.
     */
    isDifferentialLoadingNeeded(scriptTarget) {
        const es6TargetOrLater = scriptTarget > ts.ScriptTarget.ES5;
        return es6TargetOrLater && this.isEs5SupportNeeded();
    }
    /**
     * True, when one or more browsers requires ES5 support
     */
    isEs5SupportNeeded() {
        return !this.isFeatureSupported('es6-module');
    }
    /**
     * True, when a browser feature is supported partially or fully.
     */
    isFeatureSupported(featureId) {
        // y: feature is fully available
        // n: feature is unavailable
        // a: feature is partially supported
        // x: feature is prefixed
        const criteria = ['y', 'a'];
        const data = caniuse_lite_1.feature(caniuse_lite_1.features[featureId]);
        return !this.supportedBrowsers.some((browser) => {
            const [agentId, version] = browser.split(' ');
            const browserData = data.stats[agentId];
            const featureStatus = (browserData && browserData[version]);
            // We are only interested in the first character
            // Ex: when 'a #4 #5', we only need to check for 'a'
            // as for such cases we should polyfill these features as needed
            return !featureStatus || !criteria.includes(featureStatus.charAt(0));
        });
    }
}
exports.BuildBrowserFeatures = BuildBrowserFeatures;
