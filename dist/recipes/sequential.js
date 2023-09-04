"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_sequential = void 0;
async function action_sequential(definition, { id, fullConfig, runner }) {
    let actions;
    if (Array.isArray(definition)) {
        const [_action, ..._actions] = definition;
        actions = _actions;
    }
    else {
        actions = definition.actions;
    }
    for (const subActionConfig of actions) {
        // const {action} = baseActionConfig;
        // log(action);
        await runner.execute(subActionConfig, fullConfig);
    }
}
exports.action_sequential = action_sequential;
//# sourceMappingURL=sequential.js.map