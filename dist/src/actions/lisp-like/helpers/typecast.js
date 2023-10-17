"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asBoolean = exports.asNumber = exports.asList = void 0;
const types_1 = require("../../../apps/runner/lib/types");
function asList(p) {
    (0, types_1.ensureList)(p);
    return p;
}
exports.asList = asList;
function asNumber(p) {
    (0, types_1.ensureNumber)(p);
    return p;
}
exports.asNumber = asNumber;
const asBoolean = (value) => typeof value === 'boolean'
    ? value
    : typeof value !== 'undefined' && value !== null && !(0, types_1.isEmptyList)(value);
exports.asBoolean = asBoolean;
//# sourceMappingURL=typecast.js.map