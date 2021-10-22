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
        define("@angular/compiler-cli/src/ngtsc/transform/src/declaration", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/translator", "@angular/compiler-cli/src/ngtsc/transform/src/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IvyDeclarationDtsTransform = exports.declarationTransformFactory = exports.DtsTransformRegistry = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var translator_1 = require("@angular/compiler-cli/src/ngtsc/translator");
    var utils_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/utils");
    /**
     * Keeps track of `DtsTransform`s per source file, so that it is known which source files need to
     * have their declaration file transformed.
     */
    var DtsTransformRegistry = /** @class */ (function () {
        function DtsTransformRegistry() {
            this.ivyDeclarationTransforms = new Map();
        }
        DtsTransformRegistry.prototype.getIvyDeclarationTransform = function (sf) {
            if (!this.ivyDeclarationTransforms.has(sf)) {
                this.ivyDeclarationTransforms.set(sf, new IvyDeclarationDtsTransform());
            }
            return this.ivyDeclarationTransforms.get(sf);
        };
        /**
         * Gets the dts transforms to be applied for the given source file, or `null` if no transform is
         * necessary.
         */
        DtsTransformRegistry.prototype.getAllTransforms = function (sf) {
            // No need to transform if it's not a declarations file, or if no changes have been requested
            // to the input file. Due to the way TypeScript afterDeclarations transformers work, the
            // `ts.SourceFile` path is the same as the original .ts. The only way we know it's actually a
            // declaration file is via the `isDeclarationFile` property.
            if (!sf.isDeclarationFile) {
                return null;
            }
            var originalSf = ts.getOriginalNode(sf);
            var transforms = null;
            if (this.ivyDeclarationTransforms.has(originalSf)) {
                transforms = [];
                transforms.push(this.ivyDeclarationTransforms.get(originalSf));
            }
            return transforms;
        };
        return DtsTransformRegistry;
    }());
    exports.DtsTransformRegistry = DtsTransformRegistry;
    function declarationTransformFactory(transformRegistry, importRewriter, importPrefix) {
        return function (context) {
            var transformer = new DtsTransformer(context, importRewriter, importPrefix);
            return function (fileOrBundle) {
                if (ts.isBundle(fileOrBundle)) {
                    // Only attempt to transform source files.
                    return fileOrBundle;
                }
                var transforms = transformRegistry.getAllTransforms(fileOrBundle);
                if (transforms === null) {
                    return fileOrBundle;
                }
                return transformer.transform(fileOrBundle, transforms);
            };
        };
    }
    exports.declarationTransformFactory = declarationTransformFactory;
    /**
     * Processes .d.ts file text and adds static field declarations, with types.
     */
    var DtsTransformer = /** @class */ (function () {
        function DtsTransformer(ctx, importRewriter, importPrefix) {
            this.ctx = ctx;
            this.importRewriter = importRewriter;
            this.importPrefix = importPrefix;
        }
        /**
         * Transform the declaration file and add any declarations which were recorded.
         */
        DtsTransformer.prototype.transform = function (sf, transforms) {
            var _this = this;
            var imports = new translator_1.ImportManager(this.importRewriter, this.importPrefix);
            var visitor = function (node) {
                if (ts.isClassDeclaration(node)) {
                    return _this.transformClassDeclaration(node, transforms, imports);
                }
                else if (ts.isFunctionDeclaration(node)) {
                    return _this.transformFunctionDeclaration(node, transforms, imports);
                }
                else {
                    // Otherwise return node as is.
                    return ts.visitEachChild(node, visitor, _this.ctx);
                }
            };
            // Recursively scan through the AST and process all nodes as desired.
            sf = ts.visitNode(sf, visitor);
            // Add new imports for this file.
            return utils_1.addImports(imports, sf);
        };
        DtsTransformer.prototype.transformClassDeclaration = function (clazz, transforms, imports) {
            var e_1, _a, e_2, _b;
            var elements = clazz.members;
            var elementsChanged = false;
            try {
                for (var transforms_1 = tslib_1.__values(transforms), transforms_1_1 = transforms_1.next(); !transforms_1_1.done; transforms_1_1 = transforms_1.next()) {
                    var transform = transforms_1_1.value;
                    if (transform.transformClassElement !== undefined) {
                        for (var i = 0; i < elements.length; i++) {
                            var res = transform.transformClassElement(elements[i], imports);
                            if (res !== elements[i]) {
                                if (!elementsChanged) {
                                    elements = tslib_1.__spreadArray([], tslib_1.__read(elements));
                                    elementsChanged = true;
                                }
                                elements[i] = res;
                            }
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (transforms_1_1 && !transforms_1_1.done && (_a = transforms_1.return)) _a.call(transforms_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var newClazz = clazz;
            try {
                for (var transforms_2 = tslib_1.__values(transforms), transforms_2_1 = transforms_2.next(); !transforms_2_1.done; transforms_2_1 = transforms_2.next()) {
                    var transform = transforms_2_1.value;
                    if (transform.transformClass !== undefined) {
                        // If no DtsTransform has changed the class yet, then the (possibly mutated) elements have
                        // not yet been incorporated. Otherwise, `newClazz.members` holds the latest class members.
                        var inputMembers = (clazz === newClazz ? elements : newClazz.members);
                        newClazz = transform.transformClass(newClazz, inputMembers, imports);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (transforms_2_1 && !transforms_2_1.done && (_b = transforms_2.return)) _b.call(transforms_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // If some elements have been transformed but the class itself has not been transformed, create
            // an updated class declaration with the updated elements.
            if (elementsChanged && clazz === newClazz) {
                newClazz = ts.updateClassDeclaration(
                /* node */ clazz, 
                /* decorators */ clazz.decorators, 
                /* modifiers */ clazz.modifiers, 
                /* name */ clazz.name, 
                /* typeParameters */ clazz.typeParameters, 
                /* heritageClauses */ clazz.heritageClauses, 
                /* members */ elements);
            }
            return newClazz;
        };
        DtsTransformer.prototype.transformFunctionDeclaration = function (declaration, transforms, imports) {
            var e_3, _a;
            var newDecl = declaration;
            try {
                for (var transforms_3 = tslib_1.__values(transforms), transforms_3_1 = transforms_3.next(); !transforms_3_1.done; transforms_3_1 = transforms_3.next()) {
                    var transform = transforms_3_1.value;
                    if (transform.transformFunctionDeclaration !== undefined) {
                        newDecl = transform.transformFunctionDeclaration(newDecl, imports);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (transforms_3_1 && !transforms_3_1.done && (_a = transforms_3.return)) _a.call(transforms_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return newDecl;
        };
        return DtsTransformer;
    }());
    var IvyDeclarationDtsTransform = /** @class */ (function () {
        function IvyDeclarationDtsTransform() {
            this.declarationFields = new Map();
        }
        IvyDeclarationDtsTransform.prototype.addFields = function (decl, fields) {
            this.declarationFields.set(decl, fields);
        };
        IvyDeclarationDtsTransform.prototype.transformClass = function (clazz, members, imports) {
            var original = ts.getOriginalNode(clazz);
            if (!this.declarationFields.has(original)) {
                return clazz;
            }
            var fields = this.declarationFields.get(original);
            var newMembers = fields.map(function (decl) {
                var modifiers = [ts.createModifier(ts.SyntaxKind.StaticKeyword)];
                var typeRef = translator_1.translateType(decl.type, imports);
                markForEmitAsSingleLine(typeRef);
                return ts.createProperty(
                /* decorators */ undefined, 
                /* modifiers */ modifiers, 
                /* name */ decl.name, 
                /* questionOrExclamationToken */ undefined, 
                /* type */ typeRef, 
                /* initializer */ undefined);
            });
            return ts.updateClassDeclaration(
            /* node */ clazz, 
            /* decorators */ clazz.decorators, 
            /* modifiers */ clazz.modifiers, 
            /* name */ clazz.name, 
            /* typeParameters */ clazz.typeParameters, 
            /* heritageClauses */ clazz.heritageClauses, tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(members)), tslib_1.__read(newMembers)));
        };
        return IvyDeclarationDtsTransform;
    }());
    exports.IvyDeclarationDtsTransform = IvyDeclarationDtsTransform;
    function markForEmitAsSingleLine(node) {
        ts.setEmitFlags(node, ts.EmitFlags.SingleLine);
        ts.forEachChild(node, markForEmitAsSingleLine);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjbGFyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3RyYW5zZm9ybS9zcmMvZGVjbGFyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUdILCtCQUFpQztJQUlqQyx5RUFBOEQ7SUFHOUQsNkVBQW1DO0lBRW5DOzs7T0FHRztJQUNIO1FBQUE7WUFDVSw2QkFBd0IsR0FBRyxJQUFJLEdBQUcsRUFBNkMsQ0FBQztRQThCMUYsQ0FBQztRQTVCQyx5REFBMEIsR0FBMUIsVUFBMkIsRUFBaUI7WUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQzFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksMEJBQTBCLEVBQUUsQ0FBQyxDQUFDO2FBQ3pFO1lBQ0QsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBRSxDQUFDO1FBQ2hELENBQUM7UUFFRDs7O1dBR0c7UUFDSCwrQ0FBZ0IsR0FBaEIsVUFBaUIsRUFBaUI7WUFDaEMsNkZBQTZGO1lBQzdGLHdGQUF3RjtZQUN4Riw2RkFBNkY7WUFDN0YsNERBQTREO1lBQzVELElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ3pCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBa0IsQ0FBQztZQUUzRCxJQUFJLFVBQVUsR0FBd0IsSUFBSSxDQUFDO1lBQzNDLElBQUksSUFBSSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDakQsVUFBVSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIs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RUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0lBQ2pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUeXBlfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtJbXBvcnRSZXdyaXRlcn0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtJbXBvcnRNYW5hZ2VyLCB0cmFuc2xhdGVUeXBlfSBmcm9tICcuLi8uLi90cmFuc2xhdG9yJztcblxuaW1wb3J0IHtEdHNUcmFuc2Zvcm19IGZyb20gJy4vYXBpJztcbmltcG9ydCB7YWRkSW1wb3J0c30gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgYER0c1RyYW5zZm9ybWBzIHBlciBzb3VyY2UgZmlsZSwgc28gdGhhdCBpdCBpcyBrbm93biB3aGljaCBzb3VyY2UgZmlsZXMgbmVlZCB0b1xuICogaGF2ZSB0aGVpciBkZWNsYXJhdGlvbiBmaWxlIHRyYW5zZm9ybWVkLlxuICovXG5leHBvcnQgY2xhc3MgRHRzVHJhbnNmb3JtUmVnaXN0cnkge1xuICBwcml2YXRlIGl2eURlY2xhcmF0aW9uVHJhbnNmb3JtcyA9IG5ldyBNYXA8dHMuU291cmNlRmlsZSwgSXZ5RGVjbGFyYXRpb25EdHNUcmFuc2Zvcm0+KCk7XG5cbiAgZ2V0SXZ5RGVjbGFyYXRpb25UcmFuc2Zvcm0oc2Y6IHRzLlNvdXJjZUZpbGUpOiBJdnlEZWNsYXJhdGlvbkR0c1RyYW5zZm9ybSB7XG4gICAgaWYgKCF0aGlzLml2eURlY2xhcmF0aW9uVHJhbnNmb3Jtcy5oYXMoc2YpKSB7XG4gICAgICB0aGlzLml2eURlY2xhcmF0aW9uVHJhbnNmb3Jtcy5zZXQoc2YsIG5ldyBJdnlEZWNsYXJhdGlvbkR0c1RyYW5zZm9ybSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaXZ5RGVjbGFyYXRpb25UcmFuc2Zvcm1zLmdldChzZikhO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGR0cyB0cmFuc2Zvcm1zIHRvIGJlIGFwcGxpZWQgZm9yIHRoZSBnaXZlbiBzb3VyY2UgZmlsZSwgb3IgYG51bGxgIGlmIG5vIHRyYW5zZm9ybSBpc1xuICAgKiBuZWNlc3NhcnkuXG4gICAqL1xuICBnZXRBbGxUcmFuc2Zvcm1zKHNmOiB0cy5Tb3VyY2VGaWxlKTogRHRzVHJhbnNmb3JtW118bnVsbCB7XG4gICAgLy8gTm8gbmVlZCB0byB0cmFuc2Zvcm0gaWYgaXQncyBub3QgYSBkZWNsYXJhdGlvbnMgZmlsZSwgb3IgaWYgbm8gY2hhbmdlcyBoYXZlIGJlZW4gcmVxdWVzdGVkXG4gICAgLy8gdG8gdGhlIGlucHV0IGZpbGUuIER1ZSB0byB0aGUgd2F5IFR5cGVTY3JpcHQgYWZ0ZXJEZWNsYXJhdGlvbnMgdHJhbnNmb3JtZXJzIHdvcmssIHRoZVxuICAgIC8vIGB0cy5Tb3VyY2VGaWxlYCBwYXRoIGlzIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbCAudHMuIFRoZSBvbmx5IHdheSB3ZSBrbm93IGl0J3MgYWN0dWFsbHkgYVxuICAgIC8vIGRlY2xhcmF0aW9uIGZpbGUgaXMgdmlhIHRoZSBgaXNEZWNsYXJhdGlvbkZpbGVgIHByb3BlcnR5LlxuICAgIGlmICghc2YuaXNEZWNsYXJhdGlvbkZpbGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBvcmlnaW5hbFNmID0gdHMuZ2V0T3JpZ2luYWxOb2RlKHNmKSBhcyB0cy5Tb3VyY2VGaWxlO1xuXG4gICAgbGV0IHRyYW5zZm9ybXM6IER0c1RyYW5zZm9ybVtdfG51bGwgPSBudWxsO1xuICAgIGlmICh0aGlzLml2eURlY2xhcmF0aW9uVHJhbnNmb3Jtcy5oYXMob3JpZ2luYWxTZikpIHtcbiAgICAgIHRyYW5zZm9ybXMgPSBbXTtcbiAgICAgIHRyYW5zZm9ybXMucHVzaCh0aGlzLml2eURlY2xhcmF0aW9uVHJhbnNmb3Jtcy5nZXQob3JpZ2luYWxTZikhKTtcbiAgICB9XG4gICAgcmV0dXJuIHRyYW5zZm9ybXM7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY2xhcmF0aW9uVHJhbnNmb3JtRmFjdG9yeShcbiAgICB0cmFuc2Zvcm1SZWdpc3RyeTogRHRzVHJhbnNmb3JtUmVnaXN0cnksIGltcG9ydFJld3JpdGVyOiBJbXBvcnRSZXdyaXRlcixcbiAgICBpbXBvcnRQcmVmaXg/OiBzdHJpbmcpOiB0cy5UcmFuc2Zvcm1lckZhY3Rvcnk8dHMuU291cmNlRmlsZT4ge1xuICByZXR1cm4gKGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gbmV3IER0c1RyYW5zZm9ybWVyKGNvbnRleHQsIGltcG9ydFJld3JpdGVyLCBpbXBvcnRQcmVmaXgpO1xuICAgIHJldHVybiAoZmlsZU9yQnVuZGxlKSA9PiB7XG4gICAgICBpZiAodHMuaXNCdW5kbGUoZmlsZU9yQnVuZGxlKSkge1xuICAgICAgICAvLyBPbmx5IGF0dGVtcHQgdG8gdHJhbnNmb3JtIHNvdXJjZSBmaWxlcy5cbiAgICAgICAgcmV0dXJuIGZpbGVPckJ1bmRsZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1SZWdpc3RyeS5nZXRBbGxUcmFuc2Zvcm1zKGZpbGVPckJ1bmRsZSk7XG4gICAgICBpZiAodHJhbnNmb3JtcyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmlsZU9yQnVuZGxlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRyYW5zZm9ybWVyLnRyYW5zZm9ybShmaWxlT3JCdW5kbGUsIHRyYW5zZm9ybXMpO1xuICAgIH07XG4gIH07XG59XG5cbi8qKlxuICogUHJvY2Vzc2VzIC5kLnRzIGZpbGUgdGV4dCBhbmQgYWRkcyBzdGF0aWMgZmllbGQgZGVjbGFyYXRpb25zLCB3aXRoIHR5cGVzLlxuICovXG5jbGFzcyBEdHNUcmFuc2Zvcm1lciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBjdHg6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCwgcHJpdmF0ZSBpbXBvcnRSZXdyaXRlcjogSW1wb3J0UmV3cml0ZXIsXG4gICAgICBwcml2YXRlIGltcG9ydFByZWZpeD86IHN0cmluZykge31cblxuICAvKipcbiAgICogVHJhbnNmb3JtIHRoZSBkZWNsYXJhdGlvbiBmaWxlIGFuZCBhZGQgYW55IGRlY2xhcmF0aW9ucyB3aGljaCB3ZXJlIHJlY29yZGVkLlxuICAgKi9cbiAgdHJhbnNmb3JtKHNmOiB0cy5Tb3VyY2VGaWxlLCB0cmFuc2Zvcm1zOiBEdHNUcmFuc2Zvcm1bXSk6IHRzLlNvdXJjZUZpbGUge1xuICAgIGNvbnN0IGltcG9ydHMgPSBuZXcgSW1wb3J0TWFuYWdlcih0aGlzLmltcG9ydFJld3JpdGVyLCB0aGlzLmltcG9ydFByZWZpeCk7XG5cbiAgICBjb25zdCB2aXNpdG9yOiB0cy5WaXNpdG9yID0gKG5vZGU6IHRzLk5vZGUpOiB0cy5WaXNpdFJlc3VsdDx0cy5Ob2RlPiA9PiB7XG4gICAgICBpZiAodHMuaXNDbGFzc0RlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUNsYXNzRGVjbGFyYXRpb24obm9kZSwgdHJhbnNmb3JtcywgaW1wb3J0cyk7XG4gICAgICB9IGVsc2UgaWYgKHRzLmlzRnVuY3Rpb25EZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1GdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGUsIHRyYW5zZm9ybXMsIGltcG9ydHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIHJldHVybiBub2RlIGFzIGlzLlxuICAgICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgdmlzaXRvciwgdGhpcy5jdHgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBSZWN1cnNpdmVseSBzY2FuIHRocm91Z2ggdGhlIEFTVCBhbmQgcHJvY2VzcyBhbGwgbm9kZXMgYXMgZGVzaXJlZC5cbiAgICBzZiA9IHRzLnZpc2l0Tm9kZShzZiwgdmlzaXRvcik7XG5cbiAgICAvLyBBZGQgbmV3IGltcG9ydHMgZm9yIHRoaXMgZmlsZS5cbiAgICByZXR1cm4gYWRkSW1wb3J0cyhpbXBvcnRzLCBzZik7XG4gIH1cblxuICBwcml2YXRlIHRyYW5zZm9ybUNsYXNzRGVjbGFyYXRpb24oXG4gICAgICBjbGF6ejogdHMuQ2xhc3NEZWNsYXJhdGlvbiwgdHJhbnNmb3JtczogRHRzVHJhbnNmb3JtW10sXG4gICAgICBpbXBvcnRzOiBJbXBvcnRNYW5hZ2VyKTogdHMuQ2xhc3NEZWNsYXJhdGlvbiB7XG4gICAgbGV0IGVsZW1lbnRzOiB0cy5DbGFzc0VsZW1lbnRbXXxSZWFkb25seUFycmF5PHRzLkNsYXNzRWxlbWVudD4gPSBjbGF6ei5tZW1iZXJzO1xuICAgIGxldCBlbGVtZW50c0NoYW5nZWQgPSBmYWxzZTtcblxuICAgIGZvciAoY29uc3QgdHJhbnNmb3JtIG9mIHRyYW5zZm9ybXMpIHtcbiAgICAgIGlmICh0cmFuc2Zvcm0udHJhbnNmb3JtQ2xhc3NFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHJlcyA9IHRyYW5zZm9ybS50cmFuc2Zvcm1DbGFzc0VsZW1lbnQoZWxlbWVudHNbaV0sIGltcG9ydHMpO1xuICAgICAgICAgIGlmIChyZXMgIT09IGVsZW1lbnRzW2ldKSB7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnRzQ2hhbmdlZCkge1xuICAgICAgICAgICAgICBlbGVtZW50cyA9IFsuLi5lbGVtZW50c107XG4gICAgICAgICAgICAgIGVsZW1lbnRzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAoZWxlbWVudHMgYXMgdHMuQ2xhc3NFbGVtZW50W10pW2ldID0gcmVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBuZXdDbGF6ejogdHMuQ2xhc3NEZWNsYXJhdGlvbiA9IGNsYXp6O1xuXG4gICAgZm9yIChjb25zdCB0cmFuc2Zvcm0gb2YgdHJhbnNmb3Jtcykge1xuICAgICAgaWYgKHRyYW5zZm9ybS50cmFuc2Zvcm1DbGFzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIElmIG5vIER0c1RyYW5zZm9ybSBoYXMgY2hhbmdlZCB0aGUgY2xhc3MgeWV0LCB0aGVuIHRoZSAocG9zc2libHkgbXV0YXRlZCkgZWxlbWVudHMgaGF2ZVxuICAgICAgICAvLyBub3QgeWV0IGJlZW4gaW5jb3Jwb3JhdGVkLiBPdGhlcndpc2UsIGBuZXdDbGF6ei5tZW1iZXJzYCBob2xkcyB0aGUgbGF0ZXN0IGNsYXNzIG1lbWJlcnMuXG4gICAgICAgIGNvbnN0IGlucHV0TWVtYmVycyA9IChjbGF6eiA9PT0gbmV3Q2xhenogPyBlbGVtZW50cyA6IG5ld0NsYXp6Lm1lbWJlcnMpO1xuXG4gICAgICAgIG5ld0NsYXp6ID0gdHJhbnNmb3JtLnRyYW5zZm9ybUNsYXNzKG5ld0NsYXp6LCBpbnB1dE1lbWJlcnMsIGltcG9ydHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHNvbWUgZWxlbWVudHMgaGF2ZSBiZWVuIHRyYW5zZm9ybWVkIGJ1dCB0aGUgY2xhc3MgaXRzZWxmIGhhcyBub3QgYmVlbiB0cmFuc2Zvcm1lZCwgY3JlYXRlXG4gICAgLy8gYW4gdXBkYXRlZCBjbGFzcyBkZWNsYXJhdGlvbiB3aXRoIHRoZSB1cGRhdGVkIGVsZW1lbnRzLlxuICAgIGlmIChlbGVtZW50c0NoYW5nZWQgJiYgY2xhenogPT09IG5ld0NsYXp6KSB7XG4gICAgICBuZXdDbGF6eiA9IHRzLnVwZGF0ZUNsYXNzRGVjbGFyYXRpb24oXG4gICAgICAgICAgLyogbm9kZSAqLyBjbGF6eixcbiAgICAgICAgICAvKiBkZWNvcmF0b3JzICovIGNsYXp6LmRlY29yYXRvcnMsXG4gICAgICAgICAgLyogbW9kaWZpZXJzICovIGNsYXp6Lm1vZGlmaWVycyxcbiAgICAgICAgICAvKiBuYW1lICovIGNsYXp6Lm5hbWUsXG4gICAgICAgICAgLyogdHlwZVBhcmFtZXRlcnMgKi8gY2xhenoudHlwZVBhcmFtZXRlcnMsXG4gICAgICAgICAgLyogaGVyaXRhZ2VDbGF1c2VzICovIGNsYXp6Lmhlcml0YWdlQ2xhdXNlcyxcbiAgICAgICAgICAvKiBtZW1iZXJzICovIGVsZW1lbnRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q2xheno7XG4gIH1cblxuICBwcml2YXRlIHRyYW5zZm9ybUZ1bmN0aW9uRGVjbGFyYXRpb24oXG4gICAgICBkZWNsYXJhdGlvbjogdHMuRnVuY3Rpb25EZWNsYXJhdGlvbiwgdHJhbnNmb3JtczogRHRzVHJhbnNmb3JtW10sXG4gICAgICBpbXBvcnRzOiBJbXBvcnRNYW5hZ2VyKTogdHMuRnVuY3Rpb25EZWNsYXJhdGlvbiB7XG4gICAgbGV0IG5ld0RlY2wgPSBkZWNsYXJhdGlvbjtcblxuICAgIGZvciAoY29uc3QgdHJhbnNmb3JtIG9mIHRyYW5zZm9ybXMpIHtcbiAgICAgIGlmICh0cmFuc2Zvcm0udHJhbnNmb3JtRnVuY3Rpb25EZWNsYXJhdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5ld0RlY2wgPSB0cmFuc2Zvcm0udHJhbnNmb3JtRnVuY3Rpb25EZWNsYXJhdGlvbihuZXdEZWNsLCBpbXBvcnRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3RGVjbDtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEl2eURlY2xhcmF0aW9uRmllbGQge1xuICBuYW1lOiBzdHJpbmc7XG4gIHR5cGU6IFR5cGU7XG59XG5cbmV4cG9ydCBjbGFzcyBJdnlEZWNsYXJhdGlvbkR0c1RyYW5zZm9ybSBpbXBsZW1lbnRzIER0c1RyYW5zZm9ybSB7XG4gIHByaXZhdGUgZGVjbGFyYXRpb25GaWVsZHMgPSBuZXcgTWFwPENsYXNzRGVjbGFyYXRpb24sIEl2eURlY2xhcmF0aW9uRmllbGRbXT4oKTtcblxuICBhZGRGaWVsZHMoZGVjbDogQ2xhc3NEZWNsYXJhdGlvbiwgZmllbGRzOiBJdnlEZWNsYXJhdGlvbkZpZWxkW10pOiB2b2lkIHtcbiAgICB0aGlzLmRlY2xhcmF0aW9uRmllbGRzLnNldChkZWNsLCBmaWVsZHMpO1xuICB9XG5cbiAgdHJhbnNmb3JtQ2xhc3MoXG4gICAgICBjbGF6ejogdHMuQ2xhc3NEZWNsYXJhdGlvbiwgbWVtYmVyczogUmVhZG9ubHlBcnJheTx0cy5DbGFzc0VsZW1lbnQ+LFxuICAgICAgaW1wb3J0czogSW1wb3J0TWFuYWdlcik6IHRzLkNsYXNzRGVjbGFyYXRpb24ge1xuICAgIGNvbnN0IG9yaWdpbmFsID0gdHMuZ2V0T3JpZ2luYWxOb2RlKGNsYXp6KSBhcyBDbGFzc0RlY2xhcmF0aW9uO1xuXG4gICAgaWYgKCF0aGlzLmRlY2xhcmF0aW9uRmllbGRzLmhhcyhvcmlnaW5hbCkpIHtcbiAgICAgIHJldHVybiBjbGF6ejtcbiAgICB9XG4gICAgY29uc3QgZmllbGRzID0gdGhpcy5kZWNsYXJhdGlvbkZpZWxkcy5nZXQob3JpZ2luYWwpITtcblxuICAgIGNvbnN0IG5ld01lbWJlcnMgPSBmaWVsZHMubWFwKGRlY2wgPT4ge1xuICAgICAgY29uc3QgbW9kaWZpZXJzID0gW3RzLmNyZWF0ZU1vZGlmaWVyKHRzLlN5bnRheEtpbmQuU3RhdGljS2V5d29yZCldO1xuICAgICAgY29uc3QgdHlwZVJlZiA9IHRyYW5zbGF0ZVR5cGUoZGVjbC50eXBlLCBpbXBvcnRzKTtcbiAgICAgIG1hcmtGb3JFbWl0QXNTaW5nbGVMaW5lKHR5cGVSZWYpO1xuICAgICAgcmV0dXJuIHRzLmNyZWF0ZVByb3BlcnR5KFxuICAgICAgICAgIC8qIGRlY29yYXRvcnMgKi8gdW5kZWZpbmVkLFxuICAgICAgICAgIC8qIG1vZGlmaWVycyAqLyBtb2RpZmllcnMsXG4gICAgICAgICAgLyogbmFtZSAqLyBkZWNsLm5hbWUsXG4gICAgICAgICAgLyogcXVlc3Rpb25PckV4Y2xhbWF0aW9uVG9rZW4gKi8gdW5kZWZpbmVkLFxuICAgICAgICAgIC8qIHR5cGUgKi8gdHlwZVJlZixcbiAgICAgICAgICAvKiBpbml0aWFsaXplciAqLyB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRzLnVwZGF0ZUNsYXNzRGVjbGFyYXRpb24oXG4gICAgICAgIC8qIG5vZGUgKi8gY2xhenosXG4gICAgICAgIC8qIGRlY29yYXRvcnMgKi8gY2xhenouZGVjb3JhdG9ycyxcbiAgICAgICAgLyogbW9kaWZpZXJzICovIGNsYXp6Lm1vZGlmaWVycyxcbiAgICAgICAgLyogbmFtZSAqLyBjbGF6ei5uYW1lLFxuICAgICAgICAvKiB0eXBlUGFyYW1ldGVycyAqLyBjbGF6ei50eXBlUGFyYW1ldGVycyxcbiAgICAgICAgLyogaGVyaXRhZ2VDbGF1c2VzICovIGNsYXp6Lmhlcml0YWdlQ2xhdXNlcyxcbiAgICAgICAgLyogbWVtYmVycyAqL1suLi5tZW1iZXJzLCAuLi5uZXdNZW1iZXJzXSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFya0ZvckVtaXRBc1NpbmdsZUxpbmUobm9kZTogdHMuTm9kZSkge1xuICB0cy5zZXRFbWl0RmxhZ3Mobm9kZSwgdHMuRW1pdEZsYWdzLlNpbmdsZUxpbmUpO1xuICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgbWFya0ZvckVtaXRBc1NpbmdsZUxpbmUpO1xufVxuIl19