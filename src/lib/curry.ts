/** @format */

export const curry = function (fn: Function, ...args: any[]) {
  // var args: any = [];
  // for (var i = 1, len = arguments.length; i < len; ++i) {
  // args.push(arguments[i]);
  // }
  return function (this: any, ...args2: any[]) {
    // var args2 = [];
    // for (var x = 0, xl = arguments.length; x < xl; x++) {
    // args2.push(arguments[x]);
    // }
    return fn.apply(this, args.concat(args2));
  };
};

export default curry;
