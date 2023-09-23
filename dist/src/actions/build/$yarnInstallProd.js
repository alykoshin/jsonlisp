"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$yarnInstallProd = void 0;
const exec_1 = require("../../helpers/exec");
const util_1 = require("../../lib/util");
function installDepsCmd() {
    const program = 'yarn';
    const keys = [
        '--production=true',
    ];
    return `${program} ${keys.join(' ')}`;
}
async function $yarnInstallProd(action, parameters, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
    const { cwd, env } = parameters[0];
    const options = {
        cwd,
        env,
    };
    const command_line = installDepsCmd();
    await (0, exec_1.execute)(command_line, options, {
        log: (s) => logger.log(s),
        debug: (s) => logger.debug(s),
    });
}
exports.$yarnInstallProd = $yarnInstallProd;
exports.default = $yarnInstallProd;
//# sourceMappingURL=$yarnInstallProd.js.map