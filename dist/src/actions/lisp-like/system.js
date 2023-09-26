"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
const exec_1 = require("../../helpers/exec");
exports.actions = {
    sleep: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        const nValue = Number(pValue);
        logger.debug(`sleep ${nValue} seconds`);
        await new Promise((resolve, _reject) => setTimeout(resolve, nValue * 1000));
        logger.log(`sleep done`);
    },
    time: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const [pDuration] = params;
        const startTime = new Date();
        const value = await evaluate(pDuration);
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        logger.log(`Evaluation took:\n  ${duration / 1000} seconds of real time`);
        return value;
    },
    'shell-command': async function (action, params, { evaluate, logger }) {
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
    },
};
exports.default = exports.actions;
//# sourceMappingURL=system.js.map