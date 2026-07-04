/** @format */

/**
 * Host assembly of the built-in vocabulary.
 * Spread order preserved from the pre-layers layout (later spreads win),
 * with two deliberate changes:
 * - the kernel (quote atom eq car cdr cons cond, lambda, defun) is now
 *   registered — the language tests always assumed it (see ARCHITECTURE.md);
 * - $sbcl is actually spread (it was imported and forgotten).
 */

import {Actions} from '../eval/sexpr';

import $sbcl from '../contrib/sbcl';
import $axios from '../contrib/axios';
import buildActions from '../contrib/build';
import osActions from '../contrib/os';

import eval_ from '../eval/eval';
import kernel from '../kernel';

import conditionals from '../cl/conditionals';
import defines from '../cl/defines';
import documentation from '../cl/documentation';
import error from '../cl/error';
import inputOutput from '../cl/input-output';
import iterationAndMapping from '../cl/iteration-and-mapping';
import lists from '../cl/lists';
import operators from '../cl/operators';
import system from '../cl/system';

import fileSystem from '../contrib/file-system';
import lispUnit from '../contrib/lisp-unit';
import sbPosix from '../contrib/sb-posix';
import simpleParallelTasks from '../contrib/simple-parallel-tasks';
import trivialShell from '../contrib/trivial-shell';

export const actions: Actions = {
  ...buildActions,
  // the axiomatic kernel first — cl modules may consciously extend it:
  ...kernel,
  // former lisp-like merge, original order:
  ...conditionals,
  ...defines,
  ...documentation,
  ...eval_,
  ...error,
  ...fileSystem,
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
  ...$sbcl,
};

export default actions;
