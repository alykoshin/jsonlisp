"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.plist = void 0;
const util_1 = require("../../lib/util");
/**
 * @module simple-parallel-tasks
 * @description <br>
 * - {@link https://codeberg.org/glv/simple-parallel-tasks} <br>
 * - The simple-parallel-tasks Reference Manual {@link https://quickref.common-lisp.net/simple-parallel-tasks.html}
 */
/** @name plist */
const plist = async function (_, args, { evaluate }) {
    (0, util_1.fn_check_params)(args, { minCount: 2 });
    const promises = args.map((a) => evaluate(a));
    return await Promise.all(promises);
};
exports.plist = plist;
exports.actions = {
    plist: exports.plist,
};
exports.default = exports.actions;
//# sourceMappingURL=simple-parallel-tasks.js.map