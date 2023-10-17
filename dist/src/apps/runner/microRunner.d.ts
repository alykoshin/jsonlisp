/** @format */
import { Actions, Parameter, GenericList, Expression, ActionMethodState } from './lib/types';
import { GenericInterpreter } from './lib/GenericInterpreter';
export type MicroAtom = boolean | number | string;
export type MicroList = GenericList<MicroAtom>;
export declare class MicroInterpreter extends GenericInterpreter {
    actions: Actions;
    constructor({ actions }: {
        actions: Actions;
    });
    evaluate(expr: Expression, state?: ActionMethodState<MicroAtom>): Promise<Parameter>;
}
