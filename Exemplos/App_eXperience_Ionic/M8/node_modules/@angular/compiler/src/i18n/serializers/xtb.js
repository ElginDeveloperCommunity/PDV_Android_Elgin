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
        define("@angular/compiler/src/i18n/serializers/xtb", ["require", "exports", "tslib", "@angular/compiler/src/ml_parser/ast", "@angular/compiler/src/ml_parser/xml_parser", "@angular/compiler/src/i18n/i18n_ast", "@angular/compiler/src/i18n/parse_util", "@angular/compiler/src/i18n/serializers/serializer", "@angular/compiler/src/i18n/serializers/xmb"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Xtb = void 0;
    var tslib_1 = require("tslib");
    var ml = require("@angular/compiler/src/ml_parser/ast");
    var xml_parser_1 = require("@angular/compiler/src/ml_parser/xml_parser");
    var i18n = require("@angular/compiler/src/i18n/i18n_ast");
    var parse_util_1 = require("@angular/compiler/src/i18n/parse_util");
    var serializer_1 = require("@angular/compiler/src/i18n/serializers/serializer");
    var xmb_1 = require("@angular/compiler/src/i18n/serializers/xmb");
    var _TRANSLATIONS_TAG = 'translationbundle';
    var _TRANSLATION_TAG = 'translation';
    var _PLACEHOLDER_TAG = 'ph';
    var Xtb = /** @class */ (function (_super) {
        tslib_1.__extends(Xtb, _super);
        function Xtb() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Xtb.prototype.write = function (messages, locale) {
            throw new Error('Unsupported');
        };
        Xtb.prototype.load = function (content, url) {
            // xtb to xml nodes
            var xtbParser = new XtbParser();
            var _a = xtbParser.parse(content, url), locale = _a.locale, msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
            // xml nodes to i18n nodes
            var i18nNodesByMsgId = {};
            var converter = new XmlToI18n();
            // Because we should be able to load xtb files that rely on features not supported by angular,
            // we need to delay the conversion of html to i18n nodes so that non angular messages are not
            // converted
            Object.keys(msgIdToHtml).forEach(function (msgId) {
                var valueFn = function () {
                    var _a = converter.convert(msgIdToHtml[msgId], url), i18nNodes = _a.i18nNodes, errors = _a.errors;
                    if (errors.length) {
                        throw new Error("xtb parse errors:\n" + errors.join('\n'));
                    }
                    return i18nNodes;
                };
                createLazyProperty(i18nNodesByMsgId, msgId, valueFn);
            });
            if (errors.length) {
                throw new Error("xtb parse errors:\n" + errors.join('\n'));
            }
            return { locale: locale, i18nNodesByMsgId: i18nNodesByMsgId };
        };
        Xtb.prototype.digest = function (message) {
            return xmb_1.digest(message);
        };
        Xtb.prototype.createNameMapper = function (message) {
            return new serializer_1.SimplePlaceholderMapper(message, xmb_1.toPublicName);
        };
        return Xtb;
    }(serializer_1.Serializer));
    exports.Xtb = Xtb;
    function createLazyProperty(messages, id, valueFn) {
        Object.defineProperty(messages, id, {
            configurable: true,
            enumerable: true,
            get: function () {
                var value = valueFn();
                Object.defineProperty(messages, id, { enumerable: true, value: value });
                return value;
            },
            set: function (_) {
                throw new Error('Could not overwrite an XTB translation');
            },
        });
    }
    // Extract messages as xml nodes from the xtb file
    var XtbParser = /** @class */ (function () {
        function XtbParser() {
            this._locale = null;
        }
        XtbParser.prototype.parse = function (xtb, url) {
            this._bundleDepth = 0;
            this._msgIdToHtml = {};
            // We can not parse the ICU messages at this point as some messages might not originate
            // from Angular that could not be lex'd.
            var xml = new xml_parser_1.XmlParser().parse(xtb, url);
            this._errors = xml.errors;
            ml.visitAll(this, xml.rootNodes);
            return {
                msgIdToHtml: this._msgIdToHtml,
                errors: this._errors,
                locale: this._locale,
            };
        };
        XtbParser.prototype.visitElement = function (element, context) {
            switch (element.name) {
                case _TRANSLATIONS_TAG:
                    this._bundleDepth++;
                    if (this._bundleDepth > 1) {
                        this._addError(element, "<" + _TRANSLATIONS_TAG + "> elements can not be nested");
                    }
                    var langAttr = element.attrs.find(function (attr) { return attr.name === 'lang'; });
                    if (langAttr) {
                        this._locale = langAttr.value;
                    }
                    ml.visitAll(this, element.children, null);
                    this._bundleDepth--;
                    break;
                case _TRANSLATION_TAG:
                    var idAttr = element.attrs.find(function (attr) { return attr.name === 'id'; });
                    if (!idAttr) {
                        this._addError(element, "<" + _TRANSLATION_TAG + "> misses the \"id\" attribute");
                    }
                    else {
                        var id = idAttr.value;
                        if (this._msgIdToHtml.hasOwnProperty(id)) {
                            this._addError(element, "Duplicated translations for msg " + id);
                        }
                        else {
                            var innerTextStart = element.startSourceSpan.end.offset;
                            var innerTextEnd = element.endSourceSpan.start.offset;
                            var content = element.startSourceSpan.start.file.content;
                            var innerText = content.slice(innerTextStart, innerTextEnd);
                            this._msgIdToHtml[id] = innerText;
                        }
                    }
                    break;
                default:
                    this._addError(element, 'Unexpected tag');
            }
        };
        XtbParser.prototype.visitAttribute = function (attribute, context) { };
        XtbParser.prototype.visitText = function (text, context) { };
        XtbParser.prototype.visitComment = function (comment, context) { };
        XtbParser.prototype.visitExpansion = function (expansion, context) { };
        XtbParser.prototype.visitExpansionCase = function (expansionCase, context) { };
        XtbParser.prototype._addError = function (node, message) {
            this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
        };
        return XtbParser;
    }());
    // Convert ml nodes (xtb syntax) to i18n nodes
    var XmlToI18n = /** @class */ (function () {
        function XmlToI18n() {
        }
        XmlToI18n.prototype.convert = function (message, url) {
            var xmlIcu = new xml_parser_1.XmlParser().parse(message, url, { tokenizeExpansionForms: true });
            this._errors = xmlIcu.errors;
            var i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
                [] :
                ml.visitAll(this, xmlIcu.rootNodes);
            return {
                i18nNodes: i18nNodes,
                errors: this._errors,
            };
        };
        XmlToI18n.prototype.visitText = function (text, context) {
            return new i18n.Text(text.value, text.sourceSpan);
        };
        XmlToI18n.prototype.visitExpansion = function (icu, context) {
            var caseMap = {};
            ml.visitAll(this, icu.cases).forEach(function (c) {
                caseMap[c.value] = new i18n.Container(c.nodes, icu.sourceSpan);
            });
            return new i18n.Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
        };
        XmlToI18n.prototype.visitExpansionCase = function (icuCase, context) {
            return {
                value: icuCase.value,
                nodes: ml.visitAll(this, icuCase.expression),
            };
        };
        XmlToI18n.prototype.visitElement = function (el, context) {
            if (el.name === _PLACEHOLDER_TAG) {
                var nameAttr = el.attrs.find(function (attr) { return attr.name === 'name'; });
                if (nameAttr) {
                    return new i18n.Placeholder('', nameAttr.value, el.sourceSpan);
                }
                this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"name\" attribute");
            }
            else {
                this._addError(el, "Unexpected tag");
            }
            return null;
        };
        XmlToI18n.prototype.visitComment = function (comment, context) { };
        XmlToI18n.prototype.visitAttribute = function (attribute, context) { };
        XmlToI18n.prototype._addError = function (node, message) {
            this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
        };
        return XmlToI18n;
    }());
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHRiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2kxOG4vc2VyaWFsaXplcnMveHRiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7SUFFSCx3REFBMEM7SUFDMUMseUVBQXFEO0lBQ3JELDBEQUFvQztJQUNwQyxvRUFBd0M7SUFFeEMsZ0ZBQW9GO0lBQ3BGLGtFQUEyQztJQUUzQyxJQUFNLGlCQUFpQixHQUFHLG1CQUFtQixDQUFDO0lBQzlDLElBQU0sZ0JBQWdCLEdBQUcsYUFBYSxDQUFDO0lBQ3ZDLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0lBRTlCO1FBQXlCLCtCQUFVO1FBQW5DOztRQTJDQSxDQUFDO1FBMUNVLG1CQUFLLEdBQWQsVUFBZSxRQUF3QixFQUFFLE1BQW1CO1lBQzFELE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUVRLGtCQUFJLEdBQWIsVUFBYyxPQUFlLEVBQUUsR0FBVztZQUV4QyxtQkFBbUI7WUFDbkIsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUM1QixJQUFBLEtBQWdDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUE1RCxNQUFNLFlBQUEsRUFBRSxXQUFXLGlCQUFBLEVBQUUsTUFBTSxZQUFpQyxDQUFDO1lBRXBFLDBCQUEwQjtZQUMxQixJQUFNLGdCQUFnQixHQUFtQyxFQUFFLENBQUM7WUFDNUQsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUVsQyw4RkFBOEY7WUFDOUYsNkZBQTZGO1lBQzdGLFlBQVk7WUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7Z0JBQ3BDLElBQU0sT0FBTyxHQUFHO29CQUNSLElB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b3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgbWwgZnJvbSAnLi4vLi4vbWxfcGFyc2VyL2FzdCc7XG5pbXBvcnQge1htbFBhcnNlcn0gZnJvbSAnLi4vLi4vbWxfcGFyc2VyL3htbF9wYXJzZXInO1xuaW1wb3J0ICogYXMgaTE4biBmcm9tICcuLi9pMThuX2FzdCc7XG5pbXBvcnQge0kxOG5FcnJvcn0gZnJvbSAnLi4vcGFyc2VfdXRpbCc7XG5cbmltcG9ydCB7UGxhY2Vob2xkZXJNYXBwZXIsIFNlcmlhbGl6ZXIsIFNpbXBsZVBsYWNlaG9sZGVyTWFwcGVyfSBmcm9tICcuL3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtkaWdlc3QsIHRvUHVibGljTmFtZX0gZnJvbSAnLi94bWInO1xuXG5jb25zdCBfVFJBTlNMQVRJT05TX1RBRyA9ICd0cmFuc2xhdGlvbmJ1bmRsZSc7XG5jb25zdCBfVFJBTlNMQVRJT05fVEFHID0gJ3RyYW5zbGF0aW9uJztcbmNvbnN0IF9QTEFDRUhPTERFUl9UQUcgPSAncGgnO1xuXG5leHBvcnQgY2xhc3MgWHRiIGV4dGVuZHMgU2VyaWFsaXplciB7XG4gIG92ZXJyaWRlIHdyaXRlKG1lc3NhZ2VzOiBpMThuLk1lc3NhZ2VbXSwgbG9jYWxlOiBzdHJpbmd8bnVsbCk6IHN0cmluZyB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCcpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbG9hZChjb250ZW50OiBzdHJpbmcsIHVybDogc3RyaW5nKTpcbiAgICAgIHtsb2NhbGU6IHN0cmluZywgaTE4bk5vZGVzQnlNc2dJZDoge1ttc2dJZDogc3RyaW5nXTogaTE4bi5Ob2RlW119fSB7XG4gICAgLy8geHRiIHRvIHhtbCBub2Rlc1xuICAgIGNvbnN0IHh0YlBhcnNlciA9IG5ldyBYdGJQYXJzZXIoKTtcbiAgICBjb25zdCB7bG9jYWxlLCBtc2dJZFRvSHRtbCwgZXJyb3JzfSA9IHh0YlBhcnNlci5wYXJzZShjb250ZW50LCB1cmwpO1xuXG4gICAgLy8geG1sIG5vZGVzIHRvIGkxOG4gbm9kZXNcbiAgICBjb25zdCBpMThuTm9kZXNCeU1zZ0lkOiB7W21zZ0lkOiBzdHJpbmddOiBpMThuLk5vZGVbXX0gPSB7fTtcbiAgICBjb25zdCBjb252ZXJ0ZXIgPSBuZXcgWG1sVG9JMThuKCk7XG5cbiAgICAvLyBCZWNhdXNlIHdlIHNob3VsZCBiZSBhYmxlIHRvIGxvYWQgeHRiIGZpbGVzIHRoYXQgcmVseSBvbiBmZWF0dXJlcyBub3Qgc3VwcG9ydGVkIGJ5IGFuZ3VsYXIsXG4gICAgLy8gd2UgbmVlZCB0byBkZWxheSB0aGUgY29udmVyc2lvbiBvZiBodG1sIHRvIGkxOG4gbm9kZXMgc28gdGhhdCBub24gYW5ndWxhciBtZXNzYWdlcyBhcmUgbm90XG4gICAgLy8gY29udmVydGVkXG4gICAgT2JqZWN0LmtleXMobXNnSWRUb0h0bWwpLmZvckVhY2gobXNnSWQgPT4ge1xuICAgICAgY29uc3QgdmFsdWVGbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCB7aTE4bk5vZGVzLCBlcnJvcnN9ID0gY29udmVydGVyLmNvbnZlcnQobXNnSWRUb0h0bWxbbXNnSWRdLCB1cmwpO1xuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgeHRiIHBhcnNlIGVycm9yczpcXG4ke2Vycm9ycy5qb2luKCdcXG4nKX1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTE4bk5vZGVzO1xuICAgICAgfTtcbiAgICAgIGNyZWF0ZUxhenlQcm9wZXJ0eShpMThuTm9kZXNCeU1zZ0lkLCBtc2dJZCwgdmFsdWVGbik7XG4gICAgfSk7XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB4dGIgcGFyc2UgZXJyb3JzOlxcbiR7ZXJyb3JzLmpvaW4oJ1xcbicpfWApO1xuICAgIH1cblxuICAgIHJldHVybiB7bG9jYWxlOiBsb2NhbGUhLCBpMThuTm9kZXNCeU1zZ0lkfTtcbiAgfVxuXG4gIG92ZXJyaWRlIGRpZ2VzdChtZXNzYWdlOiBpMThuLk1lc3NhZ2UpOiBzdHJpbmcge1xuICAgIHJldHVybiBkaWdlc3QobWVzc2FnZSk7XG4gIH1cblxuICBvdmVycmlkZSBjcmVhdGVOYW1lTWFwcGVyKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSk6IFBsYWNlaG9sZGVyTWFwcGVyIHtcbiAgICByZXR1cm4gbmV3IFNpbXBsZVBsYWNlaG9sZGVyTWFwcGVyKG1lc3NhZ2UsIHRvUHVibGljTmFtZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTGF6eVByb3BlcnR5KG1lc3NhZ2VzOiBhbnksIGlkOiBzdHJpbmcsIHZhbHVlRm46ICgpID0+IGFueSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobWVzc2FnZXMsIGlkLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdmFsdWVGbigpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1lc3NhZ2VzLCBpZCwge2VudW1lcmFibGU6IHRydWUsIHZhbHVlfSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcbiAgICBzZXQ6IF8gPT4ge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3Qgb3ZlcndyaXRlIGFuIFhUQiB0cmFuc2xhdGlvbicpO1xuICAgIH0sXG4gIH0pO1xufVxuXG4vLyBFeHRyYWN0IG1lc3NhZ2VzIGFzIHhtbCBub2RlcyBmcm9tIHRoZSB4dGIgZmlsZVxuY2xhc3MgWHRiUGFyc2VyIGltcGxlbWVudHMgbWwuVmlzaXRvciB7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9idW5kbGVEZXB0aCE6IG51bWJlcjtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX2Vycm9ycyE6IEkxOG5FcnJvcltdO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfbXNnSWRUb0h0bWwhOiB7W21zZ0lkOiBzdHJpbmddOiBzdHJpbmd9O1xuICBwcml2YXRlIF9sb2NhbGU6IHN0cmluZ3xudWxsID0gbnVsbDtcblxuICBwYXJzZSh4dGI6IHN0cmluZywgdXJsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9idW5kbGVEZXB0aCA9IDA7XG4gICAgdGhpcy5fbXNnSWRUb0h0bWwgPSB7fTtcblxuICAgIC8vIFdlIGNhbiBub3QgcGFyc2UgdGhlIElDVSBtZXNzYWdlcyBhdCB0aGlzIHBvaW50IGFzIHNvbWUgbWVzc2FnZXMgbWlnaHQgbm90IG9yaWdpbmF0ZVxuICAgIC8vIGZyb20gQW5ndWxhciB0aGF0IGNvdWxkIG5vdCBiZSBsZXgnZC5cbiAgICBjb25zdCB4bWwgPSBuZXcgWG1sUGFyc2VyKCkucGFyc2UoeHRiLCB1cmwpO1xuXG4gICAgdGhpcy5fZXJyb3JzID0geG1sLmVycm9ycztcbiAgICBtbC52aXNpdEFsbCh0aGlzLCB4bWwucm9vdE5vZGVzKTtcblxuICAgIHJldHVybiB7XG4gICAgICBtc2dJZFRvSHRtbDogdGhpcy5fbXNnSWRUb0h0bWwsXG4gICAgICBlcnJvcnM6IHRoaXMuX2Vycm9ycyxcbiAgICAgIGxvY2FsZTogdGhpcy5fbG9jYWxlLFxuICAgIH07XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogbWwuRWxlbWVudCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBzd2l0Y2ggKGVsZW1lbnQubmFtZSkge1xuICAgICAgY2FzZSBfVFJBTlNMQVRJT05TX1RBRzpcbiAgICAgICAgdGhpcy5fYnVuZGxlRGVwdGgrKztcbiAgICAgICAgaWYgKHRoaXMuX2J1bmRsZURlcHRoID4gMSkge1xuICAgICAgICAgIHRoaXMuX2FkZEVycm9yKGVsZW1lbnQsIGA8JHtfVFJBTlNMQVRJT05TX1RBR30+IGVsZW1lbnRzIGNhbiBub3QgYmUgbmVzdGVkYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGFuZ0F0dHIgPSBlbGVtZW50LmF0dHJzLmZpbmQoKGF0dHIpID0+IGF0dHIubmFtZSA9PT0gJ2xhbmcnKTtcbiAgICAgICAgaWYgKGxhbmdBdHRyKSB7XG4gICAgICAgICAgdGhpcy5fbG9jYWxlID0gbGFuZ0F0dHIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgbWwudmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbiwgbnVsbCk7XG4gICAgICAgIHRoaXMuX2J1bmRsZURlcHRoLS07XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIF9UUkFOU0xBVElPTl9UQUc6XG4gICAgICAgIGNvbnN0IGlkQXR0ciA9IGVsZW1lbnQuYXR0cnMuZmluZCgoYXR0cikgPT4gYXR0ci5uYW1lID09PSAnaWQnKTtcbiAgICAgICAgaWYgKCFpZEF0dHIpIHtcbiAgICAgICAgICB0aGlzLl9hZGRFcnJvcihlbGVtZW50LCBgPCR7X1RSQU5TTEFUSU9OX1RBR30+IG1pc3NlcyB0aGUgXCJpZFwiIGF0dHJpYnV0ZWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGlkID0gaWRBdHRyLnZhbHVlO1xuICAgICAgICAgIGlmICh0aGlzLl9tc2dJZFRvSHRtbC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEVycm9yKGVsZW1lbnQsIGBEdXBsaWNhdGVkIHRyYW5zbGF0aW9ucyBmb3IgbXNnICR7aWR9YCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGlubmVyVGV4dFN0YXJ0ID0gZWxlbWVudC5zdGFydFNvdXJjZVNwYW4uZW5kLm9mZnNldDtcbiAgICAgICAgICAgIGNvbnN0IGlubmVyVGV4dEVuZCA9IGVsZW1lbnQuZW5kU291cmNlU3BhbiEuc3RhcnQub2Zmc2V0O1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGVsZW1lbnQuc3RhcnRTb3VyY2VTcGFuLnN0YXJ0LmZpbGUuY29udGVudDtcbiAgICAgICAgICAgIGNvbnN0IGlubmVyVGV4dCA9IGNvbnRlbnQuc2xpY2UoaW5uZXJUZXh0U3RhcnQhLCBpbm5lclRleHRFbmQhKTtcbiAgICAgICAgICAgIHRoaXMuX21zZ0lkVG9IdG1sW2lkXSA9IGlubmVyVGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX2FkZEVycm9yKGVsZW1lbnQsICdVbmV4cGVjdGVkIHRhZycpO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogbWwuQXR0cmlidXRlLCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdFRleHQodGV4dDogbWwuVGV4dCwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgdmlzaXRDb21tZW50KGNvbW1lbnQ6IG1sLkNvbW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuXG4gIHZpc2l0RXhwYW5zaW9uKGV4cGFuc2lvbjogbWwuRXhwYW5zaW9uLCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdEV4cGFuc2lvbkNhc2UoZXhwYW5zaW9uQ2FzZTogbWwuRXhwYW5zaW9uQ2FzZSwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgcHJpdmF0ZSBfYWRkRXJyb3Iobm9kZTogbWwuTm9kZSwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3JzLnB1c2gobmV3IEkxOG5FcnJvcihub2RlLnNvdXJjZVNwYW4sIG1lc3NhZ2UpKTtcbiAgfVxufVxuXG4vLyBDb252ZXJ0IG1sIG5vZGVzICh4dGIgc3ludGF4KSB0byBpMThuIG5vZGVzXG5jbGFzcyBYbWxUb0kxOG4gaW1wbGVtZW50cyBtbC5WaXNpdG9yIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX2Vycm9ycyE6IEkxOG5FcnJvcltdO1xuXG4gIGNvbnZlcnQobWVzc2FnZTogc3RyaW5nLCB1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IHhtbEljdSA9IG5ldyBYbWxQYXJzZXIoKS5wYXJzZShtZXNzYWdlLCB1cmwsIHt0b2tlbml6ZUV4cGFuc2lvbkZvcm1zOiB0cnVlfSk7XG4gICAgdGhpcy5fZXJyb3JzID0geG1sSWN1LmVycm9ycztcblxuICAgIGNvbnN0IGkxOG5Ob2RlcyA9IHRoaXMuX2Vycm9ycy5sZW5ndGggPiAwIHx8IHhtbEljdS5yb290Tm9kZXMubGVuZ3RoID09IDAgP1xuICAgICAgICBbXSA6XG4gICAgICAgIG1sLnZpc2l0QWxsKHRoaXMsIHhtbEljdS5yb290Tm9kZXMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGkxOG5Ob2RlcyxcbiAgICAgIGVycm9yczogdGhpcy5fZXJyb3JzLFxuICAgIH07XG4gIH1cblxuICB2aXNpdFRleHQodGV4dDogbWwuVGV4dCwgY29udGV4dDogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBpMThuLlRleHQodGV4dC52YWx1ZSwgdGV4dC5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHZpc2l0RXhwYW5zaW9uKGljdTogbWwuRXhwYW5zaW9uLCBjb250ZXh0OiBhbnkpIHtcbiAgICBjb25zdCBjYXNlTWFwOiB7W3ZhbHVlOiBzdHJpbmddOiBpMThuLk5vZGV9ID0ge307XG5cbiAgICBtbC52aXNpdEFsbCh0aGlzLCBpY3UuY2FzZXMpLmZvckVhY2goYyA9PiB7XG4gICAgICBjYXNlTWFwW2MudmFsdWVdID0gbmV3IGkxOG4uQ29udGFpbmVyKGMubm9kZXMsIGljdS5zb3VyY2VTcGFuKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgaTE4bi5JY3UoaWN1LnN3aXRjaFZhbHVlLCBpY3UudHlwZSwgY2FzZU1hcCwgaWN1LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb25DYXNlKGljdUNhc2U6IG1sLkV4cGFuc2lvbkNhc2UsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiBpY3VDYXNlLnZhbHVlLFxuICAgICAgbm9kZXM6IG1sLnZpc2l0QWxsKHRoaXMsIGljdUNhc2UuZXhwcmVzc2lvbiksXG4gICAgfTtcbiAgfVxuXG4gIHZpc2l0RWxlbWVudChlbDogbWwuRWxlbWVudCwgY29udGV4dDogYW55KTogaTE4bi5QbGFjZWhvbGRlcnxudWxsIHtcbiAgICBpZiAoZWwubmFtZSA9PT0gX1BMQUNFSE9MREVSX1RBRykge1xuICAgICAgY29uc3QgbmFtZUF0dHIgPSBlbC5hdHRycy5maW5kKChhdHRyKSA9PiBhdHRyLm5hbWUgPT09ICduYW1lJyk7XG4gICAgICBpZiAobmFtZUF0dHIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBpMThuLlBsYWNlaG9sZGVyKCcnLCBuYW1lQXR0ci52YWx1ZSwgZWwuc291cmNlU3Bhbik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2FkZEVycm9yKGVsLCBgPCR7X1BMQUNFSE9MREVSX1RBR30+IG1pc3NlcyB0aGUgXCJuYW1lXCIgYXR0cmlidXRlYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FkZEVycm9yKGVsLCBgVW5leHBlY3RlZCB0YWdgKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdENvbW1lbnQoY29tbWVudDogbWwuQ29tbWVudCwgY29udGV4dDogYW55KSB7fVxuXG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogbWwuQXR0cmlidXRlLCBjb250ZXh0OiBhbnkpIHt9XG5cbiAgcHJpdmF0ZSBfYWRkRXJyb3Iobm9kZTogbWwuTm9kZSwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3JzLnB1c2gobmV3IEkxOG5FcnJvcihub2RlLnNvdXJjZVNwYW4sIG1lc3NhZ2UpKTtcbiAgfVxufVxuIl19