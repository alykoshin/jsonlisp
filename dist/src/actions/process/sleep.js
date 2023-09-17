"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const util_1 = require("../../lib/util");
async function sleep(action, parameters, { id, level, fullConfig, runner, logger }) {
    (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
    const pValue = await runner.eval(parameters[0], fullConfig, { level, logger });
    const sValue = Number(pValue);
    logger.debug(`sleep ${sValue} seconds`);
    await new Promise((resolve, _reject) => setTimeout(resolve, sValue * 1000));
    logger.log(`sleep done`);
}
exports.sleep = sleep;
exports.default = sleep;
//# sourceMappingURL=sleep.js.map