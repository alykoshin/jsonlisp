/** @format */
import { ScopeObject } from '@utilities/object';
import type { Activity } from './lib/config';
import type { Atom, Actions, Parameter, Expression } from './lib/types';
import { type EvState, NewState } from './lib/state';
import { Tracer, TracerConstructorOptions } from './lib/tracer';
interface RunnerConstructorOptions extends TracerConstructorOptions {
}
export declare class Runner {
    actions: Actions;
    actionCount: number;
    tracer: Tracer;
    constructor({ maxLevels, maxSteps }?: RunnerConstructorOptions);
    init({ activity, scope, }?: {
        activity?: Activity;
        scope?: ScopeObject<Atom>;
    }): Promise<NewState>;
    start(args: string[], st: EvState): Promise<void>;
    evaluate(expr: Expression, st: EvState): Promise<Parameter>;
}
export {};
