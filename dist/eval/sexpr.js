"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyList = exports.ensureList = exports.asList = exports.isList = exports.ensureFunction = exports.isFunction = exports.ensureString = exports.isString = exports.ensureNumber = exports.asNumber = exports.ensureBoolean = exports.isAtom = exports.ensureGenericType = void 0;
/**
 * @module eval/sexpr
 * [model] The S-expression data model: Atom, List, Expression — plus
 * structural type guards. Language-agnostic: truthiness (T/NIL) lives in
 * kernel/booleans (see ARCHITECTURE.md).
 */
const util_1 = require("util");
const jsTypeCheck = {
    array(value) {
        return Array.isArray(value);
    },
    boolean(value) {
        return typeof value === 'boolean';
    },
    function(value) {
        return typeof value === 'function';
    },
    number(value) {
        return typeof value === 'number';
    },
    string(value) {
        return typeof value === 'string';
    },
};
const jlTypeCheck = {
    atom(value) {
        return !jsTypeCheck.array(value) || value.length === 0;
    },
    list(value) {
        return jsTypeCheck.array(value);
    },
    boolean(value) {
        return typeof value === 'boolean';
    },
    function(value) {
        return typeof value === 'function';
    },
    number(value) {
        return typeof value === 'number';
    },
    string(value) {
        return typeof value === 'string';
    },
};
//---------------------------------------------------------------------------//
const notOfTypeMsg = (value, expType, msg = '') => {
    const m = [`The value`, (0, util_1.inspect)(value), `is not of type`, expType];
    if (msg)
        m.unshift(msg, ':');
    return m.join(' ');
};
function ensureGenericType(type, val, msg = '') {
    const fn = jsTypeCheck[type];
    if (!fn(val)) {
        throw new Error(notOfTypeMsg(val, type, msg));
    }
}
exports.ensureGenericType = ensureGenericType;
const isAtom = (value) => jlTypeCheck.atom(value);
exports.isAtom = isAtom;
/******************************************************************************
 * boolean (structural only — generalized booleans are in kernel/booleans)
 */
function ensureBoolean(val, msg = '') {
    ensureGenericType('boolean', val, msg);
}
exports.ensureBoolean = ensureBoolean;
/******************************************************************************
 * number
 */
function asNumber(p) {
    ensureNumber(p);
    return p;
}
exports.asNumber = asNumber;
function ensureNumber(val, msg = '') {
    ensureGenericType('number', val, msg);
}
exports.ensureNumber = ensureNumber;
/******************************************************************************
 * string
 */
function isString(val) {
    return jsTypeCheck.string(val);
}
exports.isString = isString;
function ensureString(val, msg = '') {
    ensureGenericType('string', val, msg);
}
exports.ensureString = ensureString;
/******************************************************************************
 * Function
 */
function isFunction(val) {
    return jsTypeCheck.function(val);
}
exports.isFunction = isFunction;
function ensureFunction(val, msg = '') {
    ensureGenericType('function', val, msg);
}
exports.ensureFunction = ensureFunction;
/******************************************************************************
 * List
 */
const isList = (v) => jlTypeCheck.list(v);
exports.isList = isList;
function asList(p) {
    ensureList(p);
    return p;
}
exports.asList = asList;
function ensureList(val, msg = '') {
    if (!(0, exports.isList)(val)) {
        throw new Error(notOfTypeMsg(val, 'LIST', msg));
    }
}
exports.ensureList = ensureList;
const isEmptyList = (value) => jsTypeCheck.array(value) && value.length === 0;
exports.isEmptyList = isEmptyList;
/******************************************************************************/
//# sourceMappingURL=sexpr.js.map