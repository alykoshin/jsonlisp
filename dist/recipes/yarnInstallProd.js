"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_yarnInstallProd = void 0;
const exec_1 = require("../lib/exec");
function installDepsCmd() {
    const program = 'yarn';
    const keys = [
        '--production=true',
    ];
    return `${program} ${keys.join(' ')}`;
}
async function action_yarnInstallProd(definition, { id, fullConfig, runner }) {
    const { config } = definition;
    const { cwd, env } = config;
    const options = {
        cwd,
        env,
    };
    const command_line = installDepsCmd();
    await (0, exec_1.execute)(command_line, options, {
        log: (s) => runner.log(id, s),
        debug: (s) => runner.debug(id, s),
    });
}
exports.action_yarnInstallProd = action_yarnInstallProd;
//# sourceMappingURL=yarnInstallProd.js.map