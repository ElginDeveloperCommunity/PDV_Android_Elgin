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
        define("@angular/compiler-cli/src/ngtsc/cycles/src/analyzer", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cycle = exports.CycleAnalyzer = void 0;
    var tslib_1 = require("tslib");
    /**
     * Analyzes a `ts.Program` for cycles.
     */
    var CycleAnalyzer = /** @class */ (function () {
        function CycleAnalyzer(importGraph) {
            this.importGraph = importGraph;
            /**
             * Cycle detection is requested with the same `from` source file for all used directives and pipes
             * within a component, which makes it beneficial to cache the results as long as the `from` source
             * file has not changed. This avoids visiting the import graph that is reachable from multiple
             * directives/pipes more than once.
             */
            this.cachedResults = null;
        }
        /**
         * Check for a cycle to be created in the `ts.Program` by adding an import between `from` and
         * `to`.
         *
         * @returns a `Cycle` object if an import between `from` and `to` would create a cycle; `null`
         *     otherwise.
         */
        CycleAnalyzer.prototype.wouldCreateCycle = function (from, to) {
            // Try to reuse the cached results as long as the `from` source file is the same.
            if (this.cachedResults === null || this.cachedResults.from !== from) {
                this.cachedResults = new CycleResults(from, this.importGraph);
            }
            // Import of 'from' -> 'to' is illegal if an edge 'to' -> 'from' already exists.
            return this.cachedResults.wouldBeCyclic(to) ? new Cycle(this.importGraph, from, to) : null;
        };
        /**
         * Record a synthetic import from `from` to `to`.
         *
         * This is an import that doesn't exist in the `ts.Program` but will be considered as part of the
         * import graph for cycle creation.
         */
        CycleAnalyzer.prototype.recordSyntheticImport = function (from, to) {
            this.cachedResults = null;
            this.importGraph.addSyntheticImport(from, to);
        };
        return CycleAnalyzer;
    }());
    exports.CycleAnalyzer = CycleAnalyzer;
    var NgCyclicResult = Symbol('NgCyclicResult');
    /**
     * Stores the results of cycle detection in a memory efficient manner. A symbol is attached to
     * source files that indicate what the cyclic analysis result is, as indicated by two markers that
     * are unique to this instance. This alleviates memory pressure in large import graphs, as each
     * execution is able to store its results in the same memory location (i.e. in the symbol
     * on the source file) as earlier executions.
     */
    var CycleResults = /** @class */ (function () {
        function CycleResults(from, importGraph) {
            this.from = from;
            this.importGraph = importGraph;
            this.cyclic = {};
            this.acyclic = {};
        }
        CycleResults.prototype.wouldBeCyclic = function (sf) {
            var e_1, _a;
            var cached = this.getCachedResult(sf);
            if (cached !== null) {
                // The result for this source file has already been computed, so return its result.
                return cached;
            }
            if (sf === this.from) {
                // We have reached the source file that we want to create an import from, which means that
                // doing so would create a cycle.
                return true;
            }
            // Assume for now that the file will be acyclic; this prevents infinite recursion in the case
            // that `sf` is visited again as part of an existing cycle in the graph.
            this.markAcyclic(sf);
            var imports = this.importGraph.importsOf(sf);
            try {
                for (var imports_1 = tslib_1.__values(imports), imports_1_1 = imports_1.next(); !imports_1_1.done; imports_1_1 = imports_1.next()) {
                    var imported = imports_1_1.value;
                    if (this.wouldBeCyclic(imported)) {
                        this.markCyclic(sf);
                        return true;
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
            return false;
        };
        /**
         * Returns whether the source file is already known to be cyclic, or `null` if the result is not
         * yet known.
         */
        CycleResults.prototype.getCachedResult = function (sf) {
            var result = sf[NgCyclicResult];
            if (result === this.cyclic) {
                return true;
            }
            else if (result === this.acyclic) {
                return false;
            }
            else {
                // Either the symbol is missing or its value does not correspond with one of the current
                // result markers. As such, the result is unknown.
                return null;
            }
        };
        CycleResults.prototype.markCyclic = function (sf) {
            sf[NgCyclicResult] = this.cyclic;
        };
        CycleResults.prototype.markAcyclic = function (sf) {
            sf[NgCyclicResult] = this.acyclic;
        };
        return CycleResults;
    }());
    /**
     * Represents an import cycle between `from` and `to` in the program.
     *
     * This class allows us to do the work to compute the cyclic path between `from` and `to` only if
     * needed.
     */
    var Cycle = /** @class */ (function () {
        function Cycle(importGraph, from, to) {
            this.importGraph = importGraph;
            this.from = from;
            this.to = to;
        }
        /**
         * Compute an array of source-files that illustrates the cyclic path between `from` and `to`.
         *
         * Note that a `Cycle` will not be created unless a path is available between `to` and `from`,
         * so `findPath()` will never return `null`.
         */
        Cycle.prototype.getPath = function () {
            return tslib_1.__spreadArray([this.from], tslib_1.__read(this.importGraph.findPath(this.to, this.from)));
        };
        return Cycle;
    }());
    exports.Cycle = Cycle;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2N5Y2xlcy9zcmMvYW5hbHl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQU1IOztPQUVHO0lBQ0g7UUFTRSx1QkFBb0IsV0FBd0I7WUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7WUFSNUM7Ozs7O2VBS0c7WUFDSyxrQkFBYSxHQUFzQixJQUFJLENBQUM7UUFFRCxDQUFDO1FBRWhEOzs7Ozs7V0FNRztRQUNILHdDQUFnQixHQUFoQixVQUFpQixJQUFtQixFQUFFLEVBQWlCO1lBQ3JELGlGQUFpRjtZQUNqRixJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDbkUsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQy9EO1lBRUQsZ0ZBQWdGO1lBQ2hGLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDN0YsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsNkNBQXFCLEdBQXJCLFVBQXNCLElBQW1CLEVBQUUsRUFBaUI7WUFDMUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNILG9CQUFDO0lBQUQsQ0FBQyxBQXRDRCxJQXNDQztJQXRDWSxzQ0FBYTtJQXdDMUIsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFNaEQ7Ozs7OztPQU1HO0lBQ0g7UUFJRSxzQkFBcUIsSUFBbUIsRUFBVSxXQUF3QjtZQUFyRCxTQUFJLEdBQUosSUFBSSxDQUFlO1lBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWE7WUFIekQsV0FBTSxHQUFHLEVBQXdCLENBQUM7WUFDbEMsWUFBTyxHQUFHLEVBQXdCLENBQUM7UUFFeUIsQ0FBQztRQUU5RSxvQ0FBYSxHQUFiLFVBQWMsRUFBaUI7O1lBQzdCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO2dCQUNuQixtRkFBbUY7Z0JBQ25GLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7WUFFRCxJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNwQiwwRkFBMEY7Z0JBQzFGLGlDQUFpQztnQkFDakMsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELDZGQUE2RjtZQUM3Rix3RUFBd0U7WUFDeEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVyQixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7Z0JBQy9DLEtBQXVCLElBQUEsWUFBQSxpQkFBQSxPQUFPLENBQUEsZ0NBQUEscURBQUU7b0JBQTNCLElBQU0sUUFBUSxvQkFBQTtvQkFDakIsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUNoQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNwQixPQUFPLElBQUksQ0FBQztxQkFDYjtpQkFDRjs7Ozs7Ozs7O1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQ7OztXQUdHO1FBQ0ssc0NBQWUsR0FBdkIsVUFBd0IsRUFBb0I7WUFDMUMsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQzFCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7aUJBQU0sSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDbEMsT0FBTyxLQUFLLENBQUM7YUFDZDtpQkFBTTtnQkFDTCx3RkFBd0Y7Z0JBQ3hGLGtEQUFrRDtnQkFDbEQsT0FBTyxJQUFJLENBQUM7YUFDYjtRQUNILENBQUM7UUFFTyxpQ0FBVSxHQUFsQixVQUFtQixFQUFvQjtZQUNyQyxFQUFFLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNuQyxDQUFDO1FBRU8sa0NBQVcsR0FBbkIsVUFBb0IsRUFBb0I7WUFDdEMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDcEMsQ0FBQztRQUNILG1CQUFDO0lBQUQsQ0FBQyxBQXpERCxJQXlEQztJQUVEOzs7OztPQUtHO0lBQ0g7UUFDRSxlQUNZLFdBQXdCLEVBQVcsSUFBbUIsRUFBVyxFQUFpQjtZQUFsRixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtZQUFXLFNBQUksR0FBSixJQUFJLENBQWU7WUFBVyxPQUFFLEdBQUYsRUFBRSxDQUFlO1FBQUcsQ0FBQztRQUVsRzs7Ozs7V0FLRztRQUNILHVCQUFPLEdBQVA7WUFDRSw4QkFBUSxJQUFJLENBQUMsSUFBSSxrQkFBSyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsR0FBRTtRQUN4RSxDQUFDO1FBQ0gsWUFBQztJQUFELENBQUMsQUFiRCxJQWFDO0lBYlksc0JBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7SW1wb3J0R3JhcGh9IGZyb20gJy4vaW1wb3J0cyc7XG5cbi8qKlxuICogQW5hbHl6ZXMgYSBgdHMuUHJvZ3JhbWAgZm9yIGN5Y2xlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEN5Y2xlQW5hbHl6ZXIge1xuICAvKipcbiAgICogQ3ljbGUgZGV0ZWN0aW9uIGlzIHJlcXVlc3RlZCB3aXRoIHRoZSBzYW1lIGBmcm9tYCBzb3VyY2UgZmlsZSBmb3IgYWxsIHVzZWQgZGlyZWN0aXZlcyBhbmQgcGlwZXNcbiAgICogd2l0aGluIGEgY29tcG9uZW50LCB3aGljaCBtYWtlcyBpdCBiZW5lZmljaWFsIHRvIGNhY2hlIHRoZSByZXN1bHRzIGFzIGxvbmcgYXMgdGhlIGBmcm9tYCBzb3VyY2VcbiAgICogZmlsZSBoYXMgbm90IGNoYW5nZWQuIFRoaXMgYXZvaWRzIHZpc2l0aW5nIHRoZSBpbXBvcnQgZ3JhcGggdGhhdCBpcyByZWFjaGFibGUgZnJvbSBtdWx0aXBsZVxuICAgKiBkaXJlY3RpdmVzL3BpcGVzIG1vcmUgdGhhbiBvbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBjYWNoZWRSZXN1bHRzOiBDeWNsZVJlc3VsdHN8bnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpbXBvcnRHcmFwaDogSW1wb3J0R3JhcGgpIHt9XG5cbiAgLyoqXG4gICAqIENoZWNrIGZvciBhIGN5Y2xlIHRvIGJlIGNyZWF0ZWQgaW4gdGhlIGB0cy5Qcm9ncmFtYCBieSBhZGRpbmcgYW4gaW1wb3J0IGJldHdlZW4gYGZyb21gIGFuZFxuICAgKiBgdG9gLlxuICAgKlxuICAgKiBAcmV0dXJucyBhIGBDeWNsZWAgb2JqZWN0IGlmIGFuIGltcG9ydCBiZXR3ZWVuIGBmcm9tYCBhbmQgYHRvYCB3b3VsZCBjcmVhdGUgYSBjeWNsZTsgYG51bGxgXG4gICAqICAgICBvdGhlcndpc2UuXG4gICAqL1xuICB3b3VsZENyZWF0ZUN5Y2xlKGZyb206IHRzLlNvdXJjZUZpbGUsIHRvOiB0cy5Tb3VyY2VGaWxlKTogQ3ljbGV8bnVsbCB7XG4gICAgLy8gVHJ5IHRvIHJldXNlIHRoZSBjYWNoZWQgcmVzdWx0cyBhcyBsb25nIGFzIHRoZSBgZnJvbWAgc291cmNlIGZpbGUgaXMgdGhlIHNhbWUuXG4gICAgaWYgKHRoaXMuY2FjaGVkUmVzdWx0cyA9PT0gbnVsbCB8fCB0aGlzLmNhY2hlZFJlc3VsdHMuZnJvbSAhPT0gZnJvbSkge1xuICAgICAgdGhpcy5jYWNoZWRSZXN1bHRzID0gbmV3IEN5Y2xlUmVzdWx0cyhmcm9tLCB0aGlzLmltcG9ydEdyYXBoKTtcbiAgICB9XG5cbiAgICAvLyBJbXBvcnQgb2YgJ2Zyb20nIC0+ICd0bycgaXMgaWxsZWdhbCBpZiBhbiBlZGdlICd0bycgLT4gJ2Zyb20nIGFscmVhZHkgZXhpc3RzLlxuICAgIHJldHVybiB0aGlzLmNhY2hlZFJlc3VsdHMud291bGRCZUN5Y2xpYyh0bykgPyBuZXcgQ3ljbGUodGhpcy5pbXBvcnRHcmFwaCwgZnJvbSwgdG8pIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvcmQgYSBzeW50aGV0aWMgaW1wb3J0IGZyb20gYGZyb21gIHRvIGB0b2AuXG4gICAqXG4gICAqIFRoaXMgaXMgYW4gaW1wb3J0IHRoYXQgZG9lc24ndCBleGlzdCBpbiB0aGUgYHRzLlByb2dyYW1gIGJ1dCB3aWxsIGJlIGNvbnNpZGVyZWQgYXMgcGFydCBvZiB0aGVcbiAgICogaW1wb3J0IGdyYXBoIGZvciBjeWNsZSBjcmVhdGlvbi5cbiAgICovXG4gIHJlY29yZFN5bnRoZXRpY0ltcG9ydChmcm9tOiB0cy5Tb3VyY2VGaWxlLCB0bzogdHMuU291cmNlRmlsZSk6IHZvaWQge1xuICAgIHRoaXMuY2FjaGVkUmVzdWx0cyA9IG51bGw7XG4gICAgdGhpcy5pbXBvcnRHcmFwaC5hZGRTeW50aGV0aWNJbXBvcnQoZnJvbSwgdG8pO1xuICB9XG59XG5cbmNvbnN0IE5nQ3ljbGljUmVzdWx0ID0gU3ltYm9sKCdOZ0N5Y2xpY1Jlc3VsdCcpO1xudHlwZSBDeWNsaWNSZXN1bHRNYXJrZXIgPSB7XG4gIF9fYnJhbmQ6ICdDeWNsaWNSZXN1bHRNYXJrZXInO1xufTtcbnR5cGUgQ3ljbGljU291cmNlRmlsZSA9IHRzLlNvdXJjZUZpbGUme1tOZ0N5Y2xpY1Jlc3VsdF0/OiBDeWNsaWNSZXN1bHRNYXJrZXJ9O1xuXG4vKipcbiAqIFN0b3JlcyB0aGUgcmVzdWx0cyBvZiBjeWNsZSBkZXRlY3Rpb24gaW4gYSBtZW1vcnkgZWZmaWNpZW50IG1hbm5lci4gQSBzeW1ib2wgaXMgYXR0YWNoZWQgdG9cbiAqIHNvdXJjZSBmaWxlcyB0aGF0IGluZGljYXRlIHdoYXQgdGhlIGN5Y2xpYyBhbmFseXNpcyByZXN1bHQgaXMsIGFzIGluZGljYXRlZCBieSB0d28gbWFya2VycyB0aGF0XG4gKiBhcmUgdW5pcXVlIHRvIHRoaXMgaW5zdGFuY2UuIFRoaXMgYWxsZXZpYXRlcyBtZW1vcnkgcHJlc3N1cmUgaW4gbGFyZ2UgaW1wb3J0IGdyYXBocywgYXMgZWFjaFxuICogZXhlY3V0aW9uIGlzIGFibGUgdG8gc3RvcmUgaXRzIHJlc3VsdHMgaW4gdGhlIHNhbWUgbWVtb3J5IGxvY2F0aW9uIChpLmUuIGluIHRoZSBzeW1ib2xcbiAqIG9uIHRoZSBzb3VyY2UgZmlsZSkgYXMgZWFybGllciBleGVjdXRpb25zLlxuICovXG5jbGFzcyBDeWNsZVJlc3VsdHMge1xuICBwcml2YXRlIHJlYWRvbmx5IGN5Y2xpYyA9IHt9IGFzIEN5Y2xpY1Jlc3VsdE1hcmtlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBhY3ljbGljID0ge30gYXMgQ3ljbGljUmVzdWx0TWFya2VyO1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGZyb206IHRzLlNvdXJjZUZpbGUsIHByaXZhdGUgaW1wb3J0R3JhcGg6IEltcG9ydEdyYXBoKSB7fVxuXG4gIHdvdWxkQmVDeWNsaWMoc2Y6IHRzLlNvdXJjZUZpbGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBjYWNoZWQgPSB0aGlzLmdldENhY2hlZFJlc3VsdChzZik7XG4gICAgaWYgKGNhY2hlZCAhPT0gbnVsbCkge1xuICAgICAgLy8gVGhlIHJlc3VsdCBmb3IgdGhpcyBzb3VyY2UgZmlsZSBoYXMgYWxyZWFkeSBiZWVuIGNvbXB1dGVkLCBzbyByZXR1cm4gaXRzIHJlc3VsdC5cbiAgICAgIHJldHVybiBjYWNoZWQ7XG4gICAgfVxuXG4gICAgaWYgKHNmID09PSB0aGlzLmZyb20pIHtcbiAgICAgIC8vIFdlIGhhdmUgcmVhY2hlZCB0aGUgc291cmNlIGZpbGUgdGhhdCB3ZSB3YW50IHRvIGNyZWF0ZSBhbiBpbXBvcnQgZnJvbSwgd2hpY2ggbWVhbnMgdGhhdFxuICAgICAgLy8gZG9pbmcgc28gd291bGQgY3JlYXRlIGEgY3ljbGUuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBBc3N1bWUgZm9yIG5vdyB0aGF0IHRoZSBmaWxlIHdpbGwgYmUgYWN5Y2xpYzsgdGhpcyBwcmV2ZW50cyBpbmZpbml0ZSByZWN1cnNpb24gaW4gdGhlIGNhc2VcbiAgICAvLyB0aGF0IGBzZmAgaXMgdmlzaXRlZCBhZ2FpbiBhcyBwYXJ0IG9mIGFuIGV4aXN0aW5nIGN5Y2xlIGluIHRoZSBncmFwaC5cbiAgICB0aGlzLm1hcmtBY3ljbGljKHNmKTtcblxuICAgIGNvbnN0IGltcG9ydHMgPSB0aGlzLmltcG9ydEdyYXBoLmltcG9ydHNPZihzZik7XG4gICAgZm9yIChjb25zdCBpbXBvcnRlZCBvZiBpbXBvcnRzKSB7XG4gICAgICBpZiAodGhpcy53b3VsZEJlQ3ljbGljKGltcG9ydGVkKSkge1xuICAgICAgICB0aGlzLm1hcmtDeWNsaWMoc2YpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciB0aGUgc291cmNlIGZpbGUgaXMgYWxyZWFkeSBrbm93biB0byBiZSBjeWNsaWMsIG9yIGBudWxsYCBpZiB0aGUgcmVzdWx0IGlzIG5vdFxuICAgKiB5ZXQga25vd24uXG4gICAqL1xuICBwcml2YXRlIGdldENhY2hlZFJlc3VsdChzZjogQ3ljbGljU291cmNlRmlsZSk6IGJvb2xlYW58bnVsbCB7XG4gICAgY29uc3QgcmVzdWx0ID0gc2ZbTmdDeWNsaWNSZXN1bHRdO1xuICAgIGlmIChyZXN1bHQgPT09IHRoaXMuY3ljbGljKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHJlc3VsdCA9PT0gdGhpcy5hY3ljbGljKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEVpdGhlciB0aGUgc3ltYm9sIGlzIG1pc3Npbmcgb3IgaXRzIHZhbHVlIGRvZXMgbm90IGNvcnJlc3BvbmQgd2l0aCBvbmUgb2YgdGhlIGN1cnJlbnRcbiAgICAgIC8vIHJlc3VsdCBtYXJrZXJzLiBBcyBzdWNoLCB0aGUgcmVzdWx0IGlzIHVua25vd24uXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG1hcmtDeWNsaWMoc2Y6IEN5Y2xpY1NvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICBzZltOZ0N5Y2xpY1Jlc3VsdF0gPSB0aGlzLmN5Y2xpYztcbiAgfVxuXG4gIHByaXZhdGUgbWFya0FjeWNsaWMoc2Y6IEN5Y2xpY1NvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICBzZltOZ0N5Y2xpY1Jlc3VsdF0gPSB0aGlzLmFjeWNsaWM7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIGltcG9ydCBjeWNsZSBiZXR3ZWVuIGBmcm9tYCBhbmQgYHRvYCBpbiB0aGUgcHJvZ3JhbS5cbiAqXG4gKiBUaGlzIGNsYXNzIGFsbG93cyB1cyB0byBkbyB0aGUgd29yayB0byBjb21wdXRlIHRoZSBjeWNsaWMgcGF0aCBiZXR3ZWVuIGBmcm9tYCBhbmQgYHRvYCBvbmx5IGlmXG4gKiBuZWVkZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDeWNsZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBpbXBvcnRHcmFwaDogSW1wb3J0R3JhcGgsIHJlYWRvbmx5IGZyb206IHRzLlNvdXJjZUZpbGUsIHJlYWRvbmx5IHRvOiB0cy5Tb3VyY2VGaWxlKSB7fVxuXG4gIC8qKlxuICAgKiBDb21wdXRlIGFuIGFycmF5IG9mIHNvdXJjZS1maWxlcyB0aGF0IGlsbHVzdHJhdGVzIHRoZSBjeWNsaWMgcGF0aCBiZXR3ZWVuIGBmcm9tYCBhbmQgYHRvYC5cbiAgICpcbiAgICogTm90ZSB0aGF0IGEgYEN5Y2xlYCB3aWxsIG5vdCBiZSBjcmVhdGVkIHVubGVzcyBhIHBhdGggaXMgYXZhaWxhYmxlIGJldHdlZW4gYHRvYCBhbmQgYGZyb21gLFxuICAgKiBzbyBgZmluZFBhdGgoKWAgd2lsbCBuZXZlciByZXR1cm4gYG51bGxgLlxuICAgKi9cbiAgZ2V0UGF0aCgpOiB0cy5Tb3VyY2VGaWxlW10ge1xuICAgIHJldHVybiBbdGhpcy5mcm9tLCAuLi50aGlzLmltcG9ydEdyYXBoLmZpbmRQYXRoKHRoaXMudG8sIHRoaXMuZnJvbSkhXTtcbiAgfVxufVxuXG5cbi8qKlxuICogV2hhdCB0byBkbyBpZiBhIGN5Y2xlIGlzIGRldGVjdGVkLlxuICovXG5leHBvcnQgY29uc3QgZW51bSBDeWNsZUhhbmRsaW5nU3RyYXRlZ3kge1xuICAvKiogQWRkIFwicmVtb3RlIHNjb3BpbmdcIiBjb2RlIHRvIGF2b2lkIGNyZWF0aW5nIGEgY3ljbGUuICovXG4gIFVzZVJlbW90ZVNjb3BpbmcsXG4gIC8qKiBGYWlsIHRoZSBjb21waWxhdGlvbiB3aXRoIGFuIGVycm9yLiAqL1xuICBFcnJvcixcbn1cbiJdfQ==