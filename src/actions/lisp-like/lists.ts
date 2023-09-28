import { fn_check_params } from '../../lib/util';
import {
  ActionMethodState,
  Actions,
  Parameter,
  Parameters,
  Runner,
} from '../../lib/runner';

function fn_nth(n: Parameter, list: Parameter | Parameters) {
  // fn_check_params(parameters, {minCount: 2});
  // const [n, list] = parameters;

  fn_check_params(n, { typ: 'number' });
  fn_check_params(list, { minCount: n as number });

  return (list as Parameters)[n as number];
}

function fn_rest(list: Parameter | Parameters) {
  fn_check_params(list, { minCount: 1 });
  return (list as Parameters).slice(1);
}

export const actions: Actions = {
  list: async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { activity, scopes, runner, logger } = state;
    fn_check_params(parameters, { minCount: 0 });

    const evaluated: Parameters = [];
    for (const p of parameters) {
      const pValue = await runner.eval(p, state);
      evaluated.push(pValue);
    }
    // if (!Array.isArray(evaluated)) throw new Error('Expecting array');

    return evaluated;
  },

  length: async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { activity, scopes, runner, logger } = state;
    fn_check_params(parameters, { exactCount: 1 });

    const array = await runner.eval(parameters[0], state);

    if (!Array.isArray(array)) throw new Error('Expecting array');
    return array.length;
  },

  nth: async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { runner } = state;
    fn_check_params(parameters, { exactCount: 2 });

    const n = await runner.eval(parameters[0], state);
    const list = await runner.eval(parameters[1], state);

    return fn_nth(n, list);
  },

  first: async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { runner } = state;
    fn_check_params(parameters, { exactCount: 1 });
    const list = await runner.eval(parameters[0], state);
    return fn_nth(0, list);
  },

  car: async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { runner } = state;
    fn_check_params(parameters, { exactCount: 1 });
    const list = await runner.eval(parameters[0], state);
    return fn_nth(0, list);
  },

  //

  second: async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { runner } = state;
    fn_check_params(parameters, { exactCount: 1 });
    const list = await runner.eval(parameters[0], state);
    return fn_nth(1, list);
  },

  third: async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { runner } = state;
    fn_check_params(parameters, { exactCount: 1 });
    const list = await runner.eval(parameters[0], state);
    return fn_nth(2, list);
  },

  //

  cdr: async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { runner } = state;
    fn_check_params(parameters, { exactCount: 1 });
    const list = await runner.eval(parameters[0], state);
    const res = fn_rest(list);
    return res;
  },

  // rest: 'cdr'

  rest: async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { runner } = state;
    fn_check_params(parameters, { exactCount: 1 });
    const list = await runner.eval(parameters[0], state);
    const res = fn_rest(list);
    return res;
  },

  //
};

export default actions;
