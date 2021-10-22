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
        define("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/interpreter", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/builtin", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/known_declaration", "@angular/compiler-cli/src/ngtsc/partial_evaluator/src/result"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StaticInterpreter = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var builtin_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/builtin");
    var dynamic_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic");
    var known_declaration_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/known_declaration");
    var result_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator/src/result");
    function literalBinaryOp(op) {
        return { op: op, literal: true };
    }
    function referenceBinaryOp(op) {
        return { op: op, literal: false };
    }
    var BINARY_OPERATORS = new Map([
        [ts.SyntaxKind.PlusToken, literalBinaryOp(function (a, b) { return a + b; })],
        [ts.SyntaxKind.MinusToken, literalBinaryOp(function (a, b) { return a - b; })],
        [ts.SyntaxKind.AsteriskToken, literalBinaryOp(function (a, b) { return a * b; })],
        [ts.SyntaxKind.SlashToken, literalBinaryOp(function (a, b) { return a / b; })],
        [ts.SyntaxKind.PercentToken, literalBinaryOp(function (a, b) { return a % b; })],
        [ts.SyntaxKind.AmpersandToken, literalBinaryOp(function (a, b) { return a & b; })],
        [ts.SyntaxKind.BarToken, literalBinaryOp(function (a, b) { return a | b; })],
        [ts.SyntaxKind.CaretToken, literalBinaryOp(function (a, b) { return a ^ b; })],
        [ts.SyntaxKind.LessThanToken, literalBinaryOp(function (a, b) { return a < b; })],
        [ts.SyntaxKind.LessThanEqualsToken, literalBinaryOp(function (a, b) { return a <= b; })],
        [ts.SyntaxKind.GreaterThanToken, literalBinaryOp(function (a, b) { return a > b; })],
        [ts.SyntaxKind.GreaterThanEqualsToken, literalBinaryOp(function (a, b) { return a >= b; })],
        [ts.SyntaxKind.EqualsEqualsToken, literalBinaryOp(function (a, b) { return a == b; })],
        [ts.SyntaxKind.EqualsEqualsEqualsToken, literalBinaryOp(function (a, b) { return a === b; })],
        [ts.SyntaxKind.ExclamationEqualsToken, literalBinaryOp(function (a, b) { return a != b; })],
        [ts.SyntaxKind.ExclamationEqualsEqualsToken, literalBinaryOp(function (a, b) { return a !== b; })],
        [ts.SyntaxKind.LessThanLessThanToken, literalBinaryOp(function (a, b) { return a << b; })],
        [ts.SyntaxKind.GreaterThanGreaterThanToken, literalBinaryOp(function (a, b) { return a >> b; })],
        [ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken, literalBinaryOp(function (a, b) { return a >>> b; })],
        [ts.SyntaxKind.AsteriskAsteriskToken, literalBinaryOp(function (a, b) { return Math.pow(a, b); })],
        [ts.SyntaxKind.AmpersandAmpersandToken, referenceBinaryOp(function (a, b) { return a && b; })],
        [ts.SyntaxKind.BarBarToken, referenceBinaryOp(function (a, b) { return a || b; })]
    ]);
    var UNARY_OPERATORS = new Map([
        [ts.SyntaxKind.TildeToken, function (a) { return ~a; }], [ts.SyntaxKind.MinusToken, function (a) { return -a; }],
        [ts.SyntaxKind.PlusToken, function (a) { return +a; }], [ts.SyntaxKind.ExclamationToken, function (a) { return !a; }]
    ]);
    var StaticInterpreter = /** @class */ (function () {
        function StaticInterpreter(host, checker, dependencyTracker) {
            this.host = host;
            this.checker = checker;
            this.dependencyTracker = dependencyTracker;
        }
        StaticInterpreter.prototype.visit = function (node, context) {
            return this.visitExpression(node, context);
        };
        StaticInterpreter.prototype.visitExpression = function (node, context) {
            var result;
            if (node.kind === ts.SyntaxKind.TrueKeyword) {
                return true;
            }
            else if (node.kind === ts.SyntaxKind.FalseKeyword) {
                return false;
            }
            else if (node.kind === ts.SyntaxKind.NullKeyword) {
                return null;
            }
            else if (ts.isStringLiteral(node)) {
                return node.text;
            }
            else if (ts.isNoSubstitutionTemplateLiteral(node)) {
                return node.text;
            }
            else if (ts.isTemplateExpression(node)) {
                result = this.visitTemplateExpression(node, context);
            }
            else if (ts.isNumericLiteral(node)) {
                return parseFloat(node.text);
            }
            else if (ts.isObjectLiteralExpression(node)) {
                result = this.visitObjectLiteralExpression(node, context);
            }
            else if (ts.isIdentifier(node)) {
                result = this.visitIdentifier(node, context);
            }
            else if (ts.isPropertyAccessExpression(node)) {
                result = this.visitPropertyAccessExpression(node, context);
            }
            else if (ts.isCallExpression(node)) {
                result = this.visitCallExpression(node, context);
            }
            else if (ts.isConditionalExpression(node)) {
                result = this.visitConditionalExpression(node, context);
            }
            else if (ts.isPrefixUnaryExpression(node)) {
                result = this.visitPrefixUnaryExpression(node, context);
            }
            else if (ts.isBinaryExpression(node)) {
                result = this.visitBinaryExpression(node, context);
            }
            else if (ts.isArrayLiteralExpression(node)) {
                result = this.visitArrayLiteralExpression(node, context);
            }
            else if (ts.isParenthesizedExpression(node)) {
                result = this.visitParenthesizedExpression(node, context);
            }
            else if (ts.isElementAccessExpression(node)) {
                result = this.visitElementAccessExpression(node, context);
            }
            else if (ts.isAsExpression(node)) {
                result = this.visitExpression(node.expression, context);
            }
            else if (ts.isNonNullExpression(node)) {
                result = this.visitExpression(node.expression, context);
            }
            else if (this.host.isClass(node)) {
                result = this.visitDeclaration(node, context);
            }
            else {
                return dynamic_1.DynamicValue.fromUnsupportedSyntax(node);
            }
            if (result instanceof dynamic_1.DynamicValue && result.node !== node) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, result);
            }
            return result;
        };
        StaticInterpreter.prototype.visitArrayLiteralExpression = function (node, context) {
            var array = [];
            for (var i = 0; i < node.elements.length; i++) {
                var element = node.elements[i];
                if (ts.isSpreadElement(element)) {
                    array.push.apply(array, tslib_1.__spreadArray([], tslib_1.__read(this.visitSpreadElement(element, context))));
                }
                else {
                    array.push(this.visitExpression(element, context));
                }
            }
            return array;
        };
        StaticInterpreter.prototype.visitObjectLiteralExpression = function (node, context) {
            var map = new Map();
            for (var i = 0; i < node.properties.length; i++) {
                var property = node.properties[i];
                if (ts.isPropertyAssignment(property)) {
                    var name_1 = this.stringNameFromPropertyName(property.name, context);
                    // Check whether the name can be determined statically.
                    if (name_1 === undefined) {
                        return dynamic_1.DynamicValue.fromDynamicInput(node, dynamic_1.DynamicValue.fromDynamicString(property.name));
                    }
                    map.set(name_1, this.visitExpression(property.initializer, context));
                }
                else if (ts.isShorthandPropertyAssignment(property)) {
                    var symbol = this.checker.getShorthandAssignmentValueSymbol(property);
                    if (symbol === undefined || symbol.valueDeclaration === undefined) {
                        map.set(property.name.text, dynamic_1.DynamicValue.fromUnknown(property));
                    }
                    else {
                        map.set(property.name.text, this.visitDeclaration(symbol.valueDeclaration, context));
                    }
                }
                else if (ts.isSpreadAssignment(property)) {
                    var spread = this.visitExpression(property.expression, context);
                    if (spread instanceof dynamic_1.DynamicValue) {
                        return dynamic_1.DynamicValue.fromDynamicInput(node, spread);
                    }
                    else if (spread instanceof Map) {
                        spread.forEach(function (value, key) { return map.set(key, value); });
                    }
                    else if (spread instanceof result_1.ResolvedModule) {
                        spread.getExports().forEach(function (value, key) { return map.set(key, value); });
                    }
                    else {
                        return dynamic_1.DynamicValue.fromDynamicInput(node, dynamic_1.DynamicValue.fromInvalidExpressionType(property, spread));
                    }
                }
                else {
                    return dynamic_1.DynamicValue.fromUnknown(node);
                }
            }
            return map;
        };
        StaticInterpreter.prototype.visitTemplateExpression = function (node, context) {
            var pieces = [node.head.text];
            var _loop_1 = function (i) {
                var span = node.templateSpans[i];
                var value = literal(this_1.visit(span.expression, context), function () { return dynamic_1.DynamicValue.fromDynamicString(span.expression); });
                if (value instanceof dynamic_1.DynamicValue) {
                    return { value: dynamic_1.DynamicValue.fromDynamicInput(node, value) };
                }
                pieces.push("" + value, span.literal.text);
            };
            var this_1 = this;
            for (var i = 0; i < node.templateSpans.length; i++) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return pieces.join('');
        };
        StaticInterpreter.prototype.visitIdentifier = function (node, context) {
            var decl = this.host.getDeclarationOfIdentifier(node);
            if (decl === null) {
                if (node.originalKeywordKind === ts.SyntaxKind.UndefinedKeyword) {
                    return undefined;
                }
                else {
                    // Check if the symbol here is imported.
                    if (this.dependencyTracker !== null && this.host.getImportOfIdentifier(node) !== null) {
                        // It was, but no declaration for the node could be found. This means that the dependency
                        // graph for the current file cannot be properly updated to account for this (broken)
                        // import. Instead, the originating file is reported as failing dependency analysis,
                        // ensuring that future compilations will always attempt to re-resolve the previously
                        // broken identifier.
                        this.dependencyTracker.recordDependencyAnalysisFailure(context.originatingFile);
                    }
                    return dynamic_1.DynamicValue.fromUnknownIdentifier(node);
                }
            }
            if (decl.known !== null) {
                return known_declaration_1.resolveKnownDeclaration(decl.known);
            }
            else if (reflection_1.isConcreteDeclaration(decl) && decl.identity !== null &&
                decl.identity.kind === 0 /* DownleveledEnum */) {
                return this.getResolvedEnum(decl.node, decl.identity.enumMembers, context);
            }
            var declContext = tslib_1.__assign(tslib_1.__assign({}, context), joinModuleContext(context, node, decl));
            var result = this.visitAmbiguousDeclaration(decl, declContext);
            if (result instanceof imports_1.Reference) {
                // Only record identifiers to non-synthetic references. Synthetic references may not have the
                // same value at runtime as they do at compile time, so it's not legal to refer to them by the
                // identifier here.
                if (!result.synthetic) {
                    result.addIdentifier(node);
                }
            }
            else if (result instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, result);
            }
            return result;
        };
        StaticInterpreter.prototype.visitDeclaration = function (node, context) {
            if (this.dependencyTracker !== null) {
                this.dependencyTracker.addDependency(context.originatingFile, node.getSourceFile());
            }
            if (this.host.isClass(node)) {
                return this.getReference(node, context);
            }
            else if (ts.isVariableDeclaration(node)) {
                return this.visitVariableDeclaration(node, context);
            }
            else if (ts.isParameter(node) && context.scope.has(node)) {
                return context.scope.get(node);
            }
            else if (ts.isExportAssignment(node)) {
                return this.visitExpression(node.expression, context);
            }
            else if (ts.isEnumDeclaration(node)) {
                return this.visitEnumDeclaration(node, context);
            }
            else if (ts.isSourceFile(node)) {
                return this.visitSourceFile(node, context);
            }
            else if (ts.isBindingElement(node)) {
                return this.visitBindingElement(node, context);
            }
            else {
                return this.getReference(node, context);
            }
        };
        StaticInterpreter.prototype.visitVariableDeclaration = function (node, context) {
            var value = this.host.getVariableValue(node);
            if (value !== null) {
                return this.visitExpression(value, context);
            }
            else if (isVariableDeclarationDeclared(node)) {
                // If the declaration has a literal type that can be statically reduced to a value, resolve to
                // that value. If not, the historical behavior for variable declarations is to return a
                // `Reference` to the variable, as the consumer could use it in a context where knowing its
                // static value is not necessary.
                //
                // Arguably, since the value cannot be statically determined, we should return a
                // `DynamicValue`. This returns a `Reference` because it's the same behavior as before
                // `visitType` was introduced.
                //
                // TODO(zarend): investigate switching to a `DynamicValue` and verify this won't break any
                // use cases, especially in ngcc
                if (node.type !== undefined) {
                    var evaluatedType = this.visitType(node.type, context);
                    if (!(evaluatedType instanceof dynamic_1.DynamicValue)) {
                        return evaluatedType;
                    }
                }
                return this.getReference(node, context);
            }
            else {
                return undefined;
            }
        };
        StaticInterpreter.prototype.visitEnumDeclaration = function (node, context) {
            var _this = this;
            var enumRef = this.getReference(node, context);
            var map = new Map();
            node.members.forEach(function (member) {
                var name = _this.stringNameFromPropertyName(member.name, context);
                if (name !== undefined) {
                    var resolved = member.initializer && _this.visit(member.initializer, context);
                    map.set(name, new result_1.EnumValue(enumRef, name, resolved));
                }
            });
            return map;
        };
        StaticInterpreter.prototype.visitElementAccessExpression = function (node, context) {
            var lhs = this.visitExpression(node.expression, context);
            if (lhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, lhs);
            }
            var rhs = this.visitExpression(node.argumentExpression, context);
            if (rhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, rhs);
            }
            if (typeof rhs !== 'string' && typeof rhs !== 'number') {
                return dynamic_1.DynamicValue.fromInvalidExpressionType(node, rhs);
            }
            return this.accessHelper(node, lhs, rhs, context);
        };
        StaticInterpreter.prototype.visitPropertyAccessExpression = function (node, context) {
            var lhs = this.visitExpression(node.expression, context);
            var rhs = node.name.text;
            // TODO: handle reference to class declaration.
            if (lhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, lhs);
            }
            return this.accessHelper(node, lhs, rhs, context);
        };
        StaticInterpreter.prototype.visitSourceFile = function (node, context) {
            var _this = this;
            var declarations = this.host.getExportsOfModule(node);
            if (declarations === null) {
                return dynamic_1.DynamicValue.fromUnknown(node);
            }
            return new result_1.ResolvedModule(declarations, function (decl) {
                if (decl.known !== null) {
                    return known_declaration_1.resolveKnownDeclaration(decl.known);
                }
                var declContext = tslib_1.__assign(tslib_1.__assign({}, context), joinModuleContext(context, node, decl));
                // Visit both concrete and inline declarations.
                return _this.visitAmbiguousDeclaration(decl, declContext);
            });
        };
        StaticInterpreter.prototype.visitAmbiguousDeclaration = function (decl, declContext) {
            return decl.kind === 1 /* Inline */ && decl.implementation !== undefined &&
                !typescript_1.isDeclaration(decl.implementation) ?
                // Inline declarations whose `implementation` is a `ts.Expression` should be visited as
                // an expression.
                this.visitExpression(decl.implementation, declContext) :
                // Otherwise just visit the `node` as a declaration.
                this.visitDeclaration(decl.node, declContext);
        };
        StaticInterpreter.prototype.accessHelper = function (node, lhs, rhs, context) {
            var strIndex = "" + rhs;
            if (lhs instanceof Map) {
                if (lhs.has(strIndex)) {
                    return lhs.get(strIndex);
                }
                else {
                    return undefined;
                }
            }
            else if (lhs instanceof result_1.ResolvedModule) {
                return lhs.getExport(strIndex);
            }
            else if (Array.isArray(lhs)) {
                if (rhs === 'length') {
                    return lhs.length;
                }
                else if (rhs === 'slice') {
                    return new builtin_1.ArraySliceBuiltinFn(lhs);
                }
                else if (rhs === 'concat') {
                    return new builtin_1.ArrayConcatBuiltinFn(lhs);
                }
                if (typeof rhs !== 'number' || !Number.isInteger(rhs)) {
                    return dynamic_1.DynamicValue.fromInvalidExpressionType(node, rhs);
                }
                return lhs[rhs];
            }
            else if (lhs instanceof imports_1.Reference) {
                var ref = lhs.node;
                if (this.host.isClass(ref)) {
                    var module_1 = owningModule(context, lhs.bestGuessOwningModule);
                    var value = undefined;
                    var member = this.host.getMembersOfClass(ref).find(function (member) { return member.isStatic && member.name === strIndex; });
                    if (member !== undefined) {
                        if (member.value !== null) {
                            value = this.visitExpression(member.value, context);
                        }
                        else if (member.implementation !== null) {
                            value = new imports_1.Reference(member.implementation, module_1);
                        }
                        else if (member.node) {
                            value = new imports_1.Reference(member.node, module_1);
                        }
                    }
                    return value;
                }
                else if (typescript_1.isDeclaration(ref)) {
                    return dynamic_1.DynamicValue.fromDynamicInput(node, dynamic_1.DynamicValue.fromExternalReference(ref, lhs));
                }
            }
            else if (lhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, lhs);
            }
            return dynamic_1.DynamicValue.fromUnknown(node);
        };
        StaticInterpreter.prototype.visitCallExpression = function (node, context) {
            var lhs = this.visitExpression(node.expression, context);
            if (lhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, lhs);
            }
            // If the call refers to a builtin function, attempt to evaluate the function.
            if (lhs instanceof result_1.KnownFn) {
                return lhs.evaluate(node, this.evaluateFunctionArguments(node, context));
            }
            if (!(lhs instanceof imports_1.Reference)) {
                return dynamic_1.DynamicValue.fromInvalidExpressionType(node.expression, lhs);
            }
            var fn = this.host.getDefinitionOfFunction(lhs.node);
            if (fn === null) {
                return dynamic_1.DynamicValue.fromInvalidExpressionType(node.expression, lhs);
            }
            if (!isFunctionOrMethodReference(lhs)) {
                return dynamic_1.DynamicValue.fromInvalidExpressionType(node.expression, lhs);
            }
            // If the function is foreign (declared through a d.ts file), attempt to resolve it with the
            // foreignFunctionResolver, if one is specified.
            if (fn.body === null) {
                var expr = null;
                if (context.foreignFunctionResolver) {
                    expr = context.foreignFunctionResolver(lhs, node.arguments);
                }
                if (expr === null) {
                    return dynamic_1.DynamicValue.fromDynamicInput(node, dynamic_1.DynamicValue.fromExternalReference(node.expression, lhs));
                }
                // If the foreign expression occurs in a different file, then assume that the owning module
                // of the call expression should also be used for the resolved foreign expression.
                if (expr.getSourceFile() !== node.expression.getSourceFile() &&
                    lhs.bestGuessOwningModule !== null) {
                    context = tslib_1.__assign(tslib_1.__assign({}, context), { absoluteModuleName: lhs.bestGuessOwningModule.specifier, resolutionContext: lhs.bestGuessOwningModule.resolutionContext });
                }
                return this.visitFfrExpression(expr, context);
            }
            var res = this.visitFunctionBody(node, fn, context);
            // If the result of attempting to resolve the function body was a DynamicValue, attempt to use
            // the foreignFunctionResolver if one is present. This could still potentially yield a usable
            // value.
            if (res instanceof dynamic_1.DynamicValue && context.foreignFunctionResolver !== undefined) {
                var ffrExpr = context.foreignFunctionResolver(lhs, node.arguments);
                if (ffrExpr !== null) {
                    // The foreign function resolver was able to extract an expression from this function. See
                    // if that expression leads to a non-dynamic result.
                    var ffrRes = this.visitFfrExpression(ffrExpr, context);
                    if (!(ffrRes instanceof dynamic_1.DynamicValue)) {
                        // FFR yielded an actual result that's not dynamic, so use that instead of the original
                        // resolution.
                        res = ffrRes;
                    }
                }
            }
            return res;
        };
        /**
         * Visit an expression which was extracted from a foreign-function resolver.
         *
         * This will process the result and ensure it's correct for FFR-resolved values, including marking
         * `Reference`s as synthetic.
         */
        StaticInterpreter.prototype.visitFfrExpression = function (expr, context) {
            var res = this.visitExpression(expr, context);
            if (res instanceof imports_1.Reference) {
                // This Reference was created synthetically, via a foreign function resolver. The real
                // runtime value of the function expression may be different than the foreign function
                // resolved value, so mark the Reference as synthetic to avoid it being misinterpreted.
                res.synthetic = true;
            }
            return res;
        };
        StaticInterpreter.prototype.visitFunctionBody = function (node, fn, context) {
            var _this = this;
            if (fn.body === null) {
                return dynamic_1.DynamicValue.fromUnknown(node);
            }
            else if (fn.body.length !== 1 || !ts.isReturnStatement(fn.body[0])) {
                return dynamic_1.DynamicValue.fromComplexFunctionCall(node, fn);
            }
            var ret = fn.body[0];
            var args = this.evaluateFunctionArguments(node, context);
            var newScope = new Map();
            var calleeContext = tslib_1.__assign(tslib_1.__assign({}, context), { scope: newScope });
            fn.parameters.forEach(function (param, index) {
                var arg = args[index];
                if (param.node.dotDotDotToken !== undefined) {
                    arg = args.slice(index);
                }
                if (arg === undefined && param.initializer !== null) {
                    arg = _this.visitExpression(param.initializer, calleeContext);
                }
                newScope.set(param.node, arg);
            });
            return ret.expression !== undefined ? this.visitExpression(ret.expression, calleeContext) :
                undefined;
        };
        StaticInterpreter.prototype.visitConditionalExpression = function (node, context) {
            var condition = this.visitExpression(node.condition, context);
            if (condition instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, condition);
            }
            if (condition) {
                return this.visitExpression(node.whenTrue, context);
            }
            else {
                return this.visitExpression(node.whenFalse, context);
            }
        };
        StaticInterpreter.prototype.visitPrefixUnaryExpression = function (node, context) {
            var operatorKind = node.operator;
            if (!UNARY_OPERATORS.has(operatorKind)) {
                return dynamic_1.DynamicValue.fromUnsupportedSyntax(node);
            }
            var op = UNARY_OPERATORS.get(operatorKind);
            var value = this.visitExpression(node.operand, context);
            if (value instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, value);
            }
            else {
                return op(value);
            }
        };
        StaticInterpreter.prototype.visitBinaryExpression = function (node, context) {
            var tokenKind = node.operatorToken.kind;
            if (!BINARY_OPERATORS.has(tokenKind)) {
                return dynamic_1.DynamicValue.fromUnsupportedSyntax(node);
            }
            var opRecord = BINARY_OPERATORS.get(tokenKind);
            var lhs, rhs;
            if (opRecord.literal) {
                lhs = literal(this.visitExpression(node.left, context), function (value) { return dynamic_1.DynamicValue.fromInvalidExpressionType(node.left, value); });
                rhs = literal(this.visitExpression(node.right, context), function (value) { return dynamic_1.DynamicValue.fromInvalidExpressionType(node.right, value); });
            }
            else {
                lhs = this.visitExpression(node.left, context);
                rhs = this.visitExpression(node.right, context);
            }
            if (lhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, lhs);
            }
            else if (rhs instanceof dynamic_1.DynamicValue) {
                return dynamic_1.DynamicValue.fromDynamicInput(node, rhs);
            }
            else {
                return opRecord.op(lhs, rhs);
            }
        };
        StaticInterpreter.prototype.visitParenthesizedExpression = function (node, context) {
            return this.visitExpression(node.expression, context);
        };
        StaticInterpreter.prototype.evaluateFunctionArguments = function (node, context) {
            var e_1, _a;
            var args = [];
            try {
                for (var _b = tslib_1.__values(node.arguments), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var arg = _c.value;
                    if (ts.isSpreadElement(arg)) {
                        args.push.apply(args, tslib_1.__spreadArray([], tslib_1.__read(this.visitSpreadElement(arg, context))));
                    }
                    else {
                        args.push(this.visitExpression(arg, context));
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return args;
        };
        StaticInterpreter.prototype.visitSpreadElement = function (node, context) {
            var spread = this.visitExpression(node.expression, context);
            if (spread instanceof dynamic_1.DynamicValue) {
                return [dynamic_1.DynamicValue.fromDynamicInput(node, spread)];
            }
            else if (!Array.isArray(spread)) {
                return [dynamic_1.DynamicValue.fromInvalidExpressionType(node, spread)];
            }
            else {
                return spread;
            }
        };
        StaticInterpreter.prototype.visitBindingElement = function (node, context) {
            var e_2, _a;
            var path = [];
            var closestDeclaration = node;
            while (ts.isBindingElement(closestDeclaration) ||
                ts.isArrayBindingPattern(closestDeclaration) ||
                ts.isObjectBindingPattern(closestDeclaration)) {
                if (ts.isBindingElement(closestDeclaration)) {
                    path.unshift(closestDeclaration);
                }
                closestDeclaration = closestDeclaration.parent;
            }
            if (!ts.isVariableDeclaration(closestDeclaration) ||
                closestDeclaration.initializer === undefined) {
                return dynamic_1.DynamicValue.fromUnknown(node);
            }
            var value = this.visit(closestDeclaration.initializer, context);
            try {
                for (var path_1 = tslib_1.__values(path), path_1_1 = path_1.next(); !path_1_1.done; path_1_1 = path_1.next()) {
                    var element = path_1_1.value;
                    var key = void 0;
                    if (ts.isArrayBindingPattern(element.parent)) {
                        key = element.parent.elements.indexOf(element);
                    }
                    else {
                        var name_2 = element.propertyName || element.name;
                        if (ts.isIdentifier(name_2)) {
                            key = name_2.text;
                        }
                        else {
                            return dynamic_1.DynamicValue.fromUnknown(element);
                        }
                    }
                    value = this.accessHelper(element, value, key, context);
                    if (value instanceof dynamic_1.DynamicValue) {
                        return value;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (path_1_1 && !path_1_1.done && (_a = path_1.return)) _a.call(path_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return value;
        };
        StaticInterpreter.prototype.stringNameFromPropertyName = function (node, context) {
            if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
                return node.text;
            }
            else if (ts.isComputedPropertyName(node)) {
                var literal_1 = this.visitExpression(node.expression, context);
                return typeof literal_1 === 'string' ? literal_1 : undefined;
            }
            else {
                return undefined;
            }
        };
        StaticInterpreter.prototype.getResolvedEnum = function (node, enumMembers, context) {
            var _this = this;
            var enumRef = this.getReference(node, context);
            var map = new Map();
            enumMembers.forEach(function (member) {
                var name = _this.stringNameFromPropertyName(member.name, context);
                if (name !== undefined) {
                    var resolved = _this.visit(member.initializer, context);
                    map.set(name, new result_1.EnumValue(enumRef, name, resolved));
                }
            });
            return map;
        };
        StaticInterpreter.prototype.getReference = function (node, context) {
            return new imports_1.Reference(node, owningModule(context));
        };
        StaticInterpreter.prototype.visitType = function (node, context) {
            if (ts.isLiteralTypeNode(node)) {
                return this.visitExpression(node.literal, context);
            }
            else if (ts.isTupleTypeNode(node)) {
                return this.visitTupleType(node, context);
            }
            else if (ts.isNamedTupleMember(node)) {
                return this.visitType(node.type, context);
            }
            return dynamic_1.DynamicValue.fromDynamicType(node);
        };
        StaticInterpreter.prototype.visitTupleType = function (node, context) {
            var e_3, _a;
            var res = [];
            try {
                for (var _b = tslib_1.__values(node.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var elem = _c.value;
                    res.push(this.visitType(elem, context));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return res;
        };
        return StaticInterpreter;
    }());
    exports.StaticInterpreter = StaticInterpreter;
    function isFunctionOrMethodReference(ref) {
        return ts.isFunctionDeclaration(ref.node) || ts.isMethodDeclaration(ref.node) ||
            ts.isFunctionExpression(ref.node);
    }
    function literal(value, reject) {
        if (value instanceof result_1.EnumValue) {
            value = value.resolved;
        }
        if (value instanceof dynamic_1.DynamicValue || value === null || value === undefined ||
            typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return value;
        }
        return reject(value);
    }
    function isVariableDeclarationDeclared(node) {
        if (node.parent === undefined || !ts.isVariableDeclarationList(node.parent)) {
            return false;
        }
        var declList = node.parent;
        if (declList.parent === undefined || !ts.isVariableStatement(declList.parent)) {
            return false;
        }
        var varStmt = declList.parent;
        return varStmt.modifiers !== undefined &&
            varStmt.modifiers.some(function (mod) { return mod.kind === ts.SyntaxKind.DeclareKeyword; });
    }
    var EMPTY = {};
    function joinModuleContext(existing, node, decl) {
        if (decl.viaModule !== null && decl.viaModule !== existing.absoluteModuleName) {
            return {
                absoluteModuleName: decl.viaModule,
                resolutionContext: node.getSourceFile().fileName,
            };
        }
        else {
            return EMPTY;
        }
    }
    function owningModule(context, override) {
        if (override === void 0) { override = null; }
        var specifier = context.absoluteModuleName;
        if (override !== null) {
            specifier = override.specifier;
        }
        if (specifier !== null) {
            return {
                specifier: specifier,
                resolutionContext: context.resolutionContext,
            };
        }
        else {
            return null;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJwcmV0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3BhcnRpYWxfZXZhbHVhdG9yL3NyYy9pbnRlcnByZXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBRWpDLG1FQUF3QztJQUd4Qyx5RUFBOEs7SUFDOUssa0ZBQXdEO0lBRXhELHlGQUFvRTtJQUNwRSx5RkFBdUM7SUFFdkMsNkdBQTREO0lBQzVELHVGQUFpSDtJQWVqSCxTQUFTLGVBQWUsQ0FBQyxFQUEyQjtRQUNsRCxPQUFPLEVBQUMsRUFBRSxJQUFBLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxTQUFTLGlCQUFpQixDQUFDLEVBQTJCO1FBQ3BELE9BQU8sRUFBQyxFQUFFLElBQUEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLENBQW1DO1FBQ2pFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsR0FBRyxDQUFDLEVBQUwsQ0FBSyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxHQUFHLENBQUMsRUFBTCxDQUFLLENBQUMsQ0FBQztRQUM1RCxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEdBQUcsQ0FBQyxFQUFMLENBQUssQ0FBQyxDQUFDO1FBQy9ELENB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QyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7UmVmZXJlbmNlfSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7T3duaW5nTW9kdWxlfSBmcm9tICcuLi8uLi9pbXBvcnRzL3NyYy9yZWZlcmVuY2VzJztcbmltcG9ydCB7RGVwZW5kZW5jeVRyYWNrZXJ9IGZyb20gJy4uLy4uL2luY3JlbWVudGFsL2FwaSc7XG5pbXBvcnQge0RlY2xhcmF0aW9uLCBEZWNsYXJhdGlvbktpbmQsIERlY2xhcmF0aW9uTm9kZSwgRW51bU1lbWJlciwgRnVuY3Rpb25EZWZpbml0aW9uLCBpc0NvbmNyZXRlRGVjbGFyYXRpb24sIFJlZmxlY3Rpb25Ib3N0LCBTcGVjaWFsRGVjbGFyYXRpb25LaW5kfSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcbmltcG9ydCB7aXNEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7QXJyYXlDb25jYXRCdWlsdGluRm4sIEFycmF5U2xpY2VCdWlsdGluRm59IGZyb20gJy4vYnVpbHRpbic7XG5pbXBvcnQge0R5bmFtaWNWYWx1ZX0gZnJvbSAnLi9keW5hbWljJztcbmltcG9ydCB7Rm9yZWlnbkZ1bmN0aW9uUmVzb2x2ZXJ9IGZyb20gJy4vaW50ZXJmYWNlJztcbmltcG9ydCB7cmVzb2x2ZUtub3duRGVjbGFyYXRpb259IGZyb20gJy4va25vd25fZGVjbGFyYXRpb24nO1xuaW1wb3J0IHtFbnVtVmFsdWUsIEtub3duRm4sIFJlc29sdmVkTW9kdWxlLCBSZXNvbHZlZFZhbHVlLCBSZXNvbHZlZFZhbHVlQXJyYXksIFJlc29sdmVkVmFsdWVNYXB9IGZyb20gJy4vcmVzdWx0JztcblxuXG5cbi8qKlxuICogVHJhY2tzIHRoZSBzY29wZSBvZiBhIGZ1bmN0aW9uIGJvZHksIHdoaWNoIGluY2x1ZGVzIGBSZXNvbHZlZFZhbHVlYHMgZm9yIHRoZSBwYXJhbWV0ZXJzIG9mIHRoYXRcbiAqIGJvZHkuXG4gKi9cbnR5cGUgU2NvcGUgPSBNYXA8dHMuUGFyYW1ldGVyRGVjbGFyYXRpb24sIFJlc29sdmVkVmFsdWU+O1xuXG5pbnRlcmZhY2UgQmluYXJ5T3BlcmF0b3JEZWYge1xuICBsaXRlcmFsOiBib29sZWFuO1xuICBvcDogKGE6IGFueSwgYjogYW55KSA9PiBSZXNvbHZlZFZhbHVlO1xufVxuXG5mdW5jdGlvbiBsaXRlcmFsQmluYXJ5T3Aob3A6IChhOiBhbnksIGI6IGFueSkgPT4gYW55KTogQmluYXJ5T3BlcmF0b3JEZWYge1xuICByZXR1cm4ge29wLCBsaXRlcmFsOiB0cnVlfTtcbn1cblxuZnVuY3Rpb24gcmVmZXJlbmNlQmluYXJ5T3Aob3A6IChhOiBhbnksIGI6IGFueSkgPT4gYW55KTogQmluYXJ5T3BlcmF0b3JEZWYge1xuICByZXR1cm4ge29wLCBsaXRlcmFsOiBmYWxzZX07XG59XG5cbmNvbnN0IEJJTkFSWV9PUEVSQVRPUlMgPSBuZXcgTWFwPHRzLlN5bnRheEtpbmQsIEJpbmFyeU9wZXJhdG9yRGVmPihbXG4gIFt0cy5TeW50YXhLaW5kLlBsdXNUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhICsgYildLFxuICBbdHMuU3ludGF4S2luZC5NaW51c1Rva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgLSBiKV0sXG4gIFt0cy5TeW50YXhLaW5kLkFzdGVyaXNrVG9rZW4sIGxpdGVyYWxCaW5hcnlPcCgoYSwgYikgPT4gYSAqIGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuU2xhc2hUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhIC8gYildLFxuICBbdHMuU3ludGF4S2luZC5QZXJjZW50VG9rZW4sIGxpdGVyYWxCaW5hcnlPcCgoYSwgYikgPT4gYSAlIGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuQW1wZXJzYW5kVG9rZW4sIGxpdGVyYWxCaW5hcnlPcCgoYSwgYikgPT4gYSAmIGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuQmFyVG9rZW4sIGxpdGVyYWxCaW5hcnlPcCgoYSwgYikgPT4gYSB8IGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuQ2FyZXRUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhIF4gYildLFxuICBbdHMuU3ludGF4S2luZC5MZXNzVGhhblRva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgPCBiKV0sXG4gIFt0cy5TeW50YXhLaW5kLkxlc3NUaGFuRXF1YWxzVG9rZW4sIGxpdGVyYWxCaW5hcnlPcCgoYSwgYikgPT4gYSA8PSBiKV0sXG4gIFt0cy5TeW50YXhLaW5kLkdyZWF0ZXJUaGFuVG9rZW4sIGxpdGVyYWxCaW5hcnlPcCgoYSwgYikgPT4gYSA+IGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuR3JlYXRlclRoYW5FcXVhbHNUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhID49IGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuRXF1YWxzRXF1YWxzVG9rZW4sIGxpdGVyYWxCaW5hcnlPcCgoYSwgYikgPT4gYSA9PSBiKV0sXG4gIFt0cy5TeW50YXhLaW5kLkVxdWFsc0VxdWFsc0VxdWFsc1Rva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgPT09IGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuRXhjbGFtYXRpb25FcXVhbHNUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhICE9IGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuRXhjbGFtYXRpb25FcXVhbHNFcXVhbHNUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhICE9PSBiKV0sXG4gIFt0cy5TeW50YXhLaW5kLkxlc3NUaGFuTGVzc1RoYW5Ub2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhIDw8IGIpXSxcbiAgW3RzLlN5bnRheEtpbmQuR3JlYXRlclRoYW5HcmVhdGVyVGhhblRva2VuLCBsaXRlcmFsQmluYXJ5T3AoKGEsIGIpID0+IGEgPj4gYildLFxuICBbdHMuU3ludGF4S2luZC5HcmVhdGVyVGhhbkdyZWF0ZXJUaGFuR3JlYXRlclRoYW5Ub2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBhID4+PiBiKV0sXG4gIFt0cy5TeW50YXhLaW5kLkFzdGVyaXNrQXN0ZXJpc2tUb2tlbiwgbGl0ZXJhbEJpbmFyeU9wKChhLCBiKSA9PiBNYXRoLnBvdyhhLCBiKSldLFxuICBbdHMuU3ludGF4S2luZC5BbXBlcnNhbmRBbXBlcnNhbmRUb2tlbiwgcmVmZXJlbmNlQmluYXJ5T3AoKGEsIGIpID0+IGEgJiYgYildLFxuICBbdHMuU3ludGF4S2luZC5CYXJCYXJUb2tlbiwgcmVmZXJlbmNlQmluYXJ5T3AoKGEsIGIpID0+IGEgfHwgYildXG5dKTtcblxuY29uc3QgVU5BUllfT1BFUkFUT1JTID0gbmV3IE1hcDx0cy5TeW50YXhLaW5kLCAoYTogYW55KSA9PiBhbnk+KFtcbiAgW3RzLlN5bnRheEtpbmQuVGlsZGVUb2tlbiwgYSA9PiB+YV0sIFt0cy5TeW50YXhLaW5kLk1pbnVzVG9rZW4sIGEgPT4gLWFdLFxuICBbdHMuU3ludGF4S2luZC5QbHVzVG9rZW4sIGEgPT4gK2FdLCBbdHMuU3ludGF4S2luZC5FeGNsYW1hdGlvblRva2VuLCBhID0+ICFhXVxuXSk7XG5cbmludGVyZmFjZSBDb250ZXh0IHtcbiAgb3JpZ2luYXRpbmdGaWxlOiB0cy5Tb3VyY2VGaWxlO1xuICAvKipcbiAgICogVGhlIG1vZHVsZSBuYW1lIChpZiBhbnkpIHdoaWNoIHdhcyB1c2VkIHRvIHJlYWNoIHRoZSBjdXJyZW50bHkgcmVzb2x2aW5nIHN5bWJvbHMuXG4gICAqL1xuICBhYnNvbHV0ZU1vZHVsZU5hbWU6IHN0cmluZ3xudWxsO1xuXG4gIC8qKlxuICAgKiBBIGZpbGUgbmFtZSByZXByZXNlbnRpbmcgdGhlIGNvbnRleHQgaW4gd2hpY2ggdGhlIGN1cnJlbnQgYGFic29sdXRlTW9kdWxlTmFtZWAsIGlmIGFueSwgd2FzXG4gICAqIHJlc29sdmVkLlxuICAgKi9cbiAgcmVzb2x1dGlvbkNvbnRleHQ6IHN0cmluZztcbiAgc2NvcGU6IFNjb3BlO1xuICBmb3JlaWduRnVuY3Rpb25SZXNvbHZlcj86IEZvcmVpZ25GdW5jdGlvblJlc29sdmVyO1xufVxuXG5leHBvcnQgY2xhc3MgU3RhdGljSW50ZXJwcmV0ZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgaG9zdDogUmVmbGVjdGlvbkhvc3QsIHByaXZhdGUgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4gICAgICBwcml2YXRlIGRlcGVuZGVuY3lUcmFja2VyOiBEZXBlbmRlbmN5VHJhY2tlcnxudWxsKSB7fVxuXG4gIHZpc2l0KG5vZGU6IHRzLkV4cHJlc3Npb24sIGNvbnRleHQ6IENvbnRleHQpOiBSZXNvbHZlZFZhbHVlIHtcbiAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb24obm9kZSwgY29udGV4dCk7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0RXhwcmVzc2lvbihub2RlOiB0cy5FeHByZXNzaW9uLCBjb250ZXh0OiBDb250ZXh0KTogUmVzb2x2ZWRWYWx1ZSB7XG4gICAgbGV0IHJlc3VsdDogUmVzb2x2ZWRWYWx1ZTtcbiAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlRydWVLZXl3b3JkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5GYWxzZUtleXdvcmQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5OdWxsS2V5d29yZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmICh0cy5pc1N0cmluZ0xpdGVyYWwobm9kZSkpIHtcbiAgICAgIHJldHVybiBub2RlLnRleHQ7XG4gICAgfSBlbHNlIGlmICh0cy5pc05vU3Vic3RpdHV0aW9uVGVtcGxhdGVMaXRlcmFsKG5vZGUpKSB7XG4gICAgICByZXR1cm4gbm9kZS50ZXh0O1xuICAgIH0gZWxzZSBpZiAodHMuaXNUZW1wbGF0ZUV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudmlzaXRUZW1wbGF0ZUV4cHJlc3Npb24obm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc051bWVyaWNMaXRlcmFsKG5vZGUpKSB7XG4gICAgICByZXR1cm4gcGFyc2VGbG9hdChub2RlLnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy52aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnZpc2l0SWRlbnRpZmllcihub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnZpc2l0UHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNDYWxsRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy52aXNpdENhbGxFeHByZXNzaW9uKG5vZGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNDb25kaXRpb25hbEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudmlzaXRDb25kaXRpb25hbEV4cHJlc3Npb24obm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc1ByZWZpeFVuYXJ5RXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy52aXNpdFByZWZpeFVuYXJ5RXhwcmVzc2lvbihub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzQmluYXJ5RXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy52aXNpdEJpbmFyeUV4cHJlc3Npb24obm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy52aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy52aXNpdEVsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNBc0V4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbiwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc05vbk51bGxFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24sIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ob3N0LmlzQ2xhc3Mobm9kZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudmlzaXREZWNsYXJhdGlvbihub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tVW5zdXBwb3J0ZWRTeW50YXgobm9kZSk7XG4gICAgfVxuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUgJiYgcmVzdWx0Lm5vZGUgIT09IG5vZGUpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNJbnB1dChub2RlLCByZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZTogdHMuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbiwgY29udGV4dDogQ29udGV4dCk6XG4gICAgICBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCBhcnJheTogUmVzb2x2ZWRWYWx1ZUFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gbm9kZS5lbGVtZW50c1tpXTtcbiAgICAgIGlmICh0cy5pc1NwcmVhZEVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgYXJyYXkucHVzaCguLi50aGlzLnZpc2l0U3ByZWFkRWxlbWVudChlbGVtZW50LCBjb250ZXh0KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheS5wdXNoKHRoaXMudmlzaXRFeHByZXNzaW9uKGVsZW1lbnQsIGNvbnRleHQpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgcHJvdGVjdGVkIHZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24obm9kZTogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24sIGNvbnRleHQ6IENvbnRleHQpOlxuICAgICAgUmVzb2x2ZWRWYWx1ZSB7XG4gICAgY29uc3QgbWFwOiBSZXNvbHZlZFZhbHVlTWFwID0gbmV3IE1hcDxzdHJpbmcsIFJlc29sdmVkVmFsdWU+KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHByb3BlcnR5ID0gbm9kZS5wcm9wZXJ0aWVzW2ldO1xuICAgICAgaWYgKHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5KSkge1xuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5zdHJpbmdOYW1lRnJvbVByb3BlcnR5TmFtZShwcm9wZXJ0eS5uYW1lLCBjb250ZXh0KTtcbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgbmFtZSBjYW4gYmUgZGV0ZXJtaW5lZCBzdGF0aWNhbGx5LlxuICAgICAgICBpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KG5vZGUsIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY1N0cmluZyhwcm9wZXJ0eS5uYW1lKSk7XG4gICAgICAgIH1cbiAgICAgICAgbWFwLnNldChuYW1lLCB0aGlzLnZpc2l0RXhwcmVzc2lvbihwcm9wZXJ0eS5pbml0aWFsaXplciwgY29udGV4dCkpO1xuICAgICAgfSBlbHNlIGlmICh0cy5pc1Nob3J0aGFuZFByb3BlcnR5QXNzaWdubWVudChwcm9wZXJ0eSkpIHtcbiAgICAgICAgY29uc3Qgc3ltYm9sID0gdGhpcy5jaGVja2VyLmdldFNob3J0aGFuZEFzc2lnbm1lbnRWYWx1ZVN5bWJvbChwcm9wZXJ0eSk7XG4gICAgICAgIGlmIChzeW1ib2wgPT09IHVuZGVmaW5lZCB8fCBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbWFwLnNldChwcm9wZXJ0eS5uYW1lLnRleHQsIER5bmFtaWNWYWx1ZS5mcm9tVW5rbm93bihwcm9wZXJ0eSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcC5zZXQocHJvcGVydHkubmFtZS50ZXh0LCB0aGlzLnZpc2l0RGVjbGFyYXRpb24oc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24sIGNvbnRleHQpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0cy5pc1NwcmVhZEFzc2lnbm1lbnQocHJvcGVydHkpKSB7XG4gICAgICAgIGNvbnN0IHNwcmVhZCA9IHRoaXMudmlzaXRFeHByZXNzaW9uKHByb3BlcnR5LmV4cHJlc3Npb24sIGNvbnRleHQpO1xuICAgICAgICBpZiAoc3ByZWFkIGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KG5vZGUsIHNwcmVhZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ByZWFkIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgICAgc3ByZWFkLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IG1hcC5zZXQoa2V5LCB2YWx1ZSkpO1xuICAgICAgICB9IGVsc2UgaWYgKHNwcmVhZCBpbnN0YW5jZW9mIFJlc29sdmVkTW9kdWxlKSB7XG4gICAgICAgICAgc3ByZWFkLmdldEV4cG9ydHMoKS5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiBtYXAuc2V0KGtleSwgdmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQoXG4gICAgICAgICAgICAgIG5vZGUsIER5bmFtaWNWYWx1ZS5mcm9tSW52YWxpZEV4cHJlc3Npb25UeXBlKHByb3BlcnR5LCBzcHJlYWQpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tVW5rbm93bihub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRUZW1wbGF0ZUV4cHJlc3Npb24obm9kZTogdHMuVGVtcGxhdGVFeHByZXNzaW9uLCBjb250ZXh0OiBDb250ZXh0KTogUmVzb2x2ZWRWYWx1ZSB7XG4gICAgY29uc3QgcGllY2VzOiBzdHJpbmdbXSA9IFtub2RlLmhlYWQudGV4dF07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLnRlbXBsYXRlU3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHNwYW4gPSBub2RlLnRlbXBsYXRlU3BhbnNbaV07XG4gICAgICBjb25zdCB2YWx1ZSA9IGxpdGVyYWwoXG4gICAgICAgICAgdGhpcy52aXNpdChzcGFuLmV4cHJlc3Npb24sIGNvbnRleHQpLFxuICAgICAgICAgICgpID0+IER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY1N0cmluZyhzcGFuLmV4cHJlc3Npb24pKTtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIER5bmFtaWNWYWx1ZSkge1xuICAgICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQobm9kZSwgdmFsdWUpO1xuICAgICAgfVxuICAgICAgcGllY2VzLnB1c2goYCR7dmFsdWV9YCwgc3Bhbi5saXRlcmFsLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gcGllY2VzLmpvaW4oJycpO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdElkZW50aWZpZXIobm9kZTogdHMuSWRlbnRpZmllciwgY29udGV4dDogQ29udGV4dCk6IFJlc29sdmVkVmFsdWUge1xuICAgIGNvbnN0IGRlY2wgPSB0aGlzLmhvc3QuZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXIobm9kZSk7XG4gICAgaWYgKGRlY2wgPT09IG51bGwpIHtcbiAgICAgIGlmIChub2RlLm9yaWdpbmFsS2V5d29yZEtpbmQgPT09IHRzLlN5bnRheEtpbmQuVW5kZWZpbmVkS2V5d29yZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHN5bWJvbCBoZXJlIGlzIGltcG9ydGVkLlxuICAgICAgICBpZiAodGhpcy5kZXBlbmRlbmN5VHJhY2tlciAhPT0gbnVsbCAmJiB0aGlzLmhvc3QuZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUpICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gSXQgd2FzLCBidXQgbm8gZGVjbGFyYXRpb24gZm9yIHRoZSBub2RlIGNvdWxkIGJlIGZvdW5kLiBUaGlzIG1lYW5zIHRoYXQgdGhlIGRlcGVuZGVuY3lcbiAgICAgICAgICAvLyBncmFwaCBmb3IgdGhlIGN1cnJlbnQgZmlsZSBjYW5ub3QgYmUgcHJvcGVybHkgdXBkYXRlZCB0byBhY2NvdW50IGZvciB0aGlzIChicm9rZW4pXG4gICAgICAgICAgLy8gaW1wb3J0LiBJbnN0ZWFkLCB0aGUgb3JpZ2luYXRpbmcgZmlsZSBpcyByZXBvcnRlZCBhcyBmYWlsaW5nIGRlcGVuZGVuY3kgYW5hbHlzaXMsXG4gICAgICAgICAgLy8gZW5zdXJpbmcgdGhhdCBmdXR1cmUgY29tcGlsYXRpb25zIHdpbGwgYWx3YXlzIGF0dGVtcHQgdG8gcmUtcmVzb2x2ZSB0aGUgcHJldmlvdXNseVxuICAgICAgICAgIC8vIGJyb2tlbiBpZGVudGlmaWVyLlxuICAgICAgICAgIHRoaXMuZGVwZW5kZW5jeVRyYWNrZXIucmVjb3JkRGVwZW5kZW5jeUFuYWx5c2lzRmFpbHVyZShjb250ZXh0Lm9yaWdpbmF0aW5nRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tVW5rbm93bklkZW50aWZpZXIobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkZWNsLmtub3duICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZUtub3duRGVjbGFyYXRpb24oZGVjbC5rbm93bik7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICAgaXNDb25jcmV0ZURlY2xhcmF0aW9uKGRlY2wpICYmIGRlY2wuaWRlbnRpdHkgIT09IG51bGwgJiZcbiAgICAgICAgZGVjbC5pZGVudGl0eS5raW5kID09PSBTcGVjaWFsRGVjbGFyYXRpb25LaW5kLkRvd25sZXZlbGVkRW51bSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVzb2x2ZWRFbnVtKGRlY2wubm9kZSwgZGVjbC5pZGVudGl0eS5lbnVtTWVtYmVycywgY29udGV4dCk7XG4gICAgfVxuICAgIGNvbnN0IGRlY2xDb250ZXh0ID0gey4uLmNvbnRleHQsIC4uLmpvaW5Nb2R1bGVDb250ZXh0KGNvbnRleHQsIG5vZGUsIGRlY2wpfTtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnZpc2l0QW1iaWd1b3VzRGVjbGFyYXRpb24oZGVjbCwgZGVjbENvbnRleHQpO1xuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBSZWZlcmVuY2UpIHtcbiAgICAgIC8vIE9ubHkgcmVjb3JkIGlkZW50aWZpZXJzIHRvIG5vbi1zeW50aGV0aWMgcmVmZXJlbmNlcy4gU3ludGhldGljIHJlZmVyZW5jZXMgbWF5IG5vdCBoYXZlIHRoZVxuICAgICAgLy8gc2FtZSB2YWx1ZSBhdCBydW50aW1lIGFzIHRoZXkgZG8gYXQgY29tcGlsZSB0aW1lLCBzbyBpdCdzIG5vdCBsZWdhbCB0byByZWZlciB0byB0aGVtIGJ5IHRoZVxuICAgICAgLy8gaWRlbnRpZmllciBoZXJlLlxuICAgICAgaWYgKCFyZXN1bHQuc3ludGhldGljKSB7XG4gICAgICAgIHJlc3VsdC5hZGRJZGVudGlmaWVyKG5vZGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVzdWx0IGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQobm9kZSwgcmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgdmlzaXREZWNsYXJhdGlvbihub2RlOiBEZWNsYXJhdGlvbk5vZGUsIGNvbnRleHQ6IENvbnRleHQpOiBSZXNvbHZlZFZhbHVlIHtcbiAgICBpZiAodGhpcy5kZXBlbmRlbmN5VHJhY2tlciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5kZXBlbmRlbmN5VHJhY2tlci5hZGREZXBlbmRlbmN5KGNvbnRleHQub3JpZ2luYXRpbmdGaWxlLCBub2RlLmdldFNvdXJjZUZpbGUoKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhvc3QuaXNDbGFzcyhub2RlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVmZXJlbmNlKG5vZGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy52aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc1BhcmFtZXRlcihub2RlKSAmJiBjb250ZXh0LnNjb3BlLmhhcyhub2RlKSkge1xuICAgICAgcmV0dXJuIGNvbnRleHQuc2NvcGUuZ2V0KG5vZGUpITtcbiAgICB9IGVsc2UgaWYgKHRzLmlzRXhwb3J0QXNzaWdubWVudChub2RlKSkge1xuICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbiwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc0VudW1EZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgcmV0dXJuIHRoaXMudmlzaXRFbnVtRGVjbGFyYXRpb24obm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc1NvdXJjZUZpbGUobm9kZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnZpc2l0U291cmNlRmlsZShub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzQmluZGluZ0VsZW1lbnQobm9kZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnZpc2l0QmluZGluZ0VsZW1lbnQobm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFJlZmVyZW5jZShub2RlLCBjb250ZXh0KTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZTogdHMuVmFyaWFibGVEZWNsYXJhdGlvbiwgY29udGV4dDogQ29udGV4dCk6IFJlc29sdmVkVmFsdWUge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ob3N0LmdldFZhcmlhYmxlVmFsdWUobm9kZSk7XG4gICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb24odmFsdWUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAoaXNWYXJpYWJsZURlY2xhcmF0aW9uRGVjbGFyZWQobm9kZSkpIHtcbiAgICAgIC8vIElmIHRoZSBkZWNsYXJhdGlvbiBoYXMgYSBsaXRlcmFsIHR5cGUgdGhhdCBjYW4gYmUgc3RhdGljYWxseSByZWR1Y2VkIHRvIGEgdmFsdWUsIHJlc29sdmUgdG9cbiAgICAgIC8vIHRoYXQgdmFsdWUuIElmIG5vdCwgdGhlIGhpc3RvcmljYWwgYmVoYXZpb3IgZm9yIHZhcmlhYmxlIGRlY2xhcmF0aW9ucyBpcyB0byByZXR1cm4gYVxuICAgICAgLy8gYFJlZmVyZW5jZWAgdG8gdGhlIHZhcmlhYmxlLCBhcyB0aGUgY29uc3VtZXIgY291bGQgdXNlIGl0IGluIGEgY29udGV4dCB3aGVyZSBrbm93aW5nIGl0c1xuICAgICAgLy8gc3RhdGljIHZhbHVlIGlzIG5vdCBuZWNlc3NhcnkuXG4gICAgICAvL1xuICAgICAgLy8gQXJndWFibHksIHNpbmNlIHRoZSB2YWx1ZSBjYW5ub3QgYmUgc3RhdGljYWxseSBkZXRlcm1pbmVkLCB3ZSBzaG91bGQgcmV0dXJuIGFcbiAgICAgIC8vIGBEeW5hbWljVmFsdWVgLiBUaGlzIHJldHVybnMgYSBgUmVmZXJlbmNlYCBiZWNhdXNlIGl0J3MgdGhlIHNhbWUgYmVoYXZpb3IgYXMgYmVmb3JlXG4gICAgICAvLyBgdmlzaXRUeXBlYCB3YXMgaW50cm9kdWNlZC5cbiAgICAgIC8vXG4gICAgICAvLyBUT0RPKHphcmVuZCk6IGludmVzdGlnYXRlIHN3aXRjaGluZyB0byBhIGBEeW5hbWljVmFsdWVgIGFuZCB2ZXJpZnkgdGhpcyB3b24ndCBicmVhayBhbnlcbiAgICAgIC8vIHVzZSBjYXNlcywgZXNwZWNpYWxseSBpbiBuZ2NjXG4gICAgICBpZiAobm9kZS50eXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdGVkVHlwZSA9IHRoaXMudmlzaXRUeXBlKG5vZGUudHlwZSwgY29udGV4dCk7XG4gICAgICAgIGlmICghKGV2YWx1YXRlZFR5cGUgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIGV2YWx1YXRlZFR5cGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldFJlZmVyZW5jZShub2RlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHZpc2l0RW51bURlY2xhcmF0aW9uKG5vZGU6IHRzLkVudW1EZWNsYXJhdGlvbiwgY29udGV4dDogQ29udGV4dCk6IFJlc29sdmVkVmFsdWUge1xuICAgIGNvbnN0IGVudW1SZWYgPSB0aGlzLmdldFJlZmVyZW5jZShub2RlLCBjb250ZXh0KTtcbiAgICBjb25zdCBtYXAgPSBuZXcgTWFwPHN0cmluZywgRW51bVZhbHVlPigpO1xuICAgIG5vZGUubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5zdHJpbmdOYW1lRnJvbVByb3BlcnR5TmFtZShtZW1iZXIubmFtZSwgY29udGV4dCk7XG4gICAgICBpZiAobmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkID0gbWVtYmVyLmluaXRpYWxpemVyICYmIHRoaXMudmlzaXQobWVtYmVyLmluaXRpYWxpemVyLCBjb250ZXh0KTtcbiAgICAgICAgbWFwLnNldChuYW1lLCBuZXcgRW51bVZhbHVlKGVudW1SZWYsIG5hbWUsIHJlc29sdmVkKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihub2RlOiB0cy5FbGVtZW50QWNjZXNzRXhwcmVzc2lvbiwgY29udGV4dDogQ29udGV4dCk6XG4gICAgICBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCBsaHMgPSB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24sIGNvbnRleHQpO1xuICAgIGlmIChsaHMgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNJbnB1dChub2RlLCBsaHMpO1xuICAgIH1cbiAgICBjb25zdCByaHMgPSB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLmFyZ3VtZW50RXhwcmVzc2lvbiwgY29udGV4dCk7XG4gICAgaWYgKHJocyBpbnN0YW5jZW9mIER5bmFtaWNWYWx1ZSkge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KG5vZGUsIHJocyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcmhzICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgcmhzICE9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tSW52YWxpZEV4cHJlc3Npb25UeXBlKG5vZGUsIHJocyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYWNjZXNzSGVscGVyKG5vZGUsIGxocywgcmhzLCBjb250ZXh0KTtcbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZTogdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uLCBjb250ZXh0OiBDb250ZXh0KTpcbiAgICAgIFJlc29sdmVkVmFsdWUge1xuICAgIGNvbnN0IGxocyA9IHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbiwgY29udGV4dCk7XG4gICAgY29uc3QgcmhzID0gbm9kZS5uYW1lLnRleHQ7XG4gICAgLy8gVE9ETzogaGFuZGxlIHJlZmVyZW5jZSB0byBjbGFzcyBkZWNsYXJhdGlvbi5cbiAgICBpZiAobGhzIGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQobm9kZSwgbGhzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYWNjZXNzSGVscGVyKG5vZGUsIGxocywgcmhzLCBjb250ZXh0KTtcbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRTb3VyY2VGaWxlKG5vZGU6IHRzLlNvdXJjZUZpbGUsIGNvbnRleHQ6IENvbnRleHQpOiBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCBkZWNsYXJhdGlvbnMgPSB0aGlzLmhvc3QuZ2V0RXhwb3J0c09mTW9kdWxlKG5vZGUpO1xuICAgIGlmIChkZWNsYXJhdGlvbnMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbVVua25vd24obm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNvbHZlZE1vZHVsZShkZWNsYXJhdGlvbnMsIGRlY2wgPT4ge1xuICAgICAgaWYgKGRlY2wua25vd24gIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVLbm93bkRlY2xhcmF0aW9uKGRlY2wua25vd24pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkZWNsQ29udGV4dCA9IHtcbiAgICAgICAgLi4uY29udGV4dCxcbiAgICAgICAgLi4uam9pbk1vZHVsZUNvbnRleHQoY29udGV4dCwgbm9kZSwgZGVjbCksXG4gICAgICB9O1xuXG4gICAgICAvLyBWaXNpdCBib3RoIGNvbmNyZXRlIGFuZCBpbmxpbmUgZGVjbGFyYXRpb25zLlxuICAgICAgcmV0dXJuIHRoaXMudmlzaXRBbWJpZ3VvdXNEZWNsYXJhdGlvbihkZWNsLCBkZWNsQ29udGV4dCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0QW1iaWd1b3VzRGVjbGFyYXRpb24oZGVjbDogRGVjbGFyYXRpb24sIGRlY2xDb250ZXh0OiBDb250ZXh0KSB7XG4gICAgcmV0dXJuIGRlY2wua2luZCA9PT0gRGVjbGFyYXRpb25LaW5kLklubGluZSAmJiBkZWNsLmltcGxlbWVudGF0aW9uICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICFpc0RlY2xhcmF0aW9uKGRlY2wuaW1wbGVtZW50YXRpb24pID9cbiAgICAgICAgLy8gSW5saW5lIGRlY2xhcmF0aW9ucyB3aG9zZSBgaW1wbGVtZW50YXRpb25gIGlzIGEgYHRzLkV4cHJlc3Npb25gIHNob3VsZCBiZSB2aXNpdGVkIGFzXG4gICAgICAgIC8vIGFuIGV4cHJlc3Npb24uXG4gICAgICAgIHRoaXMudmlzaXRFeHByZXNzaW9uKGRlY2wuaW1wbGVtZW50YXRpb24sIGRlY2xDb250ZXh0KSA6XG4gICAgICAgIC8vIE90aGVyd2lzZSBqdXN0IHZpc2l0IHRoZSBgbm9kZWAgYXMgYSBkZWNsYXJhdGlvbi5cbiAgICAgICAgdGhpcy52aXNpdERlY2xhcmF0aW9uKGRlY2wubm9kZSwgZGVjbENvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhY2Nlc3NIZWxwZXIobm9kZTogdHMuTm9kZSwgbGhzOiBSZXNvbHZlZFZhbHVlLCByaHM6IHN0cmluZ3xudW1iZXIsIGNvbnRleHQ6IENvbnRleHQpOlxuICAgICAgUmVzb2x2ZWRWYWx1ZSB7XG4gICAgY29uc3Qgc3RySW5kZXggPSBgJHtyaHN9YDtcbiAgICBpZiAobGhzIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICBpZiAobGhzLmhhcyhzdHJJbmRleCkpIHtcbiAgICAgICAgcmV0dXJuIGxocy5nZXQoc3RySW5kZXgpITtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChsaHMgaW5zdGFuY2VvZiBSZXNvbHZlZE1vZHVsZSkge1xuICAgICAgcmV0dXJuIGxocy5nZXRFeHBvcnQoc3RySW5kZXgpO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShsaHMpKSB7XG4gICAgICBpZiAocmhzID09PSAnbGVuZ3RoJykge1xuICAgICAgICByZXR1cm4gbGhzLmxlbmd0aDtcbiAgICAgIH0gZWxzZSBpZiAocmhzID09PSAnc2xpY2UnKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlTbGljZUJ1aWx0aW5GbihsaHMpO1xuICAgICAgfSBlbHNlIGlmIChyaHMgPT09ICdjb25jYXQnKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlDb25jYXRCdWlsdGluRm4obGhzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcmhzICE9PSAnbnVtYmVyJyB8fCAhTnVtYmVyLmlzSW50ZWdlcihyaHMpKSB7XG4gICAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUludmFsaWRFeHByZXNzaW9uVHlwZShub2RlLCByaHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxoc1tyaHNdO1xuICAgIH0gZWxzZSBpZiAobGhzIGluc3RhbmNlb2YgUmVmZXJlbmNlKSB7XG4gICAgICBjb25zdCByZWYgPSBsaHMubm9kZTtcbiAgICAgIGlmICh0aGlzLmhvc3QuaXNDbGFzcyhyZWYpKSB7XG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IG93bmluZ01vZHVsZShjb250ZXh0LCBsaHMuYmVzdEd1ZXNzT3duaW5nTW9kdWxlKTtcbiAgICAgICAgbGV0IHZhbHVlOiBSZXNvbHZlZFZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBtZW1iZXIgPSB0aGlzLmhvc3QuZ2V0TWVtYmVyc09mQ2xhc3MocmVmKS5maW5kKFxuICAgICAgICAgICAgbWVtYmVyID0+IG1lbWJlci5pc1N0YXRpYyAmJiBtZW1iZXIubmFtZSA9PT0gc3RySW5kZXgpO1xuICAgICAgICBpZiAobWVtYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAobWVtYmVyLnZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMudmlzaXRFeHByZXNzaW9uKG1lbWJlci52YWx1ZSwgY29udGV4dCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZW1iZXIuaW1wbGVtZW50YXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbmV3IFJlZmVyZW5jZShtZW1iZXIuaW1wbGVtZW50YXRpb24sIG1vZHVsZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZW1iZXIubm9kZSkge1xuICAgICAgICAgICAgdmFsdWUgPSBuZXcgUmVmZXJlbmNlKG1lbWJlci5ub2RlLCBtb2R1bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKGlzRGVjbGFyYXRpb24ocmVmKSkge1xuICAgICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQoXG4gICAgICAgICAgICBub2RlLCBEeW5hbWljVmFsdWUuZnJvbUV4dGVybmFsUmVmZXJlbmNlKHJlZiwgbGhzIGFzIFJlZmVyZW5jZTx0cy5EZWNsYXJhdGlvbj4pKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGxocyBpbnN0YW5jZW9mIER5bmFtaWNWYWx1ZSkge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KG5vZGUsIGxocyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tVW5rbm93bihub2RlKTtcbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRDYWxsRXhwcmVzc2lvbihub2RlOiB0cy5DYWxsRXhwcmVzc2lvbiwgY29udGV4dDogQ29udGV4dCk6IFJlc29sdmVkVmFsdWUge1xuICAgIGNvbnN0IGxocyA9IHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbiwgY29udGV4dCk7XG4gICAgaWYgKGxocyBpbnN0YW5jZW9mIER5bmFtaWNWYWx1ZSkge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KG5vZGUsIGxocyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGNhbGwgcmVmZXJzIHRvIGEgYnVpbHRpbiBmdW5jdGlvbiwgYXR0ZW1wdCB0byBldmFsdWF0ZSB0aGUgZnVuY3Rpb24uXG4gICAgaWYgKGxocyBpbnN0YW5jZW9mIEtub3duRm4pIHtcbiAgICAgIHJldHVybiBsaHMuZXZhbHVhdGUobm9kZSwgdGhpcy5ldmFsdWF0ZUZ1bmN0aW9uQXJndW1lbnRzKG5vZGUsIGNvbnRleHQpKTtcbiAgICB9XG5cbiAgICBpZiAoIShsaHMgaW5zdGFuY2VvZiBSZWZlcmVuY2UpKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21JbnZhbGlkRXhwcmVzc2lvblR5cGUobm9kZS5leHByZXNzaW9uLCBsaHMpO1xuICAgIH1cblxuICAgIGNvbnN0IGZuID0gdGhpcy5ob3N0LmdldERlZmluaXRpb25PZkZ1bmN0aW9uKGxocy5ub2RlKTtcbiAgICBpZiAoZm4gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUludmFsaWRFeHByZXNzaW9uVHlwZShub2RlLmV4cHJlc3Npb24sIGxocyk7XG4gICAgfVxuXG4gICAgaWYgKCFpc0Z1bmN0aW9uT3JNZXRob2RSZWZlcmVuY2UobGhzKSkge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tSW52YWxpZEV4cHJlc3Npb25UeXBlKG5vZGUuZXhwcmVzc2lvbiwgbGhzKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgZnVuY3Rpb24gaXMgZm9yZWlnbiAoZGVjbGFyZWQgdGhyb3VnaCBhIGQudHMgZmlsZSksIGF0dGVtcHQgdG8gcmVzb2x2ZSBpdCB3aXRoIHRoZVxuICAgIC8vIGZvcmVpZ25GdW5jdGlvblJlc29sdmVyLCBpZiBvbmUgaXMgc3BlY2lmaWVkLlxuICAgIGlmIChmbi5ib2R5ID09PSBudWxsKSB7XG4gICAgICBsZXQgZXhwcjogdHMuRXhwcmVzc2lvbnxudWxsID0gbnVsbDtcbiAgICAgIGlmIChjb250ZXh0LmZvcmVpZ25GdW5jdGlvblJlc29sdmVyKSB7XG4gICAgICAgIGV4cHIgPSBjb250ZXh0LmZvcmVpZ25GdW5jdGlvblJlc29sdmVyKGxocywgbm9kZS5hcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKGV4cHIgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KFxuICAgICAgICAgICAgbm9kZSwgRHluYW1pY1ZhbHVlLmZyb21FeHRlcm5hbFJlZmVyZW5jZShub2RlLmV4cHJlc3Npb24sIGxocykpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgZm9yZWlnbiBleHByZXNzaW9uIG9jY3VycyBpbiBhIGRpZmZlcmVudCBmaWxlLCB0aGVuIGFzc3VtZSB0aGF0IHRoZSBvd25pbmcgbW9kdWxlXG4gICAgICAvLyBvZiB0aGUgY2FsbCBleHByZXNzaW9uIHNob3VsZCBhbHNvIGJlIHVzZWQgZm9yIHRoZSByZXNvbHZlZCBmb3JlaWduIGV4cHJlc3Npb24uXG4gICAgICBpZiAoZXhwci5nZXRTb3VyY2VGaWxlKCkgIT09IG5vZGUuZXhwcmVzc2lvbi5nZXRTb3VyY2VGaWxlKCkgJiZcbiAgICAgICAgICBsaHMuYmVzdEd1ZXNzT3duaW5nTW9kdWxlICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSB7XG4gICAgICAgICAgLi4uY29udGV4dCxcbiAgICAgICAgICBhYnNvbHV0ZU1vZHVsZU5hbWU6IGxocy5iZXN0R3Vlc3NPd25pbmdNb2R1bGUuc3BlY2lmaWVyLFxuICAgICAgICAgIHJlc29sdXRpb25Db250ZXh0OiBsaHMuYmVzdEd1ZXNzT3duaW5nTW9kdWxlLnJlc29sdXRpb25Db250ZXh0LFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy52aXNpdEZmckV4cHJlc3Npb24oZXhwciwgY29udGV4dCk7XG4gICAgfVxuXG4gICAgbGV0IHJlczogUmVzb2x2ZWRWYWx1ZSA9IHRoaXMudmlzaXRGdW5jdGlvbkJvZHkobm9kZSwgZm4sIGNvbnRleHQpO1xuXG4gICAgLy8gSWYgdGhlIHJlc3VsdCBvZiBhdHRlbXB0aW5nIHRvIHJlc29sdmUgdGhlIGZ1bmN0aW9uIGJvZHkgd2FzIGEgRHluYW1pY1ZhbHVlLCBhdHRlbXB0IHRvIHVzZVxuICAgIC8vIHRoZSBmb3JlaWduRnVuY3Rpb25SZXNvbHZlciBpZiBvbmUgaXMgcHJlc2VudC4gVGhpcyBjb3VsZCBzdGlsbCBwb3RlbnRpYWxseSB5aWVsZCBhIHVzYWJsZVxuICAgIC8vIHZhbHVlLlxuICAgIGlmIChyZXMgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUgJiYgY29udGV4dC5mb3JlaWduRnVuY3Rpb25SZXNvbHZlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBmZnJFeHByID0gY29udGV4dC5mb3JlaWduRnVuY3Rpb25SZXNvbHZlcihsaHMsIG5vZGUuYXJndW1lbnRzKTtcbiAgICAgIGlmIChmZnJFeHByICE9PSBudWxsKSB7XG4gICAgICAgIC8vIFRoZSBmb3JlaWduIGZ1bmN0aW9uIHJlc29sdmVyIHdhcyBhYmxlIHRvIGV4dHJhY3QgYW4gZXhwcmVzc2lvbiBmcm9tIHRoaXMgZnVuY3Rpb24uIFNlZVxuICAgICAgICAvLyBpZiB0aGF0IGV4cHJlc3Npb24gbGVhZHMgdG8gYSBub24tZHluYW1pYyByZXN1bHQuXG4gICAgICAgIGNvbnN0IGZmclJlcyA9IHRoaXMudmlzaXRGZnJFeHByZXNzaW9uKGZmckV4cHIsIGNvbnRleHQpO1xuICAgICAgICBpZiAoIShmZnJSZXMgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpKSB7XG4gICAgICAgICAgLy8gRkZSIHlpZWxkZWQgYW4gYWN0dWFsIHJlc3VsdCB0aGF0J3Mgbm90IGR5bmFtaWMsIHNvIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsXG4gICAgICAgICAgLy8gcmVzb2x1dGlvbi5cbiAgICAgICAgICByZXMgPSBmZnJSZXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFZpc2l0IGFuIGV4cHJlc3Npb24gd2hpY2ggd2FzIGV4dHJhY3RlZCBmcm9tIGEgZm9yZWlnbi1mdW5jdGlvbiByZXNvbHZlci5cbiAgICpcbiAgICogVGhpcyB3aWxsIHByb2Nlc3MgdGhlIHJlc3VsdCBhbmQgZW5zdXJlIGl0J3MgY29ycmVjdCBmb3IgRkZSLXJlc29sdmVkIHZhbHVlcywgaW5jbHVkaW5nIG1hcmtpbmdcbiAgICogYFJlZmVyZW5jZWBzIGFzIHN5bnRoZXRpYy5cbiAgICovXG4gIHByaXZhdGUgdmlzaXRGZnJFeHByZXNzaW9uKGV4cHI6IHRzLkV4cHJlc3Npb24sIGNvbnRleHQ6IENvbnRleHQpOiBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCByZXMgPSB0aGlzLnZpc2l0RXhwcmVzc2lvbihleHByLCBjb250ZXh0KTtcbiAgICBpZiAocmVzIGluc3RhbmNlb2YgUmVmZXJlbmNlKSB7XG4gICAgICAvLyBUaGlzIFJlZmVyZW5jZSB3YXMgY3JlYXRlZCBzeW50aGV0aWNhbGx5LCB2aWEgYSBmb3JlaWduIGZ1bmN0aW9uIHJlc29sdmVyLiBUaGUgcmVhbFxuICAgICAgLy8gcnVudGltZSB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gZXhwcmVzc2lvbiBtYXkgYmUgZGlmZmVyZW50IHRoYW4gdGhlIGZvcmVpZ24gZnVuY3Rpb25cbiAgICAgIC8vIHJlc29sdmVkIHZhbHVlLCBzbyBtYXJrIHRoZSBSZWZlcmVuY2UgYXMgc3ludGhldGljIHRvIGF2b2lkIGl0IGJlaW5nIG1pc2ludGVycHJldGVkLlxuICAgICAgcmVzLnN5bnRoZXRpYyA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0RnVuY3Rpb25Cb2R5KG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uLCBmbjogRnVuY3Rpb25EZWZpbml0aW9uLCBjb250ZXh0OiBDb250ZXh0KTpcbiAgICAgIFJlc29sdmVkVmFsdWUge1xuICAgIGlmIChmbi5ib2R5ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21Vbmtub3duKG5vZGUpO1xuICAgIH0gZWxzZSBpZiAoZm4uYm9keS5sZW5ndGggIT09IDEgfHwgIXRzLmlzUmV0dXJuU3RhdGVtZW50KGZuLmJvZHlbMF0pKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21Db21wbGV4RnVuY3Rpb25DYWxsKG5vZGUsIGZuKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gZm4uYm9keVswXSBhcyB0cy5SZXR1cm5TdGF0ZW1lbnQ7XG5cbiAgICBjb25zdCBhcmdzID0gdGhpcy5ldmFsdWF0ZUZ1bmN0aW9uQXJndW1lbnRzKG5vZGUsIGNvbnRleHQpO1xuICAgIGNvbnN0IG5ld1Njb3BlOiBTY29wZSA9IG5ldyBNYXA8dHMuUGFyYW1ldGVyRGVjbGFyYXRpb24sIFJlc29sdmVkVmFsdWU+KCk7XG4gICAgY29uc3QgY2FsbGVlQ29udGV4dCA9IHsuLi5jb250ZXh0LCBzY29wZTogbmV3U2NvcGV9O1xuICAgIGZuLnBhcmFtZXRlcnMuZm9yRWFjaCgocGFyYW0sIGluZGV4KSA9PiB7XG4gICAgICBsZXQgYXJnID0gYXJnc1tpbmRleF07XG4gICAgICBpZiAocGFyYW0ubm9kZS5kb3REb3REb3RUb2tlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFyZyA9IGFyZ3Muc2xpY2UoaW5kZXgpO1xuICAgICAgfVxuICAgICAgaWYgKGFyZyA9PT0gdW5kZWZpbmVkICYmIHBhcmFtLmluaXRpYWxpemVyICE9PSBudWxsKSB7XG4gICAgICAgIGFyZyA9IHRoaXMudmlzaXRFeHByZXNzaW9uKHBhcmFtLmluaXRpYWxpemVyLCBjYWxsZWVDb250ZXh0KTtcbiAgICAgIH1cbiAgICAgIG5ld1Njb3BlLnNldChwYXJhbS5ub2RlLCBhcmcpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJldC5leHByZXNzaW9uICE9PSB1bmRlZmluZWQgPyB0aGlzLnZpc2l0RXhwcmVzc2lvbihyZXQuZXhwcmVzc2lvbiwgY2FsbGVlQ29udGV4dCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdENvbmRpdGlvbmFsRXhwcmVzc2lvbihub2RlOiB0cy5Db25kaXRpb25hbEV4cHJlc3Npb24sIGNvbnRleHQ6IENvbnRleHQpOlxuICAgICAgUmVzb2x2ZWRWYWx1ZSB7XG4gICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy52aXNpdEV4cHJlc3Npb24obm9kZS5jb25kaXRpb24sIGNvbnRleHQpO1xuICAgIGlmIChjb25kaXRpb24gaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNJbnB1dChub2RlLCBjb25kaXRpb24pO1xuICAgIH1cblxuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLndoZW5UcnVlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUud2hlbkZhbHNlLCBjb250ZXh0KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHZpc2l0UHJlZml4VW5hcnlFeHByZXNzaW9uKG5vZGU6IHRzLlByZWZpeFVuYXJ5RXhwcmVzc2lvbiwgY29udGV4dDogQ29udGV4dCk6XG4gICAgICBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCBvcGVyYXRvcktpbmQgPSBub2RlLm9wZXJhdG9yO1xuICAgIGlmICghVU5BUllfT1BFUkFUT1JTLmhhcyhvcGVyYXRvcktpbmQpKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21VbnN1cHBvcnRlZFN5bnRheChub2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcCA9IFVOQVJZX09QRVJBVE9SUy5nZXQob3BlcmF0b3JLaW5kKSE7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLm9wZXJhbmQsIGNvbnRleHQpO1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIER5bmFtaWNWYWx1ZSkge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KG5vZGUsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHZpc2l0QmluYXJ5RXhwcmVzc2lvbihub2RlOiB0cy5CaW5hcnlFeHByZXNzaW9uLCBjb250ZXh0OiBDb250ZXh0KTogUmVzb2x2ZWRWYWx1ZSB7XG4gICAgY29uc3QgdG9rZW5LaW5kID0gbm9kZS5vcGVyYXRvclRva2VuLmtpbmQ7XG4gICAgaWYgKCFCSU5BUllfT1BFUkFUT1JTLmhhcyh0b2tlbktpbmQpKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21VbnN1cHBvcnRlZFN5bnRheChub2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcFJlY29yZCA9IEJJTkFSWV9PUEVSQVRPUlMuZ2V0KHRva2VuS2luZCkhO1xuICAgIGxldCBsaHM6IFJlc29sdmVkVmFsdWUsIHJoczogUmVzb2x2ZWRWYWx1ZTtcbiAgICBpZiAob3BSZWNvcmQubGl0ZXJhbCkge1xuICAgICAgbGhzID0gbGl0ZXJhbChcbiAgICAgICAgICB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLmxlZnQsIGNvbnRleHQpLFxuICAgICAgICAgIHZhbHVlID0+IER5bmFtaWNWYWx1ZS5mcm9tSW52YWxpZEV4cHJlc3Npb25UeXBlKG5vZGUubGVmdCwgdmFsdWUpKTtcbiAgICAgIHJocyA9IGxpdGVyYWwoXG4gICAgICAgICAgdGhpcy52aXNpdEV4cHJlc3Npb24obm9kZS5yaWdodCwgY29udGV4dCksXG4gICAgICAgICAgdmFsdWUgPT4gRHluYW1pY1ZhbHVlLmZyb21JbnZhbGlkRXhwcmVzc2lvblR5cGUobm9kZS5yaWdodCwgdmFsdWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGhzID0gdGhpcy52aXNpdEV4cHJlc3Npb24obm9kZS5sZWZ0LCBjb250ZXh0KTtcbiAgICAgIHJocyA9IHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUucmlnaHQsIGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAobGhzIGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICByZXR1cm4gRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQobm9kZSwgbGhzKTtcbiAgICB9IGVsc2UgaWYgKHJocyBpbnN0YW5jZW9mIER5bmFtaWNWYWx1ZSkge1xuICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tRHluYW1pY0lucHV0KG5vZGUsIHJocyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcFJlY29yZC5vcChsaHMsIHJocyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGU6IHRzLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uLCBjb250ZXh0OiBDb250ZXh0KTpcbiAgICAgIFJlc29sdmVkVmFsdWUge1xuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24sIGNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZUZ1bmN0aW9uQXJndW1lbnRzKG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uLCBjb250ZXh0OiBDb250ZXh0KTogUmVzb2x2ZWRWYWx1ZUFycmF5IHtcbiAgICBjb25zdCBhcmdzOiBSZXNvbHZlZFZhbHVlQXJyYXkgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBub2RlLmFyZ3VtZW50cykge1xuICAgICAgaWYgKHRzLmlzU3ByZWFkRWxlbWVudChhcmcpKSB7XG4gICAgICAgIGFyZ3MucHVzaCguLi50aGlzLnZpc2l0U3ByZWFkRWxlbWVudChhcmcsIGNvbnRleHQpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyZ3MucHVzaCh0aGlzLnZpc2l0RXhwcmVzc2lvbihhcmcsIGNvbnRleHQpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFyZ3M7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0U3ByZWFkRWxlbWVudChub2RlOiB0cy5TcHJlYWRFbGVtZW50LCBjb250ZXh0OiBDb250ZXh0KTogUmVzb2x2ZWRWYWx1ZUFycmF5IHtcbiAgICBjb25zdCBzcHJlYWQgPSB0aGlzLnZpc2l0RXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24sIGNvbnRleHQpO1xuICAgIGlmIChzcHJlYWQgaW5zdGFuY2VvZiBEeW5hbWljVmFsdWUpIHtcbiAgICAgIHJldHVybiBbRHluYW1pY1ZhbHVlLmZyb21EeW5hbWljSW5wdXQobm9kZSwgc3ByZWFkKV07XG4gICAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShzcHJlYWQpKSB7XG4gICAgICByZXR1cm4gW0R5bmFtaWNWYWx1ZS5mcm9tSW52YWxpZEV4cHJlc3Npb25UeXBlKG5vZGUsIHNwcmVhZCldO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3ByZWFkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRCaW5kaW5nRWxlbWVudChub2RlOiB0cy5CaW5kaW5nRWxlbWVudCwgY29udGV4dDogQ29udGV4dCk6IFJlc29sdmVkVmFsdWUge1xuICAgIGNvbnN0IHBhdGg6IHRzLkJpbmRpbmdFbGVtZW50W10gPSBbXTtcbiAgICBsZXQgY2xvc2VzdERlY2xhcmF0aW9uOiB0cy5Ob2RlID0gbm9kZTtcblxuICAgIHdoaWxlICh0cy5pc0JpbmRpbmdFbGVtZW50KGNsb3Nlc3REZWNsYXJhdGlvbikgfHxcbiAgICAgICAgICAgdHMuaXNBcnJheUJpbmRpbmdQYXR0ZXJuKGNsb3Nlc3REZWNsYXJhdGlvbikgfHxcbiAgICAgICAgICAgdHMuaXNPYmplY3RCaW5kaW5nUGF0dGVybihjbG9zZXN0RGVjbGFyYXRpb24pKSB7XG4gICAgICBpZiAodHMuaXNCaW5kaW5nRWxlbWVudChjbG9zZXN0RGVjbGFyYXRpb24pKSB7XG4gICAgICAgIHBhdGgudW5zaGlmdChjbG9zZXN0RGVjbGFyYXRpb24pO1xuICAgICAgfVxuXG4gICAgICBjbG9zZXN0RGVjbGFyYXRpb24gPSBjbG9zZXN0RGVjbGFyYXRpb24ucGFyZW50O1xuICAgIH1cblxuICAgIGlmICghdHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKGNsb3Nlc3REZWNsYXJhdGlvbikgfHxcbiAgICAgICAgY2xvc2VzdERlY2xhcmF0aW9uLmluaXRpYWxpemVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbVVua25vd24obm9kZSk7XG4gICAgfVxuXG4gICAgbGV0IHZhbHVlID0gdGhpcy52aXNpdChjbG9zZXN0RGVjbGFyYXRpb24uaW5pdGlhbGl6ZXIsIGNvbnRleHQpO1xuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBwYXRoKSB7XG4gICAgICBsZXQga2V5OiBudW1iZXJ8c3RyaW5nO1xuICAgICAgaWYgKHRzLmlzQXJyYXlCaW5kaW5nUGF0dGVybihlbGVtZW50LnBhcmVudCkpIHtcbiAgICAgICAga2V5ID0gZWxlbWVudC5wYXJlbnQuZWxlbWVudHMuaW5kZXhPZihlbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBlbGVtZW50LnByb3BlcnR5TmFtZSB8fCBlbGVtZW50Lm5hbWU7XG4gICAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIobmFtZSkpIHtcbiAgICAgICAgICBrZXkgPSBuYW1lLnRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIER5bmFtaWNWYWx1ZS5mcm9tVW5rbm93bihlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFsdWUgPSB0aGlzLmFjY2Vzc0hlbHBlcihlbGVtZW50LCB2YWx1ZSwga2V5LCBjb250ZXh0KTtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIER5bmFtaWNWYWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmdOYW1lRnJvbVByb3BlcnR5TmFtZShub2RlOiB0cy5Qcm9wZXJ0eU5hbWUsIGNvbnRleHQ6IENvbnRleHQpOiBzdHJpbmd8dW5kZWZpbmVkIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpIHx8IHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlKSB8fCB0cy5pc051bWVyaWNMaXRlcmFsKG5vZGUpKSB7XG4gICAgICByZXR1cm4gbm9kZS50ZXh0O1xuICAgIH0gZWxzZSBpZiAodHMuaXNDb21wdXRlZFByb3BlcnR5TmFtZShub2RlKSkge1xuICAgICAgY29uc3QgbGl0ZXJhbCA9IHRoaXMudmlzaXRFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbiwgY29udGV4dCk7XG4gICAgICByZXR1cm4gdHlwZW9mIGxpdGVyYWwgPT09ICdzdHJpbmcnID8gbGl0ZXJhbCA6IHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFJlc29sdmVkRW51bShub2RlOiB0cy5EZWNsYXJhdGlvbiwgZW51bU1lbWJlcnM6IEVudW1NZW1iZXJbXSwgY29udGV4dDogQ29udGV4dCk6XG4gICAgICBSZXNvbHZlZFZhbHVlIHtcbiAgICBjb25zdCBlbnVtUmVmID0gdGhpcy5nZXRSZWZlcmVuY2Uobm9kZSwgY29udGV4dCk7XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcDxzdHJpbmcsIEVudW1WYWx1ZT4oKTtcbiAgICBlbnVtTWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5zdHJpbmdOYW1lRnJvbVByb3BlcnR5TmFtZShtZW1iZXIubmFtZSwgY29udGV4dCk7XG4gICAgICBpZiAobmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkID0gdGhpcy52aXNpdChtZW1iZXIuaW5pdGlhbGl6ZXIsIGNvbnRleHQpO1xuICAgICAgICBtYXAuc2V0KG5hbWUsIG5ldyBFbnVtVmFsdWUoZW51bVJlZiwgbmFtZSwgcmVzb2x2ZWQpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZWZlcmVuY2U8VCBleHRlbmRzIERlY2xhcmF0aW9uTm9kZT4obm9kZTogVCwgY29udGV4dDogQ29udGV4dCk6IFJlZmVyZW5jZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBSZWZlcmVuY2Uobm9kZSwgb3duaW5nTW9kdWxlKGNvbnRleHQpKTtcbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRUeXBlKG5vZGU6IHRzLlR5cGVOb2RlLCBjb250ZXh0OiBDb250ZXh0KTogUmVzb2x2ZWRWYWx1ZSB7XG4gICAgaWYgKHRzLmlzTGl0ZXJhbFR5cGVOb2RlKG5vZGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb24obm9kZS5saXRlcmFsLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzVHVwbGVUeXBlTm9kZShub2RlKSkge1xuICAgICAgcmV0dXJuIHRoaXMudmlzaXRUdXBsZVR5cGUobm9kZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmICh0cy5pc05hbWVkVHVwbGVNZW1iZXIobm9kZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnZpc2l0VHlwZShub2RlLnR5cGUsIGNvbnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiBEeW5hbWljVmFsdWUuZnJvbUR5bmFtaWNUeXBlKG5vZGUpO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdFR1cGxlVHlwZShub2RlOiB0cy5UdXBsZVR5cGVOb2RlLCBjb250ZXh0OiBDb250ZXh0KTogUmVzb2x2ZWRWYWx1ZUFycmF5IHtcbiAgICBjb25zdCByZXM6IFJlc29sdmVkVmFsdWVBcnJheSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBlbGVtIG9mIG5vZGUuZWxlbWVudHMpIHtcbiAgICAgIHJlcy5wdXNoKHRoaXMudmlzaXRUeXBlKGVsZW0sIGNvbnRleHQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb25Pck1ldGhvZFJlZmVyZW5jZShyZWY6IFJlZmVyZW5jZTx0cy5Ob2RlPik6XG4gICAgcmVmIGlzIFJlZmVyZW5jZTx0cy5GdW5jdGlvbkRlY2xhcmF0aW9ufHRzLk1ldGhvZERlY2xhcmF0aW9ufHRzLkZ1bmN0aW9uRXhwcmVzc2lvbj4ge1xuICByZXR1cm4gdHMuaXNGdW5jdGlvbkRlY2xhcmF0aW9uKHJlZi5ub2RlKSB8fCB0cy5pc01ldGhvZERlY2xhcmF0aW9uKHJlZi5ub2RlKSB8fFxuICAgICAgdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24ocmVmLm5vZGUpO1xufVxuXG5mdW5jdGlvbiBsaXRlcmFsKFxuICAgIHZhbHVlOiBSZXNvbHZlZFZhbHVlLCByZWplY3Q6ICh2YWx1ZTogUmVzb2x2ZWRWYWx1ZSkgPT4gUmVzb2x2ZWRWYWx1ZSk6IFJlc29sdmVkVmFsdWUge1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBFbnVtVmFsdWUpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnJlc29sdmVkO1xuICB9XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIER5bmFtaWNWYWx1ZSB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHJlamVjdCh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzVmFyaWFibGVEZWNsYXJhdGlvbkRlY2xhcmVkKG5vZGU6IHRzLlZhcmlhYmxlRGVjbGFyYXRpb24pOiBib29sZWFuIHtcbiAgaWYgKG5vZGUucGFyZW50ID09PSB1bmRlZmluZWQgfHwgIXRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbkxpc3Qobm9kZS5wYXJlbnQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGRlY2xMaXN0ID0gbm9kZS5wYXJlbnQ7XG4gIGlmIChkZWNsTGlzdC5wYXJlbnQgPT09IHVuZGVmaW5lZCB8fCAhdHMuaXNWYXJpYWJsZVN0YXRlbWVudChkZWNsTGlzdC5wYXJlbnQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHZhclN0bXQgPSBkZWNsTGlzdC5wYXJlbnQ7XG4gIHJldHVybiB2YXJTdG10Lm1vZGlmaWVycyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICB2YXJTdG10Lm1vZGlmaWVycy5zb21lKG1vZCA9PiBtb2Qua2luZCA9PT0gdHMuU3ludGF4S2luZC5EZWNsYXJlS2V5d29yZCk7XG59XG5cbmNvbnN0IEVNUFRZID0ge307XG5cbmZ1bmN0aW9uIGpvaW5Nb2R1bGVDb250ZXh0KGV4aXN0aW5nOiBDb250ZXh0LCBub2RlOiB0cy5Ob2RlLCBkZWNsOiBEZWNsYXJhdGlvbik6IHtcbiAgYWJzb2x1dGVNb2R1bGVOYW1lPzogc3RyaW5nLFxuICByZXNvbHV0aW9uQ29udGV4dD86IHN0cmluZyxcbn0ge1xuICBpZiAoZGVjbC52aWFNb2R1bGUgIT09IG51bGwgJiYgZGVjbC52aWFNb2R1bGUgIT09IGV4aXN0aW5nLmFic29sdXRlTW9kdWxlTmFtZSkge1xuICAgIHJldHVybiB7XG4gICAgICBhYnNvbHV0ZU1vZHVsZU5hbWU6IGRlY2wudmlhTW9kdWxlLFxuICAgICAgcmVzb2x1dGlvbkNvbnRleHQ6IG5vZGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEVNUFRZO1xuICB9XG59XG5cbmZ1bmN0aW9uIG93bmluZ01vZHVsZShjb250ZXh0OiBDb250ZXh0LCBvdmVycmlkZTogT3duaW5nTW9kdWxlfG51bGwgPSBudWxsKTogT3duaW5nTW9kdWxlfG51bGwge1xuICBsZXQgc3BlY2lmaWVyID0gY29udGV4dC5hYnNvbHV0ZU1vZHVsZU5hbWU7XG4gIGlmIChvdmVycmlkZSAhPT0gbnVsbCkge1xuICAgIHNwZWNpZmllciA9IG92ZXJyaWRlLnNwZWNpZmllcjtcbiAgfVxuICBpZiAoc3BlY2lmaWVyICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNwZWNpZmllcixcbiAgICAgIHJlc29sdXRpb25Db250ZXh0OiBjb250ZXh0LnJlc29sdXRpb25Db250ZXh0LFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==