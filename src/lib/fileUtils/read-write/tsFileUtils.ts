/** @format */

import url from 'node:url';

import {writeTextFile} from './textFileUtils';

export const readTsFile = async (pathname: string): Promise<any> => {
  console.log(`Importing file "${pathname}"`);

  /**
   * Fix for error:
   *
   * Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only URLs with a scheme in: file, data, and node are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'd:'
   *
   * https://github.com/nodejs/node/issues/31710
   */
  const urlPathname = url.pathToFileURL(pathname).href;
  //

  //
  const mod = await import(urlPathname);

  //
  // After moving to Node 18 and fix windows path to ULR (see above)
  // import started to return the object with two (!) defaults
  //
  const d1 = mod.default;
  if (!d1) throw new Error(`No 1st default export found in "${pathname}"`);
  const d2 = d1.default;
  if (!d2) throw new Error(`No 2nd default export found in "${pathname}"`);
  // const data = await import(urlPathname).default;
  //

  return d2;
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
