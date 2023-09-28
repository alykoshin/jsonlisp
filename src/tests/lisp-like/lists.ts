import {Parameters} from "../../lib/runner";
import {Activity, ActivityActionsDefinition} from "../../lib/config";
import $sbcl from "../../actions/$sbcl";

const actions: ActivityActionsDefinition = {
  ...$sbcl,
  "default": ['list', ['print', 'This will test operators'],
    // ['test-list'],
    // ['test-length'],
    // ['test-nth'],
    // ['test-cdr'],
    // ['test-rest'],
    ['test-first'],
  ],

  "test-list": ['list',
    ['print', 'list'],

    ['assert-equal', [ "list" ], [ "list" ] ],
    ['assert-equal', [ "list", 1 ], [ "list", 1 ] ],
    ['assert-equal', [ "list", 1, 2, 3 ], [ "list", 1, 2, 3 ] ],
  ],

  "test-length": ['list',
    ['print', 'length'],

    ['assert-equal', [ "length", [ "list" ] ],          [ "$sbcl-to-list",  "(length (list))" ] ],
    ['assert-equal', [ "length", [ "list", 1 ] ],       [ "$sbcl-to-list",  "(length (list 1))" ] ],
    ['assert-equal', [ "length", [ "list", 1, 2, 3 ] ], [ "$sbcl-to-list",  "(length (list 1 2 3))" ] ],
  ],

  "test-nth": ['list',
    ['print', 'nth'],
    ['assert-equal', [ "nth", 1, [ "list", 11, 22, 33 ] ], [ "$sbcl-to-list",  "(nth 1 (list 11 22 33))" ] ],
  ],

  "test-cdr": ['list',
    ['print', 'cdr'],
    ['assert-equal', [ "cdr", [ "list", 11, 22, 33 ] ], [ "$sbcl-to-list",  "(cdr (list 11 22 33))" ] ],
  ],

  "test-rest": ['list',
    ['print', 'rest'],
    ['assert-equal', [ "rest", [ "list", 11, 22, 33 ] ], [ "list", 22, 33 ] ],
    // ['assert-equal', [ "rest", [ "list", 11, 22, 33 ] ], [ "cdr", [ "list", 11, 22, 33 ] ] ],
  ],

  "test-first": ['list',
    ['print', 'first'],
    ['assert-equal', [ "first", [ "list", 11, 22, 33 ] ], 11 ],
    ['assert-equal', [ "first", [ "list", 11, 22, 33 ] ], [ "$sbcl-to-list",  "(first (list 11 22 33))" ] ],
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
