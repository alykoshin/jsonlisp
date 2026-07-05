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

import {Actions} from '../eval/sexpr';
import {T} from './booleans';
import {createExecutorFn} from './lambda';

/**
 * @name null_
 * (defun null. (x) (eq x '()))
 */
// prettier-ignore
export const null_ = createExecutorFn(
  'null_',
  [ 'x' ], [ 'eq', 'x', [] ]
);

/**
 * @name and_
 * (defun and. (x y) (cond (x (cond (y 't) ('t '()))) ('t '())))
 */
// prettier-ignore
export const and_ = createExecutorFn(
  'and_',
  ['x', 'y'],
  ['cond', ['x', ['cond', ['y', ['quote', T]], [['quote', T], ['quote', []]]]],
          [['quote', T], ['quote', []]]]);

/**
 * @name not_
 * (defun not. (x) (cond (x '()) ('t 't)))
 */
// prettier-ignore
export const not_ = createExecutorFn(
  'not_',
  ['x'],
  ['cond', ['x', ['quote', []]],
          [['quote', T], ['quote', T]]]);

/**
 * @name append_
 * (defun append. (x y) (cond ((null. x) y) ('t (cons (car x) (append. (cdr x) y)))))
 */
// prettier-ignore
export const append_ = createExecutorFn(
  'append_',
  ['x', 'y'],
  ['cond', [['null_', 'x'], 'y'],
          [['quote', T], ['cons', ['car', 'x'], ['append_', ['cdr', 'x'], 'y']]]]);

/**
 * @name list_
 * (defun list. (x y) (cons x (cons y '())))
 */
// prettier-ignore
export const list_ = createExecutorFn(
  'list_',
  ['x', 'y'],
  ['cons', 'x', ['cons', 'y', ['quote', []]]]);

/**
 * @name pair_
 * (defun pair. (x y)
 *   (cond ((and. (null. x) (null. y)) '())
 *         ((and. (not. (atom x)) (not. (atom y)))
 *          (cons (list. (car x) (car y)) (pair. (cdr x) (cdr y))))))
 */
// prettier-ignore
export const pair_ = createExecutorFn(
  'pair_',
  ['x', 'y'],
  ['cond', [['and_', ['null_', 'x'], ['null_', 'y']], ['quote', []]],
          [['and_', ['not_', ['atom', 'x']], ['not_', ['atom', 'y']]],
           ['cons', ['list_', ['car', 'x'], ['car', 'y']],
                    ['pair_', ['cdr', 'x'], ['cdr', 'y']]]]]);

/**
 * @name assoc_
 * (defun assoc. (x y) (cond ((eq (caar y) x) (cadar y)) ('t (assoc. x (cdr y)))))
 * (c*r compositions inlined — caar y = (car (car y)), cadar y = (car (cdr (car y))))
 */
// prettier-ignore
export const assoc_ = createExecutorFn(
  'assoc_',
  ['x', 'y'],
  ['cond', [['eq', ['car', ['car', 'y']], 'x'], ['car', ['cdr', ['car', 'y']]]],
          [['quote', T], ['assoc_', 'x', ['cdr', 'y']]]]);

export const actions: Actions = {
  null_,
  and_,
  not_,
  append_,
  list_,
  pair_,
  assoc_,
};

export default actions;
