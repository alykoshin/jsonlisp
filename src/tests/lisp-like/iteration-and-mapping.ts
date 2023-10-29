/** @format */

import {Activity} from '../../apps/runner/startup/Activities';
import {Actions} from '../../apps/runner/lib/types';
import $sbcl from '../../actions/$sbcl';

// prettier-ignore
const actions: Actions = {
  ...$sbcl,
  "default": [
    'list',
    ['print', 'This will test Iteration and mapping'],
    // ['test-prog1'],
    // ['test-prog2'],
    // ['test-progn'],
    ['test-mapc'],    
    // ['test-mapcar'],
    // ['princ', 'assert-x:\n' + '  OK:   ${ assert_ok_count }\n' + '  FAIL: ${ assert_fail_count }'],
  ],

  "test-prog1": [
    'list',
    ['print', 'prog1'],
    ['assert-equal', [ "prog1", 1, 2, 3], [ "$sbcl-to-list",  "(prog1 1 2 3)" ] ],
  ],

  "test-prog2": ['list',
    ['print', 'prog2'],
    ['assert-equal', [ "prog1", 1, 2, 3], [ "$sbcl-to-list",  "(prog1 1 2 3)" ] ],
  ],

  "test-progn": ['list',
    ['print', 'progn'],
    ['assert-equal', [ "prog1", 1, 2, 3], [ "$sbcl-to-list",  "(prog1 1 2 3)" ] ],
 ],
  
  "test-mapc": ['list',
    ['print', 'mapc'],
    // ! Actually we do not check if all the parama=eters were evaluated, 
    // ! as the result is always the first list
    ['assert-equal', ["mapc", ['quote', '1+'], [100, 10, 1]], ["$sbcl-to-list", "(mapc '1+ (list 100 10 1) )"]],
    // !
    // ['assert-equal', [ "mapc", ['quote', '1-'], [100, 10, 1]], [ "$sbcl-to-list",  "(mapc '1- (list 100 10 1) )" ] ],
    // ['assert-equal', [ "mapc", ['quote', '+' ], [1, 2, 3], [1, 2, 3]], [ "$sbcl-to-list",  "(mapc '+ (list 1 2 3) (list 1 2 3) )" ] ],
    // ['assert-equal', [ "mapc", ['quote', '+' ], [1, 2], [1, 2, 3]], [ "$sbcl-to-list",  "(mapc '+ (list 1 2) (list 1 2 3) )" ] ],
 ],
  
  "test-mapcar": ['list',
    ['print', 'mapcar'],
    ['assert-equal', [ "mapcar", ['quote', '+' ], [1, 2, 3], [1, 2, 3]], [ "$sbcl-to-list",  "(mapcar '+ (list 1 2 3) (list 1 2 3) )" ] ],
    ['assert-equal', [ "mapcar", ['quote', '1+'], [100, 10, 1]], [ "$sbcl-to-list",  "(mapcar '1+ (list 100 10 1) )" ] ],
    ['assert-equal', [ "mapcar", ['quote', '1-'], [100, 10, 1]], ["$sbcl-to-list", "(mapcar '1- (list 100 10 1) )"]],
    ['assert-equal', [ "mapcar", ['quote', '+' ], [1,2,3,4,5], [3,4,5]], [ "$sbcl-to-list",  "(mapcar '+ '(1 2 3 4 5) '(3 4 5))" ] ],
 ],
  
}

export const activity: Activity = {
  base_dir: '.',
  version: '0.0.0',
  actions: {
    ...actions,
  },
};

export default activity;
