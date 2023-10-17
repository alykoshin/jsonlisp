/** @format */

import {readTextFile, writeTextFile} from './textFileUtils';

//
// export const readJsonFile = async (pathname: string): Promise<any> => {
// console.log(`Reading and parsing file "${pathname}"`);
// const content = await readTextFile(pathname);
// return JSON.parse(content);
// };

export async function readJsonFile(pathname: string): Promise<any> {
  console.log(`Reading and parsing file "${pathname}"`);
  // return require(pathname);
  const s = await readTextFile(pathname);
  // console.log(`readJsonFile: s:`, s);
  try {
    return JSON.parse(s);
  } catch (e1) {
    throw new Error(`Unable to parse JSON from file "${pathname}"`, {
      cause: e1,
    });
  }
}

export const writeJsonFile = async (
  pathname: string,
  data: any
): Promise<void> => {
  const content = JSON.stringify(data, null, 2);
  await writeTextFile(pathname, content);
};

// export async function writeJsonFile(
//   pathname: string,
//   data: any
// ): Promise<any> {
//   await writeTextFile(pathname, JSON.stringify(data, null, 2));
// }
