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
exports.createTranslationLoader = void 0;
const crypto_1 = require("crypto");
const fs = __importStar(require("fs"));
async function createTranslationLoader() {
    const { parsers, diagnostics } = await importParsers();
    return (path) => {
        const content = fs.readFileSync(path, 'utf8');
        const unusedParsers = new Map();
        for (const [format, parser] of Object.entries(parsers)) {
            const analysis = analyze(parser, path, content);
            if (analysis.canParse) {
                const { locale, translations } = parser.parse(path, content, analysis.hint);
                const integrity = 'sha256-' + crypto_1.createHash('sha256').update(content).digest('base64');
                return { format, locale, translations, diagnostics, integrity };
            }
            else {
                unusedParsers.set(parser, analysis);
            }
        }
        const messages = [];
        for (const [parser, analysis] of unusedParsers.entries()) {
            messages.push(analysis.diagnostics.formatDiagnostics(`*** ${parser.constructor.name} ***`));
        }
        throw new Error(`Unsupported translation file format in ${path}. The following parsers were tried:\n` +
            messages.join('\n'));
    };
    // TODO: `parser.canParse()` is deprecated; remove this polyfill once we are sure all parsers provide the `parser.analyze()` method.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function analyze(parser, path, content) {
        if (parser.analyze !== undefined) {
            return parser.analyze(path, content);
        }
        else {
            const hint = parser.canParse(path, content);
            return { canParse: hint !== false, hint, diagnostics };
        }
    }
}
exports.createTranslationLoader = createTranslationLoader;
async function importParsers() {
    try {
        const localizeDiag = await Promise.resolve().then(() => __importStar(require('@angular/localize/src/tools/src/diagnostics')));
        const diagnostics = new localizeDiag.Diagnostics();
        const parsers = {
            arb: new (await Promise.resolve().then(() => __importStar(require('@angular/localize/src/tools/src/translate/translation_files/translation_parsers/arb_translation_parser')))).ArbTranslationParser(),
            json: new (await Promise.resolve().then(() => __importStar(require('@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser')))).SimpleJsonTranslationParser(),
            xlf: new (await Promise.resolve().then(() => __importStar(require('@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1_translation_parser')))).Xliff1TranslationParser(),
            xlf2: new (await Promise.resolve().then(() => __importStar(require('@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser')))).Xliff2TranslationParser(),
            // The name ('xmb') needs to match the AOT compiler option
            xmb: new (await Promise.resolve().then(() => __importStar(require('@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser')))).XtbTranslationParser(),
        };
        return { parsers, diagnostics };
    }
    catch {
        throw new Error(`Unable to load translation file parsers. Please ensure '@angular/localize' is installed.`);
    }
}
