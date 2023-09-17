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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipDirectory = void 0;
const fs = __importStar(require("fs"));
const archiver_1 = __importDefault(require("archiver"));
/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
async function zipDirectory(source, out) {
    const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
    const lambdaStream = fs.createWriteStream(out);
    return new Promise((resolve, reject) => {
        archive
            //.directory(source, false)
            .glob(source)
            .on('error', err => reject(err))
            // https://archiverjs.com/docs/global.html#EntryData
            .on('entry', entryData => {
            console.log('>>> ', entryData.name);
        })
            .on('progress', progressData => {
            console.log(`>>> ${progressData.entries.processed} of ${progressData.entries.total} files (${progressData.fs.processedBytes} of approx ${progressData.fs.totalBytes} bytes) `);
        })
            .on('close', () => console.log(`total bytes: ${archive.pointer}`))
            .pipe(lambdaStream);
        lambdaStream.on('close', () => resolve(undefined));
        archive.finalize();
    });
}
exports.zipDirectory = zipDirectory;
//# sourceMappingURL=archiving.js.map