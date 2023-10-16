/** @format */

import fs from 'fs/promises';
import {fn_check_params} from '../../apps/runner/lib/util';
import {
  ActionListExecutor,
  ActionMethodState,
  Parameter,
  Parameters,
} from '../../apps/runner/lib/types';
/**
 * @module $build
 */
/**
 * @name $version
 */

export const $rm: ActionListExecutor = async function (_, args, {evaluate}) {
  // const { runner, logger } = state;
  // fn_check_params(parameters, { minCount: 1 });

  // for (let pf of parameters) {
  //   const pathname = await runner.eval(pf, state);
  //   const sPathname = String(pathname);
  //   logger.debug(`deleting file "${sPathname}"`);

  //   await fs.rm(sPathname);
  // }
  // logger.debug(`deleted ${parameters.length} dirs/files`);
  return evaluate(['delete-file', ...args]);
};

export default $rm;
