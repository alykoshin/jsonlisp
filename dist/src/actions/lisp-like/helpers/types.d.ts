/** @format */
import { State } from '../../../apps/runner/lib/state';
type JsTypeNames = 'array' | 'boolean' | 'number' | 'function' | 'string';
type JsType = Array<any> | boolean | number | Function | string;
declare const jsTypeCheck: Record<JsTypeNames, (value: any) => boolean>;
export declare function ensureGenericType<T = JsType>(type: keyof typeof jsTypeCheck, val: any, msg?: string): asserts val is T;
export type Atom = undefined | boolean | number | bigint | string | null | object;
export declare const isAtom: (value: any) => value is Atom;
/******************************************************************************
 * boolean
 */
export declare const T = true;
export declare const isT: (value: any) => boolean;
export type NIL = false;
export declare const NIL = false;
export declare const isNil: (value: any) => boolean;
export declare const asBoolean: (value: Parameter) => boolean;
export declare function ensureBoolean(val: Parameter, msg?: string): asserts val is boolean;
/******************************************************************************
 * number
 */
export declare function asNumber(p: Parameter): number;
export declare function ensureNumber(val: Parameter, msg?: string): asserts val is number;
/******************************************************************************
 * string
 */
export declare function isString(val: any): val is string;
export declare function ensureString(val: Parameter, msg?: string): asserts val is string;
/******************************************************************************
 * Function
 */
export type ExecutorFn = (name: string, args: Parameters, state: State) => Promise<Parameter>;
export declare function ensureFunction(val: Parameter, msg?: string): asserts val is Function;
/******************************************************************************
 * List
 */
export declare const isList: (v: any) => v is List;
export declare function asList(p: Parameter): Parameters;
export declare function ensureList(val: Parameter, msg?: string): asserts val is List;
export declare const isEmptyList: (value: any) => boolean;
/******************************************************************************/
export type GenericList<Atom> = (Atom | GenericList<Atom>)[];
export type List = GenericList<Atom>;
export type Expression = Atom | List | ExecutorFn;
export type Parameter = Expression;
export type Parameters = Parameter[];
export type EvaluateFn = (expr: Expression) => Promise<Parameter>;
export type ActionName = string;
export type ActionDefinition = ActionName | ExecutorFn | Expression;
export type Actions = {
    [name: string]: ActionDefinition;
};
export {};
/******************************************************************************/
