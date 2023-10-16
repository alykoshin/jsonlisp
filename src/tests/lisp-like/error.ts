/** @format */

import {Activity} from '../../apps/runner/lib/config';

// prettier-ignore
export const config: Activity = {
  base_dir: '.',
  version: '0.0.0',
  actions: {
    default: [ 'print', 'Any of the tests here will immediately exit the process, so they are not default' ],
    errorUserMsg: [ 'error', 'This is the error message' ],
    errorDefaultMsg: [ 'error', 'This is the error message' ],
  },
}

export default config;
