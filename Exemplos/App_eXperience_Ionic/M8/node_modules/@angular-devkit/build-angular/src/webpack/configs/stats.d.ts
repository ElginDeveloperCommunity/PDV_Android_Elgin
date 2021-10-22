/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { WebpackConfigOptions } from '../../utils/build-options';
export declare function getWebpackStatsConfig(verbose?: boolean): {
    all: boolean;
    colors: boolean;
    hash: boolean;
    timings: boolean;
    chunks: boolean;
    builtAt: boolean;
    warnings: boolean;
    errors: boolean;
    assets: boolean;
    cachedAssets: boolean;
    ids: boolean;
    entrypoints: boolean;
};
export declare function getStatsConfig(wco: WebpackConfigOptions): {
    stats: {
        all: boolean;
        colors: boolean;
        hash: boolean;
        timings: boolean;
        chunks: boolean;
        builtAt: boolean;
        warnings: boolean;
        errors: boolean;
        assets: boolean;
        cachedAssets: boolean;
        ids: boolean;
        entrypoints: boolean;
    };
};
