/** @format */

import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {ensureFile} from '../../lib/fileUtils/fileUtils';
import {
  ExecutorFn,
  Atom,
  Parameters,
  ensureString,
} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';

/**
 * @module $build
 */

/**
 * @name $ensureFile
 */
export const $ensureFile: ExecutorFn = async function (
  _,
  args,
  {evaluate, logger}
) {
  validateArgs(args, {minCount: 1});

  logger.debug(`$ensureFile: parameters: ${JSON.stringify(args)}`);
  const result: Parameters = [];
  for (const p of args) {
    const fname = await evaluate(p);
    ensureString(fname);

    logger.debug(`$ensureFile ${fname}`);
    await ensureFile(fname);

    result.push(fname);
  }
  return result;
};
