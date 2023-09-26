"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activity = void 0;
const _sbcl_1 = __importDefault(require("../../actions/$sbcl/"));
const actions = {
    ..._sbcl_1.default,
    default: ['$series', ['print', 'This will test operators'],
        // ['test-plus'],
        // ['test-minus'],
        // ['test-mult'],
        // ['test-div'],
        // ['test-eq'],
        ['test-neq'],
        ['print',
            '$expect:\n' +
                '  OK:   ${ $expect_ok_count }\n' +
                '  FAIL: ${ $expect_fail_count }'],
    ],
    "test-plus": ['$series',
        ['print', '+'],
        ["$expect", ["+", 0], ["$sbcl-to-list", "(+ 0)"]],
        ["$expect", ["+", 4], ["$sbcl-to-list", "(+ 4)"]],
        ["$expect", ["+", -4], ["$sbcl-to-list", "(+ -4)"]],
        ["$expect", ["+", 1, 2], ["$sbcl-to-list", "(+ 1 2)"]],
        ["$expect", ["+", 1, 2, 3], ["$sbcl-to-list", "(+ 1 2 3)"]],
        ["$expect", ["+", ["+", 101, 102], 1, 2], ["$sbcl-to-list", "(+ (+ 101 102) 1 2)"]],
        ["$expect", ["+", 1, ["+", 101, 102], 2], ["$sbcl-to-list", "(+ 1 (+ 101 102) 2)"]],
        ["$expect", ["+", 1, 2, ["+", 101, 102]], ["$sbcl-to-list", "(+ 1 2 (+ 101 102))"]],
    ],
    "test-minus": ['$series',
        ['print', '-'],
        // ["$expect", ["-"], 0], // CLisp gives an error for '-','/' without parameters (however ok for '+' and '*')
        ["$expect", ["-", 0], ["$sbcl-to-list", "(- 0)"]],
        ["$expect", ["-", 1], ["$sbcl-to-list", "(- 1)"]],
        ['$expect', ["-", 2, 3], ["$sbcl-to-list", "(- 2 3)"]],
        ['$expect', ["-", 3, 2], ["$sbcl-to-list", "(- 3 2)"]],
        ['$expect', ["-", 2, 3, 4], ["$sbcl-to-list", "(- 2 3 4)"]],
        ["$expect", ["-", 4, ["-", 2, 1]], ["$sbcl-to-list", "(- 4 (- 2 1))"]],
    ],
    "test-mult": ['$series',
        ['print', '*'],
        ["$expect", ["*"], ["$sbcl-to-list", "(*)"]],
        ["$expect", ["*", 2], ["$sbcl-to-list", "(* 2)"]],
        ['$expect', ["*", 2, 3], ["$sbcl-to-list", "(* 2 3)"]],
        ['$expect', ["*", 2, 3, 4], ["$sbcl-to-list", "(* 2 3 4)"]],
        ["$expect", ["*", 2, ["*", 3, 4]], ["$sbcl-to-list", "(* 2 (* 3 4))"]],
    ],
    "test-div": ['$series',
        ['print', '/'],
        // ["$expect", ["/"], [ "$sbcl-to-list",  "(/)" ]], // CLisp gives an error for '-','/' without parameters (however ok for '+' and '*')
        ["$expect", ["/", 2], ["$sbcl-to-list", "(/ 2)"]],
        ['$expect', ["/", 6, 3], ["$sbcl-to-list", "(/ 6 3)"]],
        ['$expect', ["/", 24, 3, 2], ["$sbcl-to-list", "(/ 24 3 2)"]],
        ["$expect", ["/", 1000, ["/", 10, 2]], ["$sbcl-to-list", "(/ 1000 (/ 10 2))"]],
    ],
    "test-eq": ['$series',
        ['print', '='],
        ['$expect', ["=", 1], ["$sbcl-to-list", "(= 1)"]],
        ["$expect", ["=", 1, 1], ["$sbcl-to-list", "(= 1 1)"]],
        ["$expect", ["=", 1, 1, 1], ["$sbcl-to-list", "(= 1 1 1)"]],
        ['$expect', ["=", 1, 2], ["$sbcl-to-list", "(= 1 2)"]],
        ['$expect', ["=", 1, 2, 3], ["$sbcl-to-list", "(= 1 2 3)"]],
        ['$expect', ["=", 1, 2, 2], ["$sbcl-to-list", "(= 1 2 2)"]],
        ['$expect', ["=", 1, 1, 2], ["$sbcl-to-list", "(= 1 1 2)"]],
        ['$expect', ["=", 2, 1, 1], ["$sbcl-to-list", "(= 2 1 1)"]],
        ['$expect', ["=", 1, 2, 1], ["$sbcl-to-list", "(= 1 2 1)"]],
    ],
    "test-neq": ['$series',
        ['print', '/='],
        ['$expect', ["/=", 1], ["$sbcl-to-list", "(/= 1)"]],
        ['$expect', ["/=", 1, 1], ["$sbcl-to-list", "(/= 1 1)"]],
        ['$expect', ["/=", 1, 1, 1], ["$sbcl-to-list", "(/= 1 1 1)"]],
        ['$expect', ["/=", 1, 2], ["$sbcl-to-list", "(/= 1 2)"]],
        ['$expect', ["/=", 1, 2, 3], ["$sbcl-to-list", "(/= 1 2 3)"]],
        ['$expect', ["/=", 1, 2, 2], ["$sbcl-to-list", "(/= 1 2 2)"]],
        ['$expect', ["/=", 1, 1, 2], ["$sbcl-to-list", "(/= 1 1 2)"]],
        ['$expect', ["/=", 2, 1, 1], ["$sbcl-to-list", "(/= 2 1 1)"]],
        ['$expect', ["/=", 1, 2, 1], ["$sbcl-to-list", "(/= 1 2 1)"]],
    ],
};
exports.activity = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        ...actions,
    }
};
exports.default = exports.activity;
//# sourceMappingURL=operators.js.map