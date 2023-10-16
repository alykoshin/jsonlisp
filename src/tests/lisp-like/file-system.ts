/** @format */

import {Activity} from '../../apps/runner/lib/config';

// prettier-ignore
export const config: Activity = {
  base_dir: '.',
  version: '0.0.0',
  actions: {
    default: [
      'list',
      [ 'assert-true',  [ 'probe-file', 'package.json' ] ],
      [ 'assert-false', [ 'probe-file', 'package.json---------' ] ],
      [ 'directory', '.' ],
    ],
  },
}

export default config;
