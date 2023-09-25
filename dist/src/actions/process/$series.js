"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const util_1 = require("../../lib/util");
const series_1 = require("../../helpers/series");
exports.actions = {
    $series: async function $series(action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { minCount: 1 });
        return (0, series_1.series)(params, evaluate);
    },
};
exports.default = exports.actions;
//# sourceMappingURL=$series.js.map