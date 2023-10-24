/** @format */
import { EvaluateFn, Actions, Atom, Expression, Parameter } from './types';
import { Scopes } from '@utilities/object';
import { ErrorLevel, Logger } from '../../../lib/log';
import { Runner } from '../runner';
interface IStateInit {
    id?: number;
    level?: number;
    name?: string;
    names?: string[];
    runner: Runner;
    scopes?: Scopes<Atom>;
    logger?: Logger;
    errorLevel?: ErrorLevel;
}
export interface ILoggerState {
    id: number;
    level: number;
    names: string[];
}
export interface IState extends IStateInit {
    id: number;
    evaluate: EvaluateFn;
}
export declare class State implements IState, ILoggerState {
    id: number;
    level: number;
    names: string[];
    runner: Runner;
    scopes: Scopes<Atom>;
    actions: Actions;
    logger: Logger;
    constructor(init: IStateInit);
    evaluate(expr: Expression): Promise<Parameter>;
    new(): State;
    next(): State;
    up(name: string): State;
    newNextUp(name: string): State;
}
export {};
