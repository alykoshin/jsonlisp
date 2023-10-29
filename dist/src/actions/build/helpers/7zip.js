"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sevenZip = void 0;
const path = __importStar(require("path"));
const exec_1 = require("../../lisp-like/helpers/exec");
const sevenZip = async function (archive_basename, options, state) {
    // const {runner, logger} = state;
    const { file_names, archive_prefix, out_dir, exclude_files } = options;
    // const zip_exe = "C:\\Program Files\\7-Zip\\7z.exe";
    const zip_exe = '"c:/Program Files/7-Zip/7z.exe"';
    const EXTNAME = '.zip';
    const archive_pathname = path.join(out_dir, archive_basename + EXTNAME);
    const sFileNames = file_names.join(' ');
    // prettier-ignore
    const switches = [
        '-bb1',
        '-r',
        '-t' + 'zip',
        ...exclude_files.map((f) => `-x!${f}`),
    ];
    // prettier-ignore
    const zip_args = [
        'a',
        ...switches,
        archive_pathname,
        sFileNames,
    ];
    const cmd_line = [zip_exe, ...zip_args].join(' ');
    const cmd_options = {
    // cwd: activity.base_dir,
    };
    const r = await (0, exec_1.execute)(cmd_line, cmd_options, { state });
    return r.stdout;
};
exports.sevenZip = sevenZip;
// export const actions: Actions = {
// $zip: $zip,
// }
// export default actions
//# sourceMappingURL=7zip.js.map