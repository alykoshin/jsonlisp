/** @format */

import {
  ActionDefinition,
  ExecutorFn,
  Actions,
  Parameters,
  ensureString,
} from '../../apps/runner/lib/types';
import {
  parse_sbcl_bool,
  parse_sbcl_list,
} from 'lisp2jl/dist/apps/translator-primitive/lisp2jl-primitive';
import {get_sbcl_cmd} from './exec-prepare';

/**
 * @module $sbcl
 */

/**
 * @name $sbcl
 */

export const $sbcl: ExecutorFn = async function (a, params, {evaluate}) {
  const line = await evaluate(params[0]);
  // const res = await evaluate([ `shell-command`, `sbcl --noinform --non-interactive --noprint --eval \"( print ${line} )\"` ]);
  ensureString(line);
  const res = await evaluate([`shell-command`, get_sbcl_cmd(line)]);

  return res as Parameters;
};

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
export const $sbclToList: ExecutorFn = async function (
  _,
  args,
  {evaluate, logger}
) {
  return parse_sbcl_list(String(await evaluate([`$sbcl`, args[0]])), {
    logger,
  });
};

const actions: Actions = {
  $sbcl,

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

  '$sbcl-to-list': $sbclToList,
};

export default actions;
