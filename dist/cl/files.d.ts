/** @format */
import { Actions, ExecutorFn } from '../eval/sexpr';
/**
 * @module cl/files
 * ANSI file operations — CLHS chapter 20 "Files" (plus `directory` access,
 * CLtL2 23.5). Non-ANSI file helpers live in quicklisp/alexandria and
 * quicklisp/str.
 */
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
/**
 * @name ensure-directories-exist
 * @see
 * - Common Lisp HyperSpec --
 * {@link http://www.ai.mit.edu/projects/iiip/doc/CommonLISP/HyperSpec/Body/fun_ensure-di_tories-exist.html}
 * - The Common Lisp Cookbook – Files and Directories --  Creating directories
 * {@link https://lispcookbook.github.io/cl-cookbook/files.html#creating-directories}
 */
export declare const ensureDirectoriesExist: ExecutorFn;
export declare const actions: Actions;
export default actions;
