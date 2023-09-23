import {ActionDefinition, Actions, Parameters} from "../../lib/runner";
import {Activity, ActivityActionsDefinition} from "../../lib/config";
import { parse_sbcl_bool, get_sbcl_cmd } from "./helpers";

const actions: Actions = {

  '$sbcl': async function(a,b,{parameters,evaluate}) {
    const line = await evaluate(parameters[0]);
    // const res = await evaluate([ `$exec`, `sbcl --noinform --non-interactive --noprint --eval \"( print ${line} )\"` ]);
    const res = await evaluate(
      [ `$exec`, get_sbcl_cmd(String(line)) ]
    );

    return (res as Parameters)[0];
  },

  '$sbcl-to-int': async function(a,b,{parameters,evaluate}) {
    return await evaluate(
      [ 'parse-integer',
        [ `$sbcl`, parameters[0] ] ]
      );
  },

  '$parse-sbcl-bool': async function(a,b,{parameters,evaluate,logger}) {
    const res = String( await evaluate(parameters[0]) );
    // if (res === 'T') return true;
    // else if (res === 'NIL') return false;
    // else return null;
    return parse_sbcl_bool(res, {logger});
  },

  '$sbcl-to-bool': async function(a,b,{parameters,evaluate}) {
    return await evaluate(
      [ '$parse-sbcl-bool',
        [ `$sbcl`, parameters[0] ] ]
      );
  },

}

export default actions;
