"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$zip = void 0;
const exec_1 = require("../../helpers/exec");
const _version_1 = __importDefault(require("../build/$version"));
const util_1 = require("../../lib/util");
// export type ZipAction = [
//   action: 'zip',
//   config: ZipActionConfig
// ]
async function $zip(action, parameters, state) {
    const { activity, runner, logger } = state;
    (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
    const [pConfig] = parameters;
    const version = await _version_1.default.$version(action, [], state);
    const { file_names, archive_prefix, out_dir, exclude_files } = pConfig;
    const date = new Date().toISOString().replace(/[:T]/g, '-').replace(/\..+/, '');
    // const zip_exe = "C:\\Program Files\\7-Zip\\7z.exe";
    const zip_exe = "c:/Program Files/7-Zip/7z.exe";
    const archive_name = `${archive_prefix}-v${version}-${date}.zip`;
    const archive_pathname = [out_dir, archive_name].join('/');
    const sFileNames = file_names.join(' ');
    const switches = [
        '-r',
        '-tzip',
        ...exclude_files.map(f => `-x!${f}`),
    ];
    const command_line = `"${zip_exe}" a ${switches.join(' ')} "${archive_pathname}" "${sFileNames}"`;
    const options = {
        cwd: activity.base_dir,
    };
    return await (0, exec_1.execute)(command_line, options, { logger });
}
exports.$zip = $zip;
exports.default = $zip;
//# sourceMappingURL=$zip.js.map