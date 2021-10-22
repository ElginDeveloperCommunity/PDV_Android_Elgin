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
        define("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/diagnostics", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/result"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.traceDynamicValue = exports.describeResolvedType = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var dynamic_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic");
    var result_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/result");
    /**
     * Derives a type representation from a resolved value to be reported in a diagnostic.
     *
     * @param value The resolved value for which a type representation should be derived.
     * @param maxDepth The maximum nesting depth of objects and arrays, defaults to 1 level.
     */
    function describeResolvedType(value, maxDepth) {
        var _a, _b;
        if (maxDepth === void 0) { maxDepth = 1; }
        if (value === null) {
            return 'null';
        }
        else if (value === undefined) {
            return 'undefined';
        }
        else if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') {
            return typeof value;
        }
        else if (value instanceof Map) {
            if (maxDepth === 0) {
                return 'object';
            }
            var entries = Array.from(value.entries()).map(function (_a) {
                var _b = tslib_1.__read(_a, 2), key = _b[0], v = _b[1];
                return quoteKey(key) + ": " + describeResolvedType(v, maxDepth - 1);
            });
            return entries.length > 0 ? "{ " + entries.join('; ') + " }" : '{}';
        }
        else if (value instanceof result_1.ResolvedModule) {
            return '(module)';
        }
        else if (value instanceof result_1.EnumValue) {
            return (_a = value.enumRef.debugName) !== null && _a !== void 0 ? _a : '(anonymous)';
        }
        else if (value instanceof imports_1.Reference) {
            return (_b = value.debugName) !== null && _b !== void 0 ? _b : '(anonymous)';
        }
        else if (Array.isArray(value)) {
            if (maxDepth === 0) {
                return 'Array';
            }
            return "[" + value.map(function (v) { return describeResolvedType(v, maxDepth - 1); }).join(', ') + "]";
        }
        else if (value instanceof dynamic_1.DynamicValue) {
            return '(not statically analyzable)';
        }
        else if (value instanceof result_1.KnownFn) {
            return 'Function';
        }
        else {
            return 'unknown';
        }
    }
    exports.describeResolvedType = describeResolvedType;
    function quoteKey(key) {
        if (/^[a-z0-9_]+$/i.test(key)) {
            return key;
        }
        else {
            return "'" + key.replace(/'/g, '\\\'') + "'";
        }
    }
    /**
     * Creates an array of related information diagnostics for a `DynamicValue` that describe the trace
     * of why an expression was evaluated as dynamic.
     *
     * @param node The node for which a `ts.Diagnostic` is to be created with the trace.
     * @param value The dynamic value for which a trace should be created.
     */
    function traceDynamicValue(node, value) {
        return value.accept(new TraceDynamicValueVisitor(node));
    }
    exports.traceDynamicValue = traceDynamicValue;
    var TraceDynamicValueVisitor = /** @class */ (function () {
        function TraceDynamicValueVisitor(node) {
            this.node = node;
            this.currentContainerNode = null;
        }
        TraceDynamicValueVisitor.prototype.visitDynamicInput = function (value) {
            var trace = value.reason.accept(this);
            if (this.shouldTrace(value.node)) {
                var info = diagnostics_1.makeRelatedInformation(value.node, 'Unable to evaluate this expression statically.');
                trace.unshift(info);
            }
            return trace;
        };
        TraceDynamicValueVisitor.prototype.visitDynamicString = function (value) {
            return [diagnostics_1.makeRelatedInformation(value.node, 'A string value could not be determined statically.')];
        };
        TraceDynamicValueVisitor.prototype.visitExternalReference = function (value) {
            var name = value.reason.debugName;
            var description = name !== null ? "'" + name + "'" : 'an anonymous declaration';
            return [diagnostics_1.makeRelatedInformation(value.node, "A value for " + description + " cannot be determined statically, as it is an external declaration.")];
        };
        TraceDynamicValueVisitor.prototype.visitComplexFunctionCall = function (value) {
            return [
                diagnostics_1.makeRelatedInformation(value.node, 'Unable to evaluate function call of complex function. A function must have exactly one return statement.'),
                diagnostics_1.makeRelatedInformation(value.reason.node, 'Function is declared here.')
            ];
        };
        TraceDynamicValueVisitor.prototype.visitInvalidExpressionType = function (value) {
            return [diagnostics_1.makeRelatedInformation(value.node, 'Unable to evaluate an invalid expression.')];
        };
        TraceDynamicValueVisitor.prototype.visitUnknown = function (value) {
            return [diagnostics_1.makeRelatedInformation(value.node, 'Unable to evaluate statically.')];
        };
        TraceDynamicValueVisitor.prototype.visitUnknownIdentifier = function (value) {
            return [diagnostics_1.makeRelatedInformation(value.node, 'Unknown reference.')];
        };
        TraceDynamicValueVisitor.prototype.visitDynamicType = function (value) {
            return [diagnostics_1.makeRelatedInformation(value.node, 'Dynamic type.')];
        };
        TraceDynamicValueVisitor.prototype.visitUnsupportedSyntax = function (value) {
            return [diagnostics_1.makeRelatedInformation(value.node, 'This syntax is not supported.')];
        };
        /**
         * Determines whether the dynamic value reported for the node should be traced, i.e. if it is not
         * part of the container for which the most recent trace was created.
         */
        TraceDynamicValueVisitor.prototype.shouldTrace = function (node) {
            if (node === this.node) {
                // Do not include a dynamic value for the origin node, as the main diagnostic is already
                // reported on that node.
                return false;
            }
            var container = getContainerNode(node);
            if (container === this.currentContainerNode) {
                // The node is part of the same container as the previous trace entry, so this dynamic value
                // should not become part of the trace.
                return false;
            }
            this.currentContainerNode = container;
            return true;
        };
        return TraceDynamicValueVisitor;
    }());
    /**
     * Determines the closest parent node that is to be considered as container, which is used to reduce
     * the granularity of tracing the dynamic values to a single entry per container. Currently, full
     * statements and destructuring patterns are considered as container.
     */
    function getContainerNode(node) {
        var currentNode = node;
        while (currentNode !== undefined) {
            switch (currentNode.kind) {
                case ts.SyntaxKind.ExpressionStatement:
                case ts.SyntaxKind.VariableStatement:
                case ts.SyntaxKind.ReturnStatement:
                case ts.SyntaxKind.IfStatement:
                case ts.SyntaxKind.SwitchStatement:
                case ts.SyntaxKind.DoStatement:
                case ts.SyntaxKind.WhileStatement:
                case ts.SyntaxKind.ForStatement:
                case ts.SyntaxKind.ForInStatement:
                case ts.SyntaxKind.ForOfStatement:
                case ts.SyntaxKind.ContinueStatement:
                case ts.SyntaxKind.BreakStatement:
                case ts.SyntaxKind.ThrowStatement:
                case ts.SyntaxKind.ObjectBindingPattern:
                case ts.SyntaxKind.ArrayBindingPattern:
                    return currentNode;
            }
            currentNode = currentNode.parent;
        }
        return node.getSourceFile();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ25vc3RpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3BhcnRpYWxfZXZhbHVhdG9yL3NyYy9kaWFnbm9zdGljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBRWpDLDJFQUF5RDtJQUN6RCxtRUFBd0M7SUFFeEMseUZBQTREO0lBQzVELHVGQUEyRTtJQUUzRTs7Ozs7T0FLRztJQUNILFNBQWdCLG9CQUFvQixDQUFDLEtBQW9CLEVBQUUsUUFBb0I7O1FBQXBCLHlCQUFBLEVBQUEsWUFBb0I7UUFDN0UsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQ2xCLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7YUFBTSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDOUIsT0FBTyxXQUFXLENBQUM7U0FDcEI7YUFBTSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssS0FBSyxTQUFTLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQy9GLE9BQU8sT0FBTyxLQUFLLENBQUM7U0FDckI7YUFBTSxJQUFJLEtBQUssWUFBWSxHQUFHLEVBQUU7WUFDL0IsSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFFO2dCQUNsQixPQUFPLFFBQVEsQ0FBQzthQUNqQjtZQUNELElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBUTtvQkFBUixLQUFBLHFCQUFRLEVBQVAsR0FBRyxRQUFBLEVBQUUsQ0FBQyxRQUFBO2dCQUN0RCxPQUFVLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBSyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsUUFBUSxHQUFHLENBQUMsQ0FBRyxDQUFDO1lB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QUFpQixDQUFDO2dCQUNyQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO2dCQUNsQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO2dCQUNsQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUM7Z0JBQ3hDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUI7b0JBQ3BDLE9BQU8sV0FBVyxDQUFDO2FBQ3RCO1lBRUQsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7U0FDbEM7UUFDRCxPQUFPLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM5QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge21ha2VSZWxhdGVkSW5mb3JtYXRpb259IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7UmVmZXJlbmNlfSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7RnVuY3Rpb25EZWZpbml0aW9ufSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcbmltcG9ydCB7RHluYW1pY1ZhbHVlLCBEeW5hbWljVmFsdWVWaXNpdG9yfSBmcm9tICcuL2R5bmFtaWMnO1xuaW1wb3J0IHtFbnVtVmFsdWUsIEtub3duRm4sIFJlc29sdmVkTW9kdWxlLCBSZXNvbHZlZFZhbHVlfSBmcm9tICcuL3Jlc3VsdCc7XG5cbi8qKlxuICogRGVyaXZlcyBhIHR5cGUgcmVwcmVzZW50YXRpb24gZnJvbSBhIHJlc29sdmVkIHZhbHVlIHRvIGJlIHJlcG9ydGVkIGluIGEgZGlhZ25vc3RpYy5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB3aGljaCBhIHR5cGUgcmVwcmVzZW50YXRpb24gc2hvdWxkIGJlIGRlcml2ZWQuXG4gKiBAcGFyYW0gbWF4RGVwdGggVGhlIG1heGltdW0gbmVzdGluZyBkZXB0aCBvZiBvYmplY3RzIGFuZCBhcnJheXMsIGRlZmF1bHRzIHRvIDEgbGV2ZWwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZVJlc29sdmVkVHlwZSh2YWx1ZTogUmVzb2x2ZWRWYWx1ZSwgbWF4RGVwdGg6IG51bWJlciA9IDEpOiBzdHJpbmcge1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbiAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE1hcCkge1xuICAgIGlmIChtYXhEZXB0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuICdvYmplY3QnO1xuICAgIH1cbiAgICBjb25zdCBlbnRyaWVzID0gQXJyYXkuZnJvbSh2YWx1ZS5lbnRyaWVzKCkpLm1hcCgoW2tleSwgdl0pID0+IHtcbiAgICAgIHJldHVybiBgJHtxdW90ZUtleShrZXkpfTogJHtkZXNjcmliZVJlc29sdmVkVHlwZSh2LCBtYXhEZXB0aCAtIDEpfWA7XG4gICAgfSk7XG4gICAgcmV0dXJuIGVudHJpZXMubGVuZ3RoID4gMCA/IGB7ICR7ZW50cmllcy5qb2luKCc7ICcpfSB9YCA6ICd7fSc7XG4gIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBSZXNvbHZlZE1vZHVsZSkge1xuICAgIHJldHVybiAnKG1vZHVsZSknO1xuICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgRW51bVZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLmVudW1SZWYuZGVidWdOYW1lID8/ICcoYW5vbnltb3VzKSc7XG4gIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBSZWZlcmVuY2UpIHtcbiAgICByZXR1cm4gdmFsdWUuZGVidWdOYW1lID8/ICcoYW5vbnltb3VzKSc7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBpZiAobWF4RGVwdGggPT09IDApIHtcbiAgICAgIHJldHVybiAnQXJyYXknO1xuICAgIH1cbiAgICByZXR1cm4gYFske3ZhbHVlLm1hcCh2ID0+IGRlc2NyaWJlUmVzb2x2ZWRUeXBlKHYsIG1heERlcHRoIC0gMSkpLmpvaW4oJywgJyl9XWA7XG4gIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICByZXR1cm4gJyhub3Qgc3RhdGljYWxseSBhbmFseXphYmxlKSc7XG4gIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBLbm93bkZuKSB7XG4gICAgcmV0dXJuICdGdW5jdGlvbic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICd1bmtub3duJztcbiAgfVxufVxuXG5mdW5jdGlvbiBxdW90ZUtleShrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmICgvXlthLXowLTlfXSskL2kudGVzdChrZXkpKSB7XG4gICAgcmV0dXJuIGtleTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYCcke2tleS5yZXBsYWNlKC8nL2csICdcXFxcXFwnJyl9J2A7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHJlbGF0ZWQgaW5mb3JtYXRpb24gZGlhZ25vc3RpY3MgZm9yIGEgYER5bmFtaWNWYWx1ZWAgdGhhdCBkZXNjcmliZSB0aGUgdHJhY2VcbiAqIG9mIHdoeSBhbiBleHByZXNzaW9uIHdhcyBldmFsdWF0ZWQgYXMgZHluYW1pYy5cbiAqXG4gKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSBmb3Igd2hpY2ggYSBgdHMuRGlhZ25vc3RpY2AgaXMgdG8gYmUgY3JlYXRlZCB3aXRoIHRoZSB0cmFjZS5cbiAqIEBwYXJhbSB2YWx1ZSBUaGUgZHluYW1pYyB2YWx1ZSBmb3Igd2hpY2ggYSB0cmFjZSBzaG91bGQgYmUgY3JlYXRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYWNlRHluYW1pY1ZhbHVlKFxuICAgIG5vZGU6IHRzLk5vZGUsIHZhbHVlOiBEeW5hbWljVmFsdWUpOiB0cy5EaWFnbm9zdGljUmVsYXRlZEluZm9ybWF0aW9uW10ge1xuICByZXR1cm4gdmFsdWUuYWNjZXB0KG5ldyBUcmFjZUR5bmFtaWNWYWx1ZVZpc2l0b3Iobm9kZSkpO1xufVxuXG5jbGFzcyBUcmFjZUR5bmFtaWNWYWx1ZVZpc2l0b3IgaW1wbGVtZW50cyBEeW5hbWljVmFsdWVWaXNpdG9yPHRzLkRpYWdub3N0aWNSZWxhdGVkSW5mb3JtYXRpb25bXT4ge1xuICBwcml2YXRlIGN1cnJlbnRDb250YWluZXJOb2RlOiB0cy5Ob2RlfG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbm9kZTogdHMuTm9kZSkge31cblxuICB2aXNpdER5bmFtaWNJbnB1dCh2YWx1ZTogRHluYW1pY1ZhbHVlPER5bmFtaWNWYWx1ZT4pOiB0cy5EaWFnbm9zdGljUmVsYXRlZEluZm9ybWF0aW9uW10ge1xuICAgIGNvbnN0IHRyYWNlID0gdmFsdWUucmVhc29uLmFjY2VwdCh0aGlzKTtcbiAgICBpZiAodGhpcy5zaG91bGRUcmFjZSh2YWx1ZS5ub2RlKSkge1xuICAgICAgY29uc3QgaW5mbyA9XG4gICAgICAgICAgbWFrZVJlbGF0ZWRJbmZvcm1hdGlvbih2YWx1ZS5ub2RlLCAnVW5hYmxlIHRvIGV2YWx1YXRlIHRoaXMgZXhwcmVzc2lvbiBzdGF0aWNhbGx5LicpO1xuICAgICAgdHJhY2UudW5zaGlmdChpbmZvKTtcbiAgICB9XG4gICAgcmV0dXJuIHRyYWNlO1xuICB9XG5cbiAgdmlzaXREeW5hbWljU3RyaW5nKHZhbHVlOiBEeW5hbWljVmFsdWUpOiB0cy5EaWFnbm9zdGljUmVsYXRlZEluZm9ybWF0aW9uW10ge1xuICAgIHJldHVybiBbbWFrZVJlbGF0ZWRJbmZvcm1hdGlvbihcbiAgICAgICAgdmFsdWUubm9kZSwgJ0Egc3RyaW5nIHZhbHVlIGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkIHN0YXRpY2FsbHkuJyldO1xuICB9XG5cbiAgdmlzaXRFeHRlcm5hbFJlZmVyZW5jZSh2YWx1ZTogRHluYW1pY1ZhbHVlPFJlZmVyZW5jZTx0cy5EZWNsYXJhdGlvbj4+KTpcbiAgICAgIHRzLkRpYWdub3N0aWNSZWxhdGVkSW5mb3JtYXRpb25bXSB7XG4gICAgY29uc3QgbmFtZSA9IHZhbHVlLnJlYXNvbi5kZWJ1Z05hbWU7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBuYW1lICE9PSBudWxsID8gYCcke25hbWV9J2AgOiAnYW4gYW5vbnltb3VzIGRlY2xhcmF0aW9uJztcbiAgICByZXR1cm4gW21ha2VSZWxhdGVkSW5mb3JtYXRpb24oXG4gICAgICAgIHZhbHVlLm5vZGUsXG4gICAgICAgIGBBIHZhbHVlIGZvciAke1xuICAgICAgICAgICAgZGVzY3JpcHRpb259IGNhbm5vdCBiZSBkZXRlcm1pbmVkIHN0YXRpY2FsbHksIGFzIGl0IGlzIGFuIGV4dGVybmFsIGRlY2xhcmF0aW9uLmApXTtcbiAgfVxuXG4gIHZpc2l0Q29tcGxleEZ1bmN0aW9uQ2FsbCh2YWx1ZTogRHluYW1pY1ZhbHVlPEZ1bmN0aW9uRGVmaW5pdGlvbj4pOlxuICAgICAgdHMuRGlhZ25vc3RpY1JlbGF0ZWRJbmZvcm1hdGlvbltdIHtcbiAgICByZXR1cm4gW1xuICAgICAgbWFrZVJlbGF0ZWRJbmZvcm1hdGlvbihcbiAgICAgICAgICB2YWx1ZS5ub2RlLFxuICAgICAgICAgICdVbmFibGUgdG8gZXZhbHVhdGUgZnVuY3Rpb24gY2FsbCBvZiBjb21wbGV4IGZ1bmN0aW9uLiBBIGZ1bmN0aW9uIG11c3QgaGF2ZSBleGFjdGx5IG9uZSByZXR1cm4gc3RhdGVtZW50LicpLFxuICAgICAgbWFrZVJlbGF0ZWRJbmZvcm1hdGlvbih2YWx1ZS5yZWFzb24ubm9kZSwgJ0Z1bmN0aW9uIGlzIGRlY2xhcmVkIGhlcmUuJylcbiAgICBdO1xuICB9XG5cbiAgdmlzaXRJbnZhbGlkRXhwcmVzc2lvblR5cGUodmFsdWU6IER5bmFtaWNWYWx1ZSk6IHRzLkRpYWdub3N0aWNSZWxhdGVkSW5mb3JtYXRpb25bXSB7XG4gICAgcmV0dXJuIFttYWtlUmVsYXRlZEluZm9ybWF0aW9uKHZhbHVlLm5vZGUsICdVbmFibGUgdG8gZXZhbHVhdGUgYW4gaW52YWxpZCBleHByZXNzaW9uLicpXTtcbiAgfVxuXG4gIHZpc2l0VW5rbm93bih2YWx1ZTogRHluYW1pY1ZhbHVlKTogdHMuRGlhZ25vc3RpY1JlbGF0ZWRJbmZvcm1hdGlvbltdIHtcbiAgICByZXR1cm4gW21ha2VSZWxhdGVkSW5mb3JtYXRpb24odmFsdWUubm9kZSwgJ1VuYWJsZSB0byBldmFsdWF0ZSBzdGF0aWNhbGx5LicpXTtcbiAgfVxuXG4gIHZpc2l0VW5rbm93bklkZW50aWZpZXIodmFsdWU6IER5bmFtaWNWYWx1ZSk6IHRzLkRpYWdub3N0aWNSZWxhdGVkSW5mb3JtYXRpb25bXSB7XG4gICAgcmV0dXJuIFttYWtlUmVsYXRlZEluZm9ybWF0aW9uKHZhbHVlLm5vZGUsICdVbmtub3duIHJlZmVyZW5jZS4nKV07XG4gIH1cblxuICB2aXNpdER5bmFtaWNUeXBlKHZhbHVlOiBEeW5hbWljVmFsdWUpOiB0cy5EaWFnbm9zdGljUmVsYXRlZEluZm9ybWF0aW9uW10ge1xuICAgIHJldHVybiBbbWFrZVJlbGF0ZWRJbmZvcm1hdGlvbih2YWx1ZS5ub2RlLCAnRHluYW1pYyB0eXBlLicpXTtcbiAgfVxuXG4gIHZpc2l0VW5zdXBwb3J0ZWRTeW50YXgodmFsdWU6IER5bmFtaWNWYWx1ZSk6IHRzLkRpYWdub3N0aWNSZWxhdGVkSW5mb3JtYXRpb25bXSB7XG4gICAgcmV0dXJuIFttYWtlUmVsYXRlZEluZm9ybWF0aW9uKHZhbHVlLm5vZGUsICdUaGlzIHN5bnRheCBpcyBub3Qgc3VwcG9ydGVkLicpXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGR5bmFtaWMgdmFsdWUgcmVwb3J0ZWQgZm9yIHRoZSBub2RlIHNob3VsZCBiZSB0cmFjZWQsIGkuZS4gaWYgaXQgaXMgbm90XG4gICAqIHBhcnQgb2YgdGhlIGNvbnRhaW5lciBmb3Igd2hpY2ggdGhlIG1vc3QgcmVjZW50IHRyYWNlIHdhcyBjcmVhdGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBzaG91bGRUcmFjZShub2RlOiB0cy5Ob2RlKTogYm9vbGVhbiB7XG4gICAgaWYgKG5vZGUgPT09IHRoaXMubm9kZSkge1xuICAgICAgLy8gRG8gbm90IGluY2x1ZGUgYSBkeW5hbWljIHZhbHVlIGZvciB0aGUgb3JpZ2luIG5vZGUsIGFzIHRoZSBtYWluIGRpYWdub3N0aWMgaXMgYWxyZWFkeVxuICAgICAgLy8gcmVwb3J0ZWQgb24gdGhhdCBub2RlLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lck5vZGUobm9kZSk7XG4gICAgaWYgKGNvbnRhaW5lciA9PT0gdGhpcy5jdXJyZW50Q29udGFpbmVyTm9kZSkge1xuICAgICAgLy8gVGhlIG5vZGUgaXMgcGFydCBvZiB0aGUgc2FtZSBjb250YWluZXIgYXMgdGhlIHByZXZpb3VzIHRyYWNlIGVudHJ5LCBzbyB0aGlzIGR5bmFtaWMgdmFsdWVcbiAgICAgIC8vIHNob3VsZCBub3QgYmVjb21lIHBhcnQgb2YgdGhlIHRyYWNlLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudENvbnRhaW5lck5vZGUgPSBjb250YWluZXI7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHRoZSBjbG9zZXN0IHBhcmVudCBub2RlIHRoYXQgaXMgdG8gYmUgY29uc2lkZXJlZCBhcyBjb250YWluZXIsIHdoaWNoIGlzIHVzZWQgdG8gcmVkdWNlXG4gKiB0aGUgZ3JhbnVsYXJpdHkgb2YgdHJhY2luZyB0aGUgZHluYW1pYyB2YWx1ZXMgdG8gYSBzaW5nbGUgZW50cnkgcGVyIGNvbnRhaW5lci4gQ3VycmVudGx5LCBmdWxsXG4gKiBzdGF0ZW1lbnRzIGFuZCBkZXN0cnVjdHVyaW5nIHBhdHRlcm5zIGFyZSBjb25zaWRlcmVkIGFzIGNvbnRhaW5lci5cbiAqL1xuZnVuY3Rpb24gZ2V0Q29udGFpbmVyTm9kZShub2RlOiB0cy5Ob2RlKTogdHMuTm9kZSB7XG4gIGxldCBjdXJyZW50Tm9kZTogdHMuTm9kZXx1bmRlZmluZWQgPSBub2RlO1xuICB3aGlsZSAoY3VycmVudE5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgIHN3aXRjaCAoY3VycmVudE5vZGUua2luZCkge1xuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkV4cHJlc3Npb25TdGF0ZW1lbnQ6XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuVmFyaWFibGVTdGF0ZW1lbnQ6XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuUmV0dXJuU3RhdGVtZW50OlxuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLklmU3RhdGVtZW50OlxuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlN3aXRjaFN0YXRlbWVudDpcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5Eb1N0YXRlbWVudDpcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5XaGlsZVN0YXRlbWVudDpcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5Gb3JTdGF0ZW1lbnQ6XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuRm9ySW5TdGF0ZW1lbnQ6XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuRm9yT2ZTdGF0ZW1lbnQ6XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuQ29udGludWVTdGF0ZW1lbnQ6XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuQnJlYWtTdGF0ZW1lbnQ6XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuVGhyb3dTdGF0ZW1lbnQ6XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuT2JqZWN0QmluZGluZ1BhdHRlcm46XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuQXJyYXlCaW5kaW5nUGF0dGVybjpcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlO1xuICAgIH1cblxuICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUucGFyZW50O1xuICB9XG4gIHJldHVybiBub2RlLmdldFNvdXJjZUZpbGUoKTtcbn1cbiJdfQ==