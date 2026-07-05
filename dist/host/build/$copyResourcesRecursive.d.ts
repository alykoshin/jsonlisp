/** @format */
import { ExecutorFn } from '../../eval/sexpr';
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
