"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$rm = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const util_1 = require("../../lib/util");
async function $rm(action, parameters, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { minCount: 1 });
    for (let pf of parameters) {
        const pathname = await runner.eval(pf, state);
        const sPathname = String(pathname);
        logger.debug(`[rm] deleting file "${sPathname}"`);
        // if (dry) {
        //   runner.debug({id, level}, `[rm] "dry" flag is set; skipping`);
        // } else {
        await promises_1.default.rm(sPathname);
        // }
    }
    logger.debug(`[cp] deleted ${parameters.length} dirs/files`);
}
exports.$rm = $rm;
exports.default = $rm;
//# sourceMappingURL=$rm.js.map