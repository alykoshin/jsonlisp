"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_sleep = void 0;
async function action_sleep(definition, { id, fullConfig, runner }) {
    const { action, value } = definition;
    // log_data(message, action);
    runner.debug(id, `sleep ${value}ms`);
    await new Promise((resolve, _reject) => setTimeout(resolve, value));
    runner.log(id, `sleep done`);
}
exports.action_sleep = action_sleep;
//# sourceMappingURL=sleep.js.map