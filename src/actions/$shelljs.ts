import shelljs from 'shelljs'
import {fn_check_params} from "../lib/util";
import {ActionMethodState, Actions, Parameters} from "../lib/runner";

export const actions: Actions = {

  "$shelljs": async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const {runner, logger} = state;
    //runner.debug('$shelljs', { parameters, prevResult });
    fn_check_params(parameters, {minCount: 1});

    let shellParams: string[] = [];
    for (const p of parameters) {
      const pValue = await runner.eval(p, state);
      const sValue = String(pValue);
      shellParams.push(sValue)
    }
    const shellCmd = shellParams.shift();
    if (!shellCmd) throw new Error(`shellCmd cannot be empty`);

    const fn = shelljs[shellCmd as keyof typeof shelljs];
    if (typeof (fn) !== 'function') throw new Error(`first parameter of shelljs function must be the name of shelljs method`);

    let res: string = (fn as Function)(...shellParams);
    res = res.trim();

    // logger.log(`[${action}] ` + res );
    logger.log( res );
    // print(shellParams);
    return res;
  },

}

export default actions;
