"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.curry = void 0;
const curry = function (fn, ...args) {
    // var args: any = [];
    // for (var i = 1, len = arguments.length; i < len; ++i) {
    // args.push(arguments[i]);
    // }
    return function (...args2) {
        // var args2 = [];
        // for (var x = 0, xl = arguments.length; x < xl; x++) {
        // args2.push(arguments[x]);
        // }
        return fn.apply(this, args.concat(args2));
    };
};
exports.curry = curry;
exports.default = exports.curry;
//# sourceMappingURL=curry.js.map