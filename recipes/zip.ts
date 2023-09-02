import {$} from "execa";

import {FullConfig} from "../config.ts";
import {log_data} from "../log.ts";
import {execute} from "../exec.ts";

export interface ZipAction {
  action: 'zip'
  config: {
    file_names: string[]
    archive_prefix: string
    out_dir: string
    exclude_files: string[]
  }
}

export async function action_zip({config}: ZipAction, fullConfig: FullConfig) {
  const log = (s: number | string) => log_data(s, 'zip');
  const date = new Date().toISOString().replace(/[:T]/g, '-').replace(/\..+/, '');

// const zip_exe = "C:\\Program Files\\7-Zip\\7z.exe";
  const zip_exe = "c:/Program Files/7-Zip/7z.exe";

  const archive_name = `${config.archive_prefix}-v${fullConfig.version}-${date}.zip`;
  const archive_pathname = [config.out_dir, archive_name].join('/');

  const file_names = config.file_names.join(' ');

  const r_sw = '-r'
  const t_sw = '-tzip'
  const x_sw = config.exclude_files.map(f => `-x!${f}`).join(' ')


  const command_line = `"${zip_exe}" a ${t_sw} ${r_sw} ${x_sw} "${archive_pathname}" "${file_names}"`;

  const $$ = $({
    cwd: fullConfig.base_dir,
  });

  await execute($$, command_line, log);
}

