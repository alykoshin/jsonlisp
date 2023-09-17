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
exports.getWrapperForFile = exports.saveJson = exports.saveString = exports.mkdir = exports.cleanup = exports.debug = exports.log = exports.warn = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
const warn = (...args) => console.warn(`[WARN]`, ...args);
exports.warn = warn;
const log = (...args) => console.log(`[LOG]`, ...args);
exports.log = log;
const debug = (...args) => {
    // console.log(`[DEBUG]`, ...args);
};
exports.debug = debug;
async function cleanup(dir) {
    try {
        if (!(await fs.stat(dir)).isDirectory()) {
            throw new Error('Not a directory');
        }
    }
    catch (e) {
        (0, exports.warn)(`cleanup(): Directory "${dir}" does not exist or not a directory.`);
        return;
    }
    return fs.rm(dir, { recursive: true });
}
exports.cleanup = cleanup;
async function mkdir(dir) {
    return await fs.mkdir(dir, { recursive: true });
}
exports.mkdir = mkdir;
async function saveString(dir, filename, s, debugId) {
    const outPathname = path.resolve(dir, filename);
    await mkdir(dir);
    await fs.writeFile(outPathname, s, { encoding: 'utf-8' });
    (0, exports.log)((debugId ? `[${debugId}] ` : '') + `Saved ${s.length} characters to "${outPathname}"`);
}
exports.saveString = saveString;
async function saveJson(dir, filename, json, debugId) {
    const s = JSON.stringify(json, null, 2);
    return saveString(dir, filename, s, debugId);
}
exports.saveJson = saveJson;
function getWrapperForFile({ data, url }) {
    return {
        meta: {
            description: [
                `This file contains ${data.description}`,
                `automatically generated from following "${url}"`,
                `Do not edit it by hand.`,
            ]
        },
        data: data.codes,
    };
}
exports.getWrapperForFile = getWrapperForFile;
//# sourceMappingURL=utils.js.map