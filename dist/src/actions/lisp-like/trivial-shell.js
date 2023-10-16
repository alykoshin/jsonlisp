"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const exec_1 = require("./helpers/exec");
const util_1 = require("../../lib/util");
const types_1 = require("../../lib/types");
/**
 * @module trivial-shell
 * @see trivial-shell:shell-command  <br>
 * - {@link https://stackoverflow.com/questions/6065446/executing-a-shell-command-from-common-lisp} <br>
 * - {@link https://trivial-shell.common-lisp.dev/user-guide.html#shell-command}
 *
 */
exports.actions = {
    /**
     * @name shell-command
     */
    'shell-command': async function (_, args, { evaluate, logger }) {
        (0, util_1.fn_check_params)(args, { minCount: 1 });
        const lastParam = args[args.length - 1];
        let config = {};
        if (typeof lastParam === 'object' && lastParam !== null) {
            config = lastParam;
            args = args.slice(0, args.length - 1);
        }
        const { cwd, env } = config || {};
        const result = [];
        for (const p of args) {
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
    /** @name os-process-id */
    'os-process-id': async function (_, args, { evaluate, logger }) {
        (0, util_1.fn_check_params)(args, { exactCount: 0 });
        return process.pid;
    },
    /** @name get-env-var */
    'get-env-var': async function (_, args, { evaluate, logger }) {
        (0, util_1.fn_check_params)(args, { exactCount: 1 });
        const name = evaluate(args[0]);
        (0, types_1.ensureString)(name);
        return process.env[name];
    },
};
exports.default = exports.actions;
//# sourceMappingURL=trivial-shell.js.map