/** @format */

import fs from 'fs/promises';
import {fn_check_params} from '../../apps/runner/lib/util';
import {
  ActionListExecutor,
  Parameter,
  Parameters,
} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';

type CpActionConfig = {
  source: string | string[];
  dest: string;
  dry?: boolean;
};

/**
 * @module $build
 */

/**
 * @name $cp
 */
export const $cp: ActionListExecutor = async function (_, args, {logger}) {
  fn_check_params(args, {exactCount: 1});
  const {source, dest, dry: dry_} = args[0] as CpActionConfig;
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
  return true;
};

export default $cp;
