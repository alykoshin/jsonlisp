"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureNoFile = exports.ensureFile = exports.fileCheckError = exports.iterateFiles = exports.cleanup = exports.writeTextFile = void 0;
const fs = __importStar(require("fs"));
const fsPromises = __importStar(require("fs/promises"));
const sanitize_1 = require("../sanitize");
const writeTextFile = async (fname, text, encoding = 'utf8') => {
    process.stdout.write(`\n* Writing file ${fname}... `);
    await fsPromises.writeFile(fname, text, { encoding });
    process.stdout.write(`Done\n`);
    return await ensureFile(fname);
};
exports.writeTextFile = writeTextFile;
const cleanup = async (title, filenames) => {
    filenames = (0, sanitize_1.sanitizeArray)(filenames);
    if (filenames.length > 0)
        process.stdout.write(`\n* ${title} `);
    filenames.forEach(fname => {
        fs.unlinkSync(fname);
        process.stdout.write(`${fname} `);
    });
    process.stdout.write(`Done.`);
    return await ensureNoFile(filenames);
};
exports.cleanup = cleanup;
const iterateFiles = (filenames, title, fn) => {
    filenames = (0, sanitize_1.sanitizeArray)(filenames);
    if (filenames.length > 0)
        process.stdout.write(title);
    filenames.forEach(fname => {
        process.stdout.write(`"${fname}" `);
        fn(fname);
    });
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
    (0, exports.iterateFiles)(filenames, `* Checking files exist... `, fname => {
        const fd = fs.openSync(fname, 'r');
        const stats = fs.fstatSync(fd);
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
    (0, exports.iterateFiles)(filenames, `* Checking file doesn't exist... `, fname => {
        if (!fs.existsSync(fname)) {
            console.log(`[Not exists]`);
            return fname;
        }
        else {
            return (0, exports.fileCheckError)(fname);
        }
    });
}
exports.ensureNoFile = ensureNoFile;
//# sourceMappingURL=files.js.map