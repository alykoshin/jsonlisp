/** @format */

import {validateArgs} from '../../eval/validate-args';
import {ExecutorFn, Parameter, Parameters} from '../../eval/sexpr';
import {State} from '../../eval/environment';

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
