"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
exports.actions = {
    error: async function error(action, parameters, state) {
        const { activity, runner, logger } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        const pValue = await runner.eval(parameters[0], state);
        const sValue = String(pValue);
        logger.fatal(sValue);
    }
};
exports.default = exports.actions;
//# sourceMappingURL=error.js.map