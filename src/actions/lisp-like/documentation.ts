/** @format */

import {fn_check_params} from '../../lib/util';
import {ActionMethodState, Actions, Parameters} from '../../lib/runner';

export const actions: Actions = {
  /**
   * There is no simple way to print all the variables. Couple of articles how it may be done.
   *
   * How can I list all of the defined functions and global variables that are active in common lisp
   * https://stackoverflow.com/questions/42016114/how-can-i-list-all-of-the-defined-functions-and-global-variables-that-are-active
   *
   * http://www.lispworks.com/documentation/HyperSpec/Body/m_do_sym.htm
   * Macro DO-SYMBOLS, DO-EXTERNAL-SYMBOLS, DO-ALL-SYMBOLS
   */

  '?': async function (action, params, {runner, logger}) {
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
