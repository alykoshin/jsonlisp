import { ActionDefinition } from "./index";
import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
export interface ParallelAction {
    action: 'parallel';
    actions: ActionDefinition[];
}
export type ParallelMultiAction = [
    action: 'parallel',
    ...actions: ActionDefinition[]
];
export declare function action_parallel(definition: ParallelAction | ParallelMultiAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void[]>;
