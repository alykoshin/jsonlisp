"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesRecursive = exports.removeDirRecursive = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const promises_2 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function removeDirRecursive(dirname) {
    return promises_1.default.rm(dirname, { recursive: true })
        .catch(e => {
        if (e.code !== 'ENOENT')
            throw e; // be silent if dir doesn't exists
    });
}
exports.removeDirRecursive = removeDirRecursive;
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
exports.getFilesRecursive = getFilesRecursive;
//# sourceMappingURL=fsUtils.js.map