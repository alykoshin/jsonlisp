"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJson5 = exports.readJson5 = void 0;
const json5_1 = __importDefault(require("json5"));
const textFileUtils_1 = require("./textFileUtils");
const readJson5 = async (pathname) => {
    // console.log(`Reading and parsing file "${pathname}"`);
    const content = await (0, textFileUtils_1.readTextFile)(pathname);
    return json5_1.default.parse(content);
};
exports.readJson5 = readJson5;
const writeJson5 = async (pathname, data) => {
    const content = json5_1.default.stringify(data, null, 2);
    await (0, textFileUtils_1.writeTextFile)(pathname, content);
};
exports.writeJson5 = writeJson5;
//# sourceMappingURL=json5FileUtils.js.map