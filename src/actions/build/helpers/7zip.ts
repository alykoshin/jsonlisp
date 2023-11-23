/** @format */

import * as path from 'path';

import {execute} from '../../lisp-like/helpers/exec';
import $versionActions from '../../build/$version';
import {validateArgs} from '../../../apps/runner/lib/validateArgs';
import {ExecutorFn, Actions, Parameters} from '../../lisp-like/helpers/types';
import {State} from '../../../apps/runner/lib/state';
import {$zipOptions} from '../$zip';

// export type SevenZipOptions = {
// file_names: string[];
// // archive_prefix: string;
// out_dir: string;
// exclude_files: string[];
// };
export type SevenZipOptions = Omit<$zipOptions, 'archive_prefix'>;

// const DEFAULT_ZIP_EXE = "C:\\Program Files\\7-Zip\\7z.exe";
const DEFAULT_ZIP_EXE = '"c:/Program Files/7-Zip/7z.exe"';
const DEFAULT_EXTNAME = '.zip';

export const sevenZip = async function (
  archive_basename: string,
  options: SevenZipOptions,
  state: State
): Promise<string> {
  // const {runner, logger} = state;

  const {file_names, /* archive_prefix, */ out_dir, exclude_files} = options;

  if (!out_dir) throw new Error('out_dir is required');

  const archive_pathname = path.join(
    out_dir,
    archive_basename + DEFAULT_EXTNAME
  );

  const sFileNames = file_names.join(' ');

  // prettier-ignore
  const switches = [ 
    '-bb1', // -bb (Set output log level) switch -- show names of processed files in log.
    '-r', // Enable recurse subdirectories for item search.
    '-t' + 'zip', // -t (set Type of archive) switch
    ...exclude_files.map((f) => `-x!${f}`),
  ];
  // prettier-ignore
  const zip_args = [
    'a', //  a : Add files to archive
    ...switches,
    archive_pathname,
    sFileNames,
  ];

  const cmd_line = [DEFAULT_ZIP_EXE, ...zip_args].join(' ');

  const cmd_options = {
    // cwd: activity.base_dir,
  };

  const r = await execute(cmd_line, cmd_options, {state});
  return r.stdout;
};

// export const actions: Actions = {
// $zip: $zip,
// }

// export default actions
