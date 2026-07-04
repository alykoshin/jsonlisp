"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ensureFile = void 0;
const validate_args_1 = require("../../eval/validate-args");
const fileUtils_1 = require("../../lib/fileUtils/fileUtils");
const sexpr_1 = require("../../eval/sexpr");
/**
 * @module $build
 */
/**
 * @name $ensureFile
 */
const $ensureFile = async function (_, args, { evaluate, logger }) {
    (0, validate_args_1.validateArgs)(args, { minCount: 1 });
    logger.debug(`$ensureFile: parameters: ${JSON.stringify(args)}`);
    const result = [];
    for (const p of args) {
        const fname = await evaluate(p);
        (0, sexpr_1.ensureString)(fname);
        logger.debug(`$ensureFile "${fname}"`);
        await (0, fileUtils_1.ensureFile)(fname);
        result.push(fname);
    }
    return result;
};
exports.$ensureFile = $ensureFile;
//# sourceMappingURL=$ensureFile.js.map