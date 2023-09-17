"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
//
const util_1 = require("../../../src/lib/util");
function print_array(prefix, data) {
    if (Array.isArray(data)) {
        const res = data.map(d => typeof d === 'string' ? `"${d}"` : d);
        console.log(`* ${prefix} print_array: [`, res.join(', '), `]`);
    }
    else {
        console.log(`* ${prefix} print_array:`, data);
    }
}
async function fn_get_params({ parameters, context, result: prevResult }) {
    this.debug('fn_get_params', { parameters });
    let params = [];
    //while (this._hasNextParam(parameters)) params = params.concat( this._getNextParam(parameters) );
    while (this._hasNextParam(parameters)) {
        const currResult = await this._evalNextChildToken({ parameters, context, result: prevResult });
        params = params.concat(currResult);
    }
    this.debug('fn_get_params', { params });
    return params;
}
function fn_nth(parameters) {
    (0, util_1.fn_check_params)({ parameters, exactCount: 2 });
    //if (!parameters || !Array.isArray(parameters) || parameters.length !== 1) throw new Error('Invalid number of arguments');
    //let n    = 1;
    const n = this._getNextParam(parameters);
    const list = this._getNextParam(parameters);
    return list[n];
}
;
//
// Common Lisp the Language, 2nd Edition
// 12.4. Arithmetic Operations
// https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node125.html#SECTION001640000000000000000
//
// Practical Common Lisp
// 4. Syntax and Semantics
// http://www.gigamonkeys.com/book/syntax-and-semantics.html
//
// Clojure
// https://clojure.org/about/dynamic
//
// - lists
// - atoms
//   - literals
//   - non-literals
//     - numbers
//     - strings
const TEST_ACTIONS = {
    testAction: [
        //"print1",
        //"print2",
        "arithm",
        // [ "$print", "xxx" ],
        //"test1fn",
        //[ "test2fn", "test2-parameter" ],
        //[ "$set", { "a": 1, "b": "value-for-b" } ],
        //'printContext',
        //[ "$get", "a", "b" ],
        ////'printResult',
        //'print_res',
        //[ 'print_vars', 'a', 'b' ],
    ],
    // "object": [ "$print", "object.action $print test 1" ],
    //print1: [
    //  "$print",
    //  //[
    //    "",
    //    "$print test 1-1",
    //    "$print test 1-2",
    //    "",
    //  //],
    //],
    //print2: [
    //  "$print", "$print test 2-1",
    //],
    //test1: [
    //  [ "print_params", "1", "print_params", "2" ],
    //],
    //[
    //  ['print_params', '+' ],
    //  'print_res',
    //  [ "+" ],
    //  ['$expect', 0],
    //  'print_res'
    //],
    //'print_res',
    "arithm": [
    //[ "setq", "counter", 0 ],
    //[ "setq", "counter", [ "+", "counter", 1 ] ],
    //[ "setq", "carnivores", [ "quote", "lion", "tiger", "leopard" ] ],
    //'print_res',
    ],
    "$set": function ({ action, parameters /*args*/, context, result }) {
        (0, util_1.fn_check_params)(parameters, { minCount: 1 });
        _.assign(context, parameters[0] || {});
        this._getNextParam(parameters);
    },
    "$get": function ({ action, parameters /*args*/, context, result }) {
        (0, util_1.fn_check_params)(parameters, { minCount: 0 });
        const res = [];
        while (this._hasNextParam(parameters)) {
            res.push(_.get(context, parameters[0] || {}));
            this._getNextParam(parameters);
        }
        return res;
    },
    printContext: function ({ context, result }) {
        console.log('context:', context);
        return result;
    },
    printResult: function ({ result }) {
        console.log('result:', result);
        return result;
    },
    print_params: function ({ parameters, result }) {
        (0, util_1.fn_check_params)(parameters, { minCount: 0 });
        print_array('print_params', parameters);
        return result;
    },
    print_res: function ({ parameters, context, result }) {
        (0, util_1.fn_check_params)(parameters, { minCount: 0 });
        print_array('print_res', result);
        return result;
    },
    print_vars: function ({ parameters, context, result }) {
        (0, util_1.fn_check_params)(parameters, { minCount: 0 });
        const res = parameters.map(p => { const varName = this._getNextParam(parameters); return _.get(context, varName); });
        print_array('print_vars', res);
        return result;
    },
    "setq": async function ({ parameters, context }) {
        (0, util_1.fn_check_params)(parameters, { exactCount: 2 });
        const varName = this._getNextParam(parameters);
        const varValue = this._getNextParam(parameters);
        context[varName] = varValue;
    },
    "length": async function ({ parameters, context }) {
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        const array = this._getNextParam(parameters);
        if (!Array.isArray(array))
            throw new Error('Expecting array');
        return array.length;
    },
    "nth": async function ({ parameters }) {
        (0, util_1.fn_check_params)(parameters, { exactCount: 2 });
        return fn_nth.call(this, parameters);
    },
    "first": async function ({ parameters }) {
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        parameters.unshift(0);
        return fn_nth.call(this, parameters);
    },
    "second": async function ({ parameters }) {
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        parameters.unshift(1);
        return fn_nth.call(this, parameters);
    },
    "third": async function ({ parameters }) {
        (0, util_1.fn_check_params)(parameters, { exactCount: 1 });
        parameters.unshift(2);
        return fn_nth.call(this, parameters);
    },
    // ...
    "format": function ({ parameters, result }) {
        (0, util_1.fn_check_params)(parameters, { exactCount: 2 });
        const destination = this._getNextParam(parameters) || '';
        if (destination.toUpperCase() !== 'T')
            throw new Error('Invalid destination in format');
        const controlString = this._getNextParam(parameters) || '';
        console.log('format', controlString);
        return result;
    },
    "if": function ({ parameters }) {
        throw new Error('Not implemented');
        //    if (parameters.length !== 3) {
        //      throw new Error('Invalid number of arguments');
        //    } else {
        //      let test = parameters[0];
        //      this._getNextParam(parameters);
        //      while (this._hasNextParam(parameters)) {
        //        res = res && (first === parameters[0]);
        //        this._getNextParam(parameters);
        //      }
        //      return res;
        //    }
    },
    testAction_: [
        // 'echo ">>> test1" ${property_name}',
        // {
        //   action: 'echo ">>> test2"',
        // },
        // '_testAction3',
        // {
        //   title: '_test4 title 1',
        //   action: [ '_testAction4' ]
        // },
        // (actionArgs) => {
        //   console.log('>>> testFunction5', actionArgs);
        //   return 'result_value_5';
        // },
        // {
        //   title: 'test title 6',
        //   action:
        (...args) => console.log('>>> testFunction6', ...args),
        // },
        // 'npmVersion',
        // 'math',
    ],
    _testAction3: ['echo', ">>> test3"],
    // _testAction4: {
    //   title:  '_test4 title 2',
    //   action: 'echo ">>> test4"',
    // },
    _testAction4: ['echo', ">>> test4"],
    npmVersion: ["$exec", "npm --version"],
    //printResult: ({ action, context, result }) => { console.log(result); return result; },
    //setA:({ action, context, result }) => { context['A']=result; return result; },
    //getA:({ action, context, result }) => { return context['A']; },
    //set0: () => 0,
    math: [
        ({ context }) => { context['a'] = 1; context['b'] = 2; },
        ({ context }) => context['a'] + context['b'],
        ({ result }) => { console.log('math', result); return result; },
    ],
    math_ideas: [
        ["action", ["$set", { "a": 1, "b": 2 }]],
        ["action", ["$set", { "c": ["$add", ["a", "b"]] }]],
        ["action", ["$set", { "c": ["$add", "a", "b"] }]],
        ["action", ["$print", "c"]]
    ],
    //$set: ({ action, context, result }) => action.
};
//# sourceMappingURL=index.js.map