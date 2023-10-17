"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const microRunner_1 = require("../../apps/runner/microRunner");
const test_runner_1 = require("../../actions/$sbcl/test-runner");
const eval_1 = __importDefault(require("../../actions/lisp-like/core/eval"));
const functions_1 = __importDefault(require("../../actions/lisp-like/core/functions"));
const primitives_1 = __importDefault(require("../../actions/lisp-like/core/primitives"));
//
const functions_cases_1 = __importDefault(require("../../tests/lisp-like/core/functions.cases"));
const runner_1 = require("../../apps/runner/runner");
const allCases = [
    ...functions_cases_1.default,
    // ...primitivesCases,
];
const actions = {
    ...eval_1.default,
    ...functions_1.default,
    ...primitives_1.default,
};
const COLS = [
    ['JL EXPRESSION', 50],
    ['actual', 15],
    ['CLISP EXPRESSION', 50],
    ['expected/raw', 15],
    ['expected/parsed', 15],
    ['OK?', 5],
    ['', 30],
];
function _formatCell(s, width = 40, padChar = ' ') {
    return s.padEnd(width, padChar);
}
function _printSep() {
    process.stdout.write(' | ');
}
function _printEnd(tail) {
    if (tail)
        process.stdout.write(tail);
    process.stdout.write('\n');
}
function _printCell(s, width = 40, padChar = ' ') {
    _printSep();
    process.stdout.write(_formatCell(s, width, padChar));
}
function printCells(ss, padChar) {
    let recurse = false;
    const more = [...ss].map((s, i) => {
        const w0 = COLS[i][1];
        if (s === undefined) {
            _printCell('', w0, ' ');
            return '';
        }
        else {
            const END_PERIOD = '...';
            const BEGIN_PERIOD = '...';
            const w_actual = w0 - END_PERIOD.length; // minus period string length
            let rest = '';
            if (s.length > w0) {
                rest = BEGIN_PERIOD + s.substring(w_actual);
                s = s.substring(0, w_actual) + END_PERIOD;
                recurse = true;
            }
            _printCell(s, w0, padChar);
            return rest;
        }
    });
    _printEnd('');
    if (recurse)
        printCells(more, padChar);
}
function printSeparator() {
    const values = COLS.map((c) => (c[0] ? '' : undefined));
    printCells(values, '-');
}
function printHeaders() {
    const headers = COLS.map((c) => c[0]);
    printCells(headers, ' ');
    printSeparator();
}
function getEvaluate() {
    const NEW_INTERPRETER = true;
    let interpreter;
    if (NEW_INTERPRETER) {
        interpreter = new microRunner_1.MicroInterpreter({ actions });
    }
    else {
        interpreter = new runner_1.Runner();
        // replace default actions with the ones we want to test
        // (and their dependencies)
        interpreter.actions = actions;
    }
    return interpreter.evaluate.bind(interpreter);
}
async function run() {
    printHeaders();
    let failCount = 0;
    const evaluate = getEvaluate();
    for (const i in allCases) {
        const [exprJlIn, strSbclIn, message] = allCases[i];
        const { exprJlOut, strSbclIn: strSbclIn_, strSbclOut, exprSbclOut, ok, } = await (0, test_runner_1.testRunner)(exprJlIn, strSbclIn, { actions, evaluate });
        if (!ok)
            failCount++;
        const cellValues = [
            JSON.stringify(exprJlIn),
            (0, util_1.inspect)(exprJlOut),
            strSbclIn_,
            strSbclOut,
            (0, util_1.inspect)(exprSbclOut),
            String(ok),
            message || '',
        ];
        printCells(cellValues, ' ');
    }
    console.log(`TOTAL: ${allCases.length}\n` +
        `FAIL:  ${failCount}\n` +
        `OK:    ${allCases.length - failCount}`);
}
run();
//# sourceMappingURL=core-test-runner.js.map