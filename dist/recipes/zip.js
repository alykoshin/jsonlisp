"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_zip = void 0;
const exec_1 = require("../lib/exec");
async function action_zip(definition, { id, fullConfig, runner }) {
    const { config } = definition;
    const date = new Date().toISOString().replace(/[:T]/g, '-').replace(/\..+/, '');
    // const zip_exe = "C:\\Program Files\\7-Zip\\7z.exe";
    const zip_exe = "c:/Program Files/7-Zip/7z.exe";
    const archive_name = `${config.archive_prefix}-v${fullConfig.version}-${date}.zip`;
    const archive_pathname = [config.out_dir, archive_name].join('/');
    const file_names = config.file_names.join(' ');
    const r_sw = '-r';
    const t_sw = '-tzip';
    const x_sw = config.exclude_files.map(f => `-x!${f}`).join(' ');
    const command_line = `"${zip_exe}" a ${t_sw} ${r_sw} ${x_sw} "${archive_pathname}" "${file_names}"`;
    const options = {
        cwd: fullConfig.base_dir,
    };
    await (0, exec_1.execute)(command_line, options, {}, (s) => runner.log(id, s));
}
exports.action_zip = action_zip;
//# sourceMappingURL=zip.js.map