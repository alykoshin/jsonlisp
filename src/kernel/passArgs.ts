/** @format */

/**
 * @module kernel/passArgs
 * Lambda-list binding: maps parameter names (&optional/&rest supported)
 * to argument values. Used by kernel/lambda's createExecutorFn.
 */

import assert from 'assert';
import {Atom, List, ensureList, ensureString} from '../eval/sexpr';
import {NIL} from './booleans';

interface KeyValueObject<V> {
  [key: string]: V | V[] | NIL;
}

class JLError extends Error {
  constructor(message: string) {
    super(message);
    // this.name = 'JLError';
    this.name = this.constructor.name;
  }
}

class KeywordNotSupportedError extends JLError {
  constructor(key: string) {
    super(`Keyword not supported: "${key}"`);
  }
}

const lessArgsErrorMsg = `Not enough arguments`;
class LessArgsError extends JLError {
  constructor() {
    super(lessArgsErrorMsg);
  }
}

type ParamKeywords =
  | '&required'
  | '&optional'
  | '&rest'
  | '&key' // not supported
  | '&allow-other-keys'; // not supported

export function passArgs(names: List, values: List): KeyValueObject<Atom> {
  const res: KeyValueObject<Atom> = {};
  let ni = 0; // names index
  let vi = 0; // values index
  let state: ParamKeywords = '&required'; // current state

  while (ni < names.length) {
    const n = names[ni];
    ensureString(n, `Parameter name must be Symbol (ie string)`);
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
    } else if (state === '&optional') {
      res[n] = NIL;
      ni++;
      vi++;
    } else if (state === '&rest') {
      if (!res[n]) res[n] = [];
      ensureList(res[n]);
      (res[n] as Array<Atom>).push(v);
      vi++;
      if (vi >= values.length) {
        break;
      }
    }
    // vi++;
  }
  return res;
}

function primitiveTest() {
  const log = (...args: any[]) => console.log(...args);

  assert.deepEqual(passArgs(['a', 'b'], [1, 2]), {a: 1, b: 2});
  assert.deepEqual(passArgs(['a', 'b'], [1, 2, 3]), {a: 1, b: 2});
  assert.deepEqual(passArgs(['a', 'b', '&optional', 'c'], [1, 2, 3]), {
    a: 1,
    b: 2,
    c: false,
  });
  try {
    log(passArgs(['a', 'b', 'c'], [1, 2]));
    throw new Error('throw error');
  } catch (e) {
    if ((e as Error).message === lessArgsErrorMsg) {
      // log('throws ok');
    } else {
      throw e;
    }
  }
  assert.deepEqual(passArgs(['a', 'b', '&rest', 'c'], [1, 2, 3, 4, 5]), {
    a: 1,
    b: 2,
    c: [3, 4, 5],
  });
}
primitiveTest();
