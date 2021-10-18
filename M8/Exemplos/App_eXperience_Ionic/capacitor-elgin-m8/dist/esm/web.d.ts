import { WebPlugin } from '@capacitor/core';
import type { m8PluginPlugin } from './definitions';
export declare class m8PluginWeb extends WebPlugin implements m8PluginPlugin {
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
}
