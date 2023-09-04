import {FullConfig} from "../lib/config";
import {Runner} from "../lib/runner";

export interface SleepAction {
  action: 'sleep'
  value: number
}

export async function action_sleep(
  definition: SleepAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner}
) {
  const {action, value} = definition;
  // log_data(message, action);
  runner.debug(id, `sleep ${value}ms`)
  await new Promise((resolve, _reject) => setTimeout(resolve, value));
  runner.log(id, `sleep done`)
}
