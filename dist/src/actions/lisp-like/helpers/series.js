"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliceListList = exports.seriesn = exports.series2 = exports.series1 = exports.seriesnth = exports.series = void 0;
const types_1 = require("../../../apps/runner/lib/types");
const validateArgs_1 = require("../../../apps/runner/lib/validateArgs");
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
const series = async (args, st) => {
    (0, validateArgs_1.validateArgs)(args, { minCount: 0 });
    const result = [];
    for (const a of args) {
        const res = await st.evaluate(a);
        result.push(res);
    }
    return result;
    // return await Promise.all(args.map(async (a) => await st.evaluate(a)));
};
exports.series = series;
const seriesnth = async (index, args, st) => {
    const result = await (0, exports.series)(args, st);
    if (index < 0) {
        index = result.length - 1;
    }
    (0, validateArgs_1.validateArgs)(result, { minCount: index });
    return result[index];
};
exports.seriesnth = seriesnth;
const series1 = async (args, st) => {
    return (0, exports.seriesnth)(0, args, st);
};
exports.series1 = series1;
const series2 = async (args, st) => {
    return (0, exports.seriesnth)(1, args, st);
};
exports.series2 = series2;
const seriesn = async (args, st) => {
    return (0, exports.seriesnth)(-1, args, st);
};
exports.seriesn = seriesn;
const sliceListList = function (listOfLists, pos) {
    (0, types_1.ensureList)(listOfLists);
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
        (0, types_1.ensureList)(l);
        if (!(0, types_1.isList)(l) || pos >= l.length) {
            finish = true;
        }
        else {
            return l[pos];
        }
    });
    return finish ? [] : slice;
};
exports.sliceListList = sliceListList;
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
//# sourceMappingURL=series.js.map