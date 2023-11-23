/** @format */

import {NIL, T} from '../../../actions/lisp-like/helpers/types';
import {TestCase} from '../../../apps/test-runner/core-test-runner';

// prettier-ignore
export const cases: TestCase[] = [
  // [["quote", "a"], "(quote a)",
  //   "This test returns false because Common LISP handles Symbols case insensitive, while we are not sure if it's ok here as we are not able to differentiate symbols and strings."],
  // [ ["quote", "A"], "(quote A)"],
  // //
  // [ ["atom", 1], "(atom 1)"],
  // [ ["atom", "a"], "(atom 'a)"],
  // [ ["atom", []], "(atom ())"],
  // [ ["atom", ["quote", [1, 2]]], "(atom (quote (1 2)))"],
  // // 
  // [["eq", 1, 1], "(eq 1 1)"],
  // [["eq", 1, 2], "(eq 1 2)"],
  // [["eq", ["quote", 1], ["quote", 1]], "(eq '1 '1)"],
  // [["eq", ["quote", 1], ["quote", 2]], "(eq '1 '2)"],
  // [["eq", ["quote", []], ["quote", []]], "(eq '() '() )"],
  // [["eq", ["quote", [1]], ["quote", [1]]], "(eq '(1) '(1) )"],
  // [["eq", ["quote", [1]], ["quote", [2]]], "(eq '(1) '(2) )"],
  // [["eq", ["quote", [1,2]], ["quote", [1,2]]], "(eq '(1 2) '(1 2) )"],
  // [["eq", ["quote", [1,2]], ["quote", [2,1]]], "(eq '(1 2) '(2 1) )"],
  // [["eq", ["quote", false], ["quote", []]], "(eq '() '() )"],

  // // edge cases
  // [["car", []], "(car ())"],
  // [["car", ["quote", []]],  "(car '())"],
  // [["car", ["quote", [1]]], "(car '(1))"],
  // // main cases
  // [["car", ["quote", [1, 2]]],    "(car (quote (1 2)))"],
  // [["car", ["quote", [1, 2, 3]]], "(car (quote (1 2 3)))"],
  // [["car", ["quote", [1, 2, 3]]], "(car '(1 2 3))"],
  // // no evaluation
  [["car", ["quote", [ ["print", 111], ["print", 222] ]]], "(car '( (print 111) (print 222) ))"],
  // // sub lists
  // [["car", ["quote", [[1, 2], [3, 4], [5, 6]] ] ], "(car '((1 2) (3 4) (5 6)) )"],

  // // edge cases
  // [["cdr", []], "(cdr ())"],
  // [["cdr", ["quote", []]],  "(cdr '())"],
  // [["cdr", ["quote", [1]]], "(cdr '(1))"],
  // // main cases
  // [["cdr", ["quote", [1, 2]]],    "(cdr (quote (1 2)))"],
  // [["cdr", ["quote", [1, 2, 3]]], "(cdr (quote (1 2 3)))"],
  // [["cdr", ["quote", [1, 2, 3]]], "(cdr '(1 2 3))"],
  // // sub lists
  // [["cdr", ["quote", [[1, 2], [3, 4], [5, 6]]]], "(cdr '((1 2) (3 4) (5 6)) )"],

  // //
  // [["cons", ["quote", 1], ["quote", [2, 3]]], "(cons '1 '(2 3))"],
  // [
  //   ["cons",
  //     ["quote", 1],
  //     ["cons",
  //       ["quote", 2],
  //       ["cons",
  //         ["quote", 3],
  //         ["quote", []]]]],
  //   "(cons '1 (cons '2 (cons '3 '())))"
  // ],
  // [["car", ["cons", ["quote", 1], ["quote", [2, 3]]]],
  //   "(car (cons '1 '(2 3)))"],
  // [["cdr", ["cons", ["quote", 1], ["quote", [2, 3]]]],
  //   "(cdr (cons '1 '(2 3)))"],
  
  // //

  // // edge cases
  // [["cond", [false, 1]],            "(cond (NIL 1))"],
  // [["cond", [false],    [false]],   "(cond (NIL) (NIL))"],
  // [["cond", [false, 1], [false, 2]],"(cond (NIL 1) (NIL 2))"],
  // [["cond", [false, 1], [true]],    "(cond (NIL 1) (T))"],
  // [["cond", [false, 1], [true, 2]], "(cond (NIL 1) (T 2))"],
  // [["cond", [[], 1],    [true, 2]], "(cond (() 1)  (T 2))"],
  // [["cond", [[]],       [true, 2]], "(cond (())    (T 2))"],
  // [["cond", [[]],       [true]],    "(cond (())    (T))"],
  // [["cond", [[]],       [2]],       "(cond (())    (2))"],
  // [["cond", [1], [2]],              "(cond (1)     (2))"],
  // // main cases
  // [["cond",
  //   [["eq", ["quote", 1], ["quote", 2]],
  //     ["quote", 111]],
  //   [["atom", ["quote", 1]],
  //     ["quote", 222]]],
  //   "(cond ((eq '1 '2) '111) ((atom '1) '222))"],
  // // Test the result of T branch expression execution
  // // todo: need to add check that all the expressions were evaluated
  // [["cond",  
  //   [T, ["quote", [20]],
  //       ["quote", [21]]]], 
  // '(cond' +
  //   '( T (quote (20)) (quote (21)) ) )'],
  // [["cond",  
  //   [T, ["quote", 20],
  //       ["quote", 21]]], 
  // '(cond' +
  //   '( T (quote 20) (quote 21) ) )'],
  // [["cond",  
  //   [T, 20,
  //       21]], 
  // '(cond' +
  //   '( T 20 21 ) )'],
];

export default cases;
