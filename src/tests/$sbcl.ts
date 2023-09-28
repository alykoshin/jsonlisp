import {Activity} from "../lib/config";
import $sbcl from "../actions/$sbcl/";

export const config: Activity = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    ...$sbcl,
    default: [ 'list',
      ['print', 'Testing sbcl'],
      
      // ['assert-equal', 1, [ "$sbcl-to-list", '1']],
      // ['assert-equal', -1000, [ "$sbcl-to-list", '-1000']],
      // 
      // Parse strings
      // ['assert-equal', true, [ "$parse-sbcl-list", 'T']],
      // ['assert-equal', false, [ "$parse-sbcl-list", 'NIL']],

      // Run SBCL and parse its actual output
      // ['assert-equal', true, [ "$sbcl-to-list", 'T']],
      // ['assert-equal', false, [ "$sbcl-to-list", 'NIL']],

      // Parse strings
      ['assert-equal', [ 'list', 1, 22, 333 ], [ "$parse-sbcl-list", '(1 22 333)']],
      ['assert-equal', 
        [ 'list', 
          "\"test\"", 1, 22, 333 ], 
        [ "$parse-sbcl-list", 
          '("test"    1  22  333)']],

      // Run SBCL and parse its actual output
      // ['assert-equal', true, [ "$sbcl-to-list", 'T']],
      // ['assert-equal', false, [ "$sbcl-to-list", 'NIL']],
      // ['assert-equal', 1, [ "$sbcl-to-list", '1']],
      // ['assert-equal', [ 'list' ], [ "$sbcl-to-list", '( list )']],
      // ['assert-equal', [ 'list', 1, 22, 333 ], [ "$sbcl-to-list", '(list 1 22 333)']],
      // ['assert-equal', [ 'list', 1, 22, ['list', 333] ], [ "$sbcl-to-list", '(list 1 22 (list 333))']],
    ]
  },
}

export default config;
