"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$cp = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const util_1 = require("../../lib/util");
async function $cp(action, parameters, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
    const { source, dest, dry: dry_ } = parameters[0];
    const dry = typeof dry_ !== 'undefined' ? dry_ : false;
    const sources = Array.isArray(source) ? source : [source];
    for (let src of sources) {
        logger.debug(`[cp] copying "${src}"`);
        if (dry) {
            logger.debug(`[cp] "dry" flag is set; skipping`);
        }
        else {
            await promises_1.default.cp(src, dest);
        }
    }
    logger.debug(`[cp] copied ${sources.length} dirs/files`);
}
exports.$cp = $cp;
exports.default = $cp;
//# sourceMappingURL=$cp.js.map