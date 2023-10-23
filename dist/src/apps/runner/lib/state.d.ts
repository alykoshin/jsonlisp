/** @format */
import { EvaluateFn, Actions, Atom, Expression, Parameter } from './types';
import { Scopes } from '@utilities/object';
import { Logger } from '../../../lib/log';
import { Runner } from '../runner';
export interface State {
    evaluate: EvaluateFn;
    scopes: Scopes<Atom>;
    runner: Runner;
    actions: Actions;
    logger: Logger;
}
export type EvState = Omit<State, 'evaluate'>;
export declare class NewState implements State {
    runner: Runner;
    scopes: Scopes<Atom>;
    actions: Actions;
    logger: Logger;
    constructor(init: Pick<State, 'runner' | 'scopes' | 'logger'>);
    evaluate(expr: Expression): Promise<Parameter>;
}
