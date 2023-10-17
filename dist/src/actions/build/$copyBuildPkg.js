"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$copyBuildPkg = void 0;
const util_1 = require("../../apps/runner/lib/util");
/**
 * @module $build
 */
/**
 * @name $copyBuildPkg
 */
const $copyBuildPkg = async function (_, args, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(args, { exactCount: 0 });
    throw new Error(`Not implemented`);
};
exports.$copyBuildPkg = $copyBuildPkg;
exports.default = exports.$copyBuildPkg;
//# sourceMappingURL=$copyBuildPkg.js.map