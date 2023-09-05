import { action_build, BuildAction } from './build';
import { action_cleanup, CleanupAction } from './cleanup';
import { action_cp, CpAction } from './cp';
import { action_copyResourcesRecursive, CopyResourcesRecursiveAction } from './copyResourcesRecursive';
import { action_echo, EchoAction } from './echo';
import { action_exec, ExecAction } from './exec';
import { action_parallel, ParallelAction, ParallelMultiAction } from './parallel';
import { action_rm, RmAction } from './rm';
import { action_sleep, SleepAction } from './sleep';
import { action_sequential, SequentialAction, SequentialMultiAction } from './sequential';
import { action_version, VersionAction } from './version';
import { action_when, WhenAction } from "./when";
import { action_zip, ZipAction } from './zip';
import { action_yarnInstallProd, YarnInstallProdAction } from "./yarnInstallProd";
export interface BaseActionConfig {
    action: string;
}
export type ActionDefinition = BuildAction | CleanupAction | CpAction | CopyResourcesRecursiveAction | EchoAction | ExecAction | ParallelAction | ParallelMultiAction | RmAction | SequentialAction | SequentialMultiAction | SleepAction | VersionAction | WhenAction | YarnInstallProdAction | ZipAction;
export declare const actions: {
    build: typeof action_build;
    cleanup: typeof action_cleanup;
    cp: typeof action_cp;
    copyResourcesRecursive: typeof action_copyResourcesRecursive;
    echo: typeof action_echo;
    exec: typeof action_exec;
    parallel: typeof action_parallel;
    rm: typeof action_rm;
    sequential: typeof action_sequential;
    sleep: typeof action_sleep;
    version: typeof action_version;
    when: typeof action_when;
    yarnInstallProd: typeof action_yarnInstallProd;
    zip: typeof action_zip;
};
