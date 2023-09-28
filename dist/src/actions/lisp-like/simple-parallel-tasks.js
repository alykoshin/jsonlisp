"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
/**
 * simple-parallel-tasks
 * https://codeberg.org/glv/simple-parallel-tasks
 *
 * The simple-parallel-tasks Reference Manual
 * https://quickref.common-lisp.net/simple-parallel-tasks.html
 */
exports.actions = {
    'plist': async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { minCount: 2 });
        const promises = params.map((a) => evaluate(a));
        return await Promise.all(promises);
    },
};
exports.default = exports.actions;
//# sourceMappingURL=simple-parallel-tasks.js.map