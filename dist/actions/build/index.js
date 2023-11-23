"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
// import { $build } from "./$build";
const _copyBuildPkg_1 = require("./$copyBuildPkg");
const _version_1 = __importDefault(require("./$version"));
const _yarnInstallProd_1 = require("./$yarnInstallProd");
const _ejsTemplates_1 = require("./$ejsTemplates");
const _ensureFile_1 = require("./$ensureFile");
const _ensureNoFile_1 = require("./$ensureNoFile");
const _cleanup_1 = require("./$cleanup");
const _cp_1 = require("./$cp");
const _copyResourcesRecursive_1 = require("./$copyResourcesRecursive");
const _rm_1 = require("./$rm");
const _zip_1 = require("./$zip");
exports.actions = {
    ..._version_1.default,
    // build: $build,
    $copyBuildPkg: _copyBuildPkg_1.$copyBuildPkg,
    $ejsTemplates: _ejsTemplates_1.$ejsTemplates,
    $yarnInstallProd: _yarnInstallProd_1.$yarnInstallProd,
    $ensureFile: _ensureFile_1.$ensureFile,
    $ensureNoFile: _ensureNoFile_1.$ensureNoFile,
    $cleanup: _cleanup_1.$cleanup,
    $cp: _cp_1.$cp,
    $copyResourcesRecursive: _copyResourcesRecursive_1.$copyResourcesRecursive,
    $rm: _rm_1.$rm,
    $zip: _zip_1.$zip,
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map