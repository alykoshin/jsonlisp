"use strict";
// #!/usr/bin/env ts-node
Object.defineProperty(exports, "__esModule", { value: true });
var runner_1 = require("./lib/runner");
var config_1 = require("./lib/config");
//
var config_file = (0, config_1.getConfigFilename)();
(0, runner_1.run_config)(config_file);
// await build_all();
// await auto_version_patch();
// await zip();
//# sourceMappingURL=scripts-demo-zip.js.map