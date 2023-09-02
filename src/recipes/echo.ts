import {FullConfig} from "../lib/config";
import {log_data} from "../lib/log";

export interface EchoAction {
  action: 'echo'
  value: string
}

export async function action_echo(actionConfig: EchoAction, _fullConfig: FullConfig) {
  const {action, value} = actionConfig;
  log_data(value, action);
}
