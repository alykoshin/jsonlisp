/** @format */
import { ActionListExecutor } from '../../apps/runner/lib/types';
export type EjsTemplatesActionConfig = {
    sourceDir: string;
    excludeDirs: string | string[];
    targetDir: string;
};
/**
 * @module $build
 */
/**
 * @name $ejsTemplates
 */
export declare const $ejsTemplates: ActionListExecutor;
export default $ejsTemplates;
