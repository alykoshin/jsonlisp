import {Parameters} from "../../lib/runner";
import {Activity, ActivityActionsDefinition} from "../../lib/config";
import $sbcl from "../../actions/$sbcl";

const actions: ActivityActionsDefinition = {
  ...$sbcl,
  "default": ['$series', ['print', 'This will test operators'],
    // ['test-list'],
    // ['test-length'],
    // ['test-nth'],
    // ['test-cdr'],
    // ['test-rest'],
    ['test-first'],
  ],

  "test-list": ['$series',
    ['print', 'list'],

    ['$expect', [ "list" ], [ "list" ] ],
    ['$expect', [ "list", 1 ], [ "list", 1 ] ],
    ['$expect', [ "list", 1, 2, 3 ], [ "list", 1, 2, 3 ] ],
  ],

  "test-length": ['$series',
    ['print', 'length'],

    ['$expect', [ "length", [ "list" ] ], [ "$sbcl-to-list",  "(length (list))" ] ],
    ['$expect', [ "length", [ "list", 1 ] ], [ "$sbcl-to-list",  "(length (list 1))" ] ],
    ['$expect', [ "length", [ "list", 1, 2, 3 ] ], [ "$sbcl-to-list",  "(length (list 1 2 3))" ] ],
  ],

  "test-nth": ['$series',
    ['print', 'nth'],
    ['$expect', [ "nth", 1, [ "list", 11, 22, 33 ] ], [ "$sbcl-to-list",  "(nth 1 (list 11 22 33))" ] ],
  ],

  "test-cdr": ['$series',
    ['print', 'cdr'],
    ['$expect', [ "cdr", [ "list", 11, 22, 33 ] ], [ "$sbcl-to-list",  "(cdr (list 11 22 33))" ] ],
  ],

  "test-rest": ['$series',
    ['print', 'rest'],
    ['$expect', [ "rest", [ "list", 11, 22, 33 ] ], [ "list", 22, 33 ] ],
    // ['$expect', [ "rest", [ "list", 11, 22, 33 ] ], [ "cdr", [ "list", 11, 22, 33 ] ] ],
  ],

  "test-first": ['$series',
    ['print', 'first'],
    ['$expect', [ "first", [ "list", 11, 22, 33 ] ], 11 ],
    ['$expect', [ "first", [ "list", 11, 22, 33 ] ], [ "$sbcl-to-list",  "(first (list 11 22 33))" ] ],
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
