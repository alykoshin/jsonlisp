/** @format */

import {
  readUniversal,
  resolveToFile,
} from './fileUtils/read-write/universalFileUtils';
import {absPathname} from './fileUtils/fileUtils';

export interface SimplePlugin {}

export type PluginDependencies = string[];

export interface Plugin extends SimplePlugin {
  dependencies?: PluginDependencies;
}

export type PluginMap<T> = Record<string, T>;

export class SimplePlugins<T extends SimplePlugin> {
  plugins: PluginMap<T> = {};

  _plug(pluginMap: PluginMap<T>): void {
    Object.keys(pluginMap).reduce((acc, k) => {
      if (this.plugins[k])
        console.warn(`WARN: Plugin name "${k}" overrides another plugin`);
      acc[k] = pluginMap[k];
      return acc;
    }, this.plugins);
  }

  async plug(name: string): Promise<void> {
    if (!this.plugged(name)) {
      const plugin = await this._load(name);
      this._plug({[name]: plugin});
    }
  }

  plugged(name: string): boolean {
    return !!this.plugins[name];
  }

  async _load(fname: string): Promise<T> {
    const plugin = await this._loadLocal(fname);
    return plugin;
  }

  async _loadLocal(fname: string): Promise<T> {
    if (!fname) throw new Error('Pathname expected');
    let pathname = absPathname(fname);
    pathname = resolveToFile(pathname);
    const plugin = await readUniversal(pathname);
    return plugin;
  }
}

export class Plugins<T extends Plugin> extends SimplePlugins<T> {
  plugins: PluginMap<T> = {};

  async _plugDeps(plugin: T): Promise<void> {
    const deps = plugin.dependencies ?? [];
    for (const d of deps) {
      await this.plug(d);
    }
  }

  async plug(name: string): Promise<void> {
    if (!this.plugged(name)) {
      const plugin = await this._load(name);
      await this._plugDeps(plugin);
      this._plug({[name]: plugin});
    }
  }

  _dependencies(name: string): string[] {
    const plugin = this.plugins[name];
    return plugin.dependencies ?? [];
  }
}
