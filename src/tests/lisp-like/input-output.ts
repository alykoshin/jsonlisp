import {Activity} from "../../lib/config";

export const config: Activity = {
  base_dir: './',
  version: '0.0.0',
  actions: {
    default: [ '$series',
      [ 'test_prin1' ],
      [ 'test_princ' ],
      [ 'test_print' ],
    ],
    "test_prin1": [ '$series',
      [ 'prin1', 'abc' ],
      [ '$expect', [ 'prin1', 123 ], 123 ],
      [ '$expect', [ 'prin1', true ], true ],
      [ '$expect', [ 'prin1', false ], false ],
      [ '$expect', [ 'prin1', 'abc' ], 'abc' ],
      [ '$expect', [ 'prin1', 'a"b"c' ], 'a"b"c' ],
      [ '$expect', [ 'prin1', [ 'list', 'abc'] ], ['list', 'abc'] ],
    ],
    "test_princ": [ '$series',
      [ 'princ', 'abc' ],
      [ '$expect', [ 'princ', 123 ], 123 ],
      [ '$expect', [ 'princ', true ], true ],
      [ '$expect', [ 'princ', false ], false ],
      [ '$expect', [ 'princ', 'abc' ], 'abc' ],
      [ '$expect', [ 'princ', 'a"b"c' ], 'a"b"c' ],
      [ '$expect', [ 'princ', [ 'list', 'abc'] ], ['list', 'abc'] ],
    ],
    "test_print": [ '$series',
      [ 'print', 'abc' ],
      [ '$expect', [ 'print', true ], true ],
      [ '$expect', [ 'print', false ], false ],
      [ '$expect', [ 'print', 123 ], 123 ],
      [ '$expect', [ 'print', 'abc' ], 'abc' ],
      [ '$expect', [ 'print', 'a"b"c' ], 'a"b"c' ],
      [ '$expect', [ 'print', [ 'list', 'abc'] ], ['list', 'abc'] ],
      [ 'print', { "property": "value" } ],
    ]
  },
}

export default config;
