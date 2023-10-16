/** @format */

import {Activity} from '../apps/runner/lib/config';

// prettier-ignore
export const config: Activity = {
  base_dir: '.',
  version: '0.0.0',
  actions: {
    default: [
      'list', [
        '$zip', {
          file_names: [ '.\\src\\tests\\data\\in\\', ],
          archive_prefix: 'dist',
          out_dir: '.\\src\\tests\\data\\out\\',
          exclude_files: [
            'test1.txt',
          ],
        }
      ],
    ],
  },
}

export default config;
