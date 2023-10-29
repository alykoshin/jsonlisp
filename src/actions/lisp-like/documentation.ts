/** @format */

import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {Actions, Parameters} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';

/**
 * @module documentation
 *
 * @description
 * Seems there is no single command to print all the variables in the Lisp
 * (including current scope etc)
 * Couple of articles how it may be done.
 *
 * @see
 * How can I list all of the defined functions and global variables that are active in common lisp <br>
 * - {@link https://stackoverflow.com/questions/42016114/how-can-i-list-all-of-the-defined-functions-and-global-variables-that-are-active} <br>
 * - {@link http://www.lispworks.com/documentation/HyperSpec/Body/m_do_sym.htm} <br>
 * Macro DO-SYMBOLS, DO-EXTERNAL-SYMBOLS, DO-ALL-SYMBOLS <br>
 */

export const actions: Actions = {
  /** @name ?
   */
  '?': async function (_, args, {actions, logger}) {
    const actionNames = Object.keys(actions).sort();
    logger.info('Available commands:', actionNames.join(', '));
    return undefined;
  },

  /** @name ; */
  ';': async function (_, args, {logger}) {
    logger.debug(`Found ";", skipping the list`);
    return undefined;
  },
};

export default actions;
