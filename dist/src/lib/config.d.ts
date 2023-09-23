import { ActionDefinition, Actions } from "./runner";
export type ActivityActionsDefinition = Actions & {
    default: ActionDefinition;
};
export interface Activity {
    base_dir: string;
    version: string;
    actions: ActivityActionsDefinition;
}
export declare function readToolsFile(origPathname?: string): Promise<any>;
export declare function readActivityFile(fname: string): Promise<Activity>;
export declare function write_config(config_file: string, config: Activity): Promise<void>;
export declare function getConfigFilename(): string;
