/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ResourceLoader } from '@angular/compiler';
/**
 * A mock implementation of {@link ResourceLoader} that allows outgoing requests to be mocked
 * and responded to within a single test, without going to the network.
 */
export class MockResourceLoader extends ResourceLoader {
    constructor() {
        super(...arguments);
        this._expectations = [];
        this._definitions = new Map();
        this._requests = [];
    }
    get(url) {
        const request = new _PendingRequest(url);
        this._requests.push(request);
        return request.getPromise();
    }
    hasPendingRequests() {
        return !!this._requests.length;
    }
    /**
     * Add an expectation for the given URL. Incoming requests will be checked against
     * the next expectation (in FIFO order). The `verifyNoOutstandingExpectations` method
     * can be used to check if any expectations have not yet been met.
     *
     * The response given will be returned if the expectation matches.
     */
    expect(url, response) {
        const expectation = new _Expectation(url, response);
        this._expectations.push(expectation);
    }
    /**
     * Add a definition for the given URL to return the given response. Unlike expectations,
     * definitions have no order and will satisfy any matching request at any time. Also
     * unlike expectations, unused definitions do not cause `verifyNoOutstandingExpectations`
     * to return an error.
     */
    when(url, response) {
        this._definitions.set(url, response);
    }
    /**
     * Process pending requests and verify there are no outstanding expectations. Also fails
     * if no requests are pending.
     */
    flush() {
        if (this._requests.length === 0) {
            throw new Error('No pending requests to flush');
        }
        do {
            this._processRequest(this._requests.shift());
        } while (this._requests.length > 0);
        this.verifyNoOutstandingExpectations();
    }
    /**
     * Throw an exception if any expectations have not been satisfied.
     */
    verifyNoOutstandingExpectations() {
        if (this._expectations.length === 0)
            return;
        const urls = [];
        for (let i = 0; i < this._expectations.length; i++) {
            const expectation = this._expectations[i];
            urls.push(expectation.url);
        }
        throw new Error(`Unsatisfied requests: ${urls.join(', ')}`);
    }
    _processRequest(request) {
        const url = request.url;
        if (this._expectations.length > 0) {
            const expectation = this._expectations[0];
            if (expectation.url == url) {
                remove(this._expectations, expectation);
                request.complete(expectation.response);
                return;
            }
        }
        if (this._definitions.has(url)) {
            const response = this._definitions.get(url);
            request.complete(response == null ? null : response);
            return;
        }
        throw new Error(`Unexpected request ${url}`);
    }
}
class _PendingRequest {
    constructor(url) {
        this.url = url;
        this.promise = new Promise((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
    }
    complete(response) {
        if (response == null) {
            this.reject(`Failed to load ${this.url}`);
        }
        else {
            this.resolve(response);
        }
    }
    getPromise() {
        return this.promise;
    }
}
class _Expectation {
    constructor(url, response) {
        this.url = url;
        this.response = response;
    }
}
function remove(list, el) {
    const index = list.indexOf(el);
    if (index > -1) {
        list.splice(index, 1);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0aW5nL3NyYy9yZXNvdXJjZV9sb2FkZXJfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFakQ7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGNBQWM7SUFBdEQ7O1FBQ1Usa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBQ25DLGlCQUFZLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFDekMsY0FBUyxHQUFzQixFQUFFLENBQUM7SUFxRjVDLENBQUM7SUFuRlUsR0FBRyxDQUFDLEdBQVc7UUFDdEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0IsT0FBTyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsTUFBTSxDQUFDLEdBQVcsRUFBRSxRQUFnQjtRQUNsQyxNQUFNLFdBQVcsR0FBRyxJQUFJLFlBQVksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsSUFBSSxDQUFDLEdBQVcsRUFBRSxRQUFnQjtRQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFD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LENBQUM7Q0FDRjtBQUVELE1BQU0sWUFBWTtJQUdoQixZQUFZLEdBQVcsRUFBRSxRQUFnQjtRQUN2QyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7Q0FDRjtBQUVELFNBQVMsTUFBTSxDQUFJLElBQVMsRUFBRSxFQUFLO0lBQ2pDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN2QjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtSZXNvdXJjZUxvYWRlcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG4vKipcbiAqIEEgbW9jayBpbXBsZW1lbnRhdGlvbiBvZiB7QGxpbmsgUmVzb3VyY2VMb2FkZXJ9IHRoYXQgYWxsb3dzIG91dGdvaW5nIHJlcXVlc3RzIHRvIGJlIG1vY2tlZFxuICogYW5kIHJlc3BvbmRlZCB0byB3aXRoaW4gYSBzaW5nbGUgdGVzdCwgd2l0aG91dCBnb2luZyB0byB0aGUgbmV0d29yay5cbiAqL1xuZXhwb3J0IGNsYXNzIE1vY2tSZXNvdXJjZUxvYWRlciBleHRlbmRzIFJlc291cmNlTG9hZGVyIHtcbiAgcHJpdmF0ZSBfZXhwZWN0YXRpb25zOiBfRXhwZWN0YXRpb25bXSA9IFtdO1xuICBwcml2YXRlIF9kZWZpbml0aW9ucyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIHByaXZhdGUgX3JlcXVlc3RzOiBfUGVuZGluZ1JlcXVlc3RbXSA9IFtdO1xuXG4gIG92ZXJyaWRlIGdldCh1cmw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBfUGVuZGluZ1JlcXVlc3QodXJsKTtcbiAgICB0aGlzLl9yZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICAgIHJldHVybiByZXF1ZXN0LmdldFByb21pc2UoKTtcbiAgfVxuXG4gIGhhc1BlbmRpbmdSZXF1ZXN0cygpIHtcbiAgICByZXR1cm4gISF0aGlzLl9yZXF1ZXN0cy5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGV4cGVjdGF0aW9uIGZvciB0aGUgZ2l2ZW4gVVJMLiBJbmNvbWluZyByZXF1ZXN0cyB3aWxsIGJlIGNoZWNrZWQgYWdhaW5zdFxuICAgKiB0aGUgbmV4dCBleHBlY3RhdGlvbiAoaW4gRklGTyBvcmRlcikuIFRoZSBgdmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uc2AgbWV0aG9kXG4gICAqIGNhbiBiZSB1c2VkIHRvIGNoZWNrIGlmIGFueSBleHBlY3RhdGlvbnMgaGF2ZSBub3QgeWV0IGJlZW4gbWV0LlxuICAgKlxuICAgKiBUaGUgcmVzcG9uc2UgZ2l2ZW4gd2lsbCBiZSByZXR1cm5lZCBpZiB0aGUgZXhwZWN0YXRpb24gbWF0Y2hlcy5cbiAgICovXG4gIGV4cGVjdCh1cmw6IHN0cmluZywgcmVzcG9uc2U6IHN0cmluZykge1xuICAgIGNvbnN0IGV4cGVjdGF0aW9uID0gbmV3IF9FeHBlY3RhdGlvbih1cmwsIHJlc3BvbnNlKTtcbiAgICB0aGlzLl9leHBlY3RhdGlvbnMucHVzaChleHBlY3RhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgZGVmaW5pdGlvbiBmb3IgdGhlIGdpdmVuIFVSTCB0byByZXR1cm4gdGhlIGdpdmVuIHJlc3BvbnNlLiBVbmxpa2UgZXhwZWN0YXRpb25zLFxuICAgKiBkZWZpbml0aW9ucyBoYXZlIG5vIG9yZGVyIGFuZCB3aWxsIHNhdGlzZnkgYW55IG1hdGNoaW5nIHJlcXVlc3QgYXQgYW55IHRpbWUuIEFsc29cbiAgICogdW5saWtlIGV4cGVjdGF0aW9ucywgdW51c2VkIGRlZmluaXRpb25zIGRvIG5vdCBjYXVzZSBgdmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uc2BcbiAgICogdG8gcmV0dXJuIGFuIGVycm9yLlxuICAgKi9cbiAgd2hlbih1cmw6IHN0cmluZywgcmVzcG9uc2U6IHN0cmluZykge1xuICAgIHRoaXMuX2RlZmluaXRpb25zLnNldCh1cmwsIHJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzIHBlbmRpbmcgcmVxdWVzdHMgYW5kIHZlcmlmeSB0aGVyZSBhcmUgbm8gb3V0c3RhbmRpbmcgZXhwZWN0YXRpb25zLiBBbHNvIGZhaWxzXG4gICAqIGlmIG5vIHJlcXVlc3RzIGFyZSBwZW5kaW5nLlxuICAgKi9cbiAgZmx1c2goKSB7XG4gICAgaWYgKHRoaXMuX3JlcXVlc3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBwZW5kaW5nIHJlcXVlc3RzIHRvIGZsdXNoJyk7XG4gICAgfVxuXG4gICAgZG8ge1xuICAgICAgdGhpcy5fcHJvY2Vzc1JlcXVlc3QodGhpcy5fcmVxdWVzdHMuc2hpZnQoKSEpO1xuICAgIH0gd2hpbGUgKHRoaXMuX3JlcXVlc3RzLmxlbmd0aCA+IDApO1xuXG4gICAgdGhpcy52ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFueSBleHBlY3RhdGlvbnMgaGF2ZSBub3QgYmVlbiBzYXRpc2ZpZWQuXG4gICAqL1xuICB2ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb25zKCkge1xuICAgIGlmICh0aGlzLl9leHBlY3RhdGlvbnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBjb25zdCB1cmxzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZXhwZWN0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBleHBlY3RhdGlvbiA9IHRoaXMuX2V4cGVjdGF0aW9uc1tpXTtcbiAgICAgIHVybHMucHVzaChleHBlY3RhdGlvbi51cmwpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgVW5zYXRpc2ZpZWQgcmVxdWVzdHM6ICR7dXJscy5qb2luKCcsICcpfWApO1xuICB9XG5cbiAgcHJpdmF0ZSBfcHJvY2Vzc1JlcXVlc3QocmVxdWVzdDogX1BlbmRpbmdSZXF1ZXN0KSB7XG4gICAgY29uc3QgdXJsID0gcmVxdWVzdC51cmw7XG5cbiAgICBpZiAodGhpcy5fZXhwZWN0YXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGV4cGVjdGF0aW9uID0gdGhpcy5fZXhwZWN0YXRpb25zWzBdO1xuICAgICAgaWYgKGV4cGVjdGF0aW9uLnVybCA9PSB1cmwpIHtcbiAgICAgICAgcmVtb3ZlKHRoaXMuX2V4cGVjdGF0aW9ucywgZXhwZWN0YXRpb24pO1xuICAgICAgICByZXF1ZXN0LmNvbXBsZXRlKGV4cGVjdGF0aW9uLnJlc3BvbnNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9kZWZpbml0aW9ucy5oYXModXJsKSkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSB0aGlzLl9kZWZpbml0aW9ucy5nZXQodXJsKTtcbiAgICAgIHJlcXVlc3QuY29tcGxldGUocmVzcG9uc2UgPT0gbnVsbCA/IG51bGwgOiByZXNwb25zZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIHJlcXVlc3QgJHt1cmx9YCk7XG4gIH1cbn1cblxuY2xhc3MgX1BlbmRpbmdSZXF1ZXN0IHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHJlc29sdmUhOiAocmVzdWx0OiBzdHJpbmcpID0+IHZvaWQ7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICByZWplY3QhOiAoZXJyb3I6IGFueSkgPT4gdm9pZDtcbiAgcHJvbWlzZTogUHJvbWlzZTxzdHJpbmc+O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB1cmw6IHN0cmluZykge1xuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgdGhpcy5yZXNvbHZlID0gcmVzO1xuICAgICAgdGhpcy5yZWplY3QgPSByZWo7XG4gICAgfSk7XG4gIH1cblxuICBjb21wbGV0ZShyZXNwb25zZTogc3RyaW5nfG51bGwpIHtcbiAgICBpZiAocmVzcG9uc2UgPT0gbnVsbCkge1xuICAgICAgdGhpcy5yZWplY3QoYEZhaWxlZCB0byBsb2FkICR7dGhpcy51cmx9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJvbWlzZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLnByb21pc2U7XG4gIH1cbn1cblxuY2xhc3MgX0V4cGVjdGF0aW9uIHtcbiAgdXJsOiBzdHJpbmc7XG4gIHJlc3BvbnNlOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCByZXNwb25zZTogc3RyaW5nKSB7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZTxUPihsaXN0OiBUW10sIGVsOiBUKTogdm9pZCB7XG4gIGNvbnN0IGluZGV4ID0gbGlzdC5pbmRleE9mKGVsKTtcbiAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICBsaXN0LnNwbGljZShpbmRleCwgMSk7XG4gIH1cbn1cbiJdfQ==