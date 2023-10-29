"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
/**
 * @module system
 * @see ...
 */
exports.actions = {
    /** @name sleep */
    sleep: async function (action, params, { evaluate, logger }) {
        (0, validateArgs_1.validateArgs)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        const nValue = Number(pValue);
        logger.debug(`sleep ${nValue} seconds`);
        await new Promise((resolve, _reject) => setTimeout(resolve, nValue * 1000));
        logger.log(`sleep done`);
    },
    /** @name time */
    time: async function (action, params, { evaluate, logger }) {
        (0, validateArgs_1.validateArgs)(params, { exactCount: 1 });
        const [pDuration] = params;
        const startTime = new Date();
        const value = await evaluate(pDuration);
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        logger.log(`Evaluation took:\n  ${duration / 1000} seconds of real time`);
        return value;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=system.js.map