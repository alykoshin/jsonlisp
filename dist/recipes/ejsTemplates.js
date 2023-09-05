"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_ejsTemplates = void 0;
//(async function run() {
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const ejs_1 = __importDefault(require("ejs"));
const fsUtils_1 = require("../lib/fsUtils");
const DEBUG = false;
async function action_ejsTemplates(definition, { id, fullConfig, runner }) {
    const excludeDirs = Array.isArray(definition.excludeDirs) ? definition.excludeDirs : [definition.excludeDirs];
    const PROJECT_ROOT_DIR = '.';
    //const ejsDefaultConfig = require(path.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'));
    //const ejsDefaultConfig = await import(path.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'), { assert: { type: "json" } });
    const ejsDefaultConfig = await promises_1.default.readFile(path_1.default.resolve(PROJECT_ROOT_DIR, 'ejs-defaults.json'), { encoding: 'utf8' }).then(JSON.parse);
    const ejsDefaultOptions = {
        root: PROJECT_ROOT_DIR,
        rmWhitespace: !DEBUG,
    };
    const ejsFiles = await (0, fsUtils_1.getFilesRecursive)(definition.sourceDir, {
        extnames: '.ejs',
        excludeDirs,
    });
    //const ejsFiles = [
    //  'D:\\teach\\05. МИСиС. 1.01. Веб-разработка\\presentations2\\src\\00-contents\\index.ejs',
    //  ]
    //console.log(ejsFiles)
    // for (let i in ejsFiles) {
    for (const sourcePathname of ejsFiles) {
        // const sourcePathname = ejsFiles[i]
        const sourceDir = path_1.default.dirname(sourcePathname);
        const relDir = path_1.default.relative(definition.sourceDir, sourceDir);
        const targetDir = path_1.default.resolve(definition.targetDir, relDir);
        const sourceFilename = path_1.default.basename(sourcePathname);
        const targetFilename = path_1.default.basename(sourcePathname, path_1.default.extname(sourcePathname)) + '.html';
        const targetPathname = path_1.default.resolve(targetDir, targetFilename);
        //console.log(sourcePathname, '>>>', targetPathname);
        //
        await promises_1.default.mkdir(targetDir, { recursive: true });
        //
        const src = await promises_1.default.readFile(sourcePathname, 'utf8');
        //
        const ejsOptions = Object.assign({}, ejsDefaultOptions, {
            root: definition.sourceDir,
            views: [sourceDir],
            rmWhitespace: false, //!DEBUG,  <-- must be off to allow markdown indents to work
        });
        const ejsConfig = Object.assign({}, ejsDefaultConfig, {});
        let html = ejs_1.default.render(src, ejsConfig, ejsOptions);
        //console.log(html)
        //
        await promises_1.default
            .writeFile(targetPathname, html, 'utf8');
    }
}
exports.action_ejsTemplates = action_ejsTemplates;
//# sourceMappingURL=ejsTemplates.js.map