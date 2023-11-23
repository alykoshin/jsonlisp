/** @format */

import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {Actions} from './helpers/types';

/**
 * @module error
 */

export const actions: Actions = {
  /**
   * @name error
   */
  error: async function error(action, params, {evaluate, logger}) {
    validateArgs(params, {exactCount: 1});
    const value = await evaluate(params[0]);
    logger.fatal(value);
  },

  /**
   * @name assert
   * @see {@link https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node336.html}
   */
  assert: async function (action, params, {evaluate, scopes, logger}) {
    validateArgs(params, {minCount: 1});

    const pActual = await evaluate(params[0]);
    // console.log('>>>', actual)

    const bActual = !!pActual;
    const sActual = JSON.stringify(pActual);

    if (!bActual) {
      const printParams = params.slice(1);
      ``;
      const msgs = await Promise.all(
        printParams.map(async (p) => await evaluate(['print', p]))
      );
      // }

      let msg1 = [`Assert failed:`, sActual];
      // msg += params[1] ? (msg = String(await evaluate(params[1]))) : sActual;
      // msg += msgs.length > 0 ?  : sActual;
      logger.fatal(...msg1, ...msgs);
    }

    return bActual;
  },
};

export default actions;
