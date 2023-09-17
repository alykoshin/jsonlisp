"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const build_1 = require("./build/build");
const copyBuildPkg_1 = require("./build/copyBuildPkg");
const version_bump_1 = require("./build/version-bump");
const yarnInstallProd_1 = require("./build/yarnInstallProd");
const ejsTemplates_1 = require("./build/ejsTemplates");
const _ensureFile_1 = require("./fs/$ensureFile");
const _ensureNoFile_1 = require("./fs/$ensureNoFile");
const cleanup_1 = require("./fs/cleanup");
const cp_1 = require("./fs/cp");
const copyResourcesRecursive_1 = require("./fs/copyResourcesRecursive");
const rm_1 = require("./fs/rm");
const zip_1 = require("./fs/zip");
const echo_1 = require("./echo");
const exec_1 = require("./exec");
const operators_1 = require("./operators");
const confirm_1 = require("./confirm");
const when_1 = require("./when");
const process_1 = require("./process");
const _expect_1 = require("./$expect");
exports.actions = {
    ...process_1.actions,
    ..._expect_1.actions,
    build: build_1.build,
    confirm: confirm_1.confirm,
    copyBuildPkg: copyBuildPkg_1.copyBuildPkg,
    $ensureFile: _ensureFile_1.$ensureFile,
    $ensureNoFile: _ensureNoFile_1.$ensureNoFile,
    cleanup: cleanup_1.cleanup,
    cp: cp_1.cp,
    copyResourcesRecursive: copyResourcesRecursive_1.copyResourcesRecursive,
    // !!!
    echo: echo_1.echo,
    $print: echo_1.echo,
    exec: exec_1.exec,
    $exec: exec_1.exec,
    // !!!
    ejsTemplates: ejsTemplates_1.ejsTemplates,
    '+': operators_1.operators,
    '-': operators_1.operators,
    '*': operators_1.operators,
    '/': operators_1.operators,
    '%': operators_1.operators,
    '=': operators_1.operators,
    '/=': operators_1.operators,
    '>': operators_1.operators,
    '<': operators_1.operators,
    '>=': operators_1.operators,
    '<=': operators_1.operators,
    'min': operators_1.operators,
    'max': operators_1.operators,
    'mod': operators_1.operators,
    'rem': operators_1.operators,
    'and': operators_1.operators,
    'or': operators_1.operators,
    'not': operators_1.operators,
    rm: rm_1.rm,
    version: version_bump_1.versionBump,
    when: when_1.when,
    yarnInstallProd: yarnInstallProd_1.yarnInstallProd,
    zip: zip_1.zip,
};
// type ActionKeys = keyof typeof actions
//# sourceMappingURL=index.js.map