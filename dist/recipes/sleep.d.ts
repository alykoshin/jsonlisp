import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
export interface SleepAction {
    action: 'sleep';
    value: number;
}
export declare function action_sleep(definition: SleepAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
