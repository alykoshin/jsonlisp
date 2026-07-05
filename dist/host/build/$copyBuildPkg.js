"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$copyBuildPkg = void 0;
const validate_args_1 = require("../../eval/validate-args");
/**
 * @module $build
 */
/**
 * @name $copyBuildPkg
 */
const $copyBuildPkg = async function (_, args, state) {
    const { logger } = state;
    (0, validate_args_1.validateArgs)(args, { exactCount: 0 });
    throw new Error(`Not implemented`);
};
exports.$copyBuildPkg = $copyBuildPkg;
exports.default = exports.$copyBuildPkg;
//# sourceMappingURL=$copyBuildPkg.js.map