/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ResourceLoader } from '@angular/compiler';
import { Injectable } from '@angular/core';
export class ResourceLoaderImpl extends ResourceLoader {
    get(url) {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload = function () {
            // responseText is the old-school way of retrieving response (supported by IE8 & 9)
            // response/responseType properties were introduced in ResourceLoader Level2 spec (supported
            // by IE10)
            const response = xhr.response || xhr.responseText;
            // normalize IE9 bug (https://bugs.jquery.com/ticket/1450)
            let status = xhr.status === 1223 ? 204 : xhr.status;
            // fix status code when it is 0 (0 status is undocumented).
            // Occurs when accessing file resources or on Android 4.1 stock browser
            // while retrieving files from application cache.
            if (status === 0) {
                status = response ? 200 : 0;
            }
            if (200 <= status && status <= 300) {
                resolve(response);
            }
            else {
                reject(`Failed to load ${url}`);
            }
        };
        xhr.onerror = function () {
            reject(`Failed to load ${url}`);
        };
        xhr.send();
        return promise;
    }
}
ResourceLoaderImpl.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX2ltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMvc3JjL3Jlc291cmNlX2xvYWRlci9yZXNvdXJjZV9sb2FkZXJfaW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUl6QyxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsY0FBYztJQUMzQyxHQUFHLENBQUMsR0FBVztRQUN0QixJQUFJLE9BQThCLENBQUM7UUFDbkMsSUFBSSxNQUE0QixDQUFDO1FBQ2pDLE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQy9DLE9BQU8sR0FBRyxHQUFHLENBQUM7WUFDZCxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ2pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzQixHQUFHLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztRQUUxQixHQUFHLENBQUMsTUFBTSxHQUFHO1lBQ1gsbUZBQW1GO1lBQ25GLDRGQUE0RjtZQUM1RixXQUFXO1lBQ1gsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDO1lBRWxELDBEQUEwRDtZQUMxRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBRXBELDJEQUEyRDtZQUMzRCx1RUFBdUU7WUFDdkUsaURBQWlEO1lBQ2pELElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDaEIsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0I7WUFFRCxJQUFJLEdBQUcsSUFBSSxNQUFNLElBQUksTUFBTSxJQUFJLEdBQUcsRUFBRTtnQkFDbEMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ25CO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUMsQ0FBQzthQUNqQztRQUNILENBQUMsQ0FBQztRQUVGLEdBQUcsQ0FBQyxPQUFPLEdBQUc7WUFDWixNQUFNLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDO1FBRUYsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQzs7O1lBMUNGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7UmVzb3VyY2VMb2FkZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJlc291cmNlTG9hZGVySW1wbCBleHRlbmRzIFJlc291cmNlTG9hZGVyIHtcbiAgb3ZlcnJpZGUgZ2V0KHVybDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBsZXQgcmVzb2x2ZTogKHJlc3VsdDogYW55KSA9PiB2b2lkO1xuICAgIGxldCByZWplY3Q6IChlcnJvcjogYW55KSA9PiB2b2lkO1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZTxzdHJpbmc+KChyZXMsIHJlaikgPT4ge1xuICAgICAgcmVzb2x2ZSA9IHJlcztcbiAgICAgIHJlamVjdCA9IHJlajtcbiAgICB9KTtcbiAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gJ3RleHQnO1xuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gcmVzcG9uc2VUZXh0IGlzIHRoZSBvbGQtc2Nob29sIHdheSBvZiByZXRyaWV2aW5nIHJlc3BvbnNlIChzdXBwb3J0ZWQgYnkgSUU4ICYgOSlcbiAgICAgIC8vIHJlc3BvbnNlL3Jlc3BvbnNlVHlwZSBwcm9wZXJ0aWVzIHdlcmUgaW50cm9kdWNlZCBpbiBSZXNvdXJjZUxvYWRlciBMZXZlbDIgc3BlYyAoc3VwcG9ydGVkXG4gICAgICAvLyBieSBJRTEwKVxuICAgICAgY29uc3QgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2UgfHwgeGhyLnJlc3BvbnNlVGV4dDtcblxuICAgICAgLy8gbm9ybWFsaXplIElFOSBidWcgKGh0dHBzOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xNDUwKVxuICAgICAgbGV0IHN0YXR1cyA9IHhoci5zdGF0dXMgPT09IDEyMjMgPyAyMDQgOiB4aHIuc3RhdHVzO1xuXG4gICAgICAvLyBmaXggc3RhdHVzIGNvZGUgd2hlbiBpdCBpcyAwICgwIHN0YXR1cyBpcyB1bmRvY3VtZW50ZWQpLlxuICAgICAgLy8gT2NjdXJzIHdoZW4gYWNjZXNzaW5nIGZpbGUgcmVzb3VyY2VzIG9yIG9uIEFuZHJvaWQgNC4xIHN0b2NrIGJyb3dzZXJcbiAgICAgIC8vIHdoaWxlIHJldHJpZXZpbmcgZmlsZXMgZnJvbSBhcHBsaWNhdGlvbiBjYWNoZS5cbiAgICAgIGlmIChzdGF0dXMgPT09IDApIHtcbiAgICAgICAgc3RhdHVzID0gcmVzcG9uc2UgPyAyMDAgOiAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoMjAwIDw9IHN0YXR1cyAmJiBzdGF0dXMgPD0gMzAwKSB7XG4gICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KGBGYWlsZWQgdG8gbG9hZCAke3VybH1gKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChgRmFpbGVkIHRvIGxvYWQgJHt1cmx9YCk7XG4gICAgfTtcblxuICAgIHhoci5zZW5kKCk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn1cbiJdfQ==