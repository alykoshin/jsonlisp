"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activity = void 0;
const _sbcl_1 = __importDefault(require("../../actions/$sbcl"));
// prettier-ignore
const actions = {
    ..._sbcl_1.default,
    "default": ['list', ['print', 'This will test operators'],
        // ['test-quote'],
        // ['test-list'],
        // ['test-length'],
        // ['test-nth'],
        // ['test-nthcdr'],
        // ['test-cdr'],
        // ['test-rest'],
        // ['test-first'],
        ['test-consp'],
        ['test-listp'],
        ['princ', 'assert-x:\n' + '  OK:   ${ assert_ok_count }\n' + '  FAIL: ${ assert_fail_count }'],
    ],
    "test-quote": ['list',
        ['assert-equal', ["quote", 1], ["$sbcl-to-list", "(quote 1)"]],
        ['assert-equal', ["quote", [1, 2, 3]], ["$sbcl-to-list", "(quote (1 2 3) )"]],
    ],
    /*(print (quote 5) )
    ; (print quote (6) )
    ; (print 'quote (7) )
    ; (print (8) )
    (print (list 8 8) )
    ; (print (quote 9 9) )
    (print (quote (10 10) ) )*/
    "test-list": ['list',
        ['print', 'list. In LISP empty list evaluates to NIL, so I\'m not sure what has to correspond to it here (next test case fails because of it'],
        //
        ['assert-equal', ["list"], ["$sbcl-to-list", "(list)"]],
        //
        ['assert-equal', ["list", 1], ["$sbcl-to-list", "(list 1)"]],
        ['assert-equal', ["list", 1, 2, 3], ["$sbcl-to-list", "(list 1 2 3)"]],
    ],
    "test-length": ['list',
        ['print', 'length'],
        ['assert-equal', ["length", ["list"]], ["$sbcl-to-list", "(length (list))"]],
        ['assert-equal', ["length", ["list", 1]], ["$sbcl-to-list", "(length (list 1))"]],
        ['assert-equal', ["length", ["list", 1, 2, 3]], ["$sbcl-to-list", "(length (list 1 2 3))"]],
    ],
    "test-nth": ['list',
        ['print', 'nth'],
        ['assert-equal', ["nth", 1, ["list", 11, 22, 33, 44]], ["$sbcl-to-list", "(nth 1 (list 11 22 33 44))"]],
    ],
    "test-cdr": ['list',
        ['print', 'cdr'],
        ['assert-equal', ["cdr", ["list", 11, 22, 33, 44]], ["$sbcl-to-list", "(cdr (list 11 22 33 44))"]],
    ],
    "test-nthcdr": ['list',
        ['print', 'nthcdr'],
        ['assert-equal', ["nthcdr", 2, ["list", 11, 22, 33, 44]], ["$sbcl-to-list", "(nthcdr 2 (list 11 22 33 44))"]],
    ],
    "test-rest": ['list',
        ['print', 'rest'],
        ['assert-equal', ["rest", ["list", 11, 22, 33, 44]], ["list", 22, 33, 44]],
        // ['assert-equal', [ "rest", [ "list", 11, 22, 33 ] ], [ "cdr", [ "list", 11, 22, 33 ] ] ],
    ],
    "test-first": ['list',
        ['print', 'first'],
        ['assert-equal', ["first", ["list", 11, 22, 33, 44]], 11],
        ['assert-equal', ["first", ["list", 11, 22, 33, 44]], ["$sbcl-to-list", "(first (list 11 22 33 44))"]],
    ],
    "test-consp": ['list',
        ['print', 'consp'],
        ['assert-equal', ["consp", 1], ["$sbcl-to-list", "(consp 1)"]],
        ['assert-equal', ["consp", ["list"]], ["$sbcl-to-list", "(consp (list))"]],
        ['assert-equal', ["consp", ["list", 11]], ["$sbcl-to-list", "(consp (list 11))"]],
        ['assert-equal', ["consp", ["list", 11, 22]], ["$sbcl-to-list", "(consp (list 11 22))"]],
    ],
    "test-listp": ['list',
        ['print', 'listp'],
        ['assert-equal', ["listp", 1], ["$sbcl-to-list", "(listp 1)"]],
        ['assert-equal', ["listp", ["list"]], ["$sbcl-to-list", "(listp (list))"]],
        ['assert-equal', ["listp", ["list", 11]], ["$sbcl-to-list", "(listp (list 11))"]],
        ['assert-equal', ["listp", ["list", 11, 22]], ["$sbcl-to-list", "(listp (list 11 22))"]],
    ],
};
exports.activity = {
    base_dir: '.',
    version: '0.0.0',
    actions: {
        ...actions,
    },
};
exports.default = exports.activity;
//# sourceMappingURL=lists.js.map