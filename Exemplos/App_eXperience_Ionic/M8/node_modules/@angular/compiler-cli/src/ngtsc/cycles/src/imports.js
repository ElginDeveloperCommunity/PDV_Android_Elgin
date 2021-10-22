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
        define("@angular/compiler-cli/src/ngtsc/cycles/src/imports", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/perf"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImportGraph = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var perf_1 = require("@angular/compiler-cli/src/ngtsc/perf");
    /**
     * A cached graph of imports in the `ts.Program`.
     *
     * The `ImportGraph` keeps track of dependencies (imports) of individual `ts.SourceFile`s. Only
     * dependencies within the same program are tracked; imports into packages on NPM are not.
     */
    var ImportGraph = /** @class */ (function () {
        function ImportGraph(checker, perf) {
            this.checker = checker;
            this.perf = perf;
            this.imports = new Map();
        }
        /**
         * List the direct (not transitive) imports of a given `ts.SourceFile`.
         *
         * This operation is cached.
         */
        ImportGraph.prototype.importsOf = function (sf) {
            if (!this.imports.has(sf)) {
                this.imports.set(sf, this.scanImports(sf));
            }
            return this.imports.get(sf);
        };
        /**
         * Find an import path from the `start` SourceFile to the `end` SourceFile.
         *
         * This function implements a breadth first search that results in finding the
         * shortest path between the `start` and `end` points.
         *
         * @param start the starting point of the path.
         * @param end the ending point of the path.
         * @returns an array of source files that connect the `start` and `end` source files, or `null` if
         *     no path could be found.
         */
        ImportGraph.prototype.findPath = function (start, end) {
            var e_1, _a;
            if (start === end) {
                // Escape early for the case where `start` and `end` are the same.
                return [start];
            }
            var found = new Set([start]);
            var queue = [new Found(start, null)];
            while (queue.length > 0) {
                var current = queue.shift();
                var imports = this.importsOf(current.sourceFile);
                try {
                    for (var imports_1 = (e_1 = void 0, tslib_1.__values(imports)), imports_1_1 = imports_1.next(); !imports_1_1.done; imports_1_1 = imports_1.next()) {
                        var importedFile = imports_1_1.value;
                        if (!found.has(importedFile)) {
                            var next = new Found(importedFile, current);
                            if (next.sourceFile === end) {
                                // We have hit the target `end` path so we can stop here.
                                return next.toPath();
                            }
                            found.add(importedFile);
                            queue.push(next);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (imports_1_1 && !imports_1_1.done && (_a = imports_1.return)) _a.call(imports_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return null;
        };
        /**
         * Add a record of an import from `sf` to `imported`, that's not present in the original
         * `ts.Program` but will be remembered by the `ImportGraph`.
         */
        ImportGraph.prototype.addSyntheticImport = function (sf, imported) {
            if (isLocalFile(imported)) {
                this.importsOf(sf).add(imported);
            }
        };
        ImportGraph.prototype.scanImports = function (sf) {
            var _this = this;
            return this.perf.inPhase(perf_1.PerfPhase.CycleDetection, function () {
                var e_2, _a;
                var imports = new Set();
                try {
                    // Look through the source file for import and export statements.
                    for (var _b = tslib_1.__values(sf.statements), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var stmt = _c.value;
                        if ((!ts.isImportDeclaration(stmt) && !ts.isExportDeclaration(stmt)) ||
                            stmt.moduleSpecifier === undefined) {
                            continue;
                        }
                        if (ts.isImportDeclaration(stmt) && stmt.importClause !== undefined &&
                            stmt.importClause.isTypeOnly) {
                            // Exclude type-only imports as they are always elided, so they don't contribute to
                            // cycles.
                            continue;
                        }
                        var symbol = _this.checker.getSymbolAtLocation(stmt.moduleSpecifier);
                        if (symbol === undefined || symbol.valueDeclaration === undefined) {
                            // No symbol could be found to skip over this import/export.
                            continue;
                        }
                        var moduleFile = symbol.valueDeclaration;
                        if (ts.isSourceFile(moduleFile) && isLocalFile(moduleFile)) {
                            // Record this local import.
                            imports.add(moduleFile);
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
                return imports;
            });
        };
        return ImportGraph;
    }());
    exports.ImportGraph = ImportGraph;
    function isLocalFile(sf) {
        return !sf.isDeclarationFile;
    }
    /**
     * A helper class to track which SourceFiles are being processed when searching for a path in
     * `getPath()` above.
     */
    var Found = /** @class */ (function () {
        function Found(sourceFile, parent) {
            this.sourceFile = sourceFile;
            this.parent = parent;
        }
        /**
         * Back track through this found SourceFile and its ancestors to generate an array of
         * SourceFiles that form am import path between two SourceFiles.
         */
        Found.prototype.toPath = function () {
            var array = [];
            var current = this;
            while (current !== null) {
                array.push(current.sourceFile);
                current = current.parent;
            }
            // Pushing and then reversing, O(n), rather than unshifting repeatedly, O(n^2), avoids
            // manipulating the array on every iteration: https://stackoverflow.com/a/26370620
            return array.reverse();
        };
        return Found;
    }());
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvY3ljbGVzL3NyYy9pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQkFBaUM7SUFFakMsNkRBQW1EO0lBRW5EOzs7OztPQUtHO0lBQ0g7UUFHRSxxQkFBb0IsT0FBdUIsRUFBVSxJQUFrQjtZQUFuRCxZQUFPLEdBQVAsT0FBTyxDQUFnQjtZQUFVLFNBQUksR0FBSixJQUFJLENBQWM7WUFGL0QsWUFBTyxHQUFHLElBQUksR0FBRyxFQUFxQyxDQUFDO1FBRVcsQ0FBQztRQUUzRTs7OztXQUlHO1FBQ0gsK0JBQVMsR0FBVCxVQUFVLEVBQWlCO1lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUM1QztZQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFFLENBQUM7UUFDL0IsQ0FBQztRQUVEOzs7Ozs7Ozs7O1dBVUc7UUFDSCw4QkFBUSxHQUFSLFVBQVMsS0FBb0IsRUFBRSxHQUFrQjs7WUFDL0MsSUFBSSxLQUFLLEtBQUssR0FBRyxFQUFFO2dCQUNqQixrRUFBa0U7Z0JBQ2xFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNoQjtZQUVELElBQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBTSxLQUFLLEdBQVksQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FB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QyxFQUFpQjtRQUNwQyxPQUFPLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO0lBQy9CLENBQUM7SUFFRDs7O09BR0c7SUFDSDtRQUNFLGVBQXFCLFVBQXlCLEVBQVcsTUFBa0I7WUFBdEQsZUFBVSxHQUFWLFVBQVUsQ0FBZTtZQUFXLFdBQU0sR0FBTixNQUFNLENBQVk7UUFBRyxDQUFDO1FBRS9FOzs7V0FHRztRQUNILHNCQUFNLEdBQU47WUFDRSxJQUFNLEtBQUssR0FBb0IsRUFBRSxDQUFDO1lBQ2xDLElBQUksT0FBTyxHQUFlLElBQUksQ0FBQztZQUMvQixPQUFPLE9BQU8sS0FBSyxJQUFJLEVBQUU7Z0JBQ3ZCLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQixPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQzthQUMxQjtZQUNELHNGQUFzRjtZQUN0RixrRkFBa0Y7WUFDbEYsT0FBTyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDekIsQ0FBQztRQUNILFlBQUM7SUFBRCxDQUFDLEFBbEJELElBa0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge1BlcmZQaGFzZSwgUGVyZlJlY29yZGVyfSBmcm9tICcuLi8uLi9wZXJmJztcblxuLyoqXG4gKiBBIGNhY2hlZCBncmFwaCBvZiBpbXBvcnRzIGluIHRoZSBgdHMuUHJvZ3JhbWAuXG4gKlxuICogVGhlIGBJbXBvcnRHcmFwaGAga2VlcHMgdHJhY2sgb2YgZGVwZW5kZW5jaWVzIChpbXBvcnRzKSBvZiBpbmRpdmlkdWFsIGB0cy5Tb3VyY2VGaWxlYHMuIE9ubHlcbiAqIGRlcGVuZGVuY2llcyB3aXRoaW4gdGhlIHNhbWUgcHJvZ3JhbSBhcmUgdHJhY2tlZDsgaW1wb3J0cyBpbnRvIHBhY2thZ2VzIG9uIE5QTSBhcmUgbm90LlxuICovXG5leHBvcnQgY2xhc3MgSW1wb3J0R3JhcGgge1xuICBwcml2YXRlIGltcG9ydHMgPSBuZXcgTWFwPHRzLlNvdXJjZUZpbGUsIFNldDx0cy5Tb3VyY2VGaWxlPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBwcml2YXRlIHBlcmY6IFBlcmZSZWNvcmRlcikge31cblxuICAvKipcbiAgICogTGlzdCB0aGUgZGlyZWN0IChub3QgdHJhbnNpdGl2ZSkgaW1wb3J0cyBvZiBhIGdpdmVuIGB0cy5Tb3VyY2VGaWxlYC5cbiAgICpcbiAgICogVGhpcyBvcGVyYXRpb24gaXMgY2FjaGVkLlxuICAgKi9cbiAgaW1wb3J0c09mKHNmOiB0cy5Tb3VyY2VGaWxlKTogU2V0PHRzLlNvdXJjZUZpbGU+IHtcbiAgICBpZiAoIXRoaXMuaW1wb3J0cy5oYXMoc2YpKSB7XG4gICAgICB0aGlzLmltcG9ydHMuc2V0KHNmLCB0aGlzLnNjYW5JbXBvcnRzKHNmKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmltcG9ydHMuZ2V0KHNmKSE7XG4gIH1cblxuICAvKipcbiAgICogRmluZCBhbiBpbXBvcnQgcGF0aCBmcm9tIHRoZSBgc3RhcnRgIFNvdXJjZUZpbGUgdG8gdGhlIGBlbmRgIFNvdXJjZUZpbGUuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gaW1wbGVtZW50cyBhIGJyZWFkdGggZmlyc3Qgc2VhcmNoIHRoYXQgcmVzdWx0cyBpbiBmaW5kaW5nIHRoZVxuICAgKiBzaG9ydGVzdCBwYXRoIGJldHdlZW4gdGhlIGBzdGFydGAgYW5kIGBlbmRgIHBvaW50cy5cbiAgICpcbiAgICogQHBhcmFtIHN0YXJ0IHRoZSBzdGFydGluZyBwb2ludCBvZiB0aGUgcGF0aC5cbiAgICogQHBhcmFtIGVuZCB0aGUgZW5kaW5nIHBvaW50IG9mIHRoZSBwYXRoLlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiBzb3VyY2UgZmlsZXMgdGhhdCBjb25uZWN0IHRoZSBgc3RhcnRgIGFuZCBgZW5kYCBzb3VyY2UgZmlsZXMsIG9yIGBudWxsYCBpZlxuICAgKiAgICAgbm8gcGF0aCBjb3VsZCBiZSBmb3VuZC5cbiAgICovXG4gIGZpbmRQYXRoKHN0YXJ0OiB0cy5Tb3VyY2VGaWxlLCBlbmQ6IHRzLlNvdXJjZUZpbGUpOiB0cy5Tb3VyY2VGaWxlW118bnVsbCB7XG4gICAgaWYgKHN0YXJ0ID09PSBlbmQpIHtcbiAgICAgIC8vIEVzY2FwZSBlYXJseSBmb3IgdGhlIGNhc2Ugd2hlcmUgYHN0YXJ0YCBhbmQgYGVuZGAgYXJlIHRoZSBzYW1lLlxuICAgICAgcmV0dXJuIFtzdGFydF07XG4gICAgfVxuXG4gICAgY29uc3QgZm91bmQgPSBuZXcgU2V0PHRzLlNvdXJjZUZpbGU+KFtzdGFydF0pO1xuICAgIGNvbnN0IHF1ZXVlOiBGb3VuZFtdID0gW25ldyBGb3VuZChzdGFydCwgbnVsbCldO1xuXG4gICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBxdWV1ZS5zaGlmdCgpITtcbiAgICAgIGNvbnN0IGltcG9ydHMgPSB0aGlzLmltcG9ydHNPZihjdXJyZW50LnNvdXJjZUZpbGUpO1xuICAgICAgZm9yIChjb25zdCBpbXBvcnRlZEZpbGUgb2YgaW1wb3J0cykge1xuICAgICAgICBpZiAoIWZvdW5kLmhhcyhpbXBvcnRlZEZpbGUpKSB7XG4gICAgICAgICAgY29uc3QgbmV4dCA9IG5ldyBGb3VuZChpbXBvcnRlZEZpbGUsIGN1cnJlbnQpO1xuICAgICAgICAgIGlmIChuZXh0LnNvdXJjZUZpbGUgPT09IGVuZCkge1xuICAgICAgICAgICAgLy8gV2UgaGF2ZSBoaXQgdGhlIHRhcmdldCBgZW5kYCBwYXRoIHNvIHdlIGNhbiBzdG9wIGhlcmUuXG4gICAgICAgICAgICByZXR1cm4gbmV4dC50b1BhdGgoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm91bmQuYWRkKGltcG9ydGVkRmlsZSk7XG4gICAgICAgICAgcXVldWUucHVzaChuZXh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZWNvcmQgb2YgYW4gaW1wb3J0IGZyb20gYHNmYCB0byBgaW1wb3J0ZWRgLCB0aGF0J3Mgbm90IHByZXNlbnQgaW4gdGhlIG9yaWdpbmFsXG4gICAqIGB0cy5Qcm9ncmFtYCBidXQgd2lsbCBiZSByZW1lbWJlcmVkIGJ5IHRoZSBgSW1wb3J0R3JhcGhgLlxuICAgKi9cbiAgYWRkU3ludGhldGljSW1wb3J0KHNmOiB0cy5Tb3VyY2VGaWxlLCBpbXBvcnRlZDogdHMuU291cmNlRmlsZSk6IHZvaWQge1xuICAgIGlmIChpc0xvY2FsRmlsZShpbXBvcnRlZCkpIHtcbiAgICAgIHRoaXMuaW1wb3J0c09mKHNmKS5hZGQoaW1wb3J0ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2NhbkltcG9ydHMoc2Y6IHRzLlNvdXJjZUZpbGUpOiBTZXQ8dHMuU291cmNlRmlsZT4ge1xuICAgIHJldHVybiB0aGlzLnBlcmYuaW5QaGFzZShQZXJmUGhhc2UuQ3ljbGVEZXRlY3Rpb24sICgpID0+IHtcbiAgICAgIGNvbnN0IGltcG9ydHMgPSBuZXcgU2V0PHRzLlNvdXJjZUZpbGU+KCk7XG4gICAgICAvLyBMb29rIHRocm91Z2ggdGhlIHNvdXJjZSBmaWxlIGZvciBpbXBvcnQgYW5kIGV4cG9ydCBzdGF0ZW1lbnRzLlxuICAgICAgZm9yIChjb25zdCBzdG10IG9mIHNmLnN0YXRlbWVudHMpIHtcbiAgICAgICAgaWYgKCghdHMuaXNJbXBvcnREZWNsYXJhdGlvbihzdG10KSAmJiAhdHMuaXNFeHBvcnREZWNsYXJhdGlvbihzdG10KSkgfHxcbiAgICAgICAgICAgIHN0bXQubW9kdWxlU3BlY2lmaWVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0cy5pc0ltcG9ydERlY2xhcmF0aW9uKHN0bXQpICYmIHN0bXQuaW1wb3J0Q2xhdXNlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHN0bXQuaW1wb3J0Q2xhdXNlLmlzVHlwZU9ubHkpIHtcbiAgICAgICAgICAvLyBFeGNsdWRlIHR5cGUtb25seSBpbXBvcnRzIGFzIHRoZXkgYXJlIGFsd2F5cyBlbGlkZWQsIHNvIHRoZXkgZG9uJ3QgY29udHJpYnV0ZSB0b1xuICAgICAgICAgIC8vIGN5Y2xlcy5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMuY2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKHN0bXQubW9kdWxlU3BlY2lmaWVyKTtcbiAgICAgICAgaWYgKHN5bWJvbCA9PT0gdW5kZWZpbmVkIHx8IHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBObyBzeW1ib2wgY291bGQgYmUgZm91bmQgdG8gc2tpcCBvdmVyIHRoaXMgaW1wb3J0L2V4cG9ydC5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtb2R1bGVGaWxlID0gc3ltYm9sLnZhbHVlRGVjbGFyYXRpb247XG4gICAgICAgIGlmICh0cy5pc1NvdXJjZUZpbGUobW9kdWxlRmlsZSkgJiYgaXNMb2NhbEZpbGUobW9kdWxlRmlsZSkpIHtcbiAgICAgICAgICAvLyBSZWNvcmQgdGhpcyBsb2NhbCBpbXBvcnQuXG4gICAgICAgICAgaW1wb3J0cy5hZGQobW9kdWxlRmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpbXBvcnRzO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzTG9jYWxGaWxlKHNmOiB0cy5Tb3VyY2VGaWxlKTogYm9vbGVhbiB7XG4gIHJldHVybiAhc2YuaXNEZWNsYXJhdGlvbkZpbGU7XG59XG5cbi8qKlxuICogQSBoZWxwZXIgY2xhc3MgdG8gdHJhY2sgd2hpY2ggU291cmNlRmlsZXMgYXJlIGJlaW5nIHByb2Nlc3NlZCB3aGVuIHNlYXJjaGluZyBmb3IgYSBwYXRoIGluXG4gKiBgZ2V0UGF0aCgpYCBhYm92ZS5cbiAqL1xuY2xhc3MgRm91bmQge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCByZWFkb25seSBwYXJlbnQ6IEZvdW5kfG51bGwpIHt9XG5cbiAgLyoqXG4gICAqIEJhY2sgdHJhY2sgdGhyb3VnaCB0aGlzIGZvdW5kIFNvdXJjZUZpbGUgYW5kIGl0cyBhbmNlc3RvcnMgdG8gZ2VuZXJhdGUgYW4gYXJyYXkgb2ZcbiAgICogU291cmNlRmlsZXMgdGhhdCBmb3JtIGFtIGltcG9ydCBwYXRoIGJldHdlZW4gdHdvIFNvdXJjZUZpbGVzLlxuICAgKi9cbiAgdG9QYXRoKCk6IHRzLlNvdXJjZUZpbGVbXSB7XG4gICAgY29uc3QgYXJyYXk6IHRzLlNvdXJjZUZpbGVbXSA9IFtdO1xuICAgIGxldCBjdXJyZW50OiBGb3VuZHxudWxsID0gdGhpcztcbiAgICB3aGlsZSAoY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgYXJyYXkucHVzaChjdXJyZW50LnNvdXJjZUZpbGUpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xuICAgIH1cbiAgICAvLyBQdXNoaW5nIGFuZCB0aGVuIHJldmVyc2luZywgTyhuKSwgcmF0aGVyIHRoYW4gdW5zaGlmdGluZyByZXBlYXRlZGx5LCBPKG5eMiksIGF2b2lkc1xuICAgIC8vIG1hbmlwdWxhdGluZyB0aGUgYXJyYXkgb24gZXZlcnkgaXRlcmF0aW9uOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjYzNzA2MjBcbiAgICByZXR1cm4gYXJyYXkucmV2ZXJzZSgpO1xuICB9XG59XG4iXX0=