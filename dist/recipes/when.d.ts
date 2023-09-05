import { FullConfig } from '../lib/config';
import { ActionDefinition } from "./";
import { Runner } from "../lib/runner";
export type WhenAction = [
    action: 'sequential',
    testClause: boolean,
    action: ActionDefinition
];
export declare function action_when(definition: WhenAction, { id, fullConfig, runner }: {
    id: number | string;
    fullConfig: FullConfig;
    runner: Runner;
}): Promise<void>;
