/** @format */

/**
 * @module kernel/primitives
 * Graham's seven primitive operators (The Roots of Lisp, 2002; McCarthy 1960):
 * quote atom eq car cdr cons cond. The `cond` clause loop is jmc.lisp's evcon.
 */

import {
  Actions,
  isAtom,
  ensureList,
  ExecutorFn,
} from '../eval/sexpr';
import {T, NIL, isNil, asBoolean} from './booleans';
import {series, seriesn} from '../eval/evlis';
import {validateArgs} from '../eval/validate-args';

//

/**
 *  @name quote
 */
export const quote: ExecutorFn = async function (_, args, st) {
  const [a] = validateArgs(args, {exactCount: 1});
  // no evaluation
  return a;
};

/**
 * @name atom
 */
export const atom: ExecutorFn = async function (_, args, st) {
  const [a] = validateArgs(args, {exactCount: 1});
  const ea = await st.evaluate(a);
  return isAtom(ea) /* || isEmptyList(ea) */ ? T : NIL;
};

/**
 * @name eq
 */
export const eq: ExecutorFn = async function (_, args, st) {
  // const [a, b] =
  validateArgs(args, {exactCount: 2});
  // const ea = await st.evaluate(a);
  // const eb = await st.evaluate(b);
  const [ea, eb] = await series(args, st);
  return (isAtom(ea) && isAtom(eb) && ea === eb) || (isNil(ea) && isNil(eb))
    ? T
    : NIL;
};

/**
 * @name car
 */
export const car: ExecutorFn = async function (_, args, st) {
  const [arg0] = validateArgs(args, {exactCount: 1});
  const earg0 = await st.evaluate(arg0);
  ensureList(earg0);
  return earg0.length > 0 ? earg0[0] : NIL;
};

/**
 * @name cdr
 */
export const cdr: ExecutorFn = async function (_, args, st) {
  const [arg0] = validateArgs(args, {exactCount: 1});
  const earg0 = await st.evaluate(arg0);
  ensureList(earg0);
  return earg0.length > 1 ? earg0.slice(1) : NIL;
};

/**
 * @name cons
 */
export const cons: ExecutorFn = async function (_, args, st) {
  // const [x, y] =
  validateArgs(args, {exactCount: 2});
  // const ex = await evaluate(x);
  // const ey = await evaluate(y);
  const [ex, ey] = await series(args, st);
  ensureList(ey);
  return [ex, ...ey];
};

/**
 * @name cond
 * The clause loop is jmc.lisp's evcon.
 */
export const cond: ExecutorFn = async (_, args, st) => {
  validateArgs(args, {minCount: 1});

  for (const current of args) {
    ensureList(current);
    const [cond, ...exprs] = current;

    const econd = await st.evaluate(cond);
    if (asBoolean(econd)) {
      return exprs.length === 0 ? econd : seriesn(exprs, st);
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
