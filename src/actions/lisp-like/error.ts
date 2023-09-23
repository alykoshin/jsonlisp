import {fn_check_params} from "../../lib/util";
import {ActionMethodState, Actions, Parameters} from "../../lib/runner";

export const actions: Actions = {

  error: async function error(
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const {activity, runner, logger} = state;
    fn_check_params(parameters, {exactCount: 1})

    const pValue = await runner.eval(parameters[0], state);
    const sValue = String(pValue)

    logger.fatal(sValue);
  }

}

export default actions;
