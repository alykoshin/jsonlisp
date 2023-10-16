/** @format */
import { ActionMethodState, Parameters } from '../../lib/types';
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
export declare function $yarnInstallProd(action: string, params: Parameters, { logger }: ActionMethodState): Promise<string>;
export default $yarnInstallProd;
