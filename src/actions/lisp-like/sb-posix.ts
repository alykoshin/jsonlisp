/** @format */

import {fn_check_params} from '../../lib/util';
import {ActionMethodState, Actions, Parameters} from '../../lib/runner';
import {stringify} from './helpers/print';

/**
 * simple-parallel-tasks
 * https://codeberg.org/glv/simple-parallel-tasks
 *
 * The simple-parallel-tasks Reference Manual
 * https://quickref.common-lisp.net/simple-parallel-tasks.html
 *
 */

/**
 * Package: SB-POSIX
 * https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/
 */

/**
 * Function: SB-POSIX:SETENV
 * https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/SETENV.html
 */

/**
 * Function: SB-POSIX:GETENV
 * https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/GETENV.html
 */

/**
 * Function: SB-POSIX:MKDIR
 * https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/MKDIR.html
 */

export const actions: Actions = {
  chdir: async function (action, params, {evaluate, logger}) {
    fn_check_params(params, {exactCount: 1});
    const pCwd = await evaluate(params[0]);
    const sCwd = String(pCwd);
    const res = process.chdir(sCwd);
    return res;
  },

  getcwd: async function (action, params, {evaluate, logger}) {
    fn_check_params(params, {exactCount: 0});
    const res = process.cwd();
    logger.debug(stringify(res));
    return res;
  },
};

export default actions;
