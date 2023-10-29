/** @format */
import { Actions, ExecutorFn } from '../../apps/runner/lib/types';
/**
 * @module $zip
 */
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
