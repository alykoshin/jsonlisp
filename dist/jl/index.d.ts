/** @format */
import { Actions } from '../eval/sexpr';
/**
 * @module jl
 * JL's own dialect extensions — vocabulary WE invented, appearing in no
 * external canon: '?' (describe), ';' (comment), `nullp` (ANSI name is
 * `null`), `%` (JS-flavored truncate-rem). The analog of SB-EXT: what this
 * implementation adds — and like SB-EXT uses COMMON-LISP, jl may import cl.
 *
 * @description
 * Seems there is no single command to print all the variables in the Lisp
 * (including current scope etc)
 * Couple of articles how it may be done.
 *
 * @see
 * How can I list all of the defined functions and global variables that are active in common lisp <br>
 * - {@link https://stackoverflow.com/questions/42016114/how-can-i-list-all-of-the-defined-functions-and-global-variables-that-are-active} <br>
 * - {@link http://www.lispworks.com/documentation/HyperSpec/Body/m_do_sym.htm} <br>
 * Macro DO-SYMBOLS, DO-EXTERNAL-SYMBOLS, DO-ALL-SYMBOLS <br>
 */
export declare const actions: Actions;
export default actions;
