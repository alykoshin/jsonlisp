/** @format */
import { ExecutorFn } from '../lisp-like/helpers/types';
export type YarnInstallProdActionConfig = {
    cwd?: string;
    env?: {
        [key: string]: string;
    };
};
/**
 * @module $build
 */
/**
 * @module $yarnInstallProd
 */
export declare const $yarnInstallProd: ExecutorFn;
export default $yarnInstallProd;
