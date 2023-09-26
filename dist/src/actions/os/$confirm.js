"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
const confirm_1 = require("../../helpers/confirm");
exports.actions = {
    '$confirm': async function (action, parameters, state) {
        const { runner, logger } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: [0, 1] });
        const value = parameters.length === 1
            ? String(await runner.eval(parameters[0], state))
            : 'Confirm y/[N]?';
        const res = await (0, confirm_1.confirm)(value);
        logger.info(`confirm: ${res}`);
        return res;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=$confirm.js.map