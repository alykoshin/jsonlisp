"use strict";
// export const print = (...args: any[]) => {
//   // process.s
//   console.log(...args);
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = void 0;
const print = (...args) => {
    const s = args.join(' ');
    process.stdout.write(args.join(' '));
    return s;
};
exports.print = print;
// export const doubleQuotes = (pValue: Parameter): Parameter => {
//   if (typeof pValue === 'string') {
//     pValue = pValue.replace(/\"/gi, '\\"');
//     pValue = `"${pValue}"`;
//   }
//   return pValue;
// };
//# sourceMappingURL=print.js.map