import { ScopeObject, Scopes } from '@utilities/object';
import { Logger, LogPrefix } from './log';
import { Activity } from './config';
export interface ActionMethodState {
    name: string;
    evaluate: (parameter: Parameter) => Promise<Parameter>;
    id: number | string;
    level: number;
    activity: Activity;
    scopes: Scopes<AtomDefinition>;
    runner: Runner;
    logger: Logger<LogPrefix>;
}
export type ActionListExecutor = (name: string, parameters: Parameters, state: ActionMethodState) => Promise<any>;
export type AtomDefinition = undefined | boolean | number | bigint | string | null | object;
export type Parameter = AtomDefinition | ActionListDefinition;
export type Parameters = Parameter[];
export type ActionName = string;
export type ListDefinition = [...parameters: Parameter[]];
export type ActionListDefinition = [
    name: ActionName,
    ...parameters: Parameter[]
];
export type ActionDefinition = ActionName | ActionListExecutor | ActionListDefinition;
export type Actions = {
    [name: string]: ActionDefinition;
};
export declare class Runner {
    maxLevels: number;
    maxSteps: number;
    scopes: Scopes<AtomDefinition>;
    actions: Actions;
    actionCount: number;
    constructor(options?: {
        maxLevels?: number;
        maxSteps?: number;
    });
    getActionImplementation(actionDefinition: ActionDefinition): {
        name: ActionName;
        executor: ActionListExecutor;
        parameters: Parameter[];
    };
    start({ activity, action, scope, }: {
        activity: Activity;
        action: string | string[];
        scope: ScopeObject<AtomDefinition>;
    }): Promise<void>;
    eval(parameter: Parameter, { level, activity, logger, }: {
        activity: Activity;
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
