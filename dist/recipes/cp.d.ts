import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
export interface CpAction {
    action: 'cp';
    source: string | string[];
    dest: string;
    dry: boolean;
}
export declare function action_cp(definition: CpAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
