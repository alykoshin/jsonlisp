/** @format */

import * as fs from 'fs/promises';
import fsPromises from 'fs/promises';
// import {ensureFile} from './fileUtils';

//

export async function readTextFile(
  pathname: string,
  encoding: BufferEncoding = 'utf8'
): Promise<string> {
  return await fs.readFile(pathname, {encoding});
}

// export async function writeTextFile(
// outPathname: string,
// content: string
// ): Promise<void> {
// await fs.writeFile(outPathname, content, {
// encoding: 'utf8',
// });
// }

export const writeTextFile = async (
  pathname: string,
  content: string,
  encoding: BufferEncoding = 'utf8'
) => {
  process.stdout.write(`\n* Writing file ${pathname}... `);
  await fsPromises.writeFile(pathname, content, {encoding});
  process.stdout.write(`Done\n`);
  // await ensureFile(pathname);
};
