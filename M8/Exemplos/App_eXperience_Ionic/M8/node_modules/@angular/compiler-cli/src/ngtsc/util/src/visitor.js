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
        define("@angular/compiler-cli/src/ngtsc/util/src/visitor", ["require", "exports", "tslib", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Visitor = exports.visit = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    /**
     * Visit a node with the given visitor and return a transformed copy.
     */
    function visit(node, visitor, context) {
        return visitor._visit(node, context);
    }
    exports.visit = visit;
    /**
     * Abstract base class for visitors, which processes certain nodes specially to allow insertion
     * of other nodes before them.
     */
    var Visitor = /** @class */ (function () {
        function Visitor() {
            /**
             * Maps statements to an array of statements that should be inserted before them.
             */
            this._before = new Map();
            /**
             * Maps statements to an array of statements that should be inserted after them.
             */
            this._after = new Map();
        }
        Visitor.prototype._visitListEntryNode = function (node, visitor) {
            var result = visitor(node);
            if (result.before !== undefined) {
                // Record that some nodes should be inserted before the given declaration. The declaration's
                // parent's _visit call is responsible for performing this insertion.
                this._before.set(result.node, result.before);
            }
            if (result.after !== undefined) {
                // Same with nodes that should be inserted after.
                this._after.set(result.node, result.after);
            }
            return result.node;
        };
        /**
         * Visit types of nodes which don't have their own explicit visitor.
         */
        Visitor.prototype.visitOtherNode = function (node) {
            return node;
        };
        /**
         * @internal
         */
        Visitor.prototype._visit = function (node, context) {
            var _this = this;
            // First, visit the node. visitedNode starts off as `null` but should be set after visiting
            // is completed.
            var visitedNode = null;
            node = ts.visitEachChild(node, function (child) { return _this._visit(child, context); }, context);
            if (ts.isClassDeclaration(node)) {
                visitedNode =
                    this._visitListEntryNode(node, function (node) { return _this.visitClassDeclaration(node); });
            }
            else {
                visitedNode = this.visitOtherNode(node);
            }
            // If the visited node has a `statements` array then process them, maybe replacing the visited
            // node and adding additional statements.
            if (hasStatements(visitedNode)) {
                visitedNode = this._maybeProcessStatements(visitedNode);
            }
            return visitedNode;
        };
        Visitor.prototype._maybeProcessStatements = function (node) {
            var _this = this;
            // Shortcut - if every statement doesn't require nodes to be prepended or appended,
            // this is a no-op.
            if (node.statements.every(function (stmt) { return !_this._before.has(stmt) && !_this._after.has(stmt); })) {
                return node;
            }
            // There are statements to prepend, so clone the original node.
            var clone = ts.getMutableClone(node);
            // Build a new list of statements and patch it onto the clone.
            var newStatements = [];
            clone.statements.forEach(function (stmt) {
                if (_this._before.has(stmt)) {
                    newStatements.push.apply(newStatements, tslib_1.__spreadArray([], tslib_1.__read(_this._before.get(stmt))));
                    _this._before.delete(stmt);
                }
                newStatements.push(stmt);
                if (_this._after.has(stmt)) {
                    newStatements.push.apply(newStatements, tslib_1.__spreadArray([], tslib_1.__read(_this._after.get(stmt))));
                    _this._after.delete(stmt);
                }
            });
            clone.statements = ts.createNodeArray(newStatements, node.statements.hasTrailingComma);
            return clone;
        };
        return Visitor;
    }());
    exports.Visitor = Visitor;
    function hasStatements(node) {
        var block = node;
        return block.statements !== undefined && Array.isArray(block.statements);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdXRpbC9zcmMvdmlzaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBWWpDOztPQUVHO0lBQ0gsU0FBZ0IsS0FBSyxDQUNqQixJQUFPLEVBQUUsT0FBZ0IsRUFBRSxPQUFpQztRQUM5RCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFIRCxzQkFHQztJQUVEOzs7T0FHRztJQUNIO1FBQUE7WUFDRTs7ZUFFRztZQUNLLFlBQU8sR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztZQUVyRDs7ZUFFRztZQUNLLFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztRQXFGdEQsQ0FBQztRQTVFUyxxQ0FBbUIsR0FBM0IsVUFDSSxJQUFPLEVBQUUsT0FBMkQ7WUFDdEUsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQy9CLDRGQUE0RjtnQkFDNUYscUVBQXFFO2dCQUNyRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM5QztZQUNELElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQzlCLGlEQUFpRDtnQkFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDNUM7WUFDRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDckIsQ0FBQztR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QUFDLElBQWE7UUFDbEMsSUFBTSxLQUFLLEdBQUcsSUFBMEIsQ0FBQztRQUN6QyxPQUFPLEtBQUssQ0FBQyxVQUFVLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzNFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogUmVzdWx0IHR5cGUgb2YgdmlzaXRpbmcgYSBub2RlIHRoYXQncyB0eXBpY2FsbHkgYW4gZW50cnkgaW4gYSBsaXN0LCB3aGljaCBhbGxvd3Mgc3BlY2lmeWluZyB0aGF0XG4gKiBub2RlcyBzaG91bGQgYmUgYWRkZWQgYmVmb3JlIHRoZSB2aXNpdGVkIG5vZGUgaW4gdGhlIG91dHB1dC5cbiAqL1xuZXhwb3J0IHR5cGUgVmlzaXRMaXN0RW50cnlSZXN1bHQ8QiBleHRlbmRzIHRzLk5vZGUsIFQgZXh0ZW5kcyBCPiA9IHtcbiAgbm9kZTogVCxcbiAgYmVmb3JlPzogQltdLFxuICBhZnRlcj86IEJbXSxcbn07XG5cbi8qKlxuICogVmlzaXQgYSBub2RlIHdpdGggdGhlIGdpdmVuIHZpc2l0b3IgYW5kIHJldHVybiBhIHRyYW5zZm9ybWVkIGNvcHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2aXNpdDxUIGV4dGVuZHMgdHMuTm9kZT4oXG4gICAgbm9kZTogVCwgdmlzaXRvcjogVmlzaXRvciwgY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KTogVCB7XG4gIHJldHVybiB2aXNpdG9yLl92aXNpdChub2RlLCBjb250ZXh0KTtcbn1cblxuLyoqXG4gKiBBYnN0cmFjdCBiYXNlIGNsYXNzIGZvciB2aXNpdG9ycywgd2hpY2ggcHJvY2Vzc2VzIGNlcnRhaW4gbm9kZXMgc3BlY2lhbGx5IHRvIGFsbG93IGluc2VydGlvblxuICogb2Ygb3RoZXIgbm9kZXMgYmVmb3JlIHRoZW0uXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWaXNpdG9yIHtcbiAgLyoqXG4gICAqIE1hcHMgc3RhdGVtZW50cyB0byBhbiBhcnJheSBvZiBzdGF0ZW1lbnRzIHRoYXQgc2hvdWxkIGJlIGluc2VydGVkIGJlZm9yZSB0aGVtLlxuICAgKi9cbiAgcHJpdmF0ZSBfYmVmb3JlID0gbmV3IE1hcDx0cy5Ob2RlLCB0cy5TdGF0ZW1lbnRbXT4oKTtcblxuICAvKipcbiAgICogTWFwcyBzdGF0ZW1lbnRzIHRvIGFuIGFycmF5IG9mIHN0YXRlbWVudHMgdGhhdCBzaG91bGQgYmUgaW5zZXJ0ZWQgYWZ0ZXIgdGhlbS5cbiAgICovXG4gIHByaXZhdGUgX2FmdGVyID0gbmV3IE1hcDx0cy5Ob2RlLCB0cy5TdGF0ZW1lbnRbXT4oKTtcblxuICAvKipcbiAgICogVmlzaXQgYSBjbGFzcyBkZWNsYXJhdGlvbiwgcmV0dXJuaW5nIGF0IGxlYXN0IHRoZSB0cmFuc2Zvcm1lZCBkZWNsYXJhdGlvbiBhbmQgb3B0aW9uYWxseSBvdGhlclxuICAgKiBub2RlcyB0byBpbnNlcnQgYmVmb3JlIHRoZSBkZWNsYXJhdGlvbi5cbiAgICovXG4gIGFic3RyYWN0IHZpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlOiB0cy5DbGFzc0RlY2xhcmF0aW9uKTpcbiAgICAgIFZpc2l0TGlzdEVudHJ5UmVzdWx0PHRzLlN0YXRlbWVudCwgdHMuQ2xhc3NEZWNsYXJhdGlvbj47XG5cbiAgcHJpdmF0ZSBfdmlzaXRMaXN0RW50cnlOb2RlPFQgZXh0ZW5kcyB0cy5TdGF0ZW1lbnQ+KFxuICAgICAgbm9kZTogVCwgdmlzaXRvcjogKG5vZGU6IFQpID0+IFZpc2l0TGlzdEVudHJ5UmVzdWx0PHRzLlN0YXRlbWVudCwgVD4pOiBUIHtcbiAgICBjb25zdCByZXN1bHQgPSB2aXNpdG9yKG5vZGUpO1xuICAgIGlmIChyZXN1bHQuYmVmb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIFJlY29yZCB0aGF0IHNvbWUgbm9kZXMgc2hvdWxkIGJlIGluc2VydGVkIGJlZm9yZSB0aGUgZ2l2ZW4gZGVjbGFyYXRpb24uIFRoZSBkZWNsYXJhdGlvbidzXG4gICAgICAvLyBwYXJlbnQncyBfdmlzaXQgY2FsbCBpcyByZXNwb25zaWJsZSBmb3IgcGVyZm9ybWluZyB0aGlzIGluc2VydGlvbi5cbiAgICAgIHRoaXMuX2JlZm9yZS5zZXQocmVzdWx0Lm5vZGUsIHJlc3VsdC5iZWZvcmUpO1xuICAgIH1cbiAgICBpZiAocmVzdWx0LmFmdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIFNhbWUgd2l0aCBub2RlcyB0aGF0IHNob3VsZCBiZSBpbnNlcnRlZCBhZnRlci5cbiAgICAgIHRoaXMuX2FmdGVyLnNldChyZXN1bHQubm9kZSwgcmVzdWx0LmFmdGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdC5ub2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFZpc2l0IHR5cGVzIG9mIG5vZGVzIHdoaWNoIGRvbid0IGhhdmUgdGhlaXIgb3duIGV4cGxpY2l0IHZpc2l0b3IuXG4gICAqL1xuICB2aXNpdE90aGVyTm9kZTxUIGV4dGVuZHMgdHMuTm9kZT4obm9kZTogVCk6IFQge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX3Zpc2l0PFQgZXh0ZW5kcyB0cy5Ob2RlPihub2RlOiBULCBjb250ZXh0OiB0cy5UcmFuc2Zvcm1hdGlvbkNvbnRleHQpOiBUIHtcbiAgICAvLyBGaXJzdCwgdmlzaXQgdGhlIG5vZGUuIHZpc2l0ZWROb2RlIHN0YXJ0cyBvZmYgYXMgYG51bGxgIGJ1dCBzaG91bGQgYmUgc2V0IGFmdGVyIHZpc2l0aW5nXG4gICAgLy8gaXMgY29tcGxldGVkLlxuICAgIGxldCB2aXNpdGVkTm9kZTogVHxudWxsID0gbnVsbDtcblxuICAgIG5vZGUgPSB0cy52aXNpdEVhY2hDaGlsZChub2RlLCBjaGlsZCA9PiB0aGlzLl92aXNpdChjaGlsZCwgY29udGV4dCksIGNvbnRleHQpIGFzIFQ7XG5cbiAgICBpZiAodHMuaXNDbGFzc0RlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICB2aXNpdGVkTm9kZSA9XG4gICAgICAgICAgdGhpcy5fdmlzaXRMaXN0RW50cnlOb2RlKFxuICAgICAgICAgICAgICBub2RlLCAobm9kZTogdHMuQ2xhc3NEZWNsYXJhdGlvbikgPT4gdGhpcy52aXNpdENsYXNzRGVjbGFyYXRpb24obm9kZSkpIGFzIHR5cGVvZiBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aXNpdGVkTm9kZSA9IHRoaXMudmlzaXRPdGhlck5vZGUobm9kZSk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHZpc2l0ZWQgbm9kZSBoYXMgYSBgc3RhdGVtZW50c2AgYXJyYXkgdGhlbiBwcm9jZXNzIHRoZW0sIG1heWJlIHJlcGxhY2luZyB0aGUgdmlzaXRlZFxuICAgIC8vIG5vZGUgYW5kIGFkZGluZyBhZGRpdGlvbmFsIHN0YXRlbWVudHMuXG4gICAgaWYgKGhhc1N0YXRlbWVudHModmlzaXRlZE5vZGUpKSB7XG4gICAgICB2aXNpdGVkTm9kZSA9IHRoaXMuX21heWJlUHJvY2Vzc1N0YXRlbWVudHModmlzaXRlZE5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB2aXNpdGVkTm9kZTtcbiAgfVxuXG4gIHByaXZhdGUgX21heWJlUHJvY2Vzc1N0YXRlbWVudHM8VCBleHRlbmRzIHRzLk5vZGUme3N0YXRlbWVudHM6IHRzLk5vZGVBcnJheTx0cy5TdGF0ZW1lbnQ+fT4oXG4gICAgICBub2RlOiBUKTogVCB7XG4gICAgLy8gU2hvcnRjdXQgLSBpZiBldmVyeSBzdGF0ZW1lbnQgZG9lc24ndCByZXF1aXJlIG5vZGVzIHRvIGJlIHByZXBlbmRlZCBvciBhcHBlbmRlZCxcbiAgICAvLyB0aGlzIGlzIGEgbm8tb3AuXG4gICAgaWYgKG5vZGUuc3RhdGVtZW50cy5ldmVyeShzdG10ID0+ICF0aGlzLl9iZWZvcmUuaGFzKHN0bXQpICYmICF0aGlzLl9hZnRlci5oYXMoc3RtdCkpKSB7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICAvLyBUaGVyZSBhcmUgc3RhdGVtZW50cyB0byBwcmVwZW5kLCBzbyBjbG9uZSB0aGUgb3JpZ2luYWwgbm9kZS5cbiAgICBjb25zdCBjbG9uZSA9IHRzLmdldE11dGFibGVDbG9uZShub2RlKTtcblxuICAgIC8vIEJ1aWxkIGEgbmV3IGxpc3Qgb2Ygc3RhdGVtZW50cyBhbmQgcGF0Y2ggaXQgb250byB0aGUgY2xvbmUuXG4gICAgY29uc3QgbmV3U3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBbXTtcbiAgICBjbG9uZS5zdGF0ZW1lbnRzLmZvckVhY2goc3RtdCA9PiB7XG4gICAgICBpZiAodGhpcy5fYmVmb3JlLmhhcyhzdG10KSkge1xuICAgICAgICBuZXdTdGF0ZW1lbnRzLnB1c2goLi4uKHRoaXMuX2JlZm9yZS5nZXQoc3RtdCkhIGFzIHRzLlN0YXRlbWVudFtdKSk7XG4gICAgICAgIHRoaXMuX2JlZm9yZS5kZWxldGUoc3RtdCk7XG4gICAgICB9XG4gICAgICBuZXdTdGF0ZW1lbnRzLnB1c2goc3RtdCk7XG4gICAgICBpZiAodGhpcy5fYWZ0ZXIuaGFzKHN0bXQpKSB7XG4gICAgICAgIG5ld1N0YXRlbWVudHMucHVzaCguLi4odGhpcy5fYWZ0ZXIuZ2V0KHN0bXQpISBhcyB0cy5TdGF0ZW1lbnRbXSkpO1xuICAgICAgICB0aGlzLl9hZnRlci5kZWxldGUoc3RtdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY2xvbmUuc3RhdGVtZW50cyA9IHRzLmNyZWF0ZU5vZGVBcnJheShuZXdTdGF0ZW1lbnRzLCBub2RlLnN0YXRlbWVudHMuaGFzVHJhaWxpbmdDb21tYSk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhc1N0YXRlbWVudHMobm9kZTogdHMuTm9kZSk6IG5vZGUgaXMgdHMuTm9kZSZ7c3RhdGVtZW50czogdHMuTm9kZUFycmF5PHRzLlN0YXRlbWVudD59IHtcbiAgY29uc3QgYmxvY2sgPSBub2RlIGFzIHtzdGF0ZW1lbnRzPzogYW55fTtcbiAgcmV0dXJuIGJsb2NrLnN0YXRlbWVudHMgIT09IHVuZGVmaW5lZCAmJiBBcnJheS5pc0FycmF5KGJsb2NrLnN0YXRlbWVudHMpO1xufVxuIl19