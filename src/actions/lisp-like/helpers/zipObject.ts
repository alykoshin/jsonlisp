/** @format */

import {ensureString} from '../../../apps/runner/lib/types';

interface KeyValueObject<V> {
  [key: string]: V;
}

export function zipObject<V>(names: any[], values: V[]): KeyValueObject<V> {
  if (names.length !== values.length)
    throw new Error(
      `Length of names: ${names.length}, ` +
        `values:${values.length}; must be the same.`
    );
  const res: {[name: string]: V} = {};
  for (const i in names) {
    const n = names[i];
    ensureString(n, `Parameter name must be LSymbol (ie string)`);
    res[n] = values[i];
  }
  return res;
}
