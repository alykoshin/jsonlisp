"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.execAction = void 0;
const types_1 = require("../../../apps/runner/lib/types");
const execAction = function (
// actions: Actions,
name, expr, state) {
    const fn = state.actions[name];
    (0, types_1.ensureFunction)(fn, `function "${name}" not defined`);
    const res = fn(name, [expr], state);
    return res;
};
exports.execAction = execAction;
//# sourceMappingURL=actions.js.map