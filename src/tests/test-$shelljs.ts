import {Activity} from "../lib/config";

export const config: Activity = {
  base_dir: './demo',
  version: '2.5.22',
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
