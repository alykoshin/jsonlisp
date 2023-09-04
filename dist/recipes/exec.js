"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_exec = void 0;
const exec_1 = require("../lib/exec");
async function action_exec(definition, { id, fullConfig, runner }) {
    const { config } = definition;
    const { command, cwd, env } = config;
    // const log = (s: number | string) => log_data(s, JSON.stringify(env));
    // const env = {
    //   CONFIG_ENV: config.target, // 'top100',
    // }
    const options = {
        cwd,
        env,
        // // stdio: 'inherit',
        // stdin: 'inherit',
        // stdout: 'pipe',
        // stderr: 'pipe',
    };
    await (0, exec_1.execute)(command, options, {}, (s) => runner.log(id, s));
}
exports.action_exec = action_exec;
//# sourceMappingURL=exec.js.map