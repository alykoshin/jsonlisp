import { ActionMethodState, Parameters } from "../../lib/runner";
export type YarnInstallProdActionConfig = {
    cwd?: string;
    env?: {
        [key: string]: string;
    };
};
export declare function $yarnInstallProd(action: string, parameters: Parameters, state: ActionMethodState): Promise<void>;
export default $yarnInstallProd;
