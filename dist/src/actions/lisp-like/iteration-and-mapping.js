"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../apps/runner/lib/types");
const series_1 = require("./helpers/series");
const series_2 = require("./helpers/series");
let actions = {};
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
    prog1: async function (_, args, st) {
        return (0, series_1.series1)(args, st);
    },
    /** @name prog2 */
    prog2: async function (_, args, st) {
        return (0, series_1.series2)(args, st);
    },
    /** @name progn */
    progn: async function (_, args, st) {
        return (0, series_1.seriesn)(args, st);
    },
    /**
     * @name mapc
     */
    mapc: async function (_, [fn, ...listOfLists], st) {
        const { evaluate, logger } = st;
        (0, types_1.ensureList)(listOfLists);
        (0, types_1.ensureList)(listOfLists[0]);
        // mapc is like mapcar except that the results of applying function
        // are not accumulated.The list argument is returned.
        //
        // save first list as we modify arrays inside `sliceParams`
        const list0 = listOfLists[0].slice();
        //
        fn = await evaluate(fn);
        let i = 0;
        let ps;
        let rs;
        while (!(0, types_1.isNil)((ps = (0, series_2.sliceListList)(listOfLists, i++)))) {
            logger.debug('ps:', ps);
            rs = await evaluate([fn, ...ps]);
        }
        return list0;
        // mapc: async function (_, [fn, ...listOfLists], {evaluate, logger}) {
        //     ensureList(listOfLists);
        //     ensureList(listOfLists[0]);
        //     const list0 = listOfLists[0].slice(); // save first list as we modify arrays inside `sliceParams`
        //     fn = await evaluate(fn);
        //     let ps;
        //     while ((ps = await sliceParams(listOfLists))) {
        //       logger.debug('ps:', ps);
        //       const rs = await evaluate([fn, ...ps]);
        //     }
        //     return list0;
    },
    /**
     * @name mapcar
     */
    mapcar: async function (_, [fn, ...listOfLists], st) {
        const { evaluate, logger } = st;
        (0, types_1.ensureList)(listOfLists);
        fn = await evaluate(fn);
        let i = 0;
        let ps;
        const results = [];
        // while ((ps = await sliceParams(lists))) {
        while (!(0, types_1.isNil)((ps = (0, series_2.sliceListList)(listOfLists, i++)))) {
            const rs = await evaluate([fn, ...ps]);
            results.push(rs);
        }
        return results;
    },
};
/* actions = */ Object.assign(actions, actions2);
exports.default = actions;
//# sourceMappingURL=iteration-and-mapping.js.map