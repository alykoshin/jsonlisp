import {Activity} from "../../lib/config";

export const config: Activity = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    default: [
      'list',
      [ 'print', 'This will test operators' ],
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
