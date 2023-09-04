import { ActionDefinition } from "../recipes/";
export interface FullConfig {
    base_dir: string;
    version: string;
    execute: ActionDefinition;
}
export declare function read_config(config_file: string): Promise<FullConfig>;
export declare function write_config(config_file: string, config: FullConfig): Promise<void>;
export declare function getConfigFilename(): string;
