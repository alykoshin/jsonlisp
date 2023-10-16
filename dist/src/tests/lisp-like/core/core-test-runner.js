"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const util_1 = require("util");
const runner_1 = require("../../../lib/runner");
const types_1 = require("../../../lib/types");
const helpers_1 = require("../../../actions/$sbcl/helpers");
const primitives_1 = __importDefault(require("../../../actions/lisp-like/core/primitives"));
const exec_1 = require("../../../actions/lisp-like/helpers/exec");
const log_1 = require("../../../lib/log");
const object_1 = require("@utilities/object");
const primitives_cases_1 = __importDefault(require("./primitives.cases"));
const logger = new log_1.Logger({ id: 0, level: 0 }, 'info');
const sbcl = async function (s) {
    const c = (0, helpers_1.get_sbcl_cmd)(s);
    const { stdout } = await (0, exec_1.execute)(c, {}, { logger });
    const parsed = (0, helpers_1.parse_sbcl_list)(stdout, { logger });
    return { raw: stdout, parsed };
};
// export interface ListExecutorMap {
// [name: string]: ListExecutor;
// }
const functions = {
    ...primitives_1.default,
};
const microEvaluate = async function (expr) {
    if ((0, types_1.isList)(expr) && !(0, types_1.isEmptyList)(expr)) {
        const [op, ...args] = expr;
        (0, types_1.ensureString)(op);
        const fn = functions[op];
        (0, types_1.ensureFunction)(fn);
        try {
            return fn.call(fakeState, op, args, fakeState);
        }
        catch (e) {
            e.message = `Operation ${op} : ` + e.message;
            throw e;
        }
    }
    else {
        return expr;
    }
};
const fakeState = {
    id: '',
    level: 0,
    name: '',
    runner: new runner_1.Runner(),
    scopes: new object_1.Scopes(),
    logger,
    evaluate: microEvaluate,
};
const COL_WIDTH = [60, 15, 40, 15, 15, 5];
function printCell(s, width = 40, padChar = ' ') {
    process.stdout.write(' | ' + s.padEnd(width, padChar));
}
function printCells(ss, padChar = ' ') {
    ss.forEach((s, i) => printCell(s, COL_WIDTH[i], padChar));
    printEnd();
}
function printEnd() {
    process.stdout.write(' |\n');
}
async function run() {
    printCells(['JL',
        'CLISP',
        'actual',
        'expected/raw',
        'expected/parsed',
        'OK?',
    ]);
    printCells(['', '', '', '', '', ''], '-');
    let failed = 0;
    for (const i in primitives_cases_1.default) {
        let col = 0;
        const a = primitives_cases_1.default[i][0];
        // const s1 = inspect(a);
        const s0 = JSON.stringify(a);
        printCell(s0, COL_WIDTH[col]);
        col++;
        const actual = await microEvaluate(a);
        const s3 = (0, util_1.inspect)(actual);
        printCell(s3, COL_WIDTH[col]);
        col++;
        const e = primitives_cases_1.default[i][1];
        printCell(e, COL_WIDTH[col]);
        let sbclRes;
        // let raw, parsed ;
        try {
            //  { raw, parsed } = await sbcl(e);
            sbclRes = await sbcl(e);
        }
        catch (e) {
            // console.log('>>>>>>>>>>>>', e);
            throw e;
        }
        const { raw, parsed } = sbclRes;
        col++;
        const s4 = raw;
        printCell(s4, COL_WIDTH[col]);
        col++;
        const s5 = (0, util_1.inspect)(parsed);
        printCell(s5, COL_WIDTH[col]);
        // printCell('expected:', expected);
        col++;
        const ok = (0, lodash_1.isEqual)(actual, parsed);
        if (!ok)
            failed++;
        const s6 = String(ok);
        printCell(s6, COL_WIDTH[col]);
        // printCell('expected:', expected);
        printEnd();
    }
    console.log('TOTAL: ', primitives_cases_1.default.length);
    console.log('FAIL:  ', failed);
    console.log('OK:    ', primitives_cases_1.default.length - failed);
}
run();
//# sourceMappingURL=core-test-runner.js.map