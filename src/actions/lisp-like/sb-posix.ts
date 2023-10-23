/** @format */

import {fn_check_params} from '../../apps/runner/lib/util';
import {
  ExecutorFn,
  Actions,
  Parameters,
  ensureString,
} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';
import {stringify} from './helpers/print';
import {series} from './helpers/series';

/**
 * @module sb-posix
 *
 * @see Package: SB-POSIX -- {@list https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/}
 */

/**
 * @name setenv
 *
 * @see
 * - Function: SB-POSIX:SETENV -- {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/SETENV.html} <br>
 * - sbcl/contrib/sb-posix/interface.lisp -- {@link https://github.com/sbcl/sbcl/blob/master/contrib/sb-posix/interface.lisp} <br>
 */
export const setenv: ExecutorFn = async function (_, params, st) {
  const {evaluate, logger} = st;
  fn_check_params(params, {exactCount: [2, 3]});
  // const [pName, pValue, pOverwrite] = await series(params, evaluate);
  const [pName, pValue, pOverwrite] = params;
  const eName = await evaluate(pName);
  ensureString(eName);
  const eValue = await evaluate(pValue);
  const eOverwrite = await evaluate(pOverwrite);
  const res = process.env[eName];
  logger.debug(`$${eName}="${eName}"`);
  return res;
};

/**
 * @name getenv
 * @see
 * - Function: SB-POSIX:GETENV -- {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/GETENV.html} <br>
 * - Function: SB-EXT:POSIX-GETENV -- {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-ext/function/POSIX-GETENV.html} <br>
 * - sbcl/contrib/sb-posix/interface.lisp -- {@link https://github.com/sbcl/sbcl/blob/master/contrib/sb-posix/interface.lisp#L966C19-L966C19} <br>
 */
export const getenv: ExecutorFn = async function (
  _,
  params,
  {evaluate, logger}
) {
  fn_check_params(params, {exactCount: 1});
  const [pName] = params;
  const eName = await evaluate(pName);
  ensureString(eName);
  const res = process.env[eName];
  logger.debug(`$${eName}="${eName}"`);
  return res;
};

/**
 * @name chdir
 * @see Function: SB-POSIX:MKDIR --
 * {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/MKDIR.html} <br>
 * {@link https://www.opennet.ru/man.shtml?topic=chdir} <br>
 *
 */
export const chdir: ExecutorFn = async function (_, params, {evaluate}) {
  fn_check_params(params, {exactCount: 1});
  const dir = await evaluate(params[0]);
  ensureString(dir);
  const res = process.chdir(dir);
  return 0;
};

/**
 * @name getcwd
 */
export const getcwd: ExecutorFn = async function (_, params, {logger}) {
  fn_check_params(params, {exactCount: 0});
  const res = process.cwd();
  logger.debug(stringify(res));
  return res;
};

export const actions: Actions = {
  setenv,
  getenv,
  chdir,
  getcwd,
};

export default actions;
