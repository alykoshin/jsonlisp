/** @format */

import {Activity} from '../apps/runner/lib/config';

// prettier-ignore
export const config: Activity = {
  base_dir: '.',
  version: '2.5.23',
  actions: {
    default: [ 'list',
      [ 'plist',
        [ '$build', {cwd: './demo',env: {CONFIG_ENV: 'top100'}}],
        [ '$build', {cwd: './demo',env: {CONFIG_ENV: 'stats-top100'}}]
      ],
      [ '$version', 'patch' ],
      [ '$zip',
        {
          file_names: ['./dist/'],
          archive_prefix: 'dist',
          out_dir: '../_archive',
          exclude_files: [
            'index.html',
            'index.js',
            'minimal.html',
            'fp.ico',
            'fp.png',
            'ldr.js.LICENSE.txt',
          ],
        },
      ],
    ],
  }
}

export default config;
