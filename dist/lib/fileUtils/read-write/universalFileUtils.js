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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveToFile = exports.writeUniversal = exports.readUniversal = void 0;
const node_fs_1 = require("node:fs");
const path = __importStar(require("path"));
const tsFileUtils_1 = require("./tsFileUtils");
const jsFileUtils_1 = require("./jsFileUtils");
const json5FileUtils_1 = require("./json5FileUtils");
const jsonFileUtils_1 = require("./jsonFileUtils");
const fileUtils_1 = require("../fileUtils");
const readUniversal = async (pathname) => {
    if (!pathname)
        throw new Error('Pathname expected');
    const extname = path.extname(pathname);
    // const baseDir = process.cwd()
    // let pathname = buildPathname(pathname);
    switch (extname) {
        case '.ts':
            return (0, tsFileUtils_1.readTsFile)(pathname);
        case '.js':
            return (0, jsFileUtils_1.readJs)(pathname);
        case '.json':
            return (0, jsonFileUtils_1.readJsonFile)(pathname);
        case '.json5':
            return (0, json5FileUtils_1.readJson5)(pathname);
        default:
            throw new Error(`Unsupported file extension "${pathname}"`);
    }
};
exports.readUniversal = readUniversal;
function writeUniversal(pathname, data) {
    const extname = path.extname(pathname);
    // const baseDir = process.cwd();
    // const pathname = path.resolve(baseDir, config_file)
    // const pathname = buildPathname(pathname);
    switch (extname) {
        case '.ts':
            return (0, tsFileUtils_1.writeTsFile)(pathname, data);
        case '.js':
            return (0, jsFileUtils_1.writeJsFile)(pathname, data);
        case '.json':
            return (0, jsonFileUtils_1.writeJsonFile)(pathname, data);
        case '.json5':
            return (0, json5FileUtils_1.writeJson5)(pathname, data);
        default:
            throw new Error(`Unsupported file extension "${pathname}"`);
    }
}
exports.writeUniversal = writeUniversal;
const SUPPORTED_EXTENSIONS = ['.ts', '.js', '.json', '.json5'];
const INDEX_FILE_BASENAME = 'index';
const resolveToFile = (pathname) => {
    // let pathname = buildPathname(fname)
    let extname = path.extname(pathname);
    if (!extname) {
        /**
         * look for 'index' file if the path to directory was passed
         */
        if ((0, fileUtils_1.isDirectory)(pathname)) {
            pathname = path.join(pathname, INDEX_FILE_BASENAME);
            // console.log(`Directory was passed; will look for 'index' file "${pathname}"`)
        }
        // console.log(`Will look for pathname "${pathname}"`)
        /**
         * try all supported extensions
         */
        for (const ext of SUPPORTED_EXTENSIONS) {
            if ((0, node_fs_1.existsSync)(pathname + ext)) {
                extname = ext;
                break;
            }
        }
        if (!extname) {
            const exts = SUPPORTED_EXTENSIONS.join('|');
            const msg = `Unable to find source file with any of ${exts} extnames`;
            throw new Error(msg);
        }
        pathname = pathname + extname;
    }
    // console.log(`Will process as "${extname}", Final pathname: "${pathname}"`);
    return pathname;
};
exports.resolveToFile = resolveToFile;
//# sourceMappingURL=universalFileUtils.js.map