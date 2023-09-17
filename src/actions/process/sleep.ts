import { fn_check_params } from "../../lib/util";
import {ActionMethodState,Parameters} from "../../lib/runner";

export async function sleep(
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner, logger}: ActionMethodState
) {
  fn_check_params(parameters, {exactCount: 1})

  const pValue = await runner.eval(parameters[0], fullConfig, {level, logger});
  const sValue = Number(pValue)

  logger.debug(`sleep ${sValue} seconds`)
  await new Promise((resolve, _reject) => setTimeout(resolve, sValue * 1000));
  logger.log(`sleep done`)
}

export default sleep;
