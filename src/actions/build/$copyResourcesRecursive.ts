/** @format */

import path from 'path';
import fs from 'fs/promises';
import {fn_check_params} from '../../apps/runner/lib/util';
import {ExecutorFn, Parameter, Parameters} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';
import {getFilesRecursive} from '../../lib/fileUtils/fileUtils';

export type CopyResourcesRecursiveActionConfig = {
  sourceDir: string;
  excludeDirs: string[];
  targetDir: string;
};

/**
 * @module $build
 */

/**
 * @name $copyResourcesRecursive
 */

export const $copyResourcesRecursive: ExecutorFn = async function (
  _,
  args,
  state
) {
  const {runner, logger} = state;
  fn_check_params(args, {exactCount: 1});

  const [pConfig] = args;

  const {
    sourceDir,
    excludeDirs: excludeDirs_,
    targetDir,
  } = pConfig as CopyResourcesRecursiveActionConfig;

  const excludeDirs = Array.isArray(excludeDirs_)
    ? excludeDirs_
    : [excludeDirs_];

  const pathnames = await getFilesRecursive(sourceDir, {
    extnames: [
      '.bmp',
      '.png',
      '.jpg',
      '.jpeg',
      '.webp',
      '.gif',
      '.svg',
      '.css',
      '.ttf',
      '.woff',
      '.woff2',
    ],
    excludeDirs,
  });

  for (let sourcePathname of pathnames) {
    const currSourceDir = path.dirname(sourcePathname);
    const currRelDir = path.relative(sourceDir, currSourceDir);
    const currTargetDir = path.resolve(targetDir, currRelDir);
    const sourceFilename = path.basename(sourcePathname);
    //const targetFilename = path.basename(sourcePathname, path.extname(sourcePathname)) + '.html';
    const targetFilename = sourceFilename; //path.basename(sourcePathname, path.extname(sourcePathname)) + '.html';
    const targetPathname = path.resolve(currTargetDir, targetFilename);
    //console.log(sourcePathname, '>>>', targetPathname);
    //
    await fs.mkdir(currTargetDir, {recursive: true});

    await fs.copyFile(sourcePathname, targetPathname);
  }
  logger.debug(`Copied ${pathnames.length} files`);
  return true;
};
