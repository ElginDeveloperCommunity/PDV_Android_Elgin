/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { WebpackLoggingCallback } from '@angular-devkit/build-webpack';
import { logging } from '@angular-devkit/core';
import { Configuration, StatsCompilation } from 'webpack';
import { Schema as BrowserBuilderOptions } from '../../browser/schema';
export declare function formatSize(size: number): string;
export declare type BundleStatsData = [files: string, names: string, size: number | string];
export declare type ChunkType = 'modern' | 'legacy' | 'unknown';
export interface BundleStats {
    initial: boolean;
    stats: BundleStatsData;
    chunkType: ChunkType;
}
export declare function generateBundleStats(info: {
    size?: number;
    files?: string[];
    names?: string[];
    initial?: boolean;
    rendered?: boolean;
    chunkType?: ChunkType;
}): BundleStats;
export declare function statsWarningsToString(json: StatsCompilation, statsConfig: any): string;
export declare function statsErrorsToString(json: StatsCompilation, statsConfig: any): string;
export declare function statsHasErrors(json: StatsCompilation): boolean;
export declare function statsHasWarnings(json: StatsCompilation): boolean;
export declare function createWebpackLoggingCallback(options: BrowserBuilderOptions, logger: logging.LoggerApi): WebpackLoggingCallback;
export declare function webpackStatsLogger(logger: logging.LoggerApi, json: StatsCompilation, config: Configuration, bundleStats?: BundleStats[]): void;
