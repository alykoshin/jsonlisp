"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$cp = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const util_1 = require("../../lib/util");
async function $cp(action, params, { logger }) {
    (0, util_1.fn_check_params)(params, { exactCount: 1 });
    const { source, dest, dry: dry_ } = params[0];
    const dry = typeof dry_ !== 'undefined' ? dry_ : false;
    const sources = Array.isArray(source) ? source : [source];
    for (let src of sources) {
        logger.debug(`copying "${src}"`);
        if (dry) {
            logger.debug(`"dry" flag is set; skipping`);
        }
        else {
            await promises_1.default.cp(src, dest);
        }
    }
    logger.debug(`copied ${sources.length} dirs/files`);
}
exports.$cp = $cp;
exports.default = $cp;
//# sourceMappingURL=$cp.js.map