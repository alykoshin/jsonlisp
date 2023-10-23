/** @format */

import {ExecutorFn, Parameter, Parameters} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';
import {removeDirRecursive} from '../../lib/fileUtils/fileUtils';
import {fn_check_params} from '../../apps/runner/lib/util';

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
  fn_check_params(args, {minCount: 1});

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
