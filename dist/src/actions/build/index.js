"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const _build_1 = require("./$build");
const _copyBuildPkg_1 = require("./$copyBuildPkg");
const _version_1 = __importDefault(require("./$version"));
const _yarnInstallProd_1 = require("./$yarnInstallProd");
const _ejsTemplates_1 = require("./$ejsTemplates");
exports.actions = {
    ..._version_1.default,
    build: _build_1.$build,
    $copyBuildPkg: _copyBuildPkg_1.$copyBuildPkg,
    $ejsTemplates: _ejsTemplates_1.$ejsTemplates,
    $yarnInstallProd: _yarnInstallProd_1.$yarnInstallProd,
};
exports.default = exports.actions;
//# sourceMappingURL=index.js.map