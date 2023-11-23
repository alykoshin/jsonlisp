"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyList = exports.ensureList = exports.asList = exports.isList = exports.ensureFunction = exports.ensureString = exports.isString = exports.ensureNumber = exports.asNumber = exports.ensureBoolean = exports.asBoolean = exports.isNil = exports.NIL = exports.isT = exports.T = exports.isAtom = exports.ensureGenericType = void 0;
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
/*
type Symb = string;

export const isSymbol = isString;
 */
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
const atomDefinitionTypes = [
    'undefined',
    'boolean',
    'number',
    'bigint',
    'string',
    // 'symbol',
    'object',
];
// export const isAtom = jlTypeCheck.atom;
const isAtom = (value) => jlTypeCheck.atom(value);
exports.isAtom = isAtom;
// export const isAtom = (value: any): value is Atom =>
//   // atomDefinitionTypes.indexOf(typeof value) >= 0 ||
//   // value === null
//   !isList(value) || isEmptyList(value);
/******************************************************************************
 * boolean
 */
exports.T = true;
const isT = (value) => value === true;
exports.isT = isT;
exports.NIL = false;
const isNil = (value) => (0, exports.isEmptyList)(value) || value === false;
exports.isNil = isNil;
const asBoolean = (value) => typeof value === 'boolean'
    ? value
    : typeof value !== 'undefined' && value !== null && !(0, exports.isEmptyList)(value);
exports.asBoolean = asBoolean;
function ensureBoolean(val, msg = '') {
    ensureGenericType('boolean', val, msg);
    // if (!jsTypes.isBoolean(val) && !isT(val) && !isNil(val)) {
    //   throw new Error(notOfTypeMsg(val, 'string', msg));
    // }
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
    // if (!jsTypes.isNumber(val)) {
    //   throw new Error(notOfTypeMsg(val, 'number', msg));
    // }
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
    //  if (!jsTypes.isString(val)) {
    //     throw new Error(notOfTypeMsg(val, 'string', msg));
    //   }
}
exports.ensureString = ensureString;
function ensureFunction(val, msg = '') {
    ensureGenericType('function', val, msg);
    // if (!jsTypes.function(val)) {
    // throw new Error(notOfTypeMsg(val, 'function', msg));
    // }
}
exports.ensureFunction = ensureFunction;
/******************************************************************************
 * List
 */
// export const isList: (v: any) => v is List = jlTypeCheck.list;
const isList = (v) => jlTypeCheck.list(v);
exports.isList = isList;
// export const isList = (val: any): val is List => jsTypeCheck.array(val);
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
//# sourceMappingURL=types.js.map