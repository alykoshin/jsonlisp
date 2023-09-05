import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
export interface RmAction {
    action: 'rm';
    files: string | string[];
    dry: boolean;
}
export declare function action_rm(definition: RmAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
