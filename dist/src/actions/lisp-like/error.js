"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
exports.actions = {
    error: async function error(action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        const sValue = String(pValue);
        logger.fatal(sValue);
    },
    /**
     *
     * https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node336.html
     *
     */
    assert: async function (action, params, { evaluate, scopes, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: [1, 2] });
        const actual = await evaluate(params[0]);
        // console.log('>>>', actual)
        const res = !!actual;
        const sValue = JSON.stringify(actual);
        if (!res) {
            let msg = `Assert failed: `;
            msg += params[1] ? (msg = String(await evaluate(params[1]))) : sValue;
            logger.fatal(msg);
        }
        return res;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=error.js.map