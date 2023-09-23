import { ActionMethodState, Parameter, Parameters } from '../../lib/runner';
export declare function $parallel(action: string, parameters: Parameters, state: ActionMethodState): Promise<Parameter[]>;
export default $parallel;
