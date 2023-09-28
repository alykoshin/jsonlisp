import {fn_check_params} from "../../lib/util";
import {ActionMethodState, Actions, Parameter, Parameters, Runner} from "../../lib/runner";
import { stringify } from "./helpers/print";

function fn_nth(parameters: Parameters) {
  fn_check_params(parameters, {minCount: 2});
  const [n, list] = parameters;

  fn_check_params(n, {typ: 'number'});
  fn_check_params(list, {minCount: n as number});

  return (list as Parameters)[n as number];
};


export const actions: Actions = {

  'parse-integer': async function(a,params,{evaluate}) {
    return parseInt( String( await evaluate(params[0]) ) );
  },

  /* let: async function let_(
    action: string,
    parameters: Parameters,
    {id, level, fullConfig, scopes, runner, logger}: ActionMethodState
  ) {
    fn_check_params(parameters, {exactCount: 2})

    const pName = await runner.eval(parameters[0], fullConfig, {level, logger});
    const sName = String(pName)

    const pValue = await runner.eval(parameters[1], fullConfig, {level, logger});
    const sValue = String(pValue)

    // let creates variable at local scope

    scopes.current().set(sName, sValue);
    return sValue;
  },
*/

  "setq": async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const {activity, scopes, runner, logger} = state;
    fn_check_params(parameters, {exactCount: 2});

    const pName = await runner.eval(parameters[0], state);
    const sName = String(pName);

    const pValue = await runner.eval(parameters[1], state);

    // let creates variable at local scope

    scopes.current().set(sName, pValue);
    logger.debug(`${sName} = ${stringify(pValue)}`)
    return pValue;
  },

  "format": async function (
    action: string,
    parameters: Parameters,
    {id, level, activity, scopes, runner, logger}: ActionMethodState
  ) {
    throw new Error('Not implemented');
 /*   fn_check_params(parameters, {exactCount: 2});
    const destination = this._getNextParam(parameters) || '';
    if (destination.toUpperCase() !== 'T') throw new Error('Invalid destination in format');
    const controlString = this._getNextParam(parameters) || '';
    console.log('format', controlString);
    return result;
 */ },

}

export default actions;
