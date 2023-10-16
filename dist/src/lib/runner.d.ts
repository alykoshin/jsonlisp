/** @format */
import { ScopeObject, Scopes } from '@utilities/object';
import { Logger, LogPrefix } from './log';
import { Activity } from './config';
import { Atom, Actions, ActionDefinition, ActionName, ActionListExecutor, Parameter } from './types';
type ActionArg = string;
type ActionWithParamsArg = string[];
export declare class Runner {
    maxLevels: number;
    maxSteps: number;
    scopes: Scopes<Atom>;
    actions: Actions;
    actionCount: number;
    constructor(options?: {
        maxLevels?: number;
        maxSteps?: number;
    });
    getActionImplementation(actionDefinition: ActionDefinition, logger: Logger<LogPrefix>): {
        name: ActionName;
        executor: ActionListExecutor;
        params: Parameter[];
    };
    start({ activity, action, scope, }: {
        activity: Activity | undefined;
        action: ActionArg | ActionWithParamsArg;
        scope: ScopeObject<Atom>;
    }): Promise<void>;
    eval(param: Parameter, { level, logger, }: {
        level: number;
        logger: Logger<LogPrefix>;
    }): Promise<Parameter>;
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
