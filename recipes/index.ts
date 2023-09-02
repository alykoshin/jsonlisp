import {action_sequential, SequentialAction} from './sequential.ts'
import {action_parallel, ParallelAction} from './parallel.ts'

import {action_echo, EchoAction} from './echo.ts'
import {action_sleep, SleepAction} from './sleep.ts'

import {action_build, BuildAction} from './build.ts'
import {action_version, VersionAction} from './version.ts'
import {action_zip, ZipAction} from './zip.ts'
import {FullConfig} from "../config.ts";

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

type ActionKeys = keyof typeof actions

//



