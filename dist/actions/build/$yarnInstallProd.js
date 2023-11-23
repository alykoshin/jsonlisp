"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$yarnInstallProd = void 0;
const exec_1 = require("../lisp-like/helpers/exec");
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
function installDepsCmd() {
    const program = 'yarn';
    const keys = ['--production=true'];
    return `${program} ${keys.join(' ')}`;
}
/**
 * @module $build
 */
/**
 * @module $yarnInstallProd
 */
const $yarnInstallProd = async function (_, args, state) {
    (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
    const { cwd, env } = args[0];
    const options = {
        cwd,
        env,
    };
    const command_line = installDepsCmd();
    const r = await (0, exec_1.execute)(command_line, options, { state });
    return r.stdout;
};
exports.$yarnInstallProd = $yarnInstallProd;
exports.default = exports.$yarnInstallProd;
//# sourceMappingURL=$yarnInstallProd.js.map