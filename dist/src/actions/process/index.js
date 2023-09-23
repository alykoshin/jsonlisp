"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const _series_1 = require("./$series");
const _parallel_1 = require("./$parallel");
exports.actions = {
    $parallel: _parallel_1.$parallel,
    $series: _series_1.$series,
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map