/** @format */

import * as path from 'path';

import {execute} from '../../lisp-like/helpers/exec';
import $versionActions from '../../build/$version';
import {validateArgs} from '../../../apps/runner/lib/validateArgs';
import {ExecutorFn, Actions, Parameters} from '../../../apps/runner/lib/types';
import {State} from '../../../apps/runner/lib/state';

export type SevenZipOptions = {
  file_names: string[];
  archive_prefix: string;
  out_dir: string;
  exclude_files: string[];
};

export const sevenZip = async function (
  archive_basename: string,
  options: SevenZipOptions,
  state: State
): Promise<string> {
  // const {runner, logger} = state;

  const {file_names, archive_prefix, out_dir, exclude_files} =
    options as SevenZipOptions;

  // const zip_exe = "C:\\Program Files\\7-Zip\\7z.exe";
  const zip_exe = '"c:/Program Files/7-Zip/7z.exe"';

  const EXTNAME = '.zip';

  const archive_pathname = path.join(out_dir, archive_basename + EXTNAME);

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

  const cmd_line = [zip_exe, ...zip_args].join(' ');

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
