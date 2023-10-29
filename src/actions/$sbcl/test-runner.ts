/** @format */

import {isList, Expression, isNil, Actions} from '../../apps/runner/lib/types';
// import {parse_sbcl_list} from '../../apps/translator-primitive/lisp2jl-primitive';

// import {parse_sbcl_list} from 'node_modules/lisp2jl/dist/apps/translator-primitive';
import {parse_sbcl_list} from 'lisp2jl/dist/apps/translator-primitive/lisp2jl-primitive';

import {get_sbcl_cmd, preprocess_sbcl_expr} from './exec-prepare';
import {execute} from '../lisp-like/helpers/exec';
import {State} from '../../apps/runner/lib/state';
import {Runner} from '../../apps/runner/runner';

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
      JSON.stringify(exprSbclOut) === JSON.stringify(exprJlOut) ||
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
