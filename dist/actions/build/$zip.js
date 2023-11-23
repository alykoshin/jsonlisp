"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.$zipDir = exports.$zip = void 0;
// import {actions as $versionActions} from '../build/$version';
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
const types_1 = require("../lisp-like/helpers/types");
const fileUtils_1 = require("../../lib/fileUtils/fileUtils");
const _7zip_1 = require("./helpers/7zip");
const archiver_1 = require("./helpers/archiver");
async function getVersion(evaluate) {
    // const version = await ($versionActions.$version as ExecutorFn).call(
    //   state,
    //   action,
    //   [],
    //   state
    // );
    // ensureString(version);
    // return 'v'+version;
    //
    const version = await evaluate(['$version']);
    (0, types_1.ensureString)(version);
    return version;
}
function getArchiveBasename(archive_prefix, version) {
    return [archive_prefix, 'v' + version, (0, fileUtils_1.formatFilenameDate)()].join('-');
}
/**
 * @name $zip
 * @description Uses `7zip` executable to create zip archive (*Windows* only).
 */
const $zip = async function (_, args, st) {
    // const {runner, logger} = st;
    (0, validateArgs_1.validateArgs)(args, { exactCount: 1 });
    const options = args[0];
    const version = await getVersion(st.evaluate);
    const { archive_prefix } = options;
    const archiveBaseName = getArchiveBasename(archive_prefix, version);
    return (0, _7zip_1.sevenZip)(archiveBaseName, options, st);
};
exports.$zip = $zip;
/**
 * @name $zipDir
 * @description Uses `archiver` module to create zip archive.
 */
const $zipDir = async function (_, args, st) {
    // const {runner, logger} = st;
    (0, validateArgs_1.validateArgs)(args, { exactCount: 3 });
    const [sourceDir, out_dir, archive_prefix] = args;
    (0, types_1.ensureString)(sourceDir);
    (0, types_1.ensureString)(out_dir);
    (0, types_1.ensureString)(archive_prefix);
    const version = await getVersion(st.evaluate);
    const archiveBaseName = getArchiveBasename(archive_prefix, version);
    const finalName = await (0, archiver_1.zipDirectory)(sourceDir, out_dir, archiveBaseName, st.logger);
    return finalName;
};
exports.$zipDir = $zipDir;
exports.actions = {
    $zip: exports.$zip,
    $zipDir: exports.$zipDir,
    // 'zip:get-name': getArchiveBasename,
};
exports.default = exports.actions;
//# sourceMappingURL=$zip.js.map