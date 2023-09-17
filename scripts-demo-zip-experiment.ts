
import {FullConfig} from "./src/lib/config";

export const config: FullConfig = {
  base_dir: './demo',
  version: '2.5.23',
  actions: {
    default: [ 'series',
      [ 'parallel',
        [ 'build', {
            cwd: './demo',
            env: {
              CONFIG_ENV: 'top100',
            },
          }
        ],
        [ 'build',  {
            cwd: './demo',
            env: {
              CONFIG_ENV: 'stats-top100',
            }
          },
        ]
      ],
      [ 'version', 'patch' ],
      [ 'zip',
        {
          file_names: [
            './dist/',
          ],
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
