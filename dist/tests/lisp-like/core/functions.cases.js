"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cases = void 0;
const types_1 = require("../../../actions/lisp-like/helpers/types");
// prettier-ignore
exports.cases = [
    [["lambda", [], ['atom', 1]],
        "( lambda   ()  ( atom   1))"],
    [["lambda", [], ['atom', ['quote', [1, 2]]]],
        "( lambda   ()  ( atom   (quote    (1  2))))"],
    [[["lambda", [], ['atom', 1]]],
        "(( lambda   ()  ( atom   1) ))"],
    [[["lambda", [], ['atom', ['quote', [1, 2]]]]],
        "(( lambda   ()  ( atom   (quote    (1  2)))))"],
    [[["lambda", [], ['atom', ['quote', [1, 2]]]]],
        "(( lambda   ()  ( atom   ( quote   (1  2)))))"],
    [[["lambda", ["a", "b"], ['atom', ['quote', [1, 2]]]], 11, 22],
        "(( lambda  ( a   b)  ( atom  ( quote  (1 2)))) 11 22 )"
    ],
    //
    [["defun", "test1", [], ['atom', 1]],
        "( defun    test1   ()  ( atom   1) )",
        `This fails because we are case-sensitive at the moment, while LISP isn't`],
    [["defun", "TEST1", [], ['atom', 1]],
        "( defun    test1   ()  ( atom   1) )"],
    //
    [["null_", 1],
        "( null     1 )"],
    [["null_", []],
        "( null     () )"],
    //
    [["and_", ["atom", 1], ['eq', 1, 1]],
        "( and    (atom    1)  ( eq   1  1))"],
    [["and_", ["atom", 1], ['eq', 1, 2]],
        "( and    (atom    1)  ( eq   1  2))"],
    // we use 'cond' because at this context this is the only function at the moment
    // able to run sequence of expressions
    [["cond", [types_1.T, ["defun", "test1", [], ['atom', 1]],
                ["test1"]]],
        ` (cond   (T  ( defun    test1   ()  (atom    1))
                ( test1 )))`],
    [["cond", [types_1.T, ["defun", "test1", [], ['atom', ['quote', [1]]]],
                ["test1"]]],
        ` (cond   (T  ( defun    test1   ()  ( atom   ( quote   ( 1 ))))
                ( test1 )))`],
];
exports.default = exports.cases;
//# sourceMappingURL=functions.cases.js.map