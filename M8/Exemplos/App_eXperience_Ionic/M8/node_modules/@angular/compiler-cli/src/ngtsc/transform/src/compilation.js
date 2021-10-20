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
        define("@angular/compiler-cli/src/ngtsc/transform/src/compilation", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/perf", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/transform/src/api", "@angular/compiler-cli/src/ngtsc/transform/src/trait"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraitCompiler = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var perf_1 = require("@angular/compiler-cli/src/ngtsc/perf");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var api_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/api");
    var trait_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/trait");
    /**
     * The heart of Angular compilation.
     *
     * The `TraitCompiler` is responsible for processing all classes in the program. Any time a
     * `DecoratorHandler` matches a class, a "trait" is created to represent that Angular aspect of the
     * class (such as the class having a component definition).
     *
     * The `TraitCompiler` transitions each trait through the various phases of compilation, culminating
     * in the production of `CompileResult`s instructing the compiler to apply various mutations to the
     * class (like adding fields or type declarations).
     */
    var TraitCompiler = /** @class */ (function () {
        function TraitCompiler(handlers, reflector, perf, incrementalBuild, compileNonExportedClasses, compilationMode, dtsTransforms, semanticDepGraphUpdater) {
            var e_1, _a;
            this.handlers = handlers;
            this.reflector = reflector;
            this.perf = perf;
            this.incrementalBuild = incrementalBuild;
            this.compileNonExportedClasses = compileNonExportedClasses;
            this.compilationMode = compilationMode;
            this.dtsTransforms = dtsTransforms;
            this.semanticDepGraphUpdater = semanticDepGraphUpdater;
            /**
             * Maps class declarations to their `ClassRecord`, which tracks the Ivy traits being applied to
             * those classes.
             */
            this.classes = new Map();
            /**
             * Maps source files to any class declaration(s) within them which have been discovered to contain
             * Ivy traits.
             */
            this.fileToClasses = new Map();
            /**
             * Tracks which source files have been analyzed but did not contain any traits. This set allows
             * the compiler to skip analyzing these files in an incremental rebuild.
             */
            this.filesWithoutTraits = new Set();
            this.reexportMap = new Map();
            this.handlersByName = new Map();
            try {
                for (var handlers_1 = tslib_1.__values(handlers), handlers_1_1 = handlers_1.next(); !handlers_1_1.done; handlers_1_1 = handlers_1.next()) {
                    var handler = handlers_1_1.value;
                    this.handlersByName.set(handler.name, handler);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (handlers_1_1 && !handlers_1_1.done && (_a = handlers_1.return)) _a.call(handlers_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        TraitCompiler.prototype.analyzeSync = function (sf) {
            this.analyze(sf, false);
        };
        TraitCompiler.prototype.analyzeAsync = function (sf) {
            return this.analyze(sf, true);
        };
        TraitCompiler.prototype.analyze = function (sf, preanalyze) {
            var e_2, _a;
            var _this = this;
            // We shouldn't analyze declaration files.
            if (sf.isDeclarationFile) {
                return undefined;
            }
            // analyze() really wants to return `Promise<void>|void`, but TypeScript cannot narrow a return
            // type of 'void', so `undefined` is used instead.
            var promises = [];
            var priorWork = this.incrementalBuild.priorAnalysisFor(sf);
            if (priorWork !== null) {
                this.perf.eventCount(perf_1.PerfEvent.SourceFileReuseAnalysis);
                if (priorWork.length > 0) {
                    try {
                        for (var priorWork_1 = tslib_1.__values(priorWork), priorWork_1_1 = priorWork_1.next(); !priorWork_1_1.done; priorWork_1_1 = priorWork_1.next()) {
                            var priorRecord = priorWork_1_1.value;
                            this.adopt(priorRecord);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (priorWork_1_1 && !priorWork_1_1.done && (_a = priorWork_1.return)) _a.call(priorWork_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    this.perf.eventCount(perf_1.PerfEvent.TraitReuseAnalysis, priorWork.length);
                }
                else {
                    this.filesWithoutTraits.add(sf);
                }
                // Skip the rest of analysis, as this file's prior traits are being reused.
                return;
            }
            var visit = function (node) {
                if (_this.reflector.isClass(node)) {
                    _this.analyzeClass(node, preanalyze ? promises : null);
                }
                ts.forEachChild(node, visit);
            };
            visit(sf);
            if (preanalyze && promises.length > 0) {
                return Promise.all(promises).then(function () { return undefined; });
            }
            else {
                return undefined;
            }
        };
        TraitCompiler.prototype.recordFor = function (clazz) {
            if (this.classes.has(clazz)) {
                return this.classes.get(clazz);
            }
            else {
                return null;
            }
        };
        TraitCompiler.prototype.recordsFor = function (sf) {
            var e_3, _a;
            if (!this.fileToClasses.has(sf)) {
                return null;
            }
            var records = [];
            try {
                for (var _b = tslib_1.__values(this.fileToClasses.get(sf)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var clazz = _c.value;
                    records.push(this.classes.get(clazz));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return records;
        };
        TraitCompiler.prototype.getAnalyzedRecords = function () {
            var e_4, _a, e_5, _b, e_6, _c;
            var result = new Map();
            try {
                for (var _d = tslib_1.__values(this.fileToClasses), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = tslib_1.__read(_e.value, 2), sf = _f[0], classes = _f[1];
                    var records = [];
                    try {
                        for (var classes_1 = (e_5 = void 0, tslib_1.__values(classes)), classes_1_1 = classes_1.next(); !classes_1_1.done; classes_1_1 = classes_1.next()) {
                            var clazz = classes_1_1.value;
                            records.push(this.classes.get(clazz));
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (classes_1_1 && !classes_1_1.done && (_b = classes_1.return)) _b.call(classes_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    result.set(sf, records);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_4) throw e_4.error; }
            }
            try {
                for (var _g = tslib_1.__values(this.filesWithoutTraits), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var sf = _h.value;
                    result.set(sf, []);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
                }
                finally { if (e_6) throw e_6.error; }
            }
            return result;
        };
        /**
         * Import a `ClassRecord` from a previous compilation.
         *
         * Traits from the `ClassRecord` have accurate metadata, but the `handler` is from the old program
         * and needs to be updated (matching is done by name). A new pending trait is created and then
         * transitioned to analyzed using the previous analysis. If the trait is in the errored state,
         * instead the errors are copied over.
         */
        TraitCompiler.prototype.adopt = function (priorRecord) {
            var e_7, _a;
            var record = {
                hasPrimaryHandler: priorRecord.hasPrimaryHandler,
                hasWeakHandlers: priorRecord.hasWeakHandlers,
                metaDiagnostics: priorRecord.metaDiagnostics,
                node: priorRecord.node,
                traits: [],
            };
            try {
                for (var _b = tslib_1.__values(priorRecord.traits), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var priorTrait = _c.value;
                    var handler = this.handlersByName.get(priorTrait.handler.name);
                    var trait = trait_1.Trait.pending(handler, priorTrait.detected);
                    if (priorTrait.state === trait_1.TraitState.Analyzed || priorTrait.state === trait_1.TraitState.Resolved) {
                        var symbol = this.makeSymbolForTrait(handler, record.node, priorTrait.analysis);
                        trait = trait.toAnalyzed(priorTrait.analysis, priorTrait.analysisDiagnostics, symbol);
                        if (trait.analysis !== null && trait.handler.register !== undefined) {
                            trait.handler.register(record.node, trait.analysis);
                        }
                    }
                    else if (priorTrait.state === trait_1.TraitState.Skipped) {
                        trait = trait.toSkipped();
                    }
                    record.traits.push(trait);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
            this.classes.set(record.node, record);
            var sf = record.node.getSourceFile();
            if (!this.fileToClasses.has(sf)) {
                this.fileToClasses.set(sf, new Set());
            }
            this.fileToClasses.get(sf).add(record.node);
        };
        TraitCompiler.prototype.scanClassForTraits = function (clazz) {
            if (!this.compileNonExportedClasses && !this.reflector.isStaticallyExported(clazz)) {
                return null;
            }
            var decorators = this.reflector.getDecoratorsOfDeclaration(clazz);
            return this.detectTraits(clazz, decorators);
        };
        TraitCompiler.prototype.detectTraits = function (clazz, decorators) {
            var e_8, _a;
            var record = this.recordFor(clazz);
            var foundTraits = [];
            try {
                for (var _b = tslib_1.__values(this.handlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var handler = _c.value;
                    var result = handler.detect(clazz, decorators);
                    if (result === undefined) {
                        continue;
                    }
                    var isPrimaryHandler = handler.precedence === api_1.HandlerPrecedence.PRIMARY;
                    var isWeakHandler = handler.precedence === api_1.HandlerPrecedence.WEAK;
                    var trait = trait_1.Trait.pending(handler, result);
                    foundTraits.push(trait);
                    if (record === null) {
                        // This is the first handler to match this class. This path is a fast path through which
                        // most classes will flow.
                        record = {
                            node: clazz,
                            traits: [trait],
                            metaDiagnostics: null,
                            hasPrimaryHandler: isPrimaryHandler,
                            hasWeakHandlers: isWeakHandler,
                        };
                        this.classes.set(clazz, record);
                        var sf = clazz.getSourceFile();
                        if (!this.fileToClasses.has(sf)) {
                            this.fileToClasses.set(sf, new Set());
                        }
                        this.fileToClasses.get(sf).add(clazz);
                    }
                    else {
                        // This is at least the second handler to match this class. This is a slower path that some
                        // classes will go through, which validates that the set of decorators applied to the class
                        // is valid.
                        // Validate according to rules as follows:
                        //
                        // * WEAK handlers are removed if a non-WEAK handler matches.
                        // * Only one PRIMARY handler can match at a time. Any other PRIMARY handler matching a
                        //   class with an existing PRIMARY handler is an error.
                        if (!isWeakHandler && record.hasWeakHandlers) {
                            // The current handler is not a WEAK handler, but the class has other WEAK handlers.
                            // Remove them.
                            record.traits =
                                record.traits.filter(function (field) { return field.handler.precedence !== api_1.HandlerPrecedence.WEAK; });
                            record.hasWeakHandlers = false;
                        }
                        else if (isWeakHandler && !record.hasWeakHandlers) {
                            // The current handler is a WEAK handler, but the class has non-WEAK handlers already.
                            // Drop the current one.
                            continue;
                        }
                        if (isPrimaryHandler && record.hasPrimaryHandler) {
                            // The class already has a PRIMARY handler, and another one just matched.
                            record.metaDiagnostics = [{
                                    category: ts.DiagnosticCategory.Error,
                                    code: Number('-99' + diagnostics_1.ErrorCode.DECORATOR_COLLISION),
                                    file: typescript_1.getSourceFile(clazz),
                                    start: clazz.getStart(undefined, false),
                                    length: clazz.getWidth(),
                                    messageText: 'Two incompatible decorators on class',
                                }];
                            record.traits = foundTraits = [];
                            break;
                        }
                        // Otherwise, it's safe to accept the multiple decorators here. Update some of the metadata
                        // regarding this class.
                        record.traits.push(trait);
                        record.hasPrimaryHandler = record.hasPrimaryHandler || isPrimaryHandler;
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_8) throw e_8.error; }
            }
            return foundTraits.length > 0 ? foundTraits : null;
        };
        TraitCompiler.prototype.makeSymbolForTrait = function (handler, decl, analysis) {
            if (analysis === null) {
                return null;
            }
            var symbol = handler.symbol(decl, analysis);
            if (symbol !== null && this.semanticDepGraphUpdater !== null) {
                var isPrimary = handler.precedence === api_1.HandlerPrecedence.PRIMARY;
                if (!isPrimary) {
                    throw new Error("AssertionError: " + handler.name + " returned a symbol but is not a primary handler.");
                }
                this.semanticDepGraphUpdater.registerSymbol(symbol);
            }
            return symbol;
        };
        TraitCompiler.prototype.analyzeClass = function (clazz, preanalyzeQueue) {
            var e_9, _a;
            var _this = this;
            var traits = this.scanClassForTraits(clazz);
            if (traits === null) {
                // There are no Ivy traits on the class, so it can safely be skipped.
                return;
            }
            var _loop_1 = function (trait) {
                var analyze = function () { return _this.analyzeTrait(clazz, trait); };
                var preanalysis = null;
                if (preanalyzeQueue !== null && trait.handler.preanalyze !== undefined) {
                    // Attempt to run preanalysis. This could fail with a `FatalDiagnosticError`; catch it if it
                    // does.
                    try {
                        preanalysis = trait.handler.preanalyze(clazz, trait.detected.metadata) || null;
                    }
                    catch (err) {
                        if (err instanceof diagnostics_1.FatalDiagnosticError) {
                            trait.toAnalyzed(null, [err.toDiagnostic()], null);
                            return { value: void 0 };
                        }
                        else {
                            throw err;
                        }
                    }
                }
                if (preanalysis !== null) {
                    preanalyzeQueue.push(preanalysis.then(analyze));
                }
                else {
                    analyze();
                }
            };
            try {
                for (var traits_1 = tslib_1.__values(traits), traits_1_1 = traits_1.next(); !traits_1_1.done; traits_1_1 = traits_1.next()) {
                    var trait = traits_1_1.value;
                    var state_1 = _loop_1(trait);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (traits_1_1 && !traits_1_1.done && (_a = traits_1.return)) _a.call(traits_1);
                }
                finally { if (e_9) throw e_9.error; }
            }
        };
        TraitCompiler.prototype.analyzeTrait = function (clazz, trait, flags) {
            var _a, _b, _c;
            if (trait.state !== trait_1.TraitState.Pending) {
                throw new Error("Attempt to analyze trait of " + clazz.name.text + " in state " + trait_1.TraitState[trait.state] + " (expected DETECTED)");
            }
            this.perf.eventCount(perf_1.PerfEvent.TraitAnalyze);
            // Attempt analysis. This could fail with a `FatalDiagnosticError`; catch it if it does.
            var result;
            try {
                result = trait.handler.analyze(clazz, trait.detected.metadata, flags);
            }
            catch (err) {
                if (err instanceof diagnostics_1.FatalDiagnosticError) {
                    trait.toAnalyzed(null, [err.toDiagnostic()], null);
                    return;
                }
                else {
                    throw err;
                }
            }
            var symbol = this.makeSymbolForTrait(trait.handler, clazz, (_a = result.analysis) !== null && _a !== void 0 ? _a : null);
            if (result.analysis !== undefined && trait.handler.register !== undefined) {
                trait.handler.register(clazz, result.analysis);
            }
            trait = trait.toAnalyzed((_b = result.analysis) !== null && _b !== void 0 ? _b : null, (_c = result.diagnostics) !== null && _c !== void 0 ? _c : null, symbol);
        };
        TraitCompiler.prototype.resolve = function () {
            var e_10, _a, e_11, _b, e_12, _c;
            var _d, _e;
            var classes = Array.from(this.classes.keys());
            try {
                for (var classes_2 = tslib_1.__values(classes), classes_2_1 = classes_2.next(); !classes_2_1.done; classes_2_1 = classes_2.next()) {
                    var clazz = classes_2_1.value;
                    var record = this.classes.get(clazz);
                    try {
                        for (var _f = (e_11 = void 0, tslib_1.__values(record.traits)), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var trait = _g.value;
                            var handler = trait.handler;
                            switch (trait.state) {
                                case trait_1.TraitState.Skipped:
                                    continue;
                                case trait_1.TraitState.Pending:
                                    throw new Error("Resolving a trait that hasn't been analyzed: " + clazz.name.text + " / " + Object.getPrototypeOf(trait.handler).constructor.name);
                                case trait_1.TraitState.Resolved:
                                    throw new Error("Resolving an already resolved trait");
                            }
                            if (trait.analysis === null) {
                                // No analysis results, cannot further process this trait.
                                continue;
                            }
                            if (handler.resolve === undefined) {
                                // No resolution of this trait needed - it's considered successful by default.
                                trait = trait.toResolved(null, null);
                                continue;
                            }
                            var result = void 0;
                            try {
                                result = handler.resolve(clazz, trait.analysis, trait.symbol);
                            }
                            catch (err) {
                                if (err instanceof diagnostics_1.FatalDiagnosticError) {
                                    trait = trait.toResolved(null, [err.toDiagnostic()]);
                                    continue;
                                }
                                else {
                                    throw err;
                                }
                            }
                            trait = trait.toResolved((_d = result.data) !== null && _d !== void 0 ? _d : null, (_e = result.diagnostics) !== null && _e !== void 0 ? _e : null);
                            if (result.reexports !== undefined) {
                                var fileName = clazz.getSourceFile().fileName;
                                if (!this.reexportMap.has(fileName)) {
                                    this.reexportMap.set(fileName, new Map());
                                }
                                var fileReexports = this.reexportMap.get(fileName);
                                try {
                                    for (var _h = (e_12 = void 0, tslib_1.__values(result.reexports)), _j = _h.next(); !_j.done; _j = _h.next()) {
                                        var reexport = _j.value;
                                        fileReexports.set(reexport.asAlias, [reexport.fromModule, reexport.symbolName]);
                                    }
                                }
                                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                                finally {
                                    try {
                                        if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                                    }
                                    finally { if (e_12) throw e_12.error; }
                                }
                            }
                        }
                    }
                    catch (e_11_1) { e_11 = { error: e_11_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_11) throw e_11.error; }
                    }
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (classes_2_1 && !classes_2_1.done && (_a = classes_2.return)) _a.call(classes_2);
                }
                finally { if (e_10) throw e_10.error; }
            }
        };
        /**
         * Generate type-checking code into the `TypeCheckContext` for any components within the given
         * `ts.SourceFile`.
         */
        TraitCompiler.prototype.typeCheck = function (sf, ctx) {
            var e_13, _a, e_14, _b;
            if (!this.fileToClasses.has(sf)) {
                return;
            }
            try {
                for (var _c = tslib_1.__values(this.fileToClasses.get(sf)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var clazz = _d.value;
                    var record = this.classes.get(clazz);
                    try {
                        for (var _e = (e_14 = void 0, tslib_1.__values(record.traits)), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var trait = _f.value;
                            if (trait.state !== trait_1.TraitState.Resolved) {
                                continue;
                            }
                            else if (trait.handler.typeCheck === undefined) {
                                continue;
                            }
                            if (trait.resolution !== null) {
                                trait.handler.typeCheck(ctx, clazz, trait.analysis, trait.resolution);
                            }
                        }
                    }
                    catch (e_14_1) { e_14 = { error: e_14_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_14) throw e_14.error; }
                    }
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_13) throw e_13.error; }
            }
        };
        TraitCompiler.prototype.index = function (ctx) {
            var e_15, _a, e_16, _b;
            try {
                for (var _c = tslib_1.__values(this.classes.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var clazz = _d.value;
                    var record = this.classes.get(clazz);
                    try {
                        for (var _e = (e_16 = void 0, tslib_1.__values(record.traits)), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var trait = _f.value;
                            if (trait.state !== trait_1.TraitState.Resolved) {
                                // Skip traits that haven't been resolved successfully.
                                continue;
                            }
                            else if (trait.handler.index === undefined) {
                                // Skip traits that don't affect indexing.
                                continue;
                            }
                            if (trait.resolution !== null) {
                                trait.handler.index(ctx, clazz, trait.analysis, trait.resolution);
                            }
                        }
                    }
                    catch (e_16_1) { e_16 = { error: e_16_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_16) throw e_16.error; }
                    }
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_15) throw e_15.error; }
            }
        };
        TraitCompiler.prototype.xi18n = function (bundle) {
            var e_17, _a, e_18, _b;
            try {
                for (var _c = tslib_1.__values(this.classes.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var clazz = _d.value;
                    var record = this.classes.get(clazz);
                    try {
                        for (var _e = (e_18 = void 0, tslib_1.__values(record.traits)), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var trait = _f.value;
                            if (trait.state !== trait_1.TraitState.Analyzed && trait.state !== trait_1.TraitState.Resolved) {
                                // Skip traits that haven't been analyzed successfully.
                                continue;
                            }
                            else if (trait.handler.xi18n === undefined) {
                                // Skip traits that don't support xi18n.
                                continue;
                            }
                            if (trait.analysis !== null) {
                                trait.handler.xi18n(bundle, clazz, trait.analysis);
                            }
                        }
                    }
                    catch (e_18_1) { e_18 = { error: e_18_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_18) throw e_18.error; }
                    }
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_17) throw e_17.error; }
            }
        };
        TraitCompiler.prototype.updateResources = function (clazz) {
            var e_19, _a;
            if (!this.reflector.isClass(clazz) || !this.classes.has(clazz)) {
                return;
            }
            var record = this.classes.get(clazz);
            try {
                for (var _b = tslib_1.__values(record.traits), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var trait = _c.value;
                    if (trait.state !== trait_1.TraitState.Resolved || trait.handler.updateResources === undefined) {
                        continue;
                    }
                    trait.handler.updateResources(clazz, trait.analysis, trait.resolution);
                }
            }
            catch (e_19_1) { e_19 = { error: e_19_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_19) throw e_19.error; }
            }
        };
        TraitCompiler.prototype.compile = function (clazz, constantPool) {
            var e_20, _a;
            var original = ts.getOriginalNode(clazz);
            if (!this.reflector.isClass(clazz) || !this.reflector.isClass(original) ||
                !this.classes.has(original)) {
                return null;
            }
            var record = this.classes.get(original);
            var res = [];
            var _loop_2 = function (trait) {
                var e_21, _d;
                if (trait.state !== trait_1.TraitState.Resolved || trait.analysisDiagnostics !== null ||
                    trait.resolveDiagnostics !== null) {
                    return "continue";
                }
                // `trait.resolution` is non-null asserted here because TypeScript does not recognize that
                // `Readonly<unknown>` is nullable (as `unknown` itself is nullable) due to the way that
                // `Readonly` works.
                var compileRes = void 0;
                if (this_1.compilationMode === api_1.CompilationMode.PARTIAL &&
                    trait.handler.compilePartial !== undefined) {
                    compileRes = trait.handler.compilePartial(clazz, trait.analysis, trait.resolution);
                }
                else {
                    compileRes =
                        trait.handler.compileFull(clazz, trait.analysis, trait.resolution, constantPool);
                }
                var compileMatchRes = compileRes;
                if (Array.isArray(compileMatchRes)) {
                    var _loop_3 = function (result) {
                        if (!res.some(function (r) { return r.name === result.name; })) {
                            res.push(result);
                        }
                    };
                    try {
                        for (var compileMatchRes_1 = (e_21 = void 0, tslib_1.__values(compileMatchRes)), compileMatchRes_1_1 = compileMatchRes_1.next(); !compileMatchRes_1_1.done; compileMatchRes_1_1 = compileMatchRes_1.next()) {
                            var result = compileMatchRes_1_1.value;
                            _loop_3(result);
                        }
                    }
                    catch (e_21_1) { e_21 = { error: e_21_1 }; }
                    finally {
                        try {
                            if (compileMatchRes_1_1 && !compileMatchRes_1_1.done && (_d = compileMatchRes_1.return)) _d.call(compileMatchRes_1);
                        }
                        finally { if (e_21) throw e_21.error; }
                    }
                }
                else if (!res.some(function (result) { return result.name === compileMatchRes.name; })) {
                    res.push(compileMatchRes);
                }
            };
            var this_1 = this;
            try {
                for (var _b = tslib_1.__values(record.traits), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var trait = _c.value;
                    _loop_2(trait);
                }
            }
            catch (e_20_1) { e_20 = { error: e_20_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_20) throw e_20.error; }
            }
            // Look up the .d.ts transformer for the input file and record that at least one field was
            // generated, which will allow the .d.ts to be transformed later.
            this.dtsTransforms.getIvyDeclarationTransform(original.getSourceFile())
                .addFields(original, res);
            // Return the instruction to the transformer so the fields will be added.
            return res.length > 0 ? res : null;
        };
        TraitCompiler.prototype.decoratorsFor = function (node) {
            var e_22, _a;
            var original = ts.getOriginalNode(node);
            if (!this.reflector.isClass(original) || !this.classes.has(original)) {
                return [];
            }
            var record = this.classes.get(original);
            var decorators = [];
            try {
                for (var _b = tslib_1.__values(record.traits), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var trait = _c.value;
                    if (trait.state !== trait_1.TraitState.Resolved) {
                        continue;
                    }
                    if (trait.detected.trigger !== null && ts.isDecorator(trait.detected.trigger)) {
                        decorators.push(trait.detected.trigger);
                    }
                }
            }
            catch (e_22_1) { e_22 = { error: e_22_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_22) throw e_22.error; }
            }
            return decorators;
        };
        Object.defineProperty(TraitCompiler.prototype, "diagnostics", {
            get: function () {
                var e_23, _a, e_24, _b;
                var diagnostics = [];
                try {
                    for (var _c = tslib_1.__values(this.classes.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var clazz = _d.value;
                        var record = this.classes.get(clazz);
                        if (record.metaDiagnostics !== null) {
                            diagnostics.push.apply(diagnostics, tslib_1.__spreadArray([], tslib_1.__read(record.metaDiagnostics)));
                        }
                        try {
                            for (var _e = (e_24 = void 0, tslib_1.__values(record.traits)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var trait = _f.value;
                                if ((trait.state === trait_1.TraitState.Analyzed || trait.state === trait_1.TraitState.Resolved) &&
                                    trait.analysisDiagnostics !== null) {
                                    diagnostics.push.apply(diagnostics, tslib_1.__spreadArray([], tslib_1.__read(trait.analysisDiagnostics)));
                                }
                                if (trait.state === trait_1.TraitState.Resolved && trait.resolveDiagnostics !== null) {
                                    diagnostics.push.apply(diagnostics, tslib_1.__spreadArray([], tslib_1.__read(trait.resolveDiagnostics)));
                                }
                            }
                        }
                        catch (e_24_1) { e_24 = { error: e_24_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_24) throw e_24.error; }
                        }
                    }
                }
                catch (e_23_1) { e_23 = { error: e_23_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_23) throw e_23.error; }
                }
                return diagnostics;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TraitCompiler.prototype, "exportStatements", {
            get: function () {
                return this.reexportMap;
            },
            enumerable: false,
            configurable: true
        });
        return TraitCompiler;
    }());
    exports.TraitCompiler = TraitCompiler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3RyYW5zZm9ybS9zcmMvY29tcGlsYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUdILCtCQUFpQztJQUVqQywyRUFBa0U7SUFJbEUsNkRBQW1EO0lBR25ELGtGQUFvRTtJQUdwRSx5RUFBdUk7SUFFdkksNkVBQXdEO0lBcUN4RDs7Ozs7Ozs7OztPQVVHO0lBQ0g7UUF3QkUsdUJBQ1ksUUFBNEUsRUFDNUUsU0FBeUIsRUFBVSxJQUFrQixFQUNyRCxnQkFBd0QsRUFDeEQseUJBQWtDLEVBQVUsZUFBZ0MsRUFDNUUsYUFBbUMsRUFDbkMsdUJBQXFEOztZQUxyRCxhQUFRLEdBQVIsUUFBUSxDQUFvRTtZQUM1RSxjQUFTLEdBQVQsU0FBUyxDQUFnQjtZQUFVLFNBQUksR0FBSixJQUFJLENBQWM7WUFDckQscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF3QztZQUN4RCw4QkFBeUIsR0FBekIseUJBQXlCLENBQVM7WUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7WUFDNUUsa0JBQWEsR0FBYixhQUFhLENBQXNCO1lBQ25DLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBOEI7WUE3QmpFOzs7ZUFHRztZQUNLLFlBQU8sR0FBRyxJQUFJLEdBQUcsRUFBaUMsQ0FBQztZQUUzRDs7O2VBR0c7WUFDTyxrQkFBYSxHQUFHLElBQUksR0FBRyxFQUF3QyxDQUFDO1lBRTFFOzs7ZUFHRztZQUNPLHVCQUFrQixHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1lBRWhELGdCQUFXLEdBQUcsSUFBSSxHQUFHLEVBQXlDLENBQUM7WUFFL0QsbUJBQWMsR0FDbEIsSUFBSSxHQUFHLEVBQTRFLENBQUM7O2dCQVN0RixLQUFzQixJQUFBLGFBQUEsaUJBQUEs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c291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29uc3RhbnRQb29sfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtFcnJvckNvZGUsIEZhdGFsRGlhZ25vc3RpY0Vycm9yfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0luY3JlbWVudGFsQnVpbGR9IGZyb20gJy4uLy4uL2luY3JlbWVudGFsL2FwaSc7XG5pbXBvcnQge1NlbWFudGljRGVwR3JhcGhVcGRhdGVyLCBTZW1hbnRpY1N5bWJvbH0gZnJvbSAnLi4vLi4vaW5jcmVtZW50YWwvc2VtYW50aWNfZ3JhcGgnO1xuaW1wb3J0IHtJbmRleGluZ0NvbnRleHR9IGZyb20gJy4uLy4uL2luZGV4ZXInO1xuaW1wb3J0IHtQZXJmRXZlbnQsIFBlcmZSZWNvcmRlcn0gZnJvbSAnLi4vLi4vcGVyZic7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb24sIERlY2xhcmF0aW9uTm9kZSwgRGVjb3JhdG9yLCBSZWZsZWN0aW9uSG9zdH0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge1Byb2dyYW1UeXBlQ2hlY2tBZGFwdGVyLCBUeXBlQ2hlY2tDb250ZXh0fSBmcm9tICcuLi8uLi90eXBlY2hlY2svYXBpJztcbmltcG9ydCB7Z2V0U291cmNlRmlsZSwgaXNFeHBvcnRlZH0gZnJvbSAnLi4vLi4vdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5pbXBvcnQge1hpMThuQ29udGV4dH0gZnJvbSAnLi4vLi4veGkxOG4nO1xuXG5pbXBvcnQge0FuYWx5c2lzT3V0cHV0LCBDb21waWxhdGlvbk1vZGUsIENvbXBpbGVSZXN1bHQsIERlY29yYXRvckhhbmRsZXIsIEhhbmRsZXJGbGFncywgSGFuZGxlclByZWNlZGVuY2UsIFJlc29sdmVSZXN1bHR9IGZyb20gJy4vYXBpJztcbmltcG9ydCB7RHRzVHJhbnNmb3JtUmVnaXN0cnl9IGZyb20gJy4vZGVjbGFyYXRpb24nO1xuaW1wb3J0IHtQZW5kaW5nVHJhaXQsIFRyYWl0LCBUcmFpdFN0YXRlfSBmcm9tICcuL3RyYWl0JztcblxuXG4vKipcbiAqIFJlY29yZHMgaW5mb3JtYXRpb24gYWJvdXQgYSBzcGVjaWZpYyBjbGFzcyB0aGF0IGhhcyBtYXRjaGVkIHRyYWl0cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbGFzc1JlY29yZCB7XG4gIC8qKlxuICAgKiBUaGUgYENsYXNzRGVjbGFyYXRpb25gIG9mIHRoZSBjbGFzcyB3aGljaCBoYXMgQW5ndWxhciB0cmFpdHMgYXBwbGllZC5cbiAgICovXG4gIG5vZGU6IENsYXNzRGVjbGFyYXRpb247XG5cbiAgLyoqXG4gICAqIEFsbCB0cmFpdHMgd2hpY2ggbWF0Y2hlZCBvbiB0aGUgY2xhc3MuXG4gICAqL1xuICB0cmFpdHM6IFRyYWl0PHVua25vd24sIHVua25vd24sIFNlbWFudGljU3ltYm9sfG51bGwsIHVua25vd24+W107XG5cbiAgLyoqXG4gICAqIE1ldGEtZGlhZ25vc3RpY3MgYWJvdXQgdGhlIGNsYXNzLCB3aGljaCBhcmUgdXN1YWxseSByZWxhdGVkIHRvIHdoZXRoZXIgY2VydGFpbiBjb21iaW5hdGlvbnMgb2ZcbiAgICogQW5ndWxhciBkZWNvcmF0b3JzIGFyZSBub3QgcGVybWl0dGVkLlxuICAgKi9cbiAgbWV0YURpYWdub3N0aWNzOiB0cy5EaWFnbm9zdGljW118bnVsbDtcblxuICAvLyBTdWJzZXF1ZW50IGZpZWxkcyBhcmUgXCJpbnRlcm5hbFwiIGFuZCB1c2VkIGR1cmluZyB0aGUgbWF0Y2hpbmcgb2YgYERlY29yYXRvckhhbmRsZXJgcy4gVGhpcyBpc1xuICAvLyBtdXRhYmxlIHN0YXRlIGR1cmluZyB0aGUgYGRldGVjdGAvYGFuYWx5emVgIHBoYXNlcyBvZiBjb21waWxhdGlvbi5cblxuICAvKipcbiAgICogV2hldGhlciBgdHJhaXRzYCBjb250YWlucyB0cmFpdHMgbWF0Y2hlZCBmcm9tIGBEZWNvcmF0b3JIYW5kbGVyYHMgbWFya2VkIGFzIGBXRUFLYC5cbiAgICovXG4gIGhhc1dlYWtIYW5kbGVyczogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciBgdHJhaXRzYCBjb250YWlucyBhIHRyYWl0IGZyb20gYSBgRGVjb3JhdG9ySGFuZGxlcmAgbWF0Y2hlZCBhcyBgUFJJTUFSWWAuXG4gICAqL1xuICBoYXNQcmltYXJ5SGFuZGxlcjogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGUgaGVhcnQgb2YgQW5ndWxhciBjb21waWxhdGlvbi5cbiAqXG4gKiBUaGUgYFRyYWl0Q29tcGlsZXJgIGlzIHJlc3BvbnNpYmxlIGZvciBwcm9jZXNzaW5nIGFsbCBjbGFzc2VzIGluIHRoZSBwcm9ncmFtLiBBbnkgdGltZSBhXG4gKiBgRGVjb3JhdG9ySGFuZGxlcmAgbWF0Y2hlcyBhIGNsYXNzLCBhIFwidHJhaXRcIiBpcyBjcmVhdGVkIHRvIHJlcHJlc2VudCB0aGF0IEFuZ3VsYXIgYXNwZWN0IG9mIHRoZVxuICogY2xhc3MgKHN1Y2ggYXMgdGhlIGNsYXNzIGhhdmluZyBhIGNvbXBvbmVudCBkZWZpbml0aW9uKS5cbiAqXG4gKiBUaGUgYFRyYWl0Q29tcGlsZXJgIHRyYW5zaXRpb25zIGVhY2ggdHJhaXQgdGhyb3VnaCB0aGUgdmFyaW91cyBwaGFzZXMgb2YgY29tcGlsYXRpb24sIGN1bG1pbmF0aW5nXG4gKiBpbiB0aGUgcHJvZHVjdGlvbiBvZiBgQ29tcGlsZVJlc3VsdGBzIGluc3RydWN0aW5nIHRoZSBjb21waWxlciB0byBhcHBseSB2YXJpb3VzIG11dGF0aW9ucyB0byB0aGVcbiAqIGNsYXNzIChsaWtlIGFkZGluZyBmaWVsZHMgb3IgdHlwZSBkZWNsYXJhdGlvbnMpLlxuICovXG5leHBvcnQgY2xhc3MgVHJhaXRDb21waWxlciBpbXBsZW1lbnRzIFByb2dyYW1UeXBlQ2hlY2tBZGFwdGVyIHtcbiAgLyoqXG4gICAqIE1hcHMgY2xhc3MgZGVjbGFyYXRpb25zIHRvIHRoZWlyIGBDbGFzc1JlY29yZGAsIHdoaWNoIHRyYWNrcyB0aGUgSXZ5IHRyYWl0cyBiZWluZyBhcHBsaWVkIHRvXG4gICAqIHRob3NlIGNsYXNzZXMuXG4gICAqL1xuICBwcml2YXRlIGNsYXNzZXMgPSBuZXcgTWFwPENsYXNzRGVjbGFyYXRpb24sIENsYXNzUmVjb3JkPigpO1xuXG4gIC8qKlxuICAgKiBNYXBzIHNvdXJjZSBmaWxlcyB0byBhbnkgY2xhc3MgZGVjbGFyYXRpb24ocykgd2l0aGluIHRoZW0gd2hpY2ggaGF2ZSBiZWVuIGRpc2NvdmVyZWQgdG8gY29udGFpblxuICAgKiBJdnkgdHJhaXRzLlxuICAgKi9cbiAgcHJvdGVjdGVkIGZpbGVUb0NsYXNzZXMgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIFNldDxDbGFzc0RlY2xhcmF0aW9uPj4oKTtcblxuICAvKipcbiAgICogVHJhY2tzIHdoaWNoIHNvdXJjZSBmaWxlcyBoYXZlIGJlZW4gYW5hbHl6ZWQgYnV0IGRpZCBub3QgY29udGFpbiBhbnkgdHJhaXRzLiBUaGlzIHNldCBhbGxvd3NcbiAgICogdGhlIGNvbXBpbGVyIHRvIHNraXAgYW5hbHl6aW5nIHRoZXNlIGZpbGVzIGluIGFuIGluY3JlbWVudGFsIHJlYnVpbGQuXG4gICAqL1xuICBwcm90ZWN0ZWQgZmlsZXNXaXRob3V0VHJhaXRzID0gbmV3IFNldDx0cy5Tb3VyY2VGaWxlPigpO1xuXG4gIHByaXZhdGUgcmVleHBvcnRNYXAgPSBuZXcgTWFwPHN0cmluZywgTWFwPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4+KCk7XG5cbiAgcHJpdmF0ZSBoYW5kbGVyc0J5TmFtZSA9XG4gICAgICBuZXcgTWFwPHN0cmluZywgRGVjb3JhdG9ySGFuZGxlcjx1bmtub3duLCB1bmtub3duLCBTZW1hbnRpY1N5bWJvbHxudWxsLCB1bmtub3duPj4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgaGFuZGxlcnM6IERlY29yYXRvckhhbmRsZXI8dW5rbm93biwgdW5rbm93biwgU2VtYW50aWNTeW1ib2x8bnVsbCwgdW5rbm93bj5bXSxcbiAgICAgIHByaXZhdGUgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCwgcHJpdmF0ZSBwZXJmOiBQZXJmUmVjb3JkZXIsXG4gICAgICBwcml2YXRlIGluY3JlbWVudGFsQnVpbGQ6IEluY3JlbWVudGFsQnVpbGQ8Q2xhc3NSZWNvcmQsIHVua25vd24+LFxuICAgICAgcHJpdmF0ZSBjb21waWxlTm9uRXhwb3J0ZWRDbGFzc2VzOiBib29sZWFuLCBwcml2YXRlIGNvbXBpbGF0aW9uTW9kZTogQ29tcGlsYXRpb25Nb2RlLFxuICAgICAgcHJpdmF0ZSBkdHNUcmFuc2Zvcm1zOiBEdHNUcmFuc2Zvcm1SZWdpc3RyeSxcbiAgICAgIHByaXZhdGUgc2VtYW50aWNEZXBHcmFwaFVwZGF0ZXI6IFNlbWFudGljRGVwR3JhcGhVcGRhdGVyfG51bGwpIHtcbiAgICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgaGFuZGxlcnMpIHtcbiAgICAgIHRoaXMuaGFuZGxlcnNCeU5hbWUuc2V0KGhhbmRsZXIubmFtZSwgaGFuZGxlcik7XG4gICAgfVxuICB9XG5cbiAgYW5hbHl6ZVN5bmMoc2Y6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICB0aGlzLmFuYWx5emUoc2YsIGZhbHNlKTtcbiAgfVxuXG4gIGFuYWx5emVBc3luYyhzZjogdHMuU291cmNlRmlsZSk6IFByb21pc2U8dm9pZD58dW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5hbmFseXplKHNmLCB0cnVlKTtcbiAgfVxuXG4gIHByaXZhdGUgYW5hbHl6ZShzZjogdHMuU291cmNlRmlsZSwgcHJlYW5hbHl6ZTogZmFsc2UpOiB2b2lkO1xuICBwcml2YXRlIGFuYWx5emUoc2Y6IHRzLlNvdXJjZUZpbGUsIHByZWFuYWx5emU6IHRydWUpOiBQcm9taXNlPHZvaWQ+fHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBhbmFseXplKHNmOiB0cy5Tb3VyY2VGaWxlLCBwcmVhbmFseXplOiBib29sZWFuKTogUHJvbWlzZTx2b2lkPnx1bmRlZmluZWQge1xuICAgIC8vIFdlIHNob3VsZG4ndCBhbmFseXplIGRlY2xhcmF0aW9uIGZpbGVzLlxuICAgIGlmIChzZi5pc0RlY2xhcmF0aW9uRmlsZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBhbmFseXplKCkgcmVhbGx5IHdhbnRzIHRvIHJldHVybiBgUHJvbWlzZTx2b2lkPnx2b2lkYCwgYnV0IFR5cGVTY3JpcHQgY2Fubm90IG5hcnJvdyBhIHJldHVyblxuICAgIC8vIHR5cGUgb2YgJ3ZvaWQnLCBzbyBgdW5kZWZpbmVkYCBpcyB1c2VkIGluc3RlYWQuXG4gICAgY29uc3QgcHJvbWlzZXM6IFByb21pc2U8dm9pZD5bXSA9IFtdO1xuXG4gICAgY29uc3QgcHJpb3JXb3JrID0gdGhpcy5pbmNyZW1lbnRhbEJ1aWxkLnByaW9yQW5hbHlzaXNGb3Ioc2YpO1xuICAgIGlmIChwcmlvcldvcmsgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucGVyZi5ldmVudENvdW50KFBlcmZFdmVudC5Tb3VyY2VGaWxlUmV1c2VBbmFseXNpcyk7XG5cbiAgICAgIGlmIChwcmlvcldvcmsubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGNvbnN0IHByaW9yUmVjb3JkIG9mIHByaW9yV29yaykge1xuICAgICAgICAgIHRoaXMuYWRvcHQocHJpb3JSZWNvcmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wZXJmLmV2ZW50Q291bnQoUGVyZkV2ZW50LlRyYWl0UmV1c2VBbmFseXNpcywgcHJpb3JXb3JrLmxlbmd0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZpbGVzV2l0aG91dFRyYWl0cy5hZGQoc2YpO1xuICAgICAgfVxuXG4gICAgICAvLyBTa2lwIHRoZSByZXN0IG9mIGFuYWx5c2lzLCBhcyB0aGlzIGZpbGUncyBwcmlvciB0cmFpdHMgYXJlIGJlaW5nIHJldXNlZC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB2aXNpdCA9IChub2RlOiB0cy5Ob2RlKTogdm9pZCA9PiB7XG4gICAgICBpZiAodGhpcy5yZWZsZWN0b3IuaXNDbGFzcyhub2RlKSkge1xuICAgICAgICB0aGlzLmFuYWx5emVDbGFzcyhub2RlLCBwcmVhbmFseXplID8gcHJvbWlzZXMgOiBudWxsKTtcbiAgICAgIH1cbiAgICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCB2aXNpdCk7XG4gICAgfTtcblxuICAgIHZpc2l0KHNmKTtcblxuICAgIGlmIChwcmVhbmFseXplICYmIHByb21pc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB1bmRlZmluZWQgYXMgdm9pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcmVjb3JkRm9yKGNsYXp6OiBDbGFzc0RlY2xhcmF0aW9uKTogQ2xhc3NSZWNvcmR8bnVsbCB7XG4gICAgaWYgKHRoaXMuY2xhc3Nlcy5oYXMoY2xhenopKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbGFzc2VzLmdldChjbGF6eikhO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZWNvcmRzRm9yKHNmOiB0cy5Tb3VyY2VGaWxlKTogQ2xhc3NSZWNvcmRbXXxudWxsIHtcbiAgICBpZiAoIXRoaXMuZmlsZVRvQ2xhc3Nlcy5oYXMoc2YpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgcmVjb3JkczogQ2xhc3NSZWNvcmRbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgY2xhenogb2YgdGhpcy5maWxlVG9DbGFzc2VzLmdldChzZikhKSB7XG4gICAgICByZWNvcmRzLnB1c2godGhpcy5jbGFzc2VzLmdldChjbGF6eikhKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlY29yZHM7XG4gIH1cblxuICBnZXRBbmFseXplZFJlY29yZHMoKTogTWFwPHRzLlNvdXJjZUZpbGUsIENsYXNzUmVjb3JkW10+IHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIENsYXNzUmVjb3JkW10+KCk7XG4gICAgZm9yIChjb25zdCBbc2YsIGNsYXNzZXNdIG9mIHRoaXMuZmlsZVRvQ2xhc3Nlcykge1xuICAgICAgY29uc3QgcmVjb3JkczogQ2xhc3NSZWNvcmRbXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBjbGF6eiBvZiBjbGFzc2VzKSB7XG4gICAgICAgIHJlY29yZHMucHVzaCh0aGlzLmNsYXNzZXMuZ2V0KGNsYXp6KSEpO1xuICAgICAgfVxuICAgICAgcmVzdWx0LnNldChzZiwgcmVjb3Jkcyk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgc2Ygb2YgdGhpcy5maWxlc1dpdGhvdXRUcmFpdHMpIHtcbiAgICAgIHJlc3VsdC5zZXQoc2YsIFtdKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYSBgQ2xhc3NSZWNvcmRgIGZyb20gYSBwcmV2aW91cyBjb21waWxhdGlvbi5cbiAgICpcbiAgICogVHJhaXRzIGZyb20gdGhlIGBDbGFzc1JlY29yZGAgaGF2ZSBhY2N1cmF0ZSBtZXRhZGF0YSwgYnV0IHRoZSBgaGFuZGxlcmAgaXMgZnJvbSB0aGUgb2xkIHByb2dyYW1cbiAgICogYW5kIG5lZWRzIHRvIGJlIHVwZGF0ZWQgKG1hdGNoaW5nIGlzIGRvbmUgYnkgbmFtZSkuIEEgbmV3IHBlbmRpbmcgdHJhaXQgaXMgY3JlYXRlZCBhbmQgdGhlblxuICAgKiB0cmFuc2l0aW9uZWQgdG8gYW5hbHl6ZWQgdXNpbmcgdGhlIHByZXZpb3VzIGFuYWx5c2lzLiBJZiB0aGUgdHJhaXQgaXMgaW4gdGhlIGVycm9yZWQgc3RhdGUsXG4gICAqIGluc3RlYWQgdGhlIGVycm9ycyBhcmUgY29waWVkIG92ZXIuXG4gICAqL1xuICBwcml2YXRlIGFkb3B0KHByaW9yUmVjb3JkOiBDbGFzc1JlY29yZCk6IHZvaWQge1xuICAgIGNvbnN0IHJlY29yZDogQ2xhc3NSZWNvcmQgPSB7XG4gICAgICBoYXNQcmltYXJ5SGFuZGxlcjogcHJpb3JSZWNvcmQuaGFzUHJpbWFyeUhhbmRsZXIsXG4gICAgICBoYXNXZWFrSGFuZGxlcnM6IHByaW9yUmVjb3JkLmhhc1dlYWtIYW5kbGVycyxcbiAgICAgIG1ldGFEaWFnbm9zdGljczogcHJpb3JSZWNvcmQubWV0YURpYWdub3N0aWNzLFxuICAgICAgbm9kZTogcHJpb3JSZWNvcmQubm9kZSxcbiAgICAgIHRyYWl0czogW10sXG4gICAgfTtcblxuICAgIGZvciAoY29uc3QgcHJpb3JUcmFpdCBvZiBwcmlvclJlY29yZC50cmFpdHMpIHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLmhhbmRsZXJzQnlOYW1lLmdldChwcmlvclRyYWl0LmhhbmRsZXIubmFtZSkhO1xuICAgICAgbGV0IHRyYWl0OiBUcmFpdDx1bmtub3duLCB1bmtub3duLCBTZW1hbnRpY1N5bWJvbHxudWxsLCB1bmtub3duPiA9XG4gICAgICAgICAgVHJhaXQucGVuZGluZyhoYW5kbGVyLCBwcmlvclRyYWl0LmRldGVjdGVkKTtcblxuICAgICAgaWYgKHByaW9yVHJhaXQuc3RhdGUgPT09IFRyYWl0U3RhdGUuQW5hbHl6ZWQgfHwgcHJpb3JUcmFpdC5zdGF0ZSA9PT0gVHJhaXRTdGF0ZS5SZXNvbHZlZCkge1xuICAgICAgICBjb25zdCBzeW1ib2wgPSB0aGlzLm1ha2VTeW1ib2xGb3JUcmFpdChoYW5kbGVyLCByZWNvcmQubm9kZSwgcHJpb3JUcmFpdC5hbmFseXNpcyk7XG4gICAgICAgIHRyYWl0ID0gdHJhaXQudG9BbmFseXplZChwcmlvclRyYWl0LmFuYWx5c2lzLCBwcmlvclRyYWl0LmFuYWx5c2lzRGlhZ25vc3RpY3MsIHN5bWJvbCk7XG4gICAgICAgIGlmICh0cmFpdC5hbmFseXNpcyAhPT0gbnVsbCAmJiB0cmFpdC5oYW5kbGVyLnJlZ2lzdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0cmFpdC5oYW5kbGVyLnJlZ2lzdGVyKHJlY29yZC5ub2RlLCB0cmFpdC5hbmFseXNpcyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocHJpb3JUcmFpdC5zdGF0ZSA9PT0gVHJhaXRTdGF0ZS5Ta2lwcGVkKSB7XG4gICAgICAgIHRyYWl0ID0gdHJhaXQudG9Ta2lwcGVkKCk7XG4gICAgICB9XG5cbiAgICAgIHJlY29yZC50cmFpdHMucHVzaCh0cmFpdCk7XG4gICAgfVxuXG4gICAgdGhpcy5jbGFzc2VzLnNldChyZWNvcmQubm9kZSwgcmVjb3JkKTtcbiAgICBjb25zdCBzZiA9IHJlY29yZC5ub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICBpZiAoIXRoaXMuZmlsZVRvQ2xhc3Nlcy5oYXMoc2YpKSB7XG4gICAgICB0aGlzLmZpbGVUb0NsYXNzZXMuc2V0KHNmLCBuZXcgU2V0PENsYXNzRGVjbGFyYXRpb24+KCkpO1xuICAgIH1cbiAgICB0aGlzLmZpbGVUb0NsYXNzZXMuZ2V0KHNmKSEuYWRkKHJlY29yZC5ub2RlKTtcbiAgfVxuXG4gIHByaXZhdGUgc2NhbkNsYXNzRm9yVHJhaXRzKGNsYXp6OiBDbGFzc0RlY2xhcmF0aW9uKTpcbiAgICAgIFBlbmRpbmdUcmFpdDx1bmtub3duLCB1bmtub3duLCBTZW1hbnRpY1N5bWJvbHxudWxsLCB1bmtub3duPltdfG51bGwge1xuICAgIGlmICghdGhpcy5jb21waWxlTm9uRXhwb3J0ZWRDbGFzc2VzICYmICF0aGlzLnJlZmxlY3Rvci5pc1N0YXRpY2FsbHlFeHBvcnRlZChjbGF6eikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGRlY29yYXRvcnMgPSB0aGlzLnJlZmxlY3Rvci5nZXREZWNvcmF0b3JzT2ZEZWNsYXJhdGlvbihjbGF6eik7XG5cbiAgICByZXR1cm4gdGhpcy5kZXRlY3RUcmFpdHMoY2xhenosIGRlY29yYXRvcnMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRldGVjdFRyYWl0cyhjbGF6ejogQ2xhc3NEZWNsYXJhdGlvbiwgZGVjb3JhdG9yczogRGVjb3JhdG9yW118bnVsbCk6XG4gICAgICBQZW5kaW5nVHJhaXQ8dW5rbm93biwgdW5rbm93biwgU2VtYW50aWNTeW1ib2x8bnVsbCwgdW5rbm93bj5bXXxudWxsIHtcbiAgICBsZXQgcmVjb3JkOiBDbGFzc1JlY29yZHxudWxsID0gdGhpcy5yZWNvcmRGb3IoY2xhenopO1xuICAgIGxldCBmb3VuZFRyYWl0czogUGVuZGluZ1RyYWl0PHVua25vd24sIHVua25vd24sIFNlbWFudGljU3ltYm9sfG51bGwsIHVua25vd24+W10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgaGFuZGxlciBvZiB0aGlzLmhhbmRsZXJzKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBoYW5kbGVyLmRldGVjdChjbGF6eiwgZGVjb3JhdG9ycyk7XG4gICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzUHJpbWFyeUhhbmRsZXIgPSBoYW5kbGVyLnByZWNlZGVuY2UgPT09IEhhbmRsZXJQcmVjZWRlbmNlLlBSSU1BUlk7XG4gICAgICBjb25zdCBpc1dlYWtIYW5kbGVyID0gaGFuZGxlci5wcmVjZWRlbmNlID09PSBIYW5kbGVyUHJlY2VkZW5jZS5XRUFLO1xuICAgICAgY29uc3QgdHJhaXQgPSBUcmFpdC5wZW5kaW5nKGhhbmRsZXIsIHJlc3VsdCk7XG5cbiAgICAgIGZvdW5kVHJhaXRzLnB1c2godHJhaXQpO1xuXG4gICAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGZpcnN0IGhhbmRsZXIgdG8gbWF0Y2ggdGhpcyBjbGFzcy4gVGhpcyBwYXRoIGlzIGEgZmFzdCBwYXRoIHRocm91Z2ggd2hpY2hcbiAgICAgICAgLy8gbW9zdCBjbGFzc2VzIHdpbGwgZmxvdy5cbiAgICAgICAgcmVjb3JkID0ge1xuICAgICAgICAgIG5vZGU6IGNsYXp6LFxuICAgICAgICAgIHRyYWl0czogW3RyYWl0XSxcbiAgICAgICAgICBtZXRhRGlhZ25vc3RpY3M6IG51bGwsXG4gICAgICAgICAgaGFzUHJpbWFyeUhhbmRsZXI6IGlzUHJpbWFyeUhhbmRsZXIsXG4gICAgICAgICAgaGFzV2Vha0hhbmRsZXJzOiBpc1dlYWtIYW5kbGVyLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuY2xhc3Nlcy5zZXQoY2xhenosIHJlY29yZCk7XG4gICAgICAgIGNvbnN0IHNmID0gY2xhenouZ2V0U291cmNlRmlsZSgpO1xuICAgICAgICBpZiAoIXRoaXMuZmlsZVRvQ2xhc3Nlcy5oYXMoc2YpKSB7XG4gICAgICAgICAgdGhpcy5maWxlVG9DbGFzc2VzLnNldChzZiwgbmV3IFNldDxDbGFzc0RlY2xhcmF0aW9uPigpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbGVUb0NsYXNzZXMuZ2V0KHNmKSEuYWRkKGNsYXp6KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgaXMgYXQgbGVhc3QgdGhlIHNlY29uZCBoYW5kbGVyIHRvIG1hdGNoIHRoaXMgY2xhc3MuIFRoaXMgaXMgYSBzbG93ZXIgcGF0aCB0aGF0IHNvbWVcbiAgICAgICAgLy8gY2xhc3NlcyB3aWxsIGdvIHRocm91Z2gsIHdoaWNoIHZhbGlkYXRlcyB0aGF0IHRoZSBzZXQgb2YgZGVjb3JhdG9ycyBhcHBsaWVkIHRvIHRoZSBjbGFzc1xuICAgICAgICAvLyBpcyB2YWxpZC5cblxuICAgICAgICAvLyBWYWxpZGF0ZSBhY2NvcmRpbmcgdG8gcnVsZXMgYXMgZm9sbG93czpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gKiBXRUFLIGhhbmRsZXJzIGFyZSByZW1vdmVkIGlmIGEgbm9uLVdFQUsgaGFuZGxlciBtYXRjaGVzLlxuICAgICAgICAvLyAqIE9ubHkgb25lIFBSSU1BUlkgaGFuZGxlciBjYW4gbWF0Y2ggYXQgYSB0aW1lLiBBbnkgb3RoZXIgUFJJTUFSWSBoYW5kbGVyIG1hdGNoaW5nIGFcbiAgICAgICAgLy8gICBjbGFzcyB3aXRoIGFuIGV4aXN0aW5nIFBSSU1BUlkgaGFuZGxlciBpcyBhbiBlcnJvci5cblxuICAgICAgICBpZiAoIWlzV2Vha0hhbmRsZXIgJiYgcmVjb3JkLmhhc1dlYWtIYW5kbGVycykge1xuICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGhhbmRsZXIgaXMgbm90IGEgV0VBSyBoYW5kbGVyLCBidXQgdGhlIGNsYXNzIGhhcyBvdGhlciBXRUFLIGhhbmRsZXJzLlxuICAgICAgICAgIC8vIFJlbW92ZSB0aGVtLlxuICAgICAgICAgIHJlY29yZC50cmFpdHMgPVxuICAgICAgICAgICAgICByZWNvcmQudHJhaXRzLmZpbHRlcihmaWVsZCA9PiBmaWVsZC5oYW5kbGVyLnByZWNlZGVuY2UgIT09IEhhbmRsZXJQcmVjZWRlbmNlLldFQUspO1xuICAgICAgICAgIHJlY29yZC5oYXNXZWFrSGFuZGxlcnMgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1dlYWtIYW5kbGVyICYmICFyZWNvcmQuaGFzV2Vha0hhbmRsZXJzKSB7XG4gICAgICAgICAgLy8gVGhlIGN1cnJlbnQgaGFuZGxlciBpcyBhIFdFQUsgaGFuZGxlciwgYnV0IHRoZSBjbGFzcyBoYXMgbm9uLVdFQUsgaGFuZGxlcnMgYWxyZWFkeS5cbiAgICAgICAgICAvLyBEcm9wIHRoZSBjdXJyZW50IG9uZS5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1ByaW1hcnlIYW5kbGVyICYmIHJlY29yZC5oYXNQcmltYXJ5SGFuZGxlcikge1xuICAgICAgICAgIC8vIFRoZSBjbGFzcyBhbHJlYWR5IGhhcyBhIFBSSU1BUlkgaGFuZGxlciwgYW5kIGFub3RoZXIgb25lIGp1c3QgbWF0Y2hlZC5cbiAgICAgICAgICByZWNvcmQubWV0YURpYWdub3N0aWNzID0gW3tcbiAgICAgICAgICAgIGNhdGVnb3J5OiB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IsXG4gICAgICAgICAgICBjb2RlOiBOdW1iZXIoJy05OScgKyBFcnJvckNvZGUuREVDT1JBVE9SX0NPTExJU0lPTiksXG4gICAgICAgICAgICBmaWxlOiBnZXRTb3VyY2VGaWxlKGNsYXp6KSxcbiAgICAgICAgICAgIHN0YXJ0OiBjbGF6ei5nZXRTdGFydCh1bmRlZmluZWQsIGZhbHNlKSxcbiAgICAgICAgICAgIGxlbmd0aDogY2xhenouZ2V0V2lkdGgoKSxcbiAgICAgICAgICAgIG1lc3NhZ2VUZXh0OiAnVHdvIGluY29tcGF0aWJsZSBkZWNvcmF0b3JzIG9uIGNsYXNzJyxcbiAgICAgICAgICB9XTtcbiAgICAgICAgICByZWNvcmQudHJhaXRzID0gZm91bmRUcmFpdHMgPSBbXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgaXQncyBzYWZlIHRvIGFjY2VwdCB0aGUgbXVsdGlwbGUgZGVjb3JhdG9ycyBoZXJlLiBVcGRhdGUgc29tZSBvZiB0aGUgbWV0YWRhdGFcbiAgICAgICAgLy8gcmVnYXJkaW5nIHRoaXMgY2xhc3MuXG4gICAgICAgIHJlY29yZC50cmFpdHMucHVzaCh0cmFpdCk7XG4gICAgICAgIHJlY29yZC5oYXNQcmltYXJ5SGFuZGxlciA9IHJlY29yZC5oYXNQcmltYXJ5SGFuZGxlciB8fCBpc1ByaW1hcnlIYW5kbGVyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmb3VuZFRyYWl0cy5sZW5ndGggPiAwID8gZm91bmRUcmFpdHMgOiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBtYWtlU3ltYm9sRm9yVHJhaXQoXG4gICAgICBoYW5kbGVyOiBEZWNvcmF0b3JIYW5kbGVyPHVua25vd24sIHVua25vd24sIFNlbWFudGljU3ltYm9sfG51bGwsIHVua25vd24+LFxuICAgICAgZGVjbDogQ2xhc3NEZWNsYXJhdGlvbiwgYW5hbHlzaXM6IFJlYWRvbmx5PHVua25vd24+fG51bGwpOiBTZW1hbnRpY1N5bWJvbHxudWxsIHtcbiAgICBpZiAoYW5hbHlzaXMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzeW1ib2wgPSBoYW5kbGVyLnN5bWJvbChkZWNsLCBhbmFseXNpcyk7XG4gICAgaWYgKHN5bWJvbCAhPT0gbnVsbCAmJiB0aGlzLnNlbWFudGljRGVwR3JhcGhVcGRhdGVyICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBpc1ByaW1hcnkgPSBoYW5kbGVyLnByZWNlZGVuY2UgPT09IEhhbmRsZXJQcmVjZWRlbmNlLlBSSU1BUlk7XG4gICAgICBpZiAoIWlzUHJpbWFyeSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgQXNzZXJ0aW9uRXJyb3I6ICR7aGFuZGxlci5uYW1lfSByZXR1cm5lZCBhIHN5bWJvbCBidXQgaXMgbm90IGEgcHJpbWFyeSBoYW5kbGVyLmApO1xuICAgICAgfVxuICAgICAgdGhpcy5zZW1hbnRpY0RlcEdyYXBoVXBkYXRlci5yZWdpc3RlclN5bWJvbChzeW1ib2wpO1xuICAgIH1cblxuICAgIHJldHVybiBzeW1ib2w7XG4gIH1cblxuICBwcm90ZWN0ZWQgYW5hbHl6ZUNsYXNzKGNsYXp6OiBDbGFzc0RlY2xhcmF0aW9uLCBwcmVhbmFseXplUXVldWU6IFByb21pc2U8dm9pZD5bXXxudWxsKTogdm9pZCB7XG4gICAgY29uc3QgdHJhaXRzID0gdGhpcy5zY2FuQ2xhc3NGb3JUcmFpdHMoY2xhenopO1xuXG4gICAgaWYgKHRyYWl0cyA9PT0gbnVsbCkge1xuICAgICAgLy8gVGhlcmUgYXJlIG5vIEl2eSB0cmFpdHMgb24gdGhlIGNsYXNzLCBzbyBpdCBjYW4gc2FmZWx5IGJlIHNraXBwZWQuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCB0cmFpdCBvZiB0cmFpdHMpIHtcbiAgICAgIGNvbnN0IGFuYWx5emUgPSAoKSA9PiB0aGlzLmFuYWx5emVUcmFpdChjbGF6eiwgdHJhaXQpO1xuXG4gICAgICBsZXQgcHJlYW5hbHlzaXM6IFByb21pc2U8dm9pZD58bnVsbCA9IG51bGw7XG4gICAgICBpZiAocHJlYW5hbHl6ZVF1ZXVlICE9PSBudWxsICYmIHRyYWl0LmhhbmRsZXIucHJlYW5hbHl6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIEF0dGVtcHQgdG8gcnVuIHByZWFuYWx5c2lzLiBUaGlzIGNvdWxkIGZhaWwgd2l0aCBhIGBGYXRhbERpYWdub3N0aWNFcnJvcmA7IGNhdGNoIGl0IGlmIGl0XG4gICAgICAgIC8vIGRvZXMuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcHJlYW5hbHlzaXMgPSB0cmFpdC5oYW5kbGVyLnByZWFuYWx5emUoY2xhenosIHRyYWl0LmRldGVjdGVkLm1ldGFkYXRhKSB8fCBudWxsO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgRmF0YWxEaWFnbm9zdGljRXJyb3IpIHtcbiAgICAgICAgICAgIHRyYWl0LnRvQW5hbHl6ZWQobnVsbCwgW2Vyci50b0RpYWdub3N0aWMoKV0sIG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHJlYW5hbHlzaXMgIT09IG51bGwpIHtcbiAgICAgICAgcHJlYW5hbHl6ZVF1ZXVlIS5wdXNoKHByZWFuYWx5c2lzLnRoZW4oYW5hbHl6ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW5hbHl6ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBhbmFseXplVHJhaXQoXG4gICAgICBjbGF6ejogQ2xhc3NEZWNsYXJhdGlvbiwgdHJhaXQ6IFRyYWl0PHVua25vd24sIHVua25vd24sIFNlbWFudGljU3ltYm9sfG51bGwsIHVua25vd24+LFxuICAgICAgZmxhZ3M/OiBIYW5kbGVyRmxhZ3MpOiB2b2lkIHtcbiAgICBpZiAodHJhaXQuc3RhdGUgIT09IFRyYWl0U3RhdGUuUGVuZGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBdHRlbXB0IHRvIGFuYWx5emUgdHJhaXQgb2YgJHtjbGF6ei5uYW1lLnRleHR9IGluIHN0YXRlICR7XG4gICAgICAgICAgVHJhaXRTdGF0ZVt0cmFpdC5zdGF0ZV19IChleHBlY3RlZCBERVRFQ1RFRClgKTtcbiAgICB9XG5cbiAgICB0aGlzLnBlcmYuZXZlbnRDb3VudChQZXJmRXZlbnQuVHJhaXRBbmFseXplKTtcblxuICAgIC8vIEF0dGVtcHQgYW5hbHlzaXMuIFRoaXMgY291bGQgZmFpbCB3aXRoIGEgYEZhdGFsRGlhZ25vc3RpY0Vycm9yYDsgY2F0Y2ggaXQgaWYgaXQgZG9lcy5cbiAgICBsZXQgcmVzdWx0OiBBbmFseXNpc091dHB1dDx1bmtub3duPjtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdHJhaXQuaGFuZGxlci5hbmFseXplKGNsYXp6LCB0cmFpdC5kZXRlY3RlZC5tZXRhZGF0YSwgZmxhZ3MpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEZhdGFsRGlhZ25vc3RpY0Vycm9yKSB7XG4gICAgICAgIHRyYWl0LnRvQW5hbHl6ZWQobnVsbCwgW2Vyci50b0RpYWdub3N0aWMoKV0sIG51bGwpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc3ltYm9sID0gdGhpcy5tYWtlU3ltYm9sRm9yVHJhaXQodHJhaXQuaGFuZGxlciwgY2xhenosIHJlc3VsdC5hbmFseXNpcyA/PyBudWxsKTtcbiAgICBpZiAocmVzdWx0LmFuYWx5c2lzICE9PSB1bmRlZmluZWQgJiYgdHJhaXQuaGFuZGxlci5yZWdpc3RlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0cmFpdC5oYW5kbGVyLnJlZ2lzdGVyKGNsYXp6LCByZXN1bHQuYW5hbHlzaXMpO1xuICAgIH1cbiAgICB0cmFpdCA9IHRyYWl0LnRvQW5hbHl6ZWQocmVzdWx0LmFuYWx5c2lzID8/IG51bGwsIHJlc3VsdC5kaWFnbm9zdGljcyA/PyBudWxsLCBzeW1ib2wpO1xuICB9XG5cbiAgcmVzb2x2ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBjbGFzc2VzID0gQXJyYXkuZnJvbSh0aGlzLmNsYXNzZXMua2V5cygpKTtcbiAgICBmb3IgKGNvbnN0IGNsYXp6IG9mIGNsYXNzZXMpIHtcbiAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY2xhc3Nlcy5nZXQoY2xhenopITtcbiAgICAgIGZvciAobGV0IHRyYWl0IG9mIHJlY29yZC50cmFpdHMpIHtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHRyYWl0LmhhbmRsZXI7XG4gICAgICAgIHN3aXRjaCAodHJhaXQuc3RhdGUpIHtcbiAgICAgICAgICBjYXNlIFRyYWl0U3RhdGUuU2tpcHBlZDpcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIGNhc2UgVHJhaXRTdGF0ZS5QZW5kaW5nOlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXNvbHZpbmcgYSB0cmFpdCB0aGF0IGhhc24ndCBiZWVuIGFuYWx5emVkOiAke2NsYXp6Lm5hbWUudGV4dH0gLyAke1xuICAgICAgICAgICAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZih0cmFpdC5oYW5kbGVyKS5jb25zdHJ1Y3Rvci5uYW1lfWApO1xuICAgICAgICAgIGNhc2UgVHJhaXRTdGF0ZS5SZXNvbHZlZDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVzb2x2aW5nIGFuIGFscmVhZHkgcmVzb2x2ZWQgdHJhaXRgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0cmFpdC5hbmFseXNpcyA9PT0gbnVsbCkge1xuICAgICAgICAgIC8vIE5vIGFuYWx5c2lzIHJlc3VsdHMsIGNhbm5vdCBmdXJ0aGVyIHByb2Nlc3MgdGhpcyB0cmFpdC5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYW5kbGVyLnJlc29sdmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIE5vIHJlc29sdXRpb24gb2YgdGhpcyB0cmFpdCBuZWVkZWQgLSBpdCdzIGNvbnNpZGVyZWQgc3VjY2Vzc2Z1bCBieSBkZWZhdWx0LlxuICAgICAgICAgIHRyYWl0ID0gdHJhaXQudG9SZXNvbHZlZChudWxsLCBudWxsKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXN1bHQ6IFJlc29sdmVSZXN1bHQ8dW5rbm93bj47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmVzdWx0ID0gaGFuZGxlci5yZXNvbHZlKGNsYXp6LCB0cmFpdC5hbmFseXNpcyBhcyBSZWFkb25seTx1bmtub3duPiwgdHJhaXQuc3ltYm9sKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEZhdGFsRGlhZ25vc3RpY0Vycm9yKSB7XG4gICAgICAgICAgICB0cmFpdCA9IHRyYWl0LnRvUmVzb2x2ZWQobnVsbCwgW2Vyci50b0RpYWdub3N0aWMoKV0pO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0cmFpdCA9IHRyYWl0LnRvUmVzb2x2ZWQocmVzdWx0LmRhdGEgPz8gbnVsbCwgcmVzdWx0LmRpYWdub3N0aWNzID8/IG51bGwpO1xuXG4gICAgICAgIGlmIChyZXN1bHQucmVleHBvcnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGNsYXp6LmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZTtcbiAgICAgICAgICBpZiAoIXRoaXMucmVleHBvcnRNYXAuaGFzKGZpbGVOYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5yZWV4cG9ydE1hcC5zZXQoZmlsZU5hbWUsIG5ldyBNYXA8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPigpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZmlsZVJlZXhwb3J0cyA9IHRoaXMucmVleHBvcnRNYXAuZ2V0KGZpbGVOYW1lKSE7XG4gICAgICAgICAgZm9yIChjb25zdCByZWV4cG9ydCBvZiByZXN1bHQucmVleHBvcnRzKSB7XG4gICAgICAgICAgICBmaWxlUmVleHBvcnRzLnNldChyZWV4cG9ydC5hc0FsaWFzLCBbcmVleHBvcnQuZnJvbU1vZHVsZSwgcmVleHBvcnQuc3ltYm9sTmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSB0eXBlLWNoZWNraW5nIGNvZGUgaW50byB0aGUgYFR5cGVDaGVja0NvbnRleHRgIGZvciBhbnkgY29tcG9uZW50cyB3aXRoaW4gdGhlIGdpdmVuXG4gICAqIGB0cy5Tb3VyY2VGaWxlYC5cbiAgICovXG4gIHR5cGVDaGVjayhzZjogdHMuU291cmNlRmlsZSwgY3R4OiBUeXBlQ2hlY2tDb250ZXh0KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmZpbGVUb0NsYXNzZXMuaGFzKHNmKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2xhenogb2YgdGhpcy5maWxlVG9DbGFzc2VzLmdldChzZikhKSB7XG4gICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNsYXNzZXMuZ2V0KGNsYXp6KSE7XG4gICAgICBmb3IgKGNvbnN0IHRyYWl0IG9mIHJlY29yZC50cmFpdHMpIHtcbiAgICAgICAgaWYgKHRyYWl0LnN0YXRlICE9PSBUcmFpdFN0YXRlLlJlc29sdmVkKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSBpZiAodHJhaXQuaGFuZGxlci50eXBlQ2hlY2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFpdC5yZXNvbHV0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgdHJhaXQuaGFuZGxlci50eXBlQ2hlY2soY3R4LCBjbGF6eiwgdHJhaXQuYW5hbHlzaXMsIHRyYWl0LnJlc29sdXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5kZXgoY3R4OiBJbmRleGluZ0NvbnRleHQpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGNsYXp6IG9mIHRoaXMuY2xhc3Nlcy5rZXlzKCkpIHtcbiAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY2xhc3Nlcy5nZXQoY2xhenopITtcbiAgICAgIGZvciAoY29uc3QgdHJhaXQgb2YgcmVjb3JkLnRyYWl0cykge1xuICAgICAgICBpZiAodHJhaXQuc3RhdGUgIT09IFRyYWl0U3RhdGUuUmVzb2x2ZWQpIHtcbiAgICAgICAgICAvLyBTa2lwIHRyYWl0cyB0aGF0IGhhdmVuJ3QgYmVlbiByZXNvbHZlZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSBpZiAodHJhaXQuaGFuZGxlci5pbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gU2tpcCB0cmFpdHMgdGhhdCBkb24ndCBhZmZlY3QgaW5kZXhpbmcuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHJhaXQucmVzb2x1dGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgIHRyYWl0LmhhbmRsZXIuaW5kZXgoY3R4LCBjbGF6eiwgdHJhaXQuYW5hbHlzaXMsIHRyYWl0LnJlc29sdXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgeGkxOG4oYnVuZGxlOiBYaTE4bkNvbnRleHQpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGNsYXp6IG9mIHRoaXMuY2xhc3Nlcy5rZXlzKCkpIHtcbiAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY2xhc3Nlcy5nZXQoY2xhenopITtcbiAgICAgIGZvciAoY29uc3QgdHJhaXQgb2YgcmVjb3JkLnRyYWl0cykge1xuICAgICAgICBpZiAodHJhaXQuc3RhdGUgIT09IFRyYWl0U3RhdGUuQW5hbHl6ZWQgJiYgdHJhaXQuc3RhdGUgIT09IFRyYWl0U3RhdGUuUmVzb2x2ZWQpIHtcbiAgICAgICAgICAvLyBTa2lwIHRyYWl0cyB0aGF0IGhhdmVuJ3QgYmVlbiBhbmFseXplZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSBpZiAodHJhaXQuaGFuZGxlci54aTE4biA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gU2tpcCB0cmFpdHMgdGhhdCBkb24ndCBzdXBwb3J0IHhpMThuLlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRyYWl0LmFuYWx5c2lzICE9PSBudWxsKSB7XG4gICAgICAgICAgdHJhaXQuaGFuZGxlci54aTE4bihidW5kbGUsIGNsYXp6LCB0cmFpdC5hbmFseXNpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVSZXNvdXJjZXMoY2xheno6IERlY2xhcmF0aW9uTm9kZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5yZWZsZWN0b3IuaXNDbGFzcyhjbGF6eikgfHwgIXRoaXMuY2xhc3Nlcy5oYXMoY2xhenopKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY2xhc3Nlcy5nZXQoY2xhenopITtcbiAgICBmb3IgKGNvbnN0IHRyYWl0IG9mIHJlY29yZC50cmFpdHMpIHtcbiAgICAgIGlmICh0cmFpdC5zdGF0ZSAhPT0gVHJhaXRTdGF0ZS5SZXNvbHZlZCB8fCB0cmFpdC5oYW5kbGVyLnVwZGF0ZVJlc291cmNlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0cmFpdC5oYW5kbGVyLnVwZGF0ZVJlc291cmNlcyhjbGF6eiwgdHJhaXQuYW5hbHlzaXMsIHRyYWl0LnJlc29sdXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBpbGUoY2xheno6IERlY2xhcmF0aW9uTm9kZSwgY29uc3RhbnRQb29sOiBDb25zdGFudFBvb2wpOiBDb21waWxlUmVzdWx0W118bnVsbCB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSB0cy5nZXRPcmlnaW5hbE5vZGUoY2xhenopIGFzIHR5cGVvZiBjbGF6ejtcbiAgICBpZiAoIXRoaXMucmVmbGVjdG9yLmlzQ2xhc3MoY2xhenopIHx8ICF0aGlzLnJlZmxlY3Rvci5pc0NsYXNzKG9yaWdpbmFsKSB8fFxuICAgICAgICAhdGhpcy5jbGFzc2VzLmhhcyhvcmlnaW5hbCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY2xhc3Nlcy5nZXQob3JpZ2luYWwpITtcblxuICAgIGxldCByZXM6IENvbXBpbGVSZXN1bHRbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCB0cmFpdCBvZiByZWNvcmQudHJhaXRzKSB7XG4gICAgICBpZiAodHJhaXQuc3RhdGUgIT09IFRyYWl0U3RhdGUuUmVzb2x2ZWQgfHwgdHJhaXQuYW5hbHlzaXNEaWFnbm9zdGljcyAhPT0gbnVsbCB8fFxuICAgICAgICAgIHRyYWl0LnJlc29sdmVEaWFnbm9zdGljcyAhPT0gbnVsbCkge1xuICAgICAgICAvLyBDYW5ub3QgY29tcGlsZSBhIHRyYWl0IHRoYXQgaXMgbm90IHJlc29sdmVkLCBvciBoYWQgYW55IGVycm9ycyBpbiBpdHMgZGVjbGFyYXRpb24uXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBgdHJhaXQucmVzb2x1dGlvbmAgaXMgbm9uLW51bGwgYXNzZXJ0ZWQgaGVyZSBiZWNhdXNlIFR5cGVTY3JpcHQgZG9lcyBub3QgcmVjb2duaXplIHRoYXRcbiAgICAgIC8vIGBSZWFkb25seTx1bmtub3duPmAgaXMgbnVsbGFibGUgKGFzIGB1bmtub3duYCBpdHNlbGYgaXMgbnVsbGFibGUpIGR1ZSB0byB0aGUgd2F5IHRoYXRcbiAgICAgIC8vIGBSZWFkb25seWAgd29ya3MuXG5cbiAgICAgIGxldCBjb21waWxlUmVzOiBDb21waWxlUmVzdWx0fENvbXBpbGVSZXN1bHRbXTtcbiAgICAgIGlmICh0aGlzLmNvbXBpbGF0aW9uTW9kZSA9PT0gQ29tcGlsYXRpb25Nb2RlLlBBUlRJQUwgJiZcbiAgICAgICAgICB0cmFpdC5oYW5kbGVyLmNvbXBpbGVQYXJ0aWFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcGlsZVJlcyA9IHRyYWl0LmhhbmRsZXIuY29tcGlsZVBhcnRpYWwoY2xhenosIHRyYWl0LmFuYWx5c2lzLCB0cmFpdC5yZXNvbHV0aW9uISk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21waWxlUmVzID1cbiAgICAgICAgICAgIHRyYWl0LmhhbmRsZXIuY29tcGlsZUZ1bGwoY2xhenosIHRyYWl0LmFuYWx5c2lzLCB0cmFpdC5yZXNvbHV0aW9uISwgY29uc3RhbnRQb29sKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29tcGlsZU1hdGNoUmVzID0gY29tcGlsZVJlcztcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbXBpbGVNYXRjaFJlcykpIHtcbiAgICAgICAgZm9yIChjb25zdCByZXN1bHQgb2YgY29tcGlsZU1hdGNoUmVzKSB7XG4gICAgICAgICAgaWYgKCFyZXMuc29tZShyID0+IHIubmFtZSA9PT0gcmVzdWx0Lm5hbWUpKSB7XG4gICAgICAgICAgICByZXMucHVzaChyZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghcmVzLnNvbWUocmVzdWx0ID0+IHJlc3VsdC5uYW1lID09PSBjb21waWxlTWF0Y2hSZXMubmFtZSkpIHtcbiAgICAgICAgcmVzLnB1c2goY29tcGlsZU1hdGNoUmVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMb29rIHVwIHRoZSAuZC50cyB0cmFuc2Zvcm1lciBmb3IgdGhlIGlucHV0IGZpbGUgYW5kIHJlY29yZCB0aGF0IGF0IGxlYXN0IG9uZSBmaWVsZCB3YXNcbiAgICAvLyBnZW5lcmF0ZWQsIHdoaWNoIHdpbGwgYWxsb3cgdGhlIC5kLnRzIHRvIGJlIHRyYW5zZm9ybWVkIGxhdGVyLlxuICAgIHRoaXMuZHRzVHJhbnNmb3Jtcy5nZXRJdnlEZWNsYXJhdGlvblRyYW5zZm9ybShvcmlnaW5hbC5nZXRTb3VyY2VGaWxlKCkpXG4gICAgICAgIC5hZGRGaWVsZHMob3JpZ2luYWwsIHJlcyk7XG5cbiAgICAvLyBSZXR1cm4gdGhlIGluc3RydWN0aW9uIHRvIHRoZSB0cmFuc2Zvcm1lciBzbyB0aGUgZmllbGRzIHdpbGwgYmUgYWRkZWQuXG4gICAgcmV0dXJuIHJlcy5sZW5ndGggPiAwID8gcmVzIDogbnVsbDtcbiAgfVxuXG4gIGRlY29yYXRvcnNGb3Iobm9kZTogdHMuRGVjbGFyYXRpb24pOiB0cy5EZWNvcmF0b3JbXSB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSB0cy5nZXRPcmlnaW5hbE5vZGUobm9kZSkgYXMgdHlwZW9mIG5vZGU7XG4gICAgaWYgKCF0aGlzLnJlZmxlY3Rvci5pc0NsYXNzKG9yaWdpbmFsKSB8fCAhdGhpcy5jbGFzc2VzLmhhcyhvcmlnaW5hbCkpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNsYXNzZXMuZ2V0KG9yaWdpbmFsKSE7XG4gICAgY29uc3QgZGVjb3JhdG9yczogdHMuRGVjb3JhdG9yW10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgdHJhaXQgb2YgcmVjb3JkLnRyYWl0cykge1xuICAgICAgaWYgKHRyYWl0LnN0YXRlICE9PSBUcmFpdFN0YXRlLlJlc29sdmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHJhaXQuZGV0ZWN0ZWQudHJpZ2dlciAhPT0gbnVsbCAmJiB0cy5pc0RlY29yYXRvcih0cmFpdC5kZXRlY3RlZC50cmlnZ2VyKSkge1xuICAgICAgICBkZWNvcmF0b3JzLnB1c2godHJhaXQuZGV0ZWN0ZWQudHJpZ2dlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlY29yYXRvcnM7XG4gIH1cblxuICBnZXQgZGlhZ25vc3RpY3MoKTogUmVhZG9ubHlBcnJheTx0cy5EaWFnbm9zdGljPiB7XG4gICAgY29uc3QgZGlhZ25vc3RpY3M6IHRzLkRpYWdub3N0aWNbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgY2xhenogb2YgdGhpcy5jbGFzc2VzLmtleXMoKSkge1xuICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jbGFzc2VzLmdldChjbGF6eikhO1xuICAgICAgaWYgKHJlY29yZC5tZXRhRGlhZ25vc3RpY3MgIT09IG51bGwpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCguLi5yZWNvcmQubWV0YURpYWdub3N0aWNzKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgdHJhaXQgb2YgcmVjb3JkLnRyYWl0cykge1xuICAgICAgICBpZiAoKHRyYWl0LnN0YXRlID09PSBUcmFpdFN0YXRlLkFuYWx5emVkIHx8IHRyYWl0LnN0YXRlID09PSBUcmFpdFN0YXRlLlJlc29sdmVkKSAmJlxuICAgICAgICAgICAgdHJhaXQuYW5hbHlzaXNEaWFnbm9zdGljcyAhPT0gbnVsbCkge1xuICAgICAgICAgIGRpYWdub3N0aWNzLnB1c2goLi4udHJhaXQuYW5hbHlzaXNEaWFnbm9zdGljcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYWl0LnN0YXRlID09PSBUcmFpdFN0YXRlLlJlc29sdmVkICYmIHRyYWl0LnJlc29sdmVEaWFnbm9zdGljcyAhPT0gbnVsbCkge1xuICAgICAgICAgIGRpYWdub3N0aWNzLnB1c2goLi4udHJhaXQucmVzb2x2ZURpYWdub3N0aWNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGlhZ25vc3RpY3M7XG4gIH1cblxuICBnZXQgZXhwb3J0U3RhdGVtZW50cygpOiBNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPj4ge1xuICAgIHJldHVybiB0aGlzLnJlZXhwb3J0TWFwO1xuICB9XG59XG4iXX0=