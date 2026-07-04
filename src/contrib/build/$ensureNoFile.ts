/** @format */

import {ensureNoFile} from '../../lib/fileUtils/fileUtils';
import {ExecutorFn, Parameters} from '../../eval/sexpr';
import {State} from '../../eval/environment';
import {validateArgs} from '../../eval/validate-args';

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
