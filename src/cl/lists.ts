/** @format */

import {validateArgs} from '../eval/validate-args';
import {
  ExecutorFn,
  Actions,
  EvaluateFn,
  Expression,
  List,
  Parameter,
  Parameters,
  ensureList,
  ensureNumber,
  isEmptyList,
  isList,
} from '../eval/sexpr';
import {NIL} from '../kernel/booleans';
import {car as kernelCar, cdr as kernelCdr} from '../kernel/primitives';
import {State} from '../eval/environment';
import {series} from '../eval/evlis';

/**
 * @module list
 */

/**
 *
 */
const _nth = async function (
  idx: number,
  list: Parameter[]
): Promise<Expression> {
  return list.length > idx ? list[idx] : NIL;
};

const _rest = async function (
  idx: number,
  list: Expression[]
): Promise<Expression> {
  // return list.slice(index);
  return isEmptyList(list) ? NIL : list.slice(idx);
};

const _consp = async function (p: Parameter): Promise<boolean> {
  return isList(p) && !isEmptyList(p);
};

const _listp = async function (p: Parameter): Promise<boolean> {
  return isList(p);
};

const _nullp = async function (p: Parameter): Promise<boolean> {
  return isList(p) && isEmptyList(p);
};

//===========================================================================//

// async function fn_nth(
//   index: Expression, // Parameter,
//   list: Expression, // /* Parameter |  */ Parameters,
//   evaluate: EvaluateFn
// ): Promise<Expression> {
//   const n = await evaluate(index);
//   ensureNumber(n);
//   const l = await evaluate(list);
//   ensureList(l);
//   return _nth(n, l);
// }

async function fn_rest(
  index: Expression,
  list: Expression,
  st: State
): Promise<Expression> {
  const n = await st.evaluate(index);
  ensureNumber(n);
  const l = await st.evaluate(list);
  ensureList(l);
  return _rest(n, l);
}

//===========================================================================//

// quote, car, cdr are owned by kernel/primitives (SBCL-verified);
// this module keeps only the CL synonyms (first/rest) and nth-based helpers.

/** @name list */
export const list: ExecutorFn = async (_, params, st) => {
  // return all args evaluated
  return series(params, st);
};

/** @name length */
export const length: ExecutorFn = async (_, args, st) => {
  validateArgs(args, {exactCount: 1});
  const a0 = await st.evaluate(args[0]);
  ensureList(a0);
  return a0.length;
};

/** @name nth */
export const nth: ExecutorFn = async (_, args, st) => {
  validateArgs(args, {exactCount: 2});
  console.log('nth:args:', JSON.stringify(args));
  // return fn_nth(params[0], params[1], evaluate);

  const idx = await st.evaluate(args[0]);
  ensureNumber(idx);
  console.log('nth:idx:', JSON.stringify(idx));

  const list = await st.evaluate(args[1]);
  ensureList(list);
  console.log('nth:list:', JSON.stringify(list));

  const res = await st.evaluate(await _nth(idx, list));
  console.log('nth:res:', JSON.stringify(res));

  return res;
};

/** @name second */
export const second: ExecutorFn = async (_, args, st) => {
  // fn_check_params(args, {exactCount: 1});
  // return nth(_, [1, args[0]], state);
  //
  return st.evaluate(['nth', 1, ...args]);
  //
  // return;
};

/** @name third */
export const third: ExecutorFn = async (_, args, st) => {
  // fn_check_params(args, {exactCount: 1});
  // return nth(_, [2, args[0]], args);
  return st.evaluate(['nth', 2, ...args]);
};

//

/** @name nthcdr */
export const nthcdr: ExecutorFn = async (_, args, st) => {
  // fn_check_params(args, {exactCount: 2});
  return fn_rest(args[0], args[1], st);
  // return evaluate(['rest', ...args]);
};

//

/** @name consp */
export const consp: ExecutorFn = async (_, args, st) => {
  validateArgs(args, {exactCount: 1});
  const a0 = await st.evaluate(args[0]);
  // return isList(a0) && !isEmptyList(a0);
  return _consp(a0);
};

/** @name listp */
export const listp: ExecutorFn = async (_, args, st) => {
  validateArgs(args, {exactCount: 1});
  const a0 = await st.evaluate(args[0]);
  // return isList(a0);
  return _listp(a0);
};

/** @name nullp */
export const nullp: ExecutorFn = async (_, args, st) => {
  validateArgs(args, {exactCount: 1});
  const a0 = await st.evaluate(args[0]);
  // return isList(a0) && isEmptyList(a0);
  return _nullp(a0);
};

//===========================================================================//

export const actions: Actions = {
  list,
  length,
  //
  nth,
  first: kernelCar,
  second,
  third,
  //
  nthcdr,
  rest: kernelCdr,
  //
  consp,
  listp,
  nullp,
};

export default actions;
