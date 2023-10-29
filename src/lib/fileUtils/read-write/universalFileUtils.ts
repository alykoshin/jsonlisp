/** @format */

import {existsSync} from 'node:fs';
import * as path from 'path';

import {readTsFile, writeTsFile} from './tsFileUtils';
import {readJs, writeJsFile} from './jsFileUtils';
import {readJson5, writeJson5} from './json5FileUtils';
import {readJsonFile, writeJsonFile} from './jsonFileUtils';
import {isDirectory} from '../fileUtils';

export const readUniversal = async (pathname?: string): Promise<any> => {
  if (!pathname) throw new Error('Pathname expected');

  const extname = path.extname(pathname);
  // const baseDir = process.cwd()
  // let pathname = buildPathname(pathname);
  switch (extname) {
    case '.ts':
      return readTsFile(pathname);
    case '.js':
      return readJs(pathname);
    case '.json':
      return readJsonFile(pathname);
    case '.json5':
      return readJson5(pathname);
    default:
      throw new Error(`Unsupported file extension "${pathname}"`);
  }
};

export function writeUniversal(pathname: string, data: any) {
  const extname = path.extname(pathname);
  // const baseDir = process.cwd();
  // const pathname = path.resolve(baseDir, config_file)
  // const pathname = buildPathname(pathname);
  switch (extname) {
    case '.ts':
      return writeTsFile(pathname, data);
    case '.js':
      return writeJsFile(pathname, data);
    case '.json':
      return writeJsonFile(pathname, data);
    case '.json5':
      return writeJson5(pathname, data);
    default:
      throw new Error(`Unsupported file extension "${pathname}"`);
  }
}
const SUPPORTED_EXTENSIONS = ['.ts', '.js', '.json', '.json5'];
const INDEX_FILE_BASENAME = 'index';

export const resolveToFile = (pathname: string): string => {
  // let pathname = buildPathname(fname)
  let extname = path.extname(pathname);
  if (!extname) {
    /**
     * look for 'index' file if the path to directory was passed
     */
    if (isDirectory(pathname)) {
      pathname = path.join(pathname, INDEX_FILE_BASENAME);
      // console.log(`Directory was passed; will look for 'index' file "${pathname}"`)
    }
    // console.log(`Will look for pathname "${pathname}"`)
    /**
     * try all supported extensions
     */
    for (const ext of SUPPORTED_EXTENSIONS) {
      if (existsSync(pathname + ext)) {
        extname = ext;
        break;
      }
    }

    if (!extname) {
      const exts = SUPPORTED_EXTENSIONS.join('|');
      const msg = `Unable to find source file with any of ${exts} extnames`;
      throw new Error(msg);
    }
    pathname = pathname + extname;
  }
  // console.log(`Will process as "${extname}", Final pathname: "${pathname}"`);
  return pathname;
};
