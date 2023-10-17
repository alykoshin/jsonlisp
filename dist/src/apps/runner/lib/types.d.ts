/** @format */
import { Scopes } from '@utilities/object';
import { Logger } from '../../../lib/log';
import { GenericInterpreter } from './GenericInterpreter';
export declare const T = true;
export declare const isT: (value: any) => boolean;
export declare const NIL = false;
export declare const isNil: (value: any) => boolean;
export type EvaluateFn = (parameter: Parameter) => Promise<Parameter>;
export interface ActionMethodState<A> {
    evaluate: EvaluateFn;
    scopes: Scopes<A>;
    runner: GenericInterpreter;
    actions: Actions;
    logger: Logger;
}
export type ActionListExecutor = (name: string, parameters: Parameters, state: ActionMethodState<Atom>) => Promise<Parameter>;
export type Atom = undefined | boolean | number | bigint | string | null | object;
export declare const isAtom: (value: any) => value is Atom;
export type GenericList<Atom> = (Atom | GenericList<Atom>)[];
export type List = GenericList<Atom>;
export type Expression = Atom | List | ActionListExecutor;
export type Parameter = Expression;
export type Parameters = Parameter[];
export type ActionName = string;
export declare const isString: (value: any) => value is string;
export declare const isSymbol: (value: any) => value is string;
export declare const isList: (value: any) => value is List;
export declare const isEmptyList: (value: any) => boolean;
export declare function ensureList(val: Parameter, msg?: string): asserts val is List;
export declare function ensureNumber(val: Parameter, msg?: string): asserts val is number;
export declare function ensureString(val: Parameter, msg?: string): asserts val is string;
export declare function ensureFunction(val: Parameter, msg?: string): asserts val is Function;
export declare function ensureList_logger(val: Parameter, logger: Logger): asserts val is List;
export type ActionDefinition = ActionName | ActionListExecutor | Expression;
export type Actions = {
    [name: string]: ActionDefinition;
};
