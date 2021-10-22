import { registerPlugin } from '@capacitor/core';
const m8Plugin = registerPlugin('m8Plugin', {
    web: () => import('./web').then(m => new m.m8PluginWeb()),
});
export * from './definitions';
export { m8Plugin };
//# sourceMappingURL=index.js.map