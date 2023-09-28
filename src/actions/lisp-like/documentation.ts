import { fn_check_params } from '../../lib/util';
import { ActionMethodState, Actions, Parameters } from '../../lib/runner';

export const actions: Actions = {

  '?': async function (action, params, { runner, logger }) {
    const actionNames = Object.keys(runner.actions).sort();
    logger.info('Available commands:', actionNames.join(', '));
    return undefined;
  },

  ';': async function (
    action: string,
    parameters: Parameters,
    {logger}: ActionMethodState
  ) {
    logger.debug(`Found ";", skipping the list`);
    return undefined;
  },

};

export default actions;
