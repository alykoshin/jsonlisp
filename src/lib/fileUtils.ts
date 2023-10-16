/** @format */

import * as path from 'path';
import * as fs from 'fs/promises';
// import * as // import {PeggySyntaxError, parse} from './resources/lisp';
// import {PeggySyntaxError, parse} from './resources/grammar';
import * as mkdirp from 'mkdirp';
// import path from 'path';
// import path from 'path';

// import {PeggySyntaxError, parse} from './resources/lisp';
// import {PeggySyntaxError, parse} from './resources/grammar';

export function replace_extname(pathname: string, new_extname: string) {
  const old_extname = path.extname(pathname);
  const basename = path.basename(pathname, old_extname);
  const dirname = path.dirname(pathname);
  return path.join(dirname, basename + new_extname);
}

export async function readStringFile(inPathname: string): Promise<string> {
  return await fs.readFile(inPathname, {encoding: 'utf8'});
}

export async function writeStringFile(
  outPathname: string,
  content: string
): Promise<void> {
  await fs.writeFile(outPathname, content, {
    encoding: 'utf8',
  });
}

export async function readJsonFile(inPathname: string): Promise<any> {
  // return require(pathname);
  const s = await readStringFile(inPathname);
  console.log(`readJsonFile: s:`, s);
  try {
    return JSON.parse(s);
  } catch (e1) {
    throw new Error(`Unable to parse JSON from file "${inPathname}"`, {
      cause: e1,
    });
  }
}

export async function writeJsonFile(
  outPathname: string,
  data: any
): Promise<any> {
  await writeStringFile(outPathname, JSON.stringify(data, null, 2));
}

export function makePath(
  base: string,
  sub: string,
  filename: string,
  extname?: string
): string {
  if (extname) filename = replace_extname(filename, extname);
  const p = path.resolve(base, sub);
  mkdirp.sync(p);
  return path.resolve(p, filename);
}
