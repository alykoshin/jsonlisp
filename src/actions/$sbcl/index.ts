import {ActionDefinition, Actions, Parameters} from "../../lib/runner";
import {Activity, ActivityActionsDefinition} from "../../lib/config";
import { parse_sbcl_bool, get_sbcl_cmd, parse_sbcl_list } from "./helpers";

const actions: Actions = {

  '$sbcl': async function(a,params,{evaluate}) {
    const line = await evaluate(params[0]);
    // const res = await evaluate([ `$exec`, `sbcl --noinform --non-interactive --noprint --eval \"( print ${line} )\"` ]);
    const res = await evaluate(
      [ `$exec`, get_sbcl_cmd(String(line)) ]
    );

    return (res as Parameters)[0];
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
  
  '$sbcl-to-list': async function(a,params,{evaluate,logger}) {
    return parse_sbcl_list(
      String(
        await evaluate(
            [ `$sbcl`, params[0] ] 
        )
      ),
      {logger}
    );
  },

}

export default actions;
