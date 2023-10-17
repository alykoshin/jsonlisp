"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureNoFile = exports.ensureFile = exports.fileCheckError = exports.iterateFiles = exports.cleanup = exports.writeTextFile = exports.getFilesRecursive = exports.removeDirRecursive = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const sanitize_1 = require("../../../lib/sanitize");
async function removeDirRecursive(dirname) {
    return promises_1.default.rm(dirname, { recursive: true }).catch((e) => {
        if (e.code !== 'ENOENT')
            throw e; // be silent if dir doesn't exists
    });
}
exports.removeDirRecursive = removeDirRecursive;
async function getFilesRecursive(startDir, options) {
    // if (extnames && !Array.isArray(extnames)) extnames = [extnames];
    const extnames = typeof options.extnames !== 'undefined' && !Array.isArray(options.extnames)
        ? [options.extnames]
        : options.extnames;
    // if (excludeDirs && !Array.isArray(excludeDirs)) excludeDirs = [excludeDirs];
    const excludeDirs = typeof options.excludeDirs !== 'undefined' &&
        !Array.isArray(options.excludeDirs)
        ? [options.excludeDirs]
        : options.excludeDirs;
    async function _getFiles(dir) {
        const dirents = await promises_1.default.readdir(dir, { withFileTypes: true });
        const promises = dirents
            .filter((dirent) => {
            return ((dirent.isDirectory() &&
                (excludeDirs
                    ? excludeDirs.every((d) => path_1.default.resolve(startDir, d) !== path_1.default.resolve(dir, dirent.name))
                    : true)) ||
                (dirent.isFile() &&
                    (extnames
                        ? extnames.some((e) => dirent.name.endsWith(e))
                        : true)));
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
const writeTextFile = async (fname, text, encoding = 'utf8') => {
    process.stdout.write(`\n* Writing file ${fname}... `);
    await promises_1.default.writeFile(fname, text, { encoding });
    process.stdout.write(`Done\n`);
    return await ensureFile(fname);
};
exports.writeTextFile = writeTextFile;
const cleanup = async (title, filenames_) => {
    const filenames = (0, sanitize_1.sanitizeArray)(filenames_);
    if (filenames.length > 0)
        process.stdout.write(`\n* ${title} `);
    filenames.forEach((fname) => {
        fs_1.default.unlinkSync(fname);
        process.stdout.write(`${fname} `);
    });
    process.stdout.write(`Done.`);
    return await ensureNoFile(filenames);
};
exports.cleanup = cleanup;
const iterateFiles = async (filenames, title, fn) => {
    filenames = (0, sanitize_1.sanitizeArray)(filenames);
    if (filenames.length > 0)
        process.stdout.write(title);
    const result = [];
    for (const fname of filenames) {
        process.stdout.write(`"${fname}" `);
        await fn(fname);
        result.push(fname);
    }
    return result;
};
exports.iterateFiles = iterateFiles;
const fileCheckError = (fname, moreData) => {
    const msg = `Error checking file "${fname}"`;
    if (moreData)
        console.error(msg, moreData);
    else
        console.error(msg);
    throw new Error(msg);
};
exports.fileCheckError = fileCheckError;
async function ensureFile(filenames) {
    if (!Array.isArray(filenames))
        filenames = [filenames];
    return (0, exports.iterateFiles)(filenames, `* Checking files exist... `, async (fname) => {
        const fd = fs_1.default.openSync(fname, 'r');
        const stats = fs_1.default.fstatSync(fd);
        if (stats.isFile() && stats.size > 0) {
            console.log(`[${stats.size} bytes] `);
            return fname;
        }
        else {
            return (0, exports.fileCheckError)(fname, stats);
        }
    });
}
exports.ensureFile = ensureFile;
async function ensureNoFile(filenames) {
    if (!Array.isArray(filenames))
        filenames = [filenames];
    return (0, exports.iterateFiles)(filenames, `* Checking file doesn't exist... `, async (fname) => {
        if (!fs_1.default.existsSync(fname)) {
            console.log(`[Not exists]`);
            return fname;
        }
        else {
            return (0, exports.fileCheckError)(fname);
        }
    });
}
exports.ensureNoFile = ensureNoFile;
//# sourceMappingURL=fsUtils.js.map