/** @format */

import * as path from 'path'

import {execute} from '../lisp-like/helpers/exec'
import $versionActions from '../build/$version'
import {fn_check_params} from '../../lib/util'
import {
  ActionListExecutor,
  ActionMethodState,
  Actions,
  Parameters,
} from '../../lib/runner'

export type ZipActionConfig = {
  file_names: string[]
  archive_prefix: string
  out_dir: string
  exclude_files: string[]
}

// export type ZipAction = [
//   action: 'zip',
//   config: ZipActionConfig
// ]

export async function $zip(
  action: string,
  params: Parameters,
  state: ActionMethodState
): Promise<string> {
  const {runner, logger} = state
  fn_check_params(params, {exactCount: 1})
  const [pConfig] = params

  const version = await ($versionActions.$version as ActionListExecutor)(
    action,
    [],
    state
  )

  const {file_names, archive_prefix, out_dir, exclude_files} =
    pConfig as ZipActionConfig

  const date = new Date()
    .toISOString()
    .replace(/[:T]/g, '-')
    .replace(/\..+/, '')

  // const zip_exe = "C:\\Program Files\\7-Zip\\7z.exe";
  const zip_exe = '"c:/Program Files/7-Zip/7z.exe"'

  const archive_name = `${archive_prefix}-v${version}-${date}.zip`
  const archive_pathname = path.join(out_dir, archive_name)

  const sFileNames = file_names.join(' ')

  // prettier-ignore
  const switches = [
    '-r',
    '-t'+'zip',
    ...exclude_files.map(f => `-x!${f}`),
  ]
  // prettier-ignore
  const args = [
    'a', //  a : Add files to archive
    ...switches,
    archive_pathname,
    sFileNames,
  ];

  const command_line = [zip_exe, ...args].join(' ')

  const options = {
    // cwd: activity.base_dir,
  }

  const r = await execute(command_line, options, {logger})
  return r.stdout
}

// export const actions: Actions = {
// $zip: $zip,
// }

// export default actions
