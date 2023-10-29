"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.cond = exports.cons = exports.cdr = exports.car = exports.eq = exports.atom = exports.quote = void 0;
const types_1 = require("../../../apps/runner/lib/types");
const typecast_1 = require("../../../actions/lisp-like/helpers/typecast");
const series_1 = require("../helpers/series");
const validateArgs_1 = require("../../../apps/runner/lib/validateArgs");
//
/**
 * @module primitives
 */
/**
 *  @name quote
 */
const quote = async function (_, args, st) {
    const [a] = (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
    // no evaluation
    return a;
};
exports.quote = quote;
/**
 * @name atom
 */
const atom = async function (_, args, st) {
    const [a] = (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
    const ea = await st.evaluate(a);
    return (0, types_1.isAtom)(ea) || (0, types_1.isEmptyList)(ea) ? types_1.T : types_1.NIL;
};
exports.atom = atom;
/**
 * @name eq
 */
const eq = async function (_, args, st) {
    // const [a, b] =
    (0, validateArgs_1.validateArgs)(args, { exactCount: 2 });
    // const ea = await st.evaluate(a);
    // const eb = await st.evaluate(b);
    const [ea, eb] = await (0, series_1.series)(args, st);
    return ((0, types_1.isAtom)(ea) && (0, types_1.isAtom)(eb) && ea === eb) || ((0, types_1.isNil)(ea) && (0, types_1.isNil)(eb))
        ? types_1.T
        : types_1.NIL;
};
exports.eq = eq;
/**
 * @name car
 */
const car = async function (_, args, st) {
    const [arg0] = (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
    const earg0 = await st.evaluate(arg0);
    (0, types_1.ensureList)(earg0);
    return earg0.length > 0 ? earg0[0] : types_1.NIL;
};
exports.car = car;
/**
 * @name cdr
 */
const cdr = async function (_, args, st) {
    const [arg0] = (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
    const earg0 = await st.evaluate(arg0);
    (0, types_1.ensureList)(earg0);
    return earg0.length > 1 ? earg0.slice(1) : types_1.NIL;
};
exports.cdr = cdr;
/**
 * @name cons
 */
const cons = async function (_, args, st) {
    // const [x, y] =
    (0, validateArgs_1.validateArgs)(args, { exactCount: 2 });
    // const ex = await evaluate(x);
    // const ey = await evaluate(y);
    const [ex, ey] = await (0, series_1.series)(args, st);
    (0, types_1.ensureList)(ey);
    return [ex, ...ey];
};
exports.cons = cons;
/**
 * @name cond
 */
// export const cond: ListExecutor = async function (_, args, st) {
// export const cond: ListExecutor = async (_, args, {evaluate}) => {
// const quote_ = (args: Parameters) => quote(_, args, st);
// const car_ = (args: Parameters) => car(_, args, st);
// const cdr_ = (args: Parameters) => cdr(_, args, st);
// const {evaluate} = st;
// let rest = args;
// while (rest.length > 0) {
//   let current;
//   [current, ...rest] = rest;
//-------------------------------------------------------------------------
//
// Lisp flavor
//
// ensureList(current)
// const cond = await evaluate(['car', ['quote', current]]);
// if (asBoolean(econd)) {
//   const exprs = await evaluate(['cdr', ['quote', current]]);
//   ensureList(exprs)
//   return evaluate('eq', exprs, []) ? econd : seriesn(exprs, evaluate);
// }
//
//-------------------------------------------------------------------------
//
// Lisp flavor
//
// ensureList(current)
// const cond = await car(quote(current));
// if (asBoolean(econd)) {
//   const exprs = await cdr(quote(current));
//   ensureList(exprs)
//   return await eq(exprs, []) ? econd : seriesn(exprs, evaluate);
// }
//
//-------------------------------------------------------------------------
const cond = async (_, args, st) => {
    (0, validateArgs_1.validateArgs)(args, { minCount: 1 });
    for (const current of args) {
        (0, types_1.ensureList)(current);
        const [cond, ...exprs] = current;
        const econd = await st.evaluate(cond);
        if ((0, typecast_1.asBoolean)(econd)) {
            return exprs.length === 0 ? econd : (0, series_1.seriesn)(exprs, st);
        }
    }
    return types_1.NIL;
};
exports.cond = cond;
exports.actions = {
    quote: exports.quote,
    atom: exports.atom,
    eq: exports.eq,
    car: exports.car,
    cdr: exports.cdr,
    cons: exports.cons,
    cond: exports.cond,
};
exports.default = exports.actions;
//# sourceMappingURL=primitives.js.map