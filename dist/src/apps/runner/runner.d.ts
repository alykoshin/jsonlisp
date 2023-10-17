/** @format */
import { ScopeObject, Scopes } from '@utilities/object';
import { Activity } from './lib/config';
import { Atom, Actions, Parameter, ActionMethodState } from './lib/types';
type ActionArg = string;
type ActionWithParamsArg = string[];
export declare class Runner<A> {
    maxLevels: number;
    maxSteps: number;
    scopes: Scopes<Atom>;
    actions: Actions;
    actionCount: number;
    constructor(opts?: {
        maxLevels?: number;
        maxSteps?: number;
    });
    start({ activity, action, scope, }: {
        activity: Activity | undefined;
        action: ActionArg | ActionWithParamsArg;
        scope: ScopeObject<Atom>;
    }): Promise<void>;
    evaluate(param: Parameter, state_?: ActionMethodState<Atom>): Promise<Parameter>;
    _incLevel(state: {
        level: number;
    }): void;
    _decLevel(state: {
        level: number;
    }): void;
    _incSteps(): number;
    _resetState(state: {
        level: number;
    }): void;
    _initState(): {
        level: number;
    };
}
export {};
