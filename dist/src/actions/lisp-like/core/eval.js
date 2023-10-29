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
const validateArgs_1 = require("../../../apps/runner/lib/validateArgs");
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
async function evaluateListAtom(arg0, args, st) {
    st = st.newNextUp(arg0);
    return (0, exports.execNamedAction)(arg0, args, st);
}
async function evaluateListList(arg0, args, st) {
    st.logger.debug(`evaluateListList`, arg0);
    const [arg0_arg0, ...args0_args] = arg0;
    (0, types_1.ensureString)(arg0_arg0);
    st = st.newNextUp(arg0_arg0);
    st.logger.debug(`evaluateListList`, arg0);
    // ensureList(args2);
    const arg_values = await (0, series_1.series)(args, st);
    st.logger.debug(`evaluateListList: arg_values:`, arg_values);
    const preparedFn = await (0, exports.execNamedAction)(arg0_arg0, args0_args, st);
    (0, types_1.ensureFunction)(preparedFn);
    const res = preparedFn(arg0_arg0, arg_values, st);
    // logger.debug(`eval state at exit:`, st);
    return res;
}
async function evaluateList(expr, st) {
    const [arg0, ...args] = expr;
    // let {logger} = st;
    if ((0, types_1.isString)(arg0)) {
        // return execNamedAction(op1, args, st);
        return evaluateListAtom(arg0, args, st);
        //
    }
    else if ((0, types_1.isList)(arg0)) {
        return evaluateListList(arg0, args, st);
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
const eval_ = async function (_, args, st) {
    st.logger.debug('eval_:enter');
    st.next();
    const [expr] = (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
    let res;
    if ((0, types_1.isList)(expr) && !(0, types_1.isEmptyList)(expr)) {
        st.logger.debug('eval_:enter:list');
        res = await evaluateList(expr, st);
    }
    else if (!(0, types_1.isEmptyList)(expr)) {
        st.logger.debug('eval_:enter:atom');
        res = await evaluateAtom(expr, st);
    }
    else {
        st.logger.debug('eval_:enter:else');
        res = expr;
    }
    st.logger.debug('eval_:exit');
    return res;
};
exports.eval_ = eval_;
exports.actions = {
    eval: exports.eval_,
};
exports.default = exports.actions;
//# sourceMappingURL=eval.js.map