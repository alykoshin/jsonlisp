/** @format */

/**
 * @module eval/eval
 * [machinery] The dispatcher — McCarthy's universal function with the
 * vocabulary externalized into the action table. Clause-by-clause mapping
 * onto jmc.lisp's eval. is documented in ARCHITECTURE.md.
 *
 * Dispatch:
 *   non-empty list, list head    -> lambda-form application (apply.ts)
 *   non-empty list, string head  -> named action: list-valued | function | error
 *   string atom                  -> bound: scope value; unbound: `${...}`-templated string
 *   anything else (incl. [])     -> self-evaluates
 */

import stringUtils from '@utilities/string';
import {
  Actions,
  Parameter,
  isList,
  isEmptyList,
  ExecutorFn,
  List,
  isString,
  isFunction,
  Expression,
} from './sexpr';
import {State} from './environment';
import {validateArgs} from './validate-args';
import {EvaluationError} from './conditions';
import {execFunction, evaluateListList} from './apply';

//

function isVarName(name: string, st: State): boolean {
  return st.scopes.get(name) !== undefined;
}

async function evaluateAtomVar(expr: string, st: State): Promise<Parameter> {
  const value = st.scopes.get(expr);
  if (value !== undefined) {
    return value;
  }
  return undefined;
}

async function evaluateAtomString(expr: string, st: State): Promise<string> {
  // * Handle as string
  // * Replace templates if enabled
  const ENABLE_STRING_TEMPLATES = true;
  if (ENABLE_STRING_TEMPLATES) {
    // ! This is not effective
    const flattenedScopes = st.scopes.merged()._scope;
    // !
    expr = stringUtils.literalTemplate(expr, flattenedScopes);
  }
  return expr;
}

/** Named-action position: `["name", ...args]`. */
async function evaluateNamedForm(
  name: string,
  e: List,
  st: State
): Promise<Expression> {
  const action = st.actions[name];

  if (isList(action)) {
    // list-valued action: evaluate its body (call args are not passed —
    // list actions read their inputs from the scope)
    return await eval_(name, [action], st);
  }

  if (isFunction(action)) {
    return await execFunction(action as ExecutorFn, name, e.slice(1), st);
  }

  throw new EvaluationError(
    e,
    `Expect first element in unquoted list` +
      ` to be a name of function/action,` +
      ` but its definition not found for "${name}"\n\n`
  );
}

async function evalExpr(e: Expression, st: State): Promise<Expression> {
  if (isList(e) && !isEmptyList(e)) {
    const head = e[0];
    if (isList(head)) return evaluateListList(head, e.slice(1), st);
    if (isString(head)) return evaluateNamedForm(head, e, st);
    throw new EvaluationError(e, `First argument must be string or List`);
  }

  if (isString(e) && !isEmptyList(e)) {
    if (isVarName(e, st)) return evaluateAtomVar(e, st);
    return evaluateAtomString(e, st);
  }

  // atoms and the empty list self-evaluate
  return e;
}

/**
 * @name eval
 */
export const eval_: ExecutorFn = async function (_, args, st) {
  st.logger.debug('eval_:enter');
  st.next();
  st.tracer?.guard(st.level);

  const [expr] = validateArgs(args, {exactCount: 1});

  const res = evalExpr(expr, st);

  st.logger.debug('eval_:exit');
  return res;
};

export const actions: Actions = {
  eval: eval_,
};

export default actions;
