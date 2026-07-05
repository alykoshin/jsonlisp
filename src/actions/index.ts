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
 * All action names within the language buckets are unique, so spread order
 * only matters for kernel-vs-cl (kernel first; cl may consciously extend).
 */

import {Actions} from '../eval/sexpr';

import eval_ from '../eval/eval';
import kernel from '../kernel';
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
  ...kernel,
  ...eval_,
  ...cl,
  ...jl,
  //
  ...sbPosix,
  //
  ...alexandria,
  ...str,
  ...lispUnit,
  ...simpleParallelTasks,
  ...trivialShell,
  //
  ...buildActions,
  ...osActions,
  ...$axios,
  ...$sbclBridge,
};

export default actions;
