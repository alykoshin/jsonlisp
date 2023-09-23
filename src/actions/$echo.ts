import { fn_check_params } from "../lib/util";
import {
  ActionMethodState,
  Parameters,
} from "../lib/runner";
import print from "../helpers/print";

export async function $echo(
  action: string,
  parameters: Parameters,
  state: ActionMethodState
) {
  const {runner, logger} = state;
  fn_check_params(parameters, {minCount: 0})

  let res: string[] = [];
  for (const p of parameters) {
    const value = await runner.eval(p, state);
    res.push(String(value))
  }
  // logger.info(res.join(', '));
  print(...res);
}

export default $echo
