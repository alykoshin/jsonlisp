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
exports.zipDirectory = void 0;
const fs = __importStar(require("fs"));
const archiver_1 = __importDefault(require("archiver"));
const path_1 = __importDefault(require("path"));
/**
 * @param {String} sourceDir
 * @param {String} out
 * @returns {Promise}
 */
async function zipDirectory(sourceDir, out_dir, outBasename, lgr) {
    const archiver = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
    const outPathname = path_1.default.join(out_dir, outBasename + '.zip');
    const lambdaStream = fs.createWriteStream(outPathname);
    return new Promise((resolve, reject) => {
        archiver
            //.directory(source, false)
            .glob(sourceDir)
            .on('error', (err) => reject(err))
            // https://archiverjs.com/docs/global.html#EntryData
            .on('entry', (entryData) => {
            lgr.debug('>>> ', entryData.name);
        })
            .on('progress', (progressData) => {
            const { processed: pf, total: tf } = progressData.entries;
            const { processedBytes: pb, totalBytes: tb } = progressData.fs;
            lgr.debug(`>>> ${pf} of ${tf} files (${pb} of approx ${tb} bytes) `);
        })
            .on('close', () => lgr.log(`total bytes: ${archiver.pointer}`))
            .pipe(lambdaStream);
        lambdaStream.on('close', () => resolve(outPathname));
        archiver.finalize();
    });
}
exports.zipDirectory = zipDirectory;
//# sourceMappingURL=archiver.js.map