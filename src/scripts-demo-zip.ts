// #!/usr/bin/env ts-node

import {run_config} from './lib/runner'
import {getConfigFilename} from './lib/config'

//

const config_file = getConfigFilename();
run_config(config_file)

// await build_all();
// await auto_version_patch();
// await zip();
