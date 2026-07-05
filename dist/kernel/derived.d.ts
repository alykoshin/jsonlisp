/** @format */
/**
 * @module kernel/derived
 * The derived functions of The Roots of Lisp §3 ("Some Functions") — SICP's
 * term: "derived expressions". Written in JL itself via createExecutorFn,
 * mirroring jmc.lisp one-to-one (`_` replaces Graham's `.` suffix):
 *
 *   null. and. not. append. list. pair. assoc.
 *
 * Together with the seven primitives and lambda/defun these are exactly the
 * vocabulary the paper needs to write eval. — see the meta-circular test
 * activity (src/tests/kernel/jmc-eval.jl.ts).
 */
import { Actions } from '../eval/sexpr';
/**
 * @name null_
 * (defun null. (x) (eq x '()))
 */
export declare const null_: import("../eval/sexpr").ExecutorFn;
/**
 * @name and_
 * (defun and. (x y) (cond (x (cond (y 't) ('t '()))) ('t '())))
 */
export declare const and_: import("../eval/sexpr").ExecutorFn;
/**
 * @name not_
 * (defun not. (x) (cond (x '()) ('t 't)))
 */
export declare const not_: import("../eval/sexpr").ExecutorFn;
/**
 * @name append_
 * (defun append. (x y) (cond ((null. x) y) ('t (cons (car x) (append. (cdr x) y)))))
 */
export declare const append_: import("../eval/sexpr").ExecutorFn;
/**
 * @name list_
 * (defun list. (x y) (cons x (cons y '())))
 */
export declare const list_: import("../eval/sexpr").ExecutorFn;
/**
 * @name pair_
 * (defun pair. (x y)
 *   (cond ((and. (null. x) (null. y)) '())
 *         ((and. (not. (atom x)) (not. (atom y)))
 *          (cons (list. (car x) (car y)) (pair. (cdr x) (cdr y))))))
 */
export declare const pair_: import("../eval/sexpr").ExecutorFn;
/**
 * @name assoc_
 * (defun assoc. (x y) (cond ((eq (caar y) x) (cadar y)) ('t (assoc. x (cdr y)))))
 * (c*r compositions inlined — caar y = (car (car y)), cadar y = (car (cdr (car y))))
 */
export declare const assoc_: import("../eval/sexpr").ExecutorFn;
export declare const actions: Actions;
export default actions;
