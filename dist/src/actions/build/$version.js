"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
//
exports.actions = {
    $version: async function $version(a, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: [0, 1] });
        if (params.length > 0) {
            const release = params[0];
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