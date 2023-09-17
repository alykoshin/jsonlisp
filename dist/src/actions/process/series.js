"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.series = void 0;
const util_1 = require("../../lib/util");
// export type SequentialAction = [
//   action: 'sequential',
//   ...actions: ActionDefinition[],
// ]
async function series(action, parameters, { id, level, fullConfig, runner, logger }) {
    (0, util_1.fn_check_params)(parameters, { minCount: 2 });
    const result = [];
    for (const p of parameters) {
        // const {action} = baseActionConfig;
        // log(action);
        const res = await runner.eval(p, fullConfig, { level, logger });
        result.push(res);
    }
    return result;
}
exports.series = series;
exports.default = series;
//# sourceMappingURL=series.js.map