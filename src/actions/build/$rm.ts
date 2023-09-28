/** @format */

import fs from 'fs/promises';
import {fn_check_params} from '../../lib/util';
import {ActionMethodState, Parameter, Parameters} from '../../lib/runner';

export async function $rm(
  action: string,
  params: Parameters,
  {evaluate}: ActionMethodState
): Promise<Parameter> {
  // const { runner, logger } = state;
  // fn_check_params(parameters, { minCount: 1 });

  // for (let pf of parameters) {
  //   const pathname = await runner.eval(pf, state);
  //   const sPathname = String(pathname);
  //   logger.debug(`deleting file "${sPathname}"`);

  //   await fs.rm(sPathname);
  // }
  // logger.debug(`deleted ${parameters.length} dirs/files`);
  return evaluate(['delete-file', ...params]);
}

export default $rm;
