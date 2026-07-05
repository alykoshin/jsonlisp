/** @format */
import { Actions, ExecutorFn } from '../eval/sexpr';
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
export declare const strFromFile: ExecutorFn;
/**
 * @name str:to-file
 * @see
 * - {@link https://github.com/vindarel/cl-str#to-file-filename-s} <br>
 * - {@link https://lispcookbook.github.io/cl-cookbook/files.html#writing-content-to-a-file} <br>
 */
export declare const strToFile: ExecutorFn;
export declare const actions: Actions;
export default actions;
