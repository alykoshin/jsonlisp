"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.operators = void 0;
const validate_args_1 = require("../eval/validate-args");
const sexpr_1 = require("../eval/sexpr");
const logicalUnaryFns = {
    not: (a) => !a,
};
function calcUnary(op, val) {
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
const arithBinaryOps = [
    '+',
    '-',
    '*',
    '/',
    /*'rem',*/ 'mod',
    'max',
    'min',
];
// type ArithBinaryOps = typeof arithBinaryOps[number];
// const arithBiFns: Record<ArithBinaryOps, ArithBinaryFn> = {
const arithBiFns = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    // 'rem':
    mod: (a, b) => a % b,
    max: (a, b) => (a < b ? b : a),
    min: (a, b) => (a > b ? b : a),
};
const arithBiComp = {
    '=': (a, b) => a === b,
    '/=': (a, b) => a !== b,
    '>': (a, b) => a > b,
    '<': (a, b) => a < b,
    '>=': (a, b) => a >= b,
    '<=': (a, b) => a <= b,
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
const chainComparisonOps = ['=', '>', '<', '>=', '<='];
// CL: mod is floor-mod; rem (and the `%` JL-ism) is truncate-rem (JS %)
const arithFoldFns = {
    ...arithBiFns,
    mod: (a, b) => ((a % b) + b) % b,
    rem: (a, b) => a % b,
    '%': (a, b) => a % b,
};
const operators = async function (action, args, state) {
    const { evaluate } = state;
    (0, validate_args_1.validateArgs)(args, { minCount: 1 });
    if (args.length === 1) {
        const v1 = await evaluate(args[0]);
        return calcUnary(action, v1);
    }
    const values = [];
    for (const p of args) {
        values.push(await evaluate(p));
    }
    // all-pairs-distinct
    if (action === '/=') {
        for (let i = 0; i < values.length; i++)
            for (let j = i + 1; j < values.length; j++)
                if (values[i] === values[j])
                    return false;
        return true;
    }
    // monotone chain over adjacent pairs
    if (chainComparisonOps.includes(action)) {
        const fn = arithBiComp[action];
        for (let i = 1; i < values.length; i++)
            if (!fn(values[i - 1], values[i]))
                return false;
        return true;
    }
    // logical fold
    if (action === 'and')
        return values.every((v) => !!v);
    if (action === 'or')
        return values.some((v) => !!v);
    // arithmetic fold
    const fn = arithFoldFns[action];
    if (typeof fn !== 'function') {
        throw new Error(`Invalid bi-nary operation ${action}`);
    }
    return values.reduce((acc, v) => fn(acc, v));
};
exports.operators = operators;
const reduce = /*async*/ function (
// ...args: [
arr, reducer, initial
//   // initial: A
// ]
) {
    // const [arr, reducer, initial] = args;
    let start = 0;
    // let acc = typeof initial === 'undefined' ? await evaluate(arr[start++]) : await evaluate(initial);
    // initial = typeof initial === 'undefined' ? arr[start++] : initial;
    // let acc = await evaluate(initial);
    // let acc = initial;
    // let acc = args.length === 2 ? arr[start++] : initial;
    let acc = typeof initial === 'undefined' ? arr[start++] : initial;
    let stop = false;
    for (let i = start; i < arr.length; i++) {
        // const curr = await evaluate(arr[i]);
        const curr = arr[i];
        const new_acc = /* await */ reducer(acc, curr, i, arr, () => (stop = true));
        if (stop)
            break;
        acc = new_acc;
    }
    return acc;
};
const pReduce = async function (...args) {
    const [arr, reducer, /* initial, */ dflt] = args;
    if (arr.length === 0) {
        return dflt;
    }
    else if (arr.length === 1) {
        return reducer(dflt, arr[0], 0, arr, () => undefined);
    }
    return reduce(arr, reducer);
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
const plog = function (logger) {
    return async function (res) {
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
exports.actions = {
    /** @name + */
    '+': async (action, params, { evaluate, logger }) => {
        return plog(logger)(pReduce(params, async (acc, p) => await evaluate(acc) + await evaluate(p), 0));
    },
    /** @name - */
    '-': async (action, params, { evaluate, logger }) => plog(logger)(pReduce(params, async (acc, p, i, arr, stop) => await evaluate(acc) - await evaluate(p), 0)),
    /** @name * */
    '*': async (action, params, { evaluate, logger }) => plog(logger)(pReduce(params, async (acc, p, i, arr, stop) => await evaluate(acc) * await evaluate(p), 1)),
    /** @name / */
    '/': async (action, params, { evaluate, logger }) => plog(logger)(pReduce(params, async (acc, p, i, arr, stop) => await evaluate(acc) / await evaluate(p), 1)),
    /** @name 1+ */
    '1+': async (action, args, { evaluate, logger }) => {
        (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
        return evaluate(['+', ...args, 1]);
    },
    /** @name 1- */
    '1-': async (action, args, { evaluate, logger }) => {
        (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
        return evaluate(['-', ...args, 1]);
    },
    /** @name % */
    '%': exports.operators,
    /** @name = */
    '=': exports.operators,
    /** @name /= */
    '/=': exports.operators,
    /** @name > */
    '>': exports.operators,
    /** @name < */
    '<': exports.operators,
    /** @name >= */
    '>=': exports.operators,
    /** @name <= */
    '<=': exports.operators,
    /** @name min */
    min: exports.operators,
    /** @name max */
    max: exports.operators,
    /** @name mod */
    mod: exports.operators,
    /** @name rem */
    rem: exports.operators,
    /** @name zerop */
    zerop: async function (_, args, { evaluate, logger }) {
        (0, validate_args_1.validateArgs)(args, { exactCount: 1 });
        const value = await evaluate(args[0]);
        (0, sexpr_1.ensureNumber)(value);
        return evaluate(['=', value, 0]);
    },
    /**
     * @name parse-integer
     * @summary Convert string (decimal, binary etc) to number
     * @see
     * {@link https://stackoverflow.com/questions/57565902/convert-binary-string-to-number}<br>
     */
    'parse-integer': async function (a, params, { evaluate }) {
        return parseInt(String(await evaluate(params[0])));
    },
};
exports.default = exports.actions;
//# sourceMappingURL=numbers.js.map