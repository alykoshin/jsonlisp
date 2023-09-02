import { FullConfig } from '../lib/config';
import { BaseActionConfig, ActionConfig } from "./";
export interface SequentialAction extends BaseActionConfig {
    action: 'sequential';
    actions: ActionConfig[];
}
export declare function action_sequential(baseActionConfig: SequentialAction, fullConfig: FullConfig): Promise<void>;
