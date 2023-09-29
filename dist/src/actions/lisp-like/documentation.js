"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
exports.actions = {
    /**
     * There is no simple way to print all the variables. Couple of articles how it may be done.
     *
     * How can I list all of the defined functions and global variables that are active in common lisp
     * https://stackoverflow.com/questions/42016114/how-can-i-list-all-of-the-defined-functions-and-global-variables-that-are-active
     *
     * http://www.lispworks.com/documentation/HyperSpec/Body/m_do_sym.htm
     * Macro DO-SYMBOLS, DO-EXTERNAL-SYMBOLS, DO-ALL-SYMBOLS
     */
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