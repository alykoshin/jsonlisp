import {ActionListExecutor, ActionMethodState, Parameter, Parameters} from "../../lib/runner";
import {removeDirRecursive} from '../../helpers/fsUtils'
import {fn_check_params} from "../../lib/util";

export const $cleanup: ActionListExecutor = async function (
  action: string,
  parameters: Parameters,
  state: ActionMethodState
): Promise<Parameter[]> {
  const {runner, logger} = state;
  fn_check_params(parameters, {minCount: 1});

  const result: Parameters = [];
  for (const p of parameters) {
    const pDirname = await runner.eval(p, state);
    const sDirname = String(pDirname);

    logger.debug(`cleanup ${sDirname}`)
    const res = await removeDirRecursive(sDirname);

    result.push(sDirname);
  }
  return result;
}

export default $cleanup
