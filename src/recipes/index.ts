import {action_sequential, SequentialAction, SequentialMultiAction} from './sequential'
import {action_parallel, ParallelAction, ParallelMultiAction} from './parallel'

import {action_echo, EchoAction} from './echo'
import {action_cleanup, CleanupAction} from './cleanup'
import {action_cp, CpAction} from './cp'
import {action_copyResourcesRecursive, CopyResourcesRecursiveAction} from './copyResourcesRecursive'
import {action_rm, RmAction} from './rm'
import {action_sleep, SleepAction} from './sleep'

import {action_exec, ExecAction} from './exec'
import {action_build, BuildAction} from './build'
import {action_version, VersionAction} from './version'
import {action_zip, ZipAction} from './zip'
import {action_yarnInstallProd, YarnInstallProdAction} from "./yarnInstallProd";

//

export interface BaseActionConfig {
  action: string
}

// export type ActionConfig = SequentialAction | ParallelAction | EchoAction | SleepAction | BuildAction | VersionAction | ZipAction
export type ActionDefinition =
  BuildAction |
  CleanupAction |
  CpAction |
  CopyResourcesRecursiveAction |
  EchoAction |
  ExecAction |
  ParallelAction | ParallelMultiAction |
  RmAction |
  SequentialAction | SequentialMultiAction |
  SleepAction |
  VersionAction |
  YarnInstallProdAction |
  ZipAction
;

// export type ActionArrayDefinition = [
//
// ];
const action: ActionDefinition = {
  action: 'yarnInstallProd',
  config: {
  }
}


// interface Actions {
//   [key: string]: ActionMethod
// }

export const actions/*: Actions */= {
  build: action_build,
  cleanup: action_cleanup,
  cp: action_cp,
  copyResourcesRecursive: action_copyResourcesRecursive,
  echo: action_echo,
  exec: action_exec,
  parallel: action_parallel,
  rm: action_rm,
  sequential: action_sequential,
  sleep: action_sleep,
  version: action_version,
  yarnInstallProd: action_yarnInstallProd,
  zip: action_zip,
}

// type ActionKeys = keyof typeof actions




