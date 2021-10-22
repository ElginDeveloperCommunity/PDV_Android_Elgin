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
        define("@angular/compiler-cli/src/ngtsc/incremental/src/incremental", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/perf", "@angular/compiler-cli/src/ngtsc/program_driver", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/incremental/semantic_graph", "@angular/compiler-cli/src/ngtsc/incremental/src/dependency_tracking", "@angular/compiler-cli/src/ngtsc/incremental/src/state"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IncrementalCompilation = void 0;
    var tslib_1 = require("tslib");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var perf_1 = require("@angular/compiler-cli/src/ngtsc/perf");
    var program_driver_1 = require("@angular/compiler-cli/src/ngtsc/program_driver");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var semantic_graph_1 = require("@angular/compiler-cli/src/ngtsc/incremental/semantic_graph");
    var dependency_tracking_1 = require("@angular/compiler-cli/src/ngtsc/incremental/src/dependency_tracking");
    var state_1 = require("@angular/compiler-cli/src/ngtsc/incremental/src/state");
    /**
     * Discriminant of the `Phase` type union.
     */
    var PhaseKind;
    (function (PhaseKind) {
        PhaseKind[PhaseKind["Analysis"] = 0] = "Analysis";
        PhaseKind[PhaseKind["TypeCheckAndEmit"] = 1] = "TypeCheckAndEmit";
    })(PhaseKind || (PhaseKind = {}));
    /**
     * Manages the incremental portion of an Angular compilation, allowing for reuse of a prior
     * compilation if available, and producing an output state for reuse of the current compilation in a
     * future one.
     */
    var IncrementalCompilation = /** @class */ (function () {
        function IncrementalCompilation(state, depGraph, versions, step) {
            this.depGraph = depGraph;
            this.versions = versions;
            this.step = step;
            this._state = state;
            // The compilation begins in analysis phase.
            this.phase = {
                kind: PhaseKind.Analysis,
                semanticDepGraphUpdater: new semantic_graph_1.SemanticDepGraphUpdater(step !== null ? step.priorState.semanticDepGraph : null),
            };
        }
        /**
         * Begin a fresh `IncrementalCompilation`.
         */
        IncrementalCompilation.fresh = function (program, versions) {
            var state = {
                kind: state_1.IncrementalStateKind.Fresh,
            };
            return new IncrementalCompilation(state, new dependency_tracking_1.FileDependencyGraph(), versions, /* reuse */ null);
        };
        IncrementalCompilation.incremental = function (program, newVersions, oldProgram, oldState, modifiedResourceFiles, perf) {
            return perf.inPhase(perf_1.PerfPhase.Reconciliation, function () {
                var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e;
                var physicallyChangedTsFiles = new Set();
                var changedResourceFiles = new Set(modifiedResourceFiles !== null && modifiedResourceFiles !== void 0 ? modifiedResourceFiles : []);
                var priorAnalysis;
                switch (oldState.kind) {
                    case state_1.IncrementalStateKind.Fresh:
                        // Since this line of program has never been successfully analyzed to begin with, treat
                        // this as a fresh compilation.
                        return IncrementalCompilation.fresh(program, newVersions);
                    case state_1.IncrementalStateKind.Analyzed:
                        // The most recent program was analyzed successfully, so we can use that as our prior
                        // state and don't need to consider any other deltas except changes in the most recent
                        // program.
                        priorAnalysis = oldState;
                        break;
                    case state_1.IncrementalStateKind.Delta:
                        // There is an ancestor program which was analyzed successfully and can be used as a
                        // starting point, but we need to determine what's changed since that program.
                        priorAnalysis = oldState.lastAnalyzedState;
                        try {
                            for (var _f = tslib_1.__values(oldState.physicallyChangedTsFiles), _g = _f.next(); !_g.done; _g = _f.next()) {
                                var sfPath = _g.value;
                                physicallyChangedTsFiles.add(sfPath);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        try {
                            for (var _h = tslib_1.__values(oldState.changedResourceFiles), _j = _h.next(); !_j.done; _j = _h.next()) {
                                var resourcePath = _j.value;
                                changedResourceFiles.add(resourcePath);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        break;
                }
                var oldVersions = priorAnalysis.versions;
                var oldFilesArray = oldProgram.getSourceFiles().map(toOriginalSourceFile);
                var oldFiles = new Set(oldFilesArray);
                var deletedTsFiles = new Set(oldFilesArray.map(function (sf) { return file_system_1.absoluteFromSourceFile(sf); }));
                try {
                    for (var _k = tslib_1.__values(program.getSourceFiles()), _l = _k.next(); !_l.done; _l = _k.next()) {
                        var possiblyRedirectedNewFile = _l.value;
                        var sf = toOriginalSourceFile(possiblyRedirectedNewFile);
                        var sfPath = file_system_1.absoluteFromSourceFile(sf);
                        // Since we're seeing a file in the incoming program with this name, it can't have been
                        // deleted.
                        deletedTsFiles.delete(sfPath);
                        if (oldFiles.has(sf)) {
                            // This source file has the same object identity as in the previous program. We need to
                            // determine if it's really the same file, or if it might have changed versions since the
                            // last program without changing its identity.
                            // If there's no version information available, then this is the same file, and we can
                            // skip it.
                            if (oldVersions === null || newVersions === null) {
                                continue;
                            }
                            // If a version is available for the file from both the prior and the current program, and
                            // that version is the same, then this is the same file, and we can skip it.
                            if (oldVersions.has(sfPath) && newVersions.has(sfPath) &&
                                oldVersions.get(sfPath) === newVersions.get(sfPath)) {
                                continue;
                            }
                            // Otherwise, assume that the file has changed. Either its versions didn't match, or we
                            // were missing version information about it on one side for some reason.
                        }
                        // Bail out if a .d.ts file changes - the semantic dep graph is not able to process such
                        // changes correctly yet.
                        if (sf.isDeclarationFile) {
                            return IncrementalCompilation.fresh(program, newVersions);
                        }
                        // The file has changed physically, so record it.
                        physicallyChangedTsFiles.add(sfPath);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                try {
                    // Remove any files that have been deleted from the list of physical changes.
                    for (var deletedTsFiles_1 = tslib_1.__values(deletedTsFiles), deletedTsFiles_1_1 = deletedTsFiles_1.next(); !deletedTsFiles_1_1.done; deletedTsFiles_1_1 = deletedTsFiles_1.next()) {
                        var deletedFileName = deletedTsFiles_1_1.value;
                        physicallyChangedTsFiles.delete(file_system_1.resolve(deletedFileName));
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (deletedTsFiles_1_1 && !deletedTsFiles_1_1.done && (_d = deletedTsFiles_1.return)) _d.call(deletedTsFiles_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                // Use the prior dependency graph to project physical changes into a set of logically changed
                // files.
                var depGraph = new dependency_tracking_1.FileDependencyGraph();
                var logicallyChangedTsFiles = depGraph.updateWithPhysicalChanges(priorAnalysis.depGraph, physicallyChangedTsFiles, deletedTsFiles, changedResourceFiles);
                try {
                    // Physically changed files aren't necessarily counted as logically changed by the dependency
                    // graph (files do not have edges to themselves), so add them to the logical changes
                    // explicitly.
                    for (var physicallyChangedTsFiles_1 = tslib_1.__values(physicallyChangedTsFiles), physicallyChangedTsFiles_1_1 = physicallyChangedTsFiles_1.next(); !physicallyChangedTsFiles_1_1.done; physicallyChangedTsFiles_1_1 = physicallyChangedTsFiles_1.next()) {
                        var sfPath = physicallyChangedTsFiles_1_1.value;
                        logicallyChangedTsFiles.add(sfPath);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (physicallyChangedTsFiles_1_1 && !physicallyChangedTsFiles_1_1.done && (_e = physicallyChangedTsFiles_1.return)) _e.call(physicallyChangedTsFiles_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                // Start off in a `DeltaIncrementalState` as a delta against the previous successful analysis,
                // until this compilation completes its own analysis.
                var state = {
                    kind: state_1.IncrementalStateKind.Delta,
                    physicallyChangedTsFiles: physicallyChangedTsFiles,
                    changedResourceFiles: changedResourceFiles,
                    lastAnalyzedState: priorAnalysis,
                };
                return new IncrementalCompilation(state, depGraph, newVersions, {
                    priorState: priorAnalysis,
                    logicallyChangedTsFiles: logicallyChangedTsFiles,
                });
            });
        };
        Object.defineProperty(IncrementalCompilation.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(IncrementalCompilation.prototype, "semanticDepGraphUpdater", {
            get: function () {
                if (this.phase.kind !== PhaseKind.Analysis) {
                    throw new Error("AssertionError: Cannot update the SemanticDepGraph after analysis completes");
                }
                return this.phase.semanticDepGraphUpdater;
            },
            enumerable: false,
            configurable: true
        });
        IncrementalCompilation.prototype.recordSuccessfulAnalysis = function (traitCompiler) {
            var e_6, _a, e_7, _b;
            if (this.phase.kind !== PhaseKind.Analysis) {
                throw new Error("AssertionError: Incremental compilation in phase " + PhaseKind[this.phase.kind] + ", expected Analysis");
            }
            var _c = this.phase.semanticDepGraphUpdater.finalize(), needsEmit = _c.needsEmit, needsTypeCheckEmit = _c.needsTypeCheckEmit, newGraph = _c.newGraph;
            // Determine the set of files which have already been emitted.
            var emitted;
            if (this.step === null) {
                // Since there is no prior compilation, no files have yet been emitted.
                emitted = new Set();
            }
            else {
                // Begin with the files emitted by the prior successful compilation, but remove those which we
                // know need to bee re-emitted.
                emitted = new Set(this.step.priorState.emitted);
                try {
                    // Files need re-emitted if they've logically changed.
                    for (var _d = tslib_1.__values(this.step.logicallyChangedTsFiles), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var sfPath = _e.value;
                        emitted.delete(sfPath);
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                try {
                    // Files need re-emitted if they've semantically changed.
                    for (var needsEmit_1 = tslib_1.__values(needsEmit), needsEmit_1_1 = needsEmit_1.next(); !needsEmit_1_1.done; needsEmit_1_1 = needsEmit_1.next()) {
                        var sfPath = needsEmit_1_1.value;
                        emitted.delete(sfPath);
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (needsEmit_1_1 && !needsEmit_1_1.done && (_b = needsEmit_1.return)) _b.call(needsEmit_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
            // Transition to a successfully analyzed compilation. At this point, a subsequent compilation
            // could use this state as a starting point.
            this._state = {
                kind: state_1.IncrementalStateKind.Analyzed,
                versions: this.versions,
                depGraph: this.depGraph,
                semanticDepGraph: newGraph,
                priorAnalysis: traitCompiler.getAnalyzedRecords(),
                typeCheckResults: null,
                emitted: emitted,
            };
            // We now enter the type-check and emit phase of compilation.
            this.phase = {
                kind: PhaseKind.TypeCheckAndEmit,
                needsEmit: needsEmit,
                needsTypeCheckEmit: needsTypeCheckEmit,
            };
        };
        IncrementalCompilation.prototype.recordSuccessfulTypeCheck = function (results) {
            if (this._state.kind !== state_1.IncrementalStateKind.Analyzed) {
                throw new Error("AssertionError: Expected successfully analyzed compilation.");
            }
            else if (this.phase.kind !== PhaseKind.TypeCheckAndEmit) {
                throw new Error("AssertionError: Incremental compilation in phase " + PhaseKind[this.phase.kind] + ", expected TypeCheck");
            }
            this._state.typeCheckResults = results;
        };
        IncrementalCompilation.prototype.recordSuccessfulEmit = function (sf) {
            if (this._state.kind !== state_1.IncrementalStateKind.Analyzed) {
                throw new Error("AssertionError: Expected successfully analyzed compilation.");
            }
            this._state.emitted.add(file_system_1.absoluteFromSourceFile(sf));
        };
        IncrementalCompilation.prototype.priorAnalysisFor = function (sf) {
            if (this.step === null) {
                return null;
            }
            var sfPath = file_system_1.absoluteFromSourceFile(sf);
            // If the file has logically changed, its previous analysis cannot be reused.
            if (this.step.logicallyChangedTsFiles.has(sfPath)) {
                return null;
            }
            var priorAnalysis = this.step.priorState.priorAnalysis;
            if (!priorAnalysis.has(sf)) {
                return null;
            }
            return priorAnalysis.get(sf);
        };
        IncrementalCompilation.prototype.priorTypeCheckingResultsFor = function (sf) {
            if (this.phase.kind !== PhaseKind.TypeCheckAndEmit) {
                throw new Error("AssertionError: Expected successfully analyzed compilation.");
            }
            if (this.step === null) {
                return null;
            }
            var sfPath = file_system_1.absoluteFromSourceFile(sf);
            // If the file has logically changed, or its template type-checking results have semantically
            // changed, then past type-checking results cannot be reused.
            if (this.step.logicallyChangedTsFiles.has(sfPath) ||
                this.phase.needsTypeCheckEmit.has(sfPath)) {
                return null;
            }
            // Past results also cannot be reused if they're not available.
            if (this.step.priorState.typeCheckResults === null ||
                !this.step.priorState.typeCheckResults.has(sfPath)) {
                return null;
            }
            var priorResults = this.step.priorState.typeCheckResults.get(sfPath);
            // If the past results relied on inlining, they're not safe for reuse.
            if (priorResults.hasInlines) {
                return null;
            }
            return priorResults;
        };
        IncrementalCompilation.prototype.safeToSkipEmit = function (sf) {
            // If this is a fresh compilation, it's never safe to skip an emit.
            if (this.step === null) {
                return false;
            }
            var sfPath = file_system_1.absoluteFromSourceFile(sf);
            // If the file has itself logically changed, it must be emitted.
            if (this.step.logicallyChangedTsFiles.has(sfPath)) {
                return false;
            }
            if (this.phase.kind !== PhaseKind.TypeCheckAndEmit) {
                throw new Error("AssertionError: Expected successful analysis before attempting to emit files");
            }
            // If during analysis it was determined that this file has semantically changed, it must be
            // emitted.
            if (this.phase.needsEmit.has(sfPath)) {
                return false;
            }
            // Generally it should be safe to assume here that the file was previously emitted by the last
            // successful compilation. However, as a defense-in-depth against incorrectness, we explicitly
            // check that the last emit included this file, and re-emit it otherwise.
            return this.step.priorState.emitted.has(sfPath);
        };
        return IncrementalCompilation;
    }());
    exports.IncrementalCompilation = IncrementalCompilation;
    /**
     * To accurately detect whether a source file was affected during an incremental rebuild, the
     * "original" source file needs to be consistently used.
     *
     * First, TypeScript may have created source file redirects when declaration files of the same
     * version of a library are included multiple times. The non-redirected source file should be used
     * to detect changes, as otherwise the redirected source files cause a mismatch when compared to
     * a prior program.
     *
     * Second, the program that is used for template type checking may contain mutated source files, if
     * inline type constructors or inline template type-check blocks had to be used. Such source files
     * store their original, non-mutated source file from the original program in a symbol. For
     * computing the affected files in an incremental build this original source file should be used, as
     * the mutated source file would always be considered affected.
     */
    function toOriginalSourceFile(sf) {
        var unredirectedSf = typescript_1.toUnredirectedSourceFile(sf);
        var originalFile = unredirectedSf[program_driver_1.NgOriginalFile];
        if (originalFile !== undefined) {
            return originalFile;
        }
        else {
            return unredirectedSf;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5jcmVtZW50YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2luY3JlbWVudGFsL3NyYy9pbmNyZW1lbnRhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBSUgsMkVBQWtGO0lBQ2xGLDZEQUFtRDtJQUNuRCxpRkFBcUY7SUFHckYsa0ZBQW1FO0lBRW5FLDZGQUEwRDtJQUUxRCwyR0FBMEQ7SUFDMUQsK0VBQWdIO0lBV2hIOztPQUVHO0lBQ0gsSUFBSyxTQUdKO0lBSEQsV0FBSyxTQUFTO1FBQ1osaURBQVEsQ0FBQTtRQUNSLGlFQUFnQixDQUFBO0lBQ2xCLENBQUMsRUFISSxTQUFTLEtBQVQsU0FBUyxRQUdiO0lBeUJEOzs7O09BSUc7SUFDSDtRQVdFLGdDQUNJLEtBQXVCLEVBQVcsUUFBNkIsRUFDdkQsUUFBMEMsRUFBVSxJQUEwQjtZQURwRCxhQUFRLEdBQVIsUUFBUSxDQUFxQjtZQUN2RCxhQUFRLEdBQVIsUUFBUSxDQUFrQztZQUFVLFNBQUksR0FBSixJQUFJLENBQXNCO1lBQ3hGLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBRXBCLDRDQUE0QztZQUM1QyxJQUFJLENBQUMsS0FBSyxHQUFHO2dCQUNYLElBQUksRUFBRSxTQUFTLENBQUMsUUFBUTtnQkFDeEIsdUJBQXVCLEVBQ25CLElBQUksd0NBQXVCLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2FBQ3pGLENBQUM7UUFDSixDQUFDO1FBRUQ7O1dBRUc7UUFDSSw0QkFBSyxHQUFaLFVBQWEsT0FBbUIsRUFBRSxRQUEwQztZQUUxRSxJQUFNLEtBQUssR0FBcUI7Z0JBQzlCLElBQUksRUFBRSw0QkFBb0IsQ0FBQyxLQUFLO2FBQ2pDLENBQUM7WUFDRixPQUFPLElBQUksc0JBQXNCLENBQUMsS0FBSyxFQUFFLElBQUkseUNBQW1CLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xHLENBQUM7UUFFTSxrQ0FBVyxHQUFsQixVQUNJLE9BQW1CLEVBQUUsV0FBNkMsRUFBRSxVQUFzQixFQUMxRixRQUEwQixFQUFFLHFCQUErQyxFQUMzRSxJQUFrQjtZQUNwQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQVMsQ0FBQyxjQUFjLEVBQUU7O2dCQUM1QyxJQUFNLHdCQUF3QixHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO2dCQUMzRCxJQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFpQixxQkFBcUIsYUFBckIscUJBQXFCLGNBQXJCLHFCQUFxQixHQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUdsRixJQUFJLGFBQXVDLENBQUM7Z0JBQzVDLFFBQVEsUUFBUSxDQUFDLElBQUksRUFBRTtvQkFDckIsS0FBSyw0QkFBb0IsQ0FBQyxLQUFLO3dCQUM3Qix1RkFBdUY7d0JBQ3ZGLCtCQUErQjt3QkFDL0IsT0FBTyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO29CQUM1RCxLQUFLLDRCQUFvQixDQUFDLFFBQVE7d0JBQ2hDLHFGQUFxRjt3QkFDckYsc0ZBQXNGO3dCQUN0RixXQUFXO3dCQUNYLGFBQWEsR0FBRyxRQUFRLENBQUM7d0JBQ3pCLE1BQU07b0JBQ1IsS0FBSyw0QkFBb0IsQ0FBQyxLQUFLO3dCQUM3QixvRkFBb0Y7d0JBQ3BGLDhFQUE4RTt3QkFDOUUsYUFBYSxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQzs7NEJBQzNDLEtBQXFCLElBQUEsS0FBQSxpQkFBQSxRQUFRLENBQUMsd0JBQXdCLENBQUEsZ0JBQUEsNEJBQUU7Z0NBQW5ELElBQU0sTUFBTSxXQUFBO2dDQUNmLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs2QkFDdEM7Ozs7Ozs7Ozs7NEJBQ0QsS0FBMkIsSUFBQSxLQUFBLGlCQUFBLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQSxnQkFBQSw0QkFBRTtnQ0FBckQsSUFBTSxZQUFZLFdBQUE7Z0NBQ3JCLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzs2QkFDeEM7Ozs7Ozs7Ozt3QkFDRCxNQUFNO2lCQUNUO2dCQUVELElBQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUM7Z0JBRTNDLElBQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFDNUUsSUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3hDLElBQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxvQ0FBc0IsQ0FBQyxFQUFFLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDLENBQUM7O29CQUVwRixLQUF3QyxJQUFBLEtBQUEsaUJBQUEsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFBLGdCQUFBLDRCQUFFO3dCQUE3RCxJQUFNLHlCQUF5QixXQUFBO3dCQUNsQyxJQUFNLEVBQUUsR0FBRyxvQkFBb0IsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO3dCQUMzRCxJQUFNLE1BQU0sR0FBRyxvQ0FBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDMUMsdUZBQXVGO3dCQUN2RixXQUFXO3dCQUNYLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBRTlCLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTs0QkFDcEIsdUZBQXVGOzRCQUN2Rix5RkFBeUY7NEJBQ3pGLDhDQUE4Qzs0QkFFOUMsc0ZBQXNGOzRCQUN0RixXQUFXOzRCQUNYLElBQUksV0FBVyxLQUFLLElBQUksSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFO2dDQUNoRCxTQUFTOzZCQUNWOzRCQUVELDBGQUEwRjs0QkFDMUYsNEVBQTRFOzRCQUM1RSxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0NBQ2xELFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFFLEtBQUssV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUUsRUFBRTtnQ0FDekQsU0FBUzs2QkFDVjs0QkFFRCx1RkFBdUY7NEJBQ3ZGLHlFQUF5RTt5QkFDMUU7d0JBRUQsd0ZBQXdGO3dCQUN4Rix5QkFBeUI7d0JBQ3pCLElBQUksRUFBRSxDQUFDLGlCQUFpQixFQUFFOzRCQUN4QixPQUFPLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7eUJBQzNEO3dCQUVELGlEQUFpRDt3QkFDakQsd0JBQXdCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUN0Qzs7Ozs7Ozs7OztvQkFFRCw2RUFBNkU7b0JBQzdFLEtBQThCLElBQUEsbUJBQUEsaUJBQUEsY0FBYyxDQUFBLDhDQUFBLDBFQUFFO3dCQUF6QyxJQUFNLGVBQWUsMkJBQUE7d0JBQ3hCLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxxQkFBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7cUJBQzNEOzs7Ozs7Ozs7Z0JBRUQsNkZBQTZGO2dCQUM3RixTQUFTO2dCQUNULElBQU0sUUFBUSxHQUFHLElBQUkseUNBQW1CLEVBQUUsQ0FBQztnQkFDM0MsSUFBTSx1QkFBdUIsR0FBRyxRQUFRLENBQUMseUJBQXlCLENBQzlELGFBQWEsQ0FBQyxRQUFRLEVBQUUsd0JBQXdCLEVBQUUsY0FBYyxFQUFFLG9CQUFvQixDQUFDLENBQUM7O29CQUU1Riw2RkFBNkY7b0JBQzdGLG9GQUFvRjtvQkFDcEYsY0FBYztvQkFDZCxLQUFxQixJQUFBLDZCQUFBLGlCQUFBLHdCQUF3QixDQUFBLGtFQUFBLHdHQUFFO3dCQUExQyxJQUFNLE1BQU0scUNBQUE7d0JBQ2YsdUJBQXVCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNyQzs7Ozs7Ozs7O2dCQUVELDhGQUE4RjtnQkFDOUYscURBQXFEO2dCQUNyRCxJQUFNLEtBQUssR0FBMEI7b0JBQ25DLElBQUksRUFBRSw0QkFBb0IsQ0FBQyxLQUFLO29CQUNoQyx3QkFBd0IsMEJBQUE7b0JBQ3hCLG9CQUFvQixzQkFBQTtvQkFDcEIsaUJBQWlCLEVBQUUsYUFBYTtpQkFDakMsQ0FBQztnQkFFRixPQUFPLElBQUksc0JBQXNCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUU7b0JBQzlELFVBQVUsRUFBRSxhQUFhO29CQUN6Qix1QkFBdUIseUJBQUE7aUJBQ3hCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELHNCQUFJLHlDQUFLO2lCQUFUO2dCQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNyQixDQUFDOzs7V0FBQTtRQUVELHNCQUFJLDJEQUF1QjtpQkFBM0I7Z0JBQ0UsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsUUFBUSxFQUFFO29CQUMxQyxNQUFNLElBQUksS0FBSyxDQUNYLDZFQUE2RSxDQUFDLENBQUM7aUJBQ3BGO2dCQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQztZQUM1QyxDQUFDOzs7V0FBQTtRQUVELHlEQUF3QixHQUF4QixVQUF5QixhQUE0Qjs7WUFDbkQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsUUFBUSxFQUFFO2dCQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLHNEQUNaLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyx3QkFBcUIsQ0FBQyxDQUFDO2FBQ3REO1lBRUssSUFBQSxLQUE0QyxJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxFQUF4RixTQUFTLGVBQUEsRUFBRSxrQkFBa0Isd0JBQUEsRUFBRSxRQUFRLGNBQWlELENBQUM7WUFFaEcsOERBQThEO1lBQzlELElBQUksT0FBNEIsQ0FBQztZQUNqQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO2dCQUN0Qix1RUFBdUU7Z0JBQ3ZFLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO2FBQ3JCO2lCQUFNO2dCQUNMLDhGQUE4RjtnQkFDOUYsK0JBQStCO2dCQUMvQixPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7O29CQUVoRCxzREFBc0Q7b0JBQ3RELEtBQXFCLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFBLGdCQUFBLDRCQUFFO3dCQUFuRCxJQUFNLE1BQU0sV0FBQTt3QkFDZixPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUN4Qjs7Ozs7Ozs7OztvQkFFRCx5REFBeUQ7b0JBQ3pELEtBQXFCLElBQUEsY0FBQSxpQkFBQSxTQUFTLENBQUEsb0NBQUEsMkRBQUU7d0JBQTNCLElBQU0sTUFBTSxzQkFBQTt3QkFDZixPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUN4Qjs7Ozs7Ozs7O2FBQ0Y7WUFFRCw2RkFBNkY7WUFDN0YsNENBQTRDO1lBQzVDLElBQUksQ0FBQyxNQUFNLEdBQUc7Z0JBQ1osSUFBSSxFQUFFLDRCQUFvQixDQUFDLFFBQVE7Z0JBQ25DLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixnQkFBZ0IsRUFBRSxRQUFRO2dCQUMxQixhQUFhLEVBQUUsYUFBYSxDQUFDLGtCQUFrQixFQUFFO2dCQUNqRCxnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixPQUFPLFNBQUE7YUFDUixDQUFDO1lBRUYsNkRBQTZEO1lBQzdELElBQUksQ0FBQyxLQUFLLEdBQUc7Z0JBQ1gsSUFBSSxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0I7Z0JBQ2hDLFNBQVMsV0FBQTtnQkFDVCxrQkFBa0Isb0JBQUE7YUFDbkIsQ0FBQztRQUNKLENBQUM7UUFFRCwwREFBeUIsR0FBekIsVUFBMEIsT0FBa0Q7WUFDMUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyw0QkFBb0IsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RELE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQzthQUNoRjtpQkFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDekQsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFDWixTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMseUJBQXNCLENBQUMsQ0FBQzthQUN2RDtZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO1FBQ3pDLENBQUM7UUFHRCxxREFBb0IsR0FBcEIsVUFBcUIsRUFBaUI7WUFDcEMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyw0QkFBb0IsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RELE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQzthQUNoRjtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFFRCxpREFBZ0IsR0FBaEIsVUFBaUIsRUFBaUI7WUFDaEMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDdEIsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELElBQU0sTUFBTSxHQUFHLG9DQUFzQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRTFDLDZFQUE2RTtZQUM3RSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNqRCxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1lBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUMxQixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsT0FBTyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBRSxDQUFDO1FBQ2hDLENBQUM7UUFFRCw0REFBMkIsR0FBM0IsVUFBNEIsRUFBaUI7WUFDM0MsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2xELE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQzthQUNoRjtZQUVELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3RCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFNLE1BQU0sR0FBRyxvQ0FBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUUxQyw2RkFBNkY7WUFDN0YsNkRBQTZEO1lBQzdELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDN0MsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELCtEQUErRDtZQUMvRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixLQUFLLElBQUk7Z0JBQzlDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN0RCxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1lBQ3hFLHNFQUFzRTtZQUN0RSxJQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUU7Z0JBQzNCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxPQUFPLFlBQVksQ0FBQztRQUN0QixDQUFDO1FBRUQsK0NBQWMsR0FBZCxVQUFlLEVBQWlCO1lBQzlCLG1FQUFtRTtZQUNuRSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO2dCQUN0QixPQUFPLEtBQUssQ0FBQzthQUNkO1lBRUQsSUFBTSxNQUFNLEdBQUcsb0NBQXNCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFMUMsZ0VBQWdFO1lBQ2hFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2pELE9BQU8sS0FBSyxDQUFDO2FBQ2Q7WUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDbEQsTUFBTSxJQUFJLEtBQUssQ0FDWCw4RUFBOEUsQ0FBQyxDQUFDO2FBQ3JGO1lBRUQsMkZBQTJGO1lBQzNGLFdBQVc7WUFDWCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDcEMsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUVELDhGQUE4RjtZQUM5Riw4RkFBOEY7WUFDOUYseUVBQXlFO1lBQ3pFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0gsNkJBQUM7SUFBRCxDQUFDLEFBclRELElBcVRDO0lBclRZLHdEQUFzQjtJQXVUbkM7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSCxTQUFTLG9CQUFvQixDQUFDLEVBQWlCO1FBQzdDLElBQU0sY0FBYyxHQUFHLHFDQUF3QixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELElBQU0sWUFBWSxHQUFJLGNBQWtELENBQUMsK0JBQWMsQ0FBQyxDQUFDO1FBQ3pGLElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRTtZQUM5QixPQUFPLFlBQVksQ0FBQztTQUNyQjthQUFNO1lBQ0wsT0FBTyxjQUFjLENBQUM7U0FDdkI7SUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2Fic29sdXRlRnJvbVNvdXJjZUZpbGUsIEFic29sdXRlRnNQYXRoLCByZXNvbHZlfSBmcm9tICcuLi8uLi9maWxlX3N5c3RlbSc7XG5pbXBvcnQge1BlcmZQaGFzZSwgUGVyZlJlY29yZGVyfSBmcm9tICcuLi8uLi9wZXJmJztcbmltcG9ydCB7TWF5YmVTb3VyY2VGaWxlV2l0aE9yaWdpbmFsRmlsZSwgTmdPcmlnaW5hbEZpbGV9IGZyb20gJy4uLy4uL3Byb2dyYW1fZHJpdmVyJztcbmltcG9ydCB7Q2xhc3NSZWNvcmQsIFRyYWl0Q29tcGlsZXJ9IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge0ZpbGVUeXBlQ2hlY2tpbmdEYXRhfSBmcm9tICcuLi8uLi90eXBlY2hlY2snO1xuaW1wb3J0IHt0b1VucmVkaXJlY3RlZFNvdXJjZUZpbGV9IGZyb20gJy4uLy4uL3V0aWwvc3JjL3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtJbmNyZW1lbnRhbEJ1aWxkfSBmcm9tICcuLi9hcGknO1xuaW1wb3J0IHtTZW1hbnRpY0RlcEdyYXBoVXBkYXRlcn0gZnJvbSAnLi4vc2VtYW50aWNfZ3JhcGgnO1xuXG5pbXBvcnQge0ZpbGVEZXBlbmRlbmN5R3JhcGh9IGZyb20gJy4vZGVwZW5kZW5jeV90cmFja2luZyc7XG5pbXBvcnQge0FuYWx5emVkSW5jcmVtZW50YWxTdGF0ZSwgRGVsdGFJbmNyZW1lbnRhbFN0YXRlLCBJbmNyZW1lbnRhbFN0YXRlLCBJbmNyZW1lbnRhbFN0YXRlS2luZH0gZnJvbSAnLi9zdGF0ZSc7XG5cbi8qKlxuICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIHByZXZpb3VzIGNvbXBpbGF0aW9uIGJlaW5nIHVzZWQgYXMgYSBzdGFydGluZyBwb2ludCBmb3IgdGhlIGN1cnJlbnQgb25lLFxuICogaW5jbHVkaW5nIHRoZSBkZWx0YSBvZiBmaWxlcyB3aGljaCBoYXZlIGxvZ2ljYWxseSBjaGFuZ2VkIGFuZCBuZWVkIHRvIGJlIHJlYW5hbHl6ZWQuXG4gKi9cbmludGVyZmFjZSBJbmNyZW1lbnRhbFN0ZXAge1xuICBwcmlvclN0YXRlOiBBbmFseXplZEluY3JlbWVudGFsU3RhdGU7XG4gIGxvZ2ljYWxseUNoYW5nZWRUc0ZpbGVzOiBTZXQ8QWJzb2x1dGVGc1BhdGg+O1xufVxuXG4vKipcbiAqIERpc2NyaW1pbmFudCBvZiB0aGUgYFBoYXNlYCB0eXBlIHVuaW9uLlxuICovXG5lbnVtIFBoYXNlS2luZCB7XG4gIEFuYWx5c2lzLFxuICBUeXBlQ2hlY2tBbmRFbWl0LFxufVxuXG4vKipcbiAqIEFuIGluY3JlbWVudGFsIGNvbXBpbGF0aW9uIHVuZGVyZ29pbmcgYW5hbHlzaXMsIGFuZCBidWlsZGluZyBhIHNlbWFudGljIGRlcGVuZGVuY3kgZ3JhcGguXG4gKi9cbmludGVyZmFjZSBBbmFseXNpc1BoYXNlIHtcbiAga2luZDogUGhhc2VLaW5kLkFuYWx5c2lzO1xuICBzZW1hbnRpY0RlcEdyYXBoVXBkYXRlcjogU2VtYW50aWNEZXBHcmFwaFVwZGF0ZXI7XG59XG5cbi8qKlxuICogQW4gaW5jcmVtZW50YWwgY29tcGlsYXRpb24gdGhhdCBjb21wbGV0ZWQgYW5hbHlzaXMgYW5kIGlzIHVuZGVyZ29pbmcgdGVtcGxhdGUgdHlwZS1jaGVja2luZyBhbmRcbiAqIGVtaXQuXG4gKi9cbmludGVyZmFjZSBUeXBlQ2hlY2tBbmRFbWl0UGhhc2Uge1xuICBraW5kOiBQaGFzZUtpbmQuVHlwZUNoZWNrQW5kRW1pdDtcbiAgbmVlZHNFbWl0OiBTZXQ8QWJzb2x1dGVGc1BhdGg+O1xuICBuZWVkc1R5cGVDaGVja0VtaXQ6IFNldDxBYnNvbHV0ZUZzUGF0aD47XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgY3VycmVudCBwaGFzZSBvZiBhIGNvbXBpbGF0aW9uLlxuICovXG50eXBlIFBoYXNlID0gQW5hbHlzaXNQaGFzZXxUeXBlQ2hlY2tBbmRFbWl0UGhhc2U7XG5cbi8qKlxuICogTWFuYWdlcyB0aGUgaW5jcmVtZW50YWwgcG9ydGlvbiBvZiBhbiBBbmd1bGFyIGNvbXBpbGF0aW9uLCBhbGxvd2luZyBmb3IgcmV1c2Ugb2YgYSBwcmlvclxuICogY29tcGlsYXRpb24gaWYgYXZhaWxhYmxlLCBhbmQgcHJvZHVjaW5nIGFuIG91dHB1dCBzdGF0ZSBmb3IgcmV1c2Ugb2YgdGhlIGN1cnJlbnQgY29tcGlsYXRpb24gaW4gYVxuICogZnV0dXJlIG9uZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEluY3JlbWVudGFsQ29tcGlsYXRpb24gaW1wbGVtZW50cyBJbmNyZW1lbnRhbEJ1aWxkPENsYXNzUmVjb3JkLCBGaWxlVHlwZUNoZWNraW5nRGF0YT4ge1xuICBwcml2YXRlIHBoYXNlOiBQaGFzZTtcblxuICAvKipcbiAgICogYEluY3JlbWVudGFsU3RhdGVgIG9mIHRoaXMgY29tcGlsYXRpb24gaWYgaXQgd2VyZSB0byBiZSByZXVzZWQgaW4gYSBzdWJzZXF1ZW50IGluY3JlbWVudGFsXG4gICAqIGNvbXBpbGF0aW9uIGF0IHRoZSBjdXJyZW50IG1vbWVudC5cbiAgICpcbiAgICogRXhwb3NlZCB2aWEgdGhlIGBzdGF0ZWAgcmVhZC1vbmx5IGdldHRlci5cbiAgICovXG4gIHByaXZhdGUgX3N0YXRlOiBJbmNyZW1lbnRhbFN0YXRlO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoXG4gICAgICBzdGF0ZTogSW5jcmVtZW50YWxTdGF0ZSwgcmVhZG9ubHkgZGVwR3JhcGg6IEZpbGVEZXBlbmRlbmN5R3JhcGgsXG4gICAgICBwcml2YXRlIHZlcnNpb25zOiBNYXA8QWJzb2x1dGVGc1BhdGgsIHN0cmluZz58bnVsbCwgcHJpdmF0ZSBzdGVwOiBJbmNyZW1lbnRhbFN0ZXB8bnVsbCkge1xuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG5cbiAgICAvLyBUaGUgY29tcGlsYXRpb24gYmVnaW5zIGluIGFuYWx5c2lzIHBoYXNlLlxuICAgIHRoaXMucGhhc2UgPSB7XG4gICAgICBraW5kOiBQaGFzZUtpbmQuQW5hbHlzaXMsXG4gICAgICBzZW1hbnRpY0RlcEdyYXBoVXBkYXRlcjpcbiAgICAgICAgICBuZXcgU2VtYW50aWNEZXBHcmFwaFVwZGF0ZXIoc3RlcCAhPT0gbnVsbCA/IHN0ZXAucHJpb3JTdGF0ZS5zZW1hbnRpY0RlcEdyYXBoIDogbnVsbCksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCZWdpbiBhIGZyZXNoIGBJbmNyZW1lbnRhbENvbXBpbGF0aW9uYC5cbiAgICovXG4gIHN0YXRpYyBmcmVzaChwcm9ncmFtOiB0cy5Qcm9ncmFtLCB2ZXJzaW9uczogTWFwPEFic29sdXRlRnNQYXRoLCBzdHJpbmc+fG51bGwpOlxuICAgICAgSW5jcmVtZW50YWxDb21waWxhdGlvbiB7XG4gICAgY29uc3Qgc3RhdGU6IEluY3JlbWVudGFsU3RhdGUgPSB7XG4gICAgICBraW5kOiBJbmNyZW1lbnRhbFN0YXRlS2luZC5GcmVzaCxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgSW5jcmVtZW50YWxDb21waWxhdGlvbihzdGF0ZSwgbmV3IEZpbGVEZXBlbmRlbmN5R3JhcGgoKSwgdmVyc2lvbnMsIC8qIHJldXNlICovIG51bGwpO1xuICB9XG5cbiAgc3RhdGljIGluY3JlbWVudGFsKFxuICAgICAgcHJvZ3JhbTogdHMuUHJvZ3JhbSwgbmV3VmVyc2lvbnM6IE1hcDxBYnNvbHV0ZUZzUGF0aCwgc3RyaW5nPnxudWxsLCBvbGRQcm9ncmFtOiB0cy5Qcm9ncmFtLFxuICAgICAgb2xkU3RhdGU6IEluY3JlbWVudGFsU3RhdGUsIG1vZGlmaWVkUmVzb3VyY2VGaWxlczogU2V0PEFic29sdXRlRnNQYXRoPnxudWxsLFxuICAgICAgcGVyZjogUGVyZlJlY29yZGVyKTogSW5jcmVtZW50YWxDb21waWxhdGlvbiB7XG4gICAgcmV0dXJuIHBlcmYuaW5QaGFzZShQZXJmUGhhc2UuUmVjb25jaWxpYXRpb24sICgpID0+IHtcbiAgICAgIGNvbnN0IHBoeXNpY2FsbHlDaGFuZ2VkVHNGaWxlcyA9IG5ldyBTZXQ8QWJzb2x1dGVGc1BhdGg+KCk7XG4gICAgICBjb25zdCBjaGFuZ2VkUmVzb3VyY2VGaWxlcyA9IG5ldyBTZXQ8QWJzb2x1dGVGc1BhdGg+KG1vZGlmaWVkUmVzb3VyY2VGaWxlcyA/PyBbXSk7XG5cblxuICAgICAgbGV0IHByaW9yQW5hbHlzaXM6IEFuYWx5emVkSW5jcmVtZW50YWxTdGF0ZTtcbiAgICAgIHN3aXRjaCAob2xkU3RhdGUua2luZCkge1xuICAgICAgICBjYXNlIEluY3JlbWVudGFsU3RhdGVLaW5kLkZyZXNoOlxuICAgICAgICAgIC8vIFNpbmNlIHRoaXMgbGluZSBvZiBwcm9ncmFtIGhhcyBuZXZlciBiZWVuIHN1Y2Nlc3NmdWxseSBhbmFseXplZCB0byBiZWdpbiB3aXRoLCB0cmVhdFxuICAgICAgICAgIC8vIHRoaXMgYXMgYSBmcmVzaCBjb21waWxhdGlvbi5cbiAgICAgICAgICByZXR1cm4gSW5jcmVtZW50YWxDb21waWxhdGlvbi5mcmVzaChwcm9ncmFtLCBuZXdWZXJzaW9ucyk7XG4gICAgICAgIGNhc2UgSW5jcmVtZW50YWxTdGF0ZUtpbmQuQW5hbHl6ZWQ6XG4gICAgICAgICAgLy8gVGhlIG1vc3QgcmVjZW50IHByb2dyYW0gd2FzIGFuYWx5emVkIHN1Y2Nlc3NmdWxseSwgc28gd2UgY2FuIHVzZSB0aGF0IGFzIG91ciBwcmlvclxuICAgICAgICAgIC8vIHN0YXRlIGFuZCBkb24ndCBuZWVkIHRvIGNvbnNpZGVyIGFueSBvdGhlciBkZWx0YXMgZXhjZXB0IGNoYW5nZXMgaW4gdGhlIG1vc3QgcmVjZW50XG4gICAgICAgICAgLy8gcHJvZ3JhbS5cbiAgICAgICAgICBwcmlvckFuYWx5c2lzID0gb2xkU3RhdGU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgSW5jcmVtZW50YWxTdGF0ZUtpbmQuRGVsdGE6XG4gICAgICAgICAgLy8gVGhlcmUgaXMgYW4gYW5jZXN0b3IgcHJvZ3JhbSB3aGljaCB3YXMgYW5hbHl6ZWQgc3VjY2Vzc2Z1bGx5IGFuZCBjYW4gYmUgdXNlZCBhcyBhXG4gICAgICAgICAgLy8gc3RhcnRpbmcgcG9pbnQsIGJ1dCB3ZSBuZWVkIHRvIGRldGVybWluZSB3aGF0J3MgY2hhbmdlZCBzaW5jZSB0aGF0IHByb2dyYW0uXG4gICAgICAgICAgcHJpb3JBbmFseXNpcyA9IG9sZFN0YXRlLmxhc3RBbmFseXplZFN0YXRlO1xuICAgICAgICAgIGZvciAoY29uc3Qgc2ZQYXRoIG9mIG9sZFN0YXRlLnBoeXNpY2FsbHlDaGFuZ2VkVHNGaWxlcykge1xuICAgICAgICAgICAgcGh5c2ljYWxseUNoYW5nZWRUc0ZpbGVzLmFkZChzZlBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGNvbnN0IHJlc291cmNlUGF0aCBvZiBvbGRTdGF0ZS5jaGFuZ2VkUmVzb3VyY2VGaWxlcykge1xuICAgICAgICAgICAgY2hhbmdlZFJlc291cmNlRmlsZXMuYWRkKHJlc291cmNlUGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvbGRWZXJzaW9ucyA9IHByaW9yQW5hbHlzaXMudmVyc2lvbnM7XG5cbiAgICAgIGNvbnN0IG9sZEZpbGVzQXJyYXkgPSBvbGRQcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkubWFwKHRvT3JpZ2luYWxTb3VyY2VGaWxlKTtcbiAgICAgIGNvbnN0IG9sZEZpbGVzID0gbmV3IFNldChvbGRGaWxlc0FycmF5KTtcbiAgICAgIGNvbnN0IGRlbGV0ZWRUc0ZpbGVzID0gbmV3IFNldChvbGRGaWxlc0FycmF5Lm1hcChzZiA9PiBhYnNvbHV0ZUZyb21Tb3VyY2VGaWxlKHNmKSkpO1xuXG4gICAgICBmb3IgKGNvbnN0IHBvc3NpYmx5UmVkaXJlY3RlZE5ld0ZpbGUgb2YgcHJvZ3JhbS5nZXRTb3VyY2VGaWxlcygpKSB7XG4gICAgICAgIGNvbnN0IHNmID0gdG9PcmlnaW5hbFNvdXJjZUZpbGUocG9zc2libHlSZWRpcmVjdGVkTmV3RmlsZSk7XG4gICAgICAgIGNvbnN0IHNmUGF0aCA9IGFic29sdXRlRnJvbVNvdXJjZUZpbGUoc2YpO1xuICAgICAgICAvLyBTaW5jZSB3ZSdyZSBzZWVpbmcgYSBmaWxlIGluIHRoZSBpbmNvbWluZyBwcm9ncmFtIHdpdGggdGhpcyBuYW1lLCBpdCBjYW4ndCBoYXZlIGJlZW5cbiAgICAgICAgLy8gZGVsZXRlZC5cbiAgICAgICAgZGVsZXRlZFRzRmlsZXMuZGVsZXRlKHNmUGF0aCk7XG5cbiAgICAgICAgaWYgKG9sZEZpbGVzLmhhcyhzZikpIHtcbiAgICAgICAgICAvLyBUaGlzIHNvdXJjZSBmaWxlIGhhcyB0aGUgc2FtZSBvYmplY3QgaWRlbnRpdHkgYXMgaW4gdGhlIHByZXZpb3VzIHByb2dyYW0uIFdlIG5lZWQgdG9cbiAgICAgICAgICAvLyBkZXRlcm1pbmUgaWYgaXQncyByZWFsbHkgdGhlIHNhbWUgZmlsZSwgb3IgaWYgaXQgbWlnaHQgaGF2ZSBjaGFuZ2VkIHZlcnNpb25zIHNpbmNlIHRoZVxuICAgICAgICAgIC8vIGxhc3QgcHJvZ3JhbSB3aXRob3V0IGNoYW5naW5nIGl0cyBpZGVudGl0eS5cblxuICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gdmVyc2lvbiBpbmZvcm1hdGlvbiBhdmFpbGFibGUsIHRoZW4gdGhpcyBpcyB0aGUgc2FtZSBmaWxlLCBhbmQgd2UgY2FuXG4gICAgICAgICAgLy8gc2tpcCBpdC5cbiAgICAgICAgICBpZiAob2xkVmVyc2lvbnMgPT09IG51bGwgfHwgbmV3VmVyc2lvbnMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIGEgdmVyc2lvbiBpcyBhdmFpbGFibGUgZm9yIHRoZSBmaWxlIGZyb20gYm90aCB0aGUgcHJpb3IgYW5kIHRoZSBjdXJyZW50IHByb2dyYW0sIGFuZFxuICAgICAgICAgIC8vIHRoYXQgdmVyc2lvbiBpcyB0aGUgc2FtZSwgdGhlbiB0aGlzIGlzIHRoZSBzYW1lIGZpbGUsIGFuZCB3ZSBjYW4gc2tpcCBpdC5cbiAgICAgICAgICBpZiAob2xkVmVyc2lvbnMuaGFzKHNmUGF0aCkgJiYgbmV3VmVyc2lvbnMuaGFzKHNmUGF0aCkgJiZcbiAgICAgICAgICAgICAgb2xkVmVyc2lvbnMuZ2V0KHNmUGF0aCkhID09PSBuZXdWZXJzaW9ucy5nZXQoc2ZQYXRoKSEpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgYXNzdW1lIHRoYXQgdGhlIGZpbGUgaGFzIGNoYW5nZWQuIEVpdGhlciBpdHMgdmVyc2lvbnMgZGlkbid0IG1hdGNoLCBvciB3ZVxuICAgICAgICAgIC8vIHdlcmUgbWlzc2luZyB2ZXJzaW9uIGluZm9ybWF0aW9uIGFib3V0IGl0IG9uIG9uZSBzaWRlIGZvciBzb21lIHJlYXNvbi5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJhaWwgb3V0IGlmIGEgLmQudHMgZmlsZSBjaGFuZ2VzIC0gdGhlIHNlbWFudGljIGRlcCBncmFwaCBpcyBub3QgYWJsZSB0byBwcm9jZXNzIHN1Y2hcbiAgICAgICAgLy8gY2hhbmdlcyBjb3JyZWN0bHkgeWV0LlxuICAgICAgICBpZiAoc2YuaXNEZWNsYXJhdGlvbkZpbGUpIHtcbiAgICAgICAgICByZXR1cm4gSW5jcmVtZW50YWxDb21waWxhdGlvbi5mcmVzaChwcm9ncmFtLCBuZXdWZXJzaW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZmlsZSBoYXMgY2hhbmdlZCBwaHlzaWNhbGx5LCBzbyByZWNvcmQgaXQuXG4gICAgICAgIHBoeXNpY2FsbHlDaGFuZ2VkVHNGaWxlcy5hZGQoc2ZQYXRoKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIGFueSBmaWxlcyB0aGF0IGhhdmUgYmVlbiBkZWxldGVkIGZyb20gdGhlIGxpc3Qgb2YgcGh5c2ljYWwgY2hhbmdlcy5cbiAgICAgIGZvciAoY29uc3QgZGVsZXRlZEZpbGVOYW1lIG9mIGRlbGV0ZWRUc0ZpbGVzKSB7XG4gICAgICAgIHBoeXNpY2FsbHlDaGFuZ2VkVHNGaWxlcy5kZWxldGUocmVzb2x2ZShkZWxldGVkRmlsZU5hbWUpKTtcbiAgICAgIH1cblxuICAgICAgLy8gVXNlIHRoZSBwcmlvciBkZXBlbmRlbmN5IGdyYXBoIHRvIHByb2plY3QgcGh5c2ljYWwgY2hhbmdlcyBpbnRvIGEgc2V0IG9mIGxvZ2ljYWxseSBjaGFuZ2VkXG4gICAgICAvLyBmaWxlcy5cbiAgICAgIGNvbnN0IGRlcEdyYXBoID0gbmV3IEZpbGVEZXBlbmRlbmN5R3JhcGgoKTtcbiAgICAgIGNvbnN0IGxvZ2ljYWxseUNoYW5nZWRUc0ZpbGVzID0gZGVwR3JhcGgudXBkYXRlV2l0aFBoeXNpY2FsQ2hhbmdlcyhcbiAgICAgICAgICBwcmlvckFuYWx5c2lzLmRlcEdyYXBoLCBwaHlzaWNhbGx5Q2hhbmdlZFRzRmlsZXMsIGRlbGV0ZWRUc0ZpbGVzLCBjaGFuZ2VkUmVzb3VyY2VGaWxlcyk7XG5cbiAgICAgIC8vIFBoeXNpY2FsbHkgY2hhbmdlZCBmaWxlcyBhcmVuJ3QgbmVjZXNzYXJpbHkgY291bnRlZCBhcyBsb2dpY2FsbHkgY2hhbmdlZCBieSB0aGUgZGVwZW5kZW5jeVxuICAgICAgLy8gZ3JhcGggKGZpbGVzIGRvIG5vdCBoYXZlIGVkZ2VzIHRvIHRoZW1zZWx2ZXMpLCBzbyBhZGQgdGhlbSB0byB0aGUgbG9naWNhbCBjaGFuZ2VzXG4gICAgICAvLyBleHBsaWNpdGx5LlxuICAgICAgZm9yIChjb25zdCBzZlBhdGggb2YgcGh5c2ljYWxseUNoYW5nZWRUc0ZpbGVzKSB7XG4gICAgICAgIGxvZ2ljYWxseUNoYW5nZWRUc0ZpbGVzLmFkZChzZlBhdGgpO1xuICAgICAgfVxuXG4gICAgICAvLyBTdGFydCBvZmYgaW4gYSBgRGVsdGFJbmNyZW1lbnRhbFN0YXRlYCBhcyBhIGRlbHRhIGFnYWluc3QgdGhlIHByZXZpb3VzIHN1Y2Nlc3NmdWwgYW5hbHlzaXMsXG4gICAgICAvLyB1bnRpbCB0aGlzIGNvbXBpbGF0aW9uIGNvbXBsZXRlcyBpdHMgb3duIGFuYWx5c2lzLlxuICAgICAgY29uc3Qgc3RhdGU6IERlbHRhSW5jcmVtZW50YWxTdGF0ZSA9IHtcbiAgICAgICAga2luZDogSW5jcmVtZW50YWxTdGF0ZUtpbmQuRGVsdGEsXG4gICAgICAgIHBoeXNpY2FsbHlDaGFuZ2VkVHNGaWxlcyxcbiAgICAgICAgY2hhbmdlZFJlc291cmNlRmlsZXMsXG4gICAgICAgIGxhc3RBbmFseXplZFN0YXRlOiBwcmlvckFuYWx5c2lzLFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIG5ldyBJbmNyZW1lbnRhbENvbXBpbGF0aW9uKHN0YXRlLCBkZXBHcmFwaCwgbmV3VmVyc2lvbnMsIHtcbiAgICAgICAgcHJpb3JTdGF0ZTogcHJpb3JBbmFseXNpcyxcbiAgICAgICAgbG9naWNhbGx5Q2hhbmdlZFRzRmlsZXMsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzdGF0ZSgpOiBJbmNyZW1lbnRhbFN0YXRlIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICBnZXQgc2VtYW50aWNEZXBHcmFwaFVwZGF0ZXIoKTogU2VtYW50aWNEZXBHcmFwaFVwZGF0ZXIge1xuICAgIGlmICh0aGlzLnBoYXNlLmtpbmQgIT09IFBoYXNlS2luZC5BbmFseXNpcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBBc3NlcnRpb25FcnJvcjogQ2Fubm90IHVwZGF0ZSB0aGUgU2VtYW50aWNEZXBHcmFwaCBhZnRlciBhbmFseXNpcyBjb21wbGV0ZXNgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGhhc2Uuc2VtYW50aWNEZXBHcmFwaFVwZGF0ZXI7XG4gIH1cblxuICByZWNvcmRTdWNjZXNzZnVsQW5hbHlzaXModHJhaXRDb21waWxlcjogVHJhaXRDb21waWxlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnBoYXNlLmtpbmQgIT09IFBoYXNlS2luZC5BbmFseXNpcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NlcnRpb25FcnJvcjogSW5jcmVtZW50YWwgY29tcGlsYXRpb24gaW4gcGhhc2UgJHtcbiAgICAgICAgICBQaGFzZUtpbmRbdGhpcy5waGFzZS5raW5kXX0sIGV4cGVjdGVkIEFuYWx5c2lzYCk7XG4gICAgfVxuXG4gICAgY29uc3Qge25lZWRzRW1pdCwgbmVlZHNUeXBlQ2hlY2tFbWl0LCBuZXdHcmFwaH0gPSB0aGlzLnBoYXNlLnNlbWFudGljRGVwR3JhcGhVcGRhdGVyLmZpbmFsaXplKCk7XG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIHNldCBvZiBmaWxlcyB3aGljaCBoYXZlIGFscmVhZHkgYmVlbiBlbWl0dGVkLlxuICAgIGxldCBlbWl0dGVkOiBTZXQ8QWJzb2x1dGVGc1BhdGg+O1xuICAgIGlmICh0aGlzLnN0ZXAgPT09IG51bGwpIHtcbiAgICAgIC8vIFNpbmNlIHRoZXJlIGlzIG5vIHByaW9yIGNvbXBpbGF0aW9uLCBubyBmaWxlcyBoYXZlIHlldCBiZWVuIGVtaXR0ZWQuXG4gICAgICBlbWl0dGVkID0gbmV3IFNldCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCZWdpbiB3aXRoIHRoZSBmaWxlcyBlbWl0dGVkIGJ5IHRoZSBwcmlvciBzdWNjZXNzZnVsIGNvbXBpbGF0aW9uLCBidXQgcmVtb3ZlIHRob3NlIHdoaWNoIHdlXG4gICAgICAvLyBrbm93IG5lZWQgdG8gYmVlIHJlLWVtaXR0ZWQuXG4gICAgICBlbWl0dGVkID0gbmV3IFNldCh0aGlzLnN0ZXAucHJpb3JTdGF0ZS5lbWl0dGVkKTtcblxuICAgICAgLy8gRmlsZXMgbmVlZCByZS1lbWl0dGVkIGlmIHRoZXkndmUgbG9naWNhbGx5IGNoYW5nZWQuXG4gICAgICBmb3IgKGNvbnN0IHNmUGF0aCBvZiB0aGlzLnN0ZXAubG9naWNhbGx5Q2hhbmdlZFRzRmlsZXMpIHtcbiAgICAgICAgZW1pdHRlZC5kZWxldGUoc2ZQYXRoKTtcbiAgICAgIH1cblxuICAgICAgLy8gRmlsZXMgbmVlZCByZS1lbWl0dGVkIGlmIHRoZXkndmUgc2VtYW50aWNhbGx5IGNoYW5nZWQuXG4gICAgICBmb3IgKGNvbnN0IHNmUGF0aCBvZiBuZWVkc0VtaXQpIHtcbiAgICAgICAgZW1pdHRlZC5kZWxldGUoc2ZQYXRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmFuc2l0aW9uIHRvIGEgc3VjY2Vzc2Z1bGx5IGFuYWx5emVkIGNvbXBpbGF0aW9uLiBBdCB0aGlzIHBvaW50LCBhIHN1YnNlcXVlbnQgY29tcGlsYXRpb25cbiAgICAvLyBjb3VsZCB1c2UgdGhpcyBzdGF0ZSBhcyBhIHN0YXJ0aW5nIHBvaW50LlxuICAgIHRoaXMuX3N0YXRlID0ge1xuICAgICAga2luZDogSW5jcmVtZW50YWxTdGF0ZUtpbmQuQW5hbHl6ZWQsXG4gICAgICB2ZXJzaW9uczogdGhpcy52ZXJzaW9ucyxcbiAgICAgIGRlcEdyYXBoOiB0aGlzLmRlcEdyYXBoLFxuICAgICAgc2VtYW50aWNEZXBHcmFwaDogbmV3R3JhcGgsXG4gICAgICBwcmlvckFuYWx5c2lzOiB0cmFpdENvbXBpbGVyLmdldEFuYWx5emVkUmVjb3JkcygpLFxuICAgICAgdHlwZUNoZWNrUmVzdWx0czogbnVsbCxcbiAgICAgIGVtaXR0ZWQsXG4gICAgfTtcblxuICAgIC8vIFdlIG5vdyBlbnRlciB0aGUgdHlwZS1jaGVjayBhbmQgZW1pdCBwaGFzZSBvZiBjb21waWxhdGlvbi5cbiAgICB0aGlzLnBoYXNlID0ge1xuICAgICAga2luZDogUGhhc2VLaW5kLlR5cGVDaGVja0FuZEVtaXQsXG4gICAgICBuZWVkc0VtaXQsXG4gICAgICBuZWVkc1R5cGVDaGVja0VtaXQsXG4gICAgfTtcbiAgfVxuXG4gIHJlY29yZFN1Y2Nlc3NmdWxUeXBlQ2hlY2socmVzdWx0czogTWFwPEFic29sdXRlRnNQYXRoLCBGaWxlVHlwZUNoZWNraW5nRGF0YT4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc3RhdGUua2luZCAhPT0gSW5jcmVtZW50YWxTdGF0ZUtpbmQuQW5hbHl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXJ0aW9uRXJyb3I6IEV4cGVjdGVkIHN1Y2Nlc3NmdWxseSBhbmFseXplZCBjb21waWxhdGlvbi5gKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucGhhc2Uua2luZCAhPT0gUGhhc2VLaW5kLlR5cGVDaGVja0FuZEVtaXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXJ0aW9uRXJyb3I6IEluY3JlbWVudGFsIGNvbXBpbGF0aW9uIGluIHBoYXNlICR7XG4gICAgICAgICAgUGhhc2VLaW5kW3RoaXMucGhhc2Uua2luZF19LCBleHBlY3RlZCBUeXBlQ2hlY2tgKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zdGF0ZS50eXBlQ2hlY2tSZXN1bHRzID0gcmVzdWx0cztcbiAgfVxuXG5cbiAgcmVjb3JkU3VjY2Vzc2Z1bEVtaXQoc2Y6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc3RhdGUua2luZCAhPT0gSW5jcmVtZW50YWxTdGF0ZUtpbmQuQW5hbHl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXJ0aW9uRXJyb3I6IEV4cGVjdGVkIHN1Y2Nlc3NmdWxseSBhbmFseXplZCBjb21waWxhdGlvbi5gKTtcbiAgICB9XG4gICAgdGhpcy5fc3RhdGUuZW1pdHRlZC5hZGQoYWJzb2x1dGVGcm9tU291cmNlRmlsZShzZikpO1xuICB9XG5cbiAgcHJpb3JBbmFseXNpc0ZvcihzZjogdHMuU291cmNlRmlsZSk6IENsYXNzUmVjb3JkW118bnVsbCB7XG4gICAgaWYgKHRoaXMuc3RlcCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgc2ZQYXRoID0gYWJzb2x1dGVGcm9tU291cmNlRmlsZShzZik7XG5cbiAgICAvLyBJZiB0aGUgZmlsZSBoYXMgbG9naWNhbGx5IGNoYW5nZWQsIGl0cyBwcmV2aW91cyBhbmFseXNpcyBjYW5ub3QgYmUgcmV1c2VkLlxuICAgIGlmICh0aGlzLnN0ZXAubG9naWNhbGx5Q2hhbmdlZFRzRmlsZXMuaGFzKHNmUGF0aCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHByaW9yQW5hbHlzaXMgPSB0aGlzLnN0ZXAucHJpb3JTdGF0ZS5wcmlvckFuYWx5c2lzO1xuICAgIGlmICghcHJpb3JBbmFseXNpcy5oYXMoc2YpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHByaW9yQW5hbHlzaXMuZ2V0KHNmKSE7XG4gIH1cblxuICBwcmlvclR5cGVDaGVja2luZ1Jlc3VsdHNGb3Ioc2Y6IHRzLlNvdXJjZUZpbGUpOiBGaWxlVHlwZUNoZWNraW5nRGF0YXxudWxsIHtcbiAgICBpZiAodGhpcy5waGFzZS5raW5kICE9PSBQaGFzZUtpbmQuVHlwZUNoZWNrQW5kRW1pdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NlcnRpb25FcnJvcjogRXhwZWN0ZWQgc3VjY2Vzc2Z1bGx5IGFuYWx5emVkIGNvbXBpbGF0aW9uLmApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0ZXAgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHNmUGF0aCA9IGFic29sdXRlRnJvbVNvdXJjZUZpbGUoc2YpO1xuXG4gICAgLy8gSWYgdGhlIGZpbGUgaGFzIGxvZ2ljYWxseSBjaGFuZ2VkLCBvciBpdHMgdGVtcGxhdGUgdHlwZS1jaGVja2luZyByZXN1bHRzIGhhdmUgc2VtYW50aWNhbGx5XG4gICAgLy8gY2hhbmdlZCwgdGhlbiBwYXN0IHR5cGUtY2hlY2tpbmcgcmVzdWx0cyBjYW5ub3QgYmUgcmV1c2VkLlxuICAgIGlmICh0aGlzLnN0ZXAubG9naWNhbGx5Q2hhbmdlZFRzRmlsZXMuaGFzKHNmUGF0aCkgfHxcbiAgICAgICAgdGhpcy5waGFzZS5uZWVkc1R5cGVDaGVja0VtaXQuaGFzKHNmUGF0aCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIFBhc3QgcmVzdWx0cyBhbHNvIGNhbm5vdCBiZSByZXVzZWQgaWYgdGhleSdyZSBub3QgYXZhaWxhYmxlLlxuICAgIGlmICh0aGlzLnN0ZXAucHJpb3JTdGF0ZS50eXBlQ2hlY2tSZXN1bHRzID09PSBudWxsIHx8XG4gICAgICAgICF0aGlzLnN0ZXAucHJpb3JTdGF0ZS50eXBlQ2hlY2tSZXN1bHRzLmhhcyhzZlBhdGgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwcmlvclJlc3VsdHMgPSB0aGlzLnN0ZXAucHJpb3JTdGF0ZS50eXBlQ2hlY2tSZXN1bHRzLmdldChzZlBhdGgpITtcbiAgICAvLyBJZiB0aGUgcGFzdCByZXN1bHRzIHJlbGllZCBvbiBpbmxpbmluZywgdGhleSdyZSBub3Qgc2FmZSBmb3IgcmV1c2UuXG4gICAgaWYgKHByaW9yUmVzdWx0cy5oYXNJbmxpbmVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJpb3JSZXN1bHRzO1xuICB9XG5cbiAgc2FmZVRvU2tpcEVtaXQoc2Y6IHRzLlNvdXJjZUZpbGUpOiBib29sZWFuIHtcbiAgICAvLyBJZiB0aGlzIGlzIGEgZnJlc2ggY29tcGlsYXRpb24sIGl0J3MgbmV2ZXIgc2FmZSB0byBza2lwIGFuIGVtaXQuXG4gICAgaWYgKHRoaXMuc3RlcCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHNmUGF0aCA9IGFic29sdXRlRnJvbVNvdXJjZUZpbGUoc2YpO1xuXG4gICAgLy8gSWYgdGhlIGZpbGUgaGFzIGl0c2VsZiBsb2dpY2FsbHkgY2hhbmdlZCwgaXQgbXVzdCBiZSBlbWl0dGVkLlxuICAgIGlmICh0aGlzLnN0ZXAubG9naWNhbGx5Q2hhbmdlZFRzRmlsZXMuaGFzKHNmUGF0aCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5waGFzZS5raW5kICE9PSBQaGFzZUtpbmQuVHlwZUNoZWNrQW5kRW1pdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBBc3NlcnRpb25FcnJvcjogRXhwZWN0ZWQgc3VjY2Vzc2Z1bCBhbmFseXNpcyBiZWZvcmUgYXR0ZW1wdGluZyB0byBlbWl0IGZpbGVzYCk7XG4gICAgfVxuXG4gICAgLy8gSWYgZHVyaW5nIGFuYWx5c2lzIGl0IHdhcyBkZXRlcm1pbmVkIHRoYXQgdGhpcyBmaWxlIGhhcyBzZW1hbnRpY2FsbHkgY2hhbmdlZCwgaXQgbXVzdCBiZVxuICAgIC8vIGVtaXR0ZWQuXG4gICAgaWYgKHRoaXMucGhhc2UubmVlZHNFbWl0LmhhcyhzZlBhdGgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gR2VuZXJhbGx5IGl0IHNob3VsZCBiZSBzYWZlIHRvIGFzc3VtZSBoZXJlIHRoYXQgdGhlIGZpbGUgd2FzIHByZXZpb3VzbHkgZW1pdHRlZCBieSB0aGUgbGFzdFxuICAgIC8vIHN1Y2Nlc3NmdWwgY29tcGlsYXRpb24uIEhvd2V2ZXIsIGFzIGEgZGVmZW5zZS1pbi1kZXB0aCBhZ2FpbnN0IGluY29ycmVjdG5lc3MsIHdlIGV4cGxpY2l0bHlcbiAgICAvLyBjaGVjayB0aGF0IHRoZSBsYXN0IGVtaXQgaW5jbHVkZWQgdGhpcyBmaWxlLCBhbmQgcmUtZW1pdCBpdCBvdGhlcndpc2UuXG4gICAgcmV0dXJuIHRoaXMuc3RlcC5wcmlvclN0YXRlLmVtaXR0ZWQuaGFzKHNmUGF0aCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUbyBhY2N1cmF0ZWx5IGRldGVjdCB3aGV0aGVyIGEgc291cmNlIGZpbGUgd2FzIGFmZmVjdGVkIGR1cmluZyBhbiBpbmNyZW1lbnRhbCByZWJ1aWxkLCB0aGVcbiAqIFwib3JpZ2luYWxcIiBzb3VyY2UgZmlsZSBuZWVkcyB0byBiZSBjb25zaXN0ZW50bHkgdXNlZC5cbiAqXG4gKiBGaXJzdCwgVHlwZVNjcmlwdCBtYXkgaGF2ZSBjcmVhdGVkIHNvdXJjZSBmaWxlIHJlZGlyZWN0cyB3aGVuIGRlY2xhcmF0aW9uIGZpbGVzIG9mIHRoZSBzYW1lXG4gKiB2ZXJzaW9uIG9mIGEgbGlicmFyeSBhcmUgaW5jbHVkZWQgbXVsdGlwbGUgdGltZXMuIFRoZSBub24tcmVkaXJlY3RlZCBzb3VyY2UgZmlsZSBzaG91bGQgYmUgdXNlZFxuICogdG8gZGV0ZWN0IGNoYW5nZXMsIGFzIG90aGVyd2lzZSB0aGUgcmVkaXJlY3RlZCBzb3VyY2UgZmlsZXMgY2F1c2UgYSBtaXNtYXRjaCB3aGVuIGNvbXBhcmVkIHRvXG4gKiBhIHByaW9yIHByb2dyYW0uXG4gKlxuICogU2Vjb25kLCB0aGUgcHJvZ3JhbSB0aGF0IGlzIHVzZWQgZm9yIHRlbXBsYXRlIHR5cGUgY2hlY2tpbmcgbWF5IGNvbnRhaW4gbXV0YXRlZCBzb3VyY2UgZmlsZXMsIGlmXG4gKiBpbmxpbmUgdHlwZSBjb25zdHJ1Y3RvcnMgb3IgaW5saW5lIHRlbXBsYXRlIHR5cGUtY2hlY2sgYmxvY2tzIGhhZCB0byBiZSB1c2VkLiBTdWNoIHNvdXJjZSBmaWxlc1xuICogc3RvcmUgdGhlaXIgb3JpZ2luYWwsIG5vbi1tdXRhdGVkIHNvdXJjZSBmaWxlIGZyb20gdGhlIG9yaWdpbmFsIHByb2dyYW0gaW4gYSBzeW1ib2wuIEZvclxuICogY29tcHV0aW5nIHRoZSBhZmZlY3RlZCBmaWxlcyBpbiBhbiBpbmNyZW1lbnRhbCBidWlsZCB0aGlzIG9yaWdpbmFsIHNvdXJjZSBmaWxlIHNob3VsZCBiZSB1c2VkLCBhc1xuICogdGhlIG11dGF0ZWQgc291cmNlIGZpbGUgd291bGQgYWx3YXlzIGJlIGNvbnNpZGVyZWQgYWZmZWN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRvT3JpZ2luYWxTb3VyY2VGaWxlKHNmOiB0cy5Tb3VyY2VGaWxlKTogdHMuU291cmNlRmlsZSB7XG4gIGNvbnN0IHVucmVkaXJlY3RlZFNmID0gdG9VbnJlZGlyZWN0ZWRTb3VyY2VGaWxlKHNmKTtcbiAgY29uc3Qgb3JpZ2luYWxGaWxlID0gKHVucmVkaXJlY3RlZFNmIGFzIE1heWJlU291cmNlRmlsZVdpdGhPcmlnaW5hbEZpbGUpW05nT3JpZ2luYWxGaWxlXTtcbiAgaWYgKG9yaWdpbmFsRmlsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG9yaWdpbmFsRmlsZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdW5yZWRpcmVjdGVkU2Y7XG4gIH1cbn1cbiJdfQ==