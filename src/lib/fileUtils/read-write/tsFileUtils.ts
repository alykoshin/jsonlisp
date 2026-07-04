/** @format */

import url from 'node:url';

import {writeTextFile} from './textFileUtils';

export const readTsFile = async (pathname: string): Promise<any> => {
  console.log(`Importing file "${pathname}"`);

  let mod: any;
  try {
    /**
     * Under ts-node in CommonJS mode the require hook compiles .ts on the
     * fly. Dynamic import() cannot be used here: with module=node16 it is
     * preserved as a real ESM import and escapes the ts-node hook
     * (ERR_UNKNOWN_FILE_EXTENSION for .ts).
     */
    mod = require(pathname);
  } catch (e) {
    /**
     * ESM context fallback. file:// URL is required on Windows:
     * https://github.com/nodejs/node/issues/31710
     */
    const urlPathname = url.pathToFileURL(pathname).href;
    mod = await import(urlPathname);
  }

  /**
   * Unwrap default export(s): CJS require of a TS module yields
   * {default: X}; the historical ESM path yielded {default: {default: X}}.
   * Activity objects themselves have no top-level `default` key, so the
   * unwrap loop stops at the right place.
   */
  let d: any = mod;
  while (d && typeof d === 'object' && 'default' in d && d.default !== d) {
    d = d.default;
  }
  if (!d) throw new Error(`No default export found in "${pathname}"`);

  return d;
};

export const writeTsFile = async (
  pathname: string,
  data: any
): Promise<void> => {
  const content = JSON.stringify(data, null, 2);

  const prefix = `
import {FullConfig} from "./src/lib/config";

export const config: FullConfig = `;

  const suffix = `;

export default config;
`;

  const fullContent = prefix + content + suffix;
  return await writeTextFile(pathname, fullContent);
};
