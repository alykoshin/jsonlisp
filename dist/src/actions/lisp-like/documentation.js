"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
/**
 * @module documentation
 *
 * @description
 * Seems there is no single command to print all the variables in the Lisp
 * (including current scope etc)
 * Couple of articles how it may be done.
 *
 * @see
 * How can I list all of the defined functions and global variables that are active in common lisp <br>
 * - {@link https://stackoverflow.com/questions/42016114/how-can-i-list-all-of-the-defined-functions-and-global-variables-that-are-active} <br>
 * - {@link http://www.lispworks.com/documentation/HyperSpec/Body/m_do_sym.htm} <br>
 * Macro DO-SYMBOLS, DO-EXTERNAL-SYMBOLS, DO-ALL-SYMBOLS <br>
 */
exports.actions = {
    /** @name ?
     */
    '?': async function (action, params, { runner, logger }) {
        const actionNames = Object.keys(runner.actions).sort();
        logger.info('Available commands:', actionNames.join(', '));
        return undefined;
    },
    /** @name ; */
    ';': async function (action, parameters, { logger }) {
        logger.debug(`Found ";", skipping the list`);
        return undefined;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=documentation.js.map