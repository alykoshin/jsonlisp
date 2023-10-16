/** @format */

import {Activity} from '../../apps/runner/lib/config';

// prettier-ignore
export const config: Activity = {
  base_dir: '.',
  version: '0.0.0',
  actions: {
    default: [ 'list',
      [ 'test_setq' ],

    ],
    "test_setq": [ 'list',
      [ 'setq', 'abc', 1 ],
      [ 'assert-equal', '${abc}', 1 ],
    ],
    'testTemplate': ['print', 'This output is based on template and scope: { test: "${test}" }'],
  },
}

export default config;
