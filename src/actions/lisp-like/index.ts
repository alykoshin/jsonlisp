import {Actions} from "../../lib/runner"

import conditionals from "./conditionals"
import defines from './defines'
import documentation from './documentation'
import fileSystem from "./file-system"
import error from "./error"
import inputOutput from "./input-output"
import lispUnit from './lisp-unit'
import lists from './lists'
import operators from './operators'
import sbPosix from './sb-posix'
import simpleParallelTasks from './simple-parallel-tasks'
import system from './system'
import trivialShell from './trivial-shell'

export const actions: Actions = {
  ...conditionals,
  ...defines,
  ...documentation,
  ...error,
  ...fileSystem,
  ...inputOutput,
  ...lispUnit,
  ...lists,
  ...operators,
  ...sbPosix,
  ...simpleParallelTasks,
  ...system,
  ...trivialShell,
}

export default actions
