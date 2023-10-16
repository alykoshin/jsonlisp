/** @format */

import {Activity} from '../apps/runner/lib/config';

// prettier-ignore
export const config: Activity = {
  base_dir: '.',
  version: '0.0.0',
  actions: {
    default: [
      'list',
      [ '$shelljs', 'echo', '\nThis is the output from shelljs echo method' ],
      [ '$shelljs', 'cd', 'dist' ],
      [ 'assert-equal', [ '$shelljs', 'pwd' ], [ 'getcwd' ] ],
      [ '$shelljs', 'cd', '..' ],
      [ 'assert-equal', [ '$shelljs', 'pwd' ], [ 'getcwd' ] ],
    ],
  },
}

export default config;
