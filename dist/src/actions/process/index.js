"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const series_1 = require("./series");
const sleep_1 = require("./sleep");
const parallel_1 = require("./parallel");
const time_1 = require("./time");
exports.actions = {
    parallel: parallel_1.parallel,
    series: series_1.series,
    sleep: sleep_1.sleep,
    time: time_1.time,
};
//# sourceMappingURL=index.js.map