import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
export interface BuildAction {
    action: 'build';
    config: {
        cwd: string;
        env: {
            [key: string]: string;
        };
    };
}
export declare function action_build(definition: BuildAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
