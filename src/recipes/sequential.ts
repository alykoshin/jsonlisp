import {FullConfig} from '../lib/config'
import {BaseActionConfig, ActionConfig} from "./";
// import {log_data} from "../lib/log";
import {run_action} from "../lib/runner";

export interface SequentialAction extends BaseActionConfig {
  action: 'sequential'
  actions: ActionConfig[]
}

export async function action_sequential(baseActionConfig: SequentialAction, fullConfig: FullConfig) {
  for (const subActionConfig of baseActionConfig.actions) {
    // const {action} = baseActionConfig;
    // log(action);
    await run_action(subActionConfig, fullConfig);
  }
}
