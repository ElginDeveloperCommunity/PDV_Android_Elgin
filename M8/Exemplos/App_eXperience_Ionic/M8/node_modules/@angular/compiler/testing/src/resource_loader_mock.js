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
        define("@angular/compiler/testing/src/resource_loader_mock", ["require", "exports", "tslib", "@angular/compiler"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MockResourceLoader = void 0;
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    /**
     * A mock implementation of {@link ResourceLoader} that allows outgoing requests to be mocked
     * and responded to within a single test, without going to the network.
     */
    var MockResourceLoader = /** @class */ (function (_super) {
        tslib_1.__extends(MockResourceLoader, _super);
        function MockResourceLoader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._expectations = [];
            _this._definitions = new Map();
            _this._requests = [];
            return _this;
        }
        MockResourceLoader.prototype.get = function (url) {
            var request = new _PendingRequest(url);
            this._requests.push(request);
            return request.getPromise();
        };
        MockResourceLoader.prototype.hasPendingRequests = function () {
            return !!this._requests.length;
        };
        /**
         * Add an expectation for the given URL. Incoming requests will be checked against
         * the next expectation (in FIFO order). The `verifyNoOutstandingExpectations` method
         * can be used to check if any expectations have not yet been met.
         *
         * The response given will be returned if the expectation matches.
         */
        MockResourceLoader.prototype.expect = function (url, response) {
            var expectation = new _Expectation(url, response);
            this._expectations.push(expectation);
        };
        /**
         * Add a definition for the given URL to return the given response. Unlike expectations,
         * definitions have no order and will satisfy any matching request at any time. Also
         * unlike expectations, unused definitions do not cause `verifyNoOutstandingExpectations`
         * to return an error.
         */
        MockResourceLoader.prototype.when = function (url, response) {
            this._definitions.set(url, response);
        };
        /**
         * Process pending requests and verify there are no outstanding expectations. Also fails
         * if no requests are pending.
         */
        MockResourceLoader.prototype.flush = function () {
            if (this._requests.length === 0) {
                throw new Error('No pending requests to flush');
            }
            do {
                this._processRequest(this._requests.shift());
            } while (this._requests.length > 0);
            this.verifyNoOutstandingExpectations();
        };
        /**
         * Throw an exception if any expectations have not been satisfied.
         */
        MockResourceLoader.prototype.verifyNoOutstandingExpectations = function () {
            if (this._expectations.length === 0)
                return;
            var urls = [];
            for (var i = 0; i < this._expectations.length; i++) {
                var expectation = this._expectations[i];
                urls.push(expectation.url);
            }
            throw new Error("Unsatisfied requests: " + urls.join(', '));
        };
        MockResourceLoader.prototype._processRequest = function (request) {
            var url = request.url;
            if (this._expectations.length > 0) {
                var expectation = this._expectations[0];
                if (expectation.url == url) {
                    remove(this._expectations, expectation);
                    request.complete(expectation.response);
                    return;
                }
            }
            if (this._definitions.has(url)) {
                var response = this._definitions.get(url);
                request.complete(response == null ? null : response);
                return;
            }
            throw new Error("Unexpected request " + url);
        };
        return MockResourceLoader;
    }(compiler_1.ResourceLoader));
    exports.MockResourceLoader = MockResourceLoader;
    var _PendingRequest = /** @class */ (function () {
        function _PendingRequest(url) {
            var _this = this;
            this.url = url;
            this.promise = new Promise(function (res, rej) {
                _this.resolve = res;
                _this.reject = rej;
            });
        }
        _PendingRequest.prototype.complete = function (response) {
            if (response == null) {
                this.reject("Failed to load " + this.url);
            }
            else {
                this.resolve(response);
            }
        };
        _PendingRequest.prototype.getPromise = function () {
            return this.promise;
        };
        return _PendingRequest;
    }());
    var _Expectation = /** @class */ (function () {
        function _Expectation(url, response) {
            this.url = url;
            this.response = response;
        }
        return _Expectation;
    }());
    function remove(list, el) {
        var index = list.indexOf(el);
        if (index > -1) {
            list.splice(index, 1);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0aW5nL3NyYy9yZXNvdXJjZV9sb2FkZXJfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsOENBQWlEO0lBRWpEOzs7T0FHRztJQUNIO1FBQXdDLDhDQUFjO1FBQXREO1lBQUEscUVBd0ZDO1lBdkZTLG1CQUFhLEdBQW1CLEVBQUUsQ0FBQztZQUNuQyxrQkFBWSxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO1lBQ3pDLGVBQVMsR0FBc0IsRUFBRSxDQUFDOztRQXFGNUMsQ0FBQztRQW5GVSxnQ0FBRyxHQUFaLFVBQWEsR0FBVztZQUN0QixJQUFNLE9BQU8sR0FBRyxJQUFJLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QixPQUFPLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM5QixDQUFDO1FBRUQsK0NBQWtCLEdBQWxCO1lBQ0UsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDakMsQ0FBQztRQUVEOzs7Ozs7V0FNRztRQUNILG1DQUFNLEdBQU4sVUFBTyxHQUFXLEVBQUUsUUFBZ0I7WUFDbEMsSUFBTSxXQUFXLEdBQUcsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFFRDs7Ozs7V0FLRztRQUNILGlDQUFJLEdBQUosVUFBSyxHQUFXLEVBQUUsUUFBZ0I7WUFDaEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEs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QUMsUUFBUSxDQUFDLENBQUM7YUFDeEI7UUFDSCxDQUFDO1FBRUQsb0NBQVUsR0FBVjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDO1FBQ0gsc0JBQUM7SUFBRCxDQUFDLEFBekJELElBeUJDO0lBRUQ7UUFHRSxzQkFBWSxHQUFXLEVBQUUsUUFBZ0I7WUFDdkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDZixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUMzQixDQUFDO1FBQ0gsbUJBQUM7SUFBRCxDQUFDLEFBUEQsSUFPQztJQUVELFNBQVMsTUFBTSxDQUFJLElBQVMsRUFBRSxFQUFLO1FBQ2pDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2QjtJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtSZXNvdXJjZUxvYWRlcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG4vKipcbiAqIEEgbW9jayBpbXBsZW1lbnRhdGlvbiBvZiB7QGxpbmsgUmVzb3VyY2VMb2FkZXJ9IHRoYXQgYWxsb3dzIG91dGdvaW5nIHJlcXVlc3RzIHRvIGJlIG1vY2tlZFxuICogYW5kIHJlc3BvbmRlZCB0byB3aXRoaW4gYSBzaW5nbGUgdGVzdCwgd2l0aG91dCBnb2luZyB0byB0aGUgbmV0d29yay5cbiAqL1xuZXhwb3J0IGNsYXNzIE1vY2tSZXNvdXJjZUxvYWRlciBleHRlbmRzIFJlc291cmNlTG9hZGVyIHtcbiAgcHJpdmF0ZSBfZXhwZWN0YXRpb25zOiBfRXhwZWN0YXRpb25bXSA9IFtdO1xuICBwcml2YXRlIF9kZWZpbml0aW9ucyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIHByaXZhdGUgX3JlcXVlc3RzOiBfUGVuZGluZ1JlcXVlc3RbXSA9IFtdO1xuXG4gIG92ZXJyaWRlIGdldCh1cmw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBfUGVuZGluZ1JlcXVlc3QodXJsKTtcbiAgICB0aGlzLl9yZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICAgIHJldHVybiByZXF1ZXN0LmdldFByb21pc2UoKTtcbiAgfVxuXG4gIGhhc1BlbmRpbmdSZXF1ZXN0cygpIHtcbiAgICByZXR1cm4gISF0aGlzLl9yZXF1ZXN0cy5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGV4cGVjdGF0aW9uIGZvciB0aGUgZ2l2ZW4gVVJMLiBJbmNvbWluZyByZXF1ZXN0cyB3aWxsIGJlIGNoZWNrZWQgYWdhaW5zdFxuICAgKiB0aGUgbmV4dCBleHBlY3RhdGlvbiAoaW4gRklGTyBvcmRlcikuIFRoZSBgdmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uc2AgbWV0aG9kXG4gICAqIGNhbiBiZSB1c2VkIHRvIGNoZWNrIGlmIGFueSBleHBlY3RhdGlvbnMgaGF2ZSBub3QgeWV0IGJlZW4gbWV0LlxuICAgKlxuICAgKiBUaGUgcmVzcG9uc2UgZ2l2ZW4gd2lsbCBiZSByZXR1cm5lZCBpZiB0aGUgZXhwZWN0YXRpb24gbWF0Y2hlcy5cbiAgICovXG4gIGV4cGVjdCh1cmw6IHN0cmluZywgcmVzcG9uc2U6IHN0cmluZykge1xuICAgIGNvbnN0IGV4cGVjdGF0aW9uID0gbmV3IF9FeHBlY3RhdGlvbih1cmwsIHJlc3BvbnNlKTtcbiAgICB0aGlzLl9leHBlY3RhdGlvbnMucHVzaChleHBlY3RhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgZGVmaW5pdGlvbiBmb3IgdGhlIGdpdmVuIFVSTCB0byByZXR1cm4gdGhlIGdpdmVuIHJlc3BvbnNlLiBVbmxpa2UgZXhwZWN0YXRpb25zLFxuICAgKiBkZWZpbml0aW9ucyBoYXZlIG5vIG9yZGVyIGFuZCB3aWxsIHNhdGlzZnkgYW55IG1hdGNoaW5nIHJlcXVlc3QgYXQgYW55IHRpbWUuIEFsc29cbiAgICogdW5saWtlIGV4cGVjdGF0aW9ucywgdW51c2VkIGRlZmluaXRpb25zIGRvIG5vdCBjYXVzZSBgdmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uc2BcbiAgICogdG8gcmV0dXJuIGFuIGVycm9yLlxuICAgKi9cbiAgd2hlbih1cmw6IHN0cmluZywgcmVzcG9uc2U6IHN0cmluZykge1xuICAgIHRoaXMuX2RlZmluaXRpb25zLnNldCh1cmwsIHJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzIHBlbmRpbmcgcmVxdWVzdHMgYW5kIHZlcmlmeSB0aGVyZSBhcmUgbm8gb3V0c3RhbmRpbmcgZXhwZWN0YXRpb25zLiBBbHNvIGZhaWxzXG4gICAqIGlmIG5vIHJlcXVlc3RzIGFyZSBwZW5kaW5nLlxuICAgKi9cbiAgZmx1c2goKSB7XG4gICAgaWYgKHRoaXMuX3JlcXVlc3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBwZW5kaW5nIHJlcXVlc3RzIHRvIGZsdXNoJyk7XG4gICAgfVxuXG4gICAgZG8ge1xuICAgICAgdGhpcy5fcHJvY2Vzc1JlcXVlc3QodGhpcy5fcmVxdWVzdHMuc2hpZnQoKSEpO1xuICAgIH0gd2hpbGUgKHRoaXMuX3JlcXVlc3RzLmxlbmd0aCA+IDApO1xuXG4gICAgdGhpcy52ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFueSBleHBlY3RhdGlvbnMgaGF2ZSBub3QgYmVlbiBzYXRpc2ZpZWQuXG4gICAqL1xuICB2ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb25zKCkge1xuICAgIGlmICh0aGlzLl9leHBlY3RhdGlvbnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBjb25zdCB1cmxzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZXhwZWN0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBleHBlY3RhdGlvbiA9IHRoaXMuX2V4cGVjdGF0aW9uc1tpXTtcbiAgICAgIHVybHMucHVzaChleHBlY3RhdGlvbi51cmwpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgVW5zYXRpc2ZpZWQgcmVxdWVzdHM6ICR7dXJscy5qb2luKCcsICcpfWApO1xuICB9XG5cbiAgcHJpdmF0ZSBfcHJvY2Vzc1JlcXVlc3QocmVxdWVzdDogX1BlbmRpbmdSZXF1ZXN0KSB7XG4gICAgY29uc3QgdXJsID0gcmVxdWVzdC51cmw7XG5cbiAgICBpZiAodGhpcy5fZXhwZWN0YXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGV4cGVjdGF0aW9uID0gdGhpcy5fZXhwZWN0YXRpb25zWzBdO1xuICAgICAgaWYgKGV4cGVjdGF0aW9uLnVybCA9PSB1cmwpIHtcbiAgICAgICAgcmVtb3ZlKHRoaXMuX2V4cGVjdGF0aW9ucywgZXhwZWN0YXRpb24pO1xuICAgICAgICByZXF1ZXN0LmNvbXBsZXRlKGV4cGVjdGF0aW9uLnJlc3BvbnNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9kZWZpbml0aW9ucy5oYXModXJsKSkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSB0aGlzLl9kZWZpbml0aW9ucy5nZXQodXJsKTtcbiAgICAgIHJlcXVlc3QuY29tcGxldGUocmVzcG9uc2UgPT0gbnVsbCA/IG51bGwgOiByZXNwb25zZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIHJlcXVlc3QgJHt1cmx9YCk7XG4gIH1cbn1cblxuY2xhc3MgX1BlbmRpbmdSZXF1ZXN0IHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHJlc29sdmUhOiAocmVzdWx0OiBzdHJpbmcpID0+IHZvaWQ7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICByZWplY3QhOiAoZXJyb3I6IGFueSkgPT4gdm9pZDtcbiAgcHJvbWlzZTogUHJvbWlzZTxzdHJpbmc+O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB1cmw6IHN0cmluZykge1xuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgdGhpcy5yZXNvbHZlID0gcmVzO1xuICAgICAgdGhpcy5yZWplY3QgPSByZWo7XG4gICAgfSk7XG4gIH1cblxuICBjb21wbGV0ZShyZXNwb25zZTogc3RyaW5nfG51bGwpIHtcbiAgICBpZiAocmVzcG9uc2UgPT0gbnVsbCkge1xuICAgICAgdGhpcy5yZWplY3QoYEZhaWxlZCB0byBsb2FkICR7dGhpcy51cmx9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJvbWlzZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLnByb21pc2U7XG4gIH1cbn1cblxuY2xhc3MgX0V4cGVjdGF0aW9uIHtcbiAgdXJsOiBzdHJpbmc7XG4gIHJlc3BvbnNlOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCByZXNwb25zZTogc3RyaW5nKSB7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZTxUPihsaXN0OiBUW10sIGVsOiBUKTogdm9pZCB7XG4gIGNvbnN0IGluZGV4ID0gbGlzdC5pbmRleE9mKGVsKTtcbiAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICBsaXN0LnNwbGljZShpbmRleCwgMSk7XG4gIH1cbn1cbiJdfQ==