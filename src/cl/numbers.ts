/** @format */

import Ajv, {Schema, JSONSchemaType, ValidateFunction} from 'ajv';
import {JTDDataType} from 'ajv/dist/jtd';
import {validateArgs} from '../eval/validate-args';
import {
  ExecutorFn,
  Actions,
  Atom,
  Parameter,
  Parameters,
  ensureNumber,
} from '../eval/sexpr';
import {State} from '../eval/environment';
import {Logger} from '../lib/log';

/**
 * @module cl/numbers
 * CLHS chapter 12 "Numbers": arithmetic, comparison, zerop, parse-integer.
 * The generic `operators` machinery is exported — cl/data-and-control-flow
 * reuses it for and/or/not, src/jl for the `%` JL-ism.
 */

/* const schema: Schema = {
  type: 'array',
  minItems: 2,
  items: [{type: 'integer'}, {type: 'integer'}],
  additionalItems: false,
};

const ajv = new Ajv({allowUnionTypes: true});
let validate: ValidateFunction<JTDDataType<typeof schema>> =
  ajv.compile(schema);

const data = [11, 22];
// const data = [11,22,33]
// const data = [11]

if (validate(data)) {
  // data is MyData here
  console.log('>>> OK', data);
} else {
  console.log(validate.errors);
}
 */

type LogicalUnaryFn = (a: boolean) => boolean;
const logicalUnaryFns: Record<string, LogicalUnaryFn> = {
  not: (a: boolean): boolean => !a,
};

function calcUnary(op: string, val: any) {
  switch (op) {
    case '+':
      return +val;
    case '-':
      return -val;
    case '*':
      return val;
    case '/':
      return 1 / val;
    case '=':
    case '/=':
    case '>':
    case '<':
    case '>=':
    case '<=':
    case 'and':
    case 'or':
      return true;
    case 'min':
    case 'max':
      return val;
    case 'not':
      return logicalUnaryFns[op](val);
    case 'mod':
    case 'rem':
    default:
      throw new Error(`Invalid u-nary operation ${op}`);
  }
}

type ArithBinaryOps =
  | '+'
  | '-'
  | '*'
  | '/'
  | /* 'rem'| */ 'mod'
  | 'max'
  | 'min';
type ArithBinaryMap = Record<ArithBinaryOps, ArithBinaryFn>;
type ArithBinaryFn = (a: number, b: number) => number;
const arithBinaryOps = [
  '+',
  '-',
  '*',
  '/',
  /*'rem',*/ 'mod',
  'max',
  'min',
] as const;
// type ArithBinaryOps = typeof arithBinaryOps[number];
// const arithBiFns: Record<ArithBinaryOps, ArithBinaryFn> = {
const arithBiFns: Record<ArithBinaryOps, ArithBinaryFn> = {
  '+': (a: number, b: number): number => a + b,
  '-': (a: number, b: number): number => a - b,
  '*': (a: number, b: number): number => a * b,
  '/': (a: number, b: number): number => a / b,
  // 'rem':
  mod: (a: number, b: number): number => a % b,
  max: (a: number, b: number): number => (a < b ? b : a),
  min: (a: number, b: number): number => (a > b ? b : a),
} as const;
// type ArithBinaryOps = keyof typeof arithBiFns;

type ArithComparisonOps = '=' | '/=' | '>' | '<' | '>=' | '<=';
type ArithComparisonFn = (a: number, b: number) => boolean;
const arithBiComp: Record<ArithComparisonOps, ArithComparisonFn> = {
  '=': (a: number, b: number): boolean => a === b,
  '/=': (a: number, b: number): boolean => a !== b,
  '>': (a: number, b: number): boolean => a > b,
  '<': (a: number, b: number): boolean => a < b,
  '>=': (a: number, b: number): boolean => a >= b,
  '<=': (a: number, b: number): boolean => a <= b,
};

// (the old calcBinary/biMap chain machinery was removed — see the CL
// comparison semantics note below)

/**
 * CL comparison semantics:
 * - `= < > <= >=` hold when every ADJACENT pair satisfies the relation
 *   (monotone chain), e.g. (< 1 2 3);
 * - `/=` holds when ALL PAIRS are distinct, e.g. (/= 1 2 1) => NIL;
 * - `and`/`or` fold over all arguments (boolean approximation of CL's
 *   last-value/first-value results — documented JL divergence).
 * The previous machinery returned only the LAST pair's result, so
 * (/= 1 1 2) and (and NIL T T) were wrong; `%`/`rem` were unmapped and
 * threw on two args.
 */
const chainComparisonOps = ['=', '>', '<', '>=', '<='] as const;

// CL: mod is floor-mod; rem (and the `%` JL-ism) is truncate-rem (JS %)
const arithFoldFns: Record<string, (a: number, b: number) => number> = {
  ...arithBiFns,
  mod: (a, b) => ((a % b) + b) % b,
  rem: (a, b) => a % b,
  '%': (a, b) => a % b,
};

export const operators: ExecutorFn = async function (action, args, state) {
  const {evaluate} = state;
  validateArgs(args, {minCount: 1});

  if (args.length === 1) {
    const v1 = await evaluate(args[0]);
    return calcUnary(action, v1);
  }

  const values: any[] = [];
  for (const p of args) {
    values.push(await evaluate(p));
  }

  // all-pairs-distinct
  if (action === '/=') {
    for (let i = 0; i < values.length; i++)
      for (let j = i + 1; j < values.length; j++)
        if (values[i] === values[j]) return false;
    return true;
  }

  // monotone chain over adjacent pairs
  if ((chainComparisonOps as readonly string[]).includes(action)) {
    const fn = arithBiComp[action as ArithComparisonOps];
    for (let i = 1; i < values.length; i++)
      if (!fn(values[i - 1], values[i])) return false;
    return true;
  }

  // logical fold
  if (action === 'and') return values.every((v) => !!v);
  if (action === 'or') return values.some((v) => !!v);

  // arithmetic fold
  const fn = arithFoldFns[action];
  if (typeof fn !== 'function') {
    throw new Error(`Invalid bi-nary operation ${action}`);
  }
  return values.reduce((acc, v) => fn(acc, v));
};

type Reducer<T, U> = (
  previousValue: U,
  currentValue: T,
  currentIndex: number,
  array: T[],
  stopFn: () => void
) => U;

const reduce = /*async*/ function <T extends U, U>(
  // ...args: [
  arr: T[],
  reducer: Reducer<T, U>,
  initial?: U
  //   // initial: A
  // ]
): /* Promise< */ U /* > */ {
  // const [arr, reducer, initial] = args;
  let start = 0;
  // let acc = typeof initial === 'undefined' ? await evaluate(arr[start++]) : await evaluate(initial);
  // initial = typeof initial === 'undefined' ? arr[start++] : initial;
  // let acc = await evaluate(initial);
  // let acc = initial;
  // let acc = args.length === 2 ? arr[start++] : initial;
  let acc: T | U = typeof initial === 'undefined' ? arr[start++] : initial;
  let stop = false;
  for (let i = start; i < arr.length; i++) {
    // const curr = await evaluate(arr[i]);
    const curr = arr[i];
    const new_acc = /* await */ reducer(acc, curr, i, arr, () => (stop = true));
    if (stop) break;
    acc = new_acc;
  }
  return acc;
};

const pReduce = async function <T>(
  ...args: [
    arr: Parameter[],
    reducer: Reducer<Parameter, Atom>,
    // initial?: AtomDefinition,
    dflt?: Atom,
  ]
): Promise<Atom> {
  const [arr, reducer, /* initial, */ dflt] = args;
  if (arr.length === 0) {
    return dflt;
  } else if (arr.length === 1) {
    return reducer(dflt, arr[0], 0, arr, () => undefined);
  }
  return reduce<Parameter, Atom>(arr, reducer);

  // let start = 0;
  // // let acc = typeof initial === 'undefined' ? await evaluate(arr[start++]) : await evaluate(initial);
  // // initial = typeof initial === 'undefined' ? arr[start++] : initial;
  // // let acc = await evaluate(initial);
  // // let acc = args.length === 2 ? arr[start++] : initial;
  // let acc = arr[start++];
  // let stop = false;
  // for (let i = start; i < arr.length; i++) {
  //   // const curr = await evaluate(arr[i]);
  //   const curr = arr[i];
  //   const new_acc = reducer(acc, curr, i, arr, () => (stop = true));
  //   if (stop) break;
  //   acc = new_acc;
  // }
  // return acc;
};

//

const plog = function (logger: Logger) {
  return async function (res: Promise<Parameter>): Promise<Parameter> {
    const result = await res;
    logger.log(result);
    return result;
  };
};

//

/**
 * String concatenation
 * In brief: `concatenate` & `strcat`
 *
 * @name concatenate
 * @description
 * {@link http://www.ulisp.com/show?3L#concatenate}
 *
 * {@link https://stackoverflow.com/questions/53043195/string-addition-assignment-in-lisp}
 * {@link http://clhs.lisp.se/Body/f_concat.htm}
 */

export const actions: Actions = {
  /** @name + */
  '+': async (action, params, {evaluate, logger}) => {
    return plog(logger)(
      pReduce(
        params,
        async (acc, p) =>
          <number>await evaluate(acc) + <number>await evaluate(p),
        0
      )
    );
  },

  /** @name - */
  '-': async (action, params, {evaluate, logger}) =>
    plog(logger)(
      pReduce(
        params,
        async (acc, p, i, arr, stop) =>
          <number>await evaluate(acc) - <number>await evaluate(p),
        0
      )
    ),

  /** @name * */
  '*': async (action, params, {evaluate, logger}) =>
    plog(logger)(
      pReduce(
        params,
        async (acc, p, i, arr, stop) =>
          <number>await evaluate(acc) * <number>await evaluate(p),
        1
      )
    ),

  /** @name / */
  '/': async (action, params, {evaluate, logger}) =>
    plog(logger)(
      pReduce(
        params,
        async (acc, p, i, arr, stop) =>
          <number>await evaluate(acc) / <number>await evaluate(p),
        1
      )
    ),

  /** @name 1+ */
  '1+': async (action, args, {evaluate, logger}) => {
    validateArgs(args, {exactCount: 1});
    return evaluate(['+', ...args, 1]);
  },

  /** @name 1- */
  '1-': async (action, args, {evaluate, logger}) => {
    validateArgs(args, {exactCount: 1});
    return evaluate(['-', ...args, 1]);
  },

  /** @name = */
  '=': operators,
  /** @name /= */
  '/=': operators,
  /** @name > */
  '>': operators,
  /** @name < */
  '<': operators,
  /** @name >= */
  '>=': operators,
  /** @name <= */
  '<=': operators,
  /** @name min */
  min: operators,
  /** @name max */
  max: operators,
  /** @name mod */
  mod: operators,
  /** @name rem */
  rem: operators,

  /** @name zerop */
  zerop: async function (_, args, {evaluate, logger}) {
    validateArgs(args, {exactCount: 1});
    const value = await evaluate(args[0]);
    ensureNumber(value);
    return evaluate(['=', value, 0]);
  },

  /**
   * @name parse-integer
   * @summary Convert string (decimal, binary etc) to number
   * @see
   * {@link https://stackoverflow.com/questions/57565902/convert-binary-string-to-number}<br>
   */
  'parse-integer': async function (a, params, {evaluate}) {
    return parseInt(String(await evaluate(params[0])));
  },
};
export default actions;
