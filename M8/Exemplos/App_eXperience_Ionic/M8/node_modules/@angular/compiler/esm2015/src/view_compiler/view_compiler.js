/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { rendererTypeName, tokenReference, viewClassName } from '../compile_metadata';
import { BindingForm, convertActionBinding, convertPropertyBinding, convertPropertyBindingBuiltins, EventHandlerVars } from '../compiler_util/expression_converter';
import { ChangeDetectionStrategy } from '../core';
import { Identifiers } from '../identifiers';
import { LifecycleHooks } from '../lifecycle_reflector';
import { isNgContainer } from '../ml_parser/tags';
import * as o from '../output/output_ast';
import { convertValueToOutputAst } from '../output/value_util';
import { ElementAst, EmbeddedTemplateAst, NgContentAst, templateVisitAll } from '../template_parser/template_ast';
import { componentFactoryResolverProviderDef, depDef, lifecycleHookToNodeFlag, providerDef } from './provider_compiler';
const CLASS_ATTR = 'class';
const STYLE_ATTR = 'style';
const IMPLICIT_TEMPLATE_VAR = '\$implicit';
export class ViewCompileResult {
    constructor(viewClassVar, rendererTypeVar) {
        this.viewClassVar = viewClassVar;
        this.rendererTypeVar = rendererTypeVar;
    }
}
export class ViewCompiler {
    constructor(_reflector) {
        this._reflector = _reflector;
    }
    compileComponent(outputCtx, component, template, styles, usedPipes) {
        let embeddedViewCount = 0;
        let renderComponentVarName = undefined;
        if (!component.isHost) {
            const template = component.template;
            const customRenderData = [];
            if (template.animations && template.animations.length) {
                customRenderData.push(new o.LiteralMapEntry('animation', convertValueToOutputAst(outputCtx, template.animations), true));
            }
            const renderComponentVar = o.variable(rendererTypeName(component.type.reference));
            renderComponentVarName = renderComponentVar.name;
            outputCtx.statements.push(renderComponentVar
                .set(o.importExpr(Identifiers.createRendererType2).callFn([new o.LiteralMapExpr([
                    new o.LiteralMapEntry('encapsulation', o.literal(template.encapsulation), false),
                    new o.LiteralMapEntry('styles', styles, false),
                    new o.LiteralMapEntry('data', new o.LiteralMapExpr(customRenderData), false)
                ])]))
                .toDeclStmt(o.importType(Identifiers.RendererType2), [o.StmtModifier.Final, o.StmtModifier.Exported]));
        }
        const viewBuilderFactory = (parent) => {
            const embeddedViewIndex = embeddedViewCount++;
            return new ViewBuilder(this._reflector, outputCtx, parent, component, embeddedViewIndex, usedPipes, viewBuilderFactory);
        };
        const visitor = viewBuilderFactory(null);
        visitor.visitAll([], template);
        outputCtx.statements.push(...visitor.build());
        return new ViewCompileResult(visitor.viewName, renderComponentVarName);
    }
}
const LOG_VAR = o.variable('_l');
const VIEW_VAR = o.variable('_v');
const CHECK_VAR = o.variable('_ck');
const COMP_VAR = o.variable('_co');
const EVENT_NAME_VAR = o.variable('en');
const ALLOW_DEFAULT_VAR = o.variable(`ad`);
class ViewBuilder {
    constructor(reflector, outputCtx, parent, component, embeddedViewIndex, usedPipes, viewBuilderFactory) {
        this.reflector = reflector;
        this.outputCtx = outputCtx;
        this.parent = parent;
        this.component = component;
        this.embeddedViewIndex = embeddedViewIndex;
        this.usedPipes = usedPipes;
        this.viewBuilderFactory = viewBuilderFactory;
        this.nodes = [];
        this.purePipeNodeIndices = Object.create(null);
        // Need Object.create so that we don't have builtin values...
        this.refNodeIndices = Object.create(null);
        this.variables = [];
        this.children = [];
        // TODO(tbosch): The old view compiler used to use an `any` type
        // for the context in any embedded view. We keep this behaivor for now
        // to be able to introduce the new view compiler without too many errors.
        this.compType = this.embeddedViewIndex > 0 ?
            o.DYNAMIC_TYPE :
            o.expressionType(outputCtx.importExpr(this.component.type.reference));
        this.viewName = viewClassName(this.component.type.reference, this.embeddedViewIndex);
    }
    visitAll(variables, astNodes) {
        this.variables = variables;
        // create the pipes for the pure pipes immediately, so that we know their indices.
        if (!this.parent) {
            this.usedPipes.forEach((pipe) => {
                if (pipe.pure) {
                    this.purePipeNodeIndices[pipe.name] = this._createPipe(null, pipe);
                }
            });
        }
        if (!this.parent) {
            this.component.viewQueries.forEach((query, queryIndex) => {
                // Note: queries start with id 1 so we can use the number in a Bloom filter!
                const queryId = queryIndex + 1;
                const bindingType = query.first ? 0 /* First */ : 1 /* All */;
                const flags = 134217728 /* TypeViewQuery */ | calcQueryFlags(query);
                this.nodes.push(() => ({
                    sourceSpan: null,
                    nodeFlags: flags,
                    nodeDef: o.importExpr(Identifiers.queryDef).callFn([
                        o.literal(flags), o.literal(queryId),
                        new o.LiteralMapExpr([new o.LiteralMapEntry(query.propertyName, o.literal(bindingType), false)])
                    ])
                }));
            });
        }
        templateVisitAll(this, astNodes);
        if (this.parent && (astNodes.length === 0 || needsAdditionalRootNode(astNodes))) {
            // if the view is an embedded view, then we need to add an additional root node in some cases
            this.nodes.push(() => ({
                sourceSpan: null,
                nodeFlags: 1 /* TypeElement */,
                nodeDef: o.importExpr(Identifiers.anchorDef).callFn([
                    o.literal(0 /* None */), o.NULL_EXPR, o.NULL_EXPR, o.literal(0)
                ])
            }));
        }
    }
    build(targetStatements = []) {
        this.children.forEach((child) => child.build(targetStatements));
        const { updateRendererStmts, updateDirectivesStmts, nodeDefExprs } = this._createNodeExpressions();
        const updateRendererFn = this._createUpdateFn(updateRendererStmts);
        const updateDirectivesFn = this._createUpdateFn(updateDirectivesStmts);
        let viewFlags = 0 /* None */;
        if (!this.parent && this.component.changeDetection === ChangeDetectionStrategy.OnPush) {
            viewFlags |= 2 /* OnPush */;
        }
        const viewFactory = new o.DeclareFunctionStmt(this.viewName, [new o.FnParam(LOG_VAR.name)], [new o.ReturnStatement(o.importExpr(Identifiers.viewDef).callFn([
                o.literal(viewFlags),
                o.literalArr(nodeDefExprs),
                updateDirectivesFn,
                updateRendererFn,
            ]))], o.importType(Identifiers.ViewDefinition), this.embeddedViewIndex === 0 ? [o.StmtModifier.Exported] : []);
        targetStatements.push(viewFactory);
        return targetStatements;
    }
    _createUpdateFn(updateStmts) {
        let updateFn;
        if (updateStmts.length > 0) {
            const preStmts = [];
            if (!this.component.isHost && o.findReadVarNames(updateStmts).has(COMP_VAR.name)) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            updateFn = o.fn([
                new o.FnParam(CHECK_VAR.name, o.INFERRED_TYPE),
                new o.FnParam(VIEW_VAR.name, o.INFERRED_TYPE)
            ], [...preStmts, ...updateStmts], o.INFERRED_TYPE);
        }
        else {
            updateFn = o.NULL_EXPR;
        }
        return updateFn;
    }
    visitNgContent(ast, context) {
        // ngContentDef(ngContentIndex: number, index: number): NodeDef;
        this.nodes.push(() => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 8 /* TypeNgContent */,
            nodeDef: o.importExpr(Identifiers.ngContentDef)
                .callFn([o.literal(ast.ngContentIndex), o.literal(ast.index)])
        }));
    }
    visitText(ast, context) {
        // Static text nodes have no check function
        const checkIndex = -1;
        this.nodes.push(() => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: o.importExpr(Identifiers.textDef).callFn([
                o.literal(checkIndex),
                o.literal(ast.ngContentIndex),
                o.literalArr([o.literal(ast.value)]),
            ])
        }));
    }
    visitBoundText(ast, context) {
        const nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(null);
        const astWithSource = ast.value;
        const inter = astWithSource.ast;
        const updateRendererExpressions = inter.expressions.map((expr, bindingIndex) => this._preprocessUpdateExpression({ nodeIndex, bindingIndex, sourceSpan: ast.sourceSpan, context: COMP_VAR, value: expr }));
        // Check index is the same as the node index during compilation
        // They might only differ at runtime
        const checkIndex = nodeIndex;
        this.nodes[nodeIndex] = () => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: o.importExpr(Identifiers.textDef).callFn([
                o.literal(checkIndex),
                o.literal(ast.ngContentIndex),
                o.literalArr(inter.strings.map(s => o.literal(s))),
            ]),
            updateRenderer: updateRendererExpressions
        });
    }
    visitEmbeddedTemplate(ast, context) {
        const nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(null);
        const { flags, queryMatchesExpr, hostEvents } = this._visitElementOrTemplate(nodeIndex, ast);
        const childVisitor = this.viewBuilderFactory(this);
        this.children.push(childVisitor);
        childVisitor.visitAll(ast.variables, ast.children);
        const childCount = this.nodes.length - nodeIndex - 1;
        // anchorDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], ngContentIndex: number,
        //   childCount: number, handleEventFn?: ElementHandleEventFn, templateFactory?:
        //   ViewDefinitionFactory): NodeDef;
        this.nodes[nodeIndex] = () => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 /* TypeElement */ | flags,
            nodeDef: o.importExpr(Identifiers.anchorDef).callFn([
                o.literal(flags),
                queryMatchesExpr,
                o.literal(ast.ngContentIndex),
                o.literal(childCount),
                this._createElementHandleEventFn(nodeIndex, hostEvents),
                o.variable(childVisitor.viewName),
            ])
        });
    }
    visitElement(ast, context) {
        const nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(null);
        // Using a null element name creates an anchor.
        const elName = isNgContainer(ast.name) ? null : ast.name;
        const { flags, usedEvents, queryMatchesExpr, hostBindings: dirHostBindings, hostEvents } = this._visitElementOrTemplate(nodeIndex, ast);
        let inputDefs = [];
        let updateRendererExpressions = [];
        let outputDefs = [];
        if (elName) {
            const hostBindings = ast.inputs
                .map((inputAst) => ({
                context: COMP_VAR,
                inputAst,
                dirAst: null,
            }))
                .concat(dirHostBindings);
            if (hostBindings.length) {
                updateRendererExpressions =
                    hostBindings.map((hostBinding, bindingIndex) => this._preprocessUpdateExpression({
                        context: hostBinding.context,
                        nodeIndex,
                        bindingIndex,
                        sourceSpan: hostBinding.inputAst.sourceSpan,
                        value: hostBinding.inputAst.value
                    }));
                inputDefs = hostBindings.map(hostBinding => elementBindingDef(hostBinding.inputAst, hostBinding.dirAst));
            }
            outputDefs = usedEvents.map(([target, eventName]) => o.literalArr([o.literal(target), o.literal(eventName)]));
        }
        templateVisitAll(this, ast.children);
        const childCount = this.nodes.length - nodeIndex - 1;
        const compAst = ast.directives.find(dirAst => dirAst.directive.isComponent);
        let compRendererType = o.NULL_EXPR;
        let compView = o.NULL_EXPR;
        if (compAst) {
            compView = this.outputCtx.importExpr(compAst.directive.componentViewType);
            compRendererType = this.outputCtx.importExpr(compAst.directive.rendererType);
        }
        // Check index is the same as the node index during compilation
        // They might only differ at runtime
        const checkIndex = nodeIndex;
        this.nodes[nodeIndex] = () => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 /* TypeElement */ | flags,
            nodeDef: o.importExpr(Identifiers.elementDef).callFn([
                o.literal(checkIndex),
                o.literal(flags),
                queryMatchesExpr,
                o.literal(ast.ngContentIndex),
                o.literal(childCount),
                o.literal(elName),
                elName ? fixedAttrsDef(ast) : o.NULL_EXPR,
                inputDefs.length ? o.literalArr(inputDefs) : o.NULL_EXPR,
                outputDefs.length ? o.literalArr(outputDefs) : o.NULL_EXPR,
                this._createElementHandleEventFn(nodeIndex, hostEvents),
                compView,
                compRendererType,
            ]),
            updateRenderer: updateRendererExpressions
        });
    }
    _visitElementOrTemplate(nodeIndex, ast) {
        let flags = 0 /* None */;
        if (ast.hasViewContainer) {
            flags |= 16777216 /* EmbeddedViews */;
        }
        const usedEvents = new Map();
        ast.outputs.forEach((event) => {
            const { name, target } = elementEventNameAndTarget(event, null);
            usedEvents.set(elementEventFullName(target, name), [target, name]);
        });
        ast.directives.forEach((dirAst) => {
            dirAst.hostEvents.forEach((event) => {
                const { name, target } = elementEventNameAndTarget(event, dirAst);
                usedEvents.set(elementEventFullName(target, name), [target, name]);
            });
        });
        const hostBindings = [];
        const hostEvents = [];
        this._visitComponentFactoryResolverProvider(ast.directives);
        ast.providers.forEach(providerAst => {
            let dirAst = undefined;
            ast.directives.forEach(localDirAst => {
                if (localDirAst.directive.type.reference === tokenReference(providerAst.token)) {
                    dirAst = localDirAst;
                }
            });
            if (dirAst) {
                const { hostBindings: dirHostBindings, hostEvents: dirHostEvents } = this._visitDirective(providerAst, dirAst, ast.references, ast.queryMatches, usedEvents);
                hostBindings.push(...dirHostBindings);
                hostEvents.push(...dirHostEvents);
            }
            else {
                this._visitProvider(providerAst, ast.queryMatches);
            }
        });
        let queryMatchExprs = [];
        ast.queryMatches.forEach((match) => {
            let valueType = undefined;
            if (tokenReference(match.value) ===
                this.reflector.resolveExternalReference(Identifiers.ElementRef)) {
                valueType = 0 /* ElementRef */;
            }
            else if (tokenReference(match.value) ===
                this.reflector.resolveExternalReference(Identifiers.ViewContainerRef)) {
                valueType = 3 /* ViewContainerRef */;
            }
            else if (tokenReference(match.value) ===
                this.reflector.resolveExternalReference(Identifiers.TemplateRef)) {
                valueType = 2 /* TemplateRef */;
            }
            if (valueType != null) {
                queryMatchExprs.push(o.literalArr([o.literal(match.queryId), o.literal(valueType)]));
            }
        });
        ast.references.forEach((ref) => {
            let valueType = undefined;
            if (!ref.value) {
                valueType = 1 /* RenderElement */;
            }
            else if (tokenReference(ref.value) ===
                this.reflector.resolveExternalReference(Identifiers.TemplateRef)) {
                valueType = 2 /* TemplateRef */;
            }
            if (valueType != null) {
                this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(o.literalArr([o.literal(ref.name), o.literal(valueType)]));
            }
        });
        ast.outputs.forEach((outputAst) => {
            hostEvents.push({ context: COMP_VAR, eventAst: outputAst, dirAst: null });
        });
        return {
            flags,
            usedEvents: Array.from(usedEvents.values()),
            queryMatchesExpr: queryMatchExprs.length ? o.literalArr(queryMatchExprs) : o.NULL_EXPR,
            hostBindings,
            hostEvents: hostEvents
        };
    }
    _visitDirective(providerAst, dirAst, refs, queryMatches, usedEvents) {
        const nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(null);
        dirAst.directive.queries.forEach((query, queryIndex) => {
            const queryId = dirAst.contentQueryStartId + queryIndex;
            const flags = 67108864 /* TypeContentQuery */ | calcQueryFlags(query);
            const bindingType = query.first ? 0 /* First */ : 1 /* All */;
            this.nodes.push(() => ({
                sourceSpan: dirAst.sourceSpan,
                nodeFlags: flags,
                nodeDef: o.importExpr(Identifiers.queryDef).callFn([
                    o.literal(flags), o.literal(queryId),
                    new o.LiteralMapExpr([new o.LiteralMapEntry(query.propertyName, o.literal(bindingType), false)])
                ]),
            }));
        });
        // Note: the operation below might also create new nodeDefs,
        // but we don't want them to be a child of a directive,
        // as they might be a provider/pipe on their own.
        // I.e. we only allow queries as children of directives nodes.
        const childCount = this.nodes.length - nodeIndex - 1;
        let { flags, queryMatchExprs, providerExpr, depsExpr } = this._visitProviderOrDirective(providerAst, queryMatches);
        refs.forEach((ref) => {
            if (ref.value && tokenReference(ref.value) === tokenReference(providerAst.token)) {
                this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(o.literalArr([o.literal(ref.name), o.literal(4 /* Provider */)]));
            }
        });
        if (dirAst.directive.isComponent) {
            flags |= 32768 /* Component */;
        }
        const inputDefs = dirAst.inputs.map((inputAst, inputIndex) => {
            const mapValue = o.literalArr([o.literal(inputIndex), o.literal(inputAst.directiveName)]);
            // Note: it's important to not quote the key so that we can capture renames by minifiers!
            return new o.LiteralMapEntry(inputAst.directiveName, mapValue, false);
        });
        const outputDefs = [];
        const dirMeta = dirAst.directive;
        Object.keys(dirMeta.outputs).forEach((propName) => {
            const eventName = dirMeta.outputs[propName];
            if (usedEvents.has(eventName)) {
                // Note: it's important to not quote the key so that we can capture renames by minifiers!
                outputDefs.push(new o.LiteralMapEntry(propName, o.literal(eventName), false));
            }
        });
        let updateDirectiveExpressions = [];
        if (dirAst.inputs.length || (flags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0) {
            updateDirectiveExpressions =
                dirAst.inputs.map((input, bindingIndex) => this._preprocessUpdateExpression({
                    nodeIndex,
                    bindingIndex,
                    sourceSpan: input.sourceSpan,
                    context: COMP_VAR,
                    value: input.value
                }));
        }
        const dirContextExpr = o.importExpr(Identifiers.nodeValue).callFn([VIEW_VAR, o.literal(nodeIndex)]);
        const hostBindings = dirAst.hostProperties.map((inputAst) => ({
            context: dirContextExpr,
            dirAst,
            inputAst,
        }));
        const hostEvents = dirAst.hostEvents.map((hostEventAst) => ({
            context: dirContextExpr,
            eventAst: hostEventAst,
            dirAst,
        }));
        // Check index is the same as the node index during compilation
        // They might only differ at runtime
        const checkIndex = nodeIndex;
        this.nodes[nodeIndex] = () => ({
            sourceSpan: dirAst.sourceSpan,
            nodeFlags: 16384 /* TypeDirective */ | flags,
            nodeDef: o.importExpr(Identifiers.directiveDef).callFn([
                o.literal(checkIndex),
                o.literal(flags),
                queryMatchExprs.length ? o.literalArr(queryMatchExprs) : o.NULL_EXPR,
                o.literal(childCount),
                providerExpr,
                depsExpr,
                inputDefs.length ? new o.LiteralMapExpr(inputDefs) : o.NULL_EXPR,
                outputDefs.length ? new o.LiteralMapExpr(outputDefs) : o.NULL_EXPR,
            ]),
            updateDirectives: updateDirectiveExpressions,
            directive: dirAst.directive.type,
        });
        return { hostBindings, hostEvents };
    }
    _visitProvider(providerAst, queryMatches) {
        this._addProviderNode(this._visitProviderOrDirective(providerAst, queryMatches));
    }
    _visitComponentFactoryResolverProvider(directives) {
        const componentDirMeta = directives.find(dirAst => dirAst.directive.isComponent);
        if (componentDirMeta && componentDirMeta.directive.entryComponents.length) {
            const { providerExpr, depsExpr, flags, tokenExpr } = componentFactoryResolverProviderDef(this.reflector, this.outputCtx, 8192 /* PrivateProvider */, componentDirMeta.directive.entryComponents);
            this._addProviderNode({
                providerExpr,
                depsExpr,
                flags,
                tokenExpr,
                queryMatchExprs: [],
                sourceSpan: componentDirMeta.sourceSpan
            });
        }
    }
    _addProviderNode(data) {
        // providerDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], token:any,
        //   value: any, deps: ([DepFlags, any] | any)[]): NodeDef;
        this.nodes.push(() => ({
            sourceSpan: data.sourceSpan,
            nodeFlags: data.flags,
            nodeDef: o.importExpr(Identifiers.providerDef).callFn([
                o.literal(data.flags),
                data.queryMatchExprs.length ? o.literalArr(data.queryMatchExprs) : o.NULL_EXPR,
                data.tokenExpr, data.providerExpr, data.depsExpr
            ])
        }));
    }
    _visitProviderOrDirective(providerAst, queryMatches) {
        let flags = 0 /* None */;
        let queryMatchExprs = [];
        queryMatches.forEach((match) => {
            if (tokenReference(match.value) === tokenReference(providerAst.token)) {
                queryMatchExprs.push(o.literalArr([o.literal(match.queryId), o.literal(4 /* Provider */)]));
            }
        });
        const { providerExpr, depsExpr, flags: providerFlags, tokenExpr } = providerDef(this.outputCtx, providerAst);
        return {
            flags: flags | providerFlags,
            queryMatchExprs,
            providerExpr,
            depsExpr,
            tokenExpr,
            sourceSpan: providerAst.sourceSpan
        };
    }
    getLocal(name) {
        if (name == EventHandlerVars.event.name) {
            return EventHandlerVars.event;
        }
        let currViewExpr = VIEW_VAR;
        for (let currBuilder = this; currBuilder; currBuilder = currBuilder.parent,
            currViewExpr = currViewExpr.prop('parent').cast(o.DYNAMIC_TYPE)) {
            // check references
            const refNodeIndex = currBuilder.refNodeIndices[name];
            if (refNodeIndex != null) {
                return o.importExpr(Identifiers.nodeValue).callFn([currViewExpr, o.literal(refNodeIndex)]);
            }
            // check variables
            const varAst = currBuilder.variables.find((varAst) => varAst.name === name);
            if (varAst) {
                const varValue = varAst.value || IMPLICIT_TEMPLATE_VAR;
                return currViewExpr.prop('context').prop(varValue);
            }
        }
        return null;
    }
    notifyImplicitReceiverUse() {
        // Not needed in ViewEngine as ViewEngine walks through the generated
        // expressions to figure out if the implicit receiver is used and needs
        // to be generated as part of the pre-update statements.
    }
    maybeRestoreView() {
        // Not necessary in ViewEngine, because view restoration is an Ivy concept.
    }
    _createLiteralArrayConverter(sourceSpan, argCount) {
        if (argCount === 0) {
            const valueExpr = o.importExpr(Identifiers.EMPTY_ARRAY);
            return () => valueExpr;
        }
        const checkIndex = this.nodes.length;
        this.nodes.push(() => ({
            sourceSpan,
            nodeFlags: 32 /* TypePureArray */,
            nodeDef: o.importExpr(Identifiers.pureArrayDef).callFn([
                o.literal(checkIndex),
                o.literal(argCount),
            ])
        }));
        return (args) => callCheckStmt(checkIndex, args);
    }
    _createLiteralMapConverter(sourceSpan, keys) {
        if (keys.length === 0) {
            const valueExpr = o.importExpr(Identifiers.EMPTY_MAP);
            return () => valueExpr;
        }
        const map = o.literalMap(keys.map((e, i) => (Object.assign(Object.assign({}, e), { value: o.literal(i) }))));
        const checkIndex = this.nodes.length;
        this.nodes.push(() => ({
            sourceSpan,
            nodeFlags: 64 /* TypePureObject */,
            nodeDef: o.importExpr(Identifiers.pureObjectDef).callFn([
                o.literal(checkIndex),
                map,
            ])
        }));
        return (args) => callCheckStmt(checkIndex, args);
    }
    _createPipeConverter(expression, name, argCount) {
        const pipe = this.usedPipes.find((pipeSummary) => pipeSummary.name === name);
        if (pipe.pure) {
            const checkIndex = this.nodes.length;
            this.nodes.push(() => ({
                sourceSpan: expression.sourceSpan,
                nodeFlags: 128 /* TypePurePipe */,
                nodeDef: o.importExpr(Identifiers.purePipeDef).callFn([
                    o.literal(checkIndex),
                    o.literal(argCount),
                ])
            }));
            // find underlying pipe in the component view
            let compViewExpr = VIEW_VAR;
            let compBuilder = this;
            while (compBuilder.parent) {
                compBuilder = compBuilder.parent;
                compViewExpr = compViewExpr.prop('parent').cast(o.DYNAMIC_TYPE);
            }
            const pipeNodeIndex = compBuilder.purePipeNodeIndices[name];
            const pipeValueExpr = o.importExpr(Identifiers.nodeValue).callFn([compViewExpr, o.literal(pipeNodeIndex)]);
            return (args) => callUnwrapValue(expression.nodeIndex, expression.bindingIndex, callCheckStmt(checkIndex, [pipeValueExpr].concat(args)));
        }
        else {
            const nodeIndex = this._createPipe(expression.sourceSpan, pipe);
            const nodeValueExpr = o.importExpr(Identifiers.nodeValue).callFn([VIEW_VAR, o.literal(nodeIndex)]);
            return (args) => callUnwrapValue(expression.nodeIndex, expression.bindingIndex, nodeValueExpr.callMethod('transform', args));
        }
    }
    _createPipe(sourceSpan, pipe) {
        const nodeIndex = this.nodes.length;
        let flags = 0 /* None */;
        pipe.type.lifecycleHooks.forEach((lifecycleHook) => {
            // for pipes, we only support ngOnDestroy
            if (lifecycleHook === LifecycleHooks.OnDestroy) {
                flags |= lifecycleHookToNodeFlag(lifecycleHook);
            }
        });
        const depExprs = pipe.type.diDeps.map((diDep) => depDef(this.outputCtx, diDep));
        // function pipeDef(
        //   flags: NodeFlags, ctor: any, deps: ([DepFlags, any] | any)[]): NodeDef
        this.nodes.push(() => ({
            sourceSpan,
            nodeFlags: 16 /* TypePipe */,
            nodeDef: o.importExpr(Identifiers.pipeDef).callFn([
                o.literal(flags), this.outputCtx.importExpr(pipe.type.reference), o.literalArr(depExprs)
            ])
        }));
        return nodeIndex;
    }
    /**
     * For the AST in `UpdateExpression.value`:
     * - create nodes for pipes, literal arrays and, literal maps,
     * - update the AST to replace pipes, literal arrays and, literal maps with calls to check fn.
     *
     * WARNING: This might create new nodeDefs (for pipes and literal arrays and literal maps)!
     */
    _preprocessUpdateExpression(expression) {
        return {
            nodeIndex: expression.nodeIndex,
            bindingIndex: expression.bindingIndex,
            sourceSpan: expression.sourceSpan,
            context: expression.context,
            value: convertPropertyBindingBuiltins({
                createLiteralArrayConverter: (argCount) => this._createLiteralArrayConverter(expression.sourceSpan, argCount),
                createLiteralMapConverter: (keys) => this._createLiteralMapConverter(expression.sourceSpan, keys),
                createPipeConverter: (name, argCount) => this._createPipeConverter(expression, name, argCount)
            }, expression.value)
        };
    }
    _createNodeExpressions() {
        const self = this;
        let updateBindingCount = 0;
        const updateRendererStmts = [];
        const updateDirectivesStmts = [];
        const nodeDefExprs = this.nodes.map((factory, nodeIndex) => {
            const { nodeDef, nodeFlags, updateDirectives, updateRenderer, sourceSpan } = factory();
            if (updateRenderer) {
                updateRendererStmts.push(...createUpdateStatements(nodeIndex, sourceSpan, updateRenderer, false));
            }
            if (updateDirectives) {
                updateDirectivesStmts.push(...createUpdateStatements(nodeIndex, sourceSpan, updateDirectives, (nodeFlags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0));
            }
            // We use a comma expression to call the log function before
            // the nodeDef function, but still use the result of the nodeDef function
            // as the value.
            // Note: We only add the logger to elements / text nodes,
            // so we don't generate too much code.
            const logWithNodeDef = nodeFlags & 3 /* CatRenderNode */ ?
                new o.CommaExpr([LOG_VAR.callFn([]).callFn([]), nodeDef]) :
                nodeDef;
            return o.applySourceSpanToExpressionIfNeeded(logWithNodeDef, sourceSpan);
        });
        return { updateRendererStmts, updateDirectivesStmts, nodeDefExprs };
        function createUpdateStatements(nodeIndex, sourceSpan, expressions, allowEmptyExprs) {
            const updateStmts = [];
            const exprs = expressions.map(({ sourceSpan, context, value }) => {
                const bindingId = `${updateBindingCount++}`;
                const nameResolver = context === COMP_VAR ? self : null;
                const { stmts, currValExpr } = convertPropertyBinding(nameResolver, context, value, bindingId, BindingForm.General);
                updateStmts.push(...stmts.map((stmt) => o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan)));
                return o.applySourceSpanToExpressionIfNeeded(currValExpr, sourceSpan);
            });
            if (expressions.length || allowEmptyExprs) {
                updateStmts.push(o.applySourceSpanToStatementIfNeeded(callCheckStmt(nodeIndex, exprs).toStmt(), sourceSpan));
            }
            return updateStmts;
        }
    }
    _createElementHandleEventFn(nodeIndex, handlers) {
        const handleEventStmts = [];
        let handleEventBindingCount = 0;
        handlers.forEach(({ context, eventAst, dirAst }) => {
            const bindingId = `${handleEventBindingCount++}`;
            const nameResolver = context === COMP_VAR ? this : null;
            const { stmts, allowDefault } = convertActionBinding(nameResolver, context, eventAst.handler, bindingId);
            const trueStmts = stmts;
            if (allowDefault) {
                trueStmts.push(ALLOW_DEFAULT_VAR.set(allowDefault.and(ALLOW_DEFAULT_VAR)).toStmt());
            }
            const { target: eventTarget, name: eventName } = elementEventNameAndTarget(eventAst, dirAst);
            const fullEventName = elementEventFullName(eventTarget, eventName);
            handleEventStmts.push(o.applySourceSpanToStatementIfNeeded(new o.IfStmt(o.literal(fullEventName).identical(EVENT_NAME_VAR), trueStmts), eventAst.sourceSpan));
        });
        let handleEventFn;
        if (handleEventStmts.length > 0) {
            const preStmts = [ALLOW_DEFAULT_VAR.set(o.literal(true)).toDeclStmt(o.BOOL_TYPE)];
            if (!this.component.isHost && o.findReadVarNames(handleEventStmts).has(COMP_VAR.name)) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            handleEventFn = o.fn([
                new o.FnParam(VIEW_VAR.name, o.INFERRED_TYPE),
                new o.FnParam(EVENT_NAME_VAR.name, o.INFERRED_TYPE),
                new o.FnParam(EventHandlerVars.event.name, o.INFERRED_TYPE)
            ], [...preStmts, ...handleEventStmts, new o.ReturnStatement(ALLOW_DEFAULT_VAR)], o.INFERRED_TYPE);
        }
        else {
            handleEventFn = o.NULL_EXPR;
        }
        return handleEventFn;
    }
    visitDirective(ast, context) { }
    visitDirectiveProperty(ast, context) { }
    visitReference(ast, context) { }
    visitVariable(ast, context) { }
    visitEvent(ast, context) { }
    visitElementProperty(ast, context) { }
    visitAttr(ast, context) { }
}
function needsAdditionalRootNode(astNodes) {
    const lastAstNode = astNodes[astNodes.length - 1];
    if (lastAstNode instanceof EmbeddedTemplateAst) {
        return lastAstNode.hasViewContainer;
    }
    if (lastAstNode instanceof ElementAst) {
        if (isNgContainer(lastAstNode.name) && lastAstNode.children.length) {
            return needsAdditionalRootNode(lastAstNode.children);
        }
        return lastAstNode.hasViewContainer;
    }
    return lastAstNode instanceof NgContentAst;
}
function elementBindingDef(inputAst, dirAst) {
    const inputType = inputAst.type;
    switch (inputType) {
        case 1 /* Attribute */:
            return o.literalArr([
                o.literal(1 /* TypeElementAttribute */), o.literal(inputAst.name),
                o.literal(inputAst.securityContext)
            ]);
        case 0 /* Property */:
            return o.literalArr([
                o.literal(8 /* TypeProperty */), o.literal(inputAst.name),
                o.literal(inputAst.securityContext)
            ]);
        case 4 /* Animation */:
            const bindingType = 8 /* TypeProperty */ |
                (dirAst && dirAst.directive.isComponent ? 32 /* SyntheticHostProperty */ :
                    16 /* SyntheticProperty */);
            return o.literalArr([
                o.literal(bindingType), o.literal('@' + inputAst.name), o.literal(inputAst.securityContext)
            ]);
        case 2 /* Class */:
            return o.literalArr([o.literal(2 /* TypeElementClass */), o.literal(inputAst.name), o.NULL_EXPR]);
        case 3 /* Style */:
            return o.literalArr([
                o.literal(4 /* TypeElementStyle */), o.literal(inputAst.name), o.literal(inputAst.unit)
            ]);
        default:
            // This default case is not needed by TypeScript compiler, as the switch is exhaustive.
            // However Closure Compiler does not understand that and reports an error in typed mode.
            // The `throw new Error` below works around the problem, and the unexpected: never variable
            // makes sure tsc still checks this code is unreachable.
            const unexpected = inputType;
            throw new Error(`unexpected ${unexpected}`);
    }
}
function fixedAttrsDef(elementAst) {
    const mapResult = Object.create(null);
    elementAst.attrs.forEach(attrAst => {
        mapResult[attrAst.name] = attrAst.value;
    });
    elementAst.directives.forEach(dirAst => {
        Object.keys(dirAst.directive.hostAttributes).forEach(name => {
            const value = dirAst.directive.hostAttributes[name];
            const prevValue = mapResult[name];
            mapResult[name] = prevValue != null ? mergeAttributeValue(name, prevValue, value) : value;
        });
    });
    // Note: We need to sort to get a defined output order
    // for tests and for caching generated artifacts...
    return o.literalArr(Object.keys(mapResult).sort().map((attrName) => o.literalArr([o.literal(attrName), o.literal(mapResult[attrName])])));
}
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
    if (attrName == CLASS_ATTR || attrName == STYLE_ATTR) {
        return `${attrValue1} ${attrValue2}`;
    }
    else {
        return attrValue2;
    }
}
function callCheckStmt(nodeIndex, exprs) {
    if (exprs.length > 10) {
        return CHECK_VAR.callFn([VIEW_VAR, o.literal(nodeIndex), o.literal(1 /* Dynamic */), o.literalArr(exprs)]);
    }
    else {
        return CHECK_VAR.callFn([VIEW_VAR, o.literal(nodeIndex), o.literal(0 /* Inline */), ...exprs]);
    }
}
function callUnwrapValue(nodeIndex, bindingIdx, expr) {
    return o.importExpr(Identifiers.unwrapValue).callFn([
        VIEW_VAR, o.literal(nodeIndex), o.literal(bindingIdx), expr
    ]);
}
function elementEventNameAndTarget(eventAst, dirAst) {
    if (eventAst.isAnimation) {
        return {
            name: `@${eventAst.name}.${eventAst.phase}`,
            target: dirAst && dirAst.directive.isComponent ? 'component' : null
        };
    }
    else {
        return eventAst;
    }
}
function calcQueryFlags(query) {
    let flags = 0 /* None */;
    // Note: We only make queries static that query for a single item and the user specifically
    // set the to be static. This is because of backwards compatibility with the old view compiler...
    if (query.first && query.static) {
        flags |= 268435456 /* StaticQuery */;
    }
    else {
        flags |= 536870912 /* DynamicQuery */;
    }
    if (query.emitDistinctChangesOnly) {
        flags |= -2147483648 /* EmitDistinctChangesOnly */;
    }
    return flags;
}
export function elementEventFullName(target, name) {
    return target ? `${target}:${name}` : name;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy92aWV3X2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFxRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFeEosT0FBTyxFQUFDLFdBQVcsRUFBb0Isb0JBQW9CLEVBQUUsc0JBQXNCLEVBQUUsOEJBQThCLEVBQUUsZ0JBQWdCLEVBQWdCLE1BQU0sdUNBQXVDLENBQUM7QUFDbk0sT0FBTyxFQUE2Qix1QkFBdUIsRUFBeUQsTUFBTSxTQUFTLENBQUM7QUFFcEksT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDaEQsT0FBTyxLQUFLLENBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUU3RCxPQUFPLEVBQXlHLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLEVBQStGLGdCQUFnQixFQUF1QixNQUFNLGlDQUFpQyxDQUFDO0FBRzNVLE9BQU8sRUFBQyxtQ0FBbUMsRUFBRSxNQUFNLEVBQUUsdUJBQXVCLEVBQUUsV0FBVyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFdEgsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDO0FBQzNCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUMzQixNQUFNLHFCQUFxQixHQUFHLFlBQVksQ0FBQztBQUUzQyxNQUFNLE9BQU8saUJBQWlCO0lBQzVCLFlBQW1CLFlBQW9CLEVBQVMsZUFBdUI7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RUQsU0FBUyxjQUFjLENBQUMsS0FBMkI7SUFDakQsSUFBSSxLQUFLLGVBQWlCLENBQUM7SUFDM0IsMkZBQTJGO0lBQzNGLGlHQUFpRztJQUNqRyxJQUFJLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUMvQixLQUFLLCtCQUF5QixDQUFDO0tBQ2hDO1NBQU07UUFDTCxLQUFLLGdDQUEwQixDQUFDO0tBQ2pDO0lBQ0QsSUFBSSxLQUFLLENBQUMsdUJBQXVCLEVBQUU7UUFDakMsS0FBSyw2Q0FBcUMsQ0FBQztLQUM1QztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxNQUFtQixFQUFFLElBQVk7SUFDcEUsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDN0MsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgQ29tcGlsZVBpcGVTdW1tYXJ5LCBDb21waWxlUXVlcnlNZXRhZGF0YSwgcmVuZGVyZXJUeXBlTmFtZSwgdG9rZW5SZWZlcmVuY2UsIHZpZXdDbGFzc05hbWV9IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtDb21waWxlUmVmbGVjdG9yfSBmcm9tICcuLi9jb21waWxlX3JlZmxlY3Rvcic7XG5pbXBvcnQge0JpbmRpbmdGb3JtLCBCdWlsdGluQ29udmVydGVyLCBjb252ZXJ0QWN0aW9uQmluZGluZywgY29udmVydFByb3BlcnR5QmluZGluZywgY29udmVydFByb3BlcnR5QmluZGluZ0J1aWx0aW5zLCBFdmVudEhhbmRsZXJWYXJzLCBMb2NhbFJlc29sdmVyfSBmcm9tICcuLi9jb21waWxlcl91dGlsL2V4cHJlc3Npb25fY29udmVydGVyJztcbmltcG9ydCB7QXJndW1lbnRUeXBlLCBCaW5kaW5nRmxhZ3MsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBOb2RlRmxhZ3MsIFF1ZXJ5QmluZGluZ1R5cGUsIFF1ZXJ5VmFsdWVUeXBlLCBWaWV3RmxhZ3N9IGZyb20gJy4uL2NvcmUnO1xuaW1wb3J0IHtBU1QsIEFTVFdpdGhTb3VyY2UsIEludGVycG9sYXRpb259IGZyb20gJy4uL2V4cHJlc3Npb25fcGFyc2VyL2FzdCc7XG5pbXBvcnQge0lkZW50aWZpZXJzfSBmcm9tICcuLi9pZGVudGlmaWVycyc7XG5pbXBvcnQge0xpZmVjeWNsZUhvb2tzfSBmcm9tICcuLi9saWZlY3ljbGVfcmVmbGVjdG9yJztcbmltcG9ydCB7aXNOZ0NvbnRhaW5lcn0gZnJvbSAnLi4vbWxfcGFyc2VyL3RhZ3MnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge2NvbnZlcnRWYWx1ZVRvT3V0cHV0QXN0fSBmcm9tICcuLi9vdXRwdXQvdmFsdWVfdXRpbCc7XG5pbXBvcnQge1BhcnNlU291cmNlU3Bhbn0gZnJvbSAnLi4vcGFyc2VfdXRpbCc7XG5pbXBvcnQge0F0dHJBc3QsIEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsIEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LCBCb3VuZEV2ZW50QXN0LCBCb3VuZFRleHRBc3QsIERpcmVjdGl2ZUFzdCwgRWxlbWVudEFzdCwgRW1iZWRkZWRUZW1wbGF0ZUFzdCwgTmdDb250ZW50QXN0LCBQcm9wZXJ0eUJpbmRpbmdUeXBlLCBQcm92aWRlckFzdCwgUXVlcnlNYXRjaCwgUmVmZXJlbmNlQXN0LCBUZW1wbGF0ZUFzdCwgVGVtcGxhdGVBc3RWaXNpdG9yLCB0ZW1wbGF0ZVZpc2l0QWxsLCBUZXh0QXN0LCBWYXJpYWJsZUFzdH0gZnJvbSAnLi4vdGVtcGxhdGVfcGFyc2VyL3RlbXBsYXRlX2FzdCc7XG5pbXBvcnQge091dHB1dENvbnRleHR9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlclByb3ZpZGVyRGVmLCBkZXBEZWYsIGxpZmVjeWNsZUhvb2tUb05vZGVGbGFnLCBwcm92aWRlckRlZn0gZnJvbSAnLi9wcm92aWRlcl9jb21waWxlcic7XG5cbmNvbnN0IENMQVNTX0FUVFIgPSAnY2xhc3MnO1xuY29uc3QgU1RZTEVfQVRUUiA9ICdzdHlsZSc7XG5jb25zdCBJTVBMSUNJVF9URU1QTEFURV9WQVIgPSAnXFwkaW1wbGljaXQnO1xuXG5leHBvcnQgY2xhc3MgVmlld0NvbXBpbGVSZXN1bHQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmlld0NsYXNzVmFyOiBzdHJpbmcsIHB1YmxpYyByZW5kZXJlclR5cGVWYXI6IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIFZpZXdDb21waWxlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JlZmxlY3RvcjogQ29tcGlsZVJlZmxlY3Rvcikge31cblxuICBjb21waWxlQ29tcG9uZW50KFxuICAgICAgb3V0cHV0Q3R4OiBPdXRwdXRDb250ZXh0LCBjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgdGVtcGxhdGU6IFRlbXBsYXRlQXN0W10sXG4gICAgICBzdHlsZXM6IG8uRXhwcmVzc2lvbiwgdXNlZFBpcGVzOiBDb21waWxlUGlwZVN1bW1hcnlbXSk6IFZpZXdDb21waWxlUmVzdWx0IHtcbiAgICBsZXQgZW1iZWRkZWRWaWV3Q291bnQgPSAwO1xuXG4gICAgbGV0IHJlbmRlckNvbXBvbmVudFZhck5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCE7XG4gICAgaWYgKCFjb21wb25lbnQuaXNIb3N0KSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGNvbXBvbmVudC50ZW1wbGF0ZSAhO1xuICAgICAgY29uc3QgY3VzdG9tUmVuZGVyRGF0YTogby5MaXRlcmFsTWFwRW50cnlbXSA9IFtdO1xuICAgICAgaWYgKHRlbXBsYXRlLmFuaW1hdGlvbnMgJiYgdGVtcGxhdGUuYW5pbWF0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgY3VzdG9tUmVuZGVyRGF0YS5wdXNoKG5ldyBvLkxpdGVyYWxNYXBFbnRyeShcbiAgICAgICAgICAgICdhbmltYXRpb24nLCBjb252ZXJ0VmFsdWVUb091dHB1dEFzdChvdXRwdXRDdHgsIHRlbXBsYXRlLmFuaW1hdGlvbnMpLCB0cnVlKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlbmRlckNvbXBvbmVudFZhciA9IG8udmFyaWFibGUocmVuZGVyZXJUeXBlTmFtZShjb21wb25lbnQudHlwZS5yZWZlcmVuY2UpKTtcbiAgICAgIHJlbmRlckNvbXBvbmVudFZhck5hbWUgPSByZW5kZXJDb21wb25lbnRWYXIubmFtZSE7XG4gICAgICBvdXRwdXRDdHguc3RhdGVtZW50cy5wdXNoKFxuICAgICAgICAgIHJlbmRlckNvbXBvbmVudFZhclxuICAgICAgICAgICAgICAuc2V0KG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5jcmVhdGVSZW5kZXJlclR5cGUyKS5jYWxsRm4oW25ldyBvLkxpdGVyYWxNYXBFeHByKFtcbiAgICAgICAgICAgICAgICBuZXcgby5MaXRlcmFsTWFwRW50cnkoJ2VuY2Fwc3VsYXRpb24nLCBvLmxpdGVyYWwodGVtcGxhdGUuZW5jYXBzdWxhdGlvbiksIGZhbHNlKSxcbiAgICAgICAgICAgICAgICBuZXcgby5MaXRlcmFsTWFwRW50cnkoJ3N0eWxlcycsIHN0eWxlcywgZmFsc2UpLFxuICAgICAgICAgICAgICAgIG5ldyBvLkxpdGVyYWxNYXBFbnRyeSgnZGF0YScsIG5ldyBvLkxpdGVyYWxNYXBFeHByKGN1c3RvbVJlbmRlckRhdGEpLCBmYWxzZSlcbiAgICAgICAgICAgICAgXSldKSlcbiAgICAgICAgICAgICAgLnRvRGVjbFN0bXQoXG4gICAgICAgICAgICAgICAgICBvLmltcG9ydFR5cGUoSWRlbnRpZmllcnMuUmVuZGVyZXJUeXBlMiksXG4gICAgICAgICAgICAgICAgICBbby5TdG10TW9kaWZpZXIuRmluYWwsIG8uU3RtdE1vZGlmaWVyLkV4cG9ydGVkXSkpO1xuICAgIH1cblxuICAgIGNvbnN0IHZpZXdCdWlsZGVyRmFjdG9yeSA9IChwYXJlbnQ6IFZpZXdCdWlsZGVyfG51bGwpOiBWaWV3QnVpbGRlciA9PiB7XG4gICAgICBjb25zdCBlbWJlZGRlZFZpZXdJbmRleCA9IGVtYmVkZGVkVmlld0NvdW50Kys7XG4gICAgICByZXR1cm4gbmV3IFZpZXdCdWlsZGVyKFxuICAgICAgICAgIHRoaXMuX3JlZmxlY3Rvciwgb3V0cHV0Q3R4LCBwYXJlbnQsIGNvbXBvbmVudCwgZW1iZWRkZWRWaWV3SW5kZXgsIHVzZWRQaXBlcyxcbiAgICAgICAgICB2aWV3QnVpbGRlckZhY3RvcnkpO1xuICAgIH07XG5cbiAgICBjb25zdCB2aXNpdG9yID0gdmlld0J1aWxkZXJGYWN0b3J5KG51bGwpO1xuICAgIHZpc2l0b3IudmlzaXRBbGwoW10sIHRlbXBsYXRlKTtcblxuICAgIG91dHB1dEN0eC5zdGF0ZW1lbnRzLnB1c2goLi4udmlzaXRvci5idWlsZCgpKTtcblxuICAgIHJldHVybiBuZXcgVmlld0NvbXBpbGVSZXN1bHQodmlzaXRvci52aWV3TmFtZSwgcmVuZGVyQ29tcG9uZW50VmFyTmFtZSk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFZpZXdCdWlsZGVyRmFjdG9yeSB7XG4gIChwYXJlbnQ6IFZpZXdCdWlsZGVyKTogVmlld0J1aWxkZXI7XG59XG5cbmludGVyZmFjZSBVcGRhdGVFeHByZXNzaW9uIHtcbiAgY29udGV4dDogby5FeHByZXNzaW9uO1xuICBub2RlSW5kZXg6IG51bWJlcjtcbiAgYmluZGluZ0luZGV4OiBudW1iZXI7XG4gIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbjtcbiAgdmFsdWU6IEFTVDtcbn1cblxuY29uc3QgTE9HX1ZBUiA9IG8udmFyaWFibGUoJ19sJyk7XG5jb25zdCBWSUVXX1ZBUiA9IG8udmFyaWFibGUoJ192Jyk7XG5jb25zdCBDSEVDS19WQVIgPSBvLnZhcmlhYmxlKCdfY2snKTtcbmNvbnN0IENPTVBfVkFSID0gby52YXJpYWJsZSgnX2NvJyk7XG5jb25zdCBFVkVOVF9OQU1FX1ZBUiA9IG8udmFyaWFibGUoJ2VuJyk7XG5jb25zdCBBTExPV19ERUZBVUxUX1ZBUiA9IG8udmFyaWFibGUoYGFkYCk7XG5cbmNsYXNzIFZpZXdCdWlsZGVyIGltcGxlbWVudHMgVGVtcGxhdGVBc3RWaXNpdG9yLCBMb2NhbFJlc29sdmVyIHtcbiAgcHJpdmF0ZSBjb21wVHlwZTogby5UeXBlO1xuICBwcml2YXRlIG5vZGVzOiAoKCkgPT4ge1xuICAgIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbiB8IG51bGwsXG4gICAgbm9kZURlZjogby5FeHByZXNzaW9uLFxuICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLFxuICAgIHVwZGF0ZURpcmVjdGl2ZXM/OiBVcGRhdGVFeHByZXNzaW9uW10sXG4gICAgdXBkYXRlUmVuZGVyZXI/OiBVcGRhdGVFeHByZXNzaW9uW11cbiAgfSlbXSA9IFtdO1xuICBwcml2YXRlIHB1cmVQaXBlTm9kZUluZGljZXM6IHtbcGlwZU5hbWU6IHN0cmluZ106IG51bWJlcn0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAvLyBOZWVkIE9iamVjdC5jcmVhdGUgc28gdGhhdCB3ZSBkb24ndCBoYXZlIGJ1aWx0aW4gdmFsdWVzLi4uXG4gIHByaXZhdGUgcmVmTm9kZUluZGljZXM6IHtbcmVmTmFtZTogc3RyaW5nXTogbnVtYmVyfSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHByaXZhdGUgdmFyaWFibGVzOiBWYXJpYWJsZUFzdFtdID0gW107XG4gIHByaXZhdGUgY2hpbGRyZW46IFZpZXdCdWlsZGVyW10gPSBbXTtcblxuICBwdWJsaWMgcmVhZG9ubHkgdmlld05hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcmVmbGVjdG9yOiBDb21waWxlUmVmbGVjdG9yLCBwcml2YXRlIG91dHB1dEN0eDogT3V0cHV0Q29udGV4dCxcbiAgICAgIHByaXZhdGUgcGFyZW50OiBWaWV3QnVpbGRlcnxudWxsLCBwcml2YXRlIGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgcHJpdmF0ZSBlbWJlZGRlZFZpZXdJbmRleDogbnVtYmVyLCBwcml2YXRlIHVzZWRQaXBlczogQ29tcGlsZVBpcGVTdW1tYXJ5W10sXG4gICAgICBwcml2YXRlIHZpZXdCdWlsZGVyRmFjdG9yeTogVmlld0J1aWxkZXJGYWN0b3J5KSB7XG4gICAgLy8gVE9ETyh0Ym9zY2gpOiBUaGUgb2xkIHZpZXcgY29tcGlsZXIgdXNlZCB0byB1c2UgYW4gYGFueWAgdHlwZVxuICAgIC8vIGZvciB0aGUgY29udGV4dCBpbiBhbnkgZW1iZWRkZWQgdmlldy4gV2Uga2VlcCB0aGlzIGJlaGFpdm9yIGZvciBub3dcbiAgICAvLyB0byBiZSBhYmxlIHRvIGludHJvZHVjZSB0aGUgbmV3IHZpZXcgY29tcGlsZXIgd2l0aG91dCB0b28gbWFueSBlcnJvcnMuXG4gICAgdGhpcy5jb21wVHlwZSA9IHRoaXMuZW1iZWRkZWRWaWV3SW5kZXggPiAwID9cbiAgICAgICAgby5EWU5BTUlDX1RZUEUgOlxuICAgICAgICBvLmV4cHJlc3Npb25UeXBlKG91dHB1dEN0eC5pbXBvcnRFeHByKHRoaXMuY29tcG9uZW50LnR5cGUucmVmZXJlbmNlKSkhO1xuICAgIHRoaXMudmlld05hbWUgPSB2aWV3Q2xhc3NOYW1lKHRoaXMuY29tcG9uZW50LnR5cGUucmVmZXJlbmNlLCB0aGlzLmVtYmVkZGVkVmlld0luZGV4KTtcbiAgfVxuXG4gIHZpc2l0QWxsKHZhcmlhYmxlczogVmFyaWFibGVBc3RbXSwgYXN0Tm9kZXM6IFRlbXBsYXRlQXN0W10pIHtcbiAgICB0aGlzLnZhcmlhYmxlcyA9IHZhcmlhYmxlcztcbiAgICAvLyBjcmVhdGUgdGhlIHBpcGVzIGZvciB0aGUgcHVyZSBwaXBlcyBpbW1lZGlhdGVseSwgc28gdGhhdCB3ZSBrbm93IHRoZWlyIGluZGljZXMuXG4gICAgaWYgKCF0aGlzLnBhcmVudCkge1xuICAgICAgdGhpcy51c2VkUGlwZXMuZm9yRWFjaCgocGlwZSkgPT4ge1xuICAgICAgICBpZiAocGlwZS5wdXJlKSB7XG4gICAgICAgICAgdGhpcy5wdXJlUGlwZU5vZGVJbmRpY2VzW3BpcGUubmFtZV0gPSB0aGlzLl9jcmVhdGVQaXBlKG51bGwsIHBpcGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGFyZW50KSB7XG4gICAgICB0aGlzLmNvbXBvbmVudC52aWV3UXVlcmllcy5mb3JFYWNoKChxdWVyeSwgcXVlcnlJbmRleCkgPT4ge1xuICAgICAgICAvLyBOb3RlOiBxdWVyaWVzIHN0YXJ0IHdpdGggaWQgMSBzbyB3ZSBjYW4gdXNlIHRoZSBudW1iZXIgaW4gYSBCbG9vbSBmaWx0ZXIhXG4gICAgICAgIGNvbnN0IHF1ZXJ5SWQgPSBxdWVyeUluZGV4ICsgMTtcbiAgICAgICAgY29uc3QgYmluZGluZ1R5cGUgPSBxdWVyeS5maXJzdCA/IFF1ZXJ5QmluZGluZ1R5cGUuRmlyc3QgOiBRdWVyeUJpbmRpbmdUeXBlLkFsbDtcbiAgICAgICAgY29uc3QgZmxhZ3MgPSBOb2RlRmxhZ3MuVHlwZVZpZXdRdWVyeSB8IGNhbGNRdWVyeUZsYWdzKHF1ZXJ5KTtcbiAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKCgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVNwYW46IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVGbGFnczogZmxhZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5xdWVyeURlZikuY2FsbEZuKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmxpdGVyYWwoZmxhZ3MpLCBvLmxpdGVyYWwocXVlcnlJZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IG8uTGl0ZXJhbE1hcEV4cHIoW25ldyBvLkxpdGVyYWxNYXBFbnRyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkucHJvcGVydHlOYW1lLCBvLmxpdGVyYWwoYmluZGluZ1R5cGUpLCBmYWxzZSldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0Tm9kZXMpO1xuICAgIGlmICh0aGlzLnBhcmVudCAmJiAoYXN0Tm9kZXMubGVuZ3RoID09PSAwIHx8IG5lZWRzQWRkaXRpb25hbFJvb3ROb2RlKGFzdE5vZGVzKSkpIHtcbiAgICAgIC8vIGlmIHRoZSB2aWV3IGlzIGFuIGVtYmVkZGVkIHZpZXcsIHRoZW4gd2UgbmVlZCB0byBhZGQgYW4gYWRkaXRpb25hbCByb290IG5vZGUgaW4gc29tZSBjYXNlc1xuICAgICAgdGhpcy5ub2Rlcy5wdXNoKCgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VTcGFuOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUZsYWdzOiBOb2RlRmxhZ3MuVHlwZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlRGVmOiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuYW5jaG9yRGVmKS5jYWxsRm4oW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBvLmxpdGVyYWwoTm9kZUZsYWdzLk5vbmUpLCBvLk5VTExfRVhQUiwgby5OVUxMX0VYUFIsIG8ubGl0ZXJhbCgwKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgYnVpbGQodGFyZ2V0U3RhdGVtZW50czogby5TdGF0ZW1lbnRbXSA9IFtdKTogby5TdGF0ZW1lbnRbXSB7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4gY2hpbGQuYnVpbGQodGFyZ2V0U3RhdGVtZW50cykpO1xuXG4gICAgY29uc3Qge3VwZGF0ZVJlbmRlcmVyU3RtdHMsIHVwZGF0ZURpcmVjdGl2ZXNTdG10cywgbm9kZURlZkV4cHJzfSA9XG4gICAgICAgIHRoaXMuX2NyZWF0ZU5vZGVFeHByZXNzaW9ucygpO1xuXG4gICAgY29uc3QgdXBkYXRlUmVuZGVyZXJGbiA9IHRoaXMuX2NyZWF0ZVVwZGF0ZUZuKHVwZGF0ZVJlbmRlcmVyU3RtdHMpO1xuICAgIGNvbnN0IHVwZGF0ZURpcmVjdGl2ZXNGbiA9IHRoaXMuX2NyZWF0ZVVwZGF0ZUZuKHVwZGF0ZURpcmVjdGl2ZXNTdG10cyk7XG5cblxuICAgIGxldCB2aWV3RmxhZ3MgPSBWaWV3RmxhZ3MuTm9uZTtcbiAgICBpZiAoIXRoaXMucGFyZW50ICYmIHRoaXMuY29tcG9uZW50LmNoYW5nZURldGVjdGlvbiA9PT0gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoKSB7XG4gICAgICB2aWV3RmxhZ3MgfD0gVmlld0ZsYWdzLk9uUHVzaDtcbiAgICB9XG4gICAgY29uc3Qgdmlld0ZhY3RvcnkgPSBuZXcgby5EZWNsYXJlRnVuY3Rpb25TdG10KFxuICAgICAgICB0aGlzLnZpZXdOYW1lLCBbbmV3IG8uRm5QYXJhbShMT0dfVkFSLm5hbWUhKV0sXG4gICAgICAgIFtuZXcgby5SZXR1cm5TdGF0ZW1lbnQoby5pbXBvcnRFeHByKElkZW50aWZpZXJzLnZpZXdEZWYpLmNhbGxGbihbXG4gICAgICAgICAgby5saXRlcmFsKHZpZXdGbGFncyksXG4gICAgICAgICAgby5saXRlcmFsQXJyKG5vZGVEZWZFeHBycyksXG4gICAgICAgICAgdXBkYXRlRGlyZWN0aXZlc0ZuLFxuICAgICAgICAgIHVwZGF0ZVJlbmRlcmVyRm4sXG4gICAgICAgIF0pKV0sXG4gICAgICAgIG8uaW1wb3J0VHlwZShJZGVudGlmaWVycy5WaWV3RGVmaW5pdGlvbiksXG4gICAgICAgIHRoaXMuZW1iZWRkZWRWaWV3SW5kZXggPT09IDAgPyBbby5TdG10TW9kaWZpZXIuRXhwb3J0ZWRdIDogW10pO1xuXG4gICAgdGFyZ2V0U3RhdGVtZW50cy5wdXNoKHZpZXdGYWN0b3J5KTtcbiAgICByZXR1cm4gdGFyZ2V0U3RhdGVtZW50cztcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVVwZGF0ZUZuKHVwZGF0ZVN0bXRzOiBvLlN0YXRlbWVudFtdKTogby5FeHByZXNzaW9uIHtcbiAgICBsZXQgdXBkYXRlRm46IG8uRXhwcmVzc2lvbjtcbiAgICBpZiAodXBkYXRlU3RtdHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcHJlU3RtdHM6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgICAgIGlmICghdGhpcy5jb21wb25lbnQuaXNIb3N0ICYmIG8uZmluZFJlYWRWYXJOYW1lcyh1cGRhdGVTdG10cykuaGFzKENPTVBfVkFSLm5hbWUhKSkge1xuICAgICAgICBwcmVTdG10cy5wdXNoKENPTVBfVkFSLnNldChWSUVXX1ZBUi5wcm9wKCdjb21wb25lbnQnKSkudG9EZWNsU3RtdCh0aGlzLmNvbXBUeXBlKSk7XG4gICAgICB9XG4gICAgICB1cGRhdGVGbiA9IG8uZm4oXG4gICAgICAgICAgW1xuICAgICAgICAgICAgbmV3IG8uRm5QYXJhbShDSEVDS19WQVIubmFtZSEsIG8uSU5GRVJSRURfVFlQRSksXG4gICAgICAgICAgICBuZXcgby5GblBhcmFtKFZJRVdfVkFSLm5hbWUhLCBvLklORkVSUkVEX1RZUEUpXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbLi4ucHJlU3RtdHMsIC4uLnVwZGF0ZVN0bXRzXSwgby5JTkZFUlJFRF9UWVBFKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlRm4gPSBvLk5VTExfRVhQUjtcbiAgICB9XG4gICAgcmV0dXJuIHVwZGF0ZUZuO1xuICB9XG5cbiAgdmlzaXROZ0NvbnRlbnQoYXN0OiBOZ0NvbnRlbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgLy8gbmdDb250ZW50RGVmKG5nQ29udGVudEluZGV4OiBudW1iZXIsIGluZGV4OiBudW1iZXIpOiBOb2RlRGVmO1xuICAgIHRoaXMubm9kZXMucHVzaCgoKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVNwYW46IGFzdC5zb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVOZ0NvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgbm9kZURlZjogby5pbXBvcnRFeHByKElkZW50aWZpZXJzLm5nQ29udGVudERlZilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhbGxGbihbby5saXRlcmFsKGFzdC5uZ0NvbnRlbnRJbmRleCksIG8ubGl0ZXJhbChhc3QuaW5kZXgpXSlcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICB9XG5cbiAgdmlzaXRUZXh0KGFzdDogVGV4dEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICAvLyBTdGF0aWMgdGV4dCBub2RlcyBoYXZlIG5vIGNoZWNrIGZ1bmN0aW9uXG4gICAgY29uc3QgY2hlY2tJbmRleCA9IC0xO1xuICAgIHRoaXMubm9kZXMucHVzaCgoKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVNwYW46IGFzdC5zb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy50ZXh0RGVmKS5jYWxsRm4oW1xuICAgICAgICAgICAgICAgICAgICAgICAgby5saXRlcmFsKGNoZWNrSW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgby5saXRlcmFsKGFzdC5uZ0NvbnRlbnRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgICAgICBvLmxpdGVyYWxBcnIoW28ubGl0ZXJhbChhc3QudmFsdWUpXSksXG4gICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICB9XG5cbiAgdmlzaXRCb3VuZFRleHQoYXN0OiBCb3VuZFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgY29uc3Qgbm9kZUluZGV4ID0gdGhpcy5ub2Rlcy5sZW5ndGg7XG4gICAgLy8gcmVzZXJ2ZSB0aGUgc3BhY2UgaW4gdGhlIG5vZGVEZWZzIGFycmF5XG4gICAgdGhpcy5ub2Rlcy5wdXNoKG51bGwhKTtcblxuICAgIGNvbnN0IGFzdFdpdGhTb3VyY2UgPSA8QVNUV2l0aFNvdXJjZT5hc3QudmFsdWU7XG4gICAgY29uc3QgaW50ZXIgPSA8SW50ZXJwb2xhdGlvbj5hc3RXaXRoU291cmNlLmFzdDtcblxuICAgIGNvbnN0IHVwZGF0ZVJlbmRlcmVyRXhwcmVzc2lvbnMgPSBpbnRlci5leHByZXNzaW9ucy5tYXAoXG4gICAgICAgIChleHByLCBiaW5kaW5nSW5kZXgpID0+IHRoaXMuX3ByZXByb2Nlc3NVcGRhdGVFeHByZXNzaW9uKFxuICAgICAgICAgICAge25vZGVJbmRleCwgYmluZGluZ0luZGV4LCBzb3VyY2VTcGFuOiBhc3Quc291cmNlU3BhbiwgY29udGV4dDogQ09NUF9WQVIsIHZhbHVlOiBleHByfSkpO1xuXG4gICAgLy8gQ2hlY2sgaW5kZXggaXMgdGhlIHNhbWUgYXMgdGhlIG5vZGUgaW5kZXggZHVyaW5nIGNvbXBpbGF0aW9uXG4gICAgLy8gVGhleSBtaWdodCBvbmx5IGRpZmZlciBhdCBydW50aW1lXG4gICAgY29uc3QgY2hlY2tJbmRleCA9IG5vZGVJbmRleDtcblxuICAgIHRoaXMubm9kZXNbbm9kZUluZGV4XSA9ICgpID0+ICh7XG4gICAgICBzb3VyY2VTcGFuOiBhc3Quc291cmNlU3BhbixcbiAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVUZXh0LFxuICAgICAgbm9kZURlZjogby5pbXBvcnRFeHByKElkZW50aWZpZXJzLnRleHREZWYpLmNhbGxGbihbXG4gICAgICAgIG8ubGl0ZXJhbChjaGVja0luZGV4KSxcbiAgICAgICAgby5saXRlcmFsKGFzdC5uZ0NvbnRlbnRJbmRleCksXG4gICAgICAgIG8ubGl0ZXJhbEFycihpbnRlci5zdHJpbmdzLm1hcChzID0+IG8ubGl0ZXJhbChzKSkpLFxuICAgICAgXSksXG4gICAgICB1cGRhdGVSZW5kZXJlcjogdXBkYXRlUmVuZGVyZXJFeHByZXNzaW9uc1xuICAgIH0pO1xuICB9XG5cbiAgdmlzaXRFbWJlZGRlZFRlbXBsYXRlKGFzdDogRW1iZWRkZWRUZW1wbGF0ZUFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBjb25zdCBub2RlSW5kZXggPSB0aGlzLm5vZGVzLmxlbmd0aDtcbiAgICAvLyByZXNlcnZlIHRoZSBzcGFjZSBpbiB0aGUgbm9kZURlZnMgYXJyYXlcbiAgICB0aGlzLm5vZGVzLnB1c2gobnVsbCEpO1xuXG4gICAgY29uc3Qge2ZsYWdzLCBxdWVyeU1hdGNoZXNFeHByLCBob3N0RXZlbnRzfSA9IHRoaXMuX3Zpc2l0RWxlbWVudE9yVGVtcGxhdGUobm9kZUluZGV4LCBhc3QpO1xuXG4gICAgY29uc3QgY2hpbGRWaXNpdG9yID0gdGhpcy52aWV3QnVpbGRlckZhY3RvcnkodGhpcyk7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkVmlzaXRvcik7XG4gICAgY2hpbGRWaXNpdG9yLnZpc2l0QWxsKGFzdC52YXJpYWJsZXMsIGFzdC5jaGlsZHJlbik7XG5cbiAgICBjb25zdCBjaGlsZENvdW50ID0gdGhpcy5ub2Rlcy5sZW5ndGggLSBub2RlSW5kZXggLSAxO1xuXG4gICAgLy8gYW5jaG9yRGVmKFxuICAgIC8vICAgZmxhZ3M6IE5vZGVGbGFncywgbWF0Y2hlZFF1ZXJpZXM6IFtzdHJpbmcsIFF1ZXJ5VmFsdWVUeXBlXVtdLCBuZ0NvbnRlbnRJbmRleDogbnVtYmVyLFxuICAgIC8vICAgY2hpbGRDb3VudDogbnVtYmVyLCBoYW5kbGVFdmVudEZuPzogRWxlbWVudEhhbmRsZUV2ZW50Rm4sIHRlbXBsYXRlRmFjdG9yeT86XG4gICAgLy8gICBWaWV3RGVmaW5pdGlvbkZhY3RvcnkpOiBOb2RlRGVmO1xuICAgIHRoaXMubm9kZXNbbm9kZUluZGV4XSA9ICgpID0+ICh7XG4gICAgICBzb3VyY2VTcGFuOiBhc3Quc291cmNlU3BhbixcbiAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVFbGVtZW50IHwgZmxhZ3MsXG4gICAgICBub2RlRGVmOiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuYW5jaG9yRGVmKS5jYWxsRm4oW1xuICAgICAgICBvLmxpdGVyYWwoZmxhZ3MpLFxuICAgICAgICBxdWVyeU1hdGNoZXNFeHByLFxuICAgICAgICBvLmxpdGVyYWwoYXN0Lm5nQ29udGVudEluZGV4KSxcbiAgICAgICAgby5saXRlcmFsKGNoaWxkQ291bnQpLFxuICAgICAgICB0aGlzLl9jcmVhdGVFbGVtZW50SGFuZGxlRXZlbnRGbihub2RlSW5kZXgsIGhvc3RFdmVudHMpLFxuICAgICAgICBvLnZhcmlhYmxlKGNoaWxkVmlzaXRvci52aWV3TmFtZSksXG4gICAgICBdKVxuICAgIH0pO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGFzdDogRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBjb25zdCBub2RlSW5kZXggPSB0aGlzLm5vZGVzLmxlbmd0aDtcbiAgICAvLyByZXNlcnZlIHRoZSBzcGFjZSBpbiB0aGUgbm9kZURlZnMgYXJyYXkgc28gd2UgY2FuIGFkZCBjaGlsZHJlblxuICAgIHRoaXMubm9kZXMucHVzaChudWxsISk7XG5cbiAgICAvLyBVc2luZyBhIG51bGwgZWxlbWVudCBuYW1lIGNyZWF0ZXMgYW4gYW5jaG9yLlxuICAgIGNvbnN0IGVsTmFtZTogc3RyaW5nfG51bGwgPSBpc05nQ29udGFpbmVyKGFzdC5uYW1lKSA/IG51bGwgOiBhc3QubmFtZTtcblxuICAgIGNvbnN0IHtmbGFncywgdXNlZEV2ZW50cywgcXVlcnlNYXRjaGVzRXhwciwgaG9zdEJpbmRpbmdzOiBkaXJIb3N0QmluZGluZ3MsIGhvc3RFdmVudHN9ID1cbiAgICAgICAgdGhpcy5fdmlzaXRFbGVtZW50T3JUZW1wbGF0ZShub2RlSW5kZXgsIGFzdCk7XG5cbiAgICBsZXQgaW5wdXREZWZzOiBvLkV4cHJlc3Npb25bXSA9IFtdO1xuICAgIGxldCB1cGRhdGVSZW5kZXJlckV4cHJlc3Npb25zOiBVcGRhdGVFeHByZXNzaW9uW10gPSBbXTtcbiAgICBsZXQgb3V0cHV0RGVmczogby5FeHByZXNzaW9uW10gPSBbXTtcbiAgICBpZiAoZWxOYW1lKSB7XG4gICAgICBjb25zdCBob3N0QmluZGluZ3M6IGFueVtdID0gYXN0LmlucHV0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChpbnB1dEFzdCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IENPTVBfVkFSIGFzIG8uRXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0QXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyQXN0OiBudWxsIGFzIGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChkaXJIb3N0QmluZGluZ3MpO1xuICAgICAgaWYgKGhvc3RCaW5kaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgdXBkYXRlUmVuZGVyZXJFeHByZXNzaW9ucyA9XG4gICAgICAgICAgICBob3N0QmluZGluZ3MubWFwKChob3N0QmluZGluZywgYmluZGluZ0luZGV4KSA9PiB0aGlzLl9wcmVwcm9jZXNzVXBkYXRlRXhwcmVzc2lvbih7XG4gICAgICAgICAgICAgIGNvbnRleHQ6IGhvc3RCaW5kaW5nLmNvbnRleHQsXG4gICAgICAgICAgICAgIG5vZGVJbmRleCxcbiAgICAgICAgICAgICAgYmluZGluZ0luZGV4LFxuICAgICAgICAgICAgICBzb3VyY2VTcGFuOiBob3N0QmluZGluZy5pbnB1dEFzdC5zb3VyY2VTcGFuLFxuICAgICAgICAgICAgICB2YWx1ZTogaG9zdEJpbmRpbmcuaW5wdXRBc3QudmFsdWVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgaW5wdXREZWZzID0gaG9zdEJpbmRpbmdzLm1hcChcbiAgICAgICAgICAgIGhvc3RCaW5kaW5nID0+IGVsZW1lbnRCaW5kaW5nRGVmKGhvc3RCaW5kaW5nLmlucHV0QXN0LCBob3N0QmluZGluZy5kaXJBc3QpKTtcbiAgICAgIH1cbiAgICAgIG91dHB1dERlZnMgPSB1c2VkRXZlbnRzLm1hcChcbiAgICAgICAgICAoW3RhcmdldCwgZXZlbnROYW1lXSkgPT4gby5saXRlcmFsQXJyKFtvLmxpdGVyYWwodGFyZ2V0KSwgby5saXRlcmFsKGV2ZW50TmFtZSldKSk7XG4gICAgfVxuXG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4pO1xuXG4gICAgY29uc3QgY2hpbGRDb3VudCA9IHRoaXMubm9kZXMubGVuZ3RoIC0gbm9kZUluZGV4IC0gMTtcblxuICAgIGNvbnN0IGNvbXBBc3QgPSBhc3QuZGlyZWN0aXZlcy5maW5kKGRpckFzdCA9PiBkaXJBc3QuZGlyZWN0aXZlLmlzQ29tcG9uZW50KTtcbiAgICBsZXQgY29tcFJlbmRlcmVyVHlwZSA9IG8uTlVMTF9FWFBSIGFzIG8uRXhwcmVzc2lvbjtcbiAgICBsZXQgY29tcFZpZXcgPSBvLk5VTExfRVhQUiBhcyBvLkV4cHJlc3Npb247XG4gICAgaWYgKGNvbXBBc3QpIHtcbiAgICAgIGNvbXBWaWV3ID0gdGhpcy5vdXRwdXRDdHguaW1wb3J0RXhwcihjb21wQXN0LmRpcmVjdGl2ZS5jb21wb25lbnRWaWV3VHlwZSk7XG4gICAgICBjb21wUmVuZGVyZXJUeXBlID0gdGhpcy5vdXRwdXRDdHguaW1wb3J0RXhwcihjb21wQXN0LmRpcmVjdGl2ZS5yZW5kZXJlclR5cGUpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGluZGV4IGlzIHRoZSBzYW1lIGFzIHRoZSBub2RlIGluZGV4IGR1cmluZyBjb21waWxhdGlvblxuICAgIC8vIFRoZXkgbWlnaHQgb25seSBkaWZmZXIgYXQgcnVudGltZVxuICAgIGNvbnN0IGNoZWNrSW5kZXggPSBub2RlSW5kZXg7XG5cbiAgICB0aGlzLm5vZGVzW25vZGVJbmRleF0gPSAoKSA9PiAoe1xuICAgICAgc291cmNlU3BhbjogYXN0LnNvdXJjZVNwYW4sXG4gICAgICBub2RlRmxhZ3M6IE5vZGVGbGFncy5UeXBlRWxlbWVudCB8IGZsYWdzLFxuICAgICAgbm9kZURlZjogby5pbXBvcnRFeHByKElkZW50aWZpZXJzLmVsZW1lbnREZWYpLmNhbGxGbihbXG4gICAgICAgIG8ubGl0ZXJhbChjaGVja0luZGV4KSxcbiAgICAgICAgby5saXRlcmFsKGZsYWdzKSxcbiAgICAgICAgcXVlcnlNYXRjaGVzRXhwcixcbiAgICAgICAgby5saXRlcmFsKGFzdC5uZ0NvbnRlbnRJbmRleCksXG4gICAgICAgIG8ubGl0ZXJhbChjaGlsZENvdW50KSxcbiAgICAgICAgby5saXRlcmFsKGVsTmFtZSksXG4gICAgICAgIGVsTmFtZSA/IGZpeGVkQXR0cnNEZWYoYXN0KSA6IG8uTlVMTF9FWFBSLFxuICAgICAgICBpbnB1dERlZnMubGVuZ3RoID8gby5saXRlcmFsQXJyKGlucHV0RGVmcykgOiBvLk5VTExfRVhQUixcbiAgICAgICAgb3V0cHV0RGVmcy5sZW5ndGggPyBvLmxpdGVyYWxBcnIob3V0cHV0RGVmcykgOiBvLk5VTExfRVhQUixcbiAgICAgICAgdGhpcy5fY3JlYXRlRWxlbWVudEhhbmRsZUV2ZW50Rm4obm9kZUluZGV4LCBob3N0RXZlbnRzKSxcbiAgICAgICAgY29tcFZpZXcsXG4gICAgICAgIGNvbXBSZW5kZXJlclR5cGUsXG4gICAgICBdKSxcbiAgICAgIHVwZGF0ZVJlbmRlcmVyOiB1cGRhdGVSZW5kZXJlckV4cHJlc3Npb25zXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF92aXNpdEVsZW1lbnRPclRlbXBsYXRlKG5vZGVJbmRleDogbnVtYmVyLCBhc3Q6IHtcbiAgICBoYXNWaWV3Q29udGFpbmVyOiBib29sZWFuLFxuICAgIG91dHB1dHM6IEJvdW5kRXZlbnRBc3RbXSxcbiAgICBkaXJlY3RpdmVzOiBEaXJlY3RpdmVBc3RbXSxcbiAgICBwcm92aWRlcnM6IFByb3ZpZGVyQXN0W10sXG4gICAgcmVmZXJlbmNlczogUmVmZXJlbmNlQXN0W10sXG4gICAgcXVlcnlNYXRjaGVzOiBRdWVyeU1hdGNoW11cbiAgfSk6IHtcbiAgICBmbGFnczogTm9kZUZsYWdzLFxuICAgIHVzZWRFdmVudHM6IFtzdHJpbmd8bnVsbCwgc3RyaW5nXVtdLFxuICAgIHF1ZXJ5TWF0Y2hlc0V4cHI6IG8uRXhwcmVzc2lvbixcbiAgICBob3N0QmluZGluZ3M6XG4gICAgICAgIHtjb250ZXh0OiBvLkV4cHJlc3Npb24sIGlucHV0QXN0OiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCwgZGlyQXN0OiBEaXJlY3RpdmVBc3R9W10sXG4gICAgaG9zdEV2ZW50czoge2NvbnRleHQ6IG8uRXhwcmVzc2lvbiwgZXZlbnRBc3Q6IEJvdW5kRXZlbnRBc3QsIGRpckFzdDogRGlyZWN0aXZlQXN0fVtdLFxuICB9IHtcbiAgICBsZXQgZmxhZ3MgPSBOb2RlRmxhZ3MuTm9uZTtcbiAgICBpZiAoYXN0Lmhhc1ZpZXdDb250YWluZXIpIHtcbiAgICAgIGZsYWdzIHw9IE5vZGVGbGFncy5FbWJlZGRlZFZpZXdzO1xuICAgIH1cbiAgICBjb25zdCB1c2VkRXZlbnRzID0gbmV3IE1hcDxzdHJpbmcsIFtzdHJpbmcgfCBudWxsLCBzdHJpbmddPigpO1xuICAgIGFzdC5vdXRwdXRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCB7bmFtZSwgdGFyZ2V0fSA9IGVsZW1lbnRFdmVudE5hbWVBbmRUYXJnZXQoZXZlbnQsIG51bGwpO1xuICAgICAgdXNlZEV2ZW50cy5zZXQoZWxlbWVudEV2ZW50RnVsbE5hbWUodGFyZ2V0LCBuYW1lKSwgW3RhcmdldCwgbmFtZV0pO1xuICAgIH0pO1xuICAgIGFzdC5kaXJlY3RpdmVzLmZvckVhY2goKGRpckFzdCkgPT4ge1xuICAgICAgZGlyQXN0Lmhvc3RFdmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3Qge25hbWUsIHRhcmdldH0gPSBlbGVtZW50RXZlbnROYW1lQW5kVGFyZ2V0KGV2ZW50LCBkaXJBc3QpO1xuICAgICAgICB1c2VkRXZlbnRzLnNldChlbGVtZW50RXZlbnRGdWxsTmFtZSh0YXJnZXQsIG5hbWUpLCBbdGFyZ2V0LCBuYW1lXSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb25zdCBob3N0QmluZGluZ3M6XG4gICAgICAgIHtjb250ZXh0OiBvLkV4cHJlc3Npb24sIGlucHV0QXN0OiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCwgZGlyQXN0OiBEaXJlY3RpdmVBc3R9W10gPSBbXTtcbiAgICBjb25zdCBob3N0RXZlbnRzOiB7Y29udGV4dDogby5FeHByZXNzaW9uLCBldmVudEFzdDogQm91bmRFdmVudEFzdCwgZGlyQXN0OiBEaXJlY3RpdmVBc3R9W10gPSBbXTtcbiAgICB0aGlzLl92aXNpdENvbXBvbmVudEZhY3RvcnlSZXNvbHZlclByb3ZpZGVyKGFzdC5kaXJlY3RpdmVzKTtcblxuICAgIGFzdC5wcm92aWRlcnMuZm9yRWFjaChwcm92aWRlckFzdCA9PiB7XG4gICAgICBsZXQgZGlyQXN0OiBEaXJlY3RpdmVBc3QgPSB1bmRlZmluZWQhO1xuICAgICAgYXN0LmRpcmVjdGl2ZXMuZm9yRWFjaChsb2NhbERpckFzdCA9PiB7XG4gICAgICAgIGlmIChsb2NhbERpckFzdC5kaXJlY3RpdmUudHlwZS5yZWZlcmVuY2UgPT09IHRva2VuUmVmZXJlbmNlKHByb3ZpZGVyQXN0LnRva2VuKSkge1xuICAgICAgICAgIGRpckFzdCA9IGxvY2FsRGlyQXN0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChkaXJBc3QpIHtcbiAgICAgICAgY29uc3Qge2hvc3RCaW5kaW5nczogZGlySG9zdEJpbmRpbmdzLCBob3N0RXZlbnRzOiBkaXJIb3N0RXZlbnRzfSA9XG4gICAgICAgICAgICB0aGlzLl92aXNpdERpcmVjdGl2ZShwcm92aWRlckFzdCwgZGlyQXN0LCBhc3QucmVmZXJlbmNlcywgYXN0LnF1ZXJ5TWF0Y2hlcywgdXNlZEV2ZW50cyk7XG4gICAgICAgIGhvc3RCaW5kaW5ncy5wdXNoKC4uLmRpckhvc3RCaW5kaW5ncyk7XG4gICAgICAgIGhvc3RFdmVudHMucHVzaCguLi5kaXJIb3N0RXZlbnRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Zpc2l0UHJvdmlkZXIocHJvdmlkZXJBc3QsIGFzdC5xdWVyeU1hdGNoZXMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHF1ZXJ5TWF0Y2hFeHByczogby5FeHByZXNzaW9uW10gPSBbXTtcbiAgICBhc3QucXVlcnlNYXRjaGVzLmZvckVhY2goKG1hdGNoKSA9PiB7XG4gICAgICBsZXQgdmFsdWVUeXBlOiBRdWVyeVZhbHVlVHlwZSA9IHVuZGVmaW5lZCE7XG4gICAgICBpZiAodG9rZW5SZWZlcmVuY2UobWF0Y2gudmFsdWUpID09PVxuICAgICAgICAgIHRoaXMucmVmbGVjdG9yLnJlc29sdmVFeHRlcm5hbFJlZmVyZW5jZShJZGVudGlmaWVycy5FbGVtZW50UmVmKSkge1xuICAgICAgICB2YWx1ZVR5cGUgPSBRdWVyeVZhbHVlVHlwZS5FbGVtZW50UmVmO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICB0b2tlblJlZmVyZW5jZShtYXRjaC52YWx1ZSkgPT09XG4gICAgICAgICAgdGhpcy5yZWZsZWN0b3IucmVzb2x2ZUV4dGVybmFsUmVmZXJlbmNlKElkZW50aWZpZXJzLlZpZXdDb250YWluZXJSZWYpKSB7XG4gICAgICAgIHZhbHVlVHlwZSA9IFF1ZXJ5VmFsdWVUeXBlLlZpZXdDb250YWluZXJSZWY7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHRva2VuUmVmZXJlbmNlKG1hdGNoLnZhbHVlKSA9PT1cbiAgICAgICAgICB0aGlzLnJlZmxlY3Rvci5yZXNvbHZlRXh0ZXJuYWxSZWZlcmVuY2UoSWRlbnRpZmllcnMuVGVtcGxhdGVSZWYpKSB7XG4gICAgICAgIHZhbHVlVHlwZSA9IFF1ZXJ5VmFsdWVUeXBlLlRlbXBsYXRlUmVmO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlVHlwZSAhPSBudWxsKSB7XG4gICAgICAgIHF1ZXJ5TWF0Y2hFeHBycy5wdXNoKG8ubGl0ZXJhbEFycihbby5saXRlcmFsKG1hdGNoLnF1ZXJ5SWQpLCBvLmxpdGVyYWwodmFsdWVUeXBlKV0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBhc3QucmVmZXJlbmNlcy5mb3JFYWNoKChyZWYpID0+IHtcbiAgICAgIGxldCB2YWx1ZVR5cGU6IFF1ZXJ5VmFsdWVUeXBlID0gdW5kZWZpbmVkITtcbiAgICAgIGlmICghcmVmLnZhbHVlKSB7XG4gICAgICAgIHZhbHVlVHlwZSA9IFF1ZXJ5VmFsdWVUeXBlLlJlbmRlckVsZW1lbnQ7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHRva2VuUmVmZXJlbmNlKHJlZi52YWx1ZSkgPT09XG4gICAgICAgICAgdGhpcy5yZWZsZWN0b3IucmVzb2x2ZUV4dGVybmFsUmVmZXJlbmNlKElkZW50aWZpZXJzLlRlbXBsYXRlUmVmKSkge1xuICAgICAgICB2YWx1ZVR5cGUgPSBRdWVyeVZhbHVlVHlwZS5UZW1wbGF0ZVJlZjtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZVR5cGUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlZk5vZGVJbmRpY2VzW3JlZi5uYW1lXSA9IG5vZGVJbmRleDtcbiAgICAgICAgcXVlcnlNYXRjaEV4cHJzLnB1c2goby5saXRlcmFsQXJyKFtvLmxpdGVyYWwocmVmLm5hbWUpLCBvLmxpdGVyYWwodmFsdWVUeXBlKV0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBhc3Qub3V0cHV0cy5mb3JFYWNoKChvdXRwdXRBc3QpID0+IHtcbiAgICAgIGhvc3RFdmVudHMucHVzaCh7Y29udGV4dDogQ09NUF9WQVIsIGV2ZW50QXN0OiBvdXRwdXRBc3QsIGRpckFzdDogbnVsbCF9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICBmbGFncyxcbiAgICAgIHVzZWRFdmVudHM6IEFycmF5LmZyb20odXNlZEV2ZW50cy52YWx1ZXMoKSksXG4gICAgICBxdWVyeU1hdGNoZXNFeHByOiBxdWVyeU1hdGNoRXhwcnMubGVuZ3RoID8gby5saXRlcmFsQXJyKHF1ZXJ5TWF0Y2hFeHBycykgOiBvLk5VTExfRVhQUixcbiAgICAgIGhvc3RCaW5kaW5ncyxcbiAgICAgIGhvc3RFdmVudHM6IGhvc3RFdmVudHNcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXREaXJlY3RpdmUoXG4gICAgICBwcm92aWRlckFzdDogUHJvdmlkZXJBc3QsIGRpckFzdDogRGlyZWN0aXZlQXN0LCByZWZzOiBSZWZlcmVuY2VBc3RbXSxcbiAgICAgIHF1ZXJ5TWF0Y2hlczogUXVlcnlNYXRjaFtdLCB1c2VkRXZlbnRzOiBNYXA8c3RyaW5nLCBhbnk+KToge1xuICAgIGhvc3RCaW5kaW5nczpcbiAgICAgICAge2NvbnRleHQ6IG8uRXhwcmVzc2lvbiwgaW5wdXRBc3Q6IEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LCBkaXJBc3Q6IERpcmVjdGl2ZUFzdH1bXSxcbiAgICBob3N0RXZlbnRzOiB7Y29udGV4dDogby5FeHByZXNzaW9uLCBldmVudEFzdDogQm91bmRFdmVudEFzdCwgZGlyQXN0OiBEaXJlY3RpdmVBc3R9W11cbiAgfSB7XG4gICAgY29uc3Qgbm9kZUluZGV4ID0gdGhpcy5ub2Rlcy5sZW5ndGg7XG4gICAgLy8gcmVzZXJ2ZSB0aGUgc3BhY2UgaW4gdGhlIG5vZGVEZWZzIGFycmF5IHNvIHdlIGNhbiBhZGQgY2hpbGRyZW5cbiAgICB0aGlzLm5vZGVzLnB1c2gobnVsbCEpO1xuXG4gICAgZGlyQXN0LmRpcmVjdGl2ZS5xdWVyaWVzLmZvckVhY2goKHF1ZXJ5LCBxdWVyeUluZGV4KSA9PiB7XG4gICAgICBjb25zdCBxdWVyeUlkID0gZGlyQXN0LmNvbnRlbnRRdWVyeVN0YXJ0SWQgKyBxdWVyeUluZGV4O1xuICAgICAgY29uc3QgZmxhZ3MgPSBOb2RlRmxhZ3MuVHlwZUNvbnRlbnRRdWVyeSB8IGNhbGNRdWVyeUZsYWdzKHF1ZXJ5KTtcbiAgICAgIGNvbnN0IGJpbmRpbmdUeXBlID0gcXVlcnkuZmlyc3QgPyBRdWVyeUJpbmRpbmdUeXBlLkZpcnN0IDogUXVlcnlCaW5kaW5nVHlwZS5BbGw7XG4gICAgICB0aGlzLm5vZGVzLnB1c2goKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVNwYW46IGRpckFzdC5zb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUZsYWdzOiBmbGFncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5xdWVyeURlZikuY2FsbEZuKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgby5saXRlcmFsKGZsYWdzKSwgby5saXRlcmFsKHF1ZXJ5SWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgby5MaXRlcmFsTWFwRXhwcihbbmV3IG8uTGl0ZXJhbE1hcEVudHJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkucHJvcGVydHlOYW1lLCBvLmxpdGVyYWwoYmluZGluZ1R5cGUpLCBmYWxzZSldKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgLy8gTm90ZTogdGhlIG9wZXJhdGlvbiBiZWxvdyBtaWdodCBhbHNvIGNyZWF0ZSBuZXcgbm9kZURlZnMsXG4gICAgLy8gYnV0IHdlIGRvbid0IHdhbnQgdGhlbSB0byBiZSBhIGNoaWxkIG9mIGEgZGlyZWN0aXZlLFxuICAgIC8vIGFzIHRoZXkgbWlnaHQgYmUgYSBwcm92aWRlci9waXBlIG9uIHRoZWlyIG93bi5cbiAgICAvLyBJLmUuIHdlIG9ubHkgYWxsb3cgcXVlcmllcyBhcyBjaGlsZHJlbiBvZiBkaXJlY3RpdmVzIG5vZGVzLlxuICAgIGNvbnN0IGNoaWxkQ291bnQgPSB0aGlzLm5vZGVzLmxlbmd0aCAtIG5vZGVJbmRleCAtIDE7XG5cbiAgICBsZXQge2ZsYWdzLCBxdWVyeU1hdGNoRXhwcnMsIHByb3ZpZGVyRXhwciwgZGVwc0V4cHJ9ID1cbiAgICAgICAgdGhpcy5fdmlzaXRQcm92aWRlck9yRGlyZWN0aXZlKHByb3ZpZGVyQXN0LCBxdWVyeU1hdGNoZXMpO1xuXG4gICAgcmVmcy5mb3JFYWNoKChyZWYpID0+IHtcbiAgICAgIGlmIChyZWYudmFsdWUgJiYgdG9rZW5SZWZlcmVuY2UocmVmLnZhbHVlKSA9PT0gdG9rZW5SZWZlcmVuY2UocHJvdmlkZXJBc3QudG9rZW4pKSB7XG4gICAgICAgIHRoaXMucmVmTm9kZUluZGljZXNbcmVmLm5hbWVdID0gbm9kZUluZGV4O1xuICAgICAgICBxdWVyeU1hdGNoRXhwcnMucHVzaChcbiAgICAgICAgICAgIG8ubGl0ZXJhbEFycihbby5saXRlcmFsKHJlZi5uYW1lKSwgby5saXRlcmFsKFF1ZXJ5VmFsdWVUeXBlLlByb3ZpZGVyKV0pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChkaXJBc3QuZGlyZWN0aXZlLmlzQ29tcG9uZW50KSB7XG4gICAgICBmbGFncyB8PSBOb2RlRmxhZ3MuQ29tcG9uZW50O1xuICAgIH1cblxuICAgIGNvbnN0IGlucHV0RGVmcyA9IGRpckFzdC5pbnB1dHMubWFwKChpbnB1dEFzdCwgaW5wdXRJbmRleCkgPT4ge1xuICAgICAgY29uc3QgbWFwVmFsdWUgPSBvLmxpdGVyYWxBcnIoW28ubGl0ZXJhbChpbnB1dEluZGV4KSwgby5saXRlcmFsKGlucHV0QXN0LmRpcmVjdGl2ZU5hbWUpXSk7XG4gICAgICAvLyBOb3RlOiBpdCdzIGltcG9ydGFudCB0byBub3QgcXVvdGUgdGhlIGtleSBzbyB0aGF0IHdlIGNhbiBjYXB0dXJlIHJlbmFtZXMgYnkgbWluaWZpZXJzIVxuICAgICAgcmV0dXJuIG5ldyBvLkxpdGVyYWxNYXBFbnRyeShpbnB1dEFzdC5kaXJlY3RpdmVOYW1lLCBtYXBWYWx1ZSwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb3V0cHV0RGVmczogby5MaXRlcmFsTWFwRW50cnlbXSA9IFtdO1xuICAgIGNvbnN0IGRpck1ldGEgPSBkaXJBc3QuZGlyZWN0aXZlO1xuICAgIE9iamVjdC5rZXlzKGRpck1ldGEub3V0cHV0cykuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGRpck1ldGEub3V0cHV0c1twcm9wTmFtZV07XG4gICAgICBpZiAodXNlZEV2ZW50cy5oYXMoZXZlbnROYW1lKSkge1xuICAgICAgICAvLyBOb3RlOiBpdCdzIGltcG9ydGFudCB0byBub3QgcXVvdGUgdGhlIGtleSBzbyB0aGF0IHdlIGNhbiBjYXB0dXJlIHJlbmFtZXMgYnkgbWluaWZpZXJzIVxuICAgICAgICBvdXRwdXREZWZzLnB1c2gobmV3IG8uTGl0ZXJhbE1hcEVudHJ5KHByb3BOYW1lLCBvLmxpdGVyYWwoZXZlbnROYW1lKSwgZmFsc2UpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsZXQgdXBkYXRlRGlyZWN0aXZlRXhwcmVzc2lvbnM6IFVwZGF0ZUV4cHJlc3Npb25bXSA9IFtdO1xuICAgIGlmIChkaXJBc3QuaW5wdXRzLmxlbmd0aCB8fCAoZmxhZ3MgJiAoTm9kZUZsYWdzLkRvQ2hlY2sgfCBOb2RlRmxhZ3MuT25Jbml0KSkgPiAwKSB7XG4gICAgICB1cGRhdGVEaXJlY3RpdmVFeHByZXNzaW9ucyA9XG4gICAgICAgICAgZGlyQXN0LmlucHV0cy5tYXAoKGlucHV0LCBiaW5kaW5nSW5kZXgpID0+IHRoaXMuX3ByZXByb2Nlc3NVcGRhdGVFeHByZXNzaW9uKHtcbiAgICAgICAgICAgIG5vZGVJbmRleCxcbiAgICAgICAgICAgIGJpbmRpbmdJbmRleCxcbiAgICAgICAgICAgIHNvdXJjZVNwYW46IGlucHV0LnNvdXJjZVNwYW4sXG4gICAgICAgICAgICBjb250ZXh0OiBDT01QX1ZBUixcbiAgICAgICAgICAgIHZhbHVlOiBpbnB1dC52YWx1ZVxuICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBjb25zdCBkaXJDb250ZXh0RXhwciA9XG4gICAgICAgIG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5ub2RlVmFsdWUpLmNhbGxGbihbVklFV19WQVIsIG8ubGl0ZXJhbChub2RlSW5kZXgpXSk7XG4gICAgY29uc3QgaG9zdEJpbmRpbmdzID0gZGlyQXN0Lmhvc3RQcm9wZXJ0aWVzLm1hcCgoaW5wdXRBc3QpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGRpckNvbnRleHRFeHByLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJBc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0QXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgIGNvbnN0IGhvc3RFdmVudHMgPSBkaXJBc3QuaG9zdEV2ZW50cy5tYXAoKGhvc3RFdmVudEFzdCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogZGlyQ29udGV4dEV4cHIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50QXN0OiBob3N0RXZlbnRBc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpckFzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgIC8vIENoZWNrIGluZGV4IGlzIHRoZSBzYW1lIGFzIHRoZSBub2RlIGluZGV4IGR1cmluZyBjb21waWxhdGlvblxuICAgIC8vIFRoZXkgbWlnaHQgb25seSBkaWZmZXIgYXQgcnVudGltZVxuICAgIGNvbnN0IGNoZWNrSW5kZXggPSBub2RlSW5kZXg7XG5cbiAgICB0aGlzLm5vZGVzW25vZGVJbmRleF0gPSAoKSA9PiAoe1xuICAgICAgc291cmNlU3BhbjogZGlyQXN0LnNvdXJjZVNwYW4sXG4gICAgICBub2RlRmxhZ3M6IE5vZGVGbGFncy5UeXBlRGlyZWN0aXZlIHwgZmxhZ3MsXG4gICAgICBub2RlRGVmOiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuZGlyZWN0aXZlRGVmKS5jYWxsRm4oW1xuICAgICAgICBvLmxpdGVyYWwoY2hlY2tJbmRleCksXG4gICAgICAgIG8ubGl0ZXJhbChmbGFncyksXG4gICAgICAgIHF1ZXJ5TWF0Y2hFeHBycy5sZW5ndGggPyBvLmxpdGVyYWxBcnIocXVlcnlNYXRjaEV4cHJzKSA6IG8uTlVMTF9FWFBSLFxuICAgICAgICBvLmxpdGVyYWwoY2hpbGRDb3VudCksXG4gICAgICAgIHByb3ZpZGVyRXhwcixcbiAgICAgICAgZGVwc0V4cHIsXG4gICAgICAgIGlucHV0RGVmcy5sZW5ndGggPyBuZXcgby5MaXRlcmFsTWFwRXhwcihpbnB1dERlZnMpIDogby5OVUxMX0VYUFIsXG4gICAgICAgIG91dHB1dERlZnMubGVuZ3RoID8gbmV3IG8uTGl0ZXJhbE1hcEV4cHIob3V0cHV0RGVmcykgOiBvLk5VTExfRVhQUixcbiAgICAgIF0pLFxuICAgICAgdXBkYXRlRGlyZWN0aXZlczogdXBkYXRlRGlyZWN0aXZlRXhwcmVzc2lvbnMsXG4gICAgICBkaXJlY3RpdmU6IGRpckFzdC5kaXJlY3RpdmUudHlwZSxcbiAgICB9KTtcblxuICAgIHJldHVybiB7aG9zdEJpbmRpbmdzLCBob3N0RXZlbnRzfTtcbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0UHJvdmlkZXIocHJvdmlkZXJBc3Q6IFByb3ZpZGVyQXN0LCBxdWVyeU1hdGNoZXM6IFF1ZXJ5TWF0Y2hbXSk6IHZvaWQge1xuICAgIHRoaXMuX2FkZFByb3ZpZGVyTm9kZSh0aGlzLl92aXNpdFByb3ZpZGVyT3JEaXJlY3RpdmUocHJvdmlkZXJBc3QsIHF1ZXJ5TWF0Y2hlcykpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJQcm92aWRlcihkaXJlY3RpdmVzOiBEaXJlY3RpdmVBc3RbXSkge1xuICAgIGNvbnN0IGNvbXBvbmVudERpck1ldGEgPSBkaXJlY3RpdmVzLmZpbmQoZGlyQXN0ID0+IGRpckFzdC5kaXJlY3RpdmUuaXNDb21wb25lbnQpO1xuICAgIGlmIChjb21wb25lbnREaXJNZXRhICYmIGNvbXBvbmVudERpck1ldGEuZGlyZWN0aXZlLmVudHJ5Q29tcG9uZW50cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHtwcm92aWRlckV4cHIsIGRlcHNFeHByLCBmbGFncywgdG9rZW5FeHByfSA9IGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlclByb3ZpZGVyRGVmKFxuICAgICAgICAgIHRoaXMucmVmbGVjdG9yLCB0aGlzLm91dHB1dEN0eCwgTm9kZUZsYWdzLlByaXZhdGVQcm92aWRlcixcbiAgICAgICAgICBjb21wb25lbnREaXJNZXRhLmRpcmVjdGl2ZS5lbnRyeUNvbXBvbmVudHMpO1xuICAgICAgdGhpcy5fYWRkUHJvdmlkZXJOb2RlKHtcbiAgICAgICAgcHJvdmlkZXJFeHByLFxuICAgICAgICBkZXBzRXhwcixcbiAgICAgICAgZmxhZ3MsXG4gICAgICAgIHRva2VuRXhwcixcbiAgICAgICAgcXVlcnlNYXRjaEV4cHJzOiBbXSxcbiAgICAgICAgc291cmNlU3BhbjogY29tcG9uZW50RGlyTWV0YS5zb3VyY2VTcGFuXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hZGRQcm92aWRlck5vZGUoZGF0YToge1xuICAgIGZsYWdzOiBOb2RlRmxhZ3MsXG4gICAgcXVlcnlNYXRjaEV4cHJzOiBvLkV4cHJlc3Npb25bXSxcbiAgICBwcm92aWRlckV4cHI6IG8uRXhwcmVzc2lvbixcbiAgICBkZXBzRXhwcjogby5FeHByZXNzaW9uLFxuICAgIHRva2VuRXhwcjogby5FeHByZXNzaW9uLFxuICAgIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhblxuICB9KSB7XG4gICAgLy8gcHJvdmlkZXJEZWYoXG4gICAgLy8gICBmbGFnczogTm9kZUZsYWdzLCBtYXRjaGVkUXVlcmllczogW3N0cmluZywgUXVlcnlWYWx1ZVR5cGVdW10sIHRva2VuOmFueSxcbiAgICAvLyAgIHZhbHVlOiBhbnksIGRlcHM6IChbRGVwRmxhZ3MsIGFueV0gfCBhbnkpW10pOiBOb2RlRGVmO1xuICAgIHRoaXMubm9kZXMucHVzaChcbiAgICAgICAgKCkgPT4gKHtcbiAgICAgICAgICBzb3VyY2VTcGFuOiBkYXRhLnNvdXJjZVNwYW4sXG4gICAgICAgICAgbm9kZUZsYWdzOiBkYXRhLmZsYWdzLFxuICAgICAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5wcm92aWRlckRlZikuY2FsbEZuKFtcbiAgICAgICAgICAgIG8ubGl0ZXJhbChkYXRhLmZsYWdzKSxcbiAgICAgICAgICAgIGRhdGEucXVlcnlNYXRjaEV4cHJzLmxlbmd0aCA/IG8ubGl0ZXJhbEFycihkYXRhLnF1ZXJ5TWF0Y2hFeHBycykgOiBvLk5VTExfRVhQUixcbiAgICAgICAgICAgIGRhdGEudG9rZW5FeHByLCBkYXRhLnByb3ZpZGVyRXhwciwgZGF0YS5kZXBzRXhwclxuICAgICAgICAgIF0pXG4gICAgICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0UHJvdmlkZXJPckRpcmVjdGl2ZShwcm92aWRlckFzdDogUHJvdmlkZXJBc3QsIHF1ZXJ5TWF0Y2hlczogUXVlcnlNYXRjaFtdKToge1xuICAgIGZsYWdzOiBOb2RlRmxhZ3MsXG4gICAgdG9rZW5FeHByOiBvLkV4cHJlc3Npb24sXG4gICAgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLFxuICAgIHF1ZXJ5TWF0Y2hFeHByczogby5FeHByZXNzaW9uW10sXG4gICAgcHJvdmlkZXJFeHByOiBvLkV4cHJlc3Npb24sXG4gICAgZGVwc0V4cHI6IG8uRXhwcmVzc2lvblxuICB9IHtcbiAgICBsZXQgZmxhZ3MgPSBOb2RlRmxhZ3MuTm9uZTtcbiAgICBsZXQgcXVlcnlNYXRjaEV4cHJzOiBvLkV4cHJlc3Npb25bXSA9IFtdO1xuXG4gICAgcXVlcnlNYXRjaGVzLmZvckVhY2goKG1hdGNoKSA9PiB7XG4gICAgICBpZiAodG9rZW5SZWZlcmVuY2UobWF0Y2gudmFsdWUpID09PSB0b2tlblJlZmVyZW5jZShwcm92aWRlckFzdC50b2tlbikpIHtcbiAgICAgICAgcXVlcnlNYXRjaEV4cHJzLnB1c2goXG4gICAgICAgICAgICBvLmxpdGVyYWxBcnIoW28ubGl0ZXJhbChtYXRjaC5xdWVyeUlkKSwgby5saXRlcmFsKFF1ZXJ5VmFsdWVUeXBlLlByb3ZpZGVyKV0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCB7cHJvdmlkZXJFeHByLCBkZXBzRXhwciwgZmxhZ3M6IHByb3ZpZGVyRmxhZ3MsIHRva2VuRXhwcn0gPVxuICAgICAgICBwcm92aWRlckRlZih0aGlzLm91dHB1dEN0eCwgcHJvdmlkZXJBc3QpO1xuICAgIHJldHVybiB7XG4gICAgICBmbGFnczogZmxhZ3MgfCBwcm92aWRlckZsYWdzLFxuICAgICAgcXVlcnlNYXRjaEV4cHJzLFxuICAgICAgcHJvdmlkZXJFeHByLFxuICAgICAgZGVwc0V4cHIsXG4gICAgICB0b2tlbkV4cHIsXG4gICAgICBzb3VyY2VTcGFuOiBwcm92aWRlckFzdC5zb3VyY2VTcGFuXG4gICAgfTtcbiAgfVxuXG4gIGdldExvY2FsKG5hbWU6IHN0cmluZyk6IG8uRXhwcmVzc2lvbnxudWxsIHtcbiAgICBpZiAobmFtZSA9PSBFdmVudEhhbmRsZXJWYXJzLmV2ZW50Lm5hbWUpIHtcbiAgICAgIHJldHVybiBFdmVudEhhbmRsZXJWYXJzLmV2ZW50O1xuICAgIH1cbiAgICBsZXQgY3VyclZpZXdFeHByOiBvLkV4cHJlc3Npb24gPSBWSUVXX1ZBUjtcbiAgICBmb3IgKGxldCBjdXJyQnVpbGRlcjogVmlld0J1aWxkZXJ8bnVsbCA9IHRoaXM7IGN1cnJCdWlsZGVyOyBjdXJyQnVpbGRlciA9IGN1cnJCdWlsZGVyLnBhcmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclZpZXdFeHByID0gY3VyclZpZXdFeHByLnByb3AoJ3BhcmVudCcpLmNhc3Qoby5EWU5BTUlDX1RZUEUpKSB7XG4gICAgICAvLyBjaGVjayByZWZlcmVuY2VzXG4gICAgICBjb25zdCByZWZOb2RlSW5kZXggPSBjdXJyQnVpbGRlci5yZWZOb2RlSW5kaWNlc1tuYW1lXTtcbiAgICAgIGlmIChyZWZOb2RlSW5kZXggIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gby5pbXBvcnRFeHByKElkZW50aWZpZXJzLm5vZGVWYWx1ZSkuY2FsbEZuKFtjdXJyVmlld0V4cHIsIG8ubGl0ZXJhbChyZWZOb2RlSW5kZXgpXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrIHZhcmlhYmxlc1xuICAgICAgY29uc3QgdmFyQXN0ID0gY3VyckJ1aWxkZXIudmFyaWFibGVzLmZpbmQoKHZhckFzdCkgPT4gdmFyQXN0Lm5hbWUgPT09IG5hbWUpO1xuICAgICAgaWYgKHZhckFzdCkge1xuICAgICAgICBjb25zdCB2YXJWYWx1ZSA9IHZhckFzdC52YWx1ZSB8fCBJTVBMSUNJVF9URU1QTEFURV9WQVI7XG4gICAgICAgIHJldHVybiBjdXJyVmlld0V4cHIucHJvcCgnY29udGV4dCcpLnByb3AodmFyVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG5vdGlmeUltcGxpY2l0UmVjZWl2ZXJVc2UoKTogdm9pZCB7XG4gICAgLy8gTm90IG5lZWRlZCBpbiBWaWV3RW5naW5lIGFzIFZpZXdFbmdpbmUgd2Fsa3MgdGhyb3VnaCB0aGUgZ2VuZXJhdGVkXG4gICAgLy8gZXhwcmVzc2lvbnMgdG8gZmlndXJlIG91dCBpZiB0aGUgaW1wbGljaXQgcmVjZWl2ZXIgaXMgdXNlZCBhbmQgbmVlZHNcbiAgICAvLyB0byBiZSBnZW5lcmF0ZWQgYXMgcGFydCBvZiB0aGUgcHJlLXVwZGF0ZSBzdGF0ZW1lbnRzLlxuICB9XG5cbiAgbWF5YmVSZXN0b3JlVmlldygpOiB2b2lkIHtcbiAgICAvLyBOb3QgbmVjZXNzYXJ5IGluIFZpZXdFbmdpbmUsIGJlY2F1c2UgdmlldyByZXN0b3JhdGlvbiBpcyBhbiBJdnkgY29uY2VwdC5cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUxpdGVyYWxBcnJheUNvbnZlcnRlcihzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sIGFyZ0NvdW50OiBudW1iZXIpOlxuICAgICAgQnVpbHRpbkNvbnZlcnRlciB7XG4gICAgaWYgKGFyZ0NvdW50ID09PSAwKSB7XG4gICAgICBjb25zdCB2YWx1ZUV4cHIgPSBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuRU1QVFlfQVJSQVkpO1xuICAgICAgcmV0dXJuICgpID0+IHZhbHVlRXhwcjtcbiAgICB9XG5cbiAgICBjb25zdCBjaGVja0luZGV4ID0gdGhpcy5ub2Rlcy5sZW5ndGg7XG5cbiAgICB0aGlzLm5vZGVzLnB1c2goKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVQdXJlQXJyYXksXG4gICAgICAgICAgICAgICAgICAgICAgbm9kZURlZjogby5pbXBvcnRFeHByKElkZW50aWZpZXJzLnB1cmVBcnJheURlZikuY2FsbEZuKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChjaGVja0luZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChhcmdDb3VudCksXG4gICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgcmV0dXJuIChhcmdzOiBvLkV4cHJlc3Npb25bXSkgPT4gY2FsbENoZWNrU3RtdChjaGVja0luZGV4LCBhcmdzKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUxpdGVyYWxNYXBDb252ZXJ0ZXIoXG4gICAgICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sIGtleXM6IHtrZXk6IHN0cmluZywgcXVvdGVkOiBib29sZWFufVtdKTogQnVpbHRpbkNvbnZlcnRlciB7XG4gICAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCB2YWx1ZUV4cHIgPSBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuRU1QVFlfTUFQKTtcbiAgICAgIHJldHVybiAoKSA9PiB2YWx1ZUV4cHI7XG4gICAgfVxuXG4gICAgY29uc3QgbWFwID0gby5saXRlcmFsTWFwKGtleXMubWFwKChlLCBpKSA9PiAoey4uLmUsIHZhbHVlOiBvLmxpdGVyYWwoaSl9KSkpO1xuICAgIGNvbnN0IGNoZWNrSW5kZXggPSB0aGlzLm5vZGVzLmxlbmd0aDtcbiAgICB0aGlzLm5vZGVzLnB1c2goKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVQdXJlT2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5wdXJlT2JqZWN0RGVmKS5jYWxsRm4oW1xuICAgICAgICAgICAgICAgICAgICAgICAgby5saXRlcmFsKGNoZWNrSW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwLFxuICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgIHJldHVybiAoYXJnczogby5FeHByZXNzaW9uW10pID0+IGNhbGxDaGVja1N0bXQoY2hlY2tJbmRleCwgYXJncyk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVQaXBlQ29udmVydGVyKGV4cHJlc3Npb246IFVwZGF0ZUV4cHJlc3Npb24sIG5hbWU6IHN0cmluZywgYXJnQ291bnQ6IG51bWJlcik6XG4gICAgICBCdWlsdGluQ29udmVydGVyIHtcbiAgICBjb25zdCBwaXBlID0gdGhpcy51c2VkUGlwZXMuZmluZCgocGlwZVN1bW1hcnkpID0+IHBpcGVTdW1tYXJ5Lm5hbWUgPT09IG5hbWUpITtcbiAgICBpZiAocGlwZS5wdXJlKSB7XG4gICAgICBjb25zdCBjaGVja0luZGV4ID0gdGhpcy5ub2Rlcy5sZW5ndGg7XG4gICAgICB0aGlzLm5vZGVzLnB1c2goKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVNwYW46IGV4cHJlc3Npb24uc291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVQdXJlUGlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5wdXJlUGlwZURlZikuY2FsbEZuKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgby5saXRlcmFsKGNoZWNrSW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvLmxpdGVyYWwoYXJnQ291bnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgIC8vIGZpbmQgdW5kZXJseWluZyBwaXBlIGluIHRoZSBjb21wb25lbnQgdmlld1xuICAgICAgbGV0IGNvbXBWaWV3RXhwcjogby5FeHByZXNzaW9uID0gVklFV19WQVI7XG4gICAgICBsZXQgY29tcEJ1aWxkZXI6IFZpZXdCdWlsZGVyID0gdGhpcztcbiAgICAgIHdoaWxlIChjb21wQnVpbGRlci5wYXJlbnQpIHtcbiAgICAgICAgY29tcEJ1aWxkZXIgPSBjb21wQnVpbGRlci5wYXJlbnQ7XG4gICAgICAgIGNvbXBWaWV3RXhwciA9IGNvbXBWaWV3RXhwci5wcm9wKCdwYXJlbnQnKS5jYXN0KG8uRFlOQU1JQ19UWVBFKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBpcGVOb2RlSW5kZXggPSBjb21wQnVpbGRlci5wdXJlUGlwZU5vZGVJbmRpY2VzW25hbWVdO1xuICAgICAgY29uc3QgcGlwZVZhbHVlRXhwcjogby5FeHByZXNzaW9uID1cbiAgICAgICAgICBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMubm9kZVZhbHVlKS5jYWxsRm4oW2NvbXBWaWV3RXhwciwgby5saXRlcmFsKHBpcGVOb2RlSW5kZXgpXSk7XG5cbiAgICAgIHJldHVybiAoYXJnczogby5FeHByZXNzaW9uW10pID0+IGNhbGxVbndyYXBWYWx1ZShcbiAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbi5ub2RlSW5kZXgsIGV4cHJlc3Npb24uYmluZGluZ0luZGV4LFxuICAgICAgICAgICAgICAgICBjYWxsQ2hlY2tTdG10KGNoZWNrSW5kZXgsIFtwaXBlVmFsdWVFeHByXS5jb25jYXQoYXJncykpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgbm9kZUluZGV4ID0gdGhpcy5fY3JlYXRlUGlwZShleHByZXNzaW9uLnNvdXJjZVNwYW4sIHBpcGUpO1xuICAgICAgY29uc3Qgbm9kZVZhbHVlRXhwciA9XG4gICAgICAgICAgby5pbXBvcnRFeHByKElkZW50aWZpZXJzLm5vZGVWYWx1ZSkuY2FsbEZuKFtWSUVXX1ZBUiwgby5saXRlcmFsKG5vZGVJbmRleCldKTtcblxuICAgICAgcmV0dXJuIChhcmdzOiBvLkV4cHJlc3Npb25bXSkgPT4gY2FsbFVud3JhcFZhbHVlKFxuICAgICAgICAgICAgICAgICBleHByZXNzaW9uLm5vZGVJbmRleCwgZXhwcmVzc2lvbi5iaW5kaW5nSW5kZXgsXG4gICAgICAgICAgICAgICAgIG5vZGVWYWx1ZUV4cHIuY2FsbE1ldGhvZCgndHJhbnNmb3JtJywgYXJncykpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVBpcGUoc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFufG51bGwsIHBpcGU6IENvbXBpbGVQaXBlU3VtbWFyeSk6IG51bWJlciB7XG4gICAgY29uc3Qgbm9kZUluZGV4ID0gdGhpcy5ub2Rlcy5sZW5ndGg7XG4gICAgbGV0IGZsYWdzID0gTm9kZUZsYWdzLk5vbmU7XG4gICAgcGlwZS50eXBlLmxpZmVjeWNsZUhvb2tzLmZvckVhY2goKGxpZmVjeWNsZUhvb2spID0+IHtcbiAgICAgIC8vIGZvciBwaXBlcywgd2Ugb25seSBzdXBwb3J0IG5nT25EZXN0cm95XG4gICAgICBpZiAobGlmZWN5Y2xlSG9vayA9PT0gTGlmZWN5Y2xlSG9va3MuT25EZXN0cm95KSB7XG4gICAgICAgIGZsYWdzIHw9IGxpZmVjeWNsZUhvb2tUb05vZGVGbGFnKGxpZmVjeWNsZUhvb2spO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgZGVwRXhwcnMgPSBwaXBlLnR5cGUuZGlEZXBzLm1hcCgoZGlEZXApID0+IGRlcERlZih0aGlzLm91dHB1dEN0eCwgZGlEZXApKTtcbiAgICAvLyBmdW5jdGlvbiBwaXBlRGVmKFxuICAgIC8vICAgZmxhZ3M6IE5vZGVGbGFncywgY3RvcjogYW55LCBkZXBzOiAoW0RlcEZsYWdzLCBhbnldIHwgYW55KVtdKTogTm9kZURlZlxuICAgIHRoaXMubm9kZXMucHVzaChcbiAgICAgICAgKCkgPT4gKHtcbiAgICAgICAgICBzb3VyY2VTcGFuLFxuICAgICAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVQaXBlLFxuICAgICAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5waXBlRGVmKS5jYWxsRm4oW1xuICAgICAgICAgICAgby5saXRlcmFsKGZsYWdzKSwgdGhpcy5vdXRwdXRDdHguaW1wb3J0RXhwcihwaXBlLnR5cGUucmVmZXJlbmNlKSwgby5saXRlcmFsQXJyKGRlcEV4cHJzKVxuICAgICAgICAgIF0pXG4gICAgICAgIH0pKTtcbiAgICByZXR1cm4gbm9kZUluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciB0aGUgQVNUIGluIGBVcGRhdGVFeHByZXNzaW9uLnZhbHVlYDpcbiAgICogLSBjcmVhdGUgbm9kZXMgZm9yIHBpcGVzLCBsaXRlcmFsIGFycmF5cyBhbmQsIGxpdGVyYWwgbWFwcyxcbiAgICogLSB1cGRhdGUgdGhlIEFTVCB0byByZXBsYWNlIHBpcGVzLCBsaXRlcmFsIGFycmF5cyBhbmQsIGxpdGVyYWwgbWFwcyB3aXRoIGNhbGxzIHRvIGNoZWNrIGZuLlxuICAgKlxuICAgKiBXQVJOSU5HOiBUaGlzIG1pZ2h0IGNyZWF0ZSBuZXcgbm9kZURlZnMgKGZvciBwaXBlcyBhbmQgbGl0ZXJhbCBhcnJheXMgYW5kIGxpdGVyYWwgbWFwcykhXG4gICAqL1xuICBwcml2YXRlIF9wcmVwcm9jZXNzVXBkYXRlRXhwcmVzc2lvbihleHByZXNzaW9uOiBVcGRhdGVFeHByZXNzaW9uKTogVXBkYXRlRXhwcmVzc2lvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5vZGVJbmRleDogZXhwcmVzc2lvbi5ub2RlSW5kZXgsXG4gICAgICBiaW5kaW5nSW5kZXg6IGV4cHJlc3Npb24uYmluZGluZ0luZGV4LFxuICAgICAgc291cmNlU3BhbjogZXhwcmVzc2lvbi5zb3VyY2VTcGFuLFxuICAgICAgY29udGV4dDogZXhwcmVzc2lvbi5jb250ZXh0LFxuICAgICAgdmFsdWU6IGNvbnZlcnRQcm9wZXJ0eUJpbmRpbmdCdWlsdGlucyhcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjcmVhdGVMaXRlcmFsQXJyYXlDb252ZXJ0ZXI6IChhcmdDb3VudDogbnVtYmVyKSA9PlxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUxpdGVyYWxBcnJheUNvbnZlcnRlcihleHByZXNzaW9uLnNvdXJjZVNwYW4sIGFyZ0NvdW50KSxcbiAgICAgICAgICAgIGNyZWF0ZUxpdGVyYWxNYXBDb252ZXJ0ZXI6IChrZXlzOiB7a2V5OiBzdHJpbmcsIHF1b3RlZDogYm9vbGVhbn1bXSkgPT5cbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVMaXRlcmFsTWFwQ29udmVydGVyKGV4cHJlc3Npb24uc291cmNlU3Bhbiwga2V5cyksXG4gICAgICAgICAgICBjcmVhdGVQaXBlQ29udmVydGVyOiAobmFtZTogc3RyaW5nLCBhcmdDb3VudDogbnVtYmVyKSA9PlxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVBpcGVDb252ZXJ0ZXIoZXhwcmVzc2lvbiwgbmFtZSwgYXJnQ291bnQpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBleHByZXNzaW9uLnZhbHVlKVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVOb2RlRXhwcmVzc2lvbnMoKToge1xuICAgIHVwZGF0ZVJlbmRlcmVyU3RtdHM6IG8uU3RhdGVtZW50W10sXG4gICAgdXBkYXRlRGlyZWN0aXZlc1N0bXRzOiBvLlN0YXRlbWVudFtdLFxuICAgIG5vZGVEZWZFeHByczogby5FeHByZXNzaW9uW11cbiAgfSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgbGV0IHVwZGF0ZUJpbmRpbmdDb3VudCA9IDA7XG4gICAgY29uc3QgdXBkYXRlUmVuZGVyZXJTdG10czogby5TdGF0ZW1lbnRbXSA9IFtdO1xuICAgIGNvbnN0IHVwZGF0ZURpcmVjdGl2ZXNTdG10czogby5TdGF0ZW1lbnRbXSA9IFtdO1xuICAgIGNvbnN0IG5vZGVEZWZFeHBycyA9IHRoaXMubm9kZXMubWFwKChmYWN0b3J5LCBub2RlSW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHtub2RlRGVmLCBub2RlRmxhZ3MsIHVwZGF0ZURpcmVjdGl2ZXMsIHVwZGF0ZVJlbmRlcmVyLCBzb3VyY2VTcGFufSA9IGZhY3RvcnkoKTtcbiAgICAgIGlmICh1cGRhdGVSZW5kZXJlcikge1xuICAgICAgICB1cGRhdGVSZW5kZXJlclN0bXRzLnB1c2goXG4gICAgICAgICAgICAuLi5jcmVhdGVVcGRhdGVTdGF0ZW1lbnRzKG5vZGVJbmRleCwgc291cmNlU3BhbiwgdXBkYXRlUmVuZGVyZXIsIGZhbHNlKSk7XG4gICAgICB9XG4gICAgICBpZiAodXBkYXRlRGlyZWN0aXZlcykge1xuICAgICAgICB1cGRhdGVEaXJlY3RpdmVzU3RtdHMucHVzaCguLi5jcmVhdGVVcGRhdGVTdGF0ZW1lbnRzKFxuICAgICAgICAgICAgbm9kZUluZGV4LCBzb3VyY2VTcGFuLCB1cGRhdGVEaXJlY3RpdmVzLFxuICAgICAgICAgICAgKG5vZGVGbGFncyAmIChOb2RlRmxhZ3MuRG9DaGVjayB8IE5vZGVGbGFncy5PbkluaXQpKSA+IDApKTtcbiAgICAgIH1cbiAgICAgIC8vIFdlIHVzZSBhIGNvbW1hIGV4cHJlc3Npb24gdG8gY2FsbCB0aGUgbG9nIGZ1bmN0aW9uIGJlZm9yZVxuICAgICAgLy8gdGhlIG5vZGVEZWYgZnVuY3Rpb24sIGJ1dCBzdGlsbCB1c2UgdGhlIHJlc3VsdCBvZiB0aGUgbm9kZURlZiBmdW5jdGlvblxuICAgICAgLy8gYXMgdGhlIHZhbHVlLlxuICAgICAgLy8gTm90ZTogV2Ugb25seSBhZGQgdGhlIGxvZ2dlciB0byBlbGVtZW50cyAvIHRleHQgbm9kZXMsXG4gICAgICAvLyBzbyB3ZSBkb24ndCBnZW5lcmF0ZSB0b28gbXVjaCBjb2RlLlxuICAgICAgY29uc3QgbG9nV2l0aE5vZGVEZWYgPSBub2RlRmxhZ3MgJiBOb2RlRmxhZ3MuQ2F0UmVuZGVyTm9kZSA/XG4gICAgICAgICAgbmV3IG8uQ29tbWFFeHByKFtMT0dfVkFSLmNhbGxGbihbXSkuY2FsbEZuKFtdKSwgbm9kZURlZl0pIDpcbiAgICAgICAgICBub2RlRGVmO1xuICAgICAgcmV0dXJuIG8uYXBwbHlTb3VyY2VTcGFuVG9FeHByZXNzaW9uSWZOZWVkZWQobG9nV2l0aE5vZGVEZWYsIHNvdXJjZVNwYW4pO1xuICAgIH0pO1xuICAgIHJldHVybiB7dXBkYXRlUmVuZGVyZXJTdG10cywgdXBkYXRlRGlyZWN0aXZlc1N0bXRzLCBub2RlRGVmRXhwcnN9O1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlVXBkYXRlU3RhdGVtZW50cyhcbiAgICAgICAgbm9kZUluZGV4OiBudW1iZXIsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbnxudWxsLCBleHByZXNzaW9uczogVXBkYXRlRXhwcmVzc2lvbltdLFxuICAgICAgICBhbGxvd0VtcHR5RXhwcnM6IGJvb2xlYW4pOiBvLlN0YXRlbWVudFtdIHtcbiAgICAgIGNvbnN0IHVwZGF0ZVN0bXRzOiBvLlN0YXRlbWVudFtdID0gW107XG4gICAgICBjb25zdCBleHBycyA9IGV4cHJlc3Npb25zLm1hcCgoe3NvdXJjZVNwYW4sIGNvbnRleHQsIHZhbHVlfSkgPT4ge1xuICAgICAgICBjb25zdCBiaW5kaW5nSWQgPSBgJHt1cGRhdGVCaW5kaW5nQ291bnQrK31gO1xuICAgICAgICBjb25zdCBuYW1lUmVzb2x2ZXIgPSBjb250ZXh0ID09PSBDT01QX1ZBUiA/IHNlbGYgOiBudWxsO1xuICAgICAgICBjb25zdCB7c3RtdHMsIGN1cnJWYWxFeHByfSA9XG4gICAgICAgICAgICBjb252ZXJ0UHJvcGVydHlCaW5kaW5nKG5hbWVSZXNvbHZlciwgY29udGV4dCwgdmFsdWUsIGJpbmRpbmdJZCwgQmluZGluZ0Zvcm0uR2VuZXJhbCk7XG4gICAgICAgIHVwZGF0ZVN0bXRzLnB1c2goLi4uc3RtdHMubWFwKFxuICAgICAgICAgICAgKHN0bXQ6IG8uU3RhdGVtZW50KSA9PiBvLmFwcGx5U291cmNlU3BhblRvU3RhdGVtZW50SWZOZWVkZWQoc3RtdCwgc291cmNlU3BhbikpKTtcbiAgICAgICAgcmV0dXJuIG8uYXBwbHlTb3VyY2VTcGFuVG9FeHByZXNzaW9uSWZOZWVkZWQoY3VyclZhbEV4cHIsIHNvdXJjZVNwYW4pO1xuICAgICAgfSk7XG4gICAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoIHx8IGFsbG93RW1wdHlFeHBycykge1xuICAgICAgICB1cGRhdGVTdG10cy5wdXNoKG8uYXBwbHlTb3VyY2VTcGFuVG9TdGF0ZW1lbnRJZk5lZWRlZChcbiAgICAgICAgICAgIGNhbGxDaGVja1N0bXQobm9kZUluZGV4LCBleHBycykudG9TdG10KCksIHNvdXJjZVNwYW4pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1cGRhdGVTdG10cztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVFbGVtZW50SGFuZGxlRXZlbnRGbihcbiAgICAgIG5vZGVJbmRleDogbnVtYmVyLFxuICAgICAgaGFuZGxlcnM6IHtjb250ZXh0OiBvLkV4cHJlc3Npb24sIGV2ZW50QXN0OiBCb3VuZEV2ZW50QXN0LCBkaXJBc3Q6IERpcmVjdGl2ZUFzdH1bXSkge1xuICAgIGNvbnN0IGhhbmRsZUV2ZW50U3RtdHM6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgICBsZXQgaGFuZGxlRXZlbnRCaW5kaW5nQ291bnQgPSAwO1xuICAgIGhhbmRsZXJzLmZvckVhY2goKHtjb250ZXh0LCBldmVudEFzdCwgZGlyQXN0fSkgPT4ge1xuICAgICAgY29uc3QgYmluZGluZ0lkID0gYCR7aGFuZGxlRXZlbnRCaW5kaW5nQ291bnQrK31gO1xuICAgICAgY29uc3QgbmFtZVJlc29sdmVyID0gY29udGV4dCA9PT0gQ09NUF9WQVIgPyB0aGlzIDogbnVsbDtcbiAgICAgIGNvbnN0IHtzdG10cywgYWxsb3dEZWZhdWx0fSA9XG4gICAgICAgICAgY29udmVydEFjdGlvbkJpbmRpbmcobmFtZVJlc29sdmVyLCBjb250ZXh0LCBldmVudEFzdC5oYW5kbGVyLCBiaW5kaW5nSWQpO1xuICAgICAgY29uc3QgdHJ1ZVN0bXRzID0gc3RtdHM7XG4gICAgICBpZiAoYWxsb3dEZWZhdWx0KSB7XG4gICAgICAgIHRydWVTdG10cy5wdXNoKEFMTE9XX0RFRkFVTFRfVkFSLnNldChhbGxvd0RlZmF1bHQuYW5kKEFMTE9XX0RFRkFVTFRfVkFSKSkudG9TdG10KCkpO1xuICAgICAgfVxuICAgICAgY29uc3Qge3RhcmdldDogZXZlbnRUYXJnZXQsIG5hbWU6IGV2ZW50TmFtZX0gPSBlbGVtZW50RXZlbnROYW1lQW5kVGFyZ2V0KGV2ZW50QXN0LCBkaXJBc3QpO1xuICAgICAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGVsZW1lbnRFdmVudEZ1bGxOYW1lKGV2ZW50VGFyZ2V0LCBldmVudE5hbWUpO1xuICAgICAgaGFuZGxlRXZlbnRTdG10cy5wdXNoKG8uYXBwbHlTb3VyY2VTcGFuVG9TdGF0ZW1lbnRJZk5lZWRlZChcbiAgICAgICAgICBuZXcgby5JZlN0bXQoby5saXRlcmFsKGZ1bGxFdmVudE5hbWUpLmlkZW50aWNhbChFVkVOVF9OQU1FX1ZBUiksIHRydWVTdG10cyksXG4gICAgICAgICAgZXZlbnRBc3Quc291cmNlU3BhbikpO1xuICAgIH0pO1xuICAgIGxldCBoYW5kbGVFdmVudEZuOiBvLkV4cHJlc3Npb247XG4gICAgaWYgKGhhbmRsZUV2ZW50U3RtdHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcHJlU3RtdHM6IG8uU3RhdGVtZW50W10gPVxuICAgICAgICAgIFtBTExPV19ERUZBVUxUX1ZBUi5zZXQoby5saXRlcmFsKHRydWUpKS50b0RlY2xTdG10KG8uQk9PTF9UWVBFKV07XG4gICAgICBpZiAoIXRoaXMuY29tcG9uZW50LmlzSG9zdCAmJiBvLmZpbmRSZWFkVmFyTmFtZXMoaGFuZGxlRXZlbnRTdG10cykuaGFzKENPTVBfVkFSLm5hbWUhKSkge1xuICAgICAgICBwcmVTdG10cy5wdXNoKENPTVBfVkFSLnNldChWSUVXX1ZBUi5wcm9wKCdjb21wb25lbnQnKSkudG9EZWNsU3RtdCh0aGlzLmNvbXBUeXBlKSk7XG4gICAgICB9XG4gICAgICBoYW5kbGVFdmVudEZuID0gby5mbihcbiAgICAgICAgICBbXG4gICAgICAgICAgICBuZXcgby5GblBhcmFtKFZJRVdfVkFSLm5hbWUhLCBvLklORkVSUkVEX1RZUEUpLFxuICAgICAgICAgICAgbmV3IG8uRm5QYXJhbShFVkVOVF9OQU1FX1ZBUi5uYW1lISwgby5JTkZFUlJFRF9UWVBFKSxcbiAgICAgICAgICAgIG5ldyBvLkZuUGFyYW0oRXZlbnRIYW5kbGVyVmFycy5ldmVudC5uYW1lISwgby5JTkZFUlJFRF9UWVBFKVxuICAgICAgICAgIF0sXG4gICAgICAgICAgWy4uLnByZVN0bXRzLCAuLi5oYW5kbGVFdmVudFN0bXRzLCBuZXcgby5SZXR1cm5TdGF0ZW1lbnQoQUxMT1dfREVGQVVMVF9WQVIpXSxcbiAgICAgICAgICBvLklORkVSUkVEX1RZUEUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYW5kbGVFdmVudEZuID0gby5OVUxMX0VYUFI7XG4gICAgfVxuICAgIHJldHVybiBoYW5kbGVFdmVudEZuO1xuICB9XG5cbiAgdmlzaXREaXJlY3RpdmUoYXN0OiBEaXJlY3RpdmVBc3QsIGNvbnRleHQ6IHt1c2VkRXZlbnRzOiBTZXQ8c3RyaW5nPn0pOiBhbnkge31cbiAgdmlzaXREaXJlY3RpdmVQcm9wZXJ0eShhc3Q6IEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdFJlZmVyZW5jZShhc3Q6IFJlZmVyZW5jZUFzdCwgY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0VmFyaWFibGUoYXN0OiBWYXJpYWJsZUFzdCwgY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0RXZlbnQoYXN0OiBCb3VuZEV2ZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge31cbiAgdmlzaXRFbGVtZW50UHJvcGVydHkoYXN0OiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCwgY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0QXR0cihhc3Q6IEF0dHJBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxufVxuXG5mdW5jdGlvbiBuZWVkc0FkZGl0aW9uYWxSb290Tm9kZShhc3ROb2RlczogVGVtcGxhdGVBc3RbXSk6IGJvb2xlYW4ge1xuICBjb25zdCBsYXN0QXN0Tm9kZSA9IGFzdE5vZGVzW2FzdE5vZGVzLmxlbmd0aCAtIDFdO1xuICBpZiAobGFzdEFzdE5vZGUgaW5zdGFuY2VvZiBFbWJlZGRlZFRlbXBsYXRlQXN0KSB7XG4gICAgcmV0dXJuIGxhc3RBc3ROb2RlLmhhc1ZpZXdDb250YWluZXI7XG4gIH1cblxuICBpZiAobGFzdEFzdE5vZGUgaW5zdGFuY2VvZiBFbGVtZW50QXN0KSB7XG4gICAgaWYgKGlzTmdDb250YWluZXIobGFzdEFzdE5vZGUubmFtZSkgJiYgbGFzdEFzdE5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbmVlZHNBZGRpdGlvbmFsUm9vdE5vZGUobGFzdEFzdE5vZGUuY2hpbGRyZW4pO1xuICAgIH1cbiAgICByZXR1cm4gbGFzdEFzdE5vZGUuaGFzVmlld0NvbnRhaW5lcjtcbiAgfVxuXG4gIHJldHVybiBsYXN0QXN0Tm9kZSBpbnN0YW5jZW9mIE5nQ29udGVudEFzdDtcbn1cblxuXG5mdW5jdGlvbiBlbGVtZW50QmluZGluZ0RlZihpbnB1dEFzdDogQm91bmRFbGVtZW50UHJvcGVydHlBc3QsIGRpckFzdDogRGlyZWN0aXZlQXN0KTogby5FeHByZXNzaW9uIHtcbiAgY29uc3QgaW5wdXRUeXBlID0gaW5wdXRBc3QudHlwZTtcbiAgc3dpdGNoIChpbnB1dFR5cGUpIHtcbiAgICBjYXNlIFByb3BlcnR5QmluZGluZ1R5cGUuQXR0cmlidXRlOlxuICAgICAgcmV0dXJuIG8ubGl0ZXJhbEFycihbXG4gICAgICAgIG8ubGl0ZXJhbChCaW5kaW5nRmxhZ3MuVHlwZUVsZW1lbnRBdHRyaWJ1dGUpLCBvLmxpdGVyYWwoaW5wdXRBc3QubmFtZSksXG4gICAgICAgIG8ubGl0ZXJhbChpbnB1dEFzdC5zZWN1cml0eUNvbnRleHQpXG4gICAgICBdKTtcbiAgICBjYXNlIFByb3BlcnR5QmluZGluZ1R5cGUuUHJvcGVydHk6XG4gICAgICByZXR1cm4gby5saXRlcmFsQXJyKFtcbiAgICAgICAgby5saXRlcmFsKEJpbmRpbmdGbGFncy5UeXBlUHJvcGVydHkpLCBvLmxpdGVyYWwoaW5wdXRBc3QubmFtZSksXG4gICAgICAgIG8ubGl0ZXJhbChpbnB1dEFzdC5zZWN1cml0eUNvbnRleHQpXG4gICAgICBdKTtcbiAgICBjYXNlIFByb3BlcnR5QmluZGluZ1R5cGUuQW5pbWF0aW9uOlxuICAgICAgY29uc3QgYmluZGluZ1R5cGUgPSBCaW5kaW5nRmxhZ3MuVHlwZVByb3BlcnR5IHxcbiAgICAgICAgICAoZGlyQXN0ICYmIGRpckFzdC5kaXJlY3RpdmUuaXNDb21wb25lbnQgPyBCaW5kaW5nRmxhZ3MuU3ludGhldGljSG9zdFByb3BlcnR5IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCaW5kaW5nRmxhZ3MuU3ludGhldGljUHJvcGVydHkpO1xuICAgICAgcmV0dXJuIG8ubGl0ZXJhbEFycihbXG4gICAgICAgIG8ubGl0ZXJhbChiaW5kaW5nVHlwZSksIG8ubGl0ZXJhbCgnQCcgKyBpbnB1dEFzdC5uYW1lKSwgby5saXRlcmFsKGlucHV0QXN0LnNlY3VyaXR5Q29udGV4dClcbiAgICAgIF0pO1xuICAgIGNhc2UgUHJvcGVydHlCaW5kaW5nVHlwZS5DbGFzczpcbiAgICAgIHJldHVybiBvLmxpdGVyYWxBcnIoXG4gICAgICAgICAgW28ubGl0ZXJhbChCaW5kaW5nRmxhZ3MuVHlwZUVsZW1lbnRDbGFzcyksIG8ubGl0ZXJhbChpbnB1dEFzdC5uYW1lKSwgby5OVUxMX0VYUFJdKTtcbiAgICBjYXNlIFByb3BlcnR5QmluZGluZ1R5cGUuU3R5bGU6XG4gICAgICByZXR1cm4gby5saXRlcmFsQXJyKFtcbiAgICAgICAgby5saXRlcmFsKEJpbmRpbmdGbGFncy5UeXBlRWxlbWVudFN0eWxlKSwgby5saXRlcmFsKGlucHV0QXN0Lm5hbWUpLCBvLmxpdGVyYWwoaW5wdXRBc3QudW5pdClcbiAgICAgIF0pO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBUaGlzIGRlZmF1bHQgY2FzZSBpcyBub3QgbmVlZGVkIGJ5IFR5cGVTY3JpcHQgY29tcGlsZXIsIGFzIHRoZSBzd2l0Y2ggaXMgZXhoYXVzdGl2ZS5cbiAgICAgIC8vIEhvd2V2ZXIgQ2xvc3VyZSBDb21waWxlciBkb2VzIG5vdCB1bmRlcnN0YW5kIHRoYXQgYW5kIHJlcG9ydHMgYW4gZXJyb3IgaW4gdHlwZWQgbW9kZS5cbiAgICAgIC8vIFRoZSBgdGhyb3cgbmV3IEVycm9yYCBiZWxvdyB3b3JrcyBhcm91bmQgdGhlIHByb2JsZW0sIGFuZCB0aGUgdW5leHBlY3RlZDogbmV2ZXIgdmFyaWFibGVcbiAgICAgIC8vIG1ha2VzIHN1cmUgdHNjIHN0aWxsIGNoZWNrcyB0aGlzIGNvZGUgaXMgdW5yZWFjaGFibGUuXG4gICAgICBjb25zdCB1bmV4cGVjdGVkOiBuZXZlciA9IGlucHV0VHlwZTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5leHBlY3RlZCAke3VuZXhwZWN0ZWR9YCk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBmaXhlZEF0dHJzRGVmKGVsZW1lbnRBc3Q6IEVsZW1lbnRBc3QpOiBvLkV4cHJlc3Npb24ge1xuICBjb25zdCBtYXBSZXN1bHQ6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgZWxlbWVudEFzdC5hdHRycy5mb3JFYWNoKGF0dHJBc3QgPT4ge1xuICAgIG1hcFJlc3VsdFthdHRyQXN0Lm5hbWVdID0gYXR0ckFzdC52YWx1ZTtcbiAgfSk7XG4gIGVsZW1lbnRBc3QuZGlyZWN0aXZlcy5mb3JFYWNoKGRpckFzdCA9PiB7XG4gICAgT2JqZWN0LmtleXMoZGlyQXN0LmRpcmVjdGl2ZS5ob3N0QXR0cmlidXRlcykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gZGlyQXN0LmRpcmVjdGl2ZS5ob3N0QXR0cmlidXRlc1tuYW1lXTtcbiAgICAgIGNvbnN0IHByZXZWYWx1ZSA9IG1hcFJlc3VsdFtuYW1lXTtcbiAgICAgIG1hcFJlc3VsdFtuYW1lXSA9IHByZXZWYWx1ZSAhPSBudWxsID8gbWVyZ2VBdHRyaWJ1dGVWYWx1ZShuYW1lLCBwcmV2VmFsdWUsIHZhbHVlKSA6IHZhbHVlO1xuICAgIH0pO1xuICB9KTtcbiAgLy8gTm90ZTogV2UgbmVlZCB0byBzb3J0IHRvIGdldCBhIGRlZmluZWQgb3V0cHV0IG9yZGVyXG4gIC8vIGZvciB0ZXN0cyBhbmQgZm9yIGNhY2hpbmcgZ2VuZXJhdGVkIGFydGlmYWN0cy4uLlxuICByZXR1cm4gby5saXRlcmFsQXJyKE9iamVjdC5rZXlzKG1hcFJlc3VsdCkuc29ydCgpLm1hcChcbiAgICAgIChhdHRyTmFtZSkgPT4gby5saXRlcmFsQXJyKFtvLmxpdGVyYWwoYXR0ck5hbWUpLCBvLmxpdGVyYWwobWFwUmVzdWx0W2F0dHJOYW1lXSldKSkpO1xufVxuXG5mdW5jdGlvbiBtZXJnZUF0dHJpYnV0ZVZhbHVlKGF0dHJOYW1lOiBzdHJpbmcsIGF0dHJWYWx1ZTE6IHN0cmluZywgYXR0clZhbHVlMjogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGF0dHJOYW1lID09IENMQVNTX0FUVFIgfHwgYXR0ck5hbWUgPT0gU1RZTEVfQVRUUikge1xuICAgIHJldHVybiBgJHthdHRyVmFsdWUxfSAke2F0dHJWYWx1ZTJ9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYXR0clZhbHVlMjtcbiAgfVxufVxuXG5mdW5jdGlvbiBjYWxsQ2hlY2tTdG10KG5vZGVJbmRleDogbnVtYmVyLCBleHByczogby5FeHByZXNzaW9uW10pOiBvLkV4cHJlc3Npb24ge1xuICBpZiAoZXhwcnMubGVuZ3RoID4gMTApIHtcbiAgICByZXR1cm4gQ0hFQ0tfVkFSLmNhbGxGbihcbiAgICAgICAgW1ZJRVdfVkFSLCBvLmxpdGVyYWwobm9kZUluZGV4KSwgby5saXRlcmFsKEFyZ3VtZW50VHlwZS5EeW5hbWljKSwgby5saXRlcmFsQXJyKGV4cHJzKV0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBDSEVDS19WQVIuY2FsbEZuKFxuICAgICAgICBbVklFV19WQVIsIG8ubGl0ZXJhbChub2RlSW5kZXgpLCBvLmxpdGVyYWwoQXJndW1lbnRUeXBlLklubGluZSksIC4uLmV4cHJzXSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsbFVud3JhcFZhbHVlKG5vZGVJbmRleDogbnVtYmVyLCBiaW5kaW5nSWR4OiBudW1iZXIsIGV4cHI6IG8uRXhwcmVzc2lvbik6IG8uRXhwcmVzc2lvbiB7XG4gIHJldHVybiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMudW53cmFwVmFsdWUpLmNhbGxGbihbXG4gICAgVklFV19WQVIsIG8ubGl0ZXJhbChub2RlSW5kZXgpLCBvLmxpdGVyYWwoYmluZGluZ0lkeCksIGV4cHJcbiAgXSk7XG59XG5cbmZ1bmN0aW9uIGVsZW1lbnRFdmVudE5hbWVBbmRUYXJnZXQoXG4gICAgZXZlbnRBc3Q6IEJvdW5kRXZlbnRBc3QsIGRpckFzdDogRGlyZWN0aXZlQXN0fG51bGwpOiB7bmFtZTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZ3xudWxsfSB7XG4gIGlmIChldmVudEFzdC5pc0FuaW1hdGlvbikge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBgQCR7ZXZlbnRBc3QubmFtZX0uJHtldmVudEFzdC5waGFzZX1gLFxuICAgICAgdGFyZ2V0OiBkaXJBc3QgJiYgZGlyQXN0LmRpcmVjdGl2ZS5pc0NvbXBvbmVudCA/ICdjb21wb25lbnQnIDogbnVsbFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGV2ZW50QXN0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGNhbGNRdWVyeUZsYWdzKHF1ZXJ5OiBDb21waWxlUXVlcnlNZXRhZGF0YSkge1xuICBsZXQgZmxhZ3MgPSBOb2RlRmxhZ3MuTm9uZTtcbiAgLy8gTm90ZTogV2Ugb25seSBtYWtlIHF1ZXJpZXMgc3RhdGljIHRoYXQgcXVlcnkgZm9yIGEgc2luZ2xlIGl0ZW0gYW5kIHRoZSB1c2VyIHNwZWNpZmljYWxseVxuICAvLyBzZXQgdGhlIHRvIGJlIHN0YXRpYy4gVGhpcyBpcyBiZWNhdXNlIG9mIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggdGhlIG9sZCB2aWV3IGNvbXBpbGVyLi4uXG4gIGlmIChxdWVyeS5maXJzdCAmJiBxdWVyeS5zdGF0aWMpIHtcbiAgICBmbGFncyB8PSBOb2RlRmxhZ3MuU3RhdGljUXVlcnk7XG4gIH0gZWxzZSB7XG4gICAgZmxhZ3MgfD0gTm9kZUZsYWdzLkR5bmFtaWNRdWVyeTtcbiAgfVxuICBpZiAocXVlcnkuZW1pdERpc3RpbmN0Q2hhbmdlc09ubHkpIHtcbiAgICBmbGFncyB8PSBOb2RlRmxhZ3MuRW1pdERpc3RpbmN0Q2hhbmdlc09ubHk7XG4gIH1cbiAgcmV0dXJuIGZsYWdzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZWxlbWVudEV2ZW50RnVsbE5hbWUodGFyZ2V0OiBzdHJpbmd8bnVsbCwgbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRhcmdldCA/IGAke3RhcmdldH06JHtuYW1lfWAgOiBuYW1lO1xufVxuIl19