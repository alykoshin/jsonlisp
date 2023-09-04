import { FullConfig } from '../lib/config';
import { ActionDefinition, BaseActionConfig } from "./";
import { Runner } from "../lib/runner";
export interface SequentialAction extends BaseActionConfig {
    action: 'sequential';
    actions: ActionDefinition[];
}
export type SequentialMultiAction = [
    action: 'sequential',
    ...actions: ActionDefinition[]
];
export declare function action_sequential(definition: SequentialAction | SequentialMultiAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
