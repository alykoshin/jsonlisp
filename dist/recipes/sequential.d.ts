import { FullConfig } from '../lib/config';
import { ActionConfig, BaseActionConfig } from "./";
export interface SequentialAction extends BaseActionConfig {
    action: 'sequential';
    actions: ActionConfig[];
}
export type SequentialMultiAction = [
    action: 'sequential',
    ...actions: ActionConfig[]
];
export declare function action_sequential(baseActionConfig: SequentialAction | SequentialMultiAction, fullConfig: FullConfig): Promise<void>;
