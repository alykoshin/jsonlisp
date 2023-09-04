"use strict";
// #!/usr/bin/env ts-node
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("./lib/runner");
const config_1 = require("./lib/config");
// const {run_config} = await import('./lib/runner')
// const {getConfigFilename} = await import( './lib/config')
//
const pathname = (0, config_1.getConfigFilename)();
(new runner_1.Runner()).start(pathname);
//# sourceMappingURL=cli.js.map