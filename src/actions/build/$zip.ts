/** @format */

import * as path from 'path';

import {execute} from '../lisp-like/helpers/exec';
import $versionActions from '../build/$version';
import {fn_check_params} from '../../apps/runner/lib/util';
import {ExecutorFn, Actions, Parameters} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';

export type ZipActionConfig = {
  file_names: string[];
  archive_prefix: string;
  out_dir: string;
  exclude_files: string[];
};

/**
 * @module $zip
 */

/**
 * @name $zip
 */
export const $zip: ExecutorFn = async function (
  action,
  args,
  state
): Promise<string> {
  const {runner, logger} = state;
  fn_check_params(args, {exactCount: 1});
  const [pConfig] = args;

  const version = await ($versionActions.$version as ExecutorFn).call(
    state,
    action,
    [],
    state
  );

  const {file_names, archive_prefix, out_dir, exclude_files} =
    pConfig as ZipActionConfig;

  const date = new Date()
    .toISOString()
    .replace(/[:T]/g, '-')
    .replace(/\..+/, '');

  // const zip_exe = "C:\\Program Files\\7-Zip\\7z.exe";
  const zip_exe = '"c:/Program Files/7-Zip/7z.exe"';

  const archive_name = `${archive_prefix}-v${version}-${date}.zip`;
  const archive_pathname = path.join(out_dir, archive_name);

  const sFileNames = file_names.join(' ');

  // prettier-ignore
  const switches = [
    '-r',
    '-t'+'zip',
    ...exclude_files.map(f => `-x!${f}`),
  ]
  // prettier-ignore
  const zip_args = [
    'a', //  a : Add files to archive
    ...switches,
    archive_pathname,
    sFileNames,
  ];

  const command_line = [zip_exe, ...zip_args].join(' ');

  const options = {
    // cwd: activity.base_dir,
  };

  const r = await execute(command_line, options, {state});
  return r.stdout;
};

// export const actions: Actions = {
// $zip: $zip,
// }

// export default actions
