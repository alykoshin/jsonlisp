"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const _build_1 = require("./build/$build");
const _copyBuildPkg_1 = require("./build/$copyBuildPkg");
const _version_1 = __importDefault(require("./build/$version"));
const _yarnInstallProd_1 = require("./build/$yarnInstallProd");
const _ejsTemplates_1 = require("./build/$ejsTemplates");
const _ensureFile_1 = require("./fs/$ensureFile");
const _ensureNoFile_1 = require("./fs/$ensureNoFile");
const _cleanup_1 = require("./fs/$cleanup");
const _cp_1 = require("./fs/$cp");
const _copyResourcesRecursive_1 = require("./fs/$copyResourcesRecursive");
const _rm_1 = require("./fs/$rm");
const _zip_1 = require("./fs/$zip");
const _echo_1 = require("./os/$echo");
const _exec_1 = require("./os/$exec");
const lisp_like_1 = __importDefault(require("./lisp-like"));
const _confirm_1 = require("./os/$confirm");
const process_1 = __importDefault(require("./process/"));
const misc_1 = __importDefault(require("./misc/"));
const _shelljs_1 = __importDefault(require("./os/$shelljs"));
const _cwd_1 = __importDefault(require("./os/$cwd"));
exports.actions = {
    ..._version_1.default,
    ...process_1.default,
    ...misc_1.default,
    ..._shelljs_1.default,
    ..._cwd_1.default,
    ...lisp_like_1.default,
    build: _build_1.$build,
    $confirm: _confirm_1.$confirm,
    $copyBuildPkg: _copyBuildPkg_1.$copyBuildPkg,
    $ensureFile: _ensureFile_1.$ensureFile,
    $ensureNoFile: _ensureNoFile_1.$ensureNoFile,
    cleanup: _cleanup_1.$cleanup,
    cp: _cp_1.$cp,
    copyResourcesRecursive: _copyResourcesRecursive_1.$copyResourcesRecursive,
    $echo: _echo_1.$echo,
    $print: _echo_1.$echo,
    $exec: _exec_1.$exec,
    $ejsTemplates: _ejsTemplates_1.$ejsTemplates,
    $rm: _rm_1.$rm,
    $yarnInstallProd: _yarnInstallProd_1.$yarnInstallProd,
    $zip: _zip_1.$zip,
};
// type ActionKeys = keyof typeof actions
//# sourceMappingURL=index.js.map