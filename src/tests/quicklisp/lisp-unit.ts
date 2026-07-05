/** @format */

import {Activity} from '../../toplevel/Activities';

// prettier-ignore
export const config: Activity = {
  base_dir: '.',
  version: '0.0.0',
  actions: {
    // NB: this is a DEMO of the lisp-unit assertions — half of these
    // asserts fail BY DESIGN to show failure reporting. Do not include in
    // green-gate test runs (scripts/run-jl-tests.js).
    default: [
      'list',
      [ 'print', 'This will test lisp-unit assertions (4 fail by design)' ],
      [ 'assert-true', true ],
      [ 'assert-true', false ],
      [ 'assert-false', true ],
      [ 'assert-false', false ],
      [ 'assert-equal', 1, 1 ],
      [ 'assert-equal', 1, 2 ],
      [ 'assert-equal', 'aaa', 'aaa' ],
      [ 'assert-equal', 'aaa', 'bbb' ],
    ],
  },
}

export default config;
