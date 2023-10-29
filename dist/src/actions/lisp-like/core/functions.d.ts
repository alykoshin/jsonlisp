/** @format */
import { Actions, Parameter, ExecutorFn } from '../../../apps/runner/lib/types';
/**
 * @module functions
 * @see
 * - Common Lisp: Working with &rest parameters --
 *   https://stackoverflow.com/questions/629699/common-lisp-working-with-rest-parameters <br>
 * - LispWorks -- Common Lisp HyperSpec -- Function APPLY --
 *   {@link http://clhs.lisp.se/Body/f_apply.htm}
 */
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
export declare const createPrepareFn: (name: string, argnames: Parameter, body: Parameter) => ExecutorFn;
export declare const defun: ExecutorFn;
/**
 * @name null_
 */
export declare const null_: ExecutorFn;
/**
 * @name and_
 */
export declare const and_: ExecutorFn;
export declare const actions: Actions;
export default actions;
