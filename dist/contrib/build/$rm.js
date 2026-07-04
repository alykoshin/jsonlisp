"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$rm = void 0;
/**
 * @module $build
 */
/**
 * @name $version
 */
const $rm = async function (_, args, { evaluate }) {
    // const { runner, logger } = state;
    // fn_check_params(parameters, { minCount: 1 });
    // for (let pf of parameters) {
    //   const pathname = await runner.eval(pf, state);
    //   const sPathname = String(pathname);
    //   logger.debug(`deleting file "${sPathname}"`);
    //   await fs.rm(sPathname);
    // }
    // logger.debug(`deleted ${parameters.length} dirs/files`);
    return evaluate(['delete-file', ...args]);
};
exports.$rm = $rm;
exports.default = exports.$rm;
//# sourceMappingURL=$rm.js.map