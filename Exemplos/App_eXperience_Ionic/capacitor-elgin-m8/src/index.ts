import { registerPlugin } from '@capacitor/core';

import type { m8PluginPlugin } from './definitions';

const m8Plugin = registerPlugin<m8PluginPlugin>('m8Plugin', {
  web: () => import('./web').then(m => new m.m8PluginWeb()),
});

export * from './definitions';
export { m8Plugin };
