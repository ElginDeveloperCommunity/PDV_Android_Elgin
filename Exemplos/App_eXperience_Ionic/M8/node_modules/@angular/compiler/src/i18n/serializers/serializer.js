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
        define("@angular/compiler/src/i18n/serializers/serializer", ["require", "exports", "tslib", "@angular/compiler/src/i18n/i18n_ast"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SimplePlaceholderMapper = exports.Serializer = void 0;
    var tslib_1 = require("tslib");
    var i18n = require("@angular/compiler/src/i18n/i18n_ast");
    var Serializer = /** @class */ (function () {
        function Serializer() {
        }
        // Creates a name mapper, see `PlaceholderMapper`
        // Returning `null` means that no name mapping is used.
        Serializer.prototype.createNameMapper = function (message) {
            return null;
        };
        return Serializer;
    }());
    exports.Serializer = Serializer;
    /**
     * A simple mapper that take a function to transform an internal name to a public name
     */
    var SimplePlaceholderMapper = /** @class */ (function (_super) {
        tslib_1.__extends(SimplePlaceholderMapper, _super);
        // create a mapping from the message
        function SimplePlaceholderMapper(message, mapName) {
            var _this = _super.call(this) || this;
            _this.mapName = mapName;
            _this.internalToPublic = {};
            _this.publicToNextId = {};
            _this.publicToInternal = {};
            message.nodes.forEach(function (node) { return node.visit(_this); });
            return _this;
        }
        SimplePlaceholderMapper.prototype.toPublicName = function (internalName) {
            return this.internalToPublic.hasOwnProperty(internalName) ?
                this.internalToPublic[internalName] :
                null;
        };
        SimplePlaceholderMapper.prototype.toInternalName = function (publicName) {
            return this.publicToInternal.hasOwnProperty(publicName) ? this.publicToInternal[publicName] :
                null;
        };
        SimplePlaceholderMapper.prototype.visitText = function (text, context) {
            return null;
        };
        SimplePlaceholderMapper.prototype.visitTagPlaceholder = function (ph, context) {
            this.visitPlaceholderName(ph.startName);
            _super.prototype.visitTagPlaceholder.call(this, ph, context);
            this.visitPlaceholderName(ph.closeName);
        };
        SimplePlaceholderMapper.prototype.visitPlaceholder = function (ph, context) {
            this.visitPlaceholderName(ph.name);
        };
        SimplePlaceholderMapper.prototype.visitIcuPlaceholder = function (ph, context) {
            this.visitPlaceholderName(ph.name);
        };
        // XMB placeholders could only contains A-Z, 0-9 and _
        SimplePlaceholderMapper.prototype.visitPlaceholderName = function (internalName) {
            if (!internalName || this.internalToPublic.hasOwnProperty(internalName)) {
                return;
            }
            var publicName = this.mapName(internalName);
            if (this.publicToInternal.hasOwnProperty(publicName)) {
                // Create a new XMB when it has already been used
                var nextId = this.publicToNextId[publicName];
                this.publicToNextId[publicName] = nextId + 1;
                publicName = publicName + "_" + nextId;
            }
            else {
                this.publicToNextId[publicName] = 1;
            }
            this.internalToPublic[internalName] = publicName;
            this.publicToInternal[publicName] = internalName;
        };
        return SimplePlaceholderMapper;
    }(i18n.RecurseVisitor));
    exports.SimplePlaceholderMapper = SimplePlaceholderMapper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL3NlcmlhbGl6ZXJzL3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUVILDBEQUFvQztJQUVwQztRQUFBO1FBZ0JBLENBQUM7UUFMQyxpREFBaUQ7UUFDakQsdURBQXVEO1FBQ3ZELHFDQUFnQixHQUFoQixVQUFpQixPQUFxQjtZQUNwQyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDSCxpQkFBQztJQUFELENBQUMsQUFoQkQsSUFnQkM7SUFoQnFCLGdDQUFVO0lBOEJoQzs7T0FFRztJQUNIO1FBQTZDLG1EQUFtQjtRQUs5RCxvQ0FBb0M7UUFDcEMsaUNBQVksT0FBcUIsRUFBVSxPQUFpQztZQUE1RSxZQUNFLGlCQUFPLFNBRVI7WUFIMEMsYUFBTyxHQUFQLE9BQU8sQ0FBMEI7WUFMcEUsc0JBQWdCLEdBQTBCLEVBQUUsQ0FBQztZQUM3QyxvQkFBYyxHQUEwQixFQUFFLENBQUM7WUFDM0Msc0JBQWdCLEdBQTBCLEVBQUUsQ0FBQztZQUtuRCxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSSxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQzs7UUFDbEQsQ0FBQztRQUVELDhDQUFZLEdBQVosVUFBYSxZQUFvQjtZQUMvQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQztRQUNYLENBQUM7UUFFRCxnREFBYyxHQUFkLFVBQWUsVUFBa0I7WUFDL0IsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDO1FBQ2pFLENBQUM7UUFFUSwyQ0FBUyxHQUFsQixVQUFtQixJQUFlLEVBQUUsT0FBYTtZQUMvQyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFUSxxREFBbUIsR0FBNUIsVUFBNkIsRUFBdUIsRUFBRSxPQUFhO1lBQ2pFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEMsaUJBQU0sbUJBQW1CLFlBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUVRLGtEQUFnQixHQUF6QixVQUEwQixFQUFvQixFQUFFLE9BQWE7WUFDM0QsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRVEscURBQW1CLEdBQTVCLFVBQTZCLEVBQXVCLEVBQUUsT0FBYTtZQUNqRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxzREFBc0Q7UUFDOUMsc0RBQW9CLEdBQTVCLFVBQTZCLFlBQW9CO1lBQy9DLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDdkUsT0FBTzthQUNSO1lBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUU1QyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQ3BELGlEQUFpRDtnQkFDakQsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxVQUFVLEdBQU0sVUFBVSxTQUFJLE1BQVEsQ0FBQzthQUN4QztpQkFBTTtnQkFDTCxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQztZQUVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsR0FBRyxVQUFVLENBQUM7WUFDakQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxHQUFHLFlBQVksQ0FBQztRQUNuRCxDQUFDO1FBQ0gsOEJBQUM7SUFBRCxDQUFDLEFBNURELENBQTZDLElBQUksQ0FBQyxjQUFjLEdBNEQvRDtJQTVEWSwwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgaTE4biBmcm9tICcuLi9pMThuX2FzdCc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTZXJpYWxpemVyIHtcbiAgLy8gLSBUaGUgYHBsYWNlaG9sZGVyc2AgYW5kIGBwbGFjZWhvbGRlclRvTWVzc2FnZWAgcHJvcGVydGllcyBhcmUgaXJyZWxldmFudCBpbiB0aGUgaW5wdXQgbWVzc2FnZXNcbiAgLy8gLSBUaGUgYGlkYCBjb250YWlucyB0aGUgbWVzc2FnZSBpZCB0aGF0IHRoZSBzZXJpYWxpemVyIGlzIGV4cGVjdGVkIHRvIHVzZVxuICAvLyAtIFBsYWNlaG9sZGVyIG5hbWVzIGFyZSBhbHJlYWR5IG1hcCB0byBwdWJsaWMgbmFtZXMgdXNpbmcgdGhlIHByb3ZpZGVkIG1hcHBlclxuICBhYnN0cmFjdCB3cml0ZShtZXNzYWdlczogaTE4bi5NZXNzYWdlW10sIGxvY2FsZTogc3RyaW5nfG51bGwpOiBzdHJpbmc7XG5cbiAgYWJzdHJhY3QgbG9hZChjb250ZW50OiBzdHJpbmcsIHVybDogc3RyaW5nKTpcbiAgICAgIHtsb2NhbGU6IHN0cmluZ3xudWxsLCBpMThuTm9kZXNCeU1zZ0lkOiB7W21zZ0lkOiBzdHJpbmddOiBpMThuLk5vZGVbXX19O1xuXG4gIGFic3RyYWN0IGRpZ2VzdChtZXNzYWdlOiBpMThuLk1lc3NhZ2UpOiBzdHJpbmc7XG5cbiAgLy8gQ3JlYXRlcyBhIG5hbWUgbWFwcGVyLCBzZWUgYFBsYWNlaG9sZGVyTWFwcGVyYFxuICAvLyBSZXR1cm5pbmcgYG51bGxgIG1lYW5zIHRoYXQgbm8gbmFtZSBtYXBwaW5nIGlzIHVzZWQuXG4gIGNyZWF0ZU5hbWVNYXBwZXIobWVzc2FnZTogaTE4bi5NZXNzYWdlKTogUGxhY2Vob2xkZXJNYXBwZXJ8bnVsbCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGBQbGFjZWhvbGRlck1hcHBlcmAgY29udmVydHMgcGxhY2Vob2xkZXIgbmFtZXMgZnJvbSBpbnRlcm5hbCB0byBzZXJpYWxpemVkIHJlcHJlc2VudGF0aW9uIGFuZFxuICogYmFjay5cbiAqXG4gKiBJdCBzaG91bGQgYmUgdXNlZCBmb3Igc2VyaWFsaXphdGlvbiBmb3JtYXQgdGhhdCBwdXQgY29uc3RyYWludHMgb24gdGhlIHBsYWNlaG9sZGVyIG5hbWVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBsYWNlaG9sZGVyTWFwcGVyIHtcbiAgdG9QdWJsaWNOYW1lKGludGVybmFsTmFtZTogc3RyaW5nKTogc3RyaW5nfG51bGw7XG5cbiAgdG9JbnRlcm5hbE5hbWUocHVibGljTmFtZTogc3RyaW5nKTogc3RyaW5nfG51bGw7XG59XG5cbi8qKlxuICogQSBzaW1wbGUgbWFwcGVyIHRoYXQgdGFrZSBhIGZ1bmN0aW9uIHRvIHRyYW5zZm9ybSBhbiBpbnRlcm5hbCBuYW1lIHRvIGEgcHVibGljIG5hbWVcbiAqL1xuZXhwb3J0IGNsYXNzIFNpbXBsZVBsYWNlaG9sZGVyTWFwcGVyIGV4dGVuZHMgaTE4bi5SZWN1cnNlVmlzaXRvciBpbXBsZW1lbnRzIFBsYWNlaG9sZGVyTWFwcGVyIHtcbiAgcHJpdmF0ZSBpbnRlcm5hbFRvUHVibGljOiB7W2s6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgcHJpdmF0ZSBwdWJsaWNUb05leHRJZDoge1trOiBzdHJpbmddOiBudW1iZXJ9ID0ge307XG4gIHByaXZhdGUgcHVibGljVG9JbnRlcm5hbDoge1trOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgLy8gY3JlYXRlIGEgbWFwcGluZyBmcm9tIHRoZSBtZXNzYWdlXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSwgcHJpdmF0ZSBtYXBOYW1lOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIG1lc3NhZ2Uubm9kZXMuZm9yRWFjaChub2RlID0+IG5vZGUudmlzaXQodGhpcykpO1xuICB9XG5cbiAgdG9QdWJsaWNOYW1lKGludGVybmFsTmFtZTogc3RyaW5nKTogc3RyaW5nfG51bGwge1xuICAgIHJldHVybiB0aGlzLmludGVybmFsVG9QdWJsaWMuaGFzT3duUHJvcGVydHkoaW50ZXJuYWxOYW1lKSA/XG4gICAgICAgIHRoaXMuaW50ZXJuYWxUb1B1YmxpY1tpbnRlcm5hbE5hbWVdIDpcbiAgICAgICAgbnVsbDtcbiAgfVxuXG4gIHRvSW50ZXJuYWxOYW1lKHB1YmxpY05hbWU6IHN0cmluZyk6IHN0cmluZ3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaWNUb0ludGVybmFsLmhhc093blByb3BlcnR5KHB1YmxpY05hbWUpID8gdGhpcy5wdWJsaWNUb0ludGVybmFsW3B1YmxpY05hbWVdIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbDtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0VGV4dCh0ZXh0OiBpMThuLlRleHQsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRUYWdQbGFjZWhvbGRlcihwaDogaTE4bi5UYWdQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueSB7XG4gICAgdGhpcy52aXNpdFBsYWNlaG9sZGVyTmFtZShwaC5zdGFydE5hbWUpO1xuICAgIHN1cGVyLnZpc2l0VGFnUGxhY2Vob2xkZXIocGgsIGNvbnRleHQpO1xuICAgIHRoaXMudmlzaXRQbGFjZWhvbGRlck5hbWUocGguY2xvc2VOYW1lKTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0UGxhY2Vob2xkZXIocGg6IGkxOG4uUGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHRoaXMudmlzaXRQbGFjZWhvbGRlck5hbWUocGgubmFtZSk7XG4gIH1cblxuICBvdmVycmlkZSB2aXNpdEljdVBsYWNlaG9sZGVyKHBoOiBpMThuLkljdVBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogYW55IHtcbiAgICB0aGlzLnZpc2l0UGxhY2Vob2xkZXJOYW1lKHBoLm5hbWUpO1xuICB9XG5cbiAgLy8gWE1CIHBsYWNlaG9sZGVycyBjb3VsZCBvbmx5IGNvbnRhaW5zIEEtWiwgMC05IGFuZCBfXG4gIHByaXZhdGUgdmlzaXRQbGFjZWhvbGRlck5hbWUoaW50ZXJuYWxOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIWludGVybmFsTmFtZSB8fCB0aGlzLmludGVybmFsVG9QdWJsaWMuaGFzT3duUHJvcGVydHkoaW50ZXJuYWxOYW1lKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwdWJsaWNOYW1lID0gdGhpcy5tYXBOYW1lKGludGVybmFsTmFtZSk7XG5cbiAgICBpZiAodGhpcy5wdWJsaWNUb0ludGVybmFsLmhhc093blByb3BlcnR5KHB1YmxpY05hbWUpKSB7XG4gICAgICAvLyBDcmVhdGUgYSBuZXcgWE1CIHdoZW4gaXQgaGFzIGFscmVhZHkgYmVlbiB1c2VkXG4gICAgICBjb25zdCBuZXh0SWQgPSB0aGlzLnB1YmxpY1RvTmV4dElkW3B1YmxpY05hbWVdO1xuICAgICAgdGhpcy5wdWJsaWNUb05leHRJZFtwdWJsaWNOYW1lXSA9IG5leHRJZCArIDE7XG4gICAgICBwdWJsaWNOYW1lID0gYCR7cHVibGljTmFtZX1fJHtuZXh0SWR9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdWJsaWNUb05leHRJZFtwdWJsaWNOYW1lXSA9IDE7XG4gICAgfVxuXG4gICAgdGhpcy5pbnRlcm5hbFRvUHVibGljW2ludGVybmFsTmFtZV0gPSBwdWJsaWNOYW1lO1xuICAgIHRoaXMucHVibGljVG9JbnRlcm5hbFtwdWJsaWNOYW1lXSA9IGludGVybmFsTmFtZTtcbiAgfVxufVxuIl19