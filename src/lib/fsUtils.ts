import fs from "fs/promises";
import fsPromises from "fs/promises";
import path from "path";

export async function removeDirRecursive(dirname: string) {
  return fs.rm(dirname, {recursive: true})
    .catch(e => {
      if (e.code !== 'ENOENT') throw e; // be silent if dir doesn't exists
    });
}


export async function getFilesRecursive(startDir: string, {extnames, excludeDirs}: {
  extnames: string[],
  excludeDirs: string[]
}): Promise<string[]> {
  if (extnames && !Array.isArray(extnames)) extnames = [extnames];
  if (excludeDirs && !Array.isArray(excludeDirs)) excludeDirs = [excludeDirs];

  async function _getFiles(dir: string): Promise<string[]> {
    const dirents = await fsPromises.readdir(dir, {withFileTypes: true});
    const promises = dirents
      .filter((dirent) => {
        return (dirent.isDirectory() && (excludeDirs ? excludeDirs.every((d: string) => path.resolve(startDir, d) !== path.resolve(dir, dirent.name)) : true) || (dirent.isFile() && (extnames ? extnames.some((e: string) => dirent.name.endsWith(e)) : true)))
      })
      // .reduce((acc, dirent, currentIndex, array ) => {
      .map((dirent, currentIndex, array ) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? _getFiles(res) : [res];
      })
    ;
    const files: string[][] = await Promise.all(promises);
    return Array.prototype.concat(...files);
    // return files;
  }

  return _getFiles(startDir)
}

