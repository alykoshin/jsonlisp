import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
import { ExecAction } from "./exec";
export interface YarnInstallProdAction {
    action: 'yarnInstallProd';
    config: {
        cwd: string;
        env: {
            [key: string]: string;
        };
    };
}
export declare function action_yarnInstallProd(definition: ExecAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
