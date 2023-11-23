/** @format */

import {coerce, ReleaseType} from 'semver';

import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {Actions, ExecutorFn, Expression} from '../lisp-like/helpers/types';
import {createExecutorFn} from '../lisp-like/core/functions';

/**
 * @module $build
 */

// $version: [ 'shell-command', 'npm version patch' ],
//             'yarn version --new-version patch', {}],

// prettier-ignore
export const $version_ = createExecutorFn(
  '$version_',
  ['$$release'],
  ['list',
    ['when', '$$release',
      ['shell-command', 'npm version ${$$release}']],
    ['shell-command', 'node -p -e "require(\'./package.json\').version"'],
  ]
);

/**
 * @name $version
 */
export const $version: ExecutorFn = async function $version(
  a,
  params,
  {evaluate, logger}
) {
  validateArgs(params, {exactCount: [0, 1]});

  if (params.length > 0) {
    const release = params[0] as ReleaseType;

    const NPM_CMD = `npm version ${release}`;
    // /. const YARN_CMD = `yarn version ${release}`;
    // const YARN_CMD = `yarn version --new-version ${release}`; // yarn version --new-version patch
    const execDefinition: Expression = [
      'shell-command',
      NPM_CMD,
      {
        /* ...(pConfig as BuildActionConfig), */
      },
    ];

    try {
      await evaluate(execDefinition);
    } catch (e) {
      logger.error(
        [
          `Please check if you have installed following prerequisites:`,
          `- yarn (npm i -g yarn);`,
          `- yarn version plugin (yarn plugin import version).`,
        ].join('\n')
      );
      throw e;
    }
  }
  const cmd = `node -p -e "require('./package.json').version"`;
  const execDefinition: Expression = [
    'shell-command',
    cmd,
    {
      // ...(pConfig as BuildActionConfig),
    },
  ];

  return await evaluate(execDefinition);
};

export const actions: Actions = {
  $version,
  $version_,
};

export default actions;
