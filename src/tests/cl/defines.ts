/** @format */

import {Activity} from '../../toplevel/Activities';

// prettier-ignore
export const config: Activity = {
  base_dir: '.',
  version: '0.0.0',
  actions: {
    default: [ 'list',
      [ 'test_setq' ],
      [ 'test_set' ],
    ],
    "test_setq": [ 'list',
      [ 'setq', 'abc', 1 ],
      // bare name = variable lookup -> the value itself
      [ 'assert-equal', 'abc', 1 ],
      // ${...} = template interpolation -> always a STRING
      [ 'assert-equal', '${abc}', '1' ],
      // setq does NOT evaluate the name: rebinding works
      [ 'setq', 'abc', 2 ],
      [ 'assert-equal', 'abc', 2 ],
    ],
    "test_set": [ 'list',
      // set EVALUATES the name -> computed variable names
      [ 'setq', 'nm', 'dyn' ],
      [ 'set', 'nm', 42 ],           // assigns to the variable named "dyn"
      [ 'assert-equal', 'dyn', 42 ],
      // NB: expected side must be quoted — bare 'dyn' would evaluate to 42
      [ 'assert-equal', 'nm', ['quote', 'dyn'] ], // nm itself untouched
      // with a quoted (literal) name set behaves like setq
      [ 'set', [ 'quote', 'xyz' ], 7 ],
      [ 'assert-equal', 'xyz', 7 ],
    ],
    'testTemplate': ['print', 'This output is based on template and scope: { test: "${test}" }'],
  },
}

export default config;
