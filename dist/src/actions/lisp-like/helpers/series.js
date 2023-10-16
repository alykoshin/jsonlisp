"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.seriesn = exports.series2 = exports.series1 = exports.seriesnth = exports.series = void 0;
const util_1 = require("../../../lib/util");
// export const lengthEqual = (lists: any[]): boolean =>
//   lists.every((l) => lists[0].length === l.length);
//
const series = async (forms, evaluate) => {
    (0, util_1.fn_check_params)(forms, { minCount: 0 });
    const result = [];
    for (const p of forms) {
        const res = await evaluate(p);
        result.push(res);
    }
    return result;
};
exports.series = series;
const seriesnth = async (index, forms, evaluate) => {
    const result = await (0, exports.series)(forms, evaluate);
    if (index < 0) {
        index = result.length - 1;
    }
    (0, util_1.fn_check_params)(result, { minCount: index });
    return result[index];
};
exports.seriesnth = seriesnth;
const series1 = async (forms, evaluate) => {
    return (0, exports.seriesnth)(0, forms, evaluate);
};
exports.series1 = series1;
const series2 = async (forms, evaluate) => {
    return (0, exports.seriesnth)(1, forms, evaluate);
};
exports.series2 = series2;
const seriesn = async (forms, evaluate) => {
    return (0, exports.seriesnth)(-1, forms, evaluate);
};
exports.seriesn = seriesn;
//# sourceMappingURL=series.js.map