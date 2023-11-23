"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJsonFile = exports.readJsonFile = void 0;
const textFileUtils_1 = require("./textFileUtils");
//
// export const readJsonFile = async (pathname: string): Promise<any> => {
// console.log(`Reading and parsing file "${pathname}"`);
// const content = await readTextFile(pathname);
// return JSON.parse(content);
// };
async function readJsonFile(pathname) {
    // console.log(`Reading and parsing file "${pathname}"`);
    // return require(pathname);
    const s = await (0, textFileUtils_1.readTextFile)(pathname);
    // console.log(`readJsonFile: s:`, s);
    try {
        return JSON.parse(s);
    }
    catch (e1) {
        throw new Error(`Unable to parse JSON from file "${pathname}"`, {
            cause: e1,
        });
    }
}
exports.readJsonFile = readJsonFile;
const writeJsonFile = async (pathname, data) => {
    const content = JSON.stringify(data, null, 2);
    await (0, textFileUtils_1.writeTextFile)(pathname, content);
};
exports.writeJsonFile = writeJsonFile;
// export async function writeJsonFile(
//   pathname: string,
//   data: any
// ): Promise<any> {
//   await writeTextFile(pathname, JSON.stringify(data, null, 2));
// }
//# sourceMappingURL=jsonFileUtils.js.map