"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
exports.actions = {
    $help: async function (action, parameters, state) {
        const { runner, logger, scopes } = state;
        const actionNames = Object.keys(runner.actions).sort();
        // for (const a of actionNames) {
        // logger.info(`  ${JSON.stringify(a)}`);
        // }
        // logger.info(`  ${JSON.stringify(actionNames)}`);
        logger.info('Available commands:', actionNames.join(', '));
        return undefined;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=$help.js.map