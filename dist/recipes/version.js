"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_version = void 0;
const semver_1 = require("semver");
const config_1 = require("../lib/config");
async function action_version(definition, { id, fullConfig, runner }) {
    const { config } = definition;
    const release = config.release ?? 'patch';
    // const mainConfig = await read_config(config_file);
    const orig_version = fullConfig.version;
    const v = (0, semver_1.coerce)(orig_version);
    if (!v)
        throw new Error(`Invalid version: "${orig_version}" (not in semver format)`);
    v.inc(release);
    // console.warn(`Invalid version: ${orig_version}`);
    fullConfig.version = v.version;
    const config_file = (0, config_1.getConfigFilename)();
    await (0, config_1.write_config)(config_file, fullConfig);
    runner.log(id, `version ${orig_version} -> ${fullConfig.version}`);
}
exports.action_version = action_version;
//# sourceMappingURL=version.js.map