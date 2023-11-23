"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
const types_1 = require("./helpers/types");
/**
 * @module system
 * @see ...
 */
exports.actions = {
    /** @name sleep */
    sleep: async function (action, params, { evaluate, logger }) {
        (0, validateArgs_1.validateArgs)(params, { exactCount: 1 });
        const value = await evaluate(params[0]);
        (0, types_1.ensureNumber)(value);
        // const nValue = Number(pValue);
        logger.debug(`sleep ${value} seconds`);
        await new Promise((resolve, _reject) => setTimeout(resolve, value * 1000));
        logger.log(`sleep done`);
    },
    /** @name time */
    time: async function (action, params, { evaluate, logger }) {
        (0, validateArgs_1.validateArgs)(params, { exactCount: 1 });
        const [expr] = params;
        const startTime = new Date();
        const value = await evaluate(expr);
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        logger.log(`Evaluation took:\n  ${duration / 1000} seconds of real time`);
        return value;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=system.js.map