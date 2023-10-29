/** @format */

import fs from 'fs/promises';
import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {ExecutorFn, Parameter, Parameters} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';
/**
 * @module $build
 */
/**
 * @name $version
 */

export const $rm: ExecutorFn = async function (_, args, {evaluate}) {
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
