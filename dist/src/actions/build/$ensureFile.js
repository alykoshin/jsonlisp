"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ensureFile = void 0;
const util_1 = require("../../lib/util");
const fsUtils_1 = require("./helpers/fsUtils");
const $ensureFile = async function (action, parameters, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { minCount: 1 });
    logger.debug(`$ensureFile: parameters: ${JSON.stringify(parameters)}`);
    const result = [];
    for (const p of parameters) {
        const pFilename = await runner.eval(p, state);
        const sFilename = String(pFilename);
        logger.debug(`$ensureFile ${sFilename}`);
        await (0, fsUtils_1.ensureFile)(sFilename);
        result.push(sFilename);
    }
    return result;
};
exports.$ensureFile = $ensureFile;
//# sourceMappingURL=$ensureFile.js.map