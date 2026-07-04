/** @format */

/**
 * @module eval/apply
 * [machinery] The application half of the eval/apply pair (SICP §4.1):
 * resolving a named action and invoking an executor function.
 *
 * `evaluateListList` is lambda-form application — the only applicative-order
 * spot in the evaluator: outer args are pre-evaluated (evlis), unlike named
 * actions, which receive raw args (every action is a special form — see
 * ARCHITECTURE.md, divergence 1).
 */

import {
  Parameters,
  isList,
  ExecutorFn,
  List,
  ensureString,
  ensureFunction,
  Expression,
} from './sexpr';
import {State} from './environment';
import {EvaluationError} from './conditions';
import {series} from './evlis';
import {eval_} from './eval';

export const execNamedAction = async (
  name: string,
  args: Parameters,
  st: State
): Promise<Expression> => {
  st.logger.debug(`eval: execNamedAction: "${name}"`);

  const action = st.actions[name];

  if (isList(action)) {
    // list-valued action: evaluate its body (call args are not passed —
    // list actions read their inputs from the scope)
    return await eval_(name, [action], st);
  } else {
    ensureFunction(action, `function definition not found for "${name}"\n\n`);
    return await execFunction(action as ExecutorFn, name, args, st);
  }
};

/** The single error-wrapping site for executor invocation. */
export const execFunction = async (
  fn: ExecutorFn,
  name: string,
  args: Parameters,
  st: State
): Promise<Expression> => {
  st.logger.debug(`evaluateFunction: "${name}"`);
  try {
    return fn.call(st, name, args, st);
  } catch (e1) {
    throw new EvaluationError([name, ...args], `Error executing "${fn}"`, {
      cause: e1,
    });
  }
};

/** Lambda-form application: `[["lambda", ...], arg1, ...]`. */
export async function evaluateListList(
  outer_arg0: List,
  outer_args: List,
  st: State
): Promise<Expression> {
  st.logger.debug(`evaluateListList`, outer_arg0);

  const [inner_arg0, ...inner_args] = outer_arg0;
  ensureString(inner_arg0);

  st = st.newNextUp(inner_arg0);

  const outer_arg_values = await series(outer_args, st);

  st.logger.debug(`evaluateListList: outer_arg_values:`, outer_arg_values);

  const preparedFn = await execNamedAction(inner_arg0, inner_args, st);
  ensureFunction(preparedFn);

  const res = preparedFn(inner_arg0, outer_arg_values, st);

  return res;
}
