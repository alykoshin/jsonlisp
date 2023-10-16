/** @format */

import {ensureNoFile} from './helpers/fsUtils';
import {
  ActionListExecutor,
  ActionMethodState,
  Parameters,
} from '../../apps/runner/lib/types';
import {fn_check_params} from '../../apps/runner/lib/util';

/**
 * @module $build
 */

/**
 * @name $ensureNoFile
 */
export const $ensureNoFile: ActionListExecutor = async function (
  _,
  args,
  {evaluate, logger}
) {
  fn_check_params(args, {minCount: 1});

  logger.debug(`$ensureNoFile: parameters: ${JSON.stringify(args)}`);
  const result: Parameters = [];
  for (const p of args) {
    const pFilename = await evaluate(p);
    const sFilename = String(pFilename);

    logger.debug(`$ensureNoFile ${sFilename}`);
    await ensureNoFile(sFilename);

    result.push(sFilename);
  }
  return result;
};

export default $ensureNoFile;
