/** @format */
/**
 * Host assembly of the built-in vocabulary, organized by origin
 * (see ARCHITECTURE.md):
 *   kernel     — the axiomatic kernel
 *   cl/        — ANSI COMMON-LISP (modules = CLHS chapters)
 *   sbcl/      — SBCL packages we emulate (sb-posix)
 *   quicklisp/ — third-party CL systems (trivial-shell, lisp-unit, …)
 *   jl/        — JL's own dialect extensions
 *   host/      — non-Lisp, $-marked npm/host tooling
 *
 * Every Lisp-world action is registered under BOTH its package-qualified
 * name (cl:car, sb-posix:getenv, jmc:null_, …) and its bare name
 * (defpackage = CL's package system; bare aliases = use-package).
 * Host actions keep their `$` convention, unqualified.
 */
import { Actions } from '../eval/sexpr';
export declare const actions: Actions;
export default actions;
