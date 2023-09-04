import { FullConfig } from './config';
import { ActionDefinition } from '../recipes/';
export type ActionMethod = (definition: ActionDefinition, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}) => Promise<any>;
export type MultiAction = [
    action: string,
    ...actions: ActionDefinition[]
];
export declare class Runner {
    actionCount: number;
    extractAction(actionDefinition: ActionDefinition): {
        name: string;
        method: ActionMethod;
    };
    start(filename: string): Promise<void>;
    execute(actionConfig: ActionDefinition, fullConfig: FullConfig): Promise<void>;
    log(id: number | string, s: number | string): void;
    debug(id: number | string, s: number | string): void;
}
