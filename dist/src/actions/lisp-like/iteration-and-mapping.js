"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../lib/types");
const series_1 = require("./helpers/series");
/**
 * @module iteration-and-mapping
 */
const sliceParams = async function (listOfLists) {
    (0, types_1.ensureList)(listOfLists);
    const slice = [];
    for (const list of listOfLists) {
        (0, types_1.ensureList)(list);
        if ((0, types_1.isEmptyList)(list)) {
            return list;
        }
        const p = list.shift();
        // const r = await evaluate(p);
        // slice.push(r);
        slice.push(p);
    }
    return slice;
};
//
let actions = {};
//
// function Car<T>(obj: T[]): T {
//   return obj[0];
// }
// function Cdr<T>(obj: T[]): T {
//   return obj[obj.length - 1];
// }
// function consp(obj: any): boolean {
//   return isList(obj);
// }
// function nullp(obj: any): boolean {
//   return isList(obj) && obj.length === 0;
// }
// function error_list(obj: any) {
//   throw new Error(`Ex`);
// }
// function VALUES1<T>(value: T): T {
//   return value;
// }
// function LISPFUNNR(name: string, x: 1, fn: ActionListExecutor) {
//   actions[name] = fn;
// }
// //
// function popSTACK(list: any[]) {
//   return list.pop;
// }
// LISPFUNNR('car', 1, (_, p) => {
//   /* (CAR list), CLTL p. 262 */
//   return VALUES1(car(popSTACK(p)));
// });
// LISPFUNNR('cdr', 1, (_, p) => {
//   /* (CDR list), CLTL p. 262 */
//   return VALUES1(cdr(popSTACK(p)));
// });
// // LISPFUNNR('cddadr', 1, (_, p) => {
// //   /* (CDDADR list), CLTL p. 263 */
// //   return VALUES1(cdr(cdr(car(cdr(popSTACK(p))))));
// // });
// //
// // https://sourceforge.net/p/clisp/clisp/ci/tip/tree/src/list.d#l234
// //
// // /* UP: Returns (car obj), with type check */
// // local object car (object obj) {
// // prettier-ignore
// function car(obj: any) {
//   if (consp(obj))
//     return Car(obj);
//   else if (nullp(obj))
//     return obj;
//   else
//     error_list(obj);
// }
// // https://sourceforge.net/p/clisp/clisp/ci/tip/tree/src/list.d#l244
// //
// // /* UP: Returns (cdr obj), with type check */
// // local object cdr (object obj) {
// // prettier-ignore
// function cdr(obj: any) {
//   if (consp(obj))
//     return Cdr(obj);
//   else if (nullp(obj))
//     return obj;
//   else
//     error_list(obj);
// }
// /* actions = */ Object.assign(actions, {
const actions2 = {
    /** @name prog1 */
    prog1: async function (action, params, { evaluate }) {
        return (0, series_1.series1)(params, evaluate);
    },
    /** @name prog2 */
    prog2: async function (action, params, { evaluate }) {
        return (0, series_1.series2)(params, evaluate);
    },
    /** @name progn */
    progn: async function (action, params, { evaluate }) {
        return (0, series_1.seriesn)(params, evaluate);
    },
    /**
     * @name mapc
     *
     * !!! todo: Not modify list !!!
     */
    mapc: async function (action, [fn, ...listOfLists], { evaluate, logger }) {
        (0, types_1.ensureList)(listOfLists);
        (0, types_1.ensureList)(listOfLists[0]);
        const list0 = listOfLists[0].slice(); // save first list as we modify arrays inside `sliceParams`
        fn = await evaluate(fn);
        let ps;
        while ((ps = await sliceParams(listOfLists))) {
            const rs = await evaluate([fn, ...ps]);
        }
        return list0;
    },
    /**
     * @name mapcar
     *
     * !!! todo: Not modify list !!!
     */
    mapcar: async function (action, [fn, ...lists], { evaluate, logger }) {
        let ps;
        fn = await evaluate(fn);
        const results = [];
        while ((ps = await sliceParams(lists))) {
            const rs = await evaluate([fn, ...ps]);
            results.push(rs);
        }
        return results;
    },
};
/* actions = */ Object.assign(actions, actions2);
exports.default = actions;
//# sourceMappingURL=iteration-and-mapping.js.map