"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.print = exports.atBOL = exports.EOL = void 0;
exports.EOL = '\n';
exports.atBOL = false;
const print = (...args) => {
    const s = args.join(' ');
    const lastCh = s[s.length - 1];
    process.stdout.write(s);
    exports.atBOL = lastCh === '\n';
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