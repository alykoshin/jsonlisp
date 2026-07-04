"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliceListList = exports.seriesn = exports.series2 = exports.series1 = exports.seriesnth = exports.evlis = exports.series = void 0;
const sexpr_1 = require("./sexpr");
const validate_args_1 = require("./validate-args");
const series = async (args, st) => {
    (0, validate_args_1.validateArgs)(args, { minCount: 0 });
    const result = [];
    for (const a of args) {
        const res = await st.evaluate(a);
        result.push(res);
    }
    return result;
};
exports.series = series;
/** McCarthy's name for it (jmc.lisp: evlis.) */
exports.evlis = exports.series;
const seriesnth = async (index, args, st) => {
    const result = await (0, exports.series)(args, st);
    if (index < 0) {
        index = result.length - 1;
    }
    (0, validate_args_1.validateArgs)(result, { minCount: index });
    return result[index];
};
exports.seriesnth = seriesnth;
const series1 = async (args, st) => {
    return (0, exports.seriesnth)(0, args, st);
};
exports.series1 = series1;
const series2 = async (args, st) => {
    return (0, exports.seriesnth)(1, args, st);
};
exports.series2 = series2;
const seriesn = async (args, st) => {
    return (0, exports.seriesnth)(-1, args, st);
};
exports.seriesn = seriesn;
const sliceListList = function (listOfLists, pos) {
    (0, sexpr_1.ensureList)(listOfLists);
    let finish = false;
    const slice = listOfLists.map((l, i) => {
        (0, sexpr_1.ensureList)(l);
        if (!(0, sexpr_1.isList)(l) || pos >= l.length) {
            finish = true;
        }
        else {
            return l[pos];
        }
    });
    return finish ? [] : slice;
};
exports.sliceListList = sliceListList;
//# sourceMappingURL=evlis.js.map