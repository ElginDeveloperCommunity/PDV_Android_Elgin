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
        define("@angular/core/schematics/migrations/static-queries/strategies/usage_strategy/declaration_usage_visitor", ["require", "exports", "typescript", "@angular/core/schematics/utils/typescript/functions", "@angular/core/schematics/utils/typescript/property_name"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DeclarationUsageVisitor = exports.ResolvedUsage = void 0;
    const ts = require("typescript");
    const functions_1 = require("@angular/core/schematics/utils/typescript/functions");
    const property_name_1 = require("@angular/core/schematics/utils/typescript/property_name");
    var ResolvedUsage;
    (function (ResolvedUsage) {
        ResolvedUsage[ResolvedUsage["SYNCHRONOUS"] = 0] = "SYNCHRONOUS";
        ResolvedUsage[ResolvedUsage["ASYNCHRONOUS"] = 1] = "ASYNCHRONOUS";
        ResolvedUsage[ResolvedUsage["AMBIGUOUS"] = 2] = "AMBIGUOUS";
    })(ResolvedUsage = exports.ResolvedUsage || (exports.ResolvedUsage = {}));
    /**
     * List of TypeScript syntax tokens that can be used within a binary expression as
     * compound assignment. These imply a read and write of the left-side expression.
     */
    const BINARY_COMPOUND_TOKENS = [
        ts.SyntaxKind.CaretEqualsToken,
        ts.SyntaxKind.AsteriskEqualsToken,
        ts.SyntaxKind.AmpersandEqualsToken,
        ts.SyntaxKind.BarEqualsToken,
        ts.SyntaxKind.AsteriskAsteriskEqualsToken,
        ts.SyntaxKind.PlusEqualsToken,
        ts.SyntaxKind.MinusEqualsToken,
        ts.SyntaxKind.SlashEqualsToken,
    ];
    /**
     * List of known asynchronous external call expressions which aren't analyzable
     * but are guaranteed to not execute the passed argument synchronously.
     */
    const ASYNC_EXTERNAL_CALLS = [
        { parent: ['Promise'], name: 'then' },
        { parent: ['Promise'], name: 'catch' },
        { parent: [null, 'Window'], name: 'requestAnimationFrame' },
        { parent: [null, 'Window'], name: 'setTimeout' },
        { parent: [null, 'Window'], name: 'setInterval' },
        { parent: ['*'], name: 'addEventListener' },
    ];
    /**
     * Class that can be used to determine if a given TypeScript node is used within
     * other given TypeScript nodes. This is achieved by walking through all children
     * of the given node and checking for usages of the given declaration. The visitor
     * also handles potential control flow changes caused by call/new expressions.
     */
    class DeclarationUsageVisitor {
        constructor(declaration, typeChecker, baseContext = new Map()) {
            this.declaration = declaration;
            this.typeChecker = typeChecker;
            this.baseContext = baseContext;
            /** Set of visited symbols that caused a jump in control flow. */
            this.visitedJumpExprNodes = new Set();
            /**
             * Queue of nodes that need to be checked for declaration usage and
             * are guaranteed to be executed synchronously.
             */
            this.nodeQueue = [];
            /**
             * Nodes which need to be checked for declaration usage but aren't
             * guaranteed to execute synchronously.
             */
            this.ambiguousNodeQueue = [];
            /**
             * Function context that holds the TypeScript node values for all parameters
             * of the currently analyzed function block.
             */
            this.context = new Map();
        }
        isReferringToSymbol(node) {
            const symbol = this.typeChecker.getSymbolAtLocation(node);
            return !!symbol && symbol.valueDeclaration === this.declaration;
        }
        addJumpExpressionToQueue(callExpression) {
            const node = functions_1.unwrapExpression(callExpression.expression);
            // In case the given expression is already referring to a function-like declaration,
            // we don't need to resolve the symbol of the expression as the jump expression is
            // defined inline and we can just add the given node to the queue.
            if (functions_1.isFunctionLikeDeclaration(node) && node.body) {
                this.nodeQueue.push(node.body);
                return;
            }
            const callExprSymbol = this._getDeclarationSymbolOfNode(node);
            if (!callExprSymbol || !callExprSymbol.valueDeclaration) {
                this.peekIntoJumpExpression(callExpression);
                return;
            }
            const expressionDecl = this._resolveNodeFromContext(callExprSymbol.valueDeclaration);
            // Note that we should not add previously visited symbols to the queue as
            // this could cause cycles.
            if (!functions_1.isFunctionLikeDeclaration(expressionDecl) ||
                this.visitedJumpExprNodes.has(expressionDecl) || !expressionDecl.body) {
                this.peekIntoJumpExpression(callExpression);
                return;
            }
            // Update the context for the new jump expression and its specified arguments.
            this._updateContext(callExpression.arguments, expressionDecl.parameters);
            this.visitedJumpExprNodes.add(expressionDecl);
            this.nodeQueue.push(expressionDecl.body);
        }
        addNewExpressionToQueue(node) {
            const newExprSymbol = this._getDeclarationSymbolOfNode(functions_1.unwrapExpression(node.expression));
            // Only handle new expressions which resolve to classes. Technically "new" could
            // also call void functions or objects with a constructor signature. Also note that
            // we should not visit already visited symbols as this could cause cycles.
            if (!newExprSymbol || !newExprSymbol.valueDeclaration ||
                !ts.isClassDeclaration(newExprSymbol.valueDeclaration)) {
                this.peekIntoJumpExpression(node);
                return;
            }
            const targetConstructor = newExprSymbol.valueDeclaration.members.find(ts.isConstructorDeclaration);
            if (targetConstructor && targetConstructor.body &&
                !this.visitedJumpExprNodes.has(targetConstructor)) {
                // Update the context for the new expression and its specified constructor
                // parameters if arguments are passed to the class constructor.
                if (node.arguments) {
                    this._updateContext(node.arguments, targetConstructor.parameters);
                }
                this.visitedJumpExprNodes.add(targetConstructor);
                this.nodeQueue.push(targetConstructor.body);
            }
            else {
                this.peekIntoJumpExpression(node);
            }
        }
        visitPropertyAccessors(node, checkSetter, checkGetter) {
            const propertySymbol = this._getPropertyAccessSymbol(node);
            if ((propertySymbol === null || propertySymbol === void 0 ? void 0 : propertySymbol.declarations) === undefined || propertySymbol.declarations.length === 0 ||
                (propertySymbol.getFlags() & ts.SymbolFlags.Accessor) === 0) {
                return;
            }
            // Since we checked the symbol flags and the symbol is describing an accessor, the
            // declarations are guaranteed to only contain the getters and setters.
            const accessors = propertySymbol.declarations;
            accessors
                .filter(d => (checkSetter && ts.isSetAccessor(d) || checkGetter && ts.isGetAccessor(d)) &&
                d.body && !this.visitedJumpExprNodes.has(d))
                .forEach(d => {
                this.visitedJumpExprNodes.add(d);
                this.nodeQueue.push(d.body);
            });
        }
        visitBinaryExpression(node) {
            const leftExpr = functions_1.unwrapExpression(node.left);
            if (!ts.isPropertyAccessExpression(leftExpr)) {
                return false;
            }
            if (BINARY_COMPOUND_TOKENS.indexOf(node.operatorToken.kind) !== -1) {
                // Compound assignments always cause the getter and setter to be called.
                // Therefore we need to check the setter and getter of the property access.
                this.visitPropertyAccessors(leftExpr, /* setter */ true, /* getter */ true);
            }
            else if (node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
                // Value assignments using the equals token only cause the "setter" to be called.
                // Therefore we need to analyze the setter declaration of the property access.
                this.visitPropertyAccessors(leftExpr, /* setter */ true, /* getter */ false);
            }
            else {
                // If the binary expression is not an assignment, it's a simple property read and
                // we need to check the getter declaration if present.
                this.visitPropertyAccessors(leftExpr, /* setter */ false, /* getter */ true);
            }
            return true;
        }
        getResolvedNodeUsage(searchNode) {
            this.nodeQueue = [searchNode];
            this.visitedJumpExprNodes.clear();
            this.context.clear();
            // Copy base context values into the current function block context. The
            // base context is useful if nodes need to be mapped to other nodes. e.g.
            // abstract super class methods are mapped to their implementation node of
            // the derived class.
            this.baseContext.forEach((value, key) => this.context.set(key, value));
            return this.isSynchronouslyUsedInNode(searchNode);
        }
        isSynchronouslyUsedInNode(searchNode) {
            this.ambiguousNodeQueue = [];
            while (this.nodeQueue.length) {
                const node = this.nodeQueue.shift();
                if (ts.isIdentifier(node) && this.isReferringToSymbol(node)) {
                    return ResolvedUsage.SYNCHRONOUS;
                }
                // Handle call expressions within TypeScript nodes that cause a jump in control
                // flow. We resolve the call expression value declaration and add it to the node queue.
                if (ts.isCallExpression(node)) {
                    this.addJumpExpressionToQueue(node);
                }
                // Handle new expressions that cause a jump in control flow. We resolve the
                // constructor declaration of the target class and add it to the node queue.
                if (ts.isNewExpression(node)) {
                    this.addNewExpressionToQueue(node);
                }
                // We also need to handle binary expressions where a value can be either assigned to
                // the property, or a value is read from a property expression. Depending on the
                // binary expression operator, setters or getters need to be analyzed.
                if (ts.isBinaryExpression(node)) {
                    // In case the binary expression contained a property expression on the left side, we
                    // don't want to continue visiting this property expression on its own. This is necessary
                    // because visiting the expression on its own causes a loss of context. e.g. property
                    // access expressions *do not* always cause a value read (e.g. property assignments)
                    if (this.visitBinaryExpression(node)) {
                        this.nodeQueue.push(node.right);
                        continue;
                    }
                }
                // Handle property access expressions. Property expressions which are part of binary
                // expressions won't be added to the node queue, so these access expressions are
                // guaranteed to be "read" accesses and we need to check the "getter" declaration.
                if (ts.isPropertyAccessExpression(node)) {
                    this.visitPropertyAccessors(node, /* setter */ false, /* getter */ true);
                }
                // Do not visit nodes that declare a block of statements but are not executed
                // synchronously (e.g. function declarations). We only want to check TypeScript
                // nodes which are synchronously executed in the control flow.
                if (!functions_1.isFunctionLikeDeclaration(node)) {
                    this.nodeQueue.push(...node.getChildren());
                }
            }
            if (this.ambiguousNodeQueue.length) {
                // Update the node queue to all stored ambiguous nodes. These nodes are not
                // guaranteed to be executed and therefore in case of a synchronous usage
                // within one of those nodes, the resolved usage is ambiguous.
                this.nodeQueue = this.ambiguousNodeQueue;
                const usage = this.isSynchronouslyUsedInNode(searchNode);
                return usage === ResolvedUsage.SYNCHRONOUS ? ResolvedUsage.AMBIGUOUS : usage;
            }
            return ResolvedUsage.ASYNCHRONOUS;
        }
        /**
         * Peeks into the given jump expression by adding all function like declarations
         * which are referenced in the jump expression arguments to the ambiguous node
         * queue. These arguments could technically access the given declaration but it's
         * not guaranteed that the jump expression is executed. In that case the resolved
         * usage is ambiguous.
         */
        peekIntoJumpExpression(jumpExp) {
            if (!jumpExp.arguments) {
                return;
            }
            // For some call expressions we don't want to add the arguments to the
            // ambiguous node queue. e.g. "setTimeout" is not analyzable but is
            // guaranteed to execute its argument asynchronously. We handle a subset
            // of these call expressions by having a hardcoded list of some.
            if (ts.isCallExpression(jumpExp)) {
                const symbol = this._getDeclarationSymbolOfNode(jumpExp.expression);
                if (symbol && symbol.valueDeclaration) {
                    const parentNode = symbol.valueDeclaration.parent;
                    if (parentNode && (ts.isInterfaceDeclaration(parentNode) || ts.isSourceFile(parentNode)) &&
                        (ts.isMethodSignature(symbol.valueDeclaration) ||
                            ts.isFunctionDeclaration(symbol.valueDeclaration)) &&
                        symbol.valueDeclaration.name) {
                        const parentName = ts.isInterfaceDeclaration(parentNode) ? parentNode.name.text : null;
                        const callName = property_name_1.getPropertyNameText(symbol.valueDeclaration.name);
                        if (ASYNC_EXTERNAL_CALLS.some(c => (c.name === callName &&
                            (c.parent.indexOf(parentName) !== -1 || c.parent.indexOf('*') !== -1)))) {
                            return;
                        }
                    }
                }
            }
            jumpExp.arguments.forEach((node) => {
                node = this._resolveDeclarationOfNode(node);
                if (ts.isVariableDeclaration(node) && node.initializer) {
                    node = node.initializer;
                }
                if (functions_1.isFunctionLikeDeclaration(node) && !!node.body) {
                    this.ambiguousNodeQueue.push(node.body);
                }
            });
        }
        /**
         * Resolves a given node from the context. In case the node is not mapped in
         * the context, the original node is returned.
         */
        _resolveNodeFromContext(node) {
            if (this.context.has(node)) {
                return this.context.get(node);
            }
            return node;
        }
        /**
         * Updates the context to reflect the newly set parameter values. This allows future
         * references to function parameters to be resolved to the actual node through the context.
         */
        _updateContext(callArgs, parameters) {
            parameters.forEach((parameter, index) => {
                let argumentNode = callArgs[index];
                if (!argumentNode) {
                    if (!parameter.initializer) {
                        return;
                    }
                    // Argument can be undefined in case the function parameter has a default
                    // value. In that case we want to store the parameter default value in the context.
                    argumentNode = parameter.initializer;
                }
                if (ts.isIdentifier(argumentNode)) {
                    this.context.set(parameter, this._resolveDeclarationOfNode(argumentNode));
                }
                else {
                    this.context.set(parameter, argumentNode);
                }
            });
        }
        /**
         * Resolves the declaration of a given TypeScript node. For example an identifier can
         * refer to a function parameter. This parameter can then be resolved through the
         * function context.
         */
        _resolveDeclarationOfNode(node) {
            const symbol = this._getDeclarationSymbolOfNode(node);
            if (!symbol || !symbol.valueDeclaration) {
                return node;
            }
            return this._resolveNodeFromContext(symbol.valueDeclaration);
        }
        /**
         * Gets the declaration symbol of a given TypeScript node. Resolves aliased
         * symbols to the symbol containing the value declaration.
         */
        _getDeclarationSymbolOfNode(node) {
            let symbol = this.typeChecker.getSymbolAtLocation(node);
            if (!symbol) {
                return null;
            }
            // Resolve the symbol to it's original declaration symbol.
            while (symbol.flags & ts.SymbolFlags.Alias) {
                symbol = this.typeChecker.getAliasedSymbol(symbol);
            }
            return symbol;
        }
        /** Gets the symbol of the given property access expression. */
        _getPropertyAccessSymbol(node) {
            let propertySymbol = this._getDeclarationSymbolOfNode(node.name);
            if (!propertySymbol || !propertySymbol.valueDeclaration) {
                return null;
            }
            if (!this.context.has(propertySymbol.valueDeclaration)) {
                return propertySymbol;
            }
            // In case the context has the value declaration of the given property access
            // name identifier, we need to replace the "propertySymbol" with the symbol
            // referring to the resolved symbol based on the context. e.g. abstract properties
            // can ultimately resolve into an accessor declaration based on the implementation.
            const contextNode = this._resolveNodeFromContext(propertySymbol.valueDeclaration);
            if (!ts.isAccessor(contextNode)) {
                return null;
            }
            // Resolve the symbol referring to the "accessor" using the name identifier
            // of the accessor declaration.
            return this._getDeclarationSymbolOfNode(contextNode.name);
        }
    }
    exports.DeclarationUsageVisitor = DeclarationUsageVisitor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjbGFyYXRpb25fdXNhZ2VfdmlzaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy9taWdyYXRpb25zL3N0YXRpYy1xdWVyaWVzL3N0cmF0ZWdpZXMvdXNhZ2Vfc3RyYXRlZ3kvZGVjbGFyYXRpb25fdXNhZ2VfdmlzaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCxpQ0FBaUM7SUFDakMsbUZBQW1HO0lBQ25HLDJGQUErRTtJQUkvRSxJQUFZLGFBSVg7SUFKRCxXQUFZLGFBQWE7UUFDdkIsK0RBQVcsQ0FBQTtRQUNYLGlFQUFZLENBQUE7UUFDWiwyREFBUyxDQUFBO0lBQ1gsQ0FBQyxFQUpXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBSXhCO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTSxzQkFBc0IsR0FBRztRQUM3QixFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQjtRQUM5QixFQUFFLENBQUMsVUFBVSxDQUFDLG1CQUFtQjtRQUNqQyxFQUFFLENBQUMsVUFBVSxDQUFDLG9CQUFvQjtRQUNsQyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWM7UUFDNUIsRUFBRSxDQUFDLFVBQVUsQ0FBQywyQkFBMkI7UUFDekMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlO1FBQzdCLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCO1FBQzlCLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCO0tBQy9CLENBQUM7SUFFRjs7O09BR0c7SUFDSCxNQUFNLG9CQUFvQixHQUFHO1FBQzNCLEVBQUMsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBQztRQUNuQyxFQUFDLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUM7UUFDcEMs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RSxrRkFBa0Y7WUFDbEYsbUZBQW1GO1lBQ25GLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUVsRixJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDL0IsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELDJFQUEyRTtZQUMzRSwrQkFBK0I7WUFDL0IsT0FBTyxJQUFJLENBQUMsMkJBQTJCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVELENBQUM7S0FDRjtJQTdXRCwwREE2V0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge2lzRnVuY3Rpb25MaWtlRGVjbGFyYXRpb24sIHVud3JhcEV4cHJlc3Npb259IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxzL3R5cGVzY3JpcHQvZnVuY3Rpb25zJztcbmltcG9ydCB7Z2V0UHJvcGVydHlOYW1lVGV4dH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbHMvdHlwZXNjcmlwdC9wcm9wZXJ0eV9uYW1lJztcblxuZXhwb3J0IHR5cGUgRnVuY3Rpb25Db250ZXh0ID0gTWFwPHRzLk5vZGUsIHRzLk5vZGU+O1xuXG5leHBvcnQgZW51bSBSZXNvbHZlZFVzYWdlIHtcbiAgU1lOQ0hST05PVVMsXG4gIEFTWU5DSFJPTk9VUyxcbiAgQU1CSUdVT1VTLFxufVxuXG4vKipcbiAqIExpc3Qgb2YgVHlwZVNjcmlwdCBzeW50YXggdG9rZW5zIHRoYXQgY2FuIGJlIHVzZWQgd2l0aGluIGEgYmluYXJ5IGV4cHJlc3Npb24gYXNcbiAqIGNvbXBvdW5kIGFzc2lnbm1lbnQuIFRoZXNlIGltcGx5IGEgcmVhZCBhbmQgd3JpdGUgb2YgdGhlIGxlZnQtc2lkZSBleHByZXNzaW9uLlxuICovXG5jb25zdCBCSU5BUllfQ09NUE9VTkRfVE9LRU5TID0gW1xuICB0cy5TeW50YXhLaW5kLkNhcmV0RXF1YWxzVG9rZW4sXG4gIHRzLlN5bnRheEtpbmQuQXN0ZXJpc2tFcXVhbHNUb2tlbixcbiAgdHMuU3ludGF4S2luZC5BbXBlcnNhbmRFcXVhbHNUb2tlbixcbiAgdHMuU3ludGF4S2luZC5CYXJFcXVhbHNUb2tlbixcbiAgdHMuU3ludGF4S2luZC5Bc3Rlcmlza0FzdGVyaXNrRXF1YWxzVG9rZW4sXG4gIHRzLlN5bnRheEtpbmQuUGx1c0VxdWFsc1Rva2VuLFxuICB0cy5TeW50YXhLaW5kLk1pbnVzRXF1YWxzVG9rZW4sXG4gIHRzLlN5bnRheEtpbmQuU2xhc2hFcXVhbHNUb2tlbixcbl07XG5cbi8qKlxuICogTGlzdCBvZiBrbm93biBhc3luY2hyb25vdXMgZXh0ZXJuYWwgY2FsbCBleHByZXNzaW9ucyB3aGljaCBhcmVuJ3QgYW5hbHl6YWJsZVxuICogYnV0IGFyZSBndWFyYW50ZWVkIHRvIG5vdCBleGVjdXRlIHRoZSBwYXNzZWQgYXJndW1lbnQgc3luY2hyb25vdXNseS5cbiAqL1xuY29uc3QgQVNZTkNfRVhURVJOQUxfQ0FMTFMgPSBbXG4gIHtwYXJlbnQ6IFsnUHJvbWlzZSddLCBuYW1lOiAndGhlbid9LFxuICB7cGFyZW50OiBbJ1Byb21pc2UnXSwgbmFtZTogJ2NhdGNoJ30sXG4gIHtwYXJlbnQ6IFtudWxsLCAnV2luZG93J10sIG5hbWU6ICdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnfSxcbiAge3BhcmVudDogW251bGwsICdXaW5kb3cnXSwgbmFtZTogJ3NldFRpbWVvdXQnfSxcbiAge3BhcmVudDogW251bGwsICdXaW5kb3cnXSwgbmFtZTogJ3NldEludGVydmFsJ30sXG4gIHtwYXJlbnQ6IFsnKiddLCBuYW1lOiAnYWRkRXZlbnRMaXN0ZW5lcid9LFxuXTtcblxuLyoqXG4gKiBDbGFzcyB0aGF0IGNhbiBiZSB1c2VkIHRvIGRldGVybWluZSBpZiBhIGdpdmVuIFR5cGVTY3JpcHQgbm9kZSBpcyB1c2VkIHdpdGhpblxuICogb3RoZXIgZ2l2ZW4gVHlwZVNjcmlwdCBub2Rlcy4gVGhpcyBpcyBhY2hpZXZlZCBieSB3YWxraW5nIHRocm91Z2ggYWxsIGNoaWxkcmVuXG4gKiBvZiB0aGUgZ2l2ZW4gbm9kZSBhbmQgY2hlY2tpbmcgZm9yIHVzYWdlcyBvZiB0aGUgZ2l2ZW4gZGVjbGFyYXRpb24uIFRoZSB2aXNpdG9yXG4gKiBhbHNvIGhhbmRsZXMgcG90ZW50aWFsIGNvbnRyb2wgZmxvdyBjaGFuZ2VzIGNhdXNlZCBieSBjYWxsL25ldyBleHByZXNzaW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIERlY2xhcmF0aW9uVXNhZ2VWaXNpdG9yIHtcbiAgLyoqIFNldCBvZiB2aXNpdGVkIHN5bWJvbHMgdGhhdCBjYXVzZWQgYSBqdW1wIGluIGNvbnRyb2wgZmxvdy4gKi9cbiAgcHJpdmF0ZSB2aXNpdGVkSnVtcEV4cHJOb2RlcyA9IG5ldyBTZXQ8dHMuTm9kZT4oKTtcblxuICAvKipcbiAgICogUXVldWUgb2Ygbm9kZXMgdGhhdCBuZWVkIHRvIGJlIGNoZWNrZWQgZm9yIGRlY2xhcmF0aW9uIHVzYWdlIGFuZFxuICAgKiBhcmUgZ3VhcmFudGVlZCB0byBiZSBleGVjdXRlZCBzeW5jaHJvbm91c2x5LlxuICAgKi9cbiAgcHJpdmF0ZSBub2RlUXVldWU6IHRzLk5vZGVbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBOb2RlcyB3aGljaCBuZWVkIHRvIGJlIGNoZWNrZWQgZm9yIGRlY2xhcmF0aW9uIHVzYWdlIGJ1dCBhcmVuJ3RcbiAgICogZ3VhcmFudGVlZCB0byBleGVjdXRlIHN5bmNocm9ub3VzbHkuXG4gICAqL1xuICBwcml2YXRlIGFtYmlndW91c05vZGVRdWV1ZTogdHMuTm9kZVtdID0gW107XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIGNvbnRleHQgdGhhdCBob2xkcyB0aGUgVHlwZVNjcmlwdCBub2RlIHZhbHVlcyBmb3IgYWxsIHBhcmFtZXRlcnNcbiAgICogb2YgdGhlIGN1cnJlbnRseSBhbmFseXplZCBmdW5jdGlvbiBibG9jay5cbiAgICovXG4gIHByaXZhdGUgY29udGV4dDogRnVuY3Rpb25Db250ZXh0ID0gbmV3IE1hcCgpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBkZWNsYXJhdGlvbjogdHMuTm9kZSwgcHJpdmF0ZSB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsXG4gICAgICBwcml2YXRlIGJhc2VDb250ZXh0OiBGdW5jdGlvbkNvbnRleHQgPSBuZXcgTWFwKCkpIHt9XG5cbiAgcHJpdmF0ZSBpc1JlZmVycmluZ1RvU3ltYm9sKG5vZGU6IHRzLk5vZGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBzeW1ib2wgPSB0aGlzLnR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24obm9kZSk7XG4gICAgcmV0dXJuICEhc3ltYm9sICYmIHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uID09PSB0aGlzLmRlY2xhcmF0aW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRKdW1wRXhwcmVzc2lvblRvUXVldWUoY2FsbEV4cHJlc3Npb246IHRzLkNhbGxFeHByZXNzaW9uKSB7XG4gICAgY29uc3Qgbm9kZSA9IHVud3JhcEV4cHJlc3Npb24oY2FsbEV4cHJlc3Npb24uZXhwcmVzc2lvbik7XG5cbiAgICAvLyBJbiBjYXNlIHRoZSBnaXZlbiBleHByZXNzaW9uIGlzIGFscmVhZHkgcmVmZXJyaW5nIHRvIGEgZnVuY3Rpb24tbGlrZSBkZWNsYXJhdGlvbixcbiAgICAvLyB3ZSBkb24ndCBuZWVkIHRvIHJlc29sdmUgdGhlIHN5bWJvbCBvZiB0aGUgZXhwcmVzc2lvbiBhcyB0aGUganVtcCBleHByZXNzaW9uIGlzXG4gICAgLy8gZGVmaW5lZCBpbmxpbmUgYW5kIHdlIGNhbiBqdXN0IGFkZCB0aGUgZ2l2ZW4gbm9kZSB0byB0aGUgcXVldWUuXG4gICAgaWYgKGlzRnVuY3Rpb25MaWtlRGVjbGFyYXRpb24obm9kZSkgJiYgbm9kZS5ib2R5KSB7XG4gICAgICB0aGlzLm5vZGVRdWV1ZS5wdXNoKG5vZGUuYm9keSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY2FsbEV4cHJTeW1ib2wgPSB0aGlzLl9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlKTtcblxuICAgIGlmICghY2FsbEV4cHJTeW1ib2wgfHwgIWNhbGxFeHByU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pIHtcbiAgICAgIHRoaXMucGVla0ludG9KdW1wRXhwcmVzc2lvbihjYWxsRXhwcmVzc2lvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZXhwcmVzc2lvbkRlY2wgPSB0aGlzLl9yZXNvbHZlTm9kZUZyb21Db250ZXh0KGNhbGxFeHByU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pO1xuXG4gICAgLy8gTm90ZSB0aGF0IHdlIHNob3VsZCBub3QgYWRkIHByZXZpb3VzbHkgdmlzaXRlZCBzeW1ib2xzIHRvIHRoZSBxdWV1ZSBhc1xuICAgIC8vIHRoaXMgY291bGQgY2F1c2UgY3ljbGVzLlxuICAgIGlmICghaXNGdW5jdGlvbkxpa2VEZWNsYXJhdGlvbihleHByZXNzaW9uRGVjbCkgfHxcbiAgICAgICAgdGhpcy52aXNpdGVkSnVtcEV4cHJOb2Rlcy5oYXMoZXhwcmVzc2lvbkRlY2wpIHx8ICFleHByZXNzaW9uRGVjbC5ib2R5KSB7XG4gICAgICB0aGlzLnBlZWtJbnRvSnVtcEV4cHJlc3Npb24oY2FsbEV4cHJlc3Npb24pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgY29udGV4dCBmb3IgdGhlIG5ldyBqdW1wIGV4cHJlc3Npb24gYW5kIGl0cyBzcGVjaWZpZWQgYXJndW1lbnRzLlxuICAgIHRoaXMuX3VwZGF0ZUNvbnRleHQoY2FsbEV4cHJlc3Npb24uYXJndW1lbnRzLCBleHByZXNzaW9uRGVjbC5wYXJhbWV0ZXJzKTtcblxuICAgIHRoaXMudmlzaXRlZEp1bXBFeHByTm9kZXMuYWRkKGV4cHJlc3Npb25EZWNsKTtcbiAgICB0aGlzLm5vZGVRdWV1ZS5wdXNoKGV4cHJlc3Npb25EZWNsLmJvZHkpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGROZXdFeHByZXNzaW9uVG9RdWV1ZShub2RlOiB0cy5OZXdFeHByZXNzaW9uKSB7XG4gICAgY29uc3QgbmV3RXhwclN5bWJvbCA9IHRoaXMuX2dldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKSk7XG5cbiAgICAvLyBPbmx5IGhhbmRsZSBuZXcgZXhwcmVzc2lvbnMgd2hpY2ggcmVzb2x2ZSB0byBjbGFzc2VzLiBUZWNobmljYWxseSBcIm5ld1wiIGNvdWxkXG4gICAgLy8gYWxzbyBjYWxsIHZvaWQgZnVuY3Rpb25zIG9yIG9iamVjdHMgd2l0aCBhIGNvbnN0cnVjdG9yIHNpZ25hdHVyZS4gQWxzbyBub3RlIHRoYXRcbiAgICAvLyB3ZSBzaG91bGQgbm90IHZpc2l0IGFscmVhZHkgdmlzaXRlZCBzeW1ib2xzIGFzIHRoaXMgY291bGQgY2F1c2UgY3ljbGVzLlxuICAgIGlmICghbmV3RXhwclN5bWJvbCB8fCAhbmV3RXhwclN5bWJvbC52YWx1ZURlY2xhcmF0aW9uIHx8XG4gICAgICAgICF0cy5pc0NsYXNzRGVjbGFyYXRpb24obmV3RXhwclN5bWJvbC52YWx1ZURlY2xhcmF0aW9uKSkge1xuICAgICAgdGhpcy5wZWVrSW50b0p1bXBFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldENvbnN0cnVjdG9yID1cbiAgICAgICAgbmV3RXhwclN5bWJvbC52YWx1ZURlY2xhcmF0aW9uLm1lbWJlcnMuZmluZCh0cy5pc0NvbnN0cnVjdG9yRGVjbGFyYXRpb24pO1xuXG4gICAgaWYgKHRhcmdldENvbnN0cnVjdG9yICYmIHRhcmdldENvbnN0cnVjdG9yLmJvZHkgJiZcbiAgICAgICAgIXRoaXMudmlzaXRlZEp1bXBFeHByTm9kZXMuaGFzKHRhcmdldENvbnN0cnVjdG9yKSkge1xuICAgICAgLy8gVXBkYXRlIHRoZSBjb250ZXh0IGZvciB0aGUgbmV3IGV4cHJlc3Npb24gYW5kIGl0cyBzcGVjaWZpZWQgY29uc3RydWN0b3JcbiAgICAgIC8vIHBhcmFtZXRlcnMgaWYgYXJndW1lbnRzIGFyZSBwYXNzZWQgdG8gdGhlIGNsYXNzIGNvbnN0cnVjdG9yLlxuICAgICAgaWYgKG5vZGUuYXJndW1lbnRzKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNvbnRleHQobm9kZS5hcmd1bWVudHMsIHRhcmdldENvbnN0cnVjdG9yLnBhcmFtZXRlcnMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZpc2l0ZWRKdW1wRXhwck5vZGVzLmFkZCh0YXJnZXRDb25zdHJ1Y3Rvcik7XG4gICAgICB0aGlzLm5vZGVRdWV1ZS5wdXNoKHRhcmdldENvbnN0cnVjdG9yLmJvZHkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBlZWtJbnRvSnVtcEV4cHJlc3Npb24obm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdFByb3BlcnR5QWNjZXNzb3JzKFxuICAgICAgbm9kZTogdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uLCBjaGVja1NldHRlcjogYm9vbGVhbiwgY2hlY2tHZXR0ZXI6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBwcm9wZXJ0eVN5bWJvbCA9IHRoaXMuX2dldFByb3BlcnR5QWNjZXNzU3ltYm9sKG5vZGUpO1xuXG4gICAgaWYgKHByb3BlcnR5U3ltYm9sPy5kZWNsYXJhdGlvbnMgPT09IHVuZGVmaW5lZCB8fCBwcm9wZXJ0eVN5bWJvbC5kZWNsYXJhdGlvbnMubGVuZ3RoID09PSAwIHx8XG4gICAgICAgIChwcm9wZXJ0eVN5bWJvbC5nZXRGbGFncygpICYgdHMuU3ltYm9sRmxhZ3MuQWNjZXNzb3IpID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU2luY2Ugd2UgY2hlY2tlZCB0aGUgc3ltYm9sIGZsYWdzIGFuZCB0aGUgc3ltYm9sIGlzIGRlc2NyaWJpbmcgYW4gYWNjZXNzb3IsIHRoZVxuICAgIC8vIGRlY2xhcmF0aW9ucyBhcmUgZ3VhcmFudGVlZCB0byBvbmx5IGNvbnRhaW4gdGhlIGdldHRlcnMgYW5kIHNldHRlcnMuXG4gICAgY29uc3QgYWNjZXNzb3JzID0gcHJvcGVydHlTeW1ib2wuZGVjbGFyYXRpb25zIGFzIHRzLkFjY2Vzc29yRGVjbGFyYXRpb25bXTtcblxuICAgIGFjY2Vzc29yc1xuICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgICAgZCA9PiAoY2hlY2tTZXR0ZXIgJiYgdHMuaXNTZXRBY2Nlc3NvcihkKSB8fCBjaGVja0dldHRlciAmJiB0cy5pc0dldEFjY2Vzc29yKGQpKSAmJlxuICAgICAgICAgICAgICAgIGQuYm9keSAmJiAhdGhpcy52aXNpdGVkSnVtcEV4cHJOb2Rlcy5oYXMoZCkpXG4gICAgICAgIC5mb3JFYWNoKGQgPT4ge1xuICAgICAgICAgIHRoaXMudmlzaXRlZEp1bXBFeHByTm9kZXMuYWRkKGQpO1xuICAgICAgICAgIHRoaXMubm9kZVF1ZXVlLnB1c2goZC5ib2R5ISk7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdEJpbmFyeUV4cHJlc3Npb24obm9kZTogdHMuQmluYXJ5RXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGxlZnRFeHByID0gdW53cmFwRXhwcmVzc2lvbihub2RlLmxlZnQpO1xuXG4gICAgaWYgKCF0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihsZWZ0RXhwcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoQklOQVJZX0NPTVBPVU5EX1RPS0VOUy5pbmRleE9mKG5vZGUub3BlcmF0b3JUb2tlbi5raW5kKSAhPT0gLTEpIHtcbiAgICAgIC8vIENvbXBvdW5kIGFzc2lnbm1lbnRzIGFsd2F5cyBjYXVzZSB0aGUgZ2V0dGVyIGFuZCBzZXR0ZXIgdG8gYmUgY2FsbGVkLlxuICAgICAgLy8gVGhlcmVmb3JlIHdlIG5lZWQgdG8gY2hlY2sgdGhlIHNldHRlciBhbmQgZ2V0dGVyIG9mIHRoZSBwcm9wZXJ0eSBhY2Nlc3MuXG4gICAgICB0aGlzLnZpc2l0UHJvcGVydHlBY2Nlc3NvcnMobGVmdEV4cHIsIC8qIHNldHRlciAqLyB0cnVlLCAvKiBnZXR0ZXIgKi8gdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChub2RlLm9wZXJhdG9yVG9rZW4ua2luZCA9PT0gdHMuU3ludGF4S2luZC5FcXVhbHNUb2tlbikge1xuICAgICAgLy8gVmFsdWUgYXNzaWdubWVudHMgdXNpbmcgdGhlIGVxdWFscyB0b2tlbiBvbmx5IGNhdXNlIHRoZSBcInNldHRlclwiIHRvIGJlIGNhbGxlZC5cbiAgICAgIC8vIFRoZXJlZm9yZSB3ZSBuZWVkIHRvIGFuYWx5emUgdGhlIHNldHRlciBkZWNsYXJhdGlvbiBvZiB0aGUgcHJvcGVydHkgYWNjZXNzLlxuICAgICAgdGhpcy52aXNpdFByb3BlcnR5QWNjZXNzb3JzKGxlZnRFeHByLCAvKiBzZXR0ZXIgKi8gdHJ1ZSwgLyogZ2V0dGVyICovIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlIGJpbmFyeSBleHByZXNzaW9uIGlzIG5vdCBhbiBhc3NpZ25tZW50LCBpdCdzIGEgc2ltcGxlIHByb3BlcnR5IHJlYWQgYW5kXG4gICAgICAvLyB3ZSBuZWVkIHRvIGNoZWNrIHRoZSBnZXR0ZXIgZGVjbGFyYXRpb24gaWYgcHJlc2VudC5cbiAgICAgIHRoaXMudmlzaXRQcm9wZXJ0eUFjY2Vzc29ycyhsZWZ0RXhwciwgLyogc2V0dGVyICovIGZhbHNlLCAvKiBnZXR0ZXIgKi8gdHJ1ZSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZ2V0UmVzb2x2ZWROb2RlVXNhZ2Uoc2VhcmNoTm9kZTogdHMuTm9kZSk6IFJlc29sdmVkVXNhZ2Uge1xuICAgIHRoaXMubm9kZVF1ZXVlID0gW3NlYXJjaE5vZGVdO1xuICAgIHRoaXMudmlzaXRlZEp1bXBFeHByTm9kZXMuY2xlYXIoKTtcbiAgICB0aGlzLmNvbnRleHQuY2xlYXIoKTtcblxuICAgIC8vIENvcHkgYmFzZSBjb250ZXh0IHZhbHVlcyBpbnRvIHRoZSBjdXJyZW50IGZ1bmN0aW9uIGJsb2NrIGNvbnRleHQuIFRoZVxuICAgIC8vIGJhc2UgY29udGV4dCBpcyB1c2VmdWwgaWYgbm9kZXMgbmVlZCB0byBiZSBtYXBwZWQgdG8gb3RoZXIgbm9kZXMuIGUuZy5cbiAgICAvLyBhYnN0cmFjdCBzdXBlciBjbGFzcyBtZXRob2RzIGFyZSBtYXBwZWQgdG8gdGhlaXIgaW1wbGVtZW50YXRpb24gbm9kZSBvZlxuICAgIC8vIHRoZSBkZXJpdmVkIGNsYXNzLlxuICAgIHRoaXMuYmFzZUNvbnRleHQuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4gdGhpcy5jb250ZXh0LnNldChrZXksIHZhbHVlKSk7XG5cbiAgICByZXR1cm4gdGhpcy5pc1N5bmNocm9ub3VzbHlVc2VkSW5Ob2RlKHNlYXJjaE5vZGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1N5bmNocm9ub3VzbHlVc2VkSW5Ob2RlKHNlYXJjaE5vZGU6IHRzLk5vZGUpOiBSZXNvbHZlZFVzYWdlIHtcbiAgICB0aGlzLmFtYmlndW91c05vZGVRdWV1ZSA9IFtdO1xuXG4gICAgd2hpbGUgKHRoaXMubm9kZVF1ZXVlLmxlbmd0aCkge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZVF1ZXVlLnNoaWZ0KCkhO1xuXG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpICYmIHRoaXMuaXNSZWZlcnJpbmdUb1N5bWJvbChub2RlKSkge1xuICAgICAgICByZXR1cm4gUmVzb2x2ZWRVc2FnZS5TWU5DSFJPTk9VUztcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIGNhbGwgZXhwcmVzc2lvbnMgd2l0aGluIFR5cGVTY3JpcHQgbm9kZXMgdGhhdCBjYXVzZSBhIGp1bXAgaW4gY29udHJvbFxuICAgICAgLy8gZmxvdy4gV2UgcmVzb2x2ZSB0aGUgY2FsbCBleHByZXNzaW9uIHZhbHVlIGRlY2xhcmF0aW9uIGFuZCBhZGQgaXQgdG8gdGhlIG5vZGUgcXVldWUuXG4gICAgICBpZiAodHMuaXNDYWxsRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgICB0aGlzLmFkZEp1bXBFeHByZXNzaW9uVG9RdWV1ZShub2RlKTtcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIG5ldyBleHByZXNzaW9ucyB0aGF0IGNhdXNlIGEganVtcCBpbiBjb250cm9sIGZsb3cuIFdlIHJlc29sdmUgdGhlXG4gICAgICAvLyBjb25zdHJ1Y3RvciBkZWNsYXJhdGlvbiBvZiB0aGUgdGFyZ2V0IGNsYXNzIGFuZCBhZGQgaXQgdG8gdGhlIG5vZGUgcXVldWUuXG4gICAgICBpZiAodHMuaXNOZXdFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICAgIHRoaXMuYWRkTmV3RXhwcmVzc2lvblRvUXVldWUobm9kZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFdlIGFsc28gbmVlZCB0byBoYW5kbGUgYmluYXJ5IGV4cHJlc3Npb25zIHdoZXJlIGEgdmFsdWUgY2FuIGJlIGVpdGhlciBhc3NpZ25lZCB0b1xuICAgICAgLy8gdGhlIHByb3BlcnR5LCBvciBhIHZhbHVlIGlzIHJlYWQgZnJvbSBhIHByb3BlcnR5IGV4cHJlc3Npb24uIERlcGVuZGluZyBvbiB0aGVcbiAgICAgIC8vIGJpbmFyeSBleHByZXNzaW9uIG9wZXJhdG9yLCBzZXR0ZXJzIG9yIGdldHRlcnMgbmVlZCB0byBiZSBhbmFseXplZC5cbiAgICAgIGlmICh0cy5pc0JpbmFyeUV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgICAgLy8gSW4gY2FzZSB0aGUgYmluYXJ5IGV4cHJlc3Npb24gY29udGFpbmVkIGEgcHJvcGVydHkgZXhwcmVzc2lvbiBvbiB0aGUgbGVmdCBzaWRlLCB3ZVxuICAgICAgICAvLyBkb24ndCB3YW50IHRvIGNvbnRpbnVlIHZpc2l0aW5nIHRoaXMgcHJvcGVydHkgZXhwcmVzc2lvbiBvbiBpdHMgb3duLiBUaGlzIGlzIG5lY2Vzc2FyeVxuICAgICAgICAvLyBiZWNhdXNlIHZpc2l0aW5nIHRoZSBleHByZXNzaW9uIG9uIGl0cyBvd24gY2F1c2VzIGEgbG9zcyBvZiBjb250ZXh0LiBlLmcuIHByb3BlcnR5XG4gICAgICAgIC8vIGFjY2VzcyBleHByZXNzaW9ucyAqZG8gbm90KiBhbHdheXMgY2F1c2UgYSB2YWx1ZSByZWFkIChlLmcuIHByb3BlcnR5IGFzc2lnbm1lbnRzKVxuICAgICAgICBpZiAodGhpcy52aXNpdEJpbmFyeUV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgICAgICB0aGlzLm5vZGVRdWV1ZS5wdXNoKG5vZGUucmlnaHQpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZSBwcm9wZXJ0eSBhY2Nlc3MgZXhwcmVzc2lvbnMuIFByb3BlcnR5IGV4cHJlc3Npb25zIHdoaWNoIGFyZSBwYXJ0IG9mIGJpbmFyeVxuICAgICAgLy8gZXhwcmVzc2lvbnMgd29uJ3QgYmUgYWRkZWQgdG8gdGhlIG5vZGUgcXVldWUsIHNvIHRoZXNlIGFjY2VzcyBleHByZXNzaW9ucyBhcmVcbiAgICAgIC8vIGd1YXJhbnRlZWQgdG8gYmUgXCJyZWFkXCIgYWNjZXNzZXMgYW5kIHdlIG5lZWQgdG8gY2hlY2sgdGhlIFwiZ2V0dGVyXCIgZGVjbGFyYXRpb24uXG4gICAgICBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgICAgdGhpcy52aXNpdFByb3BlcnR5QWNjZXNzb3JzKG5vZGUsIC8qIHNldHRlciAqLyBmYWxzZSwgLyogZ2V0dGVyICovIHRydWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBEbyBub3QgdmlzaXQgbm9kZXMgdGhhdCBkZWNsYXJlIGEgYmxvY2sgb2Ygc3RhdGVtZW50cyBidXQgYXJlIG5vdCBleGVjdXRlZFxuICAgICAgLy8gc3luY2hyb25vdXNseSAoZS5nLiBmdW5jdGlvbiBkZWNsYXJhdGlvbnMpLiBXZSBvbmx5IHdhbnQgdG8gY2hlY2sgVHlwZVNjcmlwdFxuICAgICAgLy8gbm9kZXMgd2hpY2ggYXJlIHN5bmNocm9ub3VzbHkgZXhlY3V0ZWQgaW4gdGhlIGNvbnRyb2wgZmxvdy5cbiAgICAgIGlmICghaXNGdW5jdGlvbkxpa2VEZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgICB0aGlzLm5vZGVRdWV1ZS5wdXNoKC4uLm5vZGUuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYW1iaWd1b3VzTm9kZVF1ZXVlLmxlbmd0aCkge1xuICAgICAgLy8gVXBkYXRlIHRoZSBub2RlIHF1ZXVlIHRvIGFsbCBzdG9yZWQgYW1iaWd1b3VzIG5vZGVzLiBUaGVzZSBub2RlcyBhcmUgbm90XG4gICAgICAvLyBndWFyYW50ZWVkIHRvIGJlIGV4ZWN1dGVkIGFuZCB0aGVyZWZvcmUgaW4gY2FzZSBvZiBhIHN5bmNocm9ub3VzIHVzYWdlXG4gICAgICAvLyB3aXRoaW4gb25lIG9mIHRob3NlIG5vZGVzLCB0aGUgcmVzb2x2ZWQgdXNhZ2UgaXMgYW1iaWd1b3VzLlxuICAgICAgdGhpcy5ub2RlUXVldWUgPSB0aGlzLmFtYmlndW91c05vZGVRdWV1ZTtcbiAgICAgIGNvbnN0IHVzYWdlID0gdGhpcy5pc1N5bmNocm9ub3VzbHlVc2VkSW5Ob2RlKHNlYXJjaE5vZGUpO1xuICAgICAgcmV0dXJuIHVzYWdlID09PSBSZXNvbHZlZFVzYWdlLlNZTkNIUk9OT1VTID8gUmVzb2x2ZWRVc2FnZS5BTUJJR1VPVVMgOiB1c2FnZTtcbiAgICB9XG4gICAgcmV0dXJuIFJlc29sdmVkVXNhZ2UuQVNZTkNIUk9OT1VTO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlZWtzIGludG8gdGhlIGdpdmVuIGp1bXAgZXhwcmVzc2lvbiBieSBhZGRpbmcgYWxsIGZ1bmN0aW9uIGxpa2UgZGVjbGFyYXRpb25zXG4gICAqIHdoaWNoIGFyZSByZWZlcmVuY2VkIGluIHRoZSBqdW1wIGV4cHJlc3Npb24gYXJndW1lbnRzIHRvIHRoZSBhbWJpZ3VvdXMgbm9kZVxuICAgKiBxdWV1ZS4gVGhlc2UgYXJndW1lbnRzIGNvdWxkIHRlY2huaWNhbGx5IGFjY2VzcyB0aGUgZ2l2ZW4gZGVjbGFyYXRpb24gYnV0IGl0J3NcbiAgICogbm90IGd1YXJhbnRlZWQgdGhhdCB0aGUganVtcCBleHByZXNzaW9uIGlzIGV4ZWN1dGVkLiBJbiB0aGF0IGNhc2UgdGhlIHJlc29sdmVkXG4gICAqIHVzYWdlIGlzIGFtYmlndW91cy5cbiAgICovXG4gIHByaXZhdGUgcGVla0ludG9KdW1wRXhwcmVzc2lvbihqdW1wRXhwOiB0cy5DYWxsRXhwcmVzc2lvbnx0cy5OZXdFeHByZXNzaW9uKSB7XG4gICAgaWYgKCFqdW1wRXhwLmFyZ3VtZW50cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZvciBzb21lIGNhbGwgZXhwcmVzc2lvbnMgd2UgZG9uJ3Qgd2FudCB0byBhZGQgdGhlIGFyZ3VtZW50cyB0byB0aGVcbiAgICAvLyBhbWJpZ3VvdXMgbm9kZSBxdWV1ZS4gZS5nLiBcInNldFRpbWVvdXRcIiBpcyBub3QgYW5hbHl6YWJsZSBidXQgaXNcbiAgICAvLyBndWFyYW50ZWVkIHRvIGV4ZWN1dGUgaXRzIGFyZ3VtZW50IGFzeW5jaHJvbm91c2x5LiBXZSBoYW5kbGUgYSBzdWJzZXRcbiAgICAvLyBvZiB0aGVzZSBjYWxsIGV4cHJlc3Npb25zIGJ5IGhhdmluZyBhIGhhcmRjb2RlZCBsaXN0IG9mIHNvbWUuXG4gICAgaWYgKHRzLmlzQ2FsbEV4cHJlc3Npb24oanVtcEV4cCkpIHtcbiAgICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMuX2dldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKGp1bXBFeHAuZXhwcmVzc2lvbik7XG4gICAgICBpZiAoc3ltYm9sICYmIHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbi5wYXJlbnQ7XG4gICAgICAgIGlmIChwYXJlbnROb2RlICYmICh0cy5pc0ludGVyZmFjZURlY2xhcmF0aW9uKHBhcmVudE5vZGUpIHx8IHRzLmlzU291cmNlRmlsZShwYXJlbnROb2RlKSkgJiZcbiAgICAgICAgICAgICh0cy5pc01ldGhvZFNpZ25hdHVyZShzeW1ib2wudmFsdWVEZWNsYXJhdGlvbikgfHxcbiAgICAgICAgICAgICB0cy5pc0Z1bmN0aW9uRGVjbGFyYXRpb24oc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pKSAmJlxuICAgICAgICAgICAgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24ubmFtZSkge1xuICAgICAgICAgIGNvbnN0IHBhcmVudE5hbWUgPSB0cy5pc0ludGVyZmFjZURlY2xhcmF0aW9uKHBhcmVudE5vZGUpID8gcGFyZW50Tm9kZS5uYW1lLnRleHQgOiBudWxsO1xuICAgICAgICAgIGNvbnN0IGNhbGxOYW1lID0gZ2V0UHJvcGVydHlOYW1lVGV4dChzeW1ib2wudmFsdWVEZWNsYXJhdGlvbi5uYW1lKTtcbiAgICAgICAgICBpZiAoQVNZTkNfRVhURVJOQUxfQ0FMTFMuc29tZShcbiAgICAgICAgICAgICAgICAgIGMgPT5cbiAgICAgICAgICAgICAgICAgICAgICAoYy5uYW1lID09PSBjYWxsTmFtZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAoYy5wYXJlbnQuaW5kZXhPZihwYXJlbnROYW1lKSAhPT0gLTEgfHwgYy5wYXJlbnQuaW5kZXhPZignKicpICE9PSAtMSkpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGp1bXBFeHAuYXJndW1lbnRzIS5mb3JFYWNoKChub2RlOiB0cy5Ob2RlKSA9PiB7XG4gICAgICBub2RlID0gdGhpcy5fcmVzb2x2ZURlY2xhcmF0aW9uT2ZOb2RlKG5vZGUpO1xuXG4gICAgICBpZiAodHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpICYmIG5vZGUuaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuaW5pdGlhbGl6ZXI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0Z1bmN0aW9uTGlrZURlY2xhcmF0aW9uKG5vZGUpICYmICEhbm9kZS5ib2R5KSB7XG4gICAgICAgIHRoaXMuYW1iaWd1b3VzTm9kZVF1ZXVlLnB1c2gobm9kZS5ib2R5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlcyBhIGdpdmVuIG5vZGUgZnJvbSB0aGUgY29udGV4dC4gSW4gY2FzZSB0aGUgbm9kZSBpcyBub3QgbWFwcGVkIGluXG4gICAqIHRoZSBjb250ZXh0LCB0aGUgb3JpZ2luYWwgbm9kZSBpcyByZXR1cm5lZC5cbiAgICovXG4gIHByaXZhdGUgX3Jlc29sdmVOb2RlRnJvbUNvbnRleHQobm9kZTogdHMuTm9kZSk6IHRzLk5vZGUge1xuICAgIGlmICh0aGlzLmNvbnRleHQuaGFzKG5vZGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmdldChub2RlKSE7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNvbnRleHQgdG8gcmVmbGVjdCB0aGUgbmV3bHkgc2V0IHBhcmFtZXRlciB2YWx1ZXMuIFRoaXMgYWxsb3dzIGZ1dHVyZVxuICAgKiByZWZlcmVuY2VzIHRvIGZ1bmN0aW9uIHBhcmFtZXRlcnMgdG8gYmUgcmVzb2x2ZWQgdG8gdGhlIGFjdHVhbCBub2RlIHRocm91Z2ggdGhlIGNvbnRleHQuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVDb250ZXh0KFxuICAgICAgY2FsbEFyZ3M6IHRzLk5vZGVBcnJheTx0cy5FeHByZXNzaW9uPiwgcGFyYW1ldGVyczogdHMuTm9kZUFycmF5PHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uPikge1xuICAgIHBhcmFtZXRlcnMuZm9yRWFjaCgocGFyYW1ldGVyLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGFyZ3VtZW50Tm9kZTogdHMuTm9kZSA9IGNhbGxBcmdzW2luZGV4XTtcblxuICAgICAgaWYgKCFhcmd1bWVudE5vZGUpIHtcbiAgICAgICAgaWYgKCFwYXJhbWV0ZXIuaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBcmd1bWVudCBjYW4gYmUgdW5kZWZpbmVkIGluIGNhc2UgdGhlIGZ1bmN0aW9uIHBhcmFtZXRlciBoYXMgYSBkZWZhdWx0XG4gICAgICAgIC8vIHZhbHVlLiBJbiB0aGF0IGNhc2Ugd2Ugd2FudCB0byBzdG9yZSB0aGUgcGFyYW1ldGVyIGRlZmF1bHQgdmFsdWUgaW4gdGhlIGNvbnRleHQuXG4gICAgICAgIGFyZ3VtZW50Tm9kZSA9IHBhcmFtZXRlci5pbml0aWFsaXplcjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihhcmd1bWVudE5vZGUpKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zZXQocGFyYW1ldGVyLCB0aGlzLl9yZXNvbHZlRGVjbGFyYXRpb25PZk5vZGUoYXJndW1lbnROb2RlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2V0KHBhcmFtZXRlciwgYXJndW1lbnROb2RlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlcyB0aGUgZGVjbGFyYXRpb24gb2YgYSBnaXZlbiBUeXBlU2NyaXB0IG5vZGUuIEZvciBleGFtcGxlIGFuIGlkZW50aWZpZXIgY2FuXG4gICAqIHJlZmVyIHRvIGEgZnVuY3Rpb24gcGFyYW1ldGVyLiBUaGlzIHBhcmFtZXRlciBjYW4gdGhlbiBiZSByZXNvbHZlZCB0aHJvdWdoIHRoZVxuICAgKiBmdW5jdGlvbiBjb250ZXh0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVzb2x2ZURlY2xhcmF0aW9uT2ZOb2RlKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgICBjb25zdCBzeW1ib2wgPSB0aGlzLl9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlKTtcblxuICAgIGlmICghc3ltYm9sIHx8ICFzeW1ib2wudmFsdWVEZWNsYXJhdGlvbikge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Jlc29sdmVOb2RlRnJvbUNvbnRleHQoc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbCBvZiBhIGdpdmVuIFR5cGVTY3JpcHQgbm9kZS4gUmVzb2x2ZXMgYWxpYXNlZFxuICAgKiBzeW1ib2xzIHRvIHRoZSBzeW1ib2wgY29udGFpbmluZyB0aGUgdmFsdWUgZGVjbGFyYXRpb24uXG4gICAqL1xuICBwcml2YXRlIF9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlOiB0cy5Ob2RlKTogdHMuU3ltYm9sfG51bGwge1xuICAgIGxldCBzeW1ib2wgPSB0aGlzLnR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24obm9kZSk7XG5cbiAgICBpZiAoIXN5bWJvbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gUmVzb2x2ZSB0aGUgc3ltYm9sIHRvIGl0J3Mgb3JpZ2luYWwgZGVjbGFyYXRpb24gc3ltYm9sLlxuICAgIHdoaWxlIChzeW1ib2wuZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5BbGlhcykge1xuICAgICAgc3ltYm9sID0gdGhpcy50eXBlQ2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHN5bWJvbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN5bWJvbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzeW1ib2wgb2YgdGhlIGdpdmVuIHByb3BlcnR5IGFjY2VzcyBleHByZXNzaW9uLiAqL1xuICBwcml2YXRlIF9nZXRQcm9wZXJ0eUFjY2Vzc1N5bWJvbChub2RlOiB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24pOiB0cy5TeW1ib2x8bnVsbCB7XG4gICAgbGV0IHByb3BlcnR5U3ltYm9sID0gdGhpcy5fZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZS5uYW1lKTtcblxuICAgIGlmICghcHJvcGVydHlTeW1ib2wgfHwgIXByb3BlcnR5U3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5jb250ZXh0Lmhhcyhwcm9wZXJ0eVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uKSkge1xuICAgICAgcmV0dXJuIHByb3BlcnR5U3ltYm9sO1xuICAgIH1cblxuICAgIC8vIEluIGNhc2UgdGhlIGNvbnRleHQgaGFzIHRoZSB2YWx1ZSBkZWNsYXJhdGlvbiBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgYWNjZXNzXG4gICAgLy8gbmFtZSBpZGVudGlmaWVyLCB3ZSBuZWVkIHRvIHJlcGxhY2UgdGhlIFwicHJvcGVydHlTeW1ib2xcIiB3aXRoIHRoZSBzeW1ib2xcbiAgICAvLyByZWZlcnJpbmcgdG8gdGhlIHJlc29sdmVkIHN5bWJvbCBiYXNlZCBvbiB0aGUgY29udGV4dC4gZS5nLiBhYnN0cmFjdCBwcm9wZXJ0aWVzXG4gICAgLy8gY2FuIHVsdGltYXRlbHkgcmVzb2x2ZSBpbnRvIGFuIGFjY2Vzc29yIGRlY2xhcmF0aW9uIGJhc2VkIG9uIHRoZSBpbXBsZW1lbnRhdGlvbi5cbiAgICBjb25zdCBjb250ZXh0Tm9kZSA9IHRoaXMuX3Jlc29sdmVOb2RlRnJvbUNvbnRleHQocHJvcGVydHlTeW1ib2wudmFsdWVEZWNsYXJhdGlvbik7XG5cbiAgICBpZiAoIXRzLmlzQWNjZXNzb3IoY29udGV4dE5vZGUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBSZXNvbHZlIHRoZSBzeW1ib2wgcmVmZXJyaW5nIHRvIHRoZSBcImFjY2Vzc29yXCIgdXNpbmcgdGhlIG5hbWUgaWRlbnRpZmllclxuICAgIC8vIG9mIHRoZSBhY2Nlc3NvciBkZWNsYXJhdGlvbi5cbiAgICByZXR1cm4gdGhpcy5fZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUoY29udGV4dE5vZGUubmFtZSk7XG4gIH1cbn1cbiJdfQ==