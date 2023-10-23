/** @format */
import { ActionDefinition, Actions } from './types';
export type ActivityActionsDefinition = Actions & {
    default: ActionDefinition;
};
export interface Activity {
    base_dir: string;
    version: string;
    actions: ActivityActionsDefinition;
}
declare class ConfigReader {
    read(origPathname?: string): Promise<any>;
}
export declare const configReader: ConfigReader;
export declare function readActivityFile(fname: string): Promise<Activity>;
declare class ConfigWriter {
    write(config_file: string, config: Activity): Promise<void>;
}
export declare const configWriter: ConfigWriter;
export {};
