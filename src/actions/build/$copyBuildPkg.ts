/** @format */

import {fn_check_params} from '../../apps/runner/lib/util';
import {
  ActionListExecutor,
  Parameter,
  Parameters,
} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';

/**
 * @module $build
 */

/**
 * @name $copyBuildPkg
 */

export const $copyBuildPkg: ActionListExecutor = async function (
  _,
  args,
  state
) {
  const {runner, logger} = state;
  fn_check_params(args, {exactCount: 0});
  throw new Error(`Not implemented`);
};

export default $copyBuildPkg;
