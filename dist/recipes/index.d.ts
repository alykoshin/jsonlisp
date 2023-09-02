import { action_sequential, SequentialAction } from './sequential';
import { action_parallel, ParallelAction } from './parallel';
import { action_echo, EchoAction } from './echo';
import { action_sleep, SleepAction } from './sleep';
import { action_build, BuildAction } from './build';
import { action_version, VersionAction } from './version';
import { action_zip, ZipAction } from './zip';
import { FullConfig } from "../lib/config";
export interface BaseActionConfig {
    action: string;
}
export type ActionConfig = SequentialAction | ParallelAction | EchoAction | SleepAction | BuildAction | VersionAction | ZipAction;
export type ActionMethod = (actionConfig: ActionConfig, fullConfig: FullConfig) => Promise<any>;
export declare const actions: {
    sequential: typeof action_sequential;
    parallel: typeof action_parallel;
    echo: typeof action_echo;
    sleep: typeof action_sleep;
    build: typeof action_build;
    version: typeof action_version;
    zip: typeof action_zip;
};
