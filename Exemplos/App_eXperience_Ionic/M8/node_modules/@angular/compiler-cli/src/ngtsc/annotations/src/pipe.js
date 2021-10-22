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
        define("@angular/compiler-cli/src/ngtsc/annotations/src/pipe", ["require", "exports", "tslib", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/incremental/semantic_graph", "@angular/compiler-cli/src/ngtsc/metadata", "@angular/compiler-cli/src/ngtsc/perf", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/transform", "@angular/compiler-cli/src/ngtsc/annotations/src/diagnostics", "@angular/compiler-cli/src/ngtsc/annotations/src/factory", "@angular/compiler-cli/src/ngtsc/annotations/src/metadata", "@angular/compiler-cli/src/ngtsc/annotations/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PipeDecoratorHandler = exports.PipeSymbol = void 0;
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var semantic_graph_1 = require("@angular/compiler-cli/src/ngtsc/incremental/semantic_graph");
    var metadata_1 = require("@angular/compiler-cli/src/ngtsc/metadata");
    var perf_1 = require("@angular/compiler-cli/src/ngtsc/perf");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var transform_1 = require("@angular/compiler-cli/src/ngtsc/transform");
    var diagnostics_2 = require("@angular/compiler-cli/src/ngtsc/annotations/src/diagnostics");
    var factory_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/factory");
    var metadata_2 = require("@angular/compiler-cli/src/ngtsc/annotations/src/metadata");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/util");
    /**
     * Represents an Angular pipe.
     */
    var PipeSymbol = /** @class */ (function (_super) {
        tslib_1.__extends(PipeSymbol, _super);
        function PipeSymbol(decl, name) {
            var _this = _super.call(this, decl) || this;
            _this.name = name;
            return _this;
        }
        PipeSymbol.prototype.isPublicApiAffected = function (previousSymbol) {
            if (!(previousSymbol instanceof PipeSymbol)) {
                return true;
            }
            return this.name !== previousSymbol.name;
        };
        PipeSymbol.prototype.isTypeCheckApiAffected = function (previousSymbol) {
            return this.isPublicApiAffected(previousSymbol);
        };
        return PipeSymbol;
    }(semantic_graph_1.SemanticSymbol));
    exports.PipeSymbol = PipeSymbol;
    var PipeDecoratorHandler = /** @class */ (function () {
        function PipeDecoratorHandler(reflector, evaluator, metaRegistry, scopeRegistry, injectableRegistry, isCore, perf) {
            this.reflector = reflector;
            this.evaluator = evaluator;
            this.metaRegistry = metaRegistry;
            this.scopeRegistry = scopeRegistry;
            this.injectableRegistry = injectableRegistry;
            this.isCore = isCore;
            this.perf = perf;
            this.precedence = transform_1.HandlerPrecedence.PRIMARY;
            this.name = PipeDecoratorHandler.name;
        }
        PipeDecoratorHandler.prototype.detect = function (node, decorators) {
            if (!decorators) {
                return undefined;
            }
            var decorator = util_1.findAngularDecorator(decorators, 'Pipe', this.isCore);
            if (decorator !== undefined) {
                return {
                    trigger: decorator.node,
                    decorator: decorator,
                    metadata: decorator,
                };
            }
            else {
                return undefined;
            }
        };
        PipeDecoratorHandler.prototype.analyze = function (clazz, decorator) {
            this.perf.eventCount(perf_1.PerfEvent.AnalyzePipe);
            var name = clazz.name.text;
            var type = util_1.wrapTypeReference(this.reflector, clazz);
            var internalType = new compiler_1.WrappedNodeExpr(this.reflector.getInternalNameOfClass(clazz));
            if (decorator.args === null) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_NOT_CALLED, reflection_1.Decorator.nodeForError(decorator), "@Pipe must be called");
            }
            if (decorator.args.length !== 1) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, reflection_1.Decorator.nodeForError(decorator), '@Pipe must have exactly one argument');
            }
            var meta = util_1.unwrapExpression(decorator.args[0]);
            if (!ts.isObjectLiteralExpression(meta)) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARG_NOT_LITERAL, meta, '@Pipe must have a literal argument');
            }
            var pipe = reflection_1.reflectObjectLiteral(meta);
            if (!pipe.has('name')) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.PIPE_MISSING_NAME, meta, "@Pipe decorator is missing name field");
            }
            var pipeNameExpr = pipe.get('name');
            var pipeName = this.evaluator.evaluate(pipeNameExpr);
            if (typeof pipeName !== 'string') {
                throw diagnostics_2.createValueHasWrongTypeError(pipeNameExpr, pipeName, "@Pipe.name must be a string");
            }
            var pure = true;
            if (pipe.has('pure')) {
                var expr = pipe.get('pure');
                var pureValue = this.evaluator.evaluate(expr);
                if (typeof pureValue !== 'boolean') {
                    throw diagnostics_2.createValueHasWrongTypeError(expr, pureValue, "@Pipe.pure must be a boolean");
                }
                pure = pureValue;
            }
            return {
                analysis: {
                    meta: {
                        name: name,
                        type: type,
                        internalType: internalType,
                        typeArgumentCount: this.reflector.getGenericArityOfClass(clazz) || 0,
                        pipeName: pipeName,
                        deps: util_1.getValidConstructorDependencies(clazz, this.reflector, this.isCore),
                        pure: pure,
                    },
                    classMetadata: metadata_2.extractClassMetadata(clazz, this.reflector, this.isCore),
                    pipeNameExpr: pipeNameExpr,
                },
            };
        };
        PipeDecoratorHandler.prototype.symbol = function (node, analysis) {
            return new PipeSymbol(node, analysis.meta.name);
        };
        PipeDecoratorHandler.prototype.register = function (node, analysis) {
            var ref = new imports_1.Reference(node);
            this.metaRegistry.registerPipeMetadata({ type: metadata_1.MetaType.Pipe, ref: ref, name: analysis.meta.pipeName, nameExpr: analysis.pipeNameExpr });
            this.injectableRegistry.registerInjectable(node);
        };
        PipeDecoratorHandler.prototype.resolve = function (node) {
            var duplicateDeclData = this.scopeRegistry.getDuplicateDeclarations(node);
            if (duplicateDeclData !== null) {
                // This pipe was declared twice (or more).
                return {
                    diagnostics: [util_1.makeDuplicateDeclarationError(node, duplicateDeclData, 'Pipe')],
                };
            }
            return {};
        };
        PipeDecoratorHandler.prototype.compileFull = function (node, analysis) {
            var fac = factory_1.compileNgFactoryDefField(util_1.toFactoryMetadata(analysis.meta, compiler_1.FactoryTarget.Pipe));
            var def = compiler_1.compilePipeFromMetadata(analysis.meta);
            var classMetadata = analysis.classMetadata !== null ?
                compiler_1.compileClassMetadata(analysis.classMetadata).toStmt() :
                null;
            return util_1.compileResults(fac, def, classMetadata, 'ɵpipe');
        };
        PipeDecoratorHandler.prototype.compilePartial = function (node, analysis) {
            var fac = factory_1.compileDeclareFactory(util_1.toFactoryMetadata(analysis.meta, compiler_1.FactoryTarget.Pipe));
            var def = compiler_1.compileDeclarePipeFromMetadata(analysis.meta);
            var classMetadata = analysis.classMetadata !== null ?
                compiler_1.compileDeclareClassMetadata(analysis.classMetadata).toStmt() :
                null;
            return util_1.compileResults(fac, def, classMetadata, 'ɵpipe');
        };
        return PipeDecoratorHandler;
    }());
    exports.PipeDecoratorHandler = PipeDecoratorHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvYW5ub3RhdGlvbnMvc3JjL3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUVILDhDQUF5TjtJQUN6TiwrQkFBaUM7SUFFakMsMkVBQWtFO0lBQ2xFLG1FQUF3QztJQUN4Qyw2RkFBZ0U7SUFDaEUscUVBQW1GO0lBRW5GLDZEQUFtRDtJQUNuRCx5RUFBbUc7SUFFbkcsdUVBQWdJO0lBRWhJLDJGQUEyRDtJQUMzRCxtRkFBMEU7SUFDMUUscUZBQWdEO0lBQ2hELDZFQUFvTDtJQVFwTDs7T0FFRztJQUNIO1FBQWdDLHNDQUFjO1FBQzVDLG9CQUFZLElBQXNCLEVBQWtCLElBQVk7WUFBaEUsWUFDRSxrQkFBTSxJQUFJLENBQUMsU0FDWjtZQUZtRCxVQUFJLEdBQUosSUFBSSxDQUFROztRQUVoRSxDQUFDO1FBRVEsd0NBQW1CLEdBQTVCLFVBQTZCLGNBQThCO1lBQ3pELElBQUksQ0FBQyxDQUFDLGNBQWMsWUFBWSxVQUFVLENBQUMsRUFBRTtnQkFDM0MsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxjQUFjLENBQUMsSUFBSSxDQUFDO1FBQzNDLENBQUM7UUFFUSwyQ0FBc0IsR0FBL0IsVUFBZ0MsY0FBOEI7WUFDNUQsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNILGlCQUFDO0lBQUQsQ0FBQyxBQWhCRCxDQUFnQywrQkFBYyxHQWdCN0M7SUFoQlksZ0NBQVU7SUFrQnZCO1FBRUUsOEJBQ1ksU0FBeUIsRUFBVSxTQUEyQixFQUM5RCxZQUE4QixFQUFVLGFBQXVDLEVBQy9FLGtCQUEyQyxFQUFVLE1BQWUsRUFDcEUsSUFBa0I7WUFIbEIs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QUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxDQUFDO1lBQ1QsT0FBTyxxQkFBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFFRCw2Q0FBYyxHQUFkLFVBQWUsSUFBc0IsRUFBRSxRQUFtQztZQUN4RSxJQUFNLEdBQUcsR0FBRywrQkFBcUIsQ0FBQyx3QkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLHdCQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4RixJQUFNLEdBQUcsR0FBRyx5Q0FBOEIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUQsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsQ0FBQztnQkFDbkQsc0NBQTJCLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQzlELElBQUksQ0FBQztZQUNULE9BQU8scUJBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBQ0gsMkJBQUM7SUFBRCxDQUFDLEFBbElELElBa0lDO0lBbElZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvbXBpbGVDbGFzc01ldGFkYXRhLCBjb21waWxlRGVjbGFyZUNsYXNzTWV0YWRhdGEsIGNvbXBpbGVEZWNsYXJlUGlwZUZyb21NZXRhZGF0YSwgY29tcGlsZVBpcGVGcm9tTWV0YWRhdGEsIEZhY3RvcnlUYXJnZXQsIFIzQ2xhc3NNZXRhZGF0YSwgUjNQaXBlTWV0YWRhdGEsIFN0YXRlbWVudCwgV3JhcHBlZE5vZGVFeHByfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtFcnJvckNvZGUsIEZhdGFsRGlhZ25vc3RpY0Vycm9yfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge1NlbWFudGljU3ltYm9sfSBmcm9tICcuLi8uLi9pbmNyZW1lbnRhbC9zZW1hbnRpY19ncmFwaCc7XG5pbXBvcnQge0luamVjdGFibGVDbGFzc1JlZ2lzdHJ5LCBNZXRhZGF0YVJlZ2lzdHJ5LCBNZXRhVHlwZX0gZnJvbSAnLi4vLi4vbWV0YWRhdGEnO1xuaW1wb3J0IHtQYXJ0aWFsRXZhbHVhdG9yfSBmcm9tICcuLi8uLi9wYXJ0aWFsX2V2YWx1YXRvcic7XG5pbXBvcnQge1BlcmZFdmVudCwgUGVyZlJlY29yZGVyfSBmcm9tICcuLi8uLi9wZXJmJztcbmltcG9ydCB7Q2xhc3NEZWNsYXJhdGlvbiwgRGVjb3JhdG9yLCBSZWZsZWN0aW9uSG9zdCwgcmVmbGVjdE9iamVjdExpdGVyYWx9IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtMb2NhbE1vZHVsZVNjb3BlUmVnaXN0cnl9IGZyb20gJy4uLy4uL3Njb3BlJztcbmltcG9ydCB7QW5hbHlzaXNPdXRwdXQsIENvbXBpbGVSZXN1bHQsIERlY29yYXRvckhhbmRsZXIsIERldGVjdFJlc3VsdCwgSGFuZGxlclByZWNlZGVuY2UsIFJlc29sdmVSZXN1bHR9IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5cbmltcG9ydCB7Y3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvcn0gZnJvbSAnLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge2NvbXBpbGVEZWNsYXJlRmFjdG9yeSwgY29tcGlsZU5nRmFjdG9yeURlZkZpZWxkfSBmcm9tICcuL2ZhY3RvcnknO1xuaW1wb3J0IHtleHRyYWN0Q2xhc3NNZXRhZGF0YX0gZnJvbSAnLi9tZXRhZGF0YSc7XG5pbXBvcnQge2NvbXBpbGVSZXN1bHRzLCBmaW5kQW5ndWxhckRlY29yYXRvciwgZ2V0VmFsaWRDb25zdHJ1Y3RvckRlcGVuZGVuY2llcywgbWFrZUR1cGxpY2F0ZURlY2xhcmF0aW9uRXJyb3IsIHRvRmFjdG9yeU1ldGFkYXRhLCB1bndyYXBFeHByZXNzaW9uLCB3cmFwVHlwZVJlZmVyZW5jZX0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBQaXBlSGFuZGxlckRhdGEge1xuICBtZXRhOiBSM1BpcGVNZXRhZGF0YTtcbiAgY2xhc3NNZXRhZGF0YTogUjNDbGFzc01ldGFkYXRhfG51bGw7XG4gIHBpcGVOYW1lRXhwcjogdHMuRXhwcmVzc2lvbjtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIEFuZ3VsYXIgcGlwZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBpcGVTeW1ib2wgZXh0ZW5kcyBTZW1hbnRpY1N5bWJvbCB7XG4gIGNvbnN0cnVjdG9yKGRlY2w6IENsYXNzRGVjbGFyYXRpb24sIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcpIHtcbiAgICBzdXBlcihkZWNsKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzUHVibGljQXBpQWZmZWN0ZWQocHJldmlvdXNTeW1ib2w6IFNlbWFudGljU3ltYm9sKTogYm9vbGVhbiB7XG4gICAgaWYgKCEocHJldmlvdXNTeW1ib2wgaW5zdGFuY2VvZiBQaXBlU3ltYm9sKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubmFtZSAhPT0gcHJldmlvdXNTeW1ib2wubmFtZTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzVHlwZUNoZWNrQXBpQWZmZWN0ZWQocHJldmlvdXNTeW1ib2w6IFNlbWFudGljU3ltYm9sKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNQdWJsaWNBcGlBZmZlY3RlZChwcmV2aW91c1N5bWJvbCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVEZWNvcmF0b3JIYW5kbGVyIGltcGxlbWVudHNcbiAgICBEZWNvcmF0b3JIYW5kbGVyPERlY29yYXRvciwgUGlwZUhhbmRsZXJEYXRhLCBQaXBlU3ltYm9sLCB1bmtub3duPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSByZWZsZWN0b3I6IFJlZmxlY3Rpb25Ib3N0LCBwcml2YXRlIGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvcixcbiAgICAgIHByaXZhdGUgbWV0YVJlZ2lzdHJ5OiBNZXRhZGF0YVJlZ2lzdHJ5LCBwcml2YXRlIHNjb3BlUmVnaXN0cnk6IExvY2FsTW9kdWxlU2NvcGVSZWdpc3RyeSxcbiAgICAgIHByaXZhdGUgaW5qZWN0YWJsZVJlZ2lzdHJ5OiBJbmplY3RhYmxlQ2xhc3NSZWdpc3RyeSwgcHJpdmF0ZSBpc0NvcmU6IGJvb2xlYW4sXG4gICAgICBwcml2YXRlIHBlcmY6IFBlcmZSZWNvcmRlcikge31cblxuICByZWFkb25seSBwcmVjZWRlbmNlID0gSGFuZGxlclByZWNlZGVuY2UuUFJJTUFSWTtcbiAgcmVhZG9ubHkgbmFtZSA9IFBpcGVEZWNvcmF0b3JIYW5kbGVyLm5hbWU7XG5cbiAgZGV0ZWN0KG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGRlY29yYXRvcnM6IERlY29yYXRvcltdfG51bGwpOiBEZXRlY3RSZXN1bHQ8RGVjb3JhdG9yPnx1bmRlZmluZWQge1xuICAgIGlmICghZGVjb3JhdG9ycykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgZGVjb3JhdG9yID0gZmluZEFuZ3VsYXJEZWNvcmF0b3IoZGVjb3JhdG9ycywgJ1BpcGUnLCB0aGlzLmlzQ29yZSk7XG4gICAgaWYgKGRlY29yYXRvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0cmlnZ2VyOiBkZWNvcmF0b3Iubm9kZSxcbiAgICAgICAgZGVjb3JhdG9yOiBkZWNvcmF0b3IsXG4gICAgICAgIG1ldGFkYXRhOiBkZWNvcmF0b3IsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGFuYWx5emUoY2xheno6IENsYXNzRGVjbGFyYXRpb24sIGRlY29yYXRvcjogUmVhZG9ubHk8RGVjb3JhdG9yPik6XG4gICAgICBBbmFseXNpc091dHB1dDxQaXBlSGFuZGxlckRhdGE+IHtcbiAgICB0aGlzLnBlcmYuZXZlbnRDb3VudChQZXJmRXZlbnQuQW5hbHl6ZVBpcGUpO1xuXG4gICAgY29uc3QgbmFtZSA9IGNsYXp6Lm5hbWUudGV4dDtcbiAgICBjb25zdCB0eXBlID0gd3JhcFR5cGVSZWZlcmVuY2UodGhpcy5yZWZsZWN0b3IsIGNsYXp6KTtcbiAgICBjb25zdCBpbnRlcm5hbFR5cGUgPSBuZXcgV3JhcHBlZE5vZGVFeHByKHRoaXMucmVmbGVjdG9yLmdldEludGVybmFsTmFtZU9mQ2xhc3MoY2xhenopKTtcblxuICAgIGlmIChkZWNvcmF0b3IuYXJncyA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICAgIEVycm9yQ29kZS5ERUNPUkFUT1JfTk9UX0NBTExFRCwgRGVjb3JhdG9yLm5vZGVGb3JFcnJvcihkZWNvcmF0b3IpLFxuICAgICAgICAgIGBAUGlwZSBtdXN0IGJlIGNhbGxlZGApO1xuICAgIH1cbiAgICBpZiAoZGVjb3JhdG9yLmFyZ3MubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgICAgRXJyb3JDb2RlLkRFQ09SQVRPUl9BUklUWV9XUk9ORywgRGVjb3JhdG9yLm5vZGVGb3JFcnJvcihkZWNvcmF0b3IpLFxuICAgICAgICAgICdAUGlwZSBtdXN0IGhhdmUgZXhhY3RseSBvbmUgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgY29uc3QgbWV0YSA9IHVud3JhcEV4cHJlc3Npb24oZGVjb3JhdG9yLmFyZ3NbMF0pO1xuICAgIGlmICghdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihtZXRhKSkge1xuICAgICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICAgIEVycm9yQ29kZS5ERUNPUkFUT1JfQVJHX05PVF9MSVRFUkFMLCBtZXRhLCAnQFBpcGUgbXVzdCBoYXZlIGEgbGl0ZXJhbCBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBjb25zdCBwaXBlID0gcmVmbGVjdE9iamVjdExpdGVyYWwobWV0YSk7XG5cbiAgICBpZiAoIXBpcGUuaGFzKCduYW1lJykpIHtcbiAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICBFcnJvckNvZGUuUElQRV9NSVNTSU5HX05BTUUsIG1ldGEsIGBAUGlwZSBkZWNvcmF0b3IgaXMgbWlzc2luZyBuYW1lIGZpZWxkYCk7XG4gICAgfVxuICAgIGNvbnN0IHBpcGVOYW1lRXhwciA9IHBpcGUuZ2V0KCduYW1lJykhO1xuICAgIGNvbnN0IHBpcGVOYW1lID0gdGhpcy5ldmFsdWF0b3IuZXZhbHVhdGUocGlwZU5hbWVFeHByKTtcbiAgICBpZiAodHlwZW9mIHBpcGVOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgY3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvcihwaXBlTmFtZUV4cHIsIHBpcGVOYW1lLCBgQFBpcGUubmFtZSBtdXN0IGJlIGEgc3RyaW5nYCk7XG4gICAgfVxuXG4gICAgbGV0IHB1cmUgPSB0cnVlO1xuICAgIGlmIChwaXBlLmhhcygncHVyZScpKSB7XG4gICAgICBjb25zdCBleHByID0gcGlwZS5nZXQoJ3B1cmUnKSE7XG4gICAgICBjb25zdCBwdXJlVmFsdWUgPSB0aGlzLmV2YWx1YXRvci5ldmFsdWF0ZShleHByKTtcbiAgICAgIGlmICh0eXBlb2YgcHVyZVZhbHVlICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlVmFsdWVIYXNXcm9uZ1R5cGVFcnJvcihleHByLCBwdXJlVmFsdWUsIGBAUGlwZS5wdXJlIG11c3QgYmUgYSBib29sZWFuYCk7XG4gICAgICB9XG4gICAgICBwdXJlID0gcHVyZVZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBhbmFseXNpczoge1xuICAgICAgICBtZXRhOiB7XG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIGludGVybmFsVHlwZSxcbiAgICAgICAgICB0eXBlQXJndW1lbnRDb3VudDogdGhpcy5yZWZsZWN0b3IuZ2V0R2VuZXJpY0FyaXR5T2ZDbGFzcyhjbGF6eikgfHwgMCxcbiAgICAgICAgICBwaXBlTmFtZSxcbiAgICAgICAgICBkZXBzOiBnZXRWYWxpZENvbnN0cnVjdG9yRGVwZW5kZW5jaWVzKGNsYXp6LCB0aGlzLnJlZmxlY3RvciwgdGhpcy5pc0NvcmUpLFxuICAgICAgICAgIHB1cmUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTWV0YWRhdGE6IGV4dHJhY3RDbGFzc01ldGFkYXRhKGNsYXp6LCB0aGlzLnJlZmxlY3RvciwgdGhpcy5pc0NvcmUpLFxuICAgICAgICBwaXBlTmFtZUV4cHIsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBzeW1ib2wobm9kZTogQ2xhc3NEZWNsYXJhdGlvbiwgYW5hbHlzaXM6IFJlYWRvbmx5PFBpcGVIYW5kbGVyRGF0YT4pOiBQaXBlU3ltYm9sIHtcbiAgICByZXR1cm4gbmV3IFBpcGVTeW1ib2wobm9kZSwgYW5hbHlzaXMubWV0YS5uYW1lKTtcbiAgfVxuXG4gIHJlZ2lzdGVyKG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGFuYWx5c2lzOiBSZWFkb25seTxQaXBlSGFuZGxlckRhdGE+KTogdm9pZCB7XG4gICAgY29uc3QgcmVmID0gbmV3IFJlZmVyZW5jZShub2RlKTtcbiAgICB0aGlzLm1ldGFSZWdpc3RyeS5yZWdpc3RlclBpcGVNZXRhZGF0YShcbiAgICAgICAge3R5cGU6IE1ldGFUeXBlLlBpcGUsIHJlZiwgbmFtZTogYW5hbHlzaXMubWV0YS5waXBlTmFtZSwgbmFtZUV4cHI6IGFuYWx5c2lzLnBpcGVOYW1lRXhwcn0pO1xuXG4gICAgdGhpcy5pbmplY3RhYmxlUmVnaXN0cnkucmVnaXN0ZXJJbmplY3RhYmxlKG5vZGUpO1xuICB9XG5cbiAgcmVzb2x2ZShub2RlOiBDbGFzc0RlY2xhcmF0aW9uKTogUmVzb2x2ZVJlc3VsdDx1bmtub3duPiB7XG4gICAgY29uc3QgZHVwbGljYXRlRGVjbERhdGEgPSB0aGlzLnNjb3BlUmVnaXN0cnkuZ2V0RHVwbGljYXRlRGVjbGFyYXRpb25zKG5vZGUpO1xuICAgIGlmIChkdXBsaWNhdGVEZWNsRGF0YSAhPT0gbnVsbCkge1xuICAgICAgLy8gVGhpcyBwaXBlIHdhcyBkZWNsYXJlZCB0d2ljZSAob3IgbW9yZSkuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaWFnbm9zdGljczogW21ha2VEdXBsaWNhdGVEZWNsYXJhdGlvbkVycm9yKG5vZGUsIGR1cGxpY2F0ZURlY2xEYXRhLCAnUGlwZScpXSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29tcGlsZUZ1bGwobm9kZTogQ2xhc3NEZWNsYXJhdGlvbiwgYW5hbHlzaXM6IFJlYWRvbmx5PFBpcGVIYW5kbGVyRGF0YT4pOiBDb21waWxlUmVzdWx0W10ge1xuICAgIGNvbnN0IGZhYyA9IGNvbXBpbGVOZ0ZhY3RvcnlEZWZGaWVsZCh0b0ZhY3RvcnlNZXRhZGF0YShhbmFseXNpcy5tZXRhLCBGYWN0b3J5VGFyZ2V0LlBpcGUpKTtcbiAgICBjb25zdCBkZWYgPSBjb21waWxlUGlwZUZyb21NZXRhZGF0YShhbmFseXNpcy5tZXRhKTtcbiAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gYW5hbHlzaXMuY2xhc3NNZXRhZGF0YSAhPT0gbnVsbCA/XG4gICAgICAgIGNvbXBpbGVDbGFzc01ldGFkYXRhKGFuYWx5c2lzLmNsYXNzTWV0YWRhdGEpLnRvU3RtdCgpIDpcbiAgICAgICAgbnVsbDtcbiAgICByZXR1cm4gY29tcGlsZVJlc3VsdHMoZmFjLCBkZWYsIGNsYXNzTWV0YWRhdGEsICfJtXBpcGUnKTtcbiAgfVxuXG4gIGNvbXBpbGVQYXJ0aWFsKG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGFuYWx5c2lzOiBSZWFkb25seTxQaXBlSGFuZGxlckRhdGE+KTogQ29tcGlsZVJlc3VsdFtdIHtcbiAgICBjb25zdCBmYWMgPSBjb21waWxlRGVjbGFyZUZhY3RvcnkodG9GYWN0b3J5TWV0YWRhdGEoYW5hbHlzaXMubWV0YSwgRmFjdG9yeVRhcmdldC5QaXBlKSk7XG4gICAgY29uc3QgZGVmID0gY29tcGlsZURlY2xhcmVQaXBlRnJvbU1ldGFkYXRhKGFuYWx5c2lzLm1ldGEpO1xuICAgIGNvbnN0IGNsYXNzTWV0YWRhdGEgPSBhbmFseXNpcy5jbGFzc01ldGFkYXRhICE9PSBudWxsID9cbiAgICAgICAgY29tcGlsZURlY2xhcmVDbGFzc01ldGFkYXRhKGFuYWx5c2lzLmNsYXNzTWV0YWRhdGEpLnRvU3RtdCgpIDpcbiAgICAgICAgbnVsbDtcbiAgICByZXR1cm4gY29tcGlsZVJlc3VsdHMoZmFjLCBkZWYsIGNsYXNzTWV0YWRhdGEsICfJtXBpcGUnKTtcbiAgfVxufVxuIl19