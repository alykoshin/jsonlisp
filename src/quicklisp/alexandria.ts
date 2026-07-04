/** @format */

import {validateArgs} from '../eval/validate-args';
import {Actions, ExecutorFn} from '../eval/sexpr';
import {strFromFile, strToFile} from './str';

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
export const readFileIntoString: ExecutorFn = async function (_, args, st) {
  let [pFname] = validateArgs(args, {exactCount: 1});
  return strFromFile(_, [pFname], st);
};

/**
 * @name write-string-into-file
 * @see
 * - {@link https://gitlab.common-lisp.net/alexandria/alexandria/-/blob/master/alexandria-1/io.lisp#L83}
 */
export const writeStringIntoFile: ExecutorFn = async function (_, params, st) {
  let [pFname, s] = validateArgs(params, {exactCount: 2});
  return strToFile(_, [s, pFname], st);
};

export const actions: Actions = {
  'read-file-into-string': readFileIntoString,
  'write-string-into-file': writeStringIntoFile,
};

export default actions;
