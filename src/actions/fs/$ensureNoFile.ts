import {ensureNoFile} from "../../helpers/fsUtils";
import {ActionListExecutor, ActionMethodState, Parameters} from "../../lib/runner";
import {fn_check_params} from "../../lib/util";

export const $ensureNoFile: ActionListExecutor = async function (
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner, logger}: ActionMethodState
): Promise<Parameters> {
  fn_check_params(parameters, {minCount: 1});

  logger.debug(`$ensureNoFile: parameters: ${JSON.stringify(parameters)}`);
  const result: Parameters = [];
  for (const p of parameters) {
    const pFilename = await runner.eval(p, fullConfig, {level, logger});
    const sFilename = String(pFilename);

    logger.debug(`$ensureNoFile ${sFilename}`)
    await ensureNoFile(sFilename);

    result.push(sFilename);
  }
  return result;
}

export default $ensureNoFile;
