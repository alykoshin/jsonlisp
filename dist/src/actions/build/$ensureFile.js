"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ensureFile = void 0;
const util_1 = require("../../apps/runner/lib/util");
const fsUtils_1 = require("./helpers/fsUtils");
/**
 * @module $build
 */
/**
 * @name $ensureFile
 */
const $ensureFile = async function (_, args, { evaluate, logger }) {
    (0, util_1.fn_check_params)(args, { minCount: 1 });
    logger.debug(`$ensureFile: parameters: ${JSON.stringify(args)}`);
    const result = [];
    for (const p of args) {
        const pFilename = await evaluate(p);
        const sFilename = String(pFilename);
        logger.debug(`$ensureFile ${sFilename}`);
        await (0, fsUtils_1.ensureFile)(sFilename);
        result.push(sFilename);
    }
    return result;
};
exports.$ensureFile = $ensureFile;
//# sourceMappingURL=$ensureFile.js.map