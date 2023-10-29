/** @format */
import { State } from '../../../apps/runner/lib/state';
export type SevenZipOptions = {
    file_names: string[];
    archive_prefix: string;
    out_dir: string;
    exclude_files: string[];
};
export declare const sevenZip: (archive_basename: string, options: SevenZipOptions, state: State) => Promise<string>;
