(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/rendering/umd_rendering_formatter", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/ngcc/src/rendering/esm5_rendering_formatter", "@angular/compiler-cli/ngcc/src/rendering/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UmdRenderingFormatter = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var esm5_rendering_formatter_1 = require("@angular/compiler-cli/ngcc/src/rendering/esm5_rendering_formatter");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/rendering/utils");
    /**
     * A RenderingFormatter that works with UMD files, instead of `import` and `export` statements
     * the module is an IIFE with a factory function call with dependencies, which are defined in a
     * wrapper function for AMD, CommonJS and global module formats.
     */
    var UmdRenderingFormatter = /** @class */ (function (_super) {
        tslib_1.__extends(UmdRenderingFormatter, _super);
        function UmdRenderingFormatter(fs, umdHost, isCore) {
            var _this = _super.call(this, fs, umdHost, isCore) || this;
            _this.umdHost = umdHost;
            return _this;
        }
        /**
         * Add the imports to the UMD module IIFE.
         *
         * Note that imports at "prepended" to the start of the parameter list of the factory function,
         * and so also to the arguments passed to it when it is called.
         * This is because there are scenarios where the factory function does not accept as many
         * parameters as are passed as argument in the call. For example:
         *
         * ```
         * (function (global, factory) {
         *     typeof exports === 'object' && typeof module !== 'undefined' ?
         *         factory(exports,require('x'),require('z')) :
         *     typeof define === 'function' && define.amd ?
         *         define(['exports', 'x', 'z'], factory) :
         *     (global = global || self, factory(global.myBundle = {}, global.x));
         * }(this, (function (exports, x) { ... }
         * ```
         *
         * (See that the `z` import is not being used by the factory function.)
         */
        UmdRenderingFormatter.prototype.addImports = function (output, imports, file) {
            if (imports.length === 0) {
                return;
            }
            // Assume there is only one UMD module in the file
            var umdModule = this.umdHost.getUmdModule(file);
            if (!umdModule) {
                return;
            }
            var wrapperFunction = umdModule.wrapperFn;
            // We need to add new `require()` calls for each import in the CommonJS initializer
            renderCommonJsDependencies(output, wrapperFunction, imports);
            renderAmdDependencies(output, wrapperFunction, imports);
            renderGlobalDependencies(output, wrapperFunction, imports);
            renderFactoryParameters(output, wrapperFunction, imports);
        };
        /**
         * Add the exports to the bottom of the UMD module factory function.
         */
        UmdRenderingFormatter.prototype.addExports = function (output, entryPointBasePath, exports, importManager, file) {
            var _this = this;
            var umdModule = this.umdHost.getUmdModule(file);
            if (!umdModule) {
                return;
            }
            var factoryFunction = umdModule.factoryFn;
            var lastStatement = factoryFunction.body.statements[factoryFunction.body.statements.length - 1];
            var insertionPoint = lastStatement ? lastStatement.getEnd() : factoryFunction.body.getEnd() - 1;
            exports.forEach(function (e) {
                var basePath = utils_1.stripExtension(e.from);
                var relativePath = './' + _this.fs.relative(_this.fs.dirname(entryPointBasePath), basePath);
                var namedImport = entryPointBasePath !== basePath ?
                    importManager.generateNamedImport(relativePath, e.identifier) :
                    { symbol: e.identifier, moduleImport: null };
                var importNamespace = namedImport.moduleImport ? namedImport.moduleImport.text + "." : '';
                var exportStr = "\nexports." + e.identifier + " = " + importNamespace + namedImport.symbol + ";";
                output.appendRight(insertionPoint, exportStr);
            });
        };
        UmdRenderingFormatter.prototype.addDirectExports = function (output, exports, importManager, file) {
            var e_1, _a;
            var umdModule = this.umdHost.getUmdModule(file);
            if (!umdModule) {
                return;
            }
            var factoryFunction = umdModule.factoryFn;
            var lastStatement = factoryFunction.body.statements[factoryFunction.body.statements.length - 1];
            var insertionPoint = lastStatement ? lastStatement.getEnd() : factoryFunction.body.getEnd() - 1;
            try {
                for (var exports_1 = tslib_1.__values(exports), exports_1_1 = exports_1.next(); !exports_1_1.done; exports_1_1 = exports_1.next()) {
                    var e = exports_1_1.value;
                    var namedImport = importManager.generateNamedImport(e.fromModule, e.symbolName);
                    var importNamespace = namedImport.moduleImport ? namedImport.moduleImport.text + "." : '';
                    var exportStr = "\nexports." + e.asAlias + " = " + importNamespace + namedImport.symbol + ";";
                    output.appendRight(insertionPoint, exportStr);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (exports_1_1 && !exports_1_1.done && (_a = exports_1.return)) _a.call(exports_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        /**
         * Add the constants to the top of the UMD factory function.
         */
        UmdRenderingFormatter.prototype.addConstants = function (output, constants, file) {
            if (constants === '') {
                return;
            }
            var umdModule = this.umdHost.getUmdModule(file);
            if (!umdModule) {
                return;
            }
            var factoryFunction = umdModule.factoryFn;
            var firstStatement = factoryFunction.body.statements[0];
            var insertionPoint = firstStatement ? firstStatement.getStart() : factoryFunction.body.getStart() + 1;
            output.appendLeft(insertionPoint, '\n' + constants + '\n');
        };
        return UmdRenderingFormatter;
    }(esm5_rendering_formatter_1.Esm5RenderingFormatter));
    exports.UmdRenderingFormatter = UmdRenderingFormatter;
    /**
     * Add dependencies to the CommonJS part of the UMD wrapper function.
     */
    function renderCommonJsDependencies(output, wrapperFunction, imports) {
        var conditional = find(wrapperFunction.body.statements[0], isCommonJSConditional);
        if (!conditional) {
            return;
        }
        var factoryCall = conditional.whenTrue;
        var injectionPoint = factoryCall.arguments.length > 0 ?
            // Add extra dependencies before the first argument
            factoryCall.arguments[0].getFullStart() :
            // Backup one char to account for the closing parenthesis on the call
            factoryCall.getEnd() - 1;
        var importString = imports.map(function (i) { return "require('" + i.specifier + "')"; }).join(',');
        output.appendLeft(injectionPoint, importString + (factoryCall.arguments.length > 0 ? ',' : ''));
    }
    /**
     * Add dependencies to the AMD part of the UMD wrapper function.
     */
    function renderAmdDependencies(output, wrapperFunction, imports) {
        var conditional = find(wrapperFunction.body.statements[0], isAmdConditional);
        if (!conditional) {
            return;
        }
        var amdDefineCall = conditional.whenTrue;
        var importString = imports.map(function (i) { return "'" + i.specifier + "'"; }).join(',');
        // The dependency array (if it exists) is the second to last argument
        // `define(id?, dependencies?, factory);`
        var factoryIndex = amdDefineCall.arguments.length - 1;
        var dependencyArray = amdDefineCall.arguments[factoryIndex - 1];
        if (dependencyArray === undefined || !ts.isArrayLiteralExpression(dependencyArray)) {
            // No array provided: `define(factory)` or `define(id, factory)`.
            // Insert a new array in front the `factory` call.
            var injectionPoint = amdDefineCall.arguments[factoryIndex].getFullStart();
            output.appendLeft(injectionPoint, "[" + importString + "],");
        }
        else {
            // Already an array
            var injectionPoint = dependencyArray.elements.length > 0 ?
                // Add imports before the first item.
                dependencyArray.elements[0].getFullStart() :
                // Backup one char to account for the closing square bracket on the array
                dependencyArray.getEnd() - 1;
            output.appendLeft(injectionPoint, importString + (dependencyArray.elements.length > 0 ? ',' : ''));
        }
    }
    /**
     * Add dependencies to the global part of the UMD wrapper function.
     */
    function renderGlobalDependencies(output, wrapperFunction, imports) {
        var globalFactoryCall = find(wrapperFunction.body.statements[0], isGlobalFactoryCall);
        if (!globalFactoryCall) {
            return;
        }
        var injectionPoint = globalFactoryCall.arguments.length > 0 ?
            // Add extra dependencies before the first argument
            globalFactoryCall.arguments[0].getFullStart() :
            // Backup one char to account for the closing parenthesis on the call
            globalFactoryCall.getEnd() - 1;
        var importString = imports.map(function (i) { return "global." + getGlobalIdentifier(i); }).join(',');
        output.appendLeft(injectionPoint, importString + (globalFactoryCall.arguments.length > 0 ? ',' : ''));
    }
    /**
     * Add dependency parameters to the UMD factory function.
     */
    function renderFactoryParameters(output, wrapperFunction, imports) {
        var wrapperCall = wrapperFunction.parent;
        var secondArgument = wrapperCall.arguments[1];
        if (!secondArgument) {
            return;
        }
        // Be resilient to the factory being inside parentheses
        var factoryFunction = ts.isParenthesizedExpression(secondArgument) ? secondArgument.expression : secondArgument;
        if (!ts.isFunctionExpression(factoryFunction)) {
            return;
        }
        var parameters = factoryFunction.parameters;
        var parameterString = imports.map(function (i) { return i.qualifier.text; }).join(',');
        if (parameters.length > 0) {
            var injectionPoint = parameters[0].getFullStart();
            output.appendLeft(injectionPoint, parameterString + ',');
        }
        else {
            // If there are no parameters then the factory function will look like:
            // function () { ... }
            // The AST does not give us a way to find the insertion point - between the two parentheses.
            // So we must use a regular expression on the text of the function.
            var injectionPoint = factoryFunction.getStart() + factoryFunction.getText().indexOf('()') + 1;
            output.appendLeft(injectionPoint, parameterString);
        }
    }
    /**
     * Is this node the CommonJS conditional expression in the UMD wrapper?
     */
    function isCommonJSConditional(value) {
        if (!ts.isConditionalExpression(value)) {
            return false;
        }
        if (!ts.isBinaryExpression(value.condition) ||
            value.condition.operatorToken.kind !== ts.SyntaxKind.AmpersandAmpersandToken) {
            return false;
        }
        if (!oneOfBinaryConditions(value.condition, function (exp) { return isTypeOf(exp, 'exports', 'module'); })) {
            return false;
        }
        if (!ts.isCallExpression(value.whenTrue) || !ts.isIdentifier(value.whenTrue.expression)) {
            return false;
        }
        return value.whenTrue.expression.text === 'factory';
    }
    /**
     * Is this node the AMD conditional expression in the UMD wrapper?
     */
    function isAmdConditional(value) {
        if (!ts.isConditionalExpression(value)) {
            return false;
        }
        if (!ts.isBinaryExpression(value.condition) ||
            value.condition.operatorToken.kind !== ts.SyntaxKind.AmpersandAmpersandToken) {
            return false;
        }
        if (!oneOfBinaryConditions(value.condition, function (exp) { return isTypeOf(exp, 'define'); })) {
            return false;
        }
        if (!ts.isCallExpression(value.whenTrue) || !ts.isIdentifier(value.whenTrue.expression)) {
            return false;
        }
        return value.whenTrue.expression.text === 'define';
    }
    /**
     * Is this node the call to setup the global dependencies in the UMD wrapper?
     */
    function isGlobalFactoryCall(value) {
        if (ts.isCallExpression(value) && !!value.parent) {
            // Be resilient to the value being part of a comma list
            value = isCommaExpression(value.parent) ? value.parent : value;
            // Be resilient to the value being inside parentheses
            value = ts.isParenthesizedExpression(value.parent) ? value.parent : value;
            return !!value.parent && ts.isConditionalExpression(value.parent) &&
                value.parent.whenFalse === value;
        }
        else {
            return false;
        }
    }
    function isCommaExpression(value) {
        return ts.isBinaryExpression(value) && value.operatorToken.kind === ts.SyntaxKind.CommaToken;
    }
    /**
     * Compute a global identifier for the given import (`i`).
     *
     * The identifier used to access a package when using the "global" form of a UMD bundle usually
     * follows a special format where snake-case is conveted to camelCase and path separators are
     * converted to dots. In addition there are special cases such as `@angular` is mapped to `ng`.
     *
     * For example
     *
     * * `@ns/package/entry-point` => `ns.package.entryPoint`
     * * `@angular/common/testing` => `ng.common.testing`
     * * `@angular/platform-browser-dynamic` => `ng.platformBrowserDynamic`
     *
     * It is possible for packages to specify completely different identifiers for attaching the package
     * to the global, and so there is no guaranteed way to compute this.
     * Currently, this approach appears to work for the known scenarios; also it is not known how common
     * it is to use globals for importing packages.
     *
     * If it turns out that there are packages that are being used via globals, where this approach
     * fails, we should consider implementing a configuration based solution, similar to what would go
     * in a rollup configuration for mapping import paths to global indentifiers.
     */
    function getGlobalIdentifier(i) {
        return i.specifier.replace(/^@angular\//, 'ng.')
            .replace(/^@/, '')
            .replace(/\//g, '.')
            .replace(/[-_]+(.?)/g, function (_, c) { return c.toUpperCase(); })
            .replace(/^./, function (c) { return c.toLowerCase(); });
    }
    function find(node, test) {
        return test(node) ? node : node.forEachChild(function (child) { return find(child, test); });
    }
    function oneOfBinaryConditions(node, test) {
        return test(node.left) || test(node.right);
    }
    function isTypeOf(node) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        return ts.isBinaryExpression(node) && ts.isTypeOfExpression(node.left) &&
            ts.isIdentifier(node.left.expression) && types.indexOf(node.left.expression.text) !== -1;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW1kX3JlbmRlcmluZ19mb3JtYXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvcmVuZGVyaW5nL3VtZF9yZW5kZXJpbmdfZm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFRQSwrQkFBaUM7SUFRakMsOEdBQWtFO0lBQ2xFLHdFQUF1QztJQUt2Qzs7OztPQUlHO0lBQ0g7UUFBMkMsaURBQXNCO1FBQy9ELCtCQUFZLEVBQW9CLEVBQVksT0FBMEIsRUFBRSxNQUFlO1lBQXZGLFlBQ0Usa0JBQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsU0FDM0I7WUFGMkMsYUFBTyxHQUFQLE9BQU8sQ0FBbUI7O1FBRXRFLENBQUM7UUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQW1CRztRQUNNLDBDQUFVLEdBQW5CLFVBQW9CLE1BQW1CLEVBQUUsT0FBaUIsRUFBRSxJQUFtQjtZQUM3RSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN4QixPQUFPO2FBQ1I7WUFFRCxrREFBa0Q7WUFDbEQsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDZCxPQUFPO2FBQ1I7WUFFRCxJQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO1lBRTVDLG1GQUFtRjtZQUNuRiwwQkFBMEIsQ0FBQyxNQUFNLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzdELHFCQUFxQixDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDeEQsd0JBQXdCLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMzRCx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFRDs7V0FFRztRQUNNLDBDQUFVLEdBQW5CLFVBQ0ksTUFBbUIsRUFBRSxrQkFBMEIsRUFBRSxPQUFxQixFQUN0RSxhQUE0QixFQUFFLElBQW1CO1lBRnJELGlCQXNCQztZQW5CQyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNkLE9BQU87YUFDUjtZQUNELElBQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7WUFDNUMsSUFBTSxhQUFhLEdBQ2YsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hGLElBQU0sY0FBYyxHQUNoQixhQUFhLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDL0UsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7Z0JBQ2YsSUFBTSxRQUFRLEdBQUcsc0JBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hDLElBQU0sWUFBWSxHQUFHLElBQUksR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM1RixJQUFNLFdBQVcsR0FBRyxrQkFBa0IsS0FBSyxRQUFRLENBQUMsQ0FBQztvQkFDakQsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDL0QsRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFDLENBQUM7Z0JBQy9DLElBQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFJLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxNQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDNUYsSUFBTSxTQUFTLEdBQUcsZUFBYSxDQUFDLENBQUMsVUFBVSxXQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsTUFBTSxNQUFHLENBQUM7Z0JBQ3pGLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVRLGdEQUFnQixHQUF6QixVQUNJLE1BQW1CLEVBQUUsT0FBbUIsRUFBRSxhQUE0QixFQUN0RSxJQUFtQjs7WUFDckIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDZCxPQUFPO2FBQ1I7WUFDRCxJQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO1lBQzVDLElBQU0sYUFBYSxHQUNmLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNoRixJQUFNLGNBQWMsR0FDaEIsYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztnQkFDL0UsS0FBZ0IsSUFBQSxZQUFBLGlCQUFBLE9BQU8sQ0FBQSxnQ0FBQSxxREFBRTtvQkFBcEIsSUFBTSxDQUFDLG9CQUFBO29CQUNWLElBQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDbEYsSUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUksV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLE1BQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUM1RixJQUFNLFNBQVMsR0FBRyxlQUFhLENBQUMsQ0FBQyxPQUFPLFdBQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQyxNQUFNLE1BQUcsQ0FBQztvQkFDdEYsTUFBTSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQy9DOzs7Ozs7Ozs7UUFDSCxDQUFDO1FBRUQ7O1dBRUc7UUFDTSw0Q0FBWSxHQUFyQixVQUFzQixNQUFtQixFQUFFLFNBQWlCLEVBQUUsSUFBbUI7WUFDL0UsSUFBSSxTQUFTLEtBQUssRUFBRSxFQUFFO2dCQUNwQixPQUFPO2FBQ1I7WUFDRCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNkLE9BQU87YUFDUjtZQUNELElBQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7WUFDNUMsSUFBTSxjQUFjLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUQsSUFBTSxjQUFjLEdBQ2hCLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNyRixNQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxJQUFJLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzdELENBQUM7UUFDSCw0QkFBQztJQUFELENBQUMsQUE3R0QsQ0FBMkMsaURBQXNCLEdBNkdoRTtJQTdHWSxzREFBcUI7SUErR2xDOztPQUVHO0lBQ0gsU0FBUywwQkFBMEIsQ0FDL0IsTUFBbUIsRUFBRSxlQUFzQyxFQUFFLE9BQWlCO1FBQ2hGLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3BGLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsT0FBTztTQUNSO1FBQ0QsSUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUN6QyxJQUFNLGNBQWMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNyRCxtREFBbUQ7WUFDbkQsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLHFFQUFxRTtZQUNyRSxXQUFXLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxjQUFZLENBQUMsQ0FBQyxTQUFTLE9BQUksRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RSxNQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxZQUFZLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLHFCQUFxQixDQUMxQixNQUFtQixFQUFFLGVBQXNDLEVBQUUsT0FBaUI7UUFDaEYsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixPQUFPO1NBQ1I7UUFDRCxJQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQzNDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxNQUFJLENBQUMsQ0FBQyxTQUFTLE1BQUcsRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwRSxxRUFBcUU7UUFDckUseUNBQXlDO1FBQ3pDLElBQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUN4RCxJQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLGVBQWUsS0FBSyxTQUFTLElBQUksQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDbEYsaUVBQWlFO1lBQ2pFLGtEQUFrRDtZQUNsRCxJQUFNLGNBQWMsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLE1BQUksWUFBWSxPQUFJLENBQUMsQ0FBQztTQUN6RDthQUFNO1lBQ0wsbUJBQW1CO1lBQ25CLElBQU0sY0FBYyxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxxQ0FBcUM7Z0JBQ3JDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztnQkFDNUMseUVBQXlFO2dCQUN6RSxlQUFlLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxVQUFVLENBQ2IsY0FBYyxFQUFFLFlBQVksR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3RGO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsU0FBUyx3QkFBd0IsQ0FDN0IsTUFBbUIsRUFBRSxlQUFzQyxFQUFFLE9BQWlCO1FBQ2hGLElBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3RCLE9BQU87U0FDUjtRQUNELElBQU0sY0FBYyxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0QsbURBQW1EO1lBQ25ELGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLHFFQUFxRTtZQUNyRSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbkMsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFlBQVUsbUJBQW1CLENBQUMsQ0FBQyxDQUFHLEVBQWxDLENBQWtDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEYsTUFBTSxDQUFDLFVBQVUsQ0FDYixjQUFjLEVBQUUsWUFBWSxHQUFHLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLHVCQUF1QixDQUM1QixNQUFtQixFQUFFLGVBQXNDLEVBQUUsT0FBaUI7UUFDaEYsSUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLE1BQTJCLENBQUM7UUFDaEUsSUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ25CLE9BQU87U0FDUjtRQUVELHVEQUF1RDtRQUN2RCxJQUFNLGVBQWUsR0FDakIsRUFBRSxDQUFDLHlCQUF5QixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7UUFDOUYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUM3QyxPQUFPO1NBQ1I7UUFFRCxJQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsVUFBVSxDQUFDO1FBQzlDLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyRSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLElBQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwRCxNQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxlQUFlLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDMUQ7YUFBTTtZQUNMLHVFQUF1RTtZQUN2RSxzQkFBc0I7WUFDdEIsNEZBQTRGO1lBQzVGLG1FQUFtRTtZQUNuRSxJQUFNLGNBQWMsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLEdBQUcsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUM7U0FDcEQ7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLHFCQUFxQixDQUFDLEtBQWM7UUFDM0MsSUFBSSxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN0QyxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3ZDLEtBQUssQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLHVCQUF1QixFQUFFO1lBQ2hGLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxVQUFDLEdBQUcsSUFBSyxPQUFBLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxFQUFsQyxDQUFrQyxDQUFDLEVBQUU7WUFDeEYsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3ZGLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUM7SUFDdEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFjO1FBQ3RDLElBQUksQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDdEMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUN2QyxLQUFLLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRTtZQUNoRixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsVUFBQyxHQUFHLElBQUssT0FBQSxRQUFRLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxFQUF2QixDQUF1QixDQUFDLEVBQUU7WUFDN0UsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3ZGLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUM7SUFDckQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxLQUFjO1FBQ3pDLElBQUksRUFBRSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2hELHVEQUF1RDtZQUN2RCxLQUFLLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDL0QscURBQXFEO1lBQ3JELEtBQUssR0FBRyxFQUFFLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDMUUsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQkFDN0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDO1NBQ3RDO2FBQU07WUFDTCxPQUFPLEtBQUssQ0FBQztTQUNkO0lBQ0gsQ0FBQztJQUVELFNBQVMsaUJBQWlCLENBQUMsS0FBYztRQUN2QyxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztJQUMvRixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXFCRztJQUNILFNBQVMsbUJBQW1CLENBQUMsQ0FBUztRQUNwQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUM7YUFDM0MsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7YUFDakIsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7YUFDbkIsT0FBTyxDQUFDLFlBQVksRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQWYsQ0FBZSxDQUFDO2FBQ2hELE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQWYsQ0FBZSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELFNBQVMsSUFBSSxDQUFJLElBQWEsRUFBRSxJQUE0QztRQUMxRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsSUFBSSxDQUFJLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxTQUFTLHFCQUFxQixDQUMxQixJQUF5QixFQUFFLElBQTRDO1FBQ3pFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxTQUFTLFFBQVEsQ0FBQyxJQUFtQjtRQUFFLGVBQWtCO2FBQWxCLFVBQWtCLEVBQWxCLHFCQUFrQixFQUFsQixJQUFrQjtZQUFsQiw4QkFBa0I7O1FBQ3ZELE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xFLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQy9GLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCBNYWdpY1N0cmluZyBmcm9tICdtYWdpYy1zdHJpbmcnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7UGF0aE1hbmlwdWxhdGlvbn0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7UmVleHBvcnR9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9pbXBvcnRzJztcbmltcG9ydCB7SW1wb3J0LCBJbXBvcnRNYW5hZ2VyfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvdHJhbnNsYXRvcic7XG5pbXBvcnQge0V4cG9ydEluZm99IGZyb20gJy4uL2FuYWx5c2lzL3ByaXZhdGVfZGVjbGFyYXRpb25zX2FuYWx5emVyJztcbmltcG9ydCB7VW1kUmVmbGVjdGlvbkhvc3R9IGZyb20gJy4uL2hvc3QvdW1kX2hvc3QnO1xuXG5pbXBvcnQge0VzbTVSZW5kZXJpbmdGb3JtYXR0ZXJ9IGZyb20gJy4vZXNtNV9yZW5kZXJpbmdfZm9ybWF0dGVyJztcbmltcG9ydCB7c3RyaXBFeHRlbnNpb259IGZyb20gJy4vdXRpbHMnO1xuXG50eXBlIENvbW1vbkpzQ29uZGl0aW9uYWwgPSB0cy5Db25kaXRpb25hbEV4cHJlc3Npb24me3doZW5UcnVlOiB0cy5DYWxsRXhwcmVzc2lvbn07XG50eXBlIEFtZENvbmRpdGlvbmFsID0gdHMuQ29uZGl0aW9uYWxFeHByZXNzaW9uJnt3aGVuVHJ1ZTogdHMuQ2FsbEV4cHJlc3Npb259O1xuXG4vKipcbiAqIEEgUmVuZGVyaW5nRm9ybWF0dGVyIHRoYXQgd29ya3Mgd2l0aCBVTUQgZmlsZXMsIGluc3RlYWQgb2YgYGltcG9ydGAgYW5kIGBleHBvcnRgIHN0YXRlbWVudHNcbiAqIHRoZSBtb2R1bGUgaXMgYW4gSUlGRSB3aXRoIGEgZmFjdG9yeSBmdW5jdGlvbiBjYWxsIHdpdGggZGVwZW5kZW5jaWVzLCB3aGljaCBhcmUgZGVmaW5lZCBpbiBhXG4gKiB3cmFwcGVyIGZ1bmN0aW9uIGZvciBBTUQsIENvbW1vbkpTIGFuZCBnbG9iYWwgbW9kdWxlIGZvcm1hdHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBVbWRSZW5kZXJpbmdGb3JtYXR0ZXIgZXh0ZW5kcyBFc201UmVuZGVyaW5nRm9ybWF0dGVyIHtcbiAgY29uc3RydWN0b3IoZnM6IFBhdGhNYW5pcHVsYXRpb24sIHByb3RlY3RlZCB1bWRIb3N0OiBVbWRSZWZsZWN0aW9uSG9zdCwgaXNDb3JlOiBib29sZWFuKSB7XG4gICAgc3VwZXIoZnMsIHVtZEhvc3QsIGlzQ29yZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBpbXBvcnRzIHRvIHRoZSBVTUQgbW9kdWxlIElJRkUuXG4gICAqXG4gICAqIE5vdGUgdGhhdCBpbXBvcnRzIGF0IFwicHJlcGVuZGVkXCIgdG8gdGhlIHN0YXJ0IG9mIHRoZSBwYXJhbWV0ZXIgbGlzdCBvZiB0aGUgZmFjdG9yeSBmdW5jdGlvbixcbiAgICogYW5kIHNvIGFsc28gdG8gdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gaXQgd2hlbiBpdCBpcyBjYWxsZWQuXG4gICAqIFRoaXMgaXMgYmVjYXVzZSB0aGVyZSBhcmUgc2NlbmFyaW9zIHdoZXJlIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIGRvZXMgbm90IGFjY2VwdCBhcyBtYW55XG4gICAqIHBhcmFtZXRlcnMgYXMgYXJlIHBhc3NlZCBhcyBhcmd1bWVudCBpbiB0aGUgY2FsbC4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGBgYFxuICAgKiAoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgKiAgICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID9cbiAgICogICAgICAgICBmYWN0b3J5KGV4cG9ydHMscmVxdWlyZSgneCcpLHJlcXVpcmUoJ3onKSkgOlxuICAgKiAgICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID9cbiAgICogICAgICAgICBkZWZpbmUoWydleHBvcnRzJywgJ3gnLCAneiddLCBmYWN0b3J5KSA6XG4gICAqICAgICAoZ2xvYmFsID0gZ2xvYmFsIHx8IHNlbGYsIGZhY3RvcnkoZ2xvYmFsLm15QnVuZGxlID0ge30sIGdsb2JhbC54KSk7XG4gICAqIH0odGhpcywgKGZ1bmN0aW9uIChleHBvcnRzLCB4KSB7IC4uLiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiAoU2VlIHRoYXQgdGhlIGB6YCBpbXBvcnQgaXMgbm90IGJlaW5nIHVzZWQgYnkgdGhlIGZhY3RvcnkgZnVuY3Rpb24uKVxuICAgKi9cbiAgb3ZlcnJpZGUgYWRkSW1wb3J0cyhvdXRwdXQ6IE1hZ2ljU3RyaW5nLCBpbXBvcnRzOiBJbXBvcnRbXSwgZmlsZTogdHMuU291cmNlRmlsZSk6IHZvaWQge1xuICAgIGlmIChpbXBvcnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFzc3VtZSB0aGVyZSBpcyBvbmx5IG9uZSBVTUQgbW9kdWxlIGluIHRoZSBmaWxlXG4gICAgY29uc3QgdW1kTW9kdWxlID0gdGhpcy51bWRIb3N0LmdldFVtZE1vZHVsZShmaWxlKTtcbiAgICBpZiAoIXVtZE1vZHVsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdyYXBwZXJGdW5jdGlvbiA9IHVtZE1vZHVsZS53cmFwcGVyRm47XG5cbiAgICAvLyBXZSBuZWVkIHRvIGFkZCBuZXcgYHJlcXVpcmUoKWAgY2FsbHMgZm9yIGVhY2ggaW1wb3J0IGluIHRoZSBDb21tb25KUyBpbml0aWFsaXplclxuICAgIHJlbmRlckNvbW1vbkpzRGVwZW5kZW5jaWVzKG91dHB1dCwgd3JhcHBlckZ1bmN0aW9uLCBpbXBvcnRzKTtcbiAgICByZW5kZXJBbWREZXBlbmRlbmNpZXMob3V0cHV0LCB3cmFwcGVyRnVuY3Rpb24sIGltcG9ydHMpO1xuICAgIHJlbmRlckdsb2JhbERlcGVuZGVuY2llcyhvdXRwdXQsIHdyYXBwZXJGdW5jdGlvbiwgaW1wb3J0cyk7XG4gICAgcmVuZGVyRmFjdG9yeVBhcmFtZXRlcnMob3V0cHV0LCB3cmFwcGVyRnVuY3Rpb24sIGltcG9ydHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgZXhwb3J0cyB0byB0aGUgYm90dG9tIG9mIHRoZSBVTUQgbW9kdWxlIGZhY3RvcnkgZnVuY3Rpb24uXG4gICAqL1xuICBvdmVycmlkZSBhZGRFeHBvcnRzKFxuICAgICAgb3V0cHV0OiBNYWdpY1N0cmluZywgZW50cnlQb2ludEJhc2VQYXRoOiBzdHJpbmcsIGV4cG9ydHM6IEV4cG9ydEluZm9bXSxcbiAgICAgIGltcG9ydE1hbmFnZXI6IEltcG9ydE1hbmFnZXIsIGZpbGU6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICBjb25zdCB1bWRNb2R1bGUgPSB0aGlzLnVtZEhvc3QuZ2V0VW1kTW9kdWxlKGZpbGUpO1xuICAgIGlmICghdW1kTW9kdWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGZhY3RvcnlGdW5jdGlvbiA9IHVtZE1vZHVsZS5mYWN0b3J5Rm47XG4gICAgY29uc3QgbGFzdFN0YXRlbWVudCA9XG4gICAgICAgIGZhY3RvcnlGdW5jdGlvbi5ib2R5LnN0YXRlbWVudHNbZmFjdG9yeUZ1bmN0aW9uLmJvZHkuc3RhdGVtZW50cy5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBpbnNlcnRpb25Qb2ludCA9XG4gICAgICAgIGxhc3RTdGF0ZW1lbnQgPyBsYXN0U3RhdGVtZW50LmdldEVuZCgpIDogZmFjdG9yeUZ1bmN0aW9uLmJvZHkuZ2V0RW5kKCkgLSAxO1xuICAgIGV4cG9ydHMuZm9yRWFjaChlID0+IHtcbiAgICAgIGNvbnN0IGJhc2VQYXRoID0gc3RyaXBFeHRlbnNpb24oZS5mcm9tKTtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9ICcuLycgKyB0aGlzLmZzLnJlbGF0aXZlKHRoaXMuZnMuZGlybmFtZShlbnRyeVBvaW50QmFzZVBhdGgpLCBiYXNlUGF0aCk7XG4gICAgICBjb25zdCBuYW1lZEltcG9ydCA9IGVudHJ5UG9pbnRCYXNlUGF0aCAhPT0gYmFzZVBhdGggP1xuICAgICAgICAgIGltcG9ydE1hbmFnZXIuZ2VuZXJhdGVOYW1lZEltcG9ydChyZWxhdGl2ZVBhdGgsIGUuaWRlbnRpZmllcikgOlxuICAgICAgICAgIHtzeW1ib2w6IGUuaWRlbnRpZmllciwgbW9kdWxlSW1wb3J0OiBudWxsfTtcbiAgICAgIGNvbnN0IGltcG9ydE5hbWVzcGFjZSA9IG5hbWVkSW1wb3J0Lm1vZHVsZUltcG9ydCA/IGAke25hbWVkSW1wb3J0Lm1vZHVsZUltcG9ydC50ZXh0fS5gIDogJyc7XG4gICAgICBjb25zdCBleHBvcnRTdHIgPSBgXFxuZXhwb3J0cy4ke2UuaWRlbnRpZmllcn0gPSAke2ltcG9ydE5hbWVzcGFjZX0ke25hbWVkSW1wb3J0LnN5bWJvbH07YDtcbiAgICAgIG91dHB1dC5hcHBlbmRSaWdodChpbnNlcnRpb25Qb2ludCwgZXhwb3J0U3RyKTtcbiAgICB9KTtcbiAgfVxuXG4gIG92ZXJyaWRlIGFkZERpcmVjdEV4cG9ydHMoXG4gICAgICBvdXRwdXQ6IE1hZ2ljU3RyaW5nLCBleHBvcnRzOiBSZWV4cG9ydFtdLCBpbXBvcnRNYW5hZ2VyOiBJbXBvcnRNYW5hZ2VyLFxuICAgICAgZmlsZTogdHMuU291cmNlRmlsZSk6IHZvaWQge1xuICAgIGNvbnN0IHVtZE1vZHVsZSA9IHRoaXMudW1kSG9zdC5nZXRVbWRNb2R1bGUoZmlsZSk7XG4gICAgaWYgKCF1bWRNb2R1bGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZmFjdG9yeUZ1bmN0aW9uID0gdW1kTW9kdWxlLmZhY3RvcnlGbjtcbiAgICBjb25zdCBsYXN0U3RhdGVtZW50ID1cbiAgICAgICAgZmFjdG9yeUZ1bmN0aW9uLmJvZHkuc3RhdGVtZW50c1tmYWN0b3J5RnVuY3Rpb24uYm9keS5zdGF0ZW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IGluc2VydGlvblBvaW50ID1cbiAgICAgICAgbGFzdFN0YXRlbWVudCA/IGxhc3RTdGF0ZW1lbnQuZ2V0RW5kKCkgOiBmYWN0b3J5RnVuY3Rpb24uYm9keS5nZXRFbmQoKSAtIDE7XG4gICAgZm9yIChjb25zdCBlIG9mIGV4cG9ydHMpIHtcbiAgICAgIGNvbnN0IG5hbWVkSW1wb3J0ID0gaW1wb3J0TWFuYWdlci5nZW5lcmF0ZU5hbWVkSW1wb3J0KGUuZnJvbU1vZHVsZSwgZS5zeW1ib2xOYW1lKTtcbiAgICAgIGNvbnN0IGltcG9ydE5hbWVzcGFjZSA9IG5hbWVkSW1wb3J0Lm1vZHVsZUltcG9ydCA/IGAke25hbWVkSW1wb3J0Lm1vZHVsZUltcG9ydC50ZXh0fS5gIDogJyc7XG4gICAgICBjb25zdCBleHBvcnRTdHIgPSBgXFxuZXhwb3J0cy4ke2UuYXNBbGlhc30gPSAke2ltcG9ydE5hbWVzcGFjZX0ke25hbWVkSW1wb3J0LnN5bWJvbH07YDtcbiAgICAgIG91dHB1dC5hcHBlbmRSaWdodChpbnNlcnRpb25Qb2ludCwgZXhwb3J0U3RyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBjb25zdGFudHMgdG8gdGhlIHRvcCBvZiB0aGUgVU1EIGZhY3RvcnkgZnVuY3Rpb24uXG4gICAqL1xuICBvdmVycmlkZSBhZGRDb25zdGFudHMob3V0cHV0OiBNYWdpY1N0cmluZywgY29uc3RhbnRzOiBzdHJpbmcsIGZpbGU6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICBpZiAoY29uc3RhbnRzID09PSAnJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB1bWRNb2R1bGUgPSB0aGlzLnVtZEhvc3QuZ2V0VW1kTW9kdWxlKGZpbGUpO1xuICAgIGlmICghdW1kTW9kdWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGZhY3RvcnlGdW5jdGlvbiA9IHVtZE1vZHVsZS5mYWN0b3J5Rm47XG4gICAgY29uc3QgZmlyc3RTdGF0ZW1lbnQgPSBmYWN0b3J5RnVuY3Rpb24uYm9keS5zdGF0ZW1lbnRzWzBdO1xuICAgIGNvbnN0IGluc2VydGlvblBvaW50ID1cbiAgICAgICAgZmlyc3RTdGF0ZW1lbnQgPyBmaXJzdFN0YXRlbWVudC5nZXRTdGFydCgpIDogZmFjdG9yeUZ1bmN0aW9uLmJvZHkuZ2V0U3RhcnQoKSArIDE7XG4gICAgb3V0cHV0LmFwcGVuZExlZnQoaW5zZXJ0aW9uUG9pbnQsICdcXG4nICsgY29uc3RhbnRzICsgJ1xcbicpO1xuICB9XG59XG5cbi8qKlxuICogQWRkIGRlcGVuZGVuY2llcyB0byB0aGUgQ29tbW9uSlMgcGFydCBvZiB0aGUgVU1EIHdyYXBwZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHJlbmRlckNvbW1vbkpzRGVwZW5kZW5jaWVzKFxuICAgIG91dHB1dDogTWFnaWNTdHJpbmcsIHdyYXBwZXJGdW5jdGlvbjogdHMuRnVuY3Rpb25FeHByZXNzaW9uLCBpbXBvcnRzOiBJbXBvcnRbXSkge1xuICBjb25zdCBjb25kaXRpb25hbCA9IGZpbmQod3JhcHBlckZ1bmN0aW9uLmJvZHkuc3RhdGVtZW50c1swXSwgaXNDb21tb25KU0NvbmRpdGlvbmFsKTtcbiAgaWYgKCFjb25kaXRpb25hbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBmYWN0b3J5Q2FsbCA9IGNvbmRpdGlvbmFsLndoZW5UcnVlO1xuICBjb25zdCBpbmplY3Rpb25Qb2ludCA9IGZhY3RvcnlDYWxsLmFyZ3VtZW50cy5sZW5ndGggPiAwID9cbiAgICAgIC8vIEFkZCBleHRyYSBkZXBlbmRlbmNpZXMgYmVmb3JlIHRoZSBmaXJzdCBhcmd1bWVudFxuICAgICAgZmFjdG9yeUNhbGwuYXJndW1lbnRzWzBdLmdldEZ1bGxTdGFydCgpIDpcbiAgICAgIC8vIEJhY2t1cCBvbmUgY2hhciB0byBhY2NvdW50IGZvciB0aGUgY2xvc2luZyBwYXJlbnRoZXNpcyBvbiB0aGUgY2FsbFxuICAgICAgZmFjdG9yeUNhbGwuZ2V0RW5kKCkgLSAxO1xuICBjb25zdCBpbXBvcnRTdHJpbmcgPSBpbXBvcnRzLm1hcChpID0+IGByZXF1aXJlKCcke2kuc3BlY2lmaWVyfScpYCkuam9pbignLCcpO1xuICBvdXRwdXQuYXBwZW5kTGVmdChpbmplY3Rpb25Qb2ludCwgaW1wb3J0U3RyaW5nICsgKGZhY3RvcnlDYWxsLmFyZ3VtZW50cy5sZW5ndGggPiAwID8gJywnIDogJycpKTtcbn1cblxuLyoqXG4gKiBBZGQgZGVwZW5kZW5jaWVzIHRvIHRoZSBBTUQgcGFydCBvZiB0aGUgVU1EIHdyYXBwZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHJlbmRlckFtZERlcGVuZGVuY2llcyhcbiAgICBvdXRwdXQ6IE1hZ2ljU3RyaW5nLCB3cmFwcGVyRnVuY3Rpb246IHRzLkZ1bmN0aW9uRXhwcmVzc2lvbiwgaW1wb3J0czogSW1wb3J0W10pIHtcbiAgY29uc3QgY29uZGl0aW9uYWwgPSBmaW5kKHdyYXBwZXJGdW5jdGlvbi5ib2R5LnN0YXRlbWVudHNbMF0sIGlzQW1kQ29uZGl0aW9uYWwpO1xuICBpZiAoIWNvbmRpdGlvbmFsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGFtZERlZmluZUNhbGwgPSBjb25kaXRpb25hbC53aGVuVHJ1ZTtcbiAgY29uc3QgaW1wb3J0U3RyaW5nID0gaW1wb3J0cy5tYXAoaSA9PiBgJyR7aS5zcGVjaWZpZXJ9J2ApLmpvaW4oJywnKTtcbiAgLy8gVGhlIGRlcGVuZGVuY3kgYXJyYXkgKGlmIGl0IGV4aXN0cykgaXMgdGhlIHNlY29uZCB0byBsYXN0IGFyZ3VtZW50XG4gIC8vIGBkZWZpbmUoaWQ/LCBkZXBlbmRlbmNpZXM/LCBmYWN0b3J5KTtgXG4gIGNvbnN0IGZhY3RvcnlJbmRleCA9IGFtZERlZmluZUNhbGwuYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIGNvbnN0IGRlcGVuZGVuY3lBcnJheSA9IGFtZERlZmluZUNhbGwuYXJndW1lbnRzW2ZhY3RvcnlJbmRleCAtIDFdO1xuICBpZiAoZGVwZW5kZW5jeUFycmF5ID09PSB1bmRlZmluZWQgfHwgIXRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihkZXBlbmRlbmN5QXJyYXkpKSB7XG4gICAgLy8gTm8gYXJyYXkgcHJvdmlkZWQ6IGBkZWZpbmUoZmFjdG9yeSlgIG9yIGBkZWZpbmUoaWQsIGZhY3RvcnkpYC5cbiAgICAvLyBJbnNlcnQgYSBuZXcgYXJyYXkgaW4gZnJvbnQgdGhlIGBmYWN0b3J5YCBjYWxsLlxuICAgIGNvbnN0IGluamVjdGlvblBvaW50ID0gYW1kRGVmaW5lQ2FsbC5hcmd1bWVudHNbZmFjdG9yeUluZGV4XS5nZXRGdWxsU3RhcnQoKTtcbiAgICBvdXRwdXQuYXBwZW5kTGVmdChpbmplY3Rpb25Qb2ludCwgYFske2ltcG9ydFN0cmluZ31dLGApO1xuICB9IGVsc2Uge1xuICAgIC8vIEFscmVhZHkgYW4gYXJyYXlcbiAgICBjb25zdCBpbmplY3Rpb25Qb2ludCA9IGRlcGVuZGVuY3lBcnJheS5lbGVtZW50cy5sZW5ndGggPiAwID9cbiAgICAgICAgLy8gQWRkIGltcG9ydHMgYmVmb3JlIHRoZSBmaXJzdCBpdGVtLlxuICAgICAgICBkZXBlbmRlbmN5QXJyYXkuZWxlbWVudHNbMF0uZ2V0RnVsbFN0YXJ0KCkgOlxuICAgICAgICAvLyBCYWNrdXAgb25lIGNoYXIgdG8gYWNjb3VudCBmb3IgdGhlIGNsb3Npbmcgc3F1YXJlIGJyYWNrZXQgb24gdGhlIGFycmF5XG4gICAgICAgIGRlcGVuZGVuY3lBcnJheS5nZXRFbmQoKSAtIDE7XG4gICAgb3V0cHV0LmFwcGVuZExlZnQoXG4gICAgICAgIGluamVjdGlvblBvaW50LCBpbXBvcnRTdHJpbmcgKyAoZGVwZW5kZW5jeUFycmF5LmVsZW1lbnRzLmxlbmd0aCA+IDAgPyAnLCcgOiAnJykpO1xuICB9XG59XG5cbi8qKlxuICogQWRkIGRlcGVuZGVuY2llcyB0byB0aGUgZ2xvYmFsIHBhcnQgb2YgdGhlIFVNRCB3cmFwcGVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiByZW5kZXJHbG9iYWxEZXBlbmRlbmNpZXMoXG4gICAgb3V0cHV0OiBNYWdpY1N0cmluZywgd3JhcHBlckZ1bmN0aW9uOiB0cy5GdW5jdGlvbkV4cHJlc3Npb24sIGltcG9ydHM6IEltcG9ydFtdKSB7XG4gIGNvbnN0IGdsb2JhbEZhY3RvcnlDYWxsID0gZmluZCh3cmFwcGVyRnVuY3Rpb24uYm9keS5zdGF0ZW1lbnRzWzBdLCBpc0dsb2JhbEZhY3RvcnlDYWxsKTtcbiAgaWYgKCFnbG9iYWxGYWN0b3J5Q2FsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBpbmplY3Rpb25Qb2ludCA9IGdsb2JhbEZhY3RvcnlDYWxsLmFyZ3VtZW50cy5sZW5ndGggPiAwID9cbiAgICAgIC8vIEFkZCBleHRyYSBkZXBlbmRlbmNpZXMgYmVmb3JlIHRoZSBmaXJzdCBhcmd1bWVudFxuICAgICAgZ2xvYmFsRmFjdG9yeUNhbGwuYXJndW1lbnRzWzBdLmdldEZ1bGxTdGFydCgpIDpcbiAgICAgIC8vIEJhY2t1cCBvbmUgY2hhciB0byBhY2NvdW50IGZvciB0aGUgY2xvc2luZyBwYXJlbnRoZXNpcyBvbiB0aGUgY2FsbFxuICAgICAgZ2xvYmFsRmFjdG9yeUNhbGwuZ2V0RW5kKCkgLSAxO1xuICBjb25zdCBpbXBvcnRTdHJpbmcgPSBpbXBvcnRzLm1hcChpID0+IGBnbG9iYWwuJHtnZXRHbG9iYWxJZGVudGlmaWVyKGkpfWApLmpvaW4oJywnKTtcbiAgb3V0cHV0LmFwcGVuZExlZnQoXG4gICAgICBpbmplY3Rpb25Qb2ludCwgaW1wb3J0U3RyaW5nICsgKGdsb2JhbEZhY3RvcnlDYWxsLmFyZ3VtZW50cy5sZW5ndGggPiAwID8gJywnIDogJycpKTtcbn1cblxuLyoqXG4gKiBBZGQgZGVwZW5kZW5jeSBwYXJhbWV0ZXJzIHRvIHRoZSBVTUQgZmFjdG9yeSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyRmFjdG9yeVBhcmFtZXRlcnMoXG4gICAgb3V0cHV0OiBNYWdpY1N0cmluZywgd3JhcHBlckZ1bmN0aW9uOiB0cy5GdW5jdGlvbkV4cHJlc3Npb24sIGltcG9ydHM6IEltcG9ydFtdKSB7XG4gIGNvbnN0IHdyYXBwZXJDYWxsID0gd3JhcHBlckZ1bmN0aW9uLnBhcmVudCBhcyB0cy5DYWxsRXhwcmVzc2lvbjtcbiAgY29uc3Qgc2Vjb25kQXJndW1lbnQgPSB3cmFwcGVyQ2FsbC5hcmd1bWVudHNbMV07XG4gIGlmICghc2Vjb25kQXJndW1lbnQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBCZSByZXNpbGllbnQgdG8gdGhlIGZhY3RvcnkgYmVpbmcgaW5zaWRlIHBhcmVudGhlc2VzXG4gIGNvbnN0IGZhY3RvcnlGdW5jdGlvbiA9XG4gICAgICB0cy5pc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uKHNlY29uZEFyZ3VtZW50KSA/IHNlY29uZEFyZ3VtZW50LmV4cHJlc3Npb24gOiBzZWNvbmRBcmd1bWVudDtcbiAgaWYgKCF0cy5pc0Z1bmN0aW9uRXhwcmVzc2lvbihmYWN0b3J5RnVuY3Rpb24pKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcGFyYW1ldGVycyA9IGZhY3RvcnlGdW5jdGlvbi5wYXJhbWV0ZXJzO1xuICBjb25zdCBwYXJhbWV0ZXJTdHJpbmcgPSBpbXBvcnRzLm1hcChpID0+IGkucXVhbGlmaWVyLnRleHQpLmpvaW4oJywnKTtcbiAgaWYgKHBhcmFtZXRlcnMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGluamVjdGlvblBvaW50ID0gcGFyYW1ldGVyc1swXS5nZXRGdWxsU3RhcnQoKTtcbiAgICBvdXRwdXQuYXBwZW5kTGVmdChpbmplY3Rpb25Qb2ludCwgcGFyYW1ldGVyU3RyaW5nICsgJywnKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gcGFyYW1ldGVycyB0aGVuIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIHdpbGwgbG9vayBsaWtlOlxuICAgIC8vIGZ1bmN0aW9uICgpIHsgLi4uIH1cbiAgICAvLyBUaGUgQVNUIGRvZXMgbm90IGdpdmUgdXMgYSB3YXkgdG8gZmluZCB0aGUgaW5zZXJ0aW9uIHBvaW50IC0gYmV0d2VlbiB0aGUgdHdvIHBhcmVudGhlc2VzLlxuICAgIC8vIFNvIHdlIG11c3QgdXNlIGEgcmVndWxhciBleHByZXNzaW9uIG9uIHRoZSB0ZXh0IG9mIHRoZSBmdW5jdGlvbi5cbiAgICBjb25zdCBpbmplY3Rpb25Qb2ludCA9IGZhY3RvcnlGdW5jdGlvbi5nZXRTdGFydCgpICsgZmFjdG9yeUZ1bmN0aW9uLmdldFRleHQoKS5pbmRleE9mKCcoKScpICsgMTtcbiAgICBvdXRwdXQuYXBwZW5kTGVmdChpbmplY3Rpb25Qb2ludCwgcGFyYW1ldGVyU3RyaW5nKTtcbiAgfVxufVxuXG4vKipcbiAqIElzIHRoaXMgbm9kZSB0aGUgQ29tbW9uSlMgY29uZGl0aW9uYWwgZXhwcmVzc2lvbiBpbiB0aGUgVU1EIHdyYXBwZXI/XG4gKi9cbmZ1bmN0aW9uIGlzQ29tbW9uSlNDb25kaXRpb25hbCh2YWx1ZTogdHMuTm9kZSk6IHZhbHVlIGlzIENvbW1vbkpzQ29uZGl0aW9uYWwge1xuICBpZiAoIXRzLmlzQ29uZGl0aW9uYWxFeHByZXNzaW9uKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIXRzLmlzQmluYXJ5RXhwcmVzc2lvbih2YWx1ZS5jb25kaXRpb24pIHx8XG4gICAgICB2YWx1ZS5jb25kaXRpb24ub3BlcmF0b3JUb2tlbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLkFtcGVyc2FuZEFtcGVyc2FuZFRva2VuKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICghb25lT2ZCaW5hcnlDb25kaXRpb25zKHZhbHVlLmNvbmRpdGlvbiwgKGV4cCkgPT4gaXNUeXBlT2YoZXhwLCAnZXhwb3J0cycsICdtb2R1bGUnKSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCF0cy5pc0NhbGxFeHByZXNzaW9uKHZhbHVlLndoZW5UcnVlKSB8fCAhdHMuaXNJZGVudGlmaWVyKHZhbHVlLndoZW5UcnVlLmV4cHJlc3Npb24pKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB2YWx1ZS53aGVuVHJ1ZS5leHByZXNzaW9uLnRleHQgPT09ICdmYWN0b3J5Jztcbn1cblxuLyoqXG4gKiBJcyB0aGlzIG5vZGUgdGhlIEFNRCBjb25kaXRpb25hbCBleHByZXNzaW9uIGluIHRoZSBVTUQgd3JhcHBlcj9cbiAqL1xuZnVuY3Rpb24gaXNBbWRDb25kaXRpb25hbCh2YWx1ZTogdHMuTm9kZSk6IHZhbHVlIGlzIEFtZENvbmRpdGlvbmFsIHtcbiAgaWYgKCF0cy5pc0NvbmRpdGlvbmFsRXhwcmVzc2lvbih2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCF0cy5pc0JpbmFyeUV4cHJlc3Npb24odmFsdWUuY29uZGl0aW9uKSB8fFxuICAgICAgdmFsdWUuY29uZGl0aW9uLm9wZXJhdG9yVG9rZW4ua2luZCAhPT0gdHMuU3ludGF4S2luZC5BbXBlcnNhbmRBbXBlcnNhbmRUb2tlbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIW9uZU9mQmluYXJ5Q29uZGl0aW9ucyh2YWx1ZS5jb25kaXRpb24sIChleHApID0+IGlzVHlwZU9mKGV4cCwgJ2RlZmluZScpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIXRzLmlzQ2FsbEV4cHJlc3Npb24odmFsdWUud2hlblRydWUpIHx8ICF0cy5pc0lkZW50aWZpZXIodmFsdWUud2hlblRydWUuZXhwcmVzc2lvbikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHZhbHVlLndoZW5UcnVlLmV4cHJlc3Npb24udGV4dCA9PT0gJ2RlZmluZSc7XG59XG5cbi8qKlxuICogSXMgdGhpcyBub2RlIHRoZSBjYWxsIHRvIHNldHVwIHRoZSBnbG9iYWwgZGVwZW5kZW5jaWVzIGluIHRoZSBVTUQgd3JhcHBlcj9cbiAqL1xuZnVuY3Rpb24gaXNHbG9iYWxGYWN0b3J5Q2FsbCh2YWx1ZTogdHMuTm9kZSk6IHZhbHVlIGlzIHRzLkNhbGxFeHByZXNzaW9uIHtcbiAgaWYgKHRzLmlzQ2FsbEV4cHJlc3Npb24odmFsdWUpICYmICEhdmFsdWUucGFyZW50KSB7XG4gICAgLy8gQmUgcmVzaWxpZW50IHRvIHRoZSB2YWx1ZSBiZWluZyBwYXJ0IG9mIGEgY29tbWEgbGlzdFxuICAgIHZhbHVlID0gaXNDb21tYUV4cHJlc3Npb24odmFsdWUucGFyZW50KSA/IHZhbHVlLnBhcmVudCA6IHZhbHVlO1xuICAgIC8vIEJlIHJlc2lsaWVudCB0byB0aGUgdmFsdWUgYmVpbmcgaW5zaWRlIHBhcmVudGhlc2VzXG4gICAgdmFsdWUgPSB0cy5pc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uKHZhbHVlLnBhcmVudCkgPyB2YWx1ZS5wYXJlbnQgOiB2YWx1ZTtcbiAgICByZXR1cm4gISF2YWx1ZS5wYXJlbnQgJiYgdHMuaXNDb25kaXRpb25hbEV4cHJlc3Npb24odmFsdWUucGFyZW50KSAmJlxuICAgICAgICB2YWx1ZS5wYXJlbnQud2hlbkZhbHNlID09PSB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNDb21tYUV4cHJlc3Npb24odmFsdWU6IHRzLk5vZGUpOiB2YWx1ZSBpcyB0cy5CaW5hcnlFeHByZXNzaW9uIHtcbiAgcmV0dXJuIHRzLmlzQmluYXJ5RXhwcmVzc2lvbih2YWx1ZSkgJiYgdmFsdWUub3BlcmF0b3JUb2tlbi5raW5kID09PSB0cy5TeW50YXhLaW5kLkNvbW1hVG9rZW47XG59XG5cbi8qKlxuICogQ29tcHV0ZSBhIGdsb2JhbCBpZGVudGlmaWVyIGZvciB0aGUgZ2l2ZW4gaW1wb3J0IChgaWApLlxuICpcbiAqIFRoZSBpZGVudGlmaWVyIHVzZWQgdG8gYWNjZXNzIGEgcGFja2FnZSB3aGVuIHVzaW5nIHRoZSBcImdsb2JhbFwiIGZvcm0gb2YgYSBVTUQgYnVuZGxlIHVzdWFsbHlcbiAqIGZvbGxvd3MgYSBzcGVjaWFsIGZvcm1hdCB3aGVyZSBzbmFrZS1jYXNlIGlzIGNvbnZldGVkIHRvIGNhbWVsQ2FzZSBhbmQgcGF0aCBzZXBhcmF0b3JzIGFyZVxuICogY29udmVydGVkIHRvIGRvdHMuIEluIGFkZGl0aW9uIHRoZXJlIGFyZSBzcGVjaWFsIGNhc2VzIHN1Y2ggYXMgYEBhbmd1bGFyYCBpcyBtYXBwZWQgdG8gYG5nYC5cbiAqXG4gKiBGb3IgZXhhbXBsZVxuICpcbiAqICogYEBucy9wYWNrYWdlL2VudHJ5LXBvaW50YCA9PiBgbnMucGFja2FnZS5lbnRyeVBvaW50YFxuICogKiBgQGFuZ3VsYXIvY29tbW9uL3Rlc3RpbmdgID0+IGBuZy5jb21tb24udGVzdGluZ2BcbiAqICogYEBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXItZHluYW1pY2AgPT4gYG5nLnBsYXRmb3JtQnJvd3NlckR5bmFtaWNgXG4gKlxuICogSXQgaXMgcG9zc2libGUgZm9yIHBhY2thZ2VzIHRvIHNwZWNpZnkgY29tcGxldGVseSBkaWZmZXJlbnQgaWRlbnRpZmllcnMgZm9yIGF0dGFjaGluZyB0aGUgcGFja2FnZVxuICogdG8gdGhlIGdsb2JhbCwgYW5kIHNvIHRoZXJlIGlzIG5vIGd1YXJhbnRlZWQgd2F5IHRvIGNvbXB1dGUgdGhpcy5cbiAqIEN1cnJlbnRseSwgdGhpcyBhcHByb2FjaCBhcHBlYXJzIHRvIHdvcmsgZm9yIHRoZSBrbm93biBzY2VuYXJpb3M7IGFsc28gaXQgaXMgbm90IGtub3duIGhvdyBjb21tb25cbiAqIGl0IGlzIHRvIHVzZSBnbG9iYWxzIGZvciBpbXBvcnRpbmcgcGFja2FnZXMuXG4gKlxuICogSWYgaXQgdHVybnMgb3V0IHRoYXQgdGhlcmUgYXJlIHBhY2thZ2VzIHRoYXQgYXJlIGJlaW5nIHVzZWQgdmlhIGdsb2JhbHMsIHdoZXJlIHRoaXMgYXBwcm9hY2hcbiAqIGZhaWxzLCB3ZSBzaG91bGQgY29uc2lkZXIgaW1wbGVtZW50aW5nIGEgY29uZmlndXJhdGlvbiBiYXNlZCBzb2x1dGlvbiwgc2ltaWxhciB0byB3aGF0IHdvdWxkIGdvXG4gKiBpbiBhIHJvbGx1cCBjb25maWd1cmF0aW9uIGZvciBtYXBwaW5nIGltcG9ydCBwYXRocyB0byBnbG9iYWwgaW5kZW50aWZpZXJzLlxuICovXG5mdW5jdGlvbiBnZXRHbG9iYWxJZGVudGlmaWVyKGk6IEltcG9ydCk6IHN0cmluZyB7XG4gIHJldHVybiBpLnNwZWNpZmllci5yZXBsYWNlKC9eQGFuZ3VsYXJcXC8vLCAnbmcuJylcbiAgICAgIC5yZXBsYWNlKC9eQC8sICcnKVxuICAgICAgLnJlcGxhY2UoL1xcLy9nLCAnLicpXG4gICAgICAucmVwbGFjZSgvWy1fXSsoLj8pL2csIChfLCBjKSA9PiBjLnRvVXBwZXJDYXNlKCkpXG4gICAgICAucmVwbGFjZSgvXi4vLCBjID0+IGMudG9Mb3dlckNhc2UoKSk7XG59XG5cbmZ1bmN0aW9uIGZpbmQ8VD4obm9kZTogdHMuTm9kZSwgdGVzdDogKG5vZGU6IHRzLk5vZGUpID0+IG5vZGUgaXMgdHMuTm9kZSAmIFQpOiBUfHVuZGVmaW5lZCB7XG4gIHJldHVybiB0ZXN0KG5vZGUpID8gbm9kZSA6IG5vZGUuZm9yRWFjaENoaWxkKGNoaWxkID0+IGZpbmQ8VD4oY2hpbGQsIHRlc3QpKTtcbn1cblxuZnVuY3Rpb24gb25lT2ZCaW5hcnlDb25kaXRpb25zKFxuICAgIG5vZGU6IHRzLkJpbmFyeUV4cHJlc3Npb24sIHRlc3Q6IChleHByZXNzaW9uOiB0cy5FeHByZXNzaW9uKSA9PiBib29sZWFuKSB7XG4gIHJldHVybiB0ZXN0KG5vZGUubGVmdCkgfHwgdGVzdChub2RlLnJpZ2h0KTtcbn1cblxuZnVuY3Rpb24gaXNUeXBlT2Yobm9kZTogdHMuRXhwcmVzc2lvbiwgLi4udHlwZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIHJldHVybiB0cy5pc0JpbmFyeUV4cHJlc3Npb24obm9kZSkgJiYgdHMuaXNUeXBlT2ZFeHByZXNzaW9uKG5vZGUubGVmdCkgJiZcbiAgICAgIHRzLmlzSWRlbnRpZmllcihub2RlLmxlZnQuZXhwcmVzc2lvbikgJiYgdHlwZXMuaW5kZXhPZihub2RlLmxlZnQuZXhwcmVzc2lvbi50ZXh0KSAhPT0gLTE7XG59XG4iXX0=