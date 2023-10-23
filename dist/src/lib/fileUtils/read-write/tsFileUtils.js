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
exports.writeTsFile = exports.readTsFile = void 0;
const textFileUtils_1 = require("./textFileUtils");
const readTsFile = async (pathname) => {
    console.log(`Importing file "${pathname}"`);
    const data = (await Promise.resolve(`${pathname}`).then(s => __importStar(require(s)))).default;
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