"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const util_1 = require("../../lib/util");
const path_1 = __importDefault(require("path"));
/**
 * The Common Lisp Cookbook – Files and Directories -- Writing content to a file
 * https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file
 *
 * uiop:copy-file
 * https://stackoverflow.com/questions/66173218/easiest-way-to-copy-a-file-from-one-directory-to-another-in-common-lisp
 * UIOP -- UIOP Manual -- UIOP/FILESYSTEM --
 * https://asdf.common-lisp.dev/uiop.html#UIOP_002fFILESYSTEM
 *
 *  LispWorks User Guide and Reference Manual > 34 The LISPWORKS Package -- copy-file
 * http://www.lispworks.com/documentation/lw61/LW/html/lw-893.htm#pgfId-1774263
 */
exports.actions = {
    /**
     * Common Lisp the Language, 2nd Edition
     * 23.3. Renaming, Deleting, and Other File Operations
     * https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node216.html
     */
    'rename-file': async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 2 });
        const [source, dest] = params;
        logger.debug(`"${source}"->"${dest}"`);
        const r = await promises_1.default.rename(String(await evaluate(source)), String(await evaluate(dest)));
        logger.debug(`Moved 1 dir/file`);
    },
    'delete-file': async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const [source] = params;
        logger.debug(`"${source}"`);
        const r = await promises_1.default.unlink(String(await evaluate(source)));
        logger.debug(`Deleted 1 dir/file`);
        return;
    },
    'probe-file': async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const [source] = params;
        logger.debug(`"${source}"`);
        const p = path_1.default.resolve(String(await evaluate(source)));
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
    },
    /**
     * Common Lisp the Language, 2nd Edition
     * 23.5. Accessing Directories
     * https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node218.html#SECTION002750000000000000000
     */
    directory: async function (action, params, { evaluate, logger }) {
        (0, util_1.fn_check_params)(params, { exactCount: 1 });
        const [source] = params;
        logger.debug(`"${source}"`);
        const p = path_1.default.resolve(String(await evaluate(source)));
        const res = await promises_1.default.readdir(p /* { encoding, withFileTypes, recursive } */);
        logger.debug('Result:', res);
        return res;
    },
};
exports.default = exports.actions;
//# sourceMappingURL=file-system.js.map