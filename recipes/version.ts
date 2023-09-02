import {coerce,ReleaseType} from "semver";

import {read_config,write_config,FullConfig, getConfigFilename} from '../config.ts'
import {log_data} from '../log.ts'
import {run_action} from "../runner.ts";

//

// type VersionRelease = 'patch' | 'minor' | 'major'

export interface VersionAction {
  action: 'version'
  config: {
    release: ReleaseType
  }
}


export async function action_version({config}: VersionAction, fullConfig: FullConfig) {
  const log = (s: number | string) => log_data(s, 'version');
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
  log(`version ${orig_version} -> ${fullConfig.version}`);
}
