/** @format */

import {Scopes} from '@utilities/object';
import {Logger, LogPrefix} from '../../../lib/log';
import {inspect} from 'util';
import {Runner} from '../runner';
import {GenericInterpreter} from './GenericInterpreter';

export const T = true;
export const isT = (value: any): boolean => value === true;

export const NIL = false;
export const isNil = (value: any): boolean =>
  isEmptyList(value) || value === false;

export type EvaluateFn = (parameter: Parameter) => Promise<Parameter>;

export interface ActionMethodState<A> {
  // name: string;
  // parameters: Parameters;
  evaluate: EvaluateFn;
  // id: number | string;
  // level: number;
  // scopes: Scopes<Atom>;
  scopes: Scopes<A>;
  runner: GenericInterpreter;
  actions: Actions;
  logger: Logger;
}

export type ActionListExecutor = (
  // this: ActionMethodState,
  name: string,
  parameters: Parameters,
  state: ActionMethodState<Atom>
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
export type Expression = Atom | List | ActionListExecutor;

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

// export function ensureListOrSymb(val: Parameter,
// msg: string = ''): asserts val is List | Symb {
//   const types = ['string'];
//   if (typeof val !== 'string') {
//     throw new Error(notOfTypeMsg(val, 'string', msg));
//   }
// }

export function ensureList_logger(
  val: Parameter,
  logger: Logger
): asserts val is List {
  try {
    ensureList(val);
  } catch (e) {
    if (logger) {
      logger.fatal((e as Error).message);
    } else {
      throw e;
    }
  }
}

//

// export type ActionList = [name: ActionName, ...parameters: Parameter[]];

export type ActionDefinition = ActionName | ActionListExecutor | Expression;

export type Actions = {
  [name: string]: ActionDefinition;
};
