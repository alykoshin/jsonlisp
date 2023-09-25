"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const ajv_1 = __importDefault(require("ajv"));
const util_1 = require("../../lib/util");
const schema = {
    type: 'array',
    minItems: 2,
    items: [{ type: 'integer' }, { type: 'integer' }],
    additionalItems: false,
};
const ajv = new ajv_1.default({ allowUnionTypes: true });
let validate = ajv.compile(schema);
const data = [11, 22];
// const data = [11,22,33]
// const data = [11]
if (validate(data)) {
    // data is MyData here
    console.log('>>> OK', data);
}
else {
    console.log(validate.errors);
}
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
const logicalBiFns = {
    and: (a, b) => a && b,
    or: (a, b) => a || b,
};
const biMap = {
    ...arithBiFns,
    ...arithBiComp,
    ...logicalBiFns,
};
// type binaryOps = keyof typeof biOps;
function calcBinary(op, val1, val2) {
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
            return { result: res, last: val2, stop: false };
        default:
            throw new Error(`Invalid bi-nary operation ${op}`);
        // throw new Error(`Invalid opCode "${op}"`);
    }
}
async function operators(action, params, state) {
    const { runner } = state;
    (0, util_1.fn_check_params)(params, { minCount: 1 });
    // logger.debug(`operator ${[p1, ...p_rest].join(String(action))}`);
    // const v1 = await runner.eval(p1, state);
    if (params.length === 1) {
        const v1 = await runner.eval(params[0], state);
        return calcUnary(action, v1);
        // return calcUnary(action, await runner.eval(params[0], state));
    }
    else {
        let res;
        const [p1, ...p_rest] = params;
        let v_prev = await runner.eval(p1, state);
        // let v_prev = v1;
        for (const p_curr of p_rest) {
            const v_curr = await runner.eval(p_curr, state);
            const { result, last, stop } = calcBinary(action, v_prev, v_curr);
            res = result;
            if (stop) {
                break;
            }
            v_prev = last; //currValue;
        }
        return res;
    }
}
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
exports.actions = {
    '+': async (action, params, { evaluate, logger }) => plog(logger)(pReduce(params, async (acc, p) => await evaluate(acc) + await evaluate(p), 0)),
    '-': async (action, params, { evaluate, logger }) => plog(logger)(pReduce(params, async (acc, p, i, arr, stop) => await evaluate(acc) - await evaluate(p), 0)),
    '*': async (action, params, { evaluate, logger }) => plog(logger)(pReduce(params, async (acc, p, i, arr, stop) => await evaluate(acc) * await evaluate(p), 1)),
    '/': async (action, params, { evaluate, logger }) => plog(logger)(pReduce(params, async (acc, p, i, arr, stop) => await evaluate(acc) / await evaluate(p), 1)),
    '%': operators,
    '=': operators,
    '/=': operators,
    '>': operators,
    '<': operators,
    '>=': operators,
    '<=': operators,
    min: operators,
    max: operators,
    mod: operators,
    rem: operators,
    and: operators,
    or: operators,
    not: operators,
};
exports.default = exports.actions;
//# sourceMappingURL=operators.js.map