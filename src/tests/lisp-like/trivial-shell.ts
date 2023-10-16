/** @format */

import {Activity} from '../../apps/runner/lib/config';

// prettier-ignore
export const config: Activity = {
  base_dir: '.',
  version: '0.0.0',
  actions: {
    default: [
      'list',
      ['shell-command', 'cmd /c echo "exec "cmd /c echo""'],
      ['shell-command', 'git status --untracked-files=no --porcelain'],
      ['shell-command', 'node --version', 'npm  --version', 'yarn --version'],
    ],
  },
};

export default config;
