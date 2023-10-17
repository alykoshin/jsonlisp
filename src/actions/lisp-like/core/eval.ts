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
  ActionListExecutor,
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
import {fn_check_params} from '../../../apps/runner/lib/util';

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
    } catch (e) {
      (e as Error).message = `Operation ${op} : ` + (e as Error).message;
      throw e;
    }
  }
};

async function evaluateList(expr: List, st: State): Promise<Expression> {
  const [op1, ...args] = expr;
  let {logger} = st;

  if (isString(op1)) {
    logger = logger.newNextUp(st.runner, {name: op1});
    st = {...st, logger};
    const evl = (expr: Expression) => st.runner.evaluate(expr, st);

    logger.debug(`eval string/symbol: "${expr}"`);
    return execNamedAction(op1, args, {...st, evaluate: evl, logger});
    //
  } else if (isList(op1)) {
    logger.debug(`eval list`, op1);

    const [op2, ...args2] = op1; // [ fn_name, arg_names, body ];
    ensureString(op2);

    logger = logger.newNextUp(st.runner, {name: op2});
    st = {...st, logger};
    const evl = (expr: Expression) => st.runner.evaluate(expr, st);

    // ensureList(args2);
    const arg_values = await series(args, st.evaluate);
    logger.debug(`evaluateList: arg_values:`, arg_values);

    const preparedFn = await execNamedAction(op2, args2, {
      ...st,
      evaluate: evl,
      logger,
    });
    ensureFunction(preparedFn);

    const res = preparedFn(op2, arg_values, st);

    // logger.debug(`eval state at exit:`, st);
    return res;
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
    logger = logger.newNextUp(st.runner, {name: expr});
    st = {...st, logger};

    // * This may be either string or symbol
    // * as there is no convenient way to differentiate them inside JSON

    // * Handle as symbol
    const value = st.scopes.get(expr);
    if (value !== undefined) {
      expr = value;
      logger.debug(
        `evaluateAtom: var: (${typeof expr}) "${JSON.stringify(expr)}"`
      );
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
export const eval_: ActionListExecutor = async function (_, args, state) {
  const [expr] = fn_check_params(args, {exactCount: 1});
  // const {logger} = state;

  // const evaluate = (args: Expression) => eval_(_, [args], state);
  // const evaluate = curry(eval_, state);

  // state = {...state, evaluate, logger: logger.newNextUp(state.runner)};
  // logger.debug(`eval state at enter:`, state);

  if (isList(expr) && !isEmptyList(expr)) {
    return await evaluateList(expr, state);
  } else if (!isEmptyList(expr)) {
    return await evaluateAtom(expr, state);
  } else {
    return expr;
  }
};

export const actions: Actions = {
  eval: eval_,
};

export default actions;
