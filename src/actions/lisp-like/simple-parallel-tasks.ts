/** @format */

import {fn_check_params} from '../../apps/runner/lib/util';
import {
  ActionListExecutor,
  ActionMethodState,
  Actions,
  Parameters,
} from '../../apps/runner/lib/types';

/**
 * @module simple-parallel-tasks
 * @description <br>
 * - {@link https://codeberg.org/glv/simple-parallel-tasks} <br>
 * - The simple-parallel-tasks Reference Manual {@link https://quickref.common-lisp.net/simple-parallel-tasks.html}
 */

/** @name plist */
export const plist: ActionListExecutor = async function (_, args, {evaluate}) {
  fn_check_params(args, {minCount: 1});
  const promises = args.map((a) => evaluate(a));
  return await Promise.all(promises);
};

export const actions: Actions = {
  plist,
};

export default actions;
