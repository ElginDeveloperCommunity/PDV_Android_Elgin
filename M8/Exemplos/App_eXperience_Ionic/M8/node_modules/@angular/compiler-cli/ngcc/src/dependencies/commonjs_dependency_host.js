(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/dependencies/commonjs_dependency_host", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/ngcc/src/host/commonjs_umd_utils", "@angular/compiler-cli/ngcc/src/dependencies/dependency_host"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hasRequireCalls = exports.CommonJsDependencyHost = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ts = require("typescript");
    var commonjs_umd_utils_1 = require("@angular/compiler-cli/ngcc/src/host/commonjs_umd_utils");
    var dependency_host_1 = require("@angular/compiler-cli/ngcc/src/dependencies/dependency_host");
    /**
     * Helper functions for computing dependencies.
     */
    var CommonJsDependencyHost = /** @class */ (function (_super) {
        tslib_1.__extends(CommonJsDependencyHost, _super);
        function CommonJsDependencyHost() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CommonJsDependencyHost.prototype.canSkipFile = function (fileContents) {
            return !hasRequireCalls(fileContents);
        };
        CommonJsDependencyHost.prototype.extractImports = function (file, fileContents) {
            var e_1, _a, e_2, _b;
            // Parse the source into a TypeScript AST and then walk it looking for imports and re-exports.
            var sf = ts.createSourceFile(file, fileContents, ts.ScriptTarget.ES2015, false, ts.ScriptKind.JS);
            var requireCalls = [];
            try {
                for (var _c = tslib_1.__values(sf.statements), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var stmt = _d.value;
                    if (ts.isVariableStatement(stmt)) {
                        // Regular import(s):
                        // `var foo = require('...')` or `var foo = require('...'), bar = require('...')`
                        var declarations = stmt.declarationList.declarations;
                        try {
                            for (var declarations_1 = (e_2 = void 0, tslib_1.__values(declarations)), declarations_1_1 = declarations_1.next(); !declarations_1_1.done; declarations_1_1 = declarations_1.next()) {
                                var declaration = declarations_1_1.value;
                                if ((declaration.initializer !== undefined) && commonjs_umd_utils_1.isRequireCall(declaration.initializer)) {
                                    requireCalls.push(declaration.initializer);
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (declarations_1_1 && !declarations_1_1.done && (_b = declarations_1.return)) _b.call(declarations_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                    else if (ts.isExpressionStatement(stmt)) {
                        if (commonjs_umd_utils_1.isRequireCall(stmt.expression)) {
                            // Import for the side-effects only:
                            // `require('...')`
                            requireCalls.push(stmt.expression);
                        }
                        else if (commonjs_umd_utils_1.isWildcardReexportStatement(stmt)) {
                            // Re-export in one of the following formats:
                            // - `__export(require('...'))`
                            // - `__export(<identifier>)`
                            // - `tslib_1.__exportStar(require('...'), exports)`
                            // - `tslib_1.__exportStar(<identifier>, exports)`
                            var firstExportArg = stmt.expression.arguments[0];
                            if (commonjs_umd_utils_1.isRequireCall(firstExportArg)) {
                                // Re-export with `require()` call:
                                // `__export(require('...'))` or `tslib_1.__exportStar(require('...'), exports)`
                                requireCalls.push(firstExportArg);
                            }
                        }
                        else if (ts.isBinaryExpression(stmt.expression) &&
                            (stmt.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken)) {
                            if (commonjs_umd_utils_1.isRequireCall(stmt.expression.right)) {
                                // Import with assignment. E.g.:
                                // `exports.foo = require('...')`
                                requireCalls.push(stmt.expression.right);
                            }
                            else if (ts.isObjectLiteralExpression(stmt.expression.right)) {
                                // Import in object literal. E.g.:
                                // `module.exports = {foo: require('...')}`
                                stmt.expression.right.properties.forEach(function (prop) {
                                    if (ts.isPropertyAssignment(prop) && commonjs_umd_utils_1.isRequireCall(prop.initializer)) {
                                        requireCalls.push(prop.initializer);
                                    }
                                });
                            }
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
            return new Set(requireCalls.map(function (call) { return call.arguments[0].text; }));
        };
        return CommonJsDependencyHost;
    }(dependency_host_1.DependencyHostBase));
    exports.CommonJsDependencyHost = CommonJsDependencyHost;
    /**
     * Check whether a source file needs to be parsed for imports.
     * This is a performance short-circuit, which saves us from creating
     * a TypeScript AST unnecessarily.
     *
     * @param source The content of the source file to check.
     *
     * @returns false if there are definitely no require calls
     * in this file, true otherwise.
     */
    function hasRequireCalls(source) {
        return /require\(['"]/.test(source);
    }
    exports.hasRequireCalls = hasRequireCalls;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uanNfZGVwZW5kZW5jeV9ob3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL2RlcGVuZGVuY2llcy9jb21tb25qc19kZXBlbmRlbmN5X2hvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILCtCQUFpQztJQUdqQyw2RkFBbUc7SUFFbkcsK0ZBQXFEO0lBRXJEOztPQUVHO0lBQ0g7UUFBNEMsa0RBQWtCO1FBQTlEOztRQTZEQSxDQUFDO1FBNURvQiw0Q0FBVyxHQUE5QixVQUErQixZQUFvQjtZQUNqRCxPQUFPLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFFa0IsK0NBQWMsR0FBakMsVUFBa0MsSUFBb0IsRUFBRSxZQUFvQjs7WUFDMUUsOEZBQThGO1lBQzlGLElBQU0sRUFBRSxHQUNKLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdGLElBQU0sWUFBWSxHQUFrQixFQUFFLENBQUM7O2dCQUV2QyxLQUFtQixJQUFBLEtBQUEsaUJBQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQSxnQkFBQSw0QkFBRTtvQkFBN0IsSUFBTSxJQUFJLFdBQUE7b0JBQ2IsSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ2hDLHFCQUFxQjt3QkFDckIsaUZBQWlGO3dCQUNqRixJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQzs7NEJBQ3ZELEtBQTBCLElBQUEsZ0NBQUEsaUJBQUEsWUFBWSxDQUFBLENBQUEsMENBQUEsb0VBQUU7Z0NBQW5DLElBQU0sV0FBVyx5QkFBQTtnQ0FDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEtBQUssU0FBUyxDQUFDLElBQUksa0NBQWEsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEVBQUU7b0NBQ3JGLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lDQUM1Qzs2QkFDRjs7Ozs7Ozs7O3FCQUNGO3lCQUFNLElBQUksRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUN6QyxJQUFJLGtDQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFOzRCQUNsQyxvQ0FBb0M7NEJBQ3BDLG1CQUFtQjs0QkFDbkIsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7eUJBQ3BDOzZCQUFNLElBQUksZ0RBQTJCLENBQUMsSUFBSSxDQUFDLEVBQUU7NEJBQzVDLDZDQUE2Qzs0QkFDN0MsK0JBQStCOzRCQUMvQiw2QkFBNkI7NEJBQzdCLG9EQUFvRDs0QkFDcEQsa0RBQWtEOzRCQUNsRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFFcEQsSUFBSSxrQ0FBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dDQUNqQyxtQ0FBbUM7Z0NBQ25DLGdGQUFnRjtnQ0FDaEYsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzs2QkFDbkM7eUJBQ0Y7NkJBQU0sSUFDSCxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzs0QkFDdEMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTs0QkFDdEUsSUFBSSxrQ0FBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0NBQ3hDLGdDQUFnQztnQ0FDaEMsaUNBQWlDO2dDQUNqQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7NkJBQzFDO2lDQUFNLElBQUksRUFBRSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0NBQzlELGtDQUFrQztnQ0FDbEMsMkNBQTJDO2dDQUMzQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtvQ0FDM0MsSUFBSSxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksa0NBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7d0NBQ3BFLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3FDQUNyQztnQ0FDSCxDQUFDLENBQUMsQ0FBQzs2QkFDSjt5QkFDRjtxQkFDRjtpQkFDRjs7Ozs7Ozs7O1lBRUQsT0FBTyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQXRCLENBQXNCLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFDSCw2QkFBQztJQUFELENBQUMsQUE3REQsQ0FBNEMsb0NBQWtCLEdBNkQ3RDtJQTdEWSx3REFBc0I7SUErRG5DOzs7Ozs7Ozs7T0FTRztJQUNILFNBQWdCLGVBQWUsQ0FBQyxNQUFjO1FBQzVDLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRkQsMENBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0Fic29sdXRlRnNQYXRofSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtpc1JlcXVpcmVDYWxsLCBpc1dpbGRjYXJkUmVleHBvcnRTdGF0ZW1lbnQsIFJlcXVpcmVDYWxsfSBmcm9tICcuLi9ob3N0L2NvbW1vbmpzX3VtZF91dGlscyc7XG5cbmltcG9ydCB7RGVwZW5kZW5jeUhvc3RCYXNlfSBmcm9tICcuL2RlcGVuZGVuY3lfaG9zdCc7XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9ucyBmb3IgY29tcHV0aW5nIGRlcGVuZGVuY2llcy5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbW1vbkpzRGVwZW5kZW5jeUhvc3QgZXh0ZW5kcyBEZXBlbmRlbmN5SG9zdEJhc2Uge1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgY2FuU2tpcEZpbGUoZmlsZUNvbnRlbnRzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIWhhc1JlcXVpcmVDYWxscyhmaWxlQ29udGVudHMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGV4dHJhY3RJbXBvcnRzKGZpbGU6IEFic29sdXRlRnNQYXRoLCBmaWxlQ29udGVudHM6IHN0cmluZyk6IFNldDxzdHJpbmc+IHtcbiAgICAvLyBQYXJzZSB0aGUgc291cmNlIGludG8gYSBUeXBlU2NyaXB0IEFTVCBhbmQgdGhlbiB3YWxrIGl0IGxvb2tpbmcgZm9yIGltcG9ydHMgYW5kIHJlLWV4cG9ydHMuXG4gICAgY29uc3Qgc2YgPVxuICAgICAgICB0cy5jcmVhdGVTb3VyY2VGaWxlKGZpbGUsIGZpbGVDb250ZW50cywgdHMuU2NyaXB0VGFyZ2V0LkVTMjAxNSwgZmFsc2UsIHRzLlNjcmlwdEtpbmQuSlMpO1xuICAgIGNvbnN0IHJlcXVpcmVDYWxsczogUmVxdWlyZUNhbGxbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBzdG10IG9mIHNmLnN0YXRlbWVudHMpIHtcbiAgICAgIGlmICh0cy5pc1ZhcmlhYmxlU3RhdGVtZW50KHN0bXQpKSB7XG4gICAgICAgIC8vIFJlZ3VsYXIgaW1wb3J0KHMpOlxuICAgICAgICAvLyBgdmFyIGZvbyA9IHJlcXVpcmUoJy4uLicpYCBvciBgdmFyIGZvbyA9IHJlcXVpcmUoJy4uLicpLCBiYXIgPSByZXF1aXJlKCcuLi4nKWBcbiAgICAgICAgY29uc3QgZGVjbGFyYXRpb25zID0gc3RtdC5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zO1xuICAgICAgICBmb3IgKGNvbnN0IGRlY2xhcmF0aW9uIG9mIGRlY2xhcmF0aW9ucykge1xuICAgICAgICAgIGlmICgoZGVjbGFyYXRpb24uaW5pdGlhbGl6ZXIgIT09IHVuZGVmaW5lZCkgJiYgaXNSZXF1aXJlQ2FsbChkZWNsYXJhdGlvbi5pbml0aWFsaXplcikpIHtcbiAgICAgICAgICAgIHJlcXVpcmVDYWxscy5wdXNoKGRlY2xhcmF0aW9uLmluaXRpYWxpemVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHMuaXNFeHByZXNzaW9uU3RhdGVtZW50KHN0bXQpKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVDYWxsKHN0bXQuZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICAvLyBJbXBvcnQgZm9yIHRoZSBzaWRlLWVmZmVjdHMgb25seTpcbiAgICAgICAgICAvLyBgcmVxdWlyZSgnLi4uJylgXG4gICAgICAgICAgcmVxdWlyZUNhbGxzLnB1c2goc3RtdC5leHByZXNzaW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1dpbGRjYXJkUmVleHBvcnRTdGF0ZW1lbnQoc3RtdCkpIHtcbiAgICAgICAgICAvLyBSZS1leHBvcnQgaW4gb25lIG9mIHRoZSBmb2xsb3dpbmcgZm9ybWF0czpcbiAgICAgICAgICAvLyAtIGBfX2V4cG9ydChyZXF1aXJlKCcuLi4nKSlgXG4gICAgICAgICAgLy8gLSBgX19leHBvcnQoPGlkZW50aWZpZXI+KWBcbiAgICAgICAgICAvLyAtIGB0c2xpYl8xLl9fZXhwb3J0U3RhcihyZXF1aXJlKCcuLi4nKSwgZXhwb3J0cylgXG4gICAgICAgICAgLy8gLSBgdHNsaWJfMS5fX2V4cG9ydFN0YXIoPGlkZW50aWZpZXI+LCBleHBvcnRzKWBcbiAgICAgICAgICBjb25zdCBmaXJzdEV4cG9ydEFyZyA9IHN0bXQuZXhwcmVzc2lvbi5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICBpZiAoaXNSZXF1aXJlQ2FsbChmaXJzdEV4cG9ydEFyZykpIHtcbiAgICAgICAgICAgIC8vIFJlLWV4cG9ydCB3aXRoIGByZXF1aXJlKClgIGNhbGw6XG4gICAgICAgICAgICAvLyBgX19leHBvcnQocmVxdWlyZSgnLi4uJykpYCBvciBgdHNsaWJfMS5fX2V4cG9ydFN0YXIocmVxdWlyZSgnLi4uJyksIGV4cG9ydHMpYFxuICAgICAgICAgICAgcmVxdWlyZUNhbGxzLnB1c2goZmlyc3RFeHBvcnRBcmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIHRzLmlzQmluYXJ5RXhwcmVzc2lvbihzdG10LmV4cHJlc3Npb24pICYmXG4gICAgICAgICAgICAoc3RtdC5leHByZXNzaW9uLm9wZXJhdG9yVG9rZW4ua2luZCA9PT0gdHMuU3ludGF4S2luZC5FcXVhbHNUb2tlbikpIHtcbiAgICAgICAgICBpZiAoaXNSZXF1aXJlQ2FsbChzdG10LmV4cHJlc3Npb24ucmlnaHQpKSB7XG4gICAgICAgICAgICAvLyBJbXBvcnQgd2l0aCBhc3NpZ25tZW50LiBFLmcuOlxuICAgICAgICAgICAgLy8gYGV4cG9ydHMuZm9vID0gcmVxdWlyZSgnLi4uJylgXG4gICAgICAgICAgICByZXF1aXJlQ2FsbHMucHVzaChzdG10LmV4cHJlc3Npb24ucmlnaHQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihzdG10LmV4cHJlc3Npb24ucmlnaHQpKSB7XG4gICAgICAgICAgICAvLyBJbXBvcnQgaW4gb2JqZWN0IGxpdGVyYWwuIEUuZy46XG4gICAgICAgICAgICAvLyBgbW9kdWxlLmV4cG9ydHMgPSB7Zm9vOiByZXF1aXJlKCcuLi4nKX1gXG4gICAgICAgICAgICBzdG10LmV4cHJlc3Npb24ucmlnaHQucHJvcGVydGllcy5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgICBpZiAodHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcCkgJiYgaXNSZXF1aXJlQ2FsbChwcm9wLmluaXRpYWxpemVyKSkge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVDYWxscy5wdXNoKHByb3AuaW5pdGlhbGl6ZXIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFNldChyZXF1aXJlQ2FsbHMubWFwKGNhbGwgPT4gY2FsbC5hcmd1bWVudHNbMF0udGV4dCkpO1xuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhIHNvdXJjZSBmaWxlIG5lZWRzIHRvIGJlIHBhcnNlZCBmb3IgaW1wb3J0cy5cbiAqIFRoaXMgaXMgYSBwZXJmb3JtYW5jZSBzaG9ydC1jaXJjdWl0LCB3aGljaCBzYXZlcyB1cyBmcm9tIGNyZWF0aW5nXG4gKiBhIFR5cGVTY3JpcHQgQVNUIHVubmVjZXNzYXJpbHkuXG4gKlxuICogQHBhcmFtIHNvdXJjZSBUaGUgY29udGVudCBvZiB0aGUgc291cmNlIGZpbGUgdG8gY2hlY2suXG4gKlxuICogQHJldHVybnMgZmFsc2UgaWYgdGhlcmUgYXJlIGRlZmluaXRlbHkgbm8gcmVxdWlyZSBjYWxsc1xuICogaW4gdGhpcyBmaWxlLCB0cnVlIG90aGVyd2lzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc1JlcXVpcmVDYWxscyhzb3VyY2U6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gL3JlcXVpcmVcXChbJ1wiXS8udGVzdChzb3VyY2UpO1xufVxuIl19