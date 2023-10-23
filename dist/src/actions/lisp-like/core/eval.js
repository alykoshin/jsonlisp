"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.eval_ = exports.execNamedAction = void 0;
const string_1 = __importDefault(require("@utilities/string"));
const types_1 = require("../../../apps/runner/lib/types");
const series_1 = require("../helpers/series");
const util_1 = require("../../../apps/runner/lib/util");
//
/**
 * @module eval
 */
const execNamedAction = async (op, args, st) => {
    st.logger.debug(`eval: execNamedAction: "${op}"`);
    const action = st.actions[op];
    // console.log('state:', state);
    // console.log('action:', action);
    // console.log('op:', op);
    if ((0, types_1.isList)(action)) {
        return (0, exports.eval_)(op, [action], st);
    }
    else {
        (0, types_1.ensureFunction)(action, `function definition not found for "${op}"`);
        try {
            return action.call(st, op, args, st);
        }
        catch (e1) {
            throw new Error(`Error executing "${op}"`, { cause: e1 });
        }
    }
};
exports.execNamedAction = execNamedAction;
async function evaluateList(expr, st) {
    const [op1, ...args] = expr;
    let { logger } = st;
    if ((0, types_1.isString)(op1)) {
        logger = logger.newNextUp(st.runner, { name: op1 });
        st = { ...st, logger };
        const evl = (expr) => st.runner.evaluate(expr, st);
        logger.debug(`eval string/symbol: "${expr}"`);
        return (0, exports.execNamedAction)(op1, args, { ...st, evaluate: evl, logger });
        //
    }
    else if ((0, types_1.isList)(op1)) {
        logger.debug(`eval list`, op1);
        const [op2, ...args2] = op1; // [ fn_name, arg_names, body ];
        (0, types_1.ensureString)(op2);
        logger = logger.newNextUp(st.runner, { name: op2 });
        st = { ...st, logger };
        const evl = (expr) => st.runner.evaluate(expr, st);
        // ensureList(args2);
        const arg_values = await (0, series_1.series)(args, st.evaluate);
        logger.debug(`evaluateList: arg_values:`, arg_values);
        const preparedFn = await (0, exports.execNamedAction)(op2, args2, {
            ...st,
            evaluate: evl,
            logger,
        });
        (0, types_1.ensureFunction)(preparedFn);
        const res = preparedFn(op2, arg_values, st);
        // logger.debug(`eval state at exit:`, st);
        return res;
    }
    // } else if (isFunction(expr)) {
    // expr();
    //
}
async function evaluateAtom(expr, st) {
    let { logger } = st;
    // * isAtom || isEmptyList
    logger.debug(`evaluateAtom: in: (${typeof expr}) "${JSON.stringify(expr)}"`);
    if ((0, types_1.isString)(expr)) {
        logger = logger.newNextUp(st.runner, { name: expr });
        st = { ...st, logger };
        // * This may be either string or symbol
        // * as there is no convenient way to differentiate them inside JSON
        // * Handle as symbol
        const value = st.scopes.get(expr);
        if (value !== undefined) {
            expr = value;
            logger.debug(`evaluateAtom: var: (${typeof expr}) "${JSON.stringify(expr)}"`);
        }
        else {
            // * Handle as string
            // * Replace templates if enabled
            const ENABLE_STRING_TEMPLATES = true;
            if (ENABLE_STRING_TEMPLATES) {
                // ! This is not effective
                const flattenedScopes = st.scopes.merged()._scope;
                // !
                expr = string_1.default.literalTemplate(expr, flattenedScopes);
            }
        }
    }
    logger.debug(`evaluateAtom: out: (${typeof expr}) "${JSON.stringify(expr)}"`);
    return expr;
}
/**
 * @name eval
 */
const eval_ = async function (_, args, state) {
    const [expr] = (0, util_1.fn_check_params)(args, { exactCount: 1 });
    // const {logger} = state;
    // const evaluate = (args: Expression) => eval_(_, [args], state);
    // const evaluate = curry(eval_, state);
    // state = {...state, evaluate, logger: logger.newNextUp(state.runner)};
    // logger.debug(`eval state at enter:`, state);
    if ((0, types_1.isList)(expr) && !(0, types_1.isEmptyList)(expr)) {
        return await evaluateList(expr, state);
    }
    else if (!(0, types_1.isEmptyList)(expr)) {
        return await evaluateAtom(expr, state);
    }
    else {
        return expr;
    }
};
exports.eval_ = eval_;
exports.actions = {
    eval: exports.eval_,
};
exports.default = exports.actions;
//# sourceMappingURL=eval.js.map