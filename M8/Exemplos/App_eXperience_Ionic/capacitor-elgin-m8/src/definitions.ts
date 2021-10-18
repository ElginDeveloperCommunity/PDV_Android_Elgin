export interface m8PluginPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  testing(options: { value:string }) : Promise<{ value: string }>;
}
