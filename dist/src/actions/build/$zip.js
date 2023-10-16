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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$zip = void 0;
const path = __importStar(require("path"));
const exec_1 = require("../lisp-like/helpers/exec");
const _version_1 = __importDefault(require("../build/$version"));
const util_1 = require("../../lib/util");
/**
 * @module $zip
 */
/**
 * @name $zip
 */
async function $zip(action, params, state) {
    const { runner, logger } = state;
    (0, util_1.fn_check_params)(params, { exactCount: 1 });
    const [pConfig] = params;
    const version = await _version_1.default.$version.call(state, action, [], state);
    const { file_names, archive_prefix, out_dir, exclude_files } = pConfig;
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
        '-t' + 'zip',
        ...exclude_files.map(f => `-x!${f}`),
    ];
    // prettier-ignore
    const args = [
        'a',
        ...switches,
        archive_pathname,
        sFileNames,
    ];
    const command_line = [zip_exe, ...args].join(' ');
    const options = {
    // cwd: activity.base_dir,
    };
    const r = await (0, exec_1.execute)(command_line, options, { logger });
    return r.stdout;
}
exports.$zip = $zip;
// export const actions: Actions = {
// $zip: $zip,
// }
// export default actions
//# sourceMappingURL=$zip.js.map