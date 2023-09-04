import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
export interface ExecAction {
    action: 'exec';
    config: {
        command: string;
        cwd: string;
        env: {
            [key: string]: string;
        };
    };
}
export declare function action_exec(definition: ExecAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
