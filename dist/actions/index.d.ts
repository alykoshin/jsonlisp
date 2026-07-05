/** @format */
/**
 * Host assembly of the vocabulary, organized by origin (see ARCHITECTURE.md):
 *   kernel     — the axiomatic kernel
 *   cl/        — ANSI COMMON-LISP (modules = CLHS chapters)
 *   sbcl/      — SBCL packages we emulate (sb-posix)
 *   quicklisp/ — third-party CL systems (trivial-shell, lisp-unit, …)
 *   jl/        — JL's own dialect extensions
 *   host/      — non-Lisp, $-marked npm/host tooling
 *
 * Vocabulary is REQUIRE-able, like SBCL contribs. An activity may declare
 *
 *   requires: ['sb-posix', {name: 'trivial-shell', use: false}, 'host']
 *
 * and gets the core language (cl + jmc + jl) plus exactly those packages.
 * `use: false` registers qualified names ONLY (sb-posix:getenv but no bare
 * getenv) — CL's "don't use-package" discipline. Group names expand:
 * sbcl, quicklisp, host. No `requires` declared -> the full vocabulary
 * (backward compatible).
 */
import { Actions } from '../eval/sexpr';
export type Require = string | {
    name: string;
    use?: boolean;
};
export declare function assemble(requires?: Require[]): Actions;
/** The full default vocabulary (no `requires` declared). */
export declare const actions: Actions;
export default actions;
