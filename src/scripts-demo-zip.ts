// #!/usr/bin/env ts-node

import {run_config} from './lib/runner'
import {getConfigFilename} from './lib/config'
// const {run_config} = await import('./lib/runner')
// const {getConfigFilename} = await import( './lib/config')

//

const config_file = getConfigFilename();
run_config(config_file)

// await build_all();
// await auto_version_patch();
// await zip();

export {}
