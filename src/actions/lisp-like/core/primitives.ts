/** @format */

import {
  Actions,
  Parameter,
  Parameters,
  isAtom,
  isList,
  isEmptyList,
  ensureList,
  ActionListExecutor,
  T,
  NIL,
  List,
  isNil,
} from '../../../apps/runner/lib/types';
import {asBoolean} from '../../../actions/lisp-like/helpers/typecast';
import {seriesn} from '../helpers/series';
import {fn_check_params} from '../../../apps/runner/lib/util';

//

/**
 * @module primitives
 */

/**
 *  @name quote
 */
export const quote: ActionListExecutor = async function (_, args, {evaluate}) {
  const [a] = fn_check_params(args, {exactCount: 1});
  // no evaluation
  return a;
};

/**
 * @name atom
 */
export const atom: ActionListExecutor = async function (_, args, {evaluate}) {
  const [a] = fn_check_params(args, {exactCount: 1});
  const ea = await evaluate(a);
  return isAtom(ea) || isEmptyList(ea) ? T : NIL;
};

/**
 * @name eq
 */
export const eq: ActionListExecutor = async function (
  _,
  args,
  {evaluate, logger}
) {
  const [a, b] = fn_check_params(args, {exactCount: 2});
  const ea = await evaluate(a),
    eb = await evaluate(b);
  // logger.debug('>>>>>>>>>>>>>>', ea, eb);
  return (isAtom(ea) && isAtom(eb) && ea === eb) || (isNil(ea) && isNil(eb))
    ? T
    : NIL;
};

/**
 * @name car
 */
export const car: ActionListExecutor = async function (_, args, {evaluate}) {
  const [arg0] = fn_check_params(args, {exactCount: 1});
  const earg0 = await evaluate(arg0);
  ensureList(earg0);
  return earg0.length > 0 ? earg0[0] : NIL;
};

/**
 * @name cdr
 */
export const cdr: ActionListExecutor = async function (_, args, {evaluate}) {
  const [arg0] = fn_check_params(args, {exactCount: 1});
  // const ea = evaluate(x[0]);
  const earg0 = await evaluate(arg0);
  ensureList(earg0);
  return earg0.length > 1 ? earg0.slice(1) : NIL;
};

/**
 * @name cons
 */
export const cons: ActionListExecutor = async function (_, args, {evaluate}) {
  const [x, y] = fn_check_params(args, {exactCount: 2});
  const ex = await evaluate(x);
  const ey = await evaluate(y);
  ensureList(ey);
  return [ex, ...ey];
};

/**
 * @name cond
 */
// export const cond: ListExecutor = async function (_, args, state) {
// export const cond: ListExecutor = async (_, args, {evaluate}) => {
// const quote_ = (args: Parameters) => quote(_, args, state);
// const car_ = (args: Parameters) => car(_, args, state);
// const cdr_ = (args: Parameters) => cdr(_, args, state);
// const {evaluate} = state;
// let rest = args;
// while (rest.length > 0) {
//   let current;
//   [current, ...rest] = rest;
//-------------------------------------------------------------------------
//
// Lisp flavor
//
// ensureList(current)
// const cond = await evaluate(['car', ['quote', current]]);
// if (asBoolean(econd)) {
//   const exprs = await evaluate(['cdr', ['quote', current]]);
//   ensureList(exprs)
//   return evaluate('eq', exprs, []) ? econd : seriesn(exprs, evaluate);
// }
//
//-------------------------------------------------------------------------
//
// Lisp flavor
//
// ensureList(current)
// const cond = await car(quote(current));
// if (asBoolean(econd)) {
//   const exprs = await cdr(quote(current));
//   ensureList(exprs)
//   return await eq(exprs, []) ? econd : seriesn(exprs, evaluate);
// }
//
//-------------------------------------------------------------------------
export const cond: ActionListExecutor = async (_, args, {evaluate}) => {
  fn_check_params(args, {minCount: 1});

  for (const current of args) {
    ensureList(current);
    const [cond, ...exprs] = current;

    const econd = await evaluate(cond);
    if (asBoolean(econd)) {
      return exprs.length === 0 ? econd : seriesn(exprs, evaluate);
    }
  }
  return NIL;
};

export const actions: Actions = {
  quote,
  atom,
  eq,
  car,
  cdr,
  cons,
  cond,
};

export default actions;
