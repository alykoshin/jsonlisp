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
} from '../helpers/types';
import {State} from '../../../apps/runner/lib/state';
import {series, seriesn} from '../helpers/series';
import {validateArgs} from '../../../apps/runner/lib/validateArgs';
import {isArray, isFunction} from 'lodash';

//

class EEvalError extends Error {
  expression: Expression;
  constructor(expr: Expression, message?: string, options?: any) {
    const m = `Error during eval: ${message}`;
    super(m + ': "' + JSON.stringify(expr) + '"', options);
    this.expression = expr;
  }
}

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

  if (isList(action)) {
    return await eval_(op, [action], st);
  } else {
    ensureFunction(action, `function definition not found for "${op}"`);
    return await execFunction(action as ExecutorFn, op, args, st);
  }
};

export const execFunction = async (
  fn: ExecutorFn,
  name: string,
  args: Parameters,
  st: State
): Promise<Expression> => {
  st.logger.debug(`evaluateFunction: "${name}"`);
  // const fn = st.actions[op];
  // ensureFunction(fn, `function definition not found for "${fn}"`);
  try {
    return fn.call(st, name, args, st);
    // return (fn as Function).call(st, fn, args, st);
  } catch (e1) {
    throw new EEvalError([name, ...args], `Error executing "${fn}"`, {
      cause: e1,
    });
  }
};

async function evaluateListAtom(
  arg0: string,
  args: List,
  st: State
): Promise<Expression> {
  st.logger.debug(`evaluateListAtom: "${arg0}"`);
  st = st.newNextUp(arg0);

  return execNamedAction(arg0, args, st);
}

async function evaluateListList(
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

  // logger.debug(`eval state at exit:`, st);
  return res;
}

/* 
async function evaluateList(expr: List, st: State): Promise<Expression> {
  const [arg0, ...args] = expr;
  // let {logger} = st;

  if (isString(arg0)) {
    return evaluateListAtom(arg0, args, st);
    //
  } else if (isList(arg0)) {
    return evaluateListList(arg0, args, st);
  }
  // } else if (isFunction(expr)) {
  // expr();
  //
}
*/

/* 
function matchReserved(expr: string): boolean {
  return isString(expr) && expr.startsWith('$');
}
 */
function isVarName(expr: string, st: State): boolean {
  return st.scopes.get(expr) !== undefined;
}

async function evaluateAtomVar(expr: string, st: State): Promise<Parameter> {
  const value = st.scopes.get(expr);
  if (value !== undefined) {
    return value;
    // logger.debug(
    // `evaluateAtom: var: (${typeof expr}) "${JSON.stringify(expr)}"`
    // );
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

/* async function evaluateAtomDefault(expr: Atom, st: State): Promise<Atom> {
  // do nothing, return unchanged expr
  return expr;
}
 */
/* async function evaluateAtom(expr: Atom, st: State): Promise<Atom> {
  let {logger} = st;
  logger.debug(`evaluateAtom: in: (${typeof expr}) "${JSON.stringify(expr)}"`);

  // * isAtom || isEmptyList
  if (isString(expr)) {
    // * This may be either string or symbol
    // * as there is no convenient way to differentiate them inside JSON
    // * Handle as symbol
    if (isVarName(expr, st)) {
      expr = evaluateAtomVar(expr, st);
    } else {
      expr = evaluateAtomString(expr, st);
    }
  } else {
    expr = evaluateAtomDefault(expr, st);
  }
  logger.debug(`evaluateAtom: out: (${typeof expr}) "${JSON.stringify(expr)}"`);
  return expr;
}
 */
type RuleIf = (e: any, st: State) => boolean;
type RuleDo = (e: any, st: State) => Promise<Expression>;
interface Rule {
  if?: RuleIf;
  do?: RuleDo | Rule[];
}

const rules: Rule[] = [
  {
    if: (e) => isList(e) && !isEmptyList(e),
    do: [
      {
        if: (e) => isList(e[0]),
        do: (e, st) => evaluateListList(e[0], e.slice(1), st),
      },
      {
        if: (e) => isString(e[0]),
        do: (e, st) => evaluateListAtom(e[0], e.slice(1), st),
      },
      {
        // if: all other cases (default rule)
        do: (e, st) => {
          throw new EEvalError(e, `First argument must be string or List`);
        },
      },
    ],
  },
  {
    if: (e, st) => !isEmptyList(e),
    do: [
      {
        if: (e, st) => isString(e),
        do: [
          {
            if: (e, st) => isVarName(e, st),
            do: (e, st) => evaluateAtomVar(e, st),
          },
          {
            // if:
            do: (e, st) => evaluateAtomString(e, st),
          },
        ],
      },
      {
        // if:
        // do:
      },
    ],
  },
  // {
  //   if: (e: Expression) => !isEmptyList(e),
  //   do: (e: Expression, st: State) => evaluateAtom(e, st),
  // },
  {
    // if: all other cases (default rule)
    // do: do not change the expression
  },
  // {
  //   // default
  // },
];

/**
 * @name eval
 */
export const eval_: ExecutorFn = async function (_, args, st) {
  st.logger.debug('eval_:enter');
  st.next();

  const [expr] = validateArgs(args, {exactCount: 1});

  function find_rule(rules: Rule[], e: Expression): Rule {
    const r = rules.find((rule) => !rule.if /* default */ || rule.if(e, st));
    if (!r) {
      console.log(`rules:`, rules);
      throw new EEvalError(e, `Rule not found`);
    }
    if (isArray(r.do)) return find_rule(r.do, e);
    return r;
  }
  function find_do_rule(rules: Rule[], e: Expression, st: State): Expression {
    const r = find_rule(rules, expr);
    if (!r.do) return e; // return unchanged value
    else if (isFunction(r.do)) return r.do(e, st); // execute the function
    else throw new EEvalError(e, `Invalid rule.do method`); // unexpected
  }
  const res = find_do_rule(rules, expr, st);

  /*
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
  */
  st.logger.debug('eval_:exit');
  return res;
};

export const actions: Actions = {
  eval: eval_,
};

export default actions;
