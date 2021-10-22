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
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/template_symbol_builder", ["require", "exports", "tslib", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/src/ngtsc/typecheck/api", "@angular/compiler-cli/src/ngtsc/typecheck/src/comments", "@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SymbolBuilder = void 0;
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var api_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/api");
    var comments_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/comments");
    var ts_util_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util");
    /**
     * Generates and caches `Symbol`s for various template structures for a given component.
     *
     * The `SymbolBuilder` internally caches the `Symbol`s it creates, and must be destroyed and
     * replaced if the component's template changes.
     */
    var SymbolBuilder = /** @class */ (function () {
        function SymbolBuilder(shimPath, typeCheckBlock, templateData, componentScopeReader, 
        // The `ts.TypeChecker` depends on the current type-checking program, and so must be requested
        // on-demand instead of cached.
        getTypeChecker) {
            this.shimPath = shimPath;
            this.typeCheckBlock = typeCheckBlock;
            this.templateData = templateData;
            this.componentScopeReader = componentScopeReader;
            this.getTypeChecker = getTypeChecker;
            this.symbolCache = new Map();
        }
        SymbolBuilder.prototype.getSymbol = function (node) {
            if (this.symbolCache.has(node)) {
                return this.symbolCache.get(node);
            }
            var symbol = null;
            if (node instanceof compiler_1.TmplAstBoundAttribute || node instanceof compiler_1.TmplAstTextAttribute) {
                // TODO(atscott): input and output bindings only return the first directive match but should
                // return a list of bindings for all of them.
                symbol = this.getSymbolOfInputBinding(node);
            }
            else if (node instanceof compiler_1.TmplAstBoundEvent) {
                symbol = this.getSymbolOfBoundEvent(node);
            }
            else if (node instanceof compiler_1.TmplAstElement) {
                symbol = this.getSymbolOfElement(node);
            }
            else if (node instanceof compiler_1.TmplAstTemplate) {
                symbol = this.getSymbolOfAstTemplate(node);
            }
            else if (node instanceof compiler_1.TmplAstVariable) {
                symbol = this.getSymbolOfVariable(node);
            }
            else if (node instanceof compiler_1.TmplAstReference) {
                symbol = this.getSymbolOfReference(node);
            }
            else if (node instanceof compiler_1.BindingPipe) {
                symbol = this.getSymbolOfPipe(node);
            }
            else if (node instanceof compiler_1.AST) {
                symbol = this.getSymbolOfTemplateExpression(node);
            }
            else {
                // TODO(atscott): TmplAstContent, TmplAstIcu
            }
            this.symbolCache.set(node, symbol);
            return symbol;
        };
        SymbolBuilder.prototype.getSymbolOfAstTemplate = function (template) {
            var directives = this.getDirectivesOfNode(template);
            return { kind: api_1.SymbolKind.Template, directives: directives, templateNode: template };
        };
        SymbolBuilder.prototype.getSymbolOfElement = function (element) {
            var _a;
            var elementSourceSpan = (_a = element.startSourceSpan) !== null && _a !== void 0 ? _a : element.sourceSpan;
            var node = comments_1.findFirstMatchingNode(this.typeCheckBlock, { withSpan: elementSourceSpan, filter: ts.isVariableDeclaration });
            if (node === null) {
                return null;
            }
            var symbolFromDeclaration = this.getSymbolOfTsNode(node);
            if (symbolFromDeclaration === null || symbolFromDeclaration.tsSymbol === null) {
                return null;
            }
            var directives = this.getDirectivesOfNode(element);
            // All statements in the TCB are `Expression`s that optionally include more information.
            // An `ElementSymbol` uses the information returned for the variable declaration expression,
            // adds the directives for the element, and updates the `kind` to be `SymbolKind.Element`.
            return tslib_1.__assign(tslib_1.__assign({}, symbolFromDeclaration), { kind: api_1.SymbolKind.Element, directives: directives, templateNode: element });
        };
        SymbolBuilder.prototype.getDirectivesOfNode = function (element) {
            var _this = this;
            var _a;
            var elementSourceSpan = (_a = element.startSourceSpan) !== null && _a !== void 0 ? _a : element.sourceSpan;
            var tcbSourceFile = this.typeCheckBlock.getSourceFile();
            // directives could be either:
            // - var _t1: TestDir /*T:D*/ = (null!);
            // - var _t1 /*T:D*/ = _ctor1({});
            var isDirectiveDeclaration = function (node) {
                return (ts.isTypeNode(node) || ts.isIdentifier(node)) && ts.isVariableDeclaration(node.parent) &&
                    comments_1.hasExpressionIdentifier(tcbSourceFile, node, comments_1.ExpressionIdentifier.DIRECTIVE);
            };
            var nodes = comments_1.findAllMatchingNodes(this.typeCheckBlock, { withSpan: elementSourceSpan, filter: isDirectiveDeclaration });
            return nodes
                .map(function (node) {
                var _a;
                var symbol = _this.getSymbolOfTsNode(node.parent);
                if (symbol === null || !typescript_1.isSymbolWithValueDeclaration(symbol.tsSymbol) ||
                    !ts.isClassDeclaration(symbol.tsSymbol.valueDeclaration)) {
                    return null;
                }
                var meta = _this.getDirectiveMeta(element, symbol.tsSymbol.valueDeclaration);
                if (meta === null) {
                    return null;
                }
                var ngModule = _this.getDirectiveModule(symbol.tsSymbol.valueDeclaration);
                if (meta.selector === null) {
                    return null;
                }
                var isComponent = (_a = meta.isComponent) !== null && _a !== void 0 ? _a : null;
                var directiveSymbol = tslib_1.__assign(tslib_1.__assign({}, symbol), { tsSymbol: symbol.tsSymbol, selector: meta.selector, isComponent: isComponent, ngModule: ngModule, kind: api_1.SymbolKind.Directive, isStructural: meta.isStructural });
                return directiveSymbol;
            })
                .filter(function (d) { return d !== null; });
        };
        SymbolBuilder.prototype.getDirectiveMeta = function (host, directiveDeclaration) {
            var _a;
            var directives = this.templateData.boundTarget.getDirectivesOfNode(host);
            // `getDirectivesOfNode` will not return the directives intended for an element
            // on a microsyntax template, for example `<div *ngFor="let user of users;" dir>`,
            // the `dir` will be skipped, but it's needed in language service.
            var firstChild = host.children[0];
            if (firstChild instanceof compiler_1.TmplAstElement) {
                var isMicrosyntaxTemplate = host instanceof compiler_1.TmplAstTemplate &&
                    sourceSpanEqual(firstChild.sourceSpan, host.sourceSpan);
                if (isMicrosyntaxTemplate) {
                    var firstChildDirectives = this.templateData.boundTarget.getDirectivesOfNode(firstChild);
                    if (firstChildDirectives !== null && directives !== null) {
                        directives = directives.concat(firstChildDirectives);
                    }
                    else {
                        directives = directives !== null && directives !== void 0 ? directives : firstChildDirectives;
                    }
                }
            }
            if (directives === null) {
                return null;
            }
            return (_a = directives.find(function (m) { return m.ref.node === directiveDeclaration; })) !== null && _a !== void 0 ? _a : null;
        };
        SymbolBuilder.prototype.getDirectiveModule = function (declaration) {
            var scope = this.componentScopeReader.getScopeForComponent(declaration);
            if (scope === null) {
                return null;
            }
            return scope.ngModule;
        };
        SymbolBuilder.prototype.getSymbolOfBoundEvent = function (eventBinding) {
            var e_1, _a;
            var consumer = this.templateData.boundTarget.getConsumerOfBinding(eventBinding);
            if (consumer === null) {
                return null;
            }
            // Outputs in the TCB look like one of the two:
            // * _t1["outputField"].subscribe(handler);
            // * _t1.addEventListener(handler);
            // Even with strict null checks disabled, we still produce the access as a separate statement
            // so that it can be found here.
            var expectedAccess;
            if (consumer instanceof compiler_1.TmplAstTemplate || consumer instanceof compiler_1.TmplAstElement) {
                expectedAccess = 'addEventListener';
            }
            else {
                var bindingPropertyNames = consumer.outputs.getByBindingPropertyName(eventBinding.name);
                if (bindingPropertyNames === null || bindingPropertyNames.length === 0) {
                    return null;
                }
                // Note that we only get the expectedAccess text from a single consumer of the binding. If
                // there are multiple consumers (not supported in the `boundTarget` API) and one of them has
                // an alias, it will not get matched here.
                expectedAccess = bindingPropertyNames[0].classPropertyName;
            }
            function filter(n) {
                if (!ts_util_1.isAccessExpression(n)) {
                    return false;
                }
                if (ts.isPropertyAccessExpression(n)) {
                    return n.name.getText() === expectedAccess;
                }
                else {
                    return ts.isStringLiteral(n.argumentExpression) &&
                        n.argumentExpression.text === expectedAccess;
                }
            }
            var outputFieldAccesses = comments_1.findAllMatchingNodes(this.typeCheckBlock, { withSpan: eventBinding.keySpan, filter: filter });
            var bindings = [];
            try {
                for (var outputFieldAccesses_1 = tslib_1.__values(outputFieldAccesses), outputFieldAccesses_1_1 = outputFieldAccesses_1.next(); !outputFieldAccesses_1_1.done; outputFieldAccesses_1_1 = outputFieldAccesses_1.next()) {
                    var outputFieldAccess = outputFieldAccesses_1_1.value;
                    if (consumer instanceof compiler_1.TmplAstTemplate || consumer instanceof compiler_1.TmplAstElement) {
                        if (!ts.isPropertyAccessExpression(outputFieldAccess)) {
                            continue;
                        }
                        var addEventListener_1 = outputFieldAccess.name;
                        var tsSymbol = this.getTypeChecker().getSymbolAtLocation(addEventListener_1);
                        var tsType = this.getTypeChecker().getTypeAtLocation(addEventListener_1);
                        var positionInShimFile = this.getShimPositionForNode(addEventListener_1);
                        var target = this.getSymbol(consumer);
                        if (target === null || tsSymbol === undefined) {
                            continue;
                        }
                        bindings.push({
                            kind: api_1.SymbolKind.Binding,
                            tsSymbol: tsSymbol,
                            tsType: tsType,
                            target: target,
                            shimLocation: { shimPath: this.shimPath, positionInShimFile: positionInShimFile },
                        });
                    }
                    else {
                        if (!ts.isElementAccessExpression(outputFieldAccess)) {
                            continue;
                        }
                        var tsSymbol = this.getTypeChecker().getSymbolAtLocation(outputFieldAccess.argumentExpression);
                        if (tsSymbol === undefined) {
                            continue;
                        }
                        var target = this.getDirectiveSymbolForAccessExpression(outputFieldAccess, consumer);
                        if (target === null) {
                            continue;
                        }
                        var positionInShimFile = this.getShimPositionForNode(outputFieldAccess);
                        var tsType = this.getTypeChecker().getTypeAtLocation(outputFieldAccess);
                        bindings.push({
                            kind: api_1.SymbolKind.Binding,
                            tsSymbol: tsSymbol,
                            tsType: tsType,
                            target: target,
                            shimLocation: { shimPath: this.shimPath, positionInShimFile: positionInShimFile },
                        });
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (outputFieldAccesses_1_1 && !outputFieldAccesses_1_1.done && (_a = outputFieldAccesses_1.return)) _a.call(outputFieldAccesses_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (bindings.length === 0) {
                return null;
            }
            return { kind: api_1.SymbolKind.Output, bindings: bindings };
        };
        SymbolBuilder.prototype.getSymbolOfInputBinding = function (binding) {
            var e_2, _a;
            var consumer = this.templateData.boundTarget.getConsumerOfBinding(binding);
            if (consumer === null) {
                return null;
            }
            if (consumer instanceof compiler_1.TmplAstElement || consumer instanceof compiler_1.TmplAstTemplate) {
                var host = this.getSymbol(consumer);
                return host !== null ? { kind: api_1.SymbolKind.DomBinding, host: host } : null;
            }
            var nodes = comments_1.findAllMatchingNodes(this.typeCheckBlock, { withSpan: binding.sourceSpan, filter: typescript_1.isAssignment });
            var bindings = [];
            try {
                for (var nodes_1 = tslib_1.__values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                    var node = nodes_1_1.value;
                    if (!ts_util_1.isAccessExpression(node.left)) {
                        continue;
                    }
                    var symbolInfo = this.getSymbolOfTsNode(node.left);
                    if (symbolInfo === null || symbolInfo.tsSymbol === null) {
                        continue;
                    }
                    var target = this.getDirectiveSymbolForAccessExpression(node.left, consumer);
                    if (target === null) {
                        continue;
                    }
                    bindings.push(tslib_1.__assign(tslib_1.__assign({}, symbolInfo), { tsSymbol: symbolInfo.tsSymbol, kind: api_1.SymbolKind.Binding, target: target }));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (bindings.length === 0) {
                return null;
            }
            return { kind: api_1.SymbolKind.Input, bindings: bindings };
        };
        SymbolBuilder.prototype.getDirectiveSymbolForAccessExpression = function (node, _a) {
            var _b;
            var isComponent = _a.isComponent, selector = _a.selector, isStructural = _a.isStructural;
            // In either case, `_t1["index"]` or `_t1.index`, `node.expression` is _t1.
            // The retrieved symbol for _t1 will be the variable declaration.
            var tsSymbol = this.getTypeChecker().getSymbolAtLocation(node.expression);
            if ((tsSymbol === null || tsSymbol === void 0 ? void 0 : tsSymbol.declarations) === undefined || tsSymbol.declarations.length === 0 ||
                selector === null) {
                return null;
            }
            var _c = tslib_1.__read(tsSymbol.declarations, 1), declaration = _c[0];
            if (!ts.isVariableDeclaration(declaration) ||
                !comments_1.hasExpressionIdentifier(
                // The expression identifier could be on the type (for regular directives) or the name
                // (for generic directives and the ctor op).
                declaration.getSourceFile(), (_b = declaration.type) !== null && _b !== void 0 ? _b : declaration.name, comments_1.ExpressionIdentifier.DIRECTIVE)) {
                return null;
            }
            var symbol = this.getSymbolOfTsNode(declaration);
            if (symbol === null || !typescript_1.isSymbolWithValueDeclaration(symbol.tsSymbol) ||
                !ts.isClassDeclaration(symbol.tsSymbol.valueDeclaration)) {
                return null;
            }
            var ngModule = this.getDirectiveModule(symbol.tsSymbol.valueDeclaration);
            return {
                kind: api_1.SymbolKind.Directive,
                tsSymbol: symbol.tsSymbol,
                tsType: symbol.tsType,
                shimLocation: symbol.shimLocation,
                isComponent: isComponent,
                isStructural: isStructural,
                selector: selector,
                ngModule: ngModule,
            };
        };
        SymbolBuilder.prototype.getSymbolOfVariable = function (variable) {
            var node = comments_1.findFirstMatchingNode(this.typeCheckBlock, { withSpan: variable.sourceSpan, filter: ts.isVariableDeclaration });
            if (node === null || node.initializer === undefined) {
                return null;
            }
            var expressionSymbol = this.getSymbolOfTsNode(node.initializer);
            if (expressionSymbol === null) {
                return null;
            }
            return {
                tsType: expressionSymbol.tsType,
                tsSymbol: expressionSymbol.tsSymbol,
                initializerLocation: expressionSymbol.shimLocation,
                kind: api_1.SymbolKind.Variable,
                declaration: variable,
                localVarLocation: {
                    shimPath: this.shimPath,
                    positionInShimFile: this.getShimPositionForNode(node.name),
                }
            };
        };
        SymbolBuilder.prototype.getSymbolOfReference = function (ref) {
            var target = this.templateData.boundTarget.getReferenceTarget(ref);
            // Find the node for the reference declaration, i.e. `var _t2 = _t1;`
            var node = comments_1.findFirstMatchingNode(this.typeCheckBlock, { withSpan: ref.sourceSpan, filter: ts.isVariableDeclaration });
            if (node === null || target === null || node.initializer === undefined) {
                return null;
            }
            // Get the original declaration for the references variable, with the exception of template refs
            // which are of the form var _t3 = (_t2 as any as i2.TemplateRef<any>)
            // TODO(atscott): Consider adding an `ExpressionIdentifier` to tag variable declaration
            // initializers as invalid for symbol retrieval.
            var originalDeclaration = ts.isParenthesizedExpression(node.initializer) &&
                ts.isAsExpression(node.initializer.expression) ?
                this.getTypeChecker().getSymbolAtLocation(node.name) :
                this.getTypeChecker().getSymbolAtLocation(node.initializer);
            if (originalDeclaration === undefined || originalDeclaration.valueDeclaration === undefined) {
                return null;
            }
            var symbol = this.getSymbolOfTsNode(originalDeclaration.valueDeclaration);
            if (symbol === null || symbol.tsSymbol === null) {
                return null;
            }
            var referenceVarShimLocation = {
                shimPath: this.shimPath,
                positionInShimFile: this.getShimPositionForNode(node),
            };
            if (target instanceof compiler_1.TmplAstTemplate || target instanceof compiler_1.TmplAstElement) {
                return {
                    kind: api_1.SymbolKind.Reference,
                    tsSymbol: symbol.tsSymbol,
                    tsType: symbol.tsType,
                    target: target,
                    declaration: ref,
                    targetLocation: symbol.shimLocation,
                    referenceVarLocation: referenceVarShimLocation,
                };
            }
            else {
                if (!ts.isClassDeclaration(target.directive.ref.node)) {
                    return null;
                }
                return {
                    kind: api_1.SymbolKind.Reference,
                    tsSymbol: symbol.tsSymbol,
                    tsType: symbol.tsType,
                    declaration: ref,
                    target: target.directive.ref.node,
                    targetLocation: symbol.shimLocation,
                    referenceVarLocation: referenceVarShimLocation,
                };
            }
        };
        SymbolBuilder.prototype.getSymbolOfPipe = function (expression) {
            var methodAccess = comments_1.findFirstMatchingNode(this.typeCheckBlock, { withSpan: expression.nameSpan, filter: ts.isPropertyAccessExpression });
            if (methodAccess === null) {
                return null;
            }
            var pipeVariableNode = methodAccess.expression;
            var pipeDeclaration = this.getTypeChecker().getSymbolAtLocation(pipeVariableNode);
            if (pipeDeclaration === undefined || pipeDeclaration.valueDeclaration === undefined) {
                return null;
            }
            var pipeInstance = this.getSymbolOfTsNode(pipeDeclaration.valueDeclaration);
            // The instance should never be null, nor should the symbol lack a value declaration. This
            // is because the node used to look for the `pipeInstance` symbol info is a value
            // declaration of another symbol (i.e. the `pipeDeclaration` symbol).
            if (pipeInstance === null || !typescript_1.isSymbolWithValueDeclaration(pipeInstance.tsSymbol)) {
                return null;
            }
            var symbolInfo = this.getSymbolOfTsNode(methodAccess);
            if (symbolInfo === null) {
                return null;
            }
            return tslib_1.__assign(tslib_1.__assign({ kind: api_1.SymbolKind.Pipe }, symbolInfo), { classSymbol: tslib_1.__assign(tslib_1.__assign({}, pipeInstance), { tsSymbol: pipeInstance.tsSymbol }) });
        };
        SymbolBuilder.prototype.getSymbolOfTemplateExpression = function (expression) {
            if (expression instanceof compiler_1.ASTWithSource) {
                expression = expression.ast;
            }
            var expressionTarget = this.templateData.boundTarget.getExpressionTarget(expression);
            if (expressionTarget !== null) {
                return this.getSymbol(expressionTarget);
            }
            // The `name` part of a `PropertyWrite` and `MethodCall` does not have its own
            // AST so there is no way to retrieve a `Symbol` for just the `name` via a specific node.
            var withSpan = (expression instanceof compiler_1.PropertyWrite || expression instanceof compiler_1.MethodCall) ?
                expression.nameSpan :
                expression.sourceSpan;
            var node = null;
            // Property reads in templates usually map to a `PropertyAccessExpression`
            // (e.g. `ctx.foo`) so try looking for one first.
            if (expression instanceof compiler_1.PropertyRead) {
                node = comments_1.findFirstMatchingNode(this.typeCheckBlock, { withSpan: withSpan, filter: ts.isPropertyAccessExpression });
            }
            // Otherwise fall back to searching for any AST node.
            if (node === null) {
                node = comments_1.findFirstMatchingNode(this.typeCheckBlock, { withSpan: withSpan, filter: anyNodeFilter });
            }
            if (node === null) {
                return null;
            }
            while (ts.isParenthesizedExpression(node)) {
                node = node.expression;
            }
            // - If we have safe property read ("a?.b") we want to get the Symbol for b, the `whenTrue`
            // expression.
            // - If our expression is a pipe binding ("a | test:b:c"), we want the Symbol for the
            // `transform` on the pipe.
            // - Otherwise, we retrieve the symbol for the node itself with no special considerations
            if ((expression instanceof compiler_1.SafePropertyRead || expression instanceof compiler_1.SafeMethodCall) &&
                ts.isConditionalExpression(node)) {
                var whenTrueSymbol = (expression instanceof compiler_1.SafeMethodCall && ts.isCallExpression(node.whenTrue)) ?
                    this.getSymbolOfTsNode(node.whenTrue.expression) :
                    this.getSymbolOfTsNode(node.whenTrue);
                if (whenTrueSymbol === null) {
                    return null;
                }
                return tslib_1.__assign(tslib_1.__assign({}, whenTrueSymbol), { kind: api_1.SymbolKind.Expression, 
                    // Rather than using the type of only the `whenTrue` part of the expression, we should
                    // still get the type of the whole conditional expression to include `|undefined`.
                    tsType: this.getTypeChecker().getTypeAtLocation(node) });
            }
            else {
                var symbolInfo = this.getSymbolOfTsNode(node);
                return symbolInfo === null ? null : tslib_1.__assign(tslib_1.__assign({}, symbolInfo), { kind: api_1.SymbolKind.Expression });
            }
        };
        SymbolBuilder.prototype.getSymbolOfTsNode = function (node) {
            var _a;
            while (ts.isParenthesizedExpression(node)) {
                node = node.expression;
            }
            var tsSymbol;
            if (ts.isPropertyAccessExpression(node)) {
                tsSymbol = this.getTypeChecker().getSymbolAtLocation(node.name);
            }
            else if (ts.isElementAccessExpression(node)) {
                tsSymbol = this.getTypeChecker().getSymbolAtLocation(node.argumentExpression);
            }
            else {
                tsSymbol = this.getTypeChecker().getSymbolAtLocation(node);
            }
            var positionInShimFile = this.getShimPositionForNode(node);
            var type = this.getTypeChecker().getTypeAtLocation(node);
            return {
                // If we could not find a symbol, fall back to the symbol on the type for the node.
                // Some nodes won't have a "symbol at location" but will have a symbol for the type.
                // Examples of this would be literals and `document.createElement('div')`.
                tsSymbol: (_a = tsSymbol !== null && tsSymbol !== void 0 ? tsSymbol : type.symbol) !== null && _a !== void 0 ? _a : null,
                tsType: type,
                shimLocation: { shimPath: this.shimPath, positionInShimFile: positionInShimFile },
            };
        };
        SymbolBuilder.prototype.getShimPositionForNode = function (node) {
            if (ts.isTypeReferenceNode(node)) {
                return this.getShimPositionForNode(node.typeName);
            }
            else if (ts.isQualifiedName(node)) {
                return node.right.getStart();
            }
            else if (ts.isPropertyAccessExpression(node)) {
                return node.name.getStart();
            }
            else if (ts.isElementAccessExpression(node)) {
                return node.argumentExpression.getStart();
            }
            else {
                return node.getStart();
            }
        };
        return SymbolBuilder;
    }());
    exports.SymbolBuilder = SymbolBuilder;
    /** Filter predicate function that matches any AST node. */
    function anyNodeFilter(n) {
        return true;
    }
    function sourceSpanEqual(a, b) {
        return a.start.offset === b.start.offset && a.end.offset === b.end.offset;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfc3ltYm9sX2J1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3R5cGVjaGVjay9zcmMvdGVtcGxhdGVfc3ltYm9sX2J1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUVILDhDQUErUztJQUMvUywrQkFBaUM7SUFLakMsa0ZBQXFGO0lBQ3JGLHFFQUErUjtJQUUvUixtRkFBc0g7SUFFdEgsaUZBQTZDO0lBRTdDOzs7OztPQUtHO0lBQ0g7UUFHRSx1QkFDcUIsUUFBd0IsRUFDeEIsY0FBdUIsRUFDdkIsWUFBMEIsRUFDMUIsb0JBQTBDO1FBQzNELDhGQUE4RjtRQUM5RiwrQkFBK0I7UUFDZCxjQUFvQztZQU5wQyxhQUFRLEdBQVIsUUFBUSxDQUFnQjtZQUN4QixtQkFBYyxHQUFkLGNBQWMsQ0FBUztZQUN2QixpQkFBWSxHQUFaLFlBQVksQ0FBYztZQUMxQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1lBRzFDLG1CQUFjLEdBQWQsY0FBYyxDQUFzQjtZQVRqRCxnQkFBVyxHQUFHLElBQUksR0FBRyxFQUFnQyxDQUFDO1FBVTNELENBQUM7UUFLSixpQ0FBUyxHQUFULFVBQVUsSUFBcUI7WUFDN0IsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDOUIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUUsQ0FBQzthQUNwQztZQUVELElBQUksTUFBTSxHQUFnQixJQUFJLENBQUM7WUFDL0IsSUFBSSxJQUFJLFlBQVksZ0NBQXFCLElBQUksSUFBSSxZQUFZLCtCQUFvQixFQUFFO2dCQUNqRiw0RkFBNEY7Z0JBQzVGLDZDQUE2QztnQkFDN0MsTUFBTSxHQUFHLElBQUksQ0FBQyx1QkFB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QVEsQ0FBQyxDQUFDO2FBQ25EO2lCQUFNLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQzlCO2lCQUFNLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDN0I7aUJBQU0sSUFBSSxFQUFFLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzdDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQzNDO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQ3hCO1FBQ0gsQ0FBQztRQUNILG9CQUFDO0lBQUQsQ0FBQyxBQW5qQkQsSUFtakJDO0lBbmpCWSxzQ0FBYTtJQXFqQjFCLDJEQUEyRDtJQUMzRCxTQUFTLGFBQWEsQ0FBQyxDQUFVO1FBQy9CLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFNBQVMsZUFBZSxDQUFDLENBQWtCLEVBQUUsQ0FBa0I7UUFDN0QsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUM1RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QVNULCBBU1RXaXRoU291cmNlLCBCaW5kaW5nUGlwZSwgTWV0aG9kQ2FsbCwgUGFyc2VTb3VyY2VTcGFuLCBQcm9wZXJ0eVJlYWQsIFByb3BlcnR5V3JpdGUsIFNhZmVNZXRob2RDYWxsLCBTYWZlUHJvcGVydHlSZWFkLCBUbXBsQXN0Qm91bmRBdHRyaWJ1dGUsIFRtcGxBc3RCb3VuZEV2ZW50LCBUbXBsQXN0RWxlbWVudCwgVG1wbEFzdE5vZGUsIFRtcGxBc3RSZWZlcmVuY2UsIFRtcGxBc3RUZW1wbGF0ZSwgVG1wbEFzdFRleHRBdHRyaWJ1dGUsIFRtcGxBc3RWYXJpYWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGh9IGZyb20gJy4uLy4uL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7Q2xhc3NEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge0NvbXBvbmVudFNjb3BlUmVhZGVyfSBmcm9tICcuLi8uLi9zY29wZSc7XG5pbXBvcnQge2lzQXNzaWdubWVudCwgaXNTeW1ib2xXaXRoVmFsdWVEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5pbXBvcnQge0JpbmRpbmdTeW1ib2wsIERpcmVjdGl2ZVN5bWJvbCwgRG9tQmluZGluZ1N5bWJvbCwgRWxlbWVudFN5bWJvbCwgRXhwcmVzc2lvblN5bWJvbCwgSW5wdXRCaW5kaW5nU3ltYm9sLCBPdXRwdXRCaW5kaW5nU3ltYm9sLCBQaXBlU3ltYm9sLCBSZWZlcmVuY2VTeW1ib2wsIFNoaW1Mb2NhdGlvbiwgU3ltYm9sLCBTeW1ib2xLaW5kLCBUZW1wbGF0ZVN5bWJvbCwgVHNOb2RlU3ltYm9sSW5mbywgVHlwZUNoZWNrYWJsZURpcmVjdGl2ZU1ldGEsIFZhcmlhYmxlU3ltYm9sfSBmcm9tICcuLi9hcGknO1xuXG5pbXBvcnQge0V4cHJlc3Npb25JZGVudGlmaWVyLCBmaW5kQWxsTWF0Y2hpbmdOb2RlcywgZmluZEZpcnN0TWF0Y2hpbmdOb2RlLCBoYXNFeHByZXNzaW9uSWRlbnRpZmllcn0gZnJvbSAnLi9jb21tZW50cyc7XG5pbXBvcnQge1RlbXBsYXRlRGF0YX0gZnJvbSAnLi9jb250ZXh0JztcbmltcG9ydCB7aXNBY2Nlc3NFeHByZXNzaW9ufSBmcm9tICcuL3RzX3V0aWwnO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhbmQgY2FjaGVzIGBTeW1ib2xgcyBmb3IgdmFyaW91cyB0ZW1wbGF0ZSBzdHJ1Y3R1cmVzIGZvciBhIGdpdmVuIGNvbXBvbmVudC5cbiAqXG4gKiBUaGUgYFN5bWJvbEJ1aWxkZXJgIGludGVybmFsbHkgY2FjaGVzIHRoZSBgU3ltYm9sYHMgaXQgY3JlYXRlcywgYW5kIG11c3QgYmUgZGVzdHJveWVkIGFuZFxuICogcmVwbGFjZWQgaWYgdGhlIGNvbXBvbmVudCdzIHRlbXBsYXRlIGNoYW5nZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTeW1ib2xCdWlsZGVyIHtcbiAgcHJpdmF0ZSBzeW1ib2xDYWNoZSA9IG5ldyBNYXA8QVNUfFRtcGxBc3ROb2RlLCBTeW1ib2x8bnVsbD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgc2hpbVBhdGg6IEFic29sdXRlRnNQYXRoLFxuICAgICAgcHJpdmF0ZSByZWFkb25seSB0eXBlQ2hlY2tCbG9jazogdHMuTm9kZSxcbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgdGVtcGxhdGVEYXRhOiBUZW1wbGF0ZURhdGEsXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudFNjb3BlUmVhZGVyOiBDb21wb25lbnRTY29wZVJlYWRlcixcbiAgICAgIC8vIFRoZSBgdHMuVHlwZUNoZWNrZXJgIGRlcGVuZHMgb24gdGhlIGN1cnJlbnQgdHlwZS1jaGVja2luZyBwcm9ncmFtLCBhbmQgc28gbXVzdCBiZSByZXF1ZXN0ZWRcbiAgICAgIC8vIG9uLWRlbWFuZCBpbnN0ZWFkIG9mIGNhY2hlZC5cbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgZ2V0VHlwZUNoZWNrZXI6ICgpID0+IHRzLlR5cGVDaGVja2VyLFxuICApIHt9XG5cbiAgZ2V0U3ltYm9sKG5vZGU6IFRtcGxBc3RUZW1wbGF0ZXxUbXBsQXN0RWxlbWVudCk6IFRlbXBsYXRlU3ltYm9sfEVsZW1lbnRTeW1ib2x8bnVsbDtcbiAgZ2V0U3ltYm9sKG5vZGU6IFRtcGxBc3RSZWZlcmVuY2V8VG1wbEFzdFZhcmlhYmxlKTogUmVmZXJlbmNlU3ltYm9sfFZhcmlhYmxlU3ltYm9sfG51bGw7XG4gIGdldFN5bWJvbChub2RlOiBBU1R8VG1wbEFzdE5vZGUpOiBTeW1ib2x8bnVsbDtcbiAgZ2V0U3ltYm9sKG5vZGU6IEFTVHxUbXBsQXN0Tm9kZSk6IFN5bWJvbHxudWxsIHtcbiAgICBpZiAodGhpcy5zeW1ib2xDYWNoZS5oYXMobm9kZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnN5bWJvbENhY2hlLmdldChub2RlKSE7XG4gICAgfVxuXG4gICAgbGV0IHN5bWJvbDogU3ltYm9sfG51bGwgPSBudWxsO1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgVG1wbEFzdEJvdW5kQXR0cmlidXRlIHx8IG5vZGUgaW5zdGFuY2VvZiBUbXBsQXN0VGV4dEF0dHJpYnV0ZSkge1xuICAgICAgLy8gVE9ETyhhdHNjb3R0KTogaW5wdXQgYW5kIG91dHB1dCBiaW5kaW5ncyBvbmx5IHJldHVybiB0aGUgZmlyc3QgZGlyZWN0aXZlIG1hdGNoIGJ1dCBzaG91bGRcbiAgICAgIC8vIHJldHVybiBhIGxpc3Qgb2YgYmluZGluZ3MgZm9yIGFsbCBvZiB0aGVtLlxuICAgICAgc3ltYm9sID0gdGhpcy5nZXRTeW1ib2xPZklucHV0QmluZGluZyhub2RlKTtcbiAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBUbXBsQXN0Qm91bmRFdmVudCkge1xuICAgICAgc3ltYm9sID0gdGhpcy5nZXRTeW1ib2xPZkJvdW5kRXZlbnQobm9kZSk7XG4gICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgVG1wbEFzdEVsZW1lbnQpIHtcbiAgICAgIHN5bWJvbCA9IHRoaXMuZ2V0U3ltYm9sT2ZFbGVtZW50KG5vZGUpO1xuICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIFRtcGxBc3RUZW1wbGF0ZSkge1xuICAgICAgc3ltYm9sID0gdGhpcy5nZXRTeW1ib2xPZkFzdFRlbXBsYXRlKG5vZGUpO1xuICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIFRtcGxBc3RWYXJpYWJsZSkge1xuICAgICAgc3ltYm9sID0gdGhpcy5nZXRTeW1ib2xPZlZhcmlhYmxlKG5vZGUpO1xuICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIFRtcGxBc3RSZWZlcmVuY2UpIHtcbiAgICAgIHN5bWJvbCA9IHRoaXMuZ2V0U3ltYm9sT2ZSZWZlcmVuY2Uobm9kZSk7XG4gICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgQmluZGluZ1BpcGUpIHtcbiAgICAgIHN5bWJvbCA9IHRoaXMuZ2V0U3ltYm9sT2ZQaXBlKG5vZGUpO1xuICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEFTVCkge1xuICAgICAgc3ltYm9sID0gdGhpcy5nZXRTeW1ib2xPZlRlbXBsYXRlRXhwcmVzc2lvbihub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVE9ETyhhdHNjb3R0KTogVG1wbEFzdENvbnRlbnQsIFRtcGxBc3RJY3VcbiAgICB9XG5cbiAgICB0aGlzLnN5bWJvbENhY2hlLnNldChub2RlLCBzeW1ib2wpO1xuICAgIHJldHVybiBzeW1ib2w7XG4gIH1cblxuICBwcml2YXRlIGdldFN5bWJvbE9mQXN0VGVtcGxhdGUodGVtcGxhdGU6IFRtcGxBc3RUZW1wbGF0ZSk6IFRlbXBsYXRlU3ltYm9sfG51bGwge1xuICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSB0aGlzLmdldERpcmVjdGl2ZXNPZk5vZGUodGVtcGxhdGUpO1xuICAgIHJldHVybiB7a2luZDogU3ltYm9sS2luZC5UZW1wbGF0ZSwgZGlyZWN0aXZlcywgdGVtcGxhdGVOb2RlOiB0ZW1wbGF0ZX07XG4gIH1cblxuICBwcml2YXRlIGdldFN5bWJvbE9mRWxlbWVudChlbGVtZW50OiBUbXBsQXN0RWxlbWVudCk6IEVsZW1lbnRTeW1ib2x8bnVsbCB7XG4gICAgY29uc3QgZWxlbWVudFNvdXJjZVNwYW4gPSBlbGVtZW50LnN0YXJ0U291cmNlU3BhbiA/PyBlbGVtZW50LnNvdXJjZVNwYW47XG5cbiAgICBjb25zdCBub2RlID0gZmluZEZpcnN0TWF0Y2hpbmdOb2RlKFxuICAgICAgICB0aGlzLnR5cGVDaGVja0Jsb2NrLCB7d2l0aFNwYW46IGVsZW1lbnRTb3VyY2VTcGFuLCBmaWx0ZXI6IHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbn0pO1xuICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBzeW1ib2xGcm9tRGVjbGFyYXRpb24gPSB0aGlzLmdldFN5bWJvbE9mVHNOb2RlKG5vZGUpO1xuICAgIGlmIChzeW1ib2xGcm9tRGVjbGFyYXRpb24gPT09IG51bGwgfHwgc3ltYm9sRnJvbURlY2xhcmF0aW9uLnRzU3ltYm9sID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBkaXJlY3RpdmVzID0gdGhpcy5nZXREaXJlY3RpdmVzT2ZOb2RlKGVsZW1lbnQpO1xuICAgIC8vIEFsbCBzdGF0ZW1lbnRzIGluIHRoZSBUQ0IgYXJlIGBFeHByZXNzaW9uYHMgdGhhdCBvcHRpb25hbGx5IGluY2x1ZGUgbW9yZSBpbmZvcm1hdGlvbi5cbiAgICAvLyBBbiBgRWxlbWVudFN5bWJvbGAgdXNlcyB0aGUgaW5mb3JtYXRpb24gcmV0dXJuZWQgZm9yIHRoZSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBleHByZXNzaW9uLFxuICAgIC8vIGFkZHMgdGhlIGRpcmVjdGl2ZXMgZm9yIHRoZSBlbGVtZW50LCBhbmQgdXBkYXRlcyB0aGUgYGtpbmRgIHRvIGJlIGBTeW1ib2xLaW5kLkVsZW1lbnRgLlxuICAgIHJldHVybiB7XG4gICAgICAuLi5zeW1ib2xGcm9tRGVjbGFyYXRpb24sXG4gICAgICBraW5kOiBTeW1ib2xLaW5kLkVsZW1lbnQsXG4gICAgICBkaXJlY3RpdmVzLFxuICAgICAgdGVtcGxhdGVOb2RlOiBlbGVtZW50LFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGdldERpcmVjdGl2ZXNPZk5vZGUoZWxlbWVudDogVG1wbEFzdEVsZW1lbnR8VG1wbEFzdFRlbXBsYXRlKTogRGlyZWN0aXZlU3ltYm9sW10ge1xuICAgIGNvbnN0IGVsZW1lbnRTb3VyY2VTcGFuID0gZWxlbWVudC5zdGFydFNvdXJjZVNwYW4gPz8gZWxlbWVudC5zb3VyY2VTcGFuO1xuICAgIGNvbnN0IHRjYlNvdXJjZUZpbGUgPSB0aGlzLnR5cGVDaGVja0Jsb2NrLmdldFNvdXJjZUZpbGUoKTtcbiAgICAvLyBkaXJlY3RpdmVzIGNvdWxkIGJlIGVpdGhlcjpcbiAgICAvLyAtIHZhciBfdDE6IFRlc3REaXIgLypUOkQqLyA9IChudWxsISk7XG4gICAgLy8gLSB2YXIgX3QxIC8qVDpEKi8gPSBfY3RvcjEoe30pO1xuICAgIGNvbnN0IGlzRGlyZWN0aXZlRGVjbGFyYXRpb24gPSAobm9kZTogdHMuTm9kZSk6IG5vZGUgaXMgdHMuVHlwZU5vZGV8dHMuSWRlbnRpZmllciA9PlxuICAgICAgICAodHMuaXNUeXBlTm9kZShub2RlKSB8fCB0cy5pc0lkZW50aWZpZXIobm9kZSkpICYmIHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihub2RlLnBhcmVudCkgJiZcbiAgICAgICAgaGFzRXhwcmVzc2lvbklkZW50aWZpZXIodGNiU291cmNlRmlsZSwgbm9kZSwgRXhwcmVzc2lvbklkZW50aWZpZXIuRElSRUNUSVZFKTtcblxuICAgIGNvbnN0IG5vZGVzID0gZmluZEFsbE1hdGNoaW5nTm9kZXMoXG4gICAgICAgIHRoaXMudHlwZUNoZWNrQmxvY2ssIHt3aXRoU3BhbjogZWxlbWVudFNvdXJjZVNwYW4sIGZpbHRlcjogaXNEaXJlY3RpdmVEZWNsYXJhdGlvbn0pO1xuICAgIHJldHVybiBub2Rlc1xuICAgICAgICAubWFwKG5vZGUgPT4ge1xuICAgICAgICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMuZ2V0U3ltYm9sT2ZUc05vZGUobm9kZS5wYXJlbnQpO1xuICAgICAgICAgIGlmIChzeW1ib2wgPT09IG51bGwgfHwgIWlzU3ltYm9sV2l0aFZhbHVlRGVjbGFyYXRpb24oc3ltYm9sLnRzU3ltYm9sKSB8fFxuICAgICAgICAgICAgICAhdHMuaXNDbGFzc0RlY2xhcmF0aW9uKHN5bWJvbC50c1N5bWJvbC52YWx1ZURlY2xhcmF0aW9uKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG1ldGEgPSB0aGlzLmdldERpcmVjdGl2ZU1ldGEoZWxlbWVudCwgc3ltYm9sLnRzU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pO1xuICAgICAgICAgIGlmIChtZXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBuZ01vZHVsZSA9IHRoaXMuZ2V0RGlyZWN0aXZlTW9kdWxlKHN5bWJvbC50c1N5bWJvbC52YWx1ZURlY2xhcmF0aW9uKTtcbiAgICAgICAgICBpZiAobWV0YS5zZWxlY3RvciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGlzQ29tcG9uZW50ID0gbWV0YS5pc0NvbXBvbmVudCA/PyBudWxsO1xuICAgICAgICAgIGNvbnN0IGRpcmVjdGl2ZVN5bWJvbDogRGlyZWN0aXZlU3ltYm9sID0ge1xuICAgICAgICAgICAgLi4uc3ltYm9sLFxuICAgICAgICAgICAgdHNTeW1ib2w6IHN5bWJvbC50c1N5bWJvbCxcbiAgICAgICAgICAgIHNlbGVjdG9yOiBtZXRhLnNlbGVjdG9yLFxuICAgICAgICAgICAgaXNDb21wb25lbnQsXG4gICAgICAgICAgICBuZ01vZHVsZSxcbiAgICAgICAgICAgIGtpbmQ6IFN5bWJvbEtpbmQuRGlyZWN0aXZlLFxuICAgICAgICAgICAgaXNTdHJ1Y3R1cmFsOiBtZXRhLmlzU3RydWN0dXJhbCxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBkaXJlY3RpdmVTeW1ib2w7XG4gICAgICAgIH0pXG4gICAgICAgIC5maWx0ZXIoKGQpOiBkIGlzIERpcmVjdGl2ZVN5bWJvbCA9PiBkICE9PSBudWxsKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGlyZWN0aXZlTWV0YShcbiAgICAgIGhvc3Q6IFRtcGxBc3RUZW1wbGF0ZXxUbXBsQXN0RWxlbWVudCxcbiAgICAgIGRpcmVjdGl2ZURlY2xhcmF0aW9uOiB0cy5EZWNsYXJhdGlvbik6IFR5cGVDaGVja2FibGVEaXJlY3RpdmVNZXRhfG51bGwge1xuICAgIGxldCBkaXJlY3RpdmVzID0gdGhpcy50ZW1wbGF0ZURhdGEuYm91bmRUYXJnZXQuZ2V0RGlyZWN0aXZlc09mTm9kZShob3N0KTtcblxuICAgIC8vIGBnZXREaXJlY3RpdmVzT2ZOb2RlYCB3aWxsIG5vdCByZXR1cm4gdGhlIGRpcmVjdGl2ZXMgaW50ZW5kZWQgZm9yIGFuIGVsZW1lbnRcbiAgICAvLyBvbiBhIG1pY3Jvc3ludGF4IHRlbXBsYXRlLCBmb3IgZXhhbXBsZSBgPGRpdiAqbmdGb3I9XCJsZXQgdXNlciBvZiB1c2VycztcIiBkaXI+YCxcbiAgICAvLyB0aGUgYGRpcmAgd2lsbCBiZSBza2lwcGVkLCBidXQgaXQncyBuZWVkZWQgaW4gbGFuZ3VhZ2Ugc2VydmljZS5cbiAgICBjb25zdCBmaXJzdENoaWxkID0gaG9zdC5jaGlsZHJlblswXTtcbiAgICBpZiAoZmlyc3RDaGlsZCBpbnN0YW5jZW9mIFRtcGxBc3RFbGVtZW50KSB7XG4gICAgICBjb25zdCBpc01pY3Jvc3ludGF4VGVtcGxhdGUgPSBob3N0IGluc3RhbmNlb2YgVG1wbEFzdFRlbXBsYXRlICYmXG4gICAgICAgICAgc291cmNlU3BhbkVxdWFsKGZpcnN0Q2hpbGQuc291cmNlU3BhbiwgaG9zdC5zb3VyY2VTcGFuKTtcbiAgICAgIGlmIChpc01pY3Jvc3ludGF4VGVtcGxhdGUpIHtcbiAgICAgICAgY29uc3QgZmlyc3RDaGlsZERpcmVjdGl2ZXMgPSB0aGlzLnRlbXBsYXRlRGF0YS5ib3VuZFRhcmdldC5nZXREaXJlY3RpdmVzT2ZOb2RlKGZpcnN0Q2hpbGQpO1xuICAgICAgICBpZiAoZmlyc3RDaGlsZERpcmVjdGl2ZXMgIT09IG51bGwgJiYgZGlyZWN0aXZlcyAhPT0gbnVsbCkge1xuICAgICAgICAgIGRpcmVjdGl2ZXMgPSBkaXJlY3RpdmVzLmNvbmNhdChmaXJzdENoaWxkRGlyZWN0aXZlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGlyZWN0aXZlcyA9IGRpcmVjdGl2ZXMgPz8gZmlyc3RDaGlsZERpcmVjdGl2ZXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRpcmVjdGl2ZXMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBkaXJlY3RpdmVzLmZpbmQobSA9PiBtLnJlZi5ub2RlID09PSBkaXJlY3RpdmVEZWNsYXJhdGlvbikgPz8gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGlyZWN0aXZlTW9kdWxlKGRlY2xhcmF0aW9uOiB0cy5DbGFzc0RlY2xhcmF0aW9uKTogQ2xhc3NEZWNsYXJhdGlvbnxudWxsIHtcbiAgICBjb25zdCBzY29wZSA9IHRoaXMuY29tcG9uZW50U2NvcGVSZWFkZXIuZ2V0U2NvcGVGb3JDb21wb25lbnQoZGVjbGFyYXRpb24gYXMgQ2xhc3NEZWNsYXJhdGlvbik7XG4gICAgaWYgKHNjb3BlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3BlLm5nTW9kdWxlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTeW1ib2xPZkJvdW5kRXZlbnQoZXZlbnRCaW5kaW5nOiBUbXBsQXN0Qm91bmRFdmVudCk6IE91dHB1dEJpbmRpbmdTeW1ib2x8bnVsbCB7XG4gICAgY29uc3QgY29uc3VtZXIgPSB0aGlzLnRlbXBsYXRlRGF0YS5ib3VuZFRhcmdldC5nZXRDb25zdW1lck9mQmluZGluZyhldmVudEJpbmRpbmcpO1xuICAgIGlmIChjb25zdW1lciA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gT3V0cHV0cyBpbiB0aGUgVENCIGxvb2sgbGlrZSBvbmUgb2YgdGhlIHR3bzpcbiAgICAvLyAqIF90MVtcIm91dHB1dEZpZWxkXCJdLnN1YnNjcmliZShoYW5kbGVyKTtcbiAgICAvLyAqIF90MS5hZGRFdmVudExpc3RlbmVyKGhhbmRsZXIpO1xuICAgIC8vIEV2ZW4gd2l0aCBzdHJpY3QgbnVsbCBjaGVja3MgZGlzYWJsZWQsIHdlIHN0aWxsIHByb2R1Y2UgdGhlIGFjY2VzcyBhcyBhIHNlcGFyYXRlIHN0YXRlbWVudFxuICAgIC8vIHNvIHRoYXQgaXQgY2FuIGJlIGZvdW5kIGhlcmUuXG4gICAgbGV0IGV4cGVjdGVkQWNjZXNzOiBzdHJpbmc7XG4gICAgaWYgKGNvbnN1bWVyIGluc3RhbmNlb2YgVG1wbEFzdFRlbXBsYXRlIHx8IGNvbnN1bWVyIGluc3RhbmNlb2YgVG1wbEFzdEVsZW1lbnQpIHtcbiAgICAgIGV4cGVjdGVkQWNjZXNzID0gJ2FkZEV2ZW50TGlzdGVuZXInO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBiaW5kaW5nUHJvcGVydHlOYW1lcyA9IGNvbnN1bWVyLm91dHB1dHMuZ2V0QnlCaW5kaW5nUHJvcGVydHlOYW1lKGV2ZW50QmluZGluZy5uYW1lKTtcbiAgICAgIGlmIChiaW5kaW5nUHJvcGVydHlOYW1lcyA9PT0gbnVsbCB8fCBiaW5kaW5nUHJvcGVydHlOYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICAvLyBOb3RlIHRoYXQgd2Ugb25seSBnZXQgdGhlIGV4cGVjdGVkQWNjZXNzIHRleHQgZnJvbSBhIHNpbmdsZSBjb25zdW1lciBvZiB0aGUgYmluZGluZy4gSWZcbiAgICAgIC8vIHRoZXJlIGFyZSBtdWx0aXBsZSBjb25zdW1lcnMgKG5vdCBzdXBwb3J0ZWQgaW4gdGhlIGBib3VuZFRhcmdldGAgQVBJKSBhbmQgb25lIG9mIHRoZW0gaGFzXG4gICAgICAvLyBhbiBhbGlhcywgaXQgd2lsbCBub3QgZ2V0IG1hdGNoZWQgaGVyZS5cbiAgICAgIGV4cGVjdGVkQWNjZXNzID0gYmluZGluZ1Byb3BlcnR5TmFtZXNbMF0uY2xhc3NQcm9wZXJ0eU5hbWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyKG46IHRzLk5vZGUpOiBuIGlzIHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbnx0cy5FbGVtZW50QWNjZXNzRXhwcmVzc2lvbiB7XG4gICAgICBpZiAoIWlzQWNjZXNzRXhwcmVzc2lvbihuKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihuKSkge1xuICAgICAgICByZXR1cm4gbi5uYW1lLmdldFRleHQoKSA9PT0gZXhwZWN0ZWRBY2Nlc3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHMuaXNTdHJpbmdMaXRlcmFsKG4uYXJndW1lbnRFeHByZXNzaW9uKSAmJlxuICAgICAgICAgICAgbi5hcmd1bWVudEV4cHJlc3Npb24udGV4dCA9PT0gZXhwZWN0ZWRBY2Nlc3M7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IG91dHB1dEZpZWxkQWNjZXNzZXMgPVxuICAgICAgICBmaW5kQWxsTWF0Y2hpbmdOb2Rlcyh0aGlzLnR5cGVDaGVja0Jsb2NrLCB7d2l0aFNwYW46IGV2ZW50QmluZGluZy5rZXlTcGFuLCBmaWx0ZXJ9KTtcblxuICAgIGNvbnN0IGJpbmRpbmdzOiBCaW5kaW5nU3ltYm9sW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IG91dHB1dEZpZWxkQWNjZXNzIG9mIG91dHB1dEZpZWxkQWNjZXNzZXMpIHtcbiAgICAgIGlmIChjb25zdW1lciBpbnN0YW5jZW9mIFRtcGxBc3RUZW1wbGF0ZSB8fCBjb25zdW1lciBpbnN0YW5jZW9mIFRtcGxBc3RFbGVtZW50KSB7XG4gICAgICAgIGlmICghdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24ob3V0cHV0RmllbGRBY2Nlc3MpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhZGRFdmVudExpc3RlbmVyID0gb3V0cHV0RmllbGRBY2Nlc3MubmFtZTtcbiAgICAgICAgY29uc3QgdHNTeW1ib2wgPSB0aGlzLmdldFR5cGVDaGVja2VyKCkuZ2V0U3ltYm9sQXRMb2NhdGlvbihhZGRFdmVudExpc3RlbmVyKTtcbiAgICAgICAgY29uc3QgdHNUeXBlID0gdGhpcy5nZXRUeXBlQ2hlY2tlcigpLmdldFR5cGVBdExvY2F0aW9uKGFkZEV2ZW50TGlzdGVuZXIpO1xuICAgICAgICBjb25zdCBwb3NpdGlvbkluU2hpbUZpbGUgPSB0aGlzLmdldFNoaW1Qb3NpdGlvbkZvck5vZGUoYWRkRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZ2V0U3ltYm9sKGNvbnN1bWVyKTtcblxuICAgICAgICBpZiAodGFyZ2V0ID09PSBudWxsIHx8IHRzU3ltYm9sID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmRpbmdzLnB1c2goe1xuICAgICAgICAgIGtpbmQ6IFN5bWJvbEtpbmQuQmluZGluZyxcbiAgICAgICAgICB0c1N5bWJvbCxcbiAgICAgICAgICB0c1R5cGUsXG4gICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgIHNoaW1Mb2NhdGlvbjoge3NoaW1QYXRoOiB0aGlzLnNoaW1QYXRoLCBwb3NpdGlvbkluU2hpbUZpbGV9LFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdHMuaXNFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihvdXRwdXRGaWVsZEFjY2VzcykpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0c1N5bWJvbCA9XG4gICAgICAgICAgICB0aGlzLmdldFR5cGVDaGVja2VyKCkuZ2V0U3ltYm9sQXRMb2NhdGlvbihvdXRwdXRGaWVsZEFjY2Vzcy5hcmd1bWVudEV4cHJlc3Npb24pO1xuICAgICAgICBpZiAodHNTeW1ib2wgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmdldERpcmVjdGl2ZVN5bWJvbEZvckFjY2Vzc0V4cHJlc3Npb24ob3V0cHV0RmllbGRBY2Nlc3MsIGNvbnN1bWVyKTtcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb25JblNoaW1GaWxlID0gdGhpcy5nZXRTaGltUG9zaXRpb25Gb3JOb2RlKG91dHB1dEZpZWxkQWNjZXNzKTtcbiAgICAgICAgY29uc3QgdHNUeXBlID0gdGhpcy5nZXRUeXBlQ2hlY2tlcigpLmdldFR5cGVBdExvY2F0aW9uKG91dHB1dEZpZWxkQWNjZXNzKTtcbiAgICAgICAgYmluZGluZ3MucHVzaCh7XG4gICAgICAgICAga2luZDogU3ltYm9sS2luZC5CaW5kaW5nLFxuICAgICAgICAgIHRzU3ltYm9sLFxuICAgICAgICAgIHRzVHlwZSxcbiAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgc2hpbUxvY2F0aW9uOiB7c2hpbVBhdGg6IHRoaXMuc2hpbVBhdGgsIHBvc2l0aW9uSW5TaGltRmlsZX0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChiaW5kaW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge2tpbmQ6IFN5bWJvbEtpbmQuT3V0cHV0LCBiaW5kaW5nc307XG4gIH1cblxuICBwcml2YXRlIGdldFN5bWJvbE9mSW5wdXRCaW5kaW5nKGJpbmRpbmc6IFRtcGxBc3RCb3VuZEF0dHJpYnV0ZXxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUbXBsQXN0VGV4dEF0dHJpYnV0ZSk6IElucHV0QmluZGluZ1N5bWJvbHxEb21CaW5kaW5nU3ltYm9sfG51bGwge1xuICAgIGNvbnN0IGNvbnN1bWVyID0gdGhpcy50ZW1wbGF0ZURhdGEuYm91bmRUYXJnZXQuZ2V0Q29uc3VtZXJPZkJpbmRpbmcoYmluZGluZyk7XG4gICAgaWYgKGNvbnN1bWVyID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoY29uc3VtZXIgaW5zdGFuY2VvZiBUbXBsQXN0RWxlbWVudCB8fCBjb25zdW1lciBpbnN0YW5jZW9mIFRtcGxBc3RUZW1wbGF0ZSkge1xuICAgICAgY29uc3QgaG9zdCA9IHRoaXMuZ2V0U3ltYm9sKGNvbnN1bWVyKTtcbiAgICAgIHJldHVybiBob3N0ICE9PSBudWxsID8ge2tpbmQ6IFN5bWJvbEtpbmQuRG9tQmluZGluZywgaG9zdH0gOiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG5vZGVzID0gZmluZEFsbE1hdGNoaW5nTm9kZXMoXG4gICAgICAgIHRoaXMudHlwZUNoZWNrQmxvY2ssIHt3aXRoU3BhbjogYmluZGluZy5zb3VyY2VTcGFuLCBmaWx0ZXI6IGlzQXNzaWdubWVudH0pO1xuICAgIGNvbnN0IGJpbmRpbmdzOiBCaW5kaW5nU3ltYm9sW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgIGlmICghaXNBY2Nlc3NFeHByZXNzaW9uKG5vZGUubGVmdCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN5bWJvbEluZm8gPSB0aGlzLmdldFN5bWJvbE9mVHNOb2RlKG5vZGUubGVmdCk7XG4gICAgICBpZiAoc3ltYm9sSW5mbyA9PT0gbnVsbCB8fCBzeW1ib2xJbmZvLnRzU3ltYm9sID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmdldERpcmVjdGl2ZVN5bWJvbEZvckFjY2Vzc0V4cHJlc3Npb24obm9kZS5sZWZ0LCBjb25zdW1lcik7XG4gICAgICBpZiAodGFyZ2V0ID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgYmluZGluZ3MucHVzaCh7XG4gICAgICAgIC4uLnN5bWJvbEluZm8sXG4gICAgICAgIHRzU3ltYm9sOiBzeW1ib2xJbmZvLnRzU3ltYm9sLFxuICAgICAgICBraW5kOiBTeW1ib2xLaW5kLkJpbmRpbmcsXG4gICAgICAgIHRhcmdldCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYmluZGluZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge2tpbmQ6IFN5bWJvbEtpbmQuSW5wdXQsIGJpbmRpbmdzfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGlyZWN0aXZlU3ltYm9sRm9yQWNjZXNzRXhwcmVzc2lvbihcbiAgICAgIG5vZGU6IHRzLkVsZW1lbnRBY2Nlc3NFeHByZXNzaW9ufHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbixcbiAgICAgIHtpc0NvbXBvbmVudCwgc2VsZWN0b3IsIGlzU3RydWN0dXJhbH06IFR5cGVDaGVja2FibGVEaXJlY3RpdmVNZXRhKTogRGlyZWN0aXZlU3ltYm9sfG51bGwge1xuICAgIC8vIEluIGVpdGhlciBjYXNlLCBgX3QxW1wiaW5kZXhcIl1gIG9yIGBfdDEuaW5kZXhgLCBgbm9kZS5leHByZXNzaW9uYCBpcyBfdDEuXG4gICAgLy8gVGhlIHJldHJpZXZlZCBzeW1ib2wgZm9yIF90MSB3aWxsIGJlIHRoZSB2YXJpYWJsZSBkZWNsYXJhdGlvbi5cbiAgICBjb25zdCB0c1N5bWJvbCA9IHRoaXMuZ2V0VHlwZUNoZWNrZXIoKS5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gICAgaWYgKHRzU3ltYm9sPy5kZWNsYXJhdGlvbnMgPT09IHVuZGVmaW5lZCB8fCB0c1N5bWJvbC5kZWNsYXJhdGlvbnMubGVuZ3RoID09PSAwIHx8XG4gICAgICAgIHNlbGVjdG9yID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBbZGVjbGFyYXRpb25dID0gdHNTeW1ib2wuZGVjbGFyYXRpb25zO1xuICAgIGlmICghdHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9uKSB8fFxuICAgICAgICAhaGFzRXhwcmVzc2lvbklkZW50aWZpZXIoXG4gICAgICAgICAgICAvLyBUaGUgZXhwcmVzc2lvbiBpZGVudGlmaWVyIGNvdWxkIGJlIG9uIHRoZSB0eXBlIChmb3IgcmVndWxhciBkaXJlY3RpdmVzKSBvciB0aGUgbmFtZVxuICAgICAgICAgICAgLy8gKGZvciBnZW5lcmljIGRpcmVjdGl2ZXMgYW5kIHRoZSBjdG9yIG9wKS5cbiAgICAgICAgICAgIGRlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKSwgZGVjbGFyYXRpb24udHlwZSA/PyBkZWNsYXJhdGlvbi5uYW1lLFxuICAgICAgICAgICAgRXhwcmVzc2lvbklkZW50aWZpZXIuRElSRUNUSVZFKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgc3ltYm9sID0gdGhpcy5nZXRTeW1ib2xPZlRzTm9kZShkZWNsYXJhdGlvbik7XG4gICAgaWYgKHN5bWJvbCA9PT0gbnVsbCB8fCAhaXNTeW1ib2xXaXRoVmFsdWVEZWNsYXJhdGlvbihzeW1ib2wudHNTeW1ib2wpIHx8XG4gICAgICAgICF0cy5pc0NsYXNzRGVjbGFyYXRpb24oc3ltYm9sLnRzU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBuZ01vZHVsZSA9IHRoaXMuZ2V0RGlyZWN0aXZlTW9kdWxlKHN5bWJvbC50c1N5bWJvbC52YWx1ZURlY2xhcmF0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAga2luZDogU3ltYm9sS2luZC5EaXJlY3RpdmUsXG4gICAgICB0c1N5bWJvbDogc3ltYm9sLnRzU3ltYm9sLFxuICAgICAgdHNUeXBlOiBzeW1ib2wudHNUeXBlLFxuICAgICAgc2hpbUxvY2F0aW9uOiBzeW1ib2wuc2hpbUxvY2F0aW9uLFxuICAgICAgaXNDb21wb25lbnQsXG4gICAgICBpc1N0cnVjdHVyYWwsXG4gICAgICBzZWxlY3RvcixcbiAgICAgIG5nTW9kdWxlLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGdldFN5bWJvbE9mVmFyaWFibGUodmFyaWFibGU6IFRtcGxBc3RWYXJpYWJsZSk6IFZhcmlhYmxlU3ltYm9sfG51bGwge1xuICAgIGNvbnN0IG5vZGUgPSBmaW5kRmlyc3RNYXRjaGluZ05vZGUoXG4gICAgICAgIHRoaXMudHlwZUNoZWNrQmxvY2ssIHt3aXRoU3BhbjogdmFyaWFibGUuc291cmNlU3BhbiwgZmlsdGVyOiB0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb259KTtcbiAgICBpZiAobm9kZSA9PT0gbnVsbCB8fCBub2RlLmluaXRpYWxpemVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGV4cHJlc3Npb25TeW1ib2wgPSB0aGlzLmdldFN5bWJvbE9mVHNOb2RlKG5vZGUuaW5pdGlhbGl6ZXIpO1xuICAgIGlmIChleHByZXNzaW9uU3ltYm9sID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHNUeXBlOiBleHByZXNzaW9uU3ltYm9sLnRzVHlwZSxcbiAgICAgIHRzU3ltYm9sOiBleHByZXNzaW9uU3ltYm9sLnRzU3ltYm9sLFxuICAgICAgaW5pdGlhbGl6ZXJMb2NhdGlvbjogZXhwcmVzc2lvblN5bWJvbC5zaGltTG9jYXRpb24sXG4gICAgICBraW5kOiBTeW1ib2xLaW5kLlZhcmlhYmxlLFxuICAgICAgZGVjbGFyYXRpb246IHZhcmlhYmxlLFxuICAgICAgbG9jYWxWYXJMb2NhdGlvbjoge1xuICAgICAgICBzaGltUGF0aDogdGhpcy5zaGltUGF0aCxcbiAgICAgICAgcG9zaXRpb25JblNoaW1GaWxlOiB0aGlzLmdldFNoaW1Qb3NpdGlvbkZvck5vZGUobm9kZS5uYW1lKSxcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTeW1ib2xPZlJlZmVyZW5jZShyZWY6IFRtcGxBc3RSZWZlcmVuY2UpOiBSZWZlcmVuY2VTeW1ib2x8bnVsbCB7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy50ZW1wbGF0ZURhdGEuYm91bmRUYXJnZXQuZ2V0UmVmZXJlbmNlVGFyZ2V0KHJlZik7XG4gICAgLy8gRmluZCB0aGUgbm9kZSBmb3IgdGhlIHJlZmVyZW5jZSBkZWNsYXJhdGlvbiwgaS5lLiBgdmFyIF90MiA9IF90MTtgXG4gICAgbGV0IG5vZGUgPSBmaW5kRmlyc3RNYXRjaGluZ05vZGUoXG4gICAgICAgIHRoaXMudHlwZUNoZWNrQmxvY2ssIHt3aXRoU3BhbjogcmVmLnNvdXJjZVNwYW4sIGZpbHRlcjogdHMuaXNWYXJpYWJsZURlY2xhcmF0aW9ufSk7XG4gICAgaWYgKG5vZGUgPT09IG51bGwgfHwgdGFyZ2V0ID09PSBudWxsIHx8IG5vZGUuaW5pdGlhbGl6ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gR2V0IHRoZSBvcmlnaW5hbCBkZWNsYXJhdGlvbiBmb3IgdGhlIHJlZmVyZW5jZXMgdmFyaWFibGUsIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiB0ZW1wbGF0ZSByZWZzXG4gICAgLy8gd2hpY2ggYXJlIG9mIHRoZSBmb3JtIHZhciBfdDMgPSAoX3QyIGFzIGFueSBhcyBpMi5UZW1wbGF0ZVJlZjxhbnk+KVxuICAgIC8vIFRPRE8oYXRzY290dCk6IENvbnNpZGVyIGFkZGluZyBhbiBgRXhwcmVzc2lvbklkZW50aWZpZXJgIHRvIHRhZyB2YXJpYWJsZSBkZWNsYXJhdGlvblxuICAgIC8vIGluaXRpYWxpemVycyBhcyBpbnZhbGlkIGZvciBzeW1ib2wgcmV0cmlldmFsLlxuICAgIGNvbnN0IG9yaWdpbmFsRGVjbGFyYXRpb24gPSB0cy5pc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGUuaW5pdGlhbGl6ZXIpICYmXG4gICAgICAgICAgICB0cy5pc0FzRXhwcmVzc2lvbihub2RlLmluaXRpYWxpemVyLmV4cHJlc3Npb24pID9cbiAgICAgICAgdGhpcy5nZXRUeXBlQ2hlY2tlcigpLmdldFN5bWJvbEF0TG9jYXRpb24obm9kZS5uYW1lKSA6XG4gICAgICAgIHRoaXMuZ2V0VHlwZUNoZWNrZXIoKS5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUuaW5pdGlhbGl6ZXIpO1xuICAgIGlmIChvcmlnaW5hbERlY2xhcmF0aW9uID09PSB1bmRlZmluZWQgfHwgb3JpZ2luYWxEZWNsYXJhdGlvbi52YWx1ZURlY2xhcmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzeW1ib2wgPSB0aGlzLmdldFN5bWJvbE9mVHNOb2RlKG9yaWdpbmFsRGVjbGFyYXRpb24udmFsdWVEZWNsYXJhdGlvbik7XG4gICAgaWYgKHN5bWJvbCA9PT0gbnVsbCB8fCBzeW1ib2wudHNTeW1ib2wgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlZmVyZW5jZVZhclNoaW1Mb2NhdGlvbjogU2hpbUxvY2F0aW9uID0ge1xuICAgICAgc2hpbVBhdGg6IHRoaXMuc2hpbVBhdGgsXG4gICAgICBwb3NpdGlvbkluU2hpbUZpbGU6IHRoaXMuZ2V0U2hpbVBvc2l0aW9uRm9yTm9kZShub2RlKSxcbiAgICB9O1xuICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBUbXBsQXN0VGVtcGxhdGUgfHwgdGFyZ2V0IGluc3RhbmNlb2YgVG1wbEFzdEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtpbmQ6IFN5bWJvbEtpbmQuUmVmZXJlbmNlLFxuICAgICAgICB0c1N5bWJvbDogc3ltYm9sLnRzU3ltYm9sLFxuICAgICAgICB0c1R5cGU6IHN5bWJvbC50c1R5cGUsXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAgZGVjbGFyYXRpb246IHJlZixcbiAgICAgICAgdGFyZ2V0TG9jYXRpb246IHN5bWJvbC5zaGltTG9jYXRpb24sXG4gICAgICAgIHJlZmVyZW5jZVZhckxvY2F0aW9uOiByZWZlcmVuY2VWYXJTaGltTG9jYXRpb24sXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXRzLmlzQ2xhc3NEZWNsYXJhdGlvbih0YXJnZXQuZGlyZWN0aXZlLnJlZi5ub2RlKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2luZDogU3ltYm9sS2luZC5SZWZlcmVuY2UsXG4gICAgICAgIHRzU3ltYm9sOiBzeW1ib2wudHNTeW1ib2wsXG4gICAgICAgIHRzVHlwZTogc3ltYm9sLnRzVHlwZSxcbiAgICAgICAgZGVjbGFyYXRpb246IHJlZixcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXQuZGlyZWN0aXZlLnJlZi5ub2RlLFxuICAgICAgICB0YXJnZXRMb2NhdGlvbjogc3ltYm9sLnNoaW1Mb2NhdGlvbixcbiAgICAgICAgcmVmZXJlbmNlVmFyTG9jYXRpb246IHJlZmVyZW5jZVZhclNoaW1Mb2NhdGlvbixcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRTeW1ib2xPZlBpcGUoZXhwcmVzc2lvbjogQmluZGluZ1BpcGUpOiBQaXBlU3ltYm9sfG51bGwge1xuICAgIGNvbnN0IG1ldGhvZEFjY2VzcyA9IGZpbmRGaXJzdE1hdGNoaW5nTm9kZShcbiAgICAgICAgdGhpcy50eXBlQ2hlY2tCbG9jayxcbiAgICAgICAge3dpdGhTcGFuOiBleHByZXNzaW9uLm5hbWVTcGFuLCBmaWx0ZXI6IHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9ufSk7XG4gICAgaWYgKG1ldGhvZEFjY2VzcyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcGlwZVZhcmlhYmxlTm9kZSA9IG1ldGhvZEFjY2Vzcy5leHByZXNzaW9uO1xuICAgIGNvbnN0IHBpcGVEZWNsYXJhdGlvbiA9IHRoaXMuZ2V0VHlwZUNoZWNrZXIoKS5nZXRTeW1ib2xBdExvY2F0aW9uKHBpcGVWYXJpYWJsZU5vZGUpO1xuICAgIGlmIChwaXBlRGVjbGFyYXRpb24gPT09IHVuZGVmaW5lZCB8fCBwaXBlRGVjbGFyYXRpb24udmFsdWVEZWNsYXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwaXBlSW5zdGFuY2UgPSB0aGlzLmdldFN5bWJvbE9mVHNOb2RlKHBpcGVEZWNsYXJhdGlvbi52YWx1ZURlY2xhcmF0aW9uKTtcbiAgICAvLyBUaGUgaW5zdGFuY2Ugc2hvdWxkIG5ldmVyIGJlIG51bGwsIG5vciBzaG91bGQgdGhlIHN5bWJvbCBsYWNrIGEgdmFsdWUgZGVjbGFyYXRpb24uIFRoaXNcbiAgICAvLyBpcyBiZWNhdXNlIHRoZSBub2RlIHVzZWQgdG8gbG9vayBmb3IgdGhlIGBwaXBlSW5zdGFuY2VgIHN5bWJvbCBpbmZvIGlzIGEgdmFsdWVcbiAgICAvLyBkZWNsYXJhdGlvbiBvZiBhbm90aGVyIHN5bWJvbCAoaS5lLiB0aGUgYHBpcGVEZWNsYXJhdGlvbmAgc3ltYm9sKS5cbiAgICBpZiAocGlwZUluc3RhbmNlID09PSBudWxsIHx8ICFpc1N5bWJvbFdpdGhWYWx1ZURlY2xhcmF0aW9uKHBpcGVJbnN0YW5jZS50c1N5bWJvbCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHN5bWJvbEluZm8gPSB0aGlzLmdldFN5bWJvbE9mVHNOb2RlKG1ldGhvZEFjY2Vzcyk7XG4gICAgaWYgKHN5bWJvbEluZm8gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBraW5kOiBTeW1ib2xLaW5kLlBpcGUsXG4gICAgICAuLi5zeW1ib2xJbmZvLFxuICAgICAgY2xhc3NTeW1ib2w6IHtcbiAgICAgICAgLi4ucGlwZUluc3RhbmNlLFxuICAgICAgICB0c1N5bWJvbDogcGlwZUluc3RhbmNlLnRzU3ltYm9sLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTeW1ib2xPZlRlbXBsYXRlRXhwcmVzc2lvbihleHByZXNzaW9uOiBBU1QpOiBWYXJpYWJsZVN5bWJvbHxSZWZlcmVuY2VTeW1ib2xcbiAgICAgIHxFeHByZXNzaW9uU3ltYm9sfG51bGwge1xuICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgQVNUV2l0aFNvdXJjZSkge1xuICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24uYXN0O1xuICAgIH1cblxuICAgIGNvbnN0IGV4cHJlc3Npb25UYXJnZXQgPSB0aGlzLnRlbXBsYXRlRGF0YS5ib3VuZFRhcmdldC5nZXRFeHByZXNzaW9uVGFyZ2V0KGV4cHJlc3Npb24pO1xuICAgIGlmIChleHByZXNzaW9uVGFyZ2V0ICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRTeW1ib2woZXhwcmVzc2lvblRhcmdldCk7XG4gICAgfVxuXG4gICAgLy8gVGhlIGBuYW1lYCBwYXJ0IG9mIGEgYFByb3BlcnR5V3JpdGVgIGFuZCBgTWV0aG9kQ2FsbGAgZG9lcyBub3QgaGF2ZSBpdHMgb3duXG4gICAgLy8gQVNUIHNvIHRoZXJlIGlzIG5vIHdheSB0byByZXRyaWV2ZSBhIGBTeW1ib2xgIGZvciBqdXN0IHRoZSBgbmFtZWAgdmlhIGEgc3BlY2lmaWMgbm9kZS5cbiAgICBjb25zdCB3aXRoU3BhbiA9IChleHByZXNzaW9uIGluc3RhbmNlb2YgUHJvcGVydHlXcml0ZSB8fCBleHByZXNzaW9uIGluc3RhbmNlb2YgTWV0aG9kQ2FsbCkgP1xuICAgICAgICBleHByZXNzaW9uLm5hbWVTcGFuIDpcbiAgICAgICAgZXhwcmVzc2lvbi5zb3VyY2VTcGFuO1xuXG4gICAgbGV0IG5vZGU6IHRzLk5vZGV8bnVsbCA9IG51bGw7XG5cbiAgICAvLyBQcm9wZXJ0eSByZWFkcyBpbiB0ZW1wbGF0ZXMgdXN1YWxseSBtYXAgdG8gYSBgUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uYFxuICAgIC8vIChlLmcuIGBjdHguZm9vYCkgc28gdHJ5IGxvb2tpbmcgZm9yIG9uZSBmaXJzdC5cbiAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFByb3BlcnR5UmVhZCkge1xuICAgICAgbm9kZSA9IGZpbmRGaXJzdE1hdGNoaW5nTm9kZShcbiAgICAgICAgICB0aGlzLnR5cGVDaGVja0Jsb2NrLCB7d2l0aFNwYW4sIGZpbHRlcjogdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb259KTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgZmFsbCBiYWNrIHRvIHNlYXJjaGluZyBmb3IgYW55IEFTVCBub2RlLlxuICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICBub2RlID0gZmluZEZpcnN0TWF0Y2hpbmdOb2RlKHRoaXMudHlwZUNoZWNrQmxvY2ssIHt3aXRoU3BhbiwgZmlsdGVyOiBhbnlOb2RlRmlsdGVyfSk7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHdoaWxlICh0cy5pc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICBub2RlID0gbm9kZS5leHByZXNzaW9uO1xuICAgIH1cblxuICAgIC8vIC0gSWYgd2UgaGF2ZSBzYWZlIHByb3BlcnR5IHJlYWQgKFwiYT8uYlwiKSB3ZSB3YW50IHRvIGdldCB0aGUgU3ltYm9sIGZvciBiLCB0aGUgYHdoZW5UcnVlYFxuICAgIC8vIGV4cHJlc3Npb24uXG4gICAgLy8gLSBJZiBvdXIgZXhwcmVzc2lvbiBpcyBhIHBpcGUgYmluZGluZyAoXCJhIHwgdGVzdDpiOmNcIiksIHdlIHdhbnQgdGhlIFN5bWJvbCBmb3IgdGhlXG4gICAgLy8gYHRyYW5zZm9ybWAgb24gdGhlIHBpcGUuXG4gICAgLy8gLSBPdGhlcndpc2UsIHdlIHJldHJpZXZlIHRoZSBzeW1ib2wgZm9yIHRoZSBub2RlIGl0c2VsZiB3aXRoIG5vIHNwZWNpYWwgY29uc2lkZXJhdGlvbnNcbiAgICBpZiAoKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBTYWZlUHJvcGVydHlSZWFkIHx8IGV4cHJlc3Npb24gaW5zdGFuY2VvZiBTYWZlTWV0aG9kQ2FsbCkgJiZcbiAgICAgICAgdHMuaXNDb25kaXRpb25hbEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIGNvbnN0IHdoZW5UcnVlU3ltYm9sID1cbiAgICAgICAgICAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFNhZmVNZXRob2RDYWxsICYmIHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZS53aGVuVHJ1ZSkpID9cbiAgICAgICAgICB0aGlzLmdldFN5bWJvbE9mVHNOb2RlKG5vZGUud2hlblRydWUuZXhwcmVzc2lvbikgOlxuICAgICAgICAgIHRoaXMuZ2V0U3ltYm9sT2ZUc05vZGUobm9kZS53aGVuVHJ1ZSk7XG4gICAgICBpZiAod2hlblRydWVTeW1ib2wgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLndoZW5UcnVlU3ltYm9sLFxuICAgICAgICBraW5kOiBTeW1ib2xLaW5kLkV4cHJlc3Npb24sXG4gICAgICAgIC8vIFJhdGhlciB0aGFuIHVzaW5nIHRoZSB0eXBlIG9mIG9ubHkgdGhlIGB3aGVuVHJ1ZWAgcGFydCBvZiB0aGUgZXhwcmVzc2lvbiwgd2Ugc2hvdWxkXG4gICAgICAgIC8vIHN0aWxsIGdldCB0aGUgdHlwZSBvZiB0aGUgd2hvbGUgY29uZGl0aW9uYWwgZXhwcmVzc2lvbiB0byBpbmNsdWRlIGB8dW5kZWZpbmVkYC5cbiAgICAgICAgdHNUeXBlOiB0aGlzLmdldFR5cGVDaGVja2VyKCkuZ2V0VHlwZUF0TG9jYXRpb24obm9kZSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHN5bWJvbEluZm8gPSB0aGlzLmdldFN5bWJvbE9mVHNOb2RlKG5vZGUpO1xuICAgICAgcmV0dXJuIHN5bWJvbEluZm8gPT09IG51bGwgPyBudWxsIDogey4uLnN5bWJvbEluZm8sIGtpbmQ6IFN5bWJvbEtpbmQuRXhwcmVzc2lvbn07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRTeW1ib2xPZlRzTm9kZShub2RlOiB0cy5Ob2RlKTogVHNOb2RlU3ltYm9sSW5mb3xudWxsIHtcbiAgICB3aGlsZSAodHMuaXNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgbm9kZSA9IG5vZGUuZXhwcmVzc2lvbjtcbiAgICB9XG5cbiAgICBsZXQgdHNTeW1ib2w6IHRzLlN5bWJvbHx1bmRlZmluZWQ7XG4gICAgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICB0c1N5bWJvbCA9IHRoaXMuZ2V0VHlwZUNoZWNrZXIoKS5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUubmFtZSk7XG4gICAgfSBlbHNlIGlmICh0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICB0c1N5bWJvbCA9IHRoaXMuZ2V0VHlwZUNoZWNrZXIoKS5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUuYXJndW1lbnRFeHByZXNzaW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHNTeW1ib2wgPSB0aGlzLmdldFR5cGVDaGVja2VyKCkuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBwb3NpdGlvbkluU2hpbUZpbGUgPSB0aGlzLmdldFNoaW1Qb3NpdGlvbkZvck5vZGUobm9kZSk7XG4gICAgY29uc3QgdHlwZSA9IHRoaXMuZ2V0VHlwZUNoZWNrZXIoKS5nZXRUeXBlQXRMb2NhdGlvbihub2RlKTtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gSWYgd2UgY291bGQgbm90IGZpbmQgYSBzeW1ib2wsIGZhbGwgYmFjayB0byB0aGUgc3ltYm9sIG9uIHRoZSB0eXBlIGZvciB0aGUgbm9kZS5cbiAgICAgIC8vIFNvbWUgbm9kZXMgd29uJ3QgaGF2ZSBhIFwic3ltYm9sIGF0IGxvY2F0aW9uXCIgYnV0IHdpbGwgaGF2ZSBhIHN5bWJvbCBmb3IgdGhlIHR5cGUuXG4gICAgICAvLyBFeGFtcGxlcyBvZiB0aGlzIHdvdWxkIGJlIGxpdGVyYWxzIGFuZCBgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylgLlxuICAgICAgdHNTeW1ib2w6IHRzU3ltYm9sID8/IHR5cGUuc3ltYm9sID8/IG51bGwsXG4gICAgICB0c1R5cGU6IHR5cGUsXG4gICAgICBzaGltTG9jYXRpb246IHtzaGltUGF0aDogdGhpcy5zaGltUGF0aCwgcG9zaXRpb25JblNoaW1GaWxlfSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTaGltUG9zaXRpb25Gb3JOb2RlKG5vZGU6IHRzLk5vZGUpOiBudW1iZXIge1xuICAgIGlmICh0cy5pc1R5cGVSZWZlcmVuY2VOb2RlKG5vZGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRTaGltUG9zaXRpb25Gb3JOb2RlKG5vZGUudHlwZU5hbWUpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNRdWFsaWZpZWROYW1lKG5vZGUpKSB7XG4gICAgICByZXR1cm4gbm9kZS5yaWdodC5nZXRTdGFydCgpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJldHVybiBub2RlLm5hbWUuZ2V0U3RhcnQoKTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzRWxlbWVudEFjY2Vzc0V4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHJldHVybiBub2RlLmFyZ3VtZW50RXhwcmVzc2lvbi5nZXRTdGFydCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbm9kZS5nZXRTdGFydCgpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogRmlsdGVyIHByZWRpY2F0ZSBmdW5jdGlvbiB0aGF0IG1hdGNoZXMgYW55IEFTVCBub2RlLiAqL1xuZnVuY3Rpb24gYW55Tm9kZUZpbHRlcihuOiB0cy5Ob2RlKTogbiBpcyB0cy5Ob2RlIHtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHNvdXJjZVNwYW5FcXVhbChhOiBQYXJzZVNvdXJjZVNwYW4sIGI6IFBhcnNlU291cmNlU3Bhbikge1xuICByZXR1cm4gYS5zdGFydC5vZmZzZXQgPT09IGIuc3RhcnQub2Zmc2V0ICYmIGEuZW5kLm9mZnNldCA9PT0gYi5lbmQub2Zmc2V0O1xufVxuIl19