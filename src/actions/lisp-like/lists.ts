/** @format */

import {fn_check_params} from '../../lib/util'
import {
  ActionMethodState,
  Actions,
  Parameter,
  Parameters,
  Runner,
} from '../../lib/runner'

function fn_nth(n: Parameter, list: Parameter | Parameters) {
  // fn_check_params(params, {minCount: 2});
  // const [n, list] = params;

  fn_check_params(n, {typ: 'number'})
  fn_check_params(list, {minCount: n as number})

  return (list as Parameters)[n as number]
}

function fn_rest(list: Parameter | Parameters) {
  fn_check_params(list, {minCount: 1})
  return (list as Parameters).slice(1)
}

export const actions: Actions = {
  list: async function (
    action: string,
    params: Parameters,
    {evaluate, logger}: ActionMethodState
  ) {
    fn_check_params(params, {minCount: 0})

    const evaluated: Parameters = []
    for (const p of params) {
      const pValue = await evaluate(p)
      evaluated.push(pValue)
    }
    // if (!Array.isArray(evaluated)) throw new Error('Expecting array');

    return evaluated
  },

  length: async function (
    action: string,
    params: Parameters,
    {evaluate, logger}: ActionMethodState
  ) {
    fn_check_params(params, {exactCount: 1})

    const array = await evaluate(params[0])

    if (!Array.isArray(array)) throw new Error('Expecting array')
    return array.length
  },

  nth: async function (
    action: string,
    params: Parameters,
    {evaluate, logger}: ActionMethodState
  ) {
    fn_check_params(params, {exactCount: 2})
    const n = await evaluate(params[0])
    const list = await evaluate(params[1])

    return fn_nth(n, list)
  },

  first: async function (
    action: string,
    params: Parameters,
    {evaluate, logger}: ActionMethodState
  ) {
    fn_check_params(params, {exactCount: 1})
    const list = await evaluate(params[0])
    return fn_nth(0, list)
  },

  car: async function (
    action: string,
    params: Parameters,
    {evaluate, logger}: ActionMethodState
  ) {
    fn_check_params(params, {exactCount: 1})
    const list = await evaluate(params[0])
    return fn_nth(0, list)
  },

  //

  second: async function (
    action: string,
    params: Parameters,
    {evaluate, logger}: ActionMethodState
  ) {
    fn_check_params(params, {exactCount: 1})
    const list = await evaluate(params[0])
    return fn_nth(1, list)
  },

  third: async function (
    action: string,
    params: Parameters,
    {evaluate, logger}: ActionMethodState
  ) {
    fn_check_params(params, {exactCount: 1})
    const list = await evaluate(params[0])
    return fn_nth(2, list)
  },

  //

  cdr: async function (
    action: string,
    params: Parameters,
    {evaluate, logger}: ActionMethodState
  ) {
    fn_check_params(params, {exactCount: 1})
    const list = await evaluate(params[0])
    return fn_rest(list)
  },

  // rest: 'cdr'

  rest: async function (
    action: string,
    params: Parameters,
    {evaluate, logger}: ActionMethodState
  ) {
    fn_check_params(params, {exactCount: 1})
    const list = await evaluate(params[0])
    return fn_rest(list)
  },

  //
}

export default actions
