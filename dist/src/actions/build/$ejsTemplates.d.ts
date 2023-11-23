/** @format */
import { ExecutorFn } from '../lisp-like/helpers/types';
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
export declare const $ejsTemplates: ExecutorFn;
export default $ejsTemplates;
