import { fn_check_params } from "../../lib/util";
import {ensureFile} from "../../helpers/fsUtils";
import {ActionListExecutor, ActionMethodState, Parameters} from "../../lib/runner";

export const $ensureFile: ActionListExecutor = async function (
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner, logger}: ActionMethodState
): Promise<Parameters> {
  fn_check_params(parameters, {minCount: 1});

  logger.debug(`$ensureFile: parameters: ${JSON.stringify(parameters)}`);
  const result: Parameters = [];
  for (const p of parameters) {
    const pFilename = await runner.eval(p, fullConfig, {level, logger});
    const sFilename = String(pFilename);

    logger.debug(`$ensureFile ${sFilename}`)
    await ensureFile(sFilename);

    result.push(sFilename);
  }
  return result;
}
