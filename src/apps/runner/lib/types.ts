/** @format */

import {inspect} from 'util';
import {State} from './state';

export const T = true;
export const isT = (value: any): boolean => value === true;

export type NIL = false;
export const NIL = false;
export const isNil = (value: any): boolean =>
  isEmptyList(value) || value === false;

export type EvaluateFn = (expr: Expression) => Promise<Parameter>;

export type ExecutorFn = (
  // this: ActionMethodState,
  name: string,
  args: Parameters,
  state: State
) => Promise<Parameter>;

export type Atom =
  | undefined
  | boolean
  | number
  | bigint
  | string
  // | symbol
  | null
  | object;
const atomDefinitionTypes = [
  'undefined',
  'boolean',
  'number',
  'bigint',
  'string',
  // 'symbol',
  'object',
] as const;

export const isAtom = (value: any): value is Atom =>
  // atomDefinitionTypes.indexOf(typeof value) >= 0 ||
  // value === null
  !Array.isArray(value);

export type GenericList<Atom> = (Atom | GenericList<Atom>)[];

export type List = GenericList<Atom>;
export type Expression = Atom | List | ExecutorFn;

export type Parameter = Expression;
export type Parameters = Parameter[];

export type ActionName = string;
//

type Symb = string;

export const isString = (value: any): value is string =>
  typeof value === 'string';

export const isSymbol = isString;

export const isList = (value: any): value is List => Array.isArray(value);

export const isEmptyList = (value: any): boolean =>
  Array.isArray(value) && value.length === 0;

const notOfTypeMsg = (value: Parameter, expType: string, msg: string = '') => {
  const m = [`The value`, inspect(value), `is not of type`, expType];
  if (msg) m.unshift(msg, ':');
  return m.join(' ');
};

export function ensureList(
  val: Parameter,
  msg: string = ''
): asserts val is List {
  if (!isList(val)) {
    throw new Error(notOfTypeMsg(val, 'LIST', msg));
  }
}

export function ensureNumber(
  val: Parameter,
  msg: string = ''
): asserts val is number {
  if (typeof val !== 'number') {
    throw new Error(notOfTypeMsg(val, 'number', msg));
  }
}

export function ensureString(
  val: Parameter,
  msg: string = ''
): asserts val is string {
  if (typeof val !== 'string') {
    throw new Error(notOfTypeMsg(val, 'string', msg));
  }
}

export function ensureFunction(
  val: Parameter,
  msg: string = ''
): asserts val is Function {
  if (typeof val !== 'function') {
    throw new Error(notOfTypeMsg(val, 'function', msg));
  }
}

export type ActionDefinition = ActionName | ExecutorFn | Expression;

export type Actions = {
  [name: string]: ActionDefinition;
};
