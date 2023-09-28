"use strict";
// export const print = (...args: any[]) => {
//   // process.s
//   console.log(...args);
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.print = void 0;
const print = (...args) => {
    const s = args.join(' ');
    process.stdout.write(args.join(' '));
    return s;
};
exports.print = print;
const stringify = (pValue) => {
    if (typeof pValue === 'string') {
        pValue = pValue.replace(/\"/gi, '\\"');
        pValue = `"${pValue}"`;
    }
    else if (typeof pValue === 'object') {
        pValue = JSON.stringify(pValue);
    }
    return pValue;
};
exports.stringify = stringify;
//# sourceMappingURL=print.js.map