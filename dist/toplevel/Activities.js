"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activities = void 0;
const ajv_1 = __importDefault(require("ajv"));
const log_1 = require("../lib/log");
const Plugins_1 = require("./Plugins");
const activity_schema_json_1 = __importDefault(require("./activity.schema.json"));
const ajv = new ajv_1.default({ allowUnionTypes: true });
const validateActivity = ajv.compile(activity_schema_json_1.default);
class Activities extends Plugins_1.Plugins {
    /**
     * Schema validation at load time (activity.schema.json via ajv): works
     * for every syntax (.jl.json5/.json/.ts/...) because JSON Schema applies
     * to the PARSED object — editor-side $schema support does not exist for
     * .json5, so this is the real enforcement. Lenient about extra keys,
     * strict about types of the known ones (catches `require:` vs
     * `requires:`-class typos).
     */
    async _load(fname) {
        const activity = await super._load(fname);
        if (!validateActivity(activity)) {
            const errors = (validateActivity.errors ?? [])
                .map((e) => `  ${e.instancePath || '(root)'} ${e.message}`)
                .join('\n');
            throw new Error(`Invalid activity "${fname}":\n${errors}`);
        }
        return activity;
    }
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
            if (!plugin.actions)
                throw new Error(`actions property cannot be empty for "${pluginName}"`);
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
    /**
     * Union of `requires` across all plugged activities; undefined when no
     * activity declares one (-> full vocabulary).
     */
    requires() {
        let declared = false;
        const all = [];
        Object.values(this.plugins).forEach((p) => {
            if (p.requires) {
                declared = true;
                all.push(...p.requires);
            }
        });
        return declared ? all : undefined;
    }
}
exports.Activities = Activities;
//# sourceMappingURL=Activities.js.map