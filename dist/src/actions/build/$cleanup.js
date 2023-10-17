"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$cleanup = void 0;
const util_1 = require("../../apps/runner/lib/util");
/**
 * @module $build
 */
/**
 * @name $cleanup
 */
const $cleanup = async function (_, args, { evaluate, logger }) {
    (0, util_1.fn_check_params)(args, { minCount: 1 });
    // const result: Parameters = [];
    // for (const p of parameters) {
    //   const pDirname = await evaluate(p);
    //   const sDirname = String(pDirname);
    //   logger.debug(`cleanup ${sDirname}`);
    //   const res = await removeDirRecursive(sDirname);
    //   result.push(sDirname);
    // }
    return evaluate(['print', ...args]);
};
exports.$cleanup = $cleanup;
exports.default = exports.$cleanup;
//# sourceMappingURL=$cleanup.js.map