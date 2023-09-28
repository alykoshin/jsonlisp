import {Activity} from "../../lib/config";

export const config: Activity = {
  base_dir: './demo',
  version: '2.5.22',
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
