/** @format */
import { ScopeObject } from '@utilities/object';
import { ErrorLevel } from '../../lib/log';
import type { Activities } from './startup/Activities';
import type { Atom, Actions } from '../../actions/lisp-like/helpers/types';
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
    init({ activities, scope, }?: {
        activities?: Activities;
        scope?: ScopeObject<Atom>;
    }): Promise<State>;
    start(args: string[], st: State): Promise<void>;
}
export {};
