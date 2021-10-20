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
        define("@angular/core/schematics/utils/typescript/imports", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findImportSpecifier = exports.replaceImport = exports.getImportSpecifier = exports.getImportOfIdentifier = void 0;
    const ts = require("typescript");
    /** Gets import information about the specified identifier by using the Type checker. */
    function getImportOfIdentifier(typeChecker, node) {
        const symbol = typeChecker.getSymbolAtLocation(node);
        if (!symbol || symbol.declarations === undefined || !symbol.declarations.length) {
            return null;
        }
        const decl = symbol.declarations[0];
        if (!ts.isImportSpecifier(decl)) {
            return null;
        }
        const importDecl = decl.parent.parent.parent;
        if (!ts.isStringLiteral(importDecl.moduleSpecifier)) {
            return null;
        }
        return {
            // Handles aliased imports: e.g. "import {Component as myComp} from ...";
            name: decl.propertyName ? decl.propertyName.text : decl.name.text,
            importModule: importDecl.moduleSpecifier.text,
            node: importDecl
        };
    }
    exports.getImportOfIdentifier = getImportOfIdentifier;
    /**
     * Gets a top-level import specifier with a specific name that is imported from a particular module.
     * E.g. given a file that looks like:
     *
     * ```
     * import { Component, Directive } from '@angular/core';
     * import { Foo } from './foo';
     * ```
     *
     * Calling `getImportSpecifier(sourceFile, '@angular/core', 'Directive')` will yield the node
     * referring to `Directive` in the top import.
     *
     * @param sourceFile File in which to look for imports.
     * @param moduleName Name of the import's module.
     * @param specifierName Original name of the specifier to look for. Aliases will be resolved to
     *    their original name.
     */
    function getImportSpecifier(sourceFile, moduleName, specifierName) {
        for (const node of sourceFile.statements) {
            if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) &&
                node.moduleSpecifier.text === moduleName) {
                const namedBindings = node.importClause && node.importClause.namedBindings;
                if (namedBindings && ts.isNamedImports(namedBindings)) {
                    const match = findImportSpecifier(namedBindings.elements, specifierName);
                    if (match) {
                        return match;
                    }
                }
            }
        }
        return null;
    }
    exports.getImportSpecifier = getImportSpecifier;
    /**
     * Replaces an import inside a named imports node with a different one.
     * @param node Node that contains the imports.
     * @param existingImport Import that should be replaced.
     * @param newImportName Import that should be inserted.
     */
    function replaceImport(node, existingImport, newImportName) {
        const isAlreadyImported = findImportSpecifier(node.elements, newImportName);
        if (isAlreadyImported) {
            return node;
        }
        const existingImportNode = findImportSpecifier(node.elements, existingImport);
        if (!existingImportNode) {
            return node;
        }
        return ts.updateNamedImports(node, [
            ...node.elements.filter(current => current !== existingImportNode),
            // Create a new import while trying to preserve the alias of the old one.
            ts.createImportSpecifier(existingImportNode.propertyName ? ts.createIdentifier(newImportName) : undefined, existingImportNode.propertyName ? existingImportNode.name :
                ts.createIdentifier(newImportName))
        ]);
    }
    exports.replaceImport = replaceImport;
    /** Finds an import specifier with a particular name. */
    function findImportSpecifier(nodes, specifierName) {
        return nodes.find(element => {
            const { name, propertyName } = element;
            return propertyName ? propertyName.text === specifierName : name.text === specifierName;
        });
    }
    exports.findImportSpecifier = findImportSpecifier;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy91dGlscy90eXBlc2NyaXB0L2ltcG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsaUNBQWlDO0lBUWpDLHdGQUF3RjtJQUN4RixTQUFnQixxQkFBcUIsQ0FBQyxXQUEyQixFQUFFLElBQW1CO1FBRXBGLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyRCxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLEtBQUssU0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDL0UsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMvQixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRTdDLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUNuRCxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsT0FBTztZQUNMLHlFQUF5RTtZQUN6RSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtZQUNqRSxZQUFZLEVBQUUsVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJO1lBQzdDLElBQUksRUFBRSxVQUFVO1NBQ2pCLENBQUM7SUFDSixDQUFDO0lBMUJELHNEQTBCQztJQUdEOzs7Ozs7Ozs7Ozs7Ozs7O09BZ0JHO0lBQ0gsU0FBZ0Isa0JBQWtCLENBQzlCLFVBQXlCLEVBQUUsVUFBa0IsRUFBRSxhQUFxQjtRQUN0RSxLQUFLLE1BQU0sSUFBSSxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUU7WUFDeEMsSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2dCQUN4RSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7Z0JBQzVDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUM7Z0JBQzNFLElBQUksYUFBYSxJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEVBQUU7b0JBQ3JELE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBQ3pFLElBQUksS0FBSyxFQUFFO3dCQUNULE9BQU8sS0FBSyxDQUFDO3FCQUNkO2lCQUNGO2FBQ0Y7U0FDRjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQWhCRCxnREFnQkM7SUFHRDs7Ozs7T0FLRztJQUNILFNBQWdCLGFBQWEsQ0FDekIsSUFBcUIsRUFBRSxjQUFzQixFQUFFLGFBQXFCO1FBQ3RFLE1BQU0saUJBQWlCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUM1RSxJQUFJLGlCQUFpQixFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLGtCQUFrQixHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUU7WUFDakMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxrQkFBa0IsQ0FBQztZQUNsRSx5RUFBeUU7WUFDekUsRUFBRSxDQUFDLHFCQUFxQixDQUNwQixrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUNoRixrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN6QixFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDMUUsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQXBCRCxzQ0FvQkM7SUFHRCx3REFBd0Q7SUFDeEQsU0FBZ0IsbUJBQW1CLENBQy9CLEtBQXVDLEVBQUUsYUFBcUI7UUFDaEUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzFCLE1BQU0sRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFDLEdBQUcsT0FBTyxDQUFDO1lBQ3JDLE9BQU8sWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhLENBQUM7UUFDMUYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBTkQsa0RBTUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmV4cG9ydCB0eXBlIEltcG9ydCA9IHtcbiAgbmFtZTogc3RyaW5nLFxuICBpbXBvcnRNb2R1bGU6IHN0cmluZyxcbiAgbm9kZTogdHMuSW1wb3J0RGVjbGFyYXRpb25cbn07XG5cbi8qKiBHZXRzIGltcG9ydCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIgYnkgdXNpbmcgdGhlIFR5cGUgY2hlY2tlci4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbXBvcnRPZklkZW50aWZpZXIodHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBub2RlOiB0cy5JZGVudGlmaWVyKTogSW1wb3J0fFxuICAgIG51bGwge1xuICBjb25zdCBzeW1ib2wgPSB0eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuXG4gIGlmICghc3ltYm9sIHx8IHN5bWJvbC5kZWNsYXJhdGlvbnMgPT09IHVuZGVmaW5lZCB8fCAhc3ltYm9sLmRlY2xhcmF0aW9ucy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRlY2wgPSBzeW1ib2wuZGVjbGFyYXRpb25zWzBdO1xuXG4gIGlmICghdHMuaXNJbXBvcnRTcGVjaWZpZXIoZGVjbCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGltcG9ydERlY2wgPSBkZWNsLnBhcmVudC5wYXJlbnQucGFyZW50O1xuXG4gIGlmICghdHMuaXNTdHJpbmdMaXRlcmFsKGltcG9ydERlY2wubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBIYW5kbGVzIGFsaWFzZWQgaW1wb3J0czogZS5nLiBcImltcG9ydCB7Q29tcG9uZW50IGFzIG15Q29tcH0gZnJvbSAuLi5cIjtcbiAgICBuYW1lOiBkZWNsLnByb3BlcnR5TmFtZSA/IGRlY2wucHJvcGVydHlOYW1lLnRleHQgOiBkZWNsLm5hbWUudGV4dCxcbiAgICBpbXBvcnRNb2R1bGU6IGltcG9ydERlY2wubW9kdWxlU3BlY2lmaWVyLnRleHQsXG4gICAgbm9kZTogaW1wb3J0RGVjbFxuICB9O1xufVxuXG5cbi8qKlxuICogR2V0cyBhIHRvcC1sZXZlbCBpbXBvcnQgc3BlY2lmaWVyIHdpdGggYSBzcGVjaWZpYyBuYW1lIHRoYXQgaXMgaW1wb3J0ZWQgZnJvbSBhIHBhcnRpY3VsYXIgbW9kdWxlLlxuICogRS5nLiBnaXZlbiBhIGZpbGUgdGhhdCBsb29rcyBsaWtlOlxuICpcbiAqIGBgYFxuICogaW1wb3J0IHsgQ29tcG9uZW50LCBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAqIGltcG9ydCB7IEZvbyB9IGZyb20gJy4vZm9vJztcbiAqIGBgYFxuICpcbiAqIENhbGxpbmcgYGdldEltcG9ydFNwZWNpZmllcihzb3VyY2VGaWxlLCAnQGFuZ3VsYXIvY29yZScsICdEaXJlY3RpdmUnKWAgd2lsbCB5aWVsZCB0aGUgbm9kZVxuICogcmVmZXJyaW5nIHRvIGBEaXJlY3RpdmVgIGluIHRoZSB0b3AgaW1wb3J0LlxuICpcbiAqIEBwYXJhbSBzb3VyY2VGaWxlIEZpbGUgaW4gd2hpY2ggdG8gbG9vayBmb3IgaW1wb3J0cy5cbiAqIEBwYXJhbSBtb2R1bGVOYW1lIE5hbWUgb2YgdGhlIGltcG9ydCdzIG1vZHVsZS5cbiAqIEBwYXJhbSBzcGVjaWZpZXJOYW1lIE9yaWdpbmFsIG5hbWUgb2YgdGhlIHNwZWNpZmllciB0byBsb29rIGZvci4gQWxpYXNlcyB3aWxsIGJlIHJlc29sdmVkIHRvXG4gKiAgICB0aGVpciBvcmlnaW5hbCBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW1wb3J0U3BlY2lmaWVyKFxuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIG1vZHVsZU5hbWU6IHN0cmluZywgc3BlY2lmaWVyTmFtZTogc3RyaW5nKTogdHMuSW1wb3J0U3BlY2lmaWVyfG51bGwge1xuICBmb3IgKGNvbnN0IG5vZGUgb2Ygc291cmNlRmlsZS5zdGF0ZW1lbnRzKSB7XG4gICAgaWYgKHRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgJiYgdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUubW9kdWxlU3BlY2lmaWVyKSAmJlxuICAgICAgICBub2RlLm1vZHVsZVNwZWNpZmllci50ZXh0ID09PSBtb2R1bGVOYW1lKSB7XG4gICAgICBjb25zdCBuYW1lZEJpbmRpbmdzID0gbm9kZS5pbXBvcnRDbGF1c2UgJiYgbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncztcbiAgICAgIGlmIChuYW1lZEJpbmRpbmdzICYmIHRzLmlzTmFtZWRJbXBvcnRzKG5hbWVkQmluZGluZ3MpKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gZmluZEltcG9ydFNwZWNpZmllcihuYW1lZEJpbmRpbmdzLmVsZW1lbnRzLCBzcGVjaWZpZXJOYW1lKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cblxuLyoqXG4gKiBSZXBsYWNlcyBhbiBpbXBvcnQgaW5zaWRlIGEgbmFtZWQgaW1wb3J0cyBub2RlIHdpdGggYSBkaWZmZXJlbnQgb25lLlxuICogQHBhcmFtIG5vZGUgTm9kZSB0aGF0IGNvbnRhaW5zIHRoZSBpbXBvcnRzLlxuICogQHBhcmFtIGV4aXN0aW5nSW1wb3J0IEltcG9ydCB0aGF0IHNob3VsZCBiZSByZXBsYWNlZC5cbiAqIEBwYXJhbSBuZXdJbXBvcnROYW1lIEltcG9ydCB0aGF0IHNob3VsZCBiZSBpbnNlcnRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VJbXBvcnQoXG4gICAgbm9kZTogdHMuTmFtZWRJbXBvcnRzLCBleGlzdGluZ0ltcG9ydDogc3RyaW5nLCBuZXdJbXBvcnROYW1lOiBzdHJpbmcpIHtcbiAgY29uc3QgaXNBbHJlYWR5SW1wb3J0ZWQgPSBmaW5kSW1wb3J0U3BlY2lmaWVyKG5vZGUuZWxlbWVudHMsIG5ld0ltcG9ydE5hbWUpO1xuICBpZiAoaXNBbHJlYWR5SW1wb3J0ZWQpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGNvbnN0IGV4aXN0aW5nSW1wb3J0Tm9kZSA9IGZpbmRJbXBvcnRTcGVjaWZpZXIobm9kZS5lbGVtZW50cywgZXhpc3RpbmdJbXBvcnQpO1xuICBpZiAoIWV4aXN0aW5nSW1wb3J0Tm9kZSkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcmV0dXJuIHRzLnVwZGF0ZU5hbWVkSW1wb3J0cyhub2RlLCBbXG4gICAgLi4ubm9kZS5lbGVtZW50cy5maWx0ZXIoY3VycmVudCA9PiBjdXJyZW50ICE9PSBleGlzdGluZ0ltcG9ydE5vZGUpLFxuICAgIC8vIENyZWF0ZSBhIG5ldyBpbXBvcnQgd2hpbGUgdHJ5aW5nIHRvIHByZXNlcnZlIHRoZSBhbGlhcyBvZiB0aGUgb2xkIG9uZS5cbiAgICB0cy5jcmVhdGVJbXBvcnRTcGVjaWZpZXIoXG4gICAgICAgIGV4aXN0aW5nSW1wb3J0Tm9kZS5wcm9wZXJ0eU5hbWUgPyB0cy5jcmVhdGVJZGVudGlmaWVyKG5ld0ltcG9ydE5hbWUpIDogdW5kZWZpbmVkLFxuICAgICAgICBleGlzdGluZ0ltcG9ydE5vZGUucHJvcGVydHlOYW1lID8gZXhpc3RpbmdJbXBvcnROb2RlLm5hbWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHMuY3JlYXRlSWRlbnRpZmllcihuZXdJbXBvcnROYW1lKSlcbiAgXSk7XG59XG5cblxuLyoqIEZpbmRzIGFuIGltcG9ydCBzcGVjaWZpZXIgd2l0aCBhIHBhcnRpY3VsYXIgbmFtZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW1wb3J0U3BlY2lmaWVyKFxuICAgIG5vZGVzOiB0cy5Ob2RlQXJyYXk8dHMuSW1wb3J0U3BlY2lmaWVyPiwgc3BlY2lmaWVyTmFtZTogc3RyaW5nKTogdHMuSW1wb3J0U3BlY2lmaWVyfHVuZGVmaW5lZCB7XG4gIHJldHVybiBub2Rlcy5maW5kKGVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHtuYW1lLCBwcm9wZXJ0eU5hbWV9ID0gZWxlbWVudDtcbiAgICByZXR1cm4gcHJvcGVydHlOYW1lID8gcHJvcGVydHlOYW1lLnRleHQgPT09IHNwZWNpZmllck5hbWUgOiBuYW1lLnRleHQgPT09IHNwZWNpZmllck5hbWU7XG4gIH0pO1xufVxuIl19