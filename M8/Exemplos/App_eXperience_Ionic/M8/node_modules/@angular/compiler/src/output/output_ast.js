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
        define("@angular/compiler/src/output/output_ast", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isNull = exports.localizedString = exports.literal = exports.taggedTemplate = exports.ifStmt = exports.fn = exports.assertNotNull = exports.not = exports.unary = exports.literalMap = exports.literalArr = exports.typeofExpr = exports.expressionType = exports.importType = exports.importExpr = exports.variable = exports.jsDocComment = exports.leadingComment = exports.applySourceSpanToExpressionIfNeeded = exports.applySourceSpanToStatementIfNeeded = exports.collectExternalReferences = exports.findReadVarNames = exports.RecursiveAstVisitor = exports.AstTransformer = exports.ThrowStmt = exports.TryCatchStmt = exports.IfStmt = exports.ClassStmt = exports.ClassGetter = exports.ClassMethod = exports.ClassField = exports.AbstractClassPart = exports.ReturnStatement = exports.ExpressionStatement = exports.DeclareFunctionStmt = exports.DeclareVarStmt = exports.Statement = exports.JSDocComment = exports.LeadingComment = exports.StmtModifier = exports.TYPED_NULL_EXPR = exports.NULL_EXPR = exports.CATCH_STACK_VAR = exports.CATCH_ERROR_VAR = exports.SUPER_EXPR = exports.THIS_EXPR = exports.CommaExpr = exports.LiteralMapExpr = exports.LiteralMapEntry = exports.LiteralArrayExpr = exports.ReadKeyExpr = exports.ReadPropExpr = exports.BinaryOperatorExpr = exports.UnaryOperatorExpr = exports.FunctionExpr = exports.FnParam = exports.CastExpr = exports.AssertNotNull = exports.NotExpr = exports.ConditionalExpr = exports.ExternalReference = exports.ExternalExpr = exports.LocalizedString = exports.PlaceholderPiece = exports.LiteralPiece = exports.MessagePiece = exports.TemplateLiteralElement = exports.TemplateLiteral = exports.LiteralExpr = exports.InstantiateExpr = exports.TaggedTemplateExpr = exports.InvokeFunctionExpr = exports.InvokeMethodExpr = exports.BuiltinMethod = exports.WritePropExpr = exports.WriteKeyExpr = exports.WriteVarExpr = exports.WrappedNodeExpr = exports.TypeofExpr = exports.ReadVarExpr = exports.BuiltinVar = exports.Expression = exports.areAllEquivalent = exports.nullSafeIsEquivalent = exports.BinaryOperator = exports.UnaryOperator = exports.NONE_TYPE = exports.FUNCTION_TYPE = exports.STRING_TYPE = exports.NUMBER_TYPE = exports.INT_TYPE = exports.BOOL_TYPE = exports.INFERRED_TYPE = exports.DYNAMIC_TYPE = exports.MapType = exports.ArrayType = exports.ExpressionType = exports.BuiltinType = exports.BuiltinTypeName = exports.Type = exports.TypeModifier = void 0;
    var tslib_1 = require("tslib");
    //// Types
    var TypeModifier;
    (function (TypeModifier) {
        TypeModifier[TypeModifier["Const"] = 0] = "Const";
    })(TypeModifier = exports.TypeModifier || (exports.TypeModifier = {}));
    var Type = /** @class */ (function () {
        function Type(modifiers) {
            if (modifiers === void 0) { modifiers = []; }
            this.modifiers = modifiers;
        }
        Type.prototype.hasModifier = function (modifier) {
            return this.modifiers.indexOf(modifier) !== -1;
        };
        return Type;
    }());
    exports.Type = Type;
    var BuiltinTypeName;
    (function (BuiltinTypeName) {
        BuiltinTypeName[BuiltinTypeName["Dynamic"] = 0] = "Dynamic";
        BuiltinTypeName[BuiltinTypeName["Bool"] = 1] = "Bool";
        BuiltinTypeName[BuiltinTypeName["String"] = 2] = "String";
        BuiltinTypeName[BuiltinTypeName["Int"] = 3] = "Int";
        BuiltinTypeName[BuiltinTypeName["Number"] = 4] = "Number";
        BuiltinTypeName[BuiltinTypeName["Function"] = 5] = "Function";
        BuiltinTypeName[BuiltinTypeName["Inferred"] = 6] = "Inferred";
        BuiltinTypeName[BuiltinTypeName["None"] = 7] = "None";
    })(BuiltinTypeName = exports.BuiltinTypeName || (exports.BuiltinTypeName = {}));
    var BuiltinType = /** @class */ (function (_super) {
        tslib_1.__extends(BuiltinType, _super);
        function BuiltinType(name, modifiers) {
            var _this = _super.call(this, modifiers) || this;
            _this.name = name;
            return _this;
        }
        BuiltinType.prototype.visitType = function (visitor, context) {
            return visitor.visitBuiltinType(this, context);
        };
        return BuiltinType;
    }(Type));
    exports.BuiltinType = BuiltinType;
    var ExpressionType = /** @class */ (function (_super) {
        tslib_1.__extends(ExpressionType, _super);
        function ExpressionType(value, modifiers, typeParams) {
            if (typeParams === void 0) { typeParams = null; }
            var _this = _super.call(this, modifiers) || this;
            _this.value = value;
            _this.typeParams = typeParams;
            return _this;
        }
        ExpressionType.prototype.visitType = function (visitor, context) {
            return visitor.visitExpressionType(this, context);
        };
        return ExpressionType;
    }(Type));
    exports.ExpressionType = ExpressionType;
    var ArrayType = /** @class */ (function (_super) {
        tslib_1.__extends(ArrayType, _super);
        function ArrayType(of, modifiers) {
            var _this = _super.call(this, modifiers) || this;
            _this.of = of;
            return _this;
        }
        ArrayType.prototype.visitType = function (visitor, context) {
            return visitor.visitArrayType(this, context);
        };
        return ArrayType;
    }(Type));
    exports.ArrayType = ArrayType;
    var MapType = /** @class */ (function (_super) {
        tslib_1.__extends(MapType, _super);
        function MapType(valueType, modifiers) {
            var _this = _super.call(this, modifiers) || this;
            _this.valueType = valueType || null;
            return _this;
        }
        MapType.prototype.visitType = function (visitor, context) {
            return visitor.visitMapType(this, context);
        };
        return MapType;
    }(Type));
    exports.MapType = MapType;
    exports.DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
    exports.INFERRED_TYPE = new BuiltinType(BuiltinTypeName.Inferred);
    exports.BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
    exports.INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
    exports.NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
    exports.STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
    exports.FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
    exports.NONE_TYPE = new BuiltinType(BuiltinTypeName.None);
    ///// Expressions
    var UnaryOperator;
    (function (UnaryOperator) {
        UnaryOperator[UnaryOperator["Minus"] = 0] = "Minus";
        UnaryOperator[UnaryOperator["Plus"] = 1] = "Plus";
    })(UnaryOperator = exports.UnaryOperator || (exports.UnaryOperator = {}));
    var BinaryOperator;
    (function (BinaryOperator) {
        BinaryOperator[BinaryOperator["Equals"] = 0] = "Equals";
        BinaryOperator[BinaryOperator["NotEquals"] = 1] = "NotEquals";
        BinaryOperator[BinaryOperator["Identical"] = 2] = "Identical";
        BinaryOperator[BinaryOperator["NotIdentical"] = 3] = "NotIdentical";
        BinaryOperator[BinaryOperator["Minus"] = 4] = "Minus";
        BinaryOperator[BinaryOperator["Plus"] = 5] = "Plus";
        BinaryOperator[BinaryOperator["Divide"] = 6] = "Divide";
        BinaryOperator[BinaryOperator["Multiply"] = 7] = "Multiply";
        BinaryOperator[BinaryOperator["Modulo"] = 8] = "Modulo";
        BinaryOperator[BinaryOperator["And"] = 9] = "And";
        BinaryOperator[BinaryOperator["Or"] = 10] = "Or";
        BinaryOperator[BinaryOperator["BitwiseAnd"] = 11] = "BitwiseAnd";
        BinaryOperator[BinaryOperator["Lower"] = 12] = "Lower";
        BinaryOperator[BinaryOperator["LowerEquals"] = 13] = "LowerEquals";
        BinaryOperator[BinaryOperator["Bigger"] = 14] = "Bigger";
        BinaryOperator[BinaryOperator["BiggerEquals"] = 15] = "BiggerEquals";
        BinaryOperator[BinaryOperator["NullishCoalesce"] = 16] = "NullishCoalesce";
    })(BinaryOperator = exports.BinaryOperator || (exports.BinaryOperator = {}));
    function nullSafeIsEquivalent(base, other) {
        if (base == null || other == null) {
            return base == other;
        }
        return base.isEquivalent(other);
    }
    exports.nullSafeIsEquivalent = nullSafeIsEquivalent;
    function areAllEquivalentPredicate(base, other, equivalentPredicate) {
        var len = base.length;
        if (len !== other.length) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            if (!equivalentPredicate(base[i], other[i])) {
                return false;
            }
        }
        return true;
    }
    function areAllEquivalent(base, other) {
        return areAllEquivalentPredicate(base, other, function (baseElement, otherElement) { return baseElement.isEquivalent(otherElement); });
    }
    exports.areAllEquivalent = areAllEquivalent;
    var Expression = /** @class */ (function () {
        function Expression(type, sourceSpan) {
            this.type = type || null;
            this.sourceSpan = sourceSpan || null;
        }
        Expression.prototype.prop = function (name, sourceSpan) {
            return new ReadPropExpr(this, name, null, sourceSpan);
        };
        Expression.prototype.key = function (index, type, sourceSpan) {
            return new ReadKeyExpr(this, index, type, sourceSpan);
        };
        Expression.prototype.callMethod = function (name, params, sourceSpan) {
            return new InvokeMethodExpr(this, name, params, null, sourceSpan);
        };
        Expression.prototype.callFn = function (params, sourceSpan, pure) {
            return new InvokeFunctionExpr(this, params, null, sourceSpan, pure);
        };
        Expression.prototype.instantiate = function (params, type, sourceSpan) {
            return new InstantiateExpr(this, params, type, sourceSpan);
        };
        Expression.prototype.conditional = function (trueCase, falseCase, sourceSpan) {
            if (falseCase === void 0) { falseCase = null; }
            return new ConditionalExpr(this, trueCase, falseCase, null, sourceSpan);
        };
        Expression.prototype.equals = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs, null, sourceSpan);
        };
        Expression.prototype.notEquals = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs, null, sourceSpan);
        };
        Expression.prototype.identical = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs, null, sourceSpan);
        };
        Expression.prototype.notIdentical = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs, null, sourceSpan);
        };
        Expression.prototype.minus = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs, null, sourceSpan);
        };
        Expression.prototype.plus = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs, null, sourceSpan);
        };
        Expression.prototype.divide = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs, null, sourceSpan);
        };
        Expression.prototype.multiply = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs, null, sourceSpan);
        };
        Expression.prototype.modulo = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs, null, sourceSpan);
        };
        Expression.prototype.and = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.And, this, rhs, null, sourceSpan);
        };
        Expression.prototype.bitwiseAnd = function (rhs, sourceSpan, parens) {
            if (parens === void 0) { parens = true; }
            return new BinaryOperatorExpr(BinaryOperator.BitwiseAnd, this, rhs, null, sourceSpan, parens);
        };
        Expression.prototype.or = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs, null, sourceSpan);
        };
        Expression.prototype.lower = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs, null, sourceSpan);
        };
        Expression.prototype.lowerEquals = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs, null, sourceSpan);
        };
        Expression.prototype.bigger = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs, null, sourceSpan);
        };
        Expression.prototype.biggerEquals = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs, null, sourceSpan);
        };
        Expression.prototype.isBlank = function (sourceSpan) {
            // Note: We use equals by purpose here to compare to null and undefined in JS.
            // We use the typed null to allow strictNullChecks to narrow types.
            return this.equals(exports.TYPED_NULL_EXPR, sourceSpan);
        };
        Expression.prototype.cast = function (type, sourceSpan) {
            return new CastExpr(this, type, sourceSpan);
        };
        Expression.prototype.nullishCoalesce = function (rhs, sourceSpan) {
            return new BinaryOperatorExpr(BinaryOperator.NullishCoalesce, this, rhs, null, sourceSpan);
        };
        Expression.prototype.toStmt = function () {
            return new ExpressionStatement(this, null);
        };
        return Expression;
    }());
    exports.Expression = Expression;
    var BuiltinVar;
    (function (BuiltinVar) {
        BuiltinVar[BuiltinVar["This"] = 0] = "This";
        BuiltinVar[BuiltinVar["Super"] = 1] = "Super";
        BuiltinVar[BuiltinVar["CatchError"] = 2] = "CatchError";
        BuiltinVar[BuiltinVar["CatchStack"] = 3] = "CatchStack";
    })(BuiltinVar = exports.BuiltinVar || (exports.BuiltinVar = {}));
    var ReadVarExpr = /** @class */ (function (_super) {
        tslib_1.__extends(ReadVarExpr, _super);
        function ReadVarExpr(name, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            if (typeof name === 'string') {
                _this.name = name;
                _this.builtin = null;
            }
            else {
                _this.name = null;
                _this.builtin = name;
            }
            return _this;
        }
        ReadVarExpr.prototype.isEquivalent = function (e) {
            return e instanceof ReadVarExpr && this.name === e.name && this.builtin === e.builtin;
        };
        ReadVarExpr.prototype.isConstant = function () {
            return false;
        };
        ReadVarExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitReadVarExpr(this, context);
        };
        ReadVarExpr.prototype.set = function (value) {
            if (!this.name) {
                throw new Error("Built in variable " + this.builtin + " can not be assigned to.");
            }
            return new WriteVarExpr(this.name, value, null, this.sourceSpan);
        };
        return ReadVarExpr;
    }(Expression));
    exports.ReadVarExpr = ReadVarExpr;
    var TypeofExpr = /** @class */ (function (_super) {
        tslib_1.__extends(TypeofExpr, _super);
        function TypeofExpr(expr, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.expr = expr;
            return _this;
        }
        TypeofExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitTypeofExpr(this, context);
        };
        TypeofExpr.prototype.isEquivalent = function (e) {
            return e instanceof TypeofExpr && e.expr.isEquivalent(this.expr);
        };
        TypeofExpr.prototype.isConstant = function () {
            return this.expr.isConstant();
        };
        return TypeofExpr;
    }(Expression));
    exports.TypeofExpr = TypeofExpr;
    var WrappedNodeExpr = /** @class */ (function (_super) {
        tslib_1.__extends(WrappedNodeExpr, _super);
        function WrappedNodeExpr(node, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.node = node;
            return _this;
        }
        WrappedNodeExpr.prototype.isEquivalent = function (e) {
            return e instanceof WrappedNodeExpr && this.node === e.node;
        };
        WrappedNodeExpr.prototype.isConstant = function () {
            return false;
        };
        WrappedNodeExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitWrappedNodeExpr(this, context);
        };
        return WrappedNodeExpr;
    }(Expression));
    exports.WrappedNodeExpr = WrappedNodeExpr;
    var WriteVarExpr = /** @class */ (function (_super) {
        tslib_1.__extends(WriteVarExpr, _super);
        function WriteVarExpr(name, value, type, sourceSpan) {
            var _this = _super.call(this, type || value.type, sourceSpan) || this;
            _this.name = name;
            _this.value = value;
            return _this;
        }
        WriteVarExpr.prototype.isEquivalent = function (e) {
            return e instanceof WriteVarExpr && this.name === e.name && this.value.isEquivalent(e.value);
        };
        WriteVarExpr.prototype.isConstant = function () {
            return false;
        };
        WriteVarExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitWriteVarExpr(this, context);
        };
        WriteVarExpr.prototype.toDeclStmt = function (type, modifiers) {
            return new DeclareVarStmt(this.name, this.value, type, modifiers, this.sourceSpan);
        };
        WriteVarExpr.prototype.toConstDecl = function () {
            return this.toDeclStmt(exports.INFERRED_TYPE, [StmtModifier.Final]);
        };
        return WriteVarExpr;
    }(Expression));
    exports.WriteVarExpr = WriteVarExpr;
    var WriteKeyExpr = /** @class */ (function (_super) {
        tslib_1.__extends(WriteKeyExpr, _super);
        function WriteKeyExpr(receiver, index, value, type, sourceSpan) {
            var _this = _super.call(this, type || value.type, sourceSpan) || this;
            _this.receiver = receiver;
            _this.index = index;
            _this.value = value;
            return _this;
        }
        WriteKeyExpr.prototype.isEquivalent = function (e) {
            return e instanceof WriteKeyExpr && this.receiver.isEquivalent(e.receiver) &&
                this.index.isEquivalent(e.index) && this.value.isEquivalent(e.value);
        };
        WriteKeyExpr.prototype.isConstant = function () {
            return false;
        };
        WriteKeyExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitWriteKeyExpr(this, context);
        };
        return WriteKeyExpr;
    }(Expression));
    exports.WriteKeyExpr = WriteKeyExpr;
    var WritePropExpr = /** @class */ (function (_super) {
        tslib_1.__extends(WritePropExpr, _super);
        function WritePropExpr(receiver, name, value, type, sourceSpan) {
            var _this = _super.call(this, type || value.type, sourceSpan) || this;
            _this.receiver = receiver;
            _this.name = name;
            _this.value = value;
            return _this;
        }
        WritePropExpr.prototype.isEquivalent = function (e) {
            return e instanceof WritePropExpr && this.receiver.isEquivalent(e.receiver) &&
                this.name === e.name && this.value.isEquivalent(e.value);
        };
        WritePropExpr.prototype.isConstant = function () {
            return false;
        };
        WritePropExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitWritePropExpr(this, context);
        };
        return WritePropExpr;
    }(Expression));
    exports.WritePropExpr = WritePropExpr;
    var BuiltinMethod;
    (function (BuiltinMethod) {
        BuiltinMethod[BuiltinMethod["ConcatArray"] = 0] = "ConcatArray";
        BuiltinMethod[BuiltinMethod["SubscribeObservable"] = 1] = "SubscribeObservable";
        BuiltinMethod[BuiltinMethod["Bind"] = 2] = "Bind";
    })(BuiltinMethod = exports.BuiltinMethod || (exports.BuiltinMethod = {}));
    var InvokeMethodExpr = /** @class */ (function (_super) {
        tslib_1.__extends(InvokeMethodExpr, _super);
        function InvokeMethodExpr(receiver, method, args, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.receiver = receiver;
            _this.args = args;
            if (typeof method === 'string') {
                _this.name = method;
                _this.builtin = null;
            }
            else {
                _this.name = null;
                _this.builtin = method;
            }
            return _this;
        }
        InvokeMethodExpr.prototype.isEquivalent = function (e) {
            return e instanceof InvokeMethodExpr && this.receiver.isEquivalent(e.receiver) &&
                this.name === e.name && this.builtin === e.builtin && areAllEquivalent(this.args, e.args);
        };
        InvokeMethodExpr.prototype.isConstant = function () {
            return false;
        };
        InvokeMethodExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitInvokeMethodExpr(this, context);
        };
        return InvokeMethodExpr;
    }(Expression));
    exports.InvokeMethodExpr = InvokeMethodExpr;
    var InvokeFunctionExpr = /** @class */ (function (_super) {
        tslib_1.__extends(InvokeFunctionExpr, _super);
        function InvokeFunctionExpr(fn, args, type, sourceSpan, pure) {
            if (pure === void 0) { pure = false; }
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.fn = fn;
            _this.args = args;
            _this.pure = pure;
            return _this;
        }
        InvokeFunctionExpr.prototype.isEquivalent = function (e) {
            return e instanceof InvokeFunctionExpr && this.fn.isEquivalent(e.fn) &&
                areAllEquivalent(this.args, e.args) && this.pure === e.pure;
        };
        InvokeFunctionExpr.prototype.isConstant = function () {
            return false;
        };
        InvokeFunctionExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitInvokeFunctionExpr(this, context);
        };
        return InvokeFunctionExpr;
    }(Expression));
    exports.InvokeFunctionExpr = InvokeFunctionExpr;
    var TaggedTemplateExpr = /** @class */ (function (_super) {
        tslib_1.__extends(TaggedTemplateExpr, _super);
        function TaggedTemplateExpr(tag, template, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.tag = tag;
            _this.template = template;
            return _this;
        }
        TaggedTemplateExpr.prototype.isEquivalent = function (e) {
            return e instanceof TaggedTemplateExpr && this.tag.isEquivalent(e.tag) &&
                areAllEquivalentPredicate(this.template.elements, e.template.elements, function (a, b) { return a.text === b.text; }) &&
                areAllEquivalent(this.template.expressions, e.template.expressions);
        };
        TaggedTemplateExpr.prototype.isConstant = function () {
            return false;
        };
        TaggedTemplateExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitTaggedTemplateExpr(this, context);
        };
        return TaggedTemplateExpr;
    }(Expression));
    exports.TaggedTemplateExpr = TaggedTemplateExpr;
    var InstantiateExpr = /** @class */ (function (_super) {
        tslib_1.__extends(InstantiateExpr, _super);
        function InstantiateExpr(classExpr, args, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.classExpr = classExpr;
            _this.args = args;
            return _this;
        }
        InstantiateExpr.prototype.isEquivalent = function (e) {
            return e instanceof InstantiateExpr && this.classExpr.isEquivalent(e.classExpr) &&
                areAllEquivalent(this.args, e.args);
        };
        InstantiateExpr.prototype.isConstant = function () {
            return false;
        };
        InstantiateExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitInstantiateExpr(this, context);
        };
        return InstantiateExpr;
    }(Expression));
    exports.InstantiateExpr = InstantiateExpr;
    var LiteralExpr = /** @class */ (function (_super) {
        tslib_1.__extends(LiteralExpr, _super);
        function LiteralExpr(value, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.value = value;
            return _this;
        }
        LiteralExpr.prototype.isEquivalent = function (e) {
            return e instanceof LiteralExpr && this.value === e.value;
        };
        LiteralExpr.prototype.isConstant = function () {
            return true;
        };
        LiteralExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitLiteralExpr(this, context);
        };
        return LiteralExpr;
    }(Expression));
    exports.LiteralExpr = LiteralExpr;
    var TemplateLiteral = /** @class */ (function () {
        function TemplateLiteral(elements, expressions) {
            this.elements = elements;
            this.expressions = expressions;
        }
        return TemplateLiteral;
    }());
    exports.TemplateLiteral = TemplateLiteral;
    var TemplateLiteralElement = /** @class */ (function () {
        function TemplateLiteralElement(text, sourceSpan, rawText) {
            var _a;
            this.text = text;
            this.sourceSpan = sourceSpan;
            // If `rawText` is not provided, try to extract the raw string from its
            // associated `sourceSpan`. If that is also not available, "fake" the raw
            // string instead by escaping the following control sequences:
            // - "\" would otherwise indicate that the next character is a control character.
            // - "`" and "${" are template string control sequences that would otherwise prematurely
            // indicate the end of the template literal element.
            this.rawText =
                (_a = rawText !== null && rawText !== void 0 ? rawText : sourceSpan === null || sourceSpan === void 0 ? void 0 : sourceSpan.toString()) !== null && _a !== void 0 ? _a : escapeForTemplateLiteral(escapeSlashes(text));
        }
        return TemplateLiteralElement;
    }());
    exports.TemplateLiteralElement = TemplateLiteralElement;
    var MessagePiece = /** @class */ (function () {
        function MessagePiece(text, sourceSpan) {
            this.text = text;
            this.sourceSpan = sourceSpan;
        }
        return MessagePiece;
    }());
    exports.MessagePiece = MessagePiece;
    var LiteralPiece = /** @class */ (function (_super) {
        tslib_1.__extends(LiteralPiece, _super);
        function LiteralPiece() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return LiteralPiece;
    }(MessagePiece));
    exports.LiteralPiece = LiteralPiece;
    var PlaceholderPiece = /** @class */ (function (_super) {
        tslib_1.__extends(PlaceholderPiece, _super);
        function PlaceholderPiece() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return PlaceholderPiece;
    }(MessagePiece));
    exports.PlaceholderPiece = PlaceholderPiece;
    var LocalizedString = /** @class */ (function (_super) {
        tslib_1.__extends(LocalizedString, _super);
        function LocalizedString(metaBlock, messageParts, placeHolderNames, expressions, sourceSpan) {
            var _this = _super.call(this, exports.STRING_TYPE, sourceSpan) || this;
            _this.metaBlock = metaBlock;
            _this.messageParts = messageParts;
            _this.placeHolderNames = placeHolderNames;
            _this.expressions = expressions;
            return _this;
        }
        LocalizedString.prototype.isEquivalent = function (e) {
            // return e instanceof LocalizedString && this.message === e.message;
            return false;
        };
        LocalizedString.prototype.isConstant = function () {
            return false;
        };
        LocalizedString.prototype.visitExpression = function (visitor, context) {
            return visitor.visitLocalizedString(this, context);
        };
        /**
         * Serialize the given `meta` and `messagePart` into "cooked" and "raw" strings that can be used
         * in a `$localize` tagged string. The format of the metadata is the same as that parsed by
         * `parseI18nMeta()`.
         *
         * @param meta The metadata to serialize
         * @param messagePart The first part of the tagged string
         */
        LocalizedString.prototype.serializeI18nHead = function () {
            var MEANING_SEPARATOR = '|';
            var ID_SEPARATOR = '@@';
            var LEGACY_ID_INDICATOR = '␟';
            var metaBlock = this.metaBlock.description || '';
            if (this.metaBlock.meaning) {
                metaBlock = "" + this.metaBlock.meaning + MEANING_SEPARATOR + metaBlock;
            }
            if (this.metaBlock.customId) {
                metaBlock = "" + metaBlock + ID_SEPARATOR + this.metaBlock.customId;
            }
            if (this.metaBlock.legacyIds) {
                this.metaBlock.legacyIds.forEach(function (legacyId) {
                    metaBlock = "" + metaBlock + LEGACY_ID_INDICATOR + legacyId;
                });
            }
            return createCookedRawString(metaBlock, this.messageParts[0].text, this.getMessagePartSourceSpan(0));
        };
        LocalizedString.prototype.getMessagePartSourceSpan = function (i) {
            var _a, _b;
            return (_b = (_a = this.messageParts[i]) === null || _a === void 0 ? void 0 : _a.sourceSpan) !== null && _b !== void 0 ? _b : this.sourceSpan;
        };
        LocalizedString.prototype.getPlaceholderSourceSpan = function (i) {
            var _a, _b, _c, _d;
            return (_d = (_b = (_a = this.placeHolderNames[i]) === null || _a === void 0 ? void 0 : _a.sourceSpan) !== null && _b !== void 0 ? _b : (_c = this.expressions[i]) === null || _c === void 0 ? void 0 : _c.sourceSpan) !== null && _d !== void 0 ? _d : this.sourceSpan;
        };
        /**
         * Serialize the given `placeholderName` and `messagePart` into "cooked" and "raw" strings that
         * can be used in a `$localize` tagged string.
         *
         * @param placeholderName The placeholder name to serialize
         * @param messagePart The following message string after this placeholder
         */
        LocalizedString.prototype.serializeI18nTemplatePart = function (partIndex) {
            var placeholderName = this.placeHolderNames[partIndex - 1].text;
            var messagePart = this.messageParts[partIndex];
            return createCookedRawString(placeholderName, messagePart.text, this.getMessagePartSourceSpan(partIndex));
        };
        return LocalizedString;
    }(Expression));
    exports.LocalizedString = LocalizedString;
    var escapeSlashes = function (str) { return str.replace(/\\/g, '\\\\'); };
    var escapeStartingColon = function (str) { return str.replace(/^:/, '\\:'); };
    var escapeColons = function (str) { return str.replace(/:/g, '\\:'); };
    var escapeForTemplateLiteral = function (str) {
        return str.replace(/`/g, '\\`').replace(/\${/g, '$\\{');
    };
    /**
     * Creates a `{cooked, raw}` object from the `metaBlock` and `messagePart`.
     *
     * The `raw` text must have various character sequences escaped:
     * * "\" would otherwise indicate that the next character is a control character.
     * * "`" and "${" are template string control sequences that would otherwise prematurely indicate
     *   the end of a message part.
     * * ":" inside a metablock would prematurely indicate the end of the metablock.
     * * ":" at the start of a messagePart with no metablock would erroneously indicate the start of a
     *   metablock.
     *
     * @param metaBlock Any metadata that should be prepended to the string
     * @param messagePart The message part of the string
     */
    function createCookedRawString(metaBlock, messagePart, range) {
        if (metaBlock === '') {
            return {
                cooked: messagePart,
                raw: escapeForTemplateLiteral(escapeStartingColon(escapeSlashes(messagePart))),
                range: range,
            };
        }
        else {
            return {
                cooked: ":" + metaBlock + ":" + messagePart,
                raw: escapeForTemplateLiteral(":" + escapeColons(escapeSlashes(metaBlock)) + ":" + escapeSlashes(messagePart)),
                range: range,
            };
        }
    }
    var ExternalExpr = /** @class */ (function (_super) {
        tslib_1.__extends(ExternalExpr, _super);
        function ExternalExpr(value, type, typeParams, sourceSpan) {
            if (typeParams === void 0) { typeParams = null; }
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.value = value;
            _this.typeParams = typeParams;
            return _this;
        }
        ExternalExpr.prototype.isEquivalent = function (e) {
            return e instanceof ExternalExpr && this.value.name === e.value.name &&
                this.value.moduleName === e.value.moduleName && this.value.runtime === e.value.runtime;
        };
        ExternalExpr.prototype.isConstant = function () {
            return false;
        };
        ExternalExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitExternalExpr(this, context);
        };
        return ExternalExpr;
    }(Expression));
    exports.ExternalExpr = ExternalExpr;
    var ExternalReference = /** @class */ (function () {
        function ExternalReference(moduleName, name, runtime) {
            this.moduleName = moduleName;
            this.name = name;
            this.runtime = runtime;
        }
        return ExternalReference;
    }());
    exports.ExternalReference = ExternalReference;
    var ConditionalExpr = /** @class */ (function (_super) {
        tslib_1.__extends(ConditionalExpr, _super);
        function ConditionalExpr(condition, trueCase, falseCase, type, sourceSpan) {
            if (falseCase === void 0) { falseCase = null; }
            var _this = _super.call(this, type || trueCase.type, sourceSpan) || this;
            _this.condition = condition;
            _this.falseCase = falseCase;
            _this.trueCase = trueCase;
            return _this;
        }
        ConditionalExpr.prototype.isEquivalent = function (e) {
            return e instanceof ConditionalExpr && this.condition.isEquivalent(e.condition) &&
                this.trueCase.isEquivalent(e.trueCase) && nullSafeIsEquivalent(this.falseCase, e.falseCase);
        };
        ConditionalExpr.prototype.isConstant = function () {
            return false;
        };
        ConditionalExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitConditionalExpr(this, context);
        };
        return ConditionalExpr;
    }(Expression));
    exports.ConditionalExpr = ConditionalExpr;
    var NotExpr = /** @class */ (function (_super) {
        tslib_1.__extends(NotExpr, _super);
        function NotExpr(condition, sourceSpan) {
            var _this = _super.call(this, exports.BOOL_TYPE, sourceSpan) || this;
            _this.condition = condition;
            return _this;
        }
        NotExpr.prototype.isEquivalent = function (e) {
            return e instanceof NotExpr && this.condition.isEquivalent(e.condition);
        };
        NotExpr.prototype.isConstant = function () {
            return false;
        };
        NotExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitNotExpr(this, context);
        };
        return NotExpr;
    }(Expression));
    exports.NotExpr = NotExpr;
    var AssertNotNull = /** @class */ (function (_super) {
        tslib_1.__extends(AssertNotNull, _super);
        function AssertNotNull(condition, sourceSpan) {
            var _this = _super.call(this, condition.type, sourceSpan) || this;
            _this.condition = condition;
            return _this;
        }
        AssertNotNull.prototype.isEquivalent = function (e) {
            return e instanceof AssertNotNull && this.condition.isEquivalent(e.condition);
        };
        AssertNotNull.prototype.isConstant = function () {
            return false;
        };
        AssertNotNull.prototype.visitExpression = function (visitor, context) {
            return visitor.visitAssertNotNullExpr(this, context);
        };
        return AssertNotNull;
    }(Expression));
    exports.AssertNotNull = AssertNotNull;
    var CastExpr = /** @class */ (function (_super) {
        tslib_1.__extends(CastExpr, _super);
        function CastExpr(value, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.value = value;
            return _this;
        }
        CastExpr.prototype.isEquivalent = function (e) {
            return e instanceof CastExpr && this.value.isEquivalent(e.value);
        };
        CastExpr.prototype.isConstant = function () {
            return false;
        };
        CastExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitCastExpr(this, context);
        };
        return CastExpr;
    }(Expression));
    exports.CastExpr = CastExpr;
    var FnParam = /** @class */ (function () {
        function FnParam(name, type) {
            if (type === void 0) { type = null; }
            this.name = name;
            this.type = type;
        }
        FnParam.prototype.isEquivalent = function (param) {
            return this.name === param.name;
        };
        return FnParam;
    }());
    exports.FnParam = FnParam;
    var FunctionExpr = /** @class */ (function (_super) {
        tslib_1.__extends(FunctionExpr, _super);
        function FunctionExpr(params, statements, type, sourceSpan, name) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.params = params;
            _this.statements = statements;
            _this.name = name;
            return _this;
        }
        FunctionExpr.prototype.isEquivalent = function (e) {
            return e instanceof FunctionExpr && areAllEquivalent(this.params, e.params) &&
                areAllEquivalent(this.statements, e.statements);
        };
        FunctionExpr.prototype.isConstant = function () {
            return false;
        };
        FunctionExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitFunctionExpr(this, context);
        };
        FunctionExpr.prototype.toDeclStmt = function (name, modifiers) {
            return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers, this.sourceSpan);
        };
        return FunctionExpr;
    }(Expression));
    exports.FunctionExpr = FunctionExpr;
    var UnaryOperatorExpr = /** @class */ (function (_super) {
        tslib_1.__extends(UnaryOperatorExpr, _super);
        function UnaryOperatorExpr(operator, expr, type, sourceSpan, parens) {
            if (parens === void 0) { parens = true; }
            var _this = _super.call(this, type || exports.NUMBER_TYPE, sourceSpan) || this;
            _this.operator = operator;
            _this.expr = expr;
            _this.parens = parens;
            return _this;
        }
        UnaryOperatorExpr.prototype.isEquivalent = function (e) {
            return e instanceof UnaryOperatorExpr && this.operator === e.operator &&
                this.expr.isEquivalent(e.expr);
        };
        UnaryOperatorExpr.prototype.isConstant = function () {
            return false;
        };
        UnaryOperatorExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitUnaryOperatorExpr(this, context);
        };
        return UnaryOperatorExpr;
    }(Expression));
    exports.UnaryOperatorExpr = UnaryOperatorExpr;
    var BinaryOperatorExpr = /** @class */ (function (_super) {
        tslib_1.__extends(BinaryOperatorExpr, _super);
        function BinaryOperatorExpr(operator, lhs, rhs, type, sourceSpan, parens) {
            if (parens === void 0) { parens = true; }
            var _this = _super.call(this, type || lhs.type, sourceSpan) || this;
            _this.operator = operator;
            _this.rhs = rhs;
            _this.parens = parens;
            _this.lhs = lhs;
            return _this;
        }
        BinaryOperatorExpr.prototype.isEquivalent = function (e) {
            return e instanceof BinaryOperatorExpr && this.operator === e.operator &&
                this.lhs.isEquivalent(e.lhs) && this.rhs.isEquivalent(e.rhs);
        };
        BinaryOperatorExpr.prototype.isConstant = function () {
            return false;
        };
        BinaryOperatorExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitBinaryOperatorExpr(this, context);
        };
        return BinaryOperatorExpr;
    }(Expression));
    exports.BinaryOperatorExpr = BinaryOperatorExpr;
    var ReadPropExpr = /** @class */ (function (_super) {
        tslib_1.__extends(ReadPropExpr, _super);
        function ReadPropExpr(receiver, name, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.receiver = receiver;
            _this.name = name;
            return _this;
        }
        ReadPropExpr.prototype.isEquivalent = function (e) {
            return e instanceof ReadPropExpr && this.receiver.isEquivalent(e.receiver) &&
                this.name === e.name;
        };
        ReadPropExpr.prototype.isConstant = function () {
            return false;
        };
        ReadPropExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitReadPropExpr(this, context);
        };
        ReadPropExpr.prototype.set = function (value) {
            return new WritePropExpr(this.receiver, this.name, value, null, this.sourceSpan);
        };
        return ReadPropExpr;
    }(Expression));
    exports.ReadPropExpr = ReadPropExpr;
    var ReadKeyExpr = /** @class */ (function (_super) {
        tslib_1.__extends(ReadKeyExpr, _super);
        function ReadKeyExpr(receiver, index, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.receiver = receiver;
            _this.index = index;
            return _this;
        }
        ReadKeyExpr.prototype.isEquivalent = function (e) {
            return e instanceof ReadKeyExpr && this.receiver.isEquivalent(e.receiver) &&
                this.index.isEquivalent(e.index);
        };
        ReadKeyExpr.prototype.isConstant = function () {
            return false;
        };
        ReadKeyExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitReadKeyExpr(this, context);
        };
        ReadKeyExpr.prototype.set = function (value) {
            return new WriteKeyExpr(this.receiver, this.index, value, null, this.sourceSpan);
        };
        return ReadKeyExpr;
    }(Expression));
    exports.ReadKeyExpr = ReadKeyExpr;
    var LiteralArrayExpr = /** @class */ (function (_super) {
        tslib_1.__extends(LiteralArrayExpr, _super);
        function LiteralArrayExpr(entries, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.entries = entries;
            return _this;
        }
        LiteralArrayExpr.prototype.isConstant = function () {
            return this.entries.every(function (e) { return e.isConstant(); });
        };
        LiteralArrayExpr.prototype.isEquivalent = function (e) {
            return e instanceof LiteralArrayExpr && areAllEquivalent(this.entries, e.entries);
        };
        LiteralArrayExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitLiteralArrayExpr(this, context);
        };
        return LiteralArrayExpr;
    }(Expression));
    exports.LiteralArrayExpr = LiteralArrayExpr;
    var LiteralMapEntry = /** @class */ (function () {
        function LiteralMapEntry(key, value, quoted) {
            this.key = key;
            this.value = value;
            this.quoted = quoted;
        }
        LiteralMapEntry.prototype.isEquivalent = function (e) {
            return this.key === e.key && this.value.isEquivalent(e.value);
        };
        return LiteralMapEntry;
    }());
    exports.LiteralMapEntry = LiteralMapEntry;
    var LiteralMapExpr = /** @class */ (function (_super) {
        tslib_1.__extends(LiteralMapExpr, _super);
        function LiteralMapExpr(entries, type, sourceSpan) {
            var _this = _super.call(this, type, sourceSpan) || this;
            _this.entries = entries;
            _this.valueType = null;
            if (type) {
                _this.valueType = type.valueType;
            }
            return _this;
        }
        LiteralMapExpr.prototype.isEquivalent = function (e) {
            return e instanceof LiteralMapExpr && areAllEquivalent(this.entries, e.entries);
        };
        LiteralMapExpr.prototype.isConstant = function () {
            return this.entries.every(function (e) { return e.value.isConstant(); });
        };
        LiteralMapExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitLiteralMapExpr(this, context);
        };
        return LiteralMapExpr;
    }(Expression));
    exports.LiteralMapExpr = LiteralMapExpr;
    var CommaExpr = /** @class */ (function (_super) {
        tslib_1.__extends(CommaExpr, _super);
        function CommaExpr(parts, sourceSpan) {
            var _this = _super.call(this, parts[parts.length - 1].type, sourceSpan) || this;
            _this.parts = parts;
            return _this;
        }
        CommaExpr.prototype.isEquivalent = function (e) {
            return e instanceof CommaExpr && areAllEquivalent(this.parts, e.parts);
        };
        CommaExpr.prototype.isConstant = function () {
            return false;
        };
        CommaExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitCommaExpr(this, context);
        };
        return CommaExpr;
    }(Expression));
    exports.CommaExpr = CommaExpr;
    exports.THIS_EXPR = new ReadVarExpr(BuiltinVar.This, null, null);
    exports.SUPER_EXPR = new ReadVarExpr(BuiltinVar.Super, null, null);
    exports.CATCH_ERROR_VAR = new ReadVarExpr(BuiltinVar.CatchError, null, null);
    exports.CATCH_STACK_VAR = new ReadVarExpr(BuiltinVar.CatchStack, null, null);
    exports.NULL_EXPR = new LiteralExpr(null, null, null);
    exports.TYPED_NULL_EXPR = new LiteralExpr(null, exports.INFERRED_TYPE, null);
    //// Statements
    var StmtModifier;
    (function (StmtModifier) {
        StmtModifier[StmtModifier["Final"] = 0] = "Final";
        StmtModifier[StmtModifier["Private"] = 1] = "Private";
        StmtModifier[StmtModifier["Exported"] = 2] = "Exported";
        StmtModifier[StmtModifier["Static"] = 3] = "Static";
    })(StmtModifier = exports.StmtModifier || (exports.StmtModifier = {}));
    var LeadingComment = /** @class */ (function () {
        function LeadingComment(text, multiline, trailingNewline) {
            this.text = text;
            this.multiline = multiline;
            this.trailingNewline = trailingNewline;
        }
        LeadingComment.prototype.toString = function () {
            return this.multiline ? " " + this.text + " " : this.text;
        };
        return LeadingComment;
    }());
    exports.LeadingComment = LeadingComment;
    var JSDocComment = /** @class */ (function (_super) {
        tslib_1.__extends(JSDocComment, _super);
        function JSDocComment(tags) {
            var _this = _super.call(this, '', /* multiline */ true, /* trailingNewline */ true) || this;
            _this.tags = tags;
            return _this;
        }
        JSDocComment.prototype.toString = function () {
            return serializeTags(this.tags);
        };
        return JSDocComment;
    }(LeadingComment));
    exports.JSDocComment = JSDocComment;
    var Statement = /** @class */ (function () {
        function Statement(modifiers, sourceSpan, leadingComments) {
            if (modifiers === void 0) { modifiers = []; }
            if (sourceSpan === void 0) { sourceSpan = null; }
            this.modifiers = modifiers;
            this.sourceSpan = sourceSpan;
            this.leadingComments = leadingComments;
        }
        Statement.prototype.hasModifier = function (modifier) {
            return this.modifiers.indexOf(modifier) !== -1;
        };
        Statement.prototype.addLeadingComment = function (leadingComment) {
            var _a;
            this.leadingComments = (_a = this.leadingComments) !== null && _a !== void 0 ? _a : [];
            this.leadingComments.push(leadingComment);
        };
        return Statement;
    }());
    exports.Statement = Statement;
    var DeclareVarStmt = /** @class */ (function (_super) {
        tslib_1.__extends(DeclareVarStmt, _super);
        function DeclareVarStmt(name, value, type, modifiers, sourceSpan, leadingComments) {
            var _this = _super.call(this, modifiers, sourceSpan, leadingComments) || this;
            _this.name = name;
            _this.value = value;
            _this.type = type || (value && value.type) || null;
            return _this;
        }
        DeclareVarStmt.prototype.isEquivalent = function (stmt) {
            return stmt instanceof DeclareVarStmt && this.name === stmt.name &&
                (this.value ? !!stmt.value && this.value.isEquivalent(stmt.value) : !stmt.value);
        };
        DeclareVarStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitDeclareVarStmt(this, context);
        };
        return DeclareVarStmt;
    }(Statement));
    exports.DeclareVarStmt = DeclareVarStmt;
    var DeclareFunctionStmt = /** @class */ (function (_super) {
        tslib_1.__extends(DeclareFunctionStmt, _super);
        function DeclareFunctionStmt(name, params, statements, type, modifiers, sourceSpan, leadingComments) {
            var _this = _super.call(this, modifiers, sourceSpan, leadingComments) || this;
            _this.name = name;
            _this.params = params;
            _this.statements = statements;
            _this.type = type || null;
            return _this;
        }
        DeclareFunctionStmt.prototype.isEquivalent = function (stmt) {
            return stmt instanceof DeclareFunctionStmt && areAllEquivalent(this.params, stmt.params) &&
                areAllEquivalent(this.statements, stmt.statements);
        };
        DeclareFunctionStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitDeclareFunctionStmt(this, context);
        };
        return DeclareFunctionStmt;
    }(Statement));
    exports.DeclareFunctionStmt = DeclareFunctionStmt;
    var ExpressionStatement = /** @class */ (function (_super) {
        tslib_1.__extends(ExpressionStatement, _super);
        function ExpressionStatement(expr, sourceSpan, leadingComments) {
            var _this = _super.call(this, [], sourceSpan, leadingComments) || this;
            _this.expr = expr;
            return _this;
        }
        ExpressionStatement.prototype.isEquivalent = function (stmt) {
            return stmt instanceof ExpressionStatement && this.expr.isEquivalent(stmt.expr);
        };
        ExpressionStatement.prototype.visitStatement = function (visitor, context) {
            return visitor.visitExpressionStmt(this, context);
        };
        return ExpressionStatement;
    }(Statement));
    exports.ExpressionStatement = ExpressionStatement;
    var ReturnStatement = /** @class */ (function (_super) {
        tslib_1.__extends(ReturnStatement, _super);
        function ReturnStatement(value, sourceSpan, leadingComments) {
            if (sourceSpan === void 0) { sourceSpan = null; }
            var _this = _super.call(this, [], sourceSpan, leadingComments) || this;
            _this.value = value;
            return _this;
        }
        ReturnStatement.prototype.isEquivalent = function (stmt) {
            return stmt instanceof ReturnStatement && this.value.isEquivalent(stmt.value);
        };
        ReturnStatement.prototype.visitStatement = function (visitor, context) {
            return visitor.visitReturnStmt(this, context);
        };
        return ReturnStatement;
    }(Statement));
    exports.ReturnStatement = ReturnStatement;
    var AbstractClassPart = /** @class */ (function () {
        function AbstractClassPart(type, modifiers) {
            if (type === void 0) { type = null; }
            if (modifiers === void 0) { modifiers = []; }
            this.type = type;
            this.modifiers = modifiers;
        }
        AbstractClassPart.prototype.hasModifier = function (modifier) {
            return this.modifiers.indexOf(modifier) !== -1;
        };
        return AbstractClassPart;
    }());
    exports.AbstractClassPart = AbstractClassPart;
    var ClassField = /** @class */ (function (_super) {
        tslib_1.__extends(ClassField, _super);
        function ClassField(name, type, modifiers, initializer) {
            var _this = _super.call(this, type, modifiers) || this;
            _this.name = name;
            _this.initializer = initializer;
            return _this;
        }
        ClassField.prototype.isEquivalent = function (f) {
            return this.name === f.name;
        };
        return ClassField;
    }(AbstractClassPart));
    exports.ClassField = ClassField;
    var ClassMethod = /** @class */ (function (_super) {
        tslib_1.__extends(ClassMethod, _super);
        function ClassMethod(name, params, body, type, modifiers) {
            var _this = _super.call(this, type, modifiers) || this;
            _this.name = name;
            _this.params = params;
            _this.body = body;
            return _this;
        }
        ClassMethod.prototype.isEquivalent = function (m) {
            return this.name === m.name && areAllEquivalent(this.body, m.body);
        };
        return ClassMethod;
    }(AbstractClassPart));
    exports.ClassMethod = ClassMethod;
    var ClassGetter = /** @class */ (function (_super) {
        tslib_1.__extends(ClassGetter, _super);
        function ClassGetter(name, body, type, modifiers) {
            var _this = _super.call(this, type, modifiers) || this;
            _this.name = name;
            _this.body = body;
            return _this;
        }
        ClassGetter.prototype.isEquivalent = function (m) {
            return this.name === m.name && areAllEquivalent(this.body, m.body);
        };
        return ClassGetter;
    }(AbstractClassPart));
    exports.ClassGetter = ClassGetter;
    var ClassStmt = /** @class */ (function (_super) {
        tslib_1.__extends(ClassStmt, _super);
        function ClassStmt(name, parent, fields, getters, constructorMethod, methods, modifiers, sourceSpan, leadingComments) {
            var _this = _super.call(this, modifiers, sourceSpan, leadingComments) || this;
            _this.name = name;
            _this.parent = parent;
            _this.fields = fields;
            _this.getters = getters;
            _this.constructorMethod = constructorMethod;
            _this.methods = methods;
            return _this;
        }
        ClassStmt.prototype.isEquivalent = function (stmt) {
            return stmt instanceof ClassStmt && this.name === stmt.name &&
                nullSafeIsEquivalent(this.parent, stmt.parent) &&
                areAllEquivalent(this.fields, stmt.fields) &&
                areAllEquivalent(this.getters, stmt.getters) &&
                this.constructorMethod.isEquivalent(stmt.constructorMethod) &&
                areAllEquivalent(this.methods, stmt.methods);
        };
        ClassStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitDeclareClassStmt(this, context);
        };
        return ClassStmt;
    }(Statement));
    exports.ClassStmt = ClassStmt;
    var IfStmt = /** @class */ (function (_super) {
        tslib_1.__extends(IfStmt, _super);
        function IfStmt(condition, trueCase, falseCase, sourceSpan, leadingComments) {
            if (falseCase === void 0) { falseCase = []; }
            var _this = _super.call(this, [], sourceSpan, leadingComments) || this;
            _this.condition = condition;
            _this.trueCase = trueCase;
            _this.falseCase = falseCase;
            return _this;
        }
        IfStmt.prototype.isEquivalent = function (stmt) {
            return stmt instanceof IfStmt && this.condition.isEquivalent(stmt.condition) &&
                areAllEquivalent(this.trueCase, stmt.trueCase) &&
                areAllEquivalent(this.falseCase, stmt.falseCase);
        };
        IfStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitIfStmt(this, context);
        };
        return IfStmt;
    }(Statement));
    exports.IfStmt = IfStmt;
    var TryCatchStmt = /** @class */ (function (_super) {
        tslib_1.__extends(TryCatchStmt, _super);
        function TryCatchStmt(bodyStmts, catchStmts, sourceSpan, leadingComments) {
            if (sourceSpan === void 0) { sourceSpan = null; }
            var _this = _super.call(this, [], sourceSpan, leadingComments) || this;
            _this.bodyStmts = bodyStmts;
            _this.catchStmts = catchStmts;
            return _this;
        }
        TryCatchStmt.prototype.isEquivalent = function (stmt) {
            return stmt instanceof TryCatchStmt && areAllEquivalent(this.bodyStmts, stmt.bodyStmts) &&
                areAllEquivalent(this.catchStmts, stmt.catchStmts);
        };
        TryCatchStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitTryCatchStmt(this, context);
        };
        return TryCatchStmt;
    }(Statement));
    exports.TryCatchStmt = TryCatchStmt;
    var ThrowStmt = /** @class */ (function (_super) {
        tslib_1.__extends(ThrowStmt, _super);
        function ThrowStmt(error, sourceSpan, leadingComments) {
            if (sourceSpan === void 0) { sourceSpan = null; }
            var _this = _super.call(this, [], sourceSpan, leadingComments) || this;
            _this.error = error;
            return _this;
        }
        ThrowStmt.prototype.isEquivalent = function (stmt) {
            return stmt instanceof TryCatchStmt && this.error.isEquivalent(stmt.error);
        };
        ThrowStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitThrowStmt(this, context);
        };
        return ThrowStmt;
    }(Statement));
    exports.ThrowStmt = ThrowStmt;
    var AstTransformer = /** @class */ (function () {
        function AstTransformer() {
        }
        AstTransformer.prototype.transformExpr = function (expr, context) {
            return expr;
        };
        AstTransformer.prototype.transformStmt = function (stmt, context) {
            return stmt;
        };
        AstTransformer.prototype.visitReadVarExpr = function (ast, context) {
            return this.transformExpr(ast, context);
        };
        AstTransformer.prototype.visitWrappedNodeExpr = function (ast, context) {
            return this.transformExpr(ast, context);
        };
        AstTransformer.prototype.visitTypeofExpr = function (expr, context) {
            return this.transformExpr(new TypeofExpr(expr.expr.visitExpression(this, context), expr.type, expr.sourceSpan), context);
        };
        AstTransformer.prototype.visitWriteVarExpr = function (expr, context) {
            return this.transformExpr(new WriteVarExpr(expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
        };
        AstTransformer.prototype.visitWriteKeyExpr = function (expr, context) {
            return this.transformExpr(new WriteKeyExpr(expr.receiver.visitExpression(this, context), expr.index.visitExpression(this, context), expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
        };
        AstTransformer.prototype.visitWritePropExpr = function (expr, context) {
            return this.transformExpr(new WritePropExpr(expr.receiver.visitExpression(this, context), expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
        };
        AstTransformer.prototype.visitInvokeMethodExpr = function (ast, context) {
            var method = ast.builtin || ast.name;
            return this.transformExpr(new InvokeMethodExpr(ast.receiver.visitExpression(this, context), method, this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitInvokeFunctionExpr = function (ast, context) {
            return this.transformExpr(new InvokeFunctionExpr(ast.fn.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitTaggedTemplateExpr = function (ast, context) {
            var _this = this;
            return this.transformExpr(new TaggedTemplateExpr(ast.tag.visitExpression(this, context), new TemplateLiteral(ast.template.elements, ast.template.expressions.map(function (e) { return e.visitExpression(_this, context); })), ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitInstantiateExpr = function (ast, context) {
            return this.transformExpr(new InstantiateExpr(ast.classExpr.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitLiteralExpr = function (ast, context) {
            return this.transformExpr(ast, context);
        };
        AstTransformer.prototype.visitLocalizedString = function (ast, context) {
            return this.transformExpr(new LocalizedString(ast.metaBlock, ast.messageParts, ast.placeHolderNames, this.visitAllExpressions(ast.expressions, context), ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitExternalExpr = function (ast, context) {
            return this.transformExpr(ast, context);
        };
        AstTransformer.prototype.visitConditionalExpr = function (ast, context) {
            return this.transformExpr(new ConditionalExpr(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), ast.falseCase.visitExpression(this, context), ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitNotExpr = function (ast, context) {
            return this.transformExpr(new NotExpr(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitAssertNotNullExpr = function (ast, context) {
            return this.transformExpr(new AssertNotNull(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitCastExpr = function (ast, context) {
            return this.transformExpr(new CastExpr(ast.value.visitExpression(this, context), ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitFunctionExpr = function (ast, context) {
            return this.transformExpr(new FunctionExpr(ast.params, this.visitAllStatements(ast.statements, context), ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitUnaryOperatorExpr = function (ast, context) {
            return this.transformExpr(new UnaryOperatorExpr(ast.operator, ast.expr.visitExpression(this, context), ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitBinaryOperatorExpr = function (ast, context) {
            return this.transformExpr(new BinaryOperatorExpr(ast.operator, ast.lhs.visitExpression(this, context), ast.rhs.visitExpression(this, context), ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitReadPropExpr = function (ast, context) {
            return this.transformExpr(new ReadPropExpr(ast.receiver.visitExpression(this, context), ast.name, ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitReadKeyExpr = function (ast, context) {
            return this.transformExpr(new ReadKeyExpr(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context), ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitLiteralArrayExpr = function (ast, context) {
            return this.transformExpr(new LiteralArrayExpr(this.visitAllExpressions(ast.entries, context), ast.type, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitLiteralMapExpr = function (ast, context) {
            var _this = this;
            var entries = ast.entries.map(function (entry) { return new LiteralMapEntry(entry.key, entry.value.visitExpression(_this, context), entry.quoted); });
            var mapType = new MapType(ast.valueType);
            return this.transformExpr(new LiteralMapExpr(entries, mapType, ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitCommaExpr = function (ast, context) {
            return this.transformExpr(new CommaExpr(this.visitAllExpressions(ast.parts, context), ast.sourceSpan), context);
        };
        AstTransformer.prototype.visitAllExpressions = function (exprs, context) {
            var _this = this;
            return exprs.map(function (expr) { return expr.visitExpression(_this, context); });
        };
        AstTransformer.prototype.visitDeclareVarStmt = function (stmt, context) {
            var value = stmt.value && stmt.value.visitExpression(this, context);
            return this.transformStmt(new DeclareVarStmt(stmt.name, value, stmt.type, stmt.modifiers, stmt.sourceSpan, stmt.leadingComments), context);
        };
        AstTransformer.prototype.visitDeclareFunctionStmt = function (stmt, context) {
            return this.transformStmt(new DeclareFunctionStmt(stmt.name, stmt.params, this.visitAllStatements(stmt.statements, context), stmt.type, stmt.modifiers, stmt.sourceSpan, stmt.leadingComments), context);
        };
        AstTransformer.prototype.visitExpressionStmt = function (stmt, context) {
            return this.transformStmt(new ExpressionStatement(stmt.expr.visitExpression(this, context), stmt.sourceSpan, stmt.leadingComments), context);
        };
        AstTransformer.prototype.visitReturnStmt = function (stmt, context) {
            return this.transformStmt(new ReturnStatement(stmt.value.visitExpression(this, context), stmt.sourceSpan, stmt.leadingComments), context);
        };
        AstTransformer.prototype.visitDeclareClassStmt = function (stmt, context) {
            var _this = this;
            var parent = stmt.parent.visitExpression(this, context);
            var getters = stmt.getters.map(function (getter) { return new ClassGetter(getter.name, _this.visitAllStatements(getter.body, context), getter.type, getter.modifiers); });
            var ctorMethod = stmt.constructorMethod &&
                new ClassMethod(stmt.constructorMethod.name, stmt.constructorMethod.params, this.visitAllStatements(stmt.constructorMethod.body, context), stmt.constructorMethod.type, stmt.constructorMethod.modifiers);
            var methods = stmt.methods.map(function (method) { return new ClassMethod(method.name, method.params, _this.visitAllStatements(method.body, context), method.type, method.modifiers); });
            return this.transformStmt(new ClassStmt(stmt.name, parent, stmt.fields, getters, ctorMethod, methods, stmt.modifiers, stmt.sourceSpan), context);
        };
        AstTransformer.prototype.visitIfStmt = function (stmt, context) {
            return this.transformStmt(new IfStmt(stmt.condition.visitExpression(this, context), this.visitAllStatements(stmt.trueCase, context), this.visitAllStatements(stmt.falseCase, context), stmt.sourceSpan, stmt.leadingComments), context);
        };
        AstTransformer.prototype.visitTryCatchStmt = function (stmt, context) {
            return this.transformStmt(new TryCatchStmt(this.visitAllStatements(stmt.bodyStmts, context), this.visitAllStatements(stmt.catchStmts, context), stmt.sourceSpan, stmt.leadingComments), context);
        };
        AstTransformer.prototype.visitThrowStmt = function (stmt, context) {
            return this.transformStmt(new ThrowStmt(stmt.error.visitExpression(this, context), stmt.sourceSpan, stmt.leadingComments), context);
        };
        AstTransformer.prototype.visitAllStatements = function (stmts, context) {
            var _this = this;
            return stmts.map(function (stmt) { return stmt.visitStatement(_this, context); });
        };
        return AstTransformer;
    }());
    exports.AstTransformer = AstTransformer;
    var RecursiveAstVisitor = /** @class */ (function () {
        function RecursiveAstVisitor() {
        }
        RecursiveAstVisitor.prototype.visitType = function (ast, context) {
            return ast;
        };
        RecursiveAstVisitor.prototype.visitExpression = function (ast, context) {
            if (ast.type) {
                ast.type.visitType(this, context);
            }
            return ast;
        };
        RecursiveAstVisitor.prototype.visitBuiltinType = function (type, context) {
            return this.visitType(type, context);
        };
        RecursiveAstVisitor.prototype.visitExpressionType = function (type, context) {
            var _this = this;
            type.value.visitExpression(this, context);
            if (type.typeParams !== null) {
                type.typeParams.forEach(function (param) { return _this.visitType(param, context); });
            }
            return this.visitType(type, context);
        };
        RecursiveAstVisitor.prototype.visitArrayType = function (type, context) {
            return this.visitType(type, context);
        };
        RecursiveAstVisitor.prototype.visitMapType = function (type, context) {
            return this.visitType(type, context);
        };
        RecursiveAstVisitor.prototype.visitWrappedNodeExpr = function (ast, context) {
            return ast;
        };
        RecursiveAstVisitor.prototype.visitTypeofExpr = function (ast, context) {
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitReadVarExpr = function (ast, context) {
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitWriteVarExpr = function (ast, context) {
            ast.value.visitExpression(this, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitWriteKeyExpr = function (ast, context) {
            ast.receiver.visitExpression(this, context);
            ast.index.visitExpression(this, context);
            ast.value.visitExpression(this, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitWritePropExpr = function (ast, context) {
            ast.receiver.visitExpression(this, context);
            ast.value.visitExpression(this, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitInvokeMethodExpr = function (ast, context) {
            ast.receiver.visitExpression(this, context);
            this.visitAllExpressions(ast.args, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitInvokeFunctionExpr = function (ast, context) {
            ast.fn.visitExpression(this, context);
            this.visitAllExpressions(ast.args, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitTaggedTemplateExpr = function (ast, context) {
            ast.tag.visitExpression(this, context);
            this.visitAllExpressions(ast.template.expressions, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitInstantiateExpr = function (ast, context) {
            ast.classExpr.visitExpression(this, context);
            this.visitAllExpressions(ast.args, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitLiteralExpr = function (ast, context) {
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitLocalizedString = function (ast, context) {
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitExternalExpr = function (ast, context) {
            var _this = this;
            if (ast.typeParams) {
                ast.typeParams.forEach(function (type) { return type.visitType(_this, context); });
            }
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitConditionalExpr = function (ast, context) {
            ast.condition.visitExpression(this, context);
            ast.trueCase.visitExpression(this, context);
            ast.falseCase.visitExpression(this, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitNotExpr = function (ast, context) {
            ast.condition.visitExpression(this, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitAssertNotNullExpr = function (ast, context) {
            ast.condition.visitExpression(this, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitCastExpr = function (ast, context) {
            ast.value.visitExpression(this, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitFunctionExpr = function (ast, context) {
            this.visitAllStatements(ast.statements, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitUnaryOperatorExpr = function (ast, context) {
            ast.expr.visitExpression(this, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitBinaryOperatorExpr = function (ast, context) {
            ast.lhs.visitExpression(this, context);
            ast.rhs.visitExpression(this, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitReadPropExpr = function (ast, context) {
            ast.receiver.visitExpression(this, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitReadKeyExpr = function (ast, context) {
            ast.receiver.visitExpression(this, context);
            ast.index.visitExpression(this, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitLiteralArrayExpr = function (ast, context) {
            this.visitAllExpressions(ast.entries, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitLiteralMapExpr = function (ast, context) {
            var _this = this;
            ast.entries.forEach(function (entry) { return entry.value.visitExpression(_this, context); });
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitCommaExpr = function (ast, context) {
            this.visitAllExpressions(ast.parts, context);
            return this.visitExpression(ast, context);
        };
        RecursiveAstVisitor.prototype.visitAllExpressions = function (exprs, context) {
            var _this = this;
            exprs.forEach(function (expr) { return expr.visitExpression(_this, context); });
        };
        RecursiveAstVisitor.prototype.visitDeclareVarStmt = function (stmt, context) {
            if (stmt.value) {
                stmt.value.visitExpression(this, context);
            }
            if (stmt.type) {
                stmt.type.visitType(this, context);
            }
            return stmt;
        };
        RecursiveAstVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
            this.visitAllStatements(stmt.statements, context);
            if (stmt.type) {
                stmt.type.visitType(this, context);
            }
            return stmt;
        };
        RecursiveAstVisitor.prototype.visitExpressionStmt = function (stmt, context) {
            stmt.expr.visitExpression(this, context);
            return stmt;
        };
        RecursiveAstVisitor.prototype.visitReturnStmt = function (stmt, context) {
            stmt.value.visitExpression(this, context);
            return stmt;
        };
        RecursiveAstVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
            var _this = this;
            stmt.parent.visitExpression(this, context);
            stmt.getters.forEach(function (getter) { return _this.visitAllStatements(getter.body, context); });
            if (stmt.constructorMethod) {
                this.visitAllStatements(stmt.constructorMethod.body, context);
            }
            stmt.methods.forEach(function (method) { return _this.visitAllStatements(method.body, context); });
            return stmt;
        };
        RecursiveAstVisitor.prototype.visitIfStmt = function (stmt, context) {
            stmt.condition.visitExpression(this, context);
            this.visitAllStatements(stmt.trueCase, context);
            this.visitAllStatements(stmt.falseCase, context);
            return stmt;
        };
        RecursiveAstVisitor.prototype.visitTryCatchStmt = function (stmt, context) {
            this.visitAllStatements(stmt.bodyStmts, context);
            this.visitAllStatements(stmt.catchStmts, context);
            return stmt;
        };
        RecursiveAstVisitor.prototype.visitThrowStmt = function (stmt, context) {
            stmt.error.visitExpression(this, context);
            return stmt;
        };
        RecursiveAstVisitor.prototype.visitAllStatements = function (stmts, context) {
            var _this = this;
            stmts.forEach(function (stmt) { return stmt.visitStatement(_this, context); });
        };
        return RecursiveAstVisitor;
    }());
    exports.RecursiveAstVisitor = RecursiveAstVisitor;
    function findReadVarNames(stmts) {
        var visitor = new _ReadVarVisitor();
        visitor.visitAllStatements(stmts, null);
        return visitor.varNames;
    }
    exports.findReadVarNames = findReadVarNames;
    var _ReadVarVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(_ReadVarVisitor, _super);
        function _ReadVarVisitor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.varNames = new Set();
            return _this;
        }
        _ReadVarVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
            // Don't descend into nested functions
            return stmt;
        };
        _ReadVarVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
            // Don't descend into nested classes
            return stmt;
        };
        _ReadVarVisitor.prototype.visitReadVarExpr = function (ast, context) {
            if (ast.name) {
                this.varNames.add(ast.name);
            }
            return null;
        };
        return _ReadVarVisitor;
    }(RecursiveAstVisitor));
    function collectExternalReferences(stmts) {
        var visitor = new _FindExternalReferencesVisitor();
        visitor.visitAllStatements(stmts, null);
        return visitor.externalReferences;
    }
    exports.collectExternalReferences = collectExternalReferences;
    var _FindExternalReferencesVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(_FindExternalReferencesVisitor, _super);
        function _FindExternalReferencesVisitor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.externalReferences = [];
            return _this;
        }
        _FindExternalReferencesVisitor.prototype.visitExternalExpr = function (e, context) {
            this.externalReferences.push(e.value);
            return _super.prototype.visitExternalExpr.call(this, e, context);
        };
        return _FindExternalReferencesVisitor;
    }(RecursiveAstVisitor));
    function applySourceSpanToStatementIfNeeded(stmt, sourceSpan) {
        if (!sourceSpan) {
            return stmt;
        }
        var transformer = new _ApplySourceSpanTransformer(sourceSpan);
        return stmt.visitStatement(transformer, null);
    }
    exports.applySourceSpanToStatementIfNeeded = applySourceSpanToStatementIfNeeded;
    function applySourceSpanToExpressionIfNeeded(expr, sourceSpan) {
        if (!sourceSpan) {
            return expr;
        }
        var transformer = new _ApplySourceSpanTransformer(sourceSpan);
        return expr.visitExpression(transformer, null);
    }
    exports.applySourceSpanToExpressionIfNeeded = applySourceSpanToExpressionIfNeeded;
    var _ApplySourceSpanTransformer = /** @class */ (function (_super) {
        tslib_1.__extends(_ApplySourceSpanTransformer, _super);
        function _ApplySourceSpanTransformer(sourceSpan) {
            var _this = _super.call(this) || this;
            _this.sourceSpan = sourceSpan;
            return _this;
        }
        _ApplySourceSpanTransformer.prototype._clone = function (obj) {
            var e_1, _a;
            var clone = Object.create(obj.constructor.prototype);
            try {
                for (var _b = tslib_1.__values(Object.keys(obj)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var prop = _c.value;
                    clone[prop] = obj[prop];
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return clone;
        };
        _ApplySourceSpanTransformer.prototype.transformExpr = function (expr, context) {
            if (!expr.sourceSpan) {
                expr = this._clone(expr);
                expr.sourceSpan = this.sourceSpan;
            }
            return expr;
        };
        _ApplySourceSpanTransformer.prototype.transformStmt = function (stmt, context) {
            if (!stmt.sourceSpan) {
                stmt = this._clone(stmt);
                stmt.sourceSpan = this.sourceSpan;
            }
            return stmt;
        };
        return _ApplySourceSpanTransformer;
    }(AstTransformer));
    function leadingComment(text, multiline, trailingNewline) {
        if (multiline === void 0) { multiline = false; }
        if (trailingNewline === void 0) { trailingNewline = true; }
        return new LeadingComment(text, multiline, trailingNewline);
    }
    exports.leadingComment = leadingComment;
    function jsDocComment(tags) {
        if (tags === void 0) { tags = []; }
        return new JSDocComment(tags);
    }
    exports.jsDocComment = jsDocComment;
    function variable(name, type, sourceSpan) {
        return new ReadVarExpr(name, type, sourceSpan);
    }
    exports.variable = variable;
    function importExpr(id, typeParams, sourceSpan) {
        if (typeParams === void 0) { typeParams = null; }
        return new ExternalExpr(id, null, typeParams, sourceSpan);
    }
    exports.importExpr = importExpr;
    function importType(id, typeParams, typeModifiers) {
        return id != null ? expressionType(importExpr(id, typeParams, null), typeModifiers) : null;
    }
    exports.importType = importType;
    function expressionType(expr, typeModifiers, typeParams) {
        return new ExpressionType(expr, typeModifiers, typeParams);
    }
    exports.expressionType = expressionType;
    function typeofExpr(expr) {
        return new TypeofExpr(expr);
    }
    exports.typeofExpr = typeofExpr;
    function literalArr(values, type, sourceSpan) {
        return new LiteralArrayExpr(values, type, sourceSpan);
    }
    exports.literalArr = literalArr;
    function literalMap(values, type) {
        if (type === void 0) { type = null; }
        return new LiteralMapExpr(values.map(function (e) { return new LiteralMapEntry(e.key, e.value, e.quoted); }), type, null);
    }
    exports.literalMap = literalMap;
    function unary(operator, expr, type, sourceSpan) {
        return new UnaryOperatorExpr(operator, expr, type, sourceSpan);
    }
    exports.unary = unary;
    function not(expr, sourceSpan) {
        return new NotExpr(expr, sourceSpan);
    }
    exports.not = not;
    function assertNotNull(expr, sourceSpan) {
        return new AssertNotNull(expr, sourceSpan);
    }
    exports.assertNotNull = assertNotNull;
    function fn(params, body, type, sourceSpan, name) {
        return new FunctionExpr(params, body, type, sourceSpan, name);
    }
    exports.fn = fn;
    function ifStmt(condition, thenClause, elseClause, sourceSpan, leadingComments) {
        return new IfStmt(condition, thenClause, elseClause, sourceSpan, leadingComments);
    }
    exports.ifStmt = ifStmt;
    function taggedTemplate(tag, template, type, sourceSpan) {
        return new TaggedTemplateExpr(tag, template, type, sourceSpan);
    }
    exports.taggedTemplate = taggedTemplate;
    function literal(value, type, sourceSpan) {
        return new LiteralExpr(value, type, sourceSpan);
    }
    exports.literal = literal;
    function localizedString(metaBlock, messageParts, placeholderNames, expressions, sourceSpan) {
        return new LocalizedString(metaBlock, messageParts, placeholderNames, expressions, sourceSpan);
    }
    exports.localizedString = localizedString;
    function isNull(exp) {
        return exp instanceof LiteralExpr && exp.value === null;
    }
    exports.isNull = isNull;
    /*
     * Serializes a `Tag` into a string.
     * Returns a string like " @foo {bar} baz" (note the leading whitespace before `@foo`).
     */
    function tagToString(tag) {
        var out = '';
        if (tag.tagName) {
            out += " @" + tag.tagName;
        }
        if (tag.text) {
            if (tag.text.match(/\/\*|\*\//)) {
                throw new Error('JSDoc text cannot contain "/*" and "*/"');
            }
            out += ' ' + tag.text.replace(/@/g, '\\@');
        }
        return out;
    }
    function serializeTags(tags) {
        var e_2, _a;
        if (tags.length === 0)
            return '';
        if (tags.length === 1 && tags[0].tagName && !tags[0].text) {
            // The JSDOC comment is a single simple tag: e.g `/** @tagname */`.
            return "*" + tagToString(tags[0]) + " ";
        }
        var out = '*\n';
        try {
            for (var tags_1 = tslib_1.__values(tags), tags_1_1 = tags_1.next(); !tags_1_1.done; tags_1_1 = tags_1.next()) {
                var tag = tags_1_1.value;
                out += ' *';
                // If the tagToString is multi-line, insert " * " prefixes on lines.
                out += tagToString(tag).replace(/\n/g, '\n * ');
                out += '\n';
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (tags_1_1 && !tags_1_1.done && (_a = tags_1.return)) _a.call(tags_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        out += ' ';
        return out;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvb3V0cHV0X2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBTUgsVUFBVTtJQUNWLElBQVksWUFFWDtJQUZELFdBQVksWUFBWTtRQUN0QixpREFBSyxDQUFBO0lBQ1AsQ0FBQyxFQUZXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBRXZCO0lBRUQ7UUFDRSxjQUFtQixTQUE4QjtZQUE5QiwwQkFBQSxFQUFBLGNBQThCO1lBQTlCLGNBQVMsR0FBVCxTQUFTLENBQXFCO1FBQUcsQ0FBQztRQUdyRCwwQkFBVyxHQUFYLFVBQVksUUFBc0I7WUFDaEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBQ0gsV0FBQztJQUFELENBQUMsQUFQRCxJQU9DO0lBUHFCLG9CQUFJO0lBUzFCLElBQVksZUFTWDtJQVRELFdBQVksZUFBZTtRQUN6QiwyREFBTyxDQUFBO1FBQ1AscURBQUksQ0FBQTtRQUNKLHlEQUFNLENBQUE7UUFDTixtREFBRyxDQUFBO1FBQ0gseURBQU0sQ0FBQTtRQUNOLDZEQUFRLENBQUE7UUFDUiw2REFBUSxDQUFBO1FBQ1IscURBQUksQ0FBQTtJQUNOLENBQUMsRUFUVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQVMxQjtJQUVEO1FBQWlDLHVDQUFJO1FBQ25DLHFCQUFtQixJQUFxQixFQUFFLFNBQTBCO1lBQXBFLFlBQ0Usa0JBQU0sU0FBUyxDQUFDLFNBQ2pCO1lBRmtCLFVBQUksR0FBSixJQUFJLENBQWlCOztRQUV4QyxDQUFDO1FBQ1EsK0JBQVMsR0FBbEIsVUFBbUIsT0FBb0IsRUFBRSxPQUFZO1lBQ25ELE9BQU8sT0FB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LElBQWdCOztRQUNyQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLE9BQU8sRUFBRSxDQUFDO1FBRWpDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDekQsbUVBQW1FO1lBQ25FLE9BQU8sTUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQUcsQ0FBQztTQUNwQztRQUVELElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQzs7WUFDaEIsS0FBa0IsSUFBQSxTQUFBLGlCQUFBLElBQUksQ0FBQSwwQkFBQSw0Q0FBRTtnQkFBbkIsSUFBTSxHQUFHLGlCQUFBO2dCQUNaLEdBQUcsSUFBSSxJQUFJLENBQUM7Z0JBQ1osb0VBQW9FO2dCQUNwRSxHQUFHLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2hELEdBQUcsSUFBSSxJQUFJLENBQUM7YUFDYjs7Ozs7Ozs7O1FBQ0QsR0FBRyxJQUFJLEdBQUcsQ0FBQztRQUNYLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5cbmltcG9ydCB7UGFyc2VTb3VyY2VTcGFufSBmcm9tICcuLi9wYXJzZV91dGlsJztcbmltcG9ydCB7STE4bk1ldGF9IGZyb20gJy4uL3JlbmRlcjMvdmlldy9pMThuL21ldGEnO1xuXG4vLy8vIFR5cGVzXG5leHBvcnQgZW51bSBUeXBlTW9kaWZpZXIge1xuICBDb25zdFxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtb2RpZmllcnM6IFR5cGVNb2RpZmllcltdID0gW10pIHt9XG4gIGFic3RyYWN0IHZpc2l0VHlwZSh2aXNpdG9yOiBUeXBlVmlzaXRvciwgY29udGV4dDogYW55KTogYW55O1xuXG4gIGhhc01vZGlmaWVyKG1vZGlmaWVyOiBUeXBlTW9kaWZpZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RpZmllcnMuaW5kZXhPZihtb2RpZmllcikgIT09IC0xO1xuICB9XG59XG5cbmV4cG9ydCBlbnVtIEJ1aWx0aW5UeXBlTmFtZSB7XG4gIER5bmFtaWMsXG4gIEJvb2wsXG4gIFN0cmluZyxcbiAgSW50LFxuICBOdW1iZXIsXG4gIEZ1bmN0aW9uLFxuICBJbmZlcnJlZCxcbiAgTm9uZSxcbn1cblxuZXhwb3J0IGNsYXNzIEJ1aWx0aW5UeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBCdWlsdGluVHlwZU5hbWUsIG1vZGlmaWVycz86IFR5cGVNb2RpZmllcltdKSB7XG4gICAgc3VwZXIobW9kaWZpZXJzKTtcbiAgfVxuICBvdmVycmlkZSB2aXNpdFR5cGUodmlzaXRvcjogVHlwZVZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRCdWlsdGluVHlwZSh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvblR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgdmFsdWU6IEV4cHJlc3Npb24sIG1vZGlmaWVycz86IFR5cGVNb2RpZmllcltdLCBwdWJsaWMgdHlwZVBhcmFtczogVHlwZVtdfG51bGwgPSBudWxsKSB7XG4gICAgc3VwZXIobW9kaWZpZXJzKTtcbiAgfVxuICBvdmVycmlkZSB2aXNpdFR5cGUodmlzaXRvcjogVHlwZVZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFeHByZXNzaW9uVHlwZSh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBBcnJheVR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3IocHVibGljIG9mOiBUeXBlLCBtb2RpZmllcnM/OiBUeXBlTW9kaWZpZXJbXSkge1xuICAgIHN1cGVyKG1vZGlmaWVycyk7XG4gIH1cbiAgb3ZlcnJpZGUgdmlzaXRUeXBlKHZpc2l0b3I6IFR5cGVWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXJyYXlUeXBlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIE1hcFR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgcHVibGljIHZhbHVlVHlwZTogVHlwZXxudWxsO1xuICBjb25zdHJ1Y3Rvcih2YWx1ZVR5cGU6IFR5cGV8bnVsbHx1bmRlZmluZWQsIG1vZGlmaWVycz86IFR5cGVNb2RpZmllcltdKSB7XG4gICAgc3VwZXIobW9kaWZpZXJzKTtcbiAgICB0aGlzLnZhbHVlVHlwZSA9IHZhbHVlVHlwZSB8fCBudWxsO1xuICB9XG4gIG92ZXJyaWRlIHZpc2l0VHlwZSh2aXNpdG9yOiBUeXBlVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdE1hcFR5cGUodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IERZTkFNSUNfVFlQRSA9IG5ldyBCdWlsdGluVHlwZShCdWlsdGluVHlwZU5hbWUuRHluYW1pYyk7XG5leHBvcnQgY29uc3QgSU5GRVJSRURfVFlQRSA9IG5ldyBCdWlsdGluVHlwZShCdWlsdGluVHlwZU5hbWUuSW5mZXJyZWQpO1xuZXhwb3J0IGNvbnN0IEJPT0xfVFlQRSA9IG5ldyBCdWlsdGluVHlwZShCdWlsdGluVHlwZU5hbWUuQm9vbCk7XG5leHBvcnQgY29uc3QgSU5UX1RZUEUgPSBuZXcgQnVpbHRpblR5cGUoQnVpbHRpblR5cGVOYW1lLkludCk7XG5leHBvcnQgY29uc3QgTlVNQkVSX1RZUEUgPSBuZXcgQnVpbHRpblR5cGUoQnVpbHRpblR5cGVOYW1lLk51bWJlcik7XG5leHBvcnQgY29uc3QgU1RSSU5HX1RZUEUgPSBuZXcgQnVpbHRpblR5cGUoQnVpbHRpblR5cGVOYW1lLlN0cmluZyk7XG5leHBvcnQgY29uc3QgRlVOQ1RJT05fVFlQRSA9IG5ldyBCdWlsdGluVHlwZShCdWlsdGluVHlwZU5hbWUuRnVuY3Rpb24pO1xuZXhwb3J0IGNvbnN0IE5PTkVfVFlQRSA9IG5ldyBCdWlsdGluVHlwZShCdWlsdGluVHlwZU5hbWUuTm9uZSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHlwZVZpc2l0b3Ige1xuICB2aXNpdEJ1aWx0aW5UeXBlKHR5cGU6IEJ1aWx0aW5UeXBlLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0RXhwcmVzc2lvblR5cGUodHlwZTogRXhwcmVzc2lvblR5cGUsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRBcnJheVR5cGUodHlwZTogQXJyYXlUeXBlLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0TWFwVHlwZSh0eXBlOiBNYXBUeXBlLCBjb250ZXh0OiBhbnkpOiBhbnk7XG59XG5cbi8vLy8vIEV4cHJlc3Npb25zXG5cbmV4cG9ydCBlbnVtIFVuYXJ5T3BlcmF0b3Ige1xuICBNaW51cyxcbiAgUGx1cyxcbn1cblxuZXhwb3J0IGVudW0gQmluYXJ5T3BlcmF0b3Ige1xuICBFcXVhbHMsXG4gIE5vdEVxdWFscyxcbiAgSWRlbnRpY2FsLFxuICBOb3RJZGVudGljYWwsXG4gIE1pbnVzLFxuICBQbHVzLFxuICBEaXZpZGUsXG4gIE11bHRpcGx5LFxuICBNb2R1bG8sXG4gIEFuZCxcbiAgT3IsXG4gIEJpdHdpc2VBbmQsXG4gIExvd2VyLFxuICBMb3dlckVxdWFscyxcbiAgQmlnZ2VyLFxuICBCaWdnZXJFcXVhbHMsXG4gIE51bGxpc2hDb2FsZXNjZSxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG51bGxTYWZlSXNFcXVpdmFsZW50PFQgZXh0ZW5kcyB7aXNFcXVpdmFsZW50KG90aGVyOiBUKTogYm9vbGVhbn0+KFxuICAgIGJhc2U6IFR8bnVsbCwgb3RoZXI6IFR8bnVsbCkge1xuICBpZiAoYmFzZSA9PSBudWxsIHx8IG90aGVyID09IG51bGwpIHtcbiAgICByZXR1cm4gYmFzZSA9PSBvdGhlcjtcbiAgfVxuICByZXR1cm4gYmFzZS5pc0VxdWl2YWxlbnQob3RoZXIpO1xufVxuXG5mdW5jdGlvbiBhcmVBbGxFcXVpdmFsZW50UHJlZGljYXRlPFQ+KFxuICAgIGJhc2U6IFRbXSwgb3RoZXI6IFRbXSwgZXF1aXZhbGVudFByZWRpY2F0ZTogKGJhc2VFbGVtZW50OiBULCBvdGhlckVsZW1lbnQ6IFQpID0+IGJvb2xlYW4pIHtcbiAgY29uc3QgbGVuID0gYmFzZS5sZW5ndGg7XG4gIGlmIChsZW4gIT09IG90aGVyLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCFlcXVpdmFsZW50UHJlZGljYXRlKGJhc2VbaV0sIG90aGVyW2ldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFyZUFsbEVxdWl2YWxlbnQ8VCBleHRlbmRzIHtpc0VxdWl2YWxlbnQob3RoZXI6IFQpOiBib29sZWFufT4oXG4gICAgYmFzZTogVFtdLCBvdGhlcjogVFtdKSB7XG4gIHJldHVybiBhcmVBbGxFcXVpdmFsZW50UHJlZGljYXRlKFxuICAgICAgYmFzZSwgb3RoZXIsIChiYXNlRWxlbWVudDogVCwgb3RoZXJFbGVtZW50OiBUKSA9PiBiYXNlRWxlbWVudC5pc0VxdWl2YWxlbnQob3RoZXJFbGVtZW50KSk7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFeHByZXNzaW9uIHtcbiAgcHVibGljIHR5cGU6IFR5cGV8bnVsbDtcbiAgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbnxudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHR5cGU6IFR5cGV8bnVsbHx1bmRlZmluZWQsIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCkge1xuICAgIHRoaXMudHlwZSA9IHR5cGUgfHwgbnVsbDtcbiAgICB0aGlzLnNvdXJjZVNwYW4gPSBzb3VyY2VTcGFuIHx8IG51bGw7XG4gIH1cblxuICBhYnN0cmFjdCB2aXNpdEV4cHJlc3Npb24odmlzaXRvcjogRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB3aGV0aGVyIHRoaXMgZXhwcmVzc2lvbiBwcm9kdWNlcyB0aGUgc2FtZSB2YWx1ZSBhcyB0aGUgZ2l2ZW4gZXhwcmVzc2lvbi5cbiAgICogTm90ZTogV2UgZG9uJ3QgY2hlY2sgVHlwZXMgbm9yIFBhcnNlU291cmNlU3BhbnMgbm9yIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiAgICovXG4gIGFic3RyYWN0IGlzRXF1aXZhbGVudChlOiBFeHByZXNzaW9uKTogYm9vbGVhbjtcblxuICAvKipcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIGV4cHJlc3Npb24gaXMgY29uc3RhbnQuXG4gICAqL1xuICBhYnN0cmFjdCBpc0NvbnN0YW50KCk6IGJvb2xlYW47XG5cbiAgcHJvcChuYW1lOiBzdHJpbmcsIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IFJlYWRQcm9wRXhwciB7XG4gICAgcmV0dXJuIG5ldyBSZWFkUHJvcEV4cHIodGhpcywgbmFtZSwgbnVsbCwgc291cmNlU3Bhbik7XG4gIH1cblxuICBrZXkoaW5kZXg6IEV4cHJlc3Npb24sIHR5cGU/OiBUeXBlfG51bGwsIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IFJlYWRLZXlFeHByIHtcbiAgICByZXR1cm4gbmV3IFJlYWRLZXlFeHByKHRoaXMsIGluZGV4LCB0eXBlLCBzb3VyY2VTcGFuKTtcbiAgfVxuXG4gIGNhbGxNZXRob2QobmFtZTogc3RyaW5nfEJ1aWx0aW5NZXRob2QsIHBhcmFtczogRXhwcmVzc2lvbltdLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpOlxuICAgICAgSW52b2tlTWV0aG9kRXhwciB7XG4gICAgcmV0dXJuIG5ldyBJbnZva2VNZXRob2RFeHByKHRoaXMsIG5hbWUsIHBhcmFtcywgbnVsbCwgc291cmNlU3Bhbik7XG4gIH1cblxuICBjYWxsRm4ocGFyYW1zOiBFeHByZXNzaW9uW10sIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCwgcHVyZT86IGJvb2xlYW4pOlxuICAgICAgSW52b2tlRnVuY3Rpb25FeHByIHtcbiAgICByZXR1cm4gbmV3IEludm9rZUZ1bmN0aW9uRXhwcih0aGlzLCBwYXJhbXMsIG51bGwsIHNvdXJjZVNwYW4sIHB1cmUpO1xuICB9XG5cbiAgaW5zdGFudGlhdGUocGFyYW1zOiBFeHByZXNzaW9uW10sIHR5cGU/OiBUeXBlfG51bGwsIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6XG4gICAgICBJbnN0YW50aWF0ZUV4cHIge1xuICAgIHJldHVybiBuZXcgSW5zdGFudGlhdGVFeHByKHRoaXMsIHBhcmFtcywgdHlwZSwgc291cmNlU3Bhbik7XG4gIH1cblxuICBjb25kaXRpb25hbChcbiAgICAgIHRydWVDYXNlOiBFeHByZXNzaW9uLCBmYWxzZUNhc2U6IEV4cHJlc3Npb258bnVsbCA9IG51bGwsXG4gICAgICBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpOiBDb25kaXRpb25hbEV4cHIge1xuICAgIHJldHVybiBuZXcgQ29uZGl0aW9uYWxFeHByKHRoaXMsIHRydWVDYXNlLCBmYWxzZUNhc2UsIG51bGwsIHNvdXJjZVNwYW4pO1xuICB9XG5cbiAgZXF1YWxzKHJoczogRXhwcmVzc2lvbiwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5FcXVhbHMsIHRoaXMsIHJocywgbnVsbCwgc291cmNlU3Bhbik7XG4gIH1cbiAgbm90RXF1YWxzKHJoczogRXhwcmVzc2lvbiwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5Ob3RFcXVhbHMsIHRoaXMsIHJocywgbnVsbCwgc291cmNlU3Bhbik7XG4gIH1cbiAgaWRlbnRpY2FsKHJoczogRXhwcmVzc2lvbiwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5JZGVudGljYWwsIHRoaXMsIHJocywgbnVsbCwgc291cmNlU3Bhbik7XG4gIH1cbiAgbm90SWRlbnRpY2FsKHJoczogRXhwcmVzc2lvbiwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5Ob3RJZGVudGljYWwsIHRoaXMsIHJocywgbnVsbCwgc291cmNlU3Bhbik7XG4gIH1cbiAgbWludXMocmhzOiBFeHByZXNzaW9uLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLk1pbnVzLCB0aGlzLCByaHMsIG51bGwsIHNvdXJjZVNwYW4pO1xuICB9XG4gIHBsdXMocmhzOiBFeHByZXNzaW9uLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLlBsdXMsIHRoaXMsIHJocywgbnVsbCwgc291cmNlU3Bhbik7XG4gIH1cbiAgZGl2aWRlKHJoczogRXhwcmVzc2lvbiwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5EaXZpZGUsIHRoaXMsIHJocywgbnVsbCwgc291cmNlU3Bhbik7XG4gIH1cbiAgbXVsdGlwbHkocmhzOiBFeHByZXNzaW9uLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLk11bHRpcGx5LCB0aGlzLCByaHMsIG51bGwsIHNvdXJjZVNwYW4pO1xuICB9XG4gIG1vZHVsbyhyaHM6IEV4cHJlc3Npb24sIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IEJpbmFyeU9wZXJhdG9yRXhwciB7XG4gICAgcmV0dXJuIG5ldyBCaW5hcnlPcGVyYXRvckV4cHIoQmluYXJ5T3BlcmF0b3IuTW9kdWxvLCB0aGlzLCByaHMsIG51bGwsIHNvdXJjZVNwYW4pO1xuICB9XG4gIGFuZChyaHM6IEV4cHJlc3Npb24sIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IEJpbmFyeU9wZXJhdG9yRXhwciB7XG4gICAgcmV0dXJuIG5ldyBCaW5hcnlPcGVyYXRvckV4cHIoQmluYXJ5T3BlcmF0b3IuQW5kLCB0aGlzLCByaHMsIG51bGwsIHNvdXJjZVNwYW4pO1xuICB9XG4gIGJpdHdpc2VBbmQocmhzOiBFeHByZXNzaW9uLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwsIHBhcmVuczogYm9vbGVhbiA9IHRydWUpOlxuICAgICAgQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5CaXR3aXNlQW5kLCB0aGlzLCByaHMsIG51bGwsIHNvdXJjZVNwYW4sIHBhcmVucyk7XG4gIH1cbiAgb3IocmhzOiBFeHByZXNzaW9uLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLk9yLCB0aGlzLCByaHMsIG51bGwsIHNvdXJjZVNwYW4pO1xuICB9XG4gIGxvd2VyKHJoczogRXhwcmVzc2lvbiwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5Mb3dlciwgdGhpcywgcmhzLCBudWxsLCBzb3VyY2VTcGFuKTtcbiAgfVxuICBsb3dlckVxdWFscyhyaHM6IEV4cHJlc3Npb24sIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IEJpbmFyeU9wZXJhdG9yRXhwciB7XG4gICAgcmV0dXJuIG5ldyBCaW5hcnlPcGVyYXRvckV4cHIoQmluYXJ5T3BlcmF0b3IuTG93ZXJFcXVhbHMsIHRoaXMsIHJocywgbnVsbCwgc291cmNlU3Bhbik7XG4gIH1cbiAgYmlnZ2VyKHJoczogRXhwcmVzc2lvbiwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5CaWdnZXIsIHRoaXMsIHJocywgbnVsbCwgc291cmNlU3Bhbik7XG4gIH1cbiAgYmlnZ2VyRXF1YWxzKHJoczogRXhwcmVzc2lvbiwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5CaWdnZXJFcXVhbHMsIHRoaXMsIHJocywgbnVsbCwgc291cmNlU3Bhbik7XG4gIH1cbiAgaXNCbGFuayhzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpOiBFeHByZXNzaW9uIHtcbiAgICAvLyBOb3RlOiBXZSB1c2UgZXF1YWxzIGJ5IHB1cnBvc2UgaGVyZSB0byBjb21wYXJlIHRvIG51bGwgYW5kIHVuZGVmaW5lZCBpbiBKUy5cbiAgICAvLyBXZSB1c2UgdGhlIHR5cGVkIG51bGwgdG8gYWxsb3cgc3RyaWN0TnVsbENoZWNrcyB0byBuYXJyb3cgdHlwZXMuXG4gICAgcmV0dXJuIHRoaXMuZXF1YWxzKFRZUEVEX05VTExfRVhQUiwgc291cmNlU3Bhbik7XG4gIH1cbiAgY2FzdCh0eXBlOiBUeXBlLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpOiBFeHByZXNzaW9uIHtcbiAgICByZXR1cm4gbmV3IENhc3RFeHByKHRoaXMsIHR5cGUsIHNvdXJjZVNwYW4pO1xuICB9XG4gIG51bGxpc2hDb2FsZXNjZShyaHM6IEV4cHJlc3Npb24sIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IEJpbmFyeU9wZXJhdG9yRXhwciB7XG4gICAgcmV0dXJuIG5ldyBCaW5hcnlPcGVyYXRvckV4cHIoQmluYXJ5T3BlcmF0b3IuTnVsbGlzaENvYWxlc2NlLCB0aGlzLCByaHMsIG51bGwsIHNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdG9TdG10KCk6IFN0YXRlbWVudCB7XG4gICAgcmV0dXJuIG5ldyBFeHByZXNzaW9uU3RhdGVtZW50KHRoaXMsIG51bGwpO1xuICB9XG59XG5cbmV4cG9ydCBlbnVtIEJ1aWx0aW5WYXIge1xuICBUaGlzLFxuICBTdXBlcixcbiAgQ2F0Y2hFcnJvcixcbiAgQ2F0Y2hTdGFja1xufVxuXG5leHBvcnQgY2xhc3MgUmVhZFZhckV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgcHVibGljIG5hbWU6IHN0cmluZ3xudWxsO1xuICBwdWJsaWMgYnVpbHRpbjogQnVpbHRpblZhcnxudWxsO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZ3xCdWlsdGluVmFyLCB0eXBlPzogVHlwZXxudWxsLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpIHtcbiAgICBzdXBlcih0eXBlLCBzb3VyY2VTcGFuKTtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5idWlsdGluID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgIHRoaXMuYnVpbHRpbiA9IG5hbWU7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KGU6IEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gZSBpbnN0YW5jZW9mIFJlYWRWYXJFeHByICYmIHRoaXMubmFtZSA9PT0gZS5uYW1lICYmIHRoaXMuYnVpbHRpbiA9PT0gZS5idWlsdGluO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNDb25zdGFudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBvdmVycmlkZSB2aXNpdEV4cHJlc3Npb24odmlzaXRvcjogRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRSZWFkVmFyRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxuXG4gIHNldCh2YWx1ZTogRXhwcmVzc2lvbik6IFdyaXRlVmFyRXhwciB7XG4gICAgaWYgKCF0aGlzLm5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQnVpbHQgaW4gdmFyaWFibGUgJHt0aGlzLmJ1aWx0aW59IGNhbiBub3QgYmUgYXNzaWduZWQgdG8uYCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgV3JpdGVWYXJFeHByKHRoaXMubmFtZSwgdmFsdWUsIG51bGwsIHRoaXMuc291cmNlU3Bhbik7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFR5cGVvZkV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIGV4cHI6IEV4cHJlc3Npb24sIHR5cGU/OiBUeXBlfG51bGwsIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCkge1xuICAgIHN1cGVyKHR5cGUsIHNvdXJjZVNwYW4pO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFR5cGVvZkV4cHIodGhpcywgY29udGV4dCk7XG4gIH1cblxuICBvdmVycmlkZSBpc0VxdWl2YWxlbnQoZTogRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBlIGluc3RhbmNlb2YgVHlwZW9mRXhwciAmJiBlLmV4cHIuaXNFcXVpdmFsZW50KHRoaXMuZXhwcik7XG4gIH1cblxuICBvdmVycmlkZSBpc0NvbnN0YW50KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmV4cHIuaXNDb25zdGFudCgpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXcmFwcGVkTm9kZUV4cHI8VD4gZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIG5vZGU6IFQsIHR5cGU/OiBUeXBlfG51bGwsIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCkge1xuICAgIHN1cGVyKHR5cGUsIHNvdXJjZVNwYW4pO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KGU6IEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gZSBpbnN0YW5jZW9mIFdyYXBwZWROb2RlRXhwciAmJiB0aGlzLm5vZGUgPT09IGUubm9kZTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzQ29uc3RhbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0V3JhcHBlZE5vZGVFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXcml0ZVZhckV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgcHVibGljIHZhbHVlOiBFeHByZXNzaW9uO1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHZhbHVlOiBFeHByZXNzaW9uLCB0eXBlPzogVHlwZXxudWxsLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpIHtcbiAgICBzdXBlcih0eXBlIHx8IHZhbHVlLnR5cGUsIHNvdXJjZVNwYW4pO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudChlOiBFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBXcml0ZVZhckV4cHIgJiYgdGhpcy5uYW1lID09PSBlLm5hbWUgJiYgdGhpcy52YWx1ZS5pc0VxdWl2YWxlbnQoZS52YWx1ZSk7XG4gIH1cblxuICBvdmVycmlkZSBpc0NvbnN0YW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFdyaXRlVmFyRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxuXG4gIHRvRGVjbFN0bXQodHlwZT86IFR5cGV8bnVsbCwgbW9kaWZpZXJzPzogU3RtdE1vZGlmaWVyW10pOiBEZWNsYXJlVmFyU3RtdCB7XG4gICAgcmV0dXJuIG5ldyBEZWNsYXJlVmFyU3RtdCh0aGlzLm5hbWUsIHRoaXMudmFsdWUsIHR5cGUsIG1vZGlmaWVycywgdGhpcy5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHRvQ29uc3REZWNsKCk6IERlY2xhcmVWYXJTdG10IHtcbiAgICByZXR1cm4gdGhpcy50b0RlY2xTdG10KElORkVSUkVEX1RZUEUsIFtTdG10TW9kaWZpZXIuRmluYWxdKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBXcml0ZUtleUV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgcHVibGljIHZhbHVlOiBFeHByZXNzaW9uO1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyByZWNlaXZlcjogRXhwcmVzc2lvbiwgcHVibGljIGluZGV4OiBFeHByZXNzaW9uLCB2YWx1ZTogRXhwcmVzc2lvbiwgdHlwZT86IFR5cGV8bnVsbCxcbiAgICAgIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCkge1xuICAgIHN1cGVyKHR5cGUgfHwgdmFsdWUudHlwZSwgc291cmNlU3Bhbik7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KGU6IEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gZSBpbnN0YW5jZW9mIFdyaXRlS2V5RXhwciAmJiB0aGlzLnJlY2VpdmVyLmlzRXF1aXZhbGVudChlLnJlY2VpdmVyKSAmJlxuICAgICAgICB0aGlzLmluZGV4LmlzRXF1aXZhbGVudChlLmluZGV4KSAmJiB0aGlzLnZhbHVlLmlzRXF1aXZhbGVudChlLnZhbHVlKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzQ29uc3RhbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0V3JpdGVLZXlFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFdyaXRlUHJvcEV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgcHVibGljIHZhbHVlOiBFeHByZXNzaW9uO1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyByZWNlaXZlcjogRXhwcmVzc2lvbiwgcHVibGljIG5hbWU6IHN0cmluZywgdmFsdWU6IEV4cHJlc3Npb24sIHR5cGU/OiBUeXBlfG51bGwsXG4gICAgICBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpIHtcbiAgICBzdXBlcih0eXBlIHx8IHZhbHVlLnR5cGUsIHNvdXJjZVNwYW4pO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudChlOiBFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBXcml0ZVByb3BFeHByICYmIHRoaXMucmVjZWl2ZXIuaXNFcXVpdmFsZW50KGUucmVjZWl2ZXIpICYmXG4gICAgICAgIHRoaXMubmFtZSA9PT0gZS5uYW1lICYmIHRoaXMudmFsdWUuaXNFcXVpdmFsZW50KGUudmFsdWUpO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNDb25zdGFudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBvdmVycmlkZSB2aXNpdEV4cHJlc3Npb24odmlzaXRvcjogRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRXcml0ZVByb3BFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBlbnVtIEJ1aWx0aW5NZXRob2Qge1xuICBDb25jYXRBcnJheSxcbiAgU3Vic2NyaWJlT2JzZXJ2YWJsZSxcbiAgQmluZFxufVxuXG5leHBvcnQgY2xhc3MgSW52b2tlTWV0aG9kRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBwdWJsaWMgbmFtZTogc3RyaW5nfG51bGw7XG4gIHB1YmxpYyBidWlsdGluOiBCdWlsdGluTWV0aG9kfG51bGw7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIHJlY2VpdmVyOiBFeHByZXNzaW9uLCBtZXRob2Q6IHN0cmluZ3xCdWlsdGluTWV0aG9kLCBwdWJsaWMgYXJnczogRXhwcmVzc2lvbltdLFxuICAgICAgdHlwZT86IFR5cGV8bnVsbCwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKSB7XG4gICAgc3VwZXIodHlwZSwgc291cmNlU3Bhbik7XG4gICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLm5hbWUgPSBtZXRob2Q7XG4gICAgICB0aGlzLmJ1aWx0aW4gPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5hbWUgPSBudWxsO1xuICAgICAgdGhpcy5idWlsdGluID0gPEJ1aWx0aW5NZXRob2Q+bWV0aG9kO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudChlOiBFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBJbnZva2VNZXRob2RFeHByICYmIHRoaXMucmVjZWl2ZXIuaXNFcXVpdmFsZW50KGUucmVjZWl2ZXIpICYmXG4gICAgICAgIHRoaXMubmFtZSA9PT0gZS5uYW1lICYmIHRoaXMuYnVpbHRpbiA9PT0gZS5idWlsdGluICYmIGFyZUFsbEVxdWl2YWxlbnQodGhpcy5hcmdzLCBlLmFyZ3MpO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNDb25zdGFudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBvdmVycmlkZSB2aXNpdEV4cHJlc3Npb24odmlzaXRvcjogRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRJbnZva2VNZXRob2RFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEludm9rZUZ1bmN0aW9uRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBmbjogRXhwcmVzc2lvbiwgcHVibGljIGFyZ3M6IEV4cHJlc3Npb25bXSwgdHlwZT86IFR5cGV8bnVsbCxcbiAgICAgIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCwgcHVibGljIHB1cmUgPSBmYWxzZSkge1xuICAgIHN1cGVyKHR5cGUsIHNvdXJjZVNwYW4pO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KGU6IEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gZSBpbnN0YW5jZW9mIEludm9rZUZ1bmN0aW9uRXhwciAmJiB0aGlzLmZuLmlzRXF1aXZhbGVudChlLmZuKSAmJlxuICAgICAgICBhcmVBbGxFcXVpdmFsZW50KHRoaXMuYXJncywgZS5hcmdzKSAmJiB0aGlzLnB1cmUgPT09IGUucHVyZTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzQ29uc3RhbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0SW52b2tlRnVuY3Rpb25FeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFRhZ2dlZFRlbXBsYXRlRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyB0YWc6IEV4cHJlc3Npb24sIHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVMaXRlcmFsLCB0eXBlPzogVHlwZXxudWxsLFxuICAgICAgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKSB7XG4gICAgc3VwZXIodHlwZSwgc291cmNlU3Bhbik7XG4gIH1cblxuICBvdmVycmlkZSBpc0VxdWl2YWxlbnQoZTogRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBlIGluc3RhbmNlb2YgVGFnZ2VkVGVtcGxhdGVFeHByICYmIHRoaXMudGFnLmlzRXF1aXZhbGVudChlLnRhZykgJiZcbiAgICAgICAgYXJlQWxsRXF1aXZhbGVudFByZWRpY2F0ZShcbiAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGUuZWxlbWVudHMsIGUudGVtcGxhdGUuZWxlbWVudHMsIChhLCBiKSA9PiBhLnRleHQgPT09IGIudGV4dCkgJiZcbiAgICAgICAgYXJlQWxsRXF1aXZhbGVudCh0aGlzLnRlbXBsYXRlLmV4cHJlc3Npb25zLCBlLnRlbXBsYXRlLmV4cHJlc3Npb25zKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzQ29uc3RhbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGFnZ2VkVGVtcGxhdGVFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEluc3RhbnRpYXRlRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBjbGFzc0V4cHI6IEV4cHJlc3Npb24sIHB1YmxpYyBhcmdzOiBFeHByZXNzaW9uW10sIHR5cGU/OiBUeXBlfG51bGwsXG4gICAgICBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpIHtcbiAgICBzdXBlcih0eXBlLCBzb3VyY2VTcGFuKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudChlOiBFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBJbnN0YW50aWF0ZUV4cHIgJiYgdGhpcy5jbGFzc0V4cHIuaXNFcXVpdmFsZW50KGUuY2xhc3NFeHByKSAmJlxuICAgICAgICBhcmVBbGxFcXVpdmFsZW50KHRoaXMuYXJncywgZS5hcmdzKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzQ29uc3RhbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0SW5zdGFudGlhdGVFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIExpdGVyYWxFeHByIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIHZhbHVlOiBudW1iZXJ8c3RyaW5nfGJvb2xlYW58bnVsbHx1bmRlZmluZWQsIHR5cGU/OiBUeXBlfG51bGwsXG4gICAgICBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpIHtcbiAgICBzdXBlcih0eXBlLCBzb3VyY2VTcGFuKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudChlOiBFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBMaXRlcmFsRXhwciAmJiB0aGlzLnZhbHVlID09PSBlLnZhbHVlO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNDb25zdGFudCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZUxpdGVyYWwge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudHM6IFRlbXBsYXRlTGl0ZXJhbEVsZW1lbnRbXSwgcHVibGljIGV4cHJlc3Npb25zOiBFeHByZXNzaW9uW10pIHt9XG59XG5leHBvcnQgY2xhc3MgVGVtcGxhdGVMaXRlcmFsRWxlbWVudCB7XG4gIHJhd1RleHQ6IHN0cmluZztcbiAgY29uc3RydWN0b3IocHVibGljIHRleHQ6IHN0cmluZywgcHVibGljIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW4sIHJhd1RleHQ/OiBzdHJpbmcpIHtcbiAgICAvLyBJZiBgcmF3VGV4dGAgaXMgbm90IHByb3ZpZGVkLCB0cnkgdG8gZXh0cmFjdCB0aGUgcmF3IHN0cmluZyBmcm9tIGl0c1xuICAgIC8vIGFzc29jaWF0ZWQgYHNvdXJjZVNwYW5gLiBJZiB0aGF0IGlzIGFsc28gbm90IGF2YWlsYWJsZSwgXCJmYWtlXCIgdGhlIHJhd1xuICAgIC8vIHN0cmluZyBpbnN0ZWFkIGJ5IGVzY2FwaW5nIHRoZSBmb2xsb3dpbmcgY29udHJvbCBzZXF1ZW5jZXM6XG4gICAgLy8gLSBcIlxcXCIgd291bGQgb3RoZXJ3aXNlIGluZGljYXRlIHRoYXQgdGhlIG5leHQgY2hhcmFjdGVyIGlzIGEgY29udHJvbCBjaGFyYWN0ZXIuXG4gICAgLy8gLSBcImBcIiBhbmQgXCIke1wiIGFyZSB0ZW1wbGF0ZSBzdHJpbmcgY29udHJvbCBzZXF1ZW5jZXMgdGhhdCB3b3VsZCBvdGhlcndpc2UgcHJlbWF0dXJlbHlcbiAgICAvLyBpbmRpY2F0ZSB0aGUgZW5kIG9mIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIGVsZW1lbnQuXG4gICAgdGhpcy5yYXdUZXh0ID1cbiAgICAgICAgcmF3VGV4dCA/PyBzb3VyY2VTcGFuPy50b1N0cmluZygpID8/IGVzY2FwZUZvclRlbXBsYXRlTGl0ZXJhbChlc2NhcGVTbGFzaGVzKHRleHQpKTtcbiAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWVzc2FnZVBpZWNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHRleHQ6IHN0cmluZywgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbn1cbmV4cG9ydCBjbGFzcyBMaXRlcmFsUGllY2UgZXh0ZW5kcyBNZXNzYWdlUGllY2Uge31cbmV4cG9ydCBjbGFzcyBQbGFjZWhvbGRlclBpZWNlIGV4dGVuZHMgTWVzc2FnZVBpZWNlIHt9XG5cbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZWRTdHJpbmcgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICByZWFkb25seSBtZXRhQmxvY2s6IEkxOG5NZXRhLCByZWFkb25seSBtZXNzYWdlUGFydHM6IExpdGVyYWxQaWVjZVtdLFxuICAgICAgcmVhZG9ubHkgcGxhY2VIb2xkZXJOYW1lczogUGxhY2Vob2xkZXJQaWVjZVtdLCByZWFkb25seSBleHByZXNzaW9uczogRXhwcmVzc2lvbltdLFxuICAgICAgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKSB7XG4gICAgc3VwZXIoU1RSSU5HX1RZUEUsIHNvdXJjZVNwYW4pO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KGU6IEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICAvLyByZXR1cm4gZSBpbnN0YW5jZW9mIExvY2FsaXplZFN0cmluZyAmJiB0aGlzLm1lc3NhZ2UgPT09IGUubWVzc2FnZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBvdmVycmlkZSBpc0NvbnN0YW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdExvY2FsaXplZFN0cmluZyh0aGlzLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBtZXRhYCBhbmQgYG1lc3NhZ2VQYXJ0YCBpbnRvIFwiY29va2VkXCIgYW5kIFwicmF3XCIgc3RyaW5ncyB0aGF0IGNhbiBiZSB1c2VkXG4gICAqIGluIGEgYCRsb2NhbGl6ZWAgdGFnZ2VkIHN0cmluZy4gVGhlIGZvcm1hdCBvZiB0aGUgbWV0YWRhdGEgaXMgdGhlIHNhbWUgYXMgdGhhdCBwYXJzZWQgYnlcbiAgICogYHBhcnNlSTE4bk1ldGEoKWAuXG4gICAqXG4gICAqIEBwYXJhbSBtZXRhIFRoZSBtZXRhZGF0YSB0byBzZXJpYWxpemVcbiAgICogQHBhcmFtIG1lc3NhZ2VQYXJ0IFRoZSBmaXJzdCBwYXJ0IG9mIHRoZSB0YWdnZWQgc3RyaW5nXG4gICAqL1xuICBzZXJpYWxpemVJMThuSGVhZCgpOiBDb29rZWRSYXdTdHJpbmcge1xuICAgIGNvbnN0IE1FQU5JTkdfU0VQQVJBVE9SID0gJ3wnO1xuICAgIGNvbnN0IElEX1NFUEFSQVRPUiA9ICdAQCc7XG4gICAgY29uc3QgTEVHQUNZX0lEX0lORElDQVRPUiA9ICfikJ8nO1xuXG4gICAgbGV0IG1ldGFCbG9jayA9IHRoaXMubWV0YUJsb2NrLmRlc2NyaXB0aW9uIHx8ICcnO1xuICAgIGlmICh0aGlzLm1ldGFCbG9jay5tZWFuaW5nKSB7XG4gICAgICBtZXRhQmxvY2sgPSBgJHt0aGlzLm1ldGFCbG9jay5tZWFuaW5nfSR7TUVBTklOR19TRVBBUkFUT1J9JHttZXRhQmxvY2t9YDtcbiAgICB9XG4gICAgaWYgKHRoaXMubWV0YUJsb2NrLmN1c3RvbUlkKSB7XG4gICAgICBtZXRhQmxvY2sgPSBgJHttZXRhQmxvY2t9JHtJRF9TRVBBUkFUT1J9JHt0aGlzLm1ldGFCbG9jay5jdXN0b21JZH1gO1xuICAgIH1cbiAgICBpZiAodGhpcy5tZXRhQmxvY2subGVnYWN5SWRzKSB7XG4gICAgICB0aGlzLm1ldGFCbG9jay5sZWdhY3lJZHMuZm9yRWFjaChsZWdhY3lJZCA9PiB7XG4gICAgICAgIG1ldGFCbG9jayA9IGAke21ldGFCbG9ja30ke0xFR0FDWV9JRF9JTkRJQ0FUT1J9JHtsZWdhY3lJZH1gO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDb29rZWRSYXdTdHJpbmcoXG4gICAgICAgIG1ldGFCbG9jaywgdGhpcy5tZXNzYWdlUGFydHNbMF0udGV4dCwgdGhpcy5nZXRNZXNzYWdlUGFydFNvdXJjZVNwYW4oMCkpO1xuICB9XG5cbiAgZ2V0TWVzc2FnZVBhcnRTb3VyY2VTcGFuKGk6IG51bWJlcik6IFBhcnNlU291cmNlU3BhbnxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzYWdlUGFydHNbaV0/LnNvdXJjZVNwYW4gPz8gdGhpcy5zb3VyY2VTcGFuO1xuICB9XG5cbiAgZ2V0UGxhY2Vob2xkZXJTb3VyY2VTcGFuKGk6IG51bWJlcik6IFBhcnNlU291cmNlU3BhbiB7XG4gICAgcmV0dXJuIHRoaXMucGxhY2VIb2xkZXJOYW1lc1tpXT8uc291cmNlU3BhbiA/PyB0aGlzLmV4cHJlc3Npb25zW2ldPy5zb3VyY2VTcGFuID8/XG4gICAgICAgIHRoaXMuc291cmNlU3BhbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBwbGFjZWhvbGRlck5hbWVgIGFuZCBgbWVzc2FnZVBhcnRgIGludG8gXCJjb29rZWRcIiBhbmQgXCJyYXdcIiBzdHJpbmdzIHRoYXRcbiAgICogY2FuIGJlIHVzZWQgaW4gYSBgJGxvY2FsaXplYCB0YWdnZWQgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gcGxhY2Vob2xkZXJOYW1lIFRoZSBwbGFjZWhvbGRlciBuYW1lIHRvIHNlcmlhbGl6ZVxuICAgKiBAcGFyYW0gbWVzc2FnZVBhcnQgVGhlIGZvbGxvd2luZyBtZXNzYWdlIHN0cmluZyBhZnRlciB0aGlzIHBsYWNlaG9sZGVyXG4gICAqL1xuICBzZXJpYWxpemVJMThuVGVtcGxhdGVQYXJ0KHBhcnRJbmRleDogbnVtYmVyKTogQ29va2VkUmF3U3RyaW5nIHtcbiAgICBjb25zdCBwbGFjZWhvbGRlck5hbWUgPSB0aGlzLnBsYWNlSG9sZGVyTmFtZXNbcGFydEluZGV4IC0gMV0udGV4dDtcbiAgICBjb25zdCBtZXNzYWdlUGFydCA9IHRoaXMubWVzc2FnZVBhcnRzW3BhcnRJbmRleF07XG4gICAgcmV0dXJuIGNyZWF0ZUNvb2tlZFJhd1N0cmluZyhcbiAgICAgICAgcGxhY2Vob2xkZXJOYW1lLCBtZXNzYWdlUGFydC50ZXh0LCB0aGlzLmdldE1lc3NhZ2VQYXJ0U291cmNlU3BhbihwYXJ0SW5kZXgpKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgc3RydWN0dXJlIHRvIGhvbGQgdGhlIGNvb2tlZCBhbmQgcmF3IHN0cmluZ3Mgb2YgYSB0ZW1wbGF0ZSBsaXRlcmFsIGVsZW1lbnQsIGFsb25nIHdpdGggaXRzXG4gKiBzb3VyY2Utc3BhbiByYW5nZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb29rZWRSYXdTdHJpbmcge1xuICBjb29rZWQ6IHN0cmluZztcbiAgcmF3OiBzdHJpbmc7XG4gIHJhbmdlOiBQYXJzZVNvdXJjZVNwYW58bnVsbDtcbn1cblxuY29uc3QgZXNjYXBlU2xhc2hlcyA9IChzdHI6IHN0cmluZyk6IHN0cmluZyA9PiBzdHIucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKTtcbmNvbnN0IGVzY2FwZVN0YXJ0aW5nQ29sb24gPSAoc3RyOiBzdHJpbmcpOiBzdHJpbmcgPT4gc3RyLnJlcGxhY2UoL146LywgJ1xcXFw6Jyk7XG5jb25zdCBlc2NhcGVDb2xvbnMgPSAoc3RyOiBzdHJpbmcpOiBzdHJpbmcgPT4gc3RyLnJlcGxhY2UoLzovZywgJ1xcXFw6Jyk7XG5jb25zdCBlc2NhcGVGb3JUZW1wbGF0ZUxpdGVyYWwgPSAoc3RyOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICBzdHIucmVwbGFjZSgvYC9nLCAnXFxcXGAnKS5yZXBsYWNlKC9cXCR7L2csICckXFxcXHsnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYHtjb29rZWQsIHJhd31gIG9iamVjdCBmcm9tIHRoZSBgbWV0YUJsb2NrYCBhbmQgYG1lc3NhZ2VQYXJ0YC5cbiAqXG4gKiBUaGUgYHJhd2AgdGV4dCBtdXN0IGhhdmUgdmFyaW91cyBjaGFyYWN0ZXIgc2VxdWVuY2VzIGVzY2FwZWQ6XG4gKiAqIFwiXFxcIiB3b3VsZCBvdGhlcndpc2UgaW5kaWNhdGUgdGhhdCB0aGUgbmV4dCBjaGFyYWN0ZXIgaXMgYSBjb250cm9sIGNoYXJhY3Rlci5cbiAqICogXCJgXCIgYW5kIFwiJHtcIiBhcmUgdGVtcGxhdGUgc3RyaW5nIGNvbnRyb2wgc2VxdWVuY2VzIHRoYXQgd291bGQgb3RoZXJ3aXNlIHByZW1hdHVyZWx5IGluZGljYXRlXG4gKiAgIHRoZSBlbmQgb2YgYSBtZXNzYWdlIHBhcnQuXG4gKiAqIFwiOlwiIGluc2lkZSBhIG1ldGFibG9jayB3b3VsZCBwcmVtYXR1cmVseSBpbmRpY2F0ZSB0aGUgZW5kIG9mIHRoZSBtZXRhYmxvY2suXG4gKiAqIFwiOlwiIGF0IHRoZSBzdGFydCBvZiBhIG1lc3NhZ2VQYXJ0IHdpdGggbm8gbWV0YWJsb2NrIHdvdWxkIGVycm9uZW91c2x5IGluZGljYXRlIHRoZSBzdGFydCBvZiBhXG4gKiAgIG1ldGFibG9jay5cbiAqXG4gKiBAcGFyYW0gbWV0YUJsb2NrIEFueSBtZXRhZGF0YSB0aGF0IHNob3VsZCBiZSBwcmVwZW5kZWQgdG8gdGhlIHN0cmluZ1xuICogQHBhcmFtIG1lc3NhZ2VQYXJ0IFRoZSBtZXNzYWdlIHBhcnQgb2YgdGhlIHN0cmluZ1xuICovXG5mdW5jdGlvbiBjcmVhdGVDb29rZWRSYXdTdHJpbmcoXG4gICAgbWV0YUJsb2NrOiBzdHJpbmcsIG1lc3NhZ2VQYXJ0OiBzdHJpbmcsIHJhbmdlOiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IENvb2tlZFJhd1N0cmluZyB7XG4gIGlmIChtZXRhQmxvY2sgPT09ICcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvb2tlZDogbWVzc2FnZVBhcnQsXG4gICAgICByYXc6IGVzY2FwZUZvclRlbXBsYXRlTGl0ZXJhbChlc2NhcGVTdGFydGluZ0NvbG9uKGVzY2FwZVNsYXNoZXMobWVzc2FnZVBhcnQpKSksXG4gICAgICByYW5nZSxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBjb29rZWQ6IGA6JHttZXRhQmxvY2t9OiR7bWVzc2FnZVBhcnR9YCxcbiAgICAgIHJhdzogZXNjYXBlRm9yVGVtcGxhdGVMaXRlcmFsKFxuICAgICAgICAgIGA6JHtlc2NhcGVDb2xvbnMoZXNjYXBlU2xhc2hlcyhtZXRhQmxvY2spKX06JHtlc2NhcGVTbGFzaGVzKG1lc3NhZ2VQYXJ0KX1gKSxcbiAgICAgIHJhbmdlLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4dGVybmFsRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyB2YWx1ZTogRXh0ZXJuYWxSZWZlcmVuY2UsIHR5cGU/OiBUeXBlfG51bGwsIHB1YmxpYyB0eXBlUGFyYW1zOiBUeXBlW118bnVsbCA9IG51bGwsXG4gICAgICBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpIHtcbiAgICBzdXBlcih0eXBlLCBzb3VyY2VTcGFuKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudChlOiBFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBFeHRlcm5hbEV4cHIgJiYgdGhpcy52YWx1ZS5uYW1lID09PSBlLnZhbHVlLm5hbWUgJiZcbiAgICAgICAgdGhpcy52YWx1ZS5tb2R1bGVOYW1lID09PSBlLnZhbHVlLm1vZHVsZU5hbWUgJiYgdGhpcy52YWx1ZS5ydW50aW1lID09PSBlLnZhbHVlLnJ1bnRpbWU7XG4gIH1cblxuICBvdmVycmlkZSBpc0NvbnN0YW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEV4dGVybmFsRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxSZWZlcmVuY2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbW9kdWxlTmFtZTogc3RyaW5nfG51bGwsIHB1YmxpYyBuYW1lOiBzdHJpbmd8bnVsbCwgcHVibGljIHJ1bnRpbWU/OiBhbnl8bnVsbCkge1xuICB9XG4gIC8vIE5vdGU6IG5vIGlzRXF1aXZhbGVudCBtZXRob2QgaGVyZSBhcyB3ZSB1c2UgdGhpcyBhcyBhbiBpbnRlcmZhY2UgdG9vLlxufVxuXG5leHBvcnQgY2xhc3MgQ29uZGl0aW9uYWxFeHByIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gIHB1YmxpYyB0cnVlQ2FzZTogRXhwcmVzc2lvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBjb25kaXRpb246IEV4cHJlc3Npb24sIHRydWVDYXNlOiBFeHByZXNzaW9uLCBwdWJsaWMgZmFsc2VDYXNlOiBFeHByZXNzaW9ufG51bGwgPSBudWxsLFxuICAgICAgdHlwZT86IFR5cGV8bnVsbCwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKSB7XG4gICAgc3VwZXIodHlwZSB8fCB0cnVlQ2FzZS50eXBlLCBzb3VyY2VTcGFuKTtcbiAgICB0aGlzLnRydWVDYXNlID0gdHJ1ZUNhc2U7XG4gIH1cblxuICBvdmVycmlkZSBpc0VxdWl2YWxlbnQoZTogRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBlIGluc3RhbmNlb2YgQ29uZGl0aW9uYWxFeHByICYmIHRoaXMuY29uZGl0aW9uLmlzRXF1aXZhbGVudChlLmNvbmRpdGlvbikgJiZcbiAgICAgICAgdGhpcy50cnVlQ2FzZS5pc0VxdWl2YWxlbnQoZS50cnVlQ2FzZSkgJiYgbnVsbFNhZmVJc0VxdWl2YWxlbnQodGhpcy5mYWxzZUNhc2UsIGUuZmFsc2VDYXNlKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzQ29uc3RhbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29uZGl0aW9uYWxFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIE5vdEV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmRpdGlvbjogRXhwcmVzc2lvbiwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKSB7XG4gICAgc3VwZXIoQk9PTF9UWVBFLCBzb3VyY2VTcGFuKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudChlOiBFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBOb3RFeHByICYmIHRoaXMuY29uZGl0aW9uLmlzRXF1aXZhbGVudChlLmNvbmRpdGlvbik7XG4gIH1cblxuICBvdmVycmlkZSBpc0NvbnN0YW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdE5vdEV4cHIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFzc2VydE5vdE51bGwgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmRpdGlvbjogRXhwcmVzc2lvbiwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKSB7XG4gICAgc3VwZXIoY29uZGl0aW9uLnR5cGUsIHNvdXJjZVNwYW4pO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KGU6IEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gZSBpbnN0YW5jZW9mIEFzc2VydE5vdE51bGwgJiYgdGhpcy5jb25kaXRpb24uaXNFcXVpdmFsZW50KGUuY29uZGl0aW9uKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzQ29uc3RhbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXNzZXJ0Tm90TnVsbEV4cHIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENhc3RFeHByIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogRXhwcmVzc2lvbiwgdHlwZT86IFR5cGV8bnVsbCwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKSB7XG4gICAgc3VwZXIodHlwZSwgc291cmNlU3Bhbik7XG4gIH1cblxuICBvdmVycmlkZSBpc0VxdWl2YWxlbnQoZTogRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBlIGluc3RhbmNlb2YgQ2FzdEV4cHIgJiYgdGhpcy52YWx1ZS5pc0VxdWl2YWxlbnQoZS52YWx1ZSk7XG4gIH1cblxuICBvdmVycmlkZSBpc0NvbnN0YW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdENhc3RFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEZuUGFyYW0ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogVHlwZXxudWxsID0gbnVsbCkge31cblxuICBpc0VxdWl2YWxlbnQocGFyYW06IEZuUGFyYW0pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID09PSBwYXJhbS5uYW1lO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBwYXJhbXM6IEZuUGFyYW1bXSwgcHVibGljIHN0YXRlbWVudHM6IFN0YXRlbWVudFtdLCB0eXBlPzogVHlwZXxudWxsLFxuICAgICAgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsLCBwdWJsaWMgbmFtZT86IHN0cmluZ3xudWxsKSB7XG4gICAgc3VwZXIodHlwZSwgc291cmNlU3Bhbik7XG4gIH1cblxuICBvdmVycmlkZSBpc0VxdWl2YWxlbnQoZTogRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBlIGluc3RhbmNlb2YgRnVuY3Rpb25FeHByICYmIGFyZUFsbEVxdWl2YWxlbnQodGhpcy5wYXJhbXMsIGUucGFyYW1zKSAmJlxuICAgICAgICBhcmVBbGxFcXVpdmFsZW50KHRoaXMuc3RhdGVtZW50cywgZS5zdGF0ZW1lbnRzKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzQ29uc3RhbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RnVuY3Rpb25FeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG5cbiAgdG9EZWNsU3RtdChuYW1lOiBzdHJpbmcsIG1vZGlmaWVycz86IFN0bXRNb2RpZmllcltdKTogRGVjbGFyZUZ1bmN0aW9uU3RtdCB7XG4gICAgcmV0dXJuIG5ldyBEZWNsYXJlRnVuY3Rpb25TdG10KFxuICAgICAgICBuYW1lLCB0aGlzLnBhcmFtcywgdGhpcy5zdGF0ZW1lbnRzLCB0aGlzLnR5cGUsIG1vZGlmaWVycywgdGhpcy5zb3VyY2VTcGFuKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBVbmFyeU9wZXJhdG9yRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBvcGVyYXRvcjogVW5hcnlPcGVyYXRvciwgcHVibGljIGV4cHI6IEV4cHJlc3Npb24sIHR5cGU/OiBUeXBlfG51bGwsXG4gICAgICBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwsIHB1YmxpYyBwYXJlbnM6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgc3VwZXIodHlwZSB8fCBOVU1CRVJfVFlQRSwgc291cmNlU3Bhbik7XG4gIH1cblxuICBvdmVycmlkZSBpc0VxdWl2YWxlbnQoZTogRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBlIGluc3RhbmNlb2YgVW5hcnlPcGVyYXRvckV4cHIgJiYgdGhpcy5vcGVyYXRvciA9PT0gZS5vcGVyYXRvciAmJlxuICAgICAgICB0aGlzLmV4cHIuaXNFcXVpdmFsZW50KGUuZXhwcik7XG4gIH1cblxuICBvdmVycmlkZSBpc0NvbnN0YW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFVuYXJ5T3BlcmF0b3JFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEJpbmFyeU9wZXJhdG9yRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBwdWJsaWMgbGhzOiBFeHByZXNzaW9uO1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBvcGVyYXRvcjogQmluYXJ5T3BlcmF0b3IsIGxoczogRXhwcmVzc2lvbiwgcHVibGljIHJoczogRXhwcmVzc2lvbiwgdHlwZT86IFR5cGV8bnVsbCxcbiAgICAgIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCwgcHVibGljIHBhcmVuczogYm9vbGVhbiA9IHRydWUpIHtcbiAgICBzdXBlcih0eXBlIHx8IGxocy50eXBlLCBzb3VyY2VTcGFuKTtcbiAgICB0aGlzLmxocyA9IGxocztcbiAgfVxuXG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudChlOiBFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBCaW5hcnlPcGVyYXRvckV4cHIgJiYgdGhpcy5vcGVyYXRvciA9PT0gZS5vcGVyYXRvciAmJlxuICAgICAgICB0aGlzLmxocy5pc0VxdWl2YWxlbnQoZS5saHMpICYmIHRoaXMucmhzLmlzRXF1aXZhbGVudChlLnJocyk7XG4gIH1cblxuICBvdmVycmlkZSBpc0NvbnN0YW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEJpbmFyeU9wZXJhdG9yRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBSZWFkUHJvcEV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgcmVjZWl2ZXI6IEV4cHJlc3Npb24sIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHR5cGU/OiBUeXBlfG51bGwsXG4gICAgICBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpIHtcbiAgICBzdXBlcih0eXBlLCBzb3VyY2VTcGFuKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudChlOiBFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBSZWFkUHJvcEV4cHIgJiYgdGhpcy5yZWNlaXZlci5pc0VxdWl2YWxlbnQoZS5yZWNlaXZlcikgJiZcbiAgICAgICAgdGhpcy5uYW1lID09PSBlLm5hbWU7XG4gIH1cblxuICBvdmVycmlkZSBpc0NvbnN0YW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFJlYWRQcm9wRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxuXG4gIHNldCh2YWx1ZTogRXhwcmVzc2lvbik6IFdyaXRlUHJvcEV4cHIge1xuICAgIHJldHVybiBuZXcgV3JpdGVQcm9wRXhwcih0aGlzLnJlY2VpdmVyLCB0aGlzLm5hbWUsIHZhbHVlLCBudWxsLCB0aGlzLnNvdXJjZVNwYW4pO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFJlYWRLZXlFeHByIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIHJlY2VpdmVyOiBFeHByZXNzaW9uLCBwdWJsaWMgaW5kZXg6IEV4cHJlc3Npb24sIHR5cGU/OiBUeXBlfG51bGwsXG4gICAgICBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpIHtcbiAgICBzdXBlcih0eXBlLCBzb3VyY2VTcGFuKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudChlOiBFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGUgaW5zdGFuY2VvZiBSZWFkS2V5RXhwciAmJiB0aGlzLnJlY2VpdmVyLmlzRXF1aXZhbGVudChlLnJlY2VpdmVyKSAmJlxuICAgICAgICB0aGlzLmluZGV4LmlzRXF1aXZhbGVudChlLmluZGV4KTtcbiAgfVxuXG4gIG92ZXJyaWRlIGlzQ29uc3RhbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UmVhZEtleUV4cHIodGhpcywgY29udGV4dCk7XG4gIH1cblxuICBzZXQodmFsdWU6IEV4cHJlc3Npb24pOiBXcml0ZUtleUV4cHIge1xuICAgIHJldHVybiBuZXcgV3JpdGVLZXlFeHByKHRoaXMucmVjZWl2ZXIsIHRoaXMuaW5kZXgsIHZhbHVlLCBudWxsLCB0aGlzLnNvdXJjZVNwYW4pO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIExpdGVyYWxBcnJheUV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgcHVibGljIGVudHJpZXM6IEV4cHJlc3Npb25bXTtcbiAgY29uc3RydWN0b3IoZW50cmllczogRXhwcmVzc2lvbltdLCB0eXBlPzogVHlwZXxudWxsLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpIHtcbiAgICBzdXBlcih0eXBlLCBzb3VyY2VTcGFuKTtcbiAgICB0aGlzLmVudHJpZXMgPSBlbnRyaWVzO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNDb25zdGFudCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbnRyaWVzLmV2ZXJ5KGUgPT4gZS5pc0NvbnN0YW50KCkpO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KGU6IEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gZSBpbnN0YW5jZW9mIExpdGVyYWxBcnJheUV4cHIgJiYgYXJlQWxsRXF1aXZhbGVudCh0aGlzLmVudHJpZXMsIGUuZW50cmllcyk7XG4gIH1cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGl0ZXJhbEFycmF5RXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGl0ZXJhbE1hcEVudHJ5IHtcbiAgY29uc3RydWN0b3IocHVibGljIGtleTogc3RyaW5nLCBwdWJsaWMgdmFsdWU6IEV4cHJlc3Npb24sIHB1YmxpYyBxdW90ZWQ6IGJvb2xlYW4pIHt9XG4gIGlzRXF1aXZhbGVudChlOiBMaXRlcmFsTWFwRW50cnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5rZXkgPT09IGUua2V5ICYmIHRoaXMudmFsdWUuaXNFcXVpdmFsZW50KGUudmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsTWFwRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBwdWJsaWMgdmFsdWVUeXBlOiBUeXBlfG51bGwgPSBudWxsO1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBlbnRyaWVzOiBMaXRlcmFsTWFwRW50cnlbXSwgdHlwZT86IE1hcFR5cGV8bnVsbCwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKSB7XG4gICAgc3VwZXIodHlwZSwgc291cmNlU3Bhbik7XG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gdHlwZS52YWx1ZVR5cGU7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KGU6IEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gZSBpbnN0YW5jZW9mIExpdGVyYWxNYXBFeHByICYmIGFyZUFsbEVxdWl2YWxlbnQodGhpcy5lbnRyaWVzLCBlLmVudHJpZXMpO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNDb25zdGFudCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbnRyaWVzLmV2ZXJ5KGUgPT4gZS52YWx1ZS5pc0NvbnN0YW50KCkpO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGl0ZXJhbE1hcEV4cHIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbW1hRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFydHM6IEV4cHJlc3Npb25bXSwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKSB7XG4gICAgc3VwZXIocGFydHNbcGFydHMubGVuZ3RoIC0gMV0udHlwZSwgc291cmNlU3Bhbik7XG4gIH1cblxuICBvdmVycmlkZSBpc0VxdWl2YWxlbnQoZTogRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBlIGluc3RhbmNlb2YgQ29tbWFFeHByICYmIGFyZUFsbEVxdWl2YWxlbnQodGhpcy5wYXJ0cywgZS5wYXJ0cyk7XG4gIH1cblxuICBvdmVycmlkZSBpc0NvbnN0YW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbW1hRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV4cHJlc3Npb25WaXNpdG9yIHtcbiAgdmlzaXRSZWFkVmFyRXhwcihhc3Q6IFJlYWRWYXJFeHByLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0V3JpdGVWYXJFeHByKGV4cHI6IFdyaXRlVmFyRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFdyaXRlS2V5RXhwcihleHByOiBXcml0ZUtleUV4cHIsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRXcml0ZVByb3BFeHByKGV4cHI6IFdyaXRlUHJvcEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRJbnZva2VNZXRob2RFeHByKGFzdDogSW52b2tlTWV0aG9kRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEludm9rZUZ1bmN0aW9uRXhwcihhc3Q6IEludm9rZUZ1bmN0aW9uRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFRhZ2dlZFRlbXBsYXRlRXhwcihhc3Q6IFRhZ2dlZFRlbXBsYXRlRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEluc3RhbnRpYXRlRXhwcihhc3Q6IEluc3RhbnRpYXRlRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdExpdGVyYWxFeHByKGFzdDogTGl0ZXJhbEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRMb2NhbGl6ZWRTdHJpbmcoYXN0OiBMb2NhbGl6ZWRTdHJpbmcsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRFeHRlcm5hbEV4cHIoYXN0OiBFeHRlcm5hbEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRDb25kaXRpb25hbEV4cHIoYXN0OiBDb25kaXRpb25hbEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXROb3RFeHByKGFzdDogTm90RXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEFzc2VydE5vdE51bGxFeHByKGFzdDogQXNzZXJ0Tm90TnVsbCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdENhc3RFeHByKGFzdDogQ2FzdEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRGdW5jdGlvbkV4cHIoYXN0OiBGdW5jdGlvbkV4cHIsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRVbmFyeU9wZXJhdG9yRXhwcihhc3Q6IFVuYXJ5T3BlcmF0b3JFeHByLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0QmluYXJ5T3BlcmF0b3JFeHByKGFzdDogQmluYXJ5T3BlcmF0b3JFeHByLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0UmVhZFByb3BFeHByKGFzdDogUmVhZFByb3BFeHByLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0UmVhZEtleUV4cHIoYXN0OiBSZWFkS2V5RXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdExpdGVyYWxBcnJheUV4cHIoYXN0OiBMaXRlcmFsQXJyYXlFeHByLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0TGl0ZXJhbE1hcEV4cHIoYXN0OiBMaXRlcmFsTWFwRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdENvbW1hRXhwcihhc3Q6IENvbW1hRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFdyYXBwZWROb2RlRXhwcihhc3Q6IFdyYXBwZWROb2RlRXhwcjxhbnk+LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0VHlwZW9mRXhwcihhc3Q6IFR5cGVvZkV4cHIsIGNvbnRleHQ6IGFueSk6IGFueTtcbn1cblxuZXhwb3J0IGNvbnN0IFRISVNfRVhQUiA9IG5ldyBSZWFkVmFyRXhwcihCdWlsdGluVmFyLlRoaXMsIG51bGwsIG51bGwpO1xuZXhwb3J0IGNvbnN0IFNVUEVSX0VYUFIgPSBuZXcgUmVhZFZhckV4cHIoQnVpbHRpblZhci5TdXBlciwgbnVsbCwgbnVsbCk7XG5leHBvcnQgY29uc3QgQ0FUQ0hfRVJST1JfVkFSID0gbmV3IFJlYWRWYXJFeHByKEJ1aWx0aW5WYXIuQ2F0Y2hFcnJvciwgbnVsbCwgbnVsbCk7XG5leHBvcnQgY29uc3QgQ0FUQ0hfU1RBQ0tfVkFSID0gbmV3IFJlYWRWYXJFeHByKEJ1aWx0aW5WYXIuQ2F0Y2hTdGFjaywgbnVsbCwgbnVsbCk7XG5leHBvcnQgY29uc3QgTlVMTF9FWFBSID0gbmV3IExpdGVyYWxFeHByKG51bGwsIG51bGwsIG51bGwpO1xuZXhwb3J0IGNvbnN0IFRZUEVEX05VTExfRVhQUiA9IG5ldyBMaXRlcmFsRXhwcihudWxsLCBJTkZFUlJFRF9UWVBFLCBudWxsKTtcblxuLy8vLyBTdGF0ZW1lbnRzXG5leHBvcnQgZW51bSBTdG10TW9kaWZpZXIge1xuICBGaW5hbCxcbiAgUHJpdmF0ZSxcbiAgRXhwb3J0ZWQsXG4gIFN0YXRpYyxcbn1cblxuZXhwb3J0IGNsYXNzIExlYWRpbmdDb21tZW50IHtcbiAgY29uc3RydWN0b3IocHVibGljIHRleHQ6IHN0cmluZywgcHVibGljIG11bHRpbGluZTogYm9vbGVhbiwgcHVibGljIHRyYWlsaW5nTmV3bGluZTogYm9vbGVhbikge31cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlsaW5lID8gYCAke3RoaXMudGV4dH0gYCA6IHRoaXMudGV4dDtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIEpTRG9jQ29tbWVudCBleHRlbmRzIExlYWRpbmdDb21tZW50IHtcbiAgY29uc3RydWN0b3IocHVibGljIHRhZ3M6IEpTRG9jVGFnW10pIHtcbiAgICBzdXBlcignJywgLyogbXVsdGlsaW5lICovIHRydWUsIC8qIHRyYWlsaW5nTmV3bGluZSAqLyB0cnVlKTtcbiAgfVxuICBvdmVycmlkZSB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBzZXJpYWxpemVUYWdzKHRoaXMudGFncyk7XG4gIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN0YXRlbWVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIG1vZGlmaWVyczogU3RtdE1vZGlmaWVyW10gPSBbXSwgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbnxudWxsID0gbnVsbCxcbiAgICAgIHB1YmxpYyBsZWFkaW5nQ29tbWVudHM/OiBMZWFkaW5nQ29tbWVudFtdKSB7fVxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB3aGV0aGVyIHRoaXMgc3RhdGVtZW50IHByb2R1Y2VzIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBnaXZlbiBzdGF0ZW1lbnQuXG4gICAqIE5vdGU6IFdlIGRvbid0IGNoZWNrIFR5cGVzIG5vciBQYXJzZVNvdXJjZVNwYW5zIG5vciBmdW5jdGlvbiBhcmd1bWVudHMuXG4gICAqL1xuICBhYnN0cmFjdCBpc0VxdWl2YWxlbnQoc3RtdDogU3RhdGVtZW50KTogYm9vbGVhbjtcblxuICBhYnN0cmFjdCB2aXNpdFN0YXRlbWVudCh2aXNpdG9yOiBTdGF0ZW1lbnRWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnk7XG5cbiAgaGFzTW9kaWZpZXIobW9kaWZpZXI6IFN0bXRNb2RpZmllcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vZGlmaWVycy5pbmRleE9mKG1vZGlmaWVyKSAhPT0gLTE7XG4gIH1cblxuICBhZGRMZWFkaW5nQ29tbWVudChsZWFkaW5nQ29tbWVudDogTGVhZGluZ0NvbW1lbnQpOiB2b2lkIHtcbiAgICB0aGlzLmxlYWRpbmdDb21tZW50cyA9IHRoaXMubGVhZGluZ0NvbW1lbnRzID8/IFtdO1xuICAgIHRoaXMubGVhZGluZ0NvbW1lbnRzLnB1c2gobGVhZGluZ0NvbW1lbnQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIERlY2xhcmVWYXJTdG10IGV4dGVuZHMgU3RhdGVtZW50IHtcbiAgcHVibGljIHR5cGU6IFR5cGV8bnVsbDtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgdmFsdWU/OiBFeHByZXNzaW9uLCB0eXBlPzogVHlwZXxudWxsLCBtb2RpZmllcnM/OiBTdG10TW9kaWZpZXJbXSxcbiAgICAgIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCwgbGVhZGluZ0NvbW1lbnRzPzogTGVhZGluZ0NvbW1lbnRbXSkge1xuICAgIHN1cGVyKG1vZGlmaWVycywgc291cmNlU3BhbiwgbGVhZGluZ0NvbW1lbnRzKTtcbiAgICB0aGlzLnR5cGUgPSB0eXBlIHx8ICh2YWx1ZSAmJiB2YWx1ZS50eXBlKSB8fCBudWxsO1xuICB9XG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudChzdG10OiBTdGF0ZW1lbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gc3RtdCBpbnN0YW5jZW9mIERlY2xhcmVWYXJTdG10ICYmIHRoaXMubmFtZSA9PT0gc3RtdC5uYW1lICYmXG4gICAgICAgICh0aGlzLnZhbHVlID8gISFzdG10LnZhbHVlICYmIHRoaXMudmFsdWUuaXNFcXVpdmFsZW50KHN0bXQudmFsdWUpIDogIXN0bXQudmFsdWUpO1xuICB9XG4gIG92ZXJyaWRlIHZpc2l0U3RhdGVtZW50KHZpc2l0b3I6IFN0YXRlbWVudFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXREZWNsYXJlVmFyU3RtdCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVjbGFyZUZ1bmN0aW9uU3RtdCBleHRlbmRzIFN0YXRlbWVudCB7XG4gIHB1YmxpYyB0eXBlOiBUeXBlfG51bGw7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHBhcmFtczogRm5QYXJhbVtdLCBwdWJsaWMgc3RhdGVtZW50czogU3RhdGVtZW50W10sXG4gICAgICB0eXBlPzogVHlwZXxudWxsLCBtb2RpZmllcnM/OiBTdG10TW9kaWZpZXJbXSwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsLFxuICAgICAgbGVhZGluZ0NvbW1lbnRzPzogTGVhZGluZ0NvbW1lbnRbXSkge1xuICAgIHN1cGVyKG1vZGlmaWVycywgc291cmNlU3BhbiwgbGVhZGluZ0NvbW1lbnRzKTtcbiAgICB0aGlzLnR5cGUgPSB0eXBlIHx8IG51bGw7XG4gIH1cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KHN0bXQ6IFN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzdG10IGluc3RhbmNlb2YgRGVjbGFyZUZ1bmN0aW9uU3RtdCAmJiBhcmVBbGxFcXVpdmFsZW50KHRoaXMucGFyYW1zLCBzdG10LnBhcmFtcykgJiZcbiAgICAgICAgYXJlQWxsRXF1aXZhbGVudCh0aGlzLnN0YXRlbWVudHMsIHN0bXQuc3RhdGVtZW50cyk7XG4gIH1cbiAgb3ZlcnJpZGUgdmlzaXRTdGF0ZW1lbnQodmlzaXRvcjogU3RhdGVtZW50VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdERlY2xhcmVGdW5jdGlvblN0bXQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25TdGF0ZW1lbnQgZXh0ZW5kcyBTdGF0ZW1lbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBleHByOiBFeHByZXNzaW9uLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwsXG4gICAgICBsZWFkaW5nQ29tbWVudHM/OiBMZWFkaW5nQ29tbWVudFtdKSB7XG4gICAgc3VwZXIoW10sIHNvdXJjZVNwYW4sIGxlYWRpbmdDb21tZW50cyk7XG4gIH1cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KHN0bXQ6IFN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzdG10IGluc3RhbmNlb2YgRXhwcmVzc2lvblN0YXRlbWVudCAmJiB0aGlzLmV4cHIuaXNFcXVpdmFsZW50KHN0bXQuZXhwcik7XG4gIH1cbiAgb3ZlcnJpZGUgdmlzaXRTdGF0ZW1lbnQodmlzaXRvcjogU3RhdGVtZW50VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEV4cHJlc3Npb25TdG10KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFJldHVyblN0YXRlbWVudCBleHRlbmRzIFN0YXRlbWVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIHZhbHVlOiBFeHByZXNzaW9uLCBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW58bnVsbCA9IG51bGwsXG4gICAgICBsZWFkaW5nQ29tbWVudHM/OiBMZWFkaW5nQ29tbWVudFtdKSB7XG4gICAgc3VwZXIoW10sIHNvdXJjZVNwYW4sIGxlYWRpbmdDb21tZW50cyk7XG4gIH1cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KHN0bXQ6IFN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzdG10IGluc3RhbmNlb2YgUmV0dXJuU3RhdGVtZW50ICYmIHRoaXMudmFsdWUuaXNFcXVpdmFsZW50KHN0bXQudmFsdWUpO1xuICB9XG4gIG92ZXJyaWRlIHZpc2l0U3RhdGVtZW50KHZpc2l0b3I6IFN0YXRlbWVudFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRSZXR1cm5TdG10KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBYnN0cmFjdENsYXNzUGFydCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBUeXBlfG51bGwgPSBudWxsLCBwdWJsaWMgbW9kaWZpZXJzOiBTdG10TW9kaWZpZXJbXSA9IFtdKSB7fVxuICBoYXNNb2RpZmllcihtb2RpZmllcjogU3RtdE1vZGlmaWVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kaWZpZXJzLmluZGV4T2YobW9kaWZpZXIpICE9PSAtMTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2xhc3NGaWVsZCBleHRlbmRzIEFic3RyYWN0Q2xhc3NQYXJ0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgbmFtZTogc3RyaW5nLCB0eXBlPzogVHlwZXxudWxsLCBtb2RpZmllcnM/OiBTdG10TW9kaWZpZXJbXSxcbiAgICAgIHB1YmxpYyBpbml0aWFsaXplcj86IEV4cHJlc3Npb24pIHtcbiAgICBzdXBlcih0eXBlLCBtb2RpZmllcnMpO1xuICB9XG4gIGlzRXF1aXZhbGVudChmOiBDbGFzc0ZpZWxkKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZSA9PT0gZi5uYW1lO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIENsYXNzTWV0aG9kIGV4dGVuZHMgQWJzdHJhY3RDbGFzc1BhcnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmd8bnVsbCwgcHVibGljIHBhcmFtczogRm5QYXJhbVtdLCBwdWJsaWMgYm9keTogU3RhdGVtZW50W10sXG4gICAgICB0eXBlPzogVHlwZXxudWxsLCBtb2RpZmllcnM/OiBTdG10TW9kaWZpZXJbXSkge1xuICAgIHN1cGVyKHR5cGUsIG1vZGlmaWVycyk7XG4gIH1cbiAgaXNFcXVpdmFsZW50KG06IENsYXNzTWV0aG9kKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZSA9PT0gbS5uYW1lICYmIGFyZUFsbEVxdWl2YWxlbnQodGhpcy5ib2R5LCBtLmJvZHkpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIENsYXNzR2V0dGVyIGV4dGVuZHMgQWJzdHJhY3RDbGFzc1BhcnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBib2R5OiBTdGF0ZW1lbnRbXSwgdHlwZT86IFR5cGV8bnVsbCwgbW9kaWZpZXJzPzogU3RtdE1vZGlmaWVyW10pIHtcbiAgICBzdXBlcih0eXBlLCBtb2RpZmllcnMpO1xuICB9XG4gIGlzRXF1aXZhbGVudChtOiBDbGFzc0dldHRlcikge1xuICAgIHJldHVybiB0aGlzLm5hbWUgPT09IG0ubmFtZSAmJiBhcmVBbGxFcXVpdmFsZW50KHRoaXMuYm9keSwgbS5ib2R5KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBDbGFzc1N0bXQgZXh0ZW5kcyBTdGF0ZW1lbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBwYXJlbnQ6IEV4cHJlc3Npb258bnVsbCwgcHVibGljIGZpZWxkczogQ2xhc3NGaWVsZFtdLFxuICAgICAgcHVibGljIGdldHRlcnM6IENsYXNzR2V0dGVyW10sIHB1YmxpYyBjb25zdHJ1Y3Rvck1ldGhvZDogQ2xhc3NNZXRob2QsXG4gICAgICBwdWJsaWMgbWV0aG9kczogQ2xhc3NNZXRob2RbXSwgbW9kaWZpZXJzPzogU3RtdE1vZGlmaWVyW10sIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCxcbiAgICAgIGxlYWRpbmdDb21tZW50cz86IExlYWRpbmdDb21tZW50W10pIHtcbiAgICBzdXBlcihtb2RpZmllcnMsIHNvdXJjZVNwYW4sIGxlYWRpbmdDb21tZW50cyk7XG4gIH1cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KHN0bXQ6IFN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzdG10IGluc3RhbmNlb2YgQ2xhc3NTdG10ICYmIHRoaXMubmFtZSA9PT0gc3RtdC5uYW1lICYmXG4gICAgICAgIG51bGxTYWZlSXNFcXVpdmFsZW50KHRoaXMucGFyZW50LCBzdG10LnBhcmVudCkgJiZcbiAgICAgICAgYXJlQWxsRXF1aXZhbGVudCh0aGlzLmZpZWxkcywgc3RtdC5maWVsZHMpICYmXG4gICAgICAgIGFyZUFsbEVxdWl2YWxlbnQodGhpcy5nZXR0ZXJzLCBzdG10LmdldHRlcnMpICYmXG4gICAgICAgIHRoaXMuY29uc3RydWN0b3JNZXRob2QuaXNFcXVpdmFsZW50KHN0bXQuY29uc3RydWN0b3JNZXRob2QpICYmXG4gICAgICAgIGFyZUFsbEVxdWl2YWxlbnQodGhpcy5tZXRob2RzLCBzdG10Lm1ldGhvZHMpO1xuICB9XG4gIG92ZXJyaWRlIHZpc2l0U3RhdGVtZW50KHZpc2l0b3I6IFN0YXRlbWVudFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXREZWNsYXJlQ2xhc3NTdG10KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIElmU3RtdCBleHRlbmRzIFN0YXRlbWVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGNvbmRpdGlvbjogRXhwcmVzc2lvbiwgcHVibGljIHRydWVDYXNlOiBTdGF0ZW1lbnRbXSxcbiAgICAgIHB1YmxpYyBmYWxzZUNhc2U6IFN0YXRlbWVudFtdID0gW10sIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCxcbiAgICAgIGxlYWRpbmdDb21tZW50cz86IExlYWRpbmdDb21tZW50W10pIHtcbiAgICBzdXBlcihbXSwgc291cmNlU3BhbiwgbGVhZGluZ0NvbW1lbnRzKTtcbiAgfVxuICBvdmVycmlkZSBpc0VxdWl2YWxlbnQoc3RtdDogU3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHN0bXQgaW5zdGFuY2VvZiBJZlN0bXQgJiYgdGhpcy5jb25kaXRpb24uaXNFcXVpdmFsZW50KHN0bXQuY29uZGl0aW9uKSAmJlxuICAgICAgICBhcmVBbGxFcXVpdmFsZW50KHRoaXMudHJ1ZUNhc2UsIHN0bXQudHJ1ZUNhc2UpICYmXG4gICAgICAgIGFyZUFsbEVxdWl2YWxlbnQodGhpcy5mYWxzZUNhc2UsIHN0bXQuZmFsc2VDYXNlKTtcbiAgfVxuICBvdmVycmlkZSB2aXNpdFN0YXRlbWVudCh2aXNpdG9yOiBTdGF0ZW1lbnRWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0SWZTdG10KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUcnlDYXRjaFN0bXQgZXh0ZW5kcyBTdGF0ZW1lbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBib2R5U3RtdHM6IFN0YXRlbWVudFtdLCBwdWJsaWMgY2F0Y2hTdG10czogU3RhdGVtZW50W10sXG4gICAgICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW58bnVsbCA9IG51bGwsIGxlYWRpbmdDb21tZW50cz86IExlYWRpbmdDb21tZW50W10pIHtcbiAgICBzdXBlcihbXSwgc291cmNlU3BhbiwgbGVhZGluZ0NvbW1lbnRzKTtcbiAgfVxuICBvdmVycmlkZSBpc0VxdWl2YWxlbnQoc3RtdDogU3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHN0bXQgaW5zdGFuY2VvZiBUcnlDYXRjaFN0bXQgJiYgYXJlQWxsRXF1aXZhbGVudCh0aGlzLmJvZHlTdG10cywgc3RtdC5ib2R5U3RtdHMpICYmXG4gICAgICAgIGFyZUFsbEVxdWl2YWxlbnQodGhpcy5jYXRjaFN0bXRzLCBzdG10LmNhdGNoU3RtdHMpO1xuICB9XG4gIG92ZXJyaWRlIHZpc2l0U3RhdGVtZW50KHZpc2l0b3I6IFN0YXRlbWVudFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUcnlDYXRjaFN0bXQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgVGhyb3dTdG10IGV4dGVuZHMgU3RhdGVtZW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgZXJyb3I6IEV4cHJlc3Npb24sIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbnxudWxsID0gbnVsbCxcbiAgICAgIGxlYWRpbmdDb21tZW50cz86IExlYWRpbmdDb21tZW50W10pIHtcbiAgICBzdXBlcihbXSwgc291cmNlU3BhbiwgbGVhZGluZ0NvbW1lbnRzKTtcbiAgfVxuICBvdmVycmlkZSBpc0VxdWl2YWxlbnQoc3RtdDogVGhyb3dTdG10KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHN0bXQgaW5zdGFuY2VvZiBUcnlDYXRjaFN0bXQgJiYgdGhpcy5lcnJvci5pc0VxdWl2YWxlbnQoc3RtdC5lcnJvcik7XG4gIH1cbiAgb3ZlcnJpZGUgdmlzaXRTdGF0ZW1lbnQodmlzaXRvcjogU3RhdGVtZW50VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFRocm93U3RtdCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRlbWVudFZpc2l0b3Ige1xuICB2aXNpdERlY2xhcmVWYXJTdG10KHN0bXQ6IERlY2xhcmVWYXJTdG10LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0RGVjbGFyZUZ1bmN0aW9uU3RtdChzdG10OiBEZWNsYXJlRnVuY3Rpb25TdG10LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0RXhwcmVzc2lvblN0bXQoc3RtdDogRXhwcmVzc2lvblN0YXRlbWVudCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFJldHVyblN0bXQoc3RtdDogUmV0dXJuU3RhdGVtZW50LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0RGVjbGFyZUNsYXNzU3RtdChzdG10OiBDbGFzc1N0bXQsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRJZlN0bXQoc3RtdDogSWZTdG10LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0VHJ5Q2F0Y2hTdG10KHN0bXQ6IFRyeUNhdGNoU3RtdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFRocm93U3RtdChzdG10OiBUaHJvd1N0bXQsIGNvbnRleHQ6IGFueSk6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIEFzdFRyYW5zZm9ybWVyIGltcGxlbWVudHMgU3RhdGVtZW50VmlzaXRvciwgRXhwcmVzc2lvblZpc2l0b3Ige1xuICB0cmFuc2Zvcm1FeHByKGV4cHI6IEV4cHJlc3Npb24sIGNvbnRleHQ6IGFueSk6IEV4cHJlc3Npb24ge1xuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgdHJhbnNmb3JtU3RtdChzdG10OiBTdGF0ZW1lbnQsIGNvbnRleHQ6IGFueSk6IFN0YXRlbWVudCB7XG4gICAgcmV0dXJuIHN0bXQ7XG4gIH1cblxuICB2aXNpdFJlYWRWYXJFeHByKGFzdDogUmVhZFZhckV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtRXhwcihhc3QsIGNvbnRleHQpO1xuICB9XG5cbiAgdmlzaXRXcmFwcGVkTm9kZUV4cHIoYXN0OiBXcmFwcGVkTm9kZUV4cHI8YW55PiwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1FeHByKGFzdCwgY29udGV4dCk7XG4gIH1cblxuICB2aXNpdFR5cGVvZkV4cHIoZXhwcjogVHlwZW9mRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1FeHByKFxuICAgICAgICBuZXcgVHlwZW9mRXhwcihleHByLmV4cHIudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLCBleHByLnR5cGUsIGV4cHIuc291cmNlU3BhbiksXG4gICAgICAgIGNvbnRleHQpO1xuICB9XG5cbiAgdmlzaXRXcml0ZVZhckV4cHIoZXhwcjogV3JpdGVWYXJFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoXG4gICAgICAgIG5ldyBXcml0ZVZhckV4cHIoXG4gICAgICAgICAgICBleHByLm5hbWUsIGV4cHIudmFsdWUudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLCBleHByLnR5cGUsIGV4cHIuc291cmNlU3BhbiksXG4gICAgICAgIGNvbnRleHQpO1xuICB9XG5cbiAgdmlzaXRXcml0ZUtleUV4cHIoZXhwcjogV3JpdGVLZXlFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoXG4gICAgICAgIG5ldyBXcml0ZUtleUV4cHIoXG4gICAgICAgICAgICBleHByLnJlY2VpdmVyLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSwgZXhwci5pbmRleC52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksXG4gICAgICAgICAgICBleHByLnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSwgZXhwci50eXBlLCBleHByLnNvdXJjZVNwYW4pLFxuICAgICAgICBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0V3JpdGVQcm9wRXhwcihleHByOiBXcml0ZVByb3BFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoXG4gICAgICAgIG5ldyBXcml0ZVByb3BFeHByKFxuICAgICAgICAgICAgZXhwci5yZWNlaXZlci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksIGV4cHIubmFtZSxcbiAgICAgICAgICAgIGV4cHIudmFsdWUudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLCBleHByLnR5cGUsIGV4cHIuc291cmNlU3BhbiksXG4gICAgICAgIGNvbnRleHQpO1xuICB9XG5cbiAgdmlzaXRJbnZva2VNZXRob2RFeHByKGFzdDogSW52b2tlTWV0aG9kRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBjb25zdCBtZXRob2QgPSBhc3QuYnVpbHRpbiB8fCBhc3QubmFtZTtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1FeHByKFxuICAgICAgICBuZXcgSW52b2tlTWV0aG9kRXhwcihcbiAgICAgICAgICAgIGFzdC5yZWNlaXZlci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksIG1ldGhvZCEsXG4gICAgICAgICAgICB0aGlzLnZpc2l0QWxsRXhwcmVzc2lvbnMoYXN0LmFyZ3MsIGNvbnRleHQpLCBhc3QudHlwZSwgYXN0LnNvdXJjZVNwYW4pLFxuICAgICAgICBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0SW52b2tlRnVuY3Rpb25FeHByKGFzdDogSW52b2tlRnVuY3Rpb25FeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoXG4gICAgICAgIG5ldyBJbnZva2VGdW5jdGlvbkV4cHIoXG4gICAgICAgICAgICBhc3QuZm4udmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLCB0aGlzLnZpc2l0QWxsRXhwcmVzc2lvbnMoYXN0LmFyZ3MsIGNvbnRleHQpLFxuICAgICAgICAgICAgYXN0LnR5cGUsIGFzdC5zb3VyY2VTcGFuKSxcbiAgICAgICAgY29udGV4dCk7XG4gIH1cblxuICB2aXNpdFRhZ2dlZFRlbXBsYXRlRXhwcihhc3Q6IFRhZ2dlZFRlbXBsYXRlRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1FeHByKFxuICAgICAgICBuZXcgVGFnZ2VkVGVtcGxhdGVFeHByKFxuICAgICAgICAgICAgYXN0LnRhZy52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksXG4gICAgICAgICAgICBuZXcgVGVtcGxhdGVMaXRlcmFsKFxuICAgICAgICAgICAgICAgIGFzdC50ZW1wbGF0ZS5lbGVtZW50cyxcbiAgICAgICAgICAgICAgICBhc3QudGVtcGxhdGUuZXhwcmVzc2lvbnMubWFwKChlKSA9PiBlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSkpLFxuICAgICAgICAgICAgYXN0LnR5cGUsIGFzdC5zb3VyY2VTcGFuKSxcbiAgICAgICAgY29udGV4dCk7XG4gIH1cblxuICB2aXNpdEluc3RhbnRpYXRlRXhwcihhc3Q6IEluc3RhbnRpYXRlRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1FeHByKFxuICAgICAgICBuZXcgSW5zdGFudGlhdGVFeHByKFxuICAgICAgICAgICAgYXN0LmNsYXNzRXhwci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksXG4gICAgICAgICAgICB0aGlzLnZpc2l0QWxsRXhwcmVzc2lvbnMoYXN0LmFyZ3MsIGNvbnRleHQpLCBhc3QudHlwZSwgYXN0LnNvdXJjZVNwYW4pLFxuICAgICAgICBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0TGl0ZXJhbEV4cHIoYXN0OiBMaXRlcmFsRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1FeHByKGFzdCwgY29udGV4dCk7XG4gIH1cblxuICB2aXNpdExvY2FsaXplZFN0cmluZyhhc3Q6IExvY2FsaXplZFN0cmluZywgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1FeHByKFxuICAgICAgICBuZXcgTG9jYWxpemVkU3RyaW5nKFxuICAgICAgICAgICAgYXN0Lm1ldGFCbG9jaywgYXN0Lm1lc3NhZ2VQYXJ0cywgYXN0LnBsYWNlSG9sZGVyTmFtZXMsXG4gICAgICAgICAgICB0aGlzLnZpc2l0QWxsRXhwcmVzc2lvbnMoYXN0LmV4cHJlc3Npb25zLCBjb250ZXh0KSwgYXN0LnNvdXJjZVNwYW4pLFxuICAgICAgICBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0RXh0ZXJuYWxFeHByKGFzdDogRXh0ZXJuYWxFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoYXN0LCBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0Q29uZGl0aW9uYWxFeHByKGFzdDogQ29uZGl0aW9uYWxFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoXG4gICAgICAgIG5ldyBDb25kaXRpb25hbEV4cHIoXG4gICAgICAgICAgICBhc3QuY29uZGl0aW9uLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSxcbiAgICAgICAgICAgIGFzdC50cnVlQ2FzZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksXG4gICAgICAgICAgICBhc3QuZmFsc2VDYXNlIS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksIGFzdC50eXBlLCBhc3Quc291cmNlU3BhbiksXG4gICAgICAgIGNvbnRleHQpO1xuICB9XG5cbiAgdmlzaXROb3RFeHByKGFzdDogTm90RXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1FeHByKFxuICAgICAgICBuZXcgTm90RXhwcihhc3QuY29uZGl0aW9uLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSwgYXN0LnNvdXJjZVNwYW4pLCBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0QXNzZXJ0Tm90TnVsbEV4cHIoYXN0OiBBc3NlcnROb3ROdWxsLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoXG4gICAgICAgIG5ldyBBc3NlcnROb3ROdWxsKGFzdC5jb25kaXRpb24udmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLCBhc3Quc291cmNlU3BhbiksIGNvbnRleHQpO1xuICB9XG5cbiAgdmlzaXRDYXN0RXhwcihhc3Q6IENhc3RFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoXG4gICAgICAgIG5ldyBDYXN0RXhwcihhc3QudmFsdWUudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLCBhc3QudHlwZSwgYXN0LnNvdXJjZVNwYW4pLCBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0RnVuY3Rpb25FeHByKGFzdDogRnVuY3Rpb25FeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoXG4gICAgICAgIG5ldyBGdW5jdGlvbkV4cHIoXG4gICAgICAgICAgICBhc3QucGFyYW1zLCB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhhc3Quc3RhdGVtZW50cywgY29udGV4dCksIGFzdC50eXBlLCBhc3Quc291cmNlU3BhbiksXG4gICAgICAgIGNvbnRleHQpO1xuICB9XG5cbiAgdmlzaXRVbmFyeU9wZXJhdG9yRXhwcihhc3Q6IFVuYXJ5T3BlcmF0b3JFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoXG4gICAgICAgIG5ldyBVbmFyeU9wZXJhdG9yRXhwcihcbiAgICAgICAgICAgIGFzdC5vcGVyYXRvciwgYXN0LmV4cHIudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLCBhc3QudHlwZSwgYXN0LnNvdXJjZVNwYW4pLFxuICAgICAgICBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0QmluYXJ5T3BlcmF0b3JFeHByKGFzdDogQmluYXJ5T3BlcmF0b3JFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoXG4gICAgICAgIG5ldyBCaW5hcnlPcGVyYXRvckV4cHIoXG4gICAgICAgICAgICBhc3Qub3BlcmF0b3IsIGFzdC5saHMudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLFxuICAgICAgICAgICAgYXN0LnJocy52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksIGFzdC50eXBlLCBhc3Quc291cmNlU3BhbiksXG4gICAgICAgIGNvbnRleHQpO1xuICB9XG5cbiAgdmlzaXRSZWFkUHJvcEV4cHIoYXN0OiBSZWFkUHJvcEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtRXhwcihcbiAgICAgICAgbmV3IFJlYWRQcm9wRXhwcihcbiAgICAgICAgICAgIGFzdC5yZWNlaXZlci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksIGFzdC5uYW1lLCBhc3QudHlwZSwgYXN0LnNvdXJjZVNwYW4pLFxuICAgICAgICBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0UmVhZEtleUV4cHIoYXN0OiBSZWFkS2V5RXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1FeHByKFxuICAgICAgICBuZXcgUmVhZEtleUV4cHIoXG4gICAgICAgICAgICBhc3QucmVjZWl2ZXIudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLCBhc3QuaW5kZXgudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLFxuICAgICAgICAgICAgYXN0LnR5cGUsIGFzdC5zb3VyY2VTcGFuKSxcbiAgICAgICAgY29udGV4dCk7XG4gIH1cblxuICB2aXNpdExpdGVyYWxBcnJheUV4cHIoYXN0OiBMaXRlcmFsQXJyYXlFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIoXG4gICAgICAgIG5ldyBMaXRlcmFsQXJyYXlFeHByKFxuICAgICAgICAgICAgdGhpcy52aXNpdEFsbEV4cHJlc3Npb25zKGFzdC5lbnRyaWVzLCBjb250ZXh0KSwgYXN0LnR5cGUsIGFzdC5zb3VyY2VTcGFuKSxcbiAgICAgICAgY29udGV4dCk7XG4gIH1cblxuICB2aXNpdExpdGVyYWxNYXBFeHByKGFzdDogTGl0ZXJhbE1hcEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgY29uc3QgZW50cmllcyA9IGFzdC5lbnRyaWVzLm1hcChcbiAgICAgICAgKGVudHJ5KTogTGl0ZXJhbE1hcEVudHJ5ID0+IG5ldyBMaXRlcmFsTWFwRW50cnkoXG4gICAgICAgICAgICBlbnRyeS5rZXksIGVudHJ5LnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSwgZW50cnkucXVvdGVkKSk7XG4gICAgY29uc3QgbWFwVHlwZSA9IG5ldyBNYXBUeXBlKGFzdC52YWx1ZVR5cGUpO1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUV4cHIobmV3IExpdGVyYWxNYXBFeHByKGVudHJpZXMsIG1hcFR5cGUsIGFzdC5zb3VyY2VTcGFuKSwgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRDb21tYUV4cHIoYXN0OiBDb21tYUV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtRXhwcihcbiAgICAgICAgbmV3IENvbW1hRXhwcih0aGlzLnZpc2l0QWxsRXhwcmVzc2lvbnMoYXN0LnBhcnRzLCBjb250ZXh0KSwgYXN0LnNvdXJjZVNwYW4pLCBjb250ZXh0KTtcbiAgfVxuICB2aXNpdEFsbEV4cHJlc3Npb25zPFQgZXh0ZW5kcyBFeHByZXNzaW9uPihleHByczogVFtdLCBjb250ZXh0OiBhbnkpOiBUW10ge1xuICAgIHJldHVybiBleHBycy5tYXAoZXhwciA9PiBleHByLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSk7XG4gIH1cblxuICB2aXNpdERlY2xhcmVWYXJTdG10KHN0bXQ6IERlY2xhcmVWYXJTdG10LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gc3RtdC52YWx1ZSAmJiBzdG10LnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1TdG10KFxuICAgICAgICBuZXcgRGVjbGFyZVZhclN0bXQoXG4gICAgICAgICAgICBzdG10Lm5hbWUsIHZhbHVlLCBzdG10LnR5cGUsIHN0bXQubW9kaWZpZXJzLCBzdG10LnNvdXJjZVNwYW4sIHN0bXQubGVhZGluZ0NvbW1lbnRzKSxcbiAgICAgICAgY29udGV4dCk7XG4gIH1cbiAgdmlzaXREZWNsYXJlRnVuY3Rpb25TdG10KHN0bXQ6IERlY2xhcmVGdW5jdGlvblN0bXQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtU3RtdChcbiAgICAgICAgbmV3IERlY2xhcmVGdW5jdGlvblN0bXQoXG4gICAgICAgICAgICBzdG10Lm5hbWUsIHN0bXQucGFyYW1zLCB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhzdG10LnN0YXRlbWVudHMsIGNvbnRleHQpLCBzdG10LnR5cGUsXG4gICAgICAgICAgICBzdG10Lm1vZGlmaWVycywgc3RtdC5zb3VyY2VTcGFuLCBzdG10LmxlYWRpbmdDb21tZW50cyksXG4gICAgICAgIGNvbnRleHQpO1xuICB9XG5cbiAgdmlzaXRFeHByZXNzaW9uU3RtdChzdG10OiBFeHByZXNzaW9uU3RhdGVtZW50LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybVN0bXQoXG4gICAgICAgIG5ldyBFeHByZXNzaW9uU3RhdGVtZW50KFxuICAgICAgICAgICAgc3RtdC5leHByLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSwgc3RtdC5zb3VyY2VTcGFuLCBzdG10LmxlYWRpbmdDb21tZW50cyksXG4gICAgICAgIGNvbnRleHQpO1xuICB9XG5cbiAgdmlzaXRSZXR1cm5TdG10KHN0bXQ6IFJldHVyblN0YXRlbWVudCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1TdG10KFxuICAgICAgICBuZXcgUmV0dXJuU3RhdGVtZW50KFxuICAgICAgICAgICAgc3RtdC52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksIHN0bXQuc291cmNlU3Bhbiwgc3RtdC5sZWFkaW5nQ29tbWVudHMpLFxuICAgICAgICBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0RGVjbGFyZUNsYXNzU3RtdChzdG10OiBDbGFzc1N0bXQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgY29uc3QgcGFyZW50ID0gc3RtdC5wYXJlbnQhLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICBjb25zdCBnZXR0ZXJzID0gc3RtdC5nZXR0ZXJzLm1hcChcbiAgICAgICAgZ2V0dGVyID0+IG5ldyBDbGFzc0dldHRlcihcbiAgICAgICAgICAgIGdldHRlci5uYW1lLCB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhnZXR0ZXIuYm9keSwgY29udGV4dCksIGdldHRlci50eXBlLFxuICAgICAgICAgICAgZ2V0dGVyLm1vZGlmaWVycykpO1xuICAgIGNvbnN0IGN0b3JNZXRob2QgPSBzdG10LmNvbnN0cnVjdG9yTWV0aG9kICYmXG4gICAgICAgIG5ldyBDbGFzc01ldGhvZChzdG10LmNvbnN0cnVjdG9yTWV0aG9kLm5hbWUsIHN0bXQuY29uc3RydWN0b3JNZXRob2QucGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoc3RtdC5jb25zdHJ1Y3Rvck1ldGhvZC5ib2R5LCBjb250ZXh0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0bXQuY29uc3RydWN0b3JNZXRob2QudHlwZSwgc3RtdC5jb25zdHJ1Y3Rvck1ldGhvZC5tb2RpZmllcnMpO1xuICAgIGNvbnN0IG1ldGhvZHMgPSBzdG10Lm1ldGhvZHMubWFwKFxuICAgICAgICBtZXRob2QgPT4gbmV3IENsYXNzTWV0aG9kKFxuICAgICAgICAgICAgbWV0aG9kLm5hbWUsIG1ldGhvZC5wYXJhbXMsIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKG1ldGhvZC5ib2R5LCBjb250ZXh0KSwgbWV0aG9kLnR5cGUsXG4gICAgICAgICAgICBtZXRob2QubW9kaWZpZXJzKSk7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtU3RtdChcbiAgICAgICAgbmV3IENsYXNzU3RtdChcbiAgICAgICAgICAgIHN0bXQubmFtZSwgcGFyZW50LCBzdG10LmZpZWxkcywgZ2V0dGVycywgY3Rvck1ldGhvZCwgbWV0aG9kcywgc3RtdC5tb2RpZmllcnMsXG4gICAgICAgICAgICBzdG10LnNvdXJjZVNwYW4pLFxuICAgICAgICBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0SWZTdG10KHN0bXQ6IElmU3RtdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1TdG10KFxuICAgICAgICBuZXcgSWZTdG10KFxuICAgICAgICAgICAgc3RtdC5jb25kaXRpb24udmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLFxuICAgICAgICAgICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoc3RtdC50cnVlQ2FzZSwgY29udGV4dCksXG4gICAgICAgICAgICB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhzdG10LmZhbHNlQ2FzZSwgY29udGV4dCksIHN0bXQuc291cmNlU3BhbixcbiAgICAgICAgICAgIHN0bXQubGVhZGluZ0NvbW1lbnRzKSxcbiAgICAgICAgY29udGV4dCk7XG4gIH1cblxuICB2aXNpdFRyeUNhdGNoU3RtdChzdG10OiBUcnlDYXRjaFN0bXQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtU3RtdChcbiAgICAgICAgbmV3IFRyeUNhdGNoU3RtdChcbiAgICAgICAgICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKHN0bXQuYm9keVN0bXRzLCBjb250ZXh0KSxcbiAgICAgICAgICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKHN0bXQuY2F0Y2hTdG10cywgY29udGV4dCksIHN0bXQuc291cmNlU3BhbixcbiAgICAgICAgICAgIHN0bXQubGVhZGluZ0NvbW1lbnRzKSxcbiAgICAgICAgY29udGV4dCk7XG4gIH1cblxuICB2aXNpdFRocm93U3RtdChzdG10OiBUaHJvd1N0bXQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtU3RtdChcbiAgICAgICAgbmV3IFRocm93U3RtdChcbiAgICAgICAgICAgIHN0bXQuZXJyb3IudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLCBzdG10LnNvdXJjZVNwYW4sIHN0bXQubGVhZGluZ0NvbW1lbnRzKSxcbiAgICAgICAgY29udGV4dCk7XG4gIH1cblxuICB2aXNpdEFsbFN0YXRlbWVudHMoc3RtdHM6IFN0YXRlbWVudFtdLCBjb250ZXh0OiBhbnkpOiBTdGF0ZW1lbnRbXSB7XG4gICAgcmV0dXJuIHN0bXRzLm1hcChzdG10ID0+IHN0bXQudmlzaXRTdGF0ZW1lbnQodGhpcywgY29udGV4dCkpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFJlY3Vyc2l2ZUFzdFZpc2l0b3IgaW1wbGVtZW50cyBTdGF0ZW1lbnRWaXNpdG9yLCBFeHByZXNzaW9uVmlzaXRvciB7XG4gIHZpc2l0VHlwZShhc3Q6IFR5cGUsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuICB2aXNpdEV4cHJlc3Npb24oYXN0OiBFeHByZXNzaW9uLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGlmIChhc3QudHlwZSkge1xuICAgICAgYXN0LnR5cGUudmlzaXRUeXBlKHRoaXMsIGNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gYXN0O1xuICB9XG4gIHZpc2l0QnVpbHRpblR5cGUodHlwZTogQnVpbHRpblR5cGUsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRUeXBlKHR5cGUsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0RXhwcmVzc2lvblR5cGUodHlwZTogRXhwcmVzc2lvblR5cGUsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdHlwZS52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgaWYgKHR5cGUudHlwZVBhcmFtcyAhPT0gbnVsbCkge1xuICAgICAgdHlwZS50eXBlUGFyYW1zLmZvckVhY2gocGFyYW0gPT4gdGhpcy52aXNpdFR5cGUocGFyYW0sIGNvbnRleHQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudmlzaXRUeXBlKHR5cGUsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0QXJyYXlUeXBlKHR5cGU6IEFycmF5VHlwZSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52aXNpdFR5cGUodHlwZSwgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRNYXBUeXBlKHR5cGU6IE1hcFR5cGUsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRUeXBlKHR5cGUsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0V3JhcHBlZE5vZGVFeHByKGFzdDogV3JhcHBlZE5vZGVFeHByPGFueT4sIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuICB2aXNpdFR5cGVvZkV4cHIoYXN0OiBUeXBlb2ZFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihhc3QsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0UmVhZFZhckV4cHIoYXN0OiBSZWFkVmFyRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb24oYXN0LCBjb250ZXh0KTtcbiAgfVxuICB2aXNpdFdyaXRlVmFyRXhwcihhc3Q6IFdyaXRlVmFyRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QudmFsdWUudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihhc3QsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0V3JpdGVLZXlFeHByKGFzdDogV3JpdGVLZXlFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC5yZWNlaXZlci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgYXN0LmluZGV4LnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICBhc3QudmFsdWUudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihhc3QsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0V3JpdGVQcm9wRXhwcihhc3Q6IFdyaXRlUHJvcEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LnJlY2VpdmVyLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICBhc3QudmFsdWUudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihhc3QsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0SW52b2tlTWV0aG9kRXhwcihhc3Q6IEludm9rZU1ldGhvZEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LnJlY2VpdmVyLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICB0aGlzLnZpc2l0QWxsRXhwcmVzc2lvbnMoYXN0LmFyZ3MsIGNvbnRleHQpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihhc3QsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0SW52b2tlRnVuY3Rpb25FeHByKGFzdDogSW52b2tlRnVuY3Rpb25FeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC5mbi52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgdGhpcy52aXNpdEFsbEV4cHJlc3Npb25zKGFzdC5hcmdzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb24oYXN0LCBjb250ZXh0KTtcbiAgfVxuICB2aXNpdFRhZ2dlZFRlbXBsYXRlRXhwcihhc3Q6IFRhZ2dlZFRlbXBsYXRlRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QudGFnLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICB0aGlzLnZpc2l0QWxsRXhwcmVzc2lvbnMoYXN0LnRlbXBsYXRlLmV4cHJlc3Npb25zLCBjb250ZXh0KTtcbiAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb24oYXN0LCBjb250ZXh0KTtcbiAgfVxuICB2aXNpdEluc3RhbnRpYXRlRXhwcihhc3Q6IEluc3RhbnRpYXRlRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QuY2xhc3NFeHByLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICB0aGlzLnZpc2l0QWxsRXhwcmVzc2lvbnMoYXN0LmFyZ3MsIGNvbnRleHQpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihhc3QsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0TGl0ZXJhbEV4cHIoYXN0OiBMaXRlcmFsRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb24oYXN0LCBjb250ZXh0KTtcbiAgfVxuICB2aXNpdExvY2FsaXplZFN0cmluZyhhc3Q6IExvY2FsaXplZFN0cmluZywgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb24oYXN0LCBjb250ZXh0KTtcbiAgfVxuICB2aXNpdEV4dGVybmFsRXhwcihhc3Q6IEV4dGVybmFsRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBpZiAoYXN0LnR5cGVQYXJhbXMpIHtcbiAgICAgIGFzdC50eXBlUGFyYW1zLmZvckVhY2godHlwZSA9PiB0eXBlLnZpc2l0VHlwZSh0aGlzLCBjb250ZXh0KSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihhc3QsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0Q29uZGl0aW9uYWxFeHByKGFzdDogQ29uZGl0aW9uYWxFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC5jb25kaXRpb24udmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIGFzdC50cnVlQ2FzZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgYXN0LmZhbHNlQ2FzZSEudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihhc3QsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0Tm90RXhwcihhc3Q6IE5vdEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LmNvbmRpdGlvbi52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKGFzdCwgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRBc3NlcnROb3ROdWxsRXhwcihhc3Q6IEFzc2VydE5vdE51bGwsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LmNvbmRpdGlvbi52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKGFzdCwgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRDYXN0RXhwcihhc3Q6IENhc3RFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKGFzdCwgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRGdW5jdGlvbkV4cHIoYXN0OiBGdW5jdGlvbkV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoYXN0LnN0YXRlbWVudHMsIGNvbnRleHQpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihhc3QsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0VW5hcnlPcGVyYXRvckV4cHIoYXN0OiBVbmFyeU9wZXJhdG9yRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QuZXhwci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKGFzdCwgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRCaW5hcnlPcGVyYXRvckV4cHIoYXN0OiBCaW5hcnlPcGVyYXRvckV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0Lmxocy52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgYXN0LnJocy52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKGFzdCwgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRSZWFkUHJvcEV4cHIoYXN0OiBSZWFkUHJvcEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LnJlY2VpdmVyLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb24oYXN0LCBjb250ZXh0KTtcbiAgfVxuICB2aXNpdFJlYWRLZXlFeHByKGFzdDogUmVhZEtleUV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LnJlY2VpdmVyLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICBhc3QuaW5kZXgudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvbihhc3QsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0TGl0ZXJhbEFycmF5RXhwcihhc3Q6IExpdGVyYWxBcnJheUV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy52aXNpdEFsbEV4cHJlc3Npb25zKGFzdC5lbnRyaWVzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb24oYXN0LCBjb250ZXh0KTtcbiAgfVxuICB2aXNpdExpdGVyYWxNYXBFeHByKGFzdDogTGl0ZXJhbE1hcEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LmVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IGVudHJ5LnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKGFzdCwgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRDb21tYUV4cHIoYXN0OiBDb21tYUV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy52aXNpdEFsbEV4cHJlc3Npb25zKGFzdC5wYXJ0cywgY29udGV4dCk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uKGFzdCwgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRBbGxFeHByZXNzaW9ucyhleHByczogRXhwcmVzc2lvbltdLCBjb250ZXh0OiBhbnkpOiB2b2lkIHtcbiAgICBleHBycy5mb3JFYWNoKGV4cHIgPT4gZXhwci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCkpO1xuICB9XG5cbiAgdmlzaXREZWNsYXJlVmFyU3RtdChzdG10OiBEZWNsYXJlVmFyU3RtdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBpZiAoc3RtdC52YWx1ZSkge1xuICAgICAgc3RtdC52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgfVxuICAgIGlmIChzdG10LnR5cGUpIHtcbiAgICAgIHN0bXQudHlwZS52aXNpdFR5cGUodGhpcywgY29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBzdG10O1xuICB9XG4gIHZpc2l0RGVjbGFyZUZ1bmN0aW9uU3RtdChzdG10OiBEZWNsYXJlRnVuY3Rpb25TdG10LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKHN0bXQuc3RhdGVtZW50cywgY29udGV4dCk7XG4gICAgaWYgKHN0bXQudHlwZSkge1xuICAgICAgc3RtdC50eXBlLnZpc2l0VHlwZSh0aGlzLCBjb250ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIHN0bXQ7XG4gIH1cbiAgdmlzaXRFeHByZXNzaW9uU3RtdChzdG10OiBFeHByZXNzaW9uU3RhdGVtZW50LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHN0bXQuZXhwci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIHN0bXQ7XG4gIH1cbiAgdmlzaXRSZXR1cm5TdG10KHN0bXQ6IFJldHVyblN0YXRlbWVudCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBzdG10LnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gc3RtdDtcbiAgfVxuICB2aXNpdERlY2xhcmVDbGFzc1N0bXQoc3RtdDogQ2xhc3NTdG10LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHN0bXQucGFyZW50IS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgc3RtdC5nZXR0ZXJzLmZvckVhY2goZ2V0dGVyID0+IHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKGdldHRlci5ib2R5LCBjb250ZXh0KSk7XG4gICAgaWYgKHN0bXQuY29uc3RydWN0b3JNZXRob2QpIHtcbiAgICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKHN0bXQuY29uc3RydWN0b3JNZXRob2QuYm9keSwgY29udGV4dCk7XG4gICAgfVxuICAgIHN0bXQubWV0aG9kcy5mb3JFYWNoKG1ldGhvZCA9PiB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhtZXRob2QuYm9keSwgY29udGV4dCkpO1xuICAgIHJldHVybiBzdG10O1xuICB9XG4gIHZpc2l0SWZTdG10KHN0bXQ6IElmU3RtdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBzdG10LmNvbmRpdGlvbi52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoc3RtdC50cnVlQ2FzZSwgY29udGV4dCk7XG4gICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoc3RtdC5mYWxzZUNhc2UsIGNvbnRleHQpO1xuICAgIHJldHVybiBzdG10O1xuICB9XG4gIHZpc2l0VHJ5Q2F0Y2hTdG10KHN0bXQ6IFRyeUNhdGNoU3RtdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhzdG10LmJvZHlTdG10cywgY29udGV4dCk7XG4gICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoc3RtdC5jYXRjaFN0bXRzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gc3RtdDtcbiAgfVxuICB2aXNpdFRocm93U3RtdChzdG10OiBUaHJvd1N0bXQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgc3RtdC5lcnJvci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIHN0bXQ7XG4gIH1cbiAgdmlzaXRBbGxTdGF0ZW1lbnRzKHN0bXRzOiBTdGF0ZW1lbnRbXSwgY29udGV4dDogYW55KTogdm9pZCB7XG4gICAgc3RtdHMuZm9yRWFjaChzdG10ID0+IHN0bXQudmlzaXRTdGF0ZW1lbnQodGhpcywgY29udGV4dCkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUmVhZFZhck5hbWVzKHN0bXRzOiBTdGF0ZW1lbnRbXSk6IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgdmlzaXRvciA9IG5ldyBfUmVhZFZhclZpc2l0b3IoKTtcbiAgdmlzaXRvci52aXNpdEFsbFN0YXRlbWVudHMoc3RtdHMsIG51bGwpO1xuICByZXR1cm4gdmlzaXRvci52YXJOYW1lcztcbn1cblxuY2xhc3MgX1JlYWRWYXJWaXNpdG9yIGV4dGVuZHMgUmVjdXJzaXZlQXN0VmlzaXRvciB7XG4gIHZhck5hbWVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIG92ZXJyaWRlIHZpc2l0RGVjbGFyZUZ1bmN0aW9uU3RtdChzdG10OiBEZWNsYXJlRnVuY3Rpb25TdG10LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIC8vIERvbid0IGRlc2NlbmQgaW50byBuZXN0ZWQgZnVuY3Rpb25zXG4gICAgcmV0dXJuIHN0bXQ7XG4gIH1cbiAgb3ZlcnJpZGUgdmlzaXREZWNsYXJlQ2xhc3NTdG10KHN0bXQ6IENsYXNzU3RtdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICAvLyBEb24ndCBkZXNjZW5kIGludG8gbmVzdGVkIGNsYXNzZXNcbiAgICByZXR1cm4gc3RtdDtcbiAgfVxuICBvdmVycmlkZSB2aXNpdFJlYWRWYXJFeHByKGFzdDogUmVhZFZhckV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgaWYgKGFzdC5uYW1lKSB7XG4gICAgICB0aGlzLnZhck5hbWVzLmFkZChhc3QubmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2xsZWN0RXh0ZXJuYWxSZWZlcmVuY2VzKHN0bXRzOiBTdGF0ZW1lbnRbXSk6IEV4dGVybmFsUmVmZXJlbmNlW10ge1xuICBjb25zdCB2aXNpdG9yID0gbmV3IF9GaW5kRXh0ZXJuYWxSZWZlcmVuY2VzVmlzaXRvcigpO1xuICB2aXNpdG9yLnZpc2l0QWxsU3RhdGVtZW50cyhzdG10cywgbnVsbCk7XG4gIHJldHVybiB2aXNpdG9yLmV4dGVybmFsUmVmZXJlbmNlcztcbn1cblxuY2xhc3MgX0ZpbmRFeHRlcm5hbFJlZmVyZW5jZXNWaXNpdG9yIGV4dGVuZHMgUmVjdXJzaXZlQXN0VmlzaXRvciB7XG4gIGV4dGVybmFsUmVmZXJlbmNlczogRXh0ZXJuYWxSZWZlcmVuY2VbXSA9IFtdO1xuICBvdmVycmlkZSB2aXNpdEV4dGVybmFsRXhwcihlOiBFeHRlcm5hbEV4cHIsIGNvbnRleHQ6IGFueSkge1xuICAgIHRoaXMuZXh0ZXJuYWxSZWZlcmVuY2VzLnB1c2goZS52YWx1ZSk7XG4gICAgcmV0dXJuIHN1cGVyLnZpc2l0RXh0ZXJuYWxFeHByKGUsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVNvdXJjZVNwYW5Ub1N0YXRlbWVudElmTmVlZGVkKFxuICAgIHN0bXQ6IFN0YXRlbWVudCwgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFufG51bGwpOiBTdGF0ZW1lbnQge1xuICBpZiAoIXNvdXJjZVNwYW4pIHtcbiAgICByZXR1cm4gc3RtdDtcbiAgfVxuICBjb25zdCB0cmFuc2Zvcm1lciA9IG5ldyBfQXBwbHlTb3VyY2VTcGFuVHJhbnNmb3JtZXIoc291cmNlU3Bhbik7XG4gIHJldHVybiBzdG10LnZpc2l0U3RhdGVtZW50KHRyYW5zZm9ybWVyLCBudWxsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5U291cmNlU3BhblRvRXhwcmVzc2lvbklmTmVlZGVkKFxuICAgIGV4cHI6IEV4cHJlc3Npb24sIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbnxudWxsKTogRXhwcmVzc2lvbiB7XG4gIGlmICghc291cmNlU3Bhbikge1xuICAgIHJldHVybiBleHByO1xuICB9XG4gIGNvbnN0IHRyYW5zZm9ybWVyID0gbmV3IF9BcHBseVNvdXJjZVNwYW5UcmFuc2Zvcm1lcihzb3VyY2VTcGFuKTtcbiAgcmV0dXJuIGV4cHIudmlzaXRFeHByZXNzaW9uKHRyYW5zZm9ybWVyLCBudWxsKTtcbn1cblxuY2xhc3MgX0FwcGx5U291cmNlU3BhblRyYW5zZm9ybWVyIGV4dGVuZHMgQXN0VHJhbnNmb3JtZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge1xuICAgIHN1cGVyKCk7XG4gIH1cbiAgcHJpdmF0ZSBfY2xvbmUob2JqOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IGNsb25lID0gT2JqZWN0LmNyZWF0ZShvYmouY29uc3RydWN0b3IucHJvdG90eXBlKTtcbiAgICBmb3IgKGxldCBwcm9wIG9mIE9iamVjdC5rZXlzKG9iaikpIHtcbiAgICAgIGNsb25lW3Byb3BdID0gb2JqW3Byb3BdO1xuICAgIH1cbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cblxuICBvdmVycmlkZSB0cmFuc2Zvcm1FeHByKGV4cHI6IEV4cHJlc3Npb24sIGNvbnRleHQ6IGFueSk6IEV4cHJlc3Npb24ge1xuICAgIGlmICghZXhwci5zb3VyY2VTcGFuKSB7XG4gICAgICBleHByID0gdGhpcy5fY2xvbmUoZXhwcik7XG4gICAgICBleHByLnNvdXJjZVNwYW4gPSB0aGlzLnNvdXJjZVNwYW47XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgb3ZlcnJpZGUgdHJhbnNmb3JtU3RtdChzdG10OiBTdGF0ZW1lbnQsIGNvbnRleHQ6IGFueSk6IFN0YXRlbWVudCB7XG4gICAgaWYgKCFzdG10LnNvdXJjZVNwYW4pIHtcbiAgICAgIHN0bXQgPSB0aGlzLl9jbG9uZShzdG10KTtcbiAgICAgIHN0bXQuc291cmNlU3BhbiA9IHRoaXMuc291cmNlU3BhbjtcbiAgICB9XG4gICAgcmV0dXJuIHN0bXQ7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxlYWRpbmdDb21tZW50KFxuICAgIHRleHQ6IHN0cmluZywgbXVsdGlsaW5lOiBib29sZWFuID0gZmFsc2UsIHRyYWlsaW5nTmV3bGluZTogYm9vbGVhbiA9IHRydWUpOiBMZWFkaW5nQ29tbWVudCB7XG4gIHJldHVybiBuZXcgTGVhZGluZ0NvbW1lbnQodGV4dCwgbXVsdGlsaW5lLCB0cmFpbGluZ05ld2xpbmUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24ganNEb2NDb21tZW50KHRhZ3M6IEpTRG9jVGFnW10gPSBbXSk6IEpTRG9jQ29tbWVudCB7XG4gIHJldHVybiBuZXcgSlNEb2NDb21tZW50KHRhZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFyaWFibGUoXG4gICAgbmFtZTogc3RyaW5nLCB0eXBlPzogVHlwZXxudWxsLCBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpOiBSZWFkVmFyRXhwciB7XG4gIHJldHVybiBuZXcgUmVhZFZhckV4cHIobmFtZSwgdHlwZSwgc291cmNlU3Bhbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRFeHByKFxuICAgIGlkOiBFeHRlcm5hbFJlZmVyZW5jZSwgdHlwZVBhcmFtczogVHlwZVtdfG51bGwgPSBudWxsLFxuICAgIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IEV4dGVybmFsRXhwciB7XG4gIHJldHVybiBuZXcgRXh0ZXJuYWxFeHByKGlkLCBudWxsLCB0eXBlUGFyYW1zLCBzb3VyY2VTcGFuKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGltcG9ydFR5cGUoXG4gICAgaWQ6IEV4dGVybmFsUmVmZXJlbmNlLCB0eXBlUGFyYW1zPzogVHlwZVtdfG51bGwsXG4gICAgdHlwZU1vZGlmaWVycz86IFR5cGVNb2RpZmllcltdKTogRXhwcmVzc2lvblR5cGV8bnVsbCB7XG4gIHJldHVybiBpZCAhPSBudWxsID8gZXhwcmVzc2lvblR5cGUoaW1wb3J0RXhwcihpZCwgdHlwZVBhcmFtcywgbnVsbCksIHR5cGVNb2RpZmllcnMpIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4cHJlc3Npb25UeXBlKFxuICAgIGV4cHI6IEV4cHJlc3Npb24sIHR5cGVNb2RpZmllcnM/OiBUeXBlTW9kaWZpZXJbXSwgdHlwZVBhcmFtcz86IFR5cGVbXXxudWxsKTogRXhwcmVzc2lvblR5cGUge1xuICByZXR1cm4gbmV3IEV4cHJlc3Npb25UeXBlKGV4cHIsIHR5cGVNb2RpZmllcnMsIHR5cGVQYXJhbXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHlwZW9mRXhwcihleHByOiBFeHByZXNzaW9uKSB7XG4gIHJldHVybiBuZXcgVHlwZW9mRXhwcihleHByKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpdGVyYWxBcnIoXG4gICAgdmFsdWVzOiBFeHByZXNzaW9uW10sIHR5cGU/OiBUeXBlfG51bGwsIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IExpdGVyYWxBcnJheUV4cHIge1xuICByZXR1cm4gbmV3IExpdGVyYWxBcnJheUV4cHIodmFsdWVzLCB0eXBlLCBzb3VyY2VTcGFuKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpdGVyYWxNYXAoXG4gICAgdmFsdWVzOiB7a2V5OiBzdHJpbmcsIHF1b3RlZDogYm9vbGVhbiwgdmFsdWU6IEV4cHJlc3Npb259W10sXG4gICAgdHlwZTogTWFwVHlwZXxudWxsID0gbnVsbCk6IExpdGVyYWxNYXBFeHByIHtcbiAgcmV0dXJuIG5ldyBMaXRlcmFsTWFwRXhwcihcbiAgICAgIHZhbHVlcy5tYXAoZSA9PiBuZXcgTGl0ZXJhbE1hcEVudHJ5KGUua2V5LCBlLnZhbHVlLCBlLnF1b3RlZCkpLCB0eXBlLCBudWxsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuYXJ5KFxuICAgIG9wZXJhdG9yOiBVbmFyeU9wZXJhdG9yLCBleHByOiBFeHByZXNzaW9uLCB0eXBlPzogVHlwZSxcbiAgICBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpOiBVbmFyeU9wZXJhdG9yRXhwciB7XG4gIHJldHVybiBuZXcgVW5hcnlPcGVyYXRvckV4cHIob3BlcmF0b3IsIGV4cHIsIHR5cGUsIHNvdXJjZVNwYW4pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm90KGV4cHI6IEV4cHJlc3Npb24sIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IE5vdEV4cHIge1xuICByZXR1cm4gbmV3IE5vdEV4cHIoZXhwciwgc291cmNlU3Bhbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnROb3ROdWxsKGV4cHI6IEV4cHJlc3Npb24sIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IEFzc2VydE5vdE51bGwge1xuICByZXR1cm4gbmV3IEFzc2VydE5vdE51bGwoZXhwciwgc291cmNlU3Bhbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbihcbiAgICBwYXJhbXM6IEZuUGFyYW1bXSwgYm9keTogU3RhdGVtZW50W10sIHR5cGU/OiBUeXBlfG51bGwsIHNvdXJjZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW58bnVsbCxcbiAgICBuYW1lPzogc3RyaW5nfG51bGwpOiBGdW5jdGlvbkV4cHIge1xuICByZXR1cm4gbmV3IEZ1bmN0aW9uRXhwcihwYXJhbXMsIGJvZHksIHR5cGUsIHNvdXJjZVNwYW4sIG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaWZTdG10KFxuICAgIGNvbmRpdGlvbjogRXhwcmVzc2lvbiwgdGhlbkNsYXVzZTogU3RhdGVtZW50W10sIGVsc2VDbGF1c2U/OiBTdGF0ZW1lbnRbXSxcbiAgICBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFuLCBsZWFkaW5nQ29tbWVudHM/OiBMZWFkaW5nQ29tbWVudFtdKSB7XG4gIHJldHVybiBuZXcgSWZTdG10KGNvbmRpdGlvbiwgdGhlbkNsYXVzZSwgZWxzZUNsYXVzZSwgc291cmNlU3BhbiwgbGVhZGluZ0NvbW1lbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRhZ2dlZFRlbXBsYXRlKFxuICAgIHRhZzogRXhwcmVzc2lvbiwgdGVtcGxhdGU6IFRlbXBsYXRlTGl0ZXJhbCwgdHlwZT86IFR5cGV8bnVsbCxcbiAgICBzb3VyY2VTcGFuPzogUGFyc2VTb3VyY2VTcGFufG51bGwpOiBUYWdnZWRUZW1wbGF0ZUV4cHIge1xuICByZXR1cm4gbmV3IFRhZ2dlZFRlbXBsYXRlRXhwcih0YWcsIHRlbXBsYXRlLCB0eXBlLCBzb3VyY2VTcGFuKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpdGVyYWwoXG4gICAgdmFsdWU6IGFueSwgdHlwZT86IFR5cGV8bnVsbCwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKTogTGl0ZXJhbEV4cHIge1xuICByZXR1cm4gbmV3IExpdGVyYWxFeHByKHZhbHVlLCB0eXBlLCBzb3VyY2VTcGFuKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsaXplZFN0cmluZyhcbiAgICBtZXRhQmxvY2s6IEkxOG5NZXRhLCBtZXNzYWdlUGFydHM6IExpdGVyYWxQaWVjZVtdLCBwbGFjZWhvbGRlck5hbWVzOiBQbGFjZWhvbGRlclBpZWNlW10sXG4gICAgZXhwcmVzc2lvbnM6IEV4cHJlc3Npb25bXSwgc291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbnxudWxsKTogTG9jYWxpemVkU3RyaW5nIHtcbiAgcmV0dXJuIG5ldyBMb2NhbGl6ZWRTdHJpbmcobWV0YUJsb2NrLCBtZXNzYWdlUGFydHMsIHBsYWNlaG9sZGVyTmFtZXMsIGV4cHJlc3Npb25zLCBzb3VyY2VTcGFuKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbChleHA6IEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgcmV0dXJuIGV4cCBpbnN0YW5jZW9mIExpdGVyYWxFeHByICYmIGV4cC52YWx1ZSA9PT0gbnVsbDtcbn1cblxuLy8gVGhlIGxpc3Qgb2YgSlNEb2MgdGFncyB0aGF0IHdlIGN1cnJlbnRseSBzdXBwb3J0LiBFeHRlbmQgaXQgaWYgbmVlZGVkLlxuZXhwb3J0IGNvbnN0IGVudW0gSlNEb2NUYWdOYW1lIHtcbiAgRGVzYyA9ICdkZXNjJyxcbiAgSWQgPSAnaWQnLFxuICBNZWFuaW5nID0gJ21lYW5pbmcnLFxufVxuXG4vKlxuICogVHlwZVNjcmlwdCBoYXMgYW4gQVBJIGZvciBKU0RvYyBhbHJlYWR5LCBidXQgaXQncyBub3QgZXhwb3NlZC5cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvNzM5M1xuICogRm9yIG5vdyB3ZSBjcmVhdGUgdHlwZXMgdGhhdCBhcmUgc2ltaWxhciB0byB0aGVpcnMgc28gdGhhdCBtaWdyYXRpbmdcbiAqIHRvIHRoZWlyIEFQSSB3aWxsIGJlIGVhc2llci4gU2VlIGUuZy4gYHRzLkpTRG9jVGFnYCBhbmQgYHRzLkpTRG9jQ29tbWVudGAuXG4gKi9cbmV4cG9ydCB0eXBlIEpTRG9jVGFnID0ge1xuICAvLyBgdGFnTmFtZWAgaXMgZS5nLiBcInBhcmFtXCIgaW4gYW4gYEBwYXJhbWAgZGVjbGFyYXRpb25cbiAgdGFnTmFtZTogSlNEb2NUYWdOYW1lfHN0cmluZyxcbiAgLy8gQW55IHJlbWFpbmluZyB0ZXh0IG9uIHRoZSB0YWcsIGUuZy4gdGhlIGRlc2NyaXB0aW9uXG4gIHRleHQ/OiBzdHJpbmcsXG59fHtcbiAgLy8gbm8gYHRhZ05hbWVgIGZvciBwbGFpbiB0ZXh0IGRvY3VtZW50YXRpb24gdGhhdCBvY2N1cnMgYmVmb3JlIGFueSBgQHBhcmFtYCBsaW5lc1xuICB0YWdOYW1lPzogdW5kZWZpbmVkLCB0ZXh0OiBzdHJpbmcsXG59O1xuXG4vKlxuICogU2VyaWFsaXplcyBhIGBUYWdgIGludG8gYSBzdHJpbmcuXG4gKiBSZXR1cm5zIGEgc3RyaW5nIGxpa2UgXCIgQGZvbyB7YmFyfSBiYXpcIiAobm90ZSB0aGUgbGVhZGluZyB3aGl0ZXNwYWNlIGJlZm9yZSBgQGZvb2ApLlxuICovXG5mdW5jdGlvbiB0YWdUb1N0cmluZyh0YWc6IEpTRG9jVGFnKTogc3RyaW5nIHtcbiAgbGV0IG91dCA9ICcnO1xuICBpZiAodGFnLnRhZ05hbWUpIHtcbiAgICBvdXQgKz0gYCBAJHt0YWcudGFnTmFtZX1gO1xuICB9XG4gIGlmICh0YWcudGV4dCkge1xuICAgIGlmICh0YWcudGV4dC5tYXRjaCgvXFwvXFwqfFxcKlxcLy8pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0pTRG9jIHRleHQgY2Fubm90IGNvbnRhaW4gXCIvKlwiIGFuZCBcIiovXCInKTtcbiAgICB9XG4gICAgb3V0ICs9ICcgJyArIHRhZy50ZXh0LnJlcGxhY2UoL0AvZywgJ1xcXFxAJyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplVGFncyh0YWdzOiBKU0RvY1RhZ1tdKTogc3RyaW5nIHtcbiAgaWYgKHRhZ3MubGVuZ3RoID09PSAwKSByZXR1cm4gJyc7XG5cbiAgaWYgKHRhZ3MubGVuZ3RoID09PSAxICYmIHRhZ3NbMF0udGFnTmFtZSAmJiAhdGFnc1swXS50ZXh0KSB7XG4gICAgLy8gVGhlIEpTRE9DIGNvbW1lbnQgaXMgYSBzaW5nbGUgc2ltcGxlIHRhZzogZS5nIGAvKiogQHRhZ25hbWUgKi9gLlxuICAgIHJldHVybiBgKiR7dGFnVG9TdHJpbmcodGFnc1swXSl9IGA7XG4gIH1cblxuICBsZXQgb3V0ID0gJypcXG4nO1xuICBmb3IgKGNvbnN0IHRhZyBvZiB0YWdzKSB7XG4gICAgb3V0ICs9ICcgKic7XG4gICAgLy8gSWYgdGhlIHRhZ1RvU3RyaW5nIGlzIG11bHRpLWxpbmUsIGluc2VydCBcIiAqIFwiIHByZWZpeGVzIG9uIGxpbmVzLlxuICAgIG91dCArPSB0YWdUb1N0cmluZyh0YWcpLnJlcGxhY2UoL1xcbi9nLCAnXFxuICogJyk7XG4gICAgb3V0ICs9ICdcXG4nO1xuICB9XG4gIG91dCArPSAnICc7XG4gIHJldHVybiBvdXQ7XG59XG4iXX0=