/** @format */
import { ExecutorFn } from '../../eval/sexpr';
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
