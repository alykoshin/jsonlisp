import { FullConfig } from './config';
import { ActionConfig } from '../recipes/';
export type ActionMethod = (actionConfig: ActionConfig, fullConfig: FullConfig) => Promise<any>;
export type MultiAction = [action: string, ...actions: ActionConfig[]];
export declare function run_config(config_filename: string): Promise<void>;
export declare function run_action(actionConfig: ActionConfig, fullConfig: FullConfig): Promise<void>;
