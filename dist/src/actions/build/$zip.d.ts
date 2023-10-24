/** @format */
import { ExecutorFn } from '../../apps/runner/lib/types';
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
export declare const $zip: ExecutorFn;
