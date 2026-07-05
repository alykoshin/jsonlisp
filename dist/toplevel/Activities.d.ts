/** @format */
import { ActionDefinition, Actions } from '../eval/sexpr';
import type { Require } from '../modules';
import { ErrorLevel } from '../lib/log';
import { Plugin, Plugins } from './Plugins';
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
    /**
     * Schema validation at load time (activity.schema.json via ajv): works
     * for every syntax (.jl.json5/.json/.ts/...) because JSON Schema applies
     * to the PARSED object — editor-side $schema support does not exist for
     * .json5, so this is the real enforcement. Lenient about extra keys,
     * strict about types of the known ones (catches `require:` vs
     * `requires:`-class typos).
     */
    _load(fname: string): Promise<Activity>;
    actions(): Actions;
    logLevel(): ErrorLevel;
    /**
     * Union of `requires` across all plugged activities; undefined when no
     * activity declares one (-> full vocabulary).
     */
    requires(): Require[] | undefined;
}
