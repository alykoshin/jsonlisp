import { fn_check_params } from "../../lib/util";
import {
  ActionMethodState,
  AtomDefinition,
  Parameters
} from "../../lib/runner";

// export type SequentialAction = [
//   action: 'sequential',
//   ...actions: ActionDefinition[],
// ]

export async function series(
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner, logger}: ActionMethodState
): Promise<AtomDefinition[]> {
  fn_check_params(parameters, {minCount: 2})

  const result = [];
  for (const p of parameters) {
    // const {action} = baseActionConfig;
    // log(action);
    const res = await runner.eval(p, fullConfig, {level, logger});
    result.push(res);
  }
  return result;
}

export default series;
