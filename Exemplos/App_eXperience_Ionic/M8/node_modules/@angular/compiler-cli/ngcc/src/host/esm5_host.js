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
        define("@angular/compiler-cli/ngcc/src/host/esm5_host", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/ngcc/src/utils", "@angular/compiler-cli/ngcc/src/host/esm2015_host"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Esm5ReflectionHost = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    var esm2015_host_1 = require("@angular/compiler-cli/ngcc/src/host/esm2015_host");
    /**
     * ESM5 packages contain ECMAScript IIFE functions that act like classes. For example:
     *
     * ```
     * var CommonModule = (function () {
     *  function CommonModule() {
     *  }
     *  CommonModule.decorators = [ ... ];
     *  return CommonModule;
     * ```
     *
     * * "Classes" are decorated if they have a static property called `decorators`.
     * * Members are decorated if there is a matching key on a static property
     *   called `propDecorators`.
     * * Constructor parameters decorators are found on an object returned from
     *   a static method called `ctorParameters`.
     *
     */
    var Esm5ReflectionHost = /** @class */ (function (_super) {
        tslib_1.__extends(Esm5ReflectionHost, _super);
        function Esm5ReflectionHost() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Esm5ReflectionHost.prototype.getBaseClassExpression = function (clazz) {
            var superBaseClassExpression = _super.prototype.getBaseClassExpression.call(this, clazz);
            if (superBaseClassExpression !== null) {
                return superBaseClassExpression;
            }
            var iife = getIifeFn(this.getClassSymbol(clazz));
            if (iife === null)
                return null;
            if (iife.parameters.length !== 1 || !isSuperIdentifier(iife.parameters[0].name)) {
                return null;
            }
            if (!ts.isCallExpression(iife.parent)) {
                return null;
            }
            return iife.parent.arguments[0];
        };
        /**
         * Trace an identifier to its declaration, if possible.
         *
         * This method attempts to resolve the declaration of the given identifier, tracing back through
         * imports and re-exports until the original declaration statement is found. A `Declaration`
         * object is returned if the original declaration is found, or `null` is returned otherwise.
         *
         * In ES5, the implementation of a class is a function expression that is hidden inside an IIFE.
         * If we are looking for the declaration of the identifier of the inner function expression, we
         * will get hold of the outer "class" variable declaration and return its identifier instead. See
         * `getClassDeclarationFromInnerFunctionDeclaration()` for more info.
         *
         * @param id a TypeScript `ts.Identifier` to trace back to a declaration.
         *
         * @returns metadata about the `Declaration` if the original declaration is found, or `null`
         * otherwise.
         */
        Esm5ReflectionHost.prototype.getDeclarationOfIdentifier = function (id) {
            var declaration = _super.prototype.getDeclarationOfIdentifier.call(this, id);
            if (declaration === null) {
                var nonEmittedNorImportedTsHelperDeclaration = utils_1.getTsHelperFnFromIdentifier(id);
                if (nonEmittedNorImportedTsHelperDeclaration !== null) {
                    // No declaration could be found for this identifier and its name matches a known TS helper
                    // function. This can happen if a package is compiled with `noEmitHelpers: true` and
                    // `importHelpers: false` (the default). This is, for example, the case with
                    // `@nativescript/angular@9.0.0-next-2019-11-12-155500-01`.
                    return {
                        kind: 1 /* Inline */,
                        node: id,
                        known: nonEmittedNorImportedTsHelperDeclaration,
                        viaModule: null,
                    };
                }
            }
            if (declaration === null || declaration.node === null || declaration.known !== null) {
                return declaration;
            }
            if (!ts.isVariableDeclaration(declaration.node) || declaration.node.initializer !== undefined ||
                // VariableDeclaration => VariableDeclarationList => VariableStatement => IIFE Block
                !ts.isBlock(declaration.node.parent.parent.parent)) {
                return declaration;
            }
            // We might have an alias to another variable declaration.
            // Search the containing iife body for it.
            var block = declaration.node.parent.parent.parent;
            var aliasSymbol = this.checker.getSymbolAtLocation(declaration.node.name);
            for (var i = 0; i < block.statements.length; i++) {
                var statement = block.statements[i];
                // Looking for statement that looks like: `AliasedVariable = OriginalVariable;`
                if (esm2015_host_1.isAssignmentStatement(statement) && ts.isIdentifier(statement.expression.left) &&
                    ts.isIdentifier(statement.expression.right) &&
                    this.checker.getSymbolAtLocation(statement.expression.left) === aliasSymbol) {
                    return this.getDeclarationOfIdentifier(statement.expression.right);
                }
            }
            return declaration;
        };
        /**
         * Parse a function declaration to find the relevant metadata about it.
         *
         * In ESM5 we need to do special work with optional arguments to the function, since they get
         * their own initializer statement that needs to be parsed and then not included in the "body"
         * statements of the function.
         *
         * @param node the function declaration to parse.
         * @returns an object containing the node, statements and parameters of the function.
         */
        Esm5ReflectionHost.prototype.getDefinitionOfFunction = function (node) {
            var definition = _super.prototype.getDefinitionOfFunction.call(this, node);
            if (definition === null) {
                return null;
            }
            // Filter out and capture parameter initializers
            if (definition.body !== null) {
                var lookingForInitializers_1 = true;
                var statements = definition.body.filter(function (s) {
                    lookingForInitializers_1 =
                        lookingForInitializers_1 && captureParamInitializer(s, definition.parameters);
                    // If we are no longer looking for parameter initializers then we include this statement
                    return !lookingForInitializers_1;
                });
                definition.body = statements;
            }
            return definition;
        };
        /**
         * Check whether a `Declaration` corresponds with a known declaration, such as a TypeScript helper
         * function, and set its `known` property to the appropriate `KnownDeclaration`.
         *
         * @param decl The `Declaration` to check.
         * @return The passed in `Declaration` (potentially enhanced with a `KnownDeclaration`).
         */
        Esm5ReflectionHost.prototype.detectKnownDeclaration = function (decl) {
            decl = _super.prototype.detectKnownDeclaration.call(this, decl);
            // Also check for TS helpers
            if (decl.known === null && decl.node !== null) {
                decl.known = utils_1.getTsHelperFnFromDeclaration(decl.node);
            }
            return decl;
        };
        ///////////// Protected Helpers /////////////
        /**
         * In ES5, the implementation of a class is a function expression that is hidden inside an IIFE,
         * whose value is assigned to a variable (which represents the class to the rest of the program).
         * So we might need to dig around to get hold of the "class" declaration.
         *
         * This method extracts a `NgccClassSymbol` if `declaration` is the function declaration inside
         * the IIFE. Otherwise, undefined is returned.
         *
         * @param declaration the declaration whose symbol we are finding.
         * @returns the symbol for the node or `undefined` if it is not a "class" or has no symbol.
         */
        Esm5ReflectionHost.prototype.getClassSymbolFromInnerDeclaration = function (declaration) {
            var classSymbol = _super.prototype.getClassSymbolFromInnerDeclaration.call(this, declaration);
            if (classSymbol !== undefined) {
                return classSymbol;
            }
            if (!reflection_1.isNamedFunctionDeclaration(declaration)) {
                return undefined;
            }
            var outerNode = esm2015_host_1.getOuterNodeFromInnerDeclaration(declaration);
            if (outerNode === null || !utils_1.hasNameIdentifier(outerNode)) {
                return undefined;
            }
            return this.createClassSymbol(outerNode.name, declaration);
        };
        /**
         * Find the declarations of the constructor parameters of a class identified by its symbol.
         *
         * In ESM5, there is no "class" so the constructor that we want is actually the inner function
         * declaration inside the IIFE, whose return value is assigned to the outer variable declaration
         * (that represents the class to the rest of the program).
         *
         * @param classSymbol the symbol of the class (i.e. the outer variable declaration) whose
         * parameters we want to find.
         * @returns an array of `ts.ParameterDeclaration` objects representing each of the parameters in
         * the class's constructor or `null` if there is no constructor.
         */
        Esm5ReflectionHost.prototype.getConstructorParameterDeclarations = function (classSymbol) {
            var constructor = classSymbol.implementation.valueDeclaration;
            if (!ts.isFunctionDeclaration(constructor))
                return null;
            if (constructor.parameters.length > 0) {
                return Array.from(constructor.parameters);
            }
            if (this.isSynthesizedConstructor(constructor)) {
                return null;
            }
            return [];
        };
        /**
         * Get the parameter type and decorators for the constructor of a class,
         * where the information is stored on a static method of the class.
         *
         * In this case the decorators are stored in the body of a method
         * (`ctorParatemers`) attached to the constructor function.
         *
         * Note that unlike ESM2015 this is a function expression rather than an arrow
         * function:
         *
         * ```
         * SomeDirective.ctorParameters = function() { return [
         *   { type: ViewContainerRef, },
         *   { type: TemplateRef, },
         *   { type: IterableDiffers, },
         *   { type: undefined, decorators: [{ type: Inject, args: [INJECTED_TOKEN,] },] },
         * ]; };
         * ```
         *
         * @param paramDecoratorsProperty the property that holds the parameter info we want to get.
         * @returns an array of objects containing the type and decorators for each parameter.
         */
        Esm5ReflectionHost.prototype.getParamInfoFromStaticProperty = function (paramDecoratorsProperty) {
            var _this = this;
            var paramDecorators = esm2015_host_1.getPropertyValueFromSymbol(paramDecoratorsProperty);
            // The decorators array may be wrapped in a function. If so unwrap it.
            var returnStatement = getReturnStatement(paramDecorators);
            var expression = returnStatement ? returnStatement.expression : paramDecorators;
            if (expression && ts.isArrayLiteralExpression(expression)) {
                var elements = expression.elements;
                return elements.map(reflectArrayElement).map(function (paramInfo) {
                    var typeExpression = paramInfo && paramInfo.has('type') ? paramInfo.get('type') : null;
                    var decoratorInfo = paramInfo && paramInfo.has('decorators') ? paramInfo.get('decorators') : null;
                    var decorators = decoratorInfo && _this.reflectDecorators(decoratorInfo);
                    return { typeExpression: typeExpression, decorators: decorators };
                });
            }
            else if (paramDecorators !== undefined) {
                this.logger.warn('Invalid constructor parameter decorator in ' + paramDecorators.getSourceFile().fileName +
                    ':\n', paramDecorators.getText());
            }
            return null;
        };
        /**
         * Reflect over a symbol and extract the member information, combining it with the
         * provided decorator information, and whether it is a static member.
         *
         * If a class member uses accessors (e.g getters and/or setters) then it gets downleveled
         * in ES5 to a single `Object.defineProperty()` call. In that case we must parse this
         * call to extract the one or two ClassMember objects that represent the accessors.
         *
         * @param symbol the symbol for the member to reflect over.
         * @param decorators an array of decorators associated with the member.
         * @param isStatic true if this member is static, false if it is an instance property.
         * @returns the reflected member information, or null if the symbol is not a member.
         */
        Esm5ReflectionHost.prototype.reflectMembers = function (symbol, decorators, isStatic) {
            var node = symbol.valueDeclaration || symbol.declarations && symbol.declarations[0];
            var propertyDefinition = node && getPropertyDefinition(node);
            if (propertyDefinition) {
                var members_1 = [];
                if (propertyDefinition.setter) {
                    members_1.push({
                        node: node,
                        implementation: propertyDefinition.setter,
                        kind: reflection_1.ClassMemberKind.Setter,
                        type: null,
                        name: symbol.name,
                        nameNode: null,
                        value: null,
                        isStatic: isStatic || false,
                        decorators: decorators || [],
                    });
                    // Prevent attaching the decorators to a potential getter. In ES5, we can't tell where the
                    // decorators were originally attached to, however we only want to attach them to a single
                    // `ClassMember` as otherwise ngtsc would handle the same decorators twice.
                    decorators = undefined;
                }
                if (propertyDefinition.getter) {
                    members_1.push({
                        node: node,
                        implementation: propertyDefinition.getter,
                        kind: reflection_1.ClassMemberKind.Getter,
                        type: null,
                        name: symbol.name,
                        nameNode: null,
                        value: null,
                        isStatic: isStatic || false,
                        decorators: decorators || [],
                    });
                }
                return members_1;
            }
            var members = _super.prototype.reflectMembers.call(this, symbol, decorators, isStatic);
            members && members.forEach(function (member) {
                if (member && member.kind === reflection_1.ClassMemberKind.Method && member.isStatic && member.node &&
                    ts.isPropertyAccessExpression(member.node) && member.node.parent &&
                    ts.isBinaryExpression(member.node.parent) &&
                    ts.isFunctionExpression(member.node.parent.right)) {
                    // Recompute the implementation for this member:
                    // ES5 static methods are variable declarations so the declaration is actually the
                    // initializer of the variable assignment
                    member.implementation = member.node.parent.right;
                }
            });
            return members;
        };
        /**
         * Find statements related to the given class that may contain calls to a helper.
         *
         * In ESM5 code the helper calls are hidden inside the class's IIFE.
         *
         * @param classSymbol the class whose helper calls we are interested in. We expect this symbol
         * to reference the inner identifier inside the IIFE.
         * @returns an array of statements that may contain helper calls.
         */
        Esm5ReflectionHost.prototype.getStatementsForClass = function (classSymbol) {
            var classDeclarationParent = classSymbol.implementation.valueDeclaration.parent;
            return ts.isBlock(classDeclarationParent) ? Array.from(classDeclarationParent.statements) : [];
        };
        ///////////// Host Private Helpers /////////////
        /**
         * A constructor function may have been "synthesized" by TypeScript during JavaScript emit,
         * in the case no user-defined constructor exists and e.g. property initializers are used.
         * Those initializers need to be emitted into a constructor in JavaScript, so the TypeScript
         * compiler generates a synthetic constructor.
         *
         * We need to identify such constructors as ngcc needs to be able to tell if a class did
         * originally have a constructor in the TypeScript source. For ES5, we can not tell an
         * empty constructor apart from a synthesized constructor, but fortunately that does not
         * matter for the code generated by ngtsc.
         *
         * When a class has a superclass however, a synthesized constructor must not be considered
         * as a user-defined constructor as that prevents a base factory call from being created by
         * ngtsc, resulting in a factory function that does not inject the dependencies of the
         * superclass. Hence, we identify a default synthesized super call in the constructor body,
         * according to the structure that TypeScript's ES2015 to ES5 transformer generates in
         * https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/es2015.ts#L1082-L1098
         *
         * Additionally, we handle synthetic delegate constructors that are emitted when TypeScript
         * downlevel's ES2015 synthetically generated to ES5. These vary slightly from the default
         * structure mentioned above because the ES2015 output uses a spread operator, for delegating
         * to the parent constructor, that is preserved through a TypeScript helper in ES5. e.g.
         *
         * ```
         * return _super.apply(this, tslib.__spread(arguments)) || this;
         * ```
         *
         * or, since TypeScript 4.2 it would be
         *
         * ```
         * return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
         * ```
         *
         * Such constructs can be still considered as synthetic delegate constructors as they are
         * the product of a common TypeScript to ES5 synthetic constructor, just being downleveled
         * to ES5 using `tsc`. See: https://github.com/angular/angular/issues/38453.
         *
         *
         * @param constructor a constructor function to test
         * @returns true if the constructor appears to have been synthesized
         */
        Esm5ReflectionHost.prototype.isSynthesizedConstructor = function (constructor) {
            if (!constructor.body)
                return false;
            var firstStatement = constructor.body.statements[0];
            if (!firstStatement)
                return false;
            return this.isSynthesizedSuperThisAssignment(firstStatement) ||
                this.isSynthesizedSuperReturnStatement(firstStatement);
        };
        /**
         * Identifies synthesized super calls which pass-through function arguments directly and are
         * being assigned to a common `_this` variable. The following patterns we intend to match:
         *
         * 1. Delegate call emitted by TypeScript when it emits ES5 directly.
         *   ```
         *   var _this = _super !== null && _super.apply(this, arguments) || this;
         *   ```
         *
         * 2. Delegate call emitted by TypeScript when it downlevel's ES2015 to ES5.
         *   ```
         *   var _this = _super.apply(this, tslib.__spread(arguments)) || this;
         *   ```
         *   or using the syntax emitted since TypeScript 4.2:
         *   ```
         *   return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
         *   ```
         *
         * @param statement a statement that may be a synthesized super call
         * @returns true if the statement looks like a synthesized super call
         */
        Esm5ReflectionHost.prototype.isSynthesizedSuperThisAssignment = function (statement) {
            if (!ts.isVariableStatement(statement))
                return false;
            var variableDeclarations = statement.declarationList.declarations;
            if (variableDeclarations.length !== 1)
                return false;
            var variableDeclaration = variableDeclarations[0];
            if (!ts.isIdentifier(variableDeclaration.name) ||
                !variableDeclaration.name.text.startsWith('_this'))
                return false;
            var initializer = variableDeclaration.initializer;
            if (!initializer)
                return false;
            return this.isSynthesizedDefaultSuperCall(initializer);
        };
        /**
         * Identifies synthesized super calls which pass-through function arguments directly and
         * are being returned. The following patterns correspond to synthetic super return calls:
         *
         * 1. Delegate call emitted by TypeScript when it emits ES5 directly.
         *   ```
         *   return _super !== null && _super.apply(this, arguments) || this;
         *   ```
         *
         * 2. Delegate call emitted by TypeScript when it downlevel's ES2015 to ES5.
         *   ```
         *   return _super.apply(this, tslib.__spread(arguments)) || this;
         *   ```
         *   or using the syntax emitted since TypeScript 4.2:
         *   ```
         *   return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
         *   ```
         *
         * @param statement a statement that may be a synthesized super call
         * @returns true if the statement looks like a synthesized super call
         */
        Esm5ReflectionHost.prototype.isSynthesizedSuperReturnStatement = function (statement) {
            if (!ts.isReturnStatement(statement))
                return false;
            var expression = statement.expression;
            if (!expression)
                return false;
            return this.isSynthesizedDefaultSuperCall(expression);
        };
        /**
         * Identifies synthesized super calls which pass-through function arguments directly. The
         * synthetic delegate super call match the following patterns we intend to match:
         *
         * 1. Delegate call emitted by TypeScript when it emits ES5 directly.
         *   ```
         *   _super !== null && _super.apply(this, arguments) || this;
         *   ```
         *
         * 2. Delegate call emitted by TypeScript when it downlevel's ES2015 to ES5.
         *   ```
         *   _super.apply(this, tslib.__spread(arguments)) || this;
         *   ```
         *   or using the syntax emitted since TypeScript 4.2:
         *   ```
         *   return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
         *   ```
         *
         * @param expression an expression that may represent a default super call
         * @returns true if the expression corresponds with the above form
         */
        Esm5ReflectionHost.prototype.isSynthesizedDefaultSuperCall = function (expression) {
            if (!isBinaryExpr(expression, ts.SyntaxKind.BarBarToken))
                return false;
            if (expression.right.kind !== ts.SyntaxKind.ThisKeyword)
                return false;
            var left = expression.left;
            if (isBinaryExpr(left, ts.SyntaxKind.AmpersandAmpersandToken)) {
                return isSuperNotNull(left.left) && this.isSuperApplyCall(left.right);
            }
            else {
                return this.isSuperApplyCall(left);
            }
        };
        /**
         * Tests whether the expression corresponds to a `super` call passing through
         * function arguments without any modification. e.g.
         *
         * ```
         * _super !== null && _super.apply(this, arguments) || this;
         * ```
         *
         * This structure is generated by TypeScript when transforming ES2015 to ES5, see
         * https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/es2015.ts#L1148-L1163
         *
         * Additionally, we also handle cases where `arguments` are wrapped by a TypeScript spread
         * helper.
         * This can happen if ES2015 class output contain auto-generated constructors due to class
         * members. The ES2015 output will be using `super(...arguments)` to delegate to the superclass,
         * but once downleveled to ES5, the spread operator will be persisted through a TypeScript spread
         * helper. For example:
         *
         * ```
         * _super.apply(this, __spread(arguments)) || this;
         * ```
         *
         * or, since TypeScript 4.2 it would be
         *
         * ```
         * _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
         * ```
         *
         * More details can be found in: https://github.com/angular/angular/issues/38453.
         *
         * @param expression an expression that may represent a default super call
         * @returns true if the expression corresponds with the above form
         */
        Esm5ReflectionHost.prototype.isSuperApplyCall = function (expression) {
            if (!ts.isCallExpression(expression) || expression.arguments.length !== 2)
                return false;
            var targetFn = expression.expression;
            if (!ts.isPropertyAccessExpression(targetFn))
                return false;
            if (!isSuperIdentifier(targetFn.expression))
                return false;
            if (targetFn.name.text !== 'apply')
                return false;
            var thisArgument = expression.arguments[0];
            if (thisArgument.kind !== ts.SyntaxKind.ThisKeyword)
                return false;
            var argumentsExpr = expression.arguments[1];
            // If the super is directly invoked with `arguments`, return `true`. This represents the
            // common TypeScript output where the delegate constructor super call matches the following
            // pattern: `super.apply(this, arguments)`.
            if (isArgumentsIdentifier(argumentsExpr)) {
                return true;
            }
            // The other scenario we intend to detect: The `arguments` variable might be wrapped with the
            // TypeScript spread helper (either through tslib or inlined). This can happen if an explicit
            // delegate constructor uses `super(...arguments)` in ES2015 and is downleveled to ES5 using
            // `--downlevelIteration`.
            return this.isSpreadArgumentsExpression(argumentsExpr);
        };
        /**
         * Determines if the provided expression is one of the following call expressions:
         *
         * 1. `__spread(arguments)`
         * 2. `__spreadArray([], __read(arguments))`
         *
         * The tslib helpers may have been emitted inline as in the above example, or they may be read
         * from a namespace import.
         */
        Esm5ReflectionHost.prototype.isSpreadArgumentsExpression = function (expression) {
            var call = this.extractKnownHelperCall(expression);
            if (call === null) {
                return false;
            }
            if (call.helper === reflection_1.KnownDeclaration.TsHelperSpread) {
                // `__spread(arguments)`
                return call.args.length === 1 && isArgumentsIdentifier(call.args[0]);
            }
            else if (call.helper === reflection_1.KnownDeclaration.TsHelperSpreadArray) {
                // `__spreadArray([], __read(arguments))`
                if (call.args.length !== 2) {
                    return false;
                }
                var firstArg = call.args[0];
                if (!ts.isArrayLiteralExpression(firstArg) || firstArg.elements.length !== 0) {
                    return false;
                }
                var secondArg = this.extractKnownHelperCall(call.args[1]);
                if (secondArg === null || secondArg.helper !== reflection_1.KnownDeclaration.TsHelperRead) {
                    return false;
                }
                return secondArg.args.length === 1 && isArgumentsIdentifier(secondArg.args[0]);
            }
            else {
                return false;
            }
        };
        /**
         * Inspects the provided expression and determines if it corresponds with a known helper function
         * as receiver expression.
         */
        Esm5ReflectionHost.prototype.extractKnownHelperCall = function (expression) {
            if (!ts.isCallExpression(expression)) {
                return null;
            }
            var receiverExpr = expression.expression;
            // The helper could be globally available, or accessed through a namespaced import. Hence we
            // support a property access here as long as it resolves to the actual known TypeScript helper.
            var receiver = null;
            if (ts.isIdentifier(receiverExpr)) {
                receiver = this.getDeclarationOfIdentifier(receiverExpr);
            }
            else if (ts.isPropertyAccessExpression(receiverExpr) && ts.isIdentifier(receiverExpr.name)) {
                receiver = this.getDeclarationOfIdentifier(receiverExpr.name);
            }
            if (receiver === null || receiver.known === null) {
                return null;
            }
            return {
                helper: receiver.known,
                args: expression.arguments,
            };
        };
        return Esm5ReflectionHost;
    }(esm2015_host_1.Esm2015ReflectionHost));
    exports.Esm5ReflectionHost = Esm5ReflectionHost;
    /**
     * In ES5, getters and setters have been downleveled into call expressions of
     * `Object.defineProperty`, such as
     *
     * ```
     * Object.defineProperty(Clazz.prototype, "property", {
     *   get: function () {
     *       return 'value';
     *   },
     *   set: function (value) {
     *       this.value = value;
     *   },
     *   enumerable: true,
     *   configurable: true
     * });
     * ```
     *
     * This function inspects the given node to determine if it corresponds with such a call, and if so
     * extracts the `set` and `get` function expressions from the descriptor object, if they exist.
     *
     * @param node The node to obtain the property definition from.
     * @returns The property definition if the node corresponds with accessor, null otherwise.
     */
    function getPropertyDefinition(node) {
        if (!ts.isCallExpression(node))
            return null;
        var fn = node.expression;
        if (!ts.isPropertyAccessExpression(fn) || !ts.isIdentifier(fn.expression) ||
            fn.expression.text !== 'Object' || fn.name.text !== 'defineProperty')
            return null;
        var descriptor = node.arguments[2];
        if (!descriptor || !ts.isObjectLiteralExpression(descriptor))
            return null;
        return {
            setter: readPropertyFunctionExpression(descriptor, 'set'),
            getter: readPropertyFunctionExpression(descriptor, 'get'),
        };
    }
    function readPropertyFunctionExpression(object, name) {
        var property = object.properties.find(function (p) {
            return ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === name;
        });
        return property && ts.isFunctionExpression(property.initializer) && property.initializer || null;
    }
    function getReturnStatement(declaration) {
        return declaration && ts.isFunctionExpression(declaration) ?
            declaration.body.statements.find(ts.isReturnStatement) :
            undefined;
    }
    function reflectArrayElement(element) {
        return ts.isObjectLiteralExpression(element) ? reflection_1.reflectObjectLiteral(element) : null;
    }
    function isArgumentsIdentifier(expression) {
        return ts.isIdentifier(expression) && expression.text === 'arguments';
    }
    function isSuperNotNull(expression) {
        return isBinaryExpr(expression, ts.SyntaxKind.ExclamationEqualsEqualsToken) &&
            isSuperIdentifier(expression.left);
    }
    function isBinaryExpr(expression, operator) {
        return ts.isBinaryExpression(expression) && expression.operatorToken.kind === operator;
    }
    function isSuperIdentifier(node) {
        // Verify that the identifier is prefixed with `_super`. We don't test for equivalence
        // as TypeScript may have suffixed the name, e.g. `_super_1` to avoid name conflicts.
        // Requiring only a prefix should be sufficiently accurate.
        return ts.isIdentifier(node) && node.text.startsWith('_super');
    }
    /**
     * Parse the statement to extract the ESM5 parameter initializer if there is one.
     * If one is found, add it to the appropriate parameter in the `parameters` collection.
     *
     * The form we are looking for is:
     *
     * ```
     * if (arg === void 0) { arg = initializer; }
     * ```
     *
     * @param statement a statement that may be initializing an optional parameter
     * @param parameters the collection of parameters that were found in the function definition
     * @returns true if the statement was a parameter initializer
     */
    function captureParamInitializer(statement, parameters) {
        if (ts.isIfStatement(statement) && isUndefinedComparison(statement.expression) &&
            ts.isBlock(statement.thenStatement) && statement.thenStatement.statements.length === 1) {
            var ifStatementComparison = statement.expression; // (arg === void 0)
            var thenStatement = statement.thenStatement.statements[0]; // arg = initializer;
            if (esm2015_host_1.isAssignmentStatement(thenStatement)) {
                var comparisonName_1 = ifStatementComparison.left.text;
                var assignmentName = thenStatement.expression.left.text;
                if (comparisonName_1 === assignmentName) {
                    var parameter = parameters.find(function (p) { return p.name === comparisonName_1; });
                    if (parameter) {
                        parameter.initializer = thenStatement.expression.right;
                        return true;
                    }
                }
            }
        }
        return false;
    }
    function isUndefinedComparison(expression) {
        return ts.isBinaryExpression(expression) &&
            expression.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken &&
            ts.isVoidExpression(expression.right) && ts.isIdentifier(expression.left);
    }
    /**
     * Parse the declaration of the given `classSymbol` to find the IIFE wrapper function.
     *
     * This function may accept a `_super` argument if there is a base class.
     *
     * ```
     * var TestClass = (function (_super) {
     *   __extends(TestClass, _super);
     *   function TestClass() {}
     *   return TestClass;
     * }(BaseClass));
     * ```
     *
     * @param classSymbol the class whose iife wrapper function we want to get.
     * @returns the IIFE function or null if it could not be parsed.
     */
    function getIifeFn(classSymbol) {
        if (classSymbol === undefined) {
            return null;
        }
        var innerDeclaration = classSymbol.implementation.valueDeclaration;
        var iifeBody = innerDeclaration.parent;
        if (!ts.isBlock(iifeBody)) {
            return null;
        }
        var iifeWrapper = iifeBody.parent;
        return iifeWrapper && ts.isFunctionExpression(iifeWrapper) ? iifeWrapper : null;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtNV9ob3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL2hvc3QvZXNtNV9ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQkFBaUM7SUFFakMseUVBQXlPO0lBQ3pPLDhEQUFzRztJQUV0RyxpRkFBcUo7SUFJcko7Ozs7Ozs7Ozs7Ozs7Ozs7O09BaUJHO0lBQ0g7UUFBd0MsOENBQXFCO1FBQTdEOztRQTZsQkEsQ0FBQztRQTVsQlUsbURBQXNCLEdBQS9CLFVBQWdDLEtBQXVCO1lBQ3JELElBQU0sd0JBQXdCLEdBQUcsaUJBQU0sc0JBQXNCLFlBQUMsS0FBSyxDQUFDLENBQUM7WUFDckUsSUFBSSx3QkFBd0IsS0FBSyxJQUFJLEVBQUU7Z0JBQ3JDLE9BQU8sd0JBQXdCLENBQUM7YUFDakM7WUFFRCxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksSUFBSSxLQUFLLElBQUk7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFFL0IsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMvRSxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3JDLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRDs7Ozs7Ozs7Ozs7Ozs7OztXQWdCRztR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QUFJLENBQUM7U0FDYjtRQUVELElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDcEMsT0FBTyxXQUFXLElBQUksRUFBRSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNsRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb24sIENsYXNzTWVtYmVyLCBDbGFzc01lbWJlcktpbmQsIERlY2xhcmF0aW9uLCBEZWNsYXJhdGlvbktpbmQsIERlY29yYXRvciwgRnVuY3Rpb25EZWZpbml0aW9uLCBpc05hbWVkRnVuY3Rpb25EZWNsYXJhdGlvbiwgS25vd25EZWNsYXJhdGlvbiwgUGFyYW1ldGVyLCByZWZsZWN0T2JqZWN0TGl0ZXJhbH0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtnZXRUc0hlbHBlckZuRnJvbURlY2xhcmF0aW9uLCBnZXRUc0hlbHBlckZuRnJvbUlkZW50aWZpZXIsIGhhc05hbWVJZGVudGlmaWVyfSBmcm9tICcuLi91dGlscyc7XG5cbmltcG9ydCB7RXNtMjAxNVJlZmxlY3Rpb25Ib3N0LCBnZXRPdXRlck5vZGVGcm9tSW5uZXJEZWNsYXJhdGlvbiwgZ2V0UHJvcGVydHlWYWx1ZUZyb21TeW1ib2wsIGlzQXNzaWdubWVudFN0YXRlbWVudCwgUGFyYW1JbmZvfSBmcm9tICcuL2VzbTIwMTVfaG9zdCc7XG5pbXBvcnQge05nY2NDbGFzc1N5bWJvbH0gZnJvbSAnLi9uZ2NjX2hvc3QnO1xuXG5cbi8qKlxuICogRVNNNSBwYWNrYWdlcyBjb250YWluIEVDTUFTY3JpcHQgSUlGRSBmdW5jdGlvbnMgdGhhdCBhY3QgbGlrZSBjbGFzc2VzLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIHZhciBDb21tb25Nb2R1bGUgPSAoZnVuY3Rpb24gKCkge1xuICogIGZ1bmN0aW9uIENvbW1vbk1vZHVsZSgpIHtcbiAqICB9XG4gKiAgQ29tbW9uTW9kdWxlLmRlY29yYXRvcnMgPSBbIC4uLiBdO1xuICogIHJldHVybiBDb21tb25Nb2R1bGU7XG4gKiBgYGBcbiAqXG4gKiAqIFwiQ2xhc3Nlc1wiIGFyZSBkZWNvcmF0ZWQgaWYgdGhleSBoYXZlIGEgc3RhdGljIHByb3BlcnR5IGNhbGxlZCBgZGVjb3JhdG9yc2AuXG4gKiAqIE1lbWJlcnMgYXJlIGRlY29yYXRlZCBpZiB0aGVyZSBpcyBhIG1hdGNoaW5nIGtleSBvbiBhIHN0YXRpYyBwcm9wZXJ0eVxuICogICBjYWxsZWQgYHByb3BEZWNvcmF0b3JzYC5cbiAqICogQ29uc3RydWN0b3IgcGFyYW1ldGVycyBkZWNvcmF0b3JzIGFyZSBmb3VuZCBvbiBhbiBvYmplY3QgcmV0dXJuZWQgZnJvbVxuICogICBhIHN0YXRpYyBtZXRob2QgY2FsbGVkIGBjdG9yUGFyYW1ldGVyc2AuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgRXNtNVJlZmxlY3Rpb25Ib3N0IGV4dGVuZHMgRXNtMjAxNVJlZmxlY3Rpb25Ib3N0IHtcbiAgb3ZlcnJpZGUgZ2V0QmFzZUNsYXNzRXhwcmVzc2lvbihjbGF6ejogQ2xhc3NEZWNsYXJhdGlvbik6IHRzLkV4cHJlc3Npb258bnVsbCB7XG4gICAgY29uc3Qgc3VwZXJCYXNlQ2xhc3NFeHByZXNzaW9uID0gc3VwZXIuZ2V0QmFzZUNsYXNzRXhwcmVzc2lvbihjbGF6eik7XG4gICAgaWYgKHN1cGVyQmFzZUNsYXNzRXhwcmVzc2lvbiAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHN1cGVyQmFzZUNsYXNzRXhwcmVzc2lvbjtcbiAgICB9XG5cbiAgICBjb25zdCBpaWZlID0gZ2V0SWlmZUZuKHRoaXMuZ2V0Q2xhc3NTeW1ib2woY2xhenopKTtcbiAgICBpZiAoaWlmZSA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICBpZiAoaWlmZS5wYXJhbWV0ZXJzLmxlbmd0aCAhPT0gMSB8fCAhaXNTdXBlcklkZW50aWZpZXIoaWlmZS5wYXJhbWV0ZXJzWzBdLm5hbWUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIXRzLmlzQ2FsbEV4cHJlc3Npb24oaWlmZS5wYXJlbnQpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gaWlmZS5wYXJlbnQuYXJndW1lbnRzWzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNlIGFuIGlkZW50aWZpZXIgdG8gaXRzIGRlY2xhcmF0aW9uLCBpZiBwb3NzaWJsZS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYXR0ZW1wdHMgdG8gcmVzb2x2ZSB0aGUgZGVjbGFyYXRpb24gb2YgdGhlIGdpdmVuIGlkZW50aWZpZXIsIHRyYWNpbmcgYmFjayB0aHJvdWdoXG4gICAqIGltcG9ydHMgYW5kIHJlLWV4cG9ydHMgdW50aWwgdGhlIG9yaWdpbmFsIGRlY2xhcmF0aW9uIHN0YXRlbWVudCBpcyBmb3VuZC4gQSBgRGVjbGFyYXRpb25gXG4gICAqIG9iamVjdCBpcyByZXR1cm5lZCBpZiB0aGUgb3JpZ2luYWwgZGVjbGFyYXRpb24gaXMgZm91bmQsIG9yIGBudWxsYCBpcyByZXR1cm5lZCBvdGhlcndpc2UuXG4gICAqXG4gICAqIEluIEVTNSwgdGhlIGltcGxlbWVudGF0aW9uIG9mIGEgY2xhc3MgaXMgYSBmdW5jdGlvbiBleHByZXNzaW9uIHRoYXQgaXMgaGlkZGVuIGluc2lkZSBhbiBJSUZFLlxuICAgKiBJZiB3ZSBhcmUgbG9va2luZyBmb3IgdGhlIGRlY2xhcmF0aW9uIG9mIHRoZSBpZGVudGlmaWVyIG9mIHRoZSBpbm5lciBmdW5jdGlvbiBleHByZXNzaW9uLCB3ZVxuICAgKiB3aWxsIGdldCBob2xkIG9mIHRoZSBvdXRlciBcImNsYXNzXCIgdmFyaWFibGUgZGVjbGFyYXRpb24gYW5kIHJldHVybiBpdHMgaWRlbnRpZmllciBpbnN0ZWFkLiBTZWVcbiAgICogYGdldENsYXNzRGVjbGFyYXRpb25Gcm9tSW5uZXJGdW5jdGlvbkRlY2xhcmF0aW9uKClgIGZvciBtb3JlIGluZm8uXG4gICAqXG4gICAqIEBwYXJhbSBpZCBhIFR5cGVTY3JpcHQgYHRzLklkZW50aWZpZXJgIHRvIHRyYWNlIGJhY2sgdG8gYSBkZWNsYXJhdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMgbWV0YWRhdGEgYWJvdXQgdGhlIGBEZWNsYXJhdGlvbmAgaWYgdGhlIG9yaWdpbmFsIGRlY2xhcmF0aW9uIGlzIGZvdW5kLCBvciBgbnVsbGBcbiAgICogb3RoZXJ3aXNlLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXIoaWQ6IHRzLklkZW50aWZpZXIpOiBEZWNsYXJhdGlvbnxudWxsIHtcbiAgICBjb25zdCBkZWNsYXJhdGlvbiA9IHN1cGVyLmdldERlY2xhcmF0aW9uT2ZJZGVudGlmaWVyKGlkKTtcblxuICAgIGlmIChkZWNsYXJhdGlvbiA9PT0gbnVsbCkge1xuICAgICAgY29uc3Qgbm9uRW1pdHRlZE5vckltcG9ydGVkVHNIZWxwZXJEZWNsYXJhdGlvbiA9IGdldFRzSGVscGVyRm5Gcm9tSWRlbnRpZmllcihpZCk7XG4gICAgICBpZiAobm9uRW1pdHRlZE5vckltcG9ydGVkVHNIZWxwZXJEZWNsYXJhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAvLyBObyBkZWNsYXJhdGlvbiBjb3VsZCBiZSBmb3VuZCBmb3IgdGhpcyBpZGVudGlmaWVyIGFuZCBpdHMgbmFtZSBtYXRjaGVzIGEga25vd24gVFMgaGVscGVyXG4gICAgICAgIC8vIGZ1bmN0aW9uLiBUaGlzIGNhbiBoYXBwZW4gaWYgYSBwYWNrYWdlIGlzIGNvbXBpbGVkIHdpdGggYG5vRW1pdEhlbHBlcnM6IHRydWVgIGFuZFxuICAgICAgICAvLyBgaW1wb3J0SGVscGVyczogZmFsc2VgICh0aGUgZGVmYXVsdCkuIFRoaXMgaXMsIGZvciBleGFtcGxlLCB0aGUgY2FzZSB3aXRoXG4gICAgICAgIC8vIGBAbmF0aXZlc2NyaXB0L2FuZ3VsYXJAOS4wLjAtbmV4dC0yMDE5LTExLTEyLTE1NTUwMC0wMWAuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAga2luZDogRGVjbGFyYXRpb25LaW5kLklubGluZSxcbiAgICAgICAgICBub2RlOiBpZCxcbiAgICAgICAgICBrbm93bjogbm9uRW1pdHRlZE5vckltcG9ydGVkVHNIZWxwZXJEZWNsYXJhdGlvbixcbiAgICAgICAgICB2aWFNb2R1bGU6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRlY2xhcmF0aW9uID09PSBudWxsIHx8IGRlY2xhcmF0aW9uLm5vZGUgPT09IG51bGwgfHwgZGVjbGFyYXRpb24ua25vd24gIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBkZWNsYXJhdGlvbjtcbiAgICB9XG5cbiAgICBpZiAoIXRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbi5ub2RlKSB8fCBkZWNsYXJhdGlvbi5ub2RlLmluaXRpYWxpemVyICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgLy8gVmFyaWFibGVEZWNsYXJhdGlvbiA9PiBWYXJpYWJsZURlY2xhcmF0aW9uTGlzdCA9PiBWYXJpYWJsZVN0YXRlbWVudCA9PiBJSUZFIEJsb2NrXG4gICAgICAgICF0cy5pc0Jsb2NrKGRlY2xhcmF0aW9uLm5vZGUucGFyZW50LnBhcmVudC5wYXJlbnQpKSB7XG4gICAgICByZXR1cm4gZGVjbGFyYXRpb247XG4gICAgfVxuXG4gICAgLy8gV2UgbWlnaHQgaGF2ZSBhbiBhbGlhcyB0byBhbm90aGVyIHZhcmlhYmxlIGRlY2xhcmF0aW9uLlxuICAgIC8vIFNlYXJjaCB0aGUgY29udGFpbmluZyBpaWZlIGJvZHkgZm9yIGl0LlxuICAgIGNvbnN0IGJsb2NrID0gZGVjbGFyYXRpb24ubm9kZS5wYXJlbnQucGFyZW50LnBhcmVudDtcbiAgICBjb25zdCBhbGlhc1N5bWJvbCA9IHRoaXMuY2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKGRlY2xhcmF0aW9uLm5vZGUubmFtZSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9jay5zdGF0ZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzdGF0ZW1lbnQgPSBibG9jay5zdGF0ZW1lbnRzW2ldO1xuICAgICAgLy8gTG9va2luZyBmb3Igc3RhdGVtZW50IHRoYXQgbG9va3MgbGlrZTogYEFsaWFzZWRWYXJpYWJsZSA9IE9yaWdpbmFsVmFyaWFibGU7YFxuICAgICAgaWYgKGlzQXNzaWdubWVudFN0YXRlbWVudChzdGF0ZW1lbnQpICYmIHRzLmlzSWRlbnRpZmllcihzdGF0ZW1lbnQuZXhwcmVzc2lvbi5sZWZ0KSAmJlxuICAgICAgICAgIHRzLmlzSWRlbnRpZmllcihzdGF0ZW1lbnQuZXhwcmVzc2lvbi5yaWdodCkgJiZcbiAgICAgICAgICB0aGlzLmNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihzdGF0ZW1lbnQuZXhwcmVzc2lvbi5sZWZ0KSA9PT0gYWxpYXNTeW1ib2wpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXIoc3RhdGVtZW50LmV4cHJlc3Npb24ucmlnaHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWNsYXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBhIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIHRvIGZpbmQgdGhlIHJlbGV2YW50IG1ldGFkYXRhIGFib3V0IGl0LlxuICAgKlxuICAgKiBJbiBFU001IHdlIG5lZWQgdG8gZG8gc3BlY2lhbCB3b3JrIHdpdGggb3B0aW9uYWwgYXJndW1lbnRzIHRvIHRoZSBmdW5jdGlvbiwgc2luY2UgdGhleSBnZXRcbiAgICogdGhlaXIgb3duIGluaXRpYWxpemVyIHN0YXRlbWVudCB0aGF0IG5lZWRzIHRvIGJlIHBhcnNlZCBhbmQgdGhlbiBub3QgaW5jbHVkZWQgaW4gdGhlIFwiYm9keVwiXG4gICAqIHN0YXRlbWVudHMgb2YgdGhlIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZSB0aGUgZnVuY3Rpb24gZGVjbGFyYXRpb24gdG8gcGFyc2UuXG4gICAqIEByZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBub2RlLCBzdGF0ZW1lbnRzIGFuZCBwYXJhbWV0ZXJzIG9mIHRoZSBmdW5jdGlvbi5cbiAgICovXG4gIG92ZXJyaWRlIGdldERlZmluaXRpb25PZkZ1bmN0aW9uKG5vZGU6IHRzLk5vZGUpOiBGdW5jdGlvbkRlZmluaXRpb258bnVsbCB7XG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHN1cGVyLmdldERlZmluaXRpb25PZkZ1bmN0aW9uKG5vZGUpO1xuICAgIGlmIChkZWZpbml0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBGaWx0ZXIgb3V0IGFuZCBjYXB0dXJlIHBhcmFtZXRlciBpbml0aWFsaXplcnNcbiAgICBpZiAoZGVmaW5pdGlvbi5ib2R5ICE9PSBudWxsKSB7XG4gICAgICBsZXQgbG9va2luZ0ZvckluaXRpYWxpemVycyA9IHRydWU7XG4gICAgICBjb25zdCBzdGF0ZW1lbnRzID0gZGVmaW5pdGlvbi5ib2R5LmZpbHRlcihzID0+IHtcbiAgICAgICAgbG9va2luZ0ZvckluaXRpYWxpemVycyA9XG4gICAgICAgICAgICBsb29raW5nRm9ySW5pdGlhbGl6ZXJzICYmIGNhcHR1cmVQYXJhbUluaXRpYWxpemVyKHMsIGRlZmluaXRpb24ucGFyYW1ldGVycyk7XG4gICAgICAgIC8vIElmIHdlIGFyZSBubyBsb25nZXIgbG9va2luZyBmb3IgcGFyYW1ldGVyIGluaXRpYWxpemVycyB0aGVuIHdlIGluY2x1ZGUgdGhpcyBzdGF0ZW1lbnRcbiAgICAgICAgcmV0dXJuICFsb29raW5nRm9ySW5pdGlhbGl6ZXJzO1xuICAgICAgfSk7XG4gICAgICBkZWZpbml0aW9uLmJvZHkgPSBzdGF0ZW1lbnRzO1xuICAgIH1cblxuICAgIHJldHVybiBkZWZpbml0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYSBgRGVjbGFyYXRpb25gIGNvcnJlc3BvbmRzIHdpdGggYSBrbm93biBkZWNsYXJhdGlvbiwgc3VjaCBhcyBhIFR5cGVTY3JpcHQgaGVscGVyXG4gICAqIGZ1bmN0aW9uLCBhbmQgc2V0IGl0cyBga25vd25gIHByb3BlcnR5IHRvIHRoZSBhcHByb3ByaWF0ZSBgS25vd25EZWNsYXJhdGlvbmAuXG4gICAqXG4gICAqIEBwYXJhbSBkZWNsIFRoZSBgRGVjbGFyYXRpb25gIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJuIFRoZSBwYXNzZWQgaW4gYERlY2xhcmF0aW9uYCAocG90ZW50aWFsbHkgZW5oYW5jZWQgd2l0aCBhIGBLbm93bkRlY2xhcmF0aW9uYCkuXG4gICAqL1xuICBvdmVycmlkZSBkZXRlY3RLbm93bkRlY2xhcmF0aW9uPFQgZXh0ZW5kcyBEZWNsYXJhdGlvbj4oZGVjbDogVCk6IFQge1xuICAgIGRlY2wgPSBzdXBlci5kZXRlY3RLbm93bkRlY2xhcmF0aW9uKGRlY2wpO1xuXG4gICAgLy8gQWxzbyBjaGVjayBmb3IgVFMgaGVscGVyc1xuICAgIGlmIChkZWNsLmtub3duID09PSBudWxsICYmIGRlY2wubm9kZSAhPT0gbnVsbCkge1xuICAgICAgZGVjbC5rbm93biA9IGdldFRzSGVscGVyRm5Gcm9tRGVjbGFyYXRpb24oZGVjbC5ub2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVjbDtcbiAgfVxuXG5cbiAgLy8vLy8vLy8vLy8vLyBQcm90ZWN0ZWQgSGVscGVycyAvLy8vLy8vLy8vLy8vXG5cbiAgLyoqXG4gICAqIEluIEVTNSwgdGhlIGltcGxlbWVudGF0aW9uIG9mIGEgY2xhc3MgaXMgYSBmdW5jdGlvbiBleHByZXNzaW9uIHRoYXQgaXMgaGlkZGVuIGluc2lkZSBhbiBJSUZFLFxuICAgKiB3aG9zZSB2YWx1ZSBpcyBhc3NpZ25lZCB0byBhIHZhcmlhYmxlICh3aGljaCByZXByZXNlbnRzIHRoZSBjbGFzcyB0byB0aGUgcmVzdCBvZiB0aGUgcHJvZ3JhbSkuXG4gICAqIFNvIHdlIG1pZ2h0IG5lZWQgdG8gZGlnIGFyb3VuZCB0byBnZXQgaG9sZCBvZiB0aGUgXCJjbGFzc1wiIGRlY2xhcmF0aW9uLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBleHRyYWN0cyBhIGBOZ2NjQ2xhc3NTeW1ib2xgIGlmIGBkZWNsYXJhdGlvbmAgaXMgdGhlIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIGluc2lkZVxuICAgKiB0aGUgSUlGRS4gT3RoZXJ3aXNlLCB1bmRlZmluZWQgaXMgcmV0dXJuZWQuXG4gICAqXG4gICAqIEBwYXJhbSBkZWNsYXJhdGlvbiB0aGUgZGVjbGFyYXRpb24gd2hvc2Ugc3ltYm9sIHdlIGFyZSBmaW5kaW5nLlxuICAgKiBAcmV0dXJucyB0aGUgc3ltYm9sIGZvciB0aGUgbm9kZSBvciBgdW5kZWZpbmVkYCBpZiBpdCBpcyBub3QgYSBcImNsYXNzXCIgb3IgaGFzIG5vIHN5bWJvbC5cbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXRDbGFzc1N5bWJvbEZyb21Jbm5lckRlY2xhcmF0aW9uKGRlY2xhcmF0aW9uOiB0cy5Ob2RlKTogTmdjY0NsYXNzU3ltYm9sXG4gICAgICB8dW5kZWZpbmVkIHtcbiAgICBjb25zdCBjbGFzc1N5bWJvbCA9IHN1cGVyLmdldENsYXNzU3ltYm9sRnJvbUlubmVyRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pO1xuICAgIGlmIChjbGFzc1N5bWJvbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY2xhc3NTeW1ib2w7XG4gICAgfVxuXG4gICAgaWYgKCFpc05hbWVkRnVuY3Rpb25EZWNsYXJhdGlvbihkZWNsYXJhdGlvbikpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0ZXJOb2RlID0gZ2V0T3V0ZXJOb2RlRnJvbUlubmVyRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pO1xuICAgIGlmIChvdXRlck5vZGUgPT09IG51bGwgfHwgIWhhc05hbWVJZGVudGlmaWVyKG91dGVyTm9kZSkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlQ2xhc3NTeW1ib2wob3V0ZXJOb2RlLm5hbWUsIGRlY2xhcmF0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBkZWNsYXJhdGlvbnMgb2YgdGhlIGNvbnN0cnVjdG9yIHBhcmFtZXRlcnMgb2YgYSBjbGFzcyBpZGVudGlmaWVkIGJ5IGl0cyBzeW1ib2wuXG4gICAqXG4gICAqIEluIEVTTTUsIHRoZXJlIGlzIG5vIFwiY2xhc3NcIiBzbyB0aGUgY29uc3RydWN0b3IgdGhhdCB3ZSB3YW50IGlzIGFjdHVhbGx5IHRoZSBpbm5lciBmdW5jdGlvblxuICAgKiBkZWNsYXJhdGlvbiBpbnNpZGUgdGhlIElJRkUsIHdob3NlIHJldHVybiB2YWx1ZSBpcyBhc3NpZ25lZCB0byB0aGUgb3V0ZXIgdmFyaWFibGUgZGVjbGFyYXRpb25cbiAgICogKHRoYXQgcmVwcmVzZW50cyB0aGUgY2xhc3MgdG8gdGhlIHJlc3Qgb2YgdGhlIHByb2dyYW0pLlxuICAgKlxuICAgKiBAcGFyYW0gY2xhc3NTeW1ib2wgdGhlIHN5bWJvbCBvZiB0aGUgY2xhc3MgKGkuZS4gdGhlIG91dGVyIHZhcmlhYmxlIGRlY2xhcmF0aW9uKSB3aG9zZVxuICAgKiBwYXJhbWV0ZXJzIHdlIHdhbnQgdG8gZmluZC5cbiAgICogQHJldHVybnMgYW4gYXJyYXkgb2YgYHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uYCBvYmplY3RzIHJlcHJlc2VudGluZyBlYWNoIG9mIHRoZSBwYXJhbWV0ZXJzIGluXG4gICAqIHRoZSBjbGFzcydzIGNvbnN0cnVjdG9yIG9yIGBudWxsYCBpZiB0aGVyZSBpcyBubyBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXRDb25zdHJ1Y3RvclBhcmFtZXRlckRlY2xhcmF0aW9ucyhjbGFzc1N5bWJvbDogTmdjY0NsYXNzU3ltYm9sKTpcbiAgICAgIHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uW118bnVsbCB7XG4gICAgY29uc3QgY29uc3RydWN0b3IgPSBjbGFzc1N5bWJvbC5pbXBsZW1lbnRhdGlvbi52YWx1ZURlY2xhcmF0aW9uO1xuICAgIGlmICghdHMuaXNGdW5jdGlvbkRlY2xhcmF0aW9uKGNvbnN0cnVjdG9yKSkgcmV0dXJuIG51bGw7XG5cbiAgICBpZiAoY29uc3RydWN0b3IucGFyYW1ldGVycy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShjb25zdHJ1Y3Rvci5wYXJhbWV0ZXJzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1N5bnRoZXNpemVkQ29uc3RydWN0b3IoY29uc3RydWN0b3IpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBwYXJhbWV0ZXIgdHlwZSBhbmQgZGVjb3JhdG9ycyBmb3IgdGhlIGNvbnN0cnVjdG9yIG9mIGEgY2xhc3MsXG4gICAqIHdoZXJlIHRoZSBpbmZvcm1hdGlvbiBpcyBzdG9yZWQgb24gYSBzdGF0aWMgbWV0aG9kIG9mIHRoZSBjbGFzcy5cbiAgICpcbiAgICogSW4gdGhpcyBjYXNlIHRoZSBkZWNvcmF0b3JzIGFyZSBzdG9yZWQgaW4gdGhlIGJvZHkgb2YgYSBtZXRob2RcbiAgICogKGBjdG9yUGFyYXRlbWVyc2ApIGF0dGFjaGVkIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICpcbiAgICogTm90ZSB0aGF0IHVubGlrZSBFU00yMDE1IHRoaXMgaXMgYSBmdW5jdGlvbiBleHByZXNzaW9uIHJhdGhlciB0aGFuIGFuIGFycm93XG4gICAqIGZ1bmN0aW9uOlxuICAgKlxuICAgKiBgYGBcbiAgICogU29tZURpcmVjdGl2ZS5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gW1xuICAgKiAgIHsgdHlwZTogVmlld0NvbnRhaW5lclJlZiwgfSxcbiAgICogICB7IHR5cGU6IFRlbXBsYXRlUmVmLCB9LFxuICAgKiAgIHsgdHlwZTogSXRlcmFibGVEaWZmZXJzLCB9LFxuICAgKiAgIHsgdHlwZTogdW5kZWZpbmVkLCBkZWNvcmF0b3JzOiBbeyB0eXBlOiBJbmplY3QsIGFyZ3M6IFtJTkpFQ1RFRF9UT0tFTixdIH0sXSB9LFxuICAgKiBdOyB9O1xuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHBhcmFtRGVjb3JhdG9yc1Byb3BlcnR5IHRoZSBwcm9wZXJ0eSB0aGF0IGhvbGRzIHRoZSBwYXJhbWV0ZXIgaW5mbyB3ZSB3YW50IHRvIGdldC5cbiAgICogQHJldHVybnMgYW4gYXJyYXkgb2Ygb2JqZWN0cyBjb250YWluaW5nIHRoZSB0eXBlIGFuZCBkZWNvcmF0b3JzIGZvciBlYWNoIHBhcmFtZXRlci5cbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXRQYXJhbUluZm9Gcm9tU3RhdGljUHJvcGVydHkocGFyYW1EZWNvcmF0b3JzUHJvcGVydHk6IHRzLlN5bWJvbCk6XG4gICAgICBQYXJhbUluZm9bXXxudWxsIHtcbiAgICBjb25zdCBwYXJhbURlY29yYXRvcnMgPSBnZXRQcm9wZXJ0eVZhbHVlRnJvbVN5bWJvbChwYXJhbURlY29yYXRvcnNQcm9wZXJ0eSk7XG4gICAgLy8gVGhlIGRlY29yYXRvcnMgYXJyYXkgbWF5IGJlIHdyYXBwZWQgaW4gYSBmdW5jdGlvbi4gSWYgc28gdW53cmFwIGl0LlxuICAgIGNvbnN0IHJldHVyblN0YXRlbWVudCA9IGdldFJldHVyblN0YXRlbWVudChwYXJhbURlY29yYXRvcnMpO1xuICAgIGNvbnN0IGV4cHJlc3Npb24gPSByZXR1cm5TdGF0ZW1lbnQgPyByZXR1cm5TdGF0ZW1lbnQuZXhwcmVzc2lvbiA6IHBhcmFtRGVjb3JhdG9ycztcbiAgICBpZiAoZXhwcmVzc2lvbiAmJiB0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24oZXhwcmVzc2lvbikpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnRzID0gZXhwcmVzc2lvbi5lbGVtZW50cztcbiAgICAgIHJldHVybiBlbGVtZW50cy5tYXAocmVmbGVjdEFycmF5RWxlbWVudCkubWFwKHBhcmFtSW5mbyA9PiB7XG4gICAgICAgIGNvbnN0IHR5cGVFeHByZXNzaW9uID0gcGFyYW1JbmZvICYmIHBhcmFtSW5mby5oYXMoJ3R5cGUnKSA/IHBhcmFtSW5mby5nZXQoJ3R5cGUnKSEgOiBudWxsO1xuICAgICAgICBjb25zdCBkZWNvcmF0b3JJbmZvID1cbiAgICAgICAgICAgIHBhcmFtSW5mbyAmJiBwYXJhbUluZm8uaGFzKCdkZWNvcmF0b3JzJykgPyBwYXJhbUluZm8uZ2V0KCdkZWNvcmF0b3JzJykhIDogbnVsbDtcbiAgICAgICAgY29uc3QgZGVjb3JhdG9ycyA9IGRlY29yYXRvckluZm8gJiYgdGhpcy5yZWZsZWN0RGVjb3JhdG9ycyhkZWNvcmF0b3JJbmZvKTtcbiAgICAgICAgcmV0dXJuIHt0eXBlRXhwcmVzc2lvbiwgZGVjb3JhdG9yc307XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHBhcmFtRGVjb3JhdG9ycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmxvZ2dlci53YXJuKFxuICAgICAgICAgICdJbnZhbGlkIGNvbnN0cnVjdG9yIHBhcmFtZXRlciBkZWNvcmF0b3IgaW4gJyArIHBhcmFtRGVjb3JhdG9ycy5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUgK1xuICAgICAgICAgICAgICAnOlxcbicsXG4gICAgICAgICAgcGFyYW1EZWNvcmF0b3JzLmdldFRleHQoKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZmxlY3Qgb3ZlciBhIHN5bWJvbCBhbmQgZXh0cmFjdCB0aGUgbWVtYmVyIGluZm9ybWF0aW9uLCBjb21iaW5pbmcgaXQgd2l0aCB0aGVcbiAgICogcHJvdmlkZWQgZGVjb3JhdG9yIGluZm9ybWF0aW9uLCBhbmQgd2hldGhlciBpdCBpcyBhIHN0YXRpYyBtZW1iZXIuXG4gICAqXG4gICAqIElmIGEgY2xhc3MgbWVtYmVyIHVzZXMgYWNjZXNzb3JzIChlLmcgZ2V0dGVycyBhbmQvb3Igc2V0dGVycykgdGhlbiBpdCBnZXRzIGRvd25sZXZlbGVkXG4gICAqIGluIEVTNSB0byBhIHNpbmdsZSBgT2JqZWN0LmRlZmluZVByb3BlcnR5KClgIGNhbGwuIEluIHRoYXQgY2FzZSB3ZSBtdXN0IHBhcnNlIHRoaXNcbiAgICogY2FsbCB0byBleHRyYWN0IHRoZSBvbmUgb3IgdHdvIENsYXNzTWVtYmVyIG9iamVjdHMgdGhhdCByZXByZXNlbnQgdGhlIGFjY2Vzc29ycy5cbiAgICpcbiAgICogQHBhcmFtIHN5bWJvbCB0aGUgc3ltYm9sIGZvciB0aGUgbWVtYmVyIHRvIHJlZmxlY3Qgb3Zlci5cbiAgICogQHBhcmFtIGRlY29yYXRvcnMgYW4gYXJyYXkgb2YgZGVjb3JhdG9ycyBhc3NvY2lhdGVkIHdpdGggdGhlIG1lbWJlci5cbiAgICogQHBhcmFtIGlzU3RhdGljIHRydWUgaWYgdGhpcyBtZW1iZXIgaXMgc3RhdGljLCBmYWxzZSBpZiBpdCBpcyBhbiBpbnN0YW5jZSBwcm9wZXJ0eS5cbiAgICogQHJldHVybnMgdGhlIHJlZmxlY3RlZCBtZW1iZXIgaW5mb3JtYXRpb24sIG9yIG51bGwgaWYgdGhlIHN5bWJvbCBpcyBub3QgYSBtZW1iZXIuXG4gICAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcmVmbGVjdE1lbWJlcnMoXG4gICAgICBzeW1ib2w6IHRzLlN5bWJvbCwgZGVjb3JhdG9ycz86IERlY29yYXRvcltdLCBpc1N0YXRpYz86IGJvb2xlYW4pOiBDbGFzc01lbWJlcltdfG51bGwge1xuICAgIGNvbnN0IG5vZGUgPSBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbiB8fCBzeW1ib2wuZGVjbGFyYXRpb25zICYmIHN5bWJvbC5kZWNsYXJhdGlvbnNbMF07XG4gICAgY29uc3QgcHJvcGVydHlEZWZpbml0aW9uID0gbm9kZSAmJiBnZXRQcm9wZXJ0eURlZmluaXRpb24obm9kZSk7XG4gICAgaWYgKHByb3BlcnR5RGVmaW5pdGlvbikge1xuICAgICAgY29uc3QgbWVtYmVyczogQ2xhc3NNZW1iZXJbXSA9IFtdO1xuICAgICAgaWYgKHByb3BlcnR5RGVmaW5pdGlvbi5zZXR0ZXIpIHtcbiAgICAgICAgbWVtYmVycy5wdXNoKHtcbiAgICAgICAgICBub2RlOiBub2RlISxcbiAgICAgICAgICBpbXBsZW1lbnRhdGlvbjogcHJvcGVydHlEZWZpbml0aW9uLnNldHRlcixcbiAgICAgICAgICBraW5kOiBDbGFzc01lbWJlcktpbmQuU2V0dGVyLFxuICAgICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgICAgbmFtZTogc3ltYm9sLm5hbWUsXG4gICAgICAgICAgbmFtZU5vZGU6IG51bGwsXG4gICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgaXNTdGF0aWM6IGlzU3RhdGljIHx8IGZhbHNlLFxuICAgICAgICAgIGRlY29yYXRvcnM6IGRlY29yYXRvcnMgfHwgW10sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFByZXZlbnQgYXR0YWNoaW5nIHRoZSBkZWNvcmF0b3JzIHRvIGEgcG90ZW50aWFsIGdldHRlci4gSW4gRVM1LCB3ZSBjYW4ndCB0ZWxsIHdoZXJlIHRoZVxuICAgICAgICAvLyBkZWNvcmF0b3JzIHdlcmUgb3JpZ2luYWxseSBhdHRhY2hlZCB0bywgaG93ZXZlciB3ZSBvbmx5IHdhbnQgdG8gYXR0YWNoIHRoZW0gdG8gYSBzaW5nbGVcbiAgICAgICAgLy8gYENsYXNzTWVtYmVyYCBhcyBvdGhlcndpc2Ugbmd0c2Mgd291bGQgaGFuZGxlIHRoZSBzYW1lIGRlY29yYXRvcnMgdHdpY2UuXG4gICAgICAgIGRlY29yYXRvcnMgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBpZiAocHJvcGVydHlEZWZpbml0aW9uLmdldHRlcikge1xuICAgICAgICBtZW1iZXJzLnB1c2goe1xuICAgICAgICAgIG5vZGU6IG5vZGUhLFxuICAgICAgICAgIGltcGxlbWVudGF0aW9uOiBwcm9wZXJ0eURlZmluaXRpb24uZ2V0dGVyLFxuICAgICAgICAgIGtpbmQ6IENsYXNzTWVtYmVyS2luZC5HZXR0ZXIsXG4gICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgICBuYW1lOiBzeW1ib2wubmFtZSxcbiAgICAgICAgICBuYW1lTm9kZTogbnVsbCxcbiAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICBpc1N0YXRpYzogaXNTdGF0aWMgfHwgZmFsc2UsXG4gICAgICAgICAgZGVjb3JhdG9yczogZGVjb3JhdG9ycyB8fCBbXSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVtYmVycztcbiAgICB9XG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3VwZXIucmVmbGVjdE1lbWJlcnMoc3ltYm9sLCBkZWNvcmF0b3JzLCBpc1N0YXRpYyk7XG4gICAgbWVtYmVycyAmJiBtZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcbiAgICAgIGlmIChtZW1iZXIgJiYgbWVtYmVyLmtpbmQgPT09IENsYXNzTWVtYmVyS2luZC5NZXRob2QgJiYgbWVtYmVyLmlzU3RhdGljICYmIG1lbWJlci5ub2RlICYmXG4gICAgICAgICAgdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obWVtYmVyLm5vZGUpICYmIG1lbWJlci5ub2RlLnBhcmVudCAmJlxuICAgICAgICAgIHRzLmlzQmluYXJ5RXhwcmVzc2lvbihtZW1iZXIubm9kZS5wYXJlbnQpICYmXG4gICAgICAgICAgdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24obWVtYmVyLm5vZGUucGFyZW50LnJpZ2h0KSkge1xuICAgICAgICAvLyBSZWNvbXB1dGUgdGhlIGltcGxlbWVudGF0aW9uIGZvciB0aGlzIG1lbWJlcjpcbiAgICAgICAgLy8gRVM1IHN0YXRpYyBtZXRob2RzIGFyZSB2YXJpYWJsZSBkZWNsYXJhdGlvbnMgc28gdGhlIGRlY2xhcmF0aW9uIGlzIGFjdHVhbGx5IHRoZVxuICAgICAgICAvLyBpbml0aWFsaXplciBvZiB0aGUgdmFyaWFibGUgYXNzaWdubWVudFxuICAgICAgICBtZW1iZXIuaW1wbGVtZW50YXRpb24gPSBtZW1iZXIubm9kZS5wYXJlbnQucmlnaHQ7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG1lbWJlcnM7XG4gIH1cblxuICAvKipcbiAgICogRmluZCBzdGF0ZW1lbnRzIHJlbGF0ZWQgdG8gdGhlIGdpdmVuIGNsYXNzIHRoYXQgbWF5IGNvbnRhaW4gY2FsbHMgdG8gYSBoZWxwZXIuXG4gICAqXG4gICAqIEluIEVTTTUgY29kZSB0aGUgaGVscGVyIGNhbGxzIGFyZSBoaWRkZW4gaW5zaWRlIHRoZSBjbGFzcydzIElJRkUuXG4gICAqXG4gICAqIEBwYXJhbSBjbGFzc1N5bWJvbCB0aGUgY2xhc3Mgd2hvc2UgaGVscGVyIGNhbGxzIHdlIGFyZSBpbnRlcmVzdGVkIGluLiBXZSBleHBlY3QgdGhpcyBzeW1ib2xcbiAgICogdG8gcmVmZXJlbmNlIHRoZSBpbm5lciBpZGVudGlmaWVyIGluc2lkZSB0aGUgSUlGRS5cbiAgICogQHJldHVybnMgYW4gYXJyYXkgb2Ygc3RhdGVtZW50cyB0aGF0IG1heSBjb250YWluIGhlbHBlciBjYWxscy5cbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXRTdGF0ZW1lbnRzRm9yQ2xhc3MoY2xhc3NTeW1ib2w6IE5nY2NDbGFzc1N5bWJvbCk6IHRzLlN0YXRlbWVudFtdIHtcbiAgICBjb25zdCBjbGFzc0RlY2xhcmF0aW9uUGFyZW50ID0gY2xhc3NTeW1ib2wuaW1wbGVtZW50YXRpb24udmFsdWVEZWNsYXJhdGlvbi5wYXJlbnQ7XG4gICAgcmV0dXJuIHRzLmlzQmxvY2soY2xhc3NEZWNsYXJhdGlvblBhcmVudCkgPyBBcnJheS5mcm9tKGNsYXNzRGVjbGFyYXRpb25QYXJlbnQuc3RhdGVtZW50cykgOiBbXTtcbiAgfVxuXG4gIC8vLy8vLy8vLy8vLy8gSG9zdCBQcml2YXRlIEhlbHBlcnMgLy8vLy8vLy8vLy8vL1xuXG4gIC8qKlxuICAgKiBBIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIG1heSBoYXZlIGJlZW4gXCJzeW50aGVzaXplZFwiIGJ5IFR5cGVTY3JpcHQgZHVyaW5nIEphdmFTY3JpcHQgZW1pdCxcbiAgICogaW4gdGhlIGNhc2Ugbm8gdXNlci1kZWZpbmVkIGNvbnN0cnVjdG9yIGV4aXN0cyBhbmQgZS5nLiBwcm9wZXJ0eSBpbml0aWFsaXplcnMgYXJlIHVzZWQuXG4gICAqIFRob3NlIGluaXRpYWxpemVycyBuZWVkIHRvIGJlIGVtaXR0ZWQgaW50byBhIGNvbnN0cnVjdG9yIGluIEphdmFTY3JpcHQsIHNvIHRoZSBUeXBlU2NyaXB0XG4gICAqIGNvbXBpbGVyIGdlbmVyYXRlcyBhIHN5bnRoZXRpYyBjb25zdHJ1Y3Rvci5cbiAgICpcbiAgICogV2UgbmVlZCB0byBpZGVudGlmeSBzdWNoIGNvbnN0cnVjdG9ycyBhcyBuZ2NjIG5lZWRzIHRvIGJlIGFibGUgdG8gdGVsbCBpZiBhIGNsYXNzIGRpZFxuICAgKiBvcmlnaW5hbGx5IGhhdmUgYSBjb25zdHJ1Y3RvciBpbiB0aGUgVHlwZVNjcmlwdCBzb3VyY2UuIEZvciBFUzUsIHdlIGNhbiBub3QgdGVsbCBhblxuICAgKiBlbXB0eSBjb25zdHJ1Y3RvciBhcGFydCBmcm9tIGEgc3ludGhlc2l6ZWQgY29uc3RydWN0b3IsIGJ1dCBmb3J0dW5hdGVseSB0aGF0IGRvZXMgbm90XG4gICAqIG1hdHRlciBmb3IgdGhlIGNvZGUgZ2VuZXJhdGVkIGJ5IG5ndHNjLlxuICAgKlxuICAgKiBXaGVuIGEgY2xhc3MgaGFzIGEgc3VwZXJjbGFzcyBob3dldmVyLCBhIHN5bnRoZXNpemVkIGNvbnN0cnVjdG9yIG11c3Qgbm90IGJlIGNvbnNpZGVyZWRcbiAgICogYXMgYSB1c2VyLWRlZmluZWQgY29uc3RydWN0b3IgYXMgdGhhdCBwcmV2ZW50cyBhIGJhc2UgZmFjdG9yeSBjYWxsIGZyb20gYmVpbmcgY3JlYXRlZCBieVxuICAgKiBuZ3RzYywgcmVzdWx0aW5nIGluIGEgZmFjdG9yeSBmdW5jdGlvbiB0aGF0IGRvZXMgbm90IGluamVjdCB0aGUgZGVwZW5kZW5jaWVzIG9mIHRoZVxuICAgKiBzdXBlcmNsYXNzLiBIZW5jZSwgd2UgaWRlbnRpZnkgYSBkZWZhdWx0IHN5bnRoZXNpemVkIHN1cGVyIGNhbGwgaW4gdGhlIGNvbnN0cnVjdG9yIGJvZHksXG4gICAqIGFjY29yZGluZyB0byB0aGUgc3RydWN0dXJlIHRoYXQgVHlwZVNjcmlwdCdzIEVTMjAxNSB0byBFUzUgdHJhbnNmb3JtZXIgZ2VuZXJhdGVzIGluXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9ibG9iL3YzLjIuMi9zcmMvY29tcGlsZXIvdHJhbnNmb3JtZXJzL2VzMjAxNS50cyNMMTA4Mi1MMTA5OFxuICAgKlxuICAgKiBBZGRpdGlvbmFsbHksIHdlIGhhbmRsZSBzeW50aGV0aWMgZGVsZWdhdGUgY29uc3RydWN0b3JzIHRoYXQgYXJlIGVtaXR0ZWQgd2hlbiBUeXBlU2NyaXB0XG4gICAqIGRvd25sZXZlbCdzIEVTMjAxNSBzeW50aGV0aWNhbGx5IGdlbmVyYXRlZCB0byBFUzUuIFRoZXNlIHZhcnkgc2xpZ2h0bHkgZnJvbSB0aGUgZGVmYXVsdFxuICAgKiBzdHJ1Y3R1cmUgbWVudGlvbmVkIGFib3ZlIGJlY2F1c2UgdGhlIEVTMjAxNSBvdXRwdXQgdXNlcyBhIHNwcmVhZCBvcGVyYXRvciwgZm9yIGRlbGVnYXRpbmdcbiAgICogdG8gdGhlIHBhcmVudCBjb25zdHJ1Y3RvciwgdGhhdCBpcyBwcmVzZXJ2ZWQgdGhyb3VnaCBhIFR5cGVTY3JpcHQgaGVscGVyIGluIEVTNS4gZS5nLlxuICAgKlxuICAgKiBgYGBcbiAgICogcmV0dXJuIF9zdXBlci5hcHBseSh0aGlzLCB0c2xpYi5fX3NwcmVhZChhcmd1bWVudHMpKSB8fCB0aGlzO1xuICAgKiBgYGBcbiAgICpcbiAgICogb3IsIHNpbmNlIFR5cGVTY3JpcHQgNC4yIGl0IHdvdWxkIGJlXG4gICAqXG4gICAqIGBgYFxuICAgKiByZXR1cm4gX3N1cGVyLmFwcGx5KHRoaXMsIHRzbGliLl9fc3ByZWFkQXJyYXkoW10sIHRzbGliLl9fcmVhZChhcmd1bWVudHMpKSkgfHwgdGhpcztcbiAgICogYGBgXG4gICAqXG4gICAqIFN1Y2ggY29uc3RydWN0cyBjYW4gYmUgc3RpbGwgY29uc2lkZXJlZCBhcyBzeW50aGV0aWMgZGVsZWdhdGUgY29uc3RydWN0b3JzIGFzIHRoZXkgYXJlXG4gICAqIHRoZSBwcm9kdWN0IG9mIGEgY29tbW9uIFR5cGVTY3JpcHQgdG8gRVM1IHN5bnRoZXRpYyBjb25zdHJ1Y3RvciwganVzdCBiZWluZyBkb3dubGV2ZWxlZFxuICAgKiB0byBFUzUgdXNpbmcgYHRzY2AuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMzg0NTMuXG4gICAqXG4gICAqXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RvciBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIHRlc3RcbiAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY29uc3RydWN0b3IgYXBwZWFycyB0byBoYXZlIGJlZW4gc3ludGhlc2l6ZWRcbiAgICovXG4gIHByaXZhdGUgaXNTeW50aGVzaXplZENvbnN0cnVjdG9yKGNvbnN0cnVjdG9yOiB0cy5GdW5jdGlvbkRlY2xhcmF0aW9uKTogYm9vbGVhbiB7XG4gICAgaWYgKCFjb25zdHJ1Y3Rvci5ib2R5KSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBmaXJzdFN0YXRlbWVudCA9IGNvbnN0cnVjdG9yLmJvZHkuc3RhdGVtZW50c1swXTtcbiAgICBpZiAoIWZpcnN0U3RhdGVtZW50KSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gdGhpcy5pc1N5bnRoZXNpemVkU3VwZXJUaGlzQXNzaWdubWVudChmaXJzdFN0YXRlbWVudCkgfHxcbiAgICAgICAgdGhpcy5pc1N5bnRoZXNpemVkU3VwZXJSZXR1cm5TdGF0ZW1lbnQoZmlyc3RTdGF0ZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIElkZW50aWZpZXMgc3ludGhlc2l6ZWQgc3VwZXIgY2FsbHMgd2hpY2ggcGFzcy10aHJvdWdoIGZ1bmN0aW9uIGFyZ3VtZW50cyBkaXJlY3RseSBhbmQgYXJlXG4gICAqIGJlaW5nIGFzc2lnbmVkIHRvIGEgY29tbW9uIGBfdGhpc2AgdmFyaWFibGUuIFRoZSBmb2xsb3dpbmcgcGF0dGVybnMgd2UgaW50ZW5kIHRvIG1hdGNoOlxuICAgKlxuICAgKiAxLiBEZWxlZ2F0ZSBjYWxsIGVtaXR0ZWQgYnkgVHlwZVNjcmlwdCB3aGVuIGl0IGVtaXRzIEVTNSBkaXJlY3RseS5cbiAgICogICBgYGBcbiAgICogICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICogICBgYGBcbiAgICpcbiAgICogMi4gRGVsZWdhdGUgY2FsbCBlbWl0dGVkIGJ5IFR5cGVTY3JpcHQgd2hlbiBpdCBkb3dubGV2ZWwncyBFUzIwMTUgdG8gRVM1LlxuICAgKiAgIGBgYFxuICAgKiAgIHZhciBfdGhpcyA9IF9zdXBlci5hcHBseSh0aGlzLCB0c2xpYi5fX3NwcmVhZChhcmd1bWVudHMpKSB8fCB0aGlzO1xuICAgKiAgIGBgYFxuICAgKiAgIG9yIHVzaW5nIHRoZSBzeW50YXggZW1pdHRlZCBzaW5jZSBUeXBlU2NyaXB0IDQuMjpcbiAgICogICBgYGBcbiAgICogICByZXR1cm4gX3N1cGVyLmFwcGx5KHRoaXMsIHRzbGliLl9fc3ByZWFkQXJyYXkoW10sIHRzbGliLl9fcmVhZChhcmd1bWVudHMpKSkgfHwgdGhpcztcbiAgICogICBgYGBcbiAgICpcbiAgICogQHBhcmFtIHN0YXRlbWVudCBhIHN0YXRlbWVudCB0aGF0IG1heSBiZSBhIHN5bnRoZXNpemVkIHN1cGVyIGNhbGxcbiAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgc3RhdGVtZW50IGxvb2tzIGxpa2UgYSBzeW50aGVzaXplZCBzdXBlciBjYWxsXG4gICAqL1xuICBwcml2YXRlIGlzU3ludGhlc2l6ZWRTdXBlclRoaXNBc3NpZ25tZW50KHN0YXRlbWVudDogdHMuU3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgaWYgKCF0cy5pc1ZhcmlhYmxlU3RhdGVtZW50KHN0YXRlbWVudCkpIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IHZhcmlhYmxlRGVjbGFyYXRpb25zID0gc3RhdGVtZW50LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnM7XG4gICAgaWYgKHZhcmlhYmxlRGVjbGFyYXRpb25zLmxlbmd0aCAhPT0gMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgdmFyaWFibGVEZWNsYXJhdGlvbiA9IHZhcmlhYmxlRGVjbGFyYXRpb25zWzBdO1xuICAgIGlmICghdHMuaXNJZGVudGlmaWVyKHZhcmlhYmxlRGVjbGFyYXRpb24ubmFtZSkgfHxcbiAgICAgICAgIXZhcmlhYmxlRGVjbGFyYXRpb24ubmFtZS50ZXh0LnN0YXJ0c1dpdGgoJ190aGlzJykpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBpbml0aWFsaXplciA9IHZhcmlhYmxlRGVjbGFyYXRpb24uaW5pdGlhbGl6ZXI7XG4gICAgaWYgKCFpbml0aWFsaXplcikgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRoaXMuaXNTeW50aGVzaXplZERlZmF1bHRTdXBlckNhbGwoaW5pdGlhbGl6ZXIpO1xuICB9XG4gIC8qKlxuICAgKiBJZGVudGlmaWVzIHN5bnRoZXNpemVkIHN1cGVyIGNhbGxzIHdoaWNoIHBhc3MtdGhyb3VnaCBmdW5jdGlvbiBhcmd1bWVudHMgZGlyZWN0bHkgYW5kXG4gICAqIGFyZSBiZWluZyByZXR1cm5lZC4gVGhlIGZvbGxvd2luZyBwYXR0ZXJucyBjb3JyZXNwb25kIHRvIHN5bnRoZXRpYyBzdXBlciByZXR1cm4gY2FsbHM6XG4gICAqXG4gICAqIDEuIERlbGVnYXRlIGNhbGwgZW1pdHRlZCBieSBUeXBlU2NyaXB0IHdoZW4gaXQgZW1pdHMgRVM1IGRpcmVjdGx5LlxuICAgKiAgIGBgYFxuICAgKiAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICogICBgYGBcbiAgICpcbiAgICogMi4gRGVsZWdhdGUgY2FsbCBlbWl0dGVkIGJ5IFR5cGVTY3JpcHQgd2hlbiBpdCBkb3dubGV2ZWwncyBFUzIwMTUgdG8gRVM1LlxuICAgKiAgIGBgYFxuICAgKiAgIHJldHVybiBfc3VwZXIuYXBwbHkodGhpcywgdHNsaWIuX19zcHJlYWQoYXJndW1lbnRzKSkgfHwgdGhpcztcbiAgICogICBgYGBcbiAgICogICBvciB1c2luZyB0aGUgc3ludGF4IGVtaXR0ZWQgc2luY2UgVHlwZVNjcmlwdCA0LjI6XG4gICAqICAgYGBgXG4gICAqICAgcmV0dXJuIF9zdXBlci5hcHBseSh0aGlzLCB0c2xpYi5fX3NwcmVhZEFycmF5KFtdLCB0c2xpYi5fX3JlYWQoYXJndW1lbnRzKSkpIHx8IHRoaXM7XG4gICAqICAgYGBgXG4gICAqXG4gICAqIEBwYXJhbSBzdGF0ZW1lbnQgYSBzdGF0ZW1lbnQgdGhhdCBtYXkgYmUgYSBzeW50aGVzaXplZCBzdXBlciBjYWxsXG4gICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHN0YXRlbWVudCBsb29rcyBsaWtlIGEgc3ludGhlc2l6ZWQgc3VwZXIgY2FsbFxuICAgKi9cbiAgcHJpdmF0ZSBpc1N5bnRoZXNpemVkU3VwZXJSZXR1cm5TdGF0ZW1lbnQoc3RhdGVtZW50OiB0cy5TdGF0ZW1lbnQpOiBib29sZWFuIHtcbiAgICBpZiAoIXRzLmlzUmV0dXJuU3RhdGVtZW50KHN0YXRlbWVudCkpIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGV4cHJlc3Npb24gPSBzdGF0ZW1lbnQuZXhwcmVzc2lvbjtcbiAgICBpZiAoIWV4cHJlc3Npb24pIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0aGlzLmlzU3ludGhlc2l6ZWREZWZhdWx0U3VwZXJDYWxsKGV4cHJlc3Npb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIElkZW50aWZpZXMgc3ludGhlc2l6ZWQgc3VwZXIgY2FsbHMgd2hpY2ggcGFzcy10aHJvdWdoIGZ1bmN0aW9uIGFyZ3VtZW50cyBkaXJlY3RseS4gVGhlXG4gICAqIHN5bnRoZXRpYyBkZWxlZ2F0ZSBzdXBlciBjYWxsIG1hdGNoIHRoZSBmb2xsb3dpbmcgcGF0dGVybnMgd2UgaW50ZW5kIHRvIG1hdGNoOlxuICAgKlxuICAgKiAxLiBEZWxlZ2F0ZSBjYWxsIGVtaXR0ZWQgYnkgVHlwZVNjcmlwdCB3aGVuIGl0IGVtaXRzIEVTNSBkaXJlY3RseS5cbiAgICogICBgYGBcbiAgICogICBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICogICBgYGBcbiAgICpcbiAgICogMi4gRGVsZWdhdGUgY2FsbCBlbWl0dGVkIGJ5IFR5cGVTY3JpcHQgd2hlbiBpdCBkb3dubGV2ZWwncyBFUzIwMTUgdG8gRVM1LlxuICAgKiAgIGBgYFxuICAgKiAgIF9zdXBlci5hcHBseSh0aGlzLCB0c2xpYi5fX3NwcmVhZChhcmd1bWVudHMpKSB8fCB0aGlzO1xuICAgKiAgIGBgYFxuICAgKiAgIG9yIHVzaW5nIHRoZSBzeW50YXggZW1pdHRlZCBzaW5jZSBUeXBlU2NyaXB0IDQuMjpcbiAgICogICBgYGBcbiAgICogICByZXR1cm4gX3N1cGVyLmFwcGx5KHRoaXMsIHRzbGliLl9fc3ByZWFkQXJyYXkoW10sIHRzbGliLl9fcmVhZChhcmd1bWVudHMpKSkgfHwgdGhpcztcbiAgICogICBgYGBcbiAgICpcbiAgICogQHBhcmFtIGV4cHJlc3Npb24gYW4gZXhwcmVzc2lvbiB0aGF0IG1heSByZXByZXNlbnQgYSBkZWZhdWx0IHN1cGVyIGNhbGxcbiAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgZXhwcmVzc2lvbiBjb3JyZXNwb25kcyB3aXRoIHRoZSBhYm92ZSBmb3JtXG4gICAqL1xuICBwcml2YXRlIGlzU3ludGhlc2l6ZWREZWZhdWx0U3VwZXJDYWxsKGV4cHJlc3Npb246IHRzLkV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICBpZiAoIWlzQmluYXJ5RXhwcihleHByZXNzaW9uLCB0cy5TeW50YXhLaW5kLkJhckJhclRva2VuKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChleHByZXNzaW9uLnJpZ2h0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuVGhpc0tleXdvcmQpIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGxlZnQgPSBleHByZXNzaW9uLmxlZnQ7XG4gICAgaWYgKGlzQmluYXJ5RXhwcihsZWZ0LCB0cy5TeW50YXhLaW5kLkFtcGVyc2FuZEFtcGVyc2FuZFRva2VuKSkge1xuICAgICAgcmV0dXJuIGlzU3VwZXJOb3ROdWxsKGxlZnQubGVmdCkgJiYgdGhpcy5pc1N1cGVyQXBwbHlDYWxsKGxlZnQucmlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pc1N1cGVyQXBwbHlDYWxsKGxlZnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyB3aGV0aGVyIHRoZSBleHByZXNzaW9uIGNvcnJlc3BvbmRzIHRvIGEgYHN1cGVyYCBjYWxsIHBhc3NpbmcgdGhyb3VnaFxuICAgKiBmdW5jdGlvbiBhcmd1bWVudHMgd2l0aG91dCBhbnkgbW9kaWZpY2F0aW9uLiBlLmcuXG4gICAqXG4gICAqIGBgYFxuICAgKiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICogYGBgXG4gICAqXG4gICAqIFRoaXMgc3RydWN0dXJlIGlzIGdlbmVyYXRlZCBieSBUeXBlU2NyaXB0IHdoZW4gdHJhbnNmb3JtaW5nIEVTMjAxNSB0byBFUzUsIHNlZVxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvYmxvYi92My4yLjIvc3JjL2NvbXBpbGVyL3RyYW5zZm9ybWVycy9lczIwMTUudHMjTDExNDgtTDExNjNcbiAgICpcbiAgICogQWRkaXRpb25hbGx5LCB3ZSBhbHNvIGhhbmRsZSBjYXNlcyB3aGVyZSBgYXJndW1lbnRzYCBhcmUgd3JhcHBlZCBieSBhIFR5cGVTY3JpcHQgc3ByZWFkXG4gICAqIGhlbHBlci5cbiAgICogVGhpcyBjYW4gaGFwcGVuIGlmIEVTMjAxNSBjbGFzcyBvdXRwdXQgY29udGFpbiBhdXRvLWdlbmVyYXRlZCBjb25zdHJ1Y3RvcnMgZHVlIHRvIGNsYXNzXG4gICAqIG1lbWJlcnMuIFRoZSBFUzIwMTUgb3V0cHV0IHdpbGwgYmUgdXNpbmcgYHN1cGVyKC4uLmFyZ3VtZW50cylgIHRvIGRlbGVnYXRlIHRvIHRoZSBzdXBlcmNsYXNzLFxuICAgKiBidXQgb25jZSBkb3dubGV2ZWxlZCB0byBFUzUsIHRoZSBzcHJlYWQgb3BlcmF0b3Igd2lsbCBiZSBwZXJzaXN0ZWQgdGhyb3VnaCBhIFR5cGVTY3JpcHQgc3ByZWFkXG4gICAqIGhlbHBlci4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGBgYFxuICAgKiBfc3VwZXIuYXBwbHkodGhpcywgX19zcHJlYWQoYXJndW1lbnRzKSkgfHwgdGhpcztcbiAgICogYGBgXG4gICAqXG4gICAqIG9yLCBzaW5jZSBUeXBlU2NyaXB0IDQuMiBpdCB3b3VsZCBiZVxuICAgKlxuICAgKiBgYGBcbiAgICogX3N1cGVyLmFwcGx5KHRoaXMsIHRzbGliLl9fc3ByZWFkQXJyYXkoW10sIHRzbGliLl9fcmVhZChhcmd1bWVudHMpKSkgfHwgdGhpcztcbiAgICogYGBgXG4gICAqXG4gICAqIE1vcmUgZGV0YWlscyBjYW4gYmUgZm91bmQgaW46IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzM4NDUzLlxuICAgKlxuICAgKiBAcGFyYW0gZXhwcmVzc2lvbiBhbiBleHByZXNzaW9uIHRoYXQgbWF5IHJlcHJlc2VudCBhIGRlZmF1bHQgc3VwZXIgY2FsbFxuICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBleHByZXNzaW9uIGNvcnJlc3BvbmRzIHdpdGggdGhlIGFib3ZlIGZvcm1cbiAgICovXG4gIHByaXZhdGUgaXNTdXBlckFwcGx5Q2FsbChleHByZXNzaW9uOiB0cy5FeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0cy5pc0NhbGxFeHByZXNzaW9uKGV4cHJlc3Npb24pIHx8IGV4cHJlc3Npb24uYXJndW1lbnRzLmxlbmd0aCAhPT0gMikgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgdGFyZ2V0Rm4gPSBleHByZXNzaW9uLmV4cHJlc3Npb247XG4gICAgaWYgKCF0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbih0YXJnZXRGbikpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIWlzU3VwZXJJZGVudGlmaWVyKHRhcmdldEZuLmV4cHJlc3Npb24pKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHRhcmdldEZuLm5hbWUudGV4dCAhPT0gJ2FwcGx5JykgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgdGhpc0FyZ3VtZW50ID0gZXhwcmVzc2lvbi5hcmd1bWVudHNbMF07XG4gICAgaWYgKHRoaXNBcmd1bWVudC5raW5kICE9PSB0cy5TeW50YXhLaW5kLlRoaXNLZXl3b3JkKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBhcmd1bWVudHNFeHByID0gZXhwcmVzc2lvbi5hcmd1bWVudHNbMV07XG5cbiAgICAvLyBJZiB0aGUgc3VwZXIgaXMgZGlyZWN0bHkgaW52b2tlZCB3aXRoIGBhcmd1bWVudHNgLCByZXR1cm4gYHRydWVgLiBUaGlzIHJlcHJlc2VudHMgdGhlXG4gICAgLy8gY29tbW9uIFR5cGVTY3JpcHQgb3V0cHV0IHdoZXJlIHRoZSBkZWxlZ2F0ZSBjb25zdHJ1Y3RvciBzdXBlciBjYWxsIG1hdGNoZXMgdGhlIGZvbGxvd2luZ1xuICAgIC8vIHBhdHRlcm46IGBzdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpYC5cbiAgICBpZiAoaXNBcmd1bWVudHNJZGVudGlmaWVyKGFyZ3VtZW50c0V4cHIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBUaGUgb3RoZXIgc2NlbmFyaW8gd2UgaW50ZW5kIHRvIGRldGVjdDogVGhlIGBhcmd1bWVudHNgIHZhcmlhYmxlIG1pZ2h0IGJlIHdyYXBwZWQgd2l0aCB0aGVcbiAgICAvLyBUeXBlU2NyaXB0IHNwcmVhZCBoZWxwZXIgKGVpdGhlciB0aHJvdWdoIHRzbGliIG9yIGlubGluZWQpLiBUaGlzIGNhbiBoYXBwZW4gaWYgYW4gZXhwbGljaXRcbiAgICAvLyBkZWxlZ2F0ZSBjb25zdHJ1Y3RvciB1c2VzIGBzdXBlciguLi5hcmd1bWVudHMpYCBpbiBFUzIwMTUgYW5kIGlzIGRvd25sZXZlbGVkIHRvIEVTNSB1c2luZ1xuICAgIC8vIGAtLWRvd25sZXZlbEl0ZXJhdGlvbmAuXG4gICAgcmV0dXJuIHRoaXMuaXNTcHJlYWRBcmd1bWVudHNFeHByZXNzaW9uKGFyZ3VtZW50c0V4cHIpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhlIHByb3ZpZGVkIGV4cHJlc3Npb24gaXMgb25lIG9mIHRoZSBmb2xsb3dpbmcgY2FsbCBleHByZXNzaW9uczpcbiAgICpcbiAgICogMS4gYF9fc3ByZWFkKGFyZ3VtZW50cylgXG4gICAqIDIuIGBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoYXJndW1lbnRzKSlgXG4gICAqXG4gICAqIFRoZSB0c2xpYiBoZWxwZXJzIG1heSBoYXZlIGJlZW4gZW1pdHRlZCBpbmxpbmUgYXMgaW4gdGhlIGFib3ZlIGV4YW1wbGUsIG9yIHRoZXkgbWF5IGJlIHJlYWRcbiAgICogZnJvbSBhIG5hbWVzcGFjZSBpbXBvcnQuXG4gICAqL1xuICBwcml2YXRlIGlzU3ByZWFkQXJndW1lbnRzRXhwcmVzc2lvbihleHByZXNzaW9uOiB0cy5FeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgY29uc3QgY2FsbCA9IHRoaXMuZXh0cmFjdEtub3duSGVscGVyQ2FsbChleHByZXNzaW9uKTtcbiAgICBpZiAoY2FsbCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChjYWxsLmhlbHBlciA9PT0gS25vd25EZWNsYXJhdGlvbi5Uc0hlbHBlclNwcmVhZCkge1xuICAgICAgLy8gYF9fc3ByZWFkKGFyZ3VtZW50cylgXG4gICAgICByZXR1cm4gY2FsbC5hcmdzLmxlbmd0aCA9PT0gMSAmJiBpc0FyZ3VtZW50c0lkZW50aWZpZXIoY2FsbC5hcmdzWzBdKTtcbiAgICB9IGVsc2UgaWYgKGNhbGwuaGVscGVyID09PSBLbm93bkRlY2xhcmF0aW9uLlRzSGVscGVyU3ByZWFkQXJyYXkpIHtcbiAgICAgIC8vIGBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoYXJndW1lbnRzKSlgXG4gICAgICBpZiAoY2FsbC5hcmdzLmxlbmd0aCAhPT0gMikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpcnN0QXJnID0gY2FsbC5hcmdzWzBdO1xuICAgICAgaWYgKCF0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24oZmlyc3RBcmcpIHx8IGZpcnN0QXJnLmVsZW1lbnRzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNlY29uZEFyZyA9IHRoaXMuZXh0cmFjdEtub3duSGVscGVyQ2FsbChjYWxsLmFyZ3NbMV0pO1xuICAgICAgaWYgKHNlY29uZEFyZyA9PT0gbnVsbCB8fCBzZWNvbmRBcmcuaGVscGVyICE9PSBLbm93bkRlY2xhcmF0aW9uLlRzSGVscGVyUmVhZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWNvbmRBcmcuYXJncy5sZW5ndGggPT09IDEgJiYgaXNBcmd1bWVudHNJZGVudGlmaWVyKHNlY29uZEFyZy5hcmdzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNwZWN0cyB0aGUgcHJvdmlkZWQgZXhwcmVzc2lvbiBhbmQgZGV0ZXJtaW5lcyBpZiBpdCBjb3JyZXNwb25kcyB3aXRoIGEga25vd24gaGVscGVyIGZ1bmN0aW9uXG4gICAqIGFzIHJlY2VpdmVyIGV4cHJlc3Npb24uXG4gICAqL1xuICBwcml2YXRlIGV4dHJhY3RLbm93bkhlbHBlckNhbGwoZXhwcmVzc2lvbjogdHMuRXhwcmVzc2lvbik6XG4gICAgICB7aGVscGVyOiBLbm93bkRlY2xhcmF0aW9uLCBhcmdzOiB0cy5Ob2RlQXJyYXk8dHMuRXhwcmVzc2lvbj59fG51bGwge1xuICAgIGlmICghdHMuaXNDYWxsRXhwcmVzc2lvbihleHByZXNzaW9uKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcmVjZWl2ZXJFeHByID0gZXhwcmVzc2lvbi5leHByZXNzaW9uO1xuXG4gICAgLy8gVGhlIGhlbHBlciBjb3VsZCBiZSBnbG9iYWxseSBhdmFpbGFibGUsIG9yIGFjY2Vzc2VkIHRocm91Z2ggYSBuYW1lc3BhY2VkIGltcG9ydC4gSGVuY2Ugd2VcbiAgICAvLyBzdXBwb3J0IGEgcHJvcGVydHkgYWNjZXNzIGhlcmUgYXMgbG9uZyBhcyBpdCByZXNvbHZlcyB0byB0aGUgYWN0dWFsIGtub3duIFR5cGVTY3JpcHQgaGVscGVyLlxuICAgIGxldCByZWNlaXZlcjogRGVjbGFyYXRpb258bnVsbCA9IG51bGw7XG4gICAgaWYgKHRzLmlzSWRlbnRpZmllcihyZWNlaXZlckV4cHIpKSB7XG4gICAgICByZWNlaXZlciA9IHRoaXMuZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXIocmVjZWl2ZXJFeHByKTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKHJlY2VpdmVyRXhwcikgJiYgdHMuaXNJZGVudGlmaWVyKHJlY2VpdmVyRXhwci5uYW1lKSkge1xuICAgICAgcmVjZWl2ZXIgPSB0aGlzLmdldERlY2xhcmF0aW9uT2ZJZGVudGlmaWVyKHJlY2VpdmVyRXhwci5uYW1lKTtcbiAgICB9XG5cbiAgICBpZiAocmVjZWl2ZXIgPT09IG51bGwgfHwgcmVjZWl2ZXIua25vd24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBoZWxwZXI6IHJlY2VpdmVyLmtub3duLFxuICAgICAgYXJnczogZXhwcmVzc2lvbi5hcmd1bWVudHMsXG4gICAgfTtcbiAgfVxufVxuXG4vLy8vLy8vLy8vLy8vIEludGVybmFsIEhlbHBlcnMgLy8vLy8vLy8vLy8vL1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGRldGFpbHMgYWJvdXQgcHJvcGVydHkgZGVmaW5pdGlvbnMgdGhhdCB3ZXJlIHNldCB1c2luZyBgT2JqZWN0LmRlZmluZVByb3BlcnR5YC5cbiAqL1xuaW50ZXJmYWNlIFByb3BlcnR5RGVmaW5pdGlvbiB7XG4gIHNldHRlcjogdHMuRnVuY3Rpb25FeHByZXNzaW9ufG51bGw7XG4gIGdldHRlcjogdHMuRnVuY3Rpb25FeHByZXNzaW9ufG51bGw7XG59XG5cbi8qKlxuICogSW4gRVM1LCBnZXR0ZXJzIGFuZCBzZXR0ZXJzIGhhdmUgYmVlbiBkb3dubGV2ZWxlZCBpbnRvIGNhbGwgZXhwcmVzc2lvbnMgb2ZcbiAqIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgLCBzdWNoIGFzXG4gKlxuICogYGBgXG4gKiBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2xhenoucHJvdG90eXBlLCBcInByb3BlcnR5XCIsIHtcbiAqICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gKiAgICAgICByZXR1cm4gJ3ZhbHVlJztcbiAqICAgfSxcbiAqICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAqICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAqICAgfSxcbiAqICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAqICAgY29uZmlndXJhYmxlOiB0cnVlXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaW5zcGVjdHMgdGhlIGdpdmVuIG5vZGUgdG8gZGV0ZXJtaW5lIGlmIGl0IGNvcnJlc3BvbmRzIHdpdGggc3VjaCBhIGNhbGwsIGFuZCBpZiBzb1xuICogZXh0cmFjdHMgdGhlIGBzZXRgIGFuZCBgZ2V0YCBmdW5jdGlvbiBleHByZXNzaW9ucyBmcm9tIHRoZSBkZXNjcmlwdG9yIG9iamVjdCwgaWYgdGhleSBleGlzdC5cbiAqXG4gKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB0byBvYnRhaW4gdGhlIHByb3BlcnR5IGRlZmluaXRpb24gZnJvbS5cbiAqIEByZXR1cm5zIFRoZSBwcm9wZXJ0eSBkZWZpbml0aW9uIGlmIHRoZSBub2RlIGNvcnJlc3BvbmRzIHdpdGggYWNjZXNzb3IsIG51bGwgb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eURlZmluaXRpb24obm9kZTogdHMuTm9kZSk6IFByb3BlcnR5RGVmaW5pdGlvbnxudWxsIHtcbiAgaWYgKCF0cy5pc0NhbGxFeHByZXNzaW9uKG5vZGUpKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBmbiA9IG5vZGUuZXhwcmVzc2lvbjtcbiAgaWYgKCF0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihmbikgfHwgIXRzLmlzSWRlbnRpZmllcihmbi5leHByZXNzaW9uKSB8fFxuICAgICAgZm4uZXhwcmVzc2lvbi50ZXh0ICE9PSAnT2JqZWN0JyB8fCBmbi5uYW1lLnRleHQgIT09ICdkZWZpbmVQcm9wZXJ0eScpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZGVzY3JpcHRvciA9IG5vZGUuYXJndW1lbnRzWzJdO1xuICBpZiAoIWRlc2NyaXB0b3IgfHwgIXRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24oZGVzY3JpcHRvcikpIHJldHVybiBudWxsO1xuXG4gIHJldHVybiB7XG4gICAgc2V0dGVyOiByZWFkUHJvcGVydHlGdW5jdGlvbkV4cHJlc3Npb24oZGVzY3JpcHRvciwgJ3NldCcpLFxuICAgIGdldHRlcjogcmVhZFByb3BlcnR5RnVuY3Rpb25FeHByZXNzaW9uKGRlc2NyaXB0b3IsICdnZXQnKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVhZFByb3BlcnR5RnVuY3Rpb25FeHByZXNzaW9uKG9iamVjdDogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24sIG5hbWU6IHN0cmluZykge1xuICBjb25zdCBwcm9wZXJ0eSA9IG9iamVjdC5wcm9wZXJ0aWVzLmZpbmQoXG4gICAgICAocCk6IHAgaXMgdHMuUHJvcGVydHlBc3NpZ25tZW50ID0+XG4gICAgICAgICAgdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocCkgJiYgdHMuaXNJZGVudGlmaWVyKHAubmFtZSkgJiYgcC5uYW1lLnRleHQgPT09IG5hbWUpO1xuXG4gIHJldHVybiBwcm9wZXJ0eSAmJiB0cy5pc0Z1bmN0aW9uRXhwcmVzc2lvbihwcm9wZXJ0eS5pbml0aWFsaXplcikgJiYgcHJvcGVydHkuaW5pdGlhbGl6ZXIgfHwgbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UmV0dXJuU3RhdGVtZW50KGRlY2xhcmF0aW9uOiB0cy5FeHByZXNzaW9ufHVuZGVmaW5lZCk6IHRzLlJldHVyblN0YXRlbWVudHx1bmRlZmluZWQge1xuICByZXR1cm4gZGVjbGFyYXRpb24gJiYgdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24oZGVjbGFyYXRpb24pID9cbiAgICAgIGRlY2xhcmF0aW9uLmJvZHkuc3RhdGVtZW50cy5maW5kKHRzLmlzUmV0dXJuU3RhdGVtZW50KSA6XG4gICAgICB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHJlZmxlY3RBcnJheUVsZW1lbnQoZWxlbWVudDogdHMuRXhwcmVzc2lvbikge1xuICByZXR1cm4gdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihlbGVtZW50KSA/IHJlZmxlY3RPYmplY3RMaXRlcmFsKGVsZW1lbnQpIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHNJZGVudGlmaWVyKGV4cHJlc3Npb246IHRzLkV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgcmV0dXJuIHRzLmlzSWRlbnRpZmllcihleHByZXNzaW9uKSAmJiBleHByZXNzaW9uLnRleHQgPT09ICdhcmd1bWVudHMnO1xufVxuXG5mdW5jdGlvbiBpc1N1cGVyTm90TnVsbChleHByZXNzaW9uOiB0cy5FeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0JpbmFyeUV4cHIoZXhwcmVzc2lvbiwgdHMuU3ludGF4S2luZC5FeGNsYW1hdGlvbkVxdWFsc0VxdWFsc1Rva2VuKSAmJlxuICAgICAgaXNTdXBlcklkZW50aWZpZXIoZXhwcmVzc2lvbi5sZWZ0KTtcbn1cblxuZnVuY3Rpb24gaXNCaW5hcnlFeHByKFxuICAgIGV4cHJlc3Npb246IHRzLkV4cHJlc3Npb24sIG9wZXJhdG9yOiB0cy5CaW5hcnlPcGVyYXRvcik6IGV4cHJlc3Npb24gaXMgdHMuQmluYXJ5RXhwcmVzc2lvbiB7XG4gIHJldHVybiB0cy5pc0JpbmFyeUV4cHJlc3Npb24oZXhwcmVzc2lvbikgJiYgZXhwcmVzc2lvbi5vcGVyYXRvclRva2VuLmtpbmQgPT09IG9wZXJhdG9yO1xufVxuXG5mdW5jdGlvbiBpc1N1cGVySWRlbnRpZmllcihub2RlOiB0cy5Ob2RlKTogYm9vbGVhbiB7XG4gIC8vIFZlcmlmeSB0aGF0IHRoZSBpZGVudGlmaWVyIGlzIHByZWZpeGVkIHdpdGggYF9zdXBlcmAuIFdlIGRvbid0IHRlc3QgZm9yIGVxdWl2YWxlbmNlXG4gIC8vIGFzIFR5cGVTY3JpcHQgbWF5IGhhdmUgc3VmZml4ZWQgdGhlIG5hbWUsIGUuZy4gYF9zdXBlcl8xYCB0byBhdm9pZCBuYW1lIGNvbmZsaWN0cy5cbiAgLy8gUmVxdWlyaW5nIG9ubHkgYSBwcmVmaXggc2hvdWxkIGJlIHN1ZmZpY2llbnRseSBhY2N1cmF0ZS5cbiAgcmV0dXJuIHRzLmlzSWRlbnRpZmllcihub2RlKSAmJiBub2RlLnRleHQuc3RhcnRzV2l0aCgnX3N1cGVyJyk7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIHN0YXRlbWVudCB0byBleHRyYWN0IHRoZSBFU001IHBhcmFtZXRlciBpbml0aWFsaXplciBpZiB0aGVyZSBpcyBvbmUuXG4gKiBJZiBvbmUgaXMgZm91bmQsIGFkZCBpdCB0byB0aGUgYXBwcm9wcmlhdGUgcGFyYW1ldGVyIGluIHRoZSBgcGFyYW1ldGVyc2AgY29sbGVjdGlvbi5cbiAqXG4gKiBUaGUgZm9ybSB3ZSBhcmUgbG9va2luZyBmb3IgaXM6XG4gKlxuICogYGBgXG4gKiBpZiAoYXJnID09PSB2b2lkIDApIHsgYXJnID0gaW5pdGlhbGl6ZXI7IH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBzdGF0ZW1lbnQgYSBzdGF0ZW1lbnQgdGhhdCBtYXkgYmUgaW5pdGlhbGl6aW5nIGFuIG9wdGlvbmFsIHBhcmFtZXRlclxuICogQHBhcmFtIHBhcmFtZXRlcnMgdGhlIGNvbGxlY3Rpb24gb2YgcGFyYW1ldGVycyB0aGF0IHdlcmUgZm91bmQgaW4gdGhlIGZ1bmN0aW9uIGRlZmluaXRpb25cbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHN0YXRlbWVudCB3YXMgYSBwYXJhbWV0ZXIgaW5pdGlhbGl6ZXJcbiAqL1xuZnVuY3Rpb24gY2FwdHVyZVBhcmFtSW5pdGlhbGl6ZXIoc3RhdGVtZW50OiB0cy5TdGF0ZW1lbnQsIHBhcmFtZXRlcnM6IFBhcmFtZXRlcltdKSB7XG4gIGlmICh0cy5pc0lmU3RhdGVtZW50KHN0YXRlbWVudCkgJiYgaXNVbmRlZmluZWRDb21wYXJpc29uKHN0YXRlbWVudC5leHByZXNzaW9uKSAmJlxuICAgICAgdHMuaXNCbG9jayhzdGF0ZW1lbnQudGhlblN0YXRlbWVudCkgJiYgc3RhdGVtZW50LnRoZW5TdGF0ZW1lbnQuc3RhdGVtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBjb25zdCBpZlN0YXRlbWVudENvbXBhcmlzb24gPSBzdGF0ZW1lbnQuZXhwcmVzc2lvbjsgICAgICAgICAgIC8vIChhcmcgPT09IHZvaWQgMClcbiAgICBjb25zdCB0aGVuU3RhdGVtZW50ID0gc3RhdGVtZW50LnRoZW5TdGF0ZW1lbnQuc3RhdGVtZW50c1swXTsgIC8vIGFyZyA9IGluaXRpYWxpemVyO1xuICAgIGlmIChpc0Fzc2lnbm1lbnRTdGF0ZW1lbnQodGhlblN0YXRlbWVudCkpIHtcbiAgICAgIGNvbnN0IGNvbXBhcmlzb25OYW1lID0gaWZTdGF0ZW1lbnRDb21wYXJpc29uLmxlZnQudGV4dDtcbiAgICAgIGNvbnN0IGFzc2lnbm1lbnROYW1lID0gdGhlblN0YXRlbWVudC5leHByZXNzaW9uLmxlZnQudGV4dDtcbiAgICAgIGlmIChjb21wYXJpc29uTmFtZSA9PT0gYXNzaWdubWVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgcGFyYW1ldGVyID0gcGFyYW1ldGVycy5maW5kKHAgPT4gcC5uYW1lID09PSBjb21wYXJpc29uTmFtZSk7XG4gICAgICAgIGlmIChwYXJhbWV0ZXIpIHtcbiAgICAgICAgICBwYXJhbWV0ZXIuaW5pdGlhbGl6ZXIgPSB0aGVuU3RhdGVtZW50LmV4cHJlc3Npb24ucmlnaHQ7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZENvbXBhcmlzb24oZXhwcmVzc2lvbjogdHMuRXhwcmVzc2lvbik6IGV4cHJlc3Npb24gaXMgdHMuRXhwcmVzc2lvbiZcbiAgICB7bGVmdDogdHMuSWRlbnRpZmllciwgcmlnaHQ6IHRzLkV4cHJlc3Npb259IHtcbiAgcmV0dXJuIHRzLmlzQmluYXJ5RXhwcmVzc2lvbihleHByZXNzaW9uKSAmJlxuICAgICAgZXhwcmVzc2lvbi5vcGVyYXRvclRva2VuLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRXF1YWxzRXF1YWxzRXF1YWxzVG9rZW4gJiZcbiAgICAgIHRzLmlzVm9pZEV4cHJlc3Npb24oZXhwcmVzc2lvbi5yaWdodCkgJiYgdHMuaXNJZGVudGlmaWVyKGV4cHJlc3Npb24ubGVmdCk7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGRlY2xhcmF0aW9uIG9mIHRoZSBnaXZlbiBgY2xhc3NTeW1ib2xgIHRvIGZpbmQgdGhlIElJRkUgd3JhcHBlciBmdW5jdGlvbi5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIG1heSBhY2NlcHQgYSBgX3N1cGVyYCBhcmd1bWVudCBpZiB0aGVyZSBpcyBhIGJhc2UgY2xhc3MuXG4gKlxuICogYGBgXG4gKiB2YXIgVGVzdENsYXNzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAqICAgX19leHRlbmRzKFRlc3RDbGFzcywgX3N1cGVyKTtcbiAqICAgZnVuY3Rpb24gVGVzdENsYXNzKCkge31cbiAqICAgcmV0dXJuIFRlc3RDbGFzcztcbiAqIH0oQmFzZUNsYXNzKSk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gY2xhc3NTeW1ib2wgdGhlIGNsYXNzIHdob3NlIGlpZmUgd3JhcHBlciBmdW5jdGlvbiB3ZSB3YW50IHRvIGdldC5cbiAqIEByZXR1cm5zIHRoZSBJSUZFIGZ1bmN0aW9uIG9yIG51bGwgaWYgaXQgY291bGQgbm90IGJlIHBhcnNlZC5cbiAqL1xuZnVuY3Rpb24gZ2V0SWlmZUZuKGNsYXNzU3ltYm9sOiBOZ2NjQ2xhc3NTeW1ib2x8dW5kZWZpbmVkKTogdHMuRnVuY3Rpb25FeHByZXNzaW9ufG51bGwge1xuICBpZiAoY2xhc3NTeW1ib2wgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgaW5uZXJEZWNsYXJhdGlvbiA9IGNsYXNzU3ltYm9sLmltcGxlbWVudGF0aW9uLnZhbHVlRGVjbGFyYXRpb247XG4gIGNvbnN0IGlpZmVCb2R5ID0gaW5uZXJEZWNsYXJhdGlvbi5wYXJlbnQ7XG4gIGlmICghdHMuaXNCbG9jayhpaWZlQm9keSkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGlpZmVXcmFwcGVyID0gaWlmZUJvZHkucGFyZW50O1xuICByZXR1cm4gaWlmZVdyYXBwZXIgJiYgdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24oaWlmZVdyYXBwZXIpID8gaWlmZVdyYXBwZXIgOiBudWxsO1xufVxuIl19