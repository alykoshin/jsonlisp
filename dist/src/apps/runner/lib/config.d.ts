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
    resolveFilename(pathname: string): string;
    read(origPathname?: string): Promise<any>;
    readTs(pathname: string): Promise<any>;
    readJs(pathname: string): Promise<any>;
    readJson(pathname: string): Promise<any>;
    readJson5(pathname: string): Promise<any>;
}
export declare const configReader: ConfigReader;
export declare function readActivityFile(fname: string): Promise<Activity>;
declare class ConfigWriter {
    write(config_file: string, config: Activity): Promise<void>;
    writeTs(pathname: string, data: any): Promise<void>;
    writeJson(pathname: string, data: any): Promise<void>;
    writeJson5(pathname: string, data: any): Promise<void>;
}
export declare const configWriter: ConfigWriter;
export {};
