import _ from 'lodash'
import {fn_check_params} from "../lib/util";
import {ActionMethodState, Actions, Parameters} from "../lib/runner";

export const actions: Actions = {

  "$expect": async function (
    action: string,
    parameters: Parameters,
    {id, level, fullConfig, runner, logger}: ActionMethodState
  ) {
    //runner.debug('$expect', { parameters, prevResult });
    fn_check_params(parameters, {exactCount: [1, 2]});

    // let actual;
    // if (parameters.length === 1) {
    //   // throw '$expect: parameters.length === 1 not supported'
    //   // actual = prevResult;
    //   //else if (parameters.length === 2) actual = this._getNextParam(parameters);
    //   actual = await runner.eval(parameters[0], fullConfig, {level, logger});
    //
    // } else if (parameters.length === 2) {
    //   actual = await runner.eval(parameters[0], fullConfig, {level, logger});
    // }
    const actual = await runner.eval(parameters[0], fullConfig, {level, logger});
    // console.log('>>>>>>>>', actual)

    let res: boolean;
    let sValue: string;
    if (parameters.length === 1) {
      res = !! actual;
      sValue = JSON.stringify(actual)

    } else {
      const expected = await runner.eval(parameters[1], fullConfig, {level, logger});
      res = _.isEqual(actual, expected);
      sValue = JSON.stringify({actual, expected})
    }

    if (res) logger.success('$expect: OK:   ' + sValue);
    else logger.error('$expect: FAIL: ' + sValue);
    return res;
  },

}

export default actions;
