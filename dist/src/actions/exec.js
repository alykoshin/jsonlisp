"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = void 0;
const exec_1 = require("../helpers/exec");
const util_1 = require("../lib/util");
async function exec(action, parameters, { id, level, fullConfig, runner, logger }) {
    (0, util_1.fn_check_params)(parameters, { minCount: 1 });
    const lastParam = parameters[parameters.length - 1];
    let config = {};
    if (typeof lastParam === 'object' && lastParam !== null) {
        config = lastParam;
        parameters = parameters.slice(0, parameters.length - 1);
    }
    const { cwd, env } = config || {};
    const result = [];
    for (const p of parameters) {
        const command = await runner.eval(p, fullConfig, { level, logger });
        const sCommand = String(command);
        const options = {
            cwd,
            env,
            // // stdio: 'inherit',
            // stdin: 'inherit',
            // stdout: 'pipe',
            // stderr: 'pipe',
        };
        const res = await (0, exec_1.execute)(sCommand, options, {
            log: (s) => logger.log(s),
            debug: (s) => logger.debug(s),
        });
        result.push(res);
    }
    return result;
}
exports.exec = exec;
exports.default = exec;
//# sourceMappingURL=exec.js.map