import { coerce, ReleaseType } from 'semver';

import { getConfigFilename, write_config } from '../../lib/config';
import { fn_check_params } from '../../lib/util';
import {
  ActionListDefinition,
  ActionMethodState,
  Actions,
  Parameters,
} from '../../lib/runner';

//

export const actions: Actions = {
  $version: async function $version(
    a,
    params,
    { evaluate, activity, logger }
  ) {
    fn_check_params(params, { exactCount: [0, 1] });

    if (params.length > 0) {
      const release = params[0] as ReleaseType;

      // // const mainConfig = await read_config(config_file);
      // const orig_version = activity.version
      // const v = coerce(orig_version);
      // if (!v) throw new Error(`Invalid version: "${orig_version}" (not in semver format)`);
      // v.inc(release);
      // // console.warn(`Invalid version: ${orig_version}`);
      // activity.version = v.version;

      // const config_file = getConfigFilename();
      // await write_config(config_file, activity)
      // logger.log(`version ${orig_version} -> ${activity.version}`);
      const cmd = `yarn version --${release}`;
      const execDefinition: ActionListDefinition = [
        'shell-command',
        cmd,
        {
          // ...(pConfig as BuildActionConfig),
        },
      ];

      await evaluate(execDefinition);
    }
    const cmd = `node -p -e "require('./package.json').version"`;
    const execDefinition: ActionListDefinition = [
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
