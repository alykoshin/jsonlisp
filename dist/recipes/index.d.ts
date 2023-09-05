import { action_sequential, SequentialAction, SequentialMultiAction } from './sequential';
import { action_parallel, ParallelAction, ParallelMultiAction } from './parallel';
import { action_echo, EchoAction } from './echo';
import { action_cleanup, CleanupAction } from './cleanup';
import { action_copyResourcesRecursive, CopyResourcesRecursiveAction } from './copyResourcesRecursive';
import { action_sleep, SleepAction } from './sleep';
import { action_exec, ExecAction } from './exec';
import { action_build, BuildAction } from './build';
import { action_version, VersionAction } from './version';
import { action_zip, ZipAction } from './zip';
import { action_yarnInstallProd, YarnInstallProdAction } from "./yarnInstallProd";
export interface BaseActionConfig {
    action: string;
}
export type ActionDefinition = BuildAction | CleanupAction | CopyResourcesRecursiveAction | EchoAction | ExecAction | ParallelAction | ParallelMultiAction | SequentialAction | SequentialMultiAction | SleepAction | VersionAction | YarnInstallProdAction | ZipAction;
export declare const actions: {
    build: typeof action_build;
    cleanup: typeof action_cleanup;
    copyResourcesRecursive: typeof action_copyResourcesRecursive;
    echo: typeof action_echo;
    exec: typeof action_exec;
    parallel: typeof action_parallel;
    sequential: typeof action_sequential;
    sleep: typeof action_sleep;
    version: typeof action_version;
    yarnInstallProd: typeof action_yarnInstallProd;
    zip: typeof action_zip;
};
