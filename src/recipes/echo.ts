import {FullConfig} from "../lib/config";
import {Runner} from "../lib/runner";

export interface EchoAction {
  action: 'echo'
  value: string
}

export async function action_echo(
  definition: EchoAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner}
) {
  const {action, value} = definition;
  runner.log(id, value);
}
