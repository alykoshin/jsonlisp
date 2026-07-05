/** @format */

/**
 * The meta-circular gate ("The Surprise", The Roots of Lisp §4):
 * McCarthy's eval. translated from jmc.lisp into JL, running on the JL
 * interpreter itself. If the kernel can run the paper's evaluator, the
 * kernel is complete and correctly wired (see ARCHITECTURE.md).
 *
 * Uses only: the seven primitives, defun/lambda, and the kernel's derived
 * functions (null_ and_ not_ append_ list_ pair_ assoc_). The c*r
 * compositions are defun'd here, as the paper assumes them from CL.
 *
 * Run:  ts-node ./src/cli.ts ./src/tests/kernel/jmc-eval.jl.ts
 */

import {Activity} from '../../toplevel/Activities';
import {NIL, T} from '../../kernel/booleans';

// prettier-ignore
export const config: Activity = {
  base_dir: './',
  version: '0.0.0',
  actions: {
    default: [
      'list',
      ['defs'],
      ['test-derived'],
      ['test-jmc-eval'],
      ['princ', 'assert-x:\n' + '  OK:   ${ assert_ok_count }\n' + '  FAIL: ${ assert_fail_count }'],
    ],

    // ----- c*r compositions (assumed from CL by the paper) -----
    defs: ['list',
      ['defun', 'caar',   ['x'], ['car', ['car', 'x']]],
      ['defun', 'cadr',   ['x'], ['car', ['cdr', 'x']]],
      ['defun', 'caddr',  ['x'], ['car', ['cdr', ['cdr', 'x']]]],
      ['defun', 'cadar',  ['x'], ['car', ['cdr', ['car', 'x']]]],
      ['defun', 'caddar', ['x'], ['car', ['cdr', ['cdr', ['car', 'x']]]]],

      // ----- evcon. / evlis. (jmc.lisp) -----
      ['defun', 'evcon.', ['c', 'a'],
        ['cond', [['eval.', ['caar', 'c'], 'a'],
                  ['eval.', ['cadar', 'c'], 'a']],
                [['quote', T], ['evcon.', ['cdr', 'c'], 'a']]]],

      ['defun', 'evlis.', ['m', 'a'],
        ['cond', [['null_', 'm'], ['quote', []]],
                [['quote', T], ['cons', ['eval.', ['car', 'm'], 'a'],
                                        ['evlis.', ['cdr', 'm'], 'a']]]]],

      // ----- eval. (jmc.lisp, clause for clause) -----
      ['defun', 'eval.', ['e', 'a'],
        ['cond',
          [['atom', 'e'], ['assoc_', 'e', 'a']],
          [['atom', ['car', 'e']],
           ['cond',
             [['eq', ['car', 'e'], ['quote', 'quote']], ['cadr', 'e']],
             [['eq', ['car', 'e'], ['quote', 'atom']],
              ['atom', ['eval.', ['cadr', 'e'], 'a']]],
             [['eq', ['car', 'e'], ['quote', 'eq']],
              ['eq', ['eval.', ['cadr', 'e'], 'a'],
                     ['eval.', ['caddr', 'e'], 'a']]],
             [['eq', ['car', 'e'], ['quote', 'car']],
              ['car', ['eval.', ['cadr', 'e'], 'a']]],
             [['eq', ['car', 'e'], ['quote', 'cdr']],
              ['cdr', ['eval.', ['cadr', 'e'], 'a']]],
             [['eq', ['car', 'e'], ['quote', 'cons']],
              ['cons', ['eval.', ['cadr', 'e'], 'a'],
                       ['eval.', ['caddr', 'e'], 'a']]],
             [['eq', ['car', 'e'], ['quote', 'cond']],
              ['evcon.', ['cdr', 'e'], 'a']],
             [['quote', T],
              ['eval.', ['cons', ['assoc_', ['car', 'e'], 'a'],
                                 ['cdr', 'e']],
                        'a']]]],
          [['eq', ['caar', 'e'], ['quote', 'label']],
           ['eval.', ['cons', ['caddar', 'e'], ['cdr', 'e']],
                     ['cons', ['list_', ['cadar', 'e'], ['car', 'e']], 'a']]],
          [['eq', ['caar', 'e'], ['quote', 'lambda']],
           ['eval.', ['caddar', 'e'],
                     ['append_', ['pair_', ['cadar', 'e'],
                                           ['evlis.', ['cdr', 'e'], 'a']],
                                 'a']]]]],
    ],

    // ----- the paper's derived functions (registered in the kernel) -----
    'test-derived': ['list',
      ['assert-equal', ['null_', ['quote', []]], T],
      ['assert-equal', ['null_', ['quote', 'a']], NIL],
      ['assert-equal', ['not_', ['quote', []]], T],
      ['assert-equal', ['and_', ['atom', ['quote', 'a']], ['eq', ['quote', 'a'], ['quote', 'a']]], T],
      ['assert-equal',
        ['append_', ['quote', ['a', 'b']], ['quote', ['c', 'd']]],
        ['quote', ['a', 'b', 'c', 'd']]],
      ['assert-equal',
        ['list_', ['quote', 'a'], ['quote', 'b']],
        ['quote', ['a', 'b']]],
      ['assert-equal',
        ['pair_', ['quote', ['x', 'y', 'z']], ['quote', ['a', 'b', 'c']]],
        ['quote', [['x', 'a'], ['y', 'b'], ['z', 'c']]]],
      ['assert-equal',
        ['assoc_', ['quote', 'y'], ['quote', [['x', 'a'], ['y', 'b']]]],
        'b'],
    ],

    // ----- the paper's §4 examples, run through eval. itself -----
    'test-jmc-eval': ['list',
      // (eval. 'x '((x a) (y b)))  =>  a
      ['assert-equal',
        ['eval.', ['quote', 'x'], ['quote', [['x', 'a'], ['y', 'b']]]],
        'a'],

      // (eval. '(eq 'a 'a) '())  =>  t
      ['assert-equal',
        ['eval.', ['quote', ['eq', ['quote', 'a'], ['quote', 'a']]], ['quote', []]],
        T],

      // (eval. '(cons x '(b c)) '((x a) (y b)))  =>  (a b c)
      ['assert-equal',
        ['eval.',
          ['quote', ['cons', 'x', ['quote', ['b', 'c']]]],
          ['quote', [['x', 'a'], ['y', 'b']]]],
        ['quote', ['a', 'b', 'c']]],

      // (eval. '(cond ((atom x) 'atom) ('t 'list)) '((x '(a b))))  =>  list
      ['assert-equal',
        ['eval.',
          ['quote', ['cond', [['atom', 'x'], ['quote', 'atom']],
                            [['quote', T], ['quote', 'list']]]],
          ['quote', [['x', ['quote', ['a', 'b']]]]]],
        'list'],

      // (eval. '(f '(b c)) '((f (lambda (x) (cons 'a x)))))  =>  (a b c)
      ['assert-equal',
        ['eval.',
          ['quote', ['f', ['quote', ['b', 'c']]]],
          ['quote', [['f', ['lambda', ['x'], ['cons', ['quote', 'a'], 'x']]]]]],
        ['quote', ['a', 'b', 'c']]],

      // the paper's label example:
      // (eval. '((label subst (lambda (x y z) ...)) 'm 'b '(a b (a b c) d)) '())
      //   =>  (a m (a m c) d)
      ['assert-equal',
        ['eval.',
          ['quote',
            [['label', 'subst',
              ['lambda', ['x', 'y', 'z'],
                ['cond',
                  [['atom', 'z'],
                   ['cond', [['eq', 'z', 'y'], 'x'],
                           [['quote', T], 'z']]],
                  [['quote', T],
                   ['cons', ['subst', 'x', 'y', ['car', 'z']],
                            ['subst', 'x', 'y', ['cdr', 'z']]]]]]],
             ['quote', 'm'], ['quote', 'b'],
             ['quote', ['a', 'b', ['a', 'b', 'c'], 'd']]]],
          ['quote', []]],
        ['quote', ['a', 'm', ['a', 'm', 'c'], 'd']]],
    ],
  },
};

export default config;
