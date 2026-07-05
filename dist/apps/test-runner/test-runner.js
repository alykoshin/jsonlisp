"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRunner = void 0;
const sexpr_1 = require("../../eval/sexpr");
const booleans_1 = require("../../kernel/booleans");
// import {parse_sbcl_list} from '../../apps/translator-primitive/lisp2jl-primitive';
// import {parse_sbcl_list} from 'node_modules/lisp2jl/dist/apps/translator-primitive';
const lisp2jl_primitive_1 = require("lisp2jl/dist/apps/translator-primitive/lisp2jl-primitive");
const exec_prepare_1 = require("../../host/sbcl-bridge/exec-prepare");
const exec_1 = require("../../lib/exec");
const runner_1 = require("../runner/runner");
/**
 * CL upcases symbol names (TEST1) while JL spells symbols as lowercase
 * strings and cannot distinguish symbols from string data — so the
 * comparison folds case on both sides (CL readers are case-insensitive).
 */
function foldSymbolCase(e) {
    if (typeof e === 'string')
        return e.toLowerCase();
    if ((0, sexpr_1.isList)(e))
        return e.map((x) => foldSymbolCase(x));
    return e;
}
const testRunner = async function (actions, exprJlIn, strSbclIn
// {actions, evaluate}: {actions: Actions; evaluate: EvaluateFn}
// st: State
) {
    // const evaluate = await init();
    const runner = new runner_1.Runner({ errorLevel: 'debug' });
    // replace default actions with the ones we want to test
    // (and their dependencies)
    runner.actions = actions;
    const st = await runner.init();
    const exprJlOut = await st.evaluate(exprJlIn);
    try {
        const c = (0, exec_prepare_1.get_sbcl_cmd)(strSbclIn);
        const { stdout: strSbclOut } = await (0, exec_1.execute)(c, {}, { state: st });
        const exprSbclOut = (0, lisp2jl_primitive_1.parse_sbcl_list)(strSbclOut, st);
        // check if lambda function was returned.
        // if so, do only partial comparison
        const jlLambda = (0, sexpr_1.isList)(exprJlIn) && exprJlIn[0] === 'lambda';
        // const jlLambda = isFunction(exprJlOut) && exprJlOut.toString() === '[Function: lambda]';
        const sbclLambda = (0, sexpr_1.isList)(exprSbclOut) && exprSbclOut[0] === 'lambda';
        const res = {
            exprJlIn,
            exprJlOut,
            strSbclIn: (0, exec_prepare_1.preprocess_sbcl_expr)(strSbclIn),
        };
        if (jlLambda || sbclLambda) {
            return {
                ...res,
                ok: jlLambda === sbclLambda,
                strSbclOut,
                exprSbclOut,
            };
        }
        // console.log('>>>>', sbclParsed, exprJlOut);
        const ok = JSON.stringify(foldSymbolCase(exprSbclOut)) ===
            JSON.stringify(foldSymbolCase(exprJlOut)) ||
            ((0, booleans_1.isNil)(exprSbclOut) && (0, booleans_1.isNil)(exprJlOut));
        return {
            ...res,
            ok,
            strSbclOut,
            exprSbclOut,
        };
    }
    catch (e) {
        throw e;
    }
};
exports.testRunner = testRunner;
//# sourceMappingURL=test-runner.js.map