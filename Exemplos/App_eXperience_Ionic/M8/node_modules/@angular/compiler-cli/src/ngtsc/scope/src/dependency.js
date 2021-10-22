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
        define("@angular/compiler-cli/src/ngtsc/scope/src/dependency", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetadataDtsModuleScopeResolver = void 0;
    var tslib_1 = require("tslib");
    /**
     * Reads Angular metadata from classes declared in .d.ts files and computes an `ExportScope`.
     *
     * Given an NgModule declared in a .d.ts file, this resolver can produce a transitive `ExportScope`
     * of all of the directives/pipes it exports. It does this by reading metadata off of Ivy static
     * fields on directives, components, pipes, and NgModules.
     */
    var MetadataDtsModuleScopeResolver = /** @class */ (function () {
        /**
         * @param dtsMetaReader a `MetadataReader` which can read metadata from `.d.ts` files.
         */
        function MetadataDtsModuleScopeResolver(dtsMetaReader, aliasingHost) {
            this.dtsMetaReader = dtsMetaReader;
            this.aliasingHost = aliasingHost;
            /**
             * Cache which holds fully resolved scopes for NgModule classes from .d.ts files.
             */
            this.cache = new Map();
        }
        /**
         * Resolve a `Reference`'d NgModule from a .d.ts file and produce a transitive `ExportScope`
         * listing the directives and pipes which that NgModule exports to others.
         *
         * This operation relies on a `Reference` instead of a direct TypeScrpt node as the `Reference`s
         * produced depend on how the original NgModule was imported.
         */
        MetadataDtsModuleScopeResolver.prototype.resolve = function (ref) {
            var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e;
            var clazz = ref.node;
            var sourceFile = clazz.getSourceFile();
            if (!sourceFile.isDeclarationFile) {
                throw new Error("Debug error: DtsModuleScopeResolver.read(" + ref.debugName + " from " + sourceFile.fileName + "), but not a .d.ts file");
            }
            if (this.cache.has(clazz)) {
                return this.cache.get(clazz);
            }
            // Build up the export scope - those directives and pipes made visible by this module.
            var directives = [];
            var pipes = [];
            var ngModules = new Set([clazz]);
            var meta = this.dtsMetaReader.getNgModuleMetadata(ref);
            if (meta === null) {
                this.cache.set(clazz, null);
                return null;
            }
            var declarations = new Set();
            try {
                for (var _f = tslib_1.__values(meta.declarations), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var declRef = _g.value;
                    declarations.add(declRef.node);
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
                // Only the 'exports' field of the NgModule's metadata is important. Imports and declarations
                // don't affect the export scope.
                for (var _h = tslib_1.__values(meta.exports), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var exportRef = _j.value;
                    // Attempt to process the export as a directive.
                    var directive = this.dtsMetaReader.getDirectiveMetadata(exportRef);
                    if (directive !== null) {
                        var isReExport = !declarations.has(exportRef.node);
                        directives.push(this.maybeAlias(directive, sourceFile, isReExport));
                        continue;
                    }
                    // Attempt to process the export as a pipe.
                    var pipe = this.dtsMetaReader.getPipeMetadata(exportRef);
                    if (pipe !== null) {
                        var isReExport = !declarations.has(exportRef.node);
                        pipes.push(this.maybeAlias(pipe, sourceFile, isReExport));
                        continue;
                    }
                    // Attempt to process the export as a module.
                    var exportScope_1 = this.resolve(exportRef);
                    if (exportScope_1 !== null) {
                        // It is a module. Add exported directives and pipes to the current scope. This might
                        // involve rewriting the `Reference`s to those types to have an alias expression if one is
                        // required.
                        if (this.aliasingHost === null) {
                            // Fast path when aliases aren't required.
                            directives.push.apply(directives, tslib_1.__spreadArray([], tslib_1.__read(exportScope_1.exported.directives)));
                            pipes.push.apply(pipes, tslib_1.__spreadArray([], tslib_1.__read(exportScope_1.exported.pipes)));
                        }
                        else {
                            try {
                                // It's necessary to rewrite the `Reference`s to add alias expressions. This way, imports
                                // generated to these directives and pipes will use a shallow import to `sourceFile`
                                // instead of a deep import directly to the directive or pipe class.
                                //
                                // One important check here is whether the directive/pipe is declared in the same
                                // source file as the re-exporting NgModule. This can happen if both a directive, its
                                // NgModule, and the re-exporting NgModule are all in the same file. In this case,
                                // no import alias is needed as it would go to the same file anyway.
                                for (var _k = (e_3 = void 0, tslib_1.__values(exportScope_1.exported.directives)), _l = _k.next(); !_l.done; _l = _k.next()) {
                                    var directive_1 = _l.value;
                                    directives.push(this.maybeAlias(directive_1, sourceFile, /* isReExport */ true));
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
                                for (var _m = (e_4 = void 0, tslib_1.__values(exportScope_1.exported.pipes)), _o = _m.next(); !_o.done; _o = _m.next()) {
                                    var pipe_1 = _o.value;
                                    pipes.push(this.maybeAlias(pipe_1, sourceFile, /* isReExport */ true));
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            try {
                                for (var _p = (e_5 = void 0, tslib_1.__values(exportScope_1.exported.ngModules)), _q = _p.next(); !_q.done; _q = _p.next()) {
                                    var ngModule = _q.value;
                                    ngModules.add(ngModule);
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                        }
                    }
                    continue;
                    // The export was not a directive, a pipe, or a module. This is an error.
                    // TODO(alxhub): produce a ts.Diagnostic
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var exportScope = {
                exported: {
                    directives: directives,
                    pipes: pipes,
                    ngModules: Array.from(ngModules),
                    isPoisoned: false,
                },
            };
            this.cache.set(clazz, exportScope);
            return exportScope;
        };
        MetadataDtsModuleScopeResolver.prototype.maybeAlias = function (dirOrPipe, maybeAliasFrom, isReExport) {
            var ref = dirOrPipe.ref;
            if (this.aliasingHost === null || ref.node.getSourceFile() === maybeAliasFrom) {
                return dirOrPipe;
            }
            var alias = this.aliasingHost.getAliasIn(ref.node, maybeAliasFrom, isReExport);
            if (alias === null) {
                return dirOrPipe;
            }
            // TypeScript incorrectly narrows the type here:
            // https://github.com/microsoft/TypeScript/issues/43966.
            // TODO: Remove/Update once https://github.com/microsoft/TypeScript/issues/43966 is resolved.
            return tslib_1.__assign(tslib_1.__assign({}, dirOrPipe), { ref: ref.cloneWithAlias(alias) });
        };
        return MetadataDtsModuleScopeResolver;
    }());
    exports.MetadataDtsModuleScopeResolver = MetadataDtsModuleScopeResolver;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2Mvc2NvcGUvc3JjL2RlcGVuZGVuY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQWNIOzs7Ozs7T0FNRztJQUNIO1FBTUU7O1dBRUc7UUFDSCx3Q0FBb0IsYUFBNkIsRUFBVSxZQUErQjtZQUF0RSxrQkFBYSxHQUFiLGFBQWEsQ0FBZ0I7WUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBbUI7WUFSMUY7O2VBRUc7WUFDSyxVQUFLLEdBQUcsSUFBSSxHQUFHLEVBQXNDLENBQUM7UUFLK0IsQ0FBQztRQUU5Rjs7Ozs7O1dBTUc7UUFDSCxnREFBTyxHQUFQLFVBQVEsR0FBZ0M7O1lBQ3RDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDdkIsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQTRDLEdBQUcsQ0FBQyxTQUFTLGNBQ3JFLFVBQVUsQ0FBQyxRQUFRLDRCQUF5QixDQUFDLENBQUM7YUFDbkQ7WUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBRSxDQUFDO2FBQy9CO1lBRUQsc0ZBQXNGO1lBQ3RGLElBQU0sVUFBVSxHQUFvQixFQUFFLENBQUM7WUFDdkMsSUFBTSxLQUFLLEdBQWUsRUFBRSxDQUFDO1lBQzdCLElBQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFckQsSUFB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Q0FBQyxDQUFDO1lBQ2pGLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtnQkFDbEIsT0FBTyxTQUFTLENBQUM7YUFDbEI7WUFFRCxnREFBZ0Q7WUFDaEQsd0RBQXdEO1lBQ3hELDZGQUE2RjtZQUM3RixPQUFPLHNDQUNGLFNBQVMsS0FDWixHQUFHLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FDMUIsQ0FBQztRQUNULENBQUM7UUFDSCxxQ0FBQztJQUFELENBQUMsQUFySUQsSUFxSUM7SUFySVksd0VBQThCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0FsaWFzaW5nSG9zdCwgUmVmZXJlbmNlfSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7RGlyZWN0aXZlTWV0YSwgTWV0YWRhdGFSZWFkZXIsIFBpcGVNZXRhfSBmcm9tICcuLi8uLi9tZXRhZGF0YSc7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuXG5pbXBvcnQge0V4cG9ydFNjb3BlfSBmcm9tICcuL2FwaSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHRzTW9kdWxlU2NvcGVSZXNvbHZlciB7XG4gIHJlc29sdmUocmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj4pOiBFeHBvcnRTY29wZXxudWxsO1xufVxuXG4vKipcbiAqIFJlYWRzIEFuZ3VsYXIgbWV0YWRhdGEgZnJvbSBjbGFzc2VzIGRlY2xhcmVkIGluIC5kLnRzIGZpbGVzIGFuZCBjb21wdXRlcyBhbiBgRXhwb3J0U2NvcGVgLlxuICpcbiAqIEdpdmVuIGFuIE5nTW9kdWxlIGRlY2xhcmVkIGluIGEgLmQudHMgZmlsZSwgdGhpcyByZXNvbHZlciBjYW4gcHJvZHVjZSBhIHRyYW5zaXRpdmUgYEV4cG9ydFNjb3BlYFxuICogb2YgYWxsIG9mIHRoZSBkaXJlY3RpdmVzL3BpcGVzIGl0IGV4cG9ydHMuIEl0IGRvZXMgdGhpcyBieSByZWFkaW5nIG1ldGFkYXRhIG9mZiBvZiBJdnkgc3RhdGljXG4gKiBmaWVsZHMgb24gZGlyZWN0aXZlcywgY29tcG9uZW50cywgcGlwZXMsIGFuZCBOZ01vZHVsZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXRhZGF0YUR0c01vZHVsZVNjb3BlUmVzb2x2ZXIgaW1wbGVtZW50cyBEdHNNb2R1bGVTY29wZVJlc29sdmVyIHtcbiAgLyoqXG4gICAqIENhY2hlIHdoaWNoIGhvbGRzIGZ1bGx5IHJlc29sdmVkIHNjb3BlcyBmb3IgTmdNb2R1bGUgY2xhc3NlcyBmcm9tIC5kLnRzIGZpbGVzLlxuICAgKi9cbiAgcHJpdmF0ZSBjYWNoZSA9IG5ldyBNYXA8Q2xhc3NEZWNsYXJhdGlvbiwgRXhwb3J0U2NvcGV8bnVsbD4oKTtcblxuICAvKipcbiAgICogQHBhcmFtIGR0c01ldGFSZWFkZXIgYSBgTWV0YWRhdGFSZWFkZXJgIHdoaWNoIGNhbiByZWFkIG1ldGFkYXRhIGZyb20gYC5kLnRzYCBmaWxlcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZHRzTWV0YVJlYWRlcjogTWV0YWRhdGFSZWFkZXIsIHByaXZhdGUgYWxpYXNpbmdIb3N0OiBBbGlhc2luZ0hvc3R8bnVsbCkge31cblxuICAvKipcbiAgICogUmVzb2x2ZSBhIGBSZWZlcmVuY2VgJ2QgTmdNb2R1bGUgZnJvbSBhIC5kLnRzIGZpbGUgYW5kIHByb2R1Y2UgYSB0cmFuc2l0aXZlIGBFeHBvcnRTY29wZWBcbiAgICogbGlzdGluZyB0aGUgZGlyZWN0aXZlcyBhbmQgcGlwZXMgd2hpY2ggdGhhdCBOZ01vZHVsZSBleHBvcnRzIHRvIG90aGVycy5cbiAgICpcbiAgICogVGhpcyBvcGVyYXRpb24gcmVsaWVzIG9uIGEgYFJlZmVyZW5jZWAgaW5zdGVhZCBvZiBhIGRpcmVjdCBUeXBlU2NycHQgbm9kZSBhcyB0aGUgYFJlZmVyZW5jZWBzXG4gICAqIHByb2R1Y2VkIGRlcGVuZCBvbiBob3cgdGhlIG9yaWdpbmFsIE5nTW9kdWxlIHdhcyBpbXBvcnRlZC5cbiAgICovXG4gIHJlc29sdmUocmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj4pOiBFeHBvcnRTY29wZXxudWxsIHtcbiAgICBjb25zdCBjbGF6eiA9IHJlZi5ub2RlO1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBjbGF6ei5nZXRTb3VyY2VGaWxlKCk7XG4gICAgaWYgKCFzb3VyY2VGaWxlLmlzRGVjbGFyYXRpb25GaWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYERlYnVnIGVycm9yOiBEdHNNb2R1bGVTY29wZVJlc29sdmVyLnJlYWQoJHtyZWYuZGVidWdOYW1lfSBmcm9tICR7XG4gICAgICAgICAgc291cmNlRmlsZS5maWxlTmFtZX0pLCBidXQgbm90IGEgLmQudHMgZmlsZWApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNhY2hlLmhhcyhjbGF6eikpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlLmdldChjbGF6eikhO1xuICAgIH1cblxuICAgIC8vIEJ1aWxkIHVwIHRoZSBleHBvcnQgc2NvcGUgLSB0aG9zZSBkaXJlY3RpdmVzIGFuZCBwaXBlcyBtYWRlIHZpc2libGUgYnkgdGhpcyBtb2R1bGUuXG4gICAgY29uc3QgZGlyZWN0aXZlczogRGlyZWN0aXZlTWV0YVtdID0gW107XG4gICAgY29uc3QgcGlwZXM6IFBpcGVNZXRhW10gPSBbXTtcbiAgICBjb25zdCBuZ01vZHVsZXMgPSBuZXcgU2V0PENsYXNzRGVjbGFyYXRpb24+KFtjbGF6el0pO1xuXG4gICAgY29uc3QgbWV0YSA9IHRoaXMuZHRzTWV0YVJlYWRlci5nZXROZ01vZHVsZU1ldGFkYXRhKHJlZik7XG4gICAgaWYgKG1ldGEgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuY2FjaGUuc2V0KGNsYXp6LCBudWxsKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGRlY2xhcmF0aW9ucyA9IG5ldyBTZXQ8Q2xhc3NEZWNsYXJhdGlvbj4oKTtcbiAgICBmb3IgKGNvbnN0IGRlY2xSZWYgb2YgbWV0YS5kZWNsYXJhdGlvbnMpIHtcbiAgICAgIGRlY2xhcmF0aW9ucy5hZGQoZGVjbFJlZi5ub2RlKTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IHRoZSAnZXhwb3J0cycgZmllbGQgb2YgdGhlIE5nTW9kdWxlJ3MgbWV0YWRhdGEgaXMgaW1wb3J0YW50LiBJbXBvcnRzIGFuZCBkZWNsYXJhdGlvbnNcbiAgICAvLyBkb24ndCBhZmZlY3QgdGhlIGV4cG9ydCBzY29wZS5cbiAgICBmb3IgKGNvbnN0IGV4cG9ydFJlZiBvZiBtZXRhLmV4cG9ydHMpIHtcbiAgICAgIC8vIEF0dGVtcHQgdG8gcHJvY2VzcyB0aGUgZXhwb3J0IGFzIGEgZGlyZWN0aXZlLlxuICAgICAgY29uc3QgZGlyZWN0aXZlID0gdGhpcy5kdHNNZXRhUmVhZGVyLmdldERpcmVjdGl2ZU1ldGFkYXRhKGV4cG9ydFJlZik7XG4gICAgICBpZiAoZGlyZWN0aXZlICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGlzUmVFeHBvcnQgPSAhZGVjbGFyYXRpb25zLmhhcyhleHBvcnRSZWYubm9kZSk7XG4gICAgICAgIGRpcmVjdGl2ZXMucHVzaCh0aGlzLm1heWJlQWxpYXMoZGlyZWN0aXZlLCBzb3VyY2VGaWxlLCBpc1JlRXhwb3J0KSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBBdHRlbXB0IHRvIHByb2Nlc3MgdGhlIGV4cG9ydCBhcyBhIHBpcGUuXG4gICAgICBjb25zdCBwaXBlID0gdGhpcy5kdHNNZXRhUmVhZGVyLmdldFBpcGVNZXRhZGF0YShleHBvcnRSZWYpO1xuICAgICAgaWYgKHBpcGUgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgaXNSZUV4cG9ydCA9ICFkZWNsYXJhdGlvbnMuaGFzKGV4cG9ydFJlZi5ub2RlKTtcbiAgICAgICAgcGlwZXMucHVzaCh0aGlzLm1heWJlQWxpYXMocGlwZSwgc291cmNlRmlsZSwgaXNSZUV4cG9ydCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gQXR0ZW1wdCB0byBwcm9jZXNzIHRoZSBleHBvcnQgYXMgYSBtb2R1bGUuXG4gICAgICBjb25zdCBleHBvcnRTY29wZSA9IHRoaXMucmVzb2x2ZShleHBvcnRSZWYpO1xuICAgICAgaWYgKGV4cG9ydFNjb3BlICE9PSBudWxsKSB7XG4gICAgICAgIC8vIEl0IGlzIGEgbW9kdWxlLiBBZGQgZXhwb3J0ZWQgZGlyZWN0aXZlcyBhbmQgcGlwZXMgdG8gdGhlIGN1cnJlbnQgc2NvcGUuIFRoaXMgbWlnaHRcbiAgICAgICAgLy8gaW52b2x2ZSByZXdyaXRpbmcgdGhlIGBSZWZlcmVuY2VgcyB0byB0aG9zZSB0eXBlcyB0byBoYXZlIGFuIGFsaWFzIGV4cHJlc3Npb24gaWYgb25lIGlzXG4gICAgICAgIC8vIHJlcXVpcmVkLlxuICAgICAgICBpZiAodGhpcy5hbGlhc2luZ0hvc3QgPT09IG51bGwpIHtcbiAgICAgICAgICAvLyBGYXN0IHBhdGggd2hlbiBhbGlhc2VzIGFyZW4ndCByZXF1aXJlZC5cbiAgICAgICAgICBkaXJlY3RpdmVzLnB1c2goLi4uZXhwb3J0U2NvcGUuZXhwb3J0ZWQuZGlyZWN0aXZlcyk7XG4gICAgICAgICAgcGlwZXMucHVzaCguLi5leHBvcnRTY29wZS5leHBvcnRlZC5waXBlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSXQncyBuZWNlc3NhcnkgdG8gcmV3cml0ZSB0aGUgYFJlZmVyZW5jZWBzIHRvIGFkZCBhbGlhcyBleHByZXNzaW9ucy4gVGhpcyB3YXksIGltcG9ydHNcbiAgICAgICAgICAvLyBnZW5lcmF0ZWQgdG8gdGhlc2UgZGlyZWN0aXZlcyBhbmQgcGlwZXMgd2lsbCB1c2UgYSBzaGFsbG93IGltcG9ydCB0byBgc291cmNlRmlsZWBcbiAgICAgICAgICAvLyBpbnN0ZWFkIG9mIGEgZGVlcCBpbXBvcnQgZGlyZWN0bHkgdG8gdGhlIGRpcmVjdGl2ZSBvciBwaXBlIGNsYXNzLlxuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gT25lIGltcG9ydGFudCBjaGVjayBoZXJlIGlzIHdoZXRoZXIgdGhlIGRpcmVjdGl2ZS9waXBlIGlzIGRlY2xhcmVkIGluIHRoZSBzYW1lXG4gICAgICAgICAgLy8gc291cmNlIGZpbGUgYXMgdGhlIHJlLWV4cG9ydGluZyBOZ01vZHVsZS4gVGhpcyBjYW4gaGFwcGVuIGlmIGJvdGggYSBkaXJlY3RpdmUsIGl0c1xuICAgICAgICAgIC8vIE5nTW9kdWxlLCBhbmQgdGhlIHJlLWV4cG9ydGluZyBOZ01vZHVsZSBhcmUgYWxsIGluIHRoZSBzYW1lIGZpbGUuIEluIHRoaXMgY2FzZSxcbiAgICAgICAgICAvLyBubyBpbXBvcnQgYWxpYXMgaXMgbmVlZGVkIGFzIGl0IHdvdWxkIGdvIHRvIHRoZSBzYW1lIGZpbGUgYW55d2F5LlxuICAgICAgICAgIGZvciAoY29uc3QgZGlyZWN0aXZlIG9mIGV4cG9ydFNjb3BlLmV4cG9ydGVkLmRpcmVjdGl2ZXMpIHtcbiAgICAgICAgICAgIGRpcmVjdGl2ZXMucHVzaCh0aGlzLm1heWJlQWxpYXMoZGlyZWN0aXZlLCBzb3VyY2VGaWxlLCAvKiBpc1JlRXhwb3J0ICovIHRydWUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChjb25zdCBwaXBlIG9mIGV4cG9ydFNjb3BlLmV4cG9ydGVkLnBpcGVzKSB7XG4gICAgICAgICAgICBwaXBlcy5wdXNoKHRoaXMubWF5YmVBbGlhcyhwaXBlLCBzb3VyY2VGaWxlLCAvKiBpc1JlRXhwb3J0ICovIHRydWUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChjb25zdCBuZ01vZHVsZSBvZiBleHBvcnRTY29wZS5leHBvcnRlZC5uZ01vZHVsZXMpIHtcbiAgICAgICAgICAgIG5nTW9kdWxlcy5hZGQobmdNb2R1bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29udGludWU7XG5cbiAgICAgIC8vIFRoZSBleHBvcnQgd2FzIG5vdCBhIGRpcmVjdGl2ZSwgYSBwaXBlLCBvciBhIG1vZHVsZS4gVGhpcyBpcyBhbiBlcnJvci5cbiAgICAgIC8vIFRPRE8oYWx4aHViKTogcHJvZHVjZSBhIHRzLkRpYWdub3N0aWNcbiAgICB9XG5cbiAgICBjb25zdCBleHBvcnRTY29wZTogRXhwb3J0U2NvcGUgPSB7XG4gICAgICBleHBvcnRlZDoge1xuICAgICAgICBkaXJlY3RpdmVzLFxuICAgICAgICBwaXBlcyxcbiAgICAgICAgbmdNb2R1bGVzOiBBcnJheS5mcm9tKG5nTW9kdWxlcyksXG4gICAgICAgIGlzUG9pc29uZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMuY2FjaGUuc2V0KGNsYXp6LCBleHBvcnRTY29wZSk7XG4gICAgcmV0dXJuIGV4cG9ydFNjb3BlO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXliZUFsaWFzPFQgZXh0ZW5kcyBEaXJlY3RpdmVNZXRhfFBpcGVNZXRhPihcbiAgICAgIGRpck9yUGlwZTogVCwgbWF5YmVBbGlhc0Zyb206IHRzLlNvdXJjZUZpbGUsIGlzUmVFeHBvcnQ6IGJvb2xlYW4pOiBUIHtcbiAgICBjb25zdCByZWYgPSBkaXJPclBpcGUucmVmO1xuICAgIGlmICh0aGlzLmFsaWFzaW5nSG9zdCA9PT0gbnVsbCB8fCByZWYubm9kZS5nZXRTb3VyY2VGaWxlKCkgPT09IG1heWJlQWxpYXNGcm9tKSB7XG4gICAgICByZXR1cm4gZGlyT3JQaXBlO1xuICAgIH1cblxuICAgIGNvbnN0IGFsaWFzID0gdGhpcy5hbGlhc2luZ0hvc3QuZ2V0QWxpYXNJbihyZWYubm9kZSwgbWF5YmVBbGlhc0Zyb20sIGlzUmVFeHBvcnQpO1xuICAgIGlmIChhbGlhcyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGRpck9yUGlwZTtcbiAgICB9XG5cbiAgICAvLyBUeXBlU2NyaXB0IGluY29ycmVjdGx5IG5hcnJvd3MgdGhlIHR5cGUgaGVyZTpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzQzOTY2LlxuICAgIC8vIFRPRE86IFJlbW92ZS9VcGRhdGUgb25jZSBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzQzOTY2IGlzIHJlc29sdmVkLlxuICAgIHJldHVybiB7XG4gICAgICAuLi5kaXJPclBpcGUsXG4gICAgICByZWY6IHJlZi5jbG9uZVdpdGhBbGlhcyhhbGlhcyksXG4gICAgfSBhcyBUO1xuICB9XG59XG4iXX0=