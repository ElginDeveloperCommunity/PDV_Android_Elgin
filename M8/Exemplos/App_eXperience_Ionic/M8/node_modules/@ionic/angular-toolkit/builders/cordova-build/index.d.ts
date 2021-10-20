import type { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import type { json } from '@angular-devkit/core';
import type { CordovaBuildBuilderSchema } from './schema';
export declare function buildCordova(options: CordovaBuildBuilderSchema, context: BuilderContext): Promise<BuilderOutput>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<json.JsonObject & CordovaBuildBuilderSchema>;
export default _default;
