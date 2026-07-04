/** @format */
/**
 * @module kernel/primitives
 * Graham's seven primitive operators (The Roots of Lisp, 2002; McCarthy 1960):
 * quote atom eq car cdr cons cond. The `cond` clause loop is jmc.lisp's evcon.
 */
import { Actions, ExecutorFn } from '../eval/sexpr';
/**
 *  @name quote
 */
export declare const quote: ExecutorFn;
/**
 * @name atom
 */
export declare const atom: ExecutorFn;
/**
 * @name eq
 */
export declare const eq: ExecutorFn;
/**
 * @name car
 */
export declare const car: ExecutorFn;
/**
 * @name cdr
 */
export declare const cdr: ExecutorFn;
/**
 * @name cons
 */
export declare const cons: ExecutorFn;
/**
 * @name cond
 * The clause loop is jmc.lisp's evcon.
 */
export declare const cond: ExecutorFn;
export declare const actions: Actions;
export default actions;
