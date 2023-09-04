import { action_sequential, SequentialAction, SequentialMultiAction } from './sequential';
import { action_parallel, ParallelAction, ParallelMultiAction } from './parallel';
import { action_echo, EchoAction } from './echo';
import { action_sleep, SleepAction } from './sleep';
import { action_exec, ExecAction } from './exec';
import { action_build, BuildAction } from './build';
import { action_version, VersionAction } from './version';
import { action_zip, ZipAction } from './zip';
import { action_yarnInstallProd } from "./yarnInstallProd";
export interface BaseActionConfig {
    action: string;
}
export type ActionDefinition = SequentialAction | SequentialMultiAction | ParallelAction | ParallelMultiAction | EchoAction | SleepAction | ExecAction | BuildAction | VersionAction | ZipAction;
export declare const actions: {
    sequential: typeof action_sequential;
    parallel: typeof action_parallel;
    echo: typeof action_echo;
    sleep: typeof action_sleep;
    exec: typeof action_exec;
    build: typeof action_build;
    yarnInstallProd: typeof action_yarnInstallProd;
    version: typeof action_version;
    zip: typeof action_zip;
};
