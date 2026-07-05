/** @format */

/**
 * @module kernel/lambda
 * Denoting functions (The Roots of Lisp §2): lambda, and label as `defun`.
 * `createExecutorFn` is the closure machinery; null_ / and_ are the first
 * two derived functions of the paper's sequence (jmc.lisp: null. and.),
 * written in JL itself.
 *
 * @see
 * - Common Lisp: Working with &rest parameters --
 *   https://stackoverflow.com/questions/629699/common-lisp-working-with-rest-parameters <br>
 * - LispWorks -- Common Lisp HyperSpec -- Function APPLY --
 *   {@link http://clhs.lisp.se/Body/f_apply.htm}
 */

import {
  Actions,
  Parameter,
  ensureList,
  ExecutorFn,
  ensureString,
  isList,
  List,
} from '../eval/sexpr';
import {validateArgs} from '../eval/validate-args';
import {passArgs} from './passArgs';

//

export const createExecutorFn = function (
  name: string,
  argnames: Parameter,
  body: Parameter
): ExecutorFn {
  ensureList(argnames);
  ensureList(body);
  // Applicative, per the paper: `evlis.` runs inside eval, once, in the
  // caller's environment — here that is execFunction (apply.ts), which sees
  // the isClosure tag and evlis-es the args. The closure only binds values.
  const fn: ExecutorFn = async function lambda(_, argvalues, st) {
    const {logger} = st;

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
  fn.isClosure = true;
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
 * The paper's `label`, in its modern form: registers into the function
 * namespace (Lisp-2 divergence — see ARCHITECTURE.md).
 */
export const defun: ExecutorFn = async function (_, args, state) {
  const [name, argnames, body] = validateArgs(args, {exactCount: 3});
  ensureString(name, `Expect string as a name of function`);
  state.actions[name] = createExecutorFn(name, argnames, body);
  return name;
};

// null_ and and_ moved to kernel/derived (the paper's derived-function
// sequence lives there in full).

export const isLambdaForm = (def: unknown): def is List =>
  isList(def) && def[0] === 'lambda';

/**
 * @name compileLambdaActions
 * Load-time coercion of lambda expressions in the function namespace: an
 * actions-map value shaped `["lambda", [params...], [body...]]` denotes the
 * function itself — CL's `(setf (symbol-function 'f) (lambda ...))` /
 * `(coerce '(lambda ...) 'function)` — and is compiled to a named closure
 * here, when the map is loaded. No call-time dispatch: at runtime the map
 * holds only functions and script lists, as before. Everything not
 * lambda-shaped passes through unchanged.
 */
export function compileLambdaActions(actions: Actions, where = ''): Actions {
  const out: Actions = {};
  for (const [name, def] of Object.entries(actions)) {
    if (isLambdaForm(def)) {
      if (def.length !== 3 || !isList(def[1]) || !isList(def[2])) {
        throw new Error(
          `Malformed lambda action "${name}"${where ? ` in "${where}"` : ''}: ` +
            `expected ["lambda", [params...], [body...]], ` +
            `got ${JSON.stringify(def)}`
        );
      }
      out[name] = createExecutorFn(name, def[1], def[2]);
    } else {
      out[name] = def;
    }
  }
  return out;
}

export const actions: Actions = {
  lambda,
  defun,
};

export default actions;
