import { ActionConfig } from "./index";
import { FullConfig } from "../lib/config";
export interface ParallelAction {
    action: 'parallel';
    actions: ActionConfig[];
}
export declare function action_parallel(actionConfig: ParallelAction, fullConfig: FullConfig): Promise<void[]>;
