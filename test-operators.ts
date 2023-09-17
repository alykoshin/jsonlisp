import {FullConfig, FullConfigActions} from "./src/lib/config";
import {Actions} from "./src/lib/runner";

const actions: FullConfigActions = {
  default: [
    'series',

    ['echo', 'This will test operators'],

    ['echo', '+'],

    ["$expect", ["+", 4], 4],
    ["$expect", ["+", 1, 2], 3],
    ["$expect", ["+", 1, 2, 3], 6],
    ["$expect", ["+", 1, ["+", 2, 3]], 6],

    ['echo', '-'],

    ["$expect", ["-", 1], -1],
    ['$expect', ["-", 2, 3], -1],
    ['$expect', ["-", 3, 2], 1],
    ['$expect', ["-", 2, 3, 4], -5],
    ["$expect", ["-", 4, ["-", 2, 1]], 3],

    ['echo', '*'],

    ["$expect", ["*", 1], 1],
    ['$expect', ["*", 2, 3], 6],
    ['$expect', ["*", 2, 3, 4], 24],
    ["$expect", ["*", 2, ["*", 3, 4]], 24],

    ['echo', '='],

    ['$expect', ["=", 1], true],

    ["$expect", ["=", 1, 1], true],
    ["$expect", ["=", 1, 1, 1], true],

    ['$expect', ["=", 1, 2], false],
    ['$expect', ["=", 1, 2, 3], false],
    ['$expect', ["=", 1, 2, 2], false],
    ['$expect', ["=", 1, 1, 2], false],
    ['$expect', ["=", 2, 1, 1], false],
    ['$expect', ["=", 1, 2, 1], false],

    ['$expect', ["/=", 1], true],

    ['$expect', ["/=", 1, 1], false],
    ['$expect', ["/=", 1, 1, 1], false],

    ['$expect', ["/=", 1, 2], true],
    ['$expect', ["/=", 1, 2, 3], true],
    ['$expect', ["/=", 1, 2, 2], true],
    ['$expect', ["/=", 1, 1, 2], true],
    ['$expect', ["/=", 2, 1, 1], true],
    ['$expect', ["/=", 1, 2, 1], true],

    // ['$expect', [ "length", [ 1,2,3 ] ], 3],

    //1,
    //{ "$expect": 1 },
    //
    //[2],
    //[ "$expect", [2] ],
    //
    //[3],
    //{ "$expect": [3] },
    //
    //[ "+" ],
    //[ "$expect", 0 ],
    //[ "$expect", 0 ],
    //
    // {"+": [5, {'*': [2,3] }] },
    // {"+": [5, ['*': [2, 3 ]]] },
    // ["*", 1, ["+", "x" ("-", "y", "y"))))
    //
    //[ 'print_params', '[ "+", 1, [ "+", 1, 2 ] ]' ],
    //[ 'format', 't', [ "+", 1, [ '+', 1, 2 ] ] ],
    // { format: [ 't', [ "+", 1, [ '+', 1, 2 ] ] ] },
    //'print_res',
    //
    //[ '$expect',
    //  4,
    //  [
    //    [ "+", 1, [ '+', 1, 2 ] ],
    //    'print_res',
    //  ]
    //],

  ],
}

export const activity: FullConfig = {
  base_dir: './demo',
  version: '2.5.22',
  actions: {
    ...actions,
  }
}

export default activity;
