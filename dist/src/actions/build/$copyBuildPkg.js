"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$copyBuildPkg = void 0;
const util_1 = require("../../lib/util");
async function $copyBuildPkg(action, parameters, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { exactCount: 0 });
    throw new Error(`Not implemented`);
}
exports.$copyBuildPkg = $copyBuildPkg;
exports.default = $copyBuildPkg;
//# sourceMappingURL=$copyBuildPkg.js.map