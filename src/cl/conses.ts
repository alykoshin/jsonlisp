/** @format */

import {validateArgs} from '../eval/validate-args';
import {
  ExecutorFn,
  Actions,
  Expression,
  Parameter,
  ensureList,
  ensureNumber,
  isEmptyList,
  isList,
} from '../eval/sexpr';
import {NIL, isNil} from '../kernel/booleans';
import {car as kernelCar, cdr as kernelCdr} from '../kernel/primitives';
import {State} from '../eval/environment';
import {series, sliceListList} from '../eval/evlis';

/**
 * @module cl/conses
 * CLHS chapter 14 "Conses": list accessors and the map* family
 * (MAPC/MAPCAR live in the Conses dictionary).
 * quote, car, cdr are owned by kernel/primitives (SBCL-verified); this module
 * keeps the CL synonyms (first/rest) and nth-based accessors.
 * (`nullp` — a JL-ism, ANSI name is `null` — lives in src/jl.)
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
  return isEmptyList(list) ? NIL : list.slice(idx);
};

const _consp = async function (p: Parameter): Promise<boolean> {
  return isList(p) && !isEmptyList(p);
};

const _listp = async function (p: Parameter): Promise<boolean> {
  return isList(p);
};

//===========================================================================//

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

/** @name list */
export const list: ExecutorFn = async (_, params, st) => {
  // return all args evaluated
  return series(params, st);
};

/** @name nth */
export const nth: ExecutorFn = async (_, args, st) => {
  validateArgs(args, {exactCount: 2});

  const idx = await st.evaluate(args[0]);
  ensureNumber(idx);

  const list = await st.evaluate(args[1]);
  ensureList(list);

  // CL: nth returns the element as DATA — it must not re-evaluate it
  // (kernel car/cdr behave the same way; `if` used to depend on the old
  // re-evaluating behavior and evaluates its own branch now).
  return _nth(idx, list);
};

/** @name second */
export const second: ExecutorFn = async (_, args, st) => {
  return st.evaluate(['nth', 1, ...args]);
};

/** @name third */
export const third: ExecutorFn = async (_, args, st) => {
  return st.evaluate(['nth', 2, ...args]);
};

//

/** @name nthcdr */
export const nthcdr: ExecutorFn = async (_, args, st) => {
  return fn_rest(args[0], args[1], st);
};

//

/** @name consp */
export const consp: ExecutorFn = async (_, args, st) => {
  validateArgs(args, {exactCount: 1});
  const a0 = await st.evaluate(args[0]);
  return _consp(a0);
};

/** @name listp */
export const listp: ExecutorFn = async (_, args, st) => {
  validateArgs(args, {exactCount: 1});
  const a0 = await st.evaluate(args[0]);
  return _listp(a0);
};

//===========================================================================//

/**
 * @name mapc
 */
export const mapc: ExecutorFn = async function (_, [fn, ...listOfLists], st) {
  const {evaluate, logger} = st;
  ensureList(listOfLists);
  ensureList(listOfLists[0]);
  // mapc is like mapcar except that the results of applying function
  // are not accumulated. The list argument is returned.
  //
  // save first list as we modify arrays inside `sliceParams`
  const list0 = listOfLists[0].slice();
  //
  fn = await evaluate(fn);
  let i = 0;
  let ps;
  let rs;
  while (!isNil((ps = sliceListList(listOfLists, i++)))) {
    logger.debug('ps:', ps);
    rs = await evaluate([fn, ...ps]);
  }
  return list0;
};

/**
 * @name mapcar
 */
export const mapcar: ExecutorFn = async function (_, [fn, ...listOfLists], st) {
  const {evaluate, logger} = st;
  ensureList(listOfLists);
  fn = await evaluate(fn);
  let i = 0;
  let ps;
  const results = [];
  while (!isNil((ps = sliceListList(listOfLists, i++)))) {
    const rs = await evaluate([fn, ...ps]);
    results.push(rs);
  }
  return results;
};

//===========================================================================//

export const actions: Actions = {
  list,
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
  //
  mapc,
  mapcar,
};

export default actions;
