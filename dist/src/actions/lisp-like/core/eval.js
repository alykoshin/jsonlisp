"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports._eval = void 0;
const string_1 = __importDefault(require("@utilities/string"));
const types_1 = require("../../../apps/runner/lib/types");
const series_1 = require("../helpers/series");
const util_1 = require("../../../apps/runner/lib/util");
//
/**
 * @module eval
 */
const callFn = async (op, args, state) => {
    state.logger.debug(`eval: evalFn: "${op}"`);
    const action = state.actions[op];
    if ((0, types_1.isList)(action)) {
        return (0, exports._eval)(op, [action], state);
    }
    else {
        (0, types_1.ensureFunction)(action, `function definition not found for "${op}"`);
        try {
            return action.call(state, op, args, state);
        }
        catch (e) {
            e.message = `Operation ${op} : ` + e.message;
            throw e;
        }
    }
};
async function evaluateList(expr, st) {
    const [op1, ...args] = expr;
    const { evaluate, logger } = st;
    if ((0, types_1.isString)(op1)) {
        logger.debug(`eval string/symbol (${typeof expr})`, expr);
        return callFn(op1, args, st);
    }
    else if ((0, types_1.isList)(op1)) {
        logger.debug(`eval list`, op1);
        const [op2, ...args2] = op1; // [ fn_name, arg_names, body ];
        (0, types_1.ensureString)(op2);
        // ensureList(args2);
        const arg_values = await (0, series_1.series)(args, evaluate);
        logger.debug(`evaluateList: arg_values:`, arg_values);
        const preparedFn = await callFn(op2, args2, st);
        (0, types_1.ensureFunction)(preparedFn);
        const res = preparedFn(op2, arg_values, st);
        // logger.debug(`eval state at exit:`, st);
        return res;
    }
    // } else if (isFunction(expr)) {
    // expr();
    //
}
async function evaluateAtom(expr, state) {
    // * isAtom || isEmptyList
    state.logger.debug(`evaluateAtom: in: (${typeof expr}) "${JSON.stringify(expr)}"`);
    if ((0, types_1.isString)(expr)) {
        // * This may be either string or symbol
        // * as there is no convenient way to differentiate them inside JSON
        // * Handle as symbol
        const value = state.scopes.get(expr);
        if (value !== undefined) {
            expr = value;
            state.logger.debug(`evaluateAtom: var: (${typeof expr}) "${JSON.stringify(expr)}"`);
        }
        else {
            // * Handle as string
            // * Replace templates if enabled
            const ENABLE_STRING_TEMPLATES = true;
            if (ENABLE_STRING_TEMPLATES) {
                // ! This is not effective
                const flattenedScopes = state.scopes.merged()._scope;
                // !
                expr = string_1.default.literalTemplate(expr, flattenedScopes);
            }
        }
    }
    state.logger.debug(`evaluateAtom: out: (${typeof expr}) "${JSON.stringify(expr)}"`);
    return expr;
}
/**
 * @name eval
 */
const _eval = async function (_, args, state) {
    const [expr] = (0, util_1.fn_check_params)(args, { exactCount: 1 });
    const { logger } = state;
    const evaluate = (args) => (0, exports._eval)(_, [args], state);
    state = { ...state, evaluate, logger: logger.newNextUp() };
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
exports._eval = _eval;
exports.actions = {
    eval: exports._eval,
};
exports.default = exports.actions;
//# sourceMappingURL=eval.js.map