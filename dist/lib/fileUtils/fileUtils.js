"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFilenameDate = exports.absPathname = exports.ensureNoFile = exports.ensureFile = exports.fileCheckError = exports.iterateFiles = exports.cleanup = exports.getFilesRecursive = exports.removeDirRecursive = exports.isDirectory = exports.makePath = exports.replace_extname = void 0;
const path = __importStar(require("path"));
const mkdirp = __importStar(require("mkdirp"));
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const sanitize_1 = require("../sanitize");
function replace_extname(pathname, new_extname) {
    const old_extname = path.extname(pathname);
    const basename = path.basename(pathname, old_extname);
    const dirname = path.dirname(pathname);
    return path.join(dirname, basename + new_extname);
}
exports.replace_extname = replace_extname;
function makePath(base, sub, filename, extname) {
    if (extname)
        filename = replace_extname(filename, extname);
    const p = path.resolve(base, sub);
    mkdirp.sync(p);
    return path.resolve(p, filename);
}
exports.makePath = makePath;
function isDirectory(pathname) {
    try {
        return fs_1.default.statSync(pathname).isDirectory();
    }
    catch (e) {
        return false;
    }
}
exports.isDirectory = isDirectory;
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
                    ? excludeDirs.every((d) => path.resolve(startDir, d) !== path.resolve(dir, dirent.name))
                    : true)) ||
                (dirent.isFile() &&
                    (extnames
                        ? extnames.some((e) => dirent.name.endsWith(e))
                        : true)));
        })
            // .reduce((acc, dirent, currentIndex, array ) => {
            .map((dirent, currentIndex, array) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? _getFiles(res) : [res];
        });
        const files = await Promise.all(promises);
        return Array.prototype.concat(...files);
        // return files;
    }
    return _getFiles(startDir);
}
exports.getFilesRecursive = getFilesRecursive;
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
function absPathname(pathname) {
    if (!path.isAbsolute(pathname)) {
        const baseDir = process.cwd();
        pathname = path.join(baseDir, pathname);
    }
    return path.resolve(pathname);
}
exports.absPathname = absPathname;
function formatFilenameDate(date = new Date()) {
    return date.toISOString().replace(/[:T]/g, '-').replace(/\..+/, '');
}
exports.formatFilenameDate = formatFilenameDate;
//# sourceMappingURL=fileUtils.js.map