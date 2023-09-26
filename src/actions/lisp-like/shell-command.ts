import { execute } from '../../helpers/exec';
import { fn_check_params } from '../../lib/util';
import { ActionListExecutor, ActionMethodState, Actions, Parameters } from '../../lib/runner';

type ExecActionConfig = {
  cwd: string;
  env: {
    [key: string]: string;
  };
}

export const shellCommand: ActionListExecutor = async function (action, params, { evaluate, logger }) {
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
};

export default shellCommand;
