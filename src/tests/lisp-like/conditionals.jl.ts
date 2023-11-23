/** @format */

import {Activity} from '../../apps/runner/startup/Activities';
import $sbcl from '../../actions/$sbcl';
import { NIL, T } from '../../actions/lisp-like/helpers/types';

// prettier-ignore
export const config: Activity = {
  base_dir: './',
  version: '0.0.0',
  actions: {
    ...$sbcl,
    default: [
      'list',
      // [ 'test-cond' ],
      [ 'test-if' ],
      // [ 'test-when' ],
      // [ 'test-unless' ],
      // [ 'test-zerop' ],
      ['princ', 'assert-x:\n'+'  OK:   ${ assert_ok_count }\n'+'  FAIL: ${ assert_fail_count }'],
    ],

    "test-cond": [ 'list', 
      ['assert-equal',
        [ "cond",  
          [ ['/=', 1, 1 ], [ "list", 10 ], 11 ], 
          [ [ '=', 1, 1 ], [ "list", 20 ], 21 ] ], 
        [ "$sbcl-to-list", [
          '(cond',
            '( (/= 1 1) 10 11 )',
            '( (=  1 1) (list 20) 21 )',
          ')'
        ].join(' ') ]
      ],
    ],

    "test-if": ["list",
      ['if', ['=', 1, 1], ['setq', 'res', 1], ['setq', 'res', 2]],
      ['assert-equal', '${res}', '1'],

      ['if', ['/=', 1, 1], ['setq', 'res', 1], ['setq', 'res', 2]],
      ['assert-equal', '${res}', '2'],

      ['assert-equal',
        ['if', ['=', 1, 1], ['quote', 1], ['quote', 2]],
        1
      ],
      
      ['assert-equal',
        ['if', ['/=', 1, 1], ['quote', 1], ['quote', 2]],
        2
      ],
      // one branch only
      ['setq', 'res', 1],
      ['assert-equal',
        ['if', ['=', 1, 1], ['setq', 'res', 2]],
        2
      ],
      ['assert-equal', '${res}', '2'],
      //
      ['setq', 'res', 1],
      ['assert-equal',
        ['if', ['/=', 1, 1], ['setq', 'res', 2]],
        NIL
      ],
      ['assert-equal',
        ['if', [], 1],
        ["$sbcl-to-list", 
          '(if NIL 1 )'
        ],
      ],
      ['assert-equal', '${res}', '1']
    ],
    
    "test-when": [ "list",
      ['when',
        ['=', 1, 1], ['setq', 'res', 1]],
      ['assert-equal', '${res}', '1']],
    
    "test-unless": ["list",
      ['setq', 'res', 0],
      ['unless',
        ['/=', 1, 1], ['setq', 'res', 1]],
      ['assert-equal', '${res}', '1']],
    
    "test-zerop": ['list',
      ['print', 'zerop'],
      ['assert-equal', ["zerop", 0], ["$sbcl-to-list", "(zerop 0)"]],
      ['assert-equal', ["zerop", 1], ["$sbcl-to-list", "(zerop 1)"]],
      // ['assert-equal', ["zerop", ["list"]], ["$sbcl-to-list", "(zerop (list))"]],
      // ['assert-equal', ["zerop", ""], ["$sbcl-to-list", "(zerop \"\")"]],
      // ['assert-equal', ["zerop", false], ["$sbcl-to-list", "(zerop NIL)"]],
    ],
  },
}

export default config;
