/** @format */

import {fn_check_params} from '../../apps/runner/lib/util';
import {Runner} from '../../apps/runner/runner';
import {
  ActionListExecutor,
  ActionMethodState,
  Actions,
  EvaluateFn,
  Expression,
  List,
  NIL,
  Parameter,
  Parameters,
  ensureList,
  ensureNumber,
  isEmptyList,
  isList,
} from '../../apps/runner/lib/types';
import {series, series1, series2, seriesn} from './helpers/series';

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
  evaluate: EvaluateFn
): Promise<Expression> {
  const n = await evaluate(index);
  ensureNumber(n);
  const l = await evaluate(list);
  ensureList(l);
  return _rest(n, l);
}

//===========================================================================//

/** @name quote */
export const quote: ActionListExecutor = async (_, params, {evaluate}) => {
  fn_check_params(params, {exactCount: 1});
  // return first argument without evaluation
  return params[0];
};

/** @name list */
export const list: ActionListExecutor = async (_, params, {evaluate}) => {
  // return all args evaluated
  return series(params, evaluate);
};

/** @name length */
export const length: ActionListExecutor = async (_, args, {evaluate}) => {
  fn_check_params(args, {exactCount: 1});
  const a0 = await evaluate(args[0]);
  ensureList(a0);
  return a0.length;
};

/** @name nth */
export const nth: ActionListExecutor = async (_, args, {evaluate}) => {
  fn_check_params(args, {exactCount: 2});
  console.log('nth:args:', JSON.stringify(args));
  // return fn_nth(params[0], params[1], evaluate);

  const idx = await evaluate(args[0]);
  ensureNumber(idx);
  console.log('nth:idx:', JSON.stringify(idx));

  const list = await evaluate(args[1]);
  ensureList(list);
  console.log('nth:list:', JSON.stringify(list));

  const res = await evaluate(await _nth(idx, list));
  console.log('nth:res:', JSON.stringify(res));

  return res;
};

/** @name car */
export const car: ActionListExecutor = async (_, args, {evaluate}) => {
  // fn_check_params(args, {exactCount: 1});
  // const list = await evaluate(args[1]);
  // ensureList(list);
  // return nth(_, [0, args[0]], state);
  return evaluate(['nth', 0, ...args]);
};

/** @name second */
export const second: ActionListExecutor = async (_, args, {evaluate}) => {
  // fn_check_params(args, {exactCount: 1});
  // return nth(_, [1, args[0]], state);
  //
  return evaluate(['nth', 1, ...args]);
  //
  // return;
};

/** @name third */
export const third: ActionListExecutor = async (_, args, {evaluate}) => {
  // fn_check_params(args, {exactCount: 1});
  // return nth(_, [2, args[0]], args);
  return evaluate(['nth', 2, ...args]);
};

//

/** @name nthcdr */
export const nthcdr: ActionListExecutor = async (_, args, {evaluate}) => {
  // fn_check_params(args, {exactCount: 2});
  return fn_rest(args[0], args[1], evaluate);
  // return evaluate(['rest', ...args]);
};

/** @name cdr */
export const cdr: ActionListExecutor = async (_, args, {evaluate}) => {
  // fn_check_params(args, {exactCount: 1});
  return fn_rest(1, args[0], evaluate);
  // return evaluate(['rest', ...args]);
};

//

/** @name consp */
export const consp: ActionListExecutor = async (_, args, {evaluate}) => {
  fn_check_params(args, {exactCount: 1});
  const a0 = await evaluate(args[0]);
  // return isList(a0) && !isEmptyList(a0);
  return _consp(a0);
};

/** @name listp */
export const listp: ActionListExecutor = async (_, args, {evaluate}) => {
  fn_check_params(args, {exactCount: 1});
  const a0 = await evaluate(args[0]);
  // return isList(a0);
  return _listp(a0);
};

/** @name nullp */
export const nullp: ActionListExecutor = async (_, args, {evaluate}) => {
  fn_check_params(args, {exactCount: 1});
  const a0 = await evaluate(args[0]);
  // return isList(a0) && isEmptyList(a0);
  return _nullp(a0);
};

//===========================================================================//

export const actions: Actions = {
  quote,
  list,
  length,
  //
  nth,
  car,
  first: car,
  second,
  third,
  //
  nthcdr,
  cdr,
  rest: cdr,
  //
  consp,
  listp,
  nullp,
};

export default actions;
