/** @format */

import {
  Actions,
  Parameter,
  Parameters,
  isAtom,
  isList,
  isEmptyList,
  ensureList,
  ExecutorFn,
  T,
  NIL,
  List,
  ensureString,
  Expression,
  Atom,
} from '../helpers/types';
import {State} from '../../../apps/runner/lib/state';
import {asBoolean} from '../helpers/types';
import {series, seriesn} from '../helpers/series';
import {validateArgs} from '../../../apps/runner/lib/validateArgs';
import {cons} from './primitives';
import {passArgs} from '../helpers/passArgs';

//

/**
 * @module functions
 * @see
 * - Common Lisp: Working with &rest parameters --
 *   https://stackoverflow.com/questions/629699/common-lisp-working-with-rest-parameters <br>
 * - LispWorks -- Common Lisp HyperSpec -- Function APPLY --
 *   {@link http://clhs.lisp.se/Body/f_apply.htm}
 */

export const createExecutorFn = function (
  name: string,
  argnames: Parameter,
  body: Parameter
): ExecutorFn {
  ensureList(argnames);
  ensureList(body);
  const fn: ExecutorFn = async function lambda(_, argvalues, st) {
    const {evaluate, runner, logger, scopes} = st;
    argvalues = await series(argvalues, st);

    const sc = passArgs(argnames, argvalues);
    logger.debug('lambda:execute: scope:', sc, ',body:', body);

    st = st.newNextUp(name);
    st.scopes = st.scopes.copy().new(sc);
    // st.scopes.push(sc);
    logger.debug('lambda:execute: scopes:', st.scopes);

    const res = await st.evaluate(body);
    logger.debug('lambda:execute: res:', res);

    return res;
  };
  return fn;
};

/**
 * @name lambda
 * @see
 * - An Introduction to Programming in Emacs Lisp -- C.4.3 A lambda Expression: Useful Anonymity --
 *   {@link https://www.gnu.org/software/emacs/manual/html_node/eintr/lambda.html} <br>
 * - An Introduction to Programming in Emacs Lisp -- 13.2 Lambda Expressions --
 *   {@link https://www.gnu.org/software/emacs/manual/html_node/elisp/Lambda-Expressions.html} <br>
 * - Common Lisp the Language, 2nd Edition -- 5.2.2. Lambda-Expressions --
 *   {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node64.html} <br>
 */
export const lambda: ExecutorFn = async function (_, args, {evaluate}) {
  const [argnames, body] = validateArgs(args, {exactCount: 2});
  return createExecutorFn('lambda', argnames, body);
};

/**
 * @name defun
 */
export const defun: ExecutorFn = async function (_, args, state) {
  const [name, argnames, body] = validateArgs(args, {exactCount: 3});
  ensureString(name, `Expect string as a name of function`);
  state.actions[name] = createExecutorFn(name, argnames, body);
  return name;
};

/**
 * @name null_
 */
// prettier-ignore
export const null_ = createExecutorFn(
  'null_', 
  [ 'x' ], [ 'eq', 'x', [] ]
);
// export const null_: ActionListExecutor = async function (_, args, {evaluate}) {
//   const [x] = fn_check_params(args, {exactCount: 1});
//   // prettier-ignore
//   return evaluate(['eq', x, []]);
// };

/**
 * @name and_
 */
// prettier-ignore
export const and_ = createExecutorFn(
  'and_',
  ['x', 'y'],
  ['cond', ['x', ['cond', ['y', ['quote', T]], [['quote', T], ['quote', []]]]],
          [['quote', T], ['quote', []]]]);
// export const and_: ActionListExecutor = async function (_, args, {evaluate}) {
//   const [x, y] = fn_check_params(args, {exactCount: 2});
//   // prettier-ignore
//   return evaluate(
//     ['cond',
//       [x, ['cond',  [y, ['quote', T]],
//                     [['quote', T], ['quote', []]],
//       [['quote', T], ['quote', []]],
//     ]]]);
// };

export const actions: Actions = {
  lambda,
  defun,
  null_,
  and_,
};

export default actions;
