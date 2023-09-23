import { ActionMethodState, Parameters } from "../../lib/runner";
export type RmAction = [
    action: 'rm',
    ...files: string[]
];
export declare function $rm(action: string, parameters: Parameters, state: ActionMethodState): Promise<void>;
export default $rm;
