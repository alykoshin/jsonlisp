/** @format */
import { ActionMethodState, Parameters } from '../../lib/types';
export type ZipActionConfig = {
    file_names: string[];
    archive_prefix: string;
    out_dir: string;
    exclude_files: string[];
};
/**
 * @module $zip
 */
/**
 * @name $zip
 */
export declare function $zip(action: string, params: Parameters, state: ActionMethodState): Promise<string>;
