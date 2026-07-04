"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.eval_ = void 0;
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
const string_1 = __importDefault(require("@utilities/string"));
const sexpr_1 = require("./sexpr");
const validate_args_1 = require("./validate-args");
const conditions_1 = require("./conditions");
const apply_1 = require("./apply");
//
function isVarName(name, st) {
    return st.scopes.get(name) !== undefined;
}
async function evaluateAtomVar(expr, st) {
    const value = st.scopes.get(expr);
    if (value !== undefined) {
        return value;
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
/** Named-action position: `["name", ...args]`. */
async function evaluateNamedForm(name, e, st) {
    const action = st.actions[name];
    if ((0, sexpr_1.isList)(action)) {
        // list-valued action: evaluate its body (call args are not passed —
        // list actions read their inputs from the scope)
        return await (0, exports.eval_)(name, [action], st);
    }
    if ((0, sexpr_1.isFunction)(action)) {
        return await (0, apply_1.execFunction)(action, name, e.slice(1), st);
    }
    throw new conditions_1.EvaluationError(e, `Expect first element in unquoted list` +
        ` to be a name of function/action,` +
        ` but its definition not found for "${name}"\n\n`);
}
async function evalExpr(e, st) {
    if ((0, sexpr_1.isList)(e) && !(0, sexpr_1.isEmptyList)(e)) {
        const head = e[0];
        if ((0, sexpr_1.isList)(head))
            return (0, apply_1.evaluateListList)(head, e.slice(1), st);
        if ((0, sexpr_1.isString)(head))
            return evaluateNamedForm(head, e, st);
        throw new conditions_1.EvaluationError(e, `First argument must be string or List`);
    }
    if ((0, sexpr_1.isString)(e) && !(0, sexpr_1.isEmptyList)(e)) {
        if (isVarName(e, st))
            return evaluateAtomVar(e, st);
        return evaluateAtomString(e, st);
    }
    // atoms and the empty list self-evaluate
    return e;
}
/**
 * @name eval
 */
const eval_ = async function (_, args, st) {
    st.logger.debug('eval_:enter');
    st.next();
    st.tracer?.guard(st.level);
    const [expr] = (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    const res = evalExpr(expr, st);
    st.logger.debug('eval_:exit');
    return res;
};
exports.eval_ = eval_;
exports.actions = {
    eval: exports.eval_,
};
exports.default = exports.actions;
//# sourceMappingURL=eval.js.map