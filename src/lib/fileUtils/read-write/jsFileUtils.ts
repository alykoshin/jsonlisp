/** @format */

import {writeTextFile} from './textFileUtils';
import {readTsFile} from './tsFileUtils';

export const readJs = async (pathname: string): Promise<any> => {
  return await readTsFile(pathname);
};

export const writeJsFile = async (
  pathname: string,
  data: any
): Promise<void> => {
  const content = JSON.stringify(data, null, 2);

  const prefix = `
const {FullConfig} = require("./src/lib/config");

export const config = `;

  const suffix = `;

module.exports = config;
`;

  const fullContent = prefix + content + suffix;
  return await writeTextFile(pathname, fullContent);
};
