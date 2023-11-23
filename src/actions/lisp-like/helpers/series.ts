/** @format */

import {State} from '../../../apps/runner/lib/state';
import {EvaluateFn, Parameter, Parameters, ensureList, isList} from './types';
import {validateArgs} from '../../../apps/runner/lib/validateArgs';

// export const lengthEqual = (lists: any[]): boolean =>
//   lists.every((l) => lists[0].length === l.length);

// export function a_series<T>(args: T[], evaluate: EvaluateFn): T[] {
//   const result = [];
//   for (const a of args) {
//     const res = await evaluate(a);
//     result.push(res);
//   }
//   return result;
// }

// export function a_seriesnth<T>(index: number, args: T[]): T {
//   const result = a_series(args);
//   if (index < 0) {
//     index = result.length - 1;
//   }
//   return result[index];
// }

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
  // return await Promise.all(args.map(async (a) => await st.evaluate(a)));
};

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
  // const slice: Parameters = [];
  // for (const i in listOfLists) {
  //   const list = listOfLists[i];
  //   ensureList(list);
  //   if (isEmptyList(list)) {
  //     return NIL;
  //   }
  //   // const p = (list as Parameter[]).shift();
  //   // const r = await evaluate(p);
  //   // slice.push(r);
  //   // slice.push(p);
  //   slice[i] = list[pos];
  // }
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
// const sliceParams = async function (
//   listOfLists: Parameters
// ): Promise<Parameters | null> {
//   ensureList(listOfLists);
//   const slice: Parameters = [];
//   for (const list of listOfLists) {
//     ensureList(list);
//     if (isEmptyList(list)) {
//       return list;
//     }
//     const p = (list as Parameter[]).shift();
//     // const r = await evaluate(p);
//     // slice.push(r);
//     slice.push(p);
//   }
//   return slice;
// };
