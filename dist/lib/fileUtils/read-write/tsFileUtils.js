"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTsFile = exports.readTsFile = void 0;
const textFileUtils_1 = require("./textFileUtils");
const readTsFile = async (pathname) => {
    console.log(`Importing file "${pathname}"`);
    const data = (await import(pathname)).default;
    return data;
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