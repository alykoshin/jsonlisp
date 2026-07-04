/** @format */
/**
 * @module kernel/booleans
 * Lisp truthiness — CL spec term: "generalized boolean".
 * T = true, NIL = false; the empty list is nil (CL's NIL/() identity,
 * approximated). See ARCHITECTURE.md, divergence 5.
 */
import { Parameter } from '../eval/sexpr';
export declare const T = true;
export declare const isT: (value: any) => boolean;
export type NIL = false;
export declare const NIL = false;
export declare const isNil: (value: any) => boolean;
export declare const asBoolean: (value: Parameter) => boolean;
