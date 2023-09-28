/** @format */

import shelljs, { ShellString } from 'shelljs';
import { fn_check_params } from '../../lib/util';
import { ActionMethodState, Actions, Parameters } from '../../lib/runner';

export const actions: Actions = {
  $shelljs: async function (
    action: string,
    parameters: Parameters,
    state: ActionMethodState
  ) {
    const { runner, logger } = state;
    //runner.debug('$shelljs', { parameters, prevResult });
    fn_check_params(parameters, { minCount: 1 });

    let shellParams: string[] = [];
    for (const p of parameters) {
      const pValue = await runner.eval(p, state);
      const sValue = String(pValue);
      shellParams.push(sValue);
    }
    const shellCmd = shellParams.shift();
    if (!shellCmd) throw new Error(`shellCmd cannot be empty`);

    const fn = shelljs[shellCmd as keyof typeof shelljs];
    if (typeof fn !== 'function')
      throw new Error(
        `first parameter of $shelljs must match the name of shelljs method`
      );

    let shellRes: ShellString = (fn as Function)(...shellParams);
    // console.log('>>>>>', res)
    // console.log('>>>>>', JSON.stringify(res))
    // console.log('>>>>>', JSON.stringify((res as any).code))
    const s = String(shellRes).trim();

    // logger.log(`[${action}] ` + res );
    logger.log(
      `s: "${s}", stdout: "${shellRes.stdout}", stderr: "${shellRes.stderr}", code: ${shellRes.code}`
    );
    // print(shellParams);
    return s;
  },
};

export default actions;
