/** @format */

/**
 * Host assembly of the built-in vocabulary, organized by origin
 * (see ARCHITECTURE.md):
 *   kernel     — the axiomatic kernel
 *   cl/        — ANSI COMMON-LISP
 *   sbcl/      — SBCL packages we emulate (sb-posix)
 *   quicklisp/ — third-party CL systems (trivial-shell, lisp-unit, …)
 *   jl/        — JL's own dialect extensions
 *   host/      — non-Lisp, $-marked npm/host tooling
 * Spread order preserved from the pre-layers layout (later spreads win).
 */

import {Actions} from '../eval/sexpr';

import $sbclBridge from '../host/sbcl-bridge';
import $axios from '../host/axios';
import buildActions from '../host/build';
import osActions from '../host/os';

import eval_ from '../eval/eval';
import kernel from '../kernel';

import conditionals from '../cl/conditionals';
import defines from '../cl/defines';
import error from '../cl/error';
import files from '../cl/files';
import inputOutput from '../cl/input-output';
import iterationAndMapping from '../cl/iteration-and-mapping';
import lists from '../cl/lists';
import operators from '../cl/operators';
import system from '../cl/system';

import jl from '../jl';

import sbPosix from '../sbcl/sb-posix';

import alexandria from '../quicklisp/alexandria';
import str from '../quicklisp/str';
import lispUnit from '../quicklisp/lisp-unit';
import simpleParallelTasks from '../quicklisp/simple-parallel-tasks';
import trivialShell from '../quicklisp/trivial-shell';

export const actions: Actions = {
  ...buildActions,
  // the axiomatic kernel first — cl modules may consciously extend it:
  ...kernel,
  // former lisp-like merge, original order:
  ...conditionals,
  ...defines,
  ...jl, // was cl/documentation ('?', ';')
  ...eval_,
  ...error,
  ...files,
  ...alexandria,
  ...str,
  ...inputOutput,
  ...iterationAndMapping,
  ...lispUnit,
  ...lists,
  ...operators,
  ...sbPosix,
  ...simpleParallelTasks,
  ...system,
  ...trivialShell,
  //
  ...osActions,
  ...$axios,
  ...$sbclBridge,
};

export default actions;
