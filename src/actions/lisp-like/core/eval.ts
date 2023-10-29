/** @format */

import stringUtils from '@utilities/string';
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
  isString,
  ensureFunction,
  Expression,
  Atom,
} from '../../../apps/runner/lib/types';
import {State} from '../../../apps/runner/lib/state';
import {series, seriesn} from '../helpers/series';
import {validateArgs} from '../../../apps/runner/lib/validateArgs';

//

/**
 * @module eval
 */

export const execNamedAction = async (
  op: string,
  args: Parameters,
  st: State
): Promise<Expression> => {
  st.logger.debug(`eval: execNamedAction: "${op}"`);
  const action = st.actions[op];
  // console.log('state:', state);
  // console.log('action:', action);
  // console.log('op:', op);
  if (isList(action)) {
    return eval_(op, [action], st);
  } else {
    ensureFunction(action, `function definition not found for "${op}"`);
    try {
      return (action as Function).call(st, op, args, st);
    } catch (e1) {
      throw new Error(`Error executing "${op}"`, {cause: e1});
    }
  }
};

async function evaluateListAtom(
  arg0: string,
  args: List,
  st: State
): Promise<Expression> {
  st = st.newNextUp(arg0);

  return execNamedAction(arg0, args, st);
}

async function evaluateListList(
  arg0: List,
  args: List,
  st: State
): Promise<Expression> {
  st.logger.debug(`evaluateListList`, arg0);

  const [arg0_arg0, ...args0_args] = arg0;
  ensureString(arg0_arg0);

  st = st.newNextUp(arg0_arg0);

  st.logger.debug(`evaluateListList`, arg0);

  // ensureList(args2);
  const arg_values = await series(args, st);

  st.logger.debug(`evaluateListList: arg_values:`, arg_values);

  const preparedFn = await execNamedAction(arg0_arg0, args0_args, st);
  ensureFunction(preparedFn);

  const res = preparedFn(arg0_arg0, arg_values, st);

  // logger.debug(`eval state at exit:`, st);
  return res;
}

async function evaluateList(expr: List, st: State): Promise<Expression> {
  const [arg0, ...args] = expr;
  // let {logger} = st;

  if (isString(arg0)) {
    // return execNamedAction(op1, args, st);

    return evaluateListAtom(arg0, args, st);
    //
  } else if (isList(arg0)) {
    return evaluateListList(arg0, args, st);
  }
  // } else if (isFunction(expr)) {
  // expr();
  //
}

async function evaluateAtom(expr: Atom, st: State): Promise<Atom> {
  let {logger} = st;
  // * isAtom || isEmptyList
  logger.debug(`evaluateAtom: in: (${typeof expr}) "${JSON.stringify(expr)}"`);

  if (isString(expr)) {
    //
    // logger.debug(
    // `evaluateAtom: in: (${typeof expr}) "${JSON.stringify(expr)}"`
    // );
    // st = st.newNextUp(expr);
    // st = st.next();
    // logger.debug(
    // `evaluateAtom: in: (${typeof expr}) "${JSON.stringify(expr)}"`
    // );

    // * This may be either string or symbol
    // * as there is no convenient way to differentiate them inside JSON

    // * Handle as symbol
    const value = st.scopes.get(expr);
    if (value !== undefined) {
      expr = value;
      // logger.debug(
      // `evaluateAtom: var: (${typeof expr}) "${JSON.stringify(expr)}"`
      // );
    } else {
      // * Handle as string
      // * Replace templates if enabled
      const ENABLE_STRING_TEMPLATES = true;
      if (ENABLE_STRING_TEMPLATES) {
        // ! This is not effective
        const flattenedScopes = st.scopes.merged()._scope;
        // !
        expr = stringUtils.literalTemplate(expr, flattenedScopes);
      }
    }
  }
  logger.debug(`evaluateAtom: out: (${typeof expr}) "${JSON.stringify(expr)}"`);
  return expr;
}

/**
 * @name eval
 */
export const eval_: ExecutorFn = async function (_, args, st) {
  st.logger.debug('eval_:enter');
  st.next();

  const [expr] = validateArgs(args, {exactCount: 1});

  let res;
  if (isList(expr) && !isEmptyList(expr)) {
    st.logger.debug('eval_:enter:list');
    res = await evaluateList(expr, st);
  } else if (!isEmptyList(expr)) {
    st.logger.debug('eval_:enter:atom');
    res = await evaluateAtom(expr, st);
  } else {
    st.logger.debug('eval_:enter:else');
    res = expr;
  }
  st.logger.debug('eval_:exit');
  return res;
};

export const actions: Actions = {
  eval: eval_,
};

export default actions;
