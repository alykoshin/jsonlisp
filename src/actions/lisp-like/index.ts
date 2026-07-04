/** @format */

/**
 * Shim — modules moved to src/cl (standard vocabulary) and src/contrib
 * (host bindings); eval stays in src/eval. Spread order preserved exactly.
 */

import {Actions} from '../../eval/sexpr';

import conditionals from '../../cl/conditionals';
import defines from '../../cl/defines';
import documentation from '../../cl/documentation';
import eval_ from '../../eval/eval';
import fileSystem from '../../contrib/file-system';
import error from '../../cl/error';
import inputOutput from '../../cl/input-output';
import iterationAndMapping from '../../cl/iteration-and-mapping';
import lispUnit from '../../contrib/lisp-unit';
import lists from '../../cl/lists';
import operators from '../../cl/operators';
import sbPosix from '../../contrib/sb-posix';
import simpleParallelTasks from '../../contrib/simple-parallel-tasks';
import system from '../../cl/system';
import trivialShell from '../../contrib/trivial-shell';

export const actions: Actions = {
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
};

export default actions;
