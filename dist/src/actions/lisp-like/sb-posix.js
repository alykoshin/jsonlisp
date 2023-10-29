"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.getcwd = exports.chdir = exports.getenv = exports.setenv = void 0;
const validateArgs_1 = require("../../apps/runner/lib/validateArgs");
const types_1 = require("../../apps/runner/lib/types");
const print_1 = require("./helpers/print");
/**
 * @module sb-posix
 *
 * @see Package: SB-POSIX -- {@list https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/}
 */
/**
 * @name setenv
 *
 * @see
 * - Function: SB-POSIX:SETENV -- {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/SETENV.html} <br>
 * - sbcl/contrib/sb-posix/interface.lisp -- {@link https://github.com/sbcl/sbcl/blob/master/contrib/sb-posix/interface.lisp} <br>
 */
const setenv = async function (_, params, st) {
    const { evaluate, logger } = st;
    (0, validateArgs_1.validateArgs)(params, { exactCount: [2, 3] });
    // const [pName, pValue, pOverwrite] = await series(params, evaluate);
    const [pName, pValue, pOverwrite] = params;
    const eName = await evaluate(pName);
    (0, types_1.ensureString)(eName);
    const eValue = await evaluate(pValue);
    const eOverwrite = await evaluate(pOverwrite);
    const res = process.env[eName];
    logger.debug(`$${eName}="${eName}"`);
    return res;
};
exports.setenv = setenv;
/**
 * @name getenv
 * @see
 * - Function: SB-POSIX:GETENV -- {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/GETENV.html} <br>
 * - Function: SB-EXT:POSIX-GETENV -- {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-ext/function/POSIX-GETENV.html} <br>
 * - sbcl/contrib/sb-posix/interface.lisp -- {@link https://github.com/sbcl/sbcl/blob/master/contrib/sb-posix/interface.lisp#L966C19-L966C19} <br>
 */
const getenv = async function (_, params, { evaluate, logger }) {
    (0, validateArgs_1.validateArgs)(params, { exactCount: 1 });
    const [pName] = params;
    const eName = await evaluate(pName);
    (0, types_1.ensureString)(eName);
    const res = process.env[eName];
    logger.debug(`$${eName}="${eName}"`);
    return res;
};
exports.getenv = getenv;
/**
 * @name chdir
 * @see Function: SB-POSIX:MKDIR --
 * {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/MKDIR.html} <br>
 * {@link https://www.opennet.ru/man.shtml?topic=chdir} <br>
 *
 */
const chdir = async function (_, params, { evaluate }) {
    (0, validateArgs_1.validateArgs)(params, { exactCount: 1 });
    const dir = await evaluate(params[0]);
    (0, types_1.ensureString)(dir);
    const res = process.chdir(dir);
    return 0;
};
exports.chdir = chdir;
/**
 * @name getcwd
 */
const getcwd = async function (_, params, { logger }) {
    (0, validateArgs_1.validateArgs)(params, { exactCount: 0 });
    const res = process.cwd();
    logger.debug((0, print_1.stringify)(res));
    return res;
};
exports.getcwd = getcwd;
exports.actions = {
    setenv: exports.setenv,
    getenv: exports.getenv,
    chdir: exports.chdir,
    getcwd: exports.getcwd,
};
exports.default = exports.actions;
//# sourceMappingURL=sb-posix.js.map