"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.time = void 0;
const util_1 = require("../../lib/util");
async function time(action, parameters, { id, level, fullConfig, runner, logger }) {
    (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
    const [pDuration] = parameters;
    const startTime = new Date();
    const value = await runner.eval(pDuration, fullConfig, { level, logger });
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    logger.log(`Evaluation took:\n  ${duration / 1000} seconds of real time`);
    return value;
}
exports.time = time;
exports.default = time;
//# sourceMappingURL=time.js.map