import {FullConfig} from "../lib/config";

export interface SleepAction {
  action: 'sleep'
  value: number
}

export async function action_sleep(actionConfig: SleepAction, _fullConfig: FullConfig) {
  const {action, value} = actionConfig;
  // log_data(message, action);
  return await new Promise((resolve, _reject) => setTimeout(resolve, value));
}
