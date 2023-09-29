/** @format */

import {coerce, ReleaseType} from 'semver'

import {fn_check_params} from '../../lib/util'
import {ActionListDefinition, Actions} from '../../lib/runner'

//

export const actions: Actions = {
  $version: async function $version(a, params, {evaluate, logger}) {
    fn_check_params(params, {exactCount: [0, 1]})

    if (params.length > 0) {
      const release = params[0] as ReleaseType

      const cmd = `yarn version --${release}`
      const execDefinition: ActionListDefinition = [
        'shell-command',
        cmd,
        {
          // ...(pConfig as BuildActionConfig),
        },
      ]

      await evaluate(execDefinition)
    }
    const cmd = `node -p -e "require('./package.json').version"`
    const execDefinition: ActionListDefinition = [
      'shell-command',
      cmd,
      {
        // ...(pConfig as BuildActionConfig),
      },
    ]

    return await evaluate(execDefinition)
  },
}

export default actions
