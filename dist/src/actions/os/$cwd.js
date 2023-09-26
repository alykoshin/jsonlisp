"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
exports.actions = {
    '$cwd': async function (action, parameters, state) {
        const { runner, logger } = state;
        (0, util_1.fn_check_params)(parameters, { exactCount: [0, 1] });
        if (parameters.length === 1) {
            const pCwd = await runner.eval(parameters[0], state);
            const sCwd = String(pCwd);
            process.chdir(sCwd);
        }
        const res = process.cwd();
        logger.debug(`$cwd: ${res}`);
        return res;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=$cwd.js.map