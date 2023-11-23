"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activities = void 0;
const log_1 = require("../../../lib/log");
const Plugins_1 = require("../../../lib/Plugins");
class Activities extends Plugins_1.Plugins {
    // async plug(name: string): Promise<Activities> {
    // const current = super.plug(name);
    // return this;
    // }
    actions() {
        // console.log('Object.keys(this.plugins):', Object.keys(this.plugins));
        //
        // const r = Object.keys(this.plugins).reduce((acc, cur) => {
        //   // console.log(
        //   //   'acc:', acc,
        //   //   'cur:', cur,
        //   //   'this.plugins[cur]:', this.plugins[cur]
        //   // );
        //   return {...acc, ...this.plugins[cur].actions};
        // }, {});
        // console.log('r:', r);
        // return r;
        //
        const mergedActions = {};
        Object.keys(this.plugins).forEach((pluginName) => {
            const plugin = this.plugins[pluginName];
            Object.keys(plugin.actions).forEach((actionName) => {
                const action = plugin.actions[actionName];
                if (mergedActions[actionName]) {
                    console.warn(`WARN: Activity "${pluginName}" action name "${actionName}" overrides another action`);
                }
                mergedActions[actionName] = action;
            });
        });
        return mergedActions;
    }
    logLevel() {
        return Object.keys(this.plugins).reduce((acc, pluginName) => {
            const p = this.plugins[pluginName];
            if (p.logLevel) {
                if ((0, log_1.errorLevelToNumber)(p.logLevel) > (0, log_1.errorLevelToNumber)(acc)) {
                    acc = p.logLevel;
                }
            }
            return acc;
        }, log_1.DEFAULT_ERROR_LEVEL);
    }
}
exports.Activities = Activities;
//# sourceMappingURL=Activities.js.map