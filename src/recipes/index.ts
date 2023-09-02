import {action_sequential, SequentialAction} from './sequential'
import {action_parallel, ParallelAction} from './parallel'

import {action_echo, EchoAction} from './echo'
import {action_sleep, SleepAction} from './sleep'

import {action_build, BuildAction} from './build'
import {action_version, VersionAction} from './version'
import {action_zip, ZipAction} from './zip'
import {FullConfig} from "../lib/config";

//

export interface BaseActionConfig {
  action: string
}

// export type ActionConfig = SequentialAction | ParallelAction | EchoAction | SleepAction | BuildAction | VersionAction | ZipAction
export type ActionConfig = SequentialAction | ParallelAction | EchoAction | SleepAction | BuildAction | VersionAction | ZipAction

//

export type ActionMethod/*<T extends ActionConfig>*/ = (actionConfig: ActionConfig/*T*/, fullConfig: FullConfig) => Promise<any>

// interface Actions {
//   [key: string]: ActionMethod
// }

export const actions/*: Actions */= {
  sequential: action_sequential,
  parallel: action_parallel,

  echo: action_echo,
  sleep: action_sleep,

  build: action_build,
  version: action_version,
  zip: action_zip,
}

// type ActionKeys = keyof typeof actions




