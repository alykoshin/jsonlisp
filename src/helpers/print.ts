// export const print = (...args: any[]) => {
//   // process.s
//   console.log(...args);
// }

import { Parameter } from "../lib/runner";

export const print = (...args: any[]) => {
  const s = args.join(' ');
  process.stdout.write(args.join(' '));
  return s;
};

// export const doubleQuotes = (pValue: Parameter): Parameter => {
//   if (typeof pValue === 'string') {
//     pValue = pValue.replace(/\"/gi, '\\"');
//     pValue = `"${pValue}"`;
//   }
//   return pValue;
// };
