"use strict";
// #!/usr/bin/env ts-node
Object.defineProperty(exports, "__esModule", { value: true });
var runner_1 = require("./lib/runner");
var config_1 = require("./lib/config");
// const {run_config} = await import('./lib/runner')
// const {getConfigFilename} = await import( './lib/config')
//
var config_file = (0, config_1.getConfigFilename)();
(0, runner_1.run_config)(config_file);
//# sourceMappingURL=scripts-demo-zip.js.map