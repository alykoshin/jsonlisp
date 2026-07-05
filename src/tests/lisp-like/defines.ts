/** @format */

import {Activity} from '../../apps/runner/startup/Activities';

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
      // bare name = variable lookup -> the value itself
      [ 'assert-equal', 'abc', 1 ],
      // ${...} = template interpolation -> always a STRING
      [ 'assert-equal', '${abc}', '1' ],
    ],
    'testTemplate': ['print', 'This output is based on template and scope: { test: "${test}" }'],
  },
}

export default config;
