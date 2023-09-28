import { ActionMethodState, Parameters } from "../../lib/runner";
export type CopyResourcesRecursiveActionConfig = {
    sourceDir: string;
    excludeDirs: string[];
    targetDir: string;
};
export declare function $copyResourcesRecursive(action: string, parameters: Parameters, state: ActionMethodState): Promise<void>;
