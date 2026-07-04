/** @format */
/**
 * @module kernel
 * The axiomatic kernel (Graham, "The Roots of Lisp"): the seven primitives,
 * lambda/defun, and the paper's derived functions. See ARCHITECTURE.md.
 */
import { Actions } from '../eval/sexpr';
export * from './booleans';
export declare const actions: Actions;
export default actions;
