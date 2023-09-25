import {fn_check_params} from "../../lib/util";
import {ActionMethodState, Parameters,} from "../../lib/runner";
import {confirm as confirm_} from '../../helpers/confirm';

export async function $confirm(
  action: string,
  parameters: Parameters,
  state: ActionMethodState
) {
  const {runner, logger} = state;
  fn_check_params(parameters, {exactCount: [0, 1]})

  const value = parameters.length === 1
    ? String(await runner.eval(parameters[0], state))
    : 'Confirm y/[N]?';
  const res = await confirm_(value);

  logger.info(`confirm: ${res}`);
  return res;
}

export default $confirm
