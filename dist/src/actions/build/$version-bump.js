"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$versionBump = void 0;
const semver_1 = require("semver");
const config_1 = require("../../lib/config");
const util_1 = require("../../lib/util");
//
// export type VersionAction = [
//   action: 'version',
//   release: ReleaseType,
// ]
async function $versionBump(action, parameters, state) {
    const { activity, runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
    const release = parameters[0];
    // const mainConfig = await read_config(config_file);
    const orig_version = activity.version;
    const v = (0, semver_1.coerce)(orig_version);
    if (!v)
        throw new Error(`Invalid version: "${orig_version}" (not in semver format)`);
    v.inc(release);
    // console.warn(`Invalid version: ${orig_version}`);
    activity.version = v.version;
    const config_file = (0, config_1.getConfigFilename)();
    await (0, config_1.write_config)(config_file, activity);
    logger.log(`version ${orig_version} -> ${activity.version}`);
}
exports.$versionBump = $versionBump;
exports.default = $versionBump;
//# sourceMappingURL=$version-bump.js.map