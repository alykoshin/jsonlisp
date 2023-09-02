import { FullConfig } from './config';
import { ActionConfig } from '../recipes/';
export declare function run_config(config_filename: string): Promise<void>;
export declare function run_action(actionConfig: ActionConfig, fullConfig: FullConfig): Promise<void>;
