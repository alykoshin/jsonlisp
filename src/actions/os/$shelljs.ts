/** @format */

import shelljs, {ShellString} from 'shelljs';
import {fn_check_params} from '../../apps/runner/lib/util';
import {Actions, Parameters, ensureFunction} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';

const TRIM_RESULT = true;
/**
 * @module $shelljs
 */
export const actions: Actions = {
  /**
   * @name $shelljs
   */
  $shelljs: async function (_, args, {evaluate, logger}) {
    //runner.debug('$shelljs', { parameters, prevResult });
    fn_check_params(args, {minCount: 1});

    let shellParams: string[] = [];
    for (const p of args) {
      const pValue = await evaluate(p);
      const sValue = String(pValue);
      shellParams.push(sValue);
    }
    const shellCmd = shellParams.shift();
    if (!shellCmd) throw new Error(`shellCmd can't be empty`);

    // const fn = shelljs[shellCmd as keyof typeof shelljs];
    const fn = shelljs[shellCmd as keyof typeof shelljs];
    ensureFunction(fn, `expect shelljs method`);

    // typecast fn to generic Function to avoid parameters typecheck
    let res: ShellString = (fn as Function)(...shellParams);
    // console.log('>>>>>', res)
    // console.log('>>>>>', JSON.stringify(res))
    // console.log('>>>>>', JSON.stringify((res as any).code))
    // const s = String(shellRes).trim();
    if (TRIM_RESULT) {
      res.stdout = res.stdout?.trim() || '';
      res.stderr = res.stderr?.trim() || '';
    }

    // logger.log(`[${action}] ` + res );
    logger.log(
      [
        // `s: "${s}"`,
        `stdout: "${res.stdout}"`,
        `stderr: "${res.stderr}"`,
        `code: ${res.code}`,
      ].join(', ')
    );
    // print(shellParams);
    return res.stdout;
  },
};

export default actions;
