/** @format */

import {ActionDefinition, Actions} from '../lib/types';

import {ErrorLevel} from '../../../lib/log';
import {Plugin, Plugins} from '../../../lib/Plugins';

export type ActivityActionsDefinition = Actions & {
  default: ActionDefinition;
};

export interface Activity extends Plugin {
  base_dir: string;
  version: string;
  logLevel?: ErrorLevel;
  actions: ActivityActionsDefinition;
}

export class Activities extends Plugins<Activity> {
  // async plug(name: string): Promise<Activities> {
  // const current = super.plug(name);
  // return this;
  // }

  actions() {
    // console.log('Object.keys(this.plugins):', Object.keys(this.plugins));
    const r = Object.keys(this.plugins).reduce((acc, cur) => {
      // console.log(
      //   'acc:', acc,
      //   'cur:', cur,
      //   'this.plugins[cur]:', this.plugins[cur]
      // );
      return {...acc, ...this.plugins[cur].actions};
    }, {});
    // console.log('r:', r);
    return r;
  }
}
