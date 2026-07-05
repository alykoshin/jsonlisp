"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.writeStringIntoFile = exports.readFileIntoString = void 0;
const validate_args_1 = require("../eval/validate-args");
const str_1 = require("./str");
/**
 * @module quicklisp/alexandria
 * alexandria — the de-facto standard CL utility library.
 * {@link https://gitlab.common-lisp.net/alexandria/alexandria}
 */
/**
 * @name read-file-into-string
 * @see
 * - {@link https://gitlab.common-lisp.net/alexandria/alexandria/-/blob/master/alexandria-1/io.lisp#L75}
 */
const readFileIntoString = async function (_, args, st) {
    let [pFname] = (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
    return (0, str_1.strFromFile)(_, [pFname], st);
};
exports.readFileIntoString = readFileIntoString;
/**
 * @name write-string-into-file
 * @see
 * - {@link https://gitlab.common-lisp.net/alexandria/alexandria/-/blob/master/alexandria-1/io.lisp#L83}
 */
const writeStringIntoFile = async function (_, params, st) {
    let [pFname, s] = (0, validate_args_1.validateArgs)(params, { exactCount: 2 });
    return (0, str_1.strToFile)(_, [s, pFname], st);
};
exports.writeStringIntoFile = writeStringIntoFile;
exports.actions = {
    'read-file-into-string': exports.readFileIntoString,
    'write-string-into-file': exports.writeStringIntoFile,
};
exports.default = exports.actions;
//# sourceMappingURL=alexandria.js.map