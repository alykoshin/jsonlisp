/** @format */

import {coerce, ReleaseType} from 'semver';

import {fn_check_params} from '../../apps/runner/lib/util';
import {Actions, Expression} from '../../apps/runner/lib/types';

/**
 * @module $build
 */

export const actions: Actions = {
  /**
   * @name $version
   */
  $version: async function $version(a, params, {evaluate, logger}) {
    fn_check_params(params, {exactCount: [0, 1]});

    if (params.length > 0) {
      const release = params[0] as ReleaseType;

      const cmd = `yarn version ${release}`;
      const execDefinition: Expression = [
        'shell-command',
        cmd,
        {
          // ...(pConfig as BuildActionConfig),
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
  },
};

export default actions;
