/** @format */

import {isList, Expression, Actions} from '../../eval/sexpr';
import {isNil} from '../../kernel/booleans';
// import {parse_sbcl_list} from '../../apps/translator-primitive/lisp2jl-primitive';

// import {parse_sbcl_list} from 'node_modules/lisp2jl/dist/apps/translator-primitive';
import {parse_sbcl_list} from '../../host/sbcl-bridge/reader';

import {get_sbcl_cmd, preprocess_sbcl_expr} from '../../host/sbcl-bridge/exec-prepare';
import {execute} from '../../lib/exec';
import {State} from '../../eval/environment';
import {Runner} from '../runner/runner';

/**
 * CL upcases symbol names (TEST1) while JL spells symbols as lowercase
 * strings and cannot distinguish symbols from string data — so the
 * comparison folds case on both sides (CL readers are case-insensitive).
 */
function foldSymbolCase(e: Expression): Expression {
  if (typeof e === 'string') return e.toLowerCase();
  if (isList(e)) return e.map((x) => foldSymbolCase(x));
  return e;
}

export const testRunner = async function (
  actions: Actions,
  exprJlIn: Expression,
  strSbclIn: string
  // {actions, evaluate}: {actions: Actions; evaluate: EvaluateFn}
  // st: State
): Promise<{
  exprJlIn: Expression;
  exprJlOut: Expression;
  ok: boolean;
  strSbclIn: string;
  strSbclOut: string;
  exprSbclOut: Expression;
}> {
  // const evaluate = await init();
  const runner = new Runner({errorLevel: 'debug'});
  // replace default actions with the ones we want to test
  // (and their dependencies)
  runner.actions = actions;
  const st = await runner.init();

  const exprJlOut = await st.evaluate(exprJlIn);

  try {
    const c = get_sbcl_cmd(strSbclIn);
    const {stdout: strSbclOut} = await execute(c, {}, {state: st});
    const exprSbclOut = parse_sbcl_list(strSbclOut, st);

    // check if lambda function was returned.
    // if so, do only partial comparison
    const jlLambda = isList(exprJlIn) && exprJlIn[0] === 'lambda';
    // const jlLambda = isFunction(exprJlOut) && exprJlOut.toString() === '[Function: lambda]';
    const sbclLambda = isList(exprSbclOut) && exprSbclOut[0] === 'lambda';

    const res = {
      exprJlIn,
      exprJlOut,
      strSbclIn: preprocess_sbcl_expr(strSbclIn),
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
    const ok =
      JSON.stringify(foldSymbolCase(exprSbclOut)) ===
        JSON.stringify(foldSymbolCase(exprJlOut)) ||
      (isNil(exprSbclOut) && isNil(exprJlOut));

    return {
      ...res,
      ok,
      strSbclOut,
      exprSbclOut,
    };
  } catch (e) {
    throw e;
  }
};
