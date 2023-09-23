import {fn_check_params} from "../../lib/util";
import {ActionMethodState, Actions, Parameter, Parameters, Runner} from "../../lib/runner";

function fn_nth(parameters: Parameters) {
  fn_check_params(parameters, {minCount: 2});
  const n = parameters[0];
  const list = parameters[1];

  console.log('>>>', list)

  // fn_check_params(list, {minCount: n});
  // return list[n];
};


export const actions: Actions = {

  'parse-integer': async function(a,b,{parameters,evaluate}) {
    return parseInt( String( await evaluate(parameters[0]) ) );
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
    fn_check_params(parameters, {exactCount: 2})

    const pName = await runner.eval(parameters[0], state);
    const sName = String(pName)

    const pValue = await runner.eval(parameters[1], state);
    const sValue = String(pValue)

    // let creates variable at local scope

    scopes.current().set(sName, sValue);
    return sValue;
  },

  "list": async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const {activity, scopes, runner, logger} = state;
    fn_check_params(parameters, {minCount: 0});

    const evaluated: Parameters = [];
    for(const p of parameters) {
      const pValue = await runner.eval(p, state);
      evaluated.push(pValue);
    }

    // if (!Array.isArray(evaluated)) throw new Error('Expecting array');

    return evaluated;
  },

  "length": async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const {activity, scopes, runner, logger} = state;
    fn_check_params(parameters, {exactCount: 1});

    const array = await runner.eval(parameters[0], state);

    if (!Array.isArray(array)) throw new Error('Expecting array');
    return array.length;
  },

  "nth": async function (
    action: string,
    parameters: Parameters,
    {id, level, activity, scopes, runner, logger}: ActionMethodState
  ) {
    fn_check_params(parameters, {exactCount: 2});
    return fn_nth.call(this, parameters);
  },

  "first": async function (
    action: string,
    parameters: Parameters,
    {id, level, activity, scopes, runner, logger}: ActionMethodState
  ) {
    fn_check_params(parameters, {exactCount: 1});
    parameters.unshift(0);
    return fn_nth.call(this, parameters);
  },

  "second": async function (
    action: string,
    parameters: Parameters,
    {id, level, activity, scopes, runner, logger}: ActionMethodState
  ) {
    fn_check_params(parameters, {exactCount: 1});
    parameters.unshift(1);
    return fn_nth.call(this, parameters);
  },

  "third": async function (
    action: string,
    parameters: Parameters,
    {id, level, activity, scopes, runner, logger}: ActionMethodState
  ) {
    fn_check_params(parameters, {exactCount: 1});
    parameters.unshift(2);
    return fn_nth.call(this, parameters);
  },
  // ...

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

  "if": async function (
    action: string,
    parameters: Parameters,
    {id, level, activity, scopes, runner, logger}: ActionMethodState
  ) {
    throw new Error('Not implemented');
/*
    fn_check_params(parameters, {exactCount: 2});
    const destination = this._getNextParam(parameters) || '';
    if (destination.toUpperCase() !== 'T') throw new Error('Invalid destination in format');
    const controlString = this._getNextParam(parameters) || '';
    console.log('format', controlString);
    return result;
*/
  },


}

export default actions;
