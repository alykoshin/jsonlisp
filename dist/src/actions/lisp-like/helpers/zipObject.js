"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipObject = void 0;
const types_1 = require("../../../apps/runner/lib/types");
function zipObject(names, values) {
    if (names.length !== values.length)
        throw new Error(`Length of names: ${names.length}, ` +
            `values:${values.length}; must be the same.`);
    const res = {};
    for (const i in names) {
        const n = names[i];
        (0, types_1.ensureString)(n, `Parameter name must be LSymbol (ie string)`);
        res[n] = values[i];
    }
    return res;
}
exports.zipObject = zipObject;
//# sourceMappingURL=zipObject.js.map