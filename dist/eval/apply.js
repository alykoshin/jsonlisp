"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateListList = exports.execFunction = exports.execNamedAction = void 0;
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
const sexpr_1 = require("./sexpr");
const conditions_1 = require("./conditions");
const evlis_1 = require("./evlis");
const eval_1 = require("./eval");
const execNamedAction = async (name, args, st) => {
    st.logger.debug(`eval: execNamedAction: "${name}"`);
    const action = st.actions[name];
    if ((0, sexpr_1.isList)(action)) {
        // list-valued action: evaluate its body (call args are not passed —
        // list actions read their inputs from the scope)
        return await (0, eval_1.eval_)(name, [action], st);
    }
    else {
        (0, sexpr_1.ensureFunction)(action, `function definition not found for "${name}"\n\n`);
        return await (0, exports.execFunction)(action, name, args, st);
    }
};
exports.execNamedAction = execNamedAction;
/** The single invocation (and error-wrapping) site for executors. */
const execFunction = async (fn, name, args, st) => {
    st.logger.debug(`evaluateFunction: "${name}"`);
    try {
        // closures are applicative: evlis once, in the caller's environment;
        // special forms receive their args raw
        const argv = fn.isClosure ? await (0, evlis_1.series)(args, st) : args;
        return fn.call(st, name, argv, st);
    }
    catch (e1) {
        throw new conditions_1.EvaluationError([name, ...args], `Error executing "${fn}"`, {
            cause: e1,
        });
    }
};
exports.execFunction = execFunction;
/** Lambda-form application: `[["lambda", ...], arg1, ...]`. */
async function evaluateListList(outer_arg0, outer_args, st) {
    st.logger.debug(`evaluateListList`, outer_arg0);
    const [inner_arg0, ...inner_args] = outer_arg0;
    (0, sexpr_1.ensureString)(inner_arg0);
    st = st.newNextUp(inner_arg0);
    const preparedFn = await (0, exports.execNamedAction)(inner_arg0, inner_args, st);
    (0, sexpr_1.ensureFunction)(preparedFn);
    // args go in raw; execFunction evlis-es them iff preparedFn is a closure
    return (0, exports.execFunction)(preparedFn, inner_arg0, outer_args, st);
}
exports.evaluateListList = evaluateListList;
//# sourceMappingURL=apply.js.map