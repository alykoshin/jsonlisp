"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const validate_args_1 = require("../eval/validate-args");
const sexpr_1 = require("../eval/sexpr");
/**
 * @module cl/environment
 * CLHS chapter 25 "Environment": sleep, time.
 * @see ...
 */
exports.actions = {
    /** @name sleep */
    sleep: async function (action, params, { evaluate, logger }) {
        (0, validate_args_1.validateArgs)(params, { exactCount: 1 });
        const value = await evaluate(params[0]);
        (0, sexpr_1.ensureNumber)(value);
        // const nValue = Number(pValue);
        logger.debug(`sleep ${value} seconds`);
        await new Promise((resolve, _reject) => setTimeout(resolve, value * 1000));
        logger.log(`sleep done`);
    },
    /** @name time */
    time: async function (action, params, { evaluate, logger }) {
        (0, validate_args_1.validateArgs)(params, { exactCount: 1 });
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
//# sourceMappingURL=environment.js.map