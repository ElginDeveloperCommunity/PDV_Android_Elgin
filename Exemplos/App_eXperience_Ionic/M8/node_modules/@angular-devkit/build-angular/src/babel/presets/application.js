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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function createI18nDiagnostics(reporter) {
    // Babel currently is synchronous so import cannot be used
    const diagnostics = new (require('@angular/localize/src/tools/src/diagnostics').Diagnostics)();
    if (!reporter) {
        return diagnostics;
    }
    const baseAdd = diagnostics.add;
    diagnostics.add = function (type, message, ...args) {
        if (type !== 'ignore') {
            baseAdd.call(diagnostics, type, message, ...args);
            reporter(type, message);
        }
    };
    const baseError = diagnostics.error;
    diagnostics.error = function (message, ...args) {
        baseError.call(diagnostics, message, ...args);
        reporter('error', message);
    };
    const baseWarn = diagnostics.warn;
    diagnostics.warn = function (message, ...args) {
        baseWarn.call(diagnostics, message, ...args);
        reporter('warning', message);
    };
    const baseMerge = diagnostics.merge;
    diagnostics.merge = function (other, ...args) {
        baseMerge.call(diagnostics, other, ...args);
        for (const diagnostic of other.messages) {
            reporter(diagnostic.type, diagnostic.message);
        }
    };
    return diagnostics;
}
function createI18nPlugins(locale, translation, missingTranslationBehavior, diagnosticReporter) {
    const diagnostics = createI18nDiagnostics(diagnosticReporter);
    const plugins = [];
    if (translation) {
        const { makeEs2015TranslatePlugin, } = require('@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin');
        plugins.push(makeEs2015TranslatePlugin(diagnostics, translation, {
            missingTranslation: missingTranslationBehavior,
        }));
        const { makeEs5TranslatePlugin, } = require('@angular/localize/src/tools/src/translate/source_files/es5_translate_plugin');
        plugins.push(makeEs5TranslatePlugin(diagnostics, translation, {
            missingTranslation: missingTranslationBehavior,
        }));
    }
    const { makeLocalePlugin, } = require('@angular/localize/src/tools/src/translate/source_files/locale_plugin');
    plugins.push(makeLocalePlugin(locale));
    return plugins;
}
function createNgtscLogger(reporter) {
    return {
        level: 1,
        debug(...args) { },
        info(...args) {
            reporter === null || reporter === void 0 ? void 0 : reporter('info', args.join());
        },
        warn(...args) {
            reporter === null || reporter === void 0 ? void 0 : reporter('warning', args.join());
        },
        error(...args) {
            reporter === null || reporter === void 0 ? void 0 : reporter('error', args.join());
        },
    };
}
function default_1(api, options) {
    var _a;
    const presets = [];
    const plugins = [];
    let needRuntimeTransform = false;
    if ((_a = options.angularLinker) === null || _a === void 0 ? void 0 : _a.shouldLink) {
        // Babel currently is synchronous so import cannot be used
        const { createEs2015LinkerPlugin } = require('@angular/compiler-cli/linker/babel');
        plugins.push(createEs2015LinkerPlugin({
            linkerJitMode: options.angularLinker.jitMode,
            // This is a workaround until https://github.com/angular/angular/issues/42769 is fixed.
            sourceMapping: false,
            logger: createNgtscLogger(options.diagnosticReporter),
            fileSystem: {
                resolve: path.resolve,
                exists: fs.existsSync,
                dirname: path.dirname,
                relative: path.relative,
                readFile: fs.readFileSync,
                // Node.JS types don't overlap the Compiler types.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            },
        }));
    }
    if (options.forceES5) {
        presets.push([
            require('@babel/preset-env').default,
            {
                bugfixes: true,
                modules: false,
                // Comparable behavior to tsconfig target of ES5
                targets: { ie: 9 },
                exclude: ['transform-typeof-symbol'],
            },
        ]);
        needRuntimeTransform = true;
    }
    if (options.i18n) {
        const { locale, missingTranslationBehavior, translation } = options.i18n;
        const i18nPlugins = createI18nPlugins(locale, translation, missingTranslationBehavior || 'ignore', options.diagnosticReporter);
        plugins.push(...i18nPlugins);
    }
    if (options.forceAsyncTransformation) {
        // Always transform async/await to support Zone.js
        plugins.push(require('@babel/plugin-transform-async-to-generator').default, require('@babel/plugin-proposal-async-generator-functions').default);
        needRuntimeTransform = true;
    }
    if (needRuntimeTransform) {
        // Babel equivalent to TypeScript's `importHelpers` option
        plugins.push([
            require('@babel/plugin-transform-runtime').default,
            {
                useESModules: true,
                version: require('@babel/runtime/package.json').version,
                absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json')),
            },
        ]);
    }
    return { presets, plugins };
}
exports.default = default_1;
