/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AngularPluginSymbol, FileEmitterCollection } from './symbol';
export declare function angularWebpackLoader(this: import('webpack').LoaderContext<unknown> & {
    [AngularPluginSymbol]?: FileEmitterCollection;
}, content: string, map: string): void;
export { angularWebpackLoader as default };
