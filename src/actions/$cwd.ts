import {fn_check_params} from "../lib/util";
import {ActionMethodState, Actions, Parameters,} from "../lib/runner";
import {confirm as confirm_} from '../helpers/confirm';


export const actions: Actions = {

  "$cwd": async function $cwd(
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const {runner, logger} = state;
    fn_check_params(parameters, {exactCount: [0, 1]})

    if (parameters.length === 1) {
      const pCwd = await runner.eval(parameters[0], state);
      const sCwd = String(pCwd)
      process.chdir(sCwd);
    }
    const res = process.cwd();
    logger.debug(`$cwd: ${res}`);
    return res;
  }

}

export default actions
