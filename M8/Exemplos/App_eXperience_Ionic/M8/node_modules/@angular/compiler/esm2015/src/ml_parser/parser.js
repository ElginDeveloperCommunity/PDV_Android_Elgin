/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ParseError, ParseSourceSpan } from '../parse_util';
import * as html from './ast';
import * as lex from './lexer';
import { getNsPrefix, mergeNsAndName, splitNsName } from './tags';
export class TreeError extends ParseError {
    constructor(elementName, span, msg) {
        super(span, msg);
        this.elementName = elementName;
    }
    static create(elementName, span, msg) {
        return new TreeError(elementName, span, msg);
    }
}
export class ParseTreeResult {
    constructor(rootNodes, errors) {
        this.rootNodes = rootNodes;
        this.errors = errors;
    }
}
export class Parser {
    constructor(getTagDefinition) {
        this.getTagDefinition = getTagDefinition;
    }
    parse(source, url, options) {
        const tokenizeResult = lex.tokenize(source, url, this.getTagDefinition, options);
        const parser = new _TreeBuilder(tokenizeResult.tokens, this.getTagDefinition);
        parser.build();
        return new ParseTreeResult(parser.rootNodes, tokenizeResult.errors.concat(parser.errors));
    }
}
class _TreeBuilder {
    constructor(tokens, getTagDefinition) {
        this.tokens = tokens;
        this.getTagDefinition = getTagDefinition;
        this._index = -1;
        this._elementStack = [];
        this.rootNodes = [];
        this.errors = [];
        this._advance();
    }
    build() {
        while (this._peek.type !== lex.TokenType.EOF) {
            if (this._peek.type === lex.TokenType.TAG_OPEN_START ||
                this._peek.type === lex.TokenType.INCOMPLETE_TAG_OPEN) {
                this._consumeStartTag(this._advance());
            }
            else if (this._peek.type === lex.TokenType.TAG_CLOSE) {
                this._consumeEndTag(this._advance());
            }
            else if (this._peek.type === lex.TokenType.CDATA_START) {
                this._closeVoidElement();
                this._consumeCdata(this._advance());
            }
            else if (this._peek.type === lex.TokenType.COMMENT_START) {
                this._closeVoidElement();
                this._consumeComment(this._advance());
            }
            else if (this._peek.type === lex.TokenType.TEXT || this._peek.type === lex.TokenType.RAW_TEXT ||
                this._peek.type === lex.TokenType.ESCAPABLE_RAW_TEXT) {
                this._closeVoidElement();
                this._consumeText(this._advance());
            }
            else if (this._peek.type === lex.TokenType.EXPANSION_FORM_START) {
                this._consumeExpansion(this._advance());
            }
            else {
                // Skip all other tokens...
                this._advance();
            }
        }
    }
    _advance() {
        const prev = this._peek;
        if (this._index < this.tokens.length - 1) {
            // Note: there is always an EOF token at the end
            this._index++;
        }
        this._peek = this.tokens[this._index];
        return prev;
    }
    _advanceIf(type) {
        if (this._peek.type === type) {
            return this._advance();
        }
        return null;
    }
    _consumeCdata(_startToken) {
        this._consumeText(this._advance());
        this._advanceIf(lex.TokenType.CDATA_END);
    }
    _consumeComment(token) {
        const text = this._advanceIf(lex.TokenType.RAW_TEXT);
        this._advanceIf(lex.TokenType.COMMENT_END);
        const value = text != null ? text.parts[0].trim() : null;
        this._addToParent(new html.Comment(value, token.sourceSpan));
    }
    _consumeExpansion(token) {
        const switchValue = this._advance();
        const type = this._advance();
        const cases = [];
        // read =
        while (this._peek.type === lex.TokenType.EXPANSION_CASE_VALUE) {
            const expCase = this._parseExpansionCase();
            if (!expCase)
                return; // error
            cases.push(expCase);
        }
        // read the final }
        if (this._peek.type !== lex.TokenType.EXPANSION_FORM_END) {
            this.errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '}'.`));
            return;
        }
        const sourceSpan = new ParseSourceSpan(token.sourceSpan.start, this._peek.sourceSpan.end, token.sourceSpan.fullStart);
        this._addToParent(new html.Expansion(switchValue.parts[0], type.parts[0], cases, sourceSpan, switchValue.sourceSpan));
        this._advance();
    }
    _parseExpansionCase() {
        const value = this._advance();
        // read {
        if (this._peek.type !== lex.TokenType.EXPANSION_CASE_EXP_START) {
            this.errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '{'.`));
            return null;
        }
        // read until }
        const start = this._advance();
        const exp = this._collectExpansionExpTokens(start);
        if (!exp)
            return null;
        const end = this._advance();
        exp.push(new lex.Token(lex.TokenType.EOF, [], end.sourceSpan));
        // parse everything in between { and }
        const expansionCaseParser = new _TreeBuilder(exp, this.getTagDefinition);
        expansionCaseParser.build();
        if (expansionCaseParser.errors.length > 0) {
            this.errors = this.errors.concat(expansionCaseParser.errors);
            return null;
        }
        const sourceSpan = new ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end, value.sourceSpan.fullStart);
        const expSourceSpan = new ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end, start.sourceSpan.fullStart);
        return new html.ExpansionCase(value.parts[0], expansionCaseParser.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
    }
    _collectExpansionExpTokens(start) {
        const exp = [];
        const expansionFormStack = [lex.TokenType.EXPANSION_CASE_EXP_START];
        while (true) {
            if (this._peek.type === lex.TokenType.EXPANSION_FORM_START ||
                this._peek.type === lex.TokenType.EXPANSION_CASE_EXP_START) {
                expansionFormStack.push(this._peek.type);
            }
            if (this._peek.type === lex.TokenType.EXPANSION_CASE_EXP_END) {
                if (lastOnStack(expansionFormStack, lex.TokenType.EXPANSION_CASE_EXP_START)) {
                    expansionFormStack.pop();
                    if (expansionFormStack.length == 0)
                        return exp;
                }
                else {
                    this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                    return null;
                }
            }
            if (this._peek.type === lex.TokenType.EXPANSION_FORM_END) {
                if (lastOnStack(expansionFormStack, lex.TokenType.EXPANSION_FORM_START)) {
                    expansionFormStack.pop();
                }
                else {
                    this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                    return null;
                }
            }
            if (this._peek.type === lex.TokenType.EOF) {
                this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                return null;
            }
            exp.push(this._advance());
        }
    }
    _consumeText(token) {
        let text = token.parts[0];
        if (text.length > 0 && text[0] == '\n') {
            const parent = this._getParentElement();
            if (parent != null && parent.children.length == 0 &&
                this.getTagDefinition(parent.name).ignoreFirstLf) {
                text = text.substring(1);
            }
        }
        if (text.length > 0) {
            this._addToParent(new html.Text(text, token.sourceSpan));
        }
    }
    _closeVoidElement() {
        const el = this._getParentElement();
        if (el && this.getTagDefinition(el.name).isVoid) {
            this._elementStack.pop();
        }
    }
    _consumeStartTag(startTagToken) {
        const [prefix, name] = startTagToken.parts;
        const attrs = [];
        while (this._peek.type === lex.TokenType.ATTR_NAME) {
            attrs.push(this._consumeAttr(this._advance()));
        }
        const fullName = this._getElementFullName(prefix, name, this._getParentElement());
        let selfClosing = false;
        // Note: There could have been a tokenizer error
        // so that we don't get a token for the end tag...
        if (this._peek.type === lex.TokenType.TAG_OPEN_END_VOID) {
            this._advance();
            selfClosing = true;
            const tagDef = this.getTagDefinition(fullName);
            if (!(tagDef.canSelfClose || getNsPrefix(fullName) !== null || tagDef.isVoid)) {
                this.errors.push(TreeError.create(fullName, startTagToken.sourceSpan, `Only void and foreign elements can be self closed "${startTagToken.parts[1]}"`));
            }
        }
        else if (this._peek.type === lex.TokenType.TAG_OPEN_END) {
            this._advance();
            selfClosing = false;
        }
        const end = this._peek.sourceSpan.fullStart;
        const span = new ParseSourceSpan(startTagToken.sourceSpan.start, end, startTagToken.sourceSpan.fullStart);
        // Create a separate `startSpan` because `span` will be modified when there is an `end` span.
        const startSpan = new ParseSourceSpan(startTagToken.sourceSpan.start, end, startTagToken.sourceSpan.fullStart);
        const el = new html.Element(fullName, attrs, [], span, startSpan, undefined);
        this._pushElement(el);
        if (selfClosing) {
            // Elements that are self-closed have their `endSourceSpan` set to the full span, as the
            // element start tag also represents the end tag.
            this._popElement(fullName, span);
        }
        else if (startTagToken.type === lex.TokenType.INCOMPLETE_TAG_OPEN) {
            // We already know the opening tag is not complete, so it is unlikely it has a corresponding
            // close tag. Let's optimistically parse it as a full element and emit an error.
            this._popElement(fullName, null);
            this.errors.push(TreeError.create(fullName, span, `Opening tag "${fullName}" not terminated.`));
        }
    }
    _pushElement(el) {
        const parentEl = this._getParentElement();
        if (parentEl && this.getTagDefinition(parentEl.name).isClosedByChild(el.name)) {
            this._elementStack.pop();
        }
        this._addToParent(el);
        this._elementStack.push(el);
    }
    _consumeEndTag(endTagToken) {
        const fullName = this._getElementFullName(endTagToken.parts[0], endTagToken.parts[1], this._getParentElement());
        if (this.getTagDefinition(fullName).isVoid) {
            this.errors.push(TreeError.create(fullName, endTagToken.sourceSpan, `Void elements do not have end tags "${endTagToken.parts[1]}"`));
        }
        else if (!this._popElement(fullName, endTagToken.sourceSpan)) {
            const errMsg = `Unexpected closing tag "${fullName}". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`;
            this.errors.push(TreeError.create(fullName, endTagToken.sourceSpan, errMsg));
        }
    }
    /**
     * Closes the nearest element with the tag name `fullName` in the parse tree.
     * `endSourceSpan` is the span of the closing tag, or null if the element does
     * not have a closing tag (for example, this happens when an incomplete
     * opening tag is recovered).
     */
    _popElement(fullName, endSourceSpan) {
        let unexpectedCloseTagDetected = false;
        for (let stackIndex = this._elementStack.length - 1; stackIndex >= 0; stackIndex--) {
            const el = this._elementStack[stackIndex];
            if (el.name == fullName) {
                // Record the parse span with the element that is being closed. Any elements that are
                // removed from the element stack at this point are closed implicitly, so they won't get
                // an end source span (as there is no explicit closing element).
                el.endSourceSpan = endSourceSpan;
                el.sourceSpan.end = endSourceSpan !== null ? endSourceSpan.end : el.sourceSpan.end;
                this._elementStack.splice(stackIndex, this._elementStack.length - stackIndex);
                return !unexpectedCloseTagDetected;
            }
            if (!this.getTagDefinition(el.name).closedByParent) {
                // Note that we encountered an unexpected close tag but continue processing the element
                // stack so we can assign an `endSourceSpan` if there is a corresponding start tag for this
                // end tag in the stack.
                unexpectedCloseTagDetected = true;
            }
        }
        return false;
    }
    _consumeAttr(attrName) {
        const fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1]);
        let end = attrName.sourceSpan.end;
        let value = '';
        let valueSpan = undefined;
        if (this._peek.type === lex.TokenType.ATTR_QUOTE) {
            this._advance();
        }
        if (this._peek.type === lex.TokenType.ATTR_VALUE) {
            const valueToken = this._advance();
            value = valueToken.parts[0];
            end = valueToken.sourceSpan.end;
            valueSpan = valueToken.sourceSpan;
        }
        if (this._peek.type === lex.TokenType.ATTR_QUOTE) {
            const quoteToken = this._advance();
            end = quoteToken.sourceSpan.end;
        }
        const keySpan = new ParseSourceSpan(attrName.sourceSpan.start, attrName.sourceSpan.end);
        return new html.Attribute(fullName, value, new ParseSourceSpan(attrName.sourceSpan.start, end, attrName.sourceSpan.fullStart), keySpan, valueSpan);
    }
    _getParentElement() {
        return this._elementStack.length > 0 ? this._elementStack[this._elementStack.length - 1] : null;
    }
    _addToParent(node) {
        const parent = this._getParentElement();
        if (parent != null) {
            parent.children.push(node);
        }
        else {
            this.rootNodes.push(node);
        }
    }
    _getElementFullName(prefix, localName, parentElement) {
        if (prefix === '') {
            prefix = this.getTagDefinition(localName).implicitNamespacePrefix || '';
            if (prefix === '' && parentElement != null) {
                const parentTagName = splitNsName(parentElement.name)[1];
                const parentTagDefinition = this.getTagDefinition(parentTagName);
                if (!parentTagDefinition.preventNamespaceInheritance) {
                    prefix = getNsPrefix(parentElement.name);
                }
            }
        }
        return mergeNsAndName(prefix, localName);
    }
}
function lastOnStack(stack, element) {
    return stack.length > 0 && stack[stack.length - 1] === element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL21sX3BhcnNlci9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBRSxlQUFlLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFMUQsT0FBTyxLQUFLLElBQUksTUFBTSxPQUFPLENBQUM7QUFDOUIsT0FBTyxLQUFLLEdBQUcsTUFBTSxTQUFTLENBQUM7QUFDL0IsT0FBTyxFQUFDLFdBQVcsRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFnQixNQUFNLFFBQVEsQ0FBQztBQUUvRSxNQUFNLE9BQU8sU0FBVSxTQUFRLFVBQVU7SUFLdkMsWUFBbUIsV0FBd0IsRUFBRSxJQUFxQixFQUFFLEdBQVc7UUFDN0UsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQURBLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBRTNDLENBQUM7SUFORCxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQXdCLEVBQUUsSUFBcUIsRUFBRSxHQUFXO1FBQ3hFLE9BQU8sSUFBSSxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBS0Y7QUFFRCxNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUFtQixTQUFzQixFQUFTLE1BQW9CO1FBQW5ELGNBQVMsR0FBVCxTQUFTLENBQWE7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFjO0lBQUcsQ0FBQztDQUMzRTtBQUVELE1BQU0sT0FBTyxNQUFNO0lBQ2pCLFlBQW1CLGdCQUFvRDtRQUFwRCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9DO0lBQUcsQ0FBQztJQUUzRSxLQUFLLENBQUMsTUFBYyxFQUFFLEdBQVcsRUFBRSxPQUE2QjtRQUM5RCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsUUFBUSxD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QVksRUFBRSxPQUFZO0lBQzdDLE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDO0FBQ2pFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQYXJzZUVycm9yLCBQYXJzZVNvdXJjZVNwYW59IGZyb20gJy4uL3BhcnNlX3V0aWwnO1xuXG5pbXBvcnQgKiBhcyBodG1sIGZyb20gJy4vYXN0JztcbmltcG9ydCAqIGFzIGxleCBmcm9tICcuL2xleGVyJztcbmltcG9ydCB7Z2V0TnNQcmVmaXgsIG1lcmdlTnNBbmROYW1lLCBzcGxpdE5zTmFtZSwgVGFnRGVmaW5pdGlvbn0gZnJvbSAnLi90YWdzJztcblxuZXhwb3J0IGNsYXNzIFRyZWVFcnJvciBleHRlbmRzIFBhcnNlRXJyb3Ige1xuICBzdGF0aWMgY3JlYXRlKGVsZW1lbnROYW1lOiBzdHJpbmd8bnVsbCwgc3BhbjogUGFyc2VTb3VyY2VTcGFuLCBtc2c6IHN0cmluZyk6IFRyZWVFcnJvciB7XG4gICAgcmV0dXJuIG5ldyBUcmVlRXJyb3IoZWxlbWVudE5hbWUsIHNwYW4sIG1zZyk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudE5hbWU6IHN0cmluZ3xudWxsLCBzcGFuOiBQYXJzZVNvdXJjZVNwYW4sIG1zZzogc3RyaW5nKSB7XG4gICAgc3VwZXIoc3BhbiwgbXNnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyc2VUcmVlUmVzdWx0IHtcbiAgY29uc3RydWN0b3IocHVibGljIHJvb3ROb2RlczogaHRtbC5Ob2RlW10sIHB1YmxpYyBlcnJvcnM6IFBhcnNlRXJyb3JbXSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFBhcnNlciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBnZXRUYWdEZWZpbml0aW9uOiAodGFnTmFtZTogc3RyaW5nKSA9PiBUYWdEZWZpbml0aW9uKSB7fVxuXG4gIHBhcnNlKHNvdXJjZTogc3RyaW5nLCB1cmw6IHN0cmluZywgb3B0aW9ucz86IGxleC5Ub2tlbml6ZU9wdGlvbnMpOiBQYXJzZVRyZWVSZXN1bHQge1xuICAgIGNvbnN0IHRva2VuaXplUmVzdWx0ID0gbGV4LnRva2VuaXplKHNvdXJjZSwgdXJsLCB0aGlzLmdldFRhZ0RlZmluaXRpb24sIG9wdGlvbnMpO1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBfVHJlZUJ1aWxkZXIodG9rZW5pemVSZXN1bHQudG9rZW5zLCB0aGlzLmdldFRhZ0RlZmluaXRpb24pO1xuICAgIHBhcnNlci5idWlsZCgpO1xuICAgIHJldHVybiBuZXcgUGFyc2VUcmVlUmVzdWx0KFxuICAgICAgICBwYXJzZXIucm9vdE5vZGVzLFxuICAgICAgICAodG9rZW5pemVSZXN1bHQuZXJyb3JzIGFzIFBhcnNlRXJyb3JbXSkuY29uY2F0KHBhcnNlci5lcnJvcnMpLFxuICAgICk7XG4gIH1cbn1cblxuY2xhc3MgX1RyZWVCdWlsZGVyIHtcbiAgcHJpdmF0ZSBfaW5kZXg6IG51bWJlciA9IC0xO1xuICAvLyBgX3BlZWtgIHdpbGwgYmUgaW5pdGlhbGl6ZWQgYnkgdGhlIGNhbGwgdG8gYGFkdmFuY2UoKWAgaW4gdGhlIGNvbnN0cnVjdG9yLlxuICBwcml2YXRlIF9wZWVrITogbGV4LlRva2VuO1xuICBwcml2YXRlIF9lbGVtZW50U3RhY2s6IGh0bWwuRWxlbWVudFtdID0gW107XG5cbiAgcm9vdE5vZGVzOiBodG1sLk5vZGVbXSA9IFtdO1xuICBlcnJvcnM6IFRyZWVFcnJvcltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHRva2VuczogbGV4LlRva2VuW10sIHByaXZhdGUgZ2V0VGFnRGVmaW5pdGlvbjogKHRhZ05hbWU6IHN0cmluZykgPT4gVGFnRGVmaW5pdGlvbikge1xuICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgfVxuXG4gIGJ1aWxkKCk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLl9wZWVrLnR5cGUgIT09IGxleC5Ub2tlblR5cGUuRU9GKSB7XG4gICAgICBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLlRBR19PUEVOX1NUQVJUIHx8XG4gICAgICAgICAgdGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLklOQ09NUExFVEVfVEFHX09QRU4pIHtcbiAgICAgICAgdGhpcy5fY29uc3VtZVN0YXJ0VGFnKHRoaXMuX2FkdmFuY2UoKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3BlZWsudHlwZSA9PT0gbGV4LlRva2VuVHlwZS5UQUdfQ0xPU0UpIHtcbiAgICAgICAgdGhpcy5fY29uc3VtZUVuZFRhZyh0aGlzLl9hZHZhbmNlKCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuQ0RBVEFfU1RBUlQpIHtcbiAgICAgICAgdGhpcy5fY2xvc2VWb2lkRWxlbWVudCgpO1xuICAgICAgICB0aGlzLl9jb25zdW1lQ2RhdGEodGhpcy5fYWR2YW5jZSgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLkNPTU1FTlRfU1RBUlQpIHtcbiAgICAgICAgdGhpcy5fY2xvc2VWb2lkRWxlbWVudCgpO1xuICAgICAgICB0aGlzLl9jb25zdW1lQ29tbWVudCh0aGlzLl9hZHZhbmNlKCkpO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICB0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuVEVYVCB8fCB0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuUkFXX1RFWFQgfHxcbiAgICAgICAgICB0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuRVNDQVBBQkxFX1JBV19URVhUKSB7XG4gICAgICAgIHRoaXMuX2Nsb3NlVm9pZEVsZW1lbnQoKTtcbiAgICAgICAgdGhpcy5fY29uc3VtZVRleHQodGhpcy5fYWR2YW5jZSgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLkVYUEFOU0lPTl9GT1JNX1NUQVJUKSB7XG4gICAgICAgIHRoaXMuX2NvbnN1bWVFeHBhbnNpb24odGhpcy5fYWR2YW5jZSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFNraXAgYWxsIG90aGVyIHRva2Vucy4uLlxuICAgICAgICB0aGlzLl9hZHZhbmNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYWR2YW5jZSgpOiBsZXguVG9rZW4ge1xuICAgIGNvbnN0IHByZXYgPSB0aGlzLl9wZWVrO1xuICAgIGlmICh0aGlzLl9pbmRleCA8IHRoaXMudG9rZW5zLmxlbmd0aCAtIDEpIHtcbiAgICAgIC8vIE5vdGU6IHRoZXJlIGlzIGFsd2F5cyBhbiBFT0YgdG9rZW4gYXQgdGhlIGVuZFxuICAgICAgdGhpcy5faW5kZXgrKztcbiAgICB9XG4gICAgdGhpcy5fcGVlayA9IHRoaXMudG9rZW5zW3RoaXMuX2luZGV4XTtcbiAgICByZXR1cm4gcHJldjtcbiAgfVxuXG4gIHByaXZhdGUgX2FkdmFuY2VJZih0eXBlOiBsZXguVG9rZW5UeXBlKTogbGV4LlRva2VufG51bGwge1xuICAgIGlmICh0aGlzLl9wZWVrLnR5cGUgPT09IHR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hZHZhbmNlKCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUNkYXRhKF9zdGFydFRva2VuOiBsZXguVG9rZW4pIHtcbiAgICB0aGlzLl9jb25zdW1lVGV4dCh0aGlzLl9hZHZhbmNlKCkpO1xuICAgIHRoaXMuX2FkdmFuY2VJZihsZXguVG9rZW5UeXBlLkNEQVRBX0VORCk7XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lQ29tbWVudCh0b2tlbjogbGV4LlRva2VuKSB7XG4gICAgY29uc3QgdGV4dCA9IHRoaXMuX2FkdmFuY2VJZihsZXguVG9rZW5UeXBlLlJBV19URVhUKTtcbiAgICB0aGlzLl9hZHZhbmNlSWYobGV4LlRva2VuVHlwZS5DT01NRU5UX0VORCk7XG4gICAgY29uc3QgdmFsdWUgPSB0ZXh0ICE9IG51bGwgPyB0ZXh0LnBhcnRzWzBdLnRyaW0oKSA6IG51bGw7XG4gICAgdGhpcy5fYWRkVG9QYXJlbnQobmV3IGh0bWwuQ29tbWVudCh2YWx1ZSwgdG9rZW4uc291cmNlU3BhbikpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUV4cGFuc2lvbih0b2tlbjogbGV4LlRva2VuKSB7XG4gICAgY29uc3Qgc3dpdGNoVmFsdWUgPSB0aGlzLl9hZHZhbmNlKCk7XG5cbiAgICBjb25zdCB0eXBlID0gdGhpcy5fYWR2YW5jZSgpO1xuICAgIGNvbnN0IGNhc2VzOiBodG1sLkV4cGFuc2lvbkNhc2VbXSA9IFtdO1xuXG4gICAgLy8gcmVhZCA9XG4gICAgd2hpbGUgKHRoaXMuX3BlZWsudHlwZSA9PT0gbGV4LlRva2VuVHlwZS5FWFBBTlNJT05fQ0FTRV9WQUxVRSkge1xuICAgICAgY29uc3QgZXhwQ2FzZSA9IHRoaXMuX3BhcnNlRXhwYW5zaW9uQ2FzZSgpO1xuICAgICAgaWYgKCFleHBDYXNlKSByZXR1cm47ICAvLyBlcnJvclxuICAgICAgY2FzZXMucHVzaChleHBDYXNlKTtcbiAgICB9XG5cbiAgICAvLyByZWFkIHRoZSBmaW5hbCB9XG4gICAgaWYgKHRoaXMuX3BlZWsudHlwZSAhPT0gbGV4LlRva2VuVHlwZS5FWFBBTlNJT05fRk9STV9FTkQpIHtcbiAgICAgIHRoaXMuZXJyb3JzLnB1c2goXG4gICAgICAgICAgVHJlZUVycm9yLmNyZWF0ZShudWxsLCB0aGlzLl9wZWVrLnNvdXJjZVNwYW4sIGBJbnZhbGlkIElDVSBtZXNzYWdlLiBNaXNzaW5nICd9Jy5gKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNvdXJjZVNwYW4gPSBuZXcgUGFyc2VTb3VyY2VTcGFuKFxuICAgICAgICB0b2tlbi5zb3VyY2VTcGFuLnN0YXJ0LCB0aGlzLl9wZWVrLnNvdXJjZVNwYW4uZW5kLCB0b2tlbi5zb3VyY2VTcGFuLmZ1bGxTdGFydCk7XG4gICAgdGhpcy5fYWRkVG9QYXJlbnQobmV3IGh0bWwuRXhwYW5zaW9uKFxuICAgICAgICBzd2l0Y2hWYWx1ZS5wYXJ0c1swXSwgdHlwZS5wYXJ0c1swXSwgY2FzZXMsIHNvdXJjZVNwYW4sIHN3aXRjaFZhbHVlLnNvdXJjZVNwYW4pKTtcblxuICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlRXhwYW5zaW9uQ2FzZSgpOiBodG1sLkV4cGFuc2lvbkNhc2V8bnVsbCB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLl9hZHZhbmNlKCk7XG5cbiAgICAvLyByZWFkIHtcbiAgICBpZiAodGhpcy5fcGVlay50eXBlICE9PSBsZXguVG9rZW5UeXBlLkVYUEFOU0lPTl9DQVNFX0VYUF9TVEFSVCkge1xuICAgICAgdGhpcy5lcnJvcnMucHVzaChcbiAgICAgICAgICBUcmVlRXJyb3IuY3JlYXRlKG51bGwsIHRoaXMuX3BlZWsuc291cmNlU3BhbiwgYEludmFsaWQgSUNVIG1lc3NhZ2UuIE1pc3NpbmcgJ3snLmApKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIHJlYWQgdW50aWwgfVxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fYWR2YW5jZSgpO1xuXG4gICAgY29uc3QgZXhwID0gdGhpcy5fY29sbGVjdEV4cGFuc2lvbkV4cFRva2VucyhzdGFydCk7XG4gICAgaWYgKCFleHApIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgZW5kID0gdGhpcy5fYWR2YW5jZSgpO1xuICAgIGV4cC5wdXNoKG5ldyBsZXguVG9rZW4obGV4LlRva2VuVHlwZS5FT0YsIFtdLCBlbmQuc291cmNlU3BhbikpO1xuXG4gICAgLy8gcGFyc2UgZXZlcnl0aGluZyBpbiBiZXR3ZWVuIHsgYW5kIH1cbiAgICBjb25zdCBleHBhbnNpb25DYXNlUGFyc2VyID0gbmV3IF9UcmVlQnVpbGRlcihleHAsIHRoaXMuZ2V0VGFnRGVmaW5pdGlvbik7XG4gICAgZXhwYW5zaW9uQ2FzZVBhcnNlci5idWlsZCgpO1xuICAgIGlmIChleHBhbnNpb25DYXNlUGFyc2VyLmVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmVycm9ycyA9IHRoaXMuZXJyb3JzLmNvbmNhdChleHBhbnNpb25DYXNlUGFyc2VyLmVycm9ycyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VTcGFuID1cbiAgICAgICAgbmV3IFBhcnNlU291cmNlU3Bhbih2YWx1ZS5zb3VyY2VTcGFuLnN0YXJ0LCBlbmQuc291cmNlU3Bhbi5lbmQsIHZhbHVlLnNvdXJjZVNwYW4uZnVsbFN0YXJ0KTtcbiAgICBjb25zdCBleHBTb3VyY2VTcGFuID1cbiAgICAgICAgbmV3IFBhcnNlU291cmNlU3BhbihzdGFydC5zb3VyY2VTcGFuLnN0YXJ0LCBlbmQuc291cmNlU3Bhbi5lbmQsIHN0YXJ0LnNvdXJjZVNwYW4uZnVsbFN0YXJ0KTtcbiAgICByZXR1cm4gbmV3IGh0bWwuRXhwYW5zaW9uQ2FzZShcbiAgICAgICAgdmFsdWUucGFydHNbMF0sIGV4cGFuc2lvbkNhc2VQYXJzZXIucm9vdE5vZGVzLCBzb3VyY2VTcGFuLCB2YWx1ZS5zb3VyY2VTcGFuLCBleHBTb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbGxlY3RFeHBhbnNpb25FeHBUb2tlbnMoc3RhcnQ6IGxleC5Ub2tlbik6IGxleC5Ub2tlbltdfG51bGwge1xuICAgIGNvbnN0IGV4cDogbGV4LlRva2VuW10gPSBbXTtcbiAgICBjb25zdCBleHBhbnNpb25Gb3JtU3RhY2sgPSBbbGV4LlRva2VuVHlwZS5FWFBBTlNJT05fQ0FTRV9FWFBfU1RBUlRdO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmICh0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuRVhQQU5TSU9OX0ZPUk1fU1RBUlQgfHxcbiAgICAgICAgICB0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuRVhQQU5TSU9OX0NBU0VfRVhQX1NUQVJUKSB7XG4gICAgICAgIGV4cGFuc2lvbkZvcm1TdGFjay5wdXNoKHRoaXMuX3BlZWsudHlwZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuRVhQQU5TSU9OX0NBU0VfRVhQX0VORCkge1xuICAgICAgICBpZiAobGFzdE9uU3RhY2soZXhwYW5zaW9uRm9ybVN0YWNrLCBsZXguVG9rZW5UeXBlLkVYUEFOU0lPTl9DQVNFX0VYUF9TVEFSVCkpIHtcbiAgICAgICAgICBleHBhbnNpb25Gb3JtU3RhY2sucG9wKCk7XG4gICAgICAgICAgaWYgKGV4cGFuc2lvbkZvcm1TdGFjay5sZW5ndGggPT0gMCkgcmV0dXJuIGV4cDtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgIFRyZWVFcnJvci5jcmVhdGUobnVsbCwgc3RhcnQuc291cmNlU3BhbiwgYEludmFsaWQgSUNVIG1lc3NhZ2UuIE1pc3NpbmcgJ30nLmApKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLkVYUEFOU0lPTl9GT1JNX0VORCkge1xuICAgICAgICBpZiAobGFzdE9uU3RhY2soZXhwYW5zaW9uRm9ybVN0YWNrLCBsZXguVG9rZW5UeXBlLkVYUEFOU0lPTl9GT1JNX1NUQVJUKSkge1xuICAgICAgICAgIGV4cGFuc2lvbkZvcm1TdGFjay5wb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICBUcmVlRXJyb3IuY3JlYXRlKG51bGwsIHN0YXJ0LnNvdXJjZVNwYW4sIGBJbnZhbGlkIElDVSBtZXNzYWdlLiBNaXNzaW5nICd9Jy5gKSk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX3BlZWsudHlwZSA9PT0gbGV4LlRva2VuVHlwZS5FT0YpIHtcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChcbiAgICAgICAgICAgIFRyZWVFcnJvci5jcmVhdGUobnVsbCwgc3RhcnQuc291cmNlU3BhbiwgYEludmFsaWQgSUNVIG1lc3NhZ2UuIE1pc3NpbmcgJ30nLmApKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGV4cC5wdXNoKHRoaXMuX2FkdmFuY2UoKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZVRleHQodG9rZW46IGxleC5Ub2tlbikge1xuICAgIGxldCB0ZXh0ID0gdG9rZW4ucGFydHNbMF07XG4gICAgaWYgKHRleHQubGVuZ3RoID4gMCAmJiB0ZXh0WzBdID09ICdcXG4nKSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9nZXRQYXJlbnRFbGVtZW50KCk7XG4gICAgICBpZiAocGFyZW50ICE9IG51bGwgJiYgcGFyZW50LmNoaWxkcmVuLmxlbmd0aCA9PSAwICYmXG4gICAgICAgICAgdGhpcy5nZXRUYWdEZWZpbml0aW9uKHBhcmVudC5uYW1lKS5pZ25vcmVGaXJzdExmKSB7XG4gICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9hZGRUb1BhcmVudChuZXcgaHRtbC5UZXh0KHRleHQsIHRva2VuLnNvdXJjZVNwYW4pKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jbG9zZVZvaWRFbGVtZW50KCk6IHZvaWQge1xuICAgIGNvbnN0IGVsID0gdGhpcy5fZ2V0UGFyZW50RWxlbWVudCgpO1xuICAgIGlmIChlbCAmJiB0aGlzLmdldFRhZ0RlZmluaXRpb24oZWwubmFtZSkuaXNWb2lkKSB7XG4gICAgICB0aGlzLl9lbGVtZW50U3RhY2sucG9wKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZVN0YXJ0VGFnKHN0YXJ0VGFnVG9rZW46IGxleC5Ub2tlbikge1xuICAgIGNvbnN0IFtwcmVmaXgsIG5hbWVdID0gc3RhcnRUYWdUb2tlbi5wYXJ0cztcbiAgICBjb25zdCBhdHRyczogaHRtbC5BdHRyaWJ1dGVbXSA9IFtdO1xuICAgIHdoaWxlICh0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuQVRUUl9OQU1FKSB7XG4gICAgICBhdHRycy5wdXNoKHRoaXMuX2NvbnN1bWVBdHRyKHRoaXMuX2FkdmFuY2UoKSkpO1xuICAgIH1cbiAgICBjb25zdCBmdWxsTmFtZSA9IHRoaXMuX2dldEVsZW1lbnRGdWxsTmFtZShwcmVmaXgsIG5hbWUsIHRoaXMuX2dldFBhcmVudEVsZW1lbnQoKSk7XG4gICAgbGV0IHNlbGZDbG9zaW5nID0gZmFsc2U7XG4gICAgLy8gTm90ZTogVGhlcmUgY291bGQgaGF2ZSBiZWVuIGEgdG9rZW5pemVyIGVycm9yXG4gICAgLy8gc28gdGhhdCB3ZSBkb24ndCBnZXQgYSB0b2tlbiBmb3IgdGhlIGVuZCB0YWcuLi5cbiAgICBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLlRBR19PUEVOX0VORF9WT0lEKSB7XG4gICAgICB0aGlzLl9hZHZhbmNlKCk7XG4gICAgICBzZWxmQ2xvc2luZyA9IHRydWU7XG4gICAgICBjb25zdCB0YWdEZWYgPSB0aGlzLmdldFRhZ0RlZmluaXRpb24oZnVsbE5hbWUpO1xuICAgICAgaWYgKCEodGFnRGVmLmNhblNlbGZDbG9zZSB8fCBnZXROc1ByZWZpeChmdWxsTmFtZSkgIT09IG51bGwgfHwgdGFnRGVmLmlzVm9pZCkpIHtcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChUcmVlRXJyb3IuY3JlYXRlKFxuICAgICAgICAgICAgZnVsbE5hbWUsIHN0YXJ0VGFnVG9rZW4uc291cmNlU3BhbixcbiAgICAgICAgICAgIGBPbmx5IHZvaWQgYW5kIGZvcmVpZ24gZWxlbWVudHMgY2FuIGJlIHNlbGYgY2xvc2VkIFwiJHtzdGFydFRhZ1Rva2VuLnBhcnRzWzFdfVwiYCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLlRBR19PUEVOX0VORCkge1xuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgICAgc2VsZkNsb3NpbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgZW5kID0gdGhpcy5fcGVlay5zb3VyY2VTcGFuLmZ1bGxTdGFydDtcbiAgICBjb25zdCBzcGFuID0gbmV3IFBhcnNlU291cmNlU3BhbihcbiAgICAgICAgc3RhcnRUYWdUb2tlbi5zb3VyY2VTcGFuLnN0YXJ0LCBlbmQsIHN0YXJ0VGFnVG9rZW4uc291cmNlU3Bhbi5mdWxsU3RhcnQpO1xuICAgIC8vIENyZWF0ZSBhIHNlcGFyYXRlIGBzdGFydFNwYW5gIGJlY2F1c2UgYHNwYW5gIHdpbGwgYmUgbW9kaWZpZWQgd2hlbiB0aGVyZSBpcyBhbiBgZW5kYCBzcGFuLlxuICAgIGNvbnN0IHN0YXJ0U3BhbiA9IG5ldyBQYXJzZVNvdXJjZVNwYW4oXG4gICAgICAgIHN0YXJ0VGFnVG9rZW4uc291cmNlU3Bhbi5zdGFydCwgZW5kLCBzdGFydFRhZ1Rva2VuLnNvdXJjZVNwYW4uZnVsbFN0YXJ0KTtcbiAgICBjb25zdCBlbCA9IG5ldyBodG1sLkVsZW1lbnQoZnVsbE5hbWUsIGF0dHJzLCBbXSwgc3Bhbiwgc3RhcnRTcGFuLCB1bmRlZmluZWQpO1xuICAgIHRoaXMuX3B1c2hFbGVtZW50KGVsKTtcbiAgICBpZiAoc2VsZkNsb3NpbmcpIHtcbiAgICAgIC8vIEVsZW1lbnRzIHRoYXQgYXJlIHNlbGYtY2xvc2VkIGhhdmUgdGhlaXIgYGVuZFNvdXJjZVNwYW5gIHNldCB0byB0aGUgZnVsbCBzcGFuLCBhcyB0aGVcbiAgICAgIC8vIGVsZW1lbnQgc3RhcnQgdGFnIGFsc28gcmVwcmVzZW50cyB0aGUgZW5kIHRhZy5cbiAgICAgIHRoaXMuX3BvcEVsZW1lbnQoZnVsbE5hbWUsIHNwYW4pO1xuICAgIH0gZWxzZSBpZiAoc3RhcnRUYWdUb2tlbi50eXBlID09PSBsZXguVG9rZW5UeXBlLklOQ09NUExFVEVfVEFHX09QRU4pIHtcbiAgICAgIC8vIFdlIGFscmVhZHkga25vdyB0aGUgb3BlbmluZyB0YWcgaXMgbm90IGNvbXBsZXRlLCBzbyBpdCBpcyB1bmxpa2VseSBpdCBoYXMgYSBjb3JyZXNwb25kaW5nXG4gICAgICAvLyBjbG9zZSB0YWcuIExldCdzIG9wdGltaXN0aWNhbGx5IHBhcnNlIGl0IGFzIGEgZnVsbCBlbGVtZW50IGFuZCBlbWl0IGFuIGVycm9yLlxuICAgICAgdGhpcy5fcG9wRWxlbWVudChmdWxsTmFtZSwgbnVsbCk7XG4gICAgICB0aGlzLmVycm9ycy5wdXNoKFxuICAgICAgICAgIFRyZWVFcnJvci5jcmVhdGUoZnVsbE5hbWUsIHNwYW4sIGBPcGVuaW5nIHRhZyBcIiR7ZnVsbE5hbWV9XCIgbm90IHRlcm1pbmF0ZWQuYCkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3B1c2hFbGVtZW50KGVsOiBodG1sLkVsZW1lbnQpIHtcbiAgICBjb25zdCBwYXJlbnRFbCA9IHRoaXMuX2dldFBhcmVudEVsZW1lbnQoKTtcblxuICAgIGlmIChwYXJlbnRFbCAmJiB0aGlzLmdldFRhZ0RlZmluaXRpb24ocGFyZW50RWwubmFtZSkuaXNDbG9zZWRCeUNoaWxkKGVsLm5hbWUpKSB7XG4gICAgICB0aGlzLl9lbGVtZW50U3RhY2sucG9wKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWRkVG9QYXJlbnQoZWwpO1xuICAgIHRoaXMuX2VsZW1lbnRTdGFjay5wdXNoKGVsKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVFbmRUYWcoZW5kVGFnVG9rZW46IGxleC5Ub2tlbikge1xuICAgIGNvbnN0IGZ1bGxOYW1lID0gdGhpcy5fZ2V0RWxlbWVudEZ1bGxOYW1lKFxuICAgICAgICBlbmRUYWdUb2tlbi5wYXJ0c1swXSwgZW5kVGFnVG9rZW4ucGFydHNbMV0sIHRoaXMuX2dldFBhcmVudEVsZW1lbnQoKSk7XG5cbiAgICBpZiAodGhpcy5nZXRUYWdEZWZpbml0aW9uKGZ1bGxOYW1lKS5pc1ZvaWQpIHtcbiAgICAgIHRoaXMuZXJyb3JzLnB1c2goVHJlZUVycm9yLmNyZWF0ZShcbiAgICAgICAgICBmdWxsTmFtZSwgZW5kVGFnVG9rZW4uc291cmNlU3BhbixcbiAgICAgICAgICBgVm9pZCBlbGVtZW50cyBkbyBub3QgaGF2ZSBlbmQgdGFncyBcIiR7ZW5kVGFnVG9rZW4ucGFydHNbMV19XCJgKSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5fcG9wRWxlbWVudChmdWxsTmFtZSwgZW5kVGFnVG9rZW4uc291cmNlU3BhbikpIHtcbiAgICAgIGNvbnN0IGVyck1zZyA9IGBVbmV4cGVjdGVkIGNsb3NpbmcgdGFnIFwiJHtcbiAgICAgICAgICBmdWxsTmFtZX1cIi4gSXQgbWF5IGhhcHBlbiB3aGVuIHRoZSB0YWcgaGFzIGFscmVhZHkgYmVlbiBjbG9zZWQgYnkgYW5vdGhlciB0YWcuIEZvciBtb3JlIGluZm8gc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9zeW50YXguaHRtbCNjbG9zaW5nLWVsZW1lbnRzLXRoYXQtaGF2ZS1pbXBsaWVkLWVuZC10YWdzYDtcbiAgICAgIHRoaXMuZXJyb3JzLnB1c2goVHJlZUVycm9yLmNyZWF0ZShmdWxsTmFtZSwgZW5kVGFnVG9rZW4uc291cmNlU3BhbiwgZXJyTXNnKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgbmVhcmVzdCBlbGVtZW50IHdpdGggdGhlIHRhZyBuYW1lIGBmdWxsTmFtZWAgaW4gdGhlIHBhcnNlIHRyZWUuXG4gICAqIGBlbmRTb3VyY2VTcGFuYCBpcyB0aGUgc3BhbiBvZiB0aGUgY2xvc2luZyB0YWcsIG9yIG51bGwgaWYgdGhlIGVsZW1lbnQgZG9lc1xuICAgKiBub3QgaGF2ZSBhIGNsb3NpbmcgdGFnIChmb3IgZXhhbXBsZSwgdGhpcyBoYXBwZW5zIHdoZW4gYW4gaW5jb21wbGV0ZVxuICAgKiBvcGVuaW5nIHRhZyBpcyByZWNvdmVyZWQpLlxuICAgKi9cbiAgcHJpdmF0ZSBfcG9wRWxlbWVudChmdWxsTmFtZTogc3RyaW5nLCBlbmRTb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW58bnVsbCk6IGJvb2xlYW4ge1xuICAgIGxldCB1bmV4cGVjdGVkQ2xvc2VUYWdEZXRlY3RlZCA9IGZhbHNlO1xuICAgIGZvciAobGV0IHN0YWNrSW5kZXggPSB0aGlzLl9lbGVtZW50U3RhY2subGVuZ3RoIC0gMTsgc3RhY2tJbmRleCA+PSAwOyBzdGFja0luZGV4LS0pIHtcbiAgICAgIGNvbnN0IGVsID0gdGhpcy5fZWxlbWVudFN0YWNrW3N0YWNrSW5kZXhdO1xuICAgICAgaWYgKGVsLm5hbWUgPT0gZnVsbE5hbWUpIHtcbiAgICAgICAgLy8gUmVjb3JkIHRoZSBwYXJzZSBzcGFuIHdpdGggdGhlIGVsZW1lbnQgdGhhdCBpcyBiZWluZyBjbG9zZWQuIEFueSBlbGVtZW50cyB0aGF0IGFyZVxuICAgICAgICAvLyByZW1vdmVkIGZyb20gdGhlIGVsZW1lbnQgc3RhY2sgYXQgdGhpcyBwb2ludCBhcmUgY2xvc2VkIGltcGxpY2l0bHksIHNvIHRoZXkgd29uJ3QgZ2V0XG4gICAgICAgIC8vIGFuIGVuZCBzb3VyY2Ugc3BhbiAoYXMgdGhlcmUgaXMgbm8gZXhwbGljaXQgY2xvc2luZyBlbGVtZW50KS5cbiAgICAgICAgZWwuZW5kU291cmNlU3BhbiA9IGVuZFNvdXJjZVNwYW47XG4gICAgICAgIGVsLnNvdXJjZVNwYW4uZW5kID0gZW5kU291cmNlU3BhbiAhPT0gbnVsbCA/IGVuZFNvdXJjZVNwYW4uZW5kIDogZWwuc291cmNlU3Bhbi5lbmQ7XG5cbiAgICAgICAgdGhpcy5fZWxlbWVudFN0YWNrLnNwbGljZShzdGFja0luZGV4LCB0aGlzLl9lbGVtZW50U3RhY2subGVuZ3RoIC0gc3RhY2tJbmRleCk7XG4gICAgICAgIHJldHVybiAhdW5leHBlY3RlZENsb3NlVGFnRGV0ZWN0ZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5nZXRUYWdEZWZpbml0aW9uKGVsLm5hbWUpLmNsb3NlZEJ5UGFyZW50KSB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSBlbmNvdW50ZXJlZCBhbiB1bmV4cGVjdGVkIGNsb3NlIHRhZyBidXQgY29udGludWUgcHJvY2Vzc2luZyB0aGUgZWxlbWVudFxuICAgICAgICAvLyBzdGFjayBzbyB3ZSBjYW4gYXNzaWduIGFuIGBlbmRTb3VyY2VTcGFuYCBpZiB0aGVyZSBpcyBhIGNvcnJlc3BvbmRpbmcgc3RhcnQgdGFnIGZvciB0aGlzXG4gICAgICAgIC8vIGVuZCB0YWcgaW4gdGhlIHN0YWNrLlxuICAgICAgICB1bmV4cGVjdGVkQ2xvc2VUYWdEZXRlY3RlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVBdHRyKGF0dHJOYW1lOiBsZXguVG9rZW4pOiBodG1sLkF0dHJpYnV0ZSB7XG4gICAgY29uc3QgZnVsbE5hbWUgPSBtZXJnZU5zQW5kTmFtZShhdHRyTmFtZS5wYXJ0c1swXSwgYXR0ck5hbWUucGFydHNbMV0pO1xuICAgIGxldCBlbmQgPSBhdHRyTmFtZS5zb3VyY2VTcGFuLmVuZDtcbiAgICBsZXQgdmFsdWUgPSAnJztcbiAgICBsZXQgdmFsdWVTcGFuOiBQYXJzZVNvdXJjZVNwYW4gPSB1bmRlZmluZWQhO1xuICAgIGlmICh0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuQVRUUl9RVU9URSkge1xuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLkFUVFJfVkFMVUUpIHtcbiAgICAgIGNvbnN0IHZhbHVlVG9rZW4gPSB0aGlzLl9hZHZhbmNlKCk7XG4gICAgICB2YWx1ZSA9IHZhbHVlVG9rZW4ucGFydHNbMF07XG4gICAgICBlbmQgPSB2YWx1ZVRva2VuLnNvdXJjZVNwYW4uZW5kO1xuICAgICAgdmFsdWVTcGFuID0gdmFsdWVUb2tlbi5zb3VyY2VTcGFuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLkFUVFJfUVVPVEUpIHtcbiAgICAgIGNvbnN0IHF1b3RlVG9rZW4gPSB0aGlzLl9hZHZhbmNlKCk7XG4gICAgICBlbmQgPSBxdW90ZVRva2VuLnNvdXJjZVNwYW4uZW5kO1xuICAgIH1cbiAgICBjb25zdCBrZXlTcGFuID0gbmV3IFBhcnNlU291cmNlU3BhbihhdHRyTmFtZS5zb3VyY2VTcGFuLnN0YXJ0LCBhdHRyTmFtZS5zb3VyY2VTcGFuLmVuZCk7XG4gICAgcmV0dXJuIG5ldyBodG1sLkF0dHJpYnV0ZShcbiAgICAgICAgZnVsbE5hbWUsIHZhbHVlLFxuICAgICAgICBuZXcgUGFyc2VTb3VyY2VTcGFuKGF0dHJOYW1lLnNvdXJjZVNwYW4uc3RhcnQsIGVuZCwgYXR0ck5hbWUuc291cmNlU3Bhbi5mdWxsU3RhcnQpLCBrZXlTcGFuLFxuICAgICAgICB2YWx1ZVNwYW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UGFyZW50RWxlbWVudCgpOiBodG1sLkVsZW1lbnR8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRTdGFjay5sZW5ndGggPiAwID8gdGhpcy5fZWxlbWVudFN0YWNrW3RoaXMuX2VsZW1lbnRTdGFjay5sZW5ndGggLSAxXSA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIF9hZGRUb1BhcmVudChub2RlOiBodG1sLk5vZGUpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9nZXRQYXJlbnRFbGVtZW50KCk7XG4gICAgaWYgKHBhcmVudCAhPSBudWxsKSB7XG4gICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb290Tm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRFbGVtZW50RnVsbE5hbWUocHJlZml4OiBzdHJpbmcsIGxvY2FsTmFtZTogc3RyaW5nLCBwYXJlbnRFbGVtZW50OiBodG1sLkVsZW1lbnR8bnVsbCk6XG4gICAgICBzdHJpbmcge1xuICAgIGlmIChwcmVmaXggPT09ICcnKSB7XG4gICAgICBwcmVmaXggPSB0aGlzLmdldFRhZ0RlZmluaXRpb24obG9jYWxOYW1lKS5pbXBsaWNpdE5hbWVzcGFjZVByZWZpeCB8fCAnJztcbiAgICAgIGlmIChwcmVmaXggPT09ICcnICYmIHBhcmVudEVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBwYXJlbnRUYWdOYW1lID0gc3BsaXROc05hbWUocGFyZW50RWxlbWVudC5uYW1lKVsxXTtcbiAgICAgICAgY29uc3QgcGFyZW50VGFnRGVmaW5pdGlvbiA9IHRoaXMuZ2V0VGFnRGVmaW5pdGlvbihwYXJlbnRUYWdOYW1lKTtcbiAgICAgICAgaWYgKCFwYXJlbnRUYWdEZWZpbml0aW9uLnByZXZlbnROYW1lc3BhY2VJbmhlcml0YW5jZSkge1xuICAgICAgICAgIHByZWZpeCA9IGdldE5zUHJlZml4KHBhcmVudEVsZW1lbnQubmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWVyZ2VOc0FuZE5hbWUocHJlZml4LCBsb2NhbE5hbWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxhc3RPblN0YWNrKHN0YWNrOiBhbnlbXSwgZWxlbWVudDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiBzdGFjay5sZW5ndGggPiAwICYmIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdID09PSBlbGVtZW50O1xufVxuIl19