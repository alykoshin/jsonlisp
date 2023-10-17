"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ensureNoFile = void 0;
const fsUtils_1 = require("./helpers/fsUtils");
const util_1 = require("../../apps/runner/lib/util");
/**
 * @module $build
 */
/**
 * @name $ensureNoFile
 */
const $ensureNoFile = async function (_, args, { evaluate, logger }) {
    (0, util_1.fn_check_params)(args, { minCount: 1 });
    logger.debug(`$ensureNoFile: parameters: ${JSON.stringify(args)}`);
    const result = [];
    for (const p of args) {
        const pFilename = await evaluate(p);
        const sFilename = String(pFilename);
        logger.debug(`$ensureNoFile ${sFilename}`);
        await (0, fsUtils_1.ensureNoFile)(sFilename);
        result.push(sFilename);
    }
    return result;
};
exports.$ensureNoFile = $ensureNoFile;
exports.default = exports.$ensureNoFile;
//# sourceMappingURL=$ensureNoFile.js.map