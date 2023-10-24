/** @format */
import { State } from './state';
export declare const T = true;
export declare const isT: (value: any) => boolean;
export type NIL = false;
export declare const NIL = false;
export declare const isNil: (value: any) => boolean;
export type EvaluateFn = (expr: Expression) => Promise<Parameter>;
export type ExecutorFn = (name: string, args: Parameters, state: State) => Promise<Parameter>;
export type Atom = undefined | boolean | number | bigint | string | null | object;
export declare const isAtom: (value: any) => value is Atom;
export type GenericList<Atom> = (Atom | GenericList<Atom>)[];
export type List = GenericList<Atom>;
export type Expression = Atom | List | ExecutorFn;
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
export type ActionDefinition = ActionName | ExecutorFn | Expression;
export type Actions = {
    [name: string]: ActionDefinition;
};
