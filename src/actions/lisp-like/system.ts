/** @format */

import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {Actions, Parameters} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';

/**
 * @module system
 * @see ...
 */

export const actions: Actions = {
  /** @name sleep */
  sleep: async function (action, params, {evaluate, logger}) {
    validateArgs(params, {exactCount: 1});

    const pValue = await evaluate(params[0]);
    const nValue = Number(pValue);

    logger.debug(`sleep ${nValue} seconds`);
    await new Promise((resolve, _reject) => setTimeout(resolve, nValue * 1000));
    logger.log(`sleep done`);
  },

  /** @name time */
  time: async function (action, params, {evaluate, logger}) {
    validateArgs(params, {exactCount: 1});
    const [pDuration] = params;

    const startTime = new Date();

    const value = await evaluate(pDuration);

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    logger.log(`Evaluation took:\n  ${duration / 1000} seconds of real time`);

    return value;
  },
};

export default actions;
