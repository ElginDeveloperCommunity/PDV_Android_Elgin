"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptPathsPlugin = void 0;
const path = __importStar(require("path"));
const getInnerRequest = require('enhanced-resolve/lib/getInnerRequest');
class TypeScriptPathsPlugin {
    constructor(options) {
        this.options = options;
    }
    update(options) {
        this.options = options;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apply(resolver) {
        const target = resolver.ensureHook('resolve');
        resolver.getHook('described-resolve').tapAsync('TypeScriptPathsPlugin', 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (request, resolveContext, callback) => {
            if (!this.options) {
                callback();
                return;
            }
            if (!request || request.typescriptPathMapped) {
                callback();
                return;
            }
            const originalRequest = getInnerRequest(resolver, request);
            if (!originalRequest) {
                callback();
                return;
            }
            // Only work on Javascript/TypeScript issuers.
            if (!request.context.issuer || !request.context.issuer.match(/\.[jt]sx?$/)) {
                callback();
                return;
            }
            // Relative or absolute requests are not mapped
            if (originalRequest.startsWith('.') || originalRequest.startsWith('/')) {
                callback();
                return;
            }
            // Ignore all webpack special requests
            if (originalRequest.startsWith('!!')) {
                callback();
                return;
            }
            const replacements = findReplacements(originalRequest, this.options.paths || {});
            const tryResolve = () => {
                var _a;
                const potential = replacements.shift();
                if (!potential) {
                    callback();
                    return;
                }
                const potentialRequest = {
                    ...request,
                    request: path.resolve(((_a = this.options) === null || _a === void 0 ? void 0 : _a.baseUrl) || '', potential),
                    typescriptPathMapped: true,
                };
                resolver.doResolve(target, potentialRequest, '', resolveContext, 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (error, result) => {
                    if (error) {
                        callback(error);
                    }
                    else if (result) {
                        callback(undefined, result);
                    }
                    else {
                        tryResolve();
                    }
                });
            };
            tryResolve();
        });
    }
}
exports.TypeScriptPathsPlugin = TypeScriptPathsPlugin;
function findReplacements(originalRequest, paths) {
    // check if any path mapping rules are relevant
    const pathMapOptions = [];
    for (const pattern in paths) {
        // get potentials and remove duplicates; JS Set maintains insertion order
        const potentials = Array.from(new Set(paths[pattern]));
        if (potentials.length === 0) {
            // no potential replacements so skip
            continue;
        }
        // can only contain zero or one
        const starIndex = pattern.indexOf('*');
        if (starIndex === -1) {
            if (pattern === originalRequest) {
                pathMapOptions.push({
                    starIndex,
                    partial: '',
                    potentials,
                });
            }
        }
        else if (starIndex === 0 && pattern.length === 1) {
            if (potentials.length === 1 && potentials[0] === '*') {
                // identity mapping -> noop
                continue;
            }
            pathMapOptions.push({
                starIndex,
                partial: originalRequest,
                potentials,
            });
        }
        else if (starIndex === pattern.length - 1) {
            if (originalRequest.startsWith(pattern.slice(0, -1))) {
                pathMapOptions.push({
                    starIndex,
                    partial: originalRequest.slice(pattern.length - 1),
                    potentials,
                });
            }
        }
        else {
            const [prefix, suffix] = pattern.split('*');
            if (originalRequest.startsWith(prefix) && originalRequest.endsWith(suffix)) {
                pathMapOptions.push({
                    starIndex,
                    partial: originalRequest.slice(prefix.length).slice(0, -suffix.length),
                    potentials,
                });
            }
        }
    }
    if (pathMapOptions.length === 0) {
        return [];
    }
    // exact matches take priority then largest prefix match
    pathMapOptions.sort((a, b) => {
        if (a.starIndex === -1) {
            return -1;
        }
        else if (b.starIndex === -1) {
            return 1;
        }
        else {
            return b.starIndex - a.starIndex;
        }
    });
    const replacements = [];
    pathMapOptions.forEach((option) => {
        for (const potential of option.potentials) {
            let replacement;
            const starIndex = potential.indexOf('*');
            if (starIndex === -1) {
                replacement = potential;
            }
            else if (starIndex === potential.length - 1) {
                replacement = potential.slice(0, -1) + option.partial;
            }
            else {
                const [prefix, suffix] = potential.split('*');
                replacement = prefix + option.partial + suffix;
            }
            replacements.push(replacement);
        }
    });
    return replacements;
}
