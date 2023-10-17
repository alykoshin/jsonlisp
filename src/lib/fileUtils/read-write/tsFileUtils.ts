/** @format */

import {writeTextFile} from './textFileUtils';

export const readTsFile = async (pathname: string): Promise<any> => {
  console.log(`Importing file "${pathname}"`);
  const data = (await import(pathname)).default;
  return data;
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

  throw new Error('This may overwrite .ts file!');

  return await writeTextFile(pathname, fullContent);
};
