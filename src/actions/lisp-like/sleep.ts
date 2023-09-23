import {fn_check_params} from "../../lib/util";
import {ActionMethodState, Parameters} from "../../lib/runner";

export async function sleep(
  action: string,
  parameters: Parameters,
  state: ActionMethodState
) {
  const {runner, logger} = state;
  fn_check_params(parameters, {exactCount: 1})

  const pValue = await runner.eval(parameters[0], state);
  const nValue = Number(pValue)

  logger.debug(`sleep ${nValue} seconds`)
  await new Promise((resolve, _reject) => setTimeout(resolve, nValue * 1000));
  logger.log(`sleep done`)
}

export default sleep;
