"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
exports.actions = {
    '?': async function (action, params, { runner, logger }) {
        const actionNames = Object.keys(runner.actions).sort();
        logger.info('Available commands:', actionNames.join(', '));
        return undefined;
    },
    ';': async function (action, parameters, { logger }) {
        logger.debug(`Found ";", skipping the list`);
        return undefined;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=documentation.js.map