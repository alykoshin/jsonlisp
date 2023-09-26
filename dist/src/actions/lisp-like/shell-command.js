"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shellCommand = void 0;
const exec_1 = require("../../helpers/exec");
const util_1 = require("../../lib/util");
const shellCommand = async function (action, params, { evaluate, logger }) {
    (0, util_1.fn_check_params)(params, { minCount: 1 });
    const lastParam = params[params.length - 1];
    let config = {};
    if (typeof lastParam === 'object' && lastParam !== null) {
        config = lastParam;
        params = params.slice(0, params.length - 1);
    }
    const { cwd, env } = config || {};
    const result = [];
    for (const p of params) {
        const command = await evaluate(p);
        const sCommand = String(command);
        const options = {
            cwd,
            env,
            // // stdio: 'inherit',
            // stdin: 'inherit',
            // stdout: 'pipe',
            // stderr: 'pipe',
        };
        const res = await (0, exec_1.execute)(sCommand, options, { logger });
        result.push(res);
    }
    return result.length === 1 ? result[0] : result;
};
exports.shellCommand = shellCommand;
exports.default = exports.shellCommand;
//# sourceMappingURL=shell-command.js.map