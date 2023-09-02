import {ActionConfig} from "./index";

import {FullConfig} from "../lib/config";
import {run_action} from "../lib/runner";

export interface ParallelAction {
  action: 'parallel'
  actions: ActionConfig[]
}

export async function action_parallel(actionConfig: ParallelAction, fullConfig: FullConfig) {
  // for (const step of actionConfig.actions) {
  //   const {action} = actionConfig;
  //   // log(action);
  const promises = actionConfig.actions.map(a => run_action(a, fullConfig));
  // }
  return await Promise.all(promises);
}
