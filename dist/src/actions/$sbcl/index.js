"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const actions = {
    '$sbcl': async function (a, params, { evaluate }) {
        const line = await evaluate(params[0]);
        // const res = await evaluate([ `shell-command`, `sbcl --noinform --non-interactive --noprint --eval \"( print ${line} )\"` ]);
        const res = await evaluate([`shell-command`, (0, helpers_1.get_sbcl_cmd)(String(line))]);
        return res;
    },
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
    '$sbcl-to-list': async function (a, params, { evaluate, logger }) {
        return (0, helpers_1.parse_sbcl_list)(String(await evaluate([`$sbcl`, params[0]])), { logger });
    },
};
exports.default = actions;
//# sourceMappingURL=index.js.map