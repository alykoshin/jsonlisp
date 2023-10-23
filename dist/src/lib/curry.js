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
// export const evCurry = function (
//   this: GenericInterpreter<Atom>,
//   fn: (
//     parameter: Parameter,
//     state: ActionMethodState<Atom>
//   ) => Promise<Parameter>,
//   state: ActionMethodState<Atom>
// ): EvaluateFn {
//   // var args: any = [];
//   // for (var i = 1, len = arguments.length; i < len; ++i) {
//   // args.push(arguments[i]);
//   // }
//   return function (this: any, parameter: Parameter) {
//     // var args2 = [];
//     // for (var x = 0, xl = arguments.length; x < xl; x++) {
//     // args2.push(arguments[x]);
//     // }
//     // return fn.apply(this, parameter, state);
//     return fn.call(this, parameter, state);
//   };
// };
//# sourceMappingURL=curry.js.map