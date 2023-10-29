/** @format */

import json5 from 'json5';
import {readTextFile, writeTextFile} from './textFileUtils';

export const readJson5 = async (pathname: string): Promise<any> => {
  // console.log(`Reading and parsing file "${pathname}"`);
  const content = await readTextFile(pathname);
  return json5.parse(content);
};

export const writeJson5 = async (
  pathname: string,
  data: any
): Promise<void> => {
  const content = json5.stringify(data, null, 2);
  await writeTextFile(pathname, content);
};
