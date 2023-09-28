/** @format */

import fs from 'fs/promises';
import {fn_check_params} from '../../lib/util';
import {ActionMethodState, Parameters} from '../../lib/runner';

type CpActionConfig = {
  source: string | string[];
  dest: string;
  dry?: boolean;
};

export async function $cp(
  action: string,
  params: Parameters,
  {logger}: ActionMethodState
) {
  fn_check_params(params, {exactCount: 1});
  const {source, dest, dry: dry_} = params[0] as CpActionConfig;
  const dry = typeof dry_ !== 'undefined' ? dry_ : false;
  const sources = Array.isArray(source) ? source : [source];

  for (let src of sources) {
    logger.debug(`copying "${src}"`);
    if (dry) {
      logger.debug(`"dry" flag is set; skipping`);
    } else {
      await fs.cp(src, dest);
    }
  }
  logger.debug(`copied ${sources.length} dirs/files`);
}

export default $cp;
