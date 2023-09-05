import path from 'path';
import fs from 'fs/promises';
import {FullConfig} from "../lib/config";
import {Runner} from "../lib/runner";
import fsPromises from "fs/promises";

async function getFilesRecursive(startDir: string, {extnames, excludeDirs}: {
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


export interface CopyResourcesRecursiveAction {
  action: 'copyResourcesRecursive'
  sourceDir: string
  excludeDirs: string[]
  targetDir: string
}

export async function action_copyResourcesRecursive(
  definition: CopyResourcesRecursiveAction,
  {id, fullConfig, runner}: { id: number | string, fullConfig: FullConfig, runner: Runner }
) {

  const pathnames = await getFilesRecursive(definition.sourceDir, {
    extnames: ['.bmp', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.css', '.ttf', '.woff', '.woff2',],
    excludeDirs: definition.excludeDirs,
  })

  for (let sourcePathname of pathnames) {
    const sourceDir = path.dirname(sourcePathname)
    const relDir = path.relative(definition.sourceDir, sourceDir)
    const targetDir = path.resolve(definition.targetDir, relDir)
    const sourceFilename = path.basename(sourcePathname);
    //const targetFilename = path.basename(sourcePathname, path.extname(sourcePathname)) + '.html';
    const targetFilename = sourceFilename;//path.basename(sourcePathname, path.extname(sourcePathname)) + '.html';
    const targetPathname = path.resolve(targetDir, targetFilename);
    //console.log(sourcePathname, '>>>', targetPathname);
    //
    await fs.mkdir(targetDir, {recursive: true})

    await fs.copyFile(sourcePathname, targetPathname);
  }
  runner.debug(id, `Copied ${pathnames.length} files`)
}

