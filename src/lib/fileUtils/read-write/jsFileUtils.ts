/** @format */

import {readTsFile} from './tsFileUtils';

export const readJs = async (pathname: string): Promise<any> => {
  return await readTsFile(pathname);
};
