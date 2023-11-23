"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.eval_ = exports.execFunction = exports.execNamedAction = void 0;
const string_1 = __importDefault(require("@utilities/string"));
const types_1 = require("../helpers/types");
const series_1 = require("../helpers/series");
const validateArgs_1 = require("../../../apps/runner/lib/validateArgs");
const lodash_1 = require("lodash");
//
class EEvalError extends Error {
    expression;
    constructor(expr, message, options) {
        const m = `Error during eval: ${message}`;
        super(m + ': "' + JSON.stringify(expr) + '"', options);
        this.expression = expr;
    }
}
/**
 * @module eval
 */
const execNamedAction = async (op, args, st) => {
    st.logger.debug(`eval: execNamedAction: "${op}"`);
    const action = st.actions[op];
    if ((0, types_1.isList)(action)) {
        return await (0, exports.eval_)(op, [action], st);
    }
    else {
        (0, types_1.ensureFunction)(action, `function definition not found for "${op}"`);
        return await (0, exports.execFunction)(action, op, args, st);
    }
};
exports.execNamedAction = execNamedAction;
const execFunction = async (fn, name, args, st) => {
    st.logger.debug(`evaluateFunction: "${name}"`);
    // const fn = st.actions[op];
    // ensureFunction(fn, `function definition not found for "${fn}"`);
    try {
        return fn.call(st, name, args, st);
        // return (fn as Function).call(st, fn, args, st);
    }
    catch (e1) {
        throw new EEvalError([name, ...args], `Error executing "${fn}"`, {
            cause: e1,
        });
    }
};
exports.execFunction = execFunction;
async function evaluateListAtom(arg0, args, st) {
    st.logger.debug(`evaluateListAtom: "${arg0}"`);
    st = st.newNextUp(arg0);
    return (0, exports.execNamedAction)(arg0, args, st);
}
async function evaluateListList(outer_arg0, outer_args, st) {
    st.logger.debug(`evaluateListList`, outer_arg0);
    const [inner_arg0, ...inner_args] = outer_arg0;
    (0, types_1.ensureString)(inner_arg0);
    st = st.newNextUp(inner_arg0);
    const outer_arg_values = await (0, series_1.series)(outer_args, st);
    st.logger.debug(`evaluateListList: outer_arg_values:`, outer_arg_values);
    const preparedFn = await (0, exports.execNamedAction)(inner_arg0, inner_args, st);
    (0, types_1.ensureFunction)(preparedFn);
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
function isVarName(expr, st) {
    return st.scopes.get(expr) !== undefined;
}
async function evaluateAtomVar(expr, st) {
    const value = st.scopes.get(expr);
    if (value !== undefined) {
        return value;
        // logger.debug(
        // `evaluateAtom: var: (${typeof expr}) "${JSON.stringify(expr)}"`
        // );
    }
    return undefined;
}
async function evaluateAtomString(expr, st) {
    // * Handle as string
    // * Replace templates if enabled
    const ENABLE_STRING_TEMPLATES = true;
    if (ENABLE_STRING_TEMPLATES) {
        // ! This is not effective
        const flattenedScopes = st.scopes.merged()._scope;
        // !
        expr = string_1.default.literalTemplate(expr, flattenedScopes);
    }
    return expr;
}
const rules = [
    {
        if: (e) => (0, types_1.isList)(e) && !(0, types_1.isEmptyList)(e),
        do: [
            {
                if: (e) => (0, types_1.isList)(e[0]),
                do: (e, st) => evaluateListList(e[0], e.slice(1), st),
            },
            {
                if: (e) => (0, types_1.isString)(e[0]),
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
        if: (e, st) => !(0, types_1.isEmptyList)(e),
        do: [
            {
                if: (e, st) => (0, types_1.isString)(e),
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
const eval_ = async function (_, args, st) {
    st.logger.debug('eval_:enter');
    st.next();
    const [expr] = (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
    function find_rule(rules, e) {
        const r = rules.find((rule) => !rule.if /* default */ || rule.if(e, st));
        if (!r) {
            console.log(`rules:`, rules);
            throw new EEvalError(e, `Rule not found`);
        }
        if ((0, lodash_1.isArray)(r.do))
            return find_rule(r.do, e);
        return r;
    }
    function find_do_rule(rules, e, st) {
        const r = find_rule(rules, expr);
        if (!r.do)
            return e; // return unchanged value
        else if ((0, lodash_1.isFunction)(r.do))
            return r.do(e, st); // execute the function
        else
            throw new EEvalError(e, `Invalid rule.do method`); // unexpected
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
exports.eval_ = eval_;
exports.actions = {
    eval: exports.eval_,
};
exports.default = exports.actions;
//# sourceMappingURL=eval.js.map