"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.assoc_ = exports.pair_ = exports.list_ = exports.append_ = exports.not_ = exports.and_ = exports.null_ = void 0;
const booleans_1 = require("./booleans");
const lambda_1 = require("./lambda");
/**
 * @name null_
 * (defun null. (x) (eq x '()))
 */
// prettier-ignore
exports.null_ = (0, lambda_1.createExecutorFn)('null_', ['x'], ['eq', 'x', []]);
/**
 * @name and_
 * (defun and. (x y) (cond (x (cond (y 't) ('t '()))) ('t '())))
 */
// prettier-ignore
exports.and_ = (0, lambda_1.createExecutorFn)('and_', ['x', 'y'], ['cond', ['x', ['cond', ['y', ['quote', booleans_1.T]], [['quote', booleans_1.T], ['quote', []]]]],
    [['quote', booleans_1.T], ['quote', []]]]);
/**
 * @name not_
 * (defun not. (x) (cond (x '()) ('t 't)))
 */
// prettier-ignore
exports.not_ = (0, lambda_1.createExecutorFn)('not_', ['x'], ['cond', ['x', ['quote', []]],
    [['quote', booleans_1.T], ['quote', booleans_1.T]]]);
/**
 * @name append_
 * (defun append. (x y) (cond ((null. x) y) ('t (cons (car x) (append. (cdr x) y)))))
 */
// prettier-ignore
exports.append_ = (0, lambda_1.createExecutorFn)('append_', ['x', 'y'], ['cond', [['null_', 'x'], 'y'],
    [['quote', booleans_1.T], ['cons', ['car', 'x'], ['append_', ['cdr', 'x'], 'y']]]]);
/**
 * @name list_
 * (defun list. (x y) (cons x (cons y '())))
 */
// prettier-ignore
exports.list_ = (0, lambda_1.createExecutorFn)('list_', ['x', 'y'], ['cons', 'x', ['cons', 'y', ['quote', []]]]);
/**
 * @name pair_
 * (defun pair. (x y)
 *   (cond ((and. (null. x) (null. y)) '())
 *         ((and. (not. (atom x)) (not. (atom y)))
 *          (cons (list. (car x) (car y)) (pair. (cdr x) (cdr y))))))
 */
// prettier-ignore
exports.pair_ = (0, lambda_1.createExecutorFn)('pair_', ['x', 'y'], ['cond', [['and_', ['null_', 'x'], ['null_', 'y']], ['quote', []]],
    [['and_', ['not_', ['atom', 'x']], ['not_', ['atom', 'y']]],
        ['cons', ['list_', ['car', 'x'], ['car', 'y']],
            ['pair_', ['cdr', 'x'], ['cdr', 'y']]]]]);
/**
 * @name assoc_
 * (defun assoc. (x y) (cond ((eq (caar y) x) (cadar y)) ('t (assoc. x (cdr y)))))
 * (c*r compositions inlined — caar y = (car (car y)), cadar y = (car (cdr (car y))))
 */
// prettier-ignore
exports.assoc_ = (0, lambda_1.createExecutorFn)('assoc_', ['x', 'y'], ['cond', [['eq', ['car', ['car', 'y']], 'x'], ['car', ['cdr', ['car', 'y']]]],
    [['quote', booleans_1.T], ['assoc_', 'x', ['cdr', 'y']]]]);
exports.actions = {
    null_: exports.null_,
    and_: exports.and_,
    not_: exports.not_,
    append_: exports.append_,
    list_: exports.list_,
    pair_: exports.pair_,
    assoc_: exports.assoc_,
};
exports.default = exports.actions;
//# sourceMappingURL=derived.js.map