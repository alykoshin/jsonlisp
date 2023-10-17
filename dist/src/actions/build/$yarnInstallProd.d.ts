/** @format */
import { ActionListExecutor } from '../../apps/runner/lib/types';
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
export declare const $yarnInstallProd: ActionListExecutor;
export default $yarnInstallProd;
