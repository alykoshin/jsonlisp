import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
export interface CleanupAction {
    action: 'cleanup';
    dirs: string[];
}
export declare function action_cleanup(definition: CleanupAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
