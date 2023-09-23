import {Activity} from "../../lib/config";

export const config: Activity = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    default: [ '$echo', 'Any of the tests here will immediately exit the process, so they are not default' ],
    errorUserMsg: [ 'error', 'This is the error message' ],
    errorDefaultMsg: [ 'error', 'This is the error message' ],
  },
}

export default config;
