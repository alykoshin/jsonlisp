"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.plist = void 0;
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
/**
 * @module simple-parallel-tasks
 * @description <br>
 * - {@link https://codeberg.org/glv/simple-parallel-tasks} <br>
 * - The simple-parallel-tasks Reference Manual {@link https://quickref.common-lisp.net/simple-parallel-tasks.html}
 */
/** @name plist */
const plist = async function (_, args, { evaluate }) {
    (0, validateArgs_1.validateArgs)(args, { minCount: 1 });
    const promises = args.map((a) => evaluate(a));
    return await Promise.all(promises);
};
exports.plist = plist;
exports.actions = {
    plist: exports.plist,
};
exports.default = exports.actions;
//# sourceMappingURL=simple-parallel-tasks.js.map