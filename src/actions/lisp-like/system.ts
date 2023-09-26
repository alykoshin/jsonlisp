import { fn_check_params } from '../../lib/util';
import { ActionMethodState, Actions, Parameters } from '../../lib/runner';
import { execute } from '../../helpers/exec';

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

  'shell-command': async function (action, params, { evaluate, logger }) {
    fn_check_params(params, { minCount: 1 });

    const lastParam = params[params.length - 1];
    let config: Object = {};
    if (typeof lastParam === 'object' && lastParam !== null) {
      config = lastParam;
      params = params.slice(0, params.length - 1);
    }

    const { cwd, env } = (config as ExecActionConfig) || {};

    const result = [];
    for (const p of params) {
      const command = await evaluate(p);
      const sCommand = String(command);

      const options = {
        cwd,
        env,
        // // stdio: 'inherit',
        // stdin: 'inherit',
        // stdout: 'pipe',
        // stderr: 'pipe',
      };

      const res = await execute(sCommand, options, { logger });

      result.push(res);
    }
    return result.length === 1 ? result[0] : result;
  },
};

export default actions;
