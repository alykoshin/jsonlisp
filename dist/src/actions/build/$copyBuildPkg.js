"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$copyBuildPkg = void 0;
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
/**
 * @module $build
 */
/**
 * @name $copyBuildPkg
 */
const $copyBuildPkg = async function (_, args, state) {
    const { runner, logger } = state;
    (0, validateArgs_1.validateArgs)(args, { exactCount: 0 });
    throw new Error(`Not implemented`);
};
exports.$copyBuildPkg = $copyBuildPkg;
exports.default = exports.$copyBuildPkg;
//# sourceMappingURL=$copyBuildPkg.js.map