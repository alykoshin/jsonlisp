import {FullConfig} from "./src/lib/config";

export const config: FullConfig = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    default: [
      'series',
      [ 'echo', 'This will test operators' ],
      [ '$expect', true ],
      [ '$expect', false ],
      [ '$expect', 1, 1 ],
      [ '$expect', 1, 2 ],
      [ '$expect', 'aaa', 'aaa' ],
      [ '$expect', 'aaa', 'bbb' ],
    ],
  },
}

export default config;
