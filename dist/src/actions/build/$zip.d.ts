/** @format */
import { ActionMethodState, Parameters } from '../../lib/runner';
export type ZipActionConfig = {
    file_names: string[];
    archive_prefix: string;
    out_dir: string;
    exclude_files: string[];
};
export declare function $zip(action: string, parameters: Parameters, state: ActionMethodState): Promise<string>;
export default $zip;
