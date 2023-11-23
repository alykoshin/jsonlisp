/** @format */

// export const print = (...args: any[]) => {
//   // process.s
//   console.log(...args);
// }

import {Parameter} from './types';

export const EOL = '\n';

export let atBOL = false;

export const print = (...args: any[]) => {
  const s = args.join(' ');
  const lastCh = s[s.length - 1];
  process.stdout.write(s);
  atBOL = lastCh === '\n';
  return s;
};

export const stringify = (pValue: Parameter): Parameter => {
  if (typeof pValue === 'string') {
    pValue = pValue.replace(/\"/gi, '\\"');
    pValue = `"${pValue}"`;
  } else if (typeof pValue === 'object') {
    pValue = JSON.stringify(pValue);
  }
  return pValue;
};
