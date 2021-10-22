/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { StaticSymbol } from '../aot/static_symbol';
import { BindingForm, convertActionBinding, convertPropertyBinding, convertPropertyBindingBuiltins, EventHandlerVars } from '../compiler_util/expression_converter';
import * as o from '../output/output_ast';
import { templateVisitAll } from '../template_parser/template_ast';
/**
 * Generates code that is used to type check templates.
 */
export class TypeCheckCompiler {
    constructor(options, reflector) {
        this.options = options;
        this.reflector = reflector;
    }
    /**
     * Important notes:
     * - This must not produce new `import` statements, but only refer to types outside
     *   of the file via the variables provided via externalReferenceVars.
     *   This allows Typescript to reuse the old program's structure as no imports have changed.
     * - This must not produce any exports, as this would pollute the .d.ts file
     *   and also violate the point above.
     */
    compileComponent(componentId, component, template, usedPipes, externalReferenceVars, ctx) {
        const pipes = new Map();
        usedPipes.forEach(p => pipes.set(p.name, p.type.reference));
        let embeddedViewCount = 0;
        const viewBuilderFactory = (parent, guards) => {
            const embeddedViewIndex = embeddedViewCount++;
            return new ViewBuilder(this.options, this.reflector, externalReferenceVars, parent, component.type.reference, component.isHost, embeddedViewIndex, pipes, guards, ctx, viewBuilderFactory);
        };
        const visitor = viewBuilderFactory(null, []);
        visitor.visitAll([], template);
        return visitor.build(componentId);
    }
}
const DYNAMIC_VAR_NAME = '_any';
class TypeCheckLocalResolver {
    notifyImplicitReceiverUse() { }
    maybeRestoreView() { }
    getLocal(name) {
        if (name === EventHandlerVars.event.name) {
            // References to the event should not be type-checked.
            // TODO(chuckj): determine a better type for the event.
            return o.variable(DYNAMIC_VAR_NAME);
        }
        return null;
    }
}
const defaultResolver = new TypeCheckLocalResolver();
class ViewBuilder {
    constructor(options, reflector, externalReferenceVars, parent, component, isHostComponent, embeddedViewIndex, pipes, guards, ctx, viewBuilderFactory) {
        this.options = options;
        this.reflector = reflector;
        this.externalReferenceVars = externalReferenceVars;
        this.parent = parent;
        this.component = component;
        this.isHostComponent = isHostComponent;
        this.embeddedViewIndex = embeddedViewIndex;
        this.pipes = pipes;
        this.guards = guards;
        this.ctx = ctx;
        this.viewBuilderFactory = viewBuilderFactory;
        this.refOutputVars = new Map();
        this.variables = [];
        this.children = [];
        this.updates = [];
        this.actions = [];
    }
    getOutputVar(type) {
        let varName;
        if (type === this.component && this.isHostComponent) {
            varName = DYNAMIC_VAR_NAME;
        }
        else if (type instanceof StaticSymbol) {
            varName = this.externalReferenceVars.get(type);
        }
        else {
            varName = DYNAMIC_VAR_NAME;
        }
        if (!varName) {
            throw new Error(`Illegal State: referring to a type without a variable ${JSON.stringify(type)}`);
        }
        return varName;
    }
    getTypeGuardExpressions(ast) {
        const result = [...this.guards];
        for (let directive of ast.directives) {
            for (let input of directive.inputs) {
                const guard = directive.directive.guards[input.directiveName];
                if (guard) {
                    const useIf = guard === 'UseIf';
                    result.push({
                        guard,
                        useIf,
                        expression: {
                            context: this.component,
                            value: input.value,
                            sourceSpan: input.sourceSpan,
                        },
                    });
                }
            }
        }
        return result;
    }
    visitAll(variables, astNodes) {
        this.variables = variables;
        templateVisitAll(this, astNodes);
    }
    build(componentId, targetStatements = []) {
        this.children.forEach((child) => child.build(componentId, targetStatements));
        let viewStmts = [o.variable(DYNAMIC_VAR_NAME).set(o.NULL_EXPR).toDeclStmt(o.DYNAMIC_TYPE)];
        let bindingCount = 0;
        this.updates.forEach((expression) => {
            const { sourceSpan, context, value } = this.preprocessUpdateExpression(expression);
            const bindingId = `${bindingCount++}`;
            const nameResolver = context === this.component ? this : defaultResolver;
            const { stmts, currValExpr } = convertPropertyBinding(nameResolver, o.variable(this.getOutputVar(context)), value, bindingId, BindingForm.General);
            stmts.push(new o.ExpressionStatement(currValExpr));
            viewStmts.push(...stmts.map((stmt) => o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan)));
        });
        this.actions.forEach(({ sourceSpan, context, value }) => {
            const bindingId = `${bindingCount++}`;
            const nameResolver = context === this.component ? this : defaultResolver;
            const { stmts } = convertActionBinding(nameResolver, o.variable(this.getOutputVar(context)), value, bindingId);
            viewStmts.push(...stmts.map((stmt) => o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan)));
        });
        if (this.guards.length) {
            let guardExpression = undefined;
            for (const guard of this.guards) {
                const { context, value } = this.preprocessUpdateExpression(guard.expression);
                const bindingId = `${bindingCount++}`;
                const nameResolver = context === this.component ? this : defaultResolver;
                // We only support support simple expressions and ignore others as they
                // are unlikely to affect type narrowing.
                const { stmts, currValExpr } = convertPropertyBinding(nameResolver, o.variable(this.getOutputVar(context)), value, bindingId, BindingForm.TrySimple);
                if (stmts.length == 0) {
                    const guardClause = guard.useIf ? currValExpr : this.ctx.importExpr(guard.guard).callFn([currValExpr]);
                    guardExpression = guardExpression ? guardExpression.and(guardClause) : guardClause;
                }
            }
            if (guardExpression) {
                viewStmts = [new o.IfStmt(guardExpression, viewStmts)];
            }
        }
        const viewName = `_View_${componentId}_${this.embeddedViewIndex}`;
        const viewFactory = new o.DeclareFunctionStmt(viewName, [], viewStmts);
        targetStatements.push(viewFactory);
        return targetStatements;
    }
    visitBoundText(ast, context) {
        const astWithSource = ast.value;
        const inter = astWithSource.ast;
        inter.expressions.forEach((expr) => this.updates.push({ context: this.component, value: expr, sourceSpan: ast.sourceSpan }));
    }
    visitEmbeddedTemplate(ast, context) {
        this.visitElementOrTemplate(ast);
        // Note: The old view compiler used to use an `any` type
        // for the context in any embedded view.
        // We keep this behaivor behind a flag for now.
        if (this.options.fullTemplateTypeCheck) {
            // Find any applicable type guards. For example, NgIf has a type guard on ngIf
            // (see NgIf.ngIfTypeGuard) that can be used to indicate that a template is only
            // stamped out if ngIf is truthy so any bindings in the template can assume that,
            // if a nullable type is used for ngIf, that expression is not null or undefined.
            const guards = this.getTypeGuardExpressions(ast);
            const childVisitor = this.viewBuilderFactory(this, guards);
            this.children.push(childVisitor);
            childVisitor.visitAll(ast.variables, ast.children);
        }
    }
    visitElement(ast, context) {
        this.visitElementOrTemplate(ast);
        let inputDefs = [];
        let updateRendererExpressions = [];
        let outputDefs = [];
        ast.inputs.forEach((inputAst) => {
            this.updates.push({ context: this.component, value: inputAst.value, sourceSpan: inputAst.sourceSpan });
        });
        templateVisitAll(this, ast.children);
    }
    visitElementOrTemplate(ast) {
        ast.directives.forEach((dirAst) => {
            this.visitDirective(dirAst);
        });
        ast.references.forEach((ref) => {
            let outputVarType = null;
            // Note: The old view compiler used to use an `any` type
            // for directives exposed via `exportAs`.
            // We keep this behaivor behind a flag for now.
            if (ref.value && ref.value.identifier && this.options.fullTemplateTypeCheck) {
                outputVarType = ref.value.identifier.reference;
            }
            else {
                outputVarType = o.BuiltinTypeName.Dynamic;
            }
            this.refOutputVars.set(ref.name, outputVarType);
        });
        ast.outputs.forEach((outputAst) => {
            this.actions.push({ context: this.component, value: outputAst.handler, sourceSpan: outputAst.sourceSpan });
        });
    }
    visitDirective(dirAst) {
        const dirType = dirAst.directive.type.reference;
        dirAst.inputs.forEach((input) => this.updates.push({ context: this.component, value: input.value, sourceSpan: input.sourceSpan }));
        // Note: The old view compiler used to use an `any` type
        // for expressions in host properties / events.
        // We keep this behaivor behind a flag for now.
        if (this.options.fullTemplateTypeCheck) {
            dirAst.hostProperties.forEach((inputAst) => this.updates.push({ context: dirType, value: inputAst.value, sourceSpan: inputAst.sourceSpan }));
            dirAst.hostEvents.forEach((hostEventAst) => this.actions.push({
                context: dirType,
                value: hostEventAst.handler,
                sourceSpan: hostEventAst.sourceSpan
            }));
        }
    }
    notifyImplicitReceiverUse() { }
    maybeRestoreView() { }
    getLocal(name) {
        if (name == EventHandlerVars.event.name) {
            return o.variable(this.getOutputVar(o.BuiltinTypeName.Dynamic));
        }
        for (let currBuilder = this; currBuilder; currBuilder = currBuilder.parent) {
            let outputVarType;
            // check references
            outputVarType = currBuilder.refOutputVars.get(name);
            if (outputVarType == null) {
                // check variables
                const varAst = currBuilder.variables.find((varAst) => varAst.name === name);
                if (varAst) {
                    outputVarType = o.BuiltinTypeName.Dynamic;
                }
            }
            if (outputVarType != null) {
                return o.variable(this.getOutputVar(outputVarType));
            }
        }
        return null;
    }
    pipeOutputVar(name) {
        const pipe = this.pipes.get(name);
        if (!pipe) {
            throw new Error(`Illegal State: Could not find pipe ${name} in template of ${this.component}`);
        }
        return this.getOutputVar(pipe);
    }
    preprocessUpdateExpression(expression) {
        return {
            sourceSpan: expression.sourceSpan,
            context: expression.context,
            value: convertPropertyBindingBuiltins({
                createLiteralArrayConverter: (argCount) => (args) => {
                    const arr = o.literalArr(args);
                    // Note: The old view compiler used to use an `any` type
                    // for arrays.
                    return this.options.fullTemplateTypeCheck ? arr : arr.cast(o.DYNAMIC_TYPE);
                },
                createLiteralMapConverter: (keys) => (values) => {
                    const entries = keys.map((k, i) => ({
                        key: k.key,
                        value: values[i],
                        quoted: k.quoted,
                    }));
                    const map = o.literalMap(entries);
                    // Note: The old view compiler used to use an `any` type
                    // for maps.
                    return this.options.fullTemplateTypeCheck ? map : map.cast(o.DYNAMIC_TYPE);
                },
                createPipeConverter: (name, argCount) => (args) => {
                    // Note: The old view compiler used to use an `any` type
                    // for pipes.
                    const pipeExpr = this.options.fullTemplateTypeCheck ?
                        o.variable(this.pipeOutputVar(name)) :
                        o.variable(this.getOutputVar(o.BuiltinTypeName.Dynamic));
                    return pipeExpr.callMethod('transform', args);
                },
            }, expression.value)
        };
    }
    visitNgContent(ast, context) { }
    visitText(ast, context) { }
    visitDirectiveProperty(ast, context) { }
    visitReference(ast, context) { }
    visitVariable(ast, context) { }
    visitEvent(ast, context) { }
    visitElementProperty(ast, context) { }
    visitAttr(ast, context) { }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZV9jaGVja19jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy92aWV3X2NvbXBpbGVyL3R5cGVfY2hlY2tfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBSUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE9BQU8sRUFBQyxXQUFXLEVBQUUsb0JBQW9CLEVBQUUsc0JBQXNCLEVBQUUsOEJBQThCLEVBQUUsZ0JBQWdCLEVBQWdCLE1BQU0sdUNBQXVDLENBQUM7QUFFakwsT0FBTyxLQUFLLENBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUUxQyxPQUFPLEVBQXVNLGdCQUFnQixFQUF1QixNQUFNLGlDQUFpQyxDQUFDO0FBSTdSOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUFvQixPQUEyQixFQUFVLFNBQTBCO1FBQS9ELFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBaUI7SUFBRyxDQUFDO0lBRXZGOzs7Ozs7O09BT0c7SUFDSCxnQkFBZ0IsQ0FDWixXQUFtQixFQUFFLFNBQW1DLEVBQUUsUUFBdUIsRUFDakYsU0FBK0IsRUFBRSxxQkFBZ0QsRUFDakYsR0FBa0I7UUFDcEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQXdCLENBQUM7UUFDOUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDMUIsTUFBTSxrQkFBa0IsR0FDcEIsQ0FBQyxNQUF3QixFQUFFLE1BQXlCLEVBQWUsRUFBRTtZQUNuRSxN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QUFDLENBQUMsSUFBb0IsRUFBRSxFQUFFO29CQUNoRix3REFBd0Q7b0JBQ3hELGFBQWE7b0JBQ2IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO3dCQUNqRCxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM3RCxPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO2FBQ0YsRUFDRCxVQUFVLENBQUMsS0FBSyxDQUFDO1NBQ3RCLENBQUM7SUFDSixDQUFDO0lBRUQsY0FBYyxDQUFDLEdBQWlCLEVBQUUsT0FBWSxJQUFRLENBQUM7SUFDdkQsU0FBUyxDQUFDLEdBQVksRUFBRSxPQUFZLElBQVEsQ0FBQztJQUM3QyxzQkFBc0IsQ0FBQyxHQUE4QixFQUFFLE9BQVksSUFBUSxDQUFDO0lBQzVFLGNBQWMsQ0FBQyxHQUFpQixFQUFFLE9BQVksSUFBUSxDQUFDO0lBQ3ZELGFBQWEsQ0FBQyxHQUFnQixFQUFFLE9BQVksSUFBUSxDQUFDO0lBQ3JELFVBQVUsQ0FBQyxHQUFrQixFQUFFLE9BQVksSUFBUSxDQUFDO0lBQ3BELG9CQUFvQixDQUFDLEdBQTRCLEVBQUUsT0FBWSxJQUFRLENBQUM7SUFDeEUsU0FBUyxDQUFDLEdBQVksRUFBRSxPQUFZLElBQVEsQ0FBQztDQUM5QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FvdENvbXBpbGVyT3B0aW9uc30gZnJvbSAnLi4vYW90L2NvbXBpbGVyX29wdGlvbnMnO1xuaW1wb3J0IHtTdGF0aWNSZWZsZWN0b3J9IGZyb20gJy4uL2FvdC9zdGF0aWNfcmVmbGVjdG9yJztcbmltcG9ydCB7U3RhdGljU3ltYm9sfSBmcm9tICcuLi9hb3Qvc3RhdGljX3N5bWJvbCc7XG5pbXBvcnQge0NvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgQ29tcGlsZVBpcGVTdW1tYXJ5fSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCB7QmluZGluZ0Zvcm0sIGNvbnZlcnRBY3Rpb25CaW5kaW5nLCBjb252ZXJ0UHJvcGVydHlCaW5kaW5nLCBjb252ZXJ0UHJvcGVydHlCaW5kaW5nQnVpbHRpbnMsIEV2ZW50SGFuZGxlclZhcnMsIExvY2FsUmVzb2x2ZXJ9IGZyb20gJy4uL2NvbXBpbGVyX3V0aWwvZXhwcmVzc2lvbl9jb252ZXJ0ZXInO1xuaW1wb3J0IHtBU1QsIEFTVFdpdGhTb3VyY2UsIEludGVycG9sYXRpb259IGZyb20gJy4uL2V4cHJlc3Npb25fcGFyc2VyL2FzdCc7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7UGFyc2VTb3VyY2VTcGFufSBmcm9tICcuLi9wYXJzZV91dGlsJztcbmltcG9ydCB7QXR0ckFzdCwgQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdCwgQm91bmRFbGVtZW50UHJvcGVydHlBc3QsIEJvdW5kRXZlbnRBc3QsIEJvdW5kVGV4dEFzdCwgRGlyZWN0aXZlQXN0LCBFbGVtZW50QXN0LCBFbWJlZGRlZFRlbXBsYXRlQXN0LCBOZ0NvbnRlbnRBc3QsIFJlZmVyZW5jZUFzdCwgVGVtcGxhdGVBc3QsIFRlbXBsYXRlQXN0VmlzaXRvciwgdGVtcGxhdGVWaXNpdEFsbCwgVGV4dEFzdCwgVmFyaWFibGVBc3R9IGZyb20gJy4uL3RlbXBsYXRlX3BhcnNlci90ZW1wbGF0ZV9hc3QnO1xuaW1wb3J0IHtPdXRwdXRDb250ZXh0fSBmcm9tICcuLi91dGlsJztcblxuXG4vKipcbiAqIEdlbmVyYXRlcyBjb2RlIHRoYXQgaXMgdXNlZCB0byB0eXBlIGNoZWNrIHRlbXBsYXRlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFR5cGVDaGVja0NvbXBpbGVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBBb3RDb21waWxlck9wdGlvbnMsIHByaXZhdGUgcmVmbGVjdG9yOiBTdGF0aWNSZWZsZWN0b3IpIHt9XG5cbiAgLyoqXG4gICAqIEltcG9ydGFudCBub3RlczpcbiAgICogLSBUaGlzIG11c3Qgbm90IHByb2R1Y2UgbmV3IGBpbXBvcnRgIHN0YXRlbWVudHMsIGJ1dCBvbmx5IHJlZmVyIHRvIHR5cGVzIG91dHNpZGVcbiAgICogICBvZiB0aGUgZmlsZSB2aWEgdGhlIHZhcmlhYmxlcyBwcm92aWRlZCB2aWEgZXh0ZXJuYWxSZWZlcmVuY2VWYXJzLlxuICAgKiAgIFRoaXMgYWxsb3dzIFR5cGVzY3JpcHQgdG8gcmV1c2UgdGhlIG9sZCBwcm9ncmFtJ3Mgc3RydWN0dXJlIGFzIG5vIGltcG9ydHMgaGF2ZSBjaGFuZ2VkLlxuICAgKiAtIFRoaXMgbXVzdCBub3QgcHJvZHVjZSBhbnkgZXhwb3J0cywgYXMgdGhpcyB3b3VsZCBwb2xsdXRlIHRoZSAuZC50cyBmaWxlXG4gICAqICAgYW5kIGFsc28gdmlvbGF0ZSB0aGUgcG9pbnQgYWJvdmUuXG4gICAqL1xuICBjb21waWxlQ29tcG9uZW50KFxuICAgICAgY29tcG9uZW50SWQ6IHN0cmluZywgY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsIHRlbXBsYXRlOiBUZW1wbGF0ZUFzdFtdLFxuICAgICAgdXNlZFBpcGVzOiBDb21waWxlUGlwZVN1bW1hcnlbXSwgZXh0ZXJuYWxSZWZlcmVuY2VWYXJzOiBNYXA8U3RhdGljU3ltYm9sLCBzdHJpbmc+LFxuICAgICAgY3R4OiBPdXRwdXRDb250ZXh0KTogby5TdGF0ZW1lbnRbXSB7XG4gICAgY29uc3QgcGlwZXMgPSBuZXcgTWFwPHN0cmluZywgU3RhdGljU3ltYm9sPigpO1xuICAgIHVzZWRQaXBlcy5mb3JFYWNoKHAgPT4gcGlwZXMuc2V0KHAubmFtZSwgcC50eXBlLnJlZmVyZW5jZSkpO1xuICAgIGxldCBlbWJlZGRlZFZpZXdDb3VudCA9IDA7XG4gICAgY29uc3Qgdmlld0J1aWxkZXJGYWN0b3J5ID1cbiAgICAgICAgKHBhcmVudDogVmlld0J1aWxkZXJ8bnVsbCwgZ3VhcmRzOiBHdWFyZEV4cHJlc3Npb25bXSk6IFZpZXdCdWlsZGVyID0+IHtcbiAgICAgICAgICBjb25zdCBlbWJlZGRlZFZpZXdJbmRleCA9IGVtYmVkZGVkVmlld0NvdW50Kys7XG4gICAgICAgICAgcmV0dXJuIG5ldyBWaWV3QnVpbGRlcihcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLCB0aGlzLnJlZmxlY3RvciwgZXh0ZXJuYWxSZWZlcmVuY2VWYXJzLCBwYXJlbnQsIGNvbXBvbmVudC50eXBlLnJlZmVyZW5jZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmlzSG9zdCwgZW1iZWRkZWRWaWV3SW5kZXgsIHBpcGVzLCBndWFyZHMsIGN0eCwgdmlld0J1aWxkZXJGYWN0b3J5KTtcbiAgICAgICAgfTtcblxuICAgIGNvbnN0IHZpc2l0b3IgPSB2aWV3QnVpbGRlckZhY3RvcnkobnVsbCwgW10pO1xuICAgIHZpc2l0b3IudmlzaXRBbGwoW10sIHRlbXBsYXRlKTtcblxuICAgIHJldHVybiB2aXNpdG9yLmJ1aWxkKGNvbXBvbmVudElkKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgR3VhcmRFeHByZXNzaW9uIHtcbiAgZ3VhcmQ6IFN0YXRpY1N5bWJvbDtcbiAgdXNlSWY6IGJvb2xlYW47XG4gIGV4cHJlc3Npb246IEV4cHJlc3Npb247XG59XG5cbmludGVyZmFjZSBWaWV3QnVpbGRlckZhY3Rvcnkge1xuICAocGFyZW50OiBWaWV3QnVpbGRlciwgZ3VhcmRzOiBHdWFyZEV4cHJlc3Npb25bXSk6IFZpZXdCdWlsZGVyO1xufVxuXG4vLyBOb3RlOiBUaGlzIGlzIHVzZWQgYXMga2V5IGluIE1hcCBhbmQgc2hvdWxkIHRoZXJlZm9yZSBiZVxuLy8gdW5pcXVlIHBlciB2YWx1ZS5cbnR5cGUgT3V0cHV0VmFyVHlwZSA9IG8uQnVpbHRpblR5cGVOYW1lfFN0YXRpY1N5bWJvbDtcblxuaW50ZXJmYWNlIEV4cHJlc3Npb24ge1xuICBjb250ZXh0OiBPdXRwdXRWYXJUeXBlO1xuICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW47XG4gIHZhbHVlOiBBU1Q7XG59XG5cbmNvbnN0IERZTkFNSUNfVkFSX05BTUUgPSAnX2FueSc7XG5cbmNsYXNzIFR5cGVDaGVja0xvY2FsUmVzb2x2ZXIgaW1wbGVtZW50cyBMb2NhbFJlc29sdmVyIHtcbiAgbm90aWZ5SW1wbGljaXRSZWNlaXZlclVzZSgpOiB2b2lkIHt9XG4gIG1heWJlUmVzdG9yZVZpZXcoKTogdm9pZCB7fVxuICBnZXRMb2NhbChuYW1lOiBzdHJpbmcpOiBvLkV4cHJlc3Npb258bnVsbCB7XG4gICAgaWYgKG5hbWUgPT09IEV2ZW50SGFuZGxlclZhcnMuZXZlbnQubmFtZSkge1xuICAgICAgLy8gUmVmZXJlbmNlcyB0byB0aGUgZXZlbnQgc2hvdWxkIG5vdCBiZSB0eXBlLWNoZWNrZWQuXG4gICAgICAvLyBUT0RPKGNodWNraik6IGRldGVybWluZSBhIGJldHRlciB0eXBlIGZvciB0aGUgZXZlbnQuXG4gICAgICByZXR1cm4gby52YXJpYWJsZShEWU5BTUlDX1ZBUl9OQU1FKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuY29uc3QgZGVmYXVsdFJlc29sdmVyID0gbmV3IFR5cGVDaGVja0xvY2FsUmVzb2x2ZXIoKTtcblxuY2xhc3MgVmlld0J1aWxkZXIgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdFZpc2l0b3IsIExvY2FsUmVzb2x2ZXIge1xuICBwcml2YXRlIHJlZk91dHB1dFZhcnMgPSBuZXcgTWFwPHN0cmluZywgT3V0cHV0VmFyVHlwZT4oKTtcbiAgcHJpdmF0ZSB2YXJpYWJsZXM6IFZhcmlhYmxlQXN0W10gPSBbXTtcbiAgcHJpdmF0ZSBjaGlsZHJlbjogVmlld0J1aWxkZXJbXSA9IFtdO1xuICBwcml2YXRlIHVwZGF0ZXM6IEV4cHJlc3Npb25bXSA9IFtdO1xuICBwcml2YXRlIGFjdGlvbnM6IEV4cHJlc3Npb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBvcHRpb25zOiBBb3RDb21waWxlck9wdGlvbnMsIHByaXZhdGUgcmVmbGVjdG9yOiBTdGF0aWNSZWZsZWN0b3IsXG4gICAgICBwcml2YXRlIGV4dGVybmFsUmVmZXJlbmNlVmFyczogTWFwPFN0YXRpY1N5bWJvbCwgc3RyaW5nPiwgcHJpdmF0ZSBwYXJlbnQ6IFZpZXdCdWlsZGVyfG51bGwsXG4gICAgICBwcml2YXRlIGNvbXBvbmVudDogU3RhdGljU3ltYm9sLCBwcml2YXRlIGlzSG9zdENvbXBvbmVudDogYm9vbGVhbixcbiAgICAgIHByaXZhdGUgZW1iZWRkZWRWaWV3SW5kZXg6IG51bWJlciwgcHJpdmF0ZSBwaXBlczogTWFwPHN0cmluZywgU3RhdGljU3ltYm9sPixcbiAgICAgIHByaXZhdGUgZ3VhcmRzOiBHdWFyZEV4cHJlc3Npb25bXSwgcHJpdmF0ZSBjdHg6IE91dHB1dENvbnRleHQsXG4gICAgICBwcml2YXRlIHZpZXdCdWlsZGVyRmFjdG9yeTogVmlld0J1aWxkZXJGYWN0b3J5KSB7fVxuXG4gIHByaXZhdGUgZ2V0T3V0cHV0VmFyKHR5cGU6IG8uQnVpbHRpblR5cGVOYW1lfFN0YXRpY1N5bWJvbCk6IHN0cmluZyB7XG4gICAgbGV0IHZhck5hbWU6IHN0cmluZ3x1bmRlZmluZWQ7XG4gICAgaWYgKHR5cGUgPT09IHRoaXMuY29tcG9uZW50ICYmIHRoaXMuaXNIb3N0Q29tcG9uZW50KSB7XG4gICAgICB2YXJOYW1lID0gRFlOQU1JQ19WQVJfTkFNRTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBTdGF0aWNTeW1ib2wpIHtcbiAgICAgIHZhck5hbWUgPSB0aGlzLmV4dGVybmFsUmVmZXJlbmNlVmFycy5nZXQodHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhck5hbWUgPSBEWU5BTUlDX1ZBUl9OQU1FO1xuICAgIH1cbiAgICBpZiAoIXZhck5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSWxsZWdhbCBTdGF0ZTogcmVmZXJyaW5nIHRvIGEgdHlwZSB3aXRob3V0IGEgdmFyaWFibGUgJHtKU09OLnN0cmluZ2lmeSh0eXBlKX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhck5hbWU7XG4gIH1cblxuICBwcml2YXRlIGdldFR5cGVHdWFyZEV4cHJlc3Npb25zKGFzdDogRW1iZWRkZWRUZW1wbGF0ZUFzdCk6IEd1YXJkRXhwcmVzc2lvbltdIHtcbiAgICBjb25zdCByZXN1bHQgPSBbLi4udGhpcy5ndWFyZHNdO1xuICAgIGZvciAobGV0IGRpcmVjdGl2ZSBvZiBhc3QuZGlyZWN0aXZlcykge1xuICAgICAgZm9yIChsZXQgaW5wdXQgb2YgZGlyZWN0aXZlLmlucHV0cykge1xuICAgICAgICBjb25zdCBndWFyZCA9IGRpcmVjdGl2ZS5kaXJlY3RpdmUuZ3VhcmRzW2lucHV0LmRpcmVjdGl2ZU5hbWVdO1xuICAgICAgICBpZiAoZ3VhcmQpIHtcbiAgICAgICAgICBjb25zdCB1c2VJZiA9IGd1YXJkID09PSAnVXNlSWYnO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIGd1YXJkLFxuICAgICAgICAgICAgdXNlSWYsXG4gICAgICAgICAgICBleHByZXNzaW9uOiB7XG4gICAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMuY29tcG9uZW50LFxuICAgICAgICAgICAgICB2YWx1ZTogaW5wdXQudmFsdWUsXG4gICAgICAgICAgICAgIHNvdXJjZVNwYW46IGlucHV0LnNvdXJjZVNwYW4sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB2aXNpdEFsbCh2YXJpYWJsZXM6IFZhcmlhYmxlQXN0W10sIGFzdE5vZGVzOiBUZW1wbGF0ZUFzdFtdKSB7XG4gICAgdGhpcy52YXJpYWJsZXMgPSB2YXJpYWJsZXM7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3ROb2Rlcyk7XG4gIH1cblxuICBidWlsZChjb21wb25lbnRJZDogc3RyaW5nLCB0YXJnZXRTdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdID0gW10pOiBvLlN0YXRlbWVudFtdIHtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiBjaGlsZC5idWlsZChjb21wb25lbnRJZCwgdGFyZ2V0U3RhdGVtZW50cykpO1xuICAgIGxldCB2aWV3U3RtdHM6IG8uU3RhdGVtZW50W10gPVxuICAgICAgICBbby52YXJpYWJsZShEWU5BTUlDX1ZBUl9OQU1FKS5zZXQoby5OVUxMX0VYUFIpLnRvRGVjbFN0bXQoby5EWU5BTUlDX1RZUEUpXTtcbiAgICBsZXQgYmluZGluZ0NvdW50ID0gMDtcbiAgICB0aGlzLnVwZGF0ZXMuZm9yRWFjaCgoZXhwcmVzc2lvbikgPT4ge1xuICAgICAgY29uc3Qge3NvdXJjZVNwYW4sIGNvbnRleHQsIHZhbHVlfSA9IHRoaXMucHJlcHJvY2Vzc1VwZGF0ZUV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG4gICAgICBjb25zdCBiaW5kaW5nSWQgPSBgJHtiaW5kaW5nQ291bnQrK31gO1xuICAgICAgY29uc3QgbmFtZVJlc29sdmVyID0gY29udGV4dCA9PT0gdGhpcy5jb21wb25lbnQgPyB0aGlzIDogZGVmYXVsdFJlc29sdmVyO1xuICAgICAgY29uc3Qge3N0bXRzLCBjdXJyVmFsRXhwcn0gPSBjb252ZXJ0UHJvcGVydHlCaW5kaW5nKFxuICAgICAgICAgIG5hbWVSZXNvbHZlciwgby52YXJpYWJsZSh0aGlzLmdldE91dHB1dFZhcihjb250ZXh0KSksIHZhbHVlLCBiaW5kaW5nSWQsXG4gICAgICAgICAgQmluZGluZ0Zvcm0uR2VuZXJhbCk7XG4gICAgICBzdG10cy5wdXNoKG5ldyBvLkV4cHJlc3Npb25TdGF0ZW1lbnQoY3VyclZhbEV4cHIpKTtcbiAgICAgIHZpZXdTdG10cy5wdXNoKC4uLnN0bXRzLm1hcChcbiAgICAgICAgICAoc3RtdDogby5TdGF0ZW1lbnQpID0+IG8uYXBwbHlTb3VyY2VTcGFuVG9TdGF0ZW1lbnRJZk5lZWRlZChzdG10LCBzb3VyY2VTcGFuKSkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5hY3Rpb25zLmZvckVhY2goKHtzb3VyY2VTcGFuLCBjb250ZXh0LCB2YWx1ZX0pID0+IHtcbiAgICAgIGNvbnN0IGJpbmRpbmdJZCA9IGAke2JpbmRpbmdDb3VudCsrfWA7XG4gICAgICBjb25zdCBuYW1lUmVzb2x2ZXIgPSBjb250ZXh0ID09PSB0aGlzLmNvbXBvbmVudCA/IHRoaXMgOiBkZWZhdWx0UmVzb2x2ZXI7XG4gICAgICBjb25zdCB7c3RtdHN9ID0gY29udmVydEFjdGlvbkJpbmRpbmcoXG4gICAgICAgICAgbmFtZVJlc29sdmVyLCBvLnZhcmlhYmxlKHRoaXMuZ2V0T3V0cHV0VmFyKGNvbnRleHQpKSwgdmFsdWUsIGJpbmRpbmdJZCk7XG4gICAgICB2aWV3U3RtdHMucHVzaCguLi5zdG10cy5tYXAoXG4gICAgICAgICAgKHN0bXQ6IG8uU3RhdGVtZW50KSA9PiBvLmFwcGx5U291cmNlU3BhblRvU3RhdGVtZW50SWZOZWVkZWQoc3RtdCwgc291cmNlU3BhbikpKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmd1YXJkcy5sZW5ndGgpIHtcbiAgICAgIGxldCBndWFyZEV4cHJlc3Npb246IG8uRXhwcmVzc2lvbnx1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICBmb3IgKGNvbnN0IGd1YXJkIG9mIHRoaXMuZ3VhcmRzKSB7XG4gICAgICAgIGNvbnN0IHtjb250ZXh0LCB2YWx1ZX0gPSB0aGlzLnByZXByb2Nlc3NVcGRhdGVFeHByZXNzaW9uKGd1YXJkLmV4cHJlc3Npb24pO1xuICAgICAgICBjb25zdCBiaW5kaW5nSWQgPSBgJHtiaW5kaW5nQ291bnQrK31gO1xuICAgICAgICBjb25zdCBuYW1lUmVzb2x2ZXIgPSBjb250ZXh0ID09PSB0aGlzLmNvbXBvbmVudCA/IHRoaXMgOiBkZWZhdWx0UmVzb2x2ZXI7XG4gICAgICAgIC8vIFdlIG9ubHkgc3VwcG9ydCBzdXBwb3J0IHNpbXBsZSBleHByZXNzaW9ucyBhbmQgaWdub3JlIG90aGVycyBhcyB0aGV5XG4gICAgICAgIC8vIGFyZSB1bmxpa2VseSB0byBhZmZlY3QgdHlwZSBuYXJyb3dpbmcuXG4gICAgICAgIGNvbnN0IHtzdG10cywgY3VyclZhbEV4cHJ9ID0gY29udmVydFByb3BlcnR5QmluZGluZyhcbiAgICAgICAgICAgIG5hbWVSZXNvbHZlciwgby52YXJpYWJsZSh0aGlzLmdldE91dHB1dFZhcihjb250ZXh0KSksIHZhbHVlLCBiaW5kaW5nSWQsXG4gICAgICAgICAgICBCaW5kaW5nRm9ybS5UcnlTaW1wbGUpO1xuICAgICAgICBpZiAoc3RtdHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICBjb25zdCBndWFyZENsYXVzZSA9XG4gICAgICAgICAgICAgIGd1YXJkLnVzZUlmID8gY3VyclZhbEV4cHIgOiB0aGlzLmN0eC5pbXBvcnRFeHByKGd1YXJkLmd1YXJkKS5jYWxsRm4oW2N1cnJWYWxFeHByXSk7XG4gICAgICAgICAgZ3VhcmRFeHByZXNzaW9uID0gZ3VhcmRFeHByZXNzaW9uID8gZ3VhcmRFeHByZXNzaW9uLmFuZChndWFyZENsYXVzZSkgOiBndWFyZENsYXVzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGd1YXJkRXhwcmVzc2lvbikge1xuICAgICAgICB2aWV3U3RtdHMgPSBbbmV3IG8uSWZTdG10KGd1YXJkRXhwcmVzc2lvbiwgdmlld1N0bXRzKV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgdmlld05hbWUgPSBgX1ZpZXdfJHtjb21wb25lbnRJZH1fJHt0aGlzLmVtYmVkZGVkVmlld0luZGV4fWA7XG4gICAgY29uc3Qgdmlld0ZhY3RvcnkgPSBuZXcgby5EZWNsYXJlRnVuY3Rpb25TdG10KHZpZXdOYW1lLCBbXSwgdmlld1N0bXRzKTtcbiAgICB0YXJnZXRTdGF0ZW1lbnRzLnB1c2godmlld0ZhY3RvcnkpO1xuICAgIHJldHVybiB0YXJnZXRTdGF0ZW1lbnRzO1xuICB9XG5cbiAgdmlzaXRCb3VuZFRleHQoYXN0OiBCb3VuZFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgY29uc3QgYXN0V2l0aFNvdXJjZSA9IDxBU1RXaXRoU291cmNlPmFzdC52YWx1ZTtcbiAgICBjb25zdCBpbnRlciA9IDxJbnRlcnBvbGF0aW9uPmFzdFdpdGhTb3VyY2UuYXN0O1xuXG4gICAgaW50ZXIuZXhwcmVzc2lvbnMuZm9yRWFjaChcbiAgICAgICAgKGV4cHIpID0+XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZXMucHVzaCh7Y29udGV4dDogdGhpcy5jb21wb25lbnQsIHZhbHVlOiBleHByLCBzb3VyY2VTcGFuOiBhc3Quc291cmNlU3Bhbn0pKTtcbiAgfVxuXG4gIHZpc2l0RW1iZWRkZWRUZW1wbGF0ZShhc3Q6IEVtYmVkZGVkVGVtcGxhdGVBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy52aXNpdEVsZW1lbnRPclRlbXBsYXRlKGFzdCk7XG4gICAgLy8gTm90ZTogVGhlIG9sZCB2aWV3IGNvbXBpbGVyIHVzZWQgdG8gdXNlIGFuIGBhbnlgIHR5cGVcbiAgICAvLyBmb3IgdGhlIGNvbnRleHQgaW4gYW55IGVtYmVkZGVkIHZpZXcuXG4gICAgLy8gV2Uga2VlcCB0aGlzIGJlaGFpdm9yIGJlaGluZCBhIGZsYWcgZm9yIG5vdy5cbiAgICBpZiAodGhpcy5vcHRpb25zLmZ1bGxUZW1wbGF0ZVR5cGVDaGVjaykge1xuICAgICAgLy8gRmluZCBhbnkgYXBwbGljYWJsZSB0eXBlIGd1YXJkcy4gRm9yIGV4YW1wbGUsIE5nSWYgaGFzIGEgdHlwZSBndWFyZCBvbiBuZ0lmXG4gICAgICAvLyAoc2VlIE5nSWYubmdJZlR5cGVHdWFyZCkgdGhhdCBjYW4gYmUgdXNlZCB0byBpbmRpY2F0ZSB0aGF0IGEgdGVtcGxhdGUgaXMgb25seVxuICAgICAgLy8gc3RhbXBlZCBvdXQgaWYgbmdJZiBpcyB0cnV0aHkgc28gYW55IGJpbmRpbmdzIGluIHRoZSB0ZW1wbGF0ZSBjYW4gYXNzdW1lIHRoYXQsXG4gICAgICAvLyBpZiBhIG51bGxhYmxlIHR5cGUgaXMgdXNlZCBmb3IgbmdJZiwgdGhhdCBleHByZXNzaW9uIGlzIG5vdCBudWxsIG9yIHVuZGVmaW5lZC5cbiAgICAgIGNvbnN0IGd1YXJkcyA9IHRoaXMuZ2V0VHlwZUd1YXJkRXhwcmVzc2lvbnMoYXN0KTtcbiAgICAgIGNvbnN0IGNoaWxkVmlzaXRvciA9IHRoaXMudmlld0J1aWxkZXJGYWN0b3J5KHRoaXMsIGd1YXJkcyk7XG4gICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGRWaXNpdG9yKTtcbiAgICAgIGNoaWxkVmlzaXRvci52aXNpdEFsbChhc3QudmFyaWFibGVzLCBhc3QuY2hpbGRyZW4pO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0RWxlbWVudChhc3Q6IEVsZW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy52aXNpdEVsZW1lbnRPclRlbXBsYXRlKGFzdCk7XG5cbiAgICBsZXQgaW5wdXREZWZzOiBvLkV4cHJlc3Npb25bXSA9IFtdO1xuICAgIGxldCB1cGRhdGVSZW5kZXJlckV4cHJlc3Npb25zOiBFeHByZXNzaW9uW10gPSBbXTtcbiAgICBsZXQgb3V0cHV0RGVmczogby5FeHByZXNzaW9uW10gPSBbXTtcbiAgICBhc3QuaW5wdXRzLmZvckVhY2goKGlucHV0QXN0KSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZXMucHVzaChcbiAgICAgICAgICB7Y29udGV4dDogdGhpcy5jb21wb25lbnQsIHZhbHVlOiBpbnB1dEFzdC52YWx1ZSwgc291cmNlU3BhbjogaW5wdXRBc3Quc291cmNlU3Bhbn0pO1xuICAgIH0pO1xuXG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4pO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdEVsZW1lbnRPclRlbXBsYXRlKGFzdDoge1xuICAgIG91dHB1dHM6IEJvdW5kRXZlbnRBc3RbXSxcbiAgICBkaXJlY3RpdmVzOiBEaXJlY3RpdmVBc3RbXSxcbiAgICByZWZlcmVuY2VzOiBSZWZlcmVuY2VBc3RbXSxcbiAgfSkge1xuICAgIGFzdC5kaXJlY3RpdmVzLmZvckVhY2goKGRpckFzdCkgPT4ge1xuICAgICAgdGhpcy52aXNpdERpcmVjdGl2ZShkaXJBc3QpO1xuICAgIH0pO1xuXG4gICAgYXN0LnJlZmVyZW5jZXMuZm9yRWFjaCgocmVmKSA9PiB7XG4gICAgICBsZXQgb3V0cHV0VmFyVHlwZTogT3V0cHV0VmFyVHlwZSA9IG51bGwhO1xuICAgICAgLy8gTm90ZTogVGhlIG9sZCB2aWV3IGNvbXBpbGVyIHVzZWQgdG8gdXNlIGFuIGBhbnlgIHR5cGVcbiAgICAgIC8vIGZvciBkaXJlY3RpdmVzIGV4cG9zZWQgdmlhIGBleHBvcnRBc2AuXG4gICAgICAvLyBXZSBrZWVwIHRoaXMgYmVoYWl2b3IgYmVoaW5kIGEgZmxhZyBmb3Igbm93LlxuICAgICAgaWYgKHJlZi52YWx1ZSAmJiByZWYudmFsdWUuaWRlbnRpZmllciAmJiB0aGlzLm9wdGlvbnMuZnVsbFRlbXBsYXRlVHlwZUNoZWNrKSB7XG4gICAgICAgIG91dHB1dFZhclR5cGUgPSByZWYudmFsdWUuaWRlbnRpZmllci5yZWZlcmVuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXRWYXJUeXBlID0gby5CdWlsdGluVHlwZU5hbWUuRHluYW1pYztcbiAgICAgIH1cbiAgICAgIHRoaXMucmVmT3V0cHV0VmFycy5zZXQocmVmLm5hbWUsIG91dHB1dFZhclR5cGUpO1xuICAgIH0pO1xuICAgIGFzdC5vdXRwdXRzLmZvckVhY2goKG91dHB1dEFzdCkgPT4ge1xuICAgICAgdGhpcy5hY3Rpb25zLnB1c2goXG4gICAgICAgICAge2NvbnRleHQ6IHRoaXMuY29tcG9uZW50LCB2YWx1ZTogb3V0cHV0QXN0LmhhbmRsZXIsIHNvdXJjZVNwYW46IG91dHB1dEFzdC5zb3VyY2VTcGFufSk7XG4gICAgfSk7XG4gIH1cblxuICB2aXNpdERpcmVjdGl2ZShkaXJBc3Q6IERpcmVjdGl2ZUFzdCkge1xuICAgIGNvbnN0IGRpclR5cGUgPSBkaXJBc3QuZGlyZWN0aXZlLnR5cGUucmVmZXJlbmNlO1xuICAgIGRpckFzdC5pbnB1dHMuZm9yRWFjaChcbiAgICAgICAgKGlucHV0KSA9PiB0aGlzLnVwZGF0ZXMucHVzaChcbiAgICAgICAgICAgIHtjb250ZXh0OiB0aGlzLmNvbXBvbmVudCwgdmFsdWU6IGlucHV0LnZhbHVlLCBzb3VyY2VTcGFuOiBpbnB1dC5zb3VyY2VTcGFufSkpO1xuICAgIC8vIE5vdGU6IFRoZSBvbGQgdmlldyBjb21waWxlciB1c2VkIHRvIHVzZSBhbiBgYW55YCB0eXBlXG4gICAgLy8gZm9yIGV4cHJlc3Npb25zIGluIGhvc3QgcHJvcGVydGllcyAvIGV2ZW50cy5cbiAgICAvLyBXZSBrZWVwIHRoaXMgYmVoYWl2b3IgYmVoaW5kIGEgZmxhZyBmb3Igbm93LlxuICAgIGlmICh0aGlzLm9wdGlvbnMuZnVsbFRlbXBsYXRlVHlwZUNoZWNrKSB7XG4gICAgICBkaXJBc3QuaG9zdFByb3BlcnRpZXMuZm9yRWFjaChcbiAgICAgICAgICAoaW5wdXRBc3QpID0+IHRoaXMudXBkYXRlcy5wdXNoKFxuICAgICAgICAgICAgICB7Y29udGV4dDogZGlyVHlwZSwgdmFsdWU6IGlucHV0QXN0LnZhbHVlLCBzb3VyY2VTcGFuOiBpbnB1dEFzdC5zb3VyY2VTcGFufSkpO1xuICAgICAgZGlyQXN0Lmhvc3RFdmVudHMuZm9yRWFjaCgoaG9zdEV2ZW50QXN0KSA9PiB0aGlzLmFjdGlvbnMucHVzaCh7XG4gICAgICAgIGNvbnRleHQ6IGRpclR5cGUsXG4gICAgICAgIHZhbHVlOiBob3N0RXZlbnRBc3QuaGFuZGxlcixcbiAgICAgICAgc291cmNlU3BhbjogaG9zdEV2ZW50QXN0LnNvdXJjZVNwYW5cbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlJbXBsaWNpdFJlY2VpdmVyVXNlKCk6IHZvaWQge31cbiAgbWF5YmVSZXN0b3JlVmlldygpOiB2b2lkIHt9XG5cbiAgZ2V0TG9jYWwobmFtZTogc3RyaW5nKTogby5FeHByZXNzaW9ufG51bGwge1xuICAgIGlmIChuYW1lID09IEV2ZW50SGFuZGxlclZhcnMuZXZlbnQubmFtZSkge1xuICAgICAgcmV0dXJuIG8udmFyaWFibGUodGhpcy5nZXRPdXRwdXRWYXIoby5CdWlsdGluVHlwZU5hbWUuRHluYW1pYykpO1xuICAgIH1cbiAgICBmb3IgKGxldCBjdXJyQnVpbGRlcjogVmlld0J1aWxkZXJ8bnVsbCA9IHRoaXM7IGN1cnJCdWlsZGVyOyBjdXJyQnVpbGRlciA9IGN1cnJCdWlsZGVyLnBhcmVudCkge1xuICAgICAgbGV0IG91dHB1dFZhclR5cGU6IE91dHB1dFZhclR5cGV8dW5kZWZpbmVkO1xuICAgICAgLy8gY2hlY2sgcmVmZXJlbmNlc1xuICAgICAgb3V0cHV0VmFyVHlwZSA9IGN1cnJCdWlsZGVyLnJlZk91dHB1dFZhcnMuZ2V0KG5hbWUpO1xuICAgICAgaWYgKG91dHB1dFZhclR5cGUgPT0gbnVsbCkge1xuICAgICAgICAvLyBjaGVjayB2YXJpYWJsZXNcbiAgICAgICAgY29uc3QgdmFyQXN0ID0gY3VyckJ1aWxkZXIudmFyaWFibGVzLmZpbmQoKHZhckFzdCkgPT4gdmFyQXN0Lm5hbWUgPT09IG5hbWUpO1xuICAgICAgICBpZiAodmFyQXN0KSB7XG4gICAgICAgICAgb3V0cHV0VmFyVHlwZSA9IG8uQnVpbHRpblR5cGVOYW1lLkR5bmFtaWM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvdXRwdXRWYXJUeXBlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG8udmFyaWFibGUodGhpcy5nZXRPdXRwdXRWYXIob3V0cHV0VmFyVHlwZSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgcGlwZU91dHB1dFZhcihuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHBpcGUgPSB0aGlzLnBpcGVzLmdldChuYW1lKTtcbiAgICBpZiAoIXBpcGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSWxsZWdhbCBTdGF0ZTogQ291bGQgbm90IGZpbmQgcGlwZSAke25hbWV9IGluIHRlbXBsYXRlIG9mICR7dGhpcy5jb21wb25lbnR9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldE91dHB1dFZhcihwaXBlKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcHJvY2Vzc1VwZGF0ZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogRXhwcmVzc2lvbik6IEV4cHJlc3Npb24ge1xuICAgIHJldHVybiB7XG4gICAgICBzb3VyY2VTcGFuOiBleHByZXNzaW9uLnNvdXJjZVNwYW4sXG4gICAgICBjb250ZXh0OiBleHByZXNzaW9uLmNvbnRleHQsXG4gICAgICB2YWx1ZTogY29udmVydFByb3BlcnR5QmluZGluZ0J1aWx0aW5zKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNyZWF0ZUxpdGVyYWxBcnJheUNvbnZlcnRlcjogKGFyZ0NvdW50OiBudW1iZXIpID0+IChhcmdzOiBvLkV4cHJlc3Npb25bXSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBhcnIgPSBvLmxpdGVyYWxBcnIoYXJncyk7XG4gICAgICAgICAgICAgIC8vIE5vdGU6IFRoZSBvbGQgdmlldyBjb21waWxlciB1c2VkIHRvIHVzZSBhbiBgYW55YCB0eXBlXG4gICAgICAgICAgICAgIC8vIGZvciBhcnJheXMuXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZnVsbFRlbXBsYXRlVHlwZUNoZWNrID8gYXJyIDogYXJyLmNhc3Qoby5EWU5BTUlDX1RZUEUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZUxpdGVyYWxNYXBDb252ZXJ0ZXI6IChrZXlzOiB7a2V5OiBzdHJpbmcsIHF1b3RlZDogYm9vbGVhbn1bXSkgPT5cbiAgICAgICAgICAgICAgICAodmFsdWVzOiBvLkV4cHJlc3Npb25bXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgZW50cmllcyA9IGtleXMubWFwKChrLCBpKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBrLmtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZXNbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdW90ZWQ6IGsucXVvdGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IG8ubGl0ZXJhbE1hcChlbnRyaWVzKTtcbiAgICAgICAgICAgICAgICAgIC8vIE5vdGU6IFRoZSBvbGQgdmlldyBjb21waWxlciB1c2VkIHRvIHVzZSBhbiBgYW55YCB0eXBlXG4gICAgICAgICAgICAgICAgICAvLyBmb3IgbWFwcy5cbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZnVsbFRlbXBsYXRlVHlwZUNoZWNrID8gbWFwIDogbWFwLmNhc3Qoby5EWU5BTUlDX1RZUEUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjcmVhdGVQaXBlQ29udmVydGVyOiAobmFtZTogc3RyaW5nLCBhcmdDb3VudDogbnVtYmVyKSA9PiAoYXJnczogby5FeHByZXNzaW9uW10pID0+IHtcbiAgICAgICAgICAgICAgLy8gTm90ZTogVGhlIG9sZCB2aWV3IGNvbXBpbGVyIHVzZWQgdG8gdXNlIGFuIGBhbnlgIHR5cGVcbiAgICAgICAgICAgICAgLy8gZm9yIHBpcGVzLlxuICAgICAgICAgICAgICBjb25zdCBwaXBlRXhwciA9IHRoaXMub3B0aW9ucy5mdWxsVGVtcGxhdGVUeXBlQ2hlY2sgP1xuICAgICAgICAgICAgICAgICAgby52YXJpYWJsZSh0aGlzLnBpcGVPdXRwdXRWYXIobmFtZSkpIDpcbiAgICAgICAgICAgICAgICAgIG8udmFyaWFibGUodGhpcy5nZXRPdXRwdXRWYXIoby5CdWlsdGluVHlwZU5hbWUuRHluYW1pYykpO1xuICAgICAgICAgICAgICByZXR1cm4gcGlwZUV4cHIuY2FsbE1ldGhvZCgndHJhbnNmb3JtJywgYXJncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhwcmVzc2lvbi52YWx1ZSlcbiAgICB9O1xuICB9XG5cbiAgdmlzaXROZ0NvbnRlbnQoYXN0OiBOZ0NvbnRlbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdFRleHQoYXN0OiBUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge31cbiAgdmlzaXREaXJlY3RpdmVQcm9wZXJ0eShhc3Q6IEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdFJlZmVyZW5jZShhc3Q6IFJlZmVyZW5jZUFzdCwgY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0VmFyaWFibGUoYXN0OiBWYXJpYWJsZUFzdCwgY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0RXZlbnQoYXN0OiBCb3VuZEV2ZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge31cbiAgdmlzaXRFbGVtZW50UHJvcGVydHkoYXN0OiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCwgY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0QXR0cihhc3Q6IEF0dHJBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxufVxuIl19