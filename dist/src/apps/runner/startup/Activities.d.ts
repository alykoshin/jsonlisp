/** @format */
import { ActionDefinition, Actions } from '../lib/types';
import { ErrorLevel } from '../../../lib/log';
import { Plugin, Plugins } from '../../../lib/Plugins';
export type ActivityActionsDefinition = Actions & {
    default: ActionDefinition;
};
export interface Activity extends Plugin {
    base_dir: string;
    version: string;
    logLevel?: ErrorLevel;
    actions: ActivityActionsDefinition;
}
export declare class Activities extends Plugins<Activity> {
    actions(): {};
}
