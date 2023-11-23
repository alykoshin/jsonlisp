/** @format */

import {Actions} from './helpers/types';

import conditionals from './conditionals';
import defines from './defines';
import documentation from './documentation';
import eval_ from './core/eval';
// import eval from './eval';
import fileSystem from './file-system';
import error from './error';
import inputOutput from './input-output';
import iterationAndMapping from './iteration-and-mapping';
import lispUnit from './lisp-unit';
import lists from './lists';
import operators from './operators';
import sbPosix from './sb-posix';
import simpleParallelTasks from './simple-parallel-tasks';
import system from './system';
import trivialShell from './trivial-shell';

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
