"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$yarnInstallProd = void 0;
const exec_1 = require("../lisp-like/helpers/exec");
const util_1 = require("../../lib/util");
function installDepsCmd() {
    const program = 'yarn';
    const keys = ['--production=true'];
    return `${program} ${keys.join(' ')}`;
}
async function $yarnInstallProd(action, params, { logger }) {
    (0, util_1.fn_check_params)(params, { exactCount: 1 });
    const { cwd, env } = params[0];
    const options = {
        cwd,
        env,
    };
    const command_line = installDepsCmd();
    const r = await (0, exec_1.execute)(command_line, options, { logger });
    return r.stdout;
}
exports.$yarnInstallProd = $yarnInstallProd;
exports.default = $yarnInstallProd;
//# sourceMappingURL=$yarnInstallProd.js.map