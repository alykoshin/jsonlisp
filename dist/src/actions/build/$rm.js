"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$rm = void 0;
async function $rm(action, params, { evaluate }) {
    // const { runner, logger } = state;
    // fn_check_params(parameters, { minCount: 1 });
    // for (let pf of parameters) {
    //   const pathname = await runner.eval(pf, state);
    //   const sPathname = String(pathname);
    //   logger.debug(`deleting file "${sPathname}"`);
    //   await fs.rm(sPathname);
    // }
    // logger.debug(`deleted ${parameters.length} dirs/files`);
    return evaluate(['delete-file', ...params]);
}
exports.$rm = $rm;
exports.default = $rm;
//# sourceMappingURL=$rm.js.map