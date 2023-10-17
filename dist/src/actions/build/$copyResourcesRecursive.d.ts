/** @format */
import { ActionListExecutor } from '../../apps/runner/lib/types';
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
export declare const $copyResourcesRecursive: ActionListExecutor;
