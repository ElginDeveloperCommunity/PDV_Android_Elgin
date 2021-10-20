(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/rendering/esm5_rendering_formatter", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/translator", "@angular/compiler-cli/ngcc/src/host/esm2015_host", "@angular/compiler-cli/ngcc/src/rendering/esm_rendering_formatter"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Esm5RenderingFormatter = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var translator_1 = require("@angular/compiler-cli/src/ngtsc/translator");
    var esm2015_host_1 = require("@angular/compiler-cli/ngcc/src/host/esm2015_host");
    var esm_rendering_formatter_1 = require("@angular/compiler-cli/ngcc/src/rendering/esm_rendering_formatter");
    /**
     * A RenderingFormatter that works with files that use ECMAScript Module `import` and `export`
     * statements, but instead of `class` declarations it uses ES5 `function` wrappers for classes.
     */
    var Esm5RenderingFormatter = /** @class */ (function (_super) {
        tslib_1.__extends(Esm5RenderingFormatter, _super);
        function Esm5RenderingFormatter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Add the definitions, directly before the return statement, inside the IIFE of each decorated
         * class.
         */
        Esm5RenderingFormatter.prototype.addDefinitions = function (output, compiledClass, definitions) {
            var classSymbol = this.host.getClassSymbol(compiledClass.declaration);
            if (!classSymbol) {
                throw new Error("Compiled class \"" + compiledClass.name + "\" in \"" + compiledClass.declaration.getSourceFile()
                    .fileName + "\" does not have a valid syntax.\n" +
                    "Expected an ES5 IIFE wrapped function. But got:\n" +
                    compiledClass.declaration.getText());
            }
            var declarationStatement = esm2015_host_1.getContainingStatement(classSymbol.implementation.valueDeclaration);
            var iifeBody = declarationStatement.parent;
            if (!iifeBody || !ts.isBlock(iifeBody)) {
                throw new Error("Compiled class declaration is not inside an IIFE: " + compiledClass.name + " in " + compiledClass.declaration.getSourceFile().fileName);
            }
            var returnStatement = iifeBody.statements.find(ts.isReturnStatement);
            if (!returnStatement) {
                throw new Error("Compiled class wrapper IIFE does not have a return statement: " + compiledClass.name + " in " + compiledClass.declaration.getSourceFile().fileName);
            }
            var insertionPoint = returnStatement.getFullStart();
            output.appendLeft(insertionPoint, '\n' + definitions);
        };
        /**
         * Convert a `Statement` to JavaScript code in a format suitable for rendering by this formatter.
         *
         * @param stmt The `Statement` to print.
         * @param sourceFile A `ts.SourceFile` that provides context for the statement. See
         *     `ts.Printer#printNode()` for more info.
         * @param importManager The `ImportManager` to use for managing imports.
         *
         * @return The JavaScript code corresponding to `stmt` (in the appropriate format).
         */
        Esm5RenderingFormatter.prototype.printStatement = function (stmt, sourceFile, importManager) {
            var node = translator_1.translateStatement(stmt, importManager, { downlevelTaggedTemplates: true, downlevelVariableDeclarations: true });
            var code = this.printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
            return code;
        };
        return Esm5RenderingFormatter;
    }(esm_rendering_formatter_1.EsmRenderingFormatter));
    exports.Esm5RenderingFormatter = Esm5RenderingFormatter;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtNV9yZW5kZXJpbmdfZm9ybWF0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL3JlbmRlcmluZy9lc201X3JlbmRlcmluZ19mb3JtYXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVNBLCtCQUFpQztJQUVqQyx5RUFBZ0Y7SUFFaEYsaUZBQTREO0lBRTVELDRHQUFnRTtJQUVoRTs7O09BR0c7SUFDSDtRQUE0QyxrREFBcUI7UUFBakU7O1FBcURBLENBQUM7UUFwREM7OztXQUdHO1FBQ00sK0NBQWMsR0FBdkIsVUFBd0IsTUFBbUIsRUFBRSxhQUE0QixFQUFFLFdBQW1CO1lBRTVGLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4RSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNoQixNQUFNLElBQUksS0FBSyxDQUNYLHNCQUFtQixhQUFhLENBQUMsSUFBSSxnQkFDakMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUU7cUJBQ3BDLFFBQVEsdUNBQW1DO29CQUNwRCxtREFBbUQ7b0JBQ25ELGFBQWEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQzthQUMxQztZQUNELElBQU0sb0JBQW9CLEdBQ3RCLHFDQUFzQixDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUV4RSxJQUFNLFFBQVEsR0FBRyxvQkFBb0IsQ0FBQyxNQUFNLENBQUM7WUFDN0MsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXFELGFBQWEsQ0FBQyxJQUFJLFlBQ25GLGFBQWEsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBVSxDQUFDLENBQUM7YUFDM0Q7WUFFRCxJQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN2RSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLG1FQUNaLGFBQWEsQ0FBQyxJQUFJLFlBQU8sYUFBYSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFVLENBQUMsQ0FBQzthQUNwRjtZQUVELElBQU0sY0FBYyxHQUFHLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN0RCxNQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVEOzs7Ozs7Ozs7V0FTRztRQUNNLCtDQUFjLEdBQXZCLFVBQXdCLElBQWUsRUFBRSxVQUF5QixFQUFFLGFBQTRCO1lBRTlGLElBQU0sSUFBSSxHQUFHLCtCQUFrQixDQUMzQixJQUFJLEVBQUUsYUFBYSxFQUFFLEVBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLDZCQUE2QixFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7WUFDaEcsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRS9FLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNILDZCQUFDO0lBQUQsQ0FBQyxBQXJERCxDQUE0QywrQ0FBcUIsR0FxRGhFO0lBckRZLHdEQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtTdGF0ZW1lbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCBNYWdpY1N0cmluZyBmcm9tICdtYWdpYy1zdHJpbmcnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7SW1wb3J0TWFuYWdlciwgdHJhbnNsYXRlU3RhdGVtZW50fSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvdHJhbnNsYXRvcic7XG5pbXBvcnQge0NvbXBpbGVkQ2xhc3N9IGZyb20gJy4uL2FuYWx5c2lzL3R5cGVzJztcbmltcG9ydCB7Z2V0Q29udGFpbmluZ1N0YXRlbWVudH0gZnJvbSAnLi4vaG9zdC9lc20yMDE1X2hvc3QnO1xuXG5pbXBvcnQge0VzbVJlbmRlcmluZ0Zvcm1hdHRlcn0gZnJvbSAnLi9lc21fcmVuZGVyaW5nX2Zvcm1hdHRlcic7XG5cbi8qKlxuICogQSBSZW5kZXJpbmdGb3JtYXR0ZXIgdGhhdCB3b3JrcyB3aXRoIGZpbGVzIHRoYXQgdXNlIEVDTUFTY3JpcHQgTW9kdWxlIGBpbXBvcnRgIGFuZCBgZXhwb3J0YFxuICogc3RhdGVtZW50cywgYnV0IGluc3RlYWQgb2YgYGNsYXNzYCBkZWNsYXJhdGlvbnMgaXQgdXNlcyBFUzUgYGZ1bmN0aW9uYCB3cmFwcGVycyBmb3IgY2xhc3Nlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEVzbTVSZW5kZXJpbmdGb3JtYXR0ZXIgZXh0ZW5kcyBFc21SZW5kZXJpbmdGb3JtYXR0ZXIge1xuICAvKipcbiAgICogQWRkIHRoZSBkZWZpbml0aW9ucywgZGlyZWN0bHkgYmVmb3JlIHRoZSByZXR1cm4gc3RhdGVtZW50LCBpbnNpZGUgdGhlIElJRkUgb2YgZWFjaCBkZWNvcmF0ZWRcbiAgICogY2xhc3MuXG4gICAqL1xuICBvdmVycmlkZSBhZGREZWZpbml0aW9ucyhvdXRwdXQ6IE1hZ2ljU3RyaW5nLCBjb21waWxlZENsYXNzOiBDb21waWxlZENsYXNzLCBkZWZpbml0aW9uczogc3RyaW5nKTpcbiAgICAgIHZvaWQge1xuICAgIGNvbnN0IGNsYXNzU3ltYm9sID0gdGhpcy5ob3N0LmdldENsYXNzU3ltYm9sKGNvbXBpbGVkQ2xhc3MuZGVjbGFyYXRpb24pO1xuICAgIGlmICghY2xhc3NTeW1ib2wpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgQ29tcGlsZWQgY2xhc3MgXCIke2NvbXBpbGVkQ2xhc3MubmFtZX1cIiBpbiBcIiR7XG4gICAgICAgICAgICAgIGNvbXBpbGVkQ2xhc3MuZGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpXG4gICAgICAgICAgICAgICAgICAuZmlsZU5hbWV9XCIgZG9lcyBub3QgaGF2ZSBhIHZhbGlkIHN5bnRheC5cXG5gICtcbiAgICAgICAgICBgRXhwZWN0ZWQgYW4gRVM1IElJRkUgd3JhcHBlZCBmdW5jdGlvbi4gQnV0IGdvdDpcXG5gICtcbiAgICAgICAgICBjb21waWxlZENsYXNzLmRlY2xhcmF0aW9uLmdldFRleHQoKSk7XG4gICAgfVxuICAgIGNvbnN0IGRlY2xhcmF0aW9uU3RhdGVtZW50ID1cbiAgICAgICAgZ2V0Q29udGFpbmluZ1N0YXRlbWVudChjbGFzc1N5bWJvbC5pbXBsZW1lbnRhdGlvbi52YWx1ZURlY2xhcmF0aW9uKTtcblxuICAgIGNvbnN0IGlpZmVCb2R5ID0gZGVjbGFyYXRpb25TdGF0ZW1lbnQucGFyZW50O1xuICAgIGlmICghaWlmZUJvZHkgfHwgIXRzLmlzQmxvY2soaWlmZUJvZHkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbXBpbGVkIGNsYXNzIGRlY2xhcmF0aW9uIGlzIG5vdCBpbnNpZGUgYW4gSUlGRTogJHtjb21waWxlZENsYXNzLm5hbWV9IGluICR7XG4gICAgICAgICAgY29tcGlsZWRDbGFzcy5kZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWV9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmV0dXJuU3RhdGVtZW50ID0gaWlmZUJvZHkuc3RhdGVtZW50cy5maW5kKHRzLmlzUmV0dXJuU3RhdGVtZW50KTtcbiAgICBpZiAoIXJldHVyblN0YXRlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb21waWxlZCBjbGFzcyB3cmFwcGVyIElJRkUgZG9lcyBub3QgaGF2ZSBhIHJldHVybiBzdGF0ZW1lbnQ6ICR7XG4gICAgICAgICAgY29tcGlsZWRDbGFzcy5uYW1lfSBpbiAke2NvbXBpbGVkQ2xhc3MuZGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lfWApO1xuICAgIH1cblxuICAgIGNvbnN0IGluc2VydGlvblBvaW50ID0gcmV0dXJuU3RhdGVtZW50LmdldEZ1bGxTdGFydCgpO1xuICAgIG91dHB1dC5hcHBlbmRMZWZ0KGluc2VydGlvblBvaW50LCAnXFxuJyArIGRlZmluaXRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgYFN0YXRlbWVudGAgdG8gSmF2YVNjcmlwdCBjb2RlIGluIGEgZm9ybWF0IHN1aXRhYmxlIGZvciByZW5kZXJpbmcgYnkgdGhpcyBmb3JtYXR0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSBzdG10IFRoZSBgU3RhdGVtZW50YCB0byBwcmludC5cbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgQSBgdHMuU291cmNlRmlsZWAgdGhhdCBwcm92aWRlcyBjb250ZXh0IGZvciB0aGUgc3RhdGVtZW50LiBTZWVcbiAgICogICAgIGB0cy5QcmludGVyI3ByaW50Tm9kZSgpYCBmb3IgbW9yZSBpbmZvLlxuICAgKiBAcGFyYW0gaW1wb3J0TWFuYWdlciBUaGUgYEltcG9ydE1hbmFnZXJgIHRvIHVzZSBmb3IgbWFuYWdpbmcgaW1wb3J0cy5cbiAgICpcbiAgICogQHJldHVybiBUaGUgSmF2YVNjcmlwdCBjb2RlIGNvcnJlc3BvbmRpbmcgdG8gYHN0bXRgIChpbiB0aGUgYXBwcm9wcmlhdGUgZm9ybWF0KS5cbiAgICovXG4gIG92ZXJyaWRlIHByaW50U3RhdGVtZW50KHN0bXQ6IFN0YXRlbWVudCwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgaW1wb3J0TWFuYWdlcjogSW1wb3J0TWFuYWdlcik6XG4gICAgICBzdHJpbmcge1xuICAgIGNvbnN0IG5vZGUgPSB0cmFuc2xhdGVTdGF0ZW1lbnQoXG4gICAgICAgIHN0bXQsIGltcG9ydE1hbmFnZXIsIHtkb3dubGV2ZWxUYWdnZWRUZW1wbGF0ZXM6IHRydWUsIGRvd25sZXZlbFZhcmlhYmxlRGVjbGFyYXRpb25zOiB0cnVlfSk7XG4gICAgY29uc3QgY29kZSA9IHRoaXMucHJpbnRlci5wcmludE5vZGUodHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIG5vZGUsIHNvdXJjZUZpbGUpO1xuXG4gICAgcmV0dXJuIGNvZGU7XG4gIH1cbn1cbiJdfQ==