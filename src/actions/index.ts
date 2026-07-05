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

import {Actions} from '../eval/sexpr';
import {defpackage} from '../eval/package';

import eval_ from '../eval/eval';
import primitives from '../kernel/primitives';
import lambda from '../kernel/lambda';
import derived from '../kernel/derived';
import cl from '../cl';
import jl from '../jl';

import sbPosix from '../sbcl/sb-posix';

import alexandria from '../quicklisp/alexandria';
import str from '../quicklisp/str';
import lispUnit from '../quicklisp/lisp-unit';
import simpleParallelTasks from '../quicklisp/simple-parallel-tasks';
import trivialShell from '../quicklisp/trivial-shell';

import $sbclBridge from '../host/sbcl-bridge';
import $axios from '../host/axios';
import buildActions from '../host/build';
import osActions from '../host/os';

export const actions: Actions = {
  // the COMMON-LISP package: kernel primitives + lambda/defun are CL
  // symbols, as are eval and everything in cl/
  ...defpackage('cl', {...primitives, ...lambda, ...eval_, ...cl}),
  // the paper's derived functions (null_ and_ not_ append_ list_ pair_ assoc_)
  ...defpackage('jmc', derived),
  // JL's own dialect extensions
  ...defpackage('jl', jl),
  //
  ...defpackage('sb-posix', sbPosix),
  //
  ...defpackage('alexandria', alexandria),
  ...defpackage('str', str),
  ...defpackage('lisp-unit', lispUnit),
  ...defpackage('simple-parallel-tasks', simpleParallelTasks),
  ...defpackage('trivial-shell', trivialShell),
  //
  ...buildActions,
  ...osActions,
  ...$axios,
  ...$sbclBridge,
};

export default actions;
