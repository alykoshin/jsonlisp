import { ActionDefinition, ActionMethodState, Parameter, Parameters } from "../../lib/runner";
export type WhenAction = [
    action: 'when',
    testClause: Parameter,
    actionWhenTrue: ActionDefinition
];
export declare function when(action: string, parameters: Parameters, state: ActionMethodState): Promise<Parameter>;
export default when;
