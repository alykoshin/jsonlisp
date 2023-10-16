/** @format */

import {
  ActionListExecutor,
  ActionMethodState,
  Parameter,
  Parameters,
} from '../../apps/runner/lib/types';
import {removeDirRecursive} from './helpers/fsUtils';
import {fn_check_params} from '../../apps/runner/lib/util';

/**
 * @module $build
 */

/**
 * @name $cleanup
 */

export const $cleanup: ActionListExecutor = async function (
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
