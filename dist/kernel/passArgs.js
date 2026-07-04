"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passArgs = void 0;
/**
 * @module kernel/passArgs
 * Lambda-list binding: maps parameter names (&optional/&rest supported)
 * to argument values. Used by kernel/lambda's createExecutorFn.
 */
const assert_1 = __importDefault(require("assert"));
const sexpr_1 = require("../eval/sexpr");
const booleans_1 = require("./booleans");
class JLError extends Error {
    constructor(message) {
        super(message);
        // this.name = 'JLError';
        this.name = this.constructor.name;
    }
}
class KeywordNotSupportedError extends JLError {
    constructor(key) {
        super(`Keyword not supported: "${key}"`);
    }
}
const lessArgsErrorMsg = `Not enough arguments`;
class LessArgsError extends JLError {
    constructor() {
        super(lessArgsErrorMsg);
    }
}
function passArgs(names, values) {
    const res = {};
    let ni = 0; // names index
    let vi = 0; // values index
    let state = '&required'; // current state
    while (ni < names.length) {
        const n = names[ni];
        (0, sexpr_1.ensureString)(n, `Parameter name must be Symbol (ie string)`);
        if (n === '&key' || n === '&allow-other-keys') {
            throw new KeywordNotSupportedError(n);
        }
        if (n === '&optional' || n === '&rest') {
            state = n;
            ni++;
            continue;
        }
        //
        const v = values[vi];
        if (state === '&required') {
            if (vi >= values.length) {
                throw new LessArgsError();
            }
            res[n] = v;
            ni++;
            vi++;
        }
        else if (state === '&optional') {
            res[n] = booleans_1.NIL;
            ni++;
            vi++;
        }
        else if (state === '&rest') {
            if (!res[n])
                res[n] = [];
            (0, sexpr_1.ensureList)(res[n]);
            res[n].push(v);
            vi++;
            if (vi >= values.length) {
                break;
            }
        }
        // vi++;
    }
    return res;
}
exports.passArgs = passArgs;
function primitiveTest() {
    const log = (...args) => console.log(...args);
    assert_1.default.deepEqual(passArgs(['a', 'b'], [1, 2]), { a: 1, b: 2 });
    assert_1.default.deepEqual(passArgs(['a', 'b'], [1, 2, 3]), { a: 1, b: 2 });
    assert_1.default.deepEqual(passArgs(['a', 'b', '&optional', 'c'], [1, 2, 3]), {
        a: 1,
        b: 2,
        c: false,
    });
    try {
        log(passArgs(['a', 'b', 'c'], [1, 2]));
        throw new Error('throw error');
    }
    catch (e) {
        if (e.message === lessArgsErrorMsg) {
            // log('throws ok');
        }
        else {
            throw e;
        }
    }
    assert_1.default.deepEqual(passArgs(['a', 'b', '&rest', 'c'], [1, 2, 3, 4, 5]), {
        a: 1,
        b: 2,
        c: [3, 4, 5],
    });
}
primitiveTest();
//# sourceMappingURL=passArgs.js.map