/** @format */
export interface SimplePlugin {
}
export type PluginDependencies = string[];
export interface Plugin extends SimplePlugin {
    dependencies?: PluginDependencies;
}
export type PluginMap<T> = Record<string, T>;
export declare class SimplePlugins<T extends SimplePlugin> {
    plugins: PluginMap<T>;
    _plug(pluginMap: PluginMap<T>): void;
    plug(name: string): Promise<void>;
    plugged(name: string): boolean;
    _load(fname: string): Promise<T>;
    _loadLocal(fname: string): Promise<T>;
}
export declare class Plugins<T extends Plugin> extends SimplePlugins<T> {
    plugins: PluginMap<T>;
    _plugDeps(plugin: T): Promise<void>;
    plug(name: string): Promise<void>;
    _dependencies(name: string): string[];
}
