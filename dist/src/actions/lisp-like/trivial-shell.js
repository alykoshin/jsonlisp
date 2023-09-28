"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const exec_1 = require("./helpers/exec");
const util_1 = require("../../lib/util");
/**
 *
 * trivial-shell:shell-command
 *
 * https://stackoverflow.com/questions/6065446/executing-a-shell-command-from-common-lisp
 *
 * https://trivial-shell.common-lisp.dev/user-guide.html#shell-command
 *
 */
exports.actions = {
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
            const pCommand = await evaluate(p);
            const sCommand = String(pCommand);
            const options = {
                cwd,
                env,
                // // stdio: 'inherit',
                // stdin: 'inherit',
                // stdout: 'pipe',
                // stderr: 'pipe',
            };
            const r = await (0, exec_1.execute)(sCommand, options, { logger });
            result.push(r.stdout);
        }
        return result.length === 1 ? result[0] : result;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=trivial-shell.js.map