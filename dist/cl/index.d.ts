/** @format */
/**
 * @module cl
 * The standard vocabulary — JL's analog of the COMMON-LISP package
 * ("home of symbols defined by the ANSI language specification").
 * Modules are named after CLHS chapters. ANSI symbols only; JL extensions
 * live in src/jl, third-party Lisp libraries in src/quicklisp, SBCL
 * packages in src/sbcl. See ARCHITECTURE.md.
 */
import { Actions } from '../eval/sexpr';
export declare const actions: Actions;
export default actions;
