import {action_sequential, SequentialAction, SequentialMultiAction} from './sequential'
import {action_parallel, ParallelAction, ParallelMultiAction} from './parallel'

import {action_echo, EchoAction} from './echo'
import {action_sleep, SleepAction} from './sleep'

import {action_exec, ExecAction} from './exec'
import {action_build, BuildAction} from './build'
import {action_version, VersionAction} from './version'
import {action_zip, ZipAction} from './zip'
import {FullConfig} from "../lib/config";
import {action_yarnInstallProd, YarnInstallProdAction} from "./yarnInstallProd";

//

export interface BaseActionConfig {
  action: string
}

// export type ActionConfig = SequentialAction | ParallelAction | EchoAction | SleepAction | BuildAction | VersionAction | ZipAction
export type ActionDefinition = SequentialAction | SequentialMultiAction | ParallelAction | ParallelMultiAction | EchoAction | SleepAction | ExecAction | BuildAction | VersionAction | ZipAction

// export type ActionArrayDefinition = [
//
// ];

//


// interface Actions {
//   [key: string]: ActionMethod
// }

export const actions/*: Actions */= {
  sequential: action_sequential,
  parallel: action_parallel,

  echo: action_echo,
  sleep: action_sleep,

  exec: action_exec,
  build: action_build,
  yarnInstallProd: action_yarnInstallProd,

  version: action_version,
  zip: action_zip,
}

// type ActionKeys = keyof typeof actions




