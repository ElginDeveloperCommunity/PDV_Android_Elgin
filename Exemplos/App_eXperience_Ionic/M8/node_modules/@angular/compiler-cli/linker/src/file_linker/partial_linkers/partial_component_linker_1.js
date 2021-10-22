(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/linker/src/file_linker/partial_linkers/partial_component_linker_1", ["require", "exports", "tslib", "@angular/compiler", "@angular/compiler/src/core", "@angular/compiler-cli/linker/src/fatal_linker_error", "@angular/compiler-cli/linker/src/file_linker/partial_linkers/partial_directive_linker_1", "@angular/compiler-cli/linker/src/file_linker/partial_linkers/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PartialComponentLinkerVersion1 = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var compiler_1 = require("@angular/compiler");
    var core_1 = require("@angular/compiler/src/core");
    var fatal_linker_error_1 = require("@angular/compiler-cli/linker/src/fatal_linker_error");
    var partial_directive_linker_1_1 = require("@angular/compiler-cli/linker/src/file_linker/partial_linkers/partial_directive_linker_1");
    var util_1 = require("@angular/compiler-cli/linker/src/file_linker/partial_linkers/util");
    /**
     * A `PartialLinker` that is designed to process `ɵɵngDeclareComponent()` call expressions.
     */
    var PartialComponentLinkerVersion1 = /** @class */ (function () {
        function PartialComponentLinkerVersion1(getSourceFile, sourceUrl, code) {
            this.getSourceFile = getSourceFile;
            this.sourceUrl = sourceUrl;
            this.code = code;
        }
        PartialComponentLinkerVersion1.prototype.linkPartialDeclaration = function (constantPool, metaObj) {
            var meta = this.toR3ComponentMeta(metaObj);
            var def = compiler_1.compileComponentFromMetadata(meta, constantPool, compiler_1.makeBindingParser());
            return def.expression;
        };
        /**
         * This function derives the `R3ComponentMetadata` from the provided AST object.
         */
        PartialComponentLinkerVersion1.prototype.toR3ComponentMeta = function (metaObj) {
            var interpolation = parseInterpolationConfig(metaObj);
            var templateSource = metaObj.getValue('template');
            var isInline = metaObj.has('isInline') ? metaObj.getBoolean('isInline') : false;
            var templateInfo = this.getTemplateInfo(templateSource, isInline);
            var template = compiler_1.parseTemplate(templateInfo.code, templateInfo.sourceUrl, {
                escapedString: templateInfo.isEscaped,
                interpolationConfig: interpolation,
                range: templateInfo.range,
                enableI18nLegacyMessageIdFormat: false,
                preserveWhitespaces: metaObj.has('preserveWhitespaces') ? metaObj.getBoolean('preserveWhitespaces') : false,
                // We normalize line endings if the template is was inline.
                i18nNormalizeLineEndingsInICUs: isInline,
            });
            if (template.errors !== null) {
                var errors = template.errors.map(function (err) { return err.toString(); }).join('\n');
                throw new fatal_linker_error_1.FatalLinkerError(templateSource.expression, "Errors found in the template:\n" + errors);
            }
            var declarationListEmitMode = 0 /* Direct */;
            var collectUsedDirectives = function (directives) {
                return directives.map(function (directive) {
                    var directiveExpr = directive.getObject();
                    var type = directiveExpr.getValue('type');
                    var selector = directiveExpr.getString('selector');
                    var _a = util_1.extractForwardRef(type), typeExpr = _a.expression, isForwardRef = _a.isForwardRef;
                    if (isForwardRef) {
                        declarationListEmitMode = 1 /* Closure */;
                    }
                    return {
                        type: typeExpr,
                        selector: selector,
                        inputs: directiveExpr.has('inputs') ?
                            directiveExpr.getArray('inputs').map(function (input) { return input.getString(); }) :
                            [],
                        outputs: directiveExpr.has('outputs') ?
                            directiveExpr.getArray('outputs').map(function (input) { return input.getString(); }) :
                            [],
                        exportAs: directiveExpr.has('exportAs') ?
                            directiveExpr.getArray('exportAs').map(function (exportAs) { return exportAs.getString(); }) :
                            null,
                    };
                });
            };
            var directives = [];
            if (metaObj.has('components')) {
                directives.push.apply(directives, tslib_1.__spreadArray([], tslib_1.__read(collectUsedDirectives(metaObj.getArray('components')))));
            }
            if (metaObj.has('directives')) {
                directives.push.apply(directives, tslib_1.__spreadArray([], tslib_1.__read(collectUsedDirectives(metaObj.getArray('directives')))));
            }
            var pipes = new Map();
            if (metaObj.has('pipes')) {
                pipes = metaObj.getObject('pipes').toMap(function (pipe) {
                    var _a = util_1.extractForwardRef(pipe), pipeType = _a.expression, isForwardRef = _a.isForwardRef;
                    if (isForwardRef) {
                        declarationListEmitMode = 1 /* Closure */;
                    }
                    return pipeType;
                });
            }
            return tslib_1.__assign(tslib_1.__assign({}, partial_directive_linker_1_1.toR3DirectiveMeta(metaObj, this.code, this.sourceUrl)), { viewProviders: metaObj.has('viewProviders') ? metaObj.getOpaque('viewProviders') : null, template: {
                    nodes: template.nodes,
                    ngContentSelectors: template.ngContentSelectors,
                }, declarationListEmitMode: declarationListEmitMode, styles: metaObj.has('styles') ? metaObj.getArray('styles').map(function (entry) { return entry.getString(); }) :
                    [], encapsulation: metaObj.has('encapsulation') ?
                    parseEncapsulation(metaObj.getValue('encapsulation')) :
                    core_1.ViewEncapsulation.Emulated, interpolation: interpolation, changeDetection: metaObj.has('changeDetection') ?
                    parseChangeDetectionStrategy(metaObj.getValue('changeDetection')) :
                    core_1.ChangeDetectionStrategy.Default, animations: metaObj.has('animations') ? metaObj.getOpaque('animations') : null, relativeContextFilePath: this.sourceUrl, i18nUseExternalIds: false, pipes: pipes, directives: directives });
        };
        /**
         * Update the range to remove the start and end chars, which should be quotes around the template.
         */
        PartialComponentLinkerVersion1.prototype.getTemplateInfo = function (templateNode, isInline) {
            var range = templateNode.getRange();
            if (!isInline) {
                // If not marked as inline, then we try to get the template info from the original external
                // template file, via source-mapping.
                var externalTemplate = this.tryExternalTemplate(range);
                if (externalTemplate !== null) {
                    return externalTemplate;
                }
            }
            // Either the template is marked inline or we failed to find the original external template.
            // So just use the literal string from the partially compiled component declaration.
            return this.templateFromPartialCode(templateNode, range);
        };
        PartialComponentLinkerVersion1.prototype.tryExternalTemplate = function (range) {
            var sourceFile = this.getSourceFile();
            if (sourceFile === null) {
                return null;
            }
            var pos = sourceFile.getOriginalLocation(range.startLine, range.startCol);
            // Only interested if the original location is in an "external" template file:
            // * the file is different to the current file
            // * the file does not end in `.js` or `.ts` (we expect it to be something like `.html`).
            // * the range starts at the beginning of the file
            if (pos === null || pos.file === this.sourceUrl || /\.[jt]s$/.test(pos.file) ||
                pos.line !== 0 || pos.column !== 0) {
                return null;
            }
            var templateContents = sourceFile.sources.find(function (src) { return (src === null || src === void 0 ? void 0 : src.sourcePath) === pos.file; }).contents;
            return {
                code: templateContents,
                sourceUrl: pos.file,
                range: { startPos: 0, startLine: 0, startCol: 0, endPos: templateContents.length },
                isEscaped: false,
            };
        };
        PartialComponentLinkerVersion1.prototype.templateFromPartialCode = function (templateNode, _a) {
            var startPos = _a.startPos, endPos = _a.endPos, startLine = _a.startLine, startCol = _a.startCol;
            if (!/["'`]/.test(this.code[startPos]) || this.code[startPos] !== this.code[endPos - 1]) {
                throw new fatal_linker_error_1.FatalLinkerError(templateNode.expression, "Expected the template string to be wrapped in quotes but got: " + this.code.substring(startPos, endPos));
            }
            return {
                code: this.code,
                sourceUrl: this.sourceUrl,
                range: { startPos: startPos + 1, endPos: endPos - 1, startLine: startLine, startCol: startCol + 1 },
                isEscaped: true,
            };
        };
        return PartialComponentLinkerVersion1;
    }());
    exports.PartialComponentLinkerVersion1 = PartialComponentLinkerVersion1;
    /**
     * Extract an `InterpolationConfig` from the component declaration.
     */
    function parseInterpolationConfig(metaObj) {
        if (!metaObj.has('interpolation')) {
            return compiler_1.DEFAULT_INTERPOLATION_CONFIG;
        }
        var interpolationExpr = metaObj.getValue('interpolation');
        var values = interpolationExpr.getArray().map(function (entry) { return entry.getString(); });
        if (values.length !== 2) {
            throw new fatal_linker_error_1.FatalLinkerError(interpolationExpr.expression, 'Unsupported interpolation config, expected an array containing exactly two strings');
        }
        return compiler_1.InterpolationConfig.fromArray(values);
    }
    /**
     * Determines the `ViewEncapsulation` mode from the AST value's symbol name.
     */
    function parseEncapsulation(encapsulation) {
        var symbolName = encapsulation.getSymbolName();
        if (symbolName === null) {
            throw new fatal_linker_error_1.FatalLinkerError(encapsulation.expression, 'Expected encapsulation to have a symbol name');
        }
        var enumValue = core_1.ViewEncapsulation[symbolName];
        if (enumValue === undefined) {
            throw new fatal_linker_error_1.FatalLinkerError(encapsulation.expression, 'Unsupported encapsulation');
        }
        return enumValue;
    }
    /**
     * Determines the `ChangeDetectionStrategy` from the AST value's symbol name.
     */
    function parseChangeDetectionStrategy(changeDetectionStrategy) {
        var symbolName = changeDetectionStrategy.getSymbolName();
        if (symbolName === null) {
            throw new fatal_linker_error_1.FatalLinkerError(changeDetectionStrategy.expression, 'Expected change detection strategy to have a symbol name');
        }
        var enumValue = core_1.ChangeDetectionStrategy[symbolName];
        if (enumValue === undefined) {
            throw new fatal_linker_error_1.FatalLinkerError(changeDetectionStrategy.expression, 'Unsupported change detection strategy');
        }
        return enumValue;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGlhbF9jb21wb25lbnRfbGlua2VyXzEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbGlua2VyL3NyYy9maWxlX2xpbmtlci9wYXJ0aWFsX2xpbmtlcnMvcGFydGlhbF9jb21wb25lbnRfbGlua2VyXzEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDhDQUEyVDtJQUMzVCxtREFBc0Y7SUFNdEYsMEZBQTBEO0lBRzFELHNJQUErRDtJQUUvRCwwRkFBeUM7SUFFekM7O09BRUc7SUFDSDtRQUVFLHdDQUNxQixhQUE4QixFQUFVLFNBQXlCLEVBQzFFLElBQVk7WUFESCxrQkFBYSxHQUFiLGFBQWEsQ0FBaUI7WUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFnQjtZQUMxRSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQUcsQ0FBQztRQUU1QiwrREFBc0IsR0FBdEIsVUFDSSxZQUEwQixFQUMxQixPQUFxRDtZQUN2RCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0MsSUFBTSxHQUFHLEdBQUcsdUNBQTRCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSw0QkFBaUIsRUFBRSxDQUFDLENBQUM7WUFDbEYsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ3hCLENBQUM7UUFFRDs7V0FFRztRQUNLLDBEQUFpQixHQUF6QixVQUEwQixPQUEyRDtZQUVuRixJQUFNLGFBQWEsR0FBRyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4RCxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxV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QUFJLEVBQUU7WUFDdkIsTUFBTSxJQUFJLHFDQUFnQixDQUN0Qix1QkFBdUIsQ0FBQyxVQUFVLEVBQ2xDLDBEQUEwRCxDQUFDLENBQUM7U0FDakU7UUFDRCxJQUFNLFNBQVMsR0FBRyw4QkFBdUIsQ0FBQyxVQUFrRCxDQUFDLENBQUM7UUFDOUYsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQzNCLE1BQU0sSUFBSSxxQ0FBZ0IsQ0FDdEIsdUJBQXVCLENBQUMsVUFBVSxFQUFFLHVDQUF1QyxDQUFDLENBQUM7U0FDbEY7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2NvbXBpbGVDb21wb25lbnRGcm9tTWV0YWRhdGEsIENvbnN0YW50UG9vbCwgRGVjbGFyYXRpb25MaXN0RW1pdE1vZGUsIERFRkFVTFRfSU5URVJQT0xBVElPTl9DT05GSUcsIEludGVycG9sYXRpb25Db25maWcsIG1ha2VCaW5kaW5nUGFyc2VyLCBwYXJzZVRlbXBsYXRlLCBSM0NvbXBvbmVudE1ldGFkYXRhLCBSM0RlY2xhcmVDb21wb25lbnRNZXRhZGF0YSwgUjNEZWNsYXJlVXNlZERpcmVjdGl2ZU1ldGFkYXRhLCBSM1BhcnRpYWxEZWNsYXJhdGlvbiwgUjNVc2VkRGlyZWN0aXZlTWV0YWRhdGF9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvY29yZSc7XG5pbXBvcnQgKiBhcyBvIGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyL3NyYy9vdXRwdXQvb3V0cHV0X2FzdCc7XG5cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGh9IGZyb20gJy4uLy4uLy4uLy4uL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge1JhbmdlfSBmcm9tICcuLi8uLi9hc3QvYXN0X2hvc3QnO1xuaW1wb3J0IHtBc3RPYmplY3QsIEFzdFZhbHVlfSBmcm9tICcuLi8uLi9hc3QvYXN0X3ZhbHVlJztcbmltcG9ydCB7RmF0YWxMaW5rZXJFcnJvcn0gZnJvbSAnLi4vLi4vZmF0YWxfbGlua2VyX2Vycm9yJztcbmltcG9ydCB7R2V0U291cmNlRmlsZUZufSBmcm9tICcuLi9nZXRfc291cmNlX2ZpbGUnO1xuXG5pbXBvcnQge3RvUjNEaXJlY3RpdmVNZXRhfSBmcm9tICcuL3BhcnRpYWxfZGlyZWN0aXZlX2xpbmtlcl8xJztcbmltcG9ydCB7UGFydGlhbExpbmtlcn0gZnJvbSAnLi9wYXJ0aWFsX2xpbmtlcic7XG5pbXBvcnQge2V4dHJhY3RGb3J3YXJkUmVmfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIEEgYFBhcnRpYWxMaW5rZXJgIHRoYXQgaXMgZGVzaWduZWQgdG8gcHJvY2VzcyBgybXJtW5nRGVjbGFyZUNvbXBvbmVudCgpYCBjYWxsIGV4cHJlc3Npb25zLlxuICovXG5leHBvcnQgY2xhc3MgUGFydGlhbENvbXBvbmVudExpbmtlclZlcnNpb24xPFRTdGF0ZW1lbnQsIFRFeHByZXNzaW9uPiBpbXBsZW1lbnRzXG4gICAgUGFydGlhbExpbmtlcjxURXhwcmVzc2lvbj4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgZ2V0U291cmNlRmlsZTogR2V0U291cmNlRmlsZUZuLCBwcml2YXRlIHNvdXJjZVVybDogQWJzb2x1dGVGc1BhdGgsXG4gICAgICBwcml2YXRlIGNvZGU6IHN0cmluZykge31cblxuICBsaW5rUGFydGlhbERlY2xhcmF0aW9uKFxuICAgICAgY29uc3RhbnRQb29sOiBDb25zdGFudFBvb2wsXG4gICAgICBtZXRhT2JqOiBBc3RPYmplY3Q8UjNQYXJ0aWFsRGVjbGFyYXRpb24sIFRFeHByZXNzaW9uPik6IG8uRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgbWV0YSA9IHRoaXMudG9SM0NvbXBvbmVudE1ldGEobWV0YU9iaik7XG4gICAgY29uc3QgZGVmID0gY29tcGlsZUNvbXBvbmVudEZyb21NZXRhZGF0YShtZXRhLCBjb25zdGFudFBvb2wsIG1ha2VCaW5kaW5nUGFyc2VyKCkpO1xuICAgIHJldHVybiBkZWYuZXhwcmVzc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGRlcml2ZXMgdGhlIGBSM0NvbXBvbmVudE1ldGFkYXRhYCBmcm9tIHRoZSBwcm92aWRlZCBBU1Qgb2JqZWN0LlxuICAgKi9cbiAgcHJpdmF0ZSB0b1IzQ29tcG9uZW50TWV0YShtZXRhT2JqOiBBc3RPYmplY3Q8UjNEZWNsYXJlQ29tcG9uZW50TWV0YWRhdGEsIFRFeHByZXNzaW9uPik6XG4gICAgICBSM0NvbXBvbmVudE1ldGFkYXRhIHtcbiAgICBjb25zdCBpbnRlcnBvbGF0aW9uID0gcGFyc2VJbnRlcnBvbGF0aW9uQ29uZmlnKG1ldGFPYmopO1xuICAgIGNvbnN0IHRlbXBsYXRlU291cmNlID0gbWV0YU9iai5nZXRWYWx1ZSgndGVtcGxhdGUnKTtcbiAgICBjb25zdCBpc0lubGluZSA9IG1ldGFPYmouaGFzKCdpc0lubGluZScpID8gbWV0YU9iai5nZXRCb29sZWFuKCdpc0lubGluZScpIDogZmFsc2U7XG4gICAgY29uc3QgdGVtcGxhdGVJbmZvID0gdGhpcy5nZXRUZW1wbGF0ZUluZm8odGVtcGxhdGVTb3VyY2UsIGlzSW5saW5lKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gcGFyc2VUZW1wbGF0ZSh0ZW1wbGF0ZUluZm8uY29kZSwgdGVtcGxhdGVJbmZvLnNvdXJjZVVybCwge1xuICAgICAgZXNjYXBlZFN0cmluZzogdGVtcGxhdGVJbmZvLmlzRXNjYXBlZCxcbiAgICAgIGludGVycG9sYXRpb25Db25maWc6IGludGVycG9sYXRpb24sXG4gICAgICByYW5nZTogdGVtcGxhdGVJbmZvLnJhbmdlLFxuICAgICAgZW5hYmxlSTE4bkxlZ2FjeU1lc3NhZ2VJZEZvcm1hdDogZmFsc2UsXG4gICAgICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOlxuICAgICAgICAgIG1ldGFPYmouaGFzKCdwcmVzZXJ2ZVdoaXRlc3BhY2VzJykgPyBtZXRhT2JqLmdldEJvb2xlYW4oJ3ByZXNlcnZlV2hpdGVzcGFjZXMnKSA6IGZhbHNlLFxuICAgICAgLy8gV2Ugbm9ybWFsaXplIGxpbmUgZW5kaW5ncyBpZiB0aGUgdGVtcGxhdGUgaXMgd2FzIGlubGluZS5cbiAgICAgIGkxOG5Ob3JtYWxpemVMaW5lRW5kaW5nc0luSUNVczogaXNJbmxpbmUsXG4gICAgfSk7XG4gICAgaWYgKHRlbXBsYXRlLmVycm9ycyAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgZXJyb3JzID0gdGVtcGxhdGUuZXJyb3JzLm1hcChlcnIgPT4gZXJyLnRvU3RyaW5nKCkpLmpvaW4oJ1xcbicpO1xuICAgICAgdGhyb3cgbmV3IEZhdGFsTGlua2VyRXJyb3IoXG4gICAgICAgICAgdGVtcGxhdGVTb3VyY2UuZXhwcmVzc2lvbiwgYEVycm9ycyBmb3VuZCBpbiB0aGUgdGVtcGxhdGU6XFxuJHtlcnJvcnN9YCk7XG4gICAgfVxuXG4gICAgbGV0IGRlY2xhcmF0aW9uTGlzdEVtaXRNb2RlID0gRGVjbGFyYXRpb25MaXN0RW1pdE1vZGUuRGlyZWN0O1xuXG4gICAgY29uc3QgY29sbGVjdFVzZWREaXJlY3RpdmVzID1cbiAgICAgICAgKGRpcmVjdGl2ZXM6IEFzdFZhbHVlPFIzRGVjbGFyZVVzZWREaXJlY3RpdmVNZXRhZGF0YSwgVEV4cHJlc3Npb24+W10pID0+IHtcbiAgICAgICAgICByZXR1cm4gZGlyZWN0aXZlcy5tYXAoZGlyZWN0aXZlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGl2ZUV4cHIgPSBkaXJlY3RpdmUuZ2V0T2JqZWN0KCk7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gZGlyZWN0aXZlRXhwci5nZXRWYWx1ZSgndHlwZScpO1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBkaXJlY3RpdmVFeHByLmdldFN0cmluZygnc2VsZWN0b3InKTtcblxuICAgICAgICAgICAgY29uc3Qge2V4cHJlc3Npb246IHR5cGVFeHByLCBpc0ZvcndhcmRSZWZ9ID0gZXh0cmFjdEZvcndhcmRSZWYodHlwZSk7XG4gICAgICAgICAgICBpZiAoaXNGb3J3YXJkUmVmKSB7XG4gICAgICAgICAgICAgIGRlY2xhcmF0aW9uTGlzdEVtaXRNb2RlID0gRGVjbGFyYXRpb25MaXN0RW1pdE1vZGUuQ2xvc3VyZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdHlwZTogdHlwZUV4cHIsXG4gICAgICAgICAgICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICAgICAgICAgICAgaW5wdXRzOiBkaXJlY3RpdmVFeHByLmhhcygnaW5wdXRzJykgP1xuICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlRXhwci5nZXRBcnJheSgnaW5wdXRzJykubWFwKGlucHV0ID0+IGlucHV0LmdldFN0cmluZygpKSA6XG4gICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgb3V0cHV0czogZGlyZWN0aXZlRXhwci5oYXMoJ291dHB1dHMnKSA/XG4gICAgICAgICAgICAgICAgICBkaXJlY3RpdmVFeHByLmdldEFycmF5KCdvdXRwdXRzJykubWFwKGlucHV0ID0+IGlucHV0LmdldFN0cmluZygpKSA6XG4gICAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgZXhwb3J0QXM6IGRpcmVjdGl2ZUV4cHIuaGFzKCdleHBvcnRBcycpID9cbiAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZUV4cHIuZ2V0QXJyYXkoJ2V4cG9ydEFzJykubWFwKGV4cG9ydEFzID0+IGV4cG9ydEFzLmdldFN0cmluZygpKSA6XG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgIGxldCBkaXJlY3RpdmVzOiBSM1VzZWREaXJlY3RpdmVNZXRhZGF0YVtdID0gW107XG4gICAgaWYgKG1ldGFPYmouaGFzKCdjb21wb25lbnRzJykpIHtcbiAgICAgIGRpcmVjdGl2ZXMucHVzaCguLi5jb2xsZWN0VXNlZERpcmVjdGl2ZXMobWV0YU9iai5nZXRBcnJheSgnY29tcG9uZW50cycpKSk7XG4gICAgfVxuICAgIGlmIChtZXRhT2JqLmhhcygnZGlyZWN0aXZlcycpKSB7XG4gICAgICBkaXJlY3RpdmVzLnB1c2goLi4uY29sbGVjdFVzZWREaXJlY3RpdmVzKG1ldGFPYmouZ2V0QXJyYXkoJ2RpcmVjdGl2ZXMnKSkpO1xuICAgIH1cblxuICAgIGxldCBwaXBlcyA9IG5ldyBNYXA8c3RyaW5nLCBvLkV4cHJlc3Npb24+KCk7XG4gICAgaWYgKG1ldGFPYmouaGFzKCdwaXBlcycpKSB7XG4gICAgICBwaXBlcyA9IG1ldGFPYmouZ2V0T2JqZWN0KCdwaXBlcycpLnRvTWFwKHBpcGUgPT4ge1xuICAgICAgICBjb25zdCB7ZXhwcmVzc2lvbjogcGlwZVR5cGUsIGlzRm9yd2FyZFJlZn0gPSBleHRyYWN0Rm9yd2FyZFJlZihwaXBlKTtcbiAgICAgICAgaWYgKGlzRm9yd2FyZFJlZikge1xuICAgICAgICAgIGRlY2xhcmF0aW9uTGlzdEVtaXRNb2RlID0gRGVjbGFyYXRpb25MaXN0RW1pdE1vZGUuQ2xvc3VyZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGlwZVR5cGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4udG9SM0RpcmVjdGl2ZU1ldGEobWV0YU9iaiwgdGhpcy5jb2RlLCB0aGlzLnNvdXJjZVVybCksXG4gICAgICB2aWV3UHJvdmlkZXJzOiBtZXRhT2JqLmhhcygndmlld1Byb3ZpZGVycycpID8gbWV0YU9iai5nZXRPcGFxdWUoJ3ZpZXdQcm92aWRlcnMnKSA6IG51bGwsXG4gICAgICB0ZW1wbGF0ZToge1xuICAgICAgICBub2RlczogdGVtcGxhdGUubm9kZXMsXG4gICAgICAgIG5nQ29udGVudFNlbGVjdG9yczogdGVtcGxhdGUubmdDb250ZW50U2VsZWN0b3JzLFxuICAgICAgfSxcbiAgICAgIGRlY2xhcmF0aW9uTGlzdEVtaXRNb2RlLFxuICAgICAgc3R5bGVzOiBtZXRhT2JqLmhhcygnc3R5bGVzJykgPyBtZXRhT2JqLmdldEFycmF5KCdzdHlsZXMnKS5tYXAoZW50cnkgPT4gZW50cnkuZ2V0U3RyaW5nKCkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW10sXG4gICAgICBlbmNhcHN1bGF0aW9uOiBtZXRhT2JqLmhhcygnZW5jYXBzdWxhdGlvbicpID9cbiAgICAgICAgICBwYXJzZUVuY2Fwc3VsYXRpb24obWV0YU9iai5nZXRWYWx1ZSgnZW5jYXBzdWxhdGlvbicpKSA6XG4gICAgICAgICAgVmlld0VuY2Fwc3VsYXRpb24uRW11bGF0ZWQsXG4gICAgICBpbnRlcnBvbGF0aW9uLFxuICAgICAgY2hhbmdlRGV0ZWN0aW9uOiBtZXRhT2JqLmhhcygnY2hhbmdlRGV0ZWN0aW9uJykgP1xuICAgICAgICAgIHBhcnNlQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kobWV0YU9iai5nZXRWYWx1ZSgnY2hhbmdlRGV0ZWN0aW9uJykpIDpcbiAgICAgICAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICAgICAgYW5pbWF0aW9uczogbWV0YU9iai5oYXMoJ2FuaW1hdGlvbnMnKSA/IG1ldGFPYmouZ2V0T3BhcXVlKCdhbmltYXRpb25zJykgOiBudWxsLFxuICAgICAgcmVsYXRpdmVDb250ZXh0RmlsZVBhdGg6IHRoaXMuc291cmNlVXJsLFxuICAgICAgaTE4blVzZUV4dGVybmFsSWRzOiBmYWxzZSxcbiAgICAgIHBpcGVzLFxuICAgICAgZGlyZWN0aXZlcyxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgcmFuZ2UgdG8gcmVtb3ZlIHRoZSBzdGFydCBhbmQgZW5kIGNoYXJzLCB3aGljaCBzaG91bGQgYmUgcXVvdGVzIGFyb3VuZCB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICBwcml2YXRlIGdldFRlbXBsYXRlSW5mbyh0ZW1wbGF0ZU5vZGU6IEFzdFZhbHVlPHVua25vd24sIFRFeHByZXNzaW9uPiwgaXNJbmxpbmU6IGJvb2xlYW4pOlxuICAgICAgVGVtcGxhdGVJbmZvIHtcbiAgICBjb25zdCByYW5nZSA9IHRlbXBsYXRlTm9kZS5nZXRSYW5nZSgpO1xuXG4gICAgaWYgKCFpc0lubGluZSkge1xuICAgICAgLy8gSWYgbm90IG1hcmtlZCBhcyBpbmxpbmUsIHRoZW4gd2UgdHJ5IHRvIGdldCB0aGUgdGVtcGxhdGUgaW5mbyBmcm9tIHRoZSBvcmlnaW5hbCBleHRlcm5hbFxuICAgICAgLy8gdGVtcGxhdGUgZmlsZSwgdmlhIHNvdXJjZS1tYXBwaW5nLlxuICAgICAgY29uc3QgZXh0ZXJuYWxUZW1wbGF0ZSA9IHRoaXMudHJ5RXh0ZXJuYWxUZW1wbGF0ZShyYW5nZSk7XG4gICAgICBpZiAoZXh0ZXJuYWxUZW1wbGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZXh0ZXJuYWxUZW1wbGF0ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFaXRoZXIgdGhlIHRlbXBsYXRlIGlzIG1hcmtlZCBpbmxpbmUgb3Igd2UgZmFpbGVkIHRvIGZpbmQgdGhlIG9yaWdpbmFsIGV4dGVybmFsIHRlbXBsYXRlLlxuICAgIC8vIFNvIGp1c3QgdXNlIHRoZSBsaXRlcmFsIHN0cmluZyBmcm9tIHRoZSBwYXJ0aWFsbHkgY29tcGlsZWQgY29tcG9uZW50IGRlY2xhcmF0aW9uLlxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlRnJvbVBhcnRpYWxDb2RlKHRlbXBsYXRlTm9kZSwgcmFuZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSB0cnlFeHRlcm5hbFRlbXBsYXRlKHJhbmdlOiBSYW5nZSk6IFRlbXBsYXRlSW5mb3xudWxsIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gdGhpcy5nZXRTb3VyY2VGaWxlKCk7XG4gICAgaWYgKHNvdXJjZUZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHBvcyA9IHNvdXJjZUZpbGUuZ2V0T3JpZ2luYWxMb2NhdGlvbihyYW5nZS5zdGFydExpbmUsIHJhbmdlLnN0YXJ0Q29sKTtcbiAgICAvLyBPbmx5IGludGVyZXN0ZWQgaWYgdGhlIG9yaWdpbmFsIGxvY2F0aW9uIGlzIGluIGFuIFwiZXh0ZXJuYWxcIiB0ZW1wbGF0ZSBmaWxlOlxuICAgIC8vICogdGhlIGZpbGUgaXMgZGlmZmVyZW50IHRvIHRoZSBjdXJyZW50IGZpbGVcbiAgICAvLyAqIHRoZSBmaWxlIGRvZXMgbm90IGVuZCBpbiBgLmpzYCBvciBgLnRzYCAod2UgZXhwZWN0IGl0IHRvIGJlIHNvbWV0aGluZyBsaWtlIGAuaHRtbGApLlxuICAgIC8vICogdGhlIHJhbmdlIHN0YXJ0cyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBmaWxlXG4gICAgaWYgKHBvcyA9PT0gbnVsbCB8fCBwb3MuZmlsZSA9PT0gdGhpcy5zb3VyY2VVcmwgfHwgL1xcLltqdF1zJC8udGVzdChwb3MuZmlsZSkgfHxcbiAgICAgICAgcG9zLmxpbmUgIT09IDAgfHwgcG9zLmNvbHVtbiAhPT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdGVtcGxhdGVDb250ZW50cyA9IHNvdXJjZUZpbGUuc291cmNlcy5maW5kKHNyYyA9PiBzcmM/LnNvdXJjZVBhdGggPT09IHBvcy5maWxlKSEuY29udGVudHM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29kZTogdGVtcGxhdGVDb250ZW50cyxcbiAgICAgIHNvdXJjZVVybDogcG9zLmZpbGUsXG4gICAgICByYW5nZToge3N0YXJ0UG9zOiAwLCBzdGFydExpbmU6IDAsIHN0YXJ0Q29sOiAwLCBlbmRQb3M6IHRlbXBsYXRlQ29udGVudHMubGVuZ3RofSxcbiAgICAgIGlzRXNjYXBlZDogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgdGVtcGxhdGVGcm9tUGFydGlhbENvZGUoXG4gICAgICB0ZW1wbGF0ZU5vZGU6IEFzdFZhbHVlPHVua25vd24sIFRFeHByZXNzaW9uPixcbiAgICAgIHtzdGFydFBvcywgZW5kUG9zLCBzdGFydExpbmUsIHN0YXJ0Q29sfTogUmFuZ2UpOiBUZW1wbGF0ZUluZm8ge1xuICAgIGlmICghL1tcIidgXS8udGVzdCh0aGlzLmNvZGVbc3RhcnRQb3NdKSB8fCB0aGlzLmNvZGVbc3RhcnRQb3NdICE9PSB0aGlzLmNvZGVbZW5kUG9zIC0gMV0pIHtcbiAgICAgIHRocm93IG5ldyBGYXRhbExpbmtlckVycm9yKFxuICAgICAgICAgIHRlbXBsYXRlTm9kZS5leHByZXNzaW9uLFxuICAgICAgICAgIGBFeHBlY3RlZCB0aGUgdGVtcGxhdGUgc3RyaW5nIHRvIGJlIHdyYXBwZWQgaW4gcXVvdGVzIGJ1dCBnb3Q6ICR7XG4gICAgICAgICAgICAgIHRoaXMuY29kZS5zdWJzdHJpbmcoc3RhcnRQb3MsIGVuZFBvcyl9YCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBjb2RlOiB0aGlzLmNvZGUsXG4gICAgICBzb3VyY2VVcmw6IHRoaXMuc291cmNlVXJsLFxuICAgICAgcmFuZ2U6IHtzdGFydFBvczogc3RhcnRQb3MgKyAxLCBlbmRQb3M6IGVuZFBvcyAtIDEsIHN0YXJ0TGluZSwgc3RhcnRDb2w6IHN0YXJ0Q29sICsgMX0sXG4gICAgICBpc0VzY2FwZWQ6IHRydWUsXG4gICAgfTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgVGVtcGxhdGVJbmZvIHtcbiAgY29kZTogc3RyaW5nO1xuICBzb3VyY2VVcmw6IHN0cmluZztcbiAgcmFuZ2U6IFJhbmdlO1xuICBpc0VzY2FwZWQ6IGJvb2xlYW47XG59XG5cbi8qKlxuICogRXh0cmFjdCBhbiBgSW50ZXJwb2xhdGlvbkNvbmZpZ2AgZnJvbSB0aGUgY29tcG9uZW50IGRlY2xhcmF0aW9uLlxuICovXG5mdW5jdGlvbiBwYXJzZUludGVycG9sYXRpb25Db25maWc8VEV4cHJlc3Npb24+KFxuICAgIG1ldGFPYmo6IEFzdE9iamVjdDxSM0RlY2xhcmVDb21wb25lbnRNZXRhZGF0YSwgVEV4cHJlc3Npb24+KTogSW50ZXJwb2xhdGlvbkNvbmZpZyB7XG4gIGlmICghbWV0YU9iai5oYXMoJ2ludGVycG9sYXRpb24nKSkge1xuICAgIHJldHVybiBERUZBVUxUX0lOVEVSUE9MQVRJT05fQ09ORklHO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwb2xhdGlvbkV4cHIgPSBtZXRhT2JqLmdldFZhbHVlKCdpbnRlcnBvbGF0aW9uJyk7XG4gIGNvbnN0IHZhbHVlcyA9IGludGVycG9sYXRpb25FeHByLmdldEFycmF5KCkubWFwKGVudHJ5ID0+IGVudHJ5LmdldFN0cmluZygpKTtcbiAgaWYgKHZhbHVlcy5sZW5ndGggIT09IDIpIHtcbiAgICB0aHJvdyBuZXcgRmF0YWxMaW5rZXJFcnJvcihcbiAgICAgICAgaW50ZXJwb2xhdGlvbkV4cHIuZXhwcmVzc2lvbixcbiAgICAgICAgJ1Vuc3VwcG9ydGVkIGludGVycG9sYXRpb24gY29uZmlnLCBleHBlY3RlZCBhbiBhcnJheSBjb250YWluaW5nIGV4YWN0bHkgdHdvIHN0cmluZ3MnKTtcbiAgfVxuICByZXR1cm4gSW50ZXJwb2xhdGlvbkNvbmZpZy5mcm9tQXJyYXkodmFsdWVzIGFzIFtzdHJpbmcsIHN0cmluZ10pO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgdGhlIGBWaWV3RW5jYXBzdWxhdGlvbmAgbW9kZSBmcm9tIHRoZSBBU1QgdmFsdWUncyBzeW1ib2wgbmFtZS5cbiAqL1xuZnVuY3Rpb24gcGFyc2VFbmNhcHN1bGF0aW9uPFRFeHByZXNzaW9uPihlbmNhcHN1bGF0aW9uOiBBc3RWYWx1ZTxWaWV3RW5jYXBzdWxhdGlvbiwgVEV4cHJlc3Npb24+KTpcbiAgICBWaWV3RW5jYXBzdWxhdGlvbiB7XG4gIGNvbnN0IHN5bWJvbE5hbWUgPSBlbmNhcHN1bGF0aW9uLmdldFN5bWJvbE5hbWUoKTtcbiAgaWYgKHN5bWJvbE5hbWUgPT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRmF0YWxMaW5rZXJFcnJvcihcbiAgICAgICAgZW5jYXBzdWxhdGlvbi5leHByZXNzaW9uLCAnRXhwZWN0ZWQgZW5jYXBzdWxhdGlvbiB0byBoYXZlIGEgc3ltYm9sIG5hbWUnKTtcbiAgfVxuICBjb25zdCBlbnVtVmFsdWUgPSBWaWV3RW5jYXBzdWxhdGlvbltzeW1ib2xOYW1lIGFzIGtleW9mIHR5cGVvZiBWaWV3RW5jYXBzdWxhdGlvbl07XG4gIGlmIChlbnVtVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBGYXRhbExpbmtlckVycm9yKGVuY2Fwc3VsYXRpb24uZXhwcmVzc2lvbiwgJ1Vuc3VwcG9ydGVkIGVuY2Fwc3VsYXRpb24nKTtcbiAgfVxuICByZXR1cm4gZW51bVZhbHVlO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgdGhlIGBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneWAgZnJvbSB0aGUgQVNUIHZhbHVlJ3Mgc3ltYm9sIG5hbWUuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3k8VEV4cHJlc3Npb24+KFxuICAgIGNoYW5nZURldGVjdGlvblN0cmF0ZWd5OiBBc3RWYWx1ZTxDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVEV4cHJlc3Npb24+KTpcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB7XG4gIGNvbnN0IHN5bWJvbE5hbWUgPSBjaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5nZXRTeW1ib2xOYW1lKCk7XG4gIGlmIChzeW1ib2xOYW1lID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEZhdGFsTGlua2VyRXJyb3IoXG4gICAgICAgIGNoYW5nZURldGVjdGlvblN0cmF0ZWd5LmV4cHJlc3Npb24sXG4gICAgICAgICdFeHBlY3RlZCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5IHRvIGhhdmUgYSBzeW1ib2wgbmFtZScpO1xuICB9XG4gIGNvbnN0IGVudW1WYWx1ZSA9IENoYW5nZURldGVjdGlvblN0cmF0ZWd5W3N5bWJvbE5hbWUgYXMga2V5b2YgdHlwZW9mIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XTtcbiAgaWYgKGVudW1WYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEZhdGFsTGlua2VyRXJyb3IoXG4gICAgICAgIGNoYW5nZURldGVjdGlvblN0cmF0ZWd5LmV4cHJlc3Npb24sICdVbnN1cHBvcnRlZCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5Jyk7XG4gIH1cbiAgcmV0dXJuIGVudW1WYWx1ZTtcbn1cbiJdfQ==