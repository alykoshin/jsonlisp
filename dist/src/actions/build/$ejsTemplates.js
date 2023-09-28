"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ejsTemplates = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const ejs_1 = __importDefault(require("ejs"));
const fsUtils_1 = require("../build/helpers/fsUtils");
const util_1 = require("../../lib/util");
const DEBUG = false;
// export type EjsTemplatesAction = [
//   action: 'ejsTemplates',
//   config: EjsTemplatesActionConfig
// ]
async function $ejsTemplates(action, parameters, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
    const { sourceDir, excludeDirs: excludeDirs_, targetDir, } = parameters[0];
    const excludeDirs = Array.isArray(excludeDirs_)
        ? excludeDirs_
        : [excludeDirs_];
    const PROJECT_ROOT_DIR = '.';
    //const ejsDefaultConfig = require(path.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'));
    //const ejsDefaultConfig = await import(path.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'), { assert: { type: "json" } });
    const ejsDefaultConfig = await promises_1.default
        .readFile(path_1.default.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'), {
        encoding: 'utf8',
    })
        .then(JSON.parse);
    const ejsDefaultOptions = {
        root: PROJECT_ROOT_DIR,
        rmWhitespace: !DEBUG,
    };
    const ejsFiles = await (0, fsUtils_1.getFilesRecursive)(sourceDir, {
        extnames: '.ejs',
        excludeDirs,
    });
    //const ejsFiles = [
    //  'D:\\teach\\05. МИСиС. 1.01. Веб-разработка\\presentations2\\src\\00-contents\\index.ejs',
    //  ]
    //console.log(ejsFiles)
    // for (let i in ejsFiles) {
    for (const currSourcePathname of ejsFiles) {
        // const currSourcePathname = ejsFiles[i]
        const currSourceDir = path_1.default.dirname(currSourcePathname);
        const currRelDir = path_1.default.relative(currSourceDir, currSourceDir);
        const currTargetDir = path_1.default.resolve(targetDir, currRelDir);
        const currSourceFilename = path_1.default.basename(currSourcePathname);
        const currTargetFilename = path_1.default.basename(currSourcePathname, path_1.default.extname(currSourcePathname)) +
            '.html';
        const currTargetPathname = path_1.default.resolve(currTargetDir, currTargetFilename);
        //console.log(currSourcePathname, '>>>', currTargetPathname);
        //
        await promises_1.default.mkdir(currTargetDir, { recursive: true });
        //
        const src = await promises_1.default.readFile(currSourcePathname, 'utf8');
        //
        const ejsOptions = Object.assign({}, ejsDefaultOptions, {
            root: currSourceDir,
            views: [currSourceDir],
            rmWhitespace: false, //!DEBUG,  <-- must be off to allow markdown indents to work
        });
        const ejsConfig = Object.assign({}, ejsDefaultConfig, {});
        let html = ejs_1.default.render(src, ejsConfig, ejsOptions);
        //console.log(html)
        //
        await promises_1.default.writeFile(currTargetPathname, html, 'utf8');
    }
}
exports.$ejsTemplates = $ejsTemplates;
exports.default = $ejsTemplates;
//# sourceMappingURL=$ejsTemplates.js.map