"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
const print_1 = require("../../helpers/print");
exports.actions = {
    prin1: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        const toPrint = JSON.stringify(pValue);
        (0, print_1.print)(toPrint);
        return pValue;
    },
    princ: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        (0, print_1.print)(pValue, '\n');
        return pValue;
    },
    print: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const pValue = await evaluate(params[0]);
        const toPrint = JSON.stringify(pValue);
        (0, print_1.print)(toPrint, '\n');
        return pValue;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=input-output.js.map