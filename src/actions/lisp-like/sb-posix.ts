/** @format */

import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {
  ExecutorFn,
  Actions,
  Parameters,
  ensureString,
  ensureBoolean,
  ensureNumber,
} from './helpers/types';
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
  validateArgs(params, {exactCount: [3]});
  // const [pName, pValue, pOverwrite] = await series(params, evaluate);
  const [pName, pValue, pOverwrite] = params;
  const eName = await evaluate(pName);
  ensureString(eName);

  const eValue = await evaluate(pValue);
  ensureString(eValue);

  let eOverwrite = await evaluate(pOverwrite);
  /*
    ?  if (eOverwrite === undefined) eOverwrite = 0;
   */ ensureNumber(eOverwrite);

  const curr = process.env[eName];
  if (!curr || eOverwrite !== 0) {
    process.env[eName] = eValue;
  }
  const res = process.env[eName];
  logger.debug(`$${eName}="${curr}" (old) <= "${res}" (new)`);
  return res;
};

/**
 * @name unsetenv
 *
 * @see
 * - Function: SB-POSIX:UNSETENV -- {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/UNSETENV.html} <br>
 * - sbcl/contrib/sb-posix/interface.lisp -- {@link https://github.com/sbcl/sbcl/blob/master/contrib/sb-posix/interface.lisp} <br>
 */
export const unsetenv: ExecutorFn = async function (_, params, st) {
  const {evaluate, logger} = st;
  validateArgs(params, {exactCount: [1]});
  const [pName] = params;
  const eName = await evaluate(pName);
  ensureString(eName);

  delete process.env[eName];

  const res = process.env[eName];
  logger.debug(`$${eName}="${res}"`);
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
  validateArgs(params, {exactCount: 1});
  const [pName] = params;
  const eName = await evaluate(pName);
  ensureString(eName);
  const res = process.env[eName];
  logger.debug(`$${eName}="${res}"`);
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
  validateArgs(params, {exactCount: 1});
  const dir = await evaluate(params[0]);
  ensureString(dir);
  const res = process.chdir(dir);
  return 0;
};

/**
 * @name getcwd
 */
export const getcwd: ExecutorFn = async function (_, params, {logger}) {
  validateArgs(params, {exactCount: 0});
  const res = process.cwd();
  logger.debug(stringify(res));
  return res;
};

export const actions: Actions = {
  unsetenv,
  setenv,
  getenv,
  chdir,
  getcwd,
};

export default actions;
