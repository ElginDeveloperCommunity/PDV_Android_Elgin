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
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/expression", ["require", "exports", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/typecheck/src/diagnostics", "@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.astToTypescript = exports.NULL_AS_ANY = void 0;
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/diagnostics");
    var ts_util_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util");
    exports.NULL_AS_ANY = ts.createAsExpression(ts.createNull(), ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
    var UNDEFINED = ts.createIdentifier('undefined');
    var UNARY_OPS = new Map([
        ['+', ts.SyntaxKind.PlusToken],
        ['-', ts.SyntaxKind.MinusToken],
    ]);
    var BINARY_OPS = new Map([
        ['+', ts.SyntaxKind.PlusToken],
        ['-', ts.SyntaxKind.MinusToken],
        ['<', ts.SyntaxKind.LessThanToken],
        ['>', ts.SyntaxKind.GreaterThanToken],
        ['<=', ts.SyntaxKind.LessThanEqualsToken],
        ['>=', ts.SyntaxKind.GreaterThanEqualsToken],
        ['==', ts.SyntaxKind.EqualsEqualsToken],
        ['===', ts.SyntaxKind.EqualsEqualsEqualsToken],
        ['*', ts.SyntaxKind.AsteriskToken],
        ['/', ts.SyntaxKind.SlashToken],
        ['%', ts.SyntaxKind.PercentToken],
        ['!=', ts.SyntaxKind.ExclamationEqualsToken],
        ['!==', ts.SyntaxKind.ExclamationEqualsEqualsToken],
        ['||', ts.SyntaxKind.BarBarToken],
        ['&&', ts.SyntaxKind.AmpersandAmpersandToken],
        ['&', ts.SyntaxKind.AmpersandToken],
        ['|', ts.SyntaxKind.BarToken],
        ['??', ts.SyntaxKind.QuestionQuestionToken],
    ]);
    /**
     * Convert an `AST` to TypeScript code directly, without going through an intermediate `Expression`
     * AST.
     */
    function astToTypescript(ast, maybeResolve, config) {
        var translator = new AstTranslator(maybeResolve, config);
        return translator.translate(ast);
    }
    exports.astToTypescript = astToTypescript;
    var AstTranslator = /** @class */ (function () {
        function AstTranslator(maybeResolve, config) {
            this.maybeResolve = maybeResolve;
            this.config = config;
        }
        AstTranslator.prototype.translate = function (ast) {
            // Skip over an `ASTWithSource` as its `visit` method calls directly into its ast's `visit`,
            // which would prevent any custom resolution through `maybeResolve` for that node.
            if (ast instanceof compiler_1.ASTWithSource) {
                ast = ast.ast;
            }
            // The `EmptyExpr` doesn't have a dedicated method on `AstVisitor`, so it's special cased here.
            if (ast instanceof compiler_1.EmptyExpr) {
                var res = ts.factory.createIdentifier('undefined');
                diagnostics_1.addParseSpanInfo(res, ast.sourceSpan);
                return res;
            }
            // First attempt to let any custom resolution logic provide a translation for the given node.
            var resolved = this.maybeResolve(ast);
            if (resolved !== null) {
                return resolved;
            }
            return ast.visit(this);
        };
        AstTranslator.prototype.visitUnary = function (ast) {
            var expr = this.translate(ast.expr);
            var op = UNARY_OPS.get(ast.operator);
            if (op === undefined) {
                throw new Error("Unsupported Unary.operator: " + ast.operator);
            }
            var node = diagnostics_1.wrapForDiagnostics(ts.createPrefix(op, expr));
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitBinary = function (ast) {
            var lhs = diagnostics_1.wrapForDiagnostics(this.translate(ast.left));
            var rhs = diagnostics_1.wrapForDiagnostics(this.translate(ast.right));
            var op = BINARY_OPS.get(ast.operation);
            if (op === undefined) {
                throw new Error("Unsupported Binary.operation: " + ast.operation);
            }
            var node = ts.createBinary(lhs, op, rhs);
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitChain = function (ast) {
            var _this = this;
            var elements = ast.expressions.map(function (expr) { return _this.translate(expr); });
            var node = diagnostics_1.wrapForDiagnostics(ts.createCommaList(elements));
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitConditional = function (ast) {
            var condExpr = this.translate(ast.condition);
            var trueExpr = this.translate(ast.trueExp);
            // Wrap `falseExpr` in parens so that the trailing parse span info is not attributed to the
            // whole conditional.
            // In the following example, the last source span comment (5,6) could be seen as the
            // trailing comment for _either_ the whole conditional expression _or_ just the `falseExpr` that
            // is immediately before it:
            // `conditional /*1,2*/ ? trueExpr /*3,4*/ : falseExpr /*5,6*/`
            // This should be instead be `conditional /*1,2*/ ? trueExpr /*3,4*/ : (falseExpr /*5,6*/)`
            var falseExpr = diagnostics_1.wrapForTypeChecker(this.translate(ast.falseExp));
            var node = ts.createParen(ts.createConditional(condExpr, trueExpr, falseExpr));
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitFunctionCall = function (ast) {
            var _this = this;
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.target));
            var args = ast.args.map(function (expr) { return _this.translate(expr); });
            var node = ts.createCall(receiver, undefined, args);
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitImplicitReceiver = function (ast) {
            throw new Error('Method not implemented.');
        };
        AstTranslator.prototype.visitThisReceiver = function (ast) {
            throw new Error('Method not implemented.');
        };
        AstTranslator.prototype.visitInterpolation = function (ast) {
            var _this = this;
            // Build up a chain of binary + operations to simulate the string concatenation of the
            // interpolation's expressions. The chain is started using an actual string literal to ensure
            // the type is inferred as 'string'.
            return ast.expressions.reduce(function (lhs, ast) {
                return ts.createBinary(lhs, ts.SyntaxKind.PlusToken, diagnostics_1.wrapForTypeChecker(_this.translate(ast)));
            }, ts.createLiteral(''));
        };
        AstTranslator.prototype.visitKeyedRead = function (ast) {
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            var key = this.translate(ast.key);
            var node = ts.createElementAccess(receiver, key);
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitKeyedWrite = function (ast) {
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            var left = ts.createElementAccess(receiver, this.translate(ast.key));
            // TODO(joost): annotate `left` with the span of the element access, which is not currently
            //  available on `ast`.
            var right = diagnostics_1.wrapForTypeChecker(this.translate(ast.value));
            var node = diagnostics_1.wrapForDiagnostics(ts.createBinary(left, ts.SyntaxKind.EqualsToken, right));
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitLiteralArray = function (ast) {
            var _this = this;
            var elements = ast.expressions.map(function (expr) { return _this.translate(expr); });
            var literal = ts.createArrayLiteral(elements);
            // If strictLiteralTypes is disabled, array literals are cast to `any`.
            var node = this.config.strictLiteralTypes ? literal : ts_util_1.tsCastToAny(literal);
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitLiteralMap = function (ast) {
            var _this = this;
            var properties = ast.keys.map(function (_a, idx) {
                var key = _a.key;
                var value = _this.translate(ast.values[idx]);
                return ts.createPropertyAssignment(ts.createStringLiteral(key), value);
            });
            var literal = ts.createObjectLiteral(properties, true);
            // If strictLiteralTypes is disabled, object literals are cast to `any`.
            var node = this.config.strictLiteralTypes ? literal : ts_util_1.tsCastToAny(literal);
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitLiteralPrimitive = function (ast) {
            var node;
            if (ast.value === undefined) {
                node = ts.createIdentifier('undefined');
            }
            else if (ast.value === null) {
                node = ts.createNull();
            }
            else {
                node = ts.createLiteral(ast.value);
            }
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitMethodCall = function (ast) {
            var _this = this;
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            var method = ts.createPropertyAccess(receiver, ast.name);
            diagnostics_1.addParseSpanInfo(method, ast.nameSpan);
            var args = ast.args.map(function (expr) { return _this.translate(expr); });
            var node = ts.createCall(method, undefined, args);
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitNonNullAssert = function (ast) {
            var expr = diagnostics_1.wrapForDiagnostics(this.translate(ast.expression));
            var node = ts.createNonNullExpression(expr);
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitPipe = function (ast) {
            throw new Error('Method not implemented.');
        };
        AstTranslator.prototype.visitPrefixNot = function (ast) {
            var expression = diagnostics_1.wrapForDiagnostics(this.translate(ast.expression));
            var node = ts.createLogicalNot(expression);
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitPropertyRead = function (ast) {
            // This is a normal property read - convert the receiver to an expression and emit the correct
            // TypeScript expression to read the property.
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            var name = ts.createPropertyAccess(receiver, ast.name);
            diagnostics_1.addParseSpanInfo(name, ast.nameSpan);
            var node = diagnostics_1.wrapForDiagnostics(name);
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitPropertyWrite = function (ast) {
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            var left = ts.createPropertyAccess(receiver, ast.name);
            diagnostics_1.addParseSpanInfo(left, ast.nameSpan);
            // TypeScript reports assignment errors on the entire lvalue expression. Annotate the lvalue of
            // the assignment with the sourceSpan, which includes receivers, rather than nameSpan for
            // consistency of the diagnostic location.
            // a.b.c = 1
            // ^^^^^^^^^ sourceSpan
            //     ^     nameSpan
            var leftWithPath = diagnostics_1.wrapForDiagnostics(left);
            diagnostics_1.addParseSpanInfo(leftWithPath, ast.sourceSpan);
            // The right needs to be wrapped in parens as well or we cannot accurately match its
            // span to just the RHS. For example, the span in `e = $event /*0,10*/` is ambiguous.
            // It could refer to either the whole binary expression or just the RHS.
            // We should instead generate `e = ($event /*0,10*/)` so we know the span 0,10 matches RHS.
            var right = diagnostics_1.wrapForTypeChecker(this.translate(ast.value));
            var node = diagnostics_1.wrapForDiagnostics(ts.createBinary(leftWithPath, ts.SyntaxKind.EqualsToken, right));
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitQuote = function (ast) {
            return exports.NULL_AS_ANY;
        };
        AstTranslator.prototype.visitSafeMethodCall = function (ast) {
            var _this = this;
            // See the comments in SafePropertyRead above for an explanation of the cases here.
            var node;
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            var args = ast.args.map(function (expr) { return _this.translate(expr); });
            if (this.config.strictSafeNavigationTypes) {
                // "a?.method(...)" becomes (null as any ? a!.method(...) : undefined)
                var method = ts.createPropertyAccess(ts.createNonNullExpression(receiver), ast.name);
                diagnostics_1.addParseSpanInfo(method, ast.nameSpan);
                var call = ts.createCall(method, undefined, args);
                node = ts.createParen(ts.createConditional(exports.NULL_AS_ANY, call, UNDEFINED));
            }
            else if (VeSafeLhsInferenceBugDetector.veWillInferAnyFor(ast)) {
                // "a?.method(...)" becomes (a as any).method(...)
                var method = ts.createPropertyAccess(ts_util_1.tsCastToAny(receiver), ast.name);
                diagnostics_1.addParseSpanInfo(method, ast.nameSpan);
                node = ts.createCall(method, undefined, args);
            }
            else {
                // "a?.method(...)" becomes (a!.method(...) as any)
                var method = ts.createPropertyAccess(ts.createNonNullExpression(receiver), ast.name);
                diagnostics_1.addParseSpanInfo(method, ast.nameSpan);
                node = ts_util_1.tsCastToAny(ts.createCall(method, undefined, args));
            }
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitSafePropertyRead = function (ast) {
            var node;
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            // The form of safe property reads depends on whether strictness is in use.
            if (this.config.strictSafeNavigationTypes) {
                // Basically, the return here is either the type of the complete expression with a null-safe
                // property read, or `undefined`. So a ternary is used to create an "or" type:
                // "a?.b" becomes (null as any ? a!.b : undefined)
                // The type of this expression is (typeof a!.b) | undefined, which is exactly as desired.
                var expr = ts.createPropertyAccess(ts.createNonNullExpression(receiver), ast.name);
                diagnostics_1.addParseSpanInfo(expr, ast.nameSpan);
                node = ts.createParen(ts.createConditional(exports.NULL_AS_ANY, expr, UNDEFINED));
            }
            else if (VeSafeLhsInferenceBugDetector.veWillInferAnyFor(ast)) {
                // Emulate a View Engine bug where 'any' is inferred for the left-hand side of the safe
                // navigation operation. With this bug, the type of the left-hand side is regarded as any.
                // Therefore, the left-hand side only needs repeating in the output (to validate it), and then
                // 'any' is used for the rest of the expression. This is done using a comma operator:
                // "a?.b" becomes (a as any).b, which will of course have type 'any'.
                node = ts.createPropertyAccess(ts_util_1.tsCastToAny(receiver), ast.name);
            }
            else {
                // The View Engine bug isn't active, so check the entire type of the expression, but the final
                // result is still inferred as `any`.
                // "a?.b" becomes (a!.b as any)
                var expr = ts.createPropertyAccess(ts.createNonNullExpression(receiver), ast.name);
                diagnostics_1.addParseSpanInfo(expr, ast.nameSpan);
                node = ts_util_1.tsCastToAny(expr);
            }
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        AstTranslator.prototype.visitSafeKeyedRead = function (ast) {
            var receiver = diagnostics_1.wrapForDiagnostics(this.translate(ast.receiver));
            var key = this.translate(ast.key);
            var node;
            // The form of safe property reads depends on whether strictness is in use.
            if (this.config.strictSafeNavigationTypes) {
                // "a?.[...]" becomes (null as any ? a![...] : undefined)
                var expr = ts.createElementAccess(ts.createNonNullExpression(receiver), key);
                diagnostics_1.addParseSpanInfo(expr, ast.sourceSpan);
                node = ts.createParen(ts.createConditional(exports.NULL_AS_ANY, expr, UNDEFINED));
            }
            else if (VeSafeLhsInferenceBugDetector.veWillInferAnyFor(ast)) {
                // "a?.[...]" becomes (a as any)[...]
                node = ts.createElementAccess(ts_util_1.tsCastToAny(receiver), key);
            }
            else {
                // "a?.[...]" becomes (a!.[...] as any)
                var expr = ts.createElementAccess(ts.createNonNullExpression(receiver), key);
                diagnostics_1.addParseSpanInfo(expr, ast.sourceSpan);
                node = ts_util_1.tsCastToAny(expr);
            }
            diagnostics_1.addParseSpanInfo(node, ast.sourceSpan);
            return node;
        };
        return AstTranslator;
    }());
    /**
     * Checks whether View Engine will infer a type of 'any' for the left-hand side of a safe navigation
     * operation.
     *
     * In View Engine's template type-checker, certain receivers of safe navigation operations will
     * cause a temporary variable to be allocated as part of the checking expression, to save the value
     * of the receiver and use it more than once in the expression. This temporary variable has type
     * 'any'. In practice, this means certain receivers cause View Engine to not check the full
     * expression, and other receivers will receive more complete checking.
     *
     * For compatibility, this logic is adapted from View Engine's expression_converter.ts so that the
     * Ivy checker can emulate this bug when needed.
     */
    var VeSafeLhsInferenceBugDetector = /** @class */ (function () {
        function VeSafeLhsInferenceBugDetector() {
        }
        VeSafeLhsInferenceBugDetector.veWillInferAnyFor = function (ast) {
            var visitor = VeSafeLhsInferenceBugDetector.SINGLETON;
            return ast instanceof compiler_1.SafeKeyedRead ? ast.receiver.visit(visitor) : ast.receiver.visit(visitor);
        };
        VeSafeLhsInferenceBugDetector.prototype.visitUnary = function (ast) {
            return ast.expr.visit(this);
        };
        VeSafeLhsInferenceBugDetector.prototype.visitBinary = function (ast) {
            return ast.left.visit(this) || ast.right.visit(this);
        };
        VeSafeLhsInferenceBugDetector.prototype.visitChain = function (ast) {
            return false;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitConditional = function (ast) {
            return ast.condition.visit(this) || ast.trueExp.visit(this) || ast.falseExp.visit(this);
        };
        VeSafeLhsInferenceBugDetector.prototype.visitFunctionCall = function (ast) {
            return true;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitImplicitReceiver = function (ast) {
            return false;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitThisReceiver = function (ast) {
            return false;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitInterpolation = function (ast) {
            var _this = this;
            return ast.expressions.some(function (exp) { return exp.visit(_this); });
        };
        VeSafeLhsInferenceBugDetector.prototype.visitKeyedRead = function (ast) {
            return false;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitKeyedWrite = function (ast) {
            return false;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitLiteralArray = function (ast) {
            return true;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitLiteralMap = function (ast) {
            return true;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitLiteralPrimitive = function (ast) {
            return false;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitMethodCall = function (ast) {
            return true;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitPipe = function (ast) {
            return true;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitPrefixNot = function (ast) {
            return ast.expression.visit(this);
        };
        VeSafeLhsInferenceBugDetector.prototype.visitNonNullAssert = function (ast) {
            return ast.expression.visit(this);
        };
        VeSafeLhsInferenceBugDetector.prototype.visitPropertyRead = function (ast) {
            return false;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitPropertyWrite = function (ast) {
            return false;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitQuote = function (ast) {
            return false;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitSafeMethodCall = function (ast) {
            return true;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitSafePropertyRead = function (ast) {
            return false;
        };
        VeSafeLhsInferenceBugDetector.prototype.visitSafeKeyedRead = function (ast) {
            return false;
        };
        VeSafeLhsInferenceBugDetector.SINGLETON = new VeSafeLhsInferenceBugDetector();
        return VeSafeLhsInferenceBugDetector;
    }());
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHlwZWNoZWNrL3NyYy9leHByZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILDhDQUF1WDtJQUN2WCwrQkFBaUM7SUFJakMseUZBQXVGO0lBQ3ZGLGlGQUFzQztJQUV6QixRQUFBLFdBQVcsR0FDcEIsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQy9GLElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUVuRCxJQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBaUM7UUFDeEQsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDOUIsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7S0FDaEMsQ0FBQyxDQUFDO0lBRUgsSUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQTRCO1FBQ3BELENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO1FBQzlCLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO1FBQy9CLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQ2xDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7UUFDckMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztRQUN6QyxD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QixHQUFyQixVQUFzQixHQUFxQjtZQUN6QyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCx1REFBZSxHQUFmLFVBQWdCLEdBQWU7WUFDN0IsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsaURBQVMsR0FBVCxVQUFVLEdBQWdCO1lBQ3hCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELHNEQUFjLEdBQWQsVUFBZSxHQUFjO1lBQzNCLE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUNELDBEQUFrQixHQUFsQixVQUFtQixHQUFjO1lBQy9CLE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUNELHlEQUFpQixHQUFqQixVQUFrQixHQUFpQjtZQUNqQyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCwwREFBa0IsR0FBbEIsVUFBbUIsR0FBa0I7WUFDbkMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0Qsa0RBQVUsR0FBVixVQUFXLEdBQVU7WUFDbkIsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0QsMkRBQW1CLEdBQW5CLFVBQW9CLEdBQW1CO1lBQ3JDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELDZEQUFxQixHQUFyQixVQUFzQixHQUFxQjtZQUN6QyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCwwREFBa0IsR0FBbEIsVUFBbUIsR0FBa0I7WUFDbkMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBM0VjLHVDQUFTLEdBQUcsSUFBSSw2QkFBNkIsRUFBRSxDQUFDO1FBNEVqRSxvQ0FBQztLQUFBLEFBN0VELElBNkVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QVNULCBBc3RWaXNpdG9yLCBBU1RXaXRoU291cmNlLCBCaW5hcnksIEJpbmRpbmdQaXBlLCBDaGFpbiwgQ29uZGl0aW9uYWwsIEVtcHR5RXhwciwgRnVuY3Rpb25DYWxsLCBJbXBsaWNpdFJlY2VpdmVyLCBJbnRlcnBvbGF0aW9uLCBLZXllZFJlYWQsIEtleWVkV3JpdGUsIExpdGVyYWxBcnJheSwgTGl0ZXJhbE1hcCwgTGl0ZXJhbFByaW1pdGl2ZSwgTWV0aG9kQ2FsbCwgTm9uTnVsbEFzc2VydCwgUHJlZml4Tm90LCBQcm9wZXJ0eVJlYWQsIFByb3BlcnR5V3JpdGUsIFF1b3RlLCBTYWZlS2V5ZWRSZWFkLCBTYWZlTWV0aG9kQ2FsbCwgU2FmZVByb3BlcnR5UmVhZCwgVGhpc1JlY2VpdmVyLCBVbmFyeX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7VHlwZUNoZWNraW5nQ29uZmlnfSBmcm9tICcuLi9hcGknO1xuXG5pbXBvcnQge2FkZFBhcnNlU3BhbkluZm8sIHdyYXBGb3JEaWFnbm9zdGljcywgd3JhcEZvclR5cGVDaGVja2VyfSBmcm9tICcuL2RpYWdub3N0aWNzJztcbmltcG9ydCB7dHNDYXN0VG9Bbnl9IGZyb20gJy4vdHNfdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBOVUxMX0FTX0FOWSA9XG4gICAgdHMuY3JlYXRlQXNFeHByZXNzaW9uKHRzLmNyZWF0ZU51bGwoKSwgdHMuY3JlYXRlS2V5d29yZFR5cGVOb2RlKHRzLlN5bnRheEtpbmQuQW55S2V5d29yZCkpO1xuY29uc3QgVU5ERUZJTkVEID0gdHMuY3JlYXRlSWRlbnRpZmllcigndW5kZWZpbmVkJyk7XG5cbmNvbnN0IFVOQVJZX09QUyA9IG5ldyBNYXA8c3RyaW5nLCB0cy5QcmVmaXhVbmFyeU9wZXJhdG9yPihbXG4gIFsnKycsIHRzLlN5bnRheEtpbmQuUGx1c1Rva2VuXSxcbiAgWyctJywgdHMuU3ludGF4S2luZC5NaW51c1Rva2VuXSxcbl0pO1xuXG5jb25zdCBCSU5BUllfT1BTID0gbmV3IE1hcDxzdHJpbmcsIHRzLkJpbmFyeU9wZXJhdG9yPihbXG4gIFsnKycsIHRzLlN5bnRheEtpbmQuUGx1c1Rva2VuXSxcbiAgWyctJywgdHMuU3ludGF4S2luZC5NaW51c1Rva2VuXSxcbiAgWyc8JywgdHMuU3ludGF4S2luZC5MZXNzVGhhblRva2VuXSxcbiAgWyc+JywgdHMuU3ludGF4S2luZC5HcmVhdGVyVGhhblRva2VuXSxcbiAgWyc8PScsIHRzLlN5bnRheEtpbmQuTGVzc1RoYW5FcXVhbHNUb2tlbl0sXG4gIFsnPj0nLCB0cy5TeW50YXhLaW5kLkdyZWF0ZXJUaGFuRXF1YWxzVG9rZW5dLFxuICBbJz09JywgdHMuU3ludGF4S2luZC5FcXVhbHNFcXVhbHNUb2tlbl0sXG4gIFsnPT09JywgdHMuU3ludGF4S2luZC5FcXVhbHNFcXVhbHNFcXVhbHNUb2tlbl0sXG4gIFsnKicsIHRzLlN5bnRheEtpbmQuQXN0ZXJpc2tUb2tlbl0sXG4gIFsnLycsIHRzLlN5bnRheEtpbmQuU2xhc2hUb2tlbl0sXG4gIFsnJScsIHRzLlN5bnRheEtpbmQuUGVyY2VudFRva2VuXSxcbiAgWychPScsIHRzLlN5bnRheEtpbmQuRXhjbGFtYXRpb25FcXVhbHNUb2tlbl0sXG4gIFsnIT09JywgdHMuU3ludGF4S2luZC5FeGNsYW1hdGlvbkVxdWFsc0VxdWFsc1Rva2VuXSxcbiAgWyd8fCcsIHRzLlN5bnRheEtpbmQuQmFyQmFyVG9rZW5dLFxuICBbJyYmJywgdHMuU3ludGF4S2luZC5BbXBlcnNhbmRBbXBlcnNhbmRUb2tlbl0sXG4gIFsnJicsIHRzLlN5bnRheEtpbmQuQW1wZXJzYW5kVG9rZW5dLFxuICBbJ3wnLCB0cy5TeW50YXhLaW5kLkJhclRva2VuXSxcbiAgWyc/PycsIHRzLlN5bnRheEtpbmQuUXVlc3Rpb25RdWVzdGlvblRva2VuXSxcbl0pO1xuXG4vKipcbiAqIENvbnZlcnQgYW4gYEFTVGAgdG8gVHlwZVNjcmlwdCBjb2RlIGRpcmVjdGx5LCB3aXRob3V0IGdvaW5nIHRocm91Z2ggYW4gaW50ZXJtZWRpYXRlIGBFeHByZXNzaW9uYFxuICogQVNULlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXN0VG9UeXBlc2NyaXB0KFxuICAgIGFzdDogQVNULCBtYXliZVJlc29sdmU6IChhc3Q6IEFTVCkgPT4gKHRzLkV4cHJlc3Npb24gfCBudWxsKSxcbiAgICBjb25maWc6IFR5cGVDaGVja2luZ0NvbmZpZyk6IHRzLkV4cHJlc3Npb24ge1xuICBjb25zdCB0cmFuc2xhdG9yID0gbmV3IEFzdFRyYW5zbGF0b3IobWF5YmVSZXNvbHZlLCBjb25maWcpO1xuICByZXR1cm4gdHJhbnNsYXRvci50cmFuc2xhdGUoYXN0KTtcbn1cblxuY2xhc3MgQXN0VHJhbnNsYXRvciBpbXBsZW1lbnRzIEFzdFZpc2l0b3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgbWF5YmVSZXNvbHZlOiAoYXN0OiBBU1QpID0+ICh0cy5FeHByZXNzaW9uIHwgbnVsbCksXG4gICAgICBwcml2YXRlIGNvbmZpZzogVHlwZUNoZWNraW5nQ29uZmlnKSB7fVxuXG4gIHRyYW5zbGF0ZShhc3Q6IEFTVCk6IHRzLkV4cHJlc3Npb24ge1xuICAgIC8vIFNraXAgb3ZlciBhbiBgQVNUV2l0aFNvdXJjZWAgYXMgaXRzIGB2aXNpdGAgbWV0aG9kIGNhbGxzIGRpcmVjdGx5IGludG8gaXRzIGFzdCdzIGB2aXNpdGAsXG4gICAgLy8gd2hpY2ggd291bGQgcHJldmVudCBhbnkgY3VzdG9tIHJlc29sdXRpb24gdGhyb3VnaCBgbWF5YmVSZXNvbHZlYCBmb3IgdGhhdCBub2RlLlxuICAgIGlmIChhc3QgaW5zdGFuY2VvZiBBU1RXaXRoU291cmNlKSB7XG4gICAgICBhc3QgPSBhc3QuYXN0O1xuICAgIH1cblxuICAgIC8vIFRoZSBgRW1wdHlFeHByYCBkb2Vzbid0IGhhdmUgYSBkZWRpY2F0ZWQgbWV0aG9kIG9uIGBBc3RWaXNpdG9yYCwgc28gaXQncyBzcGVjaWFsIGNhc2VkIGhlcmUuXG4gICAgaWYgKGFzdCBpbnN0YW5jZW9mIEVtcHR5RXhwcikge1xuICAgICAgY29uc3QgcmVzID0gdHMuZmFjdG9yeS5jcmVhdGVJZGVudGlmaWVyKCd1bmRlZmluZWQnKTtcbiAgICAgIGFkZFBhcnNlU3BhbkluZm8ocmVzLCBhc3Quc291cmNlU3Bhbik7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIEZpcnN0IGF0dGVtcHQgdG8gbGV0IGFueSBjdXN0b20gcmVzb2x1dGlvbiBsb2dpYyBwcm92aWRlIGEgdHJhbnNsYXRpb24gZm9yIHRoZSBnaXZlbiBub2RlLlxuICAgIGNvbnN0IHJlc29sdmVkID0gdGhpcy5tYXliZVJlc29sdmUoYXN0KTtcbiAgICBpZiAocmVzb2x2ZWQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICB9XG5cbiAgICByZXR1cm4gYXN0LnZpc2l0KHRoaXMpO1xuICB9XG5cbiAgdmlzaXRVbmFyeShhc3Q6IFVuYXJ5KTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMudHJhbnNsYXRlKGFzdC5leHByKTtcbiAgICBjb25zdCBvcCA9IFVOQVJZX09QUy5nZXQoYXN0Lm9wZXJhdG9yKTtcbiAgICBpZiAob3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBVbmFyeS5vcGVyYXRvcjogJHthc3Qub3BlcmF0b3J9YCk7XG4gICAgfVxuICAgIGNvbnN0IG5vZGUgPSB3cmFwRm9yRGlhZ25vc3RpY3ModHMuY3JlYXRlUHJlZml4KG9wLCBleHByKSk7XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhub2RlLCBhc3Quc291cmNlU3Bhbik7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdEJpbmFyeShhc3Q6IEJpbmFyeSk6IHRzLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IGxocyA9IHdyYXBGb3JEaWFnbm9zdGljcyh0aGlzLnRyYW5zbGF0ZShhc3QubGVmdCkpO1xuICAgIGNvbnN0IHJocyA9IHdyYXBGb3JEaWFnbm9zdGljcyh0aGlzLnRyYW5zbGF0ZShhc3QucmlnaHQpKTtcbiAgICBjb25zdCBvcCA9IEJJTkFSWV9PUFMuZ2V0KGFzdC5vcGVyYXRpb24pO1xuICAgIGlmIChvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIEJpbmFyeS5vcGVyYXRpb246ICR7YXN0Lm9wZXJhdGlvbn1gKTtcbiAgICB9XG4gICAgY29uc3Qgbm9kZSA9IHRzLmNyZWF0ZUJpbmFyeShsaHMsIG9wLCByaHMpO1xuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmlzaXRDaGFpbihhc3Q6IENoYWluKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBhc3QuZXhwcmVzc2lvbnMubWFwKGV4cHIgPT4gdGhpcy50cmFuc2xhdGUoZXhwcikpO1xuICAgIGNvbnN0IG5vZGUgPSB3cmFwRm9yRGlhZ25vc3RpY3ModHMuY3JlYXRlQ29tbWFMaXN0KGVsZW1lbnRzKSk7XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhub2RlLCBhc3Quc291cmNlU3Bhbik7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdENvbmRpdGlvbmFsKGFzdDogQ29uZGl0aW9uYWwpOiB0cy5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBjb25kRXhwciA9IHRoaXMudHJhbnNsYXRlKGFzdC5jb25kaXRpb24pO1xuICAgIGNvbnN0IHRydWVFeHByID0gdGhpcy50cmFuc2xhdGUoYXN0LnRydWVFeHApO1xuICAgIC8vIFdyYXAgYGZhbHNlRXhwcmAgaW4gcGFyZW5zIHNvIHRoYXQgdGhlIHRyYWlsaW5nIHBhcnNlIHNwYW4gaW5mbyBpcyBub3QgYXR0cmlidXRlZCB0byB0aGVcbiAgICAvLyB3aG9sZSBjb25kaXRpb25hbC5cbiAgICAvLyBJbiB0aGUgZm9sbG93aW5nIGV4YW1wbGUsIHRoZSBsYXN0IHNvdXJjZSBzcGFuIGNvbW1lbnQgKDUsNikgY291bGQgYmUgc2VlbiBhcyB0aGVcbiAgICAvLyB0cmFpbGluZyBjb21tZW50IGZvciBfZWl0aGVyXyB0aGUgd2hvbGUgY29uZGl0aW9uYWwgZXhwcmVzc2lvbiBfb3JfIGp1c3QgdGhlIGBmYWxzZUV4cHJgIHRoYXRcbiAgICAvLyBpcyBpbW1lZGlhdGVseSBiZWZvcmUgaXQ6XG4gICAgLy8gYGNvbmRpdGlvbmFsIC8qMSwyKi8gPyB0cnVlRXhwciAvKjMsNCovIDogZmFsc2VFeHByIC8qNSw2Ki9gXG4gICAgLy8gVGhpcyBzaG91bGQgYmUgaW5zdGVhZCBiZSBgY29uZGl0aW9uYWwgLyoxLDIqLyA/IHRydWVFeHByIC8qMyw0Ki8gOiAoZmFsc2VFeHByIC8qNSw2Ki8pYFxuICAgIGNvbnN0IGZhbHNlRXhwciA9IHdyYXBGb3JUeXBlQ2hlY2tlcih0aGlzLnRyYW5zbGF0ZShhc3QuZmFsc2VFeHApKTtcbiAgICBjb25zdCBub2RlID0gdHMuY3JlYXRlUGFyZW4odHMuY3JlYXRlQ29uZGl0aW9uYWwoY29uZEV4cHIsIHRydWVFeHByLCBmYWxzZUV4cHIpKTtcbiAgICBhZGRQYXJzZVNwYW5JbmZvKG5vZGUsIGFzdC5zb3VyY2VTcGFuKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHZpc2l0RnVuY3Rpb25DYWxsKGFzdDogRnVuY3Rpb25DYWxsKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgcmVjZWl2ZXIgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0LnRhcmdldCEpKTtcbiAgICBjb25zdCBhcmdzID0gYXN0LmFyZ3MubWFwKGV4cHIgPT4gdGhpcy50cmFuc2xhdGUoZXhwcikpO1xuICAgIGNvbnN0IG5vZGUgPSB0cy5jcmVhdGVDYWxsKHJlY2VpdmVyLCB1bmRlZmluZWQsIGFyZ3MpO1xuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmlzaXRJbXBsaWNpdFJlY2VpdmVyKGFzdDogSW1wbGljaXRSZWNlaXZlcik6IG5ldmVyIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gIH1cblxuICB2aXNpdFRoaXNSZWNlaXZlcihhc3Q6IFRoaXNSZWNlaXZlcik6IG5ldmVyIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gIH1cblxuICB2aXNpdEludGVycG9sYXRpb24oYXN0OiBJbnRlcnBvbGF0aW9uKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgLy8gQnVpbGQgdXAgYSBjaGFpbiBvZiBiaW5hcnkgKyBvcGVyYXRpb25zIHRvIHNpbXVsYXRlIHRoZSBzdHJpbmcgY29uY2F0ZW5hdGlvbiBvZiB0aGVcbiAgICAvLyBpbnRlcnBvbGF0aW9uJ3MgZXhwcmVzc2lvbnMuIFRoZSBjaGFpbiBpcyBzdGFydGVkIHVzaW5nIGFuIGFjdHVhbCBzdHJpbmcgbGl0ZXJhbCB0byBlbnN1cmVcbiAgICAvLyB0aGUgdHlwZSBpcyBpbmZlcnJlZCBhcyAnc3RyaW5nJy5cbiAgICByZXR1cm4gYXN0LmV4cHJlc3Npb25zLnJlZHVjZShcbiAgICAgICAgKGxocywgYXN0KSA9PlxuICAgICAgICAgICAgdHMuY3JlYXRlQmluYXJ5KGxocywgdHMuU3ludGF4S2luZC5QbHVzVG9rZW4sIHdyYXBGb3JUeXBlQ2hlY2tlcih0aGlzLnRyYW5zbGF0ZShhc3QpKSksXG4gICAgICAgIHRzLmNyZWF0ZUxpdGVyYWwoJycpKTtcbiAgfVxuXG4gIHZpc2l0S2V5ZWRSZWFkKGFzdDogS2V5ZWRSZWFkKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgcmVjZWl2ZXIgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0LnJlY2VpdmVyKSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy50cmFuc2xhdGUoYXN0LmtleSk7XG4gICAgY29uc3Qgbm9kZSA9IHRzLmNyZWF0ZUVsZW1lbnRBY2Nlc3MocmVjZWl2ZXIsIGtleSk7XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhub2RlLCBhc3Quc291cmNlU3Bhbik7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdEtleWVkV3JpdGUoYXN0OiBLZXllZFdyaXRlKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgcmVjZWl2ZXIgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0LnJlY2VpdmVyKSk7XG4gICAgY29uc3QgbGVmdCA9IHRzLmNyZWF0ZUVsZW1lbnRBY2Nlc3MocmVjZWl2ZXIsIHRoaXMudHJhbnNsYXRlKGFzdC5rZXkpKTtcbiAgICAvLyBUT0RPKGpvb3N0KTogYW5ub3RhdGUgYGxlZnRgIHdpdGggdGhlIHNwYW4gb2YgdGhlIGVsZW1lbnQgYWNjZXNzLCB3aGljaCBpcyBub3QgY3VycmVudGx5XG4gICAgLy8gIGF2YWlsYWJsZSBvbiBgYXN0YC5cbiAgICBjb25zdCByaWdodCA9IHdyYXBGb3JUeXBlQ2hlY2tlcih0aGlzLnRyYW5zbGF0ZShhc3QudmFsdWUpKTtcbiAgICBjb25zdCBub2RlID0gd3JhcEZvckRpYWdub3N0aWNzKHRzLmNyZWF0ZUJpbmFyeShsZWZ0LCB0cy5TeW50YXhLaW5kLkVxdWFsc1Rva2VuLCByaWdodCkpO1xuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmlzaXRMaXRlcmFsQXJyYXkoYXN0OiBMaXRlcmFsQXJyYXkpOiB0cy5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IGFzdC5leHByZXNzaW9ucy5tYXAoZXhwciA9PiB0aGlzLnRyYW5zbGF0ZShleHByKSk7XG4gICAgY29uc3QgbGl0ZXJhbCA9IHRzLmNyZWF0ZUFycmF5TGl0ZXJhbChlbGVtZW50cyk7XG4gICAgLy8gSWYgc3RyaWN0TGl0ZXJhbFR5cGVzIGlzIGRpc2FibGVkLCBhcnJheSBsaXRlcmFscyBhcmUgY2FzdCB0byBgYW55YC5cbiAgICBjb25zdCBub2RlID0gdGhpcy5jb25maWcuc3RyaWN0TGl0ZXJhbFR5cGVzID8gbGl0ZXJhbCA6IHRzQ2FzdFRvQW55KGxpdGVyYWwpO1xuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmlzaXRMaXRlcmFsTWFwKGFzdDogTGl0ZXJhbE1hcCk6IHRzLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBhc3Qua2V5cy5tYXAoKHtrZXl9LCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy50cmFuc2xhdGUoYXN0LnZhbHVlc1tpZHhdKTtcbiAgICAgIHJldHVybiB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQodHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChrZXkpLCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgY29uc3QgbGl0ZXJhbCA9IHRzLmNyZWF0ZU9iamVjdExpdGVyYWwocHJvcGVydGllcywgdHJ1ZSk7XG4gICAgLy8gSWYgc3RyaWN0TGl0ZXJhbFR5cGVzIGlzIGRpc2FibGVkLCBvYmplY3QgbGl0ZXJhbHMgYXJlIGNhc3QgdG8gYGFueWAuXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuY29uZmlnLnN0cmljdExpdGVyYWxUeXBlcyA/IGxpdGVyYWwgOiB0c0Nhc3RUb0FueShsaXRlcmFsKTtcbiAgICBhZGRQYXJzZVNwYW5JbmZvKG5vZGUsIGFzdC5zb3VyY2VTcGFuKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHZpc2l0TGl0ZXJhbFByaW1pdGl2ZShhc3Q6IExpdGVyYWxQcmltaXRpdmUpOiB0cy5FeHByZXNzaW9uIHtcbiAgICBsZXQgbm9kZTogdHMuRXhwcmVzc2lvbjtcbiAgICBpZiAoYXN0LnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5vZGUgPSB0cy5jcmVhdGVJZGVudGlmaWVyKCd1bmRlZmluZWQnKTtcbiAgICB9IGVsc2UgaWYgKGFzdC52YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgbm9kZSA9IHRzLmNyZWF0ZU51bGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IHRzLmNyZWF0ZUxpdGVyYWwoYXN0LnZhbHVlKTtcbiAgICB9XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhub2RlLCBhc3Quc291cmNlU3Bhbik7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdE1ldGhvZENhbGwoYXN0OiBNZXRob2RDYWxsKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgcmVjZWl2ZXIgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0LnJlY2VpdmVyKSk7XG4gICAgY29uc3QgbWV0aG9kID0gdHMuY3JlYXRlUHJvcGVydHlBY2Nlc3MocmVjZWl2ZXIsIGFzdC5uYW1lKTtcbiAgICBhZGRQYXJzZVNwYW5JbmZvKG1ldGhvZCwgYXN0Lm5hbWVTcGFuKTtcbiAgICBjb25zdCBhcmdzID0gYXN0LmFyZ3MubWFwKGV4cHIgPT4gdGhpcy50cmFuc2xhdGUoZXhwcikpO1xuICAgIGNvbnN0IG5vZGUgPSB0cy5jcmVhdGVDYWxsKG1ldGhvZCwgdW5kZWZpbmVkLCBhcmdzKTtcbiAgICBhZGRQYXJzZVNwYW5JbmZvKG5vZGUsIGFzdC5zb3VyY2VTcGFuKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHZpc2l0Tm9uTnVsbEFzc2VydChhc3Q6IE5vbk51bGxBc3NlcnQpOiB0cy5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBleHByID0gd3JhcEZvckRpYWdub3N0aWNzKHRoaXMudHJhbnNsYXRlKGFzdC5leHByZXNzaW9uKSk7XG4gICAgY29uc3Qgbm9kZSA9IHRzLmNyZWF0ZU5vbk51bGxFeHByZXNzaW9uKGV4cHIpO1xuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmlzaXRQaXBlKGFzdDogQmluZGluZ1BpcGUpOiBuZXZlciB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpO1xuICB9XG5cbiAgdmlzaXRQcmVmaXhOb3QoYXN0OiBQcmVmaXhOb3QpOiB0cy5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBleHByZXNzaW9uID0gd3JhcEZvckRpYWdub3N0aWNzKHRoaXMudHJhbnNsYXRlKGFzdC5leHByZXNzaW9uKSk7XG4gICAgY29uc3Qgbm9kZSA9IHRzLmNyZWF0ZUxvZ2ljYWxOb3QoZXhwcmVzc2lvbik7XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhub2RlLCBhc3Quc291cmNlU3Bhbik7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdFByb3BlcnR5UmVhZChhc3Q6IFByb3BlcnR5UmVhZCk6IHRzLkV4cHJlc3Npb24ge1xuICAgIC8vIFRoaXMgaXMgYSBub3JtYWwgcHJvcGVydHkgcmVhZCAtIGNvbnZlcnQgdGhlIHJlY2VpdmVyIHRvIGFuIGV4cHJlc3Npb24gYW5kIGVtaXQgdGhlIGNvcnJlY3RcbiAgICAvLyBUeXBlU2NyaXB0IGV4cHJlc3Npb24gdG8gcmVhZCB0aGUgcHJvcGVydHkuXG4gICAgY29uc3QgcmVjZWl2ZXIgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0LnJlY2VpdmVyKSk7XG4gICAgY29uc3QgbmFtZSA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHJlY2VpdmVyLCBhc3QubmFtZSk7XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhuYW1lLCBhc3QubmFtZVNwYW4pO1xuICAgIGNvbnN0IG5vZGUgPSB3cmFwRm9yRGlhZ25vc3RpY3MobmFtZSk7XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhub2RlLCBhc3Quc291cmNlU3Bhbik7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdFByb3BlcnR5V3JpdGUoYXN0OiBQcm9wZXJ0eVdyaXRlKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgcmVjZWl2ZXIgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0LnJlY2VpdmVyKSk7XG4gICAgY29uc3QgbGVmdCA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHJlY2VpdmVyLCBhc3QubmFtZSk7XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhsZWZ0LCBhc3QubmFtZVNwYW4pO1xuICAgIC8vIFR5cGVTY3JpcHQgcmVwb3J0cyBhc3NpZ25tZW50IGVycm9ycyBvbiB0aGUgZW50aXJlIGx2YWx1ZSBleHByZXNzaW9uLiBBbm5vdGF0ZSB0aGUgbHZhbHVlIG9mXG4gICAgLy8gdGhlIGFzc2lnbm1lbnQgd2l0aCB0aGUgc291cmNlU3Bhbiwgd2hpY2ggaW5jbHVkZXMgcmVjZWl2ZXJzLCByYXRoZXIgdGhhbiBuYW1lU3BhbiBmb3JcbiAgICAvLyBjb25zaXN0ZW5jeSBvZiB0aGUgZGlhZ25vc3RpYyBsb2NhdGlvbi5cbiAgICAvLyBhLmIuYyA9IDFcbiAgICAvLyBeXl5eXl5eXl4gc291cmNlU3BhblxuICAgIC8vICAgICBeICAgICBuYW1lU3BhblxuICAgIGNvbnN0IGxlZnRXaXRoUGF0aCA9IHdyYXBGb3JEaWFnbm9zdGljcyhsZWZ0KTtcbiAgICBhZGRQYXJzZVNwYW5JbmZvKGxlZnRXaXRoUGF0aCwgYXN0LnNvdXJjZVNwYW4pO1xuICAgIC8vIFRoZSByaWdodCBuZWVkcyB0byBiZSB3cmFwcGVkIGluIHBhcmVucyBhcyB3ZWxsIG9yIHdlIGNhbm5vdCBhY2N1cmF0ZWx5IG1hdGNoIGl0c1xuICAgIC8vIHNwYW4gdG8ganVzdCB0aGUgUkhTLiBGb3IgZXhhbXBsZSwgdGhlIHNwYW4gaW4gYGUgPSAkZXZlbnQgLyowLDEwKi9gIGlzIGFtYmlndW91cy5cbiAgICAvLyBJdCBjb3VsZCByZWZlciB0byBlaXRoZXIgdGhlIHdob2xlIGJpbmFyeSBleHByZXNzaW9uIG9yIGp1c3QgdGhlIFJIUy5cbiAgICAvLyBXZSBzaG91bGQgaW5zdGVhZCBnZW5lcmF0ZSBgZSA9ICgkZXZlbnQgLyowLDEwKi8pYCBzbyB3ZSBrbm93IHRoZSBzcGFuIDAsMTAgbWF0Y2hlcyBSSFMuXG4gICAgY29uc3QgcmlnaHQgPSB3cmFwRm9yVHlwZUNoZWNrZXIodGhpcy50cmFuc2xhdGUoYXN0LnZhbHVlKSk7XG4gICAgY29uc3Qgbm9kZSA9XG4gICAgICAgIHdyYXBGb3JEaWFnbm9zdGljcyh0cy5jcmVhdGVCaW5hcnkobGVmdFdpdGhQYXRoLCB0cy5TeW50YXhLaW5kLkVxdWFsc1Rva2VuLCByaWdodCkpO1xuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmlzaXRRdW90ZShhc3Q6IFF1b3RlKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgcmV0dXJuIE5VTExfQVNfQU5ZO1xuICB9XG5cbiAgdmlzaXRTYWZlTWV0aG9kQ2FsbChhc3Q6IFNhZmVNZXRob2RDYWxsKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgLy8gU2VlIHRoZSBjb21tZW50cyBpbiBTYWZlUHJvcGVydHlSZWFkIGFib3ZlIGZvciBhbiBleHBsYW5hdGlvbiBvZiB0aGUgY2FzZXMgaGVyZS5cbiAgICBsZXQgbm9kZTogdHMuRXhwcmVzc2lvbjtcbiAgICBjb25zdCByZWNlaXZlciA9IHdyYXBGb3JEaWFnbm9zdGljcyh0aGlzLnRyYW5zbGF0ZShhc3QucmVjZWl2ZXIpKTtcbiAgICBjb25zdCBhcmdzID0gYXN0LmFyZ3MubWFwKGV4cHIgPT4gdGhpcy50cmFuc2xhdGUoZXhwcikpO1xuICAgIGlmICh0aGlzLmNvbmZpZy5zdHJpY3RTYWZlTmF2aWdhdGlvblR5cGVzKSB7XG4gICAgICAvLyBcImE/Lm1ldGhvZCguLi4pXCIgYmVjb21lcyAobnVsbCBhcyBhbnkgPyBhIS5tZXRob2QoLi4uKSA6IHVuZGVmaW5lZClcbiAgICAgIGNvbnN0IG1ldGhvZCA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHRzLmNyZWF0ZU5vbk51bGxFeHByZXNzaW9uKHJlY2VpdmVyKSwgYXN0Lm5hbWUpO1xuICAgICAgYWRkUGFyc2VTcGFuSW5mbyhtZXRob2QsIGFzdC5uYW1lU3Bhbik7XG4gICAgICBjb25zdCBjYWxsID0gdHMuY3JlYXRlQ2FsbChtZXRob2QsIHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICBub2RlID0gdHMuY3JlYXRlUGFyZW4odHMuY3JlYXRlQ29uZGl0aW9uYWwoTlVMTF9BU19BTlksIGNhbGwsIFVOREVGSU5FRCkpO1xuICAgIH0gZWxzZSBpZiAoVmVTYWZlTGhzSW5mZXJlbmNlQnVnRGV0ZWN0b3IudmVXaWxsSW5mZXJBbnlGb3IoYXN0KSkge1xuICAgICAgLy8gXCJhPy5tZXRob2QoLi4uKVwiIGJlY29tZXMgKGEgYXMgYW55KS5tZXRob2QoLi4uKVxuICAgICAgY29uc3QgbWV0aG9kID0gdHMuY3JlYXRlUHJvcGVydHlBY2Nlc3ModHNDYXN0VG9BbnkocmVjZWl2ZXIpLCBhc3QubmFtZSk7XG4gICAgICBhZGRQYXJzZVNwYW5JbmZvKG1ldGhvZCwgYXN0Lm5hbWVTcGFuKTtcbiAgICAgIG5vZGUgPSB0cy5jcmVhdGVDYWxsKG1ldGhvZCwgdW5kZWZpbmVkLCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gXCJhPy5tZXRob2QoLi4uKVwiIGJlY29tZXMgKGEhLm1ldGhvZCguLi4pIGFzIGFueSlcbiAgICAgIGNvbnN0IG1ldGhvZCA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHRzLmNyZWF0ZU5vbk51bGxFeHByZXNzaW9uKHJlY2VpdmVyKSwgYXN0Lm5hbWUpO1xuICAgICAgYWRkUGFyc2VTcGFuSW5mbyhtZXRob2QsIGFzdC5uYW1lU3Bhbik7XG4gICAgICBub2RlID0gdHNDYXN0VG9BbnkodHMuY3JlYXRlQ2FsbChtZXRob2QsIHVuZGVmaW5lZCwgYXJncykpO1xuICAgIH1cbiAgICBhZGRQYXJzZVNwYW5JbmZvKG5vZGUsIGFzdC5zb3VyY2VTcGFuKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHZpc2l0U2FmZVByb3BlcnR5UmVhZChhc3Q6IFNhZmVQcm9wZXJ0eVJlYWQpOiB0cy5FeHByZXNzaW9uIHtcbiAgICBsZXQgbm9kZTogdHMuRXhwcmVzc2lvbjtcbiAgICBjb25zdCByZWNlaXZlciA9IHdyYXBGb3JEaWFnbm9zdGljcyh0aGlzLnRyYW5zbGF0ZShhc3QucmVjZWl2ZXIpKTtcbiAgICAvLyBUaGUgZm9ybSBvZiBzYWZlIHByb3BlcnR5IHJlYWRzIGRlcGVuZHMgb24gd2hldGhlciBzdHJpY3RuZXNzIGlzIGluIHVzZS5cbiAgICBpZiAodGhpcy5jb25maWcuc3RyaWN0U2FmZU5hdmlnYXRpb25UeXBlcykge1xuICAgICAgLy8gQmFzaWNhbGx5LCB0aGUgcmV0dXJuIGhlcmUgaXMgZWl0aGVyIHRoZSB0eXBlIG9mIHRoZSBjb21wbGV0ZSBleHByZXNzaW9uIHdpdGggYSBudWxsLXNhZmVcbiAgICAgIC8vIHByb3BlcnR5IHJlYWQsIG9yIGB1bmRlZmluZWRgLiBTbyBhIHRlcm5hcnkgaXMgdXNlZCB0byBjcmVhdGUgYW4gXCJvclwiIHR5cGU6XG4gICAgICAvLyBcImE/LmJcIiBiZWNvbWVzIChudWxsIGFzIGFueSA/IGEhLmIgOiB1bmRlZmluZWQpXG4gICAgICAvLyBUaGUgdHlwZSBvZiB0aGlzIGV4cHJlc3Npb24gaXMgKHR5cGVvZiBhIS5iKSB8IHVuZGVmaW5lZCwgd2hpY2ggaXMgZXhhY3RseSBhcyBkZXNpcmVkLlxuICAgICAgY29uc3QgZXhwciA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHRzLmNyZWF0ZU5vbk51bGxFeHByZXNzaW9uKHJlY2VpdmVyKSwgYXN0Lm5hbWUpO1xuICAgICAgYWRkUGFyc2VTcGFuSW5mbyhleHByLCBhc3QubmFtZVNwYW4pO1xuICAgICAgbm9kZSA9IHRzLmNyZWF0ZVBhcmVuKHRzLmNyZWF0ZUNvbmRpdGlvbmFsKE5VTExfQVNfQU5ZLCBleHByLCBVTkRFRklORUQpKTtcbiAgICB9IGVsc2UgaWYgKFZlU2FmZUxoc0luZmVyZW5jZUJ1Z0RldGVjdG9yLnZlV2lsbEluZmVyQW55Rm9yKGFzdCkpIHtcbiAgICAgIC8vIEVtdWxhdGUgYSBWaWV3IEVuZ2luZSBidWcgd2hlcmUgJ2FueScgaXMgaW5mZXJyZWQgZm9yIHRoZSBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgc2FmZVxuICAgICAgLy8gbmF2aWdhdGlvbiBvcGVyYXRpb24uIFdpdGggdGhpcyBidWcsIHRoZSB0eXBlIG9mIHRoZSBsZWZ0LWhhbmQgc2lkZSBpcyByZWdhcmRlZCBhcyBhbnkuXG4gICAgICAvLyBUaGVyZWZvcmUsIHRoZSBsZWZ0LWhhbmQgc2lkZSBvbmx5IG5lZWRzIHJlcGVhdGluZyBpbiB0aGUgb3V0cHV0ICh0byB2YWxpZGF0ZSBpdCksIGFuZCB0aGVuXG4gICAgICAvLyAnYW55JyBpcyB1c2VkIGZvciB0aGUgcmVzdCBvZiB0aGUgZXhwcmVzc2lvbi4gVGhpcyBpcyBkb25lIHVzaW5nIGEgY29tbWEgb3BlcmF0b3I6XG4gICAgICAvLyBcImE/LmJcIiBiZWNvbWVzIChhIGFzIGFueSkuYiwgd2hpY2ggd2lsbCBvZiBjb3Vyc2UgaGF2ZSB0eXBlICdhbnknLlxuICAgICAgbm9kZSA9IHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHRzQ2FzdFRvQW55KHJlY2VpdmVyKSwgYXN0Lm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgVmlldyBFbmdpbmUgYnVnIGlzbid0IGFjdGl2ZSwgc28gY2hlY2sgdGhlIGVudGlyZSB0eXBlIG9mIHRoZSBleHByZXNzaW9uLCBidXQgdGhlIGZpbmFsXG4gICAgICAvLyByZXN1bHQgaXMgc3RpbGwgaW5mZXJyZWQgYXMgYGFueWAuXG4gICAgICAvLyBcImE/LmJcIiBiZWNvbWVzIChhIS5iIGFzIGFueSlcbiAgICAgIGNvbnN0IGV4cHIgPSB0cy5jcmVhdGVQcm9wZXJ0eUFjY2Vzcyh0cy5jcmVhdGVOb25OdWxsRXhwcmVzc2lvbihyZWNlaXZlciksIGFzdC5uYW1lKTtcbiAgICAgIGFkZFBhcnNlU3BhbkluZm8oZXhwciwgYXN0Lm5hbWVTcGFuKTtcbiAgICAgIG5vZGUgPSB0c0Nhc3RUb0FueShleHByKTtcbiAgICB9XG4gICAgYWRkUGFyc2VTcGFuSW5mbyhub2RlLCBhc3Quc291cmNlU3Bhbik7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdFNhZmVLZXllZFJlYWQoYXN0OiBTYWZlS2V5ZWRSZWFkKTogdHMuRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgcmVjZWl2ZXIgPSB3cmFwRm9yRGlhZ25vc3RpY3ModGhpcy50cmFuc2xhdGUoYXN0LnJlY2VpdmVyKSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy50cmFuc2xhdGUoYXN0LmtleSk7XG4gICAgbGV0IG5vZGU6IHRzLkV4cHJlc3Npb247XG5cbiAgICAvLyBUaGUgZm9ybSBvZiBzYWZlIHByb3BlcnR5IHJlYWRzIGRlcGVuZHMgb24gd2hldGhlciBzdHJpY3RuZXNzIGlzIGluIHVzZS5cbiAgICBpZiAodGhpcy5jb25maWcuc3RyaWN0U2FmZU5hdmlnYXRpb25UeXBlcykge1xuICAgICAgLy8gXCJhPy5bLi4uXVwiIGJlY29tZXMgKG51bGwgYXMgYW55ID8gYSFbLi4uXSA6IHVuZGVmaW5lZClcbiAgICAgIGNvbnN0IGV4cHIgPSB0cy5jcmVhdGVFbGVtZW50QWNjZXNzKHRzLmNyZWF0ZU5vbk51bGxFeHByZXNzaW9uKHJlY2VpdmVyKSwga2V5KTtcbiAgICAgIGFkZFBhcnNlU3BhbkluZm8oZXhwciwgYXN0LnNvdXJjZVNwYW4pO1xuICAgICAgbm9kZSA9IHRzLmNyZWF0ZVBhcmVuKHRzLmNyZWF0ZUNvbmRpdGlvbmFsKE5VTExfQVNfQU5ZLCBleHByLCBVTkRFRklORUQpKTtcbiAgICB9IGVsc2UgaWYgKFZlU2FmZUxoc0luZmVyZW5jZUJ1Z0RldGVjdG9yLnZlV2lsbEluZmVyQW55Rm9yKGFzdCkpIHtcbiAgICAgIC8vIFwiYT8uWy4uLl1cIiBiZWNvbWVzIChhIGFzIGFueSlbLi4uXVxuICAgICAgbm9kZSA9IHRzLmNyZWF0ZUVsZW1lbnRBY2Nlc3ModHNDYXN0VG9BbnkocmVjZWl2ZXIpLCBrZXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBcImE/LlsuLi5dXCIgYmVjb21lcyAoYSEuWy4uLl0gYXMgYW55KVxuICAgICAgY29uc3QgZXhwciA9IHRzLmNyZWF0ZUVsZW1lbnRBY2Nlc3ModHMuY3JlYXRlTm9uTnVsbEV4cHJlc3Npb24ocmVjZWl2ZXIpLCBrZXkpO1xuICAgICAgYWRkUGFyc2VTcGFuSW5mbyhleHByLCBhc3Quc291cmNlU3Bhbik7XG4gICAgICBub2RlID0gdHNDYXN0VG9BbnkoZXhwcik7XG4gICAgfVxuICAgIGFkZFBhcnNlU3BhbkluZm8obm9kZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgVmlldyBFbmdpbmUgd2lsbCBpbmZlciBhIHR5cGUgb2YgJ2FueScgZm9yIHRoZSBsZWZ0LWhhbmQgc2lkZSBvZiBhIHNhZmUgbmF2aWdhdGlvblxuICogb3BlcmF0aW9uLlxuICpcbiAqIEluIFZpZXcgRW5naW5lJ3MgdGVtcGxhdGUgdHlwZS1jaGVja2VyLCBjZXJ0YWluIHJlY2VpdmVycyBvZiBzYWZlIG5hdmlnYXRpb24gb3BlcmF0aW9ucyB3aWxsXG4gKiBjYXVzZSBhIHRlbXBvcmFyeSB2YXJpYWJsZSB0byBiZSBhbGxvY2F0ZWQgYXMgcGFydCBvZiB0aGUgY2hlY2tpbmcgZXhwcmVzc2lvbiwgdG8gc2F2ZSB0aGUgdmFsdWVcbiAqIG9mIHRoZSByZWNlaXZlciBhbmQgdXNlIGl0IG1vcmUgdGhhbiBvbmNlIGluIHRoZSBleHByZXNzaW9uLiBUaGlzIHRlbXBvcmFyeSB2YXJpYWJsZSBoYXMgdHlwZVxuICogJ2FueScuIEluIHByYWN0aWNlLCB0aGlzIG1lYW5zIGNlcnRhaW4gcmVjZWl2ZXJzIGNhdXNlIFZpZXcgRW5naW5lIHRvIG5vdCBjaGVjayB0aGUgZnVsbFxuICogZXhwcmVzc2lvbiwgYW5kIG90aGVyIHJlY2VpdmVycyB3aWxsIHJlY2VpdmUgbW9yZSBjb21wbGV0ZSBjaGVja2luZy5cbiAqXG4gKiBGb3IgY29tcGF0aWJpbGl0eSwgdGhpcyBsb2dpYyBpcyBhZGFwdGVkIGZyb20gVmlldyBFbmdpbmUncyBleHByZXNzaW9uX2NvbnZlcnRlci50cyBzbyB0aGF0IHRoZVxuICogSXZ5IGNoZWNrZXIgY2FuIGVtdWxhdGUgdGhpcyBidWcgd2hlbiBuZWVkZWQuXG4gKi9cbmNsYXNzIFZlU2FmZUxoc0luZmVyZW5jZUJ1Z0RldGVjdG9yIGltcGxlbWVudHMgQXN0VmlzaXRvciB7XG4gIHByaXZhdGUgc3RhdGljIFNJTkdMRVRPTiA9IG5ldyBWZVNhZmVMaHNJbmZlcmVuY2VCdWdEZXRlY3RvcigpO1xuXG4gIHN0YXRpYyB2ZVdpbGxJbmZlckFueUZvcihhc3Q6IFNhZmVNZXRob2RDYWxsfFNhZmVQcm9wZXJ0eVJlYWR8U2FmZUtleWVkUmVhZCkge1xuICAgIGNvbnN0IHZpc2l0b3IgPSBWZVNhZmVMaHNJbmZlcmVuY2VCdWdEZXRlY3Rvci5TSU5HTEVUT047XG4gICAgcmV0dXJuIGFzdCBpbnN0YW5jZW9mIFNhZmVLZXllZFJlYWQgPyBhc3QucmVjZWl2ZXIudmlzaXQodmlzaXRvcikgOiBhc3QucmVjZWl2ZXIudmlzaXQodmlzaXRvcik7XG4gIH1cblxuICB2aXNpdFVuYXJ5KGFzdDogVW5hcnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gYXN0LmV4cHIudmlzaXQodGhpcyk7XG4gIH1cbiAgdmlzaXRCaW5hcnkoYXN0OiBCaW5hcnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gYXN0LmxlZnQudmlzaXQodGhpcykgfHwgYXN0LnJpZ2h0LnZpc2l0KHRoaXMpO1xuICB9XG4gIHZpc2l0Q2hhaW4oYXN0OiBDaGFpbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2aXNpdENvbmRpdGlvbmFsKGFzdDogQ29uZGl0aW9uYWwpOiBib29sZWFuIHtcbiAgICByZXR1cm4gYXN0LmNvbmRpdGlvbi52aXNpdCh0aGlzKSB8fCBhc3QudHJ1ZUV4cC52aXNpdCh0aGlzKSB8fCBhc3QuZmFsc2VFeHAudmlzaXQodGhpcyk7XG4gIH1cbiAgdmlzaXRGdW5jdGlvbkNhbGwoYXN0OiBGdW5jdGlvbkNhbGwpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2aXNpdEltcGxpY2l0UmVjZWl2ZXIoYXN0OiBJbXBsaWNpdFJlY2VpdmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZpc2l0VGhpc1JlY2VpdmVyKGFzdDogVGhpc1JlY2VpdmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZpc2l0SW50ZXJwb2xhdGlvbihhc3Q6IEludGVycG9sYXRpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gYXN0LmV4cHJlc3Npb25zLnNvbWUoZXhwID0+IGV4cC52aXNpdCh0aGlzKSk7XG4gIH1cbiAgdmlzaXRLZXllZFJlYWQoYXN0OiBLZXllZFJlYWQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmlzaXRLZXllZFdyaXRlKGFzdDogS2V5ZWRXcml0ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2aXNpdExpdGVyYWxBcnJheShhc3Q6IExpdGVyYWxBcnJheSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZpc2l0TGl0ZXJhbE1hcChhc3Q6IExpdGVyYWxNYXApOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2aXNpdExpdGVyYWxQcmltaXRpdmUoYXN0OiBMaXRlcmFsUHJpbWl0aXZlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZpc2l0TWV0aG9kQ2FsbChhc3Q6IE1ldGhvZENhbGwpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2aXNpdFBpcGUoYXN0OiBCaW5kaW5nUGlwZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZpc2l0UHJlZml4Tm90KGFzdDogUHJlZml4Tm90KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGFzdC5leHByZXNzaW9uLnZpc2l0KHRoaXMpO1xuICB9XG4gIHZpc2l0Tm9uTnVsbEFzc2VydChhc3Q6IFByZWZpeE5vdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBhc3QuZXhwcmVzc2lvbi52aXNpdCh0aGlzKTtcbiAgfVxuICB2aXNpdFByb3BlcnR5UmVhZChhc3Q6IFByb3BlcnR5UmVhZCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2aXNpdFByb3BlcnR5V3JpdGUoYXN0OiBQcm9wZXJ0eVdyaXRlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZpc2l0UXVvdGUoYXN0OiBRdW90ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2aXNpdFNhZmVNZXRob2RDYWxsKGFzdDogU2FmZU1ldGhvZENhbGwpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2aXNpdFNhZmVQcm9wZXJ0eVJlYWQoYXN0OiBTYWZlUHJvcGVydHlSZWFkKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZpc2l0U2FmZUtleWVkUmVhZChhc3Q6IFNhZmVLZXllZFJlYWQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==