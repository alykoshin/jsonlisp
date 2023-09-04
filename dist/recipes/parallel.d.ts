import { ActionConfig } from "./index";
import { FullConfig } from "../lib/config";
export interface ParallelAction {
    action: 'parallel';
    actions: ActionConfig[];
}
export type ParallelMultiAction = [
    action: 'parallel',
    ...actions: ActionConfig[]
];
export declare function action_parallel(baseActionConfig: ParallelAction | ParallelMultiAction, fullConfig: FullConfig): Promise<void[]>;
