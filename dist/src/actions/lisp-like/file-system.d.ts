/** @format */
import { ExecutorFn, Actions } from './helpers/types';
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
export declare const strFromFile: ExecutorFn;
export declare const readFileIntoString: ExecutorFn;
/**
 * @name str:to-file
 * @see
 * - {@link https://github.com/vindarel/cl-str#to-file-filename-s} <br>
 * - {@link https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file} <br>
 */
export declare const strToFile: ExecutorFn;
/**
 * @name write-string-into-file
 * @see
 * - {@link https://gitlab.common-lisp.net/alexandria/alexandria/-/blob/master/alexandria-1/io.lisp#L83}
 * - {@link https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file} <br>
 */
export declare const writeStringIntoFile: ExecutorFn;
/**
 * @name rename-file
 * @see
 * Common Lisp the Language, 2nd Edition
 * 23.3. Renaming, Deleting, and Other File Operations
 * {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node216.html}
 */
export declare const renameFile: ExecutorFn;
/**
 * @name delete-file
 */
export declare const deleteFile: ExecutorFn;
/**
 * @name probe-file
 */
export declare const probeFile: ExecutorFn;
/**
 * @name directory
 * @see
 * - Common Lisp the Language, 2nd Edition --  23.5. Accessing Directories
 * {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node218.html#SECTION002750000000000000000}
 */
export declare const directory: ExecutorFn;
export declare const actions: Actions;
export default actions;
