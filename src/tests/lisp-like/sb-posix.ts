import { Activity } from '../../lib/config';

export const config: Activity = {
  base_dir: './demo',
  version: '2.5.22',
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
