"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_copyResourcesRecursive = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const promises_2 = __importDefault(require("fs/promises"));
async function getFilesRecursive(startDir, { extnames, excludeDirs }) {
    if (extnames && !Array.isArray(extnames))
        extnames = [extnames];
    if (excludeDirs && !Array.isArray(excludeDirs))
        excludeDirs = [excludeDirs];
    async function _getFiles(dir) {
        const dirents = await promises_2.default.readdir(dir, { withFileTypes: true });
        const promises = dirents
            .filter((dirent) => {
            return (dirent.isDirectory() && (excludeDirs ? excludeDirs.every((d) => path_1.default.resolve(startDir, d) !== path_1.default.resolve(dir, dirent.name)) : true) || (dirent.isFile() && (extnames ? extnames.some((e) => dirent.name.endsWith(e)) : true)));
        })
            // .reduce((acc, dirent, currentIndex, array ) => {
            .map((dirent, currentIndex, array) => {
            const res = path_1.default.resolve(dir, dirent.name);
            return dirent.isDirectory() ? _getFiles(res) : [res];
        });
        const files = await Promise.all(promises);
        return Array.prototype.concat(...files);
        // return files;
    }
    return _getFiles(startDir);
}
async function action_copyResourcesRecursive(definition, { id, fullConfig, runner }) {
    const pathnames = await getFilesRecursive(definition.sourceDir, {
        extnames: ['.bmp', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.css', '.ttf', '.woff', '.woff2',],
        excludeDirs: definition.excludeDirs,
    });
    for (let sourcePathname of pathnames) {
        const sourceDir = path_1.default.dirname(sourcePathname);
        const relDir = path_1.default.relative(definition.sourceDir, sourceDir);
        const targetDir = path_1.default.resolve(definition.targetDir, relDir);
        const sourceFilename = path_1.default.basename(sourcePathname);
        //const targetFilename = path.basename(sourcePathname, path.extname(sourcePathname)) + '.html';
        const targetFilename = sourceFilename; //path.basename(sourcePathname, path.extname(sourcePathname)) + '.html';
        const targetPathname = path_1.default.resolve(targetDir, targetFilename);
        //console.log(sourcePathname, '>>>', targetPathname);
        //
        await promises_1.default.mkdir(targetDir, { recursive: true });
        await promises_1.default.copyFile(sourcePathname, targetPathname);
    }
    runner.debug(id, `Copied ${pathnames.length} files`);
}
exports.action_copyResourcesRecursive = action_copyResourcesRecursive;
//# sourceMappingURL=copyResourcesRecursive.js.map