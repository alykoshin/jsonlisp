/** @format */

import {ensureNoFile} from '../../lib/fileUtils/fileUtils';
import {ExecutorFn, Parameters} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';
import {validateArgs} from '../../apps/runner/lib/validateArgs';

/**
 * @module $build
 */

/**
 * @name $ensureNoFile
 */
export const $ensureNoFile: ExecutorFn = async function (
  _,
  args,
  {evaluate, logger}
) {
  validateArgs(args, {minCount: 1});

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
