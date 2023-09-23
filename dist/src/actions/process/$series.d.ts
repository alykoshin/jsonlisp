import { ActionMethodState, AtomDefinition, Parameters } from "../../lib/runner";
export declare function $series(action: string, parameters: Parameters, state: ActionMethodState): Promise<AtomDefinition[]>;
export default $series;
