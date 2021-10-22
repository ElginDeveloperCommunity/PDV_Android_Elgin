/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HttpContext } from './context';
import { HttpHeaders } from './headers';
import { HttpParams } from './params';
/**
 * Determine whether the given HTTP method may include a body.
 */
function mightHaveBody(method) {
    switch (method) {
        case 'DELETE':
        case 'GET':
        case 'HEAD':
        case 'OPTIONS':
        case 'JSONP':
            return false;
        default:
            return true;
    }
}
/**
 * Safely assert whether the given value is an ArrayBuffer.
 *
 * In some execution environments ArrayBuffer is not defined.
 */
function isArrayBuffer(value) {
    return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;
}
/**
 * Safely assert whether the given value is a Blob.
 *
 * In some execution environments Blob is not defined.
 */
function isBlob(value) {
    return typeof Blob !== 'undefined' && value instanceof Blob;
}
/**
 * Safely assert whether the given value is a FormData instance.
 *
 * In some execution environments FormData is not defined.
 */
function isFormData(value) {
    return typeof FormData !== 'undefined' && value instanceof FormData;
}
/**
 * Safely assert whether the given value is a URLSearchParams instance.
 *
 * In some execution environments URLSearchParams is not defined.
 */
function isUrlSearchParams(value) {
    return typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams;
}
/**
 * An outgoing HTTP request with an optional typed body.
 *
 * `HttpRequest` represents an outgoing request, including URL, method,
 * headers, body, and other request configuration options. Instances should be
 * assumed to be immutable. To modify a `HttpRequest`, the `clone`
 * method should be used.
 *
 * @publicApi
 */
export class HttpRequest {
    constructor(method, url, third, fourth) {
        this.url = url;
        /**
         * The request body, or `null` if one isn't set.
         *
         * Bodies are not enforced to be immutable, as they can include a reference to any
         * user-defined data type. However, interceptors should take care to preserve
         * idempotence by treating them as such.
         */
        this.body = null;
        /**
         * Whether this request should be made in a way that exposes progress events.
         *
         * Progress events are expensive (change detection runs on each event) and so
         * they should only be requested if the consumer intends to monitor them.
         */
        this.reportProgress = false;
        /**
         * Whether this request should be sent with outgoing credentials (cookies).
         */
        this.withCredentials = false;
        /**
         * The expected response type of the server.
         *
         * This is used to parse the response appropriately before returning it to
         * the requestee.
         */
        this.responseType = 'json';
        this.method = method.toUpperCase();
        // Next, need to figure out which argument holds the HttpRequestInit
        // options, if any.
        let options;
        // Check whether a body argument is expected. The only valid way to omit
        // the body argument is to use a known no-body method like GET.
        if (mightHaveBody(this.method) || !!fourth) {
            // Body is the third argument, options are the fourth.
            this.body = (third !== undefined) ? third : null;
            options = fourth;
        }
        else {
            // No body required, options are the third argument. The body stays null.
            options = third;
        }
        // If options have been passed, interpret them.
        if (options) {
            // Normalize reportProgress and withCredentials.
            this.reportProgress = !!options.reportProgress;
            this.withCredentials = !!options.withCredentials;
            // Override default response type of 'json' if one is provided.
            if (!!options.responseType) {
                this.responseType = options.responseType;
            }
            // Override headers if they're provided.
            if (!!options.headers) {
                this.headers = options.headers;
            }
            if (!!options.context) {
                this.context = options.context;
            }
            if (!!options.params) {
                this.params = options.params;
            }
        }
        // If no headers have been passed in, construct a new HttpHeaders instance.
        if (!this.headers) {
            this.headers = new HttpHeaders();
        }
        // If no context have been passed in, construct a new HttpContext instance.
        if (!this.context) {
            this.context = new HttpContext();
        }
        // If no parameters have been passed in, construct a new HttpUrlEncodedParams instance.
        if (!this.params) {
            this.params = new HttpParams();
            this.urlWithParams = url;
        }
        else {
            // Encode the parameters to a string in preparation for inclusion in the URL.
            const params = this.params.toString();
            if (params.length === 0) {
                // No parameters, the visible URL is just the URL given at creation time.
                this.urlWithParams = url;
            }
            else {
                // Does the URL already have query parameters? Look for '?'.
                const qIdx = url.indexOf('?');
                // There are 3 cases to handle:
                // 1) No existing parameters -> append '?' followed by params.
                // 2) '?' exists and is followed by existing query string ->
                //    append '&' followed by params.
                // 3) '?' exists at the end of the url -> append params directly.
                // This basically amounts to determining the character, if any, with
                // which to join the URL and parameters.
                const sep = qIdx === -1 ? '?' : (qIdx < url.length - 1 ? '&' : '');
                this.urlWithParams = url + sep + params;
            }
        }
    }
    /**
     * Transform the free-form body into a serialized format suitable for
     * transmission to the server.
     */
    serializeBody() {
        // If no body is present, no need to serialize it.
        if (this.body === null) {
            return null;
        }
        // Check whether the body is already in a serialized form. If so,
        // it can just be returned directly.
        if (isArrayBuffer(this.body) || isBlob(this.body) || isFormData(this.body) ||
            isUrlSearchParams(this.body) || typeof this.body === 'string') {
            return this.body;
        }
        // Check whether the body is an instance of HttpUrlEncodedParams.
        if (this.body instanceof HttpParams) {
            return this.body.toString();
        }
        // Check whether the body is an object or array, and serialize with JSON if so.
        if (typeof this.body === 'object' || typeof this.body === 'boolean' ||
            Array.isArray(this.body)) {
            return JSON.stringify(this.body);
        }
        // Fall back on toString() for everything else.
        return this.body.toString();
    }
    /**
     * Examine the body and attempt to infer an appropriate MIME type
     * for it.
     *
     * If no such type can be inferred, this method will return `null`.
     */
    detectContentTypeHeader() {
        // An empty body has no content type.
        if (this.body === null) {
            return null;
        }
        // FormData bodies rely on the browser's content type assignment.
        if (isFormData(this.body)) {
            return null;
        }
        // Blobs usually have their own content type. If it doesn't, then
        // no type can be inferred.
        if (isBlob(this.body)) {
            return this.body.type || null;
        }
        // Array buffers have unknown contents and thus no type can be inferred.
        if (isArrayBuffer(this.body)) {
            return null;
        }
        // Technically, strings could be a form of JSON data, but it's safe enough
        // to assume they're plain strings.
        if (typeof this.body === 'string') {
            return 'text/plain';
        }
        // `HttpUrlEncodedParams` has its own content-type.
        if (this.body instanceof HttpParams) {
            return 'application/x-www-form-urlencoded;charset=UTF-8';
        }
        // Arrays, objects, boolean and numbers will be encoded as JSON.
        if (typeof this.body === 'object' || typeof this.body === 'number' ||
            typeof this.body === 'boolean') {
            return 'application/json';
        }
        // No type could be inferred.
        return null;
    }
    clone(update = {}) {
        var _a;
        // For method, url, and responseType, take the current value unless
        // it is overridden in the update hash.
        const method = update.method || this.method;
        const url = update.url || this.url;
        const responseType = update.responseType || this.responseType;
        // The body is somewhat special - a `null` value in update.body means
        // whatever current body is present is being overridden with an empty
        // body, whereas an `undefined` value in update.body implies no
        // override.
        const body = (update.body !== undefined) ? update.body : this.body;
        // Carefully handle the boolean options to differentiate between
        // `false` and `undefined` in the update args.
        const withCredentials = (update.withCredentials !== undefined) ? update.withCredentials : this.withCredentials;
        const reportProgress = (update.reportProgress !== undefined) ? update.reportProgress : this.reportProgress;
        // Headers and params may be appended to if `setHeaders` or
        // `setParams` are used.
        let headers = update.headers || this.headers;
        let params = update.params || this.params;
        // Pass on context if needed
        const context = (_a = update.context) !== null && _a !== void 0 ? _a : this.context;
        // Check whether the caller has asked to add headers.
        if (update.setHeaders !== undefined) {
            // Set every requested header.
            headers =
                Object.keys(update.setHeaders)
                    .reduce((headers, name) => headers.set(name, update.setHeaders[name]), headers);
        }
        // Check whether the caller has asked to set params.
        if (update.setParams) {
            // Set every requested param.
            params = Object.keys(update.setParams)
                .reduce((params, param) => params.set(param, update.setParams[param]), params);
        }
        // Finally, construct the new HttpRequest using the pieces from above.
        return new HttpRequest(method, url, body, {
            params,
            headers,
            context,
            reportProgress,
            responseType,
            withCredentials,
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9odHRwL3NyYy9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDdEMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUN0QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBaUJwQzs7R0FFRztBQUNILFNBQVMsYUFBYSxDQUFDLE1BQWM7SUFDbkMsUUFBUSxNQUFNLEVBQUU7UUFDZCxLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssS0FBSyxDQUFDO1FBQ1gsS0FBSyxNQUFNLENBQUM7UUFDWixLQUFLLFNBQVMsQ0FBQztRQUNmLEtBQUssT0FBTztZQUNWLE9BQU8sS0FBSyxDQUFDO1FBQ2Y7WUFDRSxPQUFPLElBQUksQ0FBQztLQUNmO0FBQ0gsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLGFBQWEsQ0FBQyxLQUFVO0lBQy9CLE9BQU8sT0FBTyxXQUFXLEtBQUssV0FBVyxJQUFJLEtBQUssWUFBWSxXQUFXLENBQUM7QUFDNUUsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLE1BQU0sQ0FBQyxLQUFVO0lBQ3hCLE9BQU8sT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLEtBQUssWUFBWSxJQUFJLENBQUM7QUFDOUQsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxLQUFVO0lBQzVCLE9BQU8sT0FBTyxRQUFRLEtBQUssV0FBVyxJQUFJLEtBQUssWUFBWSxRQUFRLENBQUM7QUFDdEUsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLGlCQUFpQixDQUFDLEtBQVU7SUFDbkMsT0FBTyxPQUFPLGVBQWUsS0FBSyxXQUFXLElBQUksS0FBSyxZQUFZLGVBQWUs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NEJBQTRCO1FBQzVCLE1BQU0sT0FBTyxHQUFHLE1BQUEsTUFBTSxDQUFDLE9BQU8sbUNBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUUvQyxxREFBcUQ7UUFDckQsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUNuQyw4QkFBOEI7WUFDOUIsT0FBTztnQkFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7cUJBQ3pCLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxVQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUMxRjtRQUVELG9EQUFvRDtRQUNwRCxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDcEIsNkJBQTZCO1lBQzdCLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7aUJBQ3hCLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxTQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUM5RjtRQUVELHNFQUFzRTtRQUN0RSxPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO1lBQ3hDLE1BQU07WUFDTixPQUFPO1lBQ1AsT0FBTztZQUNQLGNBQWM7WUFDZCxZQUFZO1lBQ1osZUFBZTtTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIdHRwQ29udGV4dH0gZnJvbSAnLi9jb250ZXh0JztcbmltcG9ydCB7SHR0cEhlYWRlcnN9IGZyb20gJy4vaGVhZGVycyc7XG5pbXBvcnQge0h0dHBQYXJhbXN9IGZyb20gJy4vcGFyYW1zJztcblxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBpbnRlcmZhY2UgZm9yIGBIdHRwUmVxdWVzdGBzLlxuICpcbiAqIEFsbCB2YWx1ZXMgYXJlIG9wdGlvbmFsIGFuZCB3aWxsIG92ZXJyaWRlIGRlZmF1bHQgdmFsdWVzIGlmIHByb3ZpZGVkLlxuICovXG5pbnRlcmZhY2UgSHR0cFJlcXVlc3RJbml0IHtcbiAgaGVhZGVycz86IEh0dHBIZWFkZXJzO1xuICBjb250ZXh0PzogSHR0cENvbnRleHQ7XG4gIHJlcG9ydFByb2dyZXNzPzogYm9vbGVhbjtcbiAgcGFyYW1zPzogSHR0cFBhcmFtcztcbiAgcmVzcG9uc2VUeXBlPzogJ2FycmF5YnVmZmVyJ3wnYmxvYid8J2pzb24nfCd0ZXh0JztcbiAgd2l0aENyZWRlbnRpYWxzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2QgbWF5IGluY2x1ZGUgYSBib2R5LlxuICovXG5mdW5jdGlvbiBtaWdodEhhdmVCb2R5KG1ldGhvZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgY2FzZSAnREVMRVRFJzpcbiAgICBjYXNlICdHRVQnOlxuICAgIGNhc2UgJ0hFQUQnOlxuICAgIGNhc2UgJ09QVElPTlMnOlxuICAgIGNhc2UgJ0pTT05QJzpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBTYWZlbHkgYXNzZXJ0IHdoZXRoZXIgdGhlIGdpdmVuIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLlxuICpcbiAqIEluIHNvbWUgZXhlY3V0aW9uIGVudmlyb25tZW50cyBBcnJheUJ1ZmZlciBpcyBub3QgZGVmaW5lZC5cbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWx1ZTogYW55KTogdmFsdWUgaXMgQXJyYXlCdWZmZXIge1xuICByZXR1cm4gdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyO1xufVxuXG4vKipcbiAqIFNhZmVseSBhc3NlcnQgd2hldGhlciB0aGUgZ2l2ZW4gdmFsdWUgaXMgYSBCbG9iLlxuICpcbiAqIEluIHNvbWUgZXhlY3V0aW9uIGVudmlyb25tZW50cyBCbG9iIGlzIG5vdCBkZWZpbmVkLlxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsdWU6IGFueSk6IHZhbHVlIGlzIEJsb2Ige1xuICByZXR1cm4gdHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgQmxvYjtcbn1cblxuLyoqXG4gKiBTYWZlbHkgYXNzZXJ0IHdoZXRoZXIgdGhlIGdpdmVuIHZhbHVlIGlzIGEgRm9ybURhdGEgaW5zdGFuY2UuXG4gKlxuICogSW4gc29tZSBleGVjdXRpb24gZW52aXJvbm1lbnRzIEZvcm1EYXRhIGlzIG5vdCBkZWZpbmVkLlxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBGb3JtRGF0YSB7XG4gIHJldHVybiB0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgRm9ybURhdGE7XG59XG5cbi8qKlxuICogU2FmZWx5IGFzc2VydCB3aGV0aGVyIHRoZSBnaXZlbiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBpbnN0YW5jZS5cbiAqXG4gKiBJbiBzb21lIGV4ZWN1dGlvbiBlbnZpcm9ubWVudHMgVVJMU2VhcmNoUGFyYW1zIGlzIG5vdCBkZWZpbmVkLlxuICovXG5mdW5jdGlvbiBpc1VybFNlYXJjaFBhcmFtcyh2YWx1ZTogYW55KTogdmFsdWUgaXMgVVJMU2VhcmNoUGFyYW1zIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xufVxuXG4vKipcbiAqIEFuIG91dGdvaW5nIEhUVFAgcmVxdWVzdCB3aXRoIGFuIG9wdGlvbmFsIHR5cGVkIGJvZHkuXG4gKlxuICogYEh0dHBSZXF1ZXN0YCByZXByZXNlbnRzIGFuIG91dGdvaW5nIHJlcXVlc3QsIGluY2x1ZGluZyBVUkwsIG1ldGhvZCxcbiAqIGhlYWRlcnMsIGJvZHksIGFuZCBvdGhlciByZXF1ZXN0IGNvbmZpZ3VyYXRpb24gb3B0aW9ucy4gSW5zdGFuY2VzIHNob3VsZCBiZVxuICogYXNzdW1lZCB0byBiZSBpbW11dGFibGUuIFRvIG1vZGlmeSBhIGBIdHRwUmVxdWVzdGAsIHRoZSBgY2xvbmVgXG4gKiBtZXRob2Qgc2hvdWxkIGJlIHVzZWQuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgSHR0cFJlcXVlc3Q8VD4ge1xuICAvKipcbiAgICogVGhlIHJlcXVlc3QgYm9keSwgb3IgYG51bGxgIGlmIG9uZSBpc24ndCBzZXQuXG4gICAqXG4gICAqIEJvZGllcyBhcmUgbm90IGVuZm9yY2VkIHRvIGJlIGltbXV0YWJsZSwgYXMgdGhleSBjYW4gaW5jbHVkZSBhIHJlZmVyZW5jZSB0byBhbnlcbiAgICogdXNlci1kZWZpbmVkIGRhdGEgdHlwZS4gSG93ZXZlciwgaW50ZXJjZXB0b3JzIHNob3VsZCB0YWtlIGNhcmUgdG8gcHJlc2VydmVcbiAgICogaWRlbXBvdGVuY2UgYnkgdHJlYXRpbmcgdGhlbSBhcyBzdWNoLlxuICAgKi9cbiAgcmVhZG9ubHkgYm9keTogVHxudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogT3V0Z29pbmcgaGVhZGVycyBmb3IgdGhpcyByZXF1ZXN0LlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHJlYWRvbmx5IGhlYWRlcnMhOiBIdHRwSGVhZGVycztcblxuICAvKipcbiAgICogU2hhcmVkIGFuZCBtdXRhYmxlIGNvbnRleHQgdGhhdCBjYW4gYmUgdXNlZCBieSBpbnRlcmNlcHRvcnNcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRleHQhOiBIdHRwQ29udGV4dDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIHJlcXVlc3Qgc2hvdWxkIGJlIG1hZGUgaW4gYSB3YXkgdGhhdCBleHBvc2VzIHByb2dyZXNzIGV2ZW50cy5cbiAgICpcbiAgICogUHJvZ3Jlc3MgZXZlbnRzIGFyZSBleHBlbnNpdmUgKGNoYW5nZSBkZXRlY3Rpb24gcnVucyBvbiBlYWNoIGV2ZW50KSBhbmQgc29cbiAgICogdGhleSBzaG91bGQgb25seSBiZSByZXF1ZXN0ZWQgaWYgdGhlIGNvbnN1bWVyIGludGVuZHMgdG8gbW9uaXRvciB0aGVtLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3J0UHJvZ3Jlc3M6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIHJlcXVlc3Qgc2hvdWxkIGJlIHNlbnQgd2l0aCBvdXRnb2luZyBjcmVkZW50aWFscyAoY29va2llcykuXG4gICAqL1xuICByZWFkb25seSB3aXRoQ3JlZGVudGlhbHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGV4cGVjdGVkIHJlc3BvbnNlIHR5cGUgb2YgdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhpcyBpcyB1c2VkIHRvIHBhcnNlIHRoZSByZXNwb25zZSBhcHByb3ByaWF0ZWx5IGJlZm9yZSByZXR1cm5pbmcgaXQgdG9cbiAgICogdGhlIHJlcXVlc3RlZS5cbiAgICovXG4gIHJlYWRvbmx5IHJlc3BvbnNlVHlwZTogJ2FycmF5YnVmZmVyJ3wnYmxvYid8J2pzb24nfCd0ZXh0JyA9ICdqc29uJztcblxuICAvKipcbiAgICogVGhlIG91dGdvaW5nIEhUVFAgcmVxdWVzdCBtZXRob2QuXG4gICAqL1xuICByZWFkb25seSBtZXRob2Q6IHN0cmluZztcblxuICAvKipcbiAgICogT3V0Z29pbmcgVVJMIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIFRvIHBhc3MgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgSFRUUCBwYXJhbWV0ZXJzIGluIHRoZSBVUkwtcXVlcnktc3RyaW5nIGZvcm1hdCxcbiAgICogdGhlIGBIdHRwUGFyYW1zT3B0aW9uc2AnIGBmcm9tU3RyaW5nYCBtYXkgYmUgdXNlZC4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGBgYFxuICAgKiBuZXcgSHR0cFBhcmFtcyh7ZnJvbVN0cmluZzogJ2FuZ3VsYXI9YXdlc29tZSd9KVxuICAgKiBgYGBcbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICByZWFkb25seSBwYXJhbXMhOiBIdHRwUGFyYW1zO1xuXG4gIC8qKlxuICAgKiBUaGUgb3V0Z29pbmcgVVJMIHdpdGggYWxsIFVSTCBwYXJhbWV0ZXJzIHNldC5cbiAgICovXG4gIHJlYWRvbmx5IHVybFdpdGhQYXJhbXM6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihtZXRob2Q6ICdERUxFVEUnfCdHRVQnfCdIRUFEJ3wnSlNPTlAnfCdPUFRJT05TJywgdXJsOiBzdHJpbmcsIGluaXQ/OiB7XG4gICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgIGNvbnRleHQ/OiBIdHRwQ29udGV4dCxcbiAgICByZXBvcnRQcm9ncmVzcz86IGJvb2xlYW4sXG4gICAgcGFyYW1zPzogSHR0cFBhcmFtcyxcbiAgICByZXNwb25zZVR5cGU/OiAnYXJyYXlidWZmZXInfCdibG9iJ3wnanNvbid8J3RleHQnLFxuICAgIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW4sXG4gIH0pO1xuICBjb25zdHJ1Y3RvcihtZXRob2Q6ICdQT1NUJ3wnUFVUJ3wnUEFUQ0gnLCB1cmw6IHN0cmluZywgYm9keTogVHxudWxsLCBpbml0Pzoge1xuICAgIGhlYWRlcnM/OiBIdHRwSGVhZGVycyxcbiAgICBjb250ZXh0PzogSHR0cENvbnRleHQsXG4gICAgcmVwb3J0UHJvZ3Jlc3M/OiBib29sZWFuLFxuICAgIHBhcmFtcz86IEh0dHBQYXJhbXMsXG4gICAgcmVzcG9uc2VUeXBlPzogJ2FycmF5YnVmZmVyJ3wnYmxvYid8J2pzb24nfCd0ZXh0JyxcbiAgICB3aXRoQ3JlZGVudGlhbHM/OiBib29sZWFuLFxuICB9KTtcbiAgY29uc3RydWN0b3IobWV0aG9kOiBzdHJpbmcsIHVybDogc3RyaW5nLCBib2R5OiBUfG51bGwsIGluaXQ/OiB7XG4gICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgIGNvbnRleHQ/OiBIdHRwQ29udGV4dCxcbiAgICByZXBvcnRQcm9ncmVzcz86IGJvb2xlYW4sXG4gICAgcGFyYW1zPzogSHR0cFBhcmFtcyxcbiAgICByZXNwb25zZVR5cGU/OiAnYXJyYXlidWZmZXInfCdibG9iJ3wnanNvbid8J3RleHQnLFxuICAgIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW4sXG4gIH0pO1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIG1ldGhvZDogc3RyaW5nLCByZWFkb25seSB1cmw6IHN0cmluZywgdGhpcmQ/OiBUfHtcbiAgICAgICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgICAgICBjb250ZXh0PzogSHR0cENvbnRleHQsXG4gICAgICAgIHJlcG9ydFByb2dyZXNzPzogYm9vbGVhbixcbiAgICAgICAgcGFyYW1zPzogSHR0cFBhcmFtcyxcbiAgICAgICAgcmVzcG9uc2VUeXBlPzogJ2FycmF5YnVmZmVyJ3wnYmxvYid8J2pzb24nfCd0ZXh0JyxcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzPzogYm9vbGVhbixcbiAgICAgIH18bnVsbCxcbiAgICAgIGZvdXJ0aD86IHtcbiAgICAgICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgICAgICBjb250ZXh0PzogSHR0cENvbnRleHQsXG4gICAgICAgIHJlcG9ydFByb2dyZXNzPzogYm9vbGVhbixcbiAgICAgICAgcGFyYW1zPzogSHR0cFBhcmFtcyxcbiAgICAgICAgcmVzcG9uc2VUeXBlPzogJ2FycmF5YnVmZmVyJ3wnYmxvYid8J2pzb24nfCd0ZXh0JyxcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzPzogYm9vbGVhbixcbiAgICAgIH0pIHtcbiAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpO1xuICAgIC8vIE5leHQsIG5lZWQgdG8gZmlndXJlIG91dCB3aGljaCBhcmd1bWVudCBob2xkcyB0aGUgSHR0cFJlcXVlc3RJbml0XG4gICAgLy8gb3B0aW9ucywgaWYgYW55LlxuICAgIGxldCBvcHRpb25zOiBIdHRwUmVxdWVzdEluaXR8dW5kZWZpbmVkO1xuXG4gICAgLy8gQ2hlY2sgd2hldGhlciBhIGJvZHkgYXJndW1lbnQgaXMgZXhwZWN0ZWQuIFRoZSBvbmx5IHZhbGlkIHdheSB0byBvbWl0XG4gICAgLy8gdGhlIGJvZHkgYXJndW1lbnQgaXMgdG8gdXNlIGEga25vd24gbm8tYm9keSBtZXRob2QgbGlrZSBHRVQuXG4gICAgaWYgKG1pZ2h0SGF2ZUJvZHkodGhpcy5tZXRob2QpIHx8ICEhZm91cnRoKSB7XG4gICAgICAvLyBCb2R5IGlzIHRoZSB0aGlyZCBhcmd1bWVudCwgb3B0aW9ucyBhcmUgdGhlIGZvdXJ0aC5cbiAgICAgIHRoaXMuYm9keSA9ICh0aGlyZCAhPT0gdW5kZWZpbmVkKSA/IHRoaXJkIGFzIFQgOiBudWxsO1xuICAgICAgb3B0aW9ucyA9IGZvdXJ0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gYm9keSByZXF1aXJlZCwgb3B0aW9ucyBhcmUgdGhlIHRoaXJkIGFyZ3VtZW50LiBUaGUgYm9keSBzdGF5cyBudWxsLlxuICAgICAgb3B0aW9ucyA9IHRoaXJkIGFzIEh0dHBSZXF1ZXN0SW5pdDtcbiAgICB9XG5cbiAgICAvLyBJZiBvcHRpb25zIGhhdmUgYmVlbiBwYXNzZWQsIGludGVycHJldCB0aGVtLlxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAvLyBOb3JtYWxpemUgcmVwb3J0UHJvZ3Jlc3MgYW5kIHdpdGhDcmVkZW50aWFscy5cbiAgICAgIHRoaXMucmVwb3J0UHJvZ3Jlc3MgPSAhIW9wdGlvbnMucmVwb3J0UHJvZ3Jlc3M7XG4gICAgICB0aGlzLndpdGhDcmVkZW50aWFscyA9ICEhb3B0aW9ucy53aXRoQ3JlZGVudGlhbHM7XG5cbiAgICAgIC8vIE92ZXJyaWRlIGRlZmF1bHQgcmVzcG9uc2UgdHlwZSBvZiAnanNvbicgaWYgb25lIGlzIHByb3ZpZGVkLlxuICAgICAgaWYgKCEhb3B0aW9ucy5yZXNwb25zZVR5cGUpIHtcbiAgICAgICAgdGhpcy5yZXNwb25zZVR5cGUgPSBvcHRpb25zLnJlc3BvbnNlVHlwZTtcbiAgICAgIH1cblxuICAgICAgLy8gT3ZlcnJpZGUgaGVhZGVycyBpZiB0aGV5J3JlIHByb3ZpZGVkLlxuICAgICAgaWYgKCEhb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycztcbiAgICAgIH1cblxuICAgICAgaWYgKCEhb3B0aW9ucy5jb250ZXh0KSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcbiAgICAgIH1cblxuICAgICAgaWYgKCEhb3B0aW9ucy5wYXJhbXMpIHtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBvcHRpb25zLnBhcmFtcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBubyBoZWFkZXJzIGhhdmUgYmVlbiBwYXNzZWQgaW4sIGNvbnN0cnVjdCBhIG5ldyBIdHRwSGVhZGVycyBpbnN0YW5jZS5cbiAgICBpZiAoIXRoaXMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gY29udGV4dCBoYXZlIGJlZW4gcGFzc2VkIGluLCBjb25zdHJ1Y3QgYSBuZXcgSHR0cENvbnRleHQgaW5zdGFuY2UuXG4gICAgaWYgKCF0aGlzLmNvbnRleHQpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBIdHRwQ29udGV4dCgpO1xuICAgIH1cblxuICAgIC8vIElmIG5vIHBhcmFtZXRlcnMgaGF2ZSBiZWVuIHBhc3NlZCBpbiwgY29uc3RydWN0IGEgbmV3IEh0dHBVcmxFbmNvZGVkUGFyYW1zIGluc3RhbmNlLlxuICAgIGlmICghdGhpcy5wYXJhbXMpIHtcbiAgICAgIHRoaXMucGFyYW1zID0gbmV3IEh0dHBQYXJhbXMoKTtcbiAgICAgIHRoaXMudXJsV2l0aFBhcmFtcyA9IHVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRW5jb2RlIHRoZSBwYXJhbWV0ZXJzIHRvIGEgc3RyaW5nIGluIHByZXBhcmF0aW9uIGZvciBpbmNsdXNpb24gaW4gdGhlIFVSTC5cbiAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucGFyYW1zLnRvU3RyaW5nKCk7XG4gICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBObyBwYXJhbWV0ZXJzLCB0aGUgdmlzaWJsZSBVUkwgaXMganVzdCB0aGUgVVJMIGdpdmVuIGF0IGNyZWF0aW9uIHRpbWUuXG4gICAgICAgIHRoaXMudXJsV2l0aFBhcmFtcyA9IHVybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERvZXMgdGhlIFVSTCBhbHJlYWR5IGhhdmUgcXVlcnkgcGFyYW1ldGVycz8gTG9vayBmb3IgJz8nLlxuICAgICAgICBjb25zdCBxSWR4ID0gdXJsLmluZGV4T2YoJz8nKTtcbiAgICAgICAgLy8gVGhlcmUgYXJlIDMgY2FzZXMgdG8gaGFuZGxlOlxuICAgICAgICAvLyAxKSBObyBleGlzdGluZyBwYXJhbWV0ZXJzIC0+IGFwcGVuZCAnPycgZm9sbG93ZWQgYnkgcGFyYW1zLlxuICAgICAgICAvLyAyKSAnPycgZXhpc3RzIGFuZCBpcyBmb2xsb3dlZCBieSBleGlzdGluZyBxdWVyeSBzdHJpbmcgLT5cbiAgICAgICAgLy8gICAgYXBwZW5kICcmJyBmb2xsb3dlZCBieSBwYXJhbXMuXG4gICAgICAgIC8vIDMpICc/JyBleGlzdHMgYXQgdGhlIGVuZCBvZiB0aGUgdXJsIC0+IGFwcGVuZCBwYXJhbXMgZGlyZWN0bHkuXG4gICAgICAgIC8vIFRoaXMgYmFzaWNhbGx5IGFtb3VudHMgdG8gZGV0ZXJtaW5pbmcgdGhlIGNoYXJhY3RlciwgaWYgYW55LCB3aXRoXG4gICAgICAgIC8vIHdoaWNoIHRvIGpvaW4gdGhlIFVSTCBhbmQgcGFyYW1ldGVycy5cbiAgICAgICAgY29uc3Qgc2VwOiBzdHJpbmcgPSBxSWR4ID09PSAtMSA/ICc/JyA6IChxSWR4IDwgdXJsLmxlbmd0aCAtIDEgPyAnJicgOiAnJyk7XG4gICAgICAgIHRoaXMudXJsV2l0aFBhcmFtcyA9IHVybCArIHNlcCArIHBhcmFtcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtIHRoZSBmcmVlLWZvcm0gYm9keSBpbnRvIGEgc2VyaWFsaXplZCBmb3JtYXQgc3VpdGFibGUgZm9yXG4gICAqIHRyYW5zbWlzc2lvbiB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgc2VyaWFsaXplQm9keSgpOiBBcnJheUJ1ZmZlcnxCbG9ifEZvcm1EYXRhfHN0cmluZ3xudWxsIHtcbiAgICAvLyBJZiBubyBib2R5IGlzIHByZXNlbnQsIG5vIG5lZWQgdG8gc2VyaWFsaXplIGl0LlxuICAgIGlmICh0aGlzLmJvZHkgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBib2R5IGlzIGFscmVhZHkgaW4gYSBzZXJpYWxpemVkIGZvcm0uIElmIHNvLFxuICAgIC8vIGl0IGNhbiBqdXN0IGJlIHJldHVybmVkIGRpcmVjdGx5LlxuICAgIGlmIChpc0FycmF5QnVmZmVyKHRoaXMuYm9keSkgfHwgaXNCbG9iKHRoaXMuYm9keSkgfHwgaXNGb3JtRGF0YSh0aGlzLmJvZHkpIHx8XG4gICAgICAgIGlzVXJsU2VhcmNoUGFyYW1zKHRoaXMuYm9keSkgfHwgdHlwZW9mIHRoaXMuYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB0aGlzLmJvZHk7XG4gICAgfVxuICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGJvZHkgaXMgYW4gaW5zdGFuY2Ugb2YgSHR0cFVybEVuY29kZWRQYXJhbXMuXG4gICAgaWYgKHRoaXMuYm9keSBpbnN0YW5jZW9mIEh0dHBQYXJhbXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmJvZHkudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgYm9keSBpcyBhbiBvYmplY3Qgb3IgYXJyYXksIGFuZCBzZXJpYWxpemUgd2l0aCBKU09OIGlmIHNvLlxuICAgIGlmICh0eXBlb2YgdGhpcy5ib2R5ID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdGhpcy5ib2R5ID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgQXJyYXkuaXNBcnJheSh0aGlzLmJvZHkpKSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5ib2R5KTtcbiAgICB9XG4gICAgLy8gRmFsbCBiYWNrIG9uIHRvU3RyaW5nKCkgZm9yIGV2ZXJ5dGhpbmcgZWxzZS5cbiAgICByZXR1cm4gKHRoaXMuYm9keSBhcyBhbnkpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogRXhhbWluZSB0aGUgYm9keSBhbmQgYXR0ZW1wdCB0byBpbmZlciBhbiBhcHByb3ByaWF0ZSBNSU1FIHR5cGVcbiAgICogZm9yIGl0LlxuICAgKlxuICAgKiBJZiBubyBzdWNoIHR5cGUgY2FuIGJlIGluZmVycmVkLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiBgbnVsbGAuXG4gICAqL1xuICBkZXRlY3RDb250ZW50VHlwZUhlYWRlcigpOiBzdHJpbmd8bnVsbCB7XG4gICAgLy8gQW4gZW1wdHkgYm9keSBoYXMgbm8gY29udGVudCB0eXBlLlxuICAgIGlmICh0aGlzLmJvZHkgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBGb3JtRGF0YSBib2RpZXMgcmVseSBvbiB0aGUgYnJvd3NlcidzIGNvbnRlbnQgdHlwZSBhc3NpZ25tZW50LlxuICAgIGlmIChpc0Zvcm1EYXRhKHRoaXMuYm9keSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBCbG9icyB1c3VhbGx5IGhhdmUgdGhlaXIgb3duIGNvbnRlbnQgdHlwZS4gSWYgaXQgZG9lc24ndCwgdGhlblxuICAgIC8vIG5vIHR5cGUgY2FuIGJlIGluZmVycmVkLlxuICAgIGlmIChpc0Jsb2IodGhpcy5ib2R5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuYm9keS50eXBlIHx8IG51bGw7XG4gICAgfVxuICAgIC8vIEFycmF5IGJ1ZmZlcnMgaGF2ZSB1bmtub3duIGNvbnRlbnRzIGFuZCB0aHVzIG5vIHR5cGUgY2FuIGJlIGluZmVycmVkLlxuICAgIGlmIChpc0FycmF5QnVmZmVyKHRoaXMuYm9keSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBUZWNobmljYWxseSwgc3RyaW5ncyBjb3VsZCBiZSBhIGZvcm0gb2YgSlNPTiBkYXRhLCBidXQgaXQncyBzYWZlIGVub3VnaFxuICAgIC8vIHRvIGFzc3VtZSB0aGV5J3JlIHBsYWluIHN0cmluZ3MuXG4gICAgaWYgKHR5cGVvZiB0aGlzLmJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gJ3RleHQvcGxhaW4nO1xuICAgIH1cbiAgICAvLyBgSHR0cFVybEVuY29kZWRQYXJhbXNgIGhhcyBpdHMgb3duIGNvbnRlbnQtdHlwZS5cbiAgICBpZiAodGhpcy5ib2R5IGluc3RhbmNlb2YgSHR0cFBhcmFtcykge1xuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCc7XG4gICAgfVxuICAgIC8vIEFycmF5cywgb2JqZWN0cywgYm9vbGVhbiBhbmQgbnVtYmVycyB3aWxsIGJlIGVuY29kZWQgYXMgSlNPTi5cbiAgICBpZiAodHlwZW9mIHRoaXMuYm9keSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHRoaXMuYm9keSA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgdHlwZW9mIHRoaXMuYm9keSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICAgIH1cbiAgICAvLyBObyB0eXBlIGNvdWxkIGJlIGluZmVycmVkLlxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY2xvbmUoKTogSHR0cFJlcXVlc3Q8VD47XG4gIGNsb25lKHVwZGF0ZToge1xuICAgIGhlYWRlcnM/OiBIdHRwSGVhZGVycyxcbiAgICBjb250ZXh0PzogSHR0cENvbnRleHQsXG4gICAgcmVwb3J0UHJvZ3Jlc3M/OiBib29sZWFuLFxuICAgIHBhcmFtcz86IEh0dHBQYXJhbXMsXG4gICAgcmVzcG9uc2VUeXBlPzogJ2FycmF5YnVmZmVyJ3wnYmxvYid8J2pzb24nfCd0ZXh0JyxcbiAgICB3aXRoQ3JlZGVudGlhbHM/OiBib29sZWFuLFxuICAgIGJvZHk/OiBUfG51bGwsXG4gICAgbWV0aG9kPzogc3RyaW5nLFxuICAgIHVybD86IHN0cmluZyxcbiAgICBzZXRIZWFkZXJzPzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd8c3RyaW5nW119LFxuICAgIHNldFBhcmFtcz86IHtbcGFyYW06IHN0cmluZ106IHN0cmluZ30sXG4gIH0pOiBIdHRwUmVxdWVzdDxUPjtcbiAgY2xvbmU8Vj4odXBkYXRlOiB7XG4gICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgIGNvbnRleHQ/OiBIdHRwQ29udGV4dCxcbiAgICByZXBvcnRQcm9ncmVzcz86IGJvb2xlYW4sXG4gICAgcGFyYW1zPzogSHR0cFBhcmFtcyxcbiAgICByZXNwb25zZVR5cGU/OiAnYXJyYXlidWZmZXInfCdibG9iJ3wnanNvbid8J3RleHQnLFxuICAgIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW4sXG4gICAgYm9keT86IFZ8bnVsbCxcbiAgICBtZXRob2Q/OiBzdHJpbmcsXG4gICAgdXJsPzogc3RyaW5nLFxuICAgIHNldEhlYWRlcnM/OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ3xzdHJpbmdbXX0sXG4gICAgc2V0UGFyYW1zPzoge1twYXJhbTogc3RyaW5nXTogc3RyaW5nfSxcbiAgfSk6IEh0dHBSZXF1ZXN0PFY+O1xuICBjbG9uZSh1cGRhdGU6IHtcbiAgICBoZWFkZXJzPzogSHR0cEhlYWRlcnMsXG4gICAgY29udGV4dD86IEh0dHBDb250ZXh0LFxuICAgIHJlcG9ydFByb2dyZXNzPzogYm9vbGVhbixcbiAgICBwYXJhbXM/OiBIdHRwUGFyYW1zLFxuICAgIHJlc3BvbnNlVHlwZT86ICdhcnJheWJ1ZmZlcid8J2Jsb2InfCdqc29uJ3wndGV4dCcsXG4gICAgd2l0aENyZWRlbnRpYWxzPzogYm9vbGVhbixcbiAgICBib2R5PzogYW55fG51bGwsXG4gICAgbWV0aG9kPzogc3RyaW5nLFxuICAgIHVybD86IHN0cmluZyxcbiAgICBzZXRIZWFkZXJzPzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd8c3RyaW5nW119LFxuICAgIHNldFBhcmFtcz86IHtbcGFyYW06IHN0cmluZ106IHN0cmluZ307XG4gIH0gPSB7fSk6IEh0dHBSZXF1ZXN0PGFueT4ge1xuICAgIC8vIEZvciBtZXRob2QsIHVybCwgYW5kIHJlc3BvbnNlVHlwZSwgdGFrZSB0aGUgY3VycmVudCB2YWx1ZSB1bmxlc3NcbiAgICAvLyBpdCBpcyBvdmVycmlkZGVuIGluIHRoZSB1cGRhdGUgaGFzaC5cbiAgICBjb25zdCBtZXRob2QgPSB1cGRhdGUubWV0aG9kIHx8IHRoaXMubWV0aG9kO1xuICAgIGNvbnN0IHVybCA9IHVwZGF0ZS51cmwgfHwgdGhpcy51cmw7XG4gICAgY29uc3QgcmVzcG9uc2VUeXBlID0gdXBkYXRlLnJlc3BvbnNlVHlwZSB8fCB0aGlzLnJlc3BvbnNlVHlwZTtcblxuICAgIC8vIFRoZSBib2R5IGlzIHNvbWV3aGF0IHNwZWNpYWwgLSBhIGBudWxsYCB2YWx1ZSBpbiB1cGRhdGUuYm9keSBtZWFuc1xuICAgIC8vIHdoYXRldmVyIGN1cnJlbnQgYm9keSBpcyBwcmVzZW50IGlzIGJlaW5nIG92ZXJyaWRkZW4gd2l0aCBhbiBlbXB0eVxuICAgIC8vIGJvZHksIHdoZXJlYXMgYW4gYHVuZGVmaW5lZGAgdmFsdWUgaW4gdXBkYXRlLmJvZHkgaW1wbGllcyBub1xuICAgIC8vIG92ZXJyaWRlLlxuICAgIGNvbnN0IGJvZHkgPSAodXBkYXRlLmJvZHkgIT09IHVuZGVmaW5lZCkgPyB1cGRhdGUuYm9keSA6IHRoaXMuYm9keTtcblxuICAgIC8vIENhcmVmdWxseSBoYW5kbGUgdGhlIGJvb2xlYW4gb3B0aW9ucyB0byBkaWZmZXJlbnRpYXRlIGJldHdlZW5cbiAgICAvLyBgZmFsc2VgIGFuZCBgdW5kZWZpbmVkYCBpbiB0aGUgdXBkYXRlIGFyZ3MuXG4gICAgY29uc3Qgd2l0aENyZWRlbnRpYWxzID1cbiAgICAgICAgKHVwZGF0ZS53aXRoQ3JlZGVudGlhbHMgIT09IHVuZGVmaW5lZCkgPyB1cGRhdGUud2l0aENyZWRlbnRpYWxzIDogdGhpcy53aXRoQ3JlZGVudGlhbHM7XG4gICAgY29uc3QgcmVwb3J0UHJvZ3Jlc3MgPVxuICAgICAgICAodXBkYXRlLnJlcG9ydFByb2dyZXNzICE9PSB1bmRlZmluZWQpID8gdXBkYXRlLnJlcG9ydFByb2dyZXNzIDogdGhpcy5yZXBvcnRQcm9ncmVzcztcblxuICAgIC8vIEhlYWRlcnMgYW5kIHBhcmFtcyBtYXkgYmUgYXBwZW5kZWQgdG8gaWYgYHNldEhlYWRlcnNgIG9yXG4gICAgLy8gYHNldFBhcmFtc2AgYXJlIHVzZWQuXG4gICAgbGV0IGhlYWRlcnMgPSB1cGRhdGUuaGVhZGVycyB8fCB0aGlzLmhlYWRlcnM7XG4gICAgbGV0IHBhcmFtcyA9IHVwZGF0ZS5wYXJhbXMgfHwgdGhpcy5wYXJhbXM7XG5cbiAgICAvLyBQYXNzIG9uIGNvbnRleHQgaWYgbmVlZGVkXG4gICAgY29uc3QgY29udGV4dCA9IHVwZGF0ZS5jb250ZXh0ID8/IHRoaXMuY29udGV4dDtcblxuICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGNhbGxlciBoYXMgYXNrZWQgdG8gYWRkIGhlYWRlcnMuXG4gICAgaWYgKHVwZGF0ZS5zZXRIZWFkZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIFNldCBldmVyeSByZXF1ZXN0ZWQgaGVhZGVyLlxuICAgICAgaGVhZGVycyA9XG4gICAgICAgICAgT2JqZWN0LmtleXModXBkYXRlLnNldEhlYWRlcnMpXG4gICAgICAgICAgICAgIC5yZWR1Y2UoKGhlYWRlcnMsIG5hbWUpID0+IGhlYWRlcnMuc2V0KG5hbWUsIHVwZGF0ZS5zZXRIZWFkZXJzIVtuYW1lXSksIGhlYWRlcnMpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGNhbGxlciBoYXMgYXNrZWQgdG8gc2V0IHBhcmFtcy5cbiAgICBpZiAodXBkYXRlLnNldFBhcmFtcykge1xuICAgICAgLy8gU2V0IGV2ZXJ5IHJlcXVlc3RlZCBwYXJhbS5cbiAgICAgIHBhcmFtcyA9IE9iamVjdC5rZXlzKHVwZGF0ZS5zZXRQYXJhbXMpXG4gICAgICAgICAgICAgICAgICAgLnJlZHVjZSgocGFyYW1zLCBwYXJhbSkgPT4gcGFyYW1zLnNldChwYXJhbSwgdXBkYXRlLnNldFBhcmFtcyFbcGFyYW1dKSwgcGFyYW1zKTtcbiAgICB9XG5cbiAgICAvLyBGaW5hbGx5LCBjb25zdHJ1Y3QgdGhlIG5ldyBIdHRwUmVxdWVzdCB1c2luZyB0aGUgcGllY2VzIGZyb20gYWJvdmUuXG4gICAgcmV0dXJuIG5ldyBIdHRwUmVxdWVzdChtZXRob2QsIHVybCwgYm9keSwge1xuICAgICAgcGFyYW1zLFxuICAgICAgaGVhZGVycyxcbiAgICAgIGNvbnRleHQsXG4gICAgICByZXBvcnRQcm9ncmVzcyxcbiAgICAgIHJlc3BvbnNlVHlwZSxcbiAgICAgIHdpdGhDcmVkZW50aWFscyxcbiAgICB9KTtcbiAgfVxufVxuIl19