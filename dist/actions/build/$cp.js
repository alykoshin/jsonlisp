"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$cp = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
/**
 * @module $build
 */
/**
 * @name $cp
 */
const $cp = async function (_, args, { logger }) {
    (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
    const { source, dest, dry: dry_ } = args[0];
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
    return true;
};
exports.$cp = $cp;
exports.default = exports.$cp;
//# sourceMappingURL=$cp.js.map