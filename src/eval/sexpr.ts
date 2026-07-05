/** @format */

/**
 * @module eval/sexpr
 * [model] The S-expression data model: Atom, List, Expression — plus
 * structural type guards. Language-agnostic: truthiness (T/NIL) lives in
 * kernel/booleans (see ARCHITECTURE.md).
 */

import {inspect} from 'util';
import type {State} from './environment';

//---------------------------------------------------------------------------//

type JsTypeNames = 'array' | 'boolean' | 'number' | 'function' | 'string';
type JsType = Array<any> | boolean | number | Function | string;

const jsTypeCheck: Record<JsTypeNames, (value: any) => boolean> = {
  array(value: any): boolean {
    return Array.isArray(value);
  },
  boolean(value: any): boolean {
    return typeof value === 'boolean';
  },
  function(value: any): boolean {
    return typeof value === 'function';
  },
  number(value: any): boolean {
    return typeof value === 'number';
  },
  string(value: any): boolean {
    return typeof value === 'string';
  },
};

/***********************************************************************************/

type JlTypeNames =
  | 'atom'
  | 'list'
  | 'boolean'
  | 'number'
  | 'function'
  | 'string';

const jlTypeCheck: Record<JlTypeNames, (value: any) => boolean> = {
  atom(value: any): value is Atom {
    return !jsTypeCheck.array(value) || value.length === 0;
  },
  list(value: any): value is List {
    return jsTypeCheck.array(value);
  },
  boolean(value: any): value is boolean {
    return typeof value === 'boolean';
  },
  function(value: any): value is Function {
    return typeof value === 'function';
  },
  number(value: any): value is number {
    return typeof value === 'number';
  },
  string(value: any): value is string {
    return typeof value === 'string';
  },
};

//---------------------------------------------------------------------------//

const notOfTypeMsg = (value: Parameter, expType: string, msg: string = '') => {
  const m = [`The value`, inspect(value), `is not of type`, expType];
  if (msg) m.unshift(msg, ':');
  return m.join(' ');
};

export function ensureGenericType<T = JsType>(
  type: keyof typeof jsTypeCheck,
  val: any,
  msg: string = ''
): asserts val is T {
  const fn = jsTypeCheck[type];
  if (!fn(val)) {
    throw new Error(notOfTypeMsg(val, type, msg));
  }
}

//---------------------------------------------------------------------------//

export type Atom =
  | undefined
  | boolean
  | number
  | bigint
  | string
  // | symbol
  | null
  | object;

export const isAtom = (value: any): value is Atom => jlTypeCheck.atom(value);

/******************************************************************************
 * boolean (structural only — generalized booleans are in kernel/booleans)
 */

export function ensureBoolean(
  val: Parameter,
  msg: string = ''
): asserts val is boolean {
  ensureGenericType<boolean>('boolean', val, msg);
}

/******************************************************************************
 * number
 */

export function asNumber(p: Parameter): number {
  ensureNumber(p);
  return p;
}

export function ensureNumber(
  val: Parameter,
  msg: string = ''
): asserts val is number {
  ensureGenericType<number>('number', val, msg);
}

/******************************************************************************
 * string
 */

export function isString(val: any): val is string {
  return jsTypeCheck.string(val);
}

export function ensureString(
  val: Parameter,
  msg: string = ''
): asserts val is string {
  ensureGenericType<string>('string', val, msg);
}

/******************************************************************************
 * Function
 */

export function isFunction(val: any): val is Function {
  return jsTypeCheck.function(val);
}

export type ExecutorFn = {
  (name: string, args: Parameters, state: State): Promise<Parameter>;
  /**
   * Marks closures made by kernel/lambda's createExecutorFn: applicative —
   * the evaluator evlis-es their arguments at the call site (SICP §4.1,
   * CLHS 3.1.2.1.2.3) and the closure only binds values. Absent = special
   * form: receives raw, unevaluated arguments (divergence 1, ARCHITECTURE.md).
   */
  isClosure?: boolean;
};

export function ensureFunction(
  val: Parameter,
  msg: string = ''
): asserts val is Function {
  ensureGenericType<Function>('function', val, msg);
}

/******************************************************************************
 * List
 */

export const isList = (v: any): v is List => jlTypeCheck.list(v);

export function asList(p: Parameter): Parameters {
  ensureList(p);
  return p;
}

export function ensureList(
  val: Parameter,
  msg: string = ''
): asserts val is List {
  if (!isList(val)) {
    throw new Error(notOfTypeMsg(val, 'LIST', msg));
  }
}

export const isEmptyList = (value: any): boolean =>
  jsTypeCheck.array(value) && value.length === 0;

/******************************************************************************/

export type GenericList<Atom> = (Atom | GenericList<Atom>)[];

export type List = GenericList<Atom>;
export type Expression = Atom | List | ExecutorFn;

export type Parameter = Expression;
export type Parameters = Parameter[];

//

export type EvaluateFn = (expr: Expression) => Promise<Parameter>;

//

export type ActionName = string;

export type ActionDefinition = ActionName | ExecutorFn | Expression;

export type Actions = {
  [name: string]: ActionDefinition;
};

/******************************************************************************/
