"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ensureNoFile = void 0;
const fsUtils_1 = require("../../helpers/fsUtils");
const util_1 = require("../../lib/util");
const $ensureNoFile = async function (action, parameters, { id, level, fullConfig, runner, logger }) {
    (0, util_1.fn_check_params)(parameters, { minCount: 1 });
    logger.debug(`$ensureNoFile: parameters: ${JSON.stringify(parameters)}`);
    const result = [];
    for (const p of parameters) {
        const pFilename = await runner.eval(p, fullConfig, { level, logger });
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