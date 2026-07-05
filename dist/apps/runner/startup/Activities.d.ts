/** @format */
import { ActionDefinition, Actions } from '../../../eval/sexpr';
import type { Require } from '../../../actions';
import { ErrorLevel } from '../../../lib/log';
import { Plugin, Plugins } from '../../../lib/Plugins';
export type ActivityActionsDefinition = Actions & {
    default: ActionDefinition;
};
export interface Activity extends Plugin {
    base_dir: string;
    version: string;
    logLevel?: ErrorLevel;
    /**
     * Vocabulary packages this activity needs, like CL's (require :sb-posix).
     * Core (cl/jmc/jl) is always loaded. Entries: 'name' (bare + qualified
     * action names), {name, use: false} (qualified names only — CL's
     * "don't use-package" discipline), or a group (sbcl/quicklisp/host).
     * Omitted -> the full vocabulary (backward compatible).
     */
    requires?: Require[];
    actions: ActivityActionsDefinition;
}
export declare class Activities extends Plugins<Activity> {
    actions(): Actions;
    logLevel(): ErrorLevel;
    /**
     * Union of `requires` across all plugged activities; undefined when no
     * activity declares one (-> full vocabulary).
     */
    requires(): Require[] | undefined;
}
