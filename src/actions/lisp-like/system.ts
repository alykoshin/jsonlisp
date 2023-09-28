import { fn_check_params } from '../../lib/util';
import { ActionMethodState, Actions, Parameters } from '../../lib/runner';
import { execute } from './helpers/exec';

type ExecActionConfig = {
  cwd: string;
  env: {
    [key: string]: string;
  };
};

export const actions: Actions = {
  sleep: async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: 1 });

    const pValue = await evaluate(params[0]);
    const nValue = Number(pValue);

    logger.debug(`sleep ${nValue} seconds`);
    await new Promise((resolve, _reject) => setTimeout(resolve, nValue * 1000));
    logger.log(`sleep done`);
  },

  time: async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { exactCount: 1 });
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
