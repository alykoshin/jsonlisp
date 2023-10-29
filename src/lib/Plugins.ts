/** @format */

import {
  readUniversal,
  resolveToFile,
} from './fileUtils/read-write/universalFileUtils';
import {absPathname} from './fileUtils/fileUtils';

export interface Plugin {
  dependencies?: string[];
}

type PluginMap<T> = Record<string, T>;

export class Plugins<T extends Plugin> {
  plugins: PluginMap<T> = {};

  _plug(pluginMap: PluginMap<T>): void {
    // console.log(`>>> Plugins: _plug "${name}"`, plugin);
    // this.plugins[name] = plugin;
    // return plugin;
    this.plugins = {...this.plugins, ...pluginMap};
  }

  // async _plug(name: string, plugin: T): Promise<T> {
  //   console.log(`>>> Plugins: _plug "${name}"`, plugin);
  //   this.plugins[name] = plugin;
  //   return plugin;
  // }

  // async _plug(plugin: T): Promise<T> {
  //   if (!Array.isArray(names)) names = [names];
  //   const result: T[] = [];
  //   for (const n of names) {
  //     const p = (await this._loadLocal(n)) as T;
  //     this.plugins[n] = p;
  //     result.push(p);
  //   }
  //   return result;
  // }

  // async _plug(names: string[]): Promise<T> {
  // for (const n of names) {
  // await this._plug(n);
  // }
  //
  // const p = (await this._loadLocal(name)) as T;
  // this.plugins[name] = p;
  // return p;
  // }

  async plug(name: string): Promise<Plugins<T>> {
    // console.log(`>>> Plugins: plug "${name}"`, this.plugged(name));
    if (this.plugged(name)) return this; //.plugins[name];
    //
    // console.log(`>>> Plugins: plug "${name}"`, 1);
    const plugin = await this._load(name);

    const deps = plugin.dependencies ?? [];
    for (const d of deps) {
      this.plug(d);
    }
    this._plug({[name]: plugin});
    return this;
  }

  plugged(name: string): boolean {
    return !!this.plugins[name];
  }

  _dependencies(name: string): string[] {
    const plugin = this.plugins[name];
    return plugin.dependencies ?? [];
  }

  async _load(fname: string): Promise<T> {
    const plugin = await this._loadLocal(fname);
    // const deps = await this._loadDependencies(plugin);
    return plugin;
  }

  // async _loadSingle(fname: string): Promise<T> {
  //   const plugin = await this._loadLocal(fname);
  //   return plugin;
  // }

  // async _loadDependencies(plugin: T): Promise<PluginMap<T>> {
  //   const res: PluginMap<T> = {};
  //   const deps = plugin.dependencies;
  //   for (const d in deps) {
  //     res[d] = await this._load(d);
  //   }
  //   return res;
  // }

  async _loadLocal(fname: string): Promise<T> {
    if (!fname) throw new Error('Pathname expected');
    // console.log(`Plugins: loadLocal "${fname}"`);
    let pathname = absPathname(fname);
    pathname = resolveToFile(pathname);
    const plugin = await readUniversal(pathname);
    // console.log(`Plugins: loadLocal "${fname}"`, plugin);
    return plugin;
  }

  // async _loadDependencies(name: string) Promise<void>{
  // }
  // async _readLocal(origPathname?: string): Promise<any> {
  // if (!origPathname) throw new Error('Pathname expected');
  // let pathname = absPathname(origPathname);
  // return readUniversal(pathname);
  // }
}
