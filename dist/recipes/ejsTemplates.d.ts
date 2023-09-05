import { FullConfig } from "../lib/config";
import { Runner } from "../lib/runner";
export interface EjsTemplatesAction {
    action: 'ejsTemplates';
    sourceDir: string;
    excludeDirs: string | string[];
    targetDir: string;
}
export declare function action_ejsTemplates(definition: EjsTemplatesAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
