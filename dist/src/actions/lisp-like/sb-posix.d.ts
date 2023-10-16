/** @format */
import { ActionListExecutor, Actions } from '../../lib/types';
/**
 * @module sb-posix
 *
 * @see Package: SB-POSIX -- {@list https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/}
 */
/**
 * @name setenv
 *
 * @see Function: SB-POSIX:SETENV -- https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/SETENV.html
 */
export declare const setenv: ActionListExecutor;
/**
 * @name getenv
 * @see   Function: SB-POSIX:GETENV {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/GETENV.html}
 */
export declare const getenv: ActionListExecutor;
/**
 * @name mkdir
 * @see Function: SB-POSIX:MKDIR --
 * {@link https://koji-kojiro.github.io/sb-docs/build/html/sb-posix/function/MKDIR.html} <br>
 * {@link https://www.opennet.ru/man.shtml?topic=chdir} <br>
 *
 */
export declare const chdir: ActionListExecutor;
/**
 * @name getcwd
 */
export declare const getcwd: ActionListExecutor;
export declare const actions: Actions;
export default actions;
