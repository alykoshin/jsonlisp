import {Activity} from "../../lib/config";

export const config: Activity = {
  base_dir: './',
  version: '0.0.0',
  actions: {
    default: [ 'list',
      [ 'test_prin1' ],
      [ 'test_princ' ],
      [ 'test_print' ],
    ],
    "test_prin1": [ 'list',
      [ 'prin1', 'abc' ],
      [ 'assert-equal', [ 'prin1', 123 ], 123 ],
      [ 'assert-equal', [ 'prin1', true ], true ],
      [ 'assert-equal', [ 'prin1', false ], false ],
      [ 'assert-equal', [ 'prin1', 'abc' ], 'abc' ],
      [ 'assert-equal', [ 'prin1', 'a"b"c' ], 'a"b"c' ],
      [ 'assert-equal', [ 'prin1', [ 'list', 'abc'] ], ['list', 'abc'] ],
    ],
    "test_princ": [ 'list',
      [ 'princ', 'abc' ],
      [ 'assert-equal', [ 'princ', 123 ], 123 ],
      [ 'assert-equal', [ 'princ', true ], true ],
      [ 'assert-equal', [ 'princ', false ], false ],
      [ 'assert-equal', [ 'princ', 'abc' ], 'abc' ],
      [ 'assert-equal', [ 'princ', 'a"b"c' ], 'a"b"c' ],
      [ 'assert-equal', [ 'princ', [ 'list', 'abc'] ], ['list', 'abc'] ],
    ],
    "test_print": [ 'list',
      [ 'print', 'str1' ],
      [ 'print', 'str2', 'str3', 'str4' ],
      [ 'assert-equal', [ 'print', true ], true ],
      [ 'assert-equal', [ 'print', false ], false ],
      [ 'assert-equal', [ 'print', 123 ], 123 ],
      [ 'assert-equal', [ 'print', 'abc' ], 'abc' ],
      [ 'assert-equal', [ 'print', 'a"b"c' ], 'a"b"c' ],
      [ 'assert-equal', [ 'print', [ 'list', 'abc'] ], ['list', 'abc'] ],
      [ 'print', { "property": "value" } ],
    ],

    'test-yn': [
      'if', ['y-or-n-p', 'Continue Y/[N]? '],
      ['print', 'Y was pressed'],
      ['print', 'N was pressed'],
    ]
  },

}

export default config;
