/** @format */

import {execute} from '../lisp-like/helpers/exec';
import {validateArgs} from '../../apps/runner/lib/validateArgs';
import {ExecutorFn, Atom, Parameters} from '../lisp-like/helpers/types';
import {State} from '../../apps/runner/lib/state';

export type YarnInstallProdActionConfig = {
  cwd?: string;
  env?: {[key: string]: string};
};

function installDepsCmd() {
  const program = 'yarn';
  const keys = ['--production=true'];
  return `${program} ${keys.join(' ')}`;
}

/**
 * @module $build
 */

/**
 * @module $yarnInstallProd
 */
export const $yarnInstallProd: ExecutorFn = async function (_, args, state) {
  validateArgs(args, {exactCount: 1});

  const {cwd, env} = args[0] as YarnInstallProdActionConfig;

  const options = {
    cwd,
    env,
  };

  const command_line = installDepsCmd();
  const r = await execute(command_line, options, {state});

  return r.stdout;
};

export default $yarnInstallProd;
