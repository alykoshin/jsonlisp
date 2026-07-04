/** @format */

/**
 * @module eval/evlis
 * [model] Applicative argument-list evaluation — McCarthy's evlis.
 * `series` is the historical name in this codebase; `evlis` is the alias
 * matching the paper (see ARCHITECTURE.md).
 */

import {State} from '../apps/runner/lib/state';
import {Parameter, Parameters, ensureList, isList} from './sexpr';
import {validateArgs} from './validate-args';

export const series = async (
  args: Parameters,
  st: State
): Promise<Parameters> => {
  validateArgs(args, {minCount: 0});
  const result = [];
  for (const a of args) {
    const res = await st.evaluate(a);
    result.push(res);
  }
  return result;
};

/** McCarthy's name for it (jmc.lisp: evlis.) */
export const evlis = series;

export const seriesnth = async (
  index: number,
  args: Parameters,
  st: State
): Promise<Parameter> => {
  const result = await series(args, st);
  if (index < 0) {
    index = result.length - 1;
  }
  validateArgs(result, {minCount: index});
  return result[index];
};

export const series1 = async (
  args: Parameters,
  st: State
): Promise<Parameter> => {
  return seriesnth(0, args, st);
};

export const series2 = async (
  args: Parameters,
  st: State
): Promise<Parameter> => {
  return seriesnth(1, args, st);
};

export const seriesn = async (
  args: Parameters,
  st: State
): Promise<Parameter> => {
  return seriesnth(-1, args, st);
};

export const sliceListList = function (
  listOfLists: Parameters,
  pos: number
): Parameters {
  ensureList(listOfLists);
  let finish = false;
  const slice = listOfLists.map((l, i) => {
    ensureList(l);
    if (!isList(l) || pos >= l.length) {
      finish = true;
    } else {
      return l[pos];
    }
  });
  return finish ? [] : slice;
};
