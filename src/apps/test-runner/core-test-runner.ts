/** @format */

import {inspect} from 'util';
import {Actions, Expression, List} from '../runner/lib/types';

import {testRunner} from '../../actions/$sbcl/test-runner';

import eval from '../../actions/lisp-like/core/eval';
import functions from '../../actions/lisp-like/core/functions';
import primitives from '../../actions/lisp-like/core/primitives';
//
import functionsCases from '../../tests/lisp-like/core/functions.cases';
import primitivesCases from '../../tests/lisp-like/core/primitives.cases';
import {Runner} from '../runner/runner';

const allCases = [
  ...functionsCases,
  // ...primitivesCases,
];

const actions: Actions = {
  ...eval,
  ...functions,
  ...primitives,
};

type SbclExpression = string;

export type TestCase = [List, SbclExpression, message?: string];

const COLS: [string, number][] = [
  ['JL EXPRESSION', 50],
  ['actual', 15],
  ['CLISP EXPRESSION', 50],
  ['expected/raw', 15],
  ['expected/parsed', 15],
  ['OK?', 5],
  ['', 30],
];

function _formatCell(s: string, width: number = 40, padChar = ' ') {
  return s.padEnd(width, padChar);
}

function _printSep() {
  process.stdout.write(' | ');
}

function _printEnd(tail: string) {
  if (tail) process.stdout.write(tail);
  process.stdout.write('\n');
}

function _printCell(s: string, width: number = 40, padChar = ' ') {
  _printSep();
  process.stdout.write(_formatCell(s, width, padChar));
}

function printCells(ss: (string | undefined)[], padChar: string) {
  let recurse = false;
  const more = [...ss].map((s: string | undefined, i: number) => {
    const w0 = COLS[i][1];
    if (s === undefined) {
      _printCell('', w0, ' ');
      return '';
    } else {
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
  if (recurse) printCells(more, padChar);
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

async function getEvaluate() {
  // let interpreter;
  const interpreter = new Runner();
  // replace default actions with the ones we want to test
  // (and their dependencies)
  interpreter.actions = actions;
  const st = await interpreter.init();
  // return evCurry(interpreter.evaluate);
  return (expr: Expression) => interpreter.evaluate.call(interpreter, expr, st);
  // return interpreter.evaluate.bind(interpreter);
}

async function run() {
  printHeaders();
  let failCount = 0;
  const evaluate = await getEvaluate();

  for (const i in allCases) {
    const [exprJlIn, strSbclIn, message] = allCases[i];
    const {
      exprJlOut,
      strSbclIn: strSbclIn_,
      strSbclOut,
      exprSbclOut,
      ok,
    } = await testRunner(exprJlIn, strSbclIn, {actions, evaluate});
    if (!ok) failCount++;

    const cellValues = [
      JSON.stringify(exprJlIn),
      inspect(exprJlOut),
      strSbclIn_,
      strSbclOut,
      inspect(exprSbclOut),
      String(ok),
      message || '',
    ];

    printCells(cellValues, ' ');
  }

  console.log(
    `TOTAL: ${allCases.length}\n` +
      `FAIL:  ${failCount}\n` +
      `OK:    ${allCases.length - failCount}`
  );
}
run();
