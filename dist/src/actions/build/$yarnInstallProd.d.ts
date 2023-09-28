/** @format */
import { ActionMethodState, Parameters } from '../../lib/runner';
export type YarnInstallProdActionConfig = {
    cwd?: string;
    env?: {
        [key: string]: string;
    };
};
export declare function $yarnInstallProd(action: string, params: Parameters, { logger }: ActionMethodState): Promise<string>;
export default $yarnInstallProd;
