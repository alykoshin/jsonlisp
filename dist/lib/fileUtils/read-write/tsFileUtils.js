"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTsFile = exports.readTsFile = void 0;
const node_url_1 = __importDefault(require("node:url"));
const textFileUtils_1 = require("./textFileUtils");
const readTsFile = async (pathname) => {
    console.log(`Importing file "${pathname}"`);
    /**
     * Fix for error:
     *
     * Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only URLs with a scheme in: file, data, and node are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'd:'
     *
     * https://github.com/nodejs/node/issues/31710
     */
    const urlPathname = node_url_1.default.pathToFileURL(pathname).href;
    //
    //
    const mod = await import(urlPathname);
    //
    // After moving to Node 18 and fix windows path to ULR (see above)
    // import started to return the object with two (!) defaults
    //
    const d1 = mod.default;
    if (!d1)
        throw new Error(`No 1st default export found in "${pathname}"`);
    const d2 = d1.default;
    if (!d2)
        throw new Error(`No 2nd default export found in "${pathname}"`);
    // const data = await import(urlPathname).default;
    //
    return d2;
};
exports.readTsFile = readTsFile;
const writeTsFile = async (pathname, data) => {
    const content = JSON.stringify(data, null, 2);
    const prefix = `
import {FullConfig} from "./src/lib/config";

export const config: FullConfig = `;
    const suffix = `;

export default config;
`;
    const fullContent = prefix + content + suffix;
    return await (0, textFileUtils_1.writeTextFile)(pathname, fullContent);
};
exports.writeTsFile = writeTsFile;
//# sourceMappingURL=tsFileUtils.js.map