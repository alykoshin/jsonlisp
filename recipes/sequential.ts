import {read_config,FullConfig} from '../config.ts'
import {BaseActionConfig, ActionConfig} from "./index.ts";
import {log_data} from "../log.ts";
import {run_action} from "../runner.ts";

export interface SequentialAction extends BaseActionConfig {
  action: 'sequential'
  actions: ActionConfig[]
}

export async function action_sequential(baseActionConfig: SequentialAction, fullConfig: FullConfig) {
  for (const subActionConfig of baseActionConfig.actions) {
    const {action} = baseActionConfig;
    // log(action);
    await run_action(subActionConfig, fullConfig);
  }
}
