"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugins = exports.SimplePlugins = void 0;
const universalFileUtils_1 = require("./fileUtils/read-write/universalFileUtils");
const fileUtils_1 = require("./fileUtils/fileUtils");
class SimplePlugins {
    plugins = {};
    _plug(pluginMap) {
        Object.keys(pluginMap).reduce((acc, k) => {
            if (this.plugins[k])
                console.warn(`WARN: Plugin name "${k}" overrides another plugin`);
            acc[k] = pluginMap[k];
            return acc;
        }, this.plugins);
    }
    async plug(name) {
        if (!this.plugged(name)) {
            const plugin = await this._load(name);
            this._plug({ [name]: plugin });
        }
    }
    plugged(name) {
        return !!this.plugins[name];
    }
    async _load(fname) {
        const plugin = await this._loadLocal(fname);
        return plugin;
    }
    async _loadLocal(fname) {
        if (!fname)
            throw new Error('Pathname expected');
        let pathname = (0, fileUtils_1.absPathname)(fname);
        pathname = (0, universalFileUtils_1.resolveToFile)(pathname);
        const plugin = await (0, universalFileUtils_1.readUniversal)(pathname);
        return plugin;
    }
}
exports.SimplePlugins = SimplePlugins;
class Plugins extends SimplePlugins {
    plugins = {};
    async _plugDeps(plugin) {
        const deps = plugin.dependencies ?? [];
        for (const d of deps) {
            await this.plug(d);
        }
    }
    async plug(name) {
        if (!this.plugged(name)) {
            const plugin = await this._load(name);
            await this._plugDeps(plugin);
            this._plug({ [name]: plugin });
        }
    }
    _dependencies(name) {
        const plugin = this.plugins[name];
        return plugin.dependencies ?? [];
    }
}
exports.Plugins = Plugins;
//# sourceMappingURL=Plugins.js.map