/** @format */

/**
 * @module kernel/booleans
 * Lisp truthiness — CL spec term: "generalized boolean".
 * T = true, NIL = false; the empty list is nil (CL's NIL/() identity,
 * approximated). See ARCHITECTURE.md, divergence 5.
 */

import {Parameter, isEmptyList} from '../eval/sexpr';

export const T = true;
export const isT = (value: any): boolean => value === true;

export type NIL = false;
export const NIL = false;
export const isNil = (value: any): boolean =>
  isEmptyList(value) || value === false;

export const asBoolean = (value: Parameter): boolean =>
  typeof value === 'boolean'
    ? value
    : typeof value !== 'undefined' && value !== null && !isEmptyList(value);
