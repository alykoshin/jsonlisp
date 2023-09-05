import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
export interface CopyResourcesRecursiveAction {
    action: 'copyResourcesRecursive';
    sourceDir: string;
    excludeDirs: string[];
    targetDir: string;
}
export declare function action_copyResourcesRecursive(definition: CopyResourcesRecursiveAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
