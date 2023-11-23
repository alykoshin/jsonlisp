/** @format */
import { ExecutorFn } from '../lisp-like/helpers/types';
export type CopyResourcesRecursiveActionConfig = {
    sourceDir: string;
    excludeDirs: string[];
    targetDir: string;
};
/**
 * @module $build
 */
/**
 * @name $copyResourcesRecursive
 */
export declare const $copyResourcesRecursive: ExecutorFn;
