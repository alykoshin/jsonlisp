"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.nullp = exports.listp = exports.consp = exports.nthcdr = exports.third = exports.second = exports.nth = exports.length = exports.list = void 0;
const validate_args_1 = require("../eval/validate-args");
const sexpr_1 = require("../eval/sexpr");
const booleans_1 = require("../kernel/booleans");
const primitives_1 = require("../kernel/primitives");
const evlis_1 = require("../eval/evlis");
/**
 * @module list
 */
/**
 *
 */
const _nth = async function (idx, list) {
    return list.length > idx ? list[idx] : booleans_1.NIL;
};
const _rest = async function (idx, list) {
    // return list.slice(index);
    return (0, sexpr_1.isEmptyList)(list) ? booleans_1.NIL : list.slice(idx);
};
const _consp = async function (p) {
    return (0, sexpr_1.isList)(p) && !(0, sexpr_1.isEmptyList)(p);
};
const _listp = async function (p) {
    return (0, sexpr_1.isList)(p);
};
const _nullp = async function (p) {
    return (0, sexpr_1.isList)(p) && (0, sexpr_1.isEmptyList)(p);
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
async function fn_rest(index, list, st) {
    const n = await st.evaluate(index);
    (0, sexpr_1.ensureNumber)(n);
    const l = await st.evaluate(list);
    (0, sexpr_1.ensureList)(l);
    return _rest(n, l);
}
//===========================================================================//
// quote, car, cdr are owned by kernel/primitives (SBCL-verified);
// this module keeps only the CL synonyms (first/rest) and nth-based helpers.
/** @name list */
const list = async (_, params, st) => {
    // return all args evaluated
    return (0, evlis_1.series)(params, st);
};
exports.list = list;
/** @name length */
const length = async (_, args, st) => {
    (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    const a0 = await st.evaluate(args[0]);
    (0, sexpr_1.ensureList)(a0);
    return a0.length;
};
exports.length = length;
/** @name nth */
const nth = async (_, args, st) => {
    (0, validate_args_1.validateArgs)(args, { exactCount: 2 });
    console.log('nth:args:', JSON.stringify(args));
    // return fn_nth(params[0], params[1], evaluate);
    const idx = await st.evaluate(args[0]);
    (0, sexpr_1.ensureNumber)(idx);
    console.log('nth:idx:', JSON.stringify(idx));
    const list = await st.evaluate(args[1]);
    (0, sexpr_1.ensureList)(list);
    console.log('nth:list:', JSON.stringify(list));
    const res = await st.evaluate(await _nth(idx, list));
    console.log('nth:res:', JSON.stringify(res));
    return res;
};
exports.nth = nth;
/** @name second */
const second = async (_, args, st) => {
    // fn_check_params(args, {exactCount: 1});
    // return nth(_, [1, args[0]], state);
    //
    return st.evaluate(['nth', 1, ...args]);
    //
    // return;
};
exports.second = second;
/** @name third */
const third = async (_, args, st) => {
    // fn_check_params(args, {exactCount: 1});
    // return nth(_, [2, args[0]], args);
    return st.evaluate(['nth', 2, ...args]);
};
exports.third = third;
//
/** @name nthcdr */
const nthcdr = async (_, args, st) => {
    // fn_check_params(args, {exactCount: 2});
    return fn_rest(args[0], args[1], st);
    // return evaluate(['rest', ...args]);
};
exports.nthcdr = nthcdr;
//
/** @name consp */
const consp = async (_, args, st) => {
    (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    const a0 = await st.evaluate(args[0]);
    // return isList(a0) && !isEmptyList(a0);
    return _consp(a0);
};
exports.consp = consp;
/** @name listp */
const listp = async (_, args, st) => {
    (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    const a0 = await st.evaluate(args[0]);
    // return isList(a0);
    return _listp(a0);
};
exports.listp = listp;
/** @name nullp */
const nullp = async (_, args, st) => {
    (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    const a0 = await st.evaluate(args[0]);
    // return isList(a0) && isEmptyList(a0);
    return _nullp(a0);
};
exports.nullp = nullp;
//===========================================================================//
exports.actions = {
    list: exports.list,
    length: exports.length,
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
    nullp: exports.nullp,
};
exports.default = exports.actions;
//# sourceMappingURL=lists.js.map