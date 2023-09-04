import {coerce, ReleaseType} from "semver";

import {read_config, write_config, FullConfig, getConfigFilename} from '../lib/config'
import {log_data} from '../lib/log'
import {Runner} from "../lib/runner";
import {SleepAction} from "./sleep";

//

// type VersionRelease = 'patch' | 'minor' | 'major'

export interface VersionAction {
  action: 'version'
  config: {
    release: ReleaseType
  }
}


export async function action_version(
  definition: VersionAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner }
) {
  const {config} = definition;
  const release = config.release ?? 'patch';

  // const mainConfig = await read_config(config_file);
  const orig_version = fullConfig.version
  const v = coerce(orig_version);
  if (!v) throw new Error(`Invalid version: "${orig_version}" (not in semver format)`);
  v.inc(release);
  // console.warn(`Invalid version: ${orig_version}`);
  fullConfig.version = v.version;

  const config_file = getConfigFilename();
  await write_config(config_file, fullConfig)
  runner.log(id, `version ${orig_version} -> ${fullConfig.version}`);
}
