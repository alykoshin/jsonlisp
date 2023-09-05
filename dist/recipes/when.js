"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_when = void 0;
async function action_when(definition, { id, fullConfig, runner }) {
    if (definition[1]) {
        await runner.execute(definition[2], fullConfig);
    }
}
exports.action_when = action_when;
//# sourceMappingURL=when.js.map