import { FullConfig } from "../lib/config";
export interface SleepAction {
    action: 'sleep';
    value: number;
}
export declare function action_sleep(actionConfig: SleepAction, _fullConfig: FullConfig): Promise<unknown>;
