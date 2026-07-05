/** @format */
import { Actions, ExecutorFn } from '../eval/sexpr';
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
export declare const readFileIntoString: ExecutorFn;
/**
 * @name write-string-into-file
 * @see
 * - {@link https://gitlab.common-lisp.net/alexandria/alexandria/-/blob/master/alexandria-1/io.lisp#L83}
 */
export declare const writeStringIntoFile: ExecutorFn;
export declare const actions: Actions;
export default actions;
