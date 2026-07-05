"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.$version = exports.$version_ = void 0;
const validate_args_1 = require("../../eval/validate-args");
const lambda_1 = require("../../kernel/lambda");
/**
 * @module $build
 */
// $version: [ 'shell-command', 'npm version patch' ],
//             'yarn version --new-version patch', {}],
// prettier-ignore
exports.$version_ = (0, lambda_1.createExecutorFn)('$version_', ['$$release'], ['list',
    ['when', '$$release',
        ['shell-command', 'npm version ${$$release}']],
    ['shell-command', 'node -p -e "require(\'./package.json\').version"'],
]);
/**
 * @name $version
 */
const $version = async function $version(a, params, { evaluate, logger }) {
    (0, validate_args_1.validateArgs)(params, { exactCount: [0, 1] });
    if (params.length > 0) {
        const release = params[0];
        const NPM_CMD = `npm version ${release}`;
        // /. const YARN_CMD = `yarn version ${release}`;
        // const YARN_CMD = `yarn version --new-version ${release}`; // yarn version --new-version patch
        const execDefinition = [
            'shell-command',
            NPM_CMD,
            {
            /* ...(pConfig as BuildActionConfig), */
            },
        ];
        try {
            await evaluate(execDefinition);
        }
        catch (e) {
            logger.error([
                `"${NPM_CMD}" failed. Most common cause: npm version requires a`,
                `CLEAN git working tree — commit or stash changes first`,
                `(the repo's own release flow commits before versioning).`,
            ].join('\n'));
            throw e;
        }
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
};
exports.$version = $version;
exports.actions = {
    $version: exports.$version,
    $version_: exports.$version_,
};
exports.default = exports.actions;
//# sourceMappingURL=$version.js.map