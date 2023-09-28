"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seriesLast = exports.series = void 0;
const series = async (forms, evaluate) => {
    const result = [];
    for (const p of forms) {
        const res = await evaluate(p);
        result.push(res);
    }
    return result;
};
exports.series = series;
const seriesLast = async (forms, evaluate) => {
    const result = await (0, exports.series)(forms, evaluate);
    return result[result.length - 1];
};
exports.seriesLast = seriesLast;
//# sourceMappingURL=series.js.map