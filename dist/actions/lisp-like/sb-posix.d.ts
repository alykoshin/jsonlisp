/** @format */
import { ExecutorFn, Actions } from './helpers/types';
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
export declare const setenv: ExecutorFn;
/**
 * @name unsetenv
 *
 * @see
 * - Function: SB-POSIX:UNSETENV -- {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/UNSETENV.html} <br>
 * - sbcl/contrib/sb-posix/interface.lisp -- {@link https://github.com/sbcl/sbcl/blob/master/contrib/sb-posix/interface.lisp} <br>
 */
export declare const unsetenv: ExecutorFn;
/**
 * @name getenv
 * @see
 * - Function: SB-POSIX:GETENV -- {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/GETENV.html} <br>
 * - Function: SB-EXT:POSIX-GETENV -- {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-ext/function/POSIX-GETENV.html} <br>
 * - sbcl/contrib/sb-posix/interface.lisp -- {@link https://github.com/sbcl/sbcl/blob/master/contrib/sb-posix/interface.lisp#L966C19-L966C19} <br>
 */
export declare const getenv: ExecutorFn;
/**
 * @name chdir
 * @see Function: SB-POSIX:MKDIR --
 * {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/MKDIR.html} <br>
 * {@link https://www.opennet.ru/man.shtml?topic=chdir} <br>
 *
 */
export declare const chdir: ExecutorFn;
/**
 * @name getcwd
 */
export declare const getcwd: ExecutorFn;
export declare const actions: Actions;
export default actions;
