import {Parameters, ActionListExecutor, ActionMethodState, Parameter} from "../../lib/runner";
import {removeDirRecursive} from '../../helpers/fsUtils'
import {fn_check_params} from "../../lib/util";

export const cleanup: ActionListExecutor = async function (
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner, logger}: ActionMethodState
): Promise<Parameter[]> {
  fn_check_params(parameters, {minCount: 1});
  const result: Parameters = [];
  for (const p of parameters) {
    const pFirname = await runner.eval(p, fullConfig, {level, logger});
    const sDirname = String(pFirname);

    logger.debug(`cleanup ${sDirname}`)
    const res = await removeDirRecursive(sDirname);

    result.push(sDirname);
  }
  return result;
}

export default cleanup
