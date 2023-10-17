/** @format */

import {fn_check_params} from '../../apps/runner/lib/util';
import {ensureFile} from '../../lib/fileUtils/fileUtils';
import {
  ActionListExecutor,
  Atom,
  Parameters,
} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';

/**
 * @module $build
 */

/**
 * @name $ensureFile
 */
export const $ensureFile: ActionListExecutor = async function (
  _,
  args,
  {evaluate, logger}
) {
  fn_check_params(args, {minCount: 1});

  logger.debug(`$ensureFile: parameters: ${JSON.stringify(args)}`);
  const result: Parameters = [];
  for (const p of args) {
    const pFilename = await evaluate(p);
    const sFilename = String(pFilename);

    logger.debug(`$ensureFile ${sFilename}`);
    await ensureFile(sFilename);

    result.push(sFilename);
  }
  return result;
};
