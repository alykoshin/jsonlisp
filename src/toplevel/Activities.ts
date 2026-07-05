/** @format */

import Ajv from 'ajv';

import {
  ActionDefinition,
  Actions,
} from '../eval/sexpr';
import type {Require} from '../modules';

import {
  DEFAULT_ERROR_LEVEL,
  ErrorLevel,
  errorLevelToNumber,
} from '../lib/log';
import {Plugin, PluginMap, Plugins} from './Plugins';

import activitySchema from './activity.schema.json';

const ajv = new Ajv({allowUnionTypes: true});
const validateActivity = ajv.compile(activitySchema);

export type ActivityActionsDefinition = Actions & {
  default: ActionDefinition;
};

export interface Activity extends Plugin {
  base_dir: string;
  version: string;
  logLevel?: ErrorLevel;
  /**
   * Vocabulary packages this activity needs, like CL's (require :sb-posix).
   * Core (cl/jmc/jl) is always loaded. Entries: 'name' (bare + qualified
   * action names), {name, use: false} (qualified names only — CL's
   * "don't use-package" discipline), or a group (sbcl/quicklisp/host).
   * Omitted -> the full vocabulary (backward compatible).
   */
  requires?: Require[];
  actions: ActivityActionsDefinition;
}

export class Activities extends Plugins<Activity> {
  /**
   * Schema validation at load time (activity.schema.json via ajv): works
   * for every syntax (.jl.json5/.json/.ts/...) because JSON Schema applies
   * to the PARSED object — editor-side $schema support does not exist for
   * .json5, so this is the real enforcement. Lenient about extra keys,
   * strict about types of the known ones (catches `require:` vs
   * `requires:`-class typos).
   */
  async _load(fname: string): Promise<Activity> {
    const activity = await super._load(fname);
    if (!validateActivity(activity)) {
      const errors = (validateActivity.errors ?? [])
        .map((e) => `  ${e.instancePath || '(root)'} ${e.message}`)
        .join('\n');
      throw new Error(`Invalid activity "${fname}":\n${errors}`);
    }
    return activity;
  }

  actions(): Actions {
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

    const mergedActions: Actions = {};
    Object.keys(this.plugins).forEach((pluginName) => {
      const plugin = this.plugins[pluginName];
      if (!plugin.actions)
        throw new Error(`actions property cannot be empty for "${pluginName}"`);

      Object.keys(plugin.actions).forEach((actionName) => {
        const action = plugin.actions[actionName];
        if (mergedActions[actionName]) {
          console.warn(
            `WARN: Activity "${pluginName}" action name "${actionName}" overrides another action`
          );
        }
        mergedActions[actionName] = action;
      });
    });
    return mergedActions;
  }

  logLevel(): ErrorLevel {
    return Object.keys(this.plugins).reduce<ErrorLevel>((acc, pluginName) => {
      const p = this.plugins[pluginName];
      if (p.logLevel) {
        if (errorLevelToNumber(p.logLevel) > errorLevelToNumber(acc)) {
          acc = p.logLevel;
        }
      }
      return acc;
    }, DEFAULT_ERROR_LEVEL);
  }

  /**
   * Union of `requires` across all plugged activities; undefined when no
   * activity declares one (-> full vocabulary).
   */
  requires(): Require[] | undefined {
    let declared = false;
    const all: Require[] = [];
    Object.values(this.plugins).forEach((p) => {
      if (p.requires) {
        declared = true;
        all.push(...p.requires);
      }
    });
    return declared ? all : undefined;
  }
}
