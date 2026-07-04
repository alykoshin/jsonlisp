/** @format */

import {ExecutorFn, Parameter, Parameters} from '../../eval/sexpr';
import {State} from '../../eval/environment';
import {removeDirRecursive} from '../../lib/fileUtils/fileUtils';
import {validateArgs} from '../../eval/validate-args';

/**
 * @module $build
 */

/**
 * @name $cleanup
 */

export const $cleanup: ExecutorFn = async function (
  _,
  args,
  {evaluate, logger}
) {
  validateArgs(args, {minCount: 1});

  // const result: Parameters = [];
  // for (const p of parameters) {
  //   const pDirname = await evaluate(p);
  //   const sDirname = String(pDirname);

  //   logger.debug(`cleanup ${sDirname}`);
  //   const res = await removeDirRecursive(sDirname);

  //   result.push(sDirname);
  // }
  return evaluate(['print', ...args]);
};

export default $cleanup;
