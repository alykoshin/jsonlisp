"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.directory = exports.probeFile = exports.deleteFile = exports.renameFile = exports.writeStringIntoFile = exports.readFileIntoString = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const util_1 = require("../../apps/runner/lib/util");
const types_1 = require("../../apps/runner/lib/types");
const path_1 = __importDefault(require("path"));
/**
 * @module file-system
 *
 * @see *
 * - The Common Lisp Cookbook – Files and Directories -- Writing content to a file <br>
 * {@link https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file} <br>
 * <br>
 * - uiop:copy-file --
 * {@link https://stackoverflow.com/questions/66173218/easiest-way-to-copy-a-file-from-one-directory-to-another-in-common-lisp} <br>
 * - UIOP -- UIOP Manual -- UIOP/FILESYSTEM --
 * {@link https://asdf.common-lisp.dev/uiop.html#UIOP_002fFILESYSTEM} <br>
 * <br>
 * - LispWorks User Guide and Reference Manual > 34 The LISPWORKS Package -- copy-file --
 * {@link http://www.lispworks.com/documentation/lw61/LW/html/lw-893.htm#pgfId-1774263} <br>
 */
/**
 * @name read-file-into-string
 * @see
 * - {@link https://gitlab.common-lisp.net/alexandria/alexandria/-/blob/master/alexandria-1/io.lisp#L75}
 * - Other references:
 *   - The Common Lisp Cookbook – Files and Directories --
 *     {@link https://lispcookbook.github.io/cl-cookbook/files.html#reading-files}  <br>
 *   - UIOP -- UIOP Manual -- UIOP/FILESYSTEM --
 *     {@link https://asdf.common-lisp.dev/uiop.html#index-read_002dfile_002dstring}  <br>
 *   - A modern and consistent Common Lisp string manipulation library -- To and from files -- from-file
 *     {@link https://github.com/vindarel/cl-str#from-file-filename}  <br>
 */
const readFileIntoString = async function (_, args, st) {
    let [pFname] = (0, util_1.fn_check_params)(args, { exactCount: 1 });
    let fname = await st.evaluate(pFname);
    (0, types_1.ensureString)(fname);
    fname = path_1.default.resolve(fname);
    st.logger.debug(`reading "${fname}"`);
    const s = await promises_1.default.readFile(fname, { encoding: 'utf8' });
    st.logger.debug(`Read ${s.length} chars`);
    return s;
};
exports.readFileIntoString = readFileIntoString;
/**
 * @name write-string-into-file
 * @see
 * - {@link https://gitlab.common-lisp.net/alexandria/alexandria/-/blob/master/alexandria-1/io.lisp#L83}
 * - Other references:
 *   - The Common Lisp Cookbook – Files and Directories --
 *     {@link https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file} <br>
 *   - A modern and consistent Common Lisp string manipulation library -- To and from files -- to-file
 *     {@link https://github.com/vindarel/cl-str#to-file-filename-s} <br>
 */
const writeStringIntoFile = async function (action, params, { evaluate, logger }) {
    let [pFname, s] = (0, util_1.fn_check_params)(params, { exactCount: 2 });
    let fname = await evaluate(pFname);
    (0, types_1.ensureString)(fname);
    fname = path_1.default.resolve(fname);
    logger.debug(`writing to "${fname}"`);
    (0, types_1.ensureString)((s = await evaluate(s)));
    await promises_1.default.writeFile(fname, s, { encoding: 'utf8' });
    logger.debug(`Wrote ${s.length} chars`);
    return s;
};
exports.writeStringIntoFile = writeStringIntoFile;
/**
 * @name rename-file
 * @see
 * Common Lisp the Language, 2nd Edition
 * 23.3. Renaming, Deleting, and Other File Operations
 * {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node216.html}
 */
const renameFile = async function (action, params, { evaluate, logger }) {
    let [source, dest] = (0, util_1.fn_check_params)(params, { exactCount: 2 });
    (0, types_1.ensureString)((source = await evaluate(source)));
    (0, types_1.ensureString)((dest = await evaluate(dest)));
    source = path_1.default.resolve(source);
    dest = path_1.default.resolve(dest);
    logger.debug(`"${source}"->"${dest}"`);
    const r = await promises_1.default.rename(source, dest);
    logger.debug(`Moved 1 dir/file`);
    return types_1.T;
};
exports.renameFile = renameFile;
/**
 * @name delete-file
 */
const deleteFile = async function (action, params, { evaluate, logger }) {
    let [source] = (0, util_1.fn_check_params)(params, { exactCount: 1 });
    (0, types_1.ensureString)((source = await evaluate(source)));
    logger.debug(`"${source}"`);
    const p = path_1.default.resolve(source);
    const r = await promises_1.default.unlink(p);
    logger.debug(`Deleted 1 dir/file`);
    return types_1.T;
};
exports.deleteFile = deleteFile;
/**
 * @name probe-file
 */
const probeFile = async function (action, params, { evaluate, logger }) {
    let [source] = (0, util_1.fn_check_params)(params, { exactCount: 1 });
    (0, types_1.ensureString)((source = await evaluate(source)));
    logger.debug(`"${source}"`);
    const p = path_1.default.resolve(source);
    let exists = false;
    try {
        const r = await promises_1.default.stat(p);
        logger.debug(r);
        exists = true;
    }
    catch (e) {
        logger.debug('fs.stat:', e);
        if (e.code !== 'ENOENT') {
            const e2 = new Error('Unexpected fs.stat() error');
            e2.cause = e;
            throw e2;
        }
    }
    const res = exists ? p : false;
    logger.debug('Result:', res);
    return res;
};
exports.probeFile = probeFile;
/**
 * @name directory
 * @see
 * - Common Lisp the Language, 2nd Edition --  23.5. Accessing Directories
 * {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node218.html#SECTION002750000000000000000}
 */
const directory = async function (action, params, { evaluate, logger }) {
    let [source] = (0, util_1.fn_check_params)(params, { exactCount: 1 });
    (0, types_1.ensureString)((source = await evaluate(source)));
    logger.debug(`"${source}"`);
    const p = path_1.default.resolve(source);
    const res = await promises_1.default.readdir(p /* { encoding, withFileTypes, recursive } */);
    logger.debug('Result:', res);
    return res;
};
exports.directory = directory;
exports.actions = {
    'rename-file': exports.renameFile,
    'delete-file': exports.deleteFile,
    'probe-file': exports.probeFile,
    directory: exports.directory,
    'read-file-into-string': exports.readFileIntoString,
    'write-string-into-file': exports.writeStringIntoFile,
};
``;
exports.default = exports.actions;
//# sourceMappingURL=file-system.js.map