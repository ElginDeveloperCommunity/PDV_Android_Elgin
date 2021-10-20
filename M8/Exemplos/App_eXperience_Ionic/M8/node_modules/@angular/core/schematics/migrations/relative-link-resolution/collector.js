(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/core/schematics/migrations/relative-link-resolution/collector", ["require", "exports", "typescript", "@angular/core/schematics/migrations/relative-link-resolution/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RelativeLinkResolutionCollector = void 0;
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    const ts = require("typescript");
    const util_1 = require("@angular/core/schematics/migrations/relative-link-resolution/util");
    /**
     * Visitor that walks through specified TypeScript nodes and collects all
     * found ExtraOptions#RelativeLinkResolution assignments.
     */
    class RelativeLinkResolutionCollector {
        constructor(typeChecker) {
            this.typeChecker = typeChecker;
            this.forRootCalls = [];
            this.extraOptionsLiterals = [];
        }
        visitNode(node) {
            let forRootCall = null;
            let literal = null;
            if (util_1.isRouterModuleForRoot(this.typeChecker, node) && node.arguments.length > 0) {
                if (node.arguments.length === 1) {
                    forRootCall = node;
                }
                else if (ts.isObjectLiteralExpression(node.arguments[1])) {
                    literal = node.arguments[1];
                }
                else if (ts.isIdentifier(node.arguments[1])) {
                    literal = this.getLiteralNeedingMigrationFromIdentifier(node.arguments[1]);
                }
            }
            else if (ts.isVariableDeclaration(node)) {
                literal = this.getLiteralNeedingMigration(node);
            }
            if (literal !== null) {
                this.extraOptionsLiterals.push(literal);
            }
            else if (forRootCall !== null) {
                this.forRootCalls.push(forRootCall);
            }
            else {
                // no match found, continue iteration
                ts.forEachChild(node, n => this.visitNode(n));
            }
        }
        getLiteralNeedingMigrationFromIdentifier(id) {
            const symbolForIdentifier = this.typeChecker.getSymbolAtLocation(id);
            if (symbolForIdentifier === undefined) {
                return null;
            }
            if (symbolForIdentifier.declarations === undefined ||
                symbolForIdentifier.declarations.length === 0) {
                return null;
            }
            const declarationNode = symbolForIdentifier.declarations[0];
            if (!ts.isVariableDeclaration(declarationNode) || declarationNode.initializer === undefined ||
                !ts.isObjectLiteralExpression(declarationNode.initializer)) {
                return null;
            }
            return declarationNode.initializer;
        }
        getLiteralNeedingMigration(node) {
            if (node.initializer === undefined) {
                return null;
            }
            // declaration could be `x: ExtraOptions = {}` or `x = {} as ExtraOptions`
            if (ts.isAsExpression(node.initializer) &&
                ts.isObjectLiteralExpression(node.initializer.expression) &&
                util_1.isExtraOptions(this.typeChecker, node.initializer.type)) {
                return node.initializer.expression;
            }
            else if (node.type !== undefined && ts.isObjectLiteralExpression(node.initializer) &&
                util_1.isExtraOptions(this.typeChecker, node.type)) {
                return node.initializer;
            }
            return null;
        }
    }
    exports.RelativeLinkResolutionCollector = RelativeLinkResolutionCollector;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zY2hlbWF0aWNzL21pZ3JhdGlvbnMvcmVsYXRpdmUtbGluay1yZXNvbHV0aW9uL2NvbGxlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCxpQ0FBaUM7SUFFakMsNEZBQTZEO0lBRzdEOzs7T0FHRztJQUNILE1BQWEsK0JBQStCO1FBSTFDLFlBQTZCLFdBQTJCO1lBQTNCLGdCQUFXLEdBQVgsV0FBVyxDQUFnQjtZQUgvQyxpQkFBWSxHQUF3QixFQUFFLENBQUM7WUFDdkMseUJBQW9CLEdBQWlDLEVBQUUsQ0FBQztRQUVOLENBQUM7UUFFNUQsU0FBUyxDQUFDLElBQWE7WUFDckIsSUFBSSxXQUFXLEdBQTJCLElBQUksQ0FBQztZQUMvQyxJQUFJLE9BQU8sR0FBb0MsSUFBSSxDQUFDO1lBQ3BELElBQUksNEJBQXFCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzlFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUMvQixXQUFXLEdBQUcsSUFBSSxDQUFDO2lCQUNwQjtxQkFBTSxJQUFJLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzFELE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBK0IsQ0FBQztpQkFDM0Q7cUJBQU0sSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDN0MsT0FBTyxHQUFHLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBa0IsQ0FBQyxDQUFDO2lCQUM3RjthQUNGO2lCQUFNLElBQUksRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN6QyxPQUFPLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2pEO1lBRUQsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO2dCQUNwQixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3pDO2lCQUFNLElBQUksV0FBVyxLQUFLLElBQUksRUFBRTtnQkFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDckM7aUJBQU07Z0JBQ0wscUNBQXFDO2dCQUNyQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvQztRQUNILENBQUM7UUFFTyx3Q0FBd0MsQ0FBQyxFQUFpQjtZQUVoRSxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckUsSUFBSSxtQkFBbUIsS0FBSyxTQUFTLEVBQUU7Z0JBQ3JDLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFJLG1CQUFtQixDQUFDLFlBQVksS0FBSyxTQUFTO2dCQUM5QyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDakQsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELE1BQU0sZUFBZSxHQUFHLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxJQUFJLGVBQWUsQ0FBQyxXQUFXLEtBQUssU0FBUztnQkFDdkYsQ0FBQyxFQUFFLENBQUMseUJBQXlCLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUM5RCxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsT0FBTyxlQUFlLENBQUMsV0FBVyxDQUFDO1FBQ3JDLENBQUM7UUFFTywwQkFBMEIsQ0FBQyxJQUE0QjtZQUU3RCxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO2dCQUNsQyxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsMEVBQTBFO1lBQzFFLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUNuQyxFQUFFLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7Z0JBQ3pELHFCQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMzRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO2FBQ3BDO2lCQUFNLElBQ0gsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksRUFBRSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQ3pFLHFCQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQy9DLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUN6QjtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUNGO0lBdkVELDBFQXVFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7aXNFeHRyYU9wdGlvbnMsIGlzUm91dGVyTW9kdWxlRm9yUm9vdH0gZnJvbSAnLi91dGlsJztcblxuXG4vKipcbiAqIFZpc2l0b3IgdGhhdCB3YWxrcyB0aHJvdWdoIHNwZWNpZmllZCBUeXBlU2NyaXB0IG5vZGVzIGFuZCBjb2xsZWN0cyBhbGxcbiAqIGZvdW5kIEV4dHJhT3B0aW9ucyNSZWxhdGl2ZUxpbmtSZXNvbHV0aW9uIGFzc2lnbm1lbnRzLlxuICovXG5leHBvcnQgY2xhc3MgUmVsYXRpdmVMaW5rUmVzb2x1dGlvbkNvbGxlY3RvciB7XG4gIHJlYWRvbmx5IGZvclJvb3RDYWxsczogdHMuQ2FsbEV4cHJlc3Npb25bXSA9IFtdO1xuICByZWFkb25seSBleHRyYU9wdGlvbnNMaXRlcmFsczogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKSB7fVxuXG4gIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKSB7XG4gICAgbGV0IGZvclJvb3RDYWxsOiB0cy5DYWxsRXhwcmVzc2lvbnxudWxsID0gbnVsbDtcbiAgICBsZXQgbGl0ZXJhbDogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb258bnVsbCA9IG51bGw7XG4gICAgaWYgKGlzUm91dGVyTW9kdWxlRm9yUm9vdCh0aGlzLnR5cGVDaGVja2VyLCBub2RlKSAmJiBub2RlLmFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAobm9kZS5hcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGZvclJvb3RDYWxsID0gbm9kZTtcbiAgICAgIH0gZWxzZSBpZiAodHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlLmFyZ3VtZW50c1sxXSkpIHtcbiAgICAgICAgbGl0ZXJhbCA9IG5vZGUuYXJndW1lbnRzWzFdIGFzIHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uO1xuICAgICAgfSBlbHNlIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZS5hcmd1bWVudHNbMV0pKSB7XG4gICAgICAgIGxpdGVyYWwgPSB0aGlzLmdldExpdGVyYWxOZWVkaW5nTWlncmF0aW9uRnJvbUlkZW50aWZpZXIobm9kZS5hcmd1bWVudHNbMV0gYXMgdHMuSWRlbnRpZmllcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgIGxpdGVyYWwgPSB0aGlzLmdldExpdGVyYWxOZWVkaW5nTWlncmF0aW9uKG5vZGUpO1xuICAgIH1cblxuICAgIGlmIChsaXRlcmFsICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmV4dHJhT3B0aW9uc0xpdGVyYWxzLnB1c2gobGl0ZXJhbCk7XG4gICAgfSBlbHNlIGlmIChmb3JSb290Q2FsbCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5mb3JSb290Q2FsbHMucHVzaChmb3JSb290Q2FsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vIG1hdGNoIGZvdW5kLCBjb250aW51ZSBpdGVyYXRpb25cbiAgICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCBuID0+IHRoaXMudmlzaXROb2RlKG4pKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldExpdGVyYWxOZWVkaW5nTWlncmF0aW9uRnJvbUlkZW50aWZpZXIoaWQ6IHRzLklkZW50aWZpZXIpOiB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvblxuICAgICAgfG51bGwge1xuICAgIGNvbnN0IHN5bWJvbEZvcklkZW50aWZpZXIgPSB0aGlzLnR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24oaWQpO1xuICAgIGlmIChzeW1ib2xGb3JJZGVudGlmaWVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChzeW1ib2xGb3JJZGVudGlmaWVyLmRlY2xhcmF0aW9ucyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIHN5bWJvbEZvcklkZW50aWZpZXIuZGVjbGFyYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZGVjbGFyYXRpb25Ob2RlID0gc3ltYm9sRm9ySWRlbnRpZmllci5kZWNsYXJhdGlvbnNbMF07XG4gICAgaWYgKCF0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24oZGVjbGFyYXRpb25Ob2RlKSB8fCBkZWNsYXJhdGlvbk5vZGUuaW5pdGlhbGl6ZXIgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAhdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihkZWNsYXJhdGlvbk5vZGUuaW5pdGlhbGl6ZXIpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVjbGFyYXRpb25Ob2RlLmluaXRpYWxpemVyO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRMaXRlcmFsTmVlZGluZ01pZ3JhdGlvbihub2RlOiB0cy5WYXJpYWJsZURlY2xhcmF0aW9uKTogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25cbiAgICAgIHxudWxsIHtcbiAgICBpZiAobm9kZS5pbml0aWFsaXplciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBkZWNsYXJhdGlvbiBjb3VsZCBiZSBgeDogRXh0cmFPcHRpb25zID0ge31gIG9yIGB4ID0ge30gYXMgRXh0cmFPcHRpb25zYFxuICAgIGlmICh0cy5pc0FzRXhwcmVzc2lvbihub2RlLmluaXRpYWxpemVyKSAmJlxuICAgICAgICB0cy5pc09iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUuaW5pdGlhbGl6ZXIuZXhwcmVzc2lvbikgJiZcbiAgICAgICAgaXNFeHRyYU9wdGlvbnModGhpcy50eXBlQ2hlY2tlciwgbm9kZS5pbml0aWFsaXplci50eXBlKSkge1xuICAgICAgcmV0dXJuIG5vZGUuaW5pdGlhbGl6ZXIuZXhwcmVzc2lvbjtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgICBub2RlLnR5cGUgIT09IHVuZGVmaW5lZCAmJiB0cy5pc09iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUuaW5pdGlhbGl6ZXIpICYmXG4gICAgICAgIGlzRXh0cmFPcHRpb25zKHRoaXMudHlwZUNoZWNrZXIsIG5vZGUudHlwZSkpIHtcbiAgICAgIHJldHVybiBub2RlLmluaXRpYWxpemVyO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=