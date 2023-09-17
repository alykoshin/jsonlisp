import {coerce, ReleaseType} from "semver";

import { getConfigFilename, write_config} from '../../lib/config'
import {fn_check_params} from "../../lib/util";
import {
  ActionMethodState,
  Parameters,
} from "../../lib/runner";

//


// export type VersionAction = [
//   action: 'version',
//   release: ReleaseType,
// ]


export async function versionBump(
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner, logger}: ActionMethodState
) {
  fn_check_params(parameters, {exactCount: 1})

  const release = parameters[0] as ReleaseType;

  // const mainConfig = await read_config(config_file);
  const orig_version = fullConfig.version
  const v = coerce(orig_version);
  if (!v) throw new Error(`Invalid version: "${orig_version}" (not in semver format)`);
  v.inc(release);
  // console.warn(`Invalid version: ${orig_version}`);
  fullConfig.version = v.version;

  const config_file = getConfigFilename();
  await write_config(config_file, fullConfig)
  logger.log(`version ${orig_version} -> ${fullConfig.version}`);
}

export default versionBump
