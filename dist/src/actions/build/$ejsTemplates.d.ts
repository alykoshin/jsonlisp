/** @format */
import { ActionMethodState, Parameters } from '../../lib/runner';
export type EjsTemplatesActionConfig = {
    sourceDir: string;
    excludeDirs: string | string[];
    targetDir: string;
};
export declare function $ejsTemplates(action: string, parameters: Parameters, state: ActionMethodState): Promise<void>;
export default $ejsTemplates;
