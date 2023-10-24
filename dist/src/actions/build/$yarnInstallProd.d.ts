/** @format */
import { ExecutorFn } from '../../apps/runner/lib/types';
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
