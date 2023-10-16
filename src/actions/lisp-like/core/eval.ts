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
  ActionMethodState,
  Atom,
} from '../../../apps/runner/lib/types';
import {asBoolean} from '../helpers/typecast';
import {series, seriesn} from '../helpers/series';
import {fn_check_params} from '../../../apps/runner/lib/util';
import {Scope} from '@utilities/object/dist/script-scopes';
import {zipObject} from '../helpers/zipObject';
import {isFunction} from 'lodash';

//

/**
 * @module eval
 */

const callFn = async (
  op: string,
  args: Parameters,
  state: ActionMethodState<Atom>
): Promise<Expression> => {
  state.logger.debug(`eval: evalFn: "${op}"`);
  const action = state.actions[op];
  if (isList(action)) {
    return _eval(op, [action], state);
  } else {
    ensureFunction(action, `function definition not found for "${op}"`);
    try {
      return (action as Function).call(state, op, args, state);
    } catch (e) {
      (e as Error).message = `Operation ${op} : ` + (e as Error).message;
      throw e;
    }
  }
};

async function evaluateList(
  expr: List,
  st: ActionMethodState<Atom>
): Promise<Expression> {
  const [op1, ...args] = expr;
  const {evaluate, logger} = st;

  if (isString(op1)) {
    logger.debug(`eval string/symbol (${typeof expr})`, expr);
    return callFn(op1, args, st);
  } else if (isList(op1)) {
    logger.debug(`eval list`, op1);
    const [op2, ...args2] = op1; // [ fn_name, arg_names, body ];
    ensureString(op2);
    // ensureList(args2);
    const arg_values = await series(args, evaluate);
    logger.debug(`evaluateList: arg_values:`, arg_values);
    const preparedFn = await callFn(op2, args2, st);

    ensureFunction(preparedFn);

    const res = preparedFn(op2, arg_values, st);

    // logger.debug(`eval state at exit:`, st);
    return res;
  }
  // } else if (isFunction(expr)) {
  // expr();
  //
}

async function evaluateAtom(
  expr: Atom,
  state: ActionMethodState<Atom>
): Promise<Atom> {
  // * isAtom || isEmptyList
  state.logger.debug(
    `evaluateAtom: in: (${typeof expr}) "${JSON.stringify(expr)}"`
  );

  if (isString(expr)) {
    // * This may be either string or symbol
    // * as there is no convenient way to differentiate them inside JSON

    // * Handle as symbol
    const value = state.scopes.get(expr);
    if (value !== undefined) {
      expr = value;
      state.logger.debug(
        `evaluateAtom: var: (${typeof expr}) "${JSON.stringify(expr)}"`
      );
    } else {
      // * Handle as string
      // * Replace templates if enabled
      const ENABLE_STRING_TEMPLATES = true;
      if (ENABLE_STRING_TEMPLATES) {
        // ! This is not effective
        const flattenedScopes = state.scopes.merged()._scope;
        // !
        expr = stringUtils.literalTemplate(expr, flattenedScopes);
      }
    }
  }
  state.logger.debug(
    `evaluateAtom: out: (${typeof expr}) "${JSON.stringify(expr)}"`
  );
  return expr;
}

/**
 * @name eval
 */
export const _eval: ActionListExecutor = async function (_, args, state) {
  const [expr] = fn_check_params(args, {exactCount: 1});
  const {logger} = state;
  const evaluate = (args: Expression) => _eval(_, [args], state);

  state = {...state, evaluate, logger: logger.newNextUp()};
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
  eval: _eval,
};

export default actions;
