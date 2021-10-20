import type { JsonObject } from '@angular-devkit/core';
import type { CordovaBuildBuilderSchema } from '../cordova-build/schema';
import type { CordovaServeBuilderSchema } from '../cordova-serve/schema';
export declare function validateBuilderConfig(builderOptions: CordovaBuildBuilderSchema): CordovaBuildBuilderSchema;
export declare function prepareBrowserConfig(options: CordovaBuildBuilderSchema | CordovaServeBuilderSchema | any, browserOptions: any): JsonObject;
export interface GlobalScriptsByBundleName {
    bundleName: string;
    paths: string[];
    inject: boolean;
}
export interface FormattedAssets {
    globalScriptsByBundleName: GlobalScriptsByBundleName[];
    copyWebpackPluginPatterns: any[];
}
export declare function prepareServerConfig(options: CordovaServeBuilderSchema, root: string): FormattedAssets;
