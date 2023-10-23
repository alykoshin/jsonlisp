"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJsFile = exports.readJs = void 0;
const textFileUtils_1 = require("./textFileUtils");
const tsFileUtils_1 = require("./tsFileUtils");
const readJs = async (pathname) => {
    return await (0, tsFileUtils_1.readTsFile)(pathname);
};
exports.readJs = readJs;
const writeJsFile = async (pathname, data) => {
    const content = JSON.stringify(data, null, 2);
    const prefix = `
const {FullConfig} = require("./src/lib/config");

export const config = `;
    const suffix = `;

module.exports = config;
`;
    const fullContent = prefix + content + suffix;
    return await (0, textFileUtils_1.writeTextFile)(pathname, fullContent);
};
exports.writeJsFile = writeJsFile;
//# sourceMappingURL=jsFileUtils.js.map