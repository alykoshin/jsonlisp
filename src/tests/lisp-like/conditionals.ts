import {Activity} from "../../lib/config";
import $sbcl from "../../actions/$sbcl/";

export const config: Activity = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    ...$sbcl,
    default: [ '$series',
      [ 'test_cond' ],
    ],
    "test_cond": [ '$series',
      ['$expect',
        [ "cond", 
          [ true, [ "list", 10 ], 11 ], 
          [ true, [ "list", 20 ] ] ], 
        [ "$sbcl-to-list", [
          '(cond',
            '(T 10 11 )',
            '(T 20 )',
          ')'
        ].join(' ') 
        ] 
      ],
    ]
  },
}

export default config;
