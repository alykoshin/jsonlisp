/** @format */
import { ScopeObject } from '@utilities/object';
import { ErrorLevel } from '../../lib/log';
import type { Activity } from './lib/config';
import type { Atom, Actions } from './lib/types';
import { State } from './lib/state';
import { Tracer, TracerConstructorOptions } from './lib/tracer';
interface RunnerConstructorOptions extends TracerConstructorOptions {
    errorLevel?: ErrorLevel;
}
export declare class Runner {
    actions: Actions;
    tracer: Tracer;
    errorLevel?: ErrorLevel;
    constructor({ maxLevels, maxSteps, errorLevel, }?: RunnerConstructorOptions);
    init({ activity, scope, }?: {
        activity?: Activity;
        scope?: ScopeObject<Atom>;
    }): Promise<State>;
    start(args: string[], st: State): Promise<void>;
}
export {};
