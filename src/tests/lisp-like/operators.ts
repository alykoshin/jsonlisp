import {Parameters} from "../../lib/runner";
import {Activity, ActivityActionsDefinition} from "../../lib/config";
import $sbcl from "../../actions/$sbcl/";

const actions: ActivityActionsDefinition = {
  ...$sbcl,
  default: ['list', ['print', 'This will test operators'],
    // ['test-plus'],
    // ['test-minus'],
    // ['test-mult'],
    // ['test-div'],
    // ['test-eq'],
    ['test-neq'],
    ['princ', 'assert-x:\n'+'  OK:   ${ assert_ok_count }\n'+'  FAIL: ${ assert_fail_count }'],
  ],
  "test-plus": ['list',
    ['print', '+'],

    ["assert-equal", ["+", 0], [ "$sbcl-to-list",  "(+ 0)" ] ],
    ["assert-equal", ["+", 4], [ "$sbcl-to-list",  "(+ 4)" ] ],
    ["assert-equal", ["+", -4], [ "$sbcl-to-list",  "(+ -4)" ] ],
    ["assert-equal", ["+", 1, 2], [ "$sbcl-to-list",  "(+ 1 2)" ] ],
    ["assert-equal", ["+", 1, 2, 3], [ "$sbcl-to-list",  "(+ 1 2 3)" ] ],
    ["assert-equal", ["+", ["+", 101, 102], 1, 2], [ "$sbcl-to-list",  "(+ (+ 101 102) 1 2)" ] ],
    ["assert-equal", ["+", 1, ["+", 101, 102], 2], [ "$sbcl-to-list",  "(+ 1 (+ 101 102) 2)" ] ],
    ["assert-equal", ["+", 1, 2, ["+", 101, 102]], [ "$sbcl-to-list",  "(+ 1 2 (+ 101 102))" ] ],
  ],
  "test-minus": ['list',
    ['print', '-'],

    // ["assert-equal", ["-"], 0], // CLisp gives an error for '-','/' without parameters (however ok for '+' and '*')
    ["assert-equal", ["-", 0], [ "$sbcl-to-list",  "(- 0)" ] ],
    ["assert-equal", ["-", 1], [ "$sbcl-to-list",  "(- 1)" ] ],
    ['assert-equal', ["-", 2, 3], [ "$sbcl-to-list",  "(- 2 3)" ] ],
    ['assert-equal', ["-", 3, 2], [ "$sbcl-to-list",  "(- 3 2)" ] ],
    ['assert-equal', ["-", 2, 3, 4], [ "$sbcl-to-list",  "(- 2 3 4)" ] ],
    ["assert-equal", ["-", 4, ["-", 2, 1]], [ "$sbcl-to-list",  "(- 4 (- 2 1))" ] ],
  ],
  "test-mult": ['list',
    ['print', '*'],

    ["assert-equal", ["*"], [ "$sbcl-to-list",  "(*)" ]],
    ["assert-equal", ["*", 2], [ "$sbcl-to-list",  "(* 2)" ]],
    ['assert-equal', ["*", 2, 3], [ "$sbcl-to-list",  "(* 2 3)" ]],
    ['assert-equal', ["*", 2, 3, 4], [ "$sbcl-to-list",  "(* 2 3 4)" ]],
    ["assert-equal", ["*", 2, ["*", 3, 4]], [ "$sbcl-to-list",  "(* 2 (* 3 4))" ]],
  ],
  "test-div": ['list',
    ['print', '/'],

    // ["assert-equal", ["/"], [ "$sbcl-to-list",  "(/)" ]], // CLisp gives an error for '-','/' without parameters (however ok for '+' and '*')
    ["assert-equal", ["/", 2], [ "$sbcl-to-list",  "(/ 2)" ]],
    ['assert-equal', ["/", 6, 3], [ "$sbcl-to-list",  "(/ 6 3)" ]],
    ['assert-equal', ["/", 24, 3, 2], [ "$sbcl-to-list",  "(/ 24 3 2)" ]],
    ["assert-equal", ["/", 1000, ["/", 10, 2]], [ "$sbcl-to-list",  "(/ 1000 (/ 10 2))" ]],
  ],
  "test-eq": ['list',
    ['print', '='],

    ['assert-equal', ["=", 1], [ "$sbcl-to-list",  "(= 1)" ]],

    ["assert-equal", ["=", 1, 1],    [ "$sbcl-to-list",  "(= 1 1)" ]],
    ["assert-equal", ["=", 1, 1, 1], [ "$sbcl-to-list",  "(= 1 1 1)" ]],

    ['assert-equal', ["=", 1, 2],    [ "$sbcl-to-list",  "(= 1 2)" ]],
    ['assert-equal', ["=", 1, 2, 3], [ "$sbcl-to-list",  "(= 1 2 3)" ]],
    ['assert-equal', ["=", 1, 2, 2], [ "$sbcl-to-list",  "(= 1 2 2)" ]],
    ['assert-equal', ["=", 1, 1, 2], [ "$sbcl-to-list",  "(= 1 1 2)" ]],
    ['assert-equal', ["=", 2, 1, 1], [ "$sbcl-to-list",  "(= 2 1 1)" ]],
    ['assert-equal', ["=", 1, 2, 1], [ "$sbcl-to-list",  "(= 1 2 1)" ]],
  ],
  "test-neq": ['list',
    ['print', '/='],

    ['assert-equal', ["/=", 1], [ "$sbcl-to-list",  "(/= 1)" ]],

    ['assert-equal', ["/=", 1, 1],    [ "$sbcl-to-list",  "(/= 1 1)" ]],
    ['assert-equal', ["/=", 1, 1, 1], [ "$sbcl-to-list",  "(/= 1 1 1)" ]],

    ['assert-equal', ["/=", 1, 2],    [ "$sbcl-to-list",  "(/= 1 2)" ]],
    ['assert-equal', ["/=", 1, 2, 3], [ "$sbcl-to-list",  "(/= 1 2 3)" ]],
    ['assert-equal', ["/=", 1, 2, 2], [ "$sbcl-to-list",  "(/= 1 2 2)" ]],
    ['assert-equal', ["/=", 1, 1, 2], [ "$sbcl-to-list",  "(/= 1 1 2)" ]],
    ['assert-equal', ["/=", 2, 1, 1], [ "$sbcl-to-list",  "(/= 2 1 1)" ]],
    ['assert-equal', ["/=", 1, 2, 1], [ "$sbcl-to-list",  "(/= 1 2 1)" ]],
  ],
}

export const activity: Activity = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    ...actions,
  }
}

export default activity;
