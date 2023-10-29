/** @format */

import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {ExecutorFn, Parameter, Parameters} from '../../apps/runner/lib/types';
import {State} from '../../apps/runner/lib/state';

/**
 * @module $build
 */

/**
 * @name $copyBuildPkg
 */

export const $copyBuildPkg: ExecutorFn = async function (_, args, state) {
  const {runner, logger} = state;
  validateArgs(args, {exactCount: 0});
  throw new Error(`Not implemented`);
};

export default $copyBuildPkg;
