import {Activity} from "../lib/config";

export const config: Activity = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    default: [
      '$series',
      [ '$shelljs', 'echo', '\nthis is the output from shelljs echo method' ],
      [ '$shelljs', 'cd', 'dist' ],
      [ '$expect',
        [ '$shelljs', 'pwd' ], [ '$cwd' ] ],
      [ '$shelljs', 'cd', '..' ],
      [ '$expect',
        [ '$shelljs', 'pwd' ], [ '$cwd' ] ],
    ],
  },
}

export default config;
