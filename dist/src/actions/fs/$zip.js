"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$zip = void 0;
const exec_1 = require("../../helpers/exec");
const util_1 = require("../../lib/util");
// export type ZipAction = [
//   action: 'zip',
//   config: ZipActionConfig
// ]
async function $zip(action, parameters, state) {
    const { activity, runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
    const [pConfig] = parameters;
    const { file_names, archive_prefix, out_dir, exclude_files } = pConfig;
    const date = new Date().toISOString().replace(/[:T]/g, '-').replace(/\..+/, '');
    // const zip_exe = "C:\\Program Files\\7-Zip\\7z.exe";
    const zip_exe = "c:/Program Files/7-Zip/7z.exe";
    const archive_name = `${archive_prefix}-v${activity.version}-${date}.zip`;
    const archive_pathname = [out_dir, archive_name].join('/');
    const sFileNames = file_names.join(' ');
    const r_sw = '-r';
    const t_sw = '-tzip';
    const x_sw = exclude_files.map(f => `-x!${f}`).join(' ');
    const command_line = `"${zip_exe}" a ${t_sw} ${r_sw} ${x_sw} "${archive_pathname}" "${sFileNames}"`;
    const options = {
        cwd: activity.base_dir,
    };
    return await (0, exec_1.execute)(command_line, options, { logger });
}
exports.$zip = $zip;
exports.default = $zip;
//# sourceMappingURL=$zip.js.map