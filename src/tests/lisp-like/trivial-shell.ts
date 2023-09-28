import { Activity } from '../../lib/config';

export const config: Activity = {
  base_dir: './demo',
  version: '2.5.22',
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
