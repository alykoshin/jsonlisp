/** @format */

import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {Actions, Parameters, ensureNumber} from './helpers/types';

/**
 * @module system
 * @see ...
 */

export const actions: Actions = {
  /** @name sleep */
  sleep: async function (action, params, {evaluate, logger}) {
    validateArgs(params, {exactCount: 1});

    const value = await evaluate(params[0]);
    ensureNumber(value);
    // const nValue = Number(pValue);

    logger.debug(`sleep ${value} seconds`);
    await new Promise((resolve, _reject) => setTimeout(resolve, value * 1000));
    logger.log(`sleep done`);
  },

  /** @name time */
  time: async function (action, params, {evaluate, logger}) {
    validateArgs(params, {exactCount: 1});
    const [expr] = params;

    const startTime = new Date();

    const value = await evaluate(expr);

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    logger.log(`Evaluation took:\n  ${duration / 1000} seconds of real time`);

    return value;
  },
};

export default actions;
