import {Activity} from "../lib/config";
import {Actions} from "../lib/runner";

const actions: Actions = {
  default: [
    // 'testTemplate',
    // 'printNpmVersion'
    'test$expect'
  ],
  testTemplate: ['print', 'This output is based on template and scope: { test: "${test}" }'],
  test$expect: [
    '$series',
    ['$expect', 1, 1],
    ['$expect', 22, 33],
  ],
  printVersion:
    ['when',
      ['$confirm', 'Continue Y/[N]?'],
      ['time',
        ['shell-command',
          'node --version',
          'npm  --version',
          'yarn --version']]],
  test: ['$series',
    ['print', 'series-1'],
    ['$parallel',
      ['$series',
        ['print', 'series-2-parallel-1-series-1'],
        ['sleep', ['+', 0.1, 0.2, 0.7]],
        ['print', 'series-2-parallel-1-series-2']],
      ['$series',
        ['echo', 'series-2-parallel-2-series-1'],
        ['sleep', ['*', 1, 1, 1]],
        ['echo', 'series-2-parallel-2-series-2']],
    ],
    ['shell-command', 'cmd /c echo "exec \"cmd /c echo\""'],
    ['when',
      true, [
      'print', '"when" evaluated to true']],
    ['print',
      ['+',
        1, 2, 3]],
    ['print',
      ['-',
        100, 10, 1]],
    ['print',
      'series-4'],
    ['time',
      ['print', 'echo time']]],
  _execute: ['$series',
    ['print', 'series-1'],
    ['$parallel',
      ['$series',
        ['print', 'series-2-parallel-1-series-1'],
        ['sleep', 500],
        ['print', 'series-2-parallel-1-series-2'],],
      ['$series',
        ['print', 'series-2-parallel-2-series-1'],
        ['sleep', 500],
        ['print', 'series-2-parallel-2-series-2'],],],
    ['print', 'series-3'],
    ['print', 'series-4'],],
  queryClean: ['$series',
    ["print", "Ensuring Git directory is clean..."],
    ["shell-command", "git status --untracked-files=no --porcelain"]],
}

export const activity: Activity = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    default: ['test$expect'],
    ...actions,
  }
}

export default activity;
