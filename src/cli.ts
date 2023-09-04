// #!/usr/bin/env ts-node

import {Runner} from './lib/runner'
import {getConfigFilename} from './lib/config'
// const {run_config} = await import('./lib/runner')
// const {getConfigFilename} = await import( './lib/config')

//
const pathname = getConfigFilename();
(new Runner()).start(pathname)

