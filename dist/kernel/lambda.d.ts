/** @format */
/**
 * @module kernel/lambda
 * Denoting functions (The Roots of Lisp §2): lambda, and label as `defun`.
 * `createExecutorFn` is the closure machinery; null_ / and_ are the first
 * two derived functions of the paper's sequence (jmc.lisp: null. and.),
 * written in JL itself.
 *
 * @see
 * - Common Lisp: Working with &rest parameters --
 *   https://stackoverflow.com/questions/629699/common-lisp-working-with-rest-parameters <br>
 * - LispWorks -- Common Lisp HyperSpec -- Function APPLY --
 *   {@link http://clhs.lisp.se/Body/f_apply.htm}
 */
import { Actions, Parameter, ExecutorFn } from '../eval/sexpr';
export declare const createExecutorFn: (name: string, argnames: Parameter, body: Parameter) => ExecutorFn;
/**
 * @name lambda
 * @see
 * - An Introduction to Programming in Emacs Lisp -- C.4.3 A lambda Expression: Useful Anonymity --
 *   {@link https://www.gnu.org/software/emacs/manual/html_node/eintr/lambda.html} <br>
 * - An Introduction to Programming in Emacs Lisp -- 13.2 Lambda Expressions --
 *   {@link https://www.gnu.org/software/emacs/manual/html_node/elisp/Lambda-Expressions.html} <br>
 * - Common Lisp the Language, 2nd Edition -- 5.2.2. Lambda-Expressions --
 *   {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node64.html} <br>
 */
export declare const lambda: ExecutorFn;
/**
 * @name defun
 * The paper's `label`, in its modern form: registers into the function
 * namespace (Lisp-2 divergence — see ARCHITECTURE.md).
 */
export declare const defun: ExecutorFn;
export declare const actions: Actions;
export default actions;
