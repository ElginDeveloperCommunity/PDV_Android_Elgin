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
exports.getTestConfig = void 0;
const glob = __importStar(require("glob"));
const path = __importStar(require("path"));
const typescript_1 = require("typescript");
const helpers_1 = require("../utils/helpers");
function getTestConfig(wco) {
    const { buildOptions: { codeCoverage, codeCoverageExclude, main, sourceMap, webWorkerTsConfig }, root, sourceRoot, } = wco;
    const extraRules = [];
    const extraPlugins = [];
    if (codeCoverage) {
        const exclude = [/\.(e2e|spec)\.tsx?$/, /node_modules/];
        if (codeCoverageExclude) {
            for (const excludeGlob of codeCoverageExclude) {
                glob
                    .sync(path.join(root, excludeGlob), { nodir: true })
                    .forEach((file) => exclude.push(path.normalize(file)));
            }
        }
        extraRules.push({
            test: /\.(jsx?|tsx?)$/,
            loader: require.resolve('@jsdevtools/coverage-istanbul-loader'),
            options: { esModules: true },
            enforce: 'post',
            exclude,
            include: sourceRoot,
        });
    }
    if (sourceMap.scripts || sourceMap.styles) {
        extraPlugins.push(helpers_1.getSourceMapDevTool(sourceMap.scripts, sourceMap.styles, false, true));
    }
    return {
        mode: 'development',
        target: wco.tsConfig.options.target === typescript_1.ScriptTarget.ES5 ? ['web', 'es5'] : 'web',
        resolve: {
            mainFields: ['es2015', 'browser', 'module', 'main'],
        },
        devtool: false,
        entry: {
            main: path.resolve(root, main),
        },
        module: {
            rules: extraRules,
            parser: webWorkerTsConfig === undefined
                ? {
                    javascript: {
                        worker: false,
                        url: false,
                    },
                }
                : undefined,
        },
        plugins: extraPlugins,
        optimization: {
            splitChunks: {
                chunks: (chunk) => !helpers_1.isPolyfillsEntry(chunk.name),
                cacheGroups: {
                    vendors: false,
                    defaultVendors: {
                        name: 'vendor',
                        chunks: (chunk) => chunk.name === 'main',
                        enforce: true,
                        test: /[\\/]node_modules[\\/]/,
                    },
                },
            },
        },
    };
}
exports.getTestConfig = getTestConfig;
