import path from 'path';
import fs from 'fs/promises';
import {fn_check_params} from "../../lib/util";
import {
  ActionMethodState,
  Parameters,
} from "../../lib/runner";
import {getFilesRecursive} from '../../helpers/fsUtils'

export type CopyResourcesRecursiveActionConfig = {
  sourceDir: string,
  excludeDirs: string[],
  targetDir: string,
}
// export type CopyResourcesRecursiveAction = [
//   action: 'copyResourcesRecursive',
//   config: CopyResourcesRecursiveActionConfig
// ]

export async function copyResourcesRecursive(
  action: string,
  parameters: Parameters,
  {id, level, fullConfig, runner, logger}: ActionMethodState
) {
  fn_check_params(parameters, {exactCount: 1})
  const [pConfig] = parameters;

  const {sourceDir,excludeDirs: excludeDirs_, targetDir} = pConfig as CopyResourcesRecursiveActionConfig;

  const excludeDirs = Array.isArray(excludeDirs_) ? excludeDirs_ : [excludeDirs_];

  const pathnames = await getFilesRecursive(sourceDir, {
    extnames: ['.bmp', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.css', '.ttf', '.woff', '.woff2',],
    excludeDirs,
  })

  for (let sourcePathname of pathnames) {
    const currSourceDir = path.dirname(sourcePathname)
    const currRelDir = path.relative(sourceDir, currSourceDir)
    const currTargetDir = path.resolve(targetDir, currRelDir)
    const sourceFilename = path.basename(sourcePathname);
    //const targetFilename = path.basename(sourcePathname, path.extname(sourcePathname)) + '.html';
    const targetFilename = sourceFilename;//path.basename(sourcePathname, path.extname(sourcePathname)) + '.html';
    const targetPathname = path.resolve(currTargetDir, targetFilename);
    //console.log(sourcePathname, '>>>', targetPathname);
    //
    await fs.mkdir(currTargetDir, {recursive: true})

    await fs.copyFile(sourcePathname, targetPathname);
  }
  logger.debug(`Copied ${pathnames.length} files`)
}

