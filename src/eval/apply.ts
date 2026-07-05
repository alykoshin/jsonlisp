/** @format */

/**
 * @module eval/apply
 * [machinery] The application half of the eval/apply pair (SICP §4.1):
 * resolving a named action and invoking an executor function.
 *
 * `execFunction` is the single invocation site and carries the canonical
 * function/special-operator split: closures (isClosure, made by
 * kernel/lambda) are applicative — their args are evlis-ed here, exactly
 * once, in the caller's environment (McCarthy's eval does evlis; apply only
 * binds values — SICP §4.1, CLHS 3.1.2.1.2.3). Everything else is a special
 * form and receives raw args (ARCHITECTURE.md, divergence 1).
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

/** The single invocation (and error-wrapping) site for executors. */
export const execFunction = async (
  fn: ExecutorFn,
  name: string,
  args: Parameters,
  st: State
): Promise<Expression> => {
  st.logger.debug(`evaluateFunction: "${name}"`);
  try {
    // closures are applicative: evlis once, in the caller's environment;
    // special forms receive their args raw
    const argv = fn.isClosure ? await series(args, st) : args;
    return fn.call(st, name, argv, st);
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

  const preparedFn = await execNamedAction(inner_arg0, inner_args, st);
  ensureFunction(preparedFn);

  // args go in raw; execFunction evlis-es them iff preparedFn is a closure
  return execFunction(preparedFn as ExecutorFn, inner_arg0, outer_args, st);
}
