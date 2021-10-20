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
        define("@angular/compiler/src/schema/dom_element_schema_registry", ["require", "exports", "tslib", "@angular/compiler/src/core", "@angular/compiler/src/ml_parser/tags", "@angular/compiler/src/util", "@angular/compiler/src/schema/dom_security_schema", "@angular/compiler/src/schema/element_schema_registry"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DomElementSchemaRegistry = void 0;
    var tslib_1 = require("tslib");
    var core_1 = require("@angular/compiler/src/core");
    var tags_1 = require("@angular/compiler/src/ml_parser/tags");
    var util_1 = require("@angular/compiler/src/util");
    var dom_security_schema_1 = require("@angular/compiler/src/schema/dom_security_schema");
    var element_schema_registry_1 = require("@angular/compiler/src/schema/element_schema_registry");
    var BOOLEAN = 'boolean';
    var NUMBER = 'number';
    var STRING = 'string';
    var OBJECT = 'object';
    /**
     * This array represents the DOM schema. It encodes inheritance, properties, and events.
     *
     * ## Overview
     *
     * Each line represents one kind of element. The `element_inheritance` and properties are joined
     * using `element_inheritance|properties` syntax.
     *
     * ## Element Inheritance
     *
     * The `element_inheritance` can be further subdivided as `element1,element2,...^parentElement`.
     * Here the individual elements are separated by `,` (commas). Every element in the list
     * has identical properties.
     *
     * An `element` may inherit additional properties from `parentElement` If no `^parentElement` is
     * specified then `""` (blank) element is assumed.
     *
     * NOTE: The blank element inherits from root `[Element]` element, the super element of all
     * elements.
     *
     * NOTE an element prefix such as `:svg:` has no special meaning to the schema.
     *
     * ## Properties
     *
     * Each element has a set of properties separated by `,` (commas). Each property can be prefixed
     * by a special character designating its type:
     *
     * - (no prefix): property is a string.
     * - `*`: property represents an event.
     * - `!`: property is a boolean.
     * - `#`: property is a number.
     * - `%`: property is an object.
     *
     * ## Query
     *
     * The class creates an internal squas representation which allows to easily answer the query of
     * if a given property exist on a given element.
     *
     * NOTE: We don't yet support querying for types or events.
     * NOTE: This schema is auto extracted from `schema_extractor.ts` located in the test folder,
     *       see dom_element_schema_registry_spec.ts
     */
    // =================================================================================================
    // =================================================================================================
    // =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
    // =================================================================================================
    // =================================================================================================
    //
    //                       DO NOT EDIT THIS DOM SCHEMA WITHOUT A SECURITY REVIEW!
    //
    // Newly added properties must be security reviewed and assigned an appropriate SecurityContext in
    // dom_security_schema.ts. Reach out to mprobst & rjamet for details.
    //
    // =================================================================================================
    var SCHEMA = [
        '[Element]|textContent,%classList,className,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*copy,*cut,*paste,*search,*selectstart,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerHTML,#scrollLeft,#scrollTop,slot' +
            /* added manually to avoid breaking changes */
            ',*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored',
        '[HTMLElement]^[Element]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate',
        'abbr,address,article,aside,b,bdi,bdo,cite,code,dd,dfn,dt,em,figcaption,figure,footer,header,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate',
        'media^[HTMLElement]|!autoplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*waitingforkey,#playbackRate,preload,src,%srcObject,#volume',
        ':svg:^[HTMLElement]|*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,%style,#tabIndex',
        ':svg:graphics^:svg:|',
        ':svg:animation^:svg:|*begin,*end,*repeat',
        ':svg:geometry^:svg:|',
        ':svg:componentTransferFunction^:svg:|',
        ':svg:gradient^:svg:|',
        ':svg:textContent^:svg:graphics|',
        ':svg:textPositioning^:svg:textContent|',
        'a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,rev,search,shape,target,text,type,username',
        'area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,rel,search,shape,target,username',
        'audio^media|',
        'br^[HTMLElement]|clear',
        'base^[HTMLElement]|href,target',
        'body^[HTMLElement]|aLink,background,bgColor,link,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink',
        'button^[HTMLElement]|!autofocus,!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value',
        'canvas^[HTMLElement]|#height,#width',
        'content^[HTMLElement]|select',
        'dl^[HTMLElement]|!compact',
        'datalist^[HTMLElement]|',
        'details^[HTMLElement]|!open',
        'dialog^[HTMLElement]|!open,returnValue',
        'dir^[HTMLElement]|!compact',
        'div^[HTMLElement]|align',
        'embed^[HTMLElement]|align,height,name,src,type,width',
        'fieldset^[HTMLElement]|!disabled,name',
        'font^[HTMLElement]|color,face,size',
        'form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target',
        'frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src',
        'frameset^[HTMLElement]|cols,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows',
        'hr^[HTMLElement]|align,color,!noShade,size,width',
        'head^[HTMLElement]|',
        'h1,h2,h3,h4,h5,h6^[HTMLElement]|align',
        'html^[HTMLElement]|version',
        'iframe^[HTMLElement]|align,!allowFullscreen,frameBorder,height,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width',
        'img^[HTMLElement]|align,alt,border,%crossOrigin,#height,#hspace,!isMap,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width',
        'input^[HTMLElement]|accept,align,alt,autocapitalize,autocomplete,!autofocus,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width',
        'li^[HTMLElement]|type,#value',
        'label^[HTMLElement]|htmlFor',
        'legend^[HTMLElement]|align',
        'link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type',
        'map^[HTMLElement]|name',
        'marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width',
        'menu^[HTMLElement]|!compact',
        'meta^[HTMLElement]|content,httpEquiv,name,scheme',
        'meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value',
        'ins,del^[HTMLElement]|cite,dateTime',
        'ol^[HTMLElement]|!compact,!reversed,#start,type',
        'object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width',
        'optgroup^[HTMLElement]|!disabled,label',
        'option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value',
        'output^[HTMLElement]|defaultValue,%htmlFor,name,value',
        'p^[HTMLElement]|align',
        'param^[HTMLElement]|name,type,value,valueType',
        'picture^[HTMLElement]|',
        'pre^[HTMLElement]|#width',
        'progress^[HTMLElement]|#max,#value',
        'q,blockquote,cite^[HTMLElement]|',
        'script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,src,text,type',
        'select^[HTMLElement]|autocomplete,!autofocus,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value',
        'shadow^[HTMLElement]|',
        'slot^[HTMLElement]|name',
        'source^[HTMLElement]|media,sizes,src,srcset,type',
        'span^[HTMLElement]|',
        'style^[HTMLElement]|!disabled,media,type',
        'caption^[HTMLElement]|align',
        'th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width',
        'col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width',
        'table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width',
        'tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign',
        'tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign',
        'template^[HTMLElement]|',
        'textarea^[HTMLElement]|autocapitalize,autocomplete,!autofocus,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap',
        'title^[HTMLElement]|text',
        'track^[HTMLElement]|!default,kind,label,src,srclang',
        'ul^[HTMLElement]|!compact,type',
        'unknown^[HTMLElement]|',
        'video^media|#height,poster,#width',
        ':svg:a^:svg:graphics|',
        ':svg:animate^:svg:animation|',
        ':svg:animateMotion^:svg:animation|',
        ':svg:animateTransform^:svg:animation|',
        ':svg:circle^:svg:geometry|',
        ':svg:clipPath^:svg:graphics|',
        ':svg:defs^:svg:graphics|',
        ':svg:desc^:svg:|',
        ':svg:discard^:svg:|',
        ':svg:ellipse^:svg:geometry|',
        ':svg:feBlend^:svg:|',
        ':svg:feColorMatrix^:svg:|',
        ':svg:feComponentTransfer^:svg:|',
        ':svg:feComposite^:svg:|',
        ':svg:feConvolveMatrix^:svg:|',
        ':svg:feDiffuseLighting^:svg:|',
        ':svg:feDisplacementMap^:svg:|',
        ':svg:feDistantLight^:svg:|',
        ':svg:feDropShadow^:svg:|',
        ':svg:feFlood^:svg:|',
        ':svg:feFuncA^:svg:componentTransferFunction|',
        ':svg:feFuncB^:svg:componentTransferFunction|',
        ':svg:feFuncG^:svg:componentTransferFunction|',
        ':svg:feFuncR^:svg:componentTransferFunction|',
        ':svg:feGaussianBlur^:svg:|',
        ':svg:feImage^:svg:|',
        ':svg:feMerge^:svg:|',
        ':svg:feMergeNode^:svg:|',
        ':svg:feMorphology^:svg:|',
        ':svg:feOffset^:svg:|',
        ':svg:fePointLight^:svg:|',
        ':svg:feSpecularLighting^:svg:|',
        ':svg:feSpotLight^:svg:|',
        ':svg:feTile^:svg:|',
        ':svg:feTurbulence^:svg:|',
        ':svg:filter^:svg:|',
        ':svg:foreignObject^:svg:graphics|',
        ':svg:g^:svg:graphics|',
        ':svg:image^:svg:graphics|',
        ':svg:line^:svg:geometry|',
        ':svg:linearGradient^:svg:gradient|',
        ':svg:mpath^:svg:|',
        ':svg:marker^:svg:|',
        ':svg:mask^:svg:|',
        ':svg:metadata^:svg:|',
        ':svg:path^:svg:geometry|',
        ':svg:pattern^:svg:|',
        ':svg:polygon^:svg:geometry|',
        ':svg:polyline^:svg:geometry|',
        ':svg:radialGradient^:svg:gradient|',
        ':svg:rect^:svg:geometry|',
        ':svg:svg^:svg:graphics|#currentScale,#zoomAndPan',
        ':svg:script^:svg:|type',
        ':svg:set^:svg:animation|',
        ':svg:stop^:svg:|',
        ':svg:style^:svg:|!disabled,media,title,type',
        ':svg:switch^:svg:graphics|',
        ':svg:symbol^:svg:|',
        ':svg:tspan^:svg:textPositioning|',
        ':svg:text^:svg:textPositioning|',
        ':svg:textPath^:svg:textContent|',
        ':svg:title^:svg:|',
        ':svg:use^:svg:graphics|',
        ':svg:view^:svg:|#zoomAndPan',
        'data^[HTMLElement]|value',
        'keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name',
        'menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default',
        'summary^[HTMLElement]|',
        'time^[HTMLElement]|dateTime',
        ':svg:cursor^:svg:|',
    ];
    var _ATTR_TO_PROP = {
        'class': 'className',
        'for': 'htmlFor',
        'formaction': 'formAction',
        'innerHtml': 'innerHTML',
        'readonly': 'readOnly',
        'tabindex': 'tabIndex',
    };
    // Invert _ATTR_TO_PROP.
    var _PROP_TO_ATTR = Object.keys(_ATTR_TO_PROP).reduce(function (inverted, attr) {
        inverted[_ATTR_TO_PROP[attr]] = attr;
        return inverted;
    }, {});
    var DomElementSchemaRegistry = /** @class */ (function (_super) {
        tslib_1.__extends(DomElementSchemaRegistry, _super);
        function DomElementSchemaRegistry() {
            var _this = _super.call(this) || this;
            _this._schema = {};
            SCHEMA.forEach(function (encodedType) {
                var type = {};
                var _a = tslib_1.__read(encodedType.split('|'), 2), strType = _a[0], strProperties = _a[1];
                var properties = strProperties.split(',');
                var _b = tslib_1.__read(strType.split('^'), 2), typeNames = _b[0], superName = _b[1];
                typeNames.split(',').forEach(function (tag) { return _this._schema[tag.toLowerCase()] = type; });
                var superType = superName && _this._schema[superName.toLowerCase()];
                if (superType) {
                    Object.keys(superType).forEach(function (prop) {
                        type[prop] = superType[prop];
                    });
                }
                properties.forEach(function (property) {
                    if (property.length > 0) {
                        switch (property[0]) {
                            case '*':
                                // We don't yet support events.
                                // If ever allowing to bind to events, GO THROUGH A SECURITY REVIEW, allowing events
                                // will
                                // almost certainly introduce bad XSS vulnerabilities.
                                // type[property.substring(1)] = EVENT;
                                break;
                            case '!':
                                type[property.substring(1)] = BOOLEAN;
                                break;
                            case '#':
                                type[property.substring(1)] = NUMBER;
                                break;
                            case '%':
                                type[property.substring(1)] = OBJECT;
                                break;
                            default:
                                type[property] = STRING;
                        }
                    }
                });
            });
            return _this;
        }
        DomElementSchemaRegistry.prototype.hasProperty = function (tagName, propName, schemaMetas) {
            if (schemaMetas.some(function (schema) { return schema.name === core_1.NO_ERRORS_SCHEMA.name; })) {
                return true;
            }
            if (tagName.indexOf('-') > -1) {
                if (tags_1.isNgContainer(tagName) || tags_1.isNgContent(tagName)) {
                    return false;
                }
                if (schemaMetas.some(function (schema) { return schema.name === core_1.CUSTOM_ELEMENTS_SCHEMA.name; })) {
                    // Can't tell now as we don't know which properties a custom element will get
                    // once it is instantiated
                    return true;
                }
            }
            var elementProperties = this._schema[tagName.toLowerCase()] || this._schema['unknown'];
            return !!elementProperties[propName];
        };
        DomElementSchemaRegistry.prototype.hasElement = function (tagName, schemaMetas) {
            if (schemaMetas.some(function (schema) { return schema.name === core_1.NO_ERRORS_SCHEMA.name; })) {
                return true;
            }
            if (tagName.indexOf('-') > -1) {
                if (tags_1.isNgContainer(tagName) || tags_1.isNgContent(tagName)) {
                    return true;
                }
                if (schemaMetas.some(function (schema) { return schema.name === core_1.CUSTOM_ELEMENTS_SCHEMA.name; })) {
                    // Allow any custom elements
                    return true;
                }
            }
            return !!this._schema[tagName.toLowerCase()];
        };
        /**
         * securityContext returns the security context for the given property on the given DOM tag.
         *
         * Tag and property name are statically known and cannot change at runtime, i.e. it is not
         * possible to bind a value into a changing attribute or tag name.
         *
         * The filtering is based on a list of allowed tags|attributes. All attributes in the schema
         * above are assumed to have the 'NONE' security context, i.e. that they are safe inert
         * string values. Only specific well known attack vectors are assigned their appropriate context.
         */
        DomElementSchemaRegistry.prototype.securityContext = function (tagName, propName, isAttribute) {
            if (isAttribute) {
                // NB: For security purposes, use the mapped property name, not the attribute name.
                propName = this.getMappedPropName(propName);
            }
            // Make sure comparisons are case insensitive, so that case differences between attribute and
            // property names do not have a security impact.
            tagName = tagName.toLowerCase();
            propName = propName.toLowerCase();
            var ctx = dom_security_schema_1.SECURITY_SCHEMA()[tagName + '|' + propName];
            if (ctx) {
                return ctx;
            }
            ctx = dom_security_schema_1.SECURITY_SCHEMA()['*|' + propName];
            return ctx ? ctx : core_1.SecurityContext.NONE;
        };
        DomElementSchemaRegistry.prototype.getMappedPropName = function (propName) {
            return _ATTR_TO_PROP[propName] || propName;
        };
        DomElementSchemaRegistry.prototype.getDefaultComponentElementName = function () {
            return 'ng-component';
        };
        DomElementSchemaRegistry.prototype.validateProperty = function (name) {
            if (name.toLowerCase().startsWith('on')) {
                var msg = "Binding to event property '" + name + "' is disallowed for security reasons, " +
                    ("please use (" + name.slice(2) + ")=...") +
                    ("\nIf '" + name + "' is a directive input, make sure the directive is imported by the") +
                    " current module.";
                return { error: true, msg: msg };
            }
            else {
                return { error: false };
            }
        };
        DomElementSchemaRegistry.prototype.validateAttribute = function (name) {
            if (name.toLowerCase().startsWith('on')) {
                var msg = "Binding to event attribute '" + name + "' is disallowed for security reasons, " +
                    ("please use (" + name.slice(2) + ")=...");
                return { error: true, msg: msg };
            }
            else {
                return { error: false };
            }
        };
        DomElementSchemaRegistry.prototype.allKnownElementNames = function () {
            return Object.keys(this._schema);
        };
        DomElementSchemaRegistry.prototype.allKnownAttributesOfElement = function (tagName) {
            var elementProperties = this._schema[tagName.toLowerCase()] || this._schema['unknown'];
            // Convert properties to attributes.
            return Object.keys(elementProperties).map(function (prop) { var _a; return (_a = _PROP_TO_ATTR[prop]) !== null && _a !== void 0 ? _a : prop; });
        };
        DomElementSchemaRegistry.prototype.normalizeAnimationStyleProperty = function (propName) {
            return util_1.dashCaseToCamelCase(propName);
        };
        DomElementSchemaRegistry.prototype.normalizeAnimationStyleValue = function (camelCaseProp, userProvidedProp, val) {
            var unit = '';
            var strVal = val.toString().trim();
            var errorMsg = null;
            if (_isPixelDimensionStyle(camelCaseProp) && val !== 0 && val !== '0') {
                if (typeof val === 'number') {
                    unit = 'px';
                }
                else {
                    var valAndSuffixMatch = val.match(/^[+-]?[\d\.]+([a-z]*)$/);
                    if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
                        errorMsg = "Please provide a CSS unit value for " + userProvidedProp + ":" + val;
                    }
                }
            }
            return { error: errorMsg, value: strVal + unit };
        };
        return DomElementSchemaRegistry;
    }(element_schema_registry_1.ElementSchemaRegistry));
    exports.DomElementSchemaRegistry = DomElementSchemaRegistry;
    function _isPixelDimensionStyle(prop) {
        switch (prop) {
            case 'width':
            case 'height':
            case 'minWidth':
            case 'minHeight':
            case 'maxWidth':
            case 'maxHeight':
            case 'left':
            case 'top':
            case 'bottom':
            case 'right':
            case 'fontSize':
            case 'outlineWidth':
            case 'outlineOffset':
            case 'paddingTop':
            case 'paddingLeft':
            case 'paddingBottom':
            case 'paddingRight':
            case 'marginTop':
            case 'marginLeft':
            case 'marginBottom':
            case 'marginRight':
            case 'borderRadius':
            case 'borderWidth':
            case 'borderTopWidth':
            case 'borderLeftWidth':
            case 'borderRightWidth':
            case 'borderBottomWidth':
            case 'textIndent':
                return true;
            default:
                return false;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX2VsZW1lbnRfc2NoZW1hX3JlZ2lzdHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3NjaGVtYS9kb21fZWxlbWVudF9zY2hlbWFfcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUVILG1EQUFrRztJQUVsRyw2REFBNkQ7SUFDN0QsbURBQTRDO0lBRTVDLHdGQUFzRDtJQUN0RCxnR0FBZ0U7SUFFaEUsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0lBQzFCLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztJQUN4QixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7SUFDeEIsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO0lBRXhCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXlDRztJQUVILG9HQUFvRztJQUNwRyxvR0FBb0c7SUFDcEcsb0dBQW9HO0lBQ3BHLG9HQUFvRztJQUNwRyxvR0FBb0c7SUFDcEcsRUFBRTtJQUNGLCtFQUErRTtJQUMvRSxFQUFFO0lBQ0Ysa0dBQWtHO0lBQ2xHLHFFQUFxRTtJQUNyRSxFQUFFO0lBQ0Ysb0dBQW9HO0lBRXBHLElBQU0sTUFBTSxHQUFhO1FBQ3ZCLGdPQUFnTztZQUM1Tiw4Q0FBOEM7WUFDOUMsa0tBQWtLO1FBQ3RLLHExQkFBcTFCO1FBQ3IxQixvZ0NBQW9nQztRQUNwZ0MsK05BQStOO1FBQy9OLDB1QkFBMHVCO1FBQzF1QixzQkFBc0I7UUFDdEIsMENBQTBDO1FBQzFDLHNCQUFzQjtRQUN0Qix1Q0FBdUM7UUFDdkMsc0JBQXNCO1FBQ3RCLGlDQUFpQztRQUNqQyx3Q0FBd0M7UUFDeEMsa0xBQWtMO1FBQ2xMLDZKQUE2SjtRQUM3SixjQUFjO1FBQ2Qsd0JBQXdCO1FBQ3hCLGdDQUFnQztRQUNoQyxnUUFBZ1E7UUFDaFEsd0hBQXdI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QWtMckMsU0FBUyxzQkFBc0IsQ0FBQyxJQUFZO1FBQzFDLFFBQVEsSUFBSSxFQUFFO1lBQ1osS0FBSyxPQUFPLENBQUM7WUFDYixLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssVUFBVSxDQUFDO1lBQ2hCLEtBQUssV0FBVyxDQUFDO1lBQ2pCLEtBQUssVUFBVSxDQUFDO1lBQ2hCLEtBQUssV0FBVyxDQUFDO1lBQ2pCLEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxLQUFLLENBQUM7WUFDWCxLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxVQUFVLENBQUM7WUFDaEIsS0FBSyxjQUFjLENBQUM7WUFDcEIsS0FBSyxlQUFlLENBQUM7WUFDckIsS0FBSyxZQUFZLENBQUM7WUFDbEIsS0FBSyxhQUFhLENBQUM7WUFDbkIsS0FBSyxlQUFlLENBQUM7WUFDckIsS0FBSyxjQUFjLENBQUM7WUFDcEIsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxZQUFZLENBQUM7WUFDbEIsS0FBSyxjQUFjLENBQUM7WUFDcEIsS0FBSyxhQUFhLENBQUM7WUFDbkIsS0FBSyxjQUFjLENBQUM7WUFDcEIsS0FBSyxhQUFhLENBQUM7WUFDbkIsS0FBSyxnQkFBZ0IsQ0FBQztZQUN0QixLQUFLLGlCQUFpQixDQUFDO1lBQ3ZCLEtBQUssa0JBQWtCLENBQUM7WUFDeEIsS0FBSyxtQkFBbUIsQ0FBQztZQUN6QixLQUFLLFlBQVk7Z0JBQ2YsT0FBTyxJQUFJLENBQUM7WUFFZDtnQkFDRSxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDVVNUT01fRUxFTUVOVFNfU0NIRU1BLCBOT19FUlJPUlNfU0NIRU1BLCBTY2hlbWFNZXRhZGF0YSwgU2VjdXJpdHlDb250ZXh0fSBmcm9tICcuLi9jb3JlJztcblxuaW1wb3J0IHtpc05nQ29udGFpbmVyLCBpc05nQ29udGVudH0gZnJvbSAnLi4vbWxfcGFyc2VyL3RhZ3MnO1xuaW1wb3J0IHtkYXNoQ2FzZVRvQ2FtZWxDYXNlfSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtTRUNVUklUWV9TQ0hFTUF9IGZyb20gJy4vZG9tX3NlY3VyaXR5X3NjaGVtYSc7XG5pbXBvcnQge0VsZW1lbnRTY2hlbWFSZWdpc3RyeX0gZnJvbSAnLi9lbGVtZW50X3NjaGVtYV9yZWdpc3RyeSc7XG5cbmNvbnN0IEJPT0xFQU4gPSAnYm9vbGVhbic7XG5jb25zdCBOVU1CRVIgPSAnbnVtYmVyJztcbmNvbnN0IFNUUklORyA9ICdzdHJpbmcnO1xuY29uc3QgT0JKRUNUID0gJ29iamVjdCc7XG5cbi8qKlxuICogVGhpcyBhcnJheSByZXByZXNlbnRzIHRoZSBET00gc2NoZW1hLiBJdCBlbmNvZGVzIGluaGVyaXRhbmNlLCBwcm9wZXJ0aWVzLCBhbmQgZXZlbnRzLlxuICpcbiAqICMjIE92ZXJ2aWV3XG4gKlxuICogRWFjaCBsaW5lIHJlcHJlc2VudHMgb25lIGtpbmQgb2YgZWxlbWVudC4gVGhlIGBlbGVtZW50X2luaGVyaXRhbmNlYCBhbmQgcHJvcGVydGllcyBhcmUgam9pbmVkXG4gKiB1c2luZyBgZWxlbWVudF9pbmhlcml0YW5jZXxwcm9wZXJ0aWVzYCBzeW50YXguXG4gKlxuICogIyMgRWxlbWVudCBJbmhlcml0YW5jZVxuICpcbiAqIFRoZSBgZWxlbWVudF9pbmhlcml0YW5jZWAgY2FuIGJlIGZ1cnRoZXIgc3ViZGl2aWRlZCBhcyBgZWxlbWVudDEsZWxlbWVudDIsLi4uXnBhcmVudEVsZW1lbnRgLlxuICogSGVyZSB0aGUgaW5kaXZpZHVhbCBlbGVtZW50cyBhcmUgc2VwYXJhdGVkIGJ5IGAsYCAoY29tbWFzKS4gRXZlcnkgZWxlbWVudCBpbiB0aGUgbGlzdFxuICogaGFzIGlkZW50aWNhbCBwcm9wZXJ0aWVzLlxuICpcbiAqIEFuIGBlbGVtZW50YCBtYXkgaW5oZXJpdCBhZGRpdGlvbmFsIHByb3BlcnRpZXMgZnJvbSBgcGFyZW50RWxlbWVudGAgSWYgbm8gYF5wYXJlbnRFbGVtZW50YCBpc1xuICogc3BlY2lmaWVkIHRoZW4gYFwiXCJgIChibGFuaykgZWxlbWVudCBpcyBhc3N1bWVkLlxuICpcbiAqIE5PVEU6IFRoZSBibGFuayBlbGVtZW50IGluaGVyaXRzIGZyb20gcm9vdCBgW0VsZW1lbnRdYCBlbGVtZW50LCB0aGUgc3VwZXIgZWxlbWVudCBvZiBhbGxcbiAqIGVsZW1lbnRzLlxuICpcbiAqIE5PVEUgYW4gZWxlbWVudCBwcmVmaXggc3VjaCBhcyBgOnN2ZzpgIGhhcyBubyBzcGVjaWFsIG1lYW5pbmcgdG8gdGhlIHNjaGVtYS5cbiAqXG4gKiAjIyBQcm9wZXJ0aWVzXG4gKlxuICogRWFjaCBlbGVtZW50IGhhcyBhIHNldCBvZiBwcm9wZXJ0aWVzIHNlcGFyYXRlZCBieSBgLGAgKGNvbW1hcykuIEVhY2ggcHJvcGVydHkgY2FuIGJlIHByZWZpeGVkXG4gKiBieSBhIHNwZWNpYWwgY2hhcmFjdGVyIGRlc2lnbmF0aW5nIGl0cyB0eXBlOlxuICpcbiAqIC0gKG5vIHByZWZpeCk6IHByb3BlcnR5IGlzIGEgc3RyaW5nLlxuICogLSBgKmA6IHByb3BlcnR5IHJlcHJlc2VudHMgYW4gZXZlbnQuXG4gKiAtIGAhYDogcHJvcGVydHkgaXMgYSBib29sZWFuLlxuICogLSBgI2A6IHByb3BlcnR5IGlzIGEgbnVtYmVyLlxuICogLSBgJWA6IHByb3BlcnR5IGlzIGFuIG9iamVjdC5cbiAqXG4gKiAjIyBRdWVyeVxuICpcbiAqIFRoZSBjbGFzcyBjcmVhdGVzIGFuIGludGVybmFsIHNxdWFzIHJlcHJlc2VudGF0aW9uIHdoaWNoIGFsbG93cyB0byBlYXNpbHkgYW5zd2VyIHRoZSBxdWVyeSBvZlxuICogaWYgYSBnaXZlbiBwcm9wZXJ0eSBleGlzdCBvbiBhIGdpdmVuIGVsZW1lbnQuXG4gKlxuICogTk9URTogV2UgZG9uJ3QgeWV0IHN1cHBvcnQgcXVlcnlpbmcgZm9yIHR5cGVzIG9yIGV2ZW50cy5cbiAqIE5PVEU6IFRoaXMgc2NoZW1hIGlzIGF1dG8gZXh0cmFjdGVkIGZyb20gYHNjaGVtYV9leHRyYWN0b3IudHNgIGxvY2F0ZWQgaW4gdGhlIHRlc3QgZm9sZGVyLFxuICogICAgICAgc2VlIGRvbV9lbGVtZW50X3NjaGVtYV9yZWdpc3RyeV9zcGVjLnRzXG4gKi9cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT0gUyBUIE8gUCAgIC0gIFMgVCBPIFAgICAtICBTIFQgTyBQICAgLSAgUyBUIE8gUCAgIC0gIFMgVCBPIFAgICAtICBTIFQgTyBQICA9PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICBETyBOT1QgRURJVCBUSElTIERPTSBTQ0hFTUEgV0lUSE9VVCBBIFNFQ1VSSVRZIFJFVklFVyFcbi8vXG4vLyBOZXdseSBhZGRlZCBwcm9wZXJ0aWVzIG11c3QgYmUgc2VjdXJpdHkgcmV2aWV3ZWQgYW5kIGFzc2lnbmVkIGFuIGFwcHJvcHJpYXRlIFNlY3VyaXR5Q29udGV4dCBpblxuLy8gZG9tX3NlY3VyaXR5X3NjaGVtYS50cy4gUmVhY2ggb3V0IHRvIG1wcm9ic3QgJiByamFtZXQgZm9yIGRldGFpbHMuXG4vL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTQ0hFTUE6IHN0cmluZ1tdID0gW1xuICAnW0VsZW1lbnRdfHRleHRDb250ZW50LCVjbGFzc0xpc3QsY2xhc3NOYW1lLGlkLGlubmVySFRNTCwqYmVmb3JlY29weSwqYmVmb3JlY3V0LCpiZWZvcmVwYXN0ZSwqY29weSwqY3V0LCpwYXN0ZSwqc2VhcmNoLCpzZWxlY3RzdGFydCwqd2Via2l0ZnVsbHNjcmVlbmNoYW5nZSwqd2Via2l0ZnVsbHNjcmVlbmVycm9yLCp3aGVlbCxvdXRlckhUTUwsI3Njcm9sbExlZnQsI3Njcm9sbFRvcCxzbG90JyArXG4gICAgICAvKiBhZGRlZCBtYW51YWxseSB0byBhdm9pZCBicmVha2luZyBjaGFuZ2VzICovXG4gICAgICAnLCptZXNzYWdlLCptb3pmdWxsc2NyZWVuY2hhbmdlLCptb3pmdWxsc2NyZWVuZXJyb3IsKm1venBvaW50ZXJsb2NrY2hhbmdlLCptb3pwb2ludGVybG9ja2Vycm9yLCp3ZWJnbGNvbnRleHRjcmVhdGlvbmVycm9yLCp3ZWJnbGNvbnRleHRsb3N0LCp3ZWJnbGNvbnRleHRyZXN0b3JlZCcsXG4gICdbSFRNTEVsZW1lbnRdXltFbGVtZW50XXxhY2Nlc3NLZXksY29udGVudEVkaXRhYmxlLGRpciwhZHJhZ2dhYmxlLCFoaWRkZW4saW5uZXJUZXh0LGxhbmcsKmFib3J0LCphdXhjbGljaywqYmx1ciwqY2FuY2VsLCpjYW5wbGF5LCpjYW5wbGF5dGhyb3VnaCwqY2hhbmdlLCpjbGljaywqY2xvc2UsKmNvbnRleHRtZW51LCpjdWVjaGFuZ2UsKmRibGNsaWNrLCpkcmFnLCpkcmFnZW5kLCpkcmFnZW50ZXIsKmRyYWdsZWF2ZSwqZHJhZ292ZXIsKmRyYWdzdGFydCwqZHJvcCwqZHVyYXRpb25jaGFuZ2UsKmVtcHRpZWQsKmVuZGVkLCplcnJvciwqZm9jdXMsKmdvdHBvaW50ZXJjYXB0dXJlLCppbnB1dCwqaW52YWxpZCwqa2V5ZG93biwqa2V5cHJlc3MsKmtleXVwLCpsb2FkLCpsb2FkZWRkYXRhLCpsb2FkZWRtZXRhZGF0YSwqbG9hZHN0YXJ0LCpsb3N0cG9pbnRlcmNhcHR1cmUsKm1vdXNlZG93biwqbW91c2VlbnRlciwqbW91c2VsZWF2ZSwqbW91c2Vtb3ZlLCptb3VzZW91dCwqbW91c2VvdmVyLCptb3VzZXVwLCptb3VzZXdoZWVsLCpwYXVzZSwqcGxheSwqcGxheWluZywqcG9pbnRlcmNhbmNlbCwqcG9pbnRlcmRvd24sKnBvaW50ZXJlbnRlciwqcG9pbnRlcmxlYXZlLCpwb2ludGVybW92ZSwqcG9pbnRlcm91dCwqcG9pbnRlcm92ZXIsKnBvaW50ZXJ1cCwqcHJvZ3Jlc3MsKnJhdGVjaGFuZ2UsKnJlc2V0LCpyZXNpemUsKnNjcm9sbCwqc2Vla2VkLCpzZWVraW5nLCpzZWxlY3QsKnNob3csKnN0YWxsZWQsKnN1Ym1pdCwqc3VzcGVuZCwqdGltZXVwZGF0ZSwqdG9nZ2xlLCp2b2x1bWVjaGFuZ2UsKndhaXRpbmcsb3V0ZXJUZXh0LCFzcGVsbGNoZWNrLCVzdHlsZSwjdGFiSW5kZXgsdGl0bGUsIXRyYW5zbGF0ZScsXG4gICdhYmJyLGFkZHJlc3MsYXJ0aWNsZSxhc2lkZSxiLGJkaSxiZG8sY2l0ZSxjb2RlLGRkLGRmbixkdCxlbSxmaWdjYXB0aW9uLGZpZ3VyZSxmb290ZXIsaGVhZGVyLGksa2JkLG1haW4sbWFyayxuYXYsbm9zY3JpcHQscmIscnAscnQscnRjLHJ1YnkscyxzYW1wLHNlY3Rpb24sc21hbGwsc3Ryb25nLHN1YixzdXAsdSx2YXIsd2JyXltIVE1MRWxlbWVudF18YWNjZXNzS2V5LGNvbnRlbnRFZGl0YWJsZSxkaXIsIWRyYWdnYWJsZSwhaGlkZGVuLGlubmVyVGV4dCxsYW5nLCphYm9ydCwqYXV4Y2xpY2ssKmJsdXIsKmNhbmNlbCwqY2FucGxheSwqY2FucGxheXRocm91Z2gsKmNoYW5nZSwqY2xpY2ssKmNsb3NlLCpjb250ZXh0bWVudSwqY3VlY2hhbmdlLCpkYmxjbGljaywqZHJhZywqZHJhZ2VuZCwqZHJhZ2VudGVyLCpkcmFnbGVhdmUsKmRyYWdvdmVyLCpkcmFnc3RhcnQsKmRyb3AsKmR1cmF0aW9uY2hhbmdlLCplbXB0aWVkLCplbmRlZCwqZXJyb3IsKmZvY3VzLCpnb3Rwb2ludGVyY2FwdHVyZSwqaW5wdXQsKmludmFsaWQsKmtleWRvd24sKmtleXByZXNzLCprZXl1cCwqbG9hZCwqbG9hZGVkZGF0YSwqbG9hZGVkbWV0YWRhdGEsKmxvYWRzdGFydCwqbG9zdHBvaW50ZXJjYXB0dXJlLCptb3VzZWRvd24sKm1vdXNlZW50ZXIsKm1vdXNlbGVhdmUsKm1vdXNlbW92ZSwqbW91c2VvdXQsKm1vdXNlb3ZlciwqbW91c2V1cCwqbW91c2V3aGVlbCwqcGF1c2UsKnBsYXksKnBsYXlpbmcsKnBvaW50ZXJjYW5jZWwsKnBvaW50ZXJkb3duLCpwb2ludGVyZW50ZXIsKnBvaW50ZXJsZWF2ZSwqcG9pbnRlcm1vdmUsKnBvaW50ZXJvdXQsKnBvaW50ZXJvdmVyLCpwb2ludGVydXAsKnByb2dyZXNzLCpyYXRlY2hhbmdlLCpyZXNldCwqcmVzaXplLCpzY3JvbGwsKnNlZWtlZCwqc2Vla2luZywqc2VsZWN0LCpzaG93LCpzdGFsbGVkLCpzdWJtaXQsKnN1c3BlbmQsKnRpbWV1cGRhdGUsKnRvZ2dsZSwqdm9sdW1lY2hhbmdlLCp3YWl0aW5nLG91dGVyVGV4dCwhc3BlbGxjaGVjaywlc3R5bGUsI3RhYkluZGV4LHRpdGxlLCF0cmFuc2xhdGUnLFxuICAnbWVkaWFeW0hUTUxFbGVtZW50XXwhYXV0b3BsYXksIWNvbnRyb2xzLCVjb250cm9sc0xpc3QsJWNyb3NzT3JpZ2luLCNjdXJyZW50VGltZSwhZGVmYXVsdE11dGVkLCNkZWZhdWx0UGxheWJhY2tSYXRlLCFkaXNhYmxlUmVtb3RlUGxheWJhY2ssIWxvb3AsIW11dGVkLCplbmNyeXB0ZWQsKndhaXRpbmdmb3JrZXksI3BsYXliYWNrUmF0ZSxwcmVsb2FkLHNyYywlc3JjT2JqZWN0LCN2b2x1bWUnLFxuICAnOnN2ZzpeW0hUTUxFbGVtZW50XXwqYWJvcnQsKmF1eGNsaWNrLCpibHVyLCpjYW5jZWwsKmNhbnBsYXksKmNhbnBsYXl0aHJvdWdoLCpjaGFuZ2UsKmNsaWNrLCpjbG9zZSwqY29udGV4dG1lbnUsKmN1ZWNoYW5nZSwqZGJsY2xpY2ssKmRyYWcsKmRyYWdlbmQsKmRyYWdlbnRlciwqZHJhZ2xlYXZlLCpkcmFnb3ZlciwqZHJhZ3N0YXJ0LCpkcm9wLCpkdXJhdGlvbmNoYW5nZSwqZW1wdGllZCwqZW5kZWQsKmVycm9yLCpmb2N1cywqZ290cG9pbnRlcmNhcHR1cmUsKmlucHV0LCppbnZhbGlkLCprZXlkb3duLCprZXlwcmVzcywqa2V5dXAsKmxvYWQsKmxvYWRlZGRhdGEsKmxvYWRlZG1ldGFkYXRhLCpsb2Fkc3RhcnQsKmxvc3Rwb2ludGVyY2FwdHVyZSwqbW91c2Vkb3duLCptb3VzZWVudGVyLCptb3VzZWxlYXZlLCptb3VzZW1vdmUsKm1vdXNlb3V0LCptb3VzZW92ZXIsKm1vdXNldXAsKm1vdXNld2hlZWwsKnBhdXNlLCpwbGF5LCpwbGF5aW5nLCpwb2ludGVyY2FuY2VsLCpwb2ludGVyZG93biwqcG9pbnRlcmVudGVyLCpwb2ludGVybGVhdmUsKnBvaW50ZXJtb3ZlLCpwb2ludGVyb3V0LCpwb2ludGVyb3ZlciwqcG9pbnRlcnVwLCpwcm9ncmVzcywqcmF0ZWNoYW5nZSwqcmVzZXQsKnJlc2l6ZSwqc2Nyb2xsLCpzZWVrZWQsKnNlZWtpbmcsKnNlbGVjdCwqc2hvdywqc3RhbGxlZCwqc3VibWl0LCpzdXNwZW5kLCp0aW1ldXBkYXRlLCp0b2dnbGUsKnZvbHVtZWNoYW5nZSwqd2FpdGluZywlc3R5bGUsI3RhYkluZGV4JyxcbiAgJzpzdmc6Z3JhcGhpY3NeOnN2Zzp8JyxcbiAgJzpzdmc6YW5pbWF0aW9uXjpzdmc6fCpiZWdpbiwqZW5kLCpyZXBlYXQnLFxuICAnOnN2ZzpnZW9tZXRyeV46c3ZnOnwnLFxuICAnOnN2Zzpjb21wb25lbnRUcmFuc2ZlckZ1bmN0aW9uXjpzdmc6fCcsXG4gICc6c3ZnOmdyYWRpZW50Xjpzdmc6fCcsXG4gICc6c3ZnOnRleHRDb250ZW50Xjpzdmc6Z3JhcGhpY3N8JyxcbiAgJzpzdmc6dGV4dFBvc2l0aW9uaW5nXjpzdmc6dGV4dENvbnRlbnR8JyxcbiAgJ2FeW0hUTUxFbGVtZW50XXxjaGFyc2V0LGNvb3Jkcyxkb3dubG9hZCxoYXNoLGhvc3QsaG9zdG5hbWUsaHJlZixocmVmbGFuZyxuYW1lLHBhc3N3b3JkLHBhdGhuYW1lLHBpbmcscG9ydCxwcm90b2NvbCxyZWZlcnJlclBvbGljeSxyZWwscmV2LHNlYXJjaCxzaGFwZSx0YXJnZXQsdGV4dCx0eXBlLHVzZXJuYW1lJyxcbiAgJ2FyZWFeW0hUTUxFbGVtZW50XXxhbHQsY29vcmRzLGRvd25sb2FkLGhhc2gsaG9zdCxob3N0bmFtZSxocmVmLCFub0hyZWYscGFzc3dvcmQscGF0aG5hbWUscGluZyxwb3J0LHByb3RvY29sLHJlZmVycmVyUG9saWN5LHJlbCxzZWFyY2gsc2hhcGUsdGFyZ2V0LHVzZXJuYW1lJyxcbiAgJ2F1ZGlvXm1lZGlhfCcsXG4gICdicl5bSFRNTEVsZW1lbnRdfGNsZWFyJyxcbiAgJ2Jhc2VeW0hUTUxFbGVtZW50XXxocmVmLHRhcmdldCcsXG4gICdib2R5XltIVE1MRWxlbWVudF18YUxpbmssYmFja2dyb3VuZCxiZ0NvbG9yLGxpbmssKmJlZm9yZXVubG9hZCwqYmx1ciwqZXJyb3IsKmZvY3VzLCpoYXNoY2hhbmdlLCpsYW5ndWFnZWNoYW5nZSwqbG9hZCwqbWVzc2FnZSwqb2ZmbGluZSwqb25saW5lLCpwYWdlaGlkZSwqcGFnZXNob3csKnBvcHN0YXRlLCpyZWplY3Rpb25oYW5kbGVkLCpyZXNpemUsKnNjcm9sbCwqc3RvcmFnZSwqdW5oYW5kbGVkcmVqZWN0aW9uLCp1bmxvYWQsdGV4dCx2TGluaycsXG4gICdidXR0b25eW0hUTUxFbGVtZW50XXwhYXV0b2ZvY3VzLCFkaXNhYmxlZCxmb3JtQWN0aW9uLGZvcm1FbmN0eXBlLGZvcm1NZXRob2QsIWZvcm1Ob1ZhbGlkYXRlLGZvcm1UYXJnZXQsbmFtZSx0eXBlLHZhbHVlJyxcbiAgJ2NhbnZhc15bSFRNTEVsZW1lbnRdfCNoZWlnaHQsI3dpZHRoJyxcbiAgJ2NvbnRlbnReW0hUTUxFbGVtZW50XXxzZWxlY3QnLFxuICAnZGxeW0hUTUxFbGVtZW50XXwhY29tcGFjdCcsXG4gICdkYXRhbGlzdF5bSFRNTEVsZW1lbnRdfCcsXG4gICdkZXRhaWxzXltIVE1MRWxlbWVudF18IW9wZW4nLFxuICAnZGlhbG9nXltIVE1MRWxlbWVudF18IW9wZW4scmV0dXJuVmFsdWUnLFxuICAnZGlyXltIVE1MRWxlbWVudF18IWNvbXBhY3QnLFxuICAnZGl2XltIVE1MRWxlbWVudF18YWxpZ24nLFxuICAnZW1iZWReW0hUTUxFbGVtZW50XXxhbGlnbixoZWlnaHQsbmFtZSxzcmMsdHlwZSx3aWR0aCcsXG4gICdmaWVsZHNldF5bSFRNTEVsZW1lbnRdfCFkaXNhYmxlZCxuYW1lJyxcbiAgJ2ZvbnReW0hUTUxFbGVtZW50XXxjb2xvcixmYWNlLHNpemUnLFxuICAnZm9ybV5bSFRNTEVsZW1lbnRdfGFjY2VwdENoYXJzZXQsYWN0aW9uLGF1dG9jb21wbGV0ZSxlbmNvZGluZyxlbmN0eXBlLG1ldGhvZCxuYW1lLCFub1ZhbGlkYXRlLHRhcmdldCcsXG4gICdmcmFtZV5bSFRNTEVsZW1lbnRdfGZyYW1lQm9yZGVyLGxvbmdEZXNjLG1hcmdpbkhlaWdodCxtYXJnaW5XaWR0aCxuYW1lLCFub1Jlc2l6ZSxzY3JvbGxpbmcsc3JjJyxcbiAgJ2ZyYW1lc2V0XltIVE1MRWxlbWVudF18Y29scywqYmVmb3JldW5sb2FkLCpibHVyLCplcnJvciwqZm9jdXMsKmhhc2hjaGFuZ2UsKmxhbmd1YWdlY2hhbmdlLCpsb2FkLCptZXNzYWdlLCpvZmZsaW5lLCpvbmxpbmUsKnBhZ2VoaWRlLCpwYWdlc2hvdywqcG9wc3RhdGUsKnJlamVjdGlvbmhhbmRsZWQsKnJlc2l6ZSwqc2Nyb2xsLCpzdG9yYWdlLCp1bmhhbmRsZWRyZWplY3Rpb24sKnVubG9hZCxyb3dzJyxcbiAgJ2hyXltIVE1MRWxlbWVudF18YWxpZ24sY29sb3IsIW5vU2hhZGUsc2l6ZSx3aWR0aCcsXG4gICdoZWFkXltIVE1MRWxlbWVudF18JyxcbiAgJ2gxLGgyLGgzLGg0LGg1LGg2XltIVE1MRWxlbWVudF18YWxpZ24nLFxuICAnaHRtbF5bSFRNTEVsZW1lbnRdfHZlcnNpb24nLFxuICAnaWZyYW1lXltIVE1MRWxlbWVudF18YWxpZ24sIWFsbG93RnVsbHNjcmVlbixmcmFtZUJvcmRlcixoZWlnaHQsbG9uZ0Rlc2MsbWFyZ2luSGVpZ2h0LG1hcmdpbldpZHRoLG5hbWUscmVmZXJyZXJQb2xpY3ksJXNhbmRib3gsc2Nyb2xsaW5nLHNyYyxzcmNkb2Msd2lkdGgnLFxuICAnaW1nXltIVE1MRWxlbWVudF18YWxpZ24sYWx0LGJvcmRlciwlY3Jvc3NPcmlnaW4sI2hlaWdodCwjaHNwYWNlLCFpc01hcCxsb25nRGVzYyxsb3dzcmMsbmFtZSxyZWZlcnJlclBvbGljeSxzaXplcyxzcmMsc3Jjc2V0LHVzZU1hcCwjdnNwYWNlLCN3aWR0aCcsXG4gICdpbnB1dF5bSFRNTEVsZW1lbnRdfGFjY2VwdCxhbGlnbixhbHQsYXV0b2NhcGl0YWxpemUsYXV0b2NvbXBsZXRlLCFhdXRvZm9jdXMsIWNoZWNrZWQsIWRlZmF1bHRDaGVja2VkLGRlZmF1bHRWYWx1ZSxkaXJOYW1lLCFkaXNhYmxlZCwlZmlsZXMsZm9ybUFjdGlvbixmb3JtRW5jdHlwZSxmb3JtTWV0aG9kLCFmb3JtTm9WYWxpZGF0ZSxmb3JtVGFyZ2V0LCNoZWlnaHQsIWluY3JlbWVudGFsLCFpbmRldGVybWluYXRlLG1heCwjbWF4TGVuZ3RoLG1pbiwjbWluTGVuZ3RoLCFtdWx0aXBsZSxuYW1lLHBhdHRlcm4scGxhY2Vob2xkZXIsIXJlYWRPbmx5LCFyZXF1aXJlZCxzZWxlY3Rpb25EaXJlY3Rpb24sI3NlbGVjdGlvbkVuZCwjc2VsZWN0aW9uU3RhcnQsI3NpemUsc3JjLHN0ZXAsdHlwZSx1c2VNYXAsdmFsdWUsJXZhbHVlQXNEYXRlLCN2YWx1ZUFzTnVtYmVyLCN3aWR0aCcsXG4gICdsaV5bSFRNTEVsZW1lbnRdfHR5cGUsI3ZhbHVlJyxcbiAgJ2xhYmVsXltIVE1MRWxlbWVudF18aHRtbEZvcicsXG4gICdsZWdlbmReW0hUTUxFbGVtZW50XXxhbGlnbicsXG4gICdsaW5rXltIVE1MRWxlbWVudF18YXMsY2hhcnNldCwlY3Jvc3NPcmlnaW4sIWRpc2FibGVkLGhyZWYsaHJlZmxhbmcsaW50ZWdyaXR5LG1lZGlhLHJlZmVycmVyUG9saWN5LHJlbCwlcmVsTGlzdCxyZXYsJXNpemVzLHRhcmdldCx0eXBlJyxcbiAgJ21hcF5bSFRNTEVsZW1lbnRdfG5hbWUnLFxuICAnbWFycXVlZV5bSFRNTEVsZW1lbnRdfGJlaGF2aW9yLGJnQ29sb3IsZGlyZWN0aW9uLGhlaWdodCwjaHNwYWNlLCNsb29wLCNzY3JvbGxBbW91bnQsI3Njcm9sbERlbGF5LCF0cnVlU3BlZWQsI3ZzcGFjZSx3aWR0aCcsXG4gICdtZW51XltIVE1MRWxlbWVudF18IWNvbXBhY3QnLFxuICAnbWV0YV5bSFRNTEVsZW1lbnRdfGNvbnRlbnQsaHR0cEVxdWl2LG5hbWUsc2NoZW1lJyxcbiAgJ21ldGVyXltIVE1MRWxlbWVudF18I2hpZ2gsI2xvdywjbWF4LCNtaW4sI29wdGltdW0sI3ZhbHVlJyxcbiAgJ2lucyxkZWxeW0hUTUxFbGVtZW50XXxjaXRlLGRhdGVUaW1lJyxcbiAgJ29sXltIVE1MRWxlbWVudF18IWNvbXBhY3QsIXJldmVyc2VkLCNzdGFydCx0eXBlJyxcbiAgJ29iamVjdF5bSFRNTEVsZW1lbnRdfGFsaWduLGFyY2hpdmUsYm9yZGVyLGNvZGUsY29kZUJhc2UsY29kZVR5cGUsZGF0YSwhZGVjbGFyZSxoZWlnaHQsI2hzcGFjZSxuYW1lLHN0YW5kYnksdHlwZSx1c2VNYXAsI3ZzcGFjZSx3aWR0aCcsXG4gICdvcHRncm91cF5bSFRNTEVsZW1lbnRdfCFkaXNhYmxlZCxsYWJlbCcsXG4gICdvcHRpb25eW0hUTUxFbGVtZW50XXwhZGVmYXVsdFNlbGVjdGVkLCFkaXNhYmxlZCxsYWJlbCwhc2VsZWN0ZWQsdGV4dCx2YWx1ZScsXG4gICdvdXRwdXReW0hUTUxFbGVtZW50XXxkZWZhdWx0VmFsdWUsJWh0bWxGb3IsbmFtZSx2YWx1ZScsXG4gICdwXltIVE1MRWxlbWVudF18YWxpZ24nLFxuICAncGFyYW1eW0hUTUxFbGVtZW50XXxuYW1lLHR5cGUsdmFsdWUsdmFsdWVUeXBlJyxcbiAgJ3BpY3R1cmVeW0hUTUxFbGVtZW50XXwnLFxuICAncHJlXltIVE1MRWxlbWVudF18I3dpZHRoJyxcbiAgJ3Byb2dyZXNzXltIVE1MRWxlbWVudF18I21heCwjdmFsdWUnLFxuICAncSxibG9ja3F1b3RlLGNpdGVeW0hUTUxFbGVtZW50XXwnLFxuICAnc2NyaXB0XltIVE1MRWxlbWVudF18IWFzeW5jLGNoYXJzZXQsJWNyb3NzT3JpZ2luLCFkZWZlcixldmVudCxodG1sRm9yLGludGVncml0eSxzcmMsdGV4dCx0eXBlJyxcbiAgJ3NlbGVjdF5bSFRNTEVsZW1lbnRdfGF1dG9jb21wbGV0ZSwhYXV0b2ZvY3VzLCFkaXNhYmxlZCwjbGVuZ3RoLCFtdWx0aXBsZSxuYW1lLCFyZXF1aXJlZCwjc2VsZWN0ZWRJbmRleCwjc2l6ZSx2YWx1ZScsXG4gICdzaGFkb3deW0hUTUxFbGVtZW50XXwnLFxuICAnc2xvdF5bSFRNTEVsZW1lbnRdfG5hbWUnLFxuICAnc291cmNlXltIVE1MRWxlbWVudF18bWVkaWEsc2l6ZXMsc3JjLHNyY3NldCx0eXBlJyxcbiAgJ3NwYW5eW0hUTUxFbGVtZW50XXwnLFxuICAnc3R5bGVeW0hUTUxFbGVtZW50XXwhZGlzYWJsZWQsbWVkaWEsdHlwZScsXG4gICdjYXB0aW9uXltIVE1MRWxlbWVudF18YWxpZ24nLFxuICAndGgsdGReW0hUTUxFbGVtZW50XXxhYmJyLGFsaWduLGF4aXMsYmdDb2xvcixjaCxjaE9mZiwjY29sU3BhbixoZWFkZXJzLGhlaWdodCwhbm9XcmFwLCNyb3dTcGFuLHNjb3BlLHZBbGlnbix3aWR0aCcsXG4gICdjb2wsY29sZ3JvdXBeW0hUTUxFbGVtZW50XXxhbGlnbixjaCxjaE9mZiwjc3Bhbix2QWxpZ24sd2lkdGgnLFxuICAndGFibGVeW0hUTUxFbGVtZW50XXxhbGlnbixiZ0NvbG9yLGJvcmRlciwlY2FwdGlvbixjZWxsUGFkZGluZyxjZWxsU3BhY2luZyxmcmFtZSxydWxlcyxzdW1tYXJ5LCV0Rm9vdCwldEhlYWQsd2lkdGgnLFxuICAndHJeW0hUTUxFbGVtZW50XXxhbGlnbixiZ0NvbG9yLGNoLGNoT2ZmLHZBbGlnbicsXG4gICd0Zm9vdCx0aGVhZCx0Ym9keV5bSFRNTEVsZW1lbnRdfGFsaWduLGNoLGNoT2ZmLHZBbGlnbicsXG4gICd0ZW1wbGF0ZV5bSFRNTEVsZW1lbnRdfCcsXG4gICd0ZXh0YXJlYV5bSFRNTEVsZW1lbnRdfGF1dG9jYXBpdGFsaXplLGF1dG9jb21wbGV0ZSwhYXV0b2ZvY3VzLCNjb2xzLGRlZmF1bHRWYWx1ZSxkaXJOYW1lLCFkaXNhYmxlZCwjbWF4TGVuZ3RoLCNtaW5MZW5ndGgsbmFtZSxwbGFjZWhvbGRlciwhcmVhZE9ubHksIXJlcXVpcmVkLCNyb3dzLHNlbGVjdGlvbkRpcmVjdGlvbiwjc2VsZWN0aW9uRW5kLCNzZWxlY3Rpb25TdGFydCx2YWx1ZSx3cmFwJyxcbiAgJ3RpdGxlXltIVE1MRWxlbWVudF18dGV4dCcsXG4gICd0cmFja15bSFRNTEVsZW1lbnRdfCFkZWZhdWx0LGtpbmQsbGFiZWwsc3JjLHNyY2xhbmcnLFxuICAndWxeW0hUTUxFbGVtZW50XXwhY29tcGFjdCx0eXBlJyxcbiAgJ3Vua25vd25eW0hUTUxFbGVtZW50XXwnLFxuICAndmlkZW9ebWVkaWF8I2hlaWdodCxwb3N0ZXIsI3dpZHRoJyxcbiAgJzpzdmc6YV46c3ZnOmdyYXBoaWNzfCcsXG4gICc6c3ZnOmFuaW1hdGVeOnN2ZzphbmltYXRpb258JyxcbiAgJzpzdmc6YW5pbWF0ZU1vdGlvbl46c3ZnOmFuaW1hdGlvbnwnLFxuICAnOnN2ZzphbmltYXRlVHJhbnNmb3JtXjpzdmc6YW5pbWF0aW9ufCcsXG4gICc6c3ZnOmNpcmNsZV46c3ZnOmdlb21ldHJ5fCcsXG4gICc6c3ZnOmNsaXBQYXRoXjpzdmc6Z3JhcGhpY3N8JyxcbiAgJzpzdmc6ZGVmc146c3ZnOmdyYXBoaWNzfCcsXG4gICc6c3ZnOmRlc2NeOnN2Zzp8JyxcbiAgJzpzdmc6ZGlzY2FyZF46c3ZnOnwnLFxuICAnOnN2ZzplbGxpcHNlXjpzdmc6Z2VvbWV0cnl8JyxcbiAgJzpzdmc6ZmVCbGVuZF46c3ZnOnwnLFxuICAnOnN2ZzpmZUNvbG9yTWF0cml4Xjpzdmc6fCcsXG4gICc6c3ZnOmZlQ29tcG9uZW50VHJhbnNmZXJeOnN2Zzp8JyxcbiAgJzpzdmc6ZmVDb21wb3NpdGVeOnN2Zzp8JyxcbiAgJzpzdmc6ZmVDb252b2x2ZU1hdHJpeF46c3ZnOnwnLFxuICAnOnN2ZzpmZURpZmZ1c2VMaWdodGluZ146c3ZnOnwnLFxuICAnOnN2ZzpmZURpc3BsYWNlbWVudE1hcF46c3ZnOnwnLFxuICAnOnN2ZzpmZURpc3RhbnRMaWdodF46c3ZnOnwnLFxuICAnOnN2ZzpmZURyb3BTaGFkb3deOnN2Zzp8JyxcbiAgJzpzdmc6ZmVGbG9vZF46c3ZnOnwnLFxuICAnOnN2ZzpmZUZ1bmNBXjpzdmc6Y29tcG9uZW50VHJhbnNmZXJGdW5jdGlvbnwnLFxuICAnOnN2ZzpmZUZ1bmNCXjpzdmc6Y29tcG9uZW50VHJhbnNmZXJGdW5jdGlvbnwnLFxuICAnOnN2ZzpmZUZ1bmNHXjpzdmc6Y29tcG9uZW50VHJhbnNmZXJGdW5jdGlvbnwnLFxuICAnOnN2ZzpmZUZ1bmNSXjpzdmc6Y29tcG9uZW50VHJhbnNmZXJGdW5jdGlvbnwnLFxuICAnOnN2ZzpmZUdhdXNzaWFuQmx1cl46c3ZnOnwnLFxuICAnOnN2ZzpmZUltYWdlXjpzdmc6fCcsXG4gICc6c3ZnOmZlTWVyZ2VeOnN2Zzp8JyxcbiAgJzpzdmc6ZmVNZXJnZU5vZGVeOnN2Zzp8JyxcbiAgJzpzdmc6ZmVNb3JwaG9sb2d5Xjpzdmc6fCcsXG4gICc6c3ZnOmZlT2Zmc2V0Xjpzdmc6fCcsXG4gICc6c3ZnOmZlUG9pbnRMaWdodF46c3ZnOnwnLFxuICAnOnN2ZzpmZVNwZWN1bGFyTGlnaHRpbmdeOnN2Zzp8JyxcbiAgJzpzdmc6ZmVTcG90TGlnaHReOnN2Zzp8JyxcbiAgJzpzdmc6ZmVUaWxlXjpzdmc6fCcsXG4gICc6c3ZnOmZlVHVyYnVsZW5jZV46c3ZnOnwnLFxuICAnOnN2ZzpmaWx0ZXJeOnN2Zzp8JyxcbiAgJzpzdmc6Zm9yZWlnbk9iamVjdF46c3ZnOmdyYXBoaWNzfCcsXG4gICc6c3ZnOmdeOnN2ZzpncmFwaGljc3wnLFxuICAnOnN2ZzppbWFnZV46c3ZnOmdyYXBoaWNzfCcsXG4gICc6c3ZnOmxpbmVeOnN2ZzpnZW9tZXRyeXwnLFxuICAnOnN2ZzpsaW5lYXJHcmFkaWVudF46c3ZnOmdyYWRpZW50fCcsXG4gICc6c3ZnOm1wYXRoXjpzdmc6fCcsXG4gICc6c3ZnOm1hcmtlcl46c3ZnOnwnLFxuICAnOnN2ZzptYXNrXjpzdmc6fCcsXG4gICc6c3ZnOm1ldGFkYXRhXjpzdmc6fCcsXG4gICc6c3ZnOnBhdGheOnN2ZzpnZW9tZXRyeXwnLFxuICAnOnN2ZzpwYXR0ZXJuXjpzdmc6fCcsXG4gICc6c3ZnOnBvbHlnb25eOnN2ZzpnZW9tZXRyeXwnLFxuICAnOnN2Zzpwb2x5bGluZV46c3ZnOmdlb21ldHJ5fCcsXG4gICc6c3ZnOnJhZGlhbEdyYWRpZW50Xjpzdmc6Z3JhZGllbnR8JyxcbiAgJzpzdmc6cmVjdF46c3ZnOmdlb21ldHJ5fCcsXG4gICc6c3ZnOnN2Z146c3ZnOmdyYXBoaWNzfCNjdXJyZW50U2NhbGUsI3pvb21BbmRQYW4nLFxuICAnOnN2ZzpzY3JpcHReOnN2Zzp8dHlwZScsXG4gICc6c3ZnOnNldF46c3ZnOmFuaW1hdGlvbnwnLFxuICAnOnN2ZzpzdG9wXjpzdmc6fCcsXG4gICc6c3ZnOnN0eWxlXjpzdmc6fCFkaXNhYmxlZCxtZWRpYSx0aXRsZSx0eXBlJyxcbiAgJzpzdmc6c3dpdGNoXjpzdmc6Z3JhcGhpY3N8JyxcbiAgJzpzdmc6c3ltYm9sXjpzdmc6fCcsXG4gICc6c3ZnOnRzcGFuXjpzdmc6dGV4dFBvc2l0aW9uaW5nfCcsXG4gICc6c3ZnOnRleHReOnN2Zzp0ZXh0UG9zaXRpb25pbmd8JyxcbiAgJzpzdmc6dGV4dFBhdGheOnN2Zzp0ZXh0Q29udGVudHwnLFxuICAnOnN2Zzp0aXRsZV46c3ZnOnwnLFxuICAnOnN2Zzp1c2VeOnN2ZzpncmFwaGljc3wnLFxuICAnOnN2Zzp2aWV3Xjpzdmc6fCN6b29tQW5kUGFuJyxcbiAgJ2RhdGFeW0hUTUxFbGVtZW50XXx2YWx1ZScsXG4gICdrZXlnZW5eW0hUTUxFbGVtZW50XXwhYXV0b2ZvY3VzLGNoYWxsZW5nZSwhZGlzYWJsZWQsZm9ybSxrZXl0eXBlLG5hbWUnLFxuICAnbWVudWl0ZW1eW0hUTUxFbGVtZW50XXx0eXBlLGxhYmVsLGljb24sIWRpc2FibGVkLCFjaGVja2VkLHJhZGlvZ3JvdXAsIWRlZmF1bHQnLFxuICAnc3VtbWFyeV5bSFRNTEVsZW1lbnRdfCcsXG4gICd0aW1lXltIVE1MRWxlbWVudF18ZGF0ZVRpbWUnLFxuICAnOnN2ZzpjdXJzb3JeOnN2Zzp8Jyxcbl07XG5cbmNvbnN0IF9BVFRSX1RPX1BST1A6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSA9IHtcbiAgJ2NsYXNzJzogJ2NsYXNzTmFtZScsXG4gICdmb3InOiAnaHRtbEZvcicsXG4gICdmb3JtYWN0aW9uJzogJ2Zvcm1BY3Rpb24nLFxuICAnaW5uZXJIdG1sJzogJ2lubmVySFRNTCcsXG4gICdyZWFkb25seSc6ICdyZWFkT25seScsXG4gICd0YWJpbmRleCc6ICd0YWJJbmRleCcsXG59O1xuXG4vLyBJbnZlcnQgX0FUVFJfVE9fUFJPUC5cbmNvbnN0IF9QUk9QX1RPX0FUVFI6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSA9XG4gICAgT2JqZWN0LmtleXMoX0FUVFJfVE9fUFJPUCkucmVkdWNlKChpbnZlcnRlZCwgYXR0cikgPT4ge1xuICAgICAgaW52ZXJ0ZWRbX0FUVFJfVE9fUFJPUFthdHRyXV0gPSBhdHRyO1xuICAgICAgcmV0dXJuIGludmVydGVkO1xuICAgIH0sIHt9IGFzIHtbcHJvcDogc3RyaW5nXTogc3RyaW5nfSk7XG5cbmV4cG9ydCBjbGFzcyBEb21FbGVtZW50U2NoZW1hUmVnaXN0cnkgZXh0ZW5kcyBFbGVtZW50U2NoZW1hUmVnaXN0cnkge1xuICBwcml2YXRlIF9zY2hlbWE6IHtbZWxlbWVudDogc3RyaW5nXToge1twcm9wZXJ0eTogc3RyaW5nXTogc3RyaW5nfX0gPSB7fTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIFNDSEVNQS5mb3JFYWNoKGVuY29kZWRUeXBlID0+IHtcbiAgICAgIGNvbnN0IHR5cGU6IHtbcHJvcGVydHk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICAgIGNvbnN0IFtzdHJUeXBlLCBzdHJQcm9wZXJ0aWVzXSA9IGVuY29kZWRUeXBlLnNwbGl0KCd8Jyk7XG4gICAgICBjb25zdCBwcm9wZXJ0aWVzID0gc3RyUHJvcGVydGllcy5zcGxpdCgnLCcpO1xuICAgICAgY29uc3QgW3R5cGVOYW1lcywgc3VwZXJOYW1lXSA9IHN0clR5cGUuc3BsaXQoJ14nKTtcbiAgICAgIHR5cGVOYW1lcy5zcGxpdCgnLCcpLmZvckVhY2godGFnID0+IHRoaXMuX3NjaGVtYVt0YWcudG9Mb3dlckNhc2UoKV0gPSB0eXBlKTtcbiAgICAgIGNvbnN0IHN1cGVyVHlwZSA9IHN1cGVyTmFtZSAmJiB0aGlzLl9zY2hlbWFbc3VwZXJOYW1lLnRvTG93ZXJDYXNlKCldO1xuICAgICAgaWYgKHN1cGVyVHlwZSkge1xuICAgICAgICBPYmplY3Qua2V5cyhzdXBlclR5cGUpLmZvckVhY2goKHByb3A6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHR5cGVbcHJvcF0gPSBzdXBlclR5cGVbcHJvcF07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcHJvcGVydGllcy5mb3JFYWNoKChwcm9wZXJ0eTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmIChwcm9wZXJ0eS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc3dpdGNoIChwcm9wZXJ0eVswXSkge1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgIC8vIFdlIGRvbid0IHlldCBzdXBwb3J0IGV2ZW50cy5cbiAgICAgICAgICAgICAgLy8gSWYgZXZlciBhbGxvd2luZyB0byBiaW5kIHRvIGV2ZW50cywgR08gVEhST1VHSCBBIFNFQ1VSSVRZIFJFVklFVywgYWxsb3dpbmcgZXZlbnRzXG4gICAgICAgICAgICAgIC8vIHdpbGxcbiAgICAgICAgICAgICAgLy8gYWxtb3N0IGNlcnRhaW5seSBpbnRyb2R1Y2UgYmFkIFhTUyB2dWxuZXJhYmlsaXRpZXMuXG4gICAgICAgICAgICAgIC8vIHR5cGVbcHJvcGVydHkuc3Vic3RyaW5nKDEpXSA9IEVWRU5UO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgICB0eXBlW3Byb3BlcnR5LnN1YnN0cmluZygxKV0gPSBCT09MRUFOO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyMnOlxuICAgICAgICAgICAgICB0eXBlW3Byb3BlcnR5LnN1YnN0cmluZygxKV0gPSBOVU1CRVI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnJSc6XG4gICAgICAgICAgICAgIHR5cGVbcHJvcGVydHkuc3Vic3RyaW5nKDEpXSA9IE9CSkVDVDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICB0eXBlW3Byb3BlcnR5XSA9IFNUUklORztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgb3ZlcnJpZGUgaGFzUHJvcGVydHkodGFnTmFtZTogc3RyaW5nLCBwcm9wTmFtZTogc3RyaW5nLCBzY2hlbWFNZXRhczogU2NoZW1hTWV0YWRhdGFbXSk6IGJvb2xlYW4ge1xuICAgIGlmIChzY2hlbWFNZXRhcy5zb21lKChzY2hlbWEpID0+IHNjaGVtYS5uYW1lID09PSBOT19FUlJPUlNfU0NIRU1BLm5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGFnTmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgaWYgKGlzTmdDb250YWluZXIodGFnTmFtZSkgfHwgaXNOZ0NvbnRlbnQodGFnTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2NoZW1hTWV0YXMuc29tZSgoc2NoZW1hKSA9PiBzY2hlbWEubmFtZSA9PT0gQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQS5uYW1lKSkge1xuICAgICAgICAvLyBDYW4ndCB0ZWxsIG5vdyBhcyB3ZSBkb24ndCBrbm93IHdoaWNoIHByb3BlcnRpZXMgYSBjdXN0b20gZWxlbWVudCB3aWxsIGdldFxuICAgICAgICAvLyBvbmNlIGl0IGlzIGluc3RhbnRpYXRlZFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50UHJvcGVydGllcyA9IHRoaXMuX3NjaGVtYVt0YWdOYW1lLnRvTG93ZXJDYXNlKCldIHx8IHRoaXMuX3NjaGVtYVsndW5rbm93biddO1xuICAgIHJldHVybiAhIWVsZW1lbnRQcm9wZXJ0aWVzW3Byb3BOYW1lXTtcbiAgfVxuXG4gIG92ZXJyaWRlIGhhc0VsZW1lbnQodGFnTmFtZTogc3RyaW5nLCBzY2hlbWFNZXRhczogU2NoZW1hTWV0YWRhdGFbXSk6IGJvb2xlYW4ge1xuICAgIGlmIChzY2hlbWFNZXRhcy5zb21lKChzY2hlbWEpID0+IHNjaGVtYS5uYW1lID09PSBOT19FUlJPUlNfU0NIRU1BLm5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGFnTmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgaWYgKGlzTmdDb250YWluZXIodGFnTmFtZSkgfHwgaXNOZ0NvbnRlbnQodGFnTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY2hlbWFNZXRhcy5zb21lKChzY2hlbWEpID0+IHNjaGVtYS5uYW1lID09PSBDVVNUT01fRUxFTUVOVFNfU0NIRU1BLm5hbWUpKSB7XG4gICAgICAgIC8vIEFsbG93IGFueSBjdXN0b20gZWxlbWVudHNcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICEhdGhpcy5fc2NoZW1hW3RhZ05hbWUudG9Mb3dlckNhc2UoKV07XG4gIH1cblxuICAvKipcbiAgICogc2VjdXJpdHlDb250ZXh0IHJldHVybnMgdGhlIHNlY3VyaXR5IGNvbnRleHQgZm9yIHRoZSBnaXZlbiBwcm9wZXJ0eSBvbiB0aGUgZ2l2ZW4gRE9NIHRhZy5cbiAgICpcbiAgICogVGFnIGFuZCBwcm9wZXJ0eSBuYW1lIGFyZSBzdGF0aWNhbGx5IGtub3duIGFuZCBjYW5ub3QgY2hhbmdlIGF0IHJ1bnRpbWUsIGkuZS4gaXQgaXMgbm90XG4gICAqIHBvc3NpYmxlIHRvIGJpbmQgYSB2YWx1ZSBpbnRvIGEgY2hhbmdpbmcgYXR0cmlidXRlIG9yIHRhZyBuYW1lLlxuICAgKlxuICAgKiBUaGUgZmlsdGVyaW5nIGlzIGJhc2VkIG9uIGEgbGlzdCBvZiBhbGxvd2VkIHRhZ3N8YXR0cmlidXRlcy4gQWxsIGF0dHJpYnV0ZXMgaW4gdGhlIHNjaGVtYVxuICAgKiBhYm92ZSBhcmUgYXNzdW1lZCB0byBoYXZlIHRoZSAnTk9ORScgc2VjdXJpdHkgY29udGV4dCwgaS5lLiB0aGF0IHRoZXkgYXJlIHNhZmUgaW5lcnRcbiAgICogc3RyaW5nIHZhbHVlcy4gT25seSBzcGVjaWZpYyB3ZWxsIGtub3duIGF0dGFjayB2ZWN0b3JzIGFyZSBhc3NpZ25lZCB0aGVpciBhcHByb3ByaWF0ZSBjb250ZXh0LlxuICAgKi9cbiAgb3ZlcnJpZGUgc2VjdXJpdHlDb250ZXh0KHRhZ05hbWU6IHN0cmluZywgcHJvcE5hbWU6IHN0cmluZywgaXNBdHRyaWJ1dGU6IGJvb2xlYW4pOlxuICAgICAgU2VjdXJpdHlDb250ZXh0IHtcbiAgICBpZiAoaXNBdHRyaWJ1dGUpIHtcbiAgICAgIC8vIE5COiBGb3Igc2VjdXJpdHkgcHVycG9zZXMsIHVzZSB0aGUgbWFwcGVkIHByb3BlcnR5IG5hbWUsIG5vdCB0aGUgYXR0cmlidXRlIG5hbWUuXG4gICAgICBwcm9wTmFtZSA9IHRoaXMuZ2V0TWFwcGVkUHJvcE5hbWUocHJvcE5hbWUpO1xuICAgIH1cblxuICAgIC8vIE1ha2Ugc3VyZSBjb21wYXJpc29ucyBhcmUgY2FzZSBpbnNlbnNpdGl2ZSwgc28gdGhhdCBjYXNlIGRpZmZlcmVuY2VzIGJldHdlZW4gYXR0cmlidXRlIGFuZFxuICAgIC8vIHByb3BlcnR5IG5hbWVzIGRvIG5vdCBoYXZlIGEgc2VjdXJpdHkgaW1wYWN0LlxuICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgcHJvcE5hbWUgPSBwcm9wTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGxldCBjdHggPSBTRUNVUklUWV9TQ0hFTUEoKVt0YWdOYW1lICsgJ3wnICsgcHJvcE5hbWVdO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIHJldHVybiBjdHg7XG4gICAgfVxuICAgIGN0eCA9IFNFQ1VSSVRZX1NDSEVNQSgpWycqfCcgKyBwcm9wTmFtZV07XG4gICAgcmV0dXJuIGN0eCA/IGN0eCA6IFNlY3VyaXR5Q29udGV4dC5OT05FO1xuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0TWFwcGVkUHJvcE5hbWUocHJvcE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIF9BVFRSX1RPX1BST1BbcHJvcE5hbWVdIHx8IHByb3BOYW1lO1xuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0RGVmYXVsdENvbXBvbmVudEVsZW1lbnROYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICduZy1jb21wb25lbnQnO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmFsaWRhdGVQcm9wZXJ0eShuYW1lOiBzdHJpbmcpOiB7ZXJyb3I6IGJvb2xlYW4sIG1zZz86IHN0cmluZ30ge1xuICAgIGlmIChuYW1lLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnb24nKSkge1xuICAgICAgY29uc3QgbXNnID0gYEJpbmRpbmcgdG8gZXZlbnQgcHJvcGVydHkgJyR7bmFtZX0nIGlzIGRpc2FsbG93ZWQgZm9yIHNlY3VyaXR5IHJlYXNvbnMsIGAgK1xuICAgICAgICAgIGBwbGVhc2UgdXNlICgke25hbWUuc2xpY2UoMil9KT0uLi5gICtcbiAgICAgICAgICBgXFxuSWYgJyR7bmFtZX0nIGlzIGEgZGlyZWN0aXZlIGlucHV0LCBtYWtlIHN1cmUgdGhlIGRpcmVjdGl2ZSBpcyBpbXBvcnRlZCBieSB0aGVgICtcbiAgICAgICAgICBgIGN1cnJlbnQgbW9kdWxlLmA7XG4gICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtc2c6IG1zZ307XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7ZXJyb3I6IGZhbHNlfTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSB2YWxpZGF0ZUF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiB7ZXJyb3I6IGJvb2xlYW4sIG1zZz86IHN0cmluZ30ge1xuICAgIGlmIChuYW1lLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnb24nKSkge1xuICAgICAgY29uc3QgbXNnID0gYEJpbmRpbmcgdG8gZXZlbnQgYXR0cmlidXRlICcke25hbWV9JyBpcyBkaXNhbGxvd2VkIGZvciBzZWN1cml0eSByZWFzb25zLCBgICtcbiAgICAgICAgICBgcGxlYXNlIHVzZSAoJHtuYW1lLnNsaWNlKDIpfSk9Li4uYDtcbiAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1zZzogbXNnfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtlcnJvcjogZmFsc2V9O1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIGFsbEtub3duRWxlbWVudE5hbWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fc2NoZW1hKTtcbiAgfVxuXG4gIGFsbEtub3duQXR0cmlidXRlc09mRWxlbWVudCh0YWdOYW1lOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZWxlbWVudFByb3BlcnRpZXMgPSB0aGlzLl9zY2hlbWFbdGFnTmFtZS50b0xvd2VyQ2FzZSgpXSB8fCB0aGlzLl9zY2hlbWFbJ3Vua25vd24nXTtcbiAgICAvLyBDb252ZXJ0IHByb3BlcnRpZXMgdG8gYXR0cmlidXRlcy5cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZWxlbWVudFByb3BlcnRpZXMpLm1hcChwcm9wID0+IF9QUk9QX1RPX0FUVFJbcHJvcF0gPz8gcHJvcCk7XG4gIH1cblxuICBvdmVycmlkZSBub3JtYWxpemVBbmltYXRpb25TdHlsZVByb3BlcnR5KHByb3BOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBkYXNoQ2FzZVRvQ2FtZWxDYXNlKHByb3BOYW1lKTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5vcm1hbGl6ZUFuaW1hdGlvblN0eWxlVmFsdWUoXG4gICAgICBjYW1lbENhc2VQcm9wOiBzdHJpbmcsIHVzZXJQcm92aWRlZFByb3A6IHN0cmluZyxcbiAgICAgIHZhbDogc3RyaW5nfG51bWJlcik6IHtlcnJvcjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nfSB7XG4gICAgbGV0IHVuaXQ6IHN0cmluZyA9ICcnO1xuICAgIGNvbnN0IHN0clZhbCA9IHZhbC50b1N0cmluZygpLnRyaW0oKTtcbiAgICBsZXQgZXJyb3JNc2c6IHN0cmluZyA9IG51bGwhO1xuXG4gICAgaWYgKF9pc1BpeGVsRGltZW5zaW9uU3R5bGUoY2FtZWxDYXNlUHJvcCkgJiYgdmFsICE9PSAwICYmIHZhbCAhPT0gJzAnKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdW5pdCA9ICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWxBbmRTdWZmaXhNYXRjaCA9IHZhbC5tYXRjaCgvXlsrLV0/W1xcZFxcLl0rKFthLXpdKikkLyk7XG4gICAgICAgIGlmICh2YWxBbmRTdWZmaXhNYXRjaCAmJiB2YWxBbmRTdWZmaXhNYXRjaFsxXS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgIGVycm9yTXNnID0gYFBsZWFzZSBwcm92aWRlIGEgQ1NTIHVuaXQgdmFsdWUgZm9yICR7dXNlclByb3ZpZGVkUHJvcH06JHt2YWx9YDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge2Vycm9yOiBlcnJvck1zZywgdmFsdWU6IHN0clZhbCArIHVuaXR9O1xuICB9XG59XG5cbmZ1bmN0aW9uIF9pc1BpeGVsRGltZW5zaW9uU3R5bGUocHJvcDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHN3aXRjaCAocHJvcCkge1xuICAgIGNhc2UgJ3dpZHRoJzpcbiAgICBjYXNlICdoZWlnaHQnOlxuICAgIGNhc2UgJ21pbldpZHRoJzpcbiAgICBjYXNlICdtaW5IZWlnaHQnOlxuICAgIGNhc2UgJ21heFdpZHRoJzpcbiAgICBjYXNlICdtYXhIZWlnaHQnOlxuICAgIGNhc2UgJ2xlZnQnOlxuICAgIGNhc2UgJ3RvcCc6XG4gICAgY2FzZSAnYm90dG9tJzpcbiAgICBjYXNlICdyaWdodCc6XG4gICAgY2FzZSAnZm9udFNpemUnOlxuICAgIGNhc2UgJ291dGxpbmVXaWR0aCc6XG4gICAgY2FzZSAnb3V0bGluZU9mZnNldCc6XG4gICAgY2FzZSAncGFkZGluZ1RvcCc6XG4gICAgY2FzZSAncGFkZGluZ0xlZnQnOlxuICAgIGNhc2UgJ3BhZGRpbmdCb3R0b20nOlxuICAgIGNhc2UgJ3BhZGRpbmdSaWdodCc6XG4gICAgY2FzZSAnbWFyZ2luVG9wJzpcbiAgICBjYXNlICdtYXJnaW5MZWZ0JzpcbiAgICBjYXNlICdtYXJnaW5Cb3R0b20nOlxuICAgIGNhc2UgJ21hcmdpblJpZ2h0JzpcbiAgICBjYXNlICdib3JkZXJSYWRpdXMnOlxuICAgIGNhc2UgJ2JvcmRlcldpZHRoJzpcbiAgICBjYXNlICdib3JkZXJUb3BXaWR0aCc6XG4gICAgY2FzZSAnYm9yZGVyTGVmdFdpZHRoJzpcbiAgICBjYXNlICdib3JkZXJSaWdodFdpZHRoJzpcbiAgICBjYXNlICdib3JkZXJCb3R0b21XaWR0aCc6XG4gICAgY2FzZSAndGV4dEluZGVudCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==