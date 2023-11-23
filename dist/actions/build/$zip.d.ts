/** @format */
import { Actions, ExecutorFn } from '../lisp-like/helpers/types';
/**
 * @module $zip
 */
export interface $zipOptions {
    file_names: string[];
    archive_prefix: string;
    out_dir: string;
    exclude_files: string[];
}
/**
 * @name $zip
 * @description Uses `7zip` executable to create zip archive (*Windows* only).
 */
export declare const $zip: ExecutorFn;
/**
 * @name $zipDir
 * @description Uses `archiver` module to create zip archive.
 */
export declare const $zipDir: ExecutorFn;
export declare const actions: Actions;
export default actions;
