"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureList_logger = exports.ensureFunction = exports.ensureString = exports.ensureNumber = exports.ensureList = exports.isEmptyList = exports.isList = exports.isSymbol = exports.isString = exports.isAtom = exports.isNil = exports.NIL = exports.isT = exports.T = void 0;
const util_1 = require("util");
exports.T = true;
const isT = (value) => value === true;
exports.isT = isT;
exports.NIL = false;
const isNil = (value) => (0, exports.isEmptyList)(value) || value === false;
exports.isNil = isNil;
const atomDefinitionTypes = [
    'undefined',
    'boolean',
    'number',
    'bigint',
    'string',
    // 'symbol',
    'object',
];
const isAtom = (value) => 
// atomDefinitionTypes.indexOf(typeof value) >= 0 ||
// value === null
!Array.isArray(value);
exports.isAtom = isAtom;
const isString = (value) => typeof value === 'string';
exports.isString = isString;
exports.isSymbol = exports.isString;
const isList = (value) => Array.isArray(value);
exports.isList = isList;
const isEmptyList = (value) => Array.isArray(value) && value.length === 0;
exports.isEmptyList = isEmptyList;
const notOfTypeMsg = (value, expType, msg = '') => {
    const m = [`The value`, (0, util_1.inspect)(value), `is not of type`, expType];
    if (msg)
        m.unshift(msg, ':');
    return m.join(' ');
};
function ensureList(val, msg = '') {
    if (!(0, exports.isList)(val)) {
        throw new Error(notOfTypeMsg(val, 'LIST', msg));
    }
}
exports.ensureList = ensureList;
function ensureNumber(val, msg = '') {
    if (typeof val !== 'number') {
        throw new Error(notOfTypeMsg(val, 'number', msg));
    }
}
exports.ensureNumber = ensureNumber;
function ensureString(val, msg = '') {
    if (typeof val !== 'string') {
        throw new Error(notOfTypeMsg(val, 'string', msg));
    }
}
exports.ensureString = ensureString;
function ensureFunction(val, msg = '') {
    if (typeof val !== 'function') {
        throw new Error(notOfTypeMsg(val, 'function', msg));
    }
}
exports.ensureFunction = ensureFunction;
// export function ensureListOrSymb(val: Parameter,
// msg: string = ''): asserts val is List | Symb {
//   const types = ['string'];
//   if (typeof val !== 'string') {
//     throw new Error(notOfTypeMsg(val, 'string', msg));
//   }
// }
function ensureList_logger(val, logger) {
    try {
        ensureList(val);
    }
    catch (e) {
        if (logger) {
            logger.fatal(e.message);
        }
        else {
            throw e;
        }
    }
}
exports.ensureList_logger = ensureList_logger;
//# sourceMappingURL=types.js.map