/** @format */

import Ajv, {Schema, JSONSchemaType, ValidateFunction} from 'ajv';
import {JTDDataType} from 'ajv/dist/jtd';
import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {Runner} from '../../apps/runner/runner';
import {
  ExecutorFn,
  Actions,
  Atom,
  Parameter,
  Parameters,
} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';
import {start} from 'repl';
import {Logger} from '../../lib/log';

/**
 * @module operators
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

type LogicalComparisonOps = 'and' | 'or';
type LogicalBiFn = (a: boolean, b: boolean) => boolean;
const logicalBiFns: Record<LogicalComparisonOps, LogicalBiFn> = {
  and: (a: boolean, b: boolean): boolean => a && b,
  or: (a: boolean, b: boolean): boolean => a || b,
};

type BiOps = ArithBinaryOps | ArithComparisonOps | LogicalComparisonOps;
const biMap: typeof arithBiFns & typeof arithBiComp & typeof logicalBiFns = {
  ...arithBiFns,
  ...arithBiComp,
  ...logicalBiFns,
};
// type binaryOps = keyof typeof biOps;

function calcBinary(
  op: BiOps,
  val1: any,
  val2: any
): {result: any; last: any; stop: boolean} {
  switch (op) {
    case '+':
    case '-':
    case '/':
    case '*':
    case 'mod':
    case 'max':
    case 'min':
    case '=':
    case '/=':
    case '/=':
      const fn = biMap[op];
      if (typeof fn !== 'function') {
        throw new Error(`Invalid bi-nary operation ${op}`);
        // throw new Error(`Invalid opCode "${op}"`);
      }
      const res = fn(val1, val2);
      return {result: res, last: val2, stop: false};
    default:
      throw new Error(`Invalid bi-nary operation ${op}`);
    // throw new Error(`Invalid opCode "${op}"`);
  }
}

const operators: ExecutorFn = async function (action, args, state) {
  const {evaluate} = state;
  validateArgs(args, {minCount: 1});
  if (args.length === 1) {
    const v1 = await evaluate(args[0]);
    return calcUnary(action, v1);
  } else {
    let res;
    const [p1, ...p_rest] = args;
    let v_prev = await evaluate(p1);
    // let v_prev = v1;
    for (const p_curr of p_rest) {
      const v_curr = await evaluate(p_curr);
      const {result, last, stop} = calcBinary(action as BiOps, v_prev, v_curr);
      res = result;
      if (stop) {
        break;
      }
      v_prev = last; //currValue;
    }
    return res;
  }
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

  /** @name % */
  '%': operators,
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
  /** @name and */
  and: operators,
  /** @name or */
  or: operators,
  /** @name not */
  not: operators,
};
export default actions;
