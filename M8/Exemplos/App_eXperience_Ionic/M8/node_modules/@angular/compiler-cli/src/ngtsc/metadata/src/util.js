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
        define("@angular/compiler-cli/src/ngtsc/metadata/src/util", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/util/src/typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hasInjectableFields = exports.CompoundMetadataReader = exports.extractDirectiveTypeCheckMeta = exports.readStringArrayType = exports.readStringMapType = exports.readStringType = exports.extractReferencesFromType = void 0;
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    function extractReferencesFromType(checker, def, bestGuessOwningModule) {
        if (!ts.isTupleTypeNode(def)) {
            return [];
        }
        return def.elements.map(function (element) {
            if (!ts.isTypeQueryNode(element)) {
                throw new Error("Expected TypeQueryNode: " + typescript_1.nodeDebugInfo(element));
            }
            var type = element.exprName;
            var _a = reflection_1.reflectTypeEntityToDeclaration(type, checker), node = _a.node, from = _a.from;
            if (!reflection_1.isNamedClassDeclaration(node)) {
                throw new Error("Expected named ClassDeclaration: " + typescript_1.nodeDebugInfo(node));
            }
            if (from !== null && !from.startsWith('.')) {
                // The symbol was imported using an absolute module specifier so return a reference that
                // uses that absolute module specifier as its best guess owning module.
                return new imports_1.Reference(node, { specifier: from, resolutionContext: def.getSourceFile().fileName });
            }
            else {
                // For local symbols or symbols that were imported using a relative module import it is
                // assumed that the symbol is exported from the provided best guess owning module.
                return new imports_1.Reference(node, bestGuessOwningModule);
            }
        });
    }
    exports.extractReferencesFromType = extractReferencesFromType;
    function readStringType(type) {
        if (!ts.isLiteralTypeNode(type) || !ts.isStringLiteral(type.literal)) {
            return null;
        }
        return type.literal.text;
    }
    exports.readStringType = readStringType;
    function readStringMapType(type) {
        if (!ts.isTypeLiteralNode(type)) {
            return {};
        }
        var obj = {};
        type.members.forEach(function (member) {
            if (!ts.isPropertySignature(member) || member.type === undefined || member.name === undefined ||
                !ts.isStringLiteral(member.name)) {
                return;
            }
            var value = readStringType(member.type);
            if (value === null) {
                return null;
            }
            obj[member.name.text] = value;
        });
        return obj;
    }
    exports.readStringMapType = readStringMapType;
    function readStringArrayType(type) {
        if (!ts.isTupleTypeNode(type)) {
            return [];
        }
        var res = [];
        type.elements.forEach(function (el) {
            if (!ts.isLiteralTypeNode(el) || !ts.isStringLiteral(el.literal)) {
                return;
            }
            res.push(el.literal.text);
        });
        return res;
    }
    exports.readStringArrayType = readStringArrayType;
    /**
     * Inspects the class' members and extracts the metadata that is used when type-checking templates
     * that use the directive. This metadata does not contain information from a base class, if any,
     * making this metadata invariant to changes of inherited classes.
     */
    function extractDirectiveTypeCheckMeta(node, inputs, reflector) {
        var e_1, _a;
        var members = reflector.getMembersOfClass(node);
        var staticMembers = members.filter(function (member) { return member.isStatic; });
        var ngTemplateGuards = staticMembers.map(extractTemplateGuard)
            .filter(function (guard) { return guard !== null; });
        var hasNgTemplateContextGuard = staticMembers.some(function (member) { return member.kind === reflection_1.ClassMemberKind.Method && member.name === 'ngTemplateContextGuard'; });
        var coercedInputFields = new Set(staticMembers.map(extractCoercedInput)
            .filter(function (inputName) { return inputName !== null; }));
        var restrictedInputFields = new Set();
        var stringLiteralInputFields = new Set();
        var undeclaredInputFields = new Set();
        var _loop_1 = function (classPropertyName) {
            var field = members.find(function (member) { return member.name === classPropertyName; });
            if (field === undefined || field.node === null) {
                undeclaredInputFields.add(classPropertyName);
                return "continue";
            }
            if (isRestricted(field.node)) {
                restrictedInputFields.add(classPropertyName);
            }
            if (field.nameNode !== null && ts.isStringLiteral(field.nameNode)) {
                stringLiteralInputFields.add(classPropertyName);
            }
        };
        try {
            for (var _b = tslib_1.__values(inputs.classPropertyNames), _c = _b.next(); !_c.done; _c = _b.next()) {
                var classPropertyName = _c.value;
                _loop_1(classPropertyName);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var arity = reflector.getGenericArityOfClass(node);
        return {
            hasNgTemplateContextGuard: hasNgTemplateContextGuard,
            ngTemplateGuards: ngTemplateGuards,
            coercedInputFields: coercedInputFields,
            restrictedInputFields: restrictedInputFields,
            stringLiteralInputFields: stringLiteralInputFields,
            undeclaredInputFields: undeclaredInputFields,
            isGeneric: arity !== null && arity > 0,
        };
    }
    exports.extractDirectiveTypeCheckMeta = extractDirectiveTypeCheckMeta;
    function isRestricted(node) {
        if (node.modifiers === undefined) {
            return false;
        }
        return node.modifiers.some(function (modifier) { return modifier.kind === ts.SyntaxKind.PrivateKeyword ||
            modifier.kind === ts.SyntaxKind.ProtectedKeyword ||
            modifier.kind === ts.SyntaxKind.ReadonlyKeyword; });
    }
    function extractTemplateGuard(member) {
        if (!member.name.startsWith('ngTemplateGuard_')) {
            return null;
        }
        var inputName = afterUnderscore(member.name);
        if (member.kind === reflection_1.ClassMemberKind.Property) {
            var type = null;
            if (member.type !== null && ts.isLiteralTypeNode(member.type) &&
                ts.isStringLiteral(member.type.literal)) {
                type = member.type.literal.text;
            }
            // Only property members with string literal type 'binding' are considered as template guard.
            if (type !== 'binding') {
                return null;
            }
            return { inputName: inputName, type: type };
        }
        else if (member.kind === reflection_1.ClassMemberKind.Method) {
            return { inputName: inputName, type: 'invocation' };
        }
        else {
            return null;
        }
    }
    function extractCoercedInput(member) {
        if (member.kind !== reflection_1.ClassMemberKind.Property || !member.name.startsWith('ngAcceptInputType_')) {
            return null;
        }
        return afterUnderscore(member.name);
    }
    /**
     * A `MetadataReader` that reads from an ordered set of child readers until it obtains the requested
     * metadata.
     *
     * This is used to combine `MetadataReader`s that read from different sources (e.g. from a registry
     * and from .d.ts files).
     */
    var CompoundMetadataReader = /** @class */ (function () {
        function CompoundMetadataReader(readers) {
            this.readers = readers;
        }
        CompoundMetadataReader.prototype.getDirectiveMetadata = function (node) {
            var e_2, _a;
            try {
                for (var _b = tslib_1.__values(this.readers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var reader = _c.value;
                    var meta = reader.getDirectiveMetadata(node);
                    if (meta !== null) {
                        return meta;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return null;
        };
        CompoundMetadataReader.prototype.getNgModuleMetadata = function (node) {
            var e_3, _a;
            try {
                for (var _b = tslib_1.__values(this.readers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var reader = _c.value;
                    var meta = reader.getNgModuleMetadata(node);
                    if (meta !== null) {
                        return meta;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return null;
        };
        CompoundMetadataReader.prototype.getPipeMetadata = function (node) {
            var e_4, _a;
            try {
                for (var _b = tslib_1.__values(this.readers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var reader = _c.value;
                    var meta = reader.getPipeMetadata(node);
                    if (meta !== null) {
                        return meta;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return null;
        };
        return CompoundMetadataReader;
    }());
    exports.CompoundMetadataReader = CompoundMetadataReader;
    function afterUnderscore(str) {
        var pos = str.indexOf('_');
        if (pos === -1) {
            throw new Error("Expected '" + str + "' to contain '_'");
        }
        return str.substr(pos + 1);
    }
    /** Returns whether a class declaration has the necessary class fields to make it injectable. */
    function hasInjectableFields(clazz, host) {
        var members = host.getMembersOfClass(clazz);
        return members.some(function (_a) {
            var isStatic = _a.isStatic, name = _a.name;
            return isStatic && (name === 'ɵprov' || name === 'ɵfac');
        });
    }
    exports.hasInjectableFields = hasInjectableFields;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvbWV0YWRhdGEvc3JjL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUVILCtCQUFpQztJQUVqQyxtRUFBc0Q7SUFDdEQseUVBQXlKO0lBQ3pKLGtGQUF3RDtJQUt4RCxTQUFnQix5QkFBeUIsQ0FDckMsT0FBdUIsRUFBRSxHQUFnQixFQUN6QyxxQkFBd0M7UUFDMUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDNUIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUVELE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO1lBQzdCLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUEyQiwwQkFBYSxDQUFDLE9BQU8sQ0FBRyxDQUFDLENBQUM7YUFDdEU7WUFDRCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ3hCLElBQUEsS0FBZSwyQ0FBOEIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQTNELElBQUksVUFBQSxFQUFFLElBQUksVUFBaUQsQ0FBQztZQUNuRSxJQUFJLENBQUMsb0NBQXVCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQW9DLDBCQUFhLENBQUMsSUFBSSxDQUFHLENBQUMsQ0FBQzthQUM1RTtZQUNELElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzFDLHdGQUF3RjtnQkFDeEYsdUVBQXVFO2dCQUN2RSxPQUFPLElBQUks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QU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWEsR0FBRyxxQkFBa0IsQ0FBQyxDQUFDO1NBQ3JEO1FBQ0QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsZ0dBQWdHO0lBQ2hHLFNBQWdCLG1CQUFtQixDQUFDLEtBQXVCLEVBQUUsSUFBb0I7UUFDL0UsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLEVBQWdCO2dCQUFmLFFBQVEsY0FBQSxFQUFFLElBQUksVUFBQTtZQUFNLE9BQUEsUUFBUSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxJQUFJLEtBQUssTUFBTSxDQUFDO1FBQWpELENBQWlELENBQUMsQ0FBQztJQUMvRixDQUFDO0lBSEQsa0RBR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7T3duaW5nTW9kdWxlLCBSZWZlcmVuY2V9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9uLCBDbGFzc01lbWJlciwgQ2xhc3NNZW1iZXJLaW5kLCBpc05hbWVkQ2xhc3NEZWNsYXJhdGlvbiwgUmVmbGVjdGlvbkhvc3QsIHJlZmxlY3RUeXBlRW50aXR5VG9EZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge25vZGVEZWJ1Z0luZm99IGZyb20gJy4uLy4uL3V0aWwvc3JjL3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0RpcmVjdGl2ZU1ldGEsIERpcmVjdGl2ZVR5cGVDaGVja01ldGEsIE1ldGFkYXRhUmVhZGVyLCBOZ01vZHVsZU1ldGEsIFBpcGVNZXRhLCBUZW1wbGF0ZUd1YXJkTWV0YX0gZnJvbSAnLi9hcGknO1xuaW1wb3J0IHtDbGFzc1Byb3BlcnR5TWFwcGluZywgQ2xhc3NQcm9wZXJ0eU5hbWV9IGZyb20gJy4vcHJvcGVydHlfbWFwcGluZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0UmVmZXJlbmNlc0Zyb21UeXBlKFxuICAgIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBkZWY6IHRzLlR5cGVOb2RlLFxuICAgIGJlc3RHdWVzc093bmluZ01vZHVsZTogT3duaW5nTW9kdWxlfG51bGwpOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj5bXSB7XG4gIGlmICghdHMuaXNUdXBsZVR5cGVOb2RlKGRlZikpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICByZXR1cm4gZGVmLmVsZW1lbnRzLm1hcChlbGVtZW50ID0+IHtcbiAgICBpZiAoIXRzLmlzVHlwZVF1ZXJ5Tm9kZShlbGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBUeXBlUXVlcnlOb2RlOiAke25vZGVEZWJ1Z0luZm8oZWxlbWVudCl9YCk7XG4gICAgfVxuICAgIGNvbnN0IHR5cGUgPSBlbGVtZW50LmV4cHJOYW1lO1xuICAgIGNvbnN0IHtub2RlLCBmcm9tfSA9IHJlZmxlY3RUeXBlRW50aXR5VG9EZWNsYXJhdGlvbih0eXBlLCBjaGVja2VyKTtcbiAgICBpZiAoIWlzTmFtZWRDbGFzc0RlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIG5hbWVkIENsYXNzRGVjbGFyYXRpb246ICR7bm9kZURlYnVnSW5mbyhub2RlKX1gKTtcbiAgICB9XG4gICAgaWYgKGZyb20gIT09IG51bGwgJiYgIWZyb20uc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgICAvLyBUaGUgc3ltYm9sIHdhcyBpbXBvcnRlZCB1c2luZyBhbiBhYnNvbHV0ZSBtb2R1bGUgc3BlY2lmaWVyIHNvIHJldHVybiBhIHJlZmVyZW5jZSB0aGF0XG4gICAgICAvLyB1c2VzIHRoYXQgYWJzb2x1dGUgbW9kdWxlIHNwZWNpZmllciBhcyBpdHMgYmVzdCBndWVzcyBvd25pbmcgbW9kdWxlLlxuICAgICAgcmV0dXJuIG5ldyBSZWZlcmVuY2UoXG4gICAgICAgICAgbm9kZSwge3NwZWNpZmllcjogZnJvbSwgcmVzb2x1dGlvbkNvbnRleHQ6IGRlZi5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIGxvY2FsIHN5bWJvbHMgb3Igc3ltYm9scyB0aGF0IHdlcmUgaW1wb3J0ZWQgdXNpbmcgYSByZWxhdGl2ZSBtb2R1bGUgaW1wb3J0IGl0IGlzXG4gICAgICAvLyBhc3N1bWVkIHRoYXQgdGhlIHN5bWJvbCBpcyBleHBvcnRlZCBmcm9tIHRoZSBwcm92aWRlZCBiZXN0IGd1ZXNzIG93bmluZyBtb2R1bGUuXG4gICAgICByZXR1cm4gbmV3IFJlZmVyZW5jZShub2RlLCBiZXN0R3Vlc3NPd25pbmdNb2R1bGUpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkU3RyaW5nVHlwZSh0eXBlOiB0cy5UeXBlTm9kZSk6IHN0cmluZ3xudWxsIHtcbiAgaWYgKCF0cy5pc0xpdGVyYWxUeXBlTm9kZSh0eXBlKSB8fCAhdHMuaXNTdHJpbmdMaXRlcmFsKHR5cGUubGl0ZXJhbCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gdHlwZS5saXRlcmFsLnRleHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkU3RyaW5nTWFwVHlwZSh0eXBlOiB0cy5UeXBlTm9kZSk6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9IHtcbiAgaWYgKCF0cy5pc1R5cGVMaXRlcmFsTm9kZSh0eXBlKSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICBjb25zdCBvYmo6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gIHR5cGUubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XG4gICAgaWYgKCF0cy5pc1Byb3BlcnR5U2lnbmF0dXJlKG1lbWJlcikgfHwgbWVtYmVyLnR5cGUgPT09IHVuZGVmaW5lZCB8fCBtZW1iZXIubmFtZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICF0cy5pc1N0cmluZ0xpdGVyYWwobWVtYmVyLm5hbWUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlID0gcmVhZFN0cmluZ1R5cGUobWVtYmVyLnR5cGUpO1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIG9ialttZW1iZXIubmFtZS50ZXh0XSA9IHZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRTdHJpbmdBcnJheVR5cGUodHlwZTogdHMuVHlwZU5vZGUpOiBzdHJpbmdbXSB7XG4gIGlmICghdHMuaXNUdXBsZVR5cGVOb2RlKHR5cGUpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGNvbnN0IHJlczogc3RyaW5nW10gPSBbXTtcbiAgdHlwZS5lbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICBpZiAoIXRzLmlzTGl0ZXJhbFR5cGVOb2RlKGVsKSB8fCAhdHMuaXNTdHJpbmdMaXRlcmFsKGVsLmxpdGVyYWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlcy5wdXNoKGVsLmxpdGVyYWwudGV4dCk7XG4gIH0pO1xuICByZXR1cm4gcmVzO1xufVxuXG4vKipcbiAqIEluc3BlY3RzIHRoZSBjbGFzcycgbWVtYmVycyBhbmQgZXh0cmFjdHMgdGhlIG1ldGFkYXRhIHRoYXQgaXMgdXNlZCB3aGVuIHR5cGUtY2hlY2tpbmcgdGVtcGxhdGVzXG4gKiB0aGF0IHVzZSB0aGUgZGlyZWN0aXZlLiBUaGlzIG1ldGFkYXRhIGRvZXMgbm90IGNvbnRhaW4gaW5mb3JtYXRpb24gZnJvbSBhIGJhc2UgY2xhc3MsIGlmIGFueSxcbiAqIG1ha2luZyB0aGlzIG1ldGFkYXRhIGludmFyaWFudCB0byBjaGFuZ2VzIG9mIGluaGVyaXRlZCBjbGFzc2VzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdERpcmVjdGl2ZVR5cGVDaGVja01ldGEoXG4gICAgbm9kZTogQ2xhc3NEZWNsYXJhdGlvbiwgaW5wdXRzOiBDbGFzc1Byb3BlcnR5TWFwcGluZyxcbiAgICByZWZsZWN0b3I6IFJlZmxlY3Rpb25Ib3N0KTogRGlyZWN0aXZlVHlwZUNoZWNrTWV0YSB7XG4gIGNvbnN0IG1lbWJlcnMgPSByZWZsZWN0b3IuZ2V0TWVtYmVyc09mQ2xhc3Mobm9kZSk7XG4gIGNvbnN0IHN0YXRpY01lbWJlcnMgPSBtZW1iZXJzLmZpbHRlcihtZW1iZXIgPT4gbWVtYmVyLmlzU3RhdGljKTtcbiAgY29uc3QgbmdUZW1wbGF0ZUd1YXJkcyA9IHN0YXRpY01lbWJlcnMubWFwKGV4dHJhY3RUZW1wbGF0ZUd1YXJkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKGd1YXJkKTogZ3VhcmQgaXMgVGVtcGxhdGVHdWFyZE1ldGEgPT4gZ3VhcmQgIT09IG51bGwpO1xuICBjb25zdCBoYXNOZ1RlbXBsYXRlQ29udGV4dEd1YXJkID0gc3RhdGljTWVtYmVycy5zb21lKFxuICAgICAgbWVtYmVyID0+IG1lbWJlci5raW5kID09PSBDbGFzc01lbWJlcktpbmQuTWV0aG9kICYmIG1lbWJlci5uYW1lID09PSAnbmdUZW1wbGF0ZUNvbnRleHRHdWFyZCcpO1xuXG4gIGNvbnN0IGNvZXJjZWRJbnB1dEZpZWxkcyA9XG4gICAgICBuZXcgU2V0KHN0YXRpY01lbWJlcnMubWFwKGV4dHJhY3RDb2VyY2VkSW5wdXQpXG4gICAgICAgICAgICAgICAgICAuZmlsdGVyKChpbnB1dE5hbWUpOiBpbnB1dE5hbWUgaXMgQ2xhc3NQcm9wZXJ0eU5hbWUgPT4gaW5wdXROYW1lICE9PSBudWxsKSk7XG5cbiAgY29uc3QgcmVzdHJpY3RlZElucHV0RmllbGRzID0gbmV3IFNldDxDbGFzc1Byb3BlcnR5TmFtZT4oKTtcbiAgY29uc3Qgc3RyaW5nTGl0ZXJhbElucHV0RmllbGRzID0gbmV3IFNldDxDbGFzc1Byb3BlcnR5TmFtZT4oKTtcbiAgY29uc3QgdW5kZWNsYXJlZElucHV0RmllbGRzID0gbmV3IFNldDxDbGFzc1Byb3BlcnR5TmFtZT4oKTtcblxuICBmb3IgKGNvbnN0IGNsYXNzUHJvcGVydHlOYW1lIG9mIGlucHV0cy5jbGFzc1Byb3BlcnR5TmFtZXMpIHtcbiAgICBjb25zdCBmaWVsZCA9IG1lbWJlcnMuZmluZChtZW1iZXIgPT4gbWVtYmVyLm5hbWUgPT09IGNsYXNzUHJvcGVydHlOYW1lKTtcbiAgICBpZiAoZmllbGQgPT09IHVuZGVmaW5lZCB8fCBmaWVsZC5ub2RlID09PSBudWxsKSB7XG4gICAgICB1bmRlY2xhcmVkSW5wdXRGaWVsZHMuYWRkKGNsYXNzUHJvcGVydHlOYW1lKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoaXNSZXN0cmljdGVkKGZpZWxkLm5vZGUpKSB7XG4gICAgICByZXN0cmljdGVkSW5wdXRGaWVsZHMuYWRkKGNsYXNzUHJvcGVydHlOYW1lKTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLm5hbWVOb2RlICE9PSBudWxsICYmIHRzLmlzU3RyaW5nTGl0ZXJhbChmaWVsZC5uYW1lTm9kZSkpIHtcbiAgICAgIHN0cmluZ0xpdGVyYWxJbnB1dEZpZWxkcy5hZGQoY2xhc3NQcm9wZXJ0eU5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFyaXR5ID0gcmVmbGVjdG9yLmdldEdlbmVyaWNBcml0eU9mQ2xhc3Mobm9kZSk7XG5cbiAgcmV0dXJuIHtcbiAgICBoYXNOZ1RlbXBsYXRlQ29udGV4dEd1YXJkLFxuICAgIG5nVGVtcGxhdGVHdWFyZHMsXG4gICAgY29lcmNlZElucHV0RmllbGRzLFxuICAgIHJlc3RyaWN0ZWRJbnB1dEZpZWxkcyxcbiAgICBzdHJpbmdMaXRlcmFsSW5wdXRGaWVsZHMsXG4gICAgdW5kZWNsYXJlZElucHV0RmllbGRzLFxuICAgIGlzR2VuZXJpYzogYXJpdHkgIT09IG51bGwgJiYgYXJpdHkgPiAwLFxuICB9O1xufVxuXG5mdW5jdGlvbiBpc1Jlc3RyaWN0ZWQobm9kZTogdHMuTm9kZSk6IGJvb2xlYW4ge1xuICBpZiAobm9kZS5tb2RpZmllcnMgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBub2RlLm1vZGlmaWVycy5zb21lKFxuICAgICAgbW9kaWZpZXIgPT4gbW9kaWZpZXIua2luZCA9PT0gdHMuU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZCB8fFxuICAgICAgICAgIG1vZGlmaWVyLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuUHJvdGVjdGVkS2V5d29yZCB8fFxuICAgICAgICAgIG1vZGlmaWVyLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuUmVhZG9ubHlLZXl3b3JkKTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdFRlbXBsYXRlR3VhcmQobWVtYmVyOiBDbGFzc01lbWJlcik6IFRlbXBsYXRlR3VhcmRNZXRhfG51bGwge1xuICBpZiAoIW1lbWJlci5uYW1lLnN0YXJ0c1dpdGgoJ25nVGVtcGxhdGVHdWFyZF8nKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IGlucHV0TmFtZSA9IGFmdGVyVW5kZXJzY29yZShtZW1iZXIubmFtZSk7XG4gIGlmIChtZW1iZXIua2luZCA9PT0gQ2xhc3NNZW1iZXJLaW5kLlByb3BlcnR5KSB7XG4gICAgbGV0IHR5cGU6IHN0cmluZ3xudWxsID0gbnVsbDtcbiAgICBpZiAobWVtYmVyLnR5cGUgIT09IG51bGwgJiYgdHMuaXNMaXRlcmFsVHlwZU5vZGUobWVtYmVyLnR5cGUpICYmXG4gICAgICAgIHRzLmlzU3RyaW5nTGl0ZXJhbChtZW1iZXIudHlwZS5saXRlcmFsKSkge1xuICAgICAgdHlwZSA9IG1lbWJlci50eXBlLmxpdGVyYWwudGV4dDtcbiAgICB9XG5cbiAgICAvLyBPbmx5IHByb3BlcnR5IG1lbWJlcnMgd2l0aCBzdHJpbmcgbGl0ZXJhbCB0eXBlICdiaW5kaW5nJyBhcmUgY29uc2lkZXJlZCBhcyB0ZW1wbGF0ZSBndWFyZC5cbiAgICBpZiAodHlwZSAhPT0gJ2JpbmRpbmcnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtpbnB1dE5hbWUsIHR5cGV9O1xuICB9IGVsc2UgaWYgKG1lbWJlci5raW5kID09PSBDbGFzc01lbWJlcktpbmQuTWV0aG9kKSB7XG4gICAgcmV0dXJuIHtpbnB1dE5hbWUsIHR5cGU6ICdpbnZvY2F0aW9uJ307XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gZXh0cmFjdENvZXJjZWRJbnB1dChtZW1iZXI6IENsYXNzTWVtYmVyKTogc3RyaW5nfG51bGwge1xuICBpZiAobWVtYmVyLmtpbmQgIT09IENsYXNzTWVtYmVyS2luZC5Qcm9wZXJ0eSB8fCAhbWVtYmVyLm5hbWUuc3RhcnRzV2l0aCgnbmdBY2NlcHRJbnB1dFR5cGVfJykpIHtcbiAgICByZXR1cm4gbnVsbCE7XG4gIH1cbiAgcmV0dXJuIGFmdGVyVW5kZXJzY29yZShtZW1iZXIubmFtZSk7XG59XG5cbi8qKlxuICogQSBgTWV0YWRhdGFSZWFkZXJgIHRoYXQgcmVhZHMgZnJvbSBhbiBvcmRlcmVkIHNldCBvZiBjaGlsZCByZWFkZXJzIHVudGlsIGl0IG9idGFpbnMgdGhlIHJlcXVlc3RlZFxuICogbWV0YWRhdGEuXG4gKlxuICogVGhpcyBpcyB1c2VkIHRvIGNvbWJpbmUgYE1ldGFkYXRhUmVhZGVyYHMgdGhhdCByZWFkIGZyb20gZGlmZmVyZW50IHNvdXJjZXMgKGUuZy4gZnJvbSBhIHJlZ2lzdHJ5XG4gKiBhbmQgZnJvbSAuZC50cyBmaWxlcykuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb3VuZE1ldGFkYXRhUmVhZGVyIGltcGxlbWVudHMgTWV0YWRhdGFSZWFkZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRlcnM6IE1ldGFkYXRhUmVhZGVyW10pIHt9XG5cbiAgZ2V0RGlyZWN0aXZlTWV0YWRhdGEobm9kZTogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb248dHMuRGVjbGFyYXRpb24+Pik6IERpcmVjdGl2ZU1ldGF8bnVsbCB7XG4gICAgZm9yIChjb25zdCByZWFkZXIgb2YgdGhpcy5yZWFkZXJzKSB7XG4gICAgICBjb25zdCBtZXRhID0gcmVhZGVyLmdldERpcmVjdGl2ZU1ldGFkYXRhKG5vZGUpO1xuICAgICAgaWYgKG1ldGEgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0TmdNb2R1bGVNZXRhZGF0YShub2RlOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbjx0cy5EZWNsYXJhdGlvbj4+KTogTmdNb2R1bGVNZXRhfG51bGwge1xuICAgIGZvciAoY29uc3QgcmVhZGVyIG9mIHRoaXMucmVhZGVycykge1xuICAgICAgY29uc3QgbWV0YSA9IHJlYWRlci5nZXROZ01vZHVsZU1ldGFkYXRhKG5vZGUpO1xuICAgICAgaWYgKG1ldGEgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGdldFBpcGVNZXRhZGF0YShub2RlOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbjx0cy5EZWNsYXJhdGlvbj4+KTogUGlwZU1ldGF8bnVsbCB7XG4gICAgZm9yIChjb25zdCByZWFkZXIgb2YgdGhpcy5yZWFkZXJzKSB7XG4gICAgICBjb25zdCBtZXRhID0gcmVhZGVyLmdldFBpcGVNZXRhZGF0YShub2RlKTtcbiAgICAgIGlmIChtZXRhICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBtZXRhO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZnRlclVuZGVyc2NvcmUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBwb3MgPSBzdHIuaW5kZXhPZignXycpO1xuICBpZiAocG9zID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgJyR7c3RyfScgdG8gY29udGFpbiAnXydgKTtcbiAgfVxuICByZXR1cm4gc3RyLnN1YnN0cihwb3MgKyAxKTtcbn1cblxuLyoqIFJldHVybnMgd2hldGhlciBhIGNsYXNzIGRlY2xhcmF0aW9uIGhhcyB0aGUgbmVjZXNzYXJ5IGNsYXNzIGZpZWxkcyB0byBtYWtlIGl0IGluamVjdGFibGUuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzSW5qZWN0YWJsZUZpZWxkcyhjbGF6ejogQ2xhc3NEZWNsYXJhdGlvbiwgaG9zdDogUmVmbGVjdGlvbkhvc3QpOiBib29sZWFuIHtcbiAgY29uc3QgbWVtYmVycyA9IGhvc3QuZ2V0TWVtYmVyc09mQ2xhc3MoY2xhenopO1xuICByZXR1cm4gbWVtYmVycy5zb21lKCh7aXNTdGF0aWMsIG5hbWV9KSA9PiBpc1N0YXRpYyAmJiAobmFtZSA9PT0gJ8m1cHJvdicgfHwgbmFtZSA9PT0gJ8m1ZmFjJykpO1xufVxuIl19