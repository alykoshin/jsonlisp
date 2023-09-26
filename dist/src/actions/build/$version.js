"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
//
exports.actions = {
    $version: async function $version(a, params, { evaluate, activity, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: [0, 1] });
        if (params.length > 0) {
            const release = params[0];
            // // const mainConfig = await read_config(config_file);
            // const orig_version = activity.version
            // const v = coerce(orig_version);
            // if (!v) throw new Error(`Invalid version: "${orig_version}" (not in semver format)`);
            // v.inc(release);
            // // console.warn(`Invalid version: ${orig_version}`);
            // activity.version = v.version;
            // const config_file = getConfigFilename();
            // await write_config(config_file, activity)
            // logger.log(`version ${orig_version} -> ${activity.version}`);
            const cmd = `yarn version --${release}`;
            const execDefinition = [
                'shell-command',
                cmd,
                {
                // ...(pConfig as BuildActionConfig),
                },
            ];
            await evaluate(execDefinition);
        }
        const cmd = `node -p -e "require('./package.json').version"`;
        const execDefinition = [
            'shell-command',
            cmd,
            {
            // ...(pConfig as BuildActionConfig),
            },
        ];
        return await evaluate(execDefinition);
    },
};
exports.default = exports.actions;
//# sourceMappingURL=$version.js.map