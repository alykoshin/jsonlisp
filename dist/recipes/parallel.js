"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_parallel = void 0;
async function action_parallel(definition, { id, fullConfig, runner }) {
    let actions;
    if (Array.isArray(definition)) {
        const [_action, ..._actions] = definition;
        actions = _actions;
    }
    else {
        actions = definition.actions;
    }
    const promises = actions.map(a => runner.execute(a, fullConfig));
    // }
    return await Promise.all(promises);
}
exports.action_parallel = action_parallel;
//# sourceMappingURL=parallel.js.map