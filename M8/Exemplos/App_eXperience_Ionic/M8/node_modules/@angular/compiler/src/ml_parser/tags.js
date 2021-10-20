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
        define("@angular/compiler/src/ml_parser/tags", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mergeNsAndName = exports.getNsPrefix = exports.isNgTemplate = exports.isNgContent = exports.isNgContainer = exports.splitNsName = exports.TagContentType = void 0;
    var TagContentType;
    (function (TagContentType) {
        TagContentType[TagContentType["RAW_TEXT"] = 0] = "RAW_TEXT";
        TagContentType[TagContentType["ESCAPABLE_RAW_TEXT"] = 1] = "ESCAPABLE_RAW_TEXT";
        TagContentType[TagContentType["PARSABLE_DATA"] = 2] = "PARSABLE_DATA";
    })(TagContentType = exports.TagContentType || (exports.TagContentType = {}));
    function splitNsName(elementName) {
        if (elementName[0] != ':') {
            return [null, elementName];
        }
        var colonIndex = elementName.indexOf(':', 1);
        if (colonIndex == -1) {
            throw new Error("Unsupported format \"" + elementName + "\" expecting \":namespace:name\"");
        }
        return [elementName.slice(1, colonIndex), elementName.slice(colonIndex + 1)];
    }
    exports.splitNsName = splitNsName;
    // `<ng-container>` tags work the same regardless the namespace
    function isNgContainer(tagName) {
        return splitNsName(tagName)[1] === 'ng-container';
    }
    exports.isNgContainer = isNgContainer;
    // `<ng-content>` tags work the same regardless the namespace
    function isNgContent(tagName) {
        return splitNsName(tagName)[1] === 'ng-content';
    }
    exports.isNgContent = isNgContent;
    // `<ng-template>` tags work the same regardless the namespace
    function isNgTemplate(tagName) {
        return splitNsName(tagName)[1] === 'ng-template';
    }
    exports.isNgTemplate = isNgTemplate;
    function getNsPrefix(fullName) {
        return fullName === null ? null : splitNsName(fullName)[0];
    }
    exports.getNsPrefix = getNsPrefix;
    function mergeNsAndName(prefix, localName) {
        return prefix ? ":" + prefix + ":" + localName : localName;
    }
    exports.mergeNsAndName = mergeNsAndName;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9tbF9wYXJzZXIvdGFncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCxJQUFZLGNBSVg7SUFKRCxXQUFZLGNBQWM7UUFDeEIsMkRBQVEsQ0FBQTtRQUNSLCtFQUFrQixDQUFBO1FBQ2xCLHFFQUFhLENBQUE7SUFDZixDQUFDLEVBSlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFJekI7SUFjRCxTQUFnQixXQUFXLENBQUMsV0FBbUI7UUFDN0MsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDNUI7UUFFRCxJQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUvQyxJQUFJLFVBQVUsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUF1QixXQUFXLHFDQUErQixDQUFDLENBQUM7U0FDcEY7UUFFRCxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBWkQsa0NBWUM7SUFFRCwrREFBK0Q7SUFDL0QsU0FBZ0IsYUFBYSxDQUFDLE9BQWU7UUFDM0MsT0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssY0FBYyxDQUFDO0lBQ3BELENBQUM7SUFGRCxzQ0FFQztJQUVELDZEQUE2RDtJQUM3RCxTQUFnQixXQUFXLENBQUMsT0FBZTtRQUN6QyxPQUFPLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUM7SUFDbEQsQ0FBQztJQUZELGtDQUVDO0lBRUQsOERBQThEO0lBQzlELFNBQWdCLFlBQVksQ0FBQyxPQUFlO1FBQzFDLE9BQU8sV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLGFBQWEsQ0FBQztJQUNuRCxDQUFDO0lBRkQsb0NBRUM7SUFJRCxTQUFnQixXQUFXLENBQUMsUUFBcUI7UUFDL0MsT0FBTyxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRkQsa0NBRUM7SUFFRCxTQUFnQixjQUFjLENBQUMsTUFBYyxFQUFFLFNBQWlCO1FBQzlELE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFJLE1BQU0sU0FBSSxTQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUN4RCxDQUFDO0lBRkQsd0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0IGVudW0gVGFnQ29udGVudFR5cGUge1xuICBSQVdfVEVYVCxcbiAgRVNDQVBBQkxFX1JBV19URVhULFxuICBQQVJTQUJMRV9EQVRBXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGFnRGVmaW5pdGlvbiB7XG4gIGNsb3NlZEJ5UGFyZW50OiBib29sZWFuO1xuICBpbXBsaWNpdE5hbWVzcGFjZVByZWZpeDogc3RyaW5nfG51bGw7XG4gIGlzVm9pZDogYm9vbGVhbjtcbiAgaWdub3JlRmlyc3RMZjogYm9vbGVhbjtcbiAgY2FuU2VsZkNsb3NlOiBib29sZWFuO1xuICBwcmV2ZW50TmFtZXNwYWNlSW5oZXJpdGFuY2U6IGJvb2xlYW47XG5cbiAgaXNDbG9zZWRCeUNoaWxkKG5hbWU6IHN0cmluZyk6IGJvb2xlYW47XG4gIGdldENvbnRlbnRUeXBlKHByZWZpeD86IHN0cmluZyk6IFRhZ0NvbnRlbnRUeXBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3BsaXROc05hbWUoZWxlbWVudE5hbWU6IHN0cmluZyk6IFtzdHJpbmd8bnVsbCwgc3RyaW5nXSB7XG4gIGlmIChlbGVtZW50TmFtZVswXSAhPSAnOicpIHtcbiAgICByZXR1cm4gW251bGwsIGVsZW1lbnROYW1lXTtcbiAgfVxuXG4gIGNvbnN0IGNvbG9uSW5kZXggPSBlbGVtZW50TmFtZS5pbmRleE9mKCc6JywgMSk7XG5cbiAgaWYgKGNvbG9uSW5kZXggPT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdCBcIiR7ZWxlbWVudE5hbWV9XCIgZXhwZWN0aW5nIFwiOm5hbWVzcGFjZTpuYW1lXCJgKTtcbiAgfVxuXG4gIHJldHVybiBbZWxlbWVudE5hbWUuc2xpY2UoMSwgY29sb25JbmRleCksIGVsZW1lbnROYW1lLnNsaWNlKGNvbG9uSW5kZXggKyAxKV07XG59XG5cbi8vIGA8bmctY29udGFpbmVyPmAgdGFncyB3b3JrIHRoZSBzYW1lIHJlZ2FyZGxlc3MgdGhlIG5hbWVzcGFjZVxuZXhwb3J0IGZ1bmN0aW9uIGlzTmdDb250YWluZXIodGFnTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBzcGxpdE5zTmFtZSh0YWdOYW1lKVsxXSA9PT0gJ25nLWNvbnRhaW5lcic7XG59XG5cbi8vIGA8bmctY29udGVudD5gIHRhZ3Mgd29yayB0aGUgc2FtZSByZWdhcmRsZXNzIHRoZSBuYW1lc3BhY2VcbmV4cG9ydCBmdW5jdGlvbiBpc05nQ29udGVudCh0YWdOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIHNwbGl0TnNOYW1lKHRhZ05hbWUpWzFdID09PSAnbmctY29udGVudCc7XG59XG5cbi8vIGA8bmctdGVtcGxhdGU+YCB0YWdzIHdvcmsgdGhlIHNhbWUgcmVnYXJkbGVzcyB0aGUgbmFtZXNwYWNlXG5leHBvcnQgZnVuY3Rpb24gaXNOZ1RlbXBsYXRlKHRhZ05hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gc3BsaXROc05hbWUodGFnTmFtZSlbMV0gPT09ICduZy10ZW1wbGF0ZSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROc1ByZWZpeChmdWxsTmFtZTogc3RyaW5nKTogc3RyaW5nO1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5zUHJlZml4KGZ1bGxOYW1lOiBudWxsKTogbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBnZXROc1ByZWZpeChmdWxsTmFtZTogc3RyaW5nfG51bGwpOiBzdHJpbmd8bnVsbCB7XG4gIHJldHVybiBmdWxsTmFtZSA9PT0gbnVsbCA/IG51bGwgOiBzcGxpdE5zTmFtZShmdWxsTmFtZSlbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU5zQW5kTmFtZShwcmVmaXg6IHN0cmluZywgbG9jYWxOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcHJlZml4ID8gYDoke3ByZWZpeH06JHtsb2NhbE5hbWV9YCA6IGxvY2FsTmFtZTtcbn1cbiJdfQ==