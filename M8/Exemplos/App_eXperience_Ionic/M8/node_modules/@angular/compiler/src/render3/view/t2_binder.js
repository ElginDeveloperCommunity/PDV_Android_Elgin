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
        define("@angular/compiler/src/render3/view/t2_binder", ["require", "exports", "tslib", "@angular/compiler/src/expression_parser/ast", "@angular/compiler/src/render3/r3_ast", "@angular/compiler/src/render3/view/template", "@angular/compiler/src/render3/view/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.R3BoundTarget = exports.R3TargetBinder = void 0;
    var tslib_1 = require("tslib");
    var ast_1 = require("@angular/compiler/src/expression_parser/ast");
    var r3_ast_1 = require("@angular/compiler/src/render3/r3_ast");
    var template_1 = require("@angular/compiler/src/render3/view/template");
    var util_1 = require("@angular/compiler/src/render3/view/util");
    /**
     * Processes `Target`s with a given set of directives and performs a binding operation, which
     * returns an object similar to TypeScript's `ts.TypeChecker` that contains knowledge about the
     * target.
     */
    var R3TargetBinder = /** @class */ (function () {
        function R3TargetBinder(directiveMatcher) {
            this.directiveMatcher = directiveMatcher;
        }
        /**
         * Perform a binding operation on the given `Target` and return a `BoundTarget` which contains
         * metadata about the types referenced in the template.
         */
        R3TargetBinder.prototype.bind = function (target) {
            if (!target.template) {
                // TODO(alxhub): handle targets which contain things like HostBindings, etc.
                throw new Error('Binding without a template not yet supported');
            }
            // First, parse the template into a `Scope` structure. This operation captures the syntactic
            // scopes in the template and makes them available for later use.
            var scope = Scope.apply(target.template);
            // Use the `Scope` to extract the entities present at every level of the template.
            var templateEntities = extractTemplateEntities(scope);
            // Next, perform directive matching on the template using the `DirectiveBinder`. This returns:
            //   - directives: Map of nodes (elements & ng-templates) to the directives on them.
            //   - bindings: Map of inputs, outputs, and attributes to the directive/element that claims
            //     them. TODO(alxhub): handle multiple directives claiming an input/output/etc.
            //   - references: Map of #references to their targets.
            var _a = DirectiveBinder.apply(target.template, this.directiveMatcher), directives = _a.directives, bindings = _a.bindings, references = _a.references;
            // Finally, run the TemplateBinder to bind references, variables, and other entities within the
            // template. This extracts all the metadata that doesn't depend on directive matching.
            var _b = TemplateBinder.applyWithScope(target.template, scope), expressions = _b.expressions, symbols = _b.symbols, nestingLevel = _b.nestingLevel, usedPipes = _b.usedPipes;
            return new R3BoundTarget(target, directives, bindings, references, expressions, symbols, nestingLevel, templateEntities, usedPipes);
        };
        return R3TargetBinder;
    }());
    exports.R3TargetBinder = R3TargetBinder;
    /**
     * Represents a binding scope within a template.
     *
     * Any variables, references, or other named entities declared within the template will
     * be captured and available by name in `namedEntities`. Additionally, child templates will
     * be analyzed and have their child `Scope`s available in `childScopes`.
     */
    var Scope = /** @class */ (function () {
        function Scope(parentScope, template) {
            this.parentScope = parentScope;
            this.template = template;
            /**
             * Named members of the `Scope`, such as `Reference`s or `Variable`s.
             */
            this.namedEntities = new Map();
            /**
             * Child `Scope`s for immediately nested `Template`s.
             */
            this.childScopes = new Map();
        }
        Scope.newRootScope = function () {
            return new Scope(null, null);
        };
        /**
         * Process a template (either as a `Template` sub-template with variables, or a plain array of
         * template `Node`s) and construct its `Scope`.
         */
        Scope.apply = function (template) {
            var scope = Scope.newRootScope();
            scope.ingest(template);
            return scope;
        };
        /**
         * Internal method to process the template and populate the `Scope`.
         */
        Scope.prototype.ingest = function (template) {
            var _this = this;
            if (template instanceof r3_ast_1.Template) {
                // Variables on an <ng-template> are defined in the inner scope.
                template.variables.forEach(function (node) { return _this.visitVariable(node); });
                // Process the nodes of the template.
                template.children.forEach(function (node) { return node.visit(_this); });
            }
            else {
                // No overarching `Template` instance, so process the nodes directly.
                template.forEach(function (node) { return node.visit(_this); });
            }
        };
        Scope.prototype.visitElement = function (element) {
            var _this = this;
            // `Element`s in the template may have `Reference`s which are captured in the scope.
            element.references.forEach(function (node) { return _this.visitReference(node); });
            // Recurse into the `Element`'s children.
            element.children.forEach(function (node) { return node.visit(_this); });
        };
        Scope.prototype.visitTemplate = function (template) {
            var _this = this;
            // References on a <ng-template> are defined in the outer scope, so capture them before
            // processing the template's child scope.
            template.references.forEach(function (node) { return _this.visitReference(node); });
            // Next, create an inner scope and process the template within it.
            var scope = new Scope(this, template);
            scope.ingest(template);
            this.childScopes.set(template, scope);
        };
        Scope.prototype.visitVariable = function (variable) {
            // Declare the variable if it's not already.
            this.maybeDeclare(variable);
        };
        Scope.prototype.visitReference = function (reference) {
            // Declare the variable if it's not already.
            this.maybeDeclare(reference);
        };
        // Unused visitors.
        Scope.prototype.visitContent = function (content) { };
        Scope.prototype.visitBoundAttribute = function (attr) { };
        Scope.prototype.visitBoundEvent = function (event) { };
        Scope.prototype.visitBoundText = function (text) { };
        Scope.prototype.visitText = function (text) { };
        Scope.prototype.visitTextAttribute = function (attr) { };
        Scope.prototype.visitIcu = function (icu) { };
        Scope.prototype.maybeDeclare = function (thing) {
            // Declare something with a name, as long as that name isn't taken.
            if (!this.namedEntities.has(thing.name)) {
                this.namedEntities.set(thing.name, thing);
            }
        };
        /**
         * Look up a variable within this `Scope`.
         *
         * This can recurse into a parent `Scope` if it's available.
         */
        Scope.prototype.lookup = function (name) {
            if (this.namedEntities.has(name)) {
                // Found in the local scope.
                return this.namedEntities.get(name);
            }
            else if (this.parentScope !== null) {
                // Not in the local scope, but there's a parent scope so check there.
                return this.parentScope.lookup(name);
            }
            else {
                // At the top level and it wasn't found.
                return null;
            }
        };
        /**
         * Get the child scope for a `Template`.
         *
         * This should always be defined.
         */
        Scope.prototype.getChildScope = function (template) {
            var res = this.childScopes.get(template);
            if (res === undefined) {
                throw new Error("Assertion error: child scope for " + template + " not found");
            }
            return res;
        };
        return Scope;
    }());
    /**
     * Processes a template and matches directives on nodes (elements and templates).
     *
     * Usually used via the static `apply()` method.
     */
    var DirectiveBinder = /** @class */ (function () {
        function DirectiveBinder(matcher, directives, bindings, references) {
            this.matcher = matcher;
            this.directives = directives;
            this.bindings = bindings;
            this.references = references;
        }
        /**
         * Process a template (list of `Node`s) and perform directive matching against each node.
         *
         * @param template the list of template `Node`s to match (recursively).
         * @param selectorMatcher a `SelectorMatcher` containing the directives that are in scope for
         * this template.
         * @returns three maps which contain information about directives in the template: the
         * `directives` map which lists directives matched on each node, the `bindings` map which
         * indicates which directives claimed which bindings (inputs, outputs, etc), and the `references`
         * map which resolves #references (`Reference`s) within the template to the named directive or
         * template node.
         */
        DirectiveBinder.apply = function (template, selectorMatcher) {
            var directives = new Map();
            var bindings = new Map();
            var references = new Map();
            var matcher = new DirectiveBinder(selectorMatcher, directives, bindings, references);
            matcher.ingest(template);
            return { directives: directives, bindings: bindings, references: references };
        };
        DirectiveBinder.prototype.ingest = function (template) {
            var _this = this;
            template.forEach(function (node) { return node.visit(_this); });
        };
        DirectiveBinder.prototype.visitElement = function (element) {
            this.visitElementOrTemplate(element.name, element);
        };
        DirectiveBinder.prototype.visitTemplate = function (template) {
            this.visitElementOrTemplate('ng-template', template);
        };
        DirectiveBinder.prototype.visitElementOrTemplate = function (elementName, node) {
            var _this = this;
            // First, determine the HTML shape of the node for the purpose of directive matching.
            // Do this by building up a `CssSelector` for the node.
            var cssSelector = template_1.createCssSelector(elementName, util_1.getAttrsForDirectiveMatching(node));
            // Next, use the `SelectorMatcher` to get the list of directives on the node.
            var directives = [];
            this.matcher.match(cssSelector, function (_, directive) { return directives.push(directive); });
            if (directives.length > 0) {
                this.directives.set(node, directives);
            }
            // Resolve any references that are created on this node.
            node.references.forEach(function (ref) {
                var dirTarget = null;
                // If the reference expression is empty, then it matches the "primary" directive on the node
                // (if there is one). Otherwise it matches the host node itself (either an element or
                // <ng-template> node).
                if (ref.value.trim() === '') {
                    // This could be a reference to a component if there is one.
                    dirTarget = directives.find(function (dir) { return dir.isComponent; }) || null;
                }
                else {
                    // This should be a reference to a directive exported via exportAs.
                    dirTarget =
                        directives.find(function (dir) { return dir.exportAs !== null && dir.exportAs.some(function (value) { return value === ref.value; }); }) ||
                            null;
                    // Check if a matching directive was found.
                    if (dirTarget === null) {
                        // No matching directive was found - this reference points to an unknown target. Leave it
                        // unmapped.
                        return;
                    }
                }
                if (dirTarget !== null) {
                    // This reference points to a directive.
                    _this.references.set(ref, { directive: dirTarget, node: node });
                }
                else {
                    // This reference points to the node itself.
                    _this.references.set(ref, node);
                }
            });
            var setAttributeBinding = function (attribute, ioType) {
                var dir = directives.find(function (dir) { return dir[ioType].hasBindingPropertyName(attribute.name); });
                var binding = dir !== undefined ? dir : node;
                _this.bindings.set(attribute, binding);
            };
            // Node inputs (bound attributes) and text attributes can be bound to an
            // input on a directive.
            node.inputs.forEach(function (input) { return setAttributeBinding(input, 'inputs'); });
            node.attributes.forEach(function (attr) { return setAttributeBinding(attr, 'inputs'); });
            if (node instanceof r3_ast_1.Template) {
                node.templateAttrs.forEach(function (attr) { return setAttributeBinding(attr, 'inputs'); });
            }
            // Node outputs (bound events) can be bound to an output on a directive.
            node.outputs.forEach(function (output) { return setAttributeBinding(output, 'outputs'); });
            // Recurse into the node's children.
            node.children.forEach(function (child) { return child.visit(_this); });
        };
        // Unused visitors.
        DirectiveBinder.prototype.visitContent = function (content) { };
        DirectiveBinder.prototype.visitVariable = function (variable) { };
        DirectiveBinder.prototype.visitReference = function (reference) { };
        DirectiveBinder.prototype.visitTextAttribute = function (attribute) { };
        DirectiveBinder.prototype.visitBoundAttribute = function (attribute) { };
        DirectiveBinder.prototype.visitBoundEvent = function (attribute) { };
        DirectiveBinder.prototype.visitBoundAttributeOrEvent = function (node) { };
        DirectiveBinder.prototype.visitText = function (text) { };
        DirectiveBinder.prototype.visitBoundText = function (text) { };
        DirectiveBinder.prototype.visitIcu = function (icu) { };
        return DirectiveBinder;
    }());
    /**
     * Processes a template and extract metadata about expressions and symbols within.
     *
     * This is a companion to the `DirectiveBinder` that doesn't require knowledge of directives matched
     * within the template in order to operate.
     *
     * Expressions are visited by the superclass `RecursiveAstVisitor`, with custom logic provided
     * by overridden methods from that visitor.
     */
    var TemplateBinder = /** @class */ (function (_super) {
        tslib_1.__extends(TemplateBinder, _super);
        function TemplateBinder(bindings, symbols, usedPipes, nestingLevel, scope, template, level) {
            var _this = _super.call(this) || this;
            _this.bindings = bindings;
            _this.symbols = symbols;
            _this.usedPipes = usedPipes;
            _this.nestingLevel = nestingLevel;
            _this.scope = scope;
            _this.template = template;
            _this.level = level;
            _this.pipesUsed = [];
            // Save a bit of processing time by constructing this closure in advance.
            _this.visitNode = function (node) { return node.visit(_this); };
            return _this;
        }
        // This method is defined to reconcile the type of TemplateBinder since both
        // RecursiveAstVisitor and Visitor define the visit() method in their
        // interfaces.
        TemplateBinder.prototype.visit = function (node, context) {
            if (node instanceof ast_1.AST) {
                node.visit(this, context);
            }
            else {
                node.visit(this);
            }
        };
        /**
         * Process a template and extract metadata about expressions and symbols within.
         *
         * @param template the nodes of the template to process
         * @param scope the `Scope` of the template being processed.
         * @returns three maps which contain metadata about the template: `expressions` which interprets
         * special `AST` nodes in expressions as pointing to references or variables declared within the
         * template, `symbols` which maps those variables and references to the nested `Template` which
         * declares them, if any, and `nestingLevel` which associates each `Template` with a integer
         * nesting level (how many levels deep within the template structure the `Template` is), starting
         * at 1.
         */
        TemplateBinder.applyWithScope = function (template, scope) {
            var expressions = new Map();
            var symbols = new Map();
            var nestingLevel = new Map();
            var usedPipes = new Set();
            // The top-level template has nesting level 0.
            var binder = new TemplateBinder(expressions, symbols, usedPipes, nestingLevel, scope, template instanceof r3_ast_1.Template ? template : null, 0);
            binder.ingest(template);
            return { expressions: expressions, symbols: symbols, nestingLevel: nestingLevel, usedPipes: usedPipes };
        };
        TemplateBinder.prototype.ingest = function (template) {
            if (template instanceof r3_ast_1.Template) {
                // For <ng-template>s, process only variables and child nodes. Inputs, outputs, templateAttrs,
                // and references were all processed in the scope of the containing template.
                template.variables.forEach(this.visitNode);
                template.children.forEach(this.visitNode);
                // Set the nesting level.
                this.nestingLevel.set(template, this.level);
            }
            else {
                // Visit each node from the top-level template.
                template.forEach(this.visitNode);
            }
        };
        TemplateBinder.prototype.visitElement = function (element) {
            // Visit the inputs, outputs, and children of the element.
            element.inputs.forEach(this.visitNode);
            element.outputs.forEach(this.visitNode);
            element.children.forEach(this.visitNode);
        };
        TemplateBinder.prototype.visitTemplate = function (template) {
            // First, visit inputs, outputs and template attributes of the template node.
            template.inputs.forEach(this.visitNode);
            template.outputs.forEach(this.visitNode);
            template.templateAttrs.forEach(this.visitNode);
            // References are also evaluated in the outer context.
            template.references.forEach(this.visitNode);
            // Next, recurse into the template using its scope, and bumping the nesting level up by one.
            var childScope = this.scope.getChildScope(template);
            var binder = new TemplateBinder(this.bindings, this.symbols, this.usedPipes, this.nestingLevel, childScope, template, this.level + 1);
            binder.ingest(template);
        };
        TemplateBinder.prototype.visitVariable = function (variable) {
            // Register the `Variable` as a symbol in the current `Template`.
            if (this.template !== null) {
                this.symbols.set(variable, this.template);
            }
        };
        TemplateBinder.prototype.visitReference = function (reference) {
            // Register the `Reference` as a symbol in the current `Template`.
            if (this.template !== null) {
                this.symbols.set(reference, this.template);
            }
        };
        // Unused template visitors
        TemplateBinder.prototype.visitText = function (text) { };
        TemplateBinder.prototype.visitContent = function (content) { };
        TemplateBinder.prototype.visitTextAttribute = function (attribute) { };
        TemplateBinder.prototype.visitIcu = function (icu) {
            var _this = this;
            Object.keys(icu.vars).forEach(function (key) { return icu.vars[key].visit(_this); });
            Object.keys(icu.placeholders).forEach(function (key) { return icu.placeholders[key].visit(_this); });
        };
        // The remaining visitors are concerned with processing AST expressions within template bindings
        TemplateBinder.prototype.visitBoundAttribute = function (attribute) {
            attribute.value.visit(this);
        };
        TemplateBinder.prototype.visitBoundEvent = function (event) {
            event.handler.visit(this);
        };
        TemplateBinder.prototype.visitBoundText = function (text) {
            text.value.visit(this);
        };
        TemplateBinder.prototype.visitPipe = function (ast, context) {
            this.usedPipes.add(ast.name);
            return _super.prototype.visitPipe.call(this, ast, context);
        };
        // These five types of AST expressions can refer to expression roots, which could be variables
        // or references in the current scope.
        TemplateBinder.prototype.visitPropertyRead = function (ast, context) {
            this.maybeMap(context, ast, ast.name);
            return _super.prototype.visitPropertyRead.call(this, ast, context);
        };
        TemplateBinder.prototype.visitSafePropertyRead = function (ast, context) {
            this.maybeMap(context, ast, ast.name);
            return _super.prototype.visitSafePropertyRead.call(this, ast, context);
        };
        TemplateBinder.prototype.visitPropertyWrite = function (ast, context) {
            this.maybeMap(context, ast, ast.name);
            return _super.prototype.visitPropertyWrite.call(this, ast, context);
        };
        TemplateBinder.prototype.visitMethodCall = function (ast, context) {
            this.maybeMap(context, ast, ast.name);
            return _super.prototype.visitMethodCall.call(this, ast, context);
        };
        TemplateBinder.prototype.visitSafeMethodCall = function (ast, context) {
            this.maybeMap(context, ast, ast.name);
            return _super.prototype.visitSafeMethodCall.call(this, ast, context);
        };
        TemplateBinder.prototype.maybeMap = function (scope, ast, name) {
            // If the receiver of the expression isn't the `ImplicitReceiver`, this isn't the root of an
            // `AST` expression that maps to a `Variable` or `Reference`.
            if (!(ast.receiver instanceof ast_1.ImplicitReceiver)) {
                return;
            }
            // Check whether the name exists in the current scope. If so, map it. Otherwise, the name is
            // probably a property on the top-level component context.
            var target = this.scope.lookup(name);
            if (target !== null) {
                this.bindings.set(ast, target);
            }
        };
        return TemplateBinder;
    }(ast_1.RecursiveAstVisitor));
    /**
     * Metadata container for a `Target` that allows queries for specific bits of metadata.
     *
     * See `BoundTarget` for documentation on the individual methods.
     */
    var R3BoundTarget = /** @class */ (function () {
        function R3BoundTarget(target, directives, bindings, references, exprTargets, symbols, nestingLevel, templateEntities, usedPipes) {
            this.target = target;
            this.directives = directives;
            this.bindings = bindings;
            this.references = references;
            this.exprTargets = exprTargets;
            this.symbols = symbols;
            this.nestingLevel = nestingLevel;
            this.templateEntities = templateEntities;
            this.usedPipes = usedPipes;
        }
        R3BoundTarget.prototype.getEntitiesInTemplateScope = function (template) {
            var _a;
            return (_a = this.templateEntities.get(template)) !== null && _a !== void 0 ? _a : new Set();
        };
        R3BoundTarget.prototype.getDirectivesOfNode = function (node) {
            return this.directives.get(node) || null;
        };
        R3BoundTarget.prototype.getReferenceTarget = function (ref) {
            return this.references.get(ref) || null;
        };
        R3BoundTarget.prototype.getConsumerOfBinding = function (binding) {
            return this.bindings.get(binding) || null;
        };
        R3BoundTarget.prototype.getExpressionTarget = function (expr) {
            return this.exprTargets.get(expr) || null;
        };
        R3BoundTarget.prototype.getTemplateOfSymbol = function (symbol) {
            return this.symbols.get(symbol) || null;
        };
        R3BoundTarget.prototype.getNestingLevel = function (template) {
            return this.nestingLevel.get(template) || 0;
        };
        R3BoundTarget.prototype.getUsedDirectives = function () {
            var set = new Set();
            this.directives.forEach(function (dirs) { return dirs.forEach(function (dir) { return set.add(dir); }); });
            return Array.from(set.values());
        };
        R3BoundTarget.prototype.getUsedPipes = function () {
            return Array.from(this.usedPipes);
        };
        return R3BoundTarget;
    }());
    exports.R3BoundTarget = R3BoundTarget;
    function extractTemplateEntities(rootScope) {
        var e_1, _a, e_2, _b;
        var entityMap = new Map();
        function extractScopeEntities(scope) {
            if (entityMap.has(scope.template)) {
                return entityMap.get(scope.template);
            }
            var currentEntities = scope.namedEntities;
            var templateEntities;
            if (scope.parentScope !== null) {
                templateEntities = new Map(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(extractScopeEntities(scope.parentScope))), tslib_1.__read(currentEntities)));
            }
            else {
                templateEntities = new Map(currentEntities);
            }
            entityMap.set(scope.template, templateEntities);
            return templateEntities;
        }
        var scopesToProcess = [rootScope];
        while (scopesToProcess.length > 0) {
            var scope = scopesToProcess.pop();
            try {
                for (var _c = (e_1 = void 0, tslib_1.__values(scope.childScopes.values())), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var childScope = _d.value;
                    scopesToProcess.push(childScope);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            extractScopeEntities(scope);
        }
        var templateEntities = new Map();
        try {
            for (var entityMap_1 = tslib_1.__values(entityMap), entityMap_1_1 = entityMap_1.next(); !entityMap_1_1.done; entityMap_1_1 = entityMap_1.next()) {
                var _e = tslib_1.__read(entityMap_1_1.value, 2), template = _e[0], entities = _e[1];
                templateEntities.set(template, new Set(entities.values()));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (entityMap_1_1 && !entityMap_1_1.done && (_b = entityMap_1.return)) _b.call(entityMap_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return templateEntities;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidDJfYmluZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3JlbmRlcjMvdmlldy90Ml9iaW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUVILG1FQUErSztJQUUvSywrREFBMEo7SUFHMUosd0VBQTZDO0lBQzdDLGdFQUFvRDtJQUdwRDs7OztPQUlHO0lBQ0g7UUFDRSx3QkFBb0IsZ0JBQTZDO1lBQTdDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBNkI7UUFBRyxDQUFDO1FBRXJFOzs7V0FHRztRQUNILDZCQUFJLEdBQUosVUFBSyxNQUFjO1lBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUNwQiw0RUFBNEU7Z0JBQzVFLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQzthQUNqRTtZQUVELDRGQUE0RjtZQUM1RixpRUFBaUU7WUFDakUsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFHM0Msa0ZBQWtGO1lBQ2xGLElBQU0sZ0JBQWdCLEdBQUcsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFeEQsOEZBQThGO1lBQzlGLG9GQUFvRjtZQUNwRiw0RkFBNEY7WUFDNUYsbUZBQW1GO1lBQ25GLHVEQUF1RDtZQUNqRCxJQUFBLEtBQ0YsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUQxRCxVQUFVLGdCQUFBLEVBQUUsUUFBUSxjQUFBLEVBQUUsVUFBVSxnQkFDMEIsQ0FBQztZQUNsRSwrRkFBK0Y7WUFDL0Ysc0ZBQXNGO1lBQ2hGLElBQUEsS0FDRixjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFD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QVEsUUFBQTtnQkFDNUIsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzVEOzs7Ozs7Ozs7UUFDRCxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBU1QsIEJpbmRpbmdQaXBlLCBJbXBsaWNpdFJlY2VpdmVyLCBNZXRob2RDYWxsLCBQcm9wZXJ0eVJlYWQsIFByb3BlcnR5V3JpdGUsIFJlY3Vyc2l2ZUFzdFZpc2l0b3IsIFNhZmVNZXRob2RDYWxsLCBTYWZlUHJvcGVydHlSZWFkfSBmcm9tICcuLi8uLi9leHByZXNzaW9uX3BhcnNlci9hc3QnO1xuaW1wb3J0IHtTZWxlY3Rvck1hdGNoZXJ9IGZyb20gJy4uLy4uL3NlbGVjdG9yJztcbmltcG9ydCB7Qm91bmRBdHRyaWJ1dGUsIEJvdW5kRXZlbnQsIEJvdW5kVGV4dCwgQ29udGVudCwgRWxlbWVudCwgSWN1LCBOb2RlLCBSZWZlcmVuY2UsIFRlbXBsYXRlLCBUZXh0LCBUZXh0QXR0cmlidXRlLCBWYXJpYWJsZSwgVmlzaXRvcn0gZnJvbSAnLi4vcjNfYXN0JztcblxuaW1wb3J0IHtCb3VuZFRhcmdldCwgRGlyZWN0aXZlTWV0YSwgVGFyZ2V0LCBUYXJnZXRCaW5kZXJ9IGZyb20gJy4vdDJfYXBpJztcbmltcG9ydCB7Y3JlYXRlQ3NzU2VsZWN0b3J9IGZyb20gJy4vdGVtcGxhdGUnO1xuaW1wb3J0IHtnZXRBdHRyc0ZvckRpcmVjdGl2ZU1hdGNoaW5nfSBmcm9tICcuL3V0aWwnO1xuXG5cbi8qKlxuICogUHJvY2Vzc2VzIGBUYXJnZXRgcyB3aXRoIGEgZ2l2ZW4gc2V0IG9mIGRpcmVjdGl2ZXMgYW5kIHBlcmZvcm1zIGEgYmluZGluZyBvcGVyYXRpb24sIHdoaWNoXG4gKiByZXR1cm5zIGFuIG9iamVjdCBzaW1pbGFyIHRvIFR5cGVTY3JpcHQncyBgdHMuVHlwZUNoZWNrZXJgIHRoYXQgY29udGFpbnMga25vd2xlZGdlIGFib3V0IHRoZVxuICogdGFyZ2V0LlxuICovXG5leHBvcnQgY2xhc3MgUjNUYXJnZXRCaW5kZXI8RGlyZWN0aXZlVCBleHRlbmRzIERpcmVjdGl2ZU1ldGE+IGltcGxlbWVudHMgVGFyZ2V0QmluZGVyPERpcmVjdGl2ZVQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkaXJlY3RpdmVNYXRjaGVyOiBTZWxlY3Rvck1hdGNoZXI8RGlyZWN0aXZlVD4pIHt9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gYSBiaW5kaW5nIG9wZXJhdGlvbiBvbiB0aGUgZ2l2ZW4gYFRhcmdldGAgYW5kIHJldHVybiBhIGBCb3VuZFRhcmdldGAgd2hpY2ggY29udGFpbnNcbiAgICogbWV0YWRhdGEgYWJvdXQgdGhlIHR5cGVzIHJlZmVyZW5jZWQgaW4gdGhlIHRlbXBsYXRlLlxuICAgKi9cbiAgYmluZCh0YXJnZXQ6IFRhcmdldCk6IEJvdW5kVGFyZ2V0PERpcmVjdGl2ZVQ+IHtcbiAgICBpZiAoIXRhcmdldC50ZW1wbGF0ZSkge1xuICAgICAgLy8gVE9ETyhhbHhodWIpOiBoYW5kbGUgdGFyZ2V0cyB3aGljaCBjb250YWluIHRoaW5ncyBsaWtlIEhvc3RCaW5kaW5ncywgZXRjLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCaW5kaW5nIHdpdGhvdXQgYSB0ZW1wbGF0ZSBub3QgeWV0IHN1cHBvcnRlZCcpO1xuICAgIH1cblxuICAgIC8vIEZpcnN0LCBwYXJzZSB0aGUgdGVtcGxhdGUgaW50byBhIGBTY29wZWAgc3RydWN0dXJlLiBUaGlzIG9wZXJhdGlvbiBjYXB0dXJlcyB0aGUgc3ludGFjdGljXG4gICAgLy8gc2NvcGVzIGluIHRoZSB0ZW1wbGF0ZSBhbmQgbWFrZXMgdGhlbSBhdmFpbGFibGUgZm9yIGxhdGVyIHVzZS5cbiAgICBjb25zdCBzY29wZSA9IFNjb3BlLmFwcGx5KHRhcmdldC50ZW1wbGF0ZSk7XG5cblxuICAgIC8vIFVzZSB0aGUgYFNjb3BlYCB0byBleHRyYWN0IHRoZSBlbnRpdGllcyBwcmVzZW50IGF0IGV2ZXJ5IGxldmVsIG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICBjb25zdCB0ZW1wbGF0ZUVudGl0aWVzID0gZXh0cmFjdFRlbXBsYXRlRW50aXRpZXMoc2NvcGUpO1xuXG4gICAgLy8gTmV4dCwgcGVyZm9ybSBkaXJlY3RpdmUgbWF0Y2hpbmcgb24gdGhlIHRlbXBsYXRlIHVzaW5nIHRoZSBgRGlyZWN0aXZlQmluZGVyYC4gVGhpcyByZXR1cm5zOlxuICAgIC8vICAgLSBkaXJlY3RpdmVzOiBNYXAgb2Ygbm9kZXMgKGVsZW1lbnRzICYgbmctdGVtcGxhdGVzKSB0byB0aGUgZGlyZWN0aXZlcyBvbiB0aGVtLlxuICAgIC8vICAgLSBiaW5kaW5nczogTWFwIG9mIGlucHV0cywgb3V0cHV0cywgYW5kIGF0dHJpYnV0ZXMgdG8gdGhlIGRpcmVjdGl2ZS9lbGVtZW50IHRoYXQgY2xhaW1zXG4gICAgLy8gICAgIHRoZW0uIFRPRE8oYWx4aHViKTogaGFuZGxlIG11bHRpcGxlIGRpcmVjdGl2ZXMgY2xhaW1pbmcgYW4gaW5wdXQvb3V0cHV0L2V0Yy5cbiAgICAvLyAgIC0gcmVmZXJlbmNlczogTWFwIG9mICNyZWZlcmVuY2VzIHRvIHRoZWlyIHRhcmdldHMuXG4gICAgY29uc3Qge2RpcmVjdGl2ZXMsIGJpbmRpbmdzLCByZWZlcmVuY2VzfSA9XG4gICAgICAgIERpcmVjdGl2ZUJpbmRlci5hcHBseSh0YXJnZXQudGVtcGxhdGUsIHRoaXMuZGlyZWN0aXZlTWF0Y2hlcik7XG4gICAgLy8gRmluYWxseSwgcnVuIHRoZSBUZW1wbGF0ZUJpbmRlciB0byBiaW5kIHJlZmVyZW5jZXMsIHZhcmlhYmxlcywgYW5kIG90aGVyIGVudGl0aWVzIHdpdGhpbiB0aGVcbiAgICAvLyB0ZW1wbGF0ZS4gVGhpcyBleHRyYWN0cyBhbGwgdGhlIG1ldGFkYXRhIHRoYXQgZG9lc24ndCBkZXBlbmQgb24gZGlyZWN0aXZlIG1hdGNoaW5nLlxuICAgIGNvbnN0IHtleHByZXNzaW9ucywgc3ltYm9scywgbmVzdGluZ0xldmVsLCB1c2VkUGlwZXN9ID1cbiAgICAgICAgVGVtcGxhdGVCaW5kZXIuYXBwbHlXaXRoU2NvcGUodGFyZ2V0LnRlbXBsYXRlLCBzY29wZSk7XG4gICAgcmV0dXJuIG5ldyBSM0JvdW5kVGFyZ2V0KFxuICAgICAgICB0YXJnZXQsIGRpcmVjdGl2ZXMsIGJpbmRpbmdzLCByZWZlcmVuY2VzLCBleHByZXNzaW9ucywgc3ltYm9scywgbmVzdGluZ0xldmVsLFxuICAgICAgICB0ZW1wbGF0ZUVudGl0aWVzLCB1c2VkUGlwZXMpO1xuICB9XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGJpbmRpbmcgc2NvcGUgd2l0aGluIGEgdGVtcGxhdGUuXG4gKlxuICogQW55IHZhcmlhYmxlcywgcmVmZXJlbmNlcywgb3Igb3RoZXIgbmFtZWQgZW50aXRpZXMgZGVjbGFyZWQgd2l0aGluIHRoZSB0ZW1wbGF0ZSB3aWxsXG4gKiBiZSBjYXB0dXJlZCBhbmQgYXZhaWxhYmxlIGJ5IG5hbWUgaW4gYG5hbWVkRW50aXRpZXNgLiBBZGRpdGlvbmFsbHksIGNoaWxkIHRlbXBsYXRlcyB3aWxsXG4gKiBiZSBhbmFseXplZCBhbmQgaGF2ZSB0aGVpciBjaGlsZCBgU2NvcGVgcyBhdmFpbGFibGUgaW4gYGNoaWxkU2NvcGVzYC5cbiAqL1xuY2xhc3MgU2NvcGUgaW1wbGVtZW50cyBWaXNpdG9yIHtcbiAgLyoqXG4gICAqIE5hbWVkIG1lbWJlcnMgb2YgdGhlIGBTY29wZWAsIHN1Y2ggYXMgYFJlZmVyZW5jZWBzIG9yIGBWYXJpYWJsZWBzLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZWRFbnRpdGllcyA9IG5ldyBNYXA8c3RyaW5nLCBSZWZlcmVuY2V8VmFyaWFibGU+KCk7XG5cbiAgLyoqXG4gICAqIENoaWxkIGBTY29wZWBzIGZvciBpbW1lZGlhdGVseSBuZXN0ZWQgYFRlbXBsYXRlYHMuXG4gICAqL1xuICByZWFkb25seSBjaGlsZFNjb3BlcyA9IG5ldyBNYXA8VGVtcGxhdGUsIFNjb3BlPigpO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocmVhZG9ubHkgcGFyZW50U2NvcGU6IFNjb3BlfG51bGwsIHJlYWRvbmx5IHRlbXBsYXRlOiBUZW1wbGF0ZXxudWxsKSB7fVxuXG4gIHN0YXRpYyBuZXdSb290U2NvcGUoKTogU2NvcGUge1xuICAgIHJldHVybiBuZXcgU2NvcGUobnVsbCwgbnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogUHJvY2VzcyBhIHRlbXBsYXRlIChlaXRoZXIgYXMgYSBgVGVtcGxhdGVgIHN1Yi10ZW1wbGF0ZSB3aXRoIHZhcmlhYmxlcywgb3IgYSBwbGFpbiBhcnJheSBvZlxuICAgKiB0ZW1wbGF0ZSBgTm9kZWBzKSBhbmQgY29uc3RydWN0IGl0cyBgU2NvcGVgLlxuICAgKi9cbiAgc3RhdGljIGFwcGx5KHRlbXBsYXRlOiBOb2RlW10pOiBTY29wZSB7XG4gICAgY29uc3Qgc2NvcGUgPSBTY29wZS5uZXdSb290U2NvcGUoKTtcbiAgICBzY29wZS5pbmdlc3QodGVtcGxhdGUpO1xuICAgIHJldHVybiBzY29wZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBtZXRob2QgdG8gcHJvY2VzcyB0aGUgdGVtcGxhdGUgYW5kIHBvcHVsYXRlIHRoZSBgU2NvcGVgLlxuICAgKi9cbiAgcHJpdmF0ZSBpbmdlc3QodGVtcGxhdGU6IFRlbXBsYXRlfE5vZGVbXSk6IHZvaWQge1xuICAgIGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIFRlbXBsYXRlKSB7XG4gICAgICAvLyBWYXJpYWJsZXMgb24gYW4gPG5nLXRlbXBsYXRlPiBhcmUgZGVmaW5lZCBpbiB0aGUgaW5uZXIgc2NvcGUuXG4gICAgICB0ZW1wbGF0ZS52YXJpYWJsZXMuZm9yRWFjaChub2RlID0+IHRoaXMudmlzaXRWYXJpYWJsZShub2RlKSk7XG5cbiAgICAgIC8vIFByb2Nlc3MgdGhlIG5vZGVzIG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICAgIHRlbXBsYXRlLmNoaWxkcmVuLmZvckVhY2gobm9kZSA9PiBub2RlLnZpc2l0KHRoaXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gb3ZlcmFyY2hpbmcgYFRlbXBsYXRlYCBpbnN0YW5jZSwgc28gcHJvY2VzcyB0aGUgbm9kZXMgZGlyZWN0bHkuXG4gICAgICB0ZW1wbGF0ZS5mb3JFYWNoKG5vZGUgPT4gbm9kZS52aXNpdCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICAvLyBgRWxlbWVudGBzIGluIHRoZSB0ZW1wbGF0ZSBtYXkgaGF2ZSBgUmVmZXJlbmNlYHMgd2hpY2ggYXJlIGNhcHR1cmVkIGluIHRoZSBzY29wZS5cbiAgICBlbGVtZW50LnJlZmVyZW5jZXMuZm9yRWFjaChub2RlID0+IHRoaXMudmlzaXRSZWZlcmVuY2Uobm9kZSkpO1xuXG4gICAgLy8gUmVjdXJzZSBpbnRvIHRoZSBgRWxlbWVudGAncyBjaGlsZHJlbi5cbiAgICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2gobm9kZSA9PiBub2RlLnZpc2l0KHRoaXMpKTtcbiAgfVxuXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFRlbXBsYXRlKSB7XG4gICAgLy8gUmVmZXJlbmNlcyBvbiBhIDxuZy10ZW1wbGF0ZT4gYXJlIGRlZmluZWQgaW4gdGhlIG91dGVyIHNjb3BlLCBzbyBjYXB0dXJlIHRoZW0gYmVmb3JlXG4gICAgLy8gcHJvY2Vzc2luZyB0aGUgdGVtcGxhdGUncyBjaGlsZCBzY29wZS5cbiAgICB0ZW1wbGF0ZS5yZWZlcmVuY2VzLmZvckVhY2gobm9kZSA9PiB0aGlzLnZpc2l0UmVmZXJlbmNlKG5vZGUpKTtcblxuICAgIC8vIE5leHQsIGNyZWF0ZSBhbiBpbm5lciBzY29wZSBhbmQgcHJvY2VzcyB0aGUgdGVtcGxhdGUgd2l0aGluIGl0LlxuICAgIGNvbnN0IHNjb3BlID0gbmV3IFNjb3BlKHRoaXMsIHRlbXBsYXRlKTtcbiAgICBzY29wZS5pbmdlc3QodGVtcGxhdGUpO1xuICAgIHRoaXMuY2hpbGRTY29wZXMuc2V0KHRlbXBsYXRlLCBzY29wZSk7XG4gIH1cblxuICB2aXNpdFZhcmlhYmxlKHZhcmlhYmxlOiBWYXJpYWJsZSkge1xuICAgIC8vIERlY2xhcmUgdGhlIHZhcmlhYmxlIGlmIGl0J3Mgbm90IGFscmVhZHkuXG4gICAgdGhpcy5tYXliZURlY2xhcmUodmFyaWFibGUpO1xuICB9XG5cbiAgdmlzaXRSZWZlcmVuY2UocmVmZXJlbmNlOiBSZWZlcmVuY2UpIHtcbiAgICAvLyBEZWNsYXJlIHRoZSB2YXJpYWJsZSBpZiBpdCdzIG5vdCBhbHJlYWR5LlxuICAgIHRoaXMubWF5YmVEZWNsYXJlKHJlZmVyZW5jZSk7XG4gIH1cblxuICAvLyBVbnVzZWQgdmlzaXRvcnMuXG4gIHZpc2l0Q29udGVudChjb250ZW50OiBDb250ZW50KSB7fVxuICB2aXNpdEJvdW5kQXR0cmlidXRlKGF0dHI6IEJvdW5kQXR0cmlidXRlKSB7fVxuICB2aXNpdEJvdW5kRXZlbnQoZXZlbnQ6IEJvdW5kRXZlbnQpIHt9XG4gIHZpc2l0Qm91bmRUZXh0KHRleHQ6IEJvdW5kVGV4dCkge31cbiAgdmlzaXRUZXh0KHRleHQ6IFRleHQpIHt9XG4gIHZpc2l0VGV4dEF0dHJpYnV0ZShhdHRyOiBUZXh0QXR0cmlidXRlKSB7fVxuICB2aXNpdEljdShpY3U6IEljdSkge31cblxuICBwcml2YXRlIG1heWJlRGVjbGFyZSh0aGluZzogUmVmZXJlbmNlfFZhcmlhYmxlKSB7XG4gICAgLy8gRGVjbGFyZSBzb21ldGhpbmcgd2l0aCBhIG5hbWUsIGFzIGxvbmcgYXMgdGhhdCBuYW1lIGlzbid0IHRha2VuLlxuICAgIGlmICghdGhpcy5uYW1lZEVudGl0aWVzLmhhcyh0aGluZy5uYW1lKSkge1xuICAgICAgdGhpcy5uYW1lZEVudGl0aWVzLnNldCh0aGluZy5uYW1lLCB0aGluZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvb2sgdXAgYSB2YXJpYWJsZSB3aXRoaW4gdGhpcyBgU2NvcGVgLlxuICAgKlxuICAgKiBUaGlzIGNhbiByZWN1cnNlIGludG8gYSBwYXJlbnQgYFNjb3BlYCBpZiBpdCdzIGF2YWlsYWJsZS5cbiAgICovXG4gIGxvb2t1cChuYW1lOiBzdHJpbmcpOiBSZWZlcmVuY2V8VmFyaWFibGV8bnVsbCB7XG4gICAgaWYgKHRoaXMubmFtZWRFbnRpdGllcy5oYXMobmFtZSkpIHtcbiAgICAgIC8vIEZvdW5kIGluIHRoZSBsb2NhbCBzY29wZS5cbiAgICAgIHJldHVybiB0aGlzLm5hbWVkRW50aXRpZXMuZ2V0KG5hbWUpITtcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50U2NvcGUgIT09IG51bGwpIHtcbiAgICAgIC8vIE5vdCBpbiB0aGUgbG9jYWwgc2NvcGUsIGJ1dCB0aGVyZSdzIGEgcGFyZW50IHNjb3BlIHNvIGNoZWNrIHRoZXJlLlxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50U2NvcGUubG9va3VwKG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBdCB0aGUgdG9wIGxldmVsIGFuZCBpdCB3YXNuJ3QgZm91bmQuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjaGlsZCBzY29wZSBmb3IgYSBgVGVtcGxhdGVgLlxuICAgKlxuICAgKiBUaGlzIHNob3VsZCBhbHdheXMgYmUgZGVmaW5lZC5cbiAgICovXG4gIGdldENoaWxkU2NvcGUodGVtcGxhdGU6IFRlbXBsYXRlKTogU2NvcGUge1xuICAgIGNvbnN0IHJlcyA9IHRoaXMuY2hpbGRTY29wZXMuZ2V0KHRlbXBsYXRlKTtcbiAgICBpZiAocmVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXJ0aW9uIGVycm9yOiBjaGlsZCBzY29wZSBmb3IgJHt0ZW1wbGF0ZX0gbm90IGZvdW5kYCk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9jZXNzZXMgYSB0ZW1wbGF0ZSBhbmQgbWF0Y2hlcyBkaXJlY3RpdmVzIG9uIG5vZGVzIChlbGVtZW50cyBhbmQgdGVtcGxhdGVzKS5cbiAqXG4gKiBVc3VhbGx5IHVzZWQgdmlhIHRoZSBzdGF0aWMgYGFwcGx5KClgIG1ldGhvZC5cbiAqL1xuY2xhc3MgRGlyZWN0aXZlQmluZGVyPERpcmVjdGl2ZVQgZXh0ZW5kcyBEaXJlY3RpdmVNZXRhPiBpbXBsZW1lbnRzIFZpc2l0b3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgbWF0Y2hlcjogU2VsZWN0b3JNYXRjaGVyPERpcmVjdGl2ZVQ+LFxuICAgICAgcHJpdmF0ZSBkaXJlY3RpdmVzOiBNYXA8RWxlbWVudHxUZW1wbGF0ZSwgRGlyZWN0aXZlVFtdPixcbiAgICAgIHByaXZhdGUgYmluZGluZ3M6IE1hcDxCb3VuZEF0dHJpYnV0ZXxCb3VuZEV2ZW50fFRleHRBdHRyaWJ1dGUsIERpcmVjdGl2ZVR8RWxlbWVudHxUZW1wbGF0ZT4sXG4gICAgICBwcml2YXRlIHJlZmVyZW5jZXM6XG4gICAgICAgICAgTWFwPFJlZmVyZW5jZSwge2RpcmVjdGl2ZTogRGlyZWN0aXZlVCwgbm9kZTogRWxlbWVudHxUZW1wbGF0ZX18RWxlbWVudHxUZW1wbGF0ZT4pIHt9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3MgYSB0ZW1wbGF0ZSAobGlzdCBvZiBgTm9kZWBzKSBhbmQgcGVyZm9ybSBkaXJlY3RpdmUgbWF0Y2hpbmcgYWdhaW5zdCBlYWNoIG5vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB0ZW1wbGF0ZSB0aGUgbGlzdCBvZiB0ZW1wbGF0ZSBgTm9kZWBzIHRvIG1hdGNoIChyZWN1cnNpdmVseSkuXG4gICAqIEBwYXJhbSBzZWxlY3Rvck1hdGNoZXIgYSBgU2VsZWN0b3JNYXRjaGVyYCBjb250YWluaW5nIHRoZSBkaXJlY3RpdmVzIHRoYXQgYXJlIGluIHNjb3BlIGZvclxuICAgKiB0aGlzIHRlbXBsYXRlLlxuICAgKiBAcmV0dXJucyB0aHJlZSBtYXBzIHdoaWNoIGNvbnRhaW4gaW5mb3JtYXRpb24gYWJvdXQgZGlyZWN0aXZlcyBpbiB0aGUgdGVtcGxhdGU6IHRoZVxuICAgKiBgZGlyZWN0aXZlc2AgbWFwIHdoaWNoIGxpc3RzIGRpcmVjdGl2ZXMgbWF0Y2hlZCBvbiBlYWNoIG5vZGUsIHRoZSBgYmluZGluZ3NgIG1hcCB3aGljaFxuICAgKiBpbmRpY2F0ZXMgd2hpY2ggZGlyZWN0aXZlcyBjbGFpbWVkIHdoaWNoIGJpbmRpbmdzIChpbnB1dHMsIG91dHB1dHMsIGV0YyksIGFuZCB0aGUgYHJlZmVyZW5jZXNgXG4gICAqIG1hcCB3aGljaCByZXNvbHZlcyAjcmVmZXJlbmNlcyAoYFJlZmVyZW5jZWBzKSB3aXRoaW4gdGhlIHRlbXBsYXRlIHRvIHRoZSBuYW1lZCBkaXJlY3RpdmUgb3JcbiAgICogdGVtcGxhdGUgbm9kZS5cbiAgICovXG4gIHN0YXRpYyBhcHBseTxEaXJlY3RpdmVUIGV4dGVuZHMgRGlyZWN0aXZlTWV0YT4oXG4gICAgICB0ZW1wbGF0ZTogTm9kZVtdLCBzZWxlY3Rvck1hdGNoZXI6IFNlbGVjdG9yTWF0Y2hlcjxEaXJlY3RpdmVUPik6IHtcbiAgICBkaXJlY3RpdmVzOiBNYXA8RWxlbWVudHxUZW1wbGF0ZSwgRGlyZWN0aXZlVFtdPixcbiAgICBiaW5kaW5nczogTWFwPEJvdW5kQXR0cmlidXRlfEJvdW5kRXZlbnR8VGV4dEF0dHJpYnV0ZSwgRGlyZWN0aXZlVHxFbGVtZW50fFRlbXBsYXRlPixcbiAgICByZWZlcmVuY2VzOiBNYXA8UmVmZXJlbmNlLCB7ZGlyZWN0aXZlOiBEaXJlY3RpdmVULCBub2RlOiBFbGVtZW50fFRlbXBsYXRlfXxFbGVtZW50fFRlbXBsYXRlPixcbiAgfSB7XG4gICAgY29uc3QgZGlyZWN0aXZlcyA9IG5ldyBNYXA8RWxlbWVudHxUZW1wbGF0ZSwgRGlyZWN0aXZlVFtdPigpO1xuICAgIGNvbnN0IGJpbmRpbmdzID1cbiAgICAgICAgbmV3IE1hcDxCb3VuZEF0dHJpYnV0ZXxCb3VuZEV2ZW50fFRleHRBdHRyaWJ1dGUsIERpcmVjdGl2ZVR8RWxlbWVudHxUZW1wbGF0ZT4oKTtcbiAgICBjb25zdCByZWZlcmVuY2VzID1cbiAgICAgICAgbmV3IE1hcDxSZWZlcmVuY2UsIHtkaXJlY3RpdmU6IERpcmVjdGl2ZVQsIG5vZGU6IEVsZW1lbnQgfCBUZW1wbGF0ZX18RWxlbWVudHxUZW1wbGF0ZT4oKTtcbiAgICBjb25zdCBtYXRjaGVyID0gbmV3IERpcmVjdGl2ZUJpbmRlcihzZWxlY3Rvck1hdGNoZXIsIGRpcmVjdGl2ZXMsIGJpbmRpbmdzLCByZWZlcmVuY2VzKTtcbiAgICBtYXRjaGVyLmluZ2VzdCh0ZW1wbGF0ZSk7XG4gICAgcmV0dXJuIHtkaXJlY3RpdmVzLCBiaW5kaW5ncywgcmVmZXJlbmNlc307XG4gIH1cblxuICBwcml2YXRlIGluZ2VzdCh0ZW1wbGF0ZTogTm9kZVtdKTogdm9pZCB7XG4gICAgdGVtcGxhdGUuZm9yRWFjaChub2RlID0+IG5vZGUudmlzaXQodGhpcykpO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICB0aGlzLnZpc2l0RWxlbWVudE9yVGVtcGxhdGUoZWxlbWVudC5uYW1lLCBlbGVtZW50KTtcbiAgfVxuXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFRlbXBsYXRlKTogdm9pZCB7XG4gICAgdGhpcy52aXNpdEVsZW1lbnRPclRlbXBsYXRlKCduZy10ZW1wbGF0ZScsIHRlbXBsYXRlKTtcbiAgfVxuXG4gIHZpc2l0RWxlbWVudE9yVGVtcGxhdGUoZWxlbWVudE5hbWU6IHN0cmluZywgbm9kZTogRWxlbWVudHxUZW1wbGF0ZSk6IHZvaWQge1xuICAgIC8vIEZpcnN0LCBkZXRlcm1pbmUgdGhlIEhUTUwgc2hhcGUgb2YgdGhlIG5vZGUgZm9yIHRoZSBwdXJwb3NlIG9mIGRpcmVjdGl2ZSBtYXRjaGluZy5cbiAgICAvLyBEbyB0aGlzIGJ5IGJ1aWxkaW5nIHVwIGEgYENzc1NlbGVjdG9yYCBmb3IgdGhlIG5vZGUuXG4gICAgY29uc3QgY3NzU2VsZWN0b3IgPSBjcmVhdGVDc3NTZWxlY3RvcihlbGVtZW50TmFtZSwgZ2V0QXR0cnNGb3JEaXJlY3RpdmVNYXRjaGluZyhub2RlKSk7XG5cbiAgICAvLyBOZXh0LCB1c2UgdGhlIGBTZWxlY3Rvck1hdGNoZXJgIHRvIGdldCB0aGUgbGlzdCBvZiBkaXJlY3RpdmVzIG9uIHRoZSBub2RlLlxuICAgIGNvbnN0IGRpcmVjdGl2ZXM6IERpcmVjdGl2ZVRbXSA9IFtdO1xuICAgIHRoaXMubWF0Y2hlci5tYXRjaChjc3NTZWxlY3RvciwgKF8sIGRpcmVjdGl2ZSkgPT4gZGlyZWN0aXZlcy5wdXNoKGRpcmVjdGl2ZSkpO1xuICAgIGlmIChkaXJlY3RpdmVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuZGlyZWN0aXZlcy5zZXQobm9kZSwgZGlyZWN0aXZlcyk7XG4gICAgfVxuXG4gICAgLy8gUmVzb2x2ZSBhbnkgcmVmZXJlbmNlcyB0aGF0IGFyZSBjcmVhdGVkIG9uIHRoaXMgbm9kZS5cbiAgICBub2RlLnJlZmVyZW5jZXMuZm9yRWFjaChyZWYgPT4ge1xuICAgICAgbGV0IGRpclRhcmdldDogRGlyZWN0aXZlVHxudWxsID0gbnVsbDtcblxuICAgICAgLy8gSWYgdGhlIHJlZmVyZW5jZSBleHByZXNzaW9uIGlzIGVtcHR5LCB0aGVuIGl0IG1hdGNoZXMgdGhlIFwicHJpbWFyeVwiIGRpcmVjdGl2ZSBvbiB0aGUgbm9kZVxuICAgICAgLy8gKGlmIHRoZXJlIGlzIG9uZSkuIE90aGVyd2lzZSBpdCBtYXRjaGVzIHRoZSBob3N0IG5vZGUgaXRzZWxmIChlaXRoZXIgYW4gZWxlbWVudCBvclxuICAgICAgLy8gPG5nLXRlbXBsYXRlPiBub2RlKS5cbiAgICAgIGlmIChyZWYudmFsdWUudHJpbSgpID09PSAnJykge1xuICAgICAgICAvLyBUaGlzIGNvdWxkIGJlIGEgcmVmZXJlbmNlIHRvIGEgY29tcG9uZW50IGlmIHRoZXJlIGlzIG9uZS5cbiAgICAgICAgZGlyVGFyZ2V0ID0gZGlyZWN0aXZlcy5maW5kKGRpciA9PiBkaXIuaXNDb21wb25lbnQpIHx8IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBhIHJlZmVyZW5jZSB0byBhIGRpcmVjdGl2ZSBleHBvcnRlZCB2aWEgZXhwb3J0QXMuXG4gICAgICAgIGRpclRhcmdldCA9XG4gICAgICAgICAgICBkaXJlY3RpdmVzLmZpbmQoXG4gICAgICAgICAgICAgICAgZGlyID0+IGRpci5leHBvcnRBcyAhPT0gbnVsbCAmJiBkaXIuZXhwb3J0QXMuc29tZSh2YWx1ZSA9PiB2YWx1ZSA9PT0gcmVmLnZhbHVlKSkgfHxcbiAgICAgICAgICAgIG51bGw7XG4gICAgICAgIC8vIENoZWNrIGlmIGEgbWF0Y2hpbmcgZGlyZWN0aXZlIHdhcyBmb3VuZC5cbiAgICAgICAgaWYgKGRpclRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgICAgIC8vIE5vIG1hdGNoaW5nIGRpcmVjdGl2ZSB3YXMgZm91bmQgLSB0aGlzIHJlZmVyZW5jZSBwb2ludHMgdG8gYW4gdW5rbm93biB0YXJnZXQuIExlYXZlIGl0XG4gICAgICAgICAgLy8gdW5tYXBwZWQuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChkaXJUYXJnZXQgIT09IG51bGwpIHtcbiAgICAgICAgLy8gVGhpcyByZWZlcmVuY2UgcG9pbnRzIHRvIGEgZGlyZWN0aXZlLlxuICAgICAgICB0aGlzLnJlZmVyZW5jZXMuc2V0KHJlZiwge2RpcmVjdGl2ZTogZGlyVGFyZ2V0LCBub2RlfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIHJlZmVyZW5jZSBwb2ludHMgdG8gdGhlIG5vZGUgaXRzZWxmLlxuICAgICAgICB0aGlzLnJlZmVyZW5jZXMuc2V0KHJlZiwgbm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBBc3NvY2lhdGUgYXR0cmlidXRlcy9iaW5kaW5ncyBvbiB0aGUgbm9kZSB3aXRoIGRpcmVjdGl2ZXMgb3Igd2l0aCB0aGUgbm9kZSBpdHNlbGYuXG4gICAgdHlwZSBCb3VuZE5vZGUgPSBCb3VuZEF0dHJpYnV0ZXxCb3VuZEV2ZW50fFRleHRBdHRyaWJ1dGU7XG4gICAgY29uc3Qgc2V0QXR0cmlidXRlQmluZGluZyA9XG4gICAgICAgIChhdHRyaWJ1dGU6IEJvdW5kTm9kZSwgaW9UeXBlOiBrZXlvZiBQaWNrPERpcmVjdGl2ZU1ldGEsICdpbnB1dHMnfCdvdXRwdXRzJz4pID0+IHtcbiAgICAgICAgICBjb25zdCBkaXIgPSBkaXJlY3RpdmVzLmZpbmQoZGlyID0+IGRpcltpb1R5cGVdLmhhc0JpbmRpbmdQcm9wZXJ0eU5hbWUoYXR0cmlidXRlLm5hbWUpKTtcbiAgICAgICAgICBjb25zdCBiaW5kaW5nID0gZGlyICE9PSB1bmRlZmluZWQgPyBkaXIgOiBub2RlO1xuICAgICAgICAgIHRoaXMuYmluZGluZ3Muc2V0KGF0dHJpYnV0ZSwgYmluZGluZyk7XG4gICAgICAgIH07XG5cbiAgICAvLyBOb2RlIGlucHV0cyAoYm91bmQgYXR0cmlidXRlcykgYW5kIHRleHQgYXR0cmlidXRlcyBjYW4gYmUgYm91bmQgdG8gYW5cbiAgICAvLyBpbnB1dCBvbiBhIGRpcmVjdGl2ZS5cbiAgICBub2RlLmlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHNldEF0dHJpYnV0ZUJpbmRpbmcoaW5wdXQsICdpbnB1dHMnKSk7XG4gICAgbm9kZS5hdHRyaWJ1dGVzLmZvckVhY2goYXR0ciA9PiBzZXRBdHRyaWJ1dGVCaW5kaW5nKGF0dHIsICdpbnB1dHMnKSk7XG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBUZW1wbGF0ZSkge1xuICAgICAgbm9kZS50ZW1wbGF0ZUF0dHJzLmZvckVhY2goYXR0ciA9PiBzZXRBdHRyaWJ1dGVCaW5kaW5nKGF0dHIsICdpbnB1dHMnKSk7XG4gICAgfVxuICAgIC8vIE5vZGUgb3V0cHV0cyAoYm91bmQgZXZlbnRzKSBjYW4gYmUgYm91bmQgdG8gYW4gb3V0cHV0IG9uIGEgZGlyZWN0aXZlLlxuICAgIG5vZGUub3V0cHV0cy5mb3JFYWNoKG91dHB1dCA9PiBzZXRBdHRyaWJ1dGVCaW5kaW5nKG91dHB1dCwgJ291dHB1dHMnKSk7XG5cbiAgICAvLyBSZWN1cnNlIGludG8gdGhlIG5vZGUncyBjaGlsZHJlbi5cbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gY2hpbGQudmlzaXQodGhpcykpO1xuICB9XG5cbiAgLy8gVW51c2VkIHZpc2l0b3JzLlxuICB2aXNpdENvbnRlbnQoY29udGVudDogQ29udGVudCk6IHZvaWQge31cbiAgdmlzaXRWYXJpYWJsZSh2YXJpYWJsZTogVmFyaWFibGUpOiB2b2lkIHt9XG4gIHZpc2l0UmVmZXJlbmNlKHJlZmVyZW5jZTogUmVmZXJlbmNlKTogdm9pZCB7fVxuICB2aXNpdFRleHRBdHRyaWJ1dGUoYXR0cmlidXRlOiBUZXh0QXR0cmlidXRlKTogdm9pZCB7fVxuICB2aXNpdEJvdW5kQXR0cmlidXRlKGF0dHJpYnV0ZTogQm91bmRBdHRyaWJ1dGUpOiB2b2lkIHt9XG4gIHZpc2l0Qm91bmRFdmVudChhdHRyaWJ1dGU6IEJvdW5kRXZlbnQpOiB2b2lkIHt9XG4gIHZpc2l0Qm91bmRBdHRyaWJ1dGVPckV2ZW50KG5vZGU6IEJvdW5kQXR0cmlidXRlfEJvdW5kRXZlbnQpIHt9XG4gIHZpc2l0VGV4dCh0ZXh0OiBUZXh0KTogdm9pZCB7fVxuICB2aXNpdEJvdW5kVGV4dCh0ZXh0OiBCb3VuZFRleHQpOiB2b2lkIHt9XG4gIHZpc2l0SWN1KGljdTogSWN1KTogdm9pZCB7fVxufVxuXG4vKipcbiAqIFByb2Nlc3NlcyBhIHRlbXBsYXRlIGFuZCBleHRyYWN0IG1ldGFkYXRhIGFib3V0IGV4cHJlc3Npb25zIGFuZCBzeW1ib2xzIHdpdGhpbi5cbiAqXG4gKiBUaGlzIGlzIGEgY29tcGFuaW9uIHRvIHRoZSBgRGlyZWN0aXZlQmluZGVyYCB0aGF0IGRvZXNuJ3QgcmVxdWlyZSBrbm93bGVkZ2Ugb2YgZGlyZWN0aXZlcyBtYXRjaGVkXG4gKiB3aXRoaW4gdGhlIHRlbXBsYXRlIGluIG9yZGVyIHRvIG9wZXJhdGUuXG4gKlxuICogRXhwcmVzc2lvbnMgYXJlIHZpc2l0ZWQgYnkgdGhlIHN1cGVyY2xhc3MgYFJlY3Vyc2l2ZUFzdFZpc2l0b3JgLCB3aXRoIGN1c3RvbSBsb2dpYyBwcm92aWRlZFxuICogYnkgb3ZlcnJpZGRlbiBtZXRob2RzIGZyb20gdGhhdCB2aXNpdG9yLlxuICovXG5jbGFzcyBUZW1wbGF0ZUJpbmRlciBleHRlbmRzIFJlY3Vyc2l2ZUFzdFZpc2l0b3IgaW1wbGVtZW50cyBWaXNpdG9yIHtcbiAgcHJpdmF0ZSB2aXNpdE5vZGU6IChub2RlOiBOb2RlKSA9PiB2b2lkO1xuXG4gIHByaXZhdGUgcGlwZXNVc2VkOiBzdHJpbmdbXSA9IFtdO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGJpbmRpbmdzOiBNYXA8QVNULCBSZWZlcmVuY2V8VmFyaWFibGU+LFxuICAgICAgcHJpdmF0ZSBzeW1ib2xzOiBNYXA8UmVmZXJlbmNlfFZhcmlhYmxlLCBUZW1wbGF0ZT4sIHByaXZhdGUgdXNlZFBpcGVzOiBTZXQ8c3RyaW5nPixcbiAgICAgIHByaXZhdGUgbmVzdGluZ0xldmVsOiBNYXA8VGVtcGxhdGUsIG51bWJlcj4sIHByaXZhdGUgc2NvcGU6IFNjb3BlLFxuICAgICAgcHJpdmF0ZSB0ZW1wbGF0ZTogVGVtcGxhdGV8bnVsbCwgcHJpdmF0ZSBsZXZlbDogbnVtYmVyKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8vIFNhdmUgYSBiaXQgb2YgcHJvY2Vzc2luZyB0aW1lIGJ5IGNvbnN0cnVjdGluZyB0aGlzIGNsb3N1cmUgaW4gYWR2YW5jZS5cbiAgICB0aGlzLnZpc2l0Tm9kZSA9IChub2RlOiBOb2RlKSA9PiBub2RlLnZpc2l0KHRoaXMpO1xuICB9XG5cbiAgLy8gVGhpcyBtZXRob2QgaXMgZGVmaW5lZCB0byByZWNvbmNpbGUgdGhlIHR5cGUgb2YgVGVtcGxhdGVCaW5kZXIgc2luY2UgYm90aFxuICAvLyBSZWN1cnNpdmVBc3RWaXNpdG9yIGFuZCBWaXNpdG9yIGRlZmluZSB0aGUgdmlzaXQoKSBtZXRob2QgaW4gdGhlaXJcbiAgLy8gaW50ZXJmYWNlcy5cbiAgb3ZlcnJpZGUgdmlzaXQobm9kZTogQVNUfE5vZGUsIGNvbnRleHQ/OiBhbnkpIHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEFTVCkge1xuICAgICAgbm9kZS52aXNpdCh0aGlzLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS52aXNpdCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHJvY2VzcyBhIHRlbXBsYXRlIGFuZCBleHRyYWN0IG1ldGFkYXRhIGFib3V0IGV4cHJlc3Npb25zIGFuZCBzeW1ib2xzIHdpdGhpbi5cbiAgICpcbiAgICogQHBhcmFtIHRlbXBsYXRlIHRoZSBub2RlcyBvZiB0aGUgdGVtcGxhdGUgdG8gcHJvY2Vzc1xuICAgKiBAcGFyYW0gc2NvcGUgdGhlIGBTY29wZWAgb2YgdGhlIHRlbXBsYXRlIGJlaW5nIHByb2Nlc3NlZC5cbiAgICogQHJldHVybnMgdGhyZWUgbWFwcyB3aGljaCBjb250YWluIG1ldGFkYXRhIGFib3V0IHRoZSB0ZW1wbGF0ZTogYGV4cHJlc3Npb25zYCB3aGljaCBpbnRlcnByZXRzXG4gICAqIHNwZWNpYWwgYEFTVGAgbm9kZXMgaW4gZXhwcmVzc2lvbnMgYXMgcG9pbnRpbmcgdG8gcmVmZXJlbmNlcyBvciB2YXJpYWJsZXMgZGVjbGFyZWQgd2l0aGluIHRoZVxuICAgKiB0ZW1wbGF0ZSwgYHN5bWJvbHNgIHdoaWNoIG1hcHMgdGhvc2UgdmFyaWFibGVzIGFuZCByZWZlcmVuY2VzIHRvIHRoZSBuZXN0ZWQgYFRlbXBsYXRlYCB3aGljaFxuICAgKiBkZWNsYXJlcyB0aGVtLCBpZiBhbnksIGFuZCBgbmVzdGluZ0xldmVsYCB3aGljaCBhc3NvY2lhdGVzIGVhY2ggYFRlbXBsYXRlYCB3aXRoIGEgaW50ZWdlclxuICAgKiBuZXN0aW5nIGxldmVsIChob3cgbWFueSBsZXZlbHMgZGVlcCB3aXRoaW4gdGhlIHRlbXBsYXRlIHN0cnVjdHVyZSB0aGUgYFRlbXBsYXRlYCBpcyksIHN0YXJ0aW5nXG4gICAqIGF0IDEuXG4gICAqL1xuICBzdGF0aWMgYXBwbHlXaXRoU2NvcGUodGVtcGxhdGU6IE5vZGVbXSwgc2NvcGU6IFNjb3BlKToge1xuICAgIGV4cHJlc3Npb25zOiBNYXA8QVNULCBSZWZlcmVuY2V8VmFyaWFibGU+LFxuICAgIHN5bWJvbHM6IE1hcDxWYXJpYWJsZXxSZWZlcmVuY2UsIFRlbXBsYXRlPixcbiAgICBuZXN0aW5nTGV2ZWw6IE1hcDxUZW1wbGF0ZSwgbnVtYmVyPixcbiAgICB1c2VkUGlwZXM6IFNldDxzdHJpbmc+LFxuICB9IHtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IG5ldyBNYXA8QVNULCBSZWZlcmVuY2V8VmFyaWFibGU+KCk7XG4gICAgY29uc3Qgc3ltYm9scyA9IG5ldyBNYXA8VmFyaWFibGV8UmVmZXJlbmNlLCBUZW1wbGF0ZT4oKTtcbiAgICBjb25zdCBuZXN0aW5nTGV2ZWwgPSBuZXcgTWFwPFRlbXBsYXRlLCBudW1iZXI+KCk7XG4gICAgY29uc3QgdXNlZFBpcGVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgLy8gVGhlIHRvcC1sZXZlbCB0ZW1wbGF0ZSBoYXMgbmVzdGluZyBsZXZlbCAwLlxuICAgIGNvbnN0IGJpbmRlciA9IG5ldyBUZW1wbGF0ZUJpbmRlcihcbiAgICAgICAgZXhwcmVzc2lvbnMsIHN5bWJvbHMsIHVzZWRQaXBlcywgbmVzdGluZ0xldmVsLCBzY29wZSxcbiAgICAgICAgdGVtcGxhdGUgaW5zdGFuY2VvZiBUZW1wbGF0ZSA/IHRlbXBsYXRlIDogbnVsbCwgMCk7XG4gICAgYmluZGVyLmluZ2VzdCh0ZW1wbGF0ZSk7XG4gICAgcmV0dXJuIHtleHByZXNzaW9ucywgc3ltYm9scywgbmVzdGluZ0xldmVsLCB1c2VkUGlwZXN9O1xuICB9XG5cbiAgcHJpdmF0ZSBpbmdlc3QodGVtcGxhdGU6IFRlbXBsYXRlfE5vZGVbXSk6IHZvaWQge1xuICAgIGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIFRlbXBsYXRlKSB7XG4gICAgICAvLyBGb3IgPG5nLXRlbXBsYXRlPnMsIHByb2Nlc3Mgb25seSB2YXJpYWJsZXMgYW5kIGNoaWxkIG5vZGVzLiBJbnB1dHMsIG91dHB1dHMsIHRlbXBsYXRlQXR0cnMsXG4gICAgICAvLyBhbmQgcmVmZXJlbmNlcyB3ZXJlIGFsbCBwcm9jZXNzZWQgaW4gdGhlIHNjb3BlIG9mIHRoZSBjb250YWluaW5nIHRlbXBsYXRlLlxuICAgICAgdGVtcGxhdGUudmFyaWFibGVzLmZvckVhY2godGhpcy52aXNpdE5vZGUpO1xuICAgICAgdGVtcGxhdGUuY2hpbGRyZW4uZm9yRWFjaCh0aGlzLnZpc2l0Tm9kZSk7XG5cbiAgICAgIC8vIFNldCB0aGUgbmVzdGluZyBsZXZlbC5cbiAgICAgIHRoaXMubmVzdGluZ0xldmVsLnNldCh0ZW1wbGF0ZSwgdGhpcy5sZXZlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFZpc2l0IGVhY2ggbm9kZSBmcm9tIHRoZSB0b3AtbGV2ZWwgdGVtcGxhdGUuXG4gICAgICB0ZW1wbGF0ZS5mb3JFYWNoKHRoaXMudmlzaXROb2RlKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIC8vIFZpc2l0IHRoZSBpbnB1dHMsIG91dHB1dHMsIGFuZCBjaGlsZHJlbiBvZiB0aGUgZWxlbWVudC5cbiAgICBlbGVtZW50LmlucHV0cy5mb3JFYWNoKHRoaXMudmlzaXROb2RlKTtcbiAgICBlbGVtZW50Lm91dHB1dHMuZm9yRWFjaCh0aGlzLnZpc2l0Tm9kZSk7XG4gICAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKHRoaXMudmlzaXROb2RlKTtcbiAgfVxuXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFRlbXBsYXRlKSB7XG4gICAgLy8gRmlyc3QsIHZpc2l0IGlucHV0cywgb3V0cHV0cyBhbmQgdGVtcGxhdGUgYXR0cmlidXRlcyBvZiB0aGUgdGVtcGxhdGUgbm9kZS5cbiAgICB0ZW1wbGF0ZS5pbnB1dHMuZm9yRWFjaCh0aGlzLnZpc2l0Tm9kZSk7XG4gICAgdGVtcGxhdGUub3V0cHV0cy5mb3JFYWNoKHRoaXMudmlzaXROb2RlKTtcbiAgICB0ZW1wbGF0ZS50ZW1wbGF0ZUF0dHJzLmZvckVhY2godGhpcy52aXNpdE5vZGUpO1xuXG4gICAgLy8gUmVmZXJlbmNlcyBhcmUgYWxzbyBldmFsdWF0ZWQgaW4gdGhlIG91dGVyIGNvbnRleHQuXG4gICAgdGVtcGxhdGUucmVmZXJlbmNlcy5mb3JFYWNoKHRoaXMudmlzaXROb2RlKTtcblxuICAgIC8vIE5leHQsIHJlY3Vyc2UgaW50byB0aGUgdGVtcGxhdGUgdXNpbmcgaXRzIHNjb3BlLCBhbmQgYnVtcGluZyB0aGUgbmVzdGluZyBsZXZlbCB1cCBieSBvbmUuXG4gICAgY29uc3QgY2hpbGRTY29wZSA9IHRoaXMuc2NvcGUuZ2V0Q2hpbGRTY29wZSh0ZW1wbGF0ZSk7XG4gICAgY29uc3QgYmluZGVyID0gbmV3IFRlbXBsYXRlQmluZGVyKFxuICAgICAgICB0aGlzLmJpbmRpbmdzLCB0aGlzLnN5bWJvbHMsIHRoaXMudXNlZFBpcGVzLCB0aGlzLm5lc3RpbmdMZXZlbCwgY2hpbGRTY29wZSwgdGVtcGxhdGUsXG4gICAgICAgIHRoaXMubGV2ZWwgKyAxKTtcbiAgICBiaW5kZXIuaW5nZXN0KHRlbXBsYXRlKTtcbiAgfVxuXG4gIHZpc2l0VmFyaWFibGUodmFyaWFibGU6IFZhcmlhYmxlKSB7XG4gICAgLy8gUmVnaXN0ZXIgdGhlIGBWYXJpYWJsZWAgYXMgYSBzeW1ib2wgaW4gdGhlIGN1cnJlbnQgYFRlbXBsYXRlYC5cbiAgICBpZiAodGhpcy50ZW1wbGF0ZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zeW1ib2xzLnNldCh2YXJpYWJsZSwgdGhpcy50ZW1wbGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRSZWZlcmVuY2UocmVmZXJlbmNlOiBSZWZlcmVuY2UpIHtcbiAgICAvLyBSZWdpc3RlciB0aGUgYFJlZmVyZW5jZWAgYXMgYSBzeW1ib2wgaW4gdGhlIGN1cnJlbnQgYFRlbXBsYXRlYC5cbiAgICBpZiAodGhpcy50ZW1wbGF0ZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zeW1ib2xzLnNldChyZWZlcmVuY2UsIHRoaXMudGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFVudXNlZCB0ZW1wbGF0ZSB2aXNpdG9yc1xuXG4gIHZpc2l0VGV4dCh0ZXh0OiBUZXh0KSB7fVxuICB2aXNpdENvbnRlbnQoY29udGVudDogQ29udGVudCkge31cbiAgdmlzaXRUZXh0QXR0cmlidXRlKGF0dHJpYnV0ZTogVGV4dEF0dHJpYnV0ZSkge31cbiAgdmlzaXRJY3UoaWN1OiBJY3UpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyhpY3UudmFycykuZm9yRWFjaChrZXkgPT4gaWN1LnZhcnNba2V5XS52aXNpdCh0aGlzKSk7XG4gICAgT2JqZWN0LmtleXMoaWN1LnBsYWNlaG9sZGVycykuZm9yRWFjaChrZXkgPT4gaWN1LnBsYWNlaG9sZGVyc1trZXldLnZpc2l0KHRoaXMpKTtcbiAgfVxuXG4gIC8vIFRoZSByZW1haW5pbmcgdmlzaXRvcnMgYXJlIGNvbmNlcm5lZCB3aXRoIHByb2Nlc3NpbmcgQVNUIGV4cHJlc3Npb25zIHdpdGhpbiB0ZW1wbGF0ZSBiaW5kaW5nc1xuXG4gIHZpc2l0Qm91bmRBdHRyaWJ1dGUoYXR0cmlidXRlOiBCb3VuZEF0dHJpYnV0ZSkge1xuICAgIGF0dHJpYnV0ZS52YWx1ZS52aXNpdCh0aGlzKTtcbiAgfVxuXG4gIHZpc2l0Qm91bmRFdmVudChldmVudDogQm91bmRFdmVudCkge1xuICAgIGV2ZW50LmhhbmRsZXIudmlzaXQodGhpcyk7XG4gIH1cblxuICB2aXNpdEJvdW5kVGV4dCh0ZXh0OiBCb3VuZFRleHQpIHtcbiAgICB0ZXh0LnZhbHVlLnZpc2l0KHRoaXMpO1xuICB9XG4gIG92ZXJyaWRlIHZpc2l0UGlwZShhc3Q6IEJpbmRpbmdQaXBlLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRoaXMudXNlZFBpcGVzLmFkZChhc3QubmFtZSk7XG4gICAgcmV0dXJuIHN1cGVyLnZpc2l0UGlwZShhc3QsIGNvbnRleHQpO1xuICB9XG5cbiAgLy8gVGhlc2UgZml2ZSB0eXBlcyBvZiBBU1QgZXhwcmVzc2lvbnMgY2FuIHJlZmVyIHRvIGV4cHJlc3Npb24gcm9vdHMsIHdoaWNoIGNvdWxkIGJlIHZhcmlhYmxlc1xuICAvLyBvciByZWZlcmVuY2VzIGluIHRoZSBjdXJyZW50IHNjb3BlLlxuXG4gIG92ZXJyaWRlIHZpc2l0UHJvcGVydHlSZWFkKGFzdDogUHJvcGVydHlSZWFkLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRoaXMubWF5YmVNYXAoY29udGV4dCwgYXN0LCBhc3QubmFtZSk7XG4gICAgcmV0dXJuIHN1cGVyLnZpc2l0UHJvcGVydHlSZWFkKGFzdCwgY29udGV4dCk7XG4gIH1cblxuICBvdmVycmlkZSB2aXNpdFNhZmVQcm9wZXJ0eVJlYWQoYXN0OiBTYWZlUHJvcGVydHlSZWFkLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRoaXMubWF5YmVNYXAoY29udGV4dCwgYXN0LCBhc3QubmFtZSk7XG4gICAgcmV0dXJuIHN1cGVyLnZpc2l0U2FmZVByb3BlcnR5UmVhZChhc3QsIGNvbnRleHQpO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRQcm9wZXJ0eVdyaXRlKGFzdDogUHJvcGVydHlXcml0ZSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0aGlzLm1heWJlTWFwKGNvbnRleHQsIGFzdCwgYXN0Lm5hbWUpO1xuICAgIHJldHVybiBzdXBlci52aXNpdFByb3BlcnR5V3JpdGUoYXN0LCBjb250ZXh0KTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0TWV0aG9kQ2FsbChhc3Q6IE1ldGhvZENhbGwsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy5tYXliZU1hcChjb250ZXh0LCBhc3QsIGFzdC5uYW1lKTtcbiAgICByZXR1cm4gc3VwZXIudmlzaXRNZXRob2RDYWxsKGFzdCwgY29udGV4dCk7XG4gIH1cblxuICBvdmVycmlkZSB2aXNpdFNhZmVNZXRob2RDYWxsKGFzdDogU2FmZU1ldGhvZENhbGwsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy5tYXliZU1hcChjb250ZXh0LCBhc3QsIGFzdC5uYW1lKTtcbiAgICByZXR1cm4gc3VwZXIudmlzaXRTYWZlTWV0aG9kQ2FsbChhc3QsIGNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXliZU1hcChcbiAgICAgIHNjb3BlOiBTY29wZSwgYXN0OiBQcm9wZXJ0eVJlYWR8U2FmZVByb3BlcnR5UmVhZHxQcm9wZXJ0eVdyaXRlfE1ldGhvZENhbGx8U2FmZU1ldGhvZENhbGwsXG4gICAgICBuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBJZiB0aGUgcmVjZWl2ZXIgb2YgdGhlIGV4cHJlc3Npb24gaXNuJ3QgdGhlIGBJbXBsaWNpdFJlY2VpdmVyYCwgdGhpcyBpc24ndCB0aGUgcm9vdCBvZiBhblxuICAgIC8vIGBBU1RgIGV4cHJlc3Npb24gdGhhdCBtYXBzIHRvIGEgYFZhcmlhYmxlYCBvciBgUmVmZXJlbmNlYC5cbiAgICBpZiAoIShhc3QucmVjZWl2ZXIgaW5zdGFuY2VvZiBJbXBsaWNpdFJlY2VpdmVyKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIG5hbWUgZXhpc3RzIGluIHRoZSBjdXJyZW50IHNjb3BlLiBJZiBzbywgbWFwIGl0LiBPdGhlcndpc2UsIHRoZSBuYW1lIGlzXG4gICAgLy8gcHJvYmFibHkgYSBwcm9wZXJ0eSBvbiB0aGUgdG9wLWxldmVsIGNvbXBvbmVudCBjb250ZXh0LlxuICAgIGxldCB0YXJnZXQgPSB0aGlzLnNjb3BlLmxvb2t1cChuYW1lKTtcbiAgICBpZiAodGFyZ2V0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmJpbmRpbmdzLnNldChhc3QsIHRhcmdldCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWV0YWRhdGEgY29udGFpbmVyIGZvciBhIGBUYXJnZXRgIHRoYXQgYWxsb3dzIHF1ZXJpZXMgZm9yIHNwZWNpZmljIGJpdHMgb2YgbWV0YWRhdGEuXG4gKlxuICogU2VlIGBCb3VuZFRhcmdldGAgZm9yIGRvY3VtZW50YXRpb24gb24gdGhlIGluZGl2aWR1YWwgbWV0aG9kcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFIzQm91bmRUYXJnZXQ8RGlyZWN0aXZlVCBleHRlbmRzIERpcmVjdGl2ZU1ldGE+IGltcGxlbWVudHMgQm91bmRUYXJnZXQ8RGlyZWN0aXZlVD4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHJlYWRvbmx5IHRhcmdldDogVGFyZ2V0LCBwcml2YXRlIGRpcmVjdGl2ZXM6IE1hcDxFbGVtZW50fFRlbXBsYXRlLCBEaXJlY3RpdmVUW10+LFxuICAgICAgcHJpdmF0ZSBiaW5kaW5nczogTWFwPEJvdW5kQXR0cmlidXRlfEJvdW5kRXZlbnR8VGV4dEF0dHJpYnV0ZSwgRGlyZWN0aXZlVHxFbGVtZW50fFRlbXBsYXRlPixcbiAgICAgIHByaXZhdGUgcmVmZXJlbmNlczpcbiAgICAgICAgICBNYXA8Qm91bmRBdHRyaWJ1dGV8Qm91bmRFdmVudHxSZWZlcmVuY2V8VGV4dEF0dHJpYnV0ZSxcbiAgICAgICAgICAgICAge2RpcmVjdGl2ZTogRGlyZWN0aXZlVCwgbm9kZTogRWxlbWVudHxUZW1wbGF0ZX18RWxlbWVudHxUZW1wbGF0ZT4sXG4gICAgICBwcml2YXRlIGV4cHJUYXJnZXRzOiBNYXA8QVNULCBSZWZlcmVuY2V8VmFyaWFibGU+LFxuICAgICAgcHJpdmF0ZSBzeW1ib2xzOiBNYXA8UmVmZXJlbmNlfFZhcmlhYmxlLCBUZW1wbGF0ZT4sXG4gICAgICBwcml2YXRlIG5lc3RpbmdMZXZlbDogTWFwPFRlbXBsYXRlLCBudW1iZXI+LFxuICAgICAgcHJpdmF0ZSB0ZW1wbGF0ZUVudGl0aWVzOiBNYXA8VGVtcGxhdGV8bnVsbCwgUmVhZG9ubHlTZXQ8UmVmZXJlbmNlfFZhcmlhYmxlPj4sXG4gICAgICBwcml2YXRlIHVzZWRQaXBlczogU2V0PHN0cmluZz4pIHt9XG5cbiAgZ2V0RW50aXRpZXNJblRlbXBsYXRlU2NvcGUodGVtcGxhdGU6IFRlbXBsYXRlfG51bGwpOiBSZWFkb25seVNldDxSZWZlcmVuY2V8VmFyaWFibGU+IHtcbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZUVudGl0aWVzLmdldCh0ZW1wbGF0ZSkgPz8gbmV3IFNldCgpO1xuICB9XG5cbiAgZ2V0RGlyZWN0aXZlc09mTm9kZShub2RlOiBFbGVtZW50fFRlbXBsYXRlKTogRGlyZWN0aXZlVFtdfG51bGwge1xuICAgIHJldHVybiB0aGlzLmRpcmVjdGl2ZXMuZ2V0KG5vZGUpIHx8IG51bGw7XG4gIH1cblxuICBnZXRSZWZlcmVuY2VUYXJnZXQocmVmOiBSZWZlcmVuY2UpOiB7ZGlyZWN0aXZlOiBEaXJlY3RpdmVULCBub2RlOiBFbGVtZW50fFRlbXBsYXRlfXxFbGVtZW50XG4gICAgICB8VGVtcGxhdGV8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMucmVmZXJlbmNlcy5nZXQocmVmKSB8fCBudWxsO1xuICB9XG5cbiAgZ2V0Q29uc3VtZXJPZkJpbmRpbmcoYmluZGluZzogQm91bmRBdHRyaWJ1dGV8Qm91bmRFdmVudHxUZXh0QXR0cmlidXRlKTogRGlyZWN0aXZlVHxFbGVtZW50XG4gICAgICB8VGVtcGxhdGV8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuYmluZGluZ3MuZ2V0KGJpbmRpbmcpIHx8IG51bGw7XG4gIH1cblxuICBnZXRFeHByZXNzaW9uVGFyZ2V0KGV4cHI6IEFTVCk6IFJlZmVyZW5jZXxWYXJpYWJsZXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5leHByVGFyZ2V0cy5nZXQoZXhwcikgfHwgbnVsbDtcbiAgfVxuXG4gIGdldFRlbXBsYXRlT2ZTeW1ib2woc3ltYm9sOiBSZWZlcmVuY2V8VmFyaWFibGUpOiBUZW1wbGF0ZXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5zeW1ib2xzLmdldChzeW1ib2wpIHx8IG51bGw7XG4gIH1cblxuICBnZXROZXN0aW5nTGV2ZWwodGVtcGxhdGU6IFRlbXBsYXRlKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5uZXN0aW5nTGV2ZWwuZ2V0KHRlbXBsYXRlKSB8fCAwO1xuICB9XG5cbiAgZ2V0VXNlZERpcmVjdGl2ZXMoKTogRGlyZWN0aXZlVFtdIHtcbiAgICBjb25zdCBzZXQgPSBuZXcgU2V0PERpcmVjdGl2ZVQ+KCk7XG4gICAgdGhpcy5kaXJlY3RpdmVzLmZvckVhY2goZGlycyA9PiBkaXJzLmZvckVhY2goZGlyID0+IHNldC5hZGQoZGlyKSkpO1xuICAgIHJldHVybiBBcnJheS5mcm9tKHNldC52YWx1ZXMoKSk7XG4gIH1cblxuICBnZXRVc2VkUGlwZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMudXNlZFBpcGVzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBleHRyYWN0VGVtcGxhdGVFbnRpdGllcyhyb290U2NvcGU6IFNjb3BlKTogTWFwPFRlbXBsYXRlfG51bGwsIFNldDxSZWZlcmVuY2V8VmFyaWFibGU+PiB7XG4gIGNvbnN0IGVudGl0eU1hcCA9IG5ldyBNYXA8VGVtcGxhdGV8bnVsbCwgTWFwPHN0cmluZywgUmVmZXJlbmNlfFZhcmlhYmxlPj4oKTtcblxuICBmdW5jdGlvbiBleHRyYWN0U2NvcGVFbnRpdGllcyhzY29wZTogU2NvcGUpOiBNYXA8c3RyaW5nLCBSZWZlcmVuY2V8VmFyaWFibGU+IHtcbiAgICBpZiAoZW50aXR5TWFwLmhhcyhzY29wZS50ZW1wbGF0ZSkpIHtcbiAgICAgIHJldHVybiBlbnRpdHlNYXAuZ2V0KHNjb3BlLnRlbXBsYXRlKSE7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudEVudGl0aWVzID0gc2NvcGUubmFtZWRFbnRpdGllcztcblxuICAgIGxldCB0ZW1wbGF0ZUVudGl0aWVzOiBNYXA8c3RyaW5nLCBSZWZlcmVuY2V8VmFyaWFibGU+O1xuICAgIGlmIChzY29wZS5wYXJlbnRTY29wZSAhPT0gbnVsbCkge1xuICAgICAgdGVtcGxhdGVFbnRpdGllcyA9IG5ldyBNYXAoWy4uLmV4dHJhY3RTY29wZUVudGl0aWVzKHNjb3BlLnBhcmVudFNjb3BlKSwgLi4uY3VycmVudEVudGl0aWVzXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlbXBsYXRlRW50aXRpZXMgPSBuZXcgTWFwKGN1cnJlbnRFbnRpdGllcyk7XG4gICAgfVxuXG4gICAgZW50aXR5TWFwLnNldChzY29wZS50ZW1wbGF0ZSwgdGVtcGxhdGVFbnRpdGllcyk7XG4gICAgcmV0dXJuIHRlbXBsYXRlRW50aXRpZXM7XG4gIH1cblxuICBjb25zdCBzY29wZXNUb1Byb2Nlc3M6IFNjb3BlW10gPSBbcm9vdFNjb3BlXTtcbiAgd2hpbGUgKHNjb3Blc1RvUHJvY2Vzcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3Qgc2NvcGUgPSBzY29wZXNUb1Byb2Nlc3MucG9wKCkhO1xuICAgIGZvciAoY29uc3QgY2hpbGRTY29wZSBvZiBzY29wZS5jaGlsZFNjb3Blcy52YWx1ZXMoKSkge1xuICAgICAgc2NvcGVzVG9Qcm9jZXNzLnB1c2goY2hpbGRTY29wZSk7XG4gICAgfVxuICAgIGV4dHJhY3RTY29wZUVudGl0aWVzKHNjb3BlKTtcbiAgfVxuXG4gIGNvbnN0IHRlbXBsYXRlRW50aXRpZXMgPSBuZXcgTWFwPFRlbXBsYXRlfG51bGwsIFNldDxSZWZlcmVuY2V8VmFyaWFibGU+PigpO1xuICBmb3IgKGNvbnN0IFt0ZW1wbGF0ZSwgZW50aXRpZXNdIG9mIGVudGl0eU1hcCkge1xuICAgIHRlbXBsYXRlRW50aXRpZXMuc2V0KHRlbXBsYXRlLCBuZXcgU2V0KGVudGl0aWVzLnZhbHVlcygpKSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlRW50aXRpZXM7XG59XG4iXX0=