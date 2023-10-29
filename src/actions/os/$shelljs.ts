/** @format */

import shelljs, {ShellString} from 'shelljs';
import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {Actions, Parameters, ensureFunction} from '../../apps/runner/lib/types';

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
    validateArgs(args, {minCount: 1});

    let shellParams: string[] = [];
    for (const p of args) {
      const pValue = await evaluate(p);
      const sValue = String(pValue);
      shellParams.push(sValue);
    }
    const shellCmd = shellParams.shift();
    if (!shellCmd) throw new Error(`shellCmd can't be empty`);

    const fn = shelljs[shellCmd as keyof typeof shelljs];
    ensureFunction(fn, `expect shelljs method`);

    logger.log(shellCmd, shellParams);
    // typecast fn to generic Function to avoid parameters typecheck
    let res: ShellString = (fn as Function)(...shellParams);

    if (TRIM_RESULT) {
      res.stdout = res.stdout?.trim() || '';
      res.stderr = res.stderr?.trim() || '';
    }

    if (res.stdout) logger.log(res.stdout);
    if (res.stderr) logger.warn(res.stderr);
    if (res.code !== 0) logger.warn(`Exit code: ${res.code}`);

    return res.stdout;
  },
};

export default actions;
