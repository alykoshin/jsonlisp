"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asBoolean = exports.isNil = exports.NIL = exports.isT = exports.T = void 0;
/**
 * @module kernel/booleans
 * Lisp truthiness — CL spec term: "generalized boolean".
 * T = true, NIL = false; the empty list is nil (CL's NIL/() identity,
 * approximated). See ARCHITECTURE.md, divergence 5.
 */
const sexpr_1 = require("../eval/sexpr");
exports.T = true;
const isT = (value) => value === true;
exports.isT = isT;
exports.NIL = false;
const isNil = (value) => (0, sexpr_1.isEmptyList)(value) || value === false;
exports.isNil = isNil;
const asBoolean = (value) => typeof value === 'boolean'
    ? value
    : typeof value !== 'undefined' && value !== null && !(0, sexpr_1.isEmptyList)(value);
exports.asBoolean = asBoolean;
//# sourceMappingURL=booleans.js.map