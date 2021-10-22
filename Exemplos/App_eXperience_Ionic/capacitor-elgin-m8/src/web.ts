import { WebPlugin } from '@capacitor/core';

import type { m8PluginPlugin } from './definitions';

export class m8PluginWeb extends WebPlugin implements m8PluginPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
