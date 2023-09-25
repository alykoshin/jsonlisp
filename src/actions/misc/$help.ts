import { fn_check_params } from '../../lib/util';
import { ActionMethodState, Actions, Parameters } from '../../lib/runner';

export const actions: Actions = {
  $help: async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { runner, logger, scopes } = state;
    const actionNames = Object.keys(runner.actions).sort();
    // for (const a of actionNames) {
    // logger.info(`  ${JSON.stringify(a)}`);
    // }

    // logger.info(`  ${JSON.stringify(actionNames)}`);

    logger.info('Available commands:', actionNames.join(', '));
    return undefined;
  },
};

export default actions;
