"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$sbclToList = exports.$sbcl = void 0;
const lisp2jl_primitive_1 = require("../../apps/translator-primitive/lisp2jl-primitive");
const exec_prepare_1 = require("./exec-prepare");
/**
 * @module $sbcl
 */
/**
 * @name $sbcl
 */
const $sbcl = async function (a, params, { evaluate }) {
    const line = await evaluate(params[0]);
    // const res = await evaluate([ `shell-command`, `sbcl --noinform --non-interactive --noprint --eval \"( print ${line} )\"` ]);
    const res = await evaluate([`shell-command`, (0, exec_prepare_1.get_sbcl_cmd)(String(line))]);
    return res;
};
exports.$sbcl = $sbcl;
// '$sbcl-to-int': async function(a,params,{evaluate}) {
//   return await evaluate(
//     [ 'parse-integer',
//       [ `$sbcl`, params[0] ] ]
//     );
// },
// '$parse-sbcl-bool': async function(a,params,{evaluate,logger}) {
//   const res = String( await evaluate(params[0]) );
//   // if (res === 'T') return true;
//   // else if (res === 'NIL') return false;
//   // else return null;
//   return parse_sbcl_bool(res, {logger});
// },
// '$sbcl-to-list': async function(a,params,{evaluate}) {
//   return await evaluate(
//     [ '$parse-sbcl-bool',
//       [ `$sbcl`, params[0] ] ]
//     );
// },
// '$parse-sbcl-list': async function(a,params,{evaluate,logger}) {
//   const res = String( await evaluate(params[0]) );
//   // if (res === 'T') return true;
//   // else if (res === 'NIL') return false;
//   // else return null;
//   return parse_sbcl_list(res, {logger});
// },
//
// '$sbcl-to-list': async function(a,params,{evaluate}) {
//   return await evaluate(
//     [ '$parse-sbcl-list',
//       [ `$sbcl`, params[0] ] ]
//     );
// },
/**
 * @name $sbcl-to-list
 */
const $sbclToList = async function (_, args, { evaluate, logger }) {
    return (0, lisp2jl_primitive_1.parse_sbcl_list)(String(await evaluate([`$sbcl`, args[0]])), {
        logger,
    });
};
exports.$sbclToList = $sbclToList;
const actions = {
    $sbcl: exports.$sbcl,
    // '$sbcl-to-int',
    //   return await `evaluate(
    //     [ 'parse-integer',
    //       [ `$sbcl`, params[0] ] ]
    //     );
    // },
    // '$parse-sbcl-bool': async function(a,params,{evaluate,logger}) {
    //   const res = String( await evaluate(params[0]) );
    //   // if (res === 'T') return true;
    //   // else if (res === 'NIL') return false;
    //   // else return null;
    //   return parse_sbcl_bool(res, {logger});
    // },
    // '$sbcl-to-list': async function(a,params,{evaluate}) {
    //   return await evaluate(
    //     [ '$parse-sbcl-bool',
    //       [ `$sbcl`, params[0] ] ]
    //     );
    // },
    // '$parse-sbcl-list': async function(a,params,{evaluate,logger}) {
    //   const res = String( await evaluate(params[0]) );
    //   // if (res === 'T') return true;
    //   // else if (res === 'NIL') return false;
    //   // else return null;
    //   return parse_sbcl_list(res, {logger});
    // },
    //
    // '$sbcl-to-list': async function(a,params,{evaluate}) {
    //   return await evaluate(
    //     [ '$parse-sbcl-list',
    //       [ `$sbcl`, params[0] ] ]
    //     );
    // },
    '$sbcl-to-list': exports.$sbclToList,
};
exports.default = actions;
//# sourceMappingURL=index.js.map