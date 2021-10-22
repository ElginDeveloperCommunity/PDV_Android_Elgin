(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/type_emitter", ["require", "exports", "typescript", "@angular/compiler-cli/src/ngtsc/imports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeEmitter = exports.canEmitType = void 0;
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var INELIGIBLE = {};
    /**
     * Determines whether the provided type can be emitted, which means that it can be safely emitted
     * into a different location.
     *
     * If this function returns true, a `TypeEmitter` should be able to succeed. Vice versa, if this
     * function returns false, then using the `TypeEmitter` should not be attempted as it is known to
     * fail.
     */
    function canEmitType(type, resolver) {
        return canEmitTypeWorker(type);
        function canEmitTypeWorker(type) {
            return visitNode(type) !== INELIGIBLE;
        }
        // To determine whether a type can be emitted, we have to recursively look through all type nodes.
        // If an unsupported type node is found at any position within the type, then the `INELIGIBLE`
        // constant is returned to stop the recursive walk as the type as a whole cannot be emitted in
        // that case. Otherwise, the result of visiting all child nodes determines the result. If no
        // ineligible type reference node is found then the walk returns `undefined`, indicating that
        // no type node was visited that could not be emitted.
        function visitNode(node) {
            // `import('module')` type nodes are not supported, as it may require rewriting the module
            // specifier which is currently not done.
            if (ts.isImportTypeNode(node)) {
                return INELIGIBLE;
            }
            // Emitting a type reference node in a different context requires that an import for the type
            // can be created. If a type reference node cannot be emitted, `INELIGIBLE` is returned to stop
            // the walk.
            if (ts.isTypeReferenceNode(node) && !canEmitTypeReference(node)) {
                return INELIGIBLE;
            }
            else {
                return ts.forEachChild(node, visitNode);
            }
        }
        function canEmitTypeReference(type) {
            var reference = resolver(type);
            // If the type could not be resolved, it can not be emitted.
            if (reference === null) {
                return false;
            }
            // If the type is a reference, consider the type to be eligible for emitting.
            if (reference instanceof imports_1.Reference) {
                return true;
            }
            // The type can be emitted if either it does not have any type arguments, or all of them can be
            // emitted.
            return type.typeArguments === undefined || type.typeArguments.every(canEmitTypeWorker);
        }
    }
    exports.canEmitType = canEmitType;
    /**
     * Given a `ts.TypeNode`, this class derives an equivalent `ts.TypeNode` that has been emitted into
     * a different context.
     *
     * For example, consider the following code:
     *
     * ```
     * import {NgIterable} from '@angular/core';
     *
     * class NgForOf<T, U extends NgIterable<T>> {}
     * ```
     *
     * Here, the generic type parameters `T` and `U` can be emitted into a different context, as the
     * type reference to `NgIterable` originates from an absolute module import so that it can be
     * emitted anywhere, using that same module import. The process of emitting translates the
     * `NgIterable` type reference to a type reference that is valid in the context in which it is
     * emitted, for example:
     *
     * ```
     * import * as i0 from '@angular/core';
     * import * as i1 from '@angular/common';
     *
     * const _ctor1: <T, U extends i0.NgIterable<T>>(o: Pick<i1.NgForOf<T, U>, 'ngForOf'>):
     * i1.NgForOf<T, U>;
     * ```
     *
     * Notice how the type reference for `NgIterable` has been translated into a qualified name,
     * referring to the namespace import that was created.
     */
    var TypeEmitter = /** @class */ (function () {
        function TypeEmitter(resolver, emitReference) {
            this.resolver = resolver;
            this.emitReference = emitReference;
        }
        TypeEmitter.prototype.emitType = function (type) {
            var _this = this;
            var typeReferenceTransformer = function (context) {
                var visitNode = function (node) {
                    if (ts.isImportTypeNode(node)) {
                        throw new Error('Unable to emit import type');
                    }
                    if (ts.isTypeReferenceNode(node)) {
                        return _this.emitTypeReference(node);
                    }
                    else if (ts.isLiteralExpression(node)) {
                        // TypeScript would typically take the emit text for a literal expression from the source
                        // file itself. As the type node is being emitted into a different file, however,
                        // TypeScript would extract the literal text from the wrong source file. To mitigate this
                        // issue the literal is cloned and explicitly marked as synthesized by setting its text
                        // range to a negative range, forcing TypeScript to determine the node's literal text from
                        // the synthesized node's text instead of the incorrect source file.
                        var clone = ts.getMutableClone(node);
                        ts.setTextRange(clone, { pos: -1, end: -1 });
                        return clone;
                    }
                    else {
                        return ts.visitEachChild(node, visitNode, context);
                    }
                };
                return function (node) { return ts.visitNode(node, visitNode); };
            };
            return ts.transform(type, [typeReferenceTransformer]).transformed[0];
        };
        TypeEmitter.prototype.emitTypeReference = function (type) {
            var _this = this;
            // Determine the reference that the type corresponds with.
            var reference = this.resolver(type);
            if (reference === null) {
                throw new Error('Unable to emit an unresolved reference');
            }
            // Emit the type arguments, if any.
            var typeArguments = undefined;
            if (type.typeArguments !== undefined) {
                typeArguments = ts.createNodeArray(type.typeArguments.map(function (typeArg) { return _this.emitType(typeArg); }));
            }
            // Emit the type name.
            var typeName = type.typeName;
            if (reference instanceof imports_1.Reference) {
                var emittedType = this.emitReference(reference);
                if (!ts.isTypeReferenceNode(emittedType)) {
                    throw new Error("Expected TypeReferenceNode for emitted reference, got " + ts.SyntaxKind[emittedType.kind]);
                }
                typeName = emittedType.typeName;
            }
            return ts.updateTypeReferenceNode(type, typeName, typeArguments);
        };
        return TypeEmitter;
    }());
    exports.TypeEmitter = TypeEmitter;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZV9lbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy90eXBlY2hlY2svc3JjL3R5cGVfZW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwrQkFBaUM7SUFDakMsbUVBQXdDO0lBc0J4QyxJQUFNLFVBQVUsR0FBZSxFQUFnQixDQUFDO0lBRWhEOzs7Ozs7O09BT0c7SUFDSCxTQUFnQixXQUFXLENBQUMsSUFBaUIsRUFBRSxRQUErQjtRQUM1RSxPQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRS9CLFNBQVMsaUJBQWlCLENBQUMsSUFBaUI7WUFDMUMsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxDQUFDO1FBQ3hDLENBQUM7UUFFRCxrR0FBa0c7UUFDbEcsOEZBQThGO1FBQzlGLDhGQUE4RjtRQUM5Riw0RkFBNEY7UUFDNUYsNkZBQTZGO1FBQzdGLHNEQUFzRDtRQUN0RCxTQUFTLFNBQVMsQ0FBQyxJQUFhO1lBQzlCLDBGQUEwRjtZQUMxRix5Q0FBeUM7WUFDekMsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzdCLE9BQU8sVUFBVSxDQUFDO2FBQ25CO1lBRUQsNkZBQTZGO1lBQzdGLCtGQUErRjtZQUMvRixZQUFZO1lBQ1osSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDL0QsT0FBTyxVQUFVLENBQUM7YUFDbkI7aUJBQU07Z0JBQ0wsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzthQUN6QztRQUNILENBQUM7UUFFRCxTQUFTLG9CQUFvQixDQUFDLElBQTBCO1lB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T0FBTyxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQyxDQUFDO2FBQy9GO1lBRUQsc0JBQXNCO1lBQ3RCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDN0IsSUFBSSxTQUFTLFlBQVksbUJBQVMsRUFBRTtnQkFDbEMsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDeEMsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFDWixFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO2lCQUN4QztnQkFFRCxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQzthQUNqQztZQUVELE9BQU8sRUFBRSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUNILGtCQUFDO0lBQUQsQ0FBQyxBQXhFRCxJQXdFQztJQXhFWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5cbi8qKlxuICogQSByZXNvbHZlZCB0eXBlIHJlZmVyZW5jZSBjYW4gZWl0aGVyIGJlIGEgYFJlZmVyZW5jZWAsIHRoZSBvcmlnaW5hbCBgdHMuVHlwZVJlZmVyZW5jZU5vZGVgIGl0c2VsZlxuICogb3IgbnVsbC4gQSB2YWx1ZSBvZiBudWxsIGluZGljYXRlcyB0aGF0IG5vIHJlZmVyZW5jZSBjb3VsZCBiZSByZXNvbHZlZCBvciB0aGF0IHRoZSByZWZlcmVuY2UgY2FuXG4gKiBub3QgYmUgZW1pdHRlZC5cbiAqL1xuZXhwb3J0IHR5cGUgUmVzb2x2ZWRUeXBlUmVmZXJlbmNlID0gUmVmZXJlbmNlfHRzLlR5cGVSZWZlcmVuY2VOb2RlfG51bGw7XG5cbi8qKlxuICogQSB0eXBlIHJlZmVyZW5jZSByZXNvbHZlciBmdW5jdGlvbiBpcyByZXNwb25zaWJsZSBmb3IgZmluZGluZyB0aGUgZGVjbGFyYXRpb24gb2YgdGhlIHR5cGVcbiAqIHJlZmVyZW5jZSBhbmQgdmVyaWZ5aW5nIHdoZXRoZXIgaXQgY2FuIGJlIGVtaXR0ZWQuXG4gKi9cbmV4cG9ydCB0eXBlIFR5cGVSZWZlcmVuY2VSZXNvbHZlciA9ICh0eXBlOiB0cy5UeXBlUmVmZXJlbmNlTm9kZSkgPT4gUmVzb2x2ZWRUeXBlUmVmZXJlbmNlO1xuXG4vKipcbiAqIEEgbWFya2VyIHRvIGluZGljYXRlIHRoYXQgYSB0eXBlIHJlZmVyZW5jZSBpcyBpbmVsaWdpYmxlIGZvciBlbWl0dGluZy4gVGhpcyBuZWVkcyB0byBiZSB0cnV0aHlcbiAqIGFzIGl0J3MgcmV0dXJuZWQgZnJvbSBgdHMuZm9yRWFjaENoaWxkYCwgd2hpY2ggb25seSByZXR1cm5zIHRydXRoeSB2YWx1ZXMuXG4gKi9cbnR5cGUgSU5FTElHSUJMRSA9IHtcbiAgX19icmFuZDogJ2luZWxpZ2libGUnO1xufTtcbmNvbnN0IElORUxJR0lCTEU6IElORUxJR0lCTEUgPSB7fSBhcyBJTkVMSUdJQkxFO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcHJvdmlkZWQgdHlwZSBjYW4gYmUgZW1pdHRlZCwgd2hpY2ggbWVhbnMgdGhhdCBpdCBjYW4gYmUgc2FmZWx5IGVtaXR0ZWRcbiAqIGludG8gYSBkaWZmZXJlbnQgbG9jYXRpb24uXG4gKlxuICogSWYgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRydWUsIGEgYFR5cGVFbWl0dGVyYCBzaG91bGQgYmUgYWJsZSB0byBzdWNjZWVkLiBWaWNlIHZlcnNhLCBpZiB0aGlzXG4gKiBmdW5jdGlvbiByZXR1cm5zIGZhbHNlLCB0aGVuIHVzaW5nIHRoZSBgVHlwZUVtaXR0ZXJgIHNob3VsZCBub3QgYmUgYXR0ZW1wdGVkIGFzIGl0IGlzIGtub3duIHRvXG4gKiBmYWlsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuRW1pdFR5cGUodHlwZTogdHMuVHlwZU5vZGUsIHJlc29sdmVyOiBUeXBlUmVmZXJlbmNlUmVzb2x2ZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNhbkVtaXRUeXBlV29ya2VyKHR5cGUpO1xuXG4gIGZ1bmN0aW9uIGNhbkVtaXRUeXBlV29ya2VyKHR5cGU6IHRzLlR5cGVOb2RlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHZpc2l0Tm9kZSh0eXBlKSAhPT0gSU5FTElHSUJMRTtcbiAgfVxuXG4gIC8vIFRvIGRldGVybWluZSB3aGV0aGVyIGEgdHlwZSBjYW4gYmUgZW1pdHRlZCwgd2UgaGF2ZSB0byByZWN1cnNpdmVseSBsb29rIHRocm91Z2ggYWxsIHR5cGUgbm9kZXMuXG4gIC8vIElmIGFuIHVuc3VwcG9ydGVkIHR5cGUgbm9kZSBpcyBmb3VuZCBhdCBhbnkgcG9zaXRpb24gd2l0aGluIHRoZSB0eXBlLCB0aGVuIHRoZSBgSU5FTElHSUJMRWBcbiAgLy8gY29uc3RhbnQgaXMgcmV0dXJuZWQgdG8gc3RvcCB0aGUgcmVjdXJzaXZlIHdhbGsgYXMgdGhlIHR5cGUgYXMgYSB3aG9sZSBjYW5ub3QgYmUgZW1pdHRlZCBpblxuICAvLyB0aGF0IGNhc2UuIE90aGVyd2lzZSwgdGhlIHJlc3VsdCBvZiB2aXNpdGluZyBhbGwgY2hpbGQgbm9kZXMgZGV0ZXJtaW5lcyB0aGUgcmVzdWx0LiBJZiBub1xuICAvLyBpbmVsaWdpYmxlIHR5cGUgcmVmZXJlbmNlIG5vZGUgaXMgZm91bmQgdGhlbiB0aGUgd2FsayByZXR1cm5zIGB1bmRlZmluZWRgLCBpbmRpY2F0aW5nIHRoYXRcbiAgLy8gbm8gdHlwZSBub2RlIHdhcyB2aXNpdGVkIHRoYXQgY291bGQgbm90IGJlIGVtaXR0ZWQuXG4gIGZ1bmN0aW9uIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogSU5FTElHSUJMRXx1bmRlZmluZWQge1xuICAgIC8vIGBpbXBvcnQoJ21vZHVsZScpYCB0eXBlIG5vZGVzIGFyZSBub3Qgc3VwcG9ydGVkLCBhcyBpdCBtYXkgcmVxdWlyZSByZXdyaXRpbmcgdGhlIG1vZHVsZVxuICAgIC8vIHNwZWNpZmllciB3aGljaCBpcyBjdXJyZW50bHkgbm90IGRvbmUuXG4gICAgaWYgKHRzLmlzSW1wb3J0VHlwZU5vZGUobm9kZSkpIHtcbiAgICAgIHJldHVybiBJTkVMSUdJQkxFO1xuICAgIH1cblxuICAgIC8vIEVtaXR0aW5nIGEgdHlwZSByZWZlcmVuY2Ugbm9kZSBpbiBhIGRpZmZlcmVudCBjb250ZXh0IHJlcXVpcmVzIHRoYXQgYW4gaW1wb3J0IGZvciB0aGUgdHlwZVxuICAgIC8vIGNhbiBiZSBjcmVhdGVkLiBJZiBhIHR5cGUgcmVmZXJlbmNlIG5vZGUgY2Fubm90IGJlIGVtaXR0ZWQsIGBJTkVMSUdJQkxFYCBpcyByZXR1cm5lZCB0byBzdG9wXG4gICAgLy8gdGhlIHdhbGsuXG4gICAgaWYgKHRzLmlzVHlwZVJlZmVyZW5jZU5vZGUobm9kZSkgJiYgIWNhbkVtaXRUeXBlUmVmZXJlbmNlKG5vZGUpKSB7XG4gICAgICByZXR1cm4gSU5FTElHSUJMRTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRzLmZvckVhY2hDaGlsZChub2RlLCB2aXNpdE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbkVtaXRUeXBlUmVmZXJlbmNlKHR5cGU6IHRzLlR5cGVSZWZlcmVuY2VOb2RlKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcmVmZXJlbmNlID0gcmVzb2x2ZXIodHlwZSk7XG5cbiAgICAvLyBJZiB0aGUgdHlwZSBjb3VsZCBub3QgYmUgcmVzb2x2ZWQsIGl0IGNhbiBub3QgYmUgZW1pdHRlZC5cbiAgICBpZiAocmVmZXJlbmNlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHR5cGUgaXMgYSByZWZlcmVuY2UsIGNvbnNpZGVyIHRoZSB0eXBlIHRvIGJlIGVsaWdpYmxlIGZvciBlbWl0dGluZy5cbiAgICBpZiAocmVmZXJlbmNlIGluc3RhbmNlb2YgUmVmZXJlbmNlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBUaGUgdHlwZSBjYW4gYmUgZW1pdHRlZCBpZiBlaXRoZXIgaXQgZG9lcyBub3QgaGF2ZSBhbnkgdHlwZSBhcmd1bWVudHMsIG9yIGFsbCBvZiB0aGVtIGNhbiBiZVxuICAgIC8vIGVtaXR0ZWQuXG4gICAgcmV0dXJuIHR5cGUudHlwZUFyZ3VtZW50cyA9PT0gdW5kZWZpbmVkIHx8IHR5cGUudHlwZUFyZ3VtZW50cy5ldmVyeShjYW5FbWl0VHlwZVdvcmtlcik7XG4gIH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhIGB0cy5UeXBlTm9kZWAsIHRoaXMgY2xhc3MgZGVyaXZlcyBhbiBlcXVpdmFsZW50IGB0cy5UeXBlTm9kZWAgdGhhdCBoYXMgYmVlbiBlbWl0dGVkIGludG9cbiAqIGEgZGlmZmVyZW50IGNvbnRleHQuXG4gKlxuICogRm9yIGV4YW1wbGUsIGNvbnNpZGVyIHRoZSBmb2xsb3dpbmcgY29kZTpcbiAqXG4gKiBgYGBcbiAqIGltcG9ydCB7TmdJdGVyYWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gKlxuICogY2xhc3MgTmdGb3JPZjxULCBVIGV4dGVuZHMgTmdJdGVyYWJsZTxUPj4ge31cbiAqIGBgYFxuICpcbiAqIEhlcmUsIHRoZSBnZW5lcmljIHR5cGUgcGFyYW1ldGVycyBgVGAgYW5kIGBVYCBjYW4gYmUgZW1pdHRlZCBpbnRvIGEgZGlmZmVyZW50IGNvbnRleHQsIGFzIHRoZVxuICogdHlwZSByZWZlcmVuY2UgdG8gYE5nSXRlcmFibGVgIG9yaWdpbmF0ZXMgZnJvbSBhbiBhYnNvbHV0ZSBtb2R1bGUgaW1wb3J0IHNvIHRoYXQgaXQgY2FuIGJlXG4gKiBlbWl0dGVkIGFueXdoZXJlLCB1c2luZyB0aGF0IHNhbWUgbW9kdWxlIGltcG9ydC4gVGhlIHByb2Nlc3Mgb2YgZW1pdHRpbmcgdHJhbnNsYXRlcyB0aGVcbiAqIGBOZ0l0ZXJhYmxlYCB0eXBlIHJlZmVyZW5jZSB0byBhIHR5cGUgcmVmZXJlbmNlIHRoYXQgaXMgdmFsaWQgaW4gdGhlIGNvbnRleHQgaW4gd2hpY2ggaXQgaXNcbiAqIGVtaXR0ZWQsIGZvciBleGFtcGxlOlxuICpcbiAqIGBgYFxuICogaW1wb3J0ICogYXMgaTAgZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gKiBpbXBvcnQgKiBhcyBpMSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuICpcbiAqIGNvbnN0IF9jdG9yMTogPFQsIFUgZXh0ZW5kcyBpMC5OZ0l0ZXJhYmxlPFQ+PihvOiBQaWNrPGkxLk5nRm9yT2Y8VCwgVT4sICduZ0Zvck9mJz4pOlxuICogaTEuTmdGb3JPZjxULCBVPjtcbiAqIGBgYFxuICpcbiAqIE5vdGljZSBob3cgdGhlIHR5cGUgcmVmZXJlbmNlIGZvciBgTmdJdGVyYWJsZWAgaGFzIGJlZW4gdHJhbnNsYXRlZCBpbnRvIGEgcXVhbGlmaWVkIG5hbWUsXG4gKiByZWZlcnJpbmcgdG8gdGhlIG5hbWVzcGFjZSBpbXBvcnQgdGhhdCB3YXMgY3JlYXRlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFR5cGVFbWl0dGVyIHtcbiAgLyoqXG4gICAqIFJlc29sdmVyIGZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgYSBgUmVmZXJlbmNlYCBjb3JyZXNwb25kaW5nIHdpdGggYSBgdHMuVHlwZVJlZmVyZW5jZU5vZGVgLlxuICAgKi9cbiAgcHJpdmF0ZSByZXNvbHZlcjogVHlwZVJlZmVyZW5jZVJlc29sdmVyO1xuXG4gIC8qKlxuICAgKiBHaXZlbiBhIGBSZWZlcmVuY2VgLCB0aGlzIGZ1bmN0aW9uIGlzIHJlc3BvbnNpYmxlIGZvciB0aGUgYWN0dWFsIGVtaXR0aW5nIHdvcmsuIEl0IHNob3VsZFxuICAgKiBwcm9kdWNlIGEgYHRzLlR5cGVOb2RlYCB0aGF0IGlzIHZhbGlkIHdpdGhpbiB0aGUgZGVzaXJlZCBjb250ZXh0LlxuICAgKi9cbiAgcHJpdmF0ZSBlbWl0UmVmZXJlbmNlOiAocmVmOiBSZWZlcmVuY2UpID0+IHRzLlR5cGVOb2RlO1xuXG4gIGNvbnN0cnVjdG9yKHJlc29sdmVyOiBUeXBlUmVmZXJlbmNlUmVzb2x2ZXIsIGVtaXRSZWZlcmVuY2U6IChyZWY6IFJlZmVyZW5jZSkgPT4gdHMuVHlwZU5vZGUpIHtcbiAgICB0aGlzLnJlc29sdmVyID0gcmVzb2x2ZXI7XG4gICAgdGhpcy5lbWl0UmVmZXJlbmNlID0gZW1pdFJlZmVyZW5jZTtcbiAgfVxuXG4gIGVtaXRUeXBlKHR5cGU6IHRzLlR5cGVOb2RlKTogdHMuVHlwZU5vZGUge1xuICAgIGNvbnN0IHR5cGVSZWZlcmVuY2VUcmFuc2Zvcm1lcjogdHMuVHJhbnNmb3JtZXJGYWN0b3J5PHRzLlR5cGVOb2RlPiA9IGNvbnRleHQgPT4ge1xuICAgICAgY29uc3QgdmlzaXROb2RlID0gKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlID0+IHtcbiAgICAgICAgaWYgKHRzLmlzSW1wb3J0VHlwZU5vZGUobm9kZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBlbWl0IGltcG9ydCB0eXBlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHMuaXNUeXBlUmVmZXJlbmNlTm9kZShub2RlKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVtaXRUeXBlUmVmZXJlbmNlKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRzLmlzTGl0ZXJhbEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgICAgICAvLyBUeXBlU2NyaXB0IHdvdWxkIHR5cGljYWxseSB0YWtlIHRoZSBlbWl0IHRleHQgZm9yIGEgbGl0ZXJhbCBleHByZXNzaW9uIGZyb20gdGhlIHNvdXJjZVxuICAgICAgICAgIC8vIGZpbGUgaXRzZWxmLiBBcyB0aGUgdHlwZSBub2RlIGlzIGJlaW5nIGVtaXR0ZWQgaW50byBhIGRpZmZlcmVudCBmaWxlLCBob3dldmVyLFxuICAgICAgICAgIC8vIFR5cGVTY3JpcHQgd291bGQgZXh0cmFjdCB0aGUgbGl0ZXJhbCB0ZXh0IGZyb20gdGhlIHdyb25nIHNvdXJjZSBmaWxlLiBUbyBtaXRpZ2F0ZSB0aGlzXG4gICAgICAgICAgLy8gaXNzdWUgdGhlIGxpdGVyYWwgaXMgY2xvbmVkIGFuZCBleHBsaWNpdGx5IG1hcmtlZCBhcyBzeW50aGVzaXplZCBieSBzZXR0aW5nIGl0cyB0ZXh0XG4gICAgICAgICAgLy8gcmFuZ2UgdG8gYSBuZWdhdGl2ZSByYW5nZSwgZm9yY2luZyBUeXBlU2NyaXB0IHRvIGRldGVybWluZSB0aGUgbm9kZSdzIGxpdGVyYWwgdGV4dCBmcm9tXG4gICAgICAgICAgLy8gdGhlIHN5bnRoZXNpemVkIG5vZGUncyB0ZXh0IGluc3RlYWQgb2YgdGhlIGluY29ycmVjdCBzb3VyY2UgZmlsZS5cbiAgICAgICAgICBjb25zdCBjbG9uZSA9IHRzLmdldE11dGFibGVDbG9uZShub2RlKTtcbiAgICAgICAgICB0cy5zZXRUZXh0UmFuZ2UoY2xvbmUsIHtwb3M6IC0xLCBlbmQ6IC0xfSk7XG4gICAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChub2RlLCB2aXNpdE5vZGUsIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIG5vZGUgPT4gdHMudmlzaXROb2RlKG5vZGUsIHZpc2l0Tm9kZSk7XG4gICAgfTtcbiAgICByZXR1cm4gdHMudHJhbnNmb3JtKHR5cGUsIFt0eXBlUmVmZXJlbmNlVHJhbnNmb3JtZXJdKS50cmFuc2Zvcm1lZFswXTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdFR5cGVSZWZlcmVuY2UodHlwZTogdHMuVHlwZVJlZmVyZW5jZU5vZGUpOiB0cy5UeXBlTm9kZSB7XG4gICAgLy8gRGV0ZXJtaW5lIHRoZSByZWZlcmVuY2UgdGhhdCB0aGUgdHlwZSBjb3JyZXNwb25kcyB3aXRoLlxuICAgIGNvbnN0IHJlZmVyZW5jZSA9IHRoaXMucmVzb2x2ZXIodHlwZSk7XG4gICAgaWYgKHJlZmVyZW5jZSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZW1pdCBhbiB1bnJlc29sdmVkIHJlZmVyZW5jZScpO1xuICAgIH1cblxuICAgIC8vIEVtaXQgdGhlIHR5cGUgYXJndW1lbnRzLCBpZiBhbnkuXG4gICAgbGV0IHR5cGVBcmd1bWVudHM6IHRzLk5vZGVBcnJheTx0cy5UeXBlTm9kZT58dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlLnR5cGVBcmd1bWVudHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdHlwZUFyZ3VtZW50cyA9IHRzLmNyZWF0ZU5vZGVBcnJheSh0eXBlLnR5cGVBcmd1bWVudHMubWFwKHR5cGVBcmcgPT4gdGhpcy5lbWl0VHlwZSh0eXBlQXJnKSkpO1xuICAgIH1cblxuICAgIC8vIEVtaXQgdGhlIHR5cGUgbmFtZS5cbiAgICBsZXQgdHlwZU5hbWUgPSB0eXBlLnR5cGVOYW1lO1xuICAgIGlmIChyZWZlcmVuY2UgaW5zdGFuY2VvZiBSZWZlcmVuY2UpIHtcbiAgICAgIGNvbnN0IGVtaXR0ZWRUeXBlID0gdGhpcy5lbWl0UmVmZXJlbmNlKHJlZmVyZW5jZSk7XG4gICAgICBpZiAoIXRzLmlzVHlwZVJlZmVyZW5jZU5vZGUoZW1pdHRlZFR5cGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgVHlwZVJlZmVyZW5jZU5vZGUgZm9yIGVtaXR0ZWQgcmVmZXJlbmNlLCBnb3QgJHtcbiAgICAgICAgICAgIHRzLlN5bnRheEtpbmRbZW1pdHRlZFR5cGUua2luZF19YCk7XG4gICAgICB9XG5cbiAgICAgIHR5cGVOYW1lID0gZW1pdHRlZFR5cGUudHlwZU5hbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRzLnVwZGF0ZVR5cGVSZWZlcmVuY2VOb2RlKHR5cGUsIHR5cGVOYW1lLCB0eXBlQXJndW1lbnRzKTtcbiAgfVxufVxuIl19