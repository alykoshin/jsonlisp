/** @format */
import { ExecutorFn, Actions } from '../../eval/sexpr';
/**
 * @module $sbcl
 */
/**
 * @name $sbcl
 */
export declare const $sbcl: ExecutorFn;
/**
 * @name $parse-sbcl-list
 * The reader alone: parse an SBCL-printed string into JL, without running
 * SBCL (see reader.ts, vendored from lisp2jl).
 */
export declare const $parseSbclList: ExecutorFn;
/**
 * @name $sbcl-to-list
 */
export declare const $sbclToList: ExecutorFn;
declare const actions: Actions;
export default actions;
