"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.cond = exports.cons = exports.cdr = exports.car = exports.eq = exports.atom = exports.quote = void 0;
/**
 * @module kernel/primitives
 * Graham's seven primitive operators (The Roots of Lisp, 2002; McCarthy 1960):
 * quote atom eq car cdr cons cond. The `cond` clause loop is jmc.lisp's evcon.
 */
const sexpr_1 = require("../eval/sexpr");
const booleans_1 = require("./booleans");
const evlis_1 = require("../eval/evlis");
const validate_args_1 = require("../eval/validate-args");
//
/**
 *  @name quote
 */
const quote = async function (_, args, st) {
    const [a] = (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    // no evaluation
    return a;
};
exports.quote = quote;
/**
 * @name atom
 */
const atom = async function (_, args, st) {
    const [a] = (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    const ea = await st.evaluate(a);
    return (0, sexpr_1.isAtom)(ea) /* || isEmptyList(ea) */ ? booleans_1.T : booleans_1.NIL;
};
exports.atom = atom;
/**
 * @name eq
 */
const eq = async function (_, args, st) {
    // const [a, b] =
    (0, validate_args_1.validateArgs)(args, { exactCount: 2 });
    // const ea = await st.evaluate(a);
    // const eb = await st.evaluate(b);
    const [ea, eb] = await (0, evlis_1.series)(args, st);
    return ((0, sexpr_1.isAtom)(ea) && (0, sexpr_1.isAtom)(eb) && ea === eb) || ((0, booleans_1.isNil)(ea) && (0, booleans_1.isNil)(eb))
        ? booleans_1.T
        : booleans_1.NIL;
};
exports.eq = eq;
/**
 * @name car
 */
const car = async function (_, args, st) {
    const [arg0] = (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    const earg0 = await st.evaluate(arg0);
    (0, sexpr_1.ensureList)(earg0);
    return earg0.length > 0 ? earg0[0] : booleans_1.NIL;
};
exports.car = car;
/**
 * @name cdr
 */
const cdr = async function (_, args, st) {
    const [arg0] = (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    const earg0 = await st.evaluate(arg0);
    (0, sexpr_1.ensureList)(earg0);
    return earg0.length > 1 ? earg0.slice(1) : booleans_1.NIL;
};
exports.cdr = cdr;
/**
 * @name cons
 */
const cons = async function (_, args, st) {
    // const [x, y] =
    (0, validate_args_1.validateArgs)(args, { exactCount: 2 });
    // const ex = await evaluate(x);
    // const ey = await evaluate(y);
    const [ex, ey] = await (0, evlis_1.series)(args, st);
    // CL: (cons x nil) => (x) — nil is the empty list
    if ((0, booleans_1.isNil)(ey))
        return [ex];
    (0, sexpr_1.ensureList)(ey);
    return [ex, ...ey];
};
exports.cons = cons;
/**
 * @name cond
 * The clause loop is jmc.lisp's evcon.
 */
const cond = async (_, args, st) => {
    (0, validate_args_1.validateArgs)(args, { minCount: 1 });
    for (const current of args) {
        (0, sexpr_1.ensureList)(current);
        const [cond, ...exprs] = current;
        const econd = await st.evaluate(cond);
        if ((0, booleans_1.asBoolean)(econd)) {
            return exprs.length === 0 ? econd : (0, evlis_1.seriesn)(exprs, st);
        }
    }
    return booleans_1.NIL;
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