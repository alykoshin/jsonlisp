import {execute} from "../../helpers/exec";
import {fn_check_params} from "../../lib/util";
import { ActionMethodState, Parameters} from "../../lib/runner";

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
  parameters: Parameters,
  state: ActionMethodState
): Promise<string> {
  const {activity, runner, logger} = state;
  fn_check_params(parameters, {exactCount: 1})
  const [pConfig] = parameters;

  const {file_names, archive_prefix, out_dir, exclude_files} = pConfig as ZipActionConfig

  const date = new Date().toISOString().replace(/[:T]/g, '-').replace(/\..+/, '');

// const zip_exe = "C:\\Program Files\\7-Zip\\7z.exe";
  const zip_exe = "c:/Program Files/7-Zip/7z.exe";

  const archive_name = `${archive_prefix}-v${activity.version}-${date}.zip`;
  const archive_pathname = [out_dir, archive_name].join('/');

  const sFileNames = file_names.join(' ');

  const r_sw = '-r'
  const t_sw = '-tzip'
  const x_sw = exclude_files.map(f => `-x!${f}`).join(' ')


  const command_line = `"${zip_exe}" a ${t_sw} ${r_sw} ${x_sw} "${archive_pathname}" "${sFileNames}"`;

  const options = {
    cwd: activity.base_dir,
  };

  return await execute(command_line, options, {logger});
}

export default $zip;
