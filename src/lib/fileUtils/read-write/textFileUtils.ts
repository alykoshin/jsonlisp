/** @format */

import * as fs from 'fs/promises';
import fsPromises from 'fs/promises';
import {readFileSync} from 'fs';
// import {ensureFile} from './fileUtils';

//

export async function readTextFile(
  pathname: string,
  encoding: BufferEncoding = 'utf8'
): Promise<string> {
  return await fs.readFile(pathname, {encoding});
}

/** Sync variant — for module-load-time reads (no top-level await in CJS). */
export function readTextFileSync(
  pathname: string,
  encoding: BufferEncoding = 'utf8'
): string {
  return readFileSync(pathname, {encoding});
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
