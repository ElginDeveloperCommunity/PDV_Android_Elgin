/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/program", ["require", "exports", "tslib", "@angular/compiler", "typescript", "@angular/compiler-cli/src/transformers/api", "@angular/compiler-cli/src/transformers/i18n", "@angular/compiler-cli/src/typescript_support", "@angular/compiler-cli/src/ngtsc/core", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/incremental", "@angular/compiler-cli/src/ngtsc/perf", "@angular/compiler-cli/src/ngtsc/program_driver", "@angular/compiler-cli/src/ngtsc/shims", "@angular/compiler-cli/src/ngtsc/typecheck/api"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NgtscProgram = void 0;
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var api = require("@angular/compiler-cli/src/transformers/api");
    var i18n_1 = require("@angular/compiler-cli/src/transformers/i18n");
    var typescript_support_1 = require("@angular/compiler-cli/src/typescript_support");
    var core_1 = require("@angular/compiler-cli/src/ngtsc/core");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var incremental_1 = require("@angular/compiler-cli/src/ngtsc/incremental");
    var perf_1 = require("@angular/compiler-cli/src/ngtsc/perf");
    var program_driver_1 = require("@angular/compiler-cli/src/ngtsc/program_driver");
    var shims_1 = require("@angular/compiler-cli/src/ngtsc/shims");
    var api_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/api");
    /**
     * Entrypoint to the Angular Compiler (Ivy+) which sits behind the `api.Program` interface, allowing
     * it to be a drop-in replacement for the legacy View Engine compiler to tooling such as the
     * command-line main() function or the Angular CLI.
     */
    var NgtscProgram = /** @class */ (function () {
        function NgtscProgram(rootNames, options, delegateHost, oldProgram) {
            var e_1, _a;
            var _this = this;
            this.options = options;
            var perfRecorder = perf_1.ActivePerfRecorder.zeroedToNow();
            perfRecorder.phase(perf_1.PerfPhase.Setup);
            // First, check whether the current TS version is supported.
            if (!options.disableTypeScriptVersionCheck) {
                typescript_support_1.verifySupportedTypeScriptVersion();
            }
            this.closureCompilerEnabled = !!options.annotateForClosureCompiler;
            var reuseProgram = oldProgram === null || oldProgram === void 0 ? void 0 : oldProgram.compiler.getCurrentProgram();
            this.host = core_1.NgCompilerHost.wrap(delegateHost, rootNames, options, reuseProgram !== null && reuseProgram !== void 0 ? reuseProgram : null);
            if (reuseProgram !== undefined) {
                // Prior to reusing the old program, restore shim tagging for all its `ts.SourceFile`s.
                // TypeScript checks the `referencedFiles` of `ts.SourceFile`s for changes when evaluating
                // incremental reuse of data from the old program, so it's important that these match in order
                // to get the most benefit out of reuse.
                shims_1.retagAllTsFiles(reuseProgram);
            }
            this.tsProgram = perfRecorder.inPhase(perf_1.PerfPhase.TypeScriptProgramCreate, function () { return ts.createProgram(_this.host.inputFiles, options, _this.host, reuseProgram); });
            perfRecorder.phase(perf_1.PerfPhase.Unaccounted);
            perfRecorder.memory(perf_1.PerfCheckpoint.TypeScriptProgramCreate);
            this.host.postProgramCreationCleanup();
            // Shim tagging has served its purpose, and tags can now be removed from all `ts.SourceFile`s in
            // the program.
            shims_1.untagAllTsFiles(this.tsProgram);
            var programDriver = new program_driver_1.TsCreateProgramDriver(this.tsProgram, this.host, this.options, this.host.shimExtensionPrefixes);
            this.incrementalStrategy = oldProgram !== undefined ?
                oldProgram.incrementalStrategy.toNextBuildStrategy() :
                new incremental_1.TrackedIncrementalBuildStrategy();
            var modifiedResourceFiles = new Set();
            if (this.host.getModifiedResourceFiles !== undefined) {
                var strings = this.host.getModifiedResourceFiles();
                if (strings !== undefined) {
                    try {
                        for (var strings_1 = tslib_1.__values(strings), strings_1_1 = strings_1.next(); !strings_1_1.done; strings_1_1 = strings_1.next()) {
                            var fileString = strings_1_1.value;
                            modifiedResourceFiles.add(file_system_1.absoluteFrom(fileString));
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (strings_1_1 && !strings_1_1.done && (_a = strings_1.return)) _a.call(strings_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            var ticket;
            if (oldProgram === undefined) {
                ticket = core_1.freshCompilationTicket(this.tsProgram, options, this.incrementalStrategy, programDriver, perfRecorder, 
                /* enableTemplateTypeChecker */ false, /* usePoisonedData */ false);
            }
            else {
                ticket = core_1.incrementalFromCompilerTicket(oldProgram.compiler, this.tsProgram, this.incrementalStrategy, programDriver, modifiedResourceFiles, perfRecorder);
            }
            // Create the NgCompiler which will drive the rest of the compilation.
            this.compiler = core_1.NgCompiler.fromTicket(ticket, this.host);
        }
        NgtscProgram.prototype.getTsProgram = function () {
            return this.tsProgram;
        };
        NgtscProgram.prototype.getReuseTsProgram = function () {
            return this.compiler.getCurrentProgram();
        };
        NgtscProgram.prototype.getTsOptionDiagnostics = function (cancellationToken) {
            var _this = this;
            return this.compiler.perfRecorder.inPhase(perf_1.PerfPhase.TypeScriptDiagnostics, function () { return _this.tsProgram.getOptionsDiagnostics(cancellationToken); });
        };
        NgtscProgram.prototype.getTsSyntacticDiagnostics = function (sourceFile, cancellationToken) {
            var _this = this;
            return this.compiler.perfRecorder.inPhase(perf_1.PerfPhase.TypeScriptDiagnostics, function () {
                var e_2, _a;
                var ignoredFiles = _this.compiler.ignoreForDiagnostics;
                var res;
                if (sourceFile !== undefined) {
                    if (ignoredFiles.has(sourceFile)) {
                        return [];
                    }
                    res = _this.tsProgram.getSyntacticDiagnostics(sourceFile, cancellationToken);
                }
                else {
                    var diagnostics = [];
                    try {
                        for (var _b = tslib_1.__values(_this.tsProgram.getSourceFiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var sf = _c.value;
                            if (!ignoredFiles.has(sf)) {
                                diagnostics.push.apply(diagnostics, tslib_1.__spreadArray([], tslib_1.__read(_this.tsProgram.getSyntacticDiagnostics(sf, cancellationToken))));
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    res = diagnostics;
                }
                return res;
            });
        };
        NgtscProgram.prototype.getTsSemanticDiagnostics = function (sourceFile, cancellationToken) {
            var _this = this;
            return this.compiler.perfRecorder.inPhase(perf_1.PerfPhase.TypeScriptDiagnostics, function () {
                var e_3, _a;
                var ignoredFiles = _this.compiler.ignoreForDiagnostics;
                var res;
                if (sourceFile !== undefined) {
                    if (ignoredFiles.has(sourceFile)) {
                        return [];
                    }
                    res = _this.tsProgram.getSemanticDiagnostics(sourceFile, cancellationToken);
                }
                else {
                    var diagnostics = [];
                    try {
                        for (var _b = tslib_1.__values(_this.tsProgram.getSourceFiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var sf = _c.value;
                            if (!ignoredFiles.has(sf)) {
                                diagnostics.push.apply(diagnostics, tslib_1.__spreadArray([], tslib_1.__read(_this.tsProgram.getSemanticDiagnostics(sf, cancellationToken))));
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    res = diagnostics;
                }
                return res;
            });
        };
        NgtscProgram.prototype.getNgOptionDiagnostics = function (cancellationToken) {
            return this.compiler.getOptionDiagnostics();
        };
        NgtscProgram.prototype.getNgStructuralDiagnostics = function (cancellationToken) {
            return [];
        };
        NgtscProgram.prototype.getNgSemanticDiagnostics = function (fileName, cancellationToken) {
            var sf = undefined;
            if (fileName !== undefined) {
                sf = this.tsProgram.getSourceFile(fileName);
                if (sf === undefined) {
                    // There are no diagnostics for files which don't exist in the program - maybe the caller
                    // has stale data?
                    return [];
                }
            }
            if (sf === undefined) {
                return this.compiler.getDiagnostics();
            }
            else {
                return this.compiler.getDiagnosticsForFile(sf, api_1.OptimizeFor.WholeProgram);
            }
        };
        /**
         * Ensure that the `NgCompiler` has properly analyzed the program, and allow for the asynchronous
         * loading of any resources during the process.
         *
         * This is used by the Angular CLI to allow for spawning (async) child compilations for things
         * like SASS files used in `styleUrls`.
         */
        NgtscProgram.prototype.loadNgStructureAsync = function () {
            return this.compiler.analyzeAsync();
        };
        NgtscProgram.prototype.listLazyRoutes = function (entryRoute) {
            return this.compiler.listLazyRoutes(entryRoute);
        };
        NgtscProgram.prototype.emitXi18n = function () {
            var _a, _b, _c;
            var ctx = new compiler_1.MessageBundle(new compiler_1.HtmlParser(), [], {}, (_a = this.options.i18nOutLocale) !== null && _a !== void 0 ? _a : null);
            this.compiler.xi18n(ctx);
            i18n_1.i18nExtract((_b = this.options.i18nOutFormat) !== null && _b !== void 0 ? _b : null, (_c = this.options.i18nOutFile) !== null && _c !== void 0 ? _c : null, this.host, this.options, ctx, file_system_1.resolve);
        };
        NgtscProgram.prototype.emit = function (opts) {
            var _this = this;
            // Check if emission of the i18n messages bundle was requested.
            if (opts !== undefined && opts.emitFlags !== undefined &&
                opts.emitFlags & api.EmitFlags.I18nBundle) {
                this.emitXi18n();
                // `api.EmitFlags` is a View Engine compiler concept. We only pay attention to the absence of
                // the other flags here if i18n emit was requested (since this is usually done in the xi18n
                // flow, where we don't want to emit JS at all).
                if (!(opts.emitFlags & api.EmitFlags.JS)) {
                    return {
                        diagnostics: [],
                        emitSkipped: true,
                        emittedFiles: [],
                    };
                }
            }
            this.compiler.perfRecorder.memory(perf_1.PerfCheckpoint.PreEmit);
            var res = this.compiler.perfRecorder.inPhase(perf_1.PerfPhase.TypeScriptEmit, function () {
                var e_4, _a;
                var transformers = _this.compiler.prepareEmit().transformers;
                var ignoreFiles = _this.compiler.ignoreForEmit;
                var emitCallback = opts && opts.emitCallback || defaultEmitCallback;
                var writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
                    var e_5, _a;
                    if (sourceFiles !== undefined) {
                        try {
                            // Record successful writes for any `ts.SourceFile` (that's not a declaration file)
                            // that's an input to this write.
                            for (var sourceFiles_1 = tslib_1.__values(sourceFiles), sourceFiles_1_1 = sourceFiles_1.next(); !sourceFiles_1_1.done; sourceFiles_1_1 = sourceFiles_1.next()) {
                                var writtenSf = sourceFiles_1_1.value;
                                if (writtenSf.isDeclarationFile) {
                                    continue;
                                }
                                _this.compiler.incrementalCompilation.recordSuccessfulEmit(writtenSf);
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (sourceFiles_1_1 && !sourceFiles_1_1.done && (_a = sourceFiles_1.return)) _a.call(sourceFiles_1);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                    }
                    _this.host.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
                };
                var customTransforms = opts && opts.customTransformers;
                var beforeTransforms = transformers.before || [];
                var afterDeclarationsTransforms = transformers.afterDeclarations;
                if (customTransforms !== undefined && customTransforms.beforeTs !== undefined) {
                    beforeTransforms.push.apply(beforeTransforms, tslib_1.__spreadArray([], tslib_1.__read(customTransforms.beforeTs)));
                }
                var emitResults = [];
                try {
                    for (var _b = tslib_1.__values(_this.tsProgram.getSourceFiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var targetSourceFile = _c.value;
                        if (targetSourceFile.isDeclarationFile || ignoreFiles.has(targetSourceFile)) {
                            continue;
                        }
                        if (_this.compiler.incrementalCompilation.safeToSkipEmit(targetSourceFile)) {
                            _this.compiler.perfRecorder.eventCount(perf_1.PerfEvent.EmitSkipSourceFile);
                            continue;
                        }
                        _this.compiler.perfRecorder.eventCount(perf_1.PerfEvent.EmitSourceFile);
                        emitResults.push(emitCallback({
                            targetSourceFile: targetSourceFile,
                            program: _this.tsProgram,
                            host: _this.host,
                            options: _this.options,
                            emitOnlyDtsFiles: false,
                            writeFile: writeFile,
                            customTransformers: {
                                before: beforeTransforms,
                                after: customTransforms && customTransforms.afterTs,
                                afterDeclarations: afterDeclarationsTransforms,
                            },
                        }));
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                _this.compiler.perfRecorder.memory(perf_1.PerfCheckpoint.Emit);
                // Run the emit, including a custom transformer that will downlevel the Ivy decorators in
                // code.
                return ((opts && opts.mergeEmitResultsCallback) || mergeEmitResults)(emitResults);
            });
            // Record performance analysis information to disk if we've been asked to do so.
            if (this.options.tracePerformance !== undefined) {
                var perf = this.compiler.perfRecorder.finalize();
                file_system_1.getFileSystem().writeFile(file_system_1.getFileSystem().resolve(this.options.tracePerformance), JSON.stringify(perf, null, 2));
            }
            return res;
        };
        NgtscProgram.prototype.getIndexedComponents = function () {
            return this.compiler.getIndexedComponents();
        };
        NgtscProgram.prototype.getLibrarySummaries = function () {
            throw new Error('Method not implemented.');
        };
        NgtscProgram.prototype.getEmittedGeneratedFiles = function () {
            throw new Error('Method not implemented.');
        };
        NgtscProgram.prototype.getEmittedSourceFiles = function () {
            throw new Error('Method not implemented.');
        };
        return NgtscProgram;
    }());
    exports.NgtscProgram = NgtscProgram;
    var defaultEmitCallback = function (_a) {
        var program = _a.program, targetSourceFile = _a.targetSourceFile, writeFile = _a.writeFile, cancellationToken = _a.cancellationToken, emitOnlyDtsFiles = _a.emitOnlyDtsFiles, customTransformers = _a.customTransformers;
        return program.emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers);
    };
    function mergeEmitResults(emitResults) {
        var e_6, _a;
        var diagnostics = [];
        var emitSkipped = false;
        var emittedFiles = [];
        try {
            for (var emitResults_1 = tslib_1.__values(emitResults), emitResults_1_1 = emitResults_1.next(); !emitResults_1_1.done; emitResults_1_1 = emitResults_1.next()) {
                var er = emitResults_1_1.value;
                diagnostics.push.apply(diagnostics, tslib_1.__spreadArray([], tslib_1.__read(er.diagnostics)));
                emitSkipped = emitSkipped || er.emitSkipped;
                emittedFiles.push.apply(emittedFiles, tslib_1.__spreadArray([], tslib_1.__read((er.emittedFiles || []))));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (emitResults_1_1 && !emitResults_1_1.done && (_a = emitResults_1.return)) _a.call(emitResults_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return { diagnostics: diagnostics, emitSkipped: emitSkipped, emittedFiles: emittedFiles };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3JhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvcHJvZ3JhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsOENBQTJFO0lBQzNFLCtCQUFpQztJQUVqQyxnRUFBMkM7SUFDM0Msb0VBQWlEO0lBQ2pELG1GQUF1RTtJQUV2RSw2REFBNEg7SUFFNUgsMkVBQW1GO0lBQ25GLDJFQUE4RDtJQUU5RCw2REFBa0c7SUFDbEcsaUZBQXVEO0lBRXZELCtEQUF5RDtJQUN6RCxxRUFBNEM7SUFFNUM7Ozs7T0FJRztJQUNIO1FBWUUsc0JBQ0ksU0FBZ0MsRUFBVSxPQUEwQixFQUNwRSxZQUE4QixFQUFFLFVBQXlCOztZQUY3RCxpQkF5RUM7WUF4RTZDLFlBQU8sR0FBUCxPQUFPLENBQW1CO1lBRXRFLElBQU0sWUFBWSxHQUFHLHlCQUFrQixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRXRELFlBQVksQ0FBQyxLQUFLLENBQUMsZ0JBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVwQyw0REFBNEQ7WUFDNUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRTtnQkFDMUMscURBQWdDLEVBQUUsQ0FBQzthQUNwQztZQUVELElBQUksQ0FBQyxzQkFBc0IsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDO1lBRW5FLElBQU0sWUFBWSxHQUFHLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUM5RCxJQUFJLENBQUMsSUFBSSxHQUFHLHFCQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksYUFBWixZQUFZLGNBQVosWUFBWSxHQUFJLElBQUksQ0FBQyxDQUFDO1lBRXhGLElBQUksWUFB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QUFTLGdCQUFnQixDQUFDLFdBQTRCOztRQUNwRCxJQUFNLFdBQVcsR0FBb0IsRUFBRSxDQUFDO1FBQ3hDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFNLFlBQVksR0FBYSxFQUFFLENBQUM7O1lBQ2xDLEtBQWlCLElBQUEsZ0JBQUEsaUJBQUEsV0FBVyxDQUFBLHdDQUFBLGlFQUFFO2dCQUF6QixJQUFNLEVBQUUsd0JBQUE7Z0JBQ1gsV0FBVyxDQUFDLElBQUksT0FBaEIsV0FBVywyQ0FBUyxFQUFFLENBQUMsV0FBVyxJQUFFO2dCQUNwQyxXQUFXLEdBQUcsV0FBVyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUM7Z0JBQzVDLFlBQVksQ0FBQyxJQUFJLE9BQWpCLFlBQVksMkNBQVMsQ0FBQyxFQUFFLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxJQUFFO2FBQy9DOzs7Ozs7Ozs7UUFFRCxPQUFPLEVBQUMsV0FBVyxhQUFBLEVBQUUsV0FBVyxhQUFBLEVBQUUsWUFBWSxjQUFBLEVBQUMsQ0FBQztJQUNsRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7R2VuZXJhdGVkRmlsZSwgSHRtbFBhcnNlciwgTWVzc2FnZUJ1bmRsZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCAqIGFzIGFwaSBmcm9tICcuLi90cmFuc2Zvcm1lcnMvYXBpJztcbmltcG9ydCB7aTE4bkV4dHJhY3R9IGZyb20gJy4uL3RyYW5zZm9ybWVycy9pMThuJztcbmltcG9ydCB7dmVyaWZ5U3VwcG9ydGVkVHlwZVNjcmlwdFZlcnNpb259IGZyb20gJy4uL3R5cGVzY3JpcHRfc3VwcG9ydCc7XG5cbmltcG9ydCB7Q29tcGlsYXRpb25UaWNrZXQsIGZyZXNoQ29tcGlsYXRpb25UaWNrZXQsIGluY3JlbWVudGFsRnJvbUNvbXBpbGVyVGlja2V0LCBOZ0NvbXBpbGVyLCBOZ0NvbXBpbGVySG9zdH0gZnJvbSAnLi9jb3JlJztcbmltcG9ydCB7TmdDb21waWxlck9wdGlvbnN9IGZyb20gJy4vY29yZS9hcGknO1xuaW1wb3J0IHthYnNvbHV0ZUZyb20sIEFic29sdXRlRnNQYXRoLCBnZXRGaWxlU3lzdGVtLCByZXNvbHZlfSBmcm9tICcuL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7VHJhY2tlZEluY3JlbWVudGFsQnVpbGRTdHJhdGVneX0gZnJvbSAnLi9pbmNyZW1lbnRhbCc7XG5pbXBvcnQge0luZGV4ZWRDb21wb25lbnR9IGZyb20gJy4vaW5kZXhlcic7XG5pbXBvcnQge0FjdGl2ZVBlcmZSZWNvcmRlciwgUGVyZkNoZWNrcG9pbnQgYXMgUGVyZkNoZWNrcG9pbnQsIFBlcmZFdmVudCwgUGVyZlBoYXNlfSBmcm9tICcuL3BlcmYnO1xuaW1wb3J0IHtUc0NyZWF0ZVByb2dyYW1Ecml2ZXJ9IGZyb20gJy4vcHJvZ3JhbV9kcml2ZXInO1xuaW1wb3J0IHtEZWNsYXJhdGlvbk5vZGV9IGZyb20gJy4vcmVmbGVjdGlvbic7XG5pbXBvcnQge3JldGFnQWxsVHNGaWxlcywgdW50YWdBbGxUc0ZpbGVzfSBmcm9tICcuL3NoaW1zJztcbmltcG9ydCB7T3B0aW1pemVGb3J9IGZyb20gJy4vdHlwZWNoZWNrL2FwaSc7XG5cbi8qKlxuICogRW50cnlwb2ludCB0byB0aGUgQW5ndWxhciBDb21waWxlciAoSXZ5Kykgd2hpY2ggc2l0cyBiZWhpbmQgdGhlIGBhcGkuUHJvZ3JhbWAgaW50ZXJmYWNlLCBhbGxvd2luZ1xuICogaXQgdG8gYmUgYSBkcm9wLWluIHJlcGxhY2VtZW50IGZvciB0aGUgbGVnYWN5IFZpZXcgRW5naW5lIGNvbXBpbGVyIHRvIHRvb2xpbmcgc3VjaCBhcyB0aGVcbiAqIGNvbW1hbmQtbGluZSBtYWluKCkgZnVuY3Rpb24gb3IgdGhlIEFuZ3VsYXIgQ0xJLlxuICovXG5leHBvcnQgY2xhc3MgTmd0c2NQcm9ncmFtIGltcGxlbWVudHMgYXBpLlByb2dyYW0ge1xuICByZWFkb25seSBjb21waWxlcjogTmdDb21waWxlcjtcblxuICAvKipcbiAgICogVGhlIHByaW1hcnkgVHlwZVNjcmlwdCBwcm9ncmFtLCB3aGljaCBpcyB1c2VkIGZvciBhbmFseXNpcyBhbmQgZW1pdC5cbiAgICovXG4gIHByaXZhdGUgdHNQcm9ncmFtOiB0cy5Qcm9ncmFtO1xuXG4gIHByaXZhdGUgY2xvc3VyZUNvbXBpbGVyRW5hYmxlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBob3N0OiBOZ0NvbXBpbGVySG9zdDtcbiAgcHJpdmF0ZSBpbmNyZW1lbnRhbFN0cmF0ZWd5OiBUcmFja2VkSW5jcmVtZW50YWxCdWlsZFN0cmF0ZWd5O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcm9vdE5hbWVzOiBSZWFkb25seUFycmF5PHN0cmluZz4sIHByaXZhdGUgb3B0aW9uczogTmdDb21waWxlck9wdGlvbnMsXG4gICAgICBkZWxlZ2F0ZUhvc3Q6IGFwaS5Db21waWxlckhvc3QsIG9sZFByb2dyYW0/OiBOZ3RzY1Byb2dyYW0pIHtcbiAgICBjb25zdCBwZXJmUmVjb3JkZXIgPSBBY3RpdmVQZXJmUmVjb3JkZXIuemVyb2VkVG9Ob3coKTtcblxuICAgIHBlcmZSZWNvcmRlci5waGFzZShQZXJmUGhhc2UuU2V0dXApO1xuXG4gICAgLy8gRmlyc3QsIGNoZWNrIHdoZXRoZXIgdGhlIGN1cnJlbnQgVFMgdmVyc2lvbiBpcyBzdXBwb3J0ZWQuXG4gICAgaWYgKCFvcHRpb25zLmRpc2FibGVUeXBlU2NyaXB0VmVyc2lvbkNoZWNrKSB7XG4gICAgICB2ZXJpZnlTdXBwb3J0ZWRUeXBlU2NyaXB0VmVyc2lvbigpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc3VyZUNvbXBpbGVyRW5hYmxlZCA9ICEhb3B0aW9ucy5hbm5vdGF0ZUZvckNsb3N1cmVDb21waWxlcjtcblxuICAgIGNvbnN0IHJldXNlUHJvZ3JhbSA9IG9sZFByb2dyYW0/LmNvbXBpbGVyLmdldEN1cnJlbnRQcm9ncmFtKCk7XG4gICAgdGhpcy5ob3N0ID0gTmdDb21waWxlckhvc3Qud3JhcChkZWxlZ2F0ZUhvc3QsIHJvb3ROYW1lcywgb3B0aW9ucywgcmV1c2VQcm9ncmFtID8/IG51bGwpO1xuXG4gICAgaWYgKHJldXNlUHJvZ3JhbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBQcmlvciB0byByZXVzaW5nIHRoZSBvbGQgcHJvZ3JhbSwgcmVzdG9yZSBzaGltIHRhZ2dpbmcgZm9yIGFsbCBpdHMgYHRzLlNvdXJjZUZpbGVgcy5cbiAgICAgIC8vIFR5cGVTY3JpcHQgY2hlY2tzIHRoZSBgcmVmZXJlbmNlZEZpbGVzYCBvZiBgdHMuU291cmNlRmlsZWBzIGZvciBjaGFuZ2VzIHdoZW4gZXZhbHVhdGluZ1xuICAgICAgLy8gaW5jcmVtZW50YWwgcmV1c2Ugb2YgZGF0YSBmcm9tIHRoZSBvbGQgcHJvZ3JhbSwgc28gaXQncyBpbXBvcnRhbnQgdGhhdCB0aGVzZSBtYXRjaCBpbiBvcmRlclxuICAgICAgLy8gdG8gZ2V0IHRoZSBtb3N0IGJlbmVmaXQgb3V0IG9mIHJldXNlLlxuICAgICAgcmV0YWdBbGxUc0ZpbGVzKHJldXNlUHJvZ3JhbSk7XG4gICAgfVxuXG4gICAgdGhpcy50c1Byb2dyYW0gPSBwZXJmUmVjb3JkZXIuaW5QaGFzZShcbiAgICAgICAgUGVyZlBoYXNlLlR5cGVTY3JpcHRQcm9ncmFtQ3JlYXRlLFxuICAgICAgICAoKSA9PiB0cy5jcmVhdGVQcm9ncmFtKHRoaXMuaG9zdC5pbnB1dEZpbGVzLCBvcHRpb25zLCB0aGlzLmhvc3QsIHJldXNlUHJvZ3JhbSkpO1xuXG4gICAgcGVyZlJlY29yZGVyLnBoYXNlKFBlcmZQaGFzZS5VbmFjY291bnRlZCk7XG4gICAgcGVyZlJlY29yZGVyLm1lbW9yeShQZXJmQ2hlY2twb2ludC5UeXBlU2NyaXB0UHJvZ3JhbUNyZWF0ZSk7XG5cbiAgICB0aGlzLmhvc3QucG9zdFByb2dyYW1DcmVhdGlvbkNsZWFudXAoKTtcblxuICAgIC8vIFNoaW0gdGFnZ2luZyBoYXMgc2VydmVkIGl0cyBwdXJwb3NlLCBhbmQgdGFncyBjYW4gbm93IGJlIHJlbW92ZWQgZnJvbSBhbGwgYHRzLlNvdXJjZUZpbGVgcyBpblxuICAgIC8vIHRoZSBwcm9ncmFtLlxuICAgIHVudGFnQWxsVHNGaWxlcyh0aGlzLnRzUHJvZ3JhbSk7XG5cbiAgICBjb25zdCBwcm9ncmFtRHJpdmVyID0gbmV3IFRzQ3JlYXRlUHJvZ3JhbURyaXZlcihcbiAgICAgICAgdGhpcy50c1Byb2dyYW0sIHRoaXMuaG9zdCwgdGhpcy5vcHRpb25zLCB0aGlzLmhvc3Quc2hpbUV4dGVuc2lvblByZWZpeGVzKTtcblxuICAgIHRoaXMuaW5jcmVtZW50YWxTdHJhdGVneSA9IG9sZFByb2dyYW0gIT09IHVuZGVmaW5lZCA/XG4gICAgICAgIG9sZFByb2dyYW0uaW5jcmVtZW50YWxTdHJhdGVneS50b05leHRCdWlsZFN0cmF0ZWd5KCkgOlxuICAgICAgICBuZXcgVHJhY2tlZEluY3JlbWVudGFsQnVpbGRTdHJhdGVneSgpO1xuICAgIGNvbnN0IG1vZGlmaWVkUmVzb3VyY2VGaWxlcyA9IG5ldyBTZXQ8QWJzb2x1dGVGc1BhdGg+KCk7XG4gICAgaWYgKHRoaXMuaG9zdC5nZXRNb2RpZmllZFJlc291cmNlRmlsZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3Qgc3RyaW5ncyA9IHRoaXMuaG9zdC5nZXRNb2RpZmllZFJlc291cmNlRmlsZXMoKTtcbiAgICAgIGlmIChzdHJpbmdzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlU3RyaW5nIG9mIHN0cmluZ3MpIHtcbiAgICAgICAgICBtb2RpZmllZFJlc291cmNlRmlsZXMuYWRkKGFic29sdXRlRnJvbShmaWxlU3RyaW5nKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdGlja2V0OiBDb21waWxhdGlvblRpY2tldDtcbiAgICBpZiAob2xkUHJvZ3JhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aWNrZXQgPSBmcmVzaENvbXBpbGF0aW9uVGlja2V0KFxuICAgICAgICAgIHRoaXMudHNQcm9ncmFtLCBvcHRpb25zLCB0aGlzLmluY3JlbWVudGFsU3RyYXRlZ3ksIHByb2dyYW1Ecml2ZXIsIHBlcmZSZWNvcmRlcixcbiAgICAgICAgICAvKiBlbmFibGVUZW1wbGF0ZVR5cGVDaGVja2VyICovIGZhbHNlLCAvKiB1c2VQb2lzb25lZERhdGEgKi8gZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aWNrZXQgPSBpbmNyZW1lbnRhbEZyb21Db21waWxlclRpY2tldChcbiAgICAgICAgICBvbGRQcm9ncmFtLmNvbXBpbGVyLFxuICAgICAgICAgIHRoaXMudHNQcm9ncmFtLFxuICAgICAgICAgIHRoaXMuaW5jcmVtZW50YWxTdHJhdGVneSxcbiAgICAgICAgICBwcm9ncmFtRHJpdmVyLFxuICAgICAgICAgIG1vZGlmaWVkUmVzb3VyY2VGaWxlcyxcbiAgICAgICAgICBwZXJmUmVjb3JkZXIsXG4gICAgICApO1xuICAgIH1cblxuXG4gICAgLy8gQ3JlYXRlIHRoZSBOZ0NvbXBpbGVyIHdoaWNoIHdpbGwgZHJpdmUgdGhlIHJlc3Qgb2YgdGhlIGNvbXBpbGF0aW9uLlxuICAgIHRoaXMuY29tcGlsZXIgPSBOZ0NvbXBpbGVyLmZyb21UaWNrZXQodGlja2V0LCB0aGlzLmhvc3QpO1xuICB9XG5cbiAgZ2V0VHNQcm9ncmFtKCk6IHRzLlByb2dyYW0ge1xuICAgIHJldHVybiB0aGlzLnRzUHJvZ3JhbTtcbiAgfVxuXG4gIGdldFJldXNlVHNQcm9ncmFtKCk6IHRzLlByb2dyYW0ge1xuICAgIHJldHVybiB0aGlzLmNvbXBpbGVyLmdldEN1cnJlbnRQcm9ncmFtKCk7XG4gIH1cblxuICBnZXRUc09wdGlvbkRpYWdub3N0aWNzKGNhbmNlbGxhdGlvblRva2VuPzogdHMuQ2FuY2VsbGF0aW9uVG9rZW58XG4gICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTogcmVhZG9ubHkgdHMuRGlhZ25vc3RpY1tdIHtcbiAgICByZXR1cm4gdGhpcy5jb21waWxlci5wZXJmUmVjb3JkZXIuaW5QaGFzZShcbiAgICAgICAgUGVyZlBoYXNlLlR5cGVTY3JpcHREaWFnbm9zdGljcyxcbiAgICAgICAgKCkgPT4gdGhpcy50c1Byb2dyYW0uZ2V0T3B0aW9uc0RpYWdub3N0aWNzKGNhbmNlbGxhdGlvblRva2VuKSk7XG4gIH1cblxuICBnZXRUc1N5bnRhY3RpY0RpYWdub3N0aWNzKFxuICAgICAgc291cmNlRmlsZT86IHRzLlNvdXJjZUZpbGV8dW5kZWZpbmVkLFxuICAgICAgY2FuY2VsbGF0aW9uVG9rZW4/OiB0cy5DYW5jZWxsYXRpb25Ub2tlbnx1bmRlZmluZWQpOiByZWFkb25seSB0cy5EaWFnbm9zdGljW10ge1xuICAgIHJldHVybiB0aGlzLmNvbXBpbGVyLnBlcmZSZWNvcmRlci5pblBoYXNlKFBlcmZQaGFzZS5UeXBlU2NyaXB0RGlhZ25vc3RpY3MsICgpID0+IHtcbiAgICAgIGNvbnN0IGlnbm9yZWRGaWxlcyA9IHRoaXMuY29tcGlsZXIuaWdub3JlRm9yRGlhZ25vc3RpY3M7XG4gICAgICBsZXQgcmVzOiByZWFkb25seSB0cy5EaWFnbm9zdGljW107XG4gICAgICBpZiAoc291cmNlRmlsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChpZ25vcmVkRmlsZXMuaGFzKHNvdXJjZUZpbGUpKSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzID0gdGhpcy50c1Byb2dyYW0uZ2V0U3ludGFjdGljRGlhZ25vc3RpY3Moc291cmNlRmlsZSwgY2FuY2VsbGF0aW9uVG9rZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGlhZ25vc3RpY3M6IHRzLkRpYWdub3N0aWNbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHNmIG9mIHRoaXMudHNQcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkpIHtcbiAgICAgICAgICBpZiAoIWlnbm9yZWRGaWxlcy5oYXMoc2YpKSB7XG4gICAgICAgICAgICBkaWFnbm9zdGljcy5wdXNoKC4uLnRoaXMudHNQcm9ncmFtLmdldFN5bnRhY3RpY0RpYWdub3N0aWNzKHNmLCBjYW5jZWxsYXRpb25Ub2tlbikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXMgPSBkaWFnbm9zdGljcztcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfSk7XG4gIH1cblxuICBnZXRUc1NlbWFudGljRGlhZ25vc3RpY3MoXG4gICAgICBzb3VyY2VGaWxlPzogdHMuU291cmNlRmlsZXx1bmRlZmluZWQsXG4gICAgICBjYW5jZWxsYXRpb25Ub2tlbj86IHRzLkNhbmNlbGxhdGlvblRva2VufHVuZGVmaW5lZCk6IHJlYWRvbmx5IHRzLkRpYWdub3N0aWNbXSB7XG4gICAgcmV0dXJuIHRoaXMuY29tcGlsZXIucGVyZlJlY29yZGVyLmluUGhhc2UoUGVyZlBoYXNlLlR5cGVTY3JpcHREaWFnbm9zdGljcywgKCkgPT4ge1xuICAgICAgY29uc3QgaWdub3JlZEZpbGVzID0gdGhpcy5jb21waWxlci5pZ25vcmVGb3JEaWFnbm9zdGljcztcbiAgICAgIGxldCByZXM6IHJlYWRvbmx5IHRzLkRpYWdub3N0aWNbXTtcbiAgICAgIGlmIChzb3VyY2VGaWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGlnbm9yZWRGaWxlcy5oYXMoc291cmNlRmlsZSkpIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXMgPSB0aGlzLnRzUHJvZ3JhbS5nZXRTZW1hbnRpY0RpYWdub3N0aWNzKHNvdXJjZUZpbGUsIGNhbmNlbGxhdGlvblRva2VuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRpYWdub3N0aWNzOiB0cy5EaWFnbm9zdGljW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBzZiBvZiB0aGlzLnRzUHJvZ3JhbS5nZXRTb3VyY2VGaWxlcygpKSB7XG4gICAgICAgICAgaWYgKCFpZ25vcmVkRmlsZXMuaGFzKHNmKSkge1xuICAgICAgICAgICAgZGlhZ25vc3RpY3MucHVzaCguLi50aGlzLnRzUHJvZ3JhbS5nZXRTZW1hbnRpY0RpYWdub3N0aWNzKHNmLCBjYW5jZWxsYXRpb25Ub2tlbikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXMgPSBkaWFnbm9zdGljcztcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfSk7XG4gIH1cblxuICBnZXROZ09wdGlvbkRpYWdub3N0aWNzKGNhbmNlbGxhdGlvblRva2VuPzogdHMuQ2FuY2VsbGF0aW9uVG9rZW58XG4gICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTogcmVhZG9ubHkodHMuRGlhZ25vc3RpY3xhcGkuRGlhZ25vc3RpYylbXSB7XG4gICAgcmV0dXJuIHRoaXMuY29tcGlsZXIuZ2V0T3B0aW9uRGlhZ25vc3RpY3MoKTtcbiAgfVxuXG4gIGdldE5nU3RydWN0dXJhbERpYWdub3N0aWNzKGNhbmNlbGxhdGlvblRva2VuPzogdHMuQ2FuY2VsbGF0aW9uVG9rZW58XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCk6IHJlYWRvbmx5IGFwaS5EaWFnbm9zdGljW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldE5nU2VtYW50aWNEaWFnbm9zdGljcyhcbiAgICAgIGZpbGVOYW1lPzogc3RyaW5nfHVuZGVmaW5lZCwgY2FuY2VsbGF0aW9uVG9rZW4/OiB0cy5DYW5jZWxsYXRpb25Ub2tlbnx1bmRlZmluZWQpOlxuICAgICAgcmVhZG9ubHkodHMuRGlhZ25vc3RpY3xhcGkuRGlhZ25vc3RpYylbXSB7XG4gICAgbGV0IHNmOiB0cy5Tb3VyY2VGaWxlfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBpZiAoZmlsZU5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc2YgPSB0aGlzLnRzUHJvZ3JhbS5nZXRTb3VyY2VGaWxlKGZpbGVOYW1lKTtcbiAgICAgIGlmIChzZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFRoZXJlIGFyZSBubyBkaWFnbm9zdGljcyBmb3IgZmlsZXMgd2hpY2ggZG9uJ3QgZXhpc3QgaW4gdGhlIHByb2dyYW0gLSBtYXliZSB0aGUgY2FsbGVyXG4gICAgICAgIC8vIGhhcyBzdGFsZSBkYXRhP1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNmID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbXBpbGVyLmdldERpYWdub3N0aWNzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbXBpbGVyLmdldERpYWdub3N0aWNzRm9yRmlsZShzZiwgT3B0aW1pemVGb3IuV2hvbGVQcm9ncmFtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlIHRoYXQgdGhlIGBOZ0NvbXBpbGVyYCBoYXMgcHJvcGVybHkgYW5hbHl6ZWQgdGhlIHByb2dyYW0sIGFuZCBhbGxvdyBmb3IgdGhlIGFzeW5jaHJvbm91c1xuICAgKiBsb2FkaW5nIG9mIGFueSByZXNvdXJjZXMgZHVyaW5nIHRoZSBwcm9jZXNzLlxuICAgKlxuICAgKiBUaGlzIGlzIHVzZWQgYnkgdGhlIEFuZ3VsYXIgQ0xJIHRvIGFsbG93IGZvciBzcGF3bmluZyAoYXN5bmMpIGNoaWxkIGNvbXBpbGF0aW9ucyBmb3IgdGhpbmdzXG4gICAqIGxpa2UgU0FTUyBmaWxlcyB1c2VkIGluIGBzdHlsZVVybHNgLlxuICAgKi9cbiAgbG9hZE5nU3RydWN0dXJlQXN5bmMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuY29tcGlsZXIuYW5hbHl6ZUFzeW5jKCk7XG4gIH1cblxuICBsaXN0TGF6eVJvdXRlcyhlbnRyeVJvdXRlPzogc3RyaW5nfHVuZGVmaW5lZCk6IGFwaS5MYXp5Um91dGVbXSB7XG4gICAgcmV0dXJuIHRoaXMuY29tcGlsZXIubGlzdExhenlSb3V0ZXMoZW50cnlSb3V0ZSk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRYaTE4bigpOiB2b2lkIHtcbiAgICBjb25zdCBjdHggPSBuZXcgTWVzc2FnZUJ1bmRsZShuZXcgSHRtbFBhcnNlcigpLCBbXSwge30sIHRoaXMub3B0aW9ucy5pMThuT3V0TG9jYWxlID8/IG51bGwpO1xuICAgIHRoaXMuY29tcGlsZXIueGkxOG4oY3R4KTtcbiAgICBpMThuRXh0cmFjdChcbiAgICAgICAgdGhpcy5vcHRpb25zLmkxOG5PdXRGb3JtYXQgPz8gbnVsbCwgdGhpcy5vcHRpb25zLmkxOG5PdXRGaWxlID8/IG51bGwsIHRoaXMuaG9zdCxcbiAgICAgICAgdGhpcy5vcHRpb25zLCBjdHgsIHJlc29sdmUpO1xuICB9XG5cbiAgZW1pdChvcHRzPzoge1xuICAgIGVtaXRGbGFncz86IGFwaS5FbWl0RmxhZ3N8dW5kZWZpbmVkO1xuICAgIGNhbmNlbGxhdGlvblRva2VuPzogdHMuQ2FuY2VsbGF0aW9uVG9rZW4gfCB1bmRlZmluZWQ7XG4gICAgY3VzdG9tVHJhbnNmb3JtZXJzPzogYXBpLkN1c3RvbVRyYW5zZm9ybWVycyB8IHVuZGVmaW5lZDtcbiAgICBlbWl0Q2FsbGJhY2s/OiBhcGkuVHNFbWl0Q2FsbGJhY2sgfCB1bmRlZmluZWQ7XG4gICAgbWVyZ2VFbWl0UmVzdWx0c0NhbGxiYWNrPzogYXBpLlRzTWVyZ2VFbWl0UmVzdWx0c0NhbGxiYWNrIHwgdW5kZWZpbmVkO1xuICB9fHVuZGVmaW5lZCk6IHRzLkVtaXRSZXN1bHQge1xuICAgIC8vIENoZWNrIGlmIGVtaXNzaW9uIG9mIHRoZSBpMThuIG1lc3NhZ2VzIGJ1bmRsZSB3YXMgcmVxdWVzdGVkLlxuICAgIGlmIChvcHRzICE9PSB1bmRlZmluZWQgJiYgb3B0cy5lbWl0RmxhZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBvcHRzLmVtaXRGbGFncyAmIGFwaS5FbWl0RmxhZ3MuSTE4bkJ1bmRsZSkge1xuICAgICAgdGhpcy5lbWl0WGkxOG4oKTtcblxuICAgICAgLy8gYGFwaS5FbWl0RmxhZ3NgIGlzIGEgVmlldyBFbmdpbmUgY29tcGlsZXIgY29uY2VwdC4gV2Ugb25seSBwYXkgYXR0ZW50aW9uIHRvIHRoZSBhYnNlbmNlIG9mXG4gICAgICAvLyB0aGUgb3RoZXIgZmxhZ3MgaGVyZSBpZiBpMThuIGVtaXQgd2FzIHJlcXVlc3RlZCAoc2luY2UgdGhpcyBpcyB1c3VhbGx5IGRvbmUgaW4gdGhlIHhpMThuXG4gICAgICAvLyBmbG93LCB3aGVyZSB3ZSBkb24ndCB3YW50IHRvIGVtaXQgSlMgYXQgYWxsKS5cbiAgICAgIGlmICghKG9wdHMuZW1pdEZsYWdzICYgYXBpLkVtaXRGbGFncy5KUykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBkaWFnbm9zdGljczogW10sXG4gICAgICAgICAgZW1pdFNraXBwZWQ6IHRydWUsXG4gICAgICAgICAgZW1pdHRlZEZpbGVzOiBbXSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbXBpbGVyLnBlcmZSZWNvcmRlci5tZW1vcnkoUGVyZkNoZWNrcG9pbnQuUHJlRW1pdCk7XG5cbiAgICBjb25zdCByZXMgPSB0aGlzLmNvbXBpbGVyLnBlcmZSZWNvcmRlci5pblBoYXNlKFBlcmZQaGFzZS5UeXBlU2NyaXB0RW1pdCwgKCkgPT4ge1xuICAgICAgY29uc3Qge3RyYW5zZm9ybWVyc30gPSB0aGlzLmNvbXBpbGVyLnByZXBhcmVFbWl0KCk7XG4gICAgICBjb25zdCBpZ25vcmVGaWxlcyA9IHRoaXMuY29tcGlsZXIuaWdub3JlRm9yRW1pdDtcbiAgICAgIGNvbnN0IGVtaXRDYWxsYmFjayA9IG9wdHMgJiYgb3B0cy5lbWl0Q2FsbGJhY2sgfHwgZGVmYXVsdEVtaXRDYWxsYmFjaztcblxuICAgICAgY29uc3Qgd3JpdGVGaWxlOiB0cy5Xcml0ZUZpbGVDYWxsYmFjayA9XG4gICAgICAgICAgKGZpbGVOYW1lOiBzdHJpbmcsIGRhdGE6IHN0cmluZywgd3JpdGVCeXRlT3JkZXJNYXJrOiBib29sZWFuLFxuICAgICAgICAgICBvbkVycm9yOiAoKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCl8dW5kZWZpbmVkLFxuICAgICAgICAgICBzb3VyY2VGaWxlczogUmVhZG9ubHlBcnJheTx0cy5Tb3VyY2VGaWxlPnx1bmRlZmluZWQpID0+IHtcbiAgICAgICAgICAgIGlmIChzb3VyY2VGaWxlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIC8vIFJlY29yZCBzdWNjZXNzZnVsIHdyaXRlcyBmb3IgYW55IGB0cy5Tb3VyY2VGaWxlYCAodGhhdCdzIG5vdCBhIGRlY2xhcmF0aW9uIGZpbGUpXG4gICAgICAgICAgICAgIC8vIHRoYXQncyBhbiBpbnB1dCB0byB0aGlzIHdyaXRlLlxuICAgICAgICAgICAgICBmb3IgKGNvbnN0IHdyaXR0ZW5TZiBvZiBzb3VyY2VGaWxlcykge1xuICAgICAgICAgICAgICAgIGlmICh3cml0dGVuU2YuaXNEZWNsYXJhdGlvbkZpbGUpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGlsZXIuaW5jcmVtZW50YWxDb21waWxhdGlvbi5yZWNvcmRTdWNjZXNzZnVsRW1pdCh3cml0dGVuU2YpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhvc3Qud3JpdGVGaWxlKGZpbGVOYW1lLCBkYXRhLCB3cml0ZUJ5dGVPcmRlck1hcmssIG9uRXJyb3IsIHNvdXJjZUZpbGVzKTtcbiAgICAgICAgICB9O1xuXG4gICAgICBjb25zdCBjdXN0b21UcmFuc2Zvcm1zID0gb3B0cyAmJiBvcHRzLmN1c3RvbVRyYW5zZm9ybWVycztcbiAgICAgIGNvbnN0IGJlZm9yZVRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1lcnMuYmVmb3JlIHx8IFtdO1xuICAgICAgY29uc3QgYWZ0ZXJEZWNsYXJhdGlvbnNUcmFuc2Zvcm1zID0gdHJhbnNmb3JtZXJzLmFmdGVyRGVjbGFyYXRpb25zO1xuXG4gICAgICBpZiAoY3VzdG9tVHJhbnNmb3JtcyAhPT0gdW5kZWZpbmVkICYmIGN1c3RvbVRyYW5zZm9ybXMuYmVmb3JlVHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBiZWZvcmVUcmFuc2Zvcm1zLnB1c2goLi4uY3VzdG9tVHJhbnNmb3Jtcy5iZWZvcmVUcyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVtaXRSZXN1bHRzOiB0cy5FbWl0UmVzdWx0W10gPSBbXTtcblxuICAgICAgZm9yIChjb25zdCB0YXJnZXRTb3VyY2VGaWxlIG9mIHRoaXMudHNQcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkpIHtcbiAgICAgICAgaWYgKHRhcmdldFNvdXJjZUZpbGUuaXNEZWNsYXJhdGlvbkZpbGUgfHwgaWdub3JlRmlsZXMuaGFzKHRhcmdldFNvdXJjZUZpbGUpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb21waWxlci5pbmNyZW1lbnRhbENvbXBpbGF0aW9uLnNhZmVUb1NraXBFbWl0KHRhcmdldFNvdXJjZUZpbGUpKSB7XG4gICAgICAgICAgdGhpcy5jb21waWxlci5wZXJmUmVjb3JkZXIuZXZlbnRDb3VudChQZXJmRXZlbnQuRW1pdFNraXBTb3VyY2VGaWxlKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29tcGlsZXIucGVyZlJlY29yZGVyLmV2ZW50Q291bnQoUGVyZkV2ZW50LkVtaXRTb3VyY2VGaWxlKTtcblxuICAgICAgICBlbWl0UmVzdWx0cy5wdXNoKGVtaXRDYWxsYmFjayh7XG4gICAgICAgICAgdGFyZ2V0U291cmNlRmlsZSxcbiAgICAgICAgICBwcm9ncmFtOiB0aGlzLnRzUHJvZ3JhbSxcbiAgICAgICAgICBob3N0OiB0aGlzLmhvc3QsXG4gICAgICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGVtaXRPbmx5RHRzRmlsZXM6IGZhbHNlLFxuICAgICAgICAgIHdyaXRlRmlsZSxcbiAgICAgICAgICBjdXN0b21UcmFuc2Zvcm1lcnM6IHtcbiAgICAgICAgICAgIGJlZm9yZTogYmVmb3JlVHJhbnNmb3JtcyxcbiAgICAgICAgICAgIGFmdGVyOiBjdXN0b21UcmFuc2Zvcm1zICYmIGN1c3RvbVRyYW5zZm9ybXMuYWZ0ZXJUcyxcbiAgICAgICAgICAgIGFmdGVyRGVjbGFyYXRpb25zOiBhZnRlckRlY2xhcmF0aW9uc1RyYW5zZm9ybXMsXG4gICAgICAgICAgfSBhcyBhbnksXG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb21waWxlci5wZXJmUmVjb3JkZXIubWVtb3J5KFBlcmZDaGVja3BvaW50LkVtaXQpO1xuXG4gICAgICAvLyBSdW4gdGhlIGVtaXQsIGluY2x1ZGluZyBhIGN1c3RvbSB0cmFuc2Zvcm1lciB0aGF0IHdpbGwgZG93bmxldmVsIHRoZSBJdnkgZGVjb3JhdG9ycyBpblxuICAgICAgLy8gY29kZS5cbiAgICAgIHJldHVybiAoKG9wdHMgJiYgb3B0cy5tZXJnZUVtaXRSZXN1bHRzQ2FsbGJhY2spIHx8IG1lcmdlRW1pdFJlc3VsdHMpKGVtaXRSZXN1bHRzKTtcbiAgICB9KTtcblxuICAgIC8vIFJlY29yZCBwZXJmb3JtYW5jZSBhbmFseXNpcyBpbmZvcm1hdGlvbiB0byBkaXNrIGlmIHdlJ3ZlIGJlZW4gYXNrZWQgdG8gZG8gc28uXG4gICAgaWYgKHRoaXMub3B0aW9ucy50cmFjZVBlcmZvcm1hbmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHBlcmYgPSB0aGlzLmNvbXBpbGVyLnBlcmZSZWNvcmRlci5maW5hbGl6ZSgpO1xuICAgICAgZ2V0RmlsZVN5c3RlbSgpLndyaXRlRmlsZShcbiAgICAgICAgICBnZXRGaWxlU3lzdGVtKCkucmVzb2x2ZSh0aGlzLm9wdGlvbnMudHJhY2VQZXJmb3JtYW5jZSksIEpTT04uc3RyaW5naWZ5KHBlcmYsIG51bGwsIDIpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGdldEluZGV4ZWRDb21wb25lbnRzKCk6IE1hcDxEZWNsYXJhdGlvbk5vZGUsIEluZGV4ZWRDb21wb25lbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5jb21waWxlci5nZXRJbmRleGVkQ29tcG9uZW50cygpO1xuICB9XG5cbiAgZ2V0TGlicmFyeVN1bW1hcmllcygpOiBNYXA8c3RyaW5nLCBhcGkuTGlicmFyeVN1bW1hcnk+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gIH1cblxuICBnZXRFbWl0dGVkR2VuZXJhdGVkRmlsZXMoKTogTWFwPHN0cmluZywgR2VuZXJhdGVkRmlsZT4ge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgfVxuXG4gIGdldEVtaXR0ZWRTb3VyY2VGaWxlcygpOiBNYXA8c3RyaW5nLCB0cy5Tb3VyY2VGaWxlPiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpO1xuICB9XG59XG5cbmNvbnN0IGRlZmF1bHRFbWl0Q2FsbGJhY2s6IGFwaS5Uc0VtaXRDYWxsYmFjayA9ICh7XG4gIHByb2dyYW0sXG4gIHRhcmdldFNvdXJjZUZpbGUsXG4gIHdyaXRlRmlsZSxcbiAgY2FuY2VsbGF0aW9uVG9rZW4sXG4gIGVtaXRPbmx5RHRzRmlsZXMsXG4gIGN1c3RvbVRyYW5zZm9ybWVyc1xufSkgPT5cbiAgICBwcm9ncmFtLmVtaXQoXG4gICAgICAgIHRhcmdldFNvdXJjZUZpbGUsIHdyaXRlRmlsZSwgY2FuY2VsbGF0aW9uVG9rZW4sIGVtaXRPbmx5RHRzRmlsZXMsIGN1c3RvbVRyYW5zZm9ybWVycyk7XG5cbmZ1bmN0aW9uIG1lcmdlRW1pdFJlc3VsdHMoZW1pdFJlc3VsdHM6IHRzLkVtaXRSZXN1bHRbXSk6IHRzLkVtaXRSZXN1bHQge1xuICBjb25zdCBkaWFnbm9zdGljczogdHMuRGlhZ25vc3RpY1tdID0gW107XG4gIGxldCBlbWl0U2tpcHBlZCA9IGZhbHNlO1xuICBjb25zdCBlbWl0dGVkRmlsZXM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgZXIgb2YgZW1pdFJlc3VsdHMpIHtcbiAgICBkaWFnbm9zdGljcy5wdXNoKC4uLmVyLmRpYWdub3N0aWNzKTtcbiAgICBlbWl0U2tpcHBlZCA9IGVtaXRTa2lwcGVkIHx8IGVyLmVtaXRTa2lwcGVkO1xuICAgIGVtaXR0ZWRGaWxlcy5wdXNoKC4uLihlci5lbWl0dGVkRmlsZXMgfHwgW10pKTtcbiAgfVxuXG4gIHJldHVybiB7ZGlhZ25vc3RpY3MsIGVtaXRTa2lwcGVkLCBlbWl0dGVkRmlsZXN9O1xufVxuIl19