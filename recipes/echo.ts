import {FullConfig} from "../config.ts";
import {log_data} from "../log.ts";

export interface EchoAction {
  action: 'echo'
  value: string
}

export async function action_echo(actionConfig: EchoAction, _fullConfig: FullConfig) {
  const {action, value} = actionConfig;
  log_data(value, action);
}
