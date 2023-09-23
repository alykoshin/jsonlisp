"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const util_1 = require("../../lib/util");
async function sleep(action, parameters, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
    const pValue = await runner.eval(parameters[0], state);
    const nValue = Number(pValue);
    logger.debug(`sleep ${nValue} seconds`);
    await new Promise((resolve, _reject) => setTimeout(resolve, nValue * 1000));
    logger.log(`sleep done`);
}
exports.sleep = sleep;
exports.default = sleep;
//# sourceMappingURL=sleep.js.map