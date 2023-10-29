/** @format */
export interface Plugin {
    dependencies?: string[];
}
type PluginMap<T> = Record<string, T>;
export declare class Plugins<T extends Plugin> {
    plugins: PluginMap<T>;
    _plug(pluginMap: PluginMap<T>): void;
    plug(name: string): Promise<Plugins<T>>;
    plugged(name: string): boolean;
    _dependencies(name: string): string[];
    _load(fname: string): Promise<T>;
    _loadLocal(fname: string): Promise<T>;
}
export {};
