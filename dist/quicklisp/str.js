"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.strToFile = exports.strFromFile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const validate_args_1 = require("../eval/validate-args");
const sexpr_1 = require("../eval/sexpr");
/**
 * @module quicklisp/str
 * cl-str — "A modern and consistent Common Lisp string manipulation library"
 * {@link https://github.com/vindarel/cl-str}
 * Action names here are bare; the assembler wraps them with
 * defpackage('str', …), producing the historical `str:to-file` /
 * `str:from-file` plus bare aliases.
 */
/**
 * @name str:from-file
 * @see
 * - {@link https://github.com/vindarel/cl-str#from-file-filename}
 * - {@link https://lispcookbook.github.io/cl-cookbook/files.html#reading-files}
 */
const strFromFile = async function (_, args, st) {
    let [pFname] = (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    let fname = await st.evaluate(pFname);
    (0, sexpr_1.ensureString)(fname);
    fname = path_1.default.resolve(fname);
    st.logger.debug(`reading "${fname}"`);
    const s = await promises_1.default.readFile(fname, { encoding: 'utf8' });
    st.logger.debug(`Read ${s.length} chars`);
    return s;
};
exports.strFromFile = strFromFile;
/**
 * @name str:to-file
 * @see
 * - {@link https://github.com/vindarel/cl-str#to-file-filename-s} <br>
 * - {@link https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file} <br>
 */
const strToFile = async function (_, params, { evaluate, logger }) {
    let [pFname, s] = (0, validate_args_1.validateArgs)(params, { exactCount: 2 });
    let fname = await evaluate(pFname);
    (0, sexpr_1.ensureString)(fname);
    fname = path_1.default.resolve(fname);
    logger.debug(`writing to "${fname}"`);
    (0, sexpr_1.ensureString)((s = await evaluate(s)));
    await promises_1.default.writeFile(fname, s, { encoding: 'utf8' });
    logger.debug(`Wrote ${s.length} chars`);
    return s;
};
exports.strToFile = strToFile;
exports.actions = {
    'to-file': exports.strToFile,
    'from-file': exports.strFromFile,
};
exports.default = exports.actions;
//# sourceMappingURL=str.js.map