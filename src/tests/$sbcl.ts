import {Activity} from "../lib/config";
import $sbcl from "../actions/$sbcl/";

export const config: Activity = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    ...$sbcl,
    default: [ '$series',
      ['$echo', 'Testing sbcl'],
      
      // ['$expect', 1, [ "$sbcl-to-list", '1']],
      // ['$expect', -1000, [ "$sbcl-to-list", '-1000']],
      // 
      // Parse strings
      // ['$expect', true, [ "$parse-sbcl-list", 'T']],
      // ['$expect', false, [ "$parse-sbcl-list", 'NIL']],

      // Run SBCL and parse its actual output
      // ['$expect', true, [ "$sbcl-to-list", 'T']],
      // ['$expect', false, [ "$sbcl-to-list", 'NIL']],

      // Parse strings
      ['$expect', [ 'list', 1, 22, 333 ], [ "$parse-sbcl-list", '(1 22 333)']],
      ['$expect', 
        [ 'list', 
          "\"test\"", 1, 22, 333 ], 
        [ "$parse-sbcl-list", 
          '("test"    1  22  333)']],

      // Run SBCL and parse its actual output
      // ['$expect', true, [ "$sbcl-to-list", 'T']],
      // ['$expect', false, [ "$sbcl-to-list", 'NIL']],
      // ['$expect', 1, [ "$sbcl-to-list", '1']],
      // ['$expect', [ 'list' ], [ "$sbcl-to-list", '( list )']],
      // ['$expect', [ 'list', 1, 22, 333 ], [ "$sbcl-to-list", '(list 1 22 333)']],
      // ['$expect', [ 'list', 1, 22, ['list', 333] ], [ "$sbcl-to-list", '(list 1 22 (list 333))']],
    ]
  },
}

export default config;
