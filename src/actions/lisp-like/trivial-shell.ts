/** @format */

import {execute} from './helpers/exec';
import {fn_check_params} from '../../lib/util';
import {Actions} from '../../lib/runner';

type ExecActionConfig = {
  cwd: string;
  env: {
    [key: string]: string;
  };
};

/**
 *
 * trivial-shell:shell-command
 *
 * https://stackoverflow.com/questions/6065446/executing-a-shell-command-from-common-lisp
 *
 * https://trivial-shell.common-lisp.dev/user-guide.html#shell-command
 *
 */

export const actions: Actions = {
  'shell-command': async function (action, params, {evaluate, logger}) {
    fn_check_params(params, {minCount: 1});

    const lastParam = params[params.length - 1];
    let config: Object = {};
    if (typeof lastParam === 'object' && lastParam !== null) {
      config = lastParam;
      params = params.slice(0, params.length - 1);
    }

    const {cwd, env} = (config as ExecActionConfig) || {};

    const result = [];
    for (const p of params) {
      const pCommand = await evaluate(p);
      const sCommand = String(pCommand);

      const options = {
        cwd,
        env,
        // // stdio: 'inherit',
        // stdin: 'inherit',
        // stdout: 'pipe',
        // stderr: 'pipe',
      };

      const r = await execute(sCommand, options, {logger});

      result.push(r.stdout);
    }
    return result.length === 1 ? result[0] : result;
  },
};

export default actions;
