"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.mapcar = exports.mapc = exports.listp = exports.consp = exports.nthcdr = exports.third = exports.second = exports.nth = exports.list = void 0;
const validate_args_1 = require("../eval/validate-args");
const sexpr_1 = require("../eval/sexpr");
const booleans_1 = require("../kernel/booleans");
const primitives_1 = require("../kernel/primitives");
const evlis_1 = require("../eval/evlis");
/**
 * @module cl/conses
 * CLHS chapter 14 "Conses": list accessors and the map* family
 * (MAPC/MAPCAR live in the Conses dictionary).
 * quote, car, cdr are owned by kernel/primitives (SBCL-verified); this module
 * keeps the CL synonyms (first/rest) and nth-based accessors.
 * (`nullp` — a JL-ism, ANSI name is `null` — lives in src/jl.)
 */
const _nth = async function (idx, list) {
    return list.length > idx ? list[idx] : booleans_1.NIL;
};
const _rest = async function (idx, list) {
    return (0, sexpr_1.isEmptyList)(list) ? booleans_1.NIL : list.slice(idx);
};
const _consp = async function (p) {
    return (0, sexpr_1.isList)(p) && !(0, sexpr_1.isEmptyList)(p);
};
const _listp = async function (p) {
    return (0, sexpr_1.isList)(p);
};
//===========================================================================//
async function fn_rest(index, list, st) {
    const n = await st.evaluate(index);
    (0, sexpr_1.ensureNumber)(n);
    const l = await st.evaluate(list);
    (0, sexpr_1.ensureList)(l);
    return _rest(n, l);
}
//===========================================================================//
/** @name list */
const list = async (_, params, st) => {
    // return all args evaluated
    return (0, evlis_1.series)(params, st);
};
exports.list = list;
/** @name nth */
const nth = async (_, args, st) => {
    (0, validate_args_1.validateArgs)(args, { exactCount: 2 });
    const idx = await st.evaluate(args[0]);
    (0, sexpr_1.ensureNumber)(idx);
    const list = await st.evaluate(args[1]);
    (0, sexpr_1.ensureList)(list);
    // CL: nth returns the element as DATA — it must not re-evaluate it
    // (kernel car/cdr behave the same way; `if` used to depend on the old
    // re-evaluating behavior and evaluates its own branch now).
    return _nth(idx, list);
};
exports.nth = nth;
/** @name second */
const second = async (_, args, st) => {
    return st.evaluate(['nth', 1, ...args]);
};
exports.second = second;
/** @name third */
const third = async (_, args, st) => {
    return st.evaluate(['nth', 2, ...args]);
};
exports.third = third;
//
/** @name nthcdr */
const nthcdr = async (_, args, st) => {
    return fn_rest(args[0], args[1], st);
};
exports.nthcdr = nthcdr;
//
/** @name consp */
const consp = async (_, args, st) => {
    (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    const a0 = await st.evaluate(args[0]);
    return _consp(a0);
};
exports.consp = consp;
/** @name listp */
const listp = async (_, args, st) => {
    (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    const a0 = await st.evaluate(args[0]);
    return _listp(a0);
};
exports.listp = listp;
//===========================================================================//
/**
 * @name mapc
 */
const mapc = async function (_, [fn, ...listOfLists], st) {
    const { evaluate, logger } = st;
    (0, sexpr_1.ensureList)(listOfLists);
    (0, sexpr_1.ensureList)(listOfLists[0]);
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
    while (!(0, booleans_1.isNil)((ps = (0, evlis_1.sliceListList)(listOfLists, i++)))) {
        logger.debug('ps:', ps);
        rs = await evaluate([fn, ...ps]);
    }
    return list0;
};
exports.mapc = mapc;
/**
 * @name mapcar
 */
const mapcar = async function (_, [fn, ...listOfLists], st) {
    const { evaluate, logger } = st;
    (0, sexpr_1.ensureList)(listOfLists);
    fn = await evaluate(fn);
    let i = 0;
    let ps;
    const results = [];
    while (!(0, booleans_1.isNil)((ps = (0, evlis_1.sliceListList)(listOfLists, i++)))) {
        const rs = await evaluate([fn, ...ps]);
        results.push(rs);
    }
    return results;
};
exports.mapcar = mapcar;
//===========================================================================//
exports.actions = {
    list: exports.list,
    //
    nth: exports.nth,
    first: primitives_1.car,
    second: exports.second,
    third: exports.third,
    //
    nthcdr: exports.nthcdr,
    rest: primitives_1.cdr,
    //
    consp: exports.consp,
    listp: exports.listp,
    //
    mapc: exports.mapc,
    mapcar: exports.mapcar,
};
exports.default = exports.actions;
//# sourceMappingURL=conses.js.map