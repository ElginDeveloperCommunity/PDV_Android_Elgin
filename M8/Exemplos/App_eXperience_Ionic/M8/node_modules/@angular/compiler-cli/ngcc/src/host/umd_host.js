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
        define("@angular/compiler-cli/ngcc/src/host/umd_host", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/ngcc/src/utils", "@angular/compiler-cli/ngcc/src/host/commonjs_umd_utils", "@angular/compiler-cli/ngcc/src/host/esm2015_host", "@angular/compiler-cli/ngcc/src/host/esm5_host", "@angular/compiler-cli/ngcc/src/host/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getImportsOfUmdModule = exports.parseStatementForUmdModule = exports.UmdReflectionHost = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    var commonjs_umd_utils_1 = require("@angular/compiler-cli/ngcc/src/host/commonjs_umd_utils");
    var esm2015_host_1 = require("@angular/compiler-cli/ngcc/src/host/esm2015_host");
    var esm5_host_1 = require("@angular/compiler-cli/ngcc/src/host/esm5_host");
    var utils_2 = require("@angular/compiler-cli/ngcc/src/host/utils");
    var UmdReflectionHost = /** @class */ (function (_super) {
        tslib_1.__extends(UmdReflectionHost, _super);
        function UmdReflectionHost(logger, isCore, src, dts) {
            if (dts === void 0) { dts = null; }
            var _this = _super.call(this, logger, isCore, src, dts) || this;
            _this.umdModules = new utils_1.FactoryMap(function (sf) { return _this.computeUmdModule(sf); });
            _this.umdExports = new utils_1.FactoryMap(function (sf) { return _this.computeExportsOfUmdModule(sf); });
            _this.umdImportPaths = new utils_1.FactoryMap(function (param) { return _this.computeImportPath(param); });
            _this.program = src.program;
            _this.compilerHost = src.host;
            return _this;
        }
        UmdReflectionHost.prototype.getImportOfIdentifier = function (id) {
            // Is `id` a namespaced property access, e.g. `Directive` in `core.Directive`?
            // If so capture the symbol of the namespace, e.g. `core`.
            var nsIdentifier = commonjs_umd_utils_1.findNamespaceOfIdentifier(id);
            var importParameter = nsIdentifier && this.findUmdImportParameter(nsIdentifier);
            var from = importParameter && this.getUmdImportPath(importParameter);
            return from !== null ? { from: from, name: id.text } : null;
        };
        UmdReflectionHost.prototype.getDeclarationOfIdentifier = function (id) {
            // First we try one of the following:
            // 1. The `exports` identifier - referring to the current file/module.
            // 2. An identifier (e.g. `foo`) that refers to an imported UMD module.
            // 3. A UMD style export identifier (e.g. the `foo` of `exports.foo`).
            var declaration = this.getExportsDeclaration(id) || this.getUmdModuleDeclaration(id) ||
                this.getUmdDeclaration(id);
            if (declaration !== null) {
                return declaration;
            }
            // Try to get the declaration using the super class.
            var superDeclaration = _super.prototype.getDeclarationOfIdentifier.call(this, id);
            if (superDeclaration === null) {
                return null;
            }
            // Check to see if the declaration is the inner node of a declaration IIFE.
            var outerNode = esm2015_host_1.getOuterNodeFromInnerDeclaration(superDeclaration.node);
            if (outerNode === null) {
                return superDeclaration;
            }
            // We are only interested if the outer declaration is of the form
            // `exports.<name> = <initializer>`.
            if (!commonjs_umd_utils_1.isExportsAssignment(outerNode)) {
                return superDeclaration;
            }
            return {
                kind: 1 /* Inline */,
                node: outerNode.left,
                implementation: outerNode.right,
                known: null,
                viaModule: null,
            };
        };
        UmdReflectionHost.prototype.getExportsOfModule = function (module) {
            return _super.prototype.getExportsOfModule.call(this, module) || this.umdExports.get(module.getSourceFile());
        };
        UmdReflectionHost.prototype.getUmdModule = function (sourceFile) {
            if (sourceFile.isDeclarationFile) {
                return null;
            }
            return this.umdModules.get(sourceFile);
        };
        UmdReflectionHost.prototype.getUmdImportPath = function (importParameter) {
            return this.umdImportPaths.get(importParameter);
        };
        /**
         * Get the top level statements for a module.
         *
         * In UMD modules these are the body of the UMD factory function.
         *
         * @param sourceFile The module whose statements we want.
         * @returns An array of top level statements for the given module.
         */
        UmdReflectionHost.prototype.getModuleStatements = function (sourceFile) {
            var umdModule = this.getUmdModule(sourceFile);
            return umdModule !== null ? Array.from(umdModule.factoryFn.body.statements) : [];
        };
        UmdReflectionHost.prototype.getClassSymbolFromOuterDeclaration = function (declaration) {
            var superSymbol = _super.prototype.getClassSymbolFromOuterDeclaration.call(this, declaration);
            if (superSymbol) {
                return superSymbol;
            }
            if (!commonjs_umd_utils_1.isExportsDeclaration(declaration)) {
                return undefined;
            }
            var initializer = commonjs_umd_utils_1.skipAliases(declaration.parent.right);
            if (ts.isIdentifier(initializer)) {
                var implementation = this.getDeclarationOfIdentifier(initializer);
                if (implementation !== null) {
                    var implementationSymbol = this.getClassSymbol(implementation.node);
                    if (implementationSymbol !== null) {
                        return implementationSymbol;
                    }
                }
            }
            var innerDeclaration = esm2015_host_1.getInnerClassDeclaration(initializer);
            if (innerDeclaration !== null) {
                return this.createClassSymbol(declaration.name, innerDeclaration);
            }
            return undefined;
        };
        UmdReflectionHost.prototype.getClassSymbolFromInnerDeclaration = function (declaration) {
            var superClassSymbol = _super.prototype.getClassSymbolFromInnerDeclaration.call(this, declaration);
            if (superClassSymbol !== undefined) {
                return superClassSymbol;
            }
            if (!reflection_1.isNamedFunctionDeclaration(declaration)) {
                return undefined;
            }
            var outerNode = esm2015_host_1.getOuterNodeFromInnerDeclaration(declaration);
            if (outerNode === null || !commonjs_umd_utils_1.isExportsAssignment(outerNode)) {
                return undefined;
            }
            return this.createClassSymbol(outerNode.left.name, declaration);
        };
        /**
         * Extract all "classes" from the `statement` and add them to the `classes` map.
         */
        UmdReflectionHost.prototype.addClassSymbolsFromStatement = function (classes, statement) {
            _super.prototype.addClassSymbolsFromStatement.call(this, classes, statement);
            // Also check for exports of the form: `exports.<name> = <class def>;`
            if (commonjs_umd_utils_1.isExportsStatement(statement)) {
                var classSymbol = this.getClassSymbol(statement.expression.left);
                if (classSymbol) {
                    classes.set(classSymbol.implementation, classSymbol);
                }
            }
        };
        /**
         * Analyze the given statement to see if it corresponds with an exports declaration like
         * `exports.MyClass = MyClass_1 = <class def>;`. If so, the declaration of `MyClass_1`
         * is associated with the `MyClass` identifier.
         *
         * @param statement The statement that needs to be preprocessed.
         */
        UmdReflectionHost.prototype.preprocessStatement = function (statement) {
            _super.prototype.preprocessStatement.call(this, statement);
            if (!commonjs_umd_utils_1.isExportsStatement(statement)) {
                return;
            }
            var declaration = statement.expression.left;
            var initializer = statement.expression.right;
            if (!esm2015_host_1.isAssignment(initializer) || !ts.isIdentifier(initializer.left) ||
                !this.isClass(declaration)) {
                return;
            }
            var aliasedIdentifier = initializer.left;
            var aliasedDeclaration = this.getDeclarationOfIdentifier(aliasedIdentifier);
            if (aliasedDeclaration === null || aliasedDeclaration.node === null) {
                throw new Error("Unable to locate declaration of " + aliasedIdentifier.text + " in \"" + statement.getText() + "\"");
            }
            this.aliasedClassDeclarations.set(aliasedDeclaration.node, declaration.name);
        };
        UmdReflectionHost.prototype.computeUmdModule = function (sourceFile) {
            if (sourceFile.statements.length !== 1) {
                throw new Error("Expected UMD module file (" + sourceFile.fileName + ") to contain exactly one statement, " +
                    ("but found " + sourceFile.statements.length + "."));
            }
            return parseStatementForUmdModule(sourceFile.statements[0]);
        };
        UmdReflectionHost.prototype.computeExportsOfUmdModule = function (sourceFile) {
            var e_1, _a, e_2, _b;
            var moduleMap = new Map();
            try {
                for (var _c = tslib_1.__values(this.getModuleStatements(sourceFile)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var statement = _d.value;
                    if (commonjs_umd_utils_1.isExportsStatement(statement)) {
                        var exportDeclaration = this.extractBasicUmdExportDeclaration(statement);
                        if (!moduleMap.has(exportDeclaration.name)) {
                            // We assume that the first `exports.<name>` is the actual declaration, and that any
                            // subsequent statements that match are decorating the original declaration.
                            // For example:
                            // ```
                            // exports.foo = <declaration>;
                            // exports.foo = __decorate(<decorator>, exports.foo);
                            // ```
                            // The declaration is the first line not the second.
                            moduleMap.set(exportDeclaration.name, exportDeclaration.declaration);
                        }
                    }
                    else if (commonjs_umd_utils_1.isWildcardReexportStatement(statement)) {
                        var reexports = this.extractUmdWildcardReexports(statement, sourceFile);
                        try {
                            for (var reexports_1 = (e_2 = void 0, tslib_1.__values(reexports)), reexports_1_1 = reexports_1.next(); !reexports_1_1.done; reexports_1_1 = reexports_1.next()) {
                                var reexport = reexports_1_1.value;
                                moduleMap.set(reexport.name, reexport.declaration);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (reexports_1_1 && !reexports_1_1.done && (_b = reexports_1.return)) _b.call(reexports_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                    else if (commonjs_umd_utils_1.isDefinePropertyReexportStatement(statement)) {
                        var exportDeclaration = this.extractUmdDefinePropertyExportDeclaration(statement);
                        if (exportDeclaration !== null) {
                            moduleMap.set(exportDeclaration.name, exportDeclaration.declaration);
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return moduleMap;
        };
        UmdReflectionHost.prototype.computeImportPath = function (param) {
            var e_3, _a;
            var umdModule = this.getUmdModule(param.getSourceFile());
            if (umdModule === null) {
                return null;
            }
            var imports = getImportsOfUmdModule(umdModule);
            if (imports === null) {
                return null;
            }
            var importPath = null;
            try {
                for (var imports_1 = tslib_1.__values(imports), imports_1_1 = imports_1.next(); !imports_1_1.done; imports_1_1 = imports_1.next()) {
                    var i = imports_1_1.value;
                    // Add all imports to the map to speed up future look ups.
                    this.umdImportPaths.set(i.parameter, i.path);
                    if (i.parameter === param) {
                        importPath = i.path;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (imports_1_1 && !imports_1_1.done && (_a = imports_1.return)) _a.call(imports_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return importPath;
        };
        UmdReflectionHost.prototype.extractBasicUmdExportDeclaration = function (statement) {
            var _a;
            var name = statement.expression.left.name.text;
            var exportExpression = commonjs_umd_utils_1.skipAliases(statement.expression.right);
            var declaration = (_a = this.getDeclarationOfExpression(exportExpression)) !== null && _a !== void 0 ? _a : {
                kind: 1 /* Inline */,
                node: statement.expression.left,
                implementation: statement.expression.right,
                known: null,
                viaModule: null,
            };
            return { name: name, declaration: declaration };
        };
        UmdReflectionHost.prototype.extractUmdWildcardReexports = function (statement, containingFile) {
            var reexportArg = statement.expression.arguments[0];
            var requireCall = commonjs_umd_utils_1.isRequireCall(reexportArg) ?
                reexportArg :
                ts.isIdentifier(reexportArg) ? commonjs_umd_utils_1.findRequireCallReference(reexportArg, this.checker) : null;
            var importPath = null;
            if (requireCall !== null) {
                importPath = requireCall.arguments[0].text;
            }
            else if (ts.isIdentifier(reexportArg)) {
                var importParameter = this.findUmdImportParameter(reexportArg);
                importPath = importParameter && this.getUmdImportPath(importParameter);
            }
            if (importPath === null) {
                return [];
            }
            var importedFile = this.resolveModuleName(importPath, containingFile);
            if (importedFile === undefined) {
                return [];
            }
            var importedExports = this.getExportsOfModule(importedFile);
            if (importedExports === null) {
                return [];
            }
            var viaModule = utils_1.stripExtension(importedFile.fileName);
            var reexports = [];
            importedExports.forEach(function (decl, name) { return reexports.push({ name: name, declaration: tslib_1.__assign(tslib_1.__assign({}, decl), { viaModule: viaModule }) }); });
            return reexports;
        };
        UmdReflectionHost.prototype.extractUmdDefinePropertyExportDeclaration = function (statement) {
            var args = statement.expression.arguments;
            var name = args[1].text;
            var getterFnExpression = commonjs_umd_utils_1.extractGetterFnExpression(statement);
            if (getterFnExpression === null) {
                return null;
            }
            var declaration = this.getDeclarationOfExpression(getterFnExpression);
            if (declaration !== null) {
                return { name: name, declaration: declaration };
            }
            return {
                name: name,
                declaration: {
                    kind: 1 /* Inline */,
                    node: args[1],
                    implementation: getterFnExpression,
                    known: null,
                    viaModule: null,
                },
            };
        };
        /**
         * Is the identifier a parameter on a UMD factory function, e.g. `function factory(this, core)`?
         * If so then return its declaration.
         */
        UmdReflectionHost.prototype.findUmdImportParameter = function (id) {
            var symbol = id && this.checker.getSymbolAtLocation(id) || null;
            var declaration = symbol && symbol.valueDeclaration;
            return declaration && ts.isParameter(declaration) ? declaration : null;
        };
        UmdReflectionHost.prototype.getUmdDeclaration = function (id) {
            var nsIdentifier = commonjs_umd_utils_1.findNamespaceOfIdentifier(id);
            if (nsIdentifier === null) {
                return null;
            }
            if (nsIdentifier.parent.parent && commonjs_umd_utils_1.isExportsAssignment(nsIdentifier.parent.parent)) {
                var initializer = nsIdentifier.parent.parent.right;
                if (ts.isIdentifier(initializer)) {
                    return this.getDeclarationOfIdentifier(initializer);
                }
                return this.detectKnownDeclaration({
                    kind: 1 /* Inline */,
                    node: nsIdentifier.parent.parent.left,
                    implementation: commonjs_umd_utils_1.skipAliases(nsIdentifier.parent.parent.right),
                    viaModule: null,
                    known: null,
                });
            }
            var moduleDeclaration = this.getUmdModuleDeclaration(nsIdentifier);
            if (moduleDeclaration === null || moduleDeclaration.node === null ||
                !ts.isSourceFile(moduleDeclaration.node)) {
                return null;
            }
            var moduleExports = this.getExportsOfModule(moduleDeclaration.node);
            if (moduleExports === null) {
                return null;
            }
            // We need to compute the `viaModule` because  the `getExportsOfModule()` call
            // did not know that we were importing the declaration.
            var declaration = moduleExports.get(id.text);
            if (!moduleExports.has(id.text)) {
                return null;
            }
            // We need to compute the `viaModule` because  the `getExportsOfModule()` call
            // did not know that we were importing the declaration.
            var viaModule = declaration.viaModule === null ? moduleDeclaration.viaModule : declaration.viaModule;
            return tslib_1.__assign(tslib_1.__assign({}, declaration), { viaModule: viaModule, known: utils_1.getTsHelperFnFromIdentifier(id) });
        };
        UmdReflectionHost.prototype.getExportsDeclaration = function (id) {
            if (!isExportsIdentifier(id)) {
                return null;
            }
            // Sadly, in the case of `exports.foo = bar`, we can't use `this.findUmdImportParameter(id)`
            // to check whether this `exports` is from the IIFE body arguments, because
            // `this.checker.getSymbolAtLocation(id)` will return the symbol for the `foo` identifier
            // rather than the `exports` identifier.
            //
            // Instead we search the symbols in the current local scope.
            var exportsSymbol = this.checker.getSymbolsInScope(id, ts.SymbolFlags.Variable)
                .find(function (symbol) { return symbol.name === 'exports'; });
            var node = (exportsSymbol === null || exportsSymbol === void 0 ? void 0 : exportsSymbol.valueDeclaration) !== undefined &&
                !ts.isFunctionExpression(exportsSymbol.valueDeclaration.parent) ?
                // There is a locally defined `exports` variable that is not a function parameter.
                // So this `exports` identifier must be a local variable and does not represent the module.
                exportsSymbol.valueDeclaration :
                // There is no local symbol or it is a parameter of an IIFE.
                // So this `exports` represents the current "module".
                id.getSourceFile();
            return {
                kind: 0 /* Concrete */,
                node: node,
                viaModule: null,
                known: null,
                identity: null,
            };
        };
        UmdReflectionHost.prototype.getUmdModuleDeclaration = function (id) {
            var importPath = this.getImportPathFromParameter(id) || this.getImportPathFromRequireCall(id);
            if (importPath === null) {
                return null;
            }
            var module = this.resolveModuleName(importPath, id.getSourceFile());
            if (module === undefined) {
                return null;
            }
            var viaModule = commonjs_umd_utils_1.isExternalImport(importPath) ? importPath : null;
            return { kind: 0 /* Concrete */, node: module, viaModule: viaModule, known: null, identity: null };
        };
        UmdReflectionHost.prototype.getImportPathFromParameter = function (id) {
            var importParameter = this.findUmdImportParameter(id);
            if (importParameter === null) {
                return null;
            }
            return this.getUmdImportPath(importParameter);
        };
        UmdReflectionHost.prototype.getImportPathFromRequireCall = function (id) {
            var requireCall = commonjs_umd_utils_1.findRequireCallReference(id, this.checker);
            if (requireCall === null) {
                return null;
            }
            return requireCall.arguments[0].text;
        };
        /**
         * If this is an IIFE then try to grab the outer and inner classes otherwise fallback on the super
         * class.
         */
        UmdReflectionHost.prototype.getDeclarationOfExpression = function (expression) {
            var inner = esm2015_host_1.getInnerClassDeclaration(expression);
            if (inner !== null) {
                var outer = esm2015_host_1.getOuterNodeFromInnerDeclaration(inner);
                if (outer !== null && commonjs_umd_utils_1.isExportsAssignment(outer)) {
                    return {
                        kind: 1 /* Inline */,
                        node: outer.left,
                        implementation: inner,
                        known: null,
                        viaModule: null,
                    };
                }
            }
            return _super.prototype.getDeclarationOfExpression.call(this, expression);
        };
        UmdReflectionHost.prototype.resolveModuleName = function (moduleName, containingFile) {
            if (this.compilerHost.resolveModuleNames) {
                var moduleInfo = this.compilerHost.resolveModuleNames([moduleName], containingFile.fileName, undefined, undefined, this.program.getCompilerOptions())[0];
                return moduleInfo && this.program.getSourceFile(file_system_1.absoluteFrom(moduleInfo.resolvedFileName));
            }
            else {
                var moduleInfo = ts.resolveModuleName(moduleName, containingFile.fileName, this.program.getCompilerOptions(), this.compilerHost);
                return moduleInfo.resolvedModule &&
                    this.program.getSourceFile(file_system_1.absoluteFrom(moduleInfo.resolvedModule.resolvedFileName));
            }
        };
        return UmdReflectionHost;
    }(esm5_host_1.Esm5ReflectionHost));
    exports.UmdReflectionHost = UmdReflectionHost;
    function parseStatementForUmdModule(statement) {
        var wrapperCall = getUmdWrapperCall(statement);
        if (!wrapperCall)
            return null;
        var wrapperFn = wrapperCall.expression;
        if (!ts.isFunctionExpression(wrapperFn))
            return null;
        var factoryFnParamIndex = wrapperFn.parameters.findIndex(function (parameter) { return ts.isIdentifier(parameter.name) && parameter.name.text === 'factory'; });
        if (factoryFnParamIndex === -1)
            return null;
        var factoryFn = utils_2.stripParentheses(wrapperCall.arguments[factoryFnParamIndex]);
        if (!factoryFn || !ts.isFunctionExpression(factoryFn))
            return null;
        return { wrapperFn: wrapperFn, factoryFn: factoryFn };
    }
    exports.parseStatementForUmdModule = parseStatementForUmdModule;
    function getUmdWrapperCall(statement) {
        if (!ts.isExpressionStatement(statement) || !ts.isParenthesizedExpression(statement.expression) ||
            !ts.isCallExpression(statement.expression.expression) ||
            !ts.isFunctionExpression(statement.expression.expression.expression)) {
            return null;
        }
        return statement.expression.expression;
    }
    function getImportsOfUmdModule(umdModule) {
        var imports = [];
        for (var i = 1; i < umdModule.factoryFn.parameters.length; i++) {
            imports.push({
                parameter: umdModule.factoryFn.parameters[i],
                path: getRequiredModulePath(umdModule.wrapperFn, i)
            });
        }
        return imports;
    }
    exports.getImportsOfUmdModule = getImportsOfUmdModule;
    function getRequiredModulePath(wrapperFn, paramIndex) {
        var statement = wrapperFn.body.statements[0];
        if (!ts.isExpressionStatement(statement)) {
            throw new Error('UMD wrapper body is not an expression statement:\n' + wrapperFn.body.getText());
        }
        var modulePaths = [];
        findModulePaths(statement.expression);
        // Since we were only interested in the `require()` calls, we miss the `exports` argument, so we
        // need to subtract 1.
        // E.g. `function(exports, dep1, dep2)` maps to `function(exports, require('path/to/dep1'),
        // require('path/to/dep2'))`
        return modulePaths[paramIndex - 1];
        // Search the statement for calls to `require('...')` and extract the string value of the first
        // argument
        function findModulePaths(node) {
            if (commonjs_umd_utils_1.isRequireCall(node)) {
                var argument = node.arguments[0];
                if (ts.isStringLiteral(argument)) {
                    modulePaths.push(argument.text);
                }
            }
            else {
                node.forEachChild(findModulePaths);
            }
        }
    }
    /**
     * Is the `node` an identifier with the name "exports"?
     */
    function isExportsIdentifier(node) {
        return ts.isIdentifier(node) && node.text === 'exports';
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW1kX2hvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvaG9zdC91bWRfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBRWpDLDJFQUE0RDtJQUU1RCx5RUFBK0c7SUFFL0csOERBQWlGO0lBRWpGLDZGQUFrWTtJQUNsWSxpRkFBd0c7SUFDeEcsMkVBQStDO0lBRS9DLG1FQUF5QztJQUV6QztRQUF1Qyw2Q0FBa0I7UUFVdkQsMkJBQVksTUFBYyxFQUFFLE1BQWUsRUFBRSxHQUFrQixFQUFFLEdBQThCO1lBQTlCLG9CQUFBLEVBQUEsVUFBOEI7WUFBL0YsWUFDRSxrQkFBTSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsU0FHaEM7WUFiUyxnQkFBVSxHQUNoQixJQUFJLGtCQUFVLENBQWdDLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxFQUF6QixDQUF5QixDQUFDLENBQUM7WUFDekUsZ0JBQVUsR0FBRyxJQUFJLGtCQUFVLENBQ2pDLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBSSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsQ0FBQyxFQUFsQyxDQUFrQyxDQUFDLENBQUM7WUFDcEMsb0JBQWMsR0FDcEIsSUFBSSxrQkFBVSxDQUF1QyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBN0IsQ0FBNkIsQ0FBQyxDQUFDO1lBTS9GLEtBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUMzQixLQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7O1FBQy9CLENBQUM7UUFFUSxpREFBcUIsR0FBOUIsVUFBK0IsRUFB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Q0FBQyxVQUFVLENBQUMsQ0FBQztRQUV0QyxnR0FBZ0c7UUFDaEcsc0JBQXNCO1FBQ3RCLDJGQUEyRjtRQUMzRiw0QkFBNEI7UUFDNUIsT0FBTyxXQUFXLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRW5DLCtGQUErRjtRQUMvRixXQUFXO1FBQ1gsU0FBUyxlQUFlLENBQUMsSUFBYTtZQUNwQyxJQUFJLGtDQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZCLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDaEMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2pDO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUNwQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLG1CQUFtQixDQUFDLElBQWE7UUFDeEMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDO0lBQzFELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7YWJzb2x1dGVGcm9tfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9sb2dnaW5nJztcbmltcG9ydCB7RGVjbGFyYXRpb24sIERlY2xhcmF0aW9uS2luZCwgSW1wb3J0LCBpc05hbWVkRnVuY3Rpb25EZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtCdW5kbGVQcm9ncmFtfSBmcm9tICcuLi9wYWNrYWdlcy9idW5kbGVfcHJvZ3JhbSc7XG5pbXBvcnQge0ZhY3RvcnlNYXAsIGdldFRzSGVscGVyRm5Gcm9tSWRlbnRpZmllciwgc3RyaXBFeHRlbnNpb259IGZyb20gJy4uL3V0aWxzJztcblxuaW1wb3J0IHtEZWZpbmVQcm9wZXJ0eVJlZXhwb3J0U3RhdGVtZW50LCBFeHBvcnREZWNsYXJhdGlvbiwgRXhwb3J0c1N0YXRlbWVudCwgZXh0cmFjdEdldHRlckZuRXhwcmVzc2lvbiwgZmluZE5hbWVzcGFjZU9mSWRlbnRpZmllciwgZmluZFJlcXVpcmVDYWxsUmVmZXJlbmNlLCBpc0RlZmluZVByb3BlcnR5UmVleHBvcnRTdGF0ZW1lbnQsIGlzRXhwb3J0c0Fzc2lnbm1lbnQsIGlzRXhwb3J0c0RlY2xhcmF0aW9uLCBpc0V4cG9ydHNTdGF0ZW1lbnQsIGlzRXh0ZXJuYWxJbXBvcnQsIGlzUmVxdWlyZUNhbGwsIGlzV2lsZGNhcmRSZWV4cG9ydFN0YXRlbWVudCwgc2tpcEFsaWFzZXMsIFdpbGRjYXJkUmVleHBvcnRTdGF0ZW1lbnR9IGZyb20gJy4vY29tbW9uanNfdW1kX3V0aWxzJztcbmltcG9ydCB7Z2V0SW5uZXJDbGFzc0RlY2xhcmF0aW9uLCBnZXRPdXRlck5vZGVGcm9tSW5uZXJEZWNsYXJhdGlvbiwgaXNBc3NpZ25tZW50fSBmcm9tICcuL2VzbTIwMTVfaG9zdCc7XG5pbXBvcnQge0VzbTVSZWZsZWN0aW9uSG9zdH0gZnJvbSAnLi9lc201X2hvc3QnO1xuaW1wb3J0IHtOZ2NjQ2xhc3NTeW1ib2x9IGZyb20gJy4vbmdjY19ob3N0JztcbmltcG9ydCB7c3RyaXBQYXJlbnRoZXNlc30gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBjbGFzcyBVbWRSZWZsZWN0aW9uSG9zdCBleHRlbmRzIEVzbTVSZWZsZWN0aW9uSG9zdCB7XG4gIHByb3RlY3RlZCB1bWRNb2R1bGVzID1cbiAgICAgIG5ldyBGYWN0b3J5TWFwPHRzLlNvdXJjZUZpbGUsIFVtZE1vZHVsZXxudWxsPihzZiA9PiB0aGlzLmNvbXB1dGVVbWRNb2R1bGUoc2YpKTtcbiAgcHJvdGVjdGVkIHVtZEV4cG9ydHMgPSBuZXcgRmFjdG9yeU1hcDx0cy5Tb3VyY2VGaWxlLCBNYXA8c3RyaW5nLCBEZWNsYXJhdGlvbj58bnVsbD4oXG4gICAgICBzZiA9PiB0aGlzLmNvbXB1dGVFeHBvcnRzT2ZVbWRNb2R1bGUoc2YpKTtcbiAgcHJvdGVjdGVkIHVtZEltcG9ydFBhdGhzID1cbiAgICAgIG5ldyBGYWN0b3J5TWFwPHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uLCBzdHJpbmd8bnVsbD4ocGFyYW0gPT4gdGhpcy5jb21wdXRlSW1wb3J0UGF0aChwYXJhbSkpO1xuICBwcm90ZWN0ZWQgcHJvZ3JhbTogdHMuUHJvZ3JhbTtcbiAgcHJvdGVjdGVkIGNvbXBpbGVySG9zdDogdHMuQ29tcGlsZXJIb3N0O1xuXG4gIGNvbnN0cnVjdG9yKGxvZ2dlcjogTG9nZ2VyLCBpc0NvcmU6IGJvb2xlYW4sIHNyYzogQnVuZGxlUHJvZ3JhbSwgZHRzOiBCdW5kbGVQcm9ncmFtfG51bGwgPSBudWxsKSB7XG4gICAgc3VwZXIobG9nZ2VyLCBpc0NvcmUsIHNyYywgZHRzKTtcbiAgICB0aGlzLnByb2dyYW0gPSBzcmMucHJvZ3JhbTtcbiAgICB0aGlzLmNvbXBpbGVySG9zdCA9IHNyYy5ob3N0O1xuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKGlkOiB0cy5JZGVudGlmaWVyKTogSW1wb3J0fG51bGwge1xuICAgIC8vIElzIGBpZGAgYSBuYW1lc3BhY2VkIHByb3BlcnR5IGFjY2VzcywgZS5nLiBgRGlyZWN0aXZlYCBpbiBgY29yZS5EaXJlY3RpdmVgP1xuICAgIC8vIElmIHNvIGNhcHR1cmUgdGhlIHN5bWJvbCBvZiB0aGUgbmFtZXNwYWNlLCBlLmcuIGBjb3JlYC5cbiAgICBjb25zdCBuc0lkZW50aWZpZXIgPSBmaW5kTmFtZXNwYWNlT2ZJZGVudGlmaWVyKGlkKTtcbiAgICBjb25zdCBpbXBvcnRQYXJhbWV0ZXIgPSBuc0lkZW50aWZpZXIgJiYgdGhpcy5maW5kVW1kSW1wb3J0UGFyYW1ldGVyKG5zSWRlbnRpZmllcik7XG4gICAgY29uc3QgZnJvbSA9IGltcG9ydFBhcmFtZXRlciAmJiB0aGlzLmdldFVtZEltcG9ydFBhdGgoaW1wb3J0UGFyYW1ldGVyKTtcbiAgICByZXR1cm4gZnJvbSAhPT0gbnVsbCA/IHtmcm9tLCBuYW1lOiBpZC50ZXh0fSA6IG51bGw7XG4gIH1cblxuICBvdmVycmlkZSBnZXREZWNsYXJhdGlvbk9mSWRlbnRpZmllcihpZDogdHMuSWRlbnRpZmllcik6IERlY2xhcmF0aW9ufG51bGwge1xuICAgIC8vIEZpcnN0IHdlIHRyeSBvbmUgb2YgdGhlIGZvbGxvd2luZzpcbiAgICAvLyAxLiBUaGUgYGV4cG9ydHNgIGlkZW50aWZpZXIgLSByZWZlcnJpbmcgdG8gdGhlIGN1cnJlbnQgZmlsZS9tb2R1bGUuXG4gICAgLy8gMi4gQW4gaWRlbnRpZmllciAoZS5nLiBgZm9vYCkgdGhhdCByZWZlcnMgdG8gYW4gaW1wb3J0ZWQgVU1EIG1vZHVsZS5cbiAgICAvLyAzLiBBIFVNRCBzdHlsZSBleHBvcnQgaWRlbnRpZmllciAoZS5nLiB0aGUgYGZvb2Agb2YgYGV4cG9ydHMuZm9vYCkuXG4gICAgY29uc3QgZGVjbGFyYXRpb24gPSB0aGlzLmdldEV4cG9ydHNEZWNsYXJhdGlvbihpZCkgfHwgdGhpcy5nZXRVbWRNb2R1bGVEZWNsYXJhdGlvbihpZCkgfHxcbiAgICAgICAgdGhpcy5nZXRVbWREZWNsYXJhdGlvbihpZCk7XG4gICAgaWYgKGRlY2xhcmF0aW9uICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZGVjbGFyYXRpb247XG4gICAgfVxuXG4gICAgLy8gVHJ5IHRvIGdldCB0aGUgZGVjbGFyYXRpb24gdXNpbmcgdGhlIHN1cGVyIGNsYXNzLlxuICAgIGNvbnN0IHN1cGVyRGVjbGFyYXRpb24gPSBzdXBlci5nZXREZWNsYXJhdGlvbk9mSWRlbnRpZmllcihpZCk7XG4gICAgaWYgKHN1cGVyRGVjbGFyYXRpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZGVjbGFyYXRpb24gaXMgdGhlIGlubmVyIG5vZGUgb2YgYSBkZWNsYXJhdGlvbiBJSUZFLlxuICAgIGNvbnN0IG91dGVyTm9kZSA9IGdldE91dGVyTm9kZUZyb21Jbm5lckRlY2xhcmF0aW9uKHN1cGVyRGVjbGFyYXRpb24ubm9kZSk7XG4gICAgaWYgKG91dGVyTm9kZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHN1cGVyRGVjbGFyYXRpb247XG4gICAgfVxuXG4gICAgLy8gV2UgYXJlIG9ubHkgaW50ZXJlc3RlZCBpZiB0aGUgb3V0ZXIgZGVjbGFyYXRpb24gaXMgb2YgdGhlIGZvcm1cbiAgICAvLyBgZXhwb3J0cy48bmFtZT4gPSA8aW5pdGlhbGl6ZXI+YC5cbiAgICBpZiAoIWlzRXhwb3J0c0Fzc2lnbm1lbnQob3V0ZXJOb2RlKSkge1xuICAgICAgcmV0dXJuIHN1cGVyRGVjbGFyYXRpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGtpbmQ6IERlY2xhcmF0aW9uS2luZC5JbmxpbmUsXG4gICAgICBub2RlOiBvdXRlck5vZGUubGVmdCxcbiAgICAgIGltcGxlbWVudGF0aW9uOiBvdXRlck5vZGUucmlnaHQsXG4gICAgICBrbm93bjogbnVsbCxcbiAgICAgIHZpYU1vZHVsZTogbnVsbCxcbiAgICB9O1xuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0RXhwb3J0c09mTW9kdWxlKG1vZHVsZTogdHMuTm9kZSk6IE1hcDxzdHJpbmcsIERlY2xhcmF0aW9uPnxudWxsIHtcbiAgICByZXR1cm4gc3VwZXIuZ2V0RXhwb3J0c09mTW9kdWxlKG1vZHVsZSkgfHwgdGhpcy51bWRFeHBvcnRzLmdldChtb2R1bGUuZ2V0U291cmNlRmlsZSgpKTtcbiAgfVxuXG4gIGdldFVtZE1vZHVsZShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogVW1kTW9kdWxlfG51bGwge1xuICAgIGlmIChzb3VyY2VGaWxlLmlzRGVjbGFyYXRpb25GaWxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy51bWRNb2R1bGVzLmdldChzb3VyY2VGaWxlKTtcbiAgfVxuXG4gIGdldFVtZEltcG9ydFBhdGgoaW1wb3J0UGFyYW1ldGVyOiB0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbik6IHN0cmluZ3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy51bWRJbXBvcnRQYXRocy5nZXQoaW1wb3J0UGFyYW1ldGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRvcCBsZXZlbCBzdGF0ZW1lbnRzIGZvciBhIG1vZHVsZS5cbiAgICpcbiAgICogSW4gVU1EIG1vZHVsZXMgdGhlc2UgYXJlIHRoZSBib2R5IG9mIHRoZSBVTUQgZmFjdG9yeSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgVGhlIG1vZHVsZSB3aG9zZSBzdGF0ZW1lbnRzIHdlIHdhbnQuXG4gICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHRvcCBsZXZlbCBzdGF0ZW1lbnRzIGZvciB0aGUgZ2l2ZW4gbW9kdWxlLlxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGdldE1vZHVsZVN0YXRlbWVudHMoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHRzLlN0YXRlbWVudFtdIHtcbiAgICBjb25zdCB1bWRNb2R1bGUgPSB0aGlzLmdldFVtZE1vZHVsZShzb3VyY2VGaWxlKTtcbiAgICByZXR1cm4gdW1kTW9kdWxlICE9PSBudWxsID8gQXJyYXkuZnJvbSh1bWRNb2R1bGUuZmFjdG9yeUZuLmJvZHkuc3RhdGVtZW50cykgOiBbXTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXRDbGFzc1N5bWJvbEZyb21PdXRlckRlY2xhcmF0aW9uKGRlY2xhcmF0aW9uOiB0cy5Ob2RlKTogTmdjY0NsYXNzU3ltYm9sXG4gICAgICB8dW5kZWZpbmVkIHtcbiAgICBjb25zdCBzdXBlclN5bWJvbCA9IHN1cGVyLmdldENsYXNzU3ltYm9sRnJvbU91dGVyRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pO1xuICAgIGlmIChzdXBlclN5bWJvbCkge1xuICAgICAgcmV0dXJuIHN1cGVyU3ltYm9sO1xuICAgIH1cblxuICAgIGlmICghaXNFeHBvcnRzRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGxldCBpbml0aWFsaXplciA9IHNraXBBbGlhc2VzKGRlY2xhcmF0aW9uLnBhcmVudC5yaWdodCk7XG5cbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKGluaXRpYWxpemVyKSkge1xuICAgICAgY29uc3QgaW1wbGVtZW50YXRpb24gPSB0aGlzLmdldERlY2xhcmF0aW9uT2ZJZGVudGlmaWVyKGluaXRpYWxpemVyKTtcbiAgICAgIGlmIChpbXBsZW1lbnRhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBpbXBsZW1lbnRhdGlvblN5bWJvbCA9IHRoaXMuZ2V0Q2xhc3NTeW1ib2woaW1wbGVtZW50YXRpb24ubm9kZSk7XG4gICAgICAgIGlmIChpbXBsZW1lbnRhdGlvblN5bWJvbCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBpbXBsZW1lbnRhdGlvblN5bWJvbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlubmVyRGVjbGFyYXRpb24gPSBnZXRJbm5lckNsYXNzRGVjbGFyYXRpb24oaW5pdGlhbGl6ZXIpO1xuICAgIGlmIChpbm5lckRlY2xhcmF0aW9uICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVDbGFzc1N5bWJvbChkZWNsYXJhdGlvbi5uYW1lLCBpbm5lckRlY2xhcmF0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZ2V0Q2xhc3NTeW1ib2xGcm9tSW5uZXJEZWNsYXJhdGlvbihkZWNsYXJhdGlvbjogdHMuTm9kZSk6IE5nY2NDbGFzc1N5bWJvbFxuICAgICAgfHVuZGVmaW5lZCB7XG4gICAgY29uc3Qgc3VwZXJDbGFzc1N5bWJvbCA9IHN1cGVyLmdldENsYXNzU3ltYm9sRnJvbUlubmVyRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pO1xuICAgIGlmIChzdXBlckNsYXNzU3ltYm9sICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBzdXBlckNsYXNzU3ltYm9sO1xuICAgIH1cblxuICAgIGlmICghaXNOYW1lZEZ1bmN0aW9uRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG91dGVyTm9kZSA9IGdldE91dGVyTm9kZUZyb21Jbm5lckRlY2xhcmF0aW9uKGRlY2xhcmF0aW9uKTtcbiAgICBpZiAob3V0ZXJOb2RlID09PSBudWxsIHx8ICFpc0V4cG9ydHNBc3NpZ25tZW50KG91dGVyTm9kZSkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlQ2xhc3NTeW1ib2wob3V0ZXJOb2RlLmxlZnQubmFtZSwgZGVjbGFyYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgYWxsIFwiY2xhc3Nlc1wiIGZyb20gdGhlIGBzdGF0ZW1lbnRgIGFuZCBhZGQgdGhlbSB0byB0aGUgYGNsYXNzZXNgIG1hcC5cbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBhZGRDbGFzc1N5bWJvbHNGcm9tU3RhdGVtZW50KFxuICAgICAgY2xhc3NlczogTWFwPHRzLlN5bWJvbCwgTmdjY0NsYXNzU3ltYm9sPiwgc3RhdGVtZW50OiB0cy5TdGF0ZW1lbnQpOiB2b2lkIHtcbiAgICBzdXBlci5hZGRDbGFzc1N5bWJvbHNGcm9tU3RhdGVtZW50KGNsYXNzZXMsIHN0YXRlbWVudCk7XG5cbiAgICAvLyBBbHNvIGNoZWNrIGZvciBleHBvcnRzIG9mIHRoZSBmb3JtOiBgZXhwb3J0cy48bmFtZT4gPSA8Y2xhc3MgZGVmPjtgXG4gICAgaWYgKGlzRXhwb3J0c1N0YXRlbWVudChzdGF0ZW1lbnQpKSB7XG4gICAgICBjb25zdCBjbGFzc1N5bWJvbCA9IHRoaXMuZ2V0Q2xhc3NTeW1ib2woc3RhdGVtZW50LmV4cHJlc3Npb24ubGVmdCk7XG4gICAgICBpZiAoY2xhc3NTeW1ib2wpIHtcbiAgICAgICAgY2xhc3Nlcy5zZXQoY2xhc3NTeW1ib2wuaW1wbGVtZW50YXRpb24sIGNsYXNzU3ltYm9sKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQW5hbHl6ZSB0aGUgZ2l2ZW4gc3RhdGVtZW50IHRvIHNlZSBpZiBpdCBjb3JyZXNwb25kcyB3aXRoIGFuIGV4cG9ydHMgZGVjbGFyYXRpb24gbGlrZVxuICAgKiBgZXhwb3J0cy5NeUNsYXNzID0gTXlDbGFzc18xID0gPGNsYXNzIGRlZj47YC4gSWYgc28sIHRoZSBkZWNsYXJhdGlvbiBvZiBgTXlDbGFzc18xYFxuICAgKiBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIGBNeUNsYXNzYCBpZGVudGlmaWVyLlxuICAgKlxuICAgKiBAcGFyYW0gc3RhdGVtZW50IFRoZSBzdGF0ZW1lbnQgdGhhdCBuZWVkcyB0byBiZSBwcmVwcm9jZXNzZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcHJlcHJvY2Vzc1N0YXRlbWVudChzdGF0ZW1lbnQ6IHRzLlN0YXRlbWVudCk6IHZvaWQge1xuICAgIHN1cGVyLnByZXByb2Nlc3NTdGF0ZW1lbnQoc3RhdGVtZW50KTtcblxuICAgIGlmICghaXNFeHBvcnRzU3RhdGVtZW50KHN0YXRlbWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNsYXJhdGlvbiA9IHN0YXRlbWVudC5leHByZXNzaW9uLmxlZnQ7XG4gICAgY29uc3QgaW5pdGlhbGl6ZXIgPSBzdGF0ZW1lbnQuZXhwcmVzc2lvbi5yaWdodDtcbiAgICBpZiAoIWlzQXNzaWdubWVudChpbml0aWFsaXplcikgfHwgIXRzLmlzSWRlbnRpZmllcihpbml0aWFsaXplci5sZWZ0KSB8fFxuICAgICAgICAhdGhpcy5pc0NsYXNzKGRlY2xhcmF0aW9uKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFsaWFzZWRJZGVudGlmaWVyID0gaW5pdGlhbGl6ZXIubGVmdDtcblxuICAgIGNvbnN0IGFsaWFzZWREZWNsYXJhdGlvbiA9IHRoaXMuZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXIoYWxpYXNlZElkZW50aWZpZXIpO1xuICAgIGlmIChhbGlhc2VkRGVjbGFyYXRpb24gPT09IG51bGwgfHwgYWxpYXNlZERlY2xhcmF0aW9uLm5vZGUgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgVW5hYmxlIHRvIGxvY2F0ZSBkZWNsYXJhdGlvbiBvZiAke2FsaWFzZWRJZGVudGlmaWVyLnRleHR9IGluIFwiJHtzdGF0ZW1lbnQuZ2V0VGV4dCgpfVwiYCk7XG4gICAgfVxuICAgIHRoaXMuYWxpYXNlZENsYXNzRGVjbGFyYXRpb25zLnNldChhbGlhc2VkRGVjbGFyYXRpb24ubm9kZSwgZGVjbGFyYXRpb24ubmFtZSk7XG4gIH1cblxuICBwcml2YXRlIGNvbXB1dGVVbWRNb2R1bGUoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IFVtZE1vZHVsZXxudWxsIHtcbiAgICBpZiAoc291cmNlRmlsZS5zdGF0ZW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBFeHBlY3RlZCBVTUQgbW9kdWxlIGZpbGUgKCR7c291cmNlRmlsZS5maWxlTmFtZX0pIHRvIGNvbnRhaW4gZXhhY3RseSBvbmUgc3RhdGVtZW50LCBgICtcbiAgICAgICAgICBgYnV0IGZvdW5kICR7c291cmNlRmlsZS5zdGF0ZW1lbnRzLmxlbmd0aH0uYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlU3RhdGVtZW50Rm9yVW1kTW9kdWxlKHNvdXJjZUZpbGUuc3RhdGVtZW50c1swXSk7XG4gIH1cblxuICBwcml2YXRlIGNvbXB1dGVFeHBvcnRzT2ZVbWRNb2R1bGUoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IE1hcDxzdHJpbmcsIERlY2xhcmF0aW9uPnxudWxsIHtcbiAgICBjb25zdCBtb2R1bGVNYXAgPSBuZXcgTWFwPHN0cmluZywgRGVjbGFyYXRpb24+KCk7XG4gICAgZm9yIChjb25zdCBzdGF0ZW1lbnQgb2YgdGhpcy5nZXRNb2R1bGVTdGF0ZW1lbnRzKHNvdXJjZUZpbGUpKSB7XG4gICAgICBpZiAoaXNFeHBvcnRzU3RhdGVtZW50KHN0YXRlbWVudCkpIHtcbiAgICAgICAgY29uc3QgZXhwb3J0RGVjbGFyYXRpb24gPSB0aGlzLmV4dHJhY3RCYXNpY1VtZEV4cG9ydERlY2xhcmF0aW9uKHN0YXRlbWVudCk7XG4gICAgICAgIGlmICghbW9kdWxlTWFwLmhhcyhleHBvcnREZWNsYXJhdGlvbi5uYW1lKSkge1xuICAgICAgICAgIC8vIFdlIGFzc3VtZSB0aGF0IHRoZSBmaXJzdCBgZXhwb3J0cy48bmFtZT5gIGlzIHRoZSBhY3R1YWwgZGVjbGFyYXRpb24sIGFuZCB0aGF0IGFueVxuICAgICAgICAgIC8vIHN1YnNlcXVlbnQgc3RhdGVtZW50cyB0aGF0IG1hdGNoIGFyZSBkZWNvcmF0aW5nIHRoZSBvcmlnaW5hbCBkZWNsYXJhdGlvbi5cbiAgICAgICAgICAvLyBGb3IgZXhhbXBsZTpcbiAgICAgICAgICAvLyBgYGBcbiAgICAgICAgICAvLyBleHBvcnRzLmZvbyA9IDxkZWNsYXJhdGlvbj47XG4gICAgICAgICAgLy8gZXhwb3J0cy5mb28gPSBfX2RlY29yYXRlKDxkZWNvcmF0b3I+LCBleHBvcnRzLmZvbyk7XG4gICAgICAgICAgLy8gYGBgXG4gICAgICAgICAgLy8gVGhlIGRlY2xhcmF0aW9uIGlzIHRoZSBmaXJzdCBsaW5lIG5vdCB0aGUgc2Vjb25kLlxuICAgICAgICAgIG1vZHVsZU1hcC5zZXQoZXhwb3J0RGVjbGFyYXRpb24ubmFtZSwgZXhwb3J0RGVjbGFyYXRpb24uZGVjbGFyYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGlzV2lsZGNhcmRSZWV4cG9ydFN0YXRlbWVudChzdGF0ZW1lbnQpKSB7XG4gICAgICAgIGNvbnN0IHJlZXhwb3J0cyA9IHRoaXMuZXh0cmFjdFVtZFdpbGRjYXJkUmVleHBvcnRzKHN0YXRlbWVudCwgc291cmNlRmlsZSk7XG4gICAgICAgIGZvciAoY29uc3QgcmVleHBvcnQgb2YgcmVleHBvcnRzKSB7XG4gICAgICAgICAgbW9kdWxlTWFwLnNldChyZWV4cG9ydC5uYW1lLCByZWV4cG9ydC5kZWNsYXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNEZWZpbmVQcm9wZXJ0eVJlZXhwb3J0U3RhdGVtZW50KHN0YXRlbWVudCkpIHtcbiAgICAgICAgY29uc3QgZXhwb3J0RGVjbGFyYXRpb24gPSB0aGlzLmV4dHJhY3RVbWREZWZpbmVQcm9wZXJ0eUV4cG9ydERlY2xhcmF0aW9uKHN0YXRlbWVudCk7XG4gICAgICAgIGlmIChleHBvcnREZWNsYXJhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgIG1vZHVsZU1hcC5zZXQoZXhwb3J0RGVjbGFyYXRpb24ubmFtZSwgZXhwb3J0RGVjbGFyYXRpb24uZGVjbGFyYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb2R1bGVNYXA7XG4gIH1cblxuICBwcml2YXRlIGNvbXB1dGVJbXBvcnRQYXRoKHBhcmFtOiB0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbik6IHN0cmluZ3xudWxsIHtcbiAgICBjb25zdCB1bWRNb2R1bGUgPSB0aGlzLmdldFVtZE1vZHVsZShwYXJhbS5nZXRTb3VyY2VGaWxlKCkpO1xuICAgIGlmICh1bWRNb2R1bGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydHMgPSBnZXRJbXBvcnRzT2ZVbWRNb2R1bGUodW1kTW9kdWxlKTtcbiAgICBpZiAoaW1wb3J0cyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGltcG9ydFBhdGg6IHN0cmluZ3xudWxsID0gbnVsbDtcblxuICAgIGZvciAoY29uc3QgaSBvZiBpbXBvcnRzKSB7XG4gICAgICAvLyBBZGQgYWxsIGltcG9ydHMgdG8gdGhlIG1hcCB0byBzcGVlZCB1cCBmdXR1cmUgbG9vayB1cHMuXG4gICAgICB0aGlzLnVtZEltcG9ydFBhdGhzLnNldChpLnBhcmFtZXRlciwgaS5wYXRoKTtcbiAgICAgIGlmIChpLnBhcmFtZXRlciA9PT0gcGFyYW0pIHtcbiAgICAgICAgaW1wb3J0UGF0aCA9IGkucGF0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW1wb3J0UGF0aDtcbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdEJhc2ljVW1kRXhwb3J0RGVjbGFyYXRpb24oc3RhdGVtZW50OiBFeHBvcnRzU3RhdGVtZW50KTogRXhwb3J0RGVjbGFyYXRpb24ge1xuICAgIGNvbnN0IG5hbWUgPSBzdGF0ZW1lbnQuZXhwcmVzc2lvbi5sZWZ0Lm5hbWUudGV4dDtcbiAgICBjb25zdCBleHBvcnRFeHByZXNzaW9uID0gc2tpcEFsaWFzZXMoc3RhdGVtZW50LmV4cHJlc3Npb24ucmlnaHQpO1xuICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gdGhpcy5nZXREZWNsYXJhdGlvbk9mRXhwcmVzc2lvbihleHBvcnRFeHByZXNzaW9uKSA/PyB7XG4gICAgICBraW5kOiBEZWNsYXJhdGlvbktpbmQuSW5saW5lLFxuICAgICAgbm9kZTogc3RhdGVtZW50LmV4cHJlc3Npb24ubGVmdCxcbiAgICAgIGltcGxlbWVudGF0aW9uOiBzdGF0ZW1lbnQuZXhwcmVzc2lvbi5yaWdodCxcbiAgICAgIGtub3duOiBudWxsLFxuICAgICAgdmlhTW9kdWxlOiBudWxsLFxuICAgIH07XG4gICAgcmV0dXJuIHtuYW1lLCBkZWNsYXJhdGlvbn07XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3RVbWRXaWxkY2FyZFJlZXhwb3J0cyhcbiAgICAgIHN0YXRlbWVudDogV2lsZGNhcmRSZWV4cG9ydFN0YXRlbWVudCwgY29udGFpbmluZ0ZpbGU6IHRzLlNvdXJjZUZpbGUpOiBFeHBvcnREZWNsYXJhdGlvbltdIHtcbiAgICBjb25zdCByZWV4cG9ydEFyZyA9IHN0YXRlbWVudC5leHByZXNzaW9uLmFyZ3VtZW50c1swXTtcblxuICAgIGNvbnN0IHJlcXVpcmVDYWxsID0gaXNSZXF1aXJlQ2FsbChyZWV4cG9ydEFyZykgP1xuICAgICAgICByZWV4cG9ydEFyZyA6XG4gICAgICAgIHRzLmlzSWRlbnRpZmllcihyZWV4cG9ydEFyZykgPyBmaW5kUmVxdWlyZUNhbGxSZWZlcmVuY2UocmVleHBvcnRBcmcsIHRoaXMuY2hlY2tlcikgOiBudWxsO1xuXG4gICAgbGV0IGltcG9ydFBhdGg6IHN0cmluZ3xudWxsID0gbnVsbDtcblxuICAgIGlmIChyZXF1aXJlQ2FsbCAhPT0gbnVsbCkge1xuICAgICAgaW1wb3J0UGF0aCA9IHJlcXVpcmVDYWxsLmFyZ3VtZW50c1swXS50ZXh0O1xuICAgIH0gZWxzZSBpZiAodHMuaXNJZGVudGlmaWVyKHJlZXhwb3J0QXJnKSkge1xuICAgICAgY29uc3QgaW1wb3J0UGFyYW1ldGVyID0gdGhpcy5maW5kVW1kSW1wb3J0UGFyYW1ldGVyKHJlZXhwb3J0QXJnKTtcbiAgICAgIGltcG9ydFBhdGggPSBpbXBvcnRQYXJhbWV0ZXIgJiYgdGhpcy5nZXRVbWRJbXBvcnRQYXRoKGltcG9ydFBhcmFtZXRlcik7XG4gICAgfVxuXG4gICAgaWYgKGltcG9ydFBhdGggPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRlZEZpbGUgPSB0aGlzLnJlc29sdmVNb2R1bGVOYW1lKGltcG9ydFBhdGgsIGNvbnRhaW5pbmdGaWxlKTtcbiAgICBpZiAoaW1wb3J0ZWRGaWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRlZEV4cG9ydHMgPSB0aGlzLmdldEV4cG9ydHNPZk1vZHVsZShpbXBvcnRlZEZpbGUpO1xuICAgIGlmIChpbXBvcnRlZEV4cG9ydHMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCB2aWFNb2R1bGUgPSBzdHJpcEV4dGVuc2lvbihpbXBvcnRlZEZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IHJlZXhwb3J0czogRXhwb3J0RGVjbGFyYXRpb25bXSA9IFtdO1xuICAgIGltcG9ydGVkRXhwb3J0cy5mb3JFYWNoKFxuICAgICAgICAoZGVjbCwgbmFtZSkgPT4gcmVleHBvcnRzLnB1c2goe25hbWUsIGRlY2xhcmF0aW9uOiB7Li4uZGVjbCwgdmlhTW9kdWxlfX0pKTtcbiAgICByZXR1cm4gcmVleHBvcnRzO1xuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0VW1kRGVmaW5lUHJvcGVydHlFeHBvcnREZWNsYXJhdGlvbihzdGF0ZW1lbnQ6IERlZmluZVByb3BlcnR5UmVleHBvcnRTdGF0ZW1lbnQpOlxuICAgICAgRXhwb3J0RGVjbGFyYXRpb258bnVsbCB7XG4gICAgY29uc3QgYXJncyA9IHN0YXRlbWVudC5leHByZXNzaW9uLmFyZ3VtZW50cztcbiAgICBjb25zdCBuYW1lID0gYXJnc1sxXS50ZXh0O1xuICAgIGNvbnN0IGdldHRlckZuRXhwcmVzc2lvbiA9IGV4dHJhY3RHZXR0ZXJGbkV4cHJlc3Npb24oc3RhdGVtZW50KTtcbiAgICBpZiAoZ2V0dGVyRm5FeHByZXNzaW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNsYXJhdGlvbiA9IHRoaXMuZ2V0RGVjbGFyYXRpb25PZkV4cHJlc3Npb24oZ2V0dGVyRm5FeHByZXNzaW9uKTtcbiAgICBpZiAoZGVjbGFyYXRpb24gIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB7bmFtZSwgZGVjbGFyYXRpb259O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lLFxuICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAga2luZDogRGVjbGFyYXRpb25LaW5kLklubGluZSxcbiAgICAgICAgbm9kZTogYXJnc1sxXSxcbiAgICAgICAgaW1wbGVtZW50YXRpb246IGdldHRlckZuRXhwcmVzc2lvbixcbiAgICAgICAga25vd246IG51bGwsXG4gICAgICAgIHZpYU1vZHVsZTogbnVsbCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJcyB0aGUgaWRlbnRpZmllciBhIHBhcmFtZXRlciBvbiBhIFVNRCBmYWN0b3J5IGZ1bmN0aW9uLCBlLmcuIGBmdW5jdGlvbiBmYWN0b3J5KHRoaXMsIGNvcmUpYD9cbiAgICogSWYgc28gdGhlbiByZXR1cm4gaXRzIGRlY2xhcmF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kVW1kSW1wb3J0UGFyYW1ldGVyKGlkOiB0cy5JZGVudGlmaWVyKTogdHMuUGFyYW1ldGVyRGVjbGFyYXRpb258bnVsbCB7XG4gICAgY29uc3Qgc3ltYm9sID0gaWQgJiYgdGhpcy5jaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24oaWQpIHx8IG51bGw7XG4gICAgY29uc3QgZGVjbGFyYXRpb24gPSBzeW1ib2wgJiYgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb247XG4gICAgcmV0dXJuIGRlY2xhcmF0aW9uICYmIHRzLmlzUGFyYW1ldGVyKGRlY2xhcmF0aW9uKSA/IGRlY2xhcmF0aW9uIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VW1kRGVjbGFyYXRpb24oaWQ6IHRzLklkZW50aWZpZXIpOiBEZWNsYXJhdGlvbnxudWxsIHtcbiAgICBjb25zdCBuc0lkZW50aWZpZXIgPSBmaW5kTmFtZXNwYWNlT2ZJZGVudGlmaWVyKGlkKTtcbiAgICBpZiAobnNJZGVudGlmaWVyID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAobnNJZGVudGlmaWVyLnBhcmVudC5wYXJlbnQgJiYgaXNFeHBvcnRzQXNzaWdubWVudChuc0lkZW50aWZpZXIucGFyZW50LnBhcmVudCkpIHtcbiAgICAgIGNvbnN0IGluaXRpYWxpemVyID0gbnNJZGVudGlmaWVyLnBhcmVudC5wYXJlbnQucmlnaHQ7XG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKGluaXRpYWxpemVyKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREZWNsYXJhdGlvbk9mSWRlbnRpZmllcihpbml0aWFsaXplcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5kZXRlY3RLbm93bkRlY2xhcmF0aW9uKHtcbiAgICAgICAga2luZDogRGVjbGFyYXRpb25LaW5kLklubGluZSxcbiAgICAgICAgbm9kZTogbnNJZGVudGlmaWVyLnBhcmVudC5wYXJlbnQubGVmdCxcbiAgICAgICAgaW1wbGVtZW50YXRpb246IHNraXBBbGlhc2VzKG5zSWRlbnRpZmllci5wYXJlbnQucGFyZW50LnJpZ2h0KSxcbiAgICAgICAgdmlhTW9kdWxlOiBudWxsLFxuICAgICAgICBrbm93bjogbnVsbCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZHVsZURlY2xhcmF0aW9uID0gdGhpcy5nZXRVbWRNb2R1bGVEZWNsYXJhdGlvbihuc0lkZW50aWZpZXIpO1xuICAgIGlmIChtb2R1bGVEZWNsYXJhdGlvbiA9PT0gbnVsbCB8fCBtb2R1bGVEZWNsYXJhdGlvbi5ub2RlID09PSBudWxsIHx8XG4gICAgICAgICF0cy5pc1NvdXJjZUZpbGUobW9kdWxlRGVjbGFyYXRpb24ubm9kZSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZHVsZUV4cG9ydHMgPSB0aGlzLmdldEV4cG9ydHNPZk1vZHVsZShtb2R1bGVEZWNsYXJhdGlvbi5ub2RlKTtcbiAgICBpZiAobW9kdWxlRXhwb3J0cyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byBjb21wdXRlIHRoZSBgdmlhTW9kdWxlYCBiZWNhdXNlICB0aGUgYGdldEV4cG9ydHNPZk1vZHVsZSgpYCBjYWxsXG4gICAgLy8gZGlkIG5vdCBrbm93IHRoYXQgd2Ugd2VyZSBpbXBvcnRpbmcgdGhlIGRlY2xhcmF0aW9uLlxuICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gbW9kdWxlRXhwb3J0cy5nZXQoaWQudGV4dCkhO1xuXG4gICAgaWYgKCFtb2R1bGVFeHBvcnRzLmhhcyhpZC50ZXh0KSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byBjb21wdXRlIHRoZSBgdmlhTW9kdWxlYCBiZWNhdXNlICB0aGUgYGdldEV4cG9ydHNPZk1vZHVsZSgpYCBjYWxsXG4gICAgLy8gZGlkIG5vdCBrbm93IHRoYXQgd2Ugd2VyZSBpbXBvcnRpbmcgdGhlIGRlY2xhcmF0aW9uLlxuICAgIGNvbnN0IHZpYU1vZHVsZSA9XG4gICAgICAgIGRlY2xhcmF0aW9uLnZpYU1vZHVsZSA9PT0gbnVsbCA/IG1vZHVsZURlY2xhcmF0aW9uLnZpYU1vZHVsZSA6IGRlY2xhcmF0aW9uLnZpYU1vZHVsZTtcblxuICAgIHJldHVybiB7Li4uZGVjbGFyYXRpb24sIHZpYU1vZHVsZSwga25vd246IGdldFRzSGVscGVyRm5Gcm9tSWRlbnRpZmllcihpZCl9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFeHBvcnRzRGVjbGFyYXRpb24oaWQ6IHRzLklkZW50aWZpZXIpOiBEZWNsYXJhdGlvbnxudWxsIHtcbiAgICBpZiAoIWlzRXhwb3J0c0lkZW50aWZpZXIoaWQpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTYWRseSwgaW4gdGhlIGNhc2Ugb2YgYGV4cG9ydHMuZm9vID0gYmFyYCwgd2UgY2FuJ3QgdXNlIGB0aGlzLmZpbmRVbWRJbXBvcnRQYXJhbWV0ZXIoaWQpYFxuICAgIC8vIHRvIGNoZWNrIHdoZXRoZXIgdGhpcyBgZXhwb3J0c2AgaXMgZnJvbSB0aGUgSUlGRSBib2R5IGFyZ3VtZW50cywgYmVjYXVzZVxuICAgIC8vIGB0aGlzLmNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihpZClgIHdpbGwgcmV0dXJuIHRoZSBzeW1ib2wgZm9yIHRoZSBgZm9vYCBpZGVudGlmaWVyXG4gICAgLy8gcmF0aGVyIHRoYW4gdGhlIGBleHBvcnRzYCBpZGVudGlmaWVyLlxuICAgIC8vXG4gICAgLy8gSW5zdGVhZCB3ZSBzZWFyY2ggdGhlIHN5bWJvbHMgaW4gdGhlIGN1cnJlbnQgbG9jYWwgc2NvcGUuXG4gICAgY29uc3QgZXhwb3J0c1N5bWJvbCA9IHRoaXMuY2hlY2tlci5nZXRTeW1ib2xzSW5TY29wZShpZCwgdHMuU3ltYm9sRmxhZ3MuVmFyaWFibGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZChzeW1ib2wgPT4gc3ltYm9sLm5hbWUgPT09ICdleHBvcnRzJyk7XG5cbiAgICBjb25zdCBub2RlID0gZXhwb3J0c1N5bWJvbD8udmFsdWVEZWNsYXJhdGlvbiAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAhdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24oZXhwb3J0c1N5bWJvbC52YWx1ZURlY2xhcmF0aW9uLnBhcmVudCkgP1xuICAgICAgICAvLyBUaGVyZSBpcyBhIGxvY2FsbHkgZGVmaW5lZCBgZXhwb3J0c2AgdmFyaWFibGUgdGhhdCBpcyBub3QgYSBmdW5jdGlvbiBwYXJhbWV0ZXIuXG4gICAgICAgIC8vIFNvIHRoaXMgYGV4cG9ydHNgIGlkZW50aWZpZXIgbXVzdCBiZSBhIGxvY2FsIHZhcmlhYmxlIGFuZCBkb2VzIG5vdCByZXByZXNlbnQgdGhlIG1vZHVsZS5cbiAgICAgICAgZXhwb3J0c1N5bWJvbC52YWx1ZURlY2xhcmF0aW9uIDpcbiAgICAgICAgLy8gVGhlcmUgaXMgbm8gbG9jYWwgc3ltYm9sIG9yIGl0IGlzIGEgcGFyYW1ldGVyIG9mIGFuIElJRkUuXG4gICAgICAgIC8vIFNvIHRoaXMgYGV4cG9ydHNgIHJlcHJlc2VudHMgdGhlIGN1cnJlbnQgXCJtb2R1bGVcIi5cbiAgICAgICAgaWQuZ2V0U291cmNlRmlsZSgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGtpbmQ6IERlY2xhcmF0aW9uS2luZC5Db25jcmV0ZSxcbiAgICAgIG5vZGUsXG4gICAgICB2aWFNb2R1bGU6IG51bGwsXG4gICAgICBrbm93bjogbnVsbCxcbiAgICAgIGlkZW50aXR5OiBudWxsLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGdldFVtZE1vZHVsZURlY2xhcmF0aW9uKGlkOiB0cy5JZGVudGlmaWVyKTogRGVjbGFyYXRpb258bnVsbCB7XG4gICAgY29uc3QgaW1wb3J0UGF0aCA9IHRoaXMuZ2V0SW1wb3J0UGF0aEZyb21QYXJhbWV0ZXIoaWQpIHx8IHRoaXMuZ2V0SW1wb3J0UGF0aEZyb21SZXF1aXJlQ2FsbChpZCk7XG4gICAgaWYgKGltcG9ydFBhdGggPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMucmVzb2x2ZU1vZHVsZU5hbWUoaW1wb3J0UGF0aCwgaWQuZ2V0U291cmNlRmlsZSgpKTtcbiAgICBpZiAobW9kdWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHZpYU1vZHVsZSA9IGlzRXh0ZXJuYWxJbXBvcnQoaW1wb3J0UGF0aCkgPyBpbXBvcnRQYXRoIDogbnVsbDtcbiAgICByZXR1cm4ge2tpbmQ6IERlY2xhcmF0aW9uS2luZC5Db25jcmV0ZSwgbm9kZTogbW9kdWxlLCB2aWFNb2R1bGUsIGtub3duOiBudWxsLCBpZGVudGl0eTogbnVsbH07XG4gIH1cblxuICBwcml2YXRlIGdldEltcG9ydFBhdGhGcm9tUGFyYW1ldGVyKGlkOiB0cy5JZGVudGlmaWVyKTogc3RyaW5nfG51bGwge1xuICAgIGNvbnN0IGltcG9ydFBhcmFtZXRlciA9IHRoaXMuZmluZFVtZEltcG9ydFBhcmFtZXRlcihpZCk7XG4gICAgaWYgKGltcG9ydFBhcmFtZXRlciA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldFVtZEltcG9ydFBhdGgoaW1wb3J0UGFyYW1ldGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0SW1wb3J0UGF0aEZyb21SZXF1aXJlQ2FsbChpZDogdHMuSWRlbnRpZmllcik6IHN0cmluZ3xudWxsIHtcbiAgICBjb25zdCByZXF1aXJlQ2FsbCA9IGZpbmRSZXF1aXJlQ2FsbFJlZmVyZW5jZShpZCwgdGhpcy5jaGVja2VyKTtcbiAgICBpZiAocmVxdWlyZUNhbGwgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gcmVxdWlyZUNhbGwuYXJndW1lbnRzWzBdLnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhpcyBpcyBhbiBJSUZFIHRoZW4gdHJ5IHRvIGdyYWIgdGhlIG91dGVyIGFuZCBpbm5lciBjbGFzc2VzIG90aGVyd2lzZSBmYWxsYmFjayBvbiB0aGUgc3VwZXJcbiAgICogY2xhc3MuXG4gICAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZ2V0RGVjbGFyYXRpb25PZkV4cHJlc3Npb24oZXhwcmVzc2lvbjogdHMuRXhwcmVzc2lvbik6IERlY2xhcmF0aW9ufG51bGwge1xuICAgIGNvbnN0IGlubmVyID0gZ2V0SW5uZXJDbGFzc0RlY2xhcmF0aW9uKGV4cHJlc3Npb24pO1xuICAgIGlmIChpbm5lciAhPT0gbnVsbCkge1xuICAgICAgY29uc3Qgb3V0ZXIgPSBnZXRPdXRlck5vZGVGcm9tSW5uZXJEZWNsYXJhdGlvbihpbm5lcik7XG4gICAgICBpZiAob3V0ZXIgIT09IG51bGwgJiYgaXNFeHBvcnRzQXNzaWdubWVudChvdXRlcikpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBraW5kOiBEZWNsYXJhdGlvbktpbmQuSW5saW5lLFxuICAgICAgICAgIG5vZGU6IG91dGVyLmxlZnQsXG4gICAgICAgICAgaW1wbGVtZW50YXRpb246IGlubmVyLFxuICAgICAgICAgIGtub3duOiBudWxsLFxuICAgICAgICAgIHZpYU1vZHVsZTogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLmdldERlY2xhcmF0aW9uT2ZFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNvbHZlTW9kdWxlTmFtZShtb2R1bGVOYW1lOiBzdHJpbmcsIGNvbnRhaW5pbmdGaWxlOiB0cy5Tb3VyY2VGaWxlKTogdHMuU291cmNlRmlsZVxuICAgICAgfHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMuY29tcGlsZXJIb3N0LnJlc29sdmVNb2R1bGVOYW1lcykge1xuICAgICAgY29uc3QgbW9kdWxlSW5mbyA9IHRoaXMuY29tcGlsZXJIb3N0LnJlc29sdmVNb2R1bGVOYW1lcyhcbiAgICAgICAgICBbbW9kdWxlTmFtZV0sIGNvbnRhaW5pbmdGaWxlLmZpbGVOYW1lLCB1bmRlZmluZWQsIHVuZGVmaW5lZCxcbiAgICAgICAgICB0aGlzLnByb2dyYW0uZ2V0Q29tcGlsZXJPcHRpb25zKCkpWzBdO1xuICAgICAgcmV0dXJuIG1vZHVsZUluZm8gJiYgdGhpcy5wcm9ncmFtLmdldFNvdXJjZUZpbGUoYWJzb2x1dGVGcm9tKG1vZHVsZUluZm8ucmVzb2x2ZWRGaWxlTmFtZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtb2R1bGVJbmZvID0gdHMucmVzb2x2ZU1vZHVsZU5hbWUoXG4gICAgICAgICAgbW9kdWxlTmFtZSwgY29udGFpbmluZ0ZpbGUuZmlsZU5hbWUsIHRoaXMucHJvZ3JhbS5nZXRDb21waWxlck9wdGlvbnMoKSxcbiAgICAgICAgICB0aGlzLmNvbXBpbGVySG9zdCk7XG4gICAgICByZXR1cm4gbW9kdWxlSW5mby5yZXNvbHZlZE1vZHVsZSAmJlxuICAgICAgICAgIHRoaXMucHJvZ3JhbS5nZXRTb3VyY2VGaWxlKGFic29sdXRlRnJvbShtb2R1bGVJbmZvLnJlc29sdmVkTW9kdWxlLnJlc29sdmVkRmlsZU5hbWUpKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU3RhdGVtZW50Rm9yVW1kTW9kdWxlKHN0YXRlbWVudDogdHMuU3RhdGVtZW50KTogVW1kTW9kdWxlfG51bGwge1xuICBjb25zdCB3cmFwcGVyQ2FsbCA9IGdldFVtZFdyYXBwZXJDYWxsKHN0YXRlbWVudCk7XG4gIGlmICghd3JhcHBlckNhbGwpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHdyYXBwZXJGbiA9IHdyYXBwZXJDYWxsLmV4cHJlc3Npb247XG4gIGlmICghdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24od3JhcHBlckZuKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZmFjdG9yeUZuUGFyYW1JbmRleCA9IHdyYXBwZXJGbi5wYXJhbWV0ZXJzLmZpbmRJbmRleChcbiAgICAgIHBhcmFtZXRlciA9PiB0cy5pc0lkZW50aWZpZXIocGFyYW1ldGVyLm5hbWUpICYmIHBhcmFtZXRlci5uYW1lLnRleHQgPT09ICdmYWN0b3J5Jyk7XG4gIGlmIChmYWN0b3J5Rm5QYXJhbUluZGV4ID09PSAtMSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZmFjdG9yeUZuID0gc3RyaXBQYXJlbnRoZXNlcyh3cmFwcGVyQ2FsbC5hcmd1bWVudHNbZmFjdG9yeUZuUGFyYW1JbmRleF0pO1xuICBpZiAoIWZhY3RvcnlGbiB8fCAhdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24oZmFjdG9yeUZuKSkgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIHt3cmFwcGVyRm4sIGZhY3RvcnlGbn07XG59XG5cbmZ1bmN0aW9uIGdldFVtZFdyYXBwZXJDYWxsKHN0YXRlbWVudDogdHMuU3RhdGVtZW50KTogdHMuQ2FsbEV4cHJlc3Npb24mXG4gICAge2V4cHJlc3Npb246IHRzLkZ1bmN0aW9uRXhwcmVzc2lvbn18bnVsbCB7XG4gIGlmICghdHMuaXNFeHByZXNzaW9uU3RhdGVtZW50KHN0YXRlbWVudCkgfHwgIXRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24oc3RhdGVtZW50LmV4cHJlc3Npb24pIHx8XG4gICAgICAhdHMuaXNDYWxsRXhwcmVzc2lvbihzdGF0ZW1lbnQuZXhwcmVzc2lvbi5leHByZXNzaW9uKSB8fFxuICAgICAgIXRzLmlzRnVuY3Rpb25FeHByZXNzaW9uKHN0YXRlbWVudC5leHByZXNzaW9uLmV4cHJlc3Npb24uZXhwcmVzc2lvbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gc3RhdGVtZW50LmV4cHJlc3Npb24uZXhwcmVzc2lvbiBhcyB0cy5DYWxsRXhwcmVzc2lvbiAmIHtleHByZXNzaW9uOiB0cy5GdW5jdGlvbkV4cHJlc3Npb259O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbXBvcnRzT2ZVbWRNb2R1bGUodW1kTW9kdWxlOiBVbWRNb2R1bGUpOlxuICAgIHtwYXJhbWV0ZXI6IHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uLCBwYXRoOiBzdHJpbmd9W10ge1xuICBjb25zdCBpbXBvcnRzOiB7cGFyYW1ldGVyOiB0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbiwgcGF0aDogc3RyaW5nfVtdID0gW107XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgdW1kTW9kdWxlLmZhY3RvcnlGbi5wYXJhbWV0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgaW1wb3J0cy5wdXNoKHtcbiAgICAgIHBhcmFtZXRlcjogdW1kTW9kdWxlLmZhY3RvcnlGbi5wYXJhbWV0ZXJzW2ldLFxuICAgICAgcGF0aDogZ2V0UmVxdWlyZWRNb2R1bGVQYXRoKHVtZE1vZHVsZS53cmFwcGVyRm4sIGkpXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGltcG9ydHM7XG59XG5cbmludGVyZmFjZSBVbWRNb2R1bGUge1xuICB3cmFwcGVyRm46IHRzLkZ1bmN0aW9uRXhwcmVzc2lvbjtcbiAgZmFjdG9yeUZuOiB0cy5GdW5jdGlvbkV4cHJlc3Npb247XG59XG5cbmZ1bmN0aW9uIGdldFJlcXVpcmVkTW9kdWxlUGF0aCh3cmFwcGVyRm46IHRzLkZ1bmN0aW9uRXhwcmVzc2lvbiwgcGFyYW1JbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3Qgc3RhdGVtZW50ID0gd3JhcHBlckZuLmJvZHkuc3RhdGVtZW50c1swXTtcbiAgaWYgKCF0cy5pc0V4cHJlc3Npb25TdGF0ZW1lbnQoc3RhdGVtZW50KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1VNRCB3cmFwcGVyIGJvZHkgaXMgbm90IGFuIGV4cHJlc3Npb24gc3RhdGVtZW50OlxcbicgKyB3cmFwcGVyRm4uYm9keS5nZXRUZXh0KCkpO1xuICB9XG4gIGNvbnN0IG1vZHVsZVBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuICBmaW5kTW9kdWxlUGF0aHMoc3RhdGVtZW50LmV4cHJlc3Npb24pO1xuXG4gIC8vIFNpbmNlIHdlIHdlcmUgb25seSBpbnRlcmVzdGVkIGluIHRoZSBgcmVxdWlyZSgpYCBjYWxscywgd2UgbWlzcyB0aGUgYGV4cG9ydHNgIGFyZ3VtZW50LCBzbyB3ZVxuICAvLyBuZWVkIHRvIHN1YnRyYWN0IDEuXG4gIC8vIEUuZy4gYGZ1bmN0aW9uKGV4cG9ydHMsIGRlcDEsIGRlcDIpYCBtYXBzIHRvIGBmdW5jdGlvbihleHBvcnRzLCByZXF1aXJlKCdwYXRoL3RvL2RlcDEnKSxcbiAgLy8gcmVxdWlyZSgncGF0aC90by9kZXAyJykpYFxuICByZXR1cm4gbW9kdWxlUGF0aHNbcGFyYW1JbmRleCAtIDFdO1xuXG4gIC8vIFNlYXJjaCB0aGUgc3RhdGVtZW50IGZvciBjYWxscyB0byBgcmVxdWlyZSgnLi4uJylgIGFuZCBleHRyYWN0IHRoZSBzdHJpbmcgdmFsdWUgb2YgdGhlIGZpcnN0XG4gIC8vIGFyZ3VtZW50XG4gIGZ1bmN0aW9uIGZpbmRNb2R1bGVQYXRocyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKGlzUmVxdWlyZUNhbGwobm9kZSkpIHtcbiAgICAgIGNvbnN0IGFyZ3VtZW50ID0gbm9kZS5hcmd1bWVudHNbMF07XG4gICAgICBpZiAodHMuaXNTdHJpbmdMaXRlcmFsKGFyZ3VtZW50KSkge1xuICAgICAgICBtb2R1bGVQYXRocy5wdXNoKGFyZ3VtZW50LnRleHQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLmZvckVhY2hDaGlsZChmaW5kTW9kdWxlUGF0aHMpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIElzIHRoZSBgbm9kZWAgYW4gaWRlbnRpZmllciB3aXRoIHRoZSBuYW1lIFwiZXhwb3J0c1wiP1xuICovXG5mdW5jdGlvbiBpc0V4cG9ydHNJZGVudGlmaWVyKG5vZGU6IHRzLk5vZGUpOiBub2RlIGlzIHRzLklkZW50aWZpZXIge1xuICByZXR1cm4gdHMuaXNJZGVudGlmaWVyKG5vZGUpICYmIG5vZGUudGV4dCA9PT0gJ2V4cG9ydHMnO1xufVxuIl19