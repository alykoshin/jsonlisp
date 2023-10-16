/** @format */

import {Activity} from '../../apps/runner/lib/config';

// prettier-ignore
export const config: Activity = {
  base_dir: '.',
  version: '0.0.0',
  actions: {
    default: [
      'list',
      
      ['print', 
        ['setq', 'orig_path', 
          ['getcwd'] ] ],

      ['chdir', '/' ],
      ['print', 
        ['getcwd'] ],

      ['chdir', '${orig_path}' ],
      ['print', 
        ['getcwd'] ],
    ],
  },
};

export default config;
