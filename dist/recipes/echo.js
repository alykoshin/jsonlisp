"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_echo = void 0;
async function action_echo(definition, { id, fullConfig, runner }) {
    const { action, value } = definition;
    runner.log(id, value);
}
exports.action_echo = action_echo;
//# sourceMappingURL=echo.js.map